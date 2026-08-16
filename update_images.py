import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

parts = content.split('<div class="gallery-track" id="gallery-track">')
header = parts[0]
gallery = parts[1]

img_pattern = re.compile(r'<img src="(img/[^"]+)"')
matches = img_pattern.findall(gallery)

new_gallery = gallery
wa_index = 1
for i, match in enumerate(matches):
    if i % 2 == 0 and wa_index <= 12:
        new_gallery = new_gallery.replace(f'src="{match}"', f'src="img/wa{wa_index}.jpeg"', 1)
        wa_index += 1

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(header + '<div class="gallery-track" id="gallery-track">' + new_gallery)
