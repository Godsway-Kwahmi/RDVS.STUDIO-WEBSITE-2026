const fs = require('fs');
let cli = fs.readFileSync('sanity.cli.ts', 'utf8');
cli = cli.replace("studioHost: 'rdvs-studio-cms'", "studioHost: 'rdvs'");
fs.writeFileSync('sanity.cli.ts', cli);
console.log('done');
