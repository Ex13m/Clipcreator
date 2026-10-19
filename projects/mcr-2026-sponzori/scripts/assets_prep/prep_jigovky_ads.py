"""Jigovky.cz ad cut-outs (advertising direction, 19. 10. 2026).

Inputs  : assets/jigovky/p*.jpg (shop packshots on pure white) and
          assets_prep/jigovky/ads/_src/*_hf4k.* (Higgsfield 4k upscales of the hero packshots, see hf_log.md)
Outputs : assets_prep/jigovky/ads/*.png (RGBA, premultiplied-safe edges, trimmed + 4 % pad)
          assets_prep/jigovky/ads/_meta.json (size, bbox, anchors for choreography, source, method)
          assets_prep/jigovky/ads/_sheet.jpg (contact sheet: dark / light / brand green)

Run:  python3 -I scripts/assets_prep/prep_jigovky_ads.py
Method: every source sits on a retouched pure-white sweep (255,255,255), so a white-distance key
(alpha from the darkest channel, colour un-mixed from white) beats ISNet here: it keeps the 0.3 mm
hook wire and the eye loop, and it never leaves a halo. Only background connected to the image
border is removed, so chrome highlights inside the head stay opaque.
Head details come from vise shots: the crop starts right of the vise and the hook bend, and the
shank fades out with an alpha ramp. Nothing is painted in.
"""
from __future__ import annotations

import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps
from scipy import ndimage as ndi

PROJ = '/home/user/Clipcreator/projects/mcr-2026-sponzori'
SRC = f'{PROJ}/assets/jigovky'
OUT = f'{PROJ}/assets_prep/jigovky/ads'
HF = f'{OUT}/_src'
LANCZOS = Image.Resampling.LANCZOS


def load_rgb(p):
    return ImageOps.exif_transpose(Image.open(p)).convert('RGB')


def white_key(rgb_im: Image.Image, lo: float = 4, span: float = 40, solid_close: int = 0, guard: int = 3):
    """Alpha from distance to white (darkest channel); colour un-mixed from white (no halo).
    guard: alpha survives only within `guard` px of the solid core (kills upscaler paper texture / haze)."""
    a = np.asarray(rgb_im.convert('RGB')).astype(np.float32)
    d = 255.0 - a.min(-1)
    al = np.clip((d - lo) / span, 0, 1)
    core = al > 0.45
    lab, n = ndi.label(core, structure=np.ones((3, 3)))
    if n > 1:  # tiny isolated cores = dust / texture, not product
        sizes = ndi.sum(core, lab, range(1, n + 1))
        core = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s >= max(30, 0.0005 * sizes.max())])
    al = np.where(ndi.binary_dilation(core, iterations=guard), al, 0)
    # background = near-white region connected to the border
    near = al < 0.03
    lab, _ = ndi.label(near)
    border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    outside = np.isin(lab, border[border > 0])
    obj = ~outside
    if solid_close:
        obj = ndi.binary_closing(obj, structure=np.ones((3, 3)), iterations=solid_close)
    filled = ndi.binary_fill_holes(obj)
    inner = ndi.binary_erosion(filled, iterations=2)
    al = np.where(outside & ~filled, 0, al)
    al = np.where(inner, np.maximum(al, 1.0), al)
    safe = np.maximum(al, 1e-3)[..., None]
    rgb = np.clip((a - (1 - al[..., None]) * 255.0) / safe, 0, 255)
    rgb = np.where(al[..., None] > 0.004, rgb, 0)
    out = np.dstack([rgb, al * 255]).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')


def drop_specks(im: Image.Image, frac: float = 0.002):
    a = np.array(im)
    m = a[..., 3] > 20
    lab, n = ndi.label(m, structure=np.ones((3, 3)))
    if n <= 1:
        return im
    sizes = ndi.sum(m, lab, range(1, n + 1))
    keep_ids = [i + 1 for i, s in enumerate(sizes) if s >= frac * sizes.max()]
    keep = ndi.binary_dilation(np.isin(lab, keep_ids), iterations=2)
    a[..., 3] = np.where(keep, a[..., 3], 0)
    return Image.fromarray(a, 'RGBA')


def bbox(im, thr=6):
    al = np.asarray(im.getchannel('A'))
    ys, xs = np.where(al > thr)
    return int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1


def trim(im, pad_frac=0.04):
    x0, y0, x1, y1 = bbox(im)
    c = im.crop((x0, y0, x1, y1))
    pad = int(round(max(c.size) * pad_frac))
    o = Image.new('RGBA', (c.width + 2 * pad, c.height + 2 * pad), (0, 0, 0, 0))
    o.paste(c, (pad, pad))
    return o


