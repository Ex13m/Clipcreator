#!/usr/bin/env python3
"""B-roll from OUR gallery (troutareacz.cz, league rounds only) → subject-aware crops for the film and FB banners.

Source : assets/gallery_tacz/gtacz_<album>_<id>.webp (+ index.json; ingest 21. 10. 2026)
Output : assets_prep/broll_tacz/tNN_<slug>.jpg        1080×1920 (film, Reels)
         assets_prep/broll_tacz/4x5/tNN_<slug>.jpg    1080×1350 (FB feed banners)
         assets_prep/broll_tacz/1x1/tNN_<slug>.jpg    1080×1080 (FB square)
         assets_prep/broll_tacz/manifest.json         source, album, crop box, scale, word-band luma, logo notes
         assets_prep/broll_tacz/ai01_trout_rainbow_on_water.jpg  (see make_trout) — AI rainbow trout (fish_ai, brief 21. 10.)
                                                       on a blurred gallery pond; NOT a gallery photo, labelled as AI.

Rules (BRIEF.md „FOTKY ZÁVODNÍKŮ A RYB“ + MEMORY lessons):
  * only albums of league rounds: tournaments with `rating: true` in admin.troutareacz.cz/api/tournaments
    (Varivas Trout Area Cup 2025 = rating false → its album is NOT used);
  * no upscaling (every crop is a downscale, scale ≤ 1 is asserted); no AI upscale / warp;
  * film slots under the big white b-roll word (frame y ≈ 392–760) must have no face in that band and a darkish band
    (the cut-out shots are the exception: the word sits behind the subject) → per-photo zoom / anchor below.
  * crop = largest window of the target aspect, ÷ zoom, centred on (fx, fy) and clamped to the photo
    (fy 0 = top-anchored, 1 = bottom-anchored).

Run: python3 -I scripts/assets_prep/prep_broll_tacz.py [--sheet <png>]
"""
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageOps

PROJ = '/home/user/Clipcreator/projects/mcr-2026-sponzori'
GAL = f'{PROJ}/assets/gallery_tacz'
OUT = f'{PROJ}/assets_prep/broll_tacz'
FISH = f'{PROJ}/assets_prep/fish_ai/fish_rainbow_b_cut.png'
LANCZOS = Image.Resampling.LANCZOS
SIZES = {'9x16': (1080, 1920), '4x5': (1080, 1350), '1x1': (1080, 1080)}
BAND = (392, 760)          # b-roll word band in the 1080×1920 frame (WORD_Y 392 + Archivo 900 cap height)

