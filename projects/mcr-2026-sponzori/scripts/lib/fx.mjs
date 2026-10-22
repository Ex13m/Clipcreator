// fx.mjs — 2025/26 advertising techniques as seek-safe HTML/CSS/GSAP helpers for block modules.
//
// Conventions
//   • every helper takes the block ctx first; `id` is LOCAL (prefixed with ctx.id → unique in the assembled page);
//   • helpers that create DOM return an HTML string — put it into your block html (order = paint order);
//   • helpers that animate push into ctx.tl (block-local seconds); times are numbers (use ctx.bar()/ctx.beat()/ctx.vo.at());
//   • geometry is px on the 1080×1920 canvas; never CSS-transform an element you also animate (lint gsap_css_transform_conflict) —
//     helpers position with left/top and animate x/y/scale/rotation;
//   • fx.CSS (generic .fx-* classes) is injected once into the root page; per-instance values go through CSS custom props.
//
// Index (one-line usage — see BLOCK_API.md for a cookbook)
//   scene(ctx,id,t0,t1,html,{inD,outD})                     full-frame group shown t0→t1 (fade in/out)
//   field(ctx,{id,bg,c1,c2,kind,at})                         colour field (solid / radial / linear / conic gradient)
//   mesh(ctx,{id,colors,blur,t0,t1})                         drifting blurred gradient mesh (aurora) behind products
//   rays(ctx,{id,x,y,size,color,n,spin,opacity})             conic sunburst, slow spin
//   glow(ctx,{id,x,y,size,color,opacity})                    soft light blob (for halos behind products)
//   photo(ctx,{id,src,treat:'none'|'duo'|'mono'|'halftone',d1,d2,kb:{from,to},box})   full-bleed / boxed photo + treatment + Ken Burns
//   headline(ctx,{id,text,x,y,w,maxLines,sizes,font,wght,…,t,reveal,out})   fitted multi-line type with mask/char/word reveal
//   split(text,mode)                                         build-time split into .fx-c spans (chars|words)
//   typeIn(ctx,sel,t,{mode,from,stagger,d,ease})             animate split pieces in   ·  typeOut(ctx,sel,t,{…})
//   varType(ctx,sel,t,{from:{wght,wdth,trk},to,d,ease})      variable weight / width / tracking tween (.fx-var element)
//   outlineFill(ctx,sel,t,{d,ease})                          outline → solid fill sweep (.fx-of element)
//   bigType(ctx,{id,text,font,size,y,x,color,outline,opacity,drift})   oversized cropped type behind the product
//   marquee(ctx,{id,text,y,size,font,color,bg,rot,speed,dir,outline})  endless typography band (seamless, linear)
//   product(ctx,{id,src,w|h,cx,cy|floor,ground:'floor'|'float'|'none',reflect,sweep,rot,pad}) → {html,sel,cam,…}  product hero cut-out
//        layers: sel = entrance/exit · cam = float/parallax/pushIn/ramp · '#…-tl' = tilt/flip (helpers know which to use)
//   productIn(ctx,id,t,{from:'rise'|'drop'|'scale'|'left'|'right'|'spin',d})   product entrance
//   sweep(ctx,id,t,{d,angle})                                specular light sweep over the product (masked by its alpha)
//   tilt(ctx,id,t0,t1,{ry,rx})                               slow 3D tilt (CSS perspective)
//   float(ctx,sel,t0,t1,{y,rot,period})                      idle bob (finite yoyo, seek-safe)
//   pushIn(ctx,sel,t0,t1,{from,to,origin,ease})              macro push-in / slow zoom
//   flip(ctx,frontId,backId,t,{d})                           two-sided product flip (front → back)
//   parallax(ctx,layers[{sel,depth}],t0,t1,{x,y})            depth stack: bg / product / fg move at different speeds
//   ramp(ctx,sel,t0,t1,{from,to,ease})                       speed-ramp (slow → fast into the hit, CustomEase fxRampIn)
//   punch(ctx,sel,t,{scale,d})  ·  pulse(ctx,sel,{t0,t1,every,scale})   beat accents (tl.hit → no initial state)
//   odometer(ctx,{id,value,suffix,prefix,x,y,size,font,wght,color,t,d,spins})   rolling digit counter ("1 300+")
//   sticker(ctx,{id,text,sub,x,y,size,color,fg,shape,rot,t,font})      badge / sticker burst
//   chip(ctx,{id,label,value,x,y,w,tone,accent,t,from,font})            glass UI chip (price tag / spec)
//   chroma(ctx,sel,t,{amt,d,kind})                           subtle chromatic-aberration hit (text or image)
//   grid(ctx,{id,src|cells[{src,pos,fit,bg,pad}],cols,rows,x,y,w,h,gap,t,mode,stagger,radius})   split-screen grid assemble
//   flash(ctx,t,{color,peak,d,blend})                        colour flash on a downbeat
//   tIn(ctx,type,{color,d,dir}) / tOut(ctx,type,{color,d,dir})   block transitions: cut|wipe|iris|slice|whip|zoom|blob|grid|flash|fader
//        'fader' = TA signature (v3): mixer-fader columns ride up with a TA-red cap line (cover = `color`, caps = TA red)
//   endCard(ctx,{t,logo,url,line,tone,scale,cy,ta})          end-card lockup: TA logo hero + sponsor logo + URL + line
//                                                            (ta:true default → line in Montserrat + TA-red hairline, the TA signature)
//   taChip(ctx,{id,text,sub,cx|x,y,size,tone,t})             TA-style chip (Montserrat 800 caps + TA-red hairline) — e.g. „Věnuje ceny · MČR 2026“
//   TA                                                       TA CZ palette + font (red #e31e24, navy #304285, deep #0b1e42, Montserrat)
import { esc, nb, rnd, J, r3 } from './util.mjs';

const px = (n) => `${Math.round(n * 10) / 10}px`;

// TA CZ house accents (v3 „a little of our style“): use them ONLY as details (hairline, chip, end-card line, fader transition) —
// never repaint a sponsor world with them
export const TA = { red: '#e31e24', navy: '#304285', deep: '#0b1e42', light: '#eef2f9', blue: '#8ea2d8', font: 'Montserrat' };

