// TROUTSHOP.EU — banner module (MČR 2026). World = the film block „RISING SUN · SPECIALISTA“
// (mcr-2026-sponzori/scripts/blocks/troutshop.mjs + lib/fx_troutshop.mjs): studio black #050505, the logo's red #E3000F
// rising sun + rays, white Anton caps, Roboto Condensed labels, spoons = the sun's rays (fan), clean ads/* cut-outs.
// Facts only from research/troutshop.md (Verification), troutshop_ad.md, troutshop_brands.md, vo/script_cs.json:
//   „Specialista na pstruhy“ (EN hero „The trout fishing SPECIALIST!“) · „Rodinná firma od roku 1999“ (about-us, #1)
//   „Generální partner Trout Area Slovakia“ (#2) · „partner několika japonských značek“ (#4, wording „několika“)
//   „Doručení Česko – Slovensko do pár dní“ (SK meta) · Piešťany, Slovensko (footer)
//   3 102 spoons / 992 wobblers on the shop 21. 10. → only „3 100+ plandavek“, „990+ woblerů“ + „v nabídce“
//   ROONEY 101 = 1st place of /pc/spoons/?orderby=popularity (19. 10.); ROONEY 1,5 · 1,8 · 2,2 · 2,8 g (menu)
// never_say: no „vítězové v SK, CZ, PL i UA“; Nories / Forest / Velvet Arts … are NOT Troutshop brands → always „v nabídce“.

export const brand = { name: 'Troutshop.eu', url: 'troutshop.eu', role: 'sponsor' };

const C = { bg: '#050505', red: '#e3000f', red2: '#ff2a1e', white: '#ffffff', soft: 'rgba(255,255,255,.86)', ink: '#0a0a0a' };
export const theme = {
  bg: C.bg,
  taTone: 'scrim',    // red rays / red sun live in the frame → TA logo (red AREA) always gets the scrim level
  chrome: { url: C.white, urlFont: "'Anton'", urlW: 400, dot: C.red, chipBg: 'rgba(5,5,5,.78)', chipLine: 'rgba(227,0,15,.75)', chipFg: '#ffffff', event: 'rgba(255,255,255,.92)' },
};
export const anim = {
  seq: [
    { scene: 'poster', d: 2.2 },
    { scene: 'range', d: 2.1 },
    { scene: 'hero', d: 2.0 },
    { scene: 'mcr', d: 1.9 },
    { scene: 'poster', d: 1.8 },
  ],
};
export const fonts = {};   // Anton + Roboto Condensed are in the engine registry

