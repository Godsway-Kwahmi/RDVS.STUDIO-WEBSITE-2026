import json

with open('scripts/trumpet_project_data.json', 'r', encoding='utf-8') as f:
    proj = json.load(f)

modules = proj.get('modules', [])
img_downloads = []

for idx, m in enumerate(modules):
    if m.get('__typename') == 'ImageModule':
        img_sizes = m.get('imageSizes') or {}
        all_avail = img_sizes.get('allAvailable') or []
        
        # We want the highest resolution JPG/PNG (source or fs or 1400)
        best_url = None
        best_width = 0
        for item in all_avail:
            w = item.get('width', 0)
            u = item.get('url', '')
            t = item.get('type', '')
            # Prefer 1920px fs or source
            if w >= best_width and '_webp' not in u:
                best_width = w
                best_url = u
                
        if not best_url:
            best_url = m.get('src')
            best_width = m.get('width', 600)
            
        caption = m.get('captionPlain') or m.get('caption') or ''
        img_downloads.append({
            'index': len(img_downloads) + 1,
            'module_index': idx + 1,
            'id': m.get('id'),
            'url': best_url,
            'width': best_width,
            'caption': caption
        })

print(f"Total images found: {len(img_downloads)}")
for item in img_downloads:
    print(f"[{item['index']}] Mod {item['module_index']} ({item['width']}px): {item['url']}")

with open('scripts/trumpet_download_list.json', 'w', encoding='utf-8') as f:
    json.dump(img_downloads, f, indent=2)
print("Saved scripts/trumpet_download_list.json")
