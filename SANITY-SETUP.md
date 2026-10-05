# RDVS Studio × Sanity — setup and contract

Everything below was checked against the repository and the live project on 2026-10-05. Where an
older version of this guide described a file that does not exist, that line is gone rather than
"fixed"; nothing here names a command that has not been run or a file that is not on disk.

## The shape of this integration

The website is build-less static HTML in this folder's root. It is the source of truth for content,
and it works with Sanity switched off entirely: `js/sanity-client.js` returns `null` when a query
comes back empty, and `js/sanity-render.js` leaves the existing markup alone. Sanity is the editor
the studio team will use from here on, so the rule the rest of this file follows is one-directional —
**the CMS mirrors the site, never the other way round.**

Verified state of the live dataset (unauthenticated read, `https://lqnpv8ns.apicdn.sanity.io`):

| | |
|---|---|
| Project / dataset | `lqnpv8ns` / `production` |
| Reachable without a token | yes (`count(*)` answers) |
| Documents in it | **0** — the catalogue has never been imported |
| API version the client uses | `2024-01-01`, via the CDN |
| Write token in any file | no — both `.env` and `studio/.env.local` still hold `your_read_token_here` |

So: nothing on the site is CMS-driven today, and importing the seed is the first real step.

## Files that matter

```
studio/
  sanity.config.ts        Studio config; projectId/dataset default to lqnpv8ns/production
  sanity.cli.ts           CLI config; studioHost 'rdvs'
  structure.ts            Sidebar: work vs product line, live vs archived, settings singleton
  taxonomy.ts             GENERATED — every option list the schemas offer
  projects.ndjson         GENERATED — the import file, one record per listed page
  package.json            dev / build / deploy / manage / typecheck (Node >= 22.12)
  .env.example            copy to .env.local; both values already default correctly
  schemas/                project, slide, post, service, teamMember, siteSettings

js/
  sanity-client.js        GROQ over the CDN; no token, no build step
  sanity-render.js        rewrites the page markup a CMS document claims
  sanity-taxonomy.js      GENERATED — token → bar label map used by the meta line

scripts/
  build_sanity_taxonomy.py  work.html's filter bar + main.js's roll-up table → taxonomy.ts + js twin
  build_sanity_seed.py      work.html's cards + the product pages → projects.ndjson
  build_project_status.py   HTML → data/project-status.json (Live/Archived registry)
  sync_project_status.py    Sanity ⇄ registry, report first then --apply

SANITY-SETUP.md           this file
```

There is no root `package.json`, no `js/sanity-live.js`, no `scripts/fetch-content.js` and no
`data/sanity-content.json`. `.gitignore` still lists that last path; it costs nothing and is left
alone rather than "cleaned up" silently.

## First-time setup

```sh
cd studio
npm install          # engines: node >= 22.12
cp .env.example .env.local   # optional — see the note below
npm run dev          # http://localhost:3333
```

`.env.local` is only needed to point a machine at a different dataset. `sanity.config.ts` falls back
to the live project id and dataset, so a fresh clone builds without it, and the ids are not secrets
(the public CDN queries use them).

**Node modules and the synced folder.** `studio/node_modules/` inside the Dropbox copy is a broken
remnant of an install that failed part-way (59 top-level entries; `sanity`, `react`, `@sanity/icons`
and `typescript` are all missing or empty). `npm install` there will either hang on file locks or
reproduce the half-written tree. Install and build from a local clone or a local copy of `studio/`
instead — on this machine that is `C:\Users\Admin\rdvs-studio-build`, where the install, the
typecheck and `sanity build` all succeed. `node_modules` is gitignored, so nothing ships either way.

## After any change to the site's vocabulary

The schemas never hand-type an option list. If a service is renamed, a typology appears on a card,
or a product page is added, regenerate both outputs before touching a schema:

```sh
py -3.10 scripts/build_sanity_taxonomy.py          # reports drift, exit 1 if stale
py -3.10 scripts/build_sanity_taxonomy.py --write  # studio/taxonomy.ts + js/sanity-taxonomy.js
py -3.10 scripts/build_sanity_seed.py              # validates and drift-checks the import file
py -3.10 scripts/build_sanity_seed.py --write      # studio/projects.ndjson
```

`scratch/_verify_backlog.py` section (O) runs both generators in report mode and fails on drift, so
a forgotten `--write` is caught by the harness rather than discovered in the editor.

