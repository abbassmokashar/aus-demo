const fs = require('fs');
const path = require('path');
const { programImageUrls } = require('./program-image-urls');

const root = path.resolve(__dirname, '..');
const skipped = new Set(['.chrome-backup', '.git', '.visual-check', 'history', 'node_modules', 'webflow']);

const AUS_LOGO = 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6a99cdf83566fae73a65cc9c_AUS%20Logo%202023.png';
const TIFFIN_LOGO = 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6a9ac1b3fb4e84ba658f3a8a_tiffin-university-logo.svg';
const BADGE_SWISS = 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6a9dcf4a977a6a6c1b85f25f_2.png';
const BADGE_GLOBAL = 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6a9dcf4b71caefbe2cebb61e_200.png';
const CONTACT_FORM = 'https://share-eu1.hsforms.com/11syZtqHyQeS44OepgqCVtQfwv24';
const ADVISING = 'https://meetings-eu1.hubspot.com/jonathan-hilton/advisory-session';
const CAMPUS_VISIT = 'https://share-eu1.hsforms.com/1t_dizG4cT7-D9bCyPSDnAwfwv24';
const NEW_DIPLOMA_IMAGE = 'https://images.unsplash.com/photo-1673459148404-65d2c2b792e3?w=1800&auto=format&fit=crop&q=80';

