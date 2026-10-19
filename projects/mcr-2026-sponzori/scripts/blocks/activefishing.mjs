// ACTIVEFISHING.CZ · 5 bars (plan A: bars 19–23) · concept B „COLOUR DROP“ (research/activefishing_ad.md §4)
// Brand world = the shop itself: white Shoptet body, Nunito, orange pill buttons (#F28A27), the logo's orange gradient
// #E39025→#DF5942 used as light and as ONE full-bleed counter beat; Saira Extra Condensed 900 for numbers / short caps.
//   bar 0  cold open: extreme macro of Timon Chibi Futten FS (eye + lip) slides in, light sweep, speed-ramp pull-back
//          · „activefishing.cz“ + „Český e-shop pro trout area“ (VO: Activefishing – e-shop)
//   bar 1  COLOUR DROP: the same lure switches colourway on every beat (Cobalt → Gold → Red → Hologram → Chart Pink),
//          backdrop tint follows · „ZROZENÝ Z VÁŠNĚ PRO PŘÍVLAČ“ word by word on the VO · chip „Timon · Chibi Futten FS · 51 mm“
//   bar 2  hard cut to the logo-orange field: odometer „PŘES 1 300+ PLANDAVEK“ (outline → fill on the VO word), a white shop card
//          slams up and a fan of 5 spoons (Nories, Velvet Arts ×2, ValkeIN, Khor) opens on it; the card zooms into the next world
//   bar 3  white again: VARIVAS ES2 spool turns in 3D, Mukai / Timon / Lucky Craft cranks in a parallax depth stack,
//          pill „OSOBNÍ PŘÍSTUP“ on the VO + „Rychlost doručení · Unikátní sortiment“ (site benefits)
//   bar 4  lockup: logo (≤ TA plate) slides to the centre, „activefishing.cz“, two shop-shelf carousels (777 woblerů / 1 300+ plandavek,
//          13 products), pill „Věnuje ceny · MČR 2026“ → rounded shop-card tiles close into the next block
// 14 products from 8 brands (Timon, Mukai, Lucky Craft, Nories, Velvet Arts, ValkeIN, Khor, VARIVAS). Activefishing resells them:
// no „vlastní“, no prices. Counts 1 300+ (1340) / 777 = live counts from 19. 10. 2026 (recheck before the final render).
import * as fx from '../lib/fx.mjs';
import * as af from '../lib/fx_activefishing.mjs';

const { C, SAIRA } = af;

export const fonts = {
  [SAIRA]: {
    s: { 700: 'saira-extra-condensed-{r}-700-normal', 800: 'saira-extra-condensed-{r}-800-normal', 900: 'saira-extra-condensed-{r}-900-normal' },
    use: 'Activefishing display (echo of the logo lettering) — @fontsource/saira-extra-condensed 5.3.0, OFL',
  },
};
export const theme = { bg: '#f4f3f1', bg2: '#ffffff', fg: '#111111', accent: '#f28a27', accent2: '#df5942', font: { display: SAIRA, text: 'Nunito' }, wght: 900, upper: true, light: true };
export const meta = {
  reel: true,
  hook: { headline: 'Přes 1 300 plandavek', sub: 'activefishing.cz' },
  endCard: { logo: 'on_light', line: 'Partner MČR v Trout Area 2026' },
};

const CW_ORDER = ['chart', 'cobalt', 'gold', 'red', 'holo'];          // colourway set (same model, same pose)

// white studio world (paper sweep + warm orange key light)
function world(ctx, { id = 'w', glowX = 900, glowY = 560 } = {}) {
  let h = `<div class="fx-field" id="${ctx.id(`${id}f`)}" style="background:radial-gradient(130% 85% at 50% 40%, #ffffff 0%, #f5f4f1 52%, #e6e3de 100%)"></div>`;
  h += `<div class="fx-glow" id="${ctx.id(`${id}g`)}" style="left:${glowX - 700}px;top:${glowY - 700}px;width:1400px;height:1400px;background:radial-gradient(closest-side, rgba(245,155,16,.30), rgba(242,138,39,.10) 55%, rgba(242,138,39,0))"></div>`;
  return h;
}
const urlHtml = (ctx, id, y, size) => `<div class="af-url" id="${ctx.id(id)}" style="top:${y}px;font-size:${size}px"><span class="fx-ln"><span>${fx.split('activefishing', 'chars')}<span class="o">${fx.split('.cz', 'chars')}</span></span></span></div>`;

