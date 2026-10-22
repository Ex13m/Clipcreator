// FT FISHING (ftfishing.cz) · plan B v9 bars 50–54 (5 bars ≈ 9.11 s; v9: penultimate partner, after Velká ryba, before ČRS — bar 0 = the
// peak-1 re-entry hit, source bar 63) · concept A „TŘI ZNAČKY – TŘI TAKTY“
// (research/ftfishing_ad.md §4). Brand world = the shop's own web hero banner: white paper + GREEN DIAGONAL STRIPES #6DB52C + grey
// #878786; Exo 2 900 caps titles, Saira (wide) slogan / labels. The stripes are also the wiper between the three brand worlds.
// VO (take 1): „FT Fishing – vše pro přívlač. Pruty Favorite, nástrahy Crazy Fish a Spinmad.“ — every brand lands in „its“ bar:
//   bar 0      DROP: white world, stripe band slams across, FT / FISHING type on frame 1, the Arena Stream rod races along the band,
//              VŠE · PRO · PŘÍVLAČ word by word on the voice (grey Saira, the logo slogan)
//   bar 1      FAVORITE: X1 2000S (green spool = FT green) slams on the downbeat, PRUTY A NAVIJÁKY on „Pruty“, rod light sweep,
//              Favorite logo on „Favorite“, the Totem 2000S swaps in on beat 3
//   bar 2      CRAZY FISH: stripes wipe into black + magenta light, Vibro Fat slams, NÁSTRAHY (on the downbeat nearest „nástrahy“),
//              Crazy Fish logo on „Crazy“, a school of 5 soft baits pops in on the 8ths
//   bar 3      SPINMAD: stripes wipe into silver, Impulse PRO slam, then Hart → King → Target Spoon 1,5 g swap in place on the beats,
//              Spinmad logo on „Spinmad“ (= the downbeat), NÁSTRAHY stays (ink)
//   bar 4      LOCKUP on white + stripes: FT logo (≤ TA) · VŠE PRO PŘÍVLAČ · ftfishing.cz · „Věnuje ceny · MČR 2026“ · three brand
//              columns (logo + product) — v9: no Vanfook (banners only); out = stripes + a panel in the next world's colour
// Only verified copy (research/ftfishing.md Verification): no „oficiální dovozce“, no prices, no prizes named, no brand origin.
import * as fx from '../lib/fx.mjs';
import * as F from '../lib/fx_ftfishing.mjs';

const { C, PR, EXO, SAIRA } = F;
export const fonts = {
  'Exo 2': { v: 'exo-2-{r}-wght-normal', vi: 'exo-2-{r}-wght-italic', weight: '100 900', axes: ['wght'], use: 'FT Fishing display (techno caps ≈ the FT lettering) — @fontsource-variable/exo-2 5.3.0, OFL' },
  Saira: { v: 'saira-{r}-wdth-normal', weight: '100 900', stretch: '50% 125%', axes: ['wght', 'wdth'], use: 'FT Fishing slogan / labels (wide ≈ „VŠE PRO PŘÍVLAČ“ in the logo) — @fontsource-variable/saira 5.3.0, OFL' },
};
export const theme = { bg: '#ffffff', bg2: C.paper2, fg: C.ink, accent: C.green, accent2: C.grey, font: { display: EXO, text: SAIRA }, wght: 900, upper: true, light: true };
export const meta = {
  reel: true,
  hook: { product: PR.impulse, headline: 'Vše pro přívlač', sub: 'ftfishing.cz' },
  endCard: { logo: 'on_light', line: 'Partner MČR v Trout Area 2026' },
};
const BR = ['favorite', 'crazyfish', 'spinmad'];
const BRP = { favorite: PR.x1, crazyfish: PR.vibro, spinmad: PR.impulse };
// three brand columns (logo + its hero product) — used by the block lockup and the Reel end card. v9 (operator 22. 10.): Vanfook is
// OUT of the film block and the Reel (it stays only on the FB/IG banners) → back to the three focus brands Favorite · Crazy Fish · Spinmad
function brandRow(ctx, { y, t, at, logoH = 72, prodTop, prodH = 250, cols = [205, 540, 875], idp = 'br', anim = true }) {
  let html = '';
  BR.forEach((k, j) => {
    const rel = ctx.data.brands[k].on_light, [iw, ih] = ctx.dims(rel), ar = iw / ih;
    // equal visual weight = equal area (Crazy Fish is a tall illustrated mark, Favorite a long wordmark)
    const bw = Math.min(290, Math.sqrt(14000 * ar), (logoH * 1.45) * ar);
    const lg = ctx.logo(rel, { box: [bw, bw / ar], at, label: `ftfishing ${k}` });
    const cx = cols[j];
    html += `<div class="ft-bl" id="${ctx.id(`${idp}l${j}`)}" style="left:${(cx - lg.w / 2).toFixed(1)}px;top:${(y + (logoH * 1.45 - lg.h) / 2).toFixed(1)}px;width:${lg.w}px;height:${lg.h}px"><img src="${lg.src}" alt="${ctx.esc(ctx.data.brands[k].name)}" style="width:${lg.w}px;height:${lg.h}px"></div>`;
    const i = BRP[k];
    const P = F.prod(ctx, { id: `${idp}p${j}`, i, ...(k === 'favorite' ? { VH: prodH } : { V: Math.min(320, prodH * 1.15) }), cx, cy: prodTop + prodH / 2, rot: k === 'favorite' ? 0 : k === 'crazyfish' ? -24 : -20, drop: '0 18px 22px rgba(0,0,0,.25)' });
    html += P.html;
    if (anim) {
      ctx.tl.fromTo(ctx.sel(`${idp}l${j}`), { y: 26 }, { y: 0, duration: 0.5, ease: 'expo.out' }, t + j * 0.05);
      ctx.tl.fromTo(P.sel, { y: 140, scale: 1.12 }, { y: 0, scale: 1, duration: 0.55, ease: 'expo.out' }, t - 0.06 + j * 0.05);
      F.sweep(ctx, `${idp}p${j}`, t + 0.4 + j * 0.08, { d: 0.6 });
    }
  });
  return html;
}

