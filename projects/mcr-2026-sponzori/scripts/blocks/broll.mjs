// B-ROLL · cinematic action interlude (no sponsor, TA plate only). One module, two plan entries (plan A, track_A):
//   'broll'      bar 34       (full groove, kick on the downbeat, fill on beat 4) → mode 'cut'
//   'brollbreak' bars 35–36   (musical break: kick and hats drop out)             → mode 'break'
// Real fishing photos (assets_prep/broll, 1080×1920; H-BATTLE + Klonówiec), film grade (teal shadows / warm highlights).
// One bold word per bar, Nike-style: NERVY. → ZÁBĚR. → PSTRUH.
//   cut  : a new shot on every beat, speed-ramp push-ins, whip smears between beats, the word sits BEHIND the angler on the
//          downbeat shot (subject cut-out), slam + echo burst; the fill beat is a 3-frame stutter with RGB-split hits;
//   break: hard cut into a freeze-frame of the strike — flash, cinema bars close, the background drops to grey while the angler
//          (rod and all) pops forward with a white sticker outline (2.5D parallax, speed ramp into slow motion) and the word
//          grows from hairline to black weight behind him; light-leak dissolve to the trout, macro push-in, a light sweep fills
//          the outlined word; zoom-through into the next block.
// Works for any bar count (cut: one word per bar, shots per beat; break: 2 bars). Subject cut-outs: assets_prep/broll/cut/
// <id>_cut.png + _stroke.png (scripts/assets_prep/broll_cut.py). No VO.
import * as fx from '../lib/fx.mjs';
import * as fb from '../lib/fx_broll.mjs';

export const theme = { bg: '#000000', bg2: '#0b1418', fg: '#ffffff', accent: '#ffb067', accent2: '#8fe3ff', font: { display: 'Archivo', text: 'Inter' }, wght: 900, upper: true };
export const meta = { reel: false };

const FILES = {
  br01: 'br01_fight_splash.jpg', br02: 'br02_netting_sunrays.jpg', br03: 'br03_fish_in_net.jpg', br04: 'br04_net_with_fish.jpg',
  br05: 'br05_reeling_portrait.jpg', br07: 'br07_landing_rod_up.jpg', br08: 'br08_landing_ripples.jpg', br09: 'br09_landing_rods_flare.jpg',
  br10: 'br10_lake_mist.jpg', br11: 'br11_lake_sunflare.jpg', br12: 'br12_keepnet_trout.jpg', br13: 'br13_lure_check.jpg',
  br14: 'br14_crouch_net.jpg', br15: 'br15_net_splash.jpg', br16: 'br16_dock_gear.jpg',
};
const WORDS = { cut: ['NERVY.', 'SOUBOJ.'], break: ['ZÁBĚR.', 'PSTRUH.'] };   // data copy.words overrides
const WORD_Y = 392;                       // word band top: below the TA plate (250–348), above the subjects' heads

export default function broll(ctx) {
  const D = ctx.data || {};
  const pool = D.photos || [];
  const photo = (k, i = 0) => { const rel = `assets_prep/broll/${FILES[k]}`; return ctx.has(rel) ? rel : pool[i % Math.max(1, pool.length)]; };
  const cutOf = (k) => { const rel = `assets_prep/broll/cut/${k}_cut.png`; return ctx.has(rel) ? rel : null; };
  const stkOf = (k) => { const rel = `assets_prep/broll/cut/${k}_stroke.png`; return ctx.has(rel) ? rel : null; };
  const words = D.copy?.words || WORDS[D.mode === 'break' ? 'break' : 'cut'];
  const env = { photo, cutOf, stkOf, words };
  const r = D.mode === 'break' ? breakMode(ctx, env) : cutMode(ctx, env);
  return { html: r.html, css: fb.css(ctx) + (r.css || '') };
}

// shared look: shade under the words (bg only), film grade over everything below the light effects
const shade = () => `<div class="br-grade" style="background:linear-gradient(180deg,rgba(0,0,0,.5) 0%,rgba(0,0,0,.32) 22%,rgba(0,0,0,.06) 44%,transparent 56%,rgba(0,0,0,.28) 100%)"></div>`;
const grade = () => `<div class="br-grade" style="background:#0b3a48;mix-blend-mode:soft-light;opacity:.7"></div>`
  + `<div class="br-grade" style="background:radial-gradient(80% 55% at 68% 22%,rgba(255,168,92,.55),transparent 70%);mix-blend-mode:soft-light"></div>`
  + `<div class="br-grade" style="background:radial-gradient(120% 78% at 50% 46%,transparent 52%,rgba(0,0,0,.58) 100%)"></div>`;

// ======================================================================================
// CUT — a shot per beat, one word per bar; the last beat of the last bar (the drum fill) = 3-frame stutter
// ======================================================================================
// per bar: [downbeat shot (* = subject cut-out, the word goes behind it), beat 2, beat 3, beat 4]
const CUT_BARS = [['br05*', 'br13', 'br14', 'br16'], ['br09', 'br04', 'br12', 'br08']];
const STUTTER = ['br01', 'br15', 'br02'];
const ORIGIN = { br05: '72% 0%', br13: '62% 40%', br14: '70% 44%', br16: '58% 52%', br09: '76% 46%', br04: '60% 62%', br12: '50% 50%', br08: '40% 60%', br01: '40% 55%', br15: '45% 55%', br02: '55% 40%' };

