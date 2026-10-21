// VENUE · Líheň Liběchov (místo konání MČR 2026) · plan B bars 8–15 (8 bars, the DROP lands on bar 0) · v3 (21. 10.)
// VO (vo/venue.wav): „Mistrovství hostí Líheň Liběchov – pstruží líheň od roku 1934, donedávna nejníže položené pstruhařství v Evropě.
// Závodí se na rybníku Malý Sporťáček.“ Every picture follows the sentence it illustrates:
//   bars 0–1  DROP: the approved v2 drone flyover (drone/final) · MÍSTO KONÁNÍ · MČR 2026 / LÍHEŇ LIBĚCHOV (VO 1.3 s) →
//             „Pstruží líheň od roku“ (VO 2.8 s); the camera pushes into the pond on the cut
//   bar 2     heritage: etched trout from the logo + gold 1934 (VO 4.4 s) + „Založil Karel Stutzig“
//   bars 3–4  AI rainbow trout LEAPING with a flip (scene_leap2_d, ≠ the landing-net frame of the b-roll); the claim „Donedávna nejníže
//             položené pstruhařství v Evropě“ lights up word by word on the WATER under a dark scrim (never over the body/head) + 164 m n. m.
//   bars 5–6  „Závodí se na rybníku Malý Sporťáček“: hard cut back to the drone's last frame, the white+red plan of the pond draws itself
//             ON the real pond (AR fit, lib/fx_venue AR), then tilts to a clean top-down plan; places 1→20 and 21→40 pop in on the beats,
//             dimension callouts 50 m / 40 m, chips 0,2 ha · hloubka 1,5 m (lihenlibechov.cz), „40 závodních míst“ in the pond
//   bar 7     lockup: the plan shrinks up, venue badge (≤ TA) + lihenlibechov.cz + „Místo konání · MČR 2026“ (TA chip) + date; NO prize chip
//             (role host); liquid blob out into Gausse Holler
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
  endCard: { logo: 'on_dark', line: 'Místo konání MČR 2026' },
  role: 'host',
};

