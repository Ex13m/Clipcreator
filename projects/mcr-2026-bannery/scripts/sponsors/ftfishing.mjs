// FT FISHING (ftfishing.cz, Fishing Trade CZ s.r.o.) — sponsor module for the MČR 2026 banner engine (role: sponsor → chip „Věnuje ceny · MČR 2026“).
// World = research/ftfishing_ad.md concept A „TŘI ZNAČKY“: the shop's own white web world (hero banner = white field with GREEN DIAGONAL
// STRIPES top and bottom), FT green #6DB52C (logo) + UI green #2EA200 / dark #237C00 (site CSS), logo grey #878786, ink #1A1A1A.
// Graphite header / footer bars with a green hazard-stripe edge carry the engine chrome (white-TROUT TA logo needs a dark ground).
// Type: Exo 2 800 (techno, rounded — close to the „FT / FISHING“ lettering) for heads, Saira 600–700 for kickers / chips.
// Each focus brand gets its own accent: Favorite red #B33840, Crazy Fish magenta #E3027D, Spinmad blue #066BB4.
// Facts only from research/ftfishing.md (Verification) + ftfishing_ad.md §5 + vo/script_cs.json › blocks.ftfishing:
//   „Vše pro přívlač“ (logo slogan) · Fishing Trade CZ s.r.o. · e-shop od roku 2016 (patička © 2016–2026) · showroom Praha 9 ·
//   „pro trout area lov“ (popis kategorie Pruty) · Pruty a navijáky Favorite · Nástrahy Crazy Fish · Nástrahy Spinmad ·
//   230+ prutů Favorite / 700+ nástrah Crazy Fish / 300+ nástrah Spinmad (v nabídce, 22. 10.) · Spinmad do Čech přivezl majitel
//   František Čáha (článek FT 2018 „distribuce této nástrahy do Čech mohla začít“ — parafráze, NIKDY „oficiální dovozce“) ·
//   product names: Impulse PRO 10 g, Target Spoon 1,5 g, Hart 9 g, King 14 g (Spicy Blade), Vibro Fat, X1 2000S, Totem 2000S, Arena Stream.
//   No prices, no concrete MČR prizes (unknown), no origin of brands, no superlatives; Crazy Fish = brand / range, not „nástraha na MČR“.

export const brand = {
  name: 'FT Fishing',
  url: 'ftfishing.cz',
  role: 'sponsor',
};

const C = {
  green: '#6DB52C', ui: '#2EA200', dark: '#237C00', grey: '#878786', ink: '#1A1A1A', graphite: '#1b1e1a', paper: '#ffffff',
  fav: '#B33840', cf: '#E3027D', sm: '#066BB4',
};
const EXO = "'Exo 2'";

export const theme = {
  bg: C.graphite,
  taTone: 'dark',
  chrome: {
    url: C.green, urlFont: "'Saira'", urlW: 700, sub: 'rgba(255,255,255,.8)', dot: '#ffffff',
    chipBg: `linear-gradient(180deg,#3d9f12 0%,${C.dark} 100%)`, chipFg: '#ffffff', chipLine: 'rgba(255,255,255,0)', event: 'rgba(255,255,255,.9)',
    shadow: '0 1px 2px rgba(0,0,0,.5)',
  },
};

// 10 s seamless loop: poster at rest on frame 0 and at the end
export const anim = {
  seq: [
    { scene: 'poster', d: 2.2 },
    { scene: 'range', d: 2.2 },
    { scene: 'hero', d: 2.0 },
    { scene: 'mcr', d: 1.8 },
    { scene: 'poster', d: 1.8 },
  ],
};
export const fonts = {};   // Exo 2 + Saira are in the engine registry

// ---------- assets (film cut-outs; bb = visible box alpha > 100, px) ----------
const AD = 'film:assets_prep/ftfishing/ads/', BRD = 'film:assets_prep/ftfishing/brands/';
const P = {
  impulse: { f: `${AD}H1_spinmad_impulse_pro_10g_3907_firetiger.png`, bb: [15, 13, 2386, 908] },
  lime: { f: `${AD}S1_spinmad_impulse_pro_10g_3908_electric_lime.png`, bb: [17, 17, 785, 310] },
  vibro: { f: `${AD}H2_crazyfish_vibro_fat_4in_09_caramel.png`, bb: [12, 12, 2390, 535] },
  totem: { f: `${AD}H3_favorite_totem_2000s_reel.png`, bb: [15, 14, 1927, 2386] },
  x1: { f: `${AD}H4_favorite_x1_2000s_reel.png`, bb: [13, 13, 1983, 2388] },
  spoon: { f: `${AD}H5_spinmad_target_spoon_1-5g_3201_pair.png`, bb: [15, 16, 1102, 1785] },
  hart: { f: `${AD}S2_spinmad_hart_9g_spicy_blade_3705_firetiger.png`, bb: [17, 17, 1058, 636] },
  king: { f: `${AD}S3_spinmad_king_14g_spicy_blade_3801.png`, bb: [17, 17, 1248, 674] },
  scalp: { f: `${AD}S4_crazyfish_scalp_minnow_100_06_chartreuse.png`, bb: [21, 17, 457, 97] },
  nimble: { f: `${AD}S5_crazyfish_nimble_50_14_motor_oil.png`, bb: [28, 29, 370, 369] },
  polaris: { f: `${AD}S6_crazyfish_polaris_68_4d_pair.png`, bb: [16, 17, 639, 569] },
  glider: { f: `${AD}S7_crazyfish_glider_55_20_kiwi.png`, bb: [16, 18, 458, 87] },
  comet: { f: `${AD}S8_crazyfish_comet_2-5in_20_kiwi.png`, bb: [16, 17, 443, 333] },
  rod: { f: `${AD}S10_favorite_arena_stream_arns1_rod.png`, bb: [17, 16, 1184, 893] },
};
const BBCF = [3, 2, 418, 313];   // alpha bbox of crazyfish_clean.png
const BR = {
  favorite: { f: 'favorite.png', bb: [26, 30, 900, 198] },
  spinmad: { f: 'spinmad.png', bb: [27, 13, 856, 355] },
  // review 22. 10. MINOR 5: cleaned + pre-sharpened mark (scripts/assets_prep/crazyfish_clean.py: no drips/splatter, 420 px Lanczos + unsharp)
  crazyfish: { src: 'own:assets/ftfishing/crazyfish_clean.png', bb: BBCF },
  vanfook: { f: 'vanfook.png', bb: [27, 26, 641, 389] },   // háčky (operátor 22. 10.: 4. značka, vedlejší vedle tří hlavních)
};
const LOGO = 'film:assets_prep/ftfishing/logo_on_light.png', LOGO_TRIM = [0, 0, 1881, 1878];

