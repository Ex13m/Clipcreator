// BOSSET.CZ · bars 37–40 · PLACEHOLDER (minimal, modern) — the Bosset agent replaces this file.
// Brand world (research/bosset.md): teal logo #1B97B1, yellow accent #FFC500, light-blue header #C5EBFC, black; Outfit display.
// Prizes = Zojirushi 0,6 l thermoses (sold by Bosset; say nothing about Zojirushi origin). Studio product line-up with floor reflections.
import * as fx from '../lib/fx.mjs';

export const theme = { bg: '#c5ebfc', bg2: '#f4fbff', fg: '#0b1d24', accent: '#1b97b1', accent2: '#ffc500', font: { display: 'Outfit', text: 'Outfit' }, wght: 800, light: true, upper: false };
export const meta = { reel: true, hook: { product: 0, headline: 'Ceny pro vítěze', sub: 'termosky od Bosset.cz' }, endCard: { logo: 'on_light' } };

export default function bosset(ctx) {
  const T = theme, D = ctx.data, { bar } = ctx, P = D.products;
  const L = ctx.safe.left, CW = ctx.W - L - ctx.safe.right;
  const at = (q, d) => ctx.snap(ctx.vo.at(q) ?? d, 'beat');
  let html = fx.field(ctx, { kind: 'radial', c1: T.bg2, c2: T.bg, at: '50% 62%' });
  // studio floor
  html += `<div class="fx-abs" style="left:0;right:0;top:1250px;height:670px;background:linear-gradient(180deg, rgba(27,151,177,.16), rgba(27,151,177,0) 70%)"></div>`;
  html += fx.headline(ctx, { id: 'k', text: 'Ceny pro vítěze', x: L, y: 400, w: CW, maxLines: 1, font: 'Outfit', wght: 800, sizes: [150, 136, 124, 112], tracking: -0.03, color: T.fg, t: 0.05, reveal: 'lines' }).html;
  html += fx.headline(ctx, { id: 'k2', text: 'věnuje Bosset.cz', x: L, y: 560, w: CW, maxLines: 1, font: 'Outfit', wght: 500, size: 64, color: T.accent, t: 0.3, reveal: 'chars', stagger: 0.02 }).html;
  // line-up: hero in the middle, others rise one per beat (floor + reflection), light sweep runs across
  const FLOOR = 1260, order = [2, 1, 0, 3, 4], xs = [170, 345, 530, 715, 880], hs = [430, 470, 560, 470, 430];
  order.forEach((pi, k) => {
    const p = P[pi]; if (!p) return;
    const pr = fx.product(ctx, { id: `t${k}`, src: p.src, h: hs[k], cx: xs[k], floor: FLOOR, ground: 'floor', reflect: 0.28, shadow: 0.35, pad: p.pad, maxUp: 1.0 });
    html += pr.html;
    fx.productIn(ctx, `t${k}`, 0.3 + Math.abs(k - 2) * ctx.BEAT * 0.5, { from: 'rise', d: 0.7, dist: 200 });
    fx.sweep(ctx, `t${k}`, bar(1) + k * 0.08, { d: 0.7 });
  });
  fx.punch(ctx, ctx.sel('t2-cam'), bar(1), { scale: 1.06 });
  // facts on VO: termosky … horký i studený až šest hodin
  const tH = Math.max(bar(2), at('šest', bar(2) + ctx.BEAT * 2) - 0.6);
  html += fx.chip(ctx, { id: 'c1', label: 'Termosky', value: '0,5–0,7 l', x: L, y: 1440 - 150, tone: 'light', accent: T.accent, t: Math.max(bar(1), at('termosky', bar(1))), font: 'Outfit', vs: 48 });
  let s2 = fx.odometer(ctx, { id: 'h6', value: '6', x: 556, y: 1260, size: 180, font: 'Outfit', wght: 900, color: T.accent, t: tH, d: 0.9, spins: 1 });
  s2 += fx.headline(ctx, { id: 'h6l', text: 'hodin horké i studené', x: 676, y: 1290, w: 230, maxLines: 3, font: 'Outfit', wght: 700, size: 34, lh: 1.05, color: T.fg, t: tH + 0.2, reveal: 'lines' }).html;
  html += fx.scene(ctx, 's2', tH, ctx.dur, `<div class="fx-abs" style="left:520px;top:1250px;width:410px;height:200px;border-radius:28px;background:rgba(255,255,255,.7);box-shadow:0 20px 40px rgba(11,29,36,.12)"></div>${s2}`, {});
  const lg = ctx.logo('on_light', { box: [300, 90], at: [bar(3), ctx.dur], id: 'logo' });
  html += `<div class="fx-abs" id="${ctx.id('lw')}" style="left:${ctx.W - ctx.safe.right - lg.w}px;top:${ctx.plate.rect.y + 20}px">${lg.html}</div>`;
  ctx.tl.fromTo(ctx.sel('lw'), { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.5, ease: 'expo.out' }, bar(3));
  ctx.downs.forEach((t, i) => i && fx.flash(ctx, t, { id: `fl${i}`, color: '#ffffff', peak: 0.25, d: 0.3 }));
  fx.tIn(ctx, 'iris', { d: 0.6 });
  fx.tOut(ctx, 'wipe', { d: 0.4, dir: 'up' });
  return { html };
}