const KICK = { font: 'Montserrat', wght: 800, italic: true, upper: true };
const px = (n) => `${Math.round(n * 10) / 10}px`;

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
  try { if (!exists(dst) || fs.statSync(dst).mtimeMs < fs.statSync(ctx.srcOf(video)).mtimeMs) execFileSync('ffmpeg', ['-v', 'error', '-y', '-sseof', '-0.05', '-i', ctx.srcOf(video), '-frames:v', '1', '-q:v', '2', dst]); return rel; } catch { return null; }
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
const RED = '#e31e24';
export default function venue(ctx) {
  const D = ctx.data, { bar, W } = ctx;
  const L = ctx.safe.left, CW = W - L - ctx.safe.right;
  const B2 = bar(2), B3 = bar(3), B4 = bar(4), B5 = bar(5), B6 = bar(6), B7 = bar(7), END = ctx.dur;
  const vo = (q, d, lo = 0, hi = END) => Math.min(hi, Math.max(lo, ctx.snap(ctx.vo.at(q) ?? d, 'beat')));
  let html = '', css = V.css(ctx);
  css += `${ctx.S} .vn-pill{position:absolute;height:56px;padding:0 24px;border-radius:28px;border:3px solid #fff;display:flex;align-items:center;gap:12px;font:800 32px/1 'Montserrat';color:#fff;white-space:nowrap;background:rgba(10,14,22,.35)}
${ctx.S} .vn-pill b{width:12px;height:12px;border-radius:50%;background:${RED}}
${ctx.S} .vn-dl{position:absolute;font:800 30px/1 'Montserrat';color:#fff;white-space:nowrap}`;

  // TA logo tone (explicit: the probe is stale after any change): drone / photo = scrim, dark worlds = dark
  ctx.plate.tone(0, B2, 'scrim'); ctx.plate.tone(B2, B3, 'dark'); ctx.plate.tone(B3, ctx.at(5, 2), 'scrim'); ctx.plate.tone(ctx.at(5, 2), END, 'dark');

  // =============== bars 0–1 · DROP: the real place (drone v2) ===============
  const DR = droneOf(ctx);
  const span = B2;
  let ms = 0, vd = span;
  const still = DR ? lastFrame(ctx, DR.video) : null;
  if (DR) {
    ms = Math.max(0, DR.vdur - span); vd = Math.min(span, DR.vdur - ms);
    ctx.report(`drone ${DR.video}${DR.draft ? ' (DRAFT — final drone/final/ missing)' : ''} ${DR.vdur}s · media ${ms.toFixed(2)}–${(ms + vd).toFixed(2)} s on bars 0–1 · last frame ${still} for the AR plan`);
  } else ctx.report(`drone missing → aerial photo`);
  let dv = '';
  if (DR) {
    if (still && vd < span - 0.05) dv += ctx.img(still, { id: 'dst' });
    dv += `<video id="${ctx.id('drone')}" class="clip fx-video" src="${ctx.asset(DR.video)}" muted playsinline data-start="0" data-duration="${vd.toFixed(3)}" data-media-start="${ms.toFixed(3)}" data-hf-media-start-basis="local" data-track-index="1" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></video>`;
  } else dv += fx.photo(ctx, { id: 'dph', src: 'assets_prep/venue/ads/h1_arena_aerial.jpg', kb: { from: { scale: 1.15 }, to: { scale: 1.0 }, t0: 0, t1: B2 } });
  let s1 = `<div class="fx-full" id="${ctx.id('dw')}"><div class="fx-full" id="${ctx.id('dz')}">${dv}</div></div>`;
  ctx.tl.set(ctx.sel('dw'), { transformOrigin: '50% 50%' }, 0);
  ctx.tl.fromTo(ctx.sel('dw'), { scale: 1.22 }, { scale: 1, duration: 0.85, ease: 'expo.out' }, 0);       // the drop punches the aerial in
  const pc = [(V.AR.cx + V.AR.x) / W, (V.AR.cy + V.AR.y) / ctx.H];                                       // pond centre in the last drone frame
  ctx.tl.set(ctx.sel('dz'), { transformOrigin: `${(pc[0] * 100).toFixed(1)}% ${(pc[1] * 100).toFixed(1)}%` }, 0);
  fx.ramp(ctx, ctx.sel('dz'), B2 - 0.4, B2, { from: { scale: 1 }, to: { scale: 2.5 } });                // push into the pond on the cut
  s1 += `<div class="fx-full" style="background:${TURQ};mix-blend-mode:soft-light;opacity:.3"></div>`;
  s1 += `<div class="fx-full" style="background:linear-gradient(180deg,rgba(14,20,30,.8) 0%,rgba(14,20,30,.62) 30%,rgba(14,20,30,.35) 44%,rgba(14,20,30,0) 56%,rgba(14,20,30,0) 80%,rgba(14,20,30,.45) 100%)"></div>`;
  html += fx.scene(ctx, 's1', 0, B2, s1, { outD: 0.001 });

  // =============== bar 2 · heritage 1934 ===============
  let s2 = fx.field(ctx, { id: 'f2', kind: 'radial', c1: '#26354d', c2: '#0f141c', at: '62% 46%' });
  const E = V.etch(ctx, { id: 'et', x: 330, y: 380, h: 1240, color: '#ffffff', opacity: 0.3 });
  s2 += E.html;
  V.reveal(ctx, 'et', B2 - 0.04, { d: 0.95, dir: 'up', ease: 'expo.out' });
  ctx.tl.set(ctx.sel('et'), { transformOrigin: '30% 30%' }, 0);
  ctx.tl.fromTo(ctx.sel('et'), { scale: 1 }, { scale: 1.06, duration: B3 - 0.32 - B2, ease: 'sine.inOut' }, B2);
  ctx.tl.fromTo(ctx.sel('et'), { scale: 1.06, opacity: 0.3 }, { scale: 2.6, opacity: 0, duration: 0.32, ease: 'power3.in' }, B3 - 0.32);
  // 1934: digits rise out of their line mask (no odometer: digit soup on the cut); starts 0.12 s before the cut (cut into motion)
  const tYr = Math.min(B2 - 0.12, vo('1934', B2) - 0.3);
  const ySz = Math.min(360, Math.floor(880 / Math.max(1e-3, ctx.measure('1934', { font: 'Bitter', wght: 900, size: 1 }))));
  let hx = fx.headline(ctx, { id: 'yr', text: '1934', x: L - 8, y: 712, w: CW + 8, maxLines: 1, size: ySz, font: 'Bitter', wght: 900, lh: 1, color: GOLD, t: tYr, reveal: 'chars', stagger: 0.06, d: 0.5, style: 'filter:drop-shadow(0 18px 30px rgba(0,0,0,.35))' }).html;
  hx += `<div class="fx-abs" id="${ctx.id('rule')}" style="left:${L}px;top:${712 + ySz * 1.02}px;width:420px;height:6px;border-radius:3px;background:${GOLD};transform-origin:0 50%"></div>`;
  ctx.tl.fromTo(ctx.sel('rule'), { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'expo.out' }, tYr + 0.35);
  hx += fx.headline(ctx, { id: 'cap', text: 'Založil Karel Stutzig', x: L, y: 712 + ySz * 1.02 + 34, maxLines: 1, font: 'Montserrat', wght: 600, italic: true, size: 40, color: '#ffffff', t: tYr + 0.45, reveal: 'lines', d: 0.5 }).html;
  s2 += `<div class="fx-full" id="${ctx.id('hx')}">${hx}</div>`;
  ctx.tl.fromTo(ctx.sel('hx'), { opacity: 1, y: 0 }, { opacity: 0, y: -40, duration: 0.24, ease: 'power2.in' }, B3 - 0.3);
  html += fx.scene(ctx, 's2', B2 - 0.003, B3, s2, { inD: 0.001, outD: 0.001 });

  // =============== bars 3–4 · the trout LEAPS with a flip + „donedávna…“ + 164 m n. m. ===============
  // scene_leap2_d (752×1344): fish body y ≈ 86–1000 in the 1080 frame (head 745–1000) → all type sits on the water under a scrim
  let s3 = `<div class="fx-full" id="${ctx.id('fw')}"><img class="fx-img" src="${ctx.asset(V.A.leap)}" alt="" style="object-fit:cover;object-position:50% 50%"></div>`;
  ctx.tl.set(ctx.sel('fw'), { transformOrigin: '50% 45%' }, 0);
  // the camera follows the leap: the frame rises with the fish and rolls through the flip, then breathes
  ctx.tl.fromTo(ctx.sel('fw'), { y: 190, scale: 1.24, rotation: -3.2 }, { y: 0, scale: 1.16, rotation: 0, duration: 0.95, ease: 'expo.out' }, B3 - 0.12);
  ctx.tl.fromTo(ctx.sel('fw'), { scale: 1.16, rotation: 0 }, { scale: 1.1, rotation: 1.3, duration: B5 - (B3 + 0.83), ease: 'sine.inOut' }, B3 + 0.83);
  s3 += `<div class="fx-full" style="background:linear-gradient(180deg,rgba(6,14,20,.35) 0%,rgba(6,14,20,0) 12%,rgba(6,14,20,0) 52%,rgba(6,14,20,.62) 58%,rgba(6,14,20,.84) 70%,rgba(6,14,20,.9) 100%)"></div>`;
  const tClaim = Math.min(B3 + 0.1, vo('donedávna', B3, B3 - 0.1, B3 + 0.5) - 0.12);
  const kY = 1040;
  const K = V.karaoke(ctx, { id: 'kl', text: 'Donedávna nejníže položené pstruhařství v Evropě', x: L, y: kY, w: CW, maxLines: 3, sizes: [88, 84, 80, 76, 72], font: 'Bitter', wght: 800, lh: 1.0, t: tClaim, dim: 0.45, times: (tok) => V.voTimes(ctx, tok, { from: B3 - 0.4, fallback: tok.map((_, i) => B3 + 0.2 + i * 0.6) }), style: 'filter:drop-shadow(0 4px 14px rgba(0,0,0,.6))' });
  s3 += K.html;
  ctx.tl.fromTo(`${K.sel} .fx-ln > span`, { yPercent: 0, opacity: 1 }, { yPercent: -125, opacity: 0, duration: 0.3, ease: 'power3.in', stagger: 0.04 }, B5 - 0.38);
  const t164 = B4 - 0.1, aSz = 116, aY = kY + K.h + 20;
  if (aY + aSz > 1460) ctx.warn(`164 m n. m. bottom ${Math.round(aY + aSz)} > Reels safe 1460`);
  const aW = ctx.measure('164', { font: 'Bitter', wght: 900, size: aSz });
  let al = fx.headline(ctx, { id: 'alt', text: '164', x: L - 4, y: aY, w: aW + 40, maxLines: 1, size: aSz, font: 'Bitter', wght: 900, lh: 1, color: GOLD, t: t164, reveal: 'chars', stagger: 0.06, d: 0.5 }).html;
  al += fx.headline(ctx, { id: 'altu', text: 'm n. m.', x: L - 4 + aW + 20, y: aY + aSz * 0.36, w: 400, maxLines: 1, font: 'Montserrat', wght: 800, italic: true, size: 56, color: AQUA, t: t164 + 0.2, reveal: 'lines', d: 0.5 }).html;
  s3 += `<div class="fx-full" id="${ctx.id('al')}" style="filter:drop-shadow(0 4px 14px rgba(0,0,0,.6))">${al}</div>`;
  ctx.tl.fromTo(ctx.sel('al'), { opacity: 1, y: 0 }, { opacity: 0, y: 40, duration: 0.25, ease: 'power2.in' }, B5 - 0.38);
  s3 += `<div class="fx-t" style="right:${ctx.safe.right}px;top:372px;font:600 20px/1 'Montserrat';color:rgba(255,255,255,.55);letter-spacing:.1em">AI ILUSTRACE</div>`;
  html += fx.scene(ctx, 's3', B3 - 0.003, B5, s3, { inD: 0.001, outD: 0.001 });

  // =============== bars 5–7 · Malý Sporťáček: AR overlay → clean plan → lockup ===============
  const AR = V.AR;
  let s5 = '';
  s5 += still ? `<div class="fx-full" id="${ctx.id('arb')}">${ctx.img(still, { id: 'ars' })}</div>` : fx.field(ctx, { id: 'arf', kind: 'solid', bg: NAVY });
  // the world darkens under the plan while it tilts up (venue navy, not a TA template)
  s5 += `<div class="fx-full" id="${ctx.id('ard')}" style="background:radial-gradient(120% 80% at 50% 48%,#1f2a3c 0%,${NAVY} 55%,#0e131b 100%)"></div>`;
  const tT0 = ctx.at(5, 1) - 0.06, tT1 = ctx.at(5, 2) + 0.2;                              // tilt window
  ctx.tl.fromTo(ctx.sel('ard'), { opacity: 0 }, { opacity: 1, duration: tT1 - tT0, ease: 'power2.inOut' }, tT0);
  // the plan: everything that belongs to the pond lives in #pl (shrinks for the lockup) › #sc (AR ↔ plan transform)
  const PS = V.pondScheme(ctx, { id: 'ps', red: RED });
  const bb = PS.bbox;
  // dimension callouts (web: „50 x 40 m“, lihenlibechov.cz/cs/aktualita/maly-sportacek) drawn to scale, outside the place numbers
  const dimX = bb.x0 - 74, len50 = 50 * PS.s, y50 = PS.cy - len50 / 2;
  const dimY = bb.y0 - 34, len40 = (bb.x1 - bb.x0), x40 = bb.x0;
  let dims = `<div class="fx-full" id="${ctx.id('dm')}">`;
  dims += `<div class="vn-dim" id="${ctx.id('dmv')}" style="left:${dimX - 1.5}px;top:${y50}px;width:3px;height:${len50}px"><i style="left:-11px;top:-1.5px;width:25px;height:3px"></i><i style="left:-11px;bottom:-1.5px;width:25px;height:3px"></i></div>`;
  dims += `<div class="vn-dl" id="${ctx.id('dmvl')}" style="left:${dimX - 44}px;top:${PS.cy - 15}px;width:88px;text-align:center;background:${NAVY};padding:6px 0;transform:rotate(-90deg)"><span id="${ctx.id('dmvt')}" style="display:inline-block">50 m</span></div>`;
  dims += `<div class="vn-dim" id="${ctx.id('dmh')}" style="left:${x40}px;top:${dimY - 1.5}px;width:${len40}px;height:3px"><i style="left:-1.5px;top:-11px;width:3px;height:25px"></i><i style="right:-1.5px;top:-11px;width:3px;height:25px"></i></div>`;
  dims += `<div class="vn-dl" id="${ctx.id('dmhl')}" style="left:${x40 + len40 / 2 - 50}px;top:${dimY - 18}px;width:100px;text-align:center;background:${NAVY};padding:3px 0"><span id="${ctx.id('dmht')}" style="display:inline-block">40 m</span></div>`;
  dims += '</div>';
  // „40 závodních míst“ inside the water
  const c40 = `<div class="fx-full" id="${ctx.id('c40')}"><div class="fx-t" id="${ctx.id('c40n')}" style="left:${PS.cx - 300}px;top:${PS.cy - 150}px;width:600px;text-align:center;font:900 230px/1 'Bitter';color:#fff;filter:drop-shadow(0 8px 24px rgba(0,0,0,.4))">40</div><div class="fx-t" id="${ctx.id('c40t')}" style="left:${PS.cx - 300}px;top:${PS.cy + 104}px;width:600px;text-align:center;font:italic 800 34px/1.05 'Montserrat';letter-spacing:.06em;color:#fff">ZÁVODNÍCH MÍST</div><div class="fx-abs" id="${ctx.id('c40r')}" style="left:${PS.cx - 60}px;top:${PS.cy + 80}px;width:120px;height:6px;border-radius:3px;background:${RED};transform-origin:50% 50%"></div></div>`;
  s5 += `<div class="fx-full" id="${ctx.id('pl')}"><div class="fx-full" id="${ctx.id('sc')}">${PS.html}${c40}</div>${dims}</div>`;
  // AR: plan sits on the real pond of the held last drone frame, then tilts to top-down (rotations → 0, scale → 1)
  const arFrom = { x: AR.x, y: AR.y, rotation: AR.rotation, rotationX: AR.rotationX, rotationY: AR.rotationY, scale: AR.scale };
  ctx.tl.set(ctx.sel('sc'), { transformOrigin: `${AR.cx}px ${AR.cy}px`, transformPerspective: AR.transformPerspective }, 0);
  ctx.tl.fromTo(ctx.sel('sc'), arFrom, { x: 0, y: 0, rotation: 0, rotationX: 0, rotationY: 0, scale: 1, duration: tT1 - tT0, ease: 'expo.inOut' }, tT0);
  // outline draws on over the real water edge (first beat), glow + fill follow
  ctx.tl.fromTo(PS.ol, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.inOut' }, B5 - 0.02);
  ctx.tl.fromTo(PS.gl, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.inOut' }, B5 + 0.02);
  ctx.tl.fromTo(PS.wf, { fillOpacity: 0 }, { fillOpacity: 0.22, duration: 0.3, ease: 'power2.out' }, B5 + 0.3);
  ctx.tl.fromTo(PS.wf, { fillOpacity: 0.22 }, { fillOpacity: 0.07, duration: 0.6, ease: 'power2.inOut' }, tT1 - 0.3);
  ctx.tl.fromTo(PS.iso, { opacity: 0 }, { opacity: 0.85, duration: 0.4, ease: 'power2.out' }, tT1 - 0.15);
  // places pop one by one, counting up: 1→20 over two beats from beat 5.2, 21→40 over the next two beats (each run starts on a beat)
  const run = (a, t0) => PS.places.filter((p) => p.n >= a && p.n < a + 20).forEach((p, i) => {
    const t = t0 + i * (2 * ctx.BEAT / 20);
    ctx.tl.fromTo(p.sel, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.28, ease: 'back.out(2.6)' }, t);
    ctx.tl.fromTo(p.tick, { opacity: 0 }, { opacity: 0.8, duration: 0.15, ease: 'none' }, t);
  });
  run(1, ctx.at(5, 2)); run(21, ctx.at(6, 0));
  // dimension callouts on beat 5.3
  const tDm = ctx.at(5, 3);
  ctx.tl.set(ctx.sel('dmv'), { transformOrigin: '50% 50%' }, 0); ctx.tl.set(ctx.sel('dmh'), { transformOrigin: '50% 50%' }, 0);
  ctx.tl.fromTo(ctx.sel('dmv'), { scaleY: 0 }, { scaleY: 1, duration: 0.55, ease: 'expo.out' }, tDm - 0.04);
  ctx.tl.fromTo(ctx.sel('dmh'), { scaleX: 0 }, { scaleX: 1, duration: 0.55, ease: 'expo.out' }, tDm - 0.04);
  ctx.tl.fromTo(ctx.sel('dmvl'), { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'none' }, tDm + 0.1);
  ctx.tl.fromTo(ctx.sel('dmhl'), { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'none' }, tDm + 0.1);
  ctx.tl.fromTo(ctx.sel('dmvt'), { scale: 0.6 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' }, tDm + 0.1);
  ctx.tl.fromTo(ctx.sel('dmht'), { scale: 0.6 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' }, tDm + 0.1);
  // „40 závodních míst“ when the second run completes (beat 6.2)
  const t40 = ctx.at(6, 2);
  ctx.tl.fromTo(ctx.sel('c40n'), { opacity: 0, scale: 1.5 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'expo.out' }, t40 - 0.06);
  ctx.tl.fromTo(ctx.sel('c40t'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, ease: 'expo.out' }, t40 + 0.08);
  ctx.tl.fromTo(ctx.sel('c40r'), { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'expo.out' }, t40 + 0.02);
  // title: kicker on „Závodí se na rybníku“, MALÝ SPORŤÁČEK on „Malý“
  const tKs = Math.max(ctx.at(5, 1), vo('Závodí', ctx.at(5, 1)) - 0.1);
  const tMs = Math.max(tKs + 0.6, vo('Malý', ctx.at(6, 1)) - 0.12);
  let ttl5 = fx.headline(ctx, { id: 'k5', text: 'Závodí se na rybníku', x: L, y: 356, w: CW, maxLines: 1, ...KICK, size: 36, tracking: 0.12, color: RED, t: tKs, reveal: 'chars', stagger: 0.012, d: 0.4 }).html;
  const MS = fx.headline(ctx, { id: 'ms', text: 'Malý Sporťáček', x: L, y: 404, w: CW, maxLines: 1, font: 'Bitter', wght: 900, upper: true, lh: 1, sizes: [104, 100, 96, 92, 88], color: '#ffffff', t: tMs, reveal: 'chars', stagger: 0.025, d: 0.5, style: 'filter:drop-shadow(0 6px 18px rgba(0,0,0,.4))' });
  ttl5 += MS.html;
  // facts chips (web: 0,2 ha · hloubka 1,5 m) on beats 6.0 / 6.1, Reels-safe (≤ 1460)
  const chips = [['50 × 40 m', tDm + 0.12], ['0,2 ha', ctx.at(6, 0)], ['hloubka 1,5 m', ctx.at(6, 1)]];
  const cw = chips.map(([t]) => ctx.measure(t, { font: 'Montserrat', wght: 800, size: 32 }) + 48 + 24 + 6);
  const gap = 16, tw = cw.reduce((a, b) => a + b, 0) + gap * (chips.length - 1);
  let cx0 = (W - tw) / 2;
  let ch = `<div class="fx-full" id="${ctx.id('chs')}">`;
  chips.forEach(([t, at], i) => {
    ch += `<div class="vn-pill" id="${ctx.id(`cp${i}`)}" style="left:${cx0.toFixed(1)}px;top:1384px"><b></b>${ctx.esc(ctx.nb(t))}</div>`;
    ctx.tl.fromTo(ctx.sel(`cp${i}`), { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.45, ease: 'expo.out' }, at - 0.04);
    cx0 += cw[i] + gap;
  });
  ch += '</div>';
  s5 += `<div class="fx-full" id="${ctx.id('t5')}">${ttl5}</div>${ch}`;
  // =============== bar 7 · lockup ===============
  const tL = B7 - 0.08;
  ctx.tl.set(ctx.sel('pl'), { transformOrigin: '540px 470px' }, 0);
  ctx.tl.fromTo(ctx.sel('pl'), { scale: 1, y: 0 }, { scale: 0.56, y: 0, duration: 0.6, ease: 'expo.inOut' }, tL - 0.2);
  ctx.tl.fromTo(ctx.sel('chs'), { opacity: 1 }, { opacity: 0, duration: 0.2, ease: 'power1.in' }, tL - 0.2);
  ctx.tl.fromTo(ctx.sel('t5'), { opacity: 1, y: 0 }, { opacity: 0, y: -30, duration: 0.25, ease: 'power2.in' }, tL - 0.2);
  // venue badge (≤ TA logo) + URL row
  const LG = ctx.logo('on_dark', { box: [150, 150], at: [tL, END], id: 'logo', label: 'venue lockup badge' });
  const uSz = 58, uW = ctx.measure(D.url, { font: 'Montserrat', wght: 800, italic: true, size: uSz });
  const rowW = LG.w + 24 + uW, rx = (W - rowW) / 2, yRow = 1030;
  let lk = `<div class="fx-abs" id="${ctx.id('lk')}" style="left:${px(rx)};top:${yRow}px;width:${px(rowW + 10)};height:${LG.h}px;display:flex;align-items:center;gap:24px">${LG.html}<span style="font:italic 800 ${uSz}px/1 'Montserrat';color:#fff;white-space:nowrap">${ctx.esc(D.url)}</span></div>`;
  ctx.tl.fromTo(ctx.sel('lk'), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' }, tL);
  const TC = fx.taChip(ctx, { id: 'mk', text: 'Místo konání', sub: 'MČR 2026', cx: W / 2, y: yRow + LG.h + 40, size: 32, tone: 'dark', t: tL + 0.1 });
  lk += TC.html;
  lk += fx.headline(ctx, { id: 'dt', text: '24.–25. 10. 2026', x: L, y: TC.y + TC.h + 30, w: CW, maxLines: 1, font: 'Bitter', wght: 900, size: 72, align: 'center', color: '#ffffff', t: tL + 0.2, reveal: 'lines', d: 0.5 }).html;
  s5 += `<div class="fx-full">${lk}</div>`;
  html += fx.scene(ctx, 's5', B5 - 0.003, END, s5, { inD: 0.001 });

  // =============== title layers over the drone ===============
  const tName = Math.min(0.42, vo('Líheň', 0.93, 0.3, 1.0) - 0.5);
  const tNo = vo('pstruží', 2.8) - 0.3;
  let t0s = fx.headline(ctx, { id: 'k0', text: 'Místo konání · MČR 2026', x: L, y: 428, maxLines: 1, ...KICK, size: 34, tracking: 0.14, color: AQUA, t: 0.06, reveal: 'chars', stagger: 0.012, d: 0.45, out: tNo - 0.05, outD: 0.25 }).html;
  const N = fx.headline(ctx, { id: 'nm', text: D.name, x: L, y: 480, w: CW, maxLines: 2, font: 'Bitter', wght: 900, upper: true, lh: 0.92, sizes: [160, 152, 144, 136], t: tName, reveal: 'chars', stagger: 0.03, d: 0.55, out: tNo, outD: 0.3, style: 'filter:drop-shadow(0 8px 18px rgba(0,0,0,.45))' });
  t0s += N.html;
  html += fx.scene(ctx, 'ttl', 0, tNo + 0.35, t0s, { outD: 0.05 });
  // „Pstruží líheň od roku“ arrives over the drone with the VO and carries across the cut into 1934
  const tK2 = vo('pstruží', 2.8) - 0.08;
  const K2 = fx.headline(ctx, { id: 'k2', text: 'Pstruží líheň od roku', x: L, y: 650, maxLines: 1, ...KICK, size: 50, tracking: 0.08, color: AQUA, t: tK2, reveal: 'chars', stagger: 0.014, d: 0.4, out: B3 - 0.3, outD: 0.24, style: 'filter:drop-shadow(0 4px 12px rgba(0,0,0,.5))' });
  html += fx.scene(ctx, 'k2s', tK2 - 0.01, B3, K2.html, { inD: 0.001, outD: 0.001 });

  // =============== accents + transitions ===============
  fx.flash(ctx, B3, { id: 'fl3', color: '#ffffff', peak: 0.22, d: 0.2, blend: 'screen' });
  fx.tIn(ctx, 'flash', { color: '#ffffff', d: 0.12 });            // the intro zooms through to white → 1 white frame, the drone hits by frame 3
  fx.tOut(ctx, 'blob', { d: 0.4 });                               // liquid out into the next world
  return { html, css };
}