# id, slug, gallery file, use, {aspect: (fx, fy, zoom)}, what (cs), logos / caveats
SEL = [
    ('t01', 'rig_tacz_vest', 'zl25_57025', 'broll cut beat 1 (cut-out, NERVY. behind him)',
     {'9x16': (0.50, 0.5, 1.0), '4x5': (0.52, 0.56, 1.0), '1x1': (0.55, 0.55, 1.05)},
     'Závodník v dresu TA CZ navazuje nástrahu u stojanu s pruty na břehu, modré nebe', 'kšiltovka Trout Area (naše); bez cizích log'),
    ('t02', 'lure_box', 'ned25p_1000042374', 'broll cut beat 2',
     {'9x16': (0.62, 0.5, 1.0), '4x5': (0.55, 0.5, 1.0), '1x1': (0.58, 0.5, 1.0)},
     'Pruty s navijáky a otevřený box s plandavkami (detail nástrah)', 'malé logo LINHA na boxu (výrobce boxu, není sponzor) – menší než plaketa TA'),
    ('t03', 'kneel_net', 'pol25_1000025175', 'broll break bar 1 (cut-out + sticker; head below the word ZÁBĚR.)',
     {'9x16': (0.52, 0.0, 1.4), '4x5': (0.5, 0.5, 1.0), '1x1': (0.5, 0.55, 1.0)},
     'Závodník klečí u prutů a podběráku na břehu (Polička jaro 2025)', 'bez log'),
    ('t04', 'angler_rods_tacz', 'zl25_1000023842', 'pool (cut-out ready; head hides a letter of a word at y 416 → not under a word)',
     {'9x16': (0.31, 0.5, 1.0), '4x5': (0.33, 0.5, 1.0), '1x1': (0.33, 0.5, 1.0)},
     'Závodník v dresu TA CZ s prutem u rybníka, za ním ostatní závodníci (Zářecká Lhota 2025)', 'dres Trout Area (naše); bez cizích log'),
    ('t05', 'rods_sun', 'zl25_57013', 'broll stutter 1',
     {'9x16': (0.5, 1.0, 1.6), '4x5': (0.5, 0.58, 1.0), '1x1': (0.55, 0.62, 1.0)},
     'Box a pruty ve stojanu u vody v protisvětle', 'oranžový box DAIWA (není sponzor; logo menší než plaketa TA) – jen krátce / ne jako hero'),
    ('t06', 'bank_line', 'ned25p_1000042379', 'broll cut beat 3 (crouching angler fishing; head below the word band)',
     {'9x16': (0.6, 0.565, 1.5), '4x5': (0.55, 0.55, 1.2), '1x1': (0.55, 0.52, 1.3)},
     'Závodníci lovící na kamenném břehu (Nedvědice podzim 2025)', 'malé vlajky v pozadí, nečitelné'),
    ('t07', 'gold_cups', 'zl25_57037', 'broll stutter 3',
     {'9x16': (0.5, 0.5, 1.0), '4x5': (0.5, 0.45, 1.0), '1x1': (0.5, 0.42, 1.0)},
     'Dva zlaté poháry Trout Area Czech Republic na prkně u rybníka', 'štítky Trout Area (naše)'),
    ('t08', 'three_anglers', 'ned25p_1000042375', 'pool (banners; face in the word band)',
     {'9x16': (0.385, 0.5, 1.0), '4x5': (0.45, 0.5, 1.0), '1x1': (0.42, 0.5, 1.0)},
     'Tři závodníci lovící na břehu, podběráky u vody (Nedvědice podzim 2025)', 'dres Trout Area vlevo; bez cizích log'),
    ('t09', 'threading_line', 'zl25_57023', 'pool (banners; face in the word band → not under a word)',
     {'9x16': (0.5, 0.5, 1.0), '4x5': (0.5, 0.45, 1.0), '1x1': (0.5, 0.42, 1.0)},
     'Závodník v kšiltovce Trout Area navléká šňůru do očka prutu', 'kšiltovka + dres Trout Area (naše)'),
    ('t10', 'joy_denis', 'zl25_57007', 'pool (joy; banners)',
     {'9x16': (0.5, 0.5, 1.0), '4x5': (0.5, 0.42, 1.0), '1x1': (0.5, 0.38, 1.0)},
     'Kapitán Denis v dresu TA CZ s pohárem, palec nahoru (Zářecká Lhota 2025)', 'dres Trout Area (naše)'),
    ('t11', 'joy_mcr25_top3', 'mcr25_1000046077', 'pool (joy; banners)',
     {'9x16': (0.5, 0.5, 1.0), '4x5': (0.5, 0.5, 1.0), '1x1': (0.5, 0.5, 1.0)},
     'Tři nejlepší MČR 2025 s poháry u rybníka', 'mikina s velkým potiskem (cizí oděvní značka) vlevo – v 9:16 mimo střed'),
    ('t12', 'joy_cup_duo', 'mcr25_1000046073-1', 'pool (joy; banners)',
     {'9x16': (0.5, 0.5, 1.0), '4x5': (0.5, 0.45, 1.0), '1x1': (0.5, 0.4, 1.0)},
     'Dva závodníci v reprezentačních dresech drží velký pohár MČR 2025', 'dresy Trout Area (naše)'),
    ('t13', 'dawn_trophies', 'mcr25_1000046043', 'finale closer (Uvidíme se u vody)',
     {'9x16': (0.5, 0.5, 1.0), '4x5': (0.5, 0.55, 1.0), '1x1': (0.5, 0.55, 1.0)},
     'Stůl s poháry u rybníka za ranní mlhy (MČR 2025)', 'ubrus ČRS (pořadatel MČR), bez sponzorských log'),
    ('t14', 'libechov_briefing', 'lib26_1000064885', 'intro + finale venue card (Líheň Liběchov)',
     {'9x16': (0.16, 0.5, 1.0), '4x5': (0.3, 0.5, 1.0), '1x1': (0.25, 0.5, 1.0)},
     'Rozprava závodníků u rybníka v Líhni Liběchov (Liběchov jaro 2026 – místo MČR 2026)', 'bez log'),
    ('t15', 'mcr25_bank', 'mcr25_1000046051', 'pool (banners)',
     {'9x16': (0.62, 0.5, 1.0), '4x5': (0.55, 0.5, 1.0), '1x1': (0.6, 0.5, 1.0)},
     'Závodníci na břehu při přípravě a lovu (MČR 2025)', 'malé logo TAO na bundě; bez cizích log'),
    ('t16', 'rod_stand_grass', 'ned25j_1000027280', 'broll stutter 2',
     {'9x16': (0.5, 0.5, 1.0), '4x5': (0.5, 0.42, 1.0), '1x1': (0.5, 0.42, 1.0)},
     'Stojan s navijáky v trávě, podběrák (Nedvědice jaro 2025)', 'bez log'),
]


