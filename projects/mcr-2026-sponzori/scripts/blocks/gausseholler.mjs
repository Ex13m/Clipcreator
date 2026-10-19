// GAUSSE HOLLER CUSTOM LAB · 5 bars (plan A: bars 47–51) · concept A „LAB“ (research/gausseholler_ad.md) re-cut on VO take 3:
//   „Hlavní cena pro vítěze MČR – stojan Revolut 8 od Gausse Holler Custom Lab.“  (BRIEF: GH block = the main-prize moment)
// World = gausseholler.com: graphite studio #0F1113, bone type, ice kickers, ONE accent per moment (Black-edition orange / anodised colour).
//   bar 0  REVEAL   light pool switches on over the top view (radial star), slow orbit + descend · HLAVNÍ CENA / PRO VÍTĚZE MČR (VO words)
//   bar 1  PODIUM   hard cut: Revolut 8 Black lands on a display podium („Black Standard Edition“ plaque), light sweeps, giant outline 8
//                   STOJAN NA PRUTY · REVOLUT 8 (the 8 rolls in on „osm“); speed-ramp push-in into the orange gear cap
//   bar 2  SPEC     match cut on the cap → front „monolith“ on a hairline grid, spec callouts draw (8 karbonových tubusů · Ø 32 × 200 mm,
//                   hliníková ramena) · GAUSSE HOLLER / CUSTOM LAB typed on the VO
//   bar 3  COLOURS  assortment: the Revolut 8 SE swaps through its 7 anodised colours on 8th notes (shared crop), field + floor tinted,
//                   e-shop colour rail · RUČNĚ STAVĚNO V ČESKU
//   bar 4  LOCKUP   family on the podium (Black hero + Nevergreen, Black & White, Snap 8, Orange in depth), GH logo (site layers, ring turns,
//                   ≤ TA plate) + gausseholler.com + „Partner a informační sponzor“ + „Věnuje hlavní cenu · MČR 2026“ + edition stamp
//                   „Série 5 ks · číslováno“ → zoom-through to white (the finale opens on white)
// Facts only from research/gausseholler.md (Verification) + gausseholler_ad.md guardrails: no colour count, no prices, no „závodní“.
import * as fx from '../lib/fx.mjs';
import * as gh from '../lib/fx_gausseholler.mjs';

const { C, IMG, COLS, FOOT } = gh;

export const fonts = {
  'Cormorant Garamond': { v: 'cormorant-garamond-{r}-wght-normal', vi: 'cormorant-garamond-{r}-wght-italic', weight: '300 700', axes: ['wght'], use: 'GH wordmark serif (OFL) — the one crafted line' },
  Jost: { v: 'jost-{r}-wght-normal', vi: 'jost-{r}-wght-italic', weight: '100 900', axes: ['wght'], use: 'GH „CUSTOM LAB“ line (OFL)' },
};
export const theme = { bg: C.bg, bg2: C.panel, fg: C.bone, accent: C.orange, accent2: C.ice, font: { display: 'Inter', text: 'Inter' }, wght: 800, upper: true, light: false };
export const meta = {
  reel: true,
  hook: { headline: 'Hlavní cena', sub: 'MČR v Trout Area 2026' },
  endCard: { logo: 'on_dark', line: 'Partner a informační sponzor' },   // GH = partner + information sponsor of MČR (BRIEF); prize pill below
};

const px = (n) => `${Math.round(n * 10) / 10}px`;
// the 8 eighth notes of a bar (block-local seconds, from the real beat grid)
const eighths = (ctx, bar) => Array.from({ length: 8 }, (_, i) => { const k = Math.floor(i / 2), t = ctx.at(bar, k); return i % 2 ? (t + ctx.at(bar, k + 1)) / 2 : t; });

