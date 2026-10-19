"""Activefishing ad cut-outs (2026-10-19). Reuses velkaryba_ad/cut.py (ISNet trimap + white unmixing + topology).
usage: python3 cut_af.py <isnet_dir> [names...]
ISNet mattes: scratchpad bgnode `node rmbg.mjs medium <src> <isnet_dir>/<stem>.png` for every source in ads/_src.
"""
import sys, os, json
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'velkaryba_ad'))
from cut import cutout3, trim_pad, contact_shadow2

P = '/home/user/Clipcreator/projects/mcr-2026-sponzori'
SRC = f'{P}/assets_prep/activefishing/ads/_src'
OUT = f'{P}/assets_prep/activefishing/ads'
ISN = sys.argv[1]


def load(stem, ext):
    rgb = np.asarray(Image.open(f'{SRC}/{stem}.{ext}').convert('RGB')).astype(np.float32)
    ia = np.asarray(Image.open(f'{ISN}/{stem}.png').convert('RGBA').resize((rgb.shape[1], rgb.shape[0])))[..., 3]
    return rgb, ia


def fit(im, long):
    s = long / max(im.size)
    if s < 1:
        im = im.convert('RGBa').resize((round(im.width * s), round(im.height * s)), Image.LANCZOS).convert('RGBA')
    return im


def clear_plastic(im_rgba, rgb, region, amin=0.30, white=255.0):
    """Translucent lip: inside `region` (bool mask) alpha = max(amin, unmix-vs-white), colour unmixed.
    Keeps a frosted, see-through lip instead of an opaque milky one."""
    a = np.asarray(im_rgba).astype(np.float32)
    dark = np.max(white - rgb, axis=2)
    au = np.clip(dark / 90.0, 0, 1)                      # how much the plastic darkens the paper
    al = np.maximum(amin, au)
    al = ndi.gaussian_filter(al, 1.0)
    reg = ndi.gaussian_filter(region.astype(np.float32), 1.5)
    alpha = a[..., 3] / 255.0
    new_a = alpha * (1 - reg) + np.minimum(alpha, al) * reg
    col = (rgb - (1 - new_a[..., None]) * white) / np.maximum(new_a[..., None], 1e-3)
    col = np.clip(col, 0, 255)
    rgbo = a[..., :3] * (1 - reg[..., None]) + col * reg[..., None]
    out = np.dstack([rgbo, new_a * 255]).round().clip(0, 255).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')


def fill_enclosed(im_rgba, rgb, keep_lowest_big=True, big=20000):
    """Fill enclosed transparent pockets (white label print, letter counters) from the source colour;
    keep only the lowest big pocket (see-through clear flange) transparent."""
    a = np.asarray(im_rgba).astype(np.float32)
    al = a[..., 3] / 255
    tr = al < 0.5
    lab, n = ndi.label(tr)
    edge = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    idx = np.arange(1, n + 1)
    sz = ndi.sum(np.ones_like(al), lab, idx)
    com = ndi.center_of_mass(np.ones_like(al), lab, idx)
    enc = [i for i in idx if i not in edge]
    keep = set()
    if keep_lowest_big:
        bigs = [i for i in enc if sz[i - 1] > big]
        if bigs:
            keep.add(max(bigs, key=lambda i: com[i - 1][0]))
    fill = np.isin(lab, [i for i in enc if i not in keep])
    fill = ndi.binary_dilation(fill, iterations=2) & (al < 0.999) & ~np.isin(lab, list(keep) + list(edge[edge > 0]))
    a[..., 3] = np.where(fill, 255, a[..., 3])
    a[..., :3] = np.where(fill[..., None], rgb, a[..., :3])
    print('  filled pockets', len(enc) - len(keep), 'kept', len(keep))
    return Image.fromarray(a.round().clip(0, 255).astype(np.uint8), 'RGBA')


def open_white(im, min_px=30, skip=(), boxes=(), thr=22, soft=40):
    """Open paper-white holes that the topology rule filled (line-tie eyes, hook-hanger eyes, spoon holes).
    Auto: opaque near-white components >= min_px (except bboxes in `skip`); plus explicit `boxes`."""
    a = np.asarray(im).astype(np.float32)
    al = a[..., 3] / 255
    dark = np.max(255 - a[..., :3], 2)
    m = (al > 0.9) & (dark < thr)
    lab, n = ndi.label(m)
    reg = np.zeros(al.shape, bool)
    for i, s in enumerate(ndi.find_objects(lab), 1):
        if s is None:
            continue
        x0, y0, x1, y1 = s[1].start, s[0].start, s[1].stop, s[0].stop
        if (lab[s] == i).sum() < min_px:
            continue
        if any(abs(x0 - k[0]) < 4 and abs(y0 - k[1]) < 4 for k in skip):
            continue
        reg |= ndi.binary_dilation(lab == i, iterations=4)
    H, W = al.shape
    for x0, y0, x1, y1 in boxes:
        bm = np.zeros_like(reg); bm[y0:y1, x0:x1] = True
        reg |= bm & (dark < 120)
        reg |= ndi.binary_dilation(bm & (dark < thr), iterations=4) & bm
    na = ndi.gaussian_filter(np.clip((dark - 10) / soft, 0, 1), 1.2)
    new_a = np.where(reg, np.minimum(al, na), al)
    col = np.clip((a[..., :3] - (1 - new_a[..., None]) * 255) / np.maximum(new_a[..., None], 1e-3), 0, 255)
    rgb = np.where(reg[..., None], col, a[..., :3])
    print('  opened px', int((reg & (new_a < 0.5)).sum()))
    return Image.fromarray(np.dstack([rgb, new_a * 255]).round().clip(0, 255).astype(np.uint8), 'RGBA')


