"""Merge step notes → assets_prep/manifest.json (single source for the film/banner generator)."""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import OUT  # noqa


def j(name):
    p = f'{OUT}/{name}'
    return json.load(open(p)) if os.path.exists(p) else {}


logos, heroes, broll, venue = j('_logos_notes.json'), j('_heroes_notes.json'), j('_broll_notes.json'), j('_venue_notes.json')


def lf(key, name):
    """logo file entry if it exists"""
    if os.path.exists(f'{OUT}/{key}/{name}'):
        n = logos.get(key, {}).get(name, {})
        return {'file': f'{key}/{name}', **n}
    return None


SPONSORS = [
    # key, display name, web, brand colours (from research/*.md, sampled where noted), on-dark original OK?, extra notes
    ('troutshop', 'Troutshop.eu', 'troutshop.eu', {'red': '#E3000F', 'black': '#000000', 'white': '#FFFFFF'}, True,
     'Logo only existed as a 408 px raster → vectorised (logo.svg, rendered 2000 px). Packshots carry a TROUTSHOP.EU watermark: h01/h02 use the shop\'s own alpha (watermark layer dropped, clean at normal contrast); Rooney, Tulle, Daisy and Forte Glow Gold were REJECTED because the mark is visible on the lure; Forte Mustard Gold rejected (lure only ~320 px). 4 heroes.'),
    ('activefishing', 'Activefishing.cz', 'activefishing.cz', {'orange_top': '#E39025', 'orange_bottom': '#DF5942', 'white': '#FFFFFF'}, True,
     'Source packshots are small (lures ~400–700 px wide inside 1024x768 frames) → heroes are 600–900 px; keep them ≤ ~45 % of frame width.'),
    ('moonky', 'Moonky', 'moonky.cz', {'navy_badge': '#0E1424', 'blue_web': '#6883BA', 'white': '#FFFFFF'}, True,
     'badge.svg/png = clean replica of the FB avatar (navy disc + symbol + MOONKY + HANDMADE LURES; subtitle font approximated with Montserrat Light). Site logo is white-on-transparent → logo_on_light is a mono navy recolour.'),
    ('jigovky', 'Jigovky.cz', 'jigovky.cz', {'yellow': '#FED700', 'green': '#176E37', 'cta_green': '#00AB4D'}, True,
     'Coloured HD BARBLESS photos have a tying vise clamped on the hook bend → h03–h05 are head-detail crops (luma-key cut-out keeps the hairline wire) with the shank faded out by an alpha ramp; nothing painted in. They are small (~500 px) → show ≤ 500 px or use orig/ with multiply on light. h01/h02 are complete clean packshots.'),
    ('velkaryba', 'Velka-ryba.cz', 'velka-ryba.cz', {'navy': '#143D6B', 'red': '#DA0F00', 'charcoal': '#2F2F2F'}, False,
     'Original logo needs a light ground (charcoal fish line-art) → on dark/photo use logo_plate.png. Cardiff Roll Swimmer: "BACK/FRONT" labels removed; also split into h05_…_back.png / h05_…_front.png for a spoon flip.'),
    ('bosset', 'Bosset.cz', 'bosset.cz', {'teal': '#1B97B1', 'accent_yellow': '#FFC500', 'light_blue': '#C5EBFC', 'black': '#000000'}, False,
     'Logo traced from assets/bosset/logo.png (1000x200) → logo.svg. Prizes = Zojirushi thermoses sold by Bosset; all chosen heroes are 0,6 l models from research/bosset.md (in the 0,5–0,7 l range; the 0,52 l SW-KA is a food jar, left out). Do not claim anything about Zojirushi origin (research note).'),
    ('gausseholler', 'Gausse Holler', 'gausseholler.com', {'blue': '#1D8FD5', 'bg': '#0F1113', 'word': '#E8E5E1', 'orange_logo': '#F0904F', 'ice': '#7FB2C7'}, True,
     'Black Standard Edition = Revolut 8 Standard Edition · Black. Renders are on a dark studio floor; cut-outs drop the floor shadow → add a soft CSS ellipse shadow under the stand. gear_ring/gear_core share one 1024 canvas (stack, rotate ring). madeby_*.png = static MADE BY ⚙ © 2026 GAUSSE HOLLER lockup.'),
]

