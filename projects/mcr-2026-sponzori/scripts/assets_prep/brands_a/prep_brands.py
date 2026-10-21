"""Brand logos for Troutshop, Activefishing and Jigovky (MČR 2026, film v3, task 'brands A').

Input:  assets/_brands_a_src/<slug>_<source>.png  raw files fetched 21. 10. 2026 through the bridge
        (Zapier Drive upload of images.weserv.nl/?url=...&output=png&l=0 -> lossless PNG; official SVGs
        rasterised by weserv at w=1800/2400, transparent). Libra Lures and Berkley are reused from the
        Velká ryba set (assets_prep/velkaryba/brands, task 'brands B') so the brand looks identical in every block.
Output: assets_prep/<key>/brands/<slug>.png          transparent, original colours (light backgrounds)
        assets_prep/<key>/brands/<slug>_on_dark.png  variant for dark backgrounds
        assets_prep/<key>/brands/manifest.json, _sheet.jpg (QA on white / brand dark / black / TA navy)

Same file contract as scripts/assets_prep/brands_b/prep_brands.py.
Run: python3 -I scripts/assets_prep/brands_a/prep_brands.py
"""
from __future__ import annotations

import json
import os
import shutil

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi

PROJ = '/home/user/Clipcreator/projects/mcr-2026-sponzori'
SRC = f'{PROJ}/assets/_brands_a_src'
DARK = {'troutshop': '#050505', 'activefishing': '#1B1B1B', 'jigovky': '#0A0C0B'}


# ---------------------------------------------------------------- helpers
def rgba(a: np.ndarray) -> Image.Image:
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'RGBA')


def trim(im: Image.Image, pad: int = 6) -> Image.Image:
    a = np.array(im)[..., 3]
    ys, xs = np.where(a > 8)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    im = im.crop((max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1 + pad)))
    return im


def key_white(rgb: np.ndarray, lo: float = 14, hi: float = 70) -> np.ndarray:
    """Logo on white: alpha ramps with the deficit from white (255 - min channel); colour un-mixed from white."""
    rgb = rgb.astype(float)
    d = 255 - rgb.min(axis=2)
    alpha = np.clip((d - lo) / (hi - lo), 0, 1)
    col = 255 - (255 - rgb) / np.maximum(alpha[..., None], 1e-3)   # obs = a*c + (1-a)*255
    return np.dstack([np.clip(col, 0, 255), alpha * 255])


def key_black(rgb: np.ndarray, lo: float = 18, hi: float = 90) -> np.ndarray:
    """Light logo on black: alpha ramps with the max channel; colour un-mixed from black (obs = a*c)."""
    rgb = rgb.astype(float)
    m = rgb.max(axis=2)
    alpha = np.clip((m - lo) / (hi - lo), 0, 1)
    col = rgb / np.maximum(alpha[..., None], 1e-3)
    return np.dstack([np.clip(col, 0, 255), alpha * 255])


def mono(im: Image.Image, color=(255, 255, 255)) -> Image.Image:
    a = np.array(im).astype(float)
    out = np.zeros_like(a)
    out[..., :3] = color
    out[..., 3] = a[..., 3]
    return rgba(out)


def lift(im: Image.Image, thr: float = 90) -> Image.Image:
    """Dark neutrals -> white (black text on a light logo becomes white), colours kept."""
    a = np.array(im).astype(float)
    rgb = a[..., :3]
    sat = rgb.max(axis=2) - rgb.min(axis=2)
    lum = rgb @ [0.299, 0.587, 0.114]
    dark_neutral = (sat < 40) & (lum < thr)
    a[dark_neutral, :3] = 255
    return rgba(a)


def darken(im: Image.Image, thr: float = 150, to=(17, 17, 17)) -> Image.Image:
    """Light neutrals -> near-black (white/grey logo for dark backgrounds becomes usable on light)."""
    a = np.array(im).astype(float)
    rgb = a[..., :3]
    sat = rgb.max(axis=2) - rgb.min(axis=2)
    lum = rgb @ [0.299, 0.587, 0.114]
    m = (sat < 40) & (lum > thr)
    a[m, :3] = to
    return rgba(a)


