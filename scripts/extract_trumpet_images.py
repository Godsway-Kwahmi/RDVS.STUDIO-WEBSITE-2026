import json
import os

with open('scripts/trumpet_project_data.json', 'r', encoding='utf-8') as f:
    proj = json.load(f)

modules = proj.get('modules', [])
img_modules = []
for i, m in enumerate(modules):
    if m.get('__typename') == 'ImageModule':
        sizes = m.get('sizes', {})
        best = sizes.get('fs') or sizes.get('1400_opt_1') or sizes.get('1400') or sizes.get('disp') or m.get('src')
        img_modules.append({
            'module_index': i + 1,
            'id': m.get('id'),
            'best_url': best,
            'caption': m.get('captionPlain') or '',
            'width': m.get('width'),
            'height': m.get('height')
        })

print(f"Total image modules: {len(img_modules)}")
with open('scripts/trumpet_images_list.json', 'w', encoding='utf-8') as out_f:
    json.dump(img_modules, out_f, indent=2)

for im in img_modules:
    print(f"Module {im['module_index']}: {im['best_url']}")
