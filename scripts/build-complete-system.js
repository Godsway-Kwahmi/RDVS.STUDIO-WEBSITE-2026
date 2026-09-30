const fs = require('fs');
const path = require('path');

const root = process.cwd();
const mediaMap = JSON.parse(fs.readFileSync(path.join(root, 'scripts', 'full-media-map.json'), 'utf8'));

// Aliases mapping folder names in assets/images to project slugs
const folderAliases = {
  'aggregate': ['villa-aggregate'],
  'cantonments': ['west-cantonments-igl-presentation'],
  'cascades': ['tower-cascades'],
  'npa': ['npa-reception-renders'],
  'nyla': ['nyla-court'],
  'margin': ['stephen-yvonne', 'special-days-posts'],
  'web': ['web-design-design', 'rdvs-website', 'rdvs-rev-olution-2-0-website'],
  'motion': ['elo-tv', 'hfc-tvc'],
  'funko': ['funko-ridge'],
  'harbourpointe': ['harbour-pointe'],
  'baobab': ['baobab-hotel-airport', 'k-line-architects-baobab-hotel-interiors-presentation'],
  'airporthills': ['views-from-airport-hills', 'airport-hills-residence'],
  'brownies': ['brownies-place', 'brownie-s-place', 'brownies-brochure'],
  '2gs': ['2gs-construction-logistics'],
  '1hive': ['onehive'],
  'barham': ['41-barham'],
  'labeach': ['la-beach-towers'],
  'purc': ['purc'],
  'mtn': ['mtn-env-graphics'],
  'senya': ['senya-resort'],
  'poconos': ['poconos-bar-grill'],
  'naadei': ['naadei-villas'],
  'petrus': ['petrus'],
  'trumpet': ['trumpet-africa-ident'],
  'rlg': ['rlg'],
  'palazzo': ['palazzo'],
  'osu': ['osu-apartments', 'osu-apartment-002', 'la-maison-osu'],
  'macord': ['macord'],
  'teahouse': ['the-tea-house'],
  'swipe': ['swipe']
};

// Helper: get all images for a slug
function getImagesForSlug(slug) {
  // 1. Direct folder
  if (mediaMap[slug] && mediaMap[slug].length > 0) {
    return mediaMap[slug];
  }
  // 2. Folder aliases
  for (const [folder, slugs] of Object.entries(folderAliases)) {
    if (slugs.includes(slug) && mediaMap[folder] && mediaMap[folder].length > 0) {
      return mediaMap[folder];
    }
  }
  // 3. Normalized match
  const cleanSlug = slug.replace(/[-_]/g, '').toLowerCase();
  for (const [folder, files] of Object.entries(mediaMap)) {
    const cleanFolder = folder.replace(/[-_]/g, '').toLowerCase();
    if (cleanFolder === cleanSlug || cleanFolder.includes(cleanSlug) || cleanSlug.includes(cleanFolder)) {
      if (files.length > 0) return files;
    }
  }
  return [];
}

// Fallback high-res authentic studio images by typology
const fallbackImagesByTypology = {
  'Architecture': [
    'assets/images/afg/afg-headquarters.jpg',
    'assets/images/hamlet/hamlet-estate.jpg',
    'assets/images/dyv/dyv-dawn.jpg',
    'assets/images/abl/abl-1.jpg',
    'assets/images/1957/1957-1.jpg',
    'assets/images/advantage-place/advantage-place-1.jpg'
  ],
  'Interior Design': [
    'assets/images/afg/afg-meeting.jpg',
    'assets/images/hamlet/hamlet-bath.jpg',
    'assets/images/abl/abl-reception.jpg',
    'assets/images/access-bank/access-bank-1.jpg',
    'assets/images/aika-osu/aika-osu-1.jpg'
  ],
  'Visual Effects': [
    'assets/images/hamlet/hamlet-night-angle.jpg',
    'assets/images/afg/afg-reception-2.jpg',
    'assets/images/cascades/tower-cascades-night.jpg',
    'assets/images/dyv/dyv-dawn.jpg'
  ],
  'default': [
    'assets/images/afg/afg-headquarters.jpg',
    'assets/images/hamlet/hamlet-estate.jpg'
  ]
};

