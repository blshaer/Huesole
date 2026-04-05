/**
 * Interleaves gradients to ensure variety on every page.
 * Distributes 'auto' (Grabient-style) gradients across the file.
 */

const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../client/src/shared/lib/gradients.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const autos = data.filter(g => g.rawCss);
const standard = data.filter(g => !g.rawCss);

console.log(`Auto: ${autos.length}, Standard: ${standard.length}`);

const interleaved = [];
const pageSize = 9;
// We want at least 2 autos per page if possible
const autosPerPage = Math.min(2, Math.floor(autos.length / (data.length / pageSize)));

let autoIdx = 0;
let stdIdx = 0;

while (autoIdx < autos.length || stdIdx < standard.length) {
  // Add 2 autos
  for (let i = 0; i < 2 && autoIdx < autos.length; i++) {
    interleaved.push(autos[autoIdx++]);
  }
  // Add 7 standards
  for (let i = 0; i < 7 && stdIdx < standard.length; i++) {
    interleaved.push(standard[stdIdx++]);
  }
}

// Any remaining
while (autoIdx < autos.length) interleaved.push(autos[autoIdx++]);
while (stdIdx < standard.length) interleaved.push(standard[stdIdx++]);

fs.writeFileSync(filePath, JSON.stringify(interleaved, null, 2) + '\n', 'utf8');
console.log(`Successfully interleaved ${interleaved.length} gradients for variety!`);
