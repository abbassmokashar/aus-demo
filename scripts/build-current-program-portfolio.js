const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const distRoot = path.join(root, 'dist');
const applyUrl = 'https://study.aus.swiss/application';
const logoWhite = 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6a572d869feaf5c0c9629e73_AUS%20Logo%20-%20White%20text.avif';
const logoColor = 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6a99cdf83566fae73a65cc9c_AUS%20Logo%202023.png';

const programs = [
  {
    level: 'BBA', slug: 'aviation-business-airport-operations',
    title: 'Aviation Business & Airport Operations',
    summary: 'Build a strong business foundation while learning how airports, airlines and service partners coordinate passenger, cargo and commercial operations.',
    themes: ['Airport and airline operations', 'Aviation service and customer experience', 'Safety, regulation and operational planning', 'Business analysis for aviation decisions'],
    careers: ['Airport operations', 'Airline commercial services', 'Ground handling coordination', 'Aviation consultancy support', 'Cargo and logistics operations'],
    image: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa411536fd6ec0c21dc4ac3_bachelors-aviation-management-1.jpg.webp'
  },
  {
    level: 'MBA', slug: 'aviation-strategy-sustainability-leadership',
    title: 'Aviation Strategy, Sustainability & Leadership',
    summary: 'Examine the strategic choices facing airlines, airports and aviation partners as the sector responds to growth, regulation and sustainability priorities.',
    themes: ['Aviation strategy and competitive positioning', 'Sustainable aviation and operational change', 'Airport and airline leadership', 'Risk, regulation and stakeholder decisions'],
    careers: ['Airline strategy', 'Airport management', 'Aviation consulting', 'Sustainability and transformation', 'Regulatory and industry organizations'],
    image: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa411556fd6ec0c21dc4c2f_masters-aviation-management-1.png.webp'
  },
  {
    level: 'BBA', slug: 'business-analytics-ai-applications',
    title: 'Business Analytics & AI Applications',
    summary: 'Learn how organizations use data, analytical methods and responsible AI applications to understand performance and improve business decisions.',
    themes: ['Business data and analytical thinking', 'Data visualization and communication', 'AI applications in business functions', 'Responsible use of data and technology'],
    careers: ['Business analytics', 'Reporting and insights', 'Digital operations', 'Technology project support', 'Data-informed consulting'],
    image: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6ab7dc4ad16264f1483c4078_AUS-Computer-Lab.jpg.webp'
  },
  {
    level: 'MBA', slug: 'ai-strategy-digital-transformation',
    title: 'AI Strategy & Digital Transformation',
    summary: 'Develop the management perspective needed to evaluate AI opportunities, guide digital change and connect technology investment with organizational priorities.',
    themes: ['AI strategy and business value', 'Digital transformation leadership', 'Technology governance and responsible adoption', 'Data-enabled operating models'],
    careers: ['Digital transformation', 'AI strategy and governance', 'Technology consulting', 'Innovation management', 'Business systems leadership'],
    image: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa411573737214f498cdb98_masters-data-analytics-1.jpg.webp'
  },
  {
    level: 'BBA', slug: 'finance-fintech-digital-banking',
    title: 'Finance, FinTech & Digital Banking',
    summary: 'Study the foundations of finance alongside the technologies and service models changing banking, payments, investment and financial decision-making.',
    themes: ['Corporate finance and financial analysis', 'Banking and digital financial services', 'Investment and risk fundamentals', 'FinTech products and business models'],
    careers: ['Financial analysis', 'Banking operations', 'FinTech business development', 'Investment support', 'Risk and compliance support'],
    image: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6ab7dc4ae73b95aeaf6c67f2_accounting-hero.jpg.webp'
  },
  {
    level: 'MBA', slug: 'financial-strategy-investment-fintech',
    title: 'Financial Strategy, Investment & FinTech',
    summary: 'Connect financial strategy with investment analysis and digital finance to support complex decisions in established institutions and emerging ventures.',
    themes: ['Financial strategy and value creation', 'Investment analysis and portfolio decisions', 'FinTech innovation and digital banking', 'Risk, governance and financial regulation'],
    careers: ['Corporate finance', 'Investment management', 'FinTech strategy', 'Financial consulting', 'Risk and governance'],
    image: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa41157d798236eaa77bcbb_masters-finance-1.jpg.webp'
  },
  {
    level: 'BBA', slug: 'international-business-trade-supply-chain',
    title: 'International Business, Trade & Supply Chain',
    summary: 'Understand how organizations operate across borders and how trade, sourcing, logistics and cultural context shape international business decisions.',
    themes: ['International business environments', 'Trade and market entry', 'Supply chain and logistics foundations', 'Cross-cultural management and negotiation'],
    careers: ['International business development', 'Trade operations', 'Procurement and sourcing', 'Supply chain coordination', 'Logistics and market support'],
    image: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa411543678d7a4dbc42b93_bachelors-international-business-1.png.webp'
  },
  {
    level: 'MBA', slug: 'global-strategy-risk-supply-chain-leadership',
    title: 'Global Strategy, Risk & Supply Chain Leadership',
    summary: 'Prepare to lead across international markets by combining global strategy with risk analysis and resilient supply chain decision-making.',
    themes: ['Global strategy and market positioning', 'Geopolitical and operational risk', 'Supply chain resilience and performance', 'International leadership and stakeholder management'],
    careers: ['Global strategy', 'Supply chain leadership', 'International risk management', 'Operations consulting', 'Procurement and logistics management'],
    image: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa41159ae0d146e06d71ba6_masters-international-business-1.jpg.webp'
  },
  {
    level: 'BBA', slug: 'entrepreneurship-innovation-family-business',
    title: 'Entrepreneurship, Innovation & Family Business',
    summary: 'Develop the practical skills to test new ideas, understand growing ventures and support continuity and renewal in family-owned organizations.',
    themes: ['Entrepreneurial opportunity and venture design', 'Innovation and business model development', 'Family business governance and succession', 'Growth planning and entrepreneurial finance'],
    careers: ['New venture development', 'Family business management', 'Innovation teams', 'Business development', 'Small and medium enterprise consulting'],
    image: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa411522390ac4580ee3b47_bachelors-business-management-1.jpg.webp'
  },
  {
    level: 'MBA', slug: 'innovation-growth-family-enterprise-leadership',
    title: 'Innovation, Growth & Family Enterprise Leadership',
    summary: 'Explore how leaders guide innovation, finance growth and manage governance, succession and renewal in entrepreneurial and family enterprises.',
    themes: ['Innovation strategy and portfolio choices', 'Growth leadership and organizational scaling', 'Family enterprise governance and succession', 'Entrepreneurial finance and strategic renewal'],
    careers: ['Innovation leadership', 'Growth strategy', 'Family enterprise management', 'Entrepreneurial consulting', 'Venture and business development'],
    image: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa4115bfa4ea9b34d427c5f_masters-leadership-and-change-1.jpg.webp'
  }
];

