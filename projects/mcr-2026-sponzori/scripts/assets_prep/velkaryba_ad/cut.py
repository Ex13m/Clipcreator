"""White-packshot cut-out with colour unmixing (no white halos) + ISNet-assisted hole detection.
usage (as module): cutout(rgb, isnet=None, ...) -> RGBA PIL image
"""
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi


def patch_circles(up, ref, circles, feather=8):
    """Replace circular regions of `up` by `ref` (same size) with a feathered mask."""
    H, W = up.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W]
    m = np.zeros((H, W), np.float32)
    for cx, cy, r in circles:
        d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
        m = np.maximum(m, np.clip((r + feather - d) / (2 * feather), 0, 1))
    return up * (1 - m[..., None]) + ref * m[..., None]


def cutout(rgb, isnet=None, bg_thr=7.0, hole_isnet_max=0.35, win=3, min_frac=0.0005,
           keep_boxes=None, white=None):
    im = rgb.astype(np.float32)
    H, W, _ = im.shape
    if white is None:
        border = np.concatenate([im[0], im[-1], im[:, 0], im[:, -1]])
        white = np.median(border, 0)
    white = np.asarray(white, np.float32)
    dark = np.max(white - im, axis=2)                       # >0 = darker than paper
    ds = ndi.gaussian_filter(dark, 0.7)
    nearw = ds < bg_thr
    lab, n = ndi.label(nearw)
    edge_ids = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    edge_ids = edge_ids[edge_ids > 0]
    bg = np.isin(lab, edge_ids)
    if isnet is not None and n:
        ia = isnet.astype(np.float32) / 255.0
        idx = np.arange(1, n + 1)
        means = ndi.mean(ia, lab, idx)
        sizes = ndi.sum(np.ones_like(ia), lab, idx)
        holes = idx[(means < hole_isnet_max) & (sizes > 20)]
        holes = np.setdiff1d(holes, edge_ids)
        bg |= np.isin(lab, holes)
    obj = ~bg
    # drop specks / unwanted components
    ol, on = ndi.label(obj)
    if on:
        sizes = ndi.sum(np.ones_like(dark), ol, np.arange(1, on + 1))
        keep = np.zeros(on + 1, bool)
        keep[1:] = sizes >= min_frac * H * W
        if keep_boxes is not None:
            com = ndi.center_of_mass(np.ones_like(dark), ol, np.arange(1, on + 1))
            for i, (cy, cx) in enumerate(com):
                inside = any(x0 <= cx <= x1 and y0 <= cy <= y1 for x0, y0, x1, y1 in keep_boxes)
                keep[i + 1] &= inside
        obj = keep[ol]
    # foreground colour estimate F: most "object-like" (darkest vs paper) pixel in a window, inside obj
    score = np.where(obj, dark, -1e9)
    best = np.full((H, W), -1e9, np.float32)
    F = im.copy()
    pad = win
    sp = np.pad(score, pad, constant_values=-1e9)
    ip = np.pad(im, ((pad, pad), (pad, pad), (0, 0)), mode='edge')
    for dy in range(-win, win + 1):
        for dx in range(-win, win + 1):
            s = sp[pad + dy:pad + dy + H, pad + dx:pad + dx + W]
            better = s > best
            best = np.where(better, s, best)
            F = np.where(better[..., None], ip[pad + dy:pad + dy + H, pad + dx:pad + dx + W], F)
    interior = ndi.binary_erosion(obj, iterations=2)
    band = ndi.binary_dilation(obj, iterations=2) & ~interior
    v = white - F
    c = white - im
    vv = np.sum(v * v, 2)
    a_un = np.clip(np.sum(c * v, 2) / np.maximum(vv, 1e-3), 0, 1)
    soft = ndi.gaussian_filter(obj.astype(np.float32), 0.8)
    a = np.where(vv > 30 ** 2, a_un, soft)
    alpha = np.where(interior, 1.0, np.where(band, a, 0.0)).astype(np.float32)
    # keep alpha monotone with the binary mask outside (no stray specks outside band)
    unmix = (im - (1 - alpha[..., None]) * white) / np.maximum(alpha[..., None], 1e-3)
    unmix = np.clip(unmix, 0, 255)
    w = np.clip((alpha - 0.2) / 0.6, 0, 1)[..., None]
    col = np.where(interior[..., None], im, w * unmix + (1 - w) * F)
    out = np.dstack([col, alpha * 255]).round().clip(0, 255).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')


