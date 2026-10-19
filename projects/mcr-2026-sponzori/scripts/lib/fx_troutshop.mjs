// fx_troutshop.mjs — helpers used only by blocks/troutshop.mjs (block, Reel hook, Reel end card).
// "Rising sun" world from the Troutshop logo: red sun disc + rays, spoons posed by their real body axis,
// a fan of spoons that forms the sun's rays, small product callouts and VO-timed kinetic lines.
// All seek-safe: fromTo / hit / set only, positions via left/top, transforms only through the timeline.
import * as fx from './fx.mjs';
import { esc, nb } from './util.mjs';

const px = (n) => `${Math.round(n * 10) / 10}px`;
const pct = (f) => `${Math.round(f * 1000) / 10}%`;
export const AD = 'assets_prep/troutshop/ads/';

// Spoon geometry of the split cut-outs (assets_prep/troutshop/ads/*_a|_b.png), measured once from the alpha
// (morphological opening removes hook + ring → body; PCA → axis). c = body centre, tail = line-eye end (fractions of the PNG),
// ang = hook direction in degrees clockwise from "up", L = body length / PNG height.
export const GEO = {
  rooney101a: { f: 'hero_01_nories_rooney_2-8g_101_a', c: [0.387, 0.665], tail: [0.073, 0.961], ang: 36.5, L: 0.730, col: '#b9a25e' },
  rooney101b: { f: 'hero_01_nories_rooney_2-8g_101_b', c: [0.592, 0.338], tail: [0.918, 0.039], ang: -143.2, L: 0.731, col: '#f1e80d' },
  forte32a: { f: 'hero_02_velvetarts_forte_2-1g_32_glow_pink_a', c: [0.363, 0.656], tail: [0.084, 0.929], ang: 43.3, L: 0.742, col: '#eb2d5a' },
  forte32b: { f: 'hero_02_velvetarts_forte_2-1g_32_glow_pink_b', c: [0.631, 0.310], tail: [0.912, 0.067], ang: -137.3, L: 0.652, col: '#e2565d' },
  rooney002a: { f: 'sec_01_nories_rooney_002_a', c: [0.377, 0.647], tail: [0.067, 0.959], ang: 38.0, L: 0.778, col: '#fa016e' },
  rooney002b: { f: 'sec_01_nories_rooney_002_b', c: [0.604, 0.345], tail: [0.924, 0.042], ang: -141.4, L: 0.764, col: '#cee302' },
  sk20a: { f: 'sec_02_nories_rooney_sk20_magma_a', c: [0.395, 0.659], tail: [0.074, 0.960], ang: 38.1, L: 0.748, col: '#f8a212' },
  sk20b: { f: 'sec_02_nories_rooney_sk20_magma_b', c: [0.586, 0.322], tail: [0.922, 0.041], ang: -141.5, L: 0.705, col: '#cb911f' },
  miua: { f: 'sec_03_forest_miu_ts4_limited_a', c: [0.385, 0.640], tail: [0.086, 0.929], ang: 40.8, L: 0.751, col: '#1b9443' },
  miub: { f: 'sec_03_forest_miu_ts4_limited_b', c: [0.620, 0.346], tail: [0.908, 0.070], ang: -141.6, L: 0.698, col: '#ebe911' },
  forte35a: { f: 'sec_04_velvetarts_forte_2-1g_35_yellow_red_a', c: [0.369, 0.662], tail: [0.088, 0.929], ang: 42.3, L: 0.718, col: '#645c4f' },
  forte35b: { f: 'sec_04_velvetarts_forte_2-1g_35_yellow_red_b', c: [0.627, 0.308], tail: [0.912, 0.069], ang: -136.5, L: 0.645, col: '#d4b226' },
  tullea: { f: 'sec_05_nories_tulle_3g_101_a', c: [0.406, 0.648], tail: [0.115, 0.932], ang: 32.8, L: 0.676, col: '#bdae79' },
  tulleb: { f: 'sec_05_nories_tulle_3g_101_b', c: [0.579, 0.341], tail: [0.891, 0.048], ang: -147.7, L: 0.676, col: '#e1d20e' },
  forte30a: { f: 'sec_07_velvetarts_forte_2-1g_30_glow_gold_a', c: [0.364, 0.654], tail: [0.085, 0.929], ang: 42.2, L: 0.733, col: '#f1be18' },
  forte30b: { f: 'sec_07_velvetarts_forte_2-1g_30_glow_gold_b', c: [0.630, 0.310], tail: [0.909, 0.070], ang: -137.7, L: 0.646, col: '#d5d6c1' },
};
export const srcOf = (k) => `${AD}${GEO[k].f}.png`;
export const PUPA = `${AD}hero_03_nories_crankin_pupa_109.png`;

