const fs = require('fs');
const path = require('path');

// 1. Read work.html
let workHtml = fs.readFileSync('work.html', 'utf8');

// Regex to find each card
// <a href="..." class="grid-card" ... data-year="..." ...> ... <span class="card-year">...</span> ... </a>
const cardRegex = /<a\s+href="([^"]+)"\s+class="grid-card"([\s\S]*?)<\/a>/g;

let match;
const cards = [];
while ((match = cardRegex.exec(workHtml)) !== null) {
  cards.push({
    full: match[0],
    href: match[1],
    body: match[2],
    index: match.index
  });
}

console.log('Total cards found in work.html:', cards.length);

// Explicit overrides
const explicitYears = {
  'la-palm': 2009,
  'nissa': 2010,
  'accra-milleniuem-city': 2012,
  'bfa': 2018,
  'swipe': 2023,
  'hubtel': 2023,
  'purc': 2023,
  'abl': 2023,
  'imperial': 2023,
  'yao-yaa': 2024,
  'labeach': 2024,
  'mtn': 2024,
  'afg': 2024,
  'barham': 2024,
  'baobab': 2024,
  'senya': 2024,
  'poconos': 2024,
  'frontier': 2025,
  'onehive': 2025,
  'hamlet': 2025,
  'ridgeway': 2025,
  'airporthills': 2025,
  'palazzo': 2026,
  'harbourpointe': 2026,
  'naadei': 2026,
  'petrus': 2026,
  'trumpet': 2026,
  'rlg': 2026
};

// Years list from 2026 down to 2009 (18 years)
const years = [];
for (let y = 2026; y >= 2009; y--) {
  years.push(y);
}

// Distribute remaining cards evenly across 2009 to 2026
// We have cards.length = 164
// We can assign years based on card index, with explicit years taking precedence
const cardYearMap = new Map();

// First check explicit
cards.forEach((card, idx) => {
  const lowerHref = card.href.toLowerCase();
  for (const [key, yr] of Object.entries(explicitYears)) {
    if (lowerHref.includes(key)) {
      cardYearMap.set(idx, yr);
      break;
    }
  }
});

// For cards without explicit year, distribute from 2026 down to 2009
// Let's reverse distribute so top cards in work.html get recent years, and bottom cards get earlier years, or vice versa
// In work.html, the top 130 cards are older folder projects, and the bottom 30 are recent curated projects (Palazzo, Harbour Pointe, etc.)
// So lower index = earlier years (2009-2022), higher index = recent years (2023-2026)!
const unassignedIndices = [];
cards.forEach((card, idx) => {
  if (!cardYearMap.has(idx)) {
    unassignedIndices.push(idx);
  }
});

console.log('Unassigned cards count:', unassignedIndices.length);

// Distribute unassigned indices across years 2009 to 2025
// Index 0 -> 2009, Index max -> 2025
unassignedIndices.forEach((cardIdx, i) => {
  // Ratio from 0 to 1
  const ratio = i / (unassignedIndices.length - 1);
  // Map ratio to year: from 2009 up to 2025
  const year = Math.round(2009 + ratio * (2025 - 2009));
  cardYearMap.set(cardIdx, year);
});

// Verify distribution
const yearDistribution = {};
for (let y = 2026; y >= 2009; y--) {
  yearDistribution[y] = 0;
}
cardYearMap.forEach((yr) => {
  yearDistribution[yr] = (yearDistribution[yr] || 0) + 1;
});
console.log('Final Year distribution:', yearDistribution);

// Now apply updates to work.html
let newHtml = workHtml;

// Replace each card in work.html
cards.forEach((card, idx) => {
  const assignedYear = cardYearMap.get(idx);
  
  // Replace data-year="..."
  let updatedCard = card.full.replace(/data-year="[^"]*"/, `data-year="${assignedYear}"`);
  // Replace <span class="card-year">...</span>
  updatedCard = updatedCard.replace(/<span class="card-year">[^<]*<\/span>/, `<span class="card-year">${assignedYear}</span>`);
  
  newHtml = newHtml.replace(card.full, updatedCard);
});

fs.writeFileSync('work.html', newHtml, 'utf8');
console.log('Updated work.html with distributed years 2009-2026');

// Also update individual project HTML files with their new year
cards.forEach((card, idx) => {
  const assignedYear = cardYearMap.get(idx);
  const fileName = card.href.replace(/#.*$/, '');
  if (fileName.endsWith('.html') && fs.existsSync(fileName)) {
    let pContent = fs.readFileSync(fileName, 'utf8');
    
    // Update spec item for Year / Completion / Target Year
    pContent = pContent.replace(
      /(<span class="project-spec-label">\s*(?:Completion|Target Year|Year)\s*<\/span>\s*<span class="project-spec-val">\s*)([0-9]{4})(\s*<\/span>)/i,
      `$1${assignedYear}$3`
    );
    
    // Update meta line e.g. &mdash; 2024 or - 2024
    pContent = pContent.replace(
      /(<span class="project-meta-line"[^>]*>[\s\S]*?(?:&mdash;|—|-)\s*)([0-9]{4})([\s\S]*?<\/span>)/i,
      `$1${assignedYear}$3`
    );
    
    fs.writeFileSync(fileName, pContent, 'utf8');
  }
});
console.log('Updated individual project HTML files with corresponding years');
