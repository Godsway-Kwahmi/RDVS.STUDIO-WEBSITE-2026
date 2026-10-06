"""Generate studio/taxonomy.ts from the site, so the CMS cannot drift from the front end again.

Every option list in studio/schemas/ was a hand-typed copy of work.html's filter bar, and each one
had rotted differently: project.ts still said "Architecture" and "Visual Effects (VFX) & CGI"
after the 2026-10-04 renames, had no `illustration` token, offered 8 of the 28 service tokens, and
listed 12 typologies when the cards use 33. The site is the source of truth (it is build-less
static HTML; the dataset is empty), so the schema mirrors it and this script is the mirror.

    py -3.10 scripts/build_sanity_taxonomy.py            # report drift
    py -3.10 scripts/build_sanity_taxonomy.py --write    # rewrite studio/taxonomy.ts

Exit code 1 when the committed file disagrees with the site, so the harness can gate on it.
"""
import html
import io
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'studio', 'taxonomy.ts')
WRITE = '--write' in sys.argv


def read(path):
    return io.open(os.path.join(ROOT, path), encoding='utf-8', errors='replace',
                   newline='').read().replace('\r\n', '\n')


work = read('work.html')
arch = read('archive.html')
main = read(os.path.join('js', 'main.js'))

# --- the filter bar, in bar order: (token, visible label) -----------------------
bar = []
for token, label in re.findall(
        r'<button[^>]*class="filter-btn[^"]*"[^>]*data-filter="([^"]+)"[^>]*>(.*?)</button>',
        work, re.S):
    if token == 'all':
        continue
    bar.append((token, html.unescape(re.sub(r'<[^>]+>', '', label)).strip()))

# --- main.js SUB_SERVICE_PARENTS, verbatim --------------------------------------
block = main[main.index('const SUB_SERVICE_PARENTS = {'):]
block = block[:block.index('\n  };')]
parents = dict(re.findall(r"'([a-z0-9-]+)': '([a-z0-9-]+)'", block))

names_block = main[main.index('const MAIN_SERVICE_NAMES = {'):]
names_block = names_block[:names_block.index('\n  };')]
main_names = dict(re.findall(r"'([a-z0-9-]+)': '([^']+)'", names_block))

# A token is a bar-level MAIN service iff the site's own roll-up table has no parent for it.
mains = [(t, l) for t, l in bar if t not in parents]
subs = [(t, l, parents[t]) for t, l in bar if t in parents]

# --- typologies the catalogue actually carries ----------------------------------
# Cards define the vocabulary, but the archive page lists every work the studio has ever shipped,
# live or archived. Reading cards alone made the vocabulary shrink when a work was archived (the
# owner's Live/Archived rule takes its card away), which would then refuse to import the archived
# document that still carries that typology — and re-living the work would need the token added
# back by hand. Case comes from the archive row's display cell, not its lowercase data- attribute.
card_typologies = {html.unescape(t) for t in re.findall(r'data-typology="([^"]*)"', work) if t}
archive_typologies = {html.unescape(re.sub(r'<[^>]+>', '', t)).strip()
                      for t in re.findall(r'<td class="archive-col-typology">(.*?)</td>',
                                          arch, re.S) if t.strip()}
typologies = sorted(card_typologies | archive_typologies)

# --- the in-house product line, which work.html never lists ----------------------
# A product page's meta line is `Line / Type / Kind — Year` ("MIG / Furniture / Desk — 2020"), and
# the pages are listed on product.html, so no card's data-typology can ever name them. The CMS needs
# its own vocabulary for them or a product document has nothing honest to put in `typology`.
product_pages = sorted(f for f in os.listdir(ROOT)
                       if f.startswith('product-') and f.endswith('.html')
                       and 'conflicted' not in f)
