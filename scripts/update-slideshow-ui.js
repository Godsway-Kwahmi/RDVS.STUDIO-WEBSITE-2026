const fs = require('fs');

// --- 1. UPDATE index.html ---
let html = fs.readFileSync('index.html', 'utf8');

// The current caption looks like:
// <p class="project-service">Architecture</p>
// <p class="project-category">Architecture / Campus Masterplan — 2024</p>
// <h1 class="project-title">...</h1>
// <p class="project-desc">...</p>

// We want to combine service and year:
// <p class="project-service">ARCHITECTURE — 2024</p>
// And delete project-category and project-desc.

const captionBlockRegex = /<p class="project-service">([^<]+)<\/p>\s*<p class="project-category">[^—]+—\s*(\d{4})<\/p>\s*<h([12]) class="project-title">([^<]+)<\/h[12]>\s*<p class="project-desc">[^<]+<\/p>/g;

html = html.replace(captionBlockRegex, (match, service, year, hLevel, title) => {
  return `<p class="project-service">${service.toUpperCase()} — ${year}</p>
              <h${hLevel} class="project-title">${title}</h${hLevel}>`;
});

fs.writeFileSync('index.html', html);
console.log('✓ index.html updated: Combined service+year, removed desc and category');


// --- 2. UPDATE js/main.js ---
let js = fs.readFileSync('js/main.js', 'utf8');

// Update populateRandomizedSlides logic
// Find the block:
// const serviceEl = captionCards[idx].querySelector('.project-service');
// if (serviceEl) serviceEl.textContent = proj.service || '';
// if (catEl) catEl.textContent = proj.category;
// if (titleEl) titleEl.textContent = proj.title;
// if (descEl) descEl.textContent = proj.desc;

const updateLogicRegex = /const serviceEl = captionCards\[idx\]\.querySelector\('\.project-service'\);\s*if \(serviceEl\) serviceEl\.textContent = proj\.service \|\| '';\s*if \(catEl\) catEl\.textContent = proj\.category;\s*if \(titleEl\) titleEl\.textContent = proj\.title;\s*if \(descEl\) descEl\.textContent = proj\.desc;/g;

const newUpdateLogic = `const serviceEl = captionCards[idx].querySelector('.project-service');
        if (serviceEl) {
          const year = proj.specs && proj.specs.year ? proj.specs.year : (proj.category.match(/—\\s*(\\d{4})/) ? proj.category.match(/—\\s*(\\d{4})/)[1] : '');
          serviceEl.textContent = ((proj.service || '').toUpperCase() + (year ? ' — ' + year : ''));
        }
        if (titleEl) titleEl.textContent = proj.title;`;

js = js.replace(updateLogicRegex, newUpdateLogic);

fs.writeFileSync('js/main.js', js);
console.log('✓ main.js updated: populateRandomizedSlides now sets service + year and skips desc/category');

