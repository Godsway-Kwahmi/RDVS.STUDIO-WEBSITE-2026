import re
import json

with open('scripts/naadei_full.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Look for project JSON in HTML
# Behance typically embeds it in a script tag or window.__INITIAL_STATE__
scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
project_data = None
for idx, s in enumerate(scripts):
    s_clean = s.strip()
    if '"modules"' in s_clean and ('"project"' in s_clean or 'name' in s_clean):
        try:
            data = json.loads(s_clean)
            if 'project' in data and 'project' in data['project']:
                project_data = data['project']['project']
                print(f"Found project_data in script {idx} (structure 1)")
                break
            elif 'project' in data:
                project_data = data['project']
                print(f"Found project_data in script {idx} (structure 2)")
                break
        except Exception:
            pass

if not project_data:
    m = re.search(r'"modules":(\[.*?\]),\s*"', html)
    if m:
        modules = json.loads(m.group(1))
        project_data = {'modules': modules}
        print("Found modules via regex")

if project_data:
    print("Project Name:", project_data.get('name'))
    print("Description:", project_data.get('description'))
    print("Published On:", project_data.get('published_on'))
    print("Fields:", project_data.get('fields'))
    modules = project_data.get('modules', [])
    print(f"Modules count: {len(modules)}")

    image_list = []
    for mod in modules:
        mtype = mod.get('type')
        if mtype == 'image':
            sizes = mod.get('sizes', {})
            best_url = (sizes.get('original') or sizes.get('fs') or sizes.get('max_3840') 
                        or sizes.get('2800') or sizes.get('1400_opt_1') or sizes.get('1400') 
                        or sizes.get('disp') or mod.get('src'))
            all_avail = mod.get('imageSizes', {}).get('allAvailable', [])
            if all_avail:
                for pref in ['2800', '1400', 'source', 'fs', 'max_3840', 'disp']:
                    for item in all_avail:
                        if f'/{pref}/' in item.get('url', ''):
                            best_url = item.get('url')
                            break
                    if best_url:
                        break
            if best_url:
                image_list.append({
                    'index': len(image_list) + 1,
                    'id': mod.get('id'),
                    'width': mod.get('width'),
                    'height': mod.get('height'),
                    'url': best_url,
                    'caption': mod.get('caption')
                })
                print(f"Image [{len(image_list)}]: {mod.get('width')}x{mod.get('height')} -> {best_url}")
        elif mtype == 'text':
            print("Text module:", mod.get('text_plain') or mod.get('text'))

    with open('scripts/naadei_images_metadata.json', 'w', encoding='utf-8') as f:
        json.dump(image_list, f, indent=2)
    print(f"Saved {len(image_list)} images to scripts/naadei_images_metadata.json")
else:
    print("Could not find project data!")
