// fx_activefishing.mjs — helpers used only by blocks/activefishing.mjs (block, Reel hook, Reel end card).
// Concept B „COLOUR DROP“ (research/activefishing_ad.md): the shop's own white world (Shoptet body, Nunito, orange pill buttons),
// the logo's orange gradient used as light and as one full-bleed counter beat, Saira Extra Condensed 900 for numbers / short caps
// (echo of the logo lettering). Products = clean cut-outs from assets_prep/activefishing/ads + heroes (never > 1.3× natural).
// All seek-safe: fromTo / hit / set only, positions via left/top, transforms only through the timeline.
import { esc, nb } from './util.mjs';

const px = (n) => `${Math.round(n * 10) / 10}px`;
const pct = (f) => `${Math.round(f * 1000) / 10}%`;
export const AD = 'assets_prep/activefishing/ads/';
export const HE = 'assets_prep/activefishing/heroes/';
export const SAIRA = 'Saira Extra Condensed';

// brand tokens (logo pixels + site CSS, research/activefishing_ad.md §3)
export const C = { o1: '#E39025', o2: '#E2812D', o3: '#DD603A', o4: '#DF5942', web: '#F28A27', web2: '#F59B10', ink: '#111111', paper: '#f4f3f1' };
export const GRAD = `linear-gradient(180deg, ${C.o1} 0%, ${C.o2} 38%, ${C.o3} 74%, ${C.o4} 100%)`;
export const BTN = 'linear-gradient(180deg, #F59A2C 0%, #F28A27 45%, #E5702D 100%)';

// products: f = file, bb = visible bbox (alpha > 100) as fractions [x0, x1, y0, y1], ms = staging max side (hi-res heroes),
// eye = H1 eye position (macro push origin). Names only from the shop's product titles (verified).
export const P = {
  chart: { f: `${AD}H1_timon_chibi_futten_fs_tropical_chart_pink.png`, bb: [0.005, 0.995, 0.013, 0.987], ms: 2400, eye: [0.171, 0.385], name: 'Tropical Chart Pink', tint: '#ffc2d2', dot: '#f7385c' },
  cobalt: { f: `${AD}S1_timon_chibi_futten_fs_uv_cobalt_blue.png`, bb: [0.024, 0.975, 0.054, 0.942], name: 'UV Cobalt Blue', tint: '#c4d8fb', dot: '#034a9e' },
  gold: { f: `${AD}S3_timon_chibi_futten_fs_gold_shower.png`, bb: [0.022, 0.976, 0.052, 0.948], name: 'Gold Shower', tint: '#f1dd9e', dot: '#a8862f' },
  red: { f: `${AD}S2_timon_chibi_futten_fs_red_black_glitter.png`, bb: [0.022, 0.975, 0.057, 0.943], name: 'Red Black Glitter', tint: '#f6c2c4', dot: '#a3262b' },
  holo: { f: `${AD}S4_timon_chibi_futten_fs_hologram_bait.png`, bb: [0.023, 0.977, 0.05, 0.95], name: 'Hologram Bait', tint: '#e9dcc6', dot: '#b4976b' },
  sofia: { f: `${AD}H2_nories_sofia_1-2g_sk017_hot_mango_pair.png`, bb: [0.005, 0.995, 0.007, 0.992], ms: 2400 },
  varivas: { f: `${AD}H3_varivas_super_trout_area_es2_ester_natural.png`, bb: [0.015, 0.983, 0.019, 0.981] },
  forte15: { f: `${AD}S5_velvet_arts_forte_1-5g_no1.png`, bb: [0.032, 0.966, 0.051, 0.946] },
  panicra: { f: `${AD}S6_timon_micro_panicra_mr-f_rattle_yazy_pellet_san.png`, bb: [0.032, 0.966, 0.078, 0.917] },
  mukai: { f: `${AD}S7_mukai_upward_zanmu_35s_6ck.png`, bb: [0.008, 0.991, 0.015, 0.984], ms: 1800 },
  scheila: { f: `${AD}S8_valkein_scheila_1-8g_no80_delicious_peach.png`, bb: [0.03, 0.968, 0.047, 0.95] },
  khor: { f: `${HE}h02_khor_frea.png`, bb: [0.044, 0.956, 0.03, 0.968] },
  forte06: { f: `${HE}h03_velvetarts_forte_06.png`, bb: [0.03, 0.967, 0.062, 0.936] },
  wah: { f: `${HE}h04_luckycraft_wah33f.png`, bb: [0.03, 0.97, 0.063, 0.934] },
};
// register every product once with its staging size BEFORE anything else refs it (the first ref decides maxSide)
export function prime(ctx) { for (const p of Object.values(P)) ctx.asset(p.f, p.ms ? { maxSide: p.ms } : {}); }

