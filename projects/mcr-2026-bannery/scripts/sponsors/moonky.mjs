// MOONKY — sponsor module for the MČR 2026 banner engine. World = the film block „MOONLIGHT MACRO"
// (mcr-2026-sponzori/scripts/blocks/moonky.mjs + scripts/lib/fx_moonky.mjs, research/moonky_ad.md §3–5):
// Moonky night navy #0E1424 sky with stars, the moon as the only light (moonky.cz web blue #6883BA as cold moonlight),
// lime #9CC903 (Savory C06) as the one accent, Exo 2 900 italic caps (moonky.cz headings) + Source Sans 3 (moonky.cz body).
// Products = own-brand handmade soft lures, clean cut-outs assets_prep/moonky/ads/ (H1 = 4k Gamer Big) — many colours orbit the moon.
// Facts only from research/moonky.md (Verification) + research/moonky_ad.md §4 + vo/script_cs.json:
//   „Ručně dělané gumové nástrahy“ (HANDMADE LURES) · „pro Trout Area“ · „Vyvíjené a testované s českou reprezentací“ ·
//   „Od návrhu až po vlastní formy na CNC strojích“ · „Guma bez ftalátů“ (their claim) · „Vyrobeno v České republice“ (obal u02) ·
//   Gamer Big 46 mm · 2,12 g · extra měkká · Savory 43 mm · 1,05 g · tři ocásky.
//   Not used: „nejlepší“, „8 let“, counts of colours / items, a model name for S12, „Nástrahy, které pstruzi milují“ (only on a user photo).
// URL: moonky.cz (research/moonky.md Verification: re-fetched www.moonky.cz, /o-nas/, /gumove-nastrahy/). No operator photos (u0*.jpg) used.

export const brand = { name: 'Moonky', url: 'moonky.cz', role: 'sponsor' };

const C = { night: '#0E1424', deep: '#070A13', moon: '#FFFFFF', moonlight: '#6883BA', lime: '#9CC903', grey: '#E2E2E2', ice: '#c9d4ee' };
export const theme = {
  bg: C.night,
  taTone: 'dark',
  chrome: {
    url: C.moon, urlFont: "'Exo 2'", urlW: 800, sub: C.ice, dot: C.lime,
    chipBg: 'rgba(156,201,3,.12)', chipLine: 'rgba(156,201,3,.6)', chipFg: '#f4fbe0', event: 'rgba(226,230,242,.9)',
  },
};
export const fonts = {};   // Exo 2 (normal + italic) and Source Sans 3 are in the engine registry

// 10 s seamless loop: poster at rest on the first and last frame
export const anim = {
  seq: [
    { scene: 'poster', d: 2.3 },
    { scene: 'range', d: 2.0 },
    { scene: 'hero', d: 2.0 },
    { scene: 'mcr', d: 1.9 },
    { scene: 'poster', d: 1.8 },
  ],
};

