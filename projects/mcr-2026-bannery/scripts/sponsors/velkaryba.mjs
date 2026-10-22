// VELKA-RYBA.CZ — sponsor module for the MČR 2026 banner engine (role: sponsor → chip „Věnuje ceny · MČR 2026“).
// World = the film block (mcr-2026-sponzori/scripts/blocks/velkaryba.mjs): the shop's own navy #183C6B / #0F2541 / ink #071426,
// white, red #DA0F00 only as a skewed price-tag slab; Nunito 900 italic uppercase (the site's web font); giant outline „PŘÍVLAČ“;
// lure tiles with a colour glow + brand logo (knolling: every bait on one ~45° axis); white brand cards (the shop's homepage list);
// „u vody“ = SVG fractal-noise water plane in perspective; Shimano hard gear (Vanquish FA CE reel, Cardiff Exlead rod).
// Facts only from research/velkaryba.md (Verification), velkaryba_ad.md (product pages 19. 10.), velkaryba_brands.md:
//   „Vše na přívlač“ (title/H1) · přívlačová speciálka z Olomouce, e-shop i kamenná prodejna, od roku 2011 (O nás) ·
//   partner Shimano Rod Test Center: v prodejně v Olomouci si pruty Shimano půjčíte a vyzkoušíte u vody (O nás) ·
//   homepage „… od značek 3stan, Fox Rage, Keitech, Mepps, Rapala, Salmo, Savage Gear, Shimano a mnoha dalších“ ·
//   Vanquish FA CE C2000S 145 g · 5,1 : 1 · 11 + 1 ložisek · Cardiff Exlead Competition 1,83 m · 0,4–4,5 g ·
//   Velka-ryba.cz věnuje ceny pro závodníky MČR 2026 (texty/FB_IG_texty.md, event roles).
// Guardrails: retailer — Shimano / Illex / Daiwa / … are brands it SELLS („v nabídce“), never „naše“; no „nejdéle provozovaná“,
// no „30 let“, no prices, no counts, no Exlead manufacturer superlative, no gramáž on the camo Cardiff, no Jigovky.

export const brand = {
  name: 'Velka-ryba.cz',
  url: 'velka-ryba.cz',
  role: 'sponsor',
};

const C = { deep: '#0F2541', navy: '#183C6B', ink: '#071426', red: '#DA0F00', orange: '#FC9C24', ice: '#9cc4f0', white: '#ffffff' };
export const theme = {
  bg: C.deep,
  taTone: 'dark',
  chrome: {
    url: C.white, urlFont: "'Nunito'", urlW: 900, sub: C.ice, dot: C.red,
    chipBg: 'rgba(7,20,38,.72)', chipLine: 'rgba(218,15,0,.6)', chipFg: '#ffffff', event: 'rgba(235,242,252,.9)',
  },
};
export const fonts = {};   // Nunito (normal + italic) is in the engine registry

// 10 s seamless loop (poster at rest first and last)
export const anim = {
  seq: [
    { scene: 'poster', d: 2.2 },
    { scene: 'range', d: 2.1 },
    { scene: 'hero', d: 2.0 },
    { scene: 'mcr', d: 1.9 },
    { scene: 'poster', d: 1.8 },
  ],
};

