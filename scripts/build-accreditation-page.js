const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const file = path.join(root, 'about', 'accreditation.html');
const QS_URL = 'https://www.topuniversities.com/universities/american-institute-applied-sciences-switzerland';

const groups = [
  {
    id: 'accreditation-status', chapter: '01', label: 'Accreditation', eyebrow: 'Accreditation',
    title: 'Independent academic quality assurance.',
    intro: 'Accreditation evaluates academic programs against defined quality standards. AUS and its dual-degree partner hold the following relevant accreditations.',
    cards: [
      ['IACBE — International Accreditation Council for Business Education', 'AUS business programs have received specialized accreditation through IACBE.', 'https://cdn.prod.website-files.com/6a3268e8b878fd22920cd884/6a563d0f6361ad7bd1c6f24b_iacbe.png', 'https://iacbe.org/memberpdf/AmericanInstituteofAppliedSciencesinSwitzerland.pdf', 'Verify IACBE status'],
      ['ACBSP — Accreditation Council for Business Schools and Programs', "Tiffin University's School of Business is accredited by ACBSP, supporting the US qualification within the dual-degree pathway.", 'https://cdn.prod.website-files.com/6a3268e8b878fd22920cd884/6a563c8d3210aeaac6c80a11_acbsp.jpg', 'https://acbsp.org/', 'Visit ACBSP'],
      ['Higher Learning Commission — Tiffin University', 'Tiffin University is institutionally accredited by the Higher Learning Commission in the United States.', 'https://cdn.prod.website-files.com/6a3268e8b878fd22920cd884/6a563ca06ac461eb8d7d5ba3_hlc.png', 'https://www.hlcommission.org/', 'Visit HLC']
    ]
  },
  {
    id: 'recognition-status', chapter: '02', label: 'Recognition', eyebrow: 'Recognition & Listings',
    title: 'Official listings and external recognition.',
    intro: 'Recognition confirms how AUS, its programs or its partner pathways are listed, authorized or accepted by relevant public and professional bodies.',
    cards: [
      ['UNESCO WHED — World Higher Education Database', 'AUS is listed in the World Higher Education Database under institution code IAU-029651.', 'https://cdn.prod.website-files.com/6a3268e8b878fd22920cd884/6a563c4c5f40eac49da26803_unesco.webp', 'https://www.whed.net/institutions/IAU-029651', 'Verify WHED listing'],
      ['United States Department of Veterans Affairs', 'AUS is approved for eligible US veterans to use GI Bill benefits. Facility code: 21001578.', 'https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aaa48711d1339ae79307bfe_max1200-removebg-preview.png', 'https://www.va.gov/education/gi-bill-comparison-tool/institution/21001578', 'Assess VA benefits'],
      ['Ohio Department of Higher Education', "Tiffin University's seated and online programs are authorized by the Ohio Department of Higher Education.", 'https://cdn.prod.website-files.com/6a3268e8b878fd22920cd884/6a563c845b040ef12c733acc_ohio.webp', 'https://highered.ohio.gov/', 'Visit ODHE'],
      ['Ministry of Higher Education — Jordan', 'AUS is recognized by the Ministry of Higher Education in the Hashemite Kingdom of Jordan.', 'https://cdn.prod.website-files.com/6a3268e8b878fd22920cd884/6a563cec6361ad7bd1c6d426_ministry_jordan.webp', 'https://rce.mohe.gov.jo/en/RecognizedUniversities', 'Verify recognition'],
      ['Ministry of Education — Saudi Arabia', 'AUS is listed for degree recognition by the relevant higher-education authority in the Kingdom of Saudi Arabia.', 'https://cdn.prod.website-files.com/6a3268e8b878fd22920cd884/6a563cf8826f0f64152c33a2_ministry_sa.webp', 'https://ru.moe.gov.sa/Search#/University/13058', 'Verify recognition'],
      ['CHEA recognition of IACBE', "IACBE's specialized accreditation is recognized by the Council for Higher Education Accreditation.", 'https://cdn.prod.website-files.com/6a3268e8b878fd22920cd884/6a563d01e87b055975389ff1_chea.png', 'https://www.chea.org/international-accreditation-council-business-education', 'View CHEA listing'],
      ['IELTS Official Preparation and Testing Center', 'AUS supports applicants and students through its role as an official IELTS preparation and testing center.', 'https://cdn.prod.website-files.com/6a3268e8b878fd22920cd884/6a563c68ce553c3f34eb9a9f_ielts.webp', 'https://www.ielts.org/', 'Visit IELTS']
    ]
  },
  {
    id: 'memberships', chapter: '03', label: 'Memberships', eyebrow: 'Memberships & Commitments',
    title: 'Connected to international education networks.',
    intro: 'Memberships and signatory commitments connect AUS with communities working on responsible management education and international school quality.',
    cards: [
      ['PRME — Principles for Responsible Management Education', 'AUS is a signatory of the United Nations-supported PRME initiative and its commitment to responsible management education.', 'https://cdn.prod.website-files.com/6a3268e8b878fd22920cd884/6a563c32c5d4871e84ccdffb_prme.png', 'https://www.unprme.org/', 'Visit PRME'],
      ['Council of International Schools', 'AUS is a member of CIS, a global community focused on high-quality international education.', 'https://cdn.prod.website-files.com/6a3268e8b878fd22920cd884/6a563c7b8589f504b7ed1dc7_cis.svg', 'https://www.cois.org/', 'Visit CIS']
    ]
  }
];

