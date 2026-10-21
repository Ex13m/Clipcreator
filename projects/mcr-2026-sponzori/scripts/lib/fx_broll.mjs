// fx_broll.mjs — cinematic action-interlude helpers for scripts/blocks/broll.mjs (b-roll cut + musical break).
// Same conventions as fx.mjs: ctx first, LOCAL ids through ctx.id, animation pushed into ctx.tl (block-local seconds),
// geometry in px on 1080×1920, never a CSS transform on an animated node (transform-origin is fine).
//
//   css(ctx)                                               scoped CSS: film grade, words, letterbox, leak, streak, sweep
//   blurDefs(ctx, ids[])                                   one SVG directional-blur filter per id (whip smear); returns html
//   shot(ctx,{id,src,cut,stroke,mono,t0,t1,origin,inn,out,kb,grade,frame,srcMax}) → {back, front, cam, fcam}   grade = per-shot img filter
//        frame  = extra inline img geometry (e.g. 'top:-280px;bottom:auto;height:1928px' = reframe the photo inside the camera)
//        srcMax = staging max side for the photo (default 1920 for b-roll JPEGs / 1600 for PNGs; a push-in needs more)
//        back  = graded photo in its own camera (goes UNDER the words)
//        front = the subject cut-out (+ white sticker stroke) in an identical camera (goes ABOVE the words → text behind subject)
//        inn   = 'slam' (scale punch-out settle on a downbeat) | 'whipL' | 'whipR' (enter from the right / left with smear) | 'none'
//        out   = 'whipL' | 'whipR' | 'none'      kb = {to, ease} middle speed-ramp push-in (default 1.08 → 1.2, fxRampIn)
//   word(ctx,{id,text,y,t,t1,sizes,wght,wdth,echo,in:'slam'|'breath'|'none',outline}) → {html, sel, m, size}
//        one bold word, fitted to the safe width, centred; outline echoes burst on its downbeat
//   echoBurst(ctx,id,t,{dy,d})                             replay the echo burst of word `id` on another hit
//   shake(ctx,sel,t,{amp,n,step,seed})                     camera shake (decaying, seeded) via tl.hit
//   streak(ctx,{id,y,t,color,d})                           anamorphic light streak across the frame (whip accent)
//   leak(ctx,{id,t,d,x,y,size,peak,colors})                warm light-leak bloom (screen blend) — dissolves / burns
//   sweepBand(ctx,{id,t,d,angle,opacity})                  full-frame specular light band (reflection pass)
//   letterbox(ctx,{id,h,t,d,t1,top})                       cinema bars closing in on the break (TA plate stays on top of them);
//                                                          `top` = html riding inside the top bar (e.g. credit())
//   credit(ctx,{id,lines:[{text,wght,size,alpha}],x1,yMid,maxW,t})  right-aligned tracked-caps credit block (2nd type level)
import * as fx from './fx.mjs';
import { esc, rnd } from './util.mjs';

const px = (n) => `${Math.round(n * 10) / 10}px`;

// teal/orange "film" grade: contrast up, saturation and green pulled down, shadows cooled by the overlays below
export const GRADE = 'contrast(1.2) saturate(.74) brightness(.9) hue-rotate(-12deg) sepia(.12)';

