import re
import json

with open('scripts/1957_behance.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
data = json.loads(scripts[8].strip())
project = data['project']['project']
print('Title:', project.get('name'))
print('Description:', project.get('description'))
print('Published on:', project.get('published_on'))
print('Fields:', project.get('fields'))
modules = project.get('modules', [])
print(f'Total Modules: {len(modules)}')

images = []
for idx, mod in enumerate(modules):
    mtype = mod.get('type')
    if mtype == 'image':
        sizes = mod.get('sizes', {})
        best = sizes.get('original') or sizes.get('fs') or sizes.get('1400_opt_1') or sizes.get('1400') or sizes.get('disp') or mod.get('src')
        print(f"[{len(images)+1}] Image id={mod.get('id')} {mod.get('width')}x{mod.get('height')} -> {best}")
        images.append({
            'index': len(images) + 1,
            'id': mod.get('id'),
            'width': mod.get('width'),
            'height': mod.get('height'),
            'url': best,
            'caption': mod.get('caption')
        })
    elif mtype == 'text':
        text_content = mod.get('text_plain') or mod.get('text')
        print(f"Text module: {text_content}")

with open('scripts/1957_images_metadata.json', 'w', encoding='utf-8') as f:
    json.dump(images, f, indent=2)
print(f"Saved {len(images)} images to scripts/1957_images_metadata.json")
