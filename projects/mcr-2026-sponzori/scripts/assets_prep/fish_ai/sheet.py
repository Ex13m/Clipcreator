"""Contact sheet of the 6 AI-trout cut-outs on brand navy, labelled name + verdict.
usage: python3 -I sheet.py   -> assets_prep/fish_ai/_sheet.jpg
"""
from PIL import Image, ImageDraw, ImageFont

D = '/home/user/Clipcreator/projects/mcr-2026-sponzori/assets_prep/fish_ai'
TTF = '/home/user/Clipcreator/projects/mcr-2026-sponzori/fonts/_ttf/montserrat-latin-wght-normal.ttf'
CYR = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
BG, CARD = (11, 30, 66), (20, 42, 86)
OKC, RJC = (46, 170, 90), (227, 30, 36)

V = {  # name: (verdict, short reason)
    'rainbow_a': ('OK', '6 плавников, розовая полоса, чёрные точки на спине и хвосте'),
    'rainbow_b': ('OK', '6 плавников, яркая полоса, точки гуще; белые кончики брюшных/анального'),
    'brown_a': ('OK', 'чёрные + красные точки, хвост почти без точек (верно); ореолы слабые'),
    'brown_b': ('REJECT', 'хвост сплошь в чёрных точках (признак радужной), у точек нет ореолов'),
    'brook_a': ('OK', 'полный узор ручьевой; оба грудных видны (читается как двойной)'),
    'brook_b': ('OK', 'тот же полный узор; плавники читаются чище, чем у brook_a'),
}
ORDER = [['rainbow_a', 'rainbow_b'], ['brown_a', 'brown_b'], ['brook_a', 'brook_b']]


def font(path, size, wght=None):
    f = ImageFont.truetype(path, size)
    if wght:
        try:
            f.set_variation_by_axes([wght])
        except Exception:
            pass
    return f


def main():
    cw, ch, pad, gap = 1000, 520, 40, 28
    img_h = 380
    W = pad * 2 + cw * 2 + gap
    H = pad * 2 + 90 + (ch + gap) * 3 - gap
    sheet = Image.new('RGB', (W, H), BG)
    dr = ImageDraw.Draw(sheet)
    f_title = font('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 38)  # Montserrat TTF subsets split C-caron from A-Z
    f_name = font(TTF, 34, 800)
    f_badge = font(TTF, 30, 900)
    f_note = font(CYR, 22)
    dr.text((pad, pad), 'MČR 2026 · AI pstruzi (Higgsfield) · cut-outs + verdict', font=f_title, fill=(238, 242, 249))
    y0 = pad + 90
    for r, row in enumerate(ORDER):
        for c, n in enumerate(row):
            x, y = pad + c * (cw + gap), y0 + r * (ch + gap)
            dr.rounded_rectangle((x, y, x + cw, y + ch), radius=18, fill=CARD)
            fish = Image.open(f'{D}/fish_{n}_cut.png')
            s = min((cw - 60) / fish.width, img_h / fish.height)
            fish = fish.convert('RGBa').resize((round(fish.width * s), round(fish.height * s)), Image.LANCZOS).convert('RGBA')
            fx = x + (cw - fish.width) // 2
            fy = y + 24 + (img_h - fish.height) // 2
            sheet.paste(fish, (fx, fy), fish)
            verdict, note = V[n]
            ty = y + 24 + img_h + 14
            dr.text((x + 30, ty), f'fish_{n}', font=f_name, fill=(238, 242, 249))
            bw = dr.textlength(verdict, font=f_badge) + 36
            bx = x + cw - 30 - bw
            dr.rounded_rectangle((bx, ty - 2, bx + bw, ty + 44), radius=10, fill=OKC if verdict == 'OK' else RJC)
            dr.text((bx + 18, ty + 4), verdict, font=f_badge, fill=(255, 255, 255))
            dr.text((x + 30, ty + 50), note, font=f_note, fill=(142, 162, 216))
    sheet.save(f'{D}/_sheet.jpg', quality=90)
    print(sheet.size)


if __name__ == '__main__':
    main()
