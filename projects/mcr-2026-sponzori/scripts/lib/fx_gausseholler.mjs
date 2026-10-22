// fx_gausseholler.mjs — helpers used only by blocks/gausseholler.mjs (block, Reel hook, Reel end card).
// World = gausseholler.com: graphite studio #0F1113 / #16191C, hairlines #282D33, bone #E9E6E2, ice #7FB2C7 (small UI only),
// one colour accent per moment (Black-edition logo orange #E8925A or the anodised colour of a colourway).
// Type: Inter 800 caps (display), Inter 600 caps +0.25em (site heading style, kickers), Cormorant Garamond (one crafted line).
// All seek-safe: fromTo / hit / set only; positions via left/top; transforms only through the timeline.
import fs from 'node:fs';
import path from 'node:path';
import { esc, nb, ROOT } from './util.mjs';

const px = (n) => `${Math.round(n * 10) / 10}px`;

export const C = { bg: '#0f1113', panel: '#16191c', line: '#282d33', bone: '#e9e6e2', white: '#ffffff', ice: '#7fb2c7', gear: '#1d8fd5', orange: '#e8925a', orangeD: '#c9784f' };

// ---------- products: clean local cut-outs (assets_prep/gausseholler/ads/, manifest has pad / size) ----------
export const AD = 'assets_prep/gausseholler/ads/';
const MAN = JSON.parse(fs.readFileSync(path.join(ROOT, AD, 'manifest.json'), 'utf8'));
const BY = Object.fromEntries(MAN.files.map((f) => [path.basename(f.file, '.png'), f]));
export const IMG = {
  threeq: 'H1_revolut8_black_threeq', front: 'H1b_revolut8_black_front', top: 'H1c_revolut8_black_top', snap: 'H3_snap8_black',
  aluO: 'S1_aluset_revolut8_orange', tubes: 'S3_carbon_tube_set_red', tube: 'S4_carbon_tube_black', never: 'S5_revolut8_nevergreen', bw: 'S6_revolut8_black_white',
};
// Revolut 8 SE colourways: one shared crop box → they swap in place. col = anodised colour measured on the cut-out, glow = brighter tint
export const COLS = [
  { k: 'H2_revolut8_colourway_1_blue', col: '#2367b0', glow: '#3a86d8' },
  { k: 'H2_revolut8_colourway_2_orange', col: '#cb5f0f', glow: '#f07a22' },
  { k: 'H2_revolut8_colourway_3_red', col: '#dd403a', glow: '#f2544c' },
  { k: 'H2_revolut8_colourway_4_purple', col: '#6e3f82', glow: '#9a5cb6' },
  { k: 'H2_revolut8_colourway_5_tiffany', col: '#0a7c96', glow: '#14a6c4' },
  { k: 'H2_revolut8_colourway_6_lightgreen', col: '#628823', glow: '#86b532' },
  { k: 'H2_revolut8_colourway_7_bronze', col: '#945b33', glow: '#c27a45' },
];
export const src = (k) => `${AD}${k}.png`;
export const pad = (k) => BY[k]?.pad || [0.03, 0.03, 0.03, 0.03];
// stage every hero at its native size (default staging caps at 1600 px; the top view is 1936 px tall) — call before any ctx.dims()
export function stage(ctx) {
  for (const k of [...Object.values(IMG), ...COLS.map((c) => c.k)]) ctx.asset(src(k), { maxSide: 2048 });
}

