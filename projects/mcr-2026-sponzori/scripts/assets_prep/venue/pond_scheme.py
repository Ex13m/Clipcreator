"""Malý Sporťáček (MČR 2026 venue) — motion-graphics pond scheme from the drone water labels.

Input  : ../mcr-2026-dron/data/water_labels.png (6400x6400, 0.125 m/px, EPSG:32633, north-up; label 2 = Malý Sporťáček,
         see ../mcr-2026-dron/data/manifest.json -> ponds.maly_sportacek_small_HERO), orto_core_6400.jpg for the QA overlay,
         manifest.json flight_paths.arrow_full.end (drone end camera, for the match-cut frame).
Output : data/pond_scheme.json            outline (real + clean), dims, places 1–40, frames, sources
         data/pond_scheme_preview_9x16.png  white+red on transparent, drone-matched portrait frame (1080x1920)
         data/pond_scheme_preview_northup.png  white+red on transparent, north-up (1080x1080)
         data/pond_scheme_qa_ortho.jpg     scheme over the ČÚZK orthophoto (north-up) for verification
         assets_prep/venue/scheme/pond_scheme_{portrait,northup}.svg  same as the previews (vector, metres)
Run    : python3 -I scripts/assets_prep/venue/pond_scheme.py
"""
import json, math, os, subprocess, glob
from pathlib import Path
import numpy as np, cv2
from PIL import Image
from shapely.geometry import Polygon, LineString, Point

Image.MAX_IMAGE_PIXELS = None
P = Path(__file__).resolve().parents[3]                    # projects/mcr-2026-sponzori
DR = P.parent / 'mcr-2026-dron/data'
OUT_D = P / 'data'
OUT_S = P / 'assets_prep/venue/scheme'
OUT_S.mkdir(parents=True, exist_ok=True)

RES, X0, Y1 = 0.125, 461150.0, 5585250.0                    # water_labels.pgw (PixelIsArea, outer edge)
LABEL = 2
man = json.load(open(DR / 'manifest.json'))
pond = man['ponds']['maly_sportacek_small_HERO']
assert pond['label'] == LABEL
lab = np.array(Image.open(DR / 'water_labels.png'))
mask = (lab == LABEL).astype(np.uint8)
area_px = float(mask.sum()) * RES * RES

def px2utm(c):            # contour pixel corner coords (x=col, y=row) -> UTM of the pixel edge
    c = np.asarray(c, float)
    return np.c_[X0 + c[:, 0] * RES, Y1 - c[:, 1] * RES]

# centroid (pixel centres)
ys, xs = np.nonzero(mask)
E0 = X0 + (xs.mean() + 0.5) * RES
N0 = Y1 - (ys.mean() + 0.5) * RES
def utm2loc(u):           # local metres, x = east, y = south (SVG y-down), north-up
    u = np.asarray(u, float)
    return np.c_[u[:, 0] - E0, N0 - u[:, 1]]

def contour(m):
    m2 = np.pad(m, 1)
    cs, _ = cv2.findContours(m2 * 255, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    c = max(cs, key=cv2.contourArea).reshape(-1, 2).astype(float) - 1
    # contour runs through pixel centres -> shift +0.5 so it sits on the pixel-centre grid in UTM edge coordinates
    return c + 0.5

# --- real outline: raw contour, Douglas–Peucker 0.25 m
raw = contour(mask)
raw_loc = utm2loc(px2utm(raw))
real = Polygon(raw_loc).simplify(0.25, preserve_topology=True)
# --- clean outline: morphological close with a 2.5 m disk (fills the ~1 m inflow notch) + open with a 1.0 m disk, DP 0.35 m
kc = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (41, 41))
ko = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (17, 17))
mc = cv2.morphologyEx(cv2.morphologyEx(np.pad(mask, 40), cv2.MORPH_CLOSE, kc), cv2.MORPH_OPEN, ko)[40:-40, 40:-40]
clean = Polygon(utm2loc(px2utm(contour(mc)))).simplify(0.35, preserve_topology=True)

def ring(poly):
    c = np.array(poly.exterior.coords)[:-1]
    # orient clockwise on screen (y down) = clockwise from above, start at the northernmost point
    if Polygon(c).exterior.is_ccw:     # shapely ccw in a y-up frame == clockwise on a y-down screen
        pass
    i0 = int(np.argmin(c[:, 1]))
    return np.roll(c, -i0, axis=0)

