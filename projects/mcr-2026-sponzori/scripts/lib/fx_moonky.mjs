// fx_moonky.mjs — seek-safe helpers for the Moonky block (scripts/blocks/moonky.mjs), concept A „MOONLIGHT MACRO" (research/moonky_ad.md §5).
// Same conventions as fx.mjs: ctx first, local ids through ctx.id, animation pushed into ctx.tl, geometry in px on 1080×1920,
// never a CSS transform on a node that GSAP animates (static transforms only on wrappers nobody tweens).
//
//   C, WORLD, FD, FT                                  brand palette (research/moonky_ad.md §3) + night-sky field + inline font stacks
//   LURES, src(k)                                     the 15 cut-outs of assets_prep/moonky/ads/ with alpha stats (centroid, major axis, length)
//   css(ctx)                                          scoped CSS for the classes below
//   lure(ctx,{id,k,len,cx,cy|anchor,…})               product cut-out placed by its alpha centroid (or an anchor), axis-aligned, length in px
//   moon(ctx,{id,cx,cy,r,ph})  · phase(ctx,id,t,a,b)  the moon: glow + earthshine + hairline ring + lit disk whose shadow circle moves (phases)
//   stars(ctx,{id,n,seed})                            star field in ONE element (box-shadow list), slow drift
//   vtype(ctx,{id,lines,times,…}) · vtypeOut(…)       word-synced kinetic type (each word revealed at its VO time), explicit lines
//   specBar(ctx,{id,x,y,w,cells,label,t,times})       glass spec row (Apple-style cells divided by hairlines), cells land on beats
//   pill(ctx,{id,text,cx,y,t})                        outlined lime pill („Věnuje ceny · MČR 2026")
//   orbit(ctx,{id,items,cx,cy,R,tilt,len,persp})      3D carousel ring (CSS perspective, billboarded lures) around the moon
//   irisOut(ctx,{cx,cy,color,d})                      block exit: a disc of the next block's colour grows from the moon (with a moonlight rim)
import fs from 'node:fs';
import path from 'node:path';
import { esc, nb, rnd, ROOT } from './util.mjs';

const px = (n) => `${Math.round(n * 10) / 10}px`;

// ---------- palette (research/moonky_ad.md §3: FB badge / jar labels, moonky.cz CSS, colours sampled from the lures) ----------
export const C = { night: '#0E1424', night2: '#141C24', deep: '#070A13', moon: '#FFFFFF', moonlight: '#6883BA', lime: '#9CC903', grey: '#E2E2E2', pink: '#EC638B', orange: '#F49E0B', brown: '#734545' };
// night sky: Moonky navy, lighter where the moon stands, many stops (no banding)
export const WORLD = 'radial-gradient(105% 62% at 50% 47%, #1d2a47 0%, #1a2541 12%, #16203a 24%, #121b31 36%, #0E1424 50%, #0b1020 64%, #080c19 78%, #060912 90%, #04060c 100%)';
export const FD = "font-family:'Exo 2'", FT = "font-family:'Source Sans 3'";

