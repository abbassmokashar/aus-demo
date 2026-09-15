const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const templatePath = path.join(root, 'about.html');
const outputPath = path.join(root, 'contact-us.html');
const distPath = path.join(root, 'dist', 'contact-us.html');

const campusImage = 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6a326d5971bd7053927eaf90_American%20Institute%20of%20Applied%20Sciences%20in%20Switzerland%20-%20Campus%20main%20picture%202025%20lr.jpg';

const styles = `
<style id="aus-contact-page-styles">
.contact-intro{padding:clamp(56px,7vw,92px) 0;background:#fff}
.contact-intro-grid{display:grid;grid-template-columns:minmax(0,.92fr) minmax(0,1.08fr);gap:clamp(36px,7vw,96px);align-items:start}
.contact-intro h2,.contact-methods h2,.contact-map-copy h2{font-family:var(--font-display);font-size:clamp(34px,4.5vw,58px);line-height:1.04;letter-spacing:-.03em;color:var(--navy);margin:12px 0 20px}
.contact-lead{font-size:clamp(15px,1.25vw,18px);line-height:1.75;color:var(--ink-soft);max-width:58ch}
.contact-details{display:grid;gap:12px}
.contact-detail{display:grid;grid-template-columns:46px 1fr;gap:16px;align-items:center;padding:18px 20px;border:1px solid var(--line);border-radius:14px;background:#f1f1ef}
.contact-detail-icon{width:46px;height:46px;border-radius:12px;background:#fff;color:var(--crimson);display:flex;align-items:center;justify-content:center;font-size:19px;font-weight:800;box-shadow:0 8px 24px rgba(34,41,95,.07)}
.contact-detail small{display:block;font-size:11px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--slate);margin-bottom:4px}
.contact-detail a,.contact-detail span{font-size:15px;line-height:1.5;color:var(--navy);font-weight:650}
.contact-hours{padding:clamp(56px,7vw,86px) 0;background:#f1f1ef}
.contact-hours-card{display:grid;grid-template-columns:1fr auto;gap:28px;align-items:center;padding:clamp(28px,4vw,48px);background:#fff;border:1px solid var(--line);border-radius:20px;box-shadow:0 18px 50px rgba(34,41,95,.08)}
.contact-hours-card h2{font-family:var(--font-display);font-size:clamp(30px,4vw,50px);line-height:1.08;color:var(--navy);margin:10px 0 14px}
.contact-hours-card p{font-size:15px;line-height:1.7;color:var(--ink-soft);max-width:60ch}
.contact-hours-time{min-width:240px;padding:24px;border-left:4px solid var(--crimson);background:#f1f1ef;border-radius:0 14px 14px 0}
.contact-hours-time strong{display:block;font-family:var(--font-display);font-size:24px;color:var(--navy);margin-bottom:6px}
.contact-hours-time span{font-size:13px;color:var(--ink-soft)}
.contact-methods{padding:clamp(60px,8vw,100px) 0;background:#fff}
.contact-methods-head{max-width:720px;margin-bottom:clamp(30px,4vw,50px)}
.contact-method-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
.contact-method-card{position:relative;display:flex;flex-direction:column;min-height:230px;padding:clamp(24px,3vw,34px);border:1px solid var(--line);border-radius:18px;background:#f1f1ef;overflow:hidden;transition:transform .3s var(--ease),box-shadow .3s var(--ease),border-color .3s var(--ease)}
.contact-method-card::before{content:"";position:absolute;width:120px;height:120px;border-radius:50%;right:-58px;top:-58px;background:rgba(190,31,61,.08)}
.contact-method-card:hover{transform:translateY(-5px);box-shadow:0 18px 44px rgba(34,41,95,.11);border-color:rgba(190,31,61,.34)}
.contact-method-num{font-size:11px;font-weight:800;letter-spacing:.1em;color:var(--crimson);margin-bottom:30px}
.contact-method-card h3{font-family:var(--font-display);font-size:24px;color:var(--navy);margin-bottom:10px}
.contact-method-card p{font-size:14px;line-height:1.65;color:var(--ink-soft);margin-bottom:24px}
.contact-method-link{margin-top:auto;display:inline-flex;align-items:center;gap:9px;color:var(--navy);font-size:14px;font-weight:800}
.contact-method-link::after{content:"→";color:var(--crimson);transition:transform .2s}.contact-method-card:hover .contact-method-link::after{transform:translateX(4px)}
.contact-map{padding:clamp(56px,7vw,92px) 0;background:#f1f1ef}
.contact-map-grid{display:grid;grid-template-columns:minmax(0,.72fr) minmax(0,1.28fr);gap:clamp(30px,5vw,64px);align-items:center}
.contact-map-copy p{font-size:15px;line-height:1.75;color:var(--ink-soft);margin-bottom:22px}
.contact-map-actions{display:flex;flex-wrap:wrap;gap:10px}.contact-map-actions .hero-cta{margin:0;justify-content:center}.contact-map-actions .map-secondary{background:#fff!important;color:var(--navy)!important;border:1px solid var(--line)}
.contact-map-frame-wrap{position:relative;min-width:0;border-radius:20px;overflow:hidden;box-shadow:0 20px 55px rgba(34,41,95,.13);background:#fff}
.contact-map-frame{display:block;height:clamp(390px,48vw,540px);border:0;width:100%}
.contact-map-hint{position:absolute;z-index:2;left:18px;top:18px;padding:9px 13px;border:1px solid rgba(255,255,255,.75);border-radius:999px;background:rgba(255,255,255,.92);box-shadow:0 8px 28px rgba(17,24,39,.14);backdrop-filter:blur(10px);color:var(--navy);font-size:11px;font-weight:800;letter-spacing:.04em;pointer-events:none}
@media(max-width:800px){.contact-intro-grid,.contact-map-grid{grid-template-columns:1fr}.contact-hours-card{grid-template-columns:1fr}.contact-hours-time{min-width:0}.contact-method-grid{grid-template-columns:1fr}.contact-map-copy{max-width:640px}.contact-map-frame{height:min(68vh,480px)}}
@media(max-width:480px){.contact-map-actions{display:grid;grid-template-columns:1fr}.contact-map-actions .hero-cta{width:100%}.contact-map-hint{left:10px;top:10px;font-size:10px}}
</style>`;

