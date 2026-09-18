const fs = require('fs');
const path = require('path');
const { applyMetadata } = require('./apply-seo-metadata');
const { rebuild } = require('./rebuild-search-index');

const root = path.resolve(__dirname, '..');

// The shell (preloader, navigation, side panel, footer, shared CSS and scripts) is cloned from an
// existing page so every landing page inherits the current site design without duplicating it here.
const templatePath = path.join(root, 'housing.html');
const templateStyleIds = ['housing-page', 'housing-gallery-update'];

// The section navigator (archive tab) lives in the page shell between the preloader and the
// navigation. The shell used as a template does not ship the markup, so it is injected on build.
const archiveTabMarkup = `<!-- ARCHIVE INDEX TAB (section navigator) -->
<div class="archive-tab" id="archiveTab" tabindex="0">
  <span class="archive-tab-num" id="archiveTabNum">01</span>
  <span class="archive-tab-label" id="archiveTabLabel">Study in Switzerland</span>
  <nav class="archive-tab-toc" id="archiveTabToc" aria-label="Jump to chapter"></nav>
</div>`;

const qsBadgeBase = 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/';

const images = {
  hero: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6a326d5971bd7053927eaf90_American%20Institute%20of%20Applied%20Sciences%20in%20Switzerland%20-%20Campus%20main%20picture%202025%20lr.jpg',
  switzerland: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa7a8ffc8165c3077529ecb_campus-life.webp',
  qsOverall: `${qsBadgeBase}6aaa4e3f4418e5d34460a4b9_uni-overall-4star.png`,
  qsTeaching: `${qsBadgeBase}6aaa4e475ce4a1e586596e0b_uni-teaching-5star.png`,
  qsBusiness: `${qsBadgeBase}6aaa4e3e3fa8453f22552d15_uni-business_management_studies-5star.png`,
  qsFacilities: `${qsBadgeBase}6aaa4e3f2a3a2eeaf431221c_uni-facilities-4star.png`,
  qsEmployability: `${qsBadgeBase}6aaa4e3f95236a4b23054dae_uni-employability-4star.png`,
  rankTwo: `${qsBadgeBase}6aaa549701ac3c9c1e1b9a35_rank%202.png`,
  rankTwoHundred: `${qsBadgeBase}6aaa549c9a50844e7214c1a4_rank%20200.png`
};

const bookingUrl = 'https://meetings-eu1.hubspot.com/jonathan-hilton/advisory-session';
const rankingsUrl = 'https://www.topuniversities.com/universities/american-institute-applied-sciences-switzerland';
const brochureDownloadUrl = 'https://share-eu1.hsforms.com/1_N5NamNWRLeBrDAYfIYx7Qfwv24';
const brochurePortalId = '26727484';
const brochureFormId = 'fcde4d6a-6356-44b7-81ac-30187c8631ed';

// Webflow's CDN generates resized variants on upload. Serving the 1600px variant keeps the hero
// under half a megabyte instead of the multi-megabyte original, with no visible loss at these sizes.
const heroVariant = (url) => url.replace(/(\.[a-z]+)$/i, '-p-1600$1');

function section(attributes, inner) {
  return `<section${attributes}>\n  <div class="wrap">${inner}\n  </div></section>`;
}

function levelCard({ tag, title, forWhom, price, period, duration, subjects, note }) {
  const list = subjects.map((subject) => `<li>${subject}</li>`).join('');
  return `<article class="lp-level-card">
      <span class="lp-level-tag">${tag}</span>
      <h3>${title}</h3>
      ${forWhom ? `<p class="lp-level-for">${forWhom}</p>` : ''}
      <div class="lp-price">${price}<span>${period}</span></div>
      <p class="lp-level-duration">${duration}</p>
      <ul class="lp-subject-list">${list}</ul>
      ${note ? `<p class="lp-level-note">${note}</p>` : ''}
    </article>`;
}

// The Bachelor's degree is one programme with ten specializations. Nine are tuition-only at
// CHF 28'000 and Hospitality Management is the all-inclusive package at CHF 30'000, so both prices
// are shown inside the same card instead of as two competing "levels".
const bachelorStandardSubjects = [
  'Accounting',
  'Aviation Management',
  'Business Management',
  'Healthcare Administration',
  'Human Resource Management',
  'Integrated &amp; Digital Marketing',
  'International Business',
  'Sports Management – Athletic Administration',
  'Sports Management – Sports Marketing'
];

// One programme presented in full width: the left half is the curriculum and the key study facts,
// the right half is the one thing that makes this programme different (a package, IATA credentials).
function wideLevelCard({ tag, title, forWhom, from, price, period, duration, facts, chipsTitle, chips, chipsNote, highlightTag, highlightTitle, highlightNote, highlightItems, highlightFoot }) {
  const chipList = chips.map((chip) => `<li>${chip}</li>`).join('');
  const factList = (facts || [])
    .map((fact) => `<div><dt>${fact.label}</dt><dd>${fact.value}</dd></div>`)
    .join('');
  return `<article class="lp-level-card lp-level-wide">
      <div class="lp-level-wide-top">
        <div>
          <span class="lp-level-tag">${tag}</span>
          <h3>${title}</h3>
          <p class="lp-level-for">${forWhom}</p>
        </div>
        <div class="lp-level-wide-price">
          <div class="lp-price">${from ? '<em>from</em> ' : ''}${price}<span>${period}</span></div>
          <p class="lp-level-duration">${duration}</p>
        </div>
      </div>
      <div class="lp-level-wide-body">
        <div class="lp-variant">
          ${factList ? `<dl class="lp-facts">${factList}</dl>` : ''}
          <h4>${chipsTitle}</h4>
          <ul class="lp-subject-list">${chipList}</ul>
          ${chipsNote ? `<p class="lp-variant-note">${chipsNote}</p>` : ''}
        </div>
        <div class="lp-variant lp-variant-package">
          <span class="lp-level-tag on-package">${highlightTag}</span>
          <h4>${highlightTitle}</h4>
          ${highlightNote ? `<p class="lp-variant-note">${highlightNote}</p>` : ''}
          <ul class="lp-checklist">${highlightItems.map((item) => `<li>${item}</li>`).join('')}</ul>
          ${highlightFoot ? `<p class="lp-package-excluded">${highlightFoot}</p>` : ''}
        </div>
      </div>
    </article>`;
}

function bachelorCard() {
  return wideLevelCard({
    tag: "Bachelor's Degree",
    title: 'BSc in Business Administration',
    forWhom: 'For school leavers and transfer students starting a first degree. Three years, nine academic terms, taught entirely in English.',
    from: true,
    price: "CHF 28'000",
    period: 'per year',
    duration: '3 years · 10 specializations, two price points',
    chipsTitle: "Nine specializations at CHF 28'000 per year",
    chips: bachelorStandardSubjects,
    chipsNote: 'Tuition only. Accommodation, insurance and daily living are arranged and paid separately, which is why this price is lower.',
    highlightTag: 'All-inclusive package',
    highlightTitle: "Hospitality Management at CHF 30'000 per year",
    highlightNote: 'The tenth specialization, priced as a single annual package rather than tuition alone:',
    highlightItems: [
      '<strong>Accommodation</strong> — a shared room with shared bathroom. Other room options are available at an additional fee.',
      '<strong>Health insurance</strong> — the Swiss mandatory LAMal basic coverage, arranged on your behalf.',
      '<strong>Transport</strong> — a public transport pass covering your daily commute from school accommodation to campus.',
      '<strong>Residence permit</strong> — the Swiss residence permit fees set by the local cantonal authorities.'
    ],
    highlightFoot: '<strong>Not included:</strong> food, visa fees and extra-curricular activities.'
  });
}

