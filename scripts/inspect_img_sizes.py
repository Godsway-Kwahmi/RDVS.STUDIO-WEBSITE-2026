import re
import json

with open('scripts/petrus_full.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

m = re.search(r'"modules":(\[.*?\]),\s*"', html)
if m:
    modules = json.loads(m.group(1))
    mod = modules[1]
    print('imageSizes:', json.dumps(mod['imageSizes'], indent=2))
