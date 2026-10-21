"""Contact sheet of the 6 AI 9:16 rainbow-trout scenes (Higgsfield, 752x1344), labelled name + verdict + reason.
usage: python3 -I scene_sheet.py   -> assets_prep/fish_ai/scenes/_sheet.jpg
"""
from PIL import Image, ImageDraw, ImageFont

D = '/home/user/Clipcreator/projects/mcr-2026-sponzori/assets_prep/fish_ai/scenes'
SANS = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
BG, CARD = (11, 30, 66), (20, 42, 86)
OKC, RJC, PICK = (46, 170, 90), (227, 30, 36), (255, 196, 0)

ORDER = ['underwater_a', 'underwater_b', 'net_a', 'net_b', 'leap_a', 'leap_b']
V = {  # name: (verdict, short reason, pick label or '')
    'underwater_a': ('OK', 'анатомия верна; вид стокового рендера (ровный свет), рыба выше и заходит на титр', ''),
    'underwater_b': ('OK', 'анатомия верна, сверху место под титр; тоже вид стокового рендера', 'venue'),
    'net_a': ('OK', 'читается как фото; 6 плавников, пландавка в губе правдоподобна', 'PSTRUH.'),
    'net_b': ('OK', 'фото, мокрая фактура; контрастнее («HDR»), запасной для PSTRUH.', ''),
    'leap_a': ('REJECT', 'рот деформирован, приманка срослась с челюстью, рыба сухая', ''),
    'leap_b': ('REJECT', 'рот-«клюв», приманка-капля, капли-бусины как в CG, рыба сухая', ''),
}


def wrap(dr, text, font, width):
    lines, cur = [], ''
    for w in text.split():
        t = (cur + ' ' + w).strip()
        if dr.textlength(t, font=font) <= width:
            cur = t
        else:
            lines.append(cur)
            cur = w
    return lines + [cur]


def main():
    tw, th, pad, gap = 400, 715, 40, 20
    W = pad * 2 + tw * 6 + gap * 5
    H = pad + 70 + th + 140 + pad
    sheet = Image.new('RGB', (W, H), BG)
    dr = ImageDraw.Draw(sheet)
    f_title = ImageFont.truetype(BOLD, 34)
    f_name = ImageFont.truetype(BOLD, 24)
    f_badge = ImageFont.truetype(BOLD, 22)
    f_note = ImageFont.truetype(SANS, 18)
    dr.text((pad, pad), 'MČR 2026 · AI pstruh duhový, scény 9:16 (Higgsfield 752×1344) · verdikt', font=f_title, fill=(238, 242, 249))
    y0 = pad + 70
    for i, n in enumerate(ORDER):
        x = pad + i * (tw + gap)
        dr.rounded_rectangle((x - 6, y0 - 6, x + tw + 6, y0 + th + 134), radius=14, fill=CARD)
        im = Image.open(f'{D}/scene_{n}.png').convert('RGB').resize((tw, th), Image.LANCZOS)
        sheet.paste(im, (x, y0))
        verdict, note, pick = V[n]
        if verdict == 'REJECT':  # dim rejected tiles slightly so the eye goes to the usable ones
            ov = Image.new('RGBA', (tw, th), (11, 30, 66, 70))
            sheet.paste(ov, (x, y0), ov)
        if pick:
            dr.rectangle((x - 3, y0 - 3, x + tw + 2, y0 + th + 2), outline=PICK, width=5)
            lab = f'★ {pick}'
            lw = dr.textlength(lab, font=f_badge) + 24
            dr.rounded_rectangle((x + 10, y0 + 10, x + 10 + lw, y0 + 46), radius=8, fill=PICK)
            dr.text((x + 22, y0 + 15), lab, font=f_badge, fill=(11, 30, 66))
        ty = y0 + th + 14
        dr.text((x + 4, ty), n, font=f_name, fill=(238, 242, 249))
        bw = dr.textlength(verdict, font=f_badge) + 24
        bx = x + tw - bw
        dr.rounded_rectangle((bx, ty - 2, bx + bw, ty + 32), radius=8, fill=OKC if verdict == 'OK' else RJC)
        dr.text((bx + 12, ty + 3), verdict, font=f_badge, fill=(255, 255, 255))
        for k, line in enumerate(wrap(dr, note, f_note, tw - 8)[:4]):
            dr.text((x + 4, ty + 44 + k * 24), line, font=f_note, fill=(170, 186, 228))
    sheet.save(f'{D}/_sheet.jpg', quality=90)
    print(sheet.size)


if __name__ == '__main__':
    main()