function card([title, description, image, url, linkLabel]) {
  return `<article class="credential-card">
    <div class="credential-logo"><img loading="lazy" decoding="async" src="${image}" alt="${title}"></div>
    <h3>${title}</h3><p>${description}</p>
    <a href="${url}" target="_blank" rel="noopener noreferrer">${linkLabel} <span aria-hidden="true">↗</span></a>
  </article>`;
}

const directory = groups.map((group, index) => `<section id="${group.id}" class="credential-section${index % 2 ? ' is-alt' : ''}" data-chapter="${group.chapter}" data-chapter-label="${group.label}">
  <div class="wrap"><div class="credential-heading"><div><span class="eyebrow">${group.eyebrow}</span><h2>${group.title}</h2></div><p>${group.intro}</p></div>
  <div class="credential-grid">${group.cards.map(card).join('')}</div></div>
</section>`).join('\n');

const qs = `<!-- QS RECOGNITION -->
<section id="ranking" class="qs-recognition" data-chapter="04" data-chapter-label="QS Recognition">
  <div class="wrap"><div class="credential-heading"><div><span class="eyebrow">QS Recognition</span><h2>Ratings and rankings you can verify.</h2></div><div><p>AUS holds a four-star overall QS Stars rating, with five stars for Teaching and Business &amp; Management Studies and four stars for Facilities and Employability.</p><a class="qs-verify" href="${QS_URL}" target="_blank" rel="noopener noreferrer">Verify AUS on the QS website ↗</a></div></div>
  <div class="qs-feature"><img loading="lazy" decoding="async" src="https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aaa4e414418e5d34460a549_QS%20Stars%20Rating%20-%20AUS%20Business%20School.png" alt="QS Stars Rating for AUS Business School"><div><img class="qs-wordmark" loading="lazy" decoding="async" src="https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aaa4e3e9ab99334e19706e7_Stars%20light.png" alt="QS Stars"><h3>QS Stars institutional rating</h3><p>The category badges below present the published QS Stars result in a format that is easy to review and verify.</p></div></div>
  <div class="qs-stars-grid">
    <a href="${QS_URL}" target="_blank" rel="noopener noreferrer"><img loading="lazy" decoding="async" src="https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aaa4e3f4418e5d34460a4b9_uni-overall-4star.png" alt="QS Stars four-star overall rating"></a>
    <a href="${QS_URL}" target="_blank" rel="noopener noreferrer"><img loading="lazy" decoding="async" src="https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aaa4e475ce4a1e586596e0b_uni-teaching-5star.png" alt="QS Stars five-star teaching rating"></a>
    <a href="${QS_URL}" target="_blank" rel="noopener noreferrer"><img loading="lazy" decoding="async" src="https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aaa4e3e3fa8453f22552d15_uni-business_management_studies-5star.png" alt="QS Stars five-star Business and Management Studies rating"></a>
    <a href="${QS_URL}" target="_blank" rel="noopener noreferrer"><img loading="lazy" decoding="async" src="https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aaa4e3f2a3a2eeaf431221c_uni-facilities-4star.png" alt="QS Stars four-star facilities rating"></a>
    <a href="${QS_URL}" target="_blank" rel="noopener noreferrer"><img loading="lazy" decoding="async" src="https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aaa4e3f95236a4b23054dae_uni-employability-4star.png" alt="QS Stars four-star employability rating"></a>
  </div>
  <div class="qs-ranking-grid"><a href="${QS_URL}" target="_blank" rel="noopener noreferrer"><img loading="lazy" decoding="async" src="https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aaa549701ac3c9c1e1b9a35_rank%202.png" alt="AUS ranked number two in Switzerland"><span>Top 2 in Switzerland for Business Masters</span></a><a href="${QS_URL}" target="_blank" rel="noopener noreferrer"><img loading="lazy" decoding="async" src="https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6aaa549c9a50844e7214c1a4_rank%20200.png" alt="AUS ranked among the global top 200"><span>Top 200 globally for Business Masters</span></a></div>
  </div>
</section>`;