// ======================================================================================
// CSS (root, once)
// ======================================================================================
export const CSS = `
.fx-img{position:absolute;inset:0;width:100%;height:100%;display:block}
.fx-abs{position:absolute}
.fx-full,.fx-field{position:absolute;inset:0}
.fx-mesh{position:absolute;inset:-14%;overflow:hidden}
.fx-mesh i{position:absolute;border-radius:50%;filter:blur(var(--b,120px))}
.fx-rays{position:absolute;border-radius:50%;pointer-events:none}
.fx-glow{position:absolute;border-radius:50%;pointer-events:none}
.fx-photo{position:absolute;overflow:hidden}
.fx-photo-in{position:absolute;inset:0}
.fx-duo .fx-photo-in img{filter:grayscale(1) contrast(1.12) brightness(1.04)}
.fx-duo::before{content:'';position:absolute;inset:0;background:var(--d2);mix-blend-mode:multiply;z-index:1;pointer-events:none}
.fx-duo::after{content:'';position:absolute;inset:0;background:var(--d1);mix-blend-mode:lighten;z-index:1;pointer-events:none}
.fx-mono .fx-photo-in img{filter:grayscale(1) contrast(1.15)}
.fx-half{background:#fff}
.fx-half .fx-photo-in{filter:contrast(18) grayscale(1)}
.fx-half .fx-photo-in img{filter:grayscale(1) blur(1.6px) brightness(1.05)}
.fx-half .fx-photo-in::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,#000 0,#fff 72%) 0 0/var(--hs,12px) var(--hs,12px);mix-blend-mode:screen}
.fx-half::before{content:'';position:absolute;inset:0;background:var(--d2,#fff);mix-blend-mode:multiply;z-index:1;pointer-events:none}
.fx-half::after{content:'';position:absolute;inset:0;background:var(--d1,#000);mix-blend-mode:lighten;z-index:1;pointer-events:none}
.fx-t{position:absolute;margin:0}
.fx-ln{display:block;overflow:hidden;padding:.14em 0 .06em;margin:-.14em 0 -.06em;white-space:nowrap}
.fx-ln>span{display:inline-block;white-space:nowrap}
.fx-c{display:inline-block;white-space:pre}
.fx-var{font-variation-settings:'wght' var(--wght,700),'wdth' var(--wdth,100);letter-spacing:calc(var(--trk,0) * 1em)}
.fx-of{color:transparent;-webkit-text-stroke:var(--ofw,2px) var(--ofc,#fff);background-image:linear-gradient(90deg,var(--ofc,#fff) 0 50%,transparent 50% 100%);background-size:200% 100%;background-position:100% 0;-webkit-background-clip:text;background-clip:text}
.fx-big{position:absolute;white-space:nowrap;line-height:.86;pointer-events:none}
.fx-big.ol{color:transparent;-webkit-text-stroke:var(--ow,3px) var(--oc,#fff)}
.fx-mq{position:absolute;left:-12%;width:124%;overflow:hidden;display:flex;align-items:center}
.fx-mq-in{display:flex;white-space:nowrap;will-change:transform}
.fx-mq-in span{flex-shrink:0;padding-right:.5em}
.fx-mq.ol .fx-mq-in span{color:transparent;-webkit-text-stroke:var(--ow,2px) var(--oc,#fff)}
.fx-prod{position:absolute;perspective:1400px}
.fx-prod-tilt{position:absolute;inset:0;transform-style:preserve-3d}
.fx-prod-img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block}
.fx-prod-sweep{position:absolute;inset:0;-webkit-mask-size:100% 100%;mask-size:100% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;background-image:linear-gradient(var(--sa,105deg),transparent 38%,rgba(255,255,255,.95) 50%,transparent 62%);background-size:300% 100%;background-position:110% 0;mix-blend-mode:screen;opacity:var(--so,.75);pointer-events:none}
.fx-prod-shadow{position:absolute;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,var(--sho,.55)),rgba(0,0,0,0));pointer-events:none}
.fx-prod-refl{position:absolute;left:0;right:0;overflow:hidden;-webkit-mask-image:linear-gradient(180deg,rgba(0,0,0,var(--rfo,.32)) 0%,transparent 55%);mask-image:linear-gradient(180deg,rgba(0,0,0,var(--rfo,.32)) 0%,transparent 55%);pointer-events:none}
.fx-prod-refl i{position:absolute;inset:0;background:center/contain no-repeat;transform:scaleY(-1)}
.fx-odo{position:absolute;display:flex;align-items:flex-start;white-space:nowrap;font-variant-numeric:tabular-nums;line-height:1}
.fx-odo-d{display:inline-block;height:1em;overflow:hidden;padding:0 .01em}
.fx-odo-s{display:block}
.fx-odo-s i{display:block;height:1em;line-height:1em;font-style:normal;text-align:center}
.fx-odo-x{display:inline-block;height:1em;line-height:1em}
.fx-stk{position:absolute}
.fx-stk svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.fx-stk-t{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;line-height:.95}
.fx-stk-r{position:absolute;left:50%;top:50%;width:0;height:0}
.fx-stk-r i{position:absolute;left:-3px;top:0;width:6px;border-radius:3px}
.fx-chip{position:absolute;display:flex;flex-direction:column;justify-content:center;gap:6px;padding:20px 28px;border-radius:26px;box-sizing:border-box}
.fx-chip.dark{background:rgba(255,255,255,.13);-webkit-backdrop-filter:blur(22px) saturate(1.5);backdrop-filter:blur(22px) saturate(1.5);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.32),0 24px 50px rgba(0,0,0,.28);color:#fff}
.fx-chip.light{background:rgba(255,255,255,.62);-webkit-backdrop-filter:blur(22px) saturate(1.4);backdrop-filter:blur(22px) saturate(1.4);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.9),0 24px 50px rgba(0,0,0,.14);color:#111}
.fx-chip span{font-size:var(--ls,22px);letter-spacing:.14em;text-transform:uppercase;opacity:.78;font-weight:700}
.fx-chip b{font-size:var(--vs,46px);line-height:1.02;font-weight:800}
.fx-chip i{position:absolute;left:0;top:22%;bottom:22%;width:6px;border-radius:0 6px 6px 0;background:var(--acc,#fff)}
.fx-grid{position:absolute}
.fx-grid>div{position:absolute;overflow:hidden;background-repeat:no-repeat}
.fx-ov{position:absolute;inset:0;pointer-events:none}
.fx-ov-sl{position:absolute;left:-40%;top:-40%;width:180%;height:180%;transform:rotate(-24deg);display:flex;flex-direction:column}
.fx-ov-sl i{flex:1;margin:-1px 0}
.fx-ov-gr{display:grid}
.fx-ov-bl{inset:-90px}
.fx-ov-wp{position:absolute;inset:0;display:block}
.fx-ov-bl i{position:absolute;inset:0}
.fx-ec{position:absolute;left:0;right:0;display:flex;flex-direction:column;align-items:center;text-align:center}
.fx-ov-fd{display:flex}
.fx-ov-fd i{position:relative;flex:1;margin:0 -1px;display:block}
.fx-ov-fd i::before,.fx-ov-fd i::after{content:'';position:absolute;left:0;right:0;height:var(--cap,7px);background:var(--capc,#e31e24)}
.fx-ov-fd i::before{top:calc(-1 * var(--cap,7px))}
.fx-ov-fd i::after{bottom:calc(-1 * var(--cap,7px))}
.fx-tach{position:absolute;display:flex;align-items:center;gap:14px;white-space:nowrap;font-family:'Montserrat';font-weight:800;text-transform:uppercase;line-height:1;border-radius:999px;box-sizing:border-box}
.fx-tach.dark{background:rgba(8,14,28,.42);-webkit-backdrop-filter:blur(16px) saturate(1.3);backdrop-filter:blur(16px) saturate(1.3);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.28);color:#fff}
.fx-tach.light{background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(16px) saturate(1.3);backdrop-filter:blur(16px) saturate(1.3);box-shadow:inset 0 0 0 1.5px rgba(48,66,133,.22);color:#0b1e42}
.fx-tach b{display:block;width:var(--hl,34px);height:3px;border-radius:2px;background:#e31e24;flex-shrink:0}
.fx-tach em{font-style:normal;font-weight:600;opacity:.72}
.fx-defs{position:absolute;width:0;height:0;overflow:hidden}
`;

// CustomEase curves used by ramp() (registered in the root page before any block script runs)
export const EASES = {
  fxRampIn: 'M0,0 C0.42,0 0.62,0.06 0.76,0.2 0.88,0.34 0.95,0.62 1,1',   // slow drift → fast into the hit
  fxRampOut: 'M0,0 C0.05,0.38 0.12,0.66 0.24,0.8 0.38,0.94 0.58,1 1,1',  // hit → long settle
  fxWhip: 'M0,0 C0.5,0 0.55,0.05 0.7,0.3 0.82,0.52 0.86,1 1,1',
};

// ======================================================================================
// SCENES — a full-frame group visible from t0 to t1 (fade in/out). Put any html inside.
//   html += fx.scene(ctx, 'sc2', ctx.bar(2), ctx.bar(4), inner, { inD: 0, outD: 0.25 })
// ======================================================================================
export function scene(ctx, id, t0, t1, html = '', { inD = 0.001, outD = 0.25, style = '' } = {}) {
  const s = ctx.sel(id);
  if (t0 > 1e-3) ctx.tl.fromTo(s, { opacity: 0 }, { opacity: 1, duration: Math.max(0.001, inD), ease: 'none' }, t0);
  if (t1 < ctx.dur - 1e-3) ctx.tl.fromTo(s, { opacity: 1 }, { opacity: 0, duration: Math.max(0.001, outD), ease: 'power1.in' }, Math.max(t0, t1 - outD));
  return `<div class="fx-full" id="${ctx.id(id)}" style="${style}">${html}</div>`;
}

