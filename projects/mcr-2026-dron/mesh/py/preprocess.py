"""Approach A preprocessing: DSM -> sharpened/smoothed 0.5 m heightfield, AO, class masks, water masks.
All rasters EPSG:32633 north-up, row 0 = north, pixel-is-area.
Local scene frame: x = E - E0, y = H_bpv - Z0, z = -(N - N0)."""
import numpy as np, tifffile, json, os
from PIL import Image
from scipy import ndimage as ndi
Image.MAX_IMAGE_PIXELS = None
D = '/home/user/Clipcreator/projects/mcr-2026-sponzori/drone/data/'
B = '/home/user/Clipcreator/projects/mcr-2026-sponzori/drone/mesh/build/'
E0, N0, Z0 = 461450.0, 5584700.0, 160.0
CORE = [461150.0, 5584450.0, 461950.0, 5585250.0]
CTX = [460050.0, 5583350.0, 463050.0, 5586350.0]
RES = 0.5
man = json.load(open(D + 'manifest.json'))
ponds = man['ponds']
LEVEL = {1: ponds['velky_sportak_big']['water_level_used_m_bpv'],
         2: ponds['maly_sportacek_small_HERO']['water_level_used_m_bpv'],
         3: ponds['north_pond_bozi_voda']['water_level_used_m_bpv'],
         4: ponds['hatchery_rearing_ponds']['water_level_used_m_bpv']}
print('levels', LEVEL)

dsm = tifffile.imread(D + 'dsm_core_1m_render.tif').astype(np.float64)
dtm = tifffile.imread(D + 'dtm_core_1m_render.tif').astype(np.float64)
ort1 = np.asarray(Image.open(D + 'orto_core_4096.jpg').convert('RGB').resize((800, 800), Image.BOX)).astype(np.float64) / 255
labels = np.asarray(Image.open(D + 'water_labels.png'))  # 6400 @0.125
water1 = np.asarray(Image.open(D + 'water_mask_1m.png')) > 64

# ---------------- classification @1 m ----------------
ndsm = dsm - dtm
R, G, Bc = ort1[..., 0], ort1[..., 1], ort1[..., 2]
exg = (2 * G - R - Bc) / (R + G + Bc + 1e-3)
lum = 0.2126 * R + 0.7152 * G + 0.0722 * Bc
obj = ndsm > 2.2
bld = obj & (exg < 0.035) & ~water1
bld = ndi.binary_opening(bld, np.ones((3, 3)))
lab, n = ndi.label(bld)
keep = np.zeros(n + 1, bool)
red = (R > G * 1.12) & (R > Bc * 1.15)
for i, sl in enumerate(ndi.find_objects(lab), start=1):
    m = lab[sl] == i
    area = m.sum()
    if area < 30: continue
    nd = ndsm[sl][m]
    if np.median(nd) < 3.0: continue
    yy_, xx_ = np.nonzero(m)
    cov = np.cov(np.vstack([xx_, yy_])) if area > 2 else np.eye(2)
    ev = np.sort(np.linalg.eigvalsh(cov))
    elong = np.sqrt(ev[1] / max(ev[0], 1e-3))
    lmean = lum[sl][m].mean(); redfrac = red[sl][m].mean(); nstd = nd.std()
    ok = (elong < 4.5) and ((nstd < 2.5) or (redfrac > 0.5 and nstd < 4.0) or (lmean > 0.24 and nstd < 3.2 and np.median(nd) < 9.5))
    rr, gg, bb = R[sl][m], G[sl][m], Bc[sl][m]
    mx_, mn_ = np.maximum(np.maximum(rr, gg), bb), np.minimum(np.minimum(rr, gg), bb)
    asph = ((mx_ - mn_) / (mx_ + 1e-3) < 0.12) & (lum[sl][m] > 0.22) & (lum[sl][m] < 0.6)
    if elong > 2.4 and asph.mean() > 0.5 and redfrac < 0.1: ok = False
    keep[i] = ok
