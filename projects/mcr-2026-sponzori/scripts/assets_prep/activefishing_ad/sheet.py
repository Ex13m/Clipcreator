"""Contact sheet: every ads cut-out on dark / light / brand orange (+ the logo) → ads/_sheet.jpg"""
import glob, os
from PIL import Image, ImageDraw, ImageFont
P = '/home/user/Clipcreator/projects/mcr-2026-sponzori'
D = f'{P}/assets_prep/activefishing/ads'
files = sorted(f for f in glob.glob(f'{D}/[HS]*.png') if not f.endswith('_shadow.png'))
files.append(f'{P}/assets_prep/activefishing/logo_on_dark.png')
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
font = ImageFont.truetype(F, 20) if os.path.exists(F) else ImageFont.load_default()
small = ImageFont.truetype(F, 13) if os.path.exists(F) else ImageFont.load_default()
cell = 330; cols = 5; rows = (len(files) + cols - 1) // cols
bands = [('dark #0B0B0C', (11, 11, 12), (225, 225, 225)),
         ('light #F2F2F0', (242, 242, 240), (40, 40, 40)),
         ('brand orange gradient #E39025 → #DF5942', None, (255, 255, 255))]
bh = rows * (cell + 34) + 46
W = cols * cell
sheet = Image.new('RGB', (W, bh * len(bands)), 'black')
for b, (name, bg, fg) in enumerate(bands):
    if bg is None:
        band = Image.new('RGBA', (W, bh))
        top, bot = (0xE3, 0x90, 0x25), (0xDF, 0x59, 0x42)
        d0 = ImageDraw.Draw(band)
        for y in range(bh):
            t = y / (bh - 1)
            d0.line([(0, y), (W, y)], fill=tuple(round(top[i] + (bot[i] - top[i]) * t) for i in range(3)) + (255,))
    else:
        band = Image.new('RGBA', (W, bh), bg + (255,))
    d = ImageDraw.Draw(band)
    d.text((12, 10), f'activefishing ads cut-outs — {name}', fill=fg, font=font)
    for i, f in enumerate(files):
        im = Image.open(f).convert('RGBA')
        t = im.copy(); t.thumbnail((cell - 30, cell - 60), Image.LANCZOS)
        x = (i % cols) * cell; y = 46 + (i // cols) * (cell + 34)
        px = x + (cell - t.width) // 2; py = y + (cell - 60 - t.height) // 2 + 8
        sh = f.replace('.png', '_shadow.png')
        if os.path.exists(sh):
            s = Image.open(sh).convert('RGBA')
            k = t.width / im.width
            s = s.resize((max(4, int(s.width * k)), max(4, int(s.height * k))), Image.LANCZOS)
            band.alpha_composite(s, (max(0, px + t.width // 2 - s.width // 2), min(bh - s.height, py + t.height - s.height // 2)))
        band.alpha_composite(t, (px, py))
        d.text((x + 8, y + cell - 48), os.path.basename(f)[:-4][:40], fill=fg, font=small)
        d.text((x + 8, y + cell - 30), f'{im.width}×{im.height}', fill=fg, font=small)
    sheet.paste(band.convert('RGB'), (0, b * bh))
sheet.save(f'{D}/_sheet.jpg', quality=88)
print(sheet.size, len(files))
