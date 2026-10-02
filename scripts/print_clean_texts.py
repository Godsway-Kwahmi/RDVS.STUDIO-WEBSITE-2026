import json
import re

with open('scripts/trumpet_project_data.json', 'r', encoding='utf-8') as f:
    proj = json.load(f)

print("Title:", proj.get('name'))
print("Description:", proj.get('description'))
print("Fields:", proj.get('fields'))

modules = proj.get('modules', [])
for i, mod in enumerate(modules):
    mtype = mod.get('__typename')
    if mtype == 'TextModule':
        raw_text = mod.get('text', '')
        # Clean html tags for inspection
        clean = re.sub(r'<br\s*/?>', '\n', raw_text)
        clean = re.sub(r'</?(?:div|p)[^>]*>', '\n', clean)
        clean = re.sub(r'\xa0', ' ', clean)
        clean = re.sub(r'\n+', '\n', clean).strip()
        print(f"\n[Mod {i+1} Text]:\n{clean}")
    elif mtype == 'ImageModule':
        print(f"[Mod {i+1} Image]: {mod.get('id')}")
    elif mtype == 'VideoModule':
        print(f"[Mod {i+1} Video]: {mod.get('id')}")
