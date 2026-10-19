// B-ROLL · cinematic action interlude (no sponsor, TA plate only). One module, two plan entries:
//   'broll'      bars 33–34 (full groove, kick on the downbeats, fill on beat 8) → mode 'cut'
//   'brollbreak' bars 35–36 (musical break: kick and hats drop out)              → mode 'break'
// Real fishing photos (assets_prep/broll, 1080×1920; H-BATTLE + Klonówiec), film grade (teal shadows / warm highlights).
// One bold word per bar, Nike-style: NERVY. → ZÁBĚR. → SOUBOJ. → PSTRUH.
//   cut  : a new shot on every beat, speed-ramp push-ins, whip smears between beats, slam + echo burst + flash + shake on the
//          downbeats, the word sits BEHIND the angler on the downbeat shots (subject cut-outs), 3-frame stutter on the fill;
//   break: hard cut into a freeze — flash, cinema bars close, background drops to grey while the angler pops forward with a
//          white sticker outline (2.5D parallax, speed ramp into slow motion), the word grows from hairline to black weight
//          behind him; light-leak dissolve to the trout, macro push-in, light sweep fills the outlined word; burns out to the
//          next block's colour.
// Subject cut-outs: assets_prep/broll/cut/<id>_cut.png + _stroke.png (scripts/assets_prep/broll_cut.py). No VO.
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
const WORDS = { cut: ['NERVY.', 'ZÁBĚR.'], break: ['SOUBOJ.', 'PSTRUH.'] };
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
// CUT — bars 33–34: a shot per beat
// ======================================================================================
function cutMode(ctx, { photo, cutOf, words }) {
  const dur = ctx.dur, b = (i) => (i < ctx.beats.length ? ctx.beats[i] : dur);
  const st = b(7), sd = (dur - st) / 3;                                   // beat 8 = the fill → 3-frame stutter
  const SH = [
    { id: 's0', k: 'br05', cut: true, t0: b(0), t1: b(1), out: 'whipL', origin: '72% 38%' },
    { id: 's1', k: 'br13', t0: b(1), t1: b(2), inn: 'whipL', out: 'whipR', origin: '62% 40%' },
    { id: 's2', k: 'br16', t0: b(2), t1: b(3), inn: 'whipR', out: 'whipL', origin: '58% 52%' },
    { id: 's3', k: 'br14', t0: b(3), t1: b(4), inn: 'whipL', origin: '70% 44%' },
    { id: 's4', k: 'br07', cut: true, t0: b(4), t1: b(5), inn: 'slam', out: 'whipL', origin: '70% 36%' },
    { id: 's5', k: 'br09', t0: b(5), t1: b(6), inn: 'whipL', out: 'whipR', origin: '76% 46%' },
    { id: 's6', k: 'br04', t0: b(6), t1: b(7), inn: 'whipR', origin: '60% 62%' },
    { id: 's7', k: 'br15', t0: st, t1: st + sd, inn: 'slam', slam: 1.22, origin: '45% 55%' },
    { id: 's8', k: 'br08', t0: st + sd, t1: st + 2 * sd, inn: 'slam', slam: 1.22, origin: '40% 60%' },
    { id: 's9', k: 'br02', t0: st + 2 * sd, t1: dur, inn: 'slam', slam: 1.22, origin: '55% 40%' },
  ];
  let back = '', front = '';
  SH.forEach((s, i) => {
    const sh = fb.shot(ctx, { id: s.id, src: photo(s.k, i), cut: s.cut ? cutOf(s.k) : null, t0: s.t0, t1: s.t1, origin: s.origin, inn: s.inn || 'none', out: s.out || 'none', slam: s.slam, blur: !!(s.inn?.startsWith('whip') || s.out), kb: i >= 7 ? { from: 1.08, to: 1.12, ease: 'none' } : {} });
    back += fx.scene(ctx, `${s.id}v`, s.t0, s.t1, sh.back, { inD: 0.001, outD: 0.001 });
    if (sh.front) front += fx.scene(ctx, `${s.id}f`, s.t0, s.t1, sh.front, { inD: 0.001, outD: 0.001 });
  });
  // words: one per bar, slammed on the downbeat; hard-cut swap on bar 34
  const W1 = fb.word(ctx, { id: 'w1', text: words[0], y: WORD_Y, t: 0.02, inn: 'slam' });
  const W2 = fb.word(ctx, { id: 'w2', text: words[1], y: WORD_Y, t: b(4), inn: 'slam' });
  const wordsHtml = fx.scene(ctx, 'w1v', 0, b(4), W1.html, { outD: 0.001 }) + fx.scene(ctx, 'w2v', b(4), dur, W2.html, { inD: 0.001 });
  // beat accents: whip streaks, word micro-punch, downbeat flash + shake, stutter chroma
  let fxHtml = '';
  [1, 2, 3, 5, 6].forEach((i) => {
    fxHtml += fb.streak(ctx, { id: `k${i}`, y: [0, 1180, 980, 1260, 0, 1120, 1040][i], t: b(i) - 0.04, d: 0.24 });
    fx.punch(ctx, i < 4 ? W1.m : W2.m, b(i), { scale: 1.035, d: 0.22 });
  });
  fx.flash(ctx, b(4), { id: 'fl4', color: '#ffffff', peak: 0.75, d: 0.2 });
  fb.shake(ctx, ctx.sel('rig'), b(4), { amp: 26, seed: 4 });
  fb.shake(ctx, ctx.sel('rig'), 0.02, { amp: 16, n: 4, seed: 9 });
  [0, 1, 2].forEach((k) => fx.chroma(ctx, W2.m, st + k * sd, { amt: 10 - k * 2, d: sd * 0.9 }));
  fx.flash(ctx, st + 2 * sd, { id: 'fl9', color: '#fff4e6', peak: 0.35, d: sd });
  const html = `${fb.blurDefs(ctx, SH.map((s) => s.id))}<div class="fx-full" id="${ctx.id('rig')}">${back}${shade()}${wordsHtml}${front}${grade()}</div>${fxHtml}`;
  // in: zoom-through from the previous block (it zooms in and fades to our black); out: hard cut into the break
  fx.tIn(ctx, 'zoom', { d: 0.42 });
  fx.tOut(ctx, 'cut');
  return { html };
}

