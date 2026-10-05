"""Generate data/project-status.json — the Live / Archived registry.

Bootstrap direction is HTML -> registry: a project is `live` when work.html carries a
`.grid-card` for it, and `archived` when only archive.html lists it. Once this file
exists the direction reverses — the registry (mirrored in Sanity) decides which surface
a project appears on, and this script becomes the drift check.

Usage:
    py -3.10 scripts/build_project_status.py            # report only
    py -3.10 scripts/build_project_status.py --apply    # write data/project-status.json
"""
import json
import os
import re
import sys
from collections import OrderedDict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join('data', 'project-status.json')

# Pages that live in the same folder as project pages but are not projects.
NOT_A_PROJECT = {
    'index.html', 'work.html', 'archive.html', 'about.html', 'news.html', 'services.html',
    'contact.html', 'expertise.html', 'journal.html', 'legal.html', 'privacy.html',
    'thanks.html', '404.html', 'vr.html',
}


def read(path):
    with open(os.path.join(ROOT, path), 'rb') as fh:
        raw = fh.read()
    return raw.decode('utf-8', 'replace').replace('\r\n', '\n')


def unesc(s):
    s = re.sub(r'<[^>]+>', ' ', s)
    s = (s.replace('&amp;', '&').replace('&middot;', '·').replace('&mdash;', '—')
         .replace('&ndash;', '–').replace('&#39;', "'").replace('&quot;', '"')
         .replace('&nbsp;', ' '))
    return ' '.join(s.split())


def hrefs(text, pattern):
    return list(OrderedDict.fromkeys(re.findall(pattern, text)))


def page_info(page):
    t = read(page)
    m = re.search(r'<h1 class="project-page-title"[^>]*>(.*?)</h1>', t, re.S)
    title = unesc(m.group(1)) if m else ''
    meta = re.search(r'class="project-meta-line"[^>]*>(.*?)</span>', t, re.S)
    meta_txt = unesc(meta.group(1)) if meta else ''
    year = ''
    ym = re.search(r'(19|20)\d{2}', meta_txt.split('—')[-1] if '—' in meta_txt else meta_txt)
    if ym:
        year = ym.group(0)
    is_project = bool(m) or '.project-detail-container' in t
    return {'title': title, 'meta': meta_txt, 'year': year, 'is_project': is_project,
            'plates': len(set(re.findall(
                r'(?:data-src|src)="(assets/images/[^"]+\.(?:jpg|jpeg|png|webp|gif))"', t, re.I)))}


def main_():
    apply = '--apply' in sys.argv
    work = read('work.html')
    archive = read('archive.html')

    live = hrefs(work, r'href="([a-z0-9\-]+\.html)" class="grid-card"')
    listed = [h for h in hrefs(archive, r'href="([a-z0-9\-]+\.html)"') if h not in NOT_A_PROJECT]
    pages = list(OrderedDict.fromkeys(live + listed))

    registry = OrderedDict()
    skipped, no_file = [], []
    for page in pages:
        if not os.path.exists(os.path.join(ROOT, page)):
            no_file.append(page)
            continue
        info = page_info(page)
        if not info['is_project']:
            skipped.append(page)
            continue
        registry[page] = OrderedDict([
            ('slug', os.path.splitext(page)[0]),
            ('title', info['title']),
            ('year', info['year']),
            ('visibility', 'live' if page in live else 'archived'),
            ('onWorkPage', page in live),
            ('onArchivePage', page in listed),
            ('plates', info['plates']),
        ])

    lives = [p for p, r in registry.items() if r['visibility'] == 'live']
    arch = [p for p, r in registry.items() if r['visibility'] == 'archived']
    print(f'work cards: {len(live)} | archive hrefs (projects): {len(listed)} | '
          f'registry rows: {len(registry)}')
    print(f'live: {len(lives)} | archived: {len(arch)}')
    print(f'links with no file on disk: {len(no_file)} {no_file[:6]}')
    print(f'hrefs that are not project pages: {len(skipped)} {skipped[:6]}')
    only_cards = [p for p in live if p not in listed]
    print(f'live cards missing from archive.html (should be none): {len(only_cards)} {only_cards}')
    if arch:
        print('\narchived (archive-only) today:')
        for p in arch:
            print(f'  {p:44s} {registry[p]["title"][:36]:36s} plates={registry[p]["plates"]}')

    if not apply:
        print('\nREPORT ONLY - pass --apply to write ' + OUT)
        return
    payload = OrderedDict([
        ('generated', 'from work.html + archive.html by scripts/build_project_status.py'),
        ('contract', 'visibility live = work page + archive page + homepage slideshow; '
                     'archived = archive page only'),
        ('projects', registry),
    ])
    os.makedirs(os.path.join(ROOT, 'data'), exist_ok=True)
    text = json.dumps(payload, indent=2, ensure_ascii=False) + '\n'
    tmp = os.path.join(ROOT, OUT + '.x.tmp')
    with open(tmp, 'w', encoding='utf-8', newline='\n') as fh:
        fh.write(text)
    os.replace(tmp, os.path.join(ROOT, OUT))
    back = open(os.path.join(ROOT, OUT), encoding='utf-8').read()
    assert back == text, 'registry read-back mismatch'
    print(f'\nwrote {OUT} ({len(text):,} bytes, {len(registry)} projects)')


main_()
