// fx_intro.mjs — extra seek-safe helpers for the event opener (scripts/blocks/intro.mjs). Same conventions as fx.mjs:
// ctx first, local ids through ctx.id, animation pushed into ctx.tl, geometry in px on 1080×1920, no CSS transform on animated nodes.
//
//   IRI                                                     iridescent "rainbow trout" chrome gradient (pink · peach · white · ice)
//   css(ctx)                                                scoped CSS for .ix-iri (gradient-filled type) and .ix-ol (outline type)
//   streak(ctx,{id,cx,y,w,h,color,t,d})                     anamorphic light streak that opens behind a hero
//   specks(ctx,{id,n,t0,t1,box,size,rise,op,seed})          rising light specks (depth dust), deterministic
//   sheen(ctx,sel,t,{d,from,to})                            moving highlight across .ix-iri type (background-position)
//   slam(ctx,sel,t,{from,d,blur})                           scale + blur + fade "slam" entrance on the beat
//   blurIn(ctx,sel,t,{x,y,d,blur})                          directional motion-blur slide-in
//   photoType(ctx,{src,filter,…headline opts})              headline whose letters are windows into a photo (aligned to the frame)
//   strobeBg(ctx,{id,cards:[{t0,t1,bg,glow,photo}]})        background of a run of strobe cards (one field + one glow, colours switch per card)
//   teaseProd(ctx,{id,t0,t1,src,pad,box,cx,cy,rot,zoom})    the product of a strobe card: fitted cut-out, snap zoom, quick sweep
import * as fx from './fx.mjs';
import { rnd, rgba } from './util.mjs';

const px = (n) => `${Math.round(n * 10) / 10}px`;

export const IRI = 'linear-gradient(100deg,#c3cedb 0%,#ffffff 12%,#ffa3c0 26%,#ffd6b3 38%,#ffffff 50%,#c4f2ff 62%,#8fe3ff 74%,#ffffff 88%,#c3cedb 100%)';

export const css = (ctx) => `
${ctx.S} .ix-iri .fx-ln>span{background-image:${IRI};background-size:260% 100%;background-position:0% 0%;-webkit-background-clip:text;background-clip:text;color:transparent}
${ctx.S} .ix-ol .fx-ln>span{color:transparent;-webkit-text-stroke:var(--ow,4px) var(--oc,#fff)}
${ctx.S} .ix-ph .fx-ln>span{-webkit-background-clip:text;background-clip:text;color:transparent;background-repeat:no-repeat}
${ctx.S} .ix-dot{position:absolute;border-radius:50%}
`;

export function streak(ctx, { id = 'streak', cx = ctx.W / 2, y = 800, w = 1600, h = 4, color = '#8fe3ff', t = 0, d = 0.8, ease = 'expo.out' } = {}) {
  ctx.tl.fromTo(ctx.sel(id), { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: d, ease }, t);
  return `<div class="fx-abs" id="${ctx.id(id)}" style="left:${px(cx - w / 2)};top:${px(y - h / 2)};width:${px(w)};height:${px(h)};border-radius:${h}px;background:linear-gradient(90deg,transparent,${color} 24%,#fff 50%,${color} 76%,transparent);box-shadow:0 0 18px 4px ${rgba(color, 0.55)},0 0 70px 18px ${rgba(color, 0.22)}"></div>`;
}

export function specks(ctx, { id = 'spk', n = 30, t0 = 0, t1 = ctx.dur, box = [0, 0, ctx.W, ctx.H], size = [2, 8], rise = [90, 320], op = [0.12, 0.55], color = '#ffffff', seed = 5 } = {}) {
  let html = '';
  for (let i = 0; i < n; i++) {
    const r = (k) => rnd(seed * 97 + i * 13 + k * 7);
    const s = size[0] + r(1) * (size[1] - size[0]);
    const x = box[0] + r(2) * box[2], y = box[1] + r(3) * box[3];
    const o = op[0] + r(4) * (op[1] - op[0]);
    const dy = -(rise[0] + r(5) * (rise[1] - rise[0])) * (s / size[1]);     // bigger = nearer = faster (depth)
    html += `<i class="ix-dot" id="${ctx.id(`${id}${i}`)}" style="left:${px(x)};top:${px(y)};width:${px(s)};height:${px(s)};background:${color};opacity:${o.toFixed(2)};${s > size[1] * 0.7 ? `box-shadow:0 0 ${(s * 0.8).toFixed(1)}px ${(s * 0.25).toFixed(1)}px ${color}` : ''}"></i>`;
    ctx.tl.fromTo(ctx.sel(`${id}${i}`), { y: 0 }, { y: dy, duration: Math.max(0.1, t1 - t0), ease: 'none' }, t0);
  }
  return `<div class="fx-full" id="${ctx.id(id)}">${html}</div>`;
}

// highlight travels across iridescent type (sel = headline sel with class ix-iri)
export function sheen(ctx, sel, t, { d = 1.2, from = '0% 0%', to = '100% 0%', ease = 'power2.inOut' } = {}) {
  ctx.tl.fromTo(`${sel} .fx-ln>span`, { backgroundPosition: from }, { backgroundPosition: to, duration: d, ease }, t);
}

