"""Troutshop ad cut-outs: final polish of an RGBA packshot cut from a white backdrop.

1. hole_fix   - spoon eyelets: a white, ragged ring left inside the hole (white backdrop seen
                through the eye) is merged into the hole, the hole is refitted as a clean
                anti-aliased ellipse and gets a thin darker cut edge.
2. defringe   - 1-2 px light rim along the silhouette: on body parts the rim colour is replaced
                by the local interior colour; on thin dark parts (hooks, split rings) whitish
                edge pixels lose alpha.
Bodies that are themselves white / silver are left alone (the rule only fires when the rim is
clearly lighter and less saturated than the interior next to it).
Used by ts_ads_finalize.py (polish(im) before trim/split). CLI: python3 -I ts_polish.py in.png out.png
"""
import sys, numpy as np, cv2
from PIL import Image


def _hsv(rgb):
    mx = rgb.max(-1); mn = rgb.min(-1)
    return mx, np.where(mx > 1, (mx - mn) / np.maximum(mx, 1), 0)


def hole_fix(a, report=None):
    rgb = a[..., :3].astype(np.float32); al = a[..., 3].astype(np.float32)
    H, W = al.shape
    v, s = _hsv(rgb)
    whiteish = (rgb.min(-1) > 175) & (s < 0.22)
    n, lab, st, _ = cv2.connectedComponentsWithStats((al < 128).astype(np.uint8), 4)
    for k in range(1, n):
        x, y, w, h, area = st[k]
        if x == 0 or y == 0 or x + w >= W or y + h >= H: continue
        if area < 120 or area > 0.02 * H * W: continue
        hole = (lab == k).astype(np.uint8)
        r = max(3, int(round(0.5 * (w + h) / 2)))
        rr = max(4, int(r * 0.45))                        # white ring may be up to ~45 % of the radius
        ring = (cv2.dilate(hole, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * rr + 1,) * 2)) > 0) & (hole == 0)
        wr = ring & whiteish & (al > 0)
        # body colour in an annulus outside the ring: skip white / silver bodies
        outer = (cv2.dilate(hole, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * (rr + 10) + 1,) * 2)) > 0) & ~ring & (hole == 0) & (al > 250)
        if outer.sum() < 30: continue
        body_white = whiteish[outer].mean()
        if body_white > 0.25 or wr.sum() < 0.08 * area: continue
        # only clean round eyelets fully enclosed by the spoon body: no split ring / hook wire in or
        # around the hole (a refit there would punch through the wire); those are left to defringe()
        if max(w, h) / max(1, min(w, h)) > 1.5: continue
        ann = (cv2.dilate(hole, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * (rr + 10) + 1,) * 2)) > 0) & (hole == 0)
        if (al[ann] > 250).mean() < 0.8 or (rgb.max(-1)[ann & ~wr] < 70).mean() > 0.08: continue
        # keep only white pixels connected to the hole
        u = (hole > 0) | wr
        n2, lab2 = cv2.connectedComponents(u.astype(np.uint8), connectivity=8)
        ids = np.unique(lab2[hole > 0]); u = np.isin(lab2, ids[ids > 0])
        u = cv2.morphologyEx(u.astype(np.uint8), cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
        cs, _ = cv2.findContours(u, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        c = max(cs, key=cv2.contourArea)
        if len(c) < 8: continue
        (cx, cy), (ew, eh), ang = cv2.fitEllipse(c)
        # supersampled anti-aliased ellipse (slightly inside the white ring's outer edge so no white survives)
        SS = 8; pad = int(max(ew, eh) / 2 + 6)
        x0, y0 = max(0, int(cx) - pad), max(0, int(cy) - pad); x1, y1 = min(W, int(cx) + pad), min(H, int(cy) + pad)
        big = np.zeros(((y1 - y0) * SS, (x1 - x0) * SS), np.uint8)
        cv2.ellipse(big, (((cx - x0 + 0.5) * SS - 0.5, (cy - y0 + 0.5) * SS - 0.5), ((ew + 1.0) * SS, (eh + 1.0) * SS), ang), 255, -1, cv2.LINE_AA)
        m = cv2.resize(big, (x1 - x0, y1 - y0), interpolation=cv2.INTER_AREA).astype(np.float32) / 255
        sub = al[y0:y1, x0:x1]
        al[y0:y1, x0:x1] = sub * (1 - m)
        # thin darker cut edge (1.5 px) just outside the new hole
        rim = np.clip(cv2.GaussianBlur(m, (0, 0), 1.2) - m, 0, 1) * 2.2
        rim = np.clip(rim, 0, 1)[..., None]
        rgb[y0:y1, x0:x1] = rgb[y0:y1, x0:x1] * (1 - 0.35 * rim)
        # any white left in a 3 px band around the new hole -> local body colour
        band = (cv2.dilate((m > 0.02).astype(np.uint8), np.ones((7, 7), np.uint8)) > 0) & (m < 0.98)
        sub_rgb = rgb[y0:y1, x0:x1]; known = (~band & (sub > 250) & (m < 0.02)).astype(np.float32)
        ref = cv2.GaussianBlur(sub_rgb * known[..., None], (0, 0), 3) / np.maximum(cv2.GaussianBlur(known, (0, 0), 3), 1e-3)[..., None]
        wb = band & whiteish[y0:y1, x0:x1]
        sub_rgb[wb] = ref[wb]
        if report is not None: report.append(f'hole {k} @({cx:.0f},{cy:.0f}) {ew:.0f}x{eh:.0f} white ring {int(wr.sum())} px -> refit')
    a[..., :3] = np.clip(rgb, 0, 255).round().astype(np.uint8); a[..., 3] = np.clip(al, 0, 255).round().astype(np.uint8)
    return a


def defringe(a, report=None):
    rgb = a[..., :3].astype(np.float32); al = a[..., 3].astype(np.float32) / 255
    solid = (al > 0.5).astype(np.uint8)
    din = cv2.distanceTransform(solid, cv2.DIST_L2, 5)
    thick = cv2.dilate((din > 6).astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))) > 0
    band = (al > 0.02) & (din <= 2.6)
    known = ((din >= 3.5) & (din <= 9) & (al > 0.98)).astype(np.float32)
    ref = cv2.GaussianBlur(rgb * known[..., None], (0, 0), 3.5) / np.maximum(cv2.GaussianBlur(known, (0, 0), 3.5), 1e-4)[..., None]
    has_ref = cv2.GaussianBlur(known, (0, 0), 3.5) > 0.02
    lum = rgb.mean(-1); rlum = ref.mean(-1)
    _, s = _hsv(rgb); _, rs = _hsv(ref)
    lighter = np.clip((lum - rlum - 10) / 40, 0, 1) * np.clip((rs - s + 0.05) / 0.25, 0, 1)
    body = band & thick & has_ref & (lighter > 0)
    w = lighter[..., None]
    rgb = np.where(body[..., None], rgb * (1 - w) + ref * w, rgb)
    # thicker (3-5 px) paper-white rims on strongly coloured bodies (eyelet walls next to a split ring)
    band2 = (al > 0.02) & (din <= 5) & (rgb.min(-1) > 175) & (s < 0.22) & (rs > 0.45) & has_ref & thick
    rgb[band2] = ref[band2]
    # thin dark parts: whitish semi-transparent edge pixels -> drop alpha
    thin = band & ~thick
    wire_white = np.clip((rgb.min(-1) - 120) / 90, 0, 1) * np.clip((0.3 - s) / 0.3, 0, 1)
    k = thin & (al < 0.995) & (wire_white > 0)
    al = np.where(k, al * (1 - 0.85 * wire_white), al)
    if report is not None: report.append(f'defringe body {int(body.sum())} px, wire {int(k.sum())} px')
    a[..., :3] = np.clip(rgb, 0, 255).round().astype(np.uint8); a[..., 3] = np.clip(al * 255, 0, 255).round().astype(np.uint8)
    return a