for (const program of programs) {
  const folder = program.level === 'BBA' ? 'bachelors' : 'masters';
  program.source = `programs/${folder}/${program.slug}.html`;
  program.route = `/${program.level === 'BBA' ? 'bachelors-degree' : 'masters-degree'}/${program.slug}`;
  program.degree = program.level === 'BBA' ? 'Bachelor of Business Administration' : 'Master of Business Administration';
  program.credits = program.level === 'BBA' ? '180 ECTS' : '120 ECTS';
}

const structure = {
  BBA: [
    ['Core', '99 ECTS', 'Business foundations'],
    ['Specialization', '36 ECTS', 'Six focused courses'],
    ['Cross-specialization', '18 ECTS', 'Three courses from another field'],
    ['Professional practice', '18 ECTS', 'Internship or applied project'],
    ['Capstone', '9 ECTS', 'One applied challenge']
  ],
  MBA: [
    ['Advanced management', '42 ECTS', 'Management and leadership'],
    ['Specialization', '30 ECTS', 'Five focused courses'],
    ['Cross-specialization', '12 ECTS', 'Two courses from another field'],
    ['Professional practice', '18 ECTS', 'Internship or workplace project'],
    ['Applied thesis', '18 ECTS', 'Research addressing a strategic challenge']
  ]
};

