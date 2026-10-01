const fs = require('fs');
const path = require('path');

const rootDir = 's:/Dropbox/Dropbox/RDVS-BRANDING/DESIGN/WEBSITE/RDVS.STUDIO-WEBSITE-2026';

function safeWrite(filePath, content) {
  const tmp = filePath + '.tmp_' + Date.now();
  fs.writeFileSync(tmp, content, 'utf8');
  fs.copyFileSync(tmp, filePath);
  fs.unlinkSync(tmp);
}

const replacements = [
  {
    regex: /https?:\/\/(www\.)?instagram\.com\/revivaldesignvfx\/?/g,
    replacement: 'https://www.instagram.com/rdvs.studio/'
  },
  {
    regex: /https?:\/\/(www\.)?twitter\.com\/rdvsgh\/?/g,
    replacement: 'https://x.com/RDVS_DESIGN'
  },
  {
    regex: /https?:\/\/(www\.)?facebook\.com\/revivaldesignvfx\/?/g,
    replacement: 'https://www.facebook.com/RDVS.DESIGN/'
  },
  {
    regex: /https?:\/\/(www\.)?youtube\.com\/@rdvsgh\/?/g,
    replacement: 'https://www.youtube.com/@rdvstudiosgh'
  }
];

let totalFilesModified = 0;
let totalReplacements = 0;
const modifiedList = [];

// 1. Process root HTML files
const rootEntries = fs.readdirSync(rootDir, { withFileTypes: true });
for (const entry of rootEntries) {
  if (entry.isFile() && /\.html$/i.test(entry.name)) {
    const fullPath = path.join(rootDir, entry.name);
    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;
    let fileReplacements = 0;

    for (const r of replacements) {
      const matches = content.match(r.regex);
      if (matches) {
        content = content.replace(r.regex, r.replacement);
        fileReplacements += matches.length;
        modified = true;
      }
    }

    if (modified) {
      safeWrite(fullPath, content);
      totalFilesModified++;
      totalReplacements += fileReplacements;
      modifiedList.push({ file: entry.name, count: fileReplacements });
    }
  }
}

// 2. Process js directory
const jsDir = path.join(rootDir, 'js');
if (fs.existsSync(jsDir)) {
  const jsEntries = fs.readdirSync(jsDir, { withFileTypes: true });
  for (const entry of jsEntries) {
    if (entry.isFile() && /\.js$/i.test(entry.name)) {
      const fullPath = path.join(jsDir, entry.name);
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      let fileReplacements = 0;

      for (const r of replacements) {
        const matches = content.match(r.regex);
        if (matches) {
          content = content.replace(r.regex, r.replacement);
          fileReplacements += matches.length;
          modified = true;
        }
      }

      if (modified) {
        safeWrite(fullPath, content);
        totalFilesModified++;
        totalReplacements += fileReplacements;
        modifiedList.push({ file: 'js/' + entry.name, count: fileReplacements });
      }
    }
  }
}

console.log(`Successfully updated ${totalFilesModified} files with ${totalReplacements} link replacements.`);
console.log('Sample of updated files:');
console.log(modifiedList.slice(0, 10));
