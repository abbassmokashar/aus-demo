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
  },
  {
    level: 'BBA', slug: 'hospitality-management',
    title: 'Hospitality Management',
    summary: 'Combine business foundations with hospitality operations, guest experience, revenue management and practical preparation for international service-sector careers.',
    themes: ['Hospitality operations', 'Guest experience and service excellence', 'Revenue and yield management', 'Sustainable tourism and events'],
    careers: ['Hotel and resort operations', 'Food and beverage management', 'Revenue management', 'Events and banqueting', 'Guest relations'],
    image: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa41153ec7e23c6ba9485ea_bachelors-hospitality-management-1.jpg.webp',
    standalone: true,
    preserveExistingPage: true
  },
  {
    level: 'DBA', slug: 'doctorate-in-business-administration',
    title: 'Doctorate in Business Administration',
    summary: 'Combine advanced applied research with professional practice to address complex organizational challenges and contribute new knowledge to business and management.',
    themes: ['Applied doctoral research', 'Executive leadership', 'Organizational transformation', 'Business ethics and governance'],
    careers: ['Executive leadership', 'Management consulting', 'Academic and applied research', 'Organizational transformation', 'Policy and governance'],
    image: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa41155e31b0cd830ec9cec_doctorate-dba-1.jpg.webp',
    source: 'programs/doctorate/dba.html',
    route: '/doctorate-in-business-administration',
    degree: 'Doctor of Business Administration',
    credits: '90 CH | 150 ECTS',
    standalone: true,
    preserveExistingPage: true
  },
  {
    level: 'Diploma', slug: 'swiss-federal-diploma-business-administration',
    title: 'Swiss Federal Diploma in Business Administration',
    summary: 'Develop advanced professional business competencies through a Swiss-recognized qualification designed for experienced professionals and practical management careers.',
    themes: ['Business administration', 'Strategic leadership', 'Finance and operations', 'Applied professional practice'],
    careers: ['Business administration', 'Operations management', 'Team leadership', 'Business development', 'Finance and commercial support'],
    image: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa41155d798236eaa77bb9a_federal-diploma-1.jpg.webp',
    source: 'programs/federal-diploma.html',
    route: '/swiss-federal-diploma-business-administration',
    degree: 'Advanced Federal Diploma of Higher Education in Business Administration',
    credits: 'Swiss Federal Qualification',
    standalone: true,
    preserveExistingPage: true
  }
];

