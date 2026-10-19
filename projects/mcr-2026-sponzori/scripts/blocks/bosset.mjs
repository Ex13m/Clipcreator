// BOSSET.CZ · plan A bars 42–46 (5 bars ≈ 9.17 s) · concept A „termosky“ (research/bosset_ad.md, recommended) adapted to the take-3 VO
// „Bosset – rybářský e-shop i termosky, které udrží nápoj horký i studený až šest hodin.“  (VO from 0.25 s, ends ≈ 7.2 s)
// Brand world (research/bosset_ad.md §3): logo teal #1B97B1, derived deep teal #0A4A58, site header light blue #C5EBFC, site yellow #FFC500
// (only as plates/pills, never yellow text on teal), ink; display = Saira Expanded Black (wdth 125 / wght 900) ≈ the squarish BOSSET logo.
// Retailer: Keitech / Select / Fresh Lures / Decoy / YGK / Zojirushi are brands it SELLS (never „its“ products). Nothing about Zojirushi origin.
//   bar 0     slam: Keitech Easy Shiner (the shop's best-selling family) on a teal light beam, logo bug on „Bosset“;
//             on „rybářský“ the hero shrinks into the first card of an e-shop BENTO GRID — 8 products of 5 brands (Keitech ×3,
//             Select ×2, Fresh Lures, YGK X-Braid, Decoy) snap in on the 16ths; „E-SHOP“ yellow plate a beat later, grid punch on bar 1
//   bar 1     „i termosky“: the page SCROLLS (vertical motion blur) to the light-blue thermos section: 7 bottles rise into a V line-up,
//             TERMOSKY + „0,6 l · nerez · bez BPA“
//   bar 2     macro push-in on the open SM-SR lid: DOUBLE LOCK / otevřeš jednou rukou, then the set splits warm | cold on „horký“ / „studený“
//   bar 3     „až šest hodin“: SM-VB black hero, AŽ plate, a 760 px odometer 6, HODIN, HORKÉ I STUDENÉ
//   bar 4     lockup (music only): logo + bosset.cz + „Věnuje ceny · MČR 2026“ over the prize line-up → stacked wipe into the next block
// Reel: own hook (SM-VB black + „Horké i studené“ + AŽ 6 HODIN) and own end card (fx.endCard lockup + distributor line + Keitech cameo).
import fs from 'node:fs';
import path from 'node:path';
import * as fx from '../lib/fx.mjs';
import { ROOT } from '../lib/util.mjs';

const TEAL = '#1B97B1', DEEP = '#0A4A58', ABYSS = '#052E37', SKY = '#C5EBFC', YEL = '#FFC500', INK = '#080C0E';
const AD = 'assets_prep/bosset/ads/';
const PR = {
  H1: AD + 'H1_zojirushi_sm-vb_0-6l_black.png', H2: AD + 'H2_zojirushi_sm-sr_0-6l_green.png', H2m: AD + 'H2m_zojirushi_sm-sr_green_lid_open_macro.png',
  H3: AD + 'H3_keitech_easy_shiner_4in_ice_chartreuse_pal03t.png',
  S1: AD + 'S1_zojirushi_sm-she_0-6l_orange.png', S2: AD + 'S2_zojirushi_sm-sr_0-6l_pink.png', S3: AD + 'S3_zojirushi_sm-sr_0-6l_white.png',
  S4: AD + 'S4_zojirushi_sm-vb_0-6l_green.png', S5: AD + 'S5_zojirushi_sm-vb_0-6l_beige.png', S6: AD + 'S6_ygk_x-braid_upgrade_x8_150m.png',
  L1: AD + 'L1_keitech_easy_shiner_4-5in_lime_chartreuse_424t.png', L4: AD + 'L4_keitech_easy_shiner_4in_ua_limited_ea12t.png',
  L5: AD + 'L5_fresh_lures_flipworm_3-1in_122.png', L7: AD + 'L7_select_easy_shad_3in_280.png', L8: AD + 'L8_select_dementor_130sp_13.png',
  L9: AD + 'L9_decoy_round_magic_sv-52.png',
};

export const fonts = { Saira: { v: 'saira-{r}-wdth-normal', weight: '100 900', stretch: '50% 125%', axes: ['wght', 'wdth'], use: 'Bosset display (Saira Expanded Black ≈ the extended squarish BOSSET logo lettering), @fontsource-variable/saira 5.3.0, OFL' } };
export const theme = { bg: DEEP, bg2: TEAL, fg: '#ffffff', accent: YEL, accent2: SKY, font: { display: 'Saira', text: 'Saira' }, wght: 900, upper: true, light: false };
export const meta = {
  reel: true,
  hook: { product: PR.H1, headline: 'Horké i studené', sub: 'až 6 hodin' },
  endCard: { logo: 'on_dark', line: 'Partner MČR v Trout Area 2026' },
};

// transparent margins of the cut-outs (ads/manifest.json + ads/_lures_meta.json) → shadows / fits sit on the visible object
const PAD = {};
try { for (const f of JSON.parse(fs.readFileSync(path.join(ROOT, AD, 'manifest.json'), 'utf8')).files) PAD[path.basename(f.file)] = f.pad; } catch { /* defaults */ }
try { for (const [k, v] of Object.entries(JSON.parse(fs.readFileSync(path.join(ROOT, AD, '_lures_meta.json'), 'utf8')))) PAD[`${k}.png`] = v.pad; } catch { /* defaults */ }
const pad = (src) => PAD[path.basename(src)] || [0.02, 0.02, 0.02, 0.02];

const DISP = { font: 'Saira', wght: 900, wdth: 125, upper: true, tracking: 0 };
const line = (ctx, id, text, o) => fx.headline(ctx, { ...DISP, id, text, maxLines: 1, lh: 0.94, ...o });
const sz = (ctx, text, maxW, sizes, o = {}) => ctx.fit(ctx.nb(text), { ...DISP, ...o, maxW, maxLines: 1, sizes }).size;
const wOf = (ctx, text, size, o = {}) => ctx.measure(ctx.nb(text), { ...DISP, ...o, size });

