const fs = require('fs');
const path = require('path');

const tubeDir = 'S:\\Dropbox\\Dropbox\\RDVS_TUBE';
const assetsVideosDir = path.resolve('assets/videos');

const existingAssetsVideos = fs.readdirSync(assetsVideosDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => {
    const files = fs.readdirSync(path.join(assetsVideosDir, d.name)).filter(f => f.endsWith('.mp4'));
    return { folder: d.name, files };
  });

console.log('Existing in assets/videos:', JSON.stringify(existingAssetsVideos, null, 2));

const tubeItems = fs.readdirSync(tubeDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

console.log('Top level folders in RDVS_TUBE:', tubeItems);