def white_chip(im: Image.Image, pad: int, round_: bool = False, radius: int = 24) -> Image.Image:
    w, h = im.size
    chip = Image.new('RGBA', (w + 2 * pad, h + 2 * pad), (0, 0, 0, 0))
    d = ImageDraw.Draw(chip)
    if round_:
        d.ellipse((0, 0, chip.width - 1, chip.height - 1), fill=(255, 255, 255, 255))
    else:
        d.rounded_rectangle((0, 0, chip.width - 1, chip.height - 1), radius=radius, fill=(255, 255, 255, 255))
    chip.alpha_composite(im, (pad, pad))
    return chip


def load(name: str) -> np.ndarray:
    return np.array(Image.open(f'{SRC}/{name}').convert('RGBA'))


# ---------------------------------------------------------------- per-brand recipes -> (light, on_dark, mode, note)
def nories():
    a = load('nories_svg1800.png').astype(float)  # official SVG: black letters + light grey keyline, transparent
    light = trim(rgba(a))
    lum = a[..., :3] @ [0.299, 0.587, 0.114]
    letters = (lum < 110).astype(float)
    letters = ndi.gaussian_filter(letters, 0.6)  # soft edge where letter meets keyline
    d = np.zeros_like(a)
    d[..., :3] = 255
    d[..., 3] = a[..., 3] * np.clip(letters * 1.4, 0, 1)
    dark = trim(rgba(d))
    return light, dark, 'letters', 'official SVG (nories.com header). on_dark = letters white, grey keyline dropped'


def valkein():
    a = load('valkein_svg1800.png')  # official SVG: light grey (#ddd) on transparent = dark-bg artwork
    dark = trim(mono(rgba(a), (255, 255, 255)))
    light = trim(mono(rgba(a), (17, 17, 17)))
    return light, dark, 'mono', 'official SVG (valkein.jp header, light grey #DDD on transparent). light = recoloured #111, on_dark = white'


def varivas():
    a = load('varivas_svg2400.png')  # official SVG: VARIVAS blue on transparent
    light = trim(rgba(a))
    dark = trim(mono(rgba(a)))
    return light, dark, 'mono', 'official SVG (varivas.co.jp header, blue #003F98). on_dark = white (blue on dark is weak)'


def mukai():
    rgb = load('mukai_ts960.png')[..., :3].astype(float)  # white 'Mukai' + red 'ism' on black, grey TROUTSHOP.EU watermark
    mx = rgb.max(axis=2)
    alpha = np.clip((mx - 95) / (170 - 95), 0, 1)  # watermark on black (~40-70) drops out
    sat = mx - rgb.min(axis=2)
    red = sat > 90
    col = np.where(red[..., None], rgb / np.maximum(mx[..., None], 1) * 235, 255.0)  # neutrals (incl. watermark over letters) -> pure white
    a = np.dstack([col, alpha * 255])
    # clean: drop specks smaller than 40 px
    lab, n = ndi.label(alpha > 0.5)
    sizes = ndi.sum(np.ones_like(alpha), lab, range(1, n + 1))
    small = np.isin(lab, np.where(sizes < 40)[0] + 1)
    a[small, 3] = 0
    dark = trim(rgba(a))
    light = darken(dark, 150, (17, 17, 17))
    return light, dark, 'keyed', 'troutshop.eu brand tile (black square, baked-in TROUTSHOP.EU watermark removed by key: neutrals forced to pure white). Native 960 px tile, logo ≈ 760 px wide'


def velvetarts():
    rgb = load('velvetarts_ts1241.png')[..., :3]
    a = key_white(rgb)
    a[..., :3] = np.where(a[..., 3:4] > 0, a[..., :3], 0)
    light = trim(rgba(a))
    dark = lift(light, 200)
    dark = mono(dark)  # white artwork, grey horizon line keeps its partial alpha
    return light, trim(dark), 'mono', 'troutshop.eu brand tile 1241 px (white bg keyed). light = black, on_dark = white'


def rodiocraft():
    rgb = load('rodiocraft_ts1200.png')[..., :3].astype(int)
    nonwhite = (255 - rgb.min(axis=2)) > 30
    ys, xs = np.where(nonwhite)
    box = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)
    crop = Image.fromarray(rgb.astype(np.uint8)).crop(box).convert('RGBA')
    return crop, crop.copy(), 'badge', f'troutshop.eu brand tile 1200 px; green/orange bar cropped {box} (opaque badge, works on any bg)'