def resize_premult(im, size):
    return im.convert('RGBa').resize(size, LANCZOS).convert('RGBA')


def fit_long(im, side):
    f = side / max(im.size)
    if abs(f - 1) < 1e-3:
        return im
    return resize_premult(im, (round(im.width * f), round(im.height * f)))


def sharpen(im, radius=1.2, percent=40):
    rgb = im.convert('RGB').filter(ImageFilter.UnsharpMask(radius=radius, percent=percent, threshold=2))
    o = rgb.convert('RGBA')
    o.putalpha(im.getchannel('A'))
    return o


def fade_left(im, frac=0.42, gamma=1.6):
    a = np.array(im)
    w = a.shape[1]
    ramp = np.clip(np.arange(w) / max(frac * w, 1), 0, 1) ** gamma
    a[..., 3] = (a[..., 3] * ramp[None, :]).astype(np.uint8)
    return Image.fromarray(a, 'RGBA')


def head_box(rgb_im: Image.Image):
    """Jig head = the thickest point (distance transform of the filled object mask) in the right-most 20 % of the object.
    The vise and hook bend are always on the left in Jigovky vise shots."""
    a = np.asarray(rgb_im).astype(np.float32)
    m = (255 - a.min(-1)) > 40
    mf = ndi.binary_fill_holes(m)
    dt = ndi.distance_transform_edt(mf)
    xs = np.where(m.any(0))[0]
    xr = xs.max()
    lo = int(max(xr - 0.2 * rgb_im.width, 0))
    sub = dt[:, lo:xr + 1]
    cy, cxs = np.unravel_index(np.argmax(sub), sub.shape)
    r = float(sub.max())
    return lo + cxs, cy, 2 * r


def head_detail(rgb_im: Image.Image, shank_d: float = 3.2, left_min: float = 0.40):
    cx, cy, d = head_box(rgb_im)
    W, H = rgb_im.size
    x0 = int(max(cx - d / 2 - shank_d * d, left_min * W))
    box = (x0, int(cy - 1.35 * d), int(min(cx + 0.95 * d, W)), int(min(cy + 0.85 * d, H)))
    return rgb_im.crop(box), (cx - box[0], cy - box[1], d)


ITEMS = []  # filled by run()


def save(name, im, meta):
    im.save(f'{OUT}/{name}.png', optimize=True)
    meta.update({'file': f'jigovky/ads/{name}.png', 'size': list(im.size)})
    ITEMS.append(meta)
    print('saved', name, im.size)


def anchors_full_jig(im):
    """Head centre (thickest point), hook point (top-most pixel of the right/left hook) and eye (top of the head area)."""
    a = np.asarray(im.getchannel('A')) > 128
    dt = ndi.distance_transform_edt(a)
    hy, hx = np.unravel_index(np.argmax(dt), dt.shape)
    W, H = im.size
    return {'head': [round(hx / W, 4), round(hy / H, 4)], 'head_r': round(float(dt.max()) / W, 4)}


