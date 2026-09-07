const fs = require('fs');
const vm = require('vm');
const c = fs.readFileSync('C:/Users/MC/Desktop/test/aus-cost-calculator.html', 'utf8');
const s = c.indexOf('<script>') + 8;
const e = c.indexOf('</script>');
const script = c.substring(s, e);

// Try to parse - wrap in function to handle top-level declarations
try {
  new vm.Script(script);
  console.log('Script OK');
} catch(ex) {
  console.log('Error:', ex.message);
  // Try line by line
  const lines = script.split('\n');
  console.log('Total script lines:', lines.length);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.length === 0 || line.startsWith('//') || line.startsWith('/*')) continue;
    // Quick check for unbalanced quotes
    let singleQ = 0, doubleQ = 0;
    for (let j = 0; j < line.length; j++) {
      if (line[j] === "'" && (j === 0 || line[j-1] !== '\\')) singleQ++;
      if (line[j] === '"' && (j === 0 || line[j-1] !== '\\')) doubleQ++;
    }
    if (singleQ % 2 !== 0 || doubleQ % 2 !== 0) {
      console.log('Line', i + 1, '- unbalanced quotes (single:', singleQ, 'double:', doubleQ, ')');
      console.log('  Content:', line.substring(0, 120));
    }
  }
}
