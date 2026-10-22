// JIGOVKY.CZ — sponsor module for the MČR 2026 banner engine (role „sponsor“ → chip „Věnuje ceny · MČR 2026“).
// World = the film block (mcr-2026-sponzori/scripts/blocks/jigovky.mjs + lib/fx_jigovky.mjs, concept A „MAKRO 0,4 g“): forest
// „lightbox“ (#006F33 → #01431F, soft centre light, leaf fog), yellow #FFD600 titles in Roboto Slab 900, PT Sans Narrow 700 caps labels,
// yellow pills / round badges from their packaging, macro jig heads with a light sweep, a loupe on the barbless point (1:1 native px).
// Products = the polished 4k cut-outs in assets_prep/jigovky/ads (+ ads/pol for the painted heads), never upscaled.
// Facts only from research/jigovky.md (Verification), research/jigovky_ad.md §4, research/jigovky_brands.md §5, vo/script_cs.json:
//   „Jigy, které chytají!“ (their slogan) · „Poctivě vyrobeno v ČR“ (USP) · Český výrobce jigových hlaviček a bezprotihrotových jigů
//   (Verification one-liner) · jigové i wolframové hlavičky od UL po vertikální přívlač · TroutJig Barbless #4/#6/#8, 0,4–3 g, značka
//   Jigovky.cz · HD Barbless 7 barev (FLUO PINK RED ORANGE BLACK SILVER GOLD) · „V nabídce také · VARIVAS“ (resold brand, never as own).
// NOT used (never_say / notes): „největší výběr“, „vlastní výroba“, „+1300 druhů“, japonské háčky, rotačky (treble hook), no hint that
// jigs are used at MČR (hard baits).

export const brand = { name: 'Jigovky.cz', url: 'jigovky.cz', role: 'sponsor' };

const C = { forest: '#006F33', deep: '#01431F', night: '#00210F', leaf: '#00AB4E', yellow: '#FFD600', white: '#ffffff', soft: 'rgba(255,255,255,.84)' };
export const theme = {
  bg: C.deep,
  taTone: 'dark',
  chrome: { url: C.yellow, urlFont: "'Roboto Slab'", urlW: 900, sub: C.soft, dot: C.yellow, chipBg: 'rgba(0,33,15,.72)', chipLine: 'rgba(255,214,0,.6)', chipFg: '#ffffff', event: 'rgba(255,255,255,.9)' },
};
export const fonts = {};   // Roboto Slab (variable 100–900) + PT Sans Narrow 400/700 are in the engine registry

// 10 s loop, poster at rest on frame 0 and at the end
export const anim = {
  seq: [
    { scene: 'poster', d: 2.2 },
    { scene: 'range', d: 2.1 },
    { scene: 'hero', d: 2.0 },
    { scene: 'mcr', d: 1.9 },
    { scene: 'poster', d: 1.8 },
  ],
};

// ---------- products (native px: visible alpha bbox, ball-head centre + radius; from assets_prep/jigovky/ads/_meta.json) ----------
const AD = 'film:assets_prep/jigovky/ads/', POL = AD + 'pol/';
const P = {
  tj: { src: AD + 'hero_troutjig_barbless.png', vb: [90, 90, 2310, 1480], head: [356, 1213], r: 259, l: ['TroutJig', 'Barbless'] },
  sk: { src: AD + 'hero_sickle.png', vb: [97, 97, 2503, 1001], head: [419, 661], r: 314, l: ['Jigová hlavička', 'SICKLE'] },
  fluo: { src: POL + 'head_fluo.png', vb: [187, 1, 1090, 432], head: [925, 269], r: 162, l: ['HD Barbless', 'Fluo'] },
  pink: { src: POL + 'head_pink.png', vb: [181, 2, 1077, 437], head: [942, 302], r: 134, l: ['HD Barbless', 'Pink'] },
  red: { src: POL + 'head_red.png', vb: [214, 1, 1242, 542], head: [1020, 333], r: 207, l: ['HD Barbless', 'Red'] },
  chrome: { src: AD + 'head_chrome_macro.png', vb: [205, 2, 1157, 682], head: [929, 453], r: 225, l: ['HD Barbless #4', '3 g'] },
  ll: { src: AD + 'sec_head_ll_raw.png', vb: [206, 1, 1162, 677], head: [930, 443], r: 227, l: ['LL Barbless #6', '2 g'] },
  gold: { src: POL + 'head_gold.png', vb: [63, 1, 415, 95], head: [327, 47], r: 46, l: ['H 360 BL', 'Gold'] },
  orange: { src: POL + 'head_orange.png', vb: [66, 2, 436, 102], head: [344, 51], r: 49, l: ['H 360 BL', 'Orange'] },
  silver: { src: AD + 'head_silver.png', vb: [72, 1, 467, 211], head: [373, 154], r: 53, l: ['HD Barbless', 'Silver'] },
};
const TJ_TIP = [1452, 186];          // tip of the barbless point (native px, from the film block)
const LOGO = 'film:assets_prep/jigovky/logo_on_dark.png', LOGO_TRIM = [36, 36, 1800, 895];
const VARIVAS = 'film:assets_prep/jigovky/brands/varivas_on_dark.png', VAR_AR = 2391 / 512;
// Tungsten HD BARBLESS colourways (jigovky.cz/tungsten-hd-barbless/), hex measured from the cut-outs (fx_jigovky.mjs SW)
const SW = [['FLUO', '#D3FC02'], ['PINK', '#DF0AA1'], ['RED', '#EC0102'], ['ORANGE', '#FE5F00'], ['BLACK', '#2F2F2F'], ['SILVER', '#D6D6D6'], ['GOLD', '#C9A13B']];
const WORLD = 'radial-gradient(95% 62% at 50% 44%, #0f8a47 0%, #0b8040 10%, #067536 22%, #006F33 32%, #01642e 44%, #015628 56%, #014a22 68%, #013d1c 80%, #013016 90%, #00260f 100%)';

