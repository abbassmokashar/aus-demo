const fs = require('fs');
const path = require('path');
const { destinations } = require('./rewrite-webflow-urls');

const root = path.resolve(__dirname, '..');
const skipped = new Set(['.chrome-backup', '.git', '.visual-check', 'history', 'node_modules', 'webflow']);
const sourceByRoute = new Map(Object.entries(destinations).map(([source, route]) => [route, source]));
const repositoryTargetByRoute = new Map(
  [...sourceByRoute].map(([route, source]) => [
    route,
    source.startsWith('programs/') ? `${route.replace(/^\//, '')}/index.html` : source
  ])
);
const routeByRepositoryPath = new Map(
  [...repositoryTargetByRoute]
    .filter(([, target]) => target.endsWith('/index.html'))
    .map(([route, target]) => [target.replace(/\/index\.html$/, ''), route])
);

function listHtml(directory, output = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && skipped.has(entry.name)) continue;
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

function repositoryUrl(value, currentFile) {
  if (!value || /^(?:https?:|mailto:|tel:|javascript:|#|\/\/)/i.test(value)) return value;
  const match = value.match(/^([^?#]*)([?#][\s\S]*)?$/);
  if (!match) return value;
  const pathname = match[1] || '/';
  const currentDirectory = path.posix.dirname(sourceRelative(currentFile));
  let route;

  if (/^\/(?!\/)/.test(pathname)) {
    const cleanRoute = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
    if (sourceByRoute.has(cleanRoute)) route = cleanRoute;
  } else if (/\.html$/i.test(pathname)) {
    const resolved = path.posix.normalize(path.posix.join(currentDirectory, pathname));
    if (destinations[resolved]) route = destinations[resolved];
    else {
      const rootRelative = path.posix.normalize(pathname).replace(/^\.\//, '');
      if (destinations[rootRelative]) route = destinations[rootRelative];
    }
  } else {
    const resolved = path.posix.normalize(path.posix.join(currentDirectory, pathname)).replace(/\/+$/, '');
    route = routeByRepositoryPath.get(resolved);
  }

  const target = repositoryTargetByRoute.get(route);
  if (!target) return value;
  let relative = path.posix.relative(currentDirectory, target) || path.posix.basename(target);
  if (target.endsWith('/index.html')) relative = relative.replace(/index\.html$/, '') || './';
  return relative + (match[2] || '');
}

function rewriteDocument(source, file) {
  return source
    .replace(/(href|action)=(['"])([^'"]+)\2/g, (whole, attribute, quote, value) => `${attribute}=${quote}${repositoryUrl(value, file)}${quote}`)
    .replace(/\b(url|href):(['"])([^'"]+)\2/g, (whole, attribute, quote, value) => `${attribute}:${quote}${repositoryUrl(value, file)}${quote}`)
    .replace(/((?:window\.)?location(?:\.href)?\s*=\s*)(['"])([^'"]+)\2/g, (whole, prefix, quote, value) => `${prefix}${quote}${repositoryUrl(value, file)}${quote}`);
}

function rewriteAll() {
  let changedFiles = 0;
  for (const file of listHtml(root)) {
    const source = fs.readFileSync(file, 'utf8');
    const rewritten = rewriteDocument(source, file);
    if (rewritten !== source) {
      fs.writeFileSync(file, rewritten, 'utf8');
      changedFiles += 1;
    }
  }
  console.log(`Rewrote repository-safe URLs in ${changedFiles} HTML files.`);
}

module.exports = {
  listHtml,
  repositoryTargetByRoute,
  repositoryUrl,
  rewriteDocument,
  routeByRepositoryPath,
  sourceRelative
};

if (require.main === module) rewriteAll();
