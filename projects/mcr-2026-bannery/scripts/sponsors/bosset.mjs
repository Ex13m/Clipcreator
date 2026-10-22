// BOSSET.CZ — sponsor module for the MČR 2026 banner engine (role: sponsor → chip „Věnuje ceny · MČR 2026“).
// World = the film block (mcr-2026-sponzori/scripts/blocks/bosset.mjs, research/bosset_ad.md §3): logo teal #1B97B1, deep teal
// #0A4A58 / abyss #052E37 studio with a teal glow behind the product, site light blue #C5EBFC as podium / shelf, site yellow #FFC500
// only as plates and hit words on DEEP teal (never yellow on #1B97B1), Saira Expanded Black (wdth 125 / wght 900) ≈ the squarish
// BOSSET lettering, tracked Saira captions ≈ the logo's „F I S H I N G“.
// Story: fishing e-shop (Keitech, YGK X-Braid + shelf of brands it SELLS) → winners' accent: top Zojirushi thermoses (podium).
// Facts only from research/bosset.md (Verification), research/bosset_brands.md §3, bosset_ad.md copy guardrails, vo/script_cs.json:
//   „Oficiální distributor Keitech a YGK X-Braid pro ČR“ (footer banner) · „přívlači se věnují víc než 20 let“ (/o-nas/) ·
//   „Expedujeme do 24h“ (footer, 3rd person) · termosky Zojirushi (operator 22. 10.: NO volume on screen — „jen termosky“) · „horké a studené až 6 hodin“ · „nerez · bez BPA“ ·
//   „Double Lock · otevřeš jednou rukou“ ONLY next to SM-VB / SM-SR visuals (so no orange SM-SHE anywhere in this set) ·
//   „špičkové termosky“ = operator's word (VO v3). NOT: prize models / count, Zojirushi origin, prices, item counts, „nejlepší“,
//   „více než 6 hodin“, brands presented as Bosset's own.

export const brand = { name: 'Bosset.cz', url: 'bosset.cz', role: 'sponsor' };

const C = { teal: '#1B97B1', mid: '#13788c', deep: '#0A4A58', abyss: '#052E37', sky: '#C5EBFC', yel: '#FFC500', ink: '#080C0E', white: '#ffffff', glow: '#3cc3dc' };
export const theme = {
  bg: C.deep,
  taTone: 'dark',
  chrome: { url: C.white, urlFont: "'Saira'", urlW: 800, sub: C.sky, dot: C.yel, chipBg: 'rgba(255,197,0,.14)', chipLine: 'rgba(255,197,0,.6)', chipFg: '#fff8dc', event: 'rgba(197,235,252,.9)' },
};
export const fonts = {};   // Saira (variable wght 100–900 × wdth 50–125 %) is in the engine registry

// 10 s seamless loop: poster at rest on the first and last frame
export const anim = {
  seq: [
    { scene: 'poster', d: 2.1 },
    { scene: 'range', d: 2.0 },
    { scene: 'hero', d: 2.0 },
    { scene: 'mcr', d: 2.0 },
    { scene: 'poster', d: 1.9 },
  ],
};