export function css() {
  return `
.jg-bg{background:${WORLD}}
.jg-fog{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none}
.jg-vig{background:radial-gradient(120% 90% at 50% 45%,rgba(0,0,0,0) 55%,rgba(0,20,8,.55) 100%)}
.jg-k{font-family:'PT Sans Narrow';font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${C.soft};line-height:1.15}
.jg-h{font-family:'Roboto Slab';font-weight:900;color:${C.yellow};line-height:1.02;letter-spacing:-.012em}
.jg-hw{font-family:'Roboto Slab';font-weight:900;color:${C.white};line-height:1.02;letter-spacing:-.012em}
.jg-p{font-family:'Roboto Slab';font-weight:700;color:${C.white};line-height:1.2;white-space:normal}
.jg-pill{display:flex;align-items:center;justify-content:center;border-radius:999px;background:${C.yellow};color:${C.deep};font-family:'PT Sans Narrow';font-weight:700;text-transform:uppercase;letter-spacing:.05em;box-shadow:0 14px 30px rgba(0,20,8,.35);white-space:nowrap}
.jg-pill.o{background:rgba(0,33,15,.55);color:${C.white};box-shadow:inset 0 0 0 2px rgba(255,214,0,.75)}
.jg-band{border-radius:18px;background:${C.yellow};box-shadow:0 18px 40px rgba(0,16,7,.4)}
.jg-band-t{font-family:'PT Sans Narrow';font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:${C.deep};line-height:1}
.jg-tile{position:absolute;overflow:hidden;border-radius:26px;background:linear-gradient(155deg,rgba(255,255,255,.14) 0%,rgba(255,255,255,.04) 46%,rgba(0,0,0,.12) 100%);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.16),inset 0 1.5px 0 rgba(255,255,255,.22)}
.jg-tl{font-family:'PT Sans Narrow';font-weight:700;text-transform:uppercase;line-height:1.05}
.jg-tl span{display:block;letter-spacing:.1em;color:rgba(255,255,255,.82)}
.jg-tl b{display:block;letter-spacing:.04em;color:${C.yellow};font-weight:700}
.jg-dot{position:absolute;border-radius:50%;box-shadow:0 6px 14px rgba(0,0,0,.35),inset 0 0 0 1.5px rgba(255,255,255,.25)}
.jg-lens{position:absolute;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 40% 35%,#ffffff 0%,#f3f6f4 45%,#d6e2da 100%);box-shadow:0 26px 60px rgba(0,16,7,.55),0 0 0 4px ${C.yellow}}
.jg-sw{position:absolute;overflow:hidden;-webkit-mask-size:100% 100%;mask-size:100% 100%;mix-blend-mode:screen;pointer-events:none}
.jg-sw i{position:absolute;top:0;bottom:0;left:-130%;width:60%;background:linear-gradient(100deg,rgba(255,255,255,0) 35%,rgba(255,255,255,.45) 50%,rgba(255,255,255,0) 65%)}
.jg-sh{position:absolute;border-radius:50%;background:radial-gradient(closest-side,rgba(0,18,7,.62),rgba(0,18,7,.28) 60%,rgba(0,18,7,0));pointer-events:none}
.jg-var{position:absolute;display:flex;align-items:center;border-radius:999px;background:rgba(0,33,15,.6);box-shadow:inset 0 0 0 2px rgba(255,255,255,.22),0 16px 34px rgba(0,16,7,.35)}
.jg-var i{display:block;flex:none}
.jg-glint{position:absolute;pointer-events:none;background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.95) 50%,transparent 100%) center/100% 3px no-repeat,linear-gradient(0deg,transparent 0%,rgba(255,255,255,.95) 50%,transparent 100%) center/3px 100% no-repeat,radial-gradient(closest-side,rgba(255,255,255,.95),rgba(255,255,255,0) 24%)}
`;
}

