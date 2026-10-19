// MOONKY · bars 21–24 · PLACEHOLDER (minimal, modern) — the Moonky agent replaces this file.
// Brand world (research/moonky.md, moonky_user.md): handmade soft lures; dark navy #0E1424/#141C24 + white logo,
// the colour comes from the lures themselves (fluo lime, bubblegum pink, orange, blue→pink). Display: Unbounded (wide, soft).
import * as fx from '../lib/fx.mjs';

export const theme = { bg: '#0e1424', bg2: '#1a2442', fg: '#ffffff', accent: '#b8ff2e', accent2: '#ff4f8b', font: { display: 'Unbounded', text: 'Inter' }, wght: 800, upper: true };
export const meta = { reel: true, hook: { product: 2, headline: 'Ručně dělané gumové nástrahy', sub: 'moonky.cz' }, endCard: { logo: 'on_dark' } };

export default function moonky(ctx) {
  const T = theme, D = ctx.data, { bar } = ctx, P = D.products;
  const L = ctx.safe.left, CW = ctx.W - L - ctx.safe.right;
  const at = (q, d) => ctx.snap(ctx.vo.at(q) ?? d, 'beat');
  let html = fx.field(ctx, { kind: 'radial', c1: T.bg2, c2: T.bg, at: '50% 50%' });
  html += fx.mesh(ctx, { id: 'mesh', colors: ['#8acc01', '#f34769', '#0c78bd', '#f7ab41', '#c138a1'], size: 760, blur: 170, opacity: 0.42, drift: 220, seed: 4 });
  html += fx.marquee(ctx, { id: 'mq1', text: 'Ručně dělané · Handmade lures', y: 1520, size: 120, font: 'Unbounded', wght: 800, color: '#ffffff', outline: true, ow: 2, speed: 140, rot: -6, style: 'opacity:.22' });
  // depth stack of lures (parallax): far (small, blurred) → near (big)
  const lay = [
    { p: P[4], id: 'l0', w: 520, cx: 300, cy: 760, rot: -18, depth: 0.35, blur: 3, t: 0.2 },
    { p: P[3], id: 'l1', w: 640, cx: 720, cy: 900, rot: 14, depth: 0.6, blur: 0, t: 0.35 },
    { p: P[2], id: 'l2', w: 840, cx: 520, cy: 1090, rot: -8, depth: 1.0, blur: 0, t: 0.5 },
  ];
  for (const l of lay) {
    const pr = fx.product(ctx, { id: l.id, src: l.p.src, w: l.w, cx: l.cx, cy: l.cy, ground: 'float', pad: l.p.pad, rot: l.rot, maxUp: 1.0, style: l.blur ? `filter:blur(${l.blur}px)` : '' });
    html += pr.html; l.cam = pr.cam;
    fx.productIn(ctx, l.id, l.t, { from: 'scale', d: 0.8, ease: 'back.out(1.6)' });
    fx.float(ctx, pr.cam, 1.2, bar(2), { y: -14 * l.depth, period: ctx.BAR / 2 });
  }
  fx.sweep(ctx, 'l2', bar(1), { d: 0.9 });
  // headline with outline → fill
  const H = fx.headline(ctx, { id: 'h', text: 'Ručně dělané', x: L, y: 400, w: CW, maxLines: 1, font: 'Unbounded', wght: 900, upper: true, sizes: [116, 104, 96, 88, 80], t: 0.05, reveal: 'lines', cls: 'fx-of', style: `--ofc:${T.accent};--ofw:3px` });
  html += H.html;
  fx.outlineFill(ctx, H.sel, 0.5, { d: 0.9 });
  html += fx.headline(ctx, { id: 'h2', text: 'gumové nástrahy', x: L, y: 400 + H.h + 10, w: CW, maxLines: 1, font: 'Unbounded', wght: 500, sizes: [76, 68, 60], t: 0.35, reveal: 'chars', stagger: 0.02 }).html;
  // bar 2: lures fly to the side, facts arrive (VO "Vyvíjené a testované s českou reprezentací")
  for (const l of lay) ctx.tl.fromTo(ctx.sel(l.id), { x: 0, y: 0 }, { x: -110 * l.depth, y: -90 * l.depth, duration: 0.7, ease: 'expo.inOut' }, bar(2) - 0.2);
  const tR = Math.max(bar(2), at('reprezentací', bar(2) + ctx.BEAT * 2) - 0.6);
  html += fx.sticker(ctx, { id: 'cnc', text: 'CNC', sub: 'vlastní formy', x: 820, y: 1060, size: 250, color: T.accent, fg: T.bg, rot: 10, t: bar(2), font: 'Unbounded' });
  html += fx.chip(ctx, { id: 'c1', label: 'Vyvíjeno a testováno', value: 's reprezentací ČR', x: L, y: 1200, tone: 'dark', accent: T.accent2, t: tR, font: 'Inter', vs: 46 });
  // logo + url, last bar
  const lg = ctx.logo('on_dark', { box: [300, 100], at: [bar(3), ctx.dur], id: 'logo' });
  html += `<div class="fx-abs" id="${ctx.id('lw')}" style="left:${ctx.W - ctx.safe.right - lg.w}px;top:${ctx.plate.rect.y + 14}px">${lg.html}</div>`;
  ctx.tl.fromTo(ctx.sel('lw'), { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' }, bar(3));
  html += fx.headline(ctx, { id: 'u', text: D.url, x: L, y: 1340, maxLines: 1, font: 'Unbounded', wght: 700, size: 52, color: T.fg, t: bar(3) + ctx.BEAT, reveal: 'chars', stagger: 0.02 }).html;
  ctx.downs.forEach((t, i) => i && fx.flash(ctx, t, { id: `fl${i}`, color: i % 2 ? T.accent2 : T.accent, peak: 0.12, d: 0.35, blend: 'screen' }));
  fx.tIn(ctx, 'blob', { d: 0.55 });
  fx.tOut(ctx, 'blob', { d: 0.45 });
  return { html };
}
