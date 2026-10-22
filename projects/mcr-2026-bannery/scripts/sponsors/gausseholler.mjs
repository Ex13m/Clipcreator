// GAUSSE HOLLER CUSTOM LAB — reference sponsor module for the MČR 2026 banner engine.
// World = the film block (mcr-2026-sponzori/scripts/blocks/gausseholler.mjs + lib/fx_gausseholler.mjs): graphite studio #0F1113,
// top light cone, Revolut 8 Black on a display plinth in the render's own perspective (FOOT ellipses copied from fx_gausseholler),
// bone type, ice kickers, ONE orange accent (Black-edition logo), GH logo = the site's three layers with the OUTER RING turning clockwise.
// Facts only from research/gausseholler.md (Verification) + vo/script_cs.json: no colour count, no prices, no „závodní“.
//   „Stojany na pruty ručně stavěné v Česku: karbon, hliník, limitovaná série“ · „Osm karbonových tubusů na radiálních hliníkových
//   ramenech“ · „Limitovaná série pěti kusů, každý stojan je číslovaný“ · tubusy Ø 32 mm, délka 200 mm · „custom builds made to order“ ·
//   „hand-built in Czechia · ships across the EU“ · Hlavní cena pro vítěze MČR = Revolut 8 (BRIEF) · Partner a informační sponzor (BRIEF)

export const brand = {
  name: 'Gausse Holler Custom Lab',
  url: 'gausseholler.com',
  role: 'prize',                      // → chip „Hlavní cena pro vítěze MČR · Revolut 8“ + role line „Partner a informační sponzor“
  // operator 22. 10.: no separate GH logo block in the composition — only the GH gear icon right before the URL (engine chrome);
  // outer ring turns clockwise in the MP4s (360° per loop), core stands. Layers 512×512, ring pivot by its 60° symmetry (MEMORY).
  urlIcon: { ring: 'shared:brand/gh/ring.png', core: 'shared:brand/gh/core.png', canvas: [512, 512], box: [14, 2, 487, 509], pivot: [256.375, 257], spin: 360, scale: 1.2, gap: 0.3, dy: 0.05 },
};

const C = { bg: '#0f1113', panel: '#16191c', line: '#282d33', bone: '#e9e6e2', white: '#ffffff', ice: '#7fb2c7', gear: '#1d8fd5', orange: '#e8925a' };
export const theme = {
  bg: C.bg,
  taTone: 'dark',
  chrome: { url: C.white, urlFont: "'Inter'", urlW: 800, sub: C.ice, dot: C.orange, chipBg: 'rgba(232,146,90,.14)', chipLine: 'rgba(232,146,90,.55)', chipFg: '#fff3ea', event: 'rgba(233,230,226,.88)' },
};
// 10 s seamless loop: poster at rest on frame 0 and at the end
export const anim = {
  seq: [
    { scene: 'poster', d: 2.2 },
    { scene: 'range', d: 2.1 },
    { scene: 'hero', d: 2.0 },
    { scene: 'mcr', d: 1.9 },
    { scene: 'poster', d: 1.8 },
  ],
  // 16:9 MP4 (kind 'wide'): the same story, every scene has a landscape layout (text column left, product right)
  wide: [
    { scene: 'poster', d: 2.2 },
    { scene: 'range', d: 2.1 },
    { scene: 'hero', d: 2.0 },
    { scene: 'mcr', d: 1.9 },
    { scene: 'poster', d: 1.8 },
  ],
};

