#!/usr/bin/env python3
"""Build multiple homepage slideshow entries for every project.

The homepage hero deck draws from `servicePools` in js/main.js. Until now that
pool held one curated entry per project and covered only 78 of the 146 listings,
so 70 projects could never appear on the homepage.

This generator gives every project up to three entries - its film (where one
exists), an animated GIF (where one exists) and its best stills - always choosing
the highest-quality file for the frame: landscape-first for the ~16:9 slide box,
then largest pixel area. Existing curated entries are re-emitted byte-for-byte so
hand-written copy is never regressed; only the additional entries are generated.

Usage:
    py -3.10 scripts/build_slideshow_pool.py            # report only, writes nothing
    py -3.10 scripts/build_slideshow_pool.py --apply    # splice into js/main.js
"""
import html
import json
import os
import re
import subprocess
import sys
from collections import OrderedDict

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAX_ENTRIES = 3
POOL_KEYS = ('architecture', 'interiors', 'vfx', 'motion')

# `servicePools` grew a fifth array, `products`, on 2026-10-05, and it is owned by
# scratch/_build_product_pool.py (every plate and film of the product pages, guarded by
# harness section M3). This generator must not write it -- but for fifteen days POOL_KEYS
# was also the only statement of which pools EXIST, so a report here silently counted four
# of them, exactly the partial-census-wearing-a-full-one's-name failure that
# scratch/_slide_pool_census.py had until 2026-10-21. POOL_KEYS is now checked against the
# pools actually present in js/main.js, and an unknown pool stops the run instead of being
# skipped.
EXTERNALLY_OWNED = {'products': 'scratch/_build_product_pool.py'}
POOL_OPENER = '\n  architecture: {'
POOL_NAME = re.compile(r'^  ([a-z][a-z0-9_]*): \{', re.M)

# First matching service token decides which pool a work renders in, because pool
# membership in main.js is physical (the array it sits in), not the `discipline` field.
TOKEN_POOL = (
    ('interior-design', 'interiors'),
    ('architecture-planning', 'architecture'),
    ('motion-design', 'motion'),
    ('3d-animation', 'motion'),
    ('graphic-design', 'vfx'),
    ('architectural-visualization', 'vfx'),
    ('vfx-cgi', 'vfx'),
    ('web-design', 'vfx'),
    ('industrial-design', 'architecture'),
    ('turnkey-build', 'architecture'),
    ('bim', 'architecture'),
)


def read(path):
    with open(os.path.join(ROOT, path), 'rb') as fh:
        raw = fh.read()
    return raw.decode('utf-8', 'replace').replace('\r\n', '\n')


# Single-quoted string fields of a pool entry. Longest names first so imageUrlDesktop is
# not matched as imageUrl + junk, and (?:[^'\\]|\\.)* so an escaped apostrophe inside a
# desc does not truncate the value.
STR_FIELD = re.compile(
    r"(?:^|[\s,{])(id|projectUrl|imageUrlDesktop|imageUrl|imageMobileUrl|service|title|year|desc)"
    r":\s*'((?:[^'\\]|\\.)*)'"
)


def unesc(s):
    return html.unescape(re.sub(r'&[a-z]+;', ' ', s)).strip()


def dims(path):
    try:
        with Image.open(os.path.join(ROOT, path)) as im:
            return im.size
    except Exception:
        return (0, 0)


