// Font registry: vendored OFL webfonts (fonts/*.woff2, from @fontsource) + exact text measuring (fontkit on fonts/_ttf/*.ttf).
// A block uses a family by name in CSS (font-family:'Anton') — every family below gets @font-face in the root page.
// Variable axes: set them with CSS custom props on .fx-var elements (--wght, --wdth) or plain font-weight / font-stretch.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { ROOT, PROJ, exists } from './util.mjs';

const FDIR = path.join(ROOT, 'fonts');
const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const EXT = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';

// name → { v: variable file stem (latin + latin-ext pair) | s: {weight: stem} static, axes, weight range, stretch range, italic stem, use }
export const FONTS = {
  Archivo: { v: 'archivo-{r}-wdth-normal', weight: '100 900', stretch: '62% 125%', axes: ['wght', 'wdth'], use: 'intro / broll / finale — variable width + weight kinetic type' },
  'Bricolage Grotesque': { v: 'bricolage-grotesque-{r}-wdth-normal', weight: '200 800', stretch: '75% 100%', axes: ['wght', 'wdth'], use: 'editorial display (spare)' },
  Inter: { v: 'inter-{r}-wght-normal', weight: '100 900', axes: ['wght'], use: 'neutral text; Gausse Holler web font' },
  'Inter Tight': { v: 'inter-tight-{r}-wght-normal', weight: '100 900', axes: ['wght'], use: 'tight neutral display' },
  Montserrat: { v: 'montserrat-{r}-wght-normal', vi: 'montserrat-{r}-wght-italic', weight: '100 900', axes: ['wght'], use: 'Líheň Liběchov web font (italic uppercase in header)' },
  Nunito: { v: 'nunito-{r}-wght-normal', weight: '200 1000', axes: ['wght'], use: 'Activefishing web font (Shoptet)' },
  Unbounded: { v: 'unbounded-{r}-wght-normal', weight: '200 900', axes: ['wght'], use: 'Moonky display (wide, soft-lure fun)' },
  Oswald: { v: 'oswald-{r}-wght-normal', weight: '200 700', axes: ['wght'], use: 'Velká ryba display (condensed sport)' },
  Outfit: { v: 'outfit-{r}-wght-normal', weight: '100 900', axes: ['wght'], use: 'Bosset display (clean geometric product)' },
  'Space Grotesk': { v: 'space-grotesk-{r}-wght-normal', weight: '300 700', axes: ['wght'], use: 'tech spec labels (spare)' },
  Anton: { s: { 400: 'anton-{r}-400-normal' }, use: 'Troutshop display (bold condensed retail)' },
  Poppins: { s: { 400: 'poppins-{r}-400-normal', 600: 'poppins-{r}-600-normal', 800: 'poppins-{r}-800-normal', 900: 'poppins-{r}-900-normal' }, use: 'Jigovky web font (Shoptet)' },
  'Playfair Display': { s: { 700: 'playfair-display-{r}-700-normal', 900: 'playfair-display-{r}-900-normal' }, si: { 700: 'playfair-display-{r}-700-italic', 900: 'playfair-display-{r}-900-italic' }, use: 'serif accent (Gausse Holler wordmark feel)' },
};
const files = (stem) => [['latin', LATIN], ['latin-ext', EXT]].map(([r, range]) => ({ file: stem.replace('{r}', r), range }));