const AD = 'film:assets_prep/bosset/ads/', BR = 'film:assets_prep/bosset/brands/';
const LOGO = 'film:assets_prep/bosset/logo_on_dark.png', LOGO_TRIM = [40, 40, 2000, 322];
// cut-outs + transparent margins [l, t, r, b] (ads/manifest.json, ads/_lures_meta.json)
const P = {
  vbBlack: { src: `${AD}H1_zojirushi_sm-vb_0-6l_black.png`, pad: [0.0477, 0.0163, 0.0517, 0.0169] },
  srGreen: { src: `${AD}H2_zojirushi_sm-sr_0-6l_green.png`, pad: [0.0591, 0.0168, 0.0591, 0.0168] },
  srPink: { src: `${AD}S2_zojirushi_sm-sr_0-6l_pink.png`, pad: [0.059, 0.0162, 0.059, 0.0162] },
  srWhite: { src: `${AD}S3_zojirushi_sm-sr_0-6l_white.png`, pad: [0.0568, 0.0162, 0.0568, 0.0169] },
  vbGreen: { src: `${AD}S4_zojirushi_sm-vb_0-6l_green.png`, pad: [0.0477, 0.0163, 0.0497, 0.0169] },
  vbBeige: { src: `${AD}S5_zojirushi_sm-vb_0-6l_beige.png`, pad: [0.0499, 0.0163, 0.0499, 0.0163] },
};
const LURE = {
  shiner: `${AD}H3_keitech_easy_shiner_4in_ice_chartreuse_pal03t.png`, ygk: `${AD}S6_ygk_x-braid_upgrade_x8_150m.png`,
  L1: `${AD}L1_keitech_easy_shiner_4-5in_lime_chartreuse_424t.png`, L5: `${AD}L5_fresh_lures_flipworm_3-1in_122.png`,
  L8: `${AD}L8_select_dementor_130sp_13.png`, L9: `${AD}L9_decoy_round_magic_sv-52.png`,
  W1: `${AD}W1_zipbaits_orbit_110sp_510r.png`, W2: `${AD}W2_megabass_x-52_acrobat_f_shigyo.png`, W3: `${AD}W3_osp_asura_durga_73sp_s76.png`,
};
// brand shelf (research/bosset_brands.md §1 recommended set): logo on dark + the brand's no. 1 cut-out; trim = visible logo bbox
const SHELF = [
  { b: 'keitech_hires_on_dark.png', trim: [21, 21, 684, 142], p: LURE.L1, rot: -6 },
  { b: 'ygk_on_dark.png', trim: [26, 26, 861, 248], p: LURE.ygk, rot: 0 },
  { b: 'megabass_on_dark.png', trim: [10, 9, 285, 37], p: LURE.W2, rot: -5 },
  { b: 'zipbaits_on_dark.png', trim: [26, 26, 868, 169], p: LURE.W1, rot: -5 },
  { b: 'osp_on_dark.png', trim: [10, 10, 327, 139], p: LURE.W3, rot: -4 },
  { b: 'freshlures_on_dark.png', trim: [0, 0, 457, 457], p: LURE.L5, rot: -6 },
  { b: 'decoy_on_dark.png', trim: [8, 8, 253, 40], p: LURE.L9, rot: 0 },
  { b: 'select_on_dark.png', trim: [9, 9, 292, 70], p: LURE.L8, rot: -5 },
];

// brand strip on the poster (operator 22. 10.: show the brands the shop carries) — research/bosset_brands.md recommended order:
// distributor brands Keitech + YGK X-Braid first (heavier), JDM hard baits (MČR = hard baits), Decoy (area hooks)
const STRIP = [
  { f: `${BR}keitech_hires_on_dark.png`, s: 1.12 }, { f: `${BR}ygk_on_dark.png`, s: 1.12 }, { f: `${BR}zipbaits_on_dark.png` },
  { f: `${BR}megabass_on_dark.png` }, { f: `${BR}osp_on_dark.png` }, { f: `${BR}decoy_on_dark.png`, s: 0.92 },
];
const strip = (E, o) => E.brandStrip(o.items || STRIP, { label: 'Značky v nabídce', labelPos: 'top', labelCss: `font-family:Saira;font-weight:600;font-stretch:112%;letter-spacing:.2em;color:${C.sky}`, color: C.white, inAttr: 'data-in="up" data-d=".3" data-dist="30"', ...o });

