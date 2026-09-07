const fs = require('fs');
const path = 'C:/Users/MC/Desktop/test/aus-cost-calculator.html';
let content = fs.readFileSync(path, 'utf8');

// Step 1: Remove the print-only block from renderSummary
// It starts with: html+='<div class="print-only">';
// It ends before: el.innerHTML=html;
const printOnlyStart = content.indexOf("html+='<div class=\"print-only\">';");
if (printOnlyStart < 0) { console.log('print-only not found'); process.exit(1); }

// Find el.innerHTML=html; after the print-only start
const innerHTMLMarker = 'el.innerHTML=html;';
const innerHTMLIdx = content.indexOf(innerHTMLMarker, printOnlyStart);
if (innerHTMLIdx < 0) { console.log('innerHTML not found'); process.exit(1); }

// Remove from print-only start to just before el.innerHTML=html
content = content.substring(0, printOnlyStart) + content.substring(innerHTMLIdx);

// Step 2: Replace the end of renderSummary to populate printContainer
// The current ending (after our step 1 removal) is:
// el.innerHTML=html;var pd=...bindSummaryEvents();}
// We need to replace from "el.innerHTML=html;var pd=" to the closing }

const oldTail = 'el.innerHTML=html;var pd=document.getElementById("printDate");var pdi=document.getElementById("printDateInline");var now=new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});if(pd)pd.textContent=now;if(pdi)pdi.textContent=now;bindSummaryEvents();}';

const newTail = `el.innerHTML=html;
var pc=document.getElementById("printContainer");
var now=new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
var logoUrl="https://cdn.prod.website-files.com/6a3268e6b878fd22920cd747/6a572d869feaf5c0c9629e73_AUS%20Logo%20-%20White%20text.avif";
var ph="";
ph+='<div class="print-header"><img src="'+logoUrl+'" alt="AUS Business School"><div class="print-header-text"><h2>AUS Business School</h2><p>Cost Estimate \\u2014 '+now+"</p></div></div>";
ph+='<div class="print-program-card"><div class="ppc-level">'+prog.level+'</div><div class="ppc-name">'+prog.name+'</div><div class="ppc-meta">'+prog.degree+" \\u00b7 "+prog.duration+"</div></div>";
ph+='<div class="print-total-banner"><div><div class="ptb-label">'+totalLabel+'</div><div class="ptb-period">'+dur+'</div></div><div class="ptb-amount">'+formatCHF(total)+"</div></div>";
ph+='<table class="print-cost-table"><thead><tr><th>Item</th><th>Amount (CHF)</th></tr></thead><tbody>";
ph+='<tr><td class="cat-label" colspan="2">Tuition</td></tr>';
ph+='<tr><td>Original tuition</td><td>'+formatCHF(c2.origTuition)+"</td></tr>";
if(state.scholarshipPercent>0){ph+='<tr class="discount"><td>Scholarship ('+state.scholarshipPercent+"%)</td><td>-"+formatCHF(c2.scholarshipAmount)+"</td></tr>";}
ph+='<tr class="subtotal"><td>Net tuition</td><td>'+formatCHF(state.viewMode==="firstYear"?c2.netTuition:c2.netTuition*prog.durationYears)+"</td></tr>";
ph+='<tr><td class="cat-label" colspan="2">Living Costs</td></tr>';
ph+='<tr><td>Accommodation ('+state.accommodationType+')</td><td>'+formatCHF(aComp)+"</td></tr>";
if(state.healthInsuranceEnabled){var ic=state.viewMode==="firstYear"?state.healthInsurance*state.monthsPerYear:state.healthInsurance*state.monthsPerYear*prog.durationYears;ph+='<tr><td>Health Insurance</td><td>'+formatCHF(ic)+"</td></tr>";}
if(state.foodEnabled){var fc=state.viewMode==="firstYear"?state.food*state.monthsPerYear:state.food*state.monthsPerYear*prog.durationYears;ph+='<tr><td>Food</td><td>'+formatCHF(fc)+"</td></tr>";}
if(state.mobileEnabled){var mc=state.viewMode==="firstYear"?state.mobile*state.monthsPerYear:state.mobile*state.monthsPerYear*prog.durationYears;ph+='<tr><td>Mobile</td><td>'+formatCHF(mc)+"</td></tr>";}
if(state.transportationEnabled){var tc=state.viewMode==="firstYear"?state.transportation*state.monthsPerYear:state.transportation*state.monthsPerYear*prog.durationYears;ph+='<tr><td>Transportation</td><td>'+formatCHF(tc)+"</td></tr>";}
ph+='<tr><td class="cat-label" colspan="2">Visa \\u0026 Permits</td></tr>';
ph+='<tr><td>Student permit</td><td>'+formatCHF(state.viewMode==="firstYear"?c2.permitCosts:c2.permitCosts*prog.durationYears)+"</td></tr>";
if(!state.isEU){ph+='<tr><td>Entry visa</td><td>'+formatCHF(c2.visaCosts)+"</td></tr>";}
if(c2.adminCosts>0){ph+='<tr><td class="cat-label" colspan="2">Additional Fees</td></tr>';ph+='<tr><td>Selected administrative fees</td><td>'+formatCHF(c2.adminCosts)+"</td></tr>";}
ph+='<tr class="grand-total"><td>Estimated Total</td><td>'+formatCHF(total)+"</td></tr>";
ph+="</tbody></table>";
ph+='<div class="print-footer"><strong>Disclaimer:</strong> All figures are estimates based on publicly available information and are subject to change. Actual costs may vary depending on personal spending habits, exchange rate fluctuations, and institutional fee updates.<br><strong>AUS Business School</strong> \\u2014 American Institute of Applied Sciences \\u00b7 Zurich, Switzerland \\u00b7 aus.edu</div>';
ph+='<div class="print-stamp">Generated on '+now+" via AUS Cost Calculator</div>";
pc.innerHTML=ph;
bindSummaryEvents();}`;

if (content.indexOf(oldTail) >= 0) {
  content = content.replace(oldTail, newTail);
  fs.writeFileSync(path, content, 'utf8');
  console.log('SUCCESS: renderSummary updated');
} else {
  console.log('ERROR: old tail not found');
  // Debug: show what's around the innerHTML
  const idx = content.indexOf('el.innerHTML=html;var pd=');
  if (idx > 0) console.log('Found at', idx, ':', content.substring(idx, idx+200));
}