def trim_pad(im, pad=24, thr=6):
    a = np.asarray(im)[..., 3]
    ys, xs = np.where(a > thr)
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    c = im.crop((x0, y0, x1, y1))
    out = Image.new('RGBA', (c.width + 2 * pad, c.height + 2 * pad), (0, 0, 0, 0))
    out.paste(c, (pad, pad))
    return out


def contact_shadow(im, squash=0.12, blur=0.035, opacity=0.55):
    """Soft floor shadow matte (black, alpha) sized to the cut-out's width; place under the product."""
    a = np.asarray(im)[..., 3].astype(np.float32) / 255
    W = im.width
    prof = a.max(0)                                  # silhouette width profile
    h = max(8, int(im.height * squash))
    sh = np.zeros((h * 3, W), np.float32)
    sh[h:2 * h] = prof[None, :]
    sh = ndi.gaussian_filter(sh, (h * 0.45, W * blur))
    sh = sh / max(sh.max(), 1e-6) * opacity
    rgba = np.zeros((sh.shape[0], W, 4), np.uint8)
    rgba[..., 3] = (sh * 255).astype(np.uint8)
    return Image.fromarray(rgba, 'RGBA')


def cutout2(rgb, isnet, fg_isnet=0.85, bg_isnet=0.08, dark_seed=60, bg_dark_max=30,
            haze=0.05, keep_boxes=None, min_frac=0.0002, white=None, vfloor=40):
    """Trimap from ISNet + darkness, alpha by colour unmixing against paper white in the unknown band."""
    im = rgb.astype(np.float32)
    H, W, _ = im.shape
    if white is None:
        border = np.concatenate([im[0], im[-1], im[:, 0], im[:, -1]])
        white = np.median(border, 0)
    white = np.asarray(white, np.float32)
    dark = np.max(white - im, axis=2)
    ia = isnet.astype(np.float32) / 255.0
    fg = (ia > fg_isnet) | (ndi.gaussian_filter(dark, 0.6) > dark_seed)
    fg = ndi.binary_erosion(fg, iterations=1) | (dark > dark_seed + 40)
    bg = (ia < bg_isnet) & (dark < bg_dark_max)
    # nearest fg colour for every pixel
    dist, (iy, ix) = ndi.distance_transform_edt(~fg, return_indices=True)
    F = im[iy, ix]
    v = white - F
    c = white - im
    vv = np.sum(v * v, 2)
    a_un = np.clip(np.sum(c * v, 2) / np.maximum(vv, 1e-3), 0, 1)
    a = np.where(vv > vfloor ** 2, a_un, ia)
    a = np.clip((a - haze) / (1 - haze), 0, 1)
    alpha = np.where(fg, 1.0, np.where(bg, 0.0, a))
    alpha = np.where(dist > 12, 0.0, alpha)            # nothing far from the object
    # component filter on the solid part
    solid = alpha > 0.5
    ol, on = ndi.label(solid)
    if on:
        idx = np.arange(1, on + 1)
        sizes = ndi.sum(np.ones_like(dark), ol, idx)
        keep = np.zeros(on + 1, bool)
        keep[1:] = sizes >= min_frac * H * W
        if keep_boxes is not None:
            com = ndi.center_of_mass(np.ones_like(dark), ol, idx)
            for i, (cy, cx) in enumerate(com):
                keep[i + 1] &= any(x0 <= cx <= x1 and y0 <= cy <= y1 for x0, y0, x1, y1 in keep_boxes)
        kept = keep[ol]
        near = ndi.binary_dilation(kept, iterations=4)
        alpha = np.where(near, alpha, 0.0)
        alpha = np.where(solid & ~kept, 0.0, alpha)
    unmix = np.clip((im - (1 - alpha[..., None]) * white) / np.maximum(alpha[..., None], 1e-3), 0, 255)
    w = np.clip((alpha - 0.25) / 0.6, 0, 1)[..., None]
    col = np.where(fg[..., None], im, w * unmix + (1 - w) * F)
    out = np.dstack([col, alpha * 255]).round().clip(0, 255).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')


