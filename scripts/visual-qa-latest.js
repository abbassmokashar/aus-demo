const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const output = path.join(root, '.visual-check', 'latest-current');
fs.mkdirSync(output, { recursive: true });

async function prepare(page, url) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.addStyleTag({ content: '.reveal,.stagger-grid>*{opacity:1!important;transform:none!important}.aus-popup-overlay{display:none!important}' });
  await page.waitForTimeout(700);
  return errors;
}

async function overflow(page) {
  return page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const report = [];
  const targets = [
    { name: 'homepage', url: 'index.html' },
    { name: 'admissions', url: 'admissions.html' },
    { name: 'tuition', url: 'tuition-fees-scholarships.html' },
    { name: 'accreditation', url: 'about/accreditation.html' },
    { name: 'veterans', url: 'veterans-study-in-switzerland.html' },
    { name: 'study', url: 'study-in-switzerland.html' },
    { name: 'brochures', url: 'brochures.html' }
  ];

  for (const viewport of [{ name: 'desktop', width: 1440, height: 1000 }, { name: 'mobile', width: 390, height: 844 }]) {
    for (const item of targets) {
      const page = await browser.newPage({ viewport });
      const errors = await prepare(page, `http://127.0.0.1:8766/${item.url}`);
      await page.locator('main').first().screenshot({ path: path.join(output, `${item.name}-${viewport.name}.png`) });
      report.push({ page: `${item.name}-${viewport.name}`, errors, overflow: await overflow(page) });
      await page.close();
    }
  }

  await browser.close();
  fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
})().catch((error) => { console.error(error); process.exitCode = 1; });
