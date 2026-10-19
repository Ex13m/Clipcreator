"""Bosset ad cut-outs (2026-10-19).
usage: python3 build.py <workdir>   (workdir has src/*.jpg|png, isnet/<name>.png from scratchpad/bgnode/rmbg.mjs medium,
                                     dl/hf_keitech_es4_4k.png = Higgsfield 4k upscale)
Reuses velkaryba_ad/cut.py::cutout3 (ISNet trimap + colour unmixing against paper white + topology).
"""
import sys, os, json
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'velkaryba_ad'))
from cut import cutout3, trim_pad, contact_shadow2

W = sys.argv[1]
OUT = '/home/user/Clipcreator/projects/mcr-2026-sponzori/assets_prep/bosset/ads'
os.makedirs(OUT, exist_ok=True)


def load(name):
    p = [f for f in os.listdir(f'{W}/src') if f.startswith(name)][0]
    rgb = np.asarray(Image.open(f'{W}/src/{p}').convert('RGB')).astype(np.float32)
    ia = np.asarray(Image.open(f'{W}/isnet/{os.path.splitext(p)[0]}.png').convert('RGBA').resize((rgb.shape[1], rgb.shape[0])))[..., 3]
    return rgb, clean_isnet(rgb, ia)


def clean_isnet(rgb, ia, white_dark=5):
    """ISNet bleeds onto pure paper white near the frame edges (tabs under the bottles) -> zero it where the photo is paper white."""
    dark = ndi.gaussian_filter(np.max(255 - rgb, axis=2), 1.0)
    return np.where(dark < white_dark, 0, ia).astype(np.uint8)


def bottle_fill(im, rgb0, ia):
    """Bottles are solid bodies: every row is filled between its outermost opaque pixels (kills pale highlight bites
    that ISNet / unmixing open up on pastel and white bottles). Filled pixels get the ORIGINAL photo colour."""
    arr = np.asarray(im).astype(np.float32)
    a = arr[..., 3] / 255
    solid = (a > 0.5) | ((ia > 160) & (np.max(255 - rgb0, axis=2) > 10))
    solid = ndi.binary_opening(solid, iterations=2)
    lab, n = ndi.label(solid)
    if n > 1:                                         # keep the main body only
        sz = ndi.sum(np.ones_like(a), lab, np.arange(1, n + 1))
        solid = lab == (1 + int(np.argmax(sz)))
    fill = np.zeros_like(solid)
    for y in np.where(solid.any(1))[0]:
        xs = np.where(solid[y])[0]
        fill[y, xs[0]:xs[-1] + 1] = True
    fill = ndi.binary_fill_holes(fill)
    inner = ndi.binary_erosion(fill, iterations=2)
    g = ndi.gaussian_filter(fill.astype(np.float32), 0.7)
    a2 = np.where(inner, 1.0, np.where(fill, np.maximum(a, g), np.where(ndi.binary_dilation(fill, iterations=1), np.minimum(a, g), 0.0)))
    newly = inner & (a < 0.97)
    col = arr[..., :3].copy()
    col[newly] = rgb0[newly]
    return Image.fromarray(np.dstack([col, a2 * 255]).round().clip(0, 255).astype(np.uint8), 'RGBA')


def edge_clean(im, rad=1):
    """Decontaminate the 1–2 px rim: colour of semi-transparent pixels = nearest opaque colour (no white fringe)."""
    arr = np.asarray(im).astype(np.float32)
    a = arr[..., 3] / 255
    core = a > 0.97
    _, (iy, ix) = ndi.distance_transform_edt(~core, return_indices=True)
    rim = (a > 0) & ~core
    col = arr[..., :3].copy()
    near = arr[iy, ix, :3]
    # keep unmixed colour where it is close to the core colour, otherwise take the core colour
    w = np.clip(a, 0, 1)[..., None] ** 2
    col[rim] = (w * col + (1 - w) * near)[rim]
    return Image.fromarray(np.dstack([col, arr[..., 3]]).round().clip(0, 255).astype(np.uint8), 'RGBA')


