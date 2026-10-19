// JIGOVKY.CZ · bars 25–28 · PLACEHOLDER (minimal, modern) — the Jigovky agent replaces this file.
// Brand world (research/jigovky.md): black site + white line logo, banners dark green #176E37 + yellow #FED700, Poppins.
// Products: tungsten / jig heads — tiny details (h03–h05 ≈ 500 px) → macro push-in + colour cuts instead of big blow-ups.
import * as fx from '../lib/fx.mjs';

export const theme = { bg: '#060807', bg2: '#0f3a1f', fg: '#ffffff', accent: '#fed700', accent2: '#176e37', font: { display: 'Poppins', text: 'Poppins' }, wght: 900, upper: false };
export const meta = { reel: true, hook: { product: 0, headline: 'Jigy, které chytají!', sub: 'jigovky.cz' }, endCard: { logo: 'on_dark' } };

export default function jigovky(ctx) {
  const T = theme, D = ctx.data, { bar } = ctx, P = D.products;
  const L = ctx.safe.left, CW = ctx.W - L - ctx.safe.right;
  const at = (q, d) => ctx.snap(ctx.vo.at(q) ?? d, 'beat');
  let html = fx.field(ctx, { kind: 'radial', c1: T.bg2, c2: T.bg, at: '60% 55%' });
  html += fx.glow(ctx, { id: 'gl', x: 640, y: 1000, size: 1000, color: T.accent2, opacity: 0.55 });
  // bars 0–1: hero jig (complete packshot) with macro push-in
  const A = fx.product(ctx, { id: 'pa', src: P[0].src, w: 820, cx: 560, cy: 1000, ground: 'float', pad: P[0].pad, rot: -6, maxUp: 1.3 });
  html += A.html;
  fx.productIn(ctx, 'pa', 0.1, { from: 'right', d: 0.8 });
  fx.pushIn(ctx, A.cam, 0.6, bar(2), { from: 1, to: 1.12, origin: '25% 75%' });
  fx.sweep(ctx, 'pa', 0.9, { d: 0.8 });
  fx.productOut(ctx, 'pa', bar(2) - 0.25, { to: 'zoom', d: 0.25 });
  const H = fx.headline(ctx, { id: 'h', text: D.copy.headline, x: L, y: 400, w: CW, maxLines: 2, font: 'Poppins', wght: 900, sizes: [140, 128, 116, 104, 96], lh: 1.0, tracking: -0.03, color: T.accent, t: 0.05, reveal: 'words', stagger: 0.09 });
  html += H.html;
  fx.chroma(ctx, H.sel, bar(1), { amt: 9 });
  // bars 2–3: colour cuts on every beat — head details (red / fluo / pink) with chromatic hits
  const det = [P[2], P[3], P[4]].filter(Boolean);
  const cutT = ctx.beats.filter((t) => t >= bar(2) - 1e-3 && t < bar(3) + ctx.BEAT * 2 - 1e-3);
  let s2 = '';
  det.forEach((p, k) => { s2 += fx.product(ctx, { id: `d${k}`, src: p.src, w: 640, cx: 540, cy: 1000, ground: 'none', pad: p.pad, sweep: false, maxUp: 1.3 }).html; });
  html += fx.scene(ctx, 's2', bar(2), bar(3) + ctx.BEAT * 2, `<div class="fx-full" id="${ctx.id('cuts')}">${s2}</div>`, { outD: 0.15 });
  det.forEach((_, k) => ctx.tl.set(ctx.sel(`d${k}`), { opacity: 0 }, 0));
  cutT.forEach((t, i) => {
    const k = i % det.length, prev = (i + det.length - 1) % det.length;
    if (i) ctx.tl.set(ctx.sel(`d${prev}`), { opacity: 0 }, t);
    ctx.tl.set(ctx.sel(`d${k}`), { opacity: 1 }, t);
    fx.punch(ctx, ctx.sel(`d${k}-cam`), t, { scale: 1.12, d: 0.35 });
    fx.chroma(ctx, ctx.sel(`d${k}-im`), t, { amt: 6, kind: 'img', d: 0.3 });
  });
  html += fx.sticker(ctx, { id: 'bl', text: 'Barbless', sub: '0,4–3 g', x: 800, y: 1300, size: 250, color: T.accent, fg: '#0b0b0b', rot: -10, t: Math.max(bar(2), at('Bezprotihrotové', bar(2))), font: 'Poppins' });
  // last 2 beats: Poctivě vyrobeno v ČR + logo
  const tM = bar(3) + ctx.BEAT * 2;
  html += fx.headline(ctx, { id: 'm', text: 'Poctivě vyrobeno v ČR', x: L, y: 1020, w: CW, maxLines: 2, font: 'Poppins', wght: 800, sizes: [96, 88, 80], color: T.fg, t: tM, reveal: 'lines' }).html;
  html += fx.headline(ctx, { id: 'u', text: D.url, x: L, y: 1260, maxLines: 1, font: 'Poppins', wght: 600, size: 56, color: T.accent, t: tM + ctx.BEAT * 0.5, reveal: 'fade' }).html;
  const lg = ctx.logo('on_dark', { box: [300, 150], at: [tM, ctx.dur], id: 'logo' });
  html += `<div class="fx-abs" id="${ctx.id('lw')}" style="left:${ctx.W - ctx.safe.right - lg.w}px;top:${ctx.plate.rect.y - 16}px">${lg.html}</div>`;
  ctx.tl.fromTo(ctx.sel('lw'), { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'none' }, tM);
  ctx.downs.forEach((t, i) => i && fx.flash(ctx, t, { id: `fl${i}`, color: T.accent, peak: 0.16, d: 0.3, blend: 'screen' }));
  fx.tIn(ctx, 'flash', { color: T.accent, d: 0.35 });
  fx.tOut(ctx, 'grid', { d: 0.45 });
  return { html };
}
