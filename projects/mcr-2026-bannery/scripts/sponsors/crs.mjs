// ČESKÝ RYBÁŘSKÝ SVAZ — poděkování za dlouholetou podporu (role 'supporter': chip „Děkujeme za dlouholetou podporu“, NIKDY „Věnuje ceny“).
// World = the film block (mcr-2026-sponzori/scripts/blocks/crs.mjs, concept „PEČEŤ“): deep blue / navy field, engraved hatching
// (= the fin lines of the ČRS fish), slow turquoise water light, Inter 900 caps, one centred lockup
// DĚKUJEME · [ČRS logo + turquoise hairlines] · ZA DLOUHOLETOU PODPORU, glass fact card. Calm: nothing slams, things are revealed.
// Facts only from research/crs.md §1 (citations) + data/blocks/crs.json:
//   „nezisková organizace s dlouholetou tradicí, která se věnuje rybářství, ochraně vodních živočichů a přírody“ (rybsvaz.cz)
//   „mezi největší zájmová sdružení v České republice“ (rybsvaz.cz — only in this full form) · 1968 = samostatný Český rybářský svaz
//   Líheň Liběchov: „vlastník: Český rybářský svaz, z. s., místní organizace Mělník“ (lihenlibechov.cz/cs/kontakt);
//   on screen ONLY „Areál vlastní Český rybářský svaz, místní organizace Mělník“ (operator 22. 10.: no „provozuje“ wording)
//   carousel 3 = plan of Malý Sporťáček (mcr-2026-sponzori/data/pond_scheme.json, same drawing as venue.mjs) in ČRS colours,
//   labelled „Schéma · čísla míst orientační“ (the peg layout is our proposal)
//   MČR 2025 trophy table dressed in the ČRS cloth (our gallery, gtacz_mcr25_1000046063, verified by eye) · „dlouholetá podpora“ = operator.
// Never: „pod záštitou ČRS“, „MČR pořádá ČRS“, „oficiální disciplína“, member counts, „největší“ without „mezi“.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const FILM = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../mcr-2026-sponzori');
const POND = JSON.parse(fs.readFileSync(path.join(FILM, 'data/pond_scheme.json'), 'utf8'));

export const brand = {
  name: 'Český rybářský svaz',
  url: 'rybsvaz.cz',
  role: 'supporter',                  // → chip „Děkujeme za dlouholetou podporu“ (no prize chip)
};

const C = { blue: '#2B5DA9', navy: '#182F5D', deep: '#0c1934', mid: '#20488a', turq: '#38B0C0', ice: '#cfe6ff', white: '#ffffff' };
export const theme = {
  bg: C.deep,
  taTone: 'dark',
  chrome: { url: C.white, urlFont: "'Inter'", urlW: 800, sub: C.ice, dot: C.turq, chipBg: 'rgba(12,25,52,.72)', chipLine: 'rgba(56,176,192,.6)', chipFg: '#ffffff', event: 'rgba(225,238,255,.9)' },
};
// 10 s seamless loop (poster at rest on frame 0 and at the end): thank-you → who → MČR 2025 photo → the venue → thank-you
export const anim = {
  seq: [
    { scene: 'poster', d: 2.3 },
    { scene: 'who', d: 1.9 },
    { scene: 'range', d: 2.0 },
    { scene: 'hero', d: 2.0 },
    { scene: 'poster', d: 1.8 },
  ],
  // 16:9 MP4 (kind 'wide'): thank-you → who → the venue plan → thank-you (landscape layouts)
  wide: [
    { scene: 'poster', d: 2.6 },
    { scene: 'who', d: 2.4 },
    { scene: 'hero', d: 2.4 },
    { scene: 'poster', d: 2.6 },
  ],
};
export const fonts = {};   // Inter + Montserrat are in the engine registry

const A = 'film:assets_prep/crs/';
const LOGO = `${A}logo_crs_white.png`, BADGE = `${A}badge_crs_round.png`;
const PH_MCR25 = 'own:assets/crs/mcr25_trophy_table_crs.jpg';   // MČR 2025 opening: trophy table in the ČRS cloth (4032×2268)
const TABLE = { fx: 0.735, fy: 0.80 };                                      // trophy table + ČRS cloth in the MČR 2025 photo (fractions)

