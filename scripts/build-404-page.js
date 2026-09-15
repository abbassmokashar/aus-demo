const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const templatePath = path.join(root, 'about.html');
const sourceTarget = path.join(root, '404.html');
const distTarget = path.join(root, 'dist', '404.html');

const pageStyles = `
<style id="aus-404-page">
.error-page-body{background:#f1f1ef;}
.error-page-body .archive-tab{display:none!important;}
.error-page{position:relative;min-height:100svh;display:flex;align-items:center;padding:clamp(118px,12vw,164px) 0 clamp(64px,8vw,104px);overflow:hidden;background:linear-gradient(to bottom,var(--night) 0 96px,#f1f1ef 96px);}
.error-page::before{content:"";position:absolute;width:min(48vw,680px);aspect-ratio:1;border-radius:50%;top:-22%;right:-13%;border:1px solid rgba(190,31,61,.14);box-shadow:0 0 0 70px rgba(190,31,61,.035),0 0 0 140px rgba(190,31,61,.025);pointer-events:none;}
.error-grid{position:relative;z-index:1;display:grid;grid-template-columns:minmax(0,1fr) minmax(420px,.9fr);align-items:center;gap:clamp(48px,8vw,112px);}
.error-eyebrow{display:inline-flex;align-items:center;gap:10px;margin-bottom:22px;color:var(--crimson);font-size:12px;font-weight:750;letter-spacing:.14em;text-transform:uppercase;}
.error-eyebrow::before{content:"";width:30px;height:1px;background:currentColor;}
.error-copy h1{max-width:760px;color:var(--navy);font-family:var(--font-display);font-size:clamp(48px,6.4vw,88px);font-weight:800;letter-spacing:-.055em;line-height:.96;}
.error-copy h1 em{font-family:var(--font-serif);font-weight:500;letter-spacing:-.03em;color:var(--crimson);}
.error-copy>p{max-width:620px;margin-top:24px;color:var(--ink-soft);font-size:clamp(15px,1.35vw,18px);line-height:1.72;}
.error-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:32px;}
.error-btn{min-height:48px;display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:13px 22px;border:1px solid var(--navy);border-radius:100px;color:var(--navy);font-size:14px;font-weight:700;transition:transform .25s var(--ease),background .25s var(--ease),color .25s var(--ease),box-shadow .25s var(--ease);}
.error-btn:hover{transform:translateY(-2px);background:var(--navy);color:var(--white);box-shadow:0 12px 28px rgba(34,41,95,.16);}
.error-btn.primary{background:var(--crimson);border-color:var(--crimson);color:var(--white);box-shadow:0 10px 26px rgba(190,31,61,.22);}
.error-btn.primary:hover{background:#a91935;border-color:#a91935;box-shadow:0 14px 32px rgba(190,31,61,.3);}
.error-links{display:flex;align-items:center;gap:10px 18px;flex-wrap:wrap;margin-top:30px;padding-top:24px;border-top:1px solid rgba(34,41,95,.12);}
.error-links span{color:var(--ink-soft);font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;}
.error-links a{position:relative;color:var(--navy);font-size:13px;font-weight:650;}
.error-links a::after{content:"";position:absolute;left:0;right:100%;bottom:-4px;height:1px;background:var(--crimson);transition:right .25s var(--ease);}
.error-links a:hover::after{right:0;}
.error-visual{position:relative;min-height:clamp(390px,42vw,570px);display:flex;align-items:center;justify-content:center;}
.error-number{position:absolute;inset:auto 0;top:50%;transform:translateY(-57%);color:transparent;-webkit-text-stroke:1px rgba(34,41,95,.16);font-family:var(--font-display);font-size:clamp(150px,21vw,310px);font-weight:800;letter-spacing:-.09em;line-height:.8;text-align:center;user-select:none;}
.error-card{position:relative;width:min(82%,420px);aspect-ratio:.82;border-radius:22px;overflow:hidden;background:var(--white);box-shadow:0 32px 80px rgba(34,41,95,.18);transform:rotate(3deg);}
.error-card img{width:100%;height:100%;object-fit:cover;}
.error-card::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(17,24,39,.76),rgba(17,24,39,.04) 62%);}
.error-card-note{position:absolute;z-index:2;left:24px;right:24px;bottom:22px;color:var(--white);}
.error-card-note strong{display:block;font-size:16px;font-weight:700;}
.error-card-note span{display:block;margin-top:5px;color:rgba(255,255,255,.72);font-size:12px;line-height:1.5;}
.error-marker{position:absolute;z-index:3;top:10%;right:3%;width:92px;height:92px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--crimson);color:var(--white);font-family:var(--font-display);font-size:17px;font-weight:800;box-shadow:0 16px 34px rgba(190,31,61,.28);transform:rotate(8deg);}
@media(max-width:1050px){
  .error-grid{grid-template-columns:minmax(0,1fr) minmax(330px,.8fr);gap:42px;}
  .error-page-body .aus-nav-links{display:none;}
}
@media(max-width:760px){
  .error-page{min-height:auto;padding:98px 0 58px;background:linear-gradient(to bottom,var(--night) 0 62px,#f1f1ef 62px);}
  .error-page::before{width:520px;top:-180px;right:-330px;}
  .error-grid{grid-template-columns:1fr;gap:34px;}
  .error-copy h1{font-size:clamp(43px,14vw,62px);}
  .error-copy>p{font-size:15px;margin-top:18px;}
  .error-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:26px;}
  .error-btn{min-width:0;padding:11px 12px;font-size:12px;}
  .error-links{margin-top:24px;padding-top:20px;gap:10px 16px;}
  .error-links span{width:100%;}
  .error-visual{min-height:330px;}
  .error-number{font-size:clamp(150px,55vw,240px);}
  .error-card{width:min(72vw,310px);}
  .error-marker{width:72px;height:72px;right:7%;font-size:14px;}
}
@media(max-width:390px){
  .error-actions{grid-template-columns:1fr;}
}
</style>`;