// ---------- staging in the renders' own perspective ----------
// The shop renders look down on the four-leg stands from ~35° (3/4), ~44° (colourway crop) and ~11° (front). A flat podium
// (top ellipse 7:1) or a horizon hairline at leg height made the stands hover (back legs 100–170 px above the podium top).
// FOOT = the floor ellipse through the leg tips, fitted from the alpha (two opposite tips + the front tip → conjugate
// semi-diameters → axes). Units: fractions of the displayed PNG width w, centre measured from the PNG top-left.
export const FOOT = {
  threeq: { cx: 0.4975, cy: 0.789, a: 0.473, b: 0.265, tips: [[0.034, 0.837], [0.961, 0.741], [0.592, 1.05]] },
  front: { cx: 0.493, cy: 0.805, a: 0.453, b: 0.087, tips: [[0.04, 0.805], [0.946, 0.803], [0.486, 0.892]] },
  cw: { cx: 0.5095, cy: 0.87, a: 0.526, b: 0.365, tips: [[0.058, 1.036], [0.961, 0.704], [0.778, 1.196]] },
};
export function foot(kind, P) {
  const f = FOOT[kind];
  return { x: P.x + f.cx * P.w, y: P.y + f.cy * P.w, a: f.a * P.w, b: f.b * P.w, tips: f.tips.map(([x, y]) => [P.x + x * P.w, P.y + y * P.w]), back: P.y + Math.min(...f.tips.map((t) => t[1])) * P.w };
}
// product cut-out with the fx.product layer contract (#id › #id-cam › #id-tl › #id-rot › image + #id-sw, so fx.sweep works);
// bg:true paints the image as a background (a second <img> of the same file in one composition → lint duplicate_media_discovery_risk)
export function prod(ctx, { id, k, w, cx, top, sweepOpacity = 0.6, bg = false, style = '' }) {
  const s = src(k), [nw, nh] = ctx.dims(s), ww = Math.min(w, nw), h = ww / (nw / nh), url = ctx.asset(s), x = cx - ww / 2;
  const im = bg ? `<div class="fx-prod-img" id="${ctx.id(`${id}-im`)}" style="background:url(${url}) center/100% 100% no-repeat"></div>` : `<img class="fx-prod-img" id="${ctx.id(`${id}-im`)}" src="${url}" alt="">`;
  const sw = `<i class="fx-prod-sweep" id="${ctx.id(`${id}-sw`)}" style="-webkit-mask-image:url(${url});mask-image:url(${url});--sa:105deg;--so:${sweepOpacity}"></i>`;
  const html = `<div class="fx-prod" id="${ctx.id(id)}" style="left:${px(x)};top:${px(top)};width:${px(ww)};height:${px(h)};${style}"><div class="fx-abs" id="${ctx.id(`${id}-cam`)}" style="inset:0"><div class="fx-prod-tilt" id="${ctx.id(`${id}-tl`)}"><div class="fx-abs" id="${ctx.id(`${id}-rot`)}" style="inset:0">${im}${sw}</div></div></div></div>`;
  return { html, x, y: top, w: ww, h, sel: ctx.sel(id), cam: ctx.sel(`${id}-cam`) };
}
// contact shadows for a stand standing on the floor: ambient occlusion over the footprint + a dark core under the hub
// + a tight contact blot under every visible leg tip (paint it BEFORE the product)
// ONE element with stacked radial-gradients (every extra radial/blur element counts toward lint composition_heavy_overlay_count_high)
// extra: [{x, y, rx, ry, a}] more blots (e.g. under the family stands)
export function footShadow(ctx, { id, F, ao = 0.5, tip = 0.8, extra = [] }) {
  const g = (x, y, rx, ry, stops) => `radial-gradient(${px(rx)} ${px(ry)} at ${px(x)} ${px(y)},${stops},rgba(0,0,0,0))`;
  const r = Math.max(14, F.a * 0.085), q = Math.max(5, r * Math.max(0.3, F.b / F.a));
  const layers = [
    ...F.tips.map(([x, y]) => g(x, y - q * 0.25, r, q, `rgba(0,0,0,${tip})`)),
    ...extra.map((o) => g(o.x, o.y, o.rx, o.ry, `rgba(0,0,0,${o.a ?? 0.6})`)),
    g(F.x, F.y, F.a * 0.42, Math.max(8, F.b * 0.42), `rgba(0,0,0,${ao + 0.15})`),
    g(F.x, F.y, F.a * 1.14, Math.max(12, F.b * 1.14), `rgba(0,0,0,${ao}),rgba(0,0,0,${ao * 0.45}) 58%`),
  ];
  return `<div class="fx-full" id="${ctx.id(id)}" style="background:${layers.join(',')}"></div>`;
}
// soft floor blots under secondary stands, one element: list [{x, y, rx, ry, a}]
export function blots(ctx, { id, list }) {
  const g = (o) => `radial-gradient(${px(o.rx)} ${px(o.ry)} at ${px(o.x)} ${px(o.y)},rgba(0,0,0,${o.a ?? 0.6}),rgba(0,0,0,0))`;
  return `<div class="fx-full" id="${ctx.id(id)}" style="background:${list.map(g).join(',')}"></div>`;
}
// display plinth in the SAME perspective as the stand on it: top ellipse = footprint × m (axes ratio b/a of the render),
// front face h px, orange hairline on the front rim, optional engraved label centred on the front face
export function plinth(ctx, { id, F, m = 1.16, h = 80, accent = C.orange, label = '', labelT = null, labelSize = 26 }) {
  const A = F.a * m, B = F.b * m, e = 2 * B;
  const lab = label ? `<div class="gh-pl" id="${ctx.id(`${id}-lb`)}" style="top:${px(e + (h - labelSize * 1.15) / 2 + 2)};font-size:${labelSize}px">${esc(nb(label))}</div>` : '';
  if (label && labelT != null) ctx.tl.fromTo(ctx.sel(`${id}-lb`), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' }, labelT);
  const html = `<div class="fx-abs" id="${ctx.id(id)}" style="left:${px(F.x - A)};top:${px(F.y - B)};width:${px(2 * A)};height:${px(e + h)}">
    <i class="gh-pf" style="top:${px(B)};height:${px(B + h)};border-radius:0 0 50% 50% / 0 0 ${px(B)} ${px(B)}"></i>
    <i class="gh-pt gh-pt2" style="height:${px(e)}"></i>
    <i class="gh-pr" style="top:${px(B - 1)};height:${px(B + 3)};border-color:${accent}"></i>${lab}
  </div>`;
  return { html, top: F.y - B, rim: F.y + B, bottom: F.y + B + h, A, B };
}

// ---------- logo: the site's own three layers (ring / core / word, shared 1200×1139 canvas) stacked so the ring can turn
// like on gausseholler.com (.gh-logo__ring). Size + logo rule from ctx.logo('on_dark') (= the same artwork, Lanczos 2×).
// OPERATOR RULE (22. 10.): wherever the GH mark is visible, its OUTER RING turns CLOCKWISE at a constant speed for the whole visible
// window — never stops, never reverses; core + word stay still. Speed = the site's own (`animation: gh-spin 14s linear infinite`
// on .gh-logo__ring / .gh-sign__ring) → 360°/14 s ≈ 25.7°/s. Seek-safe: one linear GSAP tween on the paused timeline.
export const SPIN_DPS = 360 / 14;
export function spin(ctx, sel, t0, t1, { dps = SPIN_DPS, from = 0 } = {}) {
  if (!(t1 > t0)) return;
  ctx.tl.fromTo(sel, { rotation: from }, { rotation: from + dps * (t1 - t0), duration: t1 - t0, ease: 'none', immediateRender: true }, t0);
}
const LAY = { ring: 'assets/gausseholler/logo_layer_ring.png', core: 'assets/gausseholler/logo_layer_core.png', word: 'assets/gausseholler/logo_layer_word.png' };
const BOX = { x: 209, y: 120, w: 786, h: 734 };            // union bbox of the three layers on the 1200×1139 canvas
// ring / core centre on the canvas = the ring's own 60° symmetry centre (measured: rotate the alpha 60° and minimise the diff;
// the site's transform-origin 50.04% 29.54% = 600.5/336.5 is ~1 px off → would wobble ±1 px at film size)
const HUB = [601.0, 337.5];
// spin: {t0, t1, dps} (block-local; default = the `at` window) or false. sweep: {sa, so} → glint layers that follow the logo
// (core+word mask static, ring mask turns with the ring while its gradient counter-turns, so the glint stays world-aligned);
// returns `sweeps` = selectors to animate backgroundPosition on.
export function mark(ctx, { id, cx, y, box = [300, 300], scale = 1, at, label, gearOnly = false, src = 'on_dark', spin: sp = {}, sweep = null }) {
  const L = ctx.logo(src, { box, scale, at, label: label || `${ctx.cid}:gh logo (layers)` });
  const s = L.w / BOX.w, h = BOX.h * s;
  const cw = 1200 * s, chh = 1139 * s, geo = `position:absolute;left:${px(-BOX.x * s)};top:${px(-BOX.y * s)};width:${px(cw)};height:${px(chh)}`;
  const url = (k) => ctx.asset(LAY[k], { trim: false });
  const im = (k) => `<img id="${ctx.id(`${id}-${k}`)}" src="${url(k)}" alt="" style="${geo}">`;
  const org = `${px(HUB[0] * s)} ${px(HUB[1] * s)}`;
  const swStyle = sweep ? `--sa:${sweep.sa ?? 110}deg;--so:${sweep.so ?? 0.85}` : '';
  // ring: a wrapper that turns (img + optional masked glint inside)
  let ring = `<img src="${url('ring')}" alt="" style="position:absolute;left:0;top:0;width:100%;height:100%">`;
  if (sweep) ring += `<div style="position:absolute;inset:0;-webkit-mask-image:url(${url('ring')});mask-image:url(${url('ring')});-webkit-mask-size:100% 100%;mask-size:100% 100%"><i class="fx-prod-sweep" id="${ctx.id(`${id}-rsw`)}" style="right:auto;bottom:auto;left:${px(BOX.x * s)};top:${px(BOX.y * s)};width:${px(L.w)};height:${px(h)};-webkit-mask-image:none;mask-image:none;transform-origin:${px((HUB[0] - BOX.x) * s)} ${px((HUB[1] - BOX.y) * s)};${swStyle}"></i></div>`;
  const stat = gearOnly ? ['core'] : ['core', 'word'];
  const ms = stat.map((k) => `url(${url(k)})`).join(',');
  const sw = sweep ? `<i class="fx-prod-sweep" id="${ctx.id(`${id}-sw`)}" style="${geo};-webkit-mask-image:${ms};mask-image:${ms};-webkit-mask-size:100% 100%;mask-size:100% 100%;${swStyle}"></i>` : '';
  const html = `<div class="fx-abs" id="${ctx.id(id)}" style="left:${px(cx - L.w / 2)};top:${px(y)};width:${px(L.w)};height:${px(h)}"><div id="${ctx.id(`${id}-ring`)}" style="${geo};transform-origin:${org}">${ring}</div>${im('core')}${gearOnly ? '' : im('word')}${sw}</div>`;
  const out = { html, w: L.w, h, src: L.src, sel: ctx.sel(id), ring: ctx.sel(`${id}-ring`), word: ctx.sel(`${id}-word`), core: ctx.sel(`${id}-core`), sweeps: sweep ? [ctx.sel(`${id}-sw`), ctx.sel(`${id}-rsw`)] : [] };
  if (sp !== false) {
    const t0 = sp.t0 ?? at?.[0] ?? 0, t1 = sp.t1 ?? at?.[1] ?? ctx.dur, dps = sp.dps ?? SPIN_DPS;
    spin(ctx, out.ring, t0, t1, { dps });
    if (sweep) spin(ctx, ctx.sel(`${id}-rsw`), t0, t1, { dps: -dps });   // invisible gradient carrier: keeps the glint world-aligned
  }
  return out;
}
// MADE BY ⚙ © 2026 GAUSSE HOLLER sign-off (assets_prep/gausseholler/madeby_on_dark.png, prep_logos.py) rebuilt from layers so the
// gear ring turns: text layer = the same PNG with the gear pixels cleared (madeby_text_on_dark.png, same 4041×413 canvas) +
// the site's footer sign layers brand/gh/ring.png + core.png (shared 512 canvas; gear_ring/gear_core.png are their 2× traces, but
// data/blocks/gausseholler.json pre-stages those TRIMMED → wrong geometry here). Gear canvas origin on the madeby canvas measured by
// re-compositing (alpha diff < 1/255): (1081.04, 36.0), 340 px square; ring's own 60° symmetry centre = (256.375, 257.0) on 512. Size + logo rule = ctx.logo on
// the flat PNG (trimmed to its content bbox 40,40 – 4001,373).
const MB = { pad: 40, cw: 3961, canvas: [4041, 413], gear: [1081.04, 36.0, 340], hub: [256.375, 257.0], gc: 512 };
export function madeby(ctx, { id, src, box, scale = 1, at, label = 'MADE BY GH', spin: sp = {} }) {
  const L = ctx.logo(src, { box, scale, at, label });
  const k = L.w / MB.cw, [gx, gy, gs] = MB.gear;
  const gl = (gx - MB.pad) * k, gt = (gy - MB.pad) * k, gw = gs * k;
  const gimg = (rel, extra = '') => `<img src="${ctx.asset(rel, { trim: false })}" alt="" style="position:absolute;left:0;top:0;width:100%;height:100%;${extra}">`;
  const html = `<div style="position:relative;width:${px(L.w)};height:${px(L.h)}">`
    + `<img src="${ctx.asset('assets_prep/gausseholler/madeby_text_on_dark.png', { trim: false })}" alt="${esc('MADE BY © 2026 Gausse Holler')}" style="position:absolute;left:${px(-MB.pad * k)};top:${px(-MB.pad * k)};width:${px(MB.canvas[0] * k)};height:${px(MB.canvas[1] * k)}">`
    + `<div id="${ctx.id(`${id}-ring`)}" style="position:absolute;left:${px(gl)};top:${px(gt)};width:${px(gw)};height:${px(gw)};transform-origin:${px((MB.hub[0] / MB.gc) * gw)} ${px((MB.hub[1] / MB.gc) * gw)}">${gimg('brand/gh/ring.png')}</div>`
    + `<div style="position:absolute;left:${px(gl)};top:${px(gt)};width:${px(gw)};height:${px(gw)}">${gimg('brand/gh/core.png')}</div></div>`;
  const ring = ctx.sel(`${id}-ring`);
  if (sp !== false) spin(ctx, ring, sp.t0 ?? at?.[0] ?? 0, sp.t1 ?? at?.[1] ?? ctx.dur, { dps: sp.dps ?? SPIN_DPS });
  return { html, w: L.w, h: L.h, ring };
}

// v9 (operator 22. 10.: MADE BY ≥ 30 px caps): the same sign-off STACKED on two lines (MADE BY ⚙ / © 2026 GAUSSE HOLLER) so ≥ 30 px
// caps fit under the TA hero width (logo rule). Assets: scripts/assets_prep/madeby_stack.py → madeby_stack_on_dark.png (flat: size +
// logo rule, trimmed to bbox) + madeby_stack_text_on_dark.png (gear cleared, untrimmed canvas); gear = the same ring/core layers as
// madeby() → the ring turns clockwise all the time it is visible (operator rule 22. 10.). bbox = [x, y, w, h] of the content on the canvas.
const MBS = { canvas: [2563, 591], bbox: [40, 44, 2483, 507], gear: [1632, 40, 340], caps: 131 };
export function madebyStack(ctx, { id, src = 'assets_prep/gausseholler/madeby_stack_on_dark.png', box, scale = 1, at, label = 'MADE BY GH', spin: sp = {} }) {
  const L = ctx.logo(src, { box, scale, at, label });
  const k = L.w / MBS.bbox[2], [bx, by] = MBS.bbox, [gx, gy, gs] = MBS.gear;
  const gl = (gx - bx) * k, gt = (gy - by) * k, gw = gs * k;
  const gimg = (rel) => `<img src="${ctx.asset(rel, { trim: false })}" alt="" style="position:absolute;left:0;top:0;width:100%;height:100%">`;
  const html = `<div style="position:relative;width:${px(L.w)};height:${px(L.h)}">`
    + `<img src="${ctx.asset('assets_prep/gausseholler/madeby_stack_text_on_dark.png', { trim: false })}" alt="${esc('MADE BY © 2026 Gausse Holler')}" style="position:absolute;left:${px(-bx * k)};top:${px(-by * k)};width:${px(MBS.canvas[0] * k)};height:${px(MBS.canvas[1] * k)}">`
    + `<div id="${ctx.id(`${id}-ring`)}" style="position:absolute;left:${px(gl)};top:${px(gt)};width:${px(gw)};height:${px(gw)};transform-origin:${px((MB.hub[0] / MB.gc) * gw)} ${px((MB.hub[1] / MB.gc) * gw)}">${gimg('brand/gh/ring.png')}</div>`
    + `<div style="position:absolute;left:${px(gl)};top:${px(gt)};width:${px(gw)};height:${px(gw)}">${gimg('brand/gh/core.png')}</div></div>`;
  const ring = ctx.sel(`${id}-ring`);
  if (sp !== false) spin(ctx, ring, sp.t0 ?? at?.[0] ?? 0, sp.t1 ?? at?.[1] ?? ctx.dur, { dps: sp.dps ?? SPIN_DPS });
  return { html, w: L.w, h: L.h, ring, caps: MBS.caps * k };
}

// ---------- studio light ----------
// top light cone (soft trapezoid); one element, static blur
export function cone(ctx, { id, x = 540, top = -80, wTop = 300, wBot = 1100, h = 1700, color = C.bone, a = 0.13, style = '' }) {
  const l = (wBot - wTop) / 2 / wBot * 100, r = 100 - l;
  return `<div class="fx-abs" id="${ctx.id(id)}" style="left:${px(x - wBot / 2)};top:${px(top)};width:${px(wBot)};height:${px(h)};background:linear-gradient(180deg,${rgbaHex(color, a)},${rgbaHex(color, a * 0.35)} 55%,transparent 92%);clip-path:polygon(${l}% 0,${r}% 0,100% 100%,0 100%);filter:blur(26px);${style}"></div>`;
}
// light pool on the floor (top view) / back-light lift behind a dark product
export function pool(ctx, { id, x, y, w, h = w, color = '#2c3339', a = 1, style = '' }) {
  return `<div class="fx-abs" id="${ctx.id(id)}" style="left:${px(x - w / 2)};top:${px(y - h / 2)};width:${px(w)};height:${px(h)};border-radius:50%;background:radial-gradient(closest-side,${color},transparent);opacity:${a};${style}"></div>`;
}
// studio floor: horizon hairline + darker floor plane below y
export function floor(ctx, { id, y, style = '' }) {
  return `<div class="fx-abs" id="${ctx.id(id)}" style="left:0;right:0;top:${px(y)};bottom:0;background:linear-gradient(180deg,rgba(40,45,51,.55),rgba(15,17,19,0) 70%);border-top:1px solid rgba(233,230,226,.12);${style}"></div>`;
}
export const rgbaHex = (hex, a) => { const n = parseInt(hex.replace('#', ''), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; };

// podium / display puck: glossy top ellipse + cylinder front with a hairline orange rim (the one accent)
export function podium(ctx, { id, cx, y, w, e = 92, h = 150, accent = C.orange, label = '', labelT = null }) {
  const lab = label ? `<div class="gh-pl" id="${ctx.id(`${id}-lb`)}" style="top:${px(e / 2 + 46)}">${esc(nb(label))}</div>` : '';
  if (label && labelT != null) ctx.tl.fromTo(ctx.sel(`${id}-lb`), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, labelT);
  return `<div class="fx-abs" id="${ctx.id(id)}" style="left:${px(cx - w / 2)};top:${px(y - e / 2)};width:${px(w)};height:${px(h + e)}">
    <i class="gh-pf" style="top:${px(e / 2)};height:${px(h)};border-radius:0 0 50% 50% / 0 0 ${px(e / 2)} ${px(e / 2)}"></i>
    <i class="gh-pt" style="height:${px(e)}"></i>
    <i class="gh-pr" style="top:${px(e / 2 - 1)};height:${px(e / 2 + 3)};border-color:${accent}"></i>${lab}
  </div>`;
}

// ---------- kinetic type ----------
// one masked line of words, each word revealed at its own time (VO sync). words: [{w, t, c}]
export function words(ctx, { id, x, y, w = null, words: list, font = 'Inter', wght = 700, size = 46, track = 0.2, upper = true, color = C.bone, align = 'left', style = '', d = 0.5 }) {
  const spans = list.map((o, i) => `<span class="fx-c" id="${ctx.id(`${id}-w${i}`)}" style="${o.c ? `color:${o.c};` : ''}">${esc(nb(o.w))}</span>`).join(' ');
  list.forEach((o, i) => ctx.tl.fromTo(ctx.sel(`${id}-w${i}`), { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: d, ease: 'expo.out' }, o.t));
  return `<div class="fx-t" id="${ctx.id(id)}" style="left:${px(x)};top:${px(y)};${w ? `width:${px(w)};` : ''}font-family:'${font}';font-weight:${wght};font-size:${size}px;line-height:1.1;letter-spacing:${track}em;color:${color};text-align:${align};${upper ? 'text-transform:uppercase;' : ''}${style}"><span class="fx-ln"><span>${spans}</span></span></div>`;
}
// kicker in the site's heading style (Inter 600 caps +0.25em), chars typed in
export function kicker(ctx, { id, text, x, y, size = 32, color = C.ice, t, wght = 600, track = 0.25, align = 'left', w = null, stagger = 0.018 }) {
  const chars = [...nb(text)].map((c) => (c === ' ' ? ' ' : `<span class="fx-c">${esc(c)}</span>`)).join('');
  if (t != null) ctx.tl.fromTo(`${ctx.sel(id)} .fx-c`, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.32, ease: 'power2.out', stagger }, t);
  return `<div class="fx-t" id="${ctx.id(id)}" style="left:${px(x)};top:${px(y)};${w ? `width:${px(w)};` : ''}font-family:'Inter';font-weight:${wght};font-size:${size}px;line-height:1.15;letter-spacing:${track}em;text-transform:uppercase;color:${color};white-space:nowrap;text-align:${align}">${chars}</div>`;
}
// group fade-up exit (whole element)
export function out(ctx, sel, t, { d = 0.3, y = -40 } = {}) {
  ctx.tl.fromTo(sel, { opacity: 1, y: 0 }, { opacity: 0, y, duration: d, ease: 'power3.in' }, t);
}

// ---------- spec callouts: one full-frame SVG (leaders drawn with dash offset) + HTML labels ----------
// items: [{id, dot:[x,y], path:[[x,y]…] (from the dot), label, sub, lx, ly, align:'left'|'right', t, t1}]
export function callouts(ctx, { id, items }) {
  let svg = `<svg class="gh-co" viewBox="0 0 ${ctx.W} ${ctx.H}" width="${ctx.W}" height="${ctx.H}" aria-hidden="true">`;
  let lab = '';
  items.forEach((c) => {
    const pts = [c.dot, ...c.path].map((p) => p.join(',')).join(' ');
    svg += `<polyline id="${ctx.id(`${id}-${c.id}-p`)}" points="${pts}" pathLength="1" fill="none" stroke="rgba(233,230,226,.8)" stroke-width="2" stroke-dasharray="1" stroke-dashoffset="1"/>`;
    svg += `<circle id="${ctx.id(`${id}-${c.id}-d`)}" cx="${c.dot[0]}" cy="${c.dot[1]}" r="8" fill="${C.bone}"/>`;
    svg += `<circle id="${ctx.id(`${id}-${c.id}-r`)}" cx="${c.dot[0]}" cy="${c.dot[1]}" r="8" fill="none" stroke="${C.bone}" stroke-width="2" style="opacity:0"/>`;
    const al = c.align === 'right';
    lab += `<div class="gh-cl" id="${ctx.id(`${id}-${c.id}-l`)}" style="${al ? `right:${px(ctx.W - c.lx)}` : `left:${px(c.lx)}`};top:${px(c.ly)};text-align:${al ? 'right' : 'left'}"><span class="fx-ln"><span>${esc(nb(c.label))}</span></span>${c.sub ? `<em class="fx-ln"><span>${esc(nb(c.sub))}</span></em>` : ''}</div>`;
    const P = ctx.sel(`${id}-${c.id}`);
    ctx.tl.set(`${P}-d`, { transformOrigin: '50% 50%' }, 0);
    ctx.tl.set(`${P}-r`, { transformOrigin: '50% 50%' }, 0);
    ctx.tl.fromTo(`${P}-d`, { scale: 0 }, { scale: 1, duration: 0.3, ease: 'back.out(3)' }, c.t);
    ctx.tl.hit(`${P}-r`, { scale: 1, opacity: 0.9 }, { scale: 3.2, opacity: 0, duration: 0.7, ease: 'power2.out' }, c.t + 0.05);
    ctx.tl.fromTo(`${P}-p`, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.42, ease: 'power2.inOut' }, c.t + 0.06);
    ctx.tl.fromTo(`${P}-l .fx-ln > span`, { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'expo.out', stagger: 0.07 }, c.t + 0.3);
    if (c.t1 != null) {
      ctx.tl.fromTo(`${P}-d`, { opacity: 1 }, { opacity: 0, duration: 0.2, ease: 'none' }, c.t1);
      ctx.tl.fromTo(`${P}-p`, { opacity: 1 }, { opacity: 0, duration: 0.2, ease: 'none' }, c.t1);
      ctx.tl.fromTo(`${P}-l`, { opacity: 1 }, { opacity: 0, duration: 0.2, ease: 'none' }, c.t1);
    }
  });
  return `${svg}</svg>${lab}`;
}

