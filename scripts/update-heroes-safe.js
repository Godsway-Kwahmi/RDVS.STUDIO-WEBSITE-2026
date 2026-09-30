const fs = require('fs');

// 1. Get Heroes
const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && !['index.html', 'about.html', 'work.html', 'contact.html', 'archive.html', 'news.html', 'expertise.html', 'rdvschool.html'].includes(f));
const projectHeroes = {};

files.forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  let heroUrl = null;
  
  const imgMatch = html.match(/class="[^"]*(hero-img|project-hero-img)[^"]*"[^>]*src="([^"]+)"/);
  const imgMatchAlt = html.match(/src="([^"]+)"[^>]*class="[^"]*(hero-img|project-hero-img)[^"]*"/);
  
  const vidMatch = html.match(/class="[^"]*(hero-video|project-hero-video)[^"]*"[^>]*src="([^"]+)"/);
  const vidMatchAlt = html.match(/src="([^"]+)"[^>]*class="[^"]*(hero-video|project-hero-video)[^"]*"/);
  
  if (imgMatch) heroUrl = imgMatch[2];
  else if (imgMatchAlt) heroUrl = imgMatchAlt[1];
  else if (vidMatch) heroUrl = vidMatch[2];
  else if (vidMatchAlt) heroUrl = vidMatchAlt[1];
  else {
    const mainMatch = html.match(/<main[\s\S]*?(<img[^>]+src="([^"]+)"|<video[^>]+src="([^"]+)")/);
    if (mainMatch) heroUrl = mainMatch[2] || mainMatch[3];
  }

  if (heroUrl) {
    projectHeroes[f] = heroUrl;
  }
});

// 2. Safely parse and update masterProjects
let js = fs.readFileSync('js/main.js', 'utf8');

// Find the array
const startIndex = js.indexOf('const masterProjects = [');
if (startIndex !== -1) {
  // We will find the closing bracket of the array
  let openBrackets = 0;
  let endIndex = -1;
  const arrayStart = js.indexOf('[', startIndex);
  
  for (let i = arrayStart; i < js.length; i++) {
    if (js[i] === '[') openBrackets++;
    if (js[i] === ']') openBrackets--;
    
    if (openBrackets === 0) {
      endIndex = i;
      break;
    }
  }
  
  if (endIndex !== -1) {
    const arrayStr = js.substring(arrayStart, endIndex + 1);
    try {
      // It might not be strict JSON if there are trailing commas, let's eval it safely
      const projectsArray = eval('(' + arrayStr + ')');
      
      // Update the projects
      projectsArray.forEach(proj => {
        const pUrl = proj.projectUrl;
        if (pUrl && projectHeroes[pUrl]) {
          proj.imageUrl = projectHeroes[pUrl];
        }
      });
      
      // Stringify nicely
      const newArrayStr = JSON.stringify(projectsArray, null, 2);
      
      js = js.substring(0, arrayStart) + newArrayStr + js.substring(endIndex + 1);
      
      // Also let's fix the autoPlay duration!
      // In initCarousel, replace currentDuration logic
      js = js.replace(/currentDuration = isVideo \? 30000 : 6000;/, 'currentDuration = 6000;');
      
      // We will handle video duration dynamically in the video 'loadedmetadata' event
      
      fs.writeFileSync('js/main.js', js);
      console.log('✓ main.js safely updated with hero images');
    } catch (e) {
      console.error('Error parsing masterProjects array:', e);
    }
  }
}