function uspCard({ number, title, copy }) {
  return `<article class="lp-usp-card">
      <span class="lp-usp-num">${number}</span>
      <h3>${title}</h3>
      <p>${copy}</p>
    </article>`;
}

function factCard({ title, copy }) {
  return `<article class="lp-fact-card"><h3>${title}</h3><p>${copy}</p></article>`;
}

// Shared design system. Every landing page reuses the same shell, section rhythm, card, cost panel
// and CTA components, so the pages cannot drift apart as they are edited.
const sharedStyles = `
.lp-hero{position:relative;min-height:min(780px,90vh);display:flex;align-items:flex-end;overflow:hidden;background:#111827;color:#fff}
.lp-hero-media{position:absolute;inset:0}
.lp-hero-media img{width:100%;height:100%;object-fit:cover}
.lp-hero-media::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(17,24,39,.9) 0%,rgba(17,24,39,.6) 55%,rgba(17,24,39,.22) 100%),linear-gradient(0deg,rgba(17,24,39,.82),transparent 58%)}
.lp-hero-content{position:relative;z-index:1;width:100%;padding:clamp(126px,18vh,196px) 0 clamp(56px,8vw,96px)}
.lp-hero h1{max-width:940px;margin:13px 0 20px;font-family:var(--font-display);font-size:clamp(40px,6.4vw,80px);font-weight:850;line-height:.98;letter-spacing:-.042em;color:#fff}
.lp-hero h1 em{font-family:var(--font-serif);font-weight:400;font-style:italic}
.lp-hero p{max-width:660px;margin:0;font-size:clamp(16px,1.5vw,20px);line-height:1.7;color:rgba(255,255,255,.87)}
.lp-hero-meta{display:flex;flex-wrap:wrap;gap:10px;margin-top:26px}
.lp-hero-meta span{display:inline-flex;align-items:center;padding:8px 13px;border:1px solid rgba(255,255,255,.28);border-radius:999px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.9)}
.lp-hero-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:32px}
.lp-btn{display:inline-flex;align-items:center;justify-content:center;min-height:50px;padding:14px 24px;border-radius:999px;font-family:inherit;font-size:15px;font-weight:750;text-decoration:none;border:1px solid transparent;transition:transform .3s var(--ease),box-shadow .3s var(--ease),background .3s var(--ease)}
.lp-btn:hover{transform:translateY(-2px)}
.lp-btn.primary{background:var(--crimson);color:#fff;box-shadow:0 14px 34px rgba(190,31,61,.32)}
.lp-btn.secondary{border-color:rgba(255,255,255,.36);color:#fff;background:rgba(255,255,255,.06)}
.lp-btn.dark{border-color:rgba(34,41,95,.25);color:var(--navy);background:#fff}
.lp-btn.crimson{background:var(--crimson);color:#fff}
.lp-hero,.lp-section,.lp-cta{scroll-margin-top:clamp(76px,8vw,104px)}
.lp-section{padding:clamp(58px,7vw,98px) 0}
.lp-section.alt{background:var(--paper)}
.lp-section-head{max-width:760px}
.lp-section h2{margin:12px 0 0;font-family:var(--font-display);font-size:clamp(32px,4.4vw,56px);font-weight:820;line-height:1.04;letter-spacing:-.035em;color:var(--navy)}
.lp-lead{margin:18px 0 0;color:var(--ink-soft);font-size:17px;line-height:1.75}
.lp-level-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;margin-top:clamp(34px,5vw,54px)}
.lp-level-card{display:flex;flex-direction:column;padding:clamp(24px,3vw,34px);border:1px solid rgba(34,41,95,.14);border-radius:20px;background:#fff;box-shadow:0 16px 42px rgba(17,24,39,.06)}
.lp-level-wide{grid-column:1/-1}
.lp-level-for{margin:12px 0 0;color:var(--ink-soft);font-size:14.5px;line-height:1.7}
.lp-level-wide-top{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:clamp(18px,3vw,44px);align-items:end;padding-bottom:clamp(20px,2.6vw,30px);border-bottom:1px solid rgba(34,41,95,.14)}
.lp-level-wide-price{text-align:right}
.lp-level-wide-body{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(20px,3vw,44px);margin-top:clamp(20px,2.6vw,30px)}
.lp-variant{display:flex;flex-direction:column}
.lp-variant h4{margin:0 0 14px;font-family:var(--font-display);font-size:17.5px;color:var(--navy)}
.lp-variant .lp-subject-list{margin-top:0}
.lp-variant-note{margin:14px 0 0;color:var(--ink-soft);font-size:13.5px;line-height:1.65}
.lp-variant-package{padding:clamp(18px,2.4vw,26px);border:1px solid rgba(190,31,61,.3);border-radius:16px;background:rgba(190,31,61,.045)}
.lp-variant-package .lp-checklist{margin-top:14px}
.lp-variant-package .lp-checklist li{font-size:14px}
.lp-variant-package .lp-checklist li strong{color:var(--navy)}
.lp-level-tag.on-package{background:#fff}
.lp-package-excluded{margin:14px 0 0;color:var(--ink-soft);font-size:13.5px;line-height:1.6}
.lp-level-tag{align-self:flex-start;padding:6px 11px;border-radius:999px;background:var(--paper);color:var(--crimson);font-size:11px;font-weight:800;letter-spacing:.09em;text-transform:uppercase}
.lp-level-card h3{margin:16px 0 6px;font-family:var(--font-display);font-size:clamp(21px,2.1vw,26px);color:var(--navy)}
.lp-price{margin-top:6px;font-family:var(--font-display);font-size:clamp(30px,3.4vw,40px);font-weight:820;letter-spacing:-.03em;color:var(--navy)}
.lp-price em{margin-right:7px;font-family:var(--font-body);font-size:14px;font-weight:700;font-style:normal;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-soft)}
.lp-price span{margin-left:8px;font-family:var(--font-body);font-size:13px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--ink-soft)}
.lp-level-duration{margin:6px 0 0;color:var(--ink-soft);font-size:13px;font-weight:700;letter-spacing:.05em;text-transform:uppercase}
.lp-subject-list{display:flex;flex-wrap:wrap;gap:7px;margin:20px 0 0;padding:0;list-style:none}
.lp-subject-list li{padding:5px 10px;border:1px solid rgba(34,41,95,.14);border-radius:999px;font-size:12.5px;color:var(--ink-soft)}
.lp-level-note{margin:16px 0 0;color:var(--ink-soft);font-size:13.5px;line-height:1.6}
.lp-text-link{color:var(--crimson);font-weight:700;text-decoration:underline;text-underline-offset:3px}
.lp-text-link:hover{color:var(--navy)}
.lp-tuition-strip{margin-top:clamp(22px,2.8vw,30px);padding:clamp(6px,1vw,10px) clamp(18px,2.2vw,24px);border:1px solid rgba(34,41,95,.14);border-radius:16px;background:#fff}
.lp-tuition-strip div{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:6px 14px;padding:12px 0;border-bottom:1px solid rgba(34,41,95,.1)}
.lp-tuition-strip div:last-child{border-bottom:0}
.lp-tuition-strip span{color:var(--ink-soft);font-size:14px;line-height:1.5}
.lp-tuition-strip strong{font-family:var(--font-display);font-size:clamp(17px,1.8vw,21px);color:var(--navy);white-space:nowrap}
.lp-tuition-strip-note{margin:14px 0 0;color:var(--ink-soft);font-size:13px;line-height:1.65}
.lp-costs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(22px,3vw,46px);margin-top:clamp(30px,4vw,46px);padding:clamp(26px,3.2vw,42px);border-radius:22px;background:#111827;color:#fff}
.lp-cost-group h3{margin:0 0 16px;font-family:var(--font-display);font-size:clamp(19px,2vw,23px);color:#fff}
.lp-cost-group+.lp-cost-group{padding-left:clamp(22px,3vw,46px);border-left:1px solid rgba(255,255,255,.14)}
.lp-cost-list{margin:0;padding:0;list-style:none;display:grid;gap:12px}
.lp-cost-list li{display:grid;grid-template-columns:auto minmax(0,1fr);gap:14px;align-items:baseline;padding:14px 16px;border:1px solid rgba(255,255,255,.16);border-radius:14px;background:rgba(255,255,255,.05)}
.lp-cost-amount{font-family:var(--font-display);font-size:clamp(18px,1.9vw,22px);font-weight:800;color:#fff;white-space:nowrap}
.lp-cost-label{color:rgba(255,255,255,.78);font-size:14.5px;line-height:1.6}
.lp-costs-note{margin:clamp(20px,2.6vw,30px) 0 0;color:var(--ink-soft);font-size:15px;line-height:1.75}
.lp-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(24px,4vw,56px);align-items:center}
.lp-split.reverse .lp-split-media{order:2}
.lp-split-media img{display:block;width:100%;height:100%;min-height:280px;object-fit:cover;border-radius:20px}
.lp-split-copy p{margin:0 0 16px;color:var(--ink-soft);font-size:16.5px;line-height:1.8}
.lp-split-copy p:last-child{margin-bottom:0}
.lp-fact-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-top:clamp(34px,5vw,54px)}
.lp-fact-card{padding:clamp(22px,2.6vw,30px);border:1px solid rgba(34,41,95,.14);border-radius:18px;background:#fff}
.lp-fact-card h3{margin:0 0 10px;font-family:var(--font-display);font-size:19px;color:var(--navy)}
.lp-fact-card p{margin:0;color:var(--ink-soft);font-size:14px;line-height:1.7}
.lp-usp-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin-top:clamp(34px,5vw,54px)}
.lp-usp-card{padding:clamp(24px,2.8vw,34px);border:1px solid rgba(34,41,95,.14);border-radius:18px;background:#fff}
.lp-usp-num{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:var(--paper);color:var(--crimson);font-size:13px;font-weight:800}
.lp-usp-card h3{margin:16px 0 10px;font-family:var(--font-display);font-size:20px;color:var(--navy)}
.lp-usp-card p{margin:0;color:var(--ink-soft);font-size:14.5px;line-height:1.75}
.lp-qs-panel{display:grid;gap:clamp(26px,3.4vw,40px);margin-top:clamp(30px,4vw,48px);padding:clamp(24px,3vw,40px);border:1px solid rgba(34,41,95,.14);border-radius:22px;background:#fff}
.lp-qs-group{display:grid;justify-items:center}
.lp-qs-title{display:block;margin-bottom:clamp(16px,2vw,22px);font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--ink-soft);text-align:center}
.lp-qs-stars{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:clamp(12px,2vw,26px);width:100%}
.lp-qs-stars img{display:block;height:clamp(104px,13vw,190px);width:auto;max-width:100%;object-fit:contain}
.lp-qs-ranks{display:grid;grid-template-columns:repeat(2,minmax(0,152px));gap:clamp(14px,2vw,26px);align-items:center;justify-items:center;justify-content:center}
.lp-qs-ranks img{display:block;width:100%;height:auto}
.lp-qs-stars a,.lp-qs-ranks a{display:block;line-height:0;border-radius:12px;transition:transform .3s var(--ease)}
.lp-qs-ranks a{width:100%}
.lp-qs-stars a:hover,.lp-qs-ranks a:hover{transform:translateY(-3px)}
.lp-qs-stars a:focus-visible,.lp-qs-ranks a:focus-visible{outline:2px solid var(--crimson);outline-offset:3px}
.lp-form-layout{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:clamp(24px,4vw,54px);align-items:start}
.lp-form-panel{padding:clamp(22px,2.8vw,34px);border:1px solid rgba(34,41,95,.14);border-radius:22px;background:#fff;box-shadow:0 22px 54px rgba(17,24,39,.08)}
.lp-form-target{min-height:320px}
.lp-form-target:empty::before{content:"Loading the brochure request form…";display:block;padding:34px 8px;text-align:center;color:var(--ink-soft);font-size:14px}
.lp-form-note{margin:16px 0 0;color:var(--ink-soft);font-size:12.5px;line-height:1.6}
.lp-checklist{margin:0;padding:0;list-style:none;display:grid;gap:12px}
.lp-checklist li{display:flex;gap:11px;align-items:flex-start;color:var(--ink-soft);font-size:15px;line-height:1.65}
.lp-checklist li::before{content:"";flex:0 0 auto;width:9px;height:9px;margin-top:8px;border-radius:50%;background:var(--crimson)}
.lp-cta{padding:clamp(60px,7.5vw,104px) 0;background:#111827;color:#fff;text-align:center}
.lp-cta h2{max-width:760px;margin:0 auto 16px;font-family:var(--font-display);font-size:clamp(32px,4.6vw,58px);font-weight:820;line-height:1.04;color:#fff}
.lp-cta p{max-width:620px;margin:0 auto;color:rgba(255,255,255,.82);font-size:17px;line-height:1.75}
.lp-cta-actions{display:flex;justify-content:center;flex-wrap:wrap;gap:12px;margin-top:30px}
.lp-disclaimer{margin:22px 0 0;color:var(--ink-soft);font-size:13px;line-height:1.7}
@media(max-width:1100px){.lp-level-grid{grid-template-columns:1fr}}
@media(max-width:980px){.lp-level-grid,.lp-usp-grid{grid-template-columns:1fr}.lp-costs,.lp-split,.lp-form-layout,.lp-level-wide-top,.lp-level-wide-body{grid-template-columns:1fr}.lp-cost-group+.lp-cost-group{padding-left:0;border-left:0;border-top:1px solid rgba(255,255,255,.14);padding-top:clamp(22px,3vw,32px)}.lp-level-wide-price{text-align:left}.lp-split.reverse .lp-split-media{order:0}.lp-fact-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:980px){.lp-qs-ranks{grid-template-columns:repeat(2,minmax(0,140px))}}
@media(max-width:760px){.lp-hero{min-height:640px}.lp-hero h1{font-size:clamp(36px,10.5vw,54px)}.lp-hero-media::after{background:linear-gradient(0deg,rgba(17,24,39,.94),rgba(17,24,39,.34) 80%)}.lp-hero-content{padding:124px 0 52px}.lp-hero-actions,.lp-cta-actions{display:grid}.lp-hero-actions .lp-btn,.lp-cta-actions .lp-btn{width:min(100%,380px);justify-self:center}.lp-fact-grid{grid-template-columns:1fr}.lp-section h2{font-size:clamp(28px,7.4vw,40px)}.lp-qs-stars img{height:clamp(96px,22vw,160px)}.lp-qs-ranks{grid-template-columns:repeat(2,minmax(0,132px));gap:14px}}
@media(max-width:480px){.lp-level-card{border-radius:14px}.lp-costs{border-radius:16px}.lp-qs-panel{padding:20px 16px}.lp-qs-ranks{grid-template-columns:repeat(2,minmax(0,124px))}}
`;

