import numpy as np, cv2
from PIL import Image
from scipy import ndimage as ndi

def clean_alpha(a, lo=10, min_island=0.002, fill=True):
    """a: uint8 alpha. drop faint noise, small islands, fill holes (keeps soft edge)."""
    a = a.copy(); a[a < lo] = 0
    m = a > 127
    lab, n = ndi.label(m)
    if n > 1:
        sizes = ndi.sum(m, lab, range(1, n + 1)); keep = np.zeros(n + 1, bool)
        keep[1:] = sizes >= sizes.max() * min_island
        m = keep[lab]
    if fill:
        m = ndi.binary_fill_holes(m)
    # soft edge allowed only near the hard mask
    near = ndi.binary_dilation(m, iterations=3)
    a[~near] = 0
    a[m & (a < 255)] = np.maximum(a[m & (a < 255)], 0)
    holes = m & (a < 200) & ndi.binary_erosion(m, iterations=4)
    a[holes] = 255
    return a

def shrink(a, px=1.0):
    """erode alpha edge by ~px (removes halo) keeping anti-aliasing"""
    if px <= 0: return a
    f = a.astype(np.float32) / 255.0
    k = int(np.ceil(px)) * 2 + 1
    er = cv2.erode(f, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k)))
    w = px / np.ceil(px)
    out = f * (1 - w) + er * w
    return (np.clip(out, 0, 1) * 255).astype(np.uint8)

def feather(a, sigma=0.8):
    f = cv2.GaussianBlur(a.astype(np.float32), (0, 0), sigma)
    return np.clip(f, 0, 255).astype(np.uint8)

def decontaminate(rgb, a, band=6, sigma=5):
    """replace colours in the semi-transparent edge band by colours pulled from the solid interior"""
    rgb = rgb.astype(np.float32)
    solid = (a >= 250).astype(np.float32)
    solid = cv2.erode(solid, np.ones((3, 3), np.uint8), iterations=2)
    num = cv2.GaussianBlur(rgb * solid[..., None], (0, 0), sigma)
    den = cv2.GaussianBlur(solid, (0, 0), sigma)[..., None]
    fillc = num / np.maximum(den, 1e-4)
    edge = (a > 0) & (a < 250)
    edge = cv2.dilate(edge.astype(np.uint8), np.ones((3, 3), np.uint8), iterations=band // 3).astype(bool) & (a > 0) & (solid < 0.5)
    t = np.zeros(a.shape, np.float32)
    t[edge] = 1.0 - (a[edge].astype(np.float32) / 255.0) * 0.6
    t = np.clip(t, 0, 1)[..., None]
    out = rgb * (1 - t) + fillc * t
    return np.clip(out, 0, 255).astype(np.uint8)

def save_cut(rgb, a, path, pad_frac=0.03, max_side=None):
    ys, xs = np.where(a > 8)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    rgba = np.dstack([rgb[y0:y1, x0:x1], a[y0:y1, x0:x1]])
    im = Image.fromarray(rgba, 'RGBA')
    pad = int(round(max(im.size) * pad_frac))
    out = Image.new('RGBA', (im.width + 2 * pad, im.height + 2 * pad), (0, 0, 0, 0)); out.paste(im, (pad, pad))
    if max_side and max(out.size) > max_side:
        s = max_side / max(out.size)
        out = out.convert('RGBa').resize((round(out.width * s), round(out.height * s)), Image.Resampling.LANCZOS).convert('RGBA')
    out.save(path, optimize=True)
    return out.size

def shadow_png(path_in, path_out, blur_frac=0.025, opacity=0.55, squash=1.0):
    im = Image.open(path_in).convert('RGBA'); a = np.array(im)[..., 3].astype(np.float32)
    s = max(im.size) * blur_frac
    pad = int(s * 3)
    A = np.pad(a, pad)
    A = cv2.GaussianBlur(A, (0, 0), s) * opacity
    out = np.zeros(A.shape + (4,), np.uint8); out[..., 3] = np.clip(A, 0, 255).astype(np.uint8)
    Image.fromarray(out, 'RGBA').save(path_out, optimize=True)
    return pad
