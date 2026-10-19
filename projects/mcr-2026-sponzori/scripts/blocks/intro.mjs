// INTRO · bars 0–7 · build-up (no kick) → drop into venue at bar 8.
// Event opener, neutral (not a sponsor world): black, white, one cold "water" accent, Archivo variable type.
// Beats: TA hero (bar 0) → title on VO (bars 1–2) → date + place over split-screen photos (3–4) → 40 / hard baits (5) → partners + speed ramp into the drop (6–7).
import * as fx from '../lib/fx.mjs';

export const theme = { bg: '#04060a', bg2: '#0b1622', fg: '#ffffff', accent: '#8fe3ff', accent2: '#ffffff', font: { display: 'Archivo', text: 'Inter' }, wght: 900 };
export const meta = { reel: false };

export default function intro(ctx) {
  const E = ctx.event, T = theme, { bar, beat } = ctx;
  const vo = ctx.vo, at = (q, dflt) => ctx.snap(vo.at(q) ?? dflt, 'beat');
  const L = ctx.safe.left, CW = ctx.W - ctx.safe.left - ctx.safe.right;
  let html = '';
  // ---- background: deep field + slow aurora (whole block) ----
  html += fx.field(ctx, { kind: 'radial', c1: '#0b1a2a', c2: T.bg, at: '50% 42%' });
  html += fx.mesh(ctx, { id: 'mesh', colors: ['#0d3550', '#123a6b', '#0a5a66', '#1b1f4a'], size: 1000, blur: 160, opacity: 0.7, drift: 200 });

  // ---- bar 0: TA hero + "uvádí" ----
  const hero = ctx.plate.hero(0.1, 1.4, { scale: 2.4, cy: 820, fly: 0.6 });
  const s0 = fx.headline(ctx, { id: 'uv', text: 'uvádí', x: L, y: hero.y + hero.h + 54, w: CW, maxLines: 1, size: 34, font: 'Inter', wght: 600, tracking: 0.5, upper: true, align: 'center', color: T.accent, t: beat(2), reveal: 'chars', stagger: 0.04 });
  html += fx.scene(ctx, 'sc0', 0, 1.0, s0.html);

  // ---- bars 1–2: MISTROVSTVÍ ČR / v Trout Area 2026 (variable width + weight on VO) ----
  const tT = Math.max(1.35, at('Mistrovství', bar(1)));
  let s1 = fx.photo(ctx, { id: 'p1', src: ctx.data.photos[0], treat: 'duo', d1: '#04060a', d2: '#6fb6d6', kb: { from: { scale: 1.22 }, to: { scale: 1.05 }, t0: tT, t1: bar(3) }, style: 'opacity:.55' });
  const h1 = fx.headline(ctx, { id: 't1', text: 'Mistrovství ČR', x: L, y: 640, w: CW, maxLines: 2, font: 'Archivo', wght: 900, wdth: 75, upper: true, tracking: -0.01, lh: 0.92, sizes: [230, 210, 196, 184, 170, 156, 140], t: tT, reveal: 'lines', variable: true });
  const h2 = fx.headline(ctx, { id: 't2', text: 'v Trout Area 2026', x: L, y: 640 + h1.h + 36, w: CW, maxLines: 1, font: 'Archivo', wght: 500, wdth: 100, tracking: -0.01, sizes: [96, 88, 80, 72], color: T.accent, t: tT + ctx.BEAT * 2, reveal: 'chars', stagger: 0.03 });
  s1 += h1.html + h2.html;
  fx.varType(ctx, h1.sel, tT, { from: { wght: 100, wdth: 62, trk: 0.08 }, to: { wght: 900, wdth: 75, trk: -0.01 }, d: 1.6 });
  fx.chroma(ctx, h1.sel, bar(2), { amt: 7, d: 0.4 });
  html += fx.scene(ctx, 'sc1', tT, bar(3), s1, { outD: 0.2 });

  // ---- bars 3–4: date + place over a split-screen photo grid ----
  const cells = ctx.data.photos.slice(1, 7).map((src) => ({ src }));   // photos[0] = title backdrop, [7] = partners backdrop
  let s2 = fx.grid(ctx, { id: 'g', cells, cols: 2, rows: 3, gap: 8, t: bar(3), mode: 'cols', stagger: 0.06, d: 0.8 });
  s2 += `<div class="fx-full" style="background:linear-gradient(180deg, rgba(4,6,10,.2), rgba(4,6,10,.78) 40%, rgba(4,6,10,.9) 70%, rgba(4,6,10,.4))"></div>`;
  const d1 = fx.headline(ctx, { id: 'd1', text: E.dateBig, x: L, y: 640, w: CW, maxLines: 1, font: 'Archivo', wght: 900, wdth: 100, sizes: [200, 184, 170, 160, 150, 140], tracking: -0.04, t: bar(3) + ctx.BEAT, reveal: 'lines' });
  const d2 = `<div class="fx-t fx-of" id="${ctx.id('yr')}" style="left:${L}px;top:${640 + d1.h + 20}px;font-family:'Archivo';font-weight:900;font-stretch:125%;font-size:200px;line-height:1;letter-spacing:-.04em;--ofc:${T.accent};--ofw:3px">${E.year}</div>`;
  fx.outlineFill(ctx, ctx.sel('yr'), bar(3) + ctx.BEAT * 3, { d: 1.0 });
  ctx.tl.fromTo(ctx.sel('yr'), { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.6, ease: 'expo.out' }, bar(3) + ctx.BEAT * 2);
  const tPl = Math.max(bar(4), at('Líheň', bar(4)));
  const pl = fx.headline(ctx, { id: 'pl', text: E.place, x: L, y: 1150, w: CW, maxLines: 1, font: 'Archivo', wght: 800, wdth: 100, sizes: [104, 96, 88, 80], t: tPl, reveal: 'lines' });
  const pond = fx.headline(ctx, { id: 'pond', text: E.pond, x: L, y: 1150 + pl.h + 18, w: CW, maxLines: 1, font: 'Inter', wght: 600, size: 36, upper: true, tracking: 0.16, color: T.accent, t: tPl + ctx.BEAT, reveal: 'fade' });
  s2 += d1.html + d2 + pl.html + pond.html;
  html += fx.scene(ctx, 'sc2', bar(3), bar(5), s2, { outD: 0.2 });

  // ---- bar 5–6: 40 závodníků + HARD BAITS sticker ----
  const tP = Math.min(bar(7) - ctx.BEAT, Math.max(bar(6) + ctx.BEAT * 2, at('Seznamte', bar(6) + ctx.BEAT * 2)));
  const t40 = Math.max(bar(5), at('Čtyřicet', bar(5)));
  let s3 = fx.glow(ctx, { id: 'g40', x: 420, y: 980, size: 1100, color: '#0d4d6b', opacity: 0.8 });
  s3 += fx.odometer(ctx, { id: 'n40', value: '40', x: L - 10, y: 640, size: 520, font: 'Archivo', wght: 900, t: t40 - 0.15, d: 1.1, spins: 1 });
  s3 += fx.headline(ctx, { id: 'zav', text: 'závodníků', x: L, y: 1180, w: CW, maxLines: 1, font: 'Archivo', wght: 800, wdth: 110, size: 110, tracking: -0.02, t: t40 + 0.25, reveal: 'lines' }).html;
  s3 += fx.sticker(ctx, { id: 'hb', text: 'Hard baits', x: 790, y: 700, size: 270, color: T.accent, fg: '#04060a', rot: -14, t: Math.max(t40 + ctx.BEAT * 2, at('hard', bar(5) + ctx.BEAT * 3)), font: 'Archivo' });
  html += fx.scene(ctx, 'sc3', bar(5), tP, s3, { outD: 0.15 });

  // ---- bars 6–7: Partneři mistrovství + names → speed ramp into the drop ----
  const names = ctx.data.partners || ['Líheň Liběchov', 'Troutshop.eu', 'Activefishing.cz', 'Moonky', 'Jigovky.cz', 'Velka-ryba.cz', 'Bosset.cz', 'Gausse Holler'];
  let s4 = fx.photo(ctx, { id: 'p4', src: ctx.data.photos[7], treat: 'duo', d1: '#04060a', d2: '#3a8fb3', kb: { from: { scale: 1.05 }, to: { scale: 1.3 }, t0: tP, t1: ctx.dur, ease: 'fxRampIn' }, style: 'opacity:.5' });
  const p1 = fx.headline(ctx, { id: 'pa', text: 'Partneři', x: L, y: 600, w: CW, maxLines: 1, font: 'Archivo', wght: 900, wdth: 112, upper: true, sizes: [200, 184, 170, 156, 144, 132], tracking: -0.03, t: tP, reveal: 'chars', stagger: 0.03 });
  const p2 = fx.headline(ctx, { id: 'pb', text: 'mistrovství', x: L, y: 600 + p1.h + 6, w: CW, maxLines: 1, font: 'Archivo', wght: 300, wdth: 100, sizes: [150, 136, 124, 112], tracking: -0.02, color: T.accent, t: tP + ctx.BEAT, reveal: 'lines' });
  s4 += `<div class="fx-abs" id="${ctx.id('names')}" style="left:${L}px;top:1080px;width:${ctx.W - L - ctx.safe.uiRight}px;display:flex;flex-wrap:wrap;gap:14px 16px">${names.map((n, i) => `<span id="${ctx.id(`nm${i}`)}" style="font:700 30px/1 'Inter';padding:14px 20px;border-radius:999px;background:rgba(255,255,255,.08);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.28);white-space:nowrap">${ctx.esc(n)}</span>`).join('')}</div>`;
  names.forEach((_, i) => ctx.tl.fromTo(ctx.sel(`nm${i}`), { opacity: 0, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.8)' }, tP + ctx.BEAT + i * ctx.BEAT * 0.25));
  s4 += p1.html + p2.html;
  html += fx.scene(ctx, 'sc4', tP, ctx.dur, `<div class="fx-full" id="${ctx.id('cam')}">${s4}</div>`);
  fx.ramp(ctx, ctx.sel('cam'), bar(7), ctx.dur, { from: { scale: 1 }, to: { scale: 1.18 } });
  // riser accents: white flashes getting stronger on the last beats before the drop
  [0, 1, 2, 3].forEach((k) => fx.flash(ctx, ctx.at(7, k), { id: `rf${k}`, color: '#ffffff', peak: 0.06 + k * 0.06, d: 0.3 }));
  fx.tOut(ctx, 'zoom', { d: 0.42 });
  return { html, css: '', timeline: ctx.tl };
}
