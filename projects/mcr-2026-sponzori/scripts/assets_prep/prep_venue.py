"""Venue placeholders (until drone/final/flyover_9x16.mp4 exists) → assets_prep/libechov/venue/*.jpg (1080x1920)."""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *  # noqa
from prep_broll import smart_crop, grade, TW, TH

L = f'{ASSETS}/libechov'
SEL = [
    ('v01_maly_sportacek', 'maly_sportacek_photo.jpg', 0.5, 0.55, 1.0, 'Malý Sporťáček (MČR pond), winter, aerator'),
    ('v02_velky_sportak', 'velky_sportak.jpg', 0.42, 0.5, 1.0, 'Velký Sporťák, winter, calm water'),
    ('v03_trout_in_net', 'nasazeni_trofejnich_pstruhu.jpg', 0.58, 0.5, 1.0, 'trophy brown trout in the net (stocking, 2022)'),
]


def contain_on_blur(im):
    bg = im.copy()
    s = max(TW / bg.width, TH / bg.height)
    bg = bg.resize((round(bg.width * s), round(bg.height * s)), LANCZOS)
    bg = bg.crop(((bg.width - TW) // 2, (bg.height - TH) // 2, (bg.width - TW) // 2 + TW, (bg.height - TH) // 2 + TH))
    bg = bg.filter(ImageFilter.GaussianBlur(40))
    bg = Image.eval(bg, lambda v: int(v * 0.55))
    fg = im.resize((TW, round(im.height * TW / im.width)), LANCZOS)
    bg.paste(fg, (0, round(TH * 0.42 - fg.height / 2)))
    return bg


def main():
    od = f'{OUT}/libechov/venue'
    os.makedirs(od, exist_ok=True)
    meta = []
    for slug, src, fx, fy, z, what in SEL:
        im = load_rgba(f'{L}/{src}').convert('RGB')
        crop, _ = smart_crop(im, fx, fy, z)
        sc = TW / crop.width
        out = crop.resize((TW, TH), LANCZOS)
        if sc > 1.05:
            out = out.filter(ImageFilter.UnsharpMask(radius=1.4, percent=50, threshold=2))
        grade(out).save(f'{od}/{slug}.jpg', quality=92, optimize=True)
        meta.append({'file': f'libechov/venue/{slug}.jpg', 'source': f'assets/libechov/{src}', 'what': what,
                     'upscaled': round(sc, 2) if sc > 1 else None})
    im = load_rgba(f'{L}/mcr_news_poster.png').convert('RGB')
    contain_on_blur(im).save(f'{od}/v04_mcr_poster_fit.jpg', quality=92, optimize=True)
    meta.append({'file': 'libechov/venue/v04_mcr_poster_fit.jpg', 'source': 'assets/libechov/mcr_news_poster.png',
                 'what': 'official MČR 2026 poster (pond photo + cup + 24.–25.10.), full poster on blurred fill; poster centre at y=42 %'})
    json.dump(meta, open(f'{OUT}/_venue_notes.json', 'w'), indent=1, ensure_ascii=False)


if __name__ == '__main__':
    main()
