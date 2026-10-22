#!/usr/bin/env python3
"""Contact sheet of one sponsor's banner set: renders/<key>/_sheet.jpg
Row 1: statics 1x1 · 4x5 · 9x16 · 1.91 · 16x9 · Row 2: carousel 1–4 · Row 3+: MP4 frames (4x5, 1x1, 16x9) every ~1.25 s."""
import os, subprocess, sys, tempfile
from PIL import Image, ImageDraw, ImageFont

out_dir, key = sys.argv[1], sys.argv[2]
H = 420  # tile height
FONT = None
for p in ['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf']:
    if os.path.exists(p):
        FONT = ImageFont.truetype(p, 18)

def tile(img, label, h=H):
    w = round(img.width * h / img.height)
    t = Image.new('RGB', (w, h + 28), (24, 26, 30))
    t.paste(img.convert('RGB').resize((w, h), Image.LANCZOS), (0, 0))
    ImageDraw.Draw(t).text((6, h + 4), label, fill=(220, 220, 220), font=FONT)
    return t

def row(tiles, gap=10):
    if not tiles:
        return None
    w = sum(t.width for t in tiles) + gap * (len(tiles) - 1)
    r = Image.new('RGB', (w, max(t.height for t in tiles)), (14, 15, 18))
    x = 0
    for t in tiles:
        r.paste(t, (x, 0)); x += t.width + gap
    return r

def f(name):
    p = os.path.join(out_dir, f'{key}_{name}')
    return p if os.path.exists(p) else None

rows = []
rows.append(row([tile(Image.open(p), n) for n in ['static_1x1.png', 'static_4x5.png', 'static_9x16.png', 'static_191.png', 'static_16x9.png'] if (p := f(n))]))
rows.append(row([tile(Image.open(p), n) for n in [f'carousel_{i}.png' for i in range(1, 5)] if (p := f(n))]))
for v in ['anim_4x5.mp4', 'anim_1x1.mp4', 'anim_16x9.mp4']:
    p = f(v)
    if not p:
        continue
    with tempfile.TemporaryDirectory() as td:
        ts = [0.0, 1.3, 2.9, 3.8, 5.3, 6.2, 7.9, 9.9]
        tiles = []
        for t in ts:
            o = os.path.join(td, f'{t}.png')
            subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-ss', str(t), '-i', p, '-frames:v', '1', o], check=False)
            if os.path.exists(o):
                tiles.append(tile(Image.open(o), f'{v} {t:.1f}s', 220 if '16x9' in v else 300))
        rows.append(row(tiles, 6))
rows = [r for r in rows if r]
W = max(r.width for r in rows)
sheet = Image.new('RGB', (W + 20, sum(r.height for r in rows) + 10 * (len(rows) + 1)), (8, 9, 11))
y = 10
for r in rows:
    sheet.paste(r, (10, y)); y += r.height + 10
if sheet.width > 3000:
    sheet = sheet.resize((3000, round(sheet.height * 3000 / sheet.width)), Image.LANCZOS)
sheet.save(os.path.join(out_dir, '_sheet.jpg'), quality=86)
print(f'  sheet {sheet.width}×{sheet.height} → {os.path.join(out_dir, "_sheet.jpg")}')
