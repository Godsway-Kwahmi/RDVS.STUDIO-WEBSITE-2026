project_files = [
    'afg.html', 'hamlet.html', 'dyv.html', 'hubtel.html', 'barham.html',
    'frontier.html', 'labeach.html', 'mtn.html', 'onehive.html', 'purc.html'
]

for f in project_files:
    with open(f, 'r', encoding='utf-8') as fp:
        c = fp.read()
    if 'lightbox.js' not in c:
        c = c.replace('</body>', '  <script src="js/lightbox.js"></script>\n</body>')
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(c)
        print(f"Added lightbox.js to {f}")
    else:
        print(f"{f} already has lightbox.js")
