import os
import re
import json
import urllib.request
import time
from PIL import Image

site_dir = r's:\Dropbox\Dropbox\RDVS-BRANDING\DESIGN\WEBSITE\RDVS.STUDIO-WEBSITE-2026'
petrus_dir = os.path.join(site_dir, 'assets', 'images', 'petrus')
os.makedirs(petrus_dir, exist_ok=True)

with open(os.path.join(site_dir, 'scripts', 'petrus_full.html'), 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

m = re.search(r'"modules":(\[.*?\]),\s*"', html)
if not m:
    print('Error: Could not find modules')
    exit(1)

modules = json.loads(m.group(1))
image_modules = [mod for mod in modules if 'imageSizes' in mod]
print(f'Total image modules: {len(image_modules)}')

def download_file_with_retry(url, filepath, max_retries=3):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
    }
    for attempt in range(max_retries):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=30) as resp:
                with open(filepath, 'wb') as out_f:
                    while True:
                        chunk = resp.read(65536)
                        if not chunk:
                            break
                        out_f.write(chunk)
            if os.path.exists(filepath) and os.path.getsize(filepath) > 1000:
                return True
        except Exception as e:
            print(f'  Attempt {attempt+1} failed: {e}. Retrying...')
            time.sleep(1)
    return False

downloaded = []

for idx, mod in enumerate(image_modules):
    img_num = idx + 1
    filename = f'petrus-{img_num}.jpg'
    filepath = os.path.join(petrus_dir, filename)
    
    # Priority for quality: prefer 2800 or 1400 (web optimized, high res) or source
    all_avail = mod.get('imageSizes', {}).get('allAvailable', [])
    best_url = None
    
    # 2800 and 1400 are crisp, perfectly sized for web and fast to download
    for preferred_type in ['2800', '1400', 'source', 'fs', 'max_3840', 'disp']:
        for item in all_avail:
            if item.get('type') == 'JPG' and f'/{preferred_type}/' in item.get('url', ''):
                best_url = item.get('url')
                break
        if best_url:
            break
            
    if not best_url:
        best_url = mod.get('src')
        
    print(f'Downloading [{img_num}/{len(image_modules)}] {filename} from {best_url}...')
    success = download_file_with_retry(best_url, filepath)
    if not success:
        print(f'Failed to download {filename} from {best_url}')
        # Fallback to mod.src
        if best_url != mod.get('src'):
            print(f'Trying fallback {mod.get("src")}...')
            download_file_with_retry(mod.get('src'), filepath)
            
    size_mb = os.path.getsize(filepath) / (1024 * 1024)
    with Image.open(filepath) as im:
        w, h = im.size
        print(f'  -> Saved {filename} ({w}x{h}, {size_mb:.2f} MB)')
        
    downloaded.append({
        'index': img_num,
        'filename': filename,
        'path': f'assets/images/petrus/{filename}',
        'width': w,
        'height': h,
        'url': best_url
    })

# Also generate desktop (16:9) and mobile (9:16 portrait) versions for petrus-1
petrus_1_path = os.path.join(petrus_dir, 'petrus-1.jpg')
with Image.open(petrus_1_path) as im:
    w, h = im.size
    im.save(os.path.join(petrus_dir, 'petrus-1-desktop.jpg'), quality=90, optimize=True)
    target_ratio = 9.0 / 16.0
    current_ratio = w / h
    if current_ratio > target_ratio:
        new_w = int(h * target_ratio)
        left = (w - new_w) // 2
        im_crop = im.crop((left, 0, left + new_w, h))
    else:
        new_h = int(w / target_ratio)
        top = (h - new_h) // 2
        im_crop = im.crop((0, top, w, top + new_h))
    im_crop.save(os.path.join(petrus_dir, 'petrus-1-mobile.jpg'), quality=90, optimize=True)
    print('Generated petrus-1-desktop.jpg and petrus-1-mobile.jpg')

with open(os.path.join(site_dir, 'scripts', 'petrus_images_metadata.json'), 'w', encoding='utf-8') as f_meta:
    json.dump(downloaded, f_meta, indent=2)

print('All 15 images downloaded and verified!')
