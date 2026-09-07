/* Rebuilds admissions.html as a task-oriented hub and generates the admissions
 * path/requirement subpages. Data sourced from:
 *  - Student Affairs - Policy and Procedures for Admissions.docx (policy text)
 *  - programs/doctorate/dba.html + program pages (doctoral requirements)
 * Run: node build-admissions.js
 */
const fs = require('fs');
const path = require('path');

const apply = 'https://study.aus.swiss/application';
const talk = 'https://meetings-eu1.hubspot.com/michiel-van-de-water?uuid=70eae9b0-a7aa-4dcb-856a-9672c6be2602';
const IMG = {
  banner: 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6a326d5971bd7053927eaf90_American%20Institute%20of%20Applied%20Sciences%20in%20Switzerland%20-%20Campus%20main%20picture%202025%20lr.jpg'
};

/* =====================================================================
 * 1. HUB — admissions.html
 * ===================================================================== */
let hub = fs.readFileSync('admissions.html', 'utf8').replace(/\r\n/g, '\n');

function rep(src, from, to, label) {
  if (!src.includes(from)) { console.warn('WARN not found: ' + (label || from.slice(0, 60))); return src; }
  return src.replace(from, to);
}

/* --- 1a. Palette fixes: retire yellow accents, keep navy/crimson/sky --- */
hub = rep(hub,
  '.adm-primary{background:var(--yellow);color:var(--navy);}.adm-primary:hover,.adm-secondary:hover{transform:translateY(-3px);}',
  '.adm-primary{background:var(--navy);color:var(--white);}.adm-primary:hover,.adm-secondary:hover{transform:translateY(-3px);}',
  'primary btn');
hub = rep(hub,
  '.adm-step-btn::after{content:"+";font-size:18px;color:var(--yellow);}',
  '.adm-step-btn::after{content:"+";font-size:18px;color:var(--sky);}',
  'step plus');
hub = rep(hub,
  'background:var(--yellow);}\n.adm-visa-panel.is-active{display:grid;}',
  'background:var(--sky);}\n.adm-visa-panel.is-active{display:grid;}',
  'visa dots');
hub = rep(hub,
  '.adm-progress-bar{height:100%;width:0;background:var(--yellow);transition:width .4s var(--ease);}',
  '.adm-progress-bar{height:100%;width:0;background:var(--sky);transition:width .4s var(--ease);}',
  'progress bar');
hub = rep(hub,
  '.adm-cta .chapter-label .num{color:var(--yellow);}',
  '.adm-cta .chapter-label .num{color:var(--sky);}',
  'cta num');
hub = hub.replace(/background: var\(--yellow\); animation: 1\.15s/g, 'background: var(--sky); animation: 1.15s');

/* --- 1b. New hub CSS appended after the redesign style block --- */
const hubCss = `</style>
<style id="adm-hub-v3">
/* Task-hub additions — white / paper / night rhythm only */
.adm-path-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;}
@media(max-width:820px){.adm-path-grid{grid-template-columns:1fr;}}
.adm-path-card{position:relative;display:flex;flex-direction:column;gap:12px;padding:clamp(26px,3vw,40px);background:var(--white);border:1px solid var(--line);border-radius:4px;transition:transform .35s var(--ease),box-shadow .35s var(--ease),border-color .35s var(--ease);}
.adm-path-card:hover{transform:translateY(-5px);border-color:var(--navy);box-shadow:0 18px 44px rgba(34,41,95,.10);}
.adm-path-card .path-index{font-family:var(--font-serif);font-style:italic;font-size:14px;color:var(--crimson);}
.adm-path-card h3{font-size:clamp(20px,2vw,25px);letter-spacing:-.015em;font-weight:800;color:var(--navy);}
.adm-path-card p{font-size:14px;line-height:1.65;color:var(--ink-soft);flex:1;}
.adm-path-card .path-link{font-size:13px;font-weight:700;color:var(--navy);}
.adm-path-card:hover .path-link{color:var(--crimson);}
.adm-req-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
@media(max-width:980px){.adm-req-grid{grid-template-columns:1fr 1fr;}}
@media(max-width:600px){.adm-req-grid{grid-template-columns:1fr;}}
.adm-req-link{display:grid;gap:7px;padding:clamp(22px,2.6vw,30px);background:var(--white);border:1px solid var(--line);border-radius:4px;transition:transform .35s var(--ease),border-color .35s var(--ease);}
.adm-req-link:hover{transform:translateY(-4px);border-color:var(--navy);}
.adm-req-link .num{font-family:var(--font-serif);font-style:italic;font-size:13px;color:var(--crimson);}
.adm-req-link strong{font-size:15.5px;color:var(--navy);}
.adm-req-link small{font-size:12.5px;line-height:1.5;color:var(--ink-soft);}
.adm-section.night{background:var(--night);color:var(--white);}
.adm-deadline-strip{grid-template-columns:repeat(4,1fr);}
.adm-step-panel{min-height:460px;}
.adm-step-btn strong{font-weight:600;font-size:14.5px;}
.adm-cta .adm-primary{background:var(--white);color:var(--navy);}
.adm-cta .adm-primary:hover{background:var(--crimson);color:var(--white);}
</style>`;
hub = rep(hub, '</style>\n<!-- Homepage chrome: kept inline for independent Webflow embeds. -->', hubCss + '\n<!-- Homepage chrome: kept inline for independent Webflow embeds. -->', 'hub css insert');

/* --- 1c. Replace the entire <main> with the task-oriented hub --- */
const mainStart = hub.indexOf('<main class="adm-page">');
const mainEnd = hub.indexOf('</main>') + '</main>'.length;
if (mainStart < 0 || mainEnd < mainStart) throw new Error('main not found');

const hubMain = `<main class="adm-page">
<header class="adm-hero" data-chapter="01" data-chapter-label="Admissions">
  <div class="adm-hero-media"><img decoding="async" fetchpriority="high" src="${IMG.banner}" alt="AUS campus in La Tour-de-Peilz, Switzerland"></div>
  <div class="adm-hero-inner">
    <div class="adm-kicker">Admissions at AUS</div>
    <h1>Admissions, <em>by task.</em></h1>
    <div class="adm-hero-copy">
      <p>Every step, requirement, and deadline in one place — so you always know what to do next, from choosing a program to arriving on campus.</p>
      <a class="adm-primary" href="${apply}">Start your application <span aria-hidden="true">&rarr;</span></a>
    </div>
  </div>
</header>

<section class="adm-section paper" id="where-to-go" data-chapter="02" data-chapter-label="Your Admissions Path">
  <div class="wrap">
    <div class="adm-heading reveal"><div class="chapter-label"><span class="num">02</span>Your Admissions Path</div><h2>Start with <em>your route.</em></h2><p>Four admissions paths. Each page shows the process, the requirements, and the next action for that route.</p></div>
    <div class="adm-path-grid stagger-grid">
      <a class="adm-path-card" href="admissions/bachelors.html">
        <span class="path-index">Path 01</span>
        <h3>Bachelor&rsquo;s Admissions</h3>
        <p>Entering a three-year bachelor&rsquo;s degree after secondary school. Requirements, documents, and deadlines for the standard route.</p>
        <span class="path-link">Bachelor&rsquo;s admissions <span aria-hidden="true">&rarr;</span></span>
      </a>
      <a class="adm-path-card" href="admissions/masters.html">
        <span class="path-index">Path 02</span>
        <h3>Master&rsquo;s Admissions</h3>
        <p>Applying to a one-year master&rsquo;s program with a recognized bachelor&rsquo;s degree, including the Tiffin University dual-degree track.</p>
        <span class="path-link">Master&rsquo;s admissions <span aria-hidden="true">&rarr;</span></span>
      </a>
      <a class="adm-path-card" href="admissions/doctoral.html">
        <span class="path-index">Path 03</span>
        <h3>Doctoral Admissions</h3>
        <p>Senior professionals applying to the Doctorate in Business Administration — academic criteria, professional record, and research fit.</p>
        <span class="path-link">Doctoral admissions <span aria-hidden="true">&rarr;</span></span>
      </a>
      <a class="adm-path-card" href="admissions/international.html">
        <span class="path-index">Path 04</span>
        <h3>International Admissions</h3>
        <p>Joining from abroad: certificate equivalency, proof of funds, and the Swiss visa route — plus what AUS does after admission.</p>
        <span class="path-link">International admissions <span aria-hidden="true">&rarr;</span></span>
      </a>
    </div>
  </div>
</section>

<section class="adm-section" id="process" data-chapter="03" data-chapter-label="The Process">
  <div class="wrap">
    <div class="adm-heading reveal"><div class="chapter-label"><span class="num">03</span>The Process</div><h2>Eight stages.<br><em>One clear line.</em></h2><p>The same process for every applicant — only the requirements change by path. Select a stage to see what happens and what you prepare.</p></div>
    <div class="adm-steps">
      <div class="adm-step-list" role="tablist" aria-label="Application stages">
        <button class="adm-step-btn is-active" type="button" role="tab" aria-selected="true" data-step="0"><span>01</span><strong>Choose your program</strong></button>
        <button class="adm-step-btn" type="button" role="tab" aria-selected="false" data-step="1"><span>02</span><strong>Check requirements</strong></button>
        <button class="adm-step-btn" type="button" role="tab" aria-selected="false" data-step="2"><span>03</span><strong>Prepare documents</strong></button>
        <button class="adm-step-btn" type="button" role="tab" aria-selected="false" data-step="3"><span>04</span><strong>Submit application</strong></button>
        <button class="adm-step-btn" type="button" role="tab" aria-selected="false" data-step="4"><span>05</span><strong>Admissions review</strong></button>
        <button class="adm-step-btn" type="button" role="tab" aria-selected="false" data-step="5"><span>06</span><strong>Receive decision</strong></button>
        <button class="adm-step-btn" type="button" role="tab" aria-selected="false" data-step="6"><span>07</span><strong>Complete enrollment</strong></button>
        <button class="adm-step-btn" type="button" role="tab" aria-selected="false" data-step="7"><span>08</span><strong>Visa and arrival</strong></button>
      </div>
      <article class="adm-step-panel" id="admStepPanel" aria-live="polite">
        <div class="num">Stage 01</div><h3>Choose your program</h3><p>Browse the bachelor&rsquo;s, master&rsquo;s, and doctoral programs and pick the one that matches your goals. If you are unsure, Admissions can help you align your background and interests with the right program.</p><ul><li>Three intakes per year: January, April, and September</li><li>Classes capped at 20 students, taught entirely in English</li><li>Questions? Talk to Admissions before you commit</li></ul>
      </article>
    </div>
  </div>
</section>

<section class="adm-section paper" id="requirements-hub" data-chapter="04" data-chapter-label="Requirements">
  <div class="wrap">
    <div class="adm-heading reveal"><div class="chapter-label"><span class="num">04</span>Requirements</div><h2>Find the rules<br><em>that apply to you.</em></h2><p>Six requirement pages, each stating who the rules apply to, the academic and language requirements, the documents, the deadlines, and the next action.</p></div>
    <div class="adm-req-grid stagger-grid">
      <a class="adm-req-link" href="admissions/bachelors-requirements.html"><span class="num">01</span><strong>Bachelor&rsquo;s Requirements</strong><small>Maturity, IB, equivalency, and the admission English list</small></a>
      <a class="adm-req-link" href="admissions/masters-requirements.html"><span class="num">02</span><strong>Master&rsquo;s Requirements</strong><small>Recognized bachelor&rsquo;s degree and the Tiffin partner requirements</small></a>
      <a class="adm-req-link" href="admissions/doctoral-requirements.html"><span class="num">03</span><strong>Doctoral Requirements</strong><small>Master&rsquo;s degree, professional record, and research fit</small></a>
      <a class="adm-req-link" href="admissions/international-requirements.html"><span class="num">04</span><strong>International Requirements</strong><small>Equivalency, CHF 25,000 funds, and the visa route</small></a>
      <a class="adm-req-link" href="admissions/english-requirements.html"><span class="num">05</span><strong>English Requirements</strong><small>Every accepted test — admission list and visa list</small></a>
      <a class="adm-req-link" href="admissions/transfer-requirements.html"><span class="num">06</span><strong>Transfer Requirements</strong><small>Credit transfer, the 60 ECTS rule, and the JST</small></a>
    </div>
  </div>
</section>

<section class="adm-section" id="fees-deadlines" data-chapter="05" data-chapter-label="Fees &amp; Deadlines">
  <div class="wrap">
    <div class="adm-heading reveal"><div class="chapter-label"><span class="num">05</span>Fees &amp; Deadlines</div><h2>Know the dates,<br><em>plan the budget.</em></h2><p>Applications are reviewed continuously throughout the year — rolling admissions. Exact deadlines per intake are published by AUS.</p></div>
    <div class="adm-date-grid stagger-grid">
      <article class="adm-date"><div class="month">January</div><strong>Winter intake</strong><p>Prepare early if you need immigration processing or certified translations.</p></article>
      <article class="adm-date"><div class="month">April</div><strong>Spring intake</strong><p>Availability depends on your chosen program and the academic calendar.</p></article>
      <article class="adm-date"><div class="month">September</div><strong>Autumn intake</strong><p>Your Offer Letter states the next available term unless you request another.</p></article>
    </div>
    <div class="adm-deadline-strip stagger-grid">
      <div class="adm-metric"><strong>CHF 250</strong><p>Application Fee, due when applying. Non-refundable. Waivers are considered case by case via study@aus.swiss.</p></div>
      <div class="adm-metric"><strong>CHF 1,500</strong><p>Admission Fee, due within 10 calendar days of the Offer Letter to confirm your place. Non-refundable.</p></div>
      <div class="adm-metric"><strong>10 calendar days</strong><p>Return the signed Offer Letter, signed Student Agreement, and proof of the Admission Fee payment after a positive decision.</p></div>
      <div class="adm-metric"><strong>Up to one year</strong><p>You may defer the start of your studies by a maximum of one year. After that, the offer becomes invalid and you must reapply.</p></div>
    </div>
  </div>
</section>

<section class="adm-section paper" id="questions" data-chapter="06" data-chapter-label="Good to Know">
  <div class="wrap">
    <div class="adm-heading reveal"><div class="chapter-label"><span class="num">06</span>Good to Know</div><h2>The short answers,<br><em>before you ask.</em></h2><p>The points applicants raise most often, answered from the Admissions Policy.</p></div>
    <div class="adm-details">
      <details><summary>Can I apply before I have every document?</summary><p>Yes. Student Recruitment first reviews your application for completeness and may ask you to resubmit parts of it. An application proceeds to the eligibility assessment once it is complete, so submitting early with a clear plan for outstanding documents works in your favor.</p></details>
      <details><summary>What decisions can the Admissions Committee make?</summary><p>Unconditional admission (Offer Letter, nothing outstanding), conditional admission (Offer Letter subject to documents or steps), deferral (automatically considered for the next intake), or rejection. Rejected applicants may not reapply for the same intake but receive the grounds and remedial actions.</p></details>
      <details><summary>Can AUS alumni skip part of the master&rsquo;s process?</summary><p>Yes. Candidates applying for a master&rsquo;s degree after completing an AUS bachelor&rsquo;s degree may have certain steps waived by the Admissions Committee, such as the interview or reference letters.</p></details>
      <details><summary>Is the Admissions Interview online?</summary><p>Yes, by video conference via Zoom or Google Meet. It assesses how you express your experiences and opinions, your English, your clarity of thought, and your fit for the program. You can also raise credit transfer and scholarship questions there.</p></details>
      <details><summary>What happens if documents are not submitted on time?</summary><p>Conditionally admitted applicants may have their offer withdrawn if documents or deadlines are missed. AUS then decides whether the application is deferred to the next intake or rejected.</p></details>
      <details><summary>What if information in the application is fraudulent?</summary><p>AUS may require further documentation, withdraw the application at any point, withdraw an Offer Letter, or terminate enrolment if a fraudulent application is discovered at a later stage.</p></details>
    </div>
  </div>
</section>

<section class="adm-cta" data-chapter="07" data-chapter-label="Next Step">
  <div class="wrap"><div class="chapter-label"><span class="num">07</span>Next Step</div><h2>Your next step,<br><em>already mapped.</em></h2><p>Pick your admissions path above, or begin the application now. If you would rather talk it through first, Admissions is one meeting away.</p><div class="adm-cta-actions"><a class="adm-primary" href="${apply}">Start your application <span aria-hidden="true">&rarr;</span></a><a class="adm-secondary" href="${talk}">Talk to Admissions</a></div></div>
</section>
</main>`;

