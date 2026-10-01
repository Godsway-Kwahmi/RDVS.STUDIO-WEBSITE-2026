const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/.gemini/antigravity/brain/9e85bdf8-539f-4469-a2dd-2fab8533f1ae/.system_generated/steps/1392/content.md', 'utf8');

// Find all hrefs
const hrefMatches = [...content.matchAll(/href=["']([^"']+)["']/gi)].map(m => m[1]);
console.log('Total hrefs:', hrefMatches.length);

const socialMatches = hrefMatches.filter(h => 
  h.includes('instagram') || 
  h.includes('twitter') || 
  h.includes('x.com') || 
  h.includes('facebook') || 
  h.includes('youtube') || 
  h.includes('linkedin') || 
  h.includes('behance') || 
  h.includes('vimeo') || 
  h.includes('tiktok') || 
  h.includes('pinterest')
);

console.log('Social matches:');
console.log([...new Set(socialMatches)]);

// Check footer text or sections
const footerIndex = content.toLowerCase().indexOf('footer');
if (footerIndex !== -1) {
  console.log('\nFooter excerpt:');
  console.log(content.slice(footerIndex, footerIndex + 2000));
}

// Find all URLs
const urlRegex = /https?:\/\/[^\s"'<>]+/gi;
const allUrls = [...content.matchAll(urlRegex)].map(m => m[0]);
const uniqueUrls = [...new Set(allUrls)].filter(u => !u.includes('webflow') && !u.includes('google') && !u.includes('w3.org'));
console.log('\nAll unique external URLs found:');
console.log(uniqueUrls);
