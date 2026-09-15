const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { destinations } = require('./rewrite-webflow-urls');

const root = path.resolve(__dirname, '..');
const canonicalSources = Object.keys(destinations).map((relative) => path.join(root, ...relative.split('/')));
const stats = {
  pages: canonicalSources.length,
  totalBytes: 0,
  totalStyleBytes: 0,
  totalInlineScriptBytes: 0,
  totalSearchIndexBytes: 0,
  searchIndexPages: 0,
  duplicateHeadingPages: [],
  duplicateIdPages: [],
  repeatedPreloaderCssPages: [],
  promoPopupPages: [],
  mojibakePages: [],
  heroImagesLazy: [],
  missingAltImages: 0,
  emptyAltImages: 0,
  localImageReferences: [],
  inlineStyleAttributes: 0,
  importantDeclarations: 0,
  largestPages: [],
  repeatedStyleBlocks: [],
  repeatedScriptBlocks: []
};
const styleHashes = new Map();
const scriptHashes = new Map();

function addHash(map, source, file) {
  const normalized = source.replace(/\s+/g, ' ').trim();
  if (normalized.length < 200) return;
  const hash = crypto.createHash('sha256').update(normalized).digest('hex');
  if (!map.has(hash)) map.set(hash, { bytes: normalized.length, files: [] });
  map.get(hash).files.push(file);
}

function arrayEnd(source, start) {
  let depth = 0;
  let quote = '';
  let escaped = false;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = '';
      continue;
    }
    if (char === '"' || char === "'") quote = char;
    else if (char === '[') depth += 1;
    else if (char === ']' && --depth === 0) return index;
  }
  return -1;
}

for (const file of canonicalSources) {
  const relative = path.relative(root, file).replace(/\\/g, '/');
  const html = fs.readFileSync(file, 'utf8');
  const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  stats.totalBytes += html.length;
  stats.largestPages.push({ file: relative, bytes: html.length });

  const h1Count = (html.match(/<h1\b/gi) || []).length;
  if (h1Count > 1) stats.duplicateHeadingPages.push({ file: relative, count: h1Count });

  const ids = [...markup.matchAll(/\bid="([^"]+)"/gi)].map((match) => match[1]);
  const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicates.length) stats.duplicateIdPages.push({ file: relative, ids: duplicates });

  if ((html.match(/\.aus-preloader\.is-hidden\s*\{/g) || []).length > 1) stats.repeatedPreloaderCssPages.push(relative);
  if (html.includes('id="ausPopup"')) stats.promoPopupPages.push(relative);
  if (/[ÂÃ]|â(?:€|†|€”|€™|€œ|€˜)/.test(html)) stats.mojibakePages.push(relative);

  for (const match of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    stats.totalStyleBytes += match[1].length;
    stats.importantDeclarations += (match[1].match(/!important/g) || []).length;
    addHash(styleHashes, match[1], relative);
  }
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (!/\bsrc\s*=/.test(match[1]) && !/application\/ld\+json/i.test(match[1])) {
      stats.totalInlineScriptBytes += match[2].length;
      addHash(scriptHashes, match[2], relative);
    }
  }

  const searchStart = html.indexOf('var idx=');
  if (searchStart >= 0) {
    const start = html.indexOf('[', searchStart);
    const end = arrayEnd(html, start);
    if (end > start) {
      stats.searchIndexPages += 1;
      stats.totalSearchIndexBytes += end - start + 1;
    }
  }

  stats.inlineStyleAttributes += (html.match(/\sstyle="/gi) || []).length;
  for (const image of markup.matchAll(/<img\b([^>]*)>/gi)) {
    const attributes = image[1];
    const alt = attributes.match(/\balt="([^"]*)"/i);
    if (!alt) stats.missingAltImages += 1;
    else if (!alt[1].trim()) stats.emptyAltImages += 1;
    const src = attributes.match(/\bsrc="([^"]+)"/i)?.[1];
    if (src && !/^(?:https?:|data:|\/\/)/i.test(src)) stats.localImageReferences.push({ file: relative, src });
  }

  const heroImage = markup.match(/<(?:header|div)\b[^>]*class="[^"]*(?:hero|page-hero)[^"]*"[\s\S]*?<img\b([^>]*)>/i);
  if (heroImage && /\bloading="lazy"/i.test(heroImage[1])) stats.heroImagesLazy.push(relative);
}

function repeated(map) {
  return [...map.values()]
    .filter((entry) => entry.files.length > 1)
    .sort((a, b) => (b.bytes * b.files.length) - (a.bytes * a.files.length))
    .slice(0, 12);
}

stats.repeatedStyleBlocks = repeated(styleHashes);
stats.repeatedScriptBlocks = repeated(scriptHashes);
stats.largestPages.sort((a, b) => b.bytes - a.bytes);
stats.largestPages = stats.largestPages.slice(0, 10);
stats.localImageReferences = stats.localImageReferences.slice(0, 100);

console.log(JSON.stringify(stats, null, 2));