p_lines, p_types, p_kinds = set(), set(), set()
for _page in product_pages:
    _m = re.search(r'class="project-meta-line"[^>]*>(.*?)</span>', read(_page), re.S)
    if not _m:
        continue
    _head = html.unescape(re.sub(r'<[^>]+>', '', _m.group(1))).split('—')[0]
    _segs = [s.strip() for s in _head.split('/') if s.strip()]
    if len(_segs) >= 3:
        p_lines.add(_segs[0])
        p_types.add(_segs[1])
        p_kinds.add(_segs[2])
product_lines, product_types, product_kinds = sorted(p_lines), sorted(p_types), sorted(p_kinds)

# --- the five pools the homepage deck is drawn across ----------------------------
# js/main.js splits its slide budget evenly across `serviceKeys`, and each pool carries its own
# display name. A slide document has to say which pool it belongs to or the CMS cannot reproduce
# the draw the static page paints.
_keys = main[main.index('const serviceKeys = ['):]
_keys = _keys[:_keys.index('];')]
slide_keys = re.findall(r"'([a-z-]+)'", _keys)
_pools = main[main.index('const servicePools = {'):]
pool_names = dict(re.findall(r'^  ([a-z]+): \{\n    name: \'([^\']+)\',', _pools, re.M))
slide_pools = [(k, pool_names[k]) for k in slide_keys if k in pool_names]

# --- sanity checks on what we just read -----------------------------------------
# Counts are cross-checked against the site's own tables rather than pinned to numbers, so adding
# a service is a one-place change; the floors only catch a parse that read an empty bar.
assert len(bar) >= 8 and len(mains) >= 8, 'the filter bar parsed to %d tokens' % len(bar)
assert len(mains) + len(subs) == len(bar), 'a bar token is neither main nor sub'
assert set(main_names) == {t for t, _ in mains}, \
    'main.js MAIN_SERVICE_NAMES %s != the bar\'s main services %s' % (
        sorted(main_names), sorted(t for t, _ in mains))
assert set(parents) <= {t for t, _ in bar}, 'SUB_SERVICE_PARENTS names a token the bar lacks'
for _t, _l, p in subs:
    assert p in main_names, 'sub-service parent %r is not a main service' % p
for t, l in mains:
    assert main_names[t] == l, 'bar label %r != MAIN_SERVICE_NAMES %r for %s' % (l, main_names[t], t)
assert product_pages and product_kinds, 'no product pages found to read the MIG vocabulary from'
assert len(slide_pools) == len(slide_keys) >= 4, \
    'serviceKeys %s not all present in servicePools %s' % (slide_keys, sorted(pool_names))


def ts_list(items, indent='  '):
    return '\n'.join(indent + s for s in items)


def q(s):
    return "'%s'" % s.replace("'", "\\'")


body = []
body.append('/**')
body.append(' * The site\'s service taxonomy and typology vocabulary, generated from the front end.')
body.append(' *')
body.append(' * DO NOT EDIT BY HAND. The static site is the source of truth: work.html\'s filter bar defines the')
body.append(' * tokens and their visible labels, js/main.js\'s SUB_SERVICE_PARENTS defines which tokens are')
body.append(' * sub-services and what they roll up to, and the work cards define the typology vocabulary. Regenerate')
body.append(' * with `py -3.10 scripts/build_sanity_taxonomy.py --write` after any change to the bar, the roll-up')
body.append(' * table or a card\'s data-typology — scratch/_verify_backlog.py fails when this file disagrees.')
body.append(' *')
body.append(' * Keeping the option lists here rather than copy-typed inside each schema is the point: hand-typed')
body.append(' * copies rotted (project.ts still offered "Architecture" and "Visual Effects (VFX) & CGI" after the')
body.append(' * 2026-10-04 renames, and had no `illustration` token).')
body.append(' */')
body.append('')
body.append('export type ServiceToken = %s' % ts_list(
    ['  | ' + q(t) for t, _ in bar], ''))
