"""Step 3 — fishing b-roll: 1080x1920 subject-aware crops → assets_prep/broll/brNN_<slug>.jpg

Focus points were set by eye per photo (subject = fish / net / hands / face) and verified on contact sheets.
fx, fy = subject centre in 0..1 of the (EXIF-oriented) source; zoom ≥ 1 tightens the crop (lets the subject
sit in the Reels/TikTok safe band, roughly y 14 %–72 % of the frame).
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *  # noqa
from PIL import ImageEnhance

P = '/home/user/Clipcreator/projects'
HB1 = f'{P}/hb-battle-2026/01_RAW'
HB2 = f'{P}/hb-battle-2026/02_SELECT/refs_2026-10-03'
KL = f'{P}/klonowiec-2026/01_RAW'
TW, TH = 1080, 1920

# slug, source, fx, fy, zoom, moment, event
SEL = [
    ('br01_fight_splash', f'{HB1}/hb_battle_drive2/IMG-20261003-WA0018.jpg', 0.42, 0.50, 1.0, 'fish fighting at the bank, splash', 'H-BATTLE 2026, Hofer Lake SK'),
    ('br02_netting_sunrays', f'{HB1}/hb_battle_drive2/IMG-20261004-WA0019.jpg', 0.52, 0.55, 1.0, 'netting a trout, sun rays over the lake', 'H-BATTLE 2026'),
    ('br03_fish_in_net', f'{HB1}/hb_battle_zip1/IMG-20261002-WA0032.jpg', 0.42, 0.50, 1.0, 'trout in the landing net, unhooking', 'H-BATTLE 2026'),
    ('br04_net_with_fish', f'{HB2}/p_green_fish.jpg', 0.42, 0.42, 1.25, 'angler lifts net with trout (finger blur at bottom cropped out)', 'H-BATTLE 2026'),
    ('br05_reeling_portrait', f'{HB1}/hb_battle_zip1/IMG-20261002-WA0051.jpg', 0.55, 0.50, 1.0, 'angler reeling, spinning reel close', 'H-BATTLE 2026'),
    ('br07_landing_rod_up', f'{HB1}/hb_battle_zip1/IMG-20261002-WA0080.jpg', 0.55, 0.52, 1.0, 'rod raised, landing the fish', 'H-BATTLE 2026'),
    ('br08_landing_ripples', f'{HB1}/hb_battle_drive2/IMG-20261002-WA0042.jpg', 0.62, 0.55, 1.0, 'trout slides into the net, ripples', 'H-BATTLE 2026'),
    ('br09_landing_rods_flare', f'{HB1}/hb_battle_drive2/IMG-20261003-WA0021.jpg', 0.55, 0.60, 1.15, 'netting next to a rack of rods, morning flare', 'H-BATTLE 2026'),
    ('br10_lake_mist', f'{HB1}/hb_battle_zip1/FB_IMG_1790972317861.jpg', 0.56, 0.55, 1.0, 'morning mist on the lake (atmosphere)', 'H-BATTLE 2026'),
    ('br11_lake_sunflare', f'{HB1}/hb_battle_drive2/IMG-20261004-WA0010.jpg', 0.47, 0.50, 1.0, 'lake panorama, sun flare (atmosphere)', 'H-BATTLE 2026'),
    ('br12_keepnet_trout', f'{HB1}/hb_battle_zip1/IMG-20261002-WA0036.jpg', 0.55, 0.55, 1.0, 'trout school in the holding pen', 'H-BATTLE 2026'),
    ('br13_lure_check', f'{HB2}/p_tying_young.jpg', 0.55, 0.50, 1.0, 'young angler rigging a lure, autumn trees', 'H-BATTLE 2026'),
    ('br14_crouch_net', f'{HB1}/hb_battle_zip1/IMG-20261002-WA0072.jpg', 0.62, 0.55, 1.0, 'crouched angler with net and rod at the edge', 'H-BATTLE 2026'),
    ('br15_net_splash', f'{HB1}/hb_battle_drive2/IMG-20261002-WA0040.jpg', 0.45, 0.55, 1.0, 'fish splashing in the net', 'H-BATTLE 2026'),
    ('br16_dock_gear', f'{KL}/photos_d1/d1_09.jpg', 0.40, 0.55, 1.0, 'rods, tackle box and net on the dock (no faces)', 'Klonówiec 2026, PL'),
]


def smart_crop(im, fx, fy, zoom):
    W, H = im.size
    # largest 9:16 window, then zoom
    if W / H > TW / TH:
        ch = H / zoom
        cw = ch * TW / TH
    else:
        cw = W / zoom
        ch = cw * TH / TW
    x0 = min(max(fx * W - cw / 2, 0), W - cw)
    y0 = min(max(fy * H - ch / 2, 0), H - ch)
    return im.crop((round(x0), round(y0), round(x0 + cw), round(y0 + ch))), cw


def grade(im):
    a = np.array(im).astype(np.float32)
    lum = 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]
    lo, hi = np.percentile(lum, 0.3), np.percentile(lum, 99.7)
    lo, hi = lo * 0.5, hi + (255 - hi) * 0.5
    a = np.clip((a - lo) * 255.0 / max(hi - lo, 1), 0, 255)
    out = Image.fromarray(a.astype(np.uint8), 'RGB')
    out = ImageEnhance.Color(out).enhance(1.05)
    return out


def duotone(im, stops=('#050d22', '#304285', '#8ea2d8'), gamma=1.1):
    """Gradient-map duotone (NAVY DUO): luminance → 3-stop ramp. Swap stops to re-grade."""
    a = np.array(im.convert('L')).astype(np.float32) / 255.0
    lo, hi = np.percentile(a, 1), np.percentile(a, 99)
    t = np.clip((a - lo) / max(hi - lo, 1e-3), 0, 1) ** gamma
    cs = np.array([hex2rgb(h) for h in stops], np.float32)
    seg = np.minimum((t * (len(stops) - 1)).astype(int), len(stops) - 2)
    f = (t * (len(stops) - 1) - seg)[..., None]
    out = cs[seg] * (1 - f) + cs[seg + 1] * f
    return Image.fromarray(out.astype(np.uint8), 'RGB')


def main():
    od = f'{OUT}/broll'
    os.makedirs(od, exist_ok=True)
    meta = []
    for slug, src, fx, fy, z, moment, event in SEL:
        im = load_rgba(src).convert('RGB')
        crop, cw = smart_crop(im, fx, fy, z)
        scale = TW / crop.width
        out = crop.resize((TW, TH), LANCZOS)
        if scale > 1.05:
            out = out.filter(ImageFilter.UnsharpMask(radius=1.4, percent=50, threshold=2))
        out = grade(out)
        out.save(f'{od}/{slug}.jpg', quality=92, optimize=True, progressive=True)
        os.makedirs(f'{od}/duo_navy', exist_ok=True)
        duotone(out).save(f'{od}/duo_navy/{slug}.jpg', quality=85, optimize=True, progressive=True)
        meta.append({'file': f'broll/{slug}.jpg', 'source': os.path.relpath(src, P), 'source_size': list(im.size),
                     'crop_focus': [fx, fy], 'zoom': z, 'upscaled': round(scale, 2) if scale > 1 else None,
                     'moment': moment, 'event': event, 'duotone_navy': f'broll/duo_navy/{slug}.jpg'})
        print(slug, im.size, 'scale', round(scale, 2))
    json.dump(meta, open(f'{OUT}/_broll_notes.json', 'w'), indent=1, ensure_ascii=False)


if __name__ == '__main__':
    main()
