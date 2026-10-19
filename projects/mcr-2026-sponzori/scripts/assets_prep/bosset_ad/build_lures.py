"""Bosset ad: assortment cut-outs (lures / soft baits / jig head) for the „rybářský e-shop“ beat (2026-10-19).
Operator rule 19. 10.: lure sellers show 6–8+ products from their assortment. Bosset sells Keitech, Select, Fresh Lures, Decoy, YGK…
Sources: bosset.cz shop originals (`/user/shop/orig/…`, listed in /gumove-nastrahy/?order=bestseller, /trout-area/?order=bestseller,
/woblery/?order=bestseller on 19. 10. 2026), fetched through the bridge (Drive upload of images.weserv.nl …&output=png&l=0) →
`assets/bosset/lures/bos_*.png`.

usage: python3 build_lures.py <workdir> [names…]
  <workdir>/pre/<stem>.png    pre-cleaned source (shop branding painted out, cropped)   — written by this script
  <workdir>/isnet/<stem>.png  ISNet matte: `node scratchpad/bgnode/rmbg.mjs medium <pre> <isnet>` — run between the passes
  pass 1 (`--pre`) writes pre/, pass 2 cuts → assets_prep/bosset/ads/L*.png (+ _shadow), _lures_meta.json
Methods
  soft baits on paper white: velkaryba_ad/cut.py::cutout3 (ISNet trimap + unmixing) with clean_isnet + activefishing decontaminate
  wobbler: cutout3 + clear_plastic on the lip (frosted, see-through) + decontaminate
  jig head: prep_jigovky_ads.py::white_key (sphere-protected chrome head, relative matte on the wire → no light rim)
"""
import sys, os, json
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'velkaryba_ad'))
sys.path.insert(0, os.path.join(HERE, '..', 'activefishing_ad'))
sys.path.insert(0, os.path.join(HERE, '..'))
from cut import cutout3, trim_pad, contact_shadow2

P = '/home/user/Clipcreator/projects/mcr-2026-sponzori'
SRC = f'{P}/assets/bosset/lures'
OUT = f'{P}/assets_prep/bosset/ads'
WK = sys.argv[1]
os.makedirs(f'{WK}/pre', exist_ok=True)


def clean_isnet(rgb, ia, white, white_dark=5):
    dark = ndi.gaussian_filter(np.max(np.abs(white - rgb), axis=2), 1.0)
    return np.where(dark < white_dark, 0, ia).astype(np.uint8)


def decontaminate(im, erode=2, reach=5, choke=0.08):
    """edge pixels take the colour of the nearest solid interior pixel; soft alpha edge choked slightly (no paper halo)."""
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


def clear_plastic(im_rgba, rgb, region, amin=0.30, white=255.0):
    a = np.asarray(im_rgba).astype(np.float32)
    dark = np.max(white - rgb, axis=2)
    al = ndi.gaussian_filter(np.maximum(amin, np.clip(dark / 90.0, 0, 1)), 1.0)
    reg = ndi.gaussian_filter(region.astype(np.float32), 1.5)
    alpha = a[..., 3] / 255.0
    new_a = alpha * (1 - reg) + np.minimum(alpha, al) * reg
    col = np.clip((rgb - (1 - new_a[..., None]) * white) / np.maximum(new_a[..., None], 1e-3), 0, 255)
    rgbo = a[..., :3] * (1 - reg[..., None]) + col * reg[..., None]
    return Image.fromarray(np.dstack([rgbo, new_a * 255]).round().clip(0, 255).astype(np.uint8), 'RGBA')


# key → (source stem, output name, kind, pre-clean)
JOBS = {
    'es424': ('bos_keitech_es45_424t', 'L1_keitech_easy_shiner_4-5in_lime_chartreuse_424t', 'soft', None),
    'es416': ('bos_keitech_es4_416t', 'L2_keitech_easy_shiner_4in_silver_flash_minnow_416t', 'soft', None),
    'es426': ('bos_keitech_es3_426t', 'L3_keitech_easy_shiner_3in_sexy_shad_426t', 'soft', None),
    'esea12': ('bos_keitech_es4_ea12t', 'L4_keitech_easy_shiner_4in_ua_limited_ea12t', 'soft', None),
    'flip': ('bos_fresh_flipworm_122', 'L5_fresh_lures_flipworm_3-1in_122', 'soft', 'largest'),
    'flat': ('bos_fresh_flatworm_104', 'L6_fresh_lures_flatworm_3-1in_104', 'white', 'largest'),
    'eshad': ('bos_select_easyshad_280', 'L7_select_easy_shad_3in_280', 'soft', None),
    'dementor': ('bos_select_dementor_13', 'L8_select_dementor_130sp_13', 'wobbler', None),
    'decoy': ('bos_decoy_sv52', 'L9_decoy_round_magic_sv-52', 'jig', None),
}


def white_of(rgb):
    border = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    return np.median(border, 0).astype(np.float32)


