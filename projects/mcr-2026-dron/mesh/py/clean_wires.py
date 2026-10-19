"""v2 fix: remove the overhead power-line wires baked into the 0.125 m CUZK ortho (orto_core_6400.jpg).

Defect (operator, v1): "одна полоса криво идёт через дорожку". The overhead power line crosses the core NW->SE (meadow
west of the gravel path -> the path -> the bank between Maly Sportacek and the rearing ponds -> the forest).
Its 3-4 conductors are imaged as thin bright lines. The ortho mosaic seamline runs along the gravel path and
the two source photos lean the (elevated) wires differently, so the wire bundle jumps ~3 m sideways exactly at
the path -> in the flyover it reads as a crooked stripe crossing the path. The DSM is clean there (nDSM ~0).

Method, per straight span (pylon to pylon), in a rotated strip where the span is horizontal:
  1. thin-bright-line ridge response (2-3 px side offsets), averaged 31 px along the span;
  2. block profiles (64 px, step 32) -> sub-pixel peaks -> linked block to block (|dv| <= 3 px) into chains;
     a wire = chain >= 10 blocks (~40 m), locally straight, median strength > 0.008 (texture never qualifies);
     each wire is then extended along its linear prediction through low-contrast stretches (bushes, the
     seam at the path) with looser peaks (<= 10 blocks, <= 3 misses in a row);
  3. per column: every ridge maximum within +-5 px of a chain centre -> mask +-2 px (wire core + JPEG halo);
  4. fill: Telea inpaint (low frequencies) + high-pass grain transplanted from 7 px beside the wire
     (perpendicular), so the filled pixels keep the surrounding grass / gravel / canopy texture;
  5. repeat on the result (weaker wires hidden next to stronger ones) until no chain is found (max 3 passes).
Pixels outside the mask are bit-identical to the source JPEG decode. Output: lossless PNG + mask + report.
Usage: python3 clean_wires.py [--debug DIR]
"""
import numpy as np, cv2, json, sys, os, time
D = '/home/user/Clipcreator/projects/mcr-2026-dron/data/'
SRC = D + 'orto_core_6400.jpg'
OUT = D + 'orto_core_6400_nowires.png'
OUTMASK = D + 'orto_core_6400_wiremask.png'
DBG = sys.argv[sys.argv.index('--debug') + 1] if '--debug' in sys.argv else None

# Spans in ortho pixel coords (6400 px = 800 m, 0.125 m/px, row 0 = north). Pylons located on the ortho:
# P1 (west, UTM ~461254/5584829) and P4 (south-east, ~461820/5584532); the main span is straight between them,
# the line turns at both pylons.
A_MAIN = np.deg2rad(27.57)
_d, _n = np.array([np.cos(A_MAIN), np.sin(A_MAIN)]), np.array([-np.sin(A_MAIN), np.cos(A_MAIN)])
P0_MAIN = np.array([0.0, 3360.0 - 840.0 * np.tan(A_MAIN)])
P1 = P0_MAIN + 940 * _d + 10 * _n
P4 = P0_MAIN + 6054 * _d + 20 * _n
SPANS = [
    dict(name='main_P1_P4', p0=P1, ang=27.57, u0=-60, u1=float(np.linalg.norm(P4 - P1)) + 60, hh=120),
    dict(name='west_from_P1', p0=P1, ang=169.6, u0=-40, u1=900, hh=90),
    dict(name='sse_from_P4', p0=P4, ang=69.9, u0=-40, u1=760, hh=90),
]

def ridge_resp(L):
    r = np.zeros_like(L)
    for o in (2, 3):
        up = np.roll(L, o, axis=0); dn = np.roll(L, -o, axis=0)
        r = np.maximum(r, np.minimum(L - up, L - dn))
    r = np.maximum(r, 0)
    r[:4] = 0; r[-4:] = 0
    return cv2.blur(r, (31, 1))

