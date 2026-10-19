"""Shared helpers for MČR 2026 sponsor-film asset prep (logos, cut-outs, b-roll).

Run with the scratch venv python (PIL, numpy, scipy, vtracer, fontTools):
  /tmp/.../scratchpad/ap/venv/bin/python -I scripts/assets_prep/<step>.py
"""
from __future__ import annotations

import os
import re
import subprocess
import tempfile

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

PROJ = '/home/user/Clipcreator/projects/mcr-2026-sponzori'
ASSETS = f'{PROJ}/assets'
OUT = f'{PROJ}/assets_prep'
HERE = os.path.dirname(os.path.abspath(__file__))
RENDER_SVG = f'{HERE}/render_svg.mjs'

LANCZOS = Image.Resampling.LANCZOS


# ---------------------------------------------------------------- basics
def load_rgba(path: str) -> Image.Image:
    im = Image.open(path)
    try:
        from PIL import ImageOps
        im = ImageOps.exif_transpose(im)
    except Exception:
        pass
    return im.convert('RGBA')


def alpha_bbox(im: Image.Image, thr: int = 8):
    a = np.array(im.getchannel('A'))
    ys, xs = np.where(a > thr)
    if len(xs) == 0:
        return (0, 0, im.width, im.height)
    return (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)


def trim(im: Image.Image, pad_frac: float = 0.0, pad_px: int = 0, thr: int = 8) -> Image.Image:
    x0, y0, x1, y1 = alpha_bbox(im, thr)
    c = im.crop((x0, y0, x1, y1))
    pad = max(pad_px, int(round(max(c.size) * pad_frac)))
    if pad:
        out = Image.new('RGBA', (c.width + 2 * pad, c.height + 2 * pad), (0, 0, 0, 0))
        out.paste(c, (pad, pad))
        return out
    return c


def resize_premult(im: Image.Image, size) -> Image.Image:
    """Lanczos resize in premultiplied space (no dark/light fringes at alpha edges)."""
    return im.convert('RGBa').resize(size, LANCZOS).convert('RGBA')


def upscale_lanczos(im: Image.Image, target_w: int, sharpen: bool = True) -> Image.Image:
    f = target_w / im.width
    big = resize_premult(im, (target_w, round(im.height * f)))
    if sharpen and f > 1.2:
        rgb = big.convert('RGB').filter(ImageFilter.UnsharpMask(radius=1.2 * f / 2, percent=60, threshold=2))
        out = rgb.convert('RGBA')
        out.putalpha(big.getchannel('A'))
        big = out
    return big


def fit_long_side(im: Image.Image, max_side: int = 2000) -> Image.Image:
    s = max(im.size)
    if s <= max_side:
        return im
    f = max_side / s
    return resize_premult(im, (round(im.width * f), round(im.height * f)))


def recolor(im: Image.Image, rgb, keep_mask=None) -> Image.Image:
    """Mono recolour: every visible pixel gets `rgb`, alpha kept. keep_mask (bool HxW) = pixels left untouched."""
    a = np.array(im).copy()
    sel = a[..., 3] > 0
    if keep_mask is not None:
        sel &= ~keep_mask
    a[sel, 0], a[sel, 1], a[sel, 2] = rgb[0], rgb[1], rgb[2]
    return Image.fromarray(a, 'RGBA')


def hex2rgb(h: str):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def rounded_plate(logo: Image.Image, pad_frac: float = 0.16, radius_frac: float = 0.22,
                  color=(255, 255, 255, 255)) -> Image.Image:
    """Logo centred on a rounded plate. Padding/radius are relative to the logo's shorter side."""
    short = min(logo.size)
    pad = round(short * pad_frac)
    W, H = logo.width + 2 * pad, logo.height + 2 * pad
    r = round(min(W, H) * radius_frac)
    ss = 4  # supersample the plate edge
    m = Image.new('L', (W * ss, H * ss), 0)
    from PIL import ImageDraw
    ImageDraw.Draw(m).rounded_rectangle((0, 0, W * ss - 1, H * ss - 1), radius=r * ss, fill=255)
    m = m.resize((W, H), LANCZOS)
    plate = Image.new('RGBA', (W, H), color)
    plate.putalpha(m)
    plate.alpha_composite(logo, (pad, pad))
    return plate


