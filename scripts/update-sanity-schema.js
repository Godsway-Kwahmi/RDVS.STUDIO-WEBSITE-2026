#!/usr/bin/env node
/*
 * RETIRED 2026-10-05 — this script hand-edited studio/schemas/project.ts.
 *
 * It searched project.ts for the literal "{title: 'Design + Build', value: 'turnkey-build'}," and
 * inserted a 'competitions' option next to it. That line no longer exists, and the whole approach
 * did: every service/typology option list in the Studio is GENERATED from the site by
 * scripts/build_sanity_taxonomy.py, which reads work.html's filter bar and js/main.js's roll-up
 * table. A hand-typed copy is how the schema ended up offering "Architecture" and
 * "Visual Effects (VFX) & CGI" after both were renamed on 2026-10-04, with 8 of the 28 real service
 * tokens and no `illustration` at all.
 *
 * To add a typology or a service, put it on a work card's data-typology / the filter bar, then:
 *
 *     py -3.10 scripts/build_sanity_taxonomy.py --write
 *
 * scratch/_verify_backlog.py section (O) fails when studio/taxonomy.ts disagrees with the site, so
 * an un-regenerated vocabulary is caught in the harness instead of in the editor.
 */
console.error(
  'scripts/update-sanity-schema.js is retired: the Studio vocabularies are generated.\n' +
  'Run:  py -3.10 scripts/build_sanity_taxonomy.py --write\n'
);
process.exit(1);
