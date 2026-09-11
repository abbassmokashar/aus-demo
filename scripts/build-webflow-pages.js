const fs = require('fs');
const path = require('path');
const {
  combineCompleteBlocks,
  findArrayEnd,
  hardLimit,
  makeSearchScript,
  normalize,
  splitCss,
  splitTopLevelHtml,
  targetLimit,
  wrapScript
} = require('./build-webflow-homepage');
const { canonicalizeDocument } = require('./rewrite-webflow-urls');

const root = path.resolve(__dirname, '..');
const outputRoot = path.join(root, 'webflow', 'pages');
const skippedDirectories = new Set([
  '.chrome-backup', '.git', '.visual-check', 'dist', 'history', 'node_modules', 'webflow'
]);

function listSourcePages(directory, pages = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && skippedDirectories.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) listSourcePages(fullPath, pages);
    else if (entry.name.endsWith('.html') && entry.name !== 'index.html') pages.push(fullPath);
  }
  return pages.sort();
}

function fontLinksFromHead(head) {
  return [...head.matchAll(/<link\b[^>]*(?:fonts\.googleapis|fonts\.gstatic)[^>]*>/gi)]
    .map((match) => match[0]);
}

function makePreloaderRelease() {
  return `<script>
(function(){
  var root=document.documentElement;
  var preloader=document.getElementById('preloader');
  root.classList.add('has-preloader');
  function releasePreloader(){
    root.classList.remove('has-preloader');
    if(!preloader)return;
    preloader.classList.add('is-hidden');
    setTimeout(function(){if(preloader&&preloader.parentNode)preloader.parentNode.removeChild(preloader);},700);
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',function(){setTimeout(releasePreloader,700);},{once:true});
  }else{setTimeout(releasePreloader,700);}
  window.addEventListener('load',releasePreloader,{once:true});
  setTimeout(releasePreloader,5000);
})();
</script>`;
}

