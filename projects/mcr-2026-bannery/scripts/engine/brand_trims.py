#!/usr/bin/env python3
"""Visible box (alpha > 24) of every brand logo in mcr-2026-sponzori/assets_prep/*/brands/*.png → data/brand_trims.json.
E.brandStrip() uses it so logos are sized by their visible ink, not by the PNG padding. Re-run after adding brand files."""
import glob, json, os
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
FILM = os.path.join(os.path.dirname(ROOT), 'mcr-2026-sponzori')
out = {}
for p in sorted(glob.glob(os.path.join(FILM, 'assets_prep/*/brands/*.png'))):
    im = Image.open(p).convert('RGBA')
    bb = im.split()[-1].point(lambda v: 255 if v > 24 else 0).getbbox() or (0, 0, im.width, im.height)
    out['film:' + os.path.relpath(p, FILM)] = [bb[0], bb[1], bb[2] - bb[0], bb[3] - bb[1]]
json.dump(out, open(os.path.join(ROOT, 'data/brand_trims.json'), 'w'), indent=0)
print(len(out), 'brand logos')
