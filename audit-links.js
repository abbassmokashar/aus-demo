// Whole-site link, shared chrome, markup nesting, and inline-script audit.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = __dirname;
const skippedDirectories = new Set([
  'history', '.chrome-backup', 'browser-check', 'admissions-policy-render',
  'navigation-docx-render', 'skills', 'news-images', 'instagram', 'partner-logos',
]);

function htmlFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && skippedDirectories.has(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...htmlFiles(full));
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function occurrences(source, pattern) {
  return (source.match(pattern) || []).length;
}

function elementEnd(source, tag, marker) {
  const open = new RegExp('<' + tag + '\\b[^>]*' + marker + '[^>]*>', 'g').exec(source);
  if (!open) return -1;
  const tags = new RegExp('</?' + tag + '\\b[^>]*>', 'g');
  tags.lastIndex = open.index;
  let depth = 0;
  let match;
  while ((match = tags.exec(source))) {
    depth += match[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return tags.lastIndex;
  }
  return -1;
}

const files = htmlFiles(root);
let failures = 0;

function fail(file, message) {
  failures += 1;
  if (failures <= 60) console.log('BAD', path.relative(root, file).split(path.sep).join('/'), '-', message);
}

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  const expected = [
    ['preloader', /id="preloader"/g],
    ['header navigation', /<nav\b[^>]*id="nav"/g],
    ['side panel', /id="sidePanel"/g],
    ['footer', /<footer\b[^>]*class="[^"]*site-footer/g],
  ];
  for (const [label, pattern] of expected) {
    const count = occurrences(source, pattern);
    if (count !== 1) fail(file, label + ' count is ' + count);
  }

  const navStart = source.indexOf('<nav class="aus-nav" id="nav">');
  const mainStart = source.indexOf('<main');
  const footerStart = source.indexOf('<footer class="site-footer">');
  const preloaderEnd = elementEnd(source, 'div', 'id="preloader"');
  const panelEnd = elementEnd(source, 'div', 'id="sidePanel"');
  if (preloaderEnd < 0 || (navStart >= 0 && preloaderEnd > navStart)) {
    fail(file, 'preloader is not closed before the header navigation');
  }
  const contentStart = mainStart >= 0 ? mainStart : footerStart;
  if (panelEnd < 0 || (contentStart >= 0 && panelEnd > contentStart)) {
    fail(file, 'side panel is not closed before page content');
  }

  const markup = source.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  for (const match of markup.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const original = match[1];
    if (/^(?:[a-z]+:|#|\/\/|data:)/i.test(original)) continue;
    const clean = original.split('#')[0].split('?')[0];
    if (!clean) continue;
    let decoded;
    try { decoded = decodeURIComponent(clean); }
    catch (_) { decoded = clean; }
    const resolved = clean.startsWith('/')
      ? path.join(root, decoded.replace(/^\/+/, ''))
      : path.resolve(path.dirname(file), decoded);
    if (!fs.existsSync(resolved)) fail(file, 'unresolved local link: ' + original);
  }

  let scriptNumber = 0;
  for (const match of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    scriptNumber += 1;
    if (/src=|application\/ld\+json/i.test(match[1])) continue;
    try { new vm.Script(match[2], { filename: file + '#' + scriptNumber }); }
    catch (error) { fail(file, 'inline script ' + scriptNumber + ': ' + error.message); }
  }
}

if (failures) {
  console.log(failures + ' audit failure' + (failures === 1 ? '' : 's'));
  process.exitCode = 1;
} else {
  console.log('All ' + files.length + ' pages have shared chrome, valid nesting, resolvable local links, and parseable inline scripts.');
}
