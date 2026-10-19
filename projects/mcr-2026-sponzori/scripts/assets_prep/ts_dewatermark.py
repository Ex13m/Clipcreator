"""Remove the TROUTSHOP.EU watermark (black text at 7.84 % opacity, same relative
geometry on every square product photo) by exact inverse blending:
orig = obs / (1 - A).  Template: ts_watermark_alpha_1500.npy (1500 px geometry),
built by ts_wm_build.py from 7 shop images + Montserrat 800 fit for hidden glyphs.
Each glyph is then re-aligned per image (shift/strength that minimise residual
edge energy), and a thin residual edge band on the product is median-cleaned.
Usage: python3 ts_dewatermark.py in.jpg|png out.png"""
import sys, os, numpy as np, cv2
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
TPL = np.load(os.path.join(HERE, 'ts_watermark_alpha_1500.npy')).astype(np.float32)

def shift(A, dx, dy):
    return cv2.warpAffine(A, np.float32([[1, 0, dx], [0, 1, dy]]), A.shape[::-1], flags=cv2.INTER_LINEAR)

def grad_energy(img, m):
    g = cv2.cvtColor(np.clip(img, 0, 255).astype(np.uint8), cv2.COLOR_RGB2LAB).astype(np.float32)
    e = 0
    for c in range(3):
        gx = cv2.Sobel(g[..., c], cv2.CV_32F, 1, 0, ksize=3); gy = cv2.Sobel(g[..., c], cv2.CV_32F, 0, 1, ksize=3)
        e += np.abs(gx[m]).sum() + np.abs(gy[m]).sum()
    return e

def dewatermark(img, refine=True, clean=True, verbose=False):
    a = np.array(img.convert('RGBA')).astype(np.float32)
    h, w = a.shape[:2]
    rgb = a[..., :3]
    A0 = cv2.resize(TPL, (w, h), interpolation=cv2.INTER_AREA)
    n, lab = cv2.connectedComponents((A0 > 0.004).astype(np.uint8))
    comps = []
    for k in range(1, n):
        mk = lab == k
        if mk.sum() < 20: continue
        comps.append(np.where(mk, A0, 0).astype(np.float32))
    Afinal = np.zeros_like(A0)
    for Ak in comps:
        best = (None, 0, 0, 1.0)
        if refine:
            ys, xs = np.where(Ak > 0)
            y0, y1 = max(0, ys.min() - 8), min(h, ys.max() + 9); x0, x1 = max(0, xs.min() - 8), min(w, xs.max() + 9)
            sub = rgb[y0:y1, x0:x1]; Ask = Ak[y0:y1, x0:x1]
            reg = cv2.dilate((Ask > 0.002).astype(np.uint8), np.ones((7, 7), np.uint8)) > 0
            step = 0.5 if w >= 1000 else 0.25
            for dx in np.arange(-3, 3.01, step):
                for dy in np.arange(-3, 3.01, step):
                    As = shift(Ask, dx, dy)
                    for s in (0.85, 1.0, 1.15):
                        e = grad_energy(sub / (1 - s * As[..., None]), reg)
                        if best[0] is None or e < best[0]: best = (e, dx, dy, s)
            if verbose: print('glyph', xs.min(), best[1:])
        Afinal += best[3] * shift(Ak, best[1], best[2])
    out = a.copy()
    if img.mode == 'RGBA':
        # exact Porter-Duff unblend of a black layer (alpha A) over the product layer
        al = a[..., 3] / 255.0
        ap = np.clip((al - Afinal) / (1 - Afinal), 0, 1)
        ap[ap < 0.02] = 0
        # leftover letter fringe on transparent background (template edge mismatch)
        near = cv2.dilate((ap > 0.8).astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
        zone = cv2.dilate((Afinal > 0.002).astype(np.uint8), np.ones((7, 7), np.uint8)) > 0
        ap[zone & (ap < 0.25) & ~near] = 0
        with np.errstate(divide='ignore', invalid='ignore'):
            cp = np.where(ap[..., None] > 0, rgb * al[..., None] / np.maximum(ap[..., None] * (1 - Afinal[..., None]), 1e-6), 0)
        out[..., :3] = np.clip(cp, 0, 255)
        out[..., 3] = ap * 255
    else:
        out[..., :3] = np.clip(rgb / (1 - Afinal[..., None]), 0, 255)
    if clean:
        # residual 1-2 px outline: median-filter only a thin band around glyph edges
        edge = cv2.morphologyEx((Afinal > 0.02).astype(np.uint8), cv2.MORPH_GRADIENT, np.ones((3, 3), np.uint8)) > 0
        med = cv2.medianBlur(out[..., :3].round().astype(np.uint8), 5).astype(np.float32)
        band = cv2.GaussianBlur(edge.astype(np.float32), (0, 0), 0.8)[..., None]
        if img.mode == 'RGBA':
            band = band * (out[..., 3:4] > 250)
        out[..., :3] = out[..., :3] * (1 - band) + med * band
    return Image.fromarray(out.round().astype(np.uint8), 'RGBA')

if __name__ == '__main__':
    out = dewatermark(Image.open(sys.argv[1]), verbose='-v' in sys.argv)
    out.save(sys.argv[2]); print(sys.argv[2])
