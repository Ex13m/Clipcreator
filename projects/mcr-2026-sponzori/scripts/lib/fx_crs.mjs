// fx_crs.mjs — ČRS block helpers (Český rybářský svaz, „Děkujeme za dlouholetou podporu“). Seek-safe, transform / CSS-var only.
//   hatch(ctx,{…})         engraved diagonal hairlines (echo of the fin hatching in the ČRS fish) with a soft radial mask, slow drift
//   caustic(ctx,{…})       water light: two wide soft light bands drifting across the deep blue (one element, two gradients)
//   reveal(ctx,{…})        wrapper that reveals its content with a diagonal soft-edge mask along the fish (tail → head) + a light
//                          sweep masked by the logo alpha (returns {html, sweep(t)}). Mask position = CSS var --p (GSAP tweens it).
//   charsLine / wordsBlock  kinetic type with per-char / per-word ids (timed to the VO word by word)
import { esc, nb } from './util.mjs';

const px = (n) => `${Math.round(n * 10) / 10}px`;

export function hatch(ctx, { id = 'hatch', y = 0, h = ctx.H, angle = 118, gap = 15, line = 1.6, alpha = 0.055, at = '50% 42%', drift = 90, t0 = 0, t1 = ctx.dur } = {}) {
  const m = `radial-gradient(70% 46% at ${at}, #000 0%, rgba(0,0,0,.55) 45%, transparent 100%)`;
  ctx.tl.fromTo(ctx.sel(id), { x: 0 }, { x: drift, duration: Math.max(0.1, t1 - t0), ease: 'sine.inOut' }, t0);
  return `<div class="fx-abs" id="${ctx.id(id)}" style="left:-120px;top:${px(y)};width:${px(ctx.W + 240)};height:${px(h)};background:repeating-linear-gradient(${angle}deg, rgba(255,255,255,${alpha}) 0 ${line}px, transparent ${line}px ${gap}px);-webkit-mask-image:${m};mask-image:${m}"></div>`;
}