const styles = `<style id="accreditation-page-refresh">
.credential-section{padding:clamp(64px,8vw,108px) 0;background:#fff}.credential-section.is-alt{background:#f1f1ef}.credential-heading{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:clamp(26px,6vw,90px);align-items:end}.credential-heading h2{max-width:760px;margin:12px 0 0;font-family:var(--font-display);font-size:clamp(34px,4.8vw,62px);font-weight:850;line-height:1.04;color:var(--navy)}.credential-heading p{margin:0;color:var(--ink-soft);font-size:16px;line-height:1.75}.credential-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;margin-top:clamp(36px,5vw,58px)}.credential-card{display:flex;flex-direction:column;min-width:0;padding:26px;border:1px solid rgba(34,41,95,.16);border-radius:17px;background:#fff;box-shadow:0 14px 36px rgba(17,24,39,.05)}.credential-logo{display:flex;align-items:center;justify-content:flex-start;height:76px;margin-bottom:20px}.credential-logo img{display:block;max-width:190px;max-height:68px;object-fit:contain}.credential-card h3{margin:0 0 10px;font-family:var(--font-display);font-size:18px;line-height:1.3;color:var(--navy)}.credential-card p{flex:1;margin:0 0 20px;color:var(--ink-soft);font-size:14px;line-height:1.7}.credential-card a,.qs-verify{color:var(--crimson);font-size:14px;font-weight:800;text-decoration:none}.qs-recognition{padding:clamp(64px,8vw,108px) 0;background:#f1f1ef}.qs-recognition .credential-heading>div:last-child{display:grid;gap:14px}.qs-feature{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(280px,.85fr);gap:20px;margin-top:42px}.qs-feature>img,.qs-feature>div{width:100%;min-width:0;border:1px solid rgba(34,41,95,.16);border-radius:18px;background:#fff}.qs-feature>img{height:100%;min-height:350px;padding:20px;object-fit:contain}.qs-feature>div{display:flex;flex-direction:column;justify-content:center;padding:clamp(28px,5vw,56px)}.qs-feature h3{margin:22px 0 10px;font-family:var(--font-display);font-size:26px;color:var(--navy)}.qs-feature p{margin:0;color:var(--ink-soft);line-height:1.7}.qs-wordmark{width:min(220px,75%);height:auto}.qs-stars-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px;margin-top:20px}.qs-stars-grid a{display:grid;place-items:center;min-width:0;padding:14px;border:1px solid rgba(34,41,95,.14);border-radius:14px;background:#fff}.qs-stars-grid img{display:block;width:100%;height:160px;object-fit:contain}.qs-ranking-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;margin-top:20px}.qs-ranking-grid a{display:grid;grid-template-columns:160px 1fr;align-items:center;gap:20px;padding:20px;border:1px solid rgba(34,41,95,.14);border-radius:16px;background:#fff;color:var(--navy);font-weight:800;text-decoration:none}.qs-ranking-grid img{width:150px;height:150px;object-fit:contain}
@media(max-width:980px){.credential-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.qs-stars-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:760px){.credential-heading,.qs-feature{grid-template-columns:1fr}.credential-grid{grid-template-columns:1fr}.qs-feature>img{min-height:0;aspect-ratio:4/3}.qs-stars-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.qs-stars-grid img{height:130px}.qs-ranking-grid{grid-template-columns:1fr}.qs-ranking-grid a{grid-template-columns:110px 1fr}.qs-ranking-grid img{width:100px;height:100px}}
@media(max-width:420px){.qs-ranking-grid a{grid-template-columns:1fr;text-align:center}.qs-ranking-grid img{margin:auto}}
.credential-section,.qs-recognition{scroll-margin-top:100px}
.qs-feature{grid-template-columns:minmax(0,360px) minmax(0,1fr);max-width:920px;margin:34px auto 0;padding:18px;border:1px solid rgba(34,41,95,.16);border-radius:18px;background:#fff}.qs-feature>img,.qs-feature>div{border:0;border-radius:0;background:transparent}.qs-feature>img{height:220px;min-height:0;padding:0;object-fit:contain}.qs-feature>div{padding:22px 28px}.qs-feature h3{margin-top:16px}.qs-wordmark{width:min(170px,60%)}
@media(max-width:760px){.qs-feature{grid-template-columns:1fr;max-width:520px;padding:16px;gap:8px}.qs-feature>img{height:180px;min-height:0;aspect-ratio:auto}.qs-feature>div{padding:18px 12px 14px}.qs-wordmark{width:min(150px,55%)}}
</style>`;