// Extra components used by the Aviation Management page (fact lists, career panels, media row).
const aviationStyles = `
.lp-facts{margin:0 0 22px;display:grid;gap:0}
.lp-facts>div{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:12px;padding:9px 0;border-bottom:1px solid rgba(34,41,95,.1)}
.lp-facts>div:last-child{border-bottom:0}
.lp-facts dt{margin:0;font-size:12.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-soft)}
.lp-facts dd{margin:0;font-size:14.5px;font-weight:600;line-height:1.5;color:var(--navy)}
.lp-split-copy h3{margin:0 0 14px;font-family:var(--font-display);font-size:clamp(20px,2.2vw,24px);color:var(--navy)}
.lp-career-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin-top:clamp(30px,4vw,46px)}
.lp-career-panel{padding:clamp(24px,2.8vw,34px);border:1px solid rgba(34,41,95,.14);border-radius:18px;background:#fff}
.lp-career-panel h3{margin:0 0 8px;font-family:var(--font-display);font-size:20px;color:var(--navy)}
.lp-career-panel>p{margin:0 0 18px;color:var(--ink-soft);font-size:14.5px;line-height:1.7}
.lp-career-panel .lp-checklist li{font-size:14.5px}
.lp-career-panel .lp-checklist li strong{color:var(--navy)}
.lp-media-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-top:clamp(30px,4vw,46px)}
.lp-media-card{margin:0}
.lp-media-card img{display:block;width:100%;height:clamp(180px,20vw,250px);object-fit:cover;border-radius:16px}
.lp-media-card figcaption{margin-top:10px;color:var(--ink-soft);font-size:13.5px;line-height:1.6}
.lp-media-card figcaption strong{display:block;margin-bottom:2px;color:var(--navy);font-size:14.5px}
@media(max-width:980px){.lp-career-grid,.lp-media-grid{grid-template-columns:1fr}}
@media(max-width:620px){.lp-media-grid{grid-template-columns:1fr}.lp-facts>div{grid-template-columns:1fr;gap:3px}}
`;

