// Block context factory: everything a block module needs (timing, ids, timeline, assets, fonts, logo rule, TA plate, VO, neighbours).
// See scripts/BLOCK_API.md for the contract. build.mjs creates one ctx per block instance (film block, reel hook, reel end card).
import path from 'node:path';
import { esc, nb, rnd, rgba, r3, J } from './util.mjs';
import { createTL } from './tl.mjs';
import * as A from './assets.mjs';
import { measure, wrap, fit } from './fonts.mjs';
import { localGrid } from './grid.mjs';

// global state shared by all ctx of one output (set up by build.mjs → initOutput)
let OUT = null;
export function initOutput({ TK, G, mode, plate }) {
  OUT = { TK, G, mode, plate, logos: [], reports: [], warns: [] };
  return OUT;
}
export const output = () => OUT;

// TA plate geometry (corner state) + logo-rule reference size
export function plateGeom(TK) {
  const P = TK.plate, [iw, ih] = A.dims(P.src);
  const w = P.w, h = Math.round((w * ih) / iw);
  // the plate PNG is the TA logo on a white plate; inner logo box measured once (1783×533 inside 1900×622)
  const logo = { w: Math.round(w * P.innerW), h: Math.round(h * P.innerH) };
  return { x: P.x, y: P.y, w, h, logo, moves: [] };
}
// plate scale at global time g (corner = 1)
export function plateScaleAt(plate, g) {
  for (const m of plate.moves) {
    if (g < m.g0 || g > m.g1) continue;
    const kin = Math.min(1, (g - m.g0) / m.fly), kout = Math.min(1, (m.g1 - g) / m.fly);
    return 1 + (m.scale - 1) * Math.min(kin, kout);
  }
  return 1;
}

