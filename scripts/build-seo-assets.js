const fs = require('fs');
const path = require('path');
const { pages, site } = require('./seo-config');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const indexableRoutes = Object.keys(pages).filter((route) => !pages[route].noindex).sort();

function absoluteUrl(route) {
  return route === '/' ? `${site.baseUrl}/` : `${site.baseUrl}${route}`;
}

function xmlEscape(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function csvEscape(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function writeBoth(name, content) {
  fs.writeFileSync(path.join(root, name), content, 'utf8');
  fs.mkdirSync(dist, { recursive: true });
  fs.writeFileSync(path.join(dist, name), content, 'utf8');
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexableRoutes.map((route) => `  <url><loc>${xmlEscape(absoluteUrl(route))}</loc></url>`).join('\n')}
</urlset>
`;

const robots = `User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: *
Allow: /

Sitemap: ${site.baseUrl}/sitemap.xml
`;

const programRoutes = Object.entries(pages).filter(([, item]) => item.program);
const llms = `# AUS Business School

> AUS Business School, legally the American Institute of Applied Sciences in Switzerland, is an international business school in La Tour-de-Peilz, Canton of Vaud, Switzerland. AUS offers practice-led business education in English through Bachelor's, Master's, Doctorate in Business Administration and Swiss Federal Diploma programs.

Canonical website: ${site.baseUrl}/

## Institution

- [About AUS](${site.baseUrl}/about-us): Mission, values and educational approach.
- [Accreditation and recognition](${site.baseUrl}/accreditation): Institutional accreditation, recognition and memberships.
- [Rankings and recognition](${site.baseUrl}/rankings): Rankings and QS Stars information.
- [Faculty](${site.baseUrl}/faculty): Academic faculty and teaching expertise.
- [Leadership and governance](${site.baseUrl}/governance): Institutional leadership and oversight.
- [Policies and procedures](${site.baseUrl}/policies): Official academic, student and institutional policies.

## Study at AUS

- [All business programs](${site.baseUrl}/programs): Overview of all study levels and specializations.
- [Find your program](${site.baseUrl}/find-programs): Guided program-matching tool.
- [Compare programs](${site.baseUrl}/compare-programs): Side-by-side program comparison.
${programRoutes.map(([route, item]) => `- [${item.program.credential}](${site.baseUrl}${route}): ${item.description}`).join('\n')}

## Admissions and student information

- [Admissions and financing](${site.baseUrl}/admissions-financing): Application process, requirements, deadlines, financing and visa guidance.
- [Campus facilities](${site.baseUrl}/campus-facilities): Classrooms, conference rooms, student spaces and nearby sports facilities in La Tour-de-Peilz.
- [Tuition fees and scholarships](${site.baseUrl}/tuition-fees-scholarships): Tuition and scholarship information.
- [International students](${site.baseUrl}/international-students): Visa, permit and arrival guidance.
- [Student life](${site.baseUrl}/student-life): Campus, housing, activities and life in Switzerland.
- [Careers and outcomes](${site.baseUrl}/careers-outcomes): Career services, internships, employers and graduate outcomes.
- [Frequently asked questions](${site.baseUrl}/faq): Answers about admissions, fees, visas, housing and registration.

## Contact and location

- [Contact AUS](${site.baseUrl}/contact-us): Email, telephone, working hours, advising, campus visits and directions.

AUS Business School is located at Chemin du Levant 5, 1814 La Tour-de-Peilz, Switzerland. Telephone: +41 21 944 95 01. Email: info@aus.swiss.
`;

writeBoth('sitemap.xml', sitemap);
writeBoth('robots.txt', robots);
writeBoth('llms.txt', llms);

const webflowDirectory = path.join(root, 'webflow');
fs.mkdirSync(webflowDirectory, { recursive: true });
const csvHeader = ['Slug', 'SEO title', 'Meta description', 'Open Graph title', 'Open Graph description', 'Open Graph image'];
const csvRows = indexableRoutes.map((route) => {
  const meta = pages[route];
  return [route, meta.title, meta.description, meta.title, meta.description, site.defaultImage].map(csvEscape).join(',');
});
const seoCsv = [csvHeader.map(csvEscape).join(','), ...csvRows].join('\n') + '\n';
let seoSheetName = 'seo-settings.csv';
try {
  fs.writeFileSync(path.join(webflowDirectory, seoSheetName), seoCsv, 'utf8');
} catch (error) {
  if (error.code !== 'EBUSY') throw error;
  seoSheetName = 'seo-settings-latest.csv';
  fs.writeFileSync(path.join(webflowDirectory, seoSheetName), seoCsv, 'utf8');
  console.warn('webflow/seo-settings.csv is open in another application; wrote webflow/seo-settings-latest.csv instead.');
}

const guide = `# Webflow SEO implementation

The standalone HTML and generated Code Embed packages already contain the page-specific structured data. Complete these Webflow settings when the embeds are installed:

1. Set the Webflow global canonical URL to \`${site.baseUrl}\` (no trailing slash). Do not add another canonical tag through custom code.
2. Use [webflow/${seoSheetName}](webflow/${seoSheetName}) to populate each page's SEO title, meta description, Open Graph title, Open Graph description and Open Graph image in Page settings.
3. Enable Webflow's auto-generated sitemap and keep the 404 utility page excluded from indexing.
4. In Site settings, use the contents of [robots.txt](robots.txt) as the custom robots policy if Webflow is not already serving an equivalent policy.
5. Publish [llms.txt](llms.txt) at the production root if the hosting layer supports static root files or rewrites.
6. After publishing, submit \`${site.baseUrl}/sitemap.xml\` in Google Search Console and Bing Webmaster Tools, then test representative program, FAQ and breadcrumb pages in Google's Rich Results Test.

Do not add meta-keywords tags. Google does not use them for ranking.
`;
fs.writeFileSync(path.join(root, 'SEO-WEBFLOW-GUIDE.md'), guide, 'utf8');

console.log(`Built sitemap.xml with ${indexableRoutes.length} canonical URLs, robots.txt, llms.txt and the Webflow SEO settings sheet.`);