function esc(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function href(from, target) {
  const relative = path.posix.relative(path.posix.dirname(from), target);
  return relative || path.posix.basename(target);
}

function programLink(from, program) {
  return href(from, program.source);
}

function programsMenu(from) {
  const bba = programs.filter((program) => program.level === 'BBA');
  const mba = programs.filter((program) => program.level === 'MBA');
  const group = (label, items) => `<div class="menu-program-group"><span>${label}</span>${items.map((program) => `<a href="${programLink(from, program)}">${esc(program.title)}</a>`).join('')}</div>`;
  return `<div class="menu-section"><a class="menu-section-title" href="${href(from, 'programs.html')}">Programs</a>${group('Bachelor of Business Administration', bba)}${group('Master of Business Administration', mba)}</div>`;
}

function footer(from) {
  return `<footer class="site-footer"><div class="shell footer-grid"><div><a href="${href(from, 'index.html')}"><img class="footer-logo" src="${logoColor}" alt="AUS Business School"></a><p>Applied business education in La Tour-de-Peilz, Switzerland.</p></div><div><h3>Explore</h3><a href="${href(from, 'programs.html')}">Programs</a><a href="${href(from, 'admissions.html')}">Admissions</a><a href="${href(from, 'tuition-fees-scholarships.html')}">Tuition &amp; Scholarships</a><a href="${href(from, 'careers-outcomes.html')}">Careers &amp; Outcomes</a></div><div><h3>About AUS</h3><a href="${href(from, 'about.html')}">About</a><a href="${href(from, 'about/accreditation.html')}">Accreditation &amp; Recognition</a><a href="${href(from, 'about/faculty.html')}">Faculty</a><a href="${href(from, 'contact-us.html')}">Contact Us</a></div><div><h3>Visit Us</h3><a href="mailto:info@aus.swiss">info@aus.swiss</a><p>Chemin du Levant 5<br>1814 La Tour-de-Peilz<br>Switzerland</p><a href="tel:+41219449501">+41 21 944 95 01</a></div></div><div class="shell footer-bottom"><span>&copy; ${new Date().getFullYear()} AUS. All rights reserved.</span><a href="${href(from, 'about/policies-and-procedures.html')}">Policies</a></div></footer>`;
}

function header(from) {
  return `<div id="preloader" class="preloader"><img src="${logoWhite}" alt=""><span></span></div><header class="site-header" id="siteHeader"><a class="wordmark" href="${href(from, 'index.html')}" aria-label="AUS home"><img src="${logoWhite}" alt="AUS Business School"></a><nav class="desktop-nav" aria-label="Primary navigation"><a href="${href(from, 'programs.html')}">Programs</a><a href="${href(from, 'admissions.html')}">Admissions</a><a href="${href(from, 'tuition-fees-scholarships.html')}">Tuition &amp; Scholarships</a><a href="${href(from, 'careers-outcomes.html')}">Careers &amp; Outcomes</a><a href="${href(from, 'student-life.html')}">Student Life</a><a href="${href(from, 'about.html')}">About</a></nav><div class="header-actions"><div class="site-search" id="siteSearch"><input id="siteSearchInput" type="search" placeholder="Ask AUS" aria-label="Search AUS"><div id="siteSearchDrop" class="search-drop" hidden></div></div><a class="header-contact" href="${href(from, 'contact-us.html')}">Contact Us</a><a class="header-apply" href="${applyUrl}">Apply Now</a><button class="menu-toggle" id="menuToggle" type="button" aria-label="Open menu" aria-expanded="false"><span>Menu</span><i></i></button></div></header><div class="menu-panel" id="menuPanel" aria-hidden="true"><button class="menu-close" id="menuClose" type="button" aria-label="Close menu">&times;</button><nav>${programsMenu(from)}<div class="menu-section"><span class="menu-section-title">Admissions</span><a href="${href(from, 'admissions.html')}">How to Apply</a><a href="${href(from, 'admissions.html')}#entry-requirements">Entry Requirements</a><a href="${href(from, 'admissions.html')}#application-deadlines">Application Deadlines</a><a href="${href(from, 'admissions/international.html')}">International Students</a></div><div class="menu-section"><span class="menu-section-title">Student Life</span><a href="${href(from, 'student-life/campus.html')}">Campus</a><a href="${href(from, 'housing.html')}">Housing</a><a href="${href(from, 'student-activities.html')}">Student Activities</a><a href="${href(from, 'living-in-switzerland.html')}">Living in Switzerland</a></div><div class="menu-section"><span class="menu-section-title">About</span><a href="${href(from, 'about.html')}">About AUS</a><a href="${href(from, 'about/accreditation.html')}">Accreditation &amp; Recognition</a><a href="${href(from, 'about/meet-our-people.html')}">Meet Our Team</a><a href="${href(from, 'contact-us.html')}">Contact Us</a></div></nav></div>`;
}

function baseStyles() {
  return `<style>
:root{--navy:#22295f;--night:#111827;--crimson:#be1f3d;--paper:#f4f4f1;--white:#fff;--ink:#10132d;--muted:#5b6078;--line:rgba(34,41,95,.13);--serif:'Playfair Display',Georgia,serif;--sans:'Inter',Arial,sans-serif;--ease:cubic-bezier(.22,1,.36,1)}
*{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}body{font-family:var(--sans);color:var(--ink);background:var(--white);overflow-x:hidden}img{display:block;max-width:100%}a{color:inherit;text-decoration:none}button,input{font:inherit}.shell{width:min(1180px,calc(100% - 48px));margin:auto}.preloader{position:fixed;inset:0;z-index:1000;background:var(--night);display:grid;place-content:center;gap:18px;transition:.55s opacity,.55s visibility}.preloader img{width:190px}.preloader span{height:2px;background:linear-gradient(90deg,var(--crimson),#fff737);animation:load 1.2s ease infinite}@keyframes load{0%{transform:scaleX(.15)}50%{transform:scaleX(1)}100%{transform:scaleX(.15)}}.preloader.is-done{opacity:0;visibility:hidden}.site-header{position:fixed;z-index:110;top:0;left:0;right:0;height:92px;padding:0 clamp(20px,4vw,58px);display:flex;align-items:center;gap:30px;color:#fff;transition:.3s;background:linear-gradient(rgba(17,24,39,.72),transparent)}.site-header.is-scrolled{height:72px;background:var(--night);box-shadow:0 1px 0 rgba(255,255,255,.1)}.wordmark img{width:175px}.desktop-nav{display:flex;gap:22px;margin-left:auto}.desktop-nav a{font-size:13px;font-weight:600;white-space:nowrap}.desktop-nav a:hover{color:#fff737}.header-actions{display:flex;align-items:center;gap:10px}.site-search{position:relative}.site-search input{width:128px;border:1px solid rgba(255,255,255,.34);background:rgba(255,255,255,.1);color:#fff;border-radius:99px;padding:10px 14px;outline:0}.site-search input::placeholder{color:rgba(255,255,255,.72)}.search-drop{position:absolute;top:48px;right:0;width:min(380px,90vw);max-height:420px;overflow:auto;background:#fff;color:var(--ink);border-radius:15px;box-shadow:0 22px 60px rgba(0,0,0,.2);padding:8px}.search-drop a{display:block;padding:11px;border-radius:10px}.search-drop a:hover{background:var(--paper)}.search-drop small{display:block;color:var(--muted);margin-top:3px}.header-contact,.header-apply{font-size:13px;font-weight:700;padding:11px 16px;border:1px solid rgba(255,255,255,.7);border-radius:99px;white-space:nowrap}.header-apply{background:var(--crimson);border-color:var(--crimson)}.menu-toggle{display:none;border:0;background:none;color:#fff;align-items:center;gap:9px;cursor:pointer}.menu-toggle i,.menu-toggle i:before,.menu-toggle i:after{content:'';display:block;width:23px;height:2px;background:currentColor;position:relative}.menu-toggle i:before{position:absolute;top:-7px}.menu-toggle i:after{position:absolute;top:7px}.menu-panel{position:fixed;z-index:150;inset:0 0 0 auto;width:min(520px,100%);padding:80px 38px 40px;background:var(--night);color:#fff;overflow:auto;transform:translateX(100%);transition:.45s transform var(--ease);box-shadow:-30px 0 80px rgba(0,0,0,.3)}.menu-panel.is-open{transform:none}.menu-close{position:absolute;right:28px;top:22px;border:1px solid rgba(255,255,255,.25);background:none;color:#fff;width:42px;height:42px;border-radius:50%;font-size:28px;cursor:pointer}.menu-panel>nav{display:grid;gap:30px}.menu-section{display:grid;gap:10px;border-bottom:1px solid rgba(255,255,255,.14);padding-bottom:24px}.menu-section-title{font-family:var(--serif);font-size:27px;color:#fff}.menu-program-group{display:grid;gap:7px;margin-top:8px}.menu-program-group>span{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#fff737}.menu-panel a{font-size:14px;color:rgba(255,255,255,.74)}.menu-panel a:hover{color:#fff}.hero{min-height:760px;position:relative;display:flex;align-items:flex-end;color:#fff;background:var(--night);overflow:hidden}.hero-media{position:absolute;inset:0}.hero-media img{width:100%;height:100%;object-fit:cover}.hero-media:after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(10,15,34,.93),rgba(10,15,34,.62) 55%,rgba(10,15,34,.26)),linear-gradient(0deg,rgba(10,15,34,.5),transparent 45%)}.hero-content{position:relative;z-index:1;padding:170px 0 82px}.eyebrow{font-size:12px;letter-spacing:.12em;text-transform:uppercase;font-weight:800;color:#fff737}.hero h1{font-family:var(--serif);font-weight:500;font-size:clamp(48px,7vw,90px);line-height:.98;max-width:920px;margin:18px 0 20px}.hero h1 strong{display:block;font-family:var(--sans);font-style:normal;font-size:.34em;letter-spacing:.02em;margin-top:18px}.hero p{max-width:680px;color:rgba(255,255,255,.78);font-size:clamp(17px,2vw,21px);line-height:1.6}.hero-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:30px}.btn{display:inline-flex;align-items:center;justify-content:center;border-radius:99px;padding:14px 24px;font-size:14px;font-weight:750}.btn-primary{background:var(--crimson);color:#fff}.btn-light{background:#fff;color:var(--navy)}.facts{background:var(--navy);color:#fff}.facts-grid{display:grid;grid-template-columns:repeat(4,1fr)}.fact{padding:28px 26px;border-right:1px solid rgba(255,255,255,.14)}.fact:last-child{border:0}.fact span{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.55);margin-bottom:8px}.fact strong{font-size:18px}.section{padding:clamp(72px,9vw,120px) 0}.section.alt{background:var(--paper)}.section-label{font-size:12px;text-transform:uppercase;letter-spacing:.12em;font-weight:800;color:var(--crimson);margin-bottom:16px}.section h2{font-family:var(--serif);font-size:clamp(38px,5vw,64px);line-height:1.05;color:var(--navy);font-weight:500}.lead{font-size:clamp(17px,2vw,21px);line-height:1.75;color:var(--muted);max-width:780px;margin-top:22px}.theme-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:46px}.theme-card{background:#fff;border:1px solid var(--line);padding:28px;border-radius:18px;min-height:150px}.theme-card span{color:var(--crimson);font-size:12px;font-weight:800}.theme-card h3{font-size:20px;color:var(--navy);margin-top:26px}.structure-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:0;margin-top:46px;border:1px solid var(--line);border-radius:18px;overflow:hidden}.structure-card{padding:26px 22px;min-height:190px;border-right:1px solid var(--line);background:#fff}.structure-card:last-child{border:0}.structure-card strong{font-family:var(--serif);font-size:26px;color:var(--crimson)}.structure-card h3{font-size:17px;color:var(--navy);margin:18px 0 8px}.structure-card p{font-size:13px;line-height:1.55;color:var(--muted)}.split{display:grid;grid-template-columns:1.1fr .9fr;gap:clamp(40px,7vw,90px);align-items:center}.split-media{height:540px;border-radius:24px;overflow:hidden}.split-media img{width:100%;height:100%;object-fit:cover}.career-list{display:grid;gap:0;margin-top:32px}.career-list li{list-style:none;padding:16px 0;border-bottom:1px solid var(--line);font-size:17px;font-weight:650;color:var(--navy)}.note{margin-top:38px;padding:22px 24px;border-left:4px solid var(--crimson);background:#fff;color:var(--muted);line-height:1.65}.related{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin-top:40px}.related a{padding:24px;border:1px solid var(--line);border-radius:18px;background:#fff}.related span{font-size:11px;color:var(--crimson);font-weight:800;letter-spacing:.08em}.related strong{display:block;font-size:19px;color:var(--navy);margin-top:10px}.cta{background:var(--navy);color:#fff;padding:80px 0}.cta-inner{display:flex;align-items:center;justify-content:space-between;gap:40px}.cta h2{color:#fff}.cta p{color:rgba(255,255,255,.7);margin-top:14px;max-width:600px;line-height:1.65}.site-footer{padding:74px 0 24px;background:#f4f4f1;color:var(--navy)}.footer-grid{display:grid;grid-template-columns:1.3fr repeat(3,1fr);gap:46px;padding-bottom:52px;border-bottom:1px solid var(--line)}.footer-logo{width:185px;margin-bottom:20px}.footer-grid h3{font-size:12px;text-transform:uppercase;letter-spacing:.09em;margin-bottom:15px}.footer-grid a,.footer-grid p{display:block;font-size:14px;line-height:1.7;color:rgba(34,41,95,.78);padding:3px 0}.footer-bottom{padding-top:22px;display:flex;justify-content:space-between;font-size:12px;color:rgba(34,41,95,.58)}
@media(max-width:1100px){.desktop-nav{display:none}.menu-toggle{display:flex}.site-search{display:none}.facts-grid{grid-template-columns:repeat(2,1fr)}.structure-grid{grid-template-columns:repeat(2,1fr)}.structure-card{border-bottom:1px solid var(--line)}.structure-card:last-child{grid-column:1/-1}.footer-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:700px){.shell{width:min(100% - 32px,1180px)}.site-header{height:70px;padding:0 16px;gap:10px}.wordmark img{width:120px}.header-contact{display:none}.header-apply{padding:9px 12px;font-size:12px}.menu-toggle span{display:none}.hero{min-height:auto}.hero-media{position:relative;height:52vh;min-height:360px}.hero-content{padding:38px 0 52px}.hero h1{font-size:clamp(40px,12vw,60px)}.hero-media:after{background:linear-gradient(0deg,rgba(10,15,34,.95),rgba(10,15,34,.18))}.facts-grid,.theme-grid,.structure-grid,.split,.related,.footer-grid{grid-template-columns:1fr}.fact{border-right:0;border-bottom:1px solid rgba(255,255,255,.14)}.structure-card,.structure-card:last-child{grid-column:auto;border-right:0}.split-media{height:360px;order:-1}.cta-inner{display:block}.cta .hero-actions{margin-top:28px}.footer-bottom{gap:18px;flex-direction:column}.menu-panel{padding-inline:24px}}
</style>`;
}

function scripts() {
  return `<script>
window.addEventListener('load',function(){setTimeout(function(){var p=document.getElementById('preloader');if(p)p.classList.add('is-done')},180)});
(function(){var header=document.getElementById('siteHeader'),panel=document.getElementById('menuPanel'),open=document.getElementById('menuToggle'),close=document.getElementById('menuClose');function setPanel(state){panel.classList.toggle('is-open',state);panel.setAttribute('aria-hidden',String(!state));open.setAttribute('aria-expanded',String(state));document.body.style.overflow=state?'hidden':''}open.addEventListener('click',function(){setPanel(true)});close.addEventListener('click',function(){setPanel(false)});window.addEventListener('scroll',function(){header.classList.toggle('is-scrolled',scrollY>20)},{passive:true});})();
/* SITE SEARCH — INDEX */
(function(){var idx=[];var input=document.getElementById('siteSearchInput'),drop=document.getElementById('siteSearchDrop');if(!input||!drop)return;function escText(v){return String(v).replace(/[&<>\"]/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'})[c]})}input.addEventListener('input',function(){var q=input.value.trim().toLowerCase();if(q.length<2){drop.hidden=true;drop.innerHTML='';return}var hits=idx.filter(function(item){return(item.title+' '+item.keys).toLowerCase().indexOf(q)>-1}).slice(0,7);drop.innerHTML=hits.length?hits.map(function(item){return'<a href="'+item.url+'"><strong>'+escText(item.title)+'</strong><small>'+escText(item.cat)+'</small></a>'}).join(''):'<a href="#"><strong>No matching page</strong><small>Try another search</small></a>';drop.hidden=false});document.addEventListener('click',function(event){if(!event.target.closest('#siteSearch'))drop.hidden=true})})();
</script>`;
}

function head(title) {
  return `<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;1,500&display=swap" rel="stylesheet">${baseStyles()}</head>`;
}

function programPage(program) {
  const from = program.source;
  const siblings = programs.filter((item) => item.level === program.level && item.slug !== program.slug).slice(0, 2);
  const items = structure[program.level];
  return `<!doctype html><html lang="en-CH">${head(`${program.title} ${program.level} | AUS Switzerland`)}<body>${header(from)}<main><section class="hero"><div class="hero-media"><img fetchpriority="high" src="${program.image}" alt="${esc(program.title)} at AUS"></div><div class="shell hero-content"><span class="eyebrow">${program.level} specialization</span><h1>${esc(program.title)}<strong>${program.degree}</strong></h1><p>${esc(program.summary)}</p><div class="hero-actions"><a class="btn btn-primary" href="${applyUrl}">Apply Now</a><a class="btn btn-light" href="${href(from, 'contact-us.html')}">Talk to Admissions</a></div></div></section><section class="facts"><div class="shell facts-grid"><div class="fact"><span>Qualification</span><strong>${program.level}</strong></div><div class="fact"><span>Credits</span><strong>${program.credits}</strong></div><div class="fact"><span>Study approach</span><strong>Applied and in person</strong></div><div class="fact"><span>Location</span><strong>La Tour-de-Peilz</strong></div></div></section><section class="section"><div class="shell"><span class="section-label">Program overview</span><h2>Business foundations with focused expertise</h2><p class="lead">${esc(program.summary)} The specialization connects focused study with broader management knowledge and practical work, helping students apply what they learn to realistic organizational questions.</p><div class="theme-grid">${program.themes.map((theme, index) => `<article class="theme-card"><span>0${index + 1}</span><h3>${esc(theme)}</h3></article>`).join('')}</div></div></section><section class="section alt"><div class="shell"><span class="section-label">Academic structure</span><h2>${program.credits} from foundations to application</h2><p class="lead">The structure combines management study, focused specialization, learning across disciplines and professional practice.</p><div class="structure-grid">${items.map((item) => `<article class="structure-card"><strong>${item[1]}</strong><h3>${item[0]}</h3><p>${item[2]}</p></article>`).join('')}</div></div></section><section class="section"><div class="shell split"><div><span class="section-label">Professional direction</span><h2>Apply your learning to current business challenges</h2><p class="lead">Students connect academic study with an internship or applied project. Working professionals may address a relevant challenge within their organization where appropriate.</p><ul class="career-list">${program.careers.map((career) => `<li>${esc(career)}</li>`).join('')}</ul></div><div class="split-media"><img loading="lazy" src="${program.image}" alt="Applied learning related to ${esc(program.title)}"></div></div></section><section class="section alt"><div class="shell"><span class="section-label">Explore related pathways</span><h2>Continue comparing your options</h2><div class="related">${siblings.map((item) => `<a href="${programLink(from, item)}"><span>${item.level} specialization</span><strong>${esc(item.title)}</strong></a>`).join('')}</div></div></section><section class="cta"><div class="shell cta-inner"><div><span class="eyebrow">Admissions</span><h2>Discuss your study plans with AUS</h2><p>Our Admissions team can explain entry requirements, intake availability and the next steps in your application.</p></div><div class="hero-actions"><a class="btn btn-light" href="${href(from, 'contact-us.html')}">Contact Admissions</a><a class="btn btn-primary" href="${applyUrl}">Apply Now</a></div></div></section></main>${footer(from)}${scripts()}</body></html>`;
}

function overviewPage() {
  const from = 'programs.html';
  const pairs = programs.filter((program) => program.level === 'BBA').map((bba) => ({ bba, mba: programs[programs.indexOf(bba) + 1] }));
  const cards = pairs.map((pair, index) => `<article class="pathway"><div class="pathway-number">0${index + 1}</div><div><span>BBA foundations and application</span><h3><a href="${programLink(from, pair.bba)}">${esc(pair.bba.title)}</a></h3><p>${esc(pair.bba.summary)}</p></div><div><span>MBA strategy and leadership</span><h3><a href="${programLink(from, pair.mba)}">${esc(pair.mba.title)}</a></h3><p>${esc(pair.mba.summary)}</p></div></article>`).join('');
  const extra = `<style>.portfolio-hero .hero-media img{object-position:center 46%}.portfolio-intro{max-width:850px}.pathways{display:grid;gap:18px;margin-top:48px}.pathway{display:grid;grid-template-columns:70px 1fr 1fr;gap:26px;padding:30px;background:#fff;border:1px solid var(--line);border-radius:20px}.pathway-number{font-family:var(--serif);font-size:42px;color:var(--crimson)}.pathway span{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:800}.pathway h3{font-size:22px;color:var(--navy);margin:11px 0}.pathway h3 a:hover{color:var(--crimson)}.pathway p{font-size:14px;line-height:1.65;color:var(--muted)}.level-compare{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:42px}.level-card{padding:34px;border:1px solid var(--line);border-radius:20px;background:#fff}.level-card strong{font-family:var(--serif);font-size:46px;color:var(--crimson)}.level-card h3{font-size:24px;color:var(--navy);margin:16px 0}.level-card p{color:var(--muted);line-height:1.65}@media(max-width:760px){.pathway{grid-template-columns:1fr}.pathway-number{font-size:28px}.level-compare{grid-template-columns:1fr}}</style>`;
  return `<!doctype html><html lang="en-CH">${head('Business Programs in Switzerland | AUS') .replace('</head>', `${extra}</head>`)}<body>${header(from)}<main><section class="hero portfolio-hero"><div class="hero-media"><img fetchpriority="high" src="https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6ab7dc4afce5c9415bb855f5_Copy-of-AUS-Business-School-Students.jpg.webp" alt="AUS students in Switzerland"></div><div class="shell hero-content"><span class="eyebrow">AUS academic portfolio</span><h1>Five business pathways<strong>Two levels of focused study</strong></h1><p>Choose a BBA specialization built around foundations and application, or an MBA specialization focused on strategy and leadership.</p><div class="hero-actions"><a class="btn btn-primary" href="${href(from, 'contact-us.html')}">Talk to Admissions</a><a class="btn btn-light" href="${applyUrl}">Apply Now</a></div></div></section><section class="section alt"><div class="shell"><div class="portfolio-intro"><span class="section-label">Choose your pathway</span><h2>Focused expertise connected to business practice</h2><p class="lead">Each pathway links a BBA specialization with a related MBA leadership field. Students develop expertise in one area while keeping the broader business perspective needed to work across functions.</p></div><div class="pathways">${cards}</div></div></section><section class="section"><div class="shell"><span class="section-label">Degree structure</span><h2>A clear progression at each level</h2><div class="level-compare"><article class="level-card"><strong>180 ECTS</strong><h3>Bachelor of Business Administration</h3><p>Business foundations, six specialization courses, three cross-specialization courses, professional practice and an applied capstone.</p></article><article class="level-card"><strong>120 ECTS</strong><h3>Master of Business Administration</h3><p>Advanced management study, five specialization courses, two cross-specialization courses, professional practice and an applied research thesis.</p></article></div></div></section><section class="cta"><div class="shell cta-inner"><div><span class="eyebrow">Your next step</span><h2>Find the pathway that fits your goals</h2><p>Speak with Admissions about your academic background, professional interests and current application options.</p></div><div class="hero-actions"><a class="btn btn-light" href="${href(from, 'contact-us.html')}">Contact Admissions</a><a class="btn btn-primary" href="${applyUrl}">Apply Now</a></div></div></section></main>${footer(from)}${scripts()}</body></html>`;
}

function writeBoth(relative, html) {
  for (const base of [root, distRoot]) {
    const target = path.join(base, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, html, 'utf8');
  }
}

function updateExistingNavigation() {
  const ignored = new Set(['.chrome-backup', '.git', '.visual-check', 'hbs-demo-deploy', 'history', 'node_modules', 'tmp', 'webflow', 'programs']);
  function walk(directory, output = []) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory() && ignored.has(entry.name)) continue;
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(full, output);
      else if (entry.name.endsWith('.html')) output.push(full);
    }
    return output;
  }
  for (const file of walk(root)) {
    const storedRelative = path.relative(root, file).replace(/\\/g, '/');
    const relative = storedRelative.startsWith('dist/') ? storedRelative.slice(5) : storedRelative;
    if (relative === 'programs.html' || relative === 'worker.html' || relative === 'chatbot.html') continue;
    let html = fs.readFileSync(file, 'utf8');
    if (!html.includes('class="aus-nav-links"') || !html.includes('class="side-panel-nav"')) continue;
    const programHref = href(relative, 'programs.html');
    const panel = `<div class="accordion-item" data-panel-key="programs"><button class="accordion-trigger">Programs <span class="accordion-icon"></span></button><div class="accordion-panel"><div class="accordion-panel-inner"><div class="accordion-group"><a href="${programHref}">View All Programs</a><a href="${programHref}">BBA Specializations</a><a href="${programHref}">MBA Specializations</a></div></div></div></div>`;
    html = html.replace(/<!-- CURRENT PROGRAM PORTFOLIO NAV START -->[\s\S]*?<!-- CURRENT PROGRAM PORTFOLIO NAV END -->\s*/g, '');
    html = html.replace(/<!-- CURRENT PROGRAM PORTFOLIO PANEL START -->[\s\S]*?<!-- CURRENT PROGRAM PORTFOLIO PANEL END -->\s*/g, '');
    html = html.replace(/<!-- CURRENT PROGRAM PORTFOLIO STYLE START -->[\s\S]*?<!-- CURRENT PROGRAM PORTFOLIO STYLE END -->\s*/g, '');
    html = html.replace(/(<div class="aus-nav-links">\s*)/, `$1<!-- CURRENT PROGRAM PORTFOLIO NAV START --><a class="aus-nav-programs-link" href="${programHref}">Programs</a><!-- CURRENT PROGRAM PORTFOLIO NAV END -->\n    `);
    html = html.replace(/(<nav class="side-panel-nav"[^>]*>\s*)/, `$1<!-- CURRENT PROGRAM PORTFOLIO PANEL START -->${panel}<!-- CURRENT PROGRAM PORTFOLIO PANEL END -->\n      `);
    html = html.replace('</head>', `<!-- CURRENT PROGRAM PORTFOLIO STYLE START --><style>.aus-nav-links .aus-nav-programs-link{font-weight:500;font-size:13px;white-space:nowrap}.aus-nav-links .aus-nav-programs-link::after{content:"";display:block;width:0;height:1px;background:currentColor;transition:width .3s;margin-top:3px}.aus-nav-links .aus-nav-programs-link:hover::after{width:100%}</style><!-- CURRENT PROGRAM PORTFOLIO STYLE END --></head>`);
    html = html.replace(/<!-- CURRENT PROGRAM PORTFOLIO FOOTER START -->[\s\S]*?<!-- CURRENT PROGRAM PORTFOLIO FOOTER END -->\s*/g, '');
    html = html.replace(/(<div class="footer-col-title">Connect<\/div>\s*)(?:<a[^>]*>Programs<\/a>\s*)*/, `$1<!-- CURRENT PROGRAM PORTFOLIO FOOTER START --><a href="${programHref}">Programs</a><!-- CURRENT PROGRAM PORTFOLIO FOOTER END -->\n        `);
    fs.writeFileSync(file, html, 'utf8');
  }
}

