// BOSSET.CZ · plan B bars 26–31 (6 bars ≈ 10.99 s) · v3 VO (take 4):
// „Bosset – rybářský e-shop: Keitech a YGK. A vítězové mistrovství získají špičkové termosky Zojirushi.“  (VO from 0.25 s, ends ≈ 8.5 s)
// Brand world (research/bosset_ad.md §3): logo teal #1B97B1, derived deep teal #0A4A58, site header light blue #C5EBFC, site yellow #FFC500
// (only as plates/pills, never yellow text on teal), ink; display = Saira Expanded Black (wdth 125 / wght 900) ≈ the squarish BOSSET logo.
// Retailer: every brand shown is a brand it SELLS (never „its“ products). Nothing about Zojirushi origin; no prices / counts on screen.
//   bar 0     slam: Keitech Easy Shiner on a teal light beam, logo bug on „Bosset“; on „rybářský“ the hero shrinks into the first card
//             of an e-shop BENTO GRID — the wider assortment: JDM wobblers (Megabass, ZipBaits, O.S.P), YGK line, Decoy jig heads,
//             Fresh Lures, Select; RYBÁŘSKÝ / E-SHOP + a category band (the shop menu) — research/bosset_brands.md §2
//   bar 1–2½  „Keitech a YGK“: the page SCROLLS to the ZNAČKY section (light-blue set, like the shop header): KEITECH / YGK X-BRAID,
//             „Oficiální distributor pro ČR“, featured tiles (Keitech logo + 4 Easy Shiner colourways; YGK logo + X-Braid spool) and
//             a wall of 8 brand tiles (the shop's own logos, assets_prep/bosset/brands/) — Zojirushi tile in deep teal
//   bar 2½    „A vítězové“: the Zojirushi tile floods the frame (colour meet) → PRIZE PODIUM: spotlights, empty podium,
//             VÍTĚZOVÉ / MISTROVSTVÍ; bar 3 downbeat: three Zojirushi 0,6 l bottles land on the steps + confetti; ZÍSKAJÍ; „špičkové“ = flare
//   bar 4     hard cut to the hero: SM-VB 0,6 l on the top step; ŠPIČKOVÉ / TERMOSKY / ZOJIRUSHI + Zojirushi logo chip + verified
//             spec stack (0,6 l · horké i studené až 6 hodin · DOUBLE LOCK otevřeš jednou rukou · nerez · bez BPA — SM-VB = all verified)
//   bar 5     lockup on the podium (music only): Bosset logo + bosset.cz + „Věnuje ceny · MČR 2026“ + „Pro vítěze MČR · termosky
//             Zojirushi 0,6 l“ → wipe up into the next block
// Prize models are NOT published (research/bosset_brands.md §3) → the bottles are „the kind of bottle“, no model codes as prize claims.
// Reel: own hook (SM-VB on the podium step + PRO VÍTĚZE MČR) and own end card (fx.endCard-like lockup + distributor line + Keitech cameo).
import fs from 'node:fs';
import path from 'node:path';
import * as fx from '../lib/fx.mjs';
import { ROOT } from '../lib/util.mjs';

const TEAL = '#1B97B1', DEEP = '#0A4A58', ABYSS = '#052E37', SKY = '#C5EBFC', YEL = '#FFC500', INK = '#080C0E';
const AD = 'assets_prep/bosset/ads/', BR = 'assets_prep/bosset/brands/';
const PR = {
  H1: AD + 'H1_zojirushi_sm-vb_0-6l_black.png', H2: AD + 'H2_zojirushi_sm-sr_0-6l_green.png',
  H3: AD + 'H3_keitech_easy_shiner_4in_ice_chartreuse_pal03t.png',
  S1: AD + 'S1_zojirushi_sm-she_0-6l_orange.png', S6: AD + 'S6_ygk_x-braid_upgrade_x8_150m.png',
  L1: AD + 'L1_keitech_easy_shiner_4-5in_lime_chartreuse_424t.png', L2: AD + 'L2_keitech_easy_shiner_4in_silver_flash_minnow_416t.png',
  L3: AD + 'L3_keitech_easy_shiner_3in_sexy_shad_426t.png', L4: AD + 'L4_keitech_easy_shiner_4in_ua_limited_ea12t.png',
  L5: AD + 'L5_fresh_lures_flipworm_3-1in_122.png', L8: AD + 'L8_select_dementor_130sp_13.png', L9: AD + 'L9_decoy_round_magic_sv-52.png',
  W1: AD + 'W1_zipbaits_orbit_110sp_510r.png', W2: AD + 'W2_megabass_x-52_acrobat_f_shigyo.png', W3: AD + 'W3_osp_asura_durga_73sp_s76.png',
};

