import glob, os
from PIL import Image, ImageDraw, ImageFont
D = '/home/user/Clipcreator/projects/mcr-2026-sponzori/assets_prep/velkaryba/ads'
files = sorted(f for f in glob.glob(f'{D}/[HS]*.png') if not f.endswith('_shadow.png'))
files.append(f'{D}/logo_reverse_on_navy.png')
try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 18)
except Exception:
    font = ImageFont.load_default()
cell = 300; cols = 6; rows = (len(files) + cols - 1) // cols
bands = [('dark', (14, 18, 26), (220, 220, 220)), ('light', (242, 242, 240), (40, 40, 40)), ('brand navy #183C6B', (24, 60, 107), (235, 240, 250))]
bh = rows * (cell + 30) + 40
sheet = Image.new('RGB', (cols * cell, bh * len(bands)), 'black')
for b, (name, bg, fg) in enumerate(bands):
    band = Image.new('RGBA', (cols * cell, bh), bg + (255,))
    d = ImageDraw.Draw(band)
    d.text((10, 8), f'velkaryba ads cut-outs — {name}', fill=fg, font=font)
    for i, f in enumerate(files):
        im = Image.open(f).convert('RGBA')
        sh = f.replace('.png', '_shadow.png')
        t = im.copy(); t.thumbnail((cell - 30, cell - 50))
        x = (i % cols) * cell; y = 40 + (i // cols) * (cell + 30)
        px = x + (cell - t.width) // 2; py_ = y + (cell - 50 - t.height) // 2 + 10
        if os.path.exists(sh):
            k = t.width / im.width
            s = Image.open(sh); s = s.resize((max(4, int(s.width * k)), max(4, int(s.height * k))))
            band.alpha_composite(s, (px + t.width // 2 - s.width // 2 if px + t.width // 2 - s.width // 2 >= 0 else 0, min(bh - s.height, py_ + t.height - s.height // 2)))
        band.alpha_composite(t, (px, py_))
        lab = os.path.basename(f)[:-4]
        d.text((x + 8, y + cell - 34), lab[:34], fill=fg, font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 12) if hasattr(font, 'path') else font)
        d.text((x + 8, y + cell - 18), f'{im.width}×{im.height}', fill=fg, font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 12) if hasattr(font, 'path') else font)
    sheet.paste(band.convert('RGB'), (0, b * bh))
sheet.save(f'{D}/_sheet.jpg', quality=88)
print(sheet.size, len(files))
