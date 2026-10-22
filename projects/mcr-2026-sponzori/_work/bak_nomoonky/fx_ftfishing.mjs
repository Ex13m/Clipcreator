// fx_ftfishing.mjs — helpers used only by blocks/ftfishing.mjs (block, Reel hook, Reel end card).
// FT Fishing brand world (research/ftfishing_ad.md §2): white „paper“ of the web + the hero banner's GREEN DIAGONAL STRIPES
// (#6DB52C) + grey #878786 (perch / slogan). Exo 2 900 caps for titles (techno, close to the „FT“ lettering), Saira 700–800
// (wide) for the slogan / labels. Seek-safe: fromTo / hit / set only; moving elements never carry a CSS transform (static skew /
// rotation lives on children or wrappers that are never animated).
import { esc, nb } from './util.mjs';

const px = (n) => `${Math.round(n * 10) / 10}px`;
export const C = { green: '#6DB52C', greenUi: '#2EA200', greenDk: '#237C00', grey: '#878786', ink: '#1A1A1A', paper: '#FFFFFF', paper2: '#F1F2EE',
  fav: '#B33840', cf: '#E3027D', cfDk: '#0B0B0D', sm: '#066BB4', smSilver: '#E6E9EC', smSilver2: '#AEB5BC' };
export const EXO = 'Exo 2', SAIRA = 'Saira';
export const STRIPES = (c = C.green, w = 44, gap = 44, ang = 118) => `repeating-linear-gradient(${ang}deg, ${c} 0 ${w}px, transparent ${w}px ${w + gap}px)`;

// product index into data.products (data/blocks/ftfishing.json)
export const PR = { impulse: 0, vibro: 1, totem: 2, x1: 3, target: 4, lime: 5, hart: 6, king: 7, scalp: 8, nimble: 9, polaris: 10, glider: 11, comet: 12, rod: 13 };

// geometry: product i shown with its VISIBLE box V px wide (or VH px tall), visible centre at (cx, cy); never > maxUp × natural
export function geom(ctx, i, { V = null, VH = null, cx = 540, cy = 960, maxUp = 1.3 } = {}) {
  const p = ctx.data.products[i]; const [nw, nh] = ctx.dims(p.src);
  const pad = p.pad || [0, 0, 0, 0], vw = 1 - pad[0] - pad[2], vh = 1 - pad[1] - pad[3];
  let w = V != null ? V / vw : (VH / vh) * (nw / nh);
  if (w > nw * maxUp + 0.5) { ctx.warn(`product ${p.src.split('/').pop()} wants ${(w / nw).toFixed(2)}× natural — capped at ${maxUp}×`); w = nw * maxUp; }
  const h = (w * nh) / nw, ox = pad[0] + vw / 2, oy = pad[1] + vh / 2;
  return { w, h, left: cx - ox * w, top: cy - oy * h, ox, oy, vw: vw * w, vh: vh * h, url: ctx.asset(p.src), p };
}
// product: #id (entrance / exit / swap opacity) › #id-cam (camera: push, drift) › #id-r (static pose rotation) › img + sweep
// shadow = soft drop shadow on the image (light worlds) — one filter on the img, no extra layers
export function prod(ctx, { id, i, V = null, VH = null, cx, cy, rot = 0, sweep = true, so = 0.7, drop = '0 26px 30px rgba(0,0,0,.28)', style = '', maxUp = 1.3 }) {
  const g = geom(ctx, i, { V, VH, cx, cy, maxUp });
  const org = `${(g.ox * 100).toFixed(1)}% ${(g.oy * 100).toFixed(1)}%`;
  if (rot) ctx.tl.set(ctx.sel(`${id}-r`), { rotation: rot }, 0);
  const sw = sweep ? `<i class="fx-prod-sweep" id="${ctx.id(`${id}-sw`)}" style="-webkit-mask-image:url(${g.url});mask-image:url(${g.url});--sa:105deg;--so:${so}"></i>` : '';
  const html = `<div class="ft-p" id="${ctx.id(id)}" style="left:${px(g.left)};top:${px(g.top)};width:${px(g.w)};height:${px(g.h)};transform-origin:${org};${style}"><div class="fx-abs" id="${ctx.id(`${id}-cam`)}" style="inset:0;transform-origin:${org}"><div class="fx-abs" id="${ctx.id(`${id}-r`)}" style="inset:0;transform-origin:${org}"><img src="${g.url}" alt="" style="${drop ? `filter:drop-shadow(${drop})` : ''}">${sw}</div></div></div>`;
  return { html, sel: ctx.sel(id), cam: ctx.sel(`${id}-cam`), g };
}
export function sweep(ctx, id, t, { d = 0.7, ease = 'power2.inOut' } = {}) {
  ctx.tl.fromTo(ctx.sel(`${id}-sw`), { backgroundPosition: '110% 0%' }, { backgroundPosition: '-10% 0%', duration: d, ease }, t);
}

