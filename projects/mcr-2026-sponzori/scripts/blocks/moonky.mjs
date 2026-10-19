// MOONKY · plan A bars 24–28 (5 bars ≈ 9.17 s) · concept A „MOONLIGHT MACRO" (research/moonky_ad.md §5, recommended)
// Brand world: Moonky night navy #0E1424 + white logo, moonky.cz web blue #6883BA as cold moonlight, lime #9CC903 (Savory C06) as the accent,
// Exo 2 900 italic caps (moonky.cz headings) + Source Sans 3 (moonky.cz body). The only light is the moon; it waxes one phase per bar.
// Products: own-brand handmade soft lures, clean cut-outs assets_prep/moonky/ads/ (H1 = 4k Gamer Big).
//
//   bar 0  MACRO      Gamer Big DC03 at ~1:1 (segments + the three „legs"), slam on the downbeat, moonlight sweep · „RUČNĚ DĚLANÉ" (VO)
//   bar 1  PULL-BACK  the same native image pulls back to the whole lure, 3D tilt, contact shadow · glass spec row
//                     GAMER BIG 46 mm | 2,12 g | EXTRA MĚKKÁ · „GUMOVÉ NÁSTRAHY" → „PRO TROUT AREA" (VO)
//   bar 2  COLOURWAY  Gamer Big thrown out left, Savory C06 slams in on the downbeat, then beat/half-beat cuts C01 → C02 → C03 → C04 → DC03, scene tinted by each colour,
//                     colour code flips · „VYVÍJENÉ A TESTOVANÉ" (VO)
//   bar 3  ORBIT      assortment: 12 lures (8 models) bloom out of the moon into a tilted 3D carousel ring that orbits it, moonlight
//                     chases round the ring · „S ČESKOU REPREZENTACÍ" (VO) · glass row FORMY Vlastní CNC | VÝROBA Ručně v ČR
//   bar 4  LOCKUP     full moon, Gamer Big hero, logo (≤ TA logo) travels from its corner into the lockup + HANDMADE LURES,
//                     moonky.cz, „Věnuje ceny · MČR 2026"; exit = moon iris in the next block's colour
//
// Facts (research/moonky.md › Verification, research/moonky_ad.md §4): ručně dělané gumové nástrahy pro Trout Area, vyvíjené a testované
// s českou reprezentací, vlastní CNC formy, ruční výroba · ČR, Gamer Big 46 mm · 2,12 g · extra měkká, Savory 43 mm · 1,05 g.
// Not used: „nejlepší", „8 let", counts of colours / items, Jigovky.cz jig heads (resold, other partner), a name for S12.
import * as fx from '../lib/fx.mjs';
import * as M from '../lib/fx_moonky.mjs';

const { C } = M;
export const fonts = {
  'Exo 2': { v: 'exo-2-{r}-wght-normal', vi: 'exo-2-{r}-wght-italic', weight: '100 900', axes: ['wght'], use: 'Moonky display (moonky.cz headings) — @fontsource-variable/exo-2 5.3.0, OFL' },
  'Source Sans 3': { v: 'source-sans-3-{r}-wght-normal', vi: 'source-sans-3-{r}-wght-italic', weight: '200 900', axes: ['wght'], use: 'Moonky text (moonky.cz body) — @fontsource-variable/source-sans-3 5.3.1, OFL' },
};
export const theme = { bg: C.night, bg2: '#1B2742', fg: '#FFFFFF', accent: C.lime, accent2: C.moonlight, font: { display: 'Exo 2', text: 'Source Sans 3' }, wght: 900, upper: true, light: false };
export const meta = {
  reel: true,
  hook: { product: M.src('h1'), headline: 'Ručně dělané. Pro Trout Area.', sub: 'moonky.cz' },   // custom hook() below
  endCard: { logo: 'on_dark', line: 'Partner MČR v Trout Area 2026' },                            // custom endCard() below
};

const MO = { cx: 540, cy: 930, r: 240 };                 // the moon (light source, orbit centre, lockup centre)
const PHASE = [0.42, 0.82, 1.18, 1.58, 2.3];             // waxing per bar (0 new … 2.3 full)
const SAV = ['h2', 's1', 's2', 's3', 's4', 's5'];        // Savory colourway run (bar 2)
const RING = ['h1', 's6', 'h2', 's10', 'h3', 's11', 's7', 's12', 's1', 's8', 's9', 's5'];   // orbit (bar 3): Gamer Big ×2, Savory ×3, Scelet, Scelet Jr., Coccon ×2, Coccon Jr., Master, (category lure)
const ECRING = ['s7', 'h2', 's11', 's8', 'h1', 's6', 's9', 's1', 'h3', 's5'];
// macro point of H1 (back segments + the three „legs", native-PNG fraction) and where it sits on screen in bar 0 (block) / at the hook's cut
const MACRO = { u: 1700 / 2544, v: 420 / 1006, x: 540, y: 1010 };

