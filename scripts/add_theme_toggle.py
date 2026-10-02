import os
import glob
import re

site_dir = r's:\Dropbox\Dropbox\RDVS-BRANDING\DESIGN\WEBSITE\RDVS.STUDIO-WEBSITE-2026'
html_files = glob.glob(os.path.join(site_dir, '*.html'))

head_script = '''  <script>
    (function () {
      try {
        var savedTheme = localStorage.getItem('rdvs-theme');
        var theme = savedTheme || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
        document.documentElement.setAttribute('data-theme', theme);
      } catch (e) {}
    })();
  </script>'''

toggle_btn = '''        <!-- Dark / Light Mode Toggle Button -->
        <button class="theme-toggle-btn" id="themeToggle" type="button" aria-label="Switch to light mode" title="Switch to light mode">
          <svg class="theme-icon-dark" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.75" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg class="theme-icon-light" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.75" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>'''

updated_count = 0
already_has_btn = 0
missing_insert = []

for filepath in html_files:
    fname = os.path.basename(filepath)
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as fp:
        content = fp.read()

    changed = False

    # 1. Anti-flash script in <head>
    if 'rdvs-theme' not in content:
        # Insert after <meta name="viewport" ...>
        viewport_match = re.search(r'(<meta\s+name=["\']viewport["\'][^>]*>)', content, re.IGNORECASE)
        if viewport_match:
            vp_tag = viewport_match.group(1)
            content = content.replace(vp_tag, f'{vp_tag}\n{head_script}', 1)
            changed = True
        else:
            # Fallback after <head>
            head_match = re.search(r'(<head[^>]*>)', content, re.IGNORECASE)
            if head_match:
                h_tag = head_match.group(1)
                content = content.replace(h_tag, f'{h_tag}\n{head_script}', 1)
                changed = True

    # 2. Toggle button in header-right
    if 'theme-toggle-btn' not in content and 'id="themeToggle"' not in content:
        # Search form end pattern
        # Look for </form> followed by whitespace and <button ...mobile-toggle
        m = re.search(r'(</form>\s*)(<button[^>]*mobile-toggle[^>]*>)', content)
        if m:
            full_match = m.group(0)
            replacement = f'</form>\n\n{toggle_btn}\n\n        {m.group(2)}'
            content = content.replace(full_match, replacement, 1)
            changed = True
        else:
            # Fallback: right before </div.*header-right
            m2 = re.search(r'(\s*)(</div>\s*</div>\s*</header>)', content)
            if m2:
                content = content[:m2.start()] + f'\n{toggle_btn}\n' + content[m2.start():]
                changed = True
            else:
                missing_insert.append(fname)
    else:
        already_has_btn += 1

    if changed:
        with open(filepath, 'w', encoding='utf-8') as fp:
            fp.write(content)
        updated_count += 1

print(f'Done! Successfully updated {updated_count} files.')
print(f'Already had button: {already_has_btn}')
if missing_insert:
    print(f'Warning: Could not find insert spot in {len(missing_insert)} files: {missing_insert}')