# ---------------------------------------------------------------- page parsing
def parse_page(page):
    t = read(page)
    info = {'page': page, 'videos': [], 'gifs': [], 'stills': []}
    m = re.search(r'class="project-page-title">([^<]*)</h1>', t)
    info['title'] = unesc(m.group(1)) if m else os.path.splitext(page)[0]
    m = re.search(r'class="project-meta-line">([^<]*)</span>', t)
    meta = m.group(1).strip() if m else ''
    left, _, right = meta.partition('&mdash;')
    segs = [s.strip() for s in left.split('/')]
    info['typology'] = unesc(segs[0]) if segs else ''
    info['service'] = unesc(segs[-1]) if segs else ''
    if info['typology'] == info['service']:      # legacy "Architecture / Architecture"
        info['service'] = ''
    ym = re.search(r'(19|20)\d{2}', right) or re.search(r'(19|20)\d{2}', meta)
    info['year'] = ym.group(0) if ym else ''
    info['client'] = ''
    cm = re.search(r'project-spec-label">Client</span>\s*<span class="project-spec-val">([^<]*)', t)
    if cm:
        info['client'] = unesc(cm.group(1))
    sm = re.search(r'project-spec-label">Scope of Services</span>\s*<span class="project-spec-val">([^<]*)', t)
    info['scope'] = unesc(sm.group(1)) if sm else info['service']
    tm = re.search(r'project-spec-label">Team</span>\s*<span class="project-spec-val">([^<]*)', t)
    info['team'] = unesc(tm.group(1)) if tm else 'RDVS Team'
    lm = re.search(r'class="project-lead-text">([^<]*)</p>', t)
    info['lead'] = unesc(lm.group(1)) if lm else ''
    tokens = re.findall(r'work\.html\?service=([a-z\-]+)', t)
    info['tokens'] = tokens
    # hero video, then any other video modules
    for vm in re.finditer(r'<video[^>]*?src="([^"]+)"[^>]*?(?:poster="([^"]*)")?[^>]*>', t):
        src, poster = vm.group(1), vm.group(2) or ''
        if src and src not in [v[0] for v in info['videos']]:
            info['videos'].append((src, poster))
    seen = set()
    for im in re.finditer(r'<img src="(assets/images/[^"]+)"', t):
        src = im.group(1)
        if src in seen:
            continue
        seen.add(src)
        if src.lower().endswith('.gif'):
            info['gifs'].append(src)
        else:
            info['stills'].append(src)
    info['hero'] = (re.search(r'class="project-hero-img"', t) is not None)
    return info


def pick_pool(info):
    for tok, pool in TOKEN_POOL:
        if tok in info['tokens']:
            return pool
    s = info['service'].lower()
    if 'interior' in s:
        return 'interiors'
    if 'motion' in s or 'animation' in s or 'film' in s:
        return 'motion'
    if 'architect' in s:
        return 'architecture'
    return 'vfx'


def frame_key(path):
    """Identity of the FRAME a file shows, so responsive/preview derivatives of the
    same plate collapse but distinct plates (`-16` vs `-17`) do not."""
    return SUFFIX_RE.sub('', os.path.splitext(os.path.basename(path))[0])


_dirs = {}


def siblings(dirpath):
    key = dirpath or '.'
    if key not in _dirs:
        full = os.path.join(ROOT, key)
        try:
            _dirs[key] = [n for n in os.listdir(full) if os.path.isfile(os.path.join(full, n))]
        except OSError:
            _dirs[key] = []
    return _dirs[key]


# A slide is the first thing a visitor downloads, so "best file" is capped at what a
# homepage can actually carry: the baked plates run ~2400 px / a few hundred KB, while
# an untouched render drop in the same folder can be 6000 px and 15 MB.
MAX_SLIDE_AREA = 9_000_000
MAX_SLIDE_BYTES = 1_600_000

VARIANT_RANK = {'mobile': 0, 'thumb': 0, 'sm': 0, 'small': 0, 'preview': 0,
                'side': 0, 'poster': 1, 'lg': 1, 'wide': 2, 'full': 2, 'desktop': 2}
SUFFIX_RE = re.compile(r'-(mobile|desktop|thumb|poster|preview|full|wide|side|small|lg|sm)$', re.I)


def variant_rank(name):
    """How canonical a filename is for its frame: the plain plate beats a `-desktop`
    crop, which beats a `-poster` still, which beats a `-mobile`/`-thumb` derivative.
    Pixel area alone gets this wrong — a 1080x1920 phone crop out-resolutions a
    1600x960 desktop plate while being the smaller, wrongly-oriented file."""
    m = SUFFIX_RE.search(os.path.splitext(name)[0])
    return 3 if not m else VARIANT_RANK[m.group(1).lower()]