// H1 is staged at its native 2544 px (macro ≈ 1:1); must run before any ctx.dims() of it in this process
function stage(ctx) { ctx.asset(M.src('h1'), { maxSide: 2560 }); }
const px = (n) => `${Math.round(n * 10) / 10}px`;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export default function moonky(ctx) {
  stage(ctx);
  const { bar, W } = ctx, L = ctx.safe.left, R = W - ctx.safe.right, UIR = W - ctx.safe.uiRight;
  const B1 = bar(1), B2 = bar(2), B3 = bar(3), B4 = bar(4), END = ctx.dur, BT = ctx.BEAT;
  const beatAfter = (t) => ctx.beats.find((b) => b > t + 1e-3) ?? t + BT;
  // VO word times (block-local; fallbacks = take 3) — type lands ~0.06 s before the word, clamped into its bar
  const vw = (re, d) => { const w = ctx.vo.words.find((x) => re.test(x.w)); return w ? w.t0 : d; };
  const E = 0.06;
  const tName = vw(/^moonky/i, 0.25), tRuc = vw(/^ručně/i, 1.09), tDel = vw(/^dělané/i, 1.49), tGum = vw(/^gumové/i, 1.9), tNas = vw(/^nástrahy/i, 2.4);
  const tPro = vw(/^pro$/i, 3.08), tTrout = vw(/^trout/i, 3.26), tArea = vw(/^area/i, 3.68), tVyv = vw(/^vyvíjené/i, 4.61), tA = vw(/^a$/i, 5.24);
  const tS = vw(/^s$/i, 5.96), tRep = vw(/^reprezentac/i, 6.53);
  let html = '';

  // ===================================================================================================
  // WORLD: night sky, stars, the moon (waxes one phase per downbeat, glow breathes on the hits)
  // ===================================================================================================
  html += fx.field(ctx, { id: 'bg', bg: M.WORLD });
  html += M.stars(ctx, { id: 'st' });
  html += M.moon(ctx, { id: 'mn', ...MO, ph: PHASE[0], glow: 0.5 });
  [B1, B2, B3, B4].forEach((t, i) => M.phase(ctx, 'mn', t - 0.04, PHASE[i], PHASE[i + 1], { r: MO.r, d: 0.6 }));
  ctx.tl.fromTo(ctx.sel('mn-g'), { opacity: 0.5 }, { opacity: 0.66, duration: 0.8, ease: 'power2.out' }, 0);
  ctx.tl.fromTo(ctx.sel('mn-g'), { opacity: 0.66 }, { opacity: 0.85, duration: 0.7, ease: 'power2.out' }, B4 - 0.04);
  [B2, B3, B4].forEach((t) => ctx.tl.hit(ctx.sel('mn-d'), { scale: 1.035 }, { scale: 1, duration: 0.45, ease: 'power2.out' }, t));
  // colour tint of the scene (bar 2: each Savory colour washes the night ~20 %)
  html += `<div class="fx-glow" id="${ctx.id('tint')}" style="left:${px(MO.cx - 620)};top:${px(MO.cy - 620)};width:1240px;height:1240px;background:radial-gradient(closest-side,currentColor,transparent);color:${C.lime};opacity:0"></div>`;

  // (CD review: the soft lime Savory „depth" layer behind the hero in bar 1 read as a green smudge, not as bokeh → removed;
  //  bar 2 now opens with throw / slam: Gamer Big is thrown out left, Savory C06 slams in opaque on the downbeat)

  // ===================================================================================================
  // BAR 0–1 · MACRO → PULL-BACK (one native 2544 px image; the camera only scales down — no soft upscale)
  // ===================================================================================================
  const A = MACRO;                                          // macro point: back segments + the three „legs" (native px)
  const HX = MACRO.x, HY = MACRO.y, sM = 0.95;
  const P1 = M.lure(ctx, { id: 'h1', k: 'h1', len: 2406 * sM, anchor: { ...A, x: HX, y: HY }, angle: null, ground: 'float', shadow: 0.6, sweepOpacity: 0.82, maxUp: 1.02 });
  html += P1.html;
  const sF = 880 / 2406, kF = sF / sM;                     // full shot: visible lure 880 px
  const cen = M.LURES.h1.cen, wF = 2544 * sF, hF = 1006 * sF;
  const Hf = [540 + (A.u - cen[0]) * wF, 958 + (A.v - cen[1]) * hF];
  ctx.tl.set(P1.cam, { transformOrigin: `${px(A.u * P1.w)} ${px(A.v * P1.h)}` }, 0);
  ctx.tl.fromTo(P1.cam, { scale: 1.13, x: 0, y: 0 }, { scale: 1, x: 0, y: 0, duration: 0.55, ease: 'expo.out' }, 0);            // slam on the downbeat
  ctx.tl.fromTo(P1.cam, { scale: 1, x: 0, y: 0 }, { scale: 1.05, x: -20, y: 0, duration: B1 - 0.6, ease: 'sine.inOut' }, 0.55);  // slow macro push
  ctx.tl.fromTo(P1.cam, { scale: 1.05, x: -20, y: 0 }, { scale: kF, x: Hf[0] - HX, y: Hf[1] - HY, duration: 0.88, ease: 'expo.inOut' }, B1 - 0.05);
  ctx.tl.fromTo(ctx.sel('h1-sh'), { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power1.out' }, B1 + 0.6);
  ctx.tl.fromTo(ctx.sel('h1-tl'), { rotationY: 0, rotationX: 0 }, { rotationY: 11, rotationX: -3, duration: B2 - 0.4 - (B1 + 0.8), ease: 'sine.inOut' }, B1 + 0.8);
  fx.sweep(ctx, 'h1', 0.3, { d: 0.95 });
  fx.sweep(ctx, 'h1', B1 + 0.9, { d: 0.75 });
  // thrown out of frame to the left into the bar-2 downbeat
  ctx.tl.fromTo(P1.sel, { x: 0, opacity: 1 }, { x: -1250, opacity: 0.2, duration: 0.34, ease: 'power3.in' }, B2 - 0.36);
  ctx.tl.set(P1.sel, { opacity: 0 }, B2 - 0.01);

  // ===================================================================================================
  // BAR 2 · SAVORY COLOURWAY (same place, same light, cut on the beat / half-beat)
  // ===================================================================================================
  const half = (a, b) => a + (b - a) / 2;
  const bb = [B2, beatAfter(B2), beatAfter(beatAfter(B2)), beatAfter(beatAfter(beatAfter(B2)))];   // 3.669 · 4.133 · 4.574 · 5.039
  const cuts = [B2, bb[1], half(bb[1], bb[2]), bb[2], half(bb[2], bb[3]), bb[3]];
  const SC = { cx: 540, cy: 958, len: 860 };
  html += `<i class="fx-prod-shadow" id="${ctx.id('svsh')}" style="left:${px(SC.cx - 330)};top:${px(SC.cy + 150)};width:660px;height:44px;--sho:.6;filter:blur(14px);opacity:0"></i>`;
  ctx.tl.fromTo(ctx.sel('svsh'), { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power1.out' }, B2 - 0.05);
  ctx.tl.fromTo(ctx.sel('svsh'), { opacity: 1 }, { opacity: 0, duration: 0.2, ease: 'power1.in' }, B3 - 0.24);
  SAV.forEach((k, i) => {
    const P = M.lure(ctx, { id: `sv${i}`, k, len: SC.len, cx: SC.cx, cy: SC.cy, angle: -5, ground: 'none', sweepOpacity: k === 's4' ? 0.85 : 0.6 });
    html += P.html;
    const t = cuts[i];
    if (i === 0) {   // slam: fully opaque from 2 frames before the downbeat, scale settles (never half-transparent on the hit)
      ctx.tl.set(P.sel, { opacity: 0 }, 0); ctx.tl.set(P.sel, { opacity: 1 }, t - 0.06);
      ctx.tl.fromTo(P.sel, { scale: 1.24 }, { scale: 1, duration: 0.42, ease: 'expo.out' }, t - 0.06);
    } else { ctx.tl.set(P.sel, { opacity: 0 }, 0); ctx.tl.set(P.sel, { opacity: 1 }, t); }
    if (i < SAV.length - 1) ctx.tl.set(P.sel, { opacity: 0 }, cuts[i + 1]);
    if (i) ctx.tl.hit(P.cam, { scale: 1.08, x: i % 2 ? 46 : -46 }, { scale: 1, x: 0, duration: 0.3, ease: 'expo.out' }, t);
    fx.sweep(ctx, `sv${i}`, t + 0.02, { d: i ? 0.3 : 0.6 });
    ctx.tl.set(ctx.sel('tint'), { color: M.LURES[k].dom[0] || C.lime }, i ? t : 0);
    if (i === SAV.length - 1) {   // the last colour shrinks into the moon as the orbit blooms — gone BEFORE the bar-3 downbeat (no ghost on the hit)
      ctx.tl.fromTo(P.sel, { scale: 1, opacity: 1 }, { scale: 0.25, opacity: 0, duration: 0.22, ease: 'power3.in' }, B3 - 0.29);
    }
  });
  ctx.tl.fromTo(ctx.sel('tint'), { opacity: 0 }, { opacity: 0.3, duration: 0.3, ease: 'power1.out' }, B2 - 0.06);
  ctx.tl.fromTo(ctx.sel('tint'), { opacity: 0.3 }, { opacity: 0, duration: 0.3, ease: 'power1.in' }, B3 - 0.2);
  // colour code flip (lower lane) + model line
  {
    const y0 = 1236, LH = 74;
    const names = SAV.map((k) => `${M.LURES[k].code} · ${M.LURES[k].col}`);
    const col = names.map((n, i) => `<div style="height:${LH}px;display:flex;align-items:center;gap:22px"><i style="display:block;width:30px;height:30px;border-radius:50%;flex-shrink:0;background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.6),rgba(255,255,255,0) 50%),${M.LURES[SAV[i]].dom[0]};box-shadow:0 0 0 2px rgba(255,255,255,.35)"></i><span style="${M.FD};font-weight:800;font-style:italic;font-size:54px;letter-spacing:-.005em;color:#fff;text-transform:uppercase;white-space:nowrap">${ctx.esc(ctx.nb(n))}</span></div>`).join('');
    html += `<div class="mk-lbl" id="${ctx.id('svk')}" style="left:${L + 4}px;top:${y0}px;${M.FT};font-weight:700;font-size:30px;letter-spacing:.2em;text-transform:none;color:${C.lime}">${ctx.esc(ctx.nb('SAVORY · 43 mm · 1,05 g'))}</div>`;
    html += `<div class="mk-flip" id="${ctx.id('svf')}" style="left:${L}px;top:${y0 + 44}px;width:${UIR - L}px;height:${LH}px"><div class="fx-abs" id="${ctx.id('svfc')}" style="left:0;top:0;width:100%">${col}</div></div>`;
    ctx.tl.fromTo(ctx.sel('svk'), { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.45, ease: 'expo.out' }, B2 + 0.02);
    ctx.tl.fromTo(ctx.sel('svf'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.45, ease: 'expo.out' }, B2 + 0.06);
    cuts.slice(1).forEach((t, i) => ctx.tl.fromTo(ctx.sel('svfc'), { y: -i * LH }, { y: -(i + 1) * LH, duration: 0.2, ease: 'expo.out' }, t - 0.02));
    for (const s of ['svk', 'svf']) ctx.tl.fromTo(ctx.sel(s), { opacity: 1 }, { opacity: 0, duration: 0.2, ease: 'power1.in' }, B3 - 0.24);
  }

  // ===================================================================================================
  // BAR 3 · ORBIT — 12 lures bloom out of the moon into a tilted 3D ring that orbits it (assortment moment)
  // ===================================================================================================
  const O = M.orbit(ctx, { id: 'orb', items: RING, cx: MO.cx, cy: MO.cy + 14, R: 336, tilt: 63, len: 212, persp: 1500, phi0: 90 });
  html += O.html;
  // the moon steps back while the ring orbits it, returns full-size for the lockup
  ctx.tl.set(ctx.sel('mn'), { transformOrigin: `${MO.cx}px ${MO.cy}px` }, 0);
  ctx.tl.fromTo(ctx.sel('mn'), { scale: 1 }, { scale: 0.8, duration: 0.7, ease: 'expo.out' }, B3 - 0.26);
  ctx.tl.fromTo(ctx.sel('mn'), { scale: 0.8 }, { scale: 1, duration: 0.6, ease: 'expo.out' }, B4 - 0.1);
  const tB = B3 - 0.26;
  for (let i = 0; i < O.n; i++) ctx.tl.fromTo(O.pop(i), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'expo.out' }, tB + i * 0.014);
  M.orbitSpin(ctx, O, tB, -85, 0, { d: 1.1, ease: 'expo.out' });
  M.orbitSpin(ctx, O, tB + 1.1, 0, 20, { d: B4 - 0.3 - (tB + 1.1), ease: 'none' });
  for (let i = 0; i < O.n; i++) fx.sweep(ctx, `orb-p${i}`, B3 + 0.5 + i * 0.07, { d: 0.42 });
  ctx.tl.hit(O.sel, { scale: 1.035 }, { scale: 1, duration: 0.3, ease: 'power2.out' }, beatAfter(B3 + 0.2));
  ctx.tl.fromTo(O.sel, { scale: 1, opacity: 1 }, { scale: 2.5, opacity: 0, duration: 0.3, ease: 'power3.in' }, B4 - 0.3);   // flies past the camera
  // glass row: own CNC moulds · handmade in CZ
  const SB2 = M.specBar(ctx, { id: 'sb2', x: L, y: 1290, w: UIR - L, h: 128, cells: [{ label: 'Formy', value: 'Vlastní CNC' }, { label: 'Výroba', value: 'Ručně v ČR' }], t: B3 + 0.16, times: [B3 + 0.26, beatAfter(B3 + 0.2) + 0.02] });
  html += SB2.html;
  ctx.tl.fromTo(SB2.sel, { y: 0 }, { y: 40, duration: 0.24, ease: 'power2.in' }, B4 - 0.26);
  ctx.tl.fromTo(SB2.sel, { scaleX: 1, opacity: 1 }, { scaleX: 1, opacity: 0, duration: 0.22, ease: 'power1.in' }, B4 - 0.24);

  // ===================================================================================================
  // BAR 1 · glass spec row for the hero (Gamer Big DC03 product page: 46 mm · 2,12 g · extra měkká)
  // ===================================================================================================
  const tSb1 = B1 + 0.12;
  const SB1 = M.specBar(ctx, { id: 'sb1', x: L, y: 1290, w: UIR - L, h: 128, label: 'Gamer Big', cells: [{ value: '46 mm', w: 0.9 }, { value: '2,12 g', w: 0.95 }, { value: 'extra měkká', w: 1.5, upper: true, vs: 44 }], t: tSb1, times: [tSb1 + 0.1, tSb1 + 0.3, beatAfter(tSb1 + 0.3) - 0.04] });
  html += SB1.html;
  ctx.tl.fromTo(SB1.sel, { y: 0 }, { y: 40, duration: 0.24, ease: 'power2.in' }, B2 - 0.3);
  ctx.tl.fromTo(SB1.sel, { scaleX: 1, opacity: 1 }, { scaleX: 1, opacity: 0, duration: 0.22, ease: 'power1.in' }, B2 - 0.28);
  ctx.tl.fromTo(SB1.ksel, { opacity: 1 }, { opacity: 0, duration: 0.2, ease: 'power1.in' }, B2 - 0.3);

  // ===================================================================================================
  // BAR 4 · LOCKUP — Gamer Big hero in front of the full moon, logo + HANDMADE LURES, moonky.cz, prize pill
  // ===================================================================================================
  const tL = B4;
  const LK = M.lure(ctx, { id: 'lk', k: 'h1', len: 860, cx: 540, cy: MO.cy + 20, angle: -5, ground: 'float', shadow: 0.62, sweepOpacity: 0.85 });
  html += LK.html;
  ctx.tl.fromTo(LK.sel, { opacity: 0, scale: 1.55 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' }, tL - 0.2);
  ctx.tl.fromTo(LK.cam, { y: 0, rotation: 0 }, { y: -16, rotation: -1.2, duration: END - tL - 0.5, ease: 'sine.inOut' }, tL + 0.5);
  fx.sweep(ctx, 'lk', tL + BT * 0.9, { d: 0.85 });
  // logo: top-right bug from „Moonky", travels into the lockup at the bar-4 downbeat
  const LG = ctx.logo('on_dark', { box: [268, 80], at: [Math.max(0.1, tName - 0.05), END], id: 'logo' });
  const lgX = R - LG.w, lgY = Math.round(ctx.plate.rect.y + ctx.plate.rect.h / 2 - LG.h / 2);
  const lkX = Math.round(540 - LG.w / 2), lkY = 418;
  html += `<div class="fx-abs" id="${ctx.id('lw')}" style="left:${lgX}px;top:${lgY}px;width:${LG.w}px;height:${LG.h}px">${LG.html}</div>`;
  ctx.tl.fromTo(ctx.sel('lw'), { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.55, ease: 'expo.out' }, Math.max(0.1, tName - 0.05));
  // travels only after the bar-3 headline has left the top lane (the headline now holds to the downbeat)
  ctx.tl.fromTo(ctx.sel('lw'), { x: 0, y: 0 }, { x: lkX - lgX, y: lkY - lgY, duration: 0.6, ease: 'expo.inOut' }, tL - 0.02);
  // HANDMADE LURES (their packaging / banner subline) in Exo 2, wide tracking — 400 / 32 px so it survives a phone screen
  const hmY = lkY + LG.h + 26;
  html += `<div class="mk-lbl" id="${ctx.id('hm')}" style="left:0;width:${W}px;top:${hmY}px;text-align:center;${M.FD};font-weight:400;font-size:32px;letter-spacing:.46em;padding-left:.46em;color:rgba(255,255,255,.92)">Handmade lures</div>`;
  ctx.tl.fromTo(ctx.sel('hm'), { opacity: 0, scaleX: 1.3 }, { opacity: 1, scaleX: 1, duration: 0.7, ease: 'expo.out' }, tL + 0.4);
  // moonky.cz — lands right after the downbeat so the CTA holds ≥ 1.2 s before the iris reaches it
  const U = M.vtype(ctx, { id: 'url', lines: [{ text: ctx.data.url || 'moonky.cz', color: '#fff', wght: 800, sizes: [100, 96, 92], tracking: -0.01 }], times: [tL + 0.1], x: 64, y: 1196, w: W - 128, align: 'center', upper: false, d: 0.5 });
  html += U.html;
  // all partners give prizes (BRIEF 19. 10.)
  const PZ = M.pill(ctx, { id: 'pz', text: 'Věnuje ceny · MČR 2026', cx: 540, y: 1330, t: tL + 0.3 });
  html += PZ.html;

  // ===================================================================================================
  // HEADLINES (top lane, word-synced to the VO)
  // ===================================================================================================
  const HY0 = 404;
  // line 2 lands as one unit on „gumové" (per-word left „NÁSTRAHY" on screen < 0.5 s)
  const HA = M.vtype(ctx, { id: 'ha', y: HY0, lines: [{ text: 'Ručně dělané', sizes: [140, 132, 124, 116] }, { text: 'gumové nástrahy', color: C.lime, sizes: [104, 98, 92, 86, 80], gap: 0 }], gap: 8, times: [tRuc - E, tDel - E, tGum - E, tGum - E + 0.1] });
  html += HA.html;
  const tHAout = clamp(tPro - 0.24, B1 + 0.7, B2 - 0.7);
  M.vtypeOut(ctx, HA, tHAout, { d: 0.24 });
  const HC = M.vtype(ctx, { id: 'hc', y: HY0, lines: [{ text: 'pro', wght: 300, sizes: [84, 80, 76] }, { text: 'Trout Area', color: C.lime, sizes: [196, 184, 172, 160, 150] }], gap: 0, times: [Math.max(tHAout + 0.12, tPro - E), tTrout - E, Math.min(tArea - 0.2, B2 - 0.16)] });
  html += HC.html;
  ctx.tl.set(ctx.sel('hc-l1'), { transformOrigin: '0% 60%' }, 0);
  ctx.tl.hit(ctx.sel('hc-l1'), { scale: 1.05 }, { scale: 1, duration: 0.35, ease: 'power2.out' }, B2);
  const tHCout = clamp(tVyv - 0.3, B2 + 0.5, B3 - 0.8);
  M.vtypeOut(ctx, HC, tHCout, { d: 0.24 });
  // line 2 lands as one unit on „s" (per-word left „REPREZENTACÍ" readable ~0.1 s before the exit) and the line holds into the downbeat
  const HD = M.vtype(ctx, { id: 'hd', y: HY0, lines: [{ text: 'Vyvíjené a testované', sizes: [104, 96, 90, 84, 78] }, { text: 's českou reprezentací', color: C.lime, sizes: [104, 96, 90, 84, 78, 72] }], gap: 10, times: [Math.max(tHCout + 0.14, tVyv - E), tA - E, tS - E, tS - E + 0.1] });
  html += HD.html;
  M.vtypeOut(ctx, HD, B4 - 0.14, { d: 0.2, stagger: 0.02 });

  // ---------- light accents on the downbeats (moonlight, screen, ≤ 0.3) ----------
  fx.flash(ctx, 0, { id: 'fl0', color: C.moonlight, peak: 0.2, d: 0.4, blend: 'screen' });
  fx.flash(ctx, B3, { id: 'fl3', color: C.moonlight, peak: 0.12, d: 0.35, blend: 'screen' });

  // ---------- transitions: hard cut in (the macro slams on the downbeat), moon iris out in the next block's colour ----------
  // the iris opens on the bare moon face ABOVE the hero (from the moon centre it grew as a dark hole in the lure)
  M.irisOut(ctx, { cx: MO.cx, cy: MO.cy - 192, d: 0.46 });
  return { html, css: M.css(ctx) };
}

// ======================================================================================================
// REEL HOOK (1 bar): „RUČNĚ DĚLANÉ. PRO TROUT AREA." + Gamer Big in front of the full moon, two more lures land on the beats.
// Frame 1 already sells (headline on screen, settling 1.05 → 1). Last beat: speed-ramp push-in INTO the macro point, then a HARD CUT on the
// downbeat to the block's macro of the same point (match cut — no dip to navy).
// ======================================================================================================
export function hook(ctx) {
  stage(ctx);
  const END = ctx.dur;
  let html = fx.field(ctx, { id: 'bg', bg: M.WORLD });
  html += M.stars(ctx, { id: 'st', seed: 5 });
  html += M.moon(ctx, { id: 'mn', cx: 540, cy: 1020, r: 250, ph: 2.3, glow: 0.75 });
  const d1 = M.lure(ctx, { id: 'd1', k: 'h2', len: 460, cx: 300, cy: 1300, angle: -26, sweep: false });
  const d2 = M.lure(ctx, { id: 'd2', k: 's11', len: 420, cx: 790, cy: 770, angle: 18, sweep: false });
  html += `<div class="fx-abs" id="${ctx.id('dw')}" style="inset:0;filter:blur(2.5px) brightness(.9)">${d1.html}${d2.html}</div>`;
  const b1 = ctx.beats[1] ?? ctx.BEAT, b2 = ctx.beats[2] ?? ctx.BEAT * 2, b3 = ctx.beats[3] ?? ctx.BEAT * 3;
  ctx.tl.fromTo(d1.sel, { opacity: 0, x: -260, y: 60 }, { opacity: 1, x: 0, y: 0, duration: 0.45, ease: 'expo.out' }, b1 - 0.04);
  ctx.tl.fromTo(d2.sel, { opacity: 0, x: 260, y: -40 }, { opacity: 1, x: 0, y: 0, duration: 0.45, ease: 'expo.out' }, b2 - 0.04);
  // the two side lures fly past the lens with the push-in (parallax)
  ctx.tl.fromTo(d1.sel, { x: 0, y: 0 }, { x: -460, y: 140, duration: END - b3, ease: 'power2.in' }, b3);
  ctx.tl.fromTo(d2.sel, { x: 0, y: 0 }, { x: 480, y: 30, duration: END - b3, ease: 'power2.in' }, b3);   // sideways: never across the headline
  const P = M.lure(ctx, { id: 'hp', k: 'h1', len: 900, cx: 540, cy: 1030, angle: -6, ground: 'float', shadow: 0.6, sweepOpacity: 0.85 });
  html += P.html;
  ctx.tl.fromTo(P.sel, { scale: 1.3 }, { scale: 1, duration: 0.6, ease: 'expo.out' }, 0);
  // camera origin = the macro point (segments + legs); ramp into it and slide it onto the block's macro anchor (540, 1010)
  const [mx, my] = P.at(MACRO.u, MACRO.v);
  ctx.tl.set(P.cam, { transformOrigin: `${px(MACRO.u * P.w)} ${px(MACRO.v * P.h)}` }, 0);
  ctx.tl.fromTo(P.cam, { scale: 1, x: 0, y: 0 }, { scale: 1.05, x: 0, y: 0, duration: b3 - 0.6, ease: 'sine.inOut' }, 0.6);
  ctx.tl.fromTo(P.cam, { scale: 1.05, x: 0, y: 0 }, { scale: 1.75, x: MACRO.x - mx, y: MACRO.y - my, duration: END - b3, ease: 'fxRampIn' }, b3);
  fx.sweep(ctx, 'hp', 0.38, { d: 0.8 });
  const H = M.vtype(ctx, { id: 'h', y: 404, lines: [{ text: 'Ručně dělané.', sizes: [140, 132, 124, 116] }, { text: 'Pro Trout Area.', color: C.lime, sizes: [120, 112, 104, 98, 92] }], gap: 8, still: true });
  html += H.html;
  ctx.tl.set(H.sel, { transformOrigin: '50% 0%' }, 0);
  ctx.tl.fromTo(H.sel, { scale: 1.05 }, { scale: 1, duration: 0.6, ease: 'expo.out' }, 0);
  // hard cut on the downbeat into the block (cut in / cut out: handoff contract)
  return { html, css: M.css(ctx) };
}

// ======================================================================================================
// REEL END CARD (2 bars): TA plate hero ×1.5 + „Partner MČR v Trout Area 2026" + logo (≤ TA) + moonky.cz, the assortment orbiting the
// full moon below it, prize pill. The TA plate starts flying 0.42 s BEFORE the end card (over the block's moon iris) and lands on the
// downbeat, so frame 1 of the end card is the complete lockup (lesson Velká ryba / finale: the hit must not be an empty frame).
// ======================================================================================================
export function endCard(ctx) {
  stage(ctx);
  const END = ctx.dur, W = ctx.W, FLY = 0.42, SC = 1.5;
  let html = fx.field(ctx, { id: 'bg', bg: M.WORLD });
  html += M.stars(ctx, { id: 'st', seed: 9 });
  const EM = { cx: 540, cy: 1132, r: 168 };
  html += M.moon(ctx, { id: 'mn', ...EM, ph: 2.3, glow: 0.7, glowSize: 1100 });
  ctx.tl.set(ctx.sel('mn'), { transformOrigin: `${EM.cx}px ${EM.cy}px` }, 0);
  ctx.tl.fromTo(ctx.sel('mn'), { scale: 1.1 }, { scale: 1, duration: 0.7, ease: 'expo.out' }, 0);
  // the ring is complete and opaque on frame 1; it whips into place and keeps orbiting
  const O = M.orbit(ctx, { id: 'eo', items: ECRING, cx: EM.cx, cy: EM.cy + 10, R: 262, tilt: 72, len: 178, persp: 1300, phi0: 90, seed: 9 });
  html += O.html;
  for (let i = 0; i < O.n; i++) ctx.tl.fromTo(O.pop(i), { scale: 0.72 }, { scale: 1, duration: 0.6, ease: 'expo.out' }, 0);
  M.orbitSpin(ctx, O, 0.0, -70, 0, { d: 1.2, ease: 'expo.out' });
  M.orbitSpin(ctx, O, 1.21, 0, 26, { d: END - 1.21, ease: 'none' });
  for (let i = 0; i < O.n; i++) fx.sweep(ctx, `eo-p${i}`, ctx.beat(2) + i * 0.06, { d: 0.45 });
  // lockup (same geometry as fx.endCard at cy 760), complete on frame 1, settles with the hit
  const P = ctx.plate.hero(-FLY, END, { scale: SC, cx: W / 2, cy: 430, fly: FLY, ease: 'power3.inOut' });
  const LG = ctx.logo('on_dark', { box: [760, 300], scale: SC, at: [0, END], id: 'ec-logo', label: `${ctx.cid} end card` });
  const url = ctx.data.url || 'moonky.cz';
  const fU = ctx.fit(url, { font: 'Exo 2', wght: 800, italic: true, maxW: 900, maxLines: 1, sizes: [96, 88, 80, 72] });
  const gap = 46, yLine = Math.round(P.y + P.h + gap);
  const lock = `<div class="fx-ec" id="${ctx.id('ec')}" style="top:${yLine}px">
    <div style="${M.FT};font-weight:700;font-size:30px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.92)">${ctx.esc(ctx.nb(meta.endCard.line))}</div>
    <div id="${ctx.id('ec-bar')}" style="width:120px;height:6px;border-radius:3px;background:${C.lime};margin:${Math.round(gap * 0.7)}px 0"></div>
    <div>${LG.html}</div>
    <div style="margin-top:${gap}px;${M.FD};font-weight:800;font-style:italic;font-size:${fU.size}px;color:#fff;letter-spacing:-.01em;line-height:1">${ctx.esc(url)}</div>
  </div>`;
  html += lock;
  ctx.tl.set(ctx.sel('ec'), { transformOrigin: '50% 0%' }, 0);
  ctx.tl.fromTo(ctx.sel('ec'), { scale: 1.06 }, { scale: 1, duration: 0.55, ease: 'expo.out' }, 0);
  ctx.tl.fromTo(ctx.sel('ec-bar'), { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'expo.out' }, 0.02);
  const PZ = M.pill(ctx, { id: 'pz', text: 'Věnuje ceny · MČR 2026', cx: 540, y: 1372, t: ctx.beat(1) - 0.04 });
  html += PZ.html;
  ctx.report(`end card: plate ${Math.round(P.y)}–${Math.round(P.y + P.h)}, line ${yLine}, logo ${LG.w}×${LG.h} (TA ${Math.round(P.w)} px), pill 1372`);
  return { html, css: M.css(ctx) };
}
