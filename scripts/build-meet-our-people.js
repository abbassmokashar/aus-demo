const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'about', 'meet-our-people.html');
const distPath = path.join(root, 'dist', 'about', 'meet-our-people.html');

const people = [
  ['Fouad Al Khansa', 'Head of Institutional Development', 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa95db26dcbf128e20fa169_Fouad.webp', 'Supports institutional initiatives and long-term organizational priorities at AUS.'],
  ['Hakim El Omrani', 'Executive Director', 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa95db21e2c951cf450316a_Hakim.webp', 'Oversees executive operations and helps translate institutional priorities into coordinated action.'],
  ['Dominic Szambowski', 'Executive Dean', 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa95db2c37c7848e229e664_Dominic.webp', 'Provides academic leadership and supports the quality and direction of teaching and learning at AUS.'],
  ['Connor Lamb', 'Vice Dean of Academics', 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa95db26602daa375412dde_Connor.webp', 'Supports academic planning, faculty coordination and the delivery of the student learning experience.'],
  ['Paulo Pereira', 'Registrar', 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa95db4a13fc8df5545d3db_Paulo.webp', 'Oversees academic records, registration processes and key student administration services.'],
  ['Anca Prisacariu', 'Quality Assurance Director', 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa95db2d29d2a961dc6a7b3_Anca.webp', 'Leads quality assurance processes and supports continuous improvement across the institution.'],
  ['Jonathan Hilton', 'Head of Admission and Recruitment', 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa95db2cd663a402e494e21_Jonathan.webp', 'Leads admissions and recruitment, helping prospective students understand programs and their next steps.'],
  ['Abbass Mokashar', 'Chief Information & Technology Officer', 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa95db20d2739bf368d590a_Abbass.webp', 'Leads information technology strategy, digital systems and technology-enabled institutional development.'],
  ['Nour El Yaafouri', 'Graphic Designer', 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa95db3a13fc8df5545d39c_Nour.webp', 'Develops visual communications and design materials that support the AUS brand and student experience.'],
  ['Rayan Abdallah', 'Student Recruitment Officer — MENA Region', 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa95db8fcb4c9761e7cfbed_Rayan.webp', 'Supports prospective students across the MENA region throughout discovery, admissions and enrollment.'],
  ['Ivana Korolija', 'Administrative Assistant', 'https://placehold.co/900x1100/f1f1ef/22295f?text=Ivana+Korolija%0APhoto+Coming+Soon', 'Supports day-to-day administration and helps coordinate services across the AUS community.', true],
  ['Caitline Bengtsson', 'Head of Marketing', 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa95db1d97052904e24b5b4_Caitline.webp', 'Leads marketing strategy, communications and audience engagement for AUS.']
];

const cards = people.map(([name, title, image, bio, placeholder]) => `<article class="person-card" tabindex="0">
  <img loading="lazy" decoding="async" src="${image}" alt="${placeholder ? `Placeholder portrait for ${name}` : name}">
  <div class="person-caption"><h3>${name}</h3><p>${title}</p><button type="button" class="person-bio-toggle" aria-expanded="false">View biography</button></div>
  <div class="person-bio"><strong>${name}</strong><span>${title}</span><p>${bio}</p><button type="button" class="person-bio-close">Back to profile</button></div>
</article>`).join('\n');

const content = `<section class="people-hero" data-chapter="01" data-chapter-label="Our People"><div class="wrap"><span class="eyebrow on-navy">About AUS</span><h1>Meet Our People</h1><p>Meet the team whose leadership, expertise and care shape the AUS experience.</p></div></section>
<section class="people-section people-directory" data-chapter="02" data-chapter-label="AUS Team">
  <div class="wrap"><span class="eyebrow">AUS Team</span><h2>The people behind AUS.</h2><p class="people-lead">One connected team supports academic quality, institutional development, admissions, technology, communications and the everyday student experience.</p><div class="people-grid">
${cards}
  </div></div>
</section>
`;

const styles = `<style id="people-unified-grid-styles">
.people-directory{background:#f1f1ef}
.people-directory .people-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:20px;align-items:stretch}
.people-directory .person-card{width:100%;min-width:0;min-height:0;aspect-ratio:3/4;border-color:rgba(34,41,95,.38);box-shadow:0 10px 30px rgba(17,24,39,.09)}
.people-directory .person-card>img{object-position:center top}
.people-directory .person-caption h3{font-size:clamp(18px,1.55vw,22px)}
.people-directory .person-caption p{min-height:2.9em}
@media(max-width:1100px){.people-directory .people-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:820px){.people-directory .people-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:580px){.people-hero{padding:132px 0 58px}.people-hero p{font-size:16px}.people-directory .people-grid{grid-template-columns:1fr!important;gap:18px}.people-directory .person-card{aspect-ratio:4/5;min-height:0}.people-directory .person-caption p{min-height:0}.people-directory .person-bio{padding:28px}}
</style>`;

let html = fs.readFileSync(sourcePath, 'utf8');
const start = html.indexOf('<section class="people-hero"');
const end = html.indexOf('<footer class="site-footer">', start);
if (start < 0 || end < 0) throw new Error('Could not locate Meet Our People content boundaries.');
html = html.slice(0, start) + content + html.slice(end);
if (html.includes('people-unified-grid-styles')) {
  html = html.replace(/<style id="people-unified-grid-styles">[\s\S]*?<\/style>/, styles);
} else {
  html = html.replace('</head>', `${styles}\n</head>`);
}

fs.writeFileSync(sourcePath, html, 'utf8');
fs.mkdirSync(path.dirname(distPath), { recursive: true });
fs.writeFileSync(distPath, html, 'utf8');
console.log(`Built one responsive Meet Our People grid with ${people.length} profiles.`);