// ---------- products: assets_prep/moonky/ads/ (clean cut-outs, no halos / watermarks; research/moonky_ad.md §2) ----------
// cen = alpha centroid (fraction of the PNG), ang = major-axis angle in deg (image coords, + = clockwise), L / T = length / thickness
// along the axes in native px (PCA on alpha > 0.5, 19. 10.). name / code / col = product title on moonky.cz.
const ADS = 'assets_prep/moonky/ads/';
export const LURES = {
  h1: { f: 'H1_gamer_big_dc03_brown_orange.png', w: 2544, h: 1006, cen: [0.533, 0.478], ang: -2.2, L: 2406, T: 815, name: 'Gamer Big', code: 'DC03', col: 'Brown / Orange' },
  h2: { f: 'H2_savory_c06_green.png', w: 2005, h: 586, cen: [0.535, 0.532], ang: -1.3, L: 1887, T: 462, name: 'Savory', code: 'C06', col: 'Green' },
  h3: { f: 'H3_coccon_jr_c04_black.png', w: 2268, h: 1330, cen: [0.572, 0.41], ang: 21.6, L: 2246, T: 893, name: 'Coccon Jr.', code: 'C04', col: 'Black' },
  s1: { f: 'S1_savory_c01_pink_bubblegum.png', w: 2089, h: 885, cen: [0.533, 0.589], ang: 11.9, L: 1978, T: 518, name: 'Savory', code: 'C01', col: 'Pink Bubblegum' },
  s2: { f: 'S2_savory_c02_orange_fluo.png', w: 1485, h: 1385, cen: [0.594, 0.476], ang: 42.4, L: 1772, T: 603, name: 'Savory', code: 'C02', col: 'Orange fluo' },
  s3: { f: 'S3_savory_c03_brown_metalic.png', w: 2077, h: 958, cen: [0.534, 0.584], ang: 15.3, L: 1976, T: 524, name: 'Savory', code: 'C03', col: 'Brown metalic' },
  s4: { f: 'S4_savory_c04_black.png', w: 1693, h: 1029, cen: [0.573, 0.421], ang: 22.2, L: 1718, T: 779, name: 'Savory', code: 'C04', col: 'Black' },
  s5: { f: 'S5_savory_dc03_brown_orange.png', w: 2100, h: 1703, cen: [0.594, 0.421], ang: 35.3, L: 2422, T: 961, name: 'Savory', code: 'DC03', col: 'Brown / Orange' },
  s6: { f: 'S6_scelet_c01_pink_bubblegum.png', w: 1168, h: 430, cen: [0.583, 0.464], ang: 10.5, L: 1099, T: 331, name: 'Scelet', code: 'C01', col: 'Pink Bubblegum' },
  s7: { f: 'S7_coccon_dc04_yellow_orange.png', w: 1189, h: 781, cen: [0.585, 0.403], ang: 28.6, L: 1228, T: 460, name: 'Coccon', code: 'DC04', col: 'Yellow / Orange' },
  s8: { f: 'S8_scelet_jr_c08_coffee_milk.png', w: 1015, h: 480, cen: [0.598, 0.484], ang: 21.4, L: 1015, T: 330, name: 'Scelet Jr.', code: 'C08', col: 'Coffee milk' },
  s9: { f: 'S9_coccon_c02_orange_fluo.png', w: 982, h: 600, cen: [0.572, 0.405], ang: 25.8, L: 985, T: 362, name: 'Coccon', code: 'C02', col: 'Orange fluo' },
  s10: { f: 'S10_master_c05_white.png', w: 2120, h: 895, cen: [0.559, 0.437], ang: -10.5, L: 1978, T: 738, name: 'Master', code: 'C05', col: 'White' },
  s11: { f: 'S11_gamer_big_c01_pink_bubblegum.png', w: 911, h: 340, cen: [0.535, 0.492], ang: -2.9, L: 862, T: 266, name: 'Gamer Big', code: 'C01', col: 'Pink Bubblegum' },
  s12: { f: 'S12_gradient_blue_pink.png', w: 891, h: 269, cen: [0.52, 0.55], ang: -0.9, L: 840, T: 219, name: null },   // category image: model not named → never labelled
};
// _meta.json (pad, glint, dominant colour) merged in
(() => {
  let M = {};
  try { M = JSON.parse(fs.readFileSync(path.join(ROOT, ADS, '_meta.json'), 'utf8')); } catch { M = {}; }
  for (const [k, l] of Object.entries(LURES)) {
    const m = M[l.f.replace(/\.png$/, '')] || {};
    l.k = k; l.src = ADS + l.f; l.pad = m.pad || [0.03, 0.05, 0.03, 0.05]; l.glint = m.glint || [0.5, 0.3];
    l.dom = (m.dominant || []).map((d) => d.hex);
  }
})();
export const src = (k) => LURES[k].src;

