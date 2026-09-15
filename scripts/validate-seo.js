const fs = require('fs');
const path = require('path');
const { destinations } = require('./rewrite-webflow-urls');
const { routeForFile } = require('./apply-seo-metadata');
const { pages, site } = require('./seo-config');

const root = path.resolve(__dirname, '..');
const skipped = new Set(['.git', '.chrome-backup', 'history', 'node_modules', 'program-media', 'webflow', 'Website Bank of Images', 'bank of images']);
const failures = [];

function listHtml(directory, output = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && skipped.has(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) listHtml(full, output);
    else if (entry.name.endsWith('.html')) output.push(full);
  }
  return output;
}

function count(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

let htmlFiles = 0;
let jsonLdBlocks = 0;
for (const file of listHtml(root)) {
  htmlFiles += 1;
  const relative = path.relative(root, file).replace(/\\/g, '/');
  const route = routeForFile(file);
  const meta = route && pages[route];
  const source = fs.readFileSync(file, 'utf8');
  const canonical = route === '/' ? `${site.baseUrl}/` : `${site.baseUrl}${route}`;
  if (!meta) failures.push(`${relative}: missing configured metadata`);
  if (count(source, /<meta\b[^>]*name="description"/gi) !== 1) failures.push(`${relative}: description count is not 1`);
  if (count(source, /<link\b[^>]*rel="canonical"/gi) !== 1) failures.push(`${relative}: canonical count is not 1`);
  if (!source.includes(`rel="canonical" href="${canonical}"`)) failures.push(`${relative}: wrong canonical URL`);
  if (count(source, /<meta\b[^>]*property="og:title"/gi) !== 1) failures.push(`${relative}: Open Graph title count is not 1`);
  if (count(source, /<meta\b[^>]*name="twitter:card"/gi) !== 1) failures.push(`${relative}: Twitter card count is not 1`);
  if (meta && meta.noindex && !/name="robots" content="noindex,follow"/i.test(source)) failures.push(`${relative}: noindex is missing`);
  if (meta && !meta.noindex && !/name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"/i.test(source)) failures.push(`${relative}: index directives are missing`);
  const blocks = [...source.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  if (blocks.length !== 1) failures.push(`${relative}: JSON-LD count is not 1`);
  for (const block of blocks) {
    jsonLdBlocks += 1;
    try { JSON.parse(block[1]); } catch (error) { failures.push(`${relative}: invalid JSON-LD (${error.message})`); }
  }
}

const expectedUrls = new Set(Object.entries(pages).filter(([, meta]) => !meta.noindex).map(([route]) => route === '/' ? `${site.baseUrl}/` : `${site.baseUrl}${route}`));
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const sitemapUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].replace(/&amp;/g, '&')));
for (const url of expectedUrls) if (!sitemapUrls.has(url)) failures.push(`sitemap.xml: missing ${url}`);
for (const url of sitemapUrls) if (!expectedUrls.has(url)) failures.push(`sitemap.xml: unexpected ${url}`);
if (!fs.readFileSync(path.join(root, 'robots.txt'), 'utf8').includes(`Sitemap: ${site.baseUrl}/sitemap.xml`)) failures.push('robots.txt: sitemap declaration is missing');
if (!fs.readFileSync(path.join(root, 'llms.txt'), 'utf8').includes(site.baseUrl)) failures.push('llms.txt: canonical host is missing');
if (Object.keys(destinations).some((source) => !pages[destinations[source]])) failures.push('seo-config.js: one or more Webflow routes have no metadata');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`SEO validation passed: ${htmlFiles} HTML files, ${jsonLdBlocks} valid JSON-LD blocks and ${sitemapUrls.size} canonical sitemap URLs.`);