const FILM = 'film:assets_prep/troutshop/';
const AD = `${FILM}ads/`;
const LOGO = { src: `${FILM}logo_on_dark.png`, trim: [39, 39, 1933, 915] };
// spoon geometry of the split cut-outs (copied from lib/fx_troutshop.mjs GEO: c = body centre, tail = line-eye end,
// ang = hook direction deg clockwise from up, L = body length / PNG height)
const GEO = {
  rooney101a: { f: 'hero_01_nories_rooney_2-8g_101_a', c: [0.387, 0.665], tail: [0.073, 0.961], ang: 36.5, L: 0.730 },
  rooney101b: { f: 'hero_01_nories_rooney_2-8g_101_b', c: [0.592, 0.338], tail: [0.918, 0.039], ang: -143.2, L: 0.731 },
  forte32a: { f: 'hero_02_velvetarts_forte_2-1g_32_glow_pink_a', c: [0.363, 0.656], tail: [0.084, 0.929], ang: 43.3, L: 0.742 },
  rooney002a: { f: 'sec_01_nories_rooney_002_a', c: [0.377, 0.647], tail: [0.067, 0.959], ang: 38.0, L: 0.778 },
  rooney002b: { f: 'sec_01_nories_rooney_002_b', c: [0.604, 0.345], tail: [0.924, 0.042], ang: -141.4, L: 0.764 },
  sk20a: { f: 'sec_02_nories_rooney_sk20_magma_a', c: [0.395, 0.659], tail: [0.074, 0.960], ang: 38.1, L: 0.748 },
  miua: { f: 'sec_03_forest_miu_ts4_limited_a', c: [0.385, 0.640], tail: [0.086, 0.929], ang: 40.8, L: 0.751 },
  miub: { f: 'sec_03_forest_miu_ts4_limited_b', c: [0.620, 0.346], tail: [0.908, 0.070], ang: -141.6, L: 0.698 },
  forte35b: { f: 'sec_04_velvetarts_forte_2-1g_35_yellow_red_b', c: [0.627, 0.308], tail: [0.912, 0.069], ang: -136.5, L: 0.645 },
  tulleb: { f: 'sec_05_nories_tulle_3g_101_b', c: [0.579, 0.341], tail: [0.891, 0.048], ang: -147.7, L: 0.676 },
  forte30a: { f: 'sec_07_velvetarts_forte_2-1g_30_glow_gold_a', c: [0.364, 0.654], tail: [0.085, 0.929], ang: 42.2, L: 0.733 },
};
const srcOf = (k) => `${AD}${GEO[k].f}.png`;
const P = {
  rooney: `${AD}hero_01_nories_rooney_2-8g_101.png`, pupa: `${AD}hero_03_nories_crankin_pupa_109.png`,
  forte32: `${AD}hero_02_velvetarts_forte_2-1g_32_glow_pink.png`, sk20: `${AD}sec_02_nories_rooney_sk20_magma.png`,
  miu: `${AD}sec_03_forest_miu_ts4_limited.png`, r002: `${AD}sec_01_nories_rooney_002.png`,
};
// fan = the sun's rays (film FAN order, colour-sorted, gold ROONEY 101 in the centre): 9 spoons, 4 brands of the shop's range
const FAN = ['miua', 'rooney002b', 'forte35b', 'tulleb', 'rooney101a', 'sk20a', 'forte30a', 'rooney002a', 'forte32a'];
// brand wall (third-party brands sold by the shop; mono / on_dark variants; [file, alpha bbox])
const BD = `${FILM}brands/`;
const BRANDS = [
  ['nories_on_dark', [6, 6, 1455, 520]], ['forest_mono', [0, 0, 270, 113]], ['rodiocraft_on_dark', [0, 0, 1200, 260]], ['valkein_on_dark', [6, 6, 1758, 526]],
  ['VANFOOK', null], ['varivas_on_dark', [4, 6, 2392, 512]], ['fishup_on_dark', [0, 6, 363, 166]], ['velvetarts_on_dark', [1, 6, 1192, 521]],
];

