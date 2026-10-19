"""Troutshop ad assets: trim + split spoon pairs (a = upper-left spoon, b = lower-right),
write assets_prep/troutshop/ads/*.png and a contact sheet (_sheet.jpg) on dark / light / brand red."""
import os, json, shutil, importlib.util, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
_sp = importlib.util.spec_from_file_location('ts_polish', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ts_polish.py'))
ts_polish = importlib.util.module_from_spec(_sp); _sp.loader.exec_module(ts_polish)   # eyelet refit + white-rim defringe
P = '/home/user/Clipcreator/projects/mcr-2026-sponzori/assets_prep/troutshop/'
W = '/home/user/Clipcreator/projects/mcr-2026-sponzori/_work/troutshop_ads/'; OUT = P + 'ads/'  # W: dewatermarked (dw_) + ISNet (ml_) + refined cut (cut_) intermediates

def trim(im, pad=0.03):
    bb = Image.fromarray((np.array(im)[..., 3] > 6).astype(np.uint8) * 255).getbbox()
    im = im.crop(bb); p = int(round(max(im.size) * pad))
    c = Image.new('RGBA', (im.width + 2 * p, im.height + 2 * p), (0, 0, 0, 0)); c.alpha_composite(im, (p, p)); return c

def split(im):
    a = np.array(im); al = a[..., 3]
    n, lab, st, cen = cv2.connectedComponentsWithStats((al > 6).astype(np.uint8), 8)
    comps = sorted([k for k in range(1, n) if st[k, cv2.CC_STAT_AREA] > 2000], key=lambda k: -st[k, cv2.CC_STAT_AREA])[:2]
    if len(comps) < 2: return None
    # every other component (detached hook, ring) goes to the nearest of the two spoons
    dists = [cv2.distanceTransform((lab != k).astype(np.uint8), cv2.DIST_L2, 5) for k in comps]
    owner = np.argmin(np.stack(dists), 0)
    parts = []
    for i, k in enumerate(comps):
        m = (lab > 0) & (owner == i)
        b = a.copy(); b[..., 3] = np.where(m, al, 0); parts.append((cen[k][1] + cen[k][0], Image.fromarray(b, 'RGBA')))
    parts.sort(key=lambda t: t[0])           # upper-left first
    return [trim(p) for _, p in parts]

ITEMS = [  # out name, source, kind, product label
    ('hero_01_nories_rooney_2-8g_101', W + 'cut_rooney_101.png', 'pair', 'Nories ROONEY 2,8g 101 (top product)'),
    ('hero_02_velvetarts_forte_2-1g_32_glow_pink', W + 'dw_forte_32.png', 'pair', 'Velvet Arts Forte 2.1g 32 Glow Fluorescent Pink (new)'),
    ('hero_03_nories_crankin_pupa_109', P + 'heroes/h04_nories_crankin_pupa.png', 'single', "Nories CRANKIN' PUPA 2,6g 109"),
    ('sec_01_nories_rooney_002', W + 'cut_rooney_002.png', 'pair', 'Nories ROONEY 002'),
    ('sec_02_nories_rooney_sk20_magma', W + 'cut_rooney_sk20.png', 'pair', 'Nories ROONEY SK20 Magma (limited)'),
    ('sec_03_forest_miu_ts4_limited', W + 'cut_forest_miu_ts4.png', 'pair', 'Forest MIU TS4 – Limited Color'),
    ('sec_04_velvetarts_forte_2-1g_35_yellow_red', W + 'dw_forte_35.png', 'pair', 'Velvet Arts Forte 2.1g 35 Yellow-Red/Brown'),
    ('sec_05_nories_tulle_3g_101', W + 'cut_tulle_101.png', 'pair', 'Nories TULLE 3.0g 101'),
    ('sec_06_fishup_baffi_fly_hot_pink', P + 'heroes/h05_fishup_baffi_fly_pink.png', 'single', 'FishUp Baffi Fly 1,5 Hot Pink'),
    ('sec_07_velvetarts_forte_2-1g_30_glow_gold', W + 'dw_forte_30.png', 'pair', 'Velvet Arts Forte 2.1g 30 Glow Gold'),
]
U = 'https://troutshop.eu/wp-content/uploads/'
SRC = {  # source image on troutshop.eu + product / listing page (bridge 19. 10. 2026) + role in the ad
    'hero_01_nories_rooney_2-8g_101': (U + '2020/07/nories-rooney-101-1.jpg (800 px -> Higgsfield 2k)', 'https://troutshop.eu/p/rooney-28g-101/', 'hero'),
    'hero_02_velvetarts_forte_2-1g_32_glow_pink': (U + '2026/10/velvet-arts-forte-2_1g-32.png', 'https://troutshop.eu/pc/spoons/velvet-arts-2/', 'hero'),
    'hero_03_nories_crankin_pupa_109': (U + '2022/03/crankin-pupa-109-2048x2048.jpg (Higgsfield remove_background)', 'https://troutshop.eu/p/crankin-pupa-26g-109/', 'hero'),
    'sec_01_nories_rooney_002': (U + '2025/11/nories-rooney-002.jpg', 'https://troutshop.eu/p/rooney-28g-002/', 'secondary'),
    'sec_02_nories_rooney_sk20_magma': (U + '2025/09/nories-rooney-sk20.jpg', 'https://troutshop.eu/p/nories-rooney-2-8g-sk20-magma/', 'secondary'),
    'sec_03_forest_miu_ts4_limited': (U + '2025/12/forest-miu-ts4.jpg', 'https://troutshop.eu/p/forest-miu-2-8g-ts4-limited-color/', 'secondary'),
    'sec_04_velvetarts_forte_2-1g_35_yellow_red': (U + '2026/10/velvet-arts-forte-2_1g-35.png', 'https://troutshop.eu/pc/spoons/velvet-arts-2/', 'secondary'),
    'sec_05_nories_tulle_3g_101': (U + '2025/02/nories-tulle-3.0g-3.5g-101.jpg', 'https://troutshop.eu/p/nories-tulle-3-0g-101/', 'secondary'),
    'sec_06_fishup_baffi_fly_hot_pink': (U + '2020/07/baffi-fly-15-112-hot-pink-3r.jpg', 'https://troutshop.eu/p/baffi-fly-15-hot-pink/', 'secondary (soft bait: not a hard bait, never as MČR lure)'),
    'sec_07_velvetarts_forte_2-1g_30_glow_gold': (U + '2026/10/velvet-arts-forte-2_1g-30.png', 'https://troutshop.eu/pc/spoons/velvet-arts-2/', 'secondary'),
}

def pad_of(path):
    al = np.array(Image.open(path).convert('RGBA'))[..., 3]; H, W = al.shape
    ys, xs = np.nonzero(al > 6)
    return [round(xs.min() / W, 3), round(ys.min() / H, 3), round((W - 1 - xs.max()) / W, 3), round((H - 1 - ys.max()) / H, 3)]

meta = []
NO_POLISH = {'hero_03_nories_crankin_pupa_109'}   # clear plastic crank: its light rim is real, keep HF alpha as is
for name, src, kind, label in ITEMS:
    im = Image.open(src).convert('RGBA')
    if name not in NO_POLISH:
        rep = []; im = ts_polish.polish(im, report=rep); print('  polish', name, '|', '; '.join(rep))
    t = trim(im); t.save(OUT + name + '.png', optimize=True)
    e = dict(file='troutshop/ads/' + name + '.png', product=label, size=list(t.size), kind=kind, role=SRC[name][2], src_url=SRC[name][0], page=SRC[name][1], polished=name not in NO_POLISH)
    if kind == 'pair':
        sp = split(im)
        if sp:
            for tag, p in zip('ab', sp):
                p.save(OUT + f'{name}_{tag}.png', optimize=True)
            e['split'] = {tag: dict(file=f'troutshop/ads/{name}_{tag}.png', size=list(p.size)) for tag, p in zip('ab', sp)}
    meta.append(e); print(name, t.size, 'split' in e)

def dom(path, k=3):
    a = np.array(Image.open(path).convert('RGBA')); m = a[..., 3] > 200
    px = a[..., :3][m].astype(np.float32)
    if len(px) > 60000: px = px[np.random.default_rng(0).choice(len(px), 60000, replace=False)]
    crit = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 1.0)
    _, lab, cen = cv2.kmeans(px, k, None, crit, 3, cv2.KMEANS_PP_CENTERS)
    cnt = np.bincount(lab.ravel(), minlength=k) / len(lab); o = np.argsort(-cnt)
    lum = a[..., :3].mean(2) * (a[..., 3] > 250)
    y, x = np.unravel_index(np.argmax(cv2.GaussianBlur(lum.astype(np.float32), (0, 0), 6)), lum.shape)
    return [dict(hex='#%02x%02x%02x' % tuple(int(v) for v in cen[i]), share=round(float(cnt[i]), 3)) for i in o], [round(x / a.shape[1], 3), round(y / a.shape[0], 3)]
