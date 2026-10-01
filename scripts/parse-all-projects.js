const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('work.html', 'utf8');
const cardRegex = /<a href="([^"]*)" class="grid-card"[^>]*data-title="([^"]*)"[^>]*data-year="([^"]*)"[^>]*data-typology="([^"]*)"[^>]*data-discipline="([^"]*)"[^>]*data-category="([^"]*)"[\s\S]*?<img src="([^"]*)"/g;

const projects = [];
let match;
while ((match = cardRegex.exec(content)) !== null) {
  const [_, link, title, year, typology, discipline, category, img] = match;
  const slug = link.replace('.html', '');
  
  // Check if video exists
  const videoDir = path.resolve('assets/videos', slug);
  let videoUrl = null;
  if (fs.existsSync(videoDir)) {
    const vFiles = fs.readdirSync(videoDir).filter(f => f.endsWith('.mp4'));
    if (vFiles.length > 0) {
      videoUrl = `assets/videos/${slug}/${vFiles[0]}`;
    }
  }

  projects.push({
    slug,
    title,
    year,
    typology,
    discipline,
    category,
    img,
    videoUrl,
    hasImage: fs.existsSync(path.resolve(img))
  });
}

console.log(`Total projects parsed: ${projects.length}`);
const withVideos = projects.filter(p => p.videoUrl);
console.log(`Projects with videos (${withVideos.length}):`);
withVideos.forEach(p => console.log(`  - [${p.category}] ${p.title} (${p.videoUrl})`));

fs.writeFileSync('scripts/parsed-projects.json', JSON.stringify(projects, null, 2));
