#!/usr/bin/env python3
"""Asset staging for build.mjs: copy/resize/trim images into proto/assets/.
stdin: JSON list of jobs {src, dst, maxSide, trim}; stdout: JSON {dst: [w, h]}.
- trim: crop transparent margins (logos) so logo-size rules use the visible box.
- maxSide: downscale (keeps alpha for PNG); JPEG re-encoded q=88.
Cached: skipped when dst is newer than src and this script.
"""
import json, os, sys, shutil
from PIL import Image, ImageOps

jobs = json.load(sys.stdin)
me = os.path.getmtime(__file__)
out = {}
for j in jobs:
    src, dst = j['src'], j['dst']
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    fresh = os.path.exists(dst) and os.path.getmtime(dst) >= max(os.path.getmtime(src), me)
    if not fresh:
        im = Image.open(src)
        im = ImageOps.exif_transpose(im)
        if j.get('trim') and im.mode in ('RGBA', 'LA', 'P'):
            im = im.convert('RGBA')
            a = im.getchannel('A').point(lambda v: 255 if v > 8 else 0)
            bb = a.getbbox()
            if bb:
                im = im.crop(bb)
        ms = j.get('maxSide') or 0
        if ms and max(im.size) > ms:
            k = ms / max(im.size)
            im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
        ext = os.path.splitext(dst)[1].lower()
        if ext in ('.jpg', '.jpeg'):
            im.convert('RGB').save(dst, quality=88, optimize=True, progressive=True)
        else:
            if im.mode not in ('RGBA', 'RGB', 'LA', 'L'):
                im = im.convert('RGBA')
            im.save(dst, optimize=True)
    with Image.open(dst) as d:
        out[dst] = [d.width, d.height]
json.dump(out, sys.stdout)
