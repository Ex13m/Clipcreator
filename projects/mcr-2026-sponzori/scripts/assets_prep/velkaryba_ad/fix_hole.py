import sys, numpy as np
from PIL import Image
from scipy import ndimage as ndi
p, x0, y0, x1, y1 = sys.argv[1], *map(int, sys.argv[2:6])
im = np.asarray(Image.open(p).convert('RGBA')).astype(np.float32)
sub = im[y0:y1, x0:x1]
rgb = sub[..., :3]; a = sub[..., 3]
mn = rgb.min(2); mx = rgb.max(2); sat = (mx - mn) / np.maximum(mx, 1)
w = (mn > 232) & (sat < 0.08) & (a > 0)
w = ndi.binary_dilation(w, iterations=1)
k = ndi.gaussian_filter(w.astype(np.float32), 0.7)
print('pixels cleared', int(w.sum()))
sub[..., 3] = a * (1 - np.clip(k * 1.4, 0, 1))
im[y0:y1, x0:x1] = sub
Image.fromarray(im.round().astype(np.uint8), 'RGBA').save(p, optimize=True)
