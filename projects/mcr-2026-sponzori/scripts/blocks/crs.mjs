// ČRS · Český rybářský svaz — poděkování za dlouholetou podporu (v3, plan B bars 55–58, 4 bars ≈ 7.3 s, VO 0.25–4.4 s)
// PLACEHOLDER (engine v3): minimal, verified copy only, built from fx.mjs. A block agent designs the real block next.
// Brand world (rybsvaz.cz logo SVG fills): blue #2B5DA9 · navy #182F5D · turquoise of the round emblem #38B0C0; web font Roboto
// (gov design system) → Inter here. role 'supporter': NO „Věnuje ceny“ chip (research/crs.md §2), never „pod záštitou ČRS“.
//   bar 0   DĚKUJEME (TA voice: Montserrat caps + TA-red hairline) on the downbeat · title ČESKÝ RYBÁŘSKÝ SVAZ rises on „Českému“
//   bar 1   ČRS logo (white, ≤ TA logo) under the title · „za dlouholetou podporu“ on „za“
//   bar 2   verified fact chip „Vlastník areálu Líheň Liběchov · ČRS MO Mělník“ (lihenlibechov.cz/cs/kontakt) · round emblem + rybsvaz.cz
//   bar 3   hold (music only) → TA mixer-fader transition into the finale (the one place the film uses our fader signature)
// Reel: default hook (meta.hook) + default end card (TA lockup, line „Děkujeme za dlouholetou podporu“).
import * as fx from '../lib/fx.mjs';

const C = { blue: '#2B5DA9', navy: '#182F5D', deep: '#0f1f40', turq: '#38B0C0' };
export const theme = { bg: C.navy, bg2: C.blue, fg: '#ffffff', accent: C.turq, accent2: '#ffffff', font: { display: 'Inter', text: 'Inter' }, wght: 900, upper: true, light: false };
export const meta = {
  reel: true,
  role: 'supporter',                     // build rule: no prize chip (only sponsors carry „Věnuje ceny“)
  hook: { headline: 'Děkujeme Českému rybářskému svazu', sub: 'rybsvaz.cz' },
  endCard: { logo: 'on_dark', line: 'Děkujeme za dlouholetou podporu' },
};

export default function crs(ctx) {
  const { W } = ctx, L = ctx.safe.left;
  const at = (q, fb) => ctx.snap(ctx.vo.at(q) ?? fb, 'beat');
  let html = '';
  // ---- world ----
  html += fx.field(ctx, { kind: 'radial', c1: C.blue, c2: C.navy, at: '50% 34%' });
  html += fx.glow(ctx, { id: 'gl', x: 820, y: 560, size: 1100, color: C.turq, opacity: 0.22 });
  html += fx.bigType(ctx, { id: 'big', text: 'ČRS', font: 'Inter', size: 620, y: 1080, x: -40, color: 'rgba(255,255,255,.05)', drift: -160 });

  // ---- bar 0: DĚKUJEME (on the downbeat, settle) + title on „Českému“ ----
  const KS = 44;
  html += `<div id="${ctx.id('kick')}" class="fx-abs" style="left:${L}px;top:430px;display:flex;align-items:center;gap:18px;font-family:'${fx.TA.font}';font-weight:800;font-size:${KS}px;letter-spacing:.22em;text-transform:uppercase;color:#fff;line-height:1">
    <b id="${ctx.id('kick-hl')}" style="display:block;width:64px;height:4px;border-radius:2px;background:${fx.TA.red}"></b><span>${ctx.esc('Děkujeme')}</span></div>`;
  ctx.tl.set(ctx.sel('kick'), { transformOrigin: '0% 50%' }, 0);
  ctx.tl.fromTo(ctx.sel('kick'), { scale: 1.12 }, { scale: 1, duration: 0.6, ease: 'expo.out' }, 0);
  ctx.tl.set(ctx.sel('kick-hl'), { transformOrigin: '0% 50%' }, 0);
  ctx.tl.fromTo(ctx.sel('kick-hl'), { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'expo.out' }, 0.04);

  const tT = Math.max(ctx.beat(1), at('Českému', ctx.beat(2)) - 0.08);
  const Hd = fx.headline(ctx, { id: 'ttl', text: ctx.data.copy.headline, x: L, y: 520, w: W - 2 * L, maxLines: 3, upper: true, font: 'Inter', wght: 900, color: '#fff', t: tT, reveal: 'lines', sizes: [132, 124, 116, 108, 100, 92] });
  html += Hd.html;
  const yT = 520 + Hd.h;

  // ---- bar 1: logo + sub ----
  const LG = ctx.logo('on_dark', { box: [281, 110], id: 'logo', style: `position:absolute;left:${L}px;top:${yT + 56}px` });
  html += LG.html;
  const tL = ctx.bar(1);
  ctx.tl.fromTo(ctx.sel('logo'), { opacity: 0 }, { opacity: 1, duration: 0.07, ease: 'none' }, tL - 0.04);
  ctx.tl.fromTo(ctx.sel('logo'), { y: 30 }, { y: 0, duration: 0.6, ease: 'expo.out' }, tL - 0.04);
  const yS = yT + 56 + LG.h + 60;
  const Sb = fx.headline(ctx, { id: 'sub', text: ctx.data.copy.sub, x: L, y: yS, w: W - 2 * L, maxLines: 2, upper: false, font: 'Inter', wght: 700, color: 'rgba(255,255,255,.92)', t: at('za', ctx.at(1, 2)) - 0.06, reveal: 'words', sizes: [64, 58, 52] });
  html += Sb.html;

  // ---- bar 2: fact chip + emblem + URL ----
  const yC = Math.max(yS + Sb.h + 70, 1180);
  html += fx.chip(ctx, { id: 'fact', label: 'Vlastník areálu Líheň Liběchov', value: 'ČRS · MO Mělník', x: L, y: yC, tone: 'dark', accent: C.turq, t: ctx.bar(2) - 0.06, from: 'left', font: 'Inter', vs: 44, ls: 22 });
  const BG = ctx.logo('badge', { box: [150, 150], id: 'badge', style: `position:absolute;left:${L}px;top:${yC + 170}px`, label: 'crs emblem' });
  html += BG.html;
  const tB = ctx.at(2, 2);
  ctx.tl.fromTo(ctx.sel('badge'), { opacity: 0 }, { opacity: 1, duration: 0.07, ease: 'none' }, tB - 0.05);
  ctx.tl.fromTo(ctx.sel('badge'), { rotation: -40 }, { rotation: 0, duration: 0.8, ease: 'expo.out' }, tB - 0.05);
  html += `<div id="${ctx.id('url')}" class="fx-abs" style="left:${L + BG.w + 30}px;top:${yC + 170 + BG.h / 2 - 36}px;font-family:'Inter';font-weight:800;font-size:64px;line-height:72px;color:#fff;letter-spacing:-.01em">${ctx.esc(ctx.data.url)}</div>`;
  ctx.tl.fromTo(ctx.sel('url'), { opacity: 0 }, { opacity: 1, duration: 0.07, ease: 'none' }, tB);
  ctx.tl.fromTo(ctx.sel('url'), { x: -40 }, { x: 0, duration: 0.6, ease: 'expo.out' }, tB);

  // ---- out: TA mixer faders into the next block's colour (closed exactly on the downbeat) ----
  fx.tOut(ctx, 'fader', { d: 0.55 });
  return { html, css: '' };
}
