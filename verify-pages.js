const { chromium } = require('playwright');

const base = process.argv[2] || 'http://127.0.0.1:4173/';
const defaultTargets = [
  'index.html',
  'admissions/bachelors.html',
  'admissions/bachelors-requirements.html',
  'find-programs.html',
  'compare-programs.html',
];
const targets = process.argv.slice(3).length ? process.argv.slice(3) : defaultTargets;

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  let failed = false;

  for (const target of targets) {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => {
      const requestUrl = new URL(route.request().url());
      if (requestUrl.origin === new URL(base).origin) route.continue();
      else route.abort();
    });

    const response = await page.goto(new URL(target, base).href, {
      waitUntil: 'domcontentloaded',
    });
    const timeline = [];
    for (const delay of [0, 250, 550, 350, 600]) {
      if (delay) await page.waitForTimeout(delay);
      timeline.push(await page.evaluate(() => ({
        elapsed: performance.now(),
        bodyChildren: document.body ? document.body.children.length : -1,
        bodyText: document.body ? document.body.innerText.trim().length : -1,
        preloaderParent: document.getElementById('preloader')?.parentElement?.tagName || null,
      })));
    }

    let finderComparison = null;
    if (target === 'find-programs.html') {
      await page.locator('.finder-card').first().click();
      await page.waitForTimeout(280);
      await page.locator('.finder-card').first().click();
      await page.locator('#finderNext').click();
      await page.locator('.finder-card').first().click();
      await page.waitForTimeout(280);
      await page.locator('.finder-card').first().click();
      await page.waitForTimeout(280);
      await page.locator('.finder-card').first().click();
      await page.locator('#finderNext').click();
      await page.locator('.finder-card').first().click();
      await page.waitForTimeout(320);
      await page.locator('#finderCompareBtn').click();
      await page.selectOption('#finderCompareA', '0');
      await page.selectOption('#finderCompareB', '1');
      finderComparison = await page.evaluate(() => ({
        visible: document.getElementById('finderCompareOverlay')?.classList.contains('is-visible') || false,
        optionsA: document.getElementById('finderCompareA')?.options.length || 0,
        rows: document.querySelectorAll('#finderCompareTableBody tr').length,
      }));
    }

    const state = await page.evaluate(() => {
      const main = document.querySelector('main');
      const surface = main || document.body;
      const finder = document.getElementById('finderPageBody');
      const compareA = document.getElementById('compareA');
      const navLinks = document.querySelector('.aus-nav-links');
      const search = document.getElementById('siteSearch');
      const contact = document.querySelector('.aus-nav-contact');
      const style = surface ? getComputedStyle(surface) : null;
      const navRect = navLinks?.getBoundingClientRect();
      const searchRect = search?.getBoundingClientRect();
      const contactRect = contact?.getBoundingClientRect();
      return {
        url: location.href,
        title: document.title,
        readyState: document.readyState,
        documentText: document.body ? document.body.innerText.trim().length : 0,
        preloader: document.querySelectorAll('#preloader').length,
        nav: document.querySelectorAll('#nav').length,
        sidePanel: document.querySelectorAll('#sidePanel').length,
        footer: document.querySelectorAll('footer.site-footer').length,
        mainText: surface ? surface.innerText.trim().length : 0,
        mainHeight: surface ? Math.round(surface.getBoundingClientRect().height) : 0,
        mainDisplay: style ? style.display : null,
        mainVisibility: style ? style.visibility : null,
        mainOpacity: style ? style.opacity : null,
        finderText: finder ? finder.innerText.trim().length : null,
        finderWidth: finder ? Math.round(finder.getBoundingClientRect().width) : null,
        compareOptions: compareA ? compareA.options.length : null,
        navToSearchGap: navRect && searchRect ? Math.round(searchRect.left - navRect.right) : null,
        searchToContactGap: searchRect && contactRect ? Math.round(contactRect.left - searchRect.right) : null,
        rankingBadges: [...document.querySelectorAll('img[alt^="AUS ranked"]')].map(image => {
          const rect = image.getBoundingClientRect();
          return [Math.round(rect.width), Math.round(rect.height)];
        }),
      };
    });

    const badgesMatch = state.rankingBadges.length !== 2 ||
      (state.rankingBadges[0][0] === state.rankingBadges[1][0] &&
       state.rankingBadges[0][1] === state.rankingBadges[1][1]);

    const ok = response && response.ok() && !errors.length && state.nav === 1 &&
      state.sidePanel === 1 && state.footer === 1 && state.mainText > 0 &&
      state.mainHeight > 0 && state.mainDisplay !== 'none' &&
      state.mainVisibility !== 'hidden' && state.mainOpacity !== '0' &&
      (state.finderText === null || state.finderText > 0) &&
      (state.compareOptions === null || state.compareOptions > 1) &&
      badgesMatch &&
      (finderComparison === null || (finderComparison.visible && finderComparison.optionsA > 2 && finderComparison.rows > 1));

    if (!ok) failed = true;
    console.log(JSON.stringify({ target, ok, status: response && response.status(), timeline, state, finderComparison, errors }));
    await page.close();
  }

  await browser.close();
  if (failed) process.exitCode = 1;
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
