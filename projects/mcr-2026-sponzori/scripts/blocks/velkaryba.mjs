// VELKA-RYBA.CZ · plan A bars 37–41 (5 bars ≈ 9.13 s) · concept A „Shimano speciálka“ + assortment (research/velkaryba_ad.md)
// Brand world: the shop's own navy #183C6B / #0F2541, white, red #DA0F00 only as a price-tag accent; Nunito 900 italic uppercase
// (the site's web font, italic = its signature against Activefishing's upright Nunito). Retailer — Shimano / Illex / Daiwa / Lucky John /
// Westin / Vanpla / Berkley are brands it SELLS, never „its“ products. VO: „Velká ryba – vše na přívlač. Speciálka z Olomouce, kde si
// pruty Shimano vyzkoušíte přímo u vody.“
//   bar 0      VŠE NA PŘÍVLAČ — 8 trout spoons of 7 brands strobe on the 8ths (one glow, colour per lure), giant outline „Velká ryba“,
//              the logo bug pops on „Velká ryba“ (top right, opposite the TA plate)
//   bar 1–2½   SPECIÁLKA Z OLOMOUCE · OD ROKU 2011 — Shimano Vanquish FA CE rises out of the dark studio (floor reflection, light
//              sweeps), spec chips 145 g · 5,1 : 1 · 11 + 1, speed-ramp macro push into the spool on the downbeat of bar 2
//   bar 2½–4   whip → PRUTY SHIMANO · VYZKOUŠÍTE · PŘÍMO U VODY — the Cardiff Exlead rod draws itself along the diagonal (rim light,
//              light band), chip SHIMANO ROD TEST CENTER, the water photo grades in under „přímo u vody“
//   bar 4      the lure box: 12 spoons/baits of 7 brands snap into compartments on the 16ths, the logo bug flies into the lockup
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
const L = {
  cardiffO: { src: AD + 'H2_shimano_cardiff_roll_swimmer_ce_orange_front.png', brand: 'Shimano', glow: '#fc9c24', rot: -10 },
  illexP: { src: AD + 'H3_illex_native_spoon_pink_yamame.png', brand: 'Illex', glow: '#e2559a', rot: 0 },
  lj: { src: AD + 'S8_lucky_john_eos_003.png', brand: 'Lucky John', glow: '#4fb4f0', rot: 0 },
  daiwaG: { src: AD + 'S3b_daiwa_presso_adm_flashing_green_single.png', brand: 'Daiwa', glow: '#22c65e', rot: 0 },
  westin: { src: AD + 'S9_westin_fidusen_slim_pink_yellow_clown.png', brand: 'Westin', glow: '#f0407a', rot: -12 },
  cardiffL: { src: AD + 'S4_shimano_cardiff_roll_swimmer_ce_lime_front.png', brand: 'Shimano', glow: '#d8d22a', rot: -10 },
  vanpla: { src: AD + 'S10_vanpla_pink_black.png', brand: 'Vanpla', glow: '#d8285a', rot: 0 },
  sukoshi: { src: AD + 'S11_berkley_sukoshi_splat_pel.png', brand: 'Berkley', glow: '#c99a5b', rot: -12 },
  illexC: { src: AD + 'S1_illex_native_spoon_copper_trout.png', brand: 'Illex', glow: '#e08a2a', rot: 0 },
  daiwaB: { src: AD + 'S2b_daiwa_presso_adm_manhattan_single.png', brand: 'Daiwa', glow: '#2a8fd0', rot: 0 },
  camo: { src: AD + 'S5_shimano_cardiff_roll_swimmer_camo_military_pink_front.png', brand: 'Shimano', glow: '#e04a9a', rot: -10 },
  flail: { src: AD + 'S6_berkley_powerbait_power_flail_trout_pellet.png', brand: 'Berkley', glow: '#a08060', rot: -8 },
};
const STROBE = ['cardiffO', 'illexP', 'lj', 'daiwaG', 'westin', 'cardiffL', 'vanpla', 'sukoshi'];
const WALL = ['illexP', 'cardiffO', 'lj', 'daiwaB', 'westin', 'illexC', 'vanpla', 'cardiffL', 'daiwaG', 'sukoshi', 'camo', 'flail'];
const DISP = { font: 'Nunito', wght: 900, italic: true, upper: true, tracking: -0.01 };

