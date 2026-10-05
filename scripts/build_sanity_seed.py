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
work.html's cards for the 141 commissioned projects, the seven product pages for the MIG line
(they are not on work.html, so they get `family: "product"` and the Line/Type/Kind vocabulary
instead of a typology), and data/project-status.json for visibility. Images are deliberately NOT
seeded: a real asset has to be uploaded, and a fabricated reference is what broke the last file.

    py -3.10 scripts/build_sanity_seed.py            # validate + drift check (exit 1 if stale)
    py -3.10 scripts/build_sanity_seed.py --write    # rewrite studio/projects.ndjson
"""
import glob
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
CONFLICT = re.compile(r'conflicted copy', re.I)


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
    seg = work[i:i + 900]
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
        h1 = clean(re.search(r'class="project-page-title"[^>]*>(.*?)</h1>', src, re.S).group(1))
        if h1 != listed.get('title', ''):
            problems.append('%s: listing title %r != page h1 %r'
                            % (page, listed.get('title', ''), h1))
        year = listed.get('year') or _year
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


def product_records():
    records, problems = [], []
    for page in sorted(glob.glob('product-*.html')):
        if CONFLICT.search(page):
            continue
        src = read(page)
        tokens = bar_ordered(page_service_keys(page))
        line, kind_path, tail = meta_parts(src)
        segs = [s.strip() for s in kind_path.split('/') if s.strip()]
        h1m = re.search(r'class="product-page-title"[^>]*>(.*?)</h1>', src, re.S)
        title = clean(h1m.group(1)) if h1m else ''
        year = re.search(r'\b(19|20)\d{2}\b', tail)
        if not tokens:
            problems.append('%s tags no service the filter bar owns' % page)
        if not title:
            problems.append('%s has no product-page-title' % page)
        rec = {
            '_id': page[:-5],
            '_type': 'project',
            'title': title,
            'pageFile': page,
            'slug': {'_type': 'slug', 'current': page[:-5]},
            'family': 'product',
            'visibility': 'live',
            'featured': False,
            'publishedAt': int(year.group(0)) if year else 2020,
            'productLine': line,
            'productType': segs[0] if segs else '',
            'productKind': segs[-1] if segs else '',
            'primaryDiscipline': primary_token(tokens, ' / '.join(segs)),
            'disciplines': tokens,
            'cardLabel': 'Product Design',
            'excerpt': lead(src),
            'specs': {'client': 'In-house'},
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
    kinds = set(re.findall(r"'([^']*)'",
                           read(os.path.join('studio', 'taxonomy.ts'))
                           .split('export const PRODUCT_KINDS: string[] = [')[1]
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
        if r['family'] == 'product' and r.get('productKind') not in kinds:
            bad.append('%s: productKind %r is not a kind any product page states'
                       % (tag, r.get('productKind')))
    return bad


def main():
    projects, p1 = project_records()
    products, p2 = product_records()
    records = projects + products
    problems = p1 + p2
    bad = validate(records)
    print('%d project + %d product records' % (len(projects), len(products)))
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
