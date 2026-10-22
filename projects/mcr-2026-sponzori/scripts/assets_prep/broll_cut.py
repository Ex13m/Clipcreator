#!/usr/bin/env python3
"""B-roll subject cut-outs for blocks/broll.mjs (text-behind-subject, 2.5D parallax, sticker outline).

Input : assets_prep/broll/cut/raw/<id>.png  (ISNet foreground from scripts/assets_prep/rmbg.mjs, model 'medium', same 1080x1920 frame)
Output: assets_prep/broll/cut/<id>_cut.png     subject only, alpha hardened (semi-transparent body parts → opaque) and 1 px eroded,
                                               so letters behind the subject never ghost through and no fringe shows
        assets_prep/broll/cut/<id>_stroke.png  white silhouette dilated by STROKE px (put it UNDER the cut → white sticker outline)

Run   : python3 scripts/assets_prep/broll_cut.py br01 br05 br07
        BROLL_DIR=assets_prep/broll_tacz python3 scripts/assets_prep/broll_cut.py t01 t04   (gallery b-roll, 21. 10.)
Raw   : cd <bgnode> && node rmbg.mjs medium assets_prep/broll/br07_landing_rod_up.jpg assets_prep/broll/cut/raw/br07.png
"""
import os
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / os.environ.get('BROLL_DIR', 'assets_prep/broll')
CUT = SRC / 'cut'
STROKE = 12          # px of the white sticker outline
LO, HI = 0.22, 0.5   # alpha ramp: below LO → 0, above HI → 1 (hardens ISNet's half-transparent dark clothing)
# per-shot boxes (x0, y0, x1, y1 in the 1080×1920 frame) or polygons [(x, y), …] where ISNet kept things that are not the
# subject → alpha 0
#   t01: the rod rack left of the angler (ISNet kept broken rod segments → half the rods in front of the word, half behind)
#   t04: wooden post, a stick, a neighbour's red jacket and dark legs left of the angler's legs (polygon along his trouser edge,
#        below his elbow); rod blanks above the
#        rack right of him (a 12 px sticker stroke turns thin blanks into white bars)
EXCLUDE = {'t01': [(0, 0, 380, 1920)],
           't04': [[(0, 895), (395, 895), (402, 990), (420, 1010), (432, 1150), (447, 1245), (447, 1920), (0, 1920)],
                   (935, 0, 1080, 760), (895, 425, 935, 760)],
           # t03: rods + landing net above the tackle box (broken ISNet rod segments, mesh) → stay grey behind the word;
           #      v9 (22. 10.): the tackle box + reels right of his knee too — their stroke drew white scraps („=5\A“) above the
           #      bottom cinema bar of the break (REVIEW_v8 MINOR 8) → only the angler is the colour subject
           't03': [(560, 0, 1080, 1400), [(505, 1395), (1080, 1395), (1080, 1920), (552, 1920), (549, 1660), (522, 1560), (508, 1480)]]}
# sticker stroke drawn from the silhouette OPENED by this many px first → thin rod blanks stay in colour but get no white bar
OPEN = {'t04': 9, 't03': 9}


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
        for ex in EXCLUDE.get(key, []):
            if isinstance(ex, list):                      # polygon
                from PIL import ImageDraw
                pm = Image.new('L', raw.size, 0)
                ImageDraw.Draw(pm).polygon(ex, fill=255)
                a[np.asarray(pm) > 0] = 0
            else:
                x0, y0, x1, y1 = ex
                a[y0:y1, x0:x1] = 0
        m = keep_big(a > 0.5)
        a = a * m
        # 1 px erode + soft edge: MinFilter(3) then a light blur
        A = Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
        rgb = np.asarray(ph, dtype=np.uint8).copy()
        rgb[np.asarray(A) == 0] = 0                      # empty pixels → black: PNG compresses ~5× smaller
        cut = Image.fromarray(rgb).convert('RGBA')
        cut.putalpha(A)
        cut.save(CUT / f'{key}_cut.png', optimize=True)
        # stroke: dilated silhouette, anti-aliased
        sil = np.asarray(A) > 110
        if key in OPEN:
            from scipy import ndimage
            r = OPEN[key] // 2
            yy, xx = np.mgrid[-r:r + 1, -r:r + 1]
            sil = ndimage.binary_opening(sil, structure=(xx * xx + yy * yy) <= r * r)
        S = Image.fromarray((sil * 255).astype(np.uint8))
        S = S.filter(ImageFilter.MaxFilter(2 * (STROKE // 2) + 1)).filter(ImageFilter.MaxFilter(2 * (STROKE - STROKE // 2) + 1)).filter(ImageFilter.GaussianBlur(1.2))
        st = Image.new('RGBA', ph.size, (255, 255, 255, 0))
        st.putalpha(S)
        st.save(CUT / f'{key}_stroke.png', optimize=True)
        ys, xs = np.where(np.asarray(A) > 128)
        print(f'{key}: cut + stroke · subject bbox x {xs.min()}–{xs.max()} y {ys.min()}–{ys.max()} · cover {(np.asarray(A) > 128).mean():.2f}')


if __name__ == '__main__':
    main(sys.argv[1:] or ['br01', 'br05', 'br07'])
