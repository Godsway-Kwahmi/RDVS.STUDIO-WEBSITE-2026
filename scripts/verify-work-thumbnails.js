const fs = require('fs');
const path = require('path');

const root = process.cwd();
const workHtml = fs.readFileSync(path.join(root, 'work.html'), 'utf8');

const imgMatches = [...workHtml.matchAll(/<img[^>]+src=["']([^"']+)["']/g)].map(m => m[1]);
const videoMatches = [...workHtml.matchAll(/<source[^>]+src=["']([^"']+)["']/g)].map(m => m[1]);

console.log('Total img src on work.html:', imgMatches.length);
console.log('Total video src on work.html:', videoMatches.length);

const brokenImgs = imgMatches.filter(src => {
  if (src.startsWith('http') || src.startsWith('data:')) return false;
  return !fs.existsSync(path.join(root, src));
});

const brokenVideos = videoMatches.filter(src => {
  if (src.startsWith('http') || src.startsWith('data:')) return false;
  return !fs.existsSync(path.join(root, src));
});

console.log('Broken img count on work.html:', brokenImgs.length);
if (brokenImgs.length > 0) {
  console.log('Broken images on work.html:', brokenImgs);
}

console.log('Broken video count on work.html:', brokenVideos.length);
if (brokenVideos.length > 0) {
  console.log('Broken videos on work.html:', brokenVideos);
}
