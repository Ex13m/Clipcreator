#!/usr/bin/env python3
"""Crazy Fish logo for the small FT Fishing brand row (review 22. 10. MINOR 5: soft and mushy at ~80 px).
Source: mcr-2026-sponzori/assets_prep/ftfishing/brands/crazyfish.png (white key ×3 of the shop's 372×284 category image).
Clean-up: drop the paint splatter / drips (small alpha islands), crop to the mark, harden the alpha edge, Lanczos down to
~2.5× the display size and unsharp — the browser then only scales by < 3 (no mush from a 1000 px → 80 px bilinear step)."""
import sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

src = sys.argv[1] if len(sys.argv) > 1 else '/home/user/Clipcreator/projects/mcr-2026-sponzori/assets_prep/ftfishing/brands/crazyfish.png'
out = sys.argv[2] if len(sys.argv) > 2 else '/home/user/Clipcreator/projects/mcr-2026-bannery/assets/ftfishing/crazyfish_clean.png'
im = Image.open(src).convert('RGBA')
a = np.asarray(im).astype(np.float32)
alpha = a[..., 3]
# paint drips / splatter that hang below the mark (source px of the 1084×840 key; checked on a white composite)
for x0, y0, x1, y1 in [(0, 480, 175, 840), (415, 612, 542, 840), (780, 706, 1084, 840), (395, 455, 470, 575)]:
    alpha[y0:y1, x0:x1] = 0
lab, n = ndimage.label(alpha > 40)
sizes = ndimage.sum(np.ones_like(alpha), lab, range(1, n + 1))
keep = np.zeros(n + 1, bool)
big = sizes.max()
keep[1:] = sizes >= big * 0.02          # the fish+letters body and the two small fish; splatter dots / drips go
mask = keep[lab]
mask = ndimage.binary_dilation(mask, iterations=2)
alpha = np.where(mask, alpha, 0)
# thin vertical drips hanging under letters: open the alpha with a horizontal element (drips are ≤ 12 px wide)
body = ndimage.binary_opening(alpha > 40, structure=np.ones((1, 15)))
body = ndimage.binary_dilation(body, iterations=6) & (alpha > 0)
alpha = np.where(body, alpha, 0)
alpha = np.clip((alpha - 30) * 1.25, 0, 255)  # harder edge (the key left a soft halo)
a[..., 3] = alpha
im = Image.fromarray(a.astype(np.uint8), 'RGBA')
bb = im.getbbox()
im = im.crop((max(0, bb[0] - 6), max(0, bb[1] - 6), min(im.width, bb[2] + 6), min(im.height, bb[3] + 6)))
W = 420
im = im.resize((W, round(im.height * W / im.width)), Image.LANCZOS)
rgb = im.convert('RGB').filter(ImageFilter.UnsharpMask(radius=1.6, percent=140, threshold=2))
im = Image.merge('RGBA', (*rgb.split(), im.split()[3]))
im.save(out)
print(out, im.size)
