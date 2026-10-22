// ACTIVEFISHING.CZ — sponsor module for the MČR 2026 banner engine (role: sponsor → chip „Věnuje ceny · MČR 2026“).
// World = the film block (mcr-2026-sponzori/scripts/blocks/activefishing.mjs + scripts/lib/fx_activefishing.mjs, concept B „COLOUR DROP“):
// the shop's own white world (paper sweep + warm orange key light), the logo's orange gradient #E39025→#DF5942 for numbers and light,
// Saira Extra Condensed 900 (echo of the logo lettering) for numbers / short caps, Nunito (site font) for text, orange pill buttons,
// white shop cards / „Prodávané značky“ logo cards. Black header + footer bars (site --color-primary #000) carry the engine chrome,
// so the white-TROUT TA logo sits on black (no halo smudge on white paper).
// Facts only from research/activefishing*.md (Verification) + vo/script_cs.json + data/blocks/activefishing.json:
//   „Pro všechny, kdo milují přívlač“ (homepage) · e-shop Stanislava Lukáška (/o-nas/) · „Český e-shop pro přívlač a trout area“
//   (corrected one-liner) · PŘES 1 300 PLANDAVEK (1 340 → 1 354, 19.–21. 10.) · PŘES 770 WOBLERŮ (777 on 19. 10., 776 on 21. 10. → „přes 770“, operator 22. 10.; „770+“ next to „1 300+“) ·
//   Rychlost doručení · Unikátní sortiment · Osobní přístup (homepage benefits) · menu: plandavky · woblery · pruty.
//   Brands are THIRD-PARTY brands the shop sells („v nabídce“, never „vlastní“); never „jen japonské“. No prices, no gram weight on Khor.
//   Copy rule (CD review): never „PŘES“ + „1 300+“ together.

export const brand = {
  name: 'Activefishing.cz',
  url: 'activefishing.cz',
  role: 'sponsor',
};

const C = { o1: '#E39025', o2: '#E2812D', o3: '#DD603A', o4: '#DF5942', web: '#F28A27', web2: '#F59B10', ink: '#111111', paper: '#f4f3f1', grey: '#4a4a4a' };
const GRAD = `linear-gradient(180deg,${C.o1} 0%,${C.o2} 38%,${C.o3} 74%,${C.o4} 100%)`;
const BTN = 'linear-gradient(180deg,#F59A2C 0%,#F28A27 45%,#E5702D 100%)';
const SAIRA = "'Saira Extra Condensed'";

export const theme = {
  bg: '#0b0b0b',
  taTone: 'dark',             // TA logo sits on the black header bar
  chrome: {
    url: C.web, urlFont: "'Nunito'", urlW: 900, sub: 'rgba(255,255,255,.8)', dot: '#ffffff',
    chipBg: BTN, chipFg: '#ffffff', chipLine: 'rgba(255,255,255,0)', event: 'rgba(255,255,255,.9)',
    shadow: '0 1px 2px rgba(0,0,0,.5)',
  },
};

// 10 s seamless loop: poster at rest on frame 0 and at the end
export const anim = {
  seq: [
    { scene: 'poster', d: 2.2 },
    { scene: 'range', d: 2.1 },
    { scene: 'hero', d: 2.0 },
    { scene: 'mcr', d: 1.8 },
    { scene: 'poster', d: 1.9 },
  ],
};
export const fonts = {};   // Saira Extra Condensed, Nunito, Montserrat are in the engine registry

