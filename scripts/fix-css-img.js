const fs = require('fs');
let css = fs.readFileSync('css/styles.css', 'utf8');
css = css.replace(/\.card-img\s*\{([\s\S]*?)height:\s*100%;/g, '.card-img {$1height: auto; /* natural height */');
fs.writeFileSync('css/styles.css', css);
console.log('Fixed card-img height');
