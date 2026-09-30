const fs = require('fs');
let css = fs.readFileSync('css/styles.css', 'utf8');
css = css.replace(/\.card-img\s*\{/, '.card-img {\n  display: block;');
fs.writeFileSync('css/styles.css', css);