// ---------- helpers ----------
const R1 = (n) => Math.round(n * 10) / 10;
const T = (E, { cls, x, y, w, size, text, html, align = 'left', fit = 0, lines = 0, main = false, inAttr = '', style = '', id = '' }) =>
  `<div ${id ? `id="${id}" ` : ''}class="t ${cls}${main ? ' main' : ''}" ${inAttr} ${fit ? `data-fit="${fit}"` : ''} ${lines ? `data-lines="${lines}"` : ''} style="left:${R1(x)}px;top:${R1(y)}px;width:${R1(w)}px;font-size:${size}px;text-align:${align};${lines ? 'white-space:normal;' : 'overflow:hidden;'}${style}">${html ?? E.t(text)}</div>`;

// forest lightbox world: gradient + two leaf fog blobs + vignette
function world(E, { lx = 0.5, ly = 0.45 } = {}) {
  const W = E.W, H = E.H, m = Math.max(W, H);
  return `<div class="full jg-bg" style="background-position:${R1((lx - 0.5) * 30)}% ${R1((ly - 0.45) * 30)}%"></div>
<i class="jg-fog" style="left:${R1(W * lx - m * 0.35)}px;top:${R1(H * ly - m * 0.25)}px;width:${R1(m * 0.7)}px;height:${R1(m * 0.5)}px;background:rgba(0,171,78,.22)"></i>
<i class="jg-fog" style="left:${R1(-m * 0.2)}px;top:${R1(H * 0.7)}px;width:${R1(m * 0.6)}px;height:${R1(m * 0.4)}px;background:rgba(0,90,40,.35)"></i>
<div class="full jg-vig"></div>`;
}

// product placed so that native point (nx, ny) lands on screen (x, y) at scale s (≤ 1 → never upscaled), optional rotation about that point
function put(E, k, { s, nx, ny, x, y, rot = 0, id = '', inAttr = '', sweep = '', shadow = 0, float = '', z = '' }) {
  const p = P[k], [nw, nh] = E.dims(p.src), w = nw * s, h = nh * s;
  const ox = x - nx * s, oy = y - ny * s, url = E.src(p.src);
  // screen point of a native point (with rotation about (nx, ny))
  const at = (px, py) => { const dx = (px - nx) * s, dy = (py - ny) * s, a = (rot * Math.PI) / 180; return [x + dx * Math.cos(a) - dy * Math.sin(a), y + dx * Math.sin(a) + dy * Math.cos(a)]; };
  let sh = '';
  if (shadow) {   // soft contact shadow under the visible bottom (floating jig)
    const [x0] = at(p.vb[0], p.vb[3]), [x1] = at(p.vb[2], p.vb[3]);
    const by = Math.max(at(p.vb[0], p.vb[3])[1], at(p.vb[2], p.vb[3])[1]);
    const sw = Math.abs(x1 - x0) * 0.8, shh = Math.max(24, sw * 0.09);
    sh = `<i class="jg-sh" style="left:${R1((x0 + x1) / 2 - sw / 2)}px;top:${R1(by + shadow - shh / 2)}px;width:${R1(sw)}px;height:${R1(shh)}px"></i>`;
  }
  const html = `${sh}<div class="abs"${id ? ` id="${id}"` : ''} ${inAttr} ${float ? `data-float="${float}"` : ''} style="left:${R1(ox)}px;top:${R1(oy)}px;width:${R1(w)}px;height:${R1(h)}px;${z}">
  <div class="abs" style="inset:0;transform:rotate(${rot}deg);transform-origin:${R1(nx * s)}px ${R1(ny * s)}px">
    <img src="${url}" alt="" style="position:absolute;inset:0;width:100%;height:100%">
    ${sweep ? `<div class="jg-sw" style="inset:0;-webkit-mask-image:url(${url});mask-image:url(${url})"><i data-sweep="${sweep}"></i></div>` : ''}
  </div></div>`;
  return { html, at, s, w, h, ox, oy };
}
// fit the visible bbox of a product into a box (centre cx, cy), never above native size; anchor = visible centre
function fitIn(E, k, { cx, cy, w, h, maxS = 1, ...o }) {
  const p = P[k], vw = p.vb[2] - p.vb[0], vh = p.vb[3] - p.vb[1];
  const s = Math.min(maxS, w / vw, h / vh);
  return put(E, k, { s, nx: (p.vb[0] + p.vb[2]) / 2, ny: (p.vb[1] + p.vb[3]) / 2, x: cx, y: cy, ...o });
}
// sponsor logo (white on transparent) fitted to the TA-logo rule
const logo = (E, o) => E.logo(LOGO, { trim: LOGO_TRIM, ...o });
const logoSize = (E, maxH = 999) => E.logoFit(LOGO_TRIM[2] / LOGO_TRIM[3], { maxH });

