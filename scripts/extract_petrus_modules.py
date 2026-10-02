import re
import json
import urllib.request
import os

with open('scripts/petrus_full.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

m = re.search(r'"modules":(\[.*?\]),\s*"', html)
if m:
    modules = json.loads(m.group(1))
    print(f'Total modules: {len(modules)}')
    
    petrus_dir = r's:\Dropbox\Dropbox\RDVS-BRANDING\DESIGN\WEBSITE\RDVS.STUDIO-WEBSITE-2026\assets\images\petrus'
    os.makedirs(petrus_dir, exist_ok=True)
    
    img_list = []
    
    for idx, mod in enumerate(modules):
        if 'imageSizes' in mod:
            img_sizes = mod['imageSizes']
            # Find the best quality URL
            # Priorities: 'fs', 'max_3840', '2800', '1400', '1400_opt_1', 'disp'
            # Let's inspect available sizes
            chosen_url = None
            for key in ['fs', 'max_3840', '2800', '1400', '1400_opt_1', 'disp']:
                if key in img_sizes:
                    chosen_url = img_sizes[key]
                    break
            if not chosen_url:
                chosen_url = mod.get('src')
            
            img_list.append({
                'index': len(img_list) + 1,
                'url': chosen_url,
                'available': list(img_sizes.keys())
            })

    print(f'Found {len(img_list)} images to download.')
    for item in img_list:
        print(f"[{item['index']}] {item['url']} (from {item['available']})")

    with open('scripts/petrus_download_list.json', 'w', encoding='utf-8') as f_out:
        json.dump(img_list, f_out, indent=2)