real_pts, clean_pts = ring(real), ring(clean)

# --- dimensions
cov = np.cov(np.c_[xs * RES, -ys * RES].T)          # east, north
ev, evec = np.linalg.eigh(cov)
major = evec[:, 1]                                   # (e, n)
axis_brg = math.degrees(math.atan2(major[0], major[1])) % 180      # 0..180
eq_L, eq_W = math.sqrt(12 * ev[1]), math.sqrt(12 * ev[0])           # equivalent rectangle (same 2nd moments)
cpx = contour(mask).astype(np.float32)
(rcx, rcy), (rw, rh), rang = cv2.minAreaRect(cpx)
mar_L, mar_W = max(rw, rh) * RES, min(rw, rh) * RES

def chord(poly, brg, through=(0.0, 0.0)):
    v = np.array([math.sin(math.radians(brg)), -math.cos(math.radians(brg))])
    a = np.array(through) - v * 200; b = np.array(through) + v * 200
    seg = poly.intersection(LineString([a, b]))
    return seg.length
ch_L = chord(clean, axis_brg)
ch_W = chord(clean, axis_brg + 90)

# --- 4 corners (DP on the clean ring until 4 vertices) -> sides
cc = np.array(clean.exterior.coords)[:-1].astype(np.float32)
quad = None
for eps in np.arange(2.0, 12.0, 0.25):
    q = cv2.approxPolyDP(cc.reshape(-1, 1, 2), eps, True).reshape(-1, 2)
    if len(q) == 4:
        quad = q.astype(float); break
assert quad is not None
sides = []
for i in range(4):
    p, q = quad[i], quad[(i + 1) % 4]
    d = q - p
    brg = math.degrees(math.atan2(d[0], -d[1])) % 360
    sides.append({'i': i, 'a': p, 'b': q, 'len': float(np.hypot(*d)), 'brg': brg,
                  'mid': (p + q) / 2})
