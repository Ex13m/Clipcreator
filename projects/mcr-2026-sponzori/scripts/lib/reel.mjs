// Default Reels parts around a sponsor block: 1-bar HOOK before it and a 2-bar END CARD after it.
// A block module can override either by exporting `hook(ctx)` / `endCard(ctx)` (same return shape as the block: {css, html, timeline}).
// Data used: module `meta.hook` = { product: <index into data.products | path>, headline: '…', sub?: '…' },
//            module `meta.endCard` = { logo: 'on_dark'|'on_light'|'plate', line?: '…' }, module `theme`.
import * as fx from './fx.mjs';

const prodOf = (ctx, p) => (typeof p === 'number' ? ctx.data.products?.[p] : typeof p === 'string' ? { src: p } : p) || ctx.data.products?.[0];

export function defaultHook(ctx) {
  const T = ctx.theme, M = ctx.module.meta?.hook || {};
  const pr = prodOf(ctx, M.product ?? 0);
  const BAR = ctx.dur;
  let html = fx.field(ctx, { kind: 'radial', c1: T.bg2 || T.accent || T.bg, c2: T.bg, at: '50% 55%' });
  html += fx.glow(ctx, { x: ctx.W / 2, y: 1000, size: 1100, color: T.accent || '#fff', opacity: 0.35 });
  // headline first (its height decides where the product sits), painted above the product
  // the first frame of a Reel must already sell (lessons MČR v2): headline + sub visible on frame 1, the CONTAINER settles 1.08 → 1
  const H = fx.headline(ctx, { id: 'hh', text: M.headline || ctx.data.copy?.headline || ctx.data.name, x: ctx.safe.left, y: 420, maxLines: 3, upper: T.upper ?? true, font: T.font?.display, wght: T.wght ?? 900, color: T.fg, t: null, sizes: [140, 124, 112, 100, 92, 84, 76, 68] });
  ctx.tl.set(H.sel, { transformOrigin: '0% 0%' }, 0);
  ctx.tl.fromTo(H.sel, { scale: 1.08 }, { scale: 1, duration: 0.7, ease: 'expo.out' }, 0);
  const S = M.sub ? fx.headline(ctx, { id: 'hs', text: M.sub, x: ctx.safe.left, y: 420 + H.h + 26, maxLines: 1, font: T.font?.text, wght: 700, color: T.accent || T.fg, t: null, sizes: [40, 36, 32] }) : null;
  const textBottom = 420 + H.h + (S ? 26 + 48 : 0);
  if (pr) {
    // fit the product into the free box under the text (wide lures must not run off the frame; never upscale > 1.25×)
    const [nw, nh] = ctx.dims(pr.src), ar = nw / nh;
    const boxW = 920, boxH = Math.min(760, ctx.H - ctx.safe.bottom - textBottom - 80);
    const w = Math.min(boxW, boxH * ar, nw * 1.25), h = w / ar;
    const cy = Math.min(ctx.H - ctx.safe.bottom - h / 2 - 20, Math.max(textBottom + 60 + h / 2, 1040));
    const P = fx.product(ctx, { id: 'hp', src: pr.src, w, cy, ground: 'float', pad: pr.pad, rot: M.rot ?? -8, maxUp: 1.25 });
    html += P.html;
    fx.productIn(ctx, 'hp', 0, { from: 'zoom', d: 0.7 });
    fx.pushIn(ctx, P.cam, 0.7, BAR, { from: 1, to: 1.08 });
    fx.sweep(ctx, 'hp', 0.45, { d: 0.8 });
  }
  html += H.html;
  if (S) html += S.html;
  fx.tOut(ctx, 'flash', { color: T.bg, d: 0.12 });
  return { html, css: '', timeline: ctx.tl };
}

export function defaultEndCard(ctx) {
  const T = ctx.theme, M = ctx.module.meta?.endCard || {};
  let html = fx.field(ctx, { kind: 'radial', c1: T.bg2 || T.bg, c2: T.bg, at: '50% 45%' });
  html += fx.marquee(ctx, { id: 'emq', text: ctx.data.name, y: 1560, size: 150, font: T.font?.display, color: T.fg, outline: true, ow: 2, speed: 90, style: 'opacity:.18' });
  // lockup complete on frame 1: the TA logo flies over the block's out-transition and lands on the downbeat, the lockup only settles
  const E = fx.endCard(ctx, { t: 0, plateT: -0.42, plateFly: 0.42, ease: 'power3.inOut', settle: true, logo: M.logo || (T.light ? 'on_light' : 'on_dark'), url: ctx.data.url, line: M.line || 'Partner MČR v Trout Area 2026', fg: T.fg, accent: T.accent, font: T.font?.display, textFont: T.font?.text, scale: 1.5 });
  html += E.html;
  return { html, css: '', timeline: ctx.tl };
}