def strip_geom(sp):
    a = np.deg2rad(sp['ang']); d = np.array([np.cos(a), np.sin(a)]); n = np.array([-d[1], d[0]])
    org = sp['p0'] + sp['u0'] * d - sp['hh'] * n
    M = np.array([[d[0], n[0], org[0]], [d[1], n[1], org[1]]], np.float64)        # strip (u,v) -> image (x,y)
    return M, cv2.invertAffineTransform(M), d, n, int(np.ceil(sp['u1'] - sp['u0'])), 2 * sp['hh'] + 1

def find_wires(Lfull, sp):
    M, Minv, d, n, W, H = strip_geom(sp)
    Ls = cv2.warpAffine(Lfull, Minv, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=-1)
    valid = Ls >= 0
    Ls = np.where(valid, Ls, 0).astype(np.float32)
    ra = ridge_resp(Ls)
    ra[~cv2.erode(valid.astype(np.uint8), np.ones((9, 41), np.uint8)).astype(bool)] = 0
    BW, BS = 64, 32
    starts = list(range(0, max(1, W - BW + 1), BS))
    peaks, loose = [], []
    for bs in starts:
        prof = ra[:, bs:bs + BW].mean(axis=1)
        bg = float(np.median(prof[8:-8]))
        thr, thl = max(0.006, 2.2 * bg), max(0.004, 1.5 * bg)
        pk, pl = [], []
        for i in range(2, H - 2):
            if prof[i] > thl and prof[i] > prof[i - 1] and prof[i] >= prof[i + 1]:
                den = prof[i - 1] - 2 * prof[i] + prof[i + 1]
                off = 0.5 * (prof[i - 1] - prof[i + 1]) / den if den < 0 else 0.0
                pl.append((i + off, float(prof[i])))
                if prof[i] > thr: pk.append((i + off, float(prof[i])))
        peaks.append(pk); loose.append(pl)
    chains, active = [], []
    for bi, pk in enumerate(peaks):
        used, nxt = set(), []
        for ch in active:
            lv = ch[-1][1] + ((ch[-1][1] - ch[-2][1]) if len(ch) >= 2 else 0.0)
            best = None
            for k, (v, st) in enumerate(pk):
                if k in used or abs(v - lv) > 3.0: continue
                if best is None or abs(v - lv) < abs(pk[best][0] - lv): best = k
            if best is None: chains.append(ch)
            else: used.add(best); ch.append((bi, pk[best][0], pk[best][1])); nxt.append(ch)
        for k, (v, st) in enumerate(pk):
            if k not in used: nxt.append([(bi, v, st)])
        active = nxt
    chains += active

    def straight(ch):
        b = np.array([c[0] for c in ch], float); v = np.array([c[1] for c in ch])
        A = np.vstack([b, np.ones_like(b)]).T; co, *_ = np.linalg.lstsq(A, v, rcond=None)
        if np.abs(v - A @ co).max() < 6.0 and abs(co[0]) < 3.0: return True
        sm = np.convolve(np.pad(v, 4, mode='edge'), np.ones(9) / 9, mode='valid')
        return np.abs(v - sm).max() < 3.5 and np.abs(np.diff(sm)).max() < 2.0
    wires = [ch for ch in chains if len(ch) >= 10 and straight(ch) and np.median([c[2] for c in ch]) > 0.008]

    def extend(ch, step):
        # follow the wire past where the strict linking stopped (bushes, low contrast, mosaic seam):
        # loose peaks within 3 px of the linear prediction, up to 3 missed blocks in a row
        ch = list(ch) if step > 0 else list(reversed(ch))
        miss, bi, added = 0, ch[-1][0], 0
        smin = 0.4 * float(np.median([c[2] for c in ch]))
        while miss < 3 and added < 10:
            bi += step
            if bi < 0 or bi >= len(starts): break
            tail = ch[-6:]
            bb = np.array([c[0] for c in tail], float); vv_ = np.array([c[1] for c in tail])
            sl = np.polyfit(bb, vv_, 1)[0] if len(tail) >= 3 else 0.0
            pred = ch[-1][1] + sl * (bi - ch[-1][0])
            cand = [(abs(v - pred), v, st) for v, st in loose[bi] if abs(v - pred) <= 3.0 and st >= smin]
            if cand:
                _, v, st = min(cand); ch.append((bi, v, st)); miss = 0; added += 1
            else:
                miss += 1
        return ch if step > 0 else list(reversed(ch))
    wires = [extend(extend(ch, +1), -1) for ch in wires]

    m = np.zeros((H, W), bool)
    for ch in wires:
        b = np.array([c[0] for c in ch]); v = np.array([c[1] for c in ch])
        v = np.convolve(np.pad(v, 2, mode='edge'), np.ones(5) / 5, mode='valid')
        uc = np.array([starts[i] + BW / 2 for i in b], float)
        str_med = float(np.median([c[2] for c in ch]))
        ua, ub = int(max(0, uc[0] - BW / 2 - 8)), int(min(W, uc[-1] + BW / 2 + 8))
        for uu in range(ua, ub):
            c = float(np.interp(uu, uc, v))
            lo, hi = max(2, int(np.floor(c - 5))), min(H - 2, int(np.ceil(c + 5)) + 1)
            col = ra[lo - 1:hi + 1, uu]
            for i in range(1, len(col) - 1):
                if col[i] >= col[i - 1] and col[i] >= col[i + 1] and col[i] > max(0.005, 0.35 * str_med):
                    vv = lo - 1 + i
                    m[max(0, vv - 2):vv + 3, uu] = True
            ci = int(round(c))
            if ra[max(0, ci - 1):ci + 2, uu].max() > 0.003: m[max(0, ci - 1):ci + 2, uu] = True   # the chain centre itself
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8)).astype(bool)
    info = dict(name=sp['name'], n_wires=len(wires), mask_px=int(m.sum()),
                wires=[dict(u=[int(starts[ch[0][0]]), int(starts[ch[-1][0]] + BW)], v=[round(float(ch[0][1]), 1), round(float(ch[-1][1]), 1)],
                            strength=round(float(np.median([c[2] for c in ch])), 4)) for ch in wires])
    return dict(M=M, Minv=Minv, n=n, m=m, info=info, ra=ra, Ls=Ls)