// ---------- products (fx_moonky.mjs LURES: alpha centroid, major-axis angle, length / thickness in native px; names = moonky.cz) ----------
const AD = 'film:assets_prep/moonky/ads/';
const LURES = {
  h1: { f: 'H1_gamer_big_dc03_brown_orange.png', w: 2544, h: 1006, cen: [0.533, 0.478], ang: -2.2, L: 2406, T: 815, name: 'Gamer Big', code: 'DC03', col: 'Brown / Orange', dom: '#f7940d' },
  h2: { f: 'H2_savory_c06_green.png', w: 2005, h: 586, cen: [0.535, 0.532], ang: -1.3, L: 1887, T: 462, name: 'Savory', code: 'C06', col: 'Green', dom: '#9CC903' },
  h3: { f: 'H3_coccon_jr_c04_black.png', w: 2268, h: 1330, cen: [0.572, 0.41], ang: 21.6, L: 2246, T: 893, name: 'Coccon Jr.', code: 'C04', col: 'Black', dom: '#8e9092' },
  s1: { f: 'S1_savory_c01_pink_bubblegum.png', w: 2089, h: 885, cen: [0.533, 0.589], ang: 11.9, L: 1978, T: 518, name: 'Savory', code: 'C01', col: 'Pink Bubblegum', dom: '#EC638B' },
  s2: { f: 'S2_savory_c02_orange_fluo.png', w: 1485, h: 1385, cen: [0.594, 0.476], ang: 42.4, L: 1772, T: 603, name: 'Savory', code: 'C02', col: 'Orange fluo', dom: '#F49E0B' },
  s3: { f: 'S3_savory_c03_brown_metalic.png', w: 2077, h: 958, cen: [0.534, 0.584], ang: 15.3, L: 1976, T: 524, name: 'Savory', code: 'C03', col: 'Brown metalic', dom: '#734545' },
  s4: { f: 'S4_savory_c04_black.png', w: 1693, h: 1029, cen: [0.573, 0.421], ang: 22.2, L: 1718, T: 779, name: 'Savory', code: 'C04', col: 'Black', dom: '#8e9092' },
  s5: { f: 'S5_savory_dc03_brown_orange.png', w: 2100, h: 1703, cen: [0.594, 0.421], ang: 35.3, L: 2422, T: 961, name: 'Savory', code: 'DC03', col: 'Brown / Orange', dom: '#f7940d' },
  s6: { f: 'S6_scelet_c01_pink_bubblegum.png', w: 1168, h: 430, cen: [0.583, 0.464], ang: 10.5, L: 1099, T: 331, name: 'Scelet', code: 'C01', col: 'Pink Bubblegum', dom: '#EC638B' },
  s7: { f: 'S7_coccon_dc04_yellow_orange.png', w: 1189, h: 781, cen: [0.585, 0.403], ang: 28.6, L: 1228, T: 460, name: 'Coccon', code: 'DC04', col: 'Yellow / Orange', dom: '#D2BA46' },
  s8: { f: 'S8_scelet_jr_c08_coffee_milk.png', w: 1015, h: 480, cen: [0.598, 0.484], ang: 21.4, L: 1015, T: 330, name: 'Scelet Jr.', code: 'C08', col: 'Coffee milk', dom: '#b89a72' },
  s9: { f: 'S9_coccon_c02_orange_fluo.png', w: 982, h: 600, cen: [0.572, 0.405], ang: 25.8, L: 985, T: 362, name: 'Coccon', code: 'C02', col: 'Orange fluo', dom: '#F49E0B' },
  s10: { f: 'S10_master_c05_white.png', w: 2120, h: 895, cen: [0.559, 0.437], ang: -10.5, L: 1978, T: 738, name: 'Master', code: 'C05', col: 'White', dom: '#E2E2E2' },
  s11: { f: 'S11_gamer_big_c01_pink_bubblegum.png', w: 911, h: 340, cen: [0.535, 0.492], ang: -2.9, L: 862, T: 266, name: 'Gamer Big', code: 'C01', col: 'Pink Bubblegum', dom: '#EC638B' },
  s12: { f: 'S12_gradient_blue_pink.png', w: 891, h: 269, cen: [0.52, 0.55], ang: -0.9, L: 840, T: 219, name: null, dom: '#1184B8' },   // model not named → never labelled
};
for (const l of Object.values(LURES)) l.src = AD + l.f;
const LOGO = 'film:assets_prep/moonky/logo_on_dark.png', LOGO_TRIM = [40, 40, 1998, 509];
// ring of colours round the moon (≥ 8 colours): pink, green, orange, black, white, yellow/orange, coffee, blue/pink
const RING = ['s1', 'h2', 's2', 's4', 's10', 's7', 's8', 's12', 's6', 's9'];

