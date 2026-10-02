import re
import os

with open('js/main.js', 'r', encoding='utf-8') as f:
    main_js = f.read()

# Pattern to find each project entry in servicePools
# We can find each projectUrl and its preceding title
pattern = r'(title:\s*[\'"][^\'"]+[\'"].*?projectUrl:\s*[\'"]([^\'"]+)[\'"])'

def get_page_title(url):
    if url == 'work.html' or not os.path.exists(url):
        return None
    with open(url, 'r', encoding='utf-8') as pf:
        phtml = pf.read()
    h1_m = re.search(r'<h1[^>]*class=[\'"][^\'"]*project-page-title[^\'"]*[\'"][^>]*>(.*?)</h1>', phtml, re.DOTALL)
    if not h1_m:
        h1_m = re.search(r'<h1[^>]*>(.*?)</h1>', phtml, re.DOTALL)
    if not h1_m:
        return None
    page_title = re.sub(r'<[^>]+>', '', h1_m.group(1)).strip()
    page_title = page_title.replace('&amp;', '&').replace('&mdash;', '—').replace('&ndash;', '–')
    return page_title

updated_count = 0

# Replace title for each projectUrl
def replacer(match):
    global updated_count
    full_str = match.group(1)
    url = match.group(2)
    page_title = get_page_title(url)
    if page_title:
        # Replace the title inside this snippet
        old_title_m = re.search(r'title:\s*[\'"]([^\'"]+)[\'"]', full_str)
        if old_title_m and old_title_m.group(1) != page_title:
            updated_count += 1
            print(f"Updating [{url}]: \"{old_title_m.group(1)}\" -> \"{page_title}\"")
            new_title_part = f"title: '{page_title}'"
            full_str = full_str[:old_title_m.start()] + new_title_part + full_str[old_title_m.end():]
    return full_str

new_main_js = re.sub(r'(title:\s*[\'"][^\'"]+[\'"][\s\S]*?projectUrl:\s*[\'"]([^\'"]+)[\'"])', replacer, main_js)

print(f"\nTotal titles updated in main.js: {updated_count}")

with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(new_main_js)

print("js/main.js written successfully.")
