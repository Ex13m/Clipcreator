// fx_venue.mjs — extra seek-safe helpers for the venue block (scripts/blocks/venue.mjs · Líheň Liběchov).
// Same conventions as fx.mjs: ctx first, local ids through ctx.id, animation pushed into ctx.tl, geometry in px on 1080×1920,
// no CSS transform on animated nodes (static rotations live on non-animated wrappers).
//
//   C, A                                                  brand colours (lihenlibechov.cz CSS) and asset paths
//   css(ctx)                                              scoped CSS (.vn-*)
//   caustics(ctx,{id,x,y,w,h,opacity,size,t0,t1,speed,mask})   two drifting layers of a tileable caustic web (water light)
//   island(ctx,{id,cx,cy,w,shadow})                       Malý Sporťáček as a floating 3D diorama: shadow + perspective tilt layer + caustics
//                                                         on the water only (alpha water mask) + light sweep → {html, sel, cam, tl, w, h}
//   pin(ctx,{id,color,ring})                              map pin (tip at the wrapper origin) + water ring → move the wrapper with track()
//   track(ctx,sel,keys[[t,x,y]])                          piecewise-linear x/y path (e.g. a pin glued to the pond in the drone shot)
//   etch(ctx,{id,x,y,h,color,opacity})                    the logo's etched trout as a tinted line drawing (CSS mask) with a wipe-reveal layer
//   reveal(ctx,id,t,{d,dir})                              wipe-reveal of an etch() (window slides open, content stays put)
//   karaoke(ctx,{id,text,…,t,times})                      fitted headline whose words light up as the VO speaks them
//   voTimes(ctx,tokens,from,fallback)                     VO start time per display token (diacritics-insensitive, sequential)
//   bubbles(ctx,{id,n,t0,t1,box,seed})                    rising bubbles (border rings, deterministic)
//   shafts(ctx,{id,n,t0,t1,opacity,seed})                 soft underwater light shafts (screen), slow sway
import { esc, nb, rnd } from './util.mjs';

const px = (n) => `${Math.round(n * 10) / 10}px`;

export const C = { TURQ: '#17a1c8', NAVY: '#1a212e', AQUA: '#9ae7e8', GOLD: '#d8af64', PAPER: '#f8f8f8', DEEP: '#0f6f8c', ABYSS: '#0e3a52' };
const AD = 'assets_prep/venue/ads/';
export const A = {
  island: AD + 'h1_pond_island_3d.png', islandShadow: AD + 'h1_pond_island_3d_shadow.png', islandWater: AD + 'fx_island_water_a.png',
  disc: AD + 'h1_arena_disc.png', trout: AD + 'h2_trout_potocak.png', trophy: AD + 'h3_mcr_trophy.png',
  etch: AD + 's2_etched_trout_ink.png', caustics: AD + 'fx_caustics.png',
};

export const css = (ctx) => `
${ctx.S} .vn-caus{position:absolute;overflow:hidden;pointer-events:none}
${ctx.S} .vn-caus i{position:absolute;inset:0;background-repeat:repeat}
${ctx.S} .vn-w{display:inline-block}
${ctx.S} .vn-bub{position:absolute;border-radius:50%;border:2px solid rgba(255,255,255,.55);box-shadow:inset -3px -4px 0 rgba(255,255,255,.18)}
${ctx.S} .vn-shafts{position:absolute;inset:0;mix-blend-mode:screen;pointer-events:none;-webkit-mask-image:linear-gradient(180deg,#000 0%,rgba(0,0,0,.55) 45%,transparent 85%);mask-image:linear-gradient(180deg,#000 0%,rgba(0,0,0,.55) 45%,transparent 85%)}
${ctx.S} .vn-shaft{position:absolute;top:-260px;height:2000px;transform-origin:50% 0}
${ctx.S} .vn-shaft i{position:absolute;inset:0;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,var(--a,.3)) 50%,rgba(255,255,255,0))}
${ctx.S} .vn-tint{position:absolute;inset:0;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center}
${ctx.S} .vn-pin svg{position:absolute;overflow:visible}
${ctx.S} .vn-ring{position:absolute;border-radius:50%;border:4px solid var(--rc,#9ae7e8)}
`;

