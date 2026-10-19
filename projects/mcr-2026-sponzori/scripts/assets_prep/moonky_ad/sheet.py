"""Contact sheet for the Moonky ad cut-outs: brand header (swatches + type specimen) and every cut-out on 4 backgrounds
(black, light, Moonky night navy, moonky.cz web blue) with a soft contact shadow.
usage: python3 -I sheet.py <project_root> <scratch_dir_for_ttf>
"""
import sys, os, json, importlib.util
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT, TMP = sys.argv[1], sys.argv[2]
D = f'{ROOT}/assets_prep/moonky/ads'
spec = importlib.util.spec_from_file_location('vcut', f'{ROOT}/scripts/assets_prep/velkaryba_ad/cut.py')
vcut = importlib.util.module_from_spec(spec); spec.loader.exec_module(vcut)
meta = json.load(open(f'{D}/_meta.json'))
os.makedirs(TMP, exist_ok=True)


def inst(stem, wght, ital=False):
    """static TTF instances of a variable woff2 pair (latin + latin-ext) → list of PIL fonts by subset"""
    out = []
    for r in ('latin', 'latin-ext'):
        src = f'{ROOT}/fonts/{stem}-{r}-wght-{"italic" if ital else "normal"}.woff2'
        dst = f'{TMP}/{stem}-{r}-{wght}{"i" if ital else ""}.ttf'
        if not os.path.exists(dst):
            f = TTFont(src); f.flavor = None
            instancer.instantiateVariableFont(f, {'wght': wght}, inplace=True)
            f.save(dst)
        out.append(dst)
    return out


class MixFont:
    def __init__(self, paths, size):
        self.f = [ImageFont.truetype(p, size) for p in paths]
        self.cm = [set(TTFont(p).getBestCmap().keys()) for p in paths]

    def draw(self, d, xy, text, fill, track=0):
        x, y = xy
        for ch in text:
            i = 0 if ord(ch) in self.cm[0] else 1
            d.text((x, y), ch, font=self.f[i], fill=fill)
            x += self.f[i].getlength(ch) + track
        return x


EXO_BLACK_I = inst('exo-2', 900, True)
EXO_800 = inst('exo-2', 800)
EXO_300 = inst('exo-2', 300)
SS_600 = inst('source-sans-3', 600)
SS_400 = inst('source-sans-3', 400)

BANDS = [('black #000000 (moonky.cz header)', (0, 0, 0), (225, 225, 225)),
         ('light #F2F2F0', (242, 242, 240), (40, 40, 40)),
         ('Moonky night #0E1424 (logo badge)', (14, 20, 36), (230, 235, 245)),
         ('moonky.cz web blue #6883BA', (104, 131, 186), (255, 255, 255))]
SW = [('#0E1424', 'night (badge, labels)'), ('#FFFFFF', 'logo'), ('#6883BA', 'web bg (moonlight)'), ('#000000', 'web header'),
      ('#9CC903', 'C06 green (lime)*'), ('#EC638B', 'C01 pink bubblegum*'), ('#F49E0B', 'C02 orange fluo*'), ('#D2BA46', 'DC04 yellow*'),
      ('#734545', 'C03 brown metalic*'), ('#1184B8', 'blue (category lure)*')]

W = 1800
heroes = [k for k in meta if k.startswith('H')]
secs = sorted([k for k in meta if k.startswith('S')], key=lambda s: int(s.split('_')[0][1:]))
HROW, CELL, COLS = 380, 300, 6
srows = (len(secs) + COLS - 1) // COLS
BH = 44 + HROW + srows * (CELL - 20) + 20
HEAD = 470
sheet = Image.new('RGB', (W, HEAD + BH * len(BANDS)), (14, 20, 36))
d = ImageDraw.Draw(sheet)

