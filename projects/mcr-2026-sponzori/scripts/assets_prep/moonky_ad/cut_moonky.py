"""Moonky ad cut-outs (MČR 2026 sponsor film, ZMĚNA SMĚRU 19. 10.).

usage: python3 -I cut_moonky.py <project_root> <workdir>
  <workdir>/crop/*.png   white-background crops   (crop_sources.py)
  <workdir>/isnet/*.png  ISNet medium mattes      (scratchpad bgnode/rmbg.mjs medium …)
Writes assets_prep/moonky/ads/<NAME>.png + _meta.json.

Methods
  white_unmix  : velkaryba_ad/cut.py cutout3 (ISNet trimap + colour unmixing against the paper white, no halos),
                 holes disabled (soft lures have no through-holes, so white specular highlights inside the body stay
                 opaque), optional morphological close of the solid core (fills edge notches made by highlights on
                 glossy black bodies).
  shop_alpha_hf: shop PNG alpha (moonky.cz) upscaled ×4 to the Higgsfield 4k image and re-fitted to it with a local
                 F/B unmix in a thin band (the upscaler drops alpha and returns the grey studio photo under it).
  shop_alpha   : shop PNG alpha as is, edge colour decontaminated (grey studio fringe → nearest body colour).
"""
import sys, json, os, importlib.util
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance
from scipy import ndimage as ndi

ROOT, WD = sys.argv[1], sys.argv[2]
OUT = f'{ROOT}/assets_prep/moonky/ads'
spec = importlib.util.spec_from_file_location('vcut', f'{ROOT}/scripts/assets_prep/velkaryba_ad/cut.py')
vcut = importlib.util.module_from_spec(spec); spec.loader.exec_module(vcut)
crop_meta = json.load(open(f'{WD}/crop/_meta.json'))

