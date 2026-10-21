"""Brand logos for Bosset and Velká ryba (MČR 2026, film v3, task 'brands B').

Input:  assets/<key>/brands/<slug>.png  (raw files as the shop serves them, fetched 21. 10. 2026
        through the bridge: Drive upload of images.weserv.nl/?url=...&output=png&l=0, lossless PNG)
Output: assets_prep/<key>/brands/<slug>.png          transparent, original colours (light backgrounds)
        assets_prep/<key>/brands/<slug>_on_dark.png  dark neutrals lifted / inverted (dark backgrounds)
        assets_prep/<key>/brands/manifest.json, _sheet.jpg (QA on white / brand dark / black)

Run: python3 -I scripts/assets_prep/brands_b/prep_brands.py
"""
from __future__ import annotations

import json
import os

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi

PROJ = '/home/user/Clipcreator/projects/mcr-2026-sponzori'

# slug -> (display name, on_dark mode, raw logo URL, brand page on the shop, items on the shop, note)
#  on_dark: 'lift'   dark neutrals -> light (black text -> white), colours kept
#           'invert' all neutrals inverted (black outline <-> white fill)
#           'keep'   logo is a coloured badge / bright colour: unchanged
#           'chip'   badge with white details (keyed to holes) -> original on a white rounded chip, like the shop's tile
BOSSET = {
    'keitech':    ('Keitech', 'lift', 'https://cdn.myshoptet.com/usr/www.bosset.cz/user/categories/orig/znacky_keitech.png', 'https://www.bosset.cz/keitech/', 1450, 'oficiální distributor pro ČR'),
    'ygk':        ('YGK X-Braid', 'lift', 'https://cdn.myshoptet.com/usr/www.bosset.cz/user/categories/orig/ygk_x-braid1.jpg', 'https://www.bosset.cz/x-braid-ygk/', 97, 'oficiální distributor pro ČR; filtr: YGK X-Braid 78 + YGK 19'),
    'zojirushi':  ('Zojirushi', 'chip', 'https://cdn.myshoptet.com/usr/www.bosset.cz/user/categories/orig/vrnt2819_896.jpg', 'https://www.bosset.cz/zojirushi/', 215, 'source is 285×71 px; file = 3× Lanczos (weserv w=855) — use ≤ 570 px wide; blue on dark is weak -> light chip'),
    'select':     ('Select', 'lift', 'https://cdn.myshoptet.com/usr/www.bosset.cz/user/categories/orig/selectjpg11.jpg', 'https://www.bosset.cz/select/', 2323, 'Select Tackles'),
    'freshlures': ('Fresh Lures', 'chip', 'https://cdn.myshoptet.com/usr/www.bosset.cz/user/categories/orig/fresh_lures_logo1.png', 'https://www.bosset.cz/-fresh-lures/', 363, 'round badge'),
    'decoy':      ('Decoy', 'lift', 'https://cdn.myshoptet.com/usr/www.bosset.cz/user/categories/orig/decoy1.png', 'https://www.bosset.cz/decoy/', 248, ''),
    'zipbaits':   ('ZipBaits', 'lift', 'https://cdn.myshoptet.com/usr/www.bosset.cz/user/categories/orig/zipbaits_logo.png', 'https://www.bosset.cz/zipbaits/', 156, 'JDM wobblers'),
    'megabass':   ('Megabass', 'keep', 'https://cdn.myshoptet.com/usr/www.bosset.cz/user/categories/orig/megabass_logo1.png', 'https://www.bosset.cz/megabass/', 85, 'JDM wobblers'),
    'osp':        ('O.S.P', 'lift', 'https://cdn.myshoptet.com/usr/www.bosset.cz/user/categories/orig/osp_logo.png', 'https://www.bosset.cz/osp/', 58, 'JDM wobblers'),
    'reins':      ('Reins', 'keep', 'https://cdn.myshoptet.com/usr/www.bosset.cz/user/categories/orig/reins_logo.png', 'https://www.bosset.cz/reins/', 64, 'soft baits'),
    'bassday':    ('Bassday', 'lift', 'https://cdn.myshoptet.com/usr/www.bosset.cz/user/categories/orig/bassday_logo.png', 'https://www.bosset.cz/bassday/', 3, ''),
    'brain':      ('Brain', 'lift', 'https://cdn.myshoptet.com/usr/www.bosset.cz/user/categories/orig/brain_logo.png', 'https://www.bosset.cz/brain/', 769, 'carp / feeder gear, not spinning'),
    'xfish':      ('X-Fish', 'lift', 'https://cdn.myshoptet.com/usr/www.bosset.cz/user/categories/orig/x_fish_logo_woby_znacka.png', 'https://www.bosset.cz/x-fish/', 418, ''),
}
VR = {
    'shimano':    ('Shimano', 'keep', 'https://www.velka-ryba.cz/img/m/18.jpg', 'https://www.velka-ryba.cz/cs/18_shimano', 555, 'Shimano Rod Test Center partner'),
    'rapala':     ('Rapala', 'lift', 'https://www.velka-ryba.cz/img/m/7.jpg', 'https://www.velka-ryba.cz/cs/7_rapala', 589, ''),
    'illex':      ('Illex', 'keep', 'https://www.velka-ryba.cz/img/m/16.jpg', 'https://www.velka-ryba.cz/cs/16_illex', 359, 'navy badge'),
    '3stan':      ('3Stan Lures', 'keep', 'https://www.velka-ryba.cz/img/m/124.jpg', 'https://www.velka-ryba.cz/cs/124_3stan-lures', 375, 'brown badge'),
    'savagegear': ('Savage Gear', 'lift', 'https://www.velka-ryba.cz/img/m/78.jpg', 'https://www.velka-ryba.cz/cs/78_savage-gear', 358, ''),
    'westin':     ('Westin', 'lift', 'https://www.velka-ryba.cz/img/m/105.jpg', 'https://www.velka-ryba.cz/cs/105_westin', 345, ''),
    'foxrage':    ('Fox Rage', 'invert', 'https://www.velka-ryba.cz/img/m/92.jpg', 'https://www.velka-ryba.cz/cs/92_fox-rage', 262, ''),
    'keitech':    ('Keitech', 'lift', 'https://www.velka-ryba.cz/img/m/133.jpg', 'https://www.velka-ryba.cz/cs/133_keitech', 231, ''),
    'salmo':      ('Salmo', 'invert', 'https://www.velka-ryba.cz/img/m/38.jpg', 'https://www.velka-ryba.cz/cs/38_salmo', 184, ''),
    'mepps':      ('Mepps', 'keep', 'https://www.velka-ryba.cz/img/m/9.jpg', 'https://www.velka-ryba.cz/cs/9_mepps', 167, ''),
    'berkley':    ('Berkley', 'keep', 'https://www.velka-ryba.cz/img/m/10.jpg', 'https://www.velka-ryba.cz/cs/10_berkley', 148, ''),
    'libralures': ('Libra Lures', 'lift', 'https://www.velka-ryba.cz/img/m/153.jpg', 'https://www.velka-ryba.cz/cs/153_libra-lures', 148, 'Turbo Worm: made at the request of Trout Area anglers (velkaryba.md #7)'),
    'luckyjohn':  ('Lucky John', 'keep', 'https://www.velka-ryba.cz/img/m/104.jpg', 'https://www.velka-ryba.cz/cs/104_lucky-john', 46, 'red badge'),
    'daiwa':      ('Daiwa', 'lift', 'https://www.velka-ryba.cz/img/m/21.jpg', 'https://www.velka-ryba.cz/cs/21_daiwa', 15, 'D-Vec mark only (no wordmark)'),
    'gloomis':    ('G. Loomis', 'lift', 'https://www.velka-ryba.cz/img/m/162.jpg', 'https://www.velka-ryba.cz/cs/162_g-loomis', 19, 'premium rods'),
    'majorcraft': ('Major Craft', 'lift', 'https://www.velka-ryba.cz/img/m/106.jpg', 'https://www.velka-ryba.cz/cs/106_major-craft', 21, ''),
}
DARK = {'bosset': '#0A4A58', 'velkaryba': '#0F2541'}


