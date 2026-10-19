"""Step 1 — logos for every partner + TA CZ + GH → assets_prep/<key>/logo_*.png (+ svg where traced).

Variants per key (only where meaningful):
  logo_on_dark.png   readable on navy/black backgrounds
  logo_on_light.png  readable on white/light backgrounds
  logo_plate.png     logo on a white rounded plate (safe on photos / any bg)
  *.svg              clean vector where the source was flat-colour and got traced
All PNGs are transparent, trimmed (tight bbox + 2 % breathing pad), ≥ 1000 px wide where the source allows.
"""
import json
import os
import shutil
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *  # noqa

SCR = '/tmp/claude-0/-home-user-Clipcreator/71aa791e-2b52-549a-940d-d7fdf5b83edd/scratchpad/ap'
SHARED = '/home/user/Clipcreator/projects/_shared/brand'
HB = '/home/user/Clipcreator/projects/hb-battle-2026'
MONT = f'{SCR}/fonts/node_modules/@fontsource/montserrat/files'
NOTES = {}


def out(key, name):
    d = f'{OUT}/{key}'
    os.makedirs(d, exist_ok=True)
    return f'{d}/{name}'


def save(im, key, name, note=None):
    p = out(key, name)
    im.save(p, optimize=True)
    NOTES.setdefault(key, {})[name] = {'size': list(im.size), **({'note': note} if note else {})}
    return im


def pad(im, frac=0.02):
    return trim(im, pad_frac=frac)


# ------------------------------------------------------------- text → SVG path (fontTools)
def text_path(fontfile, text, size, tracking=0.0):
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.pens.transformPen import TransformPen
    from fontTools.ttLib import TTFont
    f = TTFont(fontfile)
    gs, cmap, upm = f.getGlyphSet(), f.getBestCmap(), f['head'].unitsPerEm
    s, x, parts = size / upm, 0.0, []
    for ch in text:
        g = cmap[ord(ch)]
        pen = SVGPathPen(gs)
        gs[g].draw(TransformPen(pen, (s, 0, 0, -s, x, 0)))
        parts.append(pen.getCommands())
        x += f['hmtx'][g][0] * s + tracking * size
    width = x - tracking * size
    cap = f['OS/2'].sCapHeight * s
    return ' '.join(p for p in parts if p), width, cap


def font_face_css(family, path, weight):
    import base64
    b64 = base64.b64encode(open(path, 'rb').read()).decode()
    return f"@font-face{{font-family:'{family}';font-weight:{weight};src:url(data:font/woff2;base64,{b64}) format('woff2');}}\n"


# =============================================================== TA CZ
def ta_cz():
    k = 'ta_cz'
    plate = load_rgba(f'{SHARED}/ta_logo_h.png')
    save(upscale_lanczos(plate, 1900), k, 'logo_h_plate.png',
         'MANDATORY corner plate (horizontal logo on white plate). Source _shared/brand/ta_logo_h.png 950x311, Lanczos 2x + light unsharp.')
    save(pad(upscale_lanczos(trim(load_rgba(f'{HB}/_brand/11.png')), 2000)), k, 'logo_h_on_dark.png',
         'white TROUT + red AREA, transparent. Source hb-battle-2026/_brand/11.png 1009x302, Lanczos 2x.')
    save(pad(upscale_lanczos(trim(load_rgba(f'{HB}/_brand/logo-TACR2-reseceady.png')), 2000)), k, 'logo_h_on_light.png',
         'navy TROUT + red AREA, transparent. Source _brand/logo-TACR2-reseceady.png 1009x302, Lanczos 2x.')
    save(upscale_lanczos(trim(load_rgba(f'{SHARED}/logo-TACR2-ready.png')), 1700), k, 'logo_round.png',
         'HERO round badge (intro/finale), works on dark+light. Source logo-TACR2-ready.png 884x885, Lanczos ~1.9x.')
    save(pad(upscale_lanczos(trim(load_rgba(f'{HB}/_brand/lolo.png')), 1600)), k, 'logo_stacked.png',
         'stacked TROUT/AREA with flag speed-lines, for light bg. Source _brand/lolo.png 797x566, Lanczos 2x.')
    save(upscale_lanczos(trim(load_rgba(f'{HB}/proto/assets/ta_label.png')), 1100), k, 'logo_round_dark.png',
         'dark round label variant. Source proto/assets/ta_label.png only 504 px -> Lanczos 2.2x, use <= 500 px on screen.')