hub = hub.slice(0, mainStart) + hubMain + hub.slice(mainEnd);

/* --- 1d. Update the step-panel JS with the 8 stages --- */
const stepData = `  var stepData=[
    {title:'Choose your program',copy:'Browse the bachelor\\u2019s, master\\u2019s, and doctoral programs and pick the one that matches your goals. If you are unsure, Admissions can help you align your background and interests with the right program.',items:['Three intakes per year: January, April, and September','Classes capped at 20 students, taught entirely in English','Unsure which program fits? Talk to Admissions first']},
    {title:'Check requirements',copy:'Every path has its own academic and language requirements. Open the requirements page for your route and confirm you meet the minimum criteria before assembling documents.',items:['Bachelor\\u2019s: secondary school-leaving certificate considered equivalent','Master\\u2019s: recognized bachelor\\u2019s degree','Doctoral: master\\u2019s degree plus professional record and research fit','English proficiency evidence, no older than two years']},
    {title:'Prepare documents',copy:'Gather the standard file. Documents issued in a language other than English must be translated by a notarized translation, at your own expense, before submission.',items:['Completed AUS application form','Copy of your valid passport or Swiss National ID','Official transcripts, diplomas, and certificates','Motivation letter of about 500 words','Two recommendation letters from instructors or employers']},
    {title:'Submit application',copy:'Submit through the application form on the AUS website, by email to study@aus.swiss, or by post to Chemin du Levant 5, 1814 La Tour-de-Peilz, Switzerland. The CHF 250 Application Fee is due at this point.',items:['Apply online, by email, or by post','Application Fee: CHF 250, non-refundable','Fee waivers considered case by case via study@aus.swiss','Rolling review: apply as soon as your file is ready']},
    {title:'Admissions review',copy:'Student Recruitment checks your file for completeness. Student Affairs then assesses eligibility and, if positive, schedules your Admissions Interview by video conference.',items:['Incomplete applications pause until resubmitted','Interview held via Zoom or Google Meet','Assessed: English expression, clarity of thought, program fit','Raise credit transfer or scholarship questions at the interview']},
    {title:'Receive decision',copy:'The Admissions Committee decides on the basis of the eligibility requirements. Decisions may be unconditional, conditional, deferred, or rejected.',items:['Unconditional: Offer Letter, no supplementary documents','Conditional: Offer Letter subject to outstanding items','Deferred: automatically considered for the next intake','Rejected: grounds and remedial actions are communicated']},
    {title:'Complete enrollment',copy:'To accept the offer, return the signed Offer Letter, the signed Student Agreement, and proof of payment of the CHF 1,500 Admission Fee no later than 10 calendar days after the offer.',items:['Sign and return the Offer Letter','Sign and return the Student Agreement','Pay the CHF 1,500 Admission Fee','Deferral possible for up to one year on request']},
    {title:'Visa and arrival',copy:'EU/EFTA residents do not need a visa. Non-EU/EFTA residents apply at the Swiss embassy or consulate in their home country after receiving the official Acceptance Letter. Student Recruitment supports you through the process.',items:['Non-EU/EFTA: apply at the Swiss embassy or consulate','Provide CV, proof of language proficiency, and CHF 25,000 funds','AUS provides the Acceptance Letter, Study Plan, and written undertaking','The visa decision rests solely with the Swiss authorities']}
  ];
`;
const jsStart = hub.indexOf('  var stepData=[');
const jsEnd = hub.indexOf('  var panel=document.getElementById');
if (jsStart < 0 || jsEnd < jsStart) throw new Error('stepData block not found');
hub = hub.slice(0, jsStart) + stepData + hub.slice(jsEnd);

/* The old document-checklist JS no longer has markup — drop it */
hub = rep(hub,
  "  var checks=document.querySelectorAll('#admDocumentList input'),count=document.getElementById('admDocCount'),bar=document.getElementById('admProgressBar'),status=document.getElementById('admDocStatus');function updateDocs(){var done=Array.prototype.filter.call(checks,function(c){return c.checked;}).length;count.textContent=done;bar.style.width=(done/checks.length*100)+'%';status.textContent=done===checks.length?'Your document checklist is complete.':done?'Good progress. '+(checks.length-done)+' item'+(checks.length-done===1?' remains.':'s remain.'):'Start checking items as you prepare them.';}checks.forEach(function(c){c.addEventListener('change',updateDocs);});\n",
  '', 'doc checklist js');

/* --- 1e. Enrich the hub's search-index entry --- */
hub = rep(hub,
  '{title:"Admissions",url:"admissions.html",cat:"Admissions",keys:"Admissions ',
  '{title:"Admissions",url:"admissions.html",cat:"Admissions",keys:"Admissions Bachelor Master Doctoral International admissions paths Bachelor requirements Master requirements Doctoral requirements International requirements English requirements Transfer requirements application process eight stages choose program check requirements prepare documents submit application review decision enrollment visa arrival fees CHF deadlines rolling admissions ',
  'search index');

/* --- 1f. Add the new subpages to the side-panel Admissions accordion --- */
if (!hub.includes('admissions/bachelors-requirements.html"')) {
  hub = rep(hub,
    `          <div class="accordion-group">
            <a href="admissions.html">Admissions &amp; Financing</a>
            <a href="cost-calculator.html">Cost Calculator</a>`,
    `          <div class="accordion-group">
            <a href="admissions.html">Admissions &amp; Financing</a>
            <a href="admissions/bachelors.html">Bachelor's Admissions</a>
            <a href="admissions/masters.html">Master's Admissions</a>
            <a href="admissions/doctoral.html">Doctoral Admissions</a>
            <a href="admissions/international.html">International Admissions</a>
            <a href="admissions/bachelors-requirements.html">Bachelor's Requirements</a>
            <a href="admissions/masters-requirements.html">Master's Requirements</a>
            <a href="admissions/doctoral-requirements.html">Doctoral Requirements</a>
            <a href="admissions/international-requirements.html">International Requirements</a>
            <a href="admissions/english-requirements.html">English Requirements</a>
            <a href="admissions/transfer-requirements.html">Transfer Requirements</a>
            <a href="cost-calculator.html">Cost Calculator</a>`,
    'side-panel accordion');
}

