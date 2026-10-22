// LÍHEŇ LIBĚCHOV — místo konání MČR 2026 (role host: chip „Místo konání MČR 2026“, NO prize wording anywhere).
// World = the film's venue block (mcr-2026-sponzori/scripts/blocks/venue.mjs + scripts/lib/fx_venue.mjs): navy #1a212e, turquoise
// #17a1c8, aqua #9ae7e8, gold #d8af64 (lihenlibechov.cz CSS), Bitter 900 uppercase + Montserrat 800 italic uppercase kickers,
// the approved v2 drone flyover (last frame) with the white + red plan of Malý Sporťáček laid ON the real pond (fx_venue AR fit),
// the logo's etched trout, caustic water light, the AI rainbow trout leap (scene_leap2_d, labelled „AI ilustrace“ as in the film).
// Facts only from research/libechov.md (Verification + re-verification 21. 10.), data/blocks/venue.json, vo/script_cs.json:
//   pstruží líheň od roku 1934 · založil Karel Stutzig · 90+ let tradice · pramen Boží Voda · „donedávna“ nejníže položené
//   pstruhařství v Evropě, 164 m n. m. (never without „donedávna“) · chov: siven, pstruh duhový, pstruh potoční · dva sportovní
//   rybníky Velký Sporťák (přes 2 ha — never 2,5 ha) + Malý Sporťáček 0,2 ha · Malý Sporťáček 50 × 40 m, hloubka 1,5 m (web) ·
//   MČR = 40 závodních míst (data/pond_scheme.json; peg layout = proposal → labelled „schéma“) · Dějiště MČR 24.–25. 10. 2026 ·
//   „Přijďte se podívat“ (aktualita) · Boží Voda 289, Liběchov. NEVER „chyť a pusť“ for Malý Sporťáček.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const FILM = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../mcr-2026-sponzori');
const POND = JSON.parse(fs.readFileSync(path.join(FILM, 'data/pond_scheme.json'), 'utf8'));

export const brand = {
  name: 'Líheň Liběchov',
  url: 'lihenlibechov.cz',
  role: 'host',                       // → chip „Místo konání MČR 2026“ (no prize chip)
};

const C = { navy: '#1a212e', deep: '#0f6f8c', abyss: '#0e3a52', turq: '#17a1c8', aqua: '#9ae7e8', gold: '#d8af64', white: '#ffffff', red: '#e31e24', ink: '#0e141c' };
export const theme = {
  bg: C.navy,
  taTone: 'scrim',
  chrome: { url: C.white, urlFont: "'Montserrat'", urlW: 800, sub: C.aqua, dot: C.gold, chipBg: 'rgba(14,20,28,.72)', chipLine: 'rgba(216,175,100,.6)', chipFg: '#fff8ec', event: 'rgba(255,255,255,.92)' },
};
// 10 s seamless loop: poster (drone + plan) → heritage 1934 → race pond plan → MČR date → poster
export const anim = {
  seq: [
    { scene: 'poster', d: 2.3 },
    { scene: 'who', d: 1.9 },
    { scene: 'hero', d: 2.2 },
    { scene: 'mcr', d: 1.8 },
    { scene: 'poster', d: 1.8 },
  ],
};

const PREP = 'film:assets_prep/';
const P = {
  drone: `${PREP}libechov/venue/_drone_final_last.jpg`,       // 1080×1920, last frame of drone/final/flyover_9x16.mp4 (AR fit below)
  drone16: 'own:assets/venue/drone16_last.jpg',                // 1920×1080, last frame of drone/final/flyover_16x9.mp4
  disc: `${PREP}venue/ads/h1_arena_disc.png`,                 // 2000² round lens of the ČÚZK orthophoto (summer), pond centroid = centre, north up
  leap: `${PREP}fish_ai/scenes/scene_leap2_d.png`,            // 752×1344 AI rainbow trout leap (verdict 21. 10.)
  etch: `${PREP}venue/ads/s2_etched_trout_ink.png`,            // the logo's etched trout (alpha → CSS mask)
  caus: `${PREP}venue/ads/fx_caustics.png`,                    // tileable caustic web 768²
  logo: `${PREP}libechov/logo.png`,                            // round badge 2000², transparent outside the disc
};
// fx_venue.mjs AR: GSAP transform laying the portrait plan (origin = pond centroid at (540, 957), 12.6 px/m) onto the pond of the
// drone's last 1080×1920 frame (RMS ≈ 6 px). GSAP order: perspective → translate → rotate → rotateY → rotateX → scale.
const AR = { cx: 540, cy: 957, s: 12.6, x: -68.76, y: 92.7, rotation: 14.05, rotationX: 51.6, rotationY: -17.72, scale: 0.745, persp: 2154 };
const AR_T = `perspective(${AR.persp}px) translate(${AR.x}px,${AR.y}px) rotate(${AR.rotation}deg) rotateY(${AR.rotationY}deg) rotateX(${AR.rotationX}deg) scale(${AR.scale})`;