def facing(s):            # compass name of the bank (outward normal)
    mid = s['mid']; brg = math.degrees(math.atan2(mid[0], -mid[1])) % 360
    return ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][int((brg + 22.5) // 45) % 8], brg
for s in sides:
    s['bank'], s['out_brg'] = facing(s)
long2 = sorted(sides, key=lambda s: -s['len'])[:2]
def angdiff(a, b):
    d = abs((a - b) % 180); return min(d, 180 - d)
# long sides must be the two roughly parallel to the major axis
long2 = sorted([s for s in sides if angdiff(s['brg'], axis_brg) < 30], key=lambda s: -s['len'])[:2]
assert len(long2) == 2, sides
short2 = [s for s in sides if s not in long2]

# --- drone-matched portrait frame: long axis vertical, SW end up (the v2 flyover ends looking SSW, yaw 202.6°)
end = man['flight_paths']['arrow_full']['end']
sw_brg = axis_brg + 180 if axis_brg < 90 else axis_brg      # the axis direction pointing SW-ish
ROT = (-sw_brg) % 360                                       # clockwise screen rotation that brings SW-axis to "up"
def rot(pts, th=ROT):
    t = math.radians(th); c, s = math.cos(t), math.sin(t)
    pts = np.asarray(pts, float)
    return np.c_[pts[:, 0] * c - pts[:, 1] * s, pts[:, 0] * s + pts[:, 1] * c]

# --- places: 20 per long side, evenly along the straight corner-to-corner line, projected onto the bank 1.5 m from the water edge
BANK_OFF, TRIM = 1.5, 2.0
bank = clean.buffer(BANK_OFF, join_style=1)
def side_places(s):
    a, b = s['a'], s['b']
    d = (b - a) / np.hypot(*(b - a))
    n_out = np.array([d[1], -d[0]])               # candidate normal
    if np.dot(n_out, s['mid']) < 0:               # must point away from the pond centre
        n_out = -n_out
    L = s['len'] - 2 * TRIM
    pts = []
    for k in range(20):
        t = TRIM + (k + 0.5) * L / 20
        p = a + d * t
        ray = LineString([p - n_out * 30, p + n_out * 30])
        hit = bank.exterior.intersection(ray)
        cand = [np.array(g.coords[0]) for g in getattr(hit, 'geoms', [hit])]
        q = min(cand, key=lambda c: np.dot(c - p, c - p))
        w = clean.exterior.intersection(LineString([p - n_out * 30, p + n_out * 30]))
        wc = [np.array(g.coords[0]) for g in getattr(w, 'geoms', [w])]
        e = min(wc, key=lambda c: np.dot(c - p, c - p))
        pts.append({'xy': q, 'edge': e, 'n_out': n_out})
    return pts, L / 20

# which long side is "left" in the portrait frame -> places 1–20 (reading order: left column top→bottom, then right)
mids_p = {id(s): rot([s['mid']])[0] for s in long2}
left, right = sorted(long2, key=lambda s: mids_p[id(s)][0])
places = []
for side_idx, (s, base) in enumerate([(left, 1), (right, 21)]):
    pts, spacing = side_places(s)
    # order top→bottom in the portrait frame
    pts.sort(key=lambda p: rot([p['xy']])[0][1])
    s['spacing'] = spacing
    for k, p in enumerate(pts):
        num = base + k
        places.append({'n': num, 'side': s['bank'], 'k': k,
                       'xy': [round(float(p['xy'][0]), 3), round(float(p['xy'][1]), 3)],
                       'water_edge': [round(float(p['edge'][0]), 3), round(float(p['edge'][1]), 3)],
                       'faces_water_brg_deg': round(math.degrees(math.atan2(-p['n_out'][0], p['n_out'][1])) % 360, 1),   # compass bearing the angler looks at (towards the water)
                       'xy_portrait': [round(float(v), 3) for v in rot([p['xy']])[0]],
                       'water_edge_portrait': [round(float(v), 3) for v in rot([p['edge']])[0]],
                       'utm': [round(E0 + float(p['xy'][0]), 2), round(N0 - float(p['xy'][1]), 2)]})
# loop numbering alternative (U-shape: 1→20 down the left bank, 21→40 back up the right bank)
for p in places:
    p['n_loop'] = p['n'] if p['n'] <= 20 else 61 - p['n']

# --- SVG paths (metres)
def path_poly(pts):
    return 'M' + ' L'.join(f'{x:.2f},{y:.2f}' for x, y in pts) + ' Z'
def path_smooth(pts, tension=0.5):
    # closed Catmull–Rom -> cubic Bézier
    n = len(pts); out = f'M{pts[0][0]:.2f},{pts[0][1]:.2f}'
    for i in range(n):
        p0, p1, p2, p3 = pts[(i - 1) % n], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]
        c1 = p1 + (p2 - p0) * tension / 3; c2 = p2 - (p3 - p1) * tension / 3
        out += f' C{c1[0]:.2f},{c1[1]:.2f} {c2[0]:.2f},{c2[1]:.2f} {p2[0]:.2f},{p2[1]:.2f}'
    return out + ' Z'

def bbox(pts):
    pts = np.asarray(pts); return [round(float(pts[:, 0].min()), 2), round(float(pts[:, 1].min()), 2),
                                   round(float(pts[:, 0].max()), 2), round(float(pts[:, 1].max()), 2)]

real_p, clean_p = rot(real_pts), rot(clean_pts)
data = {
    'name': 'Malý Sporťáček (Líheň Liběchov) — dějiště MČR v Trout Area 2026',
    'units': 'metres; SVG frame = x east, y south (y down); origin = water-mask centroid',
    'origin_utm': [round(E0, 2), round(N0, 2)], 'crs': 'EPSG:32633',
    'origin_lonlat': pond['centroid_lonlat'],
    'outline': {
        'real': {'note': 'water edge from the 0.125 m ČÚZK orthophoto mask (label 2), Douglas–Peucker 0.25 m; keeps the small inflow notch on the E bank',
                 'points': [[round(float(x), 2), round(float(y), 2)] for x, y in real_pts],
                 'path_d': path_poly(real_pts), 'bbox': bbox(real_pts),
                 'points_portrait': [[round(float(x), 2), round(float(y), 2)] for x, y in real_p],
                 'path_d_portrait': path_poly(real_p), 'bbox_portrait': bbox(real_p)},
        'clean': {'note': 'recommended for motion graphics: mask closed with a 2.5 m disk (no notch) and opened with a 1 m disk, DP 0.35 m, drawn as a Catmull–Rom curve',
                  'points': [[round(float(x), 2), round(float(y), 2)] for x, y in clean_pts],
                  'path_d': path_smooth(clean_pts), 'bbox': bbox(clean_pts),
                  'points_portrait': [[round(float(x), 2), round(float(y), 2)] for x, y in clean_p],
                  'path_d_portrait': path_smooth(clean_p), 'bbox_portrait': bbox(clean_p)},
    },
    'dims_satellite': {
        'area_m2': round(area_px, 1), 'area_ha': round(area_px / 1e4, 3),
        'perimeter_m_real': round(real.length, 1), 'perimeter_m_clean': round(clean.length, 1),
        'axis_bearing_deg': round(axis_brg, 1),
        'equivalent_rectangle_m': [round(eq_L, 1), round(eq_W, 1)],
        'min_area_rect_m': [round(mar_L, 1), round(mar_W, 1)],
        'chords_through_centre_m': [round(ch_L, 1), round(ch_W, 1)],
        'sides': [{'bank': s['bank'], 'length_m': round(s['len'], 1), 'long': s in long2,
                   'corner_a': [round(float(v), 2) for v in s['a']], 'corner_b': [round(float(v), 2) for v in s['b']]} for s in sides],
        'note': 'equivalent rectangle = same area second moments (best single "L x W"); min-area rectangle = bounding box incl. rounded corners; '
                'the earlier "≈58 x 42 m" (drone manifest approx_length/width) overstated it. Depth cannot be measured from ortho/lidar (lidar does not penetrate water).',
    },
    'dims_web': {
        'area': '0,2 ha', 'depth': '1,5 m', 'size': '50 x 40 m', 'max_anglers_public': 10,
        'quotes': [
            {'q': 'Ceny povolenek v režimu chyť a pusť - malý Sporťáček (0,2 ha hloubka 1,5 m)', 'url': 'https://www.lihenlibechov.cz/cs/sportovni-rybolov', 'checked': '2026-10-21'},
            {'q': 'Ode dneška jsme otevřeli pro vás malej Sporťáček, hned naproti můstku. Má rozměry 50x40m. Je to takový rybník na rychlý zachytání, maximálně pro 10 rybářů.', 'url': 'https://www.lihenlibechov.cz/cs/aktualita/maly-sportacek', 'checked': '2026-10-21'},
            {'q': 'Lovit je možné ze všech stran.', 'url': 'https://www.lihenlibechov.cz/cs/sportovni-rybolov', 'checked': '2026-10-21'},
        ],
        'onscreen_recommended': ['Malý Sporťáček', '0,2 ha', 'hloubka 1,5 m', '50 × 40 m', '40 závodníků'],
    },
    'frames': {
        'northup': {'rotate_css_deg': 0},
        'portrait': {'rotate_css_deg': round(ROT, 2),
                     'note': 'drone-matched: long axis vertical, SW end at the top. The v2 flyover ends at yaw %.1f°, pitch %.1f° looking at the pond, '
                             'so its last frame shows the pond nearly the same way up (%.1f° apart) → match cut drone → scheme '
                             '(tilt rotateX ≈ %.0f° → 0 to go from the oblique drone view to top-down).' % (end['yaw_deg'], end['pitch_deg'], abs(((end['yaw_deg'] - sw_brg) + 180) % 360 - 180), 90 + end['pitch_deg'])},
        'drone_end_camera': {'yaw_deg': end['yaw_deg'], 'pitch_deg': end['pitch_deg'], 'agl_m': end['agl'], 'look_at_utm': end['look_at']},
    },
    'places': {
        'count': 40,
        'rule': '1–20 on one long bank, 21–40 on the other (operator 21. 10.); evenly spaced along the straight corner-to-corner line, '
                '%.1f m from each corner, placed on the bank %.1f m outside the water edge (clean outline)' % (TRIM, BANK_OFF),
        'numbering': 'default "n": reading order in the portrait frame — places 1–20 = %s bank (left column, top→bottom = SW→NE), '
                     '21–40 = %s bank (right column, top→bottom). Alternative "n_loop": continuous U (1→20 down the left bank, 21→40 back up the right). '
                     'PROPOSAL — the real peg plan of the organizers is not published; confirm with the operator.' % (left['bank'], right['bank']),
        'spacing_m': {left['bank']: round(left['spacing'], 2), right['bank']: round(right['spacing'], 2)},
        'list': places,
    },
    'context': {
        'NW bank': 'gravel access road/path along the bank (ortho)',
        'SW end': 'farm hall (large light roof) right at the SW corner (ortho)',
        'SE bank': 'tree line / forest edge (ortho)',
        'NE bank': 'grass strip, overhead power line further NE (ortho; wires removed in the v2 drone ortho)',
        'E bank': 'small inflow/outflow notch (~1 m) in the real outline',
    },
    'sources': {
        'mask': '../mcr-2026-dron/data/water_labels.png (label 2) + water_labels.pgw; ČÚZK ORTOFOTO 0.125 m, EPSG:32633 — see ../mcr-2026-dron/data/manifest.json, README.md',
        'qa': 'drone manifest alignment_qa: ortho water mask vs DMR 5G flat basin IoU 0.885 (co-registration < 1 m)',
        'web': ['https://www.lihenlibechov.cz/cs/sportovni-rybolov', 'https://www.lihenlibechov.cz/cs/aktualita/maly-sportacek'],
    },
}

# ======================= SVG / previews (white + red on transparent) =======================
RED, WHITE = '#e31e24', '#ffffff'
FONT_DIR = P / 'fonts'

def svg_scheme(frame, W, H, scale, cx, cy, title=True):
    pts = clean_p if frame == 'portrait' else clean_pts
    real_ = real_p if frame == 'portrait' else real_pts
    key = 'xy_portrait' if frame == 'portrait' else 'xy'
    kedge = 'water_edge_portrait' if frame == 'portrait' else 'water_edge'
    T = lambda x, y: (cx + x * scale, cy + y * scale)
    def P_(pts_):
        return np.array([T(x, y) for x, y in pts_])
    o = []
    o.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">')
    o.append('<defs><style>'
             f"@font-face{{font-family:'Montserrat';font-weight:100 900;src:url('{(FONT_DIR / 'montserrat-latin-ext-wght-normal.woff2').as_uri()}') format('woff2');unicode-range:U+0100-024F,U+1E00-1EFF}}"
             f"@font-face{{font-family:'Montserrat';font-weight:100 900;src:url('{(FONT_DIR / 'montserrat-latin-wght-normal.woff2').as_uri()}') format('woff2')}}"
             'text{font-family:Montserrat,sans-serif}</style></defs>')
    sp = P_(pts)
    # water: faint white fill + bold white rim + thin red inner rim
    o.append(f'<path d="{path_smooth(sp)}" fill="{WHITE}" fill-opacity="0.10" stroke="{WHITE}" stroke-width="{0.45*scale:.1f}" stroke-linejoin="round"/>')
    inner = Polygon(pts).buffer(-1.6, join_style=1)
    ip = P_(np.array(inner.exterior.coords)[:-1])
    o.append(f'<path d="{path_smooth(ip)}" fill="none" stroke="{RED}" stroke-width="{0.14*scale:.1f}" stroke-dasharray="{0.6*scale:.1f} {0.5*scale:.1f}" opacity="0.9"/>')
    # places
    r = 0.95 * scale
    fs = 0.95 * scale
    for p in places:
        x, y = T(*p[key]); ex, ey = T(*p[kedge])
        o.append(f'<line x1="{ex:.1f}" y1="{ey:.1f}" x2="{x:.1f}" y2="{y:.1f}" stroke="{WHITE}" stroke-width="{0.12*scale:.1f}" opacity="0.85"/>')
    for p in places:
        x, y = T(*p[key])
        o.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.1f}" fill="{RED}" stroke="{WHITE}" stroke-width="{0.12*scale:.1f}"/>')
        o.append(f'<text x="{x:.1f}" y="{y + fs*0.36:.1f}" font-size="{fs:.1f}" font-weight="800" fill="{WHITE}" text-anchor="middle">{p["n"]}</text>')
    # side chips 1–20 / 21–40 at the head of each column (continues the column by 2.6 spacings beyond its first place)
    for grp, lab_ in [((1, 20), '1–20'), ((21, 40), '21–40')]:
        g = sorted([p for p in places if grp[0] <= p['n'] <= grp[1]], key=lambda p: p['n'])
        a0, a1 = np.array(g[0][key]), np.array(g[1][key])
        c = a0 + (a0 - a1) * 2.6
        x, y = T(*c)
        tw = (0.62 * len(lab_) + 0.9) * 1.6 * scale; th = 1.9 * scale
        o.append(f'<rect x="{x - tw/2:.1f}" y="{y - th/2:.1f}" width="{tw:.1f}" height="{th:.1f}" rx="{th/2:.1f}" fill="{WHITE}"/>')
        o.append(f'<text x="{x:.1f}" y="{y + 0.55*scale:.1f}" font-size="{1.5*scale:.1f}" font-weight="900" fill="{RED}" text-anchor="middle">{lab_}</text>')
    # north arrow (rotated with the frame)
    th_ = math.radians(ROT if frame == 'portrait' else 0)
    ax, ay = (W - 110, 430) if frame == 'portrait' else (W - 90, 90)
    tip = (ax + 34 * math.sin(th_), ay - 34 * math.cos(th_)); tail = (ax - 34 * math.sin(th_), ay + 34 * math.cos(th_))
    o.append(f'<line x1="{tail[0]:.1f}" y1="{tail[1]:.1f}" x2="{tip[0]:.1f}" y2="{tip[1]:.1f}" stroke="{WHITE}" stroke-width="5" stroke-linecap="round"/>')
    o.append(f'<circle cx="{tip[0]:.1f}" cy="{tip[1]:.1f}" r="9" fill="{RED}"/>')
    lx, ly = ax + 62 * math.sin(th_), ay - 62 * math.cos(th_)
    o.append(f'<text x="{lx:.1f}" y="{ly + 10:.1f}" font-size="30" font-weight="800" fill="{WHITE}" text-anchor="middle">S</text>')
    # scale bar 10 m
    bx, by = (64, 1345) if frame == 'portrait' else (60, H - 60)
    o.append(f'<line x1="{bx}" y1="{by}" x2="{bx + 10*scale:.1f}" y2="{by}" stroke="{WHITE}" stroke-width="5"/>'
             f'<line x1="{bx}" y1="{by-12}" x2="{bx}" y2="{by+12}" stroke="{WHITE}" stroke-width="4"/>'
             f'<line x1="{bx + 10*scale:.1f}" y1="{by-12}" x2="{bx + 10*scale:.1f}" y2="{by+12}" stroke="{WHITE}" stroke-width="4"/>'
             f'<text x="{bx + 10*scale + 16:.1f}" y="{by + 10}" font-size="28" font-weight="700" fill="{WHITE}">10 m</text>')
    if title and frame == 'portrait':
        o.append(f'<text x="64" y="402" font-size="30" font-weight="800" fill="{RED}" letter-spacing="3">MÍSTO KONÁNÍ · MČR 2026</text>')
        o.append(f'<text x="64" y="474" font-size="64" font-weight="900" fill="{WHITE}">MALÝ SPORŤÁČEK</text>')
        chips = ['0,2 ha', 'hloubka 1,5 m', '50 × 40 m', '40 závodníků']
        x = 64
        for t in chips:
            w_ = 20 + len(t) * 17.5
            o.append(f'<rect x="{x}" y="1382" width="{w_:.0f}" height="54" rx="27" fill="none" stroke="{WHITE}" stroke-width="3"/>'
                     f'<text x="{x + w_/2:.0f}" y="1419" font-size="27" font-weight="700" fill="{WHITE}" text-anchor="middle">{t}</text>')
            x += w_ + 14
    o.append('</svg>')
    return '\n'.join(o)

