"""QA sheet + manifest for assets_prep/ftfishing/ads: each cut-out on dark #0E1110, light #F2F2F0 and FT green #6DB52C.
usage: python3 -I sheet_ft.py [out.jpg]  (default ads/_sheet.jpg)"""
import glob, json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
P = '/home/user/Clipcreator/projects/mcr-2026-sponzori'
D = f'{P}/assets_prep/ftfishing/ads'
BGS = [(14, 17, 16), (242, 242, 240), (109, 181, 44)]
fs = [f for f in sorted(glob.glob(f'{D}/[HS]*.png')) if not f.endswith('_shadow.png')]
C = 300
sheet = Image.new('RGB', (C * 3 + 260, C * len(fs)), (40, 40, 40))
dr = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 14)
except Exception:
    font = ImageFont.load_default()
man = []
for i, f in enumerate(fs):
    im = Image.open(f).convert('RGBA')
    a = np.asarray(im)[..., 3]
    t = im.copy(); t.thumbnail((C - 16, C - 16), Image.LANCZOS)
    for j, bg in enumerate(BGS):
        cell = Image.new('RGBA', (C, C), bg + (255,))
        cell.alpha_composite(t, ((C - t.width) // 2, (C - t.height) // 2))
        sheet.paste(cell.convert('RGB'), (j * C, i * C))
    n = os.path.basename(f)[:-4]
    dr.text((C * 3 + 8, i * C + 10), n.replace('_', ' ')[:34], fill=(255, 255, 255), font=font)
    dr.text((C * 3 + 8, i * C + 30), f'{im.width}×{im.height}', fill=(200, 200, 200), font=font)
    man.append(dict(file=f'assets_prep/ftfishing/ads/{n}.png', w=im.width, h=im.height,
                    role='hero' if n.startswith('H') else 'secondary',
                    brand=n.split('_')[1], shadow=os.path.exists(f'{D}/{n}_shadow.png'),
                    opaque_frac=round(float((a > 250).mean()), 3)))
out = sys.argv[1] if len(sys.argv) > 1 else f'{D}/_sheet.jpg'
sheet.save(out, quality=88)
json.dump(man, open(f'{D}/manifest.json', 'w'), indent=1)
print(out, len(fs))