const AD = 'film:assets_prep/gausseholler/ads/';
const P = {
  threeq: `${AD}H1_revolut8_black_threeq.png`, front: `${AD}H1b_revolut8_black_front.png`, top: `${AD}H1c_revolut8_black_top.png`,
  snap: `${AD}H3_snap8_black.png`, aluO: `${AD}S1_aluset_revolut8_orange.png`, tubes: `${AD}S3_carbon_tube_set_red.png`,
  never: `${AD}S5_revolut8_nevergreen.png`, bw: `${AD}S6_revolut8_black_white.png`,
};
const COLS = ['1_blue', '2_orange', '3_red', '4_purple', '5_tiffany', '6_lightgreen', '7_bronze'].map((k) => `${AD}H2_revolut8_colourway_${k}.png`);
// floor ellipse through the leg tips (fractions of the displayed PNG width; from fx_gausseholler.mjs FOOT)
const FOOT = { threeq: { cx: 0.4975, cy: 0.789, a: 0.473, b: 0.265 }, front: { cx: 0.493, cy: 0.805, a: 0.453, b: 0.087 }, cw: { cx: 0.5095, cy: 0.87, a: 0.526, b: 0.365 } };

// EB Garamond (assets/fonts, fontsource latin + latin-ext): Cormorant Garamond's latin-ext glyphs carry the caron at cap height
// („Rucˇneˇ“, review 22. 10. M1) — Czech serif line therefore uses EB Garamond 600 with proper č/ě.
export const fonts = { 'EB Garamond': { s: { 600: 'eb-garamond-{r}-600-normal' }, dir: 'bannery' } };

export function css(E) {
  return `
.gh-bg{background:radial-gradient(130% 75% at 50% -8%,#262a30 0%,#14171a 46%,#0b0c0e 100%)}
.gh-cone{position:absolute;top:-4%;height:90%;background:linear-gradient(180deg,rgba(255,255,255,.13),rgba(255,255,255,.035) 70%,rgba(255,255,255,0));clip-path:polygon(38% 0,62% 0,100% 100%,0 100%);filter:blur(26px)}
.gh-floor{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(180deg,rgba(255,255,255,.035),rgba(255,255,255,0) 60%),radial-gradient(60% 50% at 50% 0%,rgba(255,255,255,.05),rgba(0,0,0,0));border-top:1px solid rgba(40,45,51,.8)}
.gh-k{font-family:Inter;font-weight:600;text-transform:uppercase;letter-spacing:.28em;color:${C.ice}}
.gh-h{font-family:Inter;font-weight:800;text-transform:uppercase;letter-spacing:-.015em;color:${C.white};line-height:1}
.gh-h em{font-style:normal;color:${C.orange}}
.gh-s{font-family:'EB Garamond';font-weight:600;color:${C.bone};line-height:1.1}
.gh-p{font-family:Inter;font-weight:600;color:${C.bone};line-height:1.22;white-space:normal}
.gh-pt{position:absolute;border-radius:50%;background:radial-gradient(ellipse at 50% 38%,#2c3036 0%,#17191d 62%,#0d0e10 100%)}
.gh-pf{position:absolute;left:0;right:0;background:linear-gradient(180deg,#121417,#060708)}
.gh-pr{position:absolute;left:0;right:0;border-radius:50%;border:2px solid transparent;border-bottom-color:${C.orange};opacity:.9}
.gh-pl{position:absolute;left:0;right:0;text-align:center;font-family:Inter;font-weight:600;text-transform:uppercase;letter-spacing:.32em;color:rgba(233,230,226,.72);white-space:nowrap}
.gh-sw{position:absolute;overflow:hidden;-webkit-mask-size:100% 100%;mask-size:100% 100%;mix-blend-mode:screen;pointer-events:none}
.gh-sw i{position:absolute;top:0;bottom:0;left:-130%;width:70%;background:linear-gradient(100deg,rgba(255,255,255,0) 38%,rgba(255,236,220,.30) 50%,rgba(255,255,255,0) 62%)}
.gh-tile{position:absolute;border-radius:22px;background:linear-gradient(180deg,#1b1e22,#121417);border:1.5px solid ${C.line};overflow:hidden}
.gh-tl{position:absolute;left:0;right:0;text-align:center;font-family:Inter;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:${C.white}}
.gh-chipx{position:absolute;display:flex;align-items:center;gap:.55em;padding:0 .95em;border-radius:12px;border:1.5px solid ${C.line};background:rgba(22,25,28,.82);font-family:Inter;font-weight:700;color:${C.bone};white-space:nowrap}
.gh-chipx b{color:${C.orange};font-weight:800}
.gh-stamp{position:absolute;border-radius:50%;border:2.5px solid ${C.orange};display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-family:Inter;font-weight:800;text-transform:uppercase;color:${C.white};line-height:1.05;background:rgba(15,17,19,.7)}
.gh-stamp small{display:block;font-weight:600;letter-spacing:.14em;color:${C.orange}}
`;
}