def strip_mask_to_image(r, shape, mask_img, shift_img):
    M, Minv, n, m = r['M'], r['Minv'], r['n'], r['m']
    H, W = m.shape; Hi, Wi = shape
    cs = np.array([[0, 0], [W, 0], [0, H], [W, H]], float)
    ps = (M[:, :2] @ cs.T + M[:, 2:3]).T
    x0, y0 = np.maximum(np.floor(ps.min(axis=0)).astype(int) - 2, 0)
    x1, y1 = np.ceil(ps.max(axis=0)).astype(int) + 2; x1, y1 = min(x1, Wi), min(y1, Hi)
    ys, xs = np.mgrid[y0:y1, x0:x1].astype(np.float32)
    ui = np.rint(Minv[0, 0] * xs + Minv[0, 1] * ys + Minv[0, 2]).astype(int)
    vi = np.rint(Minv[1, 0] * xs + Minv[1, 1] * ys + Minv[1, 2]).astype(int)
    ins = (ui >= 0) & (ui < W) & (vi >= 0) & (vi < H)
    mm = np.zeros(ui.shape, bool); mm[ins] = m[vi[ins], ui[ins]]
    sub = mask_img[y0:y1, x0:x1]; sub[mm] = 255
    sh = shift_img[y0:y1, x0:x1]; sh[mm] = n.astype(np.float32)