// ---------------------------------------------------------------- water light
export function caustics(ctx, { id = 'cau', x = 0, y = 0, w = ctx.W, h = ctx.H, opacity = 0.2, size = 768, t0 = 0, t1 = ctx.dur, speed = 70, mask = '', blend = 'screen', style = '' } = {}) {
  const url = ctx.asset(A.caustics);
  const T = Math.max(0.1, t1 - t0), s2 = Math.round(size * 1.47);
  ctx.tl.fromTo(ctx.sel(`${id}-a`), { backgroundPosition: '0px 0px' }, { backgroundPosition: `${px(-speed * T)} ${px(speed * 0.45 * T)}`, duration: T, ease: 'none' }, t0);
  ctx.tl.fromTo(ctx.sel(`${id}-b`), { backgroundPosition: '0px 0px' }, { backgroundPosition: `${px(speed * 0.62 * T)} ${px(speed * 0.3 * T)}`, duration: T, ease: 'none' }, t0);
  const m = mask ? `-webkit-mask-image:${mask};mask-image:${mask};-webkit-mask-size:100% 100%;mask-size:100% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;` : '';
  return `<div class="vn-caus" id="${ctx.id(id)}" style="left:${px(x)};top:${px(y)};width:${px(w)};height:${px(h)};opacity:${opacity};mix-blend-mode:${blend};${m}${style}"><i id="${ctx.id(`${id}-a`)}" style="background-image:url(${url});background-size:${size}px ${size}px"></i><i id="${ctx.id(`${id}-b`)}" style="background-image:url(${url});background-size:${s2}px ${s2}px;opacity:.65"></i></div>`;
}

// ---------------------------------------------------------------- 3D island (H1b)
// layers: #id (entrance) > #id-cam (float / dive scale) > shadow + #id-p (perspective) > #id-tl (rotationX/Z) > img + water caustics + sweep
export function island(ctx, { id = 'isl', cx = ctx.W / 2, cy = 1080, w = 780, shadow = 0.75, caus = 0.32, t0 = 0, t1 = ctx.dur } = {}) {
  const [nw, nh] = ctx.dims(A.island); const h = (w * nh) / nw;
  const url = ctx.asset(A.island), wurl = ctx.asset(A.islandWater), surl = ctx.asset(A.islandShadow);
  const pw = (168 / 1863) * w, ph = (168 / 1870) * h;                    // shadow PNG = island canvas + 168 px pad (source px)
  const sh = `<img class="fx-abs" id="${ctx.id(`${id}-sh`)}" src="${surl}" alt="" style="left:${px(-pw + w * 0.01)};top:${px(-ph + h * 0.035)};width:${px(w + 2 * pw)};height:${px(h + 2 * ph)};opacity:${shadow}">`;
  const wm = `url(${wurl})`;
  const html = `<div class="fx-abs" id="${ctx.id(id)}" style="left:${px(cx - w / 2)};top:${px(cy - h / 2)};width:${px(w)};height:${px(h)}">
  <div class="fx-abs" id="${ctx.id(`${id}-cam`)}" style="inset:0">${sh}
    <div class="fx-abs" style="inset:0;perspective:1700px"><div class="fx-abs" id="${ctx.id(`${id}-tl`)}" style="inset:0;transform-style:preserve-3d">
      <img class="fx-prod-img" src="${url}" alt="">
      ${caustics(ctx, { id: `${id}-cw`, w, h, opacity: caus, size: Math.round(w * 0.42), t0, t1, speed: 26, mask: wm })}
      <i class="fx-prod-sweep" id="${ctx.id(`${id}-sw`)}" style="-webkit-mask-image:url(${url});mask-image:url(${url});--sa:112deg;--so:.55"></i>
    </div></div>
  </div></div>`;
  return { html, w, h, x: cx - w / 2, y: cy - h / 2, sel: ctx.sel(id), cam: ctx.sel(`${id}-cam`), tl: ctx.sel(`${id}-tl`) };
}

