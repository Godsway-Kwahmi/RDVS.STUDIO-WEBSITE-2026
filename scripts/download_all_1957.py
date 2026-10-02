import os
import json
import urllib.request
import time

dest_dir = r's:\Dropbox\Dropbox\RDVS-BRANDING\DESIGN\WEBSITE\RDVS.STUDIO-WEBSITE-2026\assets\images\1957'
os.makedirs(dest_dir, exist_ok=True)

with open('scripts/1957_download_list.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Referer': 'https://www.behance.net/gallery/78774793/1957-INTERIOR-DESIGN-3D-VISUALIZATION'
}

for item in items:
    idx = item['index']
    url = item['url']
    target_filename = f'1957-{idx}.jpg'
    target_path = os.path.join(dest_dir, target_filename)

    print(f"Downloading [{idx}/{len(items)}] {target_filename} from {url}...")
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
                break
        except Exception as e:
            print(f"  Attempt {attempt+1} failed: {e}")
            time.sleep(2)

    if not success:
        print(f"FAILED to download {target_filename}")

print("All 1957 downloads completed!")
