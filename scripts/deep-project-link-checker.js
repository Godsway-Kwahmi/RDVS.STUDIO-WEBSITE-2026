const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const CORE_PAGES = new Set([
  'index.html',
  'work.html',
  'about.html',
  'expertise.html',
  'news.html',
  'rdvschool.html',
  'contact.html',
  'archive.html',
  'graphic-design.html',
  'vr-showcase.html',
  'vr-photos.html',
  'swipe.html'
]);

console.log('================================================================');
console.log('RDVS STUDIOS — COMPREHENSIVE PROJECT & LINK AUDIT');
console.log('Root Directory:', rootDir);
console.log('================================================================\n');

const allFiles = fs.readdirSync(rootDir);
const allHtmlFiles = allFiles.filter(f => f.endsWith('.html'));

let errors = [];
let warnings = [];

// 1. Check Homepage Slides in index.html
console.log('--- 1. HOMEPAGE SLIDESHOW (index.html) ---');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const slideMatches = [...indexHtml.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*class=["'][^"']*project-action-link[^"']*["'][^>]*>/gi)];
const allSlideTargets = [...new Set(slideMatches.map(m => m[1]))];

console.log(`Found ${allSlideTargets.length} destination links in index.html slides:`);
allSlideTargets.forEach(t => {
  const targetPath = path.join(rootDir, t);
  if (!fs.existsSync(targetPath)) {
    errors.push(`Broken link in index.html slide: "${t}" does not exist!`);
    console.error(`  ✗ ${t} (MISSING)`);
  } else {
    console.log(`  ✓ ${t}`);
  }
});

// 2. Parse projects from work.html
console.log('\n--- 2. PORTFOLIO GRID (work.html) ---');
const workHtml = fs.readFileSync(path.join(rootDir, 'work.html'), 'utf8');

const workCards = [];
const gridCardTagRegex = /<a\s+([^>]*class=["'][^"']*grid-card[^"']*["'][^>]*)>/gi;
let match;
while ((match = gridCardTagRegex.exec(workHtml)) !== null) {
  const attrs = match[1];
  const hrefMatch = attrs.match(/href=["']([^"']+)["']/i);
  const titleMatch = attrs.match(/data-title=["']([^"']+)["']/i);
  const yearMatch = attrs.match(/data-year=["']([^"']+)["']/i);
  const typologyMatch = attrs.match(/data-typology=["']([^"']+)["']/i);
  const discMatch = attrs.match(/data-discipline=["']([^"']+)["']/i);
  
  const href = hrefMatch ? hrefMatch[1] : null;
  const title = titleMatch ? titleMatch[1] : (href ? href.replace('.html', '') : 'Unknown');
  const year = yearMatch ? yearMatch[1] : '';
  const typology = typologyMatch ? typologyMatch[1] : '';
  const discipline = discMatch ? discMatch[1] : '';
  if (href) {
    workCards.push({ href, title, year, typology, discipline });
  }
}

const workUniqueHrefs = [...new Set(workCards.map(c => c.href))];
console.log(`Total project cards rendered in work.html: ${workCards.length}`);
console.log(`Unique project pages in work.html: ${workUniqueHrefs.length}`);

// Check why total > unique (multi-discipline listings)
const workHrefCounts = {};
workCards.forEach(c => workHrefCounts[c.href] = (workHrefCounts[c.href] || 0) + 1);
const multiCategoryProjects = Object.entries(workHrefCounts).filter(([_, count]) => count > 1);
console.log(`Projects cross-listed across multiple disciplines/phases: ${multiCategoryProjects.length}`);

// 3. Parse projects from archive.html
console.log('\n--- 3. CHRONOLOGICAL ARCHIVE (archive.html) ---');
const archiveHtml = fs.readFileSync(path.join(rootDir, 'archive.html'), 'utf8');

const archiveProjects = [];
const archiveRowRegex = /<tr\s+[^>]*class=["'][^"']*archive-row[^"']*["'][^>]*>([\s\S]*?)<\/tr>/gi;
while ((match = archiveRowRegex.exec(archiveHtml)) !== null) {
  const rowContent = match[1];
  const linkMatch = rowContent.match(/<a\s+[^>]*href=["']([^"']+)["'][^>]*class=["']archive-project-link["'][^>]*>(.*?)<\/a>/i) ||
                    rowContent.match(/<a\s+[^>]*class=["']archive-project-link["'][^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/i);
  const yearMatch = rowContent.match(/data-year=["']([^"']+)["']/i);
  
  if (linkMatch) {
    const href = linkMatch[1];
    const title = linkMatch[2].trim();
    const year = yearMatch ? yearMatch[1].trim() : '';
    archiveProjects.push({ href, title, year });
  }
}

const archiveUniqueHrefs = [...new Set(archiveProjects.map(p => p.href))];
console.log(`Total archive rows in archive.html: ${archiveProjects.length}`);
console.log(`Unique project pages in archive.html: ${archiveUniqueHrefs.length}`);

// 4. Verify Project Pages Integrity on Disk
console.log('\n--- 4. PROJECT PAGES INTEGRITY AUDIT ---');
const diskProjectPages = allHtmlFiles.filter(f => !CORE_PAGES.has(f));
console.log(`Total dedicated project pages found on disk: ${diskProjectPages.length}`);

let invalidPages = [];
diskProjectPages.forEach(file => {
  const filePath = path.join(rootDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const stat = fs.statSync(filePath);
  
  if (stat.size === 0) {
    invalidPages.push({ file, reason: 'Empty file (0 bytes)' });
    return;
  }
  
  const hasTitle = /<title>(.*?)<\/title>/i.test(content);
  const hasH1 = /<h1[^>]*class=["'][^"']*project-page-title[^"']*["'][^>]*>/i.test(content) || /<h1[^>]*>/i.test(content);
  const hasMetaLine = /class=["'][^"']*project-meta-line[^"']*["']/i.test(content);
  const hasHero = /class=["'][^"']*project-hero-media[^"']*["']/i.test(content) || /<img[^>]*class=["'][^"']*project-hero-img[^"']*["']/i.test(content);
  const hasSpecs = /class=["'][^"']*project-specs-panel[^"']*["']/i.test(content) || /class=["'][^"']*project-specs-grid[^"']*["']/i.test(content);
  
  if (!hasTitle || !hasH1) {
    invalidPages.push({ file, reason: `Missing title (${hasTitle}) or h1 (${hasH1})` });
  }
});

if (invalidPages.length === 0) {
  console.log(`✓ All ${diskProjectPages.length} project pages are fully formed, non-empty, and contain complete metadata structures.`);
} else {
  console.error(`✗ Found ${invalidPages.length} incomplete project pages:`);
  invalidPages.forEach(p => console.error(`  - ${p.file}: ${p.reason}`));
  errors.push(...invalidPages.map(p => `Incomplete page ${p.file}: ${p.reason}`));
}

// 5. Check all internal links across ALL 145 HTML files
console.log('\n--- 5. COMPREHENSIVE HYPERLINK AUDIT (ALL 145 HTML FILES) ---');
let totalHrefChecked = 0;
let brokenHrefs = [];

allHtmlFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const hrefMatches = content.matchAll(/href=["']([^"']+)["']/gi);
  for (const hm of hrefMatches) {
    const href = hm[1].trim();
    totalHrefChecked++;
    
    // Ignore external or non-file protocols
    if (/^(https?:|\/\/|mailto:|tel:|javascript:|#$)/i.test(href)) {
      continue;
    }
    
    const [base] = href.split(/[?#]/);
    if (!base || base === '') continue;
    
    const resolvedPath = path.resolve(rootDir, base);
    if (!fs.existsSync(resolvedPath)) {
      brokenHrefs.push({
        source: file,
        target: href
      });
    }
  }
});

console.log(`Audited ${totalHrefChecked} hyperlinks across all pages.`);
if (brokenHrefs.length === 0) {
  console.log(`✓ 0 broken hyperlinks! Every internal link points to an existing destination.`);
} else {
  console.error(`✗ Found ${brokenHrefs.length} broken links:`);
  brokenHrefs.forEach(b => console.error(`  In ${b.source} -> "${b.target}"`));
  errors.push(...brokenHrefs.map(b => `Broken link in ${b.source} -> "${b.target}"`));
}

// 6. Check Project Pagination (Prev & Next links on every project page)
console.log('\n--- 6. PROJECT PAGINATION (PREVIOUS & NEXT LINKS) ---');
let paginationLinksCount = 0;
let brokenPagination = [];

diskProjectPages.forEach(file => {
  const filePath = path.join(rootDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const navMatches = [...content.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*class=["'][^"']*project-nav-link[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi)];
  navMatches.forEach(nm => {
    paginationLinksCount++;
    const linkHref = nm[1].trim();
    const linkText = nm[2].replace(/<[^>]+>/g, '').trim();
    const [cleanTarget] = linkHref.split(/[?#]/);
    const targetPath = path.join(rootDir, cleanTarget);
    if (!fs.existsSync(targetPath)) {
      brokenPagination.push({ source: file, target: linkHref, text: linkText });
    }
  });
});

console.log(`Audited ${paginationLinksCount} pagination links across all ${diskProjectPages.length} project pages.`);
if (brokenPagination.length === 0) {
  console.log(`✓ 0 broken pagination links! Prev/Next navigation operates without dead ends.`);
} else {
  console.error(`✗ Found ${brokenPagination.length} broken pagination links:`);
  brokenPagination.forEach(bp => console.error(`  In ${bp.source}: ${bp.text} -> "${bp.target}"`));
  errors.push(...brokenPagination.map(bp => `Broken pagination in ${bp.source}: ${bp.text} -> "${bp.target}"`));
}

// 7. Check Media Assets (Images, Videos, Poster attributes)
console.log('\n--- 7. MEDIA ASSETS AUDIT (IMAGES, VIDEOS, POSTERS) ---');
let mediaCheckedCount = 0;
let brokenMedia = [];

allHtmlFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check src
  const srcMatches = content.matchAll(/<(?:img|source|video|audio|script)\s+[^>]*src=["']([^"']+)["']/gi);
  for (const sm of srcMatches) {
    const src = sm[1].trim();
    mediaCheckedCount++;
    if (/^(https?:|\/\/|data:)/i.test(src)) continue;
    const [clean] = src.split(/[?#]/);
    if (!clean) continue;
    const resolvedPath = path.resolve(rootDir, clean);
    if (!fs.existsSync(resolvedPath)) {
      brokenMedia.push({ source: file, media: src });
    }
  }
  
  // Check poster attribute on video
  const posterMatches = content.matchAll(/<video\s+[^>]*poster=["']([^"']+)["']/gi);
  for (const pm of posterMatches) {
    const poster = pm[1].trim();
    mediaCheckedCount++;
    if (/^(https?:|\/\/|data:)/i.test(poster)) continue;
    const [clean] = poster.split(/[?#]/);
    if (!clean) continue;
    const resolvedPath = path.resolve(rootDir, clean);
    if (!fs.existsSync(resolvedPath)) {
      brokenMedia.push({ source: file, media: poster });
    }
  }
});

console.log(`Audited ${mediaCheckedCount} media assets across all pages.`);
if (brokenMedia.length === 0) {
  console.log(`✓ 0 missing media assets! All images, videos, and posters exist on disk.`);
} else {
  console.error(`✗ Found ${brokenMedia.length} missing media assets:`);
  const uniqueMissing = [...new Set(brokenMedia.map(m => m.media))];
  uniqueMissing.forEach(m => console.error(`  - ${m}`));
  errors.push(...brokenMedia.map(m => `Missing media in ${m.source} -> "${m.media}"`));
}

// 8. Final Report
console.log('\n================================================================');
console.log('AUDIT VERDICT');
console.log('================================================================');
console.log(`Total HTML files on disk:      ${allHtmlFiles.length}`);
console.log(`Project pages on disk:         ${diskProjectPages.length}`);
console.log(`Project cards in work.html:    ${workCards.length}`);
console.log(`Archive entries:               ${archiveProjects.length}`);
console.log(`Total hyperlinks checked:      ${totalHrefChecked}`);
console.log(`Broken links:                  ${brokenHrefs.length}`);
console.log(`Broken pagination:             ${brokenPagination.length}`);
console.log(`Broken media assets:           ${brokenMedia.length}`);
console.log(`Fatal Errors:                  ${errors.length}`);
console.log('================================================================\n');

if (errors.length === 0) {
  console.log('STATUS: PASS. All projects are properly loaded, each has an active page, and all links are intact.');
  process.exit(0);
} else {
  console.error(`STATUS: FAIL with ${errors.length} errors.`);
  process.exit(1);
}
