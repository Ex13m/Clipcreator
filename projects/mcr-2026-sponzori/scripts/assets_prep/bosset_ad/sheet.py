"""Contact sheet of assets_prep/bosset/ads on dark / light / brand teal #1B97B1 / brand light blue #C5EBFC -> ads/_sheet.jpg"""
import glob, os
from PIL import Image, ImageDraw, ImageFont
D = '/home/user/Clipcreator/projects/mcr-2026-sponzori/assets_prep/bosset/ads'
L = '/home/user/Clipcreator/projects/mcr-2026-sponzori/assets_prep/bosset'
files = sorted(f for f in glob.glob(f'{D}/[HS]*.png') if not f.endswith('_shadow.png'))
fnt = lambda s: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', s)
cell = 340; cols = 7; rows = (len(files) + 1 + cols - 1) // cols
bands = [('dark #0A0F12', (10, 15, 18), (225, 228, 230), 'logo_on_dark.png'),
         ('light #F4F6F5', (244, 246, 245), (40, 40, 40), 'logo_on_light.png'),
         ('brand teal #1B97B1 (logo colour)', (27, 151, 177), (240, 250, 252), 'logo_on_dark.png'),
         ('brand light blue #C5EBFC (site header)', (197, 235, 252), (11, 29, 36), 'logo_on_light.png')]
bh = rows * (cell + 34) + 46
sheet = Image.new('RGB', (cols * cell, bh * len(bands)), 'black')
for b, (name, bg, fg, logo) in enumerate(bands):
    band = Image.new('RGBA', (cols * cell, bh), bg + (255,))
    d = ImageDraw.Draw(band)
    d.text((12, 10), f'Bosset ad cut-outs — {name}', fill=fg, font=fnt(20))
    items = files + [f'{L}/{logo}']
    for i, f in enumerate(items):
        im = Image.open(f).convert('RGBA')
        t = im.copy(); t.thumbnail((cell - 36, cell - 64), Image.LANCZOS)
        x = (i % cols) * cell; y = 46 + (i // cols) * (cell + 34)
        px = x + (cell - t.width) // 2; py = y + (cell - 64 - t.height) // 2 + 6
        sh = f.replace('.png', '_shadow.png')
        if os.path.exists(sh) and 'zojirushi' in f:
            s = Image.open(sh); k = t.width / im.width
            s = s.resize((max(4, int(s.width * k)), max(4, int(s.height * k))))
            band.alpha_composite(s, (max(0, px + t.width // 2 - s.width // 2), min(bh - s.height, py + t.height - s.height // 2)))
        band.alpha_composite(t, (px, py))
        lab = os.path.basename(f)[:-4]
        d.text((x + 8, y + cell - 52), lab[:44], fill=fg, font=fnt(11))
        d.text((x + 8, y + cell - 36), f'{im.width}×{im.height}', fill=fg, font=fnt(12))
    sheet.paste(band.convert('RGB'), (0, b * bh))
sheet.save(f'{D}/_sheet.jpg', quality=88)
print(sheet.size, len(files))
