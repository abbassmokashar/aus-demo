const fs = require('fs');
const path = require('path');
const { programImageUrls } = require('./program-image-urls');

const root = path.resolve(__dirname, '..');

const programs = [
  ['programs/bachelors/accounting.html', 'Bachelor of Accounting', 'accounting.png', 'accounting (1).png', 'AUS students in a business meeting', 'Accounting analysis and decision-making'],
  ['programs/bachelors/aviation-management.html', 'Bachelor of Aviation Management/Compressed', 'aviation.jpg', 'aviation 2.jpg', 'Commercial aviation operations', 'Aviation management in practice'],
  ['programs/bachelors/business-management.html', 'Bachelor of Business Management', 'adeolu-eletu-E7RLgUjjazc-unsplash.jpg', 'stephen-dawson-qwtCeJ5cLYs-unsplash.jpg', 'Business strategy and planning', 'Business performance analysis'],
  ['programs/bachelors/healthcare-administration.html', 'Bachelor of Healthcare Administration', 'healthcare administration (1).png', 'nappy-EjajCMK7CJM-unsplash.jpg', 'Healthcare administration leadership', 'Healthcare leadership and operations'],
  ['programs/bachelors/hospitality-management.html', 'Bachelor of Hospitality Management', 'aus-hospitality-management-degree.jpg', 'pexels-gustavo-fring-6284908.jpg', 'Hospitality management', 'Hospitality service and operations'],
  ['programs/bachelors/human-resource-management.html', 'Bachelor of Human Resource Management', 'HR management.png', 'pexels-tiger-lily-7109013.jpg', 'Human resource management', 'People development and collaboration'],
  ['programs/bachelors/integrated-digital-marketing.html', 'Bachelor of Integrated and Digital Marketing', 'digital marketing.png', '1981-digital-MVS3ecBsfmk-unsplash.jpg', 'Integrated digital marketing', 'Digital campaign strategy'],
  ['programs/bachelors/international-business.html', 'Bachelor of International Business', 'international business.png', 'adult-business-computer-1181541.jpg', 'International business', 'Global business collaboration'],
  ['programs/bachelors/sports-management-athletic-administration.html', 'Bachelor of Sports Management', 'enhanced_basketball_team.jpg', 'DSC_5617-scaled.jpg', 'Athletic administration', 'Sports leadership and team operations'],
  ['programs/bachelors/sports-management-sports-marketing.html', 'Bachelor of Sports Management/Marketing', 'pexels-pixabay-47354.jpg', 'Screenshot 2025-10-29 at 08.48.10.png', 'Sports marketing', 'Sports audience and campaign engagement'],
  ['programs/masters/aviation-management.html', 'Masters of aviation Management', 'Aviation Management - IATA Training Center.png', 'Aviation Management - Bern Airport.png', 'IATA aviation training', 'Airport operations and aviation management'],
  ['programs/masters/data-analytics.html', 'Masters of Data Analytics', 'markus-spiske-hvSr_CVecVI-unsplash.jpg', '3277C481-C376-457A-B656-830165C555A6_1_105_c (1).jpeg', 'Data analytics and visualization', 'Applied data analytics'],
  ['programs/masters/finance.html', 'Masters of Finance', 'nick-chong-N__BnvQ_w18-unsplash.jpg', 'markus-spiske-XrIfY_4cK1w-unsplash.jpg', 'Financial markets and investment', 'Finance analysis and reporting'],
  ['programs/masters/healthcare-administration.html', 'Masters of Healthcare Administration', 'dominik-lange-VUOiQW4OeLI-unsplash.jpg', 'piron-guillaume-U4FyCp3-KzY-unsplash.jpg', 'Healthcare administration and strategy', 'Healthcare operations and leadership'],
  ['programs/masters/human-resource-management.html', 'Masters of Human Resource Management', 'hunters-race-MYbhN8KaaEc-unsplash.jpg', 'mina-rad-qFSQFSmfZkA-unsplash.jpg', 'Human resource leadership', 'People strategy and workplace collaboration'],
  ['programs/masters/international-business.html', 'Masters of International Business', 'vladislav-klapin-YeO44yVTl20-unsplash.jpg', 'greg-rosenke-1TjORT2dLOw-unsplash.jpg', 'International business strategy', 'Global markets and international trade'],
  ['programs/masters/leadership-and-change.html', 'Masters of Leadership & Change', 'memento-media-2pPw5Glro5I-unsplash.jpg', 'dylan-gillis-KdeqA3aTnBY-unsplash.jpg', 'Leadership strategy and organizational change', 'Collaborative leadership'],
  ['programs/masters/sports-management.html', 'Masters of Sport management', 'steven-lelham-atSaEOeE8Nk-unsplash.jpg', 'mina-rad-tT_V3qBCbak-unsplash.jpg', 'Professional sports management', 'Sports strategy and administration'],
  ['programs/masters/strategic-brand-digital-marketing.html', 'Masters of Strategic Brand & Digital Marketing', 'path-digital-tR0jvlsmCuQ-unsplash.jpg', 'melanie-deziel-U33fHryBYBU-unsplash.jpg', 'Strategic digital marketing', 'Brand storytelling and content strategy'],
  ['programs/doctorate/dba.html', 'Doctorate of Business Administration', 'apex-virtual-education-KNQUEQwTCY4-unsplash.jpg', 'Conference room 1.png', 'Doctoral business research', 'Executive research and leadership'],
  ['programs/federal-diploma.html', 'DBA & Federal Diploma', 'vitaly-gariev-biciz2eSkiA-unsplash.jpg', 'gorilla-roi-data-connector-9fZuqBYlV1w-unsplash.jpg', 'Swiss Federal Diploma business studies', 'Applied business administration'],
];

