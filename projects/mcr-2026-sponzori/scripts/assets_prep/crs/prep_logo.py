"""ČRS logo variants from the official site SVG (rendered by weserv at 1900 px, transparent).
src: https://www.rybsvaz.cz/g/cms/api/rest/documents/by-uuid/b01c4638-0bcb-f7ab-b6d8-de1234fa39ab/content/logoCRSLight.svg
out: assets_prep/crs/logo_crs_color.png (official colours), logo_crs_white.png (mono white for dark fields),
     logo_crs_navy.png (mono navy #182F5D), mark_crs_color.png / mark_crs_white.png (fish only), _logo_sheet.jpg
"""
import sys, json
from pathlib import Path
import numpy as np
from PIL import Image

P = Path(__file__).resolve().parents[3]          # projects/mcr-2026-sponzori
D = P / 'assets_prep/crs'
src = Image.open(D / 'src/crs_logoCRSLight_w1900_weserv.png').convert('RGBA')
a = np.array(src)

def trim(arr, pad=8):
    al = arr[..., 3]
    ys, xs = np.where(al > 0)
    y0, y1, x0, x1 = max(ys.min() - pad, 0), min(ys.max() + pad + 1, arr.shape[0]), max(xs.min() - pad, 0), min(xs.max() + pad + 1, arr.shape[1])
    return arr[y0:y1, x0:x1]

def mono(arr, rgb):
    out = arr.copy()
    out[..., :3] = rgb
    # the tiny white eye highlight (white on blue) becomes a hole in a mono version
    white = (arr[..., 0] > 200) & (arr[..., 1] > 200) & (arr[..., 2] > 200)
    out[..., 3] = np.where(white, 0, arr[..., 3])
    return out

# split mark (fish) / wordmark: largest empty column gap between them
al = a[..., 3]
cols = (al > 0).sum(0)
xs = np.where(cols > 0)[0]
gaps = [(xs[i + 1] - xs[i], xs[i], xs[i + 1]) for i in range(len(xs) - 1)]
g = max(gaps)
split = (g[1] + g[2]) // 2
mark = a.copy(); mark[:, split:, 3] = 0
word = a.copy(); word[:, :split, 3] = 0

outs = {
    'logo_crs_color.png': trim(a),
    'logo_crs_white.png': trim(mono(a, (255, 255, 255))),
    'logo_crs_navy.png': trim(mono(a, (0x18, 0x2F, 0x5D))),
    'mark_crs_color.png': trim(mark),
    'mark_crs_white.png': trim(mono(mark, (255, 255, 255))),
    'wordmark_crs_color.png': trim(word),
    'wordmark_crs_white.png': trim(mono(word, (255, 255, 255))),
}
meta = {}
for k, v in outs.items():
    Image.fromarray(v).save(D / k, optimize=True)
    meta[k] = {'w': int(v.shape[1]), 'h': int(v.shape[0])}

# contact sheet: colour on white + light, white on navy / TA red / black
tiles = [('logo_crs_color.png', (255, 255, 255)), ('logo_crs_color.png', (238, 242, 249)),
         ('logo_crs_white.png', (11, 30, 66)), ('logo_crs_white.png', (227, 30, 36)), ('logo_crs_white.png', (12, 12, 12)),
         ('mark_crs_color.png', (255, 255, 255)), ('mark_crs_white.png', (48, 66, 133))]
W, TH = 1000, 330
sheet = Image.new('RGB', (W, TH * len(tiles)), (128, 128, 128))
for i, (k, bg) in enumerate(tiles):
    tile = Image.new('RGB', (W, TH), bg)
    im = Image.open(D / k)
    s = min((W - 80) / im.width, (TH - 60) / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    tile.paste(im, ((W - im.width) // 2, (TH - im.height) // 2), im)
    sheet.paste(tile, (0, i * TH))
sheet.save(D / '_logo_sheet.jpg', quality=90)
meta['_split_x_px'] = int(split)
meta['source'] = 'https://www.rybsvaz.cz/g/cms/api/rest/documents/by-uuid/b01c4638-0bcb-f7ab-b6d8-de1234fa39ab/content/logoCRSLight.svg (158x47 viewBox, fills #2B5DA9 / #182F5D / white eye) rendered via images.weserv.nl w=1900 output=png'
meta['colors'] = {'blue': '#2B5DA9', 'navy': '#182F5D', 'eye': '#FFFFFF'}
json.dump(meta, open(D / '_logo_meta.json', 'w'), indent=1, ensure_ascii=False)
print(json.dumps(meta, indent=1))

# ---- round ČRS emblem as used in the partner strip of troutareacz.cz (admin.troutareacz.cz/media/1000023322.webp, 864x852 RGB on white)
em = np.array(Image.open(D / 'src/tacz_partner_crs_1000023322.png').convert('RGB')).astype(np.float32)
nonwhite = (255 * 3 - em.sum(2)) > 30
ys, xs = np.where(nonwhite)
cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
r = min(xs.max() - xs.min(), ys.max() - ys.min()) / 2 + 0.5
yy, xx = np.mgrid[:em.shape[0], :em.shape[1]]
dist = np.hypot(xx + 0.5 - cx - 0.5, yy + 0.5 - cy - 0.5)
alpha = np.clip(r - dist + 0.5, 0, 1)            # 1 px anti-aliased disc
rgba = np.dstack([em, alpha * 255]).astype(np.uint8)
x0, x1, y0, y1 = int(cx - r - 2), int(cx + r + 3), int(cy - r - 2), int(cy + r + 3)
rgba = rgba[max(y0, 0):y1, max(x0, 0):x1]
Image.fromarray(rgba).save(D / 'badge_crs_round.png', optimize=True)
print('badge_crs_round.png', rgba.shape, 'r', r)
