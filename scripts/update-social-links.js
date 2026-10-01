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
            <a href="https://www.instagram.com/revivaldesignvfx/" target="_blank" rel="noopener noreferrer" style="color: var(--foreground);">Instagram</a>
            <a href="https://twitter.com/rdvsgh" target="_blank" rel="noopener noreferrer" style="color: var(--foreground);">Twitter</a>
            <a href="https://www.facebook.com/revivaldesignvfx/" target="_blank" rel="noopener noreferrer" style="color: var(--foreground);">Facebook</a>
            <a href="https://www.youtube.com/@rdvsgh" target="_blank" rel="noopener noreferrer" style="color: var(--foreground);">YouTube</a>
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
          <a href="https://www.instagram.com/revivaldesignvfx/" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://twitter.com/rdvsgh" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://www.facebook.com/revivaldesignvfx/" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://www.youtube.com/@rdvsgh" target="_blank" rel="noopener noreferrer">YouTube</a>
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
