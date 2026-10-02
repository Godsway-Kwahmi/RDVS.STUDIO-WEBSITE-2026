import json

with open('scripts/trumpet_project_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('Title:', data.get('name'))
print('Description:', data.get('description'))
print('Created:', data.get('created_on'))
print('Published:', data.get('published_on'))
print('Fields:', data.get('fields'))
print('Tags:', [t.get('title') if isinstance(t, dict) else t for t in data.get('tags', [])])

modules = data.get('modules', [])
print(f'Total modules: {len(modules)}')
for i, m in enumerate(modules):
    typename = m.get('__typename')
    if typename == 'ImageModule':
        caption = m.get('captionPlain') or m.get('caption')
        sizes = m.get('sizes', {})
        best = sizes.get('fs') or sizes.get('1400_opt_1') or sizes.get('1400') or m.get('src')
        w = m.get('width')
        h = m.get('height')
        print(f"[{i+1}] IMAGE ({w}x{h}): {best} | caption={caption}")
    elif typename == 'TextModule':
        text = m.get('text')
        print(f"[{i+1}] TEXT: {text}")
    elif typename == 'VideoModule':
        embed = m.get('embed')
        print(f"[{i+1}] VIDEO: {embed}")
    else:
        print(f"[{i+1}] {typename}: {m.keys()}")