body.append('')
body.append("export interface ServiceOption {value: ServiceToken; label: string}")
body.append('')
body.append('/** The eight top-level services on work.html\'s filter bar, in bar order. */')
body.append('export const MAIN_SERVICES: ServiceOption[] = [')
body.append(ts_list(['{value: %s, label: %s},' % (q(t), q(l)) for t, l in mains]))
body.append(']')
body.append('')
body.append('/** The sub-services, each with the main service its slide caption rolls up to. */')
body.append('export interface SubServiceOption extends ServiceOption {parent: string}')
body.append('export const SUB_SERVICES: SubServiceOption[] = [')
body.append(ts_list(['{value: %s, label: %s, parent: %s},' % (q(t), q(l), q(p)) for t, l, p in subs]))
body.append(']')
body.append('')
body.append('/** All 28 filter tokens, in bar order — what a project may be tagged with. */')
body.append('export const SERVICES: ServiceOption[] = [...MAIN_SERVICES, ...SUB_SERVICES]')
body.append('')
body.append('/** {token: label} for every filter token. */')
body.append('export const SERVICE_LABELS: Record<ServiceToken, string> = Object.fromEntries(')
body.append('  SERVICES.map((s) => [s.value, s.label]),')
body.append(') as Record<ServiceToken, string>')
body.append('')
body.append('/** {sub-service token: main service token}; main services are absent. */')
body.append('export const SERVICE_PARENTS: Record<string, string> = Object.fromEntries(')
body.append('  SUB_SERVICES.map((s) => [s.value, s.parent]),')
body.append(')')
body.append('')
body.append('/** Roll a project\'s tokens up to the main services a homepage slide may name. */')
body.append('export function rollUpMainServices(tokens: string[]): ServiceToken[] {')
body.append('  const parents = new Set(')
body.append('    tokens.map((t) => (SERVICE_PARENTS[t] ? SERVICE_PARENTS[t] : t) as ServiceToken),')
body.append('  )')
body.append('  return MAIN_SERVICES.map((s) => s.value).filter((v) => parents.has(v))')
body.append('}')
body.append('')
body.append('/**')
body.append(' * Typologies in use across the work cards. Adding one is a site-side change first: it has to appear')
body.append(' * on a card\'s data-typology before the CMS offers it.')
body.append(' */')
body.append('export const TYPOLOGIES: string[] = [')
body.append(ts_list([q(t) + ',' for t in typologies]))
body.append(']')
body.append('')
body.append('/**')
body.append(' * The in-house product line, harvested from the product pages\' own meta lines')
body.append(' * (`Line / Type / Kind`). These are NOT typologies: product pages appear on product.html, never')
body.append(' * on work.html, so a product document has its own vocabulary to be tagged with.')
body.append(' */')
body.append('export const PRODUCT_LINES: string[] = [%s]' % ', '.join(q(x) for x in product_lines))
body.append('export const PRODUCT_TYPES: string[] = [%s]' % ', '.join(q(x) for x in product_types))
body.append('export const PRODUCT_KINDS: string[] = [%s]' % ', '.join(q(x) for x in product_kinds))
body.append('')
body.append("/** The pools js/main.js's servicePools is drawn across, in its own order. */")
body.append('export interface SlidePoolOption {value: string; label: string}')
body.append('export const SLIDE_POOLS: SlidePoolOption[] = [')
body.append(ts_list(['{value: %s, label: %s},' % (q(k), q(v)) for k, v in slide_pools]))
body.append(']')
body.append('')
body.append('/** The two site-visibility states, mirroring data/project-status.json. */')
body.append('export const VISIBILITY = {LIVE: \'live\', ARCHIVED: \'archived\'} as const')
body.append('')

text = '\n'.join(body) + '// generated by scripts/build_sanity_taxonomy.py — do not edit\n'

