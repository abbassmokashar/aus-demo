const fs = require('fs');
const path = require('path');
const { destinations } = require('./rewrite-webflow-urls');
const { pages, site } = require('./seo-config');

const root = path.resolve(__dirname, '..');
const skipped = new Set(['.git', '.chrome-backup', 'history', 'node_modules', 'program-media', 'webflow', 'Website Bank of Images', 'bank of images']);
const seoStart = '<!-- AUS SEO START -->';
const seoEnd = '<!-- AUS SEO END -->';

function listHtml(directory, output = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && skipped.has(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) listHtml(full, output);
    else if (entry.name.endsWith('.html')) output.push(full);
  }
  return output;
}

function routeForFile(file) {
  let relative = path.relative(root, file).replace(/\\/g, '/');
  if (relative.startsWith('dist/')) relative = relative.slice(5);
  if (destinations[relative]) return destinations[relative];
  const cleanRoute = relative.match(/^((?:bachelors-degree|masters-degree)\/[a-z0-9-]+|doctorate-in-business-administration|swiss-federal-diploma-business-administration)\/index\.html$/);
  return cleanRoute ? `/${cleanRoute[1]}` : null;
}

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function decodeText(value) {
  const entities = {
    amp: '&', apos: "'", quot: '"', nbsp: ' ', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘',
    rdquo: '”', ldquo: '“', hellip: '…', bull: '•', copy: '©'
  };
  return value
    .replace(/<br\s*\/?\s*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#(\d+);/g, (_match, number) => String.fromCodePoint(Number(number)))
    .replace(/&#x([\da-f]+);/gi, (_match, number) => String.fromCodePoint(parseInt(number, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => entities[name.toLowerCase()] ?? match)
    .replace(/\s+/g, ' ')
    .trim();
}

function extractPageImage(html) {
  const hero = html.match(/<(?:header|div)\b[^>]*class="[^"]*(?:hero|page-hero)[^"]*"[\s\S]*?<img\b[^>]*src="([^"]+)"/i);
  if (hero && /^https:\/\//.test(hero[1])) return hero[1].replace(/&amp;/g, '&');
  return site.defaultImage;
}

function breadcrumbFor(route, title) {
  if (route === '/') return null;
  const crumbs = [{ name: 'Home', url: `${site.baseUrl}/` }];
  if (/^\/(?:bachelors-degree|masters-degree)\//.test(route) || /^(?:\/doctorate-in-business-administration|\/swiss-federal-diploma)/.test(route)) {
    crumbs.push({ name: 'Programs', url: `${site.baseUrl}/programs` });
  } else if (/admission|international-students|transfer-requirements|english-language/.test(route)) {
    crumbs.push({ name: 'Admissions', url: `${site.baseUrl}/admissions-financing` });
  } else if (/^\/(?:about-us|academic-partners|accreditation|faculty|governance|history|industry-partners|meet-our-people|policies|rankings|speaker-series)/.test(route) && route !== '/about-us') {
    crumbs.push({ name: 'About AUS', url: `${site.baseUrl}/about-us` });
  } else if (/^\/(?:campus-life|housing|living-in-switzerland|student-activities)/.test(route)) {
    crumbs.push({ name: 'Student Life', url: `${site.baseUrl}/student-life` });
  }
  crumbs.push({ name: title.replace(/\s*\|[\s\S]*$/, ''), url: `${site.baseUrl}${route}` });
  return {
    '@type': 'BreadcrumbList',
    '@id': `${site.baseUrl}${route}#breadcrumb`,
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem', position: index + 1, name: crumb.name, item: crumb.url
    }))
  };
}

function faqEntities(html) {
  const entities = [];
  const pattern = /<button\b[^>]*class="[^"]*faq-q[^"]*"[^>]*>([\s\S]*?)<span\b[^>]*class="faq-icon"[\s\S]*?<\/button>\s*<div\b[^>]*class="[^"]*faq-a[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
  for (const match of html.matchAll(pattern)) {
    const name = decodeText(match[1]);
    const answer = decodeText(match[2]);
    if (name && answer) entities.push({
      '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text: answer }
    });
  }
  return entities;
}

