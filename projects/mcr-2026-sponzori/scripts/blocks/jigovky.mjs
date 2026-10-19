// JIGOVKY.CZ · plan A bars 29–33 (5 bars ≈ 9.15 s) · concept A „MAKRO 0,4 g" (research/jigovky_ad.md §5, recommended)
// Brand world = their shop CSS: forest #006F33 → deep #01431F, yellow #FFD600 titles in Roboto Slab, PT Sans Narrow caps labels,
// yellow round "vel." badges from their packaging. Products = own-brand jig heads, 4k cut-outs in assets_prep/jigovky/ads/.
//
//   bar 0  MACRO      chrome TroutJig head at ~1:1, push-in + light sweep + glint; "Jigy, které chytají!" word-synced to the VO
//   bar 1  PULL-BACK  camera pulls back to the whole TroutJig; loupe on the barbless point + callout „BEZ PROTIHROTU"; #4 #6 #8 badges
//   bar 2  COLOUR     the loupe grows into a big lens: FLUO → PINK → RED heads on the beat, colour selector (7 colourways), „od 0,4 g" odometer
//   bar 3  RANGE      bento wall of 10 own-brand products assembling on 16ths (assortment moment) + band „Poctivě vyrobeno v ČR"
//   bar 4  LOCKUP     TroutJig hero + SICKLE in depth, the logo travels from the corner into logo | jigovky.cz; slice out
//
// Facts (research/jigovky.md › Verification, research/jigovky_ad.md §4): slogan „Jigy, které chytají!", TroutJig Barbless #4/#6/#8 0,4–3 g,
// bez protihrotu, 7 colourways of Tungsten HD BARBLESS, „Poctivě vyrobeno v ČR". MČR = hard baits → no hint that jigs are used at the event.
// VARIVAS (resold brand) and spinners (treble hooks) are deliberately not shown.
import fs from 'node:fs';
import path from 'node:path';
import * as fx from '../lib/fx.mjs';
import * as J from '../lib/fx_jigovky.mjs';
import { ROOT } from '../lib/util.mjs';

const { C } = J;
export const fonts = {
  'Roboto Slab': { s: { 400: 'roboto-slab-{r}-400-normal', 700: 'roboto-slab-{r}-700-normal', 900: 'roboto-slab-{r}-900-normal' }, use: 'Jigovky display (shop CSS headings) — @fontsource 5.3.0, Apache-2.0' },
  'PT Sans Narrow': { s: { 400: 'pt-sans-narrow-{r}-400-normal', 700: 'pt-sans-narrow-{r}-700-normal' }, use: 'Jigovky labels / prices (shop CSS) — @fontsource 5.3.0, OFL' },
};
export const theme = { bg: C.deep, bg2: C.forest, fg: '#FFFFFF', accent: C.yellow, accent2: C.leaf, font: { display: 'Roboto Slab', text: 'PT Sans Narrow' }, wght: 900, upper: false, light: false };
export const meta = {
  reel: true,
  hook: { product: 'assets_prep/jigovky/ads/head_fluo.png', headline: 'Od 0,4 g. Bez protihrotu.', sub: 'jigovky.cz' },   // custom hook() below
  endCard: { logo: 'on_dark', line: 'Partner MČR v Trout Area 2026' },                                                   // custom endCard() below
};

// ---------- assets (4k cut-outs + anchors from assets_prep/jigovky/ads/_meta.json) ----------
const ADS = 'assets_prep/jigovky/ads/';
const META = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, ADS, '_meta.json'), 'utf8')).items; } catch { return []; } })();
const anchorOf = (file, k = 'head', d = [0.85, 0.62]) => META.find((m) => m.file.endsWith('/' + file))?.anchors?.[k] || d;
const headPxOf = (file, d) => META.find((m) => m.file.endsWith('/' + file))?.head_px || d;
const PR = {
  tj: { src: ADS + 'hero_troutjig_barbless.png', label: ['TroutJig', 'Barbless'] },
  sk: { src: ADS + 'hero_sickle.png', label: ['Jigová hlavička', 'SICKLE'] },
  fluo: { src: ADS + 'head_fluo.png', label: ['HD Barbless', 'Fluo'] },
  pink: { src: ADS + 'head_pink.png', label: ['HD Barbless', 'Pink'] },
  red: { src: ADS + 'head_red.png', label: ['HD Barbless', 'Red'] },
  chrome: { src: ADS + 'head_chrome_macro.png', label: ['HD Barbless', '3 g'] },
  ll: { src: ADS + 'sec_head_ll_raw.png', label: ['LL Barbless', '2 g'] },
  gold: { src: ADS + 'head_gold.png', label: ['H 360 BL', 'Gold'] },
  orange: { src: ADS + 'head_orange.png', label: ['H 360 BL', 'Orange'] },
  silver: { src: ADS + 'head_silver.png', label: ['HD Barbless', 'Silver'] },
};
for (const [k, p] of Object.entries(PR)) { const f = p.src.split('/').pop(); p.head = anchorOf(f); p.hpx = headPxOf(f, null); p.key = k; }
PR.tj.hpx = 519; PR.sk.hpx = 627;                               // ball heads of the two complete jigs (2·head_r·W)
const TJ_VIS = [90, 90, 2309, 1480];                            // alpha bbox of hero_troutjig_barbless (2400×1571)
const TJ_TIP = [1428, 195];                                     // tip of the barbless point (native px, measured)
const SK_VIS = [0.037, 0.088, 0.963, 0.911];                    // alpha bbox of hero_sickle (normalised)
const PAD_TJ = [0.037, 0.057, 0.038, 0.058], PAD_SK = [0.037, 0.088, 0.037, 0.089];

