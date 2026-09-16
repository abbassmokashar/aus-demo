const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'about', 'faculty.html');
const distPath = path.join(root, 'dist', 'about', 'faculty.html');

const removedNames = new Set([
  'Sandro Guidetti',
  'Prof. Natan Zimenkov',
  'Naggib Chakhane',
  'Robert Fontaine',
  'Humbert Costas Garcia',
  'Dr. Suzanne Rosselet',
  'Dr. Ruby Bakshi Khurdi',
  'Dr. Olivier Naray',
  'Dr. Natalia Raksha',
  'Dr. Mwata Chisha',
  'Dr. Mario Saba',
  'Dr. Laure Matsoukis',
  'Dr. Haitao Zhang',
  'Dr. Attila Shelley',
  'Dr. Alessandro Bianchi',
  'Dr. Haluk Haksal',
  'Prof. Thomas Lindsey',
  'Prof. Saeed Saadatnejad'
]);

const newFaculty = [
  {
    name: 'Prof. Yannick Bouyidou',
    title: 'International Business and Entrepreneurship &amp; Venture Capital',
    image: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aaa76e7a79f462458a7452e_Yannick%20Bouyidou.webp'
  },
  {
    name: 'Prof. Sandra Bandelier',
    title: 'Accounting and Finance',
    image: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa05fc3c20b8c07a9981159_dr-suzanne-rosselet.webp'
  },
  {
    name: 'Dr. Jessie Yan',
    title: 'Business Ethics',
    image: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aaa76e6898fde21b7c73ec5_jessie%20yan.webp'
  },
  {
    name: 'Dr. Nadia Spadaro',
    title: 'Law and Research Methods',
    image: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aaa7bf577ac4c0c3b77c33f_Nadia.webp'
  }
];

const facultyImageOverrides = new Map([
  ['Katarzyna Grzesik-Harz', 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aaa76e720608e06540af8c7_Katarzyna%20Grzesik-Harz.webp'],
  ['Dr. Sajal Kabiraj', 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aaa76e70ea617fa38539b78_Sajal%20Kabiraj.webp']
]);

function cardMarkup({ name, title, image }) {
  return `      <div class="faculty-card tilt-card">
        <img class="faculty-card-img" loading="lazy" decoding="async" fetchpriority="low" src="${image}" alt="${name}">
        <div class="faculty-card-body">
          <div class="faculty-card-name">${name}</div>
          <div class="faculty-card-title">${title}</div>
        </div>
      </div>`;
}

let html = fs.readFileSync(sourcePath, 'utf8');
const gridOpen = '    <div class="faculty-grid">';
const gridStart = html.indexOf(gridOpen);
if (gridStart === -1) throw new Error('Faculty grid was not found.');
const gridEndMarker = '\n    </div>\n  </div>\n</section>';
const gridEnd = html.indexOf(gridEndMarker, gridStart);
if (gridEnd === -1) throw new Error('Faculty grid closing marker was not found.');

const beforeGrid = html.slice(0, gridStart);
const grid = html.slice(gridStart, gridEnd);
const afterGrid = html.slice(gridEnd);
const cardPattern = /      <div class="faculty-card tilt-card">\r?\n[\s\S]*?\r?\n      <\/div>\r?\n?/g;
const cards = grid.match(cardPattern) || [];
const removed = [];
const retained = cards.filter((card) => {
  const name = card.match(/<div class="faculty-card-name">([^<]+)<\/div>/)?.[1];
  if (removedNames.has(name)) {
    removed.push(name);
    return false;
  }
  return !newFaculty.some((person) => person.name === name);
}).map((card) => {
  const name = card.match(/<div class="faculty-card-name">([^<]+)<\/div>/)?.[1];
  const image = facultyImageOverrides.get(name);
  return image ? card.replace(/(<img class="faculty-card-img"[^>]* src=")[^"]+/, `$1${image}`) : card;
});

const rebuiltGrid = `${gridOpen}\n${retained.join('').trimEnd()}\n${newFaculty.map(cardMarkup).join('\n')}\n`;
html = beforeGrid + rebuiltGrid + afterGrid;
fs.writeFileSync(sourcePath, html, 'utf8');
fs.copyFileSync(sourcePath, distPath);

console.log(`Removed ${removed.length} faculty profiles and refreshed ${newFaculty.length} managed profiles.`);