export function css() {
  return `
.crs-bg{background:radial-gradient(110% 75% at 50% 42%,${C.mid} 0%,#163a73 38%,${C.deep} 100%)}
.crs-cau{background:radial-gradient(40% 28% at 22% 30%,rgba(56,176,192,.22),rgba(56,176,192,0) 70%),radial-gradient(46% 30% at 82% 70%,rgba(56,176,192,.16),rgba(56,176,192,0) 70%),radial-gradient(60% 40% at 60% 10%,rgba(43,93,169,.35),rgba(43,93,169,0) 70%)}
.crs-hatch{background:repeating-linear-gradient(-58deg,rgba(207,230,255,.055) 0 2px,rgba(207,230,255,0) 2px 15px);-webkit-mask-image:radial-gradient(70% 60% at 50% 45%,#000 0%,rgba(0,0,0,.55) 55%,rgba(0,0,0,0) 100%);mask-image:radial-gradient(70% 60% at 50% 45%,#000 0%,rgba(0,0,0,.55) 55%,rgba(0,0,0,0) 100%)}
.crs-vig{background:radial-gradient(95% 70% at 50% 46%,rgba(12,25,52,0) 0%,rgba(12,25,52,.45) 72%,rgba(8,16,34,.85) 100%)}
.crs-k{font-family:Inter;font-weight:700;text-transform:uppercase;letter-spacing:.26em;color:${C.turq}}
.crs-h{font-family:Inter;font-weight:900;text-transform:uppercase;letter-spacing:-.01em;line-height:.98;color:${C.white}}
.crs-l{font-family:Inter;font-weight:800;text-transform:uppercase;letter-spacing:.01em;line-height:1.05;color:${C.white}}
.crs-p{font-family:Inter;font-weight:600;line-height:1.25;color:#eaf2ff;white-space:normal}
.crs-s{font-family:Inter;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:${C.ice};line-height:1.45;white-space:normal}
.crs-cap{font-family:Inter;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:rgba(234,242,255,.82)}
.crs-url{font-family:Inter;font-weight:800;letter-spacing:-.01em;color:${C.white};line-height:1}
.crs-hl{position:absolute;height:2px}
.crs-ring{position:absolute;border-radius:50%;border:2px solid rgba(56,176,192,.55)}
.crs-glass{position:absolute;border-radius:24px;background:rgba(12,25,52,.5);-webkit-backdrop-filter:blur(16px) saturate(1.3);backdrop-filter:blur(16px) saturate(1.3);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.22),0 24px 50px rgba(0,0,0,.28)}
.crs-glass i{position:absolute;left:50%;top:0;width:120px;margin-left:-60px;height:3px;border-radius:0 0 3px 3px;background:${C.turq}}
.crs-glass.l i{left:34px;margin-left:0}
.crs-sw{position:absolute;overflow:hidden;-webkit-mask-size:100% 100%;mask-size:100% 100%;mix-blend-mode:screen;pointer-events:none}
.crs-sw i{position:absolute;top:0;bottom:0;left:-130%;width:70%;background:linear-gradient(100deg,rgba(255,255,255,0) 38%,rgba(220,245,255,.42) 50%,rgba(255,255,255,0) 62%)}
.crs-ph{position:absolute;overflow:hidden}
.crs-pl{position:absolute;border-radius:50%;background:${C.blue};box-shadow:0 0 0 2px #fff,0 3px 8px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;font-family:Inter;font-weight:800;color:#fff;letter-spacing:-.02em}
.crs-dim{position:absolute;background:${C.ice}}
.crs-dl{position:absolute;font-family:Inter;font-weight:800;color:${C.ice};white-space:nowrap;text-align:center;background:${C.deep}}
.crs-note{position:absolute;font-family:Inter;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:rgba(207,230,255,.75)}
.crs-ph img{filter:saturate(.88) contrast(1.06)}
`;
}

// ---------- helpers ----------
const R1 = (n) => Math.round(n * 10) / 10;
const T = (E, { cls, x, y, w, size, text, html, align = 'left', fit = 0, lines = 0, main = false, inAttr = '', style = '', id = '' }) =>
  `<div ${id ? `id="${id}" ` : ''}class="t ${cls}${main ? ' main' : ''}" ${inAttr} ${fit ? `data-fit="${fit}"` : ''} ${lines ? `data-lines="${lines}"` : ''} style="left:${R1(x)}px;top:${R1(y)}px;width:${R1(w)}px;font-size:${size}px;text-align:${align};${lines ? 'white-space:normal;' : 'overflow:hidden;'}${style}">${html ?? E.t(text)}</div>`;

const world = () => '<div class="full crs-bg"></div><div class="full crs-cau"></div><div class="full crs-hatch"></div><div class="full crs-vig"></div>';