const pageMarkup = `<!-- 404 PAGE -->
<main class="error-page" data-chapter="01" data-chapter-label="Page Not Found">
  <div class="wrap error-grid">
    <div class="error-copy reveal">
      <span class="error-eyebrow">Error 404 · Page not found</span>
      <h1>This page took a <em>wrong turn.</em></h1>
      <p>The address may have changed, or the page may no longer be available. Let’s get you back to the part of AUS you were looking for.</p>
      <div class="error-actions">
        <a class="error-btn primary" href="index.html">Back to Homepage <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
        <a class="error-btn" href="find-programs.html">Find Your Program</a>
      </div>
      <div class="error-links" aria-label="Helpful links">
        <span>Popular pages</span>
        <a href="programs.html">Programs</a>
        <a href="admissions.html">Admissions</a>
        <a href="student-life.html">Student Life</a>
        <a href="https://share-eu1.hsforms.com/11syZtqHyQeS44OepgqCVtQfwv24">Contact Us</a>
      </div>
    </div>
    <div class="error-visual reveal-scale" aria-hidden="true">
      <div class="error-number">404</div>
      <div class="error-card">
        <img src="https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6a326d5971bd7053927eaf90_American%20Institute%20of%20Applied%20Sciences%20in%20Switzerland%20-%20Campus%20main%20picture%202025%20lr.jpg" alt="" loading="eager" decoding="async">
        <div class="error-card-note"><strong>AUS Business School</strong><span>La Tour-de-Peilz · Switzerland</span></div>
      </div>
      <div class="error-marker">Lost?</div>
    </div>
  </div>
</main>

`;

function removeBetween(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (start < 0 || end < 0) {
    throw new Error(`Could not remove the 404-only template block between "${startMarker}" and "${endMarker}".`);
  }
  return source.slice(0, start) + source.slice(end);
}

function buildPage() {
  let html = fs.readFileSync(templatePath, 'utf8');
  html = html.replace(
    '<title>About AUS | AUS Business School</title>',
    '<title>Page Not Found | AUS Business School</title>\n<meta name="description" content="The page you requested could not be found. Return to AUS Business School or explore our programs and admissions information.">\n<meta name="robots" content="noindex,follow">'
  );
  html = html.replace('</head>', `${pageStyles}\n</head>`);
  html = html.replace('<body>', '<body class="error-page-body">');
  html = removeBetween(
    html,
    '/* ---------- PROMO POPUP ---------- */',
    '/* ---------- ARCHIVE INDEX TAB'
  );
  html = removeBetween(html, '<!-- Promo Popup -->', '<script>');
  html = removeBetween(html, '// ---------- PROMO POPUP ----------', '</script>');

  const heroMarker = html.match(/<!-- ═+\r?\n\s*HERO[^]*?-->/);
  const footerMarker = html.match(/<!-- ═+\r?\n\s*FOOTER\r?\n\s*═+ -->/);
  if (!heroMarker || heroMarker.index == null) throw new Error('The template hero marker was not found.');
  if (!footerMarker || footerMarker.index == null) throw new Error('The template footer marker was not found.');
  if (footerMarker.index <= heroMarker.index) throw new Error('The template content markers are out of order.');

  html = html.slice(0, heroMarker.index) + pageMarkup + html.slice(footerMarker.index);
  fs.writeFileSync(sourceTarget, html, 'utf8');
  fs.mkdirSync(path.dirname(distTarget), { recursive: true });
  fs.writeFileSync(distTarget, html, 'utf8');
  console.log('Built 404.html and dist/404.html from the shared site template.');
}

buildPage();
