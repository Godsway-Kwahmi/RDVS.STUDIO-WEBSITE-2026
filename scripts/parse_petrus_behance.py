import re
import json

with open('scripts/petrus_full.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Look for project modules or images
urls = re.findall(r'https://mir-s3-cdn-cf\.behance\.net/project_modules/[^\s"\'<>]+', html)
print(f'Total project_modules matches: {len(urls)}')

# Categorize by filename/hash
images = {}
for u in urls:
    # clean url
    u = u.split('?')[0]
    parts = u.split('/')
    if len(parts) >= 2:
        filename = parts[-1]
        size_type = parts[-2]
        if filename not in images:
            images[filename] = {}
        images[filename][size_type] = u

print(f'Unique images: {len(images)}')
for i, (fn, sizes) in enumerate(images.items()):
    best = sizes.get('fs') or sizes.get('1400_opt_1') or sizes.get('1400') or sizes.get('disp') or sizes.get('max_1200') or list(sizes.values())[0]
    print(f'[{i+1}] {fn} -> Available sizes: {list(sizes.keys())}')
    print(f'    Best URL: {best}')

# Let's also check for project text, title, description, credits in html
m_desc = re.findall(r'<meta[^>]+description[^>]+content="([^"]+)"', html)
print('Meta description:', m_desc)

# Find any JSON data in window.__INITIAL_STATE__
m_state = re.search(r'window\.__INITIAL_STATE__\s*=\s*(\{.*?\});\s*</script>', html, re.DOTALL)
if m_state:
    try:
        data = json.loads(m_state.group(1))
        print('INITIAL_STATE parsed successfully!')
        # Look for project
        project = data.get('project', {}).get('project', {})
        if project:
            print('Project title:', project.get('name'))
            print('Project description:', project.get('description'))
            modules = project.get('modules', [])
            print(f'Modules count: {len(modules)}')
            for mod in modules:
                m_type = mod.get('type')
                print('Module type:', m_type)
                if m_type == 'image':
                    print('  Image src:', mod.get('src'))
                    sizes = mod.get('sizes', {})
                    print('  Available sizes:', list(sizes.keys()))
                elif m_type == 'text':
                    print('  Text text:', mod.get('text'))
    except Exception as e:
        print('Error parsing initial state:', e)
