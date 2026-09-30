const fs = require('fs');

const html = fs.readFileSync('work.html', 'utf8');

// Match each grid card
const regex = /<a\s+href="([^"]+)"\s+class="grid-card"[\s\S]*?data-title="([^"]+)"[\s\S]*?data-year="([^"]+)"[\s\S]*?<h2 class="card-title">([^<]+)<\/h2>[\s\S]*?<span class="card-year">([^<]+)<\/span>[\s\S]*?<\/a>/g;

let match;
const cards = [];
while ((match = regex.exec(html)) !== null) {
  cards.push({
    href: match[1],
    titleAttr: match[2],
    yearAttr: match[3],
    titleText: match[4].trim(),
    yearText: match[5].trim()
  });
}

console.log('Parsed cards count:', cards.length);
console.log('First 10 cards:', cards.slice(0, 10));
console.log('Last 10 cards:', cards.slice(-10));