for (const program of programs) {
  if (!program.source) {
    const folder = program.level === 'BBA' ? 'bachelors' : 'masters';
    program.source = `programs/${folder}/${program.slug}.html`;
  }
  if (!program.route) program.route = `/${program.level === 'BBA' ? 'bachelors-degree' : 'masters-degree'}/${program.slug}`;
  if (!program.degree) program.degree = program.level === 'BBA' ? 'Bachelor of Business Administration' : 'Master of Business Administration';
  if (!program.credits) program.credits = program.level === 'BBA' ? '180 ECTS' : '120 ECTS';
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

function toolProgramData(program) {
  const isBba = program.level === 'BBA';
  const isMba = program.level === 'MBA';
  const isDba = program.level === 'DBA';
  const level = isBba ? 'Bachelor' : isMba ? 'Master' : isDba ? 'Doctorate' : 'Federal Diploma';
  const duration = isBba ? '3 Years' : isMba ? '2 Years' : isDba ? '3 Years' : '2 Years (Part-Time)';
  const terms = isBba ? 'Applied BBA structure' : isMba ? 'Applied MBA structure' : isDba ? 'Seven academic terms, dissertation and oral defense' : '4 Academic Terms';
  const mode = program.level === 'Diploma' ? 'Part-Time' : 'Full-Time and In Person';
  const curriculum = program.level === 'BBA' || program.level === 'MBA'
    ? [{ y: 'Program structure', m: structure[program.level].map((item) => `${item[0]} — ${item[1]}`) }]
    : [{ y: 'Key study areas', m: program.themes }];
  const tuition = isBba ? (program.slug === 'hospitality-management' ? 30000 : 28000) : isMba ? 25000 : isDba ? 26000 : 28000;
  return {
    id: `${program.level.toLowerCase()}_${program.slug.replace(/-/g, '_')}`,
    name: program.title,
    level,
    levelLabel: isBba ? "Bachelor's Degree" : isMba ? "Master's Degree" : isDba ? 'Doctorate' : 'Swiss Federal Diploma',
    // Keep repository pages usable locally and on GitHub Pages. The Webflow
    // packaging step rewrites this source path to the corresponding clean URL.
    url: program.source,
    duration,
    durationYears: isBba || isDba ? 3 : 2,
    credits: program.credits,
    terms,
    entry: 'January, April and September',
    mode,
    overview: program.summary,
    skills: [...program.themes, ...program.careers.slice(0, 4)],
    curriculum,
    tuition: { amount: tuition, period: 'year' },
    termsPerYear: isBba || isMba ? 3 : 2
  };
}

function finderProfile(program) {
  const data = toolProgramData(program);
  const tags = {
    'aviation-business-airport-operations': ['aviation', 'aviation', 'sector', 'foundation', 'practical', 'industry'],
    'business-analytics-ai-applications': ['tech', 'tech', 'insights', 'specialist', 'analytical', 'practical'],
    'finance-fintech-digital-banking': ['finance', 'finance', 'numbers', 'specialist', 'analytical', 'practical'],
    'international-business-trade-supply-chain': ['global', 'global', 'leading', 'global', 'international', 'practical'],
    'entrepreneurship-innovation-family-business': ['management', 'management', 'leading', 'foundation', 'practical', 'leadership'],
    'hospitality-management': ['hospitality', 'hospitality', 'sector', 'global', 'practical', 'international'],
    'aviation-strategy-sustainability-leadership': ['aviation', 'aviation', 'sector', 'lead', 'industry', 'leadership'],
    'ai-strategy-digital-transformation': ['tech', 'tech', 'insights', 'transform', 'analytical', 'leadership'],
    'financial-strategy-investment-fintech': ['finance', 'finance', 'numbers', 'lead', 'analytical', 'leadership'],
    'global-strategy-risk-supply-chain-leadership': ['global', 'global', 'leading', 'global', 'international', 'leadership'],
    'innovation-growth-family-enterprise-leadership': ['management', 'management', 'leading', 'transform', 'practical', 'leadership'],
    'doctorate-in-business-administration': ['management', 'management', 'leading', 'executive', 'leadership', 'prestige'],
    'swiss-federal-diploma-business-administration': ['management', 'management', 'leading', 'foundation', 'practical', 'flexible']
  }[program.slug] || ['management', 'management', 'leading', 'specialist', 'practical', 'leadership'];
  return {
    ...data,
    interests: [tags[0]], career: [tags[1]], work: [tags[2]], ambition: [tags[3]],
    priorities: [tags[4], tags[5]], format: [program.level === 'Diploma' ? 'parttime' : 'fulltime'],
    tuition: `CHF ${data.tuition.amount.toLocaleString('de-CH').replace(/\./g, "'")}/yr`
  };
}

function programsMenu(from) {
  const bba = programs.filter((program) => program.level === 'BBA');
  const mba = programs.filter((program) => program.level === 'MBA');
  const doctorate = programs.find((program) => program.level === 'DBA');
  const diploma = programs.find((program) => program.level === 'Diploma');
  const group = (label, items) => `<div class="menu-program-group"><span>${label}</span>${items.map((program) => `<a href="${programLink(from, program)}">${esc(program.title)}</a>`).join('')}</div>`;
  return `<div class="menu-section"><a class="menu-section-title" href="${href(from, 'programs.html')}">Programs</a>${group('Bachelor of Business Administration', bba)}${group('Master of Business Administration', mba)}${group('Doctoral and Professional Study', [doctorate, diploma])}</div>`;
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
  const pairs = programs.filter((program) => program.level === 'BBA' && !program.standalone).map((bba) => ({ bba, mba: programs[programs.indexOf(bba) + 1] }));
  const hospitality = programs.find((program) => program.slug === 'hospitality-management');
  const cards = pairs.map((pair, index) => `<article class="pathway"><div class="pathway-number">0${index + 1}</div><div><span>BBA foundations and application</span><h3><a href="${programLink(from, pair.bba)}">${esc(pair.bba.title)}</a></h3><p>${esc(pair.bba.summary)}</p></div><div><span>MBA strategy and leadership</span><h3><a href="${programLink(from, pair.mba)}">${esc(pair.mba.title)}</a></h3><p>${esc(pair.mba.summary)}</p></div></article>`).join('');
  const extra = `<style>.portfolio-hero .hero-media img{object-position:center 46%}.portfolio-intro{max-width:850px}.pathways{display:grid;gap:18px;margin-top:48px}.pathway{display:grid;grid-template-columns:70px 1fr 1fr;gap:26px;padding:30px;background:#fff;border:1px solid var(--line);border-radius:20px}.pathway-number{font-family:var(--serif);font-size:42px;color:var(--crimson)}.pathway span{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:800}.pathway h3{font-size:22px;color:var(--navy);margin:11px 0}.pathway h3 a:hover{color:var(--crimson)}.pathway p{font-size:14px;line-height:1.65;color:var(--muted)}.standalone-pathway{margin-top:28px;padding:34px;border:1px solid var(--line);border-radius:20px;background:var(--navy);color:#fff;display:grid;grid-template-columns:1fr auto;gap:28px;align-items:center}.standalone-pathway span{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#fff737;font-weight:800}.standalone-pathway h3{font-size:28px;margin:10px 0}.standalone-pathway p{max-width:720px;color:rgba(255,255,255,.72);line-height:1.65}.standalone-pathway .btn{background:#fff;color:var(--navy)}.level-compare{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:42px}.level-card{padding:34px;border:1px solid var(--line);border-radius:20px;background:#fff}.level-card strong{font-family:var(--serif);font-size:46px;color:var(--crimson)}.level-card h3{font-size:24px;color:var(--navy);margin:16px 0}.level-card p{color:var(--muted);line-height:1.65}@media(max-width:760px){.pathway,.standalone-pathway{grid-template-columns:1fr}.pathway-number{font-size:28px}.level-compare{grid-template-columns:1fr}}</style>`;
  return `<!doctype html><html lang="en-CH">${head('Business Programs in Switzerland | AUS') .replace('</head>', `${extra}</head>`)}<body>${header(from)}<main><section class="hero portfolio-hero"><div class="hero-media"><img fetchpriority="high" src="https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6ab7dc4afce5c9415bb855f5_Copy-of-AUS-Business-School-Students.jpg.webp" alt="AUS students in Switzerland"></div><div class="shell hero-content"><span class="eyebrow">AUS academic portfolio</span><h1>Business programs for applied careers<strong>Bachelor's and master's study in Switzerland</strong></h1><p>Choose a BBA specialization built around foundations and application, an MBA specialization focused on strategy and leadership, or Hospitality Management with an integrated practical approach.</p><div class="hero-actions"><a class="btn btn-primary" href="${href(from, 'contact-us.html')}">Talk to Admissions</a><a class="btn btn-light" href="${applyUrl}">Apply Now</a></div></div></section><section class="section alt" id="bachelor"><div class="shell"><div class="portfolio-intro"><span class="section-label">Choose your pathway</span><h2>Focused expertise connected to business practice</h2><p class="lead">Each pathway links a BBA specialization with a related MBA leadership field. Students develop expertise in one area while keeping the broader business perspective needed to work across functions.</p></div><div class="pathways">${cards}</div><article class="standalone-pathway"><div><span>Specialized bachelor program</span><h3>${esc(hospitality.title)}</h3><p>${esc(hospitality.summary)}</p></div><a class="btn" href="${programLink(from, hospitality)}">Explore Hospitality Management</a></article></div></section><section class="section" id="master"><div class="shell"><span class="section-label">Degree structure</span><h2>A clear progression at each level</h2><div class="level-compare"><article class="level-card"><strong>180 ECTS</strong><h3>Bachelor of Business Administration</h3><p>Business foundations, six specialization courses, three cross-specialization courses, professional practice and an applied capstone.</p></article><article class="level-card"><strong>120 ECTS</strong><h3>Master of Business Administration</h3><p>Advanced management study, five specialization courses, two cross-specialization courses, professional practice and an applied research thesis.</p></article></div></div></section><section class="cta"><div class="shell cta-inner"><div><span class="eyebrow">Your next step</span><h2>Find the pathway that fits your goals</h2><p>Speak with Admissions about your academic background, professional interests and current application options.</p></div><div class="hero-actions"><a class="btn btn-light" href="${href(from, 'contact-us.html')}">Contact Admissions</a><a class="btn btn-primary" href="${applyUrl}">Apply Now</a></div></div></section></main>${footer(from)}${scripts()}</body></html>`;
}

function legacyProgramCard(from, program, index) {
  const delay = index % 3 === 1 ? ' d1' : index % 3 === 2 ? ' d2' : '';
  const duration = program.level === 'BBA' ? '3 Years' : '2 Years';
  const tag = program.level === 'BBA' ? 'Bachelors' : 'Masters';
  const shortDescriptions = {
    'aviation-business-airport-operations': 'Lead airport, airline and service operations.',
    'business-analytics-ai-applications': 'Turn business data and AI into better decisions.',
    'finance-fintech-digital-banking': 'Connect finance with FinTech and digital banking.',
    'international-business-trade-supply-chain': 'Lead trade and supply chains across borders.',
    'entrepreneurship-innovation-family-business': 'Build and renew ventures and family businesses.',
    'hospitality-management': 'Shape service, guest experience and hospitality operations.',
    'aviation-strategy-sustainability-leadership': 'Lead aviation strategy and sustainable transformation.',
    'ai-strategy-digital-transformation': 'Guide responsible AI strategy and digital change.',
    'financial-strategy-investment-fintech': 'Lead investment, FinTech and financial strategy.',
    'global-strategy-risk-supply-chain-leadership': 'Build resilient global strategy and supply chains.',
    'innovation-growth-family-enterprise-leadership': 'Lead innovation, growth and family enterprise.'
  };
  return `<a href="${programLink(from, program)}" class="prog-card reveal${delay}"><div class="prog-card-bg"><img loading="lazy" decoding="async" class="archive-plate" src="${program.image}" alt="${esc(program.title)}"></div><div class="prog-card-content"><div class="prog-card-top"><span class="prog-card-tag">${tag}</span><span class="prog-card-num">${String(index + 1).padStart(2, '0')}</span></div><h3 class="prog-card-name">${esc(program.title)}</h3><div class="prog-card-detail"><span class="prog-card-duration">${duration}</span><p class="prog-card-desc">${esc(shortDescriptions[program.slug] || program.summary)}</p><span class="prog-card-arrow">Explore</span></div></div></a>`;
}

function updateProgramsOverview() {
  for (const file of [path.join(root, 'programs.html'), path.join(distRoot, 'programs.html')]) {
    let html = fs.readFileSync(file, 'utf8');
    const from = 'programs.html';
    const bba = programs.filter((program) => program.level === 'BBA');
    const mba = programs.filter((program) => program.level === 'MBA');
    const doctorate = programs.find((program) => program.level === 'DBA');
    const diploma = programs.find((program) => program.level === 'Diploma');
    const bachelorCards = bba.map((program, index) => legacyProgramCard(from, program, index)).join('\n      ');
    const masterCards = mba.map((program, index) => legacyProgramCard(from, program, index)).join('\n      ');
    const bachelorSection = `<!-- BACHELOR'S -->
<section class="program-section chapter" id="bachelor" data-chapter="02" data-chapter-label="Bachelors">
  <div class="wrap">
    <div class="chapter-label reveal"><span class="num">02</span> Bachelor’s Degree</div>
    <div class="program-section-head reveal d1">
      <h2>Start with a foundation that doesn't need replacing.</h2>
      <p>Three years of applied business education combining management foundations, focused expertise and practical experience.</p>
    </div>
    <div class="bento">
      ${bachelorCards}
    </div>
  </div>
</section>`;
    const masterSection = `<!-- MASTER'S -->
<section class="program-section program-section--alt chapter" id="master" data-chapter="03" data-chapter-label="Masters">
  <div class="wrap">
    <div class="chapter-label reveal"><span class="num">03</span> Master’s Degree</div>
    <div class="program-section-head reveal d1">
      <h2>Already leading? Go deeper.</h2>
      <p>Advanced management study for professionals ready to connect strategy, leadership and applied decision-making.</p>
    </div>
    <div class="bento">
      ${masterCards}
    </div>
  </div>
</section>`;
    const advancedSections = `<!-- DOCTORATE -->
<section class="program-section chapter" id="doctorate" data-chapter="04" data-chapter-label="Doctorate">
  <div class="wrap"><div class="chapter-label reveal"><span class="num">04</span> Doctorate</div><div class="program-section-head reveal d1"><h2>The highest level of applied business research.</h2><p>For experienced professionals ready to address complex organizational challenges and contribute new knowledge to management practice.</p></div><div class="doc-grid" style="grid-template-columns:minmax(0,820px);"><a href="${programLink(from, doctorate)}" class="doc-card reveal d2"><div class="doc-card-bg"><img loading="lazy" decoding="async" class="archive-plate" src="${doctorate.image}" alt="${esc(doctorate.title)}"></div><div class="doc-card-content"><span class="doc-card-tag">Doctorate</span><h3>${esc(doctorate.title)}</h3><p>${esc(doctorate.summary)}</p></div></a></div></div>
</section>
<!-- FEDERAL DIPLOMA -->
<section class="program-section program-section--alt chapter" id="diploma" data-chapter="05" data-chapter-label="Federal Diploma">
  <div class="wrap"><div class="chapter-label reveal"><span class="num">05</span> Swiss Federal Diploma</div><div class="program-section-head reveal d1"><h2>A nationally recognized professional qualification.</h2><p>Advanced business education for experienced professionals seeking formal recognition of their management expertise.</p></div><div class="doc-grid" style="grid-template-columns:minmax(0,820px);"><a href="${programLink(from, diploma)}" class="doc-card reveal d2"><div class="doc-card-bg"><img loading="lazy" decoding="async" class="archive-plate" src="${diploma.image}" alt="${esc(diploma.title)}"></div><div class="doc-card-content"><span class="doc-card-tag">Federal Diploma</span><h3>${esc(diploma.title)}</h3><p>${esc(diploma.summary)}</p></div></a></div></div>
</section>`;

    html = html.replace(/(?:Twenty-one|Eleven) programs designed around real organizational problems\./g, 'Thirteen programs designed around real organizational problems.');
    html = html.replace(/<span class="hero-meta">[\s\S]*?<\/span>/, '<span class="hero-meta">13 programs<br>4 levels</span>');
    html = html.replace(/<div class="filter-pills">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, `<div class="filter-pills">
      <a href="#bachelor" class="filter-pill is-active" data-filter="bachelor">Bachelors <span>${bba.length}</span></a>
      <a href="#master" class="filter-pill" data-filter="master">Masters <span>${mba.length}</span></a>
      <a href="#doctorate" class="filter-pill" data-filter="doctorate">Doctorate <span>1</span></a>
      <a href="#diploma" class="filter-pill" data-filter="diploma">Federal Diploma <span>1</span></a>
    </div>
  </div>
</div>`);
    html = html.replace(/<!-- BACHELOR'S -->[\s\S]*?(?=<!-- MASTER'S -->)/, `${bachelorSection}\n\n`);
    html = html.replace(/<!-- MASTER'S -->[\s\S]*?(?=<!-- DOCTORATE -->|<\/div><!-- end programs-wrapper -->)/, `${masterSection}\n\n`);
    html = html.replace(/<!-- DOCTORATE -->[\s\S]*?<\/div><!-- end programs-wrapper -->/, '</div><!-- end programs-wrapper -->');
    html = html.replace('</div><!-- end programs-wrapper -->', `${advancedSections}\n\n</div><!-- end programs-wrapper -->`);
    html = html.replace(/<!-- DUAL DEGREE -->[\s\S]*?(?=<!-- RANKINGS -->)/, '');
    html = html.replace(/\/\* DUAL DEGREE \*\/[\s\S]*?(?=\/\* RANKINGS \*\/)/, '');
    html = html.replace(/<!-- Compare Modal -->[\s\S]*?(?=<script>\s*\(function\(\)\{)/, '');
    html = html.replace(/\/\/ ---------- COMPARE SPECIALIZATIONS ----------[\s\S]*?\}\)\(\);<\/script>/, '</script>');
    html = html.replace('Combining Swiss and American education traditions since 1991.', 'Delivering applied business education in Switzerland since 1991.');
    html = html.replace(/Swiss business education with dual degrees, small classes, and 96%\+ graduate employment\./g, 'Swiss business education with small classes, applied learning, and dedicated student support.');
    html = html.replace(/<div class="aus-popup-benefit"><div class="aus-popup-benefit-icon">&#x2713;<\/div><div class="aus-popup-benefit-text">Dual Degree<span>Swiss \+ American degree<\/span><\/div><\/div>/g, '<div class="aus-popup-benefit"><div class="aus-popup-benefit-icon">&#x2713;</div><div class="aus-popup-benefit-text">Applied Learning<span>Projects and industry experience</span></div></div>');
    html = html.replace(/\s*<a href="programs\.html" class="aus-popup-cta-secondary">Find Your Program<\/a>/g, '');
    html = html.replace(/\s*<div class="accred-logo"><img[^>]+alt="(?:ACBSP|HLC)"[^>]*><\/div>/g, '');
    fs.writeFileSync(file, html, 'utf8');
  }
}

function updateRestoredTools() {
  const compareData = programs.map((program) => {
    const data = toolProgramData(program);
    return {
      name: data.name, level: data.level, url: data.url, duration: data.duration,
      credits: data.credits, terms: data.terms, entry: data.entry, mode: data.mode,
      overview: data.overview, skills: data.skills, curriculum: data.curriculum
    };
  });
  const finderData = programs.map(finderProfile);
  const calculatorData = programs.map((program) => {
    const data = toolProgramData(program);
    return {
      id: data.id, name: data.name, level: data.level, degree: data.levelLabel,
      duration: data.duration, durationYears: data.durationYears, tuition: data.tuition,
      termsPerYear: data.termsPerYear, url: data.url
    };
  });

  for (const relative of ['compare-programs.html', 'find-programs.html', 'cost-calculator.html']) {
    const source = path.join(root, relative);
    if (!fs.existsSync(source)) continue;
    let html = fs.readFileSync(source, 'utf8');
    if (relative === 'compare-programs.html' || relative === 'find-programs.html') {
      html = html.replace(/var programs=\[[\s\S]*?\r?\n  \];\r?\n\r?\n  function populateSelects/, `var programs=${JSON.stringify(compareData, null, 2)};\n\n  function populateSelects`);
    }
    if (relative === 'find-programs.html') {
      html = html.replace(/var programData=\[[\s\S]*?\r?\n\];(?=\r?\n\r?\n\/\* ={20,}\r?\n   STATE)/, `var programData=${JSON.stringify(finderData, null, 2)};`);
    }
    if (relative === 'cost-calculator.html') {
      html = html.replace(/var programData=\[[\s\S]*?\];\r?\nvar ausCosts=/, `var programData=${JSON.stringify(calculatorData)};\nvar ausCosts=`);
      html = html.replace(/programId:"[^"]+"/, `programId:"${calculatorData[0].id}"`);
      html = html.replace("+' ('+prog.termsPerYear+' terms/year)</div>'", "+'</div>'");
    }
    fs.writeFileSync(source, html, 'utf8');
    fs.writeFileSync(path.join(distRoot, relative), html, 'utf8');
  }
}

function writeBoth(relative, html) {
  for (const base of [root, distRoot]) {
    const target = path.join(base, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, html, 'utf8');
  }
}

function updateExistingNavigation() {
  const ignored = new Set(['.chrome-backup', '.git', '.visual-check', 'hbs-demo-deploy', 'history', 'node_modules', 'tmp', 'webflow']);
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
    if (relative === 'worker.html' || relative === 'chatbot.html') continue;
    let html = fs.readFileSync(file, 'utf8');
    if (!html.includes('class="aus-nav-links"') || !html.includes('class="side-panel-nav"')) continue;
    const programHref = href(relative, 'programs.html');
    const tuitionHref = href(relative, 'tuition-fees-scholarships.html');
    const finderHref = href(relative, 'find-programs.html');
    const compareHref = href(relative, 'compare-programs.html');
    const calculatorHref = href(relative, 'cost-calculator.html');
    const admissionsHref = href(relative, 'admissions.html');
    const bachelorsAdmissionsHref = href(relative, 'admissions/bachelors.html');
    const bachelorsRequirementsHref = href(relative, 'admissions/bachelors-requirements.html');
    const mastersAdmissionsHref = href(relative, 'admissions/masters.html');
    const mastersRequirementsHref = href(relative, 'admissions/masters-requirements.html');
    const doctoralAdmissionsHref = href(relative, 'admissions/doctoral.html');
    const doctoralRequirementsHref = href(relative, 'admissions/doctoral-requirements.html');
    const hospitalityHref = href(relative, 'programs/bachelors/hospitality-management.html');
    const doctorateHref = href(relative, 'programs/doctorate/dba.html');
    const diplomaHref = href(relative, 'programs/federal-diploma.html');
    const panel = `<div class="accordion-item" data-panel-key="programs">
        <button class="accordion-trigger">Programs <span class="accordion-icon"></span></button>
        <div class="accordion-panel"><div class="accordion-panel-inner">
          <div class="accordion-group">
            <a href="${programHref}" style="font-weight:600;">View All Programs</a>
            <a href="${programHref}#bachelor">Bachelor's Programs</a>
            <a href="${programHref}#master">Master's Programs</a>
            <a href="${doctorateHref}">Doctorate in Business Administration</a>
            <a href="${diplomaHref}">Swiss Federal Diploma</a>
            <a href="${finderHref}" style="font-weight:600;">Find Your Program</a>
            <a href="${compareHref}" style="font-weight:600;">Compare Specializations</a>
          </div>
        </div></div>
      </div>`;
    html = html.replace(/<!-- CURRENT PROGRAM PORTFOLIO NAV START -->[\s\S]*?<!-- CURRENT PROGRAM PORTFOLIO NAV END -->\s*/g, '');
    html = html.replace(/<!-- CURRENT PROGRAM PORTFOLIO PANEL START -->[\s\S]*?<!-- CURRENT PROGRAM PORTFOLIO PANEL END -->\s*/g, '');
    html = html.replace(/<!-- CURRENT PROGRAM PORTFOLIO STYLE START -->[\s\S]*?<!-- CURRENT PROGRAM PORTFOLIO STYLE END -->\s*/g, '');
    html = html.replace(/<button type="button" data-open-panel="programs">Programs<\/button>\s*/g, '');
    html = html.replace(/(<div class="aus-nav-links">\s*)/, `$1<!-- CURRENT PROGRAM PORTFOLIO NAV START --><button type="button" data-open-panel="programs">Programs</button><!-- CURRENT PROGRAM PORTFOLIO NAV END -->\n    `);
    html = html.replace(/<div class="accordion-item" data-panel-key="programs">[\s\S]*?(?=<div class="accordion-item" data-panel-key="admissions">)/, '');
    html = html.replace(/(<nav class="side-panel-nav"[^>]*>\s*)/, `$1<!-- CURRENT PROGRAM PORTFOLIO PANEL START -->${panel}<!-- CURRENT PROGRAM PORTFOLIO PANEL END -->\n      `);
    const footerPrograms = `<!-- CURRENT PROGRAM PORTFOLIO FOOTER START --><div class="footer-col-title">Programs</div>
        <a href="${programHref}#bachelor">Bachelors</a>
        <a href="${programHref}#master">Masters</a>
        <a href="${doctorateHref}">Doctorate</a>
        <a href="${diplomaHref}">Federal Diploma</a>
        <div style="margin-top:14px;"></div>
        <div class="footer-col-title" style="margin-top:6px;">Connect</div><!-- CURRENT PROGRAM PORTFOLIO FOOTER END -->`;
    html = html.replace(/<!-- CURRENT PROGRAM PORTFOLIO FOOTER (?:START|END) -->/g, '');
    html = html.replace(/<div class="footer-col-title">Programs<\/div>[\s\S]*?<div class="footer-col-title"(?: style="[^"]*")?>Connect<\/div>(?=\s*<a href="[^"]*admissions\.html">Admissions<\/a>)/, footerPrograms);
    if (!html.includes('<!-- CURRENT PROGRAM PORTFOLIO FOOTER START -->')) {
      html = html.replace(/(<div class="footer-col">)\s*(?=<a href="[^"]*admissions\.html">Admissions<\/a>)/, `$1\n        ${footerPrograms}\n        `);
    }
    html = html.replace(/\s*<a[^>]*academic-partners\/tiffin-university\.html[^>]*>Academic Partner<\/a>/g, '');
    html = html.replace('One year, nine specializations, a dual degree with Tiffin University — here is the route from application to enrollment.', 'A focused postgraduate route with five applied specializations — here is the path from application to enrollment.');
    html = html.replace(/\s*<div class="step-card route-note"><span class="n">Your route<\/span><strong>Tiffin dual-degree track<\/strong><p>[\s\S]*?<\/p><\/div>/g, '');
    html = html.replace('What a recognized bachelor&rsquo;s degree, English evidence, and the Tiffin University partnership mean for your application.', 'What a recognized bachelor&rsquo;s degree, English evidence, and your academic and professional background mean for your application.');
    html = html.replace(/\s*<li>Students are subject to the specific admission requirements of AUS educational partner Tiffin University<small>[\s\S]*?<\/small><\/li>/g, '');
    const admissionsPanel = `<div class="accordion-item" data-panel-key="admissions">
        <button class="accordion-trigger">Admissions <span class="accordion-icon"></span></button>
        <div class="accordion-panel"><div class="accordion-panel-inner">
          <div class="accordion-group">
            <a href="${admissionsHref}" style="font-weight:600;">Admissions Overview</a>
            <a href="${bachelorsAdmissionsHref}">Bachelor's Admissions</a>
            <a href="${bachelorsRequirementsHref}">Bachelor's Requirements</a>
            <a href="${mastersAdmissionsHref}">Master's Admissions</a>
            <a href="${mastersRequirementsHref}">Master's Requirements</a>
            <a href="${doctoralAdmissionsHref}">Doctoral Admissions</a>
            <a href="${doctoralRequirementsHref}">Doctoral Requirements</a>
            <a href="${admissionsHref}#entry-requirements">Entry Requirements</a>
            <a href="${admissionsHref}#required-documents">Required Documents</a>
            <a href="${admissionsHref}#application-deadlines">Application Deadlines</a>
            <a href="${href(relative, 'admissions/international.html')}">International Students</a>
            <a class="academic-calendar-download" href="https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa3c00aca9e742e4f7edbea_AUS-Academic%20Calendar%202026-2027.pdf" download="AUS-Academic Calendar 2026-2027.pdf">Academic Calendar</a>
            <a href="${href(relative, 'admissions/international.html')}#visa">Visa &amp; Immigration</a>
            <a href="${href(relative, 'admissions/transfer-requirements.html')}">Transfer Students</a>
            <a href="${href(relative, 'faq.html')}?category=admissions#faq-intro">FAQ</a>
          </div>
        </div></div>
      </div>`;
    html = html.replace(/<div class="accordion-item" data-panel-key="admissions">[\s\S]*?(?=<div class="accordion-item" data-panel-key="tuition">)/, admissionsPanel + '\n      ');
    const tuitionPanel = `<div class="accordion-item" data-panel-key="tuition">
        <button class="accordion-trigger">Tuition &amp; Scholarships <span class="accordion-icon"></span></button>
        <div class="accordion-panel"><div class="accordion-panel-inner">
          <div class="accordion-group">
            <a href="${tuitionHref}">Tuition Fees &amp; Scholarships</a>
            <a href="${calculatorHref}" style="font-weight:600;">Cost Calculator</a>
            <a href="${href(relative, 'faq.html')}">FAQ</a>
          </div>
        </div></div>
      </div>`;
    html = html.replace(/<div class="accordion-item" data-panel-key="tuition">[\s\S]*?(?=<div class="accordion-item" data-panel-key="careers">)/, tuitionPanel + '\n      ');
    html = html.replace(/<a href="[^"]*cost-calculator\.html\?program=[^"]+" class="cta-btn"([^>]*)>Calculate My Costs →<\/a>/g, `<a href="${calculatorHref}" class="cta-btn"$1>Calculate My Costs →</a>`);
    html = html.replace(/\{title:"AUS Collaboration with Tiffin University"[^}]*\}, 400\);/g, '400);');
    html = html.replace(/\/\* DUAL DEGREE \*\/[\s\S]*?(?=\/\* RANKINGS \*\/)/, '');
    html = html.replace(/Swiss business education with dual degrees, small classes, and 96%\+ graduate employment\./g, 'Swiss business education with small classes, applied learning, and dedicated student support.');
    html = html.replace(/<div class="aus-popup-benefit"><div class="aus-popup-benefit-icon">&#x2713;<\/div><div class="aus-popup-benefit-text">Dual Degree<span>Swiss \+ American degree<\/span><\/div><\/div>/g, '<div class="aus-popup-benefit"><div class="aus-popup-benefit-icon">&#x2713;</div><div class="aus-popup-benefit-text">Applied Learning<span>Projects and industry experience</span></div></div>');
    fs.writeFileSync(file, html, 'utf8');
  }
}

function updateHomepagePortfolio() {
  for (const file of [path.join(root, 'index.html'), path.join(distRoot, 'index.html')]) {
    let html = fs.readFileSync(file, 'utf8');
    const bba = programs.filter((program) => program.level === 'BBA').map((program) => `<a href="${program.source}">${esc(program.title)}</a>`).join('');
    const mba = programs.filter((program) => program.level === 'MBA').map((program) => `<a href="${program.source}">${esc(program.title)}</a>`).join('');
    const doctorate = programs.find((program) => program.level === 'DBA');
    const diploma = programs.find((program) => program.level === 'Diploma');
    const section = `<section class="catalog chapter" id="programs" data-chapter="02" data-chapter-label="Programs">
    <div class="wrap">
      <div class="chapter-label reveal"><span class="num">02</span> Programs</div>
      <div class="catalog-head reveal d1"><h2>Choose your level.</h2><p>Every program is built around the same practice-led method. Select a level to explore the current portfolio.</p></div>
      <div class="program-switcher reveal d2">
        <div class="program-levels" id="programLevels">
          <div class="program-level is-active" data-level="bachelor" data-img="bachelor"><span class="program-level-index">01</span><span class="program-level-name">Bachelor's Degree</span><div class="program-level-list"><div class="program-level-list-inner">${bba}</div></div></div>
          <div class="program-level" data-level="master" data-img="master"><span class="program-level-index">02</span><span class="program-level-name">Master's Degree</span><div class="program-level-list"><div class="program-level-list-inner">${mba}</div></div></div>
          <div class="program-level" data-level="doctorate" data-img="doctorate"><span class="program-level-index">03</span><span class="program-level-name">Doctorate</span><div class="program-level-list"><div class="program-level-list-inner"><a href="${doctorate.source}">${esc(doctorate.title)}</a></div></div></div>
          <div class="program-level" data-level="diploma" data-img="diploma"><span class="program-level-index">04</span><span class="program-level-name">Swiss Federal Diploma</span><div class="program-level-list"><div class="program-level-list-inner"><a href="${diploma.source}">${esc(diploma.title)}</a></div></div></div>
        </div>
        <div class="program-media" id="programMedia">
          <div class="program-media-img is-active" data-img="bachelor"><img loading="lazy" decoding="async" class="archive-plate" src="https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6a99d1f0dfd6b716b05c80c9_bachelor-p-1080.webp" alt="Bachelor's students at AUS"><div class="program-media-cap">Applied foundations for emerging business professionals.</div></div>
          <div class="program-media-img" data-img="master"><img loading="lazy" decoding="async" class="archive-plate" src="https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6a99d1f0e69c48936efda252_Masters-p-1080.webp" alt="Master's students at AUS"><div class="program-media-cap">Advanced study for strategic leadership.</div></div>
          <div class="program-media-img" data-img="doctorate"><img loading="lazy" decoding="async" class="archive-plate" src="${doctorate.image}" alt="Doctorate in Business Administration"><div class="program-media-cap">Applied research for experienced business leaders.</div></div>
          <div class="program-media-img" data-img="diploma"><img loading="lazy" decoding="async" class="archive-plate" src="${diploma.image}" alt="Swiss Federal Diploma in Business Administration"><div class="program-media-cap">A Swiss-recognized professional qualification.</div></div>
        </div>
      </div>
      <p style="margin-top:28px;"><a class="hero-cta" href="programs.html">Explore all programs &rarr;</a></p>
    </div>
  </section>`;
    html = html.replace(/<section class="chapter" id="academic-portfolio"[\s\S]*?<\/section>/, section);
    html = html.replace(/<section class="catalog chapter" id="programs"[\s\S]*?<\/section>/, section);
    html = html.replace(/<style id="current-program-home-style">[\s\S]*?<\/style>/g, '');
    fs.writeFileSync(file, html, 'utf8');
  }
}

updateProgramsOverview();
for (const program of programs) if (!program.preserveExistingPage) writeBoth(program.source, programPage(program));
updateRestoredTools();
updateExistingNavigation();
updateHomepagePortfolio();
console.log(`Built the programs overview and ${programs.length} current pathway pages in source and dist.`);

module.exports = { programs };
