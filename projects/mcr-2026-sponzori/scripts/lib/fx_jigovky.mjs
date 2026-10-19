// fx_jigovky.mjs — extra seek-safe helpers for the Jigovky.cz block (scripts/blocks/jigovky.mjs). Same conventions as fx.mjs:
// ctx first, local ids through ctx.id, animation pushed into ctx.tl, geometry in px on 1080×1920, no CSS transform on animated nodes.
//
//   C, SW                                                    brand palette (shop CSS code-2.css) + product colourways (measured)
//   css(ctx)                                                 scoped CSS for the classes below
//   place(ctx,{id,src,s,u,v,x,y,…})                          fx.product with anchor placement: image point (u,v) lands on (x,y) at scale s
//   voType(ctx,{id,text,times,…})                            fitted headline, every word revealed at its own VO time (word-synced kinetic type)
//   typeOutWords(ctx,H,t,{…})                                word-wise exit for a voType headline
//   glint(ctx,{id,x,y,size,t,d})                             4-point specular star on chrome (one element, no blur)
//   lensRing(ctx,{id,cx,cy,r,color,ticks})                   hairline ring with tick marks (rotates with the lens)
//   badge(ctx,{id,text,x,y,d,t})                             yellow round "vel." badge (packaging DNA) — pops on the beat
//   pill(ctx,{id,text,x,y,h,size,t})                         yellow spec pill (callout label)
//   callout(ctx,{id,pts,t,d})                                hairline leader (SVG, draws itself) + anchor dot
import * as fx from './fx.mjs';
import { esc, nb } from './util.mjs';

const px = (n) => `${Math.round(n * 10) / 10}px`;

// shop CSS (https://cdn.myshoptet.com/usr/506750.myshoptet.com/user/documents/smUpravy/code-2.css) — research/jigovky_ad.md §3
export const C = { forest: '#006F33', deep: '#01431F', night: '#00210F', leaf: '#00AB4E', btn: '#006633', yellow: '#FFD600', price: '#FF6600', paper: '#F7F7F7' };
// Tungsten HD BARBLESS colourways (jigovky.cz/tungsten-hd-barbless/), swatch hex measured from the cut-outs
// the forest "lightbox" world: soft centre light, many stops so no Mach bands / visible ellipse edges
export const WORLD = 'radial-gradient(95% 62% at 50% 44%, #0f8a47 0%, #0b8040 10%, #067536 22%, #006F33 32%, #01642e 44%, #015628 56%, #014a22 68%, #013d1c 80%, #013016 90%, #00260f 100%)';
export const SW = [['FLUO', '#D3FC02'], ['PINK', '#DF0AA1'], ['RED', '#EC0102'], ['ORANGE', '#FE5F00'], ['BLACK', '#2F2F2F'], ['SILVER', '#D6D6D6'], ['GOLD', '#C9A13B']];

// font families go INLINE (the @font-face rules live in the root page; a <style> in the sub-composition that names them fails lint)
export const FN = "font-family:'PT Sans Narrow'", FD = "font-family:'Roboto Slab'";

export const css = (ctx) => `
${ctx.S} .jg-vt{position:absolute;margin:0}
${ctx.S} .jg-vt .fx-ln{padding:.16em 0 .08em;margin:-.16em 0 -.08em}
${ctx.S} .jg-lens{position:absolute;border-radius:50%;overflow:hidden}
${ctx.S} .jg-ring{position:absolute;pointer-events:none}
${ctx.S} .jg-ring svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
${ctx.S} .jg-badge{position:absolute;border-radius:50%;display:flex;align-items:center;justify-content:center;background:${C.yellow};color:${C.deep};font-weight:900;letter-spacing:-.02em;box-shadow:0 14px 30px rgba(0,20,8,.35)}
${ctx.S} .jg-pill{position:absolute;display:flex;align-items:center;white-space:nowrap;background:${C.yellow};color:${C.deep};font-weight:700;text-transform:uppercase;letter-spacing:.04em;border-radius:999px;box-shadow:0 14px 30px rgba(0,20,8,.35)}
${ctx.S} .jg-lbl{position:absolute;white-space:nowrap;font-weight:700;text-transform:uppercase;letter-spacing:.06em}
${ctx.S} .jg-tile{position:absolute;overflow:hidden;border-radius:30px;background:linear-gradient(155deg,rgba(255,255,255,.13) 0%,rgba(255,255,255,.035) 46%,rgba(0,0,0,.10) 100%);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.16),inset 0 1.5px 0 rgba(255,255,255,.22)}
${ctx.S} .jg-tile .jg-lbl{left:24px;top:20px;font-size:28px;color:rgba(255,255,255,.86)}
${ctx.S} .jg-glint{position:absolute;pointer-events:none;background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.95) 50%,transparent 100%) center/100% 3px no-repeat,linear-gradient(0deg,transparent 0%,rgba(255,255,255,.95) 50%,transparent 100%) center/3px 100% no-repeat,radial-gradient(closest-side,rgba(255,255,255,.95),rgba(255,255,255,0) 22%)}
${ctx.S} .jg-co{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}
${ctx.S} .jg-dot{position:absolute;border-radius:50%}
`;

