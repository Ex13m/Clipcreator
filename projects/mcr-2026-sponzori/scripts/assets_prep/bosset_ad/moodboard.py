"""Brand-world mood frames (1080×1920, Reels safe zone, TA plate at its real position) -> assets_prep/bosset/ads/_brandworld.jpg
Fonts: Saira variable instances (wdth 125 = Expanded) made with fontTools from fonts/saira-*-wdth-normal.woff2."""
import os, io, numpy as np
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from PIL import Image, ImageDraw, ImageFont, ImageFilter
P = '/home/user/Clipcreator/projects/mcr-2026-sponzori'
A = f'{P}/assets_prep/bosset/ads'
TMP = '/tmp/claude-0/-home-user-Clipcreator/71aa791e-2b52-549a-940d-d7fdf5b83edd/scratchpad/bosset/ttf'
os.makedirs(TMP, exist_ok=True)
W, H = 1080, 1920
TEAL, TEAL_D, LBLUE, YEL, INK = (27, 151, 177), (10, 74, 88), (197, 235, 252), (255, 197, 0), (8, 12, 14)


def inst(sub, wdth, wght):
    out = f'{TMP}/saira_{sub}_{wdth}_{wght}.ttf'
    if not os.path.exists(out):
        f = TTFont(f'{P}/fonts/saira-{sub}-wdth-normal.woff2'); f.flavor = None
        instancer.instantiateVariableFont(f, {'wdth': wdth, 'wght': wght}).save(out)
    return out


class Saira:
    def __init__(self, size, wdth=125, wght=900):
        self.f = [ImageFont.truetype(inst(s, wdth, wght), size) for s in ('latin', 'latin-ext')]
        self.cmap = [set(TTFont(inst(s, wdth, wght))['cmap'].getBestCmap()) for s in ('latin', 'latin-ext')]
    def pick(self, ch):
        return self.f[0] if ord(ch) in self.cmap[0] or ord(ch) not in self.cmap[1] else self.f[1]
    def width(self, t, track=0):
        return sum(self.pick(c).getlength(c) for c in t) + track * max(0, len(t) - 1)
    def draw(self, d, xy, t, fill, track=0, anchor='ls'):
        x, y = xy
        if anchor == 'ms': x -= self.width(t, track) / 2
        for c in t:
            d.text((x, y), c, font=self.pick(c), fill=fill, anchor='ls'); x += self.pick(c).getlength(c) + track


def grad(c1, c2, radial=True, cy=0.45):
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    t = np.clip(np.sqrt(((xx - W / 2) / W) ** 2 + ((yy - H * cy) / H) ** 2) * 1.6, 0, 1) if radial else yy / H
    c = np.array(c1, np.float32) * (1 - t[..., None]) + np.array(c2, np.float32) * t[..., None]
    return Image.fromarray(c.astype(np.uint8), 'RGB').convert('RGBA')


