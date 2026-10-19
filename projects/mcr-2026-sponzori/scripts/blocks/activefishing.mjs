// ACTIVEFISHING.CZ · bars 17–20 · PLACEHOLDER (minimal, modern) — the Activefishing agent replaces this file.
// Brand world (research/activefishing.md): clean white/light-grey Shoptet shop, black text, ORANGE gradient #E39025→#DF5942 (logo fish), Nunito.
// Small packshots (386–756 px) → product shown ≤ 1.3× natural; counters carry the message (1 300+ plandavek, 777 woblerů).
import * as fx from '../lib/fx.mjs';

export const theme = { bg: '#f1f1ef', bg2: '#ffffff', fg: '#111111', accent: '#e2812d', accent2: '#df5942', font: { display: 'Nunito', text: 'Nunito' }, wght: 900, light: true, upper: false };
export const meta = { reel: true, hook: { product: 0, headline: 'Přes 1 300 plandavek', sub: 'activefishing.cz' }, endCard: { logo: 'on_light' } };
const GRAD = 'linear-gradient(180deg, #E39025, #E2812D 40%, #DD603A 75%, #DF5942)';

export default function activefishing(ctx) {
  const T = theme, D = ctx.data, { bar } = ctx, P = D.products;
  const L = ctx.safe.left, CW = ctx.W - L - ctx.safe.right, CWU = ctx.W - L - ctx.safe.uiRight;
  const at = (q, d) => ctx.snap(ctx.vo.at(q) ?? d, 'beat');
  let html = fx.field(ctx, { kind: 'radial', c1: T.bg2, c2: T.bg, at: '50% 35%' });
  // big orange disc behind the hero (logo gradient) — parallax layer
  html += `<div class="fx-abs" id="${ctx.id('disc')}" style="left:${ctx.W / 2 - 430}px;top:660px;width:860px;height:860px;border-radius:50%;background:${GRAD};opacity:.95"></div>`;
  ctx.tl.fromTo(ctx.sel('disc'), { scale: 0 }, { scale: 1, duration: 0.8, ease: 'expo.out' }, 0.15);
  // headline (VO: e-shop zrozený z vášně pro přívlač)
  const H = fx.headline(ctx, { id: 'h', text: D.copy.headline, x: L, y: 400, w: CW, maxLines: 2, font: 'Nunito', wght: 1000, sizes: [120, 110, 100, 92, 84], lh: 0.98, tracking: -0.02, color: T.fg, t: 0.05, reveal: 'words' });
  html += H.html;
  // hero spoon pair → on bar 2 the grid of four lures assembles
  const A = fx.product(ctx, { id: 'pa', src: P[0].src, w: 700, cx: ctx.W / 2, cy: 1090, ground: 'float', pad: P[0].pad, rot: -10, maxUp: 1.3 });
  html += A.html;
  fx.productIn(ctx, 'pa', 0.25, { from: 'scale', d: 0.8 });
  fx.sweep(ctx, 'pa', 0.9, { d: 0.8 });
  fx.parallax(ctx, [{ sel: ctx.sel('disc'), depth: 0.4 }, { sel: A.cam, depth: 1 }], 0.3, bar(2) - 0.3, { x: -60, y: -30 });
  fx.productOut(ctx, 'pa', bar(2) - 0.3, { to: 'left', d: 0.3 });
  // bar 2: counter on VO "Přes 1 300 plandavek" — white on the orange disc
  const tC = Math.min(bar(2) + ctx.BEAT, Math.max(bar(2), at('Přes', bar(2)) - 0.15));
  let s1 = fx.headline(ctx, { id: 'pr', text: 'Přes', x: L, y: 840, w: CW, maxLines: 1, align: 'center', font: 'Nunito', wght: 800, size: 56, color: '#ffffff', t: tC, reveal: 'lines' }).html;
  s1 += fx.odometer(ctx, { id: 'n', value: '1 300', suffix: '+', x: L, y: 910, w: CW, align: 'center', size: 230, font: 'Nunito', wght: 1000, color: '#ffffff', t: tC + 0.05, d: 1.2 });
  s1 += fx.headline(ctx, { id: 'pl', text: 'plandavek', x: L, y: 1150, w: CW, maxLines: 1, align: 'center', font: 'Nunito', wght: 900, size: 84, color: '#ffffff', t: tC + 0.35, reveal: 'lines' }).html;
  html += fx.scene(ctx, 's1', tC, bar(3), s1, { outD: 0.2 });
  ctx.tl.fromTo(ctx.sel('disc'), { opacity: 0.95 }, { opacity: 0.25, duration: 0.4, ease: 'power2.out' }, bar(3) - 0.2);
  // bar 3: grid assemble of the range + 777 woblerů + osobní přístup (VO)
  const cells = [P[1], P[2], P[3], P[4]].filter(Boolean);
  let s2 = `<div class="fx-abs" id="${ctx.id('card')}" style="left:${L}px;top:640px;width:${CWU}px;height:620px;border-radius:30px;background:#fff;box-shadow:0 30px 60px rgba(0,0,0,.12)"></div>`;
  s2 += fx.grid(ctx, { id: 'g', cells: cells.map((p) => ({ src: p.src, fit: 'contain', bg: '#fff', pad: 22 })), cols: 2, rows: 2, x: L + 20, y: 660, w: CWU - 40, h: 580, gap: 14, t: bar(3) - 0.1, mode: 'scatter', d: 0.7, stagger: 0.05, radius: 18 });
  s2 += fx.chip(ctx, { id: 'c1', label: 'Woblery', value: '777 kusů', x: L, y: 1290, tone: 'light', accent: T.accent, t: bar(3) + ctx.BEAT, font: 'Nunito', vs: 44 });
  s2 += fx.chip(ctx, { id: 'c2', label: 'E-shop', value: 'osobní přístup', x: L + 380, y: 1290, tone: 'light', accent: T.accent2, t: Math.max(bar(3) + ctx.BEAT * 1.5, at('osobní', bar(3))), font: 'Nunito', vs: 44 });
  ctx.tl.fromTo(ctx.sel('card'), { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' }, bar(3) - 0.15);
  html += s2;
  // block-scoped CSS example: hairline frame on the grid cells
  const css = `${ctx.S} #${ctx.id('g')} > div { box-shadow: inset 0 0 0 2px #f0ece6; }`;
  // logo (works on light) top-right, last bar
  const lg = ctx.logo('on_light', { box: [280, 120], at: [bar(3), ctx.dur], id: 'logo' });
  html += `<div class="fx-abs" id="${ctx.id('lw')}" style="left:${ctx.W - ctx.safe.right - lg.w}px;top:${ctx.plate.rect.y - 6}px">${lg.html}</div>`;
  ctx.tl.fromTo(ctx.sel('lw'), { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.5, ease: 'expo.out' }, bar(3));
  fx.tIn(ctx, 'whip', { d: 0.45 });
  fx.tOut(ctx, 'whip', { d: 0.38 });
  return { html, css };
}