const sharedStyles = `
<style id="aus-contact-partner-update-styles">
*,*::before,*::after{box-sizing:border-box}
html,body{max-width:100%;overflow-x:hidden;overflow-x:clip}
img,svg,video,iframe{max-width:100%}
input,select,textarea,button{max-width:100%}
pre{max-width:100%;overflow-x:auto}
main,section,.wrap{min-width:0}
.aus-nav-talk{font-family:inherit;cursor:pointer;appearance:none;-webkit-appearance:none;background:transparent;color:inherit}
.footer-social-title{margin-top:24px;margin-bottom:0}.footer-social-grid{display:flex;flex-wrap:wrap;gap:9px;margin-top:11px}.footer-social-grid a{padding:0}
.footer-contact-heading{margin:26px 0 9px}
.footer-contact-details{display:flex;flex-direction:column;gap:3px;margin-top:0;font-style:normal;font-size:13.5px;line-height:1.55;color:rgba(34,41,95,.75)}
.footer-contact-details a{display:inline;color:inherit;font-weight:650}.footer-contact-details a:hover{color:var(--crimson)}
.aus-popup-recognition{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));align-items:center;justify-content:center;gap:10px;margin:0 0 14px}
.aus-popup-recognition-card{display:grid;place-items:center;width:100%;min-width:0;padding:0;border:1px solid var(--line);border-radius:12px;background:transparent;overflow:hidden}
.aus-popup-recognition-card img{display:block;width:min(44%,112px);height:auto;object-fit:contain;margin:10px auto}
.aus-popup{width:min(700px,calc(100vw - 32px));max-width:700px;max-height:calc(100dvh - 32px)}.aus-popup-body{overflow-y:auto}
.reasons-partner-lockup{position:absolute;z-index:4;right:clamp(22px,4vw,58px);top:50%;display:flex;align-items:center;gap:16px;max-width:min(46%,520px);padding:12px 16px;border:1px solid rgba(255,255,255,.58);border-radius:18px;background:rgba(255,255,255,.78);box-shadow:0 14px 32px rgba(17,24,39,.16);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);opacity:0;transform:translateY(calc(-50% + 12px));pointer-events:none;transition:opacity .35s ease,transform .35s ease}
.reasons-partner-lockup.is-active{opacity:1;transform:translateY(-50%)}.reasons-partner-lockup img{display:block;width:auto;max-width:218px;height:66px;object-fit:contain}.reasons-partner-lockup img:first-child{height:74px}.partner-x{display:block;width:auto;height:auto;border:0;border-radius:0;background:transparent;color:var(--navy);font-weight:900;font-size:clamp(42px,4.4vw,66px);line-height:.8;flex:0 0 auto}
.partner-hero-lockup{position:absolute;z-index:3;right:clamp(22px,5vw,76px);top:clamp(110px,15vh,155px);bottom:auto;display:flex;align-items:center;gap:16px;max-width:min(46vw,540px);padding:12px 16px;border:1px solid rgba(255,255,255,.58);border-radius:18px;background:rgba(255,255,255,.8);box-shadow:0 14px 34px rgba(17,24,39,.18);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.partner-hero-lockup img{display:block;width:auto;max-width:210px;height:62px;object-fit:contain}.partner-hero-lockup img:first-child{height:70px}
.hero-mob-img .partner-hero-lockup{right:16px;top:auto;bottom:18px;left:16px;max-width:none;justify-content:center;padding:10px 12px}.hero-mob-img .partner-hero-lockup img{height:38px;max-width:128px}.hero-mob-img .partner-hero-lockup img:first-child{height:43px}.hero-mob-img .partner-x{font-size:36px}
.rankings>.wrap{display:flex;flex-direction:column}.rankings>.wrap>.chapter-label{order:0}.rankings>.wrap>.rankings-head{order:1}.rankings>.wrap>.logo-carousel-wrap{order:2}.rankings>.wrap>.rankings-highlight{order:3;position:relative;clear:both}
.stagger-grid.is-visible>*:nth-child(n+7){opacity:1;transform:translateY(0);transition-delay:.47s}
@media(max-width:760px){
  .aus-search-drop{position:fixed!important;top:64px!important;left:50%!important;right:auto!important;transform:translateX(-50%)!important;width:calc(100vw - 20px)!important;max-width:620px!important;max-height:calc(100dvh - 76px)!important}
  .stagger-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
  [style*="grid-template-columns:1fr 1fr"],[style*="grid-template-columns: 1fr 1fr"],[style*="grid-template-columns:2fr 1fr"],[style*="grid-template-columns: 2fr 1fr"]{grid-template-columns:1fr!important}
  table{display:block;max-width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}
}
@media(max-width:1050px) and (min-width:641px){.reasons-partner-lockup{right:18px;max-width:43%;gap:10px;padding:10px 12px}.reasons-partner-lockup img{height:48px;max-width:155px}.reasons-partner-lockup img:first-child{height:54px}.reasons-partner-lockup .partner-x{font-size:40px}.partner-hero-lockup{right:22px;max-width:43vw;gap:10px;padding:10px 12px}.partner-hero-lockup img{height:48px;max-width:155px}.partner-hero-lockup img:first-child{height:54px}.partner-hero-lockup .partner-x{font-size:40px}}
@media(max-width:640px){.aus-popup-recognition-card img{width:min(42%,96px);height:auto;margin:8px auto}.reasons-partner-lockup{top:auto;left:14px;right:14px;bottom:18px;max-width:none;justify-content:center;gap:10px;padding:10px 12px;transform:translateY(10px)}.reasons-partner-lockup.is-active{transform:none}.reasons-partner-lockup img{height:36px;max-width:118px}.reasons-partner-lockup img:first-child{height:41px}.reasons-partner-lockup .partner-x{font-size:34px}.partner-hero-lockup:not(.hero-mob-img .partner-hero-lockup){display:none}.footer-contact-details{font-size:13px}}
@media(max-width:480px){.aus-search-drop{top:56px!important;max-height:calc(100dvh - 66px)!important}.stagger-grid{grid-template-columns:1fr!important}}
</style>`;

const contactMenu = `      <div class="accordion-item" data-panel-key="contact" id="menu-contact">
        <button class="accordion-trigger">Contact Us <span class="accordion-icon"></span></button>
        <div class="accordion-panel"><div class="accordion-panel-inner">
          <div class="accordion-group">
            <a href="${ADVISING}">Student Advising</a>
            <a href="${CONTACT_FORM}">Book a Call</a>
            <a href="${CAMPUS_VISIT}">Book a Campus Visit</a>
          </div>
        </div></div>
      </div>`;

const recognition = `      <div class="aus-popup-recognition" aria-label="AUS rankings recognition">
        <a class="aus-popup-recognition-card" href="/rankings" aria-label="View AUS Top 2 in Switzerland ranking"><img loading="lazy" decoding="async" src="${BADGE_SWISS}" alt="Top 2 in Switzerland recognition badge"></a>
        <a class="aus-popup-recognition-card" href="/rankings" aria-label="View AUS Top 200 global ranking"><img loading="lazy" decoding="async" src="${BADGE_GLOBAL}" alt="Top 200 globally recognition badge"></a>
      </div>`;