def clear_lure(a, report=None, lo=140.0, hi=188.0):
    """Clear plastic crank (HF remove_background): keep the translucent body as is, but
    (1) dark hooks: HF left them semi-transparent (alpha 0.5-0.9) inside a 10-15 px whitish glow
        (alpha 1-150, lum 165-225 = soft-focus edge on the white backdrop). Their alpha is rebuilt
        from luminance: lum <= lo -> opaque, lum >= hi -> transparent (smoothstep), edge colour
        unmixed from white. Only components that are really dark wire (30th pct lum < 120), so the
        silver snap at the lip stays untouched.
    (2) body / lip silhouette: the 6-8 px feathered glow is steepened to a ~3 px edge."""
    rgb = a[..., :3].astype(np.float32); al = a[..., 3].astype(np.float32) / 255
    lum = rgb.mean(-1)
    din = cv2.distanceTransform((al > 0.5).astype(np.uint8), cv2.DIST_L2, 5)
    body = cv2.dilate((din > 14).astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * 22 + 1,) * 2)) > 0
    zone = (al > 0) & ~body
    n, lab = cv2.connectedComponents(zone.astype(np.uint8), connectivity=8)
    wire = np.zeros_like(zone)
    for k in range(1, n):
        m = lab == k
        if m.sum() > 200 and np.percentile(lum[m & (al > 0.3)] if (m & (al > 0.3)).any() else [255], 30) < 120: wire |= m
    t = np.clip((hi - lum) / (hi - lo), 0, 1); a_l = t * t * (3 - 2 * t)
    al_w = np.where(wire, a_l, al)
    # specular streak along the wire (lighter than lo) lies between opaque wire edges -> keep it opaque
    inside = cv2.morphologyEx((a_l > 0.5).astype(np.uint8), cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))) > 0
    al_w = np.where(wire & inside & (al > 0.45), np.maximum(al_w, 1.0), al_w)
    # drop specks (< 25 px islands) left by the threshold, then re-antialias the wire edge a little
    n2, lab2, st2, _ = cv2.connectedComponentsWithStats((wire & (al_w > 0.08)).astype(np.uint8), 8)
    speck = np.isin(lab2, [k for k in range(1, n2) if st2[k, cv2.CC_STAT_AREA] < 25])
    al_w = np.where(wire & (speck | (al_w <= 0.08)), 0, al_w)
    al_w = np.where(wire, np.minimum(cv2.GaussianBlur(al_w, (0, 0), 0.6) * 1.15, 1), al_w)
    ae = np.maximum(al_w, 0.3)[..., None]
    fg = np.clip((rgb - (1 - ae) * 255) / ae, 0, 255)
    rgb = np.where((wire & (al_w > 0) & (al_w < 0.98))[..., None], fg, rgb)
    ramp = body & (al_w < 0.97) & (din < 9)
    st = np.clip((al_w - 0.35) / 0.55, 0, 1); st = st * st * (3 - 2 * st)
    al_w = np.where(ramp, np.minimum(al_w, st), al_w)
    if report is not None: report.append(f'clear_lure wire {int(wire.sum())} px in {n - 1} comps, edge {int(ramp.sum())} px')
    a[..., :3] = np.clip(rgb, 0, 255).round().astype(np.uint8); a[..., 3] = np.clip(al_w * 255, 0, 255).round().astype(np.uint8)
    return a


def polish(im, holes=True, report=None, clear=False):
    a = np.array(im.convert('RGBA'))
    if clear:                      # translucent lure: only hook glow + silhouette feather
        return Image.fromarray(clear_lure(a, report), 'RGBA')
    if holes: a = hole_fix(a, report)
    a = defringe(a, report)
    return Image.fromarray(a, 'RGBA')


if __name__ == '__main__':
    rep = []
    polish(Image.open(sys.argv[1]), report=rep).save(sys.argv[2]); print(sys.argv[2], *rep, sep='\n  ')