function pill(E, { x, y, h, size, text, outline = false, inAttr = '', w = null }) {
  const ww = w ?? Math.ceil(text.length * size * 0.46 + size * 1.5);
  return { html: `<div class="t jg-pill${outline ? ' o' : ''}" ${inAttr} style="left:${R1(x)}px;top:${R1(y)}px;height:${R1(h)}px;width:${R1(ww)}px;font-size:${size}px">${E.t(text)}</div>`, w: ww };
}
function band(E, { x, y, w, h, size, text, inAttr = 'data-in="wipe-r" data-d=".25"' }) {
  return `<div class="abs jg-band" ${inAttr} style="left:${R1(x)}px;top:${R1(y)}px;width:${R1(w)}px;height:${R1(h)}px">${T(E, { cls: 'jg-band-t', x: h * 0.32, y: (h - size) / 2 + size * 0.04, w: w - h * 0.64, size, fit: 22, text })}</div>`;
}
function dots(E, { x, y, d, gap, inAttr = '' }) {
  return SW.map(([, col], i) => `<i class="jg-dot" ${inAttr ? inAttr.replace('{d}', (0.15 + i * 0.04).toFixed(2)) : ''} style="left:${R1(x + i * (d + gap))}px;top:${R1(y)}px;width:${d}px;height:${d}px;background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.55),rgba(255,255,255,0) 45%),${col}"></i>`).join('');
}
const glint = (x, y, size, d = 0.6) => `<i class="jg-glint" data-in="scale" data-d="${d}" style="left:${R1(x - size / 2)}px;top:${R1(y - size / 2)}px;width:${size}px;height:${size}px"></i>`;
// „V nabídce také | VARIVAS“ strip (resold brand: one line, white mark as a background layer, far below the Jigovky + TA logos)
function varivas(E, { x, y, h, size, inAttr = 'data-in="up" data-d=".35"' }) {
  const lh = Math.round(h * 0.4), lw = Math.round(lh * VAR_AR), pad = Math.round(h * 0.42);
  return `<div class="jg-var" ${inAttr} style="left:${R1(x)}px;top:${R1(y)}px;height:${h}px;padding:0 ${pad}px;gap:${Math.round(h * 0.3)}px">
  <span class="t jg-k" style="position:relative;font-size:${size}px;letter-spacing:.12em;color:rgba(255,255,255,.86)">${E.t('V nabídce také')}</span>
  <i style="width:2px;height:${Math.round(h * 0.5)}px;background:${C.yellow};border-radius:1px"></i>
  <i style="width:${lw}px;height:${lh}px;background:url(${E.src(VARIVAS)}) center/contain no-repeat"></i></div>`;
}

