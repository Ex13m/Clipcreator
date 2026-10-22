"""Step 1: isolate the product in each shop photo (ftfishing.cz/data/shop/goods/<id>.jpg, fetched 22. 10. 2026 via
bridge -> assets/ftfishing/src/). Shop photos carry the maker's logo / name / UV badge as separate blobs: keep only
the product component(s), paint everything else with the background colour, crop with margin.
Output: assets_prep/ftfishing/ads/_src/<stem>.png (+ bg colour in _src/bg.json)."""
import json, numpy as np
from PIL import Image
from scipy import ndimage as ndi
P = '/home/user/Clipcreator/projects/mcr-2026-sponzori'
SRC, OUT = f'{P}/assets/ftfishing/src', f'{P}/assets_prep/ftfishing/ads/_src'
# stem: number of largest components to keep
KEEP = {'p01_impulse_pro_firetiger': 1, 'p02_impulse_pro_lime': 1, 'p03_target_spoon_3201': 1, 'p04_hart_spicy_firetiger': 1,
        'p07_king_14g_3801': 1, 'p06_nano_minnow_3d': 1,
        'c01_nimble_5cm_14': 1, 'c02_polaris_68_4d': 2, 'c03_vibrofat_10_9': 1, 'c04_glider_5_kiwi': 1,
        'c05_scalp_minnow_6': 1, 'c06_comet_75_20': 1,
        'f02_reel_totem_2000s': 1, 'f03_reel_x1_2000s': 1, 'f04_rod_arena_stream': 2,
        # Higgsfield 4k upscales (crop of the product area, see hf_log.md)
        'h_p01_impulse_hf4k': 1, 'h_p03_target_hf4k': 1, 'h_c03_vibrofat_hf4k': 1, 'h_f02_totem_hf4k': 1, 'h_f03_x1_hf4k': 1}
bgs = {}
import sys
only = sys.argv[1:]
for stem, k in KEEP.items():
    if only and stem not in only: continue
    import glob, os
    fs = glob.glob(f'{SRC}/{stem}.*')
    if not fs: print('missing', stem); continue
    a = np.asarray(Image.open(fs[0]).convert('RGB')).astype(np.float32)
    H, W, _ = a.shape
    bg = np.median(np.concatenate([a[:6, :6].reshape(-1, 3), a[-6:, -6:].reshape(-1, 3), a[-6:, :6].reshape(-1, 3)]), 0)
    d = np.abs(a - bg).max(2) > 6
    dc = ndi.binary_closing(np.abs(a - bg).max(2) > 18, iterations=3)
    lab, n = ndi.label(dc)
    sz = ndi.sum(dc, lab, range(1, n + 1))
    keep_ids = list(np.argsort(sz)[::-1][:k] + 1)
    keep = ndi.binary_dilation(np.isin(lab, keep_ids), iterations=10)
    # other blobs (text, logo, badge) -> background colour
    other = ndi.binary_dilation(d & ~keep, iterations=3) & ~keep
    a2 = np.where(other[..., None], bg, a)
    ys, xs = np.where(keep)
    m = 24
    x0, x1, y0, y1 = max(0, xs.min() - m), min(W, xs.max() + m), max(0, ys.min() - m), min(H, ys.max() + m)
    out = a2[y0:y1, x0:x1]
    Image.fromarray(out.round().clip(0, 255).astype(np.uint8)).save(f'{OUT}/{stem}.png')
    bgs[stem] = dict(bg=bg.round().tolist(), crop=[int(x0), int(y0), int(x1), int(y1)], src_size=[W, H])
    print(stem, out.shape[1], out.shape[0], bg.round().tolist())
import os
old = json.load(open(f'{OUT}/bg.json')) if os.path.exists(f'{OUT}/bg.json') else {}
old.update(bgs)
json.dump(old, open(f'{OUT}/bg.json', 'w'), indent=1)