// ---------- assets (film project, read-only) ----------
const AD = 'film:assets_prep/velkaryba/ads/';
const BR = 'film:assets_prep/velkaryba/brands/';
const LOGO = `${AD}logo_reverse_on_navy.png`, LOGO_TRIM = [36, 36, 1800, 823];
const VQ = `${AD}H1_shimano_vanquish_fa_ce_c2000s.png`, VQ_SH = `${AD}H1_shimano_vanquish_fa_ce_c2000s_shadow.png`;
const ROD = `${AD}S7_shimano_cardiff_exlead_competition_rod.png`, ROD_DEG = 40.8;   // butt (12,927) → tip (1002,73) in the PNG
// wr = rotation on the knolling axis (film block: PCA of the alpha; embossed Cardiffs stay readable, text-less spoons turn 180°)
const L = {
  cardiffO: { src: `${AD}H2_shimano_cardiff_roll_swimmer_ce_orange_front.png`, brand: 'shimano', glow: '#fc9c24', wr: -36 },
  illexP: { src: `${AD}H3_illex_native_spoon_pink_yamame.png`, brand: 'illex', glow: '#e2559a', wr: 181 },
  lj: { src: `${AD}S8_lucky_john_eos_003.png`, brand: 'luckyjohn', glow: '#4fb4f0', wr: 178 },
  daiwaG: { src: `${AD}S3b_daiwa_presso_adm_flashing_green_single.png`, brand: 'daiwa', glow: '#22c65e', wr: 178 },
  westin: { src: `${AD}S9_westin_fidusen_slim_pink_yellow_clown.png`, brand: 'westin', glow: '#f0407a', wr: -45 },
  cardiffL: { src: `${AD}S4_shimano_cardiff_roll_swimmer_ce_lime_front.png`, brand: 'shimano', glow: '#d8d22a', wr: -36 },
  vanpla: { src: `${AD}S10_vanpla_pink_black.png`, brand: null, label: 'Vanpla', glow: '#d8285a', wr: 192 },
  sukoshi: { src: `${AD}S11_berkley_sukoshi_splat_pel.png`, brand: 'berkley', glow: '#c99a5b', wr: -45 },
  illexC: { src: `${AD}S1_illex_native_spoon_copper_trout.png`, brand: 'illex', glow: '#e08a2a', wr: 180 },
  daiwaB: { src: `${AD}S2b_daiwa_presso_adm_manhattan_single.png`, brand: 'daiwa', glow: '#2a8fd0', wr: 177 },
  camo: { src: `${AD}S5_shimano_cardiff_roll_swimmer_camo_military_pink_front.png`, brand: 'shimano', glow: '#e04a9a', wr: -36 },
  flail: { src: `${AD}S6_berkley_powerbait_power_flail_trout_pellet.png`, brand: 'berkley', glow: '#b08a66', wr: -44 },
};
const WALL12 = ['illexP', 'cardiffO', 'lj', 'daiwaB', 'westin', 'illexC', 'vanpla', 'cardiffL', 'daiwaG', 'sukoshi', 'camo', 'flail'];
const WALL8 = ['illexP', 'cardiffO', 'lj', 'daiwaB', 'westin', 'illexC', 'vanpla', 'cardiffL'];
// the shop's own homepage sentence: „… od značek 3stan, Fox Rage, Keitech, Mepps, Rapala, Salmo, Savage Gear, Shimano a mnoha dalších“
const HOME = ['shimano', 'rapala', 'savagegear', 'foxrage', 'keitech', 'salmo', 'mepps', '3stan'];

export function css() {
  return `
.vr-bg{background:radial-gradient(90% 62% at 62% 60%,#21528f 0%,${C.deep} 56%,${C.ink} 100%)}
.vr-bg2{background:linear-gradient(170deg,#1b4479 0%,${C.deep} 55%,${C.ink} 100%)}
.vr-glow{position:absolute;border-radius:50%;pointer-events:none}
.vr-h{font-family:Nunito;font-weight:900;font-style:italic;text-transform:uppercase;letter-spacing:-.01em;line-height:1.07;color:${C.white};padding:0 .1em 0 .04em;isolation:isolate}
.vr-sl{position:relative;display:inline-block;padding:0 .34em 0 .24em;z-index:0}
.vr-sl::before{content:"";position:absolute;left:.02em;right:.2em;top:.12em;bottom:.04em;background:${C.red};transform:skewX(-14deg);transform-origin:0 100%;z-index:-1}
.vr-k{font-family:Nunito;font-weight:800;text-transform:uppercase;letter-spacing:.16em;color:${C.ice}}
.vr-p{font-family:Nunito;font-weight:700;color:${C.white};line-height:1.2;white-space:normal}
.vr-cap{font-family:Nunito;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.88);text-shadow:0 1px 2px rgba(4,12,26,.9),0 0 14px rgba(4,12,26,.85)}
.vr-out{position:absolute;white-space:nowrap;font-family:Nunito;font-weight:900;font-style:italic;text-transform:uppercase;line-height:1;color:transparent;-webkit-text-stroke:3px rgba(255,255,255,.13);pointer-events:none}
.vr-tile{position:absolute;border-radius:24px;background:linear-gradient(160deg,rgba(255,255,255,.13),rgba(255,255,255,.035) 60%);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.16),inset 0 -26px 40px rgba(4,12,26,.35),0 18px 40px rgba(0,0,0,.25);overflow:hidden}
.vr-tglow{position:absolute;inset:0;border-radius:24px}
.vr-lure{filter:drop-shadow(0 12px 12px rgba(0,0,0,.5))}
.vr-bcard{position:absolute;border-radius:14px;background:#fff;box-shadow:0 12px 26px rgba(3,10,24,.42),inset 0 0 0 1px rgba(15,37,65,.08)}
.vr-bmore{position:absolute;border-radius:14px;box-shadow:inset 0 0 0 2.5px rgba(255,255,255,.85);display:flex;align-items:center;justify-content:center;text-align:center;font-family:Nunito;font-weight:900;font-style:italic;text-transform:uppercase;color:#fff;line-height:1.02;white-space:nowrap}
.vr-chip{display:flex;flex-direction:column;justify-content:center;padding:0 1em 0 1.15em;border-radius:16px;background:rgba(7,20,38,.74);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.18),0 14px 30px rgba(0,0,0,.3);font-family:Nunito;white-space:nowrap;overflow:hidden}
.vr-chip::before{content:"";position:absolute;left:0;top:0;bottom:0;width:.32em;background:${C.red}}
.vr-chip span{font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:${C.ice};font-size:.55em;line-height:1.45}
.vr-chip b{font-weight:900;font-style:italic;text-transform:uppercase;color:#fff;line-height:1.1}
.vr-band{position:absolute;pointer-events:none;background:linear-gradient(180deg,transparent 0%,rgba(127,176,230,.10) 30%,rgba(190,220,255,.36) 50%,rgba(127,176,230,.10) 70%,transparent 100%)}
.vr-rod{filter:drop-shadow(0 0 1.5px rgba(225,238,255,.95)) drop-shadow(0 0 12px rgba(140,190,245,.55))}
.vr-bar{position:absolute;height:6px;border-radius:3px;background:${C.red}}
`;
}

