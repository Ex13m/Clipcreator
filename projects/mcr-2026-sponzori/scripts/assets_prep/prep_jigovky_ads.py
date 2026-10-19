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


def white_key(rgb_im: Image.Image, lo: float = 4, span: float = 40, solid_close: int = 0, guard: int = 3,
              body: str = 'sphere', small_hole: float = 2.5e-4, matte: bool = True):
    """Cut-out from a pure-white sweep.
    Alpha from the darkest channel, colour un-mixed from white.
    matte=True : in a thin band along every boundary with background, alpha is measured RELATIVE to the
                 local core darkness (max filter), so anti-aliased pixels of a dark wire get partial alpha and
                 un-mix to dark (no light rim). Interiors keep the absolute key, so light chrome stays opaque.
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
    al = np.where(outside, 0, al)
    # Protect the SOLID body only.
    #  body='sphere': jig head = circle fitted to the head silhouette (median boundary radius around the
    #                 largest inscribed circle) -> chrome rim highlights stay opaque, the eye hole (outside
    #                 the circle) stays transparent.
    #  body='open'  : morphological opening of the hole-filled mask (spool etc.).
    protected = np.zeros(al.shape, bool)
    filled = ndi.binary_fill_holes(ndi.binary_closing(al > 0.5, structure=np.ones((3, 3)), iterations=2 + solid_close))
    dt = ndi.distance_transform_edt(filled)
    H, W = al.shape
    if body == 'sphere':
        cy, cx = np.unravel_index(np.argmax(dt), dt.shape)
        r_in = dt[cy, cx]
        edge = filled & ~ndi.binary_erosion(filled)
        ys, xs = np.where(edge)
        rr = np.hypot(xs - cx, ys - cy)
        sel = (rr > 0.8 * r_in) & (rr < 1.35 * r_in)
        ang = np.arctan2(ys[sel] - cy, xs[sel] - cx)
        rads = []
        for k in range(36):  # per 10 deg sector take the nearest boundary point, then the median
            m = (ang >= -np.pi + k * np.pi / 18) & (ang < -np.pi + (k + 1) * np.pi / 18)
            if m.any():
                rads.append(rr[sel][m].min())
        r = float(np.median(rads)) if rads else r_in
        yy, xx = np.ogrid[:H, :W]
        solid = (np.hypot(xx - cx, yy - cy) <= r - 1.5)
        # never extend the disc beyond the real silhouette (oval heads): clip to the loose object mask
        loose = ndi.binary_fill_holes(ndi.binary_closing(al > 0.08, structure=np.ones((3, 3)), iterations=3))
        solid &= ndi.binary_erosion(loose, iterations=1)
        al = np.where(solid, 1.0, al)
        protected |= solid
    elif body == 'open':
        R = 0.4 * dt.max()
        seed = dt > R
        solid = ndi.distance_transform_edt(~seed) <= R
        solid = ndi.binary_erosion(solid & filled, iterations=2)
        al = np.where(solid, 1.0, al)
        protected |= solid
    # small enclosed light areas = metal highlights (wire collar, eye ring), not background -> opaque
    holes = filled & (al < 0.5)
    lab, n = ndi.label(holes)
    if n:
        sizes = ndi.sum(holes, lab, range(1, n + 1))
        small = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s < small_hole * H * W])
        al = np.where(small, np.maximum(al, 1.0), al)
        protected |= small
    if matte:
        bw = max(2, int(round(0.0012 * max(H, W))))
        bgish = al < 0.03
        band = ndi.binary_dilation(bgish, iterations=bw) & ~bgish & ~protected
        k = 2 * bw + 3
        dcore = np.maximum(ndi.maximum_filter(d, size=k), lo + span)
        al_rel = np.clip((d - lo) / (dcore - lo), 0, 1)
        al = np.where(band, np.minimum(al, al_rel), al)
    safe = np.maximum(al, 1e-3)[..., None]
    rgb = np.clip((a - (1 - al[..., None]) * 255.0) / safe, 0, 255)
    rgb = np.where(al[..., None] > 0.004, rgb, 0)
    out = np.dstack([rgb, al * 255]).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')


def despeck(im: Image.Image, k_frac: float = 0.012, thr: float = 32, max_area_frac: float = 2e-5):
    """Retouch dust specks on the chrome head (upscaler made them crisp): small dark blobs inside the
    opaque body that are much darker than their local median -> OpenCV Telea inpaint. Body only."""
    import cv2
    a = np.array(im)
    rgb = a[..., :3].copy()
    body = ndi.binary_erosion(a[..., 3] > 250, iterations=6)
    lum = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY).astype(np.float32)
    k = max(5, int(k_frac * max(im.size)) | 1)
    med = cv2.medianBlur(lum.astype(np.uint8), k).astype(np.float32)
    cand = ((lum - med) < -thr) & body
    lab, n = ndi.label(cand)
    if n == 0:
        return im, 0
    sizes = ndi.sum(cand, lab, range(1, n + 1))
    keep = [i + 1 for i, s in enumerate(sizes) if s <= max_area_frac * im.width * im.height]
    mask = ndi.binary_dilation(np.isin(lab, keep), iterations=2).astype(np.uint8) * 255
    out = cv2.inpaint(rgb, mask, 5, cv2.INPAINT_TELEA)
    a[..., :3] = np.where(mask[..., None] > 0, out, rgb)
    return Image.fromarray(a, 'RGBA'), len(keep)


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
    box = (x0, int(max(cy - 1.75 * d, 0)), int(min(cx + 0.95 * d, W)), int(min(cy + 0.85 * d, H)))
    return rgb_im.crop(box), (cx - box[0], cy - box[1], d)


ITEMS = []  # filled by run()


def save(name, im, meta):
    im.save(f'{OUT}/{name}.png', optimize=True)
    meta.update({'file': f'jigovky/ads/{name}.png', 'size': list(im.size)})
    ITEMS.append(meta)
    print('saved', name, im.size)


def anchors_full_jig(im):
    """Normalised anchors for choreography: head centre/radius (thickest point), eye top (top-most pixel in the
    left 30 %), hook point (left-most pixel of the top 4 % band in the right 70 %: the tip of the bend)."""
    a = np.asarray(im.getchannel('A')) > 128
    H, W = a.shape
    dt = ndi.distance_transform_edt(a)
    hy, hx = np.unravel_index(np.argmax(dt), dt.shape)
    ys, xs = np.where(a)
    sel = xs < 0.3 * W
    ey = ys[sel].min()
    ex = xs[sel & (ys < ey + 3)].mean()
    sel = xs > 0.3 * W
    ty = ys[sel].min()
    band = sel & (ys < ty + 0.04 * H)
    i = int(np.argmin(np.where(band, xs, 10 ** 9)))
    r = lambda v: round(float(v), 4)
    return {'head': [r(hx / W), r(hy / H)], 'head_r': r(dt.max() / W), 'eye_top': [r(ex / W), r(ey / H)],
            'hook_point': [r(xs[i] / W), r(ys[i] / H)]}


def run():
    os.makedirs(OUT, exist_ok=True)
    srcs = {os.path.splitext(f)[0]: f'{HF}/{f}' for f in os.listdir(HF)} if os.path.isdir(HF) else {}

    # ---------- HERO 1: TroutJig Barbless #6 2 g (Higgsfield 4k upscale -> local white key)
    p = srcs.get('troutjig_hf4k', f'{SRC}/p01_troutjig-barbless.jpg')
    im = drop_specks(white_key(load_rgb(p), lo=10 if "hf4k" in p else 6, span=46, guard=6 if "hf4k" in p else 3))
    im = trim(im)
    im, nspk = despeck(im)
    print('troutjig specks retouched', nspk)
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
        ('head_red', srcs.get('hd_red_hf4k', f'{SRC}/p07_hd-barbless-red-1-3g.jpg'), 'HD BARBLESS #6 RED 1,3 g', 'https://www.jigovky.cz/hd-barbless/', 'hero'),
        ('head_pink', srcs.get('hd_pink_hf4k', f'{SRC}/p03_hd-barbless-pink-0-4g.jpg'), 'HD BARBLESS #2 PINK 0,4 g', 'https://www.jigovky.cz/hd-barbless--2--5-ks--pink--0-4-g/', 'hero'),
        ('head_fluo2', f'{SRC}/p02_hd-barbless-fluo-0-4g.jpg', 'HD BARBLESS #2 FLUO 0,4 g', 'https://www.jigovky.cz/hd-barbless--2--5-ks--fluo--0-4-g/', 'swatch'),
        ('head_gold', f'{SRC}/p04_tungsten-h360bl-gold-0-4g.jpg', 'Tungsten H 360 BL #6 GOLD 0,4 g', 'https://www.jigovky.cz/h-360-bl--6--5-ks--gold--0-4-g/', 'swatch'),
        ('head_orange', f'{SRC}/p05_tungsten-h360bl-orange-0-4g.jpg', 'Tungsten H 360 BL #6 ORANGE 0,4 g', 'https://www.jigovky.cz/h-360-bl--6--5-ks--orange--0-4-g/', 'swatch'),
        ('head_silver', f'{SRC}/p11_hd-barbless-2-silver-2g.jpg', 'HD BARBLESS #2 SILVER 2 g', 'https://www.jigovky.cz/hd-barbless--2--5-ks--silver--2-g/', 'swatch'),
        ('head_chrome_macro', f'{SRC}/p09_hd-barbless-4-3g.jpg', 'HD BARBLESS #4 3 g', 'https://www.jigovky.cz/hd-barbless--4-5-ks--3-g/', 'macro'),
    ]
    for name, p, prod, url, role in heads:
        rgb = load_rgb(p)
        crop, (hx, hy, d) = head_detail(rgb)
        hf = 'hf4k' in p
        im = drop_specks(white_key(crop, lo=10 if hf else 6, span=46, guard=6 if hf else 3), frac=0.01)
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
    im = drop_specks(white_key(load_rgb(p), lo=5, span=40, solid_close=2, body='open', matte=False))
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
    cw, ch = 440, 300
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 16)
    except Exception:
        font = ImageFont.load_default()
    half = (len(names) + 1) // 2
    panels = [list(range(0, half)), list(range(half, len(names)))]
    out = Image.new('RGB', (2 * 3 * cw + 20, half * ch), (60, 60, 60))
    for pi, idxs in enumerate(panels):
        for ri, i in enumerate(idxs):
            n, it = names[i], ITEMS[i]
            im = Image.open(f'{OUT}/{n}.png').convert('RGBA')
            f = min((cw - 40) / im.width, (ch - 70) / im.height)
            sm = resize_premult(im, (max(1, round(im.width * f)), max(1, round(im.height * f))))
            for bi, (bgname, col) in enumerate(BGS):
                cell = Image.new('RGB', (cw, ch), col)
                x = (cw - sm.width) // 2
                y = (ch - 40 - sm.height) // 2 + 4
                sh = contact_shadow((sm.width, 40))
                shadow_col = (0, 0, 0) if bgname != 'brand' else (0, 30, 12)
                cell.paste(Image.new('RGB', sh.size, shadow_col), (x, y + sm.height - 22),
                           sh.point(lambda v: int(v * (0.55 if bgname == 'light' else 0.9))))
                cell.paste(sm, (x, y), sm)
                dr = ImageDraw.Draw(cell)
                tcol = (230, 230, 230) if bgname != 'light' else (40, 40, 40)
                if bi == 0:
                    dr.text((10, ch - 26), f'{n}  {it["size"][0]}x{it["size"][1]}  [{it["role"]}]', fill=tcol, font=font)
                out.paste(cell, (pi * (3 * cw + 20) + bi * cw, ri * ch))
    out.save(f'{OUT}/_sheet.jpg', quality=88)
    print('sheet', out.size)


if __name__ == '__main__':
    run()
