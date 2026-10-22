"""FT Fishing ad cut-outs (MČR 2026, 22. 10. 2026). Same chain as activefishing_ad/cut_af.py:
ISNet trimap + white unmixing + topology (velkaryba_ad/cut.py::cutout3) -> open_white (line-tie holes) -> decontaminate.
usage: python3 -I cut_ft.py <isnet_dir> [job ...]
Inputs: assets_prep/ftfishing/ads/_src/<stem>.png (isolate.py: logos/badges/text of the shop photo removed),
        ISNet mattes: node scratchpad/bgnode/rmbg.mjs medium <src> <isnet_dir>/<stem>.png
Output: assets_prep/ftfishing/ads/<name>.png (+ _shadow.png for heroes), manifest via sheet_ft.py."""
import sys, os, json
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'velkaryba_ad'))
sys.path.insert(0, os.path.join(HERE, '..', 'activefishing_ad'))
from cut import cutout3, trim_pad, contact_shadow2
import cut_af
from cut_af import open_white, decontaminate, fill_enclosed

P = '/home/user/Clipcreator/projects/mcr-2026-sponzori'
SRC = f'{P}/assets_prep/ftfishing/ads/_src'
OUT = f'{P}/assets_prep/ftfishing/ads'
ISN = sys.argv[1]
BG = json.load(open(f'{SRC}/bg.json'))


def fit(im, long):
    s = long / max(im.size)
    if s < 1:
        im = im.convert('RGBa').resize((round(im.width * s), round(im.height * s)), Image.LANCZOS).convert('RGBA')
    return im


def disk(r):
    y, x = np.mgrid[-r:r + 1, -r:r + 1]
    return x * x + y * y <= r * r


def underside_ghost(img, al, o, d=40):
    """Copied from moonky_ad/cut_moonky.py (table reflection / contact shadow glued to the underside by ISNet):
    pale low-chroma pixels of a coloured body with background within d px below, touching the background."""
    from scipy import ndimage as ndi
    solid = al > 0.5
    L = img @ np.array([0.299, 0.587, 0.114], np.float32)
    C = img.max(2) - img.min(2)
    core = ndi.binary_erosion(solid, iterations=10)
    Lm, Cm = np.median(L[core]), np.median(C[core])
    cand = (C < o.get('ghost_c', 0.6) * Cm) & (L > Lm + o.get('ghost_dl', 0))
    outside = ~solid
    below = np.zeros_like(solid)
    for k in range(1, d + 1):
        below[:-k] |= outside[k:]
    if o.get('any_side'):
        above = np.zeros_like(solid)
        for k in range(1, d + 1):
            above[k:] |= outside[:-k]
        below |= above
    cand &= solid & below
    lab, n = ndi.label(cand)
    if not n:
        return al, 0
    touch = np.unique(lab[ndi.binary_dilation(outside, iterations=1) & cand])
    touch = touch[touch > 0]
    ghost = np.isin(lab, touch)
    ghost = ndi.binary_dilation(ghost, iterations=1) & solid
    al2 = np.where(ghost, 0.0, al)
    R = ndi.binary_dilation(ghost, iterations=14)
    sol = al2 > 0.5
    r = o.get('ghost_open', 4)
    sol_s = ndi.binary_closing(ndi.binary_opening(sol, structure=disk(r)), structure=disk(2))
    sm = np.clip(ndi.gaussian_filter(sol_s.astype(np.float32), 1.0), 0, 1)
    al2 = np.where(R, np.where(sol_s & (al2 > 0.97), 1.0, np.minimum(sm, np.maximum(al2, sm * (sol_s)))), al2)
    al2 = np.where(R & ~ndi.binary_dilation(sol_s, iterations=2), 0.0, al2)
    return al2, int(ghost.sum())


def apply_ghost(im, o):
    a = np.asarray(im).astype(np.float32)
    al, n = underside_ghost(a[..., :3], a[..., 3] / 255, o, d=o.get('d', 40))
    print('  ghost px', n)
    return Image.fromarray(np.dstack([a[..., :3], al * 255]).round().clip(0, 255).astype(np.uint8), 'RGBA')


def erase_pale(im, box, lmin=165, cmax=45):
    """Erase pale low-chroma pixels (table reflection) inside box (x0,y0,x1,y1) of the final image."""
    from scipy import ndimage as ndi
    a = np.asarray(im).astype(np.float32)
    x0, y0, x1, y1 = box
    sub = a[y0:y1, x0:x1]
    L = sub[..., :3] @ np.array([0.299, 0.587, 0.114], np.float32)
    C = sub[..., :3].max(2) - sub[..., :3].min(2)
    m = (L > lmin) & (C < cmax)
    m = ndi.binary_dilation(m, iterations=1)
    sub[..., 3] = np.where(m, 0, sub[..., 3])
    a[y0:y1, x0:x1] = sub
    print('  erased pale', int(m.sum()))
    return Image.fromarray(a.round().clip(0, 255).astype(np.uint8), 'RGBA')


