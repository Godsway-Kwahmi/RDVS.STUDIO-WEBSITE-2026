import json
import re

with open('scripts/trumpet_full.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
found_project = False
for idx, s in enumerate(scripts):
    s_clean = s.strip()
    if '"modules"' in s_clean and ('"project"' in s_clean or '15968381' in s_clean):
        try:
            data = json.loads(s_clean)
            proj = data.get('project', {})
            if 'project' in proj:
                proj = proj['project']
            
            print("=== PROJECT INFO ===")
            print("Name:", proj.get('name'))
            print("Description:", proj.get('description'))
            print("Published on:", proj.get('published_on'))
            print("Created on:", proj.get('created_on'))
            print("Modified on:", proj.get('modified_on'))
            print("Fields:", proj.get('fields'))
            print("Tags:", [t.get('title') if isinstance(t, dict) else t for t in proj.get('tags', [])])
            print("Owners/Team:", proj.get('owners'))
            print("Custom fields/credits:", proj.get('custom_fields'))
            
            modules = proj.get('modules', [])
            print(f"\n=== MODULES ({len(modules)}) ===")
            for mi, mod in enumerate(modules):
                mtype = mod.get('type')
                print(f"\n--- Module {mi+1}: Type = {mtype} ---")
                if mtype == 'image':
                    print("  Caption / title:", mod.get('caption'))
                    print("  Original src:", mod.get('src'))
                    sizes = mod.get('sizes', {})
                    print("  Sizes available:", list(sizes.keys()))
                    best = sizes.get('fs') or sizes.get('1400_opt_1') or sizes.get('1400') or sizes.get('disp') or sizes.get('max_1200') or mod.get('src')
                    print("  Best size URL:", best)
                    print("  Dimensions:", mod.get('width'), "x", mod.get('height'))
                elif mtype == 'text':
                    print("  Text:")
                    print(mod.get('text'))
                elif mtype in ['embed', 'video', 'media_collection']:
                    print("  Embed content:", mod.get('embed'))
                    print("  Details:", json.dumps(mod, indent=2))
                else:
                    print("  Other mod keys:", list(mod.keys()))
                    print("  JSON:", json.dumps(mod, indent=2))
            
            # Save raw json for safe keeping
            with open('scripts/trumpet_project_data.json', 'w', encoding='utf-8') as pf:
                json.dump(proj, pf, indent=2)
            print("\nSaved full project data to scripts/trumpet_project_data.json")
            found_project = True
            break
        except Exception as e:
            print(f"Error parsing script {idx}: {e}")

if not found_project:
    print("Could not find project JSON directly, checking window.__INITIAL_STATE__...")
    m_state = re.search(r'window\.__INITIAL_STATE__\s*=\s*(\{.*?\});\s*</script>', html, re.DOTALL)
    if m_state:
        try:
            data = json.loads(m_state.group(1))
            proj = data.get('project', {}).get('project', {})
            with open('scripts/trumpet_project_data.json', 'w', encoding='utf-8') as pf:
                json.dump(proj, pf, indent=2)
            print("Saved from INITIAL_STATE! Project name:", proj.get('name'))
        except Exception as e:
            print("Error parsing initial state:", e)
