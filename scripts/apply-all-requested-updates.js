const fs = require('fs');
const path = require('path');

const root = process.cwd();

// 1. Acronyms & Special Project Name Mappings
const abbreviations = new Set([
  'AFG', 'DYV', 'ABL', 'MTN', 'PURC', 'HFC', 'WCIGL', 'HQ', 'VFX', 'CGI',
  'TVC', 'VR', 'IGL', 'NPA', 'RLG', '2GS', '5AAP', 'EIC', 'ERT', 'BFA',
  'RDVS', 'SMSGH', 'DETAILS', 'C25', 'B1', 'DRW', 'EHR', 'ACM', 'WHM',
  'KDMRD', 'HVL', 'MOTY', 'MIG', 'AV', 'LED', 'FF&E', 'GH', 'USA', 'UK'
]);

const customNameOverrides = {
  'ONEHIVE': 'OneHive',
  'VIASAT1 BREAKFAST SHOW': 'Viasat1 Breakfast Show',
  'D E T A I L S': 'Details',
  'K LINE ARCHITECTS BAOBAB HOTEL INTERIORS PRESENTATION': 'K-Line Architects Baobab Hotel Interiors Presentation',
  'LA BEACH TOWERS': 'La Beach Towers',
  'LA MAISON OSU': 'La Maison Osu',
  'LA PALM 2008 CHRISTMAS PARTY POSTERS': 'La Palm 2008 Christmas Party Posters',
  'WEST CANTONMENTS IGL PRESENTATION': 'West Cantonments IGL Presentation',
  'WEST HILLS MALL': 'West Hills Mall',
  'ACCRA MILLENIUEM CITY PROJECT PRESENTATION 2012': 'Accra Millennium City Project Presentation 2012',
  '2GS CONSTRUCTION+LOGISTICS': '2GS Construction + Logistics',
  'B1 HQ LAGOS AVE': 'B1 HQ Lagos Ave',
  'MTN ENV GRAPHICS': 'MTN Env Graphics',
  'NPA RECEPTION RENDERS': 'NPA Reception Renders',
  'RDVS REV OLUTION 2 0 WEBSITE': 'RDVS Revolution 2.0 Website',
  'SMSGH HUBTEL': 'SMSGH Hubtel'
};

function toStudioTitleCase(title) {
  if (!title) return '';
  const trimmed = title.trim();
  const normalizedRaw = trimmed.replace(/_/g, ' ').replace(/\s*\+\s*/g, ' + ').replace(/\s+/g, ' ');
  if (customNameOverrides[normalizedRaw.toUpperCase()]) {
    return customNameOverrides[normalizedRaw.toUpperCase()];
  }
  
  return normalizedRaw.split(' ').map(word => {
    if (word.includes('-')) {
      return word.split('-').map(part => formatSingleWord(part)).join('-');
    }
    return formatSingleWord(word);
  }).join(' ');
}