// photo laid out so that the focus point (fx, fy of the image) lands on (tx, ty); width ≥ cover; never upscaled (E.img)
function photo(E, src, { fx, fy, tx, ty, w, box = { x: 0, y: 0, w: E.W, h: E.H }, attrs = '', style = '', mask = '' }) {
  const [nw, nh] = E.dims(src);
  const cover = Math.max(box.w, box.h * nw / nh);
  const ww = Math.min(nw, Math.max(w || cover, cover)), hh = ww * nh / nw;
  let left = tx - box.x - fx * ww, top = ty - box.y - fy * hh;
  left = Math.min(0, Math.max(box.w - ww, left)); top = Math.min(0, Math.max(box.h - hh, top));
  const im = E.img(src, { x: left, y: top, w: ww, attrs, style: `transform-origin:${R1(tx - box.x - left)}px ${R1(ty - box.y - top)}px;${style}` });
  const mk = mask ? `-webkit-mask-image:${mask};mask-image:${mask};` : '';
  return `<div class="crs-ph" style="left:${R1(box.x)}px;top:${R1(box.y)}px;width:${R1(box.w)}px;height:${R1(box.h)}px;${mk}">${im.html}</div>`;
}
// the ČRS logo with turquoise hairlines drawn out of it (the seal's water line). Centred at cx or left-aligned at x.
function logoLine(E, { cx, x, y, maxW, hlL = null, hlR = null, inAttr = 'data-in="up" data-d=".12" data-dist="30"' }) {
  const L = E.logo(LOGO, { x: 0, y: 0, maxW });
  const left = cx != null ? cx - L.w / 2 : x;
  const lg = E.logo(LOGO, { x: left, y, maxW, attrs: inAttr });
  const hy = y + L.h * 0.5, gap = 30;
  let h = lg.html;
  const l0 = hlL ?? E.body.x, r1 = hlR ?? E.body.r;
  if (cx != null && left - gap - l0 > 40) h += `<i class="crs-hl" data-in="wipe-r" data-d=".2" style="left:${R1(l0)}px;top:${R1(hy)}px;width:${R1(left - gap - l0)}px;background:linear-gradient(90deg,rgba(56,176,192,0),${C.turq})"></i>`;
  if (r1 - (left + L.w + gap) > 40) h += `<i class="crs-hl" data-in="wipe-l" data-d=".2" style="left:${R1(left + L.w + gap)}px;top:${R1(hy)}px;width:${R1(r1 - (left + L.w + gap))}px;background:linear-gradient(90deg,${C.turq},rgba(56,176,192,0))"></i>`;
  return { html: h, w: L.w, h: L.h, x: left };
}
// round ČRS emblem (official sign) as the seal: fitted to the logo rule, water rings around it, a light runs through it
function seal(E, { cx, cy, maxW, sweep = '0.35,1.35', rings = 2, id = 'crs-badge' }) {
  const fit = E.logoFit(1, { maxW });
  const x = cx - fit.w / 2, y = cy - fit.h / 2;
  let h = '';
  for (let i = rings; i >= 1; i--) {
    const r = fit.w / 2 + 18 + i * 22;
    h += `<i class="crs-ring" data-kb="1,1.06" style="left:${R1(cx - r)}px;top:${R1(cy - r)}px;width:${R1(2 * r)}px;height:${R1(2 * r)}px;opacity:${(0.75 - i * 0.22).toFixed(2)}"></i>`;
  }
  h += `<div class="abs" style="left:${R1(cx - fit.w * 0.75)}px;top:${R1(cy - fit.h * 0.75)}px;width:${R1(fit.w * 1.5)}px;height:${R1(fit.h * 1.5)}px;border-radius:50%;background:radial-gradient(closest-side,rgba(56,176,192,.32),rgba(56,176,192,0))"></div>`;
  const lg = E.logo(BADGE, { x, y, maxW, id, attrs: 'data-in="scale" data-d=".05"', style: 'filter:drop-shadow(0 10px 24px rgba(0,0,0,.35))' });
  h += lg.html;
  const url = E.src(BADGE);
  if (sweep) h += `<div class="crs-sw" style="left:${R1(x)}px;top:${R1(y)}px;width:${R1(fit.w)}px;height:${R1(fit.h)}px;-webkit-mask-image:url(${url});mask-image:url(${url})"><i data-sweep="${sweep}"></i></div>`;
  return { html: h, w: fit.w, h: fit.h, x, y };
}
// glass fact card (film: crs-fact) — kicker line + bold line(s)
function factCard(E, { x, y, w, k, b, ks, bs, blines = 1, align = 'center', inAttr = 'data-in="up" data-d=".3" data-dist="40"', extra = '', es = 0 }) {
  const pad = Math.round(bs * 0.62), kh = ks * 1.35, bh = bs * 1.12 * blines, eh = extra ? es * 1.4 + 8 : 0;
  const h = pad + kh + 8 + bh + eh + pad;
  let s = `<div class="crs-glass${align === 'left' ? ' l' : ''}" ${inAttr} style="left:${R1(x)}px;top:${R1(y)}px;width:${R1(w)}px;height:${R1(h)}px"><i></i>`;
  const ix = 30, iw = w - 60;
  s += T(E, { cls: 'crs-k', x: ix, y: pad, w: iw, size: ks, align, fit: 16, text: k, style: `color:${C.ice};letter-spacing:.12em` });
  s += T(E, { cls: 'crs-p', x: ix, y: pad + kh + 8, w: iw, size: bs, align, ...(blines > 1 ? { lines: blines } : { fit: 40 }), main: bs >= 40, text: b, style: `font-weight:800;color:#fff;line-height:1.12;${blines > 1 ? '' : 'white-space:nowrap'}` });
  if (extra) s += T(E, { cls: 'crs-k', x: ix, y: pad + kh + 8 + bh + 8, w: iw, size: es, align, fit: 14, text: extra, style: `color:${C.turq};letter-spacing:.1em` });
  return { html: s + '</div>', h };
}

