const fs = require('fs');

let html = fs.readFileSync('work.html', 'utf8');

const navStart = html.indexOf('<div class="filter-nav" role="tablist"');
const navEnd = html.indexOf('</div>', navStart);

if (navStart !== -1 && navEnd !== -1) {
  const newNav = `<div class="filter-nav" role="tablist" aria-label="Filter projects by expertise service">
            <span class="toolbar-label">Services:</span>
            <button type="button" class="filter-btn active" data-filter="all">All</button>
            <button type="button" class="filter-btn" data-filter="architecture-planning">Architecture</button>
            <button type="button" class="filter-btn" data-filter="competitions">Competitions</button>
            <button type="button" class="filter-btn" data-filter="turnkey-build">Design + Build</button>
            <button type="button" class="filter-btn" data-filter="web-design">Digital &amp; Web Design</button>
            <button type="button" class="filter-btn" data-filter="digital-art">Digital Illustration/ Art</button>
            <button type="button" class="filter-btn" data-filter="graphic-design">Graphic Design</button>
            <button type="button" class="filter-btn" data-filter="industrial-design">Industrial &amp; Furniture Design</button>
            <button type="button" class="filter-btn" data-filter="interior-architecture">Interior Architecture</button>
            <button type="button" class="filter-btn" data-filter="interior-design">Interior Design</button>
            <button type="button" class="filter-btn" data-filter="motion-design">Motion Design</button>
            <button type="button" class="filter-btn" data-filter="vfx-cgi">Visual Effects (VFX) &amp; CGI</button>
          `;
  
  html = html.substring(0, navStart) + newNav + html.substring(navEnd);
  fs.writeFileSync('work.html', html);
  console.log('✓ work.html updated with alphabetical services and Digital Illustration/ Art');
} else {
  console.log('Failed to find filter-nav in work.html');
}