def decontaminate(im, erode=2, reach=5, choke=0.08):
    """Kill light halos from the upscaler haze / paper white: edge pixels take the colour of the nearest solid
    interior pixel (within `reach` px), and the soft alpha edge is choked slightly."""
    a = np.asarray(im).astype(np.float32)
    al = a[..., 3] / 255
    solid = al > 0.97
    interior = ndi.binary_erosion(solid, iterations=erode)
    dist, (iy, ix) = ndi.distance_transform_edt(~interior, return_indices=True)
    near = a[iy, ix, :3]
    use = (~interior) & (al > 0) & (dist <= reach)
    rgb = np.where(use[..., None], near, a[..., :3])
    na = np.clip((al - choke) / (1 - choke), 0, 1)
    return Image.fromarray(np.dstack([rgb, na * 255]).round().clip(0, 255).astype(np.uint8), 'RGBA')


def save(im, name, shadow=False):
    im.save(f'{OUT}/{name}.png', optimize=True)
    if shadow:
        contact_shadow2(im).save(f'{OUT}/{name}_shadow.png', optimize=True)
    print(name, im.size)


def run(stem, ext, name, long, keep_boxes=None, lip=None, shadow=False, fill=False, holes=None, decon=True, **kw):
    rgb, ia = load(stem, ext)
    im, info = cutout3(rgb, ia, keep_boxes=keep_boxes, white=np.array([255, 255, 255], np.float32), **kw)
    if lip is not None:
        H, W = ia.shape
        yy, xx = np.mgrid[0:H, 0:W]
        x0, y0, x1, y1 = [int(v * (W if i % 2 == 0 else H)) for i, v in enumerate(lip)]
        reg = (xx >= x0) & (xx < x1) & (yy >= y0) & (yy < y1) & (np.asarray(im)[..., 3] > 0)
        im = clear_plastic(im, rgb, reg)
    print('  topo', info)
    if fill:
        im = fill_enclosed(im, rgb)
    im = fit(trim_pad(im, 16), long)
    if holes is not None:
        im = open_white(im, **holes)
    if decon:
        im = decontaminate(im)
    save(im, name, shadow)
    return im


JOBS = {
    # heroes (Higgsfield 4k upscales)
    'chibi_chart': dict(stem='af_chibi_tropchartpink_hf4k', ext='png', name='H1_timon_chibi_futten_fs_tropical_chart_pink', long=2400, shadow=True, min_frac=0.00005, holes={}),
    'sofia': dict(stem='af_sofia_sk017_hf4k', ext='png', name='H2_nories_sofia_1-2g_sk017_hot_mango_pair', long=2400, shadow=True, min_frac=0.00005, holes={'min_px': 20}),
    'varivas': dict(stem='varivas_es2_natural_orig', ext='jpg', name='H3_varivas_super_trout_area_es2_ester_natural', long=1500, shadow=True, min_frac=0.0002, fill=True, decon=False),
    # secondary (native size)
    'chibi_cobalt': dict(stem='af_chibi_uvcobalt_orig', ext='jpg', name='S1_timon_chibi_futten_fs_uv_cobalt_blue', long=800, min_frac=0.0002, holes={'min_px': 20}),
    'chibi_red': dict(stem='af_chibi_redblackglitter_orig', ext='jpg', name='S2_timon_chibi_futten_fs_red_black_glitter', long=800, min_frac=0.0002, holes={'min_px': 20}),
    'chibi_gold': dict(stem='af_chibi_goldshower_orig', ext='jpg', name='S3_timon_chibi_futten_fs_gold_shower', long=800, min_frac=0.0002, holes={'min_px': 20}),
    'chibi_holo': dict(stem='chibi_hologram_orig', ext='jpg', name='S4_timon_chibi_futten_fs_hologram_bait', long=800, min_frac=0.0002, holes={'min_px': 20}),
    'mukai': dict(stem='af_mukai_zanmu_6ck_orig', ext='png', name='S7_mukai_upward_zanmu_35s_6ck', long=1800, min_frac=0.0001, holes={'min_px': 40}),
    'scheila': dict(stem='af_valkein_scheila_80_orig', ext='png', name='S8_valkein_scheila_1-8g_no80_delicious_peach', long=640, min_frac=0.0005, holes={'min_px': 30}),
    'forte': dict(stem='forte15_no1_orig', ext='png', name='S5_velvet_arts_forte_1-5g_no1', long=600, min_frac=0.0005, holes={'skip': [(196, 226)]}),
}

def micro_panicra():
    """S6: the shop's own transparent PNG (p08) — only trimmed + decontaminated, native size."""
    im = Image.open(f'{P}/assets/activefishing/p08_timon-micro-panicra-yazy.png').convert('RGBA')
    im = decontaminate(trim_pad(im, 16), erode=1, reach=3, choke=0.04)
    save(im, 'S6_timon_micro_panicra_mr-f_rattle_yazy_pellet_san')


if __name__ == '__main__':
    which = sys.argv[2:] or list(JOBS) + ['panicra']
    for k in which:
        print('==', k)
        micro_panicra() if k == 'panicra' else run(**JOBS[k])
