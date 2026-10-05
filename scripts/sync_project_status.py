"""Keep Sanity and data/project-status.json in step.

`visibility` (Live / Archived) is the one field that decides which surface a project
appears on: live = work page + archive page + homepage slideshow, archived = archive page
only. Sanity is the editor; the registry in git is what the static surfaces and the
slideshow generator actually read.

    py -3.10 scripts/sync_project_status.py --pull                # Sanity -> registry (report)
    py -3.10 scripts/sync_project_status.py --pull --apply        # Sanity -> registry (write)
    py -3.10 scripts/sync_project_status.py --push                # registry -> Sanity (report)
    py -3.10 scripts/sync_project_status.py --push --apply        # registry -> Sanity (write)
    py -3.10 scripts/sync_project_status.py --push --create-missing

Safety rules: this script never deletes a document, only creates (when asked) and patches
the `visibility` field, batches mutations, and refuses to run on a placeholder token.
"""
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REGISTRY = os.path.join(ROOT, 'data', 'project-status.json')
API_VERSION = '2024-01-01'
BATCH = 40


def env(path):
    values = {}
    with open(path, encoding='utf-8', errors='replace') as fh:
        for line in fh:
            line = line.strip()
            if not line or line.startswith('#') or '=' not in line:
                continue
            k, _, v = line.partition('=')
            values[k.strip()] = v.strip().strip('"').strip("'")
    return values


def load_env():
    for rel in (os.path.join(ROOT, '.env'), os.path.join(ROOT, '.env.example')):
        if os.path.exists(rel):
            e = env(rel)
            if e.get('SANITY_PROJECT_ID'):
                return e, rel
    sys.exit('no .env found — copy .env.example and fill in your Sanity values')


def api(e, path, payload=None, write=False):
    token = e.get('SANITY_API_TOKEN', '')
    host = 'api.sanity.io' if write else 'apicdn.sanity.io'
    url = f'https://{host}/v{e.get("SANITY_API_VERSION", API_VERSION)}/{path}'
    headers = {'Authorization': f'Bearer {token}'}
    data = None
    if payload is not None:
        data = json.dumps(payload).encode('utf-8')
        headers['Content-Type'] = 'application/json'
    req = urllib.request.Request(url, data=data, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=90) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode('utf-8', 'replace')[:400]
        raise SystemExit(f'Sanity {exc.code} on {path}: {body}')
    except urllib.error.URLError as exc:
        raise SystemExit(f'Cannot reach Sanity ({exc.reason}) — check network and project id')


def guard_token(e, source, needs_write=False):
    token = e.get('SANITY_API_TOKEN', '')
    looks_real = len(token) >= 30 and not token.lower().startswith(('your', 'paste', 'xxx', 'changeme'))
    if not looks_real:
        raise SystemExit(
            f'SANITY_API_TOKEN in {os.path.basename(source)} is still the placeholder.\n'
            'Create an edit token at https://sanity.io/manage -> your project -> API -> Tokens,\n'
            f'put it in {source}, then re-run. Nothing was changed.')
    if needs_write and 'write' not in (e.get('SANITY_TOKEN_SCOPES', '') or '').lower():
        print('note: the token must carry edit scope to push (write).')


def load_registry():
    with open(REGISTRY, encoding='utf-8') as fh:
        return json.load(fh, object_pairs_hook=lambda pairs: dict(pairs))


def save_registry(payload):
    text = json.dumps(payload, indent=2, ensure_ascii=False) + '\n'
    tmp = REGISTRY + '.x.tmp'
    with open(tmp, 'w', encoding='utf-8', newline='\n') as fh:
        fh.write(text)
    os.replace(tmp, REGISTRY)
    assert open(REGISTRY, encoding='utf-8').read() == text
    print(f'wrote data/project-status.json ({len(text):,} bytes)')


def sanity_state(e):
    """Every project document, keyed by the HTML page it is served from.

    The registry is keyed by page file, and a project's slug is no longer guaranteed to equal it:
    the site renames display titles but keeps its live URLs, so "Senseble" is served from
    home-automation-system-presentation.html. `pageFile` is the canonical join key; the slug stem
    is kept as a fallback so documents seeded before that field existed still match.
    """
    groq = ('*[_type == "project"] { '
            '"pageFile": pageFile, "slug": slug.current, title, '
            '"visibility": coalesce(visibility, "live"), "year": publishedAt }')
    res = api(e, f"data/query/{e['SANITY_DATASET']}?query=" + urllib.parse.quote(groq))
    docs = {}
    for d in res.get('result') or []:
        key = d.get('pageFile') or ((d.get('slug') or '') + '.html')
        if key:
            docs[key] = d
    return docs