// @font-face CSS for all families (url prefix = staged dir, e.g. 'assets/fonts/')
export function fontCss(prefix = 'assets/fonts/') {
  const out = [];
  const face = (fam, file, range, weight, style = 'normal', stretch) => out.push(`@font-face{font-family:'${fam}';font-style:${style};font-weight:${weight};${stretch ? `font-stretch:${stretch};` : ''}font-display:block;src:url(${prefix}${file}.woff2) format('woff2');unicode-range:${range};}`);
  for (const [fam, F] of Object.entries(FONTS)) {
    if (F.v) for (const { file, range } of files(F.v)) face(fam, file, range, F.weight, 'normal', F.stretch);
    if (F.vi) for (const { file, range } of files(F.vi)) face(fam, file, range, F.weight, 'italic', F.stretch);
    for (const [w, stem] of Object.entries(F.s || {})) for (const { file, range } of files(stem)) face(fam, file, range, w);
    for (const [w, stem] of Object.entries(F.si || {})) for (const { file, range } of files(stem)) face(fam, file, range, w, 'italic');
  }
  return out.join('\n');
}
// copy all woff2 into the staged assets dir
export function stageFonts(dstDir) {
  fs.mkdirSync(dstDir, { recursive: true });
  for (const f of fs.readdirSync(FDIR)) if (f.endsWith('.woff2')) {
    const s = path.join(FDIR, f), d = path.join(dstDir, f);
    if (!exists(d) || fs.statSync(d).mtimeMs < fs.statSync(s).mtimeMs) fs.copyFileSync(s, d);
  }
}

// ---------- measuring (exact advance widths, kerning ignored → slight over-estimate = safe) ----------
const require = createRequire(path.join(PROJ, 'hb-battle-2026/node_modules/'));
let fontkit = null;
try { fontkit = require('fontkit'); } catch { fontkit = null; }
const cache = new Map();
function faces(fam, { wght = 700, wdth = 100, italic = false } = {}) {
  const F = FONTS[fam]; if (!F || !fontkit) return null;
  let stem, vari = null;
  if (F.v) { stem = italic && F.vi ? F.vi : F.v; vari = {}; if (F.axes.includes('wght')) vari.wght = wght; if (F.axes.includes('wdth')) vari.wdth = wdth; }
  else { const S = italic && F.si ? F.si : F.s; const ws = Object.keys(S).map(Number); const w = ws.reduce((a, b) => (Math.abs(b - wght) < Math.abs(a - wght) ? b : a)); stem = S[w]; }
  const key = stem + JSON.stringify(vari);
  if (!cache.has(key)) {
    const pair = files(stem).map(({ file }) => {
      const p = path.join(FDIR, '_ttf', file + '.ttf'); if (!exists(p)) return null;
      let f = fontkit.openSync(p); if (vari) { try { f = f.getVariation(vari); } catch { /* static fallback */ } } return f;
    });
    cache.set(key, pair);
  }
  return cache.get(key);
}
// width in px of a single line
export function measure(text, { font = 'Inter', size = 100, wght = 700, wdth = 100, italic = false, upper = false, tracking = 0 } = {}) {
  const s = upper ? String(text).toUpperCase() : String(text);
  const pair = faces(font, { wght, wdth, italic });
  let em = 0;
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    if (cp === 0xa0) { em += 0.26; continue; }
    const f = pair && (pair.find((x) => x && x.hasGlyphForCodePoint(cp)) || pair[0]);
    if (f) em += f.glyphForCodePoint(cp).advanceWidth / f.unitsPerEm;
    else em += /[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ0-9]/.test(ch) ? 0.72 : ch === ' ' ? 0.26 : 0.58;   // fallback estimate
    em += tracking;
  }
  return em * size;
}
// greedy word wrap at a given size → array of lines (NBSP keeps words together)
export function wrap(text, opt) {
  const words = String(text).split(' ').filter((w) => w !== '');
  const lines = []; let cur = '';
  for (const w of words) {
    const cand = cur ? cur + ' ' + w : w;
    if (cur && measure(cand, opt) > opt.maxW) { lines.push(cur); cur = w; } else cur = cand;
  }
  if (cur) lines.push(cur);
  return lines;
}
// largest size from `sizes` (desc) where text fits in maxLines lines of maxW → { size, lines }
export function fit(text, { sizes = [200, 180, 160, 140, 120, 104, 92, 80, 72, 64, 56, 48, 40], maxW = 952, maxLines = 2, ...o } = {}) {
  for (const size of sizes) {
    const lines = wrap(text, { ...o, size, maxW });
    if (lines.length <= maxLines && lines.every((l) => measure(l, { ...o, size }) <= maxW)) return { size, lines };
  }
  const size = sizes[sizes.length - 1];
  return { size, lines: wrap(text, { ...o, size, maxW }), overflow: true };
}
