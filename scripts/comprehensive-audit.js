const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

console.log('==================================================');
console.log(`AUDITING ${htmlFiles.length} HTML FILES ACROSS RDVS.STUDIO`);
console.log('==================================================\n');

let issuesFound = 0;

// 1. Audit Search Forms
console.log('--- 1. AUDITING SEARCH FORMS ---');
let invalidSearchCount = 0;
htmlFiles.forEach(f => {
  const content = fs.readFileSync(path.join(rootDir, f), 'utf8');
  const hasForm = /<form[^>]*class=["'][^"']*search-form[^"']*["'][^>]*action=["']work\.html["']/i.test(content) ||
                  /<form[^>]*action=["']work\.html["'][^>]*class=["'][^"']*search-form[^"']*["']/i.test(content);
  const hasInput = /<input[^>]*type=["']search["'][^>]*name=["']q["']/i.test(content) ||
                   /<input[^>]*name=["']q["'][^>]*type=["']search["']/i.test(content);
  if (!hasForm || !hasInput) {
    console.error(`[SEARCH ERROR] in ${f}: form=${hasForm}, input=${hasInput}`);
    invalidSearchCount++;
    issuesFound++;
  }
});
if (invalidSearchCount === 0) {
  console.log(`✓ All ${htmlFiles.length} HTML files have valid unified search forms (action="work.html", name="q").`);
}

// 2. Audit Photography Service
console.log('\n--- 2. AUDITING PHOTOGRAPHY SERVICE ---');
const aboutHtml = fs.readFileSync(path.join(rootDir, 'about.html'), 'utf8');
const expertiseHtml = fs.readFileSync(path.join(rootDir, 'expertise.html'), 'utf8');
const workHtml = fs.readFileSync(path.join(rootDir, 'work.html'), 'utf8');

const hasAboutPhoto = aboutHtml.toLowerCase().includes('photography.');
const hasExpertisePhoto = expertiseHtml.includes('work.html?service=photography') && expertiseHtml.includes('Architectural &amp; Spatial Photography');
const hasWorkPhoto = /data-filter=["']photography["']/i.test(workHtml);

if (hasAboutPhoto) console.log('✓ about.html includes "photography." in services grid.');
else { console.error('✗ about.html missing photography'); issuesFound++; }

if (hasExpertisePhoto) console.log('✓ expertise.html includes "Architectural & Spatial Photography" discipline row.');
else { console.error('✗ expertise.html missing photography row or link'); issuesFound++; }

if (hasWorkPhoto) console.log('✓ work.html includes Photography filter button.');
else { console.error('✗ work.html missing photography filter button'); issuesFound++; }

// 3. Audit Lingering "Interior Architecture"
console.log('\n--- 3. AUDITING "INTERIOR ARCHITECTURE" LINGERING TEXT ---');
let lingeringCount = 0;
const corePages = ['index.html', 'about.html', 'expertise.html', 'work.html', 'archive.html'];
corePages.forEach(f => {
  const content = fs.readFileSync(path.join(rootDir, f), 'utf8');
  if (content.includes('Interior Architecture')) {
    console.warn(`! Found "Interior Architecture" in ${f}`);
    lingeringCount++;
    issuesFound++;
  }
});
if (lingeringCount === 0) {
  console.log('✓ No lingering mentions of "Interior Architecture" in core pages (all replaced with "Interior Design").');
}

// 4. Audit Homepage Slideshow Details & Buttons
console.log('\n--- 4. AUDITING HOMEPAGE SLIDESHOW (index.html) ---');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const slideCount = (indexHtml.match(/<article class="slide/g) || []).length;
const captionCount = (indexHtml.match(/<div class="caption-card/g) || []).length;
const detailsButtonCount = (indexHtml.match(/>Details<\/button>/g) || []).length;
const specButtonCount = (indexHtml.match(/>Specifications<\/button>/g) || []).length;
const serviceTagCount = (indexHtml.match(/<p class="project-service">/g) || []).length;

console.log(`Slides count: ${slideCount} (Expected: 10)`);
console.log(`Caption cards count: ${captionCount} (Expected: 10)`);
console.log(`"Details" buttons count: ${detailsButtonCount} (Expected: 10)`);
console.log(`"Specifications" buttons count: ${specButtonCount} (Expected: 0)`);
console.log(`Project services rendered count: ${serviceTagCount} (Expected: 10)`);

if (slideCount === 10 && captionCount === 10 && detailsButtonCount === 10 && specButtonCount === 0 && serviceTagCount === 10) {
  console.log('✓ Homepage slideshow captions & "Details" buttons fully verified.');
} else {
  console.error('✗ Homepage slideshow mismatch!');
  issuesFound++;
}

// 5. Audit Title Casing Across Work & Archive
console.log('\n--- 5. AUDITING TITLE CASING & ABBREVIATIONS ---');
const workCardRegex = /<a[^>]*class="[^"]*grid-card[^"]*"[^>]*href="([^"]+)"[^>]*data-title="([^"]+)"|<a[^>]*data-title="([^"]+)"[^>]*href="([^"]+)"[^>]*class="[^"]*grid-card[^"]*"/g;
let cardMatch;
let workProjectCount = 0;
let allCapsTitles = [];
let allLowerTitles = [];

// Match all data-title in work.html
const allDataTitles = [...workHtml.matchAll(/data-title="([^"]+)"/g)].map(m => m[1]);
console.log(`Total projects in work.html: ${allDataTitles.length}`);

const isAllUpperCase = str => str.length > 4 && str === str.toUpperCase() && /[A-Z]/.test(str);
const isAllLowerCase = str => str === str.toLowerCase() && /[a-z]/.test(str);

const ALLOWED_ABBRS = new Set([
  'AFG', 'DYV', 'ABL', 'MTN', 'PURC', 'HFC', 'WCIGL', 'HQ', 'VFX', 'TVC', 'VR',
  'AV', 'IGL', 'NPA', 'RLG', '2GS', '5AAP', 'BFA', 'SMSGH', 'C25', 'B1', 'DRW',
  'EHR', 'RDVS', 'CGI', '3D', 'AI', 'LED', 'FDR', 'US', 'UK', 'CEO', 'UCC', 'GT'
]);

allDataTitles.forEach(t => {
  const words = t.split(' ');
  const allWordsAbbr = words.every(w => {
    const clean = w.replace(/[^A-Za-z0-9]/g, '');
    return ALLOWED_ABBRS.has(clean) || /^\d+$/.test(clean);
  });

  if (words.length > 1 && isAllUpperCase(t) && !allWordsAbbr) {
    allCapsTitles.push(t);
  }
  if (isAllLowerCase(t)) {
    allLowerTitles.push(t);
  }
});

console.log(`All-caps titles in work.html: ${allCapsTitles.length}`);
if (allCapsTitles.length > 0) {
  console.error('Sample all-caps:', allCapsTitles.slice(0, 5));
  issuesFound++;
}
console.log(`All-lower titles in work.html: ${allLowerTitles.length}`);
if (allLowerTitles.length > 0) {
  console.error('Sample all-lower:', allLowerTitles.slice(0, 5));
  issuesFound++;
}

// 6. Audit Dedicated Project Pages
console.log('\n--- 6. AUDITING DEDICATED PROJECT PAGES ---');
const archiveHtml = fs.readFileSync(path.join(rootDir, 'archive.html'), 'utf8');
const archiveHrefs = [...archiveHtml.matchAll(/href="([^"]+\.html)"/g)].map(m => m[1]);
const workHrefs = [...workHtml.matchAll(/href="([^"]+\.html)"/g)].map(m => m[1]);

const uniqueProjectHrefs = [...new Set([...workHrefs, ...archiveHrefs])].filter(h => 
  !['index.html', 'work.html', 'about.html', 'expertise.html', 'contact.html', 'news.html', 'rdvschool.html', 'archive.html'].includes(h)
);

console.log(`Unique project pages referenced: ${uniqueProjectHrefs.length}`);
let missingFiles = [];
uniqueProjectHrefs.forEach(h => {
  if (!fs.existsSync(path.join(rootDir, h))) {
    missingFiles.push(h);
  }
});
console.log(`Missing project files on disk: ${missingFiles.length}`);
if (missingFiles.length > 0) {
  console.error('Missing files:', missingFiles);
  issuesFound += missingFiles.length;
} else {
  console.log('✓ All referenced project pages exist on disk.');
}

// 7. Audit Sanity Integration
console.log('\n--- 7. AUDITING SANITY SCRIPT INTEGRATION ---');
let missingSanity = [];
htmlFiles.forEach(f => {
  const content = fs.readFileSync(path.join(rootDir, f), 'utf8');
  if (!content.includes('sanity-client.js') || !content.includes('sanity-render.js')) {
    missingSanity.push(f);
  }
});
console.log(`Pages missing Sanity scripts: ${missingSanity.length}`);
if (missingSanity.length > 0) {
  console.error('Missing Sanity in:', missingSanity);
  issuesFound += missingSanity.length;
} else {
  console.log(`✓ All ${htmlFiles.length} HTML files have Sanity scripts injected.`);
}

console.log('\n==================================================');
console.log(`AUDIT COMPLETE. TOTAL ISSUES DETECTED: ${issuesFound}`);
console.log('==================================================');

process.exit(issuesFound === 0 ? 0 : 1);