def fit(frame, W, H, box):
    key = 'xy_portrait' if frame == 'portrait' else 'xy'
    heads = []
    for b in (1, 21):
        a0 = np.array([p[key] for p in places if p['n'] == b][0]); a1 = np.array([p[key] for p in places if p['n'] == b + 1][0])
        heads.append(a0 + (a0 - a1) * 3.6)
    pts = np.array([p[key] for p in places] + heads + list(clean_p if frame == 'portrait' else clean_pts))
    x0, y0, x1, y1 = pts[:, 0].min() - 5, pts[:, 1].min() - 3, pts[:, 0].max() + 5, pts[:, 1].max() + 3
    bx0, by0, bx1, by1 = box
    s = min((bx1 - bx0) / (x1 - x0), (by1 - by0) / (y1 - y0))
    return s, (bx0 + bx1) / 2 - (x0 + x1) / 2 * s, (by0 + by1) / 2 - (y0 + y1) / 2 * s

shots = []
for frame, (W, H), box in [('portrait', (1080, 1920), (64, 520, 1016, 1300)), ('northup', (1080, 1080), (40, 40, 1040, 1040))]:
    s, cx, cy = fit(frame, W, H, box)
    svg = svg_scheme(frame, W, H, s, cx, cy)
    f = OUT_S / f'pond_scheme_{frame}.svg'
    f.write_text(svg)
    data['frames'][frame]['preview_px_per_m'] = round(s, 2)
    shots.append((f, W, H, OUT_D / ('pond_scheme_preview_9x16.png' if frame == 'portrait' else 'pond_scheme_preview_northup.png')))