export function css() {
  return `
.ts-bg{background:radial-gradient(120% 70% at 50% 100%,#3a0408 0%,#160204 38%,${C.bg} 70%)}
.ts-rays{position:absolute;border-radius:50%;background:repeating-conic-gradient(from -4deg,rgba(227,0,15,.55) 0deg 8deg,rgba(227,0,15,0) 8deg 20deg);-webkit-mask-image:radial-gradient(closest-side,#000 12%,rgba(0,0,0,.55) 48%,rgba(0,0,0,0) 100%);mask-image:radial-gradient(closest-side,#000 12%,rgba(0,0,0,.55) 48%,rgba(0,0,0,0) 100%)}
.ts-sun{position:absolute;border-radius:50%;background:radial-gradient(circle,#ff2a1e 0%,#f2070f 46%,#e3000f 78%,#ec1510 96%,#e3000f 100%);box-shadow:0 0 46px 6px rgba(255,46,30,.55),0 0 210px 70px rgba(227,0,15,.32)}
.ts-floor{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(180deg,#120102 0%,#070707 45%,#050505 100%)}
.ts-floor::before{content:"";position:absolute;left:0;right:0;top:0;height:3px;background:linear-gradient(90deg,rgba(227,0,15,0),rgba(255,42,30,.95) 50%,rgba(227,0,15,0))}
.ts-floor::after{content:"";position:absolute;left:10%;right:10%;top:0;height:70%;background:radial-gradient(50% 60% at 50% 0%,rgba(227,0,15,.38),rgba(227,0,15,0))}
.ts-big{position:absolute;font-family:Anton;text-transform:uppercase;color:transparent;-webkit-text-stroke:2px rgba(255,255,255,.08);white-space:nowrap;line-height:1}
.ts-k{font-family:'Roboto Condensed';font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:${C.red}}
.ts-h{font-family:Anton;font-weight:400;text-transform:uppercase;letter-spacing:.005em;color:${C.white};line-height:1.16;padding-top:.04em}
.ts-h.ml{line-height:1.02;padding-top:.06em}
.ts-wm{position:absolute;display:flex;align-items:center;justify-content:center;font-family:Montserrat;font-weight:800;letter-spacing:.06em;color:#fff;white-space:nowrap}
.ts-h em{font-style:normal;color:${C.red}}
.ts-p{font-family:'Roboto Condensed';font-weight:600;color:${C.soft};line-height:1.2;white-space:normal}
.ts-li{font-family:'Roboto Condensed';font-weight:700;color:${C.white};letter-spacing:.02em;display:flex;align-items:center;gap:.5em}
.ts-li i{display:block;flex:none;width:1.4em;height:.16em;background:${C.red};border-radius:2px}
.ts-arm{position:absolute;width:0;height:0;transform-origin:0 0}
.ts-sp{position:absolute}
.ts-sp img{position:absolute;inset:0;width:100%;height:100%;display:block}
.ts-tile{position:absolute;border-radius:18px;background:linear-gradient(180deg,#141414,#0a0a0a);border:1.5px solid #262626;overflow:hidden}
.ts-tile::before{content:"";position:absolute;left:0;right:0;top:0;height:5px;background:${C.red}}
.ts-cell{position:absolute;border-radius:12px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08)}
.ts-chipx{position:absolute;display:flex;align-items:center;gap:.5em;padding:0 .9em;border-radius:999px;background:rgba(10,10,10,.85);border:1.5px solid rgba(227,0,15,.7);font-family:'Roboto Condensed';font-weight:700;color:${C.white};white-space:nowrap;letter-spacing:.03em}
.ts-chipx b{color:${C.red};font-weight:800}
.ts-sw{position:absolute;overflow:hidden;-webkit-mask-size:100% 100%;mask-size:100% 100%;mix-blend-mode:screen;pointer-events:none}
.ts-sw i{position:absolute;top:0;bottom:0;left:-130%;width:70%;background:linear-gradient(100deg,rgba(255,255,255,0) 38%,rgba(255,240,210,.38) 50%,rgba(255,255,255,0) 62%)}
.ts-redfield{background:radial-gradient(130% 90% at 50% 105%,#ff2a1e 0%,#f2070f 40%,#e3000f 70%,#b8000c 100%)}
`;
}

// ---------- helpers ----------
const R1 = (n) => Math.round(n * 10) / 10;
const T = (E, { cls, x, y, w, size, text, html, align = 'left', fit = 0, lines = 0, main = false, inAttr = '', style = '', id = '' }) =>
  `<div ${id ? `id="${id}" ` : ''}class="t ${cls}${main ? ' main' : ''}" ${inAttr} ${fit ? `data-fit="${fit}"` : ''} ${lines ? `data-lines="${lines}"` : ''} style="left:${R1(x)}px;top:${R1(y)}px;width:${R1(w)}px;font-size:${size}px;text-align:${align};${lines ? 'white-space:normal;' : 'overflow:hidden;'}${style}">${html ?? E.t(text)}</div>`;

