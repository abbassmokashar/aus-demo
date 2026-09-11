const fs = require('fs');
const path = require('path');
const { canonicalizeDocument } = require('./rewrite-webflow-urls');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'index.html');
const outputDir = path.join(root, 'webflow', 'homepage');
const hardLimit = 50000;
const targetLimit = 46000;

function normalize(text) {
  return text.replace(/\r\n?/g, '\n').trim();
}

function splitCss(css, maxLength) {
  const pieces = [];
  let start = 0;
  let depth = 0;
  let quote = '';
  let escaped = false;
  let inComment = false;

  for (let i = 0; i < css.length; i += 1) {
    const char = css[i];
    const next = css[i + 1];

    if (inComment) {
      if (char === '*' && next === '/') {
        inComment = false;
        i += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = '';
      continue;
    }
    if (char === '/' && next === '*') {
      inComment = true;
      i += 1;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === '{') depth += 1;
    else if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        pieces.push(css.slice(start, i + 1).trim());
        start = i + 1;
      }
    } else if (char === ';' && depth === 0) {
      pieces.push(css.slice(start, i + 1).trim());
      start = i + 1;
    }
  }

  if (css.slice(start).trim()) pieces.push(css.slice(start).trim());

  const chunks = [];
  let current = '';
  for (const piece of pieces) {
    if (piece.length > maxLength) {
      throw new Error(`A single CSS rule is too large (${piece.length} characters).`);
    }
    const candidate = current ? `${current}\n${piece}` : piece;
    if (candidate.length > maxLength && current) {
      chunks.push(current);
      current = piece;
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function splitTopLevelHtml(html) {
  const voidTags = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
    'meta', 'param', 'source', 'track', 'wbr'
  ]);
  const tokenPattern = /<!--[\s\S]*?-->|<![^>]*>|<\/?([a-z][\w:-]*)\b[^>]*>/gi;
  const nodes = [];
  let depth = 0;
  let nodeStart = -1;
  let match;

  while ((match = tokenPattern.exec(html))) {
    const token = match[0];
    if (token.startsWith('<!--') || token.startsWith('<!')) continue;
    const tag = match[1].toLowerCase();
    const closing = /^<\//.test(token);
    const selfClosing = /\/>$/.test(token) || voidTags.has(tag);

    if (!closing) {
      if (depth === 0) nodeStart = match.index;
      if (!selfClosing) depth += 1;
      else if (depth === 0 && nodeStart !== -1) {
        nodes.push(html.slice(nodeStart, tokenPattern.lastIndex).trim());
        nodeStart = -1;
      }
    } else {
      depth -= 1;
      if (depth < 0) throw new Error(`Unexpected closing </${tag}> in homepage body.`);
      if (depth === 0 && nodeStart !== -1) {
        nodes.push(html.slice(nodeStart, tokenPattern.lastIndex).trim());
        nodeStart = -1;
      }
    }
  }

  if (depth !== 0) throw new Error(`Homepage body has ${depth} unclosed top-level element(s).`);
  return nodes.filter(Boolean);
}