// ---------- assets (film cut-outs; bb = visible box alpha > 100, px) ----------
const AD = 'film:assets_prep/activefishing/ads/', HE = 'film:assets_prep/activefishing/heroes/', BRD = 'film:assets_prep/activefishing/brands/';
const P = {
  chart: { f: `${AD}H1_timon_chibi_futten_fs_tropical_chart_pink.png`, bb: [13, 12, 2388, 938], name: 'Tropical Chart Pink', dot: '#f7385c', tint: '#ffc2d2' },
  cobalt: { f: `${AD}S1_timon_chibi_futten_fs_uv_cobalt_blue.png`, bb: [17, 17, 706, 296], name: 'UV Cobalt Blue', dot: '#034a9e', tint: '#c4d8fb' },
  gold: { f: `${AD}S3_timon_chibi_futten_fs_gold_shower.png`, bb: [17, 17, 744, 313], name: 'Gold Shower', dot: '#a8862f', tint: '#f1dd9e' },
  red: { f: `${AD}S2_timon_chibi_futten_fs_red_black_glitter.png`, bb: [16, 18, 711, 300], name: 'Red Black Glitter', dot: '#a3262b', tint: '#f6c2c4' },
  holo: { f: `${AD}S4_timon_chibi_futten_fs_hologram_bait.png`, bb: [17, 17, 729, 322], name: 'Hologram Bait', dot: '#b4976b', tint: '#e9dcc6' },
  sofia: { f: `${AD}H2_nories_sofia_1-2g_sk017_hot_mango_pair.png`, bb: [12, 12, 2388, 1694] },
  varivas: { f: `${AD}H3_varivas_super_trout_area_es2_ester_natural.png`, bb: [17, 17, 1131, 870] },
  forte15: { f: `${AD}S5_velvet_arts_forte_1-5g_no1.png`, bb: [16, 16, 484, 300] },
  panicra: { f: `${AD}S6_timon_micro_panicra_mr-f_rattle_yazy_pellet_san.png`, bb: [17, 17, 517, 200] },
  mukai: { f: `${AD}S7_mukai_upward_zanmu_35s_6ck.png`, bb: [14, 14, 1785, 917] },
  scheila: { f: `${AD}S8_valkein_scheila_1-8g_no80_delicious_peach.png`, bb: [17, 17, 554, 345] },
  forte06: { f: `${AD}S9_velvet_arts_forte_0-6g_no31_clean.png`, bb: [21, 22, 684, 335] },
  khor: { f: `${HE}h02_khor_frea.png`, bb: [17, 16, 370, 511] },
  wah: { f: `${HE}h04_luckycraft_wah33f.png`, bb: [22, 22, 717, 326] },
};
const CW = ['chart', 'cobalt', 'gold', 'red', 'holo'];   // Timon Chibi Futten FS colourways (same model, same pose)
// third-party brands the shop sells (research/activefishing_brands.md); wm = typed wordmark (no logo file: Montserrat 800, never their artwork)
const BR = {
  nories: { f: 'nories.png', bb: [7, 6, 1460, 526] }, timon: { wm: 'TIMON', sub: 'by JACKALL' }, mukai: { f: 'mukai.png', bb: [6, 6, 801, 415] },
  valkein: { f: 'valkein.png', bb: [7, 7, 1764, 531], s: 0.86 }, varivas: { f: 'varivas.png', bb: [5, 6, 2395, 518], s: 0.74 }, yarie: { f: 'yarie.png', bb: [0, 0, 394, 128] },
  velvetarts: { f: 'velvetarts.png', bb: [7, 6, 1188, 526] }, forest: { f: 'forest.png', bb: [4, 4, 280, 122] },
  officeeucalyptus: { f: 'officeeucalyptus.png', bb: [6, 6, 193, 82] }, rodiocraft: { f: 'rodiocraft.png', bb: [0, 0, 1200, 260] },
};
// brand strip on the poster (operator 22. 10.: „vyveď jejich značky“) — order = research/activefishing_brands.md rank;
// third-party brands the shop SELLS, shown next to the shop logo on the paper (original colours, Timon = typed wordmark)
const STRIP = [{ f: `${BRD}nories.png`, s: 1.05 }, { wm: 'Timon', sub: 'by Jackall', s: 0.9 }, { f: `${BRD}mukai.png`, s: 0.95 }, { f: `${BRD}valkein.png` }, { f: `${BRD}varivas.png`, s: 0.9 }, { f: `${BRD}yarie.png`, s: 0.85 }];
const strip = (E, o) => E.brandStrip(STRIP, { label: 'V nabídce', labelPos: 'top', labelCss: `font-family:Nunito;font-weight:900;letter-spacing:.14em;color:${C.grey}`, color: C.ink, inAttr: 'data-in="up" data-d=".3" data-dist="30"', align: 'justify', ...o });
// shop logo + brand strip in one bottom row of the body; returns html + top of the row
function logoRow(E, { sh, gap = 40, labelSize = 18, logoMaxH = 999 }) {
  const b = E.body, L = afLogo(E, { x: 0, y: 0, maxH: logoMaxH });
  const rowH = Math.max(L.h, sh + labelSize * 1.6), top = b.b - rowH - 4;
  let h = afLogo(E, { x: b.x, y: top + (rowH - L.h) / 2, maxH: logoMaxH }).html;
  const sx = b.x + L.w + gap, o = { w: b.r - sx, h: sh, labelSize };
  const st = strip(E, { x: 0, y: 0, ...o });
  h += `<i class="abs" style="left:${R1(sx - gap / 2)}px;top:${R1(top + 6)}px;width:2px;height:${R1(rowH - 12)}px;background:rgba(17,17,17,.14)"></i>`;
  h += strip(E, { x: sx, y: top + (rowH - st.h) / 2, ...o }).html;
  return { html: h, top };
}
const LOGO = 'film:assets_prep/activefishing/logo_on_light.png', LOGO_TRIM = [32, 32, 1599, 666];