def fill(img, mask, nvec, k=7):
    """Telea inpaint for the low frequencies + high-pass grain copied from k px beside the wire."""
    low = cv2.inpaint(img, mask, 4, cv2.INPAINT_TELEA).astype(np.float32)
    f = img.astype(np.float32)
    hp = f - cv2.GaussianBlur(f, (0, 0), 1.6)
    ys, xs = np.nonzero(mask)
    Hi, Wi = mask.shape
    out = low.copy()
    nx, ny = nvec[ys, xs, 0], nvec[ys, xs, 1]
    best = np.zeros((len(ys), 2), np.float32); done = np.zeros(len(ys), bool)
    for kk in (k, -k, 2 * k, -2 * k, 3 * k):
        sx = np.clip(xs + kk * nx, 0, Wi - 1); sy = np.clip(ys + kk * ny, 0, Hi - 1)
        ok = (mask[np.rint(sy).astype(int), np.rint(sx).astype(int)] == 0) & ~done
        best[ok, 0] = sx[ok]; best[ok, 1] = sy[ok]; done |= ok
    best[~done, 0] = xs[~done]; best[~done, 1] = ys[~done]
    # bilinear sample of the high-pass at the source points
    x0 = np.floor(best[:, 0]).astype(int); y0 = np.floor(best[:, 1]).astype(int)
    x1 = np.minimum(x0 + 1, Wi - 1); y1 = np.minimum(y0 + 1, Hi - 1)
    fx = (best[:, 0] - x0)[:, None]; fy = (best[:, 1] - y0)[:, None]
    g = (hp[y0, x0] * (1 - fx) * (1 - fy) + hp[y0, x1] * fx * (1 - fy) + hp[y1, x0] * (1 - fx) * fy + hp[y1, x1] * fx * fy)
    g[~done] = 0
    out[ys, xs] = low[ys, xs] + g
    return np.clip(out + 0.5, 0, 255).astype(np.uint8)

def main():
    t0 = time.time()
    src = cv2.imread(SRC, cv2.IMREAD_COLOR)
    cur = src.copy()
    Hi, Wi = src.shape[:2]
    total = np.zeros((Hi, Wi), np.uint8)
    passes = []
    for it in range(3):
        L = cv2.cvtColor(cur, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255
        mask = np.zeros((Hi, Wi), np.uint8); nvec = np.zeros((Hi, Wi, 2), np.float32)
        infos = []
        for sp in SPANS:
            r = find_wires(L, sp)
            infos.append(r['info'])
            if r['info']['n_wires']:
                strip_mask_to_image(r, (Hi, Wi), mask, nvec)
            if DBG and it == 0:
                os.makedirs(DBG, exist_ok=True)
                cv2.imwrite(f"{DBG}/ra_{sp['name']}.png", np.clip(r['ra'] / 0.04 * 255, 0, 255).astype(np.uint8))
                cv2.imwrite(f"{DBG}/m_{sp['name']}.png", (r['m'] * 255).astype(np.uint8))
        passes.append(dict(pass_=it + 1, spans=infos, mask_px=int((mask > 0).sum())))
        print('pass', it + 1, [(i['name'], i['n_wires'], i['mask_px']) for i in infos], flush=True)
        if not mask.any(): break
        cur = fill(cur, mask, nvec)
        total |= mask
    changed = np.any(cur != src, axis=2)
    assert not (changed & (total == 0)).any(), 'pixels outside the wire mask changed'
    cv2.imwrite(OUT, cur, [cv2.IMWRITE_PNG_COMPRESSION, 6])
    cv2.imwrite(OUTMASK, total)
    rep = dict(src=SRC, out=OUT, mask=OUTMASK, passes=passes, mask_px=int((total > 0).sum()), changed_px=int(changed.sum()),
               changed_frac=float(changed.mean()), sec=round(time.time() - t0, 1))
    json.dump(rep, open(D + 'orto_core_6400_nowires.json', 'w'), indent=1)
    print(json.dumps({k: v for k, v in rep.items() if k != 'passes'}, indent=1))

if __name__ == '__main__':
    main()