# =============================================================== Gausse Holler
def gausseholler():
    k = 'gausseholler'
    BLUE, WORD, DARK = '#1D8FD5', '#E8E5E1', '#16191C'
    full = trim(load_rgba(f'{ASSETS}/gausseholler/logo.png'))
    big = pad(upscale_lanczos(full, 1600))
    save(big, k, 'logo_on_dark.png', 'gear + GAUSSE HOLLER / CUSTOM LAB (light wordmark). Source gausseholler.com layers 1200 px canvas (content 786 px) -> Lanczos 2x.')
    a = np.array(big)
    blue_px = (a[..., 2].astype(int) - a[..., 0].astype(int)) > 60  # gear pixels stay blue
    save(recolor(big, hex2rgb(DARK), keep_mask=blue_px), k, 'logo_on_light.png', f'wordmark recoloured to {DARK}, gear stays {BLUE}.')
    save(rounded_plate(recolor(big, hex2rgb(DARK), keep_mask=blue_px), 0.10, 0.10), k, 'logo_plate.png')
    # gear layers: trace ring+core (flat blue) for crisp hi-res; ring and core share one square canvas → stack + rotate ring
    ring = load_rgba(f'{SHARED}/gh/ring.png')
    core = load_rgba(f'{SHARED}/gh/core.png')
    for nm, im in (('ring', ring), ('core', core)):
        svg = vectorize_flat(im, [('b', BLUE)], ['b'], scale=4, smooth=0.5)
        sp = out(k, f'gear_{nm}.svg')
        open(sp, 'w').write(svg)
        png = render_svg(sp, out(k, f'gear_{nm}.png'), 1024)
        save(png, k, f'gear_{nm}.png', 'square 1024 canvas shared by ring+core (stack them, rotate ring around centre). Traced from _shared/brand/gh 512 px.')
    g = Image.open(out(k, 'gear_ring.png')).convert('RGBA')
    g.alpha_composite(Image.open(out(k, 'gear_core.png')).convert('RGBA'))
    save(g, k, 'gear.png', 'ring+core composite, 1024 square.')
    wl = trim(load_rgba(f'{SHARED}/gh/word-line.png'))
    wl2 = pad(upscale_lanczos(wl, 2000), 0.01)
    save(wl2, k, 'wordline_on_dark.png', 'one-line GAUSSE HOLLER · CUSTOM LAB wordmark (light). Source _shared/brand/gh/word-line.png 1392 px.')
    save(recolor(wl2, hex2rgb(DARK)), k, 'wordline_on_light.png')
    # "MADE BY ⚙ © 2026 GAUSSE HOLLER" lockup — same typography as the house films (Source Sans 3 600, tracked caps)
    fss = f'{SHARED}/fonts/source-sans-3-latin-600-normal.woff2'
    for variant, col in (('on_dark', '#EEF2F9'), ('on_light', '#0B1E42')):
        H = 200
        p1, w1, cap = text_path(fss, 'MADE BY', 96, 0.22)
        p2, w2, _ = text_path(fss, '© 2026 GAUSSE HOLLER', 96, 0.14)
        gear = 170
        gap = 44
        W = int(w1 + gap + gear + gap + w2 + 8)
        base = H / 2 + cap / 2
        ring_svg = open(out(k, 'gear_ring.svg')).read()
        core_svg = open(out(k, 'gear_core.svg')).read()
        import re as _re
        def inner(s):
            return _re.sub(r'^.*?<svg[^>]*>|</svg>\s*$', '', s, flags=_re.S)
        gx = w1 + gap
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">'
               f'<g fill="{col}"><path transform="translate(4,{base:.1f})" d="{p1}"/>'
               f'<path transform="translate({gx + gear + gap:.1f},{base:.1f})" d="{p2}"/></g>'
               f'<g transform="translate({gx:.1f},{(H - gear) / 2:.1f}) scale({gear / 2048:.5f})">{inner(ring_svg)}{inner(core_svg)}</g></svg>')
        sp = out(k, f'madeby_{variant}.svg')
        open(sp, 'w').write(svg)
        png = render_svg(sp, out(k, f'madeby_{variant}.png'), W * 2)
        save(pad(png, 0.01), k, f'madeby_{variant}.png', 'static lockup MADE BY [gear] © 2026 GAUSSE HOLLER (text as paths, Source Sans 3 600). In the film build it live (ring rotates); this PNG is for standalone banners.')