export function css() {
  return `
.af-paper{background:radial-gradient(130% 85% at 50% 40%,#ffffff 0%,#f5f4f1 52%,#e6e3de 100%)}
.af-glow{position:absolute;border-radius:50%;background:radial-gradient(closest-side,rgba(245,155,16,.30),rgba(242,138,39,.10) 55%,rgba(242,138,39,0))}
.af-bar{position:absolute;left:0;right:0;background:radial-gradient(70% 140% at 85% 0%,#2a1a0e 0%,#111 55%,#0b0b0b 100%)}
.af-bar.ft{background:radial-gradient(70% 160% at 15% 100%,#2a1a0e 0%,#111 55%,#0b0b0b 100%)}
.af-line{position:absolute;left:0;right:0;height:6px;background:linear-gradient(90deg,${C.o1},${C.o2} 40%,${C.o3} 75%,${C.o4})}
.af-p{position:absolute}
.af-p img{position:absolute;inset:0;width:100%;height:100%;display:block}
.af-sw{position:absolute;inset:0;overflow:hidden;-webkit-mask-size:100% 100%;mask-size:100% 100%;mix-blend-mode:screen;pointer-events:none}
.af-sw i{position:absolute;top:0;bottom:0;left:-130%;width:70%;background:linear-gradient(105deg,rgba(255,255,255,0) 38%,rgba(255,250,240,.55) 50%,rgba(255,255,255,0) 62%)}
.af-sh{position:absolute;border-radius:50%;background:radial-gradient(closest-side,rgba(78,48,20,.26),rgba(78,48,20,0))}
.af-k{font-family:Nunito;font-weight:900;text-transform:uppercase;letter-spacing:.14em;color:${C.ink};line-height:1}
.af-tag{display:flex;align-items:center;gap:.5em}
.af-tag:before{content:"";display:block;flex:none;width:.3em;height:1.05em;border-radius:.15em;background:${GRAD}}
.af-h{font-family:${SAIRA};font-weight:900;text-transform:uppercase;color:${C.ink};line-height:.98;padding-top:.16em;margin-top:-.16em;letter-spacing:.01em;word-spacing:.12em}
.af-n{font-family:${SAIRA};font-weight:900;text-transform:uppercase;line-height:1.04;padding-top:.16em;margin-top:-.16em;letter-spacing:.005em;word-spacing:.12em;color:${C.ink}}
.af-g{background-image:${GRAD};-webkit-background-clip:text;background-clip:text;color:transparent}
.af-s{font-family:Nunito;font-weight:800;color:${C.grey};line-height:1.2}
.af-url{font-family:Nunito;font-weight:1000;letter-spacing:-.02em;color:${C.ink};line-height:1.1}
.af-url b{color:${C.web};font-weight:1000}
.af-pill{display:flex;align-items:center;justify-content:center;border-radius:999px;font-family:Nunito;font-weight:900;text-transform:uppercase;letter-spacing:.06em;line-height:1;white-space:nowrap}
.af-pill.fill{background:${BTN};color:#fff;box-shadow:0 12px 26px rgba(223,89,66,.30)}
.af-pill.ol{background:#fff;color:${C.ink};box-shadow:inset 0 0 0 3px ${C.web},0 8px 20px rgba(80,50,20,.10)}
.af-card{position:absolute;border-radius:26px;background:#fff;box-shadow:0 16px 34px rgba(60,40,20,.12),0 0 0 1px rgba(0,0,0,.04)}
.af-card i.pr{position:absolute;display:block;background:center/100% 100% no-repeat;filter:drop-shadow(0 8px 10px rgba(90,40,10,.18))}
.af-brand{position:absolute;border-radius:20px;background:#fff;box-shadow:0 10px 24px rgba(90,40,10,.14),0 0 0 1px rgba(0,0,0,.04)}
.af-brand i{position:absolute;display:block;background:center/contain no-repeat}
.af-brand b{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Montserrat;font-weight:800;letter-spacing:.04em;line-height:1;color:${C.ink};text-transform:uppercase;white-space:nowrap}
.af-brand small{display:block;margin-top:.3em;font-size:.4em;font-weight:600;letter-spacing:.12em;color:#555}
.af-sep{position:absolute;height:3px;border-radius:2px;background:${GRAD}}
.af-dot{display:inline-block;width:.62em;height:.62em;border-radius:50%;margin-right:.45em;vertical-align:.02em;box-shadow:inset 0 0 0 2px rgba(255,255,255,.6),0 0 0 2px rgba(0,0,0,.06)}
`;
}

// ---------- helpers ----------
const R1 = (n) => Math.round(n * 10) / 10;
const T = (E, { cls, x, y, w, size, text, html, align = 'left', fit = 0, lines = 0, main = false, inAttr = '', style = '', id = '' }) =>
  `<div ${id ? `id="${id}" ` : ''}class="t ${cls}${main ? ' main' : ''}" ${inAttr} ${fit ? `data-fit="${fit}"` : ''} ${lines ? `data-lines="${lines}"` : ''} style="left:${R1(x)}px;top:${R1(y)}px;width:${R1(w)}px;font-size:${size}px;text-align:${align};${lines ? 'white-space:normal;' : 'overflow:hidden;'}${style}">${html ?? E.t(text)}</div>`;

// white shop world + black header / footer bars (they carry the engine chrome)
function frame(E, { glow = [0.7, 0.55], glowR = 0.75 } = {}) {
  const wide = E.kind === 'wide';
  const hb = E.body.y - (wide ? 6 : 12), ft = E.chrome.chip.y - (wide ? 9 : 16);
  const gr = Math.max(E.W, E.H) * glowR;
  return `<div class="full af-paper"></div>
<div class="af-glow" style="left:${R1(E.W * glow[0] - gr)}px;top:${R1(E.H * glow[1] - gr)}px;width:${R1(gr * 2)}px;height:${R1(gr * 2)}px"></div>
<div class="af-bar" style="top:0;height:${R1(hb)}px"></div><div class="af-line" style="top:${R1(hb - 6)}px"></div>
<div class="af-bar ft" style="top:${R1(ft)}px;bottom:0"></div><div class="af-line" style="top:${R1(ft)}px"></div>`;
}

