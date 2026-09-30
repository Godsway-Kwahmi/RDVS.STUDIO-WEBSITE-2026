const fs = require('fs');
const path = require('path');

const root = process.cwd();
const imagesBase = path.join(root, 'assets', 'images');
const imgDirs = fs.readdirSync(imagesBase, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);

const dirToImages = {};
imgDirs.forEach(dir => {
  const p = path.join(imagesBase, dir);
  const files = fs.readdirSync(p).filter(f => /\.(jpe?g|png|webp|avif|svg)$/i.test(f));
  if (files.length > 0) {
    dirToImages[dir] = files.map(f => `assets/images/${dir}/${f}`);
  }
});

console.log('Directories with actual images:', Object.keys(dirToImages).length);
console.log('List of directories with images:');
console.log(Object.keys(dirToImages));

// Compare with work.html
const workHtml = fs.readFileSync(path.join(root, 'work.html'), 'utf8');
const cardLinks = [...workHtml.matchAll(/href="([^"]+\.html)"\s+class="grid-card"/g)].map(m => m[1]);
console.log('Total card links on work.html:', cardLinks.length);

const availableSlugs = new Set(Object.keys(dirToImages));
const matched = [];
const unmatched = [];

cardLinks.forEach(link => {
  const slug = link.replace('.html', '');
  if (availableSlugs.has(slug)) {
    matched.push(slug);
  } else {
    // Check fuzzy match
    const fuzzy = Object.keys(dirToImages).find(d => {
      const cleanD = d.replace(/[-_]/g, '').toLowerCase();
      const cleanS = slug.replace(/[-_]/g, '').toLowerCase();
      return cleanD === cleanS || cleanD.includes(cleanS) || cleanS.includes(cleanD);
    });
    if (fuzzy) {
      matched.push(`${slug} -> ${fuzzy}`);
    } else {
      unmatched.push(slug);
    }
  }
});

console.log('\nMatched project slugs to real image dirs:', matched.length);
console.log('Unmatched project slugs (no image dir found):', unmatched.length);
console.log('Unmatched sample:', unmatched);