// filter (blur) only while moving: a set just before t makes it the earliest 'filter' item, so nothing is blurred at load
// (lint: heavy overlays) and the element is back to filter:none after the move.
function blurWindow(ctx, sel, t, d, blur) {
  ctx.tl.set(sel, { filter: `blur(${blur}px)` }, Math.max(0.001, t - 0.02));
  ctx.tl.set(sel, { filter: 'none' }, t + d + 0.02);
}
export function slam(ctx, sel, t, { from = 1.6, d = 0.45, blur = 18, ease = 'expo.out', rot = 0 } = {}) {
  if (blur) blurWindow(ctx, sel, t, d, blur);
  ctx.tl.fromTo(sel, { scale: from, opacity: 0, rotation: rot }, { scale: 1, opacity: 1, rotation: 0, duration: d, ease }, t);
  if (blur) ctx.tl.fromTo(sel, { filter: `blur(${blur}px)` }, { filter: 'blur(0px)', duration: d * 0.8, ease }, t);
}

export function blurIn(ctx, sel, t, { x = 0, y = 0, d = 0.55, blur = 22, ease = 'expo.out' } = {}) {
  if (blur) blurWindow(ctx, sel, t, d, blur);
  ctx.tl.fromTo(sel, { x, y, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: d, ease }, t);
  if (blur) ctx.tl.fromTo(sel, { filter: `blur(${blur}px)` }, { filter: 'blur(0px)', duration: d * 0.8, ease }, t);
}

// letters filled with a photo that is aligned to the 1080×1920 frame (the same photo can sit dimmed behind → "windows").
// Ken Burns inside the letters: kb = {dx, dy, t0, t1}. Returns the fx.headline result.
export function photoType(ctx, o) {
  const { src, filter = 'brightness(1.35) saturate(1.2) contrast(1.05)', kb = null, size: s0, ...ho } = o;
  const font = ho.font || 'Archivo', wght = ho.wght ?? 900, wdth = ho.wdth ?? 100, upper = !!ho.upper, tracking = ho.tracking || 0, lh = ho.lh ?? 0.98;
  const H = fx.headline(ctx, { ...ho, size: s0, color: 'transparent', cls: `${ho.cls || ''} ix-ph` });
  const url = ctx.asset(src);
  const x = ho.x ?? ctx.safe.left, y = ho.y ?? 700, w = ho.w ?? ctx.W - ctx.safe.left - ctx.safe.right, align = ho.align || 'left';
  let css = '';
  H.lines.forEach((ln, i) => {
    const lw = ctx.measure(ctx.nb(ln), { font, size: H.size, wght, wdth, upper, tracking });
    const L = x + (align === 'center' ? (w - lw) / 2 : align === 'right' ? w - lw : 0), T = y + i * H.size * lh;
    const ls = `${ctx.sel(`${ho.id}-l${i}`)}>span`;
    css += `${ls}{background-image:url(${url});background-size:${ctx.W}px ${ctx.H}px;background-position:${px(-L)} ${px(-T)};filter:${filter}}\n`;
    if (kb) ctx.tl.fromTo(ls, { backgroundPosition: `${px(-L)} ${px(-T)}` }, { backgroundPosition: `${px(-L + kb.dx)} ${px(-T + kb.dy)}`, duration: Math.max(0.1, kb.t1 - kb.t0), ease: 'none' }, kb.t0);
  });
  return { ...H, css };
}

// ---- strobe cards (partner teaser) ----
// ONE colour field + ONE glow for a whole run of cards (colours switch with tl.set on each card) → few heavy layers.
// cards: [{t0, t1, bg, glow, photo?}] (photo cards get their own full-bleed photo layer).
export function strobeBg(ctx, { id, cards, glowOp = 0.55, cy = 1010, photoFilter = 'brightness(.62) saturate(1.15)' }) {
  const c0 = cards[0];
  let html = `<div class="fx-field" id="${ctx.id(`${id}-bg`)}" style="background-color:${c0.bg}"></div>`;
  html += `<div class="fx-field" id="${ctx.id(`${id}-gl`)}" style="color:${c0.glow};opacity:${glowOp};background:radial-gradient(90% 58% at 50% ${Math.round((cy / ctx.H) * 100)}%, currentColor 0%, transparent 64%)"></div>`;
  cards.forEach((c, i) => {
    if (i) { ctx.tl.set(ctx.sel(`${id}-bg`), { backgroundColor: c.bg }, c.t0); ctx.tl.set(ctx.sel(`${id}-gl`), { color: c.glow }, c.t0); }
    if (c.photo) html += fx.scene(ctx, `${id}-ph${i}`, c.t0, c.t1, `<div class="fx-full" style="filter:${photoFilter}">${ctx.img(c.photo, { pos: '50% 50%' })}</div>`, { inD: 0.001, outD: 0.001 });
  });
  return fx.scene(ctx, id, cards[0].t0, cards[cards.length - 1].t1, html, { inD: 0.001, outD: 0.001 });
}
export function teaseProd(ctx, { id, t0, t1, src, pad, box = [620, 600], cx = ctx.W / 2, cy = 1010, rot = 0, zoom = 1.14, ground = 'float', shadow = 0.5, sweep = true, maxUp = 1.3 }) {
  const [nw, nh] = ctx.dims(src), ar = nw / nh;
  const w = Math.min(box[0], box[1] * ar, nw * maxUp);
  const P = fx.product(ctx, { id: `${id}p`, src, w, cx, cy, ground, pad, rot, shadow, sweepOpacity: 0.85, maxUp });
  ctx.tl.fromTo(P.cam, { scale: zoom }, { scale: 1, duration: Math.max(0.05, t1 - t0), ease: 'power2.out' }, t0);
  if (sweep) fx.sweep(ctx, `${id}p`, t0, { d: Math.max(0.12, t1 - t0) });
  return fx.scene(ctx, id, t0, t1, P.html, { inD: 0.001, outD: 0.001 });
}
