const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const excludedDirectories = new Set([
  '.chrome-backup', '.git', '.visual-check', 'history', 'hbs-demo-deploy',
  'node_modules', 'tmp', 'webflow', 'bachelors-degree', 'masters-degree',
  'doctorate-in-business-administration', 'swiss-federal-diploma-business-administration'
]);

const oldPopupCopy = 'Swiss business education with dual degrees, small classes, and 96%+ graduate employment. Applications are open for September 2026.';
const newPopupCopy = 'Swiss business education with dual degrees, small classes, and 96%+ graduate employment. Applications are open for <span data-next-intake-copy>January 2027</span>.';

const intakeScript = `<script id="aus-global-intake-script">
(function(){
  /* Update these three deadline rules if the official admissions calendar changes. */
  var intakeRules=[
    {name:'January',deadlineMonth:10,deadlineDay:15,deadlineYearOffset:-1},
    {name:'April',deadlineMonth:1,deadlineDay:15,deadlineYearOffset:0},
    {name:'September',deadlineMonth:6,deadlineDay:15,deadlineYearOffset:0}
  ];
  function nextAvailableIntake(){
    var now=new Date();
    for(var year=now.getFullYear();year<=now.getFullYear()+3;year++){
      for(var i=0;i<intakeRules.length;i++){
        var rule=intakeRules[i];
        var deadline=new Date(year+rule.deadlineYearOffset,rule.deadlineMonth,rule.deadlineDay,23,59,59,999);
        if(now<=deadline)return rule.name+' '+year;
      }
    }
    return 'the next available intake';
  }
  var label=nextAvailableIntake();
  document.querySelectorAll('[data-next-intake-copy]').forEach(function(element){element.textContent=label;});
})();
</script>`;

function listCanonicalHtml(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) listCanonicalHtml(fullPath, files);
    else if (entry.name.endsWith('.html')) files.push(fullPath);
  }
  return files;
}

function updateHtml(file) {
  let html = fs.readFileSync(file, 'utf8');
  const original = html;
  html = html
    .replaceAll("25'050", "25'000")
    .replaceAll('25,050', '25,000')
    .replaceAll('25050', '25000')
    .replaceAll(oldPopupCopy, newPopupCopy);

  if (html.includes('data-next-intake-copy')) {
    if (html.includes('id="aus-global-intake-script"')) {
      html = html.replace(/<script id="aus-global-intake-script">[\s\S]*?<\/script>/, intakeScript);
    } else {
      html = html.replace('</body>', `${intakeScript}\n</body>`);
    }
  }

  if (path.basename(file) === 'cost-calculator.html') {
    html = html.replace('var termTuition=Math.round(netTuition/program.termsPerYear);var termLiving=Math.round(annualLiving/program.termsPerYear);', '');
    html = html.replace(',termTuition:termTuition,termLiving:termLiving', '');
  }

  if (html !== original) fs.writeFileSync(file, html, 'utf8');
  return html !== original;
}

let updated = 0;
for (const file of listCanonicalHtml(root)) {
  if (updateHtml(file)) updated += 1;
}

const landingBuilder = path.join(__dirname, 'build-landing-pages.js');
let landingSource = fs.readFileSync(landingBuilder, 'utf8');
const originalLandingSource = landingSource;
landingSource = landingSource
  .replaceAll("25'050", "25'000")
  .replaceAll('25,050', '25,000')
  .replaceAll('25050', '25000');
if (landingSource !== originalLandingSource) fs.writeFileSync(landingBuilder, landingSource, 'utf8');

const conventionsFile = path.join(__dirname, 'apply-content-conventions.js');
let conventions = fs.readFileSync(conventionsFile, 'utf8');
const originalConventions = conventions;
conventions = conventions.replace("'25,000', '25,050',", "'25,000',");
if (conventions !== originalConventions) fs.writeFileSync(conventionsFile, conventions, 'utf8');

console.log(`Updated tuition and intake content in ${updated} canonical HTML files.`);