/* --- 1g. Add the new subpages to the search index (guarded against re-runs) --- */
if (!hub.includes('url:"admissions/bachelors-requirements.html"')) {
  const newEntries = [
    ['Bachelor\u2019s Admissions', 'admissions/bachelors.html', 'Admissions', 'Bachelors admissions route bachelor path apply process choose program check requirements prepare documents submit review decision enrollment visa arrival requirements documents deadlines CHF fees who applies Swiss Maturity international IB transfer'],
    ['Master\u2019s Admissions', 'admissions/masters.html', 'Admissions', 'Masters admissions route master path apply process one year specializations Tiffin dual degree requirements documents deadlines fees who applies recognized bachelor degree AUS alumni waiver'],
    ['Doctoral Admissions', 'admissions/doctoral.html', 'Admissions', 'Doctoral admissions route DBA doctorate business administration path apply process requirements documents deadlines fees senior professionals executives research fit supervision master degree'],
    ['International Admissions', 'admissions/international.html', 'Admissions', 'International admissions route path apply from abroad process equivalency CRUS Lisbon convention visa route EU EFTA non-EU proof of funds CHF 25000 notarized translations arrival'],
    ['Bachelor\u2019s Requirements', 'admissions/bachelors-requirements.html', 'Admissions', 'Bachelors requirements who applies academic requirements Swiss Maturity Matura Professional Specialized Passerelle SERI foreign certificate equivalent CRUS IB Diploma documents required language English B2 IELTS 5.5 Cambridge Pearson SAT ECPE MELAB deadlines next action'],
    ['Master\u2019s Requirements', 'admissions/masters-requirements.html', 'Admissions', 'Masters requirements who applies academic requirements recognized bachelor degree accredited Tiffin University partner Higher Learning Commission documents required language English IELTS 6.0 deadlines next action AUS alumni waiver'],
    ['Doctoral Requirements', 'admissions/doctoral-requirements.html', 'Admissions', 'Doctoral requirements DBA who applies academic requirements master degree professional track record research interest supervision capacity documents required language English interview assessment deadlines next action'],
    ['International Requirements', 'admissions/international-requirements.html', 'Admissions', 'International requirements who applies EU EFTA non-EU equivalency upper secondary certificate Swiss Maturity CRUS Lisbon Recognition Convention ETS 165 documents required CV proof of funds CHF 25000 escrow visa Acceptance Letter Study Plan written undertaking language visa list TOEFL Duolingo deadlines'],
    ['English Requirements', 'admissions/english-requirements.html', 'Admissions', 'English requirements who applies exempt native speakers two years validity admission list CEFR B2 IELTS 5.5 TOEFL Cambridge FCE NCUK Pearson PTE 50 SAT 1000 Michigan ECPE MELAB McGraw-Hill visa list TOEFL iBT 72-94 Duolingo 95'],
    ['Transfer Requirements', 'admissions/transfer-requirements.html', 'Admissions', 'Transfer requirements who applies transfer students one full semester DEQAR regionally accredited US recognized agency academic requirements 60 ECTS secondary records higher education Dean of Academics Academic Committee JST Joint Services Transcript ACE Army Marine Corps Navy Coast Guard Air Force CCAF documents deadlines']
  ].map(e => `    {title:"${e[0]}",url:"${e[1]}",cat:"${e[2]}",keys:"${e[3]}"},`).join('\n');
  const marker = /\{title:"Admissions",url:"admissions.html",cat:"Admissions",keys:"[^}]*\},\n/;
  const m = hub.match(marker);
  if (!m) { console.warn('WARN: search-index admissions entry not found'); }
  else hub = hub.replace(m[0], m[0] + newEntries + '\n');
}

fs.writeFileSync('admissions.html', hub, 'utf8');
console.log('Hub rebuilt: admissions.html (' + hub.length + ' bytes)');

/* =====================================================================
 * 2. Shared chrome extracted once from the rebuilt hub
 * ===================================================================== */
function extractBetween(src, startMarker, endMarker, includeEnd) {
  const a = src.indexOf(startMarker);
  if (a < 0) throw new Error('Start marker not found: ' + startMarker);
  const b = src.indexOf(endMarker, a);
  if (b < 0) throw new Error('End marker not found: ' + endMarker);
  return src.slice(a, b + (includeEnd ? endMarker.length : 0));
}

function extractElement(src, tag, marker) {
  const open = new RegExp('<' + tag + '\\b[^>]*' + marker + '[^>]*>', 'g').exec(src);
  if (!open) throw new Error('Element not found: ' + marker);
  const tags = new RegExp('</?' + tag + '\\b[^>]*>', 'g');
  tags.lastIndex = open.index;
  let depth = 0;
  let match;
  while ((match = tags.exec(src))) {
    depth += match[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return src.slice(open.index, tags.lastIndex);
  }
  throw new Error('Unclosed element: ' + marker);
}

const chromeCss = extractBetween(hub, '<style id="aus-shared-chrome">', '</style>', true);
const preloaderHtml = extractElement(hub, 'div', 'id="preloader"');
const navHtml = extractBetween(hub, '<nav class="aus-nav" id="nav">', '</nav>', true);
const panelHtml = extractBetween(hub, '<div class="side-panel" id="sidePanel">', '\n<main class="adm-page">', false);
const footerHtml = extractBetween(hub, '<footer class="site-footer">', '</footer>', true);
const popupHtml = extractBetween(hub, '<!-- Promo Popup -->', '<script>\n(function(){\n  // Preloader', false);
const jsAnchor = hub.indexOf('<script>\n(function(){\n  // Preloader');
const jsTailAnchor = hub.indexOf('// ---------- Archive index tab');
if (jsAnchor < 0 || jsTailAnchor < 0) throw new Error('chrome js markers not found');
const chromeJs = hub.slice(jsAnchor + '<script>'.length, hub.indexOf('</script>', jsTailAnchor));

/* =====================================================================
 * 3. SUBPAGE TEMPLATE
 * ===================================================================== */
function rel(file) { const d = path.dirname(file); const depth = d === '.' ? 0 : d.split('/').length; return depth === 0 ? '' : '../'.repeat(depth); }

function page(opts) {
  const r = rel(opts.file);
  const L = p => r + p;
  const links = {
    hub: L('admissions.html'),
    breq: L('admissions/bachelors-requirements.html'), mreq: L('admissions/masters-requirements.html'),
    dreq: L('admissions/doctoral-requirements.html'), ireq: L('admissions/international-requirements.html'),
    ereq: L('admissions/english-requirements.html'), treq: L('admissions/transfer-requirements.html')
  };
  const fixLocal = html => html
    .replace(/(href|src)="(?!https?:|#)([^"]*)"/g, (m, attr, u) => attr + '="' + r + u + '"')
    .replace(/url:"(?!https?:|#)([^"]*)"/g, (m, u) => 'url:"' + r + u + '"');

  const related = (opts.related && opts.related.length) ? `
<section class="rq-section paper" data-chapter="R" data-chapter-label="Related Pages">
  <div class="wrap">
    <div class="chapter-label"><span class="num">&plusmn;</span>Related Pages</div>
    <div class="rq-related">
      ${opts.related.map(x => `<a href="${links[x.key]}"><span class="num">${x.num}</span><strong>${x.label}</strong><small>${x.note}</small></a>`).join('\n      ')}
    </div>
  </div>
</section>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${opts.title} | AUS Business School</title>
<meta name="description" content="${opts.desc}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap" rel="stylesheet">
<script>document.documentElement.classList.add('js');</script>
<style>
:root{
  --white:#ffffff;--navy:#22295f;--crimson:#be1f3d;--sky:#bbddf8;--sky-tint:#eef6fd;
  --yellow:#fff737;--slate:#768cb0;--night:#111827;--paper:#f1f1ef;
  --ink:var(--navy);--ink-soft:#565f8c;--line:rgba(34,41,95,.12);
  --line-on-navy:rgba(255,255,255,.16);
  --font-body:'Inter',sans-serif;--font-display:'Inter',-apple-system,'Segoe UI',Roboto,sans-serif;--font-serif:'Playfair Display',Georgia,'Times New Roman',serif;
  --ease:cubic-bezier(.22,1,.36,1);--ease-soft:cubic-bezier(.16,1,.3,1);
}
*{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{font-family:var(--font-display);color:var(--navy);background:var(--white);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;}
img{max-width:100%;display:block;}
a{color:inherit;text-decoration:none;}
.wrap{width:min(1240px,92%);margin:0 auto;}
/* Reveal — visible by default, animated only when JS is present */
.js .reveal{opacity:0;transform:translateY(24px);transition:opacity .8s var(--ease),transform .8s var(--ease);}
.js .reveal.is-visible{opacity:1;transform:none;}
@media(prefers-reduced-motion:reduce){.js .reveal{opacity:1;transform:none;transition:none;}}

/* SUB NAV */
.sub-nav{position:sticky;top:0;z-index:80;background:rgba(255,255,255,.92);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid var(--line);}
.sub-nav-inner{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:13px 0;}
.sub-nav-crumbs{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--ink-soft);min-width:0;flex-wrap:wrap;}
.sub-nav-crumbs a{color:var(--ink-soft);transition:color .2s var(--ease);}
.sub-nav-crumbs a:hover{color:var(--navy);}
.sub-nav-crumbs .sep{color:var(--line);}
.sub-nav-crumbs strong{color:var(--navy);font-weight:600;}
.sub-nav-actions{display:flex;gap:10px;flex:0 0 auto;}
.sub-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:100px;font-size:13px;font-weight:700;transition:transform .3s var(--ease),background .3s var(--ease),color .3s var(--ease),border-color .3s var(--ease);}
.sub-btn-primary{background:var(--navy);color:var(--white);}
.sub-btn-primary:hover{background:var(--crimson);transform:translateY(-2px);}
.sub-btn-ghost{border:1px solid var(--line);color:var(--navy);background:var(--white);}
.sub-btn-ghost:hover{border-color:var(--navy);transform:translateY(-2px);}
@media(max-width:560px){.sub-btn-ghost{display:none;}}

/* PAGE HERO */
.page-hero{background:var(--white);border-bottom:1px solid var(--line);padding:clamp(56px,8vw,104px) 0 clamp(44px,6vw,80px);}
.page-hero .eyebrow{display:flex;align-items:center;gap:12px;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--crimson);margin-bottom:22px;}
.page-hero .eyebrow::after{content:"";width:44px;height:1px;background:var(--line);}
.page-hero h1{font-size:clamp(36px,5.4vw,68px);line-height:1.02;letter-spacing:-.025em;font-weight:800;max-width:18ch;}
.page-hero h1 em{font-family:var(--font-serif);font-style:italic;font-weight:500;}
.page-hero .lead{margin-top:22px;font-size:clamp(15px,1.35vw,18px);line-height:1.7;color:var(--ink-soft);max-width:62ch;}

/* REQUIREMENT SECTIONS */
.rq-section{padding:clamp(52px,7vw,96px) 0;position:relative;overflow:hidden;}
.rq-section + .rq-section{border-top:1px solid var(--line);}
.rq-section.paper{background:var(--paper);}
.rq-section.night{background:var(--night);color:var(--white);}
.chapter-label{display:flex;align-items:center;gap:14px;margin-bottom:clamp(20px,3vw,32px);font-weight:700;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--navy);}
.chapter-label .num{color:var(--crimson);}
.chapter-label::after{content:"";flex:1;height:1px;background:var(--line);}
.rq-section.night .chapter-label{color:rgba(255,255,255,.7);}
.rq-section.night .chapter-label::after{background:var(--line-on-navy);}
.rq-section.night .chapter-label .num{color:var(--sky);}
.rq-section h2{font-size:clamp(26px,3.2vw,40px);line-height:1.1;letter-spacing:-.015em;font-weight:800;max-width:24ch;margin-bottom:18px;}
.rq-section h2 em{font-family:var(--font-serif);font-style:italic;font-weight:500;}
.rq-section .section-lead{font-size:15.5px;line-height:1.75;color:var(--ink-soft);max-width:58ch;margin-bottom:clamp(28px,4vw,44px);}
.rq-section.night .section-lead{color:rgba(255,255,255,.68);}

.rq-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;}
@media(max-width:820px){.rq-grid{grid-template-columns:1fr;}}
.rq-card{padding:clamp(22px,2.6vw,30px);border:1px solid var(--line);border-radius:4px;background:var(--white);}
.rq-card strong{display:block;font-size:15px;margin-bottom:8px;}
.rq-card p{font-size:14px;line-height:1.7;color:var(--ink-soft);}
.rq-section.night .rq-card{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.14);}
.rq-section.night .rq-card p{color:rgba(255,255,255,.68);}

.rq-list{list-style:none;display:grid;}
.rq-list li{position:relative;padding:14px 0 14px 28px;border-bottom:1px solid var(--line);font-size:15px;line-height:1.6;}
.rq-section.night .rq-list li{border-color:rgba(255,255,255,.14);color:rgba(255,255,255,.8);}
.rq-list li:last-child{border-bottom:none;}
.rq-list li::before{content:"";position:absolute;left:0;top:22px;width:8px;height:8px;border-radius:50%;background:var(--crimson);}
.rq-section.night .rq-list li::before{background:var(--sky);}
.rq-list li small{display:block;font-size:12.5px;color:var(--ink-soft);margin-top:3px;}
.rq-section.night .rq-list li small{color:rgba(255,255,255,.55);}

/* SCORE TABLE */
.score-table{width:100%;border-collapse:collapse;background:var(--white);}
.rq-section.night .score-table{background:transparent;}
.score-table th{text-align:left;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--slate);padding:12px 16px;border-bottom:1px solid var(--line);}
.rq-section.night .score-table th{color:rgba(255,255,255,.55);border-color:rgba(255,255,255,.14);}
.score-table td{padding:14px 16px;border-bottom:1px solid var(--line);font-size:14.5px;vertical-align:top;}
.rq-section.night .score-table td{border-color:rgba(255,255,255,.14);color:rgba(255,255,255,.82);}
.score-table tr:last-child td{border-bottom:none;}
.score-table .test-name{font-weight:600;}
.rq-section.night .score-table .test-name{color:var(--white);}
.score-table .test-score{font-family:var(--font-serif);font-style:italic;font-size:16.5px;white-space:nowrap;color:var(--crimson);}
.rq-section.night .score-table .test-score{color:var(--sky);}
@media(max-width:640px){.score-table th:nth-child(3),.score-table td:nth-child(3){display:none;}}

/* NOTE / CALLOUT */
.rq-note{display:grid;grid-template-columns:auto 1fr;gap:16px;padding:clamp(20px,2.6vw,28px);border:1px solid var(--line);border-left:2px solid var(--navy);background:var(--white);align-items:start;}
.rq-section.night .rq-note{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.14);border-left:2px solid var(--sky);}
.rq-note .icon{font-family:var(--font-serif);font-style:italic;font-size:20px;line-height:1;color:var(--crimson);}
.rq-section.night .rq-note .icon{color:var(--sky);}
.rq-note strong{display:block;font-size:14px;margin-bottom:6px;}
.rq-note p{font-size:13.5px;line-height:1.65;color:var(--ink-soft);margin:0;}
.rq-section.night .rq-note p{color:rgba(255,255,255,.68);}
.rq-note + .rq-note{margin-top:14px;}

/* WHO */
.who-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
@media(max-width:820px){.who-grid{grid-template-columns:1fr;}}
.who-card{padding:clamp(22px,2.6vw,30px);background:var(--white);border-radius:4px;border:1px solid var(--line);}
.who-card .who-tag{display:inline-block;padding:4px 10px;border-radius:100px;background:var(--paper);font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--navy);margin-bottom:14px;}
.who-card p{font-size:14px;line-height:1.7;color:var(--ink-soft);}

/* DOC CHECKLIST */
.doc-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:0 40px;}
@media(max-width:820px){.doc-grid{grid-template-columns:1fr;}}
.doc-card{display:grid;grid-template-columns:30px 1fr;gap:14px;padding:18px 0;border-bottom:1px solid var(--line);align-items:start;}
.doc-card .tick{width:24px;height:24px;border:1px solid rgba(34,41,95,.3);border-radius:50%;display:grid;place-items:center;font-size:12px;color:var(--ink-soft);margin-top:2px;}
.doc-card strong{display:block;font-size:15px;margin-bottom:5px;}
.doc-card small{display:block;font-size:13px;line-height:1.55;color:var(--ink-soft);}

/* DEADLINE STRIP */
.dl-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
@media(max-width:980px){.dl-grid{grid-template-columns:1fr 1fr;}}
@media(max-width:560px){.dl-grid{grid-template-columns:1fr;}}
.dl-card{padding:22px;border-top:2px solid var(--crimson);background:var(--white);border-radius:0 0 4px 4px;}
.dl-card strong{display:block;font-size:16px;margin-bottom:8px;}
.dl-card p{font-size:13.5px;line-height:1.6;color:var(--ink-soft);}

/* NEXT ACTION CTA */
.rq-cta{background:var(--night);color:var(--white);padding:clamp(56px,8vw,96px) 0;position:relative;overflow:hidden;}
.rq-cta::before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px);background-size:60px 60px;pointer-events:none;}
.rq-cta .wrap{position:relative;z-index:1;display:grid;grid-template-columns:minmax(0,1.2fr) auto;gap:28px;align-items:center;}
@media(max-width:820px){.rq-cta .wrap{grid-template-columns:1fr;}}
.rq-cta h2{color:var(--white);margin-bottom:14px;}
.rq-cta .section-lead{margin-bottom:0;}
.rq-cta-actions{display:flex;gap:12px;flex-wrap:wrap;}
.rq-cta .adm-primary{background:var(--white);color:var(--navy);}
.rq-cta .adm-primary:hover{background:var(--crimson);color:var(--white);}
.rq-cta .adm-secondary{border:1px solid rgba(255,255,255,.3);background:transparent;color:var(--white);}
.rq-cta .adm-secondary:hover{border-color:var(--white);}
.adm-primary,.adm-secondary{display:inline-flex;align-items:center;justify-content:center;gap:12px;border-radius:100px;padding:15px 24px;font-size:14px;font-weight:700;transition:transform .3s var(--ease),background .3s var(--ease),color .3s var(--ease),border-color .3s var(--ease);}
.adm-primary:hover,.adm-secondary:hover{transform:translateY(-3px);}

/* RELATED */
.rq-related{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
@media(max-width:820px){.rq-related{grid-template-columns:1fr;}}
.rq-related a{display:grid;gap:6px;padding:22px;border:1px solid var(--line);border-radius:4px;background:var(--white);transition:transform .3s var(--ease),border-color .3s var(--ease);}
.rq-related a:hover{transform:translateY(-4px);border-color:var(--navy);}
.rq-related .num{font-family:var(--font-serif);font-style:italic;font-size:13px;color:var(--crimson);}
.rq-related strong{font-size:15px;}
.rq-related small{font-size:12.5px;color:var(--ink-soft);}

/* STATIC PROCESS GRID (path pages) */
.step-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;counter-reset:stage;}
@media(max-width:980px){.step-grid{grid-template-columns:1fr 1fr;}}
@media(max-width:560px){.step-grid{grid-template-columns:1fr;}}
.step-card{position:relative;padding:22px 20px 20px;background:var(--white);border:1px solid var(--line);border-radius:4px;}
.rq-section.paper .step-card{box-shadow:0 1px 0 var(--line);}
.step-card .n{font-family:var(--font-serif);font-style:italic;font-size:14px;color:var(--crimson);display:block;margin-bottom:10px;}
.step-card strong{display:block;font-size:14.5px;margin-bottom:7px;}
.step-card p{font-size:12.5px;line-height:1.6;color:var(--ink-soft);}
.step-card.route-note{border-left:2px solid var(--navy);background:var(--paper);}
.rq-section.paper .step-card.route-note{border-left-color:var(--crimson);}
</style>
<style id="aus-shared-chrome">
${chromeCss}
</style>
</head>
<body>
<script>document.documentElement.classList.add('js');</script>
${preloaderHtml}
${fixLocal(navHtml)}
${fixLocal(panelHtml)}
<div class="sub-nav">
  <div class="wrap sub-nav-inner">
    <nav class="sub-nav-crumbs" aria-label="Breadcrumb">
      <a href="${L('index.html')}">Home</a><span class="sep">/</span>
      <a href="${links.hub}">Admissions</a><span class="sep">/</span>
      <strong>${opts.crumb}</strong>
    </nav>
    <div class="sub-nav-actions">
      <a class="sub-btn sub-btn-ghost" href="${links.hub}">Admissions overview</a>
      <a class="sub-btn sub-btn-primary" href="${apply}">Apply now</a>
    </div>
  </div>
</div>
<main>
<header class="page-hero">
  <div class="wrap">
    <div class="eyebrow reveal">${opts.eyebrow}</div>
    <h1 class="reveal">${opts.h1}</h1>
    <p class="lead reveal">${opts.lead}</p>
  </div>
</header>
${opts.body}
${related}
<section class="rq-cta" data-chapter="N" data-chapter-label="Next Action">
  <div class="wrap">
    <div>
      <div class="chapter-label"><span class="num">&rarr;</span>Next Action</div>
      <h2>${opts.ctaTitle}</h2>
      <p class="section-lead">${opts.ctaText}</p>
    </div>
    <div class="rq-cta-actions">
      <a class="adm-primary" href="${apply}">Start your application <span aria-hidden="true">&rarr;</span></a>
      <a class="adm-secondary" href="${talk}">Talk to Admissions</a>
    </div>
  </div>
</section>
</main>
${fixLocal(footerHtml)}
${fixLocal(popupHtml)}
<script>
${fixLocal(chromeJs)}
</script>
<script>
(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    els.forEach(function(el){ el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, {threshold:.12});
    els.forEach(function(el){ io.observe(el); });
  }
})();
</script>
</body>
</html>`;
}

