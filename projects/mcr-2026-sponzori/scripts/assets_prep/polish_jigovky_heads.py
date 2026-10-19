"""Edge polish for the painted Jigovky head cut-outs (CD review, 19. 10. 2026).

Problem: head_fluo / head_red / head_pink (+ the small orange / gold swatches) were keyed from white sweeps. Their rim
keeps 2-6 px of opaque near-white "bounce light" from the paper (the red one has a white crescent under the ball) and the
alpha contour is lumpy. On the forest-green world this reads as a white halo.

Fix (only the band next to the body, the shank fade and the eye wire are left alone):
  1. body core = alpha > .5 eroded by D px; every rim pixel within D+3 px of the core takes the colour of its nearest core
     pixel when it is lighter / greyer than that colour (decontaminate, weight by how much lighter it is);
  2. the rim alpha (up to D+12 px from the core, so the soft outer fringe of the key goes too) is smoothed (Gaussian on the solid mask) and choked by ~1 px, so the lumps of the key disappear.
Outputs: assets_prep/jigovky/ads/pol/<same name>.png (same size → the anchors in ads/_meta.json stay valid) + _check.jpg.
Run: python3 -I scripts/assets_prep/polish_jigovky_heads.py
"""
from __future__ import annotations

import math
import os

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

PROJ = '/home/user/Clipcreator/projects/mcr-2026-sponzori'
SRC = f'{PROJ}/assets_prep/jigovky/ads'
OUT = f'{SRC}/pol'
# name: (core depth D px, choke px, smoothing sigma)
HEAD_PX = {'head_fluo': 325, 'head_pink': 268, 'head_red': 414, 'head_orange': 98, 'head_gold': 93}   # ads/_meta.json head_px
ITEMS = {
    'head_fluo': (8, 1.2, 1.3),
    'head_pink': (8, 1.0, 1.2),
    'head_red': (9, 1.2, 1.3),
    'head_orange': (4, 0.6, 0.8),
    'head_gold': (4, 0.4, 0.7),
}


def lum(rgb):
    return rgb @ np.array([0.2126, 0.7152, 0.0722], np.float32)


def polish(name, D, choke, sigma):
    im = Image.open(f'{SRC}/{name}.png').convert('RGBA')
    a = np.asarray(im).astype(np.float32)
    rgb, A = a[..., :3], a[..., 3] / 255.0
    solid = A > 0.5
    din = ndi.distance_transform_edt(solid)
    # the BALL only: opening of the solid mask with a disk of ~0.3 × head size (the eye, the shank and its alpha fade are thinner)
    Rb = max(D + 4, int(0.3 * HEAD_PX.get(name, 100)))
    seed = din >= Rb
    lab, n = ndi.label(seed)
    if n > 1:
        sizes = ndi.sum(seed, lab, range(1, n + 1))
        seed = lab == (int(np.argmax(sizes)) + 1)
    ball = (ndi.distance_transform_edt(~seed) <= Rb) & solid
    # eye + shank = what is left outside the ball, minus the 1–3 px slivers of the lumpy key contour (opening), +4 px: never touched
    rw = 2 if HEAD_PX.get(name, 100) > 200 else 1
    wire = ndi.binary_opening(solid & ~ball, structure=ndi.generate_binary_structure(2, 1), iterations=rw)
    wire_zone = ndi.distance_transform_edt(~wire) <= 4
    core = ndi.distance_transform_edt(ball) >= D
    dcore, (iy, ix) = ndi.distance_transform_edt(~core, return_indices=True)
    band = (A > 0) & ~core & (dcore <= D + 3) & ~wire_zone
    far = (A > 0) & ~core & (dcore <= D + 12) & ~wire_zone       # the soft outer fringe of the key reaches ~8 px past the solid edge
    src = rgb[iy, ix]
    Lp, Ls = lum(rgb), lum(src)
    satp = rgb.max(-1) - rgb.min(-1)
    sats = src.max(-1) - src.min(-1)
    lighter = np.clip((Lp - Ls - 8) / 40.0, 0, 1)
    greyer = np.clip((sats - satp - 10) / 60.0, 0, 1)
    w = np.where(band, np.maximum(lighter, greyer), np.where(far, lighter, 0))[..., None]
    rgb2 = rgb * (1 - w) + src * w
    # alpha: smoothed solid mask, choked; applied only in the body band so the shank fade / wire keep their alpha
    sm = ndi.gaussian_filter(ball.astype(np.float32), sigma)
    k = 0.5 * (1 + math.erf(choke / (sigma * math.sqrt(2))))   # level of the original edge moved `choke` px inward
    A_s = np.clip((sm - k) / (0.4 / sigma) + 0.5, 0, 1)            # ~1 px anti-aliased ramp
    A2 = np.where(far, np.minimum(A, A_s), A)
    out = np.dstack([np.clip(rgb2, 0, 255), np.clip(A2 * 255, 0, 255)]).astype(np.uint8)
    os.makedirs(OUT, exist_ok=True)
    Image.fromarray(out, 'RGBA').save(f'{OUT}/{name}.png', optimize=True)
    return im, Image.fromarray(out, 'RGBA')


def on(bg, im):
    b = Image.new('RGBA', im.size, bg)
    b.alpha_composite(im)
    return b.convert('RGB')


if __name__ == '__main__':
    rows = []
    for nm, (D, ch, sg) in ITEMS.items():
        before, after = polish(nm, D, ch, sg)
        rows.append((on((1, 67, 31, 255), before), on((1, 67, 31, 255), after)))
        print('ok', nm, after.size)
    W = max(r[0].width for r in rows) * 2 + 30
    H = sum(r[0].height for r in rows) + 10 * len(rows)
    sheet = Image.new('RGB', (W, H), (25, 25, 25))
    y = 0
    for b, a in rows:
        sheet.paste(b, (0, y))
        sheet.paste(a, (W // 2 + 15, y))
        y += b.height + 10
    sheet.thumbnail((2400, 2400))
    sheet.save(f'{OUT}/_check.jpg', quality=88)
