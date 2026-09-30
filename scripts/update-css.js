const fs = require('fs');

let css = fs.readFileSync('css/styles.css', 'utf8');

css = css.replace(/aspect-ratio:\s*3\/2;/g, '/* aspect-ratio: 3/2; removed for natural proportions */');

const newCSS = `
/* Grouped Kanban-style columns for Work Page */
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
}
`;

if (!css.includes('.grouped-layout')) {
  css += newCSS;
}

fs.writeFileSync('css/styles.css', css);
console.log('CSS Updated');