// ---------------------------------------------------------------- map pin
// wrapper origin = pin tip. Animate the wrapper with track(); drop the marker with ctx.tl on `${id}-m`, pulse the ring `${id}-r`.
export function pin(ctx, { id = 'pin', color = C.GOLD, dot = '#ffffff', ring = C.AQUA, size = 70 } = {}) {
  const w = size, h = size * 1.2;
  return `<div class="fx-abs vn-pin" id="${ctx.id(id)}" style="left:0;top:0;width:0;height:0">
    <div class="vn-ring" id="${ctx.id(`${id}-r`)}" style="left:-70px;top:-38px;width:140px;height:76px;--rc:${ring}"></div>
    <div class="fx-abs" id="${ctx.id(`${id}-m`)}" style="left:${px(-w / 2)};top:${px(-h)};width:${px(w)};height:${px(h)};transform-origin:50% 100%">
      <svg viewBox="0 0 100 120" width="${w}" height="${h}" style="left:0;top:0;filter:drop-shadow(0 8px 10px rgba(0,0,0,.35))"><path d="M50 2C23 2 2 23 2 50c0 33 48 68 48 68s48-35 48-68C98 23 77 2 50 2z" fill="${color}"/><circle cx="50" cy="48" r="17" fill="${dot}"/></svg>
    </div></div>`;
}
export function track(ctx, sel, keys, { ease = 'none' } = {}) {
  for (let i = 0; i + 1 < keys.length; i++) {
    const [ta, xa, ya] = keys[i], [tb, xb, yb] = keys[i + 1];
    const d = +(tb - ta).toFixed(3) - 0.001;
    if (d < 1e-3) continue;
    ctx.tl.fromTo(sel, { x: xa, y: ya }, { x: xb, y: yb, duration: d, ease }, ta);
  }
}

// ---------------------------------------------------------------- etched trout (logo device)
export function etch(ctx, { id = 'etch', x = 0, y = 0, h = 1000, color = '#ffffff', opacity = 0.2, style = '' } = {}) {
  const [nw, nh] = ctx.dims(A.etch); const w = (h * nw) / nh;
  const url = ctx.asset(A.etch, { maxSide: 2200 });
  return {
    w, h,
    html: `<div class="fx-abs" id="${ctx.id(id)}" style="left:${px(x)};top:${px(y)};width:${px(w)};height:${px(h)};opacity:${opacity};${style}"><div class="fx-abs" id="${ctx.id(`${id}-rv`)}" style="inset:0;overflow:hidden"><div class="fx-abs" id="${ctx.id(`${id}-in`)}" style="inset:0"><div class="vn-tint" style="background:${color};-webkit-mask-image:url(${url});mask-image:url(${url})"></div></div></div></div>`,
  };
}
export function reveal(ctx, id, t, { d = 0.9, dir = 'up', ease = 'power3.inOut' } = {}) {
  const ax = dir === 'up' || dir === 'down' ? 'yPercent' : 'xPercent', v = dir === 'up' || dir === 'left' ? 100 : -100;
  ctx.tl.fromTo(ctx.sel(`${id}-rv`), { [ax]: v }, { [ax]: 0, duration: d, ease }, t);
  ctx.tl.fromTo(ctx.sel(`${id}-in`), { [ax]: -v }, { [ax]: 0, duration: d, ease }, t);
}

// ---------------------------------------------------------------- VO-synced type
const norm = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '');
// first VO word time for every display token (token may hold several words joined by NBSP); search moves forward only
export function voTimes(ctx, tokens, { from = 0, fallback = [] } = {}) {
  const W = ctx.vo?.words || [];
  let j = W.findIndex((w) => w.t0 >= from - 1e-3); if (j < 0) j = W.length;
  return tokens.map((tok, k) => {
    const first = norm(String(tok).split(/[\s ]+/)[0]);
    for (let q = j; q < W.length; q++) if (norm(W[q].w) === first) { j = q + 1; return W[q].t0; }
    return fallback[k] ?? null;
  });
}
export function karaoke(ctx, o) {
  const { id = 'kar', x = ctx.safe.left, y = 500, w = ctx.W - ctx.safe.left - ctx.safe.right, maxLines = 3, sizes = [100, 92, 84, 76, 68], font = 'Bitter', wght = 800, italic = false,
    upper = false, tracking = 0, lh = 1.02, color = '#ffffff', dim = 0.34, t = 0, d = 0.6, times = [], style = '' } = o;
  const text = nb(o.text);
  const f = ctx.fit(text, { font, wght, italic, upper, tracking, maxW: w, maxLines, sizes });
  if (f.overflow) ctx.warn(`karaoke "${o.text}" overflows ${w}px × ${maxLines}`);
  let k = 0; const tokens = [];
  const lines = f.lines.map((ln, i) => `<span class="fx-ln" id="${ctx.id(`${id}-l${i}`)}"><span>${ln.split(' ').map((tok) => { tokens.push(tok); return `<span class="vn-w" id="${ctx.id(`${id}-w${k++}`)}">${esc(tok)}</span>`; }).join(' ')}</span></span>`).join('');
  const sel = ctx.sel(id);
  ctx.tl.fromTo(`${sel} .fx-ln > span`, { yPercent: 125, opacity: 0 }, { yPercent: 0, opacity: 1, duration: d, ease: 'expo.out', stagger: 0.08 }, t);
  const tt = typeof times === 'function' ? times(tokens) : times;
  tokens.forEach((_, i) => {
    const tw = tt[i] ?? (t + 0.3 + i * 0.45);
    ctx.tl.fromTo(ctx.sel(`${id}-w${i}`), { opacity: dim }, { opacity: 1, duration: 0.22, ease: 'power2.out' }, Math.max(t, tw - 0.04));
  });
  const html = `<div class="fx-t" id="${ctx.id(id)}" style="left:${px(x)};top:${px(y)};width:${px(w)};font-family:'${font}';font-weight:${wght};${italic ? 'font-style:italic;' : ''}font-size:${f.size}px;line-height:${lh};letter-spacing:${tracking}em;color:${color};${upper ? 'text-transform:uppercase;' : ''}${style}">${lines}</div>`;
  return { html, sel, size: f.size, lines: f.lines, h: f.lines.length * f.size * lh, tokens };
}