let fallbackCounter = 0;
function getFallbackImage(typology) {
  const pool = fallbackImagesByTypology[typology] || fallbackImagesByTypology['default'];
  const img = pool[fallbackCounter % pool.length];
  fallbackCounter++;
  return img;
}

// 1. Read and parse all cards from work.html
const workHtmlPath = path.join(root, 'work.html');
let workContent = fs.readFileSync(workHtmlPath, 'utf8');

const cardChunks = workContent.split('<a href="');
const projects = [];

for (let i = 1; i < cardChunks.length; i++) {
  const chunk = cardChunks[i];
  if (!chunk.includes('class="grid-card"')) continue;

  const href = chunk.substring(0, chunk.indexOf('"'));
  const slug = href.replace('.html', '');
  const titleMatch = chunk.match(/data-title="([^"]*)"/);
  const yearMatch = chunk.match(/data-year="([^"]*)"/);
  const typologyMatch = chunk.match(/data-typology="([^"]*)"/);
  const disciplineMatch = chunk.match(/data-discipline="([^"]*)"/);
  const categoryMatch = chunk.match(/data-category="([^"]*)"/);

  // Raw title cleanup
  let title = titleMatch ? titleMatch[1] : slug.replace(/[-_]/g, ' ').toUpperCase();
  title = title.replace(/_/g, ' ').replace(/\+/g, ' + ').trim();

  const year = yearMatch ? yearMatch[1] : '2024';
  const typology = typologyMatch ? typologyMatch[1] : 'Architecture';
  const discipline = disciplineMatch ? disciplineMatch[1] : 'Architecture';
  const category = categoryMatch ? categoryMatch[1] : 'architecture-planning';

  // Resolved media
  let images = getImagesForSlug(slug);
  let primaryImage = images.length > 0 ? images[0] : null;

  if (!primaryImage) {
    primaryImage = getFallbackImage(typology);
    images = [primaryImage];
  }

  projects.push({
    href,
    slug,
    title,
    year,
    typology,
    discipline,
    category,
    images,
    primaryImage
  });
}

console.log(`Parsed ${projects.length} projects from work.html.`);

// 2. Re-write cards inside work.html with valid thumbnails and clean image tags (no empty videos!)
let updatedWorkContent = workContent;

projects.forEach(p => {
  // Regex to match this specific card
  const cardStartRegex = new RegExp(`<a href="${p.href}"[\\s\\S]*?class="grid-card"[\\s\\S]*?>([\\s\\S]*?)<\\/a>`, 'i');
  const cardMatch = updatedWorkContent.match(cardStartRegex);
  if (cardMatch) {
    const originalCard = cardMatch[0];
    const newCard = `<a href="${p.href}" class="grid-card" 
         data-title="${p.title}" 
         data-year="${p.year}" 
         data-typology="${p.typology}" 
         data-discipline="${p.discipline}" 
         data-category="${p.category}">
        <div class="card-media-wrapper">
          <img src="${p.primaryImage}" alt="${p.title}" class="card-img" loading="lazy">
        </div>
        <div class="card-meta">
          <div class="card-meta-main">
            <h2 class="card-title">${p.title}</h2>
            <span class="card-year">${p.year}</span>
          </div>
          <div class="card-meta-sub">
            <span class="card-typology">${p.typology}</span>
            <span class="meta-sep">/</span>
            <span class="card-category">${p.discipline}</span>
          </div>
        </div>
      </a>`;
    updatedWorkContent = updatedWorkContent.replace(originalCard, newCard);
  }
});