// big cut-outs are staged at native size (macro ~1:1); must run before any ctx.dims() of them in this process
function stage(ctx) { ctx.asset(PR.tj.src, { maxSide: 2400 }); }

const px = (n) => `${Math.round(n * 10) / 10}px`;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export default function jigovky(ctx) {
  stage(ctx);
  const { bar, W } = ctx, L = ctx.safe.left, R = W - ctx.safe.right, UIR = W - ctx.safe.uiRight;   // UIR: right edge for key content below y 900
  const beatAt = (t) => ctx.snap(t, 'beat');
  // VO word times (block-local; fallbacks = current take) — kinetic type lands ~0.06 s before the word
  const vw = (re, d) => { const w = ctx.vo.words.find((x) => re.test(x.w)); return w ? w.t0 : d; };
  const tName = vw(/^jigovky/i, 0.25), tJigy = vw(/^jigy/i, 1.28), tKtere = vw(/^kter/i, 1.92), tChyt = vw(/^chyt/i, 2.14);
  const tBez = vw(/^bezproti/i, 2.87), tOd = vw(/^od$/i, 4.41), t04 = vw(/^0,4/, 4.74), tPoct = vw(/^poctiv/i, 6.32);
  const B1 = bar(1), B2 = bar(2), B3 = bar(3), B4 = bar(4), END = ctx.dur;
  let html = '';
  const css = [J.css(ctx), `${ctx.S} .jg-vig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(130% 90% at 50% 46%,transparent 52%,rgba(0,16,7,.62) 100%)}`];

  // ---------- WORLD: forest lightbox + fog + vignette ----------
  html += fx.field(ctx, { id: 'bg', bg: `radial-gradient(75% 46% at 50% 45%, #0b7f40 0%, ${C.forest} 26%, ${C.deep} 62%, ${C.night} 100%)` });
  html += fx.mesh(ctx, { id: 'fog', colors: [C.leaf, '#0a5c2c', C.forest], size: 900, blur: 150, opacity: 0.32, drift: 120, seed: 4 });
  // colour glow behind the lens (bar 2): one element, colour switched per head (currentColor)
  html += `<div class="fx-glow" id="${ctx.id('cg')}" style="left:${px(540 - 760)};top:${px(800 - 760)};width:1520px;height:1520px;background:radial-gradient(closest-side,currentColor,transparent);color:${J.SW[0][1]};opacity:0"></div>`;
  html += `<div class="jg-vig" id="${ctx.id('vig')}"></div>`;

  // ---------- LOGO (top-right bug from „Jigovky", travels into the lockup in bar 4) ----------
  const LG = ctx.logo('on_dark', { box: [281, 120], at: [tName, END], id: 'logo' });
  const lgX = R - LG.w, lgY = ctx.plate.rect.y + ctx.plate.rect.h / 2 - LG.h / 2;
  // lockup row: logo | jigovky.cz (centred in the UI-safe width)
  const urlSize = 92, urlW = ctx.measure(ctx.data.url, { font: 'Roboto Slab', size: urlSize, wght: 900, tracking: -0.01 });
  const rowW = LG.w + 34 + 3 + 34 + urlW, rowX = Math.round(L + (UIR - L - rowW) / 2), rowY = 1110;
  const tLock = B4;
  ctx.tl.fromTo(ctx.sel('lw'), { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.55, ease: 'expo.out' }, Math.max(0.12, tName - 0.04));
  ctx.tl.fromTo(ctx.sel('lw'), { x: 0, y: 0 }, { x: rowX - lgX, y: rowY + (urlSize * 1.0 - LG.h) / 2 + 4 - lgY, duration: 0.62, ease: 'expo.inOut' }, tLock);

  // ===================================================================================================
  // BAR 0–1 · MACRO → PULL-BACK (one TroutJig, camera on #tj-cam, origin = ball head)
  // ===================================================================================================
  const [tw, th] = ctx.dims(PR.tj.src);
  const k = tw / 2400;                                                     // staged / native (1 when staged at 2400)
  const hx = PR.tj.head[0] * tw, hy = PR.tj.head[1] * th;                  // head in element px
  const HX = 560, HY = 880;                                                // macro: head centre on screen (scale 1)
  const sF = 880 / ((TJ_VIS[2] - TJ_VIS[0]) * k);                          // full shot: visible jig 880 px wide
  const VC = [540, 860];                                                   // full shot: visible centre
  const vcx = ((TJ_VIS[0] + TJ_VIS[2]) / 2) * k, vcy = ((TJ_VIS[1] + TJ_VIS[3]) / 2) * k;
  const Hf = [VC[0] + sF * (hx - vcx), VC[1] + sF * (hy - vcy)];          // head on screen in the full shot
  const full = (nx, ny) => [Hf[0] + sF * (nx * k - hx), Hf[1] + sF * (ny * k - hy)];
  const P1 = J.place(ctx, { id: 'tj', src: PR.tj.src, s: 1, u: PR.tj.head[0], v: PR.tj.head[1], x: HX, y: HY, ground: 'float', pad: PAD_TJ, sweepOpacity: 0.85, shadow: 0.55 });
  html += P1.html;
  ctx.tl.set(P1.cam, { transformOrigin: `${px(hx)} ${px(hy)}` }, 0);
  const tPull = B1, dPull = 0.92;
  ctx.tl.fromTo(P1.cam, { scale: 0.93, x: 0, y: 0 }, { scale: 1.06, x: 0, y: 0, duration: tPull, ease: 'sine.inOut' }, 0);
  ctx.tl.fromTo(P1.cam, { scale: 1.06, x: 0, y: 0 }, { scale: sF, x: Hf[0] - HX, y: Hf[1] - HY, duration: dPull, ease: 'expo.inOut' }, tPull);
  ctx.tl.fromTo(P1.sel, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power1.out' }, 0.04);
  fx.sweep(ctx, 'tj', Math.max(0.6, tJigy - 0.3), { d: 1.0 });
  html += J.glint(ctx, { id: 'gl1', x: HX - 0.36 * 260, y: HY - 0.42 * 260, size: 300, t: tJigy - 0.05, d: 0.8 });
  ctx.tl.fromTo(P1.sel, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.94, duration: 0.28, ease: 'power2.in' }, B2 - 0.06);

  // headline — „Jigy, které chytají!" (their slogan) word by word with the VO
  const H1 = J.voType(ctx, { id: 'h1', text: 'Jigy, které chytají!', times: [tJigy - 0.06, tKtere - 0.06, tChyt - 0.06], x: L, y: 1186, w: R - L, maxLines: 2, sizes: [136, 128, 120, 112, 104], color: C.yellow, lh: 1.02, tracking: -0.012 });
  html += H1.html;
  const tH1out = B2 - 0.26;                                                // ≈ 3.41 s: the slogan holds under the whole pull-back
  J.typeOutWords(ctx, H1, tH1out, { d: 0.24 });

  // ===================================================================================================
  // BAR 1 · loupe on the barbless point (1:1 native pixels) + callout + pill „BEZ PROTIHROTU" (the pill stays for the barbless heads in bar 2)
  // ===================================================================================================
  const tip = full(TJ_TIP[0], TJ_TIP[1]);
  const LP = { cx: 304, cy: 538, r: 140 };
  const PILL2_Y = 408;                                                     // pill position above the big lens in bar 2
  const tLoupe = clamp(beatAt(tBez), B1 + 0.4, B2 - 0.6);                  // 2.74 (beat before „Bezprotihrotové")
  {
    const nx = 1478 * k, ny = 182 * k;                                     // native point region shown 1:1 inside the loupe
    html += `<div class="jg-lens" id="${ctx.id('lp')}" style="left:${px(LP.cx - LP.r)};top:${px(LP.cy - LP.r)};width:${px(LP.r * 2)};height:${px(LP.r * 2)};background:radial-gradient(circle at 40% 35%,#0d7a3d,${C.deep} 70%);box-shadow:0 26px 60px rgba(0,16,7,.5),inset 0 0 0 2px rgba(255,214,0,.0)">
      <img src="${ctx.asset(PR.tj.src)}" alt="" style="position:absolute;left:${px(LP.r - nx)};top:${px(LP.r - ny)};width:${px(tw)};height:${px(th)};max-width:none"></div>`;
    html += J.lensRing(ctx, { id: 'lpr', cx: LP.cx, cy: LP.cy, r: LP.r, ticks: 40 });
    ctx.tl.fromTo(ctx.sel('lp'), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' }, tLoupe);
    ctx.tl.fromTo(ctx.sel('lpr'), { scale: 0.6, opacity: 0, rotation: -40 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: 'expo.out' }, tLoupe + 0.04);
    ctx.tl.fromTo(ctx.sel('lpr'), { rotation: 0 }, { rotation: 30, duration: B2 - tLoupe - 0.66, ease: 'none' }, tLoupe + 0.64);
    // leader: tip → loupe edge
    const a = Math.atan2(tip[1] - LP.cy, tip[0] - LP.cx), e = [LP.cx + Math.cos(a) * (LP.r + 8), LP.cy + Math.sin(a) * (LP.r + 8)];
    html += J.callout(ctx, { id: 'co', pts: [tip, e], t: tLoupe + 0.1, d: 0.32 });
    const PL = J.pill(ctx, { id: 'pl', text: 'Bez protihrotu', x: LP.cx + LP.r + 30, y: LP.cy - LP.r + 44, h: 74, size: 48, t: tLoupe + 0.16 });
    html += PL.html;
    // exits (the big lens takes over from the loupe at B2)
    ctx.tl.fromTo(ctx.sel('lp'), { opacity: 1 }, { opacity: 0, duration: 0.16, ease: 'none' }, B2 + 0.1);
    ctx.tl.fromTo(ctx.sel('lpr'), { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.4, duration: 0.3, ease: 'power2.in' }, B2 - 0.05);
    for (const s of ['co', 'co-d']) ctx.tl.fromTo(ctx.sel(s), { opacity: 1 }, { opacity: 0, duration: 0.2, ease: 'power1.in' }, B2 - 0.1);
    // the pill re-centres above the big lens, holds through the colour heads (all barbless) and leaves with the lens
    ctx.tl.fromTo(ctx.sel('pl'), { x: 0, y: 0 }, { x: 540 - PL.w / 2 - (LP.cx + LP.r + 30), y: PILL2_Y - (LP.cy - LP.r + 44), duration: 0.5, ease: 'expo.inOut' }, B2 - 0.02);
    ctx.tl.fromTo(ctx.sel('pl'), { opacity: 1 }, { opacity: 0, duration: 0.22, ease: 'power1.in' }, B3 - 0.14);
  }

  // ===================================================================================================
  // BAR 2 · COLOUR LENS (FLUO → PINK → RED on the beat) + colour selector + „od 0,4 g"
  // ===================================================================================================
  const LN = { cx: 540, cy: 826, r: 300 };
  const heads = [PR.fluo, PR.pink, PR.red];
  const swaps = [B2, ctx.beats.find((b) => b > B2 + 0.3), ctx.beats.find((b) => b > B2 + 0.75)];   // 3.668 · 4.133 · 4.574
  const swatchIx = [0, 1, 2];
  {
    let inner = `<div class="fx-glow" id="${ctx.id('lng')}" style="left:${px(LN.r - 310)};top:${px(LN.r - 310)};width:620px;height:620px;background:radial-gradient(closest-side,currentColor,transparent 100%);color:${J.SW[0][1]};opacity:.55"></div>`;
    heads.forEach((p, i) => {
      const s = Math.min(1.13, 296 / p.hpx);
      const P = J.place(ctx, { id: `lh${i}`, src: p.src, s, u: p.head[0], v: p.head[1], x: LN.r + 24, y: LN.r + 40, ground: 'none', sweepOpacity: 0.8 });
      inner += P.html;
    });
    html += `<div class="jg-lens" id="${ctx.id('ln')}" style="left:${px(LN.cx - LN.r)};top:${px(LN.cy - LN.r)};width:${px(LN.r * 2)};height:${px(LN.r * 2)};background:radial-gradient(circle at 42% 36%,#0f8a45 0%,${C.deep} 72%);box-shadow:0 40px 90px rgba(0,16,7,.55)">${inner}</div>`;
    html += J.lensRing(ctx, { id: 'lnr', cx: LN.cx, cy: LN.cy, r: LN.r, ticks: 72 });
    // match-cut: the big lens starts exactly on the loupe and grows into place
    ctx.tl.set(ctx.sel('ln'), { opacity: 0 }, 0);
    ctx.tl.set(ctx.sel('ln'), { opacity: 1 }, B2 - 0.02);
    ctx.tl.fromTo(ctx.sel('ln'), { x: LP.cx - LN.cx, y: LP.cy - LN.cy, scale: LP.r / LN.r }, { x: 0, y: 0, scale: 1, duration: 0.45, ease: 'expo.inOut' }, B2 - 0.02);
    ctx.tl.fromTo(ctx.sel('lnr'), { x: LP.cx - LN.cx, y: LP.cy - LN.cy, scale: LP.r / LN.r, opacity: 0, rotation: 30 }, { x: 0, y: 0, scale: 1, opacity: 1, rotation: 0, duration: 0.45, ease: 'expo.inOut' }, B2 - 0.02);
    ctx.tl.fromTo(ctx.sel('lnr'), { rotation: 0 }, { rotation: 45, duration: B3 - B2 - 0.62, ease: 'none' }, B2 + 0.44);
    // head swaps on the beat (+ lens punch, ring bloom, sweep, glow colour)
    heads.forEach((_, i) => ctx.tl.set(ctx.sel(`lh${i}`), { opacity: i ? 0 : 1 }, 0));
    swaps.forEach((t, i) => {
      if (i) { ctx.tl.set(ctx.sel(`lh${i - 1}`), { opacity: 0 }, t); ctx.tl.set(ctx.sel(`lh${i}`), { opacity: 1 }, t); }
      const col = J.SW[swatchIx[i]][1];
      ctx.tl.set(ctx.sel('lng'), { color: col }, i ? t : 0);
      ctx.tl.set(ctx.sel('cg'), { color: col }, i ? t : 0);
      fx.punch(ctx, ctx.sel(`lh${i}-cam`), t, { scale: 1.1, d: 0.4 });
      fx.sweep(ctx, `lh${i}`, t + 0.05, { d: 0.5 });
      if (i) ctx.tl.hit(ctx.sel('lnr'), { scale: 1.05 }, { scale: 1, duration: 0.3, ease: 'power2.out' }, t);
    });
    ctx.tl.fromTo(ctx.sel('cg'), { opacity: 0 }, { opacity: 0.34, duration: 0.4, ease: 'power1.out' }, B2);
    ctx.tl.fromTo(ctx.sel('cg'), { opacity: 0.34 }, { opacity: 0, duration: 0.3, ease: 'power1.in' }, B3 - 0.1);
    // exit: lens shrinks + fades as the range wall slams in
    ctx.tl.fromTo(ctx.sel('ln'), { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.7, duration: 0.26, ease: 'power3.in' }, B3 - 0.12);
    ctx.tl.fromTo(ctx.sel('lnr'), { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.7, duration: 0.26, ease: 'power3.in' }, B3 - 0.12);
  }
  // colour selector: 7 colourways of Tungsten HD BARBLESS, the ring sits on the colour in the lens
  {
    const dD = 46, gap = 28, n = J.SW.length, rw = n * dD + (n - 1) * gap, x0 = 540 - rw / 2, y0 = LN.cy + LN.r + 58;
    let dots = '';
    J.SW.forEach(([nm, col], i) => { dots += `<i class="jg-dot" id="${ctx.id(`sw${i}`)}" style="left:${px(x0 + i * (dD + gap))};top:${px(y0)};width:${dD}px;height:${dD}px;background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.55),rgba(255,255,255,0) 45%),${col};box-shadow:0 6px 14px rgba(0,0,0,.35),inset 0 0 0 1.5px rgba(255,255,255,.25)"></i>`; });
    dots += `<i class="jg-dot" id="${ctx.id('swr')}" style="left:${px(x0 - 9)};top:${px(y0 - 9)};width:${dD + 18}px;height:${dD + 18}px;border:3px solid ${C.yellow};box-sizing:border-box"></i>`;
    html += `<div class="fx-full" id="${ctx.id('swg')}">${dots}</div>`;
    J.SW.forEach((_, i) => ctx.tl.fromTo(ctx.sel(`sw${i}`), { scale: 0, y: 20 }, { scale: 1, y: 0, duration: 0.45, ease: 'back.out(2)' }, B2 + 0.12 + i * 0.045));
    ctx.tl.fromTo(ctx.sel('swr'), { scale: 0 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' }, B2 + 0.2);
    swaps.slice(1).forEach((t, i) => ctx.tl.fromTo(ctx.sel('swr'), { x: swatchIx[i] * (dD + gap) }, { x: swatchIx[i + 1] * (dD + gap), duration: 0.3, ease: 'expo.out' }, t));
    ctx.tl.fromTo(ctx.sel('swg'), { opacity: 1 }, { opacity: 0, duration: 0.2, ease: 'power1.in' }, B3 - 0.12);
  }
  // „od 0,4 g": the digits roll from the beat before „od" and land on „nula celá čtyři"
  {
    const size = 176, od = 'od', odS = 64;
    const numW = ctx.measure('0,4 g', { font: 'Roboto Slab', size, wght: 900 });
    const odW = ctx.measure(od, { font: 'PT Sans Narrow', size: odS, wght: 700, upper: true, tracking: 0.04 });
    const gx = 26, tot = odW + gx + numW, x0 = 540 - tot / 2, y0 = LN.cy + LN.r + 150;
    const tRoll = clamp(beatAt(tOd) - ctx.BEAT, B2 + 0.25, t04 - 0.5);       // ≈ 4.13
    html += `<div class="jg-lbl" id="${ctx.id('od')}" style="left:${px(x0)};top:${px(y0 + size * 0.86 - odS * 0.95)};${J.FN};font-size:${odS}px;color:#fff">${od}</div>`;
    ctx.tl.fromTo(ctx.sel('od'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45, ease: 'expo.out' }, tRoll);
    html += fx.odometer(ctx, { id: 'odo', value: '0,4', suffix: '\u00a0g', x: x0 + odW + gx, y: y0, size, font: 'Roboto Slab', wght: 900, color: C.yellow, t: tRoll, d: t04 + 0.06 - tRoll, spins: 1, ease: 'power3.out' });
    ctx.tl.fromTo(ctx.sel('odo'), { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'none' }, tRoll);
    ctx.tl.hit(ctx.sel('odo'), { scale: 1.08 }, { scale: 1, duration: 0.4, ease: 'power2.out' }, t04 + 0.06);
    for (const s of ['od', 'odo']) ctx.tl.fromTo(ctx.sel(s), { opacity: 1, y: 0 }, { opacity: 0, y: -26, duration: 0.24, ease: 'power2.in' }, B3 - 0.12);
  }

  // ===================================================================================================
  // BAR 3 · RANGE — bento wall, 10 own-brand products, tiles land on 16ths; band „Poctivě vyrobeno v ČR"
  // ===================================================================================================
  const GX = L, GW = R - L, gap = 14, cw = (GW - 2 * gap) / 3;
  const rows = [{ y: 384, h: 300 }, { h: 200 }, { h: 200 }, { h: 190 }];
  rows.forEach((r, i) => { if (i) r.y = rows[i - 1].y + rows[i - 1].h + gap; });
  // [product, row, col, colspan, head display px (null = whole jig fitted), head position in the tile]
  const T = [
    [PR.tj, 0, 0, 2], [PR.fluo, 0, 2, 1, 150],
    [PR.pink, 1, 0, 1, 112], [PR.red, 1, 1, 1, 118], [PR.chrome, 1, 2, 1, 118],
    [PR.sk, 2, 0, 2], [PR.ll, 2, 2, 1, 118],
    [PR.gold, 3, 0, 1, 104], [PR.orange, 3, 1, 1, 106], [PR.silver, 3, 2, 1, 96],
  ];
  const tWall = B3;
  const tiles = [];
  T.forEach(([p, ri, ci, span, hp], i) => {
    const r = rows[ri], x = GX + ci * (cw + gap), w = cw * span + gap * (span - 1), y = r.y, h = r.h, id = `t${i}`;
    let prod = '';
    if (hp) {
      const s = Math.min(1.15, hp / p.hpx);
      const P = J.place(ctx, { id: `${id}p`, src: p.src, s, u: p.head[0], v: p.head[1], x: w - 22 - hp * 0.62, y: h - 22 - hp * 0.55, ground: 'none', sweep: false });
      prod = P.html;
    } else {
      const vis = p === PR.tj ? [TJ_VIS[0] / 2400, TJ_VIS[1] / 1571, TJ_VIS[2] / 2400, TJ_VIS[3] / 1571] : SK_VIS;
      const [nw, nh] = ctx.dims(p.src);
      const vw0 = (vis[2] - vis[0]) * nw, vh0 = (vis[3] - vis[1]) * nh;
      const s = Math.min(1, (w - 230) / vw0, (h - 54) / vh0);
      const vx = w - 26 - (vw0 * s) / 2, vy = h / 2 + 6;
      const P = J.place(ctx, { id: `${id}p`, src: p.src, s, u: (vis[0] + vis[2]) / 2, v: (vis[1] + vis[3]) / 2, x: vx, y: vy, ground: 'none', sweep: false });
      prod = P.html;
    }
    const lbl = `<div class="jg-lbl" style="${J.FN}"><span style="display:block;font-size:22px;opacity:.7;letter-spacing:.1em">${ctx.esc(ctx.nb(p.label[0]))}</span><span style="display:block;font-size:34px;color:${C.yellow};letter-spacing:.04em;margin-top:2px">${ctx.esc(ctx.nb(p.label[1]))}</span></div>`;
    html += `<div class="jg-tile" id="${ctx.id(id)}" style="left:${px(x)};top:${px(y)};width:${px(w)};height:${px(h)}">${prod}${lbl}</div>`;
    tiles.push({ id, cx: x + w / 2, cy: y + h / 2 });
    const t = tWall + i * (ctx.BEAT / 4) - 0.02;
    ctx.tl.fromTo(ctx.sel(id), { opacity: 0, scale: 0.84, y: 46 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'expo.out' }, t);
    ctx.tl.fromTo(ctx.sel(`${id}p`), { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: 'expo.out' }, t + 0.06);
  });
  // beat accents on the finished wall: products punch in a diagonal run on beats 3 and 4 of bar 3
  [ctx.beats.find((b) => b > B3 + 1.5 * ctx.BEAT), ctx.beats.find((b) => b > B3 + 2.5 * ctx.BEAT)].forEach((tb, j) => {
    if (tb == null) return;
    tiles.forEach((tt, i) => fx.punch(ctx, ctx.sel(`${tt.id}p-cam`), tb + i * 0.018, { scale: j ? 1.1 : 1.07, d: 0.32 }));
  });
  // band
  const BD = { x: L, y: rows[3].y + rows[3].h + 22, w: UIR - L, h: 116 };
  const tBand = Math.max(B3 + 2 * ctx.BEAT - 0.25, tPoct - 0.1);
  {
    const fs = ctx.fit('Poctivě vyrobeno v ČR', { font: 'PT Sans Narrow', wght: 700, upper: true, tracking: 0.03, maxW: BD.w - 60, maxLines: 1, sizes: [80, 76, 72, 68, 64] });
    html += `<div class="fx-abs" id="${ctx.id('bd')}" style="left:${px(BD.x)};top:${px(BD.y)};width:${px(BD.w)};height:${px(BD.h)};background:${C.yellow};border-radius:20px;overflow:hidden;box-shadow:0 18px 40px rgba(0,16,7,.4)"><div class="jg-lbl" id="${ctx.id('bdt')}" style="${J.FN};left:30px;top:${px((BD.h - fs.size * 1.12) / 2)};font-size:${fs.size}px;line-height:1.12;color:${C.deep};letter-spacing:.03em">${ctx.esc(ctx.nb('Poctivě vyrobeno v ČR'))}</div></div>`;
    ctx.tl.set(ctx.sel('bd'), { transformOrigin: '0% 50%' }, 0);
    ctx.tl.fromTo(ctx.sel('bd'), { scaleX: 0 }, { scaleX: 1, duration: 0.42, ease: 'expo.out' }, tBand);
    ctx.tl.fromTo(ctx.sel('bdt'), { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'expo.out' }, tBand + 0.1);
  }

  // ===================================================================================================
  // BAR 4 · LOCKUP — wall explodes outward, TroutJig hero + SICKLE in depth, logo | jigovky.cz
  // ===================================================================================================
  tiles.forEach((tt, i) => {
    const dx = (tt.cx - 540) * 0.55, dy = (tt.cy - 840) * 0.55, dist = Math.hypot(tt.cx - 540, tt.cy - 840);
    ctx.tl.fromTo(ctx.sel(tt.id), { opacity: 1, x: 0, y: 0, scale: 1 }, { opacity: 0, x: dx, y: dy, scale: 0.72, duration: 0.42, ease: 'power3.in' }, tLock - 0.2 + dist * 0.00012);
  });
  // depth: SICKLE behind (soft, darker), hero in front
  {
    const [nw, nh] = ctx.dims(PR.sk.src);
    const s = 640 / ((SK_VIS[2] - SK_VIS[0]) * nw);
    const P = J.place(ctx, { id: 'sk', src: PR.sk.src, s, u: 0.5, v: 0.5, x: 690, y: 560, ground: 'none', sweep: false, rot: -14 });
    html += `<div class="fx-abs" id="${ctx.id('skw')}" style="inset:0;filter:blur(5px) brightness(.62) saturate(.9);opacity:0">${P.html}</div>`;
    ctx.tl.fromTo(ctx.sel('skw'), { opacity: 0 }, { opacity: 0.85, duration: 0.6, ease: 'power1.out' }, tLock + 0.05);
    ctx.tl.fromTo(P.cam, { x: 60, y: -20, scale: 0.92 }, { x: -30, y: 10, scale: 1.0, duration: END - tLock, ease: 'sine.out' }, tLock);
  }
  html += fx.glow(ctx, { id: 'lkg', x: 540, y: 760, size: 1100, color: 'rgba(170,255,200,.55)', opacity: 0 });
  ctx.tl.fromTo(ctx.sel('lkg'), { opacity: 0 }, { opacity: 0.55, duration: 0.6, ease: 'power1.out' }, tLock);
  {
    const s = 760 / ((TJ_VIS[2] - TJ_VIS[0]) * k);
    const P = J.place(ctx, { id: 'tj2', src: PR.tj.src, s, u: ((TJ_VIS[0] + TJ_VIS[2]) / 2) / 2400, v: ((TJ_VIS[1] + TJ_VIS[3]) / 2) / 1571, x: 530, y: 770, ground: 'float', pad: PAD_TJ, sweepOpacity: 0.85, shadow: 0.6, rot: -6 });
    html += P.html;
    ctx.tl.fromTo(P.sel, { opacity: 0, scale: 0.62, y: 90 }, { opacity: 1, scale: 1, y: 0, duration: 0.75, ease: 'expo.out' }, tLock - 0.04);
    ctx.tl.fromTo(P.cam, { y: 0 }, { y: -16, duration: END - tLock - 0.6, ease: 'sine.inOut' }, tLock + 0.6);
    fx.sweep(ctx, 'tj2', tLock + ctx.BEAT, { d: 0.85 });
    const [gx, gy] = P.at(PR.tj.head[0] - 0.035, PR.tj.head[1] - 0.06);
    html += J.glint(ctx, { id: 'gl2', x: gx, y: gy, size: 230, t: tLock + ctx.BEAT + 0.25, d: 0.75 });
  }
  // lockup row: [logo (travels in)] | jigovky.cz
  html += `<i class="fx-abs" id="${ctx.id('dv')}" style="left:${px(rowX + LG.w + 34)};top:${px(rowY + 4)};width:3px;height:${px(urlSize * 1.02)};background:rgba(255,255,255,.55);border-radius:2px"></i>`;
  ctx.tl.fromTo(ctx.sel('dv'), { scaleY: 0 }, { scaleY: 1, duration: 0.4, ease: 'expo.out' }, tLock + 0.42);
  html += fx.headline(ctx, { id: 'url', text: ctx.data.url, x: rowX + LG.w + 34 + 3 + 34, y: rowY, w: urlW + 40, maxLines: 1, size: urlSize, font: 'Roboto Slab', wght: 900, color: C.yellow, tracking: -0.01, t: tLock + 0.38, reveal: 'chars', stagger: 0.025, d: 0.5 }).html;
  html += `<div class="fx-abs" id="${ctx.id('lw')}" style="left:${px(lgX)};top:${px(lgY)};width:${LG.w}px;height:${LG.h}px">${LG.html}</div>`;

  // ---------- transitions: iris in from our green (lens motif), slice out on the downbeat ----------
  fx.tIn(ctx, 'iris', { d: 0.5 });
  fx.tOut(ctx, 'slice', { d: 0.42 });
  return { html, css: css.join('\n') };
}

// ======================================================================================================
// REEL HOOK (1 bar): three colourways slam in on the beats under „Od 0,4 g. Bez protihrotu."
// ======================================================================================================
export function hook(ctx) {
  stage(ctx);
  const L = ctx.safe.left, R = ctx.W - ctx.safe.right;
  let html = fx.field(ctx, { id: 'bg', bg: `radial-gradient(80% 50% at 55% 62%, #0b7f40 0%, ${C.forest} 30%, ${C.deep} 66%, ${C.night} 100%)` });
  html += fx.glow(ctx, { id: 'g', x: 640, y: 1110, size: 1200, color: 'rgba(211,252,2,.42)', opacity: 0.6 });
  const H = fx.headline(ctx, { id: 'h', text: 'Od 0,4 g.', x: L, y: 400, w: R - L, maxLines: 1, sizes: [210, 196, 184], font: 'Roboto Slab', wght: 900, color: C.yellow, t: 0.0, reveal: 'lines', d: 0.32, tracking: -0.02, lh: 1 });
  const S = fx.headline(ctx, { id: 's', text: 'Bez protihrotu.', x: L, y: 400 + H.h + 8, w: R - L, maxLines: 1, sizes: [118, 110, 104, 96], font: 'Roboto Slab', wght: 900, color: '#fff', t: 0.08, reveal: 'lines', d: 0.34, tracking: -0.015, lh: 1.02 });
  const heads = [PR.fluo, PR.pink, PR.red];
  const pos = [[820, 980], [650, 1170], [480, 1360]];
  heads.forEach((p, i) => {
    const hp = 210, s = Math.min(1.13, hp / p.hpx);
    const P = J.place(ctx, { id: `p${i}`, src: p.src, s, u: p.head[0], v: p.head[1], x: pos[i][0], y: pos[i][1], ground: 'none', sweepOpacity: 0.8 });
    html += P.html;
    const t = (ctx.beats[i] ?? i * ctx.BEAT) - 0.02;
    ctx.tl.fromTo(P.sel, { opacity: 0, scale: 1.45, x: 140 }, { opacity: 1, scale: 1, x: 0, duration: 0.42, ease: 'expo.out' }, Math.max(0, t));
    fx.sweep(ctx, `p${i}`, Math.max(0, t) + 0.12, { d: 0.55 });
  });
  html += H.html + S.html;
  fx.tOut(ctx, 'flash', { color: theme.bg, d: 0.14 });
  return { html, css: J.css(ctx) };
}

// ======================================================================================================
// REEL END CARD (2 bars): lockup logo + jigovky.cz + „Partner MČR v Trout Area 2026" + TA plate (fx.endCard) + colourway row
// ======================================================================================================
export function endCard(ctx) {
  stage(ctx);
  let html = fx.field(ctx, { id: 'bg', bg: `radial-gradient(80% 52% at 50% 40%, #0b7f40 0%, ${C.forest} 28%, ${C.deep} 64%, ${C.night} 100%)` });
  html += fx.mesh(ctx, { id: 'fog', colors: [C.leaf, '#0a5c2c', C.forest], size: 900, blur: 150, opacity: 0.3, drift: 90, seed: 6 });
  fx.tIn(ctx, 'flash', { color: theme.bg, d: 0.22 });
  const E = fx.endCard(ctx, { t: 0.05, logo: 'on_dark', url: ctx.data.url, line: 'Partner MČR v Trout Area 2026', fg: '#fff', accent: C.yellow, font: 'Roboto Slab', textFont: 'PT Sans Narrow', scale: 1.5, cy: 880 });
  html += E.html;
  // colourways lined up under the lockup (heads ~120 px, shanks fade to the left)
  const row = [PR.fluo, PR.pink, PR.red, PR.chrome];
  const y = 1330, x0 = 300, dx = 190;
  row.forEach((p, i) => {
    const hp = 124, s = Math.min(1.13, hp / p.hpx);
    const P = J.place(ctx, { id: `r${i}`, src: p.src, s, u: p.head[0], v: p.head[1], x: x0 + i * dx, y, ground: 'none', sweepOpacity: 0.75 });
    html += P.html;
    const t = 0.55 + i * ctx.BEAT / 2;
    ctx.tl.fromTo(P.sel, { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, t);
    fx.sweep(ctx, `r${i}`, ctx.beats[4 + i] ?? 2 + i * 0.46, { d: 0.6 });
  });
  return { html, css: J.css(ctx) };
}
