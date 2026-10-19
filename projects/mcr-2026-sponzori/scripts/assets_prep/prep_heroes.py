"""Step 2 — product hero cut-outs → assets_prep/<key>/heroes/hNN_<slug>.png (+ originals in <key>/orig/).

Stages:
  A  prep inputs (flatten on white, crop away labels/logos/vise) → scratch/heroes_in/<key>__<slug>.png
  B  background removal: @imgly/background-removal-node (ISNet 'medium', weights bundled in the npm package)
  C  post: drop stray specks/labels, trim, luminance levels + light saturation (consistent look), ≤ 2000 px
usage: python prep_heroes.py [A|B|C|all]
"""
import json
import os
import shutil
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *  # noqa
from PIL import ImageEnhance, ImageDraw

SCR = '/tmp/claude-0/-home-user-Clipcreator/71aa791e-2b52-549a-940d-d7fdf5b83edd/scratchpad/ap'
BGNODE = f'{SCR}/../bgnode'
IN = f'{SCR}/heroes_in'
RAW = f'{SCR}/heroes_raw'

# key: [(slug, source file, product name (verified in research/*.md), prep-op)]
SEL = {
    'troutshop': [
        ('h01_velvetarts_forte_glow_pink', 'p01_velvet-arts-forte-2-1g-32-glow-pink.png', 'Velvet Arts Forte 2.1g 32 Glow Fluorescent Pink', ('alpha_from_src', None)),
        ('h02_velvetarts_forte_yellow_red', 'p02_velvet-arts-forte-2-1g-35-yellow-red.png', 'Velvet Arts Forte 2.1g 35 Yellow-Red/Brown', ('alpha_from_src', None)),
        # rejected (TROUTSHOP.EU watermark visible ON the lure): p03 Forte Glow Gold, p07 Daisy Glow Orange, p09 Nories Rooney, p04 Nories Tulle
        # p05 Forte Mustard Gold rejected: lure is only ~320 px in the 600 px source
        ('h04_nories_crankin_pupa', 'p06_nories-crankin-pupa-109.jpg', "Nories Crankin' Pupa 2.6g 109", ('crop_frac', (0, 0.30, 1, 1))),
        ('h05_fishup_baffi_fly_pink', 'p08_fishup-baffi-fly-hot-pink.jpg', 'FishUp Baffi Fly 1.5 Hot Pink', None),
    ],
    'activefishing': [
        ('h01_nories_sofia', 'p06_nories-sofia-sk017.png', 'Nories Sofia 1.2g SK017 Hot Mango 101', None),
        ('h02_khor_frea', 'p04_khor-frea-fc09.png', 'Khor FREA 0.7g FC09', None),
        ('h03_velvetarts_forte_06', 'p02_velvet-arts-forte-06-no31.png', 'Velvet Arts Forte 0.6g No.31', None),
        ('h04_luckycraft_wah33f', 'p09_luckycraft-wah33f.png', 'Lucky Craft x Tiemco WAH 33F 002', None),
        ('h05_timon_chibi_futten', 'p07_timon-chibi-futten-hologram.png', 'Timon Chibi Futten FS Hologram Bait 51mm', None),
    ],
    'moonky': [
        ('h01_coccon_yellow_orange', 'p09_coccon_dc04_yellow_orange.jpg', 'Coccon 42mm DC04 Yellow/Orange fluo', None),
        ('h02_savory_brown_orange', 'p08_savory_dc03_brown_orange.png', 'Savory 43mm DC03 Brown metalic/Orange fluo', None),
        ('h03_savory_green', 'p01_savory_c06_green.png', 'Savory 43mm C06 Green', None),
        ('h04_scelet_pink_bubblegum', 'p03_scelet_c01_pink_bubblegum.jpg', 'Scelet C01 Pink Bubblegum', None),
        ('h05_gradient_blue_pink', 'p10_gumove_nastrahy_category.png', 'Moonky soft lure (category image, blue→pink)', None),
        ('h06_coccon_jr_black', 'p04_coccon_jr_c04_black.png', 'Coccon Jr. 34mm C04 Black', None),
    ],
    'jigovky': [
        ('h01_troutjig_barbless', 'p01_troutjig-barbless.jpg', 'Jig TroutJig Barbless #6 2 g', None),
        ('h02_sickle_classic', 'p08_sickle-classic-2.jpg', 'Jigová hlavička SICKLE Classic #2', None),
        ('h03_hd_barbless_red_detail', 'p07_hd-barbless-red-1-3g.jpg', 'HD BARBLESS #6 RED 1.3 g (head detail)', ('jig_detail', None)),
        ('h04_hd_barbless_fluo_detail', 'p02_hd-barbless-fluo-0-4g.jpg', 'HD BARBLESS #2 FLUO 0.4 g (head detail)', ('jig_detail', None)),
        ('h05_hd_barbless_pink_detail', 'p03_hd-barbless-pink-0-4g.jpg', 'HD BARBLESS #2 PINK 0.4 g (head detail)', ('jig_detail', None)),
    ],
    'velkaryba': [
        ('h01_illex_native_pink_yamame', 'p05_illex-native-spoon-pink-yamame.jpg', 'Illex Native Spoon 2.5 g Pink Yamame', None),
        ('h02_illex_native_copper_trout', 'p06_illex-native-spoon-copper-trout.jpg', 'Illex Native Spoon 3.5 g Copper Trout', None),
        ('h03_daiwa_presso_manhattan', 'p04_daiwa-presso-adm-manhattan.jpg', 'Daiwa Presso ADM 2.2 g Manhattan', None),
        ('h04_daiwa_presso_flashing_green', 'p09_daiwa-presso-adm-flashing-green.jpg', 'Daiwa Presso ADM 3.8 g Flashing Green', None),
        ('h05_shimano_cardiff_roll_swimmer_orange', 'p01_cardiff-roll-swimmer-ce-orange-gold.jpg', 'Shimano Cardiff Roll Swimmer CE 4.5 g Orange Gold', ('drop_small', None)),
    ],
    'bosset': [
        ('h01_zojirushi_orange', 'p07_zojirushi-sm-she-0-6l-orange.jpg', 'Zojirushi SM-SHE 0.6 l orange', None),
        ('h02_zojirushi_black', 'p04_zojirushi-sm-vb-0-6l-black.jpg', 'Zojirushi SM-VB 0.6 l black', None),
        ('h03_zojirushi_mint', 'p01_zojirushi-sm-sr-0-6l-green.jpg', 'Zojirushi SM-SR 0.6 l green', ('silhouette', None)),
        ('h04_zojirushi_pink', 'p02_zojirushi-sm-sr-0-6l-pink.jpg', 'Zojirushi SM-SR 0.6 l pink', ('silhouette', None)),
        ('h05_zojirushi_green_vb', 'p05_zojirushi-sm-vb-0-6l-green.jpg', 'Zojirushi SM-VB 0.6 l green', ('silhouette', None)),
    ],
    'gausseholler': [
        ('h01_revolut8_black_front', 'p05_revolut8_panel_hero.jpg', 'Revolut 8 Standard Edition · Black (front render)', None),
        ('h02_revolut8_black_side', 'p03_revolut8_black_side.jpg', 'Revolut 8 Standard Edition · Black (portrait render)', None),
        ('h03_revolut8_black_threeq', 'p02_revolut8_black_threeq.jpg', 'Revolut 8 Standard Edition · Black (3/4 render)', None),
        ('h04_revolut8_black_top', 'p04_revolut8_black_top.jpg', 'Revolut 8 Standard Edition · Black (top render)', None),
    ],
}


