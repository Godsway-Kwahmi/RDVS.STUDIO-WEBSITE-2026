const fs = require('fs');
const html = fs.readFileSync('work.html', 'utf8');

const regex = /<a\s+href="([^"]+)"\s+class="grid-card"[\s\S]*?data-title="([^"]+)"[\s\S]*?data-year="([^"]+)"[\s\S]*?<h2 class="card-title">([^<]+)<\/h2>[\s\S]*?<span class="card-year">([^<]+)<\/span>[\s\S]*?<\/a>/g;

let match;
const projects = [];
while ((match = regex.exec(html)) !== null) {
  projects.push({
    href: match[1],
    title: match[4].trim(),
    year: match[3]
  });
}

console.log('Total projects:', projects.length);
// Check for any numbers or years in titles
projects.forEach((p, idx) => {
  const y = p.title.match(/\b(19\d\d|20\d\d)\b/);
  if (y) {
    console.log(`[${idx}] ${p.title} -> mentions ${y[1]}`);
  }
});