export default function ftfishing(ctx) {
  const { bar, W } = ctx, S = ctx.S, L = ctx.safe.left, CW = W - L - ctx.safe.right, END = ctx.dur;
  const t1 = bar(1), t2 = bar(2), t3 = bar(3), t4 = bar(4);
  const vo = (q, d) => ctx.vo.at(q) ?? d;
  const half = (t) => ctx.snap(t, 'half');
  const tFish = vo('Fishing', 0.55), tVse = vo('vše', 1.33), tPro = vo('pro', 1.59), tPriv = vo('přívlač', 1.88);
  const tPruty = Math.max(t1 + 0.4, half(vo('Pruty', 2.63)) - 0.06), tFav = Math.max(tPruty + 0.3, half(vo('Favorite', 3.08)) - 0.04);
  const tCrazy = Math.min(t3 - 0.6, half(vo('Crazy', 4.45)) - 0.04);
  const b13 = ctx.at(1, 3);
  let html = '';

  // ================= world: white paper, grey studio fall-off, the stripe band =================
  html += fx.field(ctx, { kind: 'radial', c1: '#ffffff', c2: '#e9ebe6', at: '50% 62%' });
  html += F.band(ctx, { id: 'bd', y: 1260, h: 300, rot: -22, drift: -220, t0: 0, t1: t2 });
  ctx.tl.fromTo(ctx.sel('bd'), { x: 700 }, { x: 0, duration: 0.45, ease: 'expo.out' }, 0);       // slams in on the drop (already in frame on frame 1)

  // ================= bar 0–1: rod + reels (Favorite) on the band =================
  const rod = F.prod(ctx, { id: 'rod', i: PR.rod, V: 1060, cx: 600, cy: 1420, rot: -6, drop: '0 16px 16px rgba(0,0,0,.25)', so: 0.9 });
  html += rod.html;
  ctx.tl.fromTo(rod.sel, { x: 520, y: -110 }, { x: 0, y: 0, duration: 0.5, ease: 'expo.out' }, 0);   // already racing in on frame 1 (no empty drop frame)
  F.sweep(ctx, 'rod', tPruty, { d: 0.6 });
  ctx.tl.fromTo(rod.sel, { x: 0, y: 0 }, { x: -1400, y: 300, duration: 0.32, ease: 'power3.in' }, t2 - 0.32);
  // X1 2000S slams on the bar-1 downbeat (opaque from its first frame), Totem swaps in on beat 3 (whip)
  const x1 = F.prod(ctx, { id: 'x1', i: PR.x1, VH: 560, cx: 560, cy: 1170, so: 0.75 });
  html += x1.html;
  ctx.tl.fromTo(x1.sel, { opacity: 0 }, { opacity: 1, duration: 0.02, ease: 'none' }, t1 - 0.12);
  ctx.tl.fromTo(x1.sel, { y: 380, scale: 1.25 }, { y: 0, scale: 1, duration: 0.5, ease: 'expo.out' }, t1 - 0.12);
  F.sweep(ctx, 'x1', t1 + 0.2, { d: 0.7 });
  ctx.tl.fromTo(x1.sel, { x: 0, rotation: 0 }, { x: -1250, rotation: -18, duration: 0.24, ease: 'power3.in' }, b13 - 0.24);
  const tot = F.prod(ctx, { id: 'tot', i: PR.totem, VH: 580, cx: 560, cy: 1160, so: 0.85 });
  html += tot.html;
  ctx.tl.fromTo(tot.sel, { opacity: 0 }, { opacity: 1, duration: 0.02, ease: 'none' }, b13 - 0.1);
  ctx.tl.fromTo(tot.sel, { x: 1200, rotation: 14 }, { x: 0, rotation: 0, duration: 0.45, ease: 'expo.out' }, b13 - 0.1);
  F.sweep(ctx, 'tot', b13 + 0.12, { d: 0.6 });
  ctx.tl.fromTo(tot.sel, { y: 0, scale: 1 }, { y: -1500, scale: 0.8, duration: 0.3, ease: 'power3.in' }, t2 - 0.3);

  // ================= kinetic type, bar 0: FT / FISHING + VŠE · PRO · PŘÍVLAČ =================
  const yT = 404;
  const hFT = fx.headline(ctx, { id: 'hft', text: 'FT', x: L - 8, y: yT, w: CW, maxLines: 1, font: EXO, wght: 900, upper: true, tracking: -0.02, lh: 0.84, sizes: [330, 310, 290], color: C.green, t: null });
  const hFi = fx.headline(ctx, { id: 'hfi', text: 'Fishing', x: L, y: yT + hFT.h + 2, w: CW, maxLines: 1, font: EXO, wght: 900, upper: true, tracking: 0.0, lh: 0.9, sizes: [200, 190, 180, 170, 160, 150], color: C.ink, t: null });
  const yS = yT + hFT.h + 2 + hFi.h + 22;
  const words = [['Vše', tVse], ['pro', tPro], ['přívlač', tPriv]];
  let xw = L + 2, sl = '';
  words.forEach(([w, t], j) => {
    sl += F.label(ctx, { id: `sl${j}`, text: w, x: xw, y: yS, size: 74, wght: 800, wdth: 112, color: j === 2 ? C.greenUi : C.grey });
    xw += ctx.measure(w.toUpperCase(), { font: SAIRA, size: 74, wght: 800, wdth: 112, tracking: 0.04 }) + 30;
    ctx.tl.fromTo(ctx.sel(`sl${j}`), { opacity: 0 }, { opacity: 1, duration: 0.03, ease: 'none' }, t - 0.06);
    ctx.tl.fromTo(ctx.sel(`sl${j}`), { y: 30, scale: 1.18 }, { y: 0, scale: 1, duration: 0.35, ease: 'expo.out' }, t - 0.06);
  });
  html += `<div class="fx-full" id="${ctx.id('hA')}" style="transform-origin:${L}px ${yT}px">${hFT.html}${hFi.html}${sl}</div>`;
  ctx.tl.fromTo(ctx.sel('hA'), { scale: 1.07 }, { scale: 1, duration: 0.6, ease: 'expo.out' }, 0);   // FT FISHING already there on frame 1, settles
  ctx.tl.fromTo(ctx.sel('hA'), { y: 0, opacity: 1 }, { y: -160, opacity: 0, duration: 0.22, ease: 'power3.in' }, tPruty - 0.22);

  // ================= bar 1: PRUTY A NAVIJÁKY + Favorite logo =================
  const hFv = fx.headline(ctx, { id: 'hfv', text: 'Pruty a navijáky', x: L, y: yT, w: CW, maxLines: 2, font: EXO, wght: 900, upper: true, tracking: -0.01, lh: 0.94, sizes: [150, 140, 132, 124, 116], color: C.ink, t: tPruty, reveal: 'lines', d: 0.4, stagger: 0.07, out: t2 - 0.26, outD: 0.24 });
  html += hFv.html;
  const favRel = ctx.data.brands.favorite.on_light;
  const lgF = ctx.logo(favRel, { box: [281, 80], at: [tFav, t2], label: 'ftfishing Favorite (bar 1)' });
  const yFv = yT + hFv.h + 30;
  html += `<div class="fx-full" id="${ctx.id('fvo')}"><div class="ft-bl" id="${ctx.id('fvl')}" style="left:${L}px;top:${yFv}px;width:${lgF.w}px;height:${lgF.h}px;opacity:0"><img src="${lgF.src}" alt="Favorite" style="width:${lgF.w}px;height:${lgF.h}px"></div><i class="ft-hair" id="${ctx.id('fvh')}" style="left:${L + lgF.w + 24}px;top:${yFv + lgF.h / 2 - 2}px;width:200px;height:5px;background:${C.fav}"></i></div>`;
  ctx.tl.set(ctx.sel('fvl'), { opacity: 1 }, tFav);
  ctx.tl.fromTo(ctx.sel('fvl'), { x: -40 }, { x: 0, duration: 0.45, ease: 'expo.out' }, tFav);
  ctx.tl.fromTo(ctx.sel('fvh'), { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'expo.out' }, tFav + 0.06);
  ctx.tl.fromTo(ctx.sel('fvo'), { opacity: 1 }, { opacity: 0, duration: 0.2, ease: 'power2.in' }, t2 - 0.22);

  // ================= bar 2: CRAZY FISH — black + magenta =================
  let cf = `<div class="fx-full" style="background:radial-gradient(70% 46% at 50% 60%, ${ctx.rgba(C.cf, 0.42)}, ${ctx.rgba(C.cf, 0)} 100%), radial-gradient(120% 80% at 50% 55%, #1c1020 0%, ${C.cfDk} 100%)"></div>`;
  cf += F.band(ctx, { id: 'bdc', y: 1560, h: 220, rot: -22, color: C.cf, op: 0.55, drift: -160, t0: t2, t1: t3 });
  const vib = F.prod(ctx, { id: 'vib', i: PR.vibro, V: 900, cx: 548, cy: 1150, rot: -14, so: 0.85, drop: '0 30px 40px rgba(0,0,0,.6)' });
  cf += vib.html;
  ctx.tl.fromTo(vib.sel, { x: 520, scale: 1.18 }, { x: 0, scale: 1, duration: 0.5, ease: 'expo.out' }, t2 - 0.08);
  F.sweep(ctx, 'vib', t2 + 0.25, { d: 0.7 });
  ctx.tl.fromTo(vib.sel, { x: 0, y: 0 }, { x: -1400, y: 200, duration: 0.3, ease: 'power3.in' }, t3 - 0.3);
  // school of soft baits on the 8ths after „Crazy“
  const e8 = (k) => { const b = Math.floor(k / 2), a = ctx.at(2, b), n = ctx.at(2, b + 1); return k % 2 ? (a + n) / 2 : a; };
  const SCH = [[PR.scalp, 270, 248, 865, -28], [PR.comet, 230, 845, 860, 18], [PR.polaris, 270, 240, 1420, 22], [PR.nimble, 210, 860, 1415, -12], [PR.glider, 300, 560, 1505, -8]];
  SCH.forEach(([i, V, cx, cy, rot], k) => {
    const P = F.prod(ctx, { id: `sc${k}`, i, V, cx, cy, rot, so: 0.6, drop: '0 16px 22px rgba(0,0,0,.55)' });
    cf += P.html;
    const t = Math.min(t3 - 0.45, Math.max(tCrazy, e8(3)) + k * (ctx.BEAT / 2));
    ctx.tl.fromTo(P.sel, { opacity: 0 }, { opacity: 1, duration: 0.03, ease: 'none' }, t);
    ctx.tl.fromTo(P.sel, { scale: 0.55, rotation: rot > 0 ? -30 : 30 }, { scale: 1, rotation: 0, duration: 0.42, ease: 'back.out(1.8)' }, t);
    const dx = cx - 540, dy = cy - 1150;
    ctx.tl.fromTo(P.sel, { x: 0, y: 0 }, { x: dx * 2.2, y: dy * 2.2, duration: 0.3, ease: 'power3.in' }, t3 - 0.3 + k * 0.01);
  });
  html += fx.scene(ctx, 'scf', t2 - 0.04, t3, cf, { inD: 0.001, outD: 0.001 });
  ctx.plate.tone(t2, t3, 'dark');

  // ================= bar 3: SPINMAD — silver + blue =================
  let sm = `<div class="fx-full" style="background:radial-gradient(70% 48% at 50% 58%, #ffffff 0%, ${C.smSilver} 45%, ${C.smSilver2} 100%)"></div>`;
  sm += F.band(ctx, { id: 'bds', y: 1560, h: 220, rot: -22, color: C.sm, op: 0.85, drift: -160, t0: t3, t1: t4 });
  const RIG = [[PR.impulse, { V: 880 }, -12, 'Impulse PRO · 10 g'], [PR.hart, { V: 760 }, -10, 'Spicy Blade Hart · 9 g'], [PR.king, { V: 800 }, -10, 'Spicy Blade King · 14 g'], [PR.target, { VH: 600 }, 0, 'Target Spoon · 1,5 g']];
  const rigT = [t3, ctx.at(3, 1), ctx.at(3, 2), ctx.at(3, 3), t4];
  RIG.forEach(([i, sz, rot, name], k) => {
    const P = F.prod(ctx, { id: `rg${k}`, i, ...sz, cx: 540, cy: 1130, rot, so: 0.85, drop: '0 26px 30px rgba(10,30,60,.32)' });
    sm += P.html;
    const a = rigT[k], b = rigT[k + 1];
    ctx.tl.fromTo(P.sel, { opacity: 0 }, { opacity: 1, duration: 0.02, ease: 'none' }, a - (k ? 0.03 : 0.08));
    if (k === 0) ctx.tl.fromTo(P.sel, { rotation: -40, scale: 1.3, x: 380 }, { rotation: 0, scale: 1, x: 0, duration: 0.5, ease: 'expo.out' }, a - 0.08);
    else ctx.tl.fromTo(P.sel, { scale: 1.14 }, { scale: 1, duration: 0.3, ease: 'power3.out' }, a - 0.03);
    F.sweep(ctx, `rg${k}`, a + 0.05, { d: 0.45 });
    if (k < RIG.length - 1) ctx.tl.set(P.sel, { opacity: 0 }, b - 0.03);
    else ctx.tl.fromTo(P.sel, { y: 0, rotation: 0 }, { y: -1500, rotation: 14, duration: 0.3, ease: 'power3.in' }, t4 - 0.3);
    // product name tag under the rig (short, beat-long: a label, not a message)
    sm += F.label(ctx, { id: `rn${k}`, text: name, y: 1430, size: 38, wght: 700, wdth: 100, color: C.ink, align: 'center', tracking: 0.04, style: 'opacity:0;text-transform:none' });
    ctx.tl.set(ctx.sel(`rn${k}`), { opacity: 1 }, a - 0.03);
    ctx.tl.set(ctx.sel(`rn${k}`), { opacity: 0 }, k < RIG.length - 1 ? b - 0.03 : t4 - 0.3);
  });
  html += fx.scene(ctx, 'ssm', t3 - 0.04, t4, sm, { inD: 0.001, outD: 0.001 });

  // ================= NÁSTRAHY (bars 2–3) + brand logo per bar =================
  const hN = fx.headline(ctx, { id: 'hn', text: 'Nástrahy', x: L, y: yT + 10, w: CW, maxLines: 1, font: EXO, wght: 900, upper: true, tracking: -0.01, lh: 0.92, sizes: [190, 180, 170, 160], color: '#ffffff', t: t2 - 0.08, reveal: 'lines', d: 0.36, out: t4 - 0.3, outD: 0.26 });
  html += hN.html;
  ctx.tl.set(hN.sel, { color: C.ink }, t3);
  const yLg = yT + 10 + hN.h + 34;
  const cfRel = ctx.data.brands.crazyfish.on_dark, smRel = ctx.data.brands.spinmad.on_light;
  const ar = (rel) => { const [w, h] = ctx.dims(rel); return w / h; };
  const lgC = ctx.logo(cfRel, { box: [178, 150], at: [tCrazy, t3], label: 'ftfishing Crazy Fish (bar 2)' });
  const lgS = ctx.logo(smRel, { box: [281, 120], at: [t3, t4], label: 'ftfishing Spinmad (bar 3)' });
  html += `<div class="ft-bl" id="${ctx.id('cfl')}" style="left:${L}px;top:${yLg}px;width:${lgC.w}px;height:${lgC.h}px;opacity:0"><img src="${lgC.src}" alt="Crazy Fish" style="width:${lgC.w}px;height:${lgC.h}px"></div>`;
  html += `<div class="ft-bl" id="${ctx.id('sml')}" style="left:${L}px;top:${yLg}px;width:${lgS.w}px;height:${lgS.h}px;opacity:0"><img src="${lgS.src}" alt="Spinmad" style="width:${lgS.w}px;height:${lgS.h}px"></div>`;
  ctx.tl.set(ctx.sel('cfl'), { opacity: 1 }, tCrazy);
  ctx.tl.fromTo(ctx.sel('cfl'), { x: -50, rotation: -6 }, { x: 0, rotation: 0, duration: 0.42, ease: 'back.out(1.6)' }, tCrazy);
  ctx.tl.set(ctx.sel('cfl'), { opacity: 0 }, t3);
  ctx.tl.set(ctx.sel('sml'), { opacity: 1 }, t3 - 0.02);
  ctx.tl.fromTo(ctx.sel('sml'), { x: -50 }, { x: 0, duration: 0.42, ease: 'expo.out' }, t3 - 0.02);
  ctx.tl.fromTo(ctx.sel('sml'), { y: 0, opacity: 1 }, { y: -40, opacity: 0, duration: 0.24, ease: 'power3.in' }, t4 - 0.3);

  // ================= FT logo bug (top right, ≤ TA) — bars 0–3, colour variant per world =================
  const bugL = ctx.logo('on_light', { box: [150, 128], at: [0, t4], id: 'bugl', label: 'ftfishing bug light' });
  const bugD = ctx.logo('on_dark', { box: [150, 128], at: [t2, t3], id: 'bugd', label: 'ftfishing bug dark' });
  const bx = W - ctx.safe.right - bugL.w, by = 246;
  html += `<div class="ft-bug" id="${ctx.id('bug')}" style="left:${bx}px;top:${by}px;width:${bugL.w}px;height:${bugL.h}px"><div class="fx-abs" id="${ctx.id('bug1')}" style="inset:0">${bugL.html}</div><div class="fx-abs" id="${ctx.id('bug2')}" style="inset:0;opacity:0">${bugD.html}</div></div>`;
  ctx.tl.set(ctx.sel('bug1'), { opacity: 0 }, t2); ctx.tl.set(ctx.sel('bug2'), { opacity: 1 }, t2);
  ctx.tl.set(ctx.sel('bug1'), { opacity: 1 }, t3); ctx.tl.set(ctx.sel('bug2'), { opacity: 0 }, t3);
  ctx.tl.fromTo(ctx.sel('bug'), { opacity: 1, x: 0 }, { opacity: 0, x: 30, duration: 0.2, ease: 'power2.in' }, t4 - 0.3);

  // ================= bar 4: LOCKUP on white + stripes =================
  let lk = fx.field(ctx, { id: 'lkf', kind: 'radial', c1: '#ffffff', c2: '#eceee9', at: '50% 40%' });
  lk += F.band(ctx, { id: 'bdl', y: 1650, h: 330, rot: -22, drift: -140, t0: t4, t1: END });
  const lgFT = ctx.logo('on_light', { box: [281, 200], at: [t4, END], id: 'lkl', label: 'ftfishing lockup' });
  const yL = 392;
  lk += `<div class="fx-abs" id="${ctx.id('lkw')}" style="left:${(W - lgFT.w) / 2}px;top:${yL}px;width:${lgFT.w}px;height:${lgFT.h}px">${lgFT.html}</div>`;
  let yy = yL + lgFT.h + 22;
  lk += F.label(ctx, { id: 'lks', text: 'Vše pro přívlač', y: yy, size: 50, wght: 800, wdth: 112, color: C.grey, align: 'center' });
  yy += 50 + 24;
  const U = fx.headline(ctx, { id: 'lku', text: 'ftfishing.cz', x: L, y: yy, w: CW, maxLines: 1, font: EXO, wght: 900, upper: false, tracking: -0.01, lh: 1, sizes: [132, 124, 116, 108], align: 'center', color: C.ink, t: t4 - 0.3, reveal: 'chars', stagger: 0.016, d: 0.3 });
  lk += U.html;
  yy += U.h + 26;
  const chip = fx.taChip(ctx, { id: 'pz', text: 'Věnuje ceny', sub: 'MČR 2026', cx: W / 2, y: yy, size: 30, tone: 'light', t: t4 - 0.12 });
  lk += chip.html;
  yy += chip.h + 40;
  lk += brandRow(ctx, { y: yy, t: t4 + 0.04, at: [t4, END], prodTop: yy + 72 * 1.45 + 22, prodH: Math.min(320, 1440 - (yy + 72 * 1.45 + 22)), idp: 'lb' });
  ctx.tl.fromTo(ctx.sel('lkw'), { scale: 0.86 }, { scale: 1, duration: 0.5, ease: 'expo.out' }, t4 - 0.04);
  ctx.tl.fromTo(ctx.sel('lks'), { y: 20 }, { y: 0, duration: 0.45, ease: 'expo.out' }, t4);
  html += fx.scene(ctx, 'slk', t4 - 0.04, END, lk, { inD: 0.001, outD: 0.001 });
  ctx.report(`lockup bottom ${Math.round(yy + 72 * 1.45 + 22 + Math.min(320, 1440 - (yy + 72 * 1.45 + 22)))} · times Pruty ${tPruty.toFixed(2)} Fav ${tFav.toFixed(2)} Crazy ${tCrazy.toFixed(2)}`);

  // ================= transitions: stripes wipe between the worlds; in = white (v9: Velká ryba wipes up into our white) =================
  F.slash(ctx, { id: 'w2', t: t2 });
  F.slash(ctx, { id: 'w3', t: t3, color: C.green });
  F.slash(ctx, { id: 'w4', t: t4 });
  fx.tIn(ctx, 'cut');
  // v9: the panel behind the stripes = the NEXT world's colour (film: ČRS navy → its DĚKUJEME is on screen on the downbeat;
  // Reel: our own white end card) — handoff contract, no white frame before a dark block
  F.slashOut(ctx, { cover: ctx.next?.theme?.bg || '#ffffff' });

  const css = `${F.CSS(S)}
${S} .ft-hair{position:absolute;display:block;border-radius:3px;transform-origin:0 50%}`;
  return { html, css };
}