export function css() {
  return `
.bo-k{font-family:Saira;font-weight:600;font-stretch:112%;text-transform:uppercase;letter-spacing:.2em;color:${C.sky}}
.bo-h{font-family:Saira;font-weight:900;font-stretch:125%;text-transform:uppercase;line-height:.96;color:${C.white};letter-spacing:-.005em}
.bo-h.y{color:${C.yel}}
.bo-s{font-family:Saira;font-weight:600;font-stretch:100%;color:${C.white};line-height:1.12}
.bo-p{font-family:Saira;font-weight:500;font-stretch:100%;color:${C.white};line-height:1.24;white-space:normal}
.bo-p b{font-weight:800;color:${C.yel}}
.bo-pill{display:inline-block;white-space:nowrap;border-radius:999px;background:${C.yel};color:${C.ink};font-family:Saira;font-weight:800;font-stretch:110%;text-transform:uppercase;letter-spacing:.08em;line-height:1.62;padding:0 .78em;box-shadow:0 10px 24px rgba(2,24,30,.35)}
.bo-pill.url{text-transform:none;letter-spacing:.02em;font-stretch:118%;font-weight:900}
.bo-pill.sk{background:${C.sky};color:${C.deep}}
.bo-pill.ol{background:rgba(5,46,55,.72);color:${C.white};box-shadow:inset 0 0 0 2px rgba(197,235,252,.55)}
.bo-beam{position:absolute;-webkit-mask-image:linear-gradient(90deg,transparent 0%,#000 30%,#000 78%,transparent 100%);mask-image:linear-gradient(90deg,transparent 0%,#000 30%,#000 78%,transparent 100%);background:linear-gradient(180deg,rgba(27,151,177,0) 0%,rgba(27,151,177,.55) 28%,rgba(60,195,220,.85) 50%,rgba(27,151,177,.55) 72%,rgba(27,151,177,0) 100%)}
.bo-glow{position:absolute;border-radius:50%;background:radial-gradient(closest-side,rgba(60,195,220,.55),rgba(60,195,220,.18) 55%,rgba(60,195,220,0))}
.bo-spot{position:absolute;-webkit-clip-path:polygon(44% 0,56% 0,100% 100%,0 100%);clip-path:polygon(44% 0,56% 0,100% 100%,0 100%);background:linear-gradient(180deg,rgba(220,246,255,.42) 0%,rgba(197,235,252,.12) 60%,rgba(197,235,252,0) 100%);mix-blend-mode:screen}
.bo-step{position:absolute}
.bo-step b{position:absolute;left:0;right:0;top:0;border-radius:8px 8px 0 0;background:linear-gradient(180deg,#f2fbff 0%,${C.sky} 70%,#9fd6ec 100%)}
.bo-step em{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(180deg,#2aa8c2 0%,${C.teal} 16%,${C.deep} 72%,${C.abyss} 100%);box-shadow:inset 0 2px 0 rgba(255,255,255,.35)}
.bo-step span{position:absolute;left:0;right:0;text-align:center;font-family:Saira;font-weight:800;font-stretch:112%;letter-spacing:.22em;text-transform:uppercase;color:rgba(197,235,252,.92);white-space:nowrap}
.bo-shelf{position:absolute;background:linear-gradient(180deg,#f2fbff 0%,${C.sky} 26%,#a9dcf0 60%,#7cc4de 100%);border-radius:10px;box-shadow:0 18px 40px rgba(2,24,30,.4)}
.bo-sh{position:absolute;border-radius:50%;background:radial-gradient(closest-side,rgba(2,20,26,.7),rgba(2,20,26,.3) 60%,rgba(2,20,26,0))}
.bo-sw{position:absolute;inset:0;overflow:hidden;-webkit-mask-size:100% 100%;mask-size:100% 100%;mix-blend-mode:screen;pointer-events:none}
.bo-sw i{position:absolute;top:0;bottom:0;left:-130%;width:60%;background:linear-gradient(100deg,rgba(255,255,255,0) 36%,rgba(230,248,255,.34) 50%,rgba(255,255,255,0) 64%)}
.bo-card{position:absolute;border-radius:22px;background:linear-gradient(165deg,#163a44 0%,#0b2a33 55%,#061c22 100%);box-shadow:0 16px 36px rgba(2,24,30,.45),inset 0 0 0 1.5px rgba(197,235,252,.22);overflow:hidden}
.bo-card::after{content:'';position:absolute;left:0;top:0;bottom:0;width:6px;background:${C.teal}}
.bo-tag{position:absolute;border-radius:999px;background:#FFC500;color:#080C0E;font-family:Saira;font-weight:800;font-stretch:108%;text-transform:uppercase;letter-spacing:.06em;line-height:1.6;padding:0 .7em}
.bo-cf{position:absolute;display:block;border-radius:3px}
.bo-rule{position:absolute;height:4px;border-radius:2px;background:${C.yel}}
`;
}

// ---------- helpers ----------
const R1 = (n) => Math.round(n * 10) / 10;
const T = (E, { cls, x, y, w, size, text, html, align = 'left', fit = 0, lines = 0, main = false, inAttr = '', style = '', id = '' }) =>
  `<div ${id ? `id="${id}" ` : ''}class="t ${cls}${main ? ' main' : ''}" ${inAttr} ${fit ? `data-fit="${fit}"` : ''} ${lines ? `data-lines="${lines}"` : ''} style="left:${R1(x)}px;top:${R1(y)}px;${w ? `width:${R1(w)}px;` : ''}font-size:${size}px;text-align:${align};${lines ? 'white-space:normal;' : (w ? 'overflow:hidden;' : '')}${style}">${html ?? E.t(text)}</div>`;
const pill = (E, { x, y, size, text, kind = '', inAttr = '', main = false }) =>
  `<div class="t bo-pill ${kind}${main ? ' main' : ''}" ${inAttr} style="left:${R1(x)}px;top:${R1(y)}px;font-size:${size}px">${E.t(text)}</div>`;
const pillW = (text, size) => size * (0.74 * text.length * 1.0 + 1.56);   // rough width estimate (Saira 110 % / 800 caps)