function replaceStyle(tag, style) {
  if (/\sstyle=(['"])[\s\S]*?\1/i.test(tag)) {
    return tag.replace(/\sstyle=(['"])[\s\S]*?\1/i, ` style="${style}"`);
  }
  return tag.replace(/>$/, ` style="${style}">`);
}

function splitLargeFaqSection(node) {
  const outerOpen = node.match(/^<section\b[^>]*>/i)?.[0];
  const outerClose = '</section>';
  if (!outerOpen || !node.endsWith(outerClose)) return null;
  const outerInner = node.slice(outerOpen.length, -outerClose.length).trim();
  const outerChildren = splitTopLevelHtml(outerInner);
  if (outerChildren.length !== 1 || !/^<div\b[^>]*class=["'][^"']*\bwrap\b/i.test(outerChildren[0])) return null;

  const wrapNode = outerChildren[0];
  const wrapOpen = wrapNode.match(/^<div\b[^>]*>/i)?.[0];
  const wrapClose = '</div>';
  if (!wrapOpen || !wrapNode.endsWith(wrapClose)) return null;
  const wrapInner = wrapNode.slice(wrapOpen.length, -wrapClose.length).trim();
  const faqGroups = splitTopLevelHtml(wrapInner);
  const overhead = outerOpen.length + outerClose.length + wrapOpen.length + wrapClose.length + 20;
  const groups = combineCompleteBlocks(faqGroups, targetLimit - overhead);

  return groups.map((group, index) => {
    const sectionOpen = index === groups.length - 1 ? outerOpen : replaceStyle(outerOpen, 'padding:0;');
    return `${sectionOpen}\n${wrapOpen}\n${group}\n${wrapClose}\n${outerClose}`;
  });
}

function splitMarkupNodes(nodes, sourceRelative) {
  const expanded = [];
  for (const node of nodes) {
    if (node.length <= targetLimit) {
      expanded.push(node);
      continue;
    }
    if (sourceRelative.replace(/\\/g, '/') === 'faq.html') {
      const faqParts = splitLargeFaqSection(node);
      if (faqParts) {
        expanded.push(...faqParts);
        continue;
      }
    }
    throw new Error(`${sourceRelative} has an indivisible markup block of ${node.length} characters.`);
  }
  return combineCompleteBlocks(expanded, targetLimit);
}

function splitFinderData(code) {
  const declaration = 'var programData=';
  const declarationStart = code.indexOf(declaration);
  if (declarationStart === -1) return null;
  const arrayStart = code.indexOf('[', declarationStart + declaration.length);
  const arrayEnd = findArrayEnd(code, arrayStart);
  const afterArray = code[arrayEnd + 1] === ';' ? arrayEnd + 2 : arrayEnd + 1;
  const literal = code.slice(arrayStart, arrayEnd + 1);
  const logic = code.slice(0, declarationStart)
    + 'var programData=window.AUS_FINDER_PROGRAMS||[];'
    + code.slice(afterArray);
  return [
    `window.AUS_FINDER_PROGRAMS=${literal};`,
    logic
  ];
}

function splitKnownScriptSections(code) {
  const markers = [
    '/* SEARCH HIGHLIGHT',
    '// ---------- PROMO POPUP',
    '/* ---------- PROMO POPUP',
    '// ---------- COMPARE SPECIALIZATIONS',
    '/* COMPARE SPECIALIZATIONS'
  ];
  const positions = markers
    .map((marker) => code.indexOf(marker))
    .filter((position) => position > 0)
    .sort((a, b) => a - b)
    .filter((position, index, list) => index === 0 || position !== list[index - 1]);
  if (!positions.length) return [code];
  const sections = [];
  let start = 0;
  for (const position of positions) {
    sections.push(code.slice(start, position));
    start = position;
  }
  sections.push(code.slice(start));
  return sections.filter((section) => section.trim());
}

function transformInlineScript(code, sourceRelative) {
  let transformed = code;
  const parts = [];

  if (transformed.includes('var idx=')) {
    transformed = makeSearchScript(transformed);
    const marker = transformed.indexOf('/* SITE SEARCH');
    if (marker > 0) {
      parts.push(transformed.slice(0, marker));
      transformed = transformed.slice(marker);
    }
  }

  parts.push(...splitKnownScriptSections(transformed));
  const expanded = [];
  for (const part of parts.filter((item) => item.trim())) {
    if (wrapScript(part).length <= targetLimit) {
      expanded.push(part);
      continue;
    }
    const finderParts = splitFinderData(part);
    if (finderParts && finderParts.every((item) => wrapScript(item).length <= targetLimit)) {
      expanded.push(...finderParts);
      continue;
    }
    throw new Error(`${sourceRelative} has an inline script of ${part.length} characters that cannot be split safely.`);
  }
  return expanded.map(wrapScript);
}

function orderedScriptBlocks(html, sourceRelative) {
  const blocks = [];
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc\s*=/i.test(match[1])) blocks.push(match[0]);
    else blocks.push(...transformInlineScript(match[2], sourceRelative));
  }
  return combineCompleteBlocks(blocks, targetLimit);
}

function outputDirectoryFor(sourceRelative) {
  const withoutExtension = sourceRelative.replace(/\.html$/i, '');
  return path.join(outputRoot, ...withoutExtension.split(/[\\/]/));
}

function clearGeneratedPageFiles(directory) {
  fs.mkdirSync(directory, { recursive: true });
  for (const name of fs.readdirSync(directory)) {
    const candidate = path.join(directory, name);
    if (fs.statSync(candidate).isFile() && /^(\d{2}-.*\.html|README\.md)$/.test(name)) {
      fs.rmSync(candidate);
    }
  }
}

function buildPage(sourcePath) {
  const sourceRelative = path.relative(root, sourcePath);
  const html = normalize(canonicalizeDocument(fs.readFileSync(sourcePath, 'utf8'), sourcePath));
  const head = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1] || '';
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1];
  if (!body) throw new Error(`${sourceRelative} has no body element.`);

  const css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)]
    .map((match) => match[1])
    .join('\n');
  const links = fontLinksFromHead(head);
  const cssChunks = splitCss(css, targetLimit - 20).map((chunk, index) => {
    const linkMarkup = index === 0 && links.length ? `${links.join('\n')}\n` : '';
    return `${linkMarkup}<style>\n${chunk}\n</style>`;
  });

  const markupOnly = body
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const nodes = splitTopLevelHtml(markupOnly);
  const preloaderIndex = nodes.findIndex((node) => /id=["']preloader["']/.test(node));
  if (preloaderIndex !== -1) nodes[preloaderIndex] += `\n${makePreloaderRelease()}`;
  const markupChunks = splitMarkupNodes(nodes, sourceRelative);
  const scriptChunks = orderedScriptBlocks(html, sourceRelative);

  const outputDirectory = outputDirectoryFor(sourceRelative);
  clearGeneratedPageFiles(outputDirectory);
  const files = [];
  let sequence = 1;
  function writeChunk(kind, content) {
    const name = `${String(sequence).padStart(2, '0')}-${kind}.html`;
    const normalized = normalize(content) + '\n';
    if (normalized.length >= hardLimit) {
      throw new Error(`${sourceRelative}: ${name} is ${normalized.length} characters.`);
    }
    fs.writeFileSync(path.join(outputDirectory, name), normalized, 'utf8');
    files.push({ name, characters: normalized.length });
    sequence += 1;
  }

  cssChunks.forEach((chunk) => writeChunk('styles', chunk));
  markupChunks.forEach((chunk) => writeChunk('markup', chunk));
  scriptChunks.forEach((chunk) => writeChunk('scripts', chunk));

  const table = files.map((file) => `| ${file.name} | ${file.characters.toLocaleString('en-US')} |`).join('\n');
  const readme = `# ${sourceRelative.replace(/\\/g, '/')} — Webflow Code Embed package\n\nReplace any earlier embeds for this page, then paste the numbered files into separate Webflow Code Embed widgets in ascending order. Do not split a file, merge adjacent files, or keep an older copy of the same code on the page.\n\nEach widget is self-contained and below Webflow's 50,000-character limit. The first markup widget also contains the independent preloader safety release when this page has a preloader.\n\n| File | Characters |\n| --- | ---: |\n${table}\n`;
  fs.writeFileSync(path.join(outputDirectory, 'README.md'), readme, 'utf8');
  return { sourceRelative: sourceRelative.replace(/\\/g, '/'), outputDirectory, files };
}

function buildAllPages() {
  const pages = listSourcePages(root);
  fs.mkdirSync(outputRoot, { recursive: true });
  const results = pages.map(buildPage);
  const rows = results.map((result) => {
    const relativeReadme = path.relative(outputRoot, path.join(result.outputDirectory, 'README.md')).replace(/\\/g, '/');
    return `| ${result.sourceRelative} | ${result.files.length} | [Paste order](${relativeReadme}) |`;
  }).join('\n');
  const readme = `# AUS Webflow page packages\n\nEach source page below has been divided into numbered, self-contained Code Embed widgets under 50,000 characters. Open its paste-order file and add the widgets to Webflow in ascending numerical order. The homepage remains in \`../homepage\`.\n\n| Source page | Widgets | Instructions |\n| --- | ---: | --- |\n${rows}\n`;
  fs.writeFileSync(path.join(outputRoot, 'README.md'), readme, 'utf8');
  console.log(`Built ${results.length} non-homepage Webflow page packages.`);
  console.log(`Created ${results.reduce((sum, result) => sum + result.files.length, 0)} Code Embed widgets.`);
}

buildAllPages();
