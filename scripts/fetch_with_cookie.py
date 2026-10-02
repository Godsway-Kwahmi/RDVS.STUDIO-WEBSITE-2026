import urllib.request
import re
import json

cookie_str = "js_challenge_value=14ab22f58e3765a20b3830405cb614643db9b819472d4b8c3c4fa5b5ea24deecc3d73c879999f2fa765c2294c811c827c7558bbac35180b96205f3be7f0d6747"

url = 'https://www.behance.net/gallery/51794147/PETRUS-3D-VISUALIZATION'
req = urllib.request.Request(
    url,
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Cookie': cookie_str,
        'Referer': 'https://www.behance.net/gallery/51794147/PETRUS-3D-VISUALIZATION'
    }
)

try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print(f'Fetched HTML length: {len(html)}')
        with open('scripts/petrus_full.html', 'w', encoding='utf-8') as f:
            f.write(html)
        if len(html) > 1000:
            print('Success!')
        else:
            print('Short response:', html[:300])
except Exception as e:
    print('Error:', e)
