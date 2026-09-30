const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && !['index.html','work.html','about.html','contact.html','expertise.html','news.html','rdvschool.html','archive.html'].includes(f));
console.log('Total project HTML files:', files.length);

const projectData = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // Match Year
  const yearMatch = content.match(/<span class="project-spec-label">\s*Year\s*<\/span>\s*<span class="project-spec-val">\s*([^<]+)\s*<\/span>/i)
    || content.match(/Year\s*[:\-]?\s*([0-9]{4})/i)
    || content.match(/data-year="([^"]+)"/i);
  
  const titleMatch = content.match(/<h1 class="project-hero-title">([^<]+)<\/h1>/i)
    || content.match(/<title>([^<|]+)/i);

  const year = yearMatch ? yearMatch[1].trim() : 'Unknown';
  const title = titleMatch ? titleMatch[1].trim() : f.replace('.html', '');
  
  projectData.push({ file: f, title, year });
});

const yearCounts = {};
projectData.forEach(p => {
  yearCounts[p.year] = (yearCounts[p.year] || 0) + 1;
});

console.log('Year distribution across project HTML files:');
console.log(JSON.stringify(yearCounts, null, 2));