def run():
    os.makedirs(OUT, exist_ok=True)
    srcs = {os.path.splitext(f)[0]: f'{HF}/{f}' for f in os.listdir(HF)} if os.path.isdir(HF) else {}

    # ---------- HERO 1: TroutJig Barbless #6 2 g (Higgsfield 4k upscale -> local white key)
    p = srcs.get('troutjig_hf4k', f'{SRC}/p01_troutjig-barbless.jpg')
    im = drop_specks(white_key(load_rgb(p), lo=10 if "hf4k" in p else 6, span=46, guard=6 if "hf4k" in p else 3))
    im = trim(im)
    im = fit_long(im, 2400) if max(im.size) > 2400 else im
    meta = {'role': 'hero', 'product': 'Jig TroutJig Barbless #6, 2 g (značka Jigovky.cz)',
            'source': p.replace(PROJ + '/', ''), 'url': 'https://www.jigovky.cz/jig-troutjig-barbless--6-5-ks--2-g/',
            'method': ('higgsfield 4k upscale + ' if 'hf4k' in p else '') + 'white-distance key (border flood), un-mix from white',
            'material': 'chrome ball head + dark hook wire', 'sheen_blend': 'screen'}
    meta['anchors'] = anchors_full_jig(im)
    save('hero_troutjig_barbless', im, meta)

    # ---------- HERO 2: SICKLE Classic #2 (jig-head core range)
    p = srcs.get('sickle_hf4k', f'{SRC}/p08_sickle-classic-2.jpg')
    im = drop_specks(white_key(load_rgb(p), lo=10 if "hf4k" in p else 6, span=46, guard=6 if "hf4k" in p else 3))
    im = trim(im)
    im = fit_long(im, 2600) if max(im.size) > 2600 else im
    meta = {'role': 'hero', 'product': 'Jigová hlavička SICKLE #2 (značka Jigovky.cz)',
            'source': p.replace(PROJ + '/', ''), 'url': 'https://www.jigovky.cz/sickle--4-5-ks--2-g/',
            'method': ('higgsfield 4k upscale + ' if 'hf4k' in p else '') + 'white-distance key (border flood), un-mix from white',
            'material': 'dark lead ball head + sickle-bend hook', 'sheen_blend': 'screen'}
    meta['anchors'] = anchors_full_jig(im)
    save('hero_sickle', im, meta)

    # ---------- HERO 3: macro heads (tungsten colourway) from vise shots
    heads = [
        ('head_fluo', srcs.get('hd10_fluo_hf4k', f'{SRC}/p10_hd-barbless-10-fluo-0-4g.jpg'), 'HD BARBLESS #10 FLUO 0,4 g', 'https://www.jigovky.cz/hd-barbless--10--5-ks--fluo--0-4-g/', 'hero'),
        ('head_red', srcs.get('hd_red_hf4k', f'{SRC}/p07_hd-barbless-red-1-3g.jpg'), 'HD BARBLESS #6 RED 1,3 g', 'https://www.jigovky.cz/hd-barbless/', 'swatch'),
        ('head_pink', f'{SRC}/p03_hd-barbless-pink-0-4g.jpg', 'HD BARBLESS #2 PINK 0,4 g', 'https://www.jigovky.cz/hd-barbless--2--5-ks--pink--0-4-g/', 'swatch'),
        ('head_fluo2', f'{SRC}/p02_hd-barbless-fluo-0-4g.jpg', 'HD BARBLESS #2 FLUO 0,4 g', 'https://www.jigovky.cz/hd-barbless--2--5-ks--fluo--0-4-g/', 'swatch'),
        ('head_gold', f'{SRC}/p04_tungsten-h360bl-gold-0-4g.jpg', 'Tungsten H 360 BL #6 GOLD 0,4 g', 'https://www.jigovky.cz/h-360-bl--6--5-ks--gold--0-4-g/', 'swatch'),
        ('head_orange', f'{SRC}/p05_tungsten-h360bl-orange-0-4g.jpg', 'Tungsten H 360 BL #6 ORANGE 0,4 g', 'https://www.jigovky.cz/h-360-bl--6--5-ks--orange--0-4-g/', 'swatch'),
        ('head_silver', f'{SRC}/p11_hd-barbless-2-silver-2g.jpg', 'HD BARBLESS #2 SILVER 2 g', 'https://www.jigovky.cz/hd-barbless--2--5-ks--silver--2-g/', 'swatch'),
        ('head_chrome_macro', f'{SRC}/p09_hd-barbless-4-3g.jpg', 'HD BARBLESS #4 3 g', 'https://www.jigovky.cz/hd-barbless--4-5-ks--3-g/', 'macro'),
    ]
    for name, p, prod, url, role in heads:
        rgb = load_rgb(p)
        crop, (hx, hy, d) = head_detail(rgb)
        im = drop_specks(white_key(crop, lo=6, span=46), frac=0.01)
        im = fade_left(im, frac=0.45)
        x0, y0, x1, y1 = bbox(im, thr=4)
        im = im.crop((x0, y0, x1, y1))
        hx, hy = hx - x0, hy - y0
        if max(im.size) > 2000:
            f = 2000 / max(im.size)
            im = resize_premult(im, (round(im.width * f), round(im.height * f)))
            hx, hy, d = hx * f, hy * f, d * f
        W, H = im.size
        meta = {'role': role, 'product': prod, 'source': p.replace(PROJ + '/', ''), 'url': url,
                'method': ('higgsfield 4k upscale + ' if 'hf4k' in p else '') + 'head-detail crop right of vise + white key + shank alpha fade (left 45 %)',
                'head_px': round(d), 'anchors': {'head': [round(hx / W, 4), round(hy / H, 4)], 'head_r': round(d / 2 / W, 4)},
                'sheen_blend': 'screen', 'note': 'shank fades out to the left; never show the left edge as a hard cut'}
        save(name, im, meta)

    # ---------- secondary: VARIVAS Trout Nylon Orange (reseller, Japanese brand)
    p = f'{SRC}/p12_varivas-trout-nylon-orange.jpg'
    im = drop_specks(white_key(load_rgb(p), lo=5, span=40, solid_close=2))
    im = trim(im)
    save('sec_varivas_trout_nylon_orange', im, {
        'role': 'secondary', 'product': 'Vlasec VARIVAS Trout Nylon Orange 100 m (značka VARIVAS, prodej Jigovky.cz)',
        'source': p.replace(PROJ + '/', ''), 'url': 'https://www.jigovky.cz/vlasec-varivas-trout-nylon-orange-100m-0-128mm-1-13kg/',
        'method': 'white-distance key + closing (clear spool rim stays semi-transparent)',
        'note': 'third-party brand: show only as "v nabídce" / assortment, never as Jigovky own product'})

    # ---------- secondary: LL BARBLESS raw lead head macro
    p = f'{SRC}/p06_ll-barbless-2g.jpg'
    rgb = load_rgb(p)
    crop, (hx, hy, d) = head_detail(rgb)
    im = fade_left(drop_specks(white_key(crop, lo=6, span=46), frac=0.01), frac=0.45)
    x0, y0, x1, y1 = bbox(im, thr=4)
    im = im.crop((x0, y0, x1, y1))
    hx, hy = hx - x0, hy - y0
    if max(im.size) > 2000:
        f = 2000 / max(im.size)
        im = resize_premult(im, (round(im.width * f), round(im.height * f)))
        hx, hy, d = hx * f, hy * f, d * f
    save('sec_head_ll_raw', im, {'role': 'secondary', 'product': 'LL BARBLESS #6 2 g (nelakovaná hlavička)',
                                  'source': p.replace(PROJ + '/', ''), 'url': 'https://www.jigovky.cz/ll-barbless/',
                                  'method': 'head-detail crop + white key + shank fade', 'head_px': round(d),
                                  'anchors': {'head': [round(hx / im.width, 4), round(hy / im.height, 4)]}})

    json.dump({'generated': '2026-10-19', 'items': ITEMS}, open(f'{OUT}/_meta.json', 'w'), ensure_ascii=False, indent=1)
    sheet()