json.dump(data, open(OUT_D / 'pond_scheme.json', 'w'), indent=1, ensure_ascii=False)

# render SVG -> transparent PNG with headless Chromium
shell = glob.glob('/opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell')[0]
for f, W, H, out in shots:
    subprocess.run([shell, '--no-sandbox', '--headless', '--disable-gpu', '--hide-scrollbars',
                    '--default-background-color=00000000', f'--window-size={W},{H}', f'--screenshot={out}', f.as_uri()],
                   check=True, capture_output=True, timeout=60)

# QA overlay on the orthophoto (north-up): outlines and places drawn directly in ortho pixels (2x)
from PIL import ImageDraw, ImageFont
ys_, xs_ = np.nonzero(mask)
r0, c0 = ys_.min() - 120, xs_.min() - 120
r1, c1 = ys_.max() + 120, xs_.max() + 120
S2 = 2
qa = Image.open(DR / 'orto_core_6400.jpg').crop((c0, r0, c1, r1)).convert('RGB')
qa = qa.resize((qa.width * S2, qa.height * S2), Image.LANCZOS)
dq = ImageDraw.Draw(qa)
def opx(x, y): return (((E0 + x) - X0) / RES - c0) * S2, ((Y1 - (N0 - y)) / RES - r0) * S2
for k_, col, w_ in [('real', (227, 30, 36), 3), ('clean', (255, 255, 255), 3)]:
    pp = [opx(*p) for p in data['outline'][k_]['points']]
    dq.line(pp + [pp[0]], fill=col, width=w_)