// product cut-out: visible box V px wide (or VH tall), visible centre (cx, cy), static pose rotation; never > maxUp × native
function prod(E, k, { cx, cy, V = null, VH = null, rot = 0, maxUp = 1.25, id = '', attrs = '', sweep = false, shadow = true, drop = '0 16px 18px rgba(90,40,10,.26)' }) {
  const p = P[k], [nw, nh] = E.dims(p.f), [x0, y0, x1, y1] = p.bb;
  let s = V != null ? V / (x1 - x0) : VH / (y1 - y0);
  s = Math.min(s, maxUp);
  const w = nw * s, h = nh * s, ocx = ((x0 + x1) / 2) * s, ocy = ((y0 + y1) / 2) * s, vw = (x1 - x0) * s, vh = (y1 - y0) * s;
  const url = E.src(p.f);
  const sh = shadow ? `<i class="af-sh" style="left:${R1(ocx - vw * 0.4)}px;top:${R1(ocy + vh * 0.42)}px;width:${R1(vw * 0.8)}px;height:${R1(Math.max(24, vh * 0.2))}px"></i>` : '';
  const sw = sweep ? `<div class="af-sw" style="-webkit-mask-image:url(${url});mask-image:url(${url})"><i data-sweep="0.3,1.3"></i></div>` : '';
  return {
    html: `<div class="af-p"${id ? ` id="${id}"` : ''} ${attrs} style="left:${R1(cx - ocx)}px;top:${R1(cy - ocy)}px;width:${R1(w)}px;height:${R1(h)}px;transform-origin:${R1(ocx)}px ${R1(ocy)}px;${rot ? `transform:rotate(${rot}deg);` : ''}">${sh}<img src="${url}" alt="" style="filter:drop-shadow(${drop})">${sw}</div>`,
    vw, vh, s,
  };
}
// product inside a box (contain), returns html
function prodIn(E, k, box, o = {}) {
  const p = P[k], [x0, y0, x1, y1] = p.bb, ar = (x1 - x0) / (y1 - y0);
  const fitW = ar > box.w / box.h;
  return prod(E, k, { cx: box.x + box.w / 2, cy: box.y + box.h / 2, ...(fitW ? { V: box.w } : { VH: box.h }), ...o });
}
// shop card (white rounded) with the product as background layer, optional brand logo strip on top
function card(E, { x, y, w, h, k, b = null, pad = 18, d = 0, logoH = 0 }) {
  let inner = '';
  if (b) inner += brandMark(E, b, { x: pad, y: pad * 0.8, w: w - 2 * pad, h: logoH });
  const top = b ? pad * 0.8 + logoH + 8 : pad, box = { x: pad, y: top, w: w - 2 * pad, h: h - top - pad };
  const p = P[k], [nw, nh] = E.dims(p.f), [x0, y0, x1, y1] = p.bb, ar = (x1 - x0) / (y1 - y0);
  let s = ar > box.w / box.h ? box.w / (x1 - x0) : box.h / (y1 - y0);
  s = Math.min(s, 1.2);
  const ww = nw * s, hh = nh * s, l = box.x + box.w / 2 - ((x0 + x1) / 2) * s, t = box.y + box.h / 2 - ((y0 + y1) / 2) * s;
  inner += `<i class="pr" style="left:${R1(l)}px;top:${R1(t)}px;width:${R1(ww)}px;height:${R1(hh)}px;background-image:url(${E.src(p.f)})"></i>`;
  return `<div class="af-card" data-in="up" data-dist="40" data-d="${d.toFixed(2)}" style="left:${R1(x)}px;top:${R1(y)}px;width:${R1(w)}px;height:${R1(h)}px">${inner}</div>`;
}
// brand mark (logo contained in a box, or typed wordmark) — positioned absolutely inside its parent
function brandMark(E, b, { x, y, w, h }) {
  const B = BR[b];
  if (B.wm) return `<div class="af-brand" style="left:${R1(x)}px;top:${R1(y)}px;width:${R1(w)}px;height:${R1(h)}px;background:none;box-shadow:none"><b style="font-size:${R1(h * 0.62)}px">${E.esc(B.wm)}${B.sub ? `<small>${E.esc(B.sub)}</small>` : ''}</b></div>`;
  const [nw, nh] = E.dims(BRD + B.f), [x0, y0, x1, y1] = B.bb, ar = (x1 - x0) / (y1 - y0);
  const lw = Math.min(w, h * ar, (x1 - x0)) * (B.s || 1), lh = lw / ar;
  const s = lw / (x1 - x0);
  return `<div class="abs" style="left:${R1(x + (w - lw) / 2 - x0 * s)}px;top:${R1(y + (h - lh) / 2 - y0 * s)}px;width:${R1(nw * s)}px;height:${R1(nh * s)}px;background:url(${E.src(BRD + B.f)}) center/100% 100% no-repeat"></div>`;
}
// „Prodávané značky“ logo card (white)
function brandCard(E, b, { x, y, w, h, pad = 16, d = 0, attrs = '' }) {
  const B = BR[b], s = B.wm ? 1 : 1;
  return `<div class="af-brand" ${attrs || `data-in="scale" data-d="${d.toFixed(2)}"`} style="left:${R1(x)}px;top:${R1(y)}px;width:${R1(w)}px;height:${R1(h)}px">${brandMark(E, b, { x: pad, y: pad * 0.75, w: (w - 2 * pad) * s, h: (h - 1.5 * pad) * s })}</div>`;
}
function pill(E, { x, y, text, size = 28, tone = 'ol', d = 0, h = null }) {
  const hh = h ?? size * 2;
  return `<div class="t af-pill ${tone}" data-in="up" data-dist="30" data-d="${d.toFixed(2)}" style="left:${R1(x)}px;top:${R1(y)}px;height:${R1(hh)}px;padding:0 ${R1(size * 0.9)}px;font-size:${size}px">${E.t(text)}</div>`;
}
// approximate pill width (Nunito 900 caps + tracking)
const pillW = (text, size) => text.length * size * 0.72 + size * 1.8;
function afLogo(E, { x, y, cx, maxH, maxW, attrs = 'data-in="fade" data-d=".25"' }) {
  return E.logo(LOGO, { x, y, cx, maxH, maxW, trim: LOGO_TRIM, attrs });
}