function combineCompleteBlocks(blocks, maxLength) {
  const chunks = [];
  let current = '';
  for (const block of blocks) {
    if (block.length > maxLength) {
      throw new Error(`A complete HTML block is too large (${block.length} characters).`);
    }
    const candidate = current ? `${current}\n\n${block}` : block;
    if (candidate.length > maxLength && current) {
      chunks.push(current);
      current = block;
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function findArrayEnd(source, arrayStart) {
  let depth = 0;
  let quote = '';
  let escaped = false;
  for (let i = arrayStart; i < source.length; i += 1) {
    const char = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = '';
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === '[') depth += 1;
    else if (char === ']') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  throw new Error('Could not find the end of a JavaScript array.');
}

function compactSearchKeys(item) {
  const source = String(item.keys || '').replace(/\s+/g, ' ').trim();
  const lead = source.slice(0, 150);
  const stop = new Set([
    'about', 'after', 'also', 'american', 'and', 'are', 'aus', 'built', 'can',
    'for', 'from', 'have', 'into', 'more', 'not', 'our', 'page', 'that', 'the',
    'their', 'this', 'through', 'to', 'university', 'what', 'when', 'where',
    'which', 'with', 'your'
  ]);
  const seen = new Set();
  const useful = [];
  const words = source.toLowerCase().match(/[a-z0-9][a-z0-9&+.-]{2,}/g) || [];
  for (const word of words) {
    if (stop.has(word) || seen.has(word)) continue;
    seen.add(word);
    useful.push(word);
    if (useful.join(' ').length >= 150) break;
  }
  return `${lead} ${useful.join(' ')}`.replace(/\s+/g, ' ').trim().slice(0, 320);
}

function wrapScript(code) {
  return `<script>\n${normalize(code)}\n</script>`;
}

function makeSearchScript(script) {
  const declaration = 'var idx=';
  const declarationStart = script.indexOf(declaration);
  if (declarationStart === -1) throw new Error('Search index declaration was not found.');
  const arrayStart = script.indexOf('[', declarationStart + declaration.length);
  const arrayEnd = findArrayEnd(script, arrayStart);
  const literal = script.slice(arrayStart, arrayEnd + 1);
  const index = vm.runInNewContext(`(${literal})`);
  const compact = index.filter(Boolean).map((item) => ({
    title: item.title,
    url: item.url,
    cat: item.cat,
    keys: compactSearchKeys(item)
  }));
  return script.slice(0, arrayStart) + JSON.stringify(compact) + script.slice(arrayEnd + 1);
}

function splitHomepageScripts(html) {
  const inlineScripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1]);
  const externalScripts = [...html.matchAll(/<script\b[^>]*\bsrc=[^>]*><\/script>/gi)]
    .map((match) => match[0]);

  const news = inlineScripts.find((script) => script.includes('newsOverlay'));
  const main = inlineScripts.find((script) => script.includes('SITE SEARCH'));
  const finder = inlineScripts.find((script) => script.includes('var questions=['));
  const cta = inlineScripts.find((script) => script.includes('function fitAll()'));
  if (!news || !main || !finder || !cta) throw new Error('One or more homepage scripts could not be identified.');

  const searchMarker = main.indexOf('/* SITE SEARCH');
  const highlightMarker = main.indexOf('/* SEARCH HIGHLIGHT');
  const compareMarker = main.indexOf('// ---------- COMPARE SPECIALIZATIONS');
  if (searchMarker < 0 || highlightMarker < 0 || compareMarker < 0) {
    throw new Error('Homepage script markers have changed.');
  }

  const mainUi = main.slice(0, searchMarker);
  const search = makeSearchScript(main.slice(searchMarker, highlightMarker));
  const highlightAndPromo = main.slice(highlightMarker, compareMarker);
  const compare = main.slice(compareMarker);

  const programDeclaration = 'var programData=';
  const programStart = finder.indexOf(programDeclaration);
  const programArrayStart = finder.indexOf('[', programStart + programDeclaration.length);
  const programArrayEnd = findArrayEnd(finder, programArrayStart);
  const programLiteral = finder.slice(programArrayStart, programArrayEnd + 1);
  const finderLogic = finder.slice(0, programStart)
    + 'var programData=window.AUS_FINDER_PROGRAMS||[];'
    + finder.slice(programArrayEnd + 2);
  const finderData = `window.AUS_FINDER_PROGRAMS=${programLiteral};`;

  const scripts = [
    wrapScript(news),
    externalScripts.join('\n'),
    wrapScript(mainUi),
    wrapScript(search),
    wrapScript(highlightAndPromo),
    wrapScript(compare),
    wrapScript(finderData),
    wrapScript(finderLogic),
    wrapScript(cta)
  ];
  return combineCompleteBlocks(scripts, targetLimit);
}

function build() {
  const html = normalize(canonicalizeDocument(fs.readFileSync(sourcePath, 'utf8'), sourcePath));
  const head = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1] || '';
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1];
  if (!body) throw new Error('Homepage body was not found.');

  const fontLinks = [...head.matchAll(/<link\b[^>]*(?:fonts\.googleapis|fonts\.gstatic)[^>]*>/gi)]
    .map((match) => match[0]);
  const css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)]
    .map((match) => match[1])
    .join('\n');
  const cssChunks = splitCss(css, targetLimit - 20)
    .map((chunk, index) => `${index === 0 ? `${fontLinks.join('\n')}\n` : ''}<style>\n${chunk}\n</style>`);

  const markupOnly = body
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const nodes = splitTopLevelHtml(markupOnly);
  const preloaderIndex = nodes.findIndex((node) => /id=["']preloader["']/.test(node));
  if (preloaderIndex === -1) throw new Error('Preloader markup was not found.');
  nodes[preloaderIndex] += `\n<script>\n(function(){\n  var root=document.documentElement;\n  var preloader=document.getElementById('preloader');\n  root.classList.add('has-preloader');\n  function releasePreloader(){\n    root.classList.remove('has-preloader');\n    if(!preloader)return;\n    preloader.classList.add('is-hidden');\n    setTimeout(function(){if(preloader&&preloader.parentNode)preloader.parentNode.removeChild(preloader);},700);\n  }\n  if(document.readyState==='loading'){\n    document.addEventListener('DOMContentLoaded',function(){setTimeout(releasePreloader,700);},{once:true});\n  }else{setTimeout(releasePreloader,700);}\n  window.addEventListener('load',releasePreloader,{once:true});\n  setTimeout(releasePreloader,5000);\n})();\n</script>`;
  const markupChunks = combineCompleteBlocks(nodes, targetLimit);
  const scriptChunks = splitHomepageScripts(html);

  fs.mkdirSync(outputDir, { recursive: true });
  for (const name of fs.readdirSync(outputDir)) {
    if (/^(\d{2}-.*\.html|README\.md)$/.test(name)) fs.rmSync(path.join(outputDir, name));
  }

  const files = [];
  let sequence = 1;
  function writeChunk(kind, content) {
    const name = `${String(sequence).padStart(2, '0')}-${kind}.html`;
    const normalized = normalize(content) + '\n';
    if (normalized.length >= hardLimit) {
      throw new Error(`${name} is ${normalized.length} characters, over the ${hardLimit} limit.`);
    }
    fs.writeFileSync(path.join(outputDir, name), normalized, 'utf8');
    files.push({ name, characters: normalized.length });
    sequence += 1;
  }

  cssChunks.forEach((chunk) => writeChunk('styles', chunk));
  markupChunks.forEach((chunk) => writeChunk('markup', chunk));
  scriptChunks.forEach((chunk) => writeChunk('scripts', chunk));

  const table = files.map((file) => `| ${file.name} | ${file.characters.toLocaleString('en-US')} |`).join('\n');
  const readme = `# AUS homepage — Webflow Code Embed package\n\nReplace the old homepage Code Embed widgets with these files, then paste them into separate widgets in ascending numerical order. Do not keep the old chunks underneath the new ones, merge adjacent files, or split any file internally. Every widget is self-contained and below Webflow's 50,000-character limit.\n\nBefore publishing, remove the old Webflow page scripts that mention \`ScrollSmoother\`, \`.hero_img-wrapper\`, \`.hero_heading .char\`, or \`Modal elements not found\`. Those selectors and the licensed ScrollSmoother plugin do not belong to this homepage package. Leaving those old scripts on the page can continue to produce console errors even though the embeds below are valid.\n\nThe first markup widget includes a standalone preloader release. It dismisses on page readiness and also has a five-second safety release, so a later optional feature cannot trap the page behind the preloader.\n\n| File | Characters |\n| --- | ---: |\n${table}\n`;
  fs.writeFileSync(path.join(outputDir, 'README.md'), readme, 'utf8');

  console.log(`Built ${files.length} Webflow widgets in ${path.relative(root, outputDir)}.`);
  files.forEach((file) => console.log(`${file.name}: ${file.characters}`));
}

module.exports = {
  compactSearchKeys,
  combineCompleteBlocks,
  findArrayEnd,
  hardLimit,
  makeSearchScript,
  normalize,
  splitCss,
  splitTopLevelHtml,
  targetLimit,
  wrapScript
};

if (require.main === module) build();
