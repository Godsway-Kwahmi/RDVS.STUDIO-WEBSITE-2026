const fs = require('fs');

// 1. Update work.html filter navigation
let workHtml = fs.readFileSync('work.html', 'utf8');

const oldFilterNavRegex = /<div class="filter-nav"[\s\S]*?<\/div>/;
const newFilterNav = `<div class="filter-nav" role="tablist" aria-label="Filter projects by expertise service">
          <span class="toolbar-label">Services:</span>
          <button type="button" class="filter-btn active" data-filter="all">All</button>
          <button type="button" class="filter-btn" data-filter="architecture-planning">Architecture</button>
          <button type="button" class="filter-btn" data-filter="competitions">Competitions</button>
          <button type="button" class="filter-btn" data-filter="turnkey-build">Design + Build</button>
          <button type="button" class="filter-btn" data-filter="web-design">Digital &amp; Web Design</button>
          <button type="button" class="filter-btn" data-filter="digital-art">Digital Art</button>
          <button type="button" class="filter-btn" data-filter="graphic-design">Graphic Design</button>
          <button type="button" class="filter-btn" data-filter="industrial-design">Industrial &amp; Furniture Design</button>
          <button type="button" class="filter-btn" data-filter="interior-design">Interior Design</button>
          <button type="button" class="filter-btn" data-filter="motion-design">Motion Design</button>
          <button type="button" class="filter-btn" data-filter="vfx-cgi">Visual Effects (VFX) &amp; CGI</button>
        </div>`;

workHtml = workHtml.replace(oldFilterNavRegex, newFilterNav);

// Also replace any interior-architecture references on cards
workHtml = workHtml.replace(/data-filter="interior-architecture"/g, 'data-filter="interior-design"');
workHtml = workHtml.replace(/data-category="interior-architecture"/g, 'data-category="interior-design"');
workHtml = workHtml.replace(/data-discipline="Interior Architecture"/g, 'data-discipline="Interior Design"');
workHtml = workHtml.replace(/data-discipline="interior-architecture"/g, 'data-discipline="interior-design"');
workHtml = workHtml.replace(/>Interior Architecture</g, '>Interior Design<');

fs.writeFileSync('work.html', workHtml, 'utf8');
console.log('Updated work.html: removed Interior Architecture and alphabetized services');

// 2. Update expertise.html
let expHtml = fs.readFileSync('expertise.html', 'utf8');

// Remove Interior Architecture article block
const interiorArchRegex = /<!--\s*02\.\s*Interior Architecture\s*-->[\s\S]*?<\/article>/;
expHtml = expHtml.replace(interiorArchRegex, '');

// Also ensure services in expertise.html are alphabetized and match
fs.writeFileSync('expertise.html', expHtml, 'utf8');
console.log('Updated expertise.html: removed Interior Architecture');

// 3. Update about.html
let aboutHtml = fs.readFileSync('about.html', 'utf8');
aboutHtml = aboutHtml.replace(/architecture,\s*interior architecture,\s*interior design/gi, 'architecture, interior design');
fs.writeFileSync('about.html', aboutHtml, 'utf8');
console.log('Updated about.html: removed Interior Architecture');

// 4. Update asante-interior-design-presentation.html
if (fs.existsSync('asante-interior-design-presentation.html')) {
  let asante = fs.readFileSync('asante-interior-design-presentation.html', 'utf8');
  asante = asante.replace(/Interior Architecture/g, 'Interior Design');
  fs.writeFileSync('asante-interior-design-presentation.html', asante, 'utf8');
  console.log('Updated asante-interior-design-presentation.html');
}

// 5. Update yao-yaa.html
if (fs.existsSync('yao-yaa.html')) {
  let yaoyaa = fs.readFileSync('yao-yaa.html', 'utf8');
  yaoyaa = yaoyaa.replace(/Interior Architecture/g, 'Interior Design');
  fs.writeFileSync('yao-yaa.html', yaoyaa, 'utf8');
  console.log('Updated yao-yaa.html');
}