export const css = (ctx) => `
${ctx.S} .br-shot{position:absolute;inset:0;overflow:hidden}
${ctx.S} .br-cam{position:absolute;inset:0;will-change:transform}
${ctx.S} .br-cam img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;filter:${GRADE}}
${ctx.S} .br-cam .br-mono{position:absolute;inset:0;background-size:cover;background-position:50% 50%;filter:grayscale(1) contrast(1.4) brightness(.5)}
${ctx.S} .br-cam img.br-stk{filter:none}
${ctx.S} .br-grade{position:absolute;inset:0;pointer-events:none}
${ctx.S} .br-w{position:absolute;left:0;width:${ctx.W}px;text-align:center;white-space:nowrap;line-height:.92;text-transform:uppercase;color:#fff;filter:drop-shadow(0 10px 34px rgba(0,0,0,.42))}
${ctx.S} .br-w>div{position:absolute;left:0;right:0;top:0}
${ctx.S} .br-w .br-e{color:transparent;-webkit-text-stroke:3px rgba(255,255,255,.9)}
${ctx.S} .br-w .fx-c{display:inline-block;white-space:pre}
${ctx.S} .br-box{position:absolute;left:0;right:0;background:#000}
${ctx.S} .br-leak{position:absolute;border-radius:50%;mix-blend-mode:screen;pointer-events:none;filter:blur(40px)}
${ctx.S} .br-streak{position:absolute;left:-10%;width:120%;pointer-events:none;mix-blend-mode:screen}
${ctx.S} .br-cr{position:absolute;white-space:nowrap;text-align:right;text-transform:uppercase;color:#fff;line-height:1}
${ctx.S} .br-sweep{position:absolute;inset:0;pointer-events:none;mix-blend-mode:screen;background-size:320% 100%;background-repeat:no-repeat}
`;

// one horizontal-blur filter per id (stdDeviation 'X 0' = smear along x)
export function blurDefs(ctx, ids) {
  return `<svg class="fx-defs" aria-hidden="true">${ids.map((i) => `<filter id="${ctx.id(`bf-${i}`)}" x="-20%" y="-5%" width="140%" height="110%" color-interpolation-filters="sRGB"><feGaussianBlur id="${ctx.id(`bg-${i}`)}" stdDeviation="0 0"/></filter>`).join('')}</svg>`;
}

// shot: graded photo (+ optional mono copy for a freeze look) and optional subject cut-out in a twin camera
export function shot(ctx, o) {
  const { id, src, cut = null, stroke = null, mono = false, t0, t1, origin = '50% 50%', inn = 'none', out = 'none', blur = true,
    kb = {}, inD = 0.18, outD = 0.09, X = 110, slam = 1.34, grade = null, frame = '', srcMax = undefined } = o;
  const cam = ctx.sel(`${id}-cam`), fcam = ctx.sel(`${id}-fcam`), both = cut ? `${cam}, ${fcam}` : cam;
  const flt = blur ? `filter:url(#${ctx.id(`bf-${id}`)});` : '';
  const img = (rel, cls = '', extra = '', ms) => `<img class="${cls}" ${extra} src="${ctx.asset(rel, ms ? { maxSide: ms } : undefined)}" alt="">`;
  const st = `${grade ? `filter:${grade};` : ''}${frame}`;
  const back = `<div class="br-cam" id="${ctx.id(`${id}-cam`)}" style="transform-origin:${origin};${flt}">${img(src, '', st ? `style="${st}"` : '', srcMax)}${mono ? `<div class="br-mono" id="${ctx.id(`${id}-mono`)}" style="opacity:0;background-image:url(${ctx.asset(src)})"></div>` : ''}</div>`;
  // front: twin camera › #id-sub (extra subject scale = 2.5D parallax pop) › [white sticker stroke, cut-out]
  const front = cut ? `<div class="br-cam" id="${ctx.id(`${id}-fcam`)}" style="transform-origin:${origin};${flt}"><div class="br-cam" id="${ctx.id(`${id}-sub`)}" style="transform-origin:${o.subOrigin || origin}">${stroke ? img(stroke, 'br-stk', `id="${ctx.id(`${id}-stk`)}" style="opacity:0"`) : ''}${img(cut)}</div></div>` : '';
  // camera: entrance → speed-ramp push-in → exit
  const s1 = kb.from ?? 1.08, s2 = kb.to ?? 1.2;
  let tm = t0;
  if (inn === 'slam') { const sd = Math.min(0.3, (t1 - t0) * 0.85); ctx.tl.fromTo(both, { scale: slam }, { scale: s1, duration: sd, ease: 'expo.out' }, t0); tm = t0 + sd + 0.002; }   // +2 ms: no touching scale tweens (lint)
  else if (inn === 'whipL' || inn === 'whipR') {
    const sx = inn === 'whipL' ? 1 : -1;      // whipL = the move goes to the left → the new shot enters from the right
    ctx.tl.fromTo(both, { scale: 1.26, x: sx * X }, { scale: s1, x: 0, duration: inD, ease: 'expo.out' }, t0);
    if (blur) ctx.tl.fromTo(ctx.sel(`bg-${id}`), { attr: { stdDeviation: '46 0' } }, { attr: { stdDeviation: '0 0' }, duration: inD, ease: 'power2.out' }, t0);
    tm = t0 + inD;
  }
  const tEnd = out !== 'none' ? t1 - outD : t1;
  if (kb.flat) ctx.tl.fromTo(both, { scale: s1 }, { scale: s2, duration: Math.max(0.05, tEnd - tm), ease: kb.ease || 'sine.out' }, tm);
  else ctx.tl.fromTo(both, { scale: s1 }, { scale: s2, duration: Math.max(0.05, tEnd - tm), ease: kb.ease || 'fxRampIn' }, tm);
  if (out === 'whipL' || out === 'whipR') {
    const sx = out === 'whipL' ? -1 : 1;
    const fromX = 0;
    ctx.tl.fromTo(both, { x: fromX }, { x: sx * X * 0.9, duration: outD, ease: 'power2.in' }, tEnd);
    if (blur) ctx.tl.fromTo(ctx.sel(`bg-${id}`), { attr: { stdDeviation: '0 0' } }, { attr: { stdDeviation: '46 0' }, duration: outD, ease: 'power2.in' }, tEnd);
  }
  return { back, front, cam, fcam, both };
}