export const fonts = {};   // Bitter + Montserrat (normal + italic) are in the engine registry

export function css(E) {
  return `
.vn-k{font-family:Montserrat;font-weight:800;font-style:italic;text-transform:uppercase;letter-spacing:.12em;color:${C.gold}}
.vn-h{font-family:Bitter;font-weight:900;text-transform:uppercase;line-height:1.02;padding-top:.1em;color:${C.white};letter-spacing:-.005em}
.vn-h em{font-style:normal;color:${C.gold}}
.vn-s{font-family:Montserrat;font-weight:800;font-style:italic;text-transform:uppercase;letter-spacing:.06em;color:${C.aqua};line-height:1.1}
.vn-p{font-family:Montserrat;font-weight:600;color:#e8f1f4;line-height:1.25}
.vn-n{font-family:Bitter;font-weight:900;color:${C.gold};line-height:1}
.vn-shadow{filter:drop-shadow(0 4px 14px rgba(0,0,0,.55))}
.vn-tint{position:absolute;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center}
.vn-caus{position:absolute;inset:0;mix-blend-mode:screen;pointer-events:none;background-repeat:repeat}
.vn-pl{position:absolute;border-radius:50%;background:${C.red};box-shadow:0 0 0 2px #fff,0 3px 8px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;font-family:Montserrat;font-weight:800;color:#fff;letter-spacing:-.02em}
.vn-pill{position:absolute;display:flex;align-items:center;gap:.45em;padding:0 .8em;border-radius:999px;border:3px solid #fff;background:rgba(14,20,28,.55);font-family:Montserrat;font-weight:800;color:#fff;white-space:nowrap;box-shadow:0 6px 20px rgba(0,0,0,.35)}
.vn-pill b{display:block;width:.42em;height:.42em;border-radius:50%;background:${C.red};flex:none}
.vn-dim{position:absolute;background:#fff}
.vn-dl{position:absolute;font-family:Montserrat;font-weight:800;color:#fff;white-space:nowrap;text-align:center}
.vn-card{position:absolute;border-radius:22px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.45),0 0 0 3px rgba(255,255,255,.9),0 0 0 9px rgba(154,231,232,.25)}
.vn-ai{position:absolute;font-family:Montserrat;font-weight:600;letter-spacing:.1em;color:rgba(255,255,255,.72);text-transform:uppercase;text-shadow:0 1px 4px rgba(0,0,0,.6)}
.vn-rule{position:absolute;height:6px;border-radius:3px;background:${C.gold}}
.vn-row{position:absolute;border-left:5px solid ${C.gold};padding-left:22px}
`;
}

// ---------- helpers ----------
const R1 = (n) => Math.round(n * 10) / 10;
const T = (E, { cls, x, y, w, size, text, html, align = 'left', fit = 0, lines = 0, main = false, inAttr = '', style = '', id = '' }) =>
  `<div ${id ? `id="${id}" ` : ''}class="t ${cls}${main ? ' main' : ''}" ${inAttr} ${fit ? `data-fit="${fit}"` : ''} ${lines ? `data-lines="${lines}"` : ''} style="left:${R1(x)}px;top:${R1(y)}px;width:${R1(w)}px;font-size:${size}px;text-align:${align};${lines ? 'white-space:normal;' : 'overflow:hidden;'}${style}">${html ?? E.t(text)}</div>`;

// two-line headline as two single-line fitted rows (diacritics on caps make a 2-line data-lines box overflow its height)
const H2 = (E, { cls = 'vn-h', x, y, w, size, fit, a, b2, inAttr = '', d = 0.06, lh = 0.98 }) =>
  T(E, { cls, x, y, w, size, fit, text: a, inAttr: inAttr || `data-in="up" data-d="${d}"`, main: true }) +
  T(E, { cls, x, y: y + size * lh, w, size, fit, text: b2, inAttr: inAttr || `data-in="up" data-d="${(d + 0.06).toFixed(2)}"`, main: true });

