// VELKA-RYBA.CZ · plan A bars 37–41 (5 bars ≈ 9.13 s) · concept A „Shimano speciálka“ + assortment (research/velkaryba_ad.md)
// Brand world: the shop's own navy #183C6B / #0F2541, white, red #DA0F00 only as a price-tag accent; Nunito 900 italic uppercase
// (the site's web font, italic = its signature against Activefishing's upright Nunito). Retailer — Shimano / Illex / Daiwa / Lucky John /
// Westin / Vanpla / Berkley are brands it SELLS, never „its“ products. VO: „Velká ryba – vše na přívlač. Speciálka z Olomouce, kde si
// pruty Shimano vyzkoušíte přímo u vody.“
//   bar 0      VŠE NA PŘÍVLAČ — beats 0–1: 8 trout spoons of 7 brands strobe on the 16ths (one glow, colour per lure), giant outline
//              „Velká ryba“, the logo bug pops on „Velká ryba“ (top right, opposite the TA plate);
//              beats 2–3 = BRAND MOMENT „od značek …“: the shop's own homepage sentence („Nabízíme vše na přívlač od značek 3stan, Fox
//              Rage, Keitech, Mepps, Rapala, Salmo, Savage Gear, Shimano a mnoha dalších“) as a 4×4 wall of white brand cards (15 logos,
//              research/velkaryba_brands.md) snapping in by rows on the 16ths + the 16th card „a mnoha dalších“ (v3, 21. 10.)
//   bar 1–2½   SPECIÁLKA Z OLOMOUCE · OD ROKU 2011 — Shimano Vanquish FA CE rises out of the dark studio (floor reflection, light
//              sweeps), spec chips 145 g · 5,1 : 1 · 11 + 1, speed-ramp macro push into the spool on the downbeat of bar 2
//   bar 2½–4   whip → PRUTY SHIMANO · VYZKOUŠÍTE · PŘÍMO U VODY — the Cardiff Exlead rod draws itself along the diagonal (rim light,
//              light band), chip SHIMANO ROD TEST CENTER, the water photo grades in under „přímo u vody“
//   bar 4      the lure box: 12 spoons/baits of 7 brands snap into compartments on the 16ths (each compartment labelled with the
//              brand's LOGO, v3), the logo bug flies into the lockup
//              above VELKA-RYBA.CZ → stacked wipe out
// Reel: own hook (Cardiff on orange „TROUT AREA?“ → flip to the gold back) + own end card (lockup + outline marquee).
import fs from 'node:fs';
import path from 'node:path';
import * as fx from '../lib/fx.mjs';
import { ROOT } from '../lib/util.mjs';

const NAVY = '#183C6B', DEEP = '#0F2541', INK = '#071426', RED = '#DA0F00', ORANGE = '#FC9C24', ICE = '#9cc4f0';
const AD = 'assets_prep/velkaryba/ads/';
const LOGO = AD + 'logo_reverse_on_navy.png';

export const theme = { bg: DEEP, bg2: NAVY, fg: '#ffffff', accent: RED, accent2: ORANGE, font: { display: 'Nunito', text: 'Nunito' }, wght: 900, upper: true, light: false };
export const meta = {
  reel: true,
  hook: { product: AD + 'H2_shimano_cardiff_roll_swimmer_ce_orange_front.png', headline: 'Trout Area?', sub: 'velka-ryba.cz' },
  endCard: { logo: LOGO, line: 'Partner MČR v Trout Area 2026' },
};

// pads (transparent margins) from the cut-out manifest → shadows / fits sit on the visible object
const PAD = {};
try { for (const f of JSON.parse(fs.readFileSync(path.join(ROOT, AD, 'manifest.json'), 'utf8')).files) PAD[path.basename(f.file)] = f.pad; } catch { /* defaults */ }
const pad = (src) => PAD[path.basename(src)] || [0.02, 0.02, 0.02, 0.02];

// the assortment (all listed in velka-ryba.cz „Plandavky na pstruhy“ / Lov pstruhů, 19. 10. 2026)
// wr = rotation in the lure box / shelf: every bait on ONE 45° axis with the hook end up-right (knolling; body axes measured by PCA
// of the alpha; the Cardiffs keep their embossed „SHIMANO CE4.5g“ upright, the text-less spoons turn 180°)
const L = {
  cardiffO: { src: AD + 'H2_shimano_cardiff_roll_swimmer_ce_orange_front.png', brand: 'Shimano', glow: '#fc9c24', rot: -10, wr: -36 },
  illexP: { src: AD + 'H3_illex_native_spoon_pink_yamame.png', brand: 'Illex', glow: '#e2559a', rot: 0, wr: 181 },
  lj: { src: AD + 'S8_lucky_john_eos_003.png', brand: 'Lucky John', glow: '#4fb4f0', rot: 0, wr: 178 },
  daiwaG: { src: AD + 'S3b_daiwa_presso_adm_flashing_green_single.png', brand: 'Daiwa', glow: '#22c65e', rot: 0, wr: 178 },
  westin: { src: AD + 'S9_westin_fidusen_slim_pink_yellow_clown.png', brand: 'Westin', glow: '#f0407a', rot: -12, wr: -45 },
  cardiffL: { src: AD + 'S4_shimano_cardiff_roll_swimmer_ce_lime_front.png', brand: 'Shimano', glow: '#d8d22a', rot: -10, wr: -36 },
  vanpla: { src: AD + 'S10_vanpla_pink_black.png', brand: 'Vanpla', glow: '#d8285a', rot: 0, wr: 192 },
  sukoshi: { src: AD + 'S11_berkley_sukoshi_splat_pel.png', brand: 'Berkley', glow: '#c99a5b', rot: -12, wr: -45 },
  illexC: { src: AD + 'S1_illex_native_spoon_copper_trout.png', brand: 'Illex', glow: '#e08a2a', rot: 0, wr: 180 },
  daiwaB: { src: AD + 'S2b_daiwa_presso_adm_manhattan_single.png', brand: 'Daiwa', glow: '#2a8fd0', rot: 0, wr: 177 },
  camo: { src: AD + 'S5_shimano_cardiff_roll_swimmer_camo_military_pink_front.png', brand: 'Shimano', glow: '#e04a9a', rot: -10, wr: -36 },
  flail: { src: AD + 'S6_berkley_powerbait_power_flail_trout_pellet.png', brand: 'Berkley', glow: '#b08a66', rot: -8, wr: -44 },
};
// brands the shop SELLS (third-party, never „its“): logos as served by velka-ryba.cz (/img/m/<id>.jpg), assets_prep/velkaryba/brands/
// wall order = Shimano (lead, VO) → the homepage list → the trout brands of the hero spoons; Major Craft left out (15 + „a mnoha dalších“)
const BR = 'assets_prep/velkaryba/brands/';
const BWALL = ['shimano', 'rapala', 'savagegear', 'foxrage', 'illex', '3stan', 'westin', 'keitech', 'salmo', 'mepps', 'berkley', 'daiwa', 'luckyjohn', 'gloomis', 'libralures'];
const BSLUG = { Shimano: 'shimano', Illex: 'illex', 'Lucky John': 'luckyjohn', Daiwa: 'daiwa', Westin: 'westin', Berkley: 'berkley' };   // Vanpla: no logo → type
// equal visual weight = equal area (lesson finale logo wall): w = min(maxW, sqrt(A·ar), maxH·ar)
const eqFit = (ctx, src, A, maxW, maxH) => { const [nw, nh] = ctx.dims(src), ar = nw / nh; const w = Math.min(maxW, Math.sqrt(A * ar), maxH * ar, nw); return { w, h: w / ar }; };
const STROBE = ['illexP', 'lj', 'cardiffO', 'daiwaG', 'westin', 'cardiffL', 'vanpla', 'sukoshi'];   // not the Cardiff first: the Reel hook ends on it
const WALL = ['illexP', 'cardiffO', 'lj', 'daiwaB', 'westin', 'illexC', 'vanpla', 'cardiffL', 'daiwaG', 'sukoshi', 'camo', 'flail'];
const DISP = { font: 'Nunito', wght: 900, italic: true, upper: true, tracking: -0.01 };

