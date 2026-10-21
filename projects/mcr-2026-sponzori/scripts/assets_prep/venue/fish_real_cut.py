"""Real (not AI) trout for the venue 'donedávna' frame — clean cut-out from a Líheň Liběchov web photo.

Source : https://www.lihenlibechov.cz/uploads/images/651b0f8db1675072923966.jpg (1388x2048, JPEG, no EXIF)
         = image of the news post https://www.lihenlibechov.cz/cs/aktualita/novy-rybarsky-rad (angler holding a big
         pstruh obecný / brown trout side-on at a Liběchov pond, winter). Local copy: assets/libechov/web3/lib_orig_651b0f8db1675072923966.jpg
Method : hand-traced outline (body + fins, Catmull–Rom, checked on 2x overlays) snapped to the strongest Lab edge within
         ±10 px (median + Gaussian smoothed along the contour); inside the hand zones (fingers under head / belly, thumbs on
         the back) the traced outline is authoritative. Fingers that cover the fish are replaced by a column-wise copy of the
         fish's own neighbouring belly texture, aligned to the body edge, mild DC colour match, 10–14 px feather; under the jaw the
         outline follows the finger tops (smoothed, cut only); translucent fins: dark/green see-through lifted to the fin colour; Telea
         only for thin leftover rims. (GrabCut was tried first and leaked into reeds/jacket — dropped.)
         Edge colours decontaminated from 3 px inside. No upscaling, no generative model: pixels are the photo's own.
Out    : assets_prep/venue/ads/fish_real_brown_trout.png (native ~1180 px long, RGBA, trimmed)
         assets_prep/venue/ads/fish_real_brown_trout_shadow.png (soft contact shadow, same canvas)
         assets_prep/venue/ads/_fish_real_qa.jpg (source / mask / cut-out on dark + light + 2x detail of the retouched zones)
"""
import json
from pathlib import Path
import numpy as np, cv2
from PIL import Image

P = Path(__file__).resolve().parents[3]
SRC = P / 'assets/libechov/web3/lib_orig_651b0f8db1675072923966.jpg'
OUT = P / 'assets_prep/venue/ads'
img = cv2.imread(str(SRC))                         # BGR
H, W = img.shape[:2]

def cr(pts, n=10, closed=True):
    pts = np.asarray(pts, float); out = []
    m = len(pts)
    rng = range(m) if closed else range(m - 1)
    for i in rng:
        p0, p1, p2, p3 = pts[(i - 1) % m], pts[i], pts[(i + 1) % m], pts[(i + 2) % m]
        if not closed:
            p0 = pts[max(i - 1, 0)]; p3 = pts[min(i + 2, m - 1)]
        for t in np.linspace(0, 1, n, endpoint=False):
            t2, t3 = t * t, t * t * t
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3))
    return np.array(out)

