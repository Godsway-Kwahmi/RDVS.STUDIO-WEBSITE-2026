const fs = require('fs');

// 1. Update js/work.js
let workJs = fs.readFileSync('js/work.js', 'utf8');

const oldRender = `    // 4. Render Layout
    projectGrid.innerHTML = ''; // clear grid
    projectGrid.classList.add('grouped-layout');
    projectGrid.classList.remove('minimal-grid'); // remove old grid styling

    let found = visibleCards.length;

    if (found === 0) {
      let msg = document.createElement('div');
      msg.id = 'search-msg';
      msg.style.width = '100%';
      msg.style.padding = '40px 0';
      msg.style.fontSize = '1.2rem';
      msg.style.color = 'rgba(255,255,255,0.6)';
      msg.textContent = \`No projects found matching your criteria.\`;
      projectGrid.appendChild(msg);
      return;
    }

    groups.forEach((cardsInGroup, groupName) => {
      const col = document.createElement('div');
      col.className = 'group-column';
      
      const title = document.createElement('h3');
      title.className = 'group-title';
      title.textContent = groupName;
      
      col.appendChild(title);
      
      cardsInGroup.forEach(c => {
        c.style.display = 'block';
        col.appendChild(c);
      });
      
      projectGrid.appendChild(col);
    });`;

const newRender = `    // 4. Render Layout — Horizontal Rows (most recent year at top)
    projectGrid.innerHTML = ''; // clear grid
    projectGrid.classList.remove('grouped-layout');
    projectGrid.classList.remove('minimal-grid');
    projectGrid.classList.add('grouped-rows-layout');

    let found = visibleCards.length;

    if (found === 0) {
      let msg = document.createElement('div');
      msg.id = 'search-msg';
      msg.style.width = '100%';
      msg.style.padding = '40px 0';
      msg.style.fontSize = '1.2rem';
      msg.style.color = 'rgba(255,255,255,0.6)';
      msg.textContent = \`No projects found matching your criteria.\`;
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
    });`;

if (!workJs.includes(oldRender)) {
  console.error('Could not find oldRender in js/work.js');
} else {
  workJs = workJs.replace(oldRender, newRender);
  fs.writeFileSync('js/work.js', workJs, 'utf8');
  console.log('Successfully updated js/work.js with row-by-row layout');
}

// 2. Update css/styles.css
let stylesCss = fs.readFileSync('css/styles.css', 'utf8');

const oldCss = `/* Grouped Kanban-style columns for Work Page */
.grouped-layout {
  display: flex !important;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 40px;
  align-items: flex-start;
}

.group-column {
  flex: 1 1 300px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.group-title {
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-hairline);
  padding-bottom: 12px;
  margin-bottom: 8px;
}`;

const newCss = `/* Work Page Row-by-Row Layout System */
.grouped-rows-layout {
  display: flex !important;
  flex-direction: column !important;
  gap: 80px;
  width: 100%;
}

.work-group-row {
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
}

.work-group-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid var(--border-hairline);
  padding-bottom: 14px;
}

.work-group-title {
  font-size: clamp(1.35rem, 2.5vw, 1.85rem);
  font-weight: 400;
  letter-spacing: -0.01em;
  color: var(--foreground);
  margin: 0;
}

.work-group-count {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  font-feature-settings: "tnum";
}`;

if (!stylesCss.includes(oldCss)) {
  console.error('Could not find oldCss in css/styles.css');
} else {
  stylesCss = stylesCss.replace(oldCss, newCss);
  fs.writeFileSync('css/styles.css', stylesCss, 'utf8');
  console.log('Successfully updated css/styles.css with row-by-row layout');
}
