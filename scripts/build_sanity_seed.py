"""Regenerate studio/projects.ndjson so it actually matches studio/schemas/project.ts.

The committed seed was written before the current schema existed and cannot be imported:

  - 138 of its 274 records were `sanity.imageAsset` documents whose `url` was a
    `file://S:/Dropbox/...` path -- this machine's working copy, invalid as a Sanity asset id
    (`image-1957-cover` is not a ref either), and a leak of the local directory layout.
  - The 136 `project` records used fields the schema no longer defines: `isArchived` instead of
    `visibility`, `category`/`discipline` instead of `typology`/`primaryDiscipline`/`disciplines`,
    `description` instead of `excerpt`, `coverImage` instead of `cardImage`, and no `pageFile` at
    all -- which is the key the registry, the slideshow pools and the runtime hydration join on.
  - Its `category` values were the pre-2026-10-04 labels: "Architecture" appeared 137 times and
    "Architectural Design" not once.

This rebuilds one record per listed page from the site itself, which is the source of truth:
work.html's cards for every commissioned project AND for the seven in-house MIG pieces (they joined
the work grid on 2026-10-21, so they are ordinary `family: "project"` records whose `typology` is the
product kind the page itself states -- "Desk", "Media wall"), and data/project-status.json for
visibility. Images are deliberately NOT seeded: a real asset has to be uploaded, and a fabricated
reference is what broke the last file.

There used to be a second path here, `product_records()`, globbing `product-*.html` and emitting a
`family: "product"` record for each with `cardLabel: "Product Design"` and no card. Since those pages
now carry work cards, that path produced a SECOND document for the same `_id`, which `validate()`
rejects; it was deleted rather than guarded, because a generator with two writers for one record is
the bug, not the symptom.

    py -3.10 scripts/build_sanity_seed.py            # validate + drift check (exit 1 if stale)
    py -3.10 scripts/build_sanity_seed.py --write    # rewrite studio/projects.ndjson
"""
import html
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(ROOT, 'scratch'))
from _service_axis import (BAR_LABELS, PARENT_OF,  # noqa: E402
                           page_service_keys)

# Every filter token, in bar order. `_service_axis.BAR_ORDER` is only the EIGHT main services -- the
# parents -- so ordering a project's tags through it silently drops every sub-service token, which
# is exactly what `disciplines` is made of. PARENT_OF is built by walking the bar, so its key order
# is the full 28-token order.
ALL_ORDER = list(PARENT_OF)

OUT = os.path.join(ROOT, 'studio', 'projects.ndjson')
WRITE = '--write' in sys.argv


def read(rel):
    return open(os.path.join(ROOT, rel), encoding='utf-8', errors='ignore').read()


def clean(t):
    t = html.unescape(re.sub(r'<[^>]+>', '', t))
    t = t.replace('\u2019', "'").replace('\u2018', "'").replace('\u201c', '"').replace('\u201d', '"')
    return re.sub(r'\s+', ' ', t).strip()


def card_attrs(work, page):
    i = work.find('<a href="%s"' % page)
    if i < 0:
        return {}
    # Bound the segment by the card's own </a>, not a fixed window. A card whose data-* attributes
    # carry a long service list runs past 900 characters before its visible <span
    # class="card-category">, and a truncated window silently returns no match: 211 of the 222 seed
    # records carried an empty `cardLabel` (found 2026-10-08 while reclassifying 5AAP, whose card
    # grew from "Design + Build" to a three-service line).
    end = work.find('</a>', i)
    seg = work[i:end if end > i else len(work)]
    out = {}
    for key in ('title', 'year', 'typology', 'discipline', 'client', 'location', 'category'):
        m = re.search(r'data-%s="([^"]*)"' % key, seg)
        out[key] = clean(m.group(1)) if m else ''
    m = re.search(r'<span class="card-category">([^<]*)</span>', seg)
    out['cardLabel'] = clean(m.group(1)) if m else ''
    return out


