# usage: python3 build_assort.py <workdir> <outdir>; <workdir>/dl = sources (assets/velkaryba/extra/p12-p14 renamed + p07), <workdir>/isnet = ISNet mattes (rmbg.mjs medium)
import sys, numpy as np
sys.path.insert(0, '/home/user/Clipcreator/projects/mcr-2026-sponzori/scripts/assets_prep/velkaryba_ad')
from cut import cutout3, trim_pad
from PIL import Image
SP = sys.argv[1]; OUT = sys.argv[2]
jobs = [
    ('lj_eos_31895.png', 'lj', 'S8_lucky_john_eos_003', [(0, 0, 640, 470)]),
    ('westin_fidusen_34441.png', 'westin', 'S9_westin_fidusen_slim_pink_yellow_clown', [(0, 0, 1000, 245)]),
    ('vanpla_32531.png', 'vanpla', 'S10_vanpla_pink_black', None),
    ('p07_berkley-sukoshi-splat-pel.jpg', 'p07', 'S11_berkley_sukoshi_splat_pel', None),
]
for src, isn, name, boxes in jobs:
    rgb = np.asarray(Image.open(f'{SP}/dl/{src}').convert('RGB')).astype(np.float32)
    ia = np.asarray(Image.open(f'{SP}/isnet/{isn}.png').convert('RGBA').resize((rgb.shape[1], rgb.shape[0])))[..., 3]
    im, info = cutout3(rgb, ia, keep_boxes=boxes, min_frac=0.0001, hole_min=40)
    im = trim_pad(im, 12)
    im.save(f'{OUT}/{name}.png', optimize=True)
    a = np.asarray(im)[..., 3]
    print(name, im.size, info, 'border alpha max', a[0].max(), a[-1].max(), a[:, 0].max(), a[:, -1].max())