export default function gausseholler(ctx) {
  gh.stage(ctx);
  const { W, S, bar } = ctx, L = ctx.safe.left, CW = W - L - ctx.safe.right, END = ctx.dur;
  const v = (q, d) => ctx.vo.at(q) ?? d;
  const tB = bar(1), tC = bar(2), tD = bar(3), tE = bar(4);
  const T0 = 420;                                   // headline slot (below the TA plate)
  let html = '';

  // ================= world (persistent): graphite field + vignette =================
  html += fx.field(ctx, { kind: 'radial', c1: '#1a1e22', c2: C.bg, at: '50% 46%' });

  // ================= A · REVEAL (top view) =================
  let a = gh.pool(ctx, { id: 'apool', x: 540, y: 1110, w: 1500, h: 1500, color: '#2f363d' });
  const TV = fx.product(ctx, { id: 'tv', src: gh.src(IMG.top), w: 880, cx: 540, cy: 1205, ground: 'none', pad: gh.pad(IMG.top), sweepOpacity: 0.55, maxUp: 1 });
  a += TV.html;
  // the downbeat frame already carries the product in light (was: pool at .25 + stand at .72 → a dim, empty kick)
  ctx.tl.fromTo(ctx.sel('apool'), { opacity: 0.6, scale: 0.82 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' }, 0);
  ctx.tl.fromTo(TV.sel, { opacity: 0.9 }, { opacity: 1, duration: 0.25, ease: 'power2.out' }, 0);
  ctx.tl.set(TV.cam, { transformOrigin: `${px(0.501 * TV.w)} ${px(0.424 * TV.h)}` }, 0);
  ctx.tl.fromTo(TV.cam, { scale: 1.0, rotation: -14 }, { scale: 1.12, rotation: 7, duration: tB + 0.05, ease: 'power1.inOut' }, 0);
  fx.sweep(ctx, 'tv', ctx.beat(1) - 0.1, { d: 0.95 });
  a += gh.glint(ctx, { id: 'ag', x: TV.x + 0.494 * TV.w, y: TV.y + 0.161 * TV.h, size: 300, t: ctx.beat(3) - 0.05, color: '#ffe2cc' });
  html += fx.scene(ctx, 'sA', 0, tB, a, { outD: 0.001 });

  // ================= giant outline 8 (behind B + C) =================
  const t8 = Math.max(tB + ctx.BEAT * 2, v('Revolut', 3.32) - 0.12);
  const s8 = 1180, w8 = ctx.measure('8', { font: 'Inter', wght: 800, size: s8 });
  html += fx.bigType(ctx, { id: 'b8', text: '8', font: 'Inter', wght: 800, size: s8, x: (W - w8) / 2, y: 470, color: C.bone, outline: true, ow: 3, drift: 0, tracking: 0, style: 'opacity:0' });
  const t8out = ctx.at(2, 1) - 0.26;                   // gone before the spec row (its loops crossed the numbers as stray rings)
  ctx.tl.fromTo(ctx.sel('b8'), { opacity: 0, scale: 1.3 }, { opacity: 0.2, scale: 1, duration: Math.min(0.7, t8out - t8 - 0.02), ease: 'expo.out' }, t8);
  ctx.tl.fromTo(ctx.sel('b8'), { opacity: 0.2 }, { opacity: 0, duration: 0.2, ease: 'none' }, t8out);

  // ================= B · PODIUM (Revolut 8 Black) =================
  // plinth in the render's own perspective (top ellipse = leg-tip footprint × 1.16) → all four legs stand on it
  let b = gh.cone(ctx, { id: 'bcone', x: 540, top: -60, wTop: 320, wBot: 1180, h: 1560, a: 0.12 });
  const H1 = gh.prod(ctx, { id: 'h1', k: IMG.threeq, w: 680, cx: 540, top: 625, sweepOpacity: 0.6 });
  const F1 = gh.foot('threeq', H1);
  const PL1 = gh.plinth(ctx, { id: 'bpod', F: F1, h: 80, label: 'Black Standard Edition', labelT: tB + 0.45 });
  b += gh.pool(ctx, { id: 'bglow', x: 540, y: H1.y + H1.h * 0.48, w: 1000, h: 900, color: '#323941' });
  b += gh.floor(ctx, { id: 'bfl', y: PL1.top - 60 });
  const bg = PL1.html + gh.footShadow(ctx, { id: 'bsh', F: F1 }) + H1.html;
  b += `<div class="fx-full" id="${ctx.id('bgrp')}">${bg}</div>`;
  const cap = [H1.x + 0.505 * H1.w, H1.y + 0.068 * H1.h];      // orange gear end-cap on the handle (3/4 view)
  html += fx.scene(ctx, 'sB', tB, tC, `<div class="fx-full" id="${ctx.id('bcam')}" style="transform-origin:${px(cap[0])} ${px(cap[1])}">${b}</div>`, { outD: 0.001 });
  ctx.tl.fromTo(ctx.sel('bgrp'), { y: 120, scale: 1.05 }, { y: 0, scale: 1, duration: 0.6, ease: 'expo.out' }, tB - 0.03);
  fx.sweep(ctx, 'h1', ctx.at(1, 1) - 0.05, { d: 0.9 });
  // speed-ramp push-in into the gear cap (1.8× of 680 px = 1224 px ≤ native 1316 → no upscale), hard cut on the bar-2 downbeat
  const tRamp = ctx.at(1, 2) + 0.1;
  ctx.tl.fromTo(ctx.sel('bcam'), { scale: 1 }, { scale: 1.8, duration: tC - tRamp, ease: 'fxRampIn' }, tRamp);
  fx.flash(ctx, tB, { id: 'fb', color: '#cfe3ec', peak: 0.08, d: 0.2, blend: 'screen' });   // faint: a stronger screen flash greys the graphite

  // ================= C · SPEC (front monolith) =================
  const FW = 660;
  const [fnw, fnh] = ctx.dims(gh.src(IMG.front)), fh = FW / (fnw / fnh);
  const capFy = 0.065;                                  // gear cap on the front view (fraction of the PNG height)
  // match cut: the front view's cap lands exactly where the 3/4 cap was (x and y)
  const H1b = gh.prod(ctx, { id: 'h1b', k: IMG.front, w: FW, cx: cap[0] + 0.002 * FW, top: cap[1] - capFy * fh, sweepOpacity: 0.55 });
  const F2 = gh.foot('front', H1b), fFloor = Math.round(F2.tips[2][1]);   // front leg tip = lowest contact
  let c = `<div class="fx-full gh-grid" id="${ctx.id('cgrid')}"></div>`;
  c += gh.cone(ctx, { id: 'ccone', x: 540, top: -60, wTop: 300, wBot: 1100, h: 1500, a: 0.1 });
  c += gh.pool(ctx, { id: 'cglow', x: 540, y: fFloor - fh * 0.45, w: 1000, h: 900, color: '#2e353c' });
  c += gh.floor(ctx, { id: 'cfl', y: F2.back - 40 });   // seam behind the side legs (was below them → legs stood in the wall)
  c += `<div class="fx-full" id="${ctx.id('cstand')}">${gh.footShadow(ctx, { id: 'csh', F: F2, ao: 0.45 })}${H1b.html}</div>`;
  const capF = [H1b.x + 0.498 * FW, H1b.y + capFy * fh];
  c += gh.glint(ctx, { id: 'cg', x: capF[0], y: capF[1], size: 320, t: tC + 0.02, color: '#ffd8bd' });
  // spec row (verified: „Eight carbon tubes“, tube „outer diameter 32 mm … length 200 mm“) — rolling numerals on the beat after „osm“
  c += gh.spec(ctx, {
    id: 'sp', x0: L, y: fFloor + 26, colW: 300, size: 96, t: ctx.at(2, 1) - 0.06, stagger: 0.16,
    cols: [{ value: '8', label: ['karbonových', 'tubusů'] }, { value: '32', prefix: 'Ø', unit: 'mm', label: ['vnější', 'průměr'] }, { value: '200', unit: 'mm', label: ['délka', 'tubusu'] }],
  });
  // the real component next to its spec: Carbon Tube Ø32 · Black (single tube, 200 mm) rises in with the numbers
  const TB = gh.still(ctx, { id: 'tube', k: IMG.tube, w: 74, cx: 948, floor: fFloor, style: 'filter:drop-shadow(0 18px 14px rgba(0,0,0,.6))' });
  c += TB.html;
  ctx.tl.fromTo(TB.sel, { y: 160, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out' }, ctx.at(2, 1) + 0.1);
  html += fx.scene(ctx, 'sC', tC, tD, c, { outD: 0.001 });
  // settle out of the push-in around the cap itself (the cap stays where the 3/4 cap was → the match cut holds)
  ctx.tl.set(ctx.sel('cstand'), { transformOrigin: `${px(capF[0])} ${px(capF[1])}` }, 0);
  ctx.tl.fromTo(ctx.sel('cstand'), { scale: 1.16 }, { scale: 1, duration: 0.6, ease: 'expo.out' }, tC);
  ctx.tl.fromTo(ctx.sel('cgrid'), { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power1.out' }, tC + 0.1);
  fx.sweep(ctx, 'h1b', tC + 0.35, { d: 0.9 });

  // ================= D · COLOURWAYS (assortment, swaps in place on 8th notes) =================
  const E8 = eighths(ctx, 3);
  const times = E8.slice(0, 7);
  const ST = gh.stack(ctx, { id: 'cw', w: 600, cx: 590, floor: 1350, times });
  const F3 = gh.foot('cw', ST);                         // the colourway crop looks down ~44° → footprint ellipse 2:1.4
  let d = `<div class="fx-abs" id="${ctx.id('tint')}" style="left:${px(590 - 700)};top:${px(1010 - 700)};width:1400px;height:1400px;border-radius:50%;background:radial-gradient(closest-side,currentColor,transparent);color:${COLS[0].glow};opacity:.42"></div>`;
  d += gh.floor(ctx, { id: 'dfl', y: F3.back - 70 });   // seam behind the back leg (was at leg height → the stand stood in the wall)
  // coloured light pool on the floor, in the stand's perspective
  d += `<div class="fx-abs" id="${ctx.id('dfg')}" style="left:${px(F3.x - F3.a * 1.5)};top:${px(F3.y - F3.b * 1.5)};width:${px(F3.a * 3)};height:${px(F3.b * 3)};border-radius:50%;background:radial-gradient(closest-side,currentColor,transparent);color:${COLS[0].glow};opacity:.42"></div>`;
  d += `<div class="fx-full" id="${ctx.id('dgrp')}">${gh.footShadow(ctx, { id: 'dsh', F: F3, ao: 0.55 })}${ST.html}</div>`;
  d += gh.swatches(ctx, { id: 'sw', x: 112, y: 760, gap: 70, r: 19, times, t0: tD + 0.05 });
  times.forEach((t, i) => {
    if (i) { ctx.tl.set(ctx.sel('tint'), { color: COLS[i].glow }, t); ctx.tl.set(ctx.sel('dfg'), { color: COLS[i].glow }, t); }
    fx.punch(ctx, ST.cam, t, { scale: 1.035, d: 0.2 });
  });
  html += fx.scene(ctx, 'sD', tD, tE, d, { outD: 0.001 });
  ctx.tl.fromTo(ST.sel, { y: -60, opacity: 1 }, { y: 0, opacity: 1, duration: 0.4, ease: 'expo.out' }, tD - 0.04);   // drops onto its shadow
  fx.sweep(ctx, 'cw', E8[6] - 0.02, { d: 0.5 });
  ctx.tl.set(ctx.sel('dgrp'), { transformOrigin: `${px(F3.x)} ${px(F3.y)}` }, 0);
  ctx.tl.fromTo(ctx.sel('dgrp'), { scale: 1 }, { scale: 0.92, duration: tE - E8[7], ease: 'power2.in' }, E8[7]);

  // ================= E · LOCKUP (the prize on its plinth) =================
  // hero on a plinth in its own perspective; two family stands on the floor behind it (colour = they read as other models, not as
  // a black mass); edition stamp in the hero's empty upper-left corner (it used to sit on the tubes)
  const HE = gh.prod(ctx, { id: 'h1e', k: IMG.threeq, w: 580, cx: 540, top: 806, bg: true, sweepOpacity: 0.6 });
  const FE = gh.foot('threeq', HE);
  const PLE = gh.plinth(ctx, { id: 'epod', F: FE, h: 76 });
  let e = gh.cone(ctx, { id: 'econe', x: 540, top: -60, wTop: 340, wBot: 1250, h: 1600, a: 0.12 });
  e += gh.pool(ctx, { id: 'eglow', x: 540, y: 1080, w: 1150, h: 900, color: '#323941' });
  e += gh.floor(ctx, { id: 'efl', y: PLE.top - 70 });
  const fam = [gh.still(ctx, { id: 'e1', k: IMG.never, w: 196, cx: 146, floor: 1196, style: 'filter:brightness(.78) blur(.7px)' }),
    gh.still(ctx, { id: 'e2', k: IMG.snap, w: 280, cx: 930, floor: 1168, style: 'filter:brightness(.72) blur(.7px)' })];
  e += gh.blots(ctx, { id: 'efsh', list: fam.map((s, i) => ({ x: i ? 930 : 146, y: i ? 1166 : 1194, rx: s.w * 0.46, ry: s.w * 0.1 })) }) + fam.map((s) => s.html).join('');
  e += `<div class="fx-full" id="${ctx.id('egrp')}">${PLE.html}${gh.footShadow(ctx, { id: 'esh', F: FE })}${HE.html}</div>`;
  ctx.tl.fromTo(ctx.sel('egrp'), { y: 70, scale: 1.04 }, { y: 0, scale: 1, duration: 0.5, ease: 'expo.out' }, tE - 0.1);
  fam.forEach((s, i) => ctx.tl.fromTo(s.sel, { x: (i ? 1 : -1) * 120, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: 'expo.out' }, tE - 0.06));
  fx.sweep(ctx, 'h1e', tE + 0.3, { d: 0.85 });
  e += gh.stamp(ctx, { id: 'stp', x: 178, y: 874, size: 178, l1: 'Série 5 ks', l2: 'číslováno', t: ctx.at(4, 1) - 0.04 });
  // lockup: logo (site layers, ring turns; logo rule ×1) + URL + role + prize pill — URL lands ON the downbeat
  const M = gh.mark(ctx, { id: 'mk', cx: W / 2, y: 372, box: [300, 300], at: [tE, END], label: 'gausseholler lockup' });
  e += M.html;
  ctx.tl.fromTo(M.sel, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'expo.out' }, tE - 0.1);
  ctx.tl.fromTo(M.ring, { rotation: -120 }, { rotation: 0, duration: 1.0, ease: 'expo.out' }, tE - 0.1);
  const yU = 372 + M.h + 16;
  const U = fx.headline(ctx, { id: 'url', text: 'gausseholler.com', x: L, y: yU, w: CW, maxLines: 1, font: 'Inter', wght: 800, upper: false, tracking: -0.01, sizes: [84, 80, 76, 72], color: C.white, align: 'center', t: tE - 0.1, reveal: 'lines', d: 0.42 });
  e += U.html;
  const yR = yU + U.size * 0.98 + 16;
  e += gh.kicker(ctx, { id: 'role', text: 'Partner a informační sponzor', x: L, y: yR, w: CW, size: 30, color: 'rgba(233,230,226,.86)', align: 'center', t: tE + 0.06, track: 0.18, stagger: 0.008 });
  e += gh.pill(ctx, { id: 'prz', text: 'Věnuje hlavní cenu · MČR 2026', cx: W / 2, y: yR + 60, t: tE + 0.16, size: 28 });
  html += fx.scene(ctx, 'sE', tE, END, e, { outD: 0.001 });
  fx.flash(ctx, tE, { id: 'fe', color: '#cfe3ec', peak: 0.08, d: 0.2, blend: 'screen' });

  // ================= kinetic type (VO-synced) =================
  // 1 · HLAVNÍ CENA / PRO VÍTĚZE MČR  (0.25 – 2.36)
  // on screen from the downbeat frame (hard cut on the kick; VO „Hlavní“ follows at 0.25 s): settle instead of a mask reveal
  const T1 = fx.headline(ctx, { id: 't1', text: 'Hlavní cena', x: L, y: T0, w: CW, maxLines: 1, font: 'Inter', wght: 800, upper: true, tracking: -0.01, sizes: [156, 148, 140, 132, 124, 116], color: C.white });
  html += T1.html;
  // settle on the container (scaling the inner span clipped the last „A“ against the line mask)
  ctx.tl.set(ctx.sel('t1'), { transformOrigin: '0% 50%' }, 0);
  ctx.tl.fromTo(ctx.sel('t1'), { scale: 1.05 }, { scale: 1, duration: 0.5, ease: 'expo.out' }, 0);
  const y1b = T0 + T1.size * 0.98 + 20;
  html += gh.words(ctx, { id: 't1b', x: L, y: y1b, size: 50, wght: 700, track: 0.16, words: [{ w: 'pro', t: v('pro', 0.9) - 0.08 }, { w: 'vítěze', t: v('vítěze', 1.12) - 0.08 }, { w: 'MČR', t: v('MČR', 1.75) - 0.1, c: C.orange }] });
  const o1 = Math.min(tB + ctx.BEAT * 1.6, v('stojan', 2.79) - 0.22);
  gh.out(ctx, `${ctx.sel('t1')}, ${ctx.sel('t1b')}`, o1, { d: 0.26, y: -36 });
  // 2 · STOJAN NA PRUTY / REVOLUT 8  (2.79 – 4.2) — the 8 rolls in and lands on „osm“
  const tK2 = v('stojan', 2.79) - 0.08, tR = v('Revolut', 3.32) - 0.14, t8v = v('8', 3.9);
  html += gh.kicker(ctx, { id: 'k2', text: 'Stojan na pruty', x: L, y: T0, size: 34, t: tK2 });
  const sR = ctx.fit('Revolut 8', { font: 'Inter', wght: 800, upper: true, tracking: -0.01, maxW: CW, maxLines: 1, sizes: [176, 168, 160, 150, 140] }).size;
  const yR2 = T0 + 52;
  const R = fx.headline(ctx, { id: 'rv', text: 'Revolut', x: L, y: yR2, w: CW, maxLines: 1, font: 'Inter', wght: 800, upper: true, tracking: -0.01, size: sR, color: C.white, t: tR, reveal: 'lines', d: 0.5 });
  html += R.html;
  const x8 = L + ctx.measure('Revolut ', { font: 'Inter', wght: 800, size: sR, upper: true, tracking: -0.01 });
  // the orange 8: same headline machinery as REVOLUT (same y / size / line box → same baseline; the odometer sat ~35 px low and
  // leaked a sliver of the next digit), rises out of the mask just before „osm“ and punches on the word
  const R8 = fx.headline(ctx, { id: 'o8', text: '8', x: x8, y: yR2, w: sR, maxLines: 1, font: 'Inter', wght: 800, upper: true, tracking: -0.01, size: sR, color: C.orange, t: t8v - 0.16, reveal: 'lines', d: 0.4 });
  html += R8.html;
  ctx.tl.set(ctx.sel('o8'), { transformOrigin: '30% 80%' }, 0);
  fx.punch(ctx, ctx.sel('o8'), t8v + 0.02, { scale: 1.1, d: 0.3 });
  const o2 = Math.max(t8v + 0.45, v('Gausse', 4.56) - 0.3);
  gh.out(ctx, `${ctx.sel('k2')}, ${ctx.sel('rv')}`, o2, { d: 0.24, y: -36 });
  ctx.tl.fromTo(ctx.sel('o8'), { opacity: 1 }, { opacity: 0, duration: 0.24, ease: 'power3.in' }, o2);
  // 3 · GAUSSE HOLLER / CUSTOM LAB (4.56 – 5.96) → stays over the colourways; RUČNĚ STAVĚNO V ČESKU (crafted line, Cormorant)
  const tG = v('Gausse', 4.56) - 0.08, tCL = v('Custom', 5.24) - 0.08;
  const G = fx.headline(ctx, { id: 'gn', text: 'Gausse Holler', x: L, y: T0, w: CW, maxLines: 1, font: 'Inter', wght: 800, upper: true, tracking: -0.01, sizes: [120, 112, 106, 100, 94, 88], color: C.white, t: tG, reveal: 'chars', stagger: 0.022, d: 0.45 });
  html += G.html;
  html += gh.kicker(ctx, { id: 'cl', text: 'Custom Lab', x: L + 4, y: T0 + G.size * 0.98 + 14, size: 36, t: tCL, stagger: 0.03 });
  html += gh.words(ctx, { id: 'cz', x: L, y: 1376, w: CW, align: 'center', font: 'Cormorant Garamond', wght: 600, size: 62, track: 0.06, color: C.bone, words: [{ w: 'Ručně', t: tD + 0.1 }, { w: 'stavěno', t: tD + 0.2 }, { w: 'v Česku', t: tD + 0.3 }] });
  gh.out(ctx, `${ctx.sel('gn')}, ${ctx.sel('cl')}, ${ctx.sel('cz')}`, tE - 0.22, { d: 0.2, y: -30 });

  // ================= transitions =================
  fx.tIn(ctx, 'cut');                                         // Bosset wipes up in our graphite → hard cut on the downbeat
  // the finale opens on white (zoom-through, its tIn expects white); in the Reel our own end card follows → graphite, hard cut
  // into a ready lockup. 0.34 s (was 0.45) keeps the lockup clean ≥ 1.2 s.
  const toSelf = ctx.next && ctx.next.key === ctx.key;
  fx.tOut(ctx, 'zoom', { d: 0.34, color: toSelf ? C.bg : '#ffffff' });

  const css = `${gh.CSS(S)}
${S} #${ctx.id('tv-im')}{filter:drop-shadow(26px 38px 30px rgba(0,0,0,.72))}
${S} .gh-grid{background-image:linear-gradient(rgba(127,178,199,.10) 1px,transparent 1px),linear-gradient(90deg,rgba(127,178,199,.10) 1px,transparent 1px);background-size:90px 90px;background-position:-36px -10px;-webkit-mask-image:linear-gradient(180deg,transparent 18%,#000 40%,#000 72%,transparent 96%);mask-image:linear-gradient(180deg,transparent 18%,#000 40%,#000 72%,transparent 96%)}`;
  return { html, css };
}

// ---------- Reel hook (1 bar): colourway drop — the stand swaps colour + the whole field on every 8th, lands on the Black ----------
// Frame 0 already sells: headline + both lines are on screen at t = 0 (settle, no mask reveal — that showed sliced letter bottoms).
export function hook(ctx) {
  gh.stage(ctx);
  const { W, S } = ctx, L = ctx.safe.left, CW = W - L - ctx.safe.right;
  const E8 = eighths(ctx, 0), times = E8.slice(0, 7), tBk = E8[7];
  let html = fx.field(ctx, { kind: 'radial', c1: '#1c2126', c2: C.bg, at: '50% 55%' });
  html += `<div class="fx-abs" id="${ctx.id('tint')}" style="left:-260px;top:300px;width:1600px;height:1600px;border-radius:50%;background:radial-gradient(closest-side,currentColor,transparent);color:${COLS[0].glow};opacity:.62"></div>`;
  const ST = gh.stack(ctx, { id: 'hcw', w: 640, cx: 560, floor: 1440, times });
  const FA = gh.foot('cw', ST);
  html += gh.floor(ctx, { id: 'hfl', y: FA.back - 70 });
  html += `<div class="fx-full" id="${ctx.id('hga')}">${gh.footShadow(ctx, { id: 'hsa', F: FA, ao: 0.55 })}${ST.html}</div>`;
  times.forEach((t, i) => { if (i) ctx.tl.set(ctx.sel('tint'), { color: COLS[i].glow }, t); fx.punch(ctx, ST.cam, t, { scale: 1.04, d: 0.18 }); });
  ctx.tl.set(ctx.sel('hga'), { transformOrigin: `${px(FA.x)} ${px(FA.y)}` }, 0);
  ctx.tl.fromTo(ctx.sel('hga'), { scale: 1.1 }, { scale: 1, duration: 0.5, ease: 'expo.out' }, 0);
  ctx.tl.set(ctx.sel('hga'), { opacity: 0 }, tBk);
  // last 8th: the Black lands on the same floor spot (graphite field, orange glint on the cap)
  const bw = 600, BK = gh.prod(ctx, { id: 'hbk', k: IMG.threeq, w: bw, cx: FA.x - (FOOT.threeq.cx - 0.5) * bw, top: FA.y - FOOT.threeq.cy * bw, sweepOpacity: 0.6 });
  const FB = gh.foot('threeq', BK);
  html += `<div class="fx-full" id="${ctx.id('hgb')}" style="opacity:0">${gh.footShadow(ctx, { id: 'hsb', F: FB })}${BK.html}</div>`;
  ctx.tl.set(ctx.sel('hgb'), { opacity: 1 }, tBk);
  ctx.tl.set(ctx.sel('tint'), { color: '#3a424a' }, tBk);
  html += gh.glint(ctx, { id: 'hgl', x: BK.x + 0.505 * BK.w, y: BK.y + 0.068 * BK.h, size: 280, t: tBk + 0.01, d: Math.max(0.12, ctx.dur - tBk - 0.03), color: '#ffd8bd' });
  const H = fx.headline(ctx, { id: 'hh', text: meta.hook.headline, x: L, y: 400, w: CW, maxLines: 1, font: 'Inter', wght: 800, upper: true, tracking: -0.01, sizes: [156, 148, 140, 132, 124], color: C.white });
  html += H.html;
  ctx.tl.set(ctx.sel('hh'), { transformOrigin: '0% 50%' }, 0);
  ctx.tl.fromTo(ctx.sel('hh'), { scale: 1.05 }, { scale: 1, duration: 0.45, ease: 'expo.out' }, 0);
  const y2 = 400 + H.size * 0.98 + 18;
  html += gh.kicker(ctx, { id: 'hs', text: meta.hook.sub, x: L, y: y2, size: 40, wght: 700, track: 0.12, color: C.white });
  html += gh.kicker(ctx, { id: 'hk', text: 'Stojan Revolut 8 · Gausse Holler', x: L, y: y2 + 62, size: 30 });
  ctx.tl.fromTo(`${ctx.sel('hs')}, ${ctx.sel('hk')}`, { x: 22 }, { x: 0, duration: 0.5, ease: 'expo.out' }, 0);
  fx.tIn(ctx, 'cut');
  const css = gh.CSS(S);
  return { html, css };
}

// ---------- Reel end card (2 bars): TA plate hero ×1.5, GH logo (ring turns, ≤ TA), URL, partner line, prize pill, the prize on its plinth
// + two family stands. Hard cut from the block's graphite zoom-through; the TA plate flies over that zoom (from −0.42 s) and lands
// on the downbeat, so frame 1 of the end card is the finished lockup (was: white flash + 0.5 s of an empty set).
export function endCard(ctx) {
  gh.stage(ctx);
  const { W, S } = ctx, L = ctx.safe.left, CW = W - L - ctx.safe.right, END = ctx.dur, M = meta.endCard;
  const scale = 1.5, FLY = 0.42;
  const P = ctx.plate.hero(-FLY, END, { scale, cx: W / 2, cy: 455, fly: FLY, ease: 'power3.inOut' });
  // products: hero on a plinth in its own perspective + two family stands behind, all grounded
  const HX = gh.prod(ctx, { id: 'hx', k: IMG.threeq, w: 380, cx: 540, top: 1098, sweepOpacity: 0.6 });
  const FX = gh.foot('threeq', HX), PLX = gh.plinth(ctx, { id: 'xpod', F: FX, h: 64 });
  let html = fx.field(ctx, { kind: 'radial', c1: '#1c2126', c2: C.bg, at: '50% 60%' });
  html += gh.cone(ctx, { id: 'xcone', x: 540, top: 700, wTop: 280, wBot: 1000, h: 1300, a: 0.1 });
  html += gh.pool(ctx, { id: 'xglow', x: 540, y: 1280, w: 1000, h: 700, color: '#30373e' });
  html += gh.floor(ctx, { id: 'xfl', y: PLX.top - 60 });
  const famF = 1346;                                   // handles clear the prize pill
  const fam = [gh.still(ctx, { id: 'x1', k: IMG.never, w: 200, cx: 190, floor: famF, style: 'filter:brightness(.72) blur(.5px)' }), gh.still(ctx, { id: 'x2', k: IMG.bw, w: 200, cx: 890, floor: famF, style: 'filter:brightness(.72) blur(.5px)' })];
  html += gh.blots(ctx, { id: 'xfsh', list: fam.map((s, i) => ({ x: i ? 890 : 190, y: famF - 2, rx: s.w * 0.46, ry: s.w * 0.1 })) }) + fam.map((s) => s.html).join('');
  html += `<div class="fx-full" id="${ctx.id('xgrp')}">${PLX.html}${gh.footShadow(ctx, { id: 'xsh', F: FX })}${HX.html}</div>`;
  ctx.tl.fromTo(ctx.sel('xgrp'), { y: 26 }, { y: 0, duration: 0.7, ease: 'expo.out' }, 0);
  fam.forEach((s, i) => ctx.tl.fromTo(s.sel, { x: (i ? 1 : -1) * 36 }, { x: 0, duration: 0.8, ease: 'expo.out' }, 0));
  fx.sweep(ctx, 'hx', 0.5, { d: 0.9 });
  // lockup — everything on screen from frame 1
  let y = P.y + P.h + 30;
  html += gh.kicker(ctx, { id: 'xl', text: M.line, x: L, y, w: CW, size: 32, wght: 600, track: 0.12, color: 'rgba(233,230,226,.92)', align: 'center' });
  y += 38 + 20;
  html += `<div class="fx-abs" id="${ctx.id('xbar')}" style="left:${W / 2 - 60}px;top:${y}px;width:120px;height:5px;border-radius:3px;background:${C.orange}"></div>`;
  y += 5 + 24;
  const Mk = gh.mark(ctx, { id: 'xmk', cx: W / 2, y, box: [400, 400], scale, at: [0, END], label: `${ctx.cid} end card` });
  html += Mk.html;
  ctx.tl.fromTo(Mk.ring, { rotation: -60 }, { rotation: 60, duration: END, ease: 'power2.out' }, 0);
  y += Mk.h + 18;
  const U = fx.headline(ctx, { id: 'xu', text: ctx.data.url || 'gausseholler.com', x: L, y, w: CW, maxLines: 1, font: 'Inter', wght: 800, upper: false, tracking: -0.01, sizes: [92, 88, 84, 80], color: C.white, align: 'center' });
  html += U.html;
  y += U.size * 0.98 + 24;
  html += gh.pill(ctx, { id: 'xp', text: 'Věnuje hlavní cenu · MČR 2026', cx: W / 2, y, t: null, size: 28 });
  fx.tIn(ctx, 'cut');
  return { html, css: gh.CSS(S) };
}