// counter lockup „PŘES · 1 300 · PLANDAVEK“ + „PŘES 770 WOBLERŮ“ (the VO verbatim; numbers in the logo gradient)
function counter(E, { x, y, w, big, d = 0, align = 'left', woblery = true }) {
  let h = '', yy = y;
  const ks = Math.max(30, Math.round(big * 0.17));
  h += T(E, { cls: 'af-k', x, y: yy, w, size: ks, text: 'Přes', align, style: 'letter-spacing:.3em', inAttr: `data-in="up" data-d="${(d).toFixed(2)}"` });
  yy += ks * 1.1;
  h += T(E, { cls: 'af-n af-g', x: x - big * 0.03, y: yy, w: w + big * 0.03, size: big, fit: 60, text: '1 300', align, main: true, inAttr: `data-in="slam" data-d="${(d + 0.05).toFixed(2)}"` });
  yy += big * 1.0;
  const ps = Math.round(big * 0.5);
  h += T(E, { cls: 'af-n', x, y: yy, w, size: ps, fit: 40, text: 'plandavek', align, main: true, inAttr: `data-in="up" data-d="${(d + 0.12).toFixed(2)}"` });
  yy += ps * 1.08;
  if (woblery) {
    const ws = Math.round(big * 0.33);   // „přes 770 woblerů“ is longer than „777 woblerů“ → keep it inside the text column
    yy += ws * 0.12;
    h += T(E, { cls: 'af-n', x, y: yy, w, size: ws, fit: 40, html: `přes <span class="af-g">770</span>&nbsp;woblerů`, align, main: true, inAttr: `data-in="up" data-d="${(d + 0.2).toFixed(2)}"` });
    yy += ws * 1.08;
  }
  return { html: h, b: yy };
}

// loose cluster of lures (poster): positions in a reference box, scaled uniformly into the target box
const CL_TALL = { w: 480, h: 740, items: [
  { k: 'khor', cx: 92, cy: 150, VH: 210, rot: -12, d: 0.10 },
  { k: 'sofia', cx: 300, cy: 140, V: 300, rot: 4, d: 0.04 },
  { k: 'forte15', cx: 118, cy: 350, V: 210, rot: 16, d: 0.14 },
  { k: 'scheila', cx: 372, cy: 345, V: 196, rot: -14, d: 0.18 },
  { k: 'mukai', cx: 300, cy: 500, V: 230, rot: -6, d: 0.2 },
  { k: 'chart', cx: 238, cy: 660, V: 470, rot: -7, d: 0.0, hero: true },
] };
const CL_WIDE = { w: 720, h: 440, items: [
  { k: 'sofia', cx: 130, cy: 120, V: 220, rot: 4, d: 0.04 },
  { k: 'khor', cx: 300, cy: 120, VH: 180, rot: -12, d: 0.1 },
  { k: 'forte15', cx: 455, cy: 110, V: 175, rot: 16, d: 0.14 },
  { k: 'scheila', cx: 615, cy: 135, V: 165, rot: -12, d: 0.18 },
  { k: 'mukai', cx: 600, cy: 320, V: 200, rot: 6, d: 0.2 },
  { k: 'chart', cx: 300, cy: 330, V: 470, rot: -6, d: 0.0, hero: true },
] };
function cluster(E, L, box) {
  const s = Math.min(box.w / L.w, box.h / L.h), ox = box.x + (box.w - L.w * s) / 2, oy = box.y + (box.h - L.h * s) / 2;
  let h = '';
  const order = [...L.items].sort((a, b) => (a.hero ? 1 : 0) - (b.hero ? 1 : 0));
  for (const it of order) {
    h += prod(E, it.k, {
      cx: ox + it.cx * s, cy: oy + it.cy * s, ...(it.V ? { V: it.V * s } : { VH: it.VH * s }), rot: it.rot, sweep: !!it.hero,
      attrs: it.hero ? 'data-in="right" data-dist="90" data-float="5,2.5"' : `data-in="scale" data-d="${it.d.toFixed(2)}"`,
    }).html;
  }
  return h;
}

