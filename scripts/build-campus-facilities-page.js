const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const templatePath = path.join(root, 'student-life', 'campus.html');
const outputPath = path.join(root, 'campus-facilities.html');
const facilitiesImages = {
  collaboration: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa9a55bfdc354b0697ffefc_student-collaboration.jpg',
  conference: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa9a55be40458f6d9d79782_conference-room.jpg',
  classroom: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa9a56afa71b786aa870fe3_classroom.jpg',
  cafeteria: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa9a65295e93019251a8914_cafeteria.webp',
  outdoor: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa9a65538f29d3598aacf41_outdoor-sports.webp',
  sportsField: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa9a6583c464554a2bb1bb4_sports-field.webp',
  overview: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aa9a6b9e77f51141d68718b_campus-overview.webp'
};

let html = fs.readFileSync(templatePath, 'utf8').replaceAll('../', '');
html = html.replaceAll('href="campus.html"', 'href="student-life/campus.html"');
html = html.replace(/<title>[\s\S]*?<\/title>/, '<title>Campus Facilities | AUS Business School</title>');

const styles = `<style id="campus-facilities-page-styles">
.facilities-hero{position:relative;min-height:min(760px,88vh);display:flex;align-items:flex-end;overflow:hidden;background:#111827;color:#fff}
.facilities-hero-media{position:absolute;inset:0}.facilities-hero-media img{width:100%;height:100%;object-fit:cover}.facilities-hero-media::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(17,24,39,.88) 0%,rgba(17,24,39,.48) 58%,rgba(17,24,39,.18) 100%),linear-gradient(0deg,rgba(17,24,39,.78),transparent 55%)}
.facilities-hero-content{position:relative;z-index:1;width:100%;padding:clamp(120px,18vh,190px) 0 clamp(56px,8vw,96px)}
.facilities-hero h1{max-width:800px;margin:13px 0 18px;font-family:var(--font-display);font-size:clamp(45px,7vw,88px);font-weight:850;line-height:.96;letter-spacing:-.045em;color:#fff}
.facilities-hero p{max-width:650px;margin:0;font-size:clamp(16px,1.5vw,20px);line-height:1.7;color:rgba(255,255,255,.86)}
.facilities-section{padding:clamp(58px,7vw,98px) 0}.facilities-section.alt{background:#f1f1ef}.facilities-intro{display:grid;grid-template-columns:minmax(0,.75fr) minmax(0,1.25fr);gap:clamp(28px,6vw,90px);align-items:start}.facilities-intro h2,.facilities-sports h2{margin:12px 0 0;font-family:var(--font-display);font-size:clamp(34px,4.8vw,60px);font-weight:820;line-height:1.04;letter-spacing:-.035em;color:var(--navy)}
.facilities-intro-copy{display:grid;gap:18px;color:var(--ink-soft);font-size:16px;line-height:1.8}.facilities-intro-copy p{margin:0}
.facilities-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;margin-top:clamp(34px,5vw,58px)}.facility-card{overflow:hidden;border:1px solid rgba(34,41,95,.14);border-radius:18px;background:#fff;box-shadow:0 16px 42px rgba(17,24,39,.06)}.facility-card img{display:block;width:100%;aspect-ratio:16/10;object-fit:cover}.facility-card-body{padding:clamp(21px,2.5vw,30px)}.facility-card h3{margin:0 0 9px;font-family:var(--font-display);font-size:22px;color:var(--navy)}.facility-card p{margin:0;color:var(--ink-soft);font-size:14px;line-height:1.7}.facility-stat{display:inline-flex;margin-bottom:13px;padding:6px 10px;border-radius:999px;background:#f1f1ef;color:var(--crimson);font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
.facilities-sports{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:20px;align-items:stretch}.facilities-sports-copy{padding:clamp(30px,5vw,64px);border:1px solid rgba(34,41,95,.14);border-radius:20px;background:#fff}.facilities-sports-copy p{color:var(--ink-soft);font-size:15px;line-height:1.8}.facilities-address{margin-top:24px;padding:17px 18px;border-left:4px solid var(--crimson);background:#f1f1ef;color:var(--navy);font-style:normal;font-size:14px;line-height:1.6}.facilities-sports-gallery{display:grid;grid-template-rows:1fr 1fr;gap:20px}.facilities-sports-gallery img{width:100%;height:100%;min-height:230px;object-fit:cover;border-radius:20px}
.facilities-cta{padding:clamp(58px,7vw,90px) 0;background:#fff;text-align:center;border-top:1px solid var(--line)}.facilities-cta h2{max-width:720px;margin:12px auto 16px;font-family:var(--font-display);font-size:clamp(33px,4.7vw,58px);font-weight:820;line-height:1.05;color:var(--navy)}.facilities-cta p{max-width:600px;margin:0 auto 25px;color:var(--ink-soft);line-height:1.7}.facilities-actions{display:flex;justify-content:center;gap:12px;flex-wrap:wrap}.facilities-actions a{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:13px 21px;border-radius:999px;font-weight:750;text-decoration:none}.facilities-actions .primary{background:var(--crimson);color:#fff}.facilities-actions .secondary{border:1px solid rgba(34,41,95,.25);color:var(--navy);background:#fff}
@media(max-width:760px){.facilities-hero{min-height:660px}.facilities-hero-media::after{background:linear-gradient(0deg,rgba(17,24,39,.92),rgba(17,24,39,.28) 75%)}.facilities-intro,.facilities-sports{grid-template-columns:1fr}.facilities-grid{grid-template-columns:1fr}.facilities-sports-gallery{grid-template-columns:1fr 1fr;grid-template-rows:none}.facilities-sports-gallery img{min-height:180px}.facilities-actions{display:grid}.facilities-actions a{width:min(100%,360px)}}
@media(max-width:480px){.facilities-hero{min-height:590px}.facilities-sports-gallery{grid-template-columns:1fr}.facilities-sports-gallery img{min-height:220px}.facility-card{border-radius:14px}}
</style>`;

