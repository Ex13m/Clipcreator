"""Bosset v3: wider-assortment heroes (JDM wobblers + Reins soft bait), 21. 10. 2026.

Sources: bosset.cz shop originals `/user/shop/orig/…` (the no. 1 item of each brand category sorted by bestseller,
fetched 21. 10. 2026 through the bridge: Drive upload of images.weserv.nl/?url=…&output=png&l=0) -> assets/bosset/lures2/.
usage: python3 -I cut_heroes.py <workdir>
  <workdir>/pre/<stem>.png    cropped source on paper white (+20 px paper pad)
  <workdir>/isnet/<stem>.png  `node scratchpad/bgnode/rmbg.mjs medium <pre> <isnet>`
Out: assets_prep/bosset/ads/W*.png (+ _shadow), appended to ads/_lures_meta.json
Methods: velkaryba_ad/cut.py::cutout3 (ISNet trimap + unmixing against paper, enclosed = opaque except paper holes)
         + bosset_ad/build_lures.py::clear_plastic (see-through lip / clear body) + decontaminate (no paper halo).
"""
import json
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'velkaryba_ad'))
from cut import cutout3, trim_pad, contact_shadow2  # noqa: E402

P = '/home/user/Clipcreator/projects/mcr-2026-sponzori'
OUT = f'{P}/assets_prep/bosset/ads'
WK = sys.argv[1]


def clean_isnet(rgb, ia, white, white_dark=5):
    dark = ndi.gaussian_filter(np.max(np.abs(white - rgb), axis=2), 1.0)
    return np.where(dark < white_dark, 0, ia).astype(np.uint8)


def decontaminate(im, erode=2, reach=5, choke=0.08):
    a = np.asarray(im).astype(np.float32)
    al = a[..., 3] / 255
    solid = al > 0.97
    interior = ndi.binary_erosion(solid, iterations=erode)
    dist, (iy, ix) = ndi.distance_transform_edt(~interior, return_indices=True)
    near = a[iy, ix, :3]
    use = (~interior) & (al > 0) & (dist <= reach)
    rgb = np.where(use[..., None], near, a[..., :3])
    na = np.clip((al - choke) / (1 - choke), 0, 1)
    return Image.fromarray(np.dstack([rgb, na * 255]).round().clip(0, 255).astype(np.uint8), 'RGBA')


def clear_plastic(im_rgba, rgb, region, amin=0.30, white=255.0, span=90.0):
    a = np.asarray(im_rgba).astype(np.float32)
    dark = np.max(white - rgb, axis=2)
    al = ndi.gaussian_filter(np.maximum(amin, np.clip(dark / span, 0, 1)), 1.0)
    reg = ndi.gaussian_filter(region.astype(np.float32), 1.5)
    alpha = a[..., 3] / 255.0
    new_a = alpha * (1 - reg) + np.minimum(alpha, al) * reg
    col = np.clip((rgb - (1 - new_a[..., None]) * white) / np.maximum(new_a[..., None], 1e-3), 0, 255)
    rgbo = a[..., :3] * (1 - reg[..., None]) + col * reg[..., None]
    return Image.fromarray(np.dstack([rgbo, new_a * 255]).round().clip(0, 255).astype(np.uint8), 'RGBA')


def white_of(rgb):
    border = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    return np.median(border, 0).astype(np.float32)


# stem -> (output name, kind, product page)
JOBS = {
    'bos_zipbaits_orbit110_510r': ('W1_zipbaits_orbit_110sp_510r', 'wobbler',
                                   'https://www.bosset.cz/zipbaits-woblery-orbit-110sp-sr-2/orbit-110-sp-110mm-16-5g--510r/'),
    'bos_megabass_x52_shigyo': ('W2_megabass_x-52_acrobat_f_shigyo', 'clear',
                                'https://www.bosset.cz/woblery-megabass-x-52-acrobat-f/megabass-x-52-acrobat-f-52mm-3-2g-shigyo/'),
    'bos_osp_durga73_s76': ('W3_osp_asura_durga_73sp_s76', 'wobbler',
                            'https://www.bosset.cz/woblery-osp-asura-duraga-73sp/osp-asura-durga-73-sp-73mm-4-7g-s76--1-4m/'),
    'bos_reins_bubbling_567': ('W4_reins_bubbling_shaker_4in_567', 'soft',
                               'https://www.bosset.cz/gumove-nastrahy-reins-bubbling-shaker-4/soft-lure--bubbring-shaker-4--567-lilac-silver-blue-flake--12-pcs-pack/'),
}


def cut(stem, meta):
    name, kind, url = JOBS[stem]
    rgb = np.asarray(Image.open(f'{WK}/pre/{stem}.png').convert('RGB')).astype(np.float32)
    ia = np.asarray(Image.open(f'{WK}/isnet/{stem}.png').convert('RGBA').resize((rgb.shape[1], rgb.shape[0])))[..., 3]
    white = white_of(rgb)
    ia = clean_isnet(rgb, ia, white)
    im, info = cutout3(rgb, ia, white=white, min_frac=0.002, dark_seed=40, bg_dark_max=16, vfloor=26, haze=0.08)
    print(' ', name, 'topo', info)
    a = np.asarray(im)[..., 3] > 0
    H, W = a.shape
    yy, xx = np.mgrid[0:H, 0:W]
    xs = np.where(a.any(0))[0]
    x0, x1 = xs.min(), xs.max()
    if kind == 'wobbler':
        # see-through diving lip: the head end is on the LEFT in these shop shots, lip below the eye line
        reg = (xx < x0 + 0.12 * (x1 - x0)) & (yy > 0.45 * H) & a
        im = clear_plastic(im, rgb, reg, white=float(white.mean()))
    elif kind == 'clear':
        # clear-bodied lure: the whole silhouette is glassy; printed / metallic / painted parts stay opaque by darkness
        im = clear_plastic(im, rgb, a, amin=0.34, white=float(white.mean()), span=70.0)
    im = decontaminate(trim_pad(im, 16))
    im.save(f'{OUT}/{name}.png', optimize=True)
    contact_shadow2(im).save(f'{OUT}/{name}_shadow.png', optimize=True)
    al = np.asarray(im)[..., 3]
    ys, xs = np.where(al > 128)
    W, H = im.size
    meta[name] = dict(size=[W, H], pad=[round(xs.min() / W, 4), round(ys.min() / H, 4), round(1 - (xs.max() + 1) / W, 4),
                                        round(1 - (ys.max() + 1) / H, 4)],
                      src=f'assets/bosset/lures2/{stem}.png', page=url, kind=kind)
    print(' ', name, im.size)


if __name__ == '__main__':
    meta = {}
    for s in JOBS:
        cut(s, meta)
    mp = f'{OUT}/_lures_meta.json'
    old = json.load(open(mp)) if os.path.exists(mp) else {}
    old.update(meta)
    json.dump(old, open(mp, 'w'), indent=1, ensure_ascii=False)
