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
    const page = await browser.newPage();
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

    const state = await page.evaluate(() => {
      const main = document.querySelector('main');
      const finder = document.getElementById('finderPageBody');
      const compareA = document.getElementById('compareA');
      const style = main ? getComputedStyle(main) : null;
      return {
        url: location.href,
        title: document.title,
        readyState: document.readyState,
        documentText: document.body ? document.body.innerText.trim().length : 0,
        preloader: document.querySelectorAll('#preloader').length,
        nav: document.querySelectorAll('#nav').length,
        sidePanel: document.querySelectorAll('#sidePanel').length,
        footer: document.querySelectorAll('footer.site-footer').length,
        mainText: main ? main.innerText.trim().length : 0,
        mainHeight: main ? Math.round(main.getBoundingClientRect().height) : 0,
        mainDisplay: style ? style.display : null,
        mainVisibility: style ? style.visibility : null,
        mainOpacity: style ? style.opacity : null,
        finderText: finder ? finder.innerText.trim().length : null,
        compareOptions: compareA ? compareA.options.length : null,
      };
    });

    const ok = response && response.ok() && !errors.length && state.nav === 1 &&
      state.sidePanel === 1 && state.footer === 1 && state.mainText > 0 &&
      state.mainHeight > 0 && state.mainDisplay !== 'none' &&
      state.mainVisibility !== 'hidden' && state.mainOpacity !== '0' &&
      (state.finderText === null || state.finderText > 0) &&
      (state.compareOptions === null || state.compareOptions > 1);

    if (!ok) failed = true;
    console.log(JSON.stringify({ target, ok, status: response && response.status(), timeline, state, errors }));
    await page.close();
  }

  await browser.close();
  if (failed) process.exitCode = 1;
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