export default function activefishing(ctx) {
  af.prime(ctx);
  const { W, S } = ctx, L = ctx.safe.left, CW = W - L - ctx.safe.right;
  const b = [0, 1, 2, 3, 4, 5].map((i) => ctx.bar(i)), END = ctx.dur;
  const beat = (bar, i) => ctx.at(bar, i);
  const cl = (t, a, z) => Math.max(a, Math.min(z, t));
  const vo = (q, d) => ctx.vo.at(q) ?? d;
  // VO anchors (block-local), clamped into their bars so a regenerated VO cannot push a message out of its scene
  const tAF = cl(vo('Activefishing', 0.25), 0.15, 0.6);
  const tZr = cl(vo('zrozený', 1.67), b[1] - 0.25, b[1] + 0.3), tZ = cl(vo('z vášně', 2.15), tZr + 0.2, b[2] - 1.2);
  const tVa = cl(vo('vášně', 2.24), tZ + 0.05, b[2] - 1.1), tPro = cl(vo('pro přívlač', 2.65), tVa + 0.2, b[2] - 0.8), tPr = cl(vo('přívlač', 2.88), tPro + 0.15, b[2] - 0.6);
  const tPl = cl(vo('plandavek', 4.72), b[2] + 0.6, b[3] - 0.6), tOs = cl(vo('osobní', 5.55), b[3] - 0.1, b[3] + 0.5);
  let html = world(ctx);

  // =============================== bars 0–1: macro → colour drop ===============================
  const V0 = 780, CX = 540, CY = 1000, ROT = -5;
  const G = CW_ORDER.map((k) => af.geom(ctx, k, { V: V0, cx: CX, cy: CY }));
  const eye = [G[0].left + af.P.chart.eye[0] * G[0].w, G[0].top + af.P.chart.eye[1] * G[0].h];
  let lure = `<i class="af-sh" style="left:${CX - V0 * 0.4}px;top:${CY + G[0].vh * 0.5 + 4}px;width:${V0 * 0.8}px;height:46px"></i>`;
  CW_ORDER.forEach((k, i) => {
    const g = G[i];
    lure += `<div class="af-p" id="${ctx.id(`cw${i}`)}" style="left:${g.left.toFixed(1)}px;top:${g.top.toFixed(1)}px;width:${g.w.toFixed(1)}px;height:${g.h.toFixed(1)}px;${i ? 'opacity:0' : ''}"><img src="${g.url}" alt="">${i === 0 || i === 3 ? `<i class="fx-prod-sweep" id="${ctx.id(`cw${i}-sw`)}" style="-webkit-mask-image:url(${g.url});mask-image:url(${g.url});--sa:105deg;--so:.75"></i>` : ''}</div>`;
  });
  // layers: rig (beat punches) › slide (entrance + motion blur) › pose (static tilt) › cam (macro push, origin = the eye)
  let sA = `<div class="fx-glow" id="${ctx.id('tint')}" style="left:${CX - 640}px;top:${CY - 640}px;width:1280px;height:1280px;background:radial-gradient(closest-side, currentColor, rgba(255,255,255,0));color:${af.P.chart.tint};opacity:0"></div>`;
  sA += `<div class="fx-full" id="${ctx.id('rig')}" style="transform-origin:${CX}px ${CY}px"><div class="fx-full" id="${ctx.id('slide')}"><div class="fx-full" id="${ctx.id('pose')}" style="transform-origin:${CX}px ${CY}px"><div class="fx-full" id="${ctx.id('cam')}" style="transform-origin:${eye[0].toFixed(1)}px ${eye[1].toFixed(1)}px">${lure}</div></div></div></div>`;
  ctx.tl.set(ctx.sel('pose'), { rotation: ROT }, 0);
  ctx.tl.fromTo(ctx.sel('slide'), { x: 380, filter: 'blur(14px)' }, { x: 0, filter: 'blur(0px)', duration: 0.5, ease: 'expo.out' }, 0);
  ctx.tl.set(ctx.sel('slide'), { filter: 'none' }, 0.52);
  const tLand = beat(0, 3);                                              // pull-back lands on beat 4 of bar 0
  ctx.tl.fromTo(ctx.sel('cam'), { scale: 2.95, x: 130, y: 46 }, { scale: 2.66, x: 118, y: 40, duration: 0.6, ease: 'power1.out' }, 0);
  ctx.tl.fromTo(ctx.sel('cam'), { scale: 2.66, x: 118, y: 40 }, { scale: 1, x: 0, y: 0, duration: tLand - 0.6, ease: 'expo.inOut' }, 0.6);
  af.sweep(ctx, 'cw0', Math.max(0.12, tAF - 0.05), { d: 0.75 });
  af.sweep(ctx, 'cw0', tLand - 0.05, { d: 0.6 });
  ctx.tl.fromTo(ctx.sel('tint'), { opacity: 0, scale: 0.7 }, { opacity: 0.9, scale: 1, duration: 0.6, ease: 'expo.out' }, tLand - 0.2);
  // colour drop: one colourway per beat of bar 1, then back to the hero colour on the last 8th
  const swaps = [b[1], beat(1, 1), beat(1, 2), beat(1, 3), (beat(1, 3) + b[2]) / 2];
  const seq = [1, 2, 3, 4, 0];
  let cur = 0;
  swaps.forEach((t, j) => {
    const nx = seq[j];
    ctx.tl.set(ctx.sel(`cw${cur}`), { opacity: 0 }, t);
    ctx.tl.set(ctx.sel(`cw${nx}`), { opacity: 1 }, t);
    ctx.tl.set(ctx.sel('tint'), { color: af.P[CW_ORDER[nx]].tint }, t);
    ctx.tl.set(ctx.sel(`cwl${cur}`), { opacity: 0 }, t);
    ctx.tl.set(ctx.sel(`cwl${nx}`), { opacity: 1 }, t);
    fx.punch(ctx, ctx.sel('rig'), t, { scale: 1.055, d: 0.22, ease: 'power3.out' });
    cur = nx;
  });
  af.sweep(ctx, 'cw3', swaps[3] + 0.04, { d: 0.42 });
  // bar 0 type: name (typed URL in the site font, not the logo artwork) + kicker
  const nameFit = ctx.fit('activefishing.cz', { font: 'Nunito', wght: 1000, maxW: CW, maxLines: 1, sizes: [150, 142, 134, 126, 118, 110, 100] });
  sA += `<div class="af-tag" id="${ctx.id('kick')}" style="left:${L}px;top:432px;font-size:30px;letter-spacing:.16em;color:${C.ink}"><i></i><span class="fx-ln"><span>${ctx.esc(ctx.nb('Český e-shop pro trout area'))}</span></span></div>`;
  sA += `<div class="af-url" id="${ctx.id('nm')}" style="top:482px;left:${L}px;right:auto;text-align:left;font-size:${nameFit.size}px"><span class="fx-ln"><span>${fx.split('activefishing', 'chars')}<span class="o">${fx.split('.cz', 'chars')}</span></span></span></div>`;
  ctx.tl.fromTo(`${ctx.sel('nm')} .fx-c`, { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.55, ease: 'expo.out', stagger: 0.024 }, tAF - 0.04);
  ctx.tl.fromTo(`${ctx.sel('kick')} .fx-ln > span`, { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'expo.out' }, tAF + 0.12);
  ctx.tl.fromTo(ctx.sel('kick') + ' i', { scaleY: 0 }, { scaleY: 1, duration: 0.4, ease: 'expo.out' }, tAF + 0.1);
  const tOut0 = Math.min(tZr - 0.3, b[1] - 0.45);
  ctx.tl.fromTo(`${ctx.sel('nm')} .fx-ln > span`, { yPercent: 0, opacity: 1 }, { yPercent: -125, opacity: 0, duration: 0.26, ease: 'power3.in' }, tOut0);
  ctx.tl.fromTo(`${ctx.sel('kick')} .fx-ln > span`, { yPercent: 0, opacity: 1 }, { yPercent: -125, opacity: 0, duration: 0.24, ease: 'power3.in' }, tOut0 - 0.04);
  ctx.tl.fromTo(ctx.sel('kick') + ' i', { scaleY: 1 }, { scaleY: 0, duration: 0.2, ease: 'power2.in' }, tOut0);
  // bar 1 headline, word by word on the VO
  const H1 = af.words(ctx, { id: 'hz', y: 430, lines: [[{ w: 'Zrozený', t: tZr - 0.06 }, { w: 'z', t: tZ - 0.05 }, { w: 'vášně', t: tVa - 0.05, grad: true }], [{ w: 'pro', t: tPro - 0.05 }, { w: 'přívlač', t: tPr - 0.06 }]] });
  sA += H1.html;
  // product chip + colourway name (from the shop's product titles)
  const chip = af.pill(ctx, { id: 'chip', text: 'Timon · Chibi Futten FS · 51 mm', x: L, y: 1296, size: 28, tone: 'ol', tracking: 0.07 });
  sA += chip.html;
  ctx.tl.fromTo(ctx.sel('chip'), { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.55, ease: 'expo.out' }, tLand - 0.1);
  CW_ORDER.forEach((k, i) => { sA += `<div class="af-cwl" id="${ctx.id(`cwl${i}`)}" style="left:${L + 6}px;top:1392px;opacity:0"><i style="background:${af.P[k].dot}"></i>${ctx.esc(af.P[k].name)}</div>`; });
  ctx.tl.fromTo(ctx.sel('cwl0'), { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'none' }, tLand + 0.05);
  html += fx.scene(ctx, 'sA', 0, b[2], sA, { outD: 0.001 });

  // =============================== bar 2: orange counter beat ===============================
  let sB = `<div class="fx-field" id="${ctx.id('orf')}" style="background:radial-gradient(85% 42% at 50% 26%, rgba(255,214,140,.5), rgba(255,214,140,0) 70%), ${af.GRAD}"></div>`;
  const tB = b[2] - 0.07;                                                 // texts start a hair early → the downbeat frame is never empty
  const PR = fx.headline(ctx, { id: 'pres', text: 'Přes', x: L, y: 392, w: CW, maxLines: 1, align: 'center', font: 'Nunito', wght: 900, size: 46, tracking: 0.24, upper: true, color: '#ffffff', t: tB, reveal: 'lines', d: 0.45 });
  sB += PR.html;
  sB += fx.odometer(ctx, { id: 'odo', value: '1 300', suffix: '+', x: L, y: 438, w: CW, align: 'center', size: 320, font: SAIRA, wght: 900, color: '#ffffff', t: tB + 0.04, d: 0.6, stagger: 0.05, style: 'word-spacing:.1em' });
  ctx.tl.fromTo(ctx.sel('odo'), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35, ease: 'expo.out' }, tB);
  const plFit = ctx.fit('PLANDAVEK', { font: SAIRA, wght: 900, upper: true, tracking: 0.02, maxW: 740, maxLines: 1, sizes: [176, 170, 164, 156, 150] });
  sB += `<div class="fx-t" id="${ctx.id('pl')}" style="left:${L}px;top:758px;width:${CW}px;text-align:center;font-family:'${SAIRA}';font-weight:900;font-size:${plFit.size}px;line-height:1;letter-spacing:.02em;text-transform:uppercase"><span class="fx-ln"><span class="fx-of" id="${ctx.id('plof')}" style="--ofc:${C.ink};--ofw:3px">PLANDAVEK</span></span></div>`;
  ctx.tl.fromTo(`${ctx.sel('pl')} .fx-ln > span`, { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'expo.out' }, tB + 0.1);
  fx.outlineFill(ctx, ctx.sel('plof'), tPl - 0.12, { d: 0.42, ease: 'power2.inOut' });
  // white shop card (Sofia pair, the Nories hero) — four more spoons burst out of it on the beat
  const card = { x: 220, y: 968, w: 640, h: 404 }, ccx = card.x + card.w / 2, ccy = card.y + card.h / 2;
  let cg = `<div class="af-card" id="${ctx.id('card')}" style="left:${card.x}px;top:${card.y}px;width:${card.w}px;height:${card.h}px;transform-origin:50% 50%"></div>`;
  const BURST = [
    { id: 'bk', k: 'khor', VH: 240, cx: 166, cy: 1050, rot: -14 },
    { id: 'bf', k: 'forte15', V: 252, cx: 908, cy: 1030, rot: 16 },
    { id: 'bs', k: 'scheila', V: 252, cx: 176, cy: 1306, rot: 14 },
    { id: 'bo', k: 'forte06', V: 252, cx: 904, cy: 1316, rot: -16 },
  ];
  const tBurst = beat(2, 1) - 0.1;
  BURST.forEach((it, i) => {
    const p = af.prod(ctx, { id: it.id, k: it.k, V: it.V ?? null, VH: it.VH ?? null, cx: it.cx, cy: it.cy, rot: it.rot, so: 0.6, shadow: 0, drop: '0 18px 18px rgba(110,35,0,.30)' });
    cg += p.html;
    ctx.tl.fromTo(p.sel, { x: (ccx - it.cx) * 0.85, y: (ccy - it.cy) * 0.85, scale: 0.35, rotation: -it.rot * 1.5, opacity: 0 }, { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, duration: 0.7, ease: 'expo.out' }, tBurst + i * 0.035);
    ctx.tl.fromTo(p.cam, { x: 0, y: 0 }, { x: (it.cx - ccx) * 0.05, y: (it.cy - ccy) * 0.08, duration: b[3] - tBurst - 0.3, ease: 'sine.inOut' }, tBurst + 0.4);   // keeps drifting outward
    af.sweep(ctx, it.id, beat(2, 2) + 0.12 + i * 0.05, { d: 0.5 });
    ctx.tl.fromTo(p.sel, { x: 0, y: 0, opacity: 1 }, { x: (it.cx - ccx) * 1.3, y: (it.cy - ccy) * 1.3, opacity: 0, duration: 0.24, ease: 'power3.in' }, b[3] - 0.3);
  });
  const so = af.prod(ctx, { id: 'so', k: 'sofia', V: 452, cx: ccx, cy: ccy, rot: -4, so: 0.8, shadow: 0, drop: '0 16px 16px rgba(90,40,10,.20)' });
  cg += so.html;
  sB += `<div class="fx-full" id="${ctx.id('cg')}">${cg}</div>`;
  ctx.tl.fromTo(ctx.sel('cg'), { y: 860, rotation: 5 }, { y: 0, rotation: 0, duration: 0.62, ease: 'expo.out' }, tB);
  fx.punch(ctx, so.cam, beat(2, 2), { scale: 1.06, d: 0.25 });
  af.sweep(ctx, 'so', beat(2, 1), { d: 0.6 });
  af.sweep(ctx, 'so', beat(2, 3) - 0.05, { d: 0.5 });
  sB += `<div class="af-tag" id="${ctx.id('brands')}" style="left:0;right:0;justify-content:center;top:1412px;font-size:25px;letter-spacing:.14em;color:#ffffff">${ctx.esc(ctx.nb('Nories · Velvet Arts · ValkeIN · Khor'))}</div>`;
  ctx.tl.fromTo(ctx.sel('brands'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, ease: 'expo.out' }, tBurst + 0.25);
  // exit: type up, spoons thrown out, the card zooms to fill the frame (white) → bar 3
  const tX = b[3] - 0.3;
  ['pres', 'pl'].forEach((k) => ctx.tl.fromTo(`${ctx.sel(k)} .fx-ln > span`, { yPercent: 0, opacity: 1 }, { yPercent: -125, opacity: 0, duration: 0.24, ease: 'power3.in' }, tX));
  ctx.tl.fromTo(ctx.sel('odo'), { opacity: 1, y: 0 }, { opacity: 0, y: -80, duration: 0.24, ease: 'power3.in' }, tX);
  ctx.tl.fromTo(ctx.sel('brands'), { opacity: 1, y: 0 }, { opacity: 0, y: 0, duration: 0.15, ease: 'none' }, tX);
  ctx.tl.fromTo(so.sel, { y: 0, scale: 1, opacity: 1 }, { y: -380, scale: 1.35, opacity: 0, duration: 0.24, ease: 'power3.in' }, tX + 0.02);
  ctx.tl.fromTo(ctx.sel('card'), { scaleX: 1, scaleY: 1 }, { scaleX: 1.9, scaleY: 6.2, duration: 0.26, ease: 'power3.in' }, b[3] - 0.26);
  html += fx.scene(ctx, 'sB', b[2], b[3], sB, { inD: 0.001, outD: 0.001 });

  // =============================== bar 3: VARIVAS + cranks · osobní přístup ===============================
  let sC = '';
  const mk = af.prod(ctx, { id: 'mk', k: 'mukai', V: 470, cx: 800, cy: 612, rot: -14, so: 0.55, shadow: 0 });
  const vs = af.prod(ctx, { id: 'vs', k: 'varivas', V: 560, cx: 540, cy: 912, so: 0.7, shadow: 0.34, shY: 0.5, persp: true, drop: '0 26px 30px rgba(60,40,20,.16)' });
  const pc = af.prod(ctx, { id: 'pc', k: 'panicra', V: 330, cx: 236, cy: 1150, rot: 9, so: 0.55, shadow: 0.22 });
  const wh = af.prod(ctx, { id: 'wh', k: 'wah', V: 300, cx: 846, cy: 1150, rot: -7, so: 0.55, shadow: 0.22 });
  sC += mk.html + vs.html + pc.html + wh.html;
  const t3 = b[3];
  ctx.tl.fromTo(vs.sel, { y: 300, scale: 0.72, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.72, ease: 'expo.out' }, t3 - 0.08);
  ctx.tl.fromTo(vs.r, { rotationY: -32, rotationX: 10 }, { rotationY: 16, rotationX: -4, duration: b[4] - t3 + 0.08, ease: 'sine.inOut' }, t3 - 0.08);
  ctx.tl.fromTo(mk.sel, { x: 640, rotation: 10, opacity: 1 }, { x: 0, rotation: 0, opacity: 1, duration: 0.66, ease: 'expo.out' }, t3 - 0.04);
  ctx.tl.fromTo(pc.sel, { x: -560, opacity: 1 }, { x: 0, opacity: 1, duration: 0.62, ease: 'expo.out' }, t3 + 0.04);
  ctx.tl.fromTo(wh.sel, { x: 560, opacity: 1 }, { x: 0, opacity: 1, duration: 0.62, ease: 'expo.out' }, t3 + 0.1);
  fx.parallax(ctx, [{ sel: mk.cam, depth: 0.5 }, { sel: vs.cam, depth: 0.9 }, { sel: pc.cam, depth: 1.5 }, { sel: wh.cam, depth: 1.3 }], t3 + 0.3, b[4], { x: -46, y: -14 });
  af.sweep(ctx, 'vs', t3 + 0.45, { d: 0.75 });
  af.sweep(ctx, 'mk', beat(3, 2), { d: 0.55 });
  af.sweep(ctx, 'vs', beat(3, 3) + 0.1, { d: 0.6 });
  sC += `<div class="af-tag" id="${ctx.id('vtag')}" style="left:${L}px;top:432px;font-size:30px;letter-spacing:.1em"><i></i><span class="fx-ln"><span>${ctx.esc(ctx.nb('VARIVAS · ES2 Ester · 80 m'))}</span></span></div>`;
  ctx.tl.fromTo(`${ctx.sel('vtag')} .fx-ln > span`, { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'expo.out' }, beat(3, 1) - 0.1);
  ctx.tl.fromTo(ctx.sel('vtag') + ' i', { scaleY: 0 }, { scaleY: 1, duration: 0.4, ease: 'expo.out' }, beat(3, 1) - 0.12);
  // benefits (site USPs): OSOBNÍ PŘÍSTUP on the VO, the other two right after
  const op = af.pill(ctx, { id: 'op', text: 'Osobní přístup', cx: W / 2, y: 1240, size: 54, tone: 'fill', tracking: 0.05 });
  sC += op.html;
  const pw = (tx) => af.pill(ctx, { id: 'm', text: tx, x: 0, y: 0, size: 27, tracking: 0.07 }).w;   // measure only
  const gap = 16, w1 = pw('Rychlost doručení'), x1 = (W - (w1 + gap + pw('Unikátní sortiment'))) / 2;
  sC += af.pill(ctx, { id: 'p1', text: 'Rychlost doručení', x: x1, y: 1372, size: 27, tone: 'ol', tracking: 0.07 }).html;
  sC += af.pill(ctx, { id: 'p2', text: 'Unikátní sortiment', x: x1 + w1 + gap, y: 1372, size: 27, tone: 'ol', tracking: 0.07 }).html;
  const tOp = Math.max(t3 - 0.04, tOs - 0.12);
  ctx.tl.fromTo(ctx.sel('op'), { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' }, tOp);
  ctx.tl.fromTo(ctx.sel('p1'), { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'expo.out' }, beat(3, 1) - 0.04);
  ctx.tl.fromTo(ctx.sel('p2'), { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'expo.out' }, beat(3, 1) + 0.04);
  fx.punch(ctx, ctx.sel('op'), beat(3, 2), { scale: 1.06, d: 0.25 });
  // exit (products thrown out of frame, type drops) → hard cut to the lockup on the downbeat
  const tX3 = b[4] - 0.26;
  ctx.tl.fromTo(mk.sel, { x: 0, rotation: 0, opacity: 1 }, { x: 760, rotation: 8, opacity: 1, duration: 0.26, ease: 'power3.in' }, tX3);
  ctx.tl.fromTo(wh.sel, { x: 0, opacity: 1 }, { x: 620, opacity: 1, duration: 0.26, ease: 'power3.in' }, tX3 + 0.02);
  ctx.tl.fromTo(pc.sel, { x: 0, opacity: 1 }, { x: -620, opacity: 1, duration: 0.26, ease: 'power3.in' }, tX3 + 0.02);
  ctx.tl.fromTo(vs.sel, { y: 0, scale: 1, opacity: 1 }, { y: -140, scale: 1.5, opacity: 0, duration: 0.26, ease: 'power3.in' }, tX3);
  ctx.tl.fromTo(ctx.sel('op'), { scale: 1, opacity: 1 }, { scale: 0.7, opacity: 0, duration: 0.22, ease: 'power3.in' }, tX3 + 0.03);
  ['p1', 'p2'].forEach((k, i) => ctx.tl.fromTo(ctx.sel(k), { y: 0, opacity: 1 }, { y: 90, opacity: 0, duration: 0.22, ease: 'power3.in' }, tX3 + 0.03 + i * 0.03));
  ctx.tl.fromTo(`${ctx.sel('vtag')} .fx-ln > span`, { yPercent: 0, opacity: 1 }, { yPercent: -125, opacity: 0, duration: 0.22, ease: 'power3.in' }, tX3);
  html += fx.scene(ctx, 'sC', b[3], b[4], sC, { inD: 0.001, outD: 0.001 });

  // =============================== bar 4: lockup + shop-shelf carousels ===============================
  const t4 = b[4];
  let sD = `<div class="fx-field" id="${ctx.id('lkf')}" style="background:radial-gradient(120% 70% at 50% 30%, #ffffff 0%, #f1f0ed 60%, #e7e4df 100%)"></div>`;
  const urlFit = ctx.fit('activefishing.cz', { font: 'Nunito', wght: 1000, maxW: 900, maxLines: 1, sizes: [132, 124, 116, 108, 100] });
  const yUrl = 548;
  sD += urlHtml(ctx, 'url', yUrl, urlFit.size);
  ctx.tl.fromTo(`${ctx.sel('url')} .fx-c`, { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'expo.out', stagger: 0.02 }, t4 - 0.06);
  const TW = 268, TH = 210, TG = 18, STEP = TW + TG;
  const rows = [
    { id: 'ra', label: '777 woblerů', y: 784, items: ['mukai', 'chart', 'wah', 'panicra', 'cobalt', 'gold', 'red', 'holo'], x0: -60, drift: -170, from: 1100, t: t4 - 0.04 },
    { id: 'rb', label: '1 300+ plandavek', y: 1086, items: ['sofia', 'forte15', 'scheila', 'khor', 'forte06'], x0: -260, drift: 150, from: -1100, t: t4 + 0.04 },
  ];
  rows.forEach((R) => {
    sD += `<div class="af-tag" id="${ctx.id(`${R.id}l`)}" style="left:${L}px;top:${R.y - 52}px;font-size:28px;letter-spacing:.09em"><i></i><span class="fx-ln"><span>${ctx.esc(ctx.nb(R.label))}</span></span></div>`;
    ctx.tl.fromTo(`${ctx.sel(`${R.id}l`)} .fx-ln > span`, { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'expo.out' }, R.t + 0.16);
    ctx.tl.fromTo(ctx.sel(`${R.id}l`) + ' i', { scaleY: 0 }, { scaleY: 1, duration: 0.4, ease: 'expo.out' }, R.t + 0.14);
    const tiles = R.items.map((k, i) => af.tile(ctx, { id: `${R.id}t${i}`, k, x: i * STEP, y: 0, w: TW, h: TH, rot: /sofia|forte|scheila|khor/.test(k) ? -12 : 0 })).join('');
    sD += `<div class="fx-abs" id="${ctx.id(R.id)}" style="left:0;top:${R.y}px;width:${W}px;height:${TH}px"><div class="fx-abs" id="${ctx.id(`${R.id}in`)}" style="left:${R.x0}px;top:0;width:${R.items.length * STEP}px;height:${TH}px">${tiles}</div></div>`;
    ctx.tl.fromTo(ctx.sel(R.id), { x: R.from }, { x: 0, duration: 0.72, ease: 'expo.out' }, R.t);
    ctx.tl.fromTo(ctx.sel(`${R.id}in`), { x: 0 }, { x: R.drift, duration: END - R.t, ease: 'none' }, R.t);
  });
  const pz = af.pill(ctx, { id: 'pz', text: 'Věnuje ceny · MČR 2026', cx: W / 2, y: 1360, size: 34, tone: 'fill', tracking: 0.07 });
  sD += pz.html;
  ctx.tl.fromTo(ctx.sel('pz'), { scale: 0.55, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' }, beat(4, 1) - 0.06);
  html += fx.scene(ctx, 'sD', b[4], END, sD, { inD: 0.001 });

  // =============================== sponsor logo bug (≤ TA plate), top right → centre lockup ===============================
  const lg = ctx.logo('on_light', { box: [240, 110], at: [tAF - 0.05, END], id: 'logo' });
  const lx = W - ctx.safe.right - lg.w, ly = Math.round(ctx.plate.rect.y + ctx.plate.rect.h / 2 - lg.h / 2);
  html += `<div class="fx-abs" id="${ctx.id('lw')}" style="left:${lx}px;top:${ly}px;width:${lg.w}px;height:${lg.h}px">${lg.html}</div>`;
  ctx.tl.fromTo(ctx.sel('lw'), { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.5, ease: 'expo.out' }, tAF - 0.05);
  ctx.tl.fromTo(ctx.sel('lw'), { opacity: 1 }, { opacity: 0, duration: 0.06, ease: 'none' }, b[2] - 0.06);        // the logo vanishes on brand orange
  ctx.tl.fromTo(ctx.sel('lw'), { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'none' }, b[3]);
  ctx.tl.fromTo(ctx.sel('lw'), { x: 0, y: 0 }, { x: W / 2 - lg.w / 2 - lx, y: yUrl - 40 - lg.h - ly, duration: 0.6, ease: 'expo.inOut' }, t4 - 0.3);

  // =============================== transitions ===============================
  fx.tIn(ctx, 'cut');                                   // the previous block hands over on our paper colour
  af.tilesOut(ctx, { d: 0.46 });                         // rounded shop-card tiles close into the next block's colour

  return { html, css: af.CSS(S) };
}

// =============================== Reel hook (1 bar): „1 300+ plandavek“ + Sofia pair, readable at 0.3 s ===============================
export function hook(ctx) {
  af.prime(ctx);
  const S = ctx.S, L = ctx.safe.left, CW = ctx.W - L - ctx.safe.right;
  let html = world(ctx, { id: 'hw', glowX: 760, glowY: 1220 });
  const nFit = ctx.fit('1 300+', { font: SAIRA, wght: 900, maxW: CW, maxLines: 1, sizes: [360, 340, 320, 300] });
  html += `<div class="fx-t" id="${ctx.id('hn')}" style="left:${L - 6}px;top:388px;width:${CW}px;font-family:'${SAIRA}';font-weight:900;font-size:${nFit.size}px;line-height:1;word-spacing:.14em"><span class="fx-ln"><span class="af-grad">${ctx.esc(ctx.nb('1 300+'))}</span></span></div>`;
  html += `<div class="fx-t" id="${ctx.id('hp')}" style="left:${L}px;top:${388 + nFit.size * 0.98}px;width:${CW}px;font-family:'${SAIRA}';font-weight:900;font-size:176px;line-height:1;letter-spacing:.02em;color:${C.ink}"><span class="fx-ln"><span>PLANDAVEK</span></span></div>`;
  html += `<div class="af-tag" id="${ctx.id('hs')}" style="left:${L}px;top:${388 + nFit.size * 0.98 + 192}px;font-size:40px;letter-spacing:.02em;text-transform:none"><i></i><span class="fx-ln"><span>activefishing<span style="color:${C.web}">.cz</span></span></span></div>`;
  // the Reel's very first frame must already sell: type is on screen at t = 0 and settles (scale) instead of revealing
  ['hn', 'hp'].forEach((k) => ctx.tl.set(ctx.sel(k), { transformOrigin: '0% 50%' }, 0));
  ctx.tl.fromTo(ctx.sel('hn'), { scale: 1.16, x: -10 }, { scale: 1, x: 0, duration: 0.5, ease: 'expo.out' }, 0);
  ctx.tl.fromTo(ctx.sel('hp'), { scale: 1.12, x: -8 }, { scale: 1, x: 0, duration: 0.5, ease: 'expo.out' }, 0);
  ctx.tl.fromTo(`${ctx.sel('hs')} .fx-ln > span`, { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.3, ease: 'expo.out' }, 0.06);
  const sp = af.prod(ctx, { id: 'hsp', k: 'sofia', V: 700, cx: 560, cy: 1222, rot: -10, so: 0.8, shadow: 0, drop: '0 30px 34px rgba(90,40,10,.22)' });
  html += sp.html;
  ctx.tl.fromTo(sp.sel, { x: 240, rotation: 18, filter: 'blur(8px)' }, { x: 0, rotation: 0, filter: 'blur(0px)', duration: 0.45, ease: 'expo.out' }, 0);
  ctx.tl.set(sp.sel, { filter: 'none' }, 0.47);
  fx.pushIn(ctx, sp.cam, 0.5, ctx.dur, { from: 1, to: 1.07, origin: '50% 50%' });
  af.sweep(ctx, 'hsp', 0.4, { d: 0.7 });
  fx.tOut(ctx, 'flash', { color: theme.bg, d: 0.12 });
  return { html, css: af.CSS(S) };
}

// =============================== Reel end card (2 bars): TA plate ×1.5 + logo ≤ TA + URL + partner line + prize pill + colourways ===============================
export function endCard(ctx) {
  af.prime(ctx);
  const S = ctx.S, W = ctx.W, END = ctx.dur, M = meta.endCard;
  let html = world(ctx, { id: 'ew', glowX: 820, glowY: 1300 });
  const scale = 1.5, fly = 0.6, t = 0.05;
  const P = ctx.plate.hero(t, END, { scale, cx: W / 2, cy: 460, fly });
  const lg = ctx.logo(M.logo, { box: [760, 300], scale, at: [t + fly, END], id: 'elogo', label: `${ctx.cid} end card` });
  const tt = 0;
  let y = P.y + P.h + 34;
  html += `<div class="af-tag" id="${ctx.id('eline')}" style="left:0;right:0;justify-content:center;top:${y}px;font-size:28px;letter-spacing:.14em"><span class="fx-ln"><span>${ctx.esc(ctx.nb(M.line))}</span></span></div>`;
  ctx.tl.fromTo(`${ctx.sel('eline')} .fx-ln > span`, { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'expo.out' }, tt);
  y += 28 + 24;
  html += `<div class="fx-abs" id="${ctx.id('ebar')}" style="left:${W / 2 - 60}px;top:${y}px;width:120px;height:6px;border-radius:3px;background:${af.GRAD}"></div>`;
  ctx.tl.fromTo(ctx.sel('ebar'), { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'expo.out' }, tt + 0.08);
  y += 6 + 30;
  html += `<div class="fx-abs" id="${ctx.id('elw')}" style="left:${(W - lg.w) / 2}px;top:${y}px;width:${lg.w}px;height:${lg.h}px">${lg.html}</div>`;
  ctx.tl.fromTo(ctx.sel('elw'), { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' }, t + fly);
  y += lg.h + 26;
  const uf = ctx.fit('activefishing.cz', { font: 'Nunito', wght: 1000, maxW: 860, maxLines: 1, sizes: [120, 112, 104, 96] });
  html += urlHtml(ctx, 'eurl', y, uf.size);
  ctx.tl.fromTo(`${ctx.sel('eurl')} .fx-c`, { yPercent: 70, opacity: 0.35 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'expo.out', stagger: 0.015 }, 0);
  y += uf.size * 1.0 + 30;
  html += af.pill(ctx, { id: 'epz', text: 'Věnuje ceny · MČR 2026', cx: W / 2, y, size: 32, tone: 'fill', tracking: 0.07 }).html;
  ctx.tl.fromTo(ctx.sel('epz'), { scale: 0.55, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' }, t + fly + 0.2);
  y += 32 + 32 + 40;
  // colourway cascade (5 × Timon Chibi Futten FS), enters on the beats
  const VS = 340, dy = Math.min(62, (ctx.H - ctx.safe.bottom + 10 - y - VS * 0.4) / 4);
  CW_ORDER.forEach((k, i) => {
    const p = af.prod(ctx, { id: `ec${i}`, k, V: VS, cx: 452 + i * 44, cy: y + VS * 0.2 + i * dy, rot: -4, so: 0.6, shadow: 0, drop: '0 14px 14px rgba(60,40,20,.16)' });
    html += p.html;
    ctx.tl.fromTo(p.sel, { x: 640, opacity: 1 }, { x: 0, opacity: 1, duration: 0.6, ease: 'expo.out' }, i * ctx.BEAT * 0.4);
    if (i === 0) af.sweep(ctx, `ec${i}`, 1.6, { d: 0.6 });
  });
  fx.tIn(ctx, 'cut');
  return { html, css: af.CSS(S) };
}
