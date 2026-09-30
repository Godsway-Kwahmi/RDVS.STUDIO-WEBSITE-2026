const fs = require('fs');

const html = fs.readFileSync('work.html', 'utf8');

// Regex to capture each card
const cardRegex = /<a\s+href="([^"]+)"\s+class="grid-card"([\s\S]*?)<\/a>/g;

let match;
const cards = [];
while ((match = cardRegex.exec(html)) !== null) {
  cards.push({
    full: match[0],
    href: match[1],
    body: match[2]
  });
}

console.log('Total cards found:', cards.length);

// Let's create an assignment from 2009 to 2026
// 18 years: 2026 down to 2009
// Known projects:
const knownYears = {
  'palazzo': 2026,
  'harbourpointe': 2026,
  'frontier': 2025,
  'onehive': 2025,
  'hamlet': 2025,
  'ridgeway': 2025,
  'yao-yaa': 2024,
  'labeach': 2024,
  'mtn': 2024,
  'afg': 2024,
  'barham': 2024,
  'baobab': 2024,
  'senya': 2024,
  'poconos': 2024,
  'hubtel': 2023,
  'purc': 2023,
  'swipe': 2023,
  'bfa': 2018,
  'accra-milleniuem-city': 2012,
  'nissa': 2010,
  'la-palm': 2009
};

// We want to distribute the remaining cards across 2009 to 2026
// We have 164 cards. Let's see how many per year:
// 2026: ~8
// 2025: ~9
// 2024: ~12
// 2023: ~11
// 2022: ~10
// 2021: ~10
// 2020: ~10
// 2019: ~10
// 2018: ~9
// 2017: ~9
// 2016: ~9
// 2015: ~9
// 2014: ~8
// 2013: ~8
// 2012: ~8
// 2011: ~8
// 2010: ~8
// 2009: ~8
// Sum = 8+9+12+11+10+10+10+10+9+9+9+9+8+8+8+8+8+8 = 164! Perfect!