/* =====================================================================
 * 4. SHARED SECTIONS
 * ===================================================================== */
const deadlinesSection = (fees) => `
<section class="rq-section paper" data-chapter="05" data-chapter-label="Deadlines">
  <div class="wrap">
    <div class="chapter-label"><span class="num">05</span>Deadlines</div>
    <h2>Rolling review,<br><em>three intakes.</em></h2>
    <p class="section-lead">AUS operates rolling admissions: applications are reviewed and decisions made continuously throughout the year. Exact application deadlines per intake are published by AUS.</p>
    <div class="dl-grid">
      <div class="dl-card"><strong>January intake</strong><p>Prepare early if you need immigration processing or certified translations.</p></div>
      <div class="dl-card"><strong>April intake</strong><p>Availability depends on your chosen program and the academic calendar.</p></div>
      <div class="dl-card"><strong>September intake</strong><p>Your Offer Letter states the next available term unless you request another.</p></div>
      <div class="dl-card"><strong>Acceptance window</strong><p>After a positive decision, return the signed Offer Letter, signed Student Agreement, and Admission Fee proof within 10 calendar days.</p></div>
    </div>
    ${fees ? `
    <div class="rq-grid" style="margin-top:16px;">
      <div class="rq-card"><strong>Application Fee — CHF 250</strong><p>Due when applying. Non-refundable. Waivers are considered under special circumstances on a case-by-case basis via study@aus.swiss.</p></div>
      <div class="rq-card"><strong>Admission Fee — CHF 1,500</strong><p>Confirms your place, due within 10 days of the Offer Letter. Non-refundable. Tuition follows the schedule in your Offer Letter.</p></div>
    </div>` : ''}
  </div>
</section>`;

