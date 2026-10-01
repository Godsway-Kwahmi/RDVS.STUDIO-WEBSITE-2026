const fs = require('fs');
const path = require('path');

const tubeDir = 'S:\\Dropbox\\Dropbox\\RDVS_TUBE';
const assetsVideosDir = path.resolve('assets/videos');

const copies = [
  { src: path.join(tubeDir, '1957', 'DUPLEX_MASTERBEDROOM', 'Standard_Mode_zoom_in_slowly_with_wind_blowing.mp4'), destFolder: '1957', destName: '1957-lounge.mp4' },
  { src: path.join(tubeDir, 'FUNKO_RIDGE', 'FILM', 'OPEN_TERRACE_007.mp4'), destFolder: 'funko-ridge', destName: 'funko-terrace.mp4' },
  { src: path.join(tubeDir, 'HFC_TVC', '15%.mp4'), destFolder: 'hfc-tvc', destName: 'hfc-commercial.mp4' },
  { src: path.join(tubeDir, 'TOWER_CASCADES', 'TC_IG_INTRO.mp4'), destFolder: 'tower-cascades', destName: 'tower-cascades.mp4' },
  { src: path.join(tubeDir, 'MOTY', 'MOTY_INTRO.mp4'), destFolder: 'moty', destName: 'moty-intro.mp4' },
  { src: path.join(tubeDir, 'viasat1_breakfast_show', 'Breakfast show - TV Show Branding Titles Names on Vimeo.mp4'), destFolder: 'viasat1-breakfast-show', destName: 'viasat1-titles.mp4' },
  { src: path.join(tubeDir, 'VR_SHOWCASE', '360VIDEOSLIDESHOW.mp4'), destFolder: 'vr-showcase', destName: 'vr-showcase.mp4' },
  { src: path.join(tubeDir, '5AAP', 'VID-20200712-WA0045.mp4'), destFolder: '5aap', destName: '5aap-progress.mp4' }
];

for (const c of copies) {
  if (fs.existsSync(c.src)) {
    const destDir = path.join(assetsVideosDir, c.destFolder);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    const destPath = path.join(destDir, c.destName);
    if (!fs.existsSync(destPath)) {
      fs.copyFileSync(c.src, destPath);
      console.log(`Copied ${c.destName} -> ${c.destFolder}`);
    } else {
      console.log(`Already exists: ${c.destName} in ${c.destFolder}`);
    }
  } else {
    console.log(`Source not found: ${c.src}`);
  }
}