// font families go INLINE (a <style> inside the sub-composition that names a family fails lint font_family_without_font_face)
export const css = (ctx) => `
${ctx.S} .mk-vt{position:absolute;margin:0;white-space:nowrap}
${ctx.S} .mk-vt .fx-ln{padding:.16em .16em .08em 0;margin:-.16em -.16em -.08em 0}
${ctx.S} .mk-moon{position:absolute;border-radius:50%}
${ctx.S} .mk-glass{position:absolute;border-radius:26px;background:rgba(255,255,255,.085);-webkit-backdrop-filter:blur(20px) saturate(1.45);backdrop-filter:blur(20px) saturate(1.45);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.22),inset 0 1.5px 0 rgba(255,255,255,.28),0 26px 54px rgba(2,4,10,.42)}
${ctx.S} .mk-cell{position:absolute;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;overflow:hidden}
${ctx.S} .mk-cell>div{white-space:nowrap;line-height:1}
${ctx.S} .mk-sep{position:absolute;top:22%;bottom:22%;width:1.5px;background:rgba(255,255,255,.28)}
${ctx.S} .mk-lbl{position:absolute;white-space:nowrap;line-height:1;text-transform:uppercase}
${ctx.S} .mk-pill{position:absolute;display:flex;align-items:center;gap:16px;white-space:nowrap;border-radius:999px;box-sizing:border-box;line-height:1;text-transform:uppercase}
${ctx.S} .mk-3d{position:absolute;left:0;top:0;width:0;height:0;transform-style:preserve-3d}
${ctx.S} .mk-pop{position:absolute}
${ctx.S} .mk-flip{position:absolute;overflow:hidden}
`;

// ======================================================================================================
// LURE — cut-out placed by its alpha centroid (cx, cy) or by an anchor {u, v, x, y} (normalised PNG point → screen point; rot must be 0),
// axis-aligned to `angle` (deg on screen; null = keep the photo's own angle), visible length `len` px along the major axis.
// Layers like fx.product: #id (entrance) > #id-cam (camera) > shadow + #id-tl (tilt) > #id-rot (static rotation about the centroid) > img + sweep
// ======================================================================================================
export function lure(ctx, { id, k, len, cx = 540, cy = 960, anchor = null, angle = 0, ground = 'none', shadow = 0.5, sweep = true, sweepOpacity = 0.7, sweepAngle = 105, maxUp = 1.3, style = '', imgStyle = '' }) {
  const m = LURES[k];
  const [sw] = ctx.dims(m.src);
  let s = len / m.L;                                  // native px → screen px
  const cap = (sw * maxUp) / m.w;
  if (s > cap) { ctx.warn(`lure ${m.f} at ${Math.round(len)} px would upscale > ${maxUp}× staged ${sw}px — capped`); s = cap; }
  const w = m.w * s, h = m.h * s;
  const ox = m.cen[0] * w, oy = m.cen[1] * h;          // centroid in element px
  let left, top;
  if (anchor) { left = anchor.x - anchor.u * w; top = anchor.y - anchor.v * h; } else { left = cx - ox; top = cy - oy; }
  const rot = angle == null ? 0 : angle + m.ang * -1;  // rotate the major axis onto `angle`
  const url = ctx.asset(m.src);
  const L = m.L * s, T = m.T * s;
  const sh = ground === 'float'
    ? `<i class="fx-prod-shadow" id="${ctx.id(`${id}-sh`)}" style="left:${px(ox - L * 0.4)};width:${px(L * 0.8)};top:${px(oy + T * 0.5 + Math.max(26, T * 0.32))};height:${px(Math.max(26, T * 0.26))};--sho:${shadow};filter:blur(12px)"></i>` : '';
  const sv = sweep ? `<i class="fx-prod-sweep" id="${ctx.id(`${id}-sw`)}" style="-webkit-mask-image:url(${url});mask-image:url(${url});--sa:${sweepAngle}deg;--so:${sweepOpacity}"></i>` : '';
  const html = `<div class="fx-prod" id="${ctx.id(id)}" style="left:${px(left)};top:${px(top)};width:${px(w)};height:${px(h)};${style}"><div class="fx-abs" id="${ctx.id(`${id}-cam`)}" style="inset:0">${sh}<div class="fx-prod-tilt" id="${ctx.id(`${id}-tl`)}"><div class="fx-abs" id="${ctx.id(`${id}-rot`)}" style="inset:0;${rot ? `transform:rotate(${rot.toFixed(2)}deg);transform-origin:${px(ox)} ${px(oy)};` : ''}"><img class="fx-prod-img" id="${ctx.id(`${id}-im`)}" src="${url}" alt="" style="${imgStyle}">${sv}</div></div></div></div>`;
  const at = (u, v) => [left + u * w, top + v * h];
  return { html, w, h, x: left, y: top, s, L, T, ox, oy, cen: [left + ox, top + oy], sel: ctx.sel(id), cam: ctx.sel(`${id}-cam`), at };
}

