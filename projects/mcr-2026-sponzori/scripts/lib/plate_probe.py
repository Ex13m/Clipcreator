#!/usr/bin/env python3
"""TA logo luminance probe — analysis part (called by scripts/plate_probe.mjs).

argv: plate.json (sidecar of the probed build: box, logo, hero moves, beats, block bounds) · snapshot dir · JSON list of times
stdout: {"windows": [[g0, g1, tone], …], "stats": {…}}

Per frame: where the TA logo is at that time (corner, or a hero move of the plate), the pixels UNDER the logo strokes (logo alpha,
dilated a little for the outline/shadow zone) → relative luminance (sRGB → linear, BT.709):
  p85 ≤ 0.30            → 'dark'   (white+red logo reads with the base soft shadow: white vs bg ≥ 3:1 on 85 % of the strokes)
  p15 ≥ 0.38            → 'halo'   (light background: strongest dark shadow + radial halo)
  otherwise             → 'scrim'  (mixed / mid-grey / busy photo: denser shadow + soft halo)
The logo itself is ALWAYS white+red (operator 21. 10.); the probe only decides the shadow / halo strength.
  + red check: bg under the red AREA strokes close to TA red on a 'dark' frame → 'scrim'
Then a 3-sample mode filter, blips < MIN_S are absorbed into the neighbour, and every change is snapped to the nearest block
boundary (± 0.6 step) or beat.
"""
import json, sys, os, re, glob
import numpy as np
from PIL import Image
from scipy.ndimage import binary_dilation

MIN_S = 0.6
side = json.load(open(sys.argv[1])); snap = sys.argv[2]; times = json.loads(sys.argv[3])
B, LG = side['box'], side['logo']
logo = Image.open(LG['src']).convert('RGBA')
la = np.asarray(logo).astype(np.float32)
red_px = (la[..., 0] > 150) & (la[..., 1] < 90) & (la[..., 2] < 90) & (la[..., 3] > 128)

frames = {}
for f in glob.glob(os.path.join(snap, '**', 'frame-*-at-*s.png'), recursive=True):
    m = re.search(r'-at-([\d.]+)s\.png$', f)
    if m: frames[round(float(m.group(1)), 3)] = f


def ease(k):  # ~ expo/power3 inOut
    return k * k * (3 - 2 * k)


def plate_at(g):
    for m in side['moves']:
        s, fly = m['scale'], m['fly']
        dx = m['cx'] - B['w'] * s / 2 - B['x']; dy = m['cy'] - B['h'] * s / 2 - B['y']
        a, b = m['g0'], m['g1']
        if g < a or (not m['hold'] and g > b): continue
        if g < a + fly: k = ease((g - a) / fly)
        elif not m['hold'] and g > b - fly: k = ease((b - g) / fly)
        else: k = 1.0
        return 1 + (s - 1) * k, dx * k, dy * k
    return 1.0, 0.0, 0.0


def lin(c):
    c = c / 255.0
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def decide(g):
    f = frames.get(round(g, 3))
    if not f: return None, None
    im = np.asarray(Image.open(f).convert('RGB')).astype(np.float32)
    H, W = im.shape[:2]
    s, dx, dy = plate_at(g)
    x0 = B['x'] + dx + LG['lx'] * s; y0 = B['y'] + dy + LG['ly'] * s
    w, h = max(4, int(round(LG['w'] * s))), max(4, int(round(LG['h'] * s)))
    xi, yi = int(round(x0)), int(round(y0))
    if xi < 0 or yi < 0 or xi + w > W or yi + h > H: return None, None
    a = np.asarray(logo.resize((w, h), Image.BILINEAR))[..., 3] > 90
    a = binary_dilation(a, iterations=max(2, int(3 * s)))
    rp = np.asarray(Image.fromarray(red_px.astype(np.uint8) * 255).resize((w, h), Image.NEAREST)) > 0
    patch = im[yi:yi + h, xi:xi + w]
    L = 0.2126 * lin(patch[..., 0]) + 0.7152 * lin(patch[..., 1]) + 0.0722 * lin(patch[..., 2])
    v = L[a]
    p85, p15 = float(np.percentile(v, 85)), float(np.percentile(v, 15))
    tone = 'dark' if p85 <= 0.30 else 'halo' if p15 >= 0.38 else 'scrim'
    if tone == 'dark' and rp.any():
        mc = patch[rp].mean(0)
        if np.linalg.norm(mc - np.array([227, 30, 36])) < 90: tone = 'scrim'
    return tone, {'g': g, 'p85': round(p85, 3), 'p15': round(p15, 3), 's': round(s, 2)}


seq, info = [], []
for g in times:
    t, i = decide(g)
    if t: seq.append([g, t]); info.append(i)
# mode filter (3)
tones = [t for _, t in seq]
filt = []
for i in range(len(tones)):
    w = tones[max(0, i - 1):i + 2]
    best = max(set(w), key=lambda x: (w.count(x), x == tones[i]))
    filt.append(best)
step = (times[1] - times[0]) if len(times) > 1 else 0.3
segs = []
for (g, _), t in zip(seq, filt):
    if segs and segs[-1][2] == t: segs[-1][1] = g + step / 2
    else: segs.append([max(0.0, g - step / 2), g + step / 2, t])
# absorb blips
changed = True
while changed and len(segs) > 1:
    changed = False
    for i, sg in enumerate(segs):
        if sg[1] - sg[0] < MIN_S:
            j = i - 1 if i > 0 else i + 1
            if i > 0 and i + 1 < len(segs) and (segs[i + 1][1] - segs[i + 1][0]) > (segs[i - 1][1] - segs[i - 1][0]): j = i + 1
            lo, hi = min(segs[i][0], segs[j][0]), max(segs[i][1], segs[j][1])
            segs[j] = [lo, hi, segs[j][2]]; segs.pop(i); changed = True
            break
    # merge equal neighbours
    k = 0
    while k + 1 < len(segs):
        if segs[k][2] == segs[k + 1][2]: segs[k][1] = segs[k + 1][1]; segs.pop(k + 1)
        else: k += 1
# snap changes to block bounds / beats
cands_b = sorted({round(b['g0'], 3) for b in side['bounds']} | {round(b['g1'], 3) for b in side['bounds']})
beats = side['beats']
for k in range(1, len(segs)):
    g = segs[k][0]
    nb = min(cands_b, key=lambda c: abs(c - g)) if cands_b else g
    if abs(nb - g) <= step * 0.6: g = nb
    else:
        bt = min(beats, key=lambda c: abs(c - g)) if beats else g
        if abs(bt - g) <= step * 0.6: g = bt
    segs[k - 1][1] = g; segs[k][0] = g
if segs: segs[0][0] = 0.0; segs[-1][1] = side['dur']
win = [[round(a, 3), round(b, 3), t] for a, b, t in segs if b - a > 1e-3]
stats = {t: round(sum(b - a for a, b, tt in win if tt == t), 2) for t in ('dark', 'scrim', 'halo')}
stats['frames'] = len(seq)
stats['worst_dark'] = sorted([i for i, t in zip(info, filt) if t == 'dark'], key=lambda x: -x['p85'])[:3]
json.dump({'windows': win, 'stats': stats}, sys.stdout)
