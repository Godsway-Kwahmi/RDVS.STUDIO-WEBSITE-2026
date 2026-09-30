const fs = require('fs');
const path = require('path');

const root = process.cwd();
const imagesBase = path.join(root, 'assets', 'images');
const dirs = fs.readdirSync(imagesBase, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);

const fullMap = {};
dirs.forEach(d => {
  const p = path.join(imagesBase, d);
  const files = fs.readdirSync(p).filter(f => /\.(jpe?g|png|webp|avif|svg)$/i.test(f));
  fullMap[d] = files.map(f => `assets/images/${d}/${f}`);
});

fs.writeFileSync(path.join(root, 'scripts', 'full-media-map.json'), JSON.stringify(fullMap, null, 2));
console.log('Full media map written to scripts/full-media-map.json');
