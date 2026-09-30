const fs = require('fs');

// 1. Update work.html
let workHtml = fs.readFileSync('work.html', 'utf8');

// Ensure Interior Architecture button is gone
workHtml = workHtml.replace(/<button[^>]*data-filter="interior-architecture"[^>]*>[\s\S]*?<\/button>\s*/gi, '');

// Ensure services are alphabetized
const filterNavRegex = /<div class="filter-nav"[\s\S]*?<\/div>/;
const alphabetizedFilterNav = `<div class="filter-nav" role="tablist" aria-label="Filter projects by expertise service">
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

workHtml = workHtml.replace(filterNavRegex, alphabetizedFilterNav);

// Update applyFilterAndSort() function in work.html
const oldScriptFunction = /function applyFilterAndSort\(\)\s*\{[\s\S]*?\n      \}/;

const newScriptFunction = `function applyFilterAndSort() {
        const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

        // 1. Sort cards array
        cards.sort((a, b) => {
          let valA, valB;
          if (currentSort === 'date') {
            valA = parseInt(a.getAttribute('data-year'), 10) || 0;
            valB = parseInt(b.getAttribute('data-year'), 10) || 0;
            return currentDirection === 'desc' ? valB - valA : valA - valB;
          } else if (currentSort === 'typology') {
            valA = (a.getAttribute('data-typology') || '').toLowerCase();
            valB = (b.getAttribute('data-typology') || '').toLowerCase();
            return currentDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
          } else if (currentSort === 'discipline') {
            valA = (a.getAttribute('data-discipline') || '').toLowerCase();
            valB = (b.getAttribute('data-discipline') || '').toLowerCase();
            return currentDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
          }
          return 0;
        });

        // 2. Filter visible cards
        const visibleCards = cards.filter(card => {
          const title = (card.getAttribute('data-title') || '').toLowerCase();
          const category = (card.getAttribute('data-category') || '').toLowerCase();
          const typology = (card.getAttribute('data-typology') || '').toLowerCase();
          const discipline = (card.getAttribute('data-discipline') || '').toLowerCase();
          const year = (card.getAttribute('data-year') || '');

          const matchesQuery = !query || 
            title.includes(query) || 
            category.includes(query) || 
            typology.includes(query) || 
            discipline.includes(query) || 
            year.includes(query);

          const services = category.split(/\\s+/);
          const matchesFilter = (currentFilter === 'all') || services.includes(currentFilter) || category.includes(currentFilter);

          return matchesQuery && matchesFilter;
        });

        // 3. Group cards into rows by sort selection
        const groups = new Map();
        visibleCards.forEach(card => {
          let groupKey = 'Other';
          if (currentSort === 'date') {
            groupKey = card.getAttribute('data-year') || 'Undated';
          } else if (currentSort === 'typology') {
            groupKey = card.getAttribute('data-typology') || 'Other';
            if (groupKey) groupKey = groupKey.charAt(0).toUpperCase() + groupKey.slice(1);
          } else if (currentSort === 'discipline') {
            groupKey = card.getAttribute('data-discipline') || 'Other';
            if (groupKey) groupKey = groupKey.charAt(0).toUpperCase() + groupKey.slice(1);
          }

          if (!groups.has(groupKey)) {
            groups.set(groupKey, []);
          }
          groups.get(groupKey).push(card);
        });

        // 4. Render Layout — Horizontal rows with most recent at top
        projectGrid.innerHTML = '';
        projectGrid.className = 'grouped-rows-layout';

        if (visibleCards.length === 0) {
          const msg = document.createElement('div');
          msg.id = 'search-msg';
          msg.style.width = '100%';
          msg.style.padding = '40px 0';
          msg.style.fontSize = '1.2rem';
          msg.style.color = 'rgba(255,255,255,0.6)';
          msg.textContent = 'No projects found matching your criteria.';
          projectGrid.appendChild(msg);
          return;
        }

        groups.forEach((cardsInGroup, groupName) => {
          const section = document.createElement('section');
          section.className = 'work-group-row';

          const header = document.createElement('div');
          header.className = 'work-group-header';

          const title = document.createElement('h2');
          title.className = 'work-group-title';
          title.textContent = groupName;
          header.appendChild(title);

          const count = document.createElement('span');
          count.className = 'work-group-count';
          count.textContent = \`\${cardsInGroup.length} \${cardsInGroup.length === 1 ? 'project' : 'projects'}\`;
          header.appendChild(count);

          section.appendChild(header);

          const grid = document.createElement('div');
          grid.className = 'minimal-grid';

          cardsInGroup.forEach(c => {
            c.style.display = 'block';
            grid.appendChild(c);
          });

          section.appendChild(grid);
          projectGrid.appendChild(section);
        });
      }`;

workHtml = workHtml.replace(oldScriptFunction, newScriptFunction);
fs.writeFileSync('work.html', workHtml, 'utf8');
console.log('Updated work.html with row-by-row layout and removed Interior Architecture');

// 2. Update css/styles.css
let stylesCss = fs.readFileSync('css/styles.css', 'utf8');

const rowCss = `
/* ==========================================================================
   Work Page Row-by-Row Layout System
   ========================================================================== */
.grouped-rows-layout {
  display: flex !important;
  flex-direction: column !important;
  gap: 72px;
  width: 100%;
}

.work-group-row {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.work-group-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid var(--border-hairline);
  padding-bottom: 12px;
}

.work-group-title {
  font-size: clamp(1.35rem, 2.5vw, 1.75rem);
  font-weight: 400;
  letter-spacing: -0.01em;
  color: var(--foreground);
  margin: 0;
}

.work-group-count {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  font-feature-settings: "tnum";
}
`;

if (!stylesCss.includes('.grouped-rows-layout')) {
  stylesCss += rowCss;
  fs.writeFileSync('css/styles.css', stylesCss, 'utf8');
  console.log('Appended row-by-row layout CSS to css/styles.css');
} else {
  console.log('css/styles.css already contains .grouped-rows-layout');
}
