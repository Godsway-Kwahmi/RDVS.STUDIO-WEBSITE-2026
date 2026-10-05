#!/usr/bin/env node
/*
 * RETIRED 2026-10-05 — the undo half of fix-sanity-host.js: it put `studioHost: 'rdvs'` back in
 * sanity.cli.ts. sanity.cli.ts already says 'rdvs' and was never left in the other state, so this
 * script now has nothing to match. Host name is a one-line edit in that file.
 */
console.error('studio/scripts/revert-host.js is retired — studioHost is already "rdvs".\n');
process.exit(1);