def put(can, name, h=None, w=None, cx=540, floor=None, cy=None, shadow=True):
    im = Image.open(f'{A}/{name}.png').convert('RGBA')
    k = (h / im.height) if h else (w / im.width)
    k = min(k, 1.0)                                                 # never upscale
    im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    x = int(cx - im.width / 2); y = int(floor - im.height) if floor is not None else int(cy - im.height / 2)
    if shadow and os.path.exists(f'{A}/{name}_shadow.png'):
        s = Image.open(f'{A}/{name}_shadow.png'); s = s.resize((round(s.width * k), round(s.height * k)))
        can.alpha_composite(s, (int(cx - s.width / 2), y + im.height - s.height // 2))
    can.alpha_composite(im, (x, y)); return im.size


def ta_plate(can):
    pl = Image.open(f'{P}/assets_prep/ta_cz/logo_h_plate.png').convert('RGBA')
    pl = pl.resize((300, round(pl.height * 300 / pl.width)), Image.LANCZOS); can.alpha_composite(pl, (64, 250))


def logo(can, which, w, xy):
    lg = Image.open(f'{P}/assets_prep/bosset/{which}.png').convert('RGBA')
    lg = lg.resize((w, round(lg.height * w / lg.width)), Image.LANCZOS); can.alpha_composite(lg, xy)


def chip(d, xy, text, f, bg, fg, pad=(26, 18), r=18):
    x, y = xy; tw = f.width(text, 2)
    d.rounded_rectangle((x, y, x + tw + 2 * pad[0], y + 2 * pad[1] + f.f[0].size * 0.78), r, fill=bg)
    f.draw(d, (x + pad[0], y + pad[1] + f.f[0].size * 0.74), text, fg, track=2)


def frame_a():   # concept A key frame: winner's podium
    can = grad((40, 176, 204), TEAL_D, cy=0.68); d = ImageDraw.Draw(can)   # type sits on the deep teal (yellow on #0A4A58 = 6.2:1)
    big = Saira(118); small = Saira(40, 125, 400)
    big.draw(d, (540, 560), 'CENY PRO', (255, 255, 255), anchor='ms')
    big.draw(d, (540, 690), 'VÍTĚZE', YEL, anchor='ms')
    d.rounded_rectangle((250, 1330, 830, 1470), 10, fill=LBLUE); d.rectangle((250, 1330, 830, 1350), fill=(236, 249, 255))
    small.draw(d, (540, 1418), '1', TEAL_D, anchor='ms')
    put(can, 'H1_zojirushi_sm-vb_0-6l_black', h=600, floor=1338)
    chip(d, (600, 760), 'AŽ 6 HODIN', Saira(40, 110, 800), YEL, INK)
    logo(can, 'logo_on_dark', 260, (756, 262))
    ta_plate(can); return can


def frame_b():   # colour run on the site's light blue
    can = grad((236, 249, 255), LBLUE, radial=False); d = ImageDraw.Draw(can)
    f = Saira(92); s = Saira(36, 125, 400)
    f.draw(d, (540, 520), 'TERMOSKY', TEAL_D, anchor='ms')   # teal text on light blue is only 2.7:1 -> deep teal
    f.draw(d, (540, 630), '0,5–0,7 L', INK, anchor='ms')
    xs = [190, 365, 540, 715, 890]
    for x, n in zip(xs, ['S1_zojirushi_sm-she_0-6l_orange', 'H2_zojirushi_sm-sr_0-6l_green', 'H1_zojirushi_sm-vb_0-6l_black',
                         'S2_zojirushi_sm-sr_0-6l_pink', 'S5_zojirushi_sm-vb_0-6l_beige']):
        put(can, n, h=560 if 'H1' not in n else 620, cx=x, floor=1380)
    s.draw(d, (540, 1450), 'H O R K É   I   S T U D E N É', TEAL_D, anchor='ms')
    ta_plate(can); return can


def frame_c():   # macro: one-hand open (SM-SR) on deep ink with teal rim light
    can = grad((22, 40, 46), INK, cy=0.62); d = ImageDraw.Draw(can)
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0)); gd = ImageDraw.Draw(glow)
    gd.ellipse((140, 700, 1000, 1500), fill=TEAL + (150,)); can.alpha_composite(glow.filter(ImageFilter.GaussianBlur(120)))
    put(can, 'H2m_zojirushi_sm-sr_green_lid_open_macro', w=1000, cx=560, floor=H + 40, shadow=False)   # body bleeds off the bottom
    f = Saira(96); lab = Saira(34, 125, 500)
    f.draw(d, (90, 520), 'JEDNOU', (255, 255, 255)); f.draw(d, (90, 630), 'RUKOU', YEL)
    lab.draw(d, (94, 690), 'DOUBLE LOCK · SM-SR 0,6 L', (170, 222, 233), track=3)
    ta_plate(can); return can


def frame_d():   # concept B: the shop behind the prizes (Keitech + YGK X-Braid)
    can = grad((18, 22, 24), INK, cy=0.4); d = ImageDraw.Draw(can)
    d.polygon([(0, 1060), (1080, 860), (1080, 1180), (0, 1380)], fill=YEL)
    lure = Image.open(f'{A}/H3_keitech_easy_shiner_4in_ice_chartreuse_pal03t.png').convert('RGBA')
    lure = lure.resize((1000, round(lure.height * 1000 / lure.width)), Image.LANCZOS).rotate(10, expand=True, resample=Image.BICUBIC)
    can.alpha_composite(lure, (40, 1060 - lure.height // 2))
    put(can, 'S6_ygk_x-braid_upgrade_x8_150m', w=430, cx=790, floor=1440, shadow=False)
    f = Saira(70, 125, 900); s = Saira(36, 125, 500)
    s.draw(d, (90, 470), 'OFICIÁLNÍ DISTRIBUTOR PRO ČR', TEAL, track=2)
    f.draw(d, (90, 570), 'KEITECH', (255, 255, 255)); f.draw(d, (90, 660), 'YGK X-BRAID', (255, 255, 255))
    ta_plate(can); return can


frames = [frame_a(), frame_b(), frame_c(), frame_d()]
names = ['A · Ceny pro vítěze (podium)', 'A · Colour run (site light blue)', 'A · Macro: jednou rukou', 'B · Obchod za cenami']
sc = 0.5; fw, fh = int(W * sc), int(H * sc); gap = 24
out = Image.new('RGB', (4 * fw + 5 * gap, fh + 70), (30, 30, 30)); dd = ImageDraw.Draw(out)
lab = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 18)
for i, (fr, nm) in enumerate(zip(frames, names)):
    x = gap + i * (fw + gap)
    g = fr.convert('RGB').resize((fw, fh), Image.LANCZOS)
    gd = ImageDraw.Draw(g, 'RGBA')                                   # Reels UI zones (top 240 / bottom 460 / right column)
    gd.rectangle((0, 0, fw, 240 * sc), fill=(255, 0, 0, 28)); gd.rectangle((0, fh - 460 * sc, fw, fh), fill=(255, 0, 0, 28))
    gd.rectangle((fw - 140 * sc, 900 * sc, fw, fh), fill=(255, 0, 0, 22))
    out.paste(g, (x, 46)); dd.text((x, 14), nm, fill=(230, 230, 230), font=lab)
out.save(f'{A}/_brandworld.jpg', quality=88); print(out.size)
