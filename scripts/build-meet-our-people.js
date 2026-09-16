const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'about', 'meet-our-people.html');
const distPath = path.join(root, 'dist', 'about', 'meet-our-people.html');

const people = [
  ['Hakim El Omrani', 'Executive Director', 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa95db21e2c951cf450316a_Hakim.webp', 'Oversees executive operations and helps translate institutional priorities into coordinated action.'],
  ['Fouad Khansa', 'Head of Institutional Development', 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa95db26dcbf128e20fa169_Fouad.webp', `Fouad Khansa is the Head of Institutional Development at AUS, overseeing initiatives that support the institution’s growth, development and strategic advancement. He holds Bachelor’s and Master’s degrees in International Business Administration, with professional experience across sales, operations, supply chain, distribution and business development in multinational companies. At AUS, Fouad works closely with teams and stakeholders on institutional development initiatives, strategic opportunities and projects that contribute to the continued growth of the institution. He is also a friendly and approachable colleague whom you can reach out to at any time.`],
  ['Dominic Szambowski', 'Executive Dean', 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa95db2c37c7848e229e664_Dominic.webp', `With an extensive background in education approaching four decades in higher education, Dr. Dominic Szambowski joined AUS as Executive Dean in 2026. A former college president, CEO and vice-chancellor, he graduated with a PhD in Education from the University of Sydney.`],
  ['Connor Lamb', 'Vice Dean of Academics', 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa95db26602daa375412dde_Connor.webp', `Connor is the Vice Dean of Academics, holding dual Master’s degrees in Hospitality Management and Education from the University of Derby. He combines a global background in luxury hospitality operations—spanning Switzerland, Ireland and North America—with academic leadership experience in Dubai and Switzerland to deliver real-world learning rooted in Swiss excellence.`],
  ['Paulo Pereira', 'Registrar', 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa95db4a13fc8df5545d3db_Paulo.webp', 'Oversees academic records, registration processes and key student administration services.'],
  ['Anca Prisacariu', 'Quality Assurance Director', 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa95db2d29d2a961dc6a7b3_Anca.webp', `Anca Prisacariu has 17 years of experience as a higher education quality assurance expert. Externally, she has participated in more than 50 panels reviewing study programs, institutions and quality assurance agencies, and advises agencies and international organisations on developing and revising external quality assurance frameworks. She holds multiple high-level governance and advisory appointments, serving on committees and advisory boards that provide strategic oversight and policy guidance. Internally, she has served as Quality Assurance Director in higher and vocational education institutions across Europe, Africa and the Middle East, overseeing quality assurance strategy implementation, governance and policy management, strategic planning, and the enhancement of teaching and learning. Anca holds a PhD in Education, specialising in quality assurance and accreditation systems, and was a Research Fellow at the Institute of Behavioural Sciences at the University of Helsinki. Her role at AUS includes implementing the quality assurance strategy, coordinating governance and policy management, monitoring strategic plans, and ensuring institutional compliance in external accountability processes.`],
  ['Jonathan Hilton', 'Head of Admission and Recruitment', 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa95db2cd663a402e494e21_Jonathan.webp', `With extensive experience in international education, student enrolment and recruitment, alumni engagement and career services, Jonathan Hilton is ideally placed to advise and guide students on the most suitable pathway. As Head of Admissions and Recruitment, he is one of the first points of contact, providing the relevant information students need. Born in the UK, settled in Switzerland and educated in both countries, he understands how adapting and integrating are key parts of a student’s academic success and university experience.`],
  ['Abbass Mokashar', 'Chief Information & Technology Officer', 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa95db20d2739bf368d590a_Abbass.webp', `Abbass Mokashar is a technology professional and software developer serving as the Chief Information & Technology Officer at AUS. With a background in Computer Science and extensive experience in web development, software solutions and digital systems, he focuses on leveraging technology to enhance institutional operations, digital experiences and innovation.`],
  ['Nour El Yaafouri', 'Graphic Designer', 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa95db3a13fc8df5545d39c_Nour.webp', `Nour El Yaafouri is a Graphic Designer at AUS, with more than three years of experience in graphic design, social media and digital marketing. Her expertise spans branding, visual storytelling, creative direction, content creation and AI-powered creative workflows. She combines creativity with a strategic approach to building engaging and consistent visual communication across digital and print platforms.`],
  ['Rayan Abdallah', 'Student Recruitment Officer — Middle East and MENA Region', 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa9bd947203e2d816632ae7_rayan.webp', `Rayan holds a Master’s degree in Finance and Financial Institutions from Lebanese University and has completed professional training as an NLP Practitioner. With more than nine years of professional experience, including six years in management, team leadership and operations, she has developed a strong background in leading teams, optimising operations and driving performance. She began her journey with AUS as a Student Recruiter for the Middle East and MENA region, focusing on student recruitment, educational partnerships, and relationships with students, schools, counsellors and education partners across the region. Her professional approach combines leadership, strategic thinking, communication and relationship management, with a strong commitment to creating opportunities for students and supporting their academic and professional journeys.`],
  ['Ivana Korolija', 'Administrative Assistant', 'https://placehold.co/900x1100/f1f1ef/22295f?text=Ivana+Korolija%0APhoto+Coming+Soon', 'Supports day-to-day administration and helps coordinate services across the AUS community.', true],
  ['Caitline Bengtsson', 'Head of Marketing', 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa95db1d97052904e24b5b4_Caitline.webp', `Caitline is the Head of Marketing. She holds a Bachelor of Business Administration specialised in Entrepreneurship from Geneva Business School and a Master’s degree in Digital Marketing from CREA, both in Switzerland. She began her career with a digital marketing internship at Philip Morris International before joining a Geneva-based advertising agency. Caitline came to AUS as a Marketing Assistant and progressed to Head of Marketing, where she leads the school’s marketing strategy. She aims to build AUS’s reputation as a school that shapes outstanding business professionals.`],
  ['Susanne Fournier', 'Finance', 'https://cdn.prod.website-files.com/6a3268e8b878fd22920cd884/6a5882307143018ed15c8f15_susanne.webp', `Ms. Fournier is an experienced accountant with a strong background in finance and human resources. Before joining AUS, she led the accounting department of a major international non-profit sports organization, bringing years of leadership and expertise to her role. She holds a Master of Science in Business Management from the École des HEC in Lausanne and is also a trained chartered accountant. She acquired in-depth knowledge of internal control and audit processes during her professional work with a Big Four firm. At AUS, she uses her financial expertise to strengthen internal processes and consolidate the institution’s accounting operations.`]
];

const cards = people.map(([name, title, image, bio, placeholder]) => `<article class="person-card" tabindex="0">
  <img loading="lazy" decoding="async" src="${image}" alt="${placeholder ? `Placeholder portrait for ${name}` : name}">
  <div class="person-caption"><h3>${name}</h3><p>${title}</p><button type="button" class="person-bio-toggle" aria-expanded="false">View biography</button></div>
  <div class="person-bio"><strong>${name}</strong><span>${title}</span><p>${bio}</p><button type="button" class="person-bio-close">Back to profile</button></div>
</article>`).join('\n');

const content = `<section class="people-hero" data-chapter="01" data-chapter-label="Our Team"><div class="wrap"><span class="eyebrow on-navy">About AUS</span><h1>Meet Our Team</h1><p>Meet the team whose leadership, expertise and care shape the AUS experience.</p></div></section>
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
.people-directory .person-bio{justify-content:flex-start}
@media(max-width:1100px){.people-directory .people-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:820px){.people-directory .people-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:580px){.people-hero{padding:132px 0 58px}.people-hero p{font-size:16px}.people-directory .people-grid{grid-template-columns:1fr!important;gap:18px}.people-directory .person-card{aspect-ratio:4/5;min-height:0}.people-directory .person-caption p{min-height:0}.people-directory .person-bio{padding:28px}}
</style>`;

let html = fs.readFileSync(sourcePath, 'utf8');
const start = html.indexOf('<section class="people-hero"');
const end = html.indexOf('<footer class="site-footer">', start);
if (start < 0 || end < 0) throw new Error('Could not locate Meet Our Team content boundaries.');
html = html.slice(0, start) + content + html.slice(end);
if (html.includes('people-unified-grid-styles')) {
  html = html.replace(/<style id="people-unified-grid-styles">[\s\S]*?<\/style>/, styles);
} else {
  html = html.replace('</head>', `${styles}\n</head>`);
}

fs.writeFileSync(sourcePath, html, 'utf8');
fs.mkdirSync(path.dirname(distPath), { recursive: true });
fs.writeFileSync(distPath, html, 'utf8');
console.log(`Built one responsive Meet Our Team grid with ${people.length} profiles.`);
