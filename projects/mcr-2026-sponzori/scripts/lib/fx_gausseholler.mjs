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

// ---------- logo: the site's own three layers (ring / core / word, shared 1200×1139 canvas) stacked so the ring can turn
// like on gausseholler.com (.gh-logo__ring). Size + logo rule from ctx.logo('on_dark') (= the same artwork, Lanczos 2×).
const LAY = { ring: 'assets/gausseholler/logo_layer_ring.png', core: 'assets/gausseholler/logo_layer_core.png', word: 'assets/gausseholler/logo_layer_word.png' };
const BOX = { x: 209, y: 120, w: 786, h: 734 };            // union bbox of the three layers on the 1200×1139 canvas
const HUB = [600.75, 336.5];                               // ring / core centre on the canvas
export function mark(ctx, { id, cx, y, box = [300, 300], scale = 1, at, label, gearOnly = false }) {
  const L = ctx.logo('on_dark', { box, scale, at, label: label || `${ctx.cid}:gh logo (layers)` });
  const s = L.w / BOX.w, h = BOX.h * s;
  const im = (k, extra = '') => `<img id="${ctx.id(`${id}-${k}`)}" src="${ctx.asset(LAY[k], { trim: false })}" alt="" style="position:absolute;left:${px(-BOX.x * s)};top:${px(-BOX.y * s)};width:${px(1200 * s)};height:${px(1139 * s)};${extra}">`;
  const html = `<div class="fx-abs" id="${ctx.id(id)}" style="left:${px(cx - L.w / 2)};top:${px(y)};width:${px(L.w)};height:${px(h)}">${im('ring', `transform-origin:${px(HUB[0] * s)} ${px(HUB[1] * s)}`)}${im('core')}${gearOnly ? '' : im('word')}</div>`;
  return { html, w: L.w, h, sel: ctx.sel(id), ring: ctx.sel(`${id}-ring`), word: ctx.sel(`${id}-word`), core: ctx.sel(`${id}-core`) };
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
// cols: [{value:'8', prefix:'', unit:'', label:['karbonových','tubusů']}]; x0 + colW*i; numerals roll with fx.odometer (≤ 0.7 s)
export function spec(ctx, { id, x0, y, colW, cols, size = 96, t, stagger = 0.14, odo }) {
  let h = `<i class="gh-hr" id="${ctx.id(`${id}-hr`)}" style="left:${px(x0)};top:${px(y)};width:${px(colW * cols.length - 24)}"></i>`;
  ctx.tl.fromTo(ctx.sel(`${id}-hr`), { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'expo.out' }, t - 0.1);
  cols.forEach((c, i) => {
    const x = x0 + i * colW, tt = t + i * stagger, nid = `${id}-n${i}`;
    h += odo({ id: nid, value: c.value, prefix: c.prefix || '', x, y: y + 16, size, font: 'Inter', wght: 800, color: C.white, t: tt, d: 0.6, spins: 1 });
    const nw = ctx.measure((c.prefix || '') + c.value, { font: 'Inter', wght: 800, size }) + 6;
    if (c.unit) h += `<div class="gh-un" id="${ctx.id(`${id}-u${i}`)}" style="left:${px(x + nw)};top:${px(y + 16 + size * 0.5)}">${esc(c.unit)}</div>`;
    h += `<div class="gh-sl" id="${ctx.id(`${id}-l${i}`)}" style="left:${px(x)};top:${px(y + 16 + size + 8)}">${c.label.map((l) => `<span class="fx-ln"><span>${esc(nb(l))}</span></span>`).join('')}</div>`;
    ctx.tl.fromTo(ctx.sel(nid), { opacity: 0 }, { opacity: 1, duration: 0.12, ease: 'none' }, tt);
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
export function stack(ctx, { id, w, cx, floor: fy, times, sweepA = 0.55 }) {
  const k0 = COLS[0].k, [nw, nh] = ctx.dims(src(k0)), ar = nw / nh, p = pad(k0);
  const h = w / ar, top = fy - h * (1 - p[3]), vw = w * (1 - p[0] - p[2]);
  const imgs = COLS.map((c, i) => `<img class="fx-prod-img" id="${ctx.id(`${id}-i${i}`)}" src="${ctx.asset(src(c.k))}" alt="" style="opacity:${i ? 0 : 1}">`).join('');
  const sh = `<i class="fx-prod-shadow" style="left:${px(w * p[0] + vw * 0.06)};width:${px(vw * 0.88)};top:${px(h * (1 - p[3]) - vw * 0.05)};height:${px(vw * 0.1)};--sho:.8"></i>`;
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
  ctx.tl.fromTo(ctx.sel(id), { opacity: 0, y: 24, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'expo.out' }, t);
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