def archive_attrs(arch, page):
    """The same descriptive fields for a project that has NO work-page card.

    An archived project is archive-only by definition -- scripts/build_project_status.py derives
    `visibility` from the presence of a `.grid-card` -- so once a project is archived the card lookup
    above returns {} and the seed would otherwise crash or ship an empty record for work that still
    has a page and still shows on archive.html.

    The row's *display* cells are used rather than its data-* attributes: those attributes are
    deliberately lowercase so the archive's own search can substring them, and copying them into the
    CMS would put "brand identity" in a field the page writes "Brand Identity".
    """
    i = arch.find('<a href="%s" class="archive-project-link"' % page)
    if i < 0:
        return {}
    start = arch.rfind('<tr class="archive-row"', 0, i)
    end = arch.find('</tr>', i)
    if start < 0 or end < 0:
        return {}
    seg = arch[start:end]
    out = {}
    m = re.search(r'class="archive-project-link"[^>]*>(.*?)</a>', seg, re.S)
    out['title'] = clean(m.group(1)) if m else ''
    for cls in ('year', 'typology', 'discipline'):
        m = re.search(r'class="archive-col-%s"[^>]*>([^<]*)<' % cls, seg)
        out[cls] = clean(m.group(1)) if m else ''
    for key in ('client', 'location'):
        m = re.search(r'data-%s="([^"]*)"' % key, seg)
        out[key] = clean(m.group(1)) if m else ''
    return out


def spec_rows(src):
    """{label: value} for the page's own spec panel."""
    out = {}
    for m in re.finditer(r'<span class="project-spec-label">([^<]*)</span>\s*'
                         r'<span class="project-spec-val">([^<]*)</span>', src):
        out.setdefault(clean(m.group(1)), clean(m.group(2)))
    return out


def meta_parts(src):
    m = re.search(r'class="project-meta-line"[^>]*>(.*?)</span>', src, re.S)
    if not m:
        return '', '', ''
    text = clean(m.group(1))
    head, _, tail = text.partition('\u2014')
    segs = [s.strip() for s in head.split('/') if s.strip()]
    return (segs[0] if segs else '', ' / '.join(segs[1:]), tail.strip())


def lead(src):
    m = re.search(r'class="project-lead-text"[^>]*>(.*?)</p>', src, re.S)
    if not m:
        return ''
    text = clean(m.group(1))
    # Two sentences is what the schema says an excerpt is for (slide, card, meta description).
    parts = re.split(r'(?<=\.)\s+', text)
    return ' '.join(parts[:2])[:480]


def primary_token(tokens, discipline_text):
    """The token whose LABEL the page's own Discipline row names first."""
    order = {t: n for n, t in enumerate(tokens)}
    best = None
    for tok in tokens:
        label = BAR_LABELS.get(tok, '')
        pos = discipline_text.find(label) if label else -1
        if pos >= 0 and (best is None or pos < best[0]):
            best = (pos, tok)
    return best[1] if best else (tokens[0] if tokens else '')


def bar_ordered(tokens):
    return [t for t in ALL_ORDER if t in set(tokens)]


def project_records():
    work = read('work.html')
    arch = read('archive.html')
    registry = json.loads(read(os.path.join('data', 'project-status.json')))['projects']
    records, problems = [], []
    for page, info in sorted(registry.items()):
        if not os.path.isfile(os.path.join(ROOT, page)):
            problems.append('%s is in the registry but has no page' % page)
            continue
        src = read(page)
        card = card_attrs(work, page)
        # Archived work has no card, so describe it from its archive row instead. `card or archive`
        # keeps the live path byte-identical: a live page has a card and never consults the row.
        listed = card or archive_attrs(arch, page)
        if not card and not listed:
            problems.append('%s is on neither the work page nor the archive' % page)
        specs = spec_rows(src)
        typology, _services, _year = meta_parts(src)
        tokens = bar_ordered(page_service_keys(page))
        if not tokens:
            problems.append('%s tags no service the filter bar owns' % page)
        discipline = specs.get('Discipline') or listed.get('discipline') or ''
        h1m = re.search(r'class="project-page-title"[^>]*>(.*?)</h1>', src, re.S)
        # Named rather than left to `None.group(1)`: this line once crashed a whole run with an
        # AttributeError that said nothing about which page, and the registry derives membership
        # from exactly this class, so a row without it means page and registry disagree.
        assert h1m, ('%s is a registry row but carries no <h1 class="project-page-title">' % page)
        h1 = clean(h1m.group(1))
        if h1 != listed.get('title', ''):
            problems.append('%s: listing title %r != page h1 %r'
                            % (page, listed.get('title', ''), h1))
        # The meta tail can carry more than the year ('2012 · Institute for Christian Apologetics
        # Studies'), so take its first four-digit year rather than feeding the whole tail to int().
        ym = re.search(r'\b(19|20)\d{2}\b', _year)
        year = listed.get('year') or (ym.group(0) if ym else '')
        rec = {
            '_id': page[:-5],
            '_type': 'project',
            'title': h1,
            'pageFile': page,
            'slug': {'_type': 'slug', 'current': page[:-5]},
            'family': 'project',
            'visibility': info['visibility'],
            'featured': False,
            'publishedAt': int(year),
            'typology': listed.get('typology') or typology,
            'primaryDiscipline': primary_token(tokens, discipline),
            'disciplines': tokens,
            'cardLabel': listed.get('cardLabel') or '',
            'excerpt': lead(src),
            'specs': {k: v for k, v in (
                ('client', specs.get('Client') or listed.get('client')),
                ('location', specs.get('Location') or listed.get('location')),
                ('area', specs.get('Area') or specs.get('Area / Scale') or ''),
                ('scope', specs.get('Scope of Services') or specs.get('Scope') or ''),
                ('team', specs.get('Team') or ''),
            ) if v},
        }
        records.append(rec)
    return records, problems