// ======================================================================================
// BACKGROUNDS
// ======================================================================================
export function field(ctx, { id = 'field', bg = ctx.theme.bg || '#000', c1, c2, kind = 'solid', at = '50% 40%', angle = 180, style = '' } = {}) {
  const g = kind === 'radial' ? `radial-gradient(120% 80% at ${at}, ${c1 || bg} 0%, ${c2 || bg} 100%)`
    : kind === 'linear' ? `linear-gradient(${angle}deg, ${c1 || bg}, ${c2 || bg})`
    : kind === 'conic' ? `conic-gradient(from 200deg at ${at}, ${c1 || bg}, ${c2 || bg}, ${c1 || bg})` : bg;
  return `<div class="fx-field" id="${ctx.id(id)}" style="background:${g};${style}"></div>`;
}
// colors: 3–5 hex; blobs drift with sine over [t0,t1] (deterministic positions from rnd)
export function mesh(ctx, { id = 'mesh', colors = ['#ff3d7f', '#3d7fff', '#ffd43d'], blur = 130, size = 900, opacity = 0.9, t0 = 0, t1 = ctx.dur, drift = 160, seed = 1, style = '' } = {}) {
  const W = ctx.W * 1.28, H = ctx.H * 1.28;
  const blobs = colors.map((c, i) => {
    const x = (0.1 + 0.8 * rnd(seed * 7 + i * 3)) * W - size / 2, y = (0.08 + 0.84 * rnd(seed * 11 + i * 5)) * H - size / 2;
    return `<i id="${ctx.id(`${id}${i}`)}" style="left:${px(x)};top:${px(y)};width:${px(size)};height:${px(size)};background:${c};opacity:${opacity}"></i>`;
  }).join('');
  colors.forEach((_, i) => {
    const a = rnd(seed * 13 + i) * Math.PI * 2;
    ctx.tl.fromTo(ctx.sel(`${id}${i}`), { x: 0, y: 0, scale: 1 }, { x: Math.cos(a) * drift, y: Math.sin(a) * drift, scale: 1 + 0.25 * rnd(i + seed), duration: Math.max(0.1, t1 - t0), ease: 'sine.inOut' }, t0);
  });
  return `<div class="fx-mesh" id="${ctx.id(id)}" style="--b:${blur}px;${style}">${blobs}</div>`;
}
export function rays(ctx, { id = 'rays', x = ctx.W / 2, y = 800, size = 1600, color = '#fff', n = 16, duty = 0.38, opacity = 0.5, spin = 30, t0 = 0, t1 = ctx.dur, hole = 0.12, style = '' } = {}) {
  const step = 360 / n, on = step * duty;
  ctx.tl.fromTo(ctx.sel(id), { rotation: 0 }, { rotation: spin, duration: Math.max(0.1, t1 - t0), ease: 'none' }, t0);
  return `<div class="fx-rays" id="${ctx.id(id)}" style="left:${px(x - size / 2)};top:${px(y - size / 2)};width:${px(size)};height:${px(size)};opacity:${opacity};background:repeating-conic-gradient(from 0deg, ${color} 0deg ${on}deg, transparent ${on}deg ${step}deg);-webkit-mask-image:radial-gradient(circle, transparent ${hole * 100}%, #000 ${hole * 100 + 2}%, transparent 70%);mask-image:radial-gradient(circle, transparent ${hole * 100}%, #000 ${hole * 100 + 2}%, transparent 70%);${style}"></div>`;
}
export function glow(ctx, { id = 'glow', x = ctx.W / 2, y = 900, size = 900, color = '#fff', opacity = 0.5, style = '' } = {}) {
  return `<div class="fx-glow" id="${ctx.id(id)}" style="left:${px(x - size / 2)};top:${px(y - size / 2)};width:${px(size)};height:${px(size)};background:radial-gradient(closest-side, ${color}, transparent);opacity:${opacity};${style}"></div>`;
}
// photo with treatment. box default = full frame. kb = Ken Burns {from:{scale,x,y}, to:{…}, t0, t1}
export function photo(ctx, { id = 'ph', src, pos = '50% 50%', treat = 'none', d1 = '#000', d2 = '#fff', halftone = 12, box = null, kb = null, style = '', radius = 0 } = {}) {
  const b = box || { x: 0, y: 0, w: ctx.W, h: ctx.H };
  const cls = treat === 'duo' ? ' fx-duo' : treat === 'mono' ? ' fx-mono' : treat === 'halftone' ? ' fx-half' : '';
  if (kb) ctx.tl.fromTo(ctx.sel(`${id}-in`), { scale: 1, x: 0, y: 0, ...kb.from }, { scale: 1.12, x: 0, y: 0, ...kb.to, duration: Math.max(0.1, (kb.t1 ?? ctx.dur) - (kb.t0 ?? 0)), ease: kb.ease || 'none' }, kb.t0 ?? 0);
  return `<div class="fx-photo${cls}" id="${ctx.id(id)}" style="left:${px(b.x)};top:${px(b.y)};width:${px(b.w)};height:${px(b.h)};--d1:${d1};--d2:${d2};--hs:${halftone}px;border-radius:${radius}px;${style}"><div class="fx-photo-in" id="${ctx.id(`${id}-in`)}">${ctx.img(src, { pos })}</div></div>`;
}

// ======================================================================================
// KINETIC TYPE
// ======================================================================================
// build-time split; keeps NBSP/spaces as their own pieces so wrapping stays identical
export function split(text, mode = 'chars') {
  const s = String(text);
  if (mode === 'words') return s.split(/( +)/).map((w) => (/^ +$/.test(w) ? w : `<span class="fx-c">${esc(w)}</span>`)).join('');
  return [...s].map((c) => (c === ' ' ? ' ' : `<span class="fx-c">${esc(c)}</span>`)).join('');
}
export function typeIn(ctx, sel, t, { from = { yPercent: 110, opacity: 0 }, to = {}, stagger = 0.022, d = 0.55, ease = 'expo.out' } = {}) {
  const keys = Object.keys(from); const end = Object.fromEntries(keys.map((k) => [k, k === 'opacity' || k === 'scale' || k === 'scaleX' || k === 'scaleY' ? 1 : 0]));
  ctx.tl.fromTo(`${sel} .fx-c`, from, { ...end, ...to, duration: d, ease, stagger }, t);
}
export function typeOut(ctx, sel, t, { to = { yPercent: -110, opacity: 0 }, stagger = 0.012, d = 0.3, ease = 'power3.in' } = {}) {
  const keys = Object.keys(to); const st = Object.fromEntries(keys.map((k) => [k, k === 'opacity' || k === 'scale' ? 1 : 0]));
  ctx.tl.fromTo(`${sel} .fx-c`, st, { ...to, duration: d, ease, stagger }, t);
}
// Fitted headline. text → lines (fontkit-measured), each line masked. reveal: 'lines' (mask slide), 'chars', 'words', 'fade', 'scale', 'none'
// returns { html, size, lines, h, sel }. align: 'left'|'center'|'right'. out: time to leave (optional).
export function headline(ctx, o) {
  const { id = 'hl', x = ctx.safe.left, y = 700, w = ctx.W - ctx.safe.left - ctx.safe.right, maxLines = 2, sizes, font = ctx.theme.font?.display || 'Inter', wght = 800, wdth = 100,
    italic = false, color = ctx.theme.fg || '#fff', upper = false, tracking = 0, lh = 0.98, align = 'left', t = null, reveal = 'lines', stagger, d = 0.62, ease = 'expo.out',
    out = null, outD = 0.32, cls = '', style = '', lineStyle = '', variable = false } = o;
  const text = nb(o.text);
  const f = ctx.fit(text, { font, wght, wdth, italic, upper, tracking, maxW: w, maxLines, sizes: sizes || [168, 150, 136, 124, 112, 100, 92, 84, 76, 68, 60, 54, 48, 42, 36] });
  if (f.overflow) ctx.warn(`headline "${o.text}" overflows ${w}px × ${maxLines} lines (font ${font})`);
  const size = o.size || f.size, lines = o.size ? ctx.wrap(text, { font, wght, wdth, italic, upper, tracking, size, maxW: w }) : f.lines;
  const inner = (s) => (reveal === 'chars' ? split(s, 'chars') : reveal === 'words' ? split(s, 'words') : esc(s));
  const html = `<div class="fx-t${variable ? ' fx-var' : ''} ${cls}" id="${ctx.id(id)}" style="left:${px(x)};top:${px(y)};width:${px(w)};font-family:'${font}';font-weight:${wght};${wdth !== 100 ? `font-stretch:${wdth}%;` : ''}${italic ? 'font-style:italic;' : ''}font-size:${size}px;line-height:${lh};letter-spacing:${tracking}em;color:${color};text-align:${align};${upper ? 'text-transform:uppercase;' : ''}${variable ? `--wght:${wght};--wdth:${wdth};--trk:${tracking};` : ''}${style}">${lines.map((l, i) => `<span class="fx-ln" id="${ctx.id(`${id}-l${i}`)}" style="${lineStyle}"><span>${inner(l)}</span></span>`).join('')}</div>`;
  const sel = ctx.sel(id);
  if (t != null) {
    // opacity too: accents (Č, Ě, Í) stick out above the line box and would peek through the mask while the line waits below
    if (reveal === 'lines') ctx.tl.fromTo(`${sel} .fx-ln > span`, { yPercent: 125, opacity: 0 }, { yPercent: 0, opacity: 1, duration: d, ease, stagger: stagger ?? 0.09 }, t);
    else if (reveal === 'chars' || reveal === 'words') typeIn(ctx, sel, t, { d, ease, stagger: stagger ?? (reveal === 'chars' ? 0.022 : 0.06) });
    else if (reveal === 'fade') ctx.tl.fromTo(sel, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: d, ease }, t);
    else if (reveal === 'scale') ctx.tl.fromTo(sel, { opacity: 0, scale: 1.25 }, { opacity: 1, scale: 1, duration: d, ease }, t);
  }
  if (out != null) ctx.tl.fromTo(`${sel} .fx-ln > span`, { yPercent: 0, opacity: 1 }, { yPercent: -125, opacity: 0, duration: outD, ease: 'power3.in', stagger: 0.04 }, out);
  return { html, size, lines, h: lines.length * size * lh, sel };
}
// variable font tween on an element that has class fx-var (headline({variable:true}) or bigType({variable:true}))
export function varType(ctx, sel, t, { from = { wght: 200, wdth: 62, trk: 0.1 }, to = { wght: 900, wdth: 125, trk: -0.02 }, d = 1.2, ease = 'expo.inOut' } = {}) {
  const m = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [`--${k}`, v]));
  ctx.tl.fromTo(sel, m(from), { ...m(to), duration: d, ease }, t);
}
// element must have class fx-of and CSS vars --ofc (fill colour) / --ofw (stroke width)
export function outlineFill(ctx, sel, t, { d = 0.8, ease = 'power2.inOut', reverse = false } = {}) {
  ctx.tl.fromTo(sel, { backgroundPosition: reverse ? '0% 0%' : '100% 0%' }, { backgroundPosition: reverse ? '100% 0%' : '0% 0%', duration: d, ease }, t);
}
export function bigType(ctx, { id = 'big', text, font = ctx.theme.font?.display || 'Inter', wght = 900, wdth = 100, size = 520, x = -60, y = 600, color = 'rgba(255,255,255,.08)', outline = false, ow = 3, upper = true, tracking = -0.03, drift = -220, t0 = 0, t1 = ctx.dur, opacity = 1, variable = false, style = '' } = {}) {
  if (drift) ctx.tl.fromTo(ctx.sel(id), { x: 0 }, { x: drift, duration: Math.max(0.1, t1 - t0), ease: 'none' }, t0);
  return `<div class="fx-big${outline ? ' ol' : ''}${variable ? ' fx-var' : ''}" id="${ctx.id(id)}" style="left:${px(x)};top:${px(y)};font-family:'${font}';font-weight:${wght};${wdth !== 100 ? `font-stretch:${wdth}%;` : ''}font-size:${size}px;letter-spacing:${tracking}em;${upper ? 'text-transform:uppercase;' : ''}color:${outline ? 'transparent' : color};--oc:${color};--ow:${ow}px;opacity:${opacity};${variable ? `--wght:${wght};--wdth:${wdth};--trk:${tracking};` : ''}${style}">${esc(nb(text))}</div>`;
}
// endless band; speed px/s; dir -1 = right→left. rot in deg (static CSS on the band, the inner track animates)
export function marquee(ctx, { id = 'mq', text, y = 1300, h = null, size = 120, font = ctx.theme.font?.display || 'Inter', wght = 900, wdth = 100, color = '#fff', bg = 'transparent', rot = 0, speed = 120, dir = -1, outline = false, ow = 2, upper = true, sep = ' · ', t0 = 0, t1 = ctx.dur, tracking = -0.01, italic = false, style = '' } = {}) {
  const seg = nb(text) + sep;
  const segW = ctx.measure(seg, { font, size, wght, wdth, upper, tracking, italic }) + 0.5 * size;   // + padding-right .5em
  const travel = Math.max(1, speed * (t1 - t0));
  const reps = Math.ceil((ctx.W * 1.5 + travel) / segW) + 1;
  const hh = h || Math.round(size * 1.35);
  ctx.tl.fromTo(ctx.sel(`${id}-in`), { x: dir < 0 ? 0 : -travel }, { x: dir < 0 ? -travel : 0, duration: Math.max(0.1, t1 - t0), ease: 'none' }, t0);
  return `<div class="fx-mq${outline ? ' ol' : ''}" id="${ctx.id(id)}" style="top:${px(y - hh / 2)};height:${hh}px;background:${bg};transform:rotate(${rot}deg);--oc:${color};--ow:${ow}px;${style}"><div class="fx-mq-in" id="${ctx.id(`${id}-in`)}" style="font-family:'${font}';font-weight:${wght};${wdth !== 100 ? `font-stretch:${wdth}%;` : ''}${italic ? 'font-style:italic;' : ''}font-size:${size}px;letter-spacing:${tracking}em;${upper ? 'text-transform:uppercase;' : ''}color:${outline ? 'transparent' : color};line-height:1">${Array.from({ length: reps }, () => `<span>${esc(seg)}</span>`).join('')}</div></div>`;
}