def best_file(path):
    """The highest-quality file of the SAME frame.

    A page links one plate filename, but the folder usually also holds its `-mobile`
    and `-desktop` siblings (and sometimes an unbaked full drop). Homepage slides must
    carry the best file of that frame, never a thumbnail or a compressed responsive
    variant, so every media path is resolved against the whole frame family first.
    """
    if not path or not os.path.exists(os.path.join(ROOT, path.replace('\\', '/'))):
        return path

    def score(cand):
        full = os.path.join(ROOT, cand)
        if not os.path.isfile(full):
            return None
        w, h = dims(cand)
        if not w or not h:
            return None
        size = os.path.getsize(full)
        if w * h > MAX_SLIDE_AREA or size > MAX_SLIDE_BYTES:
            return None
        # Widest file first — that is the site's documented desktop-slide rule — then the
        # landscape crop (the slide box is ~16:9, and a phone crop of the same shot can
        # out-resolve it while being the wrong shape), then area, bytes, canonical name.
        return (w, 1 if w >= h else 0, w * h, size, variant_rank(cand))

    own = score(path)
    if own is None:
        # The curated file is already outside the delivery budget or unreadable; swapping
        # it for a smaller sibling would be a downgrade dressed up as a fix.
        return path
    d = os.path.dirname(path).replace('\\', '/')
    stem = frame_key(path)
    ext = os.path.splitext(path)[1].lower()
    ranked = []
    for n in siblings(d):
        # Stay inside the same frame AND the same format: the `-gif` family of a frame
        # may also hold a still of it, and swapping a GIF entry for a JPG is not an
        # upgrade, it is a different slide.
        if frame_key(n) != stem or os.path.splitext(n)[1].lower() != ext:
            continue
        cand = f'{d}/{n}' if d else n
        s = score(cand)
        if s:
            ranked.append((s, cand))
    if not ranked:
        return path
    # The current file wins ties so a frame already carried by a curated entry is not
    # shuffled onto a sibling of exactly the same size.
    ranked.sort(key=lambda t: (t[0], t[1] == path), reverse=True)
    return ranked[0][1]


def rank_stills(paths, exclude_frames):
    """Landscape-first for the slide box, then the largest frame; never a tiny file.
    `exclude_frames` holds frame_key() values, so a plate that is only shown under a
    different filename (the video's poster, for instance) is still recognised."""
    cands = []
    for p in paths:
        if frame_key(p) in exclude_frames:
            continue
        w, h = dims(p)
        if not w or not h:
            continue
        aspect = w / h
        landscape = 1 if aspect >= 1.4 else 0
        cands.append((landscape, w * h, aspect, p))
    cands.sort(reverse=True)
    out, seen_frame = [], set()
    for _, _, _, p in cands:
        key = frame_key(p)
        if key in seen_frame:
            continue
        seen_frame.add(key)
        out.append(best_file(p))
    return out


def mobile_sibling(path):
    stem, ext = os.path.splitext(path)
    cand = stem + '-mobile' + ext
    return cand if os.path.exists(os.path.join(ROOT, cand)) else path


def js(value):
    """Emit a JS string literal the way the hand-curated pool entries do: single quotes.
    json.dumps would switch every added entry to double quotes, leaving the pool written
    in two styles and breaking the `'…'` regexes the page-sync and audit scripts use."""
    return "'" + str(value).replace('\\', '\\\\').replace("'", "\\'") + "'"


def build_entry(info, media, kind, suffix, curated):
    pool = pick_pool(info)
    service = info['service'] or curated.get('service') or info['typology'] or 'Studio Project'
    year = info['year'] or curated.get('year') or ''
    category = f'{service} — {year}' if year else service
    disciplines = [d.strip() for d in re.split(r',|&', service) if d.strip()] or [service]
    ident = (curated.get('id') if suffix == '' else f"{curated.get('id') or os.path.splitext(info['page'])[0]}-{suffix}")
    lines = [f"      {{", f"        id: {js(ident)},"]
    lines.append(f"        title: {js(info['title'])},")
    lines.append(f"        category: {js(category)},")
    lines.append(f"        service: {js(service)},")
    lines.append(f"        discipline: {js(pool)},")
    if kind == 'video':
        src, poster = media
        poster = poster or (curated.get('imageUrl') or '')
        # A film slide still needs a poster for the mobile/light fallback path, so fall
        # back to the project's own first plate when the page carries no poster frame.
        desk = best_file(poster or (info['stills'][0] if info['stills'] else ''))
        lines.append(f"        videoUrl: {js(src)},")
        lines.append(f"        videoUrlDesktop: {js(src)},")
        lines.append(f"        videoMobileUrl: {js(mobile_sibling(src) if os.path.exists(os.path.join(ROOT, mobile_sibling(src))) else src)},")
        lines.append(f"        imageUrl: {js(desk)},")
        lines.append(f"        imageUrlDesktop: {js(desk)},")
        lines.append(f"        imageMobileUrl: {js(mobile_sibling(desk))},")
    else:
        lines.append(f"        imageUrl: {js(mobile_sibling(media))},")
        lines.append(f"        imageUrlDesktop: {js(media)},")
        lines.append(f"        imageMobileUrl: {js(mobile_sibling(media))},")
    lines.append(f"        projectUrl: {js(info['page'])},")
    desc = curated.get('desc') or info['lead']
    lines.append(f"        desc: {js(desc)},")
    lines.append("        specs: {")
    lines.append(f"          client: {js(info['client'] or 'Private Client')},")
    lines.append(f"          scope: {js(info['scope'])},")
    lines.append(f"          team: {js(info['team'])},")
    lines.append(f"          year: {js(year)},")
    lines.append(f"          disciplines: {js(disciplines)}")
    lines.append("        }")
    lines.append("      }")
    return pool, kind, '\n'.join(lines)