# =============================================================== Troutshop
def troutshop():
    k = 'troutshop'
    im = load_rgba(f'{ASSETS}/troutshop/logo.png')
    svg = vectorize_flat(im, [('black', '#000000'), ('red', '#E3000F'), ('white', '#FFFFFF')],
                         ['red', 'black', 'white'], scale=6, dilate={'red': 3, 'black': 3}, smooth=0.55)
    open(out(k, 'logo.svg'), 'w').write(svg)
    png = pad(render_svg(out(k, 'logo.svg'), out(k, 'logo_on_light.png'), 2000))
    note = 'VECTORISED from the only available raster (troutshop.eu logo.png 408x201): per-colour unmix + trace (black/red #E3000F/white), rendered 2000 px.'
    save(png, k, 'logo_on_light.png', note)
    save(png, k, 'logo_on_dark.png', 'same artwork: thin red keyline outlines the black fish, reads on navy; on pure black use logo_plate.png.')
    save(rounded_plate(png, 0.12, 0.18), k, 'logo_plate.png')


# =============================================================== Activefishing
def activefishing():
    k = 'activefishing'
    im = pad(trim(load_rgba(f'{ASSETS}/activefishing/logo.png')))
    big = pad(upscale_lanczos(trim(im), 1600), 0.02)
    save(big, k, 'logo_on_dark.png', 'orange gradient fish, white lettering knocked inside. Source Shoptet logo 1000x425 (content 972 px) -> Lanczos 1.65x.')
    save(big, k, 'logo_on_light.png', 'same artwork works on light.')
    save(rounded_plate(big, 0.12, 0.18), k, 'logo_plate.png')


# =============================================================== Moonky
def moonky():
    k = 'moonky'
    NAVY = '#0E1424'  # sampled from the FB badge (14,20,36)
    site = trim(load_rgba(f'{ASSETS}/moonky/logo.png'))
    svg = vectorize_flat(site, [('w', '#FFFFFF')], ['w'], scale=4, smooth=0.45)
    open(out(k, 'logo.svg'), 'w').write(svg)
    png = pad(render_svg(out(k, 'logo.svg'), out(k, 'logo_on_dark.png'), 2000))
    save(png, k, 'logo_on_dark.png', 'symbol + MOONKY, white. Traced from moonky.cz logo 1000x372 -> 2000 px.')
    save(recolor(png, hex2rgb(NAVY)), k, 'logo_on_light.png', f'mono recolour {NAVY} (badge navy).')
    # split symbol / wordmark at the widest empty column gap
    a = np.array(site)[..., 3] > 20
    cols = a.any(0)
    gaps, run = [], None
    for x, c in enumerate(cols):
        if not c and run is None:
            run = x
        if c and run is not None:
            gaps.append((x - run, run, x)); run = None
    _, gx0, gx1 = max(gaps)
    sym, word = trim(site.crop((0, 0, gx0, site.height))), trim(site.crop((gx1, 0, site.width, site.height)))
    sym_svg = vectorize_flat(sym, [('w', '#FFFFFF')], ['w'], scale=6, smooth=0.45)
    word_svg = vectorize_flat(word, [('w', '#FFFFFF')], ['w'], scale=4, smooth=0.45)
    open(out(k, 'mark.svg'), 'w').write(sym_svg)
    m = pad(render_svg(out(k, 'mark.svg'), out(k, 'mark_on_dark.png'), 1200))
    save(m, k, 'mark_on_dark.png', 'fish/moon symbol only, white.')
    save(recolor(m, hex2rgb(NAVY)), k, 'mark_on_light.png')

    # ---- badge replica of the FB avatar: navy disc · symbol · MOONKY · HANDMADE LURES
    import re as _re
    def inner(s):
        return _re.sub(r'^.*?<svg[^>]*>|</svg>\s*$', '', s, flags=_re.S)
    def vb(s):
        return [float(v) for v in _re.search(r'viewBox="([^"]+)"', s).group(1).split()]
    D = 1000.0
    sv, wv = vb(sym_svg), vb(word_svg)
    sym_w = 0.24 * D; ss = sym_w / sv[2]; sym_h = sv[3] * ss
    word_w = 0.62 * D; ws = word_w / wv[2]; word_h = wv[3] * ws
    sub_path, sub_w, sub_cap = text_path(f'{MONT}/montserrat-latin-300-normal.woff2', 'HANDMADE LURES', 100, 0.12)
    sub_s = (0.62 * D) / sub_w
    sub_y = 0.745 * D + sub_cap * sub_s / 2
    badge = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {D:g} {D:g}" width="{D:g}" height="{D:g}">'
             f'<circle cx="{D / 2}" cy="{D / 2}" r="{D / 2}" fill="{NAVY}"/>'
             f'<g transform="translate({(D - sym_w) / 2:.2f},{0.323 * D - sym_h / 2:.2f}) scale({ss:.6f})">{inner(sym_svg)}</g>'
             f'<g transform="translate({(D - word_w) / 2:.2f},{0.594 * D - word_h / 2:.2f}) scale({ws:.6f})">{inner(word_svg)}</g>'
             f'<path fill="#C9CCD4" transform="translate({(D - 0.62 * D) / 2:.2f},{sub_y:.2f}) scale({sub_s:.5f})" d="{sub_path}"/>'
             f'</svg>')
    open(out(k, 'badge.svg'), 'w').write(badge)
    b = render_svg(out(k, 'badge.svg'), out(k, 'badge.png'), 2000)
    save(b, k, 'badge.png', 'clean replica of the FB avatar (navy disc). Symbol+MOONKY traced from site logo; "HANDMADE LURES" set in Montserrat Light (font approximated). Works on any bg.')


