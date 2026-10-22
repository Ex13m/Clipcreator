"""FT Fishing logo (MČR 2026). Source: https://www.ftfishing.cz/css/local/logo.png (500×500 RGBA, flat 2 colours),
fetched 22. 10. 2026 via bridge (weserv output=png l=0) -> assets/ftfishing/src/logo_site.png.
Vectorised (vtracer per colour layer, lib.vectorize_flat) -> logo.svg -> rendered 2000 px.
Outputs assets_prep/ftfishing/:
  logo.svg                      vector, original colours (green #6DB52C, grey #878786)
  logo_on_light.png             2000 px, original colours, transparent
  logo_on_dark.png              grey lifted to #C9CAC8 (fish/ring/slogan), green unchanged
  logo_nosl_on_light/_on_dark   same without the 'VŠE PRO PŘÍVLAČ' slogan line (for small sizes)
Run: <scratch venv>/python -I scripts/assets_prep/ftfishing/prep_logo.py
"""
import os, sys
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from lib import vectorize_flat, render_svg, PROJ

SRC = f'{PROJ}/assets/ftfishing/src/logo_site.png'
OUT = f'{PROJ}/assets_prep/ftfishing'
GREEN, GREY, GREY_DARK = '#6DB52C', '#878786', '#C9CAC8'

im = Image.open(SRC).convert('RGBA')
svg = vectorize_flat(im, [('grey', GREY), ('green', GREEN)], ['grey', 'green'], scale=6)
open(f'{OUT}/logo.svg', 'w').write(svg)
open(f'{OUT}/_logo_dark.svg', 'w').write(svg.replace(GREY, GREY_DARK))
L = render_svg(f'{OUT}/logo.svg', f'{OUT}/logo_on_light.png', 2000)
D = render_svg(f'{OUT}/_logo_dark.svg', f'{OUT}/logo_on_dark.png', 2000)
os.remove(f'{OUT}/_logo_dark.svg')

def trim(img):
    bb = img.getbbox(); return img.crop(bb)

def noslogan(img):
    a = np.array(img)[..., 3] > 8
    rows = np.where(a.any(1))[0]
    # slogan = last block of rows after the largest empty gap in the lower 25 %
    occ = a.any(1); h = len(occ); start = int(h * 0.75)
    gaps = []; g0 = None
    for y in range(start, h):
        if not occ[y] and g0 is None: g0 = y
        if occ[y] and g0 is not None: gaps.append((y - g0, g0, y)); g0 = None
    gl, g0, g1 = max(gaps)
    return trim(img.crop((0, 0, img.width, g0)))

for name, img in (('on_light', L), ('on_dark', D)):
    t = trim(img); t.save(f'{OUT}/logo_{name}.png')
    noslogan(img).save(f'{OUT}/logo_nosl_{name}.png')
    print(name, t.size, noslogan(img).size)