def cutout3(rgb, isnet, fg_isnet=0.85, bg_isnet=0.08, dark_seed=60, bg_dark_max=30,
            haze=0.05, keep_boxes=None, min_frac=0.0002, white=None, vfloor=40,
            hole_dark=22, hole_isnet=0.2, hole_min=150):
    """cutout2 + topology: everything enclosed by the product is opaque except true paper-white holes."""
    im = rgb.astype(np.float32)
    H, W, _ = im.shape
    if white is None:
        border = np.concatenate([im[0], im[-1], im[:, 0], im[:, -1]])
        white = np.median(border, 0)
    white = np.asarray(white, np.float32)
    dark = np.max(white - im, axis=2)
    ia = isnet.astype(np.float32) / 255.0
    fg = (ia > fg_isnet) | (ndi.gaussian_filter(dark, 0.6) > dark_seed)
    fg = ndi.binary_erosion(fg, iterations=1) | (dark > dark_seed + 40)
    lab, n = ndi.label(~fg)
    edge = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    edge = edge[edge > 0]
    outside = np.isin(lab, edge)
    idx = np.arange(1, n + 1)
    md = ndi.mean(dark, lab, idx); mi = ndi.mean(ia, lab, idx); sz = ndi.sum(np.ones_like(dark), lab, idx)
    holes = idx[(md < hole_dark) & (mi < hole_isnet) & (sz >= hole_min)]
    holes = np.setdiff1d(holes, edge)
    outside |= np.isin(lab, holes)
    enclosed = ~fg & ~outside
    bg = outside & (ia < bg_isnet) & (dark < bg_dark_max)
    dist, (iy, ix) = ndi.distance_transform_edt(~fg, return_indices=True)
    F = im[iy, ix]
    v = white - F; c = white - im
    vv = np.sum(v * v, 2)
    a_un = np.clip(np.sum(c * v, 2) / np.maximum(vv, 1e-3), 0, 1)
    a = np.where(vv > vfloor ** 2, a_un, ia)
    a = np.clip((a - haze) / (1 - haze), 0, 1)
    alpha = np.where(fg | enclosed, 1.0, np.where(bg, 0.0, a))
    alpha = np.where((dist > 12) & outside, 0.0, alpha)
    solid = alpha > 0.5
    ol, on = ndi.label(solid)
    if on:
        oidx = np.arange(1, on + 1)
        sizes = ndi.sum(np.ones_like(dark), ol, oidx)
        keep = np.zeros(on + 1, bool)
        keep[1:] = sizes >= min_frac * H * W
        if keep_boxes is not None:
            com = ndi.center_of_mass(np.ones_like(dark), ol, oidx)
            for i, (cy, cx) in enumerate(com):
                keep[i + 1] &= any(x0 <= cx <= x1 and y0 <= cy <= y1 for x0, y0, x1, y1 in keep_boxes)
        kept = keep[ol]
        near = ndi.binary_dilation(kept, iterations=4)
        alpha = np.where(near, alpha, 0.0)
        alpha = np.where(solid & ~kept, 0.0, alpha)
    unmix = np.clip((im - (1 - alpha[..., None]) * white) / np.maximum(alpha[..., None], 1e-3), 0, 255)
    w = np.clip((alpha - 0.25) / 0.6, 0, 1)[..., None]
    col = np.where((fg | enclosed)[..., None], im, w * unmix + (1 - w) * F)
    out = np.dstack([col, alpha * 255]).round().clip(0, 255).astype(np.uint8)
    return Image.fromarray(out, 'RGBA'), dict(holes=len(holes), enclosed_px=int(enclosed.sum()))


def contact_shadow2(im, width_frac=0.8, opacity=0.6):
    """Soft elliptical floor shadow (black + alpha). Canvas = 1.4 × product width; centre it under the product."""
    W = im.width
    cw = int(W * 1.4); ch = max(40, int(W * 0.22))
    yy, xx = np.mgrid[0:ch, 0:cw].astype(np.float32)
    cx, cy = cw / 2, ch / 2
    rx = W * width_frac / 2; ry = ch * 0.16
    soft = np.exp(-(((xx - cx) / (rx * 0.75)) ** 2 + ((yy - cy) / (ry * 1.6)) ** 2))   # wide penumbra
    core = np.exp(-(((xx - cx) / (rx * 0.45)) ** 2 + ((yy - cy) / (ry * 0.6)) ** 2))   # contact core
    sh = np.clip(0.55 * soft + 0.6 * core, 0, 1) * opacity
    rgba = np.zeros((ch, cw, 4), np.uint8)
    rgba[..., 3] = (sh * 255).astype(np.uint8)
    return Image.fromarray(rgba, 'RGBA')