export function css() {
  return `
.mk-sky{background:radial-gradient(105% 62% at var(--mx,50%) var(--my,47%),#1d2a47 0%,#1a2541 12%,#16203a 24%,#121b31 36%,#0E1424 50%,#0b1020 64%,#080c19 78%,#060912 90%,#04060c 100%)}
.mk-moon{position:absolute;border-radius:50%}
.mk-k{font-family:'Source Sans 3';font-weight:700;text-transform:uppercase;letter-spacing:.2em;color:${C.lime};line-height:1}
.mk-h{font-family:'Exo 2';font-weight:900;font-style:italic;text-transform:uppercase;letter-spacing:-.01em;color:#fff;line-height:.98}
.mk-h em{font-style:italic;color:${C.lime}}
.mk-p{font-family:'Source Sans 3';font-weight:600;color:#e6ebf7;line-height:1.22;white-space:normal}
.mk-hl{font-family:'Source Sans 3';font-weight:300;text-transform:uppercase;letter-spacing:.42em;color:${C.ice};line-height:1}
.mk-glass{position:absolute;border-radius:24px;background:rgba(255,255,255,.075);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.2),inset 0 1.5px 0 rgba(255,255,255,.26),0 22px 48px rgba(2,4,10,.42)}
.mk-tile{position:absolute;border-radius:22px;background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.025));box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.14);overflow:hidden}
.mk-tn{position:absolute;left:0;text-align:center;font-family:'Exo 2';font-weight:800;font-style:italic;text-transform:uppercase;color:#fff;line-height:1}
.mk-tc{position:absolute;left:0;text-align:center;font-family:'Source Sans 3';font-weight:600;color:${C.ice};line-height:1}
.mk-sep{position:absolute;width:1.5px;background:rgba(255,255,255,.26)}
.mk-cv{position:absolute;font-family:'Exo 2';font-weight:800;font-style:italic;color:#fff;line-height:1}
.mk-cl{position:absolute;font-family:'Source Sans 3';font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.66);line-height:1}
.mk-li{position:absolute;display:flex;align-items:center;gap:.6em;font-family:'Source Sans 3';font-weight:700;color:#fff;line-height:1.1}
.mk-li i{display:block;flex:none;width:.42em;height:.42em;border-radius:50%;background:${C.lime};box-shadow:0 0 0 .16em rgba(156,201,3,.22)}
.mk-sw{position:absolute;inset:0;overflow:hidden;-webkit-mask-size:100% 100%;mask-size:100% 100%;mix-blend-mode:screen;pointer-events:none}
.mk-sw i{position:absolute;top:0;bottom:0;left:-130%;width:70%;background:linear-gradient(105deg,rgba(255,255,255,0) 38%,rgba(214,226,255,.42) 50%,rgba(255,255,255,0) 62%)}
.mk-sh{position:absolute;border-radius:50%;background:radial-gradient(closest-side,rgba(2,4,10,.7),rgba(2,4,10,.3) 60%,rgba(2,4,10,0))}
`;
}

