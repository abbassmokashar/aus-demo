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
  'Dr. Haluk Haksal'
]);

const newFaculty = [
  {
    name: 'Prof. Yannick Bouyidou',
    title: 'International Business and Entrepreneurship &amp; Venture Capital',
    image: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa05fc5dfbf3d61bcf249a9_prof-natan-zimenkov.webp'
  },
  {
    name: 'Prof. Sandra Bandelier',
    title: 'Accounting and Finance',
    image: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa05fc3c20b8c07a9981159_dr-suzanne-rosselet.webp'
  },
  {
    name: 'Prof. Thomas Lindsey',
    title: 'Business Communication',
    image: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa05fc5f15285d84e630fb6_robert-fontaine.webp'
  },
  {
    name: 'Dr. Jessie Yan',
    title: 'Business Ethics',
    image: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa05fc2c73e2c87e7d6f962_dr-natalia-raksha.webp'
  },
  {
    name: 'Dr. Nadia Spadaro',
    title: 'Law and Research Methods',
    image: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa05fc3d819cdf9a9784795_dr-ruby-bakshi-khurdi.webp'
  },
  {
    name: 'Prof. Saeed Saadatnejad',
    title: 'AI Systems',
    image: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa05fc086074b0dd59f1f66_dr-alessandro-bianchi.webp'
  }
];

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
const existingNames = new Set(cards.map((card) => card.match(/<div class="faculty-card-name">([^<]+)<\/div>/)?.[1]));
const removed = [];
const retained = cards.filter((card) => {
  const name = card.match(/<div class="faculty-card-name">([^<]+)<\/div>/)?.[1];
  if (removedNames.has(name)) {
    removed.push(name);
    return false;
  }
  return !newFaculty.some((person) => person.name === name);
});

const missing = [...removedNames].filter((name) => !removed.includes(name));
const alreadyUpdated = removed.length === 0 && newFaculty.every((person) => existingNames.has(person.name));
if (missing.length && !alreadyUpdated) throw new Error(`Requested faculty entries were not found: ${missing.join(', ')}`);

const rebuiltGrid = `${gridOpen}\n${retained.join('').trimEnd()}\n${newFaculty.map(cardMarkup).join('\n')}\n`;
html = beforeGrid + rebuiltGrid + afterGrid;
fs.writeFileSync(sourcePath, html, 'utf8');
fs.copyFileSync(sourcePath, distPath);

console.log(`Removed ${removed.length} faculty profiles and added ${newFaculty.length} temporary profiles.`);