// ---------- helpers ----------
const R1 = (n) => Math.round(n * 10) / 10;
function studio(E, { cone = 1, floorY = null, cx = null } = {}) {
  const x = cx ?? E.W / 2, cw = E.W * 0.95;
  return `<div class="full gh-bg"></div><div class="gh-cone" style="left:${R1(x - cw / 2)}px;width:${R1(cw)}px;opacity:${cone}"></div>${floorY != null ? `<div class="gh-floor" style="top:${R1(floorY)}px"></div>` : ''}`;
}
// stand on a plinth in the render's perspective. The product width is the largest that keeps the product top ≥ `top`
// (text above stays free) and ≤ maxW / native size. baseY = bottom of the plinth front face; F.y = plinth top-ellipse centre.
function stand(E, { k = 'threeq', cx, right, baseY, top, maxW = 2000, h = 70, label = '', labelSize = 22, id = 'st', inAttr = 'data-in="rise" data-d="0.05"', sweep = true, m = 1.16 }) {
  const src = P[k] || k, fk = FOOT[k] ? k : 'cw', F = FOOT[fk];
  const [nw, nh] = E.dims(src);
  const ww = Math.min(maxW, nw, top != null ? (baseY - h - top) / (F.b * m + F.cy) : 1e9), hh = ww * nh / nw;
  const A = F.a * ww * m, B = F.b * ww * m, fy = baseY - h - B;
  if (right != null) cx = right - A;
  const px0 = cx - F.cx * ww, py0 = fy - F.cy * ww;
  const plinth = `<div class="abs" style="left:${R1(cx - A)}px;top:${R1(fy - B)}px;width:${R1(2 * A)}px;height:${R1(2 * B + h)}px">
    <i class="gh-pf" style="top:${R1(B)}px;height:${R1(B + h)}px;border-radius:0 0 50% 50% / 0 0 ${R1(B)}px ${R1(B)}px"></i>
    <i class="gh-pt" style="left:0;right:0;top:0;height:${R1(2 * B)}px"></i>
    <i class="gh-pr" style="top:-1px;height:${R1(2 * B + 2)}px"></i>
    ${label ? `<div class="gh-pl" style="top:${R1(2 * B + (h - labelSize * 1.2) / 2)}px;font-size:${labelSize}px">${E.t(label)}</div>` : ''}</div>`;
  const shadow = `<div class="abs" style="left:${R1(cx - A)}px;top:${R1(fy - B)}px;width:${R1(2 * A)}px;height:${R1(2 * B)}px;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.75),rgba(0,0,0,.35) 62%,rgba(0,0,0,0))"></div>`;
  const url = E.src(src);
  const prod = `<div class="abs" id="${id}" ${inAttr} style="left:${R1(px0)}px;top:${R1(py0)}px;width:${R1(ww)}px;height:${R1(hh)}px">
    <img src="${url}" alt="" style="position:absolute;inset:0;width:100%;height:100%">
    ${sweep ? `<div class="gh-sw" style="inset:0;-webkit-mask-image:url(${url});mask-image:url(${url})"><i data-sweep="0.35,1.35"></i></div>` : ''}</div>`;
  return { html: shadow + plinth + prod, top: py0, left: px0, w: ww, h: hh, cx, A, plinthTop: fy - B, plinthL: cx - A };
}
// stacked spec chips (verified facts) — fill the column the old GH logo block used to take
function specChips(E, { x, y, size, rows, d = 0.3, gap = 12 }) {
  const h = size * 1.9;
  return { html: rows.map(([a, c], i) => `<div class="gh-chipx t" data-in="left" data-d="${(d + i * 0.08).toFixed(2)}" style="left:${R1(x)}px;top:${R1(y + i * (h + gap))}px;height:${R1(h)}px;font-size:${size}px"><b>${E.t(a)}</b>${E.t(c)}</div>`).join(''), h: rows.length * (h + gap) - gap };
}
const SPEC = [['8', 'karbonových tubusů'], ['Ø 32 × 200', 'mm'], ['Série 5 ks', 'číslováno']];
const T = (E, { cls, x, y, w, size, text, html, align = 'left', fit = 0, lines = 0, main = false, inAttr = '', style = '', id = '' }) =>
  `<div ${id ? `id="${id}" ` : ''}class="t ${cls}${main ? ' main' : ''}" ${inAttr} ${fit ? `data-fit="${fit}"` : ''} ${lines ? `data-lines="${lines}"` : ''} style="left:${R1(x)}px;top:${R1(y)}px;width:${R1(w)}px;font-size:${size}px;text-align:${align};${lines ? 'white-space:normal;' : 'overflow:hidden;'}${style}">${html ?? E.t(text)}</div>`;

