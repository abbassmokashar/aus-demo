const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const output = path.join(root, '.visual-check', 'latest');
fs.mkdirSync(output, { recursive: true });

async function routeLocalAssets(page) {
  await page.route('https://abbassmokashar.github.io/aus-demo/campus-facilities-assets/**', async (route) => {
    const name = decodeURIComponent(new URL(route.request().url()).pathname.split('/').pop());
    await route.fulfill({ path: path.join(root, 'campus-facilities-assets', name) });
  });
  await page.route('https://abbassmokashar.github.io/aus-demo/aviation-assets/**', async (route) => {
    const name = decodeURIComponent(new URL(route.request().url()).pathname.split('/').pop());
    await route.fulfill({ path: path.join(root, 'aviation-assets', name) });
  });
}

async function prepare(page, url) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await routeLocalAssets(page);
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.addStyleTag({ content: '.reveal,.stagger-grid>*{opacity:1!important;transform:none!important}.aus-popup-overlay{display:none!important}' });
  await page.waitForTimeout(1100);
  return errors;
}

async function overflow(page) {
  return page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const report = [];

  for (const viewport of [{ name: 'desktop', width: 1440, height: 1000 }, { name: 'mobile', width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    const errors = await prepare(page, 'http://127.0.0.1:8766/cost-calculator.html');
    await page.locator('#calcLeadGate').screenshot({ path: path.join(output, `calculator-gate-${viewport.name}.png`) });
    const requiredBlocked = await page.locator('#costCalculatorAccessForm').evaluate((form) => !form.checkValidity());
    await page.locator('#calcLeadFirstName').fill('Preview');
    await page.locator('#calcLeadLastName').fill('Visitor');
    await page.locator('#calcLeadEmail').fill('preview@example.com');
    await page.locator('#calcLeadPhone').fill('+41 00 000 00 00');
    await page.locator('#calcLeadCountry').selectOption({ label: 'Switzerland' });
    await page.locator('#calcLeadDegree').selectOption({ label: "Master's Degree" });
    await page.locator('#calcLeadProgram').selectOption({ label: 'Aviation Management' });
    await page.locator('#calcLeadIntake').selectOption({ label: 'September 2027' });
    await page.locator('#costCalculatorAccessForm button[type=submit]').click();
    await page.waitForTimeout(900);
    const unlocked = await page.locator('#calcLeadGate').evaluate((el) => el.classList.contains('is-hidden'));
    report.push({ page: `calculator-${viewport.name}`, errors, overflow: await overflow(page), requiredBlocked, unlocked });
    await page.close();
  }

  const program = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const programErrors = await prepare(program, 'http://127.0.0.1:8766/masters-degree/finance/');
  await program.locator('.program-admissions').screenshot({ path: path.join(output, 'program-admissions-desktop.png') });
  const applyNowOutsideHeader = await program.locator('a:not(.aus-nav-apply)').filter({ hasText: /^Apply Now$/ }).count();
  report.push({ page: 'program-admissions-desktop', errors: programErrors, overflow: await overflow(program), applyNowOutsideHeader });
  await program.close();

  const programMobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const programMobileErrors = await prepare(programMobile, 'http://127.0.0.1:8766/masters-degree/finance/');
  await programMobile.locator('.program-admissions').screenshot({ path: path.join(output, 'program-admissions-mobile.png') });
  report.push({ page: 'program-admissions-mobile', errors: programMobileErrors, overflow: await overflow(programMobile) });
  await programMobile.close();

  for (const item of [
    { name: 'homepage-partner', url: 'http://127.0.0.1:8766/index.html', selector: '.reasons-partner-lockup' },
    { name: 'tiffin-hero', url: 'http://127.0.0.1:8766/about/academic-partners/tiffin-university.html', selector: '.hero' },
    { name: 'campus-facilities', url: 'http://127.0.0.1:8766/campus-facilities.html', selector: 'main' },
    { name: 'campus-experience-mobile', url: 'http://127.0.0.1:8766/student-life/campus.html', selector: '[data-chapter="04"]', mobile: true },
    { name: 'bachelor-aviation', url: 'http://127.0.0.1:8766/bachelors-degree/aviation-management/', selector: '.hero' },
    { name: 'master-aviation', url: 'http://127.0.0.1:8766/masters-degree/aviation-management/', selector: '.hero' }
  ]) {
    const page = await browser.newPage({ viewport: item.mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 } });
    const errors = await prepare(page, item.url);
    const locator = page.locator(item.selector).first();
    await locator.scrollIntoViewIfNeeded();
    await locator.screenshot({ path: path.join(output, `${item.name}.png`) });
    report.push({ page: item.name, errors, overflow: await overflow(page), images: await locator.locator('img').count() });
    await page.close();
  }

  await browser.close();
  fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
})().catch((error) => { console.error(error); process.exitCode = 1; });
