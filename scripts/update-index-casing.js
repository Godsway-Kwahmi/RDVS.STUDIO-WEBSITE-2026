const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Find all <p class="project-service">UPPERCASE — YEAR</p>
const regex = /<p class="project-service">([^—<]+) — (\d{4})<\/p>/g;

html = html.replace(regex, (match, serviceStr, year) => {
  const titleCaseService = serviceStr.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  return `<p class="project-service">${titleCaseService} — ${year}</p>`;
});

fs.writeFileSync('index.html', html);
console.log('✓ Updated index.html static slides to Title Case');
