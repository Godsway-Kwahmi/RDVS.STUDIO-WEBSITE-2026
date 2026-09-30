const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && !['index.html','work.html','about.html','contact.html','expertise.html','news.html','rdvschool.html','archive.html'].includes(f));

const results = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  
  // Try finding year in meta line (e.g. &mdash; 2024 or - 2024 or 2009-2026)
  const metaMatch = content.match(/class="project-meta-line"[^>]*>([\s\S]*?)<\/span>/i);
  let year = null;
  if (metaMatch) {
    const ym = metaMatch[1].match(/\b(20[0-2][0-9])\b/);
    if (ym) year = ym[1];
  }
  
  if (!year) {
    const specMatch = content.match(/<span class="project-spec-label">\s*(?:Completion|Target Year|Year)\s*<\/span>\s*<span class="project-spec-val">\s*([0-9]{4})/i);
    if (specMatch) year = specMatch[1];
  }
  
  results.push({ file: f, year: year || 'None' });
});

const counts = {};
results.forEach(r => counts[r.year] = (counts[r.year] || 0) + 1);
console.log('Results:', JSON.stringify(counts, null, 2));

// Print any files that have a specific year
console.log('Sample with year:', results.filter(r => r.year !== 'None').slice(0, 15));
