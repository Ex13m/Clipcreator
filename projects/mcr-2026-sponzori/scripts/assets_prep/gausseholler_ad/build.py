"""Gausse Holler ad cut-outs -> assets_prep/gausseholler/ads/ (+ manifest.json).

Inputs : assets/gausseholler/*.jpg (research downloads) + assets/gausseholler/ads_src/*.jpg (shop CDN, 19 Oct 2026,
         fetched through the Zapier->Drive bridge), ISNet mattes from scratchpad/bgnode/rmbg.mjs medium (ISNET dir).
Method : cut.cutout_dark (ISNet silhouette + ghost peel + hole classification + colour unmixing against an
         estimated studio plate + decontamination). No AI upscale (sources are 2048 px shop renders).
usage  : python3 build.py <ISNET_DIR>
"""
import json
import os
import sys

import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(__file__))
from cut import cutout_dark, trim  # noqa: E402

P = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))     # projects/mcr-2026-sponzori
SRC = f'{P}/assets/gausseholler'
OUT = f'{P}/assets_prep/gausseholler/ads'
ISNET = sys.argv[1]
CDN = 'https://cdn.shopify.com/s/files/1/0994/1775/1900/files/'
SHOP = 'https://gausseholler.com/products/'

COLOURWAYS = ['blue', 'orange', 'red', 'purple', 'tiffany', 'light-green', 'bronze']

JOBS = [
    # out name, source file, isnet name, role, product, product page, source image URL, kwargs
    ('H1_revolut8_black_threeq', 'ads_src/r8-alu-black.jpg', 'r8-alu-black', 'hero',
     'Revolut 8 — Standard Edition · Black (3/4 render) = "Black Standard Edition"', 'rod-stand-v2', 'r8-alu-black.jpg', {}),
    ('H1b_revolut8_black_front', 'p05_revolut8_panel_hero.jpg', 'p05', 'hero-angle',
     'Revolut 8 — Standard Edition · Black (front render, homepage panel)', 'rod-stand-v2',
     'https://gausseholler.com/cdn/shop/files/panel-r8-hero.jpg', {}),
    ('H1c_revolut8_black_top', 'p04_revolut8_black_top.jpg', 'p04', 'hero-angle',
     'Revolut 8 — Standard Edition · Black (top view)', 'rod-stand-v2', 'r8-alu-black-top.jpg', {}),
    ('H3_snap8_black', 'ads_src/snap8-alu-black.jpg', 'snap8-alu-black', 'hero',
     'Snap 8 — Standard Edition · Black', 'rod-stand-v1', 'snap8-alu-black.jpg', {}),
    ('S1_aluset_revolut8_orange', 'p07_aluset_revolut8_orange.jpg', 'p07', 'secondary',
     'Aluminium Set · Revolut 8 — Orange · Black Logo (legs, axle, top nut, star knob)', 'alu-set-revolut-8',
     'alu-set-orange-threeq.jpg', {'keep_largest': False}),
    ('S2_aluset_revolut8_black', 'ads_src/alu-set-black-threeq.jpg', 'alu-set-black-threeq', 'secondary',
     'Aluminium Set · Revolut 8 — Black · Orange Logo', 'alu-set-revolut-8', 'alu-set-black-threeq.jpg', {}),
    ('S3_carbon_tube_set_red', 'ads_src/carbon-tube-set-red.jpg', 'carbon-tube-set-red', 'secondary',
     'Carbon Tube Set · 8 pcs — Red (Ø 32 mm, 200 mm)', 'carbon-tube-set-8', 'carbon-tube-set-red.jpg', {}),
    ('S4_carbon_tube_black', 'ads_src/carbon-tube-black.jpg', 'carbon-tube-black', 'secondary',
     'Carbon Tube Ø32 · Black (single tube, 200 mm)', 'carbon-tube-black', 'carbon-tube-black.jpg', {'keep_largest': True}),
    ('S5_revolut8_nevergreen', 'ads_src/nevergreen-hero.jpg', 'nevergreen-hero', 'secondary',
     'Revolut 8 — Standard Edition · Nevergreen', 'rod-stand-v2-nevergreen', 'rod-stand-v2-nevergreen-hero.jpg', {}),
    ('S6_revolut8_black_white', 'p08_revolut8_black_white_hero.jpg', 'p08', 'secondary',
     'Revolut 8 — Standard Edition · Black & White', 'rod-stand-v2-black-white',
     'rod-stand-v2-black-white-hero-muyn16cg.jpg', {}),
]
SRCFIX = {}
BASE_KW = dict(sil_thr=0.65)