// fx.product with anchor placement. s = scale vs the STAGED natural size (≤ maxUp); (u,v) = normalised point in the PNG.
// Returns the fx.product result + at(u,v) → screen point (before any camera move).
export function place(ctx, { id, src, s = 1, u = 0.5, v = 0.5, x, y, ground = 'none', maxUp = 1.16, sweep = true, sweepOpacity = 0.7, pad, rot = 0, shadow = 0.5, style = '' }) {
  const [nw, nh] = ctx.dims(src);
  const w = nw * s, h = nh * s;
  const cx = x + (0.5 - u) * w, cy = y + (0.5 - v) * h;
  const P = fx.product(ctx, { id, src, w, cx, cy, ground, pad, maxUp, sweep, sweepOpacity, rot, shadow, style });
  P.at = (uu, vv) => [cx + (uu - 0.5) * w, cy + (vv - 0.5) * h];
  P.nw = nw; P.nh = nh; P.s = s;
  return P;
}

// Fitted headline; every word gets its own id and is revealed at times[k] (block-local seconds, from ctx.vo).
// Words = space-separated tokens after Czech NBSP typography (so "v ČR" is one token).
export function voType(ctx, { id, text, times = [], x = ctx.safe.left, y = 700, w = ctx.W - ctx.safe.left - ctx.safe.right, maxLines = 2, sizes = [140, 128, 116, 104, 96], font = 'Roboto Slab', wght = 900, color = '#fff', lh = 1.0, tracking = 0, upper = false, align = 'left', d = 0.5, ease = 'expo.out', from = { yPercent: 118, opacity: 0 }, style = '' }) {
  const t = nb(text);
  const f = ctx.fit(t, { font, wght, upper, tracking, maxW: w, maxLines, sizes });
  if (f.overflow) ctx.warn(`voType "${text}" overflows ${w}px × ${maxLines}`);
  let k = 0;
  const words = [];
  const lines = f.lines.map((ln, li) => `<span class="fx-ln" id="${ctx.id(`${id}-l${li}`)}"><span>${ln.split(' ').map((wd) => { const wid = `${id}-w${k++}`; words.push(wid); return `<span class="fx-c" id="${ctx.id(wid)}">${esc(wd)}</span>`; }).join(' ')}</span></span>`).join('');
  const html = `<div class="jg-vt" id="${ctx.id(id)}" style="left:${px(x)};top:${px(y)};width:${px(w)};font-family:'${font}';font-weight:${wght};font-size:${f.size}px;line-height:${lh};letter-spacing:${tracking}em;color:${color};text-align:${align};${upper ? 'text-transform:uppercase;' : ''}${style}">${lines}</div>`;
  const T = Object.fromEntries(Object.keys(from).map((p) => [p, p === 'opacity' || p === 'scale' ? 1 : 0]));
  words.forEach((wid, i) => {
    const tt = times[Math.min(i, times.length - 1)] ?? 0;
    ctx.tl.fromTo(ctx.sel(wid), from, { ...T, duration: d, ease }, tt);
  });
  return { html, size: f.size, lines: f.lines, h: f.lines.length * f.size * lh, sel: ctx.sel(id), words };
}
export function typeOutWords(ctx, H, t, { d = 0.3, stagger = 0.035, to = { yPercent: -118, opacity: 0 } } = {}) {
  const F = Object.fromEntries(Object.keys(to).map((p) => [p, p === 'opacity' || p === 'scale' ? 1 : 0]));
  H.words.forEach((wid, i) => ctx.tl.fromTo(ctx.sel(wid), F, { ...to, duration: d, ease: 'power3.in' }, t + i * stagger));
}