// the centred thank-you lockup: [kicker] DĚKUJEME · logo + hairlines · ZA DLOUHOLETOU PODPORU — returns html + bottom y
function lockup(E, { y, S, kicker = 'Poděkování · Trout Area CZ' }) {
  const b = E.body, cx = b.x + b.w / 2;
  let h = '';
  if (kicker) { h += T(E, { cls: 'crs-k', x: b.x, y, w: b.w, size: S.k, align: 'center', fit: 16, text: kicker, inAttr: 'data-in="up" data-dist="24"' }); y += S.k * 1.9; }
  h += T(E, { cls: 'crs-h', x: b.x, y, w: b.w, size: S.thx, align: 'center', fit: 80, text: 'Děkujeme', inAttr: 'data-in="scale" data-dur=".9"', main: true });
  y += S.thx * 0.98 + S.gap;
  const LL = logoLine(E, { cx, y, maxW: S.logoW });
  h += LL.html; y += LL.h + S.gap;
  h += T(E, { cls: 'crs-l', x: b.x, y, w: b.w, size: S.line, align: 'center', fit: 40, text: 'za dlouholetou podporu', inAttr: 'data-in="up" data-d=".25" data-dist="40"', main: true });
  y += S.line * 1.05;
  return { html: h, y };
}

// plan of Malý Sporťáček (portrait frame of data/pond_scheme.json, as venue.mjs) in ČRS colours: turquoise water tint + glow,
// white outline, dashed 1,5 m isoline, places 1–40 as ČRS-blue pins outside the water edge. Centroid at (cx, cy), s px/m.
function pondPlan(E, { cx, cy, s, r = 12, out = 2.6 }) {
  const O = POND.outline.clean, nss = 'vector-effect="non-scaling-stroke"', fid = `crsblur-${Math.round(s * 10)}`;
  let svg = `<svg viewBox="0 0 ${E.W} ${E.H}" width="${E.W}" height="${E.H}" style="position:absolute;left:0;top:0;overflow:visible">
    <defs><filter id="${fid}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${(9 / s).toFixed(3)}"/></filter></defs>
    <g transform="translate(${cx} ${cy}) scale(${s})">
      <path d="${O.path_d_portrait}" fill="${C.turq}" fill-opacity=".16"/>
      <path d="${O.path_d_portrait}" transform="scale(.86)" fill="none" stroke="${C.turq}" stroke-width="2.4" stroke-dasharray="9 8" ${nss} opacity=".9"/>
      <path d="${O.path_d_portrait}" fill="none" stroke="${C.turq}" stroke-width="${(14 / s).toFixed(3)}" filter="url(#${fid})" opacity=".85"/>
      <path d="${O.path_d_portrait}" fill="none" stroke="#ffffff" stroke-width="${(5 / s).toFixed(3)}" stroke-linejoin="round"/>`;
  let pins = '';
  const pts = [];
  for (const p of POND.places.list) {
    const [ex, ey] = p.water_edge_portrait, [px0, py0] = p.xy_portrait;
    const dx = px0 - ex, dy = py0 - ey, L = Math.hypot(dx, dy) || 1, qx = ex + (dx / L) * out, qy = ey + (dy / L) * out;
    svg += `<line x1="${ex}" y1="${ey}" x2="${qx.toFixed(3)}" y2="${qy.toFixed(3)}" stroke="#fff" stroke-width="2" ${nss} opacity=".8"/>`;
    const X = cx + qx * s, Y = cy + qy * s;
    pts.push([X, Y]);
    pins += `<div class="crs-pl" data-in="scale" data-d="${(0.15 + p.n * 0.018).toFixed(3)}" data-dur="0.35" style="left:${R1(X - r)}px;top:${R1(Y - r)}px;width:${2 * r}px;height:${2 * r}px;font-size:${R1(r)}px">${p.n}</div>`;
  }
  svg += '</g></svg>';
  const [bx0, by0, bx1, by1] = O.bbox_portrait, px = pts.map((q) => q[0]), py = pts.map((q) => q[1]);
  return {
    html: svg + pins,
    bbox: { x0: cx + bx0 * s, y0: cy + by0 * s, x1: cx + bx1 * s, y1: cy + by1 * s },
    pins: { x0: Math.min(...px) - r, x1: Math.max(...px) + r, y0: Math.min(...py) - r, y1: Math.max(...py) + r },
  };
}
const PL_EXT = (() => {
  const xs = [], ys = [];
  for (const p of POND.places.list) {
    const [ex, ey] = p.water_edge_portrait, [px0, py0] = p.xy_portrait, dx = px0 - ex, dy = py0 - ey, L = Math.hypot(dx, dy) || 1;
    xs.push(ex + (dx / L) * 2.6); ys.push(ey + (dy / L) * 2.6);
  }
  const [bx0, by0, bx1, by1] = POND.outline.clean.bbox_portrait;
  return { x0: Math.min(bx0, ...xs), x1: Math.max(bx1, ...xs), y0: Math.min(by0, ...ys), y1: Math.max(by1, ...ys) };
})();