// teal studio: deep field, glow behind the product (never behind the type), optional diagonal light beam
function studio(E, { gx, gy, gs = 900, beam = null, spots = null }) {
  let h = `<div class="full" style="background:radial-gradient(85% 62% at ${R1((gx / E.W) * 100)}% ${R1((gy / E.H) * 100)}%, ${C.mid} 0%, ${C.deep} 50%, ${C.abyss} 100%)"></div>`;
  h += `<div class="bo-glow" data-kb="0.94,1.06" style="left:${R1(gx - gs / 2)}px;top:${R1(gy - gs / 2)}px;width:${gs}px;height:${gs}px"></div>`;
  if (beam) h += `<div class="bo-beam" data-in="wipe-r" data-dur=".7" style="left:${R1(beam.x)}px;top:${R1(beam.y - beam.h / 2)}px;width:${R1(beam.w)}px;height:${R1(beam.h)}px;transform:rotate(${beam.rot ?? -12}deg)"></div>`;
  if (spots) for (const sx of spots.x) h += `<div class="bo-spot" style="left:${R1(sx - spots.w / 2)}px;top:-60px;width:${R1(spots.w)}px;height:${R1(spots.h)}px"></div>`;
  return h;
}
// a Zojirushi bottle standing with its visible bottom on y = base; height h of the visible bottle (never upscaled)
function bottle(E, k, { cx, base, h, id = '', inAttr = 'data-in="rise" data-d=".05"', sweep = true, shadow = true }) {
  const { src, pad } = P[k], [nw, nh] = E.dims(src);
  const vh = 1 - pad[1] - pad[3], s = Math.min(h / (nh * vh), 1), ww = nw * s, hh = nh * s;
  const top = base - hh * (1 - pad[3]), left = cx - ww / 2, url = E.src(src), vw = ww * (1 - pad[0] - pad[2]);
  const sh = shadow ? `<div class="bo-sh" style="left:${R1(cx - vw * 0.85)}px;top:${R1(base - vw * 0.16)}px;width:${R1(vw * 1.7)}px;height:${R1(vw * 0.32)}px"></div>` : '';
  const pr = `<div class="abs" ${id ? `id="${id}"` : ''} ${inAttr} style="left:${R1(left)}px;top:${R1(top)}px;width:${R1(ww)}px;height:${R1(hh)}px">
    <img src="${url}" alt="" style="position:absolute;inset:0;width:100%;height:100%">
    ${sweep ? `<div class="bo-sw" style="-webkit-mask-image:url(${url});mask-image:url(${url})"><i data-sweep="0.3,1.3"></i></div>` : ''}</div>`;
  return { html: sh + pr, top: base - h, w: vw };
}
// podium block: light-blue top face + teal front face (+ engraved label)
function step(E, { cx, w, top, bottom, label = '', size = 26, face = 34, inAttr = 'data-in="up" data-dist="60"' }) {
  return `<div class="bo-step" ${inAttr} style="left:${R1(cx - w / 2)}px;top:${R1(top)}px;width:${R1(w)}px;height:${R1(bottom - top)}px"><em style="top:${face}px"></em><b style="height:${face}px"></b>${label ? `<span style="top:${R1(face + (bottom - top - face - size * 1.2) / 2)}px;font-size:${size}px">${E.t(label)}</span>` : ''}</div>`;
}
const bossetLogo = (E, { x, y, cx, maxW, maxH, id = 'bo-logo', attrs = 'data-in="fade" data-d=".35"' }) => E.logo(LOGO, { x, y, cx, maxW, maxH, trim: LOGO_TRIM, id, attrs });
// deterministic confetti in brand colours (static pieces that bob in the loop)
function confetti(E, { x0, x1, y0, y1, n = 16, seed = 3 }) {
  const cols = [C.yel, C.sky, C.white, C.yel, C.glow];
  let h = '';
  for (let i = 0; i < n; i++) {
    const r = (k) => { const v = Math.sin((seed * 97 + i * 13 + k) * 12.9898) * 43758.5453; return v - Math.floor(v); };
    const x = x0 + (x1 - x0) * r(1), y = y0 + (y1 - y0) * r(2), s = 0.6 + 0.6 * r(3), rot = Math.round(-60 + 120 * r(4));
    h += `<div class="abs" data-float="${(6 + 8 * r(5)).toFixed(1)},${(1.6 + 1.2 * r(6)).toFixed(2)}" style="left:${R1(x)}px;top:${R1(y)}px"><i class="bo-cf" style="width:${R1(14 * s)}px;height:${R1(28 * s)}px;background:${cols[i % cols.length]};transform:rotate(${rot}deg)"></i></div>`;
  }
  return h;
}
// Keitech Easy Shiner cameo (the shop's signature soft bait), rotated, never upscaled
const shiner = (E, { cx, cy, w, rot = -8, inAttr = 'data-in="left" data-d=".25" data-dist="120"' }) =>
  `<div class="abs" ${inAttr} style="left:0;top:0;width:${E.W}px;height:${E.H}px"><div class="abs" style="left:0;top:0;width:100%;height:100%;transform:rotate(${rot}deg);transform-origin:${R1(cx)}px ${R1(cy)}px">${E.img(LURE.shiner, { cx, cy, w }).html}</div></div>`;