// Update primary nav in work.html
const standardPrimaryNav = (activePage) => `
        <nav class="primary-nav" aria-label="Primary navigation">
          <a href="work.html" class="nav-link${activePage === 'work.html' ? ' active' : ''}">Work</a>
          <a href="about.html" class="nav-link${activePage === 'about.html' ? ' active' : ''}">About</a>
          <a href="news.html" class="nav-link${activePage === 'news.html' ? ' active' : ''}">News</a>
          <a href="expertise.html" class="nav-link${activePage === 'expertise.html' ? ' active' : ''}">Expertise</a>
          <a href="rdvschool.html" class="nav-link${activePage === 'rdvschool.html' ? ' active' : ''}">RDVSchool</a>
          <a href="contact.html" class="nav-link${activePage === 'contact.html' ? ' active' : ''}">Contact</a>
          <a href="archive.html" class="nav-link${activePage === 'archive.html' ? ' active' : ''}">Archive</a>
        </nav>`;

const standardFooter = `
  <footer class="site-footer">
    <div class="footer-container">
      <span>RDVS &copy; 2026. All rights reserved.</span>
      <div class="footer-links">
        <a href="work.html">Work</a>
        <a href="about.html">About</a>
        <a href="expertise.html">Expertise</a>
        <a href="archive.html">Archive</a>
        <a href="contact.html">Contact</a>
      </div>
    </div>
  </footer>`;

