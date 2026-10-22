// INTRO · bars 0–7 · build-up (no kick) → the drop lands on the venue (bar 8; v9 again, as in v6 — FT Fishing moved to the end).
// High-fashion sports-ad title sequence for the event (neutral event world, not a sponsor world):
// ink black / bone white / ice + an iridescent "rainbow trout" chrome, Archivo variable, hard cuts on the grid.
// Every title lands on the beat NEAREST its spoken word (VO starts 0.5 s), never a bar late:
//   bar 0      TA hero: the plate lands on beat 2 (light streak, halo, rising specks — no sunburst)
//   bar 0½–2   MISTROVSTVÍ (variable morph, on the word) · ČR (iridescent) · v Trout Area — the plate flies back on bar 1
//   bar 1¾–2   "20" on the pickup (VO "dva tisíce") → "26" outline on the bar-2 downbeat ("dvacet šest") → a spoon threads between
//   bar 2¾–4   24.– on ink (VO "čtyřiadvacátého") → the world flips to bone on bar 3 when the bass enters → 25. · 10. · 2026
//   bar 4¼–5   LÍHEŇ LIBĚCHOV — the aerial only THROUGH the letters on ink (teaser); venue reveals the full aerial after the drop
//   bar 5–5¾   40 závodníků — quick odometer on ice, product on the floor
//   bar 5¾–7   HARD (pickup, on the word) · BAITS on the bar-6 downbeat — four hard baits slam in on the beats, depth parallax
//   bar 7      PARTNEŘI MISTROVSTVÍ — the 8 film partners (v9 film order, FT second-to-last, GH last) strobe on 8ths in their own brand colours; title + outline countdown 4-3-2-1
//              switch ink/white per card (no difference blend → no off-brand mint/brown), zoom-through into the drop
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
  // v9 (operator 22. 10.): the same partner order as the film — FT Fishing second-to-last; Gausse Holler (main prize) keeps the last
  // 8th before the zoom-through into the drop (= the venue, which opens from white). 8 partners = 8 eighths (7 sponsors + the venue;
  // ČRS = supporter, thanked separately). rot = product tilt on its card
  { key: 'venue', photo: 'assets_prep/broll_tacz/t14_libechov_briefing.jpg', bg: '#1a212e', accent: '#17a1c8', dark: true },   // our gallery: Liběchov jaro 2026 (was a fish photo)
  { key: 'activefishing', src: 'assets_prep/activefishing/heroes/h02_khor_frea.png', bg: '#f1f1ef', accent: '#e2812d', rot: 12 },
  { key: 'bosset', src: 'assets_prep/bosset/heroes/h01_zojirushi_orange.png', bg: '#c5ebfc', accent: '#1b97b1', rot: 0 },
  { key: 'jigovky', src: 'assets_prep/jigovky/ads/hero_sickle.png', bg: '#060807', accent: '#fed700', rot: 14 },
  { key: 'troutshop', src: 'assets_prep/troutshop/ads/sec_04_velvetarts_forte_2-1g_35_yellow_red.png', bg: '#070707', accent: '#e3000f', rot: -10 },
  { key: 'velkaryba', src: 'assets_prep/velkaryba/heroes/h04_daiwa_presso_flashing_green.png', bg: '#0f2541', accent: '#da0f00', rot: -14 },
  { key: 'ftfishing', src: 'assets_prep/ftfishing/ads/H1_spinmad_impulse_pro_10g_3907_firetiger.png', bg: '#ffffff', accent: '#6DB52C', rot: -8 },
  { key: 'gausseholler', src: 'assets_prep/gausseholler/heroes/h01_revolut8_black_front.png', bg: '#0f1113', accent: '#f0904f', rot: 0 },
];
const THEMES = {};
for (const k of new Set(TEASE.map((p) => p.key))) {
  try { THEMES[k] = (await import(new URL(`./${k}.mjs`, import.meta.url).href)).theme || null; } catch { THEMES[k] = null; }
}
const look = (p) => ({ bg: THEMES[p.key]?.bg || p.bg, accent: THEMES[p.key]?.accent || p.accent });
// relative luminance of a #rrggbb colour (non-hex → treated as dark)
const lum = (hex) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex).trim()); if (!m) return 0;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255).map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

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
  const L = ctx.safe.left, CW = W - ctx.safe.left - ctx.safe.right;          // 952
  const CWr = W - ctx.safe.left - ctx.safe.uiRight;                          // 876 (below y 900: right UI column)
  const A = { font: 'Archivo', upper: true };
  let html = '', css = X.css(ctx);
  // hard-cut scenes; the incoming one starts 3 ms early so no frame can fall into a gap between two cuts
  const scene = (id, t0, t1, inner, o = {}) => fx.scene(ctx, id, t0 > 0.01 ? t0 - 0.003 : t0, t1, inner, { inD: 0.001, outD: 0.001, ...o });
  const PRE = 0.08;                                                          // reveals start this much before their cut → already moving on the cut frame
  // VO sync: the beat nearest the spoken word, clamped into its slot (fallback = grid; the VO may be regenerated)
  const vs = (word, dflt, lo, hi) => Math.min(hi, Math.max(lo, ctx.snap(ctx.vo.at(word) ?? dflt, 'beat')));

  // ---- key times (real grid, VO-led: each title on the beat nearest its word) ----
  const tLand = ctx.at(0, 1);                                                // plate lands as the VO starts ("Mistrovství" 0.5 s)
  const tTitle = vs('Mistrovství', ctx.at(0, 2), ctx.at(0, 2), ctx.at(0, 3));
  const tCR = vs('České', ctx.at(0, 3), ctx.at(0, 3), bar(1));
  const tLeave = bar(1);                                                     // plate flies back to its corner on bar 1
  const tTA = vs('v Trout', ctx.at(1, 1), ctx.at(1, 1), ctx.at(1, 2));
  const t20 = ctx.at(1, 3), t26 = bar(2), tSpoon = ctx.at(2, 1);             // "dva tisíce" pickup → "dvacet šest" on the downbeat
  const t24 = ctx.at(2, 3), tDate = bar(3);                                  // "čtyřiadvacátého" → the bass flips the world to bone on bar 3
  const t25 = vs('25', ctx.at(3, 1), ctx.at(3, 1), ctx.at(3, 2)), t10 = vs('října', ctx.at(3, 3), ctx.at(3, 2), ctx.at(3, 3));
  const tPlace = vs('Líheň', ctx.at(4, 2), ctx.at(4, 1), ctx.at(4, 3));
  const t40 = vs('Čtyřicet', ctx.at(5, 1), bar(5), ctx.at(5, 2));
  const tHB = vs('hard', ctx.at(5, 3), ctx.at(5, 3), bar(6));
  const tBaits = vs('baits', bar(6), bar(6), ctx.at(6, 1));
  const tP = bar(7), END = ctx.dur;

  // =============== bar 0 · TA HERO ===============
  const HERO = { scale: 2.6, cx: W / 2, cy: 700, fly: 0.45 };
  const hero = ctx.plate.hero(Math.max(0.001, tLand - HERO.fly), tLeave + HERO.fly, HERO);
  let s0 = fx.field(ctx, { id: 'f0', kind: 'radial', c1: '#121b24', c2: INK, at: '50% 36%' });
  s0 += `<div class="fx-full" id="${ctx.id('haloW')}" style="opacity:.72">${fx.glow(ctx, { id: 'halo', x: W / 2, y: HERO.cy, size: 1300, color: 'rgba(143,227,255,.6)', opacity: 1 })}</div>`;
  ctx.tl.fromTo(ctx.sel('halo'), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.9, ease: 'expo.out' }, Math.max(0.001, tLand - 0.2));
  s0 += X.streak(ctx, { id: 'stk', y: HERO.cy, w: 1800, h: 4, color: ICE, t: Math.max(0.001, tLand - 0.15), d: 0.9 });
  s0 += X.specks(ctx, { id: 'sp', n: 24, t0: 0, t1: tLeave + HERO.fly, box: [0, 260, W, 1500], op: [0.08, 0.42], seed: 3 });
  // hats on the off-beats (bars 0–1): the halo breathes with them
  for (let b = 0; b < 2; b++) for (let k = 0; k < 4; k++) {
    const a = ctx.at(b, k), n = ctx.at(b, k + 1), t = a + (n - a) * 0.5; if (t < tLand) continue;
    ctx.tl.hit(ctx.sel('haloW'), { opacity: 1 }, { opacity: 0.72, duration: 0.24, ease: 'power2.out' }, t);
  }
  html += scene('sc0', 0, tLeave + HERO.fly, s0, { outD: 0.6 });
  fx.flash(ctx, tLand, { id: 'flLand', color: '#dff6ff', peak: 0.14, d: 0.4, blend: 'screen' });

  // =============== bars 0½–1¾ · MISTROVSTVÍ ČR · v Trout Area ===============
  const fT = ctx.fit('Mistrovství', { ...A, wght: 900, wdth: 75, tracking: -0.01, maxW: CW, maxLines: 1, sizes: [210, 200, 190, 180, 170, 160, 150, 140] });
  const fC = ctx.fit('ČR', { ...A, wght: 900, wdth: 100, maxW: 860, maxLines: 1, sizes: [440, 420, 400, 380, 360] });
  const h1H = fT.size * 0.92, crH = fC.size * 0.9, h3S = 84, gap1 = 6, gap2 = 22;
  const total = h1H + gap1 + crH + gap2 + h3S;
  const Y1 = Math.round(930 - total / 2);
  const dy0 = Math.round(hero.y + hero.h + 34 - Y1);                     // title starts just under the hero plate
  const t1 = fx.headline(ctx, { id: 't1', text: 'Mistrovství', x: -240, y: Y1, w: 1560, size: fT.size, maxLines: 1, ...A, wght: 900, wdth: 75, tracking: -0.01, lh: 0.92, align: 'center', t: tTitle - 0.04, reveal: 'lines', d: 0.6, variable: true });
  fx.varType(ctx, t1.sel, tTitle - 0.04, { from: { wght: 140, wdth: 125, trk: 0.05 }, to: { wght: 900, wdth: 75, trk: -0.01 }, d: 1.0, ease: 'expo.out' });
  const cr = fx.headline(ctx, { id: 'cr', text: 'ČR', x: -100, y: Y1 + h1H + gap1, w: 1280, size: fC.size, maxLines: 1, ...A, wght: 900, wdth: 100, lh: 0.9, align: 'center', cls: 'ix-iri', t: tCR - 0.04, reveal: 'lines', d: 0.6 });
  X.sheen(ctx, cr.sel, tCR, { d: 1.8, from: '0% 0%', to: '100% 0%' });
  fx.chroma(ctx, cr.sel, tCR + 0.02, { amt: 10, d: 0.45 });
  const t3 = fx.headline(ctx, { id: 't3', text: 'v Trout Area', x: L, y: Y1 + h1H + gap1 + crH + gap2, w: CW, size: h3S, maxLines: 1, font: 'Archivo', wght: 500, wdth: 100, tracking: 0.01, color: ICE, align: 'center', t: tTA - 0.04, reveal: 'chars', stagger: 0.02, d: 0.4 });
  const s1 = `<div class="fx-full" id="${ctx.id('tg')}">${t1.html}${cr.html}${t3.html}</div>`;
  ctx.tl.fromTo(ctx.sel('tg'), { y: dy0 }, { y: 0, duration: 0.6, ease: 'expo.inOut' }, tLeave);
  fx.pushIn(ctx, ctx.sel('tgz'), tLeave, t20, { from: 1, to: 1.05, origin: '50% 50%', ease: 'none' });
  html += scene('sc1', tTitle, t20, `<div class="fx-full" id="${ctx.id('tgz')}">${s1}</div>`);
  fx.flash(ctx, tCR, { id: 'flCR', color: '#ffffff', peak: 0.12, d: 0.3, blend: 'screen' });

  // =============== bar 1¾–2¾ · "20" (pickup) · "26" (downbeat) · a spoon threads between the rows ===============
  // no white screen-flash on the cut: over ink it only produced a flat grey frame with half-masked digits
  const f20 = ctx.fit('20', { font: 'Archivo', wght: 900, wdth: 100, maxW: 820, maxLines: 1, sizes: [620, 600, 580, 560] });
  const S20 = f20.size, LHN = 0.8, SEAM = 975, Y20 = SEAM - S20 * LHN;  // seam between the rows; '26' ends above the bottom UI zone
  let s2 = fx.glow(ctx, { id: 'g2', x: W / 2, y: 1000, size: 1400, color: 'rgba(255,140,180,.30)', opacity: 1 });
  const n20 = fx.headline(ctx, { id: 'n20', text: '20', x: -100, y: Y20, w: 1280, size: S20, maxLines: 1, font: 'Archivo', wght: 900, wdth: 100, tracking: -0.03, lh: LHN, align: 'center', cls: 'ix-iri', t: t20 - 0.12, reveal: 'lines', d: 0.45 });
  X.sheen(ctx, n20.sel, t20 + 0.1, { d: 1.5, from: '100% 0%', to: '0% 0%' });
  const n26 = fx.headline(ctx, { id: 'n26', text: '26', x: -100, y: Y20 + S20 * LHN, w: 1280, size: S20, maxLines: 1, font: 'Archivo', wght: 900, wdth: 100, tracking: -0.03, lh: LHN, align: 'center', cls: 'ix-ol', style: '--ow:5px;--oc:#ffffff', t: t26 - 0.1, reveal: 'lines', d: 0.45 });
  const spoonSrc = 'assets_prep/velkaryba/heroes/h01_illex_native_pink_yamame.png';
  const SP = fx.product(ctx, { id: 'spn', src: spoonSrc, w: 660, cx: W / 2 + 10, cy: SEAM, ground: 'none', rot: -32, pad: [0.033, 0.03, 0.034, 0.03] });
  fx.productIn(ctx, 'spn', tSpoon, { from: 'right', d: 0.42, dist: 260 });
  fx.float(ctx, SP.cam, tSpoon + 0.4, t24, { y: -14, rot: 3, period: ctx.BEAT });
  fx.sweep(ctx, 'spn', tSpoon + 0.25, { d: 0.6 });
  fx.pushIn(ctx, SP.cam, tSpoon, t24, { from: 1, to: 1.12, ease: 'power1.in' });
  fx.productOut(ctx, 'spn', t24 - 0.13, { to: 'left', d: 0.13 });
  s2 += n20.html + SP.html + n26.html;
  html += scene('sc2', t20, t24, s2);

  // =============== bar 2¾–4¼ · 24.– on ink → bone on bar 3 (the bass enters) · 25. · 10. 2026 ===============
  const DO = { font: 'Archivo', wght: 900, wdth: 72, tracking: -0.03 };
  const fD = ctx.fit('24.–25.', { ...DO, maxW: CW, maxLines: 1, sizes: [360, 340, 320, 300, 280, 260, 240] });
  const SD = fD.size, YD = Math.round(930 - (SD * 0.9 * 2 + 58) / 2);
  const w24 = ctx.measure('24.–', { ...DO, size: SD }), w10 = ctx.measure('10.', { ...DO, size: SD });
  let s3 = fx.field(ctx, { id: 'f3', kind: 'linear', c1: '#fbfaf7', c2: '#e2ded6', angle: 180 });
  s3 += `<div class="fx-field" id="${ctx.id('inkc')}" style="background:${INK}"></div>`;   // ink until the bass flips the world
  ctx.tl.set(ctx.sel('inkc'), { opacity: 0 }, tDate);
  const d24 = fx.headline(ctx, { id: 'd24', text: '24.–', x: L, y: YD, w: w24 + 40, size: SD, maxLines: 1, ...DO, lh: 0.9, color: BONE });
  ctx.tl.set(d24.sel, { color: INK }, tDate);
  const d25 = fx.headline(ctx, { id: 'd25', text: '25.', x: L + w24, y: YD, w: CW - w24 + 40, size: SD, maxLines: 1, ...DO, lh: 0.9, color: INK });
  X.blurIn(ctx, d24.sel, t24 - PRE, { x: -320, d: 0.6, blur: 26 });
  X.blurIn(ctx, d25.sel, t25 - 0.04, { x: 320, d: 0.6, blur: 26 });
  const yRule = YD + SD * 0.9 + 18;
  s3 += `<div class="fx-abs" id="${ctx.id('rule')}" style="left:${L}px;top:${yRule}px;width:${CW}px;height:5px;background:${INK}"></div>`;
  ctx.tl.set(ctx.sel('rule'), { transformOrigin: '0% 50%' }, 0);
  ctx.tl.fromTo(ctx.sel('rule'), { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'expo.inOut' }, t25 + 0.12);
  const Y10 = yRule + 40;
  const d10 = fx.headline(ctx, { id: 'd10', text: '10.', x: L, y: Y10, w: w10 + 40, size: SD, maxLines: 1, ...DO, lh: 0.9, color: INK, t: t10 - 0.04, reveal: 'lines', d: 0.5 });
  const xc = L + w10 + 34, wc = W - ctx.safe.uiRight - xc;
  const dY = fx.headline(ctx, { id: 'dY', text: '2026', x: xc, y: Y10 + SD * 0.06, w: wc, maxLines: 1, font: 'Archivo', wght: 300, wdth: 100, tracking: -0.02, sizes: [170, 160, 150, 140, 130, 120], color: INK, t: t10 + 0.1, reveal: 'lines', d: 0.45 });
  const dS = fx.headline(ctx, { id: 'dS', text: 'sobota + neděle', x: xc + 4, y: Y10 + SD * 0.06 + dY.h + 14, w: wc, maxLines: 1, font: 'Inter', wght: 700, upper: true, tracking: 0.16, sizes: [30, 28, 26, 24], color: INK, t: t10 + 0.24, reveal: 'fade', d: 0.4 });
  s3 += `<div class="fx-full" id="${ctx.id('dg')}">${d24.html}${d25.html}${d10.html}${dY.html}${dS.html}</div>`;
  fx.pushIn(ctx, ctx.sel('dg'), t24, tPlace, { from: 1, to: 1.045, origin: '50% 45%', ease: 'none' });
  html += scene('sc3', t24, tPlace, s3);

  // =============== bars 4¼–5 · LÍHEŇ LIBĚCHOV — the aerial only through the letters (teaser; venue reveals it full-frame) ===============
  const AER = aerial();
  let s4 = fx.field(ctx, { id: 'f4', kind: 'radial', c1: '#10232b', c2: INK, at: '50% 46%' });
  const fPl = ctx.fit('Líheň Liběchov', { ...A, wght: 900, wdth: 75, tracking: -0.01, maxW: CWr, maxLines: 2, sizes: [300, 280, 260, 240, 220, 200, 180, 160] });
  const YP = Math.round(900 - (fPl.lines.length * fPl.size * 0.9) / 2);
  const pl = X.photoType(ctx, { id: 'pl', src: AER, text: 'Líheň Liběchov', x: L, y: YP, w: CWr, size: fPl.size, maxLines: 2, ...A, wght: 900, wdth: 75, tracking: -0.01, lh: 0.9, t: tPlace - PRE, reveal: 'lines', d: 0.5, stagger: 0.08, kb: { dx: 0, dy: -150, t0: tPlace, t1: t40 }, filter: 'brightness(2.25) saturate(1.2) contrast(1.06)', style: '-webkit-text-stroke:2px rgba(255,255,255,.92)' });
  css += pl.css;
  const pond = fx.headline(ctx, { id: 'pond', text: 'rybník Malý Sporťáček', x: L + 4, y: YP + pl.h + 30, w: CWr, maxLines: 1, font: 'Inter', wght: 700, upper: true, tracking: 0.22, sizes: [34, 32, 30, 28], color: ICE, t: tPlace + ctx.BEAT * 0.5, reveal: 'fade', d: 0.4 });
  s4 += `<div class="fx-full" id="${ctx.id('plz')}">${pl.html}${pond.html}</div>`;
  fx.pushIn(ctx, ctx.sel('plz'), tPlace, t40, { from: 1, to: 1.06, origin: '30% 47%', ease: 'none' });
  html += scene('sc4', tPlace, t40, s4);

  // =============== bars 5–5¾ · 40 závodníků on ice ===============
  const S40 = [760, 740, 720, 700, 680, 660].find((s) => ctx.measure('40', { font: 'Archivo', wght: 900, size: s }) <= 900) || 640;
  const Y40 = 360;
  let s5 = fx.field(ctx, { id: 'f5', kind: 'radial', c1: '#d4f6ff', c2: '#5ccff3', at: '50% 35%' });
  // short roll (≤ 0.6 s, finale lesson): a long one parks on "03" / "17" for half a second
  s5 += fx.odometer(ctx, { id: 'n40', value: '40', x: L, y: Y40, w: CW, align: 'center', size: S40, font: 'Archivo', wght: 900, color: INK, t: t40 - 0.06, d: 0.55, spins: 0, stagger: 0.04, style: 'letter-spacing:-.04em' });
  const zv = fx.headline(ctx, { id: 'zv', text: 'závodníků', x: (W - 800) / 2, y: Y40 + S40 * 0.84 + 44, w: 800, maxLines: 1, ...A, wght: 900, wdth: 75, tracking: -0.01, sizes: [200, 190, 180, 170, 160, 150], color: INK, align: 'center', t: vs('závodníků', t40 + ctx.BEAT, t40 + ctx.BEAT, t40 + ctx.BEAT) - 0.04, reveal: 'lines', d: 0.45 });
  const af = { src: 'assets_prep/activefishing/heroes/h01_nories_sofia.png', pad: [0.029, 0.04, 0.028, 0.04] };
  const P5 = fx.product(ctx, { id: 'af', src: af.src, w: 470, cx: 600, floor: 1440, ground: 'floor', reflect: 0.28, shadow: 0.45, pad: af.pad, rot: -6 });
  fx.productIn(ctx, 'af', t40 + ctx.BEAT, { from: 'rise', d: 0.5, dist: 200 });
  fx.sweep(ctx, 'af', t40 + ctx.BEAT * 2, { d: 0.6 });
  s5 += zv.html + P5.html;
  html += scene('sc5', t40, tHB, s5);

  // =============== bars 5¾–7 · HARD (pickup) · BAITS (bar 6) — four hard baits slam in on the bar-6 beats, depth parallax ===============
  let s6 = fx.field(ctx, { id: 'f6', kind: 'radial', c1: '#0e2a33', c2: INK, at: '50% 48%' });
  // two stacked words, each fitted to its own width: HARD (above y 900 → full width) · BAITS (below → clear of the right UI column)
  const HBO = { ...A, wght: 900, wdth: 75, tracking: -0.01, maxLines: 1 };
  const sHa = ctx.fit('Hard', { ...HBO, maxW: CW, sizes: [420, 400, 380, 360, 340, 320] }).size;
  const sBa = ctx.fit('baits', { ...HBO, maxW: 800, sizes: [400, 380, 360, 340, 320, 300, 280] }).size;
  const YH = Math.round(905 - sHa * 0.88);
  const HB = [   // [src, pad, w, cx, cy, rot, layer] — near layer kept left of the right UI column (x ≤ 940 below y 900)
    ['assets_prep/velkaryba/heroes/h05_shimano_cardiff_roll_swimmer_orange.png', [0.031, 0.039, 0.03, 0.039], 400, 830, 500, 16, 'far'],
    ['assets_prep/troutshop/ads/hero_02_velvetarts_forte_2-1g_32_glow_pink.png', [0.053, 0.028, 0.053, 0.029], 260, 215, 650, -14, 'far'],
    ['assets_prep/activefishing/heroes/h04_luckycraft_wah33f.png', [0.031, 0.063, 0.028, 0.066], 600, 372, 1345, -8, 'near'],
    ['assets_prep/troutshop/ads/hero_03_nories_crankin_pupa_109.png', [0.028, 0.052, 0.029, 0.052], 400, 735, 1300, 12, 'near'],
  ];
  let far = '', near = '';
  HB.forEach(([src, pad, w, cx, cy, rot, layer], i) => {
    const t = ctx.at(6, i) - 0.03;
    const P = fx.product(ctx, { id: `hb${i}`, src, w, cx, cy, ground: 'none', pad, rot });
    X.slam(ctx, P.sel, t, { from: layer === 'near' ? 1.7 : 1.4, d: 0.42, blur: 16 });
    fx.sweep(ctx, `hb${i}`, t + 0.18, { d: 0.55 });
    const k = layer === 'near' ? 1 : 0.45;
    ctx.tl.fromTo(P.cam, { x: 0, y: 0 }, { x: (cx < W / 2 ? -1 : 1) * 40 * k, y: -50 * k, duration: Math.max(0.2, tP - t), ease: 'sine.out' }, t);
    if (layer === 'near') near += P.html; else far += P.html;
  });
  const hbA = fx.headline(ctx, { id: 'hbA', text: 'Hard', x: -240, y: YH, w: 1560, size: sHa, ...HBO, lh: 0.88, align: 'center', t: tHB - PRE, reveal: 'lines', d: 0.5, variable: true });
  const hbB = fx.headline(ctx, { id: 'hbB', text: 'baits', x: -240, y: YH + sHa * 0.88, w: 1560, size: sBa, ...HBO, lh: 0.88, align: 'center', t: tBaits - 0.06, reveal: 'lines', d: 0.5, variable: true });
  fx.varType(ctx, hbA.sel, tHB - PRE, { from: { wght: 300, wdth: 110, trk: 0.04 }, to: { wght: 900, wdth: 75, trk: -0.01 }, d: 0.9, ease: 'expo.out' });
  fx.varType(ctx, hbB.sel, tBaits - 0.06, { from: { wght: 300, wdth: 110, trk: 0.04 }, to: { wght: 900, wdth: 75, trk: -0.01 }, d: 0.9, ease: 'expo.out' });
  s6 += far + hbA.html + hbB.html + near;
  html += scene('sc6', tHB, tP, s6);
  [0, 1, 2, 3].forEach((k) => fx.flash(ctx, ctx.at(6, k), { id: `fh${k}`, color: '#ffffff', peak: 0.05 + k * 0.02, d: 0.2, blend: 'screen' }));

  // =============== bar 7 · PARTNEŘI MISTROVSTVÍ — 8 partners on 8ths + outline countdown 4-3-2-1 → zoom-through ===============
  const MCY = 1085;                                                          // centre of product + countdown numeral
  const eT = (k) => (k >= 8 ? END : ctx.at(7, Math.floor(k / 2)) + (ctx.at(7, Math.floor(k / 2) + 1) - ctx.at(7, Math.floor(k / 2))) * (k % 2) * 0.5);
  // title + numeral colour per card: ink on light brand worlds, white on dark ones (photo card = dimmed → dark)
  const inkOf = (p) => (!p.photo && lum(look(p).bg) > 0.4 ? INK : '#ffffff');
  let prods = '', nums = '';
  const bgs = X.strobeBg(ctx, { id: 'mb', cards: TEASE.map((p, k) => ({ t0: eT(k), t1: eT(k + 1), bg: look(p).bg, glow: look(p).accent, photo: p.photo || null })), glowOp: 0.5, cy: MCY, photoFilter: 'brightness(.5) saturate(1.1)' });
  TEASE.forEach((p, k) => {
    const a = eT(k), b = eT(k + 1);
    if (k && inkOf(p) !== inkOf(TEASE[k - 1])) ctx.tl.set(ctx.sel('mc'), { '--nc': inkOf(p) }, a);
    if (p.src && ctx.has(p.src)) {
      const pr = ctx.dataOf(p.key)?.products?.find((x) => x.src === p.src);
      prods += X.teaseProd(ctx, { id: `mp${k}`, t0: a, t1: b, src: p.src, pad: pr?.pad, box: [640, 600], cy: MCY, rot: p.rot || 0, zoom: 1.16, ground: 'none' });
    }
  });
  const fN = 1000, YN = MCY - fN * 0.475;
  ['4', '3', '2', '1'].forEach((n, i) => {
    const a = ctx.at(7, i), b = i < 3 ? ctx.at(7, i + 1) : END;
    nums += scene(`cd${i}`, a, b, `<div class="fx-abs" id="${ctx.id(`cn${i}`)}" style="left:0;top:${YN}px;width:${W}px;text-align:center;font-family:'Archivo';font-weight:900;font-stretch:75%;font-size:${fN}px;line-height:1;color:transparent;-webkit-text-stroke:7px var(--nc)">${n}</div>`);
    ctx.tl.fromTo(ctx.sel(`cn${i}`), { scale: 1.22 }, { scale: 1, duration: 0.4, ease: 'expo.out' }, a);
  });
  const fPa = ctx.fit('Partneři', { ...A, wght: 900, wdth: 75, tracking: -0.01, maxW: CW, maxLines: 1, sizes: [230, 220, 210, 200, 190, 180] });
  const pa = fx.headline(ctx, { id: 'pa', text: 'Partneři', x: L, y: 430, w: CW, size: fPa.size, maxLines: 1, ...A, wght: 900, wdth: 75, tracking: -0.01, lh: 0.9, align: 'center', color: 'var(--nc)', t: tP - PRE, reveal: 'chars', stagger: 0.025, d: 0.4 });
  const pb = fx.headline(ctx, { id: 'pb', text: 'mistrovství', x: L, y: 430 + fPa.size * 0.9 + 6, w: CW, maxLines: 1, ...A, wght: 300, wdth: 100, tracking: 0.08, sizes: [96, 90, 84, 78, 72], align: 'center', color: 'var(--nc)', t: tP + 0.12, reveal: 'lines', d: 0.45 });
  const title = `<div class="fx-full" id="${ctx.id('ttl')}">${pa.html}${pb.html}</div>`;
  html += scene('sc7', tP, END, `<div class="fx-full" id="${ctx.id('mc')}" style="--nc:${inkOf(TEASE[0])}">${bgs}${nums}${prods}${title}</div>`);
  fx.ramp(ctx, ctx.sel('mc'), tP, END - 0.3, { from: { scale: 1 }, to: { scale: 1.1 } });
  fx.tOut(ctx, 'zoom', { d: 0.42, color: '#ffffff' });
  // v9 (REVIEW_v8 MINOR 4): the zoom-through blew the white PARTNEŘI letters up UNDER the white TROUT of the TA logo → the title leaves
  // (down + out) as the zoom starts to accelerate, and the logo gets its strongest shadow for the white hand-over
  ctx.tl.fromTo(ctx.sel('ttl'), { opacity: 1, y: 0 }, { opacity: 0, y: 120, duration: 0.16, ease: 'power2.in' }, END - 0.3);
  ctx.plate.tone(END - 0.45, END, 'halo');

  ctx.report(`times: land ${tLand} · title ${tTitle} · ČR ${tCR} · TA ${tTA} · 20 ${t20} · 26 ${t26} · 24 ${t24} · 25 ${t25} · 10 ${t10} · place ${tPlace} · 40 ${t40} · hard ${tHB} · baits ${tBaits}`);
  ctx.report(`sizes: title ${fT.size}/ČR ${fC.size} · 2026 ${S20} · date ${SD} · place ${fPl.size} (${fPl.lines.length} l) · 40 ${S40} · hard baits ${sHa}/${sBa} · partneři ${fPa.size} · aerial ${AER.split('/').pop()}`);
  return { html, css, timeline: ctx.tl };
}
