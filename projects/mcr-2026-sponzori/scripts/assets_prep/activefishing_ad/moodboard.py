"""Brand-world mood frames for the two concepts (1080×1920 each, saved downscaled side by side) → ads/_brandworld.jpg"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from typo import Face
P = '/home/user/Clipcreator/projects/mcr-2026-sponzori'
A = f'{P}/assets_prep/activefishing/ads'
W, H = 1080, 1920
SAI = 'saira-extra-condensed-{r}-900-normal'
NUN = 'nunito-{r}-wght-normal'

def nun(size, w=900):
    f = Face(NUN, size)
    for ff in f.fonts:
        try: ff.set_variation_by_axes([w])
        except Exception: pass
    return f

def grad(w, h, top, bot):
    t = np.linspace(0, 1, h)[:, None, None]
    g = np.array(top)[None, None] * (1 - t) + np.array(bot)[None, None] * t
    return Image.fromarray(np.repeat(g, w, 1).astype(np.uint8), 'RGB').convert('RGBA')

def radial(w, h, cx, cy, r, inner, outer):
    yy, xx = np.mgrid[0:h, 0:w]
    d = np.clip(np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / r, 0, 1)[..., None]
    g = np.array(inner) * (1 - d) ** 1.6 + np.array(outer) * (1 - (1 - d) ** 1.6)
    return Image.fromarray(g.astype(np.uint8), 'RGB').convert('RGBA')

def place(base, png, w, cx, cy, rot=0, shadow=True, floor=None):
    im = Image.open(png).convert('RGBA')
    s = w / im.width
    im = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
    if rot: im = im.rotate(rot, Image.BICUBIC, expand=True)
    if shadow:
        a = np.asarray(im)[..., 3].astype(np.float32)
        sh = Image.fromarray((a * 0.45).astype(np.uint8), 'L').filter(ImageFilter.GaussianBlur(w * 0.03))
        blk = Image.new('RGBA', im.size, (0, 0, 0, 255)); blk.putalpha(sh)
        base.alpha_composite(blk, (int(cx - im.width / 2 + w * 0.02), int(cy - im.height / 2 + w * 0.05)))
    base.alpha_composite(im, (int(cx - im.width / 2), int(cy - im.height / 2)))

def ta_plate(base):
    p = f'{P}/assets_prep/ta_cz/logo_h_plate.png'
    if os.path.exists(p):
        im = Image.open(p).convert('RGBA'); s = 300 / im.width
        im = im.resize((300, int(im.height * s)), Image.LANCZOS); base.alpha_composite(im, (64, 250))

def pill(d, x, y, text, f, bg, fg, pad=(34, 14), r=40, outline=None):
    tw = f.width(text); h = f.size + pad[1] * 2
    d.rounded_rectangle([x, y, x + tw + pad[0] * 2, y + h], r, fill=bg, outline=outline, width=4 if outline else 0)
    f.draw(d, (x + pad[0], y + pad[1] - f.size * 0.12), text, fg)
    return x + tw + pad[0] * 2

# ---- A: ORANGE HOUR (black studio + logo-orange light) ----
a = radial(W, H, 760, 1080, 1100, (226, 110, 45), (8, 8, 9))
glow = radial(W, H, 300, 1500, 700, (120, 40, 20), (0, 0, 0)); a = Image.blend(a, Image.composite(glow, a, Image.new('L', (W, H), 0)), 0)
d = ImageDraw.Draw(a)
big = Face(SAI, 560)
lay = Image.new('RGBA', (W, H), (0, 0, 0, 0)); big.draw(ImageDraw.Draw(lay), (-30, 700), 'PŘÍVLAČ', (255, 255, 255, 30)); a.alpha_composite(lay)
place(a, f'{A}/H1_timon_chibi_futten_fs_tropical_chart_pink.png', 1250, 560, 1180, rot=12)
f1 = Face(SAI, 150)
f1.draw(d, (64, 430), 'ZROZENÝ Z', (255, 255, 255))
f1.draw(d, (64, 575), 'VÁŠNĚ', (242, 138, 39)); f1.draw(d, (64 + f1.width('VÁŠNĚ ') , 575), 'PRO PŘÍVLAČ', (255, 255, 255))
pill(d, 64, 1410, 'TIMON · CHIBI FUTTEN FS · 51 MM', nun(34, 800), (0, 0, 0, 150), (255, 255, 255), outline=(242, 138, 39))
lg = Image.open(f'{P}/assets_prep/activefishing/logo_on_dark.png').convert('RGBA'); lg.thumbnail((270, 120), Image.LANCZOS)
a.alpha_composite(lg, (W - 64 - lg.width, 250))
ta_plate(a)

# ---- B: COLOUR DROP (white studio, colourway drop, orange numerals) ----
b = grad(W, H, (250, 250, 249), (232, 231, 228))
d = ImageDraw.Draw(b)
num = Face(SAI, 420)
og = grad(W, 420, (0xE3, 0x90, 0x25), (0xDF, 0x59, 0x42))
txt = Image.new('L', (W, 460), 0); dt = ImageDraw.Draw(txt)
for c, x in ((None, None),):
    pass
x = 64
for ch in '1 300+':
    fch = num.pick(ch)
    if ch == ' ':
        x += num.size * 0.16; continue
    dt.text((x, -40), ch, font=fch, fill=255); x += fch.getlength(ch)
og = og.resize((W, 460)); b.paste(og, (0, 400), txt)
nun(110, 950).draw(d, (70, 830), 'PLANDAVEK', (17, 17, 17))
nun(44, 700).draw(d, (72, 960), 'a 777 woblerů pro trout area', (65, 65, 65))
rows = ['S1_timon_chibi_futten_fs_uv_cobalt_blue', 'H1_timon_chibi_futten_fs_tropical_chart_pink', 'S3_timon_chibi_futten_fs_gold_shower', 'S2_timon_chibi_futten_fs_red_black_glitter', 'S4_timon_chibi_futten_fs_hologram_bait']
for i, n in enumerate(rows):
    place(b, f'{A}/{n}.png', 500 if n.startswith('S') else 580, 330 + i * 30, 1190 + i * 95, rot=-4)
place(b, f'{A}/H2_nories_sofia_1-2g_sk017_hot_mango_pair.png', 380, 840, 1330, rot=0)
xx = pill(d, 64, 1040, 'OSOBNÍ PŘÍSTUP', nun(40, 800), (242, 138, 39), (255, 255, 255))
pill(d, xx + 20, 1040, 'UNIKÁTNÍ SORTIMENT', nun(40, 800), (255, 255, 255), (72, 72, 72), outline=(242, 138, 39))
ta_plate(b)
lg2 = Image.open(f'{P}/assets_prep/activefishing/logo_on_light.png').convert('RGBA'); lg2.thumbnail((270, 120), Image.LANCZOS)
b.alpha_composite(lg2, (W - 64 - lg2.width, 250))

# ---- B end card: orange field + white knockout logo + URL ----
c = grad(W, H, (0xE3, 0x90, 0x25), (0xDF, 0x59, 0x42))
d = ImageDraw.Draw(c)
place(c, f'{A}/H3_varivas_super_trout_area_es2_ester_natural.png', 620, 540, 760, shadow=True)
ko = Image.open(f'{A}/logo_white_knockout.png').convert('RGBA'); ko.thumbnail((280, 125), Image.LANCZOS)
c.alpha_composite(ko, (W // 2 - ko.width // 2, 1060))
f3 = Face(SAI, 120); t = 'ACTIVEFISHING.CZ'; f3.draw(d, (W / 2 - f3.width(t) / 2, 1200), t, (255, 255, 255))
f4 = nun(42, 800); t = 'Partner MČR v Trout Area 2026'; f4.draw(d, (W / 2 - f4.width(t) / 2, 1350), t, (255, 255, 255))
ta_plate(c)

# safe-zone guides (thin) for review
for im in (a, b, c):
    g = ImageDraw.Draw(im)
    g.rectangle([64, 240, W - 64, H - 460], outline=(0, 200, 255, 90), width=2)
out = Image.new('RGB', (3 * 540 + 40, 960 + 20), (60, 60, 60))
for i, im in enumerate((a, b, c)):
    out.paste(im.convert('RGB').resize((540, 960), Image.LANCZOS), (10 + i * 550, 10))
out.save(f'{A}/_brandworld.jpg', quality=88)
print(out.size)
