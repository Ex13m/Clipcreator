"""Dark-studio cut-out (Gausse Holler renders: black/colour product on a dark grey gradient).

ISNet matte (scratchpad/bgnode/rmbg.mjs medium) -> trimap -> background plate estimated by
multi-scale normalized convolution -> colour unmixing in the edge band (alpha from |I-B| projected
on |F-B|) -> colour decontamination F = (I-(1-a)B)/a  => no grey halo on light / brand-colour sets.
See-through gaps (between tubes) are opened where the pixel equals the plate (|I-B| small).

usage (module): cutout_dark(rgb_uint8, isnet_alpha_uint8, **kw) -> RGBA uint8 ndarray
"""
import numpy as np
import cv2
from scipy import ndimage as ndi


def _nconv(img, mask, s):
    m = mask.astype(np.float32)
    num = cv2.GaussianBlur(img * m[..., None], (0, 0), s)
    den = cv2.GaussianBlur(m, (0, 0), s)
    return num / np.maximum(den, 1e-6)[..., None], den


def bg_plate(im, bgmask, scales=(6, 16, 40, 100, 250)):
    """Smooth background plate from known-background pixels (coarse -> fine blend)."""
    med = np.median(im[bgmask], 0) if bgmask.any() else np.array([40, 40, 40], np.float32)
    B = np.broadcast_to(med, im.shape).astype(np.float32).copy()
    for s in reversed(scales):
        e, den = _nconv(im, bgmask, s)
        w = np.clip(den / 0.25, 0, 1)[..., None]
        B = w * e + (1 - w) * B
    return B


def cutout_dark(rgb, isn, sil_thr=0.5, band=3, hole_min=300, hole_d=9.0, minF=14.0,
                min_frac=0.0004, keep_largest=False, fill=None, open_boxes=None, drop_boxes=None,
                peel_d=6.0, open_it=1):
    """fill / open_boxes / drop_boxes: lists of (x0,y0,x1,y1) to force-fill holes, force-open holes,
    or delete (floor shadow smears)."""
    im = rgb.astype(np.float32)
    H, W, _ = im.shape
    ia = isn.astype(np.float32) / 255.0
    if drop_boxes:
        for x0, y0, x1, y1 in drop_boxes:
            ia[y0:y1, x0:x1] = 0
    obj_loose = ndi.binary_dilation(ia > 0.05, iterations=8)
    B = bg_plate(im, (ia < 0.04) & ~obj_loose)
    d = np.sqrt(np.sum((im - B) ** 2, 2))
    ds = cv2.GaussianBlur(d, (0, 0), 1.0)
    solid = ia > sil_thr
    # peel ISNet "ghost" lobes: plate-coloured pixels connected to the outside background
    for _ in range(2):
        outside = ~ndi.binary_fill_holes(solid)
        cand = solid & (ds < peel_d)
        cl, cn = ndi.label(cand)
        if cn:
            touch = np.unique(cl[ndi.binary_dilation(outside, iterations=1) & cand])
            touch = touch[touch > 0]
            sz = ndi.sum(np.ones_like(ia), cl, touch)
            rm = touch[sz >= 30]
            solid &= ~np.isin(cl, rm)
    # smooth jaggies of the quantised ISNet matte (shadow edges under legs)
    solid = ndi.binary_opening(solid, structure=np.ones((3, 3)), iterations=open_it)
    solid = cv2.GaussianBlur(solid.astype(np.float32), (0, 0), 1.2) > 0.5
    # specks
    lab, n = ndi.label(solid)
    if n:
        sizes = ndi.sum(np.ones_like(ia), lab, np.arange(1, n + 1))
        keep = np.zeros(n + 1, bool)
        if keep_largest:
            keep[1 + int(np.argmax(sizes))] = True
        else:
            keep[1:] = sizes >= min_frac * H * W
        solid = keep[lab]
    sil = ndi.binary_fill_holes(solid)
    holes = sil & ~solid
    hl, hn = ndi.label(holes)
    opened = np.zeros_like(solid)
    if hn:
        idx = np.arange(1, hn + 1)
        hs = ndi.sum(np.ones_like(ia), hl, idx)
        hd = ndi.mean(ds, hl, idx)
        hia = ndi.mean(ia, hl, idx)
        ok = (hs >= hole_min) & (hd < hole_d) & (hia < 0.35)
        if open_boxes:
            com = ndi.center_of_mass(np.ones_like(ia), hl, idx)
            for i, (cy, cx) in enumerate(com):
                if any(x0 <= cx <= x1 and y0 <= cy <= y1 for x0, y0, x1, y1 in open_boxes):
                    ok[i] = True
        if fill:
            com = ndi.center_of_mass(np.ones_like(ia), hl, idx)
            for i, (cy, cx) in enumerate(com):
                if any(x0 <= cx <= x1 and y0 <= cy <= y1 for x0, y0, x1, y1 in fill):
                    ok[i] = False
        okl = np.zeros(hn + 1, bool); okl[1:] = ok
        opened = okl[hl]
    obj = sil & ~opened                         # binary object incl. filled small/dark holes
    inner = ndi.binary_erosion(obj, iterations=band)
    edge = ndi.binary_dilation(obj, iterations=band) & ~inner   # unmixing band around every boundary
    # local foreground colour from the solid interior next to the edge
    F, den = _nconv(im, inner, 2.5)
    F2, _ = _nconv(im, inner, 8)
    w = np.clip(den / 0.15, 0, 1)[..., None]
    F = w * F + (1 - w) * F2
    v = F - B
    vv = np.sum(v * v, 2)
    a_un = np.clip(np.sum((im - B) * v, 2) / np.maximum(vv, 1e-3), 0, 1)
    soft = cv2.GaussianBlur(obj.astype(np.float32), (0, 0), 0.9)
    a = np.where(vv > minF ** 2, a_un, soft)
    # pixels well inside the binary object but unmixed low = dark-on-dark ambiguity -> trust the mask
    a = np.where(obj & (a < soft), np.maximum(a, soft * 0.98), a)
    a = np.where(~obj, np.minimum(a, soft), a)  # outside the mask: never more than the feathered mask
    alpha = np.where(inner, 1.0, np.where(edge, a, 0.0)).astype(np.float32)
    aa = alpha[..., None]
    Fc = (im - (1 - aa) * B) / np.maximum(aa, 1e-3)
    Fc = np.where(aa > 0.15, Fc, F)
    Fc = np.clip(Fc, 0, 255)
    out = np.dstack([Fc, alpha * 255]).round().astype(np.uint8)
    return out, B


def trim(rgba, pad_frac=0.03, thr=8):
    a = rgba[..., 3]
    ys, xs = np.where(a > thr)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    h, w = y1 - y0, x1 - x0
    p = int(round(max(h, w) * pad_frac))
    H, W = a.shape
    out = np.zeros((h + 2 * p, w + 2 * p, 4), np.uint8)
    out[p:p + h, p:p + w] = rgba[y0:y1, x0:x1]
    return out, (int(x0), int(y0), int(x1), int(y1)), p