// fit a cut-out into a box without upscaling past its staged size
const fitBox = (ctx, src, bw, bh, maxUp = 1) => { const [nw, nh] = ctx.dims(src), ar = nw / nh; const w = Math.min(bw, bh * ar, nw * maxUp); return { w, h: w / ar }; };
// same, for a cut-out shown rotated by `deg` (its rotated bounding box must fit the box)
const fitRot = (ctx, src, bw, bh, deg = 0, maxUp = 1) => { const [nw, nh] = ctx.dims(src), ar = nw / nh, c = Math.abs(Math.cos(deg * Math.PI / 180)), s = Math.abs(Math.sin(deg * Math.PI / 180)); const w = Math.min(bw / (c + s / ar), bh / (s + c / ar), nw * maxUp); return { w, h: w / ar }; };

// red price-tag slab (skewed, static) whose inner bar wipes in; returns html
function slab(ctx, id, { x, y, w, h, t, d = 0.28, color = RED }) {
  ctx.tl.fromTo(ctx.sel(id), { scaleX: 0 }, { scaleX: 1, duration: d, ease: 'expo.out' }, t);
  return `<div class="vr-slab" style="left:${Math.round(x)}px;top:${Math.round(y)}px;width:${Math.round(w)}px;height:${Math.round(h)}px"><i id="${ctx.id(id)}" style="background:${color}"></i></div>`;
}
// one display line (Nunito 900 italic, masked line reveal); size given or fitted to w
function line(ctx, id, text, { x = ctx.safe.left, y, w = ctx.W - ctx.safe.left - ctx.safe.right, size, sizes, color = '#fff', t, d = 0.6, align = 'left', reveal = 'lines', style = '' }) {
  return fx.headline(ctx, { ...DISP, id, text, x, y, w, size, sizes, maxLines: 1, lh: 0.96, color, t, d, align, reveal, style });
}
const widthOf = (ctx, text, size) => ctx.measure(ctx.nb(text), { ...DISP, size });

