// TROUTSHOP.EU · bars 13–16 · PLACEHOLDER (minimal, modern) — the Troutshop agent replaces this file.
// Brand world (research/troutshop.md): black #000 / red #E3000F / white, logo = trout + red "rising sun" rays.
// Display: Anton (bold condensed retail). Products: Velvet Arts / Nories / FishUp cut-outs (sold by Troutshop, not its brands).
import * as fx from '../lib/fx.mjs';

export const theme = { bg: '#070707', bg2: '#2a0306', fg: '#ffffff', accent: '#e3000f', accent2: '#ffffff', font: { display: 'Anton', text: 'Inter' }, wght: 400, upper: true };
export const meta = { reel: true, hook: { product: 0, headline: 'Milujeme lov pstruhů', sub: 'troutshop.eu' }, endCard: { logo: 'on_dark' } };

export default function troutshop(ctx) {
  const T = theme, D = ctx.data, { bar } = ctx, P = D.products;
  const L = ctx.safe.left, CW = ctx.W - L - ctx.safe.right;
  const at = (q, d) => ctx.snap(ctx.vo.at(q) ?? d, 'beat');
  let html = '';
  html += fx.field(ctx, { kind: 'radial', c1: T.bg2, c2: T.bg, at: '50% 58%' });
  html += fx.rays(ctx, { x: ctx.W / 2, y: 1080, size: 1900, color: T.accent, n: 18, duty: 0.42, opacity: 0.55, spin: 22, hole: 0.1 });
  html += fx.bigType(ctx, { id: 'big', text: 'Troutshop', font: 'Anton', wght: 400, size: 470, y: 760, x: -40, color: '#ffffff', outline: true, ow: 2, opacity: 0.16, drift: -260 });
  // hero spoons (float + light sweep), second one joins on bar 2
  const A = fx.product(ctx, { id: 'pa', src: P[0].src, h: 620, cx: 430, cy: 1030, ground: 'float', pad: P[0].pad, rot: -14 });
  const B = fx.product(ctx, { id: 'pb', src: P[1].src, h: 600, cx: 690, cy: 1060, ground: 'float', pad: P[1].pad, rot: 12 });
  html += B.html + A.html;
  fx.productIn(ctx, 'pa', 0.1, { from: 'rise', d: 0.9 });
  fx.float(ctx, A.cam, 1.0, ctx.dur, { y: -16, rot: 2 });
  fx.sweep(ctx, 'pa', bar(0) + 0.6, { d: 0.9 });
  fx.productIn(ctx, 'pb', bar(2), { from: 'right', d: 0.8 });
  fx.sweep(ctx, 'pb', bar(2) + 0.7, { d: 0.9 });
  // headline (on-screen copy) + VO-synced facts
  const H = fx.headline(ctx, { id: 'h', text: D.copy.headline, x: L, y: 420, w: CW, maxLines: 2, font: 'Anton', wght: 400, upper: true, sizes: [190, 176, 164, 150, 140], lh: 0.92, t: 0.05, reveal: 'chars', stagger: 0.025 });
  html += H.html;
  ctx.downs.slice(1).forEach((t) => fx.punch(ctx, H.sel, t, { scale: 1.03 }));
  const tY = Math.max(bar(1), at('1999', bar(1) + ctx.BEAT * 2) - 0.5);
  let f1 = fx.headline(ctx, { id: 'fl', text: 'Rodinná firma od roku', x: L, y: 1300, maxLines: 1, font: 'Inter', wght: 700, upper: true, size: 30, tracking: 0.14, t: tY, reveal: 'lines' }).html;
  f1 += fx.odometer(ctx, { id: 'yr', value: '1999', x: L - 4, y: 1340, size: 120, font: 'Anton', wght: 400, color: T.accent, t: tY + 0.1, d: 1.2 });
  html += fx.scene(ctx, 'f1', tY, bar(3), f1, { outD: 0.2 });
  html += fx.chip(ctx, { id: 'c2', label: 'Generální partner', value: 'Trout Area Slovakia', x: L, y: 1300, tone: 'dark', accent: T.accent, t: bar(3), font: 'Inter', vs: 42 });
  // lockup on the last beats: logo ≤ TA plate + URL
  const tL = bar(3) + ctx.BEAT * 2;
  const lg = ctx.logo('on_dark', { box: [300, 140], at: [tL, ctx.dur], id: 'logo' });
  html += `<div class="fx-abs" id="${ctx.id('lw')}" style="left:${ctx.W - ctx.safe.right - lg.w}px;top:${ctx.plate.rect.y - 10}px">${lg.html}</div>`;
  ctx.tl.fromTo(ctx.sel('lw'), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, tL);
  // beat accents: red flash on bars, slices out into the next world
  ctx.downs.forEach((t, i) => i && fx.flash(ctx, t, { id: `fl${i}`, color: T.accent, peak: 0.14, d: 0.35, blend: 'screen' }));
  fx.tIn(ctx, 'slice', { d: 0.45 });
  fx.tOut(ctx, 'slice', { d: 0.4 });
  return { html };
}
