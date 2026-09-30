const fs = require('fs');

let html = fs.readFileSync('work.html', 'utf8');

// The inline script starts with <script> and ends with </script> right before <script src="js/nav.js"></script>
const scriptRegex = /<script>[\s\S]*?document\.addEventListener\('DOMContentLoaded'[\s\S]*?applyFilterAndSort\(\);\s*\}\);\s*<\/script>/;

if (scriptRegex.test(html)) {
  html = html.replace(scriptRegex, '');
  
  // Add <script src="js/work.js"></script> right before js/nav.js
  html = html.replace('<script src="js/nav.js"></script>', '<script src="js/work.js"></script>\n  <script src="js/nav.js"></script>');
  
  fs.writeFileSync('work.html', html);
  console.log('✓ work.html inline script replaced with work.js');
} else {
  console.log('Could not find exact inline script block, or already replaced.');
}

// Update sanity-render.js to delegate to work.js if on work page
let js = fs.readFileSync('js/sanity-render.js', 'utf8');

// In performSearch for work page:
// We want to skip doing the flat filtering if work.js is handling it!
// BUT if we are on work.html, work.js handles BOTH search and layout.
// So in sanity-render.js, we can just say:
// if (isWorkPage && window.RDVSWorkLayout) { window.RDVSWorkLayout.applyFilterAndSort(); return; }
const workSearchRegex = /\/\/\s*──\s*Work Page Search\s*──[\s\S]*?(\/\/\s*──\s*Archive Page Search\s*──)/;
if (workSearchRegex.test(js)) {
  js = js.replace(workSearchRegex, `// ── Work Page Search ──
    if (isWorkPage && window.RDVSWorkLayout) {
      window.RDVSWorkLayout.applyFilterAndSort();
      return;
    }
    
    $1`);
}

// And after Sanity injects HTML:
const sanityHtmlRegex = /projectGrid\.innerHTML = html;\s*console\.log\('\[RDVS Sanity\] Live work projects connected:', sanityProjects\.length\);\s*sanityRendered = true;/;
if (sanityHtmlRegex.test(js)) {
  js = js.replace(sanityHtmlRegex, `projectGrid.setAttribute('data-raw-html', html);
          projectGrid.innerHTML = html;
          console.log('[RDVS Sanity] Live work projects connected:', sanityProjects.length);
          sanityRendered = true;
          document.dispatchEvent(new Event('sanity-projects-rendered'));`);
}

fs.writeFileSync('js/sanity-render.js', js);
console.log('✓ sanity-render.js updated to coordinate with work.js');