const CSS = (S) => `
  ${S} .bs-pill{position:absolute}
  ${S} .bs-pill i{position:absolute;inset:0;display:block;border-radius:999px;transform-origin:0 50%}
  ${S} .bs-pill span{position:absolute;left:0;top:0;white-space:nowrap;text-transform:uppercase}
  ${S} .bs-slab{position:absolute}
  ${S} .bs-slab i{position:absolute;inset:0;display:block;border-radius:14px;transform-origin:0 50%}
  ${S} .bs-tile{position:absolute}
  ${S} .bs-card{position:absolute;inset:0;display:block;border-radius:28px;background:linear-gradient(165deg,#ffffff 0%,#eef9fe 55%,#d9f1fc 100%);box-shadow:0 20px 44px rgba(2,24,30,.38),inset 0 0 0 1.5px rgba(255,255,255,.9)}
  ${S} .bs-beam{position:absolute;transform:rotate(-12deg)}
  ${S} .bs-beam i{position:absolute;inset:0;display:block;transform-origin:100% 50%;-webkit-mask-image:linear-gradient(90deg,transparent 0%,#000 34%,#000 80%,transparent 100%);mask-image:linear-gradient(90deg,transparent 0%,#000 34%,#000 80%,transparent 100%)}
  ${S} .bs-panel{position:absolute;top:0;bottom:0;width:540px}
  ${S} .bs-panel i{position:absolute;inset:0;display:block}
  ${S} .bs-cap{position:absolute;white-space:nowrap;text-transform:uppercase}
  ${S} .bs-page{position:absolute;left:0;top:0;width:1080px;height:3840px}
  ${S} .bs-sec{position:absolute;left:0;width:1080px;height:1920px;overflow:hidden}
  ${S} .bs-win{position:absolute;overflow:hidden}
  ${S} .bs-win>div{position:absolute;left:0;white-space:nowrap;line-height:1}
`;

// rounded pill (yellow plate + ink text by default); x = left (or cx = centre)
function pill(ctx, id, text, { x = 0, cx = null, y, size = 22, bg = YEL, fg = INK, t = null, d = 0.34, wdth = 110, wght = 800, tracking = 0.1 }) {
  const tw = ctx.measure(ctx.nb(text), { font: 'Saira', size, wght, wdth, upper: true, tracking });
  const H = Math.round(size * 1.62), padX = Math.round(size * 0.72), W = Math.round(tw + 2 * padX - size * tracking);
  const left = Math.round(cx != null ? cx - W / 2 : x);
  if (t != null) {
    ctx.tl.fromTo(ctx.sel(`${id}-b`), { scaleX: 0 }, { scaleX: 1, duration: d, ease: 'expo.out' }, t);
    ctx.tl.fromTo(ctx.sel(`${id}-t`), { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: d, ease: 'expo.out' }, t + 0.09);   // text after the plate has grown (no letters outside the yellow)
  }
  return { w: W, h: H, x: left, html: `<div class="bs-pill" style="left:${left}px;top:${Math.round(y)}px;width:${W}px;height:${H}px"><i id="${ctx.id(`${id}-b`)}" style="background:${bg}"></i><span id="${ctx.id(`${id}-t`)}" style="font-family:'Saira';font-weight:${wght};font-stretch:${wdth}%;font-size:${size}px;letter-spacing:${tracking}em;color:${fg};line-height:${H}px;padding-left:${padX}px">${ctx.esc(ctx.nb(text))}</span></div>` };
}
// small tracked caption (Saira, uppercase) — the logo's „F I S H I N G“ voice
function cap(ctx, id, text, { x = ctx.safe.left, y, size = 28, color = '#fff', wght = 700, wdth = 100, tracking = 0.16, align = 'left', w = null, t = null, op = 0.92 }) {
  if (t != null) ctx.tl.fromTo(ctx.sel(id), { opacity: 0, y: 16 }, { opacity: op, y: 0, duration: 0.45, ease: 'expo.out' }, t);
  return `<div class="bs-cap" id="${ctx.id(id)}" style="left:${Math.round(x)}px;top:${Math.round(y)}px;${w ? `width:${w}px;` : ''}text-align:${align};font-family:'Saira';font-weight:${wght};font-stretch:${wdth}%;font-size:${size}px;letter-spacing:${tracking}em;color:${color};opacity:${t != null ? 0 : op}">${ctx.esc(ctx.nb(text))}</div>`;
}
// e-shop product card (bento cell): white card + cut-out + brand pill; snaps in at t
function card(ctx, id, { x, y, w, h, src, brand, rot = -3, t, padX = 26, padTop = 56, padBot = 12 }) {
  const [nw, nh] = ctx.dims(src), ar = nw / nh;
  const c = Math.abs(Math.cos((rot * Math.PI) / 180)), s = Math.abs(Math.sin((rot * Math.PI) / 180));
  const bw = w - 2 * padX, bh = h - padTop - padBot;
  const pw = Math.min(bw / (c + s / ar), bh / (s + c / ar), nw);
  const P = fx.product(ctx, { id: `${id}p`, src, w: pw, cx: w / 2, cy: padTop + bh / 2, ground: 'none', pad: pad(src), rot, sweepOpacity: 0.55, maxUp: 1 });
  const pl = pill(ctx, `${id}l`, brand, { x: 14, y: 12, size: 21, t: t + 0.1, tracking: 0.1 });
  // CD fix: solid card (opacity snaps in one frame) that pops on the 32nds — no grey half-transparent ghost cards over the teal
  ctx.tl.fromTo(ctx.sel(id), { scale: 0.8, y: 46 }, { scale: 1, y: 0, duration: 0.36, ease: 'back.out(1.6)' }, t);
  ctx.tl.fromTo(ctx.sel(id), { opacity: 0 }, { opacity: 1, duration: 0.04, ease: 'none' }, t);
  ctx.tl.fromTo(P.sel, { x: 60 }, { x: 0, duration: 0.5, ease: 'expo.out' }, t + 0.03);
  return { P, html: `<div class="bs-tile" id="${ctx.id(id)}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><i class="bs-card"></i>${P.html}${pl.html}</div>` };
}
// Bosset logo bug, top right, vertically centred on the TA plate (never larger than the TA logo: ctx.logo)
function bug(ctx, id, which, t0, t1, { inT = null } = {}) {
  const L = ctx.logo(which, { box: [250, 60], at: [t0, t1], id: `${id}i` });
  const r = ctx.plate.rect;
  if (inT != null) ctx.tl.fromTo(ctx.sel(id), { opacity: 0, x: 36 }, { opacity: 1, x: 0, duration: 0.5, ease: 'expo.out' }, inT);
  return `<div class="fx-abs" id="${ctx.id(id)}" style="left:${ctx.W - ctx.safe.right - L.w}px;top:${Math.round(r.y + r.h / 2 - L.h / 2)}px">${L.html}</div>`;
}
// 7-bottle V line-up (centre = SM-VB black, the shop's no. 1 thermos); returns html + entrance
function lineup(ctx, id, { cx = 540, floor = 1420, hC = 760, scale = 1, t = null, reflect = 0.22, shadow = 0.42, stagger = 0.075 }) {
  const order = [[PR.S3, -3], [PR.S5, -2], [PR.S2, -1], [PR.H1, 0], [PR.H2, 1], [PR.S4, 2], [PR.S1, 3]];
  const H = { 0: hC, 1: hC * 0.86, 2: hC * 0.77, 3: hC * 0.7 }, DX = { 0: 0, 1: 172, 2: 312, 3: 430 }, DF = { 0: 0, 1: -16, 2: -30, 3: -42 };
  let html = '';
  const P = [];
  // back to front: outermost first
  [...order].sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).forEach(([src, k]) => {
    const a = Math.abs(k), sg = Math.sign(k);
    const [nw, nh] = ctx.dims(src), h = Math.min(H[a] * scale, nh);
    const p = fx.product(ctx, { id: `${id}${k + 3}`, src, h, cx: cx + sg * DX[a] * scale, floor: floor + DF[a] * scale, ground: 'floor', reflect, shadow, pad: pad(src), sweepOpacity: 0.6, maxUp: 1 });
    html += p.html; P.push({ k, p, id: `${id}${k + 3}` });
    // CD fix: bottles rise solid (opacity snaps in 0.1 s) — no translucent ghost bottles mid-rise
    if (t != null) {
      ctx.tl.fromTo(p.sel, { y: 220 }, { y: 0, duration: 0.7, ease: 'expo.out' }, t + a * stagger);
      ctx.tl.fromTo(p.sel, { opacity: 0 }, { opacity: 1, duration: 0.1, ease: 'none' }, t + a * stagger);
    }
  });
  return { html, P };
}