// ---------- scenes ----------
export const scenes = {
  // POSTER (statics + loop ends): the slogan + TroutJig Barbless as the floating hero, logo, „Poctivě vyrobeno v ČR“
  poster(E) {
    const b = E.body, k = E.kind;
    let html = world(E, { lx: 0.62, ly: 0.62 }), txt = '';
    if (k === 'wide') {
      const colW = 560;
      txt += T(E, { cls: 'jg-k', x: b.x, y: b.y + 6, w: colW, size: 22, text: 'Poctivě vyrobeno v ČR', style: `color:${C.yellow}`, inAttr: 'data-in="left" data-d=".05"' });
      txt += T(E, { cls: 'jg-h', x: b.x - 2, y: b.y + 40, w: colW, size: 78, lines: 2, fit: 50, text: 'Jigy, které chytají!', inAttr: 'data-in="slam" data-d=".1"', main: true });
      const pl = pill(E, { x: b.x, y: b.y + 214, h: 52, size: 28, text: 'Bez protihrotu · od 0,4 g', inAttr: 'data-in="left" data-d=".25"' });
      txt += pl.html;
      const L = logoSize(E);
      txt += logo(E, { x: b.x, y: b.b - L.h, attrs: 'data-in="fade" data-d=".4"' }).html;
      const J = fitIn(E, 'tj', { cx: b.x + colW + (b.w - colW) / 2 + 10, cy: b.y + b.h / 2 + 2, w: b.w - colW - 10, h: b.h - 30, rot: -6, inAttr: 'data-in="rise" data-d=".05"', sweep: '0.35,1.3', shadow: 26, float: '6,5' });
      html += J.html;
      const [gx, gy] = J.at(P.tj.head[0] - 80, P.tj.head[1] - 95);
      html += glint(gx, gy, 120);
      return { html: html + txt };
    }
    const S = k === 'square' ? { kick: 30, head: 140, pillH: 64, pillS: 36, jigW: 900, dots: 0 } : k === 'portrait' ? { kick: 34, head: 168, pillH: 74, pillS: 40, jigW: 980, dots: 0 } : { kick: 36, head: 176, pillH: 78, pillS: 42, jigW: 980, dots: 44 };
    let y = b.y + (k === 'tall' ? 30 : 4);
    txt += T(E, { cls: 'jg-k', x: b.x, y, w: b.w * 0.7, size: S.kick, text: 'Poctivě vyrobeno v ČR', style: `color:${C.yellow}`, inAttr: 'data-in="left" data-d=".05"' });
    y += S.kick * 1.45;
    txt += T(E, { cls: 'jg-h', x: b.x - 4, y, w: b.w, size: S.head, fit: 70, html: `${E.t('Jigy, které')}<br>${E.t('chytají!')}`, inAttr: 'data-in="slam" data-d=".1"', main: true });
    const headB = y + S.head * 1.02 * 2;
    // logo right of the first headline line (line 2 is short → the hook bend has room under it)
    const L = logoSize(E);
    txt += logo(E, { x: b.r - L.w, y: y + (S.head * 1.0 - L.h) / 2 + 4, attrs: 'data-in="fade" data-d=".35"' }).html;
    y = headB + (k === 'square' ? 14 : 24);
    const p1 = pill(E, { x: b.x, y, h: S.pillH, size: S.pillS, text: 'Bez protihrotu', inAttr: 'data-in="left" data-d=".22"' });
    txt += p1.html;
    txt += pill(E, { x: b.x + p1.w + 16, y, h: S.pillH, size: S.pillS, text: 'od 0,4 g', outline: true, inAttr: 'data-in="left" data-d=".3"' }).html;
    // the floating hero jig: its top-left (above the eye) is empty, so the box may start beside line 2 of the headline
    const bottom = b.b - (S.dots ? S.dots + 40 : 0);
    const top = headB - S.head * (k === 'square' ? 0.55 : 0.4);
    const J = fitIn(E, 'tj', { cx: b.x + b.w / 2 + (k === 'square' ? 60 : 30), cy: (top + bottom) / 2 - 6, w: S.jigW, h: bottom - top - 24, rot: -6, inAttr: 'data-in="rise" data-d=".05"', sweep: '0.35,1.3', shadow: 22, float: '7,5' });
    html += J.html;
    const [gx, gy] = J.at(P.tj.head[0] - 80, P.tj.head[1] - 95);
    html += glint(gx, gy, k === 'square' ? 160 : 200);
    if (S.dots) {   // 9:16: HD Barbless colourways row at the bottom of the body
      const d = S.dots, g = 16, dw = 7 * d + 6 * g;
      txt += T(E, { cls: 'jg-k', x: b.x, y: b.b - d + (d - 34) / 2 - 2, w: b.w - dw - 20, size: 34, text: 'HD Barbless · 7 barev', inAttr: 'data-in="left" data-d=".3"' });
      txt += dots(E, { x: b.r - dw, y: b.b - d, d, gap: g, inAttr: 'data-in="scale" data-d="{d}"' });
    }
    return { html: html + txt };
  },

  // 1 — WHO: Czech maker of jig heads (verified one-liner), what they make, „Poctivě vyrobeno v ČR“; chrome macro head on the right
  who(E) {
    const b = E.body, sq = E.kind === 'square';
    let html = world(E, { lx: 0.78, ly: 0.55 });
    // macro chrome head (HD Barbless #4 3 g) at ≤ native size, shank fading behind the text column
    const M = put(E, 'chrome', { s: sq ? 0.92 : 1, nx: P.chrome.head[0], ny: P.chrome.head[1], x: E.W - (sq ? 150 : 165), y: b.y + b.h * (sq ? 0.5 : 0.52), inAttr: 'data-in="left" data-dist="60"', sweep: '0.3,1.2' });
    html += `<div data-kb="1,1.04" class="full" style="transform-origin:${R1(E.W - 150)}px ${R1(b.y + b.h / 2)}px">${M.html}</div>`;
    html += `<div class="full" style="background:linear-gradient(90deg,rgba(1,40,18,.92) 0%,rgba(1,48,22,.78) 42%,rgba(1,48,22,0) 66%)"></div>`;
    const [gx, gy] = M.at(P.chrome.head[0] - 95, P.chrome.head[1] - 120);
    html += glint(gx, gy, 170, 0.5);
    const colW = b.w * 0.64, L = logoSize(E);
    const ps = sq ? 46 : 50, blockH = L.h + 34 + 100 + 20 + ps * 1.2 * 3 + 26 + 30 * 1.3 * 2 + 40 + 84;
    let y = b.y + Math.max(0, (b.h - blockH) / 2);
    html += logo(E, { x: b.x, y, attrs: 'data-in="scale"' }).html;
    y += L.h + 34;
    html += T(E, { cls: 'jg-hw', x: b.x - 3, y, w: colW, size: sq ? 96 : 104, fit: 56, text: 'Jigovky.cz', inAttr: 'data-in="left" data-d=".08"', main: true });
    y += (sq ? 96 : 104) * 1.02 + 20;
    html += T(E, { cls: 'jg-p', x: b.x, y, w: colW, size: ps, lines: 3, fit: 40, text: 'Český výrobce jigových hlaviček a bezprotihrotových jigů.', inAttr: 'data-in="up" data-d=".18"', main: true, style: `color:${C.yellow}` });
    y += ps * 1.2 * 3 + 26;
    html += T(E, { cls: 'jg-k', x: b.x, y, w: colW * 0.9, size: 30, lines: 2, text: 'Jigové i wolframové hlavičky od UL po vertikální přívlač', style: 'white-space:normal;line-height:1.3', inAttr: 'data-in="up" data-d=".26"' });
    y += 30 * 1.3 * 2 + 40;
    html += band(E, { x: b.x, y, w: Math.min(colW, 620), h: 84, size: 48, text: 'Poctivě vyrobeno v ČR', inAttr: 'data-in="wipe-r" data-d=".34"' });
    return { html };
  },

  // 2 — RANGE: own-brand assortment bento (9 products, colourways) + „V nabídce také · VARIVAS“
  range(E) {
    const b = E.body, sq = E.kind === 'square';
    let html = world(E, { lx: 0.5, ly: 0.5 });
    const kS = sq ? 26 : 30, hS = sq ? 74 : 88;
    html += T(E, { cls: 'jg-k', x: b.x, y: b.y + 2, w: b.w * 0.62, size: kS, fit: 20, text: 'Jigové hlavičky · bezprotihrotové jigy', inAttr: 'data-in="left"' });
    // 7 colourways of HD Barbless, right-aligned on the kicker line
    const dd = sq ? 26 : 30, dg = 9, dw = 7 * dd + 6 * dg, lab = sq ? 24 : 28;
    html += T(E, { cls: 'jg-k', x: b.r - dw - 130, y: b.y + 2 + (kS - lab) / 2, w: 116, size: lab, align: 'right', text: '7 barev', style: `color:${C.yellow}`, inAttr: 'data-in="fade" data-d=".1"' });
    html += dots(E, { x: b.r - dw, y: b.y + 2 + (kS * 1.15 - dd) / 2, d: dd, gap: dg, inAttr: 'data-in="scale" data-d="{d}"' });
    html += T(E, { cls: 'jg-h', x: b.x - 3, y: b.y + kS * 1.15 + 10, w: b.w, size: hS, fit: 44, text: 'Barbless i klasika', inAttr: 'data-in="up" data-d=".06"', main: true });
    const varH = sq ? 64 : 76, gap = 12;
    const gy = b.y + kS * 1.15 + 10 + hS * 1.1 + 6, gb = b.b - varH - 16, cw = (b.w - 2 * gap) / 3;
    const hs = [0.36, 0.32, 0.32], gh = gb - gy - 2 * gap;
    const rows = hs.map((f) => f * gh); const ry = [gy, gy + rows[0] + gap, gy + rows[0] + rows[1] + 2 * gap];
    const tiles = [['tj', 0, 0, 2], ['fluo', 0, 2, 1], ['pink', 1, 0, 1], ['red', 1, 1, 1], ['chrome', 1, 2, 1], ['sk', 2, 0, 2], ['h360', 2, 2, 1]];
    const l1 = sq ? 22 : 24, l2 = sq ? 30 : 34;
    tiles.forEach(([key, ri, ci, span], i) => {
      const x = b.x + ci * (cw + gap), w = cw * span + gap * (span - 1), y = ry[ri], h = rows[ri];
      let inner = '';
      const lblH = l1 * 1.05 + l2 * 1.05 + 4;
      if (span === 2) {   // whole jig on the right part of a wide tile
        const J = fitIn(E, key, { cx: w - (w - 220) / 2 - 8, cy: h / 2 + 4, w: w - 236, h: h - 28 });
        inner = J.html;
      } else if (key === 'h360') {   // Tungsten H 360 BL orange 0,4 g (small head, native size)
        const p = P.orange, sc = Math.min(1, (h - 64) / (2 * p.r + 10));
        inner = put(E, 'orange', { s: sc, nx: p.head[0], ny: p.head[1], x: w - 30 - p.r * sc, y: h - 26 - p.r * sc }).html;
      } else {            // colour / chrome head: ball parked bottom-right, shank fading out to the left
        const p = P[key], avail = h - lblH - 20;
        const s = Math.min(1, (avail * 0.92) / (2 * p.r + 40));
        const J = put(E, key, { s, nx: p.head[0], ny: p.head[1], x: w - 22 - p.r * s * 1.05, y: h - 14 - p.r * s * 1.12 });
        inner = J.html;
      }
      const lb = key === 'h360' ? ['Tungsten H 360 BL', 'Orange'] : P[key].l;
      const lbl = `<div class="t jg-tl" style="left:20px;top:16px;width:${R1(span === 2 ? 210 : w - 30)}px;white-space:normal"><span style="font-size:${l1}px">${E.t(lb[0])}</span><b style="font-size:${l2}px;${/g$/.test(lb[1]) ? 'text-transform:none;' : ''}">${E.t(lb[1])}</b></div>`;
      html += `<div class="jg-tile" data-in="up" data-dist="34" data-d="${(0.1 + i * 0.05).toFixed(2)}" style="left:${R1(x)}px;top:${R1(y)}px;width:${R1(w)}px;height:${R1(h)}px">${inner}${lbl}</div>`;
    });
    html += varivas(E, { x: b.x, y: b.b - varH, h: varH, size: sq ? 26 : 30 });
    return { html };
  },

  // 3 — HERO: TroutJig Barbless (own brand, trout line): loupe on the barbless point at 1:1 native px, verified spec pills
  hero(E) {
    const b = E.body, sq = E.kind === 'square';
    let html = world(E, { lx: 0.6, ly: 0.62 }), txt = '';
    const hS = sq ? 104 : 120;
    txt += T(E, { cls: 'jg-k', x: b.x, y: b.y + 2, w: b.w, size: sq ? 28 : 32, text: 'Pstruhová řada · značka Jigovky.cz', inAttr: 'data-in="left"' });
    txt += T(E, { cls: 'jg-h', x: b.x - 4, y: b.y + 44, w: b.w, size: hS, fit: 60, html: `TroutJig <span style="color:#fff">Barbless</span>`, inAttr: 'data-in="slam" data-d=".06"', main: true });
    const top = b.y + 44 + hS * 1.1;
    // spec pills (left column)
    const ph = sq ? 60 : 68, ps = sq ? 34 : 38;
    [['Bez protihrotu', false], ['0,4–3 g', true], ['Háčky #4 · #6 · #8', true]].forEach(([t, o], i) => {
      txt += pill(E, { x: b.x, y: top + 10 + i * (ph + 14), h: ph, size: ps, text: t, outline: o, inAttr: `data-in="left" data-d="${(0.18 + i * 0.08).toFixed(2)}"` }).html;
    });
    // the jig: big, lower right
    const jt = top + (sq ? 40 : 160), jw = sq ? 820 : 960;
    const J = fitIn(E, 'tj', { cx: b.r - jw / 2 + (sq ? 40 : 30), cy: (jt + b.b) / 2, w: jw, h: b.b - jt - 10, rot: -6, inAttr: 'data-in="rise" data-d=".02"', sweep: '0.3,1.2', shadow: 18 });
    html += J.html;
    // loupe at 1:1 native px on the barbless point + leader
    const tip = J.at(TJ_TIP[0], TJ_TIP[1]);
    const r = sq ? 112 : 136, lc = [tip[0] - (sq ? 30 : 40), tip[1] + r + (sq ? 70 : 90)];
    const nx = 1478, ny = 182;
    const [nw, nh] = E.dims(P.tj.src);
    const a = Math.atan2(tip[1] - lc[1], tip[0] - lc[0]), e = [lc[0] + Math.cos(a) * (r + 6), lc[1] + Math.sin(a) * (r + 6)];
    html += `<svg class="abs" data-in="fade" data-d=".3" style="left:0;top:0;width:${E.W}px;height:${E.H}px;overflow:visible"><line x1="${R1(e[0])}" y1="${R1(e[1])}" x2="${R1(tip[0])}" y2="${R1(tip[1])}" stroke="${C.yellow}" stroke-width="3"/><circle cx="${R1(tip[0])}" cy="${R1(tip[1])}" r="8" fill="${C.yellow}"/></svg>`;
    html += `<div class="jg-lens" data-in="scale" data-d=".28" style="left:${R1(lc[0] - r)}px;top:${R1(lc[1] - r)}px;width:${2 * r}px;height:${2 * r}px"><img src="${E.src(P.tj.src)}" alt="" style="position:absolute;left:${R1(r - nx)}px;top:${R1(r - ny)}px;width:${nw}px;height:${nh}px;max-width:none;transform:rotate(-6deg);transform-origin:${nx}px ${ny}px"></div>`;
    const [gx, gy] = J.at(P.tj.head[0] - 80, P.tj.head[1] - 95);
    html += glint(gx, gy, sq ? 150 : 180);
    return { html: html + txt };
  },

  // 4 — MČR: prize partner (chip from the engine) + logo | URL lockup + three colourways
  mcr(E) {
    const b = E.body, sq = E.kind === 'square';
    let html = world(E, { lx: 0.55, ly: 0.7 }), txt = '';
    txt += T(E, { cls: 'jg-k', x: b.x, y: b.y + 2, w: b.w, size: sq ? 28 : 32, text: 'Mistrovství ČR v Trout Area 2026', style: `color:${C.yellow}`, inAttr: 'data-in="left"' });
    const hS = sq ? 116 : 132;
    txt += T(E, { cls: 'jg-hw', x: b.x - 4, y: b.y + 46, w: b.w, size: hS, lines: 2, fit: 60, text: 'Děkujeme za ceny!', inAttr: 'data-in="slam" data-d=".06"', main: true });
    let y = b.y + 46 + hS * 1.02 * 2 + (sq ? 22 : 36);
    // lockup: logo | jigovky.cz
    const L = logoSize(E);
    txt += logo(E, { x: b.x, y, attrs: 'data-in="fade" data-d=".2"' }).html;
    txt += `<i class="abs" data-in="fade" data-d=".25" style="left:${R1(b.x + L.w + 28)}px;top:${R1(y + 8)}px;width:3px;height:${R1(L.h - 16)}px;background:rgba(255,255,255,.55);border-radius:2px"></i>`;
    const uS = sq ? 76 : 84;
    txt += T(E, { cls: 'jg-h', x: b.x + L.w + 58, y: y + (L.h - uS * 1.02) / 2, w: b.r - (b.x + L.w + 58), size: uS, fit: 44, text: 'jigovky.cz', inAttr: 'data-in="left" data-d=".26"', main: true });
    y += L.h + (sq ? 22 : 36);
    txt += T(E, { cls: 'jg-k', x: b.x, y, w: b.w * 0.55, size: sq ? 30 : 34, lines: 2, html: `${E.t('Jigy, které chytají!')}<br>${E.t('Poctivě vyrobeno v ČR')}`, style: 'white-space:normal;line-height:1.3', inAttr: 'data-in="up" data-d=".32"' });
    // three colourways staircase, bottom right (no crossing: each eye rises right of the ball above it)
    const ks = ['fluo', 'pink', 'red'], hp = sq ? 120 : 150, st = sq ? [148, 92] : [175, 120];
    ks.forEach((key, i) => {
      const p = P[key], s = Math.min(1, hp / (2 * p.r));
      const cx = b.r - 70 - (2 - i) * st[0], cy = b.b - 70 - (2 - i) * st[1];
      html += put(E, key, { s, nx: p.head[0], ny: p.head[1], x: cx, y: cy, inAttr: `data-in="right" data-d="${(0.15 + i * 0.08).toFixed(2)}"`, sweep: `${(0.3 + i * 0.1).toFixed(2)},1.1` }).html;
    });
    return { html: html + txt };
  },
};