// 16:9 assortment: headline column left, the four lines as a 2 × 2 tile grid right (Revolut 8 tile cycles its colours)
function rangeWide(E) {
  const b = E.body;
  let html = studio(E, { cone: 0.6, cx: E.W * 0.7 });
  const colW = 380, y0 = b.y + Math.max(0, (b.h - 250) / 2);
  html += T(E, { cls: 'gh-k', x: b.x, y: y0, w: colW, size: 20, fit: 14, text: 'Sortiment Custom Lab', inAttr: 'data-in="left"' });
  html += T(E, { cls: 'gh-h', x: b.x - 3, y: y0 + 36, w: colW, size: 62, lines: 3, html: `${E.t('Stojany,')}<br>${E.t('díly')}<br>${E.t('i zakázky')}`, style: 'line-height:1.05', inAttr: 'data-in="up" data-d=".06"', main: true });
  const gx = b.x + colW + 30, gap = 16, tw = (b.r - gx - gap) / 2, th = (b.h - gap) / 2, lab = 24;
  const tiles = [{ label: 'Revolut 8', cyc: true }, { label: 'Snap 8', src: P.snap }, { label: 'Hliníkové díly', src: P.aluO }, { label: 'Karbonové tubusy', src: P.tubes }];
  tiles.forEach((tl, i) => {
    const x = gx + (i % 2) * (tw + gap), y = b.y + Math.floor(i / 2) * (th + gap);
    const ih = th - lab * 1.9 - 14, iw = tw - 40;
    const inner = tl.cyc
      ? `<div class="abs" data-cycle="0.26" data-d="0.15" data-rest="1" style="left:0;top:0;width:${R1(tw)}px;height:${R1(th)}px">${COLS.map((c) => `<div class="cy">${E.img(c, { cx: tw / 2, cy: 10 + ih / 2, h: ih, w: iw }).html}</div>`).join('')}</div>`
      : E.img(tl.src, { cx: tw / 2, cy: 10 + ih / 2, h: ih, w: iw }).html;
    html += `<div class="gh-tile" data-in="up" data-dist="34" data-d="${(0.12 + i * 0.07).toFixed(2)}" style="left:${R1(x)}px;top:${R1(y)}px;width:${R1(tw)}px;height:${R1(th)}px">${inner}<div class="gh-tl t" style="top:${R1(th - lab * 1.6)}px;font-size:${lab}px;left:0;width:${R1(tw)}px">${E.t(tl.label)}</div></div>`;
  });
  return { html };
}