m = {
    'project': 'MČR Trout Area 2026 · prezentace sponzorů (9:16)',
    'generated': '2026-10-19',
    'root': 'projects/mcr-2026-sponzori/assets_prep',
    'paths_are_relative_to': 'assets_prep/',
    'reproduce': {
        'logos': 'python scripts/assets_prep/prep_logos.py',
        'heroes': 'python scripts/assets_prep/prep_heroes.py all  (bg removal: npm @imgly/background-removal-node@1.4.5, model "medium", weights ship inside the npm package; runner scripts/assets_prep/rmbg.mjs)',
        'broll': 'python scripts/assets_prep/prep_broll.py',
        'venue': 'python scripts/assets_prep/prep_venue.py',
        'manifest': 'python scripts/assets_prep/prep_manifest.py',
        'python_env': 'PIL, numpy, scipy, vtracer 0.6.11, fonttools+brotli; SVG→PNG via playwright headless_shell (scripts/assets_prep/render_svg.mjs)',
    },
    'conventions': {
        'logo_variants': {
            'logo_on_dark.png': 'readable on navy #0b1e42 / black',
            'logo_on_light.png': 'readable on white / #eef2f9',
            'logo_plate.png': 'logo on white rounded plate — safe on photos and any background',
            'logo.svg': 'vector (only where the source was flat-colour and got traced)',
        },
        'heroes': 'transparent PNG cut-outs, trimmed with 3 % pad, luminance-levelled (no hue shift) + sat ×1.06–1.08 + light sharpen, long side ≤ 2000 px, never upscaled. Originals copied unchanged to <key>/orig/ (use them with mix-blend-mode:multiply on light sets as fallback).',
        'hero_metadata': 'per hero: size, bbox (px, alpha>0.5), aspect, dominant[3] (k-means hex + share, for swatches), glint [x,y] normalised (brightest spot, for light sweeps), method (how it was cut).',
        'cutout_methods': 'ml_isnet = @imgly ISNet medium; shop_alpha = the shop PNG alpha; classic silhouette / luma key for pastel bottles and hairline jigs. Every cut-out was checked on checker/navy/light; rejects are listed in sponsor notes.',
        'broll_duotone': 'broll/duo_navy/*.jpg = baked NAVY DUO gradient map #050d22→#304285→#8ea2d8 (q85), from design drafts; re-run prep_broll.py with other stops if DESIGN.md changes.',
        'broll': '1080x1920 JPEG q92, subject-aware crop (focus set by eye), half-strength levels + sat ×1.05. Subjects kept in the middle band (Reels/TikTok UI covers ~top 14 % and bottom ~25 %).',
        'logo_size_rule': 'TA CZ plate must stay the largest logo in frame; sponsor logos never exceed its on-screen area.',
    },
    'ta_cz': {
        'corner_plate': lf('ta_cz', 'logo_h_plate.png'),
        'h_on_dark': lf('ta_cz', 'logo_h_on_dark.png'),
        'h_on_light': lf('ta_cz', 'logo_h_on_light.png'),
        'round_hero': lf('ta_cz', 'logo_round.png'),
        'round_dark': lf('ta_cz', 'logo_round_dark.png'),
        'stacked': lf('ta_cz', 'logo_stacked.png'),
        'colors': {'navy': '#304285', 'deep': '#0b1e42', 'card': '#eef2f9', 'red': '#e31e24', 'light_blue': '#8ea2d8'},
        'note': 'No vector TA logo exists in the repo; all TA variants are careful Lanczos 2x upscales of the best rasters (≈1000 px sources). Fine for the corner plate and for heroes up to ~1000 px on screen.',
    },
    'sponsors': {},
    'order_default': ['intro', 'venue:libechov', 'troutshop', 'activefishing', 'moonky', 'jigovky', 'velkaryba', 'bosset', 'gausseholler', 'finale'],
    'venue': {
        'libechov': {
            'name': 'Líheň Liběchov (Sportovní rybaření Boží Voda – Liběchov)',
            'web': 'lihenlibechov.cz',
            'logo': {'any_bg': lf('libechov', 'logo.png'), 'svg': 'libechov/logo.svg'},
            'colors': {'turquoise': '#17a1c8', 'navy': '#1a212e', 'aqua': '#9ae7e8', 'gold': '#d8af64'},
            'placeholders_9x16': venue,
            'drone_clip': 'drone/final/flyover_9x16.mp4 (not present on 2026-10-19 → use venue/v01_maly_sportacek.jpg or v04_mcr_poster_fit.jpg)',
            'facts_reminder': 'keep "donedávna" in the lowest-trout-farm claim; Malý Sporťáček is NOT "chyť a pusť" (since 23. 6. 2026 "chyť a vem").',
        }
    },
    'broll': broll,
    'broll_notes': [
        'All b-roll except br16 is H-BATTLE 2026 (Hofer Lake, SK) — no readable foreign event names as hero; tents/flags in soft background only. Award-ceremony and team-poster photos were excluded.',
        'Saska: not identifiable from the photos. H-BATTLE Team CZ was Hrabalík, Švub, Kučera, Stoklasa (+ coach Zaikin), so H-BATTLE frames should not feature him; the only Klonówiec frame (br16) shows gear only, no people.',
        'br10_lake_mist source is 1620x1080 → 1.78x upscale; use as soft/background plate.',
        'br04_net_with_fish: fish sits in the lower third (finger blur in the source had to be cropped out) → use a slow upward pan or as background.',
        'Videos from the operator still to come; slots are the same 1080x1920.',
    ],
}

for key, name, web, colors, dark_ok, note in SPONSORS:
    L = {v: lf(key, f'logo_{v}.png') for v in ('on_dark', 'on_light', 'plate')}
    extra = {}
    if key == 'moonky':
        extra = {'badge': lf(key, 'badge.png'), 'badge_svg': 'moonky/badge.svg', 'mark_on_dark': lf(key, 'mark_on_dark.png'),
                 'mark_on_light': lf(key, 'mark_on_light.png')}
    if key == 'gausseholler':
        extra = {'gear': lf(key, 'gear.png'), 'gear_ring': lf(key, 'gear_ring.png'), 'gear_core': lf(key, 'gear_core.png'),
                 'wordline_on_dark': lf(key, 'wordline_on_dark.png'), 'wordline_on_light': lf(key, 'wordline_on_light.png'),
                 'madeby_on_dark': lf(key, 'madeby_on_dark.png'), 'madeby_on_light': lf(key, 'madeby_on_light.png')}
    svg = f'{key}/logo.svg' if os.path.exists(f'{OUT}/{key}/logo.svg') else None
    m['sponsors'][key] = {
        'name': name, 'web': web, 'colors': colors,
        'logo': {**L, 'svg': svg, **{k: v for k, v in extra.items() if v}},
        'logo_on_dark_ok': dark_ok,
        'heroes': heroes.get(key, []),
        'originals_dir': f'{key}/orig/',
        'notes': note,
    }

json.dump(m, open(f'{OUT}/manifest.json', 'w'), indent=1, ensure_ascii=False)
print('manifest written', len(m['sponsors']), 'sponsors,', len(broll), 'broll')
