import re

with open('work.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Match each card block
card_blocks = re.findall(r'(<a href="([^"]+)" class="grid-card"[\s\S]*?</a>)', html)
print(f"Total cards found in work.html: {len(card_blocks)}")

terms = ['3d visualization', '3d animation', 'architectural visualization', 'arch viz']
vfx_cards = []
term_cards = []

for block, url in card_blocks:
    cat_m = re.search(r'data-category="([^"]*)"', block)
    disc_m = re.search(r'data-discipline="([^"]*)"', block)
    title_m = re.search(r'data-title="([^"]*)"', block)
    
    cat = cat_m.group(1) if cat_m else ''
    disc = disc_m.group(1) if disc_m else ''
    title = title_m.group(1) if title_m else ''
    
    block_lower = block.lower()
    
    has_vfx = 'vfx-cgi' in cat or 'visual effects' in disc.lower()
    if has_vfx:
        vfx_cards.append((url, title, cat, disc))
        
    found_terms = [t for t in terms if t in block_lower]
    if found_terms:
        term_cards.append((url, title, cat, disc, found_terms, has_vfx))

print(f"Cards with vfx-cgi: {len(vfx_cards)}")
print(f"Cards containing 3d viz/animation terms: {len(term_cards)}")
without_vfx = [t for t in term_cards if not t[5]]
print(f"Cards with terms BUT WITHOUT vfx-cgi in category: {len(without_vfx)}\n")

for url, title, cat, disc, found_terms, has_vfx in without_vfx[:20]:
    print(f"[{url}] \"{title}\"")
    print(f"  terms: {found_terms}")
    print(f"  category: \"{cat}\"")
    print(f"  discipline: \"{disc}\"\n")
