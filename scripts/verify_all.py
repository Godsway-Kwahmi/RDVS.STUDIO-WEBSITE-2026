with open('work.html', 'r', encoding='utf-8') as f:
    w = f.read()

assert w.count('data-title="Naadei Villas"') == 1, "Expected exactly 1 Naadei Villas card in work.html"
assert 'Naadei Luxury' not in w, "Expected no Naadei Luxury in work.html"

with open('archive.html', 'r', encoding='utf-8') as f:
    a = f.read()

assert a.count('data-title="naadei villas"') == 1, "Expected exactly 1 naadei villas row in archive.html"
assert 'naadei luxury' not in a, "Expected no naadei luxury in archive.html"

with open('naadei-villas.html', 'r', encoding='utf-8') as f:
    n = f.read()

assert '2018' in n, "Expected 2018 in naadei-villas.html"
assert 'Private Client' in n, "Expected Private Client in naadei-villas.html"
assert 'Jude Abbey, Jude Nyoagbe, Nana Beniako' in n, "Expected team members in naadei-villas.html"
img_count = n.count('assets/images/naadei-villas/naadei-villas-')
assert img_count == 24, f"Expected 24 references (1 hero + 23 gallery items), found {img_count}"

print("All assertions passed perfectly!")
