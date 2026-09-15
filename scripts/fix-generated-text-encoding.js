const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const skipped = new Set(['.git', '.chrome-backup', 'history', 'node_modules', 'program-media', 'webflow', 'Website Bank of Images', 'bank of images']);
const replacements = new Map([
  ['Â·', '·'],
  ['â€”', '—']
]);

function listHtml(directory, output = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && skipped.has(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) listHtml(full, output);
    else if (entry.name.endsWith('.html')) output.push(full);
  }
  return output;
}

let changedFiles = 0;
let changedTokens = 0;
for (const file of listHtml(root)) {
  const source = fs.readFileSync(file, 'utf8');
  let updated = source;
  for (const [broken, corrected] of replacements) {
    updated = updated.replaceAll(broken, () => {
      changedTokens += 1;
      return corrected;
    });
  }
  if (updated !== source) {
    fs.writeFileSync(file, updated, 'utf8');
    changedFiles += 1;
  }
}

console.log(`Corrected ${changedTokens} generated-text encoding tokens across ${changedFiles} HTML files.`);