def load(name):
    im = Image.open(f'{GAL}/gtacz_{name}.webp')
    return ImageOps.exif_transpose(im).convert('RGB')


def crop_box(W, H, aspect, fx, fy, zoom):
    if W / H > aspect:
        ch = H / zoom
        cw = ch * aspect
    else:
        cw = W / zoom
        ch = cw / aspect
    x0 = min(max(fx * W - cw / 2, 0), W - cw)
    y0 = min(max(fy * H - ch / 2, 0), H - ch)
    return (round(x0), round(y0), round(x0 + cw), round(y0 + ch))


def grade(im):
    """same light auto-level as prep_broll.grade (0.3/99.7 % percentiles, half-way stretch) + colour 1.05"""
    a = np.asarray(im).astype(np.float32)
    lum = 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]
    lo, hi = np.percentile(lum, 0.3), np.percentile(lum, 99.7)
    lo, hi = lo * 0.5, hi + (255 - hi) * 0.5
    a = np.clip((a - lo) * 255.0 / max(hi - lo, 1), 0, 255)
    return ImageEnhance.Color(Image.fromarray(a.astype(np.uint8), 'RGB')).enhance(1.05)


def band_luma(im):
    a = np.asarray(im.convert('L'), dtype=np.float32)[BAND[0]:BAND[1]]
    return round(float(a.mean()), 1)


