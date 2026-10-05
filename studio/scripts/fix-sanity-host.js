#!/usr/bin/env node
/*
 * RETIRED 2026-10-05 — renamed the deployed Studio host and hardcoded the project id.
 *
 * It set `studioHost: 'rdvs-studio-cms'` in sanity.cli.ts and replaced
 * `process.env.SANITY_STUDIO_PROJECT_ID || ''` with 'lqnpv8ns' in sanity.config.ts. Both target
 * strings have moved on: sanity.cli.ts is back on `studioHost: 'rdvs'` and sanity.config.ts carries
 * `process.env.SANITY_STUDIO_PROJECT_ID || 'lqnpv8ns'`, which is what lets `sanity build` run with
 * no .env file at all. Running this now would silently revert that, with fs.writeFileSync and no
 * backup.
 *
 * To deploy under a different host name, edit studioHost in studio/sanity.cli.ts directly.
 */
console.error('studio/scripts/fix-sanity-host.js is retired — edit studioHost in sanity.cli.ts.\n');
process.exit(1);