// ---------- scenes ----------
// every scene: background → products → text (text always on top); products are sized to the space the text leaves free
export const scenes = {
  // POSTER (static 1:1 / 4:5 / 1.91:1 / 9:16 + loop start/end): the prize stand as the hero
  poster(E) {
    const b = E.body, k = E.kind;
    let txt = '';
    if (k === 'wide') {
      const colW = 640, blockH = 300, y0 = b.y + Math.max(0, (b.h - blockH) / 2);
      const st = stand(E, { right: b.r - 6, baseY: b.b, top: b.y + 4, h: 40, maxW: 380, label: 'Black Standard Edition', labelSize: 13 });
      txt += T(E, { cls: 'gh-k', x: b.x, y: y0, w: colW, size: 24, text: 'Stojan na pruty', inAttr: 'data-in="left" data-d=".1"' });
      txt += T(E, { cls: 'gh-h', x: b.x - 3, y: y0 + 40, w: colW, size: 132, fit: 60, html: 'Revolut&nbsp;<em>8</em>', inAttr: 'data-in="slam" data-d=".15"', main: true });
      txt += T(E, { cls: 'gh-s', x: b.x, y: y0 + 186, w: colW, size: 48, text: 'Ručně stavěno v Česku', inAttr: 'data-in="up" data-d=".3"', main: true });
      txt += T(E, { cls: 'gh-k', x: b.x, y: y0 + 256, w: colW, size: 20, text: 'Karbon · hliník · série 5 kusů, číslováno', style: `color:${C.bone};letter-spacing:.16em`, inAttr: 'data-in="up" data-d=".38"' });
      return { html: studio(E, { cx: st.cx, floorY: st.plinthTop + 20 }) + st.html + txt };
    }
    if (k === 'square') {
      const S = { kick: 28, head: 150, sub: 46, label: 20, ph: 56 };
      let y = b.y + 4;
      txt += T(E, { cls: 'gh-k', x: b.x, y, w: b.w, size: S.kick, text: 'Stojan na pruty', inAttr: 'data-in="left" data-d=".08"' });
      y += S.kick * 1.55;
      txt += T(E, { cls: 'gh-h', x: b.x - 5, y, w: b.w, size: S.head, fit: 80, html: 'Revolut&nbsp;<em>8</em>', inAttr: 'data-in="slam" data-d=".12"', main: true });
      const headB = y + S.head;
      y = headB + 8;
      txt += T(E, { cls: 'gh-s', x: b.x, y, w: 520, size: S.sub, text: 'Ručně stavěno v Česku', inAttr: 'data-in="up" data-d=".3"', main: true });
      const ch = specChips(E, { x: b.x, y: 0, size: 26, rows: SPEC });
      txt += specChips(E, { x: b.x, y: b.b - ch.h - 6, size: 26, rows: SPEC, d: 0.38 }).html;
      const st = stand(E, { right: b.r + 4, baseY: b.b, top: headB + 6, h: S.ph, maxW: 600, label: 'Black Standard Edition', labelSize: S.label });
      return { html: studio(E, { cx: st.cx, floorY: st.plinthTop + 30 }) + st.html + txt };
    }
    // portrait / tall: big stand tucked behind the lower part of the headline; the crafted line is engraved on the plinth face
    const S = k === 'tall' ? { kick: 32, k2: 30, head: 200, sub: 50, ph: 96, maxW: 900 } : { kick: 30, k2: 28, head: 176, sub: 46, ph: 86, maxW: 820 };
    let y = b.y + (k === 'tall' ? 24 : 4);
    txt += T(E, { cls: 'gh-k', x: b.x, y, w: b.w, size: S.kick, text: 'Stojan na pruty', inAttr: 'data-in="left" data-d=".08"' });
    y += S.kick * 1.55;
    txt += T(E, { cls: 'gh-h', x: b.x - 6, y, w: b.w, size: S.head, fit: 80, html: 'Revolut&nbsp;<em>8</em>', inAttr: 'data-in="slam" data-d=".12"', main: true });
    const headB = y + S.head;
    txt += T(E, { cls: 'gh-k', x: b.x, y: headB + 4, w: b.w * 0.75, fit: 16, size: S.k2, text: 'Black Standard Edition', style: `color:${C.bone};letter-spacing:.2em`, inAttr: 'data-in="up" data-d=".26"' });
    // stand starts below the „Black Standard Edition“ line (review M2: the handle used to cover „EDITION“ — text always above product)
    const st = stand(E, { cx: E.W / 2 + 40, baseY: b.b, top: headB + 4 + S.k2 * 1.45, h: S.ph, maxW: S.maxW, label: '', id: 'st' });
    // engraved line on the plinth front face (a .t text → QA checks it)
    const faceY = b.b - S.ph + (S.ph - S.sub * 1.1) / 2;
    txt += T(E, { cls: 'gh-s', x: st.cx - 400, y: faceY, w: 800, size: S.sub, align: 'center', text: 'Ručně stavěno v Česku', inAttr: 'data-in="fade" data-d=".35"', main: true, style: 'color:rgba(233,230,226,.92)' });
    return { html: studio(E, { cx: st.cx, floorY: st.plinthTop + 30 }) + st.html + txt };
  },

  // 1 — WHO: Czech workshop, hand-built stands (verified one-liner)
  who(E) {
    const b = E.body, sq = E.kind === 'square';
    let html = studio(E, { cx: E.W * 0.72, cone: 0.8 });
    html += E.img(P.top, { cx: E.W * 0.76, cy: b.y + b.h * 0.52, h: b.h * 1.1, style: 'opacity:.85', attrs: 'data-kb="1.05,1"' }).html;
    html += `<div class="full" style="background:linear-gradient(90deg,rgba(11,12,14,.97) 0%,rgba(11,12,14,.9) 40%,rgba(11,12,14,.25) 70%,rgba(11,12,14,0))"></div>`;
    const hs = sq ? 112 : 124, blockH = hs * 1.06 + 34 * 2.2 + (sq ? 46 : 50) * 1.22 * 3 + 30 + 30;
    const y0 = b.y + Math.max(6, (b.h - blockH) / 2 - 10);
    let y = y0;
    html += T(E, { cls: 'gh-h', x: b.x - 3, y, w: b.w * 0.8, size: hs, fit: 50, text: 'Gausse Holler', inAttr: 'data-in="left" data-d=".1"', main: true });
    y += hs * 1.06;
    html += T(E, { cls: 'gh-k', x: b.x, y, w: b.w * 0.7, size: 34, text: 'Custom Lab', style: 'font-family:Jost;font-weight:500;letter-spacing:.5em', inAttr: 'data-in="left" data-d=".18"' });
    y += 34 * 2.2;
    html += T(E, { cls: 'gh-p', x: b.x, y, w: b.w * 0.6, size: sq ? 46 : 50, lines: 4, text: 'Česká dílna, která ručně staví stojany na pruty z karbonu a hliníku.', inAttr: 'data-in="up" data-d=".28"', main: true });
    y += (sq ? 46 : 50) * 1.22 * 3 + 30;
    html += T(E, { cls: 'gh-k', x: b.x, y, w: b.w * 0.8, size: 26, text: 'Ručně stavěno v Česku · dodání po celé EU', style: `color:${C.orange};letter-spacing:.14em`, inAttr: 'data-in="up" data-d=".4"' });
    return { html };
  },

  // 2 — RANGE: own lines (stands, parts, tubes, made to order); Revolut 8 tile cycles its anodised colours (no count on screen)
  range(E) {
    const b = E.body, sq = E.kind === 'square';
    if (E.kind === 'wide') return rangeWide(E);
    let html = studio(E, { cone: 0.6 });
    const hs = sq ? 74 : 82;
    html += T(E, { cls: 'gh-k', x: b.x, y: b.y + 4, w: b.w, size: 28, text: 'Sortiment Custom Lab', inAttr: 'data-in="left"' });
    html += T(E, { cls: 'gh-h', x: b.x - 3, y: b.y + 46, w: b.w, size: hs, fit: 44, text: 'Stojany, díly i zakázky', inAttr: 'data-in="up" data-d=".06"', main: true });
    const gy = b.y + 46 + hs * 1.22, gap = 18, gh = b.b - gy, tw = (b.w - gap) / 2, th = (gh - gap) / 2, lab = sq ? 32 : 36;
    const tiles = [
      { label: 'Revolut 8', cyc: true },
      { label: 'Snap 8', src: P.snap },
      { label: 'Hliníkové díly', src: P.aluO },
      { label: 'Karbonové tubusy', src: P.tubes },
    ];
    tiles.forEach((tl, i) => {
      const x = b.x + (i % 2) * (tw + gap), y = gy + Math.floor(i / 2) * (th + gap);
      const ih = th - lab * 1.9 - 18, iw = tw - 40;
      let inner;
      if (tl.cyc) inner = `<div class="abs" data-cycle="0.26" data-d="0.15" data-rest="1" style="left:0;top:0;width:${R1(tw)}px;height:${R1(th)}px">${COLS.map((c) => `<div class="cy">${E.img(c, { cx: tw / 2, cy: 14 + ih / 2, h: ih, w: iw }).html}</div>`).join('')}</div>`;
      else inner = E.img(tl.src, { cx: tw / 2, cy: 14 + ih / 2, h: ih, w: iw }).html;
      html += `<div class="gh-tile" data-in="up" data-dist="34" data-d="${(0.12 + i * 0.07).toFixed(2)}" style="left:${R1(x)}px;top:${R1(y)}px;width:${R1(tw)}px;height:${R1(th)}px">${inner}<div class="gh-tl t" style="top:${R1(th - lab * 1.6)}px;font-size:${lab}px;left:0;width:${R1(tw)}px">${E.t(tl.label)}</div></div>`;
    });
    return { html };
  },

  // 3 — HERO: Revolut 8 Black Standard Edition, verified spec (8 tubes Ø 32 × 200 mm, series of 5, numbered)
  hero(E) {
    const b = E.body, sq = E.kind === 'square';
    let txt = '';
    if (E.kind === 'wide') {
      // 16:9: spec column left, the front view of the stand on its plinth right
      const colW = 560, y0 = b.y + Math.max(0, (b.h - 330) / 2);
      txt += T(E, { cls: 'gh-k', x: b.x, y: y0, w: colW, size: 20, fit: 14, text: 'Revolut 8 · Black Standard Edition', inAttr: 'data-in="left"' });
      txt += T(E, { cls: 'gh-h', x: b.x - 3, y: y0 + 36, w: colW, size: 88, fit: 50, html: 'Karbon <em>+</em> hliník', inAttr: 'data-in="slam" data-d=".06"', main: true });
      SPEC.forEach(([a, c], i) => {
        txt += `<div class="gh-chipx t" data-in="left" data-d="${(0.18 + i * 0.08).toFixed(2)}" style="left:${R1(b.x)}px;top:${R1(y0 + 150 + i * (24 * 1.9 + 12))}px;height:${R1(24 * 1.9)}px;font-size:24px"><b>${E.t(a)}</b>${E.t(c)}</div>`;
      });
      const st = stand(E, { k: 'front', right: b.r + 10, baseY: b.b, top: b.y + 2, h: 40, maxW: 520, inAttr: 'data-in="rise" data-d=".02"' });
      return { html: studio(E, { cx: st.cx, floorY: st.plinthTop + 20 }) + st.html + txt };
    }
    const hs = sq ? 108 : 120;
    txt += T(E, { cls: 'gh-k', x: b.x, y: b.y + 4, w: b.w, size: 28, text: 'Revolut 8 · Black Standard Edition', inAttr: 'data-in="left"' });
    txt += T(E, { cls: 'gh-h', x: b.x - 4, y: b.y + 46, w: b.w, size: hs, fit: 60, html: 'Karbon <em>+</em> hliník', inAttr: 'data-in="slam" data-d=".06"', main: true });
    const top = b.y + 46 + hs * 1.08;
    const chips = [['8', 'karbonových tubusů'], ['Ø 32 × 200', 'mm'], ['Série 5 ks', 'číslováno']];
    const cs = sq ? 30 : 34, chH = cs * 1.9;
    chips.forEach(([a, c], i) => {
      txt += `<div class="gh-chipx t" data-in="left" data-d="${(0.18 + i * 0.08).toFixed(2)}" style="left:${R1(b.x)}px;top:${R1(top + 12 + i * (chH + 14))}px;height:${R1(chH)}px;font-size:${cs}px"><b>${E.t(a)}</b>${E.t(c)}</div>`;
    });
    const st = stand(E, { k: 'front', right: b.r + 30, baseY: b.b, top: top + 6, h: sq ? 50 : 62, maxW: sq ? 620 : 720, inAttr: 'data-in="rise" data-d=".02"' });
    return { html: studio(E, { cx: st.cx, floorY: st.plinthTop + 20 }) + st.html + txt };
  },

  // 4 — MČR: the main prize for the winner + partner role (chip + role line come from the engine chrome)
  mcr(E) {
    const b = E.body, sq = E.kind === 'square';
    let txt = '';
    if (E.kind === 'wide') {
      // 16:9: the prize line left, the stand on its plinth right
      const colW = 600, y0 = b.y + Math.max(0, (b.h - 300) / 2) - 10;
      txt += T(E, { cls: 'gh-k', x: b.x, y: y0, w: colW, size: 20, fit: 14, text: 'Mistrovství ČR v Trout Area 2026', style: `color:${C.orange}`, inAttr: 'data-in="left"' });
      txt += T(E, { cls: 'gh-h', x: b.x - 4, y: y0 + 36, w: colW, size: 104, fit: 60, text: 'Hlavní cena', inAttr: 'data-in="slam" data-d=".06"', main: true });
      txt += T(E, { cls: 'gh-s', x: b.x, y: y0 + 150, w: colW, size: 44, fit: 30, text: 'Revolut 8 pro vítěze mistrovství', inAttr: 'data-in="up" data-d=".2"', main: true });
      const rows = [['Black', 'Standard Edition'], ['Série 5 ks', 'číslováno']];
      txt += specChips(E, { x: b.x, y: y0 + 228, size: 22, rows, d: 0.3 }).html;
      const st = stand(E, { right: b.r - 6, baseY: b.b, top: b.y + 4, h: 40, maxW: 400, label: 'Revolut 8', labelSize: 15 });
      return { html: studio(E, { floorY: st.plinthTop + 20, cone: 1.3, cx: st.cx }) + st.html + txt };
    }
    const head = sq ? 136 : 156, sub = sq ? 48 : 56;
    txt += T(E, { cls: 'gh-k', x: b.x, y: b.y + 4, w: b.w, size: 28, text: 'Mistrovství ČR v Trout Area 2026', style: `color:${C.orange}`, inAttr: 'data-in="left"' });
    txt += T(E, { cls: 'gh-h', x: b.x - 5, y: b.y + 46, w: b.w, size: head, fit: 70, text: 'Hlavní cena', inAttr: 'data-in="slam" data-d=".06"', main: true });
    const sy = b.y + 46 + head * 1.04;
    txt += T(E, { cls: 'gh-s', x: b.x, y: sy, w: b.w, size: sub, text: 'Revolut 8 pro vítěze mistrovství', inAttr: 'data-in="up" data-d=".2"', main: true });
    const st = stand(E, { right: b.r + 10, baseY: b.b, top: sy + sub * 1.25 + 10, h: sq ? 52 : 66, maxW: 620, label: 'Revolut 8', labelSize: sq ? 22 : 24 });
    const rows = [['Black', 'Standard Edition'], ['Série 5 ks', 'číslováno']], cs = sq ? 28 : 30;
    const ch = specChips(E, { x: b.x, y: 0, size: cs, rows });
    txt += specChips(E, { x: b.x, y: b.b - ch.h - 6, size: cs, rows, d: 0.3 }).html;
    return { html: studio(E, { floorY: st.plinthTop + 30, cone: 1.3, cx: st.cx }) + st.html + txt };
  },
};