// ---------- helpers ----------
const R1 = (n) => Math.round(n * 10) / 10;
const T = (E, { cls, x, y, w, size, text, html, align = 'left', fit = 0, lines = 0, main = false, inAttr = '', style = '', id = '' }) =>
  `<div ${id ? `id="${id}" ` : ''}class="t ${cls}${main ? ' main' : ''}" ${inAttr} ${fit ? `data-fit="${fit}"` : ''} ${lines ? `data-lines="${lines}"` : ''} style="left:${R1(x)}px;top:${R1(y)}px;width:${R1(w)}px;font-size:${size}px;text-align:${align};${lines ? 'white-space:normal;' : 'overflow:hidden;'}${style}">${html ?? E.t(text)}</div>`;
const slab = (E, s) => `<span class="vr-sl">${E.t(s)}</span>`;
// one display line (Nunito 900 italic caps), the italic/slab overhang is inside the padding → x shifted by the left padding
const H = (E, { x, y, w, size, text, html, slabbed = false, fit = 0, inAttr = '', align = 'left', main = true, style = '' }) =>
  T(E, { cls: 'vr-h', x, y, w, size, html: html ?? (slabbed ? slab(E, text) : E.t(text)), fit: fit || Math.round(size * 0.6), inAttr, align, main, style: `line-height:1.07;${style}` });
const glow = (x, y, r, color, op = 1) => `<i class="vr-glow" style="left:${R1(x - r)}px;top:${R1(y - r)}px;width:${R1(2 * r)}px;height:${R1(2 * r)}px;background:radial-gradient(closest-side,${color},transparent);opacity:${op}"></i>`;
const outline = (E, text, { x, y, size, pan = '-140,0', op = 1 }) => `<div class="vr-out" data-pan="${pan}" style="left:${R1(x)}px;top:${R1(y)}px;font-size:${size}px;opacity:${op}">${E.t(text)}</div>`;
// fit a cut-out shown rotated by deg into a box (its rotated bbox must fit), never above native size
function fitRot(E, src, bw, bh, deg = 0) {
  const [nw, nh] = E.dims(src), ar = nw / nh, c = Math.abs(Math.cos(deg * Math.PI / 180)), s = Math.abs(Math.sin(deg * Math.PI / 180));
  const w = Math.min(bw / (c + s / ar), bh / (s + c / ar), nw);
  return { w, h: w / ar };
}
function lureImg(E, key, { cx, cy, bw, bh, extra = 0, attrs = '', cls = 'vr-lure' }) {
  const lu = L[key], deg = lu.wr + extra, f = fitRot(E, lu.src, bw, bh, deg);
  return E.img(lu.src, { cx, cy, w: f.w, cls, style: `transform:rotate(${deg}deg)`, attrs }).html;
}
// equal visual weight for brand logos = equal area
function eqFit(E, src, A, maxW, maxH) { const [nw, nh] = E.dims(src), ar = nw / nh; const w = Math.min(maxW, Math.sqrt(A * ar), maxH * ar, nw); return { w, h: w / ar }; }
const logoW = (E) => E.logoFit(LOGO_TRIM[2] / LOGO_TRIM[3]);
const vrLogo = (E, o) => E.logo(LOGO, { trim: LOGO_TRIM, ...o });

