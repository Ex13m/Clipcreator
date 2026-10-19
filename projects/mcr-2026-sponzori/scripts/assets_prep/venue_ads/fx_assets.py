"""Venue block helper textures (deterministic, offline):
  assets_prep/venue/ads/fx_caustics.png        tileable 768² caustic light web (white, alpha = intensity) for screen-blended water light
  assets_prep/venue/ads/fx_island_water_a.png  water mask of h1_pond_island_3d.png as ALPHA (CSS mask-image needs alpha), padded to 1863×1870
Run: python3 scripts/assets_prep/venue_ads/fx_assets.py   (from projects/mcr-2026-sponzori)"""
import numpy as np
from PIL import Image, ImageFilter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
ADS = ROOT / 'assets_prep/venue/ads'


def caustics(N=768, n=26, seed=7):
    rng = np.random.default_rng(seed)
    yy, xx = np.mgrid[0:N, 0:N].astype(np.float32) / N
    tp = 2 * np.pi   # periodic domain warp (keeps the tile seamless) → curved, liquid cell walls
    xx, yy = (xx + 0.035 * np.sin(tp * (2 * yy + 0.3)) + 0.02 * np.sin(tp * (3 * xx + 3 * yy)),
              yy + 0.035 * np.sin(tp * (2 * xx + 0.7)) + 0.02 * np.sin(tp * (4 * xx - 2 * yy)))
    out = np.zeros((N, N), np.float32)
    for octave, (cnt, w, k) in enumerate([(n, 1.0, 34.0), (n * 2, 0.55, 46.0)]):
        pts = rng.random((cnt, 2)).astype(np.float32)
        f1 = np.full((N, N), 9.0, np.float32); f2 = np.full((N, N), 9.0, np.float32)
        for px, py in pts:
            for ox in (-1, 0, 1):
                for oy in (-1, 0, 1):
                    d = np.hypot(xx - (px + ox), yy - (py + oy))
                    m = d < f1
                    f2 = np.where(m, f1, np.minimum(f2, d)); f1 = np.where(m, d, f1)
        edge = np.exp(-(f2 - f1) * k * (cnt / n) ** 0.5)
        out += w * edge
    out = out / out.max()
    out = np.clip((out - 0.12) / 0.88, 0, 1) ** 1.6
    a = (out * 255).astype(np.uint8)
    im = Image.fromarray(a, 'L').filter(ImageFilter.GaussianBlur(1.2))
    rgba = Image.merge('RGBA', (Image.new('L', im.size, 255),) * 3 + (im,))
    rgba.save(ADS / 'fx_caustics.png', optimize=True)


def island_alpha():
    m = Image.open(ADS / 'h1_pond_island_watermask.png').convert('L')
    isl = Image.open(ADS / 'h1_pond_island_3d.png')
    canvas = Image.new('L', isl.size, 0); canvas.paste(m, (0, 0))
    canvas = canvas.filter(ImageFilter.GaussianBlur(3))
    rgba = Image.merge('RGBA', (Image.new('L', isl.size, 255),) * 3 + (canvas,))
    rgba.save(ADS / 'fx_island_water_a.png', optimize=True)


if __name__ == '__main__':
    caustics(); island_alpha(); print('ok')