export const CSS = (S) => `
${S} .ts-arm{position:absolute;width:0;height:0;transform-origin:0 0}
${S} .ts-sp{position:absolute}
${S} .ts-sp img{position:absolute;inset:0;width:100%;height:100%;display:block}
${S} .ts-sp .fx-prod-sweep{inset:0}
${S} .ts-sun{position:absolute;border-radius:50%;background:linear-gradient(180deg,#ff1a24 0%,#e3000f 38%,#c80411 100%);box-shadow:0 0 120px 30px rgba(227,0,15,.35)}
${S} .ts-co{position:absolute;display:flex;flex-direction:column;gap:6px;white-space:nowrap}
${S} .ts-co i{display:block;height:4px;width:64px;background:#e3000f;border-radius:2px;transform-origin:0 50%}
${S} .ts-co b{font-family:'Roboto Condensed';font-weight:800;font-size:34px;letter-spacing:.08em;text-transform:uppercase;line-height:1.05;color:#fff}
${S} .ts-co>span{font-family:'Roboto Condensed';font-weight:600;font-size:28px;letter-spacing:.12em;text-transform:uppercase;line-height:1.1;color:rgba(255,255,255,.78)}
${S} .ts-co.r{align-items:flex-end;text-align:right}
${S} .ts-co.r i{transform-origin:100% 50%}
${S} .ts-pill{position:absolute;display:flex;align-items:center;gap:14px;padding:14px 26px 13px;border-radius:999px;background:#e3000f;color:#fff;font-family:'Roboto Condensed';font-weight:700;font-size:32px;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap;box-shadow:0 14px 34px rgba(0,0,0,.35)}
${S} .ts-pill em{font-style:normal;opacity:.75}
`;

// red rays (sunburst) in a wrapper we can bloom (scale / opacity); fx.rays spins the inner element
export function rays(ctx, { id = 'rays', x = ctx.W / 2, y = 1480, size = 2700, color = '#e3000f', n = 18, duty = 0.42, opacity = 0.5, spin = 14, hole = 0.08, style = '' } = {}) {
  return `<div class="fx-full" id="${ctx.id(`${id}-w`)}" style="transform-origin:${px(x)} ${px(y)};${style}">${fx.rays(ctx, { id, x, y, size, color, n, duty, opacity, spin, hole })}</div>`;
}

// solid "rising sun" disc (logo motif). Animate its scale (it can flood the frame) via the returned selector.
export function sun(ctx, { id = 'sun', x = ctx.W / 2, y = 1480, r = 210, style = '' } = {}) {
  return `<div class="ts-sun" id="${ctx.id(id)}" style="left:${px(x - r)};top:${px(y - r)};width:${px(2 * r)};height:${px(2 * r)};${style}"></div>`;
}

// one spoon posed by its BODY: centre at (cx, cy), body length `body` px, hook pointing `angle` (deg clockwise from up).
// layers: #id (entrance / exit: x, y, scale, opacity) › #id-r (pose rotation, flips) › img + sweep (#id-sw)
export function spoon(ctx, { id, k, cx, cy, body = 500, angle = 36, maxUp = 1.3, shadow = '0 26px 28px rgba(0,0,0,.55)', sweep = true, so = 0.7, style = '' }) {
  const G = GEO[k], src = srcOf(k);
  const [nw, nh] = ctx.dims(src);
  let s = body / (G.L * nh);
  if (s > maxUp) { ctx.warn(`spoon ${G.f} wants ${s.toFixed(2)}× > ${maxUp}× natural — capped`); s = maxUp; }
  const w = nw * s, h = nh * s, url = ctx.asset(src);
  const left = cx - G.c[0] * w, top = cy - G.c[1] * h, org = `${pct(G.c[0])} ${pct(G.c[1])}`;
  ctx.tl.set(ctx.sel(`${id}-r`), { rotation: angle - G.ang }, 0);
  const sw = sweep ? `<i class="fx-prod-sweep" id="${ctx.id(`${id}-sw`)}" style="-webkit-mask-image:url(${url});mask-image:url(${url});--sa:105deg;--so:${so}"></i>` : '';
  const html = `<div class="ts-sp" id="${ctx.id(id)}" style="left:${px(left)};top:${px(top)};width:${px(w)};height:${px(h)};transform-origin:${org};${style}"><div class="fx-abs" id="${ctx.id(`${id}-r`)}" style="inset:0;transform-origin:${org}"><img src="${url}" alt="" style="${shadow ? `filter:drop-shadow(${shadow})` : ''}">${sw}</div></div>`;
  return { html, sel: ctx.sel(id), rot: ctx.sel(`${id}-r`), w, h, s };
}
export function sweep(ctx, id, t, { d = 0.7, ease = 'power2.inOut' } = {}) {
  ctx.tl.fromTo(ctx.sel(`${id}-sw`), { backgroundPosition: '110% 0%' }, { backgroundPosition: '-10% 0%', duration: d, ease }, t);
}