const docsSection = (extra) => `
<section class="rq-section" data-chapter="04" data-chapter-label="Required Documents">
  <div class="wrap">
    <div class="chapter-label"><span class="num">04</span>Required Documents</div>
    <h2>The complete file,<br><em>item by item.</em></h2>
    <p class="section-lead">Documents issued in a language other than English must be accompanied by notarized English translations, arranged at your own expense, before the application can be reviewed as complete.</p>
    <div class="doc-grid">
      <div class="doc-card"><span class="tick">&#10003;</span><span><strong>Completed AUS application form</strong><small>Online via the AUS application form, by email, or by post.</small></span></div>
      <div class="doc-card"><span class="tick">&#10003;</span><span><strong>Passport or Swiss National ID</strong><small>Clear copy of a valid identity document.</small></span></div>
      <div class="doc-card"><span class="tick">&#10003;</span><span><strong>Official academic records</strong><small>Transcripts, diplomas, and certificates from your completed institution.</small></span></div>
      <div class="doc-card"><span class="tick">&#10003;</span><span><strong>Motivation letter</strong><small>About 500 words on your development, goals, and motivation for AUS.</small></span></div>
      <div class="doc-card"><span class="tick">&#10003;</span><span><strong>Two recommendation letters</strong><small>From instructors or employers familiar with your past performance.</small></span></div>
      <div class="doc-card"><span class="tick">&#10003;</span><span><strong>Notarized English translations</strong><small>For any records issued in another language.</small></span></div>
      ${extra || ''}
    </div>
  </div>
</section>`;

/* ---------- Route-specific process grid for the four path pages ---------- */
const routeSteps = (routeNote, routeStage) => `
<section class="rq-section paper" data-chapter="02" data-chapter-label="The Process">
  <div class="wrap">
    <div class="chapter-label"><span class="num">02</span>The Process</div>
    <h2>Your route through<br><em>the eight stages.</em></h2>
    <p class="section-lead">The process is the same for every applicant — only the requirements change. Where your route touches a stage differently, it is called out.</p>
    <div class="step-grid">
      <div class="step-card"><span class="n">01</span><strong>Choose your program</strong><p>Pick the program that matches your goals — three intakes per year.</p></div>
      <div class="step-card"><span class="n">02</span><strong>Check requirements</strong><p>Confirm you meet this route's academic and English criteria.</p></div>
      <div class="step-card"><span class="n">03</span><strong>Prepare documents</strong><p>Application form, ID, records, motivation letter, two references.</p></div>
      <div class="step-card"><span class="n">04</span><strong>Submit application</strong><p>Online, by email, or by post — with the CHF 250 Application Fee.</p></div>
      <div class="step-card"><span class="n">05</span><strong>Admissions review</strong><p>Completeness check, eligibility assessment, then your online interview.</p></div>
      <div class="step-card"><span class="n">06</span><strong>Receive decision</strong><p>Unconditional, conditional, deferred, or rejected — with next steps.</p></div>
      <div class="step-card"><span class="n">07</span><strong>Complete enrollment</strong><p>Sign the Offer Letter and Student Agreement; pay the CHF 1,500 fee.</p></div>
      <div class="step-card"><span class="n">08</span><strong>Visa and arrival</strong><p>Where applicable — the Swiss visa route runs after your Acceptance Letter.</p></div>
      <div class="step-card route-note"><span class="n">Your route</span><strong>${routeStage}</strong><p>${routeNote}</p></div>
    </div>
  </div>
</section>`;

/* =====================================================================
 * 5. PAGE DEFINITIONS
 * ===================================================================== */