html = html.replace('</head>', `${styles}\n</head>`);

const body = `<header class="facilities-hero" data-chapter="01" data-chapter-label="Overview">
  <div class="facilities-hero-media"><img fetchpriority="high" loading="eager" decoding="async" src="${facilitiesImages.overview}" alt="Aerial view of the AUS campus and outdoor facilities"></div>
  <div class="facilities-hero-content"><div class="wrap"><span class="eyebrow on-navy">Campus Facilities</span><h1>Spaces designed for learning and connection.</h1><p>Explore the classrooms, meeting spaces, social areas and sports facilities that support daily student life at AUS.</p></div></div>
</header>
<main>
  <section class="facilities-section" data-chapter="02" data-chapter-label="Learning Spaces"><div class="wrap">
    <div class="facilities-intro"><div><span class="eyebrow">AUS Campus</span><h2>A focused environment for a close-knit community.</h2></div><div class="facilities-intro-copy"><p>The AUS campus brings teaching, collaboration and student life together in a compact setting in La Tour-de-Peilz.</p><p>Purpose-built learning and meeting spaces support classes, group work, presentations and conversations beyond the classroom.</p></div></div>
    <div class="facilities-grid">
      <article class="facility-card"><img loading="lazy" decoding="async" src="${facilitiesImages.classroom}" alt="Modern classroom at AUS"><div class="facility-card-body"><span class="facility-stat">8 classrooms · up to 400 students</span><h3>Classrooms</h3><p>Flexible teaching rooms support interactive classes, presentations and focused academic work.</p></div></article>
      <article class="facility-card"><img loading="lazy" decoding="async" src="${facilitiesImages.conference}" alt="Professional conference room at AUS"><div class="facility-card-body"><span class="facility-stat">2 professional rooms</span><h3>Conference Rooms</h3><p>Professional meeting spaces give students and faculty a polished setting for discussion, teamwork and presentations.</p></div></article>
      <article class="facility-card"><img loading="lazy" decoding="async" src="${facilitiesImages.cafeteria}" alt="AUS cafeteria and social lounge"><div class="facility-card-body"><span class="facility-stat">Social space</span><h3>Cafeteria</h3><p>A relaxed place to take a break, meet classmates and stay connected throughout the day.</p></div></article>
      <article class="facility-card"><img loading="lazy" decoding="async" src="${facilitiesImages.collaboration}" alt="AUS students collaborating on campus"><div class="facility-card-body"><span class="facility-stat">Collaborative learning</span><h3>Student Workspaces</h3><p>Shared spaces make it easy to work together on projects, exchange ideas and prepare for class.</p></div></article>
    </div>
  </div></section>
  <section class="facilities-section alt" data-chapter="03" data-chapter-label="Sports"><div class="wrap"><div class="facilities-sports">
    <div class="facilities-sports-copy"><span class="eyebrow">Movement & Wellbeing</span><h2>Outdoor sports facilities.</h2><p>Students can make use of an outdoor multi-sports setting and nearby sports infrastructure for recreation, team activities and an active campus experience.</p><address class="facilities-address"><strong>Stade de Bel Air</strong><br>Chemin de Béranges 43<br>1814 La Tour-de-Peilz</address></div>
    <div class="facilities-sports-gallery"><img loading="lazy" decoding="async" src="${facilitiesImages.outdoor}" alt="Outdoor basketball court and athletics facilities"><img loading="lazy" decoding="async" src="${facilitiesImages.sportsField}" alt="Football field at Stade de Bel Air"></div>
  </div></div></section>
  <section class="facilities-cta" data-chapter="04" data-chapter-label="Visit"><div class="wrap"><span class="eyebrow">See It for Yourself</span><h2>Visit the AUS campus.</h2><p>Book a campus visit to explore the facilities, meet the team and experience the learning environment in person.</p><div class="facilities-actions"><a class="primary" href="https://share-eu1.hsforms.com/1t_dizG4cT7-D9bCyPSDnAwfwv24">Book a Campus Visit</a><a class="secondary" href="student-life/campus.html">Explore Campus Life</a></div></div></section>
</main>
`;

const start = html.indexOf('<header class="hero"');
const end = html.indexOf('<footer class="site-footer">', start);
if (start < 0 || end < 0) throw new Error('Campus template content boundaries not found.');
html = html.slice(0, start) + body + html.slice(end);
fs.writeFileSync(outputPath, html);
console.log(`Built ${path.relative(root, outputPath)}.`);