SHOP = 'https://cdn.myshoptet.com/usr/www.moonky.cz/user/shop/orig/'
ITEMS = [
    # name, method, source key/file, product, url, opts
    ('H1_gamer_big_dc03_brown_orange', 'shop_alpha_hf',
     dict(rgb='assets_prep/moonky/ads/_src/hf4k_gamer_big_dc03.png', alpha='assets_prep/moonky/ads/_src/w289_gamer_big_dc03_brown_orange.png'),
     'Gamer Big 46mm DC03 Brown Metalic / Orange Fluo', SHOP + '289_gamer-big-brown-orange.png', dict(maxlong=2400)),
    ('H2_savory_c06_green', 'white_unmix', 'savory_c06_green', 'Savory 43mm C06 Green',
     SHOP + '2083_gumova-nastraha-moonky-savory-43mm-c06-green-olihen-12ks-.png', dict(maxlong=2400)),
    ('H3_coccon_jr_c04_black', 'white_unmix', 'coccon_jr_c04_black', 'Coccon Jr. 34mm C04 Black',
     SHOP + '2437_gumova-nastraha-moonky-coccon-jr--34mm-c04-black-olihen-10ks-.png', dict(maxlong=2400, sat=1.0, ghost='auto', smooth_r=7,
          erase_thin=[(1880, 1120, 2268, 1330, 16), (60, 430, 560, 560, 10)])),
    ('S1_savory_c01_pink_bubblegum', 'white_unmix', 'savory_c01_pink', 'Savory 43mm C01 Pink Bubblegum',
     SHOP + '2032_gumova-nastraha-moonky-savory-43mm-c01-pink-bubblegum-cheese--12ks-.png', dict(maxlong=2000, ghost='auto', smooth_r=4)),
    ('S2_savory_c02_orange_fluo', 'white_unmix', 'savory_c02_orange_fluo', 'Savory 43mm C02 Orange fluo',
     SHOP + '2038_gumova-nastraha-moonky-savory-43mm-c02-orange-fluo-banana-12ks-.png', dict(maxlong=2000)),
    ('S3_savory_c03_brown_metalic', 'white_unmix', 'savory_c03_brown_metalic', 'Savory 43mm C03 Brown metalic',
     SHOP + '2047_gumova-nastraha-moonky-savory-43mm-c03-brown-metalic-banana-12ks-.png', dict(maxlong=2000)),
    ('S4_savory_c04_black', 'white_unmix', 'savory_c04_black', 'Savory 43mm C04 Black',
     SHOP + '2059_gumova-nastraha-moonky-savory-43mm-c04-black-banana-12ks-.png', dict(maxlong=2000, sat=1.0)),
    ('S5_savory_dc03_brown_orange', 'white_unmix', 'savory_dc03_brown_orange', 'Savory 43mm DC03 Brown metalic / Orange fluo',
     SHOP + '2146_gumova-nastraha-moonky-savory-43mm-dc-03-brown-metalic-orange-fluo-cheese-12ks-.png', dict(maxlong=2000)),
    ('S6_scelet_c01_pink_bubblegum', 'white_unmix', 'scelet_c01_pink', 'Scelet C01 Pink Bubblegum',
     SHOP + '1831_gumova-nastraha-moonky-scelet-c01-pink-bubblegum-banana-8ks-.jpg', dict(maxlong=2000, erase_thin=[(500, 280, 600, 360, 9)])),
    ('S7_coccon_dc04_yellow_orange', 'white_unmix', 'coccon_dc04_yellow_orange', 'Coccon 42mm DC04 Yellow / Orange fluo',
     SHOP + '2305_dc04.jpg', dict(maxlong=2000)),
    ('S8_scelet_jr_c08_coffee_milk', 'white_unmix', 'scelet_jr_c08_coffee_milk', 'Scelet Jr. C08 Coffee milk',
     SHOP + '1996_gumova-nastraha-moonky-scelet-jr--c08-coffee-milk-banana-12ks-.jpg', dict(maxlong=2000)),
    ('S9_coccon_c02_orange_fluo', 'white_unmix', 'coccon_c02_orange_fluo', 'Coccon 42mm C02 Orange fluo',
     SHOP + '2188_gumova-nastraha-moonky-coccon-42mm-c02-orange-fluo-banana-8ks-.jpg', dict(maxlong=2000)),
    ('S10_master_c05_white', 'white_unmix', 'master_c05_white', 'Master C05 White',
     SHOP + '2521_master-bila.png', dict(maxlong=2000, white_body=True, sat=1.0, ghost='dark_on_white', smooth_r=6)),
    ('S11_gamer_big_c01_pink_bubblegum', 'shop_alpha',
     dict(alpha='assets_prep/moonky/ads/_src/w223_gamer_big_c01_pink.png'), 'Gamer Big 46mm C01 Pink Bubblegum',
     SHOP + '223_gamer-big-pink.png', dict(maxlong=2000)),
    ('S12_gradient_blue_pink', 'shop_alpha', dict(alpha='assets/moonky/p10_gumove_nastrahy_category.png'),
     'Moonky soft lure (category image /gumove-nastrahy/, blue → pink, model not named)',
     'https://www.moonky.cz/user/categories/orig/gumove_nastrahy_moonky.png', dict(maxlong=2000, erode=1)),
]


def decontaminate(rgb, alpha, band_px=3):
    """Edge pixels (alpha<1) take the colour of the nearest solid body pixel (kills grey/white studio fringe)."""
    solid = alpha > 0.97
    solid_core = ndi.binary_erosion(solid, iterations=1)
    _, (iy, ix) = ndi.distance_transform_edt(~solid_core, return_indices=True)
    F = rgb[iy, ix]
    w = np.clip((alpha - 0.5) / 0.47, 0, 1)[..., None] * 0.5
    edge = (alpha < 0.97)[..., None]
    return np.where(edge, w * rgb + (1 - w) * F, rgb)