function formatSingleWord(word) {
  if (!word) return '';
  const cleanUpper = word.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (abbreviations.has(cleanUpper)) {
    return word.replace(new RegExp(cleanUpper, 'i'), cleanUpper);
  }
  if (/^\d+$/.test(word)) {
    return word;
  }
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

console.log('--- 1. UPDATING about.html WITH PHOTOGRAPHY SERVICE ---');
const aboutPath = path.join(root, 'about.html');
let aboutContent = fs.readFileSync(aboutPath, 'utf8');

if (!aboutContent.includes('<h3>photography.</h3>')) {
  const targetInsert = '<div class="about-service-item">\n              <h3>digital art.</h3>';
  const photographyBlock = `<div class="about-service-item">
              <h3>photography.</h3>
              <p>Architectural, interior, and spatial photography documenting built form, natural daylight interactions, and tactile materiality.</p>
            </div>
            <div class="about-service-item">
              <h3>digital art.</h3>`;
  aboutContent = aboutContent.replace(targetInsert, photographyBlock);
  fs.writeFileSync(aboutPath, aboutContent);
  console.log('Added photography service to about.html');
} else {
  console.log('Photography service already present in about.html');
}

console.log('--- 2. UPDATING expertise.html WITH PHOTOGRAPHY DISCIPLINE ---');
const expertisePath = path.join(root, 'expertise.html');
let expertiseContent = fs.readFileSync(expertisePath, 'utf8');

if (!expertiseContent.includes('Architectural &amp; Spatial Photography') && !expertiseContent.includes('service=photography')) {
  const insertBeforeContact = '<!-- Contact Link -->';
  const photographyRow = `<!-- 10. Photography -->
      <article class="expertise-row">
        <h2 class="expertise-name"><a href="work.html?service=photography" class="expertise-link">Architectural &amp; Spatial Photography</a></h2>
        <div class="expertise-desc">
          <p>Documenting built architecture, spatial volumes, material textures, and natural daylight interactions. Our photographic practice captures both completed physical projects and spatial prototypes with technical perspective control and natural tonal clarity.</p>
          <a href="work.html?service=photography" class="expertise-view-link">View photography projects &rarr;</a>
        </div>
      </article>

    `;
  expertiseContent = expertiseContent.replace(insertBeforeContact, photographyRow + insertBeforeContact);
  fs.writeFileSync(expertisePath, expertiseContent);
  console.log('Added photography discipline to expertise.html');
} else {
  console.log('Photography discipline already present in expertise.html');
}

console.log('--- 3. UPDATING work.html WITH TITLE CASING AND PHOTOGRAPHY FILTER ---');
const workPath = path.join(root, 'work.html');
let workContent = fs.readFileSync(workPath, 'utf8');

// Add photography filter button if missing
if (!workContent.includes('data-filter="photography"')) {
  workContent = workContent.replace(
    '<button type="button" class="filter-btn" data-filter="motion-design">Motion Design</button>',
    '<button type="button" class="filter-btn" data-filter="motion-design">Motion Design</button>\n          <button type="button" class="filter-btn" data-filter="photography">Photography</button>'
  );
  console.log('Added photography filter button to work.html');
}

// Title Case all project cards in work.html
const cardRegex = /<a href="([^"]+\.html)" class="grid-card"[\s\S]*?<\/a>/gi;
workContent = workContent.replace(cardRegex, (fullCard) => {
  const titleAttrMatch = fullCard.match(/data-title="([^"]*)"/);
  const cardTitleMatch = fullCard.match(/<h2 class="card-title">([^<]*)<\/h2>/);
  
  if (!titleAttrMatch && !cardTitleMatch) return fullCard;

  const currentTitle = titleAttrMatch ? titleAttrMatch[1] : cardTitleMatch[1];
  const newTitle = toStudioTitleCase(currentTitle);

  let updated = fullCard;
  if (titleAttrMatch) {
    updated = updated.replace(`data-title="${titleAttrMatch[1]}"`, `data-title="${newTitle}"`);
  }
  if (cardTitleMatch) {
    updated = updated.replace(`<h2 class="card-title">${cardTitleMatch[1]}</h2>`, `<h2 class="card-title">${newTitle}</h2>`);
  }
  return updated;
});

fs.writeFileSync(workPath, workContent);
console.log('Updated work.html project cards with Title Casing and photography filter.');

console.log('--- 4. UPDATING archive.html WITH TITLE CASING ---');
const archivePath = path.join(root, 'archive.html');
let archiveContent = fs.readFileSync(archivePath, 'utf8');

const archiveRowRegex = /<tr class="archive-row"([\s\S]*?)<\/tr>/gi;
archiveContent = archiveContent.replace(archiveRowRegex, (fullRow) => {
  const linkMatch = fullRow.match(/<a href="([^"]+)" class="archive-project-link">([^<]+)<\/a>/);
  const titleAttrMatch = fullRow.match(/data-title="([^"]*)"/);
  
  if (!linkMatch) return fullRow;

  const currentTitle = linkMatch[2];
  const newTitle = toStudioTitleCase(currentTitle);

  let updated = fullRow.replace(`<a href="${linkMatch[1]}" class="archive-project-link">${currentTitle}</a>`, `<a href="${linkMatch[1]}" class="archive-project-link">${newTitle}</a>`);
  if (titleAttrMatch) {
    updated = updated.replace(`data-title="${titleAttrMatch[1]}"`, `data-title="${newTitle.toLowerCase()}"`);
  }
  return updated;
});

fs.writeFileSync(archivePath, archiveContent);
console.log('Updated archive.html rows with Title Casing.');

