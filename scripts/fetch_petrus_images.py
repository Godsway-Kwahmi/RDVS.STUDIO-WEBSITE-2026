import urllib.request
import re
import json

url = 'https://www.behance.net/gallery/51794147/PETRUS-3D-VISUALIZATION'
req = urllib.request.Request(
    url,
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
    }
)

try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print(f'HTML fetched successfully ({len(html)} bytes)')
        with open('scripts/petrus_behance.html', 'w', encoding='utf-8') as f:
            f.write(html)
        
        # Look for behance image urls
        # Behance embeds project data inside window.__INITIAL_STATE__ or json
        # Let's search for mir-s3-cdn-cf.behance.net
        urls = re.findall(r'https://mir-s3-cdn-cf\.behance\.net/project_modules/[^\s"\'<>]+', html)
        print(f'Found {len(urls)} project_modules raw urls')
        
        # Filter for full/disp/1400/fs
        high_res = {}
        for u in urls:
            # e.g. .../project_modules/1400/xyz.jpg or .../project_modules/fs/xyz.jpg or .../project_modules/disp/xyz.jpg
            parts = u.split('/')
            filename = parts[-1]
            module_type = parts[-2]
            if filename not in high_res:
                high_res[filename] = {}
            high_res[filename][module_type] = u
        
        print(f'Unique image files: {len(high_res)}')
        for fn, types in high_res.items():
            print(fn, list(types.keys()))
            # pick best quality: fs > 1400_opt_1 > 1400 > max_1200 > disp
            best = types.get('fs') or types.get('1400_opt_1') or types.get('1400') or types.get('max_1200') or types.get('disp') or list(types.values())[0]
            print('  -> Best:', best)

except Exception as e:
    print('Error fetching:', e)