// ---------------------------------------------------------------- underwater dressing
export function bubbles(ctx, { id = 'bub', n = 10, t0 = 0, t1 = ctx.dur, box = [0, 700, ctx.W, 900], size = [8, 26], rise = [380, 820], seed = 4, op = 0.75 } = {}) {
  let html = '';
  const span = Math.max(0.5, t1 - t0);
  for (let i = 0; i < n; i++) {
    const r = (k) => rnd(seed * 31 + i * 17 + k * 5);
    const s = size[0] + r(1) * (size[1] - size[0]);
    const x = box[0] + r(2) * box[2], yy = box[1] + r(3) * box[3];
    const d = Math.min(span, 1.3 + r(4) * 1.4), st = t0 + r(5) * Math.max(0, span - d);
    const dy = -(rise[0] + r(6) * (rise[1] - rise[0])) * (0.6 + 0.4 * (s / size[1])), dx = (r(7) - 0.5) * 60;
    const sel = ctx.sel(`${id}${i}`);
    ctx.tl.fromTo(sel, { x: 0, y: 0 }, { x: dx, y: dy, duration: d, ease: 'power1.in' }, st);
    ctx.tl.fromTo(sel, { opacity: 0 }, { opacity: op * (0.55 + 0.45 * r(8)), duration: 0.25, ease: 'none' }, st);
    ctx.tl.fromTo(sel, { opacity: op * (0.55 + 0.45 * r(8)) }, { opacity: 0, duration: 0.3, ease: 'none' }, st + d - 0.3);
    html += `<i class="vn-bub" id="${ctx.id(`${id}${i}`)}" style="left:${px(x)};top:${px(yy)};width:${px(s)};height:${px(s)}"></i>`;
  }
  return `<div class="fx-full" id="${ctx.id(id)}" style="pointer-events:none">${html}</div>`;
}
export function shafts(ctx, { id = 'sha', n = 3, t0 = 0, t1 = ctx.dur, opacity = 0.9, seed = 2, alpha = 0.26 } = {}) {
  let html = '';
  for (let i = 0; i < n; i++) {
    const r = (k) => rnd(seed * 19 + i * 11 + k * 3);
    const w = 150 + r(1) * 200, x = 80 + (i / Math.max(1, n - 1)) * 760 + (r(2) - 0.5) * 120, rot = -18 + r(3) * 30;
    ctx.tl.fromTo(ctx.sel(`${id}${i}`), { x: 0, opacity: 0.55 }, { x: (r(4) - 0.5) * 120, opacity: 1, duration: Math.max(0.1, t1 - t0), ease: 'sine.inOut' }, t0);
    html += `<div class="vn-shaft" style="left:${px(x)};width:${px(w)};transform:rotate(${rot.toFixed(1)}deg)"><i id="${ctx.id(`${id}${i}`)}" style="--a:${(alpha * (0.6 + 0.6 * r(5))).toFixed(2)}"></i></div>`;
  }
  return `<div class="vn-shafts" id="${ctx.id(id)}" style="opacity:${opacity}">${html}</div>`;
}
