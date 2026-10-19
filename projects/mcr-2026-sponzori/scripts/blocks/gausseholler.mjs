// GAUSSE HOLLER · bars 41–44 · PLACEHOLDER (minimal, modern) — the Gausse Holler agent replaces this file.
// Brand world (research/gausseholler.md): dark studio #0F1113 / #16191C / borders #282D33, text #E9E6E2, ice accent #7FB2C7,
// gear blue #1D8FD5, Black-edition orange ≈ #F0904F; Inter + serif wordmark feel (Playfair Display). Hero: Revolut 8 Black render.
import * as fx from '../lib/fx.mjs';

export const theme = { bg: '#0f1113', bg2: '#2a3036', fg: '#e9e6e2', accent: '#f0904f', accent2: '#7fb2c7', font: { display: 'Inter', text: 'Inter', serif: 'Playfair Display' }, wght: 800, upper: false };
export const meta = { reel: true, hook: { product: 1, headline: 'Black Standard Edition', sub: 'gausseholler.com' }, endCard: { logo: 'on_dark' } };

export default function gausseholler(ctx) {
  const T = theme, D = ctx.data, { bar } = ctx, P = D.products;
  const L = ctx.safe.left, CW = ctx.W - L - ctx.safe.right, CWU = ctx.W - L - ctx.safe.uiRight;
  const at = (q, d) => ctx.snap(ctx.vo.at(q) ?? d, 'beat');
  let html = fx.field(ctx, { kind: 'radial', c1: T.bg2, c2: T.bg, at: '50% 52%' });
  html += fx.glow(ctx, { id: 'spot', x: 540, y: 980, size: 1200, color: '#3b444d', opacity: 0.9 });
  // studio floor line
  html += `<div class="fx-abs" style="left:0;right:0;top:1250px;height:2px;background:linear-gradient(90deg, transparent, rgba(233,230,226,.25), transparent)"></div>`;
  // hero: Revolut 8 Black, floor reflection, slow 3D tilt, rim-light sweep
  const S = fx.product(ctx, { id: 'st', src: P[1].src, h: 600, cx: 540, floor: 1250, ground: 'floor', reflect: 0.22, shadow: 0.7, pad: P[1].pad, sweepOpacity: 0.55, maxUp: 1.0 });
  html += S.html;
  fx.productIn(ctx, 'st', 0.05, { from: 'rise', d: 1.1, dist: 160 });
  fx.tilt(ctx, 'st', 0.3, ctx.dur, { ry: 12, rx: 3 });
  fx.sweep(ctx, 'st', bar(1), { d: 1.1 });
  fx.sweep(ctx, 'st', bar(3), { d: 1.1 });
  // kicker + serif name
  html += fx.headline(ctx, { id: 'k', text: 'Stojan na pruty', x: L, y: 400, maxLines: 1, font: 'Inter', wght: 600, upper: true, size: 30, tracking: 0.28, color: T.accent2, t: 0.1, reveal: 'chars', stagger: 0.02 }).html;
  const N = fx.headline(ctx, { id: 'n', text: 'Black Standard Edition', x: L, y: 448, w: CW, maxLines: 2, font: 'Playfair Display', wght: 900, italic: true, sizes: [112, 104, 96, 88], lh: 1.0, t: Math.max(0.3, at('Black', 0.6) - 0.2), reveal: 'lines' });
  html += N.html;
  // spec chips on VO (ručně stavěný v Česku · karbon · hliník · limitovaná série)
  const tR = Math.max(bar(1) + ctx.BEAT * 2, at('Ručně', bar(2)) - 0.2);
  html += fx.chip(ctx, { id: 'c1', label: 'Ručně stavěno', value: 'v Česku', x: L, y: 1280, tone: 'dark', accent: T.accent, t: tR, font: 'Inter', vs: 40, ls: 18 });
  html += fx.chip(ctx, { id: 'c2', label: 'Karbon · hliník', value: '8 tubusů', x: L + 330, y: 1280, tone: 'dark', accent: T.accent2, t: Math.max(tR + ctx.BEAT, at('karbon', tR + ctx.BEAT)), font: 'Inter', vs: 40, ls: 18 });
  html += fx.sticker(ctx, { id: 'ltd', text: '5 ks', sub: 'číslovaná série', x: 820, y: 760, size: 210, color: T.accent, fg: '#0f1113', shape: 'circle', rot: 8, t: Math.min(bar(3) + ctx.BEAT, Math.max(bar(2) + ctx.BEAT * 2, at('limitovaná', bar(3)))), font: 'Inter', rays: false });
  // lockup: gear mark + URL (logo rule: ≤ TA plate)
  const tL = bar(3) + ctx.BEAT;
  const lg = ctx.logo('on_dark', { box: [150, 150], at: [tL, ctx.dur], id: 'logo' });
  html += `<div class="fx-abs" id="${ctx.id('lw')}" style="left:${ctx.W - ctx.safe.right - lg.w}px;top:${ctx.plate.rect.y}px">${lg.html}</div>`;
  ctx.tl.fromTo(ctx.sel('lw'), { opacity: 0, rotation: -60 }, { opacity: 1, rotation: 0, duration: 0.8, ease: 'expo.out' }, tL);
  html += fx.headline(ctx, { id: 'u', text: D.url, x: L, y: 1410, maxLines: 1, font: 'Inter', wght: 700, size: 40, tracking: 0.02, color: T.fg, t: tL + 0.2, reveal: 'fade' }).html;
  fx.tIn(ctx, 'wipe', { d: 0.5, dir: 'up' });
  fx.tOut(ctx, 'zoom', { d: 0.45, color: '#ffffff' });
  return { html };
}