// ---------- spec row (Apple-style tech specs): hairline + rolling numerals + unit + 2-line caps label per column ----------
// cols: [{value:'8', prefix:'', unit:'', label:['karbonových','tubusů']}]; x0 + colW*i. Numerals rise char by char out of a mask
// (no odometer: a rolling 8 / 32 / 200 shows false specs mid-roll — „5 karbonových tubusů“, „Ø17 mm“)
export function spec(ctx, { id, x0, y, colW, cols, size = 96, t, stagger = 0.14 }) {
  let h = `<i class="gh-hr" id="${ctx.id(`${id}-hr`)}" style="left:${px(x0)};top:${px(y)};width:${px(colW * cols.length - 24)}"></i>`;
  ctx.tl.fromTo(ctx.sel(`${id}-hr`), { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'expo.out' }, t - 0.1);
  cols.forEach((c, i) => {
    const x = x0 + i * colW, tt = t + i * stagger, nid = `${id}-n${i}`;
    const digits = [...((c.prefix || '') + c.value)].map((ch) => `<span class="fx-c">${esc(ch)}</span>`).join('');
    h += `<div class="gh-num" id="${ctx.id(nid)}" style="left:${px(x)};top:${px(y + 16)};font-size:${size}px"><span class="fx-ln"><span>${digits}</span></span></div>`;
    ctx.tl.fromTo(`${ctx.sel(nid)} .fx-c`, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'expo.out', stagger: 0.05 }, tt);
    const nw = ctx.measure((c.prefix || '') + c.value, { font: 'Inter', wght: 800, size }) + 6;
    if (c.unit) h += `<div class="gh-un" id="${ctx.id(`${id}-u${i}`)}" style="left:${px(x + nw)};top:${px(y + 16 + size * 0.5)}">${esc(c.unit)}</div>`;
    h += `<div class="gh-sl" id="${ctx.id(`${id}-l${i}`)}" style="left:${px(x)};top:${px(y + 16 + size + 8)}">${c.label.map((l) => `<span class="fx-ln"><span>${esc(nb(l))}</span></span>`).join('')}</div>`;
    if (c.unit) ctx.tl.fromTo(ctx.sel(`${id}-u${i}`), { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.4, ease: 'expo.out' }, tt + 0.3);
    ctx.tl.fromTo(`${ctx.sel(`${id}-l${i}`)} .fx-ln > span`, { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'expo.out', stagger: 0.06 }, tt + 0.12);
  });
  return h;
}