function updateHomepagePortfolio() {
  for (const file of [path.join(root, 'index.html'), path.join(distRoot, 'index.html')]) {
    let html = fs.readFileSync(file, 'utf8');
    const cards = programs.map((program) => `<a class="home-program-card" href="${program.source}"><span>${program.level}</span><strong>${esc(program.title)}</strong></a>`).join('');
    const section = `<section class="chapter" id="academic-portfolio" data-chapter="02" data-chapter-label="Academic Portfolio"><div class="wrap"><div class="chapter-label reveal"><span class="num">02</span> Academic Portfolio</div><div class="catalog-head reveal d1"><h2>Five pathways. Two levels.</h2><p>Explore BBA specializations focused on foundations and application, and related MBA specializations built around strategy and leadership.</p><div class="home-program-grid">${cards}</div><p class="home-program-action"><a class="hero-cta" href="programs.html">Explore all programs &rarr;</a></p></div></div></section>`;
    html = html.replace(/<section class="chapter" id="academic-portfolio"[\s\S]*?<\/section>/, section);
    html = html.replace(/<style id="current-program-home-style">[\s\S]*?<\/style>/g, '');
    html = html.replace('</head>', `<style id="current-program-home-style">.home-program-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:34px;max-width:980px}.home-program-card{padding:20px 22px;border:1px solid var(--line);background:var(--white);transition:.25s transform,.25s border-color}.home-program-card:hover{transform:translateY(-3px);border-color:var(--crimson)}.home-program-card span{display:block;color:var(--crimson);font-size:11px;font-weight:800;letter-spacing:.08em;margin-bottom:8px}.home-program-card strong{font-size:16px;color:var(--navy);line-height:1.35}.home-program-action{margin-top:22px}@media(max-width:700px){.home-program-grid{grid-template-columns:1fr}.home-program-card{padding:17px 18px}}</style></head>`);
    fs.writeFileSync(file, html, 'utf8');
  }
}

writeBoth('programs.html', overviewPage());
for (const program of programs) writeBoth(program.source, programPage(program));
updateExistingNavigation();
updateHomepagePortfolio();
console.log(`Built the programs overview and ${programs.length} current pathway pages in source and dist.`);

module.exports = { programs };