function structuredData(route, meta, html, image) {
  const canonical = `${site.baseUrl}${route === '/' ? '/' : route}`;
  const organizationId = `${site.baseUrl}/#organization`;
  const websiteId = `${site.baseUrl}/#website`;
  const graph = [{
    '@type': ['CollegeOrUniversity', 'EducationalOrganization'],
    '@id': organizationId,
    name: site.name,
    legalName: site.legalName,
    alternateName: ['AUS', 'AUS Switzerland'],
    url: `${site.baseUrl}/`,
    logo: { '@type': 'ImageObject', url: site.logo },
    image: site.defaultImage,
    foundingDate: '1991',
    telephone: '+41 21 944 95 01',
    address: {
      '@type': 'PostalAddress', streetAddress: 'Chemin du Levant 5', postalCode: '1814',
      addressLocality: 'La Tour-de-Peilz', addressRegion: 'Vaud', addressCountry: 'CH'
    },
    sameAs: [
      'https://www.linkedin.com/school/aus-swiss/',
      'https://www.facebook.com/american.institute.switzerland',
      'https://www.instagram.com/aus.swiss/',
      'https://www.tiktok.com/@aus.swiss',
      'https://www.youtube.com/channel/UCKUFsoxwPuaH8bi0vMoSTaQ'
    ]
  }, {
    '@type': 'WebSite', '@id': websiteId, url: `${site.baseUrl}/`, name: site.name,
    publisher: { '@id': organizationId }, inLanguage: 'en-CH'
  }];

  const faq = route === '/faq' ? faqEntities(html) : [];
  const webPage = {
    '@type': faq.length ? 'FAQPage' : 'WebPage',
    '@id': `${canonical}#webpage`, url: canonical, name: meta.title, description: meta.description,
    isPartOf: { '@id': websiteId }, about: { '@id': organizationId }, inLanguage: 'en-CH',
    primaryImageOfPage: { '@type': 'ImageObject', url: image },
    potentialAction: { '@type': 'ReadAction', target: canonical }
  };
  if (faq.length) webPage.mainEntity = faq;
  graph.push(webPage);

  const breadcrumb = breadcrumbFor(route, meta.title);
  if (breadcrumb) graph.push(breadcrumb);

  if (meta.program) {
    const courseId = `${canonical}#course`;
    graph.push({
      '@type': 'Course', '@id': courseId, name: meta.program.credential, description: meta.description,
      url: canonical, provider: { '@id': organizationId }, inLanguage: 'en',
      educationalLevel: meta.program.level, teaches: meta.program.subject
    });
    webPage.mainEntity = { '@id': courseId };
  }

  if (route === '/programs') {
    const programEntries = Object.entries(pages).filter(([, item]) => item.program);
    const listId = `${canonical}#program-list`;
    graph.push({
      '@type': 'ItemList', '@id': listId, name: 'AUS Business School Programs',
      numberOfItems: programEntries.length,
      itemListElement: programEntries.map(([programRoute, item], index) => ({
        '@type': 'ListItem', position: index + 1, name: item.program.credential,
        url: `${site.baseUrl}${programRoute}`
      }))
    });
    webPage.mainEntity = { '@id': listId };
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

function seoBlock(route, meta, html) {
  const canonical = `${site.baseUrl}${route === '/' ? '/' : route}`;
  const image = extractPageImage(html);
  const robots = meta.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
  const jsonLd = JSON.stringify(structuredData(route, meta, html, image), null, 2).replace(/</g, '\\u003c');
  return `${seoStart}
<meta name="description" content="${escapeHtml(meta.description)}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${canonical}">
<link rel="preconnect" href="https://cdn.prod.website-files.com" crossorigin>
<meta name="theme-color" content="#111827">
<meta property="og:locale" content="en_CH">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${escapeHtml(meta.title)}">
<meta property="og:description" content="${escapeHtml(meta.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${escapeHtml(image)}">
<meta property="og:image:alt" content="${escapeHtml(`${site.name} in La Tour-de-Peilz, Switzerland`)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(meta.title)}">
<meta name="twitter:description" content="${escapeHtml(meta.description)}">
<meta name="twitter:image" content="${escapeHtml(image)}">
<script id="aus-structured-data" type="application/ld+json">
${jsonLd}
</script>
${seoEnd}`;
}

function cleanHead(head) {
  return head
    .replace(new RegExp(`${seoStart}[\\s\\S]*?${seoEnd}\\s*`, 'g'), '')
    .replace(/<meta\b[^>]*name="(?:description|robots|twitter:[^"]+)"[^>]*>\s*/gi, '')
    .replace(/<meta\b[^>]*property="og:[^"]+"[^>]*>\s*/gi, '')
    .replace(/<meta\b[^>]*name="theme-color"[^>]*>\s*/gi, '')
    .replace(/<link\b[^>]*rel="canonical"[^>]*>\s*/gi, '')
    .replace(/<link\b[^>]*href="https:\/\/cdn\.prod\.website-files\.com"[^>]*>\s*/gi, '')
    .replace(/<script\b[^>]*id="aus-structured-data"[^>]*>[\s\S]*?<\/script>\s*/gi, '');
}

function applyMetadata(only = []) {
  const wanted = new Set(only.map((value) => value.replace(/\\/g, '/')));
  let changed = 0;
  let processed = 0;
  for (const file of listHtml(root)) {
    const relative = path.relative(root, file).replace(/\\/g, '/');
    if (wanted.size && !wanted.has(relative)) continue;
    const route = routeForFile(file);
    if (!route) throw new Error(`No canonical route is configured for ${path.relative(root, file)}.`);
    const meta = pages[route];
    if (!meta) throw new Error(`No SEO metadata is configured for ${route}.`);
    const source = fs.readFileSync(file, 'utf8');
    const headMatch = source.match(/<head>([\s\S]*?)<\/head>/i);
    if (!headMatch) throw new Error(`${path.relative(root, file)} has no head element.`);
    let head = cleanHead(headMatch[1]);
    const titleTag = `<title>${escapeHtml(meta.title)}</title>`;
    if (/<title>[\s\S]*?<\/title>/i.test(head)) head = head.replace(/<title>[\s\S]*?<\/title>/i, titleTag);
    else head = `\n${titleTag}${head}`;
    head = head.replace(titleTag, `${titleTag}\n${seoBlock(route, meta, source)}`);
    let updated = source.replace(headMatch[0], `<head>${head}</head>`).replace(/<html\s+lang="[^"]*"/i, '<html lang="en-CH"');
    processed += 1;
    if (updated !== source) {
      fs.writeFileSync(file, updated, 'utf8');
      changed += 1;
    }
  }
  console.log(`Applied SEO metadata to ${processed} HTML files; changed ${changed}.`);
}

if (require.main === module) applyMetadata(process.argv.slice(2));

module.exports = { applyMetadata, routeForFile };