fnt = ImageFont.truetype(str(P / 'fonts/_ttf/montserrat-latin-wght-normal.ttf'), 15)
try: fnt.set_variation_by_axes([800])
except Exception: pass
for p in places:
    x, y = opx(*p['xy']); ex, ey = opx(*p['water_edge'])
    dq.line([(ex, ey), (x, y)], fill=(255, 255, 255), width=2)
    dq.ellipse((x - 11, y - 11, x + 11, y + 11), fill=(227, 30, 36), outline=(255, 255, 255), width=2)
    dq.text((x, y), str(p['n']), fill=(255, 255, 255), font=fnt, anchor='mm')
dq.text((20, 20), 'QA: red = real water edge (mask, DP 0.25 m) · white = clean outline · places 1.5 m on the bank · north up · 16 px/m',
        fill=(255, 255, 255), font=ImageFont.truetype(str(P / 'fonts/_ttf/montserrat-latin-wght-normal.ttf'), 18))
qa.save(OUT_D / 'pond_scheme_qa_ortho.jpg', quality=88)

# viewing copies of the transparent previews on a dark field (the PNGs themselves stay transparent)
for _, W, H, out in shots:
    im = Image.open(out).convert('RGBA')
    bg = Image.new('RGBA', im.size, (11, 30, 66, 255)); bg.alpha_composite(im)
    bg.convert('RGB').save(out.with_name(out.stem + '_on_dark.jpg'), quality=90)

ds = data['dims_satellite']
print('area', ds['area_m2'], 'eqrect', ds['equivalent_rectangle_m'], 'mar', ds['min_area_rect_m'], 'chords', ds['chords_through_centre_m'],
      'perim', ds['perimeter_m_real'], ds['perimeter_m_clean'], 'axis', ds['axis_bearing_deg'])
print('sides', [(s['bank'], s['length_m'], s['long']) for s in ds['sides']])
print('portrait rot', ROT, 'left', left['bank'], 'right', right['bank'], 'spacing', data['places']['spacing_m'])
print('real pts', len(real_pts), 'clean pts', len(clean_pts))