// ======================================================================================
// PRODUCT HERO
// ======================================================================================
// src: transparent cut-out. w: display width (height from aspect). Position: cx + (cy | floor = y of the visual bottom).
// ground: 'floor' (contact shadow + reflection), 'float' (soft drop shadow below), 'none'. pad: [l,t,r,b] transparent margin fractions
// of the PNG (data products carry it) so shadows sit under the visible object. Never upscales beyond maxUp × natural width.
export function product(ctx, o) {
  const { id = 'prod', src, cx = ctx.W / 2, ground = 'float', reflect = 0.3, shadow = 0.5, sweep = true, sweepAngle = 105, sweepOpacity = 0.7, rot = 0, pad = [0.03, 0.03, 0.03, 0.03], maxUp = 1.3, style = '' } = o;
  const [nw, nh] = ctx.dims(src); const ar = nw / nh;
  let w = o.w || (o.h ? o.h * ar : 600);
  if (w > nw * maxUp) { ctx.warn(`product ${src.split('/').pop()} shown at ${Math.round(w)}px > ${maxUp}× natural ${nw}px — capped`); w = nw * maxUp; }
  const h = w / ar;
  const visB = h * (1 - pad[3]);                      // y of the visible bottom inside the box
  const top = o.floor != null ? o.floor - visB : (o.cy ?? 900) - h / 2;
  const left = cx - w / 2;
  const url = ctx.asset(src);
  const vw = w * (1 - pad[0] - pad[2]);
  const sh = ground === 'floor'
    ? `<i class="fx-prod-shadow" id="${ctx.id(`${id}-sh`)}" style="left:${px(w * pad[0] + vw * 0.08)};width:${px(vw * 0.84)};top:${px(visB - Math.max(10, vw * 0.05))};height:${px(Math.max(20, vw * 0.1))};--sho:${shadow}"></i>`
    : ground === 'float' ? `<i class="fx-prod-shadow" id="${ctx.id(`${id}-sh`)}" style="left:${px(w * pad[0] + vw * 0.12)};width:${px(vw * 0.76)};top:${px(visB + h * 0.06)};height:${px(Math.max(24, h * 0.1))};--sho:${shadow * 0.8};filter:blur(10px)"></i>` : '';
  const rf = ground === 'floor' && reflect > 0 ? `<div class="fx-prod-refl" id="${ctx.id(`${id}-rf`)}" style="top:${px(visB * 2 - h)};height:${px(h)};--rfo:${reflect}"><i style="background-image:url(${url})"></i></div>` : '';
  const sw = sweep ? `<i class="fx-prod-sweep" id="${ctx.id(`${id}-sw`)}" style="-webkit-mask-image:url(${url});mask-image:url(${url});--sa:${sweepAngle}deg;--so:${sweepOpacity}"></i>` : '';
  // layers: #id (entrance/exit: productIn/Out) > #id-cam (float / parallax / pushIn / ramp) > shadow+reflection + #id-tl (tilt/flip) > #id-rot (static rotation) > img + sweep
  const html = `<div class="fx-prod" id="${ctx.id(id)}" style="left:${px(left)};top:${px(top)};width:${px(w)};height:${px(h)};${style}"><div class="fx-abs" id="${ctx.id(`${id}-cam`)}" style="inset:0">${sh}${rf}<div class="fx-prod-tilt" id="${ctx.id(`${id}-tl`)}"><div class="fx-abs" id="${ctx.id(`${id}-rot`)}" style="inset:0"><img class="fx-prod-img" id="${ctx.id(`${id}-im`)}" src="${url}" alt="">${sw}</div></div></div></div>`;
  if (rot) ctx.tl.set(ctx.sel(`${id}-rot`), { rotation: rot }, 0);
  return { html, w, h, x: left, y: top, bottom: top + visB, sel: ctx.sel(id), cam: ctx.sel(`${id}-cam`) };
}
export function productIn(ctx, id, t, { from = 'rise', d = 0.9, ease = 'expo.out', dist = 260 } = {}) {
  const s = ctx.sel(id);
  const F = { rise: { y: dist, opacity: 0 }, drop: { y: -dist, opacity: 0 }, scale: { scale: 0.6, opacity: 0 }, left: { x: -dist * 2.5, opacity: 0 }, right: { x: dist * 2.5, opacity: 0 }, spin: { scale: 0.4, rotation: -90, opacity: 0 }, zoom: { scale: 1.8, opacity: 0 } }[from] || { opacity: 0 };
  const T = Object.fromEntries(Object.keys(F).map((k) => [k, k === 'opacity' || k === 'scale' ? 1 : 0]));
  ctx.tl.fromTo(s, F, { ...T, duration: d, ease }, t);
}
export function productOut(ctx, id, t, { to = 'up', d = 0.35, ease = 'power3.in', dist = 300 } = {}) {
  const T = { up: { y: -dist, opacity: 0 }, down: { y: dist, opacity: 0 }, left: { x: -dist * 3, opacity: 0 }, right: { x: dist * 3, opacity: 0 }, scale: { scale: 0.5, opacity: 0 }, zoom: { scale: 2.2, opacity: 0 } }[to];
  const F = Object.fromEntries(Object.keys(T).map((k) => [k, k === 'opacity' || k === 'scale' ? 1 : 0]));
  ctx.tl.fromTo(ctx.sel(id), F, { ...T, duration: d, ease }, t);
}
export function sweep(ctx, id, t, { d = 0.9, ease = 'power2.inOut' } = {}) {
  ctx.tl.fromTo(ctx.sel(`${id}-sw`), { backgroundPosition: '110% 0%' }, { backgroundPosition: '-10% 0%', duration: d, ease }, t);
}
export function tilt(ctx, id, t0, t1, { ry = 16, rx = 6, ease = 'sine.inOut' } = {}) {
  ctx.tl.fromTo(ctx.sel(`${id}-tl`), { rotationY: -ry, rotationX: rx }, { rotationY: ry, rotationX: -rx * 0.4, duration: Math.max(0.1, t1 - t0), ease }, t0);
}
// idle bob: finite yoyo count → deterministic
export function float(ctx, sel, t0, t1, { y = -18, rot = 0, period = null, ease = 'sine.inOut' } = {}) {
  const p = period || ctx.BAR / 2, n = Math.max(1, Math.floor((t1 - t0) / p));
  ctx.tl.fromTo(sel, { y: 0, rotation: 0 }, { y, rotation: rot, duration: p, ease, repeat: n - 1, yoyo: true }, t0);
}
export function pushIn(ctx, sel, t0, t1, { from = 1, to = 1.3, origin = '50% 50%', ease = 'power1.inOut' } = {}) {
  ctx.tl.set(sel, { transformOrigin: origin }, 0);
  ctx.tl.fromTo(sel, { scale: from }, { scale: to, duration: Math.max(0.1, t1 - t0), ease }, t0);
}
// front/back flip of two stacked products (same box). Needs two product() with the same geometry.
export function flip(ctx, frontId, backId, t, { d = 0.6 } = {}) {
  const f = ctx.sel(`${frontId}-tl`), b = ctx.sel(`${backId}-tl`);
  ctx.tl.fromTo(f, { rotationY: 0, opacity: 1 }, { rotationY: 90, opacity: 1, duration: d / 2, ease: 'power2.in' }, t);
  ctx.tl.set(f, { opacity: 0 }, t + d / 2);
  ctx.tl.fromTo(b, { rotationY: -90, opacity: 0 }, { rotationY: 0, opacity: 1, duration: d / 2, ease: 'power2.out' }, t + d / 2);
}