// ---------- scenes ----------
export const scenes = {
  // POSTER: shop + winners' accent in one frame — CENY PRO VÍTĚZE, SM-VB 0,6 l on the podium, Keitech cameo, Bosset logo
  poster(E) {
    const b = E.body, k = E.kind;
    if (k === 'wide') {
      const colW = 700, bx = b.r - 170, base = b.b - 64;
      let html = studio(E, { gx: bx, gy: b.y + b.h * 0.5, gs: 640, beam: { x: 520, y: b.b - 40, w: 760, h: 150, rot: -10 } });
      html += step(E, { cx: bx, w: 250, top: base - 18, bottom: E.chrome.event.y - 8, label: 'MČR 2026', size: 15, face: 26 });
      html += bottle(E, 'vbBlack', { cx: bx, base: base + 4, h: base - b.y - 8 }).html;
      html += T(E, { cls: 'bo-k', x: b.x, y: b.y + 8, w: colW, size: 20, text: 'Rybářský e-shop · Keitech · YGK', inAttr: 'data-in="left"' });
      html += T(E, { cls: 'bo-h', x: b.x - 2, y: b.y + 44, w: colW, size: 84, fit: 50, text: 'Ceny pro', inAttr: 'data-in="slam" data-d=".08"', main: true });
      html += T(E, { cls: 'bo-h y', x: b.x - 2, y: b.y + 44 + 84 * 0.98, w: colW, size: 84, fit: 50, text: 'vítěze', inAttr: 'data-in="slam" data-d=".16"', main: true });
      const sy = b.y + 44 + 84 * 1.98 + 12;
      html += T(E, { cls: 'bo-s', x: b.x, y: sy, w: colW, size: 40, text: 'Termosky Zojirushi', inAttr: 'data-in="up" data-d=".26"', main: true });
      html += pill(E, { x: b.x, y: sy + 58, size: 20, text: 'Horké i studené až 6 hodin', inAttr: 'data-in="left" data-d=".34"' });
      const L = bossetLogo(E, { x: 0, y: 0, maxW: 210 });
      html += bossetLogo(E, { x: b.x + 440, y: sy + 58 + (32 - L.h) / 2, maxW: 210 }).html;
      const st = strip(E, { x: 0, y: 0, w: 700, h: 30, labelSize: 14, gap: 26, items: STRIP });
      html += strip(E, { x: b.x, y: b.b - st.h + 2, w: 700, h: 30, labelSize: 14, gap: 26 }).html;
      return { html };
    }
    const S = k === 'square' ? { kick: 25, head: 124, sub: 44, pill: 28, stepW: 290, face: 30, lab: 21, stepH: 80 }
      : k === 'portrait' ? { kick: 28, head: 142, sub: 50, pill: 31, stepW: 330, face: 34, lab: 24, stepH: 104 }
        : { kick: 30, head: 150, sub: 54, pill: 34, stepW: 360, face: 36, lab: 26, stepH: 120 };
    let y = b.y + (k === 'tall' ? 20 : 2);
    let txt = T(E, { cls: 'bo-k', x: b.x, y, w: b.w, size: S.kick, text: 'Rybářský e-shop · Keitech · YGK', inAttr: 'data-in="left" data-d=".05"' });
    y += S.kick * 1.6;
    txt += T(E, { cls: 'bo-h', x: b.x - 4, y, w: b.w, size: S.head, fit: 70, text: 'Ceny pro', inAttr: 'data-in="slam" data-d=".1"', main: true });
    const l2 = y + S.head * 0.98;
    txt += T(E, { cls: 'bo-h y', x: b.x - 4, y: l2, w: b.w * 0.66, size: S.head, fit: 70, text: 'vítěze', inAttr: 'data-in="slam" data-d=".18"', main: true });
    y = l2 + S.head * 1.0 + 14;
    txt += T(E, { cls: 'bo-s', x: b.x, y, w: b.w * 0.62, size: S.sub, lines: 2, html: 'Termosky<br>Zojirushi', inAttr: 'data-in="up" data-d=".28"', main: true });
    const subLines = 2;
    y += S.sub * 1.12 * subLines + 22;
    txt += pill(E, { x: b.x, y, size: S.pill, text: 'Horké i studené', inAttr: 'data-in="left" data-d=".36"' });
    txt += pill(E, { x: b.x, y: y + S.pill * 1.62 + 12, size: S.pill, text: 'až 6 hodin', inAttr: 'data-in="left" data-d=".42"' });
    // podium + bottle on the right; bottle rises from beside „VÍTĚZE“ (line 2) down to the podium
    const bx = b.r - S.stepW / 2 + 10, stepTop = b.b - S.stepH, base = stepTop + S.face * 0.62;
    const bh = base - (l2 + S.head * 0.1);
    let html = studio(E, { gx: bx, gy: stepTop - bh * 0.45, gs: k === 'square' ? 760 : 900, beam: { x: -200, y: stepTop + 10, w: E.W + 200, h: k === 'square' ? 200 : 240, rot: -12 } });
    html += step(E, { cx: bx, w: S.stepW, top: stepTop, bottom: E.chrome.event.y - 10, label: 'MČR 2026', size: S.lab, face: S.face });
    html += bottle(E, 'vbBlack', { cx: bx, base, h: bh }).html;
    // Keitech Easy Shiner gliding across the lower left (the shop's signature bait)
    const L = bossetLogo(E, { x: 0, y: 0, maxW: k === 'square' ? 230 : 290 });
    txt += bossetLogo(E, { x: b.x, y: b.b - L.h - 4, maxW: k === 'square' ? 230 : 290 }).html;
    // brand strip above the Bosset logo, left column (podium on the right): square / tall 2 rows × 3, portrait 1 row
    const colR = bx - S.stepW / 2 - 30, so = { w: colR - b.x, h: { square: 44, portrait: 50, tall: 56 }[k], rows: 2, labelSize: k === 'square' ? 17 : 20, gap: k === 'square' ? 30 : 38, rowGap: k === 'square' ? 14 : 20 };
    const st0 = strip(E, { x: 0, y: 0, ...so });
    const sy0 = b.b - L.h - 4 - (k === 'square' ? 22 : 34) - st0.h;
    txt += strip(E, { x: b.x, y: sy0, ...so }).html;
    // Keitech Easy Shiner (the shop's signature bait) between the pills and the strip — not in 1:1 (no room; Keitech is in the strip)
    if (k !== 'square') {
      const pillsB = y + S.pill * 1.62 * 2 + 12, lw = k === 'portrait' ? 460 : 560;
      html += shiner(E, { cx: b.x + lw / 2 + 10, cy: (pillsB + sy0) / 2 + 6, w: lw, rot: -9 });
    }
    return { html: html + txt };
  },

  // 1 — WHO: fishing e-shop for spinning, official CZ distributor of Keitech and YGK X-Braid, 20+ years, ships within 24 h
  who(E) {
    const b = E.body, sq = E.kind === 'square';
    let html = studio(E, { gx: b.r - 170, gy: b.b - 200, gs: 760, beam: { x: -240, y: b.b - 120, w: E.W + 300, h: 210, rot: -10 } });
    // YGK spool on the right, Keitech Easy Shiner slashing across the bottom
    html += `<div class="abs" data-in="rise" data-d=".15">${E.img(LURE.ygk, { cx: b.r - 150, cy: b.b - (sq ? 175 : 220), w: sq ? 300 : 360 }).html}</div>`;
    html += shiner(E, { cx: b.x + (sq ? 330 : 360), cy: b.b - (sq ? 56 : 70), w: sq ? 620 : 700, rot: -7, inAttr: 'data-in="left" data-d=".3" data-dist="160"' });
    let y = b.y + 6;
    const L = bossetLogo(E, { x: b.x, y, maxW: 300, attrs: 'data-in="scale"' });
    html += L.html;
    y += L.h + (sq ? 34 : 48);
    const hs = sq ? 86 : 96;
    html += T(E, { cls: 'bo-h', x: b.x - 3, y, w: b.w, size: hs, fit: 50, text: 'Rybářský e-shop', inAttr: 'data-in="left" data-d=".08"', main: true });
    y += hs * 0.98;
    html += T(E, { cls: 'bo-h y', x: b.x - 3, y, w: b.w, size: hs, fit: 50, text: 'pro přívlač', inAttr: 'data-in="left" data-d=".14"', main: true });
    y += hs + (sq ? 30 : 44);
    html += `<div class="bo-rule" data-in="wipe-l" data-d=".2" style="left:${b.x}px;top:${R1(y)}px;width:120px"></div>`;
    y += 26;
    const ps = sq ? 36 : 40, pw = sq ? b.w * 0.62 : b.w * 0.6;
    const facts = [
      ['Oficiální distributor <b>Keitech</b> a <b>YGK X-Braid</b> pro ČR', 2],
      ['Přívlači se věnují víc než <b>20 let</b>', 1],
      ['Objednávky expedují do <b>24 h</b>', 1],
    ];
    facts.forEach(([h, n], i) => {
      html += T(E, { cls: 'bo-p', x: b.x, y, w: pw, size: ps, lines: 3, html: E.nb(h).replace(/ (a|v|k|s|z|o|u|i) /g, ' $1 '), inAttr: `data-in="up" data-d="${(0.24 + i * 0.07).toFixed(2)}"` });
      y += ps * 1.24 * n + (sq ? 16 : 22);
    });
    return { html };
  },

  // 2 — RANGE: the brand shelf — one product + its brand logo per card (brands Bosset SELLS; no prices / counts)
  range(E) {
    const b = E.body, sq = E.kind === 'square';
    let html = studio(E, { gx: E.W / 2, gy: b.y + b.h * 0.6, gs: 1100 });
    html += T(E, { cls: 'bo-k', x: b.x, y: b.y + 4, w: b.w, size: sq ? 25 : 28, text: 'Značky v nabídce bosset.cz', inAttr: 'data-in="left"' });
    const hs = sq ? 74 : 84;
    html += T(E, { cls: 'bo-h', x: b.x - 3, y: b.y + (sq ? 44 : 50), w: b.w, size: hs, fit: 44, html: `Nástrahy <span style="color:${C.yel}">&amp;</span> šňůry`, inAttr: 'data-in="up" data-d=".05"', main: true });
    const gy = b.y + (sq ? 44 : 50) + hs * 1.18, gap = sq ? 14 : 18, cols = 2, rows = 4;
    const cw = (b.w - gap) / cols, ch = (b.b - gy - gap * (rows - 1)) / rows;
    SHELF.forEach((s, i) => {
      const x = b.x + (i % cols) * (cw + gap), y = gy + Math.floor(i / cols) * (ch + gap);
      const lw = cw * 0.34, lh = ch * (s.b.startsWith('fresh') ? 0.74 : 0.6), pw = cw * 0.56, ph = ch * 0.78;
      const lg = E.logo(`${BR}${s.b}`, { cx: 6 + 14 + lw / 2, y: 0, maxW: lw, maxH: lh, trim: s.trim, id: `bo-br${i}` });
      const logo = E.logo(`${BR}${s.b}`, { cx: 6 + 14 + lw / 2, y: (ch - lg.h) / 2 + (i < 2 ? 14 : 0), maxW: lw, maxH: lh, trim: s.trim, id: `bo-br${i}` }).html;
      const prod = `<div class="abs" style="left:0;top:0;width:${R1(cw)}px;height:${R1(ch)}px;transform:rotate(${s.rot}deg);transform-origin:${R1(cw - 14 - pw / 2)}px ${R1(ch / 2)}px">${E.img(s.p, { cx: cw - 14 - pw / 2, cy: ch / 2, w: pw, h: ph }).html}</div>`;
      const tag = i < 2 ? `<div class="t bo-tag" style="left:20px;top:9px;font-size:${sq ? 17 : 19}px">${E.t('Distributor pro ČR')}</div>` : '';
      html += `<div class="bo-card" data-in="up" data-dist="40" data-d="${(0.1 + i * 0.05).toFixed(2)}" style="left:${R1(x)}px;top:${R1(y)}px;width:${R1(cw)}px;height:${R1(ch)}px">${prod}${logo}${tag}</div>`;
    });
    return { html };
  },

  // 3 — HERO: the 0,6 l line (SM-VB / SM-SR only → Double Lock claim allowed) on the light-blue shelf, verified spec
  hero(E) {
    const b = E.body, sq = E.kind === 'square';
    const shelfH = sq ? 34 : 44, shelfY = b.b - shelfH - 6;
    let html = studio(E, { gx: E.W / 2, gy: shelfY - 160, gs: 1000 });
    let y = b.y + 4;
    html += T(E, { cls: 'bo-k', x: b.x, y, w: b.w, size: sq ? 25 : 28, text: 'Termosky Zojirushi', inAttr: 'data-in="left"' });
    y += (sq ? 25 : 28) * 1.6;
    const h1 = sq ? 74 : 84, h2 = sq ? 112 : 130;
    html += T(E, { cls: 'bo-h', x: b.x - 3, y, w: b.w, size: h1, fit: 44, text: 'Horké i studené', inAttr: 'data-in="up" data-d=".05"', main: true });
    y += h1 * 0.98;
    html += T(E, { cls: 'bo-h y', x: b.x - 4, y, w: b.w, size: h2, fit: 60, text: 'až 6 hodin', inAttr: 'data-in="slam" data-d=".12"', main: true });
    y += h2 * 1.0 + (sq ? 10 : 18);
    const ps = sq ? 25 : 28;
    html += pill(E, { x: b.x, y, size: ps, text: 'Double Lock · jednou rukou', kind: 'sk', inAttr: 'data-in="left" data-d=".22"' });
    html += pill(E, { x: b.x, y: y + ps * 1.62 + 12, size: ps, text: 'Nerez · bez BPA', kind: 'sk', inAttr: 'data-in="left" data-d=".28"' });
    const top = sq ? y - 6 : y + 2 * (ps * 1.62 + 12) + 14;
    // colour run: black SM-VB in the middle (tallest), SM-SR / SM-VB colours to the sides
    html += `<div class="bo-shelf" data-in="up" data-dist="40" style="left:${R1(b.x - 20)}px;top:${R1(shelfY)}px;width:${R1(b.w + 40)}px;height:${R1(shelfH + 6)}px"></div>`;
    const base = shelfY + shelfH * 0.45, H = base - top;
    const run = sq
      ? [['srPink', 0.72, 0.07], ['vbBeige', 0.73, 0.25], ['vbGreen', 0.72, 0.44], ['vbBlack', 1, 0.67], ['srGreen', 0.74, 0.89]]
      : [['srWhite', 0.72, 0.08], ['srPink', 0.74, 0.24], ['vbBeige', 0.76, 0.4], ['vbBlack', 1, 0.58], ['srGreen', 0.76, 0.76], ['vbGreen', 0.74, 0.92]];
    const ord = run.map((r, i) => i).sort((a, c) => run[a][1] - run[c][1]);
    for (const i of ord) {
      const [kk, f, fx] = run[i];
      html += bottle(E, kk, { cx: b.x + b.w * fx, base, h: H * f, inAttr: `data-in="rise" data-d="${(0.06 + i * 0.05).toFixed(2)}"`, sweep: kk === 'vbBlack' }).html;
    }
    return { html };
  },

  // 4 — MČR: the winners' accent — podium in spotlights, SM-VB 0,6 l on top, confetti; Bosset logo + URL
  mcr(E) {
    const b = E.body, sq = E.kind === 'square';
    const stepW = sq ? 320 : 380, cx = b.r - stepW / 2 + 4, stepTop = b.b - (sq ? 96 : 130), face = sq ? 32 : 38;
    let txt = '';
    let y = b.y + 4;
    txt += T(E, { cls: 'bo-k', x: b.x, y, w: b.w, size: sq ? 24 : 27, text: 'Mistrovství ČR v Trout Area 2026', inAttr: 'data-in="left"' });
    y += (sq ? 24 : 27) * 1.6;
    const hs = sq ? 118 : 136;
    txt += T(E, { cls: 'bo-h', x: b.x - 4, y, w: b.w * 0.62, size: hs, fit: 60, text: 'Pro', inAttr: 'data-in="slam" data-d=".06"', main: true });
    y += hs * 0.98;
    txt += T(E, { cls: 'bo-h y', x: b.x - 4, y, w: b.w * 0.62, size: hs, fit: 60, text: 'vítěze', inAttr: 'data-in="slam" data-d=".12"', main: true });
    y += hs + (sq ? 16 : 24);
    const ss = sq ? 42 : 48;
    txt += T(E, { cls: 'bo-s', x: b.x, y, w: b.w * 0.56, size: ss, lines: 3, text: 'špičkové termosky Zojirushi', inAttr: 'data-in="up" data-d=".22"', main: true });
    y += ss * 1.12 * 2 + (sq ? 20 : 30);
    txt += T(E, { cls: 'bo-k', x: b.x, y, w: b.w * 0.56, size: sq ? 22 : 24, lines: 2, text: 'Věnuje Bosset.cz', style: `color:${C.white};letter-spacing:.16em`, inAttr: 'data-in="up" data-d=".3"' });
    // CTA: logo + big URL bottom-left
    const ctaS = sq ? 46 : 52;
    txt += pill(E, { x: b.x, y: b.b - ctaS * 1.62 - 4, size: ctaS, text: 'bosset.cz', kind: 'url', main: true, inAttr: 'data-in="scale" data-d=".36"' });
    const L = bossetLogo(E, { x: 0, y: 0, maxW: 270 });
    txt += bossetLogo(E, { x: b.x + 6, y: b.b - ctaS * 1.62 - 4 - L.h - (sq ? 24 : 32), maxW: 270 }).html;
    const base = stepTop + face * 0.62, bh = base - (b.y + (sq ? 40 : 60));
    let html = studio(E, { gx: cx, gy: stepTop - bh * 0.4, gs: 820, spots: { x: [cx - 230, cx + 230], w: 700, h: E.H * 0.95 } });
    html += confetti(E, { x0: cx - stepW * 0.95, x1: Math.min(E.W - 40, cx + stepW * 0.6), y0: b.y, y1: stepTop - 40, n: sq ? 14 : 18, seed: sq ? 3 : 5 });
    html += step(E, { cx, w: stepW, top: stepTop, bottom: E.chrome.event.y - 10, label: 'MČR 2026', size: sq ? 22 : 26, face });
    html += bottle(E, 'vbBlack', { cx, base, h: bh }).html;
    return { html: html + txt };
  },
};
