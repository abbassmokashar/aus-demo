// Throwaway check: does buildEstimatePdfHtml() actually produce a styled, standalone
// document in a real browser? testSend() cannot answer this - it uses the worker's own
// test-only CSS copy, so a failure here would ship an unstyled PDF while tests stayed green.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'cost-calculator.html'), 'utf8');

const probe = `
<script>
(function(){
  var out = {};
  try {
    state.programId = 'bsc_aviation';
    state.scholarshipPercent = 10;
    renderAll();
    var prog = programData.find(function(p){ return p.id === 'bsc_aviation'; });
    var css = collectEstimatePrintCss();
    var doc = buildEstimatePdfHtml(prog);
    out.cssLength = css.length;
    out.cssRuleCount = css.split('\\n').length;
    out.collectedCssHasTableRule = css.indexOf('.print-cost-table') !== -1;
    out.collectedCssHasBannerRule = css.indexOf('.print-total-banner') !== -1;
    out.collectedCssHasHeaderRule = css.indexOf('.print-header') !== -1;
    out.collectedCssLeaksContainerRule = css.indexOf('.print-container') !== -1;
    out.docStartsWithDoctype = doc.indexOf('<!DOCTYPE') === 0;
    out.docClosesHtml = doc.indexOf('<' + '/html>') !== -1;
    out.docStyleOpenCount = doc.split('<' + 'style').length - 1;
    out.docStyleCloseCount = doc.split('<' + '/style').length - 1;
    out.docLength = doc.length;
    // The assertions that actually matter: is the styling INSIDE the document?
    out.docContainsTableRule = doc.indexOf('.print-cost-table') !== -1;
    out.docContainsBannerRule = doc.indexOf('.print-total-banner') !== -1;
    out.docContainsHeaderRule = doc.indexOf('.print-header') !== -1;
    out.docContainsContainerRule = doc.indexOf('.print-container') !== -1;
    out.docContainsMarkup = doc.indexOf('ptb-amount') !== -1;
    out.cssLengthRatio = Math.round((css.length / doc.length) * 100) + '%';
  } catch (error) {
    out.error = String(error && error.message ? error.message : error);
  }
  document.title = 'PROBE' + JSON.stringify(out);
})();
</script>
`;

const instrumented = source.replace(/<\/body>/i, probe + '</body>');
const target = path.join(__dirname, 'estimate-pdf-check.html');
fs.writeFileSync(target, instrumented, 'utf8');

const run = spawnSync(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--allow-file-access-from-files',
  '--virtual-time-budget=10000',
  '--dump-dom',
  'file:///' + target.replace(/\\/g, '/')
], { encoding: 'utf8', maxBuffer: 1024 * 1024 * 64 });

if (run.error) {
  console.log('chrome failed to start: ' + run.error.message);
  process.exit(1);
}

const match = (run.stdout || '').match(/PROBE(\{.*?\})/);
if (!match) {
  console.log('no probe result found. chrome stderr:');
  console.log((run.stderr || '').slice(0, 800));
  process.exit(1);
}

const result = JSON.parse(match[1]);
console.log(JSON.stringify(result, null, 2));

const failures = [];
if (result.error) failures.push('probe threw: ' + result.error);
if (!result.docStartsWithDoctype) failures.push('payload is not a standalone document');
if (!result.docClosesHtml) failures.push('payload does not close html');
if (!result.docContainsTableRule) failures.push('table CSS missing from the payload document');
if (!result.docContainsBannerRule) failures.push('banner CSS missing from the payload document');
if (!result.docContainsHeaderRule) failures.push('header CSS missing from the payload document');
if (result.docContainsContainerRule) failures.push('.print-container rule leaked into payload');
if (!result.docContainsMarkup) failures.push('estimate markup missing from payload');
if (result.docStyleOpenCount !== 2 || result.docStyleCloseCount !== 2) {
  failures.push('expected 2 style blocks, got ' + result.docStyleOpenCount + ' open / ' + result.docStyleCloseCount + ' close');
}
if (!result.collectedCssHasTableRule || !result.collectedCssHasBannerRule) {
  failures.push('collectEstimatePrintCss returned incomplete CSS');
}
if (result.collectedCssLeaksContainerRule) failures.push('.print-container rule leaked into collected CSS');

console.log('');
console.log(failures.length ? 'FAIL:\n - ' + failures.join('\n - ') : 'PASS: payload is a styled standalone document');
process.exit(failures.length ? 1 : 0);
