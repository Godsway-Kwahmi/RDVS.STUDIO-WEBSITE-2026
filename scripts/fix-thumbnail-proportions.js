const fs = require('fs');

let css = fs.readFileSync('css/styles.css', 'utf8');

// Replace card-media-wrapper aspect-ratio
css = css.replace(/aspect-ratio:\s*3\/2;/g, '/* aspect-ratio natural */');

// Replace card-img height: 100% and object-fit: cover with height: auto
css = css.replace(
  /\.card-img\s*\{[\s\S]*?object-fit:\s*cover;[\s\S]*?\}/,
  `.card-img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.5s ease;
}`
);

// Ensure .minimal-grid has align-items: start;
css = css.replace(
  /\.minimal-grid\s*\{([^}]*)\}/,
  (match, p1) => {
    if (!p1.includes('align-items')) {
      return `.minimal-grid {${p1}  align-items: start;\n}`;
    }
    return match;
  }
);

fs.writeFileSync('css/styles.css', css, 'utf8');
console.log('Successfully updated css/styles.css to use natural thumbnail proportions');

// Also update work.html video inline styles
let workHtml = fs.readFileSync('work.html', 'utf8');
workHtml = workHtml.replace(/style="object-fit:\s*cover;\s*width:\s*100%;\s*height:\s*100%;"/g, 'style="width: 100%; height: auto; display: block;"');
fs.writeFileSync('work.html', workHtml, 'utf8');
console.log('Successfully updated work.html video styles to use natural proportions');