// ======================================================================================
// CAMERA / RHYTHM
// ======================================================================================
export function parallax(ctx, layers, t0, t1, { x = -120, y = 0, scale = 0, ease = 'sine.inOut' } = {}) {
  for (const L of layers) {
    const F = { x: 0, y: 0 }, T = { x: x * L.depth, y: y * L.depth };
    if (scale) { F.scale = 1; T.scale = 1 + scale * L.depth; }
    ctx.tl.fromTo(L.sel, F, { ...T, duration: Math.max(0.1, t1 - t0), ease }, t0);
  }
}
export function ramp(ctx, sel, t0, t1, { from = { scale: 1 }, to = { scale: 1.35 }, ease = 'fxRampIn' } = {}) {
  ctx.tl.fromTo(sel, from, { ...to, duration: Math.max(0.05, t1 - t0), ease }, t0);
}
export function punch(ctx, sel, t, { scale = 1.06, d = 0.3, ease = 'power2.out' } = {}) {
  ctx.tl.hit(sel, { scale }, { scale: 1, duration: d, ease }, t);
}
export function pulse(ctx, sel, { t0 = 0, t1 = ctx.dur, every = 'beat', scale = 1.04, d = 0.25 } = {}) {
  const arr = every === 'bar' ? ctx.downs : ctx.beats;
  arr.filter((t) => t >= t0 - 1e-3 && t < t1 - 0.05).forEach((t) => punch(ctx, sel, t, { scale, d }));
}

