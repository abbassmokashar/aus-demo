const fs = require('fs');
const path = require('path');

const template = fs.readFileSync(path.join(__dirname, 'programs', 'bachelors', 'accounting.html'), 'utf8');

// ===== URL-mapped output & link rewriting (kept in sync with the renamed tree) =====
const OLD2NEW = {
  'aus-home-demo.html': 'index.html',
  'aus-programs.html': 'programs.html',
  'aus-admissions.html': 'admissions.html',
  'aus-faq.html': 'faq.html',
  'aus-cost-calculator.html': 'cost-calculator.html',
  'aus-about.html': 'about.html',
  'aus-about-history.html': 'about/history.html',
  'aus-about-faculty.html': 'about/faculty.html',
  'aus-governance.html': 'about/governance.html',
  'aus-accreditations.html': 'about/accreditation.html',
  'aus-rights-policy.html': 'about/policies-and-procedures.html',
  'aus-tiffin-collaboration.html': 'about/academic-partners/tiffin-university.html',
  'aus-ibm-collaboration.html': 'about/industry-partners/ibm.html',
  'aus-speaker-series.html': 'about/news-and-events/speaker-series.html',
  'aus-student-life.html': 'student-life.html',
  'aus-campus-life.html': 'student-life/campus.html',
  'aus-dba.html': 'programs/doctorate/dba.html',
  'aus-federal-diploma.html': 'programs/federal-diploma.html',
  'aus-bachelor-accounting.html': 'programs/bachelors/accounting.html',
  'aus-bachelor-aviation-management.html': 'programs/bachelors/aviation-management.html',
  'aus-bachelor-business-management.html': 'programs/bachelors/business-management.html',
  'aus-bachelor-healthcare-administration.html': 'programs/bachelors/healthcare-administration.html',
  'aus-bachelor-hospitality-management.html': 'programs/bachelors/hospitality-management.html',
  'aus-bachelor-human-resource-management.html': 'programs/bachelors/human-resource-management.html',
  'aus-bachelor-integrated-digital-marketing.html': 'programs/bachelors/integrated-digital-marketing.html',
  'aus-bachelor-international-business.html': 'programs/bachelors/international-business.html',
  'aus-bachelor-sports-management-athletic.html': 'programs/bachelors/sports-management-athletic-administration.html',
  'aus-bachelor-sports-management-marketing.html': 'programs/bachelors/sports-management-sports-marketing.html',
  'aus-master-aviation-management.html': 'programs/masters/aviation-management.html',
  'aus-master-data-analytics.html': 'programs/masters/data-analytics.html',
  'aus-master-finance.html': 'programs/masters/finance.html',
  'aus-master-healthcare-administration.html': 'programs/masters/healthcare-administration.html',
  'aus-master-human-resource-management.html': 'programs/masters/human-resource-management.html',
  'aus-master-international-business.html': 'programs/masters/international-business.html',
  'aus-master-leadership-change.html': 'programs/masters/leadership-and-change.html',
  'aus-master-sports-management.html': 'programs/masters/sports-management.html',
  'aus-master-strategic-brand-digital-marketing.html': 'programs/masters/strategic-brand-digital-marketing.html',
  'aus-home-demo-light.html': 'history/home-demo-light.html',
  'aus-home-demo-red.html': 'history/home-demo-red.html',
  'aus-home-v2.html': 'history/home-v2.html'
};

function relTo(fromFile, toPath) {
  const dir = path.posix.dirname(fromFile);
  const depth = dir === '.' ? 0 : dir.split('/').length;
  return depth === 0 ? toPath : '../'.repeat(depth) + toPath;
}