// ---------- glint star (specular flare on the anodised gear cap) ----------
export function glint(ctx, { id, x, y, size = 260, t, d = 0.55, color = '#fff' }) {
  ctx.tl.fromTo(ctx.sel(id), { scale: 0, rotation: -40 }, { scale: 1, rotation: 15, duration: d * 0.45, ease: 'power2.out' }, t);
  ctx.tl.fromTo(ctx.sel(id), { opacity: 1 }, { opacity: 0, duration: d * 0.55, ease: 'power1.in' }, t + d * 0.45);
  return `<div class="gh-gl" id="${ctx.id(id)}" style="left:${px(x - size / 2)};top:${px(y - size / 2)};width:${px(size)};height:${px(size)};--gc:${color}"><i></i><i class="v"></i><b></b></div>`;
}

// ---------- plain still (secondary products in depth rows): one <img>, no layers ----------
export function still(ctx, { id, k, w, cx, floor: fy, style = '' }) {
  const [nw, nh] = ctx.dims(src(k)), ar = nw / nh, p = pad(k);
  const ww = Math.min(w, nw), h = ww / ar, top = fy - h * (1 - p[3]);
  return { html: `<img class="gh-st" id="${ctx.id(id)}" src="${ctx.asset(src(k))}" alt="" style="left:${px(cx - ww / 2)};top:${px(top)};width:${px(ww)};height:${px(h)};${style}">`, w: ww, h, x: cx - ww / 2, y: top, sel: ctx.sel(id) };
}

