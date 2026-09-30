const fs = require('fs');
const html = fs.readFileSync('work.html', 'utf8');
const matches = html.match(/<a\s+href="[^"]*"\s+class="grid-card"[^>]*>/g);
console.log('Total grid cards in work.html:', matches ? matches.length : 0);
