const site = {
  baseUrl: 'https://www.aus.swiss',
  name: 'AUS Business School',
  legalName: 'American Institute of Applied Sciences in Switzerland',
  defaultImage: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6ab7dc4a8e5eb4e325dd9391_American-Institute-of-Applied-Sciences-in-Switzerland-Campus-main-picture-2025.jpg.webp',
  logo: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6a99cdf83566fae73a65cc9c_AUS%20Logo%202023.png'
};

const pages = {
  '/': {
    title: 'AUS Business School Switzerland | Applied Business Education',
    description: 'Discover AUS Business School and its practice-led approach to applied business education on the Swiss Riviera.'
  },
  '/404': {
    title: 'Page Not Found | AUS Business School',
    description: 'The requested page could not be found. Return to AUS Business School or explore admissions and student life.',
    noindex: true
  },
  '/about-us': {
    title: 'About AUS Business School in Switzerland | AUS',
    description: 'Discover AUS Business School, its mission, values and practice-led approach to international business education in La Tour-de-Peilz, Switzerland.'
  },
  '/accreditation': {
    title: 'Accreditation & Recognition | AUS Business School',
    description: 'Review the accreditation, recognition and professional memberships supporting AUS Business School and its international academic partnerships.'
  },
  '/admissions-financing': {
    title: 'Admissions & Financing | AUS Business School',
    description: 'Learn how to apply to AUS Business School, including entry requirements, documents, deadlines, tuition, scholarships, visas and enrollment steps.'
  },
  '/alumni-success': {
    title: 'AUS Alumni & Student Success Stories | AUS',
    description: 'Meet AUS graduates, explore student success stories and learn how the international alumni community supports careers beyond graduation.'
  },
  '/campus-life': {
    title: 'Campus Life on the Swiss Riviera | AUS',
    description: 'Explore the AUS campus in La Tour-de-Peilz, its learning spaces, Lake Geneva setting and student experience on the Swiss Riviera.'
  },
  '/campus-facilities': {
    title: 'Campus Facilities in La Tour-de-Peilz | AUS',
    description: 'Explore AUS classrooms, conference rooms, cafeteria, collaborative spaces and nearby sports facilities in La Tour-de-Peilz, Switzerland.'
  },
  '/brochures': {
    title: 'AUS Brochures | Academic Information',
    description: 'Check the status of updated AUS academic brochures and contact Admissions for the latest approved study information.'
  },
  '/brochure-library': {
    title: 'AUS Brochure Library | Academic Information',
    description: 'Access current guidance about AUS academic brochures and contact Admissions while updated materials are under review.'
  },
  '/careers-outcomes': {
    title: 'Careers, Internships & Graduate Outcomes | AUS',
    description: 'Explore career coaching, internships, employer connections, industry learning and graduate outcomes available to AUS Business School students.'
  },
  '/contact-us': {
    title: 'Contact AUS Business School in Switzerland | AUS',
    description: 'Contact AUS Business School in La Tour-de-Peilz by email, phone, appointment or campus visit. View working hours, address and directions.'
  },
  '/english-language-requirements': {
    title: 'English Language Requirements | AUS Admissions',
    description: 'Review accepted English-language qualifications and proficiency requirements for Bachelor, Master and doctoral study at AUS Business School.'
  },
  '/faculty': {
    title: 'Faculty | AUS Business School Switzerland',
    description: 'Meet the academics and industry practitioners who teach, mentor and support students across AUS Business School programs in Switzerland.'
  },
  '/faq': {
    title: 'Frequently Asked Questions | AUS Business School',
    description: 'Find answers about AUS admissions, tuition, scholarships, visas, housing, registration, arrival in Switzerland and student support.'
  },
  '/governance': {
    title: 'Leadership & Governance | AUS Business School',
    description: 'Learn about the leadership, oversight, accountability and governance structure of AUS Business School in Switzerland.'
  },
  '/history': {
    title: 'History of AUS Business School | Since 1991',
    description: 'Trace the history of AUS Business School from its educational roots to its development as an international business school in Switzerland.'
  },
  '/housing': {
    title: 'Student Housing in La Tour-de-Peilz | AUS',
    description: 'Explore student accommodation near AUS Business School, available housing options, the local area and how to request housing support.'
  },
  '/industry-partners-and-collaborations': {
    title: 'Industry Partners & Collaborations | AUS',
    description: 'Discover how AUS works with technology, aviation and business organizations to connect students with certifications and applied learning.'
  },
  '/international-admission-requirements': {
    title: 'International Admission Requirements | AUS',
    description: 'Review academic documents, translations, English proficiency, visa preparation and other requirements for international AUS applicants.'
  },
  '/international-students': {
    title: 'International Students & Swiss Visas | AUS',
    description: 'Guidance for international AUS students on applications, Swiss visas and permits, insurance, arrival planning and studying in Switzerland.'
  },
  '/living-in-switzerland': {
    title: 'Living and Transportation in Switzerland | AUS',
    description: 'Learn about living on the Swiss Riviera, local transportation, trains, airports and everyday student life around La Tour-de-Peilz.'
  },
  '/meet-our-people': {
    title: 'Meet Our Team | AUS Business School',
    description: 'Meet the leadership, academic and professional teams who support teaching, operations and the student experience at AUS Business School.'
  },
  '/policies': {
    title: 'Policies and Procedures | AUS Business School',
    description: 'Access AUS Business School academic, student, privacy, quality-assurance and institutional policies and procedures.'
  },
  '/programs': {
    title: 'Business Programs in Switzerland | AUS Business School',
    description: 'Explore applied BBA, MBA, Doctorate, Hospitality Management and Swiss Federal Diploma programs at AUS Business School in Switzerland.'
  },
  '/find-your-program': {
    title: 'Find Your Business Program | AUS Switzerland',
    description: 'Answer six quick questions and discover which current AUS Bachelor, Master, Doctorate or Swiss Federal Diploma pathway fits your goals.'
  },
  '/compare-specializations': {
    title: 'Compare AUS Programs and Specializations | AUS',
    description: 'Compare current AUS business programs and specializations by level, duration, credits, study structure, skills and academic focus.'
  },
  '/cost-calculator': {
    title: 'AUS Study Cost Calculator | Tuition and Living Costs',
    description: 'Estimate AUS tuition and student living costs in Switzerland, including accommodation, food, insurance, transportation and personal expenses.'
  },
  '/admissions-bachelors': {
    title: "Bachelor's Admissions in Switzerland | AUS",
    description: "Review the AUS bachelor's admissions process, application stages, deadlines, documents and next steps for studying in Switzerland."
  },
  '/bachelors-admission-requirements': {
    title: "Bachelor's Admission Requirements | AUS",
    description: "Review academic, English-language and application requirements for admission to an AUS bachelor's program in Switzerland."
  },
  '/admissions-masters': {
    title: "Master's Admissions in Switzerland | AUS",
    description: "Review the AUS master's admissions process, required documents, application stages and deadlines for graduate study in Switzerland."
  },
  '/masters-admission-requirements': {
    title: "Master's Admission Requirements | AUS",
    description: "Review degree, academic, English-language and application requirements for admission to an AUS master's program."
  },
  '/admissions-doctoral': {
    title: 'Doctoral Admissions in Switzerland | AUS',
    description: 'Review the AUS doctoral admissions process, applicant profile, application stages, required documents and deadlines.'
  },
  '/doctoral-admission-requirements': {
    title: 'DBA Admission Requirements | AUS',
    description: 'Review the academic, professional, research and application requirements for the AUS Doctorate in Business Administration.'
  },
  '/bachelors-degree/aviation-business-airport-operations': {
    title: 'BBA Aviation Business & Airport Operations | AUS',
    description: 'Study aviation business, airport operations and applied management in the 180 ECTS BBA specialization at AUS in Switzerland.'
  },
  '/bachelors-degree/business-analytics-ai-applications': {
    title: 'BBA Business Analytics & AI Applications | AUS',
    description: 'Build business, analytics and responsible AI application skills in the 180 ECTS BBA specialization at AUS in Switzerland.'
  },
  '/bachelors-degree/finance-fintech-digital-banking': {
    title: 'BBA Finance, FinTech & Digital Banking | AUS',
    description: 'Study finance, digital banking and FinTech business models in the 180 ECTS BBA specialization at AUS in Switzerland.'
  },
  '/bachelors-degree/international-business-trade-supply-chain': {
    title: 'BBA International Business, Trade & Supply Chain | AUS',
    description: 'Study international business, global trade and supply chain operations in the 180 ECTS BBA specialization at AUS.'
  },
  '/bachelors-degree/entrepreneurship-innovation-family-business': {
    title: 'BBA Entrepreneurship, Innovation & Family Business | AUS',
    description: 'Develop venture, innovation and family business skills in the 180 ECTS BBA specialization at AUS in Switzerland.'
  },
  '/bachelors-degree/hospitality-management': {
    title: 'Bachelor’s in Hospitality Management | AUS Switzerland',
    description: 'Study hospitality operations, guest experience, revenue management, events and sustainable tourism at AUS in Switzerland.'
  },
  '/masters-degree/aviation-strategy-sustainability-leadership': {
    title: 'MBA Aviation Strategy, Sustainability & Leadership | AUS',
    description: 'Develop strategic aviation, sustainability and leadership expertise in the 120 ECTS MBA specialization at AUS.'
  },
  '/masters-degree/ai-strategy-digital-transformation': {
    title: 'MBA AI Strategy & Digital Transformation | AUS',
    description: 'Lead AI adoption and digital business change through the 120 ECTS MBA specialization at AUS in Switzerland.'
  },
  '/masters-degree/financial-strategy-investment-fintech': {
    title: 'MBA Financial Strategy, Investment & FinTech | AUS',
    description: 'Advance your financial strategy, investment and FinTech expertise in the 120 ECTS MBA specialization at AUS.'
  },
  '/masters-degree/global-strategy-risk-supply-chain-leadership': {
    title: 'MBA Global Strategy, Risk & Supply Chain Leadership | AUS',
    description: 'Study global strategy, international risk and resilient supply chains in the 120 ECTS MBA specialization at AUS.'
  },
  '/masters-degree/innovation-growth-family-enterprise-leadership': {
    title: 'MBA Innovation, Growth & Family Enterprise Leadership | AUS',
    description: 'Develop innovation, growth and family enterprise leadership expertise in the 120 ECTS MBA specialization at AUS.'
  },
  '/doctorate-in-business-administration': {
    title: 'Doctorate in Business Administration in Switzerland | AUS',
    description: 'Pursue applied doctoral research for executive leadership and organizational practice through the DBA at AUS Business School in Switzerland.'
  },
  '/swiss-federal-diploma-business-administration': {
    title: 'Swiss Federal Diploma in Business Administration | AUS',
    description: 'Advance your professional business expertise through the Swiss Federal Diploma in Business Administration at AUS in Switzerland.'
  },
  '/rankings': {
    title: 'Rankings & Recognition | AUS Business School',
    description: 'Explore AUS Business School rankings, QS Stars ratings and recognition for teaching, employability, facilities and business education.'
  },
  '/study-in-switzerland': {
    title: 'Study Business in Switzerland | AUS Business School',
    description: 'Discover applied business education and student life at AUS Business School on Lake Geneva, and contact admissions for current study information.',
    llms: { label: 'Study business in Switzerland' }
  },
  '/veterans-study-in-switzerland': {
    title: 'GI Bill Study in Switzerland for U.S. Veterans | AUS',
    description: 'Eligible U.S. veterans can learn how Post-9/11 GI Bill benefits may support approved study at AUS in Switzerland and contact the admissions team for guidance.',
    llms: { label: 'GI Bill study in Switzerland for U.S. veterans' }
  },
  '/speaker-series': {
    title: 'Speaker Series & Industry Visits | AUS',
    description: 'Explore distinguished speakers, expert sessions and industry visits that connect AUS students with business leaders and applied learning.'
  },
  '/student-activities': {
    title: 'Student Activities and Support | AUS',
    description: 'Discover student activities, clubs, international community, advising and support services at AUS Business School in Switzerland.'
  },
  '/student-life': {
    title: 'Student Life in Switzerland | AUS Business School',
    description: 'Explore campus life, housing, activities, student support and daily life on the Swiss Riviera as an AUS Business School student.'
  },
  '/transfer-requirements': {
    title: 'Transfer Student Requirements | AUS Admissions',
    description: 'Learn how transfer applicants can submit prior transcripts, request credit evaluation and continue their studies at AUS Business School.'
  },
  '/tuition-fees-scholarships': {
    title: 'Tuition Fees & Scholarships | AUS Business School',
    description: 'Learn about AUS scholarship support and contact admissions for the latest approved tuition and study information.'
  }
};