# ---------------------------------------------------------------- contact sheet
BGS = [('dark', (10, 12, 11)), ('light', (247, 247, 247)), ('brand', (0, 111, 51))]


def contact_shadow(size, w_frac=0.7):
    W, H = size
    sh = Image.new('L', (W, 40), 0)
    dr = ImageDraw.Draw(sh)
    dr.ellipse((W * (1 - w_frac) / 2, 8, W * (1 + w_frac) / 2, 32), fill=150)
    return sh.filter(ImageFilter.GaussianBlur(9))


def sheet():
    names = [it['file'].split('/')[-1][:-4] for it in ITEMS]
    cell = 420
    cols = len(names)
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 15)
    except Exception:
        font = ImageFont.load_default()
    rows = []
    for bgname, col in BGS:
        row = Image.new('RGB', (cell * cols, cell + 26), col)
        dr = ImageDraw.Draw(row)
        for i, (n, it) in enumerate(zip(names, ITEMS)):
            im = Image.open(f'{OUT}/{n}.png').convert('RGBA')
            f = min((cell - 50) / im.width, (cell - 90) / im.height)
            sm = resize_premult(im, (max(1, round(im.width * f)), max(1, round(im.height * f))))
            x = i * cell + (cell - sm.width) // 2
            y = (cell - 40 - sm.height) // 2 + 10
            # contact shadow (ellipse under the object, multiplied)
            sh = contact_shadow((sm.width, 40))
            shadow_col = (0, 0, 0) if bgname != 'brand' else (0, 30, 12)
            row.paste(Image.new('RGB', sh.size, shadow_col), (x, y + sm.height - 22), sh.point(lambda v: int(v * (0.55 if bgname == 'light' else 0.9))))
            row.paste(sm, (x, y), sm)
            tcol = (230, 230, 230) if bgname != 'light' else (40, 40, 40)
            dr.text((i * cell + 10, cell + 4), f'{n}  {it["size"][0]}x{it["size"][1]}', fill=tcol, font=font)
        rows.append(row)
    W = cell * cols
    out = Image.new('RGB', (W, sum(r.height for r in rows)), (0, 0, 0))
    y = 0
    for r in rows:
        out.paste(r, (0, y))
        y += r.height
    if out.width > 4200:
        f = 4200 / out.width
        out = out.resize((4200, round(out.height * f)), LANCZOS)
    out.save(f'{OUT}/_sheet.jpg', quality=88)
    print('sheet', out.size)


if __name__ == '__main__':
    run()
