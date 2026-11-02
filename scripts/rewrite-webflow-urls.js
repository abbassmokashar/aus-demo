const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const skipped = new Set([
  '.chrome-backup', '.git', '.visual-check', 'hbs-demo-deploy', 'history',
  'node_modules', 'tmp', 'webflow'
]);

const livePaths = {
  'index.html': '/',
  'about.html': '/about-us',
  'about/faculty.html': '/faculty',
  'about/policies-and-procedures.html': '/policies',
  'admissions.html': '/admissions-financing',
  'student-life.html': '/student-life'
};

const customPaths = {
  '404.html': '/404',
  'programs.html': '/programs',
  'programs/bachelors/aviation-business-airport-operations.html': '/bachelors-degree/aviation-business-airport-operations',
  'programs/bachelors/business-analytics-ai-applications.html': '/bachelors-degree/business-analytics-ai-applications',
  'programs/bachelors/finance-fintech-digital-banking.html': '/bachelors-degree/finance-fintech-digital-banking',
  'programs/bachelors/international-business-trade-supply-chain.html': '/bachelors-degree/international-business-trade-supply-chain',
  'programs/bachelors/entrepreneurship-innovation-family-business.html': '/bachelors-degree/entrepreneurship-innovation-family-business',
  'programs/masters/aviation-strategy-sustainability-leadership.html': '/masters-degree/aviation-strategy-sustainability-leadership',
  'programs/masters/ai-strategy-digital-transformation.html': '/masters-degree/ai-strategy-digital-transformation',
  'programs/masters/financial-strategy-investment-fintech.html': '/masters-degree/financial-strategy-investment-fintech',
  'programs/masters/global-strategy-risk-supply-chain-leadership.html': '/masters-degree/global-strategy-risk-supply-chain-leadership',
  'programs/masters/innovation-growth-family-enterprise-leadership.html': '/masters-degree/innovation-growth-family-enterprise-leadership',
  'study-in-switzerland.html': '/study-in-switzerland',
  'veterans-study-in-switzerland.html': '/veterans-study-in-switzerland',
  'brochures.html': '/brochures',
  'brochure-library.html': '/brochure-library',
  'contact-us.html': '/contact-us',
  'faq.html': '/faq',
  'housing.html': '/housing',
  'student-activities.html': '/student-activities',
  'student-life/campus.html': '/campus-life',
  'campus-facilities.html': '/campus-facilities',
  'living-in-switzerland.html': '/living-in-switzerland',
  'careers-outcomes.html': '/careers-outcomes',
  'alumni-success.html': '/alumni-success',
  'tuition-fees-scholarships.html': '/tuition-fees-scholarships',
  'about/history.html': '/history',
  'about/governance.html': '/governance',
  'about/accreditation.html': '/accreditation',
  'about/rankings.html': '/rankings',
  'about/meet-our-people.html': '/meet-our-people',
  'about/industry-partners/ibm.html': '/industry-partners-and-collaborations',
  'about/news-and-events/speaker-series.html': '/speaker-series',
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
  if (!match) return value;
  const currentDir = path.posix.dirname(sourceRelative(currentFile));
  let destination;

  if (match[1].endsWith('.html')) {
    let target = path.posix.normalize(path.posix.join(currentDir, match[1]));
    if (!destinations[target]) {
      const rootRelative = path.posix.normalize(match[1]).replace(/^\.\//, '');
      if (destinations[rootRelative]) target = rootRelative;
    }
    destination = destinations[target] || `/${target.replace(/\.html$/, '')}`;
  }

  if (!destination) return value;
  return destination + (match[2] || '');
}

function externalProgramMediaUrl(value) {
  return value;
}

function canonicalizeDocument(source, file, options = {}) {
  source = source.replace(/(href|action)=(['"])([^'"]+)\2/g, (whole, attribute, quote, value) => `${attribute}=${quote}${canonicalize(value, file)}${quote}`);
  source = source.replace(/\b(url|href):(['"])([^'"]+)\2/g, (whole, attribute, quote, value) => `${attribute}:${quote}${canonicalize(value, file)}${quote}`);
  source = source.replace(/((?:window\.)?location(?:\.href)?\s*=\s*)(['"])([^'"]+)\2/g, (whole, prefix, quote, value) => `${prefix}${quote}${canonicalize(value, file)}${quote}`);
  if (options.externalizeAssets) {
    source = source.replace(/(src)=(['"])([^'"]+)\2/g, (whole, attribute, quote, value) => `${attribute}=${quote}${externalProgramMediaUrl(value)}${quote}`);
  }
  source = source.replace(
    /var href=h\.url;\r?\n([ \t]*)if\(href\.indexOf\("\?q="\)===-1\) href\+=\(href\.indexOf\("\?"\)!==-1\?"&":"\?"\)\+"q="\+encodeURIComponent\(q\);/g,
    (_, indent) => `var href=h.url,hash="",hashAt=href.indexOf("#");\n${indent}if(hashAt!==-1){ hash=href.slice(hashAt); href=href.slice(0,hashAt); }\n${indent}if(href.indexOf("?q=")===-1) href+=(href.indexOf("?")!==-1?"&":"?")+"q="+encodeURIComponent(q);\n${indent}href+=hash;`
  );
  return source;
}

function rewriteAll() {
  let changedFiles = 0;
  for (const file of listHtml(root)) {
    let source = fs.readFileSync(file, 'utf8');
    const before = source;
    source = canonicalizeDocument(source, file);
    if (source !== before) {
      fs.writeFileSync(file, source);
      changedFiles += 1;
    }
  }
  console.log(`Canonicalized Webflow URLs in ${changedFiles} HTML files.`);
}

module.exports = {
  canonicalize,
  canonicalizeDocument,
  customPaths,
  destinations,
  externalProgramMediaUrl,
  livePaths,
  sourceRelative
};

if (require.main === module) rewriteAll();