// world: black studio + red glow, rotating rays and the sun at (x, y); floor below the horizon y (optional)
function world(E, { x, y, r, rays = 1.0, raysR = null, horizon = true, big = null }) {
  const RR = raysR ?? Math.max(E.W, E.H) * 1.15;
  let h = '<div class="full ts-bg"></div>';
  if (big) h += `<div class="ts-big" style="left:${R1(big.x)}px;top:${R1(big.y)}px;font-size:${big.size}px">${E.t('Troutshop')}</div>`;
  h += `<div class="ts-rays" data-spin="20" style="left:${R1(x - RR)}px;top:${R1(y - RR)}px;width:${R1(2 * RR)}px;height:${R1(2 * RR)}px;opacity:${rays}"></div>`;
  h += `<div class="ts-sun" style="left:${R1(x - r)}px;top:${R1(y - r)}px;width:${R1(2 * r)}px;height:${R1(2 * r)}px"></div>`;
  if (horizon) h += `<div class="ts-floor" style="top:${R1(y)}px"></div>`;
  return h;
}
// spoon by its body: centre (cx, cy), body length px, hook direction `angle` (deg clockwise from up); never upscaled
function spoon(E, { k, cx, cy, body, angle, shadow = '0 22px 24px rgba(0,0,0,.55)', attrs = '' }) {
  const G = GEO[k], src = srcOf(k), [nw, nh] = E.dims(src);
  const s = Math.min(1, body / (G.L * nh)), w = nw * s, h = nh * s;
  const org = `${R1(G.c[0] * 100)}% ${R1(G.c[1] * 100)}%`;
  return `<div class="ts-sp" ${attrs} style="left:${R1(cx - G.c[0] * w)}px;top:${R1(cy - G.c[1] * h)}px;width:${R1(w)}px;height:${R1(h)}px;transform-origin:${org};transform:rotate(${R1(angle - G.ang)}deg)"><img src="${E.src(src)}" alt="" data-noscale style="filter:drop-shadow(${shadow})"></div>`;
}
// fan of spoons hinged at (x, y): every line eye sits r0 from the pivot, hook outward; arms open from the pivot (data-in scale)
function fan(E, { x, y, keys = FAN, body, r0, spread = 60, d0 = 0.05 }) {
  const n = keys.length, mid = (n - 1) / 2;
  return keys.map((k, i) => {
    const th = n > 1 ? -spread + (2 * spread * i) / (n - 1) : 0;
    const G = GEO[k], src = srcOf(k), [nw, nh] = E.dims(src);
    const s = Math.min(1, body / (G.L * nh)), w = nw * s, h = nh * s;
    const org = `${R1(G.tail[0] * 100)}% ${R1(G.tail[1] * 100)}%`;
    return `<div class="ts-arm" data-in="scale" data-d="${(d0 + Math.abs(i - mid) * 0.04).toFixed(2)}" style="left:${R1(x)}px;top:${R1(y)}px;transform:rotate(${R1(th)}deg)"><div class="ts-sp" style="left:${R1(-G.tail[0] * w)}px;top:${R1(-r0 - G.tail[1] * h)}px;width:${R1(w)}px;height:${R1(h)}px;transform-origin:${org};transform:rotate(${R1(-G.ang)}deg)"><img src="${E.src(src)}" alt="" data-noscale style="filter:drop-shadow(0 16px 14px rgba(0,0,0,.6))"></div></div>`;
  }).join('');
}
// product image with a masked light sweep (alpha of the product)
function prod(E, src, { cx, cy, w, h, id = 'pr', inAttr = 'data-in="rise"', sweep = true, shadow = '0 26px 30px rgba(0,0,0,.55)', rot = 0 }) {
  const im = E.img(src, { cx, cy, w, h });
  const url = E.src(src);
  return { ...im, html: `<div class="abs" id="${id}" ${inAttr} style="left:${R1(im.x)}px;top:${R1(im.y)}px;width:${R1(im.w)}px;height:${R1(im.h)}px${rot ? `;transform:rotate(${rot}deg)` : ''}"><img src="${url}" alt="" style="position:absolute;inset:0;width:100%;height:100%;filter:drop-shadow(${shadow})">${sweep ? `<div class="ts-sw" style="inset:0;-webkit-mask-image:url(${url});mask-image:url(${url})"><i data-sweep="0.3,1.3"></i></div>` : ''}</div>` };
}
const tsLogo = (E, o) => E.logo(LOGO.src, { trim: LOGO.trim, id: 'ts-logo', ...o });
// logo centred in the upper half of the sun disc
function sunLogo(E, { x, y, r, attrs = 'data-in="scale" data-d=".2"' }) {
  const fit = E.logoFit(LOGO.trim[2] / LOGO.trim[3], { maxW: r * 1.45 });
  return tsLogo(E, { cx: x, y: y - r * 0.47 - fit.h / 2, maxW: r * 1.45, attrs }).html;
}