BODY = [  # clockwise from the upper jaw tip (orig px); head re-traced on a 2x overlay
    (154, 1094), (162, 1083), (170, 1077), (190, 1070), (215, 1060), (240, 1050), (265, 1042), (290, 1034), (315, 1027),
    (340, 1022), (365, 1019), (390, 1016), (440, 1014), (490, 1013), (540, 1017), (590, 1022), (640, 1027), (700, 1031),
    (760, 1036), (800, 1044), (853, 1050), (887, 1055), (930, 1068), (960, 1081), (985, 1090), (1010, 1097),
    (1045, 1106), (1070, 1124), (1100, 1150), (1130, 1171), (1155, 1184), (1172, 1187), (1220, 1195), (1270, 1208),
    (1300, 1218), (1318, 1226), (1325, 1234), (1310, 1246), (1295, 1263), (1280, 1286), (1265, 1312), (1245, 1340),
    (1225, 1367), (1210, 1386), (1200, 1390), (1186, 1371), (1165, 1345), (1140, 1312), (1115, 1284), (1095, 1266),
    (1075, 1260), (1058, 1258), (995, 1247), (980, 1243), (950, 1245), (900, 1246), (850, 1245), (800, 1241), (780, 1246),
    (750, 1253), (720, 1257), (680, 1260), (630, 1263), (580, 1260), (530, 1248), (500, 1233), (465, 1212), (440, 1203),
    (410, 1200), (390, 1197), (365, 1195), (340, 1191), (315, 1187), (290, 1182), (265, 1175), (240, 1167), (215, 1157),
    (190, 1147), (170, 1140), (157, 1130), (152, 1122), (152, 1108),
]
FINS = {
    'dorsal':   [(646, 1030), (668, 1004), (690, 996), (712, 992), (742, 992), (772, 995), (810, 1000), (835, 1008), (848, 1020), (851, 1031), (820, 1031), (790, 1034), (760, 1037), (720, 1034)],
    'adipose':  [(1046, 1108), (1056, 1103), (1072, 1106), (1090, 1119), (1101, 1132), (1094, 1142), (1078, 1134), (1062, 1122)],
    'pectoral': [(402, 1205), (430, 1200), (456, 1215), (478, 1232), (496, 1263), (497, 1294), (488, 1293), (468, 1278), (448, 1261), (428, 1240), (410, 1221)],
    'pelvic':   [(724, 1255), (760, 1252), (797, 1255), (812, 1270), (823, 1300), (822, 1326), (812, 1322), (797, 1318), (780, 1306), (765, 1297), (748, 1282), (732, 1266)],
    'anal':     [(998, 1248), (1022, 1250), (1045, 1256), (1058, 1262), (1060, 1290), (1056, 1316), (1050, 1318), (1040, 1307), (1027, 1290), (1015, 1272), (1004, 1258)],
}
# zones where the traced outline is authoritative (hands): no edge snapping there
ZONES = [(245, 1170, 495, 1310), (790, 1183, 990, 1300), (870, 1030, 990, 1098), (325, 980, 395, 1024)]
def in_zone(x, y):
    return any(x0 <= x < x1 and y0 <= y < y1 for x0, y0, x1, y1 in ZONES)

# edge strength: Lab gradient magnitude (sigma 1.3)
lab = cv2.cvtColor(cv2.GaussianBlur(img, (0, 0), 1.3), cv2.COLOR_BGR2LAB).astype(np.float32)
E = np.zeros((H, W), np.float32)
for c in range(3):
    gx = cv2.Sobel(lab[..., c], cv2.CV_32F, 1, 0, ksize=3); gy = cv2.Sobel(lab[..., c], cv2.CV_32F, 0, 1, ksize=3)
    E += np.sqrt(gx * gx + gy * gy)

def bilinear(M, x, y):
    return cv2.remap(M, np.float32(x).reshape(-1, 1), np.float32(y).reshape(-1, 1), cv2.INTER_LINEAR).ravel()

def snap(pts, R, n=10):
    c = cr(pts, n)
    if R <= 0:
        return c, np.zeros(len(c))
    poly = np.round(c).astype(np.int32)
    nrm = np.roll(c, -1, 0) - np.roll(c, 1, 0); nrm = np.c_[nrm[:, 1], -nrm[:, 0]]
    nrm /= np.linalg.norm(nrm, axis=1, keepdims=True) + 1e-9
    # make normals point outward
    test = c + nrm * 3
    inside = np.array([cv2.pointPolygonTest(poly, (float(x), float(y)), False) > 0 for x, y in test])
    nrm[inside] *= -1
    ss = np.arange(-R, R + 0.01, 0.5)
    score = np.stack([bilinear(E, c[:, 0] + s_ * nrm[:, 0], c[:, 1] + s_ * nrm[:, 1]) * (1 - 0.025 * abs(s_)) for s_ in ss], 1)
    off = ss[score.argmax(1)]
    z = np.array([in_zone(x, y) for x, y in c])
    off[z] = 0
    # robust smoothing along the closed contour
    k = 7
    padded = np.r_[off[-k:], off, off[:k]]
    med = np.array([np.median(padded[i:i + 2 * k + 1]) for i in range(len(off))])
    g = cv2.GaussianBlur(np.r_[med[-20:], med, med[:20]].reshape(-1, 1).astype(np.float32), (1, 0), 4).ravel()[20:-20]
    g[z] = 0
    # taper into the zones
    zz = cv2.GaussianBlur(z.astype(np.float32).reshape(-1, 1), (1, 0), 5).ravel()
    g = g * (1 - np.clip(zz * 2, 0, 1))
    return c + nrm * g[:, None], g

def fill(c):
    m = np.zeros((H, W), np.uint8)
    cv2.fillPoly(m, [np.round(c * 8).astype(np.int32)], 255, lineType=cv2.LINE_AA, shift=3)
    return m