def save(im, name, meta, shadow=True):
    im.save(f'{OUT}/{name}.png', optimize=True)
    if shadow:
        contact_shadow2(im).save(f'{OUT}/{name}_shadow.png', optimize=True)
    a = np.asarray(im)[..., 3]
    ys, xs = np.where(a > 128)
    meta[name] = dict(size=list(im.size), bbox=[int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())])
    print(name, im.size)


def run(names):
    meta = {}
    bottles = {
        'H1_zojirushi_sm-vb_0-6l_black': 'p04', 'H2_zojirushi_sm-sr_0-6l_green': 'p01',
        'S1_zojirushi_sm-she_0-6l_orange': 'p07', 'S2_zojirushi_sm-sr_0-6l_pink': 'p02',
        'S3_zojirushi_sm-sr_0-6l_white': 'p03', 'S4_zojirushi_sm-vb_0-6l_green': 'p05',
        'S5_zojirushi_sm-vb_0-6l_beige': 'p06',
    }
    for out, src in bottles.items():
        if names and not any(n in out for n in names):
            continue
        rgb, ia = load(src)
        kw = dict(min_frac=0.002, dark_seed=45, bg_dark_max=18, vfloor=28, haze=0.08)
        if src == 'p03':
            kw.update(dark_seed=22, bg_dark_max=8, vfloor=12, fg_isnet=0.6)
        im, info = cutout3(rgb, ia, **kw)
        im = edge_clean(bottle_fill(im, rgb, ia))
        save(trim_pad(im, 24), out, meta)
    macros = {'H2m_zojirushi_sm-sr_green_lid_open_macro': 'smsr_green_g3',
              'S2m_zojirushi_sm-sr_pink_lid_open_macro': 'smsr_pink_g3',
              'S1m_zojirushi_sm-she_orange_lid_open_macro': 'smshe_orange_g5'}
    for out, src in macros.items():
        if names and not any(n in out for n in names):
            continue
        rgb, ia = load(src)
        im, info = cutout3(rgb, ia, min_frac=0.01, dark_seed=40, bg_dark_max=16, vfloor=26, haze=0.08)
        im = edge_clean(im)
        save(im, out, meta, shadow=False)            # no trim: the body bleeds off the frame edge on purpose
    if not names or any('ygk' in n for n in names):
        rgb, ia = load('ygk_upgrade_x8')
        im, info = cutout3(rgb, ia, min_frac=0.002, dark_seed=40, bg_dark_max=16, vfloor=26, haze=0.08)
        save(trim_pad(edge_clean(im), 20), 'S6_ygk_x-braid_upgrade_x8_150m', meta)
    if not names or any('keitech' in n for n in names):
        up = np.asarray(Image.open(f'{W}/dl/hf_keitech_es4_4k.png').convert('RGB')).astype(np.float32)
        ia = clean_isnet(up, np.asarray(Image.open(f'{W}/isnet/hf_keitech_es4_4k.png').convert('RGBA').resize((up.shape[1], up.shape[0])))[..., 3])
        im, info = cutout3(up, ia, min_frac=0.002, dark_seed=40, bg_dark_max=14, vfloor=26, haze=0.08)
        im = edge_clean(im)
        im = trim_pad(im, 24)
        if max(im.size) > 2400:                          # 4k source → 2400 px long side is plenty for 1080 × 1920
            s = 2400 / max(im.size)
            im = im.convert('RGBa').resize((round(im.width * s), round(im.height * s)), Image.LANCZOS).convert('RGBA')
        save(im, 'H3_keitech_easy_shiner_4in_ice_chartreuse_pal03t', meta)
    mp = f'{OUT}/_cut_meta.json'
    old = json.load(open(mp)) if os.path.exists(mp) else {}
    old.update(meta)
    json.dump(old, open(mp, 'w'), indent=1)


run(sys.argv[2:])
