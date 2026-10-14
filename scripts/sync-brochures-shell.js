const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'brochures.html');
const shellPath = path.join(root, 'contact-us.html');

let html = fs.readFileSync(sourcePath, 'utf8');
const shell = fs.readFileSync(shellPath, 'utf8');

function between(source, start, end) {
  const from = source.indexOf(start);
  const to = source.indexOf(end, from + start.length);
  if (from < 0 || to < 0) throw new Error(`Could not find shared shell boundary: ${start}`);
  return source.slice(from, to + end.length);
}

const chromeStyle = between(shell, '<style id="aus-shared-chrome">', '</style>');
const mobileWidthStyle = between(shell, '<style id="mobile-header-width-fix">', '</style>');
const mobileActionStyle = between(shell, '<style id="mobile-header-action-fix">', '</style>');
const footerInlineStyle = between(shell, '<style id="footer-recognition-inline">', '</style>');
const searchPositionStyle = between(shell, '<style id="aus-search-drop-mobile-position">', '</style>');
const brochureShellStyle = `<style id="brochure-shared-shell-fixes">
:where(.aus-nav button,.side-panel button){border:0;background:none;color:inherit;cursor:pointer;padding:0}
.aus-nav-talk{font-family:inherit;cursor:pointer;appearance:none;-webkit-appearance:none;background:transparent;color:inherit}
.footer-social-title{margin-top:24px;margin-bottom:0}.footer-social-grid{display:flex;flex-wrap:wrap;gap:9px;margin-top:11px}.footer-social-grid a{padding:0}
.footer-contact-heading{margin:26px 0 9px}.footer-contact-details{display:flex;flex-direction:column;gap:8px;margin-top:0;font-style:normal;font-size:13.5px;line-height:1.55;color:rgba(34,41,95,.75)}
.footer-contact-item{display:flex!important;align-items:flex-start;gap:8px;color:inherit}.footer-contact-item svg{width:16px;height:16px;flex:0 0 16px;margin-top:2px;color:var(--crimson)}.footer-contact-item>span{display:block;min-width:0}.footer-contact-details a{font-weight:650}.footer-contact-details a:hover{color:var(--crimson)}
</style>`;
const sharedStyles = [chromeStyle, mobileWidthStyle, mobileActionStyle, footerInlineStyle, searchPositionStyle, brochureShellStyle].join('\n');

if (html.includes('<style id="aus-shared-chrome">')) {
  const start = html.indexOf('<style id="aus-shared-chrome">');
  const end = html.indexOf('<style id="brochure-shared-shell-fixes">', start);
  const endClose = html.indexOf('</style>', end) + '</style>'.length;
  html = html.slice(0, start) + sharedStyles + html.slice(endClose);
} else {
  html = html.replace('</head>', `${sharedStyles}\n</head>`);
}

const navStart = shell.indexOf('<nav class="aus-nav" id="nav">');
const navEnd = shell.indexOf('<!-- CONTACT PAGE -->', navStart);
if (navStart < 0 || navEnd < 0) throw new Error('Could not extract shared header and off-canvas menu.');
const navMarkup = shell.slice(navStart, navEnd).trim();

const oldHeaderStart = html.indexOf('<header class="site-header">');
const currentNavStart = html.indexOf('<nav class="aus-nav" id="nav">');
const headerStart = oldHeaderStart >= 0 ? oldHeaderStart : currentNavStart;
const pageMainStart = html.indexOf('<main>', headerStart);
if (headerStart < 0 || pageMainStart < 0) throw new Error('Could not locate brochure header.');
html = html.slice(0, headerStart) + navMarkup + '\n  ' + html.slice(pageMainStart);

const sharedFooter = between(shell, '<footer class="site-footer">', '</footer>');
const footerStart = html.indexOf('<footer class="site-footer">');
const footerEnd = html.indexOf('</footer>', footerStart) + '</footer>'.length;
if (footerStart < 0 || footerEnd < '</footer>'.length) throw new Error('Could not locate brochure footer.');
html = html.slice(0, footerStart) + sharedFooter + html.slice(footerEnd);

const oldMenuScript = /\s*document\.getElementById\('menuButton'\)[\s\S]*?document\.getElementById\('menuButton'\)\.setAttribute\('aria-expanded','false'\);\}\);/;
const sharedMenuScript = `
      var nav=document.getElementById('nav');
      var menuToggle=document.getElementById('menuToggle');
      var sidePanel=document.getElementById('sidePanel');
      var sidePanelClose=document.getElementById('sidePanelClose');
      var sidePanelBackdrop=document.getElementById('sidePanelBackdrop');
      var sidePanelNav=document.querySelector('.side-panel-nav');
      var accordionItems=document.querySelectorAll('.accordion-item');
      var reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      function onScrollNav(){if(nav) nav.classList.toggle('is-scrolled',window.scrollY>40);}
      window.addEventListener('scroll',onScrollNav,{passive:true});onScrollNav();
      function setAccordion(key,open){accordionItems.forEach(function(item){if(item.getAttribute('data-panel-key')===key)item.classList.toggle('is-open',open===undefined?!item.classList.contains('is-open'):open);});}
      function openPanel(expandKey){document.documentElement.classList.add('panel-open');menuToggle.setAttribute('aria-expanded','true');if(expandKey){setAccordion(expandKey,true);var target=document.querySelector('.accordion-item[data-panel-key="'+expandKey+'"]');if(target&&sidePanelNav)window.setTimeout(function(){target.scrollIntoView({block:'start',behavior:reduceMotion?'auto':'smooth'});},60);}}
      function closePanel(){document.documentElement.classList.remove('panel-open');menuToggle.setAttribute('aria-expanded','false');}
      menuToggle.addEventListener('click',function(){openPanel();});sidePanelClose.addEventListener('click',closePanel);sidePanelBackdrop.addEventListener('click',closePanel);
      document.addEventListener('keydown',function(event){if(event.key==='Escape')closePanel();});
      document.querySelectorAll('[data-open-panel]').forEach(function(button){button.addEventListener('click',function(){openPanel(button.getAttribute('data-open-panel'));});});
      accordionItems.forEach(function(item){var trigger=item.querySelector('.accordion-trigger');if(trigger)trigger.addEventListener('click',function(){item.classList.toggle('is-open');});});`;
if (oldMenuScript.test(html)) {
  html = html.replace(oldMenuScript, sharedMenuScript);
}

const searchStart = shell.indexOf('/* SITE SEARCH — INDEX: add new pages here to appear in dropdown */');
const searchEnd = shell.indexOf('/* SEARCH HIGHLIGHT & SCROLL', searchStart);
if (searchStart < 0 || searchEnd < 0) throw new Error('Could not extract the shared search behavior.');
const searchScript = shell.slice(searchStart, searchEnd).trim();
const sharedSearchMarkup = `<script id="brochure-shared-search">\n${searchScript}\n</script>`;
if (html.includes('id="brochure-shared-search"')) {
  html = html.replace(/<script id="brochure-shared-search">[\s\S]*?<\/script>/, function(){ return sharedSearchMarkup; });
} else {
  html = html.replace('</body>', function(){ return `${sharedSearchMarkup}\n</body>`; });
}

fs.writeFileSync(sourcePath, html, 'utf8');
console.log('Synced brochures.html with the current shared AUS header, menu, footer and search.');