export function css() {
  return `
.ft-paper{background:radial-gradient(120% 90% at 30% 35%,#ffffff 0%,#f7f8f5 55%,#e9ece6 100%)}
.ft-bar{position:absolute;left:0;right:0;background:linear-gradient(180deg,#232720,#151714)}
.ft-tape{position:absolute;left:0;right:0;background:repeating-linear-gradient(-60deg,${C.green} 0 16px,rgba(0,0,0,0) 16px 32px)}
.ft-wing{position:absolute;background:repeating-linear-gradient(-60deg,${C.green} 0 34px,#64ab26 34px 68px)}
.ft-wing:after{content:"";position:absolute;inset:0;background:radial-gradient(70% 60% at 55% 45%,rgba(255,255,255,.18),rgba(255,255,255,0) 70%),linear-gradient(180deg,rgba(0,0,0,0) 60%,rgba(20,60,0,.22))}
.ft-band{position:absolute;background:repeating-linear-gradient(-60deg,${C.green} 0 12px,rgba(109,181,44,0) 12px 24px);opacity:.9}
.ft-p{position:absolute}
.ft-p img{position:absolute;inset:0;width:100%;height:100%;display:block}
.ft-sw{position:absolute;inset:0;overflow:hidden;-webkit-mask-size:100% 100%;mask-size:100% 100%;mix-blend-mode:screen;pointer-events:none}
.ft-sw i{position:absolute;top:0;bottom:0;left:-130%;width:70%;background:linear-gradient(105deg,rgba(255,255,255,0) 38%,rgba(255,255,255,.55) 50%,rgba(255,255,255,0) 62%)}
.ft-k{font-family:Saira;font-weight:700;font-stretch:112%;text-transform:uppercase;letter-spacing:.1em;color:${C.dark};line-height:1.3;margin-top:-.15em}
.ft-tag{display:flex;align-items:center;gap:.55em}
.ft-tag:before{content:"";display:block;flex:none;width:1.5em;height:.62em;background:repeating-linear-gradient(-60deg,${C.green} 0 .22em,rgba(0,0,0,0) .22em .44em)}
.ft-h{font-family:${EXO};font-weight:800;text-transform:uppercase;color:${C.ink};line-height:.96;letter-spacing:-.005em;padding-top:.08em;margin-top:-.08em}
.ft-h em{font-style:normal;color:${C.ui}}
.ft-s{font-family:Saira;font-weight:600;color:#3a3d38;line-height:1.18}
.ft-s b{font-weight:800;color:${C.ink}}
.ft-url{font-family:Saira;font-weight:800;font-stretch:112%;letter-spacing:-.01em;color:${C.ink};line-height:1.1}
.ft-url b{color:${C.ui};font-weight:800}
.ft-pill{display:flex;align-items:center;justify-content:center;border-radius:10px;font-family:Saira;font-weight:700;text-transform:uppercase;letter-spacing:.06em;line-height:1;white-space:nowrap}
.ft-pill.fill{background:linear-gradient(180deg,#3d9f12,${C.dark});color:#fff;box-shadow:0 10px 22px rgba(35,124,0,.28)}
.ft-pill.ol{background:#fff;color:${C.ink};box-shadow:inset 0 0 0 3px ${C.green},0 8px 18px rgba(30,40,20,.10)}
.ft-card{position:absolute;border-radius:18px;background:#fff;box-shadow:0 14px 30px rgba(30,40,20,.13),0 0 0 1px rgba(0,0,0,.05);overflow:hidden}
.ft-card .edge{position:absolute;left:0;top:0;bottom:0;width:12px}
.ft-story{position:absolute;border-radius:18px;background:${C.graphite};overflow:hidden;box-shadow:0 16px 34px rgba(20,30,10,.22)}
.ft-story:before{content:"";position:absolute;left:0;right:0;top:0;height:14px;background:repeating-linear-gradient(-60deg,${C.green} 0 12px,rgba(0,0,0,0) 12px 24px)}
.ft-q{font-family:Saira;font-weight:600;color:#fff;line-height:1.2;white-space:normal}
.ft-q b{color:${C.green};font-weight:800}
.ft-num{font-family:${EXO};font-weight:800;line-height:1}
`;
}

