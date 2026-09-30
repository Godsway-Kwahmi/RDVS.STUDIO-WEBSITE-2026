const fs = require('fs');

// ── 1. Update index.html: Add service name line + change "Specifications" to "Details" ──

let html = fs.readFileSync('index.html', 'utf8');

// Map discipline codes to display service names
const serviceMap = {
  'Space / Commercial Build': 'Interior Design & Design + Build',
  'Architecture / Residential': 'Architecture',
  'Urbanism / Concept': 'Architecture',
  'Workplace / Build': 'Interior Design & Design + Build',
  'Architecture / Private Residence': 'Architecture',
  'Architecture / Commercial': 'Architecture',
  'Space / Interior Architecture': 'Interior Design',
  'Space / Corporate Build': 'Interior Design & Design + Build',
  'Visuals / Computational Design': 'Motion Design',
  'Architecture / Civic Build': 'Architecture',
};

// For each caption card, insert a service-name <p> above the project-category <p>
// Pattern: <div class="caption-card"...>\n  <p class="project-category">Category / Type — Year</p>
// We add: <p class="project-service">SERVICE NAME</p> before <p class="project-category">

const captionRegex = /(<div class="caption-card[^"]*"[^>]*>\s*\n\s*)<p class="project-category">([^<]+)<\/p>/g;

html = html.replace(captionRegex, (match, prefix, categoryText) => {
  // Extract the typology part before the year (e.g. "Space / Commercial Build" from "Space / Commercial Build — 2024")
  const typologyPart = categoryText.split('—')[0].trim();
  const serviceName = serviceMap[typologyPart] || 'Architecture';
  return `${prefix}<p class="project-service">${serviceName}</p>\n              <p class="project-category">${categoryText}</p>`;
});

// Change all "Specifications" to "Details"
html = html.replace(/>Specifications<\/button>/g, '>Details</button>');

fs.writeFileSync('index.html', html);
console.log('✓ index.html updated: added service names + changed Specifications → Details');


// ── 2. Update js/main.js: Add service field + populate it dynamically ──

let js = fs.readFileSync('js/main.js', 'utf8');

// Add a "service" property to each masterProject based on its "discipline" field
// We map discipline → display name
const disciplineToService = {
  'architecture': 'Architecture',
  'interiors': 'Interior Design',
  'vfx': 'Motion Design',
  'graphic-design': 'Graphic Design',
  'motion-design': 'Motion Design',
};

// For each project object, after the "discipline" line, inject a "service" line
js = js.replace(/"discipline":\s*"([^"]+)"/g, (match, discipline) => {
  const service = disciplineToService[discipline] || 'Architecture';
  return `${match},\n      "service": "${service}"`;
});

// Update populateRandomizedSlides to populate the service name
// Find the line: if (catEl) catEl.textContent = proj.category;
// Insert before it: const serviceEl = captionCards[idx].querySelector('.project-service');
//                    if (serviceEl) serviceEl.textContent = proj.service || '';
js = js.replace(
  "if (catEl) catEl.textContent = proj.category;",
  `const serviceEl = captionCards[idx].querySelector('.project-service');\n        if (serviceEl) serviceEl.textContent = proj.service || '';\n        if (catEl) catEl.textContent = proj.category;`
);

fs.writeFileSync('js/main.js', js);
console.log('✓ main.js updated: added service field + dynamic service name population');


// ── 3. Add CSS for .project-service ──

let cssPath = null;
const possibleCss = ['css/style.css', 'css/main.css', 'css/styles.css', 'style.css'];
for (const p of possibleCss) {
  if (fs.existsSync(p)) {
    cssPath = p;
    break;
  }
}

if (cssPath) {
  let css = fs.readFileSync(cssPath, 'utf8');
  
  // Add styling for .project-service if not already present
  if (!css.includes('.project-service')) {
    css += `

/* Service Name Label — Above Category in Hero Slideshow */
.project-service {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.45);
  margin: 0 0 4px 0;
  padding: 0;
}
`;
    fs.writeFileSync(cssPath, css);
    console.log('✓ CSS updated: added .project-service styling to', cssPath);
  }
} else {
  console.log('⚠ No CSS file found, please add .project-service styles manually');
}

console.log('\nDone! All changes applied.');