// geometry: show product k with its VISIBLE box V px wide (or VH px tall), visible centre at (cx, cy)
export function geom(ctx, k, { V = null, VH = null, cx = 0, cy = 0, maxUp = 1.3 } = {}) {
  const p = P[k]; if (!p) throw new Error(`fx_activefishing: unknown product ${k}`);
  const [nw, nh] = ctx.dims(p.f);
  const vw = p.bb[1] - p.bb[0], vh = p.bb[3] - p.bb[2];
  let w = V != null ? V / vw : (VH / vh) * (nw / nh);
  if (w > nw * maxUp + 0.5) { ctx.warn(`product ${p.f.split('/').pop()} wants ${(w / nw).toFixed(2)}× natural — capped at ${maxUp}×`); w = nw * maxUp; }
  const h = (w * nh) / nw, ox = (p.bb[0] + p.bb[1]) / 2, oy = (p.bb[2] + p.bb[3]) / 2;
  return { w, h, left: cx - ox * w, top: cy - oy * h, ox, oy, vw: vw * w, vh: vh * h, url: ctx.asset(p.f), k, up: w / nw };
}

// product: #id (entrance / exit) › #id-cam (camera: push, drift, punch) › #id-r (static pose rotation, 3D tilt) › img + sweep (#id-sw)
// shadow: soft contact ellipse under the visible object (inside #id, not rotated). drop: CSS drop-shadow on the image.
export function prod(ctx, { id, k, V = null, VH = null, cx, cy, rot = 0, sweep = true, so = 0.6, shadow = 0.28, shY = 0.56, shW = 0.78, drop = '', persp = false, style = '' }) {
  const g = geom(ctx, k, { V, VH, cx, cy });
  const org = `${pct(g.ox)} ${pct(g.oy)}`;
  if (rot) ctx.tl.set(ctx.sel(`${id}-r`), { rotation: rot }, 0);
  const vx = g.ox * g.w, vy = g.oy * g.h;
  const sh = shadow ? `<i class="af-sh" id="${ctx.id(`${id}-sh`)}" style="left:${px(vx - (g.vw * shW) / 2)};top:${px(vy + g.vh * shY - 18)};width:${px(g.vw * shW)};height:${px(Math.max(30, g.vh * 0.16))};opacity:${Math.min(1, shadow / 0.3).toFixed(2)}"></i>` : '';
  const sw = sweep ? `<i class="fx-prod-sweep" id="${ctx.id(`${id}-sw`)}" style="-webkit-mask-image:url(${g.url});mask-image:url(${g.url});--sa:105deg;--so:${so}"></i>` : '';
  const html = `<div class="af-p" id="${ctx.id(id)}" style="left:${px(g.left)};top:${px(g.top)};width:${px(g.w)};height:${px(g.h)};transform-origin:${org};${style}">${sh}<div class="fx-abs" id="${ctx.id(`${id}-cam`)}" style="inset:0;transform-origin:${org};${persp ? 'perspective:1300px;' : ''}"><div class="fx-abs" id="${ctx.id(`${id}-r`)}" style="inset:0;transform-origin:${org}"><img src="${g.url}" alt="" style="${drop ? `filter:drop-shadow(${drop})` : ''}">${sw}</div></div></div>`;
  return { html, g, sel: ctx.sel(id), cam: ctx.sel(`${id}-cam`), r: ctx.sel(`${id}-r`) };
}
export function sweep(ctx, id, t, { d = 0.7, ease = 'power2.inOut' } = {}) {
  ctx.tl.fromTo(ctx.sel(`${id}-sw`), { backgroundPosition: '110% 0%' }, { backgroundPosition: '-10% 0%', duration: d, ease }, t);
}

