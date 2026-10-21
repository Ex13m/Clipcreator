// VENUE · Líheň Liběchov (místo konání MČR 2026) · plan A bars 8–13 (6 bars, the DROP lands on bar 0)
// Concept A „Od pramene k mistrovství“ (research/venue_ad.md): place → fish → title, one camera move per bar, all real assets.
// Brand world (lihenlibechov.cz CSS + logo): turquoise #17a1c8 · navy #1a212e · aqua #9ae7e8 · gold #d8af64; display Bitter (logo slab),
// kickers Montserrat 800 italic uppercase (web header).
//   bar 0    DROP: Malý Sporťáček as a floating 3D island slams in (white flash, shockwave, caustics on the water only, light sweep);
//            MÍSTO KONÁNÍ · MČR 2026 / LÍHEŇ LIBĚCHOV (VO „Hostí nás Líheň Liběchov“) → camera dives into the pond
//   bar 1    real drone flyover (drone/final → newest draft) arriving at the pond; gold pin glued to the pond + chip
//            „Malý Sporťáček · 24.–25. 10.“; push-in into the pond
//   bar 2    heritage: the logo's etched trout engraves itself on navy, PSTRUŽÍ LÍHEŇ OD ROKU + gold 1934 (digits rise from the mask, VO „1934“),
//            „Založil Karel Stutzig“; the etching dives at the camera
//   bar 3–4  underwater: caustics, light shafts, bubbles; the rainbow trout (pstruh duhový, fish_ai) swims in as a macro, light sweeps
//            along the spots; claim words light up with the VO; 164 m n. m. joins (never without „donedávna“)
//   bar 5    payoff: the trout darts off, the MČR 2026 trophy rises from the water in gold light; 24.–25. 10. 2026 +
//            logo badge + lihenlibechov.cz; clean poster, liquid blob out
// Reel: hook = „Kde se rozhodne o mistrovi ČR?“ over the arena lens; end card = underwater world + fx.endCard lockup.
import path from 'node:path';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import * as fx from '../lib/fx.mjs';
import * as V from '../lib/fx_venue.mjs';
import { ffDur, exists } from '../lib/util.mjs';

const { TURQ, NAVY, AQUA, GOLD, DEEP } = V.C;
export const theme = { bg: NAVY, bg2: DEEP, fg: '#ffffff', accent: TURQ, accent2: GOLD, aqua: AQUA, font: { display: 'Bitter', text: 'Montserrat' }, wght: 900, upper: true, light: false };
export const meta = {
  reel: true,
  hook: { headline: 'Kde se rozhodne o mistrovi ČR?', sub: '24.–25. 10. 2026' },
  endCard: { logo: 'on_dark', line: 'Partner MČR v Trout Area 2026' },
};

const KICK = { font: 'Montserrat', wght: 800, italic: true, upper: true };
const px = (n) => `${Math.round(n * 10) / 10}px`;

// pond (Malý Sporťáček) centroid in the drone flyover, tracked offline on the rendered v1 frames: [media s, x/W, y/H]
const POND = [[1.5, 0.852, 0.581], [1.7, 0.816, 0.573], [1.9, 0.769, 0.566], [2.1, 0.719, 0.559], [2.3, 0.666, 0.553], [2.5, 0.615, 0.55], [2.7, 0.568, 0.548],
  [2.9, 0.529, 0.548], [3.1, 0.497, 0.549], [3.3, 0.473, 0.55], [3.5, 0.457, 0.553], [3.7, 0.448, 0.555], [3.9, 0.445, 0.556], [4.0, 0.445, 0.557]];
const pondAt = (m) => {
  if (m <= POND[0][0]) return [POND[0][1], POND[0][2]];
  for (let i = 0; i + 1 < POND.length; i++) { const [a, ax, ay] = POND[i], [b, bx, by] = POND[i + 1]; if (m <= b) { const k = (m - a) / (b - a); return [ax + (bx - ax) * k, ay + (by - ay) * k]; } }
  return [POND[POND.length - 1][1], POND[POND.length - 1][2]];
};