// ======================================================================================
// BREAK — bars 35–36: freeze-frame pop → light-leak dissolve → trout macro → burn out
// ======================================================================================
function breakMode(ctx, { photo, cutOf, stkOf, words }) {
  const dur = ctx.dur, b1 = ctx.bar(1), X = 0.36;                          // X = dissolve overlap around bar 36
  // A — the fight, frozen: grey background, angler in colour with a white sticker outline, popping forward (2.5D)
  const A = fb.shot(ctx, { id: 'a', src: photo('br01', 0), cut: cutOf('br01'), stroke: stkOf('br01'), mono: true, t0: 0, t1: b1 + X, origin: '32% 42%', subOrigin: '30% 46%', blur: false, kb: { from: 1.0, to: 1.13, ease: 'expo.out' } });
  ctx.tl.fromTo(ctx.sel('a-sub'), { scale: 1 }, { scale: 1.065, duration: b1, ease: 'expo.out' }, 0.02);
  ctx.tl.fromTo(ctx.sel('a-stk'), { opacity: 0 }, { opacity: 1, duration: 0.1, ease: 'none' }, 0.04);
  ctx.tl.fromTo(ctx.sel('a-stk'), { opacity: 1 }, { opacity: 0, duration: 0.3, ease: 'power1.in' }, b1 - 0.3);
  ctx.tl.fromTo(ctx.sel('a-mono'), { opacity: 0 }, { opacity: 0.92, duration: 0.16, ease: 'power2.out' }, 0.02);
  ctx.tl.fromTo(ctx.sel('a-mono'), { opacity: 0.92 }, { opacity: 0.6, duration: b1 - 0.3, ease: 'sine.inOut' }, 0.2);
  // B — the trout: macro push-in, light sweep
  const B = fb.shot(ctx, { id: 'b', src: photo('br03', 1), t0: b1 - X, t1: dur, origin: '46% 40%', blur: false, kb: { from: 1.1, to: 1.24, ease: 'sine.inOut', flat: true } });
  const sweepT = b1 + 0.42, sweepD = 1.15;
  const SW = fb.sweepBand(ctx, { id: 'sw', t: sweepT, d: sweepD, opacity: 0.85 });
  // words: hairline → black weight behind the angler; the trout word fills with the light sweep
  const W1 = fb.word(ctx, { id: 'w1', text: words[0], y: WORD_Y + 30, t: 0.06, t1: b1, inn: 'breath', echo: false, wght: 900, wdth: 62, tracking: -0.01, from: { wght: 120, wdth: 62, trk: 0.07 } });
  const W2 = fb.word(ctx, { id: 'w2', text: words[1], y: WORD_Y + 30, t: b1 + 0.05, t1: dur - 0.3, inn: 'breath', echo: false, outline: true, wght: 900, wdth: 62, tracking: -0.01, from: { wght: 500, wdth: 62, trk: 0.03 } });
  fx.outlineFill(ctx, W2.m, sweepT + sweepD * 0.25, { d: sweepD * 0.6, ease: 'power1.inOut' });
  ctx.tl.fromTo(W1.sel, { opacity: 1, filter: 'blur(0px)' }, { opacity: 0, filter: 'blur(14px)', duration: 0.32, ease: 'power2.in' }, b1 - 0.3);
  // scenes
  const sa = fx.scene(ctx, 'av', 0, b1 + X, A.back, { outD: X * 2 });
  const sf = fx.scene(ctx, 'af', 0, b1 + X, A.front, { outD: X * 2 });
  const sb = fx.scene(ctx, 'bv', b1 - X, dur, B.back + SW, { inD: 0.001 });       // under A: A dissolves away on top of it
  const sw1 = fx.scene(ctx, 'w1v', 0, b1, W1.html, { outD: 0.001 });
  const sw2 = fx.scene(ctx, 'w2v', b1, dur, W2.html, { inD: 0.001 });
  // light: leak dissolve at bar 36, end burn; cinema bars close on the break downbeat (TA plate sits on the top bar)
  const L1 = fb.leak(ctx, { id: 'lk1', t: b1 - 0.5, d: 1.0, x: 820, y: 760, size: 1600, peak: 0.9 });
  const L2 = fb.leak(ctx, { id: 'lk2', t: dur - 0.75, d: 0.75, x: 640, y: 900, size: 2000, peak: 1, hold: true });
  const LB = fb.letterbox(ctx, { id: 'lb', h: 372, t: 0, d: 0.62 });
  fx.flash(ctx, 0, { id: 'fl0', color: '#ffffff', peak: 0.9, d: 0.55 });
  const html = `<div class="fx-full" id="${ctx.id('rig')}">${sb}${sa}${shade()}${sw1}${sw2}${sf}${grade()}</div>${L1}${L2}${LB}`;
  fx.tIn(ctx, 'cut');
  fx.tOut(ctx, 'flash', { d: 0.4 });
  return { html };
}
