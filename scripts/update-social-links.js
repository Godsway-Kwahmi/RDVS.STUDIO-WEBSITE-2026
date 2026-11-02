// The tool that ORIGINALLY wrote the social clusters into contact.html and every page footer (2026-09-30).
// Its literals are why the site ever shipped a dead link: this file's template carried
// `https://www.youtube.com/@rdvsgh`, and the replacer that later ran over the pages
// (scripts/update_social_links.js, note the UNDERSCORE) rewrote that into `@rdvstudiosgh` -- still dead. The
// owner reported the broken link on 2026-11-01; the wave at `eb91375` corrected the 232 pages, and the four
// hrefs below are now the handles the pages actually serve today:
//   instagram.com/rdvs.studio/   x.com/RDVS_DESIGN   facebook.com/RDVS.DESIGN/   youtube.com/@rdvs.studio
// `scratch/_yt_regex_probe.js` proves the REPLACER's pattern; `scratch/_yt_href_census.py` classifies every
// occurrence of a dead spelling across the tracked tree as a live reference or prose. Both tools now agree,
// and this file is left in the repo as the record of where the block came from -- re-running it would write
// the CURRENT links, not the 2026-09-30 ones.
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// 1. Update contact.html Follow section
const contactPath = path.join(rootDir, 'contact.html');
if (fs.existsSync(contactPath)) {
  let contactHtml = fs.readFileSync(contactPath, 'utf8');
  const followRegex = /<div>\s*<h2[^>]*>Follow<\/h2>\s*<div[^>]*>[\s\S]*?<\/div>\s*<\/div>/i;
  const newFollowBlock = `<div>
          <h2 style="font-size: 1rem; color: var(--foreground); margin-bottom: 8px;">Follow</h2>
          <div style="display: flex; gap: 16px; font-size: 0.9375rem; color: var(--text-secondary); flex-wrap: wrap;">
            <a href="https://www.instagram.com/rdvs.studio/" target="_blank" rel="noopener noreferrer" style="color: var(--foreground);">Instagram</a>
            <a href="https://x.com/RDVS_DESIGN" target="_blank" rel="noopener noreferrer" style="color: var(--foreground);">Twitter</a>
            <a href="https://www.facebook.com/RDVS.DESIGN/" target="_blank" rel="noopener noreferrer" style="color: var(--foreground);">Facebook</a>
            <a href="https://www.youtube.com/@rdvs.studio" target="_blank" rel="noopener noreferrer" style="color: var(--foreground);">YouTube</a>
          </div>
        </div>`;

  if (followRegex.test(contactHtml)) {
    contactHtml = contactHtml.replace(followRegex, newFollowBlock);
    fs.writeFileSync(contactPath, contactHtml, 'utf8');
    console.log('✓ Updated contact.html Follow links');
  }
}

// 2. Update site-footer in all HTML pages
const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.html') && f !== 'index.html');
let footersUpdated = 0;

const socialLinksHtml = `<div class="footer-social-links" aria-label="Social media channels">
          <a href="https://www.instagram.com/rdvs.studio/" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://x.com/RDVS_DESIGN" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://www.facebook.com/RDVS.DESIGN/" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://www.youtube.com/@rdvs.studio" target="_blank" rel="noopener noreferrer">YouTube</a>
        </div>`;

files.forEach(file => {
  const filePath = path.join(rootDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Avoid duplicate injection
  if (content.includes('footer-social-links')) {
    return;
  }

  // Look for:
  // <div class="footer-container">
  //   <span>RDVS &copy; 2026. All rights reserved.</span>
  //   <div class="footer-links">
  //     ...
  //   </div>
  // </div>
  const footerPattern = /(<div class="footer-container">[\s\r\n]*<span>RDVS &copy; 2026\. All rights reserved\.<\/span>[\s\r\n]*)(<div class="footer-links">[\s\S]*?<\/div>)([\s\r\n]*<\/div>)/;
  
  if (footerPattern.test(content)) {
    content = content.replace(footerPattern, (match, prefix, footerLinks, suffix) => {
      return `${prefix}<div class="footer-right">
        ${socialLinksHtml}
        ${footerLinks}
      </div>${suffix}`;
    });
    fs.writeFileSync(filePath, content, 'utf8');
    footersUpdated++;
  }
});

console.log(`✓ Updated footer in ${footersUpdated} pages with social media links`);