// ======================================================================================================
// MOON — glow + earthshine + hairline ring (the circle of the logo, as a line) + lit disk. The lit disk is masked by a shadow circle
// whose centre x (--sx, px inside the disk box) moves: sx = r → new moon, sx = r − Δ → crescent of width Δ, sx ≤ −r → full moon.
// ======================================================================================================
export const PH = (r, f) => r - f * r;                // phase helper: f = 0 (new) … 2.2 (full)
export function moon(ctx, { id = 'moon', cx = 540, cy = 930, r = 240, ph = 0.4, glow = 0.62, glowSize = 1500 } = {}) {
  const sx = PH(r, ph), soft = 7;
  const m = `radial-gradient(circle ${r + soft}px at var(--sx) 50%, transparent ${r - soft}px, #000 ${r + soft}px)`;
  const disk = [
    'radial-gradient(circle at 63% 37%, rgba(104,131,186,.30) 0, rgba(104,131,186,.20) 7%, transparent 12%)',
    'radial-gradient(circle at 44% 63%, rgba(104,131,186,.26) 0, rgba(104,131,186,.16) 10%, transparent 17%)',
    'radial-gradient(circle at 70% 69%, rgba(104,131,186,.20) 0, transparent 9%)',
    'radial-gradient(circle at 30% 34%, rgba(104,131,186,.14) 0, transparent 8%)',
    'radial-gradient(circle at 40% 35%, #ffffff 0%, #f1f4fb 26%, #d6def0 56%, #a9badd 84%, #8399c8 100%)',
  ].join(',');
  return `<div class="fx-abs" id="${ctx.id(id)}" style="left:0;top:0;width:${ctx.W}px;height:${ctx.H}px">
    <div class="fx-glow" id="${ctx.id(`${id}-g`)}" style="left:${px(cx - glowSize / 2)};top:${px(cy - glowSize / 2)};width:${glowSize}px;height:${glowSize}px;background:radial-gradient(closest-side,rgba(150,172,222,.55),rgba(104,131,186,.26) 34%,rgba(104,131,186,.08) 62%,rgba(104,131,186,0));opacity:${glow}"></div>
    <div class="mk-moon" id="${ctx.id(`${id}-e`)}" style="left:${px(cx - r)};top:${px(cy - r)};width:${r * 2}px;height:${r * 2}px;background:radial-gradient(circle at 40% 38%,rgba(150,170,214,.15),rgba(104,131,186,.07));box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.16)"></div>
    <div class="mk-moon" id="${ctx.id(`${id}-d`)}" style="left:${px(cx - r)};top:${px(cy - r)};width:${r * 2}px;height:${r * 2}px;background:${disk};box-shadow:0 0 70px rgba(170,190,235,.28);--sx:${px(sx)};-webkit-mask-image:${m};mask-image:${m}"></div>
  </div>`;
}
export function phase(ctx, id, t, f0, f1, { r = 240, d = 0.55, ease = 'expo.out' } = {}) {
  ctx.tl.fromTo(ctx.sel(`${id}-d`), { '--sx': px(PH(r, f0)) }, { '--sx': px(PH(r, f1)), duration: d, ease }, t);
}

// star field: one 2×2 element, every star is a box-shadow (seeded), slow drift up
export function stars(ctx, { id = 'stars', n = 54, seed = 11, y0 = 60, y1 = 1700, drift = -46 } = {}) {
  const list = [];
  for (let i = 0; i < n; i++) {
    const x = Math.round(20 + rnd(seed + i * 3.1) * 1040), y = Math.round(y0 + rnd(seed * 7 + i * 5.3) * (y1 - y0));
    const big = rnd(seed + i * 11.7);
    const sp = big > 0.92 ? 1.6 : big > 0.7 ? 0.8 : 0.2, a = (0.25 + 0.6 * rnd(seed * 3 + i * 2.2)).toFixed(2);
    list.push(`${x}px ${y}px 0 ${sp}px rgba(220,230,255,${a})`);
  }
  ctx.tl.fromTo(ctx.sel(id), { y: 0 }, { y: drift, duration: ctx.dur, ease: 'none' }, 0);
  return `<div class="fx-abs" id="${ctx.id(id)}" style="left:0;top:0;width:2px;height:2px;border-radius:50%;box-shadow:${list.join(',')}"></div>`;
}