// fan ("hand of cards") hinged at (x, y): every item's visible centre sits R px out along its arm, arm angle th (deg, clockwise from up).
// items painted in the given order (put the hero last). Arms: #id-a<i>; whole fan: #id (origin = pivot).
export function fan(ctx, { id, items, x, y, R = 360, drop = '0 16px 18px rgba(90,40,10,.28)', style = '' }) {
  let arms = '';
  items.forEach((it, i) => {
    const g = geom(ctx, it.k, { V: it.V ?? null, VH: it.VH ?? null, cx: 0, cy: 0 });
    const org = `${pct(g.ox)} ${pct(g.oy)}`;
    if (it.rot) ctx.tl.set(ctx.sel(`${id}-r${i}`), { rotation: it.rot }, 0);
    arms += `<div class="af-arm" id="${ctx.id(`${id}-a${i}`)}" style="left:${px(x)};top:${px(y)}"><div class="af-p" id="${ctx.id(`${id}-p${i}`)}" style="left:${px(g.left)};top:${px(g.top - (it.R ?? R))};width:${px(g.w)};height:${px(g.h)};transform-origin:${org}"><div class="fx-abs" id="${ctx.id(`${id}-r${i}`)}" style="inset:0;transform-origin:${org}"><img src="${g.url}" alt="" style="filter:drop-shadow(${drop})"><i class="fx-prod-sweep" id="${ctx.id(`${id}-sw${i}`)}" style="-webkit-mask-image:url(${g.url});mask-image:url(${g.url});--sa:105deg;--so:.6"></i></div></div></div>`;
  });
  return { html: `<div class="fx-full" id="${ctx.id(id)}" style="transform-origin:${px(x)} ${px(y)};${style}">${arms}</div>`, sel: ctx.sel(id), arm: (i) => ctx.sel(`${id}-a${i}`), n: items.length };
}
export function fanOpen(ctx, F, items, t, { d = 0.7, step = 0.04, s0 = 0.62 } = {}) {
  const mid = (items.length - 1) / 2;
  items.forEach((it, i) => ctx.tl.fromTo(F.arm(i), { rotation: 0, scale: s0 }, { rotation: it.th, scale: 1, duration: d, ease: 'expo.out' }, t + Math.abs(i - mid) * step));
}
export function fanSweep(ctx, id, n, t, { step = 0.05, d = 0.55 } = {}) {
  for (let i = 0; i < n; i++) ctx.tl.fromTo(ctx.sel(`${id}-sw${i}`), { backgroundPosition: '110% 0%' }, { backgroundPosition: '-10% 0%', duration: d, ease: 'power2.inOut' }, t + i * step);
}

// shop tile (Shoptet product card): white rounded card, product contained in it (no sweep — kept light for the renderer)
export function tile(ctx, { id, k, x, y, w = 250, h = 200, pad = 24, rot = 0 }) {
  const p = P[k], [nw, nh] = ctx.dims(p.f);
  const ar = ((p.bb[1] - p.bb[0]) * nw) / ((p.bb[3] - p.bb[2]) * nh);
  const bw = w - 2 * pad, bh = h - 2 * pad;
  const g = geom(ctx, k, ar > bw / bh ? { V: bw, cx: w / 2, cy: h / 2 } : { VH: bh, cx: w / 2, cy: h / 2 });
  // product as a background layer (not <img>): the same cut-outs appear as <img> elsewhere in the block (lint duplicate_media)
  return `<div class="af-tile" id="${ctx.id(id)}" style="left:${px(x)};top:${px(y)};width:${px(w)};height:${px(h)}"><i style="left:${px(g.left)};top:${px(g.top)};width:${px(g.w)};height:${px(g.h)};background-image:url(${g.url});${rot ? `transform:rotate(${rot}deg);` : ''}"></i></div>`;
}

