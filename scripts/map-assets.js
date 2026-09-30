const fs = require('fs');
const path = require('path');

const root = process.cwd();
const imagesDir = path.join(root, 'assets', 'images');
const entries = fs.readdirSync(imagesDir, { withFileTypes: true });

const folders = entries.filter(e => e.isDirectory()).map(e => e.name);
const directFiles = entries.filter(e => e.isFile()).map(e => e.name);

console.log('Total subdirectories in assets/images:', folders.length);
console.log('Total loose files in assets/images root:', directFiles.length);

const assetMap = {};
folders.forEach(f => {
  const fPath = path.join(imagesDir, f);
  const imgs = fs.readdirSync(fPath).filter(x => /\.(jpe?g|png|webp|avif|svg)$/i.test(x));
  assetMap[f] = imgs;
});

// Also check other image directories if any (e.g. assets/projects or similar)
console.log('Asset subdirs summary:');
let totalImagesInSubdirs = 0;
Object.entries(assetMap).forEach(([dir, imgs]) => {
  totalImagesInSubdirs += imgs.length;
});
console.log('Total images across all subdirectories:', totalImagesInSubdirs);

// Inspect loose files in assets/images
console.log('Loose image files in assets/images:', directFiles);