// ---------- helpers ----------
const R1 = (n) => Math.round(n * 10) / 10;
const rnd = (s) => { const x = Math.sin(s * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
const T = (E, { cls, x, y, w, size, text, html, align = 'left', fit = 0, lines = 0, main = false, inAttr = '', style = '', id = '' }) =>
  `<div ${id ? `id="${id}" ` : ''}class="t ${cls}${main ? ' main' : ''}" ${inAttr} ${fit ? `data-fit="${fit}"` : ''} ${lines ? `data-lines="${lines}"` : ''} style="left:${R1(x)}px;top:${R1(y)}px;width:${R1(w)}px;font-size:${size}px;text-align:${align};${lines ? 'white-space:normal;' : 'overflow:hidden;'}${style}">${html ?? E.t(text)}</div>`;

// night sky + star field (one element, seeded box-shadows) — moon position steers the sky's light centre
function sky(E, { mx = 50, my = 47, n = 60, seed = 11 } = {}) {
  const st = [];
  for (let i = 0; i < n; i++) {
    const x = Math.round(10 + rnd(seed + i * 3.1) * (E.W - 20)), y = Math.round(10 + rnd(seed * 7 + i * 5.3) * (E.H - 20));
    const big = rnd(seed + i * 11.7), sp = big > 0.92 ? 1.6 : big > 0.7 ? 0.8 : 0.2, a = (0.22 + 0.55 * rnd(seed * 3 + i * 2.2)).toFixed(2);
    st.push(`${x}px ${y}px 0 ${sp}px rgba(220,230,255,${a})`);
  }
  return `<div class="full mk-sky" style="--mx:${mx}%;--my:${my}%"></div><div class="abs" data-pan="0,-14" style="left:0;top:0;width:2px;height:2px;border-radius:50%;box-shadow:${st.join(',')}"></div>`;
}
// the moon (fx_moonky.moon): glow + earthshine ring + lit disk masked by a shadow circle; ph 0 = new … 2.3 = full
function moon(E, { cx, cy, r, ph = 1.2, glow = 0.7, attrs = 'data-in="scale" data-dur="0.9"' }) {
  const sx = r - ph * r, soft = Math.max(4, r * 0.03), gs = r * 6.2;
  const m = `radial-gradient(circle ${R1(r + soft)}px at ${R1(sx)}px 50%, transparent ${R1(r - soft)}px, #000 ${R1(r + soft)}px)`;
  const disk = [
    'radial-gradient(circle at 63% 37%, rgba(104,131,186,.30) 0, rgba(104,131,186,.20) 7%, transparent 12%)',
    'radial-gradient(circle at 44% 63%, rgba(104,131,186,.26) 0, rgba(104,131,186,.16) 10%, transparent 17%)',
    'radial-gradient(circle at 70% 69%, rgba(104,131,186,.20) 0, transparent 9%)',
    'radial-gradient(circle at 30% 34%, rgba(104,131,186,.14) 0, transparent 8%)',
    'radial-gradient(circle at 40% 35%, #ffffff 0%, #f1f4fb 26%, #d6def0 56%, #a9badd 84%, #8399c8 100%)',
  ].join(',');
  return `<div class="abs" ${attrs} style="left:0;top:0;width:${E.W}px;height:${E.H}px">
    <div class="abs" style="left:${R1(cx - gs / 2)}px;top:${R1(cy - gs / 2)}px;width:${R1(gs)}px;height:${R1(gs)}px;border-radius:50%;background:radial-gradient(closest-side,rgba(150,172,222,.55),rgba(104,131,186,.26) 34%,rgba(104,131,186,.08) 62%,rgba(104,131,186,0));opacity:${glow}"></div>
    <div class="mk-moon" style="left:${R1(cx - r)}px;top:${R1(cy - r)}px;width:${R1(2 * r)}px;height:${R1(2 * r)}px;background:radial-gradient(circle at 40% 38%,rgba(150,170,214,.16),rgba(104,131,186,.07));box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.16)"></div>
    <div class="mk-moon" style="left:${R1(cx - r)}px;top:${R1(cy - r)}px;width:${R1(2 * r)}px;height:${R1(2 * r)}px;background:${disk};box-shadow:0 0 ${R1(r * 0.3)}px rgba(170,190,235,.28);-webkit-mask-image:${m};mask-image:${m}"></div>
  </div>`;
}
// lure cut-out placed by its alpha centroid, major axis rotated onto `angle` (deg), visible length `len` px — never upscaled
function lure(E, k, { cx, cy, len, angle = 0, attrs = '', shadow = 0, sweep = false, float = '', z = '' }) {
  const m = LURES[k];
  const s = Math.min(len / m.L, 1), w = m.w * s, h = m.h * s, ox = m.cen[0] * w, oy = m.cen[1] * h;
  const rot = angle - m.ang, url = E.src(m.src);
  const L = m.L * s, Tk = m.T * s;
  const sh = shadow ? `<div class="mk-sh" style="left:${R1(cx - L * 0.42)}px;top:${R1(cy + Tk * 0.45)}px;width:${R1(L * 0.84)}px;height:${R1(Math.max(18, Tk * 0.3))}px;opacity:${shadow};filter:blur(${R1(Math.max(6, Tk * 0.06))}px)"></div>` : '';
  const inner = `<div class="abs" style="left:0;top:0;width:${R1(w)}px;height:${R1(h)}px;transform:rotate(${rot.toFixed(2)}deg);transform-origin:${R1(ox)}px ${R1(oy)}px"><img src="${url}" alt="" style="position:absolute;inset:0;width:100%;height:100%">${sweep ? `<div class="mk-sw" style="-webkit-mask-image:url(${url});mask-image:url(${url})"><i data-sweep="${sweep}"></i></div>` : ''}</div>`;
  const fl = float ? `<div class="abs" data-float="${float}" style="left:0;top:0;width:${R1(w)}px;height:${R1(h)}px">${inner}</div>` : inner;
  return { html: `${sh}<div class="abs" ${attrs} style="left:${R1(cx - ox)}px;top:${R1(cy - oy)}px;width:${R1(w)}px;height:${R1(h)}px;${z}">${fl}</div>`, L, T: Tk, s };
}
// ring of lures orbiting the moon (film bar 3 „ORBIT"): items on an ellipse, larger in front (bottom), each with its own float
function ring(E, { cx, cy, rx, ry, keys = RING, len, a0 = -90, d0 = 0.1, skip = [] }) {
  let back = '', front = '';
  keys.forEach((k, i) => {
    const a = a0 + (360 / keys.length) * i;
    if (skip.some(([lo, hi]) => { const aa = ((a % 360) + 360) % 360; return aa >= lo && aa <= hi; })) return;
    const rad = (a * Math.PI) / 180, x = cx + rx * Math.cos(rad), y = cy + ry * Math.sin(rad), depth = (Math.sin(rad) + 1) / 2;   // 0 back … 1 front
    const ll = len * (0.78 + 0.34 * depth), ang = -18 + 36 * rnd(i * 4.7 + 1);
    const L = lure(E, k, { cx: x, cy: y, len: ll, angle: ang, float: `${(4 + 4 * rnd(i + 3)).toFixed(1)},${(2.5 + i % 3 * 1.25).toFixed(2)}`, attrs: `data-in="scale" data-dur="0.6" data-d="${(d0 + 0.04 * i).toFixed(2)}"` });
    if (depth < 0.5) back += L.html; else front += L.html;
  });
  return { back, front };
}
// glass spec row (fx_moonky.specBar): cells [{label, value}] split by hairlines, lime tab on the left
function specBar(E, { x, y, w, h, cells, vs, ls, attrs = '' }) {
  const cw = w / cells.length;
  let inner = '';
  cells.forEach((c, i) => {
    const pad = Math.min(30, cw * 0.12);
    if (i) inner += `<i class="mk-sep" style="left:${R1(cw * i)}px;top:${R1(h * 0.22)}px;height:${R1(h * 0.56)}px"></i>`;
    inner += `<div class="t mk-cl" style="left:${R1(cw * i + pad)}px;top:${R1(h / 2 - ls - vs * 0.42)}px;width:${R1(cw - pad * 1.4)}px;font-size:${ls}px;overflow:hidden" data-fit="14">${E.t(c.label)}</div>`;
    inner += `<div class="t mk-cv${vs >= 40 ? ' main' : ''}" style="left:${R1(cw * i + pad)}px;top:${R1(h / 2 - vs * 0.22)}px;width:${R1(cw - pad * 1.4)}px;font-size:${vs}px;overflow:hidden;padding-right:.1em" data-fit="26">${E.t(c.value)}</div>`;
  });
  return `<div class="mk-glass" ${attrs} style="left:${R1(x)}px;top:${R1(y)}px;width:${R1(w)}px;height:${R1(h)}px">${inner}<i class="abs" style="left:0;top:26%;bottom:26%;width:6px;border-radius:0 6px 6px 0;background:${C.lime}"></i></div>`;
}
const logoH = (E) => E.logoFit(LOGO_TRIM[2] / LOGO_TRIM[3]).h;

// ---------- scenes ----------
export const scenes = {
  // POSTER (1:1 / 4:5 / 1.91:1 / 9:16 + loop start/end): the moon with a ring of colours, Gamer Big DC03 as the hero in front
  poster(E) {
    const b = E.body, k = E.kind;
    let txt = '';
    if (k === 'wide') {
      const colW = 560;
      const lh = logoH(E);
      txt += E.logo(LOGO, { x: b.x, y: b.y + 6, trim: LOGO_TRIM, attrs: 'data-in="fade"' }).html;
      txt += T(E, { cls: 'mk-hl', x: b.x + 2, y: b.y + 6 + lh + 12, w: colW, size: 17, text: 'Handmade lures', inAttr: 'data-in="left" data-d=".1"' });
      let y = b.y + 6 + lh + 52;
      txt += T(E, { cls: 'mk-h', x: b.x - 2, y, w: colW, size: 66, fit: 44, html: '<em>Ručně dělané</em>', inAttr: 'data-in="slam" data-d=".12"', main: true });
      y += 66;
      txt += T(E, { cls: 'mk-h', x: b.x - 2, y, w: colW, size: 66, fit: 44, text: 'gumové nástrahy', inAttr: 'data-in="slam" data-d=".18"', main: true });
      y += 66 + 14;
      txt += T(E, { cls: 'mk-p', x: b.x, y, w: colW, size: 27, lines: 2, text: 'Pro Trout Area · vyvíjené a testované s českou reprezentací', inAttr: 'data-in="up" data-d=".3"' });
      const mcx = b.x + colW + (b.r - b.x - colW) / 2 + 10, mcy = b.y + b.h * 0.5, r = 118;
      const R = ring(E, { cx: mcx, cy: mcy, rx: 205, ry: 150, len: 120, keys: RING.slice(0, 9), skip: [[150, 210]] });
      const H = lure(E, 'h1', { cx: mcx - 6, cy: mcy + 18, len: 330, angle: -8, shadow: 0.85, sweep: '0.3,1.2', attrs: 'data-in="rise" data-d=".05"' });
      return { html: sky(E, { mx: (mcx / E.W) * 100, my: (mcy / E.H) * 100 }) + moon(E, { cx: mcx, cy: mcy - 18, r, ph: 1.25 }) + R.back + H.html + R.front + txt };
    }
    const S = k === 'square' ? { hs: 92, ps: 32, hl: 20, gap: 14 } : k === 'portrait' ? { hs: 104, ps: 36, hl: 22, gap: 18 } : { hs: 116, ps: 40, hl: 24, gap: 24 };
    const lh = logoH(E);
    let y = b.y + (k === 'tall' ? 10 : 2);
    txt += E.logo(LOGO, { x: b.x, y, trim: LOGO_TRIM, attrs: 'data-in="fade"' }).html;
    txt += T(E, { cls: 'mk-hl', x: b.x + 330, y: y + lh / 2 - S.hl * 0.5, w: b.r - b.x - 330, size: S.hl, text: 'Handmade lures', align: 'right', inAttr: 'data-in="right" data-d=".1"' });
    y += lh + S.gap + 8;
    txt += T(E, { cls: 'mk-h', x: b.x - 4, y, w: b.w, size: S.hs, fit: 50, html: '<em>Ručně dělané</em>', inAttr: 'data-in="slam" data-d=".12"', main: true });
    y += S.hs * 0.98;
    txt += T(E, { cls: 'mk-h', x: b.x - 4, y, w: b.w, size: S.hs, fit: 50, text: 'gumové nástrahy', inAttr: 'data-in="slam" data-d=".18"', main: true });
    y += S.hs * 0.98 + S.gap;
    const two = k === 'tall';
    txt += T(E, { cls: 'mk-p', x: b.x, y, w: two ? b.w * 0.8 : b.w, size: S.ps, ...(two ? { lines: 2 } : { fit: 24, style: 'white-space:nowrap' }), text: 'Pro Trout Area · vyvíjené a testované s českou reprezentací', inAttr: 'data-in="up" data-d=".3"' });
    y += S.ps * 1.22 * (two ? 2 : 1) + S.gap;
    // stage: moon + ring + hero fill the rest of the body
    const st = { x: b.x, y, w: b.w, h: b.b - y };
    const mcx = st.x + st.w / 2, mcy = st.y + st.h * 0.5, r = Math.min(st.h * 0.3, 230);
    const rx = st.w * 0.4, ry = Math.min(st.h * 0.36, rx * 0.62);
    const R = ring(E, { cx: mcx, cy: mcy, rx, ry, len: k === 'square' ? 150 : k === 'portrait' ? 175 : 200 });
    const H = lure(E, 'h1', { cx: mcx, cy: mcy + r * 0.12, len: Math.min(st.w * 0.6, k === 'square' ? 560 : 680), angle: -8, shadow: 0.85, sweep: '0.3,1.2', attrs: 'data-in="rise" data-d=".05"' });
    return { html: sky(E, { mx: 50, my: (mcy / E.H) * 100 }) + moon(E, { cx: mcx, cy: mcy - r * 0.1, r, ph: 1.25 }) + R.back + H.html + R.front + txt };
  },

  // 1 — WHO: Czech maker of handmade soft lures; verified facts as a list; crescent moon + Savory C06 on the right
  who(E) {
    const b = E.body, sq = E.kind === 'square';
    const mcx = b.r - 120, mcy = b.y + b.h * 0.42, r = sq ? 170 : 200;
    let html = sky(E, { mx: (mcx / E.W) * 100, my: (mcy / E.H) * 100, seed: 23 }) + moon(E, { cx: mcx, cy: mcy, r, ph: 0.7, glow: 0.55 });
    html += lure(E, 'h2', { cx: mcx - 10, cy: mcy + r * 1.05, len: sq ? 360 : 420, angle: -30, shadow: 0, sweep: '0.3,1.2', attrs: 'data-in="left" data-d=".15"' }).html;
    html += lure(E, 's1', { cx: mcx + 10, cy: mcy + r * 1.85, len: sq ? 250 : 300, angle: -20, attrs: 'data-in="left" data-d=".22"' }).html;
    html += `<div class="full" style="background:linear-gradient(90deg,rgba(7,10,19,.82) 0%,rgba(7,10,19,.55) 42%,rgba(7,10,19,0) 64%)"></div>`;
    const lh = logoH(E), cw = b.w * (sq ? 0.66 : 0.7);
    const hs = sq ? 70 : 80, ps = sq ? 34 : 38, ls = sq ? 33 : 37, lg = sq ? 54 : 66;
    const facts = ['Od návrhu po vlastní CNC formy', 'Vyvíjené a testované s českou reprezentací', 'Guma bez ftalátů', 'Vyrobeno v České republice'];
    const blockH = lh + 16 + 24 + 34 + hs * 0.98 * 2 + 22 + ps * 1.22 * 2 + 30 + lg * facts.length;
    let y = b.y + Math.max(4, (b.h - blockH) / 2);
    html += E.logo(LOGO, { x: b.x, y, trim: LOGO_TRIM, attrs: 'data-in="scale"' }).html;
    y += lh + 16;
    html += T(E, { cls: 'mk-hl', x: b.x + 2, y, w: cw, size: 22, text: 'Handmade lures', inAttr: 'data-in="left" data-d=".08"' });
    y += 24 + 34;
    html += T(E, { cls: 'mk-h', x: b.x - 3, y, w: cw, size: hs, fit: 44, html: '<em>Ručně dělané</em>', inAttr: 'data-in="left" data-d=".12"', main: true });
    y += hs * 0.98;
    html += T(E, { cls: 'mk-h', x: b.x - 3, y, w: cw, size: hs, fit: 44, text: 'gumové nástrahy', inAttr: 'data-in="left" data-d=".16"', main: true });
    y += hs * 0.98 + 22;
    html += T(E, { cls: 'mk-p', x: b.x, y, w: cw, size: ps, lines: 2, text: 'Český výrobce nástrah pro lov pstruhů a Trout Area.', inAttr: 'data-in="up" data-d=".24"' });
    y += ps * 1.22 * 2 + 30;
    facts.forEach((f, i) => {
      html += `<div class="t mk-li" data-in="up" data-d="${(0.3 + i * 0.07).toFixed(2)}" data-fit="24" style="left:${R1(b.x)}px;top:${R1(y)}px;width:${R1(cw)}px;font-size:${ls}px;overflow:hidden"><i></i>${E.t(f)}</div>`;
      y += lg;
    });
    return { html };
  },

  // 2 — RANGE: own models in many colours (labels = product titles on moonky.cz; no counts)
  range(E) {
    const b = E.body, sq = E.kind === 'square';
    let html = sky(E, { mx: 50, my: 30, seed: 31 });
    const hs = sq ? 66 : 76;
    html += T(E, { cls: 'mk-k', x: b.x, y: b.y + 4, w: b.w, size: 26, text: 'Gumové nástrahy Moonky', inAttr: 'data-in="left"' });
    html += T(E, { cls: 'mk-h', x: b.x - 3, y: b.y + 42, w: b.w, size: hs, fit: 44, html: 'Tvary i <em>barvy</em> pro Trout Area', inAttr: 'data-in="up" data-d=".06"', main: true });
    const keys = ['h2', 'h1', 's6', 's7', 's4', 's8', 's10', 's2'];
    const cols = sq ? 4 : 2, rows = Math.ceil(keys.length / cols), gap = 14;
    const gy = b.y + 42 + hs * 1.18, tw = (b.w - gap * (cols - 1)) / cols, th = (b.b - gy - gap * (rows - 1)) / rows;
    const ns = sq ? 30 : 34, cs = sq ? 22 : 25;
    keys.forEach((kk, i) => {
      const m = LURES[kk], x = b.x + (i % cols) * (tw + gap), y = gy + Math.floor(i / cols) * (th + gap);
      const labH = ns + cs + 26, ih = th - labH - 10, iw = tw - 22;
      const len = Math.min(iw, (ih / m.T) * m.L * 0.7);
      const l = lure(E, kk, { cx: tw / 2, cy: 10 + ih / 2, len, angle: sq ? -8 : -4 });
      html += `<div class="mk-tile" data-in="up" data-dist="30" data-d="${(0.1 + i * 0.05).toFixed(2)}" style="left:${R1(x)}px;top:${R1(y)}px;width:${R1(tw)}px;height:${R1(th)}px">
        <i class="abs" style="left:${R1(tw * 0.2)}px;top:${R1(10 + ih * 0.05)}px;width:${R1(tw * 0.6)}px;height:${R1(ih * 0.9)}px;border-radius:50%;background:radial-gradient(closest-side,${E.hex2rgba(m.dom, 0.28)},${E.hex2rgba(m.dom, 0)})"></i>
        ${l.html}
        <div class="t mk-tn" data-fit="18" style="top:${R1(th - labH + 4)}px;width:${R1(tw)}px;font-size:${ns}px">${E.t(m.name)}</div>
        <div class="t mk-tc" data-fit="14" style="top:${R1(th - labH + 4 + ns + 10)}px;width:${R1(tw)}px;font-size:${cs}px;padding:0 10px">${E.t(`${m.code} · ${m.col}`)}</div></div>`;
    });
    return { html };
  },

  // 3 — HERO: Gamer Big DC03, macro-big in moonlight, verified spec row (46 mm · 2,12 g · extra měkká)
  hero(E) {
    const b = E.body, sq = E.kind === 'square';
    const hs = sq ? 104 : 120;
    let txt = '';
    txt += T(E, { cls: 'mk-k', x: b.x, y: b.y + 4, w: b.w, size: 26, text: 'DC03 · Brown metalic / Orange fluo', inAttr: 'data-in="left"' });
    txt += T(E, { cls: 'mk-h', x: b.x - 4, y: b.y + 42, w: b.w, size: hs, fit: 60, html: 'Gamer <em>Big</em>', inAttr: 'data-in="slam" data-d=".06"', main: true });
    const barH = sq ? 120 : 136, barY = b.b - barH;
    txt += specBar(E, { x: b.x, y: barY, w: b.w, h: barH, vs: sq ? 46 : 52, ls: sq ? 20 : 22, attrs: 'data-in="wipe-r" data-d=".25"',
      cells: [{ label: 'Délka', value: '46 mm' }, { label: 'Hmotnost', value: '2,12 g' }, { label: 'Guma', value: 'Extra měkká' }] });
    txt += T(E, { cls: 'mk-p', x: b.x, y: barY - (sq ? 52 : 60), w: b.w, size: sq ? 30 : 34, fit: 22, text: 'Ručně dělaná · plovoucí tělo · vyrobeno v ČR', style: `color:${C.ice}`, inAttr: 'data-in="up" data-d=".2"' });
    const top = b.y + 42 + hs, bot = barY - (sq ? 60 : 70);
    const mcx = b.x + b.w * 0.62, mcy = top + (bot - top) * 0.5, r = Math.min((bot - top) * 0.46, 250);
    const H = lure(E, 'h1', { cx: b.x + b.w * 0.5, cy: mcy + 10, len: Math.min(b.w * 1.02, ((bot - top) / LURES.h1.T) * LURES.h1.L * 0.8), angle: -6, shadow: 0.9, sweep: '0.2,1.1', attrs: 'data-in="scale" data-kb="1,1.04"' });
    return { html: sky(E, { mx: (mcx / E.W) * 100, my: (mcy / E.H) * 100, seed: 41 }) + moon(E, { cx: mcx, cy: mcy - 16, r, ph: 1.7, glow: 0.8 }) + H.html + txt };
  },

  // 4 — MČR: full moon, lures orbit it, „Moonky věnuje ceny" + moonky.cz (chip + event line from the engine)
  mcr(E) {
    const b = E.body, sq = E.kind === 'square';
    let txt = '';
    const hs = sq ? 96 : 110;
    txt += T(E, { cls: 'mk-k', x: b.x, y: b.y + 4, w: b.w, size: 26, text: 'Partner MČR v Trout Area 2026', inAttr: 'data-in="left"' });
    txt += T(E, { cls: 'mk-h', x: b.x - 4, y: b.y + 42, w: b.w, size: hs, fit: 56, html: 'Moonky <em>věnuje</em> ceny', inAttr: 'data-in="slam" data-d=".06"', main: true });
    const lh = logoH(E), us = sq ? 64 : 72;
    // lockup at the bottom: logo + URL
    const ly = b.b - lh - 4;
    txt += E.logo(LOGO, { x: b.x, y: ly, trim: LOGO_TRIM, attrs: 'data-in="fade" data-d=".3"' }).html;
    txt += T(E, { cls: 'mk-h', x: b.x + 330, y: ly + lh / 2 - us * 0.5, w: b.r - b.x - 330, size: us, fit: 40, align: 'right', html: 'moonky<em>.cz</em>', inAttr: 'data-in="right" data-d=".34"', main: true, style: 'text-transform:none' });
    const top = b.y + 42 + hs * 1.05, bot = ly - 20;
    const mcx = b.x + b.w / 2, mcy = top + (bot - top) / 2, r = Math.min((bot - top) * 0.3, 200);
    const R = ring(E, { cx: mcx, cy: mcy, rx: b.w * 0.4, ry: (bot - top) * 0.34, len: sq ? 140 : 165, a0: -70 });
    const H = lure(E, 'h2', { cx: mcx, cy: mcy + r * 0.15, len: Math.min(b.w * 0.5, 480), angle: -8, shadow: 0.7, sweep: '0.25,1.1', attrs: 'data-in="rise" data-d=".08"' });
    return { html: sky(E, { mx: 50, my: (mcy / E.H) * 100, seed: 53 }) + moon(E, { cx: mcx, cy: mcy - r * 0.1, r, ph: 2.3, glow: 0.85 }) + R.back + H.html + R.front + txt };
  },
};