def pull(e, apply):
    docs = sanity_state(e)
    reg = load_registry()['projects']
    print(f'sanity projects: {len(docs)} | registry projects: {len(reg)}')
    drift, missing = [], []
    for page, row in reg.items():
        d = docs.get(page)
        if not d:
            missing.append(page)
            continue
        remote = d.get('visibility') or 'live'
        if remote != row['visibility']:
            drift.append((page, row['visibility'], remote))
    reg_pages = set(reg)
    print(f'visibility differs from Sanity: {len(drift)}')
    for page, local, remote in drift[:30]:
        print(f'  {page:44s} registry={local:9s} sanity={remote}')
    print(f'registry rows with no Sanity document yet: {len(missing)} {missing[:8]}')
    in_sanity_only = [p for p in docs if p not in reg_pages]
    print(f'Sanity documents with no registry row: {len(in_sanity_only)} {in_sanity_only[:8]}')
    if not apply:
        print('\nREPORT ONLY - pass --apply to write the registry')
        return
    for page, _local, remote in drift:
        row = reg[page]
        row['visibility'] = remote
        row['onWorkPage'] = remote == 'live'
    save_registry({'generated': 'from Sanity by scripts/sync_project_status.py --pull',
                   'contract': 'visibility live = work page + archive page + homepage slideshow; '
                               'archived = archive page only',
                   'projects': reg})


def push(e, apply, create_missing):
    reg = load_registry()['projects']
    docs = sanity_state(e)
    create, patch = [], []
    for page, row in reg.items():
        stem = os.path.splitext(page)[0]
        if page in docs:
            if (docs[page].get('visibility') or 'live') != row['visibility']:
                patch.append((page, row['visibility']))
        elif create_missing:
            doc = {'_type': 'project', 'title': row['title'] or stem,
                   'pageFile': page, 'slug': {'current': stem},
                   'visibility': row['visibility']}
            if row.get('year') and 2000 <= int(row['year']) <= 2100:
                doc['publishedAt'] = int(row['year'])
            else:
                # publishedAt is required() in the schema; the API will take a doc without it,
                # but the Studio form will flag it, so a placeholder year keeps the list usable.
                doc['publishedAt'] = 2000
            create.append(doc)
    print(f'patches: {len(patch)} | documents to create: {len(create)} '
          f'(| {len(docs)} already in Sanity)')
    for page, vis in patch[:20]:
        print(f'  set visibility={vis:9s} on {page}')
    for d in create[:10]:
        print(f'  create {d["pageFile"]:44s} {d["visibility"]} year={d["publishedAt"]}')
    if not create and not patch:
        print('Sanity already matches the registry.')
        return
    if not apply:
        print('\nREPORT ONLY - pass --apply (and --create-missing to seed) to send mutations')
        return
    mutations = []
    for page, vis in patch:
        # Match the same way sanity_state() keys: pageFile first, slug as the legacy fallback.
        stem = os.path.splitext(page)[0]
        expr = (f'*[_type == "project" && (pageFile == "{page}" || '
                f'slug.current == "{stem}")][0]')
        mutations.append({'patch': expr, 'set': {'visibility': vis, 'pageFile': page}})
    mutations.extend({'create': doc} for doc in create)
    url_tail = f"data/mutations/{e['SANITY_DATASET']}"
    sent = 0
    for i in range(0, len(mutations), BATCH):
        chunk = mutations[i:i + BATCH]
        res = api(e, url_tail, payload={'mutations': chunk}, write=True)
        results = res.get('results') or []
        sent += len(chunk)
        print(f'  batch {i // BATCH + 1}: {len(chunk)} mutations '
              f'(created {sum(1 for r in results if r.get("created"))}, '
              f'updated {sum(1 for r in results if r.get("results"))})')
    print(f'sent {sent} mutations; re-run --pull to confirm the two sides agree')


def main():
    args = sys.argv[1:]
    apply = '--apply' in args
    create_missing = '--create-missing' in args
    if ('--pull' in args) == ('--push' in args):
        sys.exit(__doc__)
    e, source = load_env()
    guard_token(e, source, needs_write='--push' in args)
    if '--push' in args:
        push(e, apply, create_missing)
    else:
        pull(e, apply)


if __name__ == '__main__':
    main()