body_c, body_off = snap(BODY, 10)
body = fill(body_c)
FIN_R = {'dorsal': 6, 'adipose': 5, 'pectoral': 6, 'pelvic': 6, 'anal': 0}
fins = {}
for k_, v in FINS.items():
    fc, _ = snap(v, FIN_R[k_], 8)
    fins[k_] = fill(fc)
cov = body.astype(np.float32) / 255
for m_ in fins.values():
    cov = np.maximum(cov, m_.astype(np.float32) / 255)
m = (cov > 0.5).astype(np.uint8)
snap_stats = {'body_offset_px_mean_abs': round(float(np.abs(body_off).mean()), 2), 'body_offset_px_max_abs': round(float(np.abs(body_off).max()), 2)}

# --- remove fingers lying ON the fish: column-wise copy of neighbouring fish texture aligned to the body edge
b_, g_, r_ = [img[..., i].astype(int) for i in range(3)]
skin = ((r_ - g_ > 36) & (r_ - b_ > 40) & (r_ > 90)).astype(np.uint8)   # fingers R-G ≈ 45–70; cream throat/belly R-G ≤ 28
skin = cv2.dilate(cv2.morphologyEx(skin, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))),
                  cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11)))
bodyb = body > 127
pecb = fins['pectoral'] > 127
def edge_y(col, bottom=True):
    ys = np.nonzero(bodyb[:, col])[0]
    return (ys.max() if bottom else ys.min()) if len(ys) else None
work = img.copy()
fixed = np.zeros((H, W), bool)

def band_copy(x0, y0, x1, y1, dx, excl, feather_v=12, feather_h=12, dc_scale=0.5):
    """Replace the fish pixels covered by fingers in [x0,x1)x[y0,y1) with the fish's own texture dx px away,
    column-wise aligned to the belly edge; one continuous band under a smooth top curve; mild DC match."""
    global work
    sk = (skin[y0:y1, x0:x1] > 0) & bodyb[y0:y1, x0:x1] & ~excl[y0:y1, x0:x1]
    cols = np.nonzero(sk.any(0))[0]
    if not len(cols):
        return np.zeros((H, W), bool)
    xa, xb = x0 + cols.min() - 6, x0 + cols.max() + 7
    top = np.full(xb - xa, np.nan)
    for i, x in enumerate(range(xa, xb)):
        c_ = x - x0
        if 0 <= c_ < sk.shape[1] and sk[:, c_].any():
            top[i] = y0 + np.nonzero(sk[:, c_])[0].min()
    ii = np.arange(len(top)); ok = ~np.isnan(top)
    top = np.interp(ii, ii[ok], top[ok])
    top = np.array([top[max(0, i - 10):i + 11].min() for i in ii])
    top = cv2.GaussianBlur(top.reshape(1, -1).astype(np.float32), (0, 0), 5).ravel() - 4
    deltas = []
    for i, x in enumerate(range(xa, xb)):
        dy = edge_y(x + dx, True) - edge_y(x, True)
        ring = np.arange(int(top[i]) - 34, int(top[i]) - 20)
        deltas.append(work[ring, x].astype(np.float32).mean(0) - work[ring + dy, x + dx].astype(np.float32).mean(0))
    deltas = np.clip(cv2.GaussianBlur(np.array(deltas, np.float32).reshape(1, -1, 3), (0, 0), 14).reshape(-1, 3) * dc_scale, -12, 12)
    src = work.astype(np.float32).copy(); wgt = np.zeros((H, W), np.float32)
    for i, x in enumerate(range(xa, xb)):
        et = edge_y(x, True); dy = edge_y(x + dx, True) - et
        for y in range(int(np.floor(top[i])) - feather_v, et + 1):
            src[y, x] = work[min(max(y + dy, 0), H - 1), x + dx].astype(np.float32) + deltas[i]
            wgt[y, x] = np.clip((y - (top[i] - feather_v)) / feather_v, 0, 1) * np.clip(min(x - xa, xb - 1 - x) / feather_h, 0, 1)
    wgt *= bodyb & ~excl
    w3 = wgt[..., None]
    work = (work.astype(np.float32) * (1 - w3) + src * w3).clip(0, 255).astype(np.uint8)
    return wgt > 0.02

