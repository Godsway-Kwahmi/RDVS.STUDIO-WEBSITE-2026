const fs = require('fs');

const expertiseBlocks = [
  {
    title: 'Architecture',
    slug: 'architecture-planning',
    desc: 'Contextual architectural design anchored in geometry, climate responsiveness, and structural clarity. Our work spans private residential sanctuaries, multi-tiered mixed-use developments, corporate office towers, and civic institutions. Services encompass masterplanning, volumetric zoning, facade engineering, and full municipal working documentation.',
    viewText: 'View architecture projects &rarr;'
  },
  {
    title: 'Competitions',
    slug: 'competitions',
    desc: 'Speculative architectural proposals, international design competitions, and conceptual masterplanning. We engage in theoretical and competitive architecture to explore innovative structural typologies, push environmental sustainability limits, and develop bold, unconstrained modernist interventions that shape the future of the built environment.',
    viewText: 'View competition entries &rarr;'
  },
  {
    title: 'Design + Build',
    slug: 'turnkey-build',
    desc: 'Direct physical translation of digital architecture. As general contractors with integrated carpentry and fabrication shops, we oversee on-site trade coordination, custom timber milling, metalwork fabrication, and structural execution. We ensure what was visualized in 3D is realized identically in the physical world.',
    viewText: 'View turnkey build projects &rarr;'
  },
  {
    title: 'Digital & Web Design',
    slug: 'web-design',
    desc: 'Minimalist, performance-first digital web design and interactive experiences. We design responsive web architecture, portfolio platforms, and bespoke web interfaces focused on pristine typography, negative space, fast load speeds, and intuitive digital interactions without unnecessary ornament.',
    viewText: 'View web design projects &rarr;'
  },
  {
    title: 'Digital Illustration/ Art',
    slug: 'digital-art',
    desc: 'High-fidelity digital illustration and conceptual art. We craft bespoke visual narratives, editorial illustrations, and conceptual matte paintings using advanced digital painting techniques, tailored for brand campaigns, editorial publications, and immersive digital experiences.',
    viewText: 'View digital illustration projects &rarr;'
  },
  {
    title: 'Graphic Design',
    slug: 'graphic-design',
    desc: 'Understated, typographic-led graphic design and visual identity systems. We develop comprehensive brand identities, editorial monographs, spatial signage, environmental wayfinding, corporate stationery, and packaging design rooted in minimalist European and Swiss modernist principles.',
    viewText: 'View graphic design projects &rarr;'
  },
  {
    title: 'Industrial & Furniture Design',
    slug: 'industrial-design',
    desc: 'Product, furniture, and tactile object design crafted with ergonomic precision and raw material honesty. We design bespoke monolithic conference tables, ergonomic executive furnishings, custom architectural lighting fixtures, acoustic ceiling baffles, and modular joinery fabricated to rigorous tolerances.',
    viewText: 'View industrial design projects &rarr;'
  },
  {
    title: 'Interior Architecture',
    slug: 'interior-architecture',
    desc: 'Structural and spatial internal interventions focused on proportion, circulation, and environmental comfort. We design executive boardrooms, corporate headquarters, hospitality lounges, and bespoke luxury residential layouts. Our methodology integrates acoustic timber walling, continuous glazed partitions, and concealed lighting channels engineered directly into the architectural fabric.',
    viewText: 'View interior architecture projects &rarr;'
  },
  {
    title: 'Interior Design',
    slug: 'interior-design',
    desc: 'Complete interior curation, material palette selection, and bespoke FF&E (furniture, fixtures, and equipment) procurement. We curate tactile textiles, custom upholstery, natural stone accents, decorative lighting, and curated art arrangements that evoke calm sophistication and timeless modernist warmth across private estates and executive suites.',
    viewText: 'View interior design projects &rarr;'
  },
  {
    title: 'Motion Design',
    slug: 'motion-design',
    desc: 'Temporal visual storytelling through dynamic typographic choreography, animated spatial walkthroughs, and abstract broadcast packaging. We translate brand identity into motion for digital displays, architectural video walls, interactive presentations, and cinematic commercial spots.',
    viewText: 'View motion design projects &rarr;'
  },
  {
    title: 'Visual Effects (VFX) & CGI',
    slug: 'vfx-cgi',
    desc: 'High-end cinematic visual effects and digital environment synthesis. Utilizing physically based rendering (PBR) and advanced optical ray tracing, we simulate accurate real-world daylight, twilight scattering, and micro-material textures. We create visual effects sequences, commercial film visual assets, and high-impact digital architectural simulations.',
    viewText: 'View visual effects projects &rarr;'
  }
];

let html = fs.readFileSync('expertise.html', 'utf8');

const startTag = '<div class="expertise-list">';
const endTag = '</div>\\n\\n    <!-- Contact Link -->';

const startIndex = html.indexOf(startTag);
// Use a regex to find the end tag just before Contact Link
const endIndex = html.indexOf('<!-- Contact Link -->', startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  let newHtml = startTag + '\\n';
  
  expertiseBlocks.forEach((block, index) => {
    const numStr = (index + 1).toString().padStart(2, '0');
    newHtml += 
"      <!-- " + numStr + ". " + block.title + " -->\n" +
"      <article class=\"expertise-row\">\n" +
"        <h2 class=\"expertise-name\"><a href=\"work.html?service=" + block.slug + "\" class=\"expertise-link\">" + block.title + "</a></h2>\n" +
"        <div class=\"expertise-desc\">\n" +
"          <p>" + block.desc + "</p>\n" +
"          <a href=\"work.html?service=" + block.slug + "\" class=\"expertise-view-link\">" + block.viewText + "</a>\n" +
"        </div>\n" +
"      </article>\n\n";
  });
  
  newHtml += '    </div>\n\n    ';
  
  // Replace everything between startTag and '<!-- Contact Link -->'
  html = html.substring(0, startIndex) + newHtml + html.substring(endIndex);
  fs.writeFileSync('expertise.html', html);
  console.log('✓ expertise.html updated and alphabetized');
} else {
  console.log('Failed to find expertise grid in expertise.html');
}