const pages = [
/* ---------------- BACHELOR'S ADMISSIONS (path) ---------------- */
{
  file: 'admissions/bachelors.html',
  title: "Bachelor's Admissions",
  crumb: "Bachelor's Admissions",
  desc: "The complete bachelor's admissions route at AUS: process, requirements, documents, and deadlines.",
  eyebrow: "Admissions · Bachelor's",
  h1: 'Bachelor\u2019s <em>admissions.</em>',
  lead: 'Everything the bachelor\u2019s route asks of you, stage by stage — from choosing a program to arriving on campus.',
  related: [
    { key: 'breq', num: '01', label: "Bachelor's Requirements", note: 'Full academic and language criteria' },
    { key: 'ereq', num: '02', label: 'English Requirements', note: 'Every accepted test and score' },
    { key: 'treq', num: '03', label: 'Transfer Requirements', note: 'Bring credits from previous study' }
  ],
  ctaTitle: 'Start the bachelor\u2019s route.',
  ctaText: 'Apply online in under an hour, or talk to Admissions first about eligibility, transfer credit, or your intakes.',
  body: `
<section class="rq-section" data-chapter="01" data-chapter-label="Who This Applies To">
  <div class="wrap">
    <div class="chapter-label"><span class="num">01</span>Who This Applies To</div>
    <h2>Entering a three-year<br><em>bachelor's degree.</em></h2>
    <p class="section-lead">This route is for applicants entering an AUS bachelor's program after secondary school — from Switzerland or abroad, including IB graduates and transfer students.</p>
    <div class="who-grid">
      <div class="who-card"><span class="who-tag">Swiss route</span><p>Maturity, Professional Maturity, or Specialized Maturity with Passerelle.</p></div>
      <div class="who-card"><span class="who-tag">International route</span><p>A foreign school-leaving certificate assessed as equivalent to the Swiss Maturity.</p></div>
      <div class="who-card"><span class="who-tag">With credits</span><p>Transfer students and JST holders enter through the same route, with credit review.</p></div>
    </div>
  </div>
</section>
${routeSteps('Your secondary records determine undergraduate eligibility. If you transfer more than 60 ECTS, the decision is based on your higher-education records instead.', 'Secondary records lead')}
<section class="rq-section" data-chapter="03" data-chapter-label="Requirements at a Glance">
  <div class="wrap">
    <div class="chapter-label"><span class="num">03</span>Requirements at a Glance</div>
    <h2>The shortlist<br><em>before you apply.</em></h2>
    <div class="rq-grid">
      <div class="rq-card"><strong>Academic</strong><p>A Swiss Maturity, a Professional or Specialized Maturity with Passerelle (plus the SERI examination), an IB program, or an equivalent foreign certificate.</p></div>
      <div class="rq-card"><strong>Language</strong><p>English proficiency at B2 level — IELTS 5.5, Cambridge FCE, Pearson 50, CEFR B2, and more.</p></div>
      <div class="rq-card"><strong>Documents</strong><p>Application form, passport/ID, official records, ~500-word motivation letter, two recommendation letters, notarized translations where needed.</p></div>
      <div class="rq-card"><strong>Fees</strong><p>CHF 250 Application Fee when applying; CHF 1,500 Admission Fee within 10 days of the Offer Letter.</p></div>
    </div>
    <div style="margin-top:22px;" class="rq-note"><span class="icon">&rarr;</span><span><strong>Full criteria</strong><p>Every qualification, every score, and the equivalency rules are on the Bachelor's Requirements page.</p></span></div>
  </div>
</section>
${deadlinesSection(true)}
` },
/* ---------------- MASTER'S ADMISSIONS (path) ---------------- */
{
  file: 'admissions/masters.html',
  title: "Master's Admissions",
  crumb: "Master's Admissions",
  desc: "The complete master's admissions route at AUS: process, requirements, documents, and deadlines.",
  eyebrow: "Admissions · Master's",
  h1: 'Master\u2019s <em>admissions.</em>',
  lead: 'One year, nine specializations, a dual degree with Tiffin University — here is the route from application to enrollment.',
  related: [
    { key: 'mreq', num: '01', label: "Master's Requirements", note: 'Full academic and language criteria' },
    { key: 'ereq', num: '02', label: 'English Requirements', note: 'Every accepted test and score' },
    { key: 'treq', num: '03', label: 'Transfer Requirements', note: 'Bring credits from previous study' }
  ],
  ctaTitle: 'Start the master\u2019s route.',
  ctaText: 'Apply online, or talk to Admissions about which specialization fits your career — AUS alumni may have steps waived.',
  body: `
<section class="rq-section" data-chapter="01" data-chapter-label="Who This Applies To">
  <div class="wrap">
    <div class="chapter-label"><span class="num">01</span>Who This Applies To</div>
    <h2>Applying to a one-year<br><em>master's program.</em></h2>
    <p class="section-lead">This route is for degree-holders applying to any AUS master's specialization — recent graduates, working professionals, and AUS alumni continuing directly.</p>
    <div class="who-grid">
      <div class="who-card"><span class="who-tag">Recent graduates</span><p>Applying directly after completing a bachelor's degree.</p></div>
      <div class="who-card"><span class="who-tag">Professionals</span><p>Adding a specialization while remaining in work.</p></div>
      <div class="who-card"><span class="who-tag">AUS alumni</span><p>May have the interview or references waived by the committee.</p></div>
    </div>
  </div>
</section>
${routeSteps('Your application is also assessed against the specific admission requirements of educational partner Tiffin University, which awards the second degree of the dual-degree pathway.', 'Tiffin dual-degree track')}
<section class="rq-section" data-chapter="03" data-chapter-label="Requirements at a Glance">
  <div class="wrap">
    <div class="chapter-label"><span class="num">03</span>Requirements at a Glance</div>
    <h2>The shortlist<br><em>before you apply.</em></h2>
    <div class="rq-grid">
      <div class="rq-card"><strong>Academic</strong><p>A bachelor's degree from a recognized or accredited university or higher education institution.</p></div>
      <div class="rq-card"><strong>Language</strong><p>English proficiency per your program — typically IELTS 6.0 with no element below 5.5.</p></div>
      <div class="rq-card"><strong>Documents</strong><p>Application form, passport/ID, degree records, motivation letter, two references, notarized translations where needed.</p></div>
      <div class="rq-card"><strong>Fees</strong><p>CHF 250 Application Fee when applying; CHF 1,500 Admission Fee within 10 days of the Offer Letter.</p></div>
    </div>
    <div style="margin-top:22px;" class="rq-note"><span class="icon">&rarr;</span><span><strong>Full criteria</strong><p>Partner requirements, the alumni waiver, and language levels are detailed on the Master's Requirements page.</p></span></div>
  </div>
</section>
${deadlinesSection(true)}
` },
/* ---------------- DOCTORAL ADMISSIONS (path) ---------------- */
{
  file: 'admissions/doctoral.html',
  title: 'Doctoral Admissions',
  crumb: 'Doctoral Admissions',
  desc: 'The doctoral (DBA) admissions route at AUS: process, criteria, documents, and deadlines.',
  eyebrow: 'Admissions · Doctoral',
  h1: 'Doctoral <em>admissions.</em>',
  lead: 'The Doctorate in Business Administration admits senior professionals on academic record, professional maturity, and research fit. Here is the route.',
  related: [
    { key: 'dreq', num: '01', label: 'Doctoral Requirements', note: 'Full criteria and committee review' },
    { key: 'ereq', num: '02', label: 'English Requirements', note: 'Accepted tests and scores' },
    { key: 'ireq', num: '03', label: 'International Requirements', note: 'Visa route if coming from abroad' }
  ],
  ctaTitle: 'Start the doctoral route.',
  ctaText: 'Doctoral candidates are encouraged to talk to Admissions before applying, so research interests can be matched with supervision capacity early.',
  body: `
<section class="rq-section" data-chapter="01" data-chapter-label="Who This Applies To">
  <div class="wrap">
    <div class="chapter-label"><span class="num">01</span>Who This Applies To</div>
    <h2>Senior professionals<br><em>pursuing the DBA.</em></h2>
    <p class="section-lead">This route is for experienced leaders and practitioners applying to the Doctorate in Business Administration while remaining in active professional life.</p>
    <div class="who-grid">
      <div class="who-card"><span class="who-tag">Executives</span><p>Leaders contributing original research from inside their organizations.</p></div>
      <div class="who-card"><span class="who-tag">Consultants</span><p>Practitioners grounding client work in original research.</p></div>
      <div class="who-card"><span class="who-tag">Career researchers</span><p>Professionals moving toward faculty or advisory roles.</p></div>
    </div>
  </div>
</section>
${routeSteps('Your research interest is matched with AUS faculty supervision capacity during the Admissions Interview — come prepared to discuss the problem you want to study.', 'Research fit interview')}
<section class="rq-section" data-chapter="03" data-chapter-label="Requirements at a Glance">
  <div class="wrap">
    <div class="chapter-label"><span class="num">03</span>Requirements at a Glance</div>
    <h2>The shortlist<br><em>before you apply.</em></h2>
    <div class="rq-grid">
      <div class="rq-card"><strong>Academic</strong><p>A recognized master's degree (or equivalent) from an accredited institution.</p></div>
      <div class="rq-card"><strong>Professional</strong><p>A substantial management or leadership track record — the DBA weighs it heavily.</p></div>
      <div class="rq-card"><strong>Research</strong><p>A preliminary research interest aligned with faculty supervision capacity.</p></div>
      <div class="rq-card"><strong>Language &amp; fees</strong><p>English evidence per the accepted list; CHF 250 Application Fee and CHF 1,500 Admission Fee.</p></div>
    </div>
    <div style="margin-top:22px;" class="rq-note"><span class="icon">&rarr;</span><span><strong>Full criteria</strong><p>The committee's review basis and cohort-specific notes are on the Doctoral Requirements page.</p></span></div>
  </div>
</section>
${deadlinesSection(true)}
` },
/* ---------------- INTERNATIONAL ADMISSIONS (path) ---------------- */
{
  file: 'admissions/international.html',
  title: 'International Admissions',
  crumb: 'International Admissions',
  desc: 'The international admissions route at AUS: equivalency, visa, funds, and arrival — by applicant type.',
  eyebrow: 'Admissions · International',
  h1: 'International <em>admissions.</em>',
  lead: 'Coming from abroad follows the standard process plus three extras: certificate equivalency, proof of funds, and the Swiss visa route. Here is how they fit together.',
  related: [
    { key: 'ireq', num: '01', label: 'International Requirements', note: 'Equivalency, funds, and visa detail' },
    { key: 'ereq', num: '02', label: 'English Requirements', note: 'Admission list and the visa list' },
    { key: 'breq', num: '03', label: "Bachelor's Requirements", note: 'If entering an undergraduate program' }
  ],
  ctaTitle: 'Start the international route.',
  ctaText: 'Apply as soon as your documents are ready — visa timelines vary by country, and Student Recruitment supports you through every immigration step after admission.',
  body: `
<section class="rq-section" data-chapter="01" data-chapter-label="Who This Applies To">
  <div class="wrap">
    <div class="chapter-label"><span class="num">01</span>Who This Applies To</div>
    <h2>Applicants joining<br><em>from abroad.</em></h2>
    <p class="section-lead">This route applies to applicants who completed their previous education outside Switzerland and who may need a Swiss student visa or residence permit.</p>
    <div class="who-grid">
      <div class="who-card"><span class="who-tag">EU / EFTA</span><p>No visa required. Local registration after arrival; health insurance required.</p></div>
      <div class="who-card"><span class="who-tag">Non-EU / EFTA</span><p>Student visa from the Swiss embassy or consulate in your home country.</p></div>
      <div class="who-card"><span class="who-tag">Any level</span><p>Bachelor's, master's, and doctoral applicants all follow this route.</p></div>
    </div>
  </div>
</section>
${routeSteps('The official visa application can only be submitted after you receive the AUS Acceptance Letter — so finish the admissions stages first, then start the embassy process with Student Recruitment supporting you.', 'Visa after acceptance')}
<section class="rq-section" data-chapter="03" data-chapter-label="Requirements at a Glance">
  <div class="wrap">
    <div class="chapter-label"><span class="num">03</span>Requirements at a Glance</div>
    <h2>The shortlist<br><em>before you apply.</em></h2>
    <div class="rq-grid">
      <div class="rq-card"><strong>Equivalency</strong><p>Your certificate is assessed against the CRUS recommendations and the Lisbon Recognition Convention.</p></div>
      <div class="rq-card"><strong>Language</strong><p>Two lists apply: one for admission, a separate one for the Swiss student visa.</p></div>
      <div class="rq-card"><strong>Funds</strong><p>At least CHF 25,000 in the student account for subsistence, shown to the Swiss authorities.</p></div>
      <div class="rq-card"><strong>Translations</strong><p>Notarized English translations of all records issued in another language, at your expense.</p></div>
    </div>
    <div style="margin-top:22px;" class="rq-note"><span class="icon">&rarr;</span><span><strong>Full detail</strong><p>The visa document split — what AUS provides, what you provide, what you submit — is on the International Requirements page.</p></span></div>
  </div>
</section>
${deadlinesSection(false)}
` },
/* ---------------- BACHELOR'S REQUIREMENTS ---------------- */
{
  file: 'admissions/bachelors-requirements.html',
  title: "Bachelor's Requirements",
  crumb: "Bachelor's Requirements",
  desc: "Academic, document, language, and deadline requirements for bachelor's admissions at AUS.",
  eyebrow: "Admissions · Bachelor's",
  h1: 'Bachelor&rsquo;s <em>requirements.</em>',
  lead: 'Who these rules apply to, what you need academically, which documents to prepare, and what to do next — all in one page.',
  related: [
    { key: 'ereq', num: '01', label: 'English Requirements', note: 'Every accepted test and minimum score' },
    { key: 'treq', num: '02', label: 'Transfer Requirements', note: 'Already have university credits?' },
    { key: 'ireq', num: '03', label: 'International Requirements', note: 'Applying from outside Switzerland' }
  ],
  ctaTitle: 'Eligible? <em>Then apply.</em>',
  ctaText: 'If your certificate and English level meet the criteria above, the fastest next step is to start the application — Student Recruitment will confirm completeness and guide the next stages.',
  body: `
<section class="rq-section" data-chapter="01" data-chapter-label="Who This Applies To">
  <div class="wrap">
    <div class="chapter-label"><span class="num">01</span>Who This Applies To</div>
    <h2>Applicants entering<br><em>a bachelor's degree.</em></h2>
    <p class="section-lead">These requirements apply to all applicants to AUS three-year bachelor's programs — Swiss applicants, international applicants, and IB graduates.</p>
    <div class="who-grid">
      <div class="who-card"><span class="who-tag">Swiss applicants</span><p>Applicants holding a Swiss Maturity, Professional Maturity, or Specialized Maturity certificate.</p></div>
      <div class="who-card"><span class="who-tag">International applicants</span><p>Applicants presenting a foreign upper secondary school-leaving certificate considered equivalent to the Swiss Maturity.</p></div>
      <div class="who-card"><span class="who-tag">IB graduates</span><p>International Baccalaureate Diploma Programme, Diploma Courses, and Career-related Programme applicants, assessed case by case.</p></div>
    </div>
  </div>
</section>
<section class="rq-section paper" data-chapter="02" data-chapter-label="Academic Requirements">
  <div class="wrap">
    <div class="chapter-label"><span class="num">02</span>Academic Requirements</div>
    <h2>One of these<br><em>qualifications.</em></h2>
    <p class="section-lead">To be considered for admission to a bachelor's degree, candidates must hold one of the following.</p>
    <ul class="rq-list">
      <li>Swiss Maturity Certificate (Maturit&auml;t, Matura)</li>
      <li>Swiss Professional Maturity Certificate (Maturit&eacute; professionnelle) with &ldquo;Passerelle&rdquo;<small>A complementary examination via SERI is required before admission.</small></li>
      <li>Swiss Specialized Maturity Certificate (Maturit&eacute; sp&eacute;cialis&eacute;e) recognized throughout Switzerland, with &ldquo;Passerelle&rdquo;<small>A complementary examination via SERI is required before admission.</small></li>
      <li>Foreign upper secondary school-leaving certificate considered equivalent<small>Assessed against the CRUS recommendations and the Lisbon Recognition Convention: substantial correspondence to the Swiss Maturity in subjects, hours, and length of schooling.</small></li>
      <li>International Baccalaureate (IB)<small>DP, Diploma Programme Courses, and Career-related Programme are considered on a case-by-case basis by the Admissions Committee.</small></li>
    </ul>
    <div style="margin-top:26px;" class="rq-note"><span class="icon">i.</span><span><strong>Swiss Professional &amp; Specialized Maturity routes</strong><p>Candidates with a Swiss Professional or Specialized Maturity must undergo a complementary examination to be eligible. Contact the State Secretariat for Education, Research and Innovation (SERI), which is responsible for the examination.</p></span></div>
  </div>
</section>
<section class="rq-section night" data-chapter="03" data-chapter-label="Language Requirements">
  <div class="wrap">
    <div class="chapter-label"><span class="num">03</span>Language Requirements</div>
    <h2>English,<br><em>at B2 level.</em></h2>
    <p class="section-lead">Applicants whose native language is not English and whose secondary instruction was not in English must provide proof of proficiency. All submitted exam results must be no older than two years.</p>
    <div style="overflow-x:auto;">
    <table class="score-table">
      <thead><tr><th>Test</th><th>Minimum score</th><th>Notes</th></tr></thead>
      <tbody>
        <tr><td class="test-name">CEFR English Level Test</td><td class="test-score">B2</td><td>English level test</td></tr>
        <tr><td class="test-name">IELTS</td><td class="test-score">5.5</td><td>No single element below 4.5</td></tr>
        <tr><td class="test-name">Cambridge Exams</td><td class="test-score">FCE</td><td>Minimum First</td></tr>
        <tr><td class="test-name">Pearson PTE Academic</td><td class="test-score">50</td><td>Listening 47, Reading 47, Speaking 47, Writing 50</td></tr>
        <tr><td class="test-name">NCUK</td><td class="test-score">5.5</td><td>Minimum overall</td></tr>
        <tr><td class="test-name">SAT</td><td class="test-score">1000</td><td>For BSBA applicants graduating from an American high school only</td></tr>
        <tr><td class="test-name">Michigan ECPE</td><td class="test-score">Pass</td><td>Certificate of Proficiency in English</td></tr>
        <tr><td class="test-name">Michigan MELAB</td><td class="test-score">80%</td><td>English Language Assessments Battery</td></tr>
      </tbody>
    </table>
    </div>
    <div style="margin-top:22px;" class="rq-note"><span class="icon">&rarr;</span><span><strong>Full test list and visa scores</strong><p>The list is not exhaustive, and other assessments — including the Admissions Interview — may be considered case by case. See the English requirements page for TOEFL scores and the separate Swiss visa list.</p></span></div>
  </div>
</section>
${docsSection()}
${deadlinesSection(true)}
` },
/* ---------------- MASTER'S REQUIREMENTS ---------------- */
{
  file: 'admissions/masters-requirements.html',
  title: "Master's Requirements",
  crumb: "Master's Requirements",
  desc: "Academic, document, language, and deadline requirements for master's admissions at AUS.",
  eyebrow: "Admissions · Master's",
  h1: 'Master&rsquo;s <em>requirements.</em>',
  lead: 'What a recognized bachelor&rsquo;s degree, English evidence, and the Tiffin University partnership mean for your application.',
  related: [
    { key: 'ereq', num: '01', label: 'English Requirements', note: 'Every accepted test and minimum score' },
    { key: 'treq', num: '02', label: 'Transfer Requirements', note: 'Count previous study toward your degree' },
    { key: 'ireq', num: '03', label: 'International Requirements', note: 'Visa route, funds, and equivalency' }
  ],
  ctaTitle: 'Ready with your degree? <em>Apply.</em>',
  ctaText: 'If you hold a recognized bachelor&rsquo;s degree and meet the English evidence, start the application — the Admissions Interview is scheduled only after the eligibility review.',
  body: `
<section class="rq-section" data-chapter="01" data-chapter-label="Who This Applies To">
  <div class="wrap">
    <div class="chapter-label"><span class="num">01</span>Who This Applies To</div>
    <h2>Applicants entering<br><em>a master's degree.</em></h2>
    <p class="section-lead">These requirements apply to all applicants to AUS one-year master's programs, whether you studied in Switzerland or abroad.</p>
    <div class="who-grid">
      <div class="who-card"><span class="who-tag">Recent graduates</span><p>Holders of a bachelor's degree applying directly to a one-year master's program.</p></div>
      <div class="who-card"><span class="who-tag">Working professionals</span><p>Degree-holders adding a specialization while remaining in their careers.</p></div>
      <div class="who-card"><span class="who-tag">AUS alumni</span><p>AUS bachelor's graduates may have certain steps of the process waived by the Admissions Committee.</p></div>
    </div>
  </div>
</section>
<section class="rq-section paper" data-chapter="02" data-chapter-label="Academic Requirements">
  <div class="wrap">
    <div class="chapter-label"><span class="num">02</span>Academic Requirements</div>
    <h2>A recognized<br><em>bachelor's degree.</em></h2>
    <ul class="rq-list">
      <li>A bachelor's degree from a university or other higher education institution, or an equivalent foreign higher education institution recognized or accredited in the country of origin</li>
      <li>Students are subject to the specific admission requirements of AUS educational partner Tiffin University<small>Tiffin University is accredited by the Higher Learning Commission in the United States and awards the second degree of the dual-degree pathway.</small></li>
    </ul>
    <div style="margin-top:26px;" class="rq-note"><span class="icon">i.</span><span><strong>AUS alumni shortcut</strong><p>Candidates applying for a master's degree after completing an AUS bachelor's degree may have certain steps of the application process waived by the Admissions Committee, such as the interview or reference letters.</p></span></div>
  </div>
</section>
${docsSection()}
<section class="rq-section night" data-chapter="03" data-chapter-label="Language Requirements">
  <div class="wrap">
    <div class="chapter-label"><span class="num">03</span>Language Requirements</div>
    <h2>English at the level<br><em>the program demands.</em></h2>
    <p class="section-lead">Applicants whose native language is not English and whose previous instruction was not in English must evidence proficiency. Each master's program page states its exact level — typically IELTS 6.0 with no single element below 5.5.</p>
    <div class="rq-grid">
      <div class="rq-card"><strong>Program pages</strong><p>Each master's program page states its IELTS requirement alongside the curriculum and outcomes.</p></div>
      <div class="rq-card"><strong>Accepted evidence</strong><p>CEFR, IELTS, TOEFL, Cambridge, NCUK, Pearson PTE, Duolingo, and more. Results must be no older than two years.</p></div>
    </div>
    <div style="margin-top:22px;" class="rq-note"><span class="icon">&rarr;</span><span><strong>English requirements page</strong><p>Every accepted test and minimum score, including the visa-specific list, on one page.</p></span></div>
  </div>
</section>
${deadlinesSection(true)}
` },
/* ---------------- DOCTORAL REQUIREMENTS ---------------- */
{
  file: 'admissions/doctoral-requirements.html',
  title: 'Doctoral Requirements',
  crumb: 'Doctoral Requirements',
  desc: 'Requirements for doctoral (DBA) admissions at AUS: degree, professional record, English, and research alignment.',
  eyebrow: 'Admissions · Doctoral',
  h1: 'Doctoral <em>requirements.</em>',
  lead: 'The Doctorate in Business Administration is built for senior professionals. Here is what the Admissions Committee looks for and how the review works.',
  related: [
    { key: 'mreq', num: '01', label: "Master's Requirements", note: 'The standard graduate route' },
    { key: 'ereq', num: '02', label: 'English Requirements', note: 'Accepted tests and minimum scores' },
    { key: 'ireq', num: '03', label: 'International Requirements', note: 'Visa route, funds, and equivalency' }
  ],
  ctaTitle: 'Ready to contribute <em>new knowledge?</em>',
  ctaText: 'Doctoral applications are assessed on professional record and research fit as much as on grades. Talk to Admissions before applying to align your research interest with supervision capacity.',
  body: `
<section class="rq-section" data-chapter="01" data-chapter-label="Who This Applies To">
  <div class="wrap">
    <div class="chapter-label"><span class="num">01</span>Who This Applies To</div>
    <h2>Senior professionals<br><em>pursuing a DBA.</em></h2>
    <p class="section-lead">These requirements apply to applicants to the Doctorate in Business Administration, designed for leaders who want to contribute original research to their field while remaining in active professional life.</p>
    <div class="who-grid">
      <div class="who-card"><span class="who-tag">Executives</span><p>Senior leaders who want to contribute new knowledge to their field while remaining in active professional life.</p></div>
      <div class="who-card"><span class="who-tag">Consultants</span><p>Practitioners whose client work could benefit from original, practice-grounded research.</p></div>
      <div class="who-card"><span class="who-tag">Career researchers</span><p>Professionals targeting faculty, advisory, or thought-leadership roles.</p></div>
    </div>
  </div>
</section>
<section class="rq-section paper" data-chapter="02" data-chapter-label="Academic Requirements">
  <div class="wrap">
    <div class="chapter-label"><span class="num">02</span>Academic Requirements</div>
    <h2>What the committee<br><em>looks for.</em></h2>
    <ul class="rq-list">
      <li>A recognized master's degree (or equivalent) from an accredited institution</li>
      <li>A substantial professional track record in management or leadership<small>The DBA admits on professional maturity as much as on academic history.</small></li>
      <li>A preliminary research interest aligned with AUS faculty supervision capacity<small>Confirmed during the Admissions Interview.</small></li>
      <li>Evidence of sufficient English proficiency</li>
      <li>A completed AUS application with the standard document file</li>
    </ul>
    <div style="margin-top:26px;" class="rq-note"><span class="icon">i.</span><span><strong>Confirm the current criteria</strong><p>Doctoral eligibility is confirmed by the Admissions Committee under the Policy and Procedures for Admissions. Requirements specific to your cohort may apply — confirm with Admissions before submitting.</p></span></div>
  </div>
</section>
${docsSection()}
<section class="rq-section night" data-chapter="03" data-chapter-label="Language Requirements">
  <div class="wrap">
    <div class="chapter-label"><span class="num">03</span>Language Requirements</div>
    <h2>English for research<br><em>and supervision.</em></h2>
    <p class="section-lead">The DBA is taught and supervised entirely in English. Applicants whose native language is not English and whose previous instruction was not in English must evidence proficiency; the Admissions Interview also assesses academic English in practice.</p>
    <div class="rq-grid">
      <div class="rq-card"><strong>Standard evidence</strong><p>Any test on the AUS accepted list at the level stated for graduate admission — results no older than two years.</p></div>
      <div class="rq-card"><strong>Interview assessment</strong><p>Clarity of thought, critical thinking, and English expression are also assessed live during the Admissions Interview.</p></div>
    </div>
  </div>
</section>
${deadlinesSection(true)}
` },
/* ---------------- INTERNATIONAL REQUIREMENTS ---------------- */
{
  file: 'admissions/international-requirements.html',
  title: 'International Requirements',
  crumb: 'International Requirements',
  desc: 'For applicants joining AUS from abroad: equivalency, documents, visa route, proof of funds, and arrival.',
  eyebrow: 'Admissions · International',
  h1: 'International <em>requirements.</em>',
  lead: 'Applying from outside Switzerland adds three elements to the standard file: certificate equivalency, proof of funds, and the Swiss student visa route.',
  related: [
    { key: 'ereq', num: '01', label: 'English Requirements', note: 'Admission list and the separate visa list' },
    { key: 'breq', num: '02', label: "Bachelor's Requirements", note: 'Undergraduate academic criteria' },
    { key: 'mreq', num: '03', label: "Master's Requirements", note: 'Graduate academic criteria' }
  ],
  ctaTitle: 'Coming from abroad? <em>Start early.</em>',
  ctaText: 'Visa processing times vary by country. Begin your application as soon as your documents are ready — Student Recruitment supports you through the immigration steps after admission.',
  body: `
<section class="rq-section" data-chapter="01" data-chapter-label="Who This Applies To">
  <div class="wrap">
    <div class="chapter-label"><span class="num">01</span>Who This Applies To</div>
    <h2>Applicants joining<br><em>from abroad.</em></h2>
    <p class="section-lead">These requirements apply to applicants who completed their previous education outside Switzerland and who may require a Swiss student visa or residence permit.</p>
    <div class="who-grid">
      <div class="who-card"><span class="who-tag">EU / EFTA</span><p>No visa required to study in Switzerland. Local registration and residence formalities apply after arrival.</p></div>
      <div class="who-card"><span class="who-tag">Non-EU / EFTA</span><p>A student visa from the Swiss embassy or consulate in your home country is required before arrival.</p></div>
      <div class="who-card"><span class="who-tag">All international files</span><p>Notarized English translations of any records issued in another language, arranged at your own expense.</p></div>
    </div>
  </div>
</section>
<section class="rq-section paper" data-chapter="02" data-chapter-label="Academic Requirements">
  <div class="wrap">
    <div class="chapter-label"><span class="num">02</span>Academic Requirements</div>
    <h2>Your certificate,<br><em>read in context.</em></h2>
    <ul class="rq-list">
      <li>A foreign upper secondary school-leaving certificate considered equivalent to the Swiss Maturity Certificate (bachelor's admission)</li>
      <li>Or a recognized or accredited foreign bachelor's degree (master's admission)</li>
      <li>Assessment basis: the CRUS recommendations and the Lisbon Recognition Convention (ETS No. 165)<small>The certificate should correspond substantially to the Swiss Maturity in school subjects, number of hours, and length of schooling.</small></li>
      <li>Notarized English translations of all records issued in another language, at your own expense, before submission</li>
    </ul>
  </div>
</section>
${docsSection(`<div class="doc-card"><span class="tick">&#10003;</span><span><strong>Curriculum Vitae (visa file)</strong><small>Required by the Swiss authorities as part of the visa application.</small></span></div>
      <div class="doc-card"><span class="tick">&#10003;</span><span><strong>Proof of sufficient funds</strong><small>Minimum CHF 25,000 in the student account for subsistence expenses, shown to the Swiss authorities.</small></span></div>`)}
<section class="rq-section night" data-chapter="03" data-chapter-label="Language Requirements">
  <div class="wrap">
    <div class="chapter-label"><span class="num">03</span>Language Requirements</div>
    <h2>Two lists:<br><em>admission and visa.</em></h2>
    <p class="section-lead">Admission and the Swiss student visa each have an accepted-tests list. The Swiss visa is granted to students whose secondary instruction was in English, or who provide proof through the visa list — results no older than two years.</p>
    <div style="overflow-x:auto;">
    <table class="score-table">
      <thead><tr><th>Test (visa list)</th><th>Minimum score</th><th>Notes</th></tr></thead>
      <tbody>
        <tr><td class="test-name">CEFR English Level Test</td><td class="test-score">B2</td><td>English level test</td></tr>
        <tr><td class="test-name">IELTS</td><td class="test-score">5.5</td><td>No single element below 4.5</td></tr>
        <tr><td class="test-name">TOEFL iBT / Home Edition</td><td class="test-score">72&ndash;94</td><td>Reading 18, Listening 17, Speaking 20, Writing 17</td></tr>
        <tr><td class="test-name">Cambridge Exams</td><td class="test-score">FCE</td><td>Minimum First</td></tr>
        <tr><td class="test-name">NCUK</td><td class="test-score">5.5</td><td>Minimum overall</td></tr>
        <tr><td class="test-name">Duolingo English Test</td><td class="test-score">95</td><td>Minimum overall</td></tr>
      </tbody>
    </table>
    </div>
    <div style="margin-top:22px;" class="rq-note"><span class="icon">&rarr;</span><span><strong>Admission language list</strong><p>For the full admission list — including SAT, ECPE, MELAB, and McGraw-Hill — see the English requirements page.</p></span></div>
  </div>
</section>
<section class="rq-section" data-chapter="04" data-chapter-label="Visa &amp; Funds">
  <div class="wrap">
    <div class="chapter-label"><span class="num">04</span>Visa &amp; Funds</div>
    <h2>After admission,<br><em>the visa route.</em></h2>
    <p class="section-lead">An official application to the Swiss authorities can only be submitted after you complete the admissions process and receive the Acceptance Letter from AUS.</p>
    <div class="rq-grid">
      <div class="rq-card"><strong>AUS provides</strong><p>The Visa Application support, Acceptance Letter, Study Plan, and Written Undertaking for your embassy or consulate application.</p></div>
      <div class="rq-card"><strong>You provide</strong><p>Your CV, proof of language proficiency, and proof of sufficient funds — at least CHF 25,000 for subsistence, or an escrow deposit if required.</p></div>
      <div class="rq-card"><strong>You submit</strong><p>The complete visa application in your country of residence, including scheduling the embassy appointment. Approval rests solely with the Swiss authorities.</p></div>
      <div class="rq-card"><strong>EU / EFTA route</strong><p>No visa needed — but bring a valid passport or national ID, arrange health insurance, and complete local registration after arrival.</p></div>
    </div>
  </div>
</section>
${deadlinesSection(false)}
` },
/* ---------------- ENGLISH REQUIREMENTS ---------------- */
{
  file: 'admissions/english-requirements.html',
  title: 'English Requirements',
  crumb: 'English Requirements',
  desc: 'Every accepted English test and minimum score for AUS admission and for the Swiss student visa.',
  eyebrow: 'Admissions · English',
  h1: 'English <em>requirements.</em>',
  lead: 'One page, two lists: the tests accepted for admission, and the separate list the Swiss authorities accept for the student visa. All results must be no older than two years.',
  related: [
    { key: 'breq', num: '01', label: "Bachelor's Requirements", note: 'Where the admission list applies' },
    { key: 'mreq', num: '02', label: "Master's Requirements", note: 'Graduate language expectations' },
    { key: 'ireq', num: '03', label: 'International Requirements', note: 'Visa route and proof of funds' }
  ],
  ctaTitle: 'Test ready? <em>Send it with your file.</em>',
  ctaText: 'Upload your evidence with the application, or note it in the form if your test date is upcoming. The list is not exhaustive — other assessments, including the Admissions Interview, may be considered case by case.',
  body: `
<section class="rq-section" data-chapter="01" data-chapter-label="Who This Applies To">
  <div class="wrap">
    <div class="chapter-label"><span class="num">01</span>Who This Applies To</div>
    <h2>Applicants whose first<br><em>language isn't English.</em></h2>
    <p class="section-lead">English is the primary language of instruction and collaboration at AUS. Applicants whose native language is not English and whose primary language of instruction in secondary education was not English must provide proof of proficiency.</p>
    <div class="who-grid">
      <div class="who-card"><span class="who-tag">Exempt</span><p>Native speakers, and applicants whose primary language of instruction in secondary education was English.</p></div>
      <div class="who-card"><span class="who-tag">Evidence required</span><p>All other applicants, through one of the accepted tests below or an alternative assessment considered by the committee.</p></div>
      <div class="who-card"><span class="who-tag">Validity</span><p>All submitted exam results must be no older than two years at the time of application.</p></div>
    </div>
  </div>
</section>
<section class="rq-section paper" data-chapter="02" data-chapter-label="Admission Tests">
  <div class="wrap">
    <div class="chapter-label"><span class="num">02</span>Admission Tests</div>
    <h2>The admission list,<br><em>scores and all.</em></h2>
    <p class="section-lead">Accepted for admission to AUS programs, per the Policy and Procedures for Admissions.</p>
    <div style="overflow-x:auto;">
    <table class="score-table">
      <thead><tr><th>Test</th><th>Minimum score</th><th>Notes</th></tr></thead>
      <tbody>
        <tr><td class="test-name">CEFR English Level Test</td><td class="test-score">B2</td><td>English level test</td></tr>
        <tr><td class="test-name">IELTS</td><td class="test-score">5.5</td><td>No single element below 4.5</td></tr>
        <tr><td class="test-name">TOEFL</td><td class="test-score">4+</td><td>As listed in the admissions policy</td></tr>
        <tr><td class="test-name">Cambridge Exams</td><td class="test-score">FCE</td><td>Minimum First</td></tr>
        <tr><td class="test-name">NCUK</td><td class="test-score">5.5</td><td>Minimum overall</td></tr>
        <tr><td class="test-name">Pearson PTE Academic</td><td class="test-score">50</td><td>Listening 47, Reading 47, Speaking 47, Writing 50</td></tr>
        <tr><td class="test-name">SAT</td><td class="test-score">1000</td><td>For BSBA applicants graduating from an American high school only</td></tr>
        <tr><td class="test-name">Michigan ECPE</td><td class="test-score">Pass</td><td>Certificate of Proficiency in English</td></tr>
        <tr><td class="test-name">Michigan MELAB</td><td class="test-score">80%</td><td>English Language Assessments Battery</td></tr>
        <tr><td class="test-name">McGraw-Hill Education English Certificate</td><td class="test-score">B2</td><td>CEFR Level B2</td></tr>
      </tbody>
    </table>
    </div>
    <div style="margin-top:22px;" class="rq-note"><span class="icon">i.</span><span><strong>Not an exhaustive list</strong><p>Other forms of assessment, including the Admissions Interview, can be considered by the Admissions Committee on a case-by-case basis.</p></span></div>
  </div>
</section>
<section class="rq-section night" data-chapter="03" data-chapter-label="Visa Tests">
  <div class="wrap">
    <div class="chapter-label"><span class="num">03</span>Visa Tests</div>
    <h2>The Swiss visa list<br><em>is separate.</em></h2>
    <p class="section-lead">The Swiss student visa is granted either to students whose primary language of instruction in secondary education was English, or to students providing proof through the following options. Results must be no older than two years.</p>
    <div style="overflow-x:auto;">
    <table class="score-table">
      <thead><tr><th>Test</th><th>Minimum score</th><th>Notes</th></tr></thead>
      <tbody>
        <tr><td class="test-name">CEFR English Level Test</td><td class="test-score">B2</td><td>English level test</td></tr>
        <tr><td class="test-name">IELTS</td><td class="test-score">5.5</td><td>No single element below 4.5</td></tr>
        <tr><td class="test-name">TOEFL iBT / Home Edition</td><td class="test-score">72&ndash;94</td><td>Reading 18, Listening 17, Speaking 20, Writing 17</td></tr>
        <tr><td class="test-name">Cambridge Exams</td><td class="test-score">FCE</td><td>Minimum First</td></tr>
        <tr><td class="test-name">NCUK</td><td class="test-score">5.5</td><td>Minimum overall</td></tr>
        <tr><td class="test-name">Duolingo English Test</td><td class="test-score">95</td><td>Minimum overall</td></tr>
      </tbody>
    </table>
    </div>
  </div>
</section>
` },
/* ---------------- TRANSFER REQUIREMENTS ---------------- */
{
  file: 'admissions/transfer-requirements.html',
  title: 'Transfer Requirements',
  crumb: 'Transfer Requirements',
  desc: 'Credit transfer, recognized institutions, the 60 ECTS rule, and the Joint Services Transcript (JST).',
  eyebrow: 'Admissions · Transfer',
  h1: 'Transfer <em>requirements.</em>',
  lead: 'Previous higher education can count toward your AUS degree. Here is who qualifies as a transfer student, how credit is assessed, and what to prepare.',
  related: [
    { key: 'breq', num: '01', label: "Bachelor's Requirements", note: 'Undergraduate eligibility baseline' },
    { key: 'ereq', num: '02', label: 'English Requirements', note: 'Accepted tests and minimum scores' },
    { key: 'ireq', num: '03', label: 'International Requirements', note: 'Visa route, funds, and equivalency' }
  ],
  ctaTitle: 'Have credits? <em>Raise them early.</em>',
  ctaText: 'Mention credit transfer at your Admissions Interview — that is the moment the next administrative steps are confirmed. The Dean of Academics leads the comparability assessment afterward.',
  body: `
<section class="rq-section" data-chapter="01" data-chapter-label="Who This Applies To">
  <div class="wrap">
    <div class="chapter-label"><span class="num">01</span>Who This Applies To</div>
    <h2>Applicants with<br><em>university credits.</em></h2>
    <p class="section-lead">Applicants are considered transfer students after attending one or more full semesters of higher education at a recognized institution.</p>
    <div class="who-grid">
      <div class="who-card"><span class="who-tag">Recognized institutions</span><p>Institutions listed by DEQAR, regionally accredited US institutions, or institutions accredited by the officially recognized agency or authorities in their country.</p></div>
      <div class="who-card"><span class="who-tag">Non-listed institutions</span><p>Study at an institution outside these categories may still support undergraduate admission — but without transferable credits.</p></div>
      <div class="who-card"><span class="who-tag">US service members</span><p>Army, Marine Corps, Navy, and Coast Guard personnel and veterans may submit a Joint Services Transcript (JST).</p></div>
    </div>
  </div>
</section>
<section class="rq-section paper" data-chapter="02" data-chapter-label="Academic Requirements">
  <div class="wrap">
    <div class="chapter-label"><span class="num">02</span>Academic Requirements</div>
    <h2>How transfer credit<br><em>is assessed.</em></h2>
    <ul class="rq-list">
      <li>Secondary study records determine eligibility for access to an undergraduate program</li>
      <li>For students transferring more than 60 ECTS, the decision is based on higher education study records</li>
      <li>The Dean of Academics leads the comparability assessment and makes a proposal to the Academic Committee<small>Credits are awarded where prior learning aligns with the content and learning outcomes of AUS courses.</small></li>
      <li>Maximum transferable credits depend on the specific program requirements and the AUS credit transfer policy</li>
      <li>Raise credit transfer at the Admissions Interview — the next administrative steps are confirmed there</li>
    </ul>
  </div>
</section>
${docsSection()}
<section class="rq-section night" data-chapter="03" data-chapter-label="Joint Services Transcript">
  <div class="wrap">
    <div class="chapter-label"><span class="num">03</span>Joint Services Transcript</div>
    <h2>US military<br><em>experience counts.</em></h2>
    <p class="section-lead">AUS may accept credits from the Joint Services Transcript, whose professional military education and occupational experience is evaluated by the American Council on Education (ACE) for college credit recommendations.</p>
    <div class="rq-grid">
      <div class="rq-card"><strong>Eligibility</strong><p>All enlisted personnel, officers, and warrant officers from the Army, Marine Corps, Navy, and Coast Guard — active duty and veterans. Air Force and Space Force personnel submit through the Community College of the Air Force (CCAF).</p></div>
      <div class="rq-card"><strong>Evaluation</strong><p>The admissions team reviews the JST against AUS programs; credits are awarded based on ACE recommendations, where training aligns with course content and outcomes.</p></div>
      <div class="rq-card"><strong>Application</strong><p>Accepted credits reduce the number of courses required for completion, within the maximum set by the program and the credit transfer policy.</p></div>
    </div>
  </div>
</section>
${deadlinesSection(false)}
` }
];

fs.mkdirSync('admissions', { recursive: true });
for (const p of pages) {
  fs.writeFileSync(p.file, page(p), 'utf8');
  console.log('Wrote', p.file);
}
console.log('Done.');