def yarie():
    im = Image.open(f'{SRC}/yarie_ts394.png').convert('RGBA')  # full green plate is the logo
    return im, im.copy(), 'badge', 'troutshop.eu tile 394×128 (green plate, white YARIE + JESPA CREATIVE FISHING GEAR). Small: use ≤ 400 px wide'


def fishup():
    rgb = load('fishup_ts363.png')[..., :3]
    a = key_white(rgb, 18, 80)
    light = trim(rgba(a))
    dark = lift(light, 110)
    return light, dark, 'lift', 'troutshop.eu tile 363 px (white bg keyed): orange fish + black FISHUP. on_dark = black lettering -> white. Small: ≤ 360 px wide'


def forest():
    rgb = load('forest_hed1.png')[..., :3].astype(float)  # forestjp.com header banner 1080×250, logo top-left on #0C0E09
    crop = rgb[30:190, 40:370]
    bg = np.array([12, 14, 9], float)
    dist = np.sqrt(((crop - bg) ** 2).sum(axis=2))
    m = dist > 40
    lab, n = ndi.label(m)
    sizes = ndi.sum(m, lab, range(1, n + 1))
    keep = lab == (np.argmax(sizes) + 1)  # the oval (green body + white ring/text)
    keep = ndi.binary_fill_holes(keep)
    soft = np.clip((dist - 25) / 40, 0, 1) * keep
    soft = np.maximum(soft, ndi.binary_erosion(keep, iterations=2))
    a = np.dstack([crop, soft * 255])
    im = trim(rgba(a), 4)
    return im, im.copy(), 'badge', 'forestjp.com header banner (hed1.jpg 1080×250): green oval "out door life friend / Forest / FOREST" cut from the dark banner. Native ≈ 290 px wide: use ≤ 300 px'


def vanfook():
    rgb = load('vanfook_ogp.png')[..., :3]  # vanfook.co.jp OGP 1200×630: chrome hook + white VANFOOK on black
    crop = rgb[60:600, 360:860]
    a = key_black(crop, 14, 120)
    dark = trim(rgba(a))
    light = darken(dark, 110, (17, 17, 17))
    return light, dark, 'keyed', 'vanfook.co.jp og:image (1200×630, black bg keyed by luminance): chrome hook + VANFOOK. on_dark is the original look; light = neutrals darkened'


def officeeucalyptus():
    rgb = load('officeeucalyptus_ts300.png')[..., :3]
    a = key_white(rgb, 16, 80)
    light = trim(rgba(a))
    dark = mono(light)
    return light, dark, 'mono', 'troutshop.eu tile 300×300, logo only ≈ 190×75 px (green leaf + text). Very small: use ≤ 200 px wide; on_dark = white'


RECIPES = {f.__name__: f for f in (nories, valkein, varivas, mukai, velvetarts, rodiocraft, yarie, fishup, forest,
                                    vanfook, officeeucalyptus)}
REUSE = {  # slug -> (assets_prep path without suffix, note) — identical asset as in other sponsors' blocks
    'libralures': ('assets_prep/velkaryba/brands/libralures', 'reused from Velká ryba set (source https://www.velka-ryba.cz/img/m/153.jpg, 797 px round badge); same Libra Lures badge as on troutshop.eu (1112223.jpg, 225 px) and activefishing.cz carousel (libra.png)'),
    'berkley': ('assets_prep/velkaryba/brands/berkley', 'reused from Velká ryba set (source https://www.velka-ryba.cz/img/m/10.jpg)'),
    'jigovky': ('assets_prep/jigovky/logo', 'sponsor\'s own logo (assets_prep/jigovky/logo_on_light.png / logo_on_dark.png); Activefishing sells Jigovky.cz jig heads'),
}
SOURCES = {
    'nories': ('Nories', 'https://nories.com/wp/wp-content/themes/nories/images/common/logo.svg'),
    'valkein': ('ValkeIN', 'https://valkein.jp/area-hp/wp-content/themes/itreat_base/dist/img/common/logo.svg'),
    'varivas': ('VARIVAS', 'https://www.varivas.co.jp/bjAhvt/wp-content/themes/swell_child/assets/img/common/logo_header.svg'),
    'mukai': ('Mukai', 'https://troutshop.eu/wp-content/uploads/2024/07/Mukai_logo.jpg'),
    'velvetarts': ('Velvet Arts', 'https://troutshop.eu/wp-content/uploads/2025/02/velvet-arts-logo.jpg'),
    'rodiocraft': ('Rodio Craft', 'https://troutshop.eu/wp-content/uploads/2021/04/RC-1.jpg'),
    'yarie': ('YARIE (Jespa)', 'https://troutshop.eu/wp-content/uploads/2024/05/yarie-logo.jpg'),
    'fishup': ('FishUp', 'https://troutshop.eu/wp-content/uploads/2020/03/fishup.jpg'),
    'forest': ('Forest', 'https://forestjp.com/wp-content/uploads/2018/08/hed1.jpg'),
    'vanfook': ('Vanfook', 'https://vanfook.co.jp/wp/wp-content/uploads/2022/08/ogp.png'),
    'officeeucalyptus': ('Office Eucalyptus', 'https://troutshop.eu/wp-content/uploads/2023/09/300x300-office-eucalyptusjpg.jpg'),
    'libralures': ('Libra Lures', 'https://www.velka-ryba.cz/img/m/153.jpg'),
    'berkley': ('Berkley', 'https://www.velka-ryba.cz/img/m/10.jpg'),
    'jigovky': ('Jigovky.cz', 'https://cdn.myshoptet.com/usr/www.jigovky.cz/user/logos/logoold_-_kopie.png'),
}

