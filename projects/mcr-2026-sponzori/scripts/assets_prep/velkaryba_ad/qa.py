import sys
from PIL import Image
# usage: qa.py out.jpg img1 [img2...]  -> each row: dark | light | navy, plus 100% crop on dark of a box
out = sys.argv[1]; files = sys.argv[2:]
T = 420
bgs = [(14, 18, 26), (238, 238, 236), (20, 61, 107)]
rows = []
for f in files:
    im = Image.open(f).convert('RGBA')
    t = im.copy(); t.thumbnail((T - 20, T - 20))
    row = Image.new('RGB', (T * 4, T))
    for i, bg in enumerate(bgs):
        c = Image.new('RGBA', (T, T), bg + (255,)); c.alpha_composite(t, ((T - t.width) // 2, (T - t.height) // 2))
        row.paste(c.convert('RGB'), (i * T, 0))
    # 100% crop around the alpha edge with most detail: take the top-right quadrant edge
    w, h = im.size
    box = (max(0, w // 2 - T // 2), max(0, h // 4 - T // 2), max(0, w // 2 - T // 2) + T, max(0, h // 4 - T // 2) + T)
    c = Image.new('RGBA', (T, T), (14, 18, 26, 255)); c.alpha_composite(im.crop(box))
    row.paste(c.convert('RGB'), (3 * T, 0))
    rows.append(row)
s = Image.new('RGB', (T * 4, T * len(rows)))
for i, r in enumerate(rows): s.paste(r, (0, i * T))
s.save(out, quality=88)