const footerDetails = `        <address class="footer-contact-details">
          <a href="mailto:info@aus.swiss">info@aus.swiss</a>
          <span>Chemin du Levant 5</span>
          <span>1814 La Tour-de-Peilz</span>
          <span>Switzerland</span>
          <a href="tel:+41219449501">+41 21 944 95 01</a>
        </address>`;

const footerHeading = '        <div class="footer-contact-heading footer-col-title">Visit Us</div>';

function listHtml(directory, output = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && skipped.has(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) listHtml(full, output);
    else if (entry.name.endsWith('.html')) output.push(full);
  }
  return output;
}

function logicalPath(file) {
  let relative = path.relative(root, file).replace(/\\/g, '/');
  if (relative.startsWith('dist/')) relative = relative.slice(5);
  return relative;
}

function updateShared(html) {
  html = html.replace('.aus-nav-talk{font-family:inherit;cursor:pointer;appearance:none;-webkit-appearance:none}', '.aus-nav-talk{font-family:inherit;cursor:pointer;appearance:none;-webkit-appearance:none;background:transparent;color:inherit}');
  if (!html.includes('.aus-popup{max-height:calc(100dvh - 32px)}')) {
    html = html.replace('.aus-popup-recognition-card span{font-size:11px;line-height:1.35;font-weight:750;color:var(--navy)}', '.aus-popup-recognition-card span{font-size:11px;line-height:1.35;font-weight:750;color:var(--navy)}\n.aus-popup{max-height:calc(100dvh - 32px)}.aus-popup-body{overflow-y:auto}');
  }
  html = html.replace(
    new RegExp(`<a href="${ADVISING.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}" class="aus-nav-talk"><span class="aus-nav-action-full">Talk to Admissions<\\/span><span class="aus-nav-action-short">Talk<\\/span><\\/a>`, 'g'),
    '<button type="button" class="aus-nav-talk" data-open-panel="contact" aria-label="Open contact options"><span class="aus-nav-action-full">Contact Us</span><span class="aus-nav-action-short">Contact</span></button>'
  );
  html = html.replace(/>Academic Partners<\/a>/g, '>Academic Partner</a>');
  html = html.replace(new RegExp(`\\s*<a href="${CAMPUS_VISIT.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}">Book a Campus Visit<\\/a>`, 'g'), '');
  html = html.replace(new RegExp(`<a href="${CONTACT_FORM.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}">Contact<\\/a>`, 'g'), '<a href="/contact-us">Contact Us</a>');
  html = html.replace(new RegExp(`<a href="${CONTACT_FORM.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}" class="side-panel-link">Contact<\\/a>`, 'g'), contactMenu);
  html = html.replace(new RegExp(`<a href="${CONTACT_FORM.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}">Contact Us<\\/a>`, 'g'), '<a href="/contact-us">Contact Us</a>');
  if (html.includes('data-panel-key="contact"') && !html.includes(`<a href="${CAMPUS_VISIT}">Book a Campus Visit</a>`)) {
    html = html.replace(`<a href="${CONTACT_FORM}">Book a Call</a>`, `<a href="${CONTACT_FORM}">Book a Call</a>\n            <a href="${CAMPUS_VISIT}">Book a Campus Visit</a>`);
  }

  if (html.includes('aus-contact-partner-update-styles')) {
    html = html.replace(/<style id="aus-contact-partner-update-styles">[\s\S]*?<\/style>/, sharedStyles.trim());
  } else {
    html = html.replace('</head>', `${sharedStyles}\n</head>`);
  }

  if (!html.includes('class="footer-contact-details"')) {
    html = html.replace(
      /(<p>American Institute of Applied Sciences\. Modern heritage, built for the leaders business hasn't met yet\.<\/p>)/g,
      `$1\n${footerDetails}`
    );
  }

  const socialMatch = html.match(/\s*<div class="footer-social-title footer-col-title">#AUSmoments on<\/div>\s*(<div class="footer-social-grid">[\s\S]*?<\/div>)/);
  if (socialMatch) {
    const social = `        <div class="footer-social-title footer-col-title">#AUSmoments on</div>\n        ${socialMatch[1]}`;
    html = html.replace(socialMatch[0], '');
    html = html.replace(
      /(<p>American Institute of Applied Sciences\. Modern heritage, built for the leaders business hasn't met yet\.<\/p>)/,
      `$1\n${social}`
    );
  }
  const contactDetailsMatch = html.match(/\s*<address class="footer-contact-details">[\s\S]*?<\/address>/);
  const contactDetails = contactDetailsMatch ? contactDetailsMatch[0].trimStart() : footerDetails.trimStart();
  if (contactDetailsMatch) html = html.replace(contactDetailsMatch[0], '');
  html = html.replace(/\s*<div class="footer-contact-heading footer-col-title">[\s\S]*?<\/div>/g, '');
  html = html.replace(
    /(<a href="https:\/\/www\.oecd\.org\/en\/publications\.html" target="_blank" rel="noopener">OECD Publications<\/a>)/,
    `$1\n${footerHeading}\n        ${contactDetails}`
  );

  if (html.includes('class="aus-popup-recognition"')) {
    html = html.replace(/\s*<div class="aus-popup-recognition"[\s\S]*?<\/div>(?=\s*<div class="aus-popup-benefits">)/, `\n${recognition}`);
  }

  if (!html.includes('class="aus-popup-recognition"') && html.includes('class="aus-popup-benefits"')) {
    html = html.replace(/(\s*<div class="aus-popup-benefits">)/, `\n${recognition}$1`);
  }
  html = html.replace(/<a href="https:\/\/study\.aus\.swiss\/application" class="aus-popup-cta-primary">Apply Now<\/a>/g, `<a href="${CONTACT_FORM}" class="aus-popup-cta-primary">Contact Us</a>`);
  html = html.replace(/(<a href="[^"]+" class="aus-popup-cta-secondary">)Explore Programs(<\/a>)/g, '$1Find Your Program$2');

  if (!html.includes('{title:"Contact Us",url:')) {
    html = html.replace(/\n\];\n\s*\/\/ allow pages/, '\n    ,{title:"Contact Us",url:"/contact-us",cat:"About",keys:"Contact AUS email phone address working hours student advising book a call campus visit La Tour-de-Peilz Switzerland"}\n];\n  // allow pages');
  }
  return html;
}

function updateHomepage(html) {
  if (!html.includes('class="reasons-partner-lockup')) {
    html = html.replace(
      /(\s*<\/div>\s*<div class="reasons-spread-content">)/,
      `\n      <div class="reasons-partner-lockup is-active" data-reason-brand="1" aria-label="AUS and Tiffin University dual degree partnership"><img loading="lazy" decoding="async" src="${AUS_LOGO}" alt="AUS Business School"><span class="partner-x">×</span><img loading="lazy" decoding="async" src="${TIFFIN_LOGO}" alt="Tiffin University"></div>$1`
    );
  }
  html = html.replace('https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6a918d5c775f69845bee3e1c_Logo%20blue.png', AUS_LOGO);
  html = html.replace(/(<img loading="lazy" decoding="async" src="https:\/\/cdn\.prod\.website-files\.com\/6a3268e6b878fd22920cd747\/6a99cdf83566fae73a65cc9c_AUS%20Logo%202023\.png" alt="AUS" style=")height:(?:160|104)px;/, '$1height:78px;');
  if (!html.includes("var reasonBrand = document.querySelector('[data-reason-brand]');")) {
    html = html.replace("var reasonImgs = document.querySelectorAll('.reasons-spread-img');", "var reasonImgs = document.querySelectorAll('.reasons-spread-img');\n  var reasonBrand = document.querySelector('[data-reason-brand]');");
    html = html.replace("reasonImgs.forEach(function(img){ img.classList.toggle('is-active', img.getAttribute('data-reason') === key); });", "reasonImgs.forEach(function(img){ img.classList.toggle('is-active', img.getAttribute('data-reason') === key); });\n    if(reasonBrand) reasonBrand.classList.toggle('is-active', key === '1');");
  }
  return html;
}

function partnerLockup(extraClass = '') {
  return `<div class="partner-hero-lockup${extraClass}" aria-label="AUS and Tiffin University partnership"><img loading="eager" decoding="async" src="${AUS_LOGO}" alt="AUS Business School"><span class="partner-x">×</span><img loading="eager" decoding="async" src="${TIFFIN_LOGO}" alt="Tiffin University"></div>`;
}

function updateTiffin(html) {
  html = html.replace(/<\/body>\s*<\/html>\s*(<!-- Bachelor Specialization Popups -->)/, '$1');
  const repeatedCampusImage = 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa272ceb83a3e19096b79e7_image42.jpg';
  const partnerImages = [
    ['https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=82', 'Students learning together in an international business classroom'],
    ['https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&auto=format&fit=crop&q=82', 'University graduates celebrating their academic achievement']
  ];
  let partnerImageIndex = 0;
  html = html.replace(new RegExp(`<img([^>]*?)src="${repeatedCampusImage.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}"([^>]*?)alt="[^"]*"([^>]*?)>`, 'g'), (match, before, middle, after) => {
    const replacement = partnerImages[Math.min(partnerImageIndex, partnerImages.length - 1)];
    partnerImageIndex += 1;
    return `<img${before}src="${replacement[0]}"${middle}alt="${replacement[1]}"${after}>`;
  });
  if (!html.includes('partner-hero-lockup" aria-label')) {
    html = html.replace(/(<header class="hero"[\s\S]*?<div class="hero-bg">[\s\S]*?<\/div>)(\s*<div class="hero-inner">)/, `$1\n  ${partnerLockup()}$2`);
    html = html.replace(/(<div class="hero-mob-img">\s*<img[^>]+>)(\s*<\/div>)/, `$1\n    ${partnerLockup(' partner-hero-mobile')}$2`);
  }
  html = html.replace('Select from eight specializations', 'Select from ten specializations');
  if (!html.includes("popup-bachelor-aviation")) {
    const cards = `
      <!-- Aviation Management -->
      <div class="tilt-card" style="padding:clamp(20px,2.5vw,28px);background:var(--white);border:1px solid var(--line);border-radius:12px;cursor:pointer;" onclick="document.getElementById('popup-bachelor-aviation').classList.add('is-visible')">
        <div style="width:48px;height:48px;border-radius:12px;background:#f1f1ef;display:flex;align-items:center;justify-content:center;margin-bottom:16px;font-size:24px;" aria-hidden="true">✈</div>
        <h3 style="font-family:var(--font-display);font-weight:700;font-size:16px;color:var(--navy);margin-bottom:6px;">Aviation Management</h3>
        <p style="font-size:13px;line-height:1.6;color:var(--ink-soft);">Lead airlines, airports and aviation operations.</p>
      </div>

      <!-- Hospitality Management -->
      <div class="tilt-card" style="padding:clamp(20px,2.5vw,28px);background:var(--white);border:1px solid var(--line);border-radius:12px;cursor:pointer;" onclick="document.getElementById('popup-bachelor-hospitality').classList.add('is-visible')">
        <div style="width:48px;height:48px;border-radius:12px;background:#f1f1ef;display:flex;align-items:center;justify-content:center;margin-bottom:16px;font-size:24px;" aria-hidden="true">◆</div>
        <h3 style="font-family:var(--font-display);font-weight:700;font-size:16px;color:var(--navy);margin-bottom:6px;">Hospitality Management</h3>
        <p style="font-size:13px;line-height:1.6;color:var(--ink-soft);">Manage exceptional hospitality experiences.</p>
      </div>
`;
    html = html.replace(/(\s*<\/div>\s*<\/div>\s*<\/section>\s*<!-- DUAL DEGREE ADVANTAGE -->)/, `\n${cards}$1`);
    const popups = `
<div class="aus-popup-overlay" id="popup-bachelor-aviation"><div class="aus-popup"><button class="aus-popup-close" onclick="this.closest('.aus-popup-overlay').classList.remove('is-visible')">&times;</button><div class="aus-popup-body"><div class="aus-popup-title">Aviation Management</div><div class="aus-popup-subtitle">Build business and operational expertise for careers across airlines, airports and the wider aviation sector through the AUS and Tiffin University dual-degree pathway.</div><div class="aus-popup-cta"><a href="/bachelors-degree/aviation-management" class="aus-popup-cta-primary">View Program</a></div></div></div></div>
<div class="aus-popup-overlay" id="popup-bachelor-hospitality"><div class="aus-popup"><button class="aus-popup-close" onclick="this.closest('.aus-popup-overlay').classList.remove('is-visible')">&times;</button><div class="aus-popup-body"><div class="aus-popup-title">Hospitality Management</div><div class="aus-popup-subtitle">Develop leadership, service and operational skills for hotels, tourism and experience-led businesses through the AUS and Tiffin University dual-degree pathway.</div><div class="aus-popup-cta"><a href="/bachelors-degree/hospitality-management" class="aus-popup-cta-primary">View Program</a></div></div></div></div>

`;
    html = html.replace('<!-- Master Specialization Popups -->', `${popups}<!-- Master Specialization Popups -->`);
  }
  return html;
}

function updateHousing(html) {
  return html
    .replace(/Single rooms from CHF 1'780\/month/g, "Starting from CHF 1'580/month")
    .replace(/Open Housing Form ↗/g, 'Reserve your Accommodation ↗');
}

function updateDiploma(html) {
  return html
    .replace(/https:\/\/images\.unsplash\.com\/photo-1501785888041-af3ef285b470\?w=1800(?:&amp;|&)auto=format(?:&amp;|&)fit=crop(?:&amp;|&)q=80/g, NEW_DIPLOMA_IMAGE)
    .replace(/alt="Accounting and finance workspace"/g, 'alt="Lake Geneva and the Swiss Riviera near Montreux"')
    .replace(/alt="Swiss Federal Diploma in Business Administration"/g, 'alt="Lake Geneva in Montreux, Switzerland"')
    .replace(/alt="Finance workspace"/g, 'alt="Lake Geneva and the Swiss Alps"');
}

function programPrefix(relative) {
  const match = relative.match(/^programs\/(bachelors|masters)\/([^/]+)\.html$/);
  if (match) return `${match[1]}-${match[2]}`;
  if (relative === 'programs/doctorate/dba.html') return 'doctorate-dba';
  if (relative === 'programs/federal-diploma.html') return 'federal-diploma';
  return null;
}

function updateRepeatedProgramImages(html, relative) {
  const prefix = programPrefix(relative);
  if (!prefix) return html;
  const urls = Object.entries(programImageUrls).filter(([name]) => name.startsWith(`${prefix}-`)).sort(([a], [b]) => a.localeCompare(b)).map(([, url]) => url);
  if (urls.length < 2) return html;
  html = html.replace(/https:\/\/images\.unsplash\.com\/photo-1506905925346-21bda4d32df4\?w=1800&auto=format&fit=crop&q=80/g, urls[0]);
  html = html.replace(/https:\/\/images\.unsplash\.com\/photo-1523240795612-9a054b0db644\?w=1800&auto=format&fit=crop&q=80/g, urls[1]);
  html = html.replace(/https:\/\/images\.unsplash\.com\/photo-1523240795612-9a054b0db644\?w=1800&auto=format&fit=crop/g, urls[1]);
  html = html.replace(/https:\/\/images\.unsplash\.com\/photo-1523240795612-9a054b0db644\?w=800&auto=format&fit=crop&q=80/g, urls[0]);
  html = html
    .replace(/alt="Swiss Alps and Lake Geneva"/g, 'alt="AUS students applying their learning"')
    .replace(/alt="AUS Campus"/g, 'alt="AUS program learning environment"')
    .replace(/alt="Students"/g, 'alt="AUS students collaborating"')
    .replace(/alt="Campus life"/g, 'alt="Student life at AUS Business School"');
  return html;
}

let changed = 0;
function writeFileWithRetry(file, contents) {
  let lastError;
  for (let attempt = 0; attempt < 12; attempt += 1) {
    try {
      fs.writeFileSync(file, contents, 'utf8');
      return;
    } catch (error) {
      lastError = error;
      if (!['UNKNOWN', 'EBUSY', 'EPERM'].includes(error.code)) throw error;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
    }
  }
  throw lastError;
}

for (const file of listHtml(root)) {
  const relative = logicalPath(file);
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  html = updateShared(html);
  if (relative === 'index.html') html = updateHomepage(html);
  if (relative === 'about/academic-partners/tiffin-university.html') html = updateTiffin(html);
  if (relative === 'housing.html') html = updateHousing(html);
  if (relative === 'programs/federal-diploma.html') html = updateDiploma(html);
  if (relative.startsWith('programs/')) html = updateRepeatedProgramImages(html, relative);
  if (html !== before) {
    writeFileWithRetry(file, html);
    changed += 1;
  }
}

console.log(`Applied contact, popup, partner, footer, housing and image updates to ${changed} HTML files.`);
