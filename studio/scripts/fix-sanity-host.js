const fs = require('fs');
let cli = fs.readFileSync('sanity.cli.ts', 'utf8');
cli = cli.replace("studioHost: 'rdvs'", "studioHost: 'rdvs-studio-cms'");
fs.writeFileSync('sanity.cli.ts', cli);

let cfg = fs.readFileSync('sanity.config.ts', 'utf8');
cfg = cfg.replace("process.env.SANITY_STUDIO_PROJECT_ID || ''", "'lqnpv8ns'");
fs.writeFileSync('sanity.config.ts', cfg);

console.log('updated cli and config');
