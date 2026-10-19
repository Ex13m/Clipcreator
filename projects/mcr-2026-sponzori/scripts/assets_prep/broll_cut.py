#!/usr/bin/env python3
"""B-roll subject cut-outs for blocks/broll.mjs (text-behind-subject, 2.5D parallax, sticker outline).

Input : assets_prep/broll/cut/raw/<id>.png  (ISNet foreground from scripts/assets_prep/rmbg.mjs, model 'medium', same 1080x1920 frame)
Output: assets_prep/broll/cut/<id>_cut.png     subject only, alpha hardened (semi-transparent body parts → opaque) and 1 px eroded,
                                               so letters behind the subject never ghost through and no fringe shows
        assets_prep/broll/cut/<id>_stroke.png  white silhouette dilated by STROKE px (put it UNDER the cut → white sticker outline)

Run   : python3 scripts/assets_prep/broll_cut.py br01 br05 br07
Raw   : cd <bgnode> && node rmbg.mjs medium assets_prep/broll/br07_landing_rod_up.jpg assets_prep/broll/cut/raw/br07.png
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / 'assets_prep/broll'
CUT = SRC / 'cut'
STROKE = 12          # px of the white sticker outline
LO, HI = 0.22, 0.5   # alpha ramp: below LO → 0, above HI → 1 (hardens ISNet's half-transparent dark clothing)


def photo_of(key):
    hits = sorted(SRC.glob(f'{key}_*.jpg'))
    if not hits:
        raise SystemExit(f'no photo {key}_*.jpg in {SRC}')
    return hits[0]


def keep_big(mask, min_frac=0.004):
    """drop small islands (bits of water / grass ISNet kept)"""
    try:
        from scipy import ndimage
    except ImportError:
        return mask
    lab, n = ndimage.label(mask)
    if n <= 1:
        return mask
    sizes = ndimage.sum(mask, lab, range(1, n + 1))
    keep = np.zeros(n + 1, bool)
    keep[1:] = sizes >= max(sizes.max() * 0.02, mask.size * min_frac * 0.1)
    return keep[lab]


def main(keys):
    for key in keys:
        raw = Image.open(CUT / 'raw' / f'{key}.png').convert('RGBA')
        ph = Image.open(photo_of(key)).convert('RGB')
        assert raw.size == ph.size, (key, raw.size, ph.size)
        a = np.asarray(raw, dtype=np.float32)[:, :, 3] / 255.0
        a = np.clip((a - LO) / (HI - LO), 0, 1)
        m = keep_big(a > 0.5)
        a = a * m
        # 1 px erode + soft edge: MinFilter(3) then a light blur
        A = Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
        cut = ph.copy().convert('RGBA')
        cut.putalpha(A)
        cut.save(CUT / f'{key}_cut.png', optimize=True)
        # stroke: dilated silhouette, anti-aliased
        S = Image.fromarray(((np.asarray(A) > 110) * 255).astype(np.uint8))
        S = S.filter(ImageFilter.MaxFilter(2 * (STROKE // 2) + 1)).filter(ImageFilter.MaxFilter(2 * (STROKE - STROKE // 2) + 1)).filter(ImageFilter.GaussianBlur(1.2))
        st = Image.new('RGBA', ph.size, (255, 255, 255, 0))
        st.putalpha(S)
        st.save(CUT / f'{key}_stroke.png', optimize=True)
        ys, xs = np.where(np.asarray(A) > 128)
        print(f'{key}: cut + stroke · subject bbox x {xs.min()}–{xs.max()} y {ys.min()}–{ys.max()} · cover {(np.asarray(A) > 128).mean():.2f}')


if __name__ == '__main__':
    main(sys.argv[1:] or ['br01', 'br05', 'br07'])
