const fs = require('fs');
const path = require('path');

const root = process.cwd();

function walk(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir, { withFileTypes: true });
    list.forEach(file => {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        results = results.concat(walk(fullPath));
      } else {
        results.push(path.relative(root, fullPath).replace(/\\/g, '/'));
      }
    });
  } catch (e) {}
  return results;
}

const mediaFiles = walk(path.join(root, 'assets'));
const rootFiles = fs.readdirSync(root);
const htmlFiles = rootFiles.filter(f => f.endsWith('.html'));

const report = {
  totalMediaFiles: mediaFiles.length,
  mediaFiles: mediaFiles,
  totalHtmlFiles: htmlFiles.length,
  htmlFiles: htmlFiles
};

fs.writeFileSync(path.join(root, 'scripts', 'media-index.json'), JSON.stringify(report, null, 2));
console.log('Indexed media files:', mediaFiles.length);
console.log('Indexed HTML files:', htmlFiles.length);