// „u vody“: fractal-noise water plane in perspective (film block bar 2½–4), horizon at hz; the noise flows toward the camera
function water(E, id, hz, { op = 1 } = {}) {
  const Ww = 1950, Wh = 1100, k = 2, bottom = E.H + 90;
  return `<div class="full" style="overflow:hidden;opacity:${op}"><div class="full" style="perspective:900px;perspective-origin:50% ${R1(hz)}px">`
    + `<svg style="position:absolute;left:${R1(E.W / 2 - (Ww * k) / 2)}px;top:${R1(bottom - Wh * k)}px;width:${Ww * k}px;height:${Wh * k}px;transform:rotateX(62deg);transform-origin:50% 100%" viewBox="0 0 ${Ww} ${Wh}" preserveAspectRatio="none">`
    + `<filter id="${id}" filterUnits="userSpaceOnUse" x="-100" y="-400" width="${Ww + 200}" height="${Wh + 800}" color-interpolation-filters="sRGB">`
    + `<feTurbulence type="fractalNoise" baseFrequency="0.0045 0.03" numOctaves="3" seed="11" result="n"/>`
    + `<feColorMatrix in="n" type="matrix" values="1.6 0 0 0 -0.3  1.6 0 0 0 -0.3  1.6 0 0 0 -0.3  0 0 0 0 1" result="g"/>`
    + `<feComponentTransfer in="g"><feFuncR type="table" tableValues="0.03 0.05 0.07 0.09 0.13 0.22 0.45 0.80"/><feFuncG type="table" tableValues="0.08 0.12 0.16 0.21 0.28 0.40 0.64 0.90"/><feFuncB type="table" tableValues="0.16 0.23 0.30 0.38 0.47 0.60 0.82 0.98"/></feComponentTransfer>`
    + `</filter><g data-pan="0,110"><rect x="-100" y="-400" width="${Ww + 200}" height="${Wh + 800}" filter="url(#${id})"/></g></svg></div>`
    + `<div class="full" style="background:linear-gradient(180deg,${C.deep} 0px,${C.deep} ${R1(hz - 30)}px,rgba(15,37,65,.55) ${R1(hz + 20)}px,rgba(15,37,65,0) ${R1(hz + 120)}px,rgba(7,20,38,0) ${R1(hz + (E.H - hz) * 0.55)}px,rgba(7,20,38,.75) 100%)"></div>`
    + glow(E.W / 2, hz + 20, E.W * 0.6, 'rgba(170,205,245,.45)', 0.55)
    + `</div>`;
}
// Vanquish standing on a soft floor: product + its own contact shadow (manifest: shadow width 1.4 × product, centred at the bottom)
function reel(E, { cx, bottom, h, attrs = 'data-in="rise" data-d=".04"' }) {
  const [nw, nh] = E.dims(VQ), hh = Math.min(h, nh), ww = hh * nw / nh;
  const [sw, sh] = E.dims(VQ_SH), shw = ww * 1.4, shh = shw * sh / sw;
  const sh_ = `<img src="${E.src(VQ_SH)}" alt="" style="position:absolute;left:${R1(cx - shw / 2)}px;top:${R1(bottom - ww * 0.008 - shh / 2)}px;width:${R1(shw)}px;height:${R1(shh)}px;opacity:.8">`;
  const im = E.img(VQ, { cx, y: bottom - hh, h: hh, attrs });
  return { html: glow(cx, bottom - hh * 0.45, hh * 0.62, 'rgba(127,176,230,.55)', 0.5) + sh_ + im.html, x: im.x, y: im.y, w: im.w, h: im.h };
}
// a chip: small label + value (film fx.chip, dark glass + red accent bar)
const chip = (E, { x, y, w, h, label, value, vs, right = false, lower = false, inAttr = '' }) =>
  `<div class="t vr-chip" data-fit="24" ${inAttr} style="${right ? `left:${R1(x - w)}px` : `left:${R1(x)}px`};top:${R1(y)}px;width:${R1(w)}px;height:${R1(h)}px;font-size:${vs}px">${label ? `<span>${E.t(label)}</span>` : ''}<b${lower ? ' style="text-transform:none"' : ''}>${E.t(value)}</b></div>`;