# ------------------------------------------------------- existing pool parsing
def pool_blocks(main):
    """(pool names in file order, {name: (start, end)}) for the servicePools literal.

    A block runs to the NEXT POOL IN THE FILE, not to the next name this caller happens to
    know. POOL_KEYS used to bound itself, so once main.js carried a fifth pool between two
    of the four, the earlier pool's block swallowed it and every per-pool number in the
    report was wrong while the grand total stayed right -- the worst kind of wrong, because
    nothing looked broken.
    """
    s0 = main.index(POOL_OPENER)
    block_end = main.index('\n};', s0)
    starts = sorted((main.index('\n  %s: {' % n), n)
                    for n in dict.fromkeys(POOL_NAME.findall(main[s0:block_end])))
    assert starts, 'no pools found inside servicePools -- the block shape changed'
    bounds = {n: (s, starts[i + 1][0] if i + 1 < len(starts) else block_end)
              for i, (s, n) in enumerate(starts)}
    return [n for _, n in starts], bounds


def parse_pools(main, keys=POOL_KEYS):
    _, bounds = pool_blocks(main)
    blocks = {}
    for key in keys:
        s, e = bounds[key]
        seg = main[s:e]
        vs = seg.index('videos: [')
        im = seg.index('images: [')
        blocks[key] = {'videos': extract_entries(seg, vs, im), 'images': extract_entries(seg, im, len(seg))}
    return blocks


def pools_in_file(main):
    """Every top-level pool name inside the servicePools block, in file order."""
    return pool_blocks(main)[0]


def check_coverage(main):
    """Fail loudly rather than report four pools as if they were all of them."""
    found = pools_in_file(main)
    unknown = [k for k in found if k not in POOL_KEYS and k not in EXTERNALLY_OWNED]
    absent = [k for k in POOL_KEYS if k not in found]
    if unknown or absent:
        raise SystemExit(
            'pool coverage is stale here: js/main.js has %s, this script writes %s\n'
            '  pools nobody owns in this file: %s\n'
            '  pools this script expects but the file lacks: %s\n'
            'Add the pool to POOL_KEYS (it is generated) or to EXTERNALLY_OWNED (another\n'
            'tool owns it), then re-run -- do not ship a report that counts a subset.'
            % (found, list(POOL_KEYS), unknown, absent))
    return found


def extract_entries(seg, open_idx, close_idx):
    """Return each entry as (raw text, dict of curated string fields)."""
    body = seg[open_idx:close_idx]
    out = []
    depth = 0
    buf = []
    for ch in body:
        if ch == '{':
            depth += 1
        if depth:
            buf.append(ch)
        if ch == '}':
            depth -= 1
            if depth == 0:
                raw = ''.join(buf).strip()
                fields = {}
                for m in STR_FIELD.finditer(raw):
                    # An escaped quote stays inside the match, so a desc carrying one is
                    # read whole instead of stopping at the apostrophe.
                    fields[m.group(1)] = m.group(2).replace("\\'", "'")
                fields.setdefault('year', '')
                out.append({'raw': raw, 'fields': fields})
                buf = []
    return out