const placeholders = [
  ['https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=80', 'Finance workspace'],
  ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80', 'Business analytics']
];

function safeName(page, slot, sourceName) {
  const route = page
    .replace(/^programs\//, '')
    .replace(/\.html$/, '')
    .replace(/[^a-z0-9]+/gi, '-');
  return `${route}-${slot}${path.extname(sourceName).toLowerCase()}`;
}

function pageImageUrl(page, name) {
  const url = programImageUrls[name];
  if (!url) throw new Error(`Missing Webflow URL for ${name}.`);
  return url;
}

let updated = 0;

for (const [page, _folder, first, second, firstAlt, secondAlt] of programs) {
  const selections = [[first, firstAlt], [second, secondAlt]];
  const replacements = selections.map(([sourceName, alt], index) => {
    const destinationName = safeName(page, index + 1, sourceName);
    return [destinationName, alt];
  });

  for (const relative of [page, `dist/${page}`]) {
    const file = path.join(root, relative);
    let html = fs.readFileSync(file, 'utf8');
    const before = html;
    placeholders.forEach(([oldUrl, oldAlt], index) => {
      const oldMarkup = `src="${oldUrl}" alt="${oldAlt}"`;
      const [destinationName, newAlt] = replacements[index];
      const newUrl = pageImageUrl(relative, destinationName);
      const newMarkup = `src="${newUrl}" alt="${newAlt}"`;
      if (html.includes(oldMarkup)) html = html.replace(oldMarkup, newMarkup);
      else if (!html.includes(newMarkup)) {
        const escapedName = destinationName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const importedMarkup = new RegExp(`src="[^"]*program-media/${escapedName}" alt="[^"]*"`);
        if (!importedMarkup.test(html)) throw new Error(`${relative} is missing the expected image slot.`);
        html = html.replace(importedMarkup, newMarkup);
      }
    });
    if (html !== before) {
      fs.writeFileSync(file, html, 'utf8');
      updated += 1;
    }
  }
}

console.log(`Applied 42 Webflow-hosted program image URLs.`);
console.log(`Updated ${updated} program HTML files (source and dist).`);