export const fonts = { Saira: { v: 'saira-{r}-wdth-normal', weight: '100 900', stretch: '50% 125%', axes: ['wght', 'wdth'], use: 'Bosset display (Saira Expanded Black ≈ the extended squarish BOSSET logo lettering), @fontsource-variable/saira 5.3.0, OFL' } };
export const theme = { bg: DEEP, bg2: TEAL, fg: '#ffffff', accent: YEL, accent2: SKY, font: { display: 'Saira', text: 'Saira' }, wght: 900, upper: true, light: false };
export const meta = {
  reel: true,
  hook: { product: PR.H1, headline: 'Pro vítěze MČR', sub: 'bosset.cz' },
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
  ${S} .bs-card.dk{background:linear-gradient(165deg,#163a44 0%,#0b2a33 55%,#061c22 100%);box-shadow:0 20px 44px rgba(2,24,30,.45),inset 0 0 0 1.5px rgba(197,235,252,.22)}
  ${S} .bs-card.lt{border-radius:22px;box-shadow:0 12px 28px rgba(10,74,88,.16),inset 0 0 0 1.5px rgba(255,255,255,.95)}
  ${S} .bs-beam{position:absolute;transform:rotate(-12deg)}
  ${S} .bs-beam i{position:absolute;inset:0;display:block;transform-origin:100% 50%;-webkit-mask-image:linear-gradient(90deg,transparent 0%,#000 34%,#000 80%,transparent 100%);mask-image:linear-gradient(90deg,transparent 0%,#000 34%,#000 80%,transparent 100%)}
  ${S} .bs-cap{position:absolute;white-space:nowrap;text-transform:uppercase}
  ${S} .bs-page{position:absolute;left:0;top:0;width:1080px;height:3840px}
  ${S} .bs-sec{position:absolute;left:0;width:1080px;height:1920px;overflow:hidden}
  ${S} .bs-flood{position:absolute;display:block;border-radius:22px}
  ${S} .bs-step{position:absolute;bottom:-40px}
  ${S} .bs-step b{position:absolute;left:0;right:0;top:0;height:38px;border-radius:6px 6px 0 0;background:linear-gradient(180deg,#f2fbff 0%,${SKY} 70%,#9fd6ec 100%)}
  ${S} .bs-step em{position:absolute;left:0;right:0;top:38px;bottom:0;background:linear-gradient(180deg,#2aa8c2 0%,${TEAL} 18%,${DEEP} 70%,${ABYSS} 100%);box-shadow:inset 0 2px 0 rgba(255,255,255,.35)}
  ${S} .bs-step span{position:absolute;left:0;right:0;text-align:center;font-weight:800;font-stretch:110%;letter-spacing:.2em;text-transform:uppercase;color:rgba(197,235,252,.88);white-space:nowrap}
  ${S} .bs-spot{position:absolute;top:-80px;width:900px;height:1640px;-webkit-clip-path:polygon(44% 0,56% 0,100% 100%,0 100%);clip-path:polygon(44% 0,56% 0,100% 100%,0 100%);background:linear-gradient(180deg,rgba(220,246,255,.55) 0%,rgba(197,235,252,.16) 55%,rgba(197,235,252,0) 100%);mix-blend-mode:screen;transform-origin:50% 0}
  ${S} .bs-cf{position:absolute;display:block;width:16px;height:30px;border-radius:3px}
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
// e-shop product card (bento cell): white (or ink) card + cut-out + brand pill; snaps in at t
function card(ctx, id, { x, y, w, h, src, brand, rot = -3, t, padX = 26, padTop = 56, padBot = 12, dark = false }) {
  const [nw, nh] = ctx.dims(src), ar = nw / nh;
  const c = Math.abs(Math.cos((rot * Math.PI) / 180)), s = Math.abs(Math.sin((rot * Math.PI) / 180));
  const bw = w - 2 * padX, bh = h - padTop - padBot;
  const pw = Math.min(bw / (c + s / ar), bh / (s + c / ar), nw);
  const P = fx.product(ctx, { id: `${id}p`, src, w: pw, cx: w / 2, cy: padTop + bh / 2, ground: 'none', pad: pad(src), rot, sweepOpacity: 0.55, maxUp: 1 });
  const pl = pill(ctx, `${id}l`, brand, { x: 14, y: 12, size: 21, t: t + 0.1, tracking: 0.1 });
  // solid card (opacity snaps in one frame) that pops on the 32nds — no grey half-transparent ghost cards over the teal
  ctx.tl.fromTo(ctx.sel(id), { scale: 0.8, y: 46 }, { scale: 1, y: 0, duration: 0.36, ease: 'back.out(1.6)' }, t);
  ctx.tl.fromTo(ctx.sel(id), { opacity: 0 }, { opacity: 1, duration: 0.04, ease: 'none' }, t);
  ctx.tl.fromTo(P.sel, { x: 60 }, { x: 0, duration: 0.5, ease: 'expo.out' }, t + 0.03);
  return { P, html: `<div class="bs-tile" id="${ctx.id(id)}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><i class="bs-card${dark ? ' dk' : ''}"></i>${P.html}${pl.html}</div>` };
}
// brand tile of the ZNAČKY wall: the shop's own logo file in a light card (logo fitted under the logo rule via ctx.logo)
function btile(ctx, id, { x, y, w, h, file, box, t, dark = false, label }) {
  const L = ctx.logo(file, { box, id: `${id}i`, label: `bosset:brand ${label}` });
  ctx.tl.fromTo(ctx.sel(id), { scale: 0.86, y: 30 }, { scale: 1, y: 0, duration: 0.34, ease: 'back.out(1.5)' }, t);
  ctx.tl.fromTo(ctx.sel(id), { opacity: 0 }, { opacity: 1, duration: 0.04, ease: 'none' }, t);
  return `<div class="bs-tile" id="${ctx.id(id)}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><i class="bs-card lt${dark ? ' dk' : ''}"></i><div class="fx-abs" style="left:${Math.round((w - L.w) / 2)}px;top:${Math.round((h - L.h) / 2)}px">${L.html}</div></div>`;
}
// Bosset logo bug, top right, vertically centred on the TA plate (never larger than the TA logo: ctx.logo)
function bug(ctx, id, which, t0, t1, { inT = null } = {}) {
  const L = ctx.logo(which, { box: [250, 60], at: [t0, t1], id: `${id}i` });
  const r = ctx.plate.rect;
  if (inT != null) ctx.tl.fromTo(ctx.sel(id), { opacity: 0, x: 36 }, { opacity: 1, x: 0, duration: 0.5, ease: 'expo.out' }, inT);
  return `<div class="fx-abs" id="${ctx.id(id)}" style="left:${ctx.W - ctx.safe.right - L.w}px;top:${Math.round(r.y + r.h / 2 - L.h / 2)}px">${L.html}</div>`;
}
// three-step prize podium (no place numbers: the prize split per place is not published); top = y of the centre step's top face
function podium(ctx, id, { cx = 540, top = 1300, w = 320, dl = 110, dr = 150, label = 'MČR 2026', t = null }) {
  const steps = [[cx - 1.5 * w, top + dl, ''], [cx + 0.5 * w, top + dr, ''], [cx - 0.5 * w, top, label]];
  let html = '';
  steps.forEach(([x, y, lab], i) => {
    html += `<div class="bs-step" id="${ctx.id(`${id}${i}`)}" style="left:${Math.round(x)}px;top:${Math.round(y)}px;width:${w}px"><em></em><b></b>${lab ? `<span style="top:78px;font-size:30px;font-family:'Saira'">${ctx.esc(ctx.nb(lab))}</span>` : ''}</div>`;
    if (t != null) ctx.tl.fromTo(ctx.sel(`${id}${i}`), { y: 520 }, { y: 0, duration: 0.55, ease: 'expo.out' }, t + (i === 2 ? 0 : 0.05 + i * 0.04));
  });
  return { html, feet: { L: [cx - w, top + dl], R: [cx + w, top + dr], C: [cx, top] } };
}
// deterministic confetti burst (brand colours) falling from above the frame over [t, t + d]; x range [x0, x1]
function confetti(ctx, id, { t, d = 2.2, n = 22, x0 = 40, x1 = 1040, y0 = -60, y1 = 1500, seed = 5 }) {
  const cols = [YEL, SKY, '#ffffff', YEL, '#3cc3dc'];
  let html = '';
  for (let i = 0; i < n; i++) {
    const r = (k) => ctx.rnd(seed * 97 + i * 13 + k);
    const x = x0 + (x1 - x0) * r(1), sc = 0.55 + 0.6 * r(2), dl = 0.22 * r(3), yE = y1 * (0.55 + 0.45 * r(4));
    html += `<i class="bs-cf" id="${ctx.id(`${id}${i}`)}" style="left:${Math.round(x)}px;top:${y0}px;background:${cols[i % cols.length]};width:${Math.round(16 * sc)}px;height:${Math.round(30 * sc)}px"></i>`;
    ctx.tl.fromTo(ctx.sel(`${id}${i}`), { y: y0 < 0 ? -40 - 260 * r(5) : -30 * r(5), x: 0, rotation: 360 * r(6) }, { y: yE - y0 - 60, x: (r(7) - 0.5) * 220, rotation: 360 * r(6) + (r(8) > 0.5 ? 1 : -1) * (300 + 420 * r(9)), duration: d - dl, ease: 'power1.out' }, t + dl);
  }
  return html;
}

export default function bosset(ctx) {
  const { W, bar } = ctx;
  const SL = ctx.safe.left, CW = W - SL - ctx.safe.right;                    // 64 · 952
  const END = ctx.dur, LEAD = 0.012, BEAT = ctx.BEAT;
  const vs = (word, dflt, lo, hi) => Math.min(hi, Math.max(lo, ctx.snap(ctx.vo.at(word) ?? dflt, 'beat')));
  const scene = (id, t0, t1, inner) => fx.scene(ctx, id, t0 > 0.01 ? t0 - LEAD : t0, t1 >= END - 0.01 ? END : t1 - LEAD, inner, { inD: 0.001, outD: 0.001 });
  let html = '';

  // ---------- key times (real grid, VO-synced with fallbacks) ----------
  const t1 = bar(1), t2 = bar(2), t3 = bar(3), t4 = bar(4), t5 = bar(5);
  const tLogo = Math.max(0.1, (ctx.vo.at('Bosset') ?? 0.25) - 0.1);           // logo bug a hair before the name
  const tRyb = vs('rybářský', ctx.at(0, 2), ctx.at(0, 2), ctx.at(0, 2));       // ≈ 0.92 hero → grid
  const tShop = tRyb + BEAT / 2;                                                // E-SHOP an 8th after RYBÁŘSKÝ (one 2-word claim)
  const tScroll = vs('Keitech', ctx.at(1, 1), ctx.at(1, 1), ctx.at(1, 1));     // ≈ 2.29 page scroll → ZNAČKY („Keitech“ 2.39)
  const tYgk = vs('YGK', ctx.at(1, 3), ctx.at(1, 2), ctx.at(1, 3));            // ≈ 3.20 („YGK“ 3.33)
  const tZ = vs('vítězové', ctx.at(2, 2), ctx.at(2, 2), ctx.at(2, 2));         // ≈ 4.58 Zojirushi tile floods → podium („vítězové“ 4.73)
  const tMis = Math.max(tZ + BEAT / 2, ctx.snap(ctx.vo.at('mistrovství') ?? tZ + BEAT, 'half') - 0.04);   // ≈ 5.27
  const tZis = vs('získají', ctx.at(3, 1), ctx.at(3, 1), ctx.at(3, 1));        // ≈ 5.95
  const tSpi = vs('špičkové', ctx.at(3, 2), ctx.at(3, 2), ctx.at(3, 2));       // ≈ 6.40 flare
  const tZoj = Math.max(t4 + BEAT / 2, ctx.snap(ctx.vo.at('Zojirushi') ?? t4 + BEAT / 2, 'half') - 0.04);   // ≈ 7.55
  const OUT_D = 0.42;

  // =============== bars 0–2½ · the e-shop page: section 0 (RYBÁŘSKÝ E-SHOP) → scroll → section 1 (ZNAČKY) ===============
  // ---- section 0: RYBÁŘSKÝ E-SHOP (the wider assortment) ----
  let s0 = `<div class="fx-field" style="background:radial-gradient(90% 60% at 50% 56%, #137d93 0%, ${DEEP} 48%, ${ABYSS} 100%)"></div>`;
  s0 += `<div class="bs-beam" style="left:-260px;top:${1010 - 170}px;width:1600px;height:340px"><i id="${ctx.id('beam')}" style="background:linear-gradient(180deg,rgba(27,151,177,0) 0%,rgba(27,151,177,.85) 26%,#3cc3dc 50%,rgba(27,151,177,.85) 74%,rgba(27,151,177,0) 100%)"></i></div>`;
  ctx.tl.fromTo(ctx.sel('beam'), { scaleX: 0.22, opacity: 1 }, { scaleX: 1, opacity: 1, duration: 0.42, ease: 'expo.out' }, 0);
  ctx.tl.fromTo(ctx.sel('beam'), { scaleX: 1, opacity: 1 }, { scaleX: 1, opacity: 0, duration: 0.3, ease: 'power2.in' }, tRyb);
  // headline: RYBÁŘSKÝ (white) / E-SHOP (ink on a yellow plate)
  const HS = Math.min(sz(ctx, 'Rybářský', CW, [124, 116, 112, 108, 100]), 112);
  const HY = 392, HY2 = HY + Math.round(HS * 1.02);
  // category band (the shop's main menu, research/bosset_brands.md §2) between the headline and the grid
  const MQY = HY2 + Math.round(HS * 0.98) + 34;
  // bento grid geometry
  const GX = SL, GY = MQY + 30, GAP = 14, RA = 186, RB = 160, HW = (CW - GAP) / 2, QW = (HW - GAP) / 2;
  const rows = [GY, GY + RA + GAP, GY + RA + GAP + (RB + GAP), GY + RA + GAP + 2 * (RB + GAP)];
  // hero: Keitech Easy Shiner slams in on the downbeat, then becomes the first card of the grid (FLIP)
  const heroW = 980, heroCY = 1010;
  const hero = fx.product(ctx, { id: 'hero', src: PR.H3, w: heroW, cx: W / 2, cy: heroCY, ground: 'float', shadow: 0.5, pad: pad(PR.H3), sweepAngle: 100, sweepOpacity: 0.8, maxUp: 1, rot: -14 });
  const [h3w, h3h] = ctx.dims(PR.H3);
  const cardA = { x: GX, y: rows[0], w: CW, h: RA };
  const inA = Math.min(CW - 70, (RA - 76) * (h3w / h3h));
  const flipS = inA / heroW, flipY = (cardA.y + 56 + (RA - 56 - 12) / 2) - heroCY;
  ctx.tl.fromTo(hero.sel, { scale: 1.34, x: 150, y: 0, opacity: 1 }, { scale: 1, x: 0, y: 0, opacity: 1, duration: 0.55, ease: 'expo.out' }, 0);
  ctx.tl.fromTo(hero.cam, { rotation: 0 }, { rotation: 4, duration: tRyb - 0.13, ease: 'none' }, 0);   // −14 → −10 (static −14 on -rot)
  fx.sweep(ctx, 'hero', 0.24, { d: 0.6 });
  ctx.tl.fromTo(hero.sel, { scale: 1, y: 0 }, { scale: flipS, y: flipY, duration: 0.5, ease: 'expo.inOut' }, tRyb - 0.1);
  ctx.tl.fromTo(hero.cam, { rotation: 4 }, { rotation: 12, duration: 0.5, ease: 'expo.inOut' }, tRyb - 0.1);
  ctx.tl.fromTo(ctx.sel('hero-sh'), { opacity: 1 }, { opacity: 0, duration: 0.25, ease: 'power1.out' }, tRyb - 0.1);
  s0 += `<div class="bs-tile" id="${ctx.id('cA')}" style="left:${cardA.x}px;top:${cardA.y}px;width:${cardA.w}px;height:${cardA.h}px"><i class="bs-card"></i></div>`;
  ctx.tl.fromTo(ctx.sel('cA'), { scale: 0.9 }, { scale: 1, duration: 0.4, ease: 'expo.out' }, tRyb + 0.14);
  ctx.tl.fromTo(ctx.sel('cA'), { opacity: 0 }, { opacity: 1, duration: 0.04, ease: 'none' }, tRyb + 0.14);
  const pA = pill(ctx, 'pA', 'Keitech', { x: GX + 14, y: rows[0] + 12, size: 21, t: tRyb + 0.3, tracking: 0.1 });
  // 7 more cards — the shop's other shelves: JDM wobblers (MČR = hard baits), YGK line, Decoy jig heads, Fresh Lures, Select
  const cards = [
    { id: 'c1', x: GX, y: rows[1], w: HW, h: RB, src: PR.W2, brand: 'Megabass', rot: -4, dark: true },
    { id: 'c2', x: GX + HW + GAP, y: rows[1], w: HW, h: RB, src: PR.W1, brand: 'ZipBaits', rot: -4 },
    { id: 'c3', x: GX, y: rows[2], w: HW, h: RB, src: PR.W3, brand: 'O.S.P', rot: -3 },
    { id: 'c4', x: GX + HW + GAP, y: rows[2], w: QW, h: RB, src: PR.S6, brand: 'YGK', rot: 0, padX: 18 },
    { id: 'c5', x: GX + HW + GAP + QW + GAP, y: rows[2], w: QW, h: RB, src: PR.L9, brand: 'Decoy', rot: 0, padX: 14 },
    { id: 'c6', x: GX, y: rows[3], w: HW, h: RB, src: PR.L5, brand: 'Fresh Lures', rot: -2 },
    { id: 'c7', x: GX + HW + GAP, y: rows[3], w: HW, h: RB, src: PR.L8, brand: 'Select', rot: -4 },
  ];
  const s32 = BEAT / 8;
  const C = cards.map((c, i) => card(ctx, c.id, { ...c, t: tRyb + 0.18 + i * s32 * 0.9 }));
  s0 += C.map((c) => c.html).join('') + pA.html;
  ctx.tl.hit(ctx.sel('grid'), { scale: 1.025 }, { scale: 1, duration: 0.32, ease: 'power2.out' }, t1);
  cards.forEach((c, i) => fx.sweep(ctx, `${c.id}p`, t1 + 0.1 + i * 0.035, { d: 0.5 }));
  fx.sweep(ctx, 'hero', t1 + 0.06, { d: 0.55 });
  const hA = line(ctx, 'hA', 'Rybářský', { x: SL, y: HY, w: CW, size: HS, color: '#ffffff', t: tRyb - 0.04, d: 0.5 });
  const eW = wOf(ctx, 'E-shop', HS);
  s0 += `<div class="bs-slab" style="left:${SL - 16}px;top:${HY2 + Math.round(HS * 0.02)}px;width:${Math.round(eW + 34)}px;height:${Math.round(HS * 0.98)}px"><i id="${ctx.id('slab')}" style="background:${YEL}"></i></div>`;
  ctx.tl.fromTo(ctx.sel('slab'), { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'expo.out' }, tShop - 0.07);
  const hB = line(ctx, 'hB', 'E-shop', { x: SL, y: HY2, w: CW, size: HS, color: INK, t: tShop - 0.04, d: 0.42 });
  s0 += hA.html + hB.html;
  s0 += fx.marquee(ctx, { id: 'mq', text: 'Gumové nástrahy · Woblery · Pletené šňůry · Háčky · Jigové hlavičky · Trout Area · Termosky', y: MQY, size: 30, font: 'Saira', wght: 800, wdth: 110, tracking: 0.12, color: SKY, speed: 150, t0: 0, t1: tScroll + 0.4 });
  ctx.tl.fromTo(ctx.sel('mq'), { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'none' }, tShop);
  s0 += bug(ctx, 'bug0', 'on_dark', tLogo, tScroll + 0.2, { inT: tLogo });
  const sec0 = `<div class="bs-sec" style="top:0"><div class="fx-full" id="${ctx.id('grid')}" style="transform-origin:50% 60%">${s0}</div>${hero.html}</div>`;

  // ---- section 1: ZNAČKY (light-blue set like the shop header): official distribution + the brand wall ----
  let s1 = `<div class="fx-field" style="background:linear-gradient(180deg,#ecf9ff 0%,${SKY} 58%,#a7dcf3 100%)"></div>`;
  s1 += fx.glow(ctx, { id: 'g1', x: 540, y: 900, size: 1200, color: '#ffffff', opacity: 0.7 });
  const tK = tScroll + 0.06;
  const KS = Math.min(sz(ctx, 'YGK X-Braid', CW, [124, 116, 108, 100, 92, 86]), 112);
  const kY = 452;
  s1 += cap(ctx, 'od', 'Oficiální distributor pro ČR', { x: SL, y: 400, size: 30, color: DEEP, wght: 800, wdth: 110, tracking: 0.14, t: tK, op: 1 });
  s1 += line(ctx, 'kH', 'Keitech', { x: SL, y: kY, w: CW, size: KS, color: DEEP, t: tK, d: 0.45 }).html;
  s1 += line(ctx, 'yH', 'YGK X-Braid', { x: SL, y: kY + Math.round(KS * 1.0), w: CW, size: KS, color: TEAL, t: tYgk - 0.04, d: 0.45 }).html;
  // featured tile: Keitech (logo + 4 Easy Shiner colourways)
  const fY = kY + Math.round(KS * 2.0) + 30, fH = 262;
  const KL = ctx.logo(BR + 'keitech_hires.png', { box: [236, 60], id: 'kLi', label: 'bosset:brand Keitech' });
  let kt = `<i class="bs-card lt"></i><div class="fx-abs" style="left:26px;top:22px">${KL.html}</div>`;
  const kLures = [[PR.L1, 300, 222, -6], [PR.L2, 700, 132, -5], [PR.L3, 690, 226, -4], [PR.L4, 300, 130, -5]];
  kLures.forEach(([src, cx, cy, rot], i) => {
    const P = fx.product(ctx, { id: `kl${i}`, src, w: 380, cx, cy, ground: 'none', pad: pad(src), rot, sweepOpacity: 0.55, maxUp: 1 });
    kt += P.html;
    ctx.tl.fromTo(P.sel, { x: 140 + i * 30 }, { x: 0, duration: 0.55, ease: 'expo.out' }, tK + 0.08 + i * s32);
    fx.sweep(ctx, `kl${i}`, t2 + 0.06 + i * 0.04, { d: 0.5 });
  });
  s1 += `<div class="bs-tile" id="${ctx.id('kT')}" style="left:${SL}px;top:${fY}px;width:${CW}px;height:${fH}px">${kt}</div>`;
  ctx.tl.fromTo(ctx.sel('kT'), { scale: 0.92, y: 40 }, { scale: 1, y: 0, duration: 0.42, ease: 'expo.out' }, tK);
  // featured tile: YGK X-Braid (logo + Upgrade X8 spool; no line strength: the shop image box ≠ the listed item)
  const yY = fY + fH + 14, yH = 196;
  const YL = ctx.logo(BR + 'ygk.png', { box: [210, 70], id: 'yLi', label: 'bosset:brand YGK' });
  const sp = fx.product(ctx, { id: 'sp', src: PR.S6, h: yH - 22, cx: CW - 150, cy: yH / 2, ground: 'none', pad: pad(PR.S6), sweepOpacity: 0.5, maxUp: 1 });
  let yt = `<i class="bs-card lt"></i><div class="fx-abs" style="left:26px;top:${Math.round(yH / 2 - YL.h / 2 - 22)}px">${YL.html}</div>`;
  yt += cap(ctx, 'yC', 'X-Braid Upgrade X8', { x: 28, y: Math.round(yH / 2 + YL.h / 2 - 8), size: 30, color: DEEP, wght: 800, wdth: 100, tracking: 0.08, op: 1 }) + sp.html;
  s1 += `<div class="bs-tile" id="${ctx.id('yT')}" style="left:${SL}px;top:${yY}px;width:${CW}px;height:${yH}px">${yt}</div>`;
  ctx.tl.fromTo(ctx.sel('yT'), { x: 1100 }, { x: 0, duration: 0.42, ease: 'expo.out' }, tYgk - 0.06);
  ctx.tl.fromTo(sp.cam, { rotation: -40 }, { rotation: 0, duration: 0.7, ease: 'expo.out' }, tYgk - 0.02);
  fx.sweep(ctx, 'sp', t2 + 0.2, { d: 0.5 });
  // brand wall: 8 small tiles (the shop's ZNAČKY tiles) — Zojirushi in deep teal: it floods the frame on „vítězové“
  const wY = yY + yH + 14, tw = (CW - 3 * 12) / 4, th = Math.min(112, Math.floor((1452 - wY - 12) / 2));
  const wall = [
    ['zojirushi_on_dark.png', 'Zojirushi', [180, 62], true], ['megabass.png', 'Megabass', [184, 44]], ['zipbaits.png', 'ZipBaits', [184, 52]], ['osp.png', 'O.S.P', [150, 70]],
    ['reins.png', 'Reins', [170, 60]], ['freshlures.png', 'Fresh Lures', [86, 86]], ['decoy.png', 'Decoy', [180, 40]], ['select.png', 'Select', [170, 50]],
  ];
  const tW0 = tScroll + 0.42;                                                    // between „Keitech“ and „YGK“, on the 32nds
  wall.forEach(([f, label, box, dark], i) => {
    const x = SL + (i % 4) * (tw + 12), y = wY + Math.floor(i / 4) * (th + 12);
    s1 += btile(ctx, `w${i}`, { x: Math.round(x), y, w: Math.round(tw), h: th, file: BR + f, box: [Math.min(box[0], tw - 30), Math.min(box[1], th - 26)], t: tW0 + i * s32, dark, label });
  });
  const zx = SL + tw / 2, zy = wY + th / 2;                                      // Zojirushi tile centre
  // flood: a deep-teal panel grows from the Zojirushi tile to the whole frame (it meets the podium scene in colour)
  const fsx = (2 * Math.max(zx, W - zx) + 60) / tw, fsy = (2 * Math.max(zy, 1920 - zy) + 60) / th;   // section-local = screen coords
  s1 += `<i class="bs-flood" id="${ctx.id('flood')}" style="left:${Math.round(SL)}px;top:${wY}px;width:${Math.round(tw)}px;height:${th}px;background:${DEEP};opacity:0"></i>`;
  ctx.tl.fromTo(ctx.sel('flood'), { opacity: 0 }, { opacity: 1, duration: 0.03, ease: 'none' }, tZ - 0.3);
  ctx.tl.fromTo(ctx.sel('flood'), { scaleX: 1, scaleY: 1 }, { scaleX: fsx, scaleY: fsy, duration: 0.3, ease: 'power3.in' }, tZ - 0.3);
  ctx.tl.hit(ctx.sel('wall'), { scale: 1.02 }, { scale: 1, duration: 0.3, ease: 'power2.out' }, t2);
  ctx.tl.hit(ctx.sel('w0'), { scale: 1.07 }, { scale: 1, duration: 0.3, ease: 'power2.out' }, ctx.at(2, 1));
  s1 += bug(ctx, 'bug1', 'on_light', tScroll - 0.16, tZ);
  const sec1 = `<div class="bs-sec" style="top:1920px"><div class="fx-full" id="${ctx.id('wall')}" style="transform-origin:50% 62%">${s1}</div></div>`;

  // ---- the page: scroll with vertical motion blur ----
  const SC0 = tScroll - 0.16, SCD = 0.34;
  html += `<svg class="fx-defs" aria-hidden="true"><filter id="${ctx.id('vb')}" x="-5%" y="-10%" width="110%" height="120%" color-interpolation-filters="sRGB"><feGaussianBlur id="${ctx.id('vbg')}" stdDeviation="0 0"/></filter></svg>`;
  ctx.tl.fromTo(ctx.sel('page'), { y: 0 }, { y: -1920, duration: SCD, ease: 'power3.inOut' }, SC0);
  ctx.tl.set(ctx.sel('page'), { filter: `url(#${ctx.id('vb')})` }, SC0);
  ctx.tl.fromTo(`#${ctx.id('vbg')}`, { attr: { stdDeviation: '0 0' } }, { attr: { stdDeviation: '0 46' }, duration: SCD / 2, ease: 'power2.in' }, SC0);
  ctx.tl.fromTo(`#${ctx.id('vbg')}`, { attr: { stdDeviation: '0 46' } }, { attr: { stdDeviation: '0 0' }, duration: SCD / 2, ease: 'power2.out' }, SC0 + SCD / 2);
  ctx.tl.set(ctx.sel('page'), { filter: 'none' }, SC0 + SCD + 0.02);
  html += scene('scA', 0, tZ, `<div class="bs-page" id="${ctx.id('page')}">${sec0}${sec1}</div>`);
  fx.flash(ctx, t1, { id: 'fl1', color: '#ffffff', peak: 0.1, d: 0.22, blend: 'screen' });
  ctx.plate.tone(SC0 + SCD * 0.5, tZ - 0.1, 'halo');                          // light-blue page under the TA logo

  // =============== bars 2½–3 · PRIZE PODIUM: VÍTĚZOVÉ MISTROVSTVÍ ZÍSKAJÍ (bottles land on the bar-3 downbeat) ===============
  const stage = (id, { cx = 540, top, glowY }) => {
    let s = `<div class="fx-field" style="background:radial-gradient(85% 55% at 50% ${Math.round((glowY / 1920) * 100)}%, #13788c 0%, ${DEEP} 46%, ${ABYSS} 100%)"></div>`;
    s += fx.rays(ctx, { id: `${id}r`, x: cx, y: glowY, size: 2200, color: 'rgba(197,235,252,.5)', n: 18, duty: 0.3, opacity: 0.16, spin: 14, t0: tZ, t1: END, hole: 0.06 });
    s += fx.glow(ctx, { id: `${id}g`, x: cx, y: glowY, size: 1100, color: 'rgba(60,195,220,.95)', opacity: 0.5 });
    s += `<div class="bs-spot" id="${ctx.id(`${id}sl`)}" style="left:${cx - 450 - 330}px"></div><div class="bs-spot" id="${ctx.id(`${id}sr`)}" style="left:${cx - 450 + 330}px"></div>`;
    return s;
  };
  const POD = { top: 1296, w: 316, dl: 108, dr: 150 };
  let s2 = stage('p1', { top: POD.top, glowY: 1080 });
  ctx.tl.fromTo(ctx.sel('p1sl'), { rotation: -26, opacity: 0.4 }, { rotation: -14, opacity: 1, duration: 0.9, ease: 'expo.out' }, tZ);
  ctx.tl.fromTo(ctx.sel('p1sr'), { rotation: 26, opacity: 0.4 }, { rotation: 14, opacity: 1, duration: 0.9, ease: 'expo.out' }, tZ);
  const pd1 = podium(ctx, 'pd', { ...POD, t: tZ - 0.02 });
  // bottles: SM-VB black on the top step, SM-SR green left, SM-SHE orange right (no „DOUBLE LOCK / jednou rukou“ near the orange one)
  const B = [
    { id: 'bC', src: PR.H1, h: 640, cx: 540, floor: POD.top + 22 },
    { id: 'bL', src: PR.H2, h: 560, cx: 540 - POD.w, floor: POD.top + POD.dl + 22 },
    { id: 'bR', src: PR.S1, h: 500, cx: 540 + POD.w - 6, floor: POD.top + POD.dr + 22 },
  ];
  let bots = '';
  B.forEach((b, i) => {
    const P = fx.product(ctx, { id: b.id, src: b.src, h: b.h, cx: b.cx, floor: b.floor, ground: 'floor', reflect: 0, shadow: 0.6, pad: pad(b.src), sweepAngle: 104, sweepOpacity: 0.6, maxUp: 1 });
    bots += P.html;
    // drop from above the frame, land exactly on the bar-3 downbeat, short squash from the foot
    ctx.tl.fromTo(P.sel, { y: -1500 - i * 120 }, { y: 0, duration: 0.34, ease: 'power3.in' }, t3 - 0.34);
    ctx.tl.set(P.cam, { transformOrigin: '50% 100%' }, 0);
    ctx.tl.hit(P.cam, { scaleY: 0.93, scaleX: 1.04 }, { scaleY: 1, scaleX: 1, duration: 0.36, ease: 'back.out(2.4)' }, t3);
    fx.sweep(ctx, b.id, tSpi + i * 0.06, { d: 0.6 });
  });
  s2 += `<div class="fx-full" id="${ctx.id('pw')}" style="transform-origin:540px 1000px">${pd1.html}${bots}</div>`;
  ctx.tl.fromTo(ctx.sel('pw'), { scale: 1 }, { scale: 1.07, duration: t4 - tSpi, ease: 'power2.in' }, tSpi);   // lean in → cut to the hero
  ctx.tl.hit(ctx.sel('p1g'), { opacity: 0.95 }, { opacity: 0.5, duration: 0.5, ease: 'power2.out' }, tSpi);
  s2 += confetti(ctx, 'cf', { t: t3 - 0.04, d: t4 - t3 + 0.1, n: 24, seed: 3 });
  // headline: VÍTĚZOVÉ / MISTROVSTVÍ (VO word for word) + ZÍSKAJÍ plate
  const VS = Math.min(sz(ctx, 'Mistrovství', CW, [124, 116, 108, 100, 92, 86, 80]), sz(ctx, 'Vítězové', CW, [124, 116, 108, 100]));
  const vY = 404;
  s2 += line(ctx, 'vH', 'Vítězové', { x: SL, y: vY, w: CW, size: VS, color: '#ffffff', t: tZ + 0.02, d: 0.5 }).html;
  s2 += line(ctx, 'mH', 'mistrovství', { x: SL, y: vY + Math.round(VS * 1.04), w: CW, size: VS, color: SKY, t: tMis, d: 0.45 }).html;
  s2 += pill(ctx, 'zp', 'získají', { x: SL, y: vY + Math.round(VS * 2.08) + 18, size: 40, wght: 900, wdth: 125, tracking: 0.04, t: tZis - 0.04 }).html;
  html += scene('scP', tZ, t4, s2);

  // =============== bar 4 · HERO: ŠPIČKOVÉ TERMOSKY ZOJIRUSHI + verified spec stack (SM-VB 0,6 l) ===============
  let s3 = `<div class="fx-field" style="background:radial-gradient(80% 58% at 72% 52%, #13788c 0%, ${DEEP} 50%, ${ABYSS} 100%)"></div>`;
  s3 += fx.rays(ctx, { id: 'p2r', x: 790, y: 900, size: 2000, color: 'rgba(197,235,252,.5)', n: 18, duty: 0.3, opacity: 0.14, spin: 10, t0: t4, t1: t5, hole: 0.06 });
  s3 += fx.glow(ctx, { id: 'p2g', x: 790, y: 900, size: 1000, color: 'rgba(60,195,220,.95)', opacity: 0.5 });
  const HF = 1488;                                                               // top face of the (close) top step
  s3 += `<div class="bs-step" style="left:560px;top:${HF - 22}px;width:620px"><em></em><b></b></div>`;
  const hB1 = fx.product(ctx, { id: 'hb', src: PR.H1, h: 1040, cx: 792, floor: HF, ground: 'floor', reflect: 0, shadow: 0.65, pad: pad(PR.H1), sweepAngle: 104, sweepOpacity: 0.65, maxUp: 1 });
  s3 += hB1.html;
  ctx.tl.fromTo(hB1.sel, { scale: 1.12, y: -30 }, { scale: 1, y: 0, duration: 0.55, ease: 'expo.out' }, t4 - 0.02);
  ctx.tl.set(hB1.sel, { transformOrigin: '50% 100%' }, 0);
  fx.pushIn(ctx, hB1.cam, t4 + 0.5, t5, { from: 1, to: 1.04, origin: '50% 100%' });
  fx.sweep(ctx, 'hb', t4 + 0.12, { d: 0.7 });
  fx.sweep(ctx, 'hb', ctx.at(4, 2) + 0.05, { d: 0.7 });
  const LW = 540;                                                                // left column x 64–604
  s3 += pill(ctx, 'sp1', 'špičkové', { x: SL, y: 398, size: 34, wght: 900, wdth: 125, tracking: 0.04, t: t4 - 0.06 }).html;
  const TS2 = Math.min(sz(ctx, 'Termosky', LW, [104, 96, 90, 84, 78]), sz(ctx, 'Zojirushi', LW, [104, 96, 90, 84, 78]));
  const tY = 470;
  s3 += line(ctx, 'tH', 'Termosky', { x: SL, y: tY, w: LW, size: TS2, color: '#ffffff', t: t4 - 0.02, d: 0.45 }).html;
  s3 += line(ctx, 'zH', 'Zojirushi', { x: SL, y: tY + Math.round(TS2 * 1.02), w: LW, size: TS2, color: SKY, t: tZoj, d: 0.45 }).html;
  // Zojirushi logo (shop tile on a white chip) — ≤ TA logo
  const ZL = ctx.logo(BR + 'zojirushi_on_dark.png', { box: [230, 70], at: [t4, t5], id: 'zLi', label: 'bosset:brand Zojirushi' });
  const zlY = tY + Math.round(TS2 * 2.06) + 22;
  s3 += `<div class="fx-abs" id="${ctx.id('zL')}" style="left:${SL - 4}px;top:${zlY}px">${ZL.html}</div>`;
  ctx.tl.fromTo(ctx.sel('zL'), { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.4, ease: 'expo.out' }, tZoj + 0.06);
  // spec stack (verbatim-verified for SM-VB 0,6 l: „až 6 hodin“ hot & cold · DOUBLE LOCK / one hand · nerez + plast bez BPA)
  const tS1 = ctx.at(4, 1) + 0.02, tS2 = tS1 + BEAT / 4, tS3 = tS1 + BEAT / 2, tS4 = tS1 + BEAT * 0.75;   // whole stack stands ≥ 1 s before the lockup
  let y = zlY + ZL.h + 34;
  const V06 = 150;
  s3 += line(ctx, 'v06', '0,6 l', { x: SL, y, w: LW, size: V06, color: '#ffffff', t: tZoj + 0.12, d: 0.42 }).html;
  y += Math.round(V06 * 0.98) + 18;
  const az = pill(ctx, 'az', 'až 6 hodin', { x: SL, y, size: 38, wght: 900, wdth: 125, tracking: 0.03, t: tS1 });
  s3 += az.html + cap(ctx, 'hs', 'horké i studené', { x: SL + az.w + 18, y: y + Math.round((az.h - 32) / 2) - 1, size: 32, wght: 800, wdth: 100, tracking: 0.1, color: '#ffffff', t: tS1 + 0.06, op: 1 });
  y += az.h + 22;
  const dl = pill(ctx, 'dl', 'Double lock', { x: SL, y, size: 38, wght: 900, wdth: 125, tracking: 0.03, bg: SKY, fg: DEEP, t: tS2 });
  s3 += dl.html;
  y += dl.h + 10;
  s3 += cap(ctx, 'jr', 'otevřeš jednou rukou', { x: SL + 2, y, size: 32, wght: 800, wdth: 100, tracking: 0.1, color: SKY, t: tS3, op: 1 });
  y += 32 + 28;
  s3 += cap(ctx, 'np', 'nerez · bez BPA', { x: SL + 2, y, size: 32, wght: 800, wdth: 100, tracking: 0.1, color: SKY, t: tS4, op: 1 });
  ctx.report(`hero spec stack y ${zlY}–${y + 30} (≤ ${ctx.H - ctx.safe.bottom}), times ${tZoj.toFixed(2)}/${tS1.toFixed(2)}–${tS4.toFixed(2)}, hero bottle x ${Math.round(hB1.x)}–${Math.round(hB1.x + hB1.w)}`);
  html += scene('scH', t4, t5, s3);

  // =============== bar 5 · lockup on the podium: logo + bosset.cz + Věnuje ceny + Pro vítěze MČR ===============
  const POD2 = { top: 1366, w: 300, dl: 96, dr: 132 };
  let s4 = stage('p3', { top: POD2.top, glowY: 1160 });
  ctx.tl.fromTo(ctx.sel('p3sl'), { rotation: -18 }, { rotation: -12, duration: END - t5, ease: 'sine.out' }, t5);
  ctx.tl.fromTo(ctx.sel('p3sr'), { rotation: 18 }, { rotation: 12, duration: END - t5, ease: 'sine.out' }, t5);
  const pd2 = podium(ctx, 'pe', { ...POD2 });
  let bots2 = '';
  [
    { id: 'eC', src: PR.H1, h: 560, cx: 540, floor: POD2.top + 22 },
    { id: 'eL', src: PR.H2, h: 490, cx: 540 - POD2.w, floor: POD2.top + POD2.dl + 22 },
    { id: 'eR', src: PR.S1, h: 440, cx: 540 + POD2.w - 6, floor: POD2.top + POD2.dr + 22 },
  ].forEach((b, i) => {
    bots2 += fx.product(ctx, { id: b.id, src: b.src, h: b.h, cx: b.cx, floor: b.floor, ground: 'floor', reflect: 0, shadow: 0.6, pad: pad(b.src), sweepAngle: 104, sweepOpacity: 0.6, maxUp: 1 }).html;
    fx.sweep(ctx, b.id, ctx.at(5, 1) + i * 0.06, { d: 0.6 });
  });
  s4 += `<div class="fx-full" id="${ctx.id('ew')}" style="transform-origin:540px 1300px">${pd2.html}${bots2}</div>`;
  ctx.tl.fromTo(ctx.sel('ew'), { scale: 1.08 }, { scale: 1, duration: 0.6, ease: 'expo.out' }, t5 - LEAD);
  s4 += confetti(ctx, 'ce', { t: t5 - 0.3, d: END - t5 + 0.3, n: 16, seed: 9, y0: 760, y1: 1560 });
  const LG = ctx.logo('on_dark', { box: [281, 80], at: [t5, END], id: 'lgi' });
  const lgY = 420;
  s4 += `<div class="fx-abs" id="${ctx.id('lg')}" style="left:${Math.round(W / 2 - LG.w / 2)}px;top:${lgY}px">${LG.html}</div>`;
  ctx.tl.fromTo(ctx.sel('lg'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.4, ease: 'expo.out' }, t5 - LEAD);
  const US = Math.min(sz(ctx, 'bosset.cz', CW, [104, 96, 88], { wght: 800, upper: false }), 96);
  const uY = lgY + LG.h + 34;
  s4 += line(ctx, 'url', 'bosset.cz', { x: SL, y: uY, w: CW, size: US, wght: 800, upper: false, align: 'center', color: '#ffffff', t: t5 + 0.02, d: 0.45 }).html;
  const pzY = uY + US + 30;
  s4 += pill(ctx, 'pz', 'Věnuje ceny · MČR 2026', { cx: W / 2, y: pzY, size: 30, t: t5 + 0.06 }).html;
  s4 += cap(ctx, 'pv', 'Pro vítěze MČR · termosky Zojirushi 0,6 l', { x: SL, y: pzY + 49 + 26, w: CW, align: 'center', size: 30, wght: 700, wdth: 100, tracking: 0.08, color: SKY, t: t5 + 0.16, op: 1 });
  ctx.report(`lockup: logo ${lgY}–${lgY + LG.h}, URL ${uY} (${US}px), prize ${pzY}, line ${pzY + 75}, centre bottle top ${POD2.top + 22 - 560}`);
  html += scene('scD', t5, END, s4);

  fx.tOut(ctx, 'wipe', { d: OUT_D, dir: 'up' });
  return { html, css: CSS(ctx.S) };
}

// ---------- Reel hook (1 bar): the prize bottle on the podium step + the claim, readable on frame 1 ----------
// frame 1 of a Reel is its thumbnail / autoplay frame → everything is already in place and only SETTLES (no mask reveal / drop).
export function hook(ctx) {
  const { W } = ctx, SL = ctx.safe.left, CW = W - SL - ctx.safe.right;
  let html = `<div class="fx-field" style="background:radial-gradient(85% 60% at 64% 56%, #13788c 0%, ${DEEP} 50%, ${ABYSS} 100%)"></div>`;
  html += fx.rays(ctx, { id: 'hr', x: 770, y: 1000, size: 2000, color: 'rgba(197,235,252,.5)', n: 18, duty: 0.3, opacity: 0.14, spin: 8, t0: 0, t1: ctx.dur, hole: 0.06 });
  html += fx.glow(ctx, { id: 'hg', x: 770, y: 1080, size: 1000, color: 'rgba(60,195,220,.9)', opacity: 0.45 });
  const HF = 1460;
  html += `<div class="bs-step" style="left:520px;top:${HF - 22}px;width:620px"><em></em><b></b></div>`;
  const P = fx.product(ctx, { id: 'hp', src: PR.H1, h: 820, cx: 790, floor: HF, ground: 'floor', reflect: 0, shadow: 0.6, pad: pad(PR.H1), sweepAngle: 104, maxUp: 1 });
  html += P.html;
  ctx.tl.set(P.sel, { transformOrigin: '50% 100%' }, 0);
  ctx.tl.fromTo(P.sel, { scale: 1.04, y: -8 }, { scale: 1, y: 0, duration: 0.5, ease: 'expo.out' }, 0);
  fx.sweep(ctx, 'hp', 0.3, { d: 0.8 });
  fx.pushIn(ctx, P.cam, 0.5, ctx.dur, { from: 1, to: 1.05, origin: '50% 100%' });
  const S = Math.min(sz(ctx, 'Pro vítěze', CW, [140, 132, 124, 116, 108]), 124);
  let g = line(ctx, 'h1', 'Pro vítěze', { x: SL, y: 400, w: CW, size: S, color: '#ffffff' }).html;
  g += line(ctx, 'h2', 'MČR', { x: SL, y: 400 + Math.round(S * 1.02), w: CW, size: S, color: SKY }).html;
  g += pill(ctx, 'hz', 'termosky Zojirushi 0,6 l', { x: SL, y: 400 + Math.round(S * 2.04) + 30, size: 34, wght: 900, wdth: 110, tracking: 0.03 }).html;
  html += `<div class="fx-full" id="${ctx.id('hgrp')}" style="transform-origin:${SL}px 400px">${g}</div>`;
  ctx.tl.fromTo(ctx.sel('hgrp'), { scale: 1.05 }, { scale: 1, duration: 0.55, ease: 'expo.out' }, 0);
  html += cap(ctx, 'hu', 'bosset.cz', { x: SL + 2, y: 1340, size: 32, color: SKY, wght: 700, tracking: 0.12, t: 0.3, op: 1 });
  fx.tOut(ctx, 'flash', { color: DEEP, d: 0.12 });
  return { html, css: CSS(ctx.S), timeline: ctx.tl };
}

// ---------- Reel end card (2 bars): lockup + the shop's own distributor claim + Keitech cameo ----------
// The TA plate flies in OVER the block's out-wipe (plate.hero from −0.42 s) and lands on the downbeat; the lockup is complete on frame 1.
export function endCard(ctx) {
  const { W } = ctx, SL = ctx.safe.left, CW = W - SL - ctx.safe.right;
  let html = `<div class="fx-field" style="background:radial-gradient(90% 60% at 50% 48%, #137d93 0%, ${DEEP} 52%, ${ABYSS} 100%)"></div>`;
  const FLY = 0.42, SC = 1.5;
  const Pl = ctx.plate.hero(-FLY, ctx.dur, { scale: SC, cx: W / 2, cy: 610, fly: FLY, ease: 'power3.inOut' });
  const LG = ctx.logo('on_dark', { box: [760, 300], scale: SC / 1.04, at: [0, ctx.dur], id: 'ec-logo', label: `${ctx.cid} end card` });   // ÷ the lockup settle 1.04 → 1 (logo rule on frame 1)
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