export function caustic(ctx, { id = 'cau', color = '#38B0C0', alpha = 0.16, t0 = 0, t1 = ctx.dur, drift = -160 } = {}) {
  const g = `radial-gradient(60% 9% at 30% 62%, ${hexA(color, alpha)} 0%, transparent 100%), radial-gradient(52% 7% at 72% 70%, ${hexA(color, alpha * 0.8)} 0%, transparent 100%)`;
  ctx.tl.fromTo(ctx.sel(id), { x: 0, y: 0 }, { x: drift, y: -60, duration: Math.max(0.1, t1 - t0), ease: 'sine.inOut' }, t0);
  return `<div class="fx-abs" id="${ctx.id(id)}" style="left:-10%;top:0;width:120%;height:100%;background:${g}"></div>`;
}
const hexA = (hex, a) => { const n = parseInt(hex.replace('#', ''), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; };

// diagonal mask reveal (tail lower-left → head upper-right) + logo-alpha light sweep
export function reveal(ctx, { id = 'rv', x, y, w, h, inner, src, angle = 62, soft = 22, t, d = 1.0, ease = 'power3.out' }) {
  const m = `linear-gradient(${angle}deg, #000 calc(var(--p) - ${soft}%), transparent var(--p))`;
  if (t != null) ctx.tl.fromTo(ctx.sel(id), { '--p': '-2%' }, { '--p': `${100 + soft + 4}%`, duration: d, ease }, t);
  const sw = src ? `<i id="${ctx.id(`${id}-sw`)}" style="position:absolute;inset:0;-webkit-mask-image:url(${src});mask-image:url(${src});-webkit-mask-size:100% 100%;mask-size:100% 100%;background-image:linear-gradient(105deg,transparent 40%,rgba(190,240,255,.95) 50%,transparent 60%);background-size:300% 100%;background-position:110% 0;mix-blend-mode:screen;opacity:.85"></i>` : '';
  const html = `<div class="fx-abs" id="${ctx.id(id)}" style="left:${px(x)};top:${px(y)};width:${px(w)};height:${px(h)};${t != null ? `--p:-2%;-webkit-mask-image:${m};mask-image:${m}` : ''}">${inner}${sw}</div>`;
  const sweep = (ts, dd = 0.9) => ctx.tl.fromTo(ctx.sel(`${id}-sw`), { backgroundPosition: '110% 0%' }, { backgroundPosition: '-10% 0%', duration: dd, ease: 'power2.inOut' }, ts);
  return { html, sweep };
}

// one line of chars with ids (for a tracking settle); returns html + ids
export function charsLine(ctx, { id, text, x, y, w, size, font, wght = 900, color = '#fff', align = 'center', upper = true, tracking = 0 }) {
  const s = upper ? text.toUpperCase() : text;
  const ch = [...s];
  const html = `<div class="fx-t" id="${ctx.id(id)}" style="left:${px(x)};top:${px(y)};width:${px(w)};font-family:'${font}';font-weight:${wght};font-size:${size}px;line-height:1;letter-spacing:${tracking}em;color:${color};text-align:${align};white-space:nowrap">${ch.map((c, i) => (c === ' ' ? ' ' : `<span class="fx-c" id="${ctx.id(`${id}-c${i}`)}">${esc(c)}</span>`)).join('')}</div>`;
  return { html, n: ch.length, ids: ch.map((c, i) => (c === ' ' ? null : `${id}-c${i}`)) };
}

// fitted multi-line block, every line masked (diacritic-safe padding), every word its own id → word-by-word reveal on the VO
export function wordsBlock(ctx, { id, text, x, y, w, sizes, maxLines = 2, font, wght = 800, color = '#fff', align = 'center', upper = true, lh = 1.04, tracking = 0 }) {
  const t = nb(text);
  const f = ctx.fit(t, { font, wght, upper, tracking, maxW: w, maxLines, sizes });
  if (f.overflow) ctx.warn(`wordsBlock "${text}" overflows`);
  let k = 0; const words = [];
  const lines = f.lines.map((l, li) => `<span class="fx-ln" id="${ctx.id(`${id}-l${li}`)}"><span>${l.split(' ').map((wd) => { const wid = `${id}-w${k++}`; words.push({ id: wid, w: wd }); return `<span class="fx-c" id="${ctx.id(wid)}">${esc(wd)}</span>`; }).join(' ')}</span></span>`).join('');
  const html = `<div class="fx-t" id="${ctx.id(id)}" style="left:${px(x)};top:${px(y)};width:${px(w)};font-family:'${font}';font-weight:${wght};font-size:${f.size}px;line-height:${lh};letter-spacing:${tracking}em;color:${color};text-align:${align};${upper ? 'text-transform:uppercase;' : ''}">${lines}</div>`;
  return { html, words, size: f.size, h: f.lines.length * f.size * lh, lines: f.lines };
}

// water rings from the seal on the music hits (the „stamp on water“): thin perspective ellipses that grow out from behind the
// logo and fade. One element per ring (no tween overlap); returns html. times = hit times; each hit = 2 rings (main + echo).
export function ripples(ctx, { id = 'rp', cx, cy, w = 1000, h = 330, color = '#38B0C0', times = [], peak = 0.5, d = 1.5 } = {}) {
  let html = '';
  times.forEach((t, i) => [0, 1].forEach((e) => {
    const rid = `${id}${i}${e}`, pk = e ? peak * 0.55 : peak, tt = t + e * 0.16;
    html += `<i class="fx-abs" id="${ctx.id(rid)}" style="left:${px(cx - w / 2)};top:${px(cy - h / 2)};width:${px(w)};height:${px(h)};border-radius:50%;border:${e ? 1.5 : 2.5}px solid ${color};box-shadow:0 0 18px ${hexA(color, 0.35)},inset 0 0 14px ${hexA(color, 0.2)};opacity:0"></i>`;
    ctx.tl.fromTo(ctx.sel(rid), { scale: 0.3 }, { scale: e ? 1.45 : 1.8, duration: d, ease: 'expo.out' }, tt);
    ctx.tl.fromTo(ctx.sel(rid), { opacity: 0 }, { opacity: pk, duration: 0.06, ease: 'none' }, tt);
    ctx.tl.fromTo(ctx.sel(rid), { opacity: pk }, { opacity: 0, duration: d - 0.1, ease: 'power2.in' }, tt + 0.06);
  }));
  return html;
}
