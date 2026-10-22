"""Připraví malé statické podklady pro karusel do _work/assets/ (logo TA, loga partnerů, pozadí úvodu, ČRS statika, fonty)."""
import os, subprocess
from PIL import Image, ImageOps
P = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PR = os.path.dirname(P)
AP = f'{PR}/mcr-2026-sponzori/assets_prep'
O = f'{P}/_work/assets'; os.makedirs(O, exist_ok=True)

def png_small(im, out, box, colors=160):
    im = im.convert('RGBA'); bb = im.getbbox(); im = im.crop(bb)
    im.thumbnail(box, Image.LANCZOS)
    q = im.quantize(colors=colors, method=Image.FASTOCTREE, dither=Image.FLOYDSTEINBERG)
    q.save(out, optimize=True)
    return im.size

# TA logo: ořez na obsah (bez 40px okraje), 640 px šířka
print('ta', png_small(Image.open(f'{AP}/ta_cz/logo_h_on_dark.png'), f'{O}/ta_logo.png', (640, 640), 200))

logos = {
 'ftfishing': f'{AP}/ftfishing/logo_on_dark.png', 'venue': f'{AP}/libechov/logo.png',
 'gausseholler': f'{AP}/gausseholler/logo_on_dark.png', 'activefishing': f'{AP}/activefishing/logo_on_dark.png',
 'bosset': f'{AP}/bosset/logo_on_dark.png', 'jigovky': f'{AP}/jigovky/logo_on_dark.png',
 'moonky': f'{AP}/moonky/logo_on_dark.png', 'troutshop': f'{AP}/troutshop/logo_on_dark.png',
 'velkaryba': f'{AP}/velkaryba/logo_on_dark.png', 'crs': f'{AP}/crs/logo_crs_white.png'}
for k, f in logos.items():
    print(k, png_small(Image.open(f), f'{O}/logo_{k}.png', (240, 120)))

# pozadí úvodu: poháry TA CZ (ligové kolo, galerie troutareacz.cz), ořez 9:16
im = Image.open(f'{AP}/broll_tacz/4x5/t07_gold_cups.jpg').convert('RGB')
w, h = im.size; cw = round(h * 9 / 16); im = im.crop((0, 0, cw, h)).resize((540, 960), Image.LANCZOS)
im.save(f'{O}/intro_bg.jpg', quality=72, optimize=True, progressive=True)
# ČRS: statický banner 9:16
im = Image.open(f'{PR}/mcr-2026-bannery/renders/crs/crs_static_9x16.png').convert('RGB')
im.resize((720, 1280), Image.LANCZOS).save(f'{O}/crs.jpg', quality=74, optimize=True, progressive=True)
im.resize((1080, 1920), Image.LANCZOS).save(f'{O}/crs_1080.jpg', quality=88)

# fonty: Montserrat 600/800/900, podmnožina znaků (ASCII + čeština + typografie)
chars = ''.join(chr(c) for c in range(0x20, 0x7f)) + 'ÁČĎÉĚÍŇÓŘŠŤÚŮÝŽáčďéěíňóřšťúůýž–—·↗→←’‘„“”…× '
FD = f'{PR}/_shared/brand/fonts'
for wgt in (600, 800, 900):
    for sub in ('latin', 'latin-ext'):
        src = f'{FD}/montserrat-{sub}-{wgt}-normal.woff2'
        subprocess.run(['pyftsubset', src, f'--text={chars}', '--flavor=woff2', '--layout-features=kern,liga',
                        f'--output-file={O}/mont-{sub}-{wgt}.woff2'], check=True, stderr=subprocess.DEVNULL)
for f in sorted(os.listdir(O)): print(f, os.path.getsize(f'{O}/{f}'))
