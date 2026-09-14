const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const skipped = new Set([
  '.chrome-backup', '.git', 'history', 'node_modules', 'program-media',
  'webflow', 'Website Bank of Images'
]);
const oldCampusImage = 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=1800&auto=format&fit=crop&q=80';
const newCampusImage = 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa7a8ffc8165c3077529ecb_campus-life.webp';
const swissNumbers = [
  '1,000', '1,350', '1,380', '1,500', '1,780', '2,000', '2,500',
  '4,000', '10,000', '14,000', '25,000', '25,050', '26,000',
  '28,000', '30,000'
];

function listHtml(directory, output = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && skipped.has(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) listHtml(full, output);
    else if (entry.name.endsWith('.html')) output.push(full);
  }
  return output;
}

function updateEventSection(html, chapter, expectedDateCount, renameIndustry = false) {
  const marker = `data-chapter="${chapter}"`;
  const markerAt = html.indexOf(marker);
  if (markerAt === -1) throw new Error(`Speaker-series chapter ${chapter} was not found.`);
  const start = html.lastIndexOf('<section', markerAt);
  const closing = html.indexOf('</section>', markerAt);
  if (start === -1 || closing === -1) throw new Error(`Speaker-series chapter ${chapter} is malformed.`);
  const end = closing + '</section>'.length;
  let section = html.slice(start, end);
  const datePattern = /\r?\n\s*<div style="font-size:11px;font-weight:700;letter-spacing:\.08em;text-transform:uppercase;color:var\(--crimson\);margin-bottom:(?:6|8)px;">(?:[A-Za-z]+\s+)?(?:19|20)\d{2}<\/div>/g;
  const dates = section.match(datePattern) || [];
  if (dates.length !== expectedDateCount && dates.length !== 0) {
    throw new Error(`Expected ${expectedDateCount} or 0 dates in chapter ${chapter}, found ${dates.length}.`);
  }
  section = section.replace(datePattern, '');
  if (renameIndustry) {
    section = section
      .replace(/Industrial Visits/g, 'Industry Visits')
      .replace(/Industrial visits/g, 'Industry visits');
  }
  return {
    html: html.slice(0, start) + section + html.slice(end),
    removedDates: dates.length
  };
}

function updateSpeakerSeries(html) {
  const commencement = updateEventSection(html, '02', 9);
  const industry = updateEventSection(commencement.html, '03', 16, true);
  return {
    html: industry.html,
    removedDates: commencement.removedDates + industry.removedDates
  };
}

let changedFiles = 0;
let imageReplacements = 0;
let numberReplacements = 0;
let removedDates = 0;
let scriptSeparatorEscapes = 0;
let fontUrlRepairs = 0;

for (const file of listHtml(root)) {
  let html = fs.readFileSync(file, 'utf8');
  const before = html;

  if (file.endsWith(path.join('about', 'news-and-events', 'speaker-series.html'))) {
    const result = updateSpeakerSeries(html);
    html = result.html;
    removedDates += result.removedDates;
  }

  imageReplacements += html.split(oldCampusImage).length - 1;
  html = html.replaceAll(oldCampusImage, newCampusImage);
  html = html
    .replaceAll('Industrial Visits', 'Industry Visits')
    .replaceAll('Industrial visits', 'Industry visits');

  html = html.replace(/<link\b[^>]*fonts\.googleapis\.com[^>]*>/gi, (link) => {
    return link.replace(/(?<=\d)'(?=\d{3})/g, () => {
      fontUrlRepairs += 1;
      return ',';
    });
  });

  html = html.replace(/<[^>]+>|[^<]+/g, (chunk) => {
    if (chunk.startsWith('<')) return chunk;
    for (const number of swissNumbers) {
      const count = chunk.split(number).length - 1;
      if (!count) continue;
      numberReplacements += count;
      chunk = chunk.replaceAll(number, number.replaceAll(',', "'"));
    }
    return chunk;
  });

  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (script) => {
    return script.replace(/(?<=\d)'(?=\d{3}(?!\d))/g, () => {
      scriptSeparatorEscapes += 1;
      return "\\'";
    });
  });

  html = html.replace(
    'function formatCHF(n){return"CHF "+n.toLocaleString("en-CH");}',
    'function formatCHF(n){return"CHF "+Math.round(n).toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g,"\\u0027");}'
  );

  if (html !== before) {
    fs.writeFileSync(file, html, 'utf8');
    changedFiles += 1;
  }
}

console.log(`Updated ${changedFiles} HTML files.`);
console.log(`Removed ${removedDates} displayed event dates.`);
console.log(`Replaced ${imageReplacements} campus-life image references.`);
console.log(`Converted ${numberReplacements} comma-grouped numbers to Swiss formatting.`);
console.log(`Escaped ${scriptSeparatorEscapes} Swiss separators inside scripts.`);
console.log(`Repaired ${fontUrlRepairs} Google Fonts URL values.`);
