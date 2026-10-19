// INTRO · bars 0–7 · build-up (no kick) → the drop lands on venue (bar 8).
// High-fashion sports-ad title sequence for the event (neutral event world, not a sponsor world):
// ink black / bone white / ice + an iridescent "rainbow trout" chrome, Archivo variable, hard cuts on the grid.
//   bar 0      TA hero: the plate flies to centre stage (light streak, halo, rising specks)
//   bar 0.75–2 MISTROVSTVÍ (variable morph) · ČR (iridescent) · v Trout Area — the plate flies back to its corner, camera tilts up
//   bar 2      2026 giant numerals, a spoon threads between "20" and "26" → 16th-note product strobe (bass enters on bar 3)
//   bar 3–4    24.–25. 10. on bone white (motion-blur slides, editorial)
//   bar 4½–5   LÍHEŇ LIBĚCHOV — letters are windows into the aerial of the venue
//   bar 5¼–6   40 závodníků — rolling odometer on ice, product on the floor
//   bar 6      HARD BAITS — four hard baits slam in on the beats, depth parallax, light sweeps
//   bar 7      PARTNEŘI MISTROVSTVÍ — 8 partners strobe on 8ths in their own brand colours, countdown 4-3-2-1, zoom-through into the drop
import fs from 'node:fs';
import path from 'node:path';
import * as fx from '../lib/fx.mjs';
import * as X from '../lib/fx_intro.mjs';
import { ROOT } from '../lib/util.mjs';

const INK = '#050608', BONE = '#f3f1ec', ICE = '#8fe3ff';
export const theme = { bg: INK, bg2: '#0d141b', fg: '#ffffff', accent: ICE, accent2: BONE, font: { display: 'Archivo', text: 'Inter' }, wght: 900, upper: true };
export const meta = { reel: false };

// partner teaser (film order). Colours follow each partner's own block theme when that module loads; fallback = brand colours.
const TEASE = [
  { key: 'venue', photo: 'assets_prep/libechov/venue/v03_trout_in_net.jpg', bg: '#1a212e', accent: '#17a1c8' },
  { key: 'troutshop', src: 'assets_prep/troutshop/heroes/h02_velvetarts_forte_yellow_red.png', bg: '#070707', accent: '#e3000f' },
  { key: 'activefishing', src: 'assets_prep/activefishing/heroes/h02_khor_frea.png', bg: '#f1f1ef', accent: '#e2812d' },
  { key: 'moonky', src: 'assets_prep/moonky/heroes/h04_scelet_pink_bubblegum.png', bg: '#0e1424', accent: '#b8ff2e' },
  { key: 'jigovky', src: 'assets_prep/jigovky/heroes/h02_sickle_classic.png', bg: '#060807', accent: '#fed700' },
  { key: 'velkaryba', src: 'assets_prep/velkaryba/heroes/h04_daiwa_presso_flashing_green.png', bg: '#0f2541', accent: '#da0f00' },
  { key: 'bosset', src: 'assets_prep/bosset/heroes/h01_zojirushi_orange.png', bg: '#c5ebfc', accent: '#1b97b1' },
  { key: 'gausseholler', src: 'assets_prep/gausseholler/heroes/h01_revolut8_black_front.png', bg: '#0f1113', accent: '#f0904f' },
];
const BURST = [   // 16th-note strobe at the end of bar 2 (partners not featured elsewhere before the finale strobe)
  { key: 'moonky', src: 'assets_prep/moonky/heroes/h01_coccon_yellow_orange.png', bg: '#0e1424', accent: '#b8ff2e' },
  { key: 'jigovky', src: 'assets_prep/jigovky/heroes/h01_troutjig_barbless.png', bg: '#060807', accent: '#fed700' },
  { key: 'gausseholler', src: 'assets_prep/gausseholler/heroes/h03_revolut8_black_threeq.png', bg: '#0f1113', accent: '#f0904f' },
];
const THEMES = {};
for (const k of new Set([...TEASE, ...BURST].map((p) => p.key))) {
  try { THEMES[k] = (await import(new URL(`./${k}.mjs`, import.meta.url).href)).theme || null; } catch { THEMES[k] = null; }
}
const look = (p) => ({ bg: THEMES[p.key]?.bg || p.bg, accent: THEMES[p.key]?.accent || p.accent });

