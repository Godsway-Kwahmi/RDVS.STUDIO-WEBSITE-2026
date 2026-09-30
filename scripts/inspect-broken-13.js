const fs = require('fs');
const path = require('path');

const root = process.cwd();
const files = [
  'the-hamlet-presentation.html',
  'the-saddle.html',
  'the-tea-house.html',
  'victoria-island-naija-project.html',
  'views-from-airport-hills.html',
  'villa-aggregate.html',
  'vodafone-red-hse.html',
  'vr-photos.html',
  'wcigl.html',
  'web-design-design.html',
  'west-cantonments-igl-presentation.html',
  'west-hills-mall.html',
  'yao-yaa.html'
];

const mediaData = JSON.parse(fs.readFileSync(path.join(root, 'scripts', 'media-index.json'), 'utf8'));
const allMedia = mediaData.mediaFiles;

const report = {};

files.forEach(f => {
  const content = fs.readFileSync(path.join(root, f), 'utf8');
  const imgs = (content.match(/src=["']([^"']+)["']/g) || []).map(s => s.replace(/src=["']/, '').replace(/["']/, ''));
  const slug = f.replace('.html', '');
  
  // Find potential matches in allMedia
  const candidateMedia = allMedia.filter(m => {
    const lower = m.toLowerCase();
    const slugParts = slug.split('-');
    return slugParts.some(p => p.length > 3 && lower.includes(p));
  });

  report[f] = {
    imgsInHtml: imgs,
    candidateMedia: candidateMedia.slice(0, 10)
  };
});

fs.writeFileSync(path.join(root, 'scripts', 'broken-13-analysis.json'), JSON.stringify(report, null, 2));
console.log('Analysis written to scripts/broken-13-analysis.json');
