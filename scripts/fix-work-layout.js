const fs = require('fs');
let code = fs.readFileSync('js/work.js', 'utf8');

const target = `    // 4. Render Layout
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
    });
  }`;

const replacement = `    // 4. Render Layout
    projectGrid.innerHTML = ''; // clear grid
    projectGrid.classList.add('grouped-layout-rows');
    projectGrid.classList.remove('minimal-grid'); // remove old grid styling
    projectGrid.classList.remove('grouped-layout');

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
      const rowSection = document.createElement('div');
      rowSection.className = 'group-row-section';
      
      const title = document.createElement('h3');
      title.className = 'group-row-title';
      title.textContent = groupName;
      rowSection.appendChild(title);
      
      const grid = document.createElement('div');
      grid.className = 'minimal-grid';
      
      cardsInGroup.forEach(c => {
        c.style.display = 'block';
        grid.appendChild(c);
      });
      
      rowSection.appendChild(grid);
      projectGrid.appendChild(rowSection);
    });
  }`;

code = code.replace(target, replacement);
fs.writeFileSync('js/work.js', code);
console.log('updated js/work.js');
