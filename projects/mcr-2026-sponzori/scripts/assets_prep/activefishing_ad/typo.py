"""Tiny text renderer with latin + latin-ext fallback (fonts/_ttf), used by moodboard.py / font tests."""
from PIL import ImageFont
from fontTools.ttLib import TTFont
T = '/home/user/Clipcreator/projects/mcr-2026-sponzori/fonts/_ttf/'
_cmap = {}

def _has(path, ch):
    if path not in _cmap:
        _cmap[path] = set(TTFont(path).getBestCmap().keys())
    return ord(ch) in _cmap[path]

class Face:
    def __init__(self, stem, size, axes=None):
        self.paths = [T + stem.replace('{r}', r) + '.ttf' for r in ('latin', 'latin-ext')]
        self.fonts = [ImageFont.truetype(p, size) for p in self.paths]
        if axes:
            for f in self.fonts:
                try:
                    f.set_variation_by_axes(axes)
                except Exception:
                    pass
        self.size = size

    def pick(self, ch):
        for p, f in zip(self.paths, self.fonts):
            if _has(p, ch):
                return f
        return self.fonts[0]

    def width(self, text, track=0):
        return sum(self.pick(c).getlength(c) + track for c in text) - track

    def draw(self, d, xy, text, fill, track=0):
        x, y = xy
        for c in text:
            f = self.pick(c)
            d.text((x, y), c, font=f, fill=fill)
            x += f.getlength(c) + track
        return x
