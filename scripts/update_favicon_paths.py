import os
import glob
import re
import time

site_dir = r's:\Dropbox\Dropbox\RDVS-BRANDING\DESIGN\WEBSITE\RDVS.STUDIO-WEBSITE-2026'
html_files = glob.glob(os.path.join(site_dir, '*.html'))

new_favicon_block = '''  <link rel="icon" type="image/x-icon" href="assets/favicon/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="assets/favicon/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="assets/favicon/apple-touch-icon.png">'''

updated_count = 0
skipped = []

for file_path in html_files:
    fname = os.path.basename(file_path)
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        favicon_group_regex = re.compile(
            r'[ \t]*<link\s+rel="icon"\s+type="image/x-icon"\s+href="[^"]*favicon\.ico">\s*'
            r'[ \t]*<link\s+rel="icon"\s+type="image/png"\s+sizes="32x32"\s+href="[^"]*favicon-32x32\.png">\s*'
            r'[ \t]*<link\s+rel="icon"\s+type="image/png"\s+sizes="16x16"\s+href="[^"]*favicon-16x16\.png">\s*'
            r'[ \t]*<link\s+rel="apple-touch-icon"\s+sizes="180x180"\s+href="[^"]*apple-touch-icon\.png">',
            re.MULTILINE
        )

        new_content = content
        if favicon_group_regex.search(content):
            new_content = favicon_group_regex.sub(new_favicon_block, content)
        else:
            replacements = [
                ('href="favicon.ico"', 'href="assets/favicon/favicon.ico"'),
                ('href="favicon-32x32.png"', 'href="assets/favicon/favicon-32x32.png"'),
                ('href="favicon-16x16.png"', 'href="assets/favicon/favicon-16x16.png"'),
                ('href="apple-touch-icon.png"', 'href="assets/favicon/apple-touch-icon.png"')
            ]
            for old_s, new_s in replacements:
                if old_s in new_content:
                    new_content = new_content.replace(old_s, new_s)

        if new_content != content:
            written = False
            for attempt in range(5):
                try:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    written = True
                    updated_count += 1
                    break
                except OSError as e:
                    time.sleep(0.5)
            if not written:
                print(f"Failed to write {fname} after 5 attempts")
                skipped.append(fname)
    except Exception as e:
        print(f"Error processing {fname}: {e}")
        skipped.append(fname)

print(f"Finished! Successfully updated {updated_count} files. Skipped: {skipped}")
