"""Brand logos for FT Fishing (MČR 2026, 22. 10. 2026).
Main source = FT Fishing's own homepage hero banner https://www.ftfishing.cz/data/animace/28.jpg (1160×500, white),
where the shop shows its brand line-up: FAVORITE · SPINMAD · CRAZY FISH | SV FISHING LURES · TROUT AREA · VANFOOK.
Crazy Fish: category tile https://www.ftfishing.cz/data/shop/categories/68.jpg (400×400, larger than in the banner).
Vanfook: the red-target logo from the FT banner (troutshop's hook-art Vanfook asset is a different mark).
Jigovky.cz: reused from assets_prep/activefishing/brands (same brand = same asset).
Method: white key (alpha from darkness, ramp 8..70) + colour unmix vs white, ×3 Lanczos (premultiplied).
On dark: 'lift' = near-black neutrals -> white; 'chip' = original on a white rounded plate (illustrated logo with white fills).
Outputs assets_prep/ftfishing/brands/<slug>.png, <slug>_on_dark.png, manifest.json, _sheet.jpg."""
import json, os, shutil
import numpy as np
from PIL import Image, ImageDraw
P = '/home/user/Clipcreator/projects/mcr-2026-sponzori'
SRC = f'{P}/assets/ftfishing/src'
OUT = f'{P}/assets_prep/ftfishing/brands'
BANNER = f'{SRC}/w_home_hero.png'
JOBS = {
    'favorite':   dict(src=BANNER, box=(18, 44, 328, 112), mode='lift', name='Favorite', url='https://www.ftfishing.cz/data/animace/28.jpg'),
    'spinmad':    dict(src=BANNER, box=(28, 128, 322, 258), mode='keep', name='Spinmad', url='https://www.ftfishing.cz/data/animace/28.jpg'),
    'crazyfish':  dict(src=f'{SRC}/b_cat68_crazyfish.png', box=(18, 56, 390, 340), mode='chip', name='Crazy Fish', url='https://www.ftfishing.cz/data/shop/categories/68.jpg'),
    'vanfook':    dict(src=BANNER, box=(893, 322, 1114, 455), mode='chip', name='Vanfook', url='https://www.ftfishing.cz/data/animace/28.jpg'),
    'svfishing':  dict(src=BANNER, box=(878, 42, 1128, 168), mode='lift', name='SV Fishing Lures', url='https://www.ftfishing.cz/data/animace/28.jpg'),
}
REUSE = {'jigovky': f'{P}/assets_prep/activefishing/brands/jigovky'}


def key_white(rgb, lo=8, hi=70):
    dark = (255 - rgb).max(2)
    a = np.clip((dark - lo) / (hi - lo), 0, 1)
    col = np.clip((rgb - (1 - a[..., None]) * 255) / np.maximum(a[..., None], 1e-3), 0, 255)
    col = np.where(a[..., None] > 0.85, rgb, col)
    return np.dstack([col, a * 255])


def up(rgba, k=3):
    im = Image.fromarray(rgba.round().clip(0, 255).astype(np.uint8), 'RGBA')
    return im.convert('RGBa').resize((im.width * k, im.height * k), Image.LANCZOS).convert('RGBA')


def trim(im, pad=12):
    bb = im.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
    im = im.crop(bb)
    c = Image.new('RGBA', (im.width + 2 * pad, im.height + 2 * pad), (0, 0, 0, 0)); c.alpha_composite(im, (pad, pad))
    return c


def lift(im):
    a = np.asarray(im).astype(np.float32)
    c = a[..., :3]; L = c.mean(2); C = c.max(2) - c.min(2)
    m = (C < 40) & (L < 120)
    a[..., :3] = np.where(m[..., None], 255 - c * 0.3, c)
    return Image.fromarray(a.round().clip(0, 255).astype(np.uint8), 'RGBA')


def chip(im, pad=0.10, r=0.16):
    w, h = im.size; p = int(max(w, h) * pad)
    c = Image.new('RGBA', (w + 2 * p, h + 2 * p), (0, 0, 0, 0))
    ImageDraw.Draw(c).rounded_rectangle((0, 0, c.width - 1, c.height - 1), radius=int(min(c.size) * r), fill=(255, 255, 255, 255))
    c.alpha_composite(im, (p, p)); return c


man = []
for slug, j in JOBS.items():
    rgb = np.asarray(Image.open(j['src']).convert('RGB').crop(j['box'])).astype(np.float32)
    im = trim(up(key_white(rgb)))
    im.save(f'{OUT}/{slug}.png')
    dk = lift(im) if j['mode'] == 'lift' else chip(im) if j['mode'] == 'chip' else im
    dk.save(f'{OUT}/{slug}_on_dark.png')
    man.append(dict(slug=slug, name=j['name'], file=f'assets_prep/ftfishing/brands/{slug}.png', on_dark=f'assets_prep/ftfishing/brands/{slug}_on_dark.png',
                    size=list(im.size), source=j['url'], crop=j['box'], method=f"white key ×3, on_dark={j['mode']}"))
    print(slug, im.size)
for slug, base in REUSE.items():
    for suf in ('', '_on_dark'):
        shutil.copy(f'{base}{suf}.png', f'{OUT}/{slug}{suf}.png')
    man.append(dict(slug=slug, file=f'assets_prep/ftfishing/brands/{slug}.png', reused_from=base + '.png'))
json.dump(man, open(f'{OUT}/manifest.json', 'w'), indent=1, ensure_ascii=False)
# QA sheet: white / dark / FT green
slugs = list(JOBS) + list(REUSE)
S = Image.new('RGB', (3 * 420, 220 * len(slugs)), (50, 50, 50))
for i, s in enumerate(slugs):
    for k, (bg, suf) in enumerate([((255, 255, 255), ''), ((14, 17, 16), '_on_dark'), ((109, 181, 44), '_on_dark')]):
        im = Image.open(f'{OUT}/{s}{suf}.png').convert('RGBA'); im.thumbnail((380, 180))
        cell = Image.new('RGBA', (420, 220), bg + (255,)); cell.alpha_composite(im, ((420 - im.width) // 2, (220 - im.height) // 2))
        S.paste(cell.convert('RGB'), (k * 420, i * 220))
S.save(f'{OUT}/_sheet.jpg', quality=90)