# =============================================================== Jigovky
def jigovky():
    k = 'jigovky'
    im = trim(load_rgba(f'{ASSETS}/jigovky/logo.png'))
    big = pad(upscale_lanczos(im, 1800))
    save(big, k, 'logo_on_dark.png', 'white line logo JIGOVKY.CZ + "Jigy, které chytají!". Source Shoptet 1051x512 -> Lanczos 1.9x.')
    dark = recolor(big, (17, 17, 17))
    save(dark, k, 'logo_on_light.png', 'mono recolour #111111.')
    save(rounded_plate(dark, 0.10, 0.18), k, 'logo_plate.png')


# =============================================================== Velka-ryba
def velkaryba():
    k = 'velkaryba'
    im = trim(load_rgba(f'{ASSETS}/velkaryba/logo.png'))
    big = pad(upscale_lanczos(im, 1800))
    save(big, k, 'logo_on_light.png', 'navy script + charcoal fish line art, transparent. Source velka-ryba.cz logo 798x369 -> Lanczos 2.3x.')
    plate = rounded_plate(big, 0.12, 0.18)
    save(plate, k, 'logo_plate.png', 'use this on dark/photo backgrounds (charcoal fish lines vanish on dark).')
    save(plate, k, 'logo_on_dark.png', 'plate version (original colours need a light ground).')


# =============================================================== Bosset
def bosset():
    k = 'bosset'
    src = f'{ASSETS}/bosset/logo.png'
    im = trim(load_rgba(src))
    TEAL = '#1B97B1'  # research/bosset.md
    svg = vectorize_flat(im, [('t', TEAL)], ['t'], scale=4, smooth=0.45)
    open(out(k, 'logo.svg'), 'w').write(svg)
    png = pad(render_svg(out(k, 'logo.svg'), out(k, 'logo_on_light.png'), 2000))
    save(png, k, 'logo_on_light.png', f'teal {TEAL} B-mark + BOSSET / FISHING. Traced from bosset.cz e-shop logo 1000x200 (cdn.myshoptet.com/usr/www.bosset.cz/user/logos/bosset_logo_eshop_bez_pozadi.png).')
    save(recolor(png, (255, 255, 255)), k, 'logo_on_dark.png', 'mono white (teal is low-contrast on navy).')
    save(rounded_plate(png, 0.18, 0.22), k, 'logo_plate.png')


# =============================================================== Líheň Liběchov (venue partner)
def libechov():
    k = 'libechov'
    im = trim(load_rgba(f'{ASSETS}/libechov/logo.png'))
    save(im, k, 'logo.png', 'round white badge with trout drawing, rendered from original SVG (lihenlibechov.cz/images/logo.svg). Works on dark+light.')
    shutil.copy(f'{ASSETS}/libechov/logo.svg', out(k, 'logo.svg'))


if __name__ == '__main__':
    which = sys.argv[1:] or ['ta_cz', 'gausseholler', 'troutshop', 'activefishing', 'moonky', 'jigovky', 'velkaryba', 'bosset', 'libechov']
    for w in which:
        globals()[w]()
        print('done', w)
    p = f'{OUT}/_logos_notes.json'
    old = json.load(open(p)) if os.path.exists(p) else {}
    old.update(NOTES)
    json.dump(old, open(p, 'w'), indent=1, ensure_ascii=False)
