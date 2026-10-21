# Mono-white knock-out of the coloured brand badges (Forest oval, Rodio Craft bar, YARIE plate) for the Troutshop
# black/red "rising sun" world: keep only the white artwork (letters, keyline, swoosh), coloured plate -> transparent.
# Output: assets_prep/troutshop/brands/<slug>_mono.png (white on transparent, native size, no upscale).
import numpy as np
from PIL import Image
import os
D = os.path.join(os.path.dirname(__file__), '../../../assets_prep/troutshop/brands')
for s in ['forest', 'rodiocraft', 'yarie']:
    im = np.asarray(Image.open(f'{D}/{s}_on_dark.png').convert('RGBA')).astype(np.float32) / 255
    rgb, a = im[..., :3], im[..., 3]
    w = rgb.min(-1)                                   # whiteness: coloured plates have a low min channel
    k = np.clip((w - 0.42) / 0.38, 0, 1)
    out = np.zeros_like(im); out[..., :3] = 1; out[..., 3] = a * k
    if s == 'rodiocraft':                              # the white swoosh sits alone on the orange square → keep the wordmark only
        out[:, int(out.shape[1] * 0.74):] = 0
    ys, xs = np.nonzero(out[..., 3] > 0.03)
    out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    Image.fromarray((out * 255 + 0.5).astype(np.uint8)).save(f'{D}/{s}_mono.png')
    print(s, out.shape[1], out.shape[0])