const studyInSwitzerland = {
  slug: 'study-in-switzerland',
  templateStyleIds,
  title: 'Study Business in Switzerland | AUS Business School',
  description: 'Study business in Switzerland at AUS Business School on Lake Geneva. Compare Bachelor, Master and DBA programs, annual tuition and funding, then request a brochure.',
  styles: sharedStyles,
  content: `<header class="lp-hero" data-chapter="01" data-chapter-label="Study in Switzerland">
  <div class="lp-hero-media"><img fetchpriority="high" loading="eager" decoding="async" src="${heroVariant(images.hero)}" alt="AUS Business School campus in La Tour-de-Peilz, Switzerland"></div>
  <div class="lp-hero-content"><div class="wrap">
    <span class="eyebrow on-navy">International Students</span>
    <h1>Study at a <em>Business School</em> in Switzerland.</h1>
    <p>AUS Business School is the American Institute of Applied Sciences in Switzerland: an English-taught school on Lake Geneva with small classes and practice-led learning.</p>
    <div class="lp-hero-meta"><span>Established 1991</span><span>English-taught</span><span>Swiss Riviera</span></div>
    <div class="lp-hero-actions">
      <a class="lp-btn primary" href="#request-brochure">Request the Brochure</a>
    </div>
  </div></div>
</header>
<main>
${section(
  ' class="lp-section alt" id="request-brochure" data-chapter="02" data-chapter-label="Request a Brochure"',
  `
    <div class="lp-form-layout">
      <div>
        <span class="eyebrow">Programme Brochure</span>
        <h2>Request the AUS brochure.</h2>
        <p class="lp-lead">Tell us where you are in your planning and we will send the brochure, tuition details and the next steps for your intake.</p>
        <div class="lp-tuition-strip">
          <div><span>Annual tuition, Bachelor's to DBA</span><strong>CHF 25'050 – 30'000</strong></div>
          <div><span>One-time application and admission fees</span><strong>CHF 1'750</strong></div>
          <div><span>Funds to show for the Swiss permit</span><strong>CHF 25'000</strong></div>
        </div>
        <p class="lp-tuition-strip-note">Tuition is charged per academic year. The permit amount is proof of funds you keep, not a payment to AUS — the full breakdown is in the next section.</p>
        <ul class="lp-checklist">
          <li>Program overviews across Bachelor, Master, DBA and Federal Diploma levels</li>
          <li>Annual tuition, scholarships and payment information</li>
          <li>Admission requirements and the documents you will need</li>
          <li>Guidance on the Swiss student permit and living costs</li>
        </ul>
        <p class="lp-disclaimer">Prefer to speak with someone first? <a class="lp-text-link" href="${bookingUrl}" target="_blank" rel="noopener noreferrer">Book a call with an admissions advisor</a>.</p>
      </div>
      <div class="lp-form-panel">
        <div class="lp-form-target" id="aus-brochure-form"></div>
        <script charset="utf-8" type="text/javascript" src="https://js-eu1.hsforms.net/forms/embed/v2.js"></script>
        <script>
          hbspt.forms.create({
            portalId: "${brochurePortalId}",
            formId: "${brochureFormId}",
            region: "eu1",
            target: "#aus-brochure-form"
          });
        </script>
        <p class="lp-form-note">Your details are used to send the brochure and relevant admissions guidance. You can ask us to stop contacting you at any time. Prefer a standalone page? <a class="lp-text-link" href="${brochureDownloadUrl}" target="_blank" rel="noopener noreferrer">Open the brochure form</a>.</p>
      </div>
    </div>
`
)}
${section(
  ' class="lp-section" id="programs" data-chapter="03" data-chapter-label="Programs &amp; Tuition"',
  `
    <div class="lp-section-head"><span class="eyebrow">Programs &amp; Tuition</span><h2>Four levels. One clear price each.</h2><p class="lp-lead">Start with the level that matches where you are now, then read the two costs that sit beyond tuition. Every figure is per academic year and confirmed in your offer letter.</p></div>
    <div class="lp-level-grid">
      ${bachelorCard()}
      ${levelCard({
        tag: "Master's Degree",
        title: 'MSc specializations',
        forWhom: 'For graduates building a specialist career, or career changers with a first degree.',
        price: "CHF 25'050",
        period: 'per year',
        duration: '2 years · 9 specializations',
        subjects: ['Aviation Management', 'Data Analytics', 'Finance', 'Healthcare Administration', 'Human Resource Management', 'International Business', 'Leadership &amp; Change', 'Sports Management', 'Strategic Brand &amp; Digital Marketing'],
        note: 'Tuition only. Accommodation, insurance and daily living are arranged separately.'
      })}
      ${levelCard({
        tag: 'Doctorate',
        title: 'Doctor of Business Administration',
        forWhom: 'For experienced professionals who already hold a master’s degree.',
        price: "CHF 26'000",
        period: 'per year',
        duration: 'Executive doctorate',
        subjects: ['Applied research', 'Leadership', 'Doctoral dissertation'],
        note: 'Built around your current role, with a doctoral dissertation.'
      })}
      ${levelCard({
        tag: 'Federal Diploma',
        title: 'Swiss Federal Diploma in Business Administration',
        forWhom: 'For working professionals who need a nationally recognized Swiss qualification.',
        price: "CHF 28'000",
        period: 'per year',
        duration: 'Part-time',
        subjects: ['Swiss-recognized', 'Part-time', 'Practice-led'],
        note: 'Delivered part-time around your job.'
      })}
    </div>
    <div class="lp-costs">
      <div class="lp-cost-group">
        <h3>Paid to AUS, once</h3>
        <ul class="lp-cost-list">
          <li><span class="lp-cost-amount">CHF 250</span><span class="lp-cost-label">Application fee, paid when you apply.</span></li>
          <li><span class="lp-cost-amount">CHF 1'500</span><span class="lp-cost-label">Admission fee, paid when you accept your place.</span></li>
        </ul>
      </div>
      <div class="lp-cost-group">
        <h3>Shown or arranged, not paid to AUS</h3>
        <ul class="lp-cost-list">
          <li><span class="lp-cost-amount">CHF 25'000</span><span class="lp-cost-label">Available funds you must prove per year for the Swiss student permit. This is your own money for living costs, not a fee.</span></li>
          <li><span class="lp-cost-amount">Varies</span><span class="lp-cost-label">Accommodation, food, health insurance and local travel. Covered by the Hospitality package, arranged separately for every other program.</span></li>
        </ul>
      </div>
    </div>
    <p class="lp-costs-note">Estimate your own total with <a class="lp-text-link" href="cost-calculator.html">the cost calculator</a>, read how <a class="lp-text-link" href="tuition-fees-scholarships.html">tuition, fees and scholarships</a> work, or see every program and entry requirement on <a class="lp-text-link" href="programs.html">the programs page</a>.</p>
    <p class="lp-disclaimer">AUS scholarships reduce tuition by up to 30% and are awarded on merit (a minimum GPA of 3.2 for bachelor and 3.5 for master applicants) or on demonstrated financial need. Awards depend on available funds and continued eligibility. Tuition and fee figures are reviewed regularly and your offer letter confirms the amounts that apply to you.</p>
`
)}
${section(
  ' class="lp-section" id="switzerland" data-chapter="04" data-chapter-label="Why Switzerland"',
  `
    <div class="lp-split">
      <div class="lp-split-copy"><span class="eyebrow">Life in Switzerland</span><h2>A small country with remarkable range.</h2><p>Switzerland sits at the centre of Europe. From La Tour-de-Peilz you are on the Swiss Riviera, on the shore of Lake Geneva, with the Alps behind you and Geneva and Lausanne within easy reach by train.</p><p>Daily life is safe, orderly and well connected. Trains, buses and boats link the towns along the lake, so students travel car-free between campus, housing and the region.</p><p>Locally, French is the everyday language. At AUS, everything is taught in English, which is why students arrive from across the world and settle in quickly.</p></div>
      <div class="lp-split-media"><img loading="lazy" decoding="async" src="${images.switzerland}" alt="Campus life on the Swiss Riviera"></div>
    </div>
    <div class="lp-fact-grid">
      ${factCard({ title: 'At the centre of Europe', copy: 'Paris, Milan, Munich and Zurich are reachable by train, which makes weekends and term breaks genuinely international.' })}
      ${factCard({ title: 'A safe, orderly base', copy: 'Low crime, reliable public services and clear processes make moving to Switzerland straightforward for international students.' })}
      ${factCard({ title: 'Four-season access', copy: 'Ski in winter, swim in the lake in summer. Mountain and lakeside trips are part of ordinary student life here.' })}
      ${factCard({ title: 'Strong industries', copy: 'Finance, pharmaceuticals, hospitality, aviation and technology all recruit in Switzerland, and several work directly with AUS.' })}
      ${factCard({ title: 'French locally, English internationally', copy: 'You practise French with neighbours, landlords and classmates while studying entirely in English.' })}
      ${factCard({ title: 'The Swiss Riviera campus', copy: 'Teaching and student life happen in La Tour-de-Peilz, a short walk from the lake and the train station.' })}
    </div>
    <p class="lp-disclaimer"><a href="living-in-switzerland.html">Read the full guide to living in Switzerland</a>, including transport, insurance and everyday costs.</p>
`
)}
${section(
  ' class="lp-section alt" id="why-aus" data-chapter="05" data-chapter-label="Why AUS"',
  `
    <div class="lp-section-head"><span class="eyebrow">Why AUS</span><h2>Six reasons students choose AUS.</h2></div>
    <div class="lp-usp-grid">
      ${uspCard({ number: '01', title: 'Rated four stars overall by QS Stars', copy: 'AUS holds a four-star overall rating in the QS Stars University Ratings, with the highest five-star rating for Teaching and for Business &amp; Management Studies.' })}
      ${uspCard({ number: '02', title: 'Ranked in Switzerland and worldwide', copy: 'AUS is ranked Top 2 in Switzerland and Top 200 globally for the Master in Management, and Top 3 in Switzerland for the Global MBA.' })}
      ${uspCard({ number: '03', title: 'Practice-led and taught in English', copy: 'Every program is built around casework, projects and real organizational problems, so you build a portfolio of decisions rather than only a transcript.' })}
      ${uspCard({ number: '04', title: 'A US dual-degree pathway', copy: 'Eligible students can add a US degree through the AUS collaboration with Tiffin University while studying in Switzerland.' })}
      ${uspCard({ number: '05', title: 'Careers, internships and industry access', copy: 'Coaching, internships, employer connections and industry visits connect study with the sectors that recruit in Switzerland.' })}
      ${uspCard({ number: '06', title: 'A route for working professionals', copy: 'The part-time Swiss Federal Diploma in Business Administration is a nationally recognized qualification designed around your job.' })}
    </div>
    <div class="lp-qs-panel">
      <div class="lp-qs-group">
        <span class="lp-qs-title">QS Stars University Ratings</span>
        <div class="lp-qs-stars">
          <a href="${rankingsUrl}" target="_blank" rel="noopener"><img loading="lazy" decoding="async" src="${images.qsOverall}" alt="QS Stars four-star overall rating badge"></a>
          <a href="${rankingsUrl}" target="_blank" rel="noopener"><img loading="lazy" decoding="async" src="${images.qsFacilities}" alt="QS Stars four-star facilities rating badge"></a>
          <a href="${rankingsUrl}" target="_blank" rel="noopener"><img loading="lazy" decoding="async" src="${images.qsEmployability}" alt="QS Stars four-star employability rating badge"></a>
          <a href="${rankingsUrl}" target="_blank" rel="noopener"><img loading="lazy" decoding="async" src="${images.qsTeaching}" alt="QS Stars five-star teaching rating badge"></a>
          <a href="${rankingsUrl}" target="_blank" rel="noopener"><img loading="lazy" decoding="async" src="${images.qsBusiness}" alt="QS Stars five-star business and management studies rating badge"></a>
        </div>
      </div>
      <div class="lp-qs-group">
        <span class="lp-qs-title">QS Rankings 2026</span>
        <div class="lp-qs-ranks">
          <a href="${rankingsUrl}" target="_blank" rel="noopener"><img loading="lazy" decoding="async" src="${images.rankTwo}" alt="AUS Top 2 in Switzerland QS ranking badge"></a>
          <a href="${rankingsUrl}" target="_blank" rel="noopener"><img loading="lazy" decoding="async" src="${images.rankTwoHundred}" alt="AUS Top 200 globally QS ranking badge"></a>
        </div>
      </div>
    </div>
`
)}
<section class="lp-cta" data-chapter="06" data-chapter-label="Next Steps">
  <div class="wrap">
    <span class="eyebrow on-navy">Next Steps</span>
    <h2>Talk it through with an admissions advisor.</h2>
    <p>Bring your questions about programs, tuition, funding and the Swiss student permit. An advisor will help you work out which route fits your budget and your plans.</p>
    <div class="lp-cta-actions">
      <a class="lp-btn primary" href="${bookingUrl}" target="_blank" rel="noopener noreferrer">Book a Call</a>
      <a class="lp-btn secondary" href="#request-brochure">Request the Brochure</a>
    </div>
  </div>
</section>
</main>
`
};