const content = `<!-- CONTACT PAGE -->
<header class="hero" data-chapter="01" data-chapter-label="Contact">
  <div class="hero-bg"><img fetchpriority="high" loading="eager" decoding="async" src="${campusImage}" alt="AUS Business School campus in La Tour-de-Peilz"></div>
  <div class="hero-inner">
    <div class="hero-badge" style="margin-bottom:clamp(14px,1.6vw,22px);"><span class="hero-badge-icon">@</span>Contact AUS</div>
    <h1 style="font-size:clamp(52px,8vw,104px);line-height:.95;">Let’s start a conversation.</h1>
    <p class="hero-sub">Speak with the AUS team about programs, admissions, campus visits, student advising or life in Switzerland.</p>
  </div>
  <div class="hero-scroll">Scroll</div>
</header>

<div class="hero-mobile">
  <div class="hero-mob-img"><img fetchpriority="high" loading="eager" decoding="async" src="${campusImage}" alt="AUS Business School campus in La Tour-de-Peilz"></div>
  <div class="hero-mob-content"><span class="hero-mob-badge">Contact AUS</span><h1>Let’s start a conversation.</h1><p class="hero-mob-sub">Our team is ready to help with programs, admissions and campus visits.</p></div>
</div>

<div class="breadcrumb"><div class="wrap"><a href="index.html">Home</a><span>/</span>Contact Us</div></div>

<main id="contact-options">
  <section class="contact-intro" data-chapter="02" data-chapter-label="Contact Details">
    <div class="wrap contact-intro-grid">
      <div><span class="eyebrow">Contact Details</span><h2>We’re here to help.</h2><p class="contact-lead">Whether you are choosing a program, preparing an application or planning a visit, contact the team in the way that works best for you.</p></div>
      <div class="contact-details">
        <div class="contact-detail"><div class="contact-detail-icon">@</div><div><small>Email</small><a href="mailto:info@aus.swiss">info@aus.swiss</a></div></div>
        <div class="contact-detail"><div class="contact-detail-icon">T</div><div><small>Telephone</small><a href="tel:+41219449501">+41 21 944 95 01</a></div></div>
        <div class="contact-detail"><div class="contact-detail-icon">A</div><div><small>Campus Address</small><span>Chemin du Levant 5<br>1814 La Tour-de-Peilz, Switzerland</span></div></div>
      </div>
    </div>
  </section>

  <section class="contact-hours" data-chapter="03" data-chapter-label="Working Hours">
    <div class="wrap"><div class="contact-hours-card"><div><span class="eyebrow">Working Hours</span><h2>Monday to Friday</h2><p>Our team is available during the working week. After closing hours, email <a href="mailto:info@aus.swiss" style="color:var(--crimson);font-weight:700;">info@aus.swiss</a> and we will respond as soon as possible on the next working day.</p></div><div class="contact-hours-time"><strong>8:30 am–5:30 pm</strong><span>Central European Time</span></div></div></div>
  </section>

  <section class="contact-methods" data-chapter="04" data-chapter-label="Contact Methods">
    <div class="wrap"><div class="contact-methods-head"><span class="eyebrow">Choose a Contact Method</span><h2>How can we help?</h2><p class="contact-lead">Use the most relevant option and your enquiry will reach the right team.</p></div>
      <div class="contact-method-grid">
        <a class="contact-method-card" href="https://meetings-eu1.hubspot.com/jonathan-hilton/advisory-session"><span class="contact-method-num">01</span><h3>Student Advising</h3><p>Speak with an admissions advisor about eligibility, program selection and your next steps.</p><span class="contact-method-link">Schedule an advisory session</span></a>
        <a class="contact-method-card" href="https://share-eu1.hsforms.com/11syZtqHyQeS44OepgqCVtQfwv24"><span class="contact-method-num">02</span><h3>Contact Form</h3><p>Send your question through the secure AUS contact form and let us know how you would like us to respond.</p><span class="contact-method-link">Open the contact form</span></a>
        <a class="contact-method-card" href="mailto:info@aus.swiss"><span class="contact-method-num">03</span><h3>Send an Email</h3><p>Email the AUS team directly, including after closing hours, and we will follow up as soon as possible.</p><span class="contact-method-link">Email info@aus.swiss</span></a>
        <a class="contact-method-card" href="https://share-eu1.hsforms.com/1t_dizG4cT7-D9bCyPSDnAwfwv24"><span class="contact-method-num">04</span><h3>Book a Campus Visit</h3><p>Visit AUS in La Tour-de-Peilz and experience the campus and Swiss Riviera setting in person.</p><span class="contact-method-link">Schedule your visit</span></a>
      </div>
    </div>
  </section>

  <section class="contact-map" data-chapter="05" data-chapter-label="Find AUS">
    <div class="wrap contact-map-grid">
      <div class="contact-map-copy"><span class="eyebrow">Find AUS</span><h2>On the Swiss Riviera.</h2><p>Chemin du Levant 5, 1814 La Tour-de-Peilz, Switzerland. Pan, zoom and explore the interactive map, or open turn-by-turn directions to campus.</p><div class="contact-map-actions"><a class="hero-cta" href="https://www.google.com/maps/search/?api=1&query=Chemin+du+Levant+5%2C+1814+La+Tour-de-Peilz%2C+Switzerland" target="_blank" rel="noopener" style="background:var(--crimson);color:#fff;">Explore Google Maps →</a><a class="hero-cta map-secondary" href="https://www.google.com/maps/dir/?api=1&destination=Chemin+du+Levant+5%2C+1814+La+Tour-de-Peilz%2C+Switzerland" target="_blank" rel="noopener">Get Directions ↗</a></div></div>
      <div class="contact-map-frame-wrap"><span class="contact-map-hint">Drag, zoom and explore</span><iframe class="contact-map-frame" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen="" title="Interactive map showing AUS Business School in La Tour-de-Peilz" src="https://www.google.com/maps?q=Chemin%20du%20Levant%205%2C%201814%20La%20Tour-de-Peilz%2C%20Switzerland&output=embed"></iframe></div>
    </div>
  </section>
</main>

`;

let html = fs.readFileSync(templatePath, 'utf8');
const contentStart = html.indexOf('<!-- ═══════════════════════════════════════\n     HERO');
const footerStart = html.indexOf('<footer class="site-footer">');
if (contentStart < 0 || footerStart < 0 || footerStart <= contentStart) throw new Error('Could not locate template content boundaries.');
html = html.slice(0, contentStart) + content + html.slice(footerStart);
html = html.replace('</head>', `${styles}\n</head>`);
html = html.replace(/<title>[\s\S]*?<\/title>/i, '<title>Contact AUS Business School in Switzerland | AUS</title>');

fs.writeFileSync(outputPath, html, 'utf8');
fs.mkdirSync(path.dirname(distPath), { recursive: true });
fs.writeFileSync(distPath, html, 'utf8');
console.log('Built contact-us.html and dist/contact-us.html.');