# shop -> ordered list of (slug, items_on_shop text, brand page on the shop)
SHOPS = {
    'troutshop': [
        ('nories', 'spoons 897 · wobblers 290 · rods 8', 'https://troutshop.eu/all-shop-products/?filter_brand=nories-en'),
        ('forest', 'spoons 636 · wobblers 91 · spinners', 'https://troutshop.eu/all-shop-products/?filter_brand=forest-en'),
        ('rodiocraft', 'spoons 117 · wobblers 201 · hooks 18 · rods 9 · lines 10', 'https://troutshop.eu/all-shop-products/?filter_brand=rodio-craft-en'),
        ('valkein', 'spoons 102 · wobblers 78', 'https://troutshop.eu/all-shop-products/?filter_brand=valkein-en'),
        ('vanfook', 'hooks 246 · spoons 32', 'https://troutshop.eu/all-shop-products/?filter_brand=vanfook-en'),
        ('varivas', 'lines 110 · hooks 8', 'https://troutshop.eu/all-shop-products/?filter_brand=varivas-en'),
        ('fishup', 'soft baits 474', 'https://troutshop.eu/all-shop-products/?filter_brand=fishup-en'),
        ('mukai', 'wobblers 81', 'https://troutshop.eu/all-shop-products/?filter_brand=mukai-2'),
        ('velvetarts', 'spoons 60', 'https://troutshop.eu/all-shop-products/?filter_brand=velvet-arts-2'),
        ('yarie', 'spoons 32', 'https://troutshop.eu/all-shop-products/?filter_brand=yarie-2'),
        ('libralures', 'soft baits 73', 'https://troutshop.eu/pc/soft-baits/libra-en/'),
        ('berkley', 'soft baits 88', 'https://troutshop.eu/pc/soft-baits/berkley-en/'),
    ],
    'activefishing': [
        ('nories', 'plandavky 356 · woblery 76', 'https://www.activefishing.cz/plandavky:nories/'),
        ('mukai', 'woblery 267 · plandavky 19', 'https://www.activefishing.cz/woblery:mukai/'),
        ('valkein', 'plandavky 120 · woblery 57', 'https://www.activefishing.cz/plandavky:valkein/'),
        ('varivas', 'vlasce a šňůry 158 (100 %) · háčky 9', 'https://www.activefishing.cz/varivas/'),
        ('yarie', 'plandavky 112 · woblery 19 · háčky 18', 'https://www.activefishing.cz/plandavky:yarie/'),
        ('forest', 'plandavky 88', 'https://www.activefishing.cz/plandavky:forest/'),
        ('officeeucalyptus', 'plandavky 87', 'https://www.activefishing.cz/plandavky:office-eucalyptus/'),
        ('velvetarts', 'plandavky 70', 'https://www.activefishing.cz/plandavky:velvet-arts/'),
        ('libralures', 'gumové nástrahy 174', 'https://www.activefishing.cz/gumove-nastrahy/'),
        ('jigovky', 'jigové hlavičky 48', 'https://www.activefishing.cz/jigove-hlavicky--hacky--ceburasky/'),
        ('rodiocraft', 'woblery 32 · háčky 6', 'https://www.activefishing.cz/woblery:rodio-craft/'),
        ('fishup', 'gumové nástrahy 44', 'https://www.activefishing.cz/gumove-nastrahy/'),
    ],
    'jigovky': [
        ('varivas', 'VARIVAS 206 (fluorocarbony, háčky, šňůry, vlasce, oblečení)', 'https://www.jigovky.cz/varivas/'),
    ],
}