def stats(rgba):
    a = rgba[..., 3].astype(np.float32) / 255
    H, W = a.shape
    ys, xs = np.where(a > 0.5)
    pad = [round(xs.min() / W, 4), round(ys.min() / H, 4), round((W - 1 - xs.max()) / W, 4), round((H - 1 - ys.max()) / H, 4)]
    rgb = rgba[..., :3].astype(np.float32)
    lum = rgb @ np.array([0.299, 0.587, 0.114], np.float32)
    from scipy import ndimage as ndi
    lum_s = ndi.gaussian_filter(np.where(a > 0.95, lum, 0), 6)
    gy, gx = np.unravel_index(np.argmax(lum_s), lum_s.shape)
    px = rgb[a > 0.95].reshape(-1, 3)
    rng = np.random.default_rng(7)
    px = px[rng.choice(len(px), min(len(px), 40000), replace=False)]
    c = px[rng.choice(len(px), 4, replace=False)]
    for _ in range(25):
        lab = np.argmin(((px[:, None] - c[None]) ** 2).sum(2), 1)
        c = np.array([px[lab == k].mean(0) if (lab == k).any() else c[k] for k in range(4)])
    share = np.bincount(lab, minlength=4) / len(lab)
    order = np.argsort(-share)
    dom = [{'hex': '#%02x%02x%02x' % tuple(int(v) for v in c[k]), 'share': round(float(share[k]), 3)} for k in order]
    # most saturated cluster = accent
    sat = [(max(c[k]) - min(c[k])) for k in range(4)]
    acc = '#%02x%02x%02x' % tuple(int(v) for v in c[int(np.argmax(sat))])
    return pad, [round(gx / W, 3), round(gy / H, 3)], dom, acc


def load(src, isn):
    rgb = np.asarray(Image.open(f'{SRC}/{SRCFIX.get(src, src)}').convert('RGB'))
    ia = np.asarray(Image.open(f'{ISNET}/{isn}.png').convert('RGBA'))[..., 3]
    return rgb, ia


def main():
    os.makedirs(OUT, exist_ok=True)
    files = []
    for name, src, isn, role, product, handle, srcimg, kw in JOBS:
        rgb, ia = load(src, isn)
        rgba, _ = cutout_dark(rgb, ia, **{**BASE_KW, **kw})
        t, bbox, p = trim(rgba, 0.03)
        Image.fromarray(t).save(f'{OUT}/{name}.png', optimize=True)
        pad, glint, dom, acc = stats(t)
        files.append({'file': f'gausseholler/ads/{name}.png', 'role': role, 'product': product, 'size': [t.shape[1], t.shape[0]],
                      'product_page': SHOP + handle, 'source_image': srcimg if srcimg.startswith('http') else CDN + srcimg,
                      'method': 'local: ISNet silhouette + plate-unmix cut-out (cut.py), no upscale',
                      'pad': pad, 'aspect': round(t.shape[1] / t.shape[0], 3), 'glint': glint, 'dominant': dom, 'accent': acc})
        print(name, t.shape[1], 'x', t.shape[0])
    # colourways: identical camera -> one shared crop box so they swap in place
    cut = {}
    for cw in COLOURWAYS:
        rgb, ia = load(f'ads_src/r8-alu-{cw}.jpg', f'r8-alu-{cw}')
        cut[cw], _ = cutout_dark(rgb, ia, **BASE_KW)
    A = np.max([c[..., 3] for c in cut.values()], 0)
    ys, xs = np.where(A > 8)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    pp = int(round(max(y1 - y0, x1 - x0) * 0.03))
    for i, cw in enumerate(COLOURWAYS):
        c = cut[cw]
        H, W = c.shape[:2]
        canvas = np.zeros((y1 - y0 + 2 * pp, x1 - x0 + 2 * pp, 4), np.uint8)
        canvas[pp:pp + y1 - y0, pp:pp + x1 - x0] = c[y0:y1, x0:x1]
        name = f'H2_revolut8_colourway_{i + 1}_{cw.replace("-", "")}'
        Image.fromarray(canvas).save(f'{OUT}/{name}.png', optimize=True)
        pad, glint, dom, acc = stats(canvas)
        files.append({'file': f'gausseholler/ads/{name}.png', 'role': 'hero-colourway', 'colour': cw,
                      'product': f'Revolut 8 — Standard Edition · {cw.replace("-", " ").title()} aluminium',
                      'size': [canvas.shape[1], canvas.shape[0]], 'product_page': SHOP + 'rod-stand-v2',
                      'source_image': CDN + f'r8-alu-{cw}.jpg',
                      'method': 'local cut-out; shared crop box for all 7 colourways (same render camera) -> swap in place',
                      'pad': pad, 'aspect': round(canvas.shape[1] / canvas.shape[0], 3), 'glint': glint, 'dominant': dom, 'accent': acc})
        print(name, canvas.shape[1], 'x', canvas.shape[0], acc)
    man = {'sponsor': 'gausseholler', 'generated': '2026-10-19',
           'note': 'Own production (Gausse Holler Custom Lab, hand-built in Czechia). Shop renders 2048 px on a dark studio set; '
                   'cut locally (no AI upscale, no watermark on the sources). Prices are snapshots - not for on-screen use. '
                   'Do not caption the number of colours (web says "Five colourways" and lists 8 variants).',
           'files': files}
    json.dump(man, open(f'{OUT}/manifest.json', 'w'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
