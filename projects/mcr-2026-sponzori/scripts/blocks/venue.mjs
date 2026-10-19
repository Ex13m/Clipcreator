// VENUE · Líheň Liběchov · bars 8–12 (drop at bar 8) · PLACEHOLDER (minimal, modern) — a venue agent replaces this.
// Brand world from lihenlibechov.cz: turquoise #17a1c8, navy #1a212e, aqua #9ae7e8, gold #d8af64, Montserrat italic uppercase.
// Drone flyover (drone/final/flyover_9x16.mp4) full-bleed when present (last frame held if shorter); otherwise photo v01 Malý Sporťáček.
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import * as fx from '../lib/fx.mjs';
import { ffDur, exists } from '../lib/util.mjs';

export const theme = { bg: '#1a212e', bg2: '#123c55', fg: '#ffffff', accent: '#17a1c8', accent2: '#d8af64', aqua: '#9ae7e8', font: { display: 'Montserrat', text: 'Montserrat' }, wght: 900, upper: true };
export const meta = { reel: true, hook: { product: null, headline: 'Místo konání MČR 2026', sub: 'Líheň Liběchov' }, endCard: { logo: 'on_dark' } };

// hook for the venue reel: drone / pond photo instead of a product
export function hook(ctx) {
  const T = theme, D = ctx.data;
  let html = fx.photo(ctx, { id: 'hph', src: D.photos[0], kb: { from: { scale: 1.25 }, to: { scale: 1.08 }, t0: 0, t1: ctx.dur, ease: 'power2.out' } });
  html += `<div class="fx-full" style="background:linear-gradient(180deg, rgba(26,33,46,.75), rgba(26,33,46,.1) 45%, rgba(26,33,46,.65))"></div>`;
  html += fx.headline(ctx, { id: 'hh', text: 'Místo konání', x: ctx.safe.left, y: 430, maxLines: 1, font: 'Montserrat', italic: true, wght: 900, upper: true, size: 92, color: T.aqua, t: 0.05, reveal: 'lines' }).html;
  html += fx.headline(ctx, { id: 'hn', text: D.name, x: ctx.safe.left, y: 540, maxLines: 2, font: 'Montserrat', italic: true, wght: 900, upper: true, sizes: [150, 136, 124, 112], t: 0.2, reveal: 'chars' }).html;
  fx.tOut(ctx, 'flash', { color: '#ffffff', d: 0.1 });
  return { html };
}