console.log('--- 5. UPDATING DEDICATED PROJECT PAGES WITH TITLE CASING ---');
const allHtmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html'));
const coreExclusions = new Set(['index.html', 'work.html', 'about.html', 'expertise.html', 'contact.html', 'news.html', 'rdvschool.html', 'archive.html']);

let projectPagesCount = 0;
allHtmlFiles.forEach(file => {
  if (coreExclusions.has(file)) return;
  const filePath = path.join(root, file);
  let content = fs.readFileSync(filePath, 'utf8');

  const titleMatch = content.match(/<h1 class="project-page-title">([^<]+)<\/h1>/);
  if (!titleMatch) return;

  const oldTitle = titleMatch[1];
  const newTitle = toStudioTitleCase(oldTitle);

  // Replace <title>
  content = content.replace(/<title>([^<]+)<\/title>/, `<title>${newTitle} — RDVS Studios</title>`);
  
  // Replace meta description
  content = content.replace(/<meta name="description" content="([^"]+)">/, `<meta name="description" content="${newTitle} — Architectural commission and spatial design by RDVS Studios.">`);

  // Replace H1
  content = content.replace(`<h1 class="project-page-title">${oldTitle}</h1>`, `<h1 class="project-page-title">${newTitle}</h1>`);

  // Replace hero img alt
  content = content.replace(/alt="([^"]*)" class="project-hero-img"/, `alt="${newTitle} Primary View" class="project-hero-img"`);

  // Replace story text instances of oldTitle
  if (oldTitle !== newTitle) {
    content = content.split(oldTitle).join(newTitle);
  }

  // Update previous/next pagination links if they have old uppercase titles
  const prevNextMatches = [...content.matchAll(/class="project-nav-link">([^<]+)<\/a>/g)];
  prevNextMatches.forEach(m => {
    const rawNavText = m[1];
    let navText = rawNavText;
    if (navText.startsWith('&larr; Previous: ')) {
      const pTitle = navText.replace('&larr; Previous: ', '');
      navText = `&larr; Previous: ${toStudioTitleCase(pTitle)}`;
    } else if (navText.startsWith('Next: ') && navText.endsWith(' &rarr;')) {
      const nTitle = navText.replace('Next: ', '').replace(' &rarr;', '');
      navText = `Next: ${toStudioTitleCase(nTitle)} &rarr;`;
    }
    content = content.replace(`class="project-nav-link">${rawNavText}</a>`, `class="project-nav-link">${navText}</a>`);
  });

  fs.writeFileSync(filePath, content);
  projectPagesCount++;
});
console.log(`Updated ${projectPagesCount} project pages with Title Casing.`);

