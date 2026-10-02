import os
import json
import urllib.request
import time
from PIL import Image

site_dir = os.path.abspath('.')
target_dir = os.path.join(site_dir, 'assets', 'images', 'naadei-villas')
os.makedirs(target_dir, exist_ok=True)

with open(os.path.join(site_dir, 'scripts', 'naadei_download_list.json'), 'r', encoding='utf-8') as f:
    images = json.load(f)

print(f"Total images to download: {len(images)}")

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
            print(f"  Attempt {attempt+1} failed: {e}. Retrying...")
            time.sleep(1)
    return False

downloaded = []

for item in images:
    idx = item['index']
    filename = f"naadei-villas-{idx}.jpg"
    filepath = os.path.join(target_dir, filename)
    url = item['url']
    
    print(f"Downloading [{idx}/{len(images)}] {filename}...")
    success = download_file_with_retry(url, filepath)
    if not success:
        print(f"Failed to download {filename} from {url}")
        continue
        
    size_mb = os.path.getsize(filepath) / (1024 * 1024)
    with Image.open(filepath) as im:
        w, h = im.size
        print(f"  -> Saved {filename} ({w}x{h}, {size_mb:.2f} MB)")
        
    downloaded.append({
        'index': idx,
        'filename': filename,
        'path': f"assets/images/naadei-villas/{filename}",
        'width': w,
        'height': h,
        'url': url
    })

# Generate desktop and mobile versions for naadei-villas-1 (and naadei-villas-3 if useful)
villas_1_path = os.path.join(target_dir, 'naadei-villas-1.jpg')
if os.path.exists(villas_1_path):
    with Image.open(villas_1_path) as im:
        w, h = im.size
        im.save(os.path.join(target_dir, 'naadei-villas-1-desktop.jpg'), quality=90, optimize=True)
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
        im_crop.save(os.path.join(target_dir, 'naadei-villas-1-mobile.jpg'), quality=90, optimize=True)
        print("Generated naadei-villas-1-desktop.jpg and naadei-villas-1-mobile.jpg")

with open(os.path.join(site_dir, 'scripts', 'naadei_images_metadata.json'), 'w', encoding='utf-8') as f_meta:
    json.dump(downloaded, f_meta, indent=2)

print(f"Successfully downloaded {len(downloaded)} / {len(images)} images!")
