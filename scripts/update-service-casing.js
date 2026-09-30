const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');

// Replace the serviceEl textContent logic
const oldLogic = /serviceEl\.textContent = \(\(proj\.service \|\| ''\)\.toUpperCase\(\) \+ \(year \? ' — ' \+ year : ''\)\);/g;

const newLogic = `
            let servicesText = '';
            if (Array.isArray(proj.services)) {
              servicesText = proj.services.map(s => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')).join(', ');
            } else if (proj.service) {
              servicesText = proj.service.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
            }
            serviceEl.textContent = servicesText + (year ? ' — ' + year : '');
`;

js = js.replace(oldLogic, newLogic);

fs.writeFileSync('js/main.js', js);
console.log('✓ Updated main.js to support multiple services in Title Case');