def white_key(rgb: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """Logo on paper white -> straight RGBA. Core = clearly not white; the anti-aliased rim gets alpha by
    projecting (white - c) onto (white - nearest core colour), so the rim keeps the logo colour (no white halo)."""
    c = rgb.astype(np.float64)
    d = 255.0 - c.min(2)
    core = d > 50
    bg = d < 10
    _, (iy, ix) = ndi.distance_transform_edt(~core, return_indices=True)
    dist = ndi.distance_transform_edt(~core)
    F = c[iy, ix]
    num = ((255 - c) * (255 - F)).sum(2)
    den = ((255 - F) ** 2).sum(2) + 1e-6
    a = np.clip(num / den, 0, 1)
    col = F.copy()
    far = (~core) & (~bg) & (dist > 3)          # faint isolated detail: own colour, alpha from distance to white
    af = np.clip(d / 50.0, 0, 1)
    a = np.where(far, af, a)
    safe = np.maximum(af, 1e-3)[..., None]
    col = np.where(far[..., None], np.clip(255 - (255 - c) / safe, 0, 255), col)
    a[core] = 1.0
    col[core] = c[core]
    a[bg] = 0.0
    return np.clip(col, 0, 255), a


def chip(rgba: np.ndarray) -> np.ndarray:
    h, w = rgba.shape[:2]
    p = int(round(0.14 * h))
    W, H = w + 2 * p, h + 2 * p
    plate = Image.new('RGBA', (W * 4, H * 4), (0, 0, 0, 0))
    ImageDraw.Draw(plate).rounded_rectangle([0, 0, W * 4 - 1, H * 4 - 1], radius=int(0.2 * H * 4), fill=(255, 255, 255, 255))
    plate = plate.resize((W, H), Image.Resampling.LANCZOS)
    plate.alpha_composite(Image.fromarray(rgba), (p, p))
    return np.array(plate)


def on_dark(rgba: np.ndarray, mode: str) -> np.ndarray:
    if mode == 'keep':
        return rgba.copy()
    if mode == 'chip':
        return chip(rgba)
    rgb = rgba[..., :3].astype(np.float64)
    chroma = rgb.max(2) - rgb.min(2)
    L = rgb.mean(2)
    if mode == 'lift':
        nl = np.maximum(L, 255 - L)
    else:  # invert
        nl = 255 - L
    w = np.clip((48 - chroma) / 24.0, 0, 1)[..., None]   # 1 = neutral
    new = rgb + (nl - L)[..., None]
    out = rgba.copy().astype(np.float64)
    out[..., :3] = rgb * (1 - w) + np.clip(new, 0, 255) * w
    return np.clip(out, 0, 255).astype(np.uint8)


def trim(rgba: np.ndarray, pad_frac=0.03) -> np.ndarray:
    a = rgba[..., 3]
    ys, xs = np.where(a > 5)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    p = int(round(max(y1 - y0, x1 - x0) * pad_frac))
    out = np.zeros((y1 - y0 + 2 * p, x1 - x0 + 2 * p, 4), np.uint8)
    out[p:p + y1 - y0, p:p + x1 - x0] = rgba[y0:y1, x0:x1]
    return out


def load(path: str) -> np.ndarray:
    im = Image.open(path)
    a = np.array(im.convert('RGBA'))
    if (a[..., 3] < 128).mean() > 0.05:          # shop already serves transparency
        return a
    col, al = white_key(a[..., :3])
    return np.dstack([col, al * 255]).round().astype(np.uint8)


def sheet(key: str, items: list[tuple[str, np.ndarray, np.ndarray]], dst: str):
    cw, ch = 300, 150
    bgs = [((255, 255, 255), 'light'), (tuple(int(DARK[key][i:i + 2], 16) for i in (1, 3, 5)), 'dark'), ((0, 0, 0), 'dark')]
    W = cw * 3
    H = (ch + 18) * len(items)
    S = Image.new('RGB', (W, H), (90, 90, 90))
    d = ImageDraw.Draw(S)
    for r, (slug, lt, dk) in enumerate(items):
        for c, (bgc, kind) in enumerate(bgs):
            tile = Image.new('RGBA', (cw, ch), bgc + (255,))
            im = Image.fromarray(lt if kind == 'light' else dk)
            im.thumbnail((cw - 30, ch - 30), Image.Resampling.LANCZOS)
            tile.alpha_composite(im, ((cw - im.width) // 2, (ch - im.height) // 2))
            S.paste(tile.convert('RGB'), (c * cw, r * (ch + 18)))
        d.text((4, r * (ch + 18) + ch + 3), f'{slug}  (light | {DARK[key]} | black)', fill=(255, 255, 255))
    S.save(dst, quality=88)


def run(key: str, table: dict):
    src_dir = f'{PROJ}/assets/{key}/brands'
    out_dir = f'{PROJ}/assets_prep/{key}/brands'
    os.makedirs(out_dir, exist_ok=True)
    man = {'sponsor': key, 'generated': '2026-10-21',
           'note': 'Third-party brands sold by the shop (logos as shown on the shop site). Never present them as the sponsor\'s own. '
                   '<slug>.png = transparent, original colours (light bg); <slug>_on_dark.png = dark neutrals lifted/inverted. '
                   'Do not upscale beyond native width (field size).',
           'brands': []}
    items = []
    for slug, (name, mode, url, page, n, note) in table.items():
        fn = 'zojirushi_x3.png' if slug == 'zojirushi' else f'{slug}.png'
        rgba = trim(load(f'{src_dir}/{fn}'))
        dk = on_dark(rgba, mode)
        Image.fromarray(rgba).save(f'{out_dir}/{slug}.png', optimize=True)
        Image.fromarray(dk).save(f'{out_dir}/{slug}_on_dark.png', optimize=True)
        items.append((slug, rgba, dk))
        man['brands'].append({'slug': slug, 'name': name, 'file': f'assets_prep/{key}/brands/{slug}.png',
                              'file_on_dark': f'assets_prep/{key}/brands/{slug}_on_dark.png', 'on_dark_mode': mode,
                              'size': [int(rgba.shape[1]), int(rgba.shape[0])], 'items_on_shop': n,
                              'logo_url': url, 'brand_page': page, 'note': note})
    json.dump(man, open(f'{out_dir}/manifest.json', 'w'), ensure_ascii=False, indent=1)
    sheet(key, items, f'{out_dir}/_sheet.jpg')
    print(key, len(items), 'logos ->', out_dir)


def bosset_extras():
    """Keitech hi-res = the same official wordmark from velka-ryba.cz (2× Bosset's 377 px tile); small-source notes."""
    import shutil
    b, v = f'{PROJ}/assets_prep/bosset/brands', f'{PROJ}/assets_prep/velkaryba/brands'
    shutil.copy(f'{v}/keitech.png', f'{b}/keitech_hires.png')
    shutil.copy(f'{v}/keitech_on_dark.png', f'{b}/keitech_hires_on_dark.png')
    m = json.load(open(f'{b}/manifest.json'))
    for e in m['brands']:
        if e['slug'] == 'keitech':
            e['hires'] = {'file': 'assets_prep/bosset/brands/keitech_hires.png', 'file_on_dark': 'assets_prep/bosset/brands/keitech_hires_on_dark.png',
                          'size': list(Image.open(f'{b}/keitech_hires.png').size), 'logo_url': VR['keitech'][2],
                          'note': 'same official Keitech wordmark as served by velka-ryba.cz (manufacturer logo); use when shown > 377 px wide'}
        if e['slug'] in ('megabass', 'decoy', 'select', 'bassday', 'xfish'):
            e['note'] = (e['note'] + '; ' if e['note'] else '') + f"small source ({e['size'][0]} px wide): show ≤ native width"
    json.dump(m, open(f'{b}/manifest.json', 'w'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    run('bosset', BOSSET)
    run('velkaryba', VR)
    bosset_extras()
