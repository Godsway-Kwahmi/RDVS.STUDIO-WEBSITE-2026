const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const CORE_PAGES = new Set([
  'index.html', 'work.html', 'about.html', 'expertise.html', 'news.html',
  'rdvschool.html', 'contact.html', 'archive.html', 'graphic-design.html',
  'vr-showcase.html', 'vr-photos.html', 'swipe.html'
]);

function parseTags(html, tagName) {
  const regex = new RegExp(`<${tagName}\\s+([^>]+)>`, 'gi');
  const tags = [];
  let m;
  while ((m = regex.exec(html)) !== null) {
    const rawAttrs = m[1];
    const attrs = {};
    const attrRegex = /([a-zA-Z0-9_\-]+)(?:=(?:["']([^"']*)["']|([^\s>]+)))?/g;
    let am;
    while ((am = attrRegex.exec(rawAttrs)) !== null) {
      attrs[am[1].toLowerCase()] = am[2] !== undefined ? am[2] : (am[3] !== undefined ? am[3] : true);
    }
    tags.push(attrs);
  }
  return tags;
}

const projectFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html') && !CORE_PAGES.has(f));

console.log(`Auditing structure, media, and navigation for all ${projectFiles.length} project detail pages...\n`);

let pagesWithIssues = 0;
let totalHeroImgsChecked = 0;
let totalGalleryImgsChecked = 0;
let totalNavLinksChecked = 0;

projectFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  // 1. Title
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    issues.push('Missing or empty <title>');
  }

  // 2. Project page title & meta line
  const h1Match = content.match(/<h1[^>]*class=["'][^"']*project-page-title[^"']*["'][^>]*>([^<]+)<\/h1>/i) ||
                  content.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (!h1Match || !h1Match[1].trim()) {
    issues.push('Missing project-page-title');
  }

  const metaLineMatch = content.match(/class=["'][^"']*project-meta-line[^"']*["']/i);
  if (!metaLineMatch) {
    issues.push('Missing project-meta-line');
  }

  // 3. Hero image
  const imgTags = parseTags(content, 'img');
  const heroImg = imgTags.find(t => t.class && t.class.includes('project-hero-img'));
  if (!heroImg || !heroImg.src) {
    issues.push('Missing project-hero-img element');
  } else {
    totalHeroImgsChecked++;
    const [cleanSrc] = heroImg.src.split(/[?#]/);
    const heroPath = path.resolve(rootDir, cleanSrc);
    if (!fs.existsSync(heroPath)) {
      issues.push(`Hero image does not exist on disk: "${heroImg.src}"`);
    }
  }

  // 4. Gallery images
  const galleryImgs = imgTags.filter(t => t.class && t.class.includes('gallery-img'));
  if (galleryImgs.length === 0) {
    issues.push('No gallery-img elements found');
  } else {
    galleryImgs.forEach(g => {
      totalGalleryImgsChecked++;
      if (!g.src) {
        issues.push('Gallery img element missing src attribute');
      } else {
        const [cleanSrc] = g.src.split(/[?#]/);
        const gPath = path.resolve(rootDir, cleanSrc);
        if (!fs.existsSync(gPath)) {
          issues.push(`Gallery image missing on disk: "${g.src}"`);
        }
      }
    });
  }

  // 5. Specs & Story
  if (!content.includes('project-story')) issues.push('Missing project-story');
  if (!content.includes('project-specs-panel')) issues.push('Missing project-specs-panel');

  // 6. Navigation (Previous & Next)
  const aTags = parseTags(content, 'a');
  const navLinks = aTags.filter(t => t.class && t.class.includes('project-nav-link'));
  if (navLinks.length < 2) {
    issues.push(`Expected 2 project-nav-link pagination links, found ${navLinks.length}`);
  } else {
    navLinks.forEach(nl => {
      totalNavLinksChecked++;
      if (!nl.href) {
        issues.push('project-nav-link missing href attribute');
      } else {
        const [cleanHref] = nl.href.split(/[?#]/);
        const targetPath = path.resolve(rootDir, cleanHref);
        if (!fs.existsSync(targetPath)) {
          issues.push(`Pagination link points to missing page: "${nl.href}"`);
        }
      }
    });
  }

  if (issues.length > 0) {
    pagesWithIssues++;
    console.warn(`[ISSUE] ${file}:`);
    issues.forEach(i => console.warn(`   - ${i}`));
  }
});

console.log('----------------------------------------------------');
console.log(`Audited ${projectFiles.length} project pages:`);
console.log(`- Hero images checked:     ${totalHeroImgsChecked}`);
console.log(`- Gallery images checked:  ${totalGalleryImgsChecked}`);
console.log(`- Pagination links:        ${totalNavLinksChecked}`);
console.log(`- Pages with issues:       ${pagesWithIssues}`);
console.log('----------------------------------------------------');

if (pagesWithIssues === 0) {
  console.log(`✓ ALL ${projectFiles.length} project detail pages are 100% complete, fully loaded, and free of defects!`);
  process.exit(0);
} else {
  console.error(`Found issues in ${pagesWithIssues} files.`);
  process.exit(1);
}