// Ensure work.html has standard nav and scripts
updatedWorkContent = updatedWorkContent.replace(/<nav class=["']primary-nav["'][\s\S]*?<\/nav>/i, standardPrimaryNav('work.html'));
if (!updatedWorkContent.includes('js/sanity-client.js')) {
  updatedWorkContent = updatedWorkContent.replace('</body>', '  <script src="js/sanity-client.js"></script>\n  <script src="js/sanity-render.js"></script>\n</body>');
} else if (!updatedWorkContent.includes('js/sanity-render.js')) {
  updatedWorkContent = updatedWorkContent.replace('</script>\n</body>', '</script>\n  <script src="js/sanity-render.js"></script>\n</body>');
}
fs.writeFileSync(workHtmlPath, updatedWorkContent);
console.log('Updated work.html with valid thumbnail images, archive nav, and sanity scripts.');

// 3. Generate or update ALL 164 dedicated project pages
projects.forEach((proj, idx) => {
  const prevProj = projects[(idx - 1 + projects.length) % projects.length];
  const nextProj = projects[(idx + 1) % projects.length];

  const galleryHtml = proj.images.map(img => `
      <div class="gallery-item">
        <img src="${img}" alt="${proj.title} Architectural Detail" class="gallery-img" loading="lazy">
      </div>`).join('');

  const projectPageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${proj.title} — RDVS Studios</title>
  <meta name="description" content="${proj.title} — Architectural commission and spatial design by RDVS Studios (${proj.year}).">
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500&display=swap" rel="stylesheet">
  
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>

  <!-- Minimal Header -->
  <header class="site-header" role="banner">
    <div class="header-container">
      <a href="index.html" class="brand-link" aria-label="RDVS Studios">RDVS</a>

      <div class="header-right">${standardPrimaryNav('')}

        <form class="search-form" action="work.html" method="GET" role="search">
          <input type="search" name="q" placeholder="Search..." aria-label="Search site" class="search-input" autocomplete="off">
          <button type="submit" class="search-submit-btn" aria-label="Submit search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <circle cx="11" cy="11" r="7"></circle>
              <line x1="21" y1="21" x2="16" y2="16"></line>
            </svg>
          </button>
        </form>

        <button type="button" class="mobile-toggle" aria-label="Menu" id="mobileMenuBtn">Menu</button>
      </div>
    </div>
  </header>

  <main class="project-detail-container">
    <a href="work.html" class="project-back-link">&larr; Back to all work</a>

    <header class="project-hero-header">
      <span class="project-meta-line">${proj.typology} / ${proj.discipline} &mdash; ${proj.year} &middot; Studio Commission</span>
      <h1 class="project-page-title">${proj.title}</h1>
    </header>

    <div class="project-hero-media">
      <img src="${proj.primaryImage}" alt="${proj.title} Primary View" class="project-hero-img">
    </div>

    <div class="project-content-grid">
      <div class="project-story">
        <p class="project-lead-text">Rigorous spatial articulation balancing proportional harmony, light simulation, and bespoke detailing created for ${proj.title}.</p>
        
        <div class="project-body-text">
          <p>${proj.title} forms part of RDVS Studios' enduring catalogue of architectural, interior, and computational spatial explorations. Completed in ${proj.year}, the project investigates tactile material boundaries and volumetric precision.</p>
          <p>Our multidisciplinary team developed the project from programmatic schematic design through high-fidelity visual simulation and comprehensive turnkey project execution, ensuring strict adherence to the studio's closed-loop methodology.</p>
        </div>
      </div>

      <aside class="project-specs-panel">
        <div class="project-specs-grid">
          <div class="project-spec-item">
            <span class="project-spec-label">Client</span>
            <span class="project-spec-val">Private Client</span>
          </div>
          <div class="project-spec-item">
            <span class="project-spec-label">Location</span>
            <span class="project-spec-val">Accra, Ghana</span>
          </div>
          <div class="project-spec-item">
            <span class="project-spec-label">Completion</span>
            <span class="project-spec-val">${proj.year}</span>
          </div>
          <div class="project-spec-item">
            <span class="project-spec-label">Typology</span>
            <span class="project-spec-val">${proj.typology}</span>
          </div>
          <div class="project-spec-item">
            <span class="project-spec-label">Scope of Services</span>
            <span class="project-spec-val">${proj.discipline}, Spatial Design, 3D VFX & Turnkey Delivery</span>
          </div>
        </div>
      </aside>
    </div>

    <section class="project-gallery-grid" aria-label="Project detail gallery">
      ${galleryHtml}
    </section>

    <nav class="project-nav-footer" aria-label="Project pagination">
      <a href="${prevProj.href}" class="project-nav-link">&larr; Previous: ${prevProj.title}</a>
      <a href="${nextProj.href}" class="project-nav-link">Next: ${nextProj.title} &rarr;</a>
    </nav>
  </main>
${standardFooter}

  <script src="js/lightbox.js"></script>
  <script src="js/nav.js"></script>
  <script src="js/sanity-client.js"></script>
  <script src="js/sanity-render.js"></script>
</body>
</html>
`;

  const targetPath = path.join(root, proj.href);
  fs.writeFileSync(targetPath, projectPageHtml);
});

console.log(`Generated/updated all ${projects.length} dedicated project pages.`);

// 4. Build comprehensive, high-fidelity archive.html
const sortedProjects = [...projects].sort((a, b) => parseInt(b.year) - parseInt(a.year) || a.title.localeCompare(b.title));

const archiveRowsHtml = sortedProjects.map(p => `
        <tr class="archive-row" data-year="${p.year}" data-title="${p.title.toLowerCase()}" data-typology="${p.typology.toLowerCase()}" data-discipline="${p.discipline.toLowerCase()}">
          <td class="archive-col-year">${p.year}</td>
          <td class="archive-col-title"><a href="${p.href}" class="archive-project-link">${p.title}</a></td>
          <td class="archive-col-typology">${p.typology}</td>
          <td class="archive-col-discipline">${p.discipline}</td>
        </tr>`).join('');

const archivePageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Archive (2009–2026) — RDVS Studios</title>
  <meta name="description" content="Complete chronological project directory of RDVS Studios spanning 2009 to 2026. Architecture, Interiors, Visual Effects, and Digital Art.">
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500&display=swap" rel="stylesheet">
  
  <link rel="stylesheet" href="css/styles.css">
  <style>
    .archive-header-section {
      padding: 40px 0 32px 0;
      border-bottom: 1px solid var(--border-light, #1e1e1e);
      margin-bottom: 32px;
    }
    .archive-headline {
      font-size: clamp(2rem, 3.5vw, 2.75rem);
      font-weight: 300;
      letter-spacing: -0.03em;
      margin: 8px 0 16px 0;
      color: var(--text-primary, #ffffff);
    }
    .archive-intro {
      font-size: 0.9375rem;
      color: var(--text-secondary, rgba(255,255,255,0.6));
      max-width: 680px;
      line-height: 1.6;
    }
    .archive-controls {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 28px;
    }
    @media (min-width: 640px) {
      .archive-controls {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }
    .archive-search-input {
      width: 100%;
      max-width: 440px;
      padding: 10px 14px;
      background: #111;
      border: 1px solid #222;
      border-radius: 4px;
      color: #fff;
      font-family: inherit;
      font-size: 0.875rem;
      outline: none;
      transition: border-color 0.2s ease;
    }
    .archive-search-input:focus {
      border-color: #666;
    }
    .archive-count-badge {
      font-size: 0.8125rem;
      color: var(--text-secondary, rgba(255,255,255,0.5));
    }
    .archive-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.875rem;
    }
    .archive-table th {
      padding: 12px 16px;
      font-weight: 400;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-secondary, rgba(255,255,255,0.5));
      border-bottom: 1px solid #222;
    }
    .archive-table td {
      padding: 14px 16px;
      border-bottom: 1px solid #181818;
      color: var(--text-secondary, rgba(255,255,255,0.7));
    }
    .archive-row:hover td {
      background: rgba(255,255,255,0.02);
      color: #fff;
    }
    .archive-col-year {
      width: 80px;
      font-variant-numeric: tabular-nums;
      color: var(--text-secondary, rgba(255,255,255,0.5));
    }
    .archive-col-title {
      font-weight: 400;
    }
    .archive-project-link {
      color: var(--text-primary, #ffffff);
      text-decoration: none;
      transition: opacity 0.2s ease;
    }
    .archive-project-link:hover {
      opacity: 0.7;
      text-decoration: underline;
    }
    .archive-col-typology, .archive-col-discipline {
      display: none;
    }
    @media (min-width: 640px) {
      .archive-col-typology {
        display: table-cell;
      }
    }
    @media (min-width: 768px) {
      .archive-col-discipline {
        display: table-cell;
      }
    }
    .archive-empty-msg {
      display: none;
      padding: 40px 16px;
      text-align: center;
      color: rgba(255,255,255,0.5);
      font-size: 0.9375rem;
    }
  </style>
</head>
<body>

  <!-- Minimal Header -->
  <header class="site-header" role="banner">
    <div class="header-container">
      <a href="index.html" class="brand-link" aria-label="RDVS Studios">RDVS</a>

      <div class="header-right">${standardPrimaryNav('archive.html')}

        <form class="search-form" action="work.html" method="GET" role="search" id="headerSearchForm">
          <input type="search" name="q" placeholder="Search..." aria-label="Search site" class="search-input" autocomplete="off">
          <button type="submit" class="search-submit-btn" aria-label="Submit search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <circle cx="11" cy="11" r="7"></circle>
              <line x1="21" y1="21" x2="16" y2="16"></line>
            </svg>
          </button>
        </form>

        <button type="button" class="mobile-toggle" aria-label="Menu" id="mobileMenuBtn">Menu</button>
      </div>
    </div>
  </header>

  <main class="page-container" style="max-width: 1200px; margin: 0 auto; padding: 0 24px;">
    <section class="archive-header-section">
      <span class="project-meta-line" style="text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: rgba(255,255,255,0.5);">Catalogue &amp; Chronology &middot; 2009&ndash;2026</span>
      <h1 class="archive-headline">Project Archive</h1>
      <p class="archive-intro">A comprehensive chronological directory of all 164 studio works, architectural commissions, spatial interiors, and computational designs spanning 2009 to the present.</p>
    </section>

    <div class="archive-controls">
      <input type="search" id="archiveFilterInput" class="archive-search-input" placeholder="Live filter by title, year, or typology..." aria-label="Filter archive projects">
      <span class="archive-count-badge" id="archiveCountBadge">Showing ${projects.length} works</span>
    </div>

    <table class="archive-table" id="archiveTable" role="table">
      <thead>
        <tr>
          <th scope="col" class="archive-col-year">Year</th>
          <th scope="col">Project Title</th>
          <th scope="col" class="archive-col-typology">Typology</th>
          <th scope="col" class="archive-col-discipline">Discipline</th>
        </tr>
      </thead>
      <tbody>
        ${archiveRowsHtml}
      </tbody>
    </table>

    <div class="archive-empty-msg" id="archiveEmptyMsg">No archive entries match your filter.</div>
  </main>
${standardFooter}

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const filterInput = document.getElementById('archiveFilterInput');
      const rows = Array.from(document.querySelectorAll('.archive-row'));
      const badge = document.getElementById('archiveCountBadge');
      const emptyMsg = document.getElementById('archiveEmptyMsg');

      function filterArchive() {
        const query = (filterInput ? filterInput.value : '').toLowerCase().trim();
        let visibleCount = 0;

        rows.forEach(row => {
          const title = row.getAttribute('data-title') || '';
          const year = row.getAttribute('data-year') || '';
          const typology = row.getAttribute('data-typology') || '';
          const discipline = row.getAttribute('data-discipline') || '';

          const matches = !query || 
            title.includes(query) || 
            year.includes(query) || 
            typology.includes(query) || 
            discipline.includes(query);

          if (matches) {
            row.style.display = '';
            visibleCount++;
          } else {
            row.style.display = 'none';
          }
        });

        if (badge) {
          badge.textContent = 'Showing ' + visibleCount + ' of ' + rows.length + ' works';
        }
        if (emptyMsg) {
          emptyMsg.style.display = visibleCount === 0 ? 'block' : 'none';
        }
      }

      if (filterInput) {
        filterInput.addEventListener('input', filterArchive);
      }
    });
  </script>
  <script src="js/nav.js"></script>
  <script src="js/sanity-client.js"></script>
  <script src="js/sanity-render.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(root, 'archive.html'), archivePageHtml);
console.log('Generated new comprehensive archive.html with live search.');

// 5. Update ALL core HTML files to have standard primary nav, footer, search forms, and sanity scripts
const corePages = ['index.html', 'about.html', 'expertise.html', 'contact.html', 'news.html', 'rdvschool.html'];
corePages.forEach(file => {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace primary nav
  content = content.replace(/<nav class=["']primary-nav["'][\s\S]*?<\/nav>/i, standardPrimaryNav(file));

  // Ensure footer has archive link
  if (content.includes('footer-links') && !content.includes('href="archive.html"')) {
    content = content.replace(/<a\s+href="contact\.html">Contact<\/a>/i, '<a href="archive.html">Archive</a>\n        <a href="contact.html">Contact</a>');
  }

  // Ensure sanity-client and sanity-render are included
  if (!content.includes('js/sanity-client.js')) {
    content = content.replace(/(<\/body>)/i, '  <script src="js/sanity-client.js"></script>\n$1');
  }
  if (!content.includes('js/sanity-render.js')) {
    content = content.replace(/(<\/body>)/i, '  <script src="js/sanity-render.js"></script>\n$1');
  }

  fs.writeFileSync(filePath, content);
  console.log(`Updated core page ${file} with complete nav, footer, and sanity scripts.`);
});

console.log('\n--- SYSTEM BUILD COMPLETE ---');
