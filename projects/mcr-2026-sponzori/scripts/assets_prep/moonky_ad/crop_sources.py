"""Step 1: crop white-background Moonky packshots to the lure (+ white padding) for ISNet and the cut.
usage: python3 -I crop_sources.py <project_root> <workdir>
"""
import sys, json
import numpy as np
from PIL import Image

ROOT, WD = sys.argv[1], sys.argv[2]
SRC = {
    # key: (source path relative to project root, note)
    'savory_c06_green':       'assets/moonky/p01_savory_c06_green.png',
    'savory_c01_pink':        'assets/moonky/p06_savory_c01_pink_bubblegum.png',
    'savory_dc03_brown_orange': 'assets/moonky/p08_savory_dc03_brown_orange.png',
    'savory_c02_orange_fluo': 'assets_prep/moonky/ads/_src/w2038_savory_c02_orange_fluo.png',
    'savory_c03_brown_metalic': 'assets_prep/moonky/ads/_src/w2047_savory_c03_brown_metalic.png',
    'savory_c04_black':       'assets_prep/moonky/ads/_src/w2059_savory_c04_black.png',
    'coccon_jr_c04_black':    'assets/moonky/p04_coccon_jr_c04_black.png',
    'master_c05_white':       'assets/moonky/p05_master_c05_white.png',
    'coccon_dc04_yellow_orange': 'assets/moonky/p09_coccon_dc04_yellow_orange.jpg',
    'coccon_c02_orange_fluo': 'assets/moonky/p02_coccon_c02_orange_fluo.jpg',
    'scelet_c01_pink':        'assets/moonky/p03_scelet_c01_pink_bubblegum.jpg',
    'scelet_jr_c08_coffee_milk': 'assets/moonky/p07_scelet_jr_c08_coffee_milk.jpg',
}
meta = {}
for k, rel in SRC.items():
    im = Image.open(f'{ROOT}/{rel}').convert('RGB')
    a = np.asarray(im).astype(np.int16)
    d = (255 - a).max(2)
    m = d > 14
    # ignore isolated specks: use rows/cols with enough object pixels
    rows = np.where(m.sum(1) > 6)[0]; cols = np.where(m.sum(0) > 6)[0]
    y0, y1, x0, x1 = rows.min(), rows.max() + 1, cols.min(), cols.max() + 1
    pad = max(60, int(0.06 * max(x1 - x0, y1 - y0)))
    W, H = im.size
    box = (x0 - pad, y0 - pad, x1 + pad, y1 + pad)
    out = Image.new('RGB', (box[2] - box[0], box[3] - box[1]), (255, 255, 255))
    out.paste(im.crop((max(0, box[0]), max(0, box[1]), min(W, box[2]), min(H, box[3]))), (max(0, -box[0]), max(0, -box[1])))
    out.save(f'{WD}/crop/{k}.png')
    border = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]])
    meta[k] = dict(src=rel, src_size=[W, H], box=[int(v) for v in box], lure_px=[int(x1 - x0), int(y1 - y0)],
                   border_median=[int(v) for v in np.median(border, 0)], touches_edge=bool(box[0] < 0 or box[1] < 0 or box[2] > W or box[3] > H))
    print(k, meta[k])
json.dump(meta, open(f'{WD}/crop/_meta.json', 'w'), indent=1)