// fan of spoons = the sun's rays. Arms hinge at the pivot (px, py); each spoon's line eye sits r0 from the pivot,
// hook outward. items: [{k, th}] (th = arm angle, deg clockwise from up). Whole fan: #id (transform-origin = pivot).
export function fan(ctx, { id = 'fan', items, x = ctx.W / 2, y = 1480, body = 340, r0 = 240, shadow = '0 18px 16px rgba(0,0,0,.6)', style = '' }) {
  let arms = '';
  items.forEach((it, i) => {
    const G = GEO[it.k], src = srcOf(it.k);
    const [nw, nh] = ctx.dims(src);
    const s = Math.min(1.3, (it.body || body) / (G.L * nh)), w = nw * s, h = nh * s, url = ctx.asset(src);
    const org = `${pct(G.tail[0])} ${pct(G.tail[1])}`;
    ctx.tl.set(ctx.sel(`${id}-p${i}`), { rotation: -G.ang }, 0);
    arms += `<div class="ts-arm" id="${ctx.id(`${id}-a${i}`)}" style="left:${px(x)};top:${px(y)}"><div class="ts-sp" id="${ctx.id(`${id}-p${i}`)}" style="left:${px(-G.tail[0] * w)};top:${px(-r0 - G.tail[1] * h)};width:${px(w)};height:${px(h)};transform-origin:${org}"><img src="${url}" alt="" style="filter:drop-shadow(${shadow})"><i class="fx-prod-sweep" id="${ctx.id(`${id}-sw${i}`)}" style="-webkit-mask-image:url(${url});mask-image:url(${url});--sa:105deg;--so:.65"></i></div></div>`;
  });
  return { html: `<div class="fx-full" id="${ctx.id(id)}" style="transform-origin:${px(x)} ${px(y)};${style}">${arms}</div>`, sel: ctx.sel(id), arm: (i) => ctx.sel(`${id}-a${i}`), n: items.length };
}
// open the fan: arms swing out from the centre (stacked) to their angles, centre first
export function fanOpen(ctx, F, items, t, { d = 0.75, step = 0.035, from = 0.35 } = {}) {
  const mid = (items.length - 1) / 2;
  items.forEach((it, i) => ctx.tl.fromTo(F.arm(i), { rotation: 0, scale: 0.55, opacity: from }, { rotation: it.th, scale: 1, opacity: 1, duration: d, ease: 'expo.out' }, t + Math.abs(i - mid) * step));
}
export function fanSweep(ctx, id, n, t, { step = 0.05, d = 0.55 } = {}) {
  for (let i = 0; i < n; i++) ctx.tl.fromTo(ctx.sel(`${id}-sw${i}`), { backgroundPosition: '110% 0%' }, { backgroundPosition: '-10% 0%', duration: d, ease: 'power2.inOut' }, t + i * step);
}

