#!/usr/bin/env node
/*
 * RETIRED 2026-10-05 — rewrote studio/sanity.config.ts in place to hardcode dataset 'production',
 * deleting the `process.env.SANITY_STUDIO_DATASET ||` override that lets a second machine or a
 * staging dataset be pointed at without editing tracked config. The override is still there and the
 * default is already 'production', so the script had nothing left to do. Use .env.local
 * (see studio/.env.example) to change it.
 */
console.error('studio/scripts/fix-dataset.js is retired — sanity.config.ts already defaults to ' +
              "'production' and honours SANITY_STUDIO_DATASET.\n");
process.exit(1);