// ---------- Reel hook (1 bar): Impulse PRO Firetiger macro on the stripes + „VŠE PRO PŘÍVLAČ“, readable at 0.3 s ----------
export function hook(ctx) {
  const S = ctx.S, L = ctx.safe.left, CW = ctx.W - L - ctx.safe.right;
  let html = fx.field(ctx, { kind: 'radial', c1: '#ffffff', c2: '#e9ebe6', at: '50% 60%' });
  html += F.band(ctx, { id: 'hb', y: 1250, h: 340, rot: -22, drift: -160 });
  const P = F.prod(ctx, { id: 'hp', i: PR.impulse, V: 1000, cx: 560, cy: 1180, rot: -16, so: 0.9, drop: '0 34px 40px rgba(0,0,0,.3)' });
  html += `<div class="fx-full" id="${ctx.id('hcam')}" style="transform-origin:300px 1100px">${P.html}</div>`;
  ctx.tl.fromTo(P.sel, { x: 160, scale: 1.1 }, { x: 0, scale: 1, duration: 0.6, ease: 'expo.out' }, 0);
  ctx.tl.fromTo(ctx.sel('hcam'), { scale: 1 }, { scale: 1.07, duration: ctx.dur - 0.4, ease: 'none' }, 0.4);
  F.sweep(ctx, 'hp', 0.25, { d: 0.8 });
  const H1 = fx.headline(ctx, { id: 'hh1', text: 'Vše pro', x: L, y: 410, w: CW, maxLines: 1, font: EXO, wght: 900, upper: true, lh: 0.92, sizes: [190, 180, 170], color: C.ink, t: null });
  const H2 = fx.headline(ctx, { id: 'hh2', text: 'přívlač', x: L, y: 410 + H1.h, w: CW, maxLines: 1, font: EXO, wght: 900, upper: true, lh: 0.92, sizes: [190, 180, 170], color: C.green, t: null });
  const sub = F.label(ctx, { id: 'hsu', text: 'FT Fishing · ftfishing.cz', x: L + 4, y: 410 + H1.h + H2.h + 26, size: 44, wght: 800, wdth: 112, color: C.grey, style: 'text-transform:none' });
  html += `<div class="fx-full" id="${ctx.id('hhw')}" style="transform-origin:${L}px 410px">${H1.html}${H2.html}${sub}</div>`;
  ctx.tl.fromTo(ctx.sel('hhw'), { scale: 1.07 }, { scale: 1, duration: 0.55, ease: 'expo.out' }, 0);
  ctx.tl.fromTo(ctx.sel('hhw'), { opacity: 1 }, { opacity: 0, duration: 0.12, ease: 'power2.in' }, ctx.dur - 0.12);
  return { html, css: F.CSS(S) };
}

