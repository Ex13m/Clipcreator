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
  if (pr) {
    const P = fx.product(ctx, { id: 'hp', src: pr.src, h: Math.min(760, (pr.size?.[1] || 700) * 1.25), cy: 1040, ground: 'float', pad: pr.pad, rot: M.rot ?? -8 });
    html += P.html;
    fx.productIn(ctx, 'hp', 0, { from: 'zoom', d: 0.7 });
    fx.pushIn(ctx, P.cam, 0.7, BAR, { from: 1, to: 1.08 });
    fx.sweep(ctx, 'hp', 0.45, { d: 0.8 });
  }
  const H = fx.headline(ctx, { id: 'hh', text: M.headline || ctx.data.copy?.headline || ctx.data.name, x: ctx.safe.left, y: 420, maxLines: 3, upper: T.upper ?? true, font: T.font?.display, wght: T.wght ?? 900, color: T.fg, t: 0.05, reveal: 'lines', sizes: [140, 124, 112, 100, 92, 84, 76, 68] });
  html += H.html;
  if (M.sub) html += fx.headline(ctx, { id: 'hs', text: M.sub, x: ctx.safe.left, y: 420 + H.h + 26, maxLines: 1, font: T.font?.text, wght: 700, color: T.accent || T.fg, t: 0.3, reveal: 'fade', sizes: [40, 36, 32] }).html;
  fx.tOut(ctx, 'flash', { color: T.bg, d: 0.12 });
  return { html, css: '', timeline: ctx.tl };
}

export function defaultEndCard(ctx) {
  const T = ctx.theme, M = ctx.module.meta?.endCard || {};
  let html = fx.field(ctx, { kind: 'radial', c1: T.bg2 || T.bg, c2: T.bg, at: '50% 45%' });
  html += fx.marquee(ctx, { id: 'emq', text: ctx.data.name, y: 1560, size: 150, font: T.font?.display, color: T.fg, outline: true, ow: 2, speed: 90, style: 'opacity:.18' });
  fx.tIn(ctx, 'flash', { color: T.bg, d: 0.2 });
  const E = fx.endCard(ctx, { t: 0.05, logo: M.logo || (T.light ? 'on_light' : 'on_dark'), url: ctx.data.url, line: M.line || 'Partner MČR v Trout Area 2026', fg: T.fg, accent: T.accent, font: T.font?.display, textFont: T.font?.text, scale: 1.5 });
  html += E.html;
  return { html, css: '', timeline: ctx.tl };
}
