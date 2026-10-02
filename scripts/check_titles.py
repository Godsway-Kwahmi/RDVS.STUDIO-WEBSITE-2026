import re
import os

with open('js/main.js', 'r', encoding='utf-8') as f:
    main_js = f.read()

# Find project blocks in main.js
blocks = re.split(r'\{\s*id:\s*[\'"][^\'"]+[\'"]', main_js)

mismatches = []
matches = []

for block in blocks[1:]:
    title_m = re.search(r'title:\s*[\'"]([^\'"]+)[\'"]', block)
    url_m = re.search(r'projectUrl:\s*[\'"]([^\'"]+)[\'"]', block)
    if not title_m or not url_m:
        continue
    title = title_m.group(1)
    url = url_m.group(1)
    if url == 'work.html':
        continue
    if not os.path.exists(url):
        print(f"File not found: {url}")
        continue
    
    with open(url, 'r', encoding='utf-8') as pf:
        phtml = pf.read()
    h1_m = re.search(r'<h1[^>]*class=[\'"][^\'"]*project-page-title[^\'"]*[\'"][^>]*>(.*?)</h1>', phtml, re.DOTALL)
    if not h1_m:
        h1_m = re.search(r'<h1[^>]*>(.*?)</h1>', phtml, re.DOTALL)
    page_title = re.sub(r'<[^>]+>', '', h1_m.group(1)).strip() if h1_m else 'NO H1'
    # Unescape HTML entities like &amp; &mdash;
    page_title = page_title.replace('&amp;', '&').replace('&mdash;', '—').replace('&ndash;', '–')
    
    if title != page_title:
        mismatches.append((url, title, page_title))
    else:
        matches.append((url, title))

print(f"Total checked: {len(matches) + len(mismatches)}")
print(f"Matching: {len(matches)}")
print(f"Mismatches: {len(mismatches)}\n")
for url, t_main, t_page in mismatches:
    print(f"[{url}]")
    print(f"  main.js:       \"{t_main}\"")
    print(f"  project page:  \"{t_page}\"")
