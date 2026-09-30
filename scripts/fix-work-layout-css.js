const fs = require('fs');
let code = fs.readFileSync('css/styles.css', 'utf8');

const target = `/* Grouped Kanban-style columns for Work Page */
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
}`;

const replacement = `/* Grouped layout as Rows for Work Page */
.grouped-layout-rows {
  display: flex !important;
  flex-direction: column;
  gap: 64px;
}

.group-row-section {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.group-row-title {
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--foreground);
  border-bottom: 1px solid var(--border-hairline);
  padding-bottom: 12px;
  margin-bottom: 16px;
}`;

code = code.replace(target, replacement);
fs.writeFileSync('css/styles.css', code);
console.log('updated css/styles.css');
