"""White-background packshot cut-out = ISNet alpha (bgnode/rmbg.mjs) refined with
the known white backdrop: halo removal on the ISNet edge band, thin dark parts
(hooks, split rings) re-added from distance-to-white, enclosed pure-white holes
(spoon eyes) punched out, white fringe decontaminated (unmix with #fff).
Usage: python3 ts_cutout.py dw.png ml.png out.png [--no-holes]"""
import sys, numpy as np, cv2
from PIL import Image

def cutout(dw_path, ml_path, holes=True):
    rgb = np.array(Image.open(dw_path).convert('RGB')).astype(np.float32)
    a_ml = np.array(Image.open(ml_path).convert('RGBA'))[..., 3].astype(np.float32) / 255
    if a_ml.shape != rgb.shape[:2]:
        a_ml = cv2.resize(a_ml, rgb.shape[1::-1], interpolation=cv2.INTER_LINEAR)
    dist = 255 - rgb.min(2)                       # 0 = pure white backdrop
    dist = cv2.GaussianBlur(dist, (0, 0), 0.6)
    a_soft = np.clip((dist - 3) / 22, 0, 1)        # halo killer on the ML edge band
    a_hard = np.clip((dist - 28) / 55, 0, 1)       # clearly non-white (hooks, rings)
    alpha = a_ml.copy()
    edge = cv2.dilate(((a_ml > 0.02) & (a_ml < 0.98)).astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    alpha[edge] = np.minimum(a_ml, a_soft)[edge]
    # re-add thin dark parts the network dropped, but only if connected to the product
    add = (a_hard > 0.35).astype(np.uint8)
    n, lab, st, _ = cv2.connectedComponentsWithStats(((alpha > 0.5) | (add > 0)).astype(np.uint8), 8)
    core = alpha > 0.5
    keep = np.zeros(n, bool)
    for k in range(1, n):
        if st[k, cv2.CC_STAT_AREA] > 400 and core[lab == k].any(): keep[k] = True
    conn = keep[lab]
    alpha = np.where(conn, np.maximum(alpha, a_hard), 0)
    # hooks: soft edge from distance-to-white where alpha came from a_hard
    if holes:
        # enclosed near-white blobs inside the product = eyelets / holes -> transparent
        white = (dist < 10).astype(np.uint8)
        n2, lab2, st2, _ = cv2.connectedComponentsWithStats(white, 4)
        H, W = white.shape
        for k in range(1, n2):
            x, y, w, h, area = st2[k]
            if x == 0 or y == 0 or x + w >= W or y + h >= H: continue   # touches border = backdrop
            if area > 0.004 * H * W: continue
            fill = area / (w * h + 1e-6)
            if fill < 0.5 or max(w, h) / max(1, min(w, h)) > 2.2: continue  # round-ish only
            m = lab2 == k
            ring = cv2.dilate(m.astype(np.uint8), np.ones((9, 9), np.uint8)) > 0
            alpha[ring & (dist < 18)] = np.minimum(alpha, a_soft)[ring & (dist < 18)]
            alpha[m] = 0
    # remove tiny islands
    n3, lab3, st3, _ = cv2.connectedComponentsWithStats((alpha > 0.05).astype(np.uint8), 8)
    for k in range(1, n3):
        if st3[k, cv2.CC_STAT_AREA] < 300: alpha[lab3 == k] = 0
    # decontaminate white fringe
    a = np.clip(alpha, 0, 1)[..., None]
    ae = np.maximum(a, 0.2)
    fg = np.clip((rgb - (1 - ae) * 255) / ae, 0, 255)
    fg = np.where(a > 0.97, rgb, fg)
    out = np.dstack([fg, alpha * 255]).round().clip(0, 255).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')

if __name__ == '__main__':
    im = cutout(sys.argv[1], sys.argv[2], holes='--no-holes' not in sys.argv)
    im.save(sys.argv[3]); print(sys.argv[3])