// newest aerial of the venue (drone final → newest draft → still photo)
function aerial() {
  const dir = path.join(ROOT, 'assets_prep/libechov/venue');
  let files = [];
  try { files = fs.readdirSync(dir).filter((f) => /^_drone_.*_last\.jpg$/.test(f)); } catch { /* none */ }
  const fin = files.find((f) => f.includes('final'));
  const pick = fin || files.sort((a, b) => (+(b.match(/v(\d+)/)?.[1] || 0)) - (+(a.match(/v(\d+)/)?.[1] || 0)))[0];
  return pick ? `assets_prep/libechov/venue/${pick}` : 'assets_prep/libechov/venue/v01_maly_sportacek.jpg';
}

export default function intro(ctx) {
  const { bar, W } = ctx;
  const q = (b, k, f = 0) => { const a = ctx.at(b, k), n = ctx.at(b, k + 1); return a + (n - a) * f; };
  const L = ctx.safe.left, CW = W - ctx.safe.left - ctx.safe.right;          // 952
  const CWr = W - ctx.safe.left - ctx.safe.uiRight;                          // 876 (below y 900: right UI column)
  const A = { font: 'Archivo', upper: true };
  let html = '', css = X.css(ctx);
  // hard-cut scenes; the incoming one starts 3 ms early so no frame can fall into a gap between two cuts
  const scene = (id, t0, t1, inner, o = {}) => fx.scene(ctx, id, t0 > 0.01 ? t0 - 0.003 : t0, t1, inner, { inD: 0.001, outD: 0.001, ...o });
  const PRE = 0.08;                                                          // reveals start this much before their cut → already moving on the cut frame
  // VO sync: the beat nearest the spoken word, clamped into its slot (fallback = grid; the VO may be regenerated)
  const vs = (word, dflt, lo, hi) => Math.min(hi, Math.max(lo, ctx.snap(ctx.vo.at(word) ?? dflt, 'beat')));

  // ---- key times (real grid) ----
  const tLand = ctx.at(0, 2), tTitle = vs('Mistrovství', ctx.at(0, 3), ctx.at(0, 3), ctx.at(1, 0)), tCR = bar(1), tTA = vs('v Trout', ctx.at(1, 2), ctx.at(1, 1), ctx.at(1, 3));
  const t2026 = bar(2), t26 = ctx.at(2, 1), tSpoon = ctx.at(2, 2), tBurst = q(2, 3, 0.25);
  const tDate = bar(3), t25 = vs('25', ctx.at(3, 2), ctx.at(3, 1), ctx.at(3, 2)), t10 = ctx.at(3, 3), tPlace = vs('Líheň', ctx.at(4, 2), ctx.at(4, 1), ctx.at(4, 3));
  const t40 = vs('Čtyřicet', ctx.at(5, 1), bar(5), ctx.at(5, 2));
  const tHB = bar(6), tP = bar(7), END = ctx.dur;

  // =============== bar 0 · TA HERO ===============
  const HERO = { scale: 2.6, cx: W / 2, cy: 700, fly: 0.75 };
  const tLeave = tCR;                                                    // plate starts flying back to its corner on bar 1
  const hero = ctx.plate.hero(tLand - HERO.fly, tLeave + HERO.fly, HERO);
  let s0 = fx.field(ctx, { id: 'f0', kind: 'radial', c1: '#121b24', c2: INK, at: '50% 36%' });
  s0 += fx.rays(ctx, { id: 'r0', x: W / 2, y: HERO.cy, size: 2100, color: 'rgba(200,240,255,1)', n: 30, duty: 0.12, opacity: 0.07, spin: 16, t0: 0, t1: tLeave + HERO.fly });
  ctx.tl.fromTo(ctx.sel('r0'), { opacity: 0.015 }, { opacity: 0.07, duration: tLand, ease: 'power2.in' }, 0);
  s0 += `<div class="fx-full" id="${ctx.id('haloW')}" style="opacity:.72">${fx.glow(ctx, { id: 'halo', x: W / 2, y: HERO.cy, size: 1300, color: 'rgba(143,227,255,.6)', opacity: 1 })}</div>`;
  ctx.tl.fromTo(ctx.sel('halo'), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.9, ease: 'expo.out' }, tLand - 0.35);
  s0 += X.streak(ctx, { id: 'stk', y: HERO.cy, w: 1800, h: 4, color: ICE, t: tLand - 0.5, d: 1.0 });
  s0 += X.specks(ctx, { id: 'sp', n: 36, t0: 0, t1: bar(2), box: [0, 260, W, 1500], seed: 3 });
  // hats on the off-beats (bars 0–1): the halo breathes with them
  for (let b = 0; b < 2; b++) for (let k = 0; k < 4; k++) {
    const t = q(b, k, 0.5); if (t < tLand - 0.2) continue;
    ctx.tl.hit(ctx.sel('haloW'), { opacity: 1 }, { opacity: 0.72, duration: 0.24, ease: 'power2.out' }, t);
  }
  html += scene('sc0', 0, tLeave + HERO.fly, s0, { outD: 0.6 });
  fx.flash(ctx, tLand, { id: 'flLand', color: '#dff6ff', peak: 0.22, d: 0.45, blend: 'screen' });

  // =============== bars 0¾–2 · MISTROVSTVÍ ČR · v Trout Area ===============
  const fT = ctx.fit('Mistrovství', { ...A, wght: 900, wdth: 75, tracking: -0.01, maxW: CW, maxLines: 1, sizes: [210, 200, 190, 180, 170, 160, 150, 140] });
  const fC = ctx.fit('ČR', { ...A, wght: 900, wdth: 100, maxW: 860, maxLines: 1, sizes: [440, 420, 400, 380, 360] });
  const h1H = fT.size * 0.92, crH = fC.size * 0.9, h3S = 84, gap1 = 6, gap2 = 22;
  const total = h1H + gap1 + crH + gap2 + h3S;
  const Y1 = Math.round(930 - total / 2);
  const dy0 = Math.round(hero.y + hero.h + 34 - Y1);                     // title starts just under the hero plate
  const t1 = fx.headline(ctx, { id: 't1', text: 'Mistrovství', x: -240, y: Y1, w: 1560, size: fT.size, maxLines: 1, ...A, wght: 900, wdth: 75, tracking: -0.01, lh: 0.92, align: 'center', t: tTitle, reveal: 'lines', d: 0.7, variable: true });
  fx.varType(ctx, t1.sel, tTitle, { from: { wght: 140, wdth: 125, trk: 0.05 }, to: { wght: 900, wdth: 75, trk: -0.01 }, d: 1.05, ease: 'expo.out' });
  const cr = fx.headline(ctx, { id: 'cr', text: 'ČR', x: -100, y: Y1 + h1H + gap1, w: 1280, size: fC.size, maxLines: 1, ...A, wght: 900, wdth: 100, lh: 0.9, align: 'center', cls: 'ix-iri', t: tCR, reveal: 'lines', d: 0.75 });
  X.sheen(ctx, cr.sel, tCR, { d: 1.8, from: '0% 0%', to: '100% 0%' });
  fx.chroma(ctx, cr.sel, tCR + 0.02, { amt: 10, d: 0.45 });
  const t3 = fx.headline(ctx, { id: 't3', text: 'v Trout Area', x: L, y: Y1 + h1H + gap1 + crH + gap2, w: CW, size: h3S, maxLines: 1, font: 'Archivo', wght: 500, wdth: 100, tracking: 0.01, color: ICE, align: 'center', t: tTA, reveal: 'chars', stagger: 0.03, d: 0.5 });
  const s1 = `<div class="fx-full" id="${ctx.id('tg')}">${t1.html}${cr.html}${t3.html}</div>`;
  ctx.tl.fromTo(ctx.sel('tg'), { y: dy0 }, { y: 0, duration: HERO.fly, ease: 'expo.inOut' }, tLeave);
  fx.pushIn(ctx, ctx.sel('tgz'), tLeave, t2026, { from: 1, to: 1.05, origin: '50% 50%', ease: 'none' });
  html += scene('sc1', tTitle, t2026, `<div class="fx-full" id="${ctx.id('tgz')}">${s1}</div>`);
  fx.flash(ctx, tCR, { id: 'flCR', color: '#ffffff', peak: 0.18, d: 0.3, blend: 'screen' });

  // =============== bar 2 · 2026 (spoon threads between 20 and 26) → 16th strobe ===============
  const f20 = ctx.fit('20', { font: 'Archivo', wght: 900, wdth: 100, maxW: 820, maxLines: 1, sizes: [620, 600, 580, 560] });
  const S20 = f20.size, LHN = 0.8, SEAM = 975, Y20 = SEAM - S20 * LHN;  // seam between the rows; '26' ends above the bottom UI zone
  let s2 = fx.glow(ctx, { id: 'g2', x: W / 2, y: 1000, size: 1400, color: 'rgba(255,140,180,.30)', opacity: 1 });
  const n20 = fx.headline(ctx, { id: 'n20', text: '20', x: -100, y: Y20, w: 1280, size: S20, maxLines: 1, font: 'Archivo', wght: 900, wdth: 100, tracking: -0.03, lh: LHN, align: 'center', cls: 'ix-iri', t: t2026 - PRE, reveal: 'lines', d: 0.6 });
  X.sheen(ctx, n20.sel, t2026 + 0.1, { d: 1.5, from: '100% 0%', to: '0% 0%' });
  const n26 = fx.headline(ctx, { id: 'n26', text: '26', x: -100, y: Y20 + S20 * LHN, w: 1280, size: S20, maxLines: 1, font: 'Archivo', wght: 900, wdth: 100, tracking: -0.03, lh: LHN, align: 'center', cls: 'ix-ol', style: '--ow:5px;--oc:#ffffff', t: t26, reveal: 'lines', d: 0.6 });
  const spoonSrc = 'assets_prep/velkaryba/heroes/h01_illex_native_pink_yamame.png';
  const SP = fx.product(ctx, { id: 'spn', src: spoonSrc, w: 660, cx: W / 2 + 10, cy: SEAM, ground: 'none', rot: -32, pad: [0.033, 0.03, 0.034, 0.03] });
  fx.productIn(ctx, 'spn', tSpoon, { from: 'right', d: 0.42, dist: 260 });
  fx.float(ctx, SP.cam, tSpoon + 0.4, tBurst, { y: -14, rot: 3, period: ctx.BEAT });
  fx.sweep(ctx, 'spn', tSpoon + 0.25, { d: 0.6 });
  fx.pushIn(ctx, SP.cam, tSpoon, tBurst, { from: 1, to: 1.12, ease: 'power1.in' });
  fx.productOut(ctx, 'spn', tBurst - 0.13, { to: 'left', d: 0.13 });
  s2 += n20.html + SP.html + n26.html;
  html += scene('sc2', t2026, tBurst, s2);
  fx.flash(ctx, t2026, { id: 'fl2026', color: '#ffffff', peak: 0.25, d: 0.3, blend: 'screen' });
  const bCards = BURST.map((p, i) => ({ ...p, t0: q(2, 3, 0.25 * (i + 1)), t1: i < BURST.length - 1 ? q(2, 3, 0.25 * (i + 2)) : tDate }));
  html += X.strobeBg(ctx, { id: 'bb', cards: bCards.map((c) => ({ t0: c.t0, t1: c.t1, bg: look(c).bg, glow: look(c).accent })), glowOp: 0.55, cy: 980 });
  bCards.forEach((p, i) => {
    const a = p.t0, b = p.t1;
    html += X.teaseProd(ctx, { id: `bp${i}`, t0: a, t1: b, src: p.src, box: [760, 700], cy: 980, rot: [-12, 8, 0][i], zoom: 1.2, ground: 'none' });
  });

  // =============== bars 3–4½ · 24.–25. 10. on bone (the bass enters) ===============
  const DO = { font: 'Archivo', wght: 900, wdth: 72, tracking: -0.03 };
  const fD = ctx.fit('24.–25.', { ...DO, maxW: CW, maxLines: 1, sizes: [360, 340, 320, 300, 280, 260, 240] });
  const SD = fD.size, YD = Math.round(930 - (SD * 0.9 * 2 + 58) / 2);
  const w24 = ctx.measure('24.–', { ...DO, size: SD }), w10 = ctx.measure('10.', { ...DO, size: SD });
  let s3 = fx.field(ctx, { id: 'f3', kind: 'linear', c1: '#fbfaf7', c2: '#e2ded6', angle: 180 });
  const d24 = fx.headline(ctx, { id: 'd24', text: '24.–', x: L, y: YD, w: w24 + 40, size: SD, maxLines: 1, ...DO, lh: 0.9, color: INK });
  const d25 = fx.headline(ctx, { id: 'd25', text: '25.', x: L + w24, y: YD, w: CW - w24 + 40, size: SD, maxLines: 1, ...DO, lh: 0.9, color: INK });
  X.blurIn(ctx, d24.sel, tDate - PRE, { x: -320, d: 0.6, blur: 26 });
  X.blurIn(ctx, d25.sel, t25, { x: 320, d: 0.6, blur: 26 });
  const yRule = YD + SD * 0.9 + 18;
  s3 += `<div class="fx-abs" id="${ctx.id('rule')}" style="left:${L}px;top:${yRule}px;width:${CW}px;height:5px;background:${INK}"></div>`;
  ctx.tl.set(ctx.sel('rule'), { transformOrigin: '0% 50%' }, 0);
  ctx.tl.fromTo(ctx.sel('rule'), { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'expo.inOut' }, t25 + 0.12);
  const Y10 = yRule + 40;
  const d10 = fx.headline(ctx, { id: 'd10', text: '10.', x: L, y: Y10, w: w10 + 40, size: SD, maxLines: 1, ...DO, lh: 0.9, color: INK, t: t10, reveal: 'lines', d: 0.55 });
  const xc = L + w10 + 34, wc = W - ctx.safe.uiRight - xc;
  const dY = fx.headline(ctx, { id: 'dY', text: '2026', x: xc, y: Y10 + SD * 0.06, w: wc, maxLines: 1, font: 'Archivo', wght: 300, wdth: 100, tracking: -0.02, sizes: [170, 160, 150, 140, 130, 120], color: INK, t: bar(4), reveal: 'lines', d: 0.5 });
  const dS = fx.headline(ctx, { id: 'dS', text: 'sobota + neděle', x: xc + 4, y: Y10 + SD * 0.06 + dY.h + 14, w: wc, maxLines: 1, font: 'Inter', wght: 700, upper: true, tracking: 0.16, sizes: [30, 28, 26, 24], color: INK, t: bar(4) + 0.14, reveal: 'fade', d: 0.45 });
  s3 += `<div class="fx-full" id="${ctx.id('dg')}">${d24.html}${d25.html}${d10.html}${dY.html}${dS.html}</div>`;
  fx.pushIn(ctx, ctx.sel('dg'), tDate, tPlace, { from: 1, to: 1.045, origin: '50% 45%', ease: 'none' });
  html += scene('sc3', tDate, tPlace, s3);

  // =============== bars 4½–5¼ · LÍHEŇ LIBĚCHOV (letters = windows into the venue aerial) ===============
  const AER = aerial();
  let s4 = fx.photo(ctx, { id: 'p4', src: AER, kb: { from: { scale: 1.16 }, to: { scale: 1.04 }, t0: tPlace, t1: t40 }, style: 'filter:brightness(.26) saturate(1.05)' });
  s4 += `<div class="fx-full" style="background:linear-gradient(180deg,rgba(5,6,8,.55),rgba(5,6,8,0) 30%,rgba(5,6,8,0) 70%,rgba(5,6,8,.6))"></div>`;
  const fPl = ctx.fit('Líheň Liběchov', { ...A, wght: 900, wdth: 75, tracking: -0.01, maxW: CW, maxLines: 2, sizes: [300, 280, 260, 240, 220, 200, 180, 160] });
  const YP = Math.round(900 - (fPl.lines.length * fPl.size * 0.9) / 2);
  const pl = X.photoType(ctx, { id: 'pl', src: AER, text: 'Líheň Liběchov', x: L, y: YP, w: CW, size: fPl.size, maxLines: 2, ...A, wght: 900, wdth: 75, tracking: -0.01, lh: 0.9, t: tPlace - PRE, reveal: 'lines', d: 0.55, stagger: 0.08, kb: { dx: 0, dy: -60, t0: tPlace, t1: t40 }, filter: 'brightness(2.3) saturate(1.25) contrast(1.15)', style: '-webkit-text-stroke:2px rgba(255,255,255,.9)' });
  css += pl.css;
  const pond = fx.headline(ctx, { id: 'pond', text: 'rybník Malý Sporťáček', x: L + 4, y: YP + pl.h + 30, w: CWr, maxLines: 1, font: 'Inter', wght: 700, upper: true, tracking: 0.22, sizes: [34, 32, 30, 28], color: ICE, t: tPlace + ctx.BEAT * 0.75, reveal: 'fade', d: 0.45 });
  s4 += pl.html + pond.html;
  html += scene('sc4', tPlace, t40, s4);

  // =============== bars 5¼–6 · 40 závodníků on ice ===============
  const S40 = [760, 740, 720, 700, 680, 660].find((s) => ctx.measure('40', { font: 'Archivo', wght: 900, size: s }) <= 900) || 640;
  const Y40 = 360;
  let s5 = fx.field(ctx, { id: 'f5', kind: 'radial', c1: '#d4f6ff', c2: '#5ccff3', at: '50% 35%' });
  s5 += fx.odometer(ctx, { id: 'n40', value: '40', x: L, y: Y40, w: CW, align: 'center', size: S40, font: 'Archivo', wght: 900, color: INK, t: t40 - 0.05, d: 1.0, spins: 1, style: 'letter-spacing:-.04em' });
  const zv = fx.headline(ctx, { id: 'zv', text: 'závodníků', x: (W - 820) / 2, y: Y40 + S40 * 0.84 + 44, w: 820, maxLines: 1, ...A, wght: 900, wdth: 75, tracking: -0.01, sizes: [200, 190, 180, 170, 160, 150], color: INK, align: 'center', t: t40 + ctx.BEAT, reveal: 'lines', d: 0.5 });
  const af = { src: 'assets_prep/activefishing/heroes/h01_nories_sofia.png', pad: [0.029, 0.04, 0.028, 0.04] };
  const P5 = fx.product(ctx, { id: 'af', src: af.src, w: 470, cx: 600, floor: 1440, ground: 'floor', reflect: 0.28, shadow: 0.45, pad: af.pad, rot: -6 });
  fx.productIn(ctx, 'af', t40 + ctx.BEAT * 1.5, { from: 'rise', d: 0.6, dist: 200 });
  fx.sweep(ctx, 'af', t40 + ctx.BEAT * 2.2, { d: 0.6 });
  s5 += zv.html + P5.html;
  html += scene('sc5', t40, tHB, s5);

  // =============== bar 6 · HARD BAITS (four hard baits slam in on the beats, depth parallax) ===============
  let s6 = fx.field(ctx, { id: 'f6', kind: 'radial', c1: '#0e2a33', c2: INK, at: '50% 48%' });
  // two stacked words, each fitted to its own width: HARD (above y 900 → full width) · BAITS (below → clear of the right UI column)
  const HBO = { ...A, wght: 900, wdth: 75, tracking: -0.01, maxLines: 1 };
  const sHa = ctx.fit('Hard', { ...HBO, maxW: CW, sizes: [420, 400, 380, 360, 340, 320] }).size;
  const sBa = ctx.fit('baits', { ...HBO, maxW: 820, sizes: [400, 380, 360, 340, 320, 300, 280] }).size;
  const YH = Math.round(905 - sHa * 0.88);
  const HB = [   // [src, pad, w, cx, cy, rot, layer]
    ['assets_prep/velkaryba/heroes/h05_shimano_cardiff_roll_swimmer_orange.png', [0.031, 0.039, 0.03, 0.039], 400, 830, 500, 16, 'far'],
    ['assets_prep/troutshop/heroes/h01_velvetarts_forte_glow_pink.png', [0.055, 0.029, 0.055, 0.029], 260, 215, 650, -14, 'far'],
    ['assets_prep/activefishing/heroes/h04_luckycraft_wah33f.png', [0.031, 0.063, 0.028, 0.066], 640, 350, 1345, -8, 'near'],
    ['assets_prep/troutshop/heroes/h04_nories_crankin_pupa.png', [0.031, 0.054, 0.032, 0.058], 460, 790, 1305, 12, 'near'],
  ];
  let far = '', near = '';
  HB.forEach(([src, pad, w, cx, cy, rot, layer], i) => {
    const t = ctx.at(6, i) - (i ? 0.03 : PRE);
    const P = fx.product(ctx, { id: `hb${i}`, src, w, cx, cy, ground: 'none', pad, rot });
    X.slam(ctx, P.sel, t, { from: layer === 'near' ? 1.7 : 1.4, d: 0.42, blur: 16 });
    fx.sweep(ctx, `hb${i}`, t + 0.18, { d: 0.55 });
    const k = layer === 'near' ? 1 : 0.45;
    ctx.tl.fromTo(P.cam, { x: 0, y: 0 }, { x: (cx < W / 2 ? -1 : 1) * 40 * k, y: -50 * k, duration: Math.max(0.2, tP - t), ease: 'sine.out' }, t);
    if (layer === 'near') near += P.html; else far += P.html;
  });
  const hbA = fx.headline(ctx, { id: 'hbA', text: 'Hard', x: -240, y: YH, w: 1560, size: sHa, ...HBO, lh: 0.88, align: 'center', t: tHB - PRE, reveal: 'lines', d: 0.5, variable: true });
  const tBa = vs('baits', ctx.at(6, 1), ctx.at(6, 1), ctx.at(6, 2)) - 0.04;
  const hbB = fx.headline(ctx, { id: 'hbB', text: 'baits', x: -240, y: YH + sHa * 0.88, w: 1560, size: sBa, ...HBO, lh: 0.88, align: 'center', t: tBa, reveal: 'lines', d: 0.5, variable: true });
  fx.varType(ctx, hbA.sel, tHB - PRE, { from: { wght: 300, wdth: 110, trk: 0.04 }, to: { wght: 900, wdth: 75, trk: -0.01 }, d: 0.9, ease: 'expo.out' });
  fx.varType(ctx, hbB.sel, tBa, { from: { wght: 300, wdth: 110, trk: 0.04 }, to: { wght: 900, wdth: 75, trk: -0.01 }, d: 0.9, ease: 'expo.out' });
  s6 += far + hbA.html + hbB.html + near;
  html += scene('sc6', tHB, tP, s6);
  [0, 1, 2, 3].forEach((k) => fx.flash(ctx, ctx.at(6, k), { id: `fh${k}`, color: '#ffffff', peak: 0.1 + k * 0.03, d: 0.22, blend: 'screen' }));

  // =============== bar 7 · PARTNEŘI MISTROVSTVÍ — 8 partners on 8ths + countdown 4-3-2-1 → zoom-through ===============
  const MCY = 1085;                                                          // centre of product + countdown numeral
  const eT = (k) => (k >= 8 ? END : q(7, Math.floor(k / 2), (k % 2) * 0.5));
  let prods = '', nums = '';
  const bgs = X.strobeBg(ctx, { id: 'mb', cards: TEASE.map((p, k) => ({ t0: eT(k), t1: eT(k + 1), bg: look(p).bg, glow: look(p).accent, photo: p.photo || null })), glowOp: 0.5, cy: MCY });
  TEASE.forEach((p, k) => {
    const a = eT(k), b = eT(k + 1);
    if (p.src && ctx.has(p.src)) {
      const pr = ctx.dataOf(p.key)?.products?.find((x) => x.src === p.src);
      prods += X.teaseProd(ctx, { id: `mp${k}`, t0: a, t1: b, src: p.src, pad: pr?.pad, box: [640, 600], cy: MCY, rot: [0, -10, 12, -8, 14, -14, 0, 0][k], zoom: 1.16, ground: 'none' });
    }
  });
  const fN = 1000, YN = MCY - fN * 0.475;
  ['4', '3', '2', '1'].forEach((n, i) => {
    const a = ctx.at(7, i), b = i < 3 ? ctx.at(7, i + 1) : END;
    nums += scene(`cd${i}`, a, b, `<div class="fx-abs" id="${ctx.id(`cn${i}`)}" style="left:0;top:${YN}px;width:${W}px;text-align:center;font-family:'Archivo';font-weight:900;font-stretch:75%;font-size:${fN}px;line-height:1;color:#fff">${n}</div>`, { style: 'mix-blend-mode:difference' });
    ctx.tl.fromTo(ctx.sel(`cn${i}`), { scale: 1.22 }, { scale: 1, duration: 0.4, ease: 'expo.out' }, a);
  });
  const fPa = ctx.fit('Partneři', { ...A, wght: 900, wdth: 75, tracking: -0.01, maxW: CW, maxLines: 1, sizes: [230, 220, 210, 200, 190, 180] });
  const pa = fx.headline(ctx, { id: 'pa', text: 'Partneři', x: L, y: 430, w: CW, size: fPa.size, maxLines: 1, ...A, wght: 900, wdth: 75, tracking: -0.01, lh: 0.9, align: 'center', t: tP - PRE, reveal: 'chars', stagger: 0.025, d: 0.4 });
  const pb = fx.headline(ctx, { id: 'pb', text: 'mistrovství', x: L, y: 430 + fPa.size * 0.9 + 6, w: CW, maxLines: 1, ...A, wght: 300, wdth: 100, tracking: 0.08, sizes: [96, 90, 84, 78, 72], align: 'center', t: ctx.at(7, 1), reveal: 'lines', d: 0.45 });
  const title = `<div class="fx-full" style="mix-blend-mode:difference">${pa.html}${pb.html}</div>`;
  html += scene('sc7', tP, END, `<div class="fx-full" id="${ctx.id('mc')}">${bgs}${nums}${prods}${title}</div>`);
  fx.ramp(ctx, ctx.sel('mc'), tP, END - 0.3, { from: { scale: 1 }, to: { scale: 1.1 } });
  fx.tOut(ctx, 'zoom', { d: 0.42, color: '#ffffff' });

  ctx.report(`times: title ${tTitle} · TA ${tTA} · 25 ${t25} · place ${tPlace} · 40 ${t40}`);
  ctx.report(`sizes: title ${fT.size}/ČR ${fC.size} · 2026 ${S20} · date ${SD} · place ${fPl.size} (${fPl.lines.length} l) · 40 ${S40} · hard baits ${sHa}/${sBa} · partneři ${fPa.size} · aerial ${AER.split('/').pop()}`);
  return { html, css, timeline: ctx.tl };
}