bld = keep[lab]
bld = ndi.binary_closing(bld, np.ones((3, 3)))
bld = ndi.binary_fill_holes(bld)
# ghost objects: DSM (lidar 2009-13) says "tall object" but the current ortho shows bright bare ground/
# gravel/asphalt (trees felled since, or crowns leaning in the non-true ortho) -> flatten to the DTM
bdil = ndi.binary_dilation(bld, iterations=2)
ghost = (ndsm > 1.5) & (exg < 0.05) & (lum > 0.25) & ~bdil & ~water1
ghost = ndi.binary_opening(ghost, np.ones((2, 2)))
glab, gn = ndi.label(ghost)
gkeep = np.zeros(gn + 1, bool)
for i, sl in enumerate(ndi.find_objects(glab), start=1):
    m = glab[sl] == i; area = m.sum()
    if area < 6: continue
    yy_, xx_ = np.nonzero(m)
    ev = np.sort(np.linalg.eigvalsh(np.cov(np.vstack([xx_, yy_])))) if area > 3 else np.array([1, 1])
    elong = np.sqrt(ev[1] / max(ev[0], 1e-3))
    rr, gg, bb = R[sl][m], G[sl][m], Bc[sl][m]
    mx_, mn_ = np.maximum(np.maximum(rr, gg), bb), np.minimum(np.minimum(rr, gg), bb)
    asph = (((mx_ - mn_) / (mx_ + 1e-3)) < 0.12).mean()
    ndc = ndsm[sl][m]
    treelike = (np.median(ndc) > 9.5) or (ndc.std() > 3.2)          # houses: ~5-9 m, smooth roofs
    gkeep[i] = treelike and not (elong > 3.5 and asph > 0.5 and area > 60)   # keep bridges / road embankments
ghost = ndi.binary_dilation(gkeep[glab], iterations=1) & ~bdil
wg1 = ndi.gaussian_filter(ghost.astype(np.float64), 0.8)
dsm = wg1 * dtm + (1 - wg1) * dsm
ndsm = dsm - dtm
tree = (ndsm > 1.2) & ~ndi.binary_dilation(bld, iterations=1) & ~water1
print('building px', bld.sum(), 'tree px', tree.sum(), 'ghost px', ghost.sum())

# ---------------- context model (3 m) ----------------
# ---------------- context 3 m ----------------
ctx = tifffile.imread(D + 'dmp1g_context_3m.tif').astype(np.float64)
ctx_dtm = tifffile.imread(D + 'dmr5g_context_3m.tif').astype(np.float64)
cort = np.asarray(Image.open(D + 'orto_context_3000.jpg').convert('RGB').resize((1000, 1000), Image.BOX)).astype(np.float64) / 255
cR, cG, cB = cort[..., 0], cort[..., 1], cort[..., 2]
cexg = (2 * cG - cR - cB) / (cR + cG + cB + 1e-3)
cnd = np.clip(ctx - ctx_dtm, 0, 40)
veg = (cexg > 0.02) & (cnd > 1.0)
cbld = (cnd > 2.0) & ~veg
canopy = ndi.gaussian_filter(np.where(veg, cnd, 0.0), 1.6) * 0.95
houses = ndi.gaussian_filter(np.where(cbld, np.minimum(cnd, 8.0), 0.0), 1.1) * 0.35
ctx_s = ndi.gaussian_filter(ctx_dtm, 0.5) + np.maximum(canopy, houses)

# ---------------- upsample to 0.5 m ----------------
NH = int(round((CORE[3] - CORE[1]) / RES)); NW = int(round((CORE[2] - CORE[0]) / RES))
k = np.arange(NW)
xx = (CORE[0] + (k + 0.5) * RES) - (CORE[0] + 0.5)   # 1 m pixel index coords
yy = ((CORE[3] - (np.arange(NH) + 0.5) * RES) - (CORE[3] - 0.5)) * -1.0
YY, XX = np.meshgrid(yy, xx, indexing='ij')
h = ndi.map_coordinates(dsm, [YY, XX], order=1, mode='nearest')
hdtm = ndi.map_coordinates(dtm, [YY, XX], order=1, mode='nearest')
bldf = ndi.map_coordinates(bld.astype(np.float64), [YY, XX], order=1, mode='nearest')
treef = ndi.map_coordinates(tree.astype(np.float64), [YY, XX], order=1, mode='nearest')

# smooth everything (removes bilinear creases of the 2 m native DSM, rounds tree crowns)
hs = ndi.gaussian_filter(h, 1.6)
ht = ndi.gaussian_filter(h, 2.4)
wt = ndi.gaussian_filter((treef > 0.5).astype(np.float64), 2.0)
hs = wt * ht + (1 - wt) * hs
# building shock filter: ramps -> steps (walls), only where local relief > 2.5 m
bmask = ndi.binary_dilation(bldf > 0.5, iterations=3)
hb = h.copy()
for it in range(2):
    mx = ndi.maximum_filter(hb, 5); mn = ndi.minimum_filter(hb, 5)
    rng = mx - mn; mid = 0.5 * (mx + mn)
    step = np.where(hb > mid, mx, mn)
    sel = bmask & (rng > 2.5)
    hb = np.where(sel, step, hb)
hb = ndi.gaussian_filter(hb, 0.6)
wb = ndi.gaussian_filter(bmask.astype(np.float64), 1.0)
hh = wb * hb + (1 - wb) * hs

