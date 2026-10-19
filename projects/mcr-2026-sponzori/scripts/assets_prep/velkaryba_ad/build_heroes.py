import sys, json, numpy as np
sys.path.insert(0, sys.argv[1])
from cut import cutout3, trim_pad, patch_circles, contact_shadow
from PIL import Image, ImageFilter
V = sys.argv[2]
OUT = '/home/user/Clipcreator/projects/mcr-2026-sponzori/assets_prep/velkaryba/ads'
A = '/home/user/Clipcreator/projects/mcr-2026-sponzori/assets/velkaryba'

def isn(path, size):
    return np.asarray(Image.open(path).convert('RGBA').resize(size))[..., 3]

def fit(im, long=2000):
    s = long / max(im.size)
    if s < 1:
        im = im.convert('RGBa').resize((round(im.width * s), round(im.height * s)), Image.LANCZOS).convert('RGBA')
    return im

def cutout(*a, **k):
    im, info = cutout3(*a, **k); print('  topo', info); return im

def save(im, name, shadow=False):
    im.save(f'{OUT}/{name}.png', optimize=True)
    if shadow:
        contact_shadow(im).save(f'{OUT}/{name}_shadow.png', optimize=True)
    print(name, im.size)

which = sys.argv[3:] or ['vanquish', 'cardiff', 'illex']
if 'vanquish' in which:
    up = np.asarray(Image.open(f'{V}/dl/hf_vanquish_2k.png').convert('RGB')).astype(np.float32)
    ref = np.asarray(Image.open(f'{V}/work/vanquish_lanczos.png').convert('RGB')).astype(np.float32)
    up = patch_circles(up, ref, [(655, 1645, 74), (990, 1642, 48)], feather=9)
    im = cutout(up, isn(f'{V}/isnet/vanquish.png', (up.shape[1], up.shape[0])), min_frac=0.0002)
    save(fit(trim_pad(im, 20)), 'H1_shimano_vanquish_fa_ce_c2000s', shadow=True)
if 'cardiff' in which:
    up = np.asarray(Image.open(f'{V}/dl/hf_cardiff_orange_2k.png').convert('RGB')).astype(np.float32)
    ia = isn(f'{V}/isnet/cardiff.png', (up.shape[1], up.shape[0]))
    front = cutout(up, ia, min_frac=0.0001, keep_boxes=[(0, 700, 1600, 2160)])
    save(fit(trim_pad(front, 20)), 'H2_shimano_cardiff_roll_swimmer_ce_orange_front', shadow=True)
    back = cutout(up, ia, min_frac=0.0001, keep_boxes=[(600, 250, 1700, 700)])
    save(fit(trim_pad(back, 20)), 'H2_shimano_cardiff_roll_swimmer_ce_orange_back')
if 'illex' in which:
    up = np.asarray(Image.open(f'{V}/dl/hf_illex_pink_2k.png').convert('RGB')).astype(np.float32)
    im = cutout(up, isn(f'{V}/isnet/illex.png', (up.shape[1], up.shape[0])), min_frac=0.0002)
    save(fit(trim_pad(im, 20)), 'H3_illex_native_spoon_pink_yamame', shadow=True)
