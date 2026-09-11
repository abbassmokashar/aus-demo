const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const skipped = new Set(['.git', '.chrome-backup', 'history', 'node_modules', 'program-media', 'webflow', 'Website Bank of Images']);

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
let changedLabels = 0;
for (const file of listHtml(root)) {
  const source = fs.readFileSync(file, 'utf8');
  const updated = source.replace(/<footer\b[\s\S]*?<\/footer>/gi, (footer) => {
    return footer.replace(/>Contact</g, () => {
      changedLabels += 1;
      return '>Contact Us<';
    });
  });
  if (updated !== source) {
    fs.writeFileSync(file, updated, 'utf8');
    changedFiles += 1;
  }
}

console.log(`Changed ${changedLabels} footer labels across ${changedFiles} HTML files.`);
