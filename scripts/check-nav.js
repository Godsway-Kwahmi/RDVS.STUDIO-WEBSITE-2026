const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const results = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const navMatch = content.match(/<nav class=["']primary-nav["'][\s\S]*?<\/nav>/i);
  const footerMatch = content.match(/<footer[\s\S]*?<\/footer>/i);
  const mobileNavMatch = content.match(/class=["'][^"']*mobile-nav[^"']*["'][\s\S]*?<\/div>/i);
  
  results.push({
    file: f,
    hasPrimaryNav: !!navMatch,
    primaryNavHasArchive: navMatch ? navMatch[0].includes('archive.html') : false,
    navLinks: navMatch ? (navMatch[0].match(/<a[^>]+>.*?<\/a>/g) || []).map(a => a.replace(/<[^>]+>/g, '').trim()) : [],
    footerHasArchive: footerMatch ? footerMatch[0].includes('archive.html') : false
  });
});

console.log(JSON.stringify(results, null, 2));
