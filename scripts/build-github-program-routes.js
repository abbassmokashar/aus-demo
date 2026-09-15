const fs = require('fs');
const path = require('path');
const { canonicalizeDocument, destinations } = require('./rewrite-webflow-urls');
const { repositoryTargetByRoute, rewriteDocument } = require('./rewrite-github-urls');
const { programImageUrls } = require('./program-image-urls');

const root = path.resolve(__dirname, '..');
const programPages = Object.entries(destinations).filter(([source]) => source.startsWith('programs/'));

function writeFileWithRetry(file, contents) {
  let lastError;
  for (let attempt = 0; attempt < 12; attempt += 1) {
    try {
      fs.writeFileSync(file, contents, 'utf8');
      return;
    } catch (error) {
      lastError = error;
      if (!['UNKNOWN', 'EBUSY', 'EPERM'].includes(error.code)) throw error;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
    }
  }
  throw lastError;
}

function rerouteProgramMedia(html, targetPath) {
  return html.replace(/src=(['"])[^'"]*program-media\/([^'"]+)\1/g, (whole, quote, name) => {
    if (programImageUrls[name]) return `src=${quote}${programImageUrls[name]}${quote}`;
    const asset = path.join(root, 'program-media', ...name.split('/'));
    const relative = path.relative(path.dirname(targetPath), asset).replace(/\\/g, '/');
    return `src=${quote}${relative}${quote}`;
  });
}

let built = 0;
for (const [source, route] of programPages) {
  const sourcePath = path.join(root, source);
  const target = repositoryTargetByRoute.get(route);
  if (!target || !target.endsWith('/index.html')) throw new Error(`No clean GitHub route for ${source}.`);
  const webflowRouted = canonicalizeDocument(fs.readFileSync(sourcePath, 'utf8'), sourcePath);
  for (const prefix of ['', 'dist']) {
    const targetPath = path.join(root, prefix, ...target.split('/'));
    const repositoryRouted = rerouteProgramMedia(rewriteDocument(webflowRouted, targetPath), targetPath);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    writeFileWithRetry(targetPath, repositoryRouted);
    built += 1;
  }
}

console.log(`Built ${built} clean GitHub Pages program files across the source and dist trees.`);