def pre(stem, mode):
    """paint shop branding (logo, „COLOR 104“, cheese icon) out with the paper colour; keep only the lure; crop with margin."""
    rgb = np.asarray(Image.open(f'{SRC}/{stem}.png').convert('RGB')).astype(np.float32)
    if mode == 'largest':
        white = white_of(rgb)
        d = ndi.gaussian_filter(np.max(np.abs(white - rgb), 2), 1)
        m = ndi.binary_closing(d > (6 if 'flat' in stem else 14), iterations=3)
        lab, n = ndi.label(m)
        sz = ndi.sum(np.ones_like(d), lab, np.arange(1, n + 1))
        keep = ndi.binary_dilation(lab == 1 + int(np.argmax(sz)), iterations=14)
        # smooth paper estimate from the pixels of NO component (normalised convolution) → logo/text gone, no seams on the grey gradient
        free = (~ndi.binary_dilation(m, iterations=14)).astype(np.float32)
        paper = ndi.gaussian_filter(rgb * free[..., None], (40, 40, 0)) / np.maximum(ndi.gaussian_filter(free, 40), 1e-3)[..., None]
        paper = np.where(ndi.gaussian_filter(free, 40)[..., None] > 0.02, paper, white)
        rgb = np.where(keep[..., None], rgb, paper)
        ys, xs = np.where(keep)
        y0, y1, x0, x1 = max(0, ys.min() - 30), min(rgb.shape[0], ys.max() + 30), max(0, xs.min() - 30), min(rgb.shape[1], xs.max() + 30)
        rgb = rgb[y0:y1, x0:x1]
    Image.fromarray(rgb.round().clip(0, 255).astype(np.uint8)).save(f'{WK}/pre/{stem}.png')


def load(stem):
    rgb = np.asarray(Image.open(f'{WK}/pre/{stem}.png').convert('RGB')).astype(np.float32)
    ia = np.asarray(Image.open(f'{WK}/isnet/{stem}.png').convert('RGBA').resize((rgb.shape[1], rgb.shape[0])))[..., 3]
    return rgb, ia


def cut(key, meta):
    stem, name, kind, _ = JOBS[key]
    rgb, ia = load(stem)
    white = white_of(rgb)
    ia = clean_isnet(rgb, ia, white)
    if kind == 'jig':
        from prep_jigovky_ads import white_key
        # textured paper + soft shadow under the head: key starts at darkness 30, gated by the dilated ISNet silhouette
        im = white_key(Image.fromarray(rgb.astype(np.uint8)), lo=30, span=50, body='sphere')
        a = np.asarray(im).astype(np.float32)
        a[..., 3] *= ndi.binary_dilation(ia > 60, iterations=5)
        im = trim_pad(Image.fromarray(a.round().astype(np.uint8), 'RGBA'), 16)
    elif kind == 'white':
        # pearl-white worm on paper white: ISNet silhouette (it sees the worm), filled; alpha = ISNet, colour = source
        m = ndi.binary_fill_holes(ia > 128)
        lab, n = ndi.label(m)
        if n > 1:
            sz = ndi.sum(np.ones(m.shape), lab, np.arange(1, n + 1)); m = lab == 1 + int(np.argmax(sz))
        m = ndi.gaussian_filter(m.astype(np.float32), 1.6) > 0.5
        m = ndi.binary_erosion(m, iterations=1)
        al = np.clip(ndi.gaussian_filter(m.astype(np.float32), 0.9), 0, 1)
        core = ndi.binary_erosion(m, iterations=4)
        _, (iy, ix) = ndi.distance_transform_edt(~core, return_indices=True)
        col = np.where(core[..., None], rgb, rgb[iy, ix])
        im = trim_pad(Image.fromarray(np.dstack([col, al * 255]).round().clip(0, 255).astype(np.uint8), 'RGBA'), 16)
    else:
        im, info = cutout3(rgb, ia, white=white, min_frac=0.002, dark_seed=40, bg_dark_max=16, vfloor=26, haze=0.08)
        print('  topo', info)
        if kind == 'wobbler':
            # transparent lip = left 14 % of the lure body, below the head → frosted, see-through
            H, W = ia.shape
            a = np.asarray(im)[..., 3] > 0
            xs = np.where(a.any(0))[0]
            yy, xx = np.mgrid[0:H, 0:W]
            reg = (xx < xs.min() + 0.11 * (xs.max() - xs.min())) & (yy > 0.40 * H) & a
            im = clear_plastic(im, rgb, reg, white=float(white.mean()))
        im = decontaminate(trim_pad(im, 16))
    im.save(f'{OUT}/{name}.png', optimize=True)
    contact_shadow2(im).save(f'{OUT}/{name}_shadow.png', optimize=True)
    al = np.asarray(im)[..., 3]
    ys, xs = np.where(al > 128)
    W, H = im.size
    meta[name] = dict(size=[W, H], pad=[round(xs.min() / W, 4), round(ys.min() / H, 4), round(1 - (xs.max() + 1) / W, 4), round(1 - (ys.max() + 1) / H, 4)], src=f'assets/bosset/lures/{stem}.png')
    print(name, im.size)


if __name__ == '__main__':
    args = sys.argv[2:]
    if args and args[0] == '--pre':
        for k, (stem, _, _, mode) in JOBS.items():
            pre(stem, mode)
            print('pre', stem)
        sys.exit(0)
    meta = {}
    for k in (args or list(JOBS)):
        print('==', k)
        cut(k, meta)
    mp = f'{OUT}/_lures_meta.json'
    old = json.load(open(mp)) if os.path.exists(mp) else {}
    old.update(meta)
    json.dump(old, open(mp, 'w'), indent=1)