def stage_a():
    os.makedirs(IN, exist_ok=True)
    for key, items in SEL.items():
        od = f'{OUT}/{key}/orig'
        os.makedirs(od, exist_ok=True)
        for slug, src, _, op in items:
            sp = f'{ASSETS}/{key}/{src}'
            shutil.copy(sp, f'{od}/{src}')
            im = load_rgba(sp)
            if key != 'gausseholler':  # renders keep their studio bg; packshots → flatten on white
                bg = Image.new('RGBA', im.size, (255, 255, 255, 255))
                bg.alpha_composite(im)
                im = bg
            if op and op[0] == 'crop_frac':
                x0, y0, x1, y1 = op[1]
                im = im.crop((int(x0 * im.width), int(y0 * im.height), int(x1 * im.width), int(y1 * im.height)))
            if op and op[0] == 'jig_detail':
                im = jig_detail_crop(im)
            im = fit_long_side(im, 2400)
            im.convert('RGB').save(f'{IN}/{key}__{slug}.png')
    print('A done')


def jig_detail_crop(im):
    """Crop to the coloured jig head + eye + last part of the shank (vise excluded)."""
    a = np.array(im.convert('RGB')).astype(int)
    mx, mn = a.max(-1), a.min(-1)
    sat = (mx - mn) > 70
    lab, n = ndi.label(sat)
    sizes = ndi.sum(sat, lab, range(1, n + 1))
    k = int(np.argmax(sizes)) + 1
    ys, xs = np.where(lab == k)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    w, h = x1 - x0, y1 - y0
    d = max(w, h)
    # left bound: past the vise jaw + hook bend (they end at ~33 % of the frame in all Jigovky vise shots)
    return im.crop((int(max(x0 - 5.5 * d, 0.37 * im.width)), int(y0 - 1.2 * d), int(x1 + 0.6 * d), int(y1 + 0.9 * d)))