// ======================================================================================
// INFO GRAPHICS
// ======================================================================================
// value: string with digits ("1 300", "777", "6"); each digit rolls from 0 (plus `spins` full turns); non-digits are static
export function odometer(ctx, { id = 'odo', value, prefix = '', suffix = '', x = ctx.safe.left, y = 800, size = 220, font = ctx.theme.font?.display || 'Inter', wght = 900, color = ctx.theme.fg || '#fff', t = 0, d = 1.3, spins = 1, ease = 'expo.out', stagger = 0.06, align = 'left', w = null, style = '' } = {}) {
  const chars = [...nb(String(value))];
  let di = 0; const nD = chars.filter((c) => /\d/.test(c)).length;
  const parts = chars.map((c) => {
    if (!/\d/.test(c)) return `<span class="fx-odo-x">${c === ' ' || c === ' ' ? '&nbsp;' : esc(c)}</span>`;
    const k = di++, dig = +c, extra = spins + (nD - 1 - k > 0 ? 1 : 0);      // lower digits spin one more turn
    const seq = [...Array.from({ length: extra }, () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).flat(), ...Array.from({ length: dig + 1 }, (_, i) => i)];
    ctx.tl.fromTo(ctx.sel(`${id}-s${k}`), { yPercent: 0 }, { yPercent: -((seq.length - 1) / seq.length) * 100, duration: d + (nD - 1 - k) * stagger, ease }, t + k * stagger * 0.5);
    return `<span class="fx-odo-d"><span class="fx-odo-s" id="${ctx.id(`${id}-s${k}`)}">${seq.map((n) => `<i>${n}</i>`).join('')}</span></span>`;
  }).join('');
  const just = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start';
  return `<div class="fx-odo" id="${ctx.id(id)}" style="left:${px(x)};top:${px(y)};${w ? `width:${px(w)};` : ''}justify-content:${just};font-family:'${font}';font-weight:${wght};font-size:${size}px;color:${color};${style}">${prefix ? `<span class="fx-odo-x">${esc(prefix)}</span>` : ''}${parts}${suffix ? `<span class="fx-odo-x">${esc(suffix)}</span>` : ''}</div>`;
}
// countIn: the same markup / metrics as odometer() (drop-in), but every digit window holds ONLY its final digit, which rises out of
// its own overflow:hidden window (no rolling strip → never a wrong number or a stray row of digits on screen; v9, REVIEW_v8 MAJOR 1–2:
// letters / years / counts that are facts). Digits rise left → right with `stagger`, the whole number is complete at t + d + stagger·(n−1).
export function countIn(ctx, { id = 'cnt', value, prefix = '', suffix = '', x = ctx.safe.left, y = 800, size = 220, font = ctx.theme.font?.display || 'Inter', wght = 900, color = ctx.theme.fg || '#fff', t = 0, d = 0.42, ease = 'expo.out', stagger = 0.04, align = 'left', w = null, style = '' } = {}) {
  const chars = [...nb(String(value))];
  let di = 0;
  const parts = chars.map((c) => {
    if (!/\d/.test(c)) return `<span class="fx-odo-x">${c === ' ' || c === '\u00a0' ? '&nbsp;' : esc(c)}</span>`;
    const k = di++, sel = ctx.sel(`${id}-s${k}`);
    ctx.tl.fromTo(sel, { yPercent: 135, opacity: 0 }, { yPercent: 0, opacity: 1, duration: d, ease }, t + k * stagger);
    return `<span class="fx-odo-d"><span class="fx-odo-s" id="${ctx.id(`${id}-s${k}`)}"><i>${c}</i></span></span>`;
  }).join('');
  const just = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start';
  return `<div class="fx-odo" id="${ctx.id(id)}" style="left:${px(x)};top:${px(y)};${w ? `width:${px(w)};` : ''}justify-content:${just};font-family:'${font}';font-weight:${wght};font-size:${size}px;color:${color};${style}">${prefix ? `<span class="fx-odo-x">${esc(prefix)}</span>` : ''}${parts}${suffix ? `<span class="fx-odo-x">${esc(suffix)}</span>` : ''}</div>`;
}
const starPts = (n, r0, r1) => Array.from({ length: n * 2 }, (_, i) => { const a = (Math.PI * i) / n - Math.PI / 2, r = i % 2 ? r1 : r0; return `${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`; }).join(' ');
// shape: 'burst' (star badge), 'circle', 'pill'. size = diameter px (pill: width = size*1.9)
export function sticker(ctx, { id = 'stk', text, sub = '', x = 760, y = 700, size = 240, color = '#ffd400', fg = '#111', shape = 'burst', rot = -12, t = 0, d = 0.55, font = ctx.theme.font?.display || 'Inter', wght = 900, tsize = null, rays = true, style = '' } = {}) {
  const w = shape === 'pill' ? size * 1.9 : size, h = size;
  const svg = shape === 'burst' ? `<svg viewBox="0 0 100 100"><polygon points="${starPts(18, 50, 43)}" fill="${color}"/></svg>`
    : shape === 'circle' ? `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="${color}"/></svg>`
    : `<svg viewBox="0 0 190 100" preserveAspectRatio="none"><rect x="0" y="0" width="190" height="100" rx="50" fill="${color}"/></svg>`;
  const ts = tsize || Math.round(size * (String(text).length > 6 ? 0.2 : 0.28));
  const rr = rays ? `<div class="fx-stk-r">${Array.from({ length: 10 }, (_, i) => `<i id="${ctx.id(`${id}-r${i}`)}" style="height:${Math.round(size * 0.12)}px;background:${color}"></i>`).join('')}</div>` : '';
  ctx.tl.fromTo(ctx.sel(id), { scale: 0, rotation: rot - 40 }, { scale: 1, rotation: rot, duration: d, ease: 'back.out(2.2)' }, t);
  if (rays) for (let i = 0; i < 10; i++) {
    const a = (i / 10) * 360;
    ctx.tl.set(ctx.sel(`${id}-r${i}`), { rotation: a, transformOrigin: '50% 0%', opacity: 0 }, 0);
    ctx.tl.fromTo(ctx.sel(`${id}-r${i}`), { y: size * 0.32, scaleY: 0.2 }, { y: size * 0.78, scaleY: 1, duration: 0.5, ease: 'power2.out' }, t + 0.05);
    ctx.tl.hit(ctx.sel(`${id}-r${i}`), { opacity: 1 }, { opacity: 0, duration: 0.45, ease: 'power1.in' }, t + 0.05);
  }
  return `<div class="fx-stk" id="${ctx.id(id)}" style="left:${px(x - w / 2)};top:${px(y - h / 2)};width:${px(w)};height:${px(h)};${style}">${rr}${svg}<div class="fx-stk-t" style="font-family:'${font}';font-weight:${wght};color:${fg};font-size:${ts}px;text-transform:uppercase"><span>${esc(nb(text))}</span>${sub ? `<span style="font-size:${Math.round(ts * 0.5)}px;margin-top:.25em;letter-spacing:.08em">${esc(nb(sub))}</span>` : ''}</div></div>`;
}
// glass chip. tone 'dark' (on dark / photo bg) | 'light' (on light bg). from: 'left'|'right'|'up'|'scale'
export function chip(ctx, { id = 'chip', label = '', value, x = ctx.safe.left, y = 1200, w = null, tone = 'dark', accent = ctx.theme.accent || '#fff', t = 0, from = 'left', d = 0.6, font = ctx.theme.font?.text || 'Inter', vs = 46, ls = 22, style = '' } = {}) {
  const F = { left: { x: -80, opacity: 0, filter: 'blur(12px)' }, right: { x: 80, opacity: 0, filter: 'blur(12px)' }, up: { y: 50, opacity: 0, filter: 'blur(12px)' }, scale: { scale: 0.85, opacity: 0, filter: 'blur(12px)' } }[from];
  const T = Object.fromEntries(Object.keys(F).map((k) => [k, k === 'opacity' || k === 'scale' ? 1 : k === 'filter' ? 'blur(0px)' : 0]));
  ctx.tl.fromTo(ctx.sel(id), F, { ...T, duration: d, ease: 'expo.out' }, t);
  ctx.tl.set(ctx.sel(id), { filter: 'none' }, t + d + 0.02);     // a filter would disable the glass backdrop-filter
  return `<div class="fx-chip ${tone}" id="${ctx.id(id)}" style="left:${px(x)};top:${px(y)};${w ? `width:${px(w)};` : ''}font-family:'${font}';--vs:${vs}px;--ls:${ls}px;--acc:${accent};${style}"><i></i>${label ? `<span>${esc(nb(label))}</span>` : ''}<b>${esc(nb(value))}</b></div>`;
}
// RGB-split hit that decays (kind 'text' → text-shadow, 'img' → drop-shadow filter)
export function chroma(ctx, sel, t, { amt = 8, d = 0.35, kind = 'text' } = {}) {
  if (kind === 'text') ctx.tl.hit(sel, { textShadow: `${-amt}px 0 0 rgba(255,0,72,.85), ${amt}px 0 0 rgba(0,220,255,.85)` }, { textShadow: '0px 0 0 rgba(255,0,72,0), 0px 0 0 rgba(0,220,255,0)', duration: d, ease: 'power2.out' }, t);
  else ctx.tl.hit(sel, { filter: `drop-shadow(${-amt}px 0 0 rgba(255,0,72,.8)) drop-shadow(${amt}px 0 0 rgba(0,220,255,.8))` }, { filter: 'drop-shadow(0px 0 0 rgba(255,0,72,0)) drop-shadow(0px 0 0 rgba(0,220,255,0))', duration: d, ease: 'power2.out' }, t);
}
// split-screen grid assemble. src = one image split across tiles, or cells = [{src,pos}] one image per tile.
// mode: 'scatter' (tiles fly in from seeded offsets) | 'cols' (alternate up/down) | 'scale'
export function grid(ctx, { id = 'grid', src = null, cells = null, cols = 2, rows = 3, x = 0, y = 0, w = ctx.W, h = ctx.H, gap = 0, t = 0, d = 0.7, mode = 'cols', stagger = 0.05, radius = 0, pos = '50% 50%', seed = 3, style = '' } = {}) {
  const tw = (w - gap * (cols - 1)) / cols, th = (h - gap * (rows - 1)) / rows;
  const url = src ? ctx.asset(src) : null;
  let html = '';
  for (let r = 0, k = 0; r < rows; r++) for (let c = 0; c < cols; c++, k++) {
    const lx = c * (tw + gap), ly = r * (th + gap);
    const cell = cells ? cells[k % cells.length] : null;
    const bg = url ? `background-image:url(${url});background-size:${px(w)} ${px(h)};background-position:${px(-lx)} ${px(-ly)};` : '';
    html += `<div id="${ctx.id(`${id}-${k}`)}" style="left:${px(lx)};top:${px(ly)};width:${px(tw)};height:${px(th)};border-radius:${radius}px;${cell?.bg ? `background:${cell.bg};` : ''}${bg}">${cell ? ctx.img(cell.src, { pos: cell.pos || pos, fit: cell.fit || 'cover', style: cell.pad ? `inset:${cell.pad}px;width:auto;height:auto;` : '' }) : ''}</div>`;
    const F = mode === 'scatter' ? { x: (rnd(seed + k * 7) - 0.5) * 900, y: (rnd(seed + k * 13) - 0.5) * 1400, rotation: (rnd(seed + k) - 0.5) * 50, scale: 0.6, opacity: 0 }
      : mode === 'scale' ? { scale: 0, opacity: 0 } : { yPercent: c % 2 ? -110 : 110, opacity: 1 };
    const T = Object.fromEntries(Object.keys(F).map((kk) => [kk, kk === 'opacity' || kk === 'scale' ? 1 : 0]));
    ctx.tl.fromTo(ctx.sel(`${id}-${k}`), F, { ...T, duration: d, ease: 'expo.out' }, t + k * stagger);
  }
  return `<div class="fx-grid" id="${ctx.id(id)}" style="left:${px(x)};top:${px(y)};width:${px(w)};height:${px(h)};overflow:hidden;${style}">${html}</div>`;
}
// full-frame colour flash (overlay above the block content)
export function flash(ctx, t, { id = null, color = '#fff', peak = 0.85, d = 0.32, blend = 'normal' } = {}) {
  const fid = id || `fl${Math.round(t * 1000)}`;
  ctx.overlay(`<div class="fx-ov" id="${ctx.id(fid)}" style="background:${color};opacity:0;mix-blend-mode:${blend}"></div>`);
  ctx.tl.hit(ctx.sel(fid), { opacity: peak }, { opacity: 0, duration: d, ease: 'power2.out' }, t);
}

// ======================================================================================
// TRANSITIONS — every block owns its own in and out. Handoff contract: at the boundary both sides either hard-cut,
// or meet at a solid colour (the out covers with `color` = ctx.next.theme.bg by default, the in starts covered with
// `color` = own theme.bg). 'whip' / 'zoom' move the block stage itself (never animate ctx.stage yourself).
// ======================================================================================
const defsFor = (ctx) => (ctx._mbDefs ? '' : (ctx._mbDefs = true, `<svg class="fx-defs" aria-hidden="true"><filter id="${ctx.id('mb')}" x="-30%" y="-5%" width="160%" height="110%" color-interpolation-filters="sRGB"><feGaussianBlur id="${ctx.id('mbg')}" stdDeviation="0 0"/></filter></svg>`));
// [x%, y%, final radius %, delay (× d)] — 5 main drops + 3 satellites that the goo filter fuses into the main mass
const BLOBS = [[22, 30, 70, 0], [78, 24, 70, 0.03], [50, 62, 95, 0.06], [18, 82, 70, 0.09], [84, 78, 70, 0.12], [50, 14, 30, 0.02], [64, 44, 26, 0.1], [34, 52, 24, 0.16]];
const gooFor = (ctx) => (ctx._gooDefs ? '' : (ctx._gooDefs = true, `<svg class="fx-defs" aria-hidden="true"><filter id="${ctx.id('goo')}" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="34" result="b"/><feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -11"/></filter></svg>`));
function overlayFor(ctx, type, oid, color, dir, n = 7, lead = null) {
  if (type === 'slice') return `<div class="fx-ov" id="${ctx.id(oid)}" style="overflow:hidden"><div class="fx-ov-sl">${Array.from({ length: n }, (_, i) => `<i id="${ctx.id(`${oid}${i}`)}" style="background:${color}"></i>`).join('')}</div></div>`;
  if (type === 'grid') { const c = 4, r = 7; return `<div class="fx-ov fx-ov-gr" id="${ctx.id(oid)}" style="grid-template-columns:repeat(${c},1fr);grid-template-rows:repeat(${r},1fr)">${Array.from({ length: c * r }, (_, i) => `<i id="${ctx.id(`${oid}${i}`)}" style="background:${color};display:block;margin:-1px"></i>`).join('')}</div>`; }
  // liquid blob: circles merged by an SVG "goo" filter (blur + alpha threshold) → one organic, melting mask; container is
  // larger than the frame so the blur never thins the frame edges
  if (type === 'wipe') return `<div class="fx-ov" id="${ctx.id(oid)}" style="overflow:hidden">${lead ? `<i class="fx-ov-wp" id="${ctx.id(`${oid}a`)}" style="background:${lead}"></i>` : ''}<i class="fx-ov-wp" id="${ctx.id(`${oid}b`)}" style="background:${color}"></i></div>`;
  // TA mixer faders: n columns, each a full-height panel of `color` with TA-red cap lines just outside its top and bottom edge
  // (visible only while the column moves → the cover itself is a clean solid colour, the caps read as fader knobs)
  if (type === 'fader') return `<div class="fx-ov fx-ov-fd" id="${ctx.id(oid)}" style="overflow:hidden;--capc:${TA.red}">${Array.from({ length: FADER_N }, (_, i) => `<i id="${ctx.id(`${oid}${i}`)}" style="background:${color}"></i>`).join('')}</div>`;
  if (type === 'blob') return `${gooFor(ctx)}<div class="fx-ov fx-ov-bl" id="${ctx.id(oid)}" style="filter:url(#${ctx.id('goo')})">${BLOBS.map(([x, y], i) => `<i id="${ctx.id(`${oid}${i}`)}" style="background:${color};clip-path:circle(0% at ${x}% ${y}%)"></i>`).join('')}</div>`;
  return `<div class="fx-ov" id="${ctx.id(oid)}" style="background:${color}"></div>`;
}
// wipe = solid panels sliding in (tOut) / out (tIn) on x/yPercent — a moving hard edge, identical to an inset() wipe for a solid
// colour but transform-only (an inset() clip-path tween jumps: Chrome's computed value collapses equal sides, GSAP can't match it)
const WIPE = { right: ['xPercent', -100], left: ['xPercent', 100], up: ['yPercent', 100], down: ['yPercent', -100] };
// fader columns: count + per-column delay (fraction of d) shaped like a mixer move (centre faders lead, edges follow, a little
// seeded jitter) — deterministic
const FADER_N = 8;
const faderDelay = (i) => (Math.abs(i - (FADER_N - 1) / 2) / ((FADER_N - 1) / 2)) * 0.22 + rnd(i * 7 + 3) * 0.06;
const wipeAxis = (dir) => WIPE[dir] || WIPE.right;

