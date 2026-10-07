# Фото -> графика (без нейро-отрисовки): детерминированные фильтры по пикселям.
#   bg:  дуотон палитры TA (navy -> blue -> ice) + постеризация + растровые точки (halftone)
#   fg:  вырезанная фигура (hyperframes remove-background), постер-заливка 6 уровней + тёмный контур + белая обводка-стикер
#   ph:  исходное фото того же кадрирования (для стартового «живого» состояния)
# Геометрия не меняется — лица не искажаются. Выход: proto/assets/gfx/<name>_{bg,fg}.{jpg,png}
import os, sys, json
STICKER = True
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = os.path.join(os.path.dirname(__file__), '..')
PH, CUT, OUT = (os.path.join(ROOT, 'proto/assets', d) for d in ('photos', 'cut', 'gfx'))
os.makedirs(OUT, exist_ok=True)

NAVY, BLUE, ICE, RED = (np.array(c, float) for c in ((11, 30, 66), (48, 66, 133), (238, 242, 249), (227, 30, 36)))
MID = np.array((96, 140, 214), float)

def lum(a):
    return (0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]) / 255.0

def duotone(L, levels=5):
    # кривая контраста + постеризация, затем градиент navy-blue-mid-ice
    L = np.clip((L - 0.08) / 0.84, 0, 1) ** 0.9
    q = np.round(L * (levels - 1)) / (levels - 1)
    stops = [(0, NAVY), (0.4, BLUE), (0.72, MID), (1, ICE)]
    out = np.zeros(L.shape + (3,))
    for (a, ca), (b, cb) in zip(stops, stops[1:]):
        m = (q >= a) & (q <= b)
        t = ((q - a) / (b - a))[m][:, None]
        out[m] = ca * (1 - t) + cb * t
    return out, L

def halftone(img, L, cell, ink=NAVY, angle=0.4):
    h, w = L.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    c, s = np.cos(angle), np.sin(angle)
    u, v = xx * c + yy * s, -xx * s + yy * c
    du, dv = (u % cell) - cell / 2, (v % cell) - cell / 2
    d = np.sqrt(du ** 2 + dv ** 2)
    Lb = ndimage.uniform_filter(L, size=cell)
    r = (1 - Lb) * cell * 0.62
    m = np.clip(r - d + 0.5, 0, 1)[..., None] * 0.55  # мягкий край точки
    return img * (1 - m) + ink * m

def edges(L, sigma=1.4):
    g = ndimage.gaussian_filter(L, sigma)
    e = np.hypot(ndimage.sobel(g, 0), ndimage.sobel(g, 1))
    e = np.clip((e - 0.12) / 0.25, 0, 1)
    return e

def make(name, maxside=1920):
    src = Image.open(os.path.join(PH, name + '.jpg')).convert('RGB')
    a = np.asarray(src, float)
    L = lum(a)
    cell = max(7, round(min(src.size) / 150))
    # --- фон-графика
    duo, Lc = duotone(L)
    bg = halftone(duo, Lc, cell)
    bg = bg * (1 - edges(L, 2.0)[..., None] * 0.45) + NAVY * edges(L, 2.0)[..., None] * 0.45
    Image.fromarray(np.clip(bg, 0, 255).astype(np.uint8)).save(os.path.join(OUT, name + '_bg.jpg'), quality=90)
    # --- фигура-стикер
    cp = os.path.join(CUT, name + '.png')
    if not os.path.exists(cp):
        return {'fg': False}
    cut = Image.open(cp).convert('RGBA').resize(src.size)
    A = np.asarray(cut, float)[..., 3] / 255.0
    A = ndimage.binary_opening(A > 0.5, iterations=2).astype(float) * A
    lab, n = ndimage.label(A > 0.5)
    if n > 1:  # убрать мелкие обрывки
        sizes = ndimage.sum(A > 0.5, lab, range(1, n + 1))
        keep = np.isin(lab, 1 + np.where(sizes >= sizes.max() * 0.04)[0])
        A = A * ndimage.binary_dilation(keep, iterations=3)
    # постер-заливка: 6 уровней на канал + насыщенность, тёмный контур
    rgb = a.copy()
    gray = L[..., None] * 255
    rgb = np.clip(gray + (rgb - gray) * 1.25, 0, 255)
    q = np.round(rgb / 255 * 5) / 5 * 255
    rgb = q * 0.75 + rgb * 0.25
    e = edges(L, 1.2)[..., None]
    rgb = rgb * (1 - e * 0.7) + NAVY * e * 0.7
    # белая обводка-стикер + тонкая навигационная кромка
    rad = max(6, round(min(src.size) / 110))
    hard = A > 0.5
    stroke = ndimage.binary_dilation(hard, iterations=rad)
    rim = ndimage.binary_dilation(stroke, iterations=max(2, rad // 3)) & ~stroke
    out = np.zeros(a.shape[:2] + (4,))
    if STICKER:
        out[stroke] = (*ICE, 255)
        out[rim] = (*NAVY, 255)
    m = A[..., None]
    out[..., :3] = out[..., :3] * (1 - m) + rgb * m
    out[..., 3] = np.maximum(out[..., 3], A * 255)
    ys, xs = np.where(out[..., 3] > 8)
    bbox = [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1]
    img = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), 'RGBA')
    img.save(os.path.join(OUT, name + ('_fg.png' if STICKER else '_fgc.png')), optimize=True)
    w, h = src.size
    return {'fg': True, 'bbox': [bbox[0] / w, bbox[1] / h, bbox[2] / w, bbox[3] / h]}

if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if a != '--clean']
    STICKER = '--clean' not in sys.argv
    names = args or sorted(f[:-4] for f in os.listdir(PH) if f.endswith('.jpg'))
    meta_p = os.path.join(ROOT, 'proto/assets/gfx.json')
    meta = json.load(open(meta_p)) if os.path.exists(meta_p) else {}
    for n in names:
        meta[n] = make(n)
        print(n, meta[n])
    json.dump(meta, open(meta_p, 'w'), indent=1)
