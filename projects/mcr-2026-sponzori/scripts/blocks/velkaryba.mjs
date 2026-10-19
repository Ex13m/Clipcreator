// VELKA-RYBA.CZ · bars 29–32 · PLACEHOLDER (minimal, modern) — the Velká ryba agent replaces this file.
// Brand world (research/velkaryba.md): navy #143D6B / #183C6B, dark navy #0F2541, red #DA0F00 (prices), white; "Vše na přívlač".
// Display: Oswald (condensed sport). Logo needs a light ground → use the plate variant on dark. Retailer: Shimano/Daiwa/Illex are NOT its brands.
import * as fx from '../lib/fx.mjs';

export const theme = { bg: '#0f2541', bg2: '#183c6b', fg: '#ffffff', accent: '#da0f00', accent2: '#7fb0e6', font: { display: 'Oswald', text: 'Inter' }, wght: 700, upper: true };
export const meta = { reel: true, hook: { product: 4, headline: 'Vše na přívlač', sub: 'velka-ryba.cz' }, endCard: { logo: 'plate' } };

export default function velkaryba(ctx) {
  const T = theme, D = ctx.data, { bar } = ctx, P = D.products;
  const L = ctx.safe.left, CW = ctx.W - L - ctx.safe.right;
  const at = (q, d) => ctx.snap(ctx.vo.at(q) ?? d, 'beat');
  let html = fx.field(ctx, { kind: 'linear', c1: T.bg2, c2: T.bg, angle: 170 });
  html += fx.marquee(ctx, { id: 'm1', text: 'Vše na přívlač', y: 760, size: 220, font: 'Oswald', wght: 700, color: '#ffffff', speed: 160, dir: -1, rot: -7, style: 'opacity:.09' });
  html += fx.marquee(ctx, { id: 'm2', text: 'Vše na přívlač', y: 1330, size: 220, font: 'Oswald', wght: 700, color: '#ffffff', outline: true, ow: 2, speed: 160, dir: 1, rot: -7, style: 'opacity:.22' });
  const H = fx.headline(ctx, { id: 'h', text: 'Vše na přívlač', x: L, y: 400, w: CW, maxLines: 1, font: 'Oswald', wght: 700, upper: true, sizes: [180, 168, 156, 144], tracking: -0.01, t: 0.05, reveal: 'lines' });
  html += H.html;
  // spoon flip (Cardiff Roll Swimmer front → back) with a speed-ramp push into bar 2
  const F = fx.product(ctx, { id: 'pf', src: D.flip.front, w: 760, cx: 540, cy: 1000, ground: 'float', pad: [0.03, 0.06, 0.03, 0.06], rot: -12 });
  const B = fx.product(ctx, { id: 'pk', src: D.flip.back, w: 760, cx: 540, cy: 1000, ground: 'none', pad: [0.03, 0.06, 0.03, 0.06], rot: -12, maxUp: 1.3 });
  html += `<div class="fx-full" id="${ctx.id('flipw')}">${F.html}${B.html}</div>`;
  fx.productIn(ctx, 'pf', 0.1, { from: 'spin', d: 0.9 });
  fx.productIn(ctx, 'pk', 0.1, { from: 'spin', d: 0.9 });
  fx.sweep(ctx, 'pf', 0.8, { d: 0.8 });
  fx.flip(ctx, 'pf', 'pk', bar(1) + ctx.BEAT * 2, { d: 0.6 });
  fx.ramp(ctx, ctx.sel('flipw'), bar(1), bar(2), { from: { scale: 1 }, to: { scale: 1.25 } });
  ctx.tl.fromTo(ctx.sel('flipw'), { opacity: 1 }, { opacity: 0, duration: 0.12, ease: 'none' }, bar(2) - 0.06);
  // bar 2: product row (third-party spoons it sells) + facts
  const row = [P[0], P[1], P[3]].filter(Boolean);
  let s2 = '';
  row.forEach((p, k) => {
    const pr = fx.product(ctx, { id: `r${k}`, src: p.src, h: 400, cx: 230 + k * 300, cy: 960, ground: 'float', pad: p.pad, rot: [-14, 0, 14][k], maxUp: 1.0 });
    s2 += pr.html; fx.productIn(ctx, `r${k}`, bar(2) + k * ctx.BEAT * 0.5, { from: 'rise', d: 0.6 });
  });
  const tO = Math.max(bar(2), at('Olomouce', bar(2)));
  s2 += fx.chip(ctx, { id: 'c1', label: 'Speciálka', value: 'Olomouc · od 2011', x: L, y: 1200, tone: 'dark', accent: T.accent, t: tO, font: 'Inter', vs: 44 });
  s2 += fx.chip(ctx, { id: 'c2', label: 'Pruty si vyzkoušíte u vody', value: 'Shimano Rod Test Center', x: L, y: 1340, tone: 'dark', accent: T.accent2, t: Math.max(bar(2) + ctx.BEAT * 2, at('Shimano', bar(3))), font: 'Inter', vs: 40 });
  html += fx.scene(ctx, 's2', bar(2), ctx.dur, s2);
  const lg = ctx.logo('plate', { box: [280, 150], at: [bar(3), ctx.dur], id: 'logo' });
  html += `<div class="fx-abs" id="${ctx.id('lw')}" style="left:${ctx.W - ctx.safe.right - lg.w}px;top:${ctx.plate.rect.y - 12}px">${lg.html}</div>`;
  ctx.tl.fromTo(ctx.sel('lw'), { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, bar(3));
  fx.flash(ctx, bar(2), { id: 'hit', color: '#ffffff', peak: 0.5, d: 0.35 });
  fx.tIn(ctx, 'grid', { d: 0.5 });
  fx.tOut(ctx, 'zoom', { d: 0.4 });
  return { html };
}