// ---------- scenes ----------
export const scenes = {
  // POSTER (4 statics + loop start/end): the rising sun with the fan of 9 spoons as its rays, logo on the sun
  poster(E) {
    const b = E.body, k = E.kind;
    let txt = '';
    if (k === 'wide') {
      const colW = 540, hy = b.b + 4, sx = b.r - 250, R = 165;
      const bg = world(E, { x: sx, y: hy, r: R, raysR: 900 });
      const f = fan(E, { x: sx, y: hy, body: 130, r0: R + 16, spread: 62 });
      txt += T(E, { cls: 'ts-k', x: b.x, y: b.y + 12, w: colW, size: 22, text: 'Rodinná firma od roku 1999', inAttr: 'data-in="left" data-d=".08"' });
      txt += T(E, { cls: 'ts-h ml', x: b.x - 2, y: b.y + 46, w: colW, size: 104, lines: 2, html: E.t('Specialista') + '<br><em>na pstruhy</em>', inAttr: 'data-in="slam" data-d=".12"', main: true });
      txt += T(E, { cls: 'ts-p', x: b.x, y: b.y + 46 + 104 * 1.08 * 2 + 10, w: colW, size: 28, lines: 2, text: 'Trout Area e-shop · 3 100+ plandavek a 990+ woblerů v nabídce', inAttr: 'data-in="up" data-d=".3"' });
      return { html: bg + f + sunLogo(E, { x: sx, y: hy, r: R }) + txt };
    }
    const S = { square: { kick: 28, head: 96, sub: 30, R: 205, body: 190, sp: 66 }, portrait: { kick: 30, head: 150, sub: 34, R: 230, body: 225, sp: 66 }, tall: { kick: 32, head: 150, sub: 36, R: 270, body: 215, sp: 62 } }[k];
    const hy = b.b - 2, cx = E.W / 2;
    let y = b.y + (k === 'tall' ? 20 : 6);
    txt += T(E, { cls: 'ts-k', x: b.x, y, w: b.w, size: S.kick, text: 'Rodinná firma od roku 1999', inAttr: 'data-in="left" data-d=".08"' });
    y += S.kick * 1.5;
    if (k === 'square') {
      txt += T(E, { cls: 'ts-h', x: b.x - 2, y, w: b.w, size: S.head, fit: 60, html: E.t('Specialista na ') + '<em>pstruhy</em>', inAttr: 'data-in="slam" data-d=".12"', main: true });
      y += S.head * 1.2 + 4;
    } else {
      txt += T(E, { cls: 'ts-h ml', x: b.x - 3, y, w: b.w, size: S.head, lines: 2, html: E.t('Specialista') + '<br><em>na pstruhy</em>', inAttr: 'data-in="slam" data-d=".12"', main: true });
      y += S.head * 1.08 * 2 + 10;
    }
    txt += T(E, { cls: 'ts-p', x: b.x, y, w: b.w, size: S.sub, text: '3 100+ plandavek · 990+ woblerů v nabídce', style: 'white-space:nowrap', fit: 22, inAttr: 'data-in="up" data-d=".3"' });
    const bg = world(E, { x: cx, y: hy, r: S.R, big: { x: -30, y: b.y + (k === 'square' ? 150 : 330), size: k === 'square' ? 300 : 380 } });
    const f = fan(E, { x: cx, y: hy, body: S.body, r0: S.R + 18, spread: S.sp });
    return { html: bg + f + sunLogo(E, { x: cx, y: hy, r: S.R }) + txt };
  },

  // 1 — WHO: family company since 1999, trout specialist, partner facts
  who(E) {
    const b = E.body, sq = E.kind === 'square';
    const R = sq ? 230 : 270, sx = b.r - (sq ? 175 : 190), sy = b.y + b.h * 0.6;
    let html = world(E, { x: sx, y: sy, r: R, rays: 0.95, horizon: false, big: { x: -40, y: b.y + 260, size: sq ? 320 : 400 } });
    // two spoon pairs of the range crossing in front of the sun (right of the text column)
    const ph = sq ? 470 : 560;
    html += prod(E, P.miu, { cx: sx - (sq ? 90 : 100), cy: sy - 10, h: ph, id: 'w1', inAttr: 'data-in="rise" data-d=".05"', rot: -14, sweep: false }).html;
    html += prod(E, P.forte32, { cx: sx + (sq ? 60 : 70), cy: sy + 10, h: ph, id: 'w2', inAttr: 'data-in="rise" data-d=".12"', rot: 14 }).html;
    html += `<div class="full" style="background:linear-gradient(90deg,rgba(5,5,5,.92) 0%,rgba(5,5,5,.8) 38%,rgba(5,5,5,0) 62%)"></div>`;
    const L = tsLogo(E, { x: b.x, y: b.y + 8, attrs: 'data-in="scale"' });
    html += L.html;
    let y = b.y + 8 + L.h + (sq ? 26 : 44);
    const hs = sq ? 104 : 118;
    html += T(E, { cls: 'ts-h ml', x: b.x - 2, y, w: b.w * 0.66, size: hs, lines: 2, html: E.t('Rodinná firma') + '<br>' + E.t('od roku ') + '<em>1999</em>', inAttr: 'data-in="left" data-d=".1"', main: true });
    y += hs * 1.02 * 2 + (sq ? 18 : 30);
    const ps = sq ? 40 : 44;
    html += T(E, { cls: 'ts-p', x: b.x, y, w: b.w * 0.6, size: ps, lines: 2, text: 'Slovenský e-shop pro Trout Area a přívlač na pstruhy.', inAttr: 'data-in="up" data-d=".2"', main: true });
    y += ps * 1.2 * 2 + (sq ? 26 : 40);
    const li = sq ? 31 : 35;
    ['Generální partner Trout Area Slovakia', 'Partner několika japonských značek', 'Do Česka za pár dní'].forEach((s, i) => {
      html += T(E, { cls: 'ts-li', x: b.x, y: y + i * li * 1.55, w: b.w * 0.66, size: li, html: `<i></i>${E.t(s)}`, style: 'display:flex', inAttr: `data-in="left" data-d="${(0.28 + i * 0.07).toFixed(2)}"` });
    });
    return { html };
  },

  // 2 — RANGE: counters (spoons / wobblers, „v nabídce“) + wall of brands the shop sells
  range(E) {
    const b = E.body, sq = E.kind === 'square';
    let html = world(E, { x: E.W / 2, y: E.H + 260, r: 420, rays: 0.7, horizon: false });
    let y = b.y + 4;
    html += T(E, { cls: 'ts-k', x: b.x, y, w: b.w, size: 28, text: 'Sortiment pro Trout Area', inAttr: 'data-in="left"' });
    y += 28 * 1.5;
    const hs = sq ? 92 : 104;
    html += T(E, { cls: 'ts-h', x: b.x - 2, y, w: b.w, size: hs, fit: 50, html: E.t('V nabídce'), inAttr: 'data-in="up" data-d=".05"', main: true });
    y += hs * 1.2 + 6;
    // two counter tiles
    const gap = 20, tw = (b.w - gap) / 2, th = sq ? 300 : 380;
    const tiles = [
      { n: '3 100+', l: 'plandavek', id: 'tsp' },
      { n: '990+', l: 'woblerů', id: 'twb' },
    ];
    tiles.forEach((tl, i) => {
      const x = b.x + i * (tw + gap);
      let inner = '';
      if (i === 0) {
        // three spoons fanned from the tile's bottom-right corner
        inner += spoon(E, { k: 'miub', cx: tw - 150, cy: th - 92, body: sq ? 150 : 180, angle: -28 });
        inner += spoon(E, { k: 'rooney101b', cx: tw - 95, cy: th - 120, body: sq ? 165 : 195, angle: 8 });
        inner += spoon(E, { k: 'forte30a', cx: tw - 52, cy: th - 92, body: sq ? 150 : 180, angle: 40 });
      } else {
        const im = E.img(P.pupa, { cx: tw - (sq ? 140 : 160), cy: th - (sq ? 92 : 115), w: sq ? 270 : 320 });
        inner += im.html.replace('style="', 'style="filter:drop-shadow(0 18px 18px rgba(0,0,0,.6));');
      }
      const ns = sq ? 104 : 124;
      inner += `<div class="t ts-h main" style="left:28px;top:20px;width:${R1(tw - 56)}px;font-size:${ns}px;overflow:hidden">${E.t(tl.n)}</div>`;
      inner += `<div class="t ts-k" style="left:30px;top:${R1(24 + ns * 1.22)}px;width:${R1(tw * 0.55)}px;font-size:${sq ? 34 : 38}px;color:#fff;letter-spacing:.08em;overflow:hidden">${E.t(tl.l)}</div>`;
      html += `<div class="ts-tile" data-in="up" data-dist="34" data-d="${(0.1 + i * 0.08).toFixed(2)}" style="left:${R1(x)}px;top:${R1(y)}px;width:${R1(tw)}px;height:${R1(th)}px">${inner}</div>`;
    });
    y += th + (sq ? 22 : 34);
    // brand wall 4 × 2
    html += T(E, { cls: 'ts-k', x: b.x, y, w: b.w, size: 24, text: 'Značky v nabídce', style: 'color:rgba(255,255,255,.7)', inAttr: 'data-in="fade" data-d=".25"' });
    y += 24 * 1.6;
    const cols = 4, cg = 14, cw = (b.w - cg * (cols - 1)) / cols, chh = Math.min(sq ? 96 : 120, (b.b - y - cg) / 2);
    BRANDS.forEach(([f, trim], i) => {
      const cx0 = b.x + (i % cols) * (cw + cg), cy0 = y + Math.floor(i / cols) * (chh + cg);
      const d = (0.28 + i * 0.04).toFixed(2);
      html += `<div class="ts-cell" data-in="up" data-dist="20" data-d="${d}" style="left:${R1(cx0)}px;top:${R1(cy0)}px;width:${R1(cw)}px;height:${R1(chh)}px"></div>`;
      if (!trim) {   // typed wordmark (research/troutshop_brands.md §5 style: Montserrat 800 caps) — the Vanfook artwork is unreadable this small
        html += `<div class="ts-wm" data-in="up" data-dist="20" data-d="${d}" style="left:${R1(cx0)}px;top:${R1(cy0)}px;width:${R1(cw)}px;height:${R1(chh)}px;font-size:${sq ? 30 : 34}px">${E.t(f)}</div>`;
        return;
      }
      const ar = trim[2] / trim[3], maxH = chh * (ar < 1.5 ? 0.82 : 0.6), maxW = cw * 0.8;
      const fit = E.logoFit(ar, { maxW, maxH });
      html += E.logo(`${BD}${f}.png`, { cx: cx0 + cw / 2, y: cy0 + (chh - fit.h) / 2, maxW, maxH, trim, id: `br-${i}`, attrs: `data-in="up" data-dist="20" data-d="${d}"` }).html;
    });
    return { html };
  },

  // 3 — HERO: Nories ROONEY 2,8 g 101 (gold / fluo) — 1st place by popularity in the shop's spoons
  hero(E) {
    const b = E.body, sq = E.kind === 'square';
    const sx = b.x + b.w * 0.72, sy = b.y + b.h * 0.56, R = sq ? 250 : 290;
    let html = world(E, { x: sx, y: sy, r: R, rays: 1, horizon: false });
    const ph = b.h * (sq ? 1.0 : 0.98);
    const p = prod(E, P.rooney, { cx: sx + 10, cy: b.y + b.h / 2 + 10, h: ph, w: b.w * 0.5, inAttr: 'data-in="rise" data-d=".02"', rot: 12 });
    html += p.html;
    let txt = '';
    let y = b.y + 4;
    txt += T(E, { cls: 'ts-k', x: b.x, y, w: b.w * 0.6, size: 28, text: 'Plandavka Nories', inAttr: 'data-in="left"' });
    y += 28 * 1.5;
    const hs = sq ? 132 : 150;
    txt += T(E, { cls: 'ts-h ml', x: b.x - 3, y, w: b.w * 0.58, size: hs, lines: 2, html: E.t('Rooney') + '<br><em>2,8&nbsp;<span style="text-transform:none">g</span></em>', inAttr: 'data-in="slam" data-d=".06"', main: true });
    y += hs * 1.08 * 2 + 22;
    const cs = sq ? 30 : 34, chH = cs * 1.9;
    const chips = [['101', 'zlatá / fluo'], ['1,5 · 1,8 · 2,2 · 2,8 g', ''], ['č. 1', 'v oblíbenosti e-shopu']];
    chips.forEach(([a, c], i) => {
      txt += `<div class="ts-chipx t" data-in="left" data-d="${(0.18 + i * 0.08).toFixed(2)}" style="left:${R1(b.x)}px;top:${R1(y + i * (chH + 16))}px;height:${R1(chH)}px;font-size:${cs}px"><b>${E.t(a)}</b>${c ? E.t(c) : ''}</div>`;
    });
    return { html: html + txt };
  },

  // 4 — MČR: the sun floods the lower frame red; prizes + logo + URL; top stays black (TA logo on dark)
  mcr(E) {
    const b = E.body, sq = E.kind === 'square';
    const head = sq ? 140 : 160;
    let y = b.y + 4;
    let txt = '';
    txt += T(E, { cls: 'ts-k', x: b.x, y, w: b.w, size: 28, text: 'Mistrovství ČR v Trout Area 2026', inAttr: 'data-in="left"' });
    y += 28 * 1.5;
    txt += T(E, { cls: 'ts-h', x: b.x - 4, y, w: b.w, size: head, fit: 70, text: 'Věnuje ceny', inAttr: 'data-in="slam" data-d=".06"', main: true });
    y += head * 1.0 + 8;
    // red field = the risen sun: a huge disc whose top edge is the horizon
    const top = y + (sq ? 34 : 60), RR = E.W * 1.6;
    let bg = '<div class="full ts-bg"></div>';
    bg += `<div class="ts-rays" data-spin="20" style="left:${R1(E.W / 2 - 1400)}px;top:${R1(top + RR - 1400)}px;width:2800px;height:2800px;opacity:.9"></div>`;
    bg += `<div class="ts-sun ts-redfield" style="left:${R1(E.W / 2 - RR)}px;top:${R1(top)}px;width:${R1(2 * RR)}px;height:${R1(2 * RR)}px"></div>`;
    // products on the red: Crankin' Pupa 109 (wobbler) + spoons
    const py = b.b - (sq ? 130 : 170);
    let pr = '';
    pr += spoon(E, { k: 'forte32a', cx: b.r - (sq ? 250 : 270), cy: py - (sq ? 70 : 90), body: sq ? 190 : 230, angle: -22, shadow: '0 20px 22px rgba(90,0,4,.6)', attrs: 'data-in="rise" data-d=".12"' });
    pr += spoon(E, { k: 'sk20a', cx: b.r - (sq ? 95 : 105), cy: py - (sq ? 85 : 105), body: sq ? 200 : 240, angle: 24, shadow: '0 20px 22px rgba(90,0,4,.6)', attrs: 'data-in="rise" data-d=".16"' });
    pr += prod(E, P.pupa, { cx: b.r - (sq ? 190 : 200), cy: py + (sq ? 40 : 50), w: sq ? 380 : 440, id: 'pupa', inAttr: 'data-in="left" data-d=".1"', shadow: '0 22px 24px rgba(90,0,4,.65)' }).html;
    // logo + URL + specialist line on the red (left)
    const L = tsLogo(E, { x: b.x, y: top + (sq ? 70 : 110), attrs: 'data-in="scale" data-d=".15"' });
    txt += L.html;
    let ly = top + (sq ? 70 : 110) + L.h + 22;
    txt += T(E, { cls: 'ts-h', x: b.x, y: ly, w: b.w * 0.5, size: sq ? 74 : 84, fit: 44, text: 'troutshop.eu', style: 'text-transform:none;text-shadow:0 4px 18px rgba(90,0,4,.5)', inAttr: 'data-in="up" data-d=".2"', main: true });
    ly += (sq ? 74 : 84) * 1.05 + 8;
    txt += T(E, { cls: 'ts-p', x: b.x, y: ly, w: b.w * 0.5, size: sq ? 30 : 34, lines: 2, text: 'Generální partner Trout Area Slovakia', style: 'color:#fff;font-weight:700', inAttr: 'data-in="up" data-d=".26"' });
    return { html: bg + pr + txt, taTone: 'scrim' };
  },
};
