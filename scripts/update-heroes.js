const fs = require('fs');

// 1. Parse all HTML files to map projectUrl to its hero image/video
const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && !['index.html', 'about.html', 'work.html', 'contact.html', 'archive.html', 'news.html', 'expertise.html', 'rdvschool.html'].includes(f));

const projectHeroes = {};

files.forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  
  // Look for something with class hero-img or project-hero-img
  const imgMatch = html.match(/class="[^"]*(hero-img|project-hero-img)[^"]*"[^>]*src="([^"]+)"/);
  const imgMatchAlt = html.match(/src="([^"]+)"[^>]*class="[^"]*(hero-img|project-hero-img)[^"]*"/);
  
  let heroUrl = null;
  if (imgMatch) heroUrl = imgMatch[2];
  else if (imgMatchAlt) heroUrl = imgMatchAlt[1];
  
  // Look for video hero (e.g. video class hero-video or inside hero section)
  // Usually <video ... src="...">
  const vidMatch = html.match(/class="[^"]*(hero-video|project-hero-video)[^"]*"[^>]*src="([^"]+)"/);
  const vidMatchAlt = html.match(/src="([^"]+)"[^>]*class="[^"]*(hero-video|project-hero-video)[^"]*"/);
  
  if (vidMatch) heroUrl = vidMatch[2];
  else if (vidMatchAlt) heroUrl = vidMatchAlt[1];
  
  if (!heroUrl) {
    // Just find the very first image or video in the <main> block
    const mainMatch = html.match(/<main[\s\S]*?(<img[^>]+src="([^"]+)"|<video[^>]+src="([^"]+)")/);
    if (mainMatch) {
      heroUrl = mainMatch[2] || mainMatch[3];
    }
  }

  if (heroUrl) {
    projectHeroes[f] = heroUrl;
  }
});

console.log('Found heroes:', Object.keys(projectHeroes).length);

// 2. Update masterProjects in main.js
let js = fs.readFileSync('js/main.js', 'utf8');

// We need to parse masterProjects, but it's JS code. Let's do string replacement.
for (const [projectUrl, heroUrl] of Object.entries(projectHeroes)) {
  // Find block like: "projectUrl": "afg.html", \n "imageUrl": "...",
  // We can use a regex to replace imageUrl for this specific projectUrl
  const blockRegex = new RegExp(`("projectUrl"\\s*:\\s*"${projectUrl}"[\\s\\S]*?"imageUrl"\\s*:\\s*")[^"]+(")`);
  js = js.replace(blockRegex, `$1${heroUrl}$2`);
  
  // also handle imageUrl before projectUrl
  const blockRegex2 = new RegExp(`("imageUrl"\\s*:\\s*")[^"]+("[\\s\\S]*?"projectUrl"\\s*:\\s*"${projectUrl}")`);
  js = js.replace(blockRegex2, `$1${heroUrl}$2`);
}

fs.writeFileSync('js/main.js', js);
console.log('Updated main.js masterProjects with hero images');