def punch_eye(im, cx, cy, r, ring=None, ring_w=11, feather=1.5):
    """Spoon line-tie eye as a clean round hole (the upscaler painted reflections into it);
    optional ring of width ring_w in colour `ring` (the painted rim of the hole) with a soft dark inner edge."""
    a = np.asarray(im).astype(np.float32)
    yy, xx = np.mgrid[0:a.shape[0], 0:a.shape[1]]
    d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    if ring is not None:
        w = np.clip((r + ring_w - d) / 2.0, 0, 1)[..., None]
        shade = np.clip(1 - 0.35 * np.clip((r + 4 - d) / 4, 0, 1), 0.65, 1)[..., None]
        a[..., :3] = a[..., :3] * (1 - w) + np.array(ring, np.float32) * shade * w
    k = np.clip((d - r) / feather, 0, 1)
    a[..., 3] *= k
    return Image.fromarray(a.round().clip(0, 255).astype(np.uint8), 'RGBA')


def recolor_pale(im, box, rgb, lmin=170, cmax=50):
    """Pale low-chroma rim inside box -> given colour (spoon edge thickness instead of a white sliver)."""
    a = np.asarray(im).astype(np.float32)
    x0, y0, x1, y1 = box
    sub = a[y0:y1, x0:x1]
    L = sub[..., :3] @ np.array([0.299, 0.587, 0.114], np.float32)
    C = sub[..., :3].max(2) - sub[..., :3].min(2)
    m = (L > lmin) & (C < cmax) & (sub[..., 3] > 10)
    sub[..., :3] = np.where(m[..., None], np.array(rgb, np.float32), sub[..., :3])
    a[y0:y1, x0:x1] = sub
    print('  recoloured', int(m.sum()))
    return Image.fromarray(a.round().clip(0, 255).astype(np.uint8), 'RGBA')


def recolor_pale_near_yellow(im, rgb, reach=10, lmin=150, cmax=70):
    """Pale low-chroma rim pixels next to the fluo-yellow paint -> spoon edge colour (no white sliver on dark)."""
    from scipy import ndimage as ndi
    a = np.asarray(im).astype(np.float32)
    c = a[..., :3]
    yel = (c[..., 0] > 170) & (c[..., 1] > 170) & (c[..., 2] < 110) & (a[..., 3] > 200)
    near = ndi.binary_dilation(yel, iterations=reach)
    L = c @ np.array([0.299, 0.587, 0.114], np.float32)
    C = c.max(2) - c.min(2)
    m = near & ~yel & (L > lmin) & (C < cmax) & (a[..., 3] > 10)
    a[..., :3] = np.where(m[..., None], np.array(rgb, np.float32), c)
    print('  rim recoloured', int(m.sum()))
    return Image.fromarray(a.round().clip(0, 255).astype(np.uint8), 'RGBA')


def clear_box(im, box, lmin=95, cmax=60):
    """Inside box: light, low-chroma pixels (hole seen through: paper white / grey reflections) -> transparent;
    dark wire (split ring, hook eye) stays."""
    from scipy import ndimage as ndi
    a = np.asarray(im).astype(np.float32)
    x0, y0, x1, y1 = box
    sub = a[y0:y1, x0:x1]
    L = sub[..., :3] @ np.array([0.299, 0.587, 0.114], np.float32)
    C = sub[..., :3].max(2) - sub[..., :3].min(2)
    m = (L > lmin) & (C < cmax)
    soft = np.clip((L - lmin) / 25, 0, 1) * m
    sub[..., 3] = sub[..., 3] * (1 - soft)
    a[y0:y1, x0:x1] = sub
    print('  cleared', int(m.sum()))
    return Image.fromarray(a.round().clip(0, 255).astype(np.uint8), 'RGBA')


def run(stem, name, long, shadow=False, holes=None, fill=False, decon=True, ghost=None, post=None, decon_kw=None, **kw):
    rgb = np.asarray(Image.open(f'{SRC}/{stem}.png').convert('RGB')).astype(np.float32)
    ia = np.asarray(Image.open(f'{ISN}/{stem}.png').convert('RGBA').resize((rgb.shape[1], rgb.shape[0])))[..., 3]
    white = np.array(BG[stem]['bg'], np.float32)
    im, info = cutout3(rgb, ia, white=white, **kw)
    print(' ', name, 'topo', info)
    if fill:
        im = fill_enclosed(im, rgb)
    im = fit(trim_pad(im, 16), long)
    if holes is not None:
        im = open_white(im, **holes)
    if ghost is not None:
        im = apply_ghost(im, ghost)
    if decon:
        im = decontaminate(im, **(decon_kw or {}))
    for fn, args in (post or []):
        im = globals()[fn](im, *args)
    im.save(f'{OUT}/{name}.png', optimize=True)
    if shadow:
        contact_shadow2(im).save(f'{OUT}/{name}_shadow.png', optimize=True)
    print(' ', name, im.size)


