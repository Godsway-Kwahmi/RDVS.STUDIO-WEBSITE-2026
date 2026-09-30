const fs = require('fs');
let html = fs.readFileSync('work.html', 'utf8');

// Add "Competitions" button to the filter-nav
const targetStr = '<button type="button" class="filter-btn" data-filter="turnkey-build">Design + Build</button>';
const replacementStr = targetStr + '\n          <button type="button" class="filter-btn" data-filter="competitions">Competitions</button>';

html = html.replace(targetStr, replacementStr);
fs.writeFileSync('work.html', html);
console.log('✓ work.html updated with Competitions filter');
