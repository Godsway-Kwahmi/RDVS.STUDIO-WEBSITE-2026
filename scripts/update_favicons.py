import os
import glob
import re

site_dir = r's:\Dropbox\Dropbox\RDVS-BRANDING\DESIGN\WEBSITE\RDVS.STUDIO-WEBSITE-2026'
html_files = glob.glob(os.path.join(site_dir, '*.html'))

favicon_block = '''  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">'''

updated_count = 0
already_had_count = 0

for filepath in html_files:
    filename = os.path.basename(filepath)
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as fp:
        content = fp.read()

    # Check if favicon already present
    if 'rel="icon"' in content or 'rel="apple-touch-icon"' in content:
        # If it has favicon tags already, let's see what it has
        # Replace existing favicon tags if needed, or if already our block, skip
        if 'href="favicon.ico"' in content and 'href="favicon-32x32.png"' in content:
            already_had_count += 1
            continue

    # Insert before <link rel="stylesheet" href="css/styles.css">
    target = '<link rel="stylesheet" href="css/styles.css">'
    if target in content:
        new_content = content.replace(target, f'{favicon_block}\n  {target}', 1)
        with open(filepath, 'w', encoding='utf-8') as fp:
            fp.write(new_content)
        updated_count += 1
    else:
        # Fallback before </head>
        target_head = '</head>'
        if target_head in content:
            new_content = content.replace(target_head, f'{favicon_block}\n{target_head}', 1)
            with open(filepath, 'w', encoding='utf-8') as fp:
                fp.write(new_content)
            updated_count += 1
        else:
            print(f'Warning: Could not insert favicon into {filename}')

print(f'Done! Updated {updated_count} files. {already_had_count} files already had the exact favicon links.')