export default function bosset(ctx) {
  const { W, bar } = ctx;
  const SL = ctx.safe.left, CW = W - SL - ctx.safe.right;                    // 64 · 952
  const END = ctx.dur, LEAD = 0.012;
  const vs = (word, dflt, lo, hi) => Math.min(hi, Math.max(lo, ctx.snap(ctx.vo.at(word) ?? dflt, 'beat')));
  const scene = (id, t0, t1, inner) => fx.scene(ctx, id, t0 > 0.01 ? t0 - LEAD : t0, t1 >= END - 0.01 ? END : t1 - LEAD, inner, { inD: 0.001, outD: 0.001 });
  let html = '';

  // ---------- key times (real grid, VO-synced with fallbacks) ----------
  const t1 = bar(1), t2 = bar(2), t3 = bar(3), t4 = bar(4);
  const tLogo = Math.max(0.1, (ctx.vo.at('Bosset') ?? 0.25) - 0.1);           // logo bug a hair before the name
  const tRyb = vs('rybářský', ctx.at(0, 2), ctx.at(0, 2), ctx.at(0, 2));       // 0.92 hero → grid
  const tShop = tRyb + ctx.BEAT / 2;                                            // CD fix: E-SHOP an 8th after RYBÁŘSKÝ → the 2-word claim reads as one unit for ~1 s before the scroll
  const tScroll = vs('termosky', ctx.at(1, 1), ctx.at(1, 1), ctx.at(1, 1));    // 2.29 page scroll („i termosky“ 2.35)
  const tHot = vs('horký', ctx.at(2, 2), ctx.at(2, 1), ctx.at(2, 2));          // 4.59
  const tCold = vs('studený', ctx.at(2, 3), ctx.at(2, 3), ctx.at(2, 3));       // 5.04
  const tAz = Math.max(t3 + 0.08, ctx.snap(ctx.vo.at('až') ?? ctx.at(3, 0) + ctx.BEAT / 2, 'half') - 0.05);
  const tSix = vs('šest', ctx.at(3, 1), ctx.at(3, 1), ctx.at(3, 1));           // 5.96 → 6 lands with „šest“
  const tHod = vs('hodin', ctx.at(3, 2), ctx.at(3, 2), ctx.at(3, 2));          // 6.42
  const OUT_D = 0.42;

  // =============== bars 0–1½ · the e-shop page (section 0) + thermos section (section 1), scrolled on „i termosky“ ===============
  // ---- section 0: RYBÁŘSKÝ E-SHOP ----
  let s0 = `<div class="fx-field" style="background:radial-gradient(90% 60% at 50% 56%, #137d93 0%, ${DEEP} 48%, ${ABYSS} 100%)"></div>`;
  // teal light beam behind the hero (collapses into the grid)
  s0 += `<div class="bs-beam" style="left:-260px;top:${1010 - 170}px;width:1600px;height:340px"><i id="${ctx.id('beam')}" style="background:linear-gradient(180deg,rgba(27,151,177,0) 0%,rgba(27,151,177,.85) 26%,#3cc3dc 50%,rgba(27,151,177,.85) 74%,rgba(27,151,177,0) 100%)"></i></div>`;
  // CD fix: the beam is a feathered light streak (mask on the scaled element) — its leading end used to be a hard slanted edge
  ctx.tl.fromTo(ctx.sel('beam'), { scaleX: 0.22, opacity: 1 }, { scaleX: 1, opacity: 1, duration: 0.42, ease: 'expo.out' }, 0);
  ctx.tl.fromTo(ctx.sel('beam'), { scaleX: 1, opacity: 1 }, { scaleX: 1, opacity: 0, duration: 0.3, ease: 'power2.in' }, tRyb);
  // bento grid geometry (x 64–1016, y 682–1452)
  const GX = SL, GY = 680, GAP = 14, RA = 204, RB = 168, HW = (CW - GAP) / 2, QW = (HW - GAP) / 2;
  const rows = [GY, GY + RA + GAP, GY + RA + GAP + (RB + GAP), GY + RA + GAP + 2 * (RB + GAP)];
  // hero: Keitech Easy Shiner slams in on the downbeat, then becomes the first card of the grid (FLIP)
  const heroW = 980, heroCY = 1010;
  const hero = fx.product(ctx, { id: 'hero', src: PR.H3, w: heroW, cx: W / 2, cy: heroCY, ground: 'float', shadow: 0.5, pad: pad(PR.H3), sweepAngle: 100, sweepOpacity: 0.8, maxUp: 1 });
  const [h3w, h3h] = ctx.dims(PR.H3);
  const cardA = { x: GX, y: rows[0], w: CW, h: RA };
  const inA = Math.min(CW - 70, (RA - 76) * (h3w / h3h));
  const flipS = inA / heroW, flipY = (cardA.y + 56 + (RA - 56 - 12) / 2) - heroCY;
  ctx.tl.fromTo(hero.sel, { scale: 1.34, x: 150, y: 0, opacity: 1 }, { scale: 1, x: 0, y: 0, opacity: 1, duration: 0.55, ease: 'expo.out' }, 0);
  ctx.tl.fromTo(ctx.sel('hero-rot'), { rotation: -14 }, { rotation: -10, duration: tRyb - 0.1, ease: 'none' }, 0);
  fx.sweep(ctx, 'hero', 0.24, { d: 0.6 });
  ctx.tl.fromTo(hero.sel, { scale: 1, y: 0 }, { scale: flipS, y: flipY, duration: 0.5, ease: 'expo.inOut' }, tRyb - 0.1);
  ctx.tl.fromTo(ctx.sel('hero-rot'), { rotation: -10 }, { rotation: -2, duration: 0.5, ease: 'expo.inOut' }, tRyb - 0.1);
  ctx.tl.fromTo(ctx.sel('hero-sh'), { opacity: 1 }, { opacity: 0, duration: 0.25, ease: 'power1.out' }, tRyb - 0.1);
  // CD fix: no RGB-split on the hero at the kick — on the chartreuse body it read as a red/cyan halo around the cut-out
  // card A (behind the hero) + its brand pill
  s0 += `<div class="bs-tile" id="${ctx.id('cA')}" style="left:${cardA.x}px;top:${cardA.y}px;width:${cardA.w}px;height:${cardA.h}px"><i class="bs-card"></i></div>`;
  ctx.tl.fromTo(ctx.sel('cA'), { scale: 0.9 }, { scale: 1, duration: 0.4, ease: 'expo.out' }, tRyb + 0.14);
  ctx.tl.fromTo(ctx.sel('cA'), { opacity: 0 }, { opacity: 1, duration: 0.04, ease: 'none' }, tRyb + 0.14);
  const pA = pill(ctx, 'pA', 'Keitech', { x: GX + 14, y: rows[0] + 12, size: 21, t: tRyb + 0.3, tracking: 0.1 });
  // the other 7 cards snap in on the 16ths (5 brands, real items of bosset.cz on 19. 10.)
  const cards = [
    { id: 'c1', x: GX, y: rows[1], w: HW, h: RB, src: PR.L8, brand: 'Select', rot: -3 },
    { id: 'c2', x: GX + HW + GAP, y: rows[1], w: HW, h: RB, src: PR.L4, brand: 'Keitech', rot: -4 },
    { id: 'c3', x: GX, y: rows[2], w: HW, h: RB, src: PR.L5, brand: 'Fresh Lures', rot: -2 },
    { id: 'c4', x: GX + HW + GAP, y: rows[2], w: QW, h: RB, src: PR.S6, brand: 'YGK', rot: 0, padX: 18 },
    { id: 'c5', x: GX + HW + GAP + QW + GAP, y: rows[2], w: QW, h: RB, src: PR.L9, brand: 'Decoy', rot: 0, padX: 14 },
    { id: 'c6', x: GX, y: rows[3], w: HW, h: RB, src: PR.L7, brand: 'Select', rot: -4 },
    { id: 'c7', x: GX + HW + GAP, y: rows[3], w: HW, h: RB, src: PR.L1, brand: 'Keitech', rot: -3 },
  ];
  // CD fix: cards start once the shrinking hero has cleared row 1 and land on the 32nds → the whole page stands BEFORE the bar-1 punch
  const s32 = ctx.BEAT / 8;
  const C = cards.map((c, i) => card(ctx, c.id, { ...c, t: tRyb + 0.18 + i * s32 * 0.9 }));
  s0 += C.map((c) => c.html).join('') + pA.html;
  // grid accents: punch on the bar-1 downbeat, sweep across the cards
  ctx.tl.hit(ctx.sel('grid'), { scale: 1.025 }, { scale: 1, duration: 0.32, ease: 'power2.out' }, t1);
  cards.forEach((c, i) => fx.sweep(ctx, `${c.id}p`, t1 + 0.1 + i * 0.035, { d: 0.5 }));
  fx.sweep(ctx, 'hero', t1 + 0.06, { d: 0.55 });
  // headline: RYBÁŘSKÝ (white) / E-SHOP (ink on a yellow plate)
  const HS = Math.min(sz(ctx, 'Rybářský', CW, [150, 140, 132, 124, 116, 108, 100]), 132);
  const HY = 392, HY2 = HY + Math.round(HS * 1.02);
  const hA = line(ctx, 'hA', 'Rybářský', { x: SL, y: HY, w: CW, size: HS, color: '#ffffff', t: tRyb - 0.04, d: 0.5 });
  const eW = wOf(ctx, 'E-shop', HS);
  s0 += `<div class="bs-slab" style="left:${SL - 16}px;top:${HY2 + Math.round(HS * 0.02)}px;width:${Math.round(eW + 34)}px;height:${Math.round(HS * 0.98)}px"><i id="${ctx.id('slab')}" style="background:${YEL}"></i></div>`;
  ctx.tl.fromTo(ctx.sel('slab'), { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'expo.out' }, tShop - 0.07);
  const hB = line(ctx, 'hB', 'E-shop', { x: SL, y: HY2, w: CW, size: HS, color: INK, t: tShop - 0.04, d: 0.42 });
  s0 += hA.html + hB.html;
  s0 += bug(ctx, 'bug0', 'on_dark', tLogo, tScroll + 0.2, { inT: tLogo });
  // the hero sits above the grid wrapper (it flies into card A); everything else is inside #grid (punched on the downbeat)
  const sec0 = `<div class="bs-sec" style="top:0"><div class="fx-full" id="${ctx.id('grid')}" style="transform-origin:50% 60%">${s0}</div>${hero.html}</div>`;

  // ---- section 1: TERMOSKY (light-blue set) ----
  let s1 = `<div class="fx-field" style="background:linear-gradient(180deg,#ecf9ff 0%,${SKY} 52%,#a7dcf3 100%)"></div>`;
  s1 += `<div class="fx-abs" style="left:0;right:0;top:1330px;height:590px;background:linear-gradient(180deg,rgba(255,255,255,.55),rgba(255,255,255,0) 70%)"></div>`;
  s1 += fx.glow(ctx, { id: 'g1', x: 540, y: 1030, size: 1100, color: '#ffffff', opacity: 0.75 });
  const tT = tScroll + 0.1;
  const LU = lineup(ctx, 'lu', { floor: 1430, hC: 740, t: tT - 0.04 });
  s1 += LU.html;
  LU.P.forEach(({ k, id }) => fx.sweep(ctx, id, ctx.at(1, 3) + Math.abs(k) * 0.05, { d: 0.6 }));
  const TS = Math.min(sz(ctx, 'Termosky', CW, [150, 140, 132, 124, 116, 108]), 140);
  s1 += line(ctx, 'tH', 'Termosky', { x: SL, y: 392, w: CW, size: TS, color: DEEP, t: tT, d: 0.5 }).html;
  s1 += cap(ctx, 'tC', '0,6 l · nerez · bez BPA', { y: 392 + TS + 18, size: 32, color: DEEP, wght: 700, wdth: 110, tracking: 0.14, t: tT + 0.1, op: 1 });
  s1 += bug(ctx, 'bug1', 'on_light', tScroll - 0.16, t2);
  const sec1 = `<div class="bs-sec" style="top:1920px">${s1}</div>`;

  // ---- the page: scroll with vertical motion blur ----
  const SC0 = tScroll - 0.16, SCD = 0.34;
  html += `<svg class="fx-defs" aria-hidden="true"><filter id="${ctx.id('vb')}" x="-5%" y="-10%" width="110%" height="120%" color-interpolation-filters="sRGB"><feGaussianBlur id="${ctx.id('vbg')}" stdDeviation="0 0"/></filter></svg>`;
  ctx.tl.fromTo(ctx.sel('page'), { y: 0 }, { y: -1920, duration: SCD, ease: 'power3.inOut' }, SC0);
  ctx.tl.set(ctx.sel('page'), { filter: `url(#${ctx.id('vb')})` }, SC0);
  ctx.tl.fromTo(`#${ctx.id('vbg')}`, { attr: { stdDeviation: '0 0' } }, { attr: { stdDeviation: '0 46' }, duration: SCD / 2, ease: 'power2.in' }, SC0);
  ctx.tl.fromTo(`#${ctx.id('vbg')}`, { attr: { stdDeviation: '0 46' } }, { attr: { stdDeviation: '0 0' }, duration: SCD / 2, ease: 'power2.out' }, SC0 + SCD / 2);
  ctx.tl.set(ctx.sel('page'), { filter: 'none' }, SC0 + SCD + 0.02);
  html += scene('scA', 0, t2, `<div class="bs-page" id="${ctx.id('page')}">${sec0}${sec1}</div>`);
  fx.flash(ctx, t1, { id: 'fl1', color: '#ffffff', peak: 0.1, d: 0.22, blend: 'screen' });

  // =============== bar 2 · macro: DOUBLE LOCK, warm | cold split on „horký“ / „studený“ ===============
  let s2 = `<div class="fx-field" style="background:radial-gradient(80% 55% at 50% 62%, #12707f 0%, ${DEEP} 55%, ${ABYSS} 100%)"></div>`;
  s2 += `<div class="bs-panel" style="left:0"><i id="${ctx.id('warm')}" style="background:linear-gradient(0deg,#f4a25e 0%,#d9682f 42%,#8a3216 100%);transform-origin:0 50%"></i></div>`;
  s2 += `<div class="bs-panel" style="left:540px"><i id="${ctx.id('cold')}" style="background:linear-gradient(0deg,#5fd2e8 0%,#1b97b1 42%,#0a4a58 100%);transform-origin:100% 50%"></i></div>`;
  ctx.tl.fromTo(ctx.sel('warm'), { scaleX: 0 }, { scaleX: 1, duration: 0.34, ease: 'expo.out' }, tHot - 0.05);
  ctx.tl.fromTo(ctx.sel('cold'), { scaleX: 0 }, { scaleX: 1, duration: 0.34, ease: 'expo.out' }, tCold - 0.05);
  const MW = 1300;
  const [mw, mh] = ctx.dims(PR.H2m);
  const mH = MW / (mw / mh);
  // CD fix: sweepOpacity .7 → .34 — on the pale mint body the screen sweep blew the macro out to white
  const mac = fx.product(ctx, { id: 'mac', src: PR.H2m, w: MW, cx: 556, cy: 1935 - mH / 2, ground: 'none', pad: pad(PR.H2m), sweepAngle: 115, sweepOpacity: 0.34, maxUp: 1 });
  s2 += mac.html;
  ctx.tl.fromTo(mac.sel, { y: 180, opacity: 1 }, { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out' }, t2);
  fx.pushIn(ctx, mac.cam, t2, t3, { from: 1, to: 1.15, origin: '40% 42%', ease: 'power1.inOut' });
  fx.sweep(ctx, 'mac', t2 + 0.35, { d: 0.8 });
  fx.sweep(ctx, 'mac', tCold + 0.05, { d: 0.6 });
  const tw2 = (CW - 40) / 2;
  const HS2 = Math.min(sz(ctx, 'Horké', tw2, [120, 112, 104, 96, 90, 84, 78], { wdth: 100 }), sz(ctx, 'Studené', tw2, [120, 112, 104, 96, 90, 84, 78], { wdth: 100 }));
  s2 += line(ctx, 'hot', 'Horké', { x: SL, y: 400, w: tw2, size: HS2, wdth: 100, color: '#ffffff', t: tHot - 0.03, d: 0.45 }).html;
  s2 += line(ctx, 'cld', 'Studené', { x: W - ctx.safe.right - tw2, y: 400, w: tw2, size: HS2, wdth: 100, color: '#ffffff', align: 'right', t: tCold - 0.03, d: 0.45 }).html;
  fx.chroma(ctx, ctx.sel('hot'), tHot, { amt: 6, d: 0.3 });
  fx.chroma(ctx, ctx.sel('cld'), tCold, { amt: 6, d: 0.3 });
  // CD fix — headline line = the VO, word for word („…které UDRŽÍ NÁPOJ | HORKÝ | i STUDENÝ“): UDRŽÍ NÁPOJ on the bar-2 hit
  // (VO „udrží“ 3.70), handed over to HORKÉ | STUDENÉ on „horký“. The product feature is NOT a sub-headline any more (it used to
  // stay orphaned under HORKÉ): it is a spec tag pinned above the open lid — yellow DOUBLE LOCK plate + „otevřeš jednou rukou“,
  // on screen for the whole bar (≈ 1.7 s), verified for SM-SR / SM-VB only (research/bosset.md, Verification 5) = the lid shown.
  const tUd = vs('udrží', t2, t2, t2 + ctx.BEAT);
  const UDS = Math.min(sz(ctx, 'Udrží nápoj', CW, [120, 112, 104, 96, 90, 84]), 112);
  s2 += line(ctx, 'udh', 'Udrží nápoj', { x: SL, y: 400, w: CW, size: UDS, color: '#ffffff', t: tUd - 0.02, d: 0.45, out: tHot - 0.2, outD: 0.2 }).html;
  const yTag = 730, tTag = t2 + ctx.BEAT / 2;                                 // just above the lid (top ≈ 840 at full push-in), clear of the headline
  const tg = pill(ctx, 'dlp', 'Double lock', { x: SL, y: yTag, size: 34, wght: 900, wdth: 125, tracking: 0.03, t: tTag });
  s2 += tg.html;
  s2 += cap(ctx, 'dl', 'otevřeš jednou rukou', { x: SL + tg.w + 22, y: yTag + Math.round((tg.h - 34) / 2) - 1, size: 30, wght: 800, wdth: 100, tracking: 0.1, t: tTag + 0.08, op: 1 });
  ctx.report(`spec tag DOUBLE LOCK x ${SL}–${Math.round(SL + tg.w + 22 + ctx.measure(ctx.nb('otevřeš jednou rukou'), { font: 'Saira', size: 30, wght: 800, wdth: 100, upper: true, tracking: 0.1 }))} (≤ ${W - ctx.safe.right}), ${tTag.toFixed(2)}–${t3.toFixed(2)} s; UDRŽÍ NÁPOJ ${UDS}px at ${tUd.toFixed(2)}`);
  html += scene('scB', t2, t3, s2);
  // (CD fix: the orange / cyan screen flashes on „horký“ / „studený“ muddied the teal to olive-grey → removed; the panels are the hit)

  // =============== bar 3 · AŽ 6 HODIN (SM-VB black hero) ===============
  let s3 = `<div class="fx-field" style="background:radial-gradient(85% 60% at 72% 52%, #13788c 0%, ${DEEP} 50%, ${ABYSS} 100%)"></div>`;
  s3 += fx.glow(ctx, { id: 'g3', x: 818, y: 900, size: 980, color: 'rgba(60,195,220,.9)', opacity: 0.45 });
  const b3 = fx.product(ctx, { id: 'b3', src: PR.H1, h: 990, cx: 818, floor: 1446, ground: 'floor', reflect: 0.2, shadow: 0.6, pad: pad(PR.H1), sweepAngle: 104, sweepOpacity: 0.6, maxUp: 1 });
  s3 += b3.html;
  ctx.tl.fromTo(b3.sel, { scale: 1.16, y: -40, opacity: 1 }, { scale: 1, y: 0, opacity: 1, duration: 0.6, ease: 'expo.out' }, t3);
  fx.sweep(ctx, 'b3', tSix + 0.1, { d: 0.8 });
  fx.float(ctx, b3.cam, t3 + 0.6, t4, { y: -10, period: ctx.BAR / 2 });
  s3 += pill(ctx, 'az', 'Až', { x: SL, y: 418, size: 54, wght: 900, wdth: 125, tracking: 0.04, t: tAz }).html;
  // CD fix: no rolling odometer for a single digit — it flashed a 760 px „5“ across the AŽ plate („až 5 hodin“ for a frame or
  // three). The 6 now rises out of its own window (y 560–1160, below the plate) and settles on „šest“: only the true number is ever shown.
  const SIX = 760, WY = 560, WH = 600;
  s3 += `<div class="bs-win" style="left:${SL - 22}px;top:${WY}px;width:${Math.round(SIX * 0.9)}px;height:${WH}px"><div id="${ctx.id('six')}" style="top:${470 - WY}px;transform-origin:50% 85%;font-family:'Saira';font-weight:900;font-stretch:125%;font-size:${SIX}px;color:#ffffff">6</div></div>`;
  ctx.tl.fromTo(ctx.sel('six'), { y: WH + 220, scaleY: 1.14 }, { y: 0, scaleY: 1, duration: 0.42, ease: 'expo.out' }, tSix - 0.08);   // parked fully below the window (the stretched top must not peek in)
  const HOD = Math.min(sz(ctx, 'hodin', 560, [132, 124, 116, 108, 100]), 124);
  s3 += line(ctx, 'hod', 'hodin', { x: SL, y: 1196, w: 600, size: HOD, color: '#ffffff', t: tHod - 0.04, d: 0.42 }).html;
  s3 += cap(ctx, 'hc', 'horké i studené', { x: SL + 2, y: 1196 + HOD + 22, size: 30, color: SKY, tracking: 0.2, t: tHod + 0.18, op: 1 });
  s3 += bug(ctx, 'bug3', 'on_dark', t3, t4);
  html += scene('scC', t3, t4, s3);
  // (CD fix: the white screen flash after „šest“ greyed the whole teal frame → removed; the rising 6 is the hit)

  // =============== bar 4 · lockup: logo + bosset.cz + Věnuje ceny over the prize line-up ===============
  let s4 = `<div class="fx-field" style="background:radial-gradient(90% 55% at 50% 70%, #137d93 0%, ${DEEP} 50%, ${ABYSS} 100%)"></div>`;
  s4 += fx.glow(ctx, { id: 'g4', x: 540, y: 1150, size: 1200, color: 'rgba(60,195,220,.9)', opacity: 0.35 });
  const LU4 = lineup(ctx, 'l4', { floor: 1446, hC: 600, scale: 0.92, t: null, reflect: 0.18, shadow: 0.55 });
  LU4.P.forEach(({ k, p }) => ctx.tl.fromTo(p.sel, { y: 90 + Math.abs(k) * 40, opacity: 1 }, { y: 0, opacity: 1, duration: 0.55, ease: 'expo.out' }, t4 - LEAD));
  s4 += `<div class="fx-full" id="${ctx.id('l4w')}">${LU4.html}</div>`;
  LU4.P.forEach(({ k, id }) => fx.sweep(ctx, id, ctx.at(4, 2) + (k + 3) * 0.05, { d: 0.6 }));
  ctx.tl.fromTo(ctx.sel('l4w'), { scale: 1 }, { scale: 1.035, duration: END - t4, ease: 'none' }, t4);
  const LG = ctx.logo('on_dark', { box: [281, 80], at: [t4, END], id: 'lgi' });
  s4 += `<div class="fx-abs" id="${ctx.id('lg')}" style="left:${Math.round(W / 2 - LG.w / 2)}px;top:430px">${LG.html}</div>`;
  ctx.tl.fromTo(ctx.sel('lg'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.4, ease: 'expo.out' }, t4 - LEAD);
  const US = Math.min(sz(ctx, 'bosset.cz', CW, [112, 104, 96, 88], { wght: 800, upper: false }), 104);
  s4 += line(ctx, 'url', 'bosset.cz', { x: SL, y: 430 + LG.h + 40, w: CW, size: US, wght: 800, upper: false, align: 'center', color: '#ffffff', t: t4 + 0.04, d: 0.45 }).html;
  // CD fix: prize plate on the first 8th of the lockup (was beat 2 → only ~0.9 s before the out-wipe started to cover it)
  s4 += pill(ctx, 'pz', 'Věnuje ceny · MČR 2026', { cx: W / 2, y: 430 + LG.h + 40 + US + 36, size: 30, t: t4 + ctx.BEAT / 2 }).html;
  html += scene('scD', t4, END, s4);
  fx.flash(ctx, t4, { id: 'fl4', color: '#ffffff', peak: 0.1, d: 0.22, blend: 'screen' });

  fx.tOut(ctx, 'wipe', { d: OUT_D, dir: 'up' });
  return { html, css: CSS(ctx.S) };
}

// ---------- Reel hook (1 bar): the prize bottle + the claim, readable on frame 1 ----------
// CD fix: frame 1 of a Reel is its thumbnail / autoplay frame → everything is already in place (headline, plate, bottle) and only
// SETTLES (scale 1.05 → 1 from the text's left edge, bottle 1.04 → 1 from its foot — the lid never touches „STUDENÉ“); no mask reveal / drop from off-frame.
export function hook(ctx) {
  const { W } = ctx, SL = ctx.safe.left, CW = W - SL - ctx.safe.right;
  let html = `<div class="fx-field" style="background:radial-gradient(85% 60% at 60% 60%, #13788c 0%, ${DEEP} 50%, ${ABYSS} 100%)"></div>`;
  html += fx.glow(ctx, { id: 'hg', x: 770, y: 1080, size: 1000, color: 'rgba(60,195,220,.9)', opacity: 0.45 });
  const P = fx.product(ctx, { id: 'hp', src: PR.H1, h: 760, cx: 780, floor: 1450, ground: 'floor', reflect: 0.2, shadow: 0.6, pad: pad(PR.H1), sweepAngle: 104, maxUp: 1 });
  html += P.html;
  ctx.tl.set(P.sel, { transformOrigin: '50% 100%' }, 0);
  ctx.tl.fromTo(P.sel, { scale: 1.04, y: -8 }, { scale: 1, y: 0, duration: 0.5, ease: 'expo.out' }, 0);
  fx.sweep(ctx, 'hp', 0.3, { d: 0.8 });
  fx.pushIn(ctx, P.cam, 0.5, ctx.dur, { from: 1, to: 1.05, origin: '50% 100%' });
  const S = Math.min(sz(ctx, 'i studené', CW, [140, 132, 124, 116, 108]), 120);
  let g = line(ctx, 'h1', 'Horké', { x: SL, y: 400, w: CW, size: S, color: '#ffffff' }).html;
  g += line(ctx, 'h2', 'i studené', { x: SL, y: 400 + Math.round(S * 1.0), w: CW, size: S, color: '#ffffff' }).html;
  g += pill(ctx, 'hz', 'až 6 hodin', { x: SL, y: 400 + Math.round(S * 2.0) + 34, size: 44, wght: 900, wdth: 125, tracking: 0.03 }).html;
  html += `<div class="fx-full" id="${ctx.id('hgrp')}" style="transform-origin:${SL}px 400px">${g}</div>`;
  ctx.tl.fromTo(ctx.sel('hgrp'), { scale: 1.05 }, { scale: 1, duration: 0.55, ease: 'expo.out' }, 0);
  html += cap(ctx, 'hu', 'bosset.cz', { x: SL + 2, y: 1366, size: 32, color: SKY, wght: 700, tracking: 0.12, t: 0.3, op: 1 });
  fx.tOut(ctx, 'flash', { color: DEEP, d: 0.12 });
  return { html, css: CSS(ctx.S), timeline: ctx.tl };
}

// ---------- Reel end card (2 bars): lockup + the shop's own distributor claim + Keitech cameo ----------
// CD fix: the old card opened with ~0.5 s of empty teal (tIn flash + a lockup that built itself from t 0.05 while the TA plate
// was still in its corner). Now the TA plate flies in OVER the block's out-wipe (plate.hero from −0.42 s) and lands on the
// downbeat, and the whole lockup is complete on frame 1 (settles 1.04 → 1); only the prize plate and the light sweep come later.
export function endCard(ctx) {
  const { W } = ctx, SL = ctx.safe.left, CW = W - SL - ctx.safe.right;
  let html = `<div class="fx-field" style="background:radial-gradient(90% 60% at 50% 48%, #137d93 0%, ${DEEP} 52%, ${ABYSS} 100%)"></div>`;
  const FLY = 0.42, SC = 1.5;
  const Pl = ctx.plate.hero(-FLY, ctx.dur, { scale: SC, cx: W / 2, cy: 610, fly: FLY, ease: 'power3.inOut' });
  const LG = ctx.logo('on_dark', { box: [760, 300], scale: SC, at: [0, ctx.dur], id: 'ec-logo', label: `${ctx.cid} end card` });
  const y0 = Math.round(Pl.y + Pl.h + 34), yBar = y0 + 52, yLogo = yBar + 34, yURL = yLogo + LG.h + 30;
  const US = Math.min(sz(ctx, 'bosset.cz', 860, [104, 96, 88, 80], { wght: 800, upper: false }), 96);
  const yDist = yURL + Math.round(US * 0.98) + 30, yPz = yDist + 58;
  let g = cap(ctx, 'ec-line', 'Partner MČR v Trout Area 2026', { x: SL, y: y0, w: CW, align: 'center', size: 28, wght: 700, wdth: 110, tracking: 0.18, color: '#ffffff', op: 0.92 });
  g += `<i class="fx-abs" id="${ctx.id('ec-bar')}" style="left:${W / 2 - 60}px;top:${yBar}px;width:120px;height:6px;border-radius:3px;background:${YEL}"></i>`;
  g += `<div class="fx-abs" style="left:${Math.round((W - LG.w) / 2)}px;top:${yLogo}px;width:${LG.w}px;height:${LG.h}px">${LG.html}</div>`;
  g += line(ctx, 'ec-url', 'bosset.cz', { x: SL, y: yURL, w: CW, size: US, wght: 800, upper: false, align: 'center', color: '#ffffff' }).html;
  g += cap(ctx, 'ed', 'Oficiální distributor Keitech a YGK X-Braid pro ČR', { x: SL, y: yDist, w: CW, align: 'center', size: 26, wght: 700, tracking: 0.07, color: SKY, op: 1 });
  html += `<div class="fx-full" id="${ctx.id('ecg')}" style="transform-origin:50% ${yLogo + LG.h / 2}px">${g}</div>`;
  ctx.tl.fromTo(ctx.sel('ecg'), { scale: 1.04 }, { scale: 1, duration: 0.5, ease: 'expo.out' }, 0);
  ctx.tl.fromTo(ctx.sel('ec-bar'), { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'expo.out' }, 0.02);
  html += pill(ctx, 'ez', 'Věnuje ceny · MČR 2026', { cx: W / 2, y: yPz, size: 30, t: ctx.at(0, 1) - 0.04 }).html;
  // the shop's best-selling Keitech: in frame on the downbeat, glides and levels out (sweep on beat 3)
  const kCY = yPz + 48 + 150;
  const K = fx.product(ctx, { id: 'ek', src: PR.H3, w: 640, cx: W / 2, cy: kCY, ground: 'float', shadow: 0.45, pad: pad(PR.H3), sweepAngle: 100, maxUp: 1 });
  html += K.html;
  ctx.tl.fromTo(K.sel, { x: 150 }, { x: 0, duration: 0.8, ease: 'expo.out' }, 0);
  ctx.tl.fromTo(K.cam, { x: 0 }, { x: -36, duration: ctx.dur - 0.8, ease: 'none' }, 0.8);
  ctx.tl.fromTo(ctx.sel('ek-rot'), { rotation: -9 }, { rotation: -3, duration: ctx.dur, ease: 'sine.out' }, 0);
  fx.sweep(ctx, 'ek', ctx.at(0, 2), { d: 0.8 });
  ctx.report(`end card: plate ${Math.round(Pl.y)}–${Math.round(Pl.y + Pl.h)}, line ${y0}, logo ${yLogo}–${yLogo + LG.h}, URL ${yURL} (${US}px), distributor ${yDist}, prize ${yPz}, Keitech cy ${Math.round(kCY)} (≤ ${ctx.H - ctx.safe.bottom})`);
  return { html, css: CSS(ctx.S), timeline: ctx.tl };
}