const bachelorPrograms = {
  '/bachelors-degree/aviation-business-airport-operations': { name: 'BBA Specialization in Aviation Business & Airport Operations', subject: 'Aviation business and airport operations' },
  '/bachelors-degree/business-analytics-ai-applications': { name: 'BBA Specialization in Business Analytics & AI Applications', subject: 'Business analytics and AI applications' },
  '/bachelors-degree/finance-fintech-digital-banking': { name: 'BBA Specialization in Finance, FinTech & Digital Banking', subject: 'Finance, FinTech and digital banking' },
  '/bachelors-degree/international-business-trade-supply-chain': { name: 'BBA Specialization in International Business, Trade & Supply Chain', subject: 'International business, trade and supply chain' },
  '/bachelors-degree/entrepreneurship-innovation-family-business': { name: 'BBA Specialization in Entrepreneurship, Innovation & Family Business', subject: 'Entrepreneurship, innovation and family business' },
  '/bachelors-degree/hospitality-management': { name: 'Bachelor’s Degree in Hospitality Management', subject: 'Hospitality management, operations and guest experience' }
};
const masterPrograms = {
  '/masters-degree/aviation-strategy-sustainability-leadership': { name: 'MBA Specialization in Aviation Strategy, Sustainability & Leadership', subject: 'Aviation strategy, sustainability and leadership' },
  '/masters-degree/ai-strategy-digital-transformation': { name: 'MBA Specialization in AI Strategy & Digital Transformation', subject: 'AI strategy and digital transformation' },
  '/masters-degree/financial-strategy-investment-fintech': { name: 'MBA Specialization in Financial Strategy, Investment & FinTech', subject: 'Financial strategy, investment and FinTech' },
  '/masters-degree/global-strategy-risk-supply-chain-leadership': { name: 'MBA Specialization in Global Strategy, Risk & Supply Chain Leadership', subject: 'Global strategy, risk and supply chain leadership' },
  '/masters-degree/innovation-growth-family-enterprise-leadership': { name: 'MBA Specialization in Innovation, Growth & Family Enterprise Leadership', subject: 'Innovation, growth and family enterprise leadership' }
};

module.exports = { bachelorPrograms, masterPrograms, pages, site };