# ---- header: logo, swatches, type specimen
logo = Image.open(f'{ROOT}/assets_prep/moonky/logo_on_dark.png').convert('RGBA'); logo.thumbnail((420, 120))
sheet.paste(logo, (40, 30), logo)
MixFont(SS_400, 22).draw(d, (40, 165), 'Moonky — ads cut-outs + brand world (MČR 2026) · * = product colours sampled from cut-outs', (170, 180, 200))
for i, (hx, lab) in enumerate(SW):
    x = 40 + (i % 5) * 176; y = 210 + (i // 5) * 110
    c = tuple(int(hx[j:j + 2], 16) for j in (1, 3, 5))
    d.rounded_rectangle((x, y, x + 60, y + 60), 10, fill=c, outline=(80, 90, 110))
    MixFont(SS_600, 18).draw(d, (x + 70, y + 6), hx, (235, 238, 245))
    MixFont(SS_400, 13).draw(d, (x + 70, y + 32), lab[:14], (160, 170, 190))
    MixFont(SS_400, 13).draw(d, (x + 70, y + 48), lab[14:30], (160, 170, 190))
MixFont(EXO_BLACK_I, 76).draw(d, (930, 30), 'RUČNĚ DĚLANÉ', (255, 255, 255))
MixFont(EXO_800, 44).draw(d, (930, 125), 'Gumové nástrahy pro Trout Area', (156, 201, 3))
MixFont(EXO_300, 30).draw(d, (930, 185), 'H A N D M A D E   L U R E S', (200, 210, 230), track=2)
MixFont(SS_600, 30).draw(d, (930, 240), '46 mm · 2,12 g · extra měkká · ruční výroba · ČR', (230, 235, 245))
MixFont(SS_400, 24).draw(d, (930, 290), 'Exo 2 (moonky.cz headings) 900 italic / 800 / 300 · Source Sans 3 (web body) 600 / 400', (150, 160, 180))
MixFont(SS_400, 24).draw(d, (930, 325), 'Vlastní CNC formy · Vývoj s reprezentací ČR · moonky.cz', (150, 160, 180))


def place(band, im, box, label, fg, hero=False):
    x0, y0, w, h = box
    t = im.copy(); t.thumbnail((w - 30, h - 70), Image.LANCZOS)
    px = x0 + (w - t.width) // 2; py = y0 + (h - 50 - t.height) // 2 + 6
    sh = vcut.contact_shadow2(t, width_frac=0.78, opacity=0.5 if band != (0, 0, 0) else 0.8)
    sy = py + int(t.height * 0.86) - sh.height // 2
    canvas.alpha_composite(sh, (max(0, px + t.width // 2 - sh.width // 2), max(0, sy)))
    canvas.alpha_composite(t, (px, py))
    f1 = MixFont(SS_600, 17 if hero else 14)
    f1.draw(dd, (x0 + 10, y0 + h - 44), label[:60] if hero else label[:38], fg)
    MixFont(SS_400, 14 if hero else 12).draw(dd, (x0 + 10, y0 + h - 22), f'{im.width}×{im.height} px', fg)


for b, (name, bg, fg) in enumerate(BANDS):
    canvas = Image.new('RGBA', (W, BH), bg + (255,))
    dd = ImageDraw.Draw(canvas)
    MixFont(SS_600, 20).draw(dd, (16, 10), f'{name}', fg)
    for i, k in enumerate(heroes):
        im = Image.open(f'{D}/{k}.png').convert('RGBA')
        place(bg, im, (i * 600, 44, 600, HROW), f'{k.split("_")[0]} · {meta[k]["product"]}', fg, hero=True)
    for i, k in enumerate(secs):
        im = Image.open(f'{D}/{k}.png').convert('RGBA')
        place(bg, im, ((i % COLS) * CELL, 44 + HROW + (i // COLS) * (CELL - 20), CELL, CELL - 20), f'{k.split("_")[0]} · {meta[k]["product"]}', fg)
    sheet.paste(canvas.convert('RGB'), (0, HEAD + b * BH))
sheet.save(f'{D}/_sheet.jpg', quality=88)
print(sheet.size, len(heroes), len(secs))
