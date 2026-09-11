const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const packageRoots = [
  path.join(root, 'webflow', 'homepage'),
  path.join(root, 'webflow', 'pages')
];
const failures = [];
let widgetCount = 0;
let inlineScriptCount = 0;
let largest = { file: '', characters: 0 };
let searchIndexCount = 0;
const requestedProgramRoutes = [
  '/bachelors-degree/accounting',
  '/masters-degree/finance',
  '/doctorate-in-business-administration',
  '/swiss-federal-diploma-business-administration'
];
const foundProgramRoutes = new Set();

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (!/^\d{2}-.*\.html$/.test(entry.name)) continue;

    widgetCount += 1;
    const source = fs.readFileSync(fullPath, 'utf8');
    const relative = path.relative(root, fullPath).replace(/\\/g, '/');
    if (source.length > largest.characters) largest = { file: relative, characters: source.length };
    if (source.length >= 50000) failures.push(`${relative} is ${source.length} characters.`);
    if (/\/programs\/(?:bachelors|masters|doctorate|federal-diploma)/i.test(source)) {
      failures.push(`${relative} contains a legacy /programs/ degree route.`);
    }
    requestedProgramRoutes.forEach((route) => {
      if (source.includes(route)) foundProgramRoutes.add(route);
    });

    for (const tag of ['script', 'style']) {
      const opens = (source.match(new RegExp(`<${tag}\\b`, 'gi')) || []).length;
      const closes = (source.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
      if (opens !== closes) failures.push(`${relative} has unbalanced ${tag} tags (${opens}/${closes}).`);
    }

    for (const match of source.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)) {
      inlineScriptCount += 1;
      try {
        new Function(match[1]);
      } catch (error) {
        failures.push(`${relative} contains invalid JavaScript: ${error.message}`);
      }
    }

    for (const match of source.matchAll(/var idx=(\[[^\n]+\]);/g)) {
      searchIndexCount += 1;
      try {
        const index = JSON.parse(match[1]);
        if (index.some((item) => !item)) failures.push(`${relative} contains an empty search-index entry.`);
      } catch (error) {
        failures.push(`${relative} contains an unreadable search index: ${error.message}`);
      }
    }
  }
}

packageRoots.forEach(walk);
requestedProgramRoutes.forEach((route) => {
  if (!foundProgramRoutes.has(route)) failures.push(`Webflow output is missing ${route}.`);
});

if (failures.length) {
  failures.forEach((failure) => console.error(failure));
  process.exit(1);
}

console.log(`Validated ${widgetCount} Webflow Code Embed widgets.`);
console.log(`Validated ${inlineScriptCount} inline scripts and ${searchIndexCount} search indexes.`);
console.log(`Largest widget: ${largest.file} (${largest.characters} characters).`);