// ---------- helpers ----------
const R1 = (n) => Math.round(n * 10) / 10;
const T = (E, { cls, x, y, w, size, text, html, align = 'left', fit = 0, lines = 0, main = false, inAttr = '', style = '', id = '' }) =>
  `<div ${id ? `id="${id}" ` : ''}class="t ${cls}${main ? ' main' : ''}" ${inAttr} ${fit ? `data-fit="${fit}"` : ''} ${lines ? `data-lines="${lines}"` : ''} style="left:${R1(x)}px;top:${R1(y)}px;width:${R1(w)}px;font-size:${size}px;text-align:${align};${lines ? 'white-space:normal;' : 'overflow:hidden;'}${style}">${html ?? E.t(text)}</div>`;

// white web world + graphite header / footer bars with a green hazard-stripe edge (they carry the engine chrome)
function frame(E, { wing = null } = {}) {
  const wide = E.kind === 'wide';
  const hb = E.body.y - (wide ? 6 : 10), ft = E.chrome.chip.y - (wide ? 9 : 16), tp = wide ? 8 : 12;
  let h = `<div class="full ft-paper"></div>`;
  if (wing) h += wing;
  h += `<div class="ft-bar" style="top:0;height:${R1(hb)}px"></div><div class="ft-tape" style="top:${R1(hb - tp)}px;height:${tp}px"></div>
<div class="ft-bar" style="top:${R1(ft)}px;bottom:0"></div><div class="ft-tape" style="top:${R1(ft)}px;height:${tp}px"></div>`;
  return h;
}
// the green stripe „wing“ (slanted panel from the web hero banner) between the bars; x0 = left edge at the bottom, slant = px shift at the top
function wing(E, { x0, slant = 160, id = '' }) {
  const top = 0, h = E.H;
  return `<div class="abs"${id ? ` id="${id}"` : ''} style="left:${R1(x0)}px;top:${top}px;width:${R1(E.W - x0 + 2)}px;height:${h}px;clip-path:polygon(${R1(slant)}px 0,100% 0,100% 100%,0 100%)"><div class="ft-wing" data-in="wipe-l" data-dur=".5" style="inset:0"></div></div>`;
}

// product cut-out: visible box V px wide (or VH tall), visible centre (cx, cy), static pose rotation; never > maxUp × native
function prod(E, k, { cx, cy, V = null, VH = null, rot = 0, maxUp = 1.25, id = '', attrs = '', sweep = false, drop = '0 18px 20px rgba(10,30,0,.30)' }) {
  const p = P[k], [nw, nh] = E.dims(p.f), [x0, y0, x1, y1] = p.bb;
  let s = V != null ? V / (x1 - x0) : VH / (y1 - y0);
  s = Math.min(s, maxUp);
  const w = nw * s, h = nh * s, ocx = ((x0 + x1) / 2) * s, ocy = ((y0 + y1) / 2) * s, vw = (x1 - x0) * s, vh = (y1 - y0) * s;
  const url = E.src(p.f);
  const sw = sweep ? `<div class="ft-sw" style="-webkit-mask-image:url(${url});mask-image:url(${url})"><i data-sweep="0.3,1.3"></i></div>` : '';
  return {
    html: `<div class="ft-p"${id ? ` id="${id}"` : ''} ${attrs} style="left:${R1(cx - ocx)}px;top:${R1(cy - ocy)}px;width:${R1(w)}px;height:${R1(h)}px;transform-origin:${R1(ocx)}px ${R1(ocy)}px;${rot ? `transform:rotate(${rot}deg);` : ''}"><img src="${url}" alt="" style="filter:drop-shadow(${drop})">${sw}</div>`,
    vw, vh, s,
  };
}
// Arena Stream rod (2 pieces, diagonal in the PNG) laid horizontal: visible length len, centre (cx, cy)
function rodH(E, { cx, cy, len, attrs = '', drop = '0 10px 10px rgba(10,30,0,.25)' }) {
  return prod(E, 'rod', { cx, cy, V: len * 0.799, rot: -36.9, maxUp: 1.2, attrs, drop }).html;
}
function prodIn(E, k, box, o = {}) {
  const [x0, y0, x1, y1] = P[k].bb, ar = (x1 - x0) / (y1 - y0);
  return prod(E, k, { cx: box.x + box.w / 2, cy: box.y + box.h / 2, ...(ar > box.w / box.h ? { V: box.w } : { VH: box.h }), ...o });
}
// third-party brand logo contained in a box (positioned absolutely in the page / parent)
function brandLogo(E, b, { x, y, w, h, align = 'center', attrs = '' }) {
  const B = BR[b], SRC = B.src || BRD + B.f, [nw, nh] = E.dims(SRC), [x0, y0, x1, y1] = B.bb, ar = (x1 - x0) / (y1 - y0);
  const lw = Math.min(w, h * ar), lh = lw / ar, s = lw / (x1 - x0);
  const lx = align === 'left' ? x : align === 'right' ? x + w - lw : x + (w - lw) / 2;
  return `<div class="abs" ${attrs} style="left:${R1(lx - x0 * s)}px;top:${R1(y + (h - lh) / 2 - y0 * s)}px;width:${R1(nw * s)}px;height:${R1(nh * s)}px;background:url(${E.src(SRC)}) center/100% 100% no-repeat"></div>`;
}
// row of the three focus brands (Favorite · Crazy Fish · Spinmad), equal optical weight; + Vanfook (hooks) as a smaller 4th brand
// behind a thin divider — the three focus brands stay dominant (operator 22. 10.)
function brandRow(E, { x, y, w, h, d = 0.3, gap = 26, van = true }) {
  const vw = van ? 0.62 : 0, div = van ? gap + 2 : 0;
  const ws = [1.45, 0.84, 1.0], tot = ws.reduce((a, b) => a + b, 0) + vw, u = (w - gap * 2 - div) / tot;
  const keys = ['favorite', 'crazyfish', 'spinmad'], hs = [h * 0.7, h * 1.5, h * 0.95];   // Crazy Fish +20 % (review MINOR 5)
  let xx = x, html = '';
  keys.forEach((k, i) => {
    const bw = ws[i] * u;
    html += brandLogo(E, k, { x: xx, y: y + (h - hs[i]) / 2, w: bw, h: hs[i], attrs: `data-in="up" data-dist="24" data-d="${(d + i * 0.06).toFixed(2)}"` });
    xx += bw + gap;
  });
  if (van) {
    const dx = xx - gap / 2 + 1, vh = h * 0.78;
    html += `<div class="abs" data-in="fade" data-d="${(d + 0.2).toFixed(2)}" style="left:${R1(dx)}px;top:${R1(y + h * 0.12)}px;width:2px;height:${R1(h * 0.76)}px;background:rgba(26,26,26,.18)"></div>`;
    html += brandLogo(E, 'vanfook', { x: xx + div - gap, y: y + (h - vh) / 2, w: vw * u, h: vh, attrs: `data-in="up" data-dist="24" data-d="${(d + 0.22).toFixed(2)}"` });
  }
  return html;
}
function ftLogo(E, { x, y, cx, maxH, maxW, attrs = 'data-in="scale" data-d=".25"' }) {
  return E.logo(LOGO, { x, y, cx, maxH, maxW, trim: LOGO_TRIM, attrs });
}
function pill(E, { x, y, text, size = 26, tone = 'ol', d = 0, h = null }) {
  const hh = h ?? size * 2;
  return `<div class="t ft-pill ${tone}" data-in="up" data-dist="26" data-d="${d.toFixed(2)}" style="left:${R1(x)}px;top:${R1(y)}px;height:${R1(hh)}px;padding:0 ${R1(size * 0.8)}px;font-size:${size}px">${E.t(text)}</div>`;
}