def stage_b():
    os.makedirs(RAW, exist_ok=True)
    pairs = []
    for f in sorted(os.listdir(IN)):
        o = f'{RAW}/{f}'
        if not os.path.exists(o):
            pairs += [f'{IN}/{f}', o]
    if pairs:
        subprocess.run(['node', f'{BGNODE}/rmbg.mjs', 'medium', *pairs], check=True, cwd=BGNODE)
    print('B done', len(pairs) // 2)


def drop_small(im, frac=0.02):
    a = np.array(im)
    m = a[..., 3] > 30
    lab, n = ndi.label(m, structure=np.ones((3, 3)))
    if n <= 1:
        return im
    sizes = ndi.sum(m, lab, range(1, n + 1))
    keep = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s >= frac * sizes.max()])
    keep = ndi.binary_dilation(keep, iterations=2)
    a[..., 3] = np.where(keep, a[..., 3], 0)
    return Image.fromarray(a, 'RGBA')


def normalise(im, sat=1.08):
    """Consistent look: luminance levels (same gain on all channels → no hue shift), light saturation + sharpen."""
    a = np.array(im).astype(np.float32)
    m = a[..., 3] > 200
    if m.sum() > 100:
        lum = (0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2])[m]
        lo, hi = np.percentile(lum, 0.5), np.percentile(lum, 99.7)
        lo, hi = lo * 0.5, hi + (255 - hi) * 0.5  # half-strength stretch
        g = 255.0 / max(hi - lo, 1)
        a[..., :3] = np.clip((a[..., :3] - lo) * g, 0, 255)
    out = Image.fromarray(a.astype(np.uint8), 'RGBA')
    rgb = ImageEnhance.Color(out.convert('RGB')).enhance(sat)
    rgb = rgb.filter(ImageFilter.UnsharpMask(radius=1.0, percent=35, threshold=3))
    res = rgb.convert('RGBA')
    res.putalpha(out.getchannel('A'))
    return res


def fade_left(im, frac=0.45):
    a = np.array(im)
    w = a.shape[1]
    ramp = np.clip(np.arange(w) / (frac * w), 0, 1) ** 1.5
    a[..., 3] = (a[..., 3] * ramp[None, :]).astype(np.uint8)
    return Image.fromarray(a, 'RGBA')


