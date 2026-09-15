const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sourceFiles = [
  ...fs.readdirSync(path.join(root, 'programs', 'bachelors')).filter((name) => name.endsWith('.html')).map((name) => path.join(root, 'programs', 'bachelors', name)),
  ...fs.readdirSync(path.join(root, 'programs', 'masters')).filter((name) => name.endsWith('.html')).map((name) => path.join(root, 'programs', 'masters', name)),
  path.join(root, 'programs', 'doctorate', 'dba.html'),
  path.join(root, 'programs', 'federal-diploma.html')
];

const styles = `<style id="program-admissions-redesign-styles">
.program-admissions{position:relative;overflow:hidden;padding:clamp(58px,7vw,94px) 0;background:#f1f1ef!important}
.program-admissions::before{content:"";position:absolute;left:0;top:0;width:clamp(7px,1vw,12px);height:100%;background:var(--crimson)}
.program-admissions .wrap{position:relative;z-index:1}
.program-admissions-head{display:grid;grid-template-columns:minmax(180px,.5fr) minmax(0,1fr);gap:clamp(24px,5vw,72px);align-items:end;margin-bottom:clamp(28px,4vw,46px)}
.program-admissions-head .eyebrow{margin:0}
.program-admissions-head h2{max-width:760px;margin:0;font-family:var(--font-display);font-size:clamp(34px,4.4vw,62px);font-style:normal;font-weight:800;line-height:1.02;letter-spacing:-.035em;color:var(--navy)}
.program-admissions-head h2 span{color:var(--crimson)}
.program-admissions .adm-grid{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(280px,.8fr);gap:18px;align-items:stretch}
.program-admissions .admission-card{position:relative;min-width:0;padding:clamp(25px,3vw,38px);border:1px solid rgba(34,41,95,.13);border-radius:20px;background:#fff;box-shadow:0 18px 46px rgba(17,24,39,.07)}
.program-admissions .admission-card::before{position:absolute;right:24px;top:18px;font-family:var(--font-display);font-size:52px;font-weight:850;line-height:1;color:rgba(197,23,62,.11)}
.program-admissions .admission-card-requirements::before{content:"01"}
.program-admissions .admissions-philosophy::before{content:"02"}
.program-admissions .program-requirements{margin:0!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important}
.program-admissions .adm-req h3{max-width:calc(100% - 62px);margin:0 0 18px;font-family:var(--font-display)!important;font-size:clamp(19px,2vw,25px);font-style:normal!important;font-weight:750;line-height:1.2;color:var(--navy)}
.program-admissions .adm-req h3:first-letter{font-size:0}
.program-admissions .adm-req p{font-size:15px!important;line-height:1.75!important}
.program-admissions .adm-req ul{display:grid;gap:10px;margin:18px 0 0;padding:0;list-style:none}
.program-admissions .adm-req li{position:relative;padding:13px 14px 13px 38px;border-radius:10px;background:#f1f1ef;font-size:14px;line-height:1.55;color:var(--ink-soft)}
.program-admissions .adm-req li::before{content:"✓";position:absolute;left:14px;top:13px;color:var(--crimson);font-weight:900}
.program-admissions .admissions-support{display:flex;align-items:center;justify-content:space-between;gap:22px;margin-top:18px;padding:20px 22px;border:1px solid rgba(34,41,95,.13);border-radius:16px;background:#fff}
.program-admissions .admissions-support p{max-width:58ch;margin:0;color:var(--ink-soft);font-size:14px;line-height:1.6}
.program-admissions .admissions-support-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap;flex-shrink:0}
.program-admissions .admissions-support a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:11px 17px;border-radius:999px;font-family:var(--font-display);font-size:13px;font-weight:750;text-decoration:none}
.program-admissions .admissions-support-primary{background:var(--crimson);color:#fff}
.program-admissions .admissions-support-secondary{border:1px solid rgba(34,41,95,.24);color:var(--navy);background:#fff}
@media(max-width:760px){
  .program-admissions{padding:50px 0}
  .program-admissions-head{grid-template-columns:1fr;gap:13px;margin-bottom:25px}
  .program-admissions-head h2{font-size:clamp(32px,10vw,46px)}
  .program-admissions .adm-grid{grid-template-columns:1fr!important}
  .program-admissions .admission-card{padding:24px 20px}
  .program-admissions .admissions-support{align-items:stretch;flex-direction:column;padding:20px}
  .program-admissions .admissions-support-actions{display:grid;grid-template-columns:1fr;width:100%}
  .program-admissions .admissions-support a{width:100%}
}
</style>`;