// lure tiles (knolling grid): tile glow in the lure's colour + the brand logo under the bait
function tiles(E, keys, { x, y, w, h, cols, gap = 12, d0 = 0.1 }) {
  const rows = Math.ceil(keys.length / cols), tw = (w - gap * (cols - 1)) / cols, th = (h - gap * (rows - 1)) / rows;
  const lab = Math.max(30, Math.min(44, th * 0.17));
  let html = '';
  keys.forEach((key, i) => {
    const lu = L[key], c = i % cols, r = Math.floor(i / cols), tx = x + c * (tw + gap), ty = y + r * (th + gap);
    const inner = lureImg(E, key, { cx: tw / 2, cy: (th - lab - 8) / 2 + 6, bw: tw - 22, bh: th - lab - 26 });
    let tag;
    if (lu.brand) {
      const src = `${BR}${lu.brand}_on_dark.png`, g = eqFit(E, src, tw * lab * 0.95, tw - 44, lab * 1.12);
      tag = E.img(src, { cx: tw / 2, cy: th - 8 - lab / 2, w: g.w, style: 'filter:drop-shadow(0 1px 2px rgba(4,12,26,.85))' }).html;
    } else tag = `<div class="t vr-cap" style="left:0;width:${R1(tw)}px;top:${R1(th - 8 - lab / 2 - 13)}px;font-size:22px;text-align:center">${E.t(lu.label)}</div>`;
    html += `<div class="vr-tile" data-in="up" data-dist="40" data-d="${(d0 + i * 0.035).toFixed(3)}" style="left:${R1(tx)}px;top:${R1(ty)}px;width:${R1(tw)}px;height:${R1(th)}px">`
      + `<i class="vr-tglow" style="background:linear-gradient(0deg,${E.hex2rgba(lu.glow, 0.45)} 0%,${E.hex2rgba(lu.glow, 0)} 62%)"></i>${inner}${tag}</div>`;
  });
  return html;
}
// white brand cards = the shop's homepage list + „a mnoha dalších“ (spans the remaining slots)
function brandCards(E, { x, y, w, rows = 2, cols = 5, ch = 64, gap = 10, d0 = 0.2 }) {
  const cw = (w - gap * (cols - 1)) / cols;
  let html = '';
  HOME.forEach((slug, i) => {
    const c = i % cols, r = Math.floor(i / cols), cx = x + c * (cw + gap), cy = y + r * (ch + gap);
    const src = `${BR}${slug}.png`, f = eqFit(E, src, cw * ch * 0.42, cw - 30, ch - 12);
    html += `<div class="vr-bcard" data-in="scale" data-d="${(d0 + i * 0.03).toFixed(3)}" style="left:${R1(cx)}px;top:${R1(cy)}px;width:${R1(cw)}px;height:${ch}px">${E.img(src, { cx: cw / 2, cy: ch / 2, w: f.w }).html}</div>`;
  });
  const n = HOME.length, c0 = n % cols, r0 = Math.floor(n / cols), span = rows * cols - n;
  const mx = x + c0 * (cw + gap), my = y + r0 * (ch + gap), mw = span * cw + (span - 1) * gap;
  html += `<div class="vr-bmore t" data-in="scale" data-d="${(d0 + n * 0.03).toFixed(3)}" style="left:${R1(mx)}px;top:${R1(my)}px;width:${R1(mw)}px;height:${ch}px;font-size:${Math.round(ch * 0.4)}px">${E.t('a mnoha dalších')}</div>`;
  return { html, h: rows * ch + (rows - 1) * gap };
}

