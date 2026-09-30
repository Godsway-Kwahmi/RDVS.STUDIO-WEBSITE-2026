const fs = require('fs');
const path = require('path');

const root = process.cwd();
const mediaData = JSON.parse(fs.readFileSync(path.join(root, 'scripts', 'media-index.json'), 'utf8'));
const mediaFiles = mediaData.mediaFiles; // paths like 'assets/images/afg/afg-headquarters.jpg'

// Parse all cards from work.html
const workHtml = fs.readFileSync(path.join(root, 'work.html'), 'utf8');

// Regex for <a href="xyz.html" class="grid-card" ...> ... </a>
const cardRegex = /<a\s+href="([^"]+)"\s+class="grid-card"[^>]*data-title="([^"]*)"[^>]*data-year="([^"]*)"[^>]*data-typology="([^"]*)"[^>]*data-discipline="([^"]*)"[^>]*data-category="([^"]*)"[\s\S]*?<\/a>/gi;

let match;
const cards = [];
// More forgiving card parser
const cardStarts = workHtml.split('<a href="');
for (let i = 1; i < cardStarts.length; i++) {
  const chunk = cardStarts[i];
  if (!chunk.includes('class="grid-card"')) continue;
  
  const href = chunk.substring(0, chunk.indexOf('"'));
  const titleMatch = chunk.match(/data-title="([^"]*)"/);
  const yearMatch = chunk.match(/data-year="([^"]*)"/);
  const typologyMatch = chunk.match(/data-typology="([^"]*)"/);
  const disciplineMatch = chunk.match(/data-discipline="([^"]*)"/);
  const categoryMatch = chunk.match(/data-category="([^"]*)"/);
  const imgMatch = chunk.match(/<img[^>]+src="([^"]*)"/);
  const videoMatch = chunk.match(/<source[^>]+src="([^"]*)"/);

  cards.push({
    href,
    slug: href.replace('.html', ''),
    title: titleMatch ? titleMatch[1] : href.replace('.html', ''),
    year: yearMatch ? yearMatch[1] : '2024',
    typology: typologyMatch ? typologyMatch[1] : 'Architecture',
    discipline: disciplineMatch ? disciplineMatch[1] : 'Architecture',
    category: categoryMatch ? categoryMatch[1] : 'architecture-planning',
    thumbnail: imgMatch ? imgMatch[1] : (videoMatch ? videoMatch[1] : null)
  });
}

console.log('Total cards found in work.html:', cards.length);

// Analyze project pages and assets
const existingHtml = new Set(mediaData.htmlFiles);
const report = {
  totalCards: cards.length,
  existingPages: [],
  missingPages: [],
  projectsWithImagesOnDisk: 0,
  projectsWithoutImagesOnDisk: 0
};

cards.forEach(card => {
  const pageExists = existingHtml.has(card.href);
  
  // Find all media files matching this project slug or folder
  const matchingMedia = mediaFiles.filter(m => {
    const parts = m.split('/');
    if (parts.length >= 3 && parts[1] === 'images') {
      const folder = parts[2];
      if (folder === card.slug) return true;
      if (folder.replace(/-/g, '') === card.slug.replace(/-/g, '')) return true;
      if (folder.replace(/_/g, '-') === card.slug) return true;
    }
    return false;
  });

  const info = {
    ...card,
    pageExists,
    mediaOnDisk: matchingMedia
  };

  if (pageExists) {
    report.existingPages.push(info);
  } else {
    report.missingPages.push(info);
  }

  if (matchingMedia.length > 0) {
    report.projectsWithImagesOnDisk++;
  } else {
    report.projectsWithoutImagesOnDisk++;
  }
});

fs.writeFileSync(path.join(root, 'scripts', 'projects-analysis.json'), JSON.stringify(report, null, 2));

console.log('Existing project pages:', report.existingPages.length);
console.log('Missing project pages:', report.missingPages.length);
console.log('Projects with dedicated images on disk:', report.projectsWithImagesOnDisk);
console.log('Projects without dedicated folder on disk:', report.projectsWithoutImagesOnDisk);