def checker_preview(im: Image.Image, size: int = 520, bg=None) -> Image.Image:
    """QA preview over checkerboard (or a flat bg colour)."""
    im = im.copy()
    im.thumbnail((size, size), LANCZOS)
    if bg is None:
        c = Image.new('RGBA', im.size)
        t = 16
        arr = np.zeros((im.height, im.width, 4), np.uint8)
        yy, xx = np.mgrid[0:im.height, 0:im.width]
        k = ((yy // t + xx // t) % 2).astype(bool)
        arr[...] = (150, 150, 150, 255)
        arr[k] = (100, 100, 100, 255)
        c = Image.fromarray(arr, 'RGBA')
    else:
        c = Image.new('RGBA', im.size, bg)
    c.alpha_composite(im)
    return c.convert('RGB')


# ---------------------------------------------------------------- vectorising flat-colour logos
def _trace_mask(mask: np.ndarray) -> list[str]:
    import vtracer
    with tempfile.TemporaryDirectory() as td:
        p = os.path.join(td, 'm.png')
        Image.fromarray(np.where(mask, 0, 255).astype(np.uint8)).convert('RGB').save(p)
        o = os.path.join(td, 'm.svg')
        vtracer.convert_image_to_svg_py(p, o, colormode='binary', mode='spline', filter_speckle=8,
                                        corner_threshold=60, length_threshold=4.0, splice_threshold=45,
                                        path_precision=2)
        svg = open(o).read()
    out = []
    for m in re.finditer(r'<path d="([^"]+)" fill="#[0-9A-Fa-f]{6}" transform="translate\(([-\d.]+),([-\d.]+)\)"/>', svg):
        out.append((m.group(1), float(m.group(2)), float(m.group(3))))
    return out


def unmix(rgb: np.ndarray, palette_rgb) -> np.ndarray:
    """Per-pixel convex unmixing of colours into palette weights (NNLS, sum≈1), via unique colours."""
    from scipy.optimize import nnls
    P = np.array(palette_rgb, np.float64).T / 255.0  # 3xK
    K = P.shape[1]
    A = np.vstack([P, 10.0 * np.ones((1, K))])
    q = np.round(rgb.reshape(-1, 3) * 255).astype(np.int32)
    keys = q[:, 0] * 65536 + q[:, 1] * 256 + q[:, 2]
    uniq, inv = np.unique(keys, return_inverse=True)
    W = np.zeros((len(uniq), K))
    for i, kk in enumerate(uniq):
        c = np.array([(kk >> 16) & 255, (kk >> 8) & 255, kk & 255]) / 255.0
        W[i], _ = nnls(A, np.concatenate([c, [10.0]]))
    W = W / np.maximum(W.sum(1, keepdims=True), 1e-6)
    return W[inv].reshape(rgb.shape[0], rgb.shape[1], K)


def vectorize_flat(im: Image.Image, palette: list[tuple[str, str]], order: list[str], scale: int = 6,
                   dilate: dict[str, int] | None = None, alpha_thr: float = 0.5, smooth: float = 0.45) -> str:
    """Trace a flat-colour raster logo to SVG.

    palette: [(name, '#rrggbb')] colours present in the logo; each visible pixel is assigned to the nearest.
    order:   bottom→top paint order of palette names.
    dilate:  {name: px_at_scale} grow lower layers slightly so stacked edges never show gaps.
    """
    a = np.array(im).astype(np.float32) / 255.0
    rgb, al = a[..., :3], a[..., 3]
    weights = unmix(rgb, [hex2rgb(h) for _, h in palette])  # HxWxK soft weights (antialias = mixtures)
    W, H = im.width * scale, im.height * scale
    paths = []
    for name in order:
        k = [n for n, _ in palette].index(name)
        soft = (weights[..., k] * al).astype(np.float32)
        big = np.array(Image.fromarray(soft, 'F').resize((W, H), Image.Resampling.BICUBIC))
        big = ndi.gaussian_filter(big, scale * smooth)
        mask = big > alpha_thr
        if dilate and dilate.get(name):
            mask = ndi.binary_dilation(mask, iterations=dilate[name])
        for dpath, tx, ty in _trace_mask(mask):
            paths.append(f'<path d="{dpath}" transform="translate({tx:g},{ty:g})" fill="{palette[k][1]}"/>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">\n'
            + '\n'.join(paths) + '\n</svg>\n')


def render_svg(svg_path: str, png_path: str, width: int, font_css: str | None = None):
    cmd = ['node', RENDER_SVG, svg_path, png_path, str(width)] + ([font_css] if font_css else [])
    subprocess.run(cmd, check=True, capture_output=True)
    return Image.open(png_path).convert('RGBA')
