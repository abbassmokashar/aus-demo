const fs = require('fs');
const path = require('path');
const { pages } = require('./seo-config');
const { destinations } = require('./rewrite-webflow-urls');
const { listHtml, repositoryUrl } = require('./rewrite-github-urls');

const root = path.resolve(__dirname, '..');
const sourceByRoute = new Map(Object.entries(destinations).map(([source, route]) => [route, source]));

function decodeText(value) {
  const named = {
    amp: '&', apos: "'", quot: '"', nbsp: ' ', ndash: '–', mdash: '—',
    rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', hellip: '…', bull: '•'
  };
  return String(value)
    .replace(/<br\s*\/?\s*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#(\d+);/g, (_match, number) => String.fromCodePoint(Number(number)))
    .replace(/&#x([\da-f]+);/gi, (_match, number) => String.fromCodePoint(parseInt(number, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => named[name.toLowerCase()] ?? match)
    .replace(/\s+/g, ' ')
    .trim();
}

function sourceForRoute(route) {
  if (route === '/') return 'index.html';
  return sourceByRoute.get(route) || null;
}

function categoryForRoute(route) {
  if (route === '/') return 'Home';
  if (/^\/(?:bachelors-degree|masters-degree|doctorate-in-business-administration|swiss-federal-diploma|programs|find-programs|compare-programs)/.test(route)) return 'Programs';
  if (/^\/(?:admissions|bachelors-admission|masters-admission|doctoral-admission|english-language|international|transfer)/.test(route)) return 'Admissions';
  if (/^\/(?:tuition|cost-calculator)/.test(route)) return 'Tuition & Scholarships';
  if (/^\/(?:careers|alumni)/.test(route)) return 'Careers & Outcomes';
  if (/^\/(?:student|campus|housing|living)/.test(route)) return 'Student Life';
  return 'About';
}

function searchableText(html) {
  let body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] || html;
  body = body
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, ' ');
  const fragments = [];
  for (const match of body.matchAll(/<(?:h[1-6]|p|li|dt|dd|th|td|figcaption|blockquote)\b[^>]*>([\s\S]*?)<\/(?:h[1-6]|p|li|dt|dd|th|td|figcaption|blockquote)>/gi)) {
    const text = decodeText(match[1]);
    if (text && !fragments.includes(text)) fragments.push(text);
  }
  return fragments.join(' ').replace(/\s+/g, ' ').trim();
}

function pageTitle(html, fallback) {
  const heading = decodeText(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '');
  return heading || fallback.replace(/\s*\|[\s\S]*$/, '');
}

function pageEntries() {
  const entries = [];
  for (const [route, meta] of Object.entries(pages)) {
    if (meta.noindex) continue;
    const source = sourceForRoute(route);
    if (!source) throw new Error(`No source page is mapped to ${route}.`);
    const html = fs.readFileSync(path.join(root, source), 'utf8');
    entries.push({
      route,
      title: pageTitle(html, meta.title),
      cat: categoryForRoute(route),
      keys: searchableText(html)
    });
  }

  const faqSource = sourceForRoute('/faq');
  const faqHtml = fs.readFileSync(path.join(root, faqSource), 'utf8');
  for (const match of faqHtml.matchAll(/<button\b[^>]*class="[^"]*faq-q[^"]*"[^>]*>([\s\S]*?)<span\b[^>]*class="faq-icon"[\s\S]*?<\/button>\s*<div\b[^>]*class="[^"]*faq-a[^"]*"[^>]*>([\s\S]*?)<\/div>/gi)) {
    const question = decodeText(match[1]);
    const answer = decodeText(match[2]);
    if (!question) continue;
    entries.push({
      route: `/faq?q=${encodeURIComponent(question)}`,
      title: question,
      cat: 'FAQ',
      keys: `${question} ${answer}`.trim()
    });
  }
  return entries;
}

function findArrayEnd(source, start) {
  let depth = 0;
  let quote = '';
  let escaped = false;
  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === quote) quote = '';
      continue;
    }
    if (character === '"' || character === "'") quote = character;
    else if (character === '[') depth += 1;
    else if (character === ']' && --depth === 0) return index;
  }
  throw new Error('Could not locate the end of the search index.');
}

function serialize(entries, currentFile) {
  return `[${entries.map((entry) => `{title:${JSON.stringify(entry.title)},url:${JSON.stringify(repositoryUrl(entry.route, currentFile))},cat:${JSON.stringify(entry.cat)},keys:${JSON.stringify(entry.keys)}}`).join(',')}]`;
}

function writeFileWithRetry(file, contents) {
  let lastError;
  for (let attempt = 0; attempt < 12; attempt += 1) {
    try {
      fs.writeFileSync(file, contents, 'utf8');
      return;
    } catch (error) {
      lastError = error;
      if (!['UNKNOWN', 'EBUSY', 'EPERM'].includes(error.code)) throw error;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
    }
  }
  throw lastError;
}

function rebuild() {
  const entries = pageEntries();
  let updated = 0;
  for (const file of listHtml(root)) {
    let html = fs.readFileSync(file, 'utf8');
    const declaration = html.indexOf('var idx=');
    if (declaration < 0) continue;
    const start = html.indexOf('[', declaration);
    const end = findArrayEnd(html, start);
    html = html.slice(0, start) + serialize(entries, file) + html.slice(end + 1);
    writeFileWithRetry(file, html);
    updated += 1;
  }
  const pageCount = entries.filter((entry) => entry.cat !== 'FAQ').length;
  const faqCount = entries.length - pageCount;
  console.log(`Rebuilt ${updated} search indexes with ${pageCount} public pages and ${faqCount} FAQ answers.`);
}

rebuild();
