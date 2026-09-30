const fs = require('fs');
let cfg = fs.readFileSync('sanity.config.ts', 'utf8');
cfg = cfg.replace(/process\.env\.SANITY_STUDIO_DATASET \|\| 'production'/g, "'production'");
fs.writeFileSync('sanity.config.ts', cfg);
console.log('done');