let html = fs.readFileSync(file, 'utf8');
html = html
  .replaceAll('Accreditations<br><em style="font-family:var(--font-serif);font-style:italic;font-weight:400;">&amp; Memberships</em>', 'Accreditation<br><em style="font-family:var(--font-serif);font-style:italic;font-weight:400;">&amp; Recognition</em>')
  .replaceAll('Accreditation &amp; Memberships', 'Accreditation &amp; Recognition')
  .replaceAll('Accreditations &amp; Memberships', 'Accreditation &amp; Recognition');

const directoryStart = html.indexOf('<!-- ACCREDITATION & MEMBERSHIPS -->');
const rankingStart = html.indexOf('<!-- RANKING', directoryStart);
const rankingEnd = html.indexOf('<!-- IACBE PUBLIC DISCLOSURES -->', rankingStart);
if (directoryStart < 0 || rankingStart < 0 || rankingEnd < 0) throw new Error('Could not locate accreditation page content boundaries.');
html = html.slice(0, directoryStart) + directory + '\n' + qs + '\n' + html.slice(rankingEnd);
html = html.replace('data-chapter="03" data-chapter-label="Disclosures"', 'data-chapter="05" data-chapter-label="Disclosures"');
html = html.replace('data-chapter="04" data-chapter-label="Partnerships"', 'data-chapter="06" data-chapter-label="Partnerships"');
if (html.includes('accreditation-page-refresh')) html = html.replace(/<style id="accreditation-page-refresh">[\s\S]*?<\/style>/, styles);
else html = html.replace('</head>', `${styles}\n</head>`);

fs.writeFileSync(file, html, 'utf8');
console.log('Rebuilt Accreditation & Recognition into accreditation, recognition, memberships and QS verification sections.');