// drone: final delivery (data.video) wins; until it lands, the newest draft render drone/mesh/out/v<N>/ (reported as DRAFT).
// A file that is still being encoded (no moov atom → ffprobe 0 s) is skipped, so a half-written v<N+1> never blanks bar 1.
function droneOf(ctx) {
  const D = ctx.data;
  const ok = (r) => ctx.has(r) && ffDur(ctx.srcOf(r)) > 0.5;
  const draft = () => { try { return fs.readdirSync(ctx.srcOf('drone/mesh/out')).filter((v) => /^v\d+$/.test(v)).sort((a, b) => +b.slice(1) - +a.slice(1)).map((v) => `drone/mesh/out/${v}/${path.basename(D.video || 'flyover_9x16.mp4')}`).find(ok) || null; } catch { return null; } };
  const video = D.video && ok(D.video) ? D.video : draft();
  if (!video) return null;
  return { video, vdur: ffDur(ctx.srcOf(video)), draft: video !== D.video };
}
function lastFrame(ctx, video) {
  const rel = `assets_prep/libechov/venue/_drone_${video.split('/').slice(-2, -1)[0]}_last.jpg`;
  const dst = ctx.srcOf(rel);
  try { if (!exists(dst) || fs.statSync(dst).mtimeMs < fs.statSync(ctx.srcOf(video)).mtimeMs) execFileSync('ffmpeg', ['-v', 'error', '-y', '-sseof', '-0.15', '-i', ctx.srcOf(video), '-frames:v', '1', '-q:v', '2', dst]); return rel; } catch { return null; }
}

// underwater world (bars 3–5 and the Reel end card): depth gradient, caustics from the surface, light shafts
function water(ctx, { id = 'wt', t0 = 0, t1 = ctx.dur, caus = 0.3 } = {}) {
  let h = `<div class="fx-full" style="background:linear-gradient(180deg,#22aed5 0%,${DEEP} 34%,#0e3a52 70%,${NAVY} 100%)"></div>`;
  h += V.caustics(ctx, { id: `${id}c`, opacity: caus, size: 700, t0, t1, speed: 46, mask: 'linear-gradient(180deg,#000 0%,rgba(0,0,0,.7) 35%,transparent 72%)' });
  h += V.shafts(ctx, { id: `${id}s`, n: 4, t0, t1, seed: 5 });
  return h;
}