def fb_unmix(img, alpha0, band=10):
    """Re-fit a soft alpha to img inside a band around alpha0's edge: alpha = proj(I-B, F-B)."""
    fg = alpha0 > 0.9
    bg = alpha0 < 0.1
    fg_core = ndi.binary_erosion(fg, iterations=band // 2)
    bg_core = ndi.binary_erosion(bg, iterations=band // 2)
    _, (fy, fx) = ndi.distance_transform_edt(~fg_core, return_indices=True)
    _, (by, bx) = ndi.distance_transform_edt(~bg_core, return_indices=True)
    F = ndi.uniform_filter(img[fy, fx], size=(3, 3, 1)); B = ndi.uniform_filter(img[by, bx], size=(9, 9, 1))
    v = F - B; c = img - B
    vv = np.sum(v * v, 2)
    a = np.clip(np.sum(c * v, 2) / np.maximum(vv, 1e-3), 0, 1)
    a = np.where(vv > 35 ** 2, a, alpha0)
    unknown = ~fg_core & ~bg_core
    out = np.where(fg_core, 1.0, np.where(bg_core, 0.0, a))
    # never grow far beyond the shop silhouette, never eat deep into it
    out = np.minimum(out, np.clip(ndi.gaussian_filter(alpha0, 2.0) * 1.6, 0, 1))
    out = np.maximum(out, np.clip((alpha0 - 0.5) * 2.5, 0, 1) * (alpha0 > 0.95))
    return out, F, unknown


def disk(r):
    yy, xx = np.mgrid[-r:r + 1, -r:r + 1]
    return (xx ** 2 + yy ** 2) <= r * r


def underside_ghost(img, al, o, d=40):
    """Remove the table reflection / contact shadow that ISNet glued to the underside of the lure.
    A ghost pixel is unlike the body (coloured body: pale and low-chroma; black body: much lighter; white body: darker),
    has background within d px straight below it, and belongs to a patch that touches the background."""
    solid = al > 0.5
    L = img @ np.array([0.299, 0.587, 0.114], np.float32)
    C = img.max(2) - img.min(2)
    core = ndi.binary_erosion(solid, iterations=10)
    Lm, Cm = np.median(L[core]), np.median(C[core])
    kind = o.get('ghost')
    if kind == 'dark_on_white':
        cand = L < Lm - o.get('ghost_dl', 22)
    elif Lm < 70:                          # black body
        cand = L > Lm + o.get('ghost_dl', 60)
    else:                                  # coloured body
        cand = (C < o.get('ghost_c', 0.6) * Cm) & (L > Lm)
    outside = ~solid
    below = np.zeros_like(solid)
    for k in range(1, d + 1):
        below[:-k] |= outside[k:]
    cand &= solid & below
    lab, n = ndi.label(cand)
    if not n:
        return al, 0
    touch = np.unique(lab[ndi.binary_dilation(outside, iterations=1) & cand])
    touch = touch[touch > 0]
    ghost = np.isin(lab, touch)
    ghost = ndi.binary_dilation(ghost, iterations=1) & solid
    al2 = np.where(ghost, 0.0, al)
    # smooth the new underside contour: opening + closing of the solid mask near the removed ghost, then anti-alias
    R = ndi.binary_dilation(ghost, iterations=14)
    sol = al2 > 0.5
    r = o.get('ghost_open', 4)
    sol_s = ndi.binary_closing(ndi.binary_opening(sol, structure=disk(r)), structure=disk(2))
    sm = np.clip(ndi.gaussian_filter(sol_s.astype(np.float32), 1.0), 0, 1)
    al2 = np.where(R, np.where(sol_s & (al2 > 0.97), 1.0, np.minimum(sm, np.maximum(al2, sm * (sol_s)))), al2)
    al2 = np.where(R & ~ndi.binary_dilation(sol_s, iterations=2), 0.0, al2)
    return al2, int(ghost.sum())


def edge_guard(img, al, o):
    """Clean the silhouette of a white-packshot cut-out (img = source crop, float RGB; al = alpha 0..1).
    1. hairlines / fibres: binary opening (radius open_r) of the solid mask, alpha limited to its neighbourhood.
    2. contact shadow & table reflection on coloured bodies: in the edge band a true edge pixel is a mix of the body
       colour F and paper white; a shadow pixel is not (high unmix residual) → alpha down.
    3. light rim on dark/coloured bodies (white table reflected in the glossy underside): pixels much lighter than
       the body 8 px inside → alpha by unmix against white with that body colour.
    4. dark rim on the white lure (grey contact shadow): pixels darker than the body → alpha down.
    """
    info = {}
    white = np.array([255, 255, 255], np.float32)
    if o.get('ghost'):
        al, info['ghost_px'] = underside_ghost(img, al, o)
    solid = al > 0.5
    r = o.get('open_r', 3)
    if r:
        op = ndi.binary_opening(solid, structure=disk(r))
        lab, n = ndi.label(op)
        if n > 1:   # keep the main body only
            sizes = ndi.sum(np.ones_like(al), lab, np.arange(1, n + 1))
            op = lab == (1 + int(np.argmax(sizes)))
        keep = ndi.binary_dilation(op, structure=disk(r + 1))
        info['opened_px'] = int((solid & ~keep).sum())
        al = al * ndi.gaussian_filter(keep.astype(np.float32), 0.7)
        solid = al > 0.5
    # body colour F: nearest pixel ≥ 8 px inside the silhouette
    dist_in = ndi.distance_transform_edt(solid)
    core = dist_in >= o.get('core_px', 8)
    _, (iy, ix) = ndi.distance_transform_edt(~core, return_indices=True)
    F = ndi.uniform_filter(img, size=(5, 5, 1))[iy, ix]
    band = (al > 0.003) & (dist_in < o.get('core_px', 8))
    c = white - img; v = white - F
    vv = np.maximum(np.sum(v * v, 2), 1e-3)
    a_un = np.clip(np.sum(c * v, 2) / vv, 0, 1)
    L = img @ np.array([0.299, 0.587, 0.114], np.float32)
    LF = F @ np.array([0.299, 0.587, 0.114], np.float32)
    if o.get('shadow_kill', True) and not o.get('white_body'):
        res = c - a_un[..., None] * v
        ratio = np.sqrt(np.sum(res * res, 2)) / np.maximum(np.sqrt(np.sum(c * c, 2)), 1.0)
        chroma_F = F.max(2) - F.min(2)
        k = np.clip(1 - (ratio - 0.22) / 0.25, 0, 1)
        k = np.where(chroma_F > 45, k, 1.0)           # only meaningful for coloured bodies
        hit = band & (k < 0.999)
        info['shadow_px'] = int((band & (k < 0.5)).sum())
        al = np.where(hit, al * k, al)
    if o.get('rim', True) and not o.get('white_body'):
        lighter = L - LF
        k = np.where(lighter > 45, np.minimum(a_un * 1.15, 1.0), 1.0)
        hit = band & (k < 0.999)
        info['rim_px'] = int((band & (k < 0.5)).sum())
        al = np.where(hit, np.minimum(al, k), al)
    if o.get('white_body'):
        darker = LF - L
        k = np.clip(1 - (darker - 18) / 30, 0, 1)
        hit = band & (k < 0.999) & (dist_in < 5)
        info['dark_rim_px'] = int((hit & (k < 0.5)).sum())
        al = np.where(hit, al * k, al)
    if o.get('smooth_r'):
        # remove thin protrusions (shadow lip, ragged sprue flash, specks) along the whole contour; never adds pixels
        sol_s = ndi.binary_opening(al > 0.5, structure=disk(o['smooth_r']))
        feather = np.clip(ndi.gaussian_filter(sol_s.astype(np.float32), 0.9) * 1.15, 0, 1)
        info['smoothed_px'] = int(((al > 0.5) & ~sol_s).sum())
        al = np.minimum(al, np.where(ndi.binary_erosion(sol_s, iterations=2), 1.0, feather))
    al = np.where(al < 0.03, 0.0, al)
    # alpha must not have holes/specks: keep the main component, smooth the boundary by 0.6 px
    sol = al > 0.5
    lab, n = ndi.label(sol)
    if n > 1:
        sizes = ndi.sum(np.ones_like(al), lab, np.arange(1, n + 1))
        main = lab == (1 + int(np.argmax(sizes)))
        al = np.where(sol & ~main, 0.0, al)
    al = np.where(ndi.binary_fill_holes(al > 0.5) & (al < 0.5), 1.0, al)   # interior stays opaque
    info['_F'] = F; info['_band'] = band
    return np.clip(al, 0, 1), info


def grade(rgba, sat=1.05, sharpen=True):
    im = Image.fromarray(rgba, 'RGBA')
    rgb, a = im.convert('RGB'), im.getchannel('A')
    if sat != 1.0:
        rgb = ImageEnhance.Color(rgb).enhance(sat)
    if sharpen:
        rgb = rgb.filter(ImageFilter.UnsharpMask(radius=1.4, percent=55, threshold=2))
    out = rgb.convert('RGBA'); out.putalpha(a)
    return out


def finish(im, maxlong, pad_frac=0.03):
    a = np.asarray(im)[..., 3]
    ys, xs = np.where(a > 8)
    c = im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    k = min(1.0, maxlong / max(c.size))
    if k < 1:
        c = c.resize((round(c.width * k), round(c.height * k)), Image.LANCZOS)
    p = round(pad_frac * max(c.size))
    out = Image.new('RGBA', (c.width + 2 * p, c.height + 2 * p), (0, 0, 0, 0))
    out.paste(c, (p, p))
    return out, p


def describe(im):
    a = np.asarray(im).astype(np.float32)
    al = a[..., 3] / 255
    ys, xs = np.where(al > 0.5)
    W, H = im.size
    bbox = [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1]
    pad = [round(bbox[0] / W, 3), round(bbox[1] / H, 3), round((W - bbox[2]) / W, 3), round((H - bbox[3]) / H, 3)]
    px = a[..., :3][al > 0.9]
    rng = np.random.default_rng(7)
    smp = px[rng.choice(len(px), min(6000, len(px)), replace=False)]
    cent = smp[rng.choice(len(smp), 3, replace=False)]
    for _ in range(25):
        lab = np.argmin(((smp[:, None] - cent[None]) ** 2).sum(2), 1)
        cent = np.array([smp[lab == i].mean(0) if (lab == i).any() else cent[i] for i in range(3)])
    share = np.bincount(lab, minlength=3) / len(lab)
    order = np.argsort(-share)
    dom = [dict(hex='#%02x%02x%02x' % tuple(int(v) for v in cent[i]), share=round(float(share[i]), 3)) for i in order]
    lum = ndi.gaussian_filter((a[..., :3] @ np.array([0.299, 0.587, 0.114])) * (al > 0.95), 4)
    gy, gx = np.unravel_index(np.argmax(lum), lum.shape)
    return dict(size=[W, H], bbox=bbox, pad=pad, aspect=round((bbox[2] - bbox[0]) / (bbox[3] - bbox[1]), 3),
                dominant=dom, glint=[round(gx / W, 3), round(gy / H, 3)])


meta = {}
only = set(sys.argv[3:])
for name, method, src, product, url, o in ITEMS:
    if only and name not in only:
        continue
    if method == 'white_unmix':
        crop = np.asarray(Image.open(f'{WD}/crop/{src}.png').convert('RGB'))
        isn = np.asarray(Image.open(f'{WD}/isnet/{src}.png').convert('RGBA'))[..., 3]
        kw = dict(hole_min=10 ** 9)
        if o.get('white_body'):
            # white lure on white paper: trust ISNet more, darkness seed low
            kw.update(fg_isnet=0.7, dark_seed=28, bg_dark_max=10)
        im, info = vcut.cutout3(crop, isn, **kw)
        a = np.asarray(im).astype(np.float32)
        al = a[..., 3] / 255
        if o.get('close'):
            r = o['close']
            yy, xx = np.mgrid[-r:r + 1, -r:r + 1]
            disk = (xx ** 2 + yy ** 2) <= r * r
            solid = ndi.binary_fill_holes(ndi.binary_closing(np.pad(al > 0.5, r), structure=disk))[r:-r, r:-r]
            filled = solid & (al < 0.98)
            # filled notch pixels take the nearest body colour (blur of neighbours) and become opaque
            body = al > 0.98
            _, (iy, ix) = ndi.distance_transform_edt(~body, return_indices=True)
            a[..., :3] = np.where(filled[..., None], crop.astype(np.float32), a[..., :3])   # keep the real highlight pixels
            al = np.where(filled, 1.0, al)
            info['closed_px'] = int(filled.sum())
        al, gi = edge_guard(crop.astype(np.float32), al, o)
        Fb, band = gi.pop('_F'), gi.pop('_band')
        if not o.get('white_body'):
            # edge pixels that stay semi-transparent take the body colour (no light/grey line along the contour)
            wF = (band & (al < 0.95))[..., None]
            a[..., :3] = np.where(wF, Fb * 0.75 + a[..., :3] * 0.25, a[..., :3])
        info.update(gi)
        a[..., 3] = al * 255
        rgba = a.round().clip(0, 255).astype(np.uint8)
        srcdesc = crop_meta[src]['src']
    elif method == 'shop_alpha_hf':
        hf = np.asarray(Image.open(f"{ROOT}/{src['rgb']}").convert('RGB')).astype(np.float32)
        sa = Image.open(f"{ROOT}/{src['alpha']}").getchannel('A')
        k = hf.shape[1] / sa.width
        a0 = np.asarray(sa.resize((hf.shape[1], hf.shape[0]), Image.LANCZOS)).astype(np.float32) / 255
        a0 = np.clip(a0, 0, 1)
        al, F, unknown = fb_unmix(hf, a0, band=int(3 * k))
        col = np.where((al < 0.98)[..., None], F * 0.65 + hf * 0.35, hf)
        rgba = np.dstack([col, al * 255]).round().clip(0, 255).astype(np.uint8)
        info = dict(scale=round(k, 3))
        srcdesc = f"{src['rgb']} (Higgsfield 4k of {url}) + alpha {src['alpha']}"
    elif method == 'shop_alpha':
        s = np.asarray(Image.open(f"{ROOT}/{src['alpha']}").convert('RGBA')).astype(np.float32)
        al = s[..., 3] / 255
        if o.get('erode'):
            al = np.clip(ndi.grey_erosion(al, size=(2 * o['erode'] + 1,) * 2) * 0.5 + al * 0.5, 0, 1)
            al = np.where(al < 0.04, 0, al)
        col = decontaminate(s[..., :3], al)
        rgba = np.dstack([col, al * 255]).round().clip(0, 255).astype(np.uint8)
        info = {}
        srcdesc = src['alpha']
    im = grade(rgba, sat=o.get('sat', 1.05))
    im, p = finish(im, o.get('maxlong', 2000))
    for (x0, y0, x1, y1, r) in o.get('erase_thin', []):
        # inside the box keep only what survives a binary opening of radius r (removes fibres / hairs)
        A = np.asarray(im).copy()
        al_ = A[..., 3] > 127
        op = ndi.binary_dilation(ndi.binary_opening(al_, structure=disk(r)), structure=disk(1))
        box = np.zeros_like(al_); box[y0:y1, x0:x1] = True
        kill = box & ~op
        fe = np.clip(ndi.gaussian_filter(op.astype(np.float32), 0.9) * 1.1, 0, 1) * 255
        A[..., 3] = np.where(box, np.minimum(A[..., 3], fe), A[..., 3]).astype(np.uint8)
        A[..., 3] = np.where(kill, 0, A[..., 3])
        info['erased_px'] = info.get('erased_px', 0) + int((kill & al_).sum())
        im = Image.fromarray(A, 'RGBA')
    im.save(f'{OUT}/{name}.png', optimize=True)
    d = describe(im)
    meta[name] = dict(product=product, role='hero' if name.startswith('H') else 'secondary', file=f'assets_prep/moonky/ads/{name}.png',
                      source=srcdesc, source_url=url, method=method, info=info, **d)
    print(name, d['size'], info)

mp = f'{OUT}/_meta.json'
old = json.load(open(mp)) if os.path.exists(mp) and only else {}
old.update(meta)
json.dump(old, open(mp, 'w'), indent=1, ensure_ascii=False)
