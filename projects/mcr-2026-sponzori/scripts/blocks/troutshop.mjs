// TROUTSHOP.EU · 5 bars (plan A: bars 14–18) · concept A „RISING SUN · SPECIALISTA“ (research/troutshop_ad.md)
// Brand world = the logo: studio black, red #E3000F „rising sun“ disc + rays, white Anton caps, Roboto Condensed labels.
// The spoons become the sun's rays (fan of 9 spoons = assortment moment), the sun floods the frame red for the crank,
// sets again for a beat-cut colour run of 8 spoon faces under a „3 100+ plandavek v nabídce“ counter, rises for the lockup.
//   bar 0  hero: Nories ROONEY 2,8 g 101 (gold) rises in front of the sun, macro push-in + light sweeps · „SPECIALISTA NA PSTRUHY“ (VO)
//   bar 1  fan of 9 spoons (8 products, 3 brands) opens on the downbeat, beat punches, light wave · „RODINNÁ FIRMA OD ROKU“ (VO)
//   bar 2  sun floods red · Nories CRANKIN' PUPA 109 (clear) slides in on a red floor · odometer 1999 on „devatenáct set…“ (VO)
//   bar 3  sunset → black · 8 spoon faces cut on every 8th note, glow tinted by each spoon · odometer „3 100+ plandavek v nabídce“
//   bar 4  sunrise lockup: logo (≤ TA plate) + TROUTSHOP.EU + „Generální partner Trout Area Slovakia“ + „Věnuje ceny · MČR 2026“
// Products: assets_prep/troutshop/ads/ (clean cut-outs, ts_polish). All hard baits (MČR = hard baits); no soft bait shown.
// Only verified copy (research/troutshop.md Verification, troutshop_ad.md §4). Velvet Arts / Nories / Forest are NOT Troutshop brands:
// they appear only as product names next to the products.
import * as fx from '../lib/fx.mjs';
import * as ts from '../lib/fx_troutshop.mjs';

export const fonts = {
  'Roboto Condensed': {
    s: { 400: 'roboto-condensed-{r}-400-normal', 600: 'roboto-condensed-{r}-600-normal', 700: 'roboto-condensed-{r}-700-normal', 800: 'roboto-condensed-{r}-800-normal' },
    si: { 700: 'roboto-condensed-{r}-700-italic', 800: 'roboto-condensed-{r}-800-italic' },
    use: 'Troutshop text font (site CSS --wd-text-font); italic = logo wordmark mood',
  },
};
export const theme = { bg: '#050505', bg2: '#2a0306', fg: '#ffffff', accent: '#e3000f', accent2: '#c80411', font: { display: 'Anton', text: 'Roboto Condensed' }, wght: 400, upper: true, light: false };
export const meta = {
  reel: true,
  hook: { headline: 'Milujeme lov pstruhů', sub: 'troutshop.eu' },
  endCard: { logo: 'on_dark', line: 'Partner MČR v Trout Area 2026' },
};

const RED = '#e3000f', INK = '#0a0a0a';
const PIV = [540, 1480];                       // sun centre / fan pivot (bottom centre, under the Reels caption zone)
// fan = the sun's rays: 9 spoons, colour-sorted, gold ROONEY 101 (the hero) in the centre.
// ±60° (not ±72°): every spoon body stays inside the 1080 frame (only the outer hook tips may touch the edge)
const FAN = [
  { k: 'miua', th: -60 }, { k: 'rooney002b', th: -45 }, { k: 'forte35b', th: -30 }, { k: 'tulleb', th: -15 }, { k: 'rooney101a', th: 0 },
  { k: 'sk20a', th: 15 }, { k: 'forte30a', th: 30 }, { k: 'rooney002a', th: 45 }, { k: 'forte32a', th: 60 },
];
const FB = 300, FR0 = 245, FC = 4;             // fan spoon body, eye radius (eye clears the sun disc), centre arm (hero match-cut)
// beat-cut colour run (bar 3): 7 faces (sides not used in the fan), one per 8th note, ends on the newest product (Velvet Arts Forte 2,1 g 32, back „VA 2.1“)
const RUN = ['miub', 'sk20b', 'forte35a', 'forte30b', 'tullea', 'rooney101b', 'forte32b'];   // 6 eighths + the last face holds a beat
const RUNC = ['#d9d40c', '#c98a1c', '#b3101c', '#c9b48a', '#d4a52a', '#f0c40c', '#ec2d5a'];   // glow tint per face (bright version of its colour)