def white_key(rgb_im, lo=6, span=45):
    """Classic cut-out for packshots on pure white: alpha from distance-to-white + colour decontamination."""
    a = np.array(rgb_im.convert('RGB')).astype(np.float32)
    d = 255.0 - a.min(-1)
    al = np.clip((d - lo) / span, 0, 1)
    # only background connected to the border may become transparent (keeps light details inside the object)
    bgc = ndi.label(al < 0.02)[0]
    border = np.unique(np.concatenate([bgc[0], bgc[-1], bgc[:, 0], bgc[:, -1]]))
    outside = np.isin(bgc, border[border > 0])
    al = np.where(outside, 0, np.maximum(al, ~outside * 1.0 * (al > 0)))
    al = np.where(outside, 0, np.clip(al, 0, 1))
    inner = ndi.binary_erosion(~outside, iterations=3)
    al = np.where(inner, 1.0, al)
    safe = np.maximum(al, 1e-3)[..., None]
    rgb = np.clip((a - (1 - al[..., None]) * 255.0) / safe, 0, 255)
    out = np.dstack([rgb, al * 255]).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')


def silhouette(rgb_im, thr=7):
    """Solid-object cut-out (pastel bottles on white): threshold → close → fill holes → largest blob → 1.2 px feather."""
    a = np.array(rgb_im.convert('RGB')).astype(np.float32)
    m = (255.0 - a.min(-1)) > thr
    m = ndi.binary_closing(m, structure=np.ones((3, 3)), iterations=4)
    m = ndi.binary_fill_holes(m)
    lab, n = ndi.label(m)
    if n > 1:
        sizes = ndi.sum(m, lab, range(1, n + 1))
        m = lab == (int(np.argmax(sizes)) + 1)
    m = ndi.binary_erosion(m, iterations=1)
    al = ndi.gaussian_filter(m.astype(np.float32), 1.0)
    out = np.dstack([a, np.clip(al, 0, 1) * 255]).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')


METHOD = {'alpha_from_src': 'shop_alpha (watermark layer dropped)', 'wm_key': 'ml_isnet + watermark key',
          'silhouette': 'classic silhouette (threshold+fill)', 'jig_detail': 'classic white luma key + shank fade',
          'drop_small': 'ml_isnet + label removal', 'crop_frac': 'ml_isnet (logo cropped off)'}


def describe(im):
    """bbox/aspect, 3 dominant colours (k-means on visible pixels) and a glint point (brightest spot after 6 px blur)."""
    a = np.array(im).astype(np.float32)
    al = a[..., 3] / 255.0
    ys, xs = np.where(al > 0.5)
    px = a[al > 0.5][:, :3]
    rng = np.random.default_rng(0)
    smp = px[rng.choice(len(px), min(len(px), 20000), replace=False)]
    cent = smp[rng.choice(len(smp), 3, replace=False)]
    for _ in range(25):
        lab = ((smp[:, None] - cent[None]) ** 2).sum(-1).argmin(1)
        cent = np.array([smp[lab == k].mean(0) if (lab == k).any() else cent[k] for k in range(3)])
    share = np.bincount(lab, minlength=3) / len(lab)
    order = np.argsort(-share)
    lum = 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]
    lum = ndi.gaussian_filter(lum * (al > 0.9), 6)
    gy, gx = np.unravel_index(np.argmax(lum), lum.shape)
    return {'bbox': [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1],
            'aspect': round(im.width / im.height, 3),
            'dominant': [{'hex': '#%02x%02x%02x' % tuple(int(v) for v in cent[k]), 'share': round(float(share[k]), 3)} for k in order],
            'glint': [round(gx / im.width, 3), round(gy / im.height, 3)]}