// 4-point star glint (cross of two thin gradients + soft core) — pops and spins on a chrome highlight
export function glint(ctx, { id = 'gl', x, y, size = 220, t = 0, d = 0.7, rot = 45 } = {}) {
  ctx.tl.fromTo(ctx.sel(id), { scale: 0, rotation: 0, opacity: 0 }, { scale: 1, rotation: rot, opacity: 1, duration: d * 0.42, ease: 'power2.out' }, t);
  ctx.tl.fromTo(ctx.sel(id), { scale: 1, opacity: 1 }, { scale: 0.2, opacity: 0, duration: d * 0.58, ease: 'power2.in' }, t + d * 0.42);
  return `<i class="jg-glint" id="${ctx.id(id)}" style="left:${px(x - size / 2)};top:${px(y - size / 2)};width:${px(size)};height:${px(size)}"></i>`;
}

// hairline ring with ticks (every 360/ticks deg; every 4th tick longer)
export function lensRing(ctx, { id = 'ring', cx, cy, r, color = C.yellow, ticks = 48, w = 2.5, opacity = 0.95, style = '' } = {}) {
  const R = r + 22, S = R * 2;
  let lines = '';
  for (let i = 0; i < ticks; i++) {
    const a = (i / ticks) * Math.PI * 2, L = i % 4 === 0 ? 16 : 8;
    const x1 = R + Math.cos(a) * (r + 6), y1 = R + Math.sin(a) * (r + 6), x2 = R + Math.cos(a) * (r + 6 + L), y2 = R + Math.sin(a) * (r + 6 + L);
    lines += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
  }
  return `<div class="jg-ring" id="${ctx.id(id)}" style="left:${px(cx - R)};top:${px(cy - R)};width:${px(S)};height:${px(S)};opacity:${opacity};${style}"><svg viewBox="0 0 ${S.toFixed(1)} ${S.toFixed(1)}"><circle cx="${R}" cy="${R}" r="${r}" fill="none" stroke="${color}" stroke-width="${w}"/><g stroke="${color}" stroke-width="${w * 0.8}" stroke-linecap="round" opacity=".8">${lines}</g></svg></div>`;
}

// round yellow badge (their packaging "vel." circles)
export function badge(ctx, { id, text, x, y, d = 120, size = null, t = 0, dur = 0.5 } = {}) {
  ctx.tl.fromTo(ctx.sel(id), { scale: 0, rotation: -30 }, { scale: 1, rotation: 0, duration: dur, ease: 'back.out(2.4)' }, t);
  return `<div class="jg-badge" id="${ctx.id(id)}" style="left:${px(x - d / 2)};top:${px(y - d / 2)};width:${px(d)};height:${px(d)};${FD};font-size:${size || Math.round(d * 0.42)}px">${esc(nb(text))}</div>`;
}

export function pill(ctx, { id, text, x, y, h = 72, size = 46, padX = 30, t = 0, d = 0.55 } = {}) {
  const w = ctx.measure(nb(text), { font: 'PT Sans Narrow', size, wght: 700, upper: true, tracking: 0.04 }) + padX * 2;
  ctx.tl.set(ctx.sel(id), { transformOrigin: '0% 50%' }, 0);
  ctx.tl.fromTo(ctx.sel(id), { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: d * 0.6, ease: 'expo.out' }, t);
  ctx.tl.fromTo(ctx.sel(`${id}-t`), { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: d, ease: 'expo.out' }, t + 0.08);
  return { w, h, html: `<div class="jg-pill" id="${ctx.id(id)}" style="left:${px(x)};top:${px(y)};height:${px(h)};padding:0 ${padX}px;${FN};font-size:${size}px;overflow:hidden"><span id="${ctx.id(`${id}-t`)}" style="display:inline-block">${esc(nb(text))}</span></div>` };
}

// leader line through pts [[x,y],…] (screen px) drawn at t; dot on the first point (the product anchor)
export function callout(ctx, { id = 'co', pts, t = 0, d = 0.4, color = C.yellow, w = 3, dot = 9 } = {}) {
  const dPath = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  ctx.tl.fromTo(ctx.sel(`${id}-p`), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d, ease: 'power2.inOut' }, t);
  ctx.tl.fromTo(ctx.sel(`${id}-d`), { scale: 0 }, { scale: 1, duration: 0.35, ease: 'back.out(3)' }, t);
  const [x0, y0] = pts[0];
  return `<svg class="jg-co" id="${ctx.id(id)}" viewBox="0 0 ${ctx.W} ${ctx.H}"><path id="${ctx.id(`${id}-p`)}" d="${dPath}" pathLength="1" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" style="stroke-dasharray:1 1"/></svg><i class="jg-dot" id="${ctx.id(`${id}-d`)}" style="left:${px(x0 - dot)};top:${px(y0 - dot)};width:${px(dot * 2)};height:${px(dot * 2)};background:${color};box-shadow:0 0 0 4px rgba(1,67,31,.55)"></i>`;
}