console.log('--- 6. UPDATING HOMEPAGE index.html (SLIDES, SERVICES, DETAILS BUTTON) ---');
const indexPath = path.join(root, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Mapping of services for the 10 homepage slides
const slideServices = [
  'Interior Design, Turnkey Build',
  'Architecture, Visual Effects',
  'Architecture, Urbanism',
  'Interior Design, Turnkey Build',
  'Architecture, Interior Design',
  'Architecture, Visual Effects',
  'Interior Design',
  'Interior Design, Environmental Graphics',
  'Digital Art, Computational Design',
  'Architecture, Masterplanning'
];

// 1. Replace Specifications -> Details on all buttons
indexContent = indexContent.replace(/<button type="button" class="project-spec-trigger"([^>]*)>Specifications<\/button>/g, '<button type="button" class="project-spec-trigger"$1>Details</button>');

// 2. Remove any "Interior Architecture"
indexContent = indexContent.replace(/Space \/ Interior Architecture — 2024/g, 'Space / Interior Design — 2024');

// 3. Ensure <p class="project-service"> is present in every caption card
for (let i = 0; i < 10; i++) {
  const cardRegex = new RegExp(`(<div class="caption-card[^"]*" data-index="${i}">)([\\s\\S]*?)(<\\/div>)`, 'i');
  const cardMatch = indexContent.match(cardRegex);
  if (cardMatch) {
    let cardInner = cardMatch[2];
    const serviceName = slideServices[i];

    if (!cardInner.includes('class="project-service"')) {
      cardInner = `\n              <p class="project-service">${serviceName}</p>` + cardInner;
    } else {
      cardInner = cardInner.replace(/<p class="project-service">[^<]*<\/p>/, `<p class="project-service">${serviceName}</p>`);
    }

    const updatedCard = `${cardMatch[1]}${cardInner}${cardMatch[3]}`;
    indexContent = indexContent.replace(cardMatch[0], updatedCard);
  }
}

// 4. Update spec drawer header from "Project specifications" to "Project details"
indexContent = indexContent.replace('<span class="drawer-tag">Project specifications</span>', '<span class="drawer-tag">Project details</span>');

fs.writeFileSync(indexPath, indexContent);
console.log('Updated index.html caption cards, services line, and Details buttons.');

console.log('--- 7. UPDATING css/styles.css FOR FULL PROPORTION SLIDES ---');
const cssPath = path.join(root, 'css', 'styles.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Replace .slide-media and .slide-img styling
const oldSlideMediaCss = `.slide-media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.slide-img {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center;
  filter: brightness(0.92);
  transform: none;
}`;

const newSlideMediaCss = `.slide-media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #000000;
}

.slide-img,
.slide-video,
.slide-media video {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
  filter: brightness(0.95);
  transform: none;
}`;

if (cssContent.includes(oldSlideMediaCss)) {
  cssContent = cssContent.replace(oldSlideMediaCss, newSlideMediaCss);
} else {
  // Replace .slide-img directly
  cssContent = cssContent.replace(
    /\.slide-img\s*\{[\s\S]*?\}/,
    `.slide-img,
.slide-video,
.slide-media video {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
  filter: brightness(0.95);
  transform: none;
}`
  );
}

// Add .project-service style if not present
if (!cssContent.includes('.project-service')) {
  const serviceStyle = `
.project-service {
  font-size: 0.8125rem;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4px;
  font-weight: 400;
  text-transform: capitalize;
}
`;
  cssContent = cssContent.replace('.project-category {', serviceStyle + '\n.project-category {');
}

fs.writeFileSync(cssPath, cssContent);
console.log('Updated css/styles.css with full-proportion slide media rules and project-service styles.');

console.log('--- 8. UPDATING js/main.js WITH SLIDE SERVICES, DETAILS, AND VIDEO LOGIC ---');
const mainJsPath = path.join(root, 'js', 'main.js');
let mainJsContent = fs.readFileSync(mainJsPath, 'utf8');

// Ensure Details button text in JS
mainJsContent = mainJsContent.replace("specTrigger.textContent = 'Specifications';", "specTrigger.textContent = 'Details';");

// Ensure populateRandomizedSlides injects project-service
if (!mainJsContent.includes('.project-service')) {
  const targetInsertion = "const catEl = captionCards[idx].querySelector('.project-category');";
  const serviceCode = `const serviceEl = captionCards[idx].querySelector('.project-service');
        if (serviceEl) {
          const sList = proj.specs && proj.specs.disciplines ? proj.specs.disciplines.slice(0, 2) : ['Architecture'];
          serviceEl.textContent = sList.join(', ');
        }
        ` + targetInsertion;
  mainJsContent = mainJsContent.replace(targetInsertion, serviceCode);
}

// Ensure video support in populateRandomizedSlides & slide transition
if (!mainJsContent.includes('slide-video')) {
  // Update slide media population to support video or image
  mainJsContent = mainJsContent.replace(
    "const img = slides[idx].querySelector('.slide-img');\n        if (img) {\n          img.src = proj.imageUrl;\n          img.alt = proj.title;\n        }",
    `const img = slides[idx].querySelector('.slide-img');
        const video = slides[idx].querySelector('.slide-video');
        if (proj.videoUrl) {
          if (video) {
            video.src = proj.videoUrl;
            video.style.display = 'block';
            if (img) img.style.display = 'none';
          }
        } else {
          if (video) video.style.display = 'none';
          if (img) {
            img.style.display = 'block';
            img.src = proj.imageUrl;
            img.alt = proj.title;
          }
        }`
  );
}

fs.writeFileSync(mainJsPath, mainJsContent);
console.log('Updated js/main.js with dynamic services, video support, and Details trigger.');

console.log('\n--- ALL UPDATES APPLIED SUCCESSFULLY ---');