const caustics = (E, { op = 0.2, size = 640, mask = '' } = {}) => {
  const u = E.src(P.caus), s2 = Math.round(size * 1.47);
  const m = mask ? `-webkit-mask-image:${mask};mask-image:${mask};` : '';
  return `<div class="vn-caus" data-pan="-60,24" style="opacity:${op};background-image:url(${u}),url(${u});background-size:${size}px ${size}px,${s2}px ${s2}px;${m}"></div>`;
};
// the logo's etched trout as a tinted line drawing (CSS mask, no <img> → never measured as a product)
const etch = (E, { x, y, h, color = '#ffffff', op = 0.2, attrs = '' }) => {
  const [nw, nh] = E.dims(P.etch), w = (h * nw) / nh, u = E.src(P.etch);
  return `<div class="vn-tint" ${attrs} style="left:${R1(x)}px;top:${R1(y)}px;width:${R1(w)}px;height:${R1(h)}px;opacity:${op};background:${color};-webkit-mask-image:url(${u});mask-image:url(${u})"></div>`;
};
const deepBg = (at = '62% 40%') => `<div class="full" style="background:radial-gradient(120% 85% at ${at},#26354d 0%,#172031 48%,#0d1219 100%)"></div>`;
const waterBg = () => `<div class="full" style="background:linear-gradient(180deg,#1f9fc4 0%,${C.deep} 30%,${C.abyss} 66%,${C.navy} 100%)"></div>`;
const shafts = () => `<div class="full" style="mix-blend-mode:screen;-webkit-mask-image:linear-gradient(180deg,#000,rgba(0,0,0,.4) 50%,transparent 85%);mask-image:linear-gradient(180deg,#000,rgba(0,0,0,.4) 50%,transparent 85%)">
  ${[[18, 120, -14, 0.22], [46, 80, -9, 0.16], [70, 150, -18, 0.2], [88, 70, -6, 0.12]].map(([l, w, r, a]) => `<i class="abs" style="left:${l}%;top:-20%;width:${w}px;height:150%;transform:rotate(${r}deg);transform-origin:50% 0;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,${a}) 50%,rgba(255,255,255,0))"></i>`).join('')}</div>`;