# (1) belly under the right hand ← belly 262 px to the left; (1b) finger behind the gill ← belly 85 px to the right
fixed |= band_copy(795, 1183, 990, 1256, -262, pecb)          # source x 533–728: plain belly, in front of the pelvic fin base
fixed |= band_copy(400, 1165, 500, 1240, 85, pecb, feather_v=10, feather_h=14)

# (1c) fingertips under the jaw/throat (x 245–425): the fingers only clip the lower rim, so the outline follows the
#      finger tops there (smoothed) instead of inventing throat texture
xs_ = np.arange(245, 412)
bot = np.array([edge_y(x, True) for x in xs_], float)
for i, x in enumerate(xs_):
    col = np.nonzero((skin[1150:1260, x] > 0) & bodyb[1150:1260, x])[0]
    if len(col):
        bot[i] = min(bot[i], 1150 + col.min() - 2)
bot = np.array([bot[max(0, i - 6):i + 7].min() for i in range(len(bot))])
bot = cv2.GaussianBlur(bot.reshape(1, -1).astype(np.float32), (0, 0), 3).ravel()
for i, x in enumerate(xs_):
    yb = int(np.floor(bot[i]))
    keep = pecb[:, x].copy()
    m[yb + 1:1300, x] = keep[yb + 1:1300].astype(np.uint8)
    bodyb[yb + 1:1300, x] = False

# (1d) one smooth underside from the jaw to the pectoral base (only ever cuts, never adds pixels)
xs2 = np.arange(245, 480)
ob = np.array([edge_y(x, True) for x in xs2], float)
sb = np.array([ob[max(0, i - 8):i + 9].min() for i in range(len(ob))])
sb = cv2.GaussianBlur(sb.reshape(1, -1).astype(np.float32), (0, 0), 6).ravel()
sb = np.minimum(sb, ob)
for i, x in enumerate(xs2):
    yb = int(np.floor(sb[i]))
    if yb < ob[i]:
        m[yb + 1:int(ob[i]) + 1, x] = pecb[yb + 1:int(ob[i]) + 1, x].astype(np.uint8)
        bodyb[yb + 1:int(ob[i]) + 1, x] = False

# (2) everything else (finger behind the gill, fingertips on the jaw underside, both thumbs on the back/head):
#     Telea on an image whose outside-the-fish pixels are replaced by the nearest fish pixel (no jacket/skin bleeding in)
zm = np.zeros((H, W), bool)
for zx0, zy0, zx1, zy1 in ZONES:
    zm[zy0:zy1, zx0:zx1] = True
hole = (skin > 0) & bodyb & zm & ~fixed & ~pecb
inside = bodyb & ~hole & ~((skin > 0) & zm)
d_, lab_ = cv2.distanceTransformWithLabels((~inside).astype(np.uint8), cv2.DIST_L2, 5, labelType=cv2.DIST_LABEL_PIXEL)
yy, xx = np.nonzero(inside)
lut = np.zeros((lab_.max() + 1, 3), np.uint8); lut[lab_[yy, xx]] = work[yy, xx]
ext = work.copy(); outside = ~inside
ext[outside] = lut[lab_[outside]]
if hole.any():
    ext = cv2.inpaint(ext, hole.astype(np.uint8) * 255, 7, cv2.INPAINT_TELEA)
    work[hole] = ext[hole]
rest = hole
fix = fixed | rest
gc_change = snap_stats

