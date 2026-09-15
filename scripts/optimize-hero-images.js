const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const skipped = new Set(['.git', '.chrome-backup', 'history', 'node_modules', 'program-media', 'webflow', 'Website Bank of Images', 'bank of images']);

function listHtml(directory, output = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && skipped.has(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) listHtml(full, output);
    else if (entry.name.endsWith('.html')) output.push(full);
  }
  return output;
}

function prioritize(tag) {
  let updated = tag.replace(/\sloading="lazy"/i, ' loading="eager"');
  if (!/\sloading=/i.test(updated)) updated = updated.replace(/^<img\b/i, '<img loading="eager"');
  if (!/\sfetchpriority=/i.test(updated)) updated = updated.replace(/^<img\b/i, '<img fetchpriority="high"');
  return updated;
}

let changedFiles = 0;
let changedImages = 0;
for (const file of listHtml(root)) {
  const source = fs.readFileSync(file, 'utf8');
  const updated = source.replace(
    /(<div\b[^>]*class="[^"]*(?:hero-bg|hero-mob-img|hero-media)[^"]*"[^>]*>[\s\S]*?)(<img\b[^>]*>)/gi,
    (whole, prefix, image) => {
      const optimized = prioritize(image);
      if (optimized !== image) changedImages += 1;
      return prefix + optimized;
    }
  );
  if (updated !== source) {
    fs.writeFileSync(file, updated, 'utf8');
    changedFiles += 1;
  }
}

console.log(`Prioritized ${changedImages} hero images across ${changedFiles} HTML files.`);