// ---------- colourway stack: the 7 Revolut 8 SE colours in one shared box, swapped in place on 8th notes ----------
// times[i] = when colour i appears. Returns sel / cam. A single sweep (masked by the first colour's alpha, same silhouette).
export function stack(ctx, { id, w, cx, floor: fy, times, sweepA = 0.55, shadow = false }) {
  const k0 = COLS[0].k, [nw, nh] = ctx.dims(src(k0)), ar = nw / nh, p = pad(k0);
  const h = w / ar, top = fy - h * (1 - p[3]), vw = w * (1 - p[0] - p[2]);
  const imgs = COLS.map((c, i) => `<img class="fx-prod-img" id="${ctx.id(`${id}-i${i}`)}" src="${ctx.asset(src(c.k))}" alt="" style="opacity:${i ? 0 : 1}">`).join('');
  const sh = shadow ? `<i class="fx-prod-shadow" style="left:${px(w * p[0] + vw * 0.06)};width:${px(vw * 0.88)};top:${px(h * (1 - p[3]) - vw * 0.05)};height:${px(vw * 0.1)};--sho:.8"></i>` : '';
  const u0 = ctx.asset(src(k0));
  const sw = `<i class="fx-prod-sweep" id="${ctx.id(`${id}-sw`)}" style="-webkit-mask-image:url(${u0});mask-image:url(${u0});--sa:105deg;--so:${sweepA}"></i>`;
  times.forEach((t, i) => {
    if (!i) return;
    ctx.tl.set(ctx.sel(`${id}-i${i}`), { opacity: 1 }, t);
    ctx.tl.set(ctx.sel(`${id}-i${i - 1}`), { opacity: 0 }, t);
  });
  const html = `<div class="fx-prod" id="${ctx.id(id)}" style="left:${px(cx - w / 2)};top:${px(top)};width:${px(w)};height:${px(h)}"><div class="fx-abs" id="${ctx.id(`${id}-cam`)}" style="inset:0">${sh}${imgs}${sw}</div></div>`;
  return { html, w, h, x: cx - w / 2, y: top, bottom: top + h * (1 - p[3]), sel: ctx.sel(id), cam: ctx.sel(`${id}-cam`) };
}