# --- alpha: 1.2 px anti-aliased edge; decontaminate the edge colours from 3 px inside
alpha = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 0.9)
alpha = np.clip((alpha - 0.5) * 1.6 + 0.5, 0, 1)
alpha[m == 0] *= (alpha[m == 0] > 0.25)
er = cv2.erode(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
dist, idx = cv2.distanceTransformWithLabels((1 - er).astype(np.uint8), cv2.DIST_L2, 5, labelType=cv2.DIST_LABEL_PIXEL)
ys, xs = np.nonzero(er)
lut = np.zeros((idx.max() + 1, 3), np.uint8)
lut[idx[ys, xs]] = work[ys, xs]
edge = (m > 0) & (er == 0) | ((alpha > 0) & (m == 0))
work2 = work.copy()
work2[edge] = (0.45 * work[edge] + 0.55 * lut[idx[edge]]).astype(np.uint8)
# fins are translucent over a dark jacket / pink fingers: lift the pectoral fin's pink cast a little
pec = fins['pectoral'] > 127
hsv = cv2.cvtColor(work2, cv2.COLOR_BGR2HSV).astype(np.float32)
pink = pec & (((hsv[..., 0] < 14) | (hsv[..., 0] > 160)) & (hsv[..., 1] > 35))
pinkf = cv2.GaussianBlur(pink.astype(np.float32), (0, 0), 2.0) * pec
ref = pec & ~cv2.dilate(pink.astype(np.uint8), np.ones((9, 9), np.uint8)).astype(bool)
h_ref, s_ref = np.median(hsv[ref, 0]), np.median(hsv[ref, 1])
hsv[..., 0] = hsv[..., 0] * (1 - pinkf) + h_ref * pinkf
hsv[..., 1] = hsv[..., 1] * (1 - pinkf) + s_ref * pinkf
work2 = cv2.cvtColor(hsv.clip(0, 255).astype(np.uint8), cv2.COLOR_HSV2BGR)
# anal fin is translucent over the reeds: damp the reed strokes seen through it
af = ((fins['anal'] > 127) & (m > 0)).astype(np.float32)
afm = af > 0
af = cv2.erode(af, np.ones((3, 3), np.uint8)) * 0.8
blur = cv2.GaussianBlur(work2, (0, 0), 3.0).astype(np.float32)
work2 = (work2.astype(np.float32) * (1 - af[..., None]) + blur * af[..., None]).clip(0, 255).astype(np.uint8)
hsv = cv2.cvtColor(work2, cv2.COLOR_BGR2HSV).astype(np.float32)
fin_ref = (fins['pelvic'] > 127) & (m > 0)
green = afm & (hsv[..., 0] > 28) & (hsv[..., 0] < 95)
gf = cv2.GaussianBlur(green.astype(np.float32), (0, 0), 1.5) * afm
hsv[..., 0] = hsv[..., 0] * (1 - gf) + np.median(hsv[fin_ref, 0]) * gf
hsv[..., 1] = hsv[..., 1] * (1 - gf) + np.median(hsv[fin_ref, 1]) * gf
work2 = cv2.cvtColor(hsv.clip(0, 255).astype(np.uint8), cv2.COLOR_HSV2BGR)
# translucent fins over the dark jacket read as black notches: lift dark fin pixels toward the fin's own median colour
for k_ in ('pectoral', 'pelvic', 'anal', 'dorsal'):
    fm = (fins[k_] > 127) & (m > 0)
    if not fm.any():
        continue
    hv = cv2.cvtColor(work2, cv2.COLOR_BGR2HSV)[..., 2].astype(np.float32)
    medv = np.median(hv[fm]); medc = np.median(work2[fm].reshape(-1, 3), 0).astype(np.float32)
    lift = np.clip(1 - hv / (0.62 * medv), 0, 1) * 0.85 * fm
    lift = cv2.GaussianBlur(lift.astype(np.float32), (0, 0), 1.2) * fm
    detail = work2.astype(np.float32) - cv2.GaussianBlur(work2, (0, 0), 3).astype(np.float32)
    work2 = (work2.astype(np.float32) * (1 - lift[..., None]) + (medc + detail * 0.6) * lift[..., None]).clip(0, 255).astype(np.uint8)
rgba = np.dstack([cv2.cvtColor(work2, cv2.COLOR_BGR2RGB), (alpha * 255).astype(np.uint8)])
ys, xs = np.nonzero(alpha > 0)
pad = 6
x0, x1, y0, y1 = xs.min() - pad, xs.max() + pad + 1, ys.min() - pad, ys.max() + pad + 1
cut = rgba[y0:y1, x0:x1]
Image.fromarray(cut).save(OUT / 'fish_real_brown_trout.png', optimize=True)
# soft shadow (same canvas, ground-less glow under the fish for dark fields)
sh = cv2.GaussianBlur((alpha[y0:y1, x0:x1] * 255).astype(np.uint8), (0, 0), 14)
sh = np.roll(sh, 18, axis=0)
Image.fromarray(np.dstack([np.zeros_like(sh)] * 3 + [(sh * 0.55).astype(np.uint8)])).save(OUT / 'fish_real_brown_trout_shadow.png', optimize=True)

# --- QA sheet
def on(bgc, a=cut):
    bg = Image.new('RGBA', (a.shape[1], a.shape[0]), bgc); bg.alpha_composite(Image.fromarray(a)); return bg.convert('RGB')
src_crop = Image.fromarray(cv2.cvtColor(img[y0:y1, x0:x1], cv2.COLOR_BGR2RGB))
mk = Image.fromarray((alpha[y0:y1, x0:x1] * 255).astype(np.uint8)).convert('RGB')
tiles = [src_crop, mk, on((26, 33, 46, 255)), on((23, 161, 200, 255)), on((248, 248, 248, 255))]
Wt = cut.shape[1]; Ht = cut.shape[0]
sheet = Image.new('RGB', (Wt, Ht * len(tiles)), (90, 90, 90))
for i, t in enumerate(tiles):
    sheet.paste(t, (0, i * Ht))
# 2x details of the retouched zones (before | after on dark)
det = []
for (zx0, zy0, zx1, zy1) in [(240, 1150, 520, 1310), (780, 1150, 1000, 1310), (860, 1020, 1000, 1110)]:
    a_ = cv2.cvtColor(img[zy0:zy1, zx0:zx1], cv2.COLOR_BGR2RGB)
    bb = Image.fromarray(rgba[zy0:zy1, zx0:zx1]); bg = Image.new('RGBA', bb.size, (26, 33, 46, 255)); bg.alpha_composite(bb)
    pair = Image.new('RGB', ((zx1 - zx0) * 2, zy1 - zy0)); pair.paste(Image.fromarray(a_), (0, 0)); pair.paste(bg.convert('RGB'), (zx1 - zx0, 0))
    det.append(pair.resize((pair.width * 2, pair.height * 2), Image.LANCZOS))
dh = sum(d.height for d in det); dw = max(d.width for d in det)
full = Image.new('RGB', (max(Wt, dw), sheet.height + dh), (60, 60, 60)); full.paste(sheet, (0, 0)); yy = sheet.height
for d in det:
    full.paste(d, (0, yy)); yy += d.height
full.save(OUT / '_fish_real_qa.jpg', quality=88)

meta = {
    'fish_real_brown_trout.png': {
        'size': [int(cut.shape[1]), int(cut.shape[0])], 'species': 'pstruh obecný (brown trout, Salmo trutta)',
        'source_url': 'https://www.lihenlibechov.cz/uploads/images/651b0f8db1675072923966.jpg',
        'source_page': 'https://www.lihenlibechov.cz/cs/aktualita/novy-rybarsky-rad',
        'source_size': [W, H], 'crop_box_in_source': [int(x0), int(y0), int(x1), int(y1)],
        'processing': 'hand-traced outline snapped to the photo edge (Lab gradient, ±10 px, smoothed); fingers on the belly/back replaced by a '
                      'column-wise copy of the fish’s own neighbouring belly/back texture (aligned to the body edge, mild DC colour match, 10–14 px feather) + Telea on thin rims; no upscale, no generative fill. The far pectoral fin (hidden behind the left hand) is left out.',
        'edge_snap': gc_change, 'fingers_retouched_px': int(fix.sum()),
        'pose': 'side-on, straight, head left, belly down; snout at x≈%d, tail tip at x≈%d (canvas px)' % (152 - x0, 1325 - x0),
        'use': 'native 1:1 or smaller (max 1.3x per BLOCK_API); never through an AI upscaler',
    }
}
mp = OUT / '_meta.json'
allm = json.load(open(mp))
item = {'role': 'hero', 'key': 'H2r', 'what': 'REAL brown trout (pstruh obecný), straight side-on, from the Líheň Liběchov web — replaces the AI-upscaled, bent h2_trout_potocak in the "donedávna" frame',
        'file': 'venue/ads/fish_real_brown_trout.png', 'companions': {'shadow': 'venue/ads/fish_real_brown_trout_shadow.png', 'qa': 'venue/ads/_fish_real_qa.jpg'},
        **meta['fish_real_brown_trout.png']}
allm['items'] = [it for it in allm['items'] if it.get('key') != 'H2r'] + [item]
json.dump(allm, open(mp, 'w'), indent=1, ensure_ascii=False)
print(json.dumps(meta, indent=1, ensure_ascii=False))
