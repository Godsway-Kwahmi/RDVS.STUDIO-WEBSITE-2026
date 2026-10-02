from PIL import Image
import os
import re

with open('work.html', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

imgs = re.findall(r'<img[^>]+src="([^"]+)"', c)
print(f"Total thumbnail images in work.html: {len(imgs)}")

for src in imgs[:20]:
    if os.path.exists(src):
        try:
            with Image.open(src) as im:
                w, h = im.size
                r = round(w / h, 2)
                print(f"{src} -> {w}x{h} (ratio: {r})")
        except Exception as e:
            print(f"{src} -> Error: {e}")
    else:
        print(f"{src} -> NOT FOUND")
