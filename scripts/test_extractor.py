import re, os

files = [f for f in os.listdir('.') if f.endswith('.html') and f not in ['index.html', 'work.html', 'about.html', 'contact.html', 'news.html', 'expertise.html', 'archive.html', 'portfolios.html', 'swipe.html']]

count = 0
success = 0
for f in files:
    with open(f, 'r', encoding='utf-8') as pf:
        html = pf.read()
    m = re.search(r'<h1[^>]*class=["\'][^"\']*project-page-title[^"\']*["\'][^>]*>([\s\S]*?)</h1>', html, re.IGNORECASE) or \
        re.search(r'<header[^>]*class=["\'][^"\']*project-hero-header[^"\']*["\'][^>]*>[\s\S]*?<h1[^>]*>([\s\S]*?)</h1>', html, re.IGNORECASE) or \
        re.search(r'<main[^>]*class=["\'][^"\']*project-detail-container[^"\']*["\'][^>]*>[\s\S]*?<h1[^>]*>([\s\S]*?)</h1>', html, re.IGNORECASE) or \
        re.search(r'<h1[^>]*>([\s\S]*?)</h1>', html, re.IGNORECASE)
    count += 1
    if m and m.group(1).strip():
        success += 1
    else:
        print(f"Failed to extract title from {f}")

print(f"Successfully extracted {success}/{count} project titles!")
