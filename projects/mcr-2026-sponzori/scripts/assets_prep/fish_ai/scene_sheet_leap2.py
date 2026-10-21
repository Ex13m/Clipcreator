"""Contact sheet: 4 AI rainbow-trout leap-with-flip scenes (leap2_a-d, Higgsfield 752x1344) + net_a 2k upscale,
labelled name + verdict + reason.
usage: python3 -I scene_sheet_leap2.py   -> assets_prep/fish_ai/scenes/_sheet_leap2.jpg
"""
from PIL import Image, ImageDraw, ImageFont

D = '/home/user/Clipcreator/projects/mcr-2026-sponzori/assets_prep/fish_ai/scenes'
SANS = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
BG, CARD = (11, 30, 66), (20, 42, 86)
OKC, RJC, PICK = (46, 170, 90), (227, 30, 36), (255, 196, 0)

ORDER = ['leap2_a', 'leap2_b', 'leap2_c', 'leap2_d', 'net_a_2k']
V = {  # name: (verdict, short reason, pick label or '')
    'leap2_a': ('REJECT', 'морда-«утконос» без щели рта; тело перекручено: светлое брюхо на стороне спины, 2 лишних розовых плавника; кожа сухая, капли-бусины', ''),
    'leap2_b': ('REJECT', 'хвостовой плавник растёт из спины, за ним тело идёт дальше обрубком с плавником; рот в порядке', ''),
    'leap2_c': ('REJECT', 'лучший рот и мокрая кожа (вода стекает струёй), но лишний плавник на брюхе между брюшным и анальным; годится только после ретуши', ''),
    'leap2_d': ('OK', 'все плавники на месте и в верном порядке, рот естественный, капли на плавниках, переворот головой вниз; титр ляжет на тело', 'venue'),
    'net_a_2k': ('OK', 'голова, глаз и пландавка чётче оригинала; новый артефакт: «лесенки»-контуры в расфокусе хвоста (верхний левый угол), латать из net_a', 'PSTRUH.'),
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
    n = len(ORDER)
    tw, th, pad, gap, note_h = 400, 715, 40, 20, 170
    W = pad * 2 + tw * n + gap * (n - 1)
    H = pad + 70 + th + note_h + pad
    sheet = Image.new('RGB', (W, H), BG)
    dr = ImageDraw.Draw(sheet)
    f_title = ImageFont.truetype(BOLD, 30)
    f_name = ImageFont.truetype(BOLD, 24)
    f_badge = ImageFont.truetype(BOLD, 22)
    f_note = ImageFont.truetype(SANS, 18)
    dr.text((pad, pad), 'MČR 2026 · AI pstruh duhový · výskok s přetočením (leap2 a–d) + net_a 2k · verdikt',
            font=f_title, fill=(238, 242, 249))
    y0 = pad + 70
    for i, name in enumerate(ORDER):
        x = pad + i * (tw + gap)
        dr.rounded_rectangle((x - 6, y0 - 6, x + tw + 6, y0 + th + note_h - 6), radius=14, fill=CARD)
        im = Image.open(f'{D}/scene_{name}.png').convert('RGB').resize((tw, th), Image.LANCZOS)
        sheet.paste(im, (x, y0))
        verdict, note, pick = V[name]
        if verdict == 'REJECT':  # dim rejected tiles so the eye goes to the usable ones
            ov = Image.new('RGBA', (tw, th), (11, 30, 66, 70))
            sheet.paste(ov, (x, y0), ov)
        if pick:
            dr.rectangle((x - 3, y0 - 3, x + tw + 2, y0 + th + 2), outline=PICK, width=5)
            lab = f'★ {pick}'
            lw = dr.textlength(lab, font=f_badge) + 24
            dr.rounded_rectangle((x + 10, y0 + 10, x + 10 + lw, y0 + 46), radius=8, fill=PICK)
            dr.text((x + 22, y0 + 15), lab, font=f_badge, fill=(11, 30, 66))
        ty = y0 + th + 14
        dr.text((x + 4, ty), name, font=f_name, fill=(238, 242, 249))
        bw = dr.textlength(verdict, font=f_badge) + 24
        bx = x + tw - bw
        dr.rounded_rectangle((bx, ty - 2, bx + bw, ty + 32), radius=8, fill=OKC if verdict == 'OK' else RJC)
        dr.text((bx + 12, ty + 3), verdict, font=f_badge, fill=(255, 255, 255))
        for k, line in enumerate(wrap(dr, note, f_note, tw - 8)[:5]):
            dr.text((x + 4, ty + 44 + k * 23), line, font=f_note, fill=(170, 186, 228))
    sheet.save(f'{D}/_sheet_leap2.jpg', quality=90)
    print(sheet.size)


if __name__ == '__main__':
    main()
