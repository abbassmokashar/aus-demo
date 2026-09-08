// Copies homepage chrome into independent Webflow-ready pages. No runtime imports.
// Run with the bundled Playwright package available through NODE_PATH.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { chromium } = require('playwright');
const root = __dirname;
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = fs.readdirSync(root, {recursive:true}).filter(f => f.endsWith('.html') && !f.startsWith('history' + path.sep) && !f.startsWith('.chrome-backup' + path.sep) && !f.startsWith('dist' + path.sep) && f !== 'index.html');
function element(html, tag, marker) {
  const re = new RegExp('<' + tag + '\\b[^>]*' + marker + '[^>]*>', 'g');
  const start = re.exec(html);
  if (!start) throw Error('Missing element: ' + marker);
  const tags = new RegExp('</?' + tag + '\\b[^>]*>', 'g');
  tags.lastIndex = start.index;
  let depth = 0, m;
  while ((m = tags.exec(html))) {
    depth += m[0].startsWith('</') ? -1 : 1;
    if (!depth) return {start:start.index, end:tags.lastIndex, text:html.slice(start.index, tags.lastIndex)};
  }
  throw Error('Unclosed element ' + marker);
}
function repairUnclosedDivBefore(html, file, marker, endMarker) {
  const start = html.indexOf(marker);
  if (start < 0) return html;
  const end = html.indexOf(endMarker, start);
  if (end < 0) return html;
  const prefix = html.slice(start, end);
  const opens = (prefix.match(/<div\b/gi) || []).length;
  const closes = (prefix.match(/<\/div>/gi) || []).length;
  const missing = opens - closes;
  if (missing === 0) return html;
  if (missing !== 1) throw Error('Unexpected nesting before ' + endMarker + ' in ' + file);
  return html.slice(0, end) + '</div>\n' + html.slice(end);
}
function relative(text, file) {
  return text.replace(/\b(href|src)="([^"\s]+)"/g, (all, attr, url) => {
    if (/^(?:[a-z]+:|\/|#)/i.test(url)) return all;
    const split = url.search(/[?#]/);
    const target = split < 0 ? url : url.slice(0, split);
    const suffix = split < 0 ? '' : url.slice(split);
    return attr + '="' + path.relative(path.dirname(file), target).split(path.sep).join('/') + suffix + '"';
  });
}
const blocks = [['div','id="preloader"'],['nav','id="nav"'],['div','id="sidePanel"'],['footer','class="site-footer"']];
const jsStart = home.indexOf("  document.documentElement.classList.add('has-preloader');");
const jsEnd = home.indexOf('  // ---------- Programs: hover-reveal', jsStart);
const reduceMotionJS = "  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;\n";
const sharedJS = home.slice(jsStart, jsEnd);
const searchStart = home.indexOf('/* SITE SEARCH — INDEX:');
const searchEnd = home.indexOf('/* SEARCH HIGHLIGHT & SCROLL', searchStart);
const searchJS = home.slice(searchStart, searchEnd);
const chromePattern = /\.(?:aus-preloader[\w-]*|aus-nav[\w-]*|aus-wordmark|menu-toggle[\w-]*|side-panel[\w-]*|accordion-[\w-]+|panel-link|panel-section-title|site-footer|footer-[\w-]+|aus-search[\w-]*)\b/;
async function main() {
  const browser = await chromium.launch({channel:'msedge',headless:true});
  const page = await browser.newPage();
  const styles = [...home.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m=>m[1]).join('\n');
  await page.setContent('<style>' + styles + '</style>');
  const css = await page.evaluate(pattern => {
    const match = new RegExp(pattern);
    function pick(rules) {
      return [...rules].map(r => {
        if (r.selectorText) {
          const sels = r.selectorText.split(',').map(s=>s.trim()).filter(s=>match.test(s));
          if(sels.length) return sels.join(',')+'{'+r.style.cssText+'}';
          if (r.selectorText === '.wrap') return '.site-footer .wrap{'+r.style.cssText+'}';
          if (r.selectorText === '.hero-cta' || r.selectorText === '.hero-cta:hover') return ':where(.side-panel) '+r.selectorText+'{'+r.style.cssText+'}';
          return '';
        }
        if (r.type === CSSRule.KEYFRAMES_RULE) return /^(navIn|preloaderIn|preloaderBar)$/.test(r.name) ? r.cssText : '';
        if (r.cssRules) {const inner=pick(r.cssRules);return inner ? r.cssText.slice(0,r.cssText.indexOf('{')+1)+inner+'}' : '';}
        return '';
      }).filter(Boolean).join('\n');
    }
    const vars = [...document.styleSheets[0].cssRules].find(r=>r.selectorText===':root').style.cssText;
    return '.aus-nav,.aus-preloader,.side-panel,.site-footer{'+vars+'font-family:var(--font-display);text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;}\n'+pick(document.styleSheets[0].cssRules)+'\n.side-panel-foot .hero-cta{width:auto;text-align:start;}';
  }, chromePattern.source);
  await browser.close();
  const updates=[];
  for (const file of files) {
    let html=fs.readFileSync(path.join(root,file),'utf8');
    const original=html;
    html=repairUnclosedDivBefore(html,file,'<div class="aus-preloader" id="preloader">','<nav class="aus-nav" id="nav">');
    html=repairUnclosedDivBefore(html,file,'<div class="side-panel" id="sidePanel">','<main');
    html=html.replace(/<!-- Homepage chrome: kept inline for independent Webflow embeds\. -->\s*<style id="aus-shared-chrome">[\s\S]*?<\/style>\s*/g,'');
    for(const [tag,marker] of blocks) {
      let old;
      try { old=element(html,tag,marker); }
      catch (error) { throw Error(file + ': ' + error.message); }
      html=html.slice(0,old.start)+relative(element(home,tag,marker).text,file)+html.slice(old.end);
    }
    // Remove the old handlers, rather than attaching a second set of listeners.
    if(html.includes('/* NAV SCROLL */')) {
      const start=html.indexOf('/* PRELOADER */',html.indexOf('<script',html.indexOf('</footer>')));
      const end=html.indexOf('/* REVEAL */',start);
      if(start<0||end<0) throw Error('Unknown independent handlers: '+file);
      html=html.slice(0,start)+'(function(){\n'+reduceMotionJS+sharedJS+'})();\n'+html.slice(end);
    } else {
      let start=html.indexOf("document.documentElement.classList.add('has-preloader');");
      const reduceStart=html.lastIndexOf('var reduceMotion',start);
      if(reduceStart>=0 && start-reduceStart<600) start=reduceStart;
      const group=html.indexOf("document.querySelectorAll('.accordion-group-trigger').forEach",start);
      const end=html.indexOf('  });',html.indexOf('    });',group)+7)+6;
      if(start<0||group<0||end<group) throw Error('Unknown grouped handlers: '+file);
      html=html.slice(0,start)+reduceMotionJS+sharedJS+html.slice(end);
    }
    // Include identical header search behavior, with page-relative result URLs.
    const ss=html.indexOf('/* SITE SEARCH — INDEX:');
    let search=searchJS.replace(/url:"([^"]+)"/g,(_,url)=>'url:"'+path.relative(path.dirname(file),url).split(path.sep).join('/')+'"');
    if(ss>=0){const se=html.indexOf('})();',ss)+5;if(se<0)throw Error('Search boundary '+file);html=html.slice(0,ss)+search+html.slice(se);}
    else html=html.replace('</body>','<script>\n'+search+'\n</script>\n</body>');
    const styleBlock='<!-- Homepage chrome: kept inline for independent Webflow embeds. -->\n<style id="aus-shared-chrome">\n'+css+'\n</style>\n';
    if(html.includes('</head>')) html=html.replace('</head>',styleBlock+'</head>');
    else {const end=html.lastIndexOf('</style>')+8;html=html.slice(0,end)+'\n'+styleBlock+html.slice(end);}
    for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
      if(!/src=|application\/ld\+json/.test(m[1])) new vm.Script(m[2],{filename:file});
    }
    updates.push({file,html,original});
  }
  // Validate every page before writing any changes; retain originals for regression checks.
  const backup=path.join(root,'.chrome-backup');fs.mkdirSync(backup,{recursive:true});
  for(const {file,html,original} of updates){const dest=path.join(backup,file);fs.mkdirSync(path.dirname(dest),{recursive:true});if(!fs.existsSync(dest))fs.writeFileSync(dest,original);fs.writeFileSync(path.join(root,file),html);}
  console.log('Synchronized '+updates.length+' pages with index.html; inline scripts parse successfully.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});