// ---------- Reel end card (2 bars): TA plate hero ×1.5, FT logo (≤ TA), slogan, URL, partner line, prize chip, brand columns ----------
export function endCard(ctx) {
  const S = ctx.S, W = ctx.W, L = ctx.safe.left, CW = W - L - ctx.safe.right, END = ctx.dur;
  const SC = 1.5, FLY = 0.42;
  let html = fx.field(ctx, { kind: 'radial', c1: '#ffffff', c2: '#eceee9', at: '50% 40%' });
  html += F.band(ctx, { id: 'eb', y: 1660, h: 330, rot: -22, drift: -200 });
  const P = ctx.plate.hero(-FLY, END, { scale: SC, cx: W / 2, cy: 400, fly: FLY, ease: 'power3.inOut' });
  let y = P.y + P.h + 22;
  html += `<div class="fx-abs" style="left:0;right:0;top:${y}px;text-align:center;font-family:'Montserrat';font-weight:700;font-size:26px;letter-spacing:.2em;text-transform:uppercase;color:${C.ink};opacity:.85">${ctx.esc(ctx.nb(meta.endCard.line))}</div>`;
  y += 26 + 18;
  html += `<i class="ft-hair" id="${ctx.id('ebar')}" style="left:${W / 2 - 70}px;top:${y}px;width:140px;height:3px;background:${fx.TA.red}"></i>`;
  ctx.tl.fromTo(ctx.sel('ebar'), { scaleX: 0.3 }, { scaleX: 1, duration: 0.6, ease: 'expo.out' }, 0);
  y += 3 + 26;
  const lg = ctx.logo('on_light', { box: [400, 230], scale: SC, at: [0, END], id: 'elogo', label: `${ctx.cid} end card` });
  html += `<div class="fx-abs" style="left:${(W - lg.w) / 2}px;top:${y}px;width:${lg.w}px;height:${lg.h}px">${lg.html}</div>`;
  y += lg.h + 18;
  html += F.label(ctx, { id: 'esl', text: 'Vše pro přívlač', y, size: 46, wght: 800, wdth: 112, color: C.grey, align: 'center' });
  y += 46 + 18;
  const U = fx.headline(ctx, { id: 'eu', text: 'ftfishing.cz', x: L, y, w: CW, maxLines: 1, font: EXO, wght: 900, upper: false, lh: 1, sizes: [120, 112, 104], align: 'center', color: C.ink, t: null });
  html += U.html;
  y += U.h + 20;
  const chip = fx.taChip(ctx, { id: 'epz', text: 'Věnuje ceny', sub: 'MČR 2026', cx: W / 2, y, size: 28, tone: 'light', t: null });
  html += chip.html;
  y += chip.h + 28;
  const prodTop = y + 62 * 1.45 + 14;
  html += brandRow(ctx, { y, t: 0, at: [0, END], logoH: 62, prodTop, prodH: Math.min(230, 1456 - prodTop), idp: 'eb', anim: false });
  [0, 1, 2].forEach((j) => { ctx.tl.fromTo(ctx.sel(`ebp${j}`), { y: 30 }, { y: 0, duration: 0.6, ease: 'expo.out' }, 0.02 * j); F.sweep(ctx, `ebp${j}`, 0.5 + j * 0.15, { d: 0.6 }); });
  ctx.report(`end card bottom ${Math.round(prodTop + Math.min(230, 1456 - prodTop))}`);
  fx.tIn(ctx, 'cut');
  const css = `${F.CSS(S)}
${S} .ft-hair{position:absolute;display:block;border-radius:3px;transform-origin:50% 50%}`;
  return { html, css };
}
