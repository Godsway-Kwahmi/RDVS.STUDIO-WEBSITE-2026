import os
import json
import urllib.request
import time

dest_dir = r'assets\images\trumpet-africa-ident'
os.makedirs(dest_dir, exist_ok=True)

with open('scripts/trumpet_download_list.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Referer': 'https://www.behance.net/gallery/15968381/TRUMPET-AFRICA-PRODUCTIONS-IDENT-MOTION-DESIGN'
}

downloaded_records = []

for item in items:
    idx = item['index']
    url = item['url']
    ext = 'jpg' if '.jpg' in url.lower() else 'png'
    
    # Meaningful filenames
    if idx == 1:
        target_filename = f'trumpet-africa-palette.{ext}'
        section = 'palette'
    elif 2 <= idx <= 13:
        frame_num = idx - 1
        target_filename = f'trumpet-africa-sunset-{frame_num:02d}.{ext}'
        section = 'sunset'
    else:
        frame_num = idx - 13
        target_filename = f'trumpet-africa-moonlit-{frame_num:02d}.{ext}'
        section = 'moonlit'
        
    target_path = os.path.join(dest_dir, target_filename)
    
    print(f"Downloading [{idx}/{len(items)}] {target_filename} ({item['width']}px) from {url}...")
    success = False
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = bytearray()
                while True:
                    chunk = resp.read(65536)
                    if not chunk:
                        break
                    data.extend(chunk)
                with open(target_path, 'wb') as out_f:
                    out_f.write(data)
                print(f"  Saved {target_filename} ({len(data)} bytes)")
                success = True
                downloaded_records.append({
                    'index': idx,
                    'module_index': item['module_index'],
                    'filename': target_filename,
                    'path': f'assets/images/trumpet-africa-ident/{target_filename}',
                    'section': section,
                    'bytes': len(data),
                    'width': item['width'],
                    'caption': item['caption']
                })
                break
        except Exception as e:
            print(f"  Attempt {attempt+1} failed: {e}")
            time.sleep(1)
            
    if not success:
        print(f"FAILED to download {target_filename}")

with open('scripts/trumpet_downloaded_images.json', 'w', encoding='utf-8') as mf:
    json.dump(downloaded_records, mf, indent=2)

print(f"\nAll downloads completed! Total: {len(downloaded_records)}/{len(items)}")
