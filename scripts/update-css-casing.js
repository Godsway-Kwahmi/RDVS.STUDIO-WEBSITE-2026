const fs = require('fs');
let css = fs.readFileSync('css/styles.css', 'utf8');

// The string 'text-transform: uppercase;' occurs multiple times in styles.css.
// I need to only remove it from .project-service block.
const regex = /\.project-service\s*\{([^}]+)\}/g;
css = css.replace(regex, (match, body) => {
  return `.project-service {${body.replace('text-transform: uppercase;', '/* text-transform removed */')}}`;
});

fs.writeFileSync('css/styles.css', css);
console.log('✓ CSS text-transform removed from .project-service');
