const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

console.log('Total HTML files:', htmlFiles.length);

// 1. Audit Search Forms
const searchAudit = [];
htmlFiles.forEach(f => {
  const content = fs.readFileSync(path.join(rootDir, f), 'utf8');
  const formMatch = content.match(/<form[^>]*class=["'][^"']*search-form[^"']*["'][^>]*>/i);
  const inputMatch = content.match(/<input[^>]*type=["']search["'][^>]*>/i);
  searchAudit.push({
    file: f,
    hasForm: !!formMatch,
    formAction: formMatch ? (formMatch[0].match(/action=["']([^"']*)["']/i) || [])[1] : null,
    hasInput: !!inputMatch,
    inputName: inputMatch ? (inputMatch[0].match(/name=["']([^"']*)["']/i) || [])[1] : null
  });
});

const invalidSearch = searchAudit.filter(s => !s.hasForm || s.formAction !== 'work.html' || s.inputName !== 'q');
console.log('Search forms audit: invalid count =', invalidSearch.length);
if (invalidSearch.length > 0) {
  console.log('Invalid search forms:', invalidSearch.map(s => `${s.file}: action=${s.formAction}, inputName=${s.inputName}`));
}

// 2. Audit Project Links & Missing HTML files
const workHtml = fs.readFileSync(path.join(rootDir, 'work.html'), 'utf8');
const cardRegex = /<article class="grid-card"[^>]*>[\s\S]*?<a\s+href="([^"]+)"/g;
let match;
const workProjects = [];
while ((match = cardRegex.exec(workHtml)) !== null) {
  workProjects.push(match[1]);
}
console.log('Total projects linked in work.html:', workProjects.length);

const missingProjectPages = [];
workProjects.forEach(href => {
  const cleanHref = href.split('?')[0].split('#')[0];
  if (!fs.existsSync(path.join(rootDir, cleanHref))) {
    missingProjectPages.push(href);
  }
});
console.log('Missing project HTML files from work.html:', missingProjectPages);

// 3. Audit Images on Dedicated Project Pages vs Disk
const projectPageAudits = [];
htmlFiles.forEach(f => {
  if (['index.html', 'work.html', 'about.html', 'expertise.html', 'contact.html', 'news.html', 'rdvschool.html', 'archive.html'].includes(f)) return;
  
  const content = fs.readFileSync(path.join(rootDir, f), 'utf8');
  const imgMatches = content.match(/<img[^>]+src=["']([^"']+)["']/g) || [];
  const imgSources = imgMatches.map(m => (m.match(/src=["']([^"']+)["']/) || [])[1]);
  
  // Check if images exist
  const brokenImgs = imgSources.filter(src => {
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) return false;
    const cleanSrc = src.split('?')[0].split('#')[0];
    return !fs.existsSync(path.join(rootDir, cleanSrc));
  });

  // Check corresponding asset folder if any
  const slug = f.replace('.html', '');
  const assetDir = path.join(rootDir, 'assets', 'images', slug);
  let diskImagesCount = 0;
  if (fs.existsSync(assetDir)) {
    diskImagesCount = fs.readdirSync(assetDir).filter(x => /\.(jpe?g|png|webp|avif|svg)$/i.test(x)).length;
  }

  projectPageAudits.push({
    file: f,
    displayedImagesCount: imgSources.length,
    diskImagesCount: diskImagesCount,
    brokenImgs: brokenImgs
  });
});

const brokenImgPages = projectPageAudits.filter(p => p.brokenImgs.length > 0);
console.log('Pages with broken images count =', brokenImgPages.length);
if (brokenImgPages.length > 0) {
  console.log('Pages with broken images:', brokenImgPages);
}

const unrepresentedImages = projectPageAudits.filter(p => p.diskImagesCount > p.displayedImagesCount);
console.log('Pages where disk has more images than displayed =', unrepresentedImages.length);
if (unrepresentedImages.length > 0) {
  console.log('Sample pages with unrepresented images:', unrepresentedImages.slice(0, 10));
}

// 4. Sanity Audit across all HTML pages
const sanityAudit = [];
htmlFiles.forEach(f => {
  const content = fs.readFileSync(path.join(rootDir, f), 'utf8');
  const hasClient = content.includes('sanity-client.js');
  const hasRender = content.includes('sanity-render.js');
  sanityAudit.push({
    file: f,
    hasClient,
    hasRender
  });
});

const missingSanityClient = sanityAudit.filter(s => !s.hasClient);
const missingSanityRender = sanityAudit.filter(s => !s.hasRender);
console.log('Pages missing sanity-client.js:', missingSanityClient.length);
console.log('Pages missing sanity-render.js:', missingSanityRender.length);

// 5. Navigation Links Audit across all HTML pages
const navAudit = [];
htmlFiles.forEach(f => {
  const content = fs.readFileSync(path.join(rootDir, f), 'utf8');
  const navMatch = content.match(/<nav class=["']primary-nav["'][\s\S]*?<\/nav>/i);
  if (navMatch) {
    const hasWork = navMatch[0].includes('work.html');
    const hasAbout = navMatch[0].includes('about.html');
    const hasNews = navMatch[0].includes('news.html');
    const hasExpertise = navMatch[0].includes('expertise.html');
    const hasSchool = navMatch[0].includes('rdvschool.html');
    const hasContact = navMatch[0].includes('contact.html');
    const hasArchive = navMatch[0].includes('archive.html');
    navAudit.push({
      file: f,
      hasWork, hasAbout, hasNews, hasExpertise, hasSchool, hasContact, hasArchive
    });
  }
});
const missingArchive = navAudit.filter(n => !n.hasArchive);
console.log('Pages with primary nav missing Archive link:', missingArchive.length);