def split_faces(im, base, hd, key, meta_list, name, src):
    """Two separate spoons in one packshot → <slug>_back.png (no hook) / <slug>_front.png (with hook)."""
    a = np.array(im)
    lab, n = ndi.label(a[..., 3] > 30, structure=np.ones((3, 3)))
    if n < 2:
        return
    sizes = ndi.sum(a[..., 3] > 30, lab, range(1, n + 1))
    top2 = np.argsort(-sizes)[:2] + 1
    comps = []
    for k in top2:
        m = ndi.binary_dilation(lab == k, iterations=2)
        b = a.copy(); b[..., 3] = np.where(m, a[..., 3], 0)
        comps.append(trim(Image.fromarray(b, 'RGBA'), pad_frac=0.03, thr=12))
    comps.sort(key=lambda c: c.width * c.height)  # hook makes the front face's bbox bigger
    for face, c in zip(('back', 'front'), comps):
        p = f'{hd}/{base}_{face}.png'
        c.save(p, optimize=True)
        meta_list.append({'file': f'{key}/heroes/{base}_{face}.png', 'product': f'{name} — {face} face',
                          'source': f'assets/{key}/{src}', 'size': list(c.size), **describe(c)})


def stage_c():
    meta = {}
    for key, items in SEL.items():
        hd = f'{OUT}/{key}/heroes'
        os.makedirs(hd, exist_ok=True)
        meta[key] = []
        for slug, src, name, op in items:
            im = Image.open(f'{RAW}/{key}__{slug}.png').convert('RGBA')
            src_in = Image.open(f'{IN}/{key}__{slug}.png').convert('RGB')
            kind = op[0] if op else None
            if kind == 'alpha_from_src':  # shop PNG already transparent; its watermark is a semi-transparent grey layer
                orig = fit_long_side(load_rgba(f'{ASSETS}/{key}/{src}'), 2400)
                oa = np.array(orig)[..., 3]
                core = ndi.binary_dilation(oa > 200, iterations=2)
                arr = np.array(im)
                arr[..., 3] = np.where(core, oa, 0)
                arr[..., :3] = np.array(orig)[..., :3]
                im = Image.fromarray(arr, 'RGBA')
            if kind == 'wm_key':  # light-grey watermark letters behind the lures (JPG on white)
                rgb = np.array(src_in).astype(int)
                wm = (rgb.min(-1) > 185) & ((rgb.max(-1) - rgb.min(-1)) < 22)
                arr = np.array(im)
                arr[..., 3] = np.where(wm, 0, arr[..., 3])
                im = Image.fromarray(arr, 'RGBA')
            if kind == 'silhouette':
                im = silhouette(src_in)
            if kind == 'jig_detail':
                im = white_key(src_in)
            if key == 'moonky':  # strip semi-transparent white haze the matting keeps around soft plastic
                arr = np.array(im).astype(int)
                haze = (arr[..., 3] < 170) & (arr[..., :3].min(-1) > 195) & ((arr[..., :3].max(-1) - arr[..., :3].min(-1)) < 30)
                arr[..., 3] = np.where(haze, 0, arr[..., 3])
                im = Image.fromarray(arr.astype(np.uint8), 'RGBA')
            im = drop_small(im, 0.06 if kind == 'drop_small' else 0.01)
            if op and op[0] == 'jig_detail':
                im = fade_left(trim(im))
            im = trim(im, pad_frac=0.03, thr=12)
            im = normalise(im, 1.06 if key in ('gausseholler', 'bosset') else 1.08)
            im = fit_long_side(im, 2000)
            p = f'{hd}/{slug}.png'
            im.save(p, optimize=True)
            meta[key].append({'file': f'{key}/heroes/{slug}.png', 'product': name, 'source': f'assets/{key}/{src}',
                              'size': list(im.size), 'method': METHOD.get(kind, 'ml_isnet'), **describe(im)})
            if key == 'velkaryba' and 'cardiff' in slug:
                split_faces(im, slug, hd, key, meta[key], name, src)
    json.dump(meta, open(f'{OUT}/_heroes_notes.json', 'w'), indent=1, ensure_ascii=False)
    print('C done')


if __name__ == '__main__':
    st = sys.argv[1] if len(sys.argv) > 1 else 'all'
    if st in ('A', 'all'):
        stage_a()
    if st in ('B', 'all'):
        stage_b()
    if st in ('C', 'all'):
        stage_c()