// ======================================================================================================
// WORD-SYNCED TYPE — explicit lines [{text, color, sizes, wght, italic, tracking, font}], every word revealed at times[k] (k = word
// index over all lines). Czech NBSP typography first (nb), so „s českou" is one word. Returns {html, h, words, sel, lines}.
// ======================================================================================================
export function vtype(ctx, { id, lines, times = [], x = ctx.safe.left, y = 404, w = 952, align = 'left', lh = 1.0, gap = 0, d = 0.5, ease = 'expo.out', from = { yPercent: 118, opacity: 0 }, upper = true }) {
  let k = 0, yy = 0, out = '';
  const words = [], fitted = [];
  lines.forEach((ln, li) => {
    const font = ln.font || 'Exo 2', wght = ln.wght ?? 900, italic = ln.italic ?? true, tracking = ln.tracking ?? -0.01;
    const t = nb(ln.text);
    const f = ctx.fit(t, { font, wght, italic, upper, tracking, maxW: w - 12, maxLines: 1, sizes: ln.sizes || [132, 124, 116, 108, 100, 92, 84, 76, 68] });
    if (f.overflow) ctx.warn(`vtype "${ln.text}" overflows ${w}px`);
    const size = f.size;
    const inner = t.split(' ').map((wd) => { const wid = `${id}-w${k++}`; words.push(wid); return `<span class="fx-c" id="${ctx.id(wid)}">${esc(wd)}</span>`; }).join(' ');
    out += `<div class="mk-vt" style="left:0;top:${px(yy)};width:${px(w)};${font === 'Exo 2' ? FD : `font-family:'${font}'`};font-weight:${wght};${italic ? 'font-style:italic;' : ''}font-size:${size}px;line-height:${lh};letter-spacing:${tracking}em;color:${ln.color || '#fff'};text-align:${align};${upper ? 'text-transform:uppercase;' : ''}${ln.style || ''}"><span class="fx-ln" id="${ctx.id(`${id}-l${li}`)}"><span>${inner}</span></span></div>`;
    fitted.push({ size, y: yy });
    yy += size * lh + (ln.gap ?? gap);
  });
  const html = `<div class="fx-abs" id="${ctx.id(id)}" style="left:${px(x)};top:${px(y)};width:${px(w)};height:${px(yy)}">${out}</div>`;
  const T = Object.fromEntries(Object.keys(from).map((p) => [p, p === 'opacity' || p === 'scale' ? 1 : 0]));
  words.forEach((wid, i) => ctx.tl.fromTo(ctx.sel(wid), from, { ...T, duration: d, ease }, times[Math.min(i, times.length - 1)] ?? 0));
  return { html, h: yy, words, sel: ctx.sel(id), lines: fitted };
}
export function vtypeOut(ctx, V, t, { d = 0.26, stagger = 0.03, to = { yPercent: -118, opacity: 0 } } = {}) {
  const F = Object.fromEntries(Object.keys(to).map((p) => [p, p === 'opacity' || p === 'scale' ? 1 : 0]));
  V.words.forEach((wid, i) => ctx.tl.fromTo(ctx.sel(wid), F, { ...to, duration: d, ease: 'power3.in' }, t + i * stagger));
}

