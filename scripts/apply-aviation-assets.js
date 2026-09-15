const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const aviation = {
  airside: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa9a461cfa87fb586d66568_Aviation%20Managment%20-%20Geneva%20Airport%20Visit.JPG',
  visit: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa9a4612a43da5076c73b96_Aviation%20Management%20-%20Geneva%20Airport%20Visit%202.JPG',
  internship: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa9a462afcd16e29b9f67d8_Aviation%20Management%20Internship%20.JPG',
  management: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa9a46273b173b572bf1f77_Aviation%20Management.png',
  flight: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa9a46364778a463732fdbf_1.jpg',
  hangar: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa9a464b5cd707cbe4bd83c_2.jpg',
  group: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa9a46464778a463732fdee_1668620333055.jpg',
  session: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa9a464fdc354b0697f79b3_20221116_132636_2-2.jpg'
};
const generic = {
  image45: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa272ce0ef760da4aab62e3_image45.jpg',
  image48: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa272cec2220127b8b6ee89_image48.jpg',
  image42: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa272ceb83a3e19096b79e7_image42.jpg',
  image44: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa273e91d37a1c56fb74c73_image44.jpg'
};

function replaceSequential(text, needle, replacements) {
  let index = 0;
  return text.replaceAll(needle, () => replacements[Math.min(index++, replacements.length - 1)]);
}

function replaceImageByAlt(html, alt, url) {
  const escaped = alt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return html.replace(new RegExp(`(<img\\b[^>]*\\bsrc=")[^"]+("[^>]*\\balt="${escaped}")`, 'g'), `$1${url}$2`);
}

function updateBachelor(html) {
  const hero = aviation.group;
  const visit = aviation.visit;
  const session = aviation.session;
  const airside = aviation.airside;
  html = html.replaceAll('https://abbassmokashar.github.io/aus-demo/aviation-assets/bachelor-aviation-hero.jpg', hero)
    .replaceAll('https://abbassmokashar.github.io/aus-demo/aviation-assets/bachelor-geneva-airport-visit.jpg', visit)
    .replaceAll('https://abbassmokashar.github.io/aus-demo/aviation-assets/aviation-expert-session.jpg', session)
    .replaceAll('https://abbassmokashar.github.io/aus-demo/aviation-assets/geneva-airport-airside.jpg', airside);
  html = replaceSequential(html, generic.image45, [hero, hero, session, visit]);
  html = html.replaceAll('https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa411536fd6ec0c21dc4ac3_bachelors-aviation-management-1.jpg.webp', visit);
  html = html.replaceAll('https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa4115303f54b99a785b8c5_bachelors-aviation-management-2.jpg.webp', airside);
  html = html.replaceAll(generic.image48, visit).replaceAll(generic.image42, session).replaceAll(generic.image44, airside);
  html = html
    .replaceAll('alt="Accounting and finance workspace"', 'alt="AUS Aviation Management students visiting Geneva Airport"')
    .replaceAll('alt="Finance workspace"', 'alt="Aviation industry learning session"');
  const imagesByAlt = {
    'AUS Aviation Management students visiting Geneva Airport': aviation.group,
    'Aviation Management': aviation.group,
    'Commercial aviation operations': aviation.management,
    'Aviation management in practice': aviation.airside,
    'Aviation industry learning session': aviation.visit,
    'AUS students applying their learning': aviation.internship,
    'AUS program learning environment': aviation.flight,
    'AUS students on an industry visit': aviation.airside,
    'AUS aviation industry field visit': aviation.visit,
    'AUS expert-led classroom session': aviation.session,
    'AUS students in Switzerland': aviation.group
  };
  for (const [alt, url] of Object.entries(imagesByAlt)) html = replaceImageByAlt(html, alt, url);
  return html;
}

function updateMaster(html) {
  const hero = aviation.flight;
  const hangar = aviation.hangar;
  const internship = aviation.internship;
  const session = aviation.session;
  const airside = aviation.airside;
  html = html.replaceAll('https://abbassmokashar.github.io/aus-demo/aviation-assets/master-aviation-hero.jpg', hero)
    .replaceAll('https://abbassmokashar.github.io/aus-demo/aviation-assets/sion-airport-hangar-visit.jpg', hangar)
    .replaceAll('https://abbassmokashar.github.io/aus-demo/aviation-assets/aviation-internship-iata.jpg', internship)
    .replaceAll('https://abbassmokashar.github.io/aus-demo/aviation-assets/aviation-expert-session.jpg', session)
    .replaceAll('https://abbassmokashar.github.io/aus-demo/aviation-assets/geneva-airport-airside.jpg', airside);
  html = replaceSequential(html, generic.image45, [hero, hero, session, internship]);
  html = html.replaceAll('https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa411556fd6ec0c21dc4c2f_masters-aviation-management-1.png.webp', hangar);
  html = html.replaceAll('https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa411572390ac4580ee3d92_masters-aviation-management-2.png.webp', airside);
  html = html.replaceAll(generic.image48, internship).replaceAll(generic.image42, session).replaceAll(generic.image44, airside);
  html = html
    .replaceAll('alt="Accounting and finance workspace"', 'alt="Executive aviation operations in Switzerland"')
    .replaceAll('alt="Finance workspace"', 'alt="Aviation management field learning"');
  const imagesByAlt = {
    'Executive aviation operations in Switzerland': aviation.flight,
    'Aviation Management': aviation.flight,
    'IATA aviation training': aviation.hangar,
    'Airport operations and aviation management': aviation.management,
    'Aviation management field learning': aviation.visit,
    'AUS students applying their learning': aviation.internship,
    'AUS program learning environment': aviation.airside,
    'AUS students on an industry visit': aviation.airside,
    'AUS aviation industry field visit': aviation.visit,
    'AUS expert-led classroom session': aviation.session,
    'AUS students in Switzerland': aviation.group
  };
  for (const [alt, url] of Object.entries(imagesByAlt)) html = replaceImageByAlt(html, alt, url);
  return html;
}

const files = [
  [path.join(root, 'programs', 'bachelors', 'aviation-management.html'), updateBachelor],
  [path.join(root, 'programs', 'masters', 'aviation-management.html'), updateMaster]
];

for (const [file, updater] of files) {
  const html = fs.readFileSync(file, 'utf8');
  fs.writeFileSync(file, updater(html));
}

console.log('Applied dedicated AUS aviation imagery to the Bachelor and Master Aviation Management pages.');
