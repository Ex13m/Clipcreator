"""Contact sheet for assets_prep/gausseholler/ads: every cut-out on dark (#0F1113 site bg), light (#E9E6E2 site text)
and brand blue (#1D8FD5 logo gear).  usage: python3 sheet.py [--zoom out.jpg]"""
import json
import os
import sys

from PIL import Image, ImageDraw, ImageFont

P = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
D = f'{P}/assets_prep/gausseholler/ads'
BGS = [(15, 17, 19), (233, 230, 226), (29, 143, 213)]
T = 300
FONT = f'{P}/fonts/_ttf'


def font(sz):
    for f in ['inter-latin-wght-normal.ttf', 'Inter.ttf']:
        p = os.path.join(FONT, f)
        if os.path.exists(p):
            return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def main():
    man = json.load(open(f'{D}/manifest.json'))
    files = [f for f in man['files']]
    cols = 2
    rows = (len(files) + cols - 1) // cols
    cw, ch = 3 * T, T + 34
    sheet = Image.new('RGB', (cols * cw + (cols - 1) * 12, rows * ch), (40, 45, 51))
    d = ImageDraw.Draw(sheet)
    f = font(17)
    for i, it in enumerate(files):
        im = Image.open(f'{P}/assets_prep/{it["file"]}').convert('RGBA')
        im.thumbnail((T - 16, T - 16), Image.LANCZOS)
        x0 = (i % cols) * (cw + 12)
        y0 = (i // cols) * ch
        for k, bg in enumerate(BGS):
            tile = Image.new('RGBA', (T, T), bg + (255,))
            tile.alpha_composite(im, ((T - im.width) // 2, (T - im.height) // 2))
            sheet.paste(tile.convert('RGB'), (x0 + k * T, y0))
        name = os.path.basename(it['file'])
        d.text((x0 + 6, y0 + T + 7), f'{name}  {it["size"][0]}x{it["size"][1]}', font=f, fill=(233, 230, 226))
    sheet.save(f'{D}/_sheet.jpg', quality=88)
    print('sheet', sheet.size)


if __name__ == '__main__':
    main()