def make_trout(album_meta):
    """AI rainbow trout (fish_ai/fish_rainbow_b_cut.png, Higgsfield, verdict OK) on a heavily blurred dark pond from our gallery
    (mcr25_1000046043 water). Fish 800 px wide (0.6× native) and centred in the letterboxed window (bars 0–372 / 1548–1920,
    word 416–620) → after the break push-in (×1.12 → ×1.3) it is ~1040 px, head and tail stay in frame, ≤ native. No warp, no upscale."""
    W, H = SIZES['9x16']
    src = load('mcr25_1000046043')
    sw, sh = src.size
    water = src.crop((0, round(sh * 0.36), round(sw * 0.19), round(sh * 0.62)))       # reflective water left of the trophy table
    s = max(W / water.width, H / water.height)
    bg = water.resize((round(water.width * s), round(water.height * s)), LANCZOS)
    bg = bg.crop(((bg.width - W) // 2, (bg.height - H) // 2, (bg.width - W) // 2 + W, (bg.height - H) // 2 + H))
    bg = bg.filter(ImageFilter.GaussianBlur(28))
    bg = ImageEnhance.Brightness(bg).enhance(0.62)
    fish = Image.open(FISH).convert('RGBA')
    k = 800 / fish.width
    fish = fish.resize((round(fish.width * k), round(fish.height * k)), LANCZOS)
    fish = fish.rotate(7, resample=Image.Resampling.BICUBIC, expand=True)             # head slightly up (rigid rotation)
    cx, cy = 540, 1110
    pos = (cx - fish.width // 2, cy - fish.height // 2)
    # depth: soft dark halo under the fish (not a floor shadow) so the silver belly separates from the bokeh
    halo = Image.new('L', (W, H), 0)
    halo.paste(fish.getchannel('A'), pos)
    halo = halo.filter(ImageFilter.GaussianBlur(46)).point(lambda v: int(v * 0.55))
    dark = Image.new('RGB', (W, H), (6, 14, 20))
    bg = Image.composite(dark, bg, halo)
    bg.paste(fish, pos, fish)
    out = f'{OUT}/ai01_trout_rainbow_on_water.jpg'
    bg.save(out, quality=93, optimize=True, progressive=True)
    return {'id': 'ai01', 'file': 'assets_prep/broll_tacz/ai01_trout_rainbow_on_water.jpg', 'AI': True,
            'fish': 'assets_prep/fish_ai/fish_rainbow_b_cut.png (Higgsfield gpt_image_2_5, verdict OK)', 'fish_scale': round(k, 3),
            'background': 'gtacz_mcr25_1000046043 (water left of the table, x 0–19 % y 36–62 %, blur 28, brightness .62)', 'album': album_meta,
            'use': 'broll break bar 2 (PSTRUH.) — no trout close-up exists in the gallery albums',
            'what_cs': 'AI pstruh duhový na rozmazané hladině rybníka z naší galerie (ne fotografie)', 'band_luma': None}


def main():
    idx = {it['file']: it for it in json.load(open(f'{GAL}/index.json'))['items']}
    for a in SIZES:
        if a != '9x16':
            os.makedirs(f'{OUT}/{a}', exist_ok=True)
    os.makedirs(OUT, exist_ok=True)
    meta = []
    for tid, slug, name, use, foc, what, logos in SEL:
        it = idx[f'gtacz_{name}.webp']
        im = load(name)
        rec = {'id': tid, 'slug': slug, 'source': f'assets/gallery_tacz/gtacz_{name}.webp', 'source_url': it['source_url'],
               'album': it['album'], 'album_id': it['album_id'], 'source_size': list(im.size), 'use': use, 'what_cs': what,
               'logos': logos, 'crops': {}}
        for a, (tw, th) in SIZES.items():
            fx, fy, z = foc[a]
            box = crop_box(*im.size, tw / th, fx, fy, z)
            scale = tw / (box[2] - box[0])
            assert scale <= 1.0 + 1e-6, f'{tid} {a}: would upscale ×{scale:.2f}'
            out = grade(im.crop(box).resize((tw, th), LANCZOS))
            rel = f'{tid}_{slug}.jpg' if a == '9x16' else f'{a}/{tid}_{slug}.jpg'
            out.save(f'{OUT}/{rel}', quality=92, optimize=True, progressive=True)
            rec['crops'][a] = {'file': f'assets_prep/broll_tacz/{rel}', 'focus': [fx, fy], 'zoom': z,
                               'box': list(box), 'scale': round(scale, 3)}
            if a == '9x16':
                rec['band_luma'] = band_luma(out)
        meta.append(rec)
        print(tid, slug, im.size, {a: rec['crops'][a]['scale'] for a in SIZES}, 'band', rec.get('band_luma'))
    meta.append(make_trout('MČR 2025 (pozadí)'))
    json.dump({'_note': 'B-roll z galerie troutareacz.cz (jen ligová kola: admin.troutareacz.cz/api/tournaments rating=true; Varivas Trout Area Cup 2025 = rating false → vynechán). Skript scripts/assets_prep/prep_broll_tacz.py, cut-outy scripts/assets_prep/broll_cut.py (BROLL_DIR=assets_prep/broll_tacz). Přehled: research/gallery_tacz.md.',
               'band': BAND, 'items': meta}, open(f'{OUT}/manifest.json', 'w'), indent=1, ensure_ascii=False)
    if '--sheet' in sys.argv:
        sheet(meta, sys.argv[sys.argv.index('--sheet') + 1])


def sheet(meta, path):
    """review sheet: every 9:16 crop with the word band (red) and the TA plate zone (cyan) marked"""
    tw, th = 270, 480
    n = len(meta)
    cols = 6
    rows = (n + cols - 1) // cols
    S = Image.new('RGB', (cols * (tw + 10) + 10, rows * (th + 40) + 10), (24, 24, 24))
    d = ImageDraw.Draw(S)
    for i, r in enumerate(meta):
        f = r['crops']['9x16']['file'] if 'crops' in r else r['file']
        im = Image.open(f'{PROJ}/{f}').convert('RGB').resize((tw, th), LANCZOS)
        x, y = 10 + (i % cols) * (tw + 10), 10 + (i // cols) * (th + 40)
        S.paste(im, (x, y))
        k = th / 1920
        d.rectangle((x, y + BAND[0] * k, x + tw - 1, y + BAND[1] * k), outline=(255, 40, 40), width=2)
        d.rectangle((x + 64 * k, y + 250 * k, x + 400 * k, y + 348 * k), outline=(0, 220, 255), width=2)
        d.text((x, y + th + 4), f"{r['id']} {r.get('slug', 'ai')} band {r.get('band_luma')}", fill=(255, 220, 120))
    S.save(path, quality=88)


if __name__ == '__main__':
    main()
