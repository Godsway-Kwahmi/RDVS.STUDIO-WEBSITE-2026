const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const workHtml = fs.readFileSync(path.join(rootDir, 'work.html'), 'utf8');

// Find all hrefs inside work.html
const hrefRegex = /href=["']([^"']+\.html)["']/g;
let m;
const allHrefs = new Set();
while ((m = hrefRegex.exec(workHtml)) !== null) {
  const h = m[1].split('?')[0].split('#')[0];
  if (!['work.html', 'about.html', 'news.html', 'expertise.html', 'rdvschool.html', 'contact.html', 'archive.html', 'index.html'].includes(h)) {
    allHrefs.add(h);
  }
}

const projectLinks = Array.from(allHrefs);
console.log('Unique project links found on work.html:', projectLinks.length);

const missingFiles = projectLinks.filter(h => !fs.existsSync(path.join(rootDir, h)));
console.log('Project links pointing to non-existent HTML files:', missingFiles);

// Now check total project cards on work.html
const cardMatches = workHtml.match(/<article class=["']grid-card/g) || [];
console.log('Total grid-card articles on work.html:', cardMatches.length);

// Also check all HTML files in root
const allHtml = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
const corePages = ['index.html', 'work.html', 'about.html', 'news.html', 'expertise.html', 'rdvschool.html', 'contact.html', 'archive.html'];
const dedicatedProjectPages = allHtml.filter(f => !corePages.includes(f));
console.log('Dedicated project HTML pages in root:', dedicatedProjectPages.length);

// Audit images in dedicated project pages
const imageReport = [];
dedicatedProjectPages.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
  const imgMatches = content.match(/<img[^>]+src=["']([^"']+)["']/g) || [];
  const srcList = imgMatches.map(img => (img.match(/src=["']([^"']+)["']/) || [])[1]);
  
  const broken = srcList.filter(s => {
    if (s.startsWith('http') || s.startsWith('data:')) return false;
    return !fs.existsSync(path.join(rootDir, s));
  });

  const slug = file.replace('.html', '');
  const assetDir = path.join(rootDir, 'assets', 'images', slug);
  let diskImages = [];
  if (fs.existsSync(assetDir)) {
    diskImages = fs.readdirSync(assetDir).filter(x => /\.(jpe?g|png|webp|avif|svg)$/i.test(x));
  }

  imageReport.push({
    file,
    displayedCount: srcList.length,
    brokenCount: broken.length,
    brokenList: broken,
    diskCount: diskImages.length,
    diskImages: diskImages
  });
});

console.log('\n--- BROKEN IMAGES REPORT ---');
const brokenPages = imageReport.filter(r => r.brokenCount > 0);
console.log('Pages with broken img tags:', brokenPages.length);
brokenPages.forEach(p => console.log(`  ${p.file}: broken ${p.brokenCount} ->`, p.brokenList));

console.log('\n--- MISSING DISK IMAGES REPORT (images on disk but not in HTML) ---');
const underrepresented = imageReport.filter(r => r.diskCount > r.displayedCount);
console.log('Pages where disk has more images than displayed in HTML:', underrepresented.length);
underrepresented.forEach(p => console.log(`  ${p.file}: displayed ${p.displayedCount}, on disk ${p.diskCount}`));