// shop pill button (site .orange-btn / outline button). tone 'fill' | 'ol'. Returns {html, w, h}.
export function pill(ctx, { id, text, x = null, cx = null, y, size = 34, padX = null, tone = 'fill', tracking = 0.06, style = '' }) {
  const t = nb(text), pX = padX ?? Math.round(size * 0.95), pY = Math.round(size * 0.5);
  const w = ctx.measure(t, { font: 'Nunito', wght: 900, size, upper: true, tracking }) + 2 * pX, h = size + 2 * pY;
  const left = cx != null ? cx - w / 2 : x;
  return { w, h, html: `<div class="af-pill ${tone}" id="${ctx.id(id)}" style="left:${px(left)};top:${px(y)};width:${px(w)};height:${px(h)};font-size:${size}px;letter-spacing:${tracking}em;${style}">${esc(t)}</div>` };
}

// kinetic words: lines = [[{w, t?, grad?, c?}]] — every word slides up through its line mask at its own time t (VO-synced);
// one fitted size for all lines. Exit: out(t) moves the LINE spans (never the word spans → no initial-state clash).
export function words(ctx, { id, lines, x = ctx.safe.left, y, w = ctx.W - ctx.safe.left - ctx.safe.right, font = SAIRA, wght = 900, sizes = [230, 216, 204, 192, 180, 170, 160, 150, 140, 130, 120], lh = 0.98, upper = true, tracking = 0, color = C.ink, align = 'left', d = 0.48, ease = 'expo.out' }) {
  const txt = lines.map((ln) => nb(ln.map((p) => p.w).join(' ')));
  const m = (s) => ctx.measure(s, { font, wght, upper, tracking, size: 100 });
  const longest = txt.reduce((a, b) => (m(b) > m(a) ? b : a));
  const f = ctx.fit(longest, { font, wght, upper, tracking, maxW: w, maxLines: 1, sizes });
  if (f.overflow) ctx.warn(`words "${longest}" overflow ${w}px`);
  const size = f.size;
  let k = 0;
  const body = lines.map((ln, i) => `<span class="fx-ln" id="${ctx.id(`${id}-l${i}`)}"><span>${ln.map((p, j) => {
    const wid = `${id}-w${k++}`;
    if (p.t != null) ctx.tl.fromTo(ctx.sel(wid), { yPercent: 118, opacity: 0 }, { yPercent: 0, opacity: 1, duration: d, ease }, p.t);
    return `${j ? ' ' : ''}<span class="af-w${p.grad ? ' af-grad' : ''}" id="${ctx.id(wid)}"${p.c ? ` style="color:${p.c}"` : ''}>${esc(nb(p.w))}</span>`;
  }).join('')}</span></span>`).join('');
  const sel = ctx.sel(id);
  const html = `<div class="fx-t" id="${ctx.id(id)}" style="left:${px(x)};top:${px(y)};width:${px(w)};font-family:'${font}';font-weight:${wght};font-size:${size}px;line-height:${lh};letter-spacing:${tracking}em;color:${color};text-align:${align};${upper ? 'text-transform:uppercase;' : ''}">${body}</div>`;
  const out = (t, { d: od = 0.28, stagger = 0.05 } = {}) => ctx.tl.fromTo(`${sel} .fx-ln > span`, { yPercent: 0, opacity: 1 }, { yPercent: -125, opacity: 0, duration: od, ease: 'power3.in', stagger }, t);
  return { html, size, h: lines.length * size * lh, sel, out };
}

