"""QA view: one cut-out on dark / light / brand orange, optional 100 % crop. usage: qa.py <png> <out.jpg> [x0 y0 x1 y1]"""
import sys
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGBA')
out = sys.argv[2]
if len(sys.argv) > 3:
    x0, y0, x1, y1 = map(int, sys.argv[3:7]); im = im.crop((x0, y0, x1, y1))
else:
    im.thumbnail((900, 900))
bgs = [(12, 12, 14), (240, 240, 238), (226, 129, 45)]
c = Image.new('RGB', (im.width * 3 + 40, im.height + 20), 'gray')
for i, b in enumerate(bgs):
    t = Image.new('RGBA', im.size, b + (255,)); t.alpha_composite(im)
    c.paste(t.convert('RGB'), (10 + i * (im.width + 10), 10))
c.save(out, quality=90)