// ======================================================================================================
// SPEC BAR — glass row, cells [{label, value, w (fraction)}] separated by hairlines. Frame grows from the left at t, cell k lands at
// times[k] (value slides up from its mask, label fades). Optional kicker label above the bar. Returns {html, h, sel, ids}.
// ======================================================================================================
export function specBar(ctx, { id, x = ctx.safe.left, y = 1250, w = 876, h = 128, cells, label = '', t = 0, times = [], accent = C.lime, vs = 54, ls = 24 }) {
  const tot = cells.reduce((a, c) => a + (c.w || 1), 0);
  let cx = 0, inner = '';
  cells.forEach((c, i) => {
    const cw = ((c.w || 1) / tot) * w;
    if (i) inner += `<i class="mk-sep" id="${ctx.id(`${id}-s${i}`)}" style="left:${px(cx)}"></i>`;
    const pad = 30;
    inner += `<div class="mk-cell" style="left:${px(cx + pad)};width:${px(cw - pad * 1.4)}">${c.label ? `<div id="${ctx.id(`${id}-l${i}`)}" style="${FT};font-weight:700;font-size:${ls}px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.66);margin-bottom:12px">${esc(nb(c.label))}</div>` : ''}<div style="overflow:hidden;padding:.12em .14em .1em 0;margin:-.12em -.14em -.1em 0"><div id="${ctx.id(`${id}-v${i}`)}" style="${FD};font-weight:800;font-style:italic;font-size:${c.vs || vs}px;letter-spacing:-.005em;color:#fff;${c.upper ? 'text-transform:uppercase;' : ''}">${esc(nb(c.value))}</div></div></div>`;
    cx += cw;
  });
  let html = '';
  if (label) {
    html += `<div class="mk-lbl" id="${ctx.id(`${id}-k`)}" style="left:${px(x + 4)};top:${px(y - 46)};${FT};font-weight:700;font-size:28px;letter-spacing:.2em;color:${accent}">${esc(nb(label))}</div>`;
    ctx.tl.fromTo(ctx.sel(`${id}-k`), { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.5, ease: 'expo.out' }, t);
  }
  html += `<div class="mk-glass" id="${ctx.id(id)}" style="left:${px(x)};top:${px(y)};width:${px(w)};height:${px(h)}">${inner}<i class="fx-abs" style="left:0;top:26%;bottom:26%;width:6px;border-radius:0 6px 6px 0;background:${accent}"></i></div>`;
  ctx.tl.set(ctx.sel(id), { transformOrigin: '0% 50%' }, 0);
  ctx.tl.fromTo(ctx.sel(id), { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.55, ease: 'expo.out' }, t);
  cells.forEach((c, i) => {
    const tc = times[i] ?? t + 0.15 * (i + 1);
    ctx.tl.fromTo(ctx.sel(`${id}-v${i}`), { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'expo.out' }, tc);
    if (c.label) ctx.tl.fromTo(ctx.sel(`${id}-l${i}`), { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power1.out' }, tc);
    if (i) { ctx.tl.set(ctx.sel(`${id}-s${i}`), { transformOrigin: '50% 50%' }, 0); ctx.tl.fromTo(ctx.sel(`${id}-s${i}`), { scaleY: 0 }, { scaleY: 1, duration: 0.4, ease: 'expo.out' }, tc - 0.04); }
  });
  return { html, h, sel: ctx.sel(id), ksel: label ? ctx.sel(`${id}-k`) : null };
}

// outlined lime pill (e.g. „Věnuje ceny · MČR 2026"), centred on cx
export function pill(ctx, { id, text, cx = 540, y, size = 32, h = 72, padX = 34, color = C.lime, t = 0 }) {
  const tw = ctx.measure(nb(text), { font: 'Source Sans 3', size, wght: 700, upper: true, tracking: 0.14 });
  const w = tw + padX * 2 + 26;
  ctx.tl.fromTo(ctx.sel(id), { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, t);
  return { w, h, html: `<div class="mk-pill" id="${ctx.id(id)}" style="left:${px(cx - w / 2)};top:${px(y)};width:${px(w)};height:${h}px;padding:0 ${padX}px;border:2.5px solid ${color};background:rgba(14,20,36,.55);${FT};font-weight:700;font-size:${size}px;letter-spacing:.14em;color:#fff"><i style="display:block;width:12px;height:12px;border-radius:50%;background:${color};flex-shrink:0"></i><span>${esc(nb(text))}</span></div>` };
}

// ======================================================================================================
// ORBIT — 3D carousel ring around (cx, cy): CSS perspective on a 0×0 camera node, a static tilt (rotateX), a spinning ring (GSAP rotation),
// items on the circle counter-rotating (GSAP), each billboarded back to the camera (static rotateX(−tilt)), so the lures stay upright and
// undistorted while the perspective makes the front ones bigger and the 3D context sorts them by depth.
//   ids: `${id}` camera (scale / opacity for the exit) · `${id}-spin` ring · `${id}-i${n}` counter-rotation · `${id}-p${n}` pop (scale/opacity)
//   `${id}-p${n}-sw` sweep (fx.sweep(ctx, `${id}-p${n}`, t))
// ======================================================================================================
export function orbit(ctx, { id = 'orb', items, cx = 540, cy = 930, R = 300, tilt = 70, len = 240, persp = 1500, phi0 = 90, seed = 5, sweepOpacity = 0.6 }) {
  const n = items.length;
  let ring = '';
  const slots = items.map((k, i) => {
    const m = LURES[k];
    const phi = ((phi0 + (360 * i) / n) * Math.PI) / 180;
    const x = R * Math.cos(phi), y = R * Math.sin(phi);
    const s = (len * (m.big || 1)) / m.L, w = m.w * s, h = m.h * s, ox = m.cen[0] * w, oy = m.cen[1] * h;
    const rot = -m.ang + (rnd(seed + i * 7.3) - 0.5) * 26;
    const url = ctx.asset(m.src);
    ring += `<div class="mk-3d" id="${ctx.id(`${id}-i${i}`)}" style="left:${px(x)};top:${px(y)}"><div class="mk-3d" style="transform:rotateX(${-tilt}deg)"><div class="mk-pop" id="${ctx.id(`${id}-p${i}`)}" style="left:${px(-ox)};top:${px(-oy)};width:${px(w)};height:${px(h)};transform-origin:${px(ox)} ${px(oy)}"><div class="fx-abs" style="inset:0;transform:rotate(${rot.toFixed(1)}deg);transform-origin:${px(ox)} ${px(oy)}"><img class="fx-prod-img" src="${url}" alt=""><i class="fx-prod-sweep" id="${ctx.id(`${id}-p${i}-sw`)}" style="-webkit-mask-image:url(${url});mask-image:url(${url});--sa:105deg;--so:${sweepOpacity}"></i></div></div></div></div>`;
    return { k, phi, x, y };
  });
  const html = `<div class="mk-3d" id="${ctx.id(id)}" style="left:${px(cx)};top:${px(cy)};perspective:${persp}px"><div class="mk-3d" style="transform:rotateX(${tilt}deg)"><div class="mk-3d" id="${ctx.id(`${id}-spin`)}">${ring}</div></div></div>`;
  return { html, n, slots, sel: ctx.sel(id), spin: ctx.sel(`${id}-spin`), item: (i) => ctx.sel(`${id}-i${i}`), pop: (i) => ctx.sel(`${id}-p${i}`) };
}
// spin the ring from a0 to a1 (deg) and counter-rotate every item, so they stay upright
export function orbitSpin(ctx, O, t, a0, a1, { d = 1, ease = 'none' } = {}) {
  ctx.tl.fromTo(O.spin, { rotation: a0 }, { rotation: a1, duration: d, ease }, t);
  for (let i = 0; i < O.n; i++) ctx.tl.fromTo(O.item(i), { rotation: -a0 }, { rotation: -a1, duration: d, ease }, t);
}

// ======================================================================================================
// IRIS OUT — a disc of the next block's colour grows from (cx, cy) past the farthest corner; a thin moonlight rim rides its edge.
// Covered at `end` (handoff contract: meet at a solid colour).
// ======================================================================================================
export function irisOut(ctx, { id = 'irs', cx = 540, cy = 930, color = ctx.next?.theme?.bg || ctx.theme.bg, d = 0.46, end = ctx.dur, ring = 'rgba(214,224,246,.9)', ease = 'power3.in' } = {}) {
  const R = Math.hypot(Math.max(cx, ctx.W - cx), Math.max(cy, ctx.H - cy)) + 30, t = end - d;
  ctx.overlay(`<div class="fx-ov" id="${ctx.id(id)}" style="background:${color};clip-path:circle(0px at ${px(cx)} ${px(cy)})"></div><i class="fx-ov" id="${ctx.id(`${id}-rg`)}" style="inset:auto;left:${px(cx - R)};top:${px(cy - R)};width:${px(R * 2)};height:${px(R * 2)};border-radius:50%;border:4px solid ${ring};box-shadow:0 0 30px rgba(170,190,235,.5)"></i>`);
  ctx.tl.fromTo(ctx.sel(id), { clipPath: `circle(0px at ${px(cx)} ${px(cy)})` }, { clipPath: `circle(${Math.round(R)}px at ${px(cx)} ${px(cy)})`, duration: d, ease }, t);
  ctx.tl.fromTo(ctx.sel(`${id}-rg`), { scale: 0.001, opacity: 0 }, { scale: 1, opacity: 1, duration: d, ease }, t);
}
