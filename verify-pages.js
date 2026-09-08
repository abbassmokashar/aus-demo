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
      const admissionSections = [...document.querySelectorAll('.adm-page > section')];
      const admissionTextColors = [...document.querySelectorAll('.adm-page *')]
        .filter(element => element.children.length === 0 && element.textContent.trim() && getComputedStyle(element).display !== 'none')
        .map(element => getComputedStyle(element).color);
      const activeFaq = document.querySelector('.faq-pill.is-active')?.getAttribute('data-filter') || null;
      const visibleFaqGroups = [...document.querySelectorAll('.faq-group')]
        .filter(group => getComputedStyle(group).display !== 'none')
        .map(group => group.getAttribute('data-group'));
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
        admissionSectionBackgrounds: admissionSections.map(section => getComputedStyle(section).backgroundColor),
        admissionTextColors: [...new Set(admissionTextColors)],
        admissionImages: document.querySelectorAll('.adm-page img').length,
        admissionPhotoLinks: document.querySelectorAll('.adm-photo-card[href^="#"]').length,
        admissionsFaqLink: document.querySelector('.accordion-item[data-panel-key="admissions"] a[href*="category=admissions"]')?.getAttribute('href') || null,
        activeFaq,
        visibleFaqGroups,
        headerActions: {
          search: Boolean(document.getElementById('siteSearch')?.getBoundingClientRect().width),
          myPrograms: Boolean(document.querySelector('.aus-nav-programs')?.getBoundingClientRect().width),
          talk: Boolean(document.querySelector('.aus-nav-talk')?.getBoundingClientRect().width),
          apply: Boolean(document.querySelector('.aus-nav-apply')?.getBoundingClientRect().width),
          applyBackground: document.querySelector('.aus-nav-apply') ? getComputedStyle(document.querySelector('.aus-nav-apply')).backgroundColor : null,
          talkBackground: document.querySelector('.aus-nav-talk') ? getComputedStyle(document.querySelector('.aus-nav-talk')).backgroundColor : null,
          overflow: document.getElementById('nav') ? document.getElementById('nav').scrollWidth > document.documentElement.clientWidth : null,
        },
      };
    });

    await page.setViewportSize({ width: 320, height: 844 });
    await page.waitForTimeout(80);
    await page.locator('#siteSearchInput').fill('business');
    await page.waitForTimeout(80);
    const mobileHeader = await page.evaluate(() => {
      const centers = selectors => selectors.map(selector => document.querySelector(selector)).filter(Boolean).map(element => {
        const rect = element.getBoundingClientRect();
        return Math.round(rect.top + rect.height / 2);
      });
      const headerRow = centers(['.aus-wordmark', '#siteSearch', '.aus-nav-talk', '.aus-nav-apply', '#menuToggle']);
      const drop = document.getElementById('siteSearchDrop')?.getBoundingClientRect();
      const rowRects = ['.aus-wordmark', '#siteSearch', '.aus-nav-talk', '.aus-nav-apply', '#menuToggle']
        .map(selector => document.querySelector(selector)?.getBoundingClientRect())
        .filter(Boolean);
      const talk = document.querySelector('.aus-nav-talk');
      return {
        search: Boolean(document.getElementById('siteSearch')?.getBoundingClientRect().width),
        myPrograms: Boolean(document.querySelector('.aus-nav-programs')?.getBoundingClientRect().width),
        talk: Boolean(document.querySelector('.aus-nav-talk')?.getBoundingClientRect().width),
        apply: Boolean(document.querySelector('.aus-nav-apply')?.getBoundingClientRect().width),
        applyBackground: document.querySelector('.aus-nav-apply') ? getComputedStyle(document.querySelector('.aus-nav-apply')).backgroundColor : null,
        talkBackground: document.querySelector('.aus-nav-talk') ? getComputedStyle(document.querySelector('.aus-nav-talk')).backgroundColor : null,
        menuVisible: Boolean(document.getElementById('menuToggle')?.getBoundingClientRect().width),
        singleRow: headerRow.length === 5 && Math.max(...headerRow) - Math.min(...headerRow) <= 2,
        noOverlap: rowRects.length === 5 && rowRects.every((rect,index) => index === rowRects.length - 1 || rect.right <= rowRects[index + 1].left + .5),
        talkFullLabel: document.querySelector('.aus-nav-talk .aus-nav-action-full')?.textContent.trim() === 'Talk to Admissions' && getComputedStyle(document.querySelector('.aus-nav-talk .aus-nav-action-full')).display !== 'none',
        talkFits: Boolean(talk) && talk.scrollWidth <= talk.clientWidth,
        searchResultsCentered: Boolean(drop) && !document.getElementById('siteSearchDrop').hidden &&
          Math.abs((drop.left + drop.right) / 2 - innerWidth / 2) <= 1 && drop.left >= 8 && drop.right <= innerWidth - 8,
        overflow: document.getElementById('nav') ? document.getElementById('nav').scrollWidth > document.documentElement.clientWidth : null,
      };
    });
    await page.locator('#menuToggle').click();
    await page.waitForTimeout(80);
    const mobileMenuOpen = await page.evaluate(() => document.documentElement.classList.contains('panel-open') && document.getElementById('menuToggle')?.getAttribute('aria-expanded') === 'true');
    await page.locator('#sidePanelClose').click();

    const badgesMatch = state.rankingBadges.length !== 2 ||
      (state.rankingBadges[0][0] === state.rankingBadges[1][0] &&
       state.rankingBadges[0][1] === state.rankingBadges[1][1]);

    const admissionsPaletteOk = !state.admissionSectionBackgrounds.length || (
      state.admissionSectionBackgrounds.every(color => color === 'rgb(255, 255, 255)' || color === 'rgb(241, 241, 239)') &&
      state.admissionTextColors.every(color => ['rgb(255, 255, 255)', 'rgb(34, 41, 95)', 'rgb(190, 31, 61)'].includes(color)) &&
      state.admissionImages >= 4 && state.admissionPhotoLinks === 3
    );
    const faqRouteOk = state.activeFaq === null || (state.activeFaq === 'admissions' && state.visibleFaqGroups.length === 1 && state.visibleFaqGroups[0] === 'admissions');
    const headerActionsOk = [state.headerActions, mobileHeader].every(actions =>
      actions.search && !actions.myPrograms && actions.talk && actions.apply && !actions.overflow &&
      actions.applyBackground === 'rgb(190, 31, 61)' && actions.talkBackground !== 'rgb(190, 31, 61)'
    ) && mobileHeader.singleRow && mobileHeader.noOverlap && mobileHeader.talkFullLabel && mobileHeader.talkFits && mobileHeader.searchResultsCentered && mobileHeader.menuVisible && mobileMenuOpen;
    const ok = response && response.ok() && !errors.length && state.nav === 1 &&
      state.sidePanel === 1 && state.footer === 1 && state.mainText > 0 &&
      state.mainHeight > 0 && state.mainDisplay !== 'none' &&
      state.mainVisibility !== 'hidden' && state.mainOpacity !== '0' &&
      (state.finderText === null || state.finderText > 0) &&
      (state.compareOptions === null || state.compareOptions > 1) &&
      badgesMatch &&
      admissionsPaletteOk && faqRouteOk && headerActionsOk && state.admissionsFaqLink !== null &&
      (finderComparison === null || (finderComparison.visible && finderComparison.optionsA > 2 && finderComparison.rows > 1));

    if (!ok) failed = true;
    console.log(JSON.stringify({ target, ok, status: response && response.status(), timeline, state, mobileHeader, mobileMenuOpen, finderComparison, errors }));
    await page.close();
  }

  await browser.close();
  if (failed) process.exitCode = 1;
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