// static diagonal stripe band (the hero banner of ftfishing.cz): a skewed strip of green bars, the inner layer drifts (x)
//   y = centre line, h = thickness, rot = static tilt of the band (on the never-animated wrapper)
export function band(ctx, { id, y = 1250, h = 260, rot = -24, color = C.green, w = 3000, op = 1, drift = -160, t0 = 0, t1 = ctx.dur, style = '' }) {
  if (drift) ctx.tl.fromTo(ctx.sel(`${id}-in`), { x: 0 }, { x: drift, duration: Math.max(0.1, t1 - t0), ease: 'none' }, t0);
  return `<div class="ft-band" id="${ctx.id(id)}" style="left:${px(540 - w / 2)};top:${px(y - h / 2)};width:${px(w)};height:${px(h)};opacity:${op};${style}"><div class="ft-band-r" style="transform:rotate(${rot}deg)"><i id="${ctx.id(`${id}-in`)}" style="background:${STRIPES(color)}"></i></div></div>`;
}

// SLASH — the FT stripes as a wiper between worlds: a skewed track [stripes · solid green · stripes] crosses the frame right → left;
// its middle passes the frame centre at `t + lead` (the scene underneath switches exactly on the downbeat t). Overlay above the stage.
export function slash(ctx, { id, t, d = 0.4, lead = -0.04, color = C.green }) {
  const TW = 640, track = `<div class="ft-sl-t" id="${ctx.id(id)}" style="width:${TW}px"><i class="ft-sl-s" style="left:0;width:240px;background:${STRIPES(color, 30, 30, 90)}"></i><i class="ft-sl-s" style="left:220px;width:200px;background:${color}"></i><i class="ft-sl-s" style="left:400px;width:240px;background:${STRIPES(color, 30, 30, 90)}"></i></div>`;
  ctx.overlay(`<div class="fx-ov" style="overflow:hidden">${track}</div>`);
  const x0 = 1080 + 520, x1 = -TW - 520;   // fully outside left/right including the skew overhang
  const tc = t + lead - d / 2;
  ctx.tl.fromTo(ctx.sel(id), { x: x0 }, { x: x1, duration: d, ease: 'power2.inOut' }, tc);
}
// OUT: stripes lead, then a white (next world) panel closes the frame exactly at `end`
export function slashOut(ctx, { id = 'sout', end = ctx.dur, d = 0.36, color = C.green, cover = '#ffffff' } = {}) {
  const track = `<div class="ft-sl-t" id="${ctx.id(id)}" style="width:3200px"><i class="ft-sl-s" style="left:0;width:300px;background:${STRIPES(color, 30, 30, 90)}"></i><i class="ft-sl-s" style="left:280px;width:2920px;background:${cover}"></i></div>`;
  ctx.overlay(`<div class="fx-ov" style="overflow:hidden">${track}</div>`);
  ctx.tl.fromTo(ctx.sel(id), { x: 1080 + 520 }, { x: -280 - 640, duration: d, ease: 'power2.in' }, end - d);
}

// text line (no mask) for labels / slogan: Saira wide caps
export function label(ctx, { id, text, x = null, y, size = 40, wght = 800, wdth = 112, color = C.grey, align = 'left', tracking = 0.04, style = '' }) {
  const pos = align === 'center' ? 'left:0;right:0;text-align:center' : align === 'right' ? `right:${px(1080 - x)};text-align:right` : `left:${px(x)}`;
  return `<div class="ft-lb" id="${ctx.id(id)}" style="${pos};top:${px(y)};font-family:'${SAIRA}';font-weight:${wght};font-stretch:${wdth}%;font-size:${size}px;letter-spacing:${tracking}em;color:${color};${style}">${esc(nb(text))}</div>`;
}

export const CSS = (S) => `
${S} .ft-p{position:absolute}
${S} .ft-p img{position:absolute;inset:0;width:100%;height:100%;display:block}
${S} .ft-band{position:absolute;pointer-events:none}
${S} .ft-band-r{position:absolute;inset:0}
${S} .ft-band-r i{position:absolute;top:0;bottom:0;left:-10%;width:120%;display:block}
${S} .ft-sl-t{position:absolute;top:-200px;height:2320px;left:0}
${S} .ft-sl-s{position:absolute;top:0;bottom:0;display:block;transform:skewX(-22deg)}
${S} .ft-lb{position:absolute;white-space:nowrap;line-height:1;text-transform:uppercase}
${S} .ft-bl{position:absolute}
${S} .ft-bl img{display:block}
${S} .ft-bug{position:absolute}
${S} .ft-bug img{display:block}
`;