// ---------- scenes ----------
export const scenes = {
  // POSTER (statics + loop start/end): the counter lockup + a drop of lures from 6 brands
  poster(E) {
    const b = E.body, k = E.kind;
    let html = '', txt = '';
    if (k === 'wide') {
      html += frame(E, { glow: [0.72, 0.55], glowR: 0.5 });
      const colW = 440;
      const c = counter(E, { x: b.x, y: b.y + 2, w: colW, big: 124, d: 0.05 });
      txt += c.html;
      const R = logoRow(E, { sh: 34, labelSize: 14, gap: 30, logoMaxH: 64 });
      txt += R.html;
      html += cluster(E, CL_WIDE, { x: b.x + colW + 10, y: b.y - 4, w: b.r - b.x - colW + 30, h: R.top - b.y - 2 });
      return { html: html + txt };
    }
    html += frame(E, { glow: k === 'square' ? [0.75, 0.6] : [0.6, 0.72] });
    if (k === 'square') {
      const colW = 470;
      txt += T(E, { cls: 'af-k af-tag', x: b.x, y: b.y + 8, w: 600, size: 25, text: 'Český e-shop pro trout area', style: 'letter-spacing:.08em', inAttr: 'data-in="left"' });
      const c = counter(E, { x: b.x, y: b.y + 64, w: colW, big: 236, d: 0.05 });
      txt += c.html;
      const R = logoRow(E, { sh: 44, labelSize: 16, logoMaxH: 84 });
      txt += R.html;
      html += cluster(E, CL_TALL, { x: b.x + colW - 10, y: b.y + 30, w: b.r - b.x - colW + 40, h: R.top - b.y - 40 });
      return { html: html + txt };
    }
    // portrait / tall: counter column left, site benefits + logo under it, the drop of lures fills the right column
    const tall = k === 'tall', colW = tall ? 500 : 480;
    txt += T(E, { cls: 'af-k af-tag', x: b.x, y: b.y + 8, w: b.w, size: tall ? 30 : 27, text: 'Český e-shop pro trout area', style: 'letter-spacing:.1em', inAttr: 'data-in="left"' });
    const c = counter(E, { x: b.x, y: b.y + (tall ? 84 : 72), w: colW, big: tall ? 250 : 236, d: 0.05 });
    txt += c.html;
    const ps = tall ? 28 : 26;
    txt += pill(E, { x: b.x, y: c.b + (tall ? 40 : 30), text: 'Osobní přístup', size: ps, tone: 'fill', d: 0.25 });
    txt += pill(E, { x: b.x, y: c.b + (tall ? 40 : 30) + ps * 2 + 14, text: 'Unikátní sortiment', size: ps, tone: 'ol', d: 0.3 });
    const R = logoRow(E, { sh: tall ? 56 : 50, labelSize: tall ? 19 : 17 });
    txt += R.html;
    html += cluster(E, CL_TALL, { x: b.x + colW - 30, y: b.y + 60, w: b.r - b.x - colW + 60, h: R.top - b.y - 80 });
    return { html: html + txt };
  },

  // 1 — WHO: founder-run Czech shop for spin fishing / trout area, the site's three benefits
  who(E) {
    const b = E.body, sq = E.kind === 'square';
    let html = frame(E, { glow: [0.7, 0.75] }), txt = '';
    const L = afLogo(E, { x: b.x, y: b.y + 6, maxH: 999, attrs: 'data-in="scale"' });
    txt += L.html;
    txt += T(E, { cls: 'af-s', x: b.x + L.w + 28, y: b.y + 6 + L.h / 2 - 34, w: b.w - L.w - 28, size: 30, lines: 2, html: `${E.t('E-shop Stanislava Lukáška,')}<br>${E.t('zrozený z vášně pro přívlač')}`, style: 'line-height:1.15', inAttr: 'data-in="left" data-d=".1"' });
    let y = b.y + L.h + (sq ? 34 : 50);
    const hs = sq ? 104 : 118;
    txt += T(E, { cls: 'af-h', x: b.x, y, w: b.w, size: hs, fit: 60, text: 'Pro všechny,', main: true, inAttr: 'data-in="up" data-d=".06"' });
    y += hs * 0.98;
    txt += T(E, { cls: 'af-h', x: b.x, y, w: b.w, size: hs, fit: 60, html: `kdo milují <span class="af-g">přívlač</span>`, main: true, inAttr: 'data-in="up" data-d=".12"' });
    y += hs * 1.06 + 8;
    txt += T(E, { cls: 'af-s', x: b.x, y, w: b.w, size: sq ? 40 : 42, fit: 30, text: 'Český e-shop pro trout area', main: true, inAttr: 'data-in="up" data-d=".18"', style: `color:${C.ink}` });
    y += (sq ? 40 : 42) * 1.2 + (sq ? 20 : 30);
    // benefit pills (homepage)
    const ps = sq ? 24 : 27, ph = ps * 2, gap = 12;
    const items = [['Osobní přístup', 'fill'], ['Unikátní sortiment', 'ol'], ['Rychlost doručení', 'ol']];
    let px = b.x, py = y;
    items.forEach(([t, tone], i) => {
      const pw = pillW(t, ps);
      if (px + pw > b.r + 2) { px = b.x; py += ph + gap; }
      txt += pill(E, { x: px, y: py, text: t, size: ps, tone, d: 0.22 + i * 0.06 });
      px += pw + gap;
    });
    y = py + ph + 18;
    // what you find there: spoons · cranks · line (three cut-outs on the paper)
    const ah = b.b - y, aw = b.w;
    const third = aw / 3;
    html += prodIn(E, 'sofia', { x: b.x + 6, y: y + 4, w: third - 20, h: ah - 8 }, { rot: 0, attrs: 'data-in="rise" data-d=".1"' }).html;
    html += prodIn(E, 'varivas', { x: b.x + third + 10, y: y + 4, w: third - 20, h: ah - 8 }, { attrs: 'data-in="rise" data-d=".16"' }).html;
    html += prodIn(E, 'mukai', { x: b.x + 2 * third + 4, y: y + ah * 0.12, w: third - 4, h: ah * 0.76 }, { rot: -6, attrs: 'data-in="rise" data-d=".22"' }).html;
    return { html: html + txt };
  },

  // 2 — RANGE: counts + the shop's brands, each with one of its lures (third-party brands: „v nabídce“)
  range(E) {
    const b = E.body, sq = E.kind === 'square';
    let html = frame(E, { glow: [0.5, 0.45], glowR: 0.6 }), txt = '';
    txt += T(E, { cls: 'af-k af-tag', x: b.x, y: b.y + 4, w: b.w, size: sq ? 24 : 26, text: 'V nabídce · přední japonské značky i další', fit: 18, inAttr: 'data-in="left"' });
    let y = b.y + (sq ? 44 : 50);
    const ns = sq ? 96 : 112, half = b.w / 2;
    txt += T(E, { cls: 'af-n', x: b.x, y, w: half - 10, size: ns, fit: 50, html: `<span class="af-g">1 300+</span>`, main: true, inAttr: 'data-in="slam" data-d=".04"' });
    txt += T(E, { cls: 'af-n', x: b.x + half, y, w: half, size: ns, fit: 50, html: `<span class="af-g">770+</span>`, main: true, inAttr: 'data-in="slam" data-d=".1"' });
    y += ns * 1.0;
    const ls = sq ? 34 : 38;
    txt += T(E, { cls: 'af-k', x: b.x + 4, y, w: half - 10, size: ls, text: 'plandavek', main: false, style: 'letter-spacing:.08em', inAttr: 'data-in="up" data-d=".08"' });
    txt += T(E, { cls: 'af-k', x: b.x + half + 4, y, w: half - 10, size: ls, text: 'woblerů', style: 'letter-spacing:.08em', inAttr: 'data-in="up" data-d=".14"' });
    y += ls * 1.0 + (sq ? 22 : 30);
    // 3 × 2 brand + lure cards
    const strip = sq ? 64 : 76, gap = sq ? 14 : 18;
    const gh = b.b - y - strip - gap, cols = 3, cw = (b.w - gap * (cols - 1)) / cols, ch = (gh - gap) / 2;
    const cards = [
      { b: 'nories', k: 'sofia' }, { b: 'timon', k: 'cobalt' }, { b: 'mukai', k: 'mukai' },
      { b: 'valkein', k: 'scheila' }, { b: 'velvetarts', k: 'forte15' }, { b: 'varivas', k: 'varivas' },
    ];
    const lh = Math.round(ch * (sq ? 0.27 : 0.27));
    cards.forEach((c, i) => {
      const x = b.x + (i % cols) * (cw + gap), yy = y + Math.floor(i / cols) * (ch + gap);
      html += card(E, { x, y: yy, w: cw, h: ch, k: c.k, b: c.b, pad: 16, logoH: lh, d: 0.12 + i * 0.05 });
    });
    // rail of more brand logos
    const ry = b.b - strip, more = ['yarie', 'forest', 'officeeucalyptus', 'rodiocraft'];
    const rg = 12, rw = (b.w - rg * (more.length - 1)) / more.length;
    more.forEach((m, i) => { html += brandCard(E, m, { x: b.x + i * (rw + rg), y: ry, w: rw, h: strip, pad: 12, d: 0.4 + i * 0.04 }); });
    return { html: html + txt };
  },

  // 3 — HERO: Timon Chibi Futten FS 51 mm — COLOUR DROP: the same lure switches colourway (data-cycle), names follow
  hero(E) {
    const b = E.body, sq = E.kind === 'square';
    let html = frame(E, { glow: [0.5, 0.62], glowR: 0.55 }), txt = '';
    txt += T(E, { cls: 'af-k af-tag', x: b.x, y: b.y + 4, w: b.w * 0.7, size: sq ? 26 : 28, text: 'Wobler v nabídce · 51 mm', inAttr: 'data-in="left"' });
    const hs = sq ? 132 : 150;
    txt += T(E, { cls: 'af-h', x: b.x - 3, y: b.y + (sq ? 46 : 52), w: b.w, size: hs, fit: 70, html: `Chibi Futten <span class="af-g">FS</span>`, main: true, inAttr: 'data-in="slam" data-d=".05"' });
    const by = b.y + (sq ? 46 : 52) + hs * 1.0;
    // Timon wordmark card, top-right
    html += brandCard(E, 'timon', { x: b.r - 230, y: b.y - 2, w: 230, h: 84, pad: 14, d: 0.1 });
    txt += T(E, { cls: 'af-s', x: b.x, y: by + 2, w: b.w, size: sq ? 40 : 44, text: 'Jeden model, řada barev', main: true, style: `color:${C.ink}`, inAttr: 'data-in="up" data-d=".14"' });
    // colourway names (synced with the lure cycle), bottom-left
    const ns = sq ? 30 : 34, nh = ns * 2;
    const ny = b.b - nh;
    const STEP = 0.32, D0 = 0.2;
    const names = CW.map((c) => `<div class="cy"><div class="t af-pill ol" style="left:0;top:0;height:${R1(nh)}px;padding:0 ${R1(ns * 0.9)}px;font-size:${ns}px"><span class="af-dot" style="background:${P[c].dot}"></span>${E.t(P[c].name)}</div></div>`).join('');
    txt += `<div class="abs" data-cycle="${STEP}" data-d="${D0}" data-rest="0" style="left:${R1(b.x)}px;top:${R1(ny)}px;width:${R1(b.w)}px;height:${R1(nh)}px">${names}</div>`;
    // swatch dots row (all colourways, static), right of the pill
    let dots = '';
    CW.forEach((c, i) => { dots += `<i class="abs" style="left:${R1(i * 42)}px;top:0;width:30px;height:30px;border-radius:50%;background:${P[c].dot};box-shadow:inset 0 0 0 3px rgba(255,255,255,.7),0 4px 10px rgba(0,0,0,.15)"></i>`; });
    html += `<div class="abs" data-in="up" data-d=".3" style="left:${R1(b.r - 4 * 42 - 30)}px;top:${R1(ny + nh / 2 - 15)}px;width:${4 * 42 + 30}px;height:30px">${dots}</div>`;
    // the lure: all colourways aligned by visible box, centre of the free area
    const top = by + (sq ? 70 : 90), bot = ny - (sq ? 16 : 30);
    const cy = (top + bot) / 2, V = Math.min(860, b.w + 40);
    // tint glow follows the colourway
    const tints = CW.map((c) => `<div class="cy" style="background:radial-gradient(closest-side,${P[c].tint},rgba(255,255,255,0))"></div>`).join('');
    html += `<div class="abs" data-cycle="${STEP}" data-d="${D0}" data-rest="0" style="left:${R1(E.W / 2 - 560)}px;top:${R1(cy - 420)}px;width:1120px;height:840px;opacity:.9">${tints}</div>`;
    const lures = CW.map((c) => `<div class="cy">${prod(E, c, { cx: 560, cy: 420, V, rot: -5, maxUp: 1.3, sweep: c === 'chart' }).html}</div>`).join('');
    html += `<div class="abs" data-in="right" data-dist="120" data-cycle="${STEP}" data-d="${D0}" data-rest="0" style="left:${R1(E.W / 2 - 560)}px;top:${R1(cy - 420)}px;width:1120px;height:840px">${lures}</div>`;
    return { html: html + txt };
  },

  // 4 — MČR: the shop gives prizes to the championship; URL big + a shelf of lures
  mcr(E) {
    const b = E.body, sq = E.kind === 'square';
    let html = frame(E, { glow: [0.5, 0.5], glowR: 0.6 }), txt = '';
    txt += T(E, { cls: 'af-k af-tag', x: b.x, y: b.y + 4, w: b.w, size: sq ? 26 : 28, text: 'Mistrovství ČR v Trout Area 2026', inAttr: 'data-in="left"' });
    const hs = sq ? 150 : 170;
    let y = b.y + (sq ? 50 : 58);
    txt += T(E, { cls: 'af-h', x: b.x - 3, y, w: b.w, size: hs, fit: 80, html: `Věnuje <span class="af-g">ceny</span>`, main: true, inAttr: 'data-in="slam" data-d=".05"' });
    y += hs * 1.0;
    txt += T(E, { cls: 'af-s', x: b.x, y, w: b.w, size: sq ? 42 : 46, text: 'pro závodníky mistrovství', main: true, style: `color:${C.ink}`, inAttr: 'data-in="up" data-dist="24" data-d=".14"' });
    y += (sq ? 42 : 46) * 1.25 + (sq ? 22 : 40);
    // logo + URL
    const L = afLogo(E, { x: b.x, y, maxH: 999, attrs: 'data-in="scale" data-d=".18"' });
    txt += L.html;
    const us = sq ? 74 : 80;
    txt += T(E, { cls: 'af-url', x: b.x + L.w + 26, y: y + L.h / 2 - us * 0.62, w: b.w - L.w - 26, size: us, fit: 44, html: `activefishing<b>.cz</b>`, main: true, inAttr: 'data-in="left" data-d=".22"' });
    txt += T(E, { cls: 'af-k', x: b.x + L.w + 30, y: y + L.h / 2 + us * 0.52, w: b.w - L.w - 30, size: 24, fit: 18, text: 'plandavky · woblery · pruty', style: `color:${C.grey};letter-spacing:.16em`, inAttr: 'data-in="left" data-d=".26"' });
    y += L.h + (sq ? 20 : 40);
    // shelf: a row of lures on a gradient line
    const sh = b.b - y, shelfY = b.b - 6;
    html += `<div class="af-sep" style="left:${R1(b.x)}px;top:${R1(shelfY)}px;width:${R1(b.w)}px"></div>`;
    const row = [['forte06', -8], ['wah', 0], ['khor', 0], ['gold', 0], ['scheila', 8]];
    const slot = b.w / row.length;
    row.forEach(([k, rot], i) => {
      const box = { x: b.x + i * slot + 8, y: y + 4, w: slot - 16, h: sh - 24 };
      html += prodIn(E, k, box, { rot, attrs: `data-in="scale" data-d="${(0.12 + i * 0.05).toFixed(2)}"`, maxUp: 1.2 }).html;
    });
    return { html: html + txt };
  },
};