// Aviation Management landing page: the same shell, sections and component set as the Switzerland
// page, aimed at the two Aviation Management programs. Content is sourced from the published
// Bachelor's and Master's Aviation Management program pages.
const aviationImages = {
  hero: `${qsBadgeBase}6aa9a46464778a463732fdee_1668620333055.jpg`,
  hangar: `${qsBadgeBase}6aa9a464b5cd707cbe4bd83c_2.jpg`,
  airside: `${qsBadgeBase}6aa9a461cfa87fb586d66568_Aviation%20Managment%20-%20Geneva%20Airport%20Visit.JPG`,
  visit: `${qsBadgeBase}6aa9a4612a43da5076c73b96_Aviation%20Management%20-%20Geneva%20Airport%20Visit%202.JPG`,
  internship: `${qsBadgeBase}6aa9a462afcd16e29b9f67d8_Aviation%20Management%20Internship%20.JPG`
};

const aviationCoreModules = [
  'Global Aviation Systems',
  'Airline Marketing',
  'Airline Revenue Management',
  'Airport Operations in a Global Aviation System',
  'Aviation Regulation Compliance',
  'Airline Strategy in a Changing Global Aviation Market'
];

const aviationManagement = {
  slug: 'aviation-management',
  templateStyleIds,
  title: 'Aviation Management in Switzerland | AUS Business School',
  description: 'Study Aviation Management in Switzerland at an IATA Authorized Training Center. Compare the BSc and MSc programs, annual tuition and entry requirements.',
  styles: sharedStyles + aviationStyles,
  content: `<header class="lp-hero" data-chapter="01" data-chapter-label="Aviation Management">
  <div class="lp-hero-media"><img fetchpriority="high" loading="eager" decoding="async" src="${heroVariant(aviationImages.hero)}" alt="AUS Aviation Management students in Switzerland"></div>
  <div class="lp-hero-content"><div class="wrap">
    <span class="eyebrow on-navy">Bachelor's &amp; Master's</span>
    <h1>Study <em>Aviation Management</em> in Switzerland.</h1>
    <p>AUS Business School is an IATA Authorized Training Center. The Aviation Management programs are taught in English on Lake Geneva, with airport visits, internships and a dual Swiss–US degree.</p>
    <div class="lp-hero-meta"><span>IATA Authorized Training Center</span><span>English-taught</span><span>Bachelor's &amp; Master's</span></div>
    <div class="lp-hero-actions">
      <a class="lp-btn primary" href="#request-brochure">Request the Brochure</a>
    </div>
  </div></div>
</header>
<main>
${section(
  ' class="lp-section alt" id="request-brochure" data-chapter="02" data-chapter-label="Request a Brochure"',
  `
    <div class="lp-form-layout">
      <div>
        <span class="eyebrow">Programme Brochure</span>
        <h2>Request the aviation brochure.</h2>
        <p class="lp-lead">Tell us where you are in your planning and we will send the Aviation Management brochure, tuition for your level and the next steps for your intake.</p>
        <div class="lp-tuition-strip">
          <div><span>Annual tuition, Bachelor's and Master's</span><strong>CHF 25'050 – 28'000</strong></div>
          <div><span>One-time application and admission fees</span><strong>CHF 1'750</strong></div>
          <div><span>Funds to show for the Swiss permit</span><strong>CHF 25'000</strong></div>
        </div>
        <p class="lp-tuition-strip-note">Tuition is charged per academic year. The permit amount is proof of funds you keep, not a payment to AUS — the full breakdown is in the next section.</p>
        <ul class="lp-checklist">
          <li>Module lists and credit structure for both the BSc and the MSc</li>
          <li>Annual tuition, scholarships and payment information</li>
          <li>Entry requirements for each level, including the English scores</li>
          <li>Guidance on the Swiss student permit and living costs</li>
        </ul>
        <p class="lp-disclaimer">Prefer to speak with someone first? <a class="lp-text-link" href="${bookingUrl}" target="_blank" rel="noopener noreferrer">Book a call with an admissions advisor</a>.</p>
      </div>
      <div class="lp-form-panel">
        <div class="lp-form-target" id="aus-brochure-form"></div>
        <script charset="utf-8" type="text/javascript" src="https://js-eu1.hsforms.net/forms/embed/v2.js"></script>
        <script>
          hbspt.forms.create({
            portalId: "${brochurePortalId}",
            formId: "${brochureFormId}",
            region: "eu1",
            target: "#aus-brochure-form"
          });
        </script>
        <p class="lp-form-note">Your details are used to send the brochure and relevant admissions guidance. You can ask us to stop contacting you at any time. Prefer a standalone page? <a class="lp-text-link" href="${brochureDownloadUrl}" target="_blank" rel="noopener noreferrer">Open the brochure form</a>.</p>
      </div>
    </div>
`
)}
${section(
  ' class="lp-section" id="programs" data-chapter="03" data-chapter-label="Programs &amp; Tuition"',
  `
    <div class="lp-section-head"><span class="eyebrow">Programs &amp; Tuition</span><h2>Two programs. One industry.</h2><p class="lp-lead">Both are taught in English, both are built on the IATA aviation curriculum, and both lead to a dual Swiss–US degree. The difference is where you start and how far you go. Every figure is per academic year and confirmed in your offer letter.</p></div>
    <div class="lp-level-grid">
      ${wideLevelCard({
        tag: "Bachelor's Degree",
        title: 'BSc in Business Administration · Aviation Management',
        forWhom: 'For school leavers and transfer students entering the industry for the first time. No prior aviation experience is required.',
        price: "CHF 28'000",
        period: 'per year',
        duration: '3 years · 9 academic terms · 135 CH | 225 ECTS',
        facts: [
          { label: 'Study mode', value: 'Full-time, on campus in La Tour-de-Peilz' },
          { label: 'Entry dates', value: 'September, January and April' },
          { label: 'Entry qualification', value: 'Secondary school diploma with good academic achievements' },
          { label: 'English level', value: 'CEFR B2, or IELTS 5.5 with no element below 4.5' },
          { label: 'Assessment', value: 'No GMAT or entrance exam — holistic review and an online interview' }
        ],
        chipsTitle: 'Core aviation modules',
        chips: aviationCoreModules,
        chipsNote: 'Taught alongside the business core across nine academic terms, with an internship in the second year.',
        highlightTag: 'IATA Authorized Training Center',
        highlightTitle: 'Industry-recognized content, built into the degree',
        highlightNote: 'AUS delivers industry-recognized aviation content as an IATA Authorized Training Center. Beside the curriculum you also get:',
        highlightItems: [
          '<strong>Airport visits</strong> — Geneva and Sion, including hangar and airside access.',
          '<strong>An aviation internship</strong> — built into the second year of the degree.',
          '<strong>Expert sessions</strong> — with airline, airport and regulatory professionals.',
          '<strong>A dual Swiss and US degree</strong> — BSc from AUS plus a BBA from Tiffin University.'
        ],
        highlightFoot: "The Bachelor's is the widest entry point into the industry, with the most time to build experience."
      })}
      ${wideLevelCard({
        tag: "Master's Degree",
        title: 'MSc in International Business Administration · Aviation Management',
        forWhom: 'For graduates and working professionals moving towards executive roles in airlines, airports or aviation consulting.',
        price: "CHF 25'050",
        period: 'per year',
        duration: '2 years · 6 terms + capstone · 83 CH | 135 ECTS',
        facts: [
          { label: 'Study mode', value: 'Full-time, on campus in La Tour-de-Peilz' },
          { label: 'Entry dates', value: 'September, January and April' },
          { label: 'Entry qualification', value: "A Bachelor's degree or equivalent" },
          { label: 'English level', value: 'CEFR B2, or IELTS 6.0 with no element below 5.0' },
          { label: 'Assessment', value: 'No GMAT — personal statement and an online interview' }
        ],
        chipsTitle: 'Core aviation modules',
        chips: aviationCoreModules.concat(['Capstone Project']),
        chipsNote: 'The same aviation core at executive depth, closing with a capstone project on a live strategic problem.',
        highlightTag: '14 IATA microcredentials',
        highlightTitle: 'Credentials that sit beside your degree',
        highlightNote: 'Across four sectors, so you graduate with internationally recognized IATA credentials as well as your degree:',
        highlightItems: [
          '<strong>Passenger &amp; Commercial</strong> — airline customer service, e-commerce in travel, aviation marketing and social media strategy.',
          '<strong>Safety &amp; Security</strong> — airside safety, aviation security awareness and safety management systems.',
          '<strong>Data &amp; Sustainability</strong> — CORSIA fundamentals, flight data analysis and data science.',
          '<strong>People &amp; Leadership</strong> — diversity and inclusion for aviation teams.'
        ],
        highlightFoot: 'Microcredentials are optional additions to the degree and are selected with your programme director.'
      })}
    </div>
    <div class="lp-costs">
      <div class="lp-cost-group">
        <h3>Paid to AUS, once</h3>
        <ul class="lp-cost-list">
          <li><span class="lp-cost-amount">CHF 250</span><span class="lp-cost-label">Application fee, paid when you apply.</span></li>
          <li><span class="lp-cost-amount">CHF 1'500</span><span class="lp-cost-label">Admission fee, paid when you accept your place.</span></li>
        </ul>
      </div>
      <div class="lp-cost-group">
        <h3>Shown or arranged, not paid to AUS</h3>
        <ul class="lp-cost-list">
          <li><span class="lp-cost-amount">CHF 25'000</span><span class="lp-cost-label">Available funds you must prove per year for the Swiss student permit. This is your own money for living costs, not a fee.</span></li>
          <li><span class="lp-cost-amount">Varies</span><span class="lp-cost-label">Accommodation, food, health insurance and local travel, arranged separately from tuition. AUS housing and living-cost guidance covers the options.</span></li>
        </ul>
      </div>
    </div>
    <p class="lp-costs-note">Estimate your own total with <a class="lp-text-link" href="cost-calculator.html?program=bsc_aviation">the BSc cost calculator</a> or <a class="lp-text-link" href="cost-calculator.html?program=msc_aviation">the MSc cost calculator</a>, and read how <a class="lp-text-link" href="tuition-fees-scholarships.html">tuition, fees and scholarships</a> work.</p>
    <p class="lp-disclaimer">AUS scholarships reduce tuition by up to 30% and are awarded on merit (a minimum GPA of 3.2 for bachelor and 3.5 for master applicants) or on demonstrated financial need. Awards depend on available funds and continued eligibility. Figures are reviewed regularly and your offer letter confirms the amounts that apply to you.</p>
`
)}
${section(
  ' class="lp-section alt" id="careers" data-chapter="04" data-chapter-label="Careers &amp; Industry"',
  `
    <div class="lp-section-head"><span class="eyebrow">Careers &amp; Industry</span><h2>Where Aviation Management leads.</h2><p class="lp-lead">The two levels open different doors: the Bachelor's builds the operational and specialist base, while the Master's targets executive and strategic roles.</p></div>
    <div class="lp-split">
      <div class="lp-split-copy"><h3>Study beside a working industry</h3><p>Aviation is one of the most globalized industries there is, and the programs are built around that reality. Students visit working airports, join expert sessions and complete internships next to airline and airport operations.</p><p>Because AUS is an IATA Authorized Training Center, what you study in class is the content the industry already recognizes — the Bachelor's builds the operational base and the Master's turns it into executive strategy.</p></div>
      <div class="lp-split-media"><img loading="lazy" decoding="async" src="${aviationImages.visit}" alt="AUS Aviation Management students on a Geneva Airport visit"></div>
    </div>
    <div class="lp-career-grid">
      <article class="lp-career-panel">
        <h3>With a Bachelor's degree</h3>
        <p>Operational and specialist roles, typically in airlines, airports, cargo and logistics.</p>
        <ul class="lp-checklist">
          <li><strong>VP of Airline Operations</strong> — flight scheduling, crew management and on-time performance.</li>
          <li><strong>Airport Business Director</strong> — commercial activities including retail, parking and ground handling.</li>
          <li><strong>Aviation Safety Executive</strong> — safety management systems and international regulatory compliance.</li>
          <li><strong>Airline Revenue Manager</strong> — ticket pricing, seat allocation and ancillary revenue.</li>
          <li><strong>Aviation Strategy Consultant</strong> — fleet planning, route expansion and competitive positioning.</li>
          <li><strong>Air Cargo &amp; Logistics Manager</strong> — air freight operations, customs and global cargo networks.</li>
        </ul>
      </article>
      <article class="lp-career-panel">
        <h3>With a Master's degree</h3>
        <p>Executive and strategic roles, with responsibility for direction, investment and regulation.</p>
        <ul class="lp-checklist">
          <li><strong>Airline CEO</strong> — strategic direction, fleet planning, route network and commercial strategy.</li>
          <li><strong>Airport Director</strong> — airport operations, infrastructure development and stakeholder relations.</li>
          <li><strong>Aviation Consulting Director</strong> — strategy, operations and regulatory advice to airlines and governments.</li>
          <li><strong>Aviation Safety Director</strong> — leading safety management systems across an organisation.</li>
          <li><strong>Airline Strategy Director</strong> — long-term strategic plans in competitive global markets.</li>
          <li><strong>Aviation Innovation Director</strong> — new technologies, sustainable practices and business models.</li>
        </ul>
      </article>
    </div>
    <div class="lp-media-grid">
      <figure class="lp-media-card"><img loading="lazy" decoding="async" src="${aviationImages.airside}" alt="AUS students on an airside visit at Geneva Airport"><figcaption><strong>Geneva Airport</strong>Airside visits to live airport operations.</figcaption></figure>
      <figure class="lp-media-card"><img loading="lazy" decoding="async" src="${aviationImages.hangar}" alt="Aircraft handling session in a hangar"><figcaption><strong>Sion Airport</strong>Hangar and aircraft handling sessions.</figcaption></figure>
      <figure class="lp-media-card"><img loading="lazy" decoding="async" src="${aviationImages.internship}" alt="Aviation Management student on an internship"><figcaption><strong>Internships</strong>Placements alongside airline and airport teams.</figcaption></figure>
    </div>
`
)}
${section(
  ' class="lp-section" id="why-aus" data-chapter="05" data-chapter-label="Why AUS"',
  `
    <div class="lp-section-head"><span class="eyebrow">Why AUS</span><h2>Six reasons to study aviation here.</h2></div>
    <div class="lp-usp-grid">
      ${uspCard({ number: '01', title: 'An IATA Authorized Training Center', copy: 'AUS delivers industry-recognized aviation content as an IATA Authorized Training Center, so the curriculum matches what airlines, airports and regulators expect.' })}
      ${uspCard({ number: '02', title: 'Two ways into the industry', copy: 'Start with the three-year BSc, or step into the two-year MSc and add up to fourteen IATA microcredentials across four sectors.' })}
      ${uspCard({ number: '03', title: 'A dual Swiss and US degree', copy: 'All enrolled students graduate with two degrees: one from AUS in Switzerland and one from Tiffin University in the United States.' })}
      ${uspCard({ number: '04', title: 'Small classes, taught in English', copy: 'A 7:1 student-to-staff ratio with classes limited to 20 students, entirely in English, on the shore of Lake Geneva.' })}
      ${uspCard({ number: '05', title: 'Industry access while you study', copy: 'Airport visits, expert sessions, internships and employer connections put you next to the industry long before you graduate.' })}
      ${uspCard({ number: '06', title: 'Ranked in Switzerland and worldwide', copy: 'AUS is ranked Top 2 in Switzerland and Top 200 globally for the Master in Management, and Top 3 in Switzerland for the Global MBA.' })}
    </div>
    <div class="lp-qs-panel">
      <div class="lp-qs-group">
        <span class="lp-qs-title">QS Stars University Ratings</span>
        <div class="lp-qs-stars">
          <a href="${rankingsUrl}" target="_blank" rel="noopener"><img loading="lazy" decoding="async" src="${images.qsOverall}" alt="QS Stars four-star overall rating badge"></a>
          <a href="${rankingsUrl}" target="_blank" rel="noopener"><img loading="lazy" decoding="async" src="${images.qsFacilities}" alt="QS Stars four-star facilities rating badge"></a>
          <a href="${rankingsUrl}" target="_blank" rel="noopener"><img loading="lazy" decoding="async" src="${images.qsEmployability}" alt="QS Stars four-star employability rating badge"></a>
          <a href="${rankingsUrl}" target="_blank" rel="noopener"><img loading="lazy" decoding="async" src="${images.qsTeaching}" alt="QS Stars five-star teaching rating badge"></a>
          <a href="${rankingsUrl}" target="_blank" rel="noopener"><img loading="lazy" decoding="async" src="${images.qsBusiness}" alt="QS Stars five-star business and management studies rating badge"></a>
        </div>
      </div>
      <div class="lp-qs-group">
        <span class="lp-qs-title">QS Rankings 2026</span>
        <div class="lp-qs-ranks">
          <a href="${rankingsUrl}" target="_blank" rel="noopener"><img loading="lazy" decoding="async" src="${images.rankTwo}" alt="AUS Top 2 in Switzerland QS ranking badge"></a>
          <a href="${rankingsUrl}" target="_blank" rel="noopener"><img loading="lazy" decoding="async" src="${images.rankTwoHundred}" alt="AUS Top 200 globally QS ranking badge"></a>
        </div>
      </div>
    </div>
`
)}
<section class="lp-cta" data-chapter="06" data-chapter-label="Next Steps">
  <div class="wrap">
    <span class="eyebrow on-navy">Next Steps</span>
    <h2>Talk it through with an admissions advisor.</h2>
    <p>Bring your questions about the BSc and MSc programs, tuition, funding and the Swiss student permit. An advisor will help you work out which level fits your background and your plans.</p>
    <div class="lp-cta-actions">
      <a class="lp-btn primary" href="${bookingUrl}" target="_blank" rel="noopener noreferrer">Book a Call</a>
      <a class="lp-btn secondary" href="#request-brochure">Request the Brochure</a>
    </div>
  </div>
</section>
</main>
`
};

