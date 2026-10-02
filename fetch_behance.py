import urllib.request
import re
import json

url = 'https://www.behance.net/gallery/22488373/IMPERIAL-SQUARE-INTERIOR-DESIGN-3D-VISUALIZATION'
req1 = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    with urllib.request.urlopen(req1) as resp:
        html = resp.read().decode()
except urllib.error.HTTPError as e:
    html = e.read().decode()

match = re.search(r'document\.cookie = \"(js_challenge_value=[^\"]+)', html)
if match:
    cookie = match.group(1).split(';')[0]
    print('Found cookie:', cookie)
    req2 = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Cookie': cookie})
    try:
        with urllib.request.urlopen(req2) as resp2:
            final_html = resp2.read().decode()
            print('Fetched full page, len:', len(final_html))
            
            # Extract images
            state_match = re.search(r'window\.__INITIAL_STATE__ = (\{.*?\});', final_html)
            if state_match:
                state = json.loads(state_match.group(1))
                modules = state.get('project', {}).get('project', {}).get('modules', [])
                img_urls = []
                for m in modules:
                    if 'src' in m:
                        img_urls.append(m['src'])
                    elif 'sizes' in m:
                        sizes = m['sizes']
                        for size in ['max_1920', '1400', '1200', 'original']:
                            if size in sizes:
                                img_urls.append(sizes[size])
                                break
                
                print("Found images:", len(img_urls))
                import os
                os.makedirs('assets/images/imperial-square', exist_ok=True)
                for i, img_url in enumerate(img_urls):
                    print(f"Downloading {img_url}...")
                    img_req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
                    with urllib.request.urlopen(img_req) as img_resp:
                        with open(f'assets/images/imperial-square/imperial-square-{i+1}.jpg', 'wb') as f:
                            f.write(img_resp.read())
                print("All downloaded!")
            else:
                print("Could not find __INITIAL_STATE__")
                
    except urllib.error.HTTPError as e2:
        print('Error on second request:', e2.code)
else:
    print('No cookie challenge found')
