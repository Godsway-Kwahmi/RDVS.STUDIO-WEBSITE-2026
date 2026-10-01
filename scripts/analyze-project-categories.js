const fs = require('fs');

const content = fs.readFileSync('work.html', 'utf8');
const cardRegex = /<a href="([^"]*)" class="grid-card"[^>]*data-title="([^"]*)"[^>]*data-year="([^"]*)"[^>]*data-typology="([^"]*)"[^>]*data-discipline="([^"]*)"[^>]*data-category="([^"]*)"/g;

const disciplines = {};
const typologies = {};
const categoryTokens = {};

let match;
while ((match = cardRegex.exec(content)) !== null) {
  const [_, link, title, year, typology, discipline, category] = match;
  disciplines[discipline] = (disciplines[discipline] || 0) + 1;
  typologies[typology] = (typologies[typology] || 0) + 1;
  category.split(/\s+/).forEach(c => {
    categoryTokens[c] = (categoryTokens[c] || 0) + 1;
  });
}

console.log('Disciplines:', disciplines);
console.log('Category tokens:', categoryTokens);