# ---------------- core boundary: blend into the context model over a 45 m band (no seam/step) -------------
cjj = ((CORE[0] + (np.arange(NW) + 0.5) * RES) - CTX[0]) / 3.0 - 0.5
cii = (CTX[3] - (CORE[3] - (np.arange(NH) + 0.5) * RES)) / 3.0 - 0.5
CII, CJJ = np.meshgrid(cii, cjj, indexing='ij')
ctx_at_core = ndi.map_coordinates(ctx_s, [CII, CJJ], order=1, mode='nearest')
de = np.minimum.reduce([np.arange(NW)[None, :] * RES + 0 * CII, (NW - 1 - np.arange(NW))[None, :] * RES + 0 * CII,
                        np.arange(NH)[:, None] * RES + 0 * CII, (NH - 1 - np.arange(NH))[:, None] * RES + 0 * CII])
wbnd = np.clip((de - 5.0) / 40.0, 0, 1); wbnd = wbnd * wbnd * (3 - 2 * wbnd)
hh = wbnd * hh + (1 - wbnd) * ctx_at_core

# ---------------- water: lower pond beds under the water planes ----------------
lab05 = labels.reshape(NH, 4, NW, 4)
wf = {}
for L in (1, 2, 3, 4):
    f = (lab05 == L).mean(axis=(1, 3))
    wf[L] = f
    sel = f > 0.0
    hh[sel] = np.minimum(hh[sel], LEVEL[L] + 0.03 - 1.4 * f[sel])
# also never let any land vertex inside ponds poke through
print('h range', hh.min(), hh.max())

# ---------------- AO @1 m on final heightfield ----------------
h1 = hh.reshape(800, 2, 800, 2).mean(axis=(1, 3))
dists = [1, 2, 3, 4, 6, 8, 11, 15, 20, 27, 36]
ndir = 16
vis = np.zeros_like(h1)
for a in range(ndir):
    ang = 2 * np.pi * (a + 0.5) / ndir
    dx, dy = np.cos(ang), np.sin(ang)
    hmax = np.full_like(h1, -1e9)
    for d in dists:
        sh = ndi.shift(h1, (dy * d, dx * d), order=1, mode='nearest')
        hmax = np.maximum(hmax, (sh - h1) / d)
    vis += 1 - np.sin(np.arctan(np.maximum(hmax, 0)))
ao = vis / ndir
ao = np.clip((ao - 0.45) / 0.55, 0, 1)
print('ao', ao.min(), ao.mean())

# ---------------- context mesh heights ----------------
# inside the core bbox: take core heightfield (block mean to 3 m is not aligned: core starts at 1100 m offset = 366.67 px)
# sample core hh at ctx pixel centres
cE = CTX[0] + (np.arange(1000) + 0.5) * 3.0
cN = CTX[3] - (np.arange(1000) + 0.5) * 3.0
CNN, CEE = np.meshgrid(cN, cE, indexing='ij')
inside = (CEE > CORE[0] + 1) & (CEE < CORE[2] - 1) & (CNN > CORE[1] + 1) & (CNN < CORE[3] - 1)
ci = (CORE[3] - CNN) / RES - 0.5; cj = (CEE - CORE[0]) / RES - 0.5
core_s = ndi.map_coordinates(ndi.gaussian_filter(hh, 2.0), [ci, cj], order=1, mode='nearest')
ctx2 = np.where(inside, core_s - 0.8, ctx_s)
(ctx2 - Z0).astype('<f4').tofile(B + 'ctx_h_3m.f32')
print('ctx range', ctx2.min(), ctx2.max(), 'edge mean', np.mean(np.r_[ctx2[0], ctx2[-1], ctx2[:, 0], ctx2[:, -1]]))


# ---------------- crown detail height from the ortho (0.25 m): bright crown tops bulge, dark gaps sink ------
o25 = np.asarray(Image.open(D + 'orto_core_6400.jpg').convert('L').resize((3200, 3200), Image.BOX)).astype(np.float64) / 255
det = ndi.gaussian_filter(o25, 1.6) - ndi.gaussian_filter(o25, 10.0)
tree25 = ndi.zoom(ndi.gaussian_filter(tree.astype(np.float64), 1.0), 4, order=1)
det = np.clip(det * 14.0, -2.0, 2.0) * np.clip(tree25, 0, 1)
detimg = np.clip(128 + det / 2.0 * 127, 0, 255).astype(np.uint8)
Image.fromarray(detimg, 'L').save(B + 'crown_det_025.png')
print('det std', det[tree25 > 0.5].std())

