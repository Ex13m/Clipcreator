#!/usr/bin/env python3
"""Patch the 2k upscale of scene_net_a (b-roll 'PSTRUH.' shot).

The 2k upscaler drew 'ladders' (3-6 parallel contours) and beaded edges in the out-of-focus areas: the tail in the top-left
corner (x 0-950, y 0-860 of 2160x3856) and the edges of the left fins + the net bokeh next to them. Those areas are defocused
anyway, so they are replaced by a plain Lanczos upscale of the 752x1344 original, blended through a soft feathered mask.
Head, eye, mouth and the lure stay from the 2k file.

usage: python3 scripts/assets_prep/fish_ai/patch_net_a_2k.py   (from projects/mcr-2026-sponzori)
out:   assets_prep/fish_ai/scenes/scene_net_a_2k_fix.png (+ _mask.png for QA)
"""
import os
from PIL import Image, ImageDraw, ImageFilter

D = 'assets_prep/fish_ai/scenes'
hi = Image.open(os.path.join(D, 'scene_net_a_2k.png')).convert('RGB')
W, H = hi.size                                              # 2160 x 3856
lo = Image.open(os.path.join(D, 'scene_net_a.png')).convert('RGB').resize((W, H), Image.LANCZOS)

m = Image.new('L', (W, H), 0)
d = ImageDraw.Draw(m)
# 1) tail + net bokeh, top-left (the brief's box, grown a little so the feather starts outside the artefacts)
d.rectangle((0, 0, 990, 900), fill=255)
# 2) left fins (upper pelvic/anal fin y ~720-1100, lower fin y ~1320-1620) and the net bokeh left of the body edge
d.polygon([(0, 900), (380, 900), (360, 1120), (330, 1300), (390, 1320), (400, 1640), (330, 1720), (0, 1760)], fill=255)
m = m.filter(ImageFilter.GaussianBlur(28))                   # ~40-60 px soft transition
m.save(os.path.join(D, 'scene_net_a_2k_fix_mask.png'))

out = Image.composite(lo, hi, m)
out.save(os.path.join(D, 'scene_net_a_2k_fix.png'), optimize=True)
print('ok', out.size)