function cutMode(ctx, { photo, cutOf, words }) {
  const dur = ctx.dur, nb = Math.max(1, ctx.nBars), b = (i) => (i < ctx.beats.length ? ctx.beats[i] : dur);
  const nBeats = ctx.beats.filter((t) => t < dur - 0.05).length;
  const SH = [];
  for (let i = 0; i < nBeats; i++) {
    const bar = Math.min(nb - 1, Math.floor(i / 4)), j = i % 4, t0 = b(i), t1 = b(i + 1);
    if (i === nBeats - 1) {                                                // fill: stutter
      const sd = (t1 - t0) / STUTTER.length;
      STUTTER.forEach((k, m) => SH.push({ id: `u${m}`, k, t0: t0 + m * sd, t1: m === STUTTER.length - 1 ? t1 : t0 + (m + 1) * sd, inn: 'slam', slam: 1.24, stut: true }));
      break;
    }
    const key = CUT_BARS[bar % CUT_BARS.length][j], k = key.replace('*', '');
    const last = i + 1 === nBeats - 1;                                     // next beat is the stutter → no whip out
    SH.push({ id: `s${i}`, k, cut: key.endsWith('*'), t0, t1, inn: j === 0 ? (i === 0 ? 'none' : 'slam') : (j % 2 ? 'whipL' : 'whipR'), out: last ? 'none' : (j % 2 ? 'whipR' : 'whipL') });
  }
  let back = '', front = '';
  SH.forEach((s, i) => {
    const sh = fb.shot(ctx, { id: s.id, src: photo(s.k, i), cut: s.cut ? cutOf(s.k) : null, t0: s.t0, t1: s.t1, origin: ORIGIN[s.k] || '50% 50%', inn: s.inn, out: s.out || 'none', slam: s.slam, blur: !!(s.inn?.startsWith('whip') || s.out?.startsWith('whip')), kb: s.stut ? { from: 1.08, to: 1.12, ease: 'none' } : s.cut ? { from: 1.06, to: 1.16 } : {} });
    back += fx.scene(ctx, `${s.id}v`, s.t0, s.t1, sh.back, { inD: 0.001, outD: 0.001 });
    if (sh.front) front += fx.scene(ctx, `${s.id}f`, s.t0, s.t1, sh.front, { inD: 0.001, outD: 0.001 });
  });
  // words: one per bar, slammed on its downbeat, hard-swapped on the next
  let wordsHtml = '', fxHtml = '';
  const W = [];
  for (let k = 0; k < nb; k++) {
    const t0 = ctx.bar(k), t1 = ctx.bar(k + 1);
    const w = fb.word(ctx, { id: `w${k}`, text: words[k % words.length], y: WORD_Y, t: t0 + (k ? 0 : 0.03), inn: 'slam' });
    W.push(w);
    wordsHtml += fx.scene(ctx, `w${k}v`, t0, t1, w.html, { inD: 0.001, outD: 0.001 });
    if (k) { fx.flash(ctx, t0, { id: `fl${k}`, color: '#ffffff', peak: 0.75, d: 0.2 }); fb.shake(ctx, ctx.sel('rig'), t0, { amp: 26, seed: 4 + k }); }
  }
  fb.shake(ctx, ctx.sel('rig'), 0.03, { amp: 18, n: 4, seed: 9 });
  // beat accents: anamorphic streak on every whip cut, micro-punch of the word
  SH.forEach((s, i) => {
    if (s.inn?.startsWith('whip')) fxHtml += fb.streak(ctx, { id: `k${i}`, y: [1180, 980, 1260, 1120][i % 4], t: s.t0 - 0.04, d: 0.24 });
    if (s.inn?.startsWith('whip')) fx.punch(ctx, W[Math.min(nb - 1, Math.floor(i / 4))].m, s.t0, { scale: 1.035, d: 0.22 });
  });
  // stutter: RGB split on every frame + a warm flash frame into the break
  const U = SH.filter((s) => s.stut), Wl = W[nb - 1];
  U.forEach((s, m) => fx.chroma(ctx, Wl.m, s.t0, { amt: 12 - m * 3, d: (s.t1 - s.t0) * 0.9 }));
  if (U.length) fx.flash(ctx, U[U.length - 1].t0, { id: 'flu', color: '#fff2e2', peak: 0.4, d: U[U.length - 1].t1 - U[U.length - 1].t0 });
  const html = `${fb.blurDefs(ctx, SH.map((s) => s.id))}<div class="fx-full" id="${ctx.id('rig')}">${back}${shade()}${wordsHtml}${front}${grade()}</div>${fxHtml}`;
  // in: zoom-through out of the previous block's cover (our black); out: hard cut into the break (the music drops out)
  fx.tIn(ctx, 'zoom', { d: 0.42 });
  fx.tOut(ctx, 'cut');
  return { html };
}

