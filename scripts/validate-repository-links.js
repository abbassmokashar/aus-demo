const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const skipped = new Set(['.chrome-backup', '.git', '.visual-check', 'history', 'node_modules', 'webflow']);

function listHtml(directory, output = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && skipped.has(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) listHtml(full, output);
    else if (entry.name.endsWith('.html')) output.push(full);
  }
  return output;
}

function valuesFrom(source) {
  const values = [];
  for (const pattern of [
    /(?:href|action|src|poster)=(['"])([^'"]+)\1/g,
    /\b(?:url|href):(['"])([^'"]+)\1/g,
    /(?:window\.)?location(?:\.href)?\s*=\s*(['"])([^'"]+)\1/g
  ]) {
    for (const match of source.matchAll(pattern)) values.push(match[2]);
  }
  return values;
}

const files = listHtml(root);
const broken = [];
let checked = 0;
let rootAbsolute = 0;

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  for (const value of valuesFrom(source)) {
    if (/^\/(?!\/)/.test(value)) {
      rootAbsolute += 1;
      broken.push(`${path.relative(root, file)} -> ${value} (root-absolute)`);
      continue;
    }
    if (/^(?:https?:|mailto:|tel:|javascript:|#|\/\/)/i.test(value)) continue;
    const isHtml = /\.html(?:[?#]|$)/i.test(value);
    const isDirectoryRoute = /\/(?:[?#]|$)/.test(value);
    const isAsset = /\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#]|$)/i.test(value);
    if (!isHtml && !isDirectoryRoute && !isAsset) continue;
    checked += 1;
    const pathname = value.split(/[?#]/, 1)[0];
    let target = path.resolve(path.dirname(file), ...pathname.split('/'));
    if (isDirectoryRoute && !isAsset) target = path.join(target, 'index.html');
    if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
      broken.push(`${path.relative(root, file)} -> ${value}`);
    }
  }
}

console.log(`HTML files: ${files.length}`);
console.log(`Relative HTML references checked: ${checked}`);
console.log(`Root-absolute internal references: ${rootAbsolute}`);
console.log(`Broken internal references: ${broken.length}`);
if (broken.length) {
  console.error(broken.slice(0, 100).join('\n'));
  process.exitCode = 1;
}