ROOT = '/home/user/Clipcreator/projects/mcr-2026-sponzori/assets_prep/'
for e in meta:
    e['dominant'], e['glint'] = dom(ROOT + e['file']); e['pad'] = pad_of(ROOT + e['file'])
    for t, sp in e.get('split', {}).items():
        sp['dominant'], sp['glint'] = dom(ROOT + sp['file']); sp['pad'] = pad_of(ROOT + sp['file'])
json.dump(meta, open(OUT + '_ads.json', 'w'), indent=1, ensure_ascii=False)

# contact sheet
files = [m['file'].split('/')[-1] for m in meta] + ['../logo_on_light.png', '../logo_on_dark.png']
CW, CH = 300, 420
bgs = [(10, 10, 10), (242, 242, 242), (227, 0, 15)]
sheet = Image.new('RGB', (CW * len(files), CH * 3 + 40), (30, 30, 30))
d = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(OUT + f).convert('RGBA'); im.thumbnail((CW - 24, CH - 50), Image.LANCZOS)
    for j, bg in enumerate(bgs):
        b = Image.new('RGBA', (CW, CH), bg + (255,))
        # soft contact shadow preview (blurred alpha, offset down) so halos / missing parts show against all three grounds
        ox, oy = (CW - im.width) // 2, (CH - 30 - im.height) // 2 + 10
        sh = np.zeros((CH, CW), np.float32); sa = np.array(im)[..., 3].astype(np.float32) / 255
        sh[oy + 10:oy + 10 + im.height, ox + 4:ox + 4 + im.width] = sa[:max(0, min(im.height, CH - oy - 10)), :max(0, min(im.width, CW - ox - 4))]
        sh = cv2.GaussianBlur(sh, (0, 0), 7) * (0.28 if j == 1 else 0.55)
        shadow = np.zeros((CH, CW, 4), np.uint8); shadow[..., 3] = (sh * 255).clip(0, 255).astype(np.uint8)
        b.alpha_composite(Image.fromarray(shadow, 'RGBA'))
        b.alpha_composite(im, (ox, oy))
        sheet.paste(b.convert('RGB'), (i * CW, j * CH))
    d.text((i * CW + 6, CH * 3 + 8), f.replace('.png', '')[:44], fill=(230, 230, 230))
sheet.save(OUT + '_sheet.jpg', quality=88)
print('sheet', sheet.size)