JOBS = {
    # heroes (Higgsfield 4k, bytedance)
    'H1': dict(stem='h_p01_impulse_hf4k', name='H1_spinmad_impulse_pro_10g_3907_firetiger', long=2400, shadow=True, min_frac=0.00005, holes={'min_px': 60}, ghost={'ghost_c': 0.45, 'any_side': True, 'd': 30, 'ghost_open': 6},
               post=[('erase_pale', [(0, 430, 2400, 605), 175, 45]), ('erase_pale', [(770, 580, 890, 640), 160, 60])], decon_kw={'erode': 2, 'reach': 8, 'choke': 0.15}),
    'H2': dict(stem='h_c03_vibrofat_hf4k', name='H2_crazyfish_vibro_fat_4in_09_caramel', long=2400, shadow=True, min_frac=0.0005),
    'H3': dict(stem='h_f02_totem_hf4k', name='H3_favorite_totem_2000s_reel', long=2400, shadow=True, min_frac=0.00005),
    'H4': dict(stem='h_f03_x1_hf4k', name='H4_favorite_x1_2000s_reel', long=2400, shadow=True, min_frac=0.00005),
    'H5': dict(stem='h_p03_target_hf4k', name='H5_spinmad_target_spoon_1-5g_3201_pair', long=1800, shadow=True, min_frac=0.00005, holes={'min_px': 40},
               post=[('recolor_pale', [(600, 60, 760, 640), (128, 128, 18)]), ('recolor_pale_near_yellow', [(150, 152, 20)]), ('recolor_pale', [(380, 700, 660, 1080), (150, 152, 20), 140, 70]),
                    ('clear_box', [(290, 985, 350, 1040)]), ('clear_box', [(225, 1150, 320, 1245)]), ('clear_box', [(320, 1060, 395, 1105), 150, 50]), ('punch_eye', [576, 108, 27, (222, 232, 10)])]),
    # secondary (native size)
    'S1': dict(stem='p02_impulse_pro_lime', name='S1_spinmad_impulse_pro_10g_3908_electric_lime', long=900, min_frac=0.0002, holes={'min_px': 12}),
    'S2': dict(stem='p04_hart_spicy_firetiger', name='S2_spinmad_hart_9g_spicy_blade_3705_firetiger', long=1100, min_frac=0.0002, holes={'min_px': 12}),
    'S3': dict(stem='p07_king_14g_3801', name='S3_spinmad_king_14g_spicy_blade_3801', long=1300, min_frac=0.0002, holes={'min_px': 12}),
    'S4': dict(stem='c05_scalp_minnow_6', name='S4_crazyfish_scalp_minnow_100_06_chartreuse', long=600, min_frac=0.001, ghost={'ghost_c': 0.6, 'd': 30}),
    'S5': dict(stem='c01_nimble_5cm_14', name='S5_crazyfish_nimble_50_14_motor_oil', long=600, min_frac=0.001, ghost={'ghost_c': 0.6, 'd': 30}),
    'S6': dict(stem='c02_polaris_68_4d', name='S6_crazyfish_polaris_68_4d_pair', long=700, min_frac=0.001),
    'S7': dict(stem='c04_glider_5_kiwi', name='S7_crazyfish_glider_55_20_kiwi', long=600, min_frac=0.001, decon_kw={'erode': 2, 'reach': 6, 'choke': 0.35}),
    'S8': dict(stem='c06_comet_75_20', name='S8_crazyfish_comet_2-5in_20_kiwi', long=600, min_frac=0.001),
    # S9 Nano Minnow 70 3D dropped: grey studio background, the ghost removal ate the belly (QA 22. 10.)
    # 'S9': dict(stem='p06_nano_minnow_3d', name='S9_crazyfish_nano_minnow_70_3d', long=600, min_frac=0.001, ghost={'ghost_c': 0.6, 'd': 30}),
    'S10': dict(stem='f04_rod_arena_stream', name='S10_favorite_arena_stream_arns1_rod', long=1200, min_frac=0.0002),
    'S11': dict(stem='f03_reel_x1_2000s', name='S11_favorite_x1_2000s_reel_native', long=1000, min_frac=0.0002),
}

if __name__ == '__main__':
    which = sys.argv[2:] or list(JOBS)
    for k in which:
        j = JOBS[k]
        if not os.path.exists(f"{SRC}/{j['stem']}.png"):
            print('skip', k); continue
        print('==', k); run(**j)