// product callout (Apple-style label): red tick + bold name + sub line. align 'l' | 'r' (x = left or right edge)
export function callout(ctx, { id, name, sub = '', x, y, align = 'l', t, t1 = null }) {
  const cls = align === 'r' ? 'ts-co r' : 'ts-co';
  const pos = align === 'r' ? `right:${px(ctx.W - x)}` : `left:${px(x)}`;
  ctx.tl.fromTo(ctx.sel(`${id}-i`), { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'expo.out' }, t);
  ctx.tl.fromTo(`${ctx.sel(id)} .fx-ln > span`, { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'expo.out', stagger: 0.07 }, t + 0.06);
  if (t1 != null) {
    ctx.tl.fromTo(ctx.sel(`${id}-i`), { scaleX: 1 }, { scaleX: 0, duration: 0.25, ease: 'power2.in' }, t1);
    ctx.tl.fromTo(`${ctx.sel(id)} .fx-ln > span`, { yPercent: 0, opacity: 1 }, { yPercent: -120, opacity: 0, duration: 0.25, ease: 'power3.in', stagger: 0.04 }, t1);
  }
  return `<div class="${cls}" id="${ctx.id(id)}" style="${pos};top:${px(y)}"><i id="${ctx.id(`${id}-i`)}"></i><b class="fx-ln"><span>${esc(nb(name))}</span></b>${sub ? `<span class="fx-ln"><span>${esc(nb(sub))}</span></span>` : ''}</div>`;
}

// kinetic lines: lines = [[{w, c?}, …], …] (words with optional colour); every line reveals by chars at its own time
// (VO-synced), all lines share one fitted size. Returns {html, size, h, sel, line(i)}; out(t) slides all lines up.
export function lines(ctx, { id, lines: L, x = ctx.safe.left, y, w = ctx.W - ctx.safe.left - ctx.safe.right, font = 'Anton', wght = 400, upper = true, sizes = [190, 176, 164, 152, 140, 128, 116, 104, 96], lh = 0.94, tracking = 0.005, color = '#fff', align = 'left', times = [], stagger = 0.024, d = 0.5, out = null, outD = 0.3 }) {
  const txt = L.map((ln) => nb(ln.map((p, j) => (j && !p.tight ? ' ' : '') + p.w).join('')));
  const longest = txt.reduce((a, b) => (ctx.measure(b, { font, wght, upper, tracking, size: 100 }) > ctx.measure(a, { font, wght, upper, tracking, size: 100 }) ? b : a));
  const f = ctx.fit(longest, { font, wght, upper, tracking, maxW: w, maxLines: 1, sizes });
  if (f.overflow) ctx.warn(`lines "${longest}" overflow ${w}px`);
  const size = f.size;
  const body = L.map((ln, i) => `<span class="fx-ln" id="${ctx.id(`${id}-l${i}`)}"><span>${ln.map((p, j) => `${j && !p.tight ? ' ' : ''}<span style="color:${p.c || color}">${fx.split(nb(p.w), 'chars')}</span>`).join('')}</span></span>`).join('');
  L.forEach((_, i) => { if (times[i] != null) ctx.tl.fromTo(`${ctx.sel(`${id}-l${i}`)} .fx-c`, { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: d, ease: 'expo.out', stagger }, times[i]); });
  if (out != null) ctx.tl.fromTo(`${ctx.sel(id)} .fx-ln > span`, { yPercent: 0, opacity: 1 }, { yPercent: -125, opacity: 0, duration: outD, ease: 'power3.in', stagger: 0.05 }, out);
  const html = `<div class="fx-t" id="${ctx.id(id)}" style="left:${px(x)};top:${px(y)};width:${px(w)};font-family:'${font}';font-weight:${wght};font-size:${size}px;line-height:${lh};letter-spacing:${tracking}em;color:${color};text-align:${align};${upper ? 'text-transform:uppercase;' : ''}">${body}</div>`;
  return { html, size, h: L.length * size * lh, sel: ctx.sel(id), line: (i) => ctx.sel(`${id}-l${i}`) };
}

// pill chip ("Věnuje ceny · MČR 2026")
export function pill(ctx, { id, text, sub = '', x = null, cx = null, y, t, w = null }) {
  ctx.tl.fromTo(ctx.sel(id), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' }, t);
  const wd = w || (ctx.measure(text + (sub ? ' · ' + sub : ''), { font: 'Roboto Condensed', wght: 700, size: 32, upper: true, tracking: 0.1 }) + 60);
  const left = cx != null ? cx - wd / 2 : x;
  return `<div class="ts-pill" id="${ctx.id(id)}" style="left:${px(left)};top:${px(y)};width:${px(wd)};justify-content:center">${esc(nb(text))}${sub ? `<em>·</em>${esc(nb(sub))}` : ''}</div>`;
}