export default function velkaryba(ctx) {
  const { W, bar } = ctx;
  const SL = ctx.safe.left, CW = W - SL - ctx.safe.right;                       // 64 · 952
  const END = ctx.dur;
  const q = (b, k, f = 0) => { const a = ctx.at(b, k), n = ctx.at(b, k + 1); return a + (n - a) * f; };
  const vs = (word, dflt, lo, hi) => Math.min(hi, Math.max(lo, ctx.snap(ctx.vo.at(word) ?? dflt, 'beat')));
  const scene = (id, t0, t1, inner, o = {}) => fx.scene(ctx, id, t0 > 0.01 ? t0 - 0.003 : t0, t1, inner, { inD: 0.001, outD: 0.001, ...o });
  let html = '';
  const css = `
  ${ctx.S} .vr-slab{position:absolute;transform:skewX(-14deg)}
  ${ctx.S} .vr-slab i{position:absolute;inset:0;transform-origin:0 50%;display:block}
  ${ctx.S} .vr-lbl{position:absolute;left:0;right:0;text-align:center;font-family:'Nunito';font-weight:800;text-transform:uppercase;letter-spacing:.2em;color:rgba(255,255,255,.78)}
  ${ctx.S} .vr-cap{position:absolute;font-family:'Nunito';font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:rgba(255,255,255,.86);white-space:nowrap;text-shadow:0 1px 2px rgba(4,12,26,.9),0 0 14px rgba(4,12,26,.85)}
  ${ctx.S} .vr-tile{position:absolute;border-radius:28px;background:linear-gradient(160deg,rgba(255,255,255,.13),rgba(255,255,255,.035) 60%);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.16),inset 0 -26px 40px rgba(4,12,26,.35),0 18px 40px rgba(0,0,0,.25)}
  ${ctx.S} .vr-lure{position:absolute;display:block;filter:drop-shadow(0 12px 12px rgba(0,0,0,.5))}
  ${ctx.S} .vr-tglow{position:absolute;inset:0;border-radius:28px;display:block}
  ${ctx.S} .vr-tag{position:absolute;font-family:'Nunito';font-weight:900;font-style:italic;text-transform:uppercase;color:#fff;white-space:nowrap;line-height:1}
  ${ctx.S} #${ctx.id('rod-im')}{filter:drop-shadow(0 0 1.5px rgba(225,238,255,.95)) drop-shadow(0 0 12px rgba(140,190,245,.55))}
  ${ctx.S} .vr-bcard{position:absolute;border-radius:18px;background:#ffffff;box-shadow:0 14px 30px rgba(3,10,24,.42),inset 0 0 0 1px rgba(15,37,65,.08)}
  ${ctx.S} .vr-bcard img{position:absolute;display:block}
  ${ctx.S} .vr-bmore{position:absolute;border-radius:18px;box-shadow:inset 0 0 0 2.5px rgba(255,255,255,.85);display:flex;align-items:center;justify-content:center;text-align:center;font-family:'Nunito';font-weight:900;font-style:italic;text-transform:uppercase;color:#fff;line-height:1.02}
  ${ctx.S} .vr-blg{position:absolute;display:block;left:50%;background-position:center;background-size:100% 100%;background-repeat:no-repeat;filter:drop-shadow(0 1px 2px rgba(4,12,26,.85)) drop-shadow(0 0 8px rgba(4,12,26,.6))}
  ${ctx.S} .vr-band{position:absolute;transform:rotate(-45deg);transform-origin:50% 50%}
  ${ctx.S} .vr-band i{position:absolute;inset:0;display:block;transform-origin:0 50%;background:linear-gradient(180deg,transparent 0%,rgba(127,176,230,.10) 30%,rgba(190,220,255,.42) 50%,rgba(127,176,230,.10) 70%,transparent 100%)}
  `;

  // ---------- key times (real grid, VO-synced with fallbacks) ----------
  const t1 = bar(1), t2 = bar(2), t3 = bar(3), t4 = bar(4);
  const tHL = vs('Speciálka', ctx.at(1, 1), ctx.at(1, 1), ctx.at(1, 1));        // 2.28
  const tSpec = ctx.at(1, 2);                                                   // 2.74
  const tTag = vs('Olomouce', ctx.at(1, 3), ctx.at(1, 3), ctx.at(1, 3));        // 3.21
  const tWhip = vs('Shimano', ctx.at(2, 2), ctx.at(2, 2), ctx.at(2, 2));        // 4.58 (rod lands on „Shimano“)
  const tTry = vs('vyzkoušíte', ctx.at(2, 3), ctx.at(2, 3), t3);               // 5.02
  const tWater = vs('přímo', ctx.at(3, 1), ctx.at(3, 1), ctx.at(3, 2));         // 5.95
  const OUT_D = 0.4;

  // =============== bar 0 · VŠE NA PŘÍVLAČ · spoon strobe on the 8ths ===============
  let s0 = fx.field(ctx, { id: 'f0', kind: 'radial', c1: '#1f4f8a', c2: DEEP, at: '50% 62%' });
  s0 += `<div class="fx-glow" id="${ctx.id('sg')}" style="left:${W / 2 - 620}px;top:${1100 - 620}px;width:1240px;height:1240px;color:${L[STROBE[0]].glow};background:radial-gradient(closest-side,currentColor,transparent);opacity:.62"></div>`;
  s0 += fx.bigType(ctx, { id: 'bt0', text: 'Velká ryba', font: 'Nunito', wght: 900, size: 330, y: 820, x: -40, color: '#ffffff', outline: true, ow: 3, opacity: 0.16, drift: -320, t0: 0, t1, style: 'font-style:italic' });
  const tB = ctx.at(0, 2);                                                       // brand wall on beat 2 („vše na přívlač“)
  const slots = Array.from({ length: 9 }, (_, k) => (k < 8 ? q(0, k >> 2, (k & 3) * 0.25) : tB));
  STROBE.forEach((key, i) => {
    const lu = L[key], a = slots[i], b = slots[i + 1];
    const f = fitRot(ctx, lu.src, 900, 610, lu.rot);
    const P = fx.product(ctx, { id: `st${i}`, src: lu.src, w: f.w, cx: W / 2, cy: 1100, ground: 'none', rot: lu.rot, pad: pad(lu.src), sweep: false, maxUp: 1 });
    s0 += P.html;
    ctx.tl.fromTo(P.sel, { opacity: 0 }, { opacity: 1, duration: 0.001, ease: 'none' }, a);
    ctx.tl.fromTo(ctx.sel(`st${i}-tl`), { scale: 1.2 }, { scale: 1, duration: 0.22, ease: 'expo.out' }, a);
    const dir = i % 2 ? 1 : -1;
    ctx.tl.fromTo(P.cam, { x: -26 * dir, rotation: -4 * dir }, { x: 26 * dir, rotation: 4 * dir, duration: b - a, ease: 'none' }, a);
    ctx.tl.set(P.sel, { opacity: 0 }, b);
    if (i) ctx.tl.set(ctx.sel('sg'), { color: lu.glow }, a);
  });
  ctx.tl.fromTo(ctx.sel('sg'), { opacity: 0.62 }, { opacity: 0.3, duration: 0.2, ease: 'power2.out' }, tB);
  ctx.tl.set(ctx.sel('sg'), { color: '#9cc4f0' }, tB);
  // ---- BRAND MOMENT (beats 2–3): „od značek …“ = 4×4 wall of white brand cards, rows on the 16ths, row 1 ON the beat ----
  const BX = SL, BW = ctx.W - ctx.safe.uiRight - SL, bcols = 4, bgap = 14, bth = 128, BY = 872;       // x 64–940 (Reels UI column)
  const btw = (BW - bgap * (bcols - 1)) / bcols;
  const TA = ctx.plate.logo, BA = 8200;                                         // logo area ≈ 27 % of the TA logo, ≤ the sponsor bug
  let bw = '';
  [...BWALL, null].forEach((slug, i) => {
    const c = i % bcols, r = Math.floor(i / bcols);
    const x = BX + c * (btw + bgap), y = BY + r * (bth + bgap);
    const t = tB + 0.004 + r * ctx.BEAT / 8 + c * 0.016;                   // rows on the 32nds → the wall stands ≈ 0.25 s after the beat
    const sty = `left:${x.toFixed(1)}px;top:${y}px;width:${btw.toFixed(1)}px;height:${bth}px`;
    if (slug) {
      const src = BR + slug + '.png', f = eqFit(ctx, src, BA, btw - 52, bth - 40);
      if (f.w > TA.w || f.w * f.h > TA.w * TA.h) ctx.warn(`brand logo ${slug} larger than the TA logo`);
      bw += `<div class="vr-bcard" id="${ctx.id(`bc${i}`)}" style="${sty}"><img src="${ctx.asset(src)}" alt="${slug}" style="left:${((btw - f.w) / 2).toFixed(1)}px;top:${((bth - f.h) / 2).toFixed(1)}px;width:${f.w.toFixed(1)}px;height:${f.h.toFixed(1)}px"></div>`;
    } else {
      bw += `<div class="vr-bmore" id="${ctx.id(`bc${i}`)}" style="${sty};font-size:30px"><span><b style="display:block;font-weight:900">${ctx.esc(ctx.nb('a mnoha'))}</b><b style="display:block;font-weight:900">${ctx.esc(ctx.nb('dalších'))}</b></span></div>`;
    }
    ctx.tl.fromTo(ctx.sel(`bc${i}`), { opacity: 0, scale: 0.8, y: 24 }, { opacity: 1, scale: 1, y: 0, duration: 0.28, ease: 'back.out(1.8)' }, t);
  });
  s0 += `<div class="fx-full" id="${ctx.id('bwall')}">${bw}</div>`;
  ctx.tl.set(ctx.sel('bwall'), { transformOrigin: `50% ${BY}px` }, 0);
  ctx.tl.fromTo(ctx.sel('bwall'), { scale: 1 }, { scale: 0.975, duration: t1 - tB, ease: 'none' }, tB);
  s0 += `<div class="vr-cap" id="${ctx.id('bcap')}" style="left:${SL + 2}px;top:${BY - 52}px;font-size:30px;letter-spacing:.16em">${ctx.esc(ctx.nb('od značek'))}</div>`;
  ctx.tl.fromTo(ctx.sel('bcap'), { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.3, ease: 'expo.out' }, tB + 0.004);
  ctx.report(`brand wall ${BWALL.length} logos + „a mnoha dalších“ at ${tB.toFixed(2)}–${t1.toFixed(2)} s, cards ${Math.round(btw)}×${bth}, y ${BY}–${BY + 4 * bth + 3 * bgap}`);
  // headline: claim on screen from the downbeat (hard cut, no mask reveal → frame 1 already sells), the red tag punches behind
  // PŘÍVLAČ on the spoken word. Leading 1.07: at 0.96 the Ř caron of line 2 touched the Š of VŠE and read as „VŞE“.
  const f0 = ctx.fit('PŘÍVLAČ', { ...DISP, maxW: 880, maxLines: 1, sizes: [190, 180, 172, 164, 156, 148] });
  const S0 = f0.size, Y0 = 392, P0 = Math.round(S0 * 1.07);
  const tPriv = vs('přívlač', ctx.at(0, 3), ctx.at(0, 2), ctx.at(0, 3));
  s0 += slab(ctx, 'slabP', { x: SL - 10, y: Y0 + P0 + S0 * 0.14, w: widthOf(ctx, 'Přívlač', S0) + 40, h: S0 * 0.84, t: tPriv - 0.04 });
  const h0a = line(ctx, 'h0a', 'Vše na', { y: Y0, size: S0 });
  const h0b = line(ctx, 'h0b', 'Přívlač', { y: Y0 + P0, size: S0 });
  s0 += h0a.html + h0b.html;
  // kinetic settle from frame 1: the two lines slide in from opposite sides (readable all the way), RGB hit on the kick
  ctx.tl.fromTo(h0a.sel, { x: 34 }, { x: 0, duration: 0.5, ease: 'expo.out' }, 0);
  ctx.tl.fromTo(h0b.sel, { x: 64 }, { x: 0, duration: 0.56, ease: 'expo.out' }, 0);
  fx.chroma(ctx, h0a.sel, 0, { amt: 6, d: 0.3 });
  fx.chroma(ctx, h0b.sel, tPriv, { amt: 7, d: 0.35 });
  fx.punch(ctx, h0b.sel, tPriv, { scale: 1.04, d: 0.3 });
  fx.punch(ctx, ctx.sel('bc0'), Math.max(tPriv, tB + 0.32), { scale: 1.06, d: 0.3 });                // lead brand (VO: „pruty Shimano“) pops with PŘÍVLAČ
  // hard cut on the downbeat + slam (lesson broll/finale: no zoom-from-blur into a kick, the kick frame must not be mush)
  // origin on the headline's top edge → the slam never pushes type under the TA plate or past the left safe edge
  ctx.tl.set(ctx.sel('slam'), { transformOrigin: `50% ${Y0}px` }, 0);
  ctx.tl.fromTo(ctx.sel('slam'), { scale: 1.08 }, { scale: 1, duration: 0.42, ease: 'expo.out' }, 0);
  html += scene('sc0', 0, t1, `<div class="fx-full" id="${ctx.id('slam')}">${s0}</div>`);
  fx.flash(ctx, 0, { id: 'fl0', color: '#9cc4f0', peak: 0.18, d: 0.24, blend: 'screen' });

  // =============== bars 1–2½ · SPECIÁLKA Z OLOMOUCE · Shimano Vanquish FA CE studio ===============
  let s1 = `<div class="fx-field" id="${ctx.id('f1')}" style="background:radial-gradient(90% 62% at 55% 60%, #21528f 0%, ${DEEP} 56%, ${INK} 100%)"></div>`;
  s1 += fx.glow(ctx, { id: 'g1', x: 600, y: 900, size: 1150, color: 'rgba(127,176,230,.85)', opacity: 0.34 });
  s1 += fx.bigType(ctx, { id: 'bt1', text: 'Přívlač', font: 'Nunito', wght: 900, size: 400, y: 760, x: 40, color: '#ffffff', outline: true, ow: 3, opacity: 0.1, drift: -260, t0: t1, t1: tWhip, style: 'font-style:italic' });
  const VQ = AD + 'H1_shimano_vanquish_fa_ce_c2000s.png';
  const vq = fx.product(ctx, { id: 'vq', src: VQ, h: 800, cx: 566, floor: 1418, ground: 'floor', reflect: 0.2, shadow: 0.62, pad: pad(VQ), sweepAngle: 112, sweepOpacity: 0.65, maxUp: 1 });
  s1 += vq.html;
  ctx.tl.fromTo(vq.sel, { y: 150, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out' }, t1);
  ctx.tl.fromTo(ctx.sel('vq-im'), { filter: 'brightness(0.12) contrast(1.25)' }, { filter: 'brightness(1) contrast(1)', duration: 1.0, ease: 'power2.out' }, t1);
  ctx.tl.set(ctx.sel('vq-im'), { filter: 'none' }, t1 + 1.02);
  ctx.tl.fromTo(ctx.sel('g1'), { opacity: 0, scale: 0.7 }, { opacity: 0.34, scale: 1, duration: 1.1, ease: 'expo.out' }, t1);
  fx.sweep(ctx, 'vq', tHL, { d: 0.85 });
  // macro: speed-ramp into the spool engraving on the downbeat of bar 2, then a slow drift
  ctx.tl.set(vq.cam, { transformOrigin: '33% 53%' }, 0);
  fx.ramp(ctx, vq.cam, tSpec + 0.16, t2, { from: { scale: 1 }, to: { scale: 1.42 } });
  ctx.tl.fromTo(vq.cam, { scale: 1.42 }, { scale: 1.52, duration: tWhip - t2, ease: 'none' }, t2);
  fx.sweep(ctx, 'vq', t2 + 0.02, { d: 0.7 });
  // headline + OD ROKU 2011 tag
  const f1 = ctx.fit('Z Olomouce', { ...DISP, maxW: 860, maxLines: 1, sizes: [150, 140, 132, 124, 116, 108] });
  const S1 = f1.size, Y1 = 392, P1 = Math.round(S1 * 0.96);
  s1 += line(ctx, 'h1a', 'Speciálka', { y: Y1, size: S1, t: tHL - 0.06 }).html;
  s1 += line(ctx, 'h1b', 'z Olomouce', { y: Y1 + P1, size: S1, t: tHL + 0.04 }).html;
  const tagS = 44, tagTxt = 'od roku 2011', tagW = widthOf(ctx, tagTxt, tagS) + 44, tagY = Y1 + 2 * P1 + 22;
  s1 += slab(ctx, 'tg1', { x: SL + 4, y: tagY, w: tagW, h: tagS * 1.42, t: tTag - 0.04 });
  s1 += `<div class="vr-tag" id="${ctx.id('tg1t')}" style="left:${SL + 22}px;top:${Math.round(tagY + tagS * 0.2)}px;font-size:${tagS}px">${ctx.esc(ctx.nb(tagTxt))}</div>`;
  ctx.tl.fromTo(ctx.sel('tg1t'), { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.4, ease: 'expo.out' }, tTag + 0.04);
  // spec chips (verified on the product page 19. 10.)
  const cw = 280, cg = 18, cy = 1236;
  s1 += `<div class="vr-cap" id="${ctx.id('cap1')}" style="left:${SL + 2}px;top:${cy - 46}px;font-size:26px">Shimano Vanquish FA Competition Edition</div>`;
  ctx.tl.fromTo(ctx.sel('cap1'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: 'expo.out' }, tSpec - 0.06);
  [['Hmotnost', '145 g'], ['Převod', '5,1 : 1'], ['Ložiska', '11 + 1']].forEach(([lb, v], i) => {
    s1 += fx.chip(ctx, { id: `ch${i}`, label: lb, value: v, x: SL + i * (cw + cg), y: cy, w: cw, tone: 'dark', accent: i === 0 ? RED : ICE, t: tSpec + i * 0.1, from: 'up', font: 'Nunito', vs: 54, ls: 24 });
  });
  // whip out (motion blur to the left) into the rod
  const WH = 0.14;
  ctx.tl.fromTo(ctx.sel('w1'), { x: 0, filter: 'blur(0px)' }, { x: -620, filter: 'blur(26px)', duration: WH, ease: 'power2.in' }, tWhip - WH);
  html += scene('sc1', t1, tWhip, `<div class="fx-full" id="${ctx.id('w1')}">${s1}</div>`);
  fx.flash(ctx, t1, { id: 'fl1', color: '#ffffff', peak: 0.22, d: 0.3, blend: 'screen' });
  fx.flash(ctx, t2, { id: 'fl2', color: '#cfe2ff', peak: 0.18, d: 0.3, blend: 'screen' });

  // =============== bars 2½–4 · PRUTY SHIMANO · VYZKOUŠÍTE · PŘÍMO U VODY (Cardiff Exlead) ===============
  let s2 = `<div class="fx-field" id="${ctx.id('f2')}" style="background:linear-gradient(170deg,#1b4479 0%,${DEEP} 55%,${INK} 100%)"></div>`;
  // „přímo u vody“: the studio floor turns into a water surface — SVG fractal noise on a perspective plane (navy → ice highlights),
  // flowing toward the camera while it is on screen (seek-safe: only a GSAP translate of the noise group)
  const WV = { w: 1950, h: 1100, k: 2 };                          // viewBox units; rendered ×k
  s2 += `<div class="fx-full" id="${ctx.id('wtr')}" style="overflow:hidden"><div class="fx-full" id="${ctx.id('wmv')}" style="perspective:900px;perspective-origin:50% 700px">`
    + `<svg style="position:absolute;left:${540 - (WV.w * WV.k) / 2}px;top:${2010 - WV.h * WV.k}px;width:${WV.w * WV.k}px;height:${WV.h * WV.k}px;transform:rotateX(62deg);transform-origin:50% 100%" viewBox="0 0 ${WV.w} ${WV.h}" preserveAspectRatio="none">`
    + `<filter id="${ctx.id('wf')}" filterUnits="userSpaceOnUse" x="-100" y="-400" width="${WV.w + 200}" height="${WV.h + 800}" color-interpolation-filters="sRGB">`
    + `<feTurbulence type="fractalNoise" baseFrequency="0.0045 0.03" numOctaves="3" seed="11" result="n"/>`
    + `<feColorMatrix in="n" type="matrix" values="1.6 0 0 0 -0.3  1.6 0 0 0 -0.3  1.6 0 0 0 -0.3  0 0 0 0 1" result="g"/>`
    + `<feComponentTransfer in="g"><feFuncR type="table" tableValues="0.03 0.05 0.07 0.09 0.13 0.22 0.45 0.80"/><feFuncG type="table" tableValues="0.08 0.12 0.16 0.21 0.28 0.40 0.64 0.90"/><feFuncB type="table" tableValues="0.16 0.23 0.30 0.38 0.47 0.60 0.82 0.98"/></feComponentTransfer>`
    + `</filter><g id="${ctx.id('wg')}"><rect x="-100" y="-400" width="${WV.w + 200}" height="${WV.h + 800}" filter="url(#${ctx.id('wf')})"/></g></svg></div>`
    + `<div class="fx-full" style="background:linear-gradient(180deg,${DEEP} 0%,${DEEP} 33%,${DEEP} 40.5%,rgba(15,37,65,.6) 44%,rgba(15,37,65,0) 56%,rgba(7,20,38,0) 72%,rgba(7,20,38,.7) 100%)"></div>`
    + fx.glow(ctx, { id: 'wsun', x: 540, y: 760, size: 1300, color: 'rgba(170,205,245,.55)', opacity: 0.5 })
    + `</div>`;
  ctx.tl.fromTo(ctx.sel('wtr'), { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power2.out' }, tWater - 0.05);
  ctx.tl.fromTo(ctx.sel('wmv'), { y: 300 }, { y: 0, duration: 0.7, ease: 'expo.out' }, tWater - 0.05);
  ctx.tl.fromTo(ctx.sel('wg'), { y: -260 }, { y: 120, duration: t4 - tWater + 0.1, ease: 'none' }, tWater - 0.1);
  const RD = AD + 'S7_shimano_cardiff_exlead_competition_rod.png';
  const rf = fitBox(ctx, RD, 1000, 1000);
  const rcx = 548, rcy = 948;
  s2 += `<div class="vr-band" style="left:${rcx - 1050}px;top:${rcy - 150}px;width:2100px;height:300px"><i id="${ctx.id('band')}"></i></div>`;
  ctx.tl.fromTo(ctx.sel('band'), { scaleX: 0, opacity: 1 }, { scaleX: 1, opacity: 1, duration: 0.7, ease: 'expo.out' }, tWhip);
  const rod = fx.product(ctx, { id: 'rod', src: RD, w: rf.w, cx: rcx, cy: rcy, ground: 'none', pad: pad(RD), sweepAngle: 135, sweepOpacity: 0.95, maxUp: 1, style: '--p:-10%;-webkit-mask-image:linear-gradient(45deg,#000 calc(var(--p) - 7%),transparent calc(var(--p) + 7%));mask-image:linear-gradient(45deg,#000 calc(var(--p) - 7%),transparent calc(var(--p) + 7%))' });
  s2 += rod.html;
  ctx.tl.fromTo(rod.sel, { '--p': '-10%' }, { '--p': '118%', duration: 0.5, ease: 'power2.out' }, tWhip);
  ctx.tl.fromTo(ctx.sel('rod-sw'), { backgroundPosition: '-10% 0%' }, { backgroundPosition: '110% 0%', duration: 0.8, ease: 'power2.inOut' }, tWhip + 0.45);
  ctx.tl.fromTo(ctx.sel('rod-sw'), { backgroundPosition: '-10% 0%' }, { backgroundPosition: '110% 0%', duration: 0.8, ease: 'power2.inOut' }, tWater + 0.1);
  fx.parallax(ctx, [{ sel: rod.cam, depth: 1 }], tWhip, t4, { x: -36, y: 26 });
  // kinetic caption of the VO
  const f2 = ctx.fit('Pruty Shimano', { ...DISP, maxW: 900, maxLines: 1, sizes: [132, 124, 116, 110, 104, 98] });
  const f2b = ctx.fit('Přímo u vody', { ...DISP, maxW: 860, maxLines: 1, sizes: [132, 124, 116, 110, 104, 98] });
  const S2 = Math.min(f2.size, f2b.size), Y2 = 392, P2 = Math.round(S2 * 1.0);
  s2 += line(ctx, 'h2a', 'Pruty Shimano', { y: Y2, size: S2, t: tWhip + 0.03 }).html;
  s2 += line(ctx, 'h2b', 'vyzkoušíte', { y: Y2 + P2, size: S2, t: tTry - 0.04 }).html;
  s2 += slab(ctx, 'slabW', { x: SL - 10, y: Y2 + 2 * P2 + S2 * 0.14, w: widthOf(ctx, 'Přímo u vody', S2) + 40, h: S2 * 0.84, t: tWater - 0.06 });
  const h2c = line(ctx, 'h2c', 'přímo u vody', { y: Y2 + 2 * P2, size: S2, t: tWater - 0.02 });
  s2 += h2c.html;
  fx.chroma(ctx, h2c.sel, tWater + 0.06, { amt: 6, d: 0.3 });
  // chip + spec caption sit RIGHT of the rod's butt (right-aligned to the Reels UI column x 940), so the blank never cuts through text
  const rtcL = 'Prodejna Olomouc · půjčte si prut', rtcV = 'Shimano Rod Test Center', UIX = ctx.W - ctx.safe.uiRight;
  const rtcW = Math.ceil(Math.max(ctx.measure(ctx.nb(rtcL), { font: 'Nunito', wght: 700, size: 22, upper: true, tracking: 0.14 }), ctx.measure(rtcV, { font: 'Nunito', wght: 800, size: 46 })) + 64);
  const rtcY = 1262;
  s2 += fx.chip(ctx, { id: 'rtc', label: rtcL, value: rtcV, x: UIX - rtcW, y: rtcY, w: rtcW, tone: 'dark', accent: RED, t: t3, from: 'right', font: 'Nunito', vs: 46, ls: 22 });
  s2 += `<div class="vr-cap" id="${ctx.id('cap2')}" style="right:${ctx.W - UIX}px;top:${rtcY + 128}px;font-size:24px;text-align:right">${ctx.esc(ctx.nb('Cardiff Exlead Competition · 1,83 m · 0,4–4,5 g'))}</div>`;
  ctx.tl.fromTo(ctx.sel('cap2'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: 'expo.out' }, t3 + 0.12);
  ctx.report(`rod chip ${rtcW}px at x ${UIX - rtcW}–${UIX}, caption ${Math.round(ctx.measure(ctx.nb('Cardiff Exlead Competition · 1,83 m · 0,4–4,5 g'), { font: 'Nunito', wght: 800, size: 24, upper: true, tracking: 0.12 }))}px`);
  ctx.tl.fromTo(ctx.sel('w2'), { x: 620, filter: 'blur(26px)' }, { x: 0, filter: 'blur(0px)', duration: 0.38, ease: 'expo.out' }, tWhip);
  ctx.tl.set(ctx.sel('w2'), { filter: 'none' }, tWhip + 0.4);
  html += scene('sc2', tWhip, t4, `<div class="fx-full" id="${ctx.id('w2')}">${s2}</div>`);

  // =============== bar 4 · the lure box (12 lures · 7 brands) + lockup ===============
  // The box hits ON the downbeat: tiles pop in reading order on 32nds (row 1 already in at t4), baits drop into them; logo, URL and
  // the red price-tag „Věnuje ceny · MČR 2026“ follow within the first beat, so the URL holds ≥ 1.2 s before the wipe.
  let s3 = fx.field(ctx, { id: 'f3', kind: 'radial', c1: '#22548f', c2: DEEP, at: '50% 40%' });
  const GX = 102, GY = 388, GW = 876, cols = 4, rows = 3, gap = 12, th = 236;
  const tw = (GW - gap * (cols - 1)) / cols;
  const tW = (k) => t4 - 0.1 + k * 0.026;
  let wall = '';
  WALL.forEach((key, i) => {
    const lu = L[key], c = i % cols, r = Math.floor(i / cols);
    const x = GX + c * (tw + gap), y = GY + r * (th + gap);
    const wr = lu.wr || 0, f = fitRot(ctx, lu.src, tw - 18, th - 52, wr, 1);
    const t = tW(i);
    const lx = (tw - f.w) / 2, ly = (th - 40 - f.h) / 2 + 4;
    wall += `<div class="vr-tile" id="${ctx.id(`tile${i}`)}" style="left:${x.toFixed(1)}px;top:${y.toFixed(1)}px;width:${tw.toFixed(1)}px;height:${th}px">`
      + `<i class="vr-tglow" style="background:linear-gradient(0deg,${ctx.rgba(lu.glow, 0.42)} 0%,${ctx.rgba(lu.glow, 0)} 62%)"></i>`
      // background-image, not <img>: the same PNGs are <img> in the strobe (lint duplicate_media_discovery_risk)
      + `<i class="vr-lure" id="${ctx.id(`lu${i}`)}" style="left:${lx.toFixed(1)}px;top:${ly.toFixed(1)}px;width:${f.w.toFixed(1)}px;height:${f.h.toFixed(1)}px;background:url(${ctx.asset(lu.src)}) center/100% 100% no-repeat"></i>`
      + (BSLUG[lu.brand]
        ? (() => { const src = BR + BSLUG[lu.brand] + '_on_dark.png', g = eqFit(ctx, src, 3800, tw - 64, 40); return `<i class="vr-blg" style="bottom:${(10 + (40 - g.h) / 2).toFixed(1)}px;width:${g.w.toFixed(1)}px;height:${g.h.toFixed(1)}px;margin-left:${(-g.w / 2).toFixed(1)}px;background-image:url(${ctx.asset(src)})"></i>`; })()
        : `<div class="vr-lbl" style="bottom:12px;font-size:23px;letter-spacing:.1em;color:rgba(255,255,255,.88)">${ctx.esc(lu.brand)}</div>`)
      + `</div>`;
    ctx.tl.fromTo(ctx.sel(`tile${i}`), { opacity: 0 }, { opacity: 1, duration: 0.07, ease: 'none' }, t);
    ctx.tl.fromTo(ctx.sel(`tile${i}`), { scale: 0.82 }, { scale: 1, duration: 0.36, ease: 'back.out(1.7)' }, t);
    ctx.tl.fromTo(ctx.sel(`lu${i}`), { y: -48, rotation: wr + (i % 2 ? 1 : -1) * 24, opacity: 0 }, { y: 0, rotation: wr, opacity: 1, duration: 0.42, ease: 'expo.out' }, t + 0.03);
  });
  s3 += `<div class="fx-full" id="${ctx.id('wallp')}" style="perspective:1600px;perspective-origin:50% 30%"><div class="fx-full" id="${ctx.id('wall')}">${wall}</div></div>`;
  ctx.tl.set(ctx.sel('wall'), { transformOrigin: '50% 30%' }, 0);
  ctx.tl.fromTo(ctx.sel('wall'), { rotationX: 20, scale: 1.06 }, { rotationX: 0, scale: 1, duration: 0.8, ease: 'expo.out' }, t4);
  // beat accent: the orange Cardiff (Trout Area spoon) pops on beat 3
  fx.punch(ctx, ctx.sel('tile1'), ctx.at(4, 2), { scale: 1.08, d: 0.32 });
  // lockup: logo bug lands above the URL, URL in the brand face, red price-tag „Věnuje ceny · MČR 2026“ (brief: every sponsor)
  const gridB = GY + rows * th + (rows - 1) * gap;                       // 1120
  const fU = ctx.fit('velka-ryba.cz', { ...DISP, maxW: 840, maxLines: 1, sizes: [104, 100, 96, 92, 88, 84] });
  const UY = gridB + 132;                                                // logo 1136–1239, URL 1252–1348
  const hu = fx.headline(ctx, { ...DISP, id: 'url', text: 'velka-ryba.cz', x: SL, y: UY, w: CW, size: fU.size, maxLines: 1, lh: 0.96, align: 'center', t: t4 + 0.06, reveal: 'lines', d: 0.45 });
  s3 += hu.html;
  const pzS = 34, pzTxt = 'Věnuje ceny · MČR 2026', pzW = widthOf(ctx, pzTxt, pzS) + 48, pzY = UY + Math.round(fU.size * 0.96) + 26, tPz = t4 + 0.16;
  s3 += slab(ctx, 'pz', { x: (W - pzW) / 2, y: pzY, w: pzW, h: pzS * 1.42, t: tPz });
  s3 += `<div class="vr-tag" id="${ctx.id('pzt')}" style="left:${Math.round((W - pzW) / 2 + 24)}px;top:${Math.round(pzY + pzS * 0.2)}px;font-size:${pzS}px">${ctx.esc(ctx.nb(pzTxt))}</div>`;
  ctx.tl.fromTo(ctx.sel('pzt'), { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4, ease: 'expo.out' }, tPz + 0.05);
  html += scene('sc3', t4, END, s3);
  fx.flash(ctx, t4, { id: 'fl4', color: '#cfe2ff', peak: 0.08, d: 0.22, blend: 'screen' });

  // =============== the sponsor logo bug (top right, opposite the TA plate) → lockup ===============
  const lg = ctx.logo(LOGO, { box: [240, ctx.plate.rect.h + 6], id: 'logo', label: 'velkaryba logo bug' });
  const bx = W - ctx.safe.right - lg.w, by = ctx.plate.rect.y - 3;
  const lx1 = (W - lg.w) / 2, ly1 = UY - lg.h - 13;
  html += `<div class="fx-abs" id="${ctx.id('lgw')}" style="left:${bx}px;top:${by}px;width:${lg.w}px;height:${lg.h}px"><div class="fx-abs" id="${ctx.id('lgi')}" style="inset:0">${lg.html}</div></div>`;
  const tLg = vs('Velká', 0.25, 0, ctx.at(0, 1));
  ctx.tl.fromTo(ctx.sel('lgw'), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, Math.max(0.06, tLg));
  // the bug blinks out of the corner just before the downbeat and pops in above the URL with the box (no flight across the lures)
  ctx.tl.fromTo(ctx.sel('lgi'), { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.7, duration: 0.12, ease: 'power2.in' }, t4 - 0.12);
  ctx.tl.fromTo(ctx.sel('lgw'), { x: 0, y: 0 }, { x: lx1 - bx, y: ly1 - by, duration: 0.001, ease: 'none' }, t4);
  ctx.tl.fromTo(ctx.sel('lgi'), { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, t4 + 0.06);

  // =============== transitions ===============
  fx.tIn(ctx, 'cut');
  fx.tOut(ctx, 'wipe', { d: OUT_D, dir: 'up' });
  ctx.report(`velkaryba: strobe ${STROBE.length} lures, wall ${WALL.length} lures (${new Set(WALL.map((k) => L[k].brand)).size} brands), whip ${tWhip.toFixed(2)} s, water ${tWater.toFixed(2)} s, VO end ${ctx.vo.end?.toFixed?.(2)}`);
  return { html, css };
}

// =============== REEL HOOK (1 bar): Cardiff on orange „TROUT AREA?“ → flip to the gold back ===============
export function hook(ctx) {
  const { W } = ctx, SL = ctx.safe.left, CW = W - SL - ctx.safe.right;
  const END = ctx.dur;
  let html = `<div class="fx-field" id="${ctx.id('hf')}" style="background:linear-gradient(162deg,#ffb54a 0%,${ORANGE} 46%,#ec7608 100%)"></div>`;
  html += fx.glow(ctx, { id: 'hg', x: W / 2, y: 1060, size: 1200, color: 'rgba(255,240,215,.9)', opacity: 0.55 });
  html += fx.bigType(ctx, { id: 'hbt', text: 'Plandavky', font: 'Nunito', wght: 900, size: 330, y: 900, x: 0, color: DEEP, outline: true, ow: 3, opacity: 0.14, drift: -240, t0: 0, t1: END, style: 'font-style:italic' });
  const F = AD + 'H2_shimano_cardiff_roll_swimmer_ce_orange_front.png', B = AD + 'H2_shimano_cardiff_roll_swimmer_ce_orange_back.png';
  const f = fitBox(ctx, F, 900, 560);
  const front = fx.product(ctx, { id: 'hp', src: F, w: f.w, cx: W / 2, cy: 1070, ground: 'float', shadow: 0.5, pad: pad(F), rot: -9, maxUp: 1 });
  // the back (gold) has no hook: size + centre it on the front's body (body = 0.64 of the front width, centre offset rotated by -9°)
  const back = fx.product(ctx, { id: 'hk', src: B, w: Math.min(f.w * 0.653, ctx.dims(B)[0]), cx: W / 2 - 0.1598 * f.w, cy: 1070 + 0.1068 * f.w, ground: 'none', pad: pad(B), rot: -9, maxUp: 1 });
  html += `<div class="fx-full" id="${ctx.id('hpw')}">${front.html}${back.html}</div>`;
  // frame 1 must already sell (lesson activefishing hook): the spoon slams in fully opaque, no fade-from-nothing
  ctx.tl.fromTo(ctx.sel('hp'), { scale: 1.3, rotation: -24 }, { scale: 1, rotation: 0, duration: 0.5, ease: 'expo.out' }, 0);
  const tFlip = ctx.at(0, 2) + 0.04;                                         // gold back holds ≈ 0.7 s before the cut
  fx.sweep(ctx, 'hp', 0.42, { d: 0.75 });
  ctx.tl.fromTo(back.sel, { opacity: 0 }, { opacity: 1, duration: 0.001, ease: 'none' }, tFlip);
  fx.flip(ctx, 'hp', 'hk', tFlip, { d: 0.42 });
  fx.pushIn(ctx, ctx.sel('hpw'), 0.5, END, { from: 1, to: 1.07, origin: '50% 56%' });
  const H = fx.headline(ctx, { ...DISP, id: 'hh', text: 'Trout Area?', x: SL, y: 392, w: CW, maxLines: 2, sizes: [196, 184, 172, 160, 150, 140], lh: 0.94, color: DEEP });
  html += H.html;
  ctx.tl.set(H.sel, { transformOrigin: '0% 0%' }, 0);
  ctx.tl.fromTo(H.sel, { scale: 1.14 }, { scale: 1, duration: 0.5, ease: 'expo.out' }, 0);    // settles, readable from frame 1
  html += `<div class="vr-tag" id="${ctx.id('hsub')}" style="left:${SL + 4}px;top:${Math.round(392 + H.h + 26)}px;font-size:46px;color:${DEEP};font-style:italic">velka-ryba.cz</div>`;
  ctx.tl.fromTo(ctx.sel('hsub'), { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.45, ease: 'expo.out' }, 0.3);
  fx.tOut(ctx, 'flash', { color: DEEP, d: 0.14 });
  const css = `${ctx.S} .vr-tag{position:absolute;font-family:'Nunito';font-weight:900;text-transform:uppercase;white-space:nowrap;line-height:1}`;
  return { html, css, timeline: ctx.tl };
}

// =============== REEL END CARD (2 bars): lockup (TA plate hero + logo + URL + Věnuje ceny) + a shelf of six spoons + outline marquee ===
// The TA plate starts flying 0.42 s BEFORE the end card (over the block's out-wipe) and lands on the downbeat, so frame 1 of the end
// card is the complete lockup (lesson finale: the hit must not be an empty frame).
export function endCard(ctx) {
  const { W } = ctx;
  let html = `<div class="fx-field" id="${ctx.id('ef')}" style="background:radial-gradient(110% 70% at 50% 42%, #22548f 0%, ${DEEP} 58%, ${INK} 100%)"></div>`;
  html += fx.marquee(ctx, { id: 'emq', text: 'Vše na přívlač', y: 1585, size: 150, font: 'Nunito', wght: 900, italic: true, color: '#ffffff', outline: true, ow: 2, speed: 90, style: 'opacity:.2' });
  const FLY = 0.42, SC = 1.5;
  const P = ctx.plate.hero(-FLY, ctx.dur, { scale: SC, cx: W / 2, cy: 640, fly: FLY, ease: 'power3.inOut' });
  const LG = ctx.logo(LOGO, { box: [760, 300], scale: SC / 1.05, at: [0, ctx.dur], id: 'ec-logo', label: `${ctx.cid} end card` });   // ÷ the lockup settle 1.05 → 1 (logo rule on frame 1)
  const fU = ctx.fit('velka-ryba.cz', { ...DISP, maxW: 860, maxLines: 1, sizes: [100, 96, 92, 88, 84] });
  const y0 = Math.round(P.y + P.h + 34);
  const yBar = y0 + 46, yLogo = yBar + 30, yURL = yLogo + LG.h + 28, yPz = yURL + Math.round(fU.size * 0.96) + 24, pzS = 32;
  const pzTxt = 'Věnuje ceny · MČR 2026', pzW = widthOf(ctx, pzTxt, pzS) + 48;
  let lock = `<div class="vr-ln" id="${ctx.id('ec-line')}" style="top:${y0}px">${ctx.esc(ctx.nb('Partner MČR v Trout Area 2026'))}</div>`
    + `<i class="vr-bar" id="${ctx.id('ec-bar')}" style="left:${W / 2 - 60}px;top:${yBar}px"></i>`
    + `<div class="fx-abs" id="${ctx.id('ec-lw')}" style="left:${Math.round((W - LG.w) / 2)}px;top:${yLogo}px;width:${LG.w}px;height:${LG.h}px">${LG.html}</div>`;
  const hu = fx.headline(ctx, { ...DISP, id: 'ec-url', text: 'velka-ryba.cz', x: ctx.safe.left, y: yURL, w: W - ctx.safe.left - ctx.safe.right, size: fU.size, maxLines: 1, lh: 0.96, align: 'center' });
  lock += hu.html;
  lock += slab(ctx, 'epz', { x: (W - pzW) / 2, y: yPz, w: pzW, h: pzS * 1.42, t: ctx.at(0, 1) - 0.04 });
  lock += `<div class="vr-tag" id="${ctx.id('epzt')}" style="left:${Math.round((W - pzW) / 2 + 24)}px;top:${Math.round(yPz + pzS * 0.2)}px;font-size:${pzS}px">${ctx.esc(ctx.nb(pzTxt))}</div>`;
  ctx.tl.fromTo(ctx.sel('epzt'), { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4, ease: 'expo.out' }, ctx.at(0, 1));
  html += `<div class="fx-full" id="${ctx.id('ec')}">${lock}</div>`;
  // complete on frame 1, settles with the hit
  ctx.tl.set(ctx.sel('ec'), { transformOrigin: `50% ${yLogo}px` }, 0);
  ctx.tl.fromTo(ctx.sel('ec'), { scale: 1.05 }, { scale: 1, duration: 0.5, ease: 'expo.out' }, 0);
  ctx.tl.fromTo(ctx.sel('ec-bar'), { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'expo.out' }, 0.02);
  // the shelf: six spoons of six brands on the box's 45° axis, dropping in on the 16ths right on the hit
  const SHELF = ['illexP', 'cardiffO', 'lj', 'westin', 'daiwaG', 'vanpla'];
  const n = SHELF.length, x0 = 110, x1 = 936, cw = (x1 - x0) / n, cyS = yPz + pzS * 1.42 + 112;
  SHELF.forEach((key, i) => {
    const lu = L[key], wr = lu.wr || 0, f = fitRot(ctx, lu.src, cw - 6, 176, wr, 1);
    const cx = x0 + cw * (i + 0.5);
    html += `<img class="vr-lure" id="${ctx.id(`sh${i}`)}" src="${ctx.asset(lu.src)}" alt="" style="left:${(cx - f.w / 2).toFixed(1)}px;top:${(cyS - f.h / 2).toFixed(1)}px;width:${f.w.toFixed(1)}px;height:${f.h.toFixed(1)}px">`;
    const t = i * ctx.BEAT / 4;
    ctx.tl.fromTo(ctx.sel(`sh${i}`), { y: -60, rotation: wr - 25, opacity: 0 }, { y: 0, rotation: wr, opacity: 1, duration: 0.5, ease: 'expo.out' }, t);
    ctx.tl.fromTo(ctx.sel(`sh${i}`), { y: 0 }, { y: -8, duration: ctx.BEAT * 1.5, ease: 'sine.inOut', repeat: 1, yoyo: true }, t + 0.52);
  });
  ctx.report(`end card: plate ${Math.round(P.y)}–${Math.round(P.y + P.h)}, line ${y0}, logo ${yLogo}–${yLogo + LG.h}, URL ${yURL}, pill ${yPz}–${Math.round(yPz + pzS * 1.42)}, shelf ${Math.round(cyS - 88)}–${Math.round(cyS + 88)}`);
  const css = `${ctx.S} .vr-lure{position:absolute;display:block;filter:drop-shadow(0 10px 10px rgba(0,0,0,.5))}
  ${ctx.S} .vr-ln{position:absolute;left:0;right:0;text-align:center;font-family:'Nunito';font-weight:800;font-size:30px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.9)}
  ${ctx.S} .vr-bar{position:absolute;display:block;width:120px;height:6px;border-radius:3px;background:${RED}}
  ${ctx.S} .vr-slab{position:absolute;transform:skewX(-14deg)}
  ${ctx.S} .vr-slab i{position:absolute;inset:0;transform-origin:0 50%;display:block}
  ${ctx.S} .vr-tag{position:absolute;font-family:'Nunito';font-weight:900;font-style:italic;text-transform:uppercase;color:#fff;white-space:nowrap;line-height:1}`;
  return { html, css, timeline: ctx.tl };
}
