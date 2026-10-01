const fs = require('fs');
const path = require('path');

const tubeDir = 'S:\\Dropbox\\Dropbox\\RDVS_TUBE';
const targetFolders = [
  { tube: '1957\\DUPLEX_MASTERBEDROOM', dest: '1957', pattern: 'Standard_Mode_zoom_in_slowly_with_wind_blowing.mp4' },
  { tube: 'FUNKO_RIDGE\\FILM', dest: 'funko-ridge', pattern: 'OPEN_TERRACE_007.mp4' },
  { tube: 'HFC_TVC', dest: 'hfc-tvc', pattern: '15%.mp4' },
  { tube: 'TOWER_CASCADES', dest: 'tower-cascades', pattern: 'TC_IG_INTRO.mp4' },
  { tube: 'MOTY', dest: 'moty', pattern: 'MOTY_INTRO.mp4' },
  { tube: 'viasat1_breakfast_show', dest: 'viasat1-breakfast-show', pattern: 'Breakfast show - TV Show Branding Titles Names on' },
  { tube: 'VR_SHOWCASE', dest: 'vr-showcase', pattern: '360VIDEOSLIDESHOW.mp4' },
  { tube: '5AAP', dest: '5aap', pattern: 'VID-20200712-WA0045.mp4' }
];

for (const t of targetFolders) {
  const fullPath = path.join(tubeDir, t.tube);
  if (fs.existsSync(fullPath)) {
    const files = fs.readdirSync(fullPath);
    const matched = files.filter(f => f.includes(t.pattern) || (t.pattern.endsWith('.mp4') && f === t.pattern));
    console.log(`${t.dest}: found ${matched.length} files:`, matched);
  } else {
    console.log(`${t.dest}: folder not found: ${fullPath}`);
  }
}