// ======================================================================================
// BREAK — 2 bars: freeze-frame of the strike → light-leak dissolve → trout macro → zoom-through out
// ======================================================================================
function breakMode(ctx, { photo, cutOf, stkOf, words }) {
  const dur = ctx.dur, b1 = ctx.bar(1), X = 0.36;                          // X = dissolve overlap around the 2nd downbeat
  // A — the strike, frozen: grey background, angler + bent rod in colour with a white sticker outline, popping forward (2.5D)
  const A = fb.shot(ctx, { id: 'a', src: photo('br07', 0), cut: cutOf('br07'), stroke: stkOf('br07'), mono: true, t0: 0, t1: b1 + X, origin: '66% 0%', subOrigin: '74% 52%', blur: false, kb: { from: 1.0, to: 1.12, ease: 'expo.out' } });   // origin on the top edge: the push moves the head DOWN, off the word
  ctx.tl.fromTo(ctx.sel('a-sub'), { scale: 1 }, { scale: 1.06, duration: b1, ease: 'expo.out' }, 0.02);
  ctx.tl.fromTo(ctx.sel('a-stk'), { opacity: 0 }, { opacity: 1, duration: 0.1, ease: 'none' }, 0.04);
  ctx.tl.fromTo(ctx.sel('a-stk'), { opacity: 1 }, { opacity: 0, duration: 0.3, ease: 'power1.in' }, b1 - 0.3);
  ctx.tl.fromTo(ctx.sel('a-mono'), { opacity: 0 }, { opacity: 0.92, duration: 0.16, ease: 'power2.out' }, 0.02);
  ctx.tl.fromTo(ctx.sel('a-mono'), { opacity: 0.92 }, { opacity: 0.6, duration: b1 - 0.3, ease: 'sine.inOut' }, 0.2);
  // B — the trout: macro push-in, light sweep
  const B = fb.shot(ctx, { id: 'b', src: photo('br03', 1), t0: b1 - X, t1: dur, origin: '46% 40%', blur: false, kb: { from: 1.1, to: 1.26, ease: 'sine.inOut', flat: true } });
  const sweepT = b1 + 0.22, sweepD = 1.2;
  const SW = fb.sweepBand(ctx, { id: 'sw', t: sweepT, d: sweepD, opacity: 0.85 });
  // words: hairline → black weight behind the angler; the trout word is an outline that the light sweep fills
  const W1 = fb.word(ctx, { id: 'w1', text: words[0], y: WORD_Y + 24, t: 0.06, t1: b1, inn: 'breath', echo: false, from: { wght: 120, wdth: 62, trk: 0.07 } });
  const W2 = fb.word(ctx, { id: 'w2', text: words[1 % words.length], y: WORD_Y + 24, t: b1 + 0.05, t1: dur - 0.3, inn: 'breath', echo: false, outline: true, split: false, ofw: 5, from: { wght: 620, wdth: 62, trk: 0.06 } });
  fx.outlineFill(ctx, W2.m, sweepT + sweepD * 0.3, { d: sweepD * 0.45, ease: 'power1.inOut' });   // the light band passes → the letters fill
  ctx.tl.fromTo(W1.sel, { opacity: 1, filter: 'blur(0px)' }, { opacity: 0, filter: 'blur(14px)', duration: 0.32, ease: 'power2.in' }, b1 - 0.3);
  // scenes (B under A: A dissolves away on top of it)
  const sb = fx.scene(ctx, 'bv', b1 - X, dur, B.back + SW, { inD: 0.001 });
  const sa = fx.scene(ctx, 'av', 0, b1 + X, A.back, { outD: X * 2 });
  const sf = fx.scene(ctx, 'af', 0, b1 + X, A.front, { outD: X * 2 });
  const sw1 = fx.scene(ctx, 'w1v', 0, b1, W1.html, { outD: 0.001 });
  const sw2 = fx.scene(ctx, 'w2v', b1, dur, W2.html, { inD: 0.001 });
  // light: leak dissolve at the 2nd downbeat; cinema bars close on the break downbeat (the TA plate sits on the top bar)
  const L1 = fb.leak(ctx, { id: 'lk1', t: b1 - 0.5, d: 1.0, x: 820, y: 760, size: 1600, peak: 0.9 });
  const LB = fb.letterbox(ctx, { id: 'lb', h: 372, t: 0, d: 0.62 });
  fx.flash(ctx, 0, { id: 'fl0', color: '#ffffff', peak: 0.9, d: 0.55 });
  const html = `<div class="fx-full" id="${ctx.id('rig')}">${sb}${sa}${shade()}${sw1}${sw2}${sf}${grade()}</div>${L1}${LB}`;
  fx.tIn(ctx, 'cut');
  fx.tOut(ctx, 'zoom', { d: 0.45 });                                       // dive into the trout → next block's colour
  return { html };
}