def checker(w, h, s=24):
    yy, xx = np.mgrid[0:h, 0:w]
    c = ((yy // s + xx // s) % 2) * 30 + 200
    return Image.fromarray(np.dstack([c, c, c, np.full_like(c, 255)]).astype(np.uint8), 'RGBA')


def sheet(key: str, items: list[tuple[str, Image.Image, Image.Image]]):
    cell_w, cell_h = 360, 150
    bgs = [(255, 255, 255), tuple(int(DARK[key][i:i + 2], 16) for i in (1, 3, 5)), (0, 0, 0), (11, 30, 66)]
    W = cell_w * len(bgs)
    H = cell_h * len(items)
    out = Image.new('RGB', (W, H), (40, 40, 40))
    for r, (slug, light, dark) in enumerate(items):
        for c, bg in enumerate(bgs):
            tile = Image.new('RGBA', (cell_w, cell_h), bg + (255,))
            im = light if c == 0 else dark
            s = min((cell_w - 40) / im.width, (cell_h - 40) / im.height)
            t = im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.LANCZOS)
            tile.alpha_composite(t, ((cell_w - t.width) // 2, (cell_h - t.height) // 2))
            ImageDraw.Draw(tile).text((6, 4), slug, fill=(128, 128, 128, 255))
            out.paste(tile.convert('RGB'), (c * cell_w, r * cell_h))
    out.save(f'{PROJ}/assets_prep/{key}/brands/_sheet.jpg', quality=88)


def main():
    built: dict[str, tuple[Image.Image, Image.Image, str, str]] = {}
    for slug, fn in RECIPES.items():
        built[slug] = fn()
    for slug, (base, note) in REUSE.items():
        if slug == 'jigovky':
            l = Image.open(f'{PROJ}/{base}_on_light.png').convert('RGBA')
            d = Image.open(f'{PROJ}/{base}_on_dark.png').convert('RGBA')
        else:
            l = Image.open(f'{PROJ}/{base}.png').convert('RGBA')
            d = Image.open(f'{PROJ}/{base}_on_dark.png').convert('RGBA')
        built[slug] = (l, d, 'reuse', note)

    for key, lst in SHOPS.items():
        outdir = f'{PROJ}/assets_prep/{key}/brands'
        os.makedirs(outdir, exist_ok=True)
        man = {
            'sponsor': key,
            'generated': '2026-10-21',
            'note': ('Third-party brands sold by the shop (ordered by trout-area prominence on the shop). Never present them '
                     'as the sponsor\'s own. <slug>.png = transparent, original colours (light bg); <slug>_on_dark.png = '
                     'variant for dark bg. Do not upscale beyond native width. Logo rule: every brand logo must stay smaller '
                     'than the TA CZ logo in frame (ctx.logo / plate rule applies to brand marks too). Wordmark-only brands: '
                     'see research/' + key + '_brands.md (typed in Montserrat 800, never imitating their artwork).'),
            'brands': [],
        }
        sheet_items = []
        for rank, (slug, items, page) in enumerate(lst, 1):
            light, dark, mode, note = built[slug]
            light.save(f'{outdir}/{slug}.png', optimize=True)
            dark.save(f'{outdir}/{slug}_on_dark.png', optimize=True)
            name, src = SOURCES[slug]
            man['brands'].append({
                'rank': rank, 'slug': slug, 'name': name,
                'file': f'assets_prep/{key}/brands/{slug}.png',
                'file_on_dark': f'assets_prep/{key}/brands/{slug}_on_dark.png',
                'on_dark_mode': mode, 'size': list(light.size), 'size_on_dark': list(dark.size),
                'items_on_shop': items, 'brand_page': page, 'logo_url': src, 'note': note,
            })
            sheet_items.append((slug, light, dark))
        json.dump(man, open(f'{outdir}/manifest.json', 'w'), ensure_ascii=False, indent=1)
        sheet(key, sheet_items)
        print(key, [s for s, *_ in lst])


if __name__ == '__main__':
    main()