// ======================================================================================
// HOOK (Reel, 1 bar): the arena from above + the question; the block answers it
// ======================================================================================
export function hook(ctx) {
  const L = ctx.safe.left, CW = ctx.W - L - ctx.safe.right;
  let html = '', css = V.css(ctx);
  html += fx.field(ctx, { kind: 'radial', c1: '#2bb6dc', c2: DEEP, at: '50% 62%' });
  html += V.caustics(ctx, { id: 'hc', opacity: 0.12, size: 640, speed: 50 });
  html += fx.glow(ctx, { id: 'hg', x: ctx.W / 2, y: 1140, size: 1150, color: AQUA, opacity: 0.45 });
  // question first (its height decides where the arena lens sits). Frame 0 is the Reel thumbnail → the question and the lens are
  // already there and only SETTLE (scale), nothing slides in from an empty frame.
  const H = fx.headline(ctx, { id: 'hh', text: ctx.module.meta.hook.headline, x: L, y: 400, w: CW, maxLines: 3, font: 'Bitter', wght: 900, upper: true, lh: 0.94, sizes: [124, 116, 108, 100, 92, 84], style: 'filter:drop-shadow(0 6px 16px rgba(16,40,60,.35))' });
  ctx.tl.set(H.sel, { transformOrigin: '0% 50%' }, 0);
  ctx.tl.fromTo(H.sel, { scale: 1.08 }, { scale: 1, duration: 0.7, ease: 'expo.out' }, 0);
  const yS = 400 + H.h + 34, top = yS + 44 + 52;
  const D = Math.min(760, 1700 - top), cx = ctx.W / 2, cy = top + D / 2;
  html += `<div class="fx-abs" id="${ctx.id('hd')}" style="left:${px(cx - D / 2)};top:${px(cy - D / 2)};width:${D}px;height:${D}px;border-radius:50%;box-shadow:0 40px 90px rgba(10,30,45,.45),0 0 0 6px rgba(255,255,255,.9),0 0 0 14px rgba(154,231,232,.35)"><img class="fx-img" src="${ctx.asset(V.A.disc)}" alt="" style="object-fit:contain"></div>`;
  ctx.tl.fromTo(ctx.sel('hd'), { scale: 1.22, rotation: -16 }, { scale: 1, rotation: 0, duration: 0.8, ease: 'expo.out' }, 0);
  html += `<div class="fx-abs" id="${ctx.id('hpw')}" style="left:${px(cx)};top:${px(cy + 10)}">${V.pin(ctx, { id: 'hp', size: 76 })}</div>`;
  ctx.tl.fromTo(ctx.sel('hp-m'), { y: -160, opacity: 0, scale: 0.6 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2.2)' }, ctx.beat(1) - 0.12);
  [ctx.beat(1), ctx.beat(2), ctx.beat(3)].forEach((t) => ctx.tl.hit(ctx.sel('hp-r'), { scale: 0.3, opacity: 1 }, { scale: 1.7, opacity: 0, duration: 0.42, ease: 'power2.out' }, t));
  html += H.html;
  html += fx.headline(ctx, { id: 'hs', text: ctx.module.meta.hook.sub, x: L, y: yS, w: CW, maxLines: 1, ...KICK, size: 40, tracking: 0.12, color: NAVY, t: 0.08, reveal: 'fade', d: 0.35 }).html;
  fx.tOut(ctx, 'flash', { color: '#ffffff', d: 0.14 });
  return { html, css };
}

// ======================================================================================
// END CARD (Reel, 2 bars)
// ======================================================================================
export function endCard(ctx) {
  let html = water(ctx, { id: 'ew', caus: 0.24 });
  const E0 = V.etch(ctx, { id: 'eet', x: 430, y: 760, h: 1000, color: AQUA, opacity: 0.14 });
  html += E0.html;
  ctx.tl.fromTo(ctx.sel('eet'), { x: 0, y: 0 }, { x: -40, y: -30, duration: ctx.dur, ease: 'sine.inOut' }, 0);
  V.reveal(ctx, 'eet', 0, { d: 0.9, dir: 'up', ease: 'expo.out' });                 // the etching draws itself on the downbeat
  html += V.bubbles(ctx, { id: 'eb', n: 8, t0: 0, t1: ctx.dur, box: [80, 1000, 920, 700], seed: 9, op: 0.6 });
  // integration seam fix (like the other sponsors' end cards): hard cut, no flash; the TA plate flies OVER the block's blob-out
  // (plate.hero from −0.42 s) and lands on the downbeat, the lockup is complete on frame 1 and only settles — was ~0.3 s of navy
  // (blob) + 0.22 s navy flash + ~0.3 s of empty water before the lockup faded in
  const E = fx.endCard(ctx, { t: 0, plateT: -0.42, plateFly: 0.42, ease: 'power3.inOut', settle: true, logo: 'on_dark', url: ctx.data.url, line: meta.endCard.line, fg: '#ffffff', accent: GOLD, font: 'Bitter', textFont: 'Montserrat', scale: 1.5 });
  html += E.html;
  html += fx.headline(ctx, { id: 'ex', text: 'Místo konání MČR · 24.–25. 10. 2026', x: ctx.safe.left, y: 1318, w: ctx.W - ctx.safe.left - ctx.safe.right, maxLines: 1, ...KICK, size: 34, tracking: 0.1, color: AQUA, align: 'center', t: 0.12, reveal: 'fade', d: 0.4 }).html;
  return { html, css: V.css(ctx) };
}

// ======================================================================================
// BLOCK
// ======================================================================================
export default function venue(ctx) {
  const D = ctx.data, { bar, W, H } = ctx;
  const L = ctx.safe.left, CW = W - L - ctx.safe.right;
  const B1 = bar(1), B2 = bar(2), B3 = bar(3), B4 = bar(4), B5 = bar(5), END = ctx.dur;
  const vo = (q, d, lo = 0, hi = END) => Math.min(hi, Math.max(lo, ctx.snap(ctx.vo.at(q) ?? d, 'beat')));
  let html = '', css = V.css(ctx);
  // big assets staged at full resolution (dive / macro push-ins)
  ctx.asset(V.A.island, { maxSide: 1900 }); ctx.asset(V.A.trout, { maxSide: 2200 });

  // =============== bar 0 · DROP: the island ===============
  let s0 = fx.field(ctx, { id: 'f0', kind: 'radial', c1: '#34bde2', c2: DEEP, at: '50% 60%' });
  s0 += V.caustics(ctx, { id: 'c0', opacity: 0.1, size: 620, t0: 0, t1: B1, speed: 60 });
  s0 += fx.glow(ctx, { id: 'g0', x: W / 2, y: 1110, size: 1200, color: AQUA, opacity: 0.5 });
  s0 += `<div class="vn-ring" id="${ctx.id('shk')}" style="left:${px(W / 2 - 420)};top:${px(1190 - 230)};width:840px;height:460px;--rc:#ffffff"></div>`;
  ctx.tl.fromTo(ctx.sel('shk'), { scale: 0.35, opacity: 0.9 }, { scale: 1.9, opacity: 0, duration: 0.85, ease: 'power2.out' }, 0.02);
  const I = V.island(ctx, { id: 'isl', cx: W / 2, cy: 1150, w: 770, t0: 0, t1: B1 });
  s0 += I.html;
  ctx.tl.fromTo(I.sel, { scale: 1.24, y: -50 }, { scale: 1, y: 0, duration: 0.6, ease: 'expo.out' }, 0);
  ctx.tl.fromTo(I.tl, { rotationX: 38, rotationZ: -8 }, { rotationX: 20, rotationZ: 2, duration: 1.45, ease: 'power2.out' }, 0);
  ctx.tl.fromTo(I.tl, { rotationX: 20, rotationZ: 2 }, { rotationX: 0, rotationZ: 4, duration: B1 - 1.45, ease: 'power2.in' }, 1.45);
  ctx.tl.fromTo(I.cam, { y: 0 }, { y: -16, duration: 0.9, ease: 'sine.inOut' }, 0.55);
  ctx.tl.set(I.cam, { transformOrigin: '50% 47%' }, 0);
  fx.ramp(ctx, I.cam, B1 - 0.36, B1, { from: { scale: 1 }, to: { scale: 3.3 } });                 // dive into the pond
  fx.sweep(ctx, 'isl', 0.5, { d: 0.95 });
  s0 += fx.headline(ctx, { id: 'k0', text: 'Místo konání · MČR 2026', x: L, y: 428, maxLines: 1, ...KICK, size: 34, tracking: 0.14, color: NAVY, t: 0.06, reveal: 'chars', stagger: 0.012, d: 0.45 }).html;
  html += fx.scene(ctx, 's0', 0, B1, s0, { outD: 0.001 });

  // =============== bar 1 · the real place (drone) ===============
  const DR = droneOf(ctx);
  const span = B2 - B1;
  let ms = 0, vd = span, still = null;
  if (DR) {
    ms = Math.max(0, DR.vdur - span); vd = Math.min(span, DR.vdur - ms);
    if (vd < span - 0.05) still = lastFrame(ctx, DR.video);
    ctx.report(`drone ${DR.video}${DR.draft ? ' (DRAFT — final drone/final/ missing)' : ''} ${DR.vdur}s · media ${ms.toFixed(2)}–${(ms + vd).toFixed(2)} s on bar 1${still ? ' + held last frame' : ''}`);
  } else ctx.report(`drone missing → aerial lens ${path.basename(V.A.disc)}`);
  const m2t = (m) => B1 + (m - ms);                                                          // drone media time → block time
  const p0 = pondAt(ms), p1 = pondAt(ms + span), pEnd = pondAt(ms + span - 0.2);
  let dv = '';
  if (DR) {
    if (still) dv += ctx.img(still, { id: 'dst' });
    dv += `<video id="${ctx.id('drone')}" class="clip fx-video" src="${ctx.asset(DR.video)}" muted playsinline data-start="${B1.toFixed(3)}" data-duration="${vd.toFixed(3)}" data-media-start="${ms.toFixed(3)}" data-hf-media-start-basis="local" data-track-index="1" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></video>`;
  } else dv += fx.photo(ctx, { id: 'dph', src: 'assets_prep/venue/ads/h1_arena_aerial.jpg', kb: { from: { scale: 1.15 }, to: { scale: 1.0 }, t0: B1, t1: B2 } });
  // pin glued to the pond (inside the zoom layers → it rides the dive)
  const keys = DR ? POND.filter(([m]) => m > ms + 0.05 && m < ms + span - 0.05).map(([m, x, y]) => [+m2t(m).toFixed(3), +(x * W).toFixed(1), +(y * H).toFixed(1)]) : [];
  keys.unshift([B1, p0[0] * W, p0[1] * H]); keys.push([B2, p1[0] * W, p1[1] * H]);
  if (!DR) keys.splice(0, keys.length, [B1, W * 0.5, H * 0.5], [B2, W * 0.5, H * 0.5]);
  dv += V.pin(ctx, { id: 'pin', size: 74 });
  V.track(ctx, ctx.sel('pin'), keys);
  const tPin = ctx.at(1, 1);
  ctx.tl.fromTo(ctx.sel('pin-m'), { y: -170, opacity: 0, scale: 0.6 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2.2)' }, tPin - 0.1);
  [tPin + 0.06, ctx.at(1, 2), ctx.at(1, 3)].forEach((t) => ctx.tl.hit(ctx.sel('pin-r'), { scale: 0.3, opacity: 1 }, { scale: 1.6, opacity: 0, duration: 0.36, ease: 'power2.out' }, t));
  let s1 = `<div class="fx-full" id="${ctx.id('dw')}"><div class="fx-full" id="${ctx.id('dz')}">${dv}</div></div>`;
  ctx.tl.set(ctx.sel('dw'), { transformOrigin: `${(p0[0] * 100).toFixed(1)}% ${(p0[1] * 100).toFixed(1)}%` }, 0);
  ctx.tl.fromTo(ctx.sel('dw'), { scale: 1.32 }, { scale: 1, duration: 0.8, ease: 'expo.out' }, B1);
  ctx.tl.set(ctx.sel('dz'), { transformOrigin: `${(pEnd[0] * 100).toFixed(1)}% ${(pEnd[1] * 100).toFixed(1)}%` }, 0);
  fx.ramp(ctx, ctx.sel('dz'), B2 - 0.4, B2, { from: { scale: 1 }, to: { scale: 2.5 } });         // push into the pond
  // grade: brand turquoise in the shadows + scrims for the type
  s1 += `<div class="fx-full" style="background:${TURQ};mix-blend-mode:soft-light;opacity:.38"></div>`;
  s1 += `<div class="fx-full" style="background:linear-gradient(180deg,rgba(26,33,46,.82) 0%,rgba(26,33,46,.45) 22%,rgba(26,33,46,0) 40%,rgba(26,33,46,0) 58%,rgba(26,33,46,.6) 78%,rgba(26,33,46,.9) 100%)"></div>`;
  const tChip = tPin;
  s1 += fx.chip(ctx, { id: 'ch', label: 'Rybník MČR', value: 'Malý Sporťáček · 24.–25. 10.', x: L, y: 1300, tone: 'dark', accent: GOLD, t: tChip, font: 'Montserrat', vs: 44, ls: 20 });
  html += fx.scene(ctx, 's1', B1 - 0.003, B2, s1, { inD: 0.001, outD: 0.001 });

  // =============== bar 2 · heritage 1934 ===============
  let s2 = fx.field(ctx, { id: 'f2', kind: 'radial', c1: '#26354d', c2: '#0f141c', at: '62% 46%' });
  const E = V.etch(ctx, { id: 'et', x: 330, y: 380, h: 1240, color: '#ffffff', opacity: 0.3 });
  s2 += E.html;
  V.reveal(ctx, 'et', B2 - 0.04, { d: 0.95, dir: 'up', ease: 'expo.out' });
  ctx.tl.set(ctx.sel('et'), { transformOrigin: '30% 30%' }, 0);
  ctx.tl.fromTo(ctx.sel('et'), { scale: 1 }, { scale: 1.06, duration: B3 - 0.32 - B2, ease: 'sine.inOut' }, B2);
  ctx.tl.fromTo(ctx.sel('et'), { scale: 1.06, opacity: 0.3 }, { scale: 2.6, opacity: 0, duration: 0.32, ease: 'power3.in' }, B3 - 0.32);
  // 1934: digits rise out of their line mask (stagger) — no rolling counter: an odometer shows 4–5 frames of digit soup („5500“,
  // „9613“) on the cut. Starts 0.12 s before the cut, so the downbeat frame already shows „19“ rising (cut into motion);
  // fully set ~4.1 s while the VO says „1934“ (3.9–5.4 s).
  const tYr = B2 - 0.12;
  const ySz = Math.min(360, Math.floor(880 / Math.max(1e-3, ctx.measure('1934', { font: 'Bitter', wght: 900, size: 1 }))));
  let hx = fx.headline(ctx, { id: 'k2', text: 'Pstruží líheň od roku', x: L, y: 650, maxLines: 1, ...KICK, size: 46, tracking: 0.1, color: AQUA, t: B2 - 0.1, reveal: 'chars', stagger: 0.012, d: 0.4 }).html;
  hx += fx.headline(ctx, { id: 'yr', text: '1934', x: L - 8, y: 712, w: CW + 8, maxLines: 1, size: ySz, font: 'Bitter', wght: 900, lh: 1, color: GOLD, t: tYr, reveal: 'chars', stagger: 0.06, d: 0.5, style: 'filter:drop-shadow(0 18px 30px rgba(0,0,0,.35))' }).html;
  hx += `<div class="fx-abs" id="${ctx.id('rule')}" style="left:${L}px;top:${712 + ySz * 1.02}px;width:420px;height:6px;border-radius:3px;background:${GOLD};transform-origin:0 50%"></div>`;
  ctx.tl.fromTo(ctx.sel('rule'), { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'expo.out' }, tYr + 0.35);
  hx += fx.headline(ctx, { id: 'cap', text: 'Založil Karel Stutzig', x: L, y: 712 + ySz * 1.02 + 34, maxLines: 1, font: 'Montserrat', wght: 600, italic: true, size: 40, color: '#ffffff', t: tYr + 0.45, reveal: 'lines', d: 0.5 }).html;
  s2 += `<div class="fx-full" id="${ctx.id('hx')}">${hx}</div>`;
  ctx.tl.fromTo(ctx.sel('hx'), { opacity: 1, y: 0 }, { opacity: 0, y: -40, duration: 0.24, ease: 'power2.in' }, B3 - 0.3);
  html += fx.scene(ctx, 's2', B2 - 0.003, B3, s2, { inD: 0.001, outD: 0.001 });

  // =============== bars 3–5 · underwater: the trout, the claim, the trophy ===============
  let s3 = `<div class="fx-full" id="${ctx.id('uw')}">${water(ctx, { id: 'uw', t0: B3, t1: END })}</div>`;
  ctx.tl.fromTo(ctx.sel('uw'), { scale: 1.2 }, { scale: 1, duration: 0.9, ease: 'expo.out' }, B3);
  s3 += V.bubbles(ctx, { id: 'bu', n: 12, t0: B3, t1: END, box: [60, 900, 960, 900], seed: 4 });
  // trophy light (bar 5)
  s3 += `<div class="fx-full" id="${ctx.id('gl')}">${fx.rays(ctx, { id: 'gr', x: W / 2, y: 820, size: 2000, color: 'rgba(216,175,100,1)', n: 22, duty: 0.3, opacity: 0.32, spin: 12, t0: B5, t1: END, hole: 0.08 })}${fx.glow(ctx, { id: 'gg', x: W / 2, y: 880, size: 1150, color: 'rgba(216,175,100,.85)', opacity: 0.55 })}</div>`;
  ctx.tl.fromTo(ctx.sel('gl'), { opacity: 0 }, { opacity: 1, duration: 0.7, ease: 'power2.out' }, B5 - 0.1);
  // the trout: macro swim-through, tail off-frame (pad = transparent margins of fish_rainbow_a_cut.png, 1310×459)
  const TR = fx.product(ctx, { id: 'tr', src: V.A.trout, w: 1500, cx: 30 + 750, cy: 1035, ground: 'none', sweep: true, sweepAngle: 98, sweepOpacity: 0.5, pad: [0.009, 0.026, 0.01, 0.028] });
  const trUrl = ctx.asset(V.A.trout);
  s3 += TR.html.replace(`id="${ctx.id('tr-im')}" src="${trUrl}" alt="">`, `id="${ctx.id('tr-im')}" src="${trUrl}" alt="">${V.skin(ctx, { id: 'trs', src: V.A.trout, w: TR.w, h: TR.h, caus: 0.22, tintO: 0.32, size: 560, t0: B3, t1: END })}`);
  ctx.tl.fromTo(TR.sel, { x: 1050 }, { x: 0, duration: 1.15, ease: 'expo.out' }, B3 - 0.16);     // head already in frame on the cut
  ctx.tl.fromTo(TR.cam, { x: 0, y: 0, rotation: 0 }, { x: -60, y: -18, rotation: -1.6, duration: B5 - 0.3 - (B3 + 0.6), ease: 'sine.inOut' }, B3 + 0.6);
  ctx.tl.set(TR.cam, { transformOrigin: '22% 42%' }, 0);
  ctx.tl.fromTo(TR.cam, { scale: 1 }, { scale: 1.07, duration: B5 - 0.3 - (B3 + 0.6), ease: 'sine.inOut' }, B3 + 0.6);
  fx.tilt(ctx, 'tr', B3, B5, { ry: 7, rx: 2 });
  fx.sweep(ctx, 'tr', B3 + 0.85, { d: 1.0 });
  fx.sweep(ctx, 'tr', B4 + 0.25, { d: 1.0 });
  ctx.tl.fromTo(TR.sel, { x: 0 }, { x: -1950, duration: 0.44, ease: 'power3.in' }, B5 - 0.5);       // darts off → gone before the beat
  ctx.tl.set(ctx.sel('tr-im'), { filter: 'blur(6px)' }, B5 - 0.36);
  // claim: words light up with the VO (both parts of the fact always together, „donedávna“ first)
  const tClaim = Math.min(B3 + 0.1, vo('donedávna', B3, B3 - 0.1, B3 + 0.5) - 0.12);
  // dim words at .32 vanished into the caustics → .5 keeps the whole sentence readable, the spoken word still lights up
  const K = V.karaoke(ctx, { id: 'kl', text: 'Donedávna nejníže položené pstruhařství v Evropě', x: L, y: 418, w: CW, maxLines: 3, sizes: [104, 98, 92, 86, 80], font: 'Bitter', wght: 800, lh: 1.0, t: tClaim, dim: 0.5, times: (tok) => V.voTimes(ctx, tok, { from: B3 - 0.4, fallback: tok.map((_, i) => B3 + 0.2 + i * 0.6) }), style: 'filter:drop-shadow(0 6px 18px rgba(8,30,44,.5))' });
  s3 += K.html;
  ctx.tl.fromTo(`${K.sel} .fx-ln > span`, { yPercent: 0, opacity: 1 }, { yPercent: -125, opacity: 0, duration: 0.3, ease: 'power3.in', stagger: 0.04 }, B5 - 0.4);
  // 164 m n. m. (joins on bar 4, under the claim) — digits rise from the mask (no rolling counter), set on the downbeat
  const t164 = B4 - 0.1, aSz = 230, aY = 1196;
  const aW = ctx.measure('164', { font: 'Bitter', wght: 900, size: aSz });
  let al = fx.headline(ctx, { id: 'alt', text: '164', x: L - 6, y: aY, w: aW + 40, maxLines: 1, size: aSz, font: 'Bitter', wght: 900, lh: 1, color: GOLD, t: t164, reveal: 'chars', stagger: 0.06, d: 0.5 }).html;
  al += fx.headline(ctx, { id: 'altu', text: 'm n. m.', x: L - 6 + aW + 22, y: aY + aSz * 0.5, w: 400, maxLines: 1, font: 'Montserrat', wght: 800, italic: true, size: 66, color: AQUA, t: t164 + 0.2, reveal: 'lines', d: 0.5 }).html;
  s3 += `<div class="fx-full" id="${ctx.id('al')}">${al}</div>`;
  ctx.tl.fromTo(ctx.sel('al'), { opacity: 1, y: 0 }, { opacity: 0, y: 40, duration: 0.25, ease: 'power2.in' }, B5 - 0.4);
  // the trophy rises from the water (bar 5): starts before the beat → solid and in place ON the downbeat (was half-transparent
  // behind the departing trout = a muddy dissolve frame on the hit)
  // gold glint: the stock sweep band (72 % of the width, .85 screen) bleached the whole cup for ~0.4 s right on the lockup →
  // narrow band (44–56 %), .6, timed on the arrival so the finished poster is clean
  const CUP = fx.product(ctx, { id: 'cup', src: V.A.trophy, h: 770, cx: W / 2, floor: 1178, ground: 'none', sweep: true, sweepAngle: 115, sweepOpacity: 0.6, pad: [0.027, 0.019, 0.027, 0.019] });
  css += `${ctx.S} ${ctx.sel('cup-sw')}{background-image:linear-gradient(var(--sa,105deg),transparent 44%,rgba(255,255,255,.95) 50%,transparent 56%)}`;
  s3 += CUP.html;
  fx.productIn(ctx, 'cup', B5 - 0.22, { from: 'rise', d: 0.8, dist: 820 });
  fx.sweep(ctx, 'cup', B5 + 0.12, { d: 0.85 });
  ctx.tl.fromTo(CUP.cam, { y: 0 }, { y: -12, duration: END - (B5 + 0.9), ease: 'sine.inOut' }, B5 + 0.9);
  const tD = ctx.at(5, 1) - 0.16;
  s3 += fx.headline(ctx, { id: 'dt', text: '24.–25. 10. 2026', x: L, y: 1206, w: CW, maxLines: 1, font: 'Bitter', wght: 900, size: 88, align: 'center', color: '#ffffff', t: tD, reveal: 'lines', d: 0.5, style: 'filter:drop-shadow(0 6px 16px rgba(0,0,0,.35))' }).html;
  // lockup: venue badge (≤ TA logo) + URL — lands one beat after the date, so the finished poster holds ≥ 0.6 s before the blob
  const tLk = ctx.at(5, 1) + 0.06;
  const LG = ctx.logo('on_dark', { box: [128, 128], at: [tLk, END], id: 'logo', label: 'venue lockup badge' });
  const uSz = 54, uW = ctx.measure(D.url, { font: 'Montserrat', wght: 800, italic: true, size: uSz });
  const rowW = LG.w + 22 + uW, rx = (W - rowW) / 2;
  s3 += `<div class="fx-abs" id="${ctx.id('lk')}" style="left:${px(rx)};top:1312px;width:${px(rowW + 10)};height:${LG.h}px;display:flex;align-items:center;gap:22px">${LG.html}<span style="font:italic 800 ${uSz}px/1 'Montserrat';color:#fff;white-space:nowrap;text-shadow:0 4px 18px rgba(0,0,0,.35)">${ctx.esc(D.url)}</span></div>`;
  ctx.tl.fromTo(ctx.sel('lk'), { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' }, tLk);
  html += fx.scene(ctx, 's3', B3 - 0.003, END, s3, { inD: 0.001 });

  // =============== title layer: LÍHEŇ LIBĚCHOV rides across the drop and the first cut ===============
  const tName = Math.min(0.42, vo('Líheň', 0.93, 0.3, 1.0) - 0.5);
  const N = fx.headline(ctx, { id: 'nm', text: D.name, x: L, y: 480, w: CW, maxLines: 2, font: 'Bitter', wght: 900, upper: true, lh: 0.92, sizes: [160, 152, 144, 136], t: tName, reveal: 'chars', stagger: 0.03, d: 0.55, out: ctx.at(1, 1) - 0.14, outD: 0.3, style: 'filter:drop-shadow(0 8px 18px rgba(16,40,60,.38))' });
  html += fx.scene(ctx, 'ttl', 0, ctx.at(1, 1) + 0.25, N.html, { outD: 0.05 });
  fx.chroma(ctx, N.sel, B1, { amt: 9, d: 0.4 });

  // =============== accents + transitions ===============
  // Every downbeat must show the new picture, not a wash: the old flashes (white .5 normal on the drone cut, aqua .75 screen
  // into the water, gold .26 on the trophy) and the .32 s white tIn turned the drop and three cuts into grey/pale empty frames.
  fx.flash(ctx, B1, { id: 'fl1', color: '#ffffff', peak: 0.2, d: 0.14, blend: 'screen' });
  fx.flash(ctx, B3, { id: 'fl3', color: AQUA, peak: 0.28, d: 0.3, blend: 'screen' });
  fx.flash(ctx, B4, { id: 'fl4', color: AQUA, peak: 0.14, d: 0.3, blend: 'screen' });
  fx.flash(ctx, B5, { id: 'fl5', color: GOLD, peak: 0.12, d: 0.4, blend: 'screen' });
  fx.tIn(ctx, 'flash', { color: '#ffffff', d: 0.12 });            // the intro zooms through to white → 1 white frame, the island hits by frame 3
  fx.tOut(ctx, 'blob', { d: 0.4 });                               // liquid out into the next world
  return { html, css };
}