## Importing the catalogue

`studio/projects.ndjson` carries one `project` document per listed page — 141 commissioned projects
from `work.html` plus the 7 MIG products, all `visibility: "live"`, years 2008–2024. It deliberately
carries **no image fields**: an asset has to be uploaded, and the previous version of this file
invented 138 `sanity.imageAsset` records pointing at `file://S:/Dropbox/…`, which is why the import
never worked.

```sh
cd studio
npx sanity login                      # or export SANITY_IMPORT_TOKEN=<editor token>
npx sanity datasets import -d production projects.ndjson --replace
```

`--replace` re-imports over documents with the same `_id`; drop it for a first import. Then create
the `siteSettings` singleton, `service`, `teamMember` and `post` documents in the Studio — those are
editorial, not derivable from the catalogue.

Images are attached per project in the Studio afterwards. Site convention, which the schema
descriptions repeat: the hero plate is also gallery item 1, baked 2400 px wide at JPEG q82; gallery
plates 2 onward are 1400 px.

## Visibility

`visibility` (live / archived) is the only field that decides which surface a project appears on —
live = work page + archive page + homepage slideshow, archived = archive page only. The static
surfaces read `data/project-status.json`, not Sanity, so the two are kept in step by:

```sh
py -3.10 scripts/sync_project_status.py --pull            # report: Sanity -> registry
py -3.10 scripts/sync_project_status.py --pull --apply
py -3.10 scripts/sync_project_status.py --push --create-missing   # registry -> Sanity
```

With an empty dataset `--pull` has nothing to read, so `--push` is the direction that seeds it.
The script never deletes a document.

## How a page reads the CMS

`js/sanity-taxonomy.js` must load **before** `js/sanity-client.js`, because the renderer resolves a
stored token (`architecture-planning`) to its bar label (`Architectural Design`) through
`window.RDVSSanityTaxonomy`. All 157 hydrating pages already carry both tags in that order; the
harness enforces it.

The field contract in `js/sanity-client.js` is the whole interface, and every projection names a
field `studio/schemas/` defines:

- `pageFile` is the canonical key, not the slug — the site renames display titles but keeps its
  live URLs, so "Senseble" is served from `home-automation-system-presentation.html`.
- `disciplines` holds filter tokens and rolls up to the eight bar-level services for the slide
  caption; `primaryDiscipline` is the single main one.
- `category` is `coalesce(typology, cardLabel)`; a product document has no typology and is described
  by `productLine` / `productType` / `productKind` with `family: "product"` instead.
- Images are read through `cardImage.asset->url`, `heroImage.asset->url` and
  `gallery[]{ "url": asset->url, alt }`.
- A page's own document is fetched without a visibility filter, so archived work still renders when
  it is reached from `archive.html`.
- `?service=` and `?project=` deep links resolve through the same vocabulary; `getProjectBySlug`
  rejects a key that is not `^[a-z0-9-]+$` before it reaches GROQ.

## Deploying the Studio

```sh
cd studio
npm run typecheck
npm run build
npm run deploy        # studioHost 'rdvs' in sanity.cli.ts
```

`sanity build` was the step that never passed until 2026-10-05: `@sanity/icons` v5's root bundle
exports only `{Icon, icons}`, so the root named icon imports typechecked against the `.d.ts` and
then failed the bundle with `MISSING_EXPORT`. Icons are imported from their subpath modules
(`@sanity/icons/Document`), which is what the schema files do now and what the harness checks.

## Checking your work

```sh
py -3.10 scratch/_verify_backlog.py    # exit 0 == "ALL CHECKS PASS"
```

That is the authority on both the site and the Sanity contract; it was at 0 failures (230 checks)
when this section was last rewritten.

## What is still open, and needs a person

1. The dataset is empty and the API token in `.env`, `studio/.env.local` and the root
   `.env.example` is a placeholder — the import cannot run without a token created at
   sanity.io/manage → API → Tokens.
2. Homepage slides are drawn from the pools in `js/main.js`, not from `slide` documents. Until the
   deck reads the CMS, a `slide` created in the Studio is editorial only.
3. `studio/upload-to-sanity.bat` is the old double-click wrapper for the import; it still says
   "138 projects and their images", which the seed file no longer is. Prefer the commands above.
4. `scripts/update-sanity-schema.js` and `studio/scripts/*.js` are retired one-off edit scripts (see
   below); nothing runs them, and the schema is generated now.