// one bold word. in: 'slam' (chars stretch-drop in, echo burst) | 'breath' (thin → heavy variable weight over [t, t1]) | 'none'
export function word(ctx, o) {
  const { id, text, y = 400, t = 0, t1 = ctx.dur, wght = 900, wdth = 62, tracking = -0.01, echo = true, inn = 'slam', outline = false,
    sizes = [420, 400, 380, 360, 340, 320, 300, 280, 260, 240], maxW = ctx.W - ctx.safe.left - ctx.safe.right, from = null, split = true, ofw = 4 } = o;
  const f = ctx.fit(text, { font: 'Archivo', wght: Math.max(wght, from?.wght ?? 0), wdth: Math.max(wdth, from?.wdth ?? 0), upper: true, tracking: Math.max(tracking, from?.trk ?? -1), maxW, maxLines: 1, sizes });
  if (f.overflow) ctx.warn(`word "${text}" does not fit ${maxW}px`);
  const size = f.size;
  const base = `font-size:${size}px;font-weight:${wght};font-stretch:${wdth}%;letter-spacing:${tracking}em;`;
  const vv = from ? `--wght:${from.wght};--wdth:${from.wdth ?? wdth};--trk:${from.trk ?? tracking};` : '';
  const chars = split ? [...text].map((c) => `<span class="fx-c">${esc(c)}</span>`).join('') : esc(text);   // outline words stay unsplit (background-clip:text needs one text run)
  const e = echo ? [0, 1].map((k) => `<div class="br-e" id="${ctx.id(`${id}-e${k}`)}" style="opacity:0">${esc(text)}</div>`).join('') : '';
  const m = ctx.sel(`${id}-m`);
  const html = `<div class="br-w" id="${ctx.id(id)}" style="top:${px(y)};height:${size}px;font-family:'Archivo';${base}">${e}<div id="${ctx.id(`${id}-m`)}" class="${from ? 'fx-var' : ''}${outline ? ' fx-of' : ''}" style="${vv}${outline ? `--ofc:#fff;--ofw:${ofw}px;` : ''}">${chars}</div></div>`;
  if (inn === 'slam') {
    ctx.tl.fromTo(`${m} .fx-c`, { yPercent: -38, scaleY: 1.9, opacity: 0 }, { yPercent: 0, scaleY: 1, opacity: 1, duration: 0.34, ease: 'expo.out', stagger: 0.028 }, t);
    if (echo) echoBurst(ctx, id, t + 0.04);
  } else if (inn === 'breath') {
    if (split) ctx.tl.fromTo(`${m} .fx-c`, { opacity: 0, yPercent: 14 }, { opacity: 1, yPercent: 0, duration: 0.7, ease: 'expo.out', stagger: 0.045 }, t);
    else ctx.tl.fromTo(m, { opacity: 0, y: 40, filter: 'blur(18px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'expo.out' }, t);
    if (from) fx.varType(ctx, m, t, { from, to: { wght, wdth, trk: tracking }, d: Math.max(0.3, t1 - t - 0.15), ease: 'power2.inOut' });
  }
  return { html, sel: ctx.sel(id), m, size, h: size * 0.92 };
}
export function echoBurst(ctx, id, t, { dy = null, d = 0.5 } = {}) {
  [0, 1].forEach((k) => {
    const s = ctx.sel(`${id}-e${k}`), sy = k ? 1 : -1;
    ctx.tl.hit(s, { y: 0, opacity: 0.85, scale: 1 }, { y: sy * (dy ?? 230), opacity: 0, scale: 1.06, duration: d, ease: 'expo.out' }, t);
  });
}

// decaying seeded shake (accent, no initial state)
export function shake(ctx, sel, t, { amp = 22, n = 5, step = 0.045, seed = 3 } = {}) {
  for (let i = 0; i < n; i++) {
    const k = 1 - i / n, a = amp * k;
    const x = (rnd(seed * 31 + i * 7) - 0.5) * 2 * a, y = (rnd(seed * 17 + i * 11) - 0.5) * 2 * a * 0.7;
    ctx.tl.hit(sel, { x, y }, { x: 0, y: 0, duration: step, ease: 'power1.out' }, t + i * step);
  }
}

export function streak(ctx, { id, y = 900, t, color = '#ffd2a0', d = 0.26, h = 6 } = {}) {
  ctx.tl.hit(ctx.sel(id), { opacity: 1, scaleY: 1.6 }, { opacity: 0, scaleY: 0.4, duration: d, ease: 'power2.out' }, t);
  return `<div class="br-streak" id="${ctx.id(id)}" style="top:${px(y - h / 2)};height:${h}px;opacity:0;border-radius:${h}px;background:linear-gradient(90deg,transparent,${color} 22%,#fff 50%,${color} 78%,transparent);box-shadow:0 0 22px 6px rgba(255,190,120,.55),0 0 90px 30px rgba(255,170,90,.25)"></div>`;
}

// warm light-leak bloom: rises to `peak` over d/2, falls back over d/2 (or holds if hold:true)
export function leak(ctx, { id, t, d = 0.8, x = 760, y = 700, size = 1500, peak = 0.95, hold = false, colors = ['#ffb067', '#ff6a3d', '#ffe3b8'] } = {}) {
  const s = ctx.sel(id);
  ctx.tl.fromTo(s, { opacity: 0, scale: 0.7, x: 0 }, { opacity: peak, scale: 1.15, x: -160, duration: d * 0.5, ease: 'power2.in' }, t);
  if (!hold) ctx.tl.fromTo(s, { opacity: peak, scale: 1.15, x: -160 }, { opacity: 0, scale: 1.35, x: -300, duration: d * 0.5, ease: 'power2.out' }, t + d * 0.5);
  return `<div class="br-leak" id="${ctx.id(id)}" style="left:${px(x - size / 2)};top:${px(y - size / 2)};width:${px(size)};height:${px(size)};background:radial-gradient(closest-side,${colors[2]} 0%,${colors[0]} 34%,${colors[1]} 58%,transparent 100%)"></div>`;
}

export function sweepBand(ctx, { id, t, d = 1.2, angle = 112, opacity = 0.9, ease = 'power1.inOut' } = {}) {
  ctx.tl.fromTo(ctx.sel(id), { backgroundPosition: '115% 0%' }, { backgroundPosition: '-15% 0%', duration: d, ease }, t);
  return `<div class="br-sweep" id="${ctx.id(id)}" style="opacity:${opacity};background-image:linear-gradient(${angle}deg,transparent 34%,rgba(255,214,170,.14) 42%,rgba(255,246,232,.62) 50%,rgba(255,214,170,.14) 58%,transparent 66%);background-position:115% 0%"></div>`;
}

// cinema bars: top bar ends at h (the TA plate sits ON the bar), bottom bar mirrors it
export function letterbox(ctx, { id = 'lb', h = 372, t = 0, d = 0.6, t1 = null, d1 = 0.4, top = '' } = {}) {
  const T = ctx.sel(`${id}-t`), B = ctx.sel(`${id}-b`);
  ctx.tl.fromTo(T, { yPercent: -100 }, { yPercent: 0, duration: d, ease: 'expo.out' }, t);
  ctx.tl.fromTo(B, { yPercent: 100 }, { yPercent: 0, duration: d, ease: 'expo.out' }, t);
  if (t1 != null) {
    ctx.tl.fromTo(T, { yPercent: 0 }, { yPercent: -100, duration: d1, ease: 'expo.in' }, t1 - d1);
    ctx.tl.fromTo(B, { yPercent: 0 }, { yPercent: 100, duration: d1, ease: 'expo.in' }, t1 - d1);
  }
  return `<div class="br-box" id="${ctx.id(`${id}-t`)}" style="top:0;height:${h}px">${top}</div><div class="br-box" id="${ctx.id(`${id}-b`)}" style="bottom:0;height:${h}px"></div>`;
}

// credit: right-aligned tracked caps (Archivo, same family as the words) — the second type level next to the big word.
// lines: [{text, wght, size, alpha}] stacked and centred on yMid; each line fitted to maxW; slides in from the right at t.
export function credit(ctx, { id = 'cr', lines = [], x1 = ctx.W - ctx.safe.right, yMid = 299, maxW = 600, t = 0.5, d = 0.55, wdth = 100, tracking = 0.14, gap = 12 } = {}) {
  const L = lines.map((l) => {
    const size = l.size || 34, wght = l.wght || 700;
    const f = ctx.fit(ctx.nb(l.text), { font: 'Archivo', wght, wdth, upper: true, tracking, maxW, maxLines: 1, sizes: [size, size - 2, size - 4, size - 6] });
    if (f.overflow) ctx.warn(`credit "${l.text}" does not fit ${maxW}px`);
    return { ...l, size: f.size, wght };
  });
  const H = L.reduce((a, l) => a + l.size, 0) + gap * (L.length - 1);
  let y = yMid - H / 2, html = '';
  L.forEach((l, i) => {
    const lid = `${id}-${i}`;
    html += `<div class="br-cr" id="${ctx.id(lid)}" style="right:${px(ctx.W - x1)};top:${px(y)};font-family:'Archivo';font-size:${l.size}px;font-weight:${l.wght};font-stretch:${wdth}%;letter-spacing:${tracking}em;margin-right:-${tracking}em;opacity:0">${esc(ctx.nb(l.text)).replace(/^(.*)$/, (m) => (l.alpha != null ? `<span style="opacity:${l.alpha}">${m}</span>` : m))}</div>`;
    ctx.tl.fromTo(ctx.sel(lid), { opacity: 0, x: 36 }, { opacity: 1, x: 0, duration: d, ease: 'expo.out' }, t + i * 0.09);
    y += l.size + gap;
  });
  return html;
}
