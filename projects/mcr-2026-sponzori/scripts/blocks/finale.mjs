// FINALE · bars 45–55 + tail to the end of the track (peak → fade).
// Děkujeme partnerům (peak hit) → logo wall of all partners (each logo ≤ TA logo) → TA hero lockup with the event
// + "Uvidíme se u vody" + MADE BY ⚙ © 2026 Gausse Holler → everything but the TA plate fades out with the music tail.
import * as fx from '../lib/fx.mjs';

export const theme = { bg: '#04060a', bg2: '#0e2233', fg: '#ffffff', accent: '#8fe3ff', accent2: '#ffffff', font: { display: 'Archivo', text: 'Inter' }, wght: 900, upper: true };
export const meta = { reel: false };

export default function finale(ctx) {
  const E = ctx.event, D = ctx.data, { bar } = ctx, T = theme;
  const L = ctx.safe.left, CW = ctx.W - L - ctx.safe.right, CWU = ctx.W - L - ctx.safe.uiRight;
  const at = (q, d) => ctx.snap(ctx.vo.at(q) ?? d, 'beat');
  let html = fx.field(ctx, { kind: 'radial', c1: T.bg2, c2: T.bg, at: '50% 40%' });
  html += fx.mesh(ctx, { id: 'mesh', colors: ['#0d3550', '#1b4f7a', '#0a5a66', '#26215a'], size: 1000, blur: 160, opacity: 0.75, drift: 240, seed: 9 });

  // ---- bars 0–1: DĚKUJEME PARTNERŮM (peak hit) ----
  const h1 = fx.headline(ctx, { id: 'd1', text: E.thanks1, x: L, y: 640, w: CW, maxLines: 1, font: 'Archivo', wght: 900, wdth: 112, upper: true, sizes: [210, 196, 184, 170, 156, 144, 132], tracking: -0.03, t: 0.02, reveal: 'chars', stagger: 0.03, variable: true });
  const h2 = fx.headline(ctx, { id: 'd2', text: E.thanks2, x: L, y: 640 + h1.h + 10, w: CW, maxLines: 1, font: 'Archivo', wght: 300, wdth: 100, sizes: [180, 168, 156, 144], tracking: -0.02, color: T.accent, t: ctx.beat(2), reveal: 'lines' });
  fx.varType(ctx, h1.sel, 0.02, { from: { wght: 900, wdth: 62, trk: 0.1 }, to: { wght: 900, wdth: 112, trk: -0.03 }, d: 0.9, ease: 'expo.out' });
  fx.chroma(ctx, h1.sel, bar(1), { amt: 10 });
  html += fx.scene(ctx, 's0', 0, bar(2), h1.html + h2.html, { outD: 0.2 });

  // ---- bars 2–5: logo wall (2 × 4 glass cards), cards pop on beats, pulse on downbeats ----
  const keys = D.wall, cols = 2, rows = Math.ceil(keys.length / cols), gx = 20, gy = 20;
  const top = 470, bottom = ctx.H - ctx.safe.bottom - 20;
  const cw = (CWU - gx) / cols, chh = Math.min(210, (bottom - top - (rows - 1) * gy) / rows);
  const tW = bar(2), tW1 = bar(6);
  let wall = '';
  keys.forEach((k, i) => {
    const dk = ctx.dataOf(k), variant = dk.logo?.on_dark && k !== 'velkaryba' ? 'on_dark' : 'plate';
    const lg = ctx.logo(dk.logo[variant], { box: [cw - 60, chh - 70], at: [tW, tW1], label: `wall ${k}` });
    const x = L + (i % cols) * (cw + gx), y = top + Math.floor(i / cols) * (chh + gy);
    wall += `<div class="fx-abs" id="${ctx.id(`w${i}`)}" style="left:${x}px;top:${y}px;width:${cw}px;height:${chh}px;border-radius:26px;background:rgba(255,255,255,.08);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.18);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px">${lg.html}<span style="font:700 18px/1 'Inter';letter-spacing:.14em;text-transform:uppercase;opacity:.7">${ctx.esc(k === 'venue' ? 'Místo konání' : dk.url || '')}</span></div>`;
    ctx.tl.fromTo(ctx.sel(`w${i}`), { opacity: 0, scale: 0.6, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }, tW + i * ctx.BEAT * 0.5);
  });
  ctx.downs.filter((t) => t >= bar(4) - 1e-3 && t < tW1 - 0.1).forEach((t, j) => keys.forEach((_, i) => (i + j) % 3 === 0 && fx.punch(ctx, ctx.sel(`w${i}`), t, { scale: 1.05 })));
  html += fx.scene(ctx, 's1', tW, tW1, wall, { outD: 0.3 });

  // ---- bars 6 → end: TA hero lockup + event + Uvidíme se u vody + MADE BY GH; fade with the tail ----
  const tH = bar(6);
  const P = ctx.plate.hero(tH, ctx.dur, { scale: 2.4, cy: 700, fly: 0.9 });
  const y0 = P.y + P.h + 60;
  let s2 = fx.headline(ctx, { id: 'e1', text: E.title1, x: L, y: y0, w: CW, maxLines: 1, font: 'Archivo', wght: 800, wdth: 100, sizes: [72, 66, 60], align: 'center', t: tH + 0.6, reveal: 'lines' }).html;
  s2 += fx.headline(ctx, { id: 'e1b', text: E.title2, x: L, y: y0 + 80, w: CW, maxLines: 1, font: 'Archivo', wght: 400, wdth: 100, sizes: [60, 56, 52], align: 'center', t: tH + 0.75, reveal: 'lines' }).html;
  s2 += fx.headline(ctx, { id: 'e2', text: `${E.date} · ${E.place}`, x: L, y: y0 + 170, w: CW, maxLines: 1, font: 'Inter', wght: 600, sizes: [40, 36, 32], align: 'center', color: T.accent, t: tH + 0.9, reveal: 'fade' }).html;
  const tC = Math.max(bar(8), at('Uvidíme', bar(8)) - 0.1);
  s2 += fx.headline(ctx, { id: 'e3', text: 'Uvidíme se u vody', x: L, y: y0 + 270, w: CW, maxLines: 1, font: 'Archivo', wght: 900, wdth: 112, upper: true, sizes: [96, 88, 80, 72], align: 'center', t: tC, reveal: 'chars', stagger: 0.03 }).html;
  // MADE BY ⚙ © 2026 Gausse Holler — readable size (it is a GH mark → logo rule, allowed because the TA plate is ×2.4 here)
  const mb = ctx.logo(D.madeby.on_dark, { box: [600, 80], scale: 2.4, at: [bar(8), ctx.dur], label: 'MADE BY GH' });
  s2 += `<div class="fx-abs" id="${ctx.id('mb')}" style="left:${(ctx.W - mb.w) / 2}px;top:${ctx.H - ctx.safe.bottom - mb.h - 10}px">${mb.html}</div>`;
  ctx.tl.fromTo(ctx.sel('mb'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, bar(8) + ctx.BEAT * 2);
  html += fx.scene(ctx, 's2', tH, ctx.dur, s2);
  fx.flash(ctx, 0, { id: 'peak', color: '#ffffff', peak: 0.7, d: 0.5 });
  [2, 6].forEach((b) => fx.flash(ctx, bar(b), { id: `fb${b}`, color: T.accent, peak: 0.25, d: 0.4, blend: 'screen' }));
  // tail: fade the block to black over the last bars (the TA plate — root layer — stays)
  const tailT = Math.min(bar(10), ctx.dur - 4);
  ctx.overlay(`<div class="fx-ov" id="${ctx.id('fade')}" style="background:#000"></div>`);
  ctx.tl.fromTo(ctx.sel('fade'), { opacity: 0 }, { opacity: 0.85, duration: ctx.dur - tailT - 0.3, ease: 'sine.in' }, tailT);
  return { html };
}
