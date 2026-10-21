"""AI trout (Higgsfield, flat 254 white bg) -> clean transparent cut-outs, trimmed.

usage: python3 -I cut_fish.py <isnet_dir> [names...]
  isnet_dir: ISNet foregrounds from rmbg.mjs (`node rmbg.mjs medium in out ...`), saved as <name>.png

Why not plain cutout3 (velkaryba_ad/cut.py): ISNet drops near-white fin edges (brook trout white leading edge,
~230-240 on 254 paper), especially where the near and far pectoral/pelvic fins overlap -> navy slivers inside fins.
Why not a plain global white-key: brown_a has a soft grey drop shadow that it would keep.

Method:
  1. white-key: dark = max(paper - rgb), blur 0.7, > 10 (brown_a drop shadow is 5-8, white fin edges 14-40);
     everything not connected to the border = object.
  2. limit it to ISNet>0.5 closed with a 12 px disk, no dilation (drops the shadow, keeps the white fin
     edges ISNet cut out between overlapping fins; a 3 px dilation let shadow wisps back in on brown_a).
  3. largest component, holes filled (a trout has no see-through holes).
  4. interior (eroded 2 px) = opaque, original colour; 2 px rim each side: alpha by unmixing against paper
     with the nearest interior colour F, colour = unmixed (no white fringe); light F -> soft-mask fallback.
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

D = '/home/user/Clipcreator/projects/mcr-2026-sponzori/assets_prep/fish_ai'
NAMES = ['rainbow_a', 'rainbow_b', 'brown_a', 'brown_b', 'brook_a', 'brook_b']


def disk(r):
    yy, xx = np.mgrid[-r:r + 1, -r:r + 1]
    return (xx * xx + yy * yy) <= r * r


def cut(rgb, ia, t=10.0, close_r=12, allow_dil=0, rim=2, haze=0.04, vfloor=22):
    H, W, _ = rgb.shape
    white = np.median(np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]]), 0)
    dark = np.max(white - rgb, axis=2)
    ds = ndi.gaussian_filter(dark, 0.7)
    # 1. white-key, filled
    lab, n = ndi.label(~(ds > t))
    edge = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    obj = ~np.isin(lab, edge[edge > 0])
    # 2. ISNet envelope
    p = close_r + 8
    isn = np.pad(ia > 127, p)
    env = ndi.binary_closing(isn, structure=disk(close_r))
    env = ndi.binary_dilation(env, structure=disk(allow_dil))[p:-p, p:-p]
    obj &= env
    # 3. largest component, filled
    ol, on = ndi.label(obj)
    sizes = ndi.sum(np.ones((H, W)), ol, np.arange(1, on + 1))
    obj = ndi.binary_fill_holes(ol == (1 + int(np.argmax(sizes))))
    # 4. alpha
    interior = ndi.binary_erosion(obj, iterations=rim)
    band = ndi.binary_dilation(obj, iterations=rim) & ~interior
    _, (iy, ix) = ndi.distance_transform_edt(~interior, return_indices=True)
    F = rgb[iy, ix]
    v = white - F
    c = white - rgb
    vv = np.sum(v * v, 2)
    a_un = np.clip(np.sum(c * v, 2) / np.maximum(vv, 1e-3), 0, 1)
    soft = ndi.gaussian_filter(obj.astype(np.float32), 0.8)
    a = np.where(vv > vfloor ** 2, a_un, soft)
    a = np.clip((a - haze) / (1 - haze), 0, 1)
    alpha = np.where(interior, 1.0, np.where(band, a, 0.0))
    alpha = np.where(alpha < 0.5 / 255, 0.0, alpha)
    al, an = ndi.label(alpha > 0)                       # drop faint rim specks detached from the fish
    if an > 1:
        alpha = np.where(al == 1 + int(np.argmax(ndi.sum(alpha, al, np.arange(1, an + 1)))), alpha, 0.0)
    unmix = np.clip((rgb - (1 - alpha[..., None]) * white) / np.maximum(alpha[..., None], 1e-3), 0, 255)
    w = np.clip((alpha - 0.25) / 0.6, 0, 1)[..., None]
    col = np.where(interior[..., None], rgb, w * unmix + (1 - w) * F)
    out = np.dstack([col, alpha * 255]).round().clip(0, 255).astype(np.uint8)
    info = dict(obj_px=int(obj.sum()), isnet_px=int((ia > 127).sum()))
    return Image.fromarray(out, 'RGBA'), info


def trim_pad(im, pad=12, thr=6):
    a = np.asarray(im)[..., 3]
    ys, xs = np.where(a > thr)
    c = im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    out = Image.new('RGBA', (c.width + 2 * pad, c.height + 2 * pad), (0, 0, 0, 0))
    out.paste(c, (pad, pad))
    return out


def main():
    isn_dir = sys.argv[1]
    for n in sys.argv[2:] or NAMES:
        src = Image.open(f'{D}/fish_{n}.png').convert('RGB')
        rgb = np.asarray(src).astype(np.float32)
        ia = np.asarray(Image.open(f'{isn_dir}/{n}.png').convert('RGBA').resize(src.size))[..., 3]
        im, info = cut(rgb, ia)
        out = trim_pad(im)
        out.save(f'{D}/fish_{n}_cut.png', optimize=True)
        print(n, out.size, info)


if __name__ == '__main__':
    main()
