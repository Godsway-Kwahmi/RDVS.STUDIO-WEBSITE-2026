import os, re

files = [f for f in os.listdir('.') if f.endswith('.html') and f not in ['index.html', 'work.html', 'about.html', 'contact.html', 'news.html', 'expertise.html', 'archive.html', 'portfolios.html', 'swipe.html']]

terms = ['3d visualization', '3d animation', 'architectural visualization', 'arch viz']
matched_files = []

for f in files:
    with open(f, 'r', encoding='utf-8') as pf:
        html = pf.read().lower()
    found = [t for t in terms if t in html]
    if found:
        matched_files.append((f, found))

print(f"Total project pages with 3d viz/animation/arch viz terms: {len(matched_files)} / {len(files)}")
for f, found in matched_files:
    print(f"{f}: {found}")
