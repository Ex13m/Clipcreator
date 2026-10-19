import sys, numpy as np
sys.path.insert(0, sys.argv[1])
from cut import cutout3, trim_pad, contact_shadow
from PIL import Image
V = sys.argv[2]
OUT = '/home/user/Clipcreator/projects/mcr-2026-sponzori/assets_prep/velkaryba/ads'
A = '/home/user/Clipcreator/projects/mcr-2026-sponzori/assets/velkaryba'
jobs = [
    ('p06_illex-native-spoon-copper-trout.jpg', 'p06', 'S1_illex_native_spoon_copper_trout', None),
    ('p04_daiwa-presso-adm-manhattan.jpg', 'p04', 'S2_daiwa_presso_adm_manhattan_pair', None),
    ('p09_daiwa-presso-adm-flashing-green.jpg', 'p09', 'S3_daiwa_presso_adm_flashing_green_pair', None),
    ('p03_cardiff-roll-swimmer-ce-lime-gold.jpg', 'p03', 'S4_shimano_cardiff_roll_swimmer_ce_lime_front', [(0, 300, 560, 748)]),
    ('p02_cardiff-roll-swimmer-camo-military-pink.jpg', 'p02', 'S5_shimano_cardiff_roll_swimmer_camo_military_pink_front', [(0, 300, 560, 748)]),
    ('p08_berkley-power-flail-trout-pellet.jpg', 'p08', 'S6_berkley_powerbait_power_flail_trout_pellet', None),
    (f'{V}/dl/exlead_34210.jpg', 'exlead', 'S7_shimano_cardiff_exlead_competition_rod', None),
]
only = sys.argv[3:]
for src, isn, name, boxes in jobs:
    if only and isn not in only:
        continue
    path = src if src.startswith('/') else f'{A}/{src}'
    rgb = np.asarray(Image.open(path).convert('RGB')).astype(np.float32)
    ia = np.asarray(Image.open(f'{V}/isnet/{isn}.png').convert('RGBA').resize((rgb.shape[1], rgb.shape[0])))[..., 3]
    im, info = cutout3(rgb, ia, keep_boxes=boxes, min_frac=0.0001, hole_min=40)
    im = trim_pad(im, 12)
    im.save(f'{OUT}/{name}.png', optimize=True)
    print(name, im.size, info)