def main_():
    apply = '--apply' in sys.argv
    work = read('work.html')
    pages = list(OrderedDict.fromkeys(re.findall(r'href="([a-z0-9\-]+\.html)" class="grid-card"', work)))
    main_js = read('js/main.js')
    found = check_coverage(main_js)
    owned = [k for k in found if k not in POOL_KEYS]
    pools = parse_pools(main_js)
    curated_by_page = {}
    for key in POOL_KEYS:
        for kind in ('videos', 'images'):
            for ent in pools[key][kind]:
                u = ent['fields'].get('projectUrl')
                if u and u not in curated_by_page:
                    curated_by_page[u] = ent['fields']
    mine = sum(len(pools[k][t]) for k in POOL_KEYS for t in ("videos", "images"))
    detail = ', '.join('%s %d' % (k, sum(len(pools[k][t]) for t in ("videos", "images")))
                       for k in POOL_KEYS)
    print(f'listings: {len(pages)} | pool entries this script writes: {mine} ({detail})')
    owned_pools = {}
    for k in owned:
        owned_pools[k] = parse_pools(main_js, [k])[k]
        n = sum(len(owned_pools[k][t]) for t in ("videos", "images"))
        print(f'  {k}: {n} entries owned by {EXTERNALLY_OWNED[k]} -- read here, never written')
    # A page already represented in an externally owned pool IS in the deck. Generating for
    # it would put the same work in a service pool as well, which double-counts it in the
    # equal-share draw and fights that tool's guard (for `products` that is (M3) in
    # scratch/_verify_backlog.py). Route around those pages and print how many.
    pooled_elsewhere = {e['fields']['projectUrl']
                        for k in owned for t in ('videos', 'images') for e in owned_pools[k][t]
                        if e['fields'].get('projectUrl')}
    skipped = [p for p in pages if p in pooled_elsewhere]
    print(f'  pages whose slides belong to another tool, skipped here: {len(skipped)} {skipped[:8]}')

    additions = {'videos': {}, 'images': {}}
    counts = {'projects': 0, 'no_media': [], 'video': 0, 'gif': 0, 'still': 0, 'new_projects': 0,
              'singles': []}
    for page in pages:
        if page in pooled_elsewhere:
            continue
        info = parse_page(page)
        counts['projects'] += 1
        curated = curated_by_page.get(page, {})
        existing = 1 if curated else 0
        if not curated:
            counts['new_projects'] += 1
        used = set()
        poster = ''
        slots = MAX_ENTRIES - existing
        made = []
        if slots > 0 and info['videos']:
            src, poster = info['videos'][0]
            used.add(poster)
            pool, kind, text = build_entry(info, (src, poster), 'video', 'film', curated)
            additions['videos'].setdefault(pool, []).append(text)
            counts['video'] += 1
            made.append('film ' + os.path.basename(src))
            slots -= 1
        if slots > 0 and info['gifs']:
            g = best_file(info['gifs'][0])
            used.add(g)
            pool, kind, text = build_entry(info, g, 'image', 'gif', curated)
            additions['images'].setdefault(pool, []).append(text)
            counts['gif'] += 1
            made.append('gif ' + os.path.basename(g))
            slots -= 1
        if slots > 0:
            # Never re-show a frame the deck already has: the curated entry's own
            # image, the film's poster frame, and any GIF already used.
            exclude = {frame_key(x) for x in (used | {poster, curated.get('imageUrl'), curated.get('imageUrlDesktop')}) if x}
            # Ordinals keep the ids unique — the deep-link lookup resolves a slide by
            # id, so two plates sharing one id would both land on the first entry.
            for n, p in enumerate(rank_stills(info['stills'], exclude)[:slots], 1):
                pool, kind, text = build_entry(info, p, 'image', f'plate{n}', curated)
                additions['images'].setdefault(pool, []).append(text)
                counts['still'] += 1
                made.append('still ' + os.path.basename(p))
        if not made and not curated:
            counts['no_media'].append(page)
        if existing + len(made) < 2:
            counts['singles'].append(page)
        if apply or os.environ.get('POOL_VERBOSE'):
            print(f'  {page:46s} +{len(made)}  {" | ".join(made)}')

    # Hand-curated entries predate the plate bakes, so some still point at a responsive
    # or thumbnail sibling of a frame whose full plate is sitting in the same folder.
    # Same rule as the generated entries: the best file of that exact frame.
    mobile_re = re.compile(r'-mobile\.[a-z0-9]+$', re.I)
    upgrades = []
    for key in POOL_KEYS:
        for kind in ('videos', 'images'):
            for ent in pools[key][kind]:
                f = ent['fields']
                for field in ('imageUrlDesktop', 'imageUrl'):
                    v = f.get(field) or ''
                    # The mobile slot is deliberately the lighter file; leave it alone.
                    if not v or (field == 'imageUrl' and mobile_re.search(v)):
                        continue
                    if not os.path.exists(os.path.join(ROOT, v)):
                        continue
                    b = best_file(v)
                    if b != v:
                        upgrades.append((f.get('id') or f.get('projectUrl'), field, v, b))

    total_new = sum(len(v) for lst in additions.values() for v in lst.values())
    print(f"\nnew entries: {total_new} (film {counts['video']}, gif {counts['gif']}, still {counts['still']})")
    print(f"projects gaining their first entry: {counts['new_projects']}")
    print(f"projects left with a single entry: {len(counts['singles'])} {counts['singles'][:12]}")
    print(f"curated entries upgraded to the best file of their frame: {len(upgrades)}")
    for u in upgrades[:20]:
        print(f'  {u[0] or "?":28s} {u[1]:16s} {os.path.basename(u[2])} -> {os.path.basename(u[3])}')
    print(f"projects with no usable media at all: {len(counts['no_media'])} {counts['no_media'][:8]}")
    if not apply:
        print('\nREPORT ONLY - pass --apply to write js/main.js')
        return
    # splice: append each generated entry to the end of its pool array
    text = main_js
    if upgrades:
        # Rewrite only inside the servicePools block, so the same path used by a card
        # thumb or drawer elsewhere in main.js keeps the size it was chosen for.
        # The replace is region-wide, which would also reach a pool another tool owns:
        # `str.replace` fixes every copy, so a path shared between, say, motion and the
        # externally owned products array would get rewritten in both. Refuse instead of
        # quietly editing another machine's artefact.
        _, bounds = pool_blocks(text)
        clash = sorted({(key, os.path.basename(v))
                        for key in owned
                        for _id, field, v, b in upgrades
                        if f"{field}: '{v}'" in text[bounds[key][0]:bounds[key][1]]})
        if clash:
            raise SystemExit(
                'refusing to write js/main.js: these strings also live in a pool this script does not\n'
                'own, and the region-wide upgrade replace below would rewrite them there too:\n  %s\n'
                'Own it properly instead: run %s and let it upgrade its own entries.'
                % ('\n  '.join('%s: %s' % c for c in clash),
                   ', '.join(sorted(set(EXTERNALLY_OWNED.values())))))
        s0 = text.index('\n  architecture: {')
        e0 = text.index('\n};', s0)
        region = text[s0:e0]
        for _id, field, v, b in upgrades:
            region = region.replace(f"{field}: '{v}'", f"{field}: '{b}'")
        text = text[:s0] + region + text[e0:]
    for kind in ('videos', 'images'):
        for pool, entries in additions[kind].items():
            marker = f'\n  {pool}: {{'
            s = text.index(marker)
            arr = f'{kind}: ['
            i = text.index(arr, s)
            # An images array is the last field of its pool, so it closes with ']' and no
            # comma; a videos array closes with '],'. Matching only '],' runs past the end
            # of the pool and appends the entries into the next service instead.
            m = re.search(r'\n    \],?\n', text[i:])
            assert m, f'no array close after {pool}.{kind}'
            j = i + m.start()
            block = ''.join(',\n' + e for e in entries)
            text = text[:j] + block + text[j:]
            print(f'added {len(entries)} {pool}.{kind}')
    tmp = os.path.join(ROOT, 'js', 'main.js.x.tmp')
    # js/main.js is LF on disk; only restore CRLF if the file actually used it.
    with open(os.path.join(ROOT, 'js', 'main.js'), 'rb') as fh:
        was_crlf = b'\r\n' in fh.read()
    out = text.replace('\n', '\r\n').encode('utf-8') if was_crlf else text.encode('utf-8')
    for attempt in range(90):
        try:
            with open(tmp, 'wb') as fh:
                fh.write(out)
            os.replace(tmp, os.path.join(ROOT, 'js', 'main.js'))
            break
        except OSError as exc:
            print('retry', attempt, exc)
    else:
        sys.exit('FAILED to write main.js')
    assert open(os.path.join(ROOT, 'js', 'main.js'), 'rb').read() == out
    print('node --check:', subprocess.call('node --check js/main.js', shell=True, cwd=ROOT))


if __name__ == '__main__':
    main_()
else:
    # This module used to end in a bare `main_()`, so IMPORTING it ran the whole generator --
    # and because the apply switch is read from sys.argv, an importer whose command line happened
    # to carry --apply would have rewritten js/main.js as a side effect of reaching for a helper.
    # Verified 2026-10-21 by importing it for a pool count and getting a full report back.
    print('build_slideshow_pool imported, not run: it regenerates js/main.js when EXECUTED. '
          'Call main_() explicitly if that is really what you mean.')