export function makeCtx({ key, part = 'main', P, gT0, dur, data, event, C, theme, prev, next, voInfo, mod, dataOf }) {
  const { TK, G, plate } = OUT;
  const W = TK.canvas.w, H = TK.canvas.h, SF = TK.safe;
  const lg = localGrid(G, gT0, gT0 + dur);
  const BEAT = G.beat, BAR = G.bar;
  const tl = createTL();
  const overlays = [];
  const cid = part === 'main' ? key : `${key}-${part}`;
  const ctx = {
    key, cid, part, mode: OUT.mode, reel: OUT.mode === 'reel', film: OUT.mode === 'film', module: mod,
    data, event, C, theme: theme || {}, prev: prev || null, next: next || null, dataOf,   // dataOf(key) = another block's data (read-only)
    W, H, safe: SF, tokens: TK,
    // ---- time (block-local seconds; 0 = first downbeat of the block) ----
    t0: 0, dur: r3(dur), gT0: r3(gT0), BEAT, BAR, beats: lg.beats, downs: lg.downs, nBars: Math.round(dur / BAR) || lg.downs.length,
    bar: (i) => (i < lg.downs.length ? lg.downs[i] : i === lg.downs.length ? r3(dur) : r3(i * BAR)),
    beat: (i) => (i < lg.beats.length ? lg.beats[i] : r3(i * BEAT)),
    at: (bar, beat = 0) => { const t0 = ctx.bar(bar); const bi = lg.beats.findIndex((b) => b >= t0 - 1e-3); return bi >= 0 && bi + beat < lg.beats.length ? lg.beats[bi + beat] : r3(t0 + beat * BEAT); },
    snap: (t, unit = 'beat') => { const arr = unit === 'bar' ? [...lg.downs, r3(dur)] : unit === 'half' ? lg.beats.flatMap((b, i) => [b, r3(b + (( lg.beats[i + 1] ?? b + BEAT) - b) / 2)]) : lg.beats; return arr.reduce((a, b) => (Math.abs(b - t) < Math.abs(a - t) ? b : a), arr[0] ?? 0); },
    // ---- ids / selectors ----
    id: (s) => `${cid}-${s}`, sel: (s) => `#${cid}-${s}`, S: `#b-${cid}`, stage: `#${cid}-stage`, root: `#bw-${cid}`,
    // ---- timeline ----
    tl,
    overlay: (html) => overlays.push(html), overlays,
    // ---- assets ----
    asset: (rel, o) => A.ref(rel, o), dims: (rel) => A.dims(rel), has: (rel) => A.has(rel), srcOf: A.srcOf,
    img: (rel, { id, cls = '', style = '', alt = '', fit = 'cover', pos = '50% 50%' } = {}) => `<img${id ? ` id="${ctx.id(id)}"` : ''} class="fx-img ${cls}" src="${A.ref(rel)}" alt="${esc(alt)}" style="object-fit:${fit}; object-position:${pos};${style}">`,
    video: (rel, { id = 'vid', start = 0, dur: d, cls = '', style = '', track = 1 } = {}) => `<video id="${ctx.id(id)}" class="clip fx-video ${cls}" src="${A.ref(rel)}" muted playsinline data-start="${r3(start)}" data-duration="${r3(d)}" data-track-index="${track}" style="${style}"></video>`,
    // ---- type ----
    measure, wrap, fit,
    // ---- TA plate (root layer, cannot be animated from inside a block → request moves here) ----
    plate: {
      rect: { x: plate.x, y: plate.y, w: plate.w, h: plate.h },          // corner position (keep this area free of key content)
      logo: plate.logo,                                                  // TA logo size at scale 1 (logo-rule reference)
      // hold the plate as a hero/lockup from t0 to t1 (block-local), centred at (cx, cy), scaled; fly in/out takes `fly` s
      hero(t0, t1, { scale = 2, cx = W / 2, cy = 760, fly = 0.7, ease = 'expo.inOut' } = {}) {
        const m = { g0: r3(gT0 + t0), g1: r3(gT0 + t1), scale, cx, cy, fly, ease, by: cid };
        if (plate.moves.some((o) => !(m.g1 <= o.g0 || m.g0 >= o.g1))) throw new Error(`plate.hero overlap (${cid} ${t0}–${t1})`);
        if (scale < 1) throw new Error('plate scale must be ≥ 1 (TA logo never smaller than the corner plate)');
        plate.moves.push(m); plate.moves.sort((a, b) => a.g0 - b.g0);
        return { w: plate.w * scale, h: plate.h * scale, x: cx - (plate.w * scale) / 2, y: cy - (plate.h * scale) / 2 };
      },
    },
    // ---- sponsor logo with the logo rule (never larger than the TA logo in the same frame) ----
    // which: 'on_dark' | 'on_light' | 'plate' | any project-relative path; box: max [w,h]; scale: TA plate scale you guarantee
    // during `at` (block-local [t0,t1], default whole block) — >1 only together with ctx.plate.hero covering that window.
    logo(which = 'on_dark', { box = [9999, 9999], scale = 1, at = [0, dur], id, cls = '', style = '', label } = {}) {
      const rel = data?.logo?.[which] || which;
      const src = A.ref(rel);
      const [iw, ih] = A.dims(rel), ar = iw / ih, T = plate.logo;
      let w = Math.min(box[0], box[1] * ar, T.w * scale);
      w = Math.min(w, Math.sqrt(T.w * T.h * scale * scale * ar));
      w = Math.floor(w); const h = Math.floor(w / ar);
      OUT.logos.push({ label: label || `${cid}:${path.basename(rel)}`, w, h, g0: gT0 + at[0], g1: gT0 + at[1], need: Math.max(w / T.w, Math.sqrt((w * h) / (T.w * T.h))) });
      return { w, h, src, html: `<img${id ? ` id="${ctx.id(id)}"` : ''} class="fx-logo ${cls}" src="${src}" alt="${esc(data?.name || '')}" style="width:${w}px; height:${h}px;${style}">` };
    },
    // ---- VO ----
    vo: voInfo,
    // ---- misc ----
    esc, nb, rnd, rgba, J,
    report: (m) => OUT.reports.push(`${cid}: ${m}`),
    warn: (m) => OUT.warns.push(`${cid}: ${m}`),
  };
  return ctx;
}