function redesignAdmissions(html) {
  const marker = '<!-- NEXT INTAKE -->';
  const sectionStart = html.indexOf('<section class="admissions"');
  const markerIndex = html.indexOf(marker, sectionStart);
  if (sectionStart < 0 || markerIndex < 0) return html;

  const sectionEnd = html.lastIndexOf('</section>', markerIndex);
  if (sectionEnd < sectionStart) return html;
  let section = html.slice(sectionStart, sectionEnd + 10);
  section = section.replace('<section class="admissions"', '<section class="admissions program-admissions"');
  section = section.replace(/\n\s*<div style="position:absolute;inset:0;z-index:0;">[\s\S]*?<\/div>\s*(?=<div class="wrap")/, '\n  ');
  section = section.replace(
    /(<div class="wrap"[^>]*>)/,
    `$1\n    <div class="program-admissions-head reveal"><span class="eyebrow">Admissions</span><h2>Join a community built for <span>ambition.</span></h2></div>`
  );
  section = section.replace(/\s*<span class="eyebrow">Admissions<\/span>\s*<h2[^>]*>Join the AUS Community<\/h2>/, '');
  section = section.replace('<div class="reveal">', '<div class="admission-card admission-card-requirements reveal">');
  section = section.replace('<div class="adm-req" style="margin-bottom:20px;">', '<div class="adm-req program-requirements">');
  section = section.replace('<div class="adm-req reveal d1">', '<div class="adm-req admission-card admissions-philosophy reveal d1">');
  section = section.replace(/\n\s*<\/div>\s*<\/section>$/, `
    <div class="admissions-support reveal d2">
      <p>Not sure whether your background meets the entry requirements? Our admissions team can review your profile and guide your next step.</p>
      <div class="admissions-support-actions">
        <a class="admissions-support-primary" href="/admissions-financing">Review Admissions</a>
        <a class="admissions-support-secondary" href="https://meetings-eu1.hubspot.com/jonathan-hilton/advisory-session">Speak with an Advisor</a>
      </div>
    </div>
  </div>
</section>`);
  return html.slice(0, sectionStart) + section + html.slice(sectionEnd + 10);
}

const heroAdmissionsCta = `<a href="/admissions-financing" class="hero-cta hero-cta-primary">View Admissions
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>`;

function updateHeroActions(html) {
  html = html.replace(/<a\b(?=[^>]*class="[^"]*hero-cta-primary[^"]*")[^>]*>(?:(?!<\/a>)[\s\S])*<\/a>/g, '');
  html = html.replace(
    /(<div class="hero-row reveal d2">\s*)(<a\b[^>]*class="hero-cta hero-cta-secondary")/,
    `$1${heroAdmissionsCta}\n      $2`
  );
  html = html.replace(
    /(<div class="hero-mob-ctas">\s*)(<a\b[^>]*class="hero-cta hero-cta-secondary")/,
    `$1${heroAdmissionsCta}\n      $2`
  );
  return html;
}

function restoreNextIntakeApply(html) {
  const marker = '<!-- NEXT INTAKE -->';
  const markerIndex = html.indexOf(marker);
  if (markerIndex < 0) return html;
  const sectionStart = html.indexOf('<section', markerIndex);
  const sectionEnd = html.indexOf('</section>', sectionStart);
  if (sectionStart < 0 || sectionEnd < 0) return html;
  let section = html.slice(sectionStart, sectionEnd + 10);
  if (/href="https:\/\/study\.aus\.swiss\/application"[^>]*>\s*Apply Now\s*<\/a>/.test(section)) return html;
  section = section.replace(
    /\s*<\/div>\s*<\/section>$/,
    `\n    <div style="display:flex;gap:12px;"><a href="https://study.aus.swiss/application" class="cta-btn">Apply Now</a></div>\n  </div>\n</section>`
  );
  return html.slice(0, sectionStart) + section + html.slice(sectionEnd + 10);
}

function update(html) {
  html = html.replaceAll('href="/admissions"', 'href="/admissions-financing"');
  html = html.replace(/<style id="program-admissions-redesign-styles">[\s\S]*?<\/style>/, styles);
  if (!html.includes('program-admissions-redesign-styles')) html = html.replace('</head>', `${styles}\n</head>`);
  html = redesignAdmissions(html);
  html = updateHeroActions(html);
  html = html.replace(/<div style="display:flex;gap:12px;">\s*<\/div>/g, '');
  html = restoreNextIntakeApply(html);
  return html;
}

let changed = 0;
for (const file of sourceFiles) {
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, 'utf8');
  const after = update(before);
  if (after !== before) {
    fs.writeFileSync(file, after);
    changed += 1;
  }
}

console.log(`Updated ${changed} inner program pages.`);