// block out: rounded shop-card tiles (Shoptet product cards) close the frame in a diagonal wave, bottom-left → top-right.
// Handoff contract: the frame is fully covered by `color` (= next block's bg) at the block end.
export function tilesOut(ctx, { color = ctx.next?.theme?.bg || ctx.theme.bg || '#000', d = 0.46, cols = 4, rows = 7, radius = 30 } = {}) {
  const end = ctx.dur, t0 = end - d, tw = ctx.W / cols, th = ctx.H / rows, span = cols - 1 + rows - 1, td = d * 0.55;
  let h = '';
  for (let r = 0, k = 0; r < rows; r++) for (let c = 0; c < cols; c++, k++) {
    h += `<i id="${ctx.id(`to${k}`)}" style="position:absolute;left:${px(c * tw)};top:${px(r * th)};width:${px(tw)};height:${px(th)};border-radius:${radius}px;background:${color}"></i>`;
    const delay = ((c + (rows - 1 - r)) / span) * (d - td);
    ctx.tl.fromTo(ctx.sel(`to${k}`), { scale: 0 }, { scale: 1.26, duration: td, ease: 'power2.in' }, t0 + delay);
  }
  ctx.overlay(`<div class="fx-ov" id="${ctx.id('tout')}">${h}</div><div class="fx-ov" id="${ctx.id('toutf')}" style="background:${color};opacity:0"></div>`);
  ctx.tl.set(ctx.sel('toutf'), { opacity: 1 }, end - 0.03);
}

// @font-face for Saira Extra Condensed inside every sub-composition (lint checks fonts per file; the root page declares it too)
const LAT = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const EXT = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';
export const FACES = ['700', '800', '900'].flatMap((w) => [['latin', LAT], ['latin-ext', EXT]].map(([r, u]) => `@font-face{font-family:'${SAIRA}';font-style:normal;font-weight:${w};font-display:block;src:url(assets/fonts/saira-extra-condensed-${r}-${w}-normal.woff2) format('woff2');unicode-range:${u};}`)).join('\n');

export const CSS = (S) => `${FACES}
${S} .af-p{position:absolute}
${S} .af-p img{position:absolute;inset:0;width:100%;height:100%;display:block}
${S} .af-p .fx-prod-sweep{inset:0}
${S} .af-sh{position:absolute;border-radius:50%;background:radial-gradient(closest-side,rgba(78,48,20,.3),rgba(78,48,20,0));pointer-events:none}
${S} .af-arm{position:absolute;width:0;height:0;transform-origin:0 0}
${S} .af-w{display:inline-block}
${S} .af-grad{background-image:${GRAD};-webkit-background-clip:text;background-clip:text;color:transparent;padding-top:.22em;margin-top:-.22em}
${S} .af-pill{position:absolute;display:flex;align-items:center;justify-content:center;box-sizing:border-box;border-radius:999px;font-family:'Nunito';font-weight:900;text-transform:uppercase;white-space:nowrap;line-height:1}
${S} .af-pill.fill{background:${BTN};color:#fff;box-shadow:0 14px 30px rgba(223,89,66,.32)}
${S} .af-pill.ol{background:#fff;color:${C.ink};box-shadow:inset 0 0 0 3px ${C.web},0 10px 24px rgba(80,50,20,.10)}
${S} .af-pill.wht{background:#fff;color:${C.ink};box-shadow:0 14px 30px rgba(110,30,0,.25)}
${S} .af-tag{position:absolute;display:flex;align-items:center;gap:14px;font-family:'Nunito';font-weight:900;text-transform:uppercase;white-space:nowrap;line-height:1;color:${C.ink}}
${S} .af-tag i{display:block;flex-shrink:0;width:8px;height:1.05em;border-radius:4px;background:${GRAD}}
${S} .af-cwl{position:absolute;display:flex;align-items:center;gap:12px;font-family:'Nunito';font-weight:800;font-size:27px;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap;line-height:1;color:#3a3a3a}
${S} .af-cwl i{display:block;width:20px;height:20px;border-radius:50%;box-shadow:inset 0 0 0 2px rgba(255,255,255,.6)}
${S} .af-card{position:absolute;border-radius:38px;background:#fff;box-shadow:0 40px 80px rgba(110,30,0,.30)}
${S} .af-tile{position:absolute;border-radius:26px;background:#fff;box-shadow:0 14px 30px rgba(60,40,20,.10),0 0 0 1px rgba(0,0,0,.04)}
${S} .af-tile i{position:absolute;display:block;background:center/100% 100% no-repeat}
${S} .af-url{position:absolute;left:0;right:0;text-align:center;font-family:'Nunito';font-weight:1000;letter-spacing:-.02em;line-height:1;color:${C.ink};white-space:nowrap}
${S} .af-url .o{color:${C.web}}
`;
