import json

with open('scripts/naadei_full.html', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

p = content.find('"modules":')
# Find preceding <script
script_start = content.rfind('<script', 0, p)
script_body_start = content.find('>', script_start) + 1
script_end = content.find('</script>', p)

print(f"Script from {script_body_start} to {script_end}")
script_text = content[script_body_start:script_end].strip()

# Behance usually has something like: window.__INITIAL_STATE__ = { ... } or just { ... }
if '=' in script_text:
    eq_idx = script_text.find('=')
    json_candidate = script_text[eq_idx+1:].strip()
    if json_candidate.endswith(';'):
        json_candidate = json_candidate[:-1].strip()
else:
    json_candidate = script_text

try:
    data = json.loads(json_candidate)
    print("Parsed JSON successfully!")
except Exception as e:
    print(f"Direct JSON parse failed: {e}")
    # Try finding { "project": or similar
    brace_start = content.rfind('{', 0, p)
    # Or find "project":{"modules":
    proj_idx = content.rfind('"project":', 0, p)
    print("proj_idx:", proj_idx)
    # Let's inspect first 200 chars of script_text
    print("Script prefix:", script_text[:200])

if 'data' in locals() and isinstance(data, dict):
    # Navigate to project
    project = data.get('project', {})
    if 'project' in project:
        project = project['project']
    print("Project title:", project.get('name') or project.get('title'))
    print("Published on:", project.get('published_on'))
    print("Description:", project.get('description'))
    modules = project.get('modules', [])
    print(f"Found {len(modules)} modules")
    
    images = []
    for mod in modules:
        img_sizes = mod.get('imageSizes', {})
        if not img_sizes and 'sizes' in mod:
            img_sizes = mod.get('sizes', {})
        if img_sizes:
            # Let's inspect available sizes
            print(f"Mod id={mod.get('id')}, keys={list(img_sizes.keys())}")
            # Usually: size_fs, size_max_3840, size_2800, size_1400, size_disp, or allAvailable
            best_url = None
            for sz_key in ['size_source', 'size_max_3840', 'size_2800', 'size_fs', 'size_1400_opt_1', 'size_1400', 'size_disp']:
                if sz_key in img_sizes and isinstance(img_sizes[sz_key], dict) and 'url' in img_sizes[sz_key]:
                    best_url = img_sizes[sz_key]['url']
                    break
            if not best_url and 'allAvailable' in img_sizes:
                avail = img_sizes['allAvailable']
                for pref in ['2800', '1400', 'fs', 'disp']:
                    for itm in avail:
                        if f'/{pref}/' in itm.get('url', ''):
                            best_url = itm['url']
                            break
                    if best_url:
                        break
            if not best_url:
                # fallback to first url found
                for v in img_sizes.values():
                    if isinstance(v, dict) and 'url' in v:
                        best_url = v['url']
                        break
            if best_url:
                images.append({
                    'index': len(images) + 1,
                    'id': mod.get('id'),
                    'url': best_url,
                    'caption': mod.get('caption', '')
                })
                print(f"[{len(images)}] -> {best_url}")

    with open('scripts/naadei_download_list.json', 'w', encoding='utf-8') as f:
        json.dump(images, f, indent=2)
    print(f"Saved {len(images)} images to scripts/naadei_download_list.json")