// product cluster: positions in a reference box, scaled uniformly into the target box (hero drawn last)
const CL_TALL = { w: 520, h: 760, items: [
  { k: 'spoon', cx: 430, cy: 150, VH: 250, rot: 14, d: 0.16 },
  { k: 'x1', cx: 230, cy: 250, VH: 400, rot: -4, d: 0.04 },
  { k: 'hart', cx: 420, cy: 440, V: 190, rot: -18, d: 0.2 },
  { k: 'vibro', cx: 250, cy: 515, V: 440, rot: -9, d: 0.1 },
  { k: 'impulse', cx: 270, cy: 660, V: 500, rot: -5, hero: true },
] };
const CL_WIDE = { w: 780, h: 430, items: [
  { k: 'x1', cx: 150, cy: 210, VH: 340, rot: -4, d: 0.04 },
  { k: 'vibro', cx: 470, cy: 110, V: 380, rot: -5, d: 0.1 },
  { k: 'spoon', cx: 700, cy: 200, VH: 230, rot: 14, d: 0.16 },
  { k: 'impulse', cx: 450, cy: 300, V: 420, rot: -5, hero: true },
] };
function cluster(E, L, box) {
  const s = Math.min(box.w / L.w, box.h / L.h), ox = box.x + (box.w - L.w * s) / 2, oy = box.y + (box.h - L.h * s) / 2;
  let h = '';
  for (const it of [...L.items].sort((a, b) => (a.hero ? 1 : 0) - (b.hero ? 1 : 0))) {
    h += prod(E, it.k, {
      cx: ox + it.cx * s, cy: oy + it.cy * s, ...(it.V ? { V: it.V * s } : { VH: it.VH * s }), rot: it.rot, sweep: !!it.hero,
      attrs: it.hero ? 'data-in="right" data-dist="110" data-float="5,2.5"' : `data-in="scale" data-d="${it.d.toFixed(2)}"`,
    }).html;
  }
  return h;
}