// ---------- colour picker rail (e-shop swatches) with a ring that jumps to the active colour ----------
export function swatches(ctx, { id, x, y, gap = 66, r = 18, times, vertical = true, t0 }) {
  const dots = COLS.map((c, i) => `<i class="gh-sw" id="${ctx.id(`${id}-s${i}`)}" style="left:${px((vertical ? 0 : i * gap) - r)};top:${px((vertical ? i * gap : 0) - r)};width:${px(2 * r)};height:${px(2 * r)};background:${c.col}"></i>`).join('');
  const R = r + 10;
  const ring = `<b class="gh-swr" id="${ctx.id(`${id}-ring`)}" style="left:${px(-R)};top:${px(-R)};width:${px(2 * R)};height:${px(2 * R)}"></b>`;
  const ax = vertical ? 'y' : 'x';
  COLS.forEach((_, i) => ctx.tl.fromTo(ctx.sel(`${id}-s${i}`), { scale: 0 }, { scale: 1, duration: 0.35, ease: 'back.out(2.4)' }, t0 + i * 0.03));
  ctx.tl.fromTo(ctx.sel(`${id}-ring`), { scale: 0 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' }, t0 + 0.05);
  times.forEach((t, i) => { if (i) ctx.tl.fromTo(ctx.sel(`${id}-ring`), { [ax]: (i - 1) * gap }, { [ax]: i * gap, duration: Math.min(0.16, (t - times[i - 1]) * 0.7), ease: 'power3.out' }, t); });
  return `<div class="fx-abs" id="${ctx.id(id)}" style="left:${px(x)};top:${px(y)}">${dots}${ring}</div>`;
}

// ---------- edition stamp (circular, engraved feel) ----------
export function stamp(ctx, { id, x, y, size = 210, l1, l2, t, rot = -8 }) {
  ctx.tl.fromTo(ctx.sel(id), { scale: 1.6, rotation: rot - 25, opacity: 0 }, { scale: 1, rotation: rot, opacity: 1, duration: 0.42, ease: 'power4.out' }, t);
  return `<div class="gh-stp" id="${ctx.id(id)}" style="left:${px(x - size / 2)};top:${px(y - size / 2)};width:${px(size)};height:${px(size)}"><span>${esc(nb(l1))}</span><i></i><em>${esc(nb(l2))}</em></div>`;
}
// pill chip (prize line)
export function pill(ctx, { id, text, cx, y, t, size = 30 }) {
  const w = ctx.measure(text, { font: 'Inter', wght: 700, size, upper: true, tracking: 0.14 }) + 96;
  if (t != null) ctx.tl.fromTo(ctx.sel(id), { opacity: 0, y: 24, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'expo.out' }, t);
  return `<div class="gh-pill" id="${ctx.id(id)}" style="left:${px(cx - w / 2)};top:${px(y)};width:${px(w)};font-size:${size}px"><i></i>${esc(nb(text))}</div>`;
}

export const CSS = (S) => `
${S} .gh-pf{position:absolute;left:0;right:0;background:linear-gradient(90deg,#08090a 0%,#1d2125 38%,#2a2f34 52%,#121417 78%,#060708 100%)}
${S} .gh-pt{position:absolute;left:0;right:0;top:0;border-radius:50%;background:radial-gradient(60% 60% at 46% 40%,#363c42 0%,#1b1f22 62%,#101214 100%);box-shadow:inset 0 2px 0 rgba(233,230,226,.22)}
${S} .gh-pr{position:absolute;left:0;right:0;border:0 solid;border-bottom-width:2px;border-radius:0 0 50% 50% / 0 0 100% 100%;opacity:.85}
${S} .gh-pl{position:absolute;left:0;right:0;text-align:center;font-family:'Inter';font-weight:600;font-size:26px;letter-spacing:.3em;text-transform:uppercase;color:rgba(233,230,226,.78);white-space:nowrap}
${S} .gh-co{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible}
${S} .gh-cl{position:absolute;font-family:'Inter';color:${C.bone};white-space:nowrap;text-shadow:0 2px 14px rgba(0,0,0,.6)}
${S} .gh-cl>.fx-ln{font-weight:700;font-size:36px;letter-spacing:.1em;text-transform:uppercase}
${S} .gh-cl>em.fx-ln{font-style:normal;font-weight:500;font-size:26px;letter-spacing:.22em;text-transform:uppercase;color:${C.ice};margin-top:4px}
${S} .gh-gl{position:absolute;pointer-events:none;mix-blend-mode:screen}
${S} .gh-gl i{position:absolute;left:0;top:50%;width:100%;height:4px;margin-top:-2px;border-radius:2px;background:linear-gradient(90deg,transparent,var(--gc) 50%,transparent)}
${S} .gh-gl i.v{transform:rotate(90deg) scaleX(.62)}
${S} .gh-gl b{position:absolute;left:38%;top:38%;width:24%;height:24%;border-radius:50%;background:radial-gradient(closest-side,var(--gc),rgba(255,255,255,0))}
${S} .gh-st{position:absolute;display:block}
${S} .gh-sh{position:absolute;border-radius:50%;pointer-events:none}
${S} .gh-pt2{background:radial-gradient(70% 62% at 50% 34%,#30363c 0%,#1d2125 48%,#121417 78%,#0c0e10 100%);box-shadow:inset 0 3px 0 rgba(233,230,226,.16),inset 0 -2px 0 rgba(0,0,0,.6)}
${S} .gh-num{position:absolute;font-family:'Inter';font-weight:800;line-height:1;color:${C.white};white-space:nowrap}
${S} .fx-prod-sweep{background-image:linear-gradient(var(--sa,105deg),transparent 45.5%,rgba(255,255,255,.35) 48.6%,rgba(255,255,255,.95) 50%,rgba(255,255,255,.35) 51.4%,transparent 54.5%)}
${S} .gh-hr{position:absolute;height:2px;background:linear-gradient(90deg,rgba(233,230,226,.55),rgba(233,230,226,.08));transform-origin:0 50%}
${S} .gh-un{position:absolute;font-family:'Inter';font-weight:700;font-size:38px;letter-spacing:.02em;color:${C.orange};line-height:1}
${S} .gh-sl{position:absolute;font-family:'Inter';font-weight:600;font-size:27px;line-height:1.16;letter-spacing:.14em;text-transform:uppercase;color:${C.ice};white-space:nowrap}
${S} .gh-sl>.fx-ln{display:block}
${S} .gh-sw{position:absolute;border-radius:50%;box-shadow:inset 0 -3px 6px rgba(0,0,0,.35),inset 0 2px 3px rgba(255,255,255,.25)}
${S} .gh-swr{position:absolute;border-radius:50%;border:2px solid ${C.bone};box-sizing:border-box}
${S} .gh-stp{position:absolute;border-radius:50%;border:2px solid ${C.orange};box-shadow:inset 0 0 0 8px ${C.bg},inset 0 0 0 9px rgba(232,146,90,.55);background:rgba(15,17,19,.82);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-family:'Inter';text-transform:uppercase;color:${C.bone}}
${S} .gh-stp span{font-weight:800;font-size:40px;letter-spacing:.02em;line-height:1}
${S} .gh-stp i{display:block;width:44%;height:2px;background:${C.orange};margin:12px 0 11px}
${S} .gh-stp em{font-style:normal;font-weight:600;font-size:20px;letter-spacing:.14em;line-height:1.1}
${S} .gh-pill{position:absolute;display:flex;align-items:center;justify-content:center;gap:16px;height:72px;border-radius:36px;box-sizing:border-box;background:rgba(233,230,226,.08);box-shadow:inset 0 0 0 1.5px rgba(233,230,226,.28);font-family:'Inter';font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${C.bone};white-space:nowrap}
${S} .gh-pill i{display:block;width:12px;height:12px;border-radius:50%;background:${C.orange};box-shadow:0 0 14px ${C.orange}}
`;