// plan of Malý Sporťáček (portrait = drone-matched frame) in white + red: water tint, red glow, white outline, 1,5 m isoline,
// places 1–40 as red pins just outside the water edge. Drawn in a W×H frame, centroid at (cx, cy), s px/m.
function pondPlan(E, { W, H, cx, cy, s, r = 13, out = 2.6, nums = true, fill = 0.1, pinAnim = false }) {
  const O = POND.outline.clean;
  const nss = 'vector-effect="non-scaling-stroke"';
  let svg = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="position:absolute;left:0;top:0;overflow:visible">
    <defs><filter id="vnblur-${Math.round(s * 10)}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${(9 / s).toFixed(3)}"/></filter></defs>
    <g transform="translate(${cx} ${cy}) scale(${s})">
      <path d="${O.path_d_portrait}" fill="#ffffff" fill-opacity="${fill}"/>
      <path d="${O.path_d_portrait}" transform="scale(.86)" fill="none" stroke="${C.red}" stroke-width="2.4" stroke-dasharray="9 8" ${nss} opacity=".85"/>
      <path d="${O.path_d_portrait}" fill="none" stroke="${C.red}" stroke-width="${(14 / s).toFixed(3)}" filter="url(#vnblur-${Math.round(s * 10)})" opacity=".8"/>
      <path d="${O.path_d_portrait}" fill="none" stroke="#ffffff" stroke-width="${(5 / s).toFixed(3)}" stroke-linejoin="round"/>`;
  let pins = '';
  const pts = [];
  for (const p of POND.places.list) {
    const [ex, ey] = p.water_edge_portrait, [px0, py0] = p.xy_portrait;
    const dx = px0 - ex, dy = py0 - ey, L = Math.hypot(dx, dy) || 1;
    const qx = ex + (dx / L) * out, qy = ey + (dy / L) * out;
    svg += `<line x1="${ex}" y1="${ey}" x2="${qx.toFixed(3)}" y2="${qy.toFixed(3)}" stroke="#fff" stroke-width="2" ${nss} opacity=".8"/>`;
    const X = cx + qx * s, Y = cy + qy * s;
    pts.push([X, Y]);
    const an = pinAnim ? `data-in="scale" data-d="${(0.15 + p.n * 0.018).toFixed(3)}" data-dur="0.35"` : '';
    pins += `<div class="vn-pl" ${an} style="left:${R1(X - r)}px;top:${R1(Y - r)}px;width:${2 * r}px;height:${2 * r}px;font-size:${R1(r * 1.0)}px">${nums ? p.n : ''}</div>`;
  }
  svg += '</g></svg>';
  const [bx0, by0, bx1, by1] = O.bbox_portrait;
  const px = pts.map((p) => p[0]), py = pts.map((p) => p[1]);
  return {
    html: svg + pins,
    bbox: { x0: cx + bx0 * s, y0: cy + by0 * s, x1: cx + bx1 * s, y1: cy + by1 * s },
    pins: { x0: Math.min(...px) - r, x1: Math.max(...px) + r, y0: Math.min(...py) - r, y1: Math.max(...py) + r },
  };
}
// extent of the plan (pins included) in metres around the centroid → fit a box
const PL_EXT = (() => {
  const xs = [], ys = [];
  for (const p of POND.places.list) {
    const [ex, ey] = p.water_edge_portrait, [px0, py0] = p.xy_portrait, dx = px0 - ex, dy = py0 - ey, L = Math.hypot(dx, dy) || 1;
    xs.push(ex + (dx / L) * 2.6); ys.push(ey + (dy / L) * 2.6);
  }
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
})();

// the drone's last frame (1080×1920, native) shifted by dy, with the plan laid on the real pond (AR) — portrait-type formats
function droneAR(E, { dy, kb = true, pins = true, dark = 0 }) {
  const plan = pondPlan(E, { W: 1080, H: 1920, cx: AR.cx, cy: AR.cy, s: AR.s, r: 13, nums: true, fill: 0.12 });
  const img = `<img src="${E.src(P.drone)}" alt="" style="position:absolute;left:0;top:0;width:1080px;height:1920px">`;
  const ov = `<div class="abs" style="left:0;top:0;width:1080px;height:1920px;transform-origin:${AR.cx}px ${AR.cy}px;transform:${AR_T}">${pins ? plan.html : plan.html.replace(/<div class="vn-pl"[^>]*>[^<]*<\/div>/g, '')}</div>`;
  const pcx = AR.cx + AR.x, pcy = AR.cy + AR.y + dy;   // pond centre on screen
  return {
    html: `<div class="full" ${kb ? 'data-kb="1,1.045"' : ''} style="transform-origin:${R1(pcx)}px ${R1(pcy)}px"><div class="abs" style="left:0;top:${dy}px;width:1080px;height:1920px">${img}${ov}</div></div>
      <div class="full" style="background:${C.turq};mix-blend-mode:soft-light;opacity:.28"></div>${dark ? `<div class="full" style="background:rgba(14,20,30,${dark})"></div>` : ''}`,
    pcx, pcy,
  };
}
const pill = (E, { x, y, size, text, attrs = '' }) => `<div class="vn-pill t" ${attrs} style="left:${R1(x)}px;top:${R1(y)}px;height:${R1(size * 1.9)}px;font-size:${size}px"><b></b>${E.t(text)}</div>`;
const LOGO_TRIM = [0, 0, 2000, 2000];

// ---------- scenes ----------
export const scenes = {
  // POSTER (1:1 / 4:5 / 1.91:1 / 9:16 + loop start/end): the real place from the drone, the race pond outlined on it
  poster(E) {
    const b = E.body, k = E.kind;
    if (k === 'wide') {
      // 16:9 drone frame at native size, pond moved right of the text column
      let html = `<div class="full" data-kb="1,1.04" style="transform-origin:76% 55%"><img src="${E.src(P.drone16)}" alt="" style="position:absolute;left:-20px;top:-300px;width:1920px;height:1080px"></div>`;
      html += `<div class="full" style="background:${C.turq};mix-blend-mode:soft-light;opacity:.25"></div>`;
      html += `<div class="full" style="background:linear-gradient(90deg,rgba(14,20,30,.92) 0%,rgba(14,20,30,.8) 38%,rgba(14,20,30,.2) 62%,rgba(14,20,30,0) 75%),linear-gradient(180deg,rgba(14,20,30,.55),rgba(14,20,30,0) 30%,rgba(14,20,30,0) 70%,rgba(14,20,30,.6))"></div>`;
      const colW = 600;
      html += T(E, { cls: 'vn-k', x: b.x, y: b.y + 10, w: colW, size: 22, text: 'Pstruží líheň od roku 1934', inAttr: 'data-in="left" data-d=".08"' });
      html += T(E, { cls: 'vn-h vn-shadow', x: b.x - 3, y: b.y + 46, w: colW, size: 88, fit: 56, text: 'Líheň Liběchov', inAttr: 'data-in="slam" data-d=".12"', main: true });
      html += T(E, { cls: 'vn-s', x: b.x, y: b.y + 146, w: colW, size: 30, text: 'U pramene Boží Voda', inAttr: 'data-in="up" data-d=".25"' });
      html += pill(E, { x: 790, y: 300, size: 22, text: 'Malý Sporťáček', attrs: 'data-in="scale" data-d=".35"' });
      const L = E.logo(P.logo, { x: 0, y: 0, maxH: 999, trim: LOGO_TRIM });
      html += E.logo(P.logo, { x: b.x, y: b.b - L.h, trim: LOGO_TRIM, attrs: 'data-in="fade" data-d=".4"' }).html;
      return { html };
    }
    const S = {
      square: { dy: -330, kick: 28, head: 124, sub: 36, pill: 28, lines: 2 },
      portrait: { dy: -250, kick: 30, head: 136, sub: 40, pill: 28, lines: 2 },
      tall: { dy: 0, kick: 36, head: 176, sub: 48, pill: 28, lines: 2 },
    }[k];
    const D = droneAR(E, { dy: S.dy });
    let html = D.html;
    html += `<div class="full" style="background:linear-gradient(180deg,rgba(14,20,30,.88) 0%,rgba(14,20,30,.7) ${k === 'tall' ? 28 : 26}%,rgba(14,20,30,.25) ${k === 'tall' ? 40 : 42}%,rgba(14,20,30,0) ${k === 'tall' ? 50 : 54}%,rgba(14,20,30,0) 74%,rgba(14,20,30,.55) 100%)"></div>`;
    const L = E.logo(P.logo, { x: 0, y: 0, maxH: 999, trim: LOGO_TRIM });
    const colW = b.w - L.w - 30;
    let y = b.y + 6;
    html += T(E, { cls: 'vn-k', x: b.x, y, w: colW, size: S.kick, text: 'Pstruží líheň od roku 1934', inAttr: 'data-in="left" data-d=".06"' });
    y += S.kick * 1.6;
    html += H2(E, { cls: 'vn-h vn-shadow', x: b.x - 4, y, w: colW + 4, size: S.head, fit: 80, a: 'Líheň', b2: 'Liběchov', d: 0.1 });
    y += S.head * 0.98 * 2 + 30;
    html += T(E, { cls: 'vn-s vn-shadow', x: b.x, y, w: b.w, size: S.sub, text: 'U pramene Boží Voda', inAttr: 'data-in="up" data-d=".25"' });
    html += E.logo(P.logo, { x: b.r - L.w, y: b.y + 4, trim: LOGO_TRIM, attrs: 'data-in="fade" data-d=".3"' }).html;
    // label next to the real pond (right of its outline)
    html += pill(E, { x: D.pcx + 232, y: D.pcy - S.pill * 0.95 - 84, size: S.pill, text: 'Malý Sporťáček', attrs: 'data-in="scale" data-d=".35"' });
    return { html };
  },

  // 1 — WHO: heritage — pstruží líheň od roku 1934, Karel Stutzig, pramen Boží Voda; the AI rainbow trout leap as the picture
  who(E) {
    const b = E.body, sq = E.kind === 'square';
    let html = deepBg('70% 40%');
    html += etch(E, { x: b.x - 120, y: b.y + 40, h: b.h * 1.1, color: '#ffffff', op: 0.07 });
    // the leap (AI) in a framed card, bottom-right, native or smaller
    const [nw, nh] = E.dims(P.leap);
    const ph = Math.min(b.h - 8, sq ? 736 : 820, nh), pw = ph * nw / nh;
    const px0 = b.r - pw, py0 = b.b - ph;
    html += `<div class="vn-card" data-in="rise" data-d=".05" style="left:${R1(px0)}px;top:${R1(py0)}px;width:${R1(pw)}px;height:${R1(ph)}px"><img src="${E.src(P.leap)}" alt="" style="position:absolute;inset:0;width:100%;height:100%">
      <div class="full" style="background:linear-gradient(180deg,rgba(0,0,0,0) 80%,rgba(0,0,0,.45))"></div>
      <div class="vn-ai t" style="right:16px;bottom:12px;font-size:17px">AI ilustrace</div></div>`;
    const colW = b.w - pw - 36;
    let y = b.y + 6;
    const ks = sq ? 26 : 30, hs = sq ? 92 : 104, ys = sq ? 210 : 250;
    html += T(E, { cls: 'vn-k', x: b.x, y, w: colW, size: ks, text: 'Mistrovství hostí', style: `color:${C.aqua}`, inAttr: 'data-in="left"' });
    y += ks * 1.6;
    html += H2(E, { x: b.x - 3, y, w: colW + 3, size: hs, fit: 56, a: 'Líheň', b2: 'Liběchov' });
    y += hs * 0.98 * 2 + (sq ? 40 : 66);
    html += T(E, { cls: 'vn-s', x: b.x, y, w: colW, size: sq ? 30 : 34, text: 'Pstruží líheň od roku', style: 'color:#fff', inAttr: 'data-in="up" data-d=".14"' });
    y += (sq ? 30 : 34) * 1.2;
    html += T(E, { cls: 'vn-n vn-shadow', x: b.x - 8, y, w: colW + 8, size: ys, fit: 120, text: '1934', inAttr: 'data-in="slam" data-d=".18"', main: true });
    y += ys * 1.0 + 6;
    html += `<div class="vn-rule" data-in="wipe-l" data-d=".3" style="left:${b.x}px;top:${R1(y)}px;width:${Math.min(360, colW)}px"></div>`;
    y += 28;
    html += T(E, { cls: 'vn-p', x: b.x, y, w: colW, size: sq ? 34 : 38, lines: 3, text: 'Založil Karel Stutzig. Přes 90 let tradice u pramene Boží Voda.', style: 'font-style:italic', inAttr: 'data-in="up" data-d=".34"' });
    return { html, taTone: 'dark' };
  },

  // 2 — THE PLACE: the hatchery and its ponds from above (ČÚZK orthophoto); 164 m n. m. „donedávna…“; two sport ponds; fish
  range(E) {
    const b = E.body, sq = E.kind === 'square';
    // the real pond from above (ČÚZK orthophoto, summer) in a round map lens, half off the right edge
    const D = sq ? 700 : 800, pcx = b.r - (sq ? 110 : 130), pcy = sq ? 590 : 730;
    let html = deepBg('80% 50%') + caustics(E, { op: 0.06, size: 560 });
    html += `<div class="abs" data-in="scale" data-d=".02" style="left:${R1(pcx - D / 2)}px;top:${R1(pcy - D / 2)}px;width:${D}px;height:${D}px;border-radius:50%;box-shadow:0 40px 90px rgba(0,0,0,.5),0 0 0 6px rgba(255,255,255,.92),0 0 0 16px rgba(154,231,232,.28)"><img src="${E.src(P.disc)}" alt="" data-kb="1,1.04" style="position:absolute;inset:0;width:100%;height:100%"></div>`;
    html += `<div class="full" style="background:linear-gradient(90deg,rgba(13,18,25,.9) 0%,rgba(13,18,25,.7) 38%,rgba(13,18,25,0) 52%)"></div>`;
    const colW = sq ? 540 : 580;
    let y = b.y + 6;
    const ks = sq ? 26 : 30, hs = sq ? 76 : 88;
    html += T(E, { cls: 'vn-k', x: b.x, y, w: colW, size: ks, text: 'Areál líhně', style: `color:${C.aqua}`, inAttr: 'data-in="left"' });
    y += ks * 1.6;
    html += H2(E, { x: b.x - 3, y, w: colW, size: hs, fit: 48, a: 'U pramene', b2: 'Boží Voda' });
    y += hs * 0.98 * 2 + (sq ? 44 : 70);
    const rows = [
      { n: '164 m n. m.', p: 'donedávna nejníže položené pstruhařství v Evropě' },
      { n: '2 sportovní rybníky', p: 'Velký Sporťák a Malý Sporťáček' },
      { n: 'Chov ryb', p: 'pstruh duhový, pstruh potoční, siven' },
    ];
    const ns = sq ? 44 : 50, ps = sq ? 27 : 30, gap = sq ? 30 : 46;
    rows.forEach((r, i) => {
      const lines = r.p.length > 32 ? 2 : 1, rh = ns * 1.08 + 8 + ps * 1.25 * lines;
      html += `<div class="vn-row" data-in="left" data-d="${(0.14 + i * 0.08).toFixed(2)}" style="left:${b.x}px;top:${R1(y)}px;width:${colW}px;height:${R1(rh)}px">
        ${T(E, { cls: 'vn-n', x: 27, y: 0, w: colW - 27, size: ns, fit: 32, text: r.n, main: true })}
        ${T(E, { cls: 'vn-p', x: 27, y: ns * 1.08 + 8, w: colW - 40, size: ps, lines: 2, text: r.p })}</div>`;
      y += rh + gap;
    });
    html += pill(E, { x: pcx - (sq ? 330 : 360), y: pcy + (sq ? 110 : 130), size: sq ? 26 : 28, text: 'Malý Sporťáček', attrs: 'data-in="scale" data-d=".3"' });
    return { html };
  },

  // 3 — HERO: the race pond plan — Malý Sporťáček, 40 závodních míst, 50 × 40 m, 0,2 ha, hloubka 1,5 m (lihenlibechov.cz)
  hero(E) {
    const b = E.body, sq = E.kind === 'square';
    let html = deepBg('68% 55%');
    html += caustics(E, { op: 0.07, size: 560 });
    const ks = sq ? 26 : 30, hs = sq ? 96 : 104;
    let y = b.y + 6;
    html += T(E, { cls: 'vn-k', x: b.x, y, w: b.w, size: ks, text: 'Závodí se na rybníku', style: `color:${C.red}`, inAttr: 'data-in="left"' });
    y += ks * 1.6;
    html += T(E, { cls: 'vn-h', x: b.x - 4, y, w: b.w + 4, size: hs, fit: 60, text: 'Malý Sporťáček', inAttr: 'data-in="slam" data-d=".06"', main: true });
    y += hs * 1.0 + (sq ? 30 : 50);
    // plan on the right, as large as the free box allows
    const top = y + 40, bot = b.b - 6;   // 40 px for the 40 m callout
    const mh = PL_EXT.y1 - PL_EXT.y0, mw = PL_EXT.x1 - PL_EXT.x0;
    const s = Math.min((bot - top) / mh, (sq ? 500 : 560) / mw);
    const r = Math.max(10, Math.round(s * 1.15));
    const cx = b.r - 10 - PL_EXT.x1 * s, cy = top - PL_EXT.y0 * s;
    const plan = pondPlan(E, { W: E.W, H: E.H, cx, cy, s, r, fill: 0.1, pinAnim: true });
    html += `<div class="full" data-in="scale" data-d=".04" style="transform-origin:${R1(cx)}px ${R1(cy)}px">${plan.html}</div>`;
    // dimension callouts (web „50 x 40 m“), to scale: 50 m along the long axis left of the pins, 40 m across the top
    const len50 = 50 * s, x50 = plan.pins.x0 - 34, y50 = cy - len50 / 2;
    const len40 = 40 * s, y40 = plan.pins.y0 - 24, x40 = cx - len40 / 2;
    const dl = sq ? 24 : 26;
    html += `<div data-in="fade" data-d=".3">
      <div class="vn-dim" style="left:${R1(x50 - 1.5)}px;top:${R1(y50)}px;width:3px;height:${R1(len50)}px"><i class="vn-dim" style="left:-10px;top:-1.5px;width:23px;height:3px"></i><i class="vn-dim" style="left:-10px;bottom:-1.5px;width:23px;height:3px"></i></div>
      <div class="vn-dl t" style="left:${R1(x50 - 50)}px;top:${R1(cy - dl * 0.7)}px;width:100px;font-size:${dl}px;line-height:1.4;background:#172031;transform:rotate(-90deg)">50 m</div>
      <div class="vn-dim" style="left:${R1(x40)}px;top:${R1(y40 - 1.5)}px;width:${R1(len40)}px;height:3px"><i class="vn-dim" style="left:-1.5px;top:-10px;width:3px;height:23px"></i><i class="vn-dim" style="right:-1.5px;top:-10px;width:3px;height:23px"></i></div>
      <div class="vn-dl t" style="left:${R1(cx - 50)}px;top:${R1(y40 - dl * 0.7)}px;width:100px;font-size:${dl}px;line-height:1.4;background:#172031">40 m</div></div>`;
    html += `<div class="vn-ai t" style="left:${R1(plan.pins.x1 - 400)}px;width:400px;text-align:right;top:${R1(Math.min(b.b - 20, plan.pins.y1 + 4))}px;font-size:16px;opacity:.8">Schéma · čísla míst orientační</div>`;
    // facts column left of the plan
    const colW = x50 - 60 - b.x;
    let fy = y + (sq ? 10 : 40);
    html += T(E, { cls: 'vn-n', x: b.x - 6, y: fy, w: colW, size: sq ? 190 : 220, fit: 120, text: '40', style: 'color:#fff', inAttr: 'data-in="slam" data-d=".12"', main: true });
    fy += (sq ? 190 : 220) * 0.98;
    html += `<div class="vn-rule" data-in="wipe-l" data-d=".2" style="left:${b.x}px;top:${R1(fy)}px;width:110px;background:${C.red}"></div>`;
    fy += 22;
    html += T(E, { cls: 'vn-s', x: b.x, y: fy, w: colW, size: sq ? 34 : 38, fit: 24, text: 'závodních míst', style: 'color:#fff', inAttr: 'data-in="up" data-d=".2"' });
    fy += (sq ? 34 : 38) * 1.1 + (sq ? 40 : 70);
    const facts = [['50 × 40 m', 'rozměr'], ['0,2 ha', 'plocha'], ['1,5 m', 'hloubka']];
    const fs = sq ? 48 : 56, ls = sq ? 22 : 26;
    facts.forEach(([n, l], i) => {
      html += T(E, { cls: 'vn-n', x: b.x, y: fy, w: colW, size: fs, fit: 34, text: n, inAttr: `data-in="left" data-d="${(0.24 + i * 0.07).toFixed(2)}"`, main: true });
      html += T(E, { cls: 'vn-k', x: b.x, y: fy + fs * 1.04, w: colW, size: ls, text: l, style: `color:${C.aqua};letter-spacing:.2em`, inAttr: `data-in="left" data-d="${(0.27 + i * 0.07).toFixed(2)}"` });
      fy += fs * 1.04 + ls * 1.3 + (sq ? 22 : 34);
    });
    return { html, taTone: 'dark' };
  },

  // 4 — MČR: the venue of the championship + date + pond + invitation (role chip „Místo konání MČR 2026“ by the engine)
  mcr(E) {
    const b = E.body, sq = E.kind === 'square';
    let html = waterBg();
    html += caustics(E, { op: 0.26, size: 620, mask: 'linear-gradient(180deg,#000 0%,rgba(0,0,0,.6) 40%,transparent 75%)' });
    html += shafts();
    html += etch(E, { x: b.r - (sq ? 520 : 600), y: b.y + (sq ? 120 : 200), h: sq ? 760 : 920, color: C.aqua, op: 0.16, attrs: 'data-float="8,5"' });
    const ks = sq ? 28 : 32, hs = sq ? 176 : 196;
    let y = b.y + 10;
    html += T(E, { cls: 'vn-k', x: b.x, y, w: b.w, size: ks, text: 'Mistrovství ČR v Trout Area 2026', style: 'color:#fff', inAttr: 'data-in="left"' });
    y += ks * 1.9;
    html += T(E, { cls: 'vn-n vn-shadow', x: b.x - 8, y, w: b.w + 8, size: hs, fit: 90, text: '24.–25. 10.', inAttr: 'data-in="slam" data-d=".08"', main: true });
    y += hs * 1.0;
    html += T(E, { cls: 'vn-n vn-shadow', x: b.x - 4, y, w: b.w, size: sq ? 84 : 96, text: '2026', style: 'color:#fff', inAttr: 'data-in="up" data-d=".14"', main: true });
    y += (sq ? 84 : 96) * 1.0 + (sq ? 50 : 80);
    const L = E.logo(P.logo, { x: 0, y: 0, maxH: 999, trim: LOGO_TRIM });
    const colW = b.w - L.w - 30;
    html += T(E, { cls: 'vn-h vn-shadow', x: b.x - 3, y: y - (sq ? 76 : 86) * 0.1, w: colW, size: sq ? 76 : 86, fit: 44, text: 'Líheň Liběchov', inAttr: 'data-in="up" data-d=".22"', main: true });
    y += (sq ? 76 : 86) * 1.0 + 18;
    html += T(E, { cls: 'vn-s', x: b.x, y, w: colW, size: sq ? 36 : 40, text: 'rybník Malý Sporťáček', style: `color:${C.aqua}`, inAttr: 'data-in="up" data-d=".28"' });
    y += (sq ? 36 : 40) * 1.1 + (sq ? 40 : 56);
    html += `<div class="t vn-k" data-in="scale" data-d=".36" style="left:${b.x}px;top:${R1(y)}px;height:${sq ? 58 : 64}px;line-height:${sq ? 58 : 64}px;padding:0 26px;border-radius:999px;background:${C.gold};color:${C.navy};font-size:${sq ? 28 : 31}px;letter-spacing:.08em">${E.t('Přijďte se podívat')}</div>`;
    html += E.logo(P.logo, { x: b.r - L.w, y: b.b - L.h, trim: LOGO_TRIM, attrs: 'data-in="fade" data-d=".3"' }).html;
    return { html, taTone: 'scrim' };
  },
};