export default function venue(ctx) {
  const T = theme, D = ctx.data, { bar } = ctx;
  const L = ctx.safe.left, CW = ctx.W - L - ctx.safe.right, CWU = ctx.W - L - ctx.safe.uiRight;
  const at = (q, d) => ctx.snap(ctx.vo.at(q) ?? d, 'beat');
  let html = '';
  // ---- background: drone or photo ----
  const vid = D.video && ctx.has(D.video);
  let vdur = 0, still = null;
  if (vid) {
    vdur = ffDur(ctx.srcOf(D.video));
    if (vdur > 0 && vdur < ctx.dur - 0.05) {        // hold the drone's last frame instead of cutting to a photo
      const rel = `drone/final/${path.basename(D.video).replace(/\.[^.]+$/, '')}_last.jpg`;
      const dst = ctx.srcOf(rel);
      try { if (!exists(dst) || fs.statSync(dst).mtimeMs < fs.statSync(ctx.srcOf(D.video)).mtimeMs) execFileSync('ffmpeg', ['-v', 'error', '-y', '-sseof', '-0.15', '-i', ctx.srcOf(D.video), '-frames:v', '1', '-q:v', '2', dst]); still = rel; } catch { still = null; }
    }
    ctx.report(`drone ${D.video} ${vdur}s${still ? ' + held last frame' : ''}`);
  } else ctx.report(`drone missing → photo ${path.basename(D.photos[0])}`);
  const bgPhoto = still || D.photos[0];
  html += `<div class="fx-full" id="${ctx.id('bgw')}">${fx.photo(ctx, { id: 'bg', src: bgPhoto, kb: { from: { scale: vid ? 1.0 : 1.3 }, to: { scale: vid ? 1.05 : 1.06 }, t0: vid ? vdur : 0, t1: ctx.dur, ease: 'power2.out' } })}${vid ? ctx.video(D.video, { id: 'drone', start: 0, dur: Math.min(vdur, ctx.dur), style: 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover' }) : ''}</div>`;
  html += `<div class="fx-full" style="background:linear-gradient(180deg, rgba(26,33,46,.82) 0%, rgba(26,33,46,.25) 30%, rgba(26,33,46,.1) 52%, rgba(18,60,85,.55) 75%, rgba(26,33,46,.92) 100%)"></div>`;

  // ---- bar 0 (drop): kicker + LÍHEŇ LIBĚCHOV + round badge ----
  const lg = ctx.logo('on_dark', { box: [150, 150], id: 'logo', label: 'venue badge' });
  html += `<div class="fx-abs" id="${ctx.id('lw')}" style="left:${ctx.W - ctx.safe.right - lg.w}px;top:${ctx.plate.rect.y + 2}px">${lg.html}</div>`;
  ctx.tl.fromTo(ctx.sel('lw'), { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.7, ease: 'back.out(1.6)' }, 0.1);
  html += fx.headline(ctx, { id: 'k', text: `${D.kicker} · MČR 2026`, x: L, y: 470, maxLines: 1, font: 'Montserrat', wght: 800, italic: true, upper: true, size: 34, tracking: 0.12, color: T.aqua, t: 0.05, reveal: 'chars', stagger: 0.015 }).html;
  const N = fx.headline(ctx, { id: 'n', text: D.name, x: L, y: 530, w: CW, maxLines: 2, font: 'Montserrat', wght: 900, italic: true, upper: true, sizes: [176, 160, 148, 136, 124], lh: 0.9, t: 0.12, reveal: 'lines' });
  html += N.html;
  fx.chroma(ctx, N.sel, 0.12, { amt: 10, d: 0.5 });

  // ---- bar 1–2: od roku 1934 (odometer on VO) ----
  const t34 = Math.max(bar(1), at('1934', bar(1) + ctx.BEAT * 2) - 0.6);
  let s1 = fx.headline(ctx, { id: 'ol', text: 'Pstruží líheň od roku', x: L, y: 1060, maxLines: 1, font: 'Montserrat', wght: 800, italic: true, upper: true, size: 40, tracking: 0.04, color: T.aqua, t: t34, reveal: 'lines' }).html;
  s1 += fx.odometer(ctx, { id: 'y', value: '1934', x: L - 6, y: 1112, size: 230, font: 'Montserrat', wght: 900, color: '#ffffff', t: t34 + 0.1, d: 1.4, spins: 1 });
  html += fx.scene(ctx, 's1', t34, bar(3), s1, { outD: 0.25 });

  // ---- bar 3: donedávna nejníže položené pstruhařství v Evropě · 164 m n. m. ----
  const tLow = Math.max(bar(3), at('donedávna', bar(3)));
  let s2 = fx.chip(ctx, { id: 'c1', label: 'Rybník', value: 'Malý Sporťáček · 24.–25. 10.', x: L, y: 1050, w: CWU, tone: 'dark', accent: T.accent, t: tLow, font: 'Montserrat', vs: 40 });
  s2 += fx.chip(ctx, { id: 'c2', label: 'donedávna nejníže položené pstruhařství v Evropě', value: '164 m n. m. · pramen Boží Voda', x: L, y: 1200, w: CWU, tone: 'dark', accent: T.accent2, t: tLow + ctx.BEAT, font: 'Montserrat', vs: 40, ls: 18 });
  html += fx.scene(ctx, 's2', tLow, bar(4) + ctx.BEAT * 2, s2, { outD: 0.2 });

  // ---- bar 4: URL lockup ----
  const tU = bar(4) + ctx.BEAT * 2;
  html += fx.headline(ctx, { id: 'u', text: D.url, x: L, y: 1180, maxLines: 1, font: 'Montserrat', wght: 900, italic: true, size: 84, t: tU, reveal: 'lines' }).html;
  html += fx.marquee(ctx, { id: 'mq', text: 'Líheň Liběchov · Malý Sporťáček · Boží Voda', y: 1385, size: 44, font: 'Montserrat', italic: true, wght: 800, color: T.bg, bg: T.accent, speed: 110, rot: -3, sep: ' · ' });
  ctx.tl.fromTo(ctx.sel('mq'), { yPercent: 160 }, { yPercent: 0, duration: 0.6, ease: 'expo.out' }, ctx.BEAT);
  // drop accents: aqua flash on every bar
  ctx.downs.forEach((t, i) => fx.flash(ctx, t, { id: `fl${i}`, color: T.aqua, peak: i ? 0.12 : 0.45, d: i ? 0.3 : 0.6, blend: 'screen' }));
  fx.tIn(ctx, 'zoom', { d: 0.5, color: '#ffffff' });
  fx.tOut(ctx, 'slice', { d: 0.42 });
  return { html };
}
