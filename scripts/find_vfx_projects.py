import json, re

with open('work.html', 'r', encoding='utf-8') as f:
    html = f.read()

card_regex = r'<a href="([^"]*)" class="grid-card"[^>]*data-title="([^"]*)"[^>]*data-year="([^"]*)"[^>]*data-typology="([^"]*)"[^>]*data-discipline="([^"]*)"[^>]*data-category="([^"]*)"'

cards = re.findall(card_regex, html)
print(f"Total cards in work.html: {len(cards)}")

vfx_subservice_keywords = ['3d', 'visualization', 'visualisation', 'render', 'animation', 'viz', 'cgi', 'vfx']

matching_projects = []
for href, title, year, typology, discipline, category in cards:
    all_text = f"{title} {typology} {discipline} {category}".lower()
    found = [kw for kw in vfx_subservice_keywords if kw in all_text]
    if found:
        matching_projects.append({
            'href': href,
            'title': title,
            'year': year,
            'typology': typology,
            'discipline': discipline,
            'category': category,
            'found': found
        })

print(f"Total projects with subservice keywords: {len(matching_projects)}")
for p in matching_projects:
    print(f"  [{p['href']}] {p['title']} ({p['year']}) | Disp: {p['discipline']} | Cat: {p['category']}")