// fit a cut-out into a box without upscaling past its staged size
const fitBox = (ctx, src, bw, bh, maxUp = 1) => { const [nw, nh] = ctx.dims(src), ar = nw / nh; const w = Math.min(bw, bh * ar, nw * maxUp); return { w, h: w / ar }; };

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
  ${ctx.S} .vr-cap{position:absolute;font-family:'Nunito';font-weight:800;text-transform:uppercase;letter-spacing:.16em;color:rgba(255,255,255,.72);white-space:nowrap}
  ${ctx.S} .vr-tile{position:absolute;border-radius:28px;background:linear-gradient(160deg,rgba(255,255,255,.13),rgba(255,255,255,.035) 60%);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.16),inset 0 -26px 40px rgba(4,12,26,.35),0 18px 40px rgba(0,0,0,.25)}
  ${ctx.S} .vr-lure{position:absolute;display:block;filter:drop-shadow(0 12px 12px rgba(0,0,0,.5))}
  ${ctx.S} .vr-tag{position:absolute;font-family:'Nunito';font-weight:900;font-style:italic;text-transform:uppercase;color:#fff;white-space:nowrap;line-height:1}
  ${ctx.S} #${ctx.id('rod-im')}{filter:drop-shadow(0 0 1.5px rgba(225,238,255,.95)) drop-shadow(0 0 12px rgba(140,190,245,.55))}
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
  const tLogoFly = q(4, 0, 0.5), tURL = ctx.at(4, 1);
  const OUT_D = 0.44;

  // =============== bar 0 · VŠE NA PŘÍVLAČ · spoon strobe on the 8ths ===============
  let s0 = fx.field(ctx, { id: 'f0', kind: 'radial', c1: '#1f4f8a', c2: DEEP, at: '50% 62%' });
  s0 += `<div class="fx-glow" id="${ctx.id('sg')}" style="left:${W / 2 - 620}px;top:${1085 - 620}px;width:1240px;height:1240px;color:${L[STROBE[0]].glow};background:radial-gradient(closest-side,currentColor,transparent);opacity:.62"></div>`;
  s0 += fx.bigType(ctx, { id: 'bt0', text: 'Velká ryba', font: 'Nunito', wght: 900, size: 330, y: 820, x: -40, color: '#ffffff', outline: true, ow: 3, opacity: 0.16, drift: -320, t0: 0, t1, style: 'font-style:italic' });
  const slots = Array.from({ length: 9 }, (_, k) => (k < 8 ? q(0, k >> 1, (k & 1) * 0.5) : t1));
  STROBE.forEach((key, i) => {
    const lu = L[key], a = slots[i], b = slots[i + 1];
    const f = fitBox(ctx, lu.src, lu.rot ? 860 : 700, 600);
    const P = fx.product(ctx, { id: `st${i}`, src: lu.src, w: f.w, cx: W / 2, cy: 1085, ground: 'none', rot: lu.rot, pad: pad(lu.src), sweep: false, maxUp: 1 });
    s0 += P.html;
    ctx.tl.fromTo(P.sel, { opacity: 0, scale: 1.22 }, { opacity: 1, scale: 1, duration: 0.2, ease: 'expo.out' }, a);
    const dir = i % 2 ? 1 : -1;
    ctx.tl.fromTo(P.cam, { x: -26 * dir, rotation: -4 * dir }, { x: 26 * dir, rotation: 4 * dir, duration: b - a, ease: 'none' }, a);
    if (i < STROBE.length - 1) ctx.tl.set(P.sel, { opacity: 0 }, b);
    s0 += `<div class="vr-lbl" id="${ctx.id(`sl${i}`)}" style="top:1404px;font-size:30px">${ctx.esc(lu.brand)}</div>`;
    ctx.tl.fromTo(ctx.sel(`sl${i}`), { opacity: 0 }, { opacity: 1, duration: 0.001, ease: 'none' }, a);
    if (i < STROBE.length - 1) ctx.tl.set(ctx.sel(`sl${i}`), { opacity: 0 }, b);
    if (i) ctx.tl.set(ctx.sel('sg'), { color: lu.glow }, a);
  });
  // headline: claim on screen from the downbeat, the red tag punches behind PŘÍVLAČ on the spoken word
  const f0 = ctx.fit('PŘÍVLAČ', { ...DISP, maxW: 880, maxLines: 1, sizes: [190, 180, 172, 164, 156, 148] });
  const S0 = f0.size, Y0 = 392, P0 = Math.round(S0 * 0.96);
  const tPriv = vs('přívlač', ctx.at(0, 3), ctx.at(0, 2), ctx.at(0, 3));
  s0 += slab(ctx, 'sl0', { x: SL - 10, y: Y0 + P0 + S0 * 0.14, w: widthOf(ctx, 'Přívlač', S0) + 40, h: S0 * 0.84, t: tPriv - 0.04 });
  const h0a = line(ctx, 'h0a', 'Vše na', { y: Y0, size: S0, t: 0.02, d: 0.55 });
  const h0b = line(ctx, 'h0b', 'Přívlač', { y: Y0 + P0, size: S0, t: 0.12, d: 0.55 });
  s0 += h0a.html + h0b.html;
  fx.chroma(ctx, h0b.sel, tPriv, { amt: 7, d: 0.35 });
  fx.punch(ctx, h0b.sel, tPriv, { scale: 1.04, d: 0.3 });
  html += scene('sc0', 0, t1, s0);

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
  s1 += `<div class="vr-cap" id="${ctx.id('cap1')}" style="left:${SL + 2}px;top:${cy - 44}px;font-size:22px">Shimano Vanquish FA Competition Edition</div>`;
  ctx.tl.fromTo(ctx.sel('cap1'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: 'expo.out' }, tSpec - 0.06);
  [['Hmotnost', '145 g'], ['Převod', '5,1 : 1'], ['Ložiska', '11 + 1']].forEach(([lb, v], i) => {
    s1 += fx.chip(ctx, { id: `ch${i}`, label: lb, value: v, x: SL + i * (cw + cg), y: cy, w: cw, tone: 'dark', accent: i === 0 ? RED : ICE, t: tSpec + i * 0.1, from: 'up', font: 'Nunito', vs: 52, ls: 19 });
  });
  // whip out (motion blur to the left) into the rod
  const WH = 0.14;
  ctx.tl.fromTo(ctx.sel('w1'), { x: 0, filter: 'blur(0px)' }, { x: -620, filter: 'blur(26px)', duration: WH, ease: 'power2.in' }, tWhip - WH);
  html += scene('sc1', t1, tWhip, `<div class="fx-full" id="${ctx.id('w1')}">${s1}</div>`);
  fx.flash(ctx, t1, { id: 'fl1', color: '#ffffff', peak: 0.22, d: 0.3, blend: 'screen' });
  fx.flash(ctx, t2, { id: 'fl2', color: '#cfe2ff', peak: 0.18, d: 0.3, blend: 'screen' });

  // =============== bars 2½–4 · PRUTY SHIMANO · VYZKOUŠÍTE · PŘÍMO U VODY (Cardiff Exlead) ===============
  let s2 = `<div class="fx-field" id="${ctx.id('f2')}" style="background:linear-gradient(170deg,#1b4479 0%,${DEEP} 55%,${INK} 100%)"></div>`;
  // the water (shop's own gallery photo, by the river) grades in under „přímo u vody“ — duotone navy, soft, behind the rod
  s2 += `<div class="fx-full" id="${ctx.id('wpw')}">${fx.photo(ctx, { id: 'wp', src: AD + 'plate_vanquish_box_water_2.jpg', pos: '18% 0%', treat: 'duo', d1: '#0d2240', d2: '#8fb8e8', kb: { from: { scale: 1.2, x: 40 }, to: { scale: 1.06, x: 0 }, t0: tWater, t1: t4 }, style: 'filter:blur(5px)' })}<div class="fx-full" style="background:linear-gradient(180deg,rgba(11,29,53,.82) 0%,rgba(15,37,65,.38) 46%,rgba(7,20,38,.86) 100%)"></div></div>`;
  ctx.tl.fromTo(ctx.sel('wpw'), { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' }, tWater - 0.05);
  const RD = AD + 'S7_shimano_cardiff_exlead_competition_rod.png';
  const rf = fitBox(ctx, RD, 1000, 1000);
  const rcx = 548, rcy = 948;
  s2 += `<div class="vr-band" style="left:${rcx - 1050}px;top:${rcy - 150}px;width:2100px;height:300px"><i id="${ctx.id('band')}"></i></div>`;
  ctx.tl.fromTo(ctx.sel('band'), { scaleX: 0, opacity: 1 }, { scaleX: 1, opacity: 1, duration: 0.7, ease: 'expo.out' }, tWhip);
  const rod = fx.product(ctx, { id: 'rod', src: RD, w: rf.w, cx: rcx, cy: rcy, ground: 'none', pad: pad(RD), sweepAngle: 135, sweepOpacity: 0.95, maxUp: 1, style: '--p:-10%;-webkit-mask-image:linear-gradient(45deg,#000 calc(var(--p) - 7%),transparent calc(var(--p) + 7%));mask-image:linear-gradient(45deg,#000 calc(var(--p) - 7%),transparent calc(var(--p) + 7%))' });
  s2 += rod.html;
  ctx.tl.fromTo(rod.sel, { '--p': '-10%' }, { '--p': '118%', duration: 0.62, ease: 'power3.inOut' }, tWhip + 0.02);
  ctx.tl.fromTo(ctx.sel('rod-sw'), { backgroundPosition: '-10% 0%' }, { backgroundPosition: '110% 0%', duration: 0.8, ease: 'power2.inOut' }, tWhip + 0.45);
  ctx.tl.fromTo(ctx.sel('rod-sw'), { backgroundPosition: '-10% 0%' }, { backgroundPosition: '110% 0%', duration: 0.8, ease: 'power2.inOut' }, tWater + 0.1);
  fx.parallax(ctx, [{ sel: rod.cam, depth: 1 }], tWhip, t4, { x: -36, y: 26 });
  // kinetic caption of the VO
  const f2 = ctx.fit('Pruty Shimano', { ...DISP, maxW: 900, maxLines: 1, sizes: [132, 124, 116, 110, 104, 98] });
  const f2b = ctx.fit('Přímo u vody', { ...DISP, maxW: 860, maxLines: 1, sizes: [132, 124, 116, 110, 104, 98] });
  const S2 = Math.min(f2.size, f2b.size), Y2 = 392, P2 = Math.round(S2 * 1.0);
  s2 += line(ctx, 'h2a', 'Pruty Shimano', { y: Y2, size: S2, t: tWhip + 0.03 }).html;
  s2 += line(ctx, 'h2b', 'vyzkoušíte', { y: Y2 + P2, size: S2, t: tTry - 0.04 }).html;
  s2 += slab(ctx, 'sl2', { x: SL - 10, y: Y2 + 2 * P2 + S2 * 0.14, w: widthOf(ctx, 'Přímo u vody', S2) + 40, h: S2 * 0.84, t: tWater - 0.06 });
  const h2c = line(ctx, 'h2c', 'přímo u vody', { y: Y2 + 2 * P2, size: S2, t: tWater - 0.02 });
  s2 += h2c.html;
  fx.chroma(ctx, h2c.sel, tWater + 0.06, { amt: 6, d: 0.3 });
  s2 += fx.chip(ctx, { id: 'rtc', label: 'Prodejna Olomouc · půjčte si prut', value: 'Shimano Rod Test Center', x: SL, y: 1268, tone: 'dark', accent: RED, t: t3, from: 'left', font: 'Nunito', vs: 46, ls: 19 });
  ctx.tl.fromTo(ctx.sel('w2'), { x: 620, filter: 'blur(26px)' }, { x: 0, filter: 'blur(0px)', duration: 0.38, ease: 'expo.out' }, tWhip);
  ctx.tl.set(ctx.sel('w2'), { filter: 'none' }, tWhip + 0.4);
  html += scene('sc2', tWhip, t4, `<div class="fx-full" id="${ctx.id('w2')}">${s2}</div>`);

  // =============== bar 4 · the lure box (12 lures · 7 brands) + lockup ===============
  let s3 = fx.field(ctx, { id: 'f3', kind: 'radial', c1: '#22548f', c2: DEEP, at: '50% 40%' });
  const GX = 102, GY = 392, GW = 876, GH = 772, cols = 3, rows = 4, gap = 14;
  const tw = (GW - gap * (cols - 1)) / cols, th = (GH - gap * (rows - 1)) / rows;
  const order = WALL.map((_, i) => i).sort((a, b) => ctx.rnd(a * 7 + 3) - ctx.rnd(b * 7 + 3));
  const tW = (k) => t4 + k * (ctx.BEAT / 4) * 0.62;                         // 16th-ish cascade, all in by ≈ t4 + 0.8 s
  let wall = '';
  WALL.forEach((key, i) => {
    const lu = L[key], c = i % cols, r = Math.floor(i / cols);
    const x = GX + c * (tw + gap), y = GY + r * (th + gap);
    const f = fitBox(ctx, lu.src, tw - 52, th - 64, 1);
    const k = order.indexOf(i), t = tW(k);
    const lx = (tw - f.w) / 2, ly = (th - 34 - f.h) / 2 + 2;
    wall += `<div class="vr-tile" id="${ctx.id(`tile${i}`)}" style="left:${x.toFixed(1)}px;top:${y.toFixed(1)}px;width:${tw.toFixed(1)}px;height:${th.toFixed(1)}px">`
      + `<img class="vr-lure" id="${ctx.id(`lu${i}`)}" src="${ctx.asset(lu.src)}" alt="" style="left:${lx.toFixed(1)}px;top:${ly.toFixed(1)}px;width:${f.w.toFixed(1)}px;height:${f.h.toFixed(1)}px">`
      + `<div class="vr-lbl" style="bottom:14px;font-size:19px">${ctx.esc(lu.brand)}</div></div>`;
    ctx.tl.fromTo(ctx.sel(`tile${i}`), { scale: 0.55, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.6)' }, t);
    ctx.tl.fromTo(ctx.sel(`lu${i}`), { y: -50, rotation: (k % 2 ? 1 : -1) * 28, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 0.55, ease: 'expo.out' }, t + 0.04);
  });
  s3 += `<div class="fx-full" id="${ctx.id('wall')}">${wall}</div>`;
  ctx.tl.set(ctx.sel('wall'), { transformOrigin: '50% 40%' }, 0);
  ctx.tl.fromTo(ctx.sel('wall'), { scale: 1.05 }, { scale: 1, duration: END - t4, ease: 'power2.out' }, t4);
  [ctx.at(4, 2), ctx.at(4, 3)].forEach((t, j) => fx.punch(ctx, ctx.sel(`tile${j ? 4 : 1}`), t, { scale: 1.07, d: 0.3 }));
  // lockup: URL in the brand face, the logo bug lands above it
  const fU = ctx.fit('velka-ryba.cz', { ...DISP, maxW: 840, maxLines: 1, sizes: [108, 100, 96, 92, 88, 84] });
  const UY = 1318;
  const hu = fx.headline(ctx, { ...DISP, id: 'url', text: 'velka-ryba.cz', x: SL, y: UY, w: CW, size: fU.size, maxLines: 1, lh: 0.96, align: 'center', t: tURL, reveal: 'chars', stagger: 0.022, d: 0.5 });
  s3 += hu.html;
  html += scene('sc3', t4, END, s3);
  fx.flash(ctx, t4, { id: 'fl4', color: '#ffffff', peak: 0.28, d: 0.32, blend: 'screen' });

  // =============== the sponsor logo bug (top right, opposite the TA plate) → flies into the lockup ===============
  const lg = ctx.logo(LOGO, { box: [240, ctx.plate.rect.h + 6], id: 'logo', label: 'velkaryba logo bug' });
  const bx = W - ctx.safe.right - lg.w, by = ctx.plate.rect.y - 3;
  const lx1 = (W - lg.w) / 2, ly1 = UY - lg.h - 26;
  html += `<div class="fx-abs" id="${ctx.id('lgw')}" style="left:${bx}px;top:${by}px;width:${lg.w}px;height:${lg.h}px">${lg.html}</div>`;
  const tLg = vs('Velká', 0.25, 0, ctx.at(0, 1));
  ctx.tl.fromTo(ctx.sel('lgw'), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, Math.max(0.06, tLg));
  ctx.tl.fromTo(ctx.sel('lgw'), { x: 0, y: 0 }, { x: lx1 - bx, y: ly1 - by, duration: 0.55, ease: 'expo.inOut' }, tLogoFly);

  // =============== transitions ===============
  fx.tIn(ctx, 'zoom', { d: 0.42 });
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
  fx.productIn(ctx, 'hp', 0, { from: 'spin', d: 0.7 });
  ctx.tl.fromTo(back.sel, { opacity: 0 }, { opacity: 1, duration: 0.001, ease: 'none' }, ctx.at(0, 3) - 0.01);
  fx.sweep(ctx, 'hp', 0.42, { d: 0.75 });
  fx.flip(ctx, 'hp', 'hk', ctx.at(0, 3) - 0.1, { d: 0.42 });
  fx.pushIn(ctx, ctx.sel('hpw'), 0.5, END, { from: 1, to: 1.07, origin: '50% 56%' });
  const H = fx.headline(ctx, { ...DISP, id: 'hh', text: 'Trout Area?', x: SL, y: 392, w: CW, maxLines: 2, sizes: [196, 184, 172, 160, 150, 140], lh: 0.94, color: DEEP, t: 0.03, d: 0.5 });
  html += H.html;
  html += `<div class="vr-tag" id="${ctx.id('hsub')}" style="left:${SL + 4}px;top:${Math.round(392 + H.h + 26)}px;font-size:46px;color:${DEEP};font-style:italic">velka-ryba.cz</div>`;
  ctx.tl.fromTo(ctx.sel('hsub'), { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.45, ease: 'expo.out' }, 0.3);
  fx.tOut(ctx, 'flash', { color: DEEP, d: 0.14 });
  const css = `${ctx.S} .vr-tag{position:absolute;font-family:'Nunito';font-weight:900;text-transform:uppercase;white-space:nowrap;line-height:1}`;
  return { html, css, timeline: ctx.tl };
}

// =============== REEL END CARD (2 bars): lockup + outline marquee ===============
export function endCard(ctx) {
  let html = `<div class="fx-field" id="${ctx.id('ef')}" style="background:radial-gradient(110% 70% at 50% 42%, #22548f 0%, ${DEEP} 58%, ${INK} 100%)"></div>`;
  html += fx.marquee(ctx, { id: 'emq', text: 'Vše na přívlač', y: 1585, size: 150, font: 'Nunito', wght: 900, italic: true, color: '#ffffff', outline: true, ow: 2, speed: 90, style: 'opacity:.2' });
  fx.tIn(ctx, 'flash', { color: DEEP, d: 0.22 });
  const E = fx.endCard(ctx, { t: 0.05, logo: LOGO, url: 'velka-ryba.cz', line: 'Partner MČR v Trout Area 2026', fg: '#ffffff', accent: RED, font: 'Nunito', textFont: 'Nunito', scale: 1.5 });
  html += E.html;
  return { html, css: '', timeline: ctx.tl };
}