# --- the browser twin ------------------------------------------------------------
# js/sanity-render.js writes a project's meta line from the CMS `disciplines` array, which holds
# TOKENS ("architecture-planning") while the page shows LABELS ("Architectural Design"). Rendering
# the tokens was a visible bug. The browser cannot import a .ts file, so the same table is emitted
# here and loaded before sanity-render.js.
js = []
js.append('/**')
js.append(' * GENERATED by scripts/build_sanity_taxonomy.py — DO NOT EDIT BY HAND.')
js.append(' * The browser twin of studio/taxonomy.ts: work.html\'s filter bar is the source of truth, this is')
js.append(' * the copy the runtime reads so a CMS token is never printed where a visitor should see the label')
js.append(' * the bar itself uses. Loaded by the pages that hydrate from Sanity, before js/sanity-render.js.')
js.append(' */')
js.append('window.RDVSSanityTaxonomy = (function () {')
js.append('  var SERVICE_LABELS = {')
for t, l in bar:
    js.append('    %s: %s,' % (json.dumps(t), json.dumps(l)))
js.append('  };')
js.append('  var SERVICE_PARENTS = {')
for t, _l, p in subs:
    js.append('    %s: %s,' % (json.dumps(t), json.dumps(p)))
js.append('  };')
js.append('  var MAIN_SERVICES = [%s];' % ', '.join(json.dumps(t) for t, _ in mains))
js.append('  function label(token) { return SERVICE_LABELS[token] || token || \'\'; }')
js.append('  function labels(tokens) {')
js.append('    return (tokens || []).filter(Boolean).map(label);')
js.append('  }')
js.append('  function rollUpMainServices(tokens) {')
js.append('    var seen = {};')
js.append('    (tokens || []).forEach(function (t) { seen[SERVICE_PARENTS[t] || t] = true; });')
js.append('    return MAIN_SERVICES.filter(function (m) { return seen[m]; });')
js.append('  }')
js.append('  return {SERVICE_LABELS: SERVICE_LABELS, SERVICE_PARENTS: SERVICE_PARENTS,')
js.append('          MAIN_SERVICES: MAIN_SERVICES, label: label, labels: labels,')
js.append('          rollUpMainServices: rollUpMainServices};')
js.append('})();')
js_text = '\n'.join(js) + '\n'

OUT_JS = os.path.join(ROOT, 'js', 'sanity-taxonomy.js')


def in_step(path, want):
    return os.path.isfile(path) and read(os.path.relpath(path, ROOT)).replace('\r\n', '\n') == want


if in_step(OUT, text) and in_step(OUT_JS, js_text):
    print('studio/taxonomy.ts and js/sanity-taxonomy.js are in step with the site '
          '(%d services, %d typologies, %d product kinds, %d slide pools)'
          % (len(bar), len(typologies), len(product_kinds), len(slide_pools)))
    sys.exit(0)
print('STALE — regenerating would change: %s'
      % ', '.join(os.path.relpath(p, ROOT) for p in (OUT, OUT_JS) if not in_step(p, {
          OUT: text, OUT_JS: js_text}[p])))

print('  mains: %s' % ', '.join(t for t, _ in mains))
print('  subs : %d tokens' % len(subs))
print('  typologies: %d' % len(typologies))
print('  product  : lines=%s types=%s kinds=%d'
      % (product_lines, product_types, len(product_kinds)))
print('  pools    : %s' % ', '.join('%s(%s)' % kv for kv in slide_pools))

if not WRITE:
    print('\nREPORT ONLY - pass --write to emit studio/taxonomy.ts + js/sanity-taxonomy.js')
    sys.exit(1)

for path, want in ((OUT, text), (OUT_JS, js_text)):
    tmp = path + '.x.tmp'
    with open(tmp, 'wb') as fh:
        fh.write(want.encode('utf-8'))
    os.replace(tmp, path)
    print('wrote %s (%d bytes)' % (os.path.relpath(path, ROOT), len(want.encode('utf-8'))))