# ---------------- context: class + DTM textures for the shader ----------------
cao_h = ctx2.copy()
cvis = np.zeros_like(cao_h)
for a in range(12):
    ang = 2 * np.pi * (a + 0.5) / 12; dx, dy = np.cos(ang), np.sin(ang)
    hmax = np.full_like(cao_h, -1e9)
    for d in [1, 2, 3, 5, 8, 12]:
        sh = ndi.shift(cao_h, (dy * d, dx * d), order=1, mode='nearest')
        hmax = np.maximum(hmax, (sh - cao_h) / (3.0 * d))
    cvis += 1 - np.sin(np.arctan(np.maximum(hmax, 0)))
cao = np.clip((cvis / 12 - 0.45) / 0.55, 0, 1)
ccls = np.zeros((1000, 1000, 4), np.uint8)
ccls[..., 0] = np.clip(ndi.gaussian_filter(cbld.astype(float), 0.6) * 255, 0, 255)
ccls[..., 1] = np.clip(ndi.gaussian_filter(veg.astype(float), 0.6) * 255, 0, 255)
ccls[..., 2] = np.clip(cao * 255, 0, 255)
ccls[..., 3] = 255
Image.fromarray(ccls, 'RGBA').save(B + 'cls_ctx_3m.png')
(ndi.gaussian_filter(ctx_dtm, 0.5) - Z0).astype('<f4').tofile(B + 'dtm_ctx_3m.f32')

# ---------------- write ----------------
os.makedirs(B, exist_ok=True)
(hh - Z0).astype('<f4').tofile(B + 'core_h_05.f32')
(dtm - Z0).astype('<f4').tofile(B + 'dtm_1m.f32')
cls = np.zeros((800, 800, 4), np.uint8)
cls[..., 0] = np.clip(ndi.gaussian_filter(bld.astype(float), 0.7) * 255, 0, 255)
cls[..., 1] = np.clip(ndi.gaussian_filter(tree.astype(float), 0.7) * 255, 0, 255)
cls[..., 2] = np.clip(ao * 255, 0, 255)
cls[..., 3] = np.clip(ndsm / 30 * 255, 0, 255)
Image.fromarray(cls, 'RGBA').save(B + 'cls_core_1m.png')
# water masks per label at 0.25 m (3200^2): R big, G small, B rearing, A north
lab25 = labels.reshape(3200, 2, 3200, 2)
wm = np.zeros((3200, 3200, 4), np.uint8)
for ch, L in ((0, 1), (1, 2), (2, 4), (3, 3)):
    f = (lab25 == L).mean(axis=(1, 3))
    f = ndi.gaussian_filter(f, 0.6)
    wm[..., ch] = np.clip(f * 255, 0, 255)
Image.fromarray(wm, 'RGBA').save(B + 'water_core_025.png')

meta = dict(E0=E0, N0=N0, Z0=Z0, core=CORE, ctx=CTX, core_res=RES, core_n=[NH, NW], ctx_res=3.0, ctx_n=[1000, 1000],
            levels={str(k): v for k, v in LEVEL.items()},
            pond_bbox={'1': ponds['velky_sportak_big']['bbox_utm'], '2': ponds['maly_sportacek_small_HERO']['bbox_utm'],
                       '3': ponds['north_pond_bozi_voda']['bbox_utm'], '4': ponds['hatchery_rearing_ponds']['bbox_utm']},
            ctx_edge_mean=float(np.mean(np.r_[ctx2[0], ctx2[-1], ctx2[:, 0], ctx2[:, -1]])))
json.dump(meta, open(B + 'meta.json', 'w'), indent=1)

# debug: classification overlay
dbg = (ort1 * 255).astype(np.uint8).copy()
dbg[bld] = (0.5 * dbg[bld] + [127, 0, 0]).astype(np.uint8)
dbg[tree] = (0.6 * dbg[tree] + [0, 0, 90]).astype(np.uint8)
dbg[ghost] = (0.5 * dbg[ghost] + [120, 120, 0]).astype(np.uint8)
Image.fromarray(dbg).crop((150, 250, 600, 700)).resize((900, 900), Image.NEAREST).save(B + '../tmp/cls_debug.jpg', quality=88)
# hillshade of the final heightfield (hero area)
gy, gx = np.gradient(hh, RES)
hs_img = np.clip(0.5 + 0.5 * (-gx * 0.6 + gy * 0.6) / np.sqrt(1 + gx ** 2 + gy ** 2), 0, 1)
Image.fromarray((hs_img[500:1400, 300:1200] * 255).astype(np.uint8)).save(B + '../tmp/hillshade_hero.jpg', quality=88)
Image.fromarray((ao * 255).astype(np.uint8)).save(B + '../tmp/ao.png')
print('done')