export function tOut(ctx, type = 'cut', { color = ctx.next?.theme?.bg || ctx.theme.bg || '#000', d = 0.4, dir = 'right', end = ctx.dur } = {}) {
  const t = Math.max(0, end - d), oid = 'tout', o = ctx.sel(oid);
  if (type === 'cut') return;
  if (type === 'whip' || type === 'zoom') {
    if (type === 'whip') {
      ctx.overlay(defsFor(ctx));
      const sx = dir === 'left' ? 1 : -1;
      ctx.tl.set(ctx.stage, { filter: `url(#${ctx.id('mb')})` }, t);
      ctx.tl.fromTo(`#${ctx.id('mbg')}`, { attr: { stdDeviation: '0 0' } }, { attr: { stdDeviation: '60 0' }, duration: d, ease: 'power2.in' }, t);
      ctx.tl.fromTo(ctx.stage, { x: 0, skewX: 0 }, { x: sx * ctx.W * 0.75, skewX: -sx * 14, duration: d, ease: 'fxWhip' }, t);
    } else {
      ctx.tl.set(ctx.stage, { filter: 'blur(0px)' }, t);
      ctx.tl.fromTo(ctx.stage, { scale: 1, filter: 'blur(0px)' }, { scale: 2.6, filter: 'blur(18px)', duration: d, ease: 'power3.in' }, t);
      ctx.overlay(overlayFor(ctx, 'flash', oid, color));
      ctx.tl.fromTo(o, { opacity: 0 }, { opacity: 1, duration: d * 0.45, ease: 'power1.in' }, end - d * 0.45);
    }
    return;
  }
  const lead = type === 'wipe' ? (ctx.next?.theme?.accent || null) : null;
  ctx.overlay(overlayFor(ctx, type, oid, color, dir, 7, lead && lead !== color ? lead : null));
  if (type === 'wipe') {   // accent panel leads, the next block's bg follows (stacked wipe); covered at `end`
    const [ax, v] = wipeAxis(dir);
    if (lead && lead !== color) ctx.tl.fromTo(ctx.sel(`${oid}a`), { [ax]: v }, { [ax]: 0, duration: d * 0.8, ease: 'power3.inOut' }, t);
    ctx.tl.fromTo(ctx.sel(`${oid}b`), { [ax]: v }, { [ax]: 0, duration: d * 0.8, ease: 'power3.inOut' }, t + d * 0.2);
  }
  if (type === 'iris') ctx.tl.fromTo(o, { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', duration: d, ease: 'power3.in' }, t);
  else if (type === 'flash') ctx.tl.fromTo(o, { opacity: 0 }, { opacity: 1, duration: d, ease: 'power2.in' }, t);
  else if (type === 'slice') for (let i = 0; i < 7; i++) ctx.tl.fromTo(ctx.sel(`${oid}${i}`), { xPercent: i % 2 ? -101 : 101 }, { xPercent: 0, duration: d * 0.75, ease: 'power3.inOut' }, t + i * d * 0.035);
  else if (type === 'grid') for (let i = 0; i < 28; i++) { const c = i % 4, r = Math.floor(i / 4); ctx.tl.fromTo(ctx.sel(`${oid}${i}`), { scale: 0 }, { scale: 1.02, duration: d * 0.6, ease: 'power2.in' }, t + (Math.abs(c - 1.5) + Math.abs(r - 3)) * d * 0.06); }
  else if (type === 'blob') BLOBS.forEach(([x, y, r, dl], i) => ctx.tl.fromTo(ctx.sel(`${oid}${i}`), { clipPath: `circle(0% at ${x}% ${y}%)` }, { clipPath: `circle(${r}% at ${x}% ${y}%)`, duration: d * (0.84 - dl), ease: 'power2.in' }, t + dl * d));
  // faders ride up from below (dir 'down' → from above); every column is closed exactly at `end`
  else if (type === 'fader') { const v = dir === 'down' ? -101 : 101; for (let i = 0; i < FADER_N; i++) { const dl = faderDelay(i) * d; ctx.tl.fromTo(ctx.sel(`${oid}${i}`), { yPercent: v }, { yPercent: 0, duration: d - dl, ease: 'power3.inOut' }, t + dl); } }
}
export function tIn(ctx, type = 'cut', { color = ctx.theme.bg || '#000', d = 0.45, dir = 'right', start = 0 } = {}) {
  const t = start, oid = 'tin', o = ctx.sel(oid);
  if (type === 'cut') return;
  if (type === 'whip' || type === 'zoom') {
    if (type === 'whip') {
      ctx.overlay(defsFor(ctx));
      const sx = dir === 'left' ? -1 : 1;
      ctx.tl.set(ctx.stage, { filter: `url(#${ctx.id('mb')})` }, 0);
      ctx.tl.fromTo(`#${ctx.id('mbg')}`, { attr: { stdDeviation: '60 0' } }, { attr: { stdDeviation: '0 0' }, duration: d, ease: 'power2.out' }, t);
      ctx.tl.fromTo(ctx.stage, { x: sx * ctx.W * 0.75, skewX: -sx * 14 }, { x: 0, skewX: 0, duration: d, ease: 'expo.out' }, t);
      ctx.tl.set(ctx.stage, { filter: 'none' }, t + d + 0.02);
    } else {
      ctx.tl.fromTo(ctx.stage, { scale: 1.7, filter: 'blur(16px)' }, { scale: 1, filter: 'blur(0px)', duration: d, ease: 'expo.out' }, t);
      ctx.tl.set(ctx.stage, { filter: 'none' }, t + d + 0.02);
      ctx.overlay(overlayFor(ctx, 'flash', oid, color));
      ctx.tl.fromTo(o, { opacity: 1 }, { opacity: 0, duration: d * 0.5, ease: 'power1.out' }, t);
    }
    return;
  }
  const lead = type === 'wipe' ? (ctx.theme.accent || null) : null;
  ctx.overlay(overlayFor(ctx, type, oid, color, dir, 7, lead && lead !== color ? lead : null));
  if (type === 'wipe') {   // starts covered by own bg; the bg panel leaves first, the accent panel trails it (stacked wipe)
    const [ax, v] = wipeAxis(dir);
    ctx.tl.fromTo(ctx.sel(`${oid}b`), { [ax]: 0 }, { [ax]: -v, duration: d * 0.8, ease: 'power3.inOut' }, t);
    if (lead && lead !== color) ctx.tl.fromTo(ctx.sel(`${oid}a`), { [ax]: 0 }, { [ax]: -v, duration: d * 0.8, ease: 'power3.inOut' }, t + d * 0.2);
  } else if (type === 'iris') {
    // the hole grows past the farthest corner (radial-gradient 100% = farthest-corner; the 1 % soft edge must clear it too),
    // then the overlay is hidden — the old 78 % end left the four corners covered in `color` for the rest of the block
    const m = 'radial-gradient(circle at 50% 50%, transparent var(--r), #000 calc(var(--r) + 1%))';
    ctx.tl.set(o, { webkitMaskImage: m, maskImage: m }, 0);
    ctx.tl.fromTo(o, { '--r': '0%' }, { '--r': '102%', duration: d, ease: 'power3.out' }, t);
    ctx.tl.set(o, { opacity: 0 }, t + d + 0.001);
  }
  else if (type === 'flash') ctx.tl.fromTo(o, { opacity: 1 }, { opacity: 0, duration: d, ease: 'power2.out' }, t);
  else if (type === 'slice') for (let i = 0; i < 7; i++) ctx.tl.fromTo(ctx.sel(`${oid}${i}`), { xPercent: 0 }, { xPercent: i % 2 ? 101 : -101, duration: d * 0.75, ease: 'power3.inOut' }, t + i * d * 0.035);
  else if (type === 'grid') for (let i = 0; i < 28; i++) { const c = i % 4, r = Math.floor(i / 4); ctx.tl.fromTo(ctx.sel(`${oid}${i}`), { scale: 1.02 }, { scale: 0, duration: d * 0.6, ease: 'power2.out' }, t + (Math.abs(c - 1.5) + Math.abs(r - 3)) * d * 0.06); }
  else if (type === 'blob') BLOBS.forEach(([x, y, r, dl], i) => ctx.tl.fromTo(ctx.sel(`${oid}${i}`), { clipPath: `circle(${r}% at ${x}% ${y}%)` }, { clipPath: `circle(0% at ${x}% ${y}%)`, duration: d * (0.84 - dl), ease: 'power2.out' }, t + dl * d));
  // faders keep riding the same way (up) and leave the frame: centre columns first, so the product in the middle shows first
  else if (type === 'fader') { const v = dir === 'down' ? 101 : -101; for (let i = 0; i < FADER_N; i++) { const dl = faderDelay(i) * d; ctx.tl.fromTo(ctx.sel(`${oid}${i}`), { yPercent: 0 }, { yPercent: v, duration: d - dl, ease: 'power3.inOut' }, t + dl); } }
}

// ======================================================================================
// END CARD — sponsor logo + URL + "Partner MČR v Trout Area 2026" + TA logo (the persistent plate flies into the lockup)
// t: start (block-local), holds to `t1` (default block end). scale = TA plate scale in the lockup (sponsor logo ≤ that).
// ======================================================================================
// plateT: when the plate starts flying (default t). Reel end cards pass plateT = −plateFly so the TA plate flies OVER the block's
// out-transition and lands on the downbeat; settle: true → the lockup is complete on frame 1 and only settles (no fade-in from an
// empty frame — the first frame of a Reel end card must already be the finished lockup).
// ta: true (default, v3) → the line under the TA logo is set in Montserrat 700 caps and the separator is a TA-red hairline (our
// signature in every lockup); ta: false → the old look (line in textFont, bar in the sponsor accent).
export function endCard(ctx, { id = 'ec', t = 0, t1 = ctx.dur, logo = 'on_dark', url = ctx.data?.url, line = 'Partner MČR v Trout Area 2026', tone = 'dark', fg = ctx.theme.fg || '#fff', accent = ctx.theme.accent || '#fff', font = ctx.theme.font?.display || 'Inter', textFont = ctx.theme.font?.text || 'Inter', scale = 1.5, cy = 1010, gap = 46, plateFly = 0.6, plateT = t, settle = false, ease, ta = true } = {}) {
  const P = ctx.plate.hero(plateT, t1, { scale, cx: ctx.W / 2, cy: cy - 330, fly: plateFly, ...(ease ? { ease } : {}) });
  const SET = settle ? 1.05 : 1;   // the settle scales the whole lockup 1.05 → 1: fit the logo to scale ÷ 1.05 so frame 1 obeys the logo rule
  const L = ctx.logo(logo, { box: [760, 300], scale: scale / SET, at: [Math.max(t, plateT + plateFly), t1], id: `${id}-logo`, label: `${ctx.cid} end card` });
  const urlFit = ctx.fit(url || '', { font, wght: 800, maxW: 900, maxLines: 1, sizes: [96, 88, 80, 72, 64, 56] });
  const html = `<div class="fx-ec" id="${ctx.id(id)}" style="top:${px(P.y + P.h + gap)}">
    <div id="${ctx.id(`${id}-line`)}" style="font-family:'${ta ? TA.font : textFont}';font-weight:700;font-size:${ta ? 26 : 28}px;letter-spacing:${ta ? '.2em' : '.18em'};text-transform:uppercase;color:${fg};opacity:.85">${esc(nb(line))}</div>
    <div id="${ctx.id(`${id}-bar`)}" style="width:${ta ? 140 : 120}px;height:${ta ? 3 : 6}px;border-radius:3px;background:${ta ? TA.red : accent};margin:${gap * 0.7}px 0"></div>
    <div id="${ctx.id(`${id}-lw`)}">${L.html}</div>
    <div id="${ctx.id(`${id}-url`)}" style="margin-top:${gap}px;font-family:'${font}';font-weight:800;font-size:${urlFit.size}px;color:${fg};letter-spacing:-.01em">${esc(url || '')}</div>
  </div>`;
  if (settle) {
    ctx.tl.set(ctx.sel(id), { transformOrigin: '50% 0%' }, 0);
    ctx.tl.fromTo(ctx.sel(id), { scale: SET }, { scale: 1, duration: 0.7, ease: 'expo.out' }, t);
    ctx.tl.fromTo(ctx.sel(`${id}-bar`), { scaleX: 0.3 }, { scaleX: 1, duration: 0.6, ease: 'expo.out' }, t);
    return { html, logo: L, plate: P };
  }
  const tt = t + plateFly * 0.6;
  ctx.tl.fromTo(ctx.sel(`${id}-line`), { opacity: 0, y: 20 }, { opacity: 0.85, y: 0, duration: 0.5, ease: 'expo.out' }, tt);
  ctx.tl.fromTo(ctx.sel(`${id}-bar`), { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'expo.out' }, tt + 0.08);
  ctx.tl.fromTo(ctx.sel(`${id}-lw`), { opacity: 0, scale: 0.85, filter: 'blur(10px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.7, ease: 'expo.out' }, tt + 0.14);
  ctx.tl.fromTo(ctx.sel(`${id}-url`), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, tt + 0.26);
  return { html, logo: L, plate: P };
}

// ======================================================================================
// TA CHIP — „a little of our style“ (v3): Montserrat 800 caps + a short TA-red hairline, glass pill in the sponsor world.
//   const C = fx.taChip(ctx, { id: 'pz', text: 'Věnuje ceny', sub: 'MČR 2026', cx: 540, y: 1320, t: 1.2 }); html += C.html;
// tone 'dark' (on dark / photo) | 'light' (on light). cx centres the chip, else x = left edge. Entrance: settle + hairline draw
// (t = null → static, visible from frame 1). Returns {html, w, h, x, y}.
// ======================================================================================
export function taChip(ctx, { id = 'tachip', text, sub = '', cx = null, x = ctx.safe.left, y = 1300, size = 30, tone = 'dark', t = 0, d = 0.5, tracking = 0.08, hl = 34, style = '' } = {}) {
  const T = ctx.tokens?.ta || {};
  const padX = Math.round(size * 0.95), padY = Math.round(size * 0.62), gap = 14;
  const wMain = ctx.measure(text, { font: TA.font, size, wght: 800, upper: true, tracking });
  const wSub = sub ? ctx.measure(sub, { font: TA.font, size, wght: 600, upper: true, tracking }) + gap + 4 : 0;
  const w = Math.ceil(padX * 2 + hl + gap + wMain + wSub), h = Math.ceil(size + padY * 2);
  const left = cx != null ? cx - w / 2 : x;
  const html = `<div class="fx-tach ${tone}" id="${ctx.id(id)}" style="left:${px(left)};top:${px(y)};height:${px(h)};padding:0 ${padX}px;font-size:${size}px;letter-spacing:${tracking}em;--hl:${hl}px;${style}"><b id="${ctx.id(`${id}-hl`)}" style="background:${T.red || TA.red}"></b><span>${esc(nb(text))}</span>${sub ? `<em>${esc(nb(sub))}</em>` : ''}</div>`;
  if (t != null) {
    // opacity in 2 frames (a slow fade = grey ghost over the world), movement separately
    ctx.tl.fromTo(ctx.sel(id), { opacity: 0 }, { opacity: 1, duration: 0.07, ease: 'none' }, t);
    ctx.tl.fromTo(ctx.sel(id), { y: 24 }, { y: 0, duration: d, ease: 'expo.out' }, t);
    ctx.tl.fromTo(ctx.sel(`${id}-hl`), { scaleX: 0 }, { scaleX: 1, duration: d * 1.2, ease: 'expo.out' }, t + 0.08);
    ctx.tl.set(ctx.sel(`${id}-hl`), { transformOrigin: '0% 50%' }, 0);
  }
  return { html, w, h, x: left, y };
}

export { r3, J };
