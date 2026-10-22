// STARTER for a new sponsor module. Copy to scripts/sponsors/<key>.mjs and make it the sponsor's own world
// (see docs/ADD_SPONSOR.md and the reference scripts/sponsors/gausseholler.mjs).
// As-is it already builds: it reads the film's data/blocks/<key>.json (logo, products, verified copy) and lays out a neutral world.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KEY = path.basename(fileURLToPath(import.meta.url), '.mjs');
const FILM = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../mcr-2026-sponzori');
const DATA = (() => { try { return JSON.parse(fs.readFileSync(path.join(FILM, 'data/blocks', `${KEY}.json`), 'utf8')); } catch { return {}; } })();
const ROLE = { venue: 'host', crs: 'supporter', gausseholler: 'prize' }[KEY] || 'sponsor';

// ---- REQUIRED ----
export const brand = {
  name: DATA.name || KEY,
  url: DATA.url || `${KEY}.cz`,          // exact text shown on every banner (engine renders it top-right)
  role: ROLE,                            // sponsor | prize | host | supporter → engine draws the role chip (data/event.json → roles)
};
// brand world: colours / fonts from the film block theme (mcr-2026-sponzori/scripts/blocks/<key>.mjs) and research/<key>.md
const C = { bg: '#101418', bg2: '#1c2530', fg: '#ffffff', accent: '#e3000f', sub: 'rgba(255,255,255,.75)' };
export const theme = {
  bg: C.bg,
  light: false,          // true on light worlds → TA logo gets the strongest shadow ('halo') + set chrome colours dark
  chrome: { url: C.fg, urlFont: "'Inter'", urlW: 800, sub: C.sub, dot: C.accent },
};
// optional: export const fonts = { 'Family': { v: 'family-{r}-wght-normal', weight: '100 900' } }  (woff2 in mcr-2026-sponzori/fonts/)
// optional: export const anim = { seq: [{ scene: 'poster', d: 2.6 }, { scene: 'range', d: 2.3 }, { scene: 'hero', d: 2.3 }, { scene: 'poster', d: 2.8 }] }
//   + wide: [...] = the 16:9 MP4 sequence (only scenes with an E.kind === 'wide' layout; default = the seq above → give range/hero a wide branch)

export function css() {
  return `
.tp-bg{background:radial-gradient(120% 80% at 70% 30%,${C.bg2},${C.bg} 70%)}
.tp-k{font-family:Inter;font-weight:700;text-transform:uppercase;letter-spacing:.2em;color:${C.accent}}
.tp-h{font-family:Inter;font-weight:900;text-transform:uppercase;line-height:1;color:${C.fg}}
.tp-p{font-family:Inter;font-weight:600;line-height:1.2;color:${C.fg};white-space:normal}
`;
}

const prods = (DATA.products || []).map((p) => `film:${p.src}`);
const logoSrc = DATA.logo?.on_dark ? `film:${DATA.logo.on_dark}` : null;
const copy = DATA.copy || {};
const R1 = (n) => Math.round(n * 10) / 10;
const T = (E, { cls, x, y, w, size, text, lines = 0, main = false, fit = 0, inAttr = '' }) =>
  `<div class="t ${cls}${main ? ' main' : ''}" ${inAttr} ${fit ? `data-fit="${fit}"` : ''} ${lines ? `data-lines="${lines}"` : ''} style="left:${R1(x)}px;top:${R1(y)}px;width:${R1(w)}px;font-size:${size}px;${lines ? '' : 'overflow:hidden;'}">${E.t(text)}</div>`;

function hero(E, src, box) {   // product fitted into a box, never upscaled (maxUp 1)
  if (!src) return '';
  return E.img(src, { cx: box.x + box.w / 2, cy: box.y + box.h / 2, w: box.w, h: box.h, attrs: 'data-in="rise"' }).html;
}

// ---- REQUIRED: scenes. poster → all 4 statics + loop; who / range / hero / mcr → carousel cards 1–4 (+ the MP4 sequence) ----
export const scenes = {
  poster(E) {
    const b = E.body, wide = E.kind === 'wide';
    let html = '<div class="full tp-bg"></div>';
    const hs = wide ? 72 : 110;
    html += hero(E, prods[0], wide ? { x: b.x + b.w * 0.55, y: b.y, w: b.w * 0.45, h: b.h } : { x: b.x, y: b.y + hs * 2.4, w: b.w, h: b.h - hs * 2.4 });
    html += T(E, { cls: 'tp-h', x: b.x, y: b.y + 10, w: wide ? b.w * 0.55 : b.w, size: hs, lines: 2, main: true, text: copy.headline || brand.name, inAttr: 'data-in="up"' });
    if (logoSrc) html += E.logo(logoSrc, { x: b.x, y: b.b - 120, maxH: 110, attrs: 'data-in="fade" data-d=".3"' }).html;
    return { html };
  },
  who(E) {
    const b = E.body;
    let html = '<div class="full tp-bg"></div>';
    if (logoSrc) html += E.logo(logoSrc, { x: b.x, y: b.y + 10, maxH: 140 }).html;
    html += T(E, { cls: 'tp-h', x: b.x, y: b.y + 190, w: b.w, size: 84, fit: 44, main: true, text: brand.name });
    html += T(E, { cls: 'tp-p', x: b.x, y: b.y + 300, w: b.w * 0.8, size: 46, lines: 4, main: true, text: (copy.facts || [])[0] || '' });
    return { html };
  },
  range(E) {
    const b = E.body;
    let html = '<div class="full tp-bg"></div>';
    html += T(E, { cls: 'tp-h', x: b.x, y: b.y + 4, w: b.w, size: 64, fit: 40, main: true, text: 'Sortiment' });
    const list = prods.slice(0, 6), cols = 3, gap = 16, gy = b.y + 96, cw = (b.w - gap * (cols - 1)) / cols, rows = Math.max(1, Math.ceil(list.length / cols)), ch = (b.b - gy - gap * (rows - 1)) / rows;
    list.forEach((src, i) => { const x = b.x + (i % cols) * (cw + gap), y = gy + Math.floor(i / cols) * (ch + gap); html += hero(E, src, { x: x + 10, y: y + 10, w: cw - 20, h: ch - 20 }); });
    return { html };
  },
  hero(E) {
    const b = E.body;
    let html = '<div class="full tp-bg"></div>';
    html += hero(E, prods[1] || prods[0], { x: b.x, y: b.y + 120, w: b.w, h: b.h - 120 });
    html += T(E, { cls: 'tp-h', x: b.x, y: b.y + 4, w: b.w, size: 80, fit: 44, main: true, text: (copy.facts || [])[1] || brand.name });
    return { html };
  },
  // mcr: if omitted the engine reuses the poster as card 4 (chip + URL + event line are always there)
};