// Rewrite every internal reference in generated HTML so it resolves from the
// page's new nested location (old flat names + root-relative local assets).
function fixHtmlLinks(html, outFile) {
  const attrRe = /(href|src)=(["'])([^"']+)\2/g;
  const matches = [...html.matchAll(attrRe)];
  const edits = [];
  for (const m of matches) {
    const rawVal = m[3];
    const pm = rawVal.match(/^((?:\.\.\/)*)(?:\.\/)?(.*)$/);
    const prefix = pm ? pm[1] : '';
    const core = pm ? pm[2] : rawVal;
    if (/^(https?:|mailto:|tel:|javascript:|data:|blob:|\/\/|#|\/)/i.test(core)) continue;
    const split = core.search(/[?#]/);
    const filePart = split === -1 ? core : core.slice(0, split);
    const suffix = split === -1 ? '' : core.slice(split);
    let newVal = null;
    if (OLD2NEW[filePart]) newVal = relTo(outFile, OLD2NEW[filePart]) + suffix;
    else if (prefix === '' && filePart !== '') newVal = relTo(outFile, filePart) + suffix; // local asset (partner-logos/, history/)
    if (newVal !== null && newVal !== rawVal) {
      const start = m.index + m[0].indexOf(rawVal);
      edits.push({ start, end: start + rawVal.length, newVal });
    }
  }
  for (const e of edits.reverse()) html = html.slice(0, e.start) + e.newVal + html.slice(e.end);
  // plain old-name tokens outside attributes (JS data objects, dynamic URLs)
  for (const oldName of Object.keys(OLD2NEW)) {
    if (html.includes(oldName)) html = html.split(oldName).join(relTo(outFile, OLD2NEW[oldName]));
  }
  return html;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildOverviewList(items) {
  const svg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sky)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
  return items.map(i => `            <li>${svg} ${i}</li>`).join('\n');
}

function buildCareerCards(careers) {
  const svgs = [
    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
    '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
    '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>'
  ];
  const revealClasses = ['','d1','d2','d3','','d1','d2','d3'];
  return careers.map((c, i) => {
    const svg = svgs[i % 4];
    const rc = revealClasses[i];
    return `
      <div class="career-card reveal ${rc}" style="padding:clamp(20px,2.5vw,28px);border-radius:4px;background:var(--navy);color:var(--white);">
        <div style="width:40px;height:40px;background:rgba(255,255,255,.1);border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:12px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sky)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${svg}</svg>
        </div>
        <h3 style="font-family:var(--font-serif);font-style:italic;font-size:16px;margin:0 0 8px;">${c.title}</h3>
        <p style="font-size:13px;line-height:1.6;color:rgba(255,255,255,.65);">${c.desc}</p>
      </div>`;
  }).join('');
}

function generatePage(config) {
  let html = template;
  
  // Title
  html = html.replace(/<title>.*?<\/title>/, `<title>${config.title}</title>`);
  
  // Hero badge (only change if provided)
  if (config.heroBadge) {
    html = html.replace(/BSc in Business Administration/g, config.heroBadge);
  }
  
  // Hero h1
  html = html.replace(/<h1 class="reveal d1" style="font-size:clamp\(56px,10vw,120px\);line-height:.95;">.*?<\/h1>/, `<h1 class="reveal d1" style="font-size:clamp(56px,10vw,120px);line-height:.95;">${config.heroName}</h1>`);
  
  // Hero background
  html = html.replace(/https:\/\/images\.unsplash\.com\/photo-1454165804606-c3d57bc86b40\?w=1800&auto=format&fit=crop&q=80/g, config.heroImg);
  
  // Breadcrumb - replace program name (the text node after the last span)
  html = html.replace(/Bachelor's<\/a><span>\/<\/span>\s*\n\s*Accounting/, `Bachelor's</a><span>/</span>\n    ${config.heroName}`);
  
  // Quick facts - TU Degree (masters only)
  if (config.tuDegree) {
    html = html.replace(/Bachelor of Business Administration/g, config.tuDegree);
  }
  
  // Quick facts - Specialization
  html = html.replace(/>Accounting<\/div>/, `>${config.specialization}</div>`);
  
  // Quick facts - Duration
  if (config.duration) {
    html = html.replace(/>3 Years<\/div>/, `>${config.duration}</div>`);
  }
  
  // Quick facts - Structure
  if (config.structure) {
    html = html.replace(/>9 Academic Terms<\/div>/, `>${config.structure}</div>`);
  }
  
  // Quick facts - Credits
  if (config.credits) {
    html = html.replace(/>135 CH \| 225 ECTS<\/div>/, `>${config.credits}</div>`);
  }
  
  // Quick facts - Study Mode
  if (config.studyMode) {
    html = html.replace(/>Full-Time<\/div>/, `>${config.studyMode}</div>`);
  }
  
  // Overview heading
  html = html.replace(/<h2>A traditional accounting pathway, <em>built for the modern workplace<\/em>\.<\/h2>/, `<h2>${config.overviewH2}</h2>`);
  
  // Overview paragraphs
  html = html.replace(/<p>The Accounting specialization gives students.*?<\/p>/s, `<p>${config.overviewP1}</p>`);
  html = html.replace(/<p style="margin-top:12px;">The double degree allows.*?<\/p>/s, `<p style="margin-top:12px;">${config.overviewP2}</p>`);
  
  // Overview list
  const newList = buildOverviewList(config.overviewList);
  html = html.replace(/<ul class="overview-list" style="margin-top:16px;">.*?<\/ul>/s, `<ul class="overview-list" style="margin-top:16px;">\n${newList}\n          </ul>`);
  
  // Curriculum heading
  if (config.curriculumHeading) {
    html = html.replace(/Three years · nine academic terms · 135 CH \| 225 ECTS\./, config.curriculumHeading);
  }
  
  // Career title
  html = html.replace(/<h2 class="reveal d1"[^>]*>Your Future in Accounting<\/h2>/, `<h2 class="reveal d1" style="font-family:var(--font-serif);font-style:italic;font-weight:500;font-size:clamp(28px,3.5vw,44px);color:var(--navy);margin-top:12px;">${config.careerTitle}</h2>`);
  
  // Career description
  html = html.replace(/<p class="reveal d2"[^>]*>The Accounting Specialization prepares.*?<\/p>/s, `<p class="reveal d2" style="font-size:clamp(14px,1.1vw,16px);line-height:1.75;color:var(--ink-soft);max-width:60ch;margin-top:12px;margin-bottom:clamp(24px,3vw,36px);">${config.careerDesc}</p>`);
  
  // Career cards
  const newCareerCards = buildCareerCards(config.careers);
  html = html.replace(/<div style="display:grid;grid-template-columns:repeat\(4,1fr\);gap:clamp\(14px,1\.6vw,20px\);">\s*<div class="career-card[\s\S]*?<\/div>\s*<\/div>\s*<\/section>\s*<!-- ADMISSIONS/, `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(14px,1.6vw,20px);">${newCareerCards}\n    </div>\n  </div>\n</section>\n\n<!-- ADMISSIONS`);
  
  // Admissions IELTS
  if (config.ielts) {
    html = html.replace(/IELTS Overall 5\.5 with no single element below 4\.5/g, config.ielts);
  }
  
  // Tuition
  if (config.tuition) {
    html = html.replace(/28,000 CHF/g, `${config.tuition} CHF`);
  }
  
  // Testimonial
  if (config.testimonial) {
    html = html.replace(/"The Accounting specialization gave me the technical skills.*?"/, `"${config.testimonial}"`);
  }
  
  // Testimonial program label - replace the line containing "— Accounting" in testimonial section
  if (config.testimonialLabel) {
    html = html.replace(/BSc in Business Administration — Accounting/g, config.testimonialLabel);
    html = html.replace(/Doctorate in Business Administration — Accounting/g, config.testimonialLabel);
    html = html.replace(/Swiss Federal Diploma — Accounting/g, config.testimonialLabel);
    html = html.replace(/MSc in International Business Administration — Accounting/g, config.testimonialLabel);
  }
  
  fs.mkdirSync(path.dirname(config.file), { recursive: true });
  html = fixHtmlLinks(html, config.file);
  fs.writeFileSync(path.join(__dirname, config.file), html, 'utf8');
  console.log(`Created: ${config.file}`);
}

// ===== BACHELOR PROGRAMS =====
const bachelorPrograms = [
  {
    file: 'programs/bachelors/business-management.html',
    title: 'Business Management — Bachelor\'s Degree | AUS Business School',
    heroName: 'Business Management',
    specialization: 'Business Management',
    heroImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1800&auto=format&fit=crop&q=80',
    overviewH2: 'Prepare for leadership roles in a fast-moving global economy.',
    overviewP1: 'The Business Management specialization equips students with the core skills needed to lead teams, manage operations, and drive organizational performance. Designed for aspiring leaders and entrepreneurs, it covers strategy, organizational behavior, marketing, finance, and innovation — giving graduates the confidence to manage complexity and deliver results across industries.',
    overviewP2: 'The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland.',
    overviewList: ['Strategic planning and execution','Organizational behavior and leadership','Marketing and brand management','Operations and supply chain management','Financial management and analysis','Human resource management fundamentals','Innovation and entrepreneurship','Business analytics and data-driven decisions'],
    careerTitle: 'Your Future in Business Management',
    careerDesc: 'The Business Management specialization prepares students for careers in consulting, operations, strategy, entrepreneurship, and general management. Students develop leadership, analytical, and decision-making skills needed to manage people, projects, and organizations effectively.',
    careers: [
      {title:'Management Consultant',desc:'Advise organizations on strategy, operations, and performance improvement to achieve sustainable growth.'},
      {title:'Operations Director',desc:'Oversee daily business operations, streamline processes, and ensure organizational efficiency and profitability.'},
      {title:'Business Analyst',desc:'Analyze business processes and data to identify opportunities for improvement and support strategic decision-making.'},
      {title:'Strategy Director',desc:'Lead the development and execution of long-term business strategies aligned with organizational goals.'},
      {title:'General Manager',desc:'Manage overall business units or departments, balancing revenue targets, team performance, and customer satisfaction.'},
      {title:'Entrepreneur / Founder',desc:'Launch and scale new ventures, from ideation and funding to market entry and growth.'},
      {title:'HR Manager',desc:'Oversee recruitment, employee relations, and talent development to build high-performing organizations.'},
      {title:'Project Manager',desc:'Plan, execute, and deliver complex projects on time and within scope across multiple business functions.'}
    ],
    testimonial: 'The Business Management specialization gave me the strategic skills and confidence to lead in a competitive global market. The dual degree with Tiffin University opened doors I never expected.',
    testimonialLabel: 'BSc in Business Administration — Business Management'
  },
  {
    file: 'programs/bachelors/healthcare-administration.html',
    title: 'Healthcare Administration — Bachelor\'s Degree | AUS Business School',
    heroName: 'Healthcare Administration',
    specialization: 'Healthcare Administration',
    heroImg: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1800&auto=format&fit=crop&q=80',
    overviewH2: 'Prepare for leadership roles in one of the world\'s fastest-growing industries.',
    overviewP1: 'The Healthcare Administration specialization prepares students to manage and lead healthcare organizations, from hospitals and clinics to public health agencies and health-tech startups. Combining business acumen with healthcare systems knowledge, graduates are ready to improve patient outcomes, optimize operations, and navigate the complex regulatory landscape of modern healthcare.',
    overviewP2: 'The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland.',
    overviewList: ['Healthcare systems and policy','Hospital operations management','Health informatics and data analytics','Financial management in healthcare','Healthcare law and compliance','Quality improvement and patient safety','Strategic planning for health organizations','Leadership in multidisciplinary teams'],
    careerTitle: 'Your Future in Healthcare Administration',
    careerDesc: 'The Healthcare Administration specialization prepares students for leadership roles in hospitals, health systems, public health organizations, and health-tech companies. Students gain the operational, financial, and analytical skills needed to improve healthcare delivery.',
    careers: [
      {title:'Healthcare Operations Manager',desc:'Oversee daily operations of healthcare facilities, ensuring efficiency, compliance, and quality patient care.'},
      {title:'Hospital Administrator',desc:'Lead hospital departments or entire facilities, managing staff, budgets, and strategic initiatives.'},
      {title:'Health Informatics Director',desc:'Implement and manage health information systems that improve data-driven decision-making in clinical settings.'},
      {title:'Public Health Administrator',desc:'Design and manage public health programs and policies that improve community health outcomes.'},
      {title:'Healthcare Finance Manager',desc:'Manage financial operations, budgeting, and revenue cycles for healthcare organizations.'},
      {title:'Clinical Services Manager',desc:'Coordinate clinical departments, optimize patient flow, and ensure quality standards are maintained.'},
      {title:'Health Policy Analyst',desc:'Research and evaluate healthcare policies, advising organizations and governments on regulatory compliance.'},
      {title:'Long-Term Care Administrator',desc:'Manage nursing homes, assisted living facilities, and rehabilitation centers with a focus on resident well-being.'}
    ],
    testimonial: 'The Healthcare Administration specialization gave me the operational skills and industry knowledge to lead in one of the most dynamic sectors. The dual degree was invaluable.',
    testimonialLabel: 'BSc in Business Administration — Healthcare Administration'
  },
  {
    file: 'programs/bachelors/human-resource-management.html',
    title: 'Human Resource Management — Bachelor\'s Degree | AUS Business School',
    heroName: 'Human Resource Management',
    specialization: 'Human Resource Management',
    heroImg: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1800&auto=format&fit=crop&q=80',
    overviewH2: 'Prepare for strategic leadership in the people-centred dimension of global business.',
    overviewP1: 'The Human Resource Management specialization equips students with the knowledge and skills to attract, develop, and retain top talent in competitive organizations. Covering recruitment, compensation, employee relations, organizational development, and labor law, graduates are prepared to build engaged, high-performing workforces that drive business success.',
    overviewP2: 'The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland.',
    overviewList: ['Talent acquisition and recruitment strategies','Compensation and benefits design','Employee relations and engagement','Learning and development programs','Organizational design and change management','Labor law and employment legislation','HR analytics and people data','Diversity, equity, and inclusion'],
    careerTitle: 'Your Future in Human Resource Management',
    careerDesc: 'The Human Resource Management specialization prepares students for careers across all areas of people management. Students develop skills in recruitment, employee development, compensation, and organizational strategy.',
    careers: [
      {title:'HR Business Partner',desc:'Align HR strategies with business objectives, partnering with leaders to drive organizational performance.'},
      {title:'Talent Acquisition Director',desc:'Lead recruitment strategies and build employer brands to attract top talent globally.'},
      {title:'Compensation & Benefits Manager',desc:'Design and manage competitive compensation packages and benefits programs that attract and retain employees.'},
      {title:'Learning & Development Manager',desc:'Create and deliver training programs that build employee skills and support career growth.'},
      {title:'HR Operations Manager',desc:'Oversee daily HR functions including payroll, benefits administration, and compliance.'},
      {title:'People & Culture Director',desc:'Shape organizational culture and lead initiatives that improve employee experience and engagement.'},
      {title:'Employment Law Specialist',desc:'Advise organizations on labor law compliance, workplace policies, and employee relations.'},
      {title:'Chief People Officer',desc:'Lead enterprise-wide people strategy, reporting directly to the CEO and board of directors.'}
    ],
    testimonial: 'The Human Resource Management specialization gave me the strategic and operational skills to make a real impact on organizational culture. The dual degree opened global opportunities.',
    testimonialLabel: 'BSc in Business Administration — Human Resource Management'
  },
  {
    file: 'programs/bachelors/international-business.html',
    title: 'International Business — Bachelor\'s Degree | AUS Business School',
    heroName: 'International Business',
    specialization: 'International Business',
    heroImg: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?w=1800&auto=format&fit=crop&q=80',
    overviewH2: 'Prepare for leadership roles in the global economy.',
    overviewP1: 'The International Business specialization prepares students to operate across borders, cultures, and markets. Covering global strategy, cross-cultural management, international trade, and foreign market entry, graduates gain the skills to lead in multinational corporations, international organizations, and global startups.',
    overviewP2: 'The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland.',
    overviewList: ['Global strategy and competitive analysis','International trade and regulations','Cross-cultural management','Foreign market entry strategies','Global supply chain management','International marketing','Emerging markets and geopolitics','Multinational financial management'],
    careerTitle: 'Your Future in International Business',
    careerDesc: 'The International Business specialization prepares students for careers in global trade, multinational management, and cross-border strategy. Students develop cultural awareness and strategic thinking for international markets.',
    careers: [
      {title:'International Trade Specialist',desc:'Facilitate cross-border trade, manage export-import operations, and ensure regulatory compliance.'},
      {title:'Business Development Director',desc:'Identify and develop new business opportunities across international markets and partnerships.'},
      {title:'Regional Managing Director',desc:'Lead business operations across specific geographic regions, balancing local and global strategies.'},
      {title:'Global Supply Chain Manager',desc:'Optimize supply chains across multiple countries, managing logistics, procurement, and risk.'},
      {title:'International Marketing Manager',desc:'Develop and execute marketing strategies adapted for diverse global markets and cultures.'},
      {title:'Cross-Cultural Management Consultant',desc:'Advise organizations on navigating cultural differences and building effective global teams.'},
      {title:'Foreign Direct Investment Analyst',desc:'Evaluate international investment opportunities and advise on market entry strategies.'},
      {title:'Global Account Manager',desc:'Manage relationships with multinational clients, coordinating services across regions.'}
    ],
    testimonial: 'The International Business specialization gave me the global perspective and cross-cultural skills to work confidently across borders. The dual degree was a game-changer.',
    testimonialLabel: 'BSc in Business Administration — International Business'
  },
  {
    file: 'programs/bachelors/hospitality-management.html',
    title: 'Hospitality Management — Bachelor\'s Degree | AUS Business School',
    heroName: 'Hospitality Management',
    specialization: 'Hospitality Management',
    tuDegree: 'International Business',
    duration: '3 Years',
    structure: '9 Academic Terms (Including Internship)',
    tuition: '30,000',
    heroImg: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&auto=format&fit=crop&q=80',
    overviewH2: 'Prepare for international careers in fast-growing service sectors.',
    overviewP1: 'The Hospitality Management specialization prepares students for leadership roles in hotels, resorts, restaurants, event management, and tourism. Combining business fundamentals with hospitality-specific knowledge, graduates are ready to deliver exceptional guest experiences while managing profitable operations in one of the world\'s most dynamic industries.',
    overviewP2: 'The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland.',
    overviewList: ['Hotel and resort management','Food and beverage operations','Revenue and yield management','Event planning and coordination','Guest relations and service excellence','Hospitality marketing and branding','Financial management in hospitality','Sustainable tourism practices'],
    careerTitle: 'Your Future in Hospitality Management',
    careerDesc: 'The Hospitality Management specialization prepares students for careers in hotels, resorts, restaurants, events, and tourism. Students develop operational, financial, and leadership skills for the global hospitality industry.',
    careers: [
      {title:'Front Office Manager',desc:'Manage front desk operations, guest check-in/out processes, and overall guest satisfaction.'},
      {title:'Food and Beverage Manager',desc:'Oversee restaurant and bar operations, menu development, and food service quality standards.'},
      {title:'Yield and Revenue Manager',desc:'Optimize pricing strategies and room allocation to maximize revenue across booking channels.'},
      {title:'Housekeeping Manager',desc:'Maintain cleanliness and presentation standards across hotel rooms and public areas.'},
      {title:'Guest Relations Manager',desc:'Build and maintain guest loyalty programs and handle VIP guest communications.'},
      {title:'Rooms Division Manager',desc:'Oversee front office, housekeeping, and reservations departments as part of hotel operations.'},
      {title:'Events and Banqueting Coordinator',desc:'Plan and execute conferences, weddings, and corporate events from concept to delivery.'},
      {title:'Hotel Operations Supervisor',desc:'Coordinate daily hotel operations across multiple departments to ensure seamless guest experiences.'}
    ],
    testimonial: 'The Hospitality Management specialization gave me the operational expertise and industry knowledge to thrive in luxury hotels. The internship in Switzerland was an incredible experience.',
    testimonialLabel: 'BSc in Business Administration — Hospitality Management'
  },
  {
    file: 'programs/bachelors/aviation-management.html',
    title: 'Aviation Management — Bachelor\'s Degree | AUS Business School',
    heroName: 'Aviation Management',
    specialization: 'Aviation Management',
    tuDegree: 'International Business',
    heroImg: 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=1800&auto=format&fit=crop&q=80',
    overviewH2: 'Prepare for a leadership role in the global aviation industry.',
    overviewP1: 'The Aviation Management specialization prepares students for careers in airlines, airports, air cargo, and aviation consulting. As an IATA Authorized Training Center, AUS delivers industry-recognized content that covers airline operations, airport management, aviation safety, and aerospace strategy. Graduates are ready to lead in one of the most complex and globalized industries.',
    overviewP2: 'The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland.',
    overviewList: ['Airline operations and management','Airport business and planning','Aviation safety and regulation','Airline revenue management','Aviation strategy and consulting','Air cargo and logistics','Sustainable aviation and innovation','Aerospace industry trends'],
    careerTitle: 'Your Future in Aviation Management',
    careerDesc: 'The Aviation Management specialization prepares students for leadership roles in airlines, airports, aviation consulting, and aerospace. Students develop industry-specific knowledge through IATA-accredited training.',
    careers: [
      {title:'VP of Airline Operations',desc:'Oversee daily airline operations including flight scheduling, crew management, and on-time performance.'},
      {title:'Airport Business Director',desc:'Manage airport commercial activities including retail, parking, and ground handling services.'},
      {title:'Aviation Safety Executive',desc:'Develop and implement safety management systems to ensure compliance with international aviation regulations.'},
      {title:'Airline Revenue Manager',desc:'Optimize ticket pricing, seat allocation, and ancillary revenue strategies across booking channels.'},
      {title:'Aviation Strategy Consultant',desc:'Advise airlines and airports on fleet planning, route expansion, and competitive positioning.'},
      {title:'Air Cargo & Logistics Manager',desc:'Manage air freight operations, customs compliance, and global cargo logistics networks.'},
      {title:'Regulatory Affairs Manager',desc:'Ensure airline compliance with national and international aviation regulations and standards.'},
      {title:'Sustainability & Innovation Director',desc:'Lead initiatives in sustainable aviation fuels, carbon offset programs, and green airport operations.'}
    ],
    testimonial: 'The Aviation Management specialization gave me industry-specific knowledge and IATA credentials that set me apart. The dual degree opened doors in the global aviation industry.',
    testimonialLabel: 'BSc in Business Administration — Aviation Management'
  },
  {
    file: 'programs/bachelors/integrated-digital-marketing.html',
    title: 'Integrated and Digital Marketing — Bachelor\'s Degree | AUS Business School',
    heroName: 'Integrated and Digital Marketing',
    specialization: 'Integrated and Digital Marketing',
    heroImg: 'https://images.unsplash.com/photo-1533750349088-cd871a92f17e?w=1800&auto=format&fit=crop&q=80',
    overviewH2: 'Prepare for careers in modern marketing, digital strategy, and brand management.',
    overviewP1: 'The Integrated and Digital Marketing specialization combines traditional marketing principles with cutting-edge digital strategies. Students learn to build brands, create content, analyze data, and execute campaigns across social media, search, email, and emerging platforms. Graduates are prepared to lead marketing in a digital-first world.',
    overviewP2: 'The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland.',
    overviewList: ['Brand strategy and positioning','Digital marketing and social media','Content marketing and storytelling','SEO and search engine marketing','Marketing analytics and data visualization','Email marketing and automation','E-commerce and digital platforms','Consumer behavior and market research'],
    careerTitle: 'Your Future in Integrated and Digital Marketing',
    careerDesc: 'The Integrated and Digital Marketing specialization prepares students for careers across the marketing spectrum, from brand management to digital strategy. Students develop creative and analytical skills for modern marketing roles.',
    careers: [
      {title:'Digital Marketing Manager',desc:'Plan and execute digital marketing campaigns across search, social, email, and display channels.'},
      {title:'Brand Strategist',desc:'Develop brand positioning, messaging, and visual identity systems that resonate with target audiences.'},
      {title:'Content Marketing Director',desc:'Lead content strategy and production across blogs, video, podcasts, and social media platforms.'},
      {title:'Social Media Manager',desc:'Manage brand presence across social platforms, creating engaging content and building communities.'},
      {title:'SEO / SEM Specialist',desc:'Optimize website visibility through search engine optimization and paid search campaigns.'},
      {title:'Marketing Analytics Manager',desc:'Analyze campaign performance and customer data to optimize marketing spend and ROI.'},
      {title:'E-Commerce Director',desc:'Manage online sales channels, optimize conversion funnels, and drive digital revenue growth.'},
      {title:'Chief Marketing Officer',desc:'Lead enterprise marketing strategy, brand management, and customer acquisition across all channels.'}
    ],
    testimonial: 'The Integrated and Digital Marketing specialization gave me the creative and analytical skills to lead modern marketing campaigns. The dual degree was an incredible value.',
    testimonialLabel: 'BSc in Business Administration — Integrated and Digital Marketing'
  },
  {
    file: 'programs/bachelors/sports-management-athletic-administration.html',
    title: 'Sports Management — Athletic Administration — Bachelor\'s Degree | AUS Business School',
    heroName: 'Sports Management — Athletic Administration',
    specialization: 'Sports Management — Athletic Administration',
    heroImg: 'https://images.unsplash.com/photo-1461896836934-bd45ba8a0e24?w=1800&auto=format&fit=crop&q=80',
    overviewH2: 'Prepare for leadership roles in sports organizations, athletic departments, and sports business.',
    overviewP1: 'The Sports Management — Athletic Administration specialization prepares students to lead sports organizations, manage athletic departments, and oversee sports facilities. Combining business fundamentals with sports industry knowledge, graduates are ready to manage teams, events, and operations in professional and collegiate sports.',
    overviewP2: 'The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland.',
    overviewList: ['Sports organization management','Athletic department administration','Facility planning and management','Event management and logistics','Sports law and compliance','Athletic program development','Budgeting and financial management','Fan engagement and community relations'],
    careerTitle: 'Your Future in Sports Management — Athletic Administration',
    careerDesc: 'The Sports Management — Athletic Administration specialization prepares students for leadership roles in sports organizations, athletic departments, and facility management. Students develop operational and strategic skills for the sports industry.',
    careers: [
      {title:'Athletic Director',desc:'Lead athletic departments, overseeing programs, budgets, staffing, and compliance with regulations.'},
      {title:'Sports Operations Manager',desc:'Manage day-to-day operations of sports venues, teams, or athletic organizations.'},
      {title:'Event Coordinator',desc:'Plan and execute sports events, tournaments, and competitions from logistics to execution.'},
      {title:'Sports Marketing Manager',desc:'Develop marketing strategies that drive ticket sales, sponsorships, and fan engagement.'},
      {title:'Facility Manager',desc:'Oversee the maintenance, scheduling, and operations of sports venues and training facilities.'},
      {title:'Sports Agent',desc:'Represent athletes in contract negotiations, endorsements, and career management.'},
      {title:'Compliance Officer',desc:'Ensure sports organizations comply with league rules, regulations, and ethical standards.'},
      {title:'Sports Program Director',desc:'Design and manage sports development programs for youth, collegiate, or professional levels.'}
    ],
    testimonial: 'The Sports Management specialization gave me the industry knowledge and business skills to lead in professional sports. The dual degree opened international opportunities.',
    testimonialLabel: 'BSc in Business Administration — Sports Management'
  },
  {
    file: 'programs/bachelors/sports-management-sports-marketing.html',
    title: 'Sports Management — Sports Marketing — Bachelor\'s Degree | AUS Business School',
    heroName: 'Sports Management — Sports Marketing',
    specialization: 'Sports Management — Sports Marketing',
    heroImg: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1800&auto=format&fit=crop&q=80',
    overviewH2: 'Prepare for careers in sports marketing, sponsorship, and brand management.',
    overviewP1: 'The Sports Management — Sports Marketing specialization prepares students for careers in sports marketing, sponsorship, media, and brand partnerships. Students learn to build sports brands, manage fan engagement, negotiate sponsorship deals, and leverage digital platforms to grow audiences. Graduates are ready to lead marketing in professional sports, leagues, and media companies.',
    overviewP2: 'The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland.',
    overviewList: ['Sports marketing and branding','Sponsorship strategy and negotiation','Digital sports content creation','Fan engagement and community building','Sports media and broadcasting','Merchandising and licensing','Sports analytics and data-driven marketing','Social media strategy for sports'],
    careerTitle: 'Your Future in Sports Management — Sports Marketing',
    careerDesc: 'The Sports Management — Sports Marketing specialization prepares students for careers in sports marketing, sponsorship, media, and brand management. Students develop creative and analytical skills for the sports industry.',
    careers: [
      {title:'Sports Marketing Director',desc:'Lead marketing strategies for sports brands, teams, and events across traditional and digital channels.'},
      {title:'Sponsorship Manager',desc:'Negotiate and manage sponsorship deals between brands and sports organizations.'},
      {title:'Digital Sports Content Manager',desc:'Create and manage digital content strategies across social media, websites, and streaming platforms.'},
      {title:'Brand Partnership Manager',desc:'Develop and maintain brand partnerships that drive revenue and audience growth.'},
      {title:'Sports Media Manager',desc:'Oversee media relations, press coverage, and broadcast partnerships for sports organizations.'},
      {title:'Fan Engagement Manager',desc:'Build and manage fan communities through events, digital platforms, and loyalty programs.'},
      {title:'Sports PR Specialist',desc:'Manage public relations, crisis communications, and media strategy for athletes and sports brands.'},
      {title:'Merchandising Manager',desc:'Oversee licensed merchandise design, production, and sales for sports brands and teams.'}
    ],
    testimonial: 'The Sports Marketing specialization gave me the creative and strategic skills to build sports brands and engage fans globally. The dual degree was a unique advantage.',
    testimonialLabel: 'BSc in Business Administration — Sports Management'
  },
  {
    file: 'programs/bachelors/data-analytics-ai.html',
    title: 'Data Analytics and AI for Business — Bachelor\'s Degree | AUS Business School',
    heroName: 'Data Analytics and AI for Business',
    specialization: 'Data Analytics and AI for Business',
    heroImg: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1800&auto=format&fit=crop&q=80',
    overviewH2: 'Prepare for careers at the intersection of data science, AI, and business strategy.',
    overviewP1: 'The Data Analytics and AI for Business specialization equips students with the technical and analytical skills to harness the power of data and artificial intelligence in business contexts. Covering data visualization, machine learning, predictive analytics, and AI strategy, graduates are prepared to turn complex data into actionable business insights.',
    overviewP2: 'The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland.',
    overviewList: ['Data visualization and storytelling','Machine learning fundamentals','Predictive analytics and modeling','AI strategy for business','Business intelligence tools','Database management and SQL','Big data technologies','Ethical AI and data governance'],
    careerTitle: 'Your Future in Data Analytics and AI for Business',
    careerDesc: 'The Data Analytics and AI for Business specialization prepares students for careers at the intersection of data science and business strategy. Students develop technical and analytical skills to drive data-informed decisions.',
    careers: [
      {title:'Data Analyst',desc:'Collect, process, and analyze data to generate insights that support business decision-making.'},
      {title:'Business Intelligence Manager',desc:'Design and manage BI systems and dashboards that provide real-time business performance insights.'},
      {title:'AI Solutions Consultant',desc:'Advise organizations on AI strategy, implementation, and integration into business processes.'},
      {title:'Data Science Manager',desc:'Lead data science teams to develop predictive models and analytical solutions for complex business problems.'},
      {title:'Analytics Engineer',desc:'Build and maintain data pipelines and analytical infrastructure that support enterprise analytics.'},
      {title:'Chief Data Officer',desc:'Lead enterprise data strategy, governance, and analytics across the organization.'},
      {title:'Machine Learning Operations Manager',desc:'Manage ML model deployment, monitoring, and maintenance in production environments.'},
      {title:'Data Governance Manager',desc:'Establish and enforce data quality standards, privacy policies, and compliance frameworks.'}
    ],
    testimonial: 'The Data Analytics and AI specialization gave me the technical skills and business acumen to lead data-driven transformation. The dual degree was a unique differentiator.',
    testimonialLabel: 'BSc in Business Administration — Data Analytics and AI for Business'
  }
];

// ===== MASTER PROGRAMS =====
const masterPrograms = [
  {
    file: 'programs/masters/finance.html',
    title: 'Finance — Master\'s Degree | AUS Business School',
    heroBadge: 'MSc in International Business Administration',
    heroName: 'Finance',
    specialization: 'Finance',
    tuDegree: 'Master of Business Administration',
    tuition: '25,050',
    duration: '2 Years',
    structure: '6 Academic Terms + Capstone',
    credits: '83 CH | 135 ECTS',
    heroImg: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1800&auto=format&fit=crop&q=80',
    overviewH2: 'Master the financial strategies that drive global organizations.',
    overviewP1: 'The Finance specialization provides advanced knowledge in corporate finance, investment analysis, portfolio management, and financial risk. Designed for professionals seeking to lead in banking, asset management, or corporate treasury, it combines rigorous quantitative training with strategic decision-making skills for today\'s complex financial markets.',
    overviewP2: 'The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland.',
    overviewList: ['Corporate finance and valuation','Investment analysis and portfolio management','Financial risk management','International finance and capital markets','Derivatives and structured products','Mergers and acquisitions','Quantitative finance methods','Ethical finance and ESG investing'],
    curriculumHeading: 'Two years · six academic terms plus capstone · 83 CH | 135 ECTS.',
    careerTitle: 'Your Future in Finance',
    careerDesc: 'The Finance specialization prepares students for leadership roles in banking, investment, corporate finance, and financial consulting. Students develop advanced analytical and strategic skills for the global financial industry.',
    careers: [
      {title:'Chief Financial Officer',desc:'Lead enterprise financial strategy, reporting, risk management, and capital allocation decisions.'},
      {title:'Senior Investment Analyst',desc:'Conduct in-depth financial analysis and investment research to support portfolio decisions.'},
      {title:'Financial Risk Director',desc:'Identify, measure, and mitigate financial risks across trading, lending, and investment activities.'},
      {title:'Portfolio Manager',desc:'Manage investment portfolios, balancing risk and return across asset classes for institutional clients.'},
      {title:'Corporate Finance Manager',desc:'Oversee capital structure, budgeting, and financial planning for corporate organizations.'},
      {title:'Emerging Markets Specialist',desc:'Analyze and invest in growth opportunities across developing economies and frontier markets.'},
      {title:'Financial Institutions Manager',desc:'Manage operations, compliance, and strategy for banks, insurance companies, and fintech firms.'},
      {title:'Investment Banking Analyst',desc:'Execute mergers, acquisitions, IPOs, and capital raises for corporate clients.'}
    ],
    ielts: 'IELTS Overall 6.0 with no single element below 5.5',
    testimonial: 'The Finance specialization gave me the advanced analytical skills and strategic perspective to lead in global banking. The dual degree with Tiffin University was a game-changer for my career.',
    testimonialLabel: 'MSc in International Business Administration — Finance'
  },
  {
    file: 'programs/masters/data-analytics.html',
    title: 'Data Analytics — Master\'s Degree | AUS Business School',
    heroBadge: 'MSc in International Business Administration',
    heroName: 'Data Analytics',
    specialization: 'Data Analytics',
    tuDegree: 'Master of Business Administration',
    tuition: '25,050',
    duration: '2 Years',
    structure: '6 Academic Terms + Capstone',
    credits: '83 CH | 135 ECTS',
    heroImg: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1800&auto=format&fit=crop&q=80',
    overviewH2: 'Turn complex data into strategic business advantage.',
    overviewP1: 'The Data Analytics specialization equips students with advanced analytical skills to transform raw data into actionable business insights. Covering machine learning, statistical modeling, data visualization, and big data technologies, graduates are prepared to lead data-driven decision-making in any industry.',
    overviewP2: 'The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland.',
    overviewList: ['Advanced statistical modeling','Machine learning and AI applications','Data visualization and storytelling','Big data technologies and cloud analytics','Predictive analytics and forecasting','Business intelligence strategy','Data governance and ethics','Quantitative research methods'],
    curriculumHeading: 'Two years · six academic terms plus capstone · 83 CH | 135 ECTS.',
    careerTitle: 'Your Future in Data Analytics',
    careerDesc: 'The Data Analytics specialization prepares students for leadership roles in data science, business intelligence, and analytics strategy. Students develop advanced technical and analytical capabilities.',
    careers: [
      {title:'Chief Data Officer',desc:'Lead enterprise data strategy, governance, and analytics to drive business transformation.'},
      {title:'Analytics Director',desc:'Oversee analytics teams and initiatives, translating data insights into strategic business actions.'},
      {title:'Data Science Lead',desc:'Lead data science projects, developing predictive models and analytical solutions for complex problems.'},
      {title:'Business Intelligence Director',desc:'Design and manage BI platforms and dashboards that provide real-time organizational insights.'},
      {title:'Machine Learning Manager',desc:'Develop and deploy machine learning models that automate and optimize business processes.'},
      {title:'Data Strategy Consultant',desc:'Advise organizations on data architecture, analytics strategy, and data-driven transformation.'},
      {title:'Quantitative Analyst',desc:'Apply advanced mathematical and statistical methods to financial modeling and risk assessment.'},
      {title:'Data Governance Director',desc:'Establish enterprise-wide data quality standards, privacy policies, and compliance frameworks.'}
    ],
    ielts: 'IELTS Overall 6.0 with no single element below 5.5',
    testimonial: 'The Data Analytics specialization gave me the advanced technical skills and strategic mindset to lead data-driven transformation. The dual degree was invaluable.',
    testimonialLabel: 'MSc in International Business Administration — Data Analytics'
  },
  {
    file: 'programs/masters/healthcare-administration.html',
    title: 'Healthcare Administration — Master\'s Degree | AUS Business School',
    heroBadge: 'MSc in International Business Administration',
    heroName: 'Healthcare Administration',
    specialization: 'Healthcare Administration',
    tuDegree: 'Master of Business Administration',
    tuition: '25,050',
    duration: '2 Years',
    structure: '6 Academic Terms + Capstone',
    credits: '83 CH | 135 ECTS',
    heroImg: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1800&auto=format&fit=crop&q=80',
    overviewH2: 'Lead the future of healthcare delivery and management.',
    overviewP1: 'The Healthcare Administration specialization at the master\'s level prepares senior professionals to lead healthcare organizations through an era of rapid change. Covering health policy, systems thinking, innovation management, and healthcare finance, graduates are ready to drive operational excellence and improve patient outcomes at scale.',
    overviewP2: 'The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland.',
    overviewList: ['Healthcare systems leadership','Health policy and regulation','Healthcare innovation and technology','Strategic planning for health organizations','Healthcare finance and economics','Quality improvement and patient safety','Global health management','Healthcare analytics and informatics'],
    curriculumHeading: 'Two years · six academic terms plus capstone · 83 CH | 135 ECTS.',
    careerTitle: 'Your Future in Healthcare Administration',
    careerDesc: 'The Healthcare Administration specialization prepares students for senior leadership roles in hospitals, health systems, public health, and healthcare consulting. Students develop strategic and operational skills for the healthcare industry.',
    careers: [
      {title:'Healthcare CEO',desc:'Lead healthcare organizations, setting strategic direction and overseeing all operational functions.'},
      {title:'Hospital Director',desc:'Manage hospital operations, staff, budgets, and quality initiatives across clinical departments.'},
      {title:'Health System Administrator',desc:'Oversee multi-facility health systems, coordinating resources and strategy across locations.'},
      {title:'Healthcare Consulting Director',desc:'Advise healthcare organizations on strategy, operations, technology, and regulatory compliance.'},
      {title:'Public Health Director',desc:'Lead public health agencies and initiatives that improve community and population health outcomes.'},
      {title:'Healthcare Innovation Manager',desc:'Drive adoption of new technologies, processes, and models that improve healthcare delivery.'},
      {title:'Pharmaceutical Operations Director',desc:'Manage pharmaceutical manufacturing, distribution, and supply chain operations.'},
      {title:'Health Policy Director',desc:'Shape healthcare policy at organizational, national, or international levels through research and advocacy.'}
    ],
    ielts: 'IELTS Overall 6.0 with no single element below 5.5',
    testimonial: 'The Healthcare Administration specialization gave me the strategic leadership skills to transform healthcare delivery. The dual degree opened global opportunities.',
    testimonialLabel: 'MSc in International Business Administration — Healthcare Administration'
  },
  {
    file: 'programs/masters/human-resource-management.html',
    title: 'Human Resource Management — Master\'s Degree | AUS Business School',
    heroBadge: 'MSc in International Business Administration',
    heroName: 'Human Resource Management',
    specialization: 'Human Resource Management',
    tuDegree: 'Master of Business Administration',
    tuition: '25,050',
    duration: '2 Years',
    structure: '6 Academic Terms + Capstone',
    credits: '83 CH | 135 ECTS',
    heroImg: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1800&auto=format&fit=crop&q=80',
    overviewH2: 'Shape the future of work through strategic people leadership.',
    overviewP1: 'The Human Resource Management specialization at the master\'s level prepares senior HR professionals to lead talent strategy, organizational development, and people analytics. Covering advanced topics in compensation, employee relations, diversity, and HR transformation, graduates are ready to drive organizational performance through people.',
    overviewP2: 'The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland.',
    overviewList: ['Strategic human resource management','Talent management and succession planning','Organizational development and change','Compensation and benefits strategy','Employee relations and engagement','HR analytics and people data','Diversity, equity, and inclusion','HR technology and digital transformation'],
    curriculumHeading: 'Two years · six academic terms plus capstone · 83 CH | 135 ECTS.',
    careerTitle: 'Your Future in Human Resource Management',
    careerDesc: 'The Human Resource Management specialization prepares students for senior leadership roles in talent management, organizational development, and HR strategy. Students develop strategic capabilities for people management.',
    careers: [
      {title:'VP of Human Resources',desc:'Lead enterprise HR strategy, reporting to the C-suite and driving organizational performance through people.'},
      {title:'Talent Management Director',desc:'Design and implement talent acquisition, development, and retention strategies across the organization.'},
      {title:'Organizational Development Director',desc:'Lead initiatives that improve organizational effectiveness, culture, and change readiness.'},
      {title:'Compensation & Benefits Director',desc:'Design enterprise-wide compensation strategies and benefits programs that attract and retain top talent.'},
      {title:'Employee Relations Director',desc:'Manage employee relations, workplace policies, and conflict resolution across the organization.'},
      {title:'HR Analytics Director',desc:'Use people data and analytics to drive HR strategy and measure workforce effectiveness.'},
      {title:'Diversity & Inclusion Director',desc:'Lead enterprise DEI strategy, programs, and metrics to build a diverse and inclusive workplace.'},
      {title:'Chief People Officer',desc:'Lead enterprise people strategy as a C-suite executive, aligning HR with business objectives.'}
    ],
    ielts: 'IELTS Overall 6.0 with no single element below 5.5',
    testimonial: 'The Human Resource Management specialization gave me the strategic capabilities to lead people strategy at the enterprise level. The dual degree was transformative.',
    testimonialLabel: 'MSc in International Business Administration — Human Resource Management'
  },
  {
    file: 'programs/masters/international-business.html',
    title: 'International Business — Master\'s Degree | AUS Business School',
    heroBadge: 'MSc in International Business Administration',
    heroName: 'International Business',
    specialization: 'International Business',
    tuDegree: 'Master of Business Administration',
    tuition: '25,050',
    duration: '2 Years',
    structure: '6 Academic Terms + Capstone',
    credits: '83 CH | 135 ECTS',
    heroImg: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?w=1800&auto=format&fit=crop&q=80',
    overviewH2: 'Lead in the global economy with strategic international expertise.',
    overviewP1: 'The International Business specialization at the master\'s level prepares professionals to lead in multinational organizations, navigate cross-border operations, and drive global strategy. Covering international trade, cross-border M&A, emerging markets, and global partnerships, graduates are ready to operate at the highest levels of international business.',
    overviewP2: 'The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland.',
    overviewList: ['Global strategy and competitive positioning','Cross-border mergers and acquisitions','International trade and regulations','Emerging markets strategy','Global partnership management','Cross-cultural leadership','International operations management','Geopolitical risk and strategy'],
    curriculumHeading: 'Two years · six academic terms plus capstone · 83 CH | 135 ECTS.',
    careerTitle: 'Your Future in International Business',
    careerDesc: 'The International Business specialization prepares students for senior leadership roles in multinational organizations, global strategy, and cross-border operations. Students develop strategic capabilities for international markets.',
    careers: [
      {title:'Global Business Director',desc:'Lead business operations across multiple countries, balancing local and global strategies.'},
      {title:'International Strategy Consultant',desc:'Advise multinational corporations on global strategy, market entry, and competitive positioning.'},
      {title:'Regional VP',desc:'Lead regional business operations, managing P&L, teams, and strategy across a geographic area.'},
      {title:'Cross-Border M&A Specialist',desc:'Execute international mergers, acquisitions, and divestitures across multiple jurisdictions.'},
      {title:'International Trade Director',desc:'Manage global trade operations, customs compliance, and international supply chain relationships.'},
      {title:'Global Partnership Manager',desc:'Develop and manage strategic alliances and partnerships with international organizations.'},
      {title:'Emerging Markets Director',desc:'Lead business development and market entry strategies in high-growth developing economies.'},
      {title:'International Operations Director',desc:'Oversee operations across international offices, ensuring consistency and efficiency.'}
    ],
    ielts: 'IELTS Overall 6.0 with no single element below 5.5',
    testimonial: 'The International Business specialization gave me the global strategic perspective to lead in multinational organizations. The dual degree opened doors worldwide.',
    testimonialLabel: 'MSc in International Business Administration — International Business'
  },
  {
    file: 'programs/masters/leadership-and-change.html',
    title: 'Leadership & Change — Master\'s Degree | AUS Business School',
    heroBadge: 'MSc in International Business Administration',
    heroName: 'Leadership & Change',
    specialization: 'Leadership & Change',
    tuDegree: 'Master of Business Administration',
    tuition: '25,050',
    duration: '2 Years',
    structure: '6 Academic Terms + Capstone',
    credits: '83 CH | 135 ECTS',
    heroImg: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1800&auto=format&fit=crop&q=80',
    overviewH2: 'Lead organizational transformation with confidence and clarity.',
    overviewP1: 'The Leadership & Change specialization prepares professionals to lead complex organizational transformations, manage change initiatives, and build adaptive cultures. Covering change management, executive coaching, organizational psychology, and transformation strategy, graduates are ready to guide organizations through periods of disruption and renewal.',
    overviewP2: 'The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland.',
    overviewList: ['Change management frameworks','Organizational development and design','Executive leadership and coaching','Culture and engagement strategy','Transformation consulting','Conflict resolution and negotiation','Team dynamics and performance','Strategic communication for change'],
    curriculumHeading: 'Two years · six academic terms plus capstone · 83 CH | 135 ECTS.',
    careerTitle: 'Your Future in Leadership & Change',
    careerDesc: 'The Leadership & Change specialization prepares students for senior roles in organizational development, change management, and transformation leadership. Students develop skills to lead people through change.',
    careers: [
      {title:'Change Management Director',desc:'Lead organizational change initiatives, managing resistance and driving adoption across all levels.'},
      {title:'Organizational Development VP',desc:'Design and implement OD strategies that improve organizational effectiveness and culture.'},
      {title:'Leadership Development Director',desc:'Create and deliver leadership programs that build the next generation of organizational leaders.'},
      {title:'Transformation Consultant',desc:'Advise organizations on digital transformation, restructuring, and strategic change initiatives.'},
      {title:'Culture & Engagement Director',desc:'Shape organizational culture and drive employee engagement through strategic initiatives.'},
      {title:'Executive Coach',desc:'Provide one-on-one coaching to senior leaders, developing their effectiveness and impact.'},
      {title:'HR Transformation Lead',desc:'Lead HR function transformation, modernizing processes, technology, and operating models.'},
      {title:'Chief Transformation Officer',desc:'Lead enterprise-wide transformation initiatives, reporting directly to the CEO and board.'}
    ],
    ielts: 'IELTS Overall 6.0 with no single element below 5.5',
    testimonial: 'The Leadership & Change specialization gave me the frameworks and confidence to lead major organizational transformations. The dual degree was a differentiator.',
    testimonialLabel: 'MSc in International Business Administration — Leadership & Change'
  },
  {
    file: 'programs/masters/sports-management.html',
    title: 'Sports Management — Master\'s Degree | AUS Business School',
    heroBadge: 'MSc in International Business Administration',
    heroName: 'Sports Management',
    specialization: 'Sports Management',
    tuDegree: 'Master of Business Administration',
    tuition: '25,050',
    duration: '2 Years',
    structure: '6 Academic Terms + Capstone',
    credits: '83 CH | 135 ECTS',
    heroImg: 'https://images.unsplash.com/photo-1461896836934-bd45ba8a0e24?w=1800&auto=format&fit=crop&q=80',
    overviewH2: 'Lead at the highest levels of the global sports industry.',
    overviewP1: 'The Sports Management specialization at the master\'s level prepares professionals to lead sports organizations, manage major sporting events, and drive strategy in professional sports. Covering sports business strategy, facility management, media rights, and international sports governance, graduates are ready for C-suite and director-level roles in the global sports industry.',
    overviewP2: 'The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland.',
    overviewList: ['Sports business strategy','Facility and venue management','Sports media and broadcasting','Event management and operations','Sports law and governance','International sports organizations','Fan engagement and digital media','Sports finance and investment'],
    curriculumHeading: 'Two years · six academic terms plus capstone · 83 CH | 135 ECTS.',
    careerTitle: 'Your Future in Sports Management',
    careerDesc: 'The Sports Management specialization prepares students for senior leadership roles in sports organizations, events, media, and consulting. Students develop strategic capabilities for the global sports industry.',
    careers: [
      {title:'Sports Organization CEO',desc:'Lead sports organizations, setting strategic direction and overseeing all business operations.'},
      {title:'Athletic Director',desc:'Lead athletic departments, overseeing programs, budgets, compliance, and strategic growth.'},
      {title:'Sports Event Director',desc:'Plan and execute major sporting events, from bid processes to delivery and legacy planning.'},
      {title:'Sports Facility Director',desc:'Manage sports venues and facilities, overseeing operations, events, and capital projects.'},
      {title:'Sports Media Director',desc:'Lead media strategy, broadcast rights, and content distribution for sports organizations.'},
      {title:'Sports Sponsorship Director',desc:'Develop and manage sponsorship portfolios that drive revenue and brand partnerships.'},
      {title:'Olympic / International Sports Manager',desc:'Manage operations, logistics, and strategy for international sports organizations and events.'},
      {title:'Sports Consulting Director',desc:'Advise sports organizations on strategy, operations, commercial development, and governance.'}
    ],
    ielts: 'IELTS Overall 6.0 with no single element below 5.5',
    testimonial: 'The Sports Management specialization gave me the strategic leadership skills to lead at the highest levels of the sports industry. The dual degree was incredible.',
    testimonialLabel: 'MSc in International Business Administration — Sports Management'
  },
  {
    file: 'programs/masters/strategic-brand-digital-marketing.html',
    title: 'Strategic Brand & Digital Marketing — Master\'s Degree | AUS Business School',
    heroBadge: 'MSc in International Business Administration',
    heroName: 'Strategic Brand & Digital Marketing',
    specialization: 'Strategic Brand & Digital Marketing',
    tuDegree: 'Master of Business Administration',
    tuition: '25,050',
    duration: '2 Years',
    structure: '6 Academic Terms + Capstone',
    credits: '83 CH | 135 ECTS',
    heroImg: 'https://images.unsplash.com/photo-1533750349088-cd871a92f17e?w=1800&auto=format&fit=crop&q=80',
    overviewH2: 'Master the art and science of modern brand leadership.',
    overviewP1: 'The Strategic Brand & Digital Marketing specialization at the master\'s level prepares senior marketing professionals to lead brand strategy, digital transformation, and omnichannel marketing. Covering brand architecture, digital ecosystems, marketing analytics, and creative direction, graduates are ready for CMO and VP-level roles in the world\'s leading brands.',
    overviewP2: 'The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland.',
    overviewList: ['Brand strategy and architecture','Digital marketing ecosystems','Marketing analytics and attribution','Creative direction and design thinking','Content strategy and storytelling','Social media and influencer marketing','Omnichannel customer experience','Marketing technology and automation'],
    curriculumHeading: 'Two years · six academic terms plus capstone · 83 CH | 135 ECTS.',
    careerTitle: 'Your Future in Strategic Brand & Digital Marketing',
    careerDesc: 'The Strategic Brand & Digital Marketing specialization prepares students for senior leadership roles in brand management, digital marketing, and creative direction. Students develop strategic and creative capabilities.',
    careers: [
      {title:'Chief Marketing Officer',desc:'Lead enterprise marketing strategy, brand management, and customer acquisition across all channels.'},
      {title:'Brand Director',desc:'Lead brand strategy, positioning, and architecture for global brands across markets.'},
      {title:'Digital Marketing VP',desc:'Oversee digital marketing strategy, channels, and technology across the organization.'},
      {title:'Creative Director',desc:'Lead creative vision, design direction, and brand expression across all touchpoints.'},
      {title:'Content Strategy Director',desc:'Develop and manage content strategies that drive engagement, authority, and conversion.'},
      {title:'Social Media Director',desc:'Lead social media strategy, community management, and influencer partnerships.'},
      {title:'Marketing Analytics Director',desc:'Use data and analytics to optimize marketing performance and drive ROI across channels.'},
      {title:'E-Commerce Director',desc:'Lead online sales strategy, digital storefronts, and conversion optimization.'}
    ],
    ielts: 'IELTS Overall 6.0 with no single element below 5.5',
    testimonial: 'The Strategic Brand & Digital Marketing specialization gave me the creative and strategic skills to lead brand transformation. The dual degree opened global doors.',
    testimonialLabel: 'MSc in International Business Administration — Strategic Brand & Digital Marketing'
  },
  {
    file: 'programs/masters/aviation-management.html',
    title: 'Aviation Management — Master\'s Degree | AUS Business School',
    heroBadge: 'MSc in International Business Administration',
    heroName: 'Aviation Management',
    specialization: 'Aviation Management',
    tuDegree: 'Master of Business Administration',
    tuition: '25,050',
    duration: '2 Years',
    structure: '6 Academic Terms + Capstone',
    credits: '83 CH | 135 ECTS',
    heroImg: 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=1800&auto=format&fit=crop&q=80',
    overviewH2: 'Lead the future of global aviation at the executive level.',
    overviewP1: 'The Aviation Management specialization at the master\'s level prepares senior professionals for executive roles in airlines, airports, and aviation consulting. Covering airline strategy, airport planning, aviation safety management, and aerospace innovation, graduates are ready to lead in one of the world\'s most complex and globalized industries.',
    overviewP2: 'The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland.',
    overviewList: ['Airline strategy and operations','Airport planning and management','Aviation safety and regulatory compliance','Aviation consulting and advisory','Aerospace innovation and sustainability','Air cargo and logistics management','Aviation finance and investment','International aviation law'],
    curriculumHeading: 'Two years · six academic terms plus capstone · 83 CH | 135 ECTS.',
    careerTitle: 'Your Future in Aviation Management',
    careerDesc: 'The Aviation Management specialization prepares students for executive-level roles in airlines, airports, aviation consulting, and aerospace. Students develop strategic leadership skills for the global aviation industry.',
    careers: [
      {title:'Airline CEO',desc:'Lead airlines, setting strategic direction, fleet planning, route network, and commercial strategy.'},
      {title:'Airport Director',desc:'Manage airport operations, commercial activities, infrastructure development, and stakeholder relations.'},
      {title:'Aviation Consulting Director',desc:'Advise airlines, airports, and governments on strategy, operations, and regulatory matters.'},
      {title:'Aviation Safety Director',desc:'Lead safety management systems and ensure compliance with international aviation safety standards.'},
      {title:'Airline Strategy Director',desc:'Develop and execute long-term strategic plans for airlines in competitive global markets.'},
      {title:'Aviation Innovation Director',desc:'Drive adoption of new technologies, sustainable practices, and innovative business models in aviation.'},
      {title:'Air Cargo Director',desc:'Manage global air cargo operations, freight logistics, and supply chain partnerships.'},
      {title:'Aviation Regulatory Director',desc:'Navigate international aviation regulations and represent organizations in regulatory affairs.'}
    ],
    ielts: 'IELTS Overall 6.0 with no single element below 5.5',
    testimonial: 'The Aviation Management specialization gave me the executive-level skills and industry knowledge to lead in global aviation. The dual degree was a differentiator.',
    testimonialLabel: 'MSc in International Business Administration — Aviation Management'
  }
];

// Generate bachelor pages
bachelorPrograms.forEach(p => generatePage(p));

// Generate master pages
masterPrograms.forEach(p => generatePage(p));

// ===== DBA PAGE =====
generatePage({
  file: 'programs/doctorate/dba.html',
  title: 'Doctorate in Business Administration | AUS Business School',
  heroBadge: 'Doctorate in Business Administration',
  heroName: 'Doctorate in Business Administration',
  specialization: 'Business Administration',
  tuDegree: 'Doctor of Business Administration',
  duration: '3 Years (Part-Time)',
  structure: 'Part-Time Structure',
  credits: '120 CH | 240 ECTS',
  studyMode: 'Part-Time',
  heroImg: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1800&auto=format&fit=crop&q=80',
  overviewH2: 'The highest level of professional business education — for senior executives and leaders.',
  overviewP1: 'The Doctorate in Business Administration (DBA) is the highest level of professional business education. Designed for senior executives, entrepreneurs, and leaders with extensive professional experience, the DBA combines rigorous academic research with real-world application. Students conduct original research that addresses complex business challenges, contributing new knowledge to the field of management.',
  overviewP2: 'The dual degree allows students enrolled in the program to earn a Degree from Switzerland and a Degree from the United States of America whilst studying entirely in Switzerland.',
  overviewList: ['Executive leadership and strategic thinking','Advanced business research methodologies','Organizational transformation and innovation','Industry-specific expertise development','Doctoral dissertation and original research','Global business governance','Ethical leadership and corporate responsibility','Knowledge transfer and thought leadership'],
  curriculumHeading: 'Three years · part-time structure · 120 CH | 240 ECTS.',
  careerTitle: 'Your Future with a DBA',
  careerDesc: 'The DBA prepares graduates for the highest levels of professional and academic leadership, combining executive expertise with original research capabilities.',
  careers: [
    {title:'C-Suite Executive',desc:'Lead organizations at the highest level, driving strategy, growth, and stakeholder value.'},
    {title:'Business Consultant',desc:'Advise Fortune 500 companies and governments on complex strategic and operational challenges.'},
    {title:'Academic Researcher',desc:'Conduct original research and publish in leading academic journals, shaping business theory.'},
    {title:'Board Member',desc:'Serve on corporate or nonprofit boards, providing governance and strategic oversight.'},
    {title:'Entrepreneur',desc:'Found and scale ventures based on original research and deep industry expertise.'},
    {title:'Industry Expert',desc:'Become a recognized thought leader through publications, speaking, and consulting.'},
    {title:'Policy Advisor',desc:'Advise governments and international organizations on business and economic policy.'},
    {title:'Executive Educator',desc:'Teach and develop MBA and executive education programs at leading business schools.'}
  ],
  tuition: '35,000',
  ielts: 'IELTS Overall 6.5 with no single element below 6.0',
  testimonial: 'The DBA transformed my approach to leadership. The rigorous research and global perspective I gained at AUS have fundamentally changed how I lead and innovate in my organization.',
  testimonialLabel: 'DBA — Business Administration'
});

// ===== FEDERAL DIPLOMA PAGE =====
generatePage({
  file: 'programs/federal-diploma.html',
  title: 'Swiss Federal Diploma in Business Administration | AUS Business School',
  heroBadge: 'Swiss Federal Diploma',
  heroName: 'Swiss Federal Diploma in Business Administration',
  specialization: 'Business Administration',
  tuDegree: 'Swiss Federal Diploma',
  duration: '2 Years (Part-Time)',
  structure: '4 Academic Terms',
  credits: '60 CH | 120 ECTS',
  studyMode: 'Part-Time',
  heroImg: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1800&auto=format&fit=crop&q=80',
  overviewH2: 'A Swiss-recognized professional qualification — for experienced professionals.',
  overviewP1: 'The Swiss Federal Diploma in Business Administration provides a nationally recognized professional qualification that validates advanced business competencies. Designed for experienced professionals seeking formal recognition of their expertise, the program combines rigorous academic content with practical application, ensuring graduates meet the highest Swiss professional standards.',
  overviewP2: 'The program is recognized by Swiss authorities and provides a pathway to senior management roles in Swiss and international organizations.',
  overviewList: ['Swiss-recognized professional qualification','Part-time study for working professionals','Business management fundamentals','Strategic leadership and operations','Financial management and accounting','Marketing and business development','Organizational behavior and HR','Practical capstone project'],
  curriculumHeading: 'Two years · four academic terms · 60 CH | 120 ECTS.',
  careerTitle: 'Your Future with a Swiss Federal Diploma',
  careerDesc: 'The Swiss Federal Diploma prepares experienced professionals for senior management roles with a nationally recognized qualification.',
  careers: [
    {title:'Senior Manager',desc:'Lead teams and departments with formal recognition of advanced business competencies.'},
    {title:'Business Director',desc:'Oversee business units or functions with the authority of a Swiss-recognized qualification.'},
    {title:'Operations Director',desc:'Manage complex operations with the strategic and operational skills validated by the diploma.'},
    {title:'Management Consultant',desc:'Advise organizations with a qualification recognized across Swiss and European markets.'},
    {title:'Project Leader',desc:'Lead major projects and initiatives with formal professional recognition.'},
    {title:'Department Head',desc:'Manage departments in multinational organizations with Swiss-recognized credentials.'},
    {title:'Entrepreneur',desc:'Launch and manage businesses with a formal professional qualification from Switzerland.'},
    {title:'Industry Specialist',desc:'Specialize in specific sectors with a qualification valued by Swiss employers.'}
  ],
  tuition: '18,000',
  testimonial: 'The Swiss Federal Diploma gave me the formal recognition I needed to advance into senior management. The program combined practical relevance with academic rigor.',
  testimonialLabel: 'Swiss Federal Diploma — Business Administration'
});

console.log('\nAll 21 pages created successfully!');
