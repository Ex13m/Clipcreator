#!/usr/bin/env python3
"""MADE BY ⚙ © 2026 GAUSSE HOLLER — two-line stacked variant for the film finale (v9, operator 22. 10.: MADE BY ≥ 30 px caps).

The one-line sign-off (assets_prep/gausseholler/madeby_on_dark.png, 3961 px content, caps 131 px) is 30× wider than its caps, so at
≥ 30 px caps it would be ~900 px wide = wider than the TA hero logo (618 px at ×2.2) → logo rule. Stacked:
        MADE BY ⚙
  © 2026 GAUSSE HOLLER
= 2483 px wide content (caps 131) → ~600 px at 31 px caps (≤ TA width and area). Same source pixels (no re-typesetting):
crops of madeby_text_on_dark.png (gear cleared) + the gear of madeby_on_dark.png (flat, for the logo rule / trim).
Writes madeby_stack_on_dark.png (flat) + madeby_stack_text_on_dark.png (text only; the gear ring/core layers go on top in
fx_gausseholler.madebyStack) and prints the geometry constants for it.
"""
from pathlib import Path
from PIL import Image
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
D = ROOT / 'assets_prep/gausseholler'
txt = Image.open(D / 'madeby_text_on_dark.png').convert('RGBA')
flat = Image.open(D / 'madeby_on_dark.png').convert('RGBA')
PAD, TY0, TY1 = 40, 141, 272                 # text rows (caps 131 px)
MB = (41, 1002)                               # „MADE BY“ columns
CR = (1518, 4001)                             # „© 2026 GAUSSE HOLLER“ columns
GX, GY, GS = 1081.04, 36.0, 340               # gear canvas on the one-line canvas (fx_gausseholler MB.gear)
GAP = round(GX - MB[1])                       # MADE BY → gear canvas (79 px, as in the one-line sign-off)
LGAP = 40                                     # line gap (between the gear canvas bottom and line 2 caps top)
w2 = CR[1] - CR[0]
w1 = (MB[1] - MB[0]) + GAP + GS
W = w2 + 2 * PAD
H = PAD + GS + LGAP + (TY1 - TY0) + PAD
x1 = PAD + round((w2 - w1) / 2)
gx, gy = x1 + (MB[1] - MB[0]) + GAP, PAD
ty1 = gy + round(GS / 2 - (TY1 - TY0) / 2)    # line 1 text centred on the gear (as on the one-line canvas: text centre = gear centre)
ty2 = PAD + GS + LGAP
out_t = Image.new('RGBA', (W, H), (0, 0, 0, 0))
out_t.alpha_composite(txt.crop((MB[0], TY0, MB[1], TY1)), (x1, ty1))
out_t.alpha_composite(txt.crop((CR[0], TY0, CR[1], TY1)), (PAD, ty2))
out_f = out_t.copy()
gear = flat.crop((round(GX), round(GY), round(GX) + GS, round(GY) + GS))
out_f.alpha_composite(gear, (gx, gy))
out_t.save(D / 'madeby_stack_text_on_dark.png', optimize=True)
out_f.save(D / 'madeby_stack_on_dark.png', optimize=True)
a = np.asarray(out_f)[:, :, 3] > 0
ys, xs = np.where(a)
bb = (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)
print(f'canvas {W}x{H} · content bbox {bb} ({bb[2]-bb[0]}x{bb[3]-bb[1]}) · gear canvas ({gx}, {gy}, {GS}) · caps {TY1-TY0} px')
print(f"MBS = {{ canvas: [{W}, {H}], bbox: [{bb[0]}, {bb[1]}, {bb[2]-bb[0]}, {bb[3]-bb[1]}], gear: [{gx}, {gy}, {GS}], caps: {TY1-TY0} }}")
