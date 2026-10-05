"""Give every gallery image its intrinsic size so the half-width cap costs no layout shift.

css/styles.css sizes desktop detail images with `width:auto` + `max-width` + `max-height`
so each frame keeps its own proportions. That only works if the browser knows the
proportions before the bytes arrive: an <img> with no width/height attributes measures 0
wide until it decodes, so the row collapses and then jumps. Writing the real pixel
dimensions into the markup lets the browser reserve the correct aspect box immediately —
the same values, known up front.

Usage:
    py -3.10 scripts/add_gallery_dimensions.py            # report only
    py -3.10 scripts/add_gallery_dimensions.py --apply    # rewrite the pages
"""
import os
import re
import sys
import time

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APPLY = '--apply' in sys.argv
IMG_TAG = re.compile(r'<img\b[^>]*>', re.I)
CLASS_ATTR = re.compile(r'class\s*=\s*"([^"]*)"', re.I)


def pages():
    for name in sorted(os.listdir(ROOT)):
        if not name.endswith('.html'):
            continue
        path = os.path.join(ROOT, name)
        with open(path, 'rb') as fh:
            raw = fh.read()
        if b'gallery-img' in raw or b'gallery-video' in raw:
            yield name, raw


def size_of(src):
    target = os.path.join(ROOT, src.replace('\\', '/'))
    if not os.path.isfile(target):
        return None
    try:
        with Image.open(target) as im:
            return im.size
    except Exception:
        return None


def patch_page(name, raw, stats):
    crlf = b'\r\n' in raw
    text = raw.decode('utf-8').replace('\r\n', '\n') if crlf else raw.decode('utf-8')

    def fix(match):
        tag = match.group(0)
        cls = CLASS_ATTR.search(tag)
        if not cls or not re.search(r'gallery-(img|video)', cls.group(1)):
            return tag
        if re.search(r'\bwidth\s*=', tag, re.I) and re.search(r'\bheight\s*=', tag, re.I):
            stats['already'] += 1
            return tag
        src = re.search(r'\bsrc\s*=\s*"([^"]+)"', tag)
        if not src:
            stats['no_src'] += 1
            return tag
        dims = size_of(src.group(1))
        if not dims:
            stats['unreadable'].append(f'{name}: {src.group(1)}')
            return tag
        w, h = dims
        # Insert after `<img ` so the attributes sit next to src, matching the site's
        # existing attribute order on the hero images.
        new = re.sub(r'^<img\b\s*', f'<img width="{w}" height="{h}" ', tag, count=1, flags=re.I)
        stats['added'] += 1
        return new

    out = IMG_TAG.sub(fix, text)
    if out == text:
        return None
    return (out.replace('\n', '\r\n') if crlf else out).encode('utf-8')


def main():
    stats = {'added': 0, 'already': 0, 'no_src': 0, 'unreadable': [], 'files': 0}
    writes = []
    for name, raw in pages():
        out = patch_page(name, raw, stats)
        if out is not None:
            writes.append((name, raw, out))
            stats['files'] += 1

    print(f'pages with a gallery: {stats["files"]} rewritten | '
          f'dimensions added: {stats["added"]} | already sized: {stats["already"]} | '
          f'no src: {stats["no_src"]}')
    if stats['unreadable']:
        print(f'unreadable/missing files: {len(stats["unreadable"])}')
        for line in stats['unreadable'][:15]:
            print('  ', line)
    if not APPLY:
        print('\nREPORT ONLY - pass --apply to write the pages')
        return
    for name, before, out in writes:
        path = os.path.join(ROOT, name)
        tmp = path + '.x.tmp'
        for attempt in range(90):
            try:
                with open(tmp, 'wb') as fh:
                    fh.write(out)
                os.replace(tmp, path)
                break
            except OSError as exc:
                print('retry', name, attempt, exc)
                time.sleep(2)
        else:
            sys.exit(f'FAILED to write {name}')
        assert open(path, 'rb').read() == out, f'read-back mismatch: {name}'
    print(f'wrote {len(writes)} pages')


main()
