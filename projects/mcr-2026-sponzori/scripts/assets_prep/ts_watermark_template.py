"""Build the TROUTSHOP.EU watermark alpha template (1500 px geometry) from several
shop images: wherever a pixel is plain background in at least one image, its
watermark alpha is measured directly (PNG: alpha; JPG on white: 1-lum/255).
Watermark = black at ~7.8 % opacity, so removal is exact inverse blending:
orig = obs / (1 - A)."""
import sys, numpy as np
from PIL import Image
ROOT = '/home/user/Clipcreator/projects/mcr-2026-sponzori/'
PNGS = ['assets/troutshop/p01_velvet-arts-forte-2-1g-32-glow-pink.png',
        'assets/troutshop/p02_velvet-arts-forte-2-1g-35-yellow-red.png',
        'assets/troutshop/p03_velvet-arts-forte-2-1g-30-glow-gold.png']
JPGS = ['assets/troutshop/p07_velvet-arts-daisy-0-4g-34-glow-orange.jpg',
        'assets_prep/troutshop/ads/src/ts_rooney_002_1500.jpg',
        'assets_prep/troutshop/ads/src/ts_rooney_sk20_1500.jpg',
        'assets_prep/troutshop/ads/src/ts_forest_miu_ts4_1500.jpg',
        'assets_prep/troutshop/ads/src/wmref/snap1_1200.jpg']  # 1200 px: same relative geometry (verified, scale 0.80)
Y0, Y1, X0, X1 = 660, 850, 150, 1350
obs = []
for p in PNGS:
    a = np.array(Image.open(ROOT + p).convert('RGBA')).astype(float)[Y0:Y1, X0:X1]
    known = a[..., 3] < 60          # background (only watermark alpha present)
    A = np.where(known, a[..., 3] / 255.0, np.nan)
    obs.append(A)
for p in JPGS:
    im = Image.open(ROOT + p).convert('RGB')
    if im.size != (1500, 1500): im = im.resize((1500, 1500), Image.LANCZOS)
    a = np.array(im).astype(float)[Y0:Y1, X0:X1]
    lum = a.mean(2); sat = a.max(2) - a.min(2)
    known = (a.min(2) > 205) & (sat < 14)
    # dilate the product mask a bit (exclude antialiased product edges)
    import cv2
    prod = (~known).astype(np.uint8)
    prod = cv2.dilate(prod, np.ones((7, 7), np.uint8))
    known = prod == 0
    A = np.where(known, np.clip((255 - lum) / 255.0, 0, 1), np.nan)
    obs.append(A)
S = np.stack(obs)
cnt = np.sum(~np.isnan(S), 0)
T = np.nanmedian(S, 0)
print('unknown px:', int((cnt == 0).sum()), 'of', cnt.size)
np.save(sys.argv[1] if len(sys.argv) > 1 else '/tmp/wm.npy', np.nan_to_num(T, nan=-1))
v = np.where(cnt == 0, 128, np.clip(np.nan_to_num(T) * 255 * 10, 0, 255)).astype(np.uint8)
Image.fromarray(v).save(sys.argv[2] if len(sys.argv) > 2 else '/tmp/wm.png')