// ---------- scenes ----------
export const scenes = {
  // POSTER (statics + loop start/end): „VŠE PRO PŘÍVLAČ“ + the three focus brands + a green stripe wing with Favorite / Crazy Fish / Spinmad gear
  poster(E) {
    const b = E.body, k = E.kind;
    let html = '', txt = '';
    if (k === 'wide') {
      const colW = 470;
      html += frame(E, { wing: wing(E, { x0: b.x + colW - 40, slant: 150 }) });
      txt += T(E, { cls: 'ft-k ft-tag', x: b.x, y: b.y + 4, w: colW, size: 19, text: 'FT Fishing · od roku 2016', inAttr: 'data-in="left"' });
      txt += T(E, { cls: 'ft-h', x: b.x - 2, y: b.y + 36, w: colW - 60, size: 70, fit: 50, text: 'Vše pro', main: true, inAttr: 'data-in="up" data-d=".04"' });
      txt += T(E, { cls: 'ft-h', x: b.x - 2, y: b.y + 36 + 67, w: colW - 70, size: 70, fit: 50, html: '<em>přívlač</em>', main: true, inAttr: 'data-in="slam" data-d=".1"' });
      txt += T(E, { cls: 'ft-s', x: b.x, y: b.y + 182, w: colW - 90, size: 23, lines: 2, html: `${E.t('Pruty a navijáky Favorite,')}<br>${E.t('nástrahy Crazy Fish a Spinmad')}`, inAttr: 'data-in="up" data-d=".18"' });
      const L = ftLogo(E, { x: 0, y: 0, maxH: 999 });
      txt += ftLogo(E, { x: b.x, y: b.b - L.h }).html;
      txt += brandRow(E, { x: b.x + L.w + 24, y: b.b - L.h / 2 - 24, w: colW - L.w - 100, h: 48, gap: 18 });
      html += cluster(E, CL_WIDE, { x: b.x + colW + 10, y: b.y - 6, w: b.r - b.x - colW + 10, h: b.h + 14 });
      return { html: html + txt };
    }
    const sq = k === 'square', tall = k === 'tall';
    const colW = sq ? 540 : tall ? 600 : 570;
    html += frame(E, { wing: wing(E, { x0: b.x + colW - (sq ? 10 : 40), slant: sq ? 230 : 260 }) });
    let y = b.y + (tall ? 20 : 6);
    txt += T(E, { cls: 'ft-k ft-tag', x: b.x, y, w: colW, fit: 16, size: sq ? 24 : tall ? 29 : 27, text: 'FT Fishing · e-shop od roku 2016', inAttr: 'data-in="left"' });
    y += sq ? 52 : 62;
    const hs = sq ? 132 : tall ? 156 : 146;
    txt += T(E, { cls: 'ft-h', x: b.x - 4, y, w: colW, size: hs, fit: 70, text: 'Vše pro', main: true, inAttr: 'data-in="up" data-d=".04"' });
    y += hs * 0.96;
    txt += T(E, { cls: 'ft-h', x: b.x - 4, y, w: colW + (sq ? 10 : 30), size: hs, fit: 70, html: '<em>přívlač</em>', main: true, inAttr: 'data-in="slam" data-d=".1"' });
    y += hs * 1.04 + (sq ? 16 : 26);
    const ss = sq ? 36 : tall ? 42 : 38;
    txt += T(E, { cls: 'ft-s', x: b.x, y, w: colW - 10, size: ss, fit: 26, html: `${E.t('Pruty a navijáky')} <b>Favorite</b>,<br>${E.t('nástrahy')} <b>Crazy&nbsp;Fish</b> a&nbsp;<b>Spinmad</b>`, inAttr: 'data-in="up" data-d=".18"' });
    y += ss * 1.18 * 2 + (sq ? 26 : 46);
    if (!sq) {
      const ps = tall ? 27 : 25;
      txt += pill(E, { x: b.x, y, text: 'Pro trout area i závodníky', size: ps, tone: 'fill', d: 0.24 });
      y += ps * 2 + (tall ? 44 : 34);
    }
    const L = ftLogo(E, { x: 0, y: 0, maxH: 999 });
    txt += ftLogo(E, { x: b.x, y: b.b - L.h - 2 }).html;
    const rowH = sq ? 74 : 88;
    txt += brandRow(E, { x: b.x, y: Math.min(y, b.b - L.h - rowH - (sq ? 26 : 50)), w: colW - (sq ? 60 : 40), h: rowH });
    const cTop = sq ? b.y + 10 : b.y + (tall ? 60 : 40);
    html += cluster(E, CL_TALL, { x: b.x + colW - (sq ? 0 : 20), y: cTop, w: b.r - b.x - colW + (sq ? 40 : 60), h: b.b - cTop + 10 });
    return { html: html + txt };
  },

  // 1 — WHO: Fishing Trade CZ — e-shop since 2016, showroom Praha 9, the Spinmad story (owner brought the brand to Czechia)
  who(E) {
    const b = E.body, sq = E.kind === 'square';
    let html = frame(E), txt = '';
    const L = ftLogo(E, { x: b.x, y: b.y + 4, maxH: 999, attrs: 'data-in="scale"' });
    txt += L.html;
    const lx = b.x + L.w + 30;
    txt += T(E, { cls: 'ft-k', x: lx, y: b.y + L.h / 2 - 40, w: b.r - lx, size: sq ? 30 : 32, text: 'Fishing Trade CZ', style: `color:${C.ink}`, inAttr: 'data-in="left" data-d=".06"' });
    txt += T(E, { cls: 'ft-s', x: lx, y: b.y + L.h / 2 + 4, w: b.r - lx, size: sq ? 28 : 30, lines: 2, html: `${E.t('E-shop od roku 2016')}<br>${E.t('a showroom v Praze 9')}`, style: 'line-height:1.15', inAttr: 'data-in="left" data-d=".12"' });
    let y = b.y + L.h + (sq ? 30 : 44);
    const hs = sq ? 112 : 128;
    txt += T(E, { cls: 'ft-h', x: b.x - 3, y, w: b.w, size: hs, fit: 60, html: `Vše pro <em>přívlač</em>`, main: true, inAttr: 'data-in="slam" data-d=".06"' });
    y += hs * 1.02 + (sq ? 16 : 24);
    // story card (graphite with the green tape): Spinmad brought to Czechia by the owner
    const sh = sq ? 196 : 230, sw = b.w;
    const qs = sq ? 40 : 44;
    html += `<div class="ft-story" data-in="up" data-dist="40" data-d=".16" style="left:${R1(b.x)}px;top:${R1(y)}px;width:${R1(sw)}px;height:${sh}px"></div>`;
    const spW = sq ? 250 : 280;
    html += prod(E, 'hart', { cx: b.x + sw - spW / 2 - 18, cy: y + sh / 2 + 8, V: spW, rot: -12, attrs: 'data-in="right" data-d=".24"', drop: '0 14px 16px rgba(0,0,0,.45)' }).html;
    txt += T(E, { cls: 'ft-k', x: b.x + 30, y: y + 34, w: sw - spW - 70, size: sq ? 22 : 24, text: 'Příběh Spinmadu', style: `color:${C.green};letter-spacing:.16em`, inAttr: 'data-in="up" data-d=".2"' });
    txt += T(E, { cls: 'ft-q main', x: b.x + 30, y: y + 34 + (sq ? 36 : 40), w: sw - spW - 60, size: qs, lines: 3, html: `${E.t('Polský')} <b>Spinmad</b> ${E.t('přivezl do Čech majitel František Čáha')}`, inAttr: 'data-in="up" data-d=".24"' });
    y += sh + (sq ? 20 : 34);
    // bottom: pill + the Arena Stream rod diagonal and a pair of trout-area spoons
    const ps = sq ? 24 : 27;
    txt += pill(E, { x: b.x, y, text: 'Pro trout area i závodníky', size: ps, tone: 'fill', d: 0.3 });
    const ah = b.b - y;
    html += `<div class="ft-band" data-in="wipe-l" data-d=".2" style="left:${R1(b.x)}px;top:${R1(b.b - 18)}px;width:${R1(b.w)}px;height:14px"></div>`;
    html += rodH(E, { cx: b.x + b.w * 0.36, cy: y + ps * 2 + (ah - ps * 2) / 2 - 4, len: b.w * 0.74, attrs: 'data-in="left" data-dist="120" data-d=".22"' });
    html += prodIn(E, 'spoon', { x: b.x + b.w * 0.76, y: y - 8, w: b.w * 0.22, h: ah - 22 }, { rot: 12, attrs: 'data-in="scale" data-d=".3"', maxUp: 1 }).html;
    return { html: html + txt };
  },

  // 2 — RANGE: „Tři značky“ — Favorite / Crazy Fish / Spinmad, each a white shop card with its logo, what it is, live count + products
  range(E) {
    const b = E.body, sq = E.kind === 'square';
    let html = frame(E), txt = '';
    txt += T(E, { cls: 'ft-k ft-tag', x: b.x, y: b.y + 4, w: b.w * 0.6, size: sq ? 24 : 27, text: 'Tři značky v nabídce', inAttr: 'data-in="left"' });
    // + Vanfook (hooks) — small, top right, the three cards below stay the focus
    const vH = sq ? 46 : 52, vW = vH * 1.69;
    txt += brandLogo(E, 'vanfook', { x: b.r - vW, y: b.y - 8, w: vW, h: vH, align: 'right', attrs: 'data-in="up" data-d=".3"' });
    txt += T(E, { cls: 'ft-k', x: b.r - vW - 230, y: b.y + 4, w: 216, size: sq ? 20 : 22, align: 'right', text: 'a také háčky', style: `color:${C.grey};letter-spacing:.08em`, inAttr: 'data-in="left" data-d=".28"' });
    const hs = sq ? 84 : 96;
    txt += T(E, { cls: 'ft-h', x: b.x - 3, y: b.y + (sq ? 44 : 52), w: b.w, size: hs, fit: 50, html: `Pruty · navijáky · <em>nástrahy</em>`, main: true, inAttr: 'data-in="up" data-d=".04"' });
    const gy = b.y + (sq ? 44 : 52) + hs * 1.06 + (sq ? 14 : 24), gap = sq ? 16 : 22, ch = (b.b - gy - gap * 2) / 3;
    const rows = [
      { b: 'favorite', acc: C.fav, num: '230+', what: 'prutů · navijáky', items: [['rod', 0.95, 0], ['x1', 0.3, 0], ['totem', 0.3, 0]] },
      { b: 'crazyfish', acc: C.cf, num: '700+', what: 'gumových nástrah', items: [['vibro', 0.6, -6], ['polaris', 0.22, 0], ['nimble', 0.2, 0], ['comet', 0.22, 8]] },
      { b: 'spinmad', acc: C.sm, num: '300+', what: 'ocásky · cikády · plandavky', items: [['impulse', 0.4, -4], ['hart', 0.28, -6], ['king', 0.28, 6], ['spoon', 0.16, 10]] },
    ];
    const infoW = sq ? 330 : 360;
    rows.forEach((r, i) => {
      const y = gy + i * (ch + gap), x = b.x, w = b.w;
      html += `<div class="ft-card" data-in="up" data-dist="40" data-d="${(0.1 + i * 0.07).toFixed(2)}" style="left:${R1(x)}px;top:${R1(y)}px;width:${R1(w)}px;height:${R1(ch)}px"><i class="edge" style="background:${r.acc}"></i></div>`;
      const lh = ch * (r.b === 'crazyfish' ? 0.5 : r.b === 'spinmad' ? 0.42 : 0.24);
      html += brandLogo(E, r.b, { x: x + 34, y: y + 16, w: infoW - 40, h: lh, align: 'left', attrs: `data-in="up" data-d="${(0.16 + i * 0.07).toFixed(2)}"` });
      const ns = sq ? 46 : 52, ws = sq ? 22 : 24;
      const nY = y + ch - 16 - ws * 1.25 - ns;
      txt += T(E, { cls: 'ft-num', x: x + 34, y: nY, w: infoW - 40, size: ns, text: r.num, style: `color:${r.acc}`, main: true, inAttr: `data-in="left" data-d="${(0.2 + i * 0.07).toFixed(2)}"` });
      txt += T(E, { cls: 'ft-k', x: x + 36, y: nY + ns * 1.04, w: infoW - 40, size: ws, fit: 16, text: r.what, style: `color:${C.ink};letter-spacing:.06em`, inAttr: `data-in="left" data-d="${(0.24 + i * 0.07).toFixed(2)}"` });
      // products in the right part of the card
      const px0 = x + infoW, pw = w - infoW - 20;
      if (r.b === 'favorite') {
        html += rodH(E, { cx: px0 + pw * 0.24, cy: y + ch * 0.5, len: pw * 0.56, attrs: 'data-in="left" data-dist="80" data-d=".2"', drop: '0 6px 6px rgba(0,0,0,.2)' });
        html += prodIn(E, 'totem', { x: px0 + pw * 0.5, y: y + 10, w: pw * 0.25, h: ch - 20 }, { attrs: 'data-in="scale" data-d=".26"', drop: '0 10px 10px rgba(0,0,0,.25)' }).html;
        html += prodIn(E, 'x1', { x: px0 + pw * 0.75, y: y + 10, w: pw * 0.25, h: ch - 20 }, { attrs: 'data-in="scale" data-d=".3"', drop: '0 10px 10px rgba(0,0,0,.25)' }).html;
      } else {
        let xx = px0;
        const tot = r.items.reduce((a, it) => a + it[1], 0);
        r.items.forEach(([k, f, rot], j) => {
          const iw = pw * f / tot;
          html += prodIn(E, k, { x: xx + 6, y: y + 14, w: iw - 12, h: ch - 28 }, { rot, attrs: `data-in="scale" data-d="${(0.22 + i * 0.07 + j * 0.04).toFixed(2)}"`, maxUp: 1.3, drop: '0 8px 9px rgba(0,0,0,.22)' }).html;
          xx += iw;
        });
      }
    });
    return { html: html + txt };
  },

  // 3 — HERO: Spinmad Impulse PRO 10 g — the colourway switches (Firetiger ↔ Electric Lime); Target Spoon 1,5 g as the trout-area pick
  hero(E) {
    const b = E.body, sq = E.kind === 'square';
    let html = frame(E), txt = '';
    // green stripe band behind the lure (the web hero banner's stripes, slanted)
    const by = b.y + (sq ? 250 : 300), bh = sq ? 330 : 420;
    html += `<div class="abs" style="left:0;top:${R1(by)}px;width:${E.W}px;height:${R1(bh)}px;clip-path:polygon(0 18%,100% 0,100% 82%,0 100%)"><div class="ft-wing" data-in="wipe-l" data-dur=".45" style="inset:0"></div></div>`;
    txt += T(E, { cls: 'ft-k ft-tag', x: b.x, y: b.y + 4, w: b.w * 0.62, size: sq ? 24 : 27, text: 'Spinmad · nástraha v nabídce', inAttr: 'data-in="left"' });
    txt += brandLogo(E, 'spinmad', { x: b.r - 210, y: b.y - 6, w: 210, h: sq ? 90 : 100, align: 'right', attrs: 'data-in="scale" data-d=".1"' });
    const hs = sq ? 126 : 146;
    txt += T(E, { cls: 'ft-h', x: b.x - 4, y: b.y + (sq ? 50 : 58), w: b.w - 200, size: hs, fit: 70, html: `Impulse <em>PRO</em>`, main: true, inAttr: 'data-in="slam" data-d=".05"' });
    txt += T(E, { cls: 'ft-s', x: b.x, y: b.y + (sq ? 50 : 58) + hs * 0.98, w: b.w, size: sq ? 40 : 46, html: `<b>10 g</b> · ${E.t('v nabídce ve více barvách')}`, main: true, inAttr: 'data-in="up" data-d=".14"' });
    // the lure cycles colourways (same model, aligned by visible box)
    const cy = by + bh / 2, V = sq ? 760 : 860;
    const CW = [['impulse', 'Firetiger', '#f2b600'], ['lime', 'Electric Lime', '#9be22a']];
    const lures = CW.map(([k]) => `<div class="cy">${prod(E, k, { cx: 600, cy: 300, V, rot: -6, maxUp: 1.3, sweep: k === 'impulse', drop: '0 26px 24px rgba(10,30,0,.40)' }).html}</div>`).join('');
    html += `<div class="abs" data-in="right" data-dist="140" data-cycle="0.5" data-d="0.35" data-rest="0" style="left:${R1(E.W / 2 - 600 - 20)}px;top:${R1(cy - 300)}px;width:1200px;height:600px">${lures}</div>`;
    // colour name pill (synced) + Target Spoon card
    const ns = sq ? 28 : 31, nh = ns * 2, ny = b.b - nh - (sq ? 0 : 6);
    const names = CW.map(([, n, dot]) => `<div class="cy"><div class="t ft-pill ol" style="left:0;top:0;height:${R1(nh)}px;padding:0 ${R1(ns * 0.8)}px;font-size:${ns}px"><i style="display:inline-block;width:.6em;height:.6em;border-radius:50%;background:${dot};margin-right:.45em;box-shadow:0 0 0 2px rgba(0,0,0,.08)"></i>${E.t(n)}</div></div>`).join('');
    txt += `<div class="abs" data-cycle="0.5" data-d="0.35" data-rest="0" style="left:${R1(b.x)}px;top:${R1(ny)}px;width:${R1(b.w * 0.5)}px;height:${R1(nh)}px">${names}</div>`;
    const cw = sq ? 380 : 420, chh = sq ? 150 : 190, cx0 = b.r - cw, cyy = b.b - chh;
    html += `<div class="ft-card" data-in="up" data-dist="40" data-d=".3" style="left:${R1(cx0)}px;top:${R1(cyy)}px;width:${cw}px;height:${chh}px"><i class="edge" style="background:${C.sm}"></i></div>`;
    html += prodIn(E, 'spoon', { x: cx0 + 18, y: cyy + 10, w: chh * 0.62, h: chh - 20 }, { rot: 10, attrs: 'data-in="scale" data-d=".38"', drop: '0 8px 8px rgba(0,0,0,.22)' }).html;
    const tx = cx0 + 22 + chh * 0.62 + 10;
    txt += T(E, { cls: 'ft-k', x: tx, y: cyy + chh / 2 - (sq ? 44 : 52), w: cx0 + cw - tx - 14, size: sq ? 26 : 30, fit: 16, text: 'Target Spoon', style: `color:${C.ink};letter-spacing:.04em`, inAttr: 'data-in="up" data-d=".36"' });
    txt += T(E, { cls: 'ft-s', x: tx, y: cyy + chh / 2 - 6, w: cx0 + cw - tx - 14, size: sq ? 22 : 25, lines: 2, html: `${E.t('1,5 g · plandavka')}<br>${E.t('pro trout area')}`, style: 'line-height:1.15', inAttr: 'data-in="up" data-d=".4"' });
    return { html: html + txt };
  },

  // 4 — MČR: FT Fishing gives prizes to the championship; logo + URL + the three brands + a shelf of gear
  mcr(E) {
    const b = E.body, sq = E.kind === 'square';
    let html = frame(E), txt = '';
    txt += T(E, { cls: 'ft-k ft-tag', x: b.x, y: b.y + 4, w: b.w, size: sq ? 24 : 27, text: 'Mistrovství ČR v Trout Area 2026', inAttr: 'data-in="left"' });
    const hs = sq ? 140 : 160;
    let y = b.y + (sq ? 48 : 56);
    txt += T(E, { cls: 'ft-h', x: b.x - 4, y, w: b.w, size: hs, fit: 80, html: `Věnuje <em>ceny</em>`, main: true, inAttr: 'data-in="slam" data-d=".05"' });
    y += hs * 0.98;
    txt += T(E, { cls: 'ft-s', x: b.x, y, w: b.w, size: sq ? 40 : 46, text: 'pro závodníky mistrovství', main: true, style: `color:${C.ink}`, inAttr: 'data-in="up" data-d=".14"' });
    y += (sq ? 40 : 46) * 1.2 + (sq ? 26 : 44);
    const L = ftLogo(E, { x: b.x, y, maxH: 999, attrs: 'data-in="scale" data-d=".18"' });
    txt += L.html;
    const us = sq ? 76 : 84, ux = b.x + L.w + 30;
    txt += T(E, { cls: 'ft-url', x: ux, y: y + L.h / 2 - us * 0.8, w: b.r - ux, size: us, fit: 44, html: `ftfishing<b>.cz</b>`, main: true, inAttr: 'data-in="left" data-d=".22"' });
    txt += brandRow(E, { x: ux, y: y + L.h / 2 + us * 0.42, w: Math.min(b.r - ux, 600), h: sq ? 62 : 70, d: 0.28, gap: 26 });
    y += L.h + (sq ? 18 : 40);
    // shelf: gear from the three brands on a green stripe band
    const shelfY = b.b - 14;
    html += `<div class="ft-band" data-in="wipe-l" data-d=".2" style="left:${R1(b.x)}px;top:${R1(shelfY)}px;width:${R1(b.w)}px;height:14px"></div>`;
    const row = [['x1', 0, 1.0], ['spoon', 8, 0.7], ['impulse', -6, 1.5], ['vibro', -8, 1.4], ['king', 6, 1.2]];
    const tot = row.reduce((a, r) => a + r[2], 0);
    let xx = b.x;
    row.forEach(([k, rot, f], i) => {
      const sw = b.w * f / tot;
      html += prodIn(E, k, { x: xx + 8, y: y + 4, w: sw - 16, h: shelfY - y - 14 }, { rot, attrs: `data-in="scale" data-d="${(0.14 + i * 0.05).toFixed(2)}"`, maxUp: 1.2 }).html;
      xx += sw;
    });
    return { html: html + txt };
  },
};
