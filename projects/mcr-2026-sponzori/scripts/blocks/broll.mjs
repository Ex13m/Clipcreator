// B-ROLL · used twice: 'broll' (bars 33–34, energetic cut on every beat) and 'brollbreak' (bars 35–36, musical break: slow, breathing).
// Not a sponsor world: real fishing moments (assets_prep/broll, 1080×1920, subjects in the middle band). No VO.
// data/blocks/<key>.json → mode 'cut' | 'break', photos[], copy.line. Videos from the operator will slot in here later.
import * as fx from '../lib/fx.mjs';

export const theme = { bg: '#000000', bg2: '#101418', fg: '#ffffff', accent: '#8fe3ff', font: { display: 'Archivo', text: 'Inter' }, wght: 900, upper: true };
export const meta = { reel: false };

export default function broll(ctx) {
  const D = ctx.data, L = ctx.safe.left, CW = ctx.W - L - ctx.safe.right;
  let html = '';
  if (D.mode === 'break') {
    // two slow plates: duotone → halftone, long push-in, one mask-revealed line, letter-spacing breathing
    const ph = D.photos;
    html += fx.photo(ctx, { id: 'a', src: ph[0], treat: 'duo', d1: '#05080c', d2: '#9fd8ee', kb: { from: { scale: 1.04 }, to: { scale: 1.16 }, t0: 0, t1: ctx.dur, ease: 'sine.inOut' } });
    html += fx.scene(ctx, 'sb', ctx.bar(1), ctx.dur, fx.photo(ctx, { id: 'b', src: ph[1], treat: 'halftone', d1: '#05080c', d2: '#8fe3ff', halftone: 11, kb: { from: { scale: 1.12 }, to: { scale: 1.0 }, t0: ctx.bar(1), t1: ctx.dur, ease: 'sine.out' } }), { inD: 0.5 });
    html += `<div class="fx-full" style="background:linear-gradient(180deg, rgba(0,0,0,.35), transparent 30%, transparent 62%, rgba(0,0,0,.6))"></div>`;
    const H = fx.headline(ctx, { id: 'l', text: D.copy.line, x: L, y: 1180, w: CW, maxLines: 2, font: 'Archivo', wght: 300, wdth: 100, sizes: [72, 64, 58, 52], tracking: 0.02, color: '#ffffff', t: ctx.beat(1), reveal: 'lines', d: 1.0, variable: true });
    html += H.html;
    fx.varType(ctx, H.sel, ctx.beat(2), { from: { wght: 300, wdth: 100, trk: 0.02 }, to: { wght: 700, wdth: 100, trk: 0.12 }, d: ctx.dur - ctx.beat(2) - 0.3, ease: 'sine.inOut' });
    fx.tIn(ctx, 'flash', { color: '#000000', d: 0.6 });
    fx.tOut(ctx, 'iris', { d: 0.45 });
    return { html };
  }
  // CUT: one photo per beat, alternating treatments; push on each cut; white flash on downbeats; kinetic caption band
  const n = ctx.beats.length, ph = D.photos;
  for (let i = 0; i < n; i++) {
    const t = ctx.beats[i], t1 = i + 1 < n ? ctx.beats[i + 1] : ctx.dur;
    const treat = i % 4 === 3 ? 'mono' : 'none';
    const inner = fx.photo(ctx, { id: `p${i}`, src: ph[i % ph.length], treat, kb: { from: { scale: 1.18, x: (i % 2 ? -1 : 1) * 30 }, to: { scale: 1.04, x: 0 }, t0: t, t1, ease: 'expo.out' } });
    html += fx.scene(ctx, `c${i}`, t, t1, inner, { outD: 0.001 });
  }
  html += `<div class="fx-full" style="background:linear-gradient(180deg, rgba(0,0,0,.45), transparent 26%, transparent 70%, rgba(0,0,0,.55))"></div>`;
  html += fx.marquee(ctx, { id: 'mq', text: D.copy.line, y: 1330, size: 64, font: 'Archivo', wght: 900, wdth: 112, color: '#000000', bg: '#ffffff', speed: 260, rot: -4 });
  ctx.downs.forEach((t, i) => fx.flash(ctx, t, { id: `f${i}`, color: '#ffffff', peak: 0.55, d: 0.25 }));
  fx.tOut(ctx, 'cut');
  return { html };
}