// ---------- scenes ----------
export const scenes = {
  // POSTER (statics + loop start/end): the seal lockup; portrait / tall add the MČR 2025 trophy table (ČRS cloth) below it
  poster(E) {
    const b = E.body, k = E.kind;
    if (k === 'wide') {
      const colW = 600;
      let h = world();
      const bx = { x: E.W * 0.44, y: 0, w: E.W * 0.56, h: E.H }, mk = 'linear-gradient(90deg,rgba(0,0,0,0) 0%,rgba(0,0,0,.6) 22%,#000 45%)';
      h += photo(E, PH_MCR25, { ...TABLE, tx: E.W * 0.80, ty: E.H * 0.6, w: 1500, box: bx, mask: mk, attrs: 'data-kb="1,1.05"' });
      h += `<div class="abs" style="left:${R1(bx.x)}px;top:0;width:${R1(bx.w)}px;height:${E.H}px;-webkit-mask-image:${mk};mask-image:${mk};background:${C.blue};mix-blend-mode:soft-light;opacity:.4"></div>`;
      h += `<div class="abs" style="left:${R1(bx.x)}px;top:0;width:${R1(bx.w)}px;height:${E.H}px;-webkit-mask-image:${mk};mask-image:${mk};background:linear-gradient(0deg,rgba(8,16,34,.85) 0%,rgba(8,16,34,0) 32%),linear-gradient(180deg,rgba(8,16,34,.6) 0%,rgba(8,16,34,0) 28%)"></div>`;
      let y = b.y + 18;
      h += T(E, { cls: 'crs-k', x: b.x, y, w: colW, size: 20, text: 'Poděkování · Trout Area CZ', inAttr: 'data-in="up" data-dist="24"' });
      y += 40;
      h += T(E, { cls: 'crs-h', x: b.x - 3, y, w: colW, size: 112, fit: 70, text: 'Děkujeme', inAttr: 'data-in="scale"', main: true });
      y += 112 + 8;
      h += T(E, { cls: 'crs-l', x: b.x, y, w: colW, size: 42, fit: 40, text: 'za dlouholetou podporu', inAttr: 'data-in="up" data-d=".2"', main: true });
      y += 42 + 40;
      const LL = logoLine(E, { x: b.x, y, maxW: 260, hlR: b.x + colW });
      h += LL.html;
      h += T(E, { cls: 'crs-cap', x: E.W - 44 - 300, y: b.b - 20, w: 300, size: 15, align: 'right', text: 'Foto: MČR 2025' });
      return { html: h, taTone: 'dark' };
    }
    if (k === 'square') {
      const S = { k: 24, thx: 168, gap: 44, logoW: 300, line: 58 };
      const blockH = S.k * 1.9 + S.thx * 0.98 + S.gap + 92 + S.gap + S.line * 1.05 + 46 + 150;
      let y = b.y + Math.max(0, (b.h - blockH) / 2);
      const LK = lockup(E, { y, S });
      let h = world() + LK.html;
      const F = factCard(E, { x: b.x + 70, y: LK.y + 46, w: b.w - 140, k: 'Areál MČR 2026 · Líheň Liběchov', b: 'vlastní ČRS · místní organizace Mělník', ks: 22, bs: 40 });
      h += F.html;
      return { html: h };
    }
    // portrait / tall: lockup on top, the MČR 2025 trophy table (ČRS cloth) as the ground below, fact card on the glass
    const tall = k === 'tall';
    const S = tall ? { k: 28, thx: 190, gap: 50, logoW: 340, line: 66 } : { k: 26, thx: 178, gap: 44, logoW: 320, line: 62 };
    let h = world();
    // tall: the photo band ends above the Story UI zone so the ČRS cloth sits between the fact card and the chip
    const phTop = tall ? 900 : 640, bx = { x: 0, y: phTop, w: E.W, h: tall ? 660 : E.H - phTop };
    const mk = tall ? 'linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,.55) 14%,#000 30%,#000 80%,rgba(0,0,0,0) 100%)' : 'linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,.55) 16%,#000 34%)';
    h += photo(E, PH_MCR25, { ...TABLE, tx: E.W * 0.58, ty: tall ? 1290 : 1040, w: tall ? 1900 : 2300, box: bx, mask: mk, attrs: 'data-kb="1,1.05"' });
    h += `<div class="abs" style="left:0;top:${phTop}px;width:${E.W}px;height:${bx.h}px;-webkit-mask-image:${mk};mask-image:${mk};background:${C.blue};mix-blend-mode:soft-light;opacity:.4"></div>`;
    const sb = E.chrome.chip.y - 90;
    h += `<div class="abs" style="left:0;top:${R1(sb)}px;width:${E.W}px;height:${R1(E.H - sb)}px;background:linear-gradient(180deg,rgba(8,16,34,0) 0%,rgba(8,16,34,.78) 45%,rgba(8,16,34,.92) 100%)"></div>`;
    const LK = lockup(E, { y: b.y + (tall ? 20 : 6), S });
    h += LK.html;
    const F = factCard(E, { x: b.x + (tall ? 10 : 40), y: LK.y + (tall ? 70 : 44), w: b.w - (tall ? 20 : 80), k: 'Areál MČR 2026 · Líheň Liběchov', b: 'vlastní ČRS · místní organizace Mělník', ks: tall ? 26 : 24, bs: tall ? 42 : 42 });
    h += F.html;
    h += T(E, { cls: 'crs-cap', x: b.r - 400, y: b.b - 26, w: 400, size: 20, align: 'right', text: 'Foto: MČR 2025' });
    return { html: h, taTone: 'dark' };
  },

  // 1 — WHO: the round ČRS emblem as the seal + who they are (verified quotes from rybsvaz.cz)
  who(E) {
    const b = E.body, sq = E.kind === 'square';
    let h = world();
    if (E.kind === 'wide') {
      // 16:9: seal + kicker row, the name on one line, the verified one-liners below
      let y = b.y + 20;   // seal ring stays clear of the TA logo
      const SE = seal(E, { cx: b.x + 66, cy: y + 70, maxW: 132, rings: 1 });
      h += SE.html;
      h += T(E, { cls: 'crs-k', x: b.x + 170, y: y + 34, w: b.w - 170, size: 22, text: 'Kdo jsou', inAttr: 'data-in="left" data-d=".1"' });
      h += T(E, { cls: 'crs-k', x: b.x + 170, y: y + 70, w: b.w - 170, size: 20, text: 'Samostatný svaz od roku 1968', style: `color:${C.ice};letter-spacing:.18em`, inAttr: 'data-in="left" data-d=".16"' });
      y += 162;
      h += T(E, { cls: 'crs-h', x: b.x - 3, y, w: b.w, size: 76, fit: 50, html: `${E.t('Český rybářský')} <span style="color:${C.ice}">svaz</span>`, inAttr: 'data-in="up" data-d=".08"', main: true });
      y += 76 + 24;
      h += T(E, { cls: 'crs-p', x: b.x, y, w: b.w * 0.86, size: 28, lines: 2, text: 'Nezisková organizace s dlouholetou tradicí. Věnuje se rybářství, ochraně vodních živočichů a přírody.', inAttr: 'data-in="up" data-d=".2"' });
      y += 28 * 1.25 * 2 + 30;
      h += `<i class="abs" data-in="wipe-r" data-d=".3" style="left:${R1(b.x)}px;top:${R1(y - 14)}px;width:100px;height:3px;background:${C.turq}"></i>`;
      h += T(E, { cls: 'crs-s', x: b.x, y, w: b.w, size: 22, text: 'Mezi největší zájmová sdružení v České republice', inAttr: 'data-in="up" data-dist="16" data-d=".3"' });
      return { html: h };
    }
    const sz = sq ? { hd: 100, p: 40, s: 24 } : { hd: 100, p: 44, s: 26 };
    const blockH = 170 + 50 + sz.hd * 0.98 * 2 + 30 + sz.p * 1.25 * 3 + 34 + sz.s * 1.45 * 2;
    let y = b.y + Math.max(4, (b.h - blockH) / 2);
    const SE = seal(E, { cx: b.x + 85, cy: y + 88, maxW: 170, rings: 1 });
    h += SE.html;
    h += T(E, { cls: 'crs-k', x: b.x + 230, y: y + 50, w: b.w - 230, size: sq ? 26 : 28, text: 'Kdo jsou', inAttr: 'data-in="left" data-d=".1"' });
    h += T(E, { cls: 'crs-k', x: b.x + 230, y: y + 50 + (sq ? 44 : 48), w: b.w - 230, size: sq ? 24 : 26, text: 'Samostatný svaz od roku 1968', style: `color:${C.ice};letter-spacing:.18em`, inAttr: 'data-in="left" data-d=".16"' });
    y += 170 + 50;
    h += T(E, { cls: 'crs-h', x: b.x - 3, y, w: b.w, size: sz.hd, fit: 60, text: 'Český rybářský', inAttr: 'data-in="up" data-d=".08"', main: true });
    h += T(E, { cls: 'crs-h', x: b.x - 3, y: y + sz.hd * 0.98, w: b.w, size: sz.hd, fit: 60, text: 'svaz', inAttr: 'data-in="up" data-d=".12"', main: true, style: `color:${C.ice}` });
    y += sz.hd * 0.98 * 2 + 30;
    h += T(E, { cls: 'crs-p', x: b.x, y, w: b.w * 0.94, size: sz.p, lines: 3, main: true, text: 'Nezisková organizace s dlouholetou tradicí. Věnuje se rybářství, ochraně vodních živočichů a přírody.', inAttr: 'data-in="up" data-d=".2"' });
    y += sz.p * 1.25 * 3 + 34;
    h += `<i class="abs" data-in="wipe-r" data-d=".3" style="left:${R1(b.x)}px;top:${R1(y - 16)}px;width:120px;height:3px;background:${C.turq}"></i>`;
    h += T(E, { cls: 'crs-s', x: b.x, y, w: b.w, size: sz.s, lines: 2, text: 'Mezi největší zájmová sdružení v České republice', inAttr: 'data-in="up" data-d=".3"' });
    return { html: h };
  },

  // 2 — LONG-TERM SUPPORT of Trout Area: the MČR 2025 trophy table in the ČRS cloth (our gallery)
  range(E) {
    const b = E.body, sq = E.kind === 'square';
    const hd = sq ? 140 : 150;
    let h = `<div class="full" style="background:${C.deep}"></div>`;
    h += photo(E, PH_MCR25, { ...TABLE, tx: E.W * 0.6, ty: sq ? 780 : 1000, w: sq ? 2500 : 2900, attrs: 'data-kb="1.02,1.1"' });
    h += `<div class="full" style="background:linear-gradient(180deg,rgba(12,25,52,.95) 0%,rgba(12,25,52,.86) ${sq ? 40 : 34}%,rgba(12,25,52,.3) ${sq ? 55 : 50}%,rgba(12,25,52,0) 64%,rgba(12,25,52,.15) 80%,rgba(8,16,34,.88) 100%)"></div>`;
    h += `<div class="full" style="background:${C.blue};mix-blend-mode:soft-light;opacity:.32"></div>`;
    let y = b.y + 6;
    h += T(E, { cls: 'crs-k', x: b.x, y, w: b.w, size: sq ? 26 : 28, text: 'Trout Area CZ · MČR', inAttr: 'data-in="left"' });
    y += (sq ? 26 : 28) * 1.8;
    h += T(E, { cls: 'crs-h', x: b.x - 4, y, w: b.w, size: hd, lines: 2, html: `${E.t('Dlouholetá')}<br>${E.t('podpora')}`, inAttr: 'data-in="up" data-d=".05"', main: true });
    y += hd * 0.98 * 2 + 26;
    h += T(E, { cls: 'crs-p', x: b.x, y, w: b.w * 0.9, size: sq ? 40 : 44, lines: 2, main: true, text: 'Poháry MČR 2025 na stole pod znakem\u00a0ČRS', inAttr: 'data-in="up" data-d=".18"', style: 'font-weight:700;text-shadow:0 2px 14px rgba(0,0,0,.4)' });
    h += T(E, { cls: 'crs-cap', x: b.r - 400, y: b.b - 26, w: 400, size: 20, align: 'right', text: 'Foto: MČR 2025' });
    return { html: h, taTone: 'scrim' };
  },

  // 3 — THE VENUE: Líheň Liběchov, the race pond Malý Sporťáček as a plan (schéma), owned by ČRS, místní organizace Mělník
  hero(E) {
    const b = E.body, sq = E.kind === 'square';
    let h = world();
    if (E.kind === 'wide') {
      // 16:9: the plan of Malý Sporťáček right (numbered → „čísla míst orientační“ + © ČÚZK), facts + owner card left
      const top = b.y + 30, bot = b.b - 24;
      const mh = PL_EXT.y1 - PL_EXT.y0, mw = PL_EXT.x1 - PL_EXT.x0;
      const s = Math.min((bot - top) / mh, 440 / mw), r = Math.max(9, Math.round(s * 1.15));
      const cx = b.r - 6 - PL_EXT.x1 * s, cy = top - PL_EXT.y0 * s;
      const plan = pondPlan(E, { cx, cy, s, r });
      h += `<div class="full" data-in="scale" data-d=".04" style="transform-origin:${R1(cx)}px ${R1(cy)}px">${plan.html}</div>`;
      const pl = Math.min(plan.pins.x0, plan.bbox.x0);
      h += `<div class="crs-note t" style="left:${R1(b.r - 400)}px;width:400px;text-align:right;top:${R1(Math.max(plan.pins.y1, plan.bbox.y1) + 6)}px;font-size:14px">Schéma · čísla míst orientační</div>`;
      h += `<div class="crs-note t" style="left:${R1(b.r - 400)}px;width:400px;text-align:right;top:${R1(Math.min(plan.pins.y0, plan.bbox.y0) - 24)}px;font-size:13px">Podklad © ČÚZK</div>`;
      const colW = Math.min(620, pl - 50 - b.x);
      let y = b.y + 6;
      h += T(E, { cls: 'crs-k', x: b.x, y, w: colW, size: 20, text: 'Místo konání MČR 2026', inAttr: 'data-in="left"' });
      y += 34;
      h += T(E, { cls: 'crs-h', x: b.x - 3, y, w: colW, size: 72, fit: 46, text: 'Líheň Liběchov', inAttr: 'data-in="up" data-d=".05"', main: true });
      y += 72 + 14;
      h += T(E, { cls: 'crs-cap', x: b.x, y, w: colW, size: 20, fit: 14, text: 'Rybník Malý Sporťáček', style: `color:${C.ice}`, inAttr: 'data-in="left" data-d=".12"' });
      y += 30;
      h += T(E, { cls: 'crs-h', x: b.x - 3, y, w: 150, size: 104, fit: 70, text: '40', style: `color:${C.white}`, inAttr: 'data-in="up" data-d=".16"', main: true });
      h += `<i class="abs" data-in="wipe-r" data-d=".22" style="left:${R1(b.x + 150)}px;top:${R1(y + 40)}px;width:70px;height:4px;background:${C.turq}"></i>`;
      h += T(E, { cls: 'crs-l', x: b.x + 150, y: y + 54, w: colW - 150, size: 30, fit: 20, text: 'závodních míst', inAttr: 'data-in="up" data-d=".2"' });
      const FC = { x: b.x, w: colW, k: 'Areál vlastní', b: 'Český rybářský svaz, místní organizace Mělník', ks: 17, bs: 24, blines: 2, align: 'left', inAttr: 'data-in="up" data-d=".25" data-dist="20"' };
      const F = factCard(E, { ...FC, y: 0 });
      h += factCard(E, { ...FC, y: b.b - F.h - 2 }).html;
      return { html: h, taTone: 'dark' };
    }
    const hd = sq ? 104 : 118, ks = sq ? 26 : 28;
    let y = b.y + 6;
    h += T(E, { cls: 'crs-k', x: b.x, y, w: b.w, size: ks, text: 'Místo konání MČR 2026', inAttr: 'data-in="left"' });
    y += ks * 1.8;
    h += T(E, { cls: 'crs-h', x: b.x - 4, y, w: b.w, size: hd, fit: 60, text: 'Líheň Liběchov', inAttr: 'data-in="up" data-d=".05"', main: true });
    y += hd * 1.0 + 18;
    // plan on the right, as large as the free box allows (30 px under it for the „schéma“ note)
    const top = y + 10, bot = b.b - 34;
    const mh = PL_EXT.y1 - PL_EXT.y0, mw = PL_EXT.x1 - PL_EXT.x0;
    const s = Math.min((bot - top) / mh, (sq ? 440 : 420) / mw);   // leave ≥ 500 px for the owner card (3 lines)
    const r = Math.max(10, Math.round(s * 1.15));
    const cx = b.r - 6 - PL_EXT.x1 * s, cy = top - PL_EXT.y0 * s;
    const plan = pondPlan(E, { cx, cy, s, r });
    h += `<div class="full" data-in="scale" data-d=".04" style="transform-origin:${R1(cx)}px ${R1(cy)}px">${plan.html}</div>`;
    const pl = Math.min(plan.pins.x0, plan.bbox.x0);
    h += `<div class="crs-note t" style="left:${R1(b.r - 420)}px;width:420px;text-align:right;top:${R1(Math.max(plan.pins.y1, plan.bbox.y1) + 8)}px;font-size:${sq ? 16 : 18}px">Schéma · čísla míst orientační</div>`;
    // „podklad © ČÚZK“ (review 22. 10. MINOR 1): the scheme is traced from the ČÚZK orthophoto (mcr-2026-dron/data); above the plan,
    // right-aligned — next to the note it would run into the owner card
    h += `<div class="crs-note t" style="left:${R1(b.r - 420)}px;width:420px;text-align:right;top:${R1(Math.min(plan.pins.y0, plan.bbox.y0) - (sq ? 30 : 34))}px;font-size:${sq ? 15 : 17}px">Podklad © ČÚZK</div>`;
    // left column: pond name + 40 places + owner fact card
    const colW = pl - 40 - b.x;
    let fy = top + 4;
    h += T(E, { cls: 'crs-cap', x: b.x, y: fy, w: colW, size: sq ? 24 : 26, fit: 16, text: 'Rybník Malý Sporťáček', style: `color:${C.ice}`, inAttr: 'data-in="left" data-d=".12"' });
    fy += (sq ? 24 : 26) * 1.6;
    h += T(E, { cls: 'crs-h', x: b.x - 4, y: fy, w: colW, size: sq ? 150 : 170, fit: 90, text: '40', style: `color:${C.white}`, inAttr: 'data-in="up" data-d=".16"', main: true });
    fy += (sq ? 150 : 170) * 0.98;
    h += `<i class="abs" data-in="wipe-r" data-d=".22" style="left:${R1(b.x)}px;top:${R1(fy + 4)}px;width:110px;height:4px;background:${C.turq}"></i>`;
    fy += 22;
    h += T(E, { cls: 'crs-l', x: b.x, y: fy, w: colW, size: sq ? 40 : 44, fit: 24, text: 'závodních míst', inAttr: 'data-in="up" data-d=".2"', main: true });
    const FC = { x: b.x, w: colW, k: 'Areál vlastní', b: 'Český rybářský svaz, místní organizace Mělník', ks: sq ? 22 : 24, bs: sq ? 36 : 38, blines: 3, align: 'left', inAttr: 'data-in="up" data-d=".25" data-dist="50"' };
    const F = factCard(E, { ...FC, y: 0 });
    h += factCard(E, { ...FC, y: b.b - F.h - 4 }).html;
    return { html: h, taTone: 'dark' };
  },

  // 4 — THANK-YOU: seal + lockup + URL (chip „Děkujeme za dlouholetou podporu“ + event line come from the engine chrome)
  mcr(E) {
    const b = E.body, sq = E.kind === 'square';
    const S = sq ? { k: 0, thx: 150, gap: 36, logoW: 280, line: 52 } : { k: 0, thx: 170, gap: 44, logoW: 320, line: 60 };
    const sealH = 150, us = sq ? 64 : 76;
    const blockH = sealH + 60 + S.thx * 0.98 + S.gap + 88 + S.gap + S.line * 1.05 + 46 + us;
    let y = b.y + Math.max(0, (b.h - blockH) / 2);
    let h = world();
    h += seal(E, { cx: b.x + b.w / 2, cy: y + sealH / 2 + 6, maxW: sealH, rings: 2, sweep: '0.3,1.3' }).html;
    y += sealH + 60;
    const LK = lockup(E, { y, S, kicker: '' });
    h += LK.html;
    h += T(E, { cls: 'crs-url', x: b.x, y: LK.y + 46, w: b.w, size: us, align: 'center', fit: 40, text: 'rybsvaz.cz', inAttr: 'data-in="up" data-d=".35"', main: true, style: `color:${C.ice}` });
    return { html: h };
  },
};