def validate(records):
    """Fail loudly on anything `sanity dataset import` would reject or the schema would red-flag."""
    from _service_axis import BAR_LABELS as labels
    typologies = set(re.findall(r"'([^']*)'",
                                read(os.path.join('studio', 'taxonomy.ts'))
                                .split('export const TYPOLOGIES: string[] = [')[1]
                                .split(']')[0]))
    seen, bad = set(), []
    for r in records:
        tag = r['_id']
        if r['_id'] in seen:
            bad.append('%s: duplicate _id' % tag)
        seen.add(r['_id'])
        if not re.fullmatch(r'[a-z0-9-]+', r['_id']):
            bad.append('%s: _id is not a Sanity-safe id' % tag)
        if not re.fullmatch(r'[a-z0-9-]+\.html', r['pageFile']):
            bad.append('%s: pageFile %r' % (tag, r['pageFile']))
        if not r['title']:
            bad.append('%s: no title' % tag)
        if r['visibility'] not in ('live', 'archived'):
            bad.append('%s: visibility %r' % (tag, r['visibility']))
        if not (2000 <= r['publishedAt'] <= 2100):
            bad.append('%s: publishedAt %r' % (tag, r['publishedAt']))
        for t in r['disciplines']:
            if t not in labels:
                bad.append('%s: discipline token %r is not on the bar' % (tag, t))
        if r['primaryDiscipline'] and r['primaryDiscipline'] not in labels:
            bad.append('%s: primaryDiscipline %r' % (tag, r['primaryDiscipline']))
        if r['family'] == 'project' and r.get('typology') not in typologies:
            bad.append('%s: typology %r is not a value any work card carries'
                       % (tag, r.get('typology')))
        if r['family'] != 'project':
            # Tripwire, not a shape. Since 2026-10-21 the seven MIG pages are on work.html, so every
            # listed page arrives through project_records() exactly once; a second `family` here would
            # mean a page is being described twice, which is how the old product path collided _ids.
            bad.append('%s: family %r is not a shape this generator writes any more'
                       % (tag, r['family']))
    return bad


def main():
    records, problems = project_records()
    bad = validate(records)
    print('%d records, one per listed page' % len(records))
    print('  live=%d archived=%d' % (sum(1 for r in records if r['visibility'] == 'live'),
                                     sum(1 for r in records if r['visibility'] == 'archived')))
    print('  years %d-%d, no image fields (assets must be uploaded, never fabricated)'
          % (min(r['publishedAt'] for r in records), max(r['publishedAt'] for r in records)))
    for line in problems:
        print('  WARN %s' % line)
    for line in bad[:20]:
        print('  INVALID %s' % line)
    if bad:
        print('%d record(s) would not import' % len(bad))
        sys.exit(1)
    text = '\n'.join(json.dumps(r, ensure_ascii=False, sort_keys=False) for r in records) + '\n'
    if not WRITE:
        # Same contract as scripts/build_sanity_taxonomy.py: report mode is a drift check, so the
        # harness can run it as a subprocess and read the exit code. Without this the seed goes
        # stale the moment a card is added and nothing notices.
        if os.path.isfile(OUT) and open(OUT, encoding='utf-8').read() == text:
            print('\nstudio/projects.ndjson is in step with the site (%d records)' % len(records))
            return
        print('\nstudio/projects.ndjson is STALE — rerun with --write')
        sys.exit(1)
    tmp = OUT + '.x.tmp'
    with open(tmp, 'wb') as fh:
        fh.write(text.encode('utf-8'))
    os.replace(tmp, OUT)
    print('\nwrote studio/projects.ndjson (%d records, %d bytes)'
          % (len(records), os.path.getsize(OUT)))


if __name__ == '__main__':
    main()