// ---------- scenes ----------
export const scenes = {
  // POSTER — VŠE NA PŘÍVLAČ: Shimano Vanquish FA CE + the orange Cardiff (Trout Area spoon), Speciálka z Olomouce · od roku 2011
  poster(E) {
    const b = E.body, k = E.kind;
    let bg = '<div class="full vr-bg"></div>', prod = '', txt = '';
    const lw = logoW(E);
    if (k === 'wide') {
      const hs = 88, colW = 600;
      const R = reel(E, { cx: b.r - 170, bottom: b.b + 6, h: b.h + 10 });
      prod += R.html;
      prod += lureImg(E, 'cardiffO', { cx: b.x + 470, cy: b.b - 66, bw: 300, bh: 150, extra: 26, attrs: 'data-in="left" data-d=".2"' });
      txt += H(E, { x: b.x, y: b.y + 8, w: colW, size: hs, text: 'Vše na', inAttr: 'data-in="left" data-d=".05"' });
      txt += H(E, { x: b.x, y: b.y + 8 + hs * 1.08, w: colW, size: hs, text: 'Přívlač', slabbed: true, inAttr: 'data-in="slam" data-d=".1"' });
      const sy = b.y + 8 + hs * 2.2 + 10;
      txt += T(E, { cls: 'vr-p', x: b.x, y: sy, w: colW, size: 36, text: 'Speciálka z Olomouce · od roku 2011', fit: 24, style: 'font-weight:800;white-space:nowrap', inAttr: 'data-in="up" data-d=".25"' });
      txt += vrLogo(E, { x: b.x, y: b.b - lw.h - 2, attrs: 'data-in="fade" data-d=".35"' }).html;
      return { html: bg + prod + txt };
    }
    const S = { square: { hs: 124, sub: 44, tag: 36, reelH: 570, spoon: 400 }, portrait: { hs: 150, sub: 50, tag: 40, reelH: 680, spoon: 460 }, tall: { hs: 158, sub: 52, tag: 42, reelH: 760, spoon: 480 } }[k];
    const y0 = b.y + (k === 'tall' ? 20 : 6), l2 = y0 + S.hs * 1.08, headB = l2 + S.hs * 1.1;
    bg += outline(E, 'Přívlač', { x: -40, y: headB + (b.b - headB) * 0.18, size: k === 'square' ? 300 : 360 });
    // products: reel right, standing on the bottom of the body; orange Cardiff lying lower-left
    const R = reel(E, { cx: b.r - S.reelH * 0.43, bottom: b.b - 4, h: S.reelH });
    prod += R.html;
    const spY = b.b - S.spoon * 0.3;
    prod += lureImg(E, 'cardiffO', { cx: b.x + S.spoon * 0.55, cy: spY, bw: S.spoon * 1.2, bh: S.spoon * 0.62, extra: 26, attrs: 'data-in="left" data-d=".2"' });
    // logo top-right of the body, next to the short first line „VŠE NA“
    txt += vrLogo(E, { x: b.r - lw.w, y: y0 + 4, attrs: 'data-in="fade" data-d=".35"' }).html;
    txt += H(E, { x: b.x, y: y0, w: b.w - lw.w - 30, size: S.hs, text: 'Vše na', inAttr: 'data-in="left" data-d=".05"' });
    txt += H(E, { x: b.x, y: l2, w: b.w, size: S.hs, text: 'Přívlač', slabbed: true, inAttr: 'data-in="slam" data-d=".1"' });
    let y = headB + 14;
    txt += T(E, { cls: 'vr-p', x: b.x, y, w: b.w * 0.62, size: S.sub, lines: 2, text: 'Speciálka z Olomouce', main: true, style: 'font-weight:800', inAttr: 'data-in="up" data-d=".22"' });
    y += S.sub * 1.2 + 16;
    txt += H(E, { x: b.x + 4, y, w: b.w * 0.5, size: S.tag, text: 'od roku 2011', slabbed: true, main: false, inAttr: 'data-in="left" data-d=".3"' });
    return { html: bg + prod + txt };
  },

  // 1 — WHO: přívlačová speciálka z Olomouce, e-shop i kamenná prodejna, od roku 2011 · Illex Native Spoon over the water
  who(E) {
    const b = E.body, sq = E.kind === 'square';
    const hz = b.y + b.h * (sq ? 0.6 : 0.62);
    let html = '<div class="full vr-bg2"></div>' + water(E, 'vr-wtr-who', hz);
    const sp = L.illexP, spH = sq ? 470 : 560;
    html += glow(b.r - spH * 0.42, b.b - spH * 0.55, spH * 0.6, E.hex2rgba(sp.glow, 0.55), 0.55);
    html += E.img(sp.src, { cx: b.r - spH * 0.42, cy: b.b - spH * 0.55, h: spH, cls: 'vr-lure', style: 'transform:rotate(-8deg)', attrs: 'data-in="rise" data-d=".08"' }).html;
    const lw = logoW(E);
    html += vrLogo(E, { x: b.x, y: b.y + 4, attrs: 'data-in="scale"' }).html;
    const hs = sq ? 104 : 118;
    let y = b.y + lw.h + 34;
    html += H(E, { x: b.x, y, w: b.w, size: hs, text: 'Speciálka', inAttr: 'data-in="left" data-d=".08"' });
    y += hs * 1.08;
    html += H(E, { x: b.x, y, w: b.w, size: hs, text: 'z Olomouce', inAttr: 'data-in="left" data-d=".14"' });
    y += hs * 1.1 + 10;
    html += H(E, { x: b.x + 4, y, w: b.w * 0.5, size: sq ? 38 : 42, text: 'od roku 2011', slabbed: true, main: false, inAttr: 'data-in="left" data-d=".22"' });
    y += (sq ? 38 : 42) * 1.07 + 30;
    html += T(E, { cls: 'vr-p', x: b.x, y, w: b.w * (sq ? 0.56 : 0.58), size: sq ? 42 : 46, lines: 3, main: true, text: 'E-shop i kamenná prodejna v Olomouci. Vše na přívlač.', inAttr: 'data-in="up" data-d=".3"', style: 'text-shadow:0 2px 12px rgba(4,12,26,.7)' });
    return { html };
  },

  // 2 — RANGE: lure wall (spoons/baits on one axis, brand logo under each) + the shop's brand list „… a mnoha dalších“
  range(E) {
    const b = E.body, sq = E.kind === 'square';
    let html = '<div class="full vr-bg"></div>' + glow(E.W / 2, b.y + b.h * 0.45, E.W * 0.7, 'rgba(33,82,143,.8)', 0.6);
    const ks = 24, hs = sq ? 76 : 84;
    html += T(E, { cls: 'vr-k', x: b.x, y: b.y + 2, w: b.w, size: ks, text: 'Plandavky na pstruhy · v nabídce', inAttr: 'data-in="left"' });
    html += H(E, { x: b.x, y: b.y + ks * 1.5, w: b.w, size: hs, html: `Vše na ${slab(E, 'přívlač')}`, inAttr: 'data-in="up" data-d=".04"' });
    const gy = b.y + ks * 1.5 + hs * 1.12 + 14;
    const BC = { ch: sq ? 62 : 72 }, capS = 22, bh = 2 * BC.ch + 10, by = b.b - bh;
    const ty1 = by - capS * 1.6 - 14;
    html += tiles(E, sq ? WALL8 : WALL12, { x: b.x, y: gy, w: b.w, h: ty1 - gy, cols: 4, gap: 12 });
    html += T(E, { cls: 'vr-cap', x: b.x, y: by - capS * 1.5, w: b.w, size: capS, text: 'Od značek', style: `color:${C.ice}`, inAttr: 'data-in="left" data-d=".2"' });
    html += brandCards(E, { x: b.x, y: by, w: b.w, ch: BC.ch }).html;
    return { html };
  },

  // 3 — HERO: Shimano. Rod Test Center (rent a Shimano rod in the Olomouc shop, try it at the water) + Vanquish FA CE + Cardiff Exlead
  hero(E) {
    const b = E.body, sq = E.kind === 'square';
    const hs = sq ? 82 : 92, ks = 24;
    let y = b.y + 2, txt = '';
    txt += T(E, { cls: 'vr-k', x: b.x, y, w: b.w, size: ks, text: 'Shimano Rod Test Center', inAttr: 'data-in="left"' });
    y += ks * 1.5;
    txt += H(E, { x: b.x, y, w: b.w, size: hs, text: 'Pruty Shimano', inAttr: 'data-in="up" data-d=".04"' });
    txt += H(E, { x: b.x, y: y + hs * 1.08, w: b.w, size: hs, text: 'vyzkoušíte', inAttr: 'data-in="up" data-d=".1"' });
    txt += H(E, { x: b.x, y: y + hs * 2.16, w: b.w, size: hs, text: 'přímo u vody', slabbed: true, inAttr: 'data-in="slam" data-d=".16"' });
    const headB = y + hs * 3.24;
    // the Exlead rod laid horizontally under the headline (rotated onto the axis), light band behind it
    const rodY = headB + (sq ? 34 : 46), rodLen = E.W - 70;
    const [rn] = E.dims(ROD), scale = Math.min(1, rodLen / 1307), rw = rn * scale;
    const band = `<div class="vr-band" data-in="wipe-r" data-d=".1" style="left:0;width:${E.W}px;top:${R1(rodY - 70)}px;height:140px"></div>`;
    const rod = E.img(ROD, { cx: E.W / 2 - 4, cy: rodY, w: rw, cls: 'vr-rod', style: `transform:rotate(${ROD_DEG}deg)`, attrs: 'data-in="wipe-r" data-d=".12" data-dur=".6"' }).html;
    // reel right, chips left (the rod never cuts text)
    const reelH = Math.min(b.b - rodY - 14, sq ? 400 : 520);
    const R = reel(E, { cx: b.r - reelH * 0.43 + 10, bottom: b.b, h: reelH });
    const cw = Math.min(600, R.x - b.x + 40), chH = sq ? 96 : 118, vs = sq ? 40 : 46, gap = sq ? 14 : 26;
    let cy = rodY + (sq ? 36 : 50);
    txt += chip(E, { x: b.x, y: cy, w: cw, h: chH, label: 'Prodejna Olomouc', value: 'Půjčte si prut', vs, inAttr: 'data-in="left" data-d=".2"' });
    cy += chH + gap;
    txt += chip(E, { x: b.x, y: cy, w: cw, h: chH, label: 'Prut Cardiff Exlead Competition', value: '1,83 m · 0,4–4,5 g', vs, lower: true, inAttr: 'data-in="left" data-d=".26"' });
    cy += chH + gap;
    txt += chip(E, { x: b.x, y: cy, w: cw, h: chH, label: 'Naviják Shimano Vanquish FA CE', value: '145 g · převod 5,1 : 1', vs, lower: true, inAttr: 'data-in="left" data-d=".32"' });
    const hz = rodY + 10;
    return { html: '<div class="full vr-bg2"></div>' + water(E, 'vr-wtr-hero', hz, { op: 0.9 }) + band + rod + R.html + txt };
  },

  // 4 — MČR: Velka-ryba.cz věnuje ceny pro závodníky MČR 2026 · spoon shelf (6 brands) · logo + URL lockup
  mcr(E) {
    const b = E.body, sq = E.kind === 'square';
    let html = '<div class="full vr-bg"></div>';
    const ks = 24, hs = sq ? 112 : 126, ss = sq ? 58 : 64;
    let y = b.y + 2;
    html += T(E, { cls: 'vr-k', x: b.x, y, w: b.w, size: ks, text: 'Mistrovství ČR v Trout Area 2026', inAttr: 'data-in="left"' });
    y += ks * 1.5;
    html += H(E, { x: b.x, y, w: b.w, size: hs, text: 'Věnuje ceny', slabbed: true, inAttr: 'data-in="slam" data-d=".04"' });
    y += hs * 1.1;
    html += H(E, { x: b.x, y, w: b.w, size: ss, text: 'pro závodníky MČR', inAttr: 'data-in="up" data-d=".12"' });
    y += ss * 1.07 + (sq ? 10 : 30);
    // lockup at the bottom: logo, URL in the brand face, red bar
    const lw = logoW(E), us = sq ? 84 : 96;
    const uy = b.b - us * 1.1 - 4, ly = uy - lw.h - 14;
    // shelf of six spoons (six brands) between headline and lockup
    const SH = ['illexP', 'cardiffO', 'lj', 'westin', 'daiwaG', 'vanpla'];
    const sy0 = y, sy1 = ly - 16, rows = 1, per = SH.length / rows, cw = b.w / per, rh = (sy1 - sy0) / rows;
    const bh = Math.min(rh, sq ? 250 : 340);
    html += glow(E.W / 2, (sy0 + sy1) / 2, b.w * 0.5, 'rgba(127,176,230,.5)', 0.35);
    SH.forEach((k, i) => {
      const r = Math.floor(i / per), c = i % per, cx = b.x + cw * (c + 0.5) + (rows > 1 ? (r ? 1 : -1) * cw * 0.12 : 0);
      html += lureImg(E, k, { cx, cy: sy0 + rh * (r + 0.5), bw: cw * (sq ? 1.45 : 1.5), bh, attrs: `data-in="down" data-dist="50" data-d="${(0.12 + i * 0.05).toFixed(2)}"` });
    });
    html += vrLogo(E, { cx: E.W / 2, y: ly, attrs: 'data-in="scale" data-d=".2"' }).html;
    html += H(E, { x: b.x, y: uy, w: b.w, size: us, text: 'velka-ryba.cz', align: 'center', style: 'text-transform:none', inAttr: 'data-in="up" data-d=".26"' });
    return { html };
  },
};