export default function troutshop(ctx) {
  const { bar, W } = ctx, S = ctx.S;
  const L = ctx.safe.left, CW = W - L - ctx.safe.right;
  const vo = (q, d) => ctx.vo.at(q) ?? d;
  const t1 = bar(1), t2 = bar(2), t3 = bar(3), t4 = bar(4), END = ctx.dur;
  const tSpec = vo('specialista', 1.15), tNa = vo('na pstruhy', 1.89), tRod = vo('rodinná', 2.81), tOd = vo('od roku', 3.62), tYear = vo('1999', 4.01);
  let html = '';

  // ---------- world: black studio, red glow from below, rotating rays, outline name, the sun ----------
  html += fx.field(ctx, { kind: 'radial', c1: '#3a0408', c2: theme.bg, at: '50% 92%' });
  html += fx.bigType(ctx, { id: 'big', text: 'Troutshop', font: 'Anton', wght: 400, size: 430, y: 760, x: -30, color: '#ffffff', outline: true, ow: 2, opacity: 0.07, drift: -300, tracking: 0.01 });
  html += ts.rays(ctx, { id: 'ry', x: PIV[0], y: PIV[1], size: 2900, color: RED, n: 18, duty: 0.4, opacity: 0.42, spin: 16 });
  ctx.tl.fromTo(ctx.sel('ry-w'), { scale: 0.55, opacity: 0.3 }, { scale: 1, opacity: 1, duration: 1.0, ease: 'expo.out' }, 0);

  // ---------- bar 1: fan of spoons (assortment) — behind the sun (rays) and the hero ----------
  const F = ts.fan(ctx, { id: 'fan', items: FAN.map((it, i) => (i === FC ? { ...it, bg: true } : it)), x: PIV[0], y: PIV[1], body: FB, r0: FR0 });
  html += F.html;
  ts.fanOpen(ctx, F, FAN, t1 - 0.16, { d: 0.75, step: 0.03, skip: [FC] });
  // the centre ray IS the hero: hidden until the hero lands in its pose on the bar-1 downbeat (match-cut, no cross-fade)
  ctx.tl.set(F.arm(FC), { opacity: 0 }, 0);
  ctx.tl.set(F.arm(FC), { opacity: 1 }, t1);
  html += ts.sun(ctx, { id: 'sun', x: PIV[0], y: PIV[1], r: 240 });
  ctx.tl.fromTo(ctx.sel('sun'), { y: 300, scale: 0.7 }, { y: 0, scale: 1, duration: 0.9, ease: 'expo.out' }, 0);
  // red world (bar 2): dark rays over the flooded sun
  html += ts.rays(ctx, { id: 'ry2', x: PIV[0], y: PIV[1], size: 3000, color: '#000000', n: 18, duty: 0.4, opacity: 0.16, spin: -10, style: 'opacity:0' });
  [ctx.at(1, 1), ctx.at(1, 2)].forEach((t) => fx.punch(ctx, F.sel, t, { scale: 1.035, d: 0.3 }));
  ts.fanSweep(ctx, 'fan', FAN.length, ctx.at(1, 2) - 0.1, { step: 0.045 });
  ctx.tl.fromTo(F.sel, { y: 0, scale: 1 }, { y: 1250, scale: 0.8, duration: 0.34, ease: 'power3.in' }, t2 - 0.34);          // sinks into the sun
  ctx.tl.fromTo(F.sel, { y: 1250, scale: 0.8 }, { y: 170, scale: 0.8, duration: 0.75, ease: 'expo.out' }, t4 - 0.24);      // sunrise lockup
  ts.fanSweep(ctx, 'fan', FAN.length, t4 + 0.55, { step: 0.04 });
  // brand stamp on the sun disc (two lines so it stays inside the disc at a phone-readable size)
  const brands = `<div class="ts-brands" id="${ctx.id('brands')}"><span>${ctx.esc(ctx.nb('Nories · Forest'))}</span><span>${ctx.esc('Velvet Arts')}</span></div>`;
  html += fx.scene(ctx, 'brs', t1 + 0.25, t2 - 0.3, brands, { inD: 0.3, outD: 0.2 });

  // ---------- bar 0: hero ROONEY 2,8 g 101 (gold) in front of the rising sun ----------
  // diagonal pose (hook up-right, clear of the headline box x ≤ 870 / y ≤ 745), full opacity from frame 0: a macro slam on the cut
  const hc = [535, 1170], HB = 700, HA = 47, CS = 1.09, CR = -3;
  const h1 = ts.spoon(ctx, { id: 'h1', k: 'rooney101a', cx: hc[0], cy: hc[1], body: HB, angle: HA, so: 0.55, shadow: '0 22px 26px rgba(0,0,0,.5)' });
  html += `<div class="fx-full" id="${ctx.id('h1cam')}" style="transform-origin:${hc[0]}px ${hc[1]}px">${h1.html}</div>`;
  ctx.tl.fromTo(h1.sel, { x: 0, y: 150, scale: 1.24, rotation: 0 }, { x: 0, y: 0, scale: 1, rotation: 0, duration: 0.75, ease: 'expo.out' }, 0);
  ctx.tl.fromTo(ctx.sel('h1cam'), { scale: 1, rotation: 0 }, { scale: CS, rotation: CR, duration: t1 - 0.4, ease: 'power1.inOut' }, 0.4);
  ts.sweep(ctx, 'h1', 0.3, { d: 0.8 });
  ts.sweep(ctx, 'h1', ctx.at(0, 3) - 0.05, { d: 0.6 });
  // match-cut into the fan: the hero shrinks + turns into the exact pose of the fan's centre spoon (same cut-out) and is
  // swapped for it on the downbeat while the other 8 rays burst out from behind the sun
  {
    const G = ts.GEO.rooney101a, [gw, gh] = ctx.dims(ts.srcOf('rooney101a'));
    const fs = FB / (G.L * gh), tc = [PIV[0], PIV[1] - FR0 - fs * Math.hypot((G.c[0] - G.tail[0]) * gw, (G.c[1] - G.tail[1]) * gh)];
    const dx = tc[0] - hc[0], dy = tc[1] - hc[1], cr = (CR * Math.PI) / 180;   // target offset → hero-local (inside the cam: ÷ scale, un-rotate)
    const lx = (dx * Math.cos(cr) + dy * Math.sin(cr)) / CS, ly = (-dx * Math.sin(cr) + dy * Math.cos(cr)) / CS;
    // shrink early, turn late: the hook never sweeps through the headline
    ctx.tl.fromTo(h1.sel, { x: 0, y: 0, scale: 1 }, { x: lx, y: ly, scale: FB / HB / CS, duration: 0.4, ease: 'power3.inOut' }, t1 - 0.4);
    ctx.tl.fromTo(h1.sel, { rotation: 0 }, { rotation: -HA - CR, duration: 0.3, ease: 'power2.in' }, t1 - 0.3);
    ctx.tl.set(h1.sel, { opacity: 0 }, t1);
  }
  html += ts.callout(ctx, { id: 'co1', name: 'Nories ROONEY', sub: '2,8 g · barva 101', x: ctx.W - ctx.safe.uiRight, y: 1236, align: 'r', t: 0.55, t1: t1 - 0.42 });

  // ---------- bar 2: crank in the red sun ----------
  ctx.tl.fromTo(ctx.sel('sun'), { scale: 1 }, { scale: 7.6, duration: 0.46, ease: 'power2.inOut' }, t2 - 0.26);
  ctx.tl.fromTo(ctx.sel('ry2-w'), { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'none' }, t2);
  const pu = fx.product(ctx, { id: 'pu', src: ts.PUPA, w: 830, cx: 548, floor: 1350, ground: 'floor', reflect: 0.3, shadow: 0.55, pad: [0.028, 0.052, 0.028, 0.052], sweepOpacity: 0.55 });
  html += pu.html;
  ctx.tl.fromTo(pu.sel, { x: -1180, rotation: -10, opacity: 1 }, { x: 0, rotation: 0, opacity: 1, duration: 0.62, ease: 'expo.out' }, t2 - 0.28);   // ~in place on the downbeat
  fx.float(ctx, pu.cam, t2 + 0.5, t3 - 0.4, { y: -12, rot: 1.2, period: ctx.BAR / 2 });
  fx.sweep(ctx, 'pu', t2 + 0.5, { d: 0.85 });
  ctx.tl.fromTo(pu.sel, { x: 0, rotation: 0, opacity: 1 }, { x: 1300, rotation: 10, opacity: 1, duration: 0.34, ease: 'power3.in' }, t3 - 0.34);
  html += ts.callout(ctx, { id: 'co2', name: 'Nories Crankin’ Pupa', sub: 'Floating · 34 mm · 2,6 g', x: L, y: 1350, t: t2 + 0.45, t1: t3 - 0.4 });
  // sunset: the red sun shrinks back into the horizon on the bar-3 downbeat
  ctx.tl.fromTo(ctx.sel('sun'), { scale: 7.6 }, { scale: 0, duration: 0.32, ease: 'power3.in' }, t3 - 0.32);
  ctx.tl.fromTo(ctx.sel('ry2-w'), { opacity: 1 }, { opacity: 0, duration: 0.3, ease: 'none' }, t3 - 0.3);

  // ---------- bar 3: beat-cut colour run + counter ----------
  const e8 = (i) => (i % 2 ? (ctx.at(3, (i - 1) / 2) + ctx.at(3, (i + 1) / 2)) / 2 : ctx.at(3, i / 2));   // i-th 8th note of bar 3
  const runT = [...RUN.map((_, i) => e8(i)), t4];
  html += `<div class="fx-glow" id="${ctx.id('rg')}" style="left:${W / 2 - 560}px;top:${1230 - 600}px;width:1200px;height:1200px;background:radial-gradient(closest-side,currentColor,transparent);color:${RUNC[0]};opacity:0;mix-blend-mode:screen"></div>`;
  ctx.tl.set(ctx.sel('rg'), { opacity: 0.8 }, t3);
  RUN.forEach((k, i) => {
    const sp = ts.spoon(ctx, { id: `r${i}`, k, cx: 556, cy: 1230, body: 530, angle: 40, so: 0.75, style: 'opacity:0' });
    html += sp.html;
    const a = runT[i], b = runT[i + 1];
    ctx.tl.set(sp.sel, { opacity: 1 }, a);
    ctx.tl.fromTo(sp.sel, { scale: 1.16 }, { scale: 1, duration: Math.min(0.2, b - a - 0.03), ease: 'power3.out' }, a);
    if (i > 0) ctx.tl.set(ctx.sel('rg'), { color: RUNC[i] }, a);
    if (i < RUN.length - 1) ctx.tl.set(sp.sel, { opacity: 0 }, b);
    else {   // last face: thrown up out of frame into the downbeat (no ghost fade over the rising fan)
      ts.sweep(ctx, `r${i}`, a + 0.02, { d: 0.45 });
      ctx.tl.fromTo(sp.sel, { y: 0, rotation: 0 }, { y: -1450, rotation: 16, duration: 0.3, ease: 'power3.in' }, t4 - 0.3);
      ctx.tl.set(sp.sel, { opacity: 0 }, t4);
    }
  });
  ctx.tl.fromTo(ctx.sel('rg'), { opacity: 0.8 }, { opacity: 0, duration: 0.25, ease: 'power1.in' }, t4 - 0.25);
  let cnt = fx.odometer(ctx, { id: 'cnt', value: '3 100', suffix: '+', x: L - 4, y: 392, size: 240, font: 'Anton', wght: 400, color: '#ffffff', t: t3 + 0.02, d: 0.65, stagger: 0.05 });
  cnt += `<div class="ts-lbl" style="left:${L}px;top:${392 + 240 + 12}px">${ctx.esc(ctx.nb('plandavek v nabídce'))}</div>`;
  html += fx.scene(ctx, 'cs', t3, t4 - 0.08, cnt, { inD: 0.001, outD: 0.22 });

  // ---------- kinetic type (VO-synced) ----------
  const H1 = ts.lines(ctx, { id: 'hl1', lines: [[{ w: 'Specialista' }], [{ w: 'na' }, { w: 'pstruhy', c: RED }]], y: 410, sizes: [176, 164, 152, 140], times: [tSpec - 0.1, Math.min(tNa - 0.1, tSpec + 0.32)], out: tRod - 0.34 });
  html += H1.html;
  const H2 = ts.lines(ctx, { id: 'hl2', lines: [[{ w: 'Rodinná firma' }], [{ w: 'od roku' }]], y: 410, sizes: [132, 124, 116, 108], times: [tRod - 0.08, tOd - 0.1], out: t3 - 0.4 });   // gone before the bar-3 downbeat
  html += H2.html;
  html += fx.odometer(ctx, { id: 'yr', value: '1999', x: L - 6, y: 410 + H2.h + 6, size: 270, font: 'Anton', wght: 400, color: INK, t: tYear - 0.1, d: 0.7, stagger: 0.06 });
  ctx.tl.fromTo(ctx.sel('yr'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, tYear - 0.14);
  ctx.tl.fromTo(ctx.sel('yr'), { opacity: 1, y: 0 }, { opacity: 0, y: -60, duration: 0.26, ease: 'power3.in' }, t3 - 0.34);
  // URL tag (top right, mirrors the TA plate) from the spoken „Troutshop“ until the lockup takes over
  html += `<div class="ts-tag" id="${ctx.id('tag')}" style="right:${ctx.safe.right}px;top:276px"><i></i>${ctx.esc('troutshop.eu')}</div>`;
  ctx.tl.fromTo(ctx.sel('tag'), { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.5, ease: 'expo.out' }, Math.max(0.12, vo('troutshop', 0.25) - 0.05));
  ctx.tl.fromTo(ctx.sel('tag'), { opacity: 1, x: 0 }, { opacity: 0, x: 40, duration: 0.25, ease: 'power2.in' }, t4 - 0.25);

  // ---------- bar 4: sunrise lockup ----------
  ctx.tl.fromTo(ctx.sel('sun'), { scale: 0, y: 0 }, { scale: 0.78, y: 170, duration: 0.75, ease: 'expo.out' }, t4 - 0.24);
  ctx.tl.fromTo(ctx.sel('ry-w'), { y: 0 }, { y: 170, duration: 0.75, ease: 'expo.out' }, t4 - 0.24);
  const lg = ctx.logo('on_dark', { box: [300, 150], at: [t4, END], id: 'logo' });
  const yLogo = 500;
  html += `<div class="fx-abs" id="${ctx.id('lw')}" style="left:${(W - lg.w) / 2}px;top:${yLogo}px;width:${lg.w}px;height:${lg.h}px">${lg.html}</div>`;
  ctx.tl.fromTo(ctx.sel('lw'), { opacity: 0, scale: 0.7, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: 'back.out(1.8)' }, t4 - 0.02);
  const U = ts.lines(ctx, { id: 'url', lines: [[{ w: 'troutshop' }, { w: '.eu', c: RED, tight: true }]], y: yLogo + lg.h + 26, align: 'center', sizes: [178, 164, 150, 140], times: [t4 - 0.08], stagger: 0.02, d: 0.42 });
  html += U.html;
  const yP = yLogo + lg.h + 26 + U.h + 22;
  html += `<div class="ts-sub" id="${ctx.id('gp')}" style="top:${yP}px"><span class="fx-ln"><span>${ctx.esc(ctx.nb('Generální partner Trout Area Slovakia'))}</span></span></div>`;
  ctx.tl.fromTo(`${ctx.sel('gp')} .fx-ln > span`, { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'expo.out' }, t4 + 0.04);
  html += ts.pill(ctx, { id: 'pz', text: 'Věnuje ceny', sub: 'MČR 2026', cx: W / 2, y: yP + 62, t: t4 + 0.14 });

  // ---------- accents + transitions ----------
  fx.flash(ctx, 0, { id: 'f0', color: RED, peak: 0.32, d: 0.45, blend: 'screen' });
  fx.flash(ctx, t3, { id: 'f3', color: '#ffffff', peak: 0.16, d: 0.22, blend: 'screen' });
  fx.tIn(ctx, 'cut');
  fx.tOut(ctx, 'slice', { d: 0.3 });   // short: the lockup reads ≥ 1.2 s and no dead frames before the next world

  const css = `${ts.CSS(S)}
${S} .ts-brands{position:absolute;left:0;right:0;top:${PIV[1] - 74}px;display:flex;flex-direction:column;align-items:center;gap:4px;font-family:'Roboto Condensed';font-weight:800;font-size:36px;line-height:1.08;letter-spacing:.1em;text-transform:uppercase;color:#fff;text-shadow:0 2px 12px rgba(90,0,0,.45)}
${S} .ts-lbl{position:absolute;font-family:'Roboto Condensed';font-weight:700;font-size:46px;letter-spacing:.1em;text-transform:uppercase;color:#fff}
${S} .ts-tag{position:absolute;display:flex;align-items:center;gap:12px;font-family:'Roboto Condensed';font-weight:800;font-style:italic;font-size:38px;letter-spacing:.04em;text-transform:uppercase;color:#fff;line-height:1}
${S} .ts-tag i{display:block;width:10px;height:30px;background:${RED};transform:skewX(-14deg)}
${S} .ts-sub{position:absolute;left:0;right:0;text-align:center;font-family:'Roboto Condensed';font-weight:600;font-size:34px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.9)}`;
  return { html, css };
}

// ---------- Reel hook (1 bar): red world, gold ROONEY macro, „MILUJEME LOV PSTRUHŮ“ readable at 0.3 s ----------
export function hook(ctx) {
  const S = ctx.S, M = meta.hook, L = ctx.safe.left;
  let html = fx.field(ctx, { kind: 'linear', c1: '#e6000f', c2: '#b80410', angle: 180 });
  html += ts.rays(ctx, { id: 'hry', x: 540, y: 1600, size: 3000, color: '#000000', n: 18, duty: 0.4, opacity: 0.17, spin: 10 });
  // spoon: tail bottom-left (x ≈ 130), hook tip ≈ (1040, 750): right of / below the headline, inside the frame
  const sp = ts.spoon(ctx, { id: 'hs', k: 'rooney101a', cx: 440, cy: 1290, body: 820, angle: 48, so: 0.6, shadow: '0 40px 40px rgba(60,0,0,.55)' });
  html += `<div class="fx-full" id="${ctx.id('hcam')}" style="transform-origin:960px 780px">${sp.html}</div>`;
  ctx.tl.fromTo(sp.sel, { scale: 1.12, y: 80 }, { scale: 1, y: 0, duration: 0.6, ease: 'expo.out' }, 0);
  ctx.tl.fromTo(ctx.sel('hcam'), { scale: 1, rotation: 0 }, { scale: 1.06, rotation: -1.5, duration: ctx.dur - 0.5, ease: 'none' }, 0.5);
  ts.sweep(ctx, 'hs', 0.2, { d: 0.75 });
  // headline is fully there on frame 0 (thumbnail / first impression) and settles 1.14 → 1 instead of revealing from a mask
  const H = ts.lines(ctx, { id: 'hh', lines: [[{ w: 'Milujeme lov' }], [{ w: 'pstruhů', c: INK }]], y: 400, sizes: [196, 184, 172, 160, 150], times: [], d: 0.45 });
  html += `<div class="fx-full" id="${ctx.id('hhw')}" style="transform-origin:${ctx.W / 2}px 400px">${H.html}</div>`;
  ctx.tl.fromTo(ctx.sel('hhw'), { scale: 1.07, y: -8 }, { scale: 1, y: 0, duration: 0.55, ease: 'expo.out' }, 0);   // stays inside the frame
  html += `<div class="ts-tag" id="${ctx.id('hsub')}" style="left:${L}px;top:${400 + H.h + 24}px"><i></i>${ctx.esc(M.sub)}</div>`;
  ctx.tl.fromTo(ctx.sel('hsub'), { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.45, ease: 'expo.out' }, 0.18);
  const css = `${ts.CSS(S)}
${S} .ts-tag{position:absolute;display:flex;align-items:center;gap:12px;font-family:'Roboto Condensed';font-weight:800;font-style:italic;font-size:46px;letter-spacing:.04em;text-transform:uppercase;color:#fff;line-height:1}
${S} .ts-tag i{display:block;width:12px;height:36px;background:${INK};transform:skewX(-14deg)}`;
  return { html, css };
}

// ---------- Reel end card (2 bars): black + sunrise fan, TA plate hero ×1.5, logo ≤ TA, URL, partner line, prize chip ----------
export function endCard(ctx) {
  const S = ctx.S, W = ctx.W, M = meta.endCard, END = ctx.dur;
  const piv = [540, 1730];
  let html = fx.field(ctx, { kind: 'radial', c1: '#3a0408', c2: theme.bg, at: '50% 95%' });
  html += ts.rays(ctx, { id: 'ery', x: piv[0], y: piv[1], size: 3000, color: RED, n: 18, duty: 0.4, opacity: 0.38, spin: 12 });
  ctx.tl.fromTo(ctx.sel('ery-w'), { scale: 0.86, opacity: 0.8 }, { scale: 1, opacity: 1, duration: 0.9, ease: 'expo.out' }, 0);
  const F = ts.fan(ctx, { id: 'efan', items: FAN, x: piv[0], y: piv[1], body: 270, r0: 215 });
  html += F.html;
  ts.fanOpen(ctx, F, FAN, 0, { d: 0.8, step: 0.025, s0: 0.82, a0: 0.72 });   // already a fan on the first frame, blooms open
  ctx.tl.fromTo(F.sel, { y: 120 }, { y: 0, duration: 0.8, ease: 'expo.out' }, 0);   // rises with the sun
  html += ts.sun(ctx, { id: 'esun', x: piv[0], y: piv[1], r: 210 });
  ctx.tl.fromTo(ctx.sel('esun'), { y: 120, scale: 0.85 }, { y: 0, scale: 1, duration: 0.8, ease: 'expo.out' }, 0);
  ts.fanSweep(ctx, 'efan', FAN.length, 1.2, { step: 0.05 });
  // lockup (own version of fx.endCard: Anton 400 / Roboto Condensed, no faux bold)
  const scale = 1.5, fly = 0.6, t = 0.05;
  const P = ctx.plate.hero(t, END, { scale, cx: W / 2, cy: 470, fly });
  const lg = ctx.logo(M.logo, { box: [760, 300], scale, at: [t + fly, END], id: 'elogo', label: `${ctx.cid} end card` });
  const tt = t + fly * 0.6;
  let y = P.y + P.h + 40;
  html += `<div class="ts-sub" id="${ctx.id('eline')}" style="top:${y}px"><span class="fx-ln"><span>${ctx.esc(ctx.nb(M.line))}</span></span></div>`;
  ctx.tl.fromTo(`${ctx.sel('eline')} .fx-ln > span`, { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'expo.out' }, tt);
  y += 34 + 26;
  html += `<div class="fx-abs" id="${ctx.id('ebar')}" style="left:${W / 2 - 60}px;top:${y}px;width:120px;height:6px;border-radius:3px;background:${RED}"></div>`;
  ctx.tl.fromTo(ctx.sel('ebar'), { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'expo.out' }, tt + 0.08);
  y += 6 + 34;
  html += `<div class="fx-abs" id="${ctx.id('elw')}" style="left:${(W - lg.w) / 2}px;top:${y}px;width:${lg.w}px;height:${lg.h}px">${lg.html}</div>`;
  ctx.tl.fromTo(ctx.sel('elw'), { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.7, ease: 'expo.out' }, tt + 0.14);
  y += lg.h + 30;
  const U = ts.lines(ctx, { id: 'eurl', lines: [[{ w: 'troutshop' }, { w: '.eu', c: RED, tight: true }]], y, align: 'center', sizes: [150, 140, 128, 116], times: [tt + 0.26], stagger: 0.03 });
  html += U.html;
  y += U.h + 26;
  html += ts.pill(ctx, { id: 'epz', text: 'Věnuje ceny', sub: 'MČR 2026', cx: W / 2, y, t: tt + 0.5 });
  fx.tIn(ctx, 'cut');
  const css = `${ts.CSS(S)}
${S} .ts-sub{position:absolute;left:0;right:0;text-align:center;font-family:'Roboto Condensed';font-weight:700;font-size:34px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.92)}`;
  return { html, css };
}