const landingPages = [studyInSwitzerland, aviationManagement];

function buildLandingPage(page) {
  const template = fs.readFileSync(templatePath, 'utf8');
  let html = template;
  for (const id of page.templateStyleIds) {
    html = html.replace(new RegExp(`\\s*<style id="${id}">[\\s\\S]*?<\\/style>`, 'g'), '');
  }
  html = html.replace('</head>', `<style id="${page.slug}-page-styles">${page.styles}</style>\n</head>`);

  const contentStart = html.indexOf('<!-- HERO -->');
  const contentEnd = html.indexOf('<footer class="site-footer">', contentStart);
  if (contentStart === -1 || contentEnd === -1) {
    throw new Error('Landing page shell boundaries were not found in housing.html.');
  }
  html = html.slice(0, contentStart) + page.content + html.slice(contentEnd);

  // Keep the injection idempotent so rebuilding an existing page never duplicates the navigator.
  if (!html.includes('id="archiveTab"')) {
    html = html.replace('<nav class="aus-nav" id="nav">', `${archiveTabMarkup}\n<nav class="aus-nav" id="nav">`);
  }

  const outputPath = path.join(root, `${page.slug}.html`);
  fs.writeFileSync(outputPath, html, 'utf8');
  return { file: path.relative(root, outputPath).replace(/\\/g, '/'), characters: html.length };
}

// The shell is cloned from another page, so each head and search index is re-derived here rather
// than depending on a separate run order. Every page is written before that happens, because the
// search index resolves all configured routes and fails on a route whose file does not exist yet.
const built = landingPages.map(buildLandingPage);
const builtFiles = built.map((result) => result.file);
applyMetadata(builtFiles);
rebuild(builtFiles);
for (const result of built) {
  console.log(`Built ${result.file} (${result.characters.toLocaleString('en-US')} characters).`);
}

module.exports = { buildLandingPage, landingPages };
