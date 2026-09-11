const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const skipped = new Set(['.chrome-backup', '.git', '.visual-check', 'history', 'node_modules', 'webflow']);

const livePaths = {
  'index.html': '/',
  'about.html': '/about-us',
  'about/faculty.html': '/faculty',
  'about/policies-and-procedures.html': '/policies',
  'admissions.html': '/admissions-financing',
  'student-life.html': '/student-life',
  'programs/bachelors/accounting.html': '/bachelors-degree/accounting',
  'programs/bachelors/aviation-management.html': '/bachelors-degree/aviation-management',
  'programs/bachelors/business-management.html': '/bachelors-degree/business-management',
  'programs/bachelors/healthcare-administration.html': '/bachelors-degree/healthcare-administration',
  'programs/bachelors/hospitality-management.html': '/bachelors-degree/hospitality-management',
  'programs/bachelors/human-resource-management.html': '/bachelors-degree/human-resource-management',
  'programs/bachelors/integrated-digital-marketing.html': '/bachelors-degree/integrated-digital-marketing',
  'programs/bachelors/international-business.html': '/bachelors-degree/international-business',
  'programs/bachelors/sports-management-athletic-administration.html': '/bachelors-degree/sports-management-athletic-administration',
  'programs/bachelors/sports-management-sports-marketing.html': '/bachelors-degree/sports-management-sports-marketing',
  'programs/masters/aviation-management.html': '/masters-degree/aviation-management',
  'programs/masters/data-analytics.html': '/masters-degree/data-analytics',
  'programs/masters/finance.html': '/masters-degree/finance',
  'programs/masters/healthcare-administration.html': '/masters-degree/healthcare-administration',
  'programs/masters/human-resource-management.html': '/masters-degree/human-resource-management',
  'programs/masters/international-business.html': '/masters-degree/international-business',
  'programs/masters/leadership-and-change.html': '/masters-degree/leadership-change',
  'programs/masters/sports-management.html': '/masters-degree/sports-management',
  'programs/masters/strategic-brand-digital-marketing.html': '/masters-degree/strategic-brand-digital-marketing',
  'programs/doctorate/dba.html': '/doctorate-in-business-administration',
  'programs/federal-diploma.html': '/swiss-federal-diploma-business-administration'
};

const customPaths = {
  'programs.html': '/programs',
  'compare-programs.html': '/compare-programs',
  'find-programs.html': '/find-programs',
  'cost-calculator.html': '/cost-calculator',
  'faq.html': '/faq',
  'housing.html': '/housing',
  'student-activities.html': '/student-activities',
  'student-life/campus.html': '/campus-life',
  'living-in-switzerland.html': '/living-in-switzerland',
  'careers-outcomes.html': '/careers-outcomes',
  'alumni-success.html': '/alumni-success',
  'tuition-fees-scholarships.html': '/tuition-fees-scholarships',
  'about/history.html': '/history',
  'about/governance.html': '/governance',
  'about/accreditation.html': '/accreditation',
  'about/rankings.html': '/rankings',
  'about/meet-our-people.html': '/meet-our-people',
  'about/academic-partners/tiffin-university.html': '/academic-partners/tiffin-university',
  'about/industry-partners/ibm.html': '/industry-partners-and-collaborations',
  'about/news-and-events/speaker-series.html': '/speaker-series',
  'admissions/bachelors.html': '/admissions-bachelors',
  'admissions/bachelors-requirements.html': '/bachelors-admission-requirements',
  'admissions/masters.html': '/admissions-masters',
  'admissions/masters-requirements.html': '/masters-admission-requirements',
  'admissions/doctoral.html': '/admissions-doctoral',
  'admissions/doctoral-requirements.html': '/doctoral-admission-requirements',
  'admissions/english-requirements.html': '/english-language-requirements',
  'admissions/international.html': '/international-students',
  'admissions/international-requirements.html': '/international-admission-requirements',
  'admissions/transfer-requirements.html': '/transfer-requirements'
};

const destinations = { ...customPaths, ...livePaths };

function listHtml(directory, output = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && skipped.has(entry.name) && entry.name !== 'dist') continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) listHtml(full, output);
    else if (entry.name.endsWith('.html')) output.push(full);
  }
  return output;
}

function sourceRelative(file) {
  let relative = path.relative(root, file).replace(/\\/g, '/');
  if (relative.startsWith('dist/')) relative = relative.slice(5);
  return relative;
}

function canonicalize(value, currentFile) {
  if (!value || /^(?:https?:|mailto:|tel:|javascript:|#|\/)/i.test(value)) return value;
  const match = value.match(/^([^?#]+)([?#][\s\S]*)?$/);
  if (!match || !match[1].endsWith('.html')) return value;
  const currentDir = path.posix.dirname(sourceRelative(currentFile));
  const target = path.posix.normalize(path.posix.join(currentDir, match[1]));
  const destination = destinations[target] || `/${target.replace(/\.html$/, '')}`;
  return destination + (match[2] || '');
}

let changedFiles = 0;
for (const file of listHtml(root)) {
  let source = fs.readFileSync(file, 'utf8');
  const before = source;
  source = source.replace(/(href|action)="([^"]+)"/g, (whole, attribute, value) => `${attribute}="${canonicalize(value, file)}"`);
  source = source.replace(/url:"([^"]+)"/g, (whole, value) => `url:"${canonicalize(value, file)}"`);
  source = source.replace(
    /var href=h\.url;\r?\n([ \t]*)if\(href\.indexOf\("\?q="\)===-1\) href\+=\(href\.indexOf\("\?"\)!==-1\?"&":"\?"\)\+"q="\+encodeURIComponent\(q\);/g,
    (_, indent) => `var href=h.url,hash="",hashAt=href.indexOf("#");\n${indent}if(hashAt!==-1){ hash=href.slice(hashAt); href=href.slice(0,hashAt); }\n${indent}if(href.indexOf("?q=")===-1) href+=(href.indexOf("?")!==-1?"&":"?")+"q="+encodeURIComponent(q);\n${indent}href+=hash;`
  );
  if (source !== before) {
    fs.writeFileSync(file, source);
    changedFiles += 1;
  }
}

console.log(`Canonicalized Webflow URLs in ${changedFiles} HTML files.`);
