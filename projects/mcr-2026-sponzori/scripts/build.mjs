// MČR 2026 Trout Area · partneři · reklamní film 9:16 · HyperFrames orchestrator
//
//   node scripts/build.mjs                         → proto/film/index.html          (master film, whole track 1:46)
//   BLOCK=troutshop node scripts/build.mjs         → proto/block_troutshop/          (bare block + its music slice + VO)
//   BLOCK=troutshop REEL=1 node scripts/build.mjs  → proto/reel_troutshop/           (1-bar hook + block + 2-bar end card, music slice with fades, VO)
//   BLOCK=all [REEL=1] node scripts/build.mjs      → every block (sponsor blocks only for REEL=1)
//   FINAL=1 (no DRAFT badge) · VER=v6 (badge text) · STEMS=1 (separate music + VO tracks instead of the one pre-mixed track)
//   Audio: every output gets ONE mixed track (scripts/lib/mix.py): music ducked under the VO, −14 LUFS, true peak −2 dBTP.
//   After rendering: node scripts/deliver.mjs (re-muxes the pre-mix into the rendered MP4s once, AAC 256k, checks −14 LUFS / ≤ −1 dBTP).
//
// This file only ORCHESTRATES: timing from the beat grid, assembling sub-compositions, audio, the TA plate layer, exports.
// Look/animation lives in scripts/blocks/<block>.mjs (one per block) + scripts/lib/fx.mjs. Contract: scripts/BLOCK_API.md.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { ROOT, rd, exists, J, f3, r3, esc, ffDur, copyIfNewer } from './lib/util.mjs';
import * as A from './lib/assets.mjs';
import { fontCss, stageFonts, registerFonts } from './lib/fonts.mjs';
import { loadGrid, planFilm } from './lib/grid.mjs';
import { voFor } from './lib/vo.mjs';
import { initOutput, makeCtx, plateGeom } from './lib/ctx.mjs';
import { createTL } from './lib/tl.mjs';
import * as fx from './lib/fx.mjs';
import { defaultHook, defaultEndCard } from './lib/reel.mjs';

const ENV = process.env;
const TK = rd(path.join(ROOT, 'data/tokens.json'));
const C = rd(path.join(ROOT, 'data/content.json'));
const W = TK.canvas.w, H = TK.canvas.h;
const VER = ENV.VER || C.meta.version;
const FINAL = !!ENV.FINAL;
const dataOf = (k) => { const f = path.join(ROOT, 'data/blocks', `${k}.json`); return exists(f) ? rd(f) : {}; };

// ---------- grid + plan ----------
const G = loadGrid(C, Math.max(...C.plan.map((e) => e.bars[1])) + 4);
const PLAN = planFilm(C, G);
const FILM_DUR = PLAN[PLAN.length - 1].t1;

// ---------- runtime assets ----------
A.stageRuntime();
stageFonts(path.join(A.PA, 'fonts'));
A.prestage(PLAN.map((p) => dataOf(p.data)));
A.ref(TK.plate.src, { trim: false, maxSide: 1400 }); A.flush();

// ---------- block modules ----------
const MODS = {};
const needed = ENV.BLOCK && ENV.BLOCK !== 'all' ? PLAN.filter((p) => p.key === ENV.BLOCK) : PLAN;
for (const p of needed) {
  if (MODS[p.block]) continue;
  const f = path.join(ROOT, 'scripts/blocks', `${p.block}.mjs`);
  if (!exists(f)) throw new Error(`missing block module scripts/blocks/${p.block}.mjs`);
  MODS[p.block] = await import(pathToFileURL(f).href + `?v=${fs.statSync(f).mtimeMs}`);
  registerFonts(MODS[p.block].fonts);
}
const themeOf = (p) => (p ? { key: p.key, theme: MODS[p.block]?.theme || {} } : null);

// ---------- audio helpers ----------
function sliceTrack(name, g0, g1, { fadeIn = TK.reel.fadeIn, fadeOut = TK.reel.fadeOut } = {}) {
  const dst = path.join(A.PA, 'audio', `${name}.wav`);
  const src = G.track;
  const stamp = `${g0}-${g1}-${fadeIn}-${fadeOut}`, sf = dst + '.stamp';
  if (!exists(dst) || fs.statSync(dst).mtimeMs < fs.statSync(src).mtimeMs || !exists(sf) || fs.readFileSync(sf, 'utf8') !== stamp) {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    const d = g1 - g0;
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', f3(g0), '-t', f3(d), '-i', src, '-af', `afade=t=in:st=0:d=${fadeIn},afade=t=out:st=${f3(Math.max(0, d - fadeOut))}:d=${fadeOut}`, '-ar', '48000', '-ac', '2', dst]);
    fs.writeFileSync(sf, stamp);
  }
  return 'assets/audio/' + path.basename(dst);
}

// ---------- broadcast mix (music ducked under VO, −14 LUFS, true peak ≤ −1 dBTP) ----------
// One pre-mixed WAV per output (scripts/lib/mix.py, numpy, deterministic): the music slice is ducked by a sidechain envelope
// from the VO bus (−7 dB, 120 ms attack with 120 ms look-ahead, 300 ms release, 220 ms hold) + a −2.5 dB presence carve 1–4 kHz
// under the voice, then the whole mix is set to −14 LUFS integrated with a 4× oversampled true-peak limiter at −2 dBTP
// (−1 dBTP after AAC with margin). STEMS=1 → the old separate music / VO <audio> tracks (for editing in the studio).
const MIX = { duck: { depth: -7, depthRange: [-8, -6], voOver: 9.5, attack: 0.12, release: 0.3, hold: 0.22, lookahead: 0.12, thresh: -42, carve: -2.5, carveMax: -4.5, voLiftMax: 1.5 }, master: { lufs: -14, tp: -2 }, ...(C.mix || {}) };
function mixAudio(name, { dur, start, fadeIn = 0, fadeOut = 0, vo }) {
  const dst = path.join(A.PA, 'audio', `mix_${name}.wav`);
  const spec = { out: dst, dur: r3(dur), music: { src: G.track, start: r3(start), fadeIn, fadeOut }, vo: vo.map((v) => ({ src: v.src, at: r3(v.at), dur: r3(v.dur) })), duck: MIX.duck, master: MIX.master, voGain: MIX.voGain || 0 };
  const mt = [G.track, ...vo.map((v) => v.src), path.join(ROOT, 'scripts/lib/mix.py')].map((f) => fs.statSync(f).mtimeMs).join(',');
  const stamp = JSON.stringify(spec) + '|' + mt, sf = dst + '.stamp';
  if (!exists(dst) || !exists(sf) || fs.readFileSync(sf, 'utf8').split('\n')[0] !== stamp) {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    const jf = dst + '.spec.json'; fs.writeFileSync(jf, JSON.stringify(spec, null, 1));
    const rep = execFileSync('python3', [path.join(ROOT, 'scripts/lib/mix.py'), jf]).toString().trim();
    fs.writeFileSync(sf, stamp + '\n' + rep);
  }
  const rep = JSON.parse(fs.readFileSync(sf, 'utf8').split('\n')[1]);
  return { src: 'assets/audio/' + path.basename(dst), rep };
}

// sponsor logos (<img class="fx-logo">) in a block's HTML with the ids of all their ancestors (tag-stack walk; our generators emit
// well-formed HTML) → for the motion part of the logo rule
const VOID = new Set(['img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'area', 'base', 'col', 'embed', 'param', 'track', 'wbr']);
function logoAncestors(html) {
  const out = [], stack = [];
  for (const m of html.matchAll(/<(\/?)([a-zA-Z][\w:-]*)([^>]*?)(\/?)>/g)) {
    const [, close, tag0, attrs, self] = m, tag = tag0.toLowerCase();
    if (close) { const i = stack.map((x) => x.tag).lastIndexOf(tag); if (i >= 0) stack.length = i; continue; }
    const id = /\sid="([^"]+)"/.exec(attrs)?.[1];
    if (tag === 'img' && /\sclass="[^"]*\bfx-logo\b/.test(attrs)) {
      const st = /\sstyle="([^"]*)"/.exec(attrs)?.[1] || '';
      out.push({ id, src: /\ssrc="([^"]+)"/.exec(attrs)?.[1] || '', w: +(/width:\s*([\d.]+)px/.exec(st)?.[1] || 0), h: +(/height:\s*([\d.]+)px/.exec(st)?.[1] || 0), anc: [...stack.map((x) => x.id), id].filter(Boolean).map((x) => '#' + x) });
    }
    if (!self && !VOID.has(tag)) stack.push({ tag, id });
  }
  return out;
}

// ======================================================================================
// BUILD one output
// ======================================================================================
function build(mode, blockKey = null) {
  const plate = plateGeom(TK);
  const OUT = initOutput({ TK, G, mode, plate });
  // ---- instances: what goes where on the output timeline ----
  const inst = [];   // {P, part, gT0, dur, mod, prev, next}
  let DUR, music;
  if (mode === 'film') {
    PLAN.forEach((P, i) => inst.push({ P, part: 'main', gT0: P.t0, tT0: P.t0, dur: r3(P.t1 - P.t0), prev: PLAN[i - 1], next: PLAN[i + 1] }));
    DUR = FILM_DUR;
    if (ENV.STEMS) copyIfNewer(G.track, path.join(A.PA, 'audio/track.wav'));
    music = { src: 'assets/audio/track.wav', mediaStart: 0, mix: { start: 0 } };
  } else {
    const P = PLAN.find((p) => p.key === blockKey);
    if (!P) throw new Error(`unknown block ${blockKey} (plan keys: ${PLAN.map((p) => p.key).join(', ')})`);
    if (mode === 'block') {
      inst.push({ P, part: 'main', gT0: 0, tT0: P.t0, dur: r3(P.t1 - P.t0), prev: null, next: null });
      DUR = r3(P.t1 - P.t0);
      music = { src: ENV.STEMS ? sliceTrack(`block_${P.key}`, P.t0, P.t1, { fadeIn: 0.04, fadeOut: 0.25 }) : null, mix: { start: P.t0, fadeIn: 0.04, fadeOut: 0.25 } };
    } else {
      const hb = P.bar0 >= TK.reel.hookBars ? TK.reel.hookBars : 0;
      const g0 = G.downbeats[P.bar0 - hb];
      let eb = TK.reel.endBars; while (eb > 0 && G.downbeats[P.bar1 + 1 + eb] > (G.trackDur || 1e9) + 1e-3) eb--;
      if (P.tail) eb = 0;
      const g1 = P.tail ? P.t1 : G.downbeats[P.bar1 + 1 + eb];
      const self = { key: P.key, block: P.block };
      if (hb) inst.push({ P, part: 'hook', gT0: 0, tT0: g0, dur: r3(P.t0 - g0), prev: null, next: self });
      inst.push({ P, part: 'main', gT0: r3(P.t0 - g0), tT0: P.t0, dur: r3(P.t1 - P.t0), prev: hb ? self : null, next: eb ? self : null });
      if (eb) inst.push({ P, part: 'endcard', gT0: r3(P.t1 - g0), tT0: P.t1, dur: r3(g1 - P.t1), prev: self, next: null });
      DUR = r3(g1 - g0);
      music = { src: ENV.STEMS ? sliceTrack(`reel_${P.key}`, g0, g1) : null, mix: { start: g0, fadeIn: TK.reel.fadeIn, fadeOut: TK.reel.fadeOut } };
    }
  }

  // ---- output length on whole video frames: the renderer captures ceil(DUR × fps) frames and pads/trims the AAC mix to that length
  //      by RE-ENCODING it when they differ by > 1 ms — a 2nd AAC generation lifts the true peak by ~1.3 dB (measured: −1.3 → 0.0 dBTP)
  //      and the renderer then lowers the whole mix by 1.5 dB. On whole frames the AAC is copied (1st generation, ≤ −1 dBTP). ----
  const FPS = +(ENV.FPS || 30);
  const DUR_RAW = DUR;
  DUR = Math.floor((Math.ceil(DUR * FPS - 1e-6) / FPS) * 1000) / 1000;
  // ---- build every instance ----
  const hosts = [], subs = [], audio = [], report = [], voMix = [], logoMotion = [];
  inst.forEach((I, i) => {
    const { P } = I, mod = MODS[P.block];
    const data = dataOf(P.data);
    const voInfo = I.part === 'main' && P.vo ? voFor(P.vo, { offset: P.opt.voOffset ?? C.vo.offset, dur: I.dur }) : voFor(null);
    const ctx = makeCtx({ key: P.key, part: I.part, P, gT0: I.gT0, tT0: I.tT0, dur: I.dur, data, event: C.event, C, theme: mod.theme, prev: themeOf(I.prev), next: themeOf(I.next), voInfo, mod, dataOf });
    const fn = I.part === 'hook' ? (mod.hook || defaultHook) : I.part === 'endcard' ? (mod.endCard || defaultEndCard) : mod.default;
    const r = fn(ctx) || {};
    const tlCode = typeof r.timeline === 'string' ? r.timeline : (r.timeline || ctx.tl).code('  ');
    const end = ctx.tl.end(); if (end.t > I.dur + 0.05) ctx.warn(`timeline runs to ${end.t.toFixed(2)} s > block ${I.dur} s (${end.sel} is cut off)`);
    // ---- rule: the prize chip „Věnuje ceny · MČR 2026“ in every sponsor block + its Reel end card, never in the venue (host) ----
    if (mod.meta?.reel && (I.part === 'main' || I.part === 'endcard')) {
      const txt = (r.html || '').replace(/<[^>]+>/g, '').replace(/[\s\u00a0]+/g, ' ');
      const has = /Věnuje (hlavní )?cen/i.test(txt);
      if (P.key === 'venue' ? has : !has) throw new Error(`PRIZE CHIP rule: ${ctx.cid} ${P.key === 'venue' ? 'must not carry' : 'is missing'} „Věnuje ceny · MČR 2026“`);
      report.push(`OK prize chip ${ctx.cid}: ${P.key === 'venue' ? 'none (host)' : 'present'}`);
    }
    // ---- logo rule, motion part: a scale tween (> 1) on a sponsor logo or any of its ancestors makes the logo larger than its
    //      fitted size for a moment (lockup „settle 1.05 → 1“) → checked below against the plate scale at that moment ----
    if (r.html) for (const lg of logoAncestors(r.html)) {
      for (const it of ctx.tl.items) {
        if (it.k !== 'ft') continue;
        const sels = String(it.sel).split(',').map((x) => x.trim());
        if (!sels.some((x) => lg.anc.includes(x))) continue;
        const mx = Math.max(...['scale', 'scaleX', 'scaleY'].flatMap((k) => [it.from?.[k], it.to?.[k]]).filter((v) => typeof v === 'number'), 1);
        if (mx > 1.0001) logoMotion.push({ label: `${ctx.cid}:${lg.id || lg.src.split('/').pop()}`, w: lg.w, h: lg.h, k: mx, g0: I.gT0 + it.t, g1: I.gT0 + it.t + (it.to?.duration || 0), sel: it.sel });
      }
    }
    // ---- duplicate <img> of the same file in one sub-composition (lint duplicate_media_discovery_risk): the 2nd+ copy gets a
    //      URL fragment (#d2, #d3 …) → distinct media entries for the compiler, the browser still loads the one cached file ----
    if (r.html) { const seen = new Map(); r.html = r.html.replace(/(<img\b[^>]*?\ssrc=")([^"#]+)(")/g, (m0, a, src, b) => { const n = (seen.get(src) || 0) + 1; seen.set(src, n); return n > 1 ? `${a}${src}#d${n}${b}` : m0; }); }
    const T = mod.theme || {};
    const vars = `--bg:${T.bg || '#000'};--fg:${T.fg || '#fff'};--acc:${T.accent || '#fff'};--acc2:${T.accent2 || T.accent || '#fff'}`;
    const cid = ctx.cid;
    subs.push({ cid, html: `<!doctype html>
<html lang="cs"><head><meta charset="UTF-8" /><title>${esc(cid)} · MČR 2026</title></head>
<body><template>
<div id="b-${cid}" data-composition-id="${cid}" data-width="${W}" data-height="${H}" data-duration="${f3(I.dur)}">
  <style>
  #bw-${cid} { position:absolute; inset:0; overflow:hidden; background:var(--bg); color:var(--fg); }
  #${cid}-stage { position:absolute; inset:0; overflow:hidden; }
  ${(r.css || '').trim()}
  </style>
  <div id="bw-${cid}" class="blk blk-${P.block}" style="${vars}">
    <div id="${cid}-stage" class="blk-stage">${r.html || ''}
    </div>
    ${ctx.overlays.join('\n    ')}
  </div>
  <script>
  const tl = gsap.timeline({ paused: true });
  ${tlCode}
  tl.set({}, {}, ${f3(I.dur)});
  window.__timelines[${J(cid)}] = tl;
  </script>
</div>
</template></body></html>
` });
    hosts.push(`<div id="el-${cid}" class="host" data-composition-id="${cid}" data-composition-src="compositions/${cid}.html" data-start="${f3(I.gT0)}" data-duration="${f3(I.dur)}" data-track-index="${2 + (i % 2)}" data-width="${W}" data-height="${H}"></div>`);
    // VO slot (main part only)
    if (I.part === 'main' && voInfo.file) {
      const dst = `assets/vo/${path.basename(voInfo.file)}`; copyIfNewer(voInfo.file, path.join(A.PROTO, dst));
      const d = Math.min(voInfo.audioDur, I.dur - voInfo.offset);
      if (voInfo.offset + voInfo.audioDur > I.dur - 1e-3) console.warn(`  !! VO ${P.key}: ${voInfo.audioDur}s does not fit the block (${I.dur} s) → CUT at ${d.toFixed(2)} s`);
      else if (voInfo.offset + voInfo.audioDur > I.dur - (C.vo.tailMin ?? 0.9)) console.warn(`  ! VO ${P.key}: ends ${(voInfo.offset + voInfo.audioDur).toFixed(2)} s, < ${C.vo.tailMin ?? 0.9} s before block end`);
      audio.push(`<audio id="vo-${P.key}" src="${dst}" data-start="${f3(I.gT0 + voInfo.offset)}" data-duration="${f3(d)}" data-track-index="${11 + (i % 2)}" data-volume="${C.vo.volume}"></audio>`);
      voMix.push({ src: voInfo.file, at: I.gT0 + voInfo.offset, dur: d });
      report.push(`VO ${P.key}: ${path.basename(voInfo.file)} ${d.toFixed(2)} s${voInfo.aligned ? ' (aligned words)' : ''}`);
    } else if (I.part === 'main' && P.vo) report.push(`VO ${P.key}: — (slot vo/${P.vo}.wav · est. ${voInfo.start.toFixed(2)}–${voInfo.end.toFixed(2)} s of ${I.dur} s)`);
  });
  if (ENV.STEMS) audio.unshift(`<audio id="music" src="${music.src}" data-start="0" data-duration="${f3(DUR)}"${music.mediaStart != null ? ` data-media-start="${f3(music.mediaStart)}"` : ''} data-track-index="10" data-volume="${C.music.volume}"></audio>`);
  else {
    // one pre-mixed track (music ducked under the VO, mastered) replaces the separate music + VO elements
    const mx = mixAudio(mode === 'film' ? 'film' : `${mode}_${blockKey}`, { dur: DUR, ...music.mix, vo: voMix });
    audio.length = 0;
    audio.push(`<audio id="mix" src="${mx.src}" data-start="0" data-duration="${f3(DUR)}" data-track-index="10" data-volume="1"></audio>`);
    const R = mx.rep;
    report.push(`MIX ${path.basename(mx.src)}: ${R.lufs} LUFS · ${R.tp} dBTP · limiter ${R.limiterMaxGR} dB${R.voOverMusic != null ? ` · VO ${R.voLufs} vs music under VO ${R.musicUnderVoLufs} LUFS (+${R.voOverMusic} LU) · music without VO ${R.musicNoVoLufs} LUFS` : ''}`);
  }

  // ---- TA plate (the only persistent layer): corner, hero moves requested by blocks ----
  const rtl = createTL();
  for (const m of plate.moves) {
    const s = m.scale, dx = r3(m.cx - (plate.w * s) / 2 - plate.x), dy = r3(m.cy - (plate.h * s) / 2 - plate.y);
    rtl.fromTo('#ta-plate', { x: 0, y: 0, scale: 1 }, { x: dx, y: dy, scale: s, duration: m.fly, ease: m.ease }, m.g0);
    m.hold = m.g1 >= DUR_RAW - 0.02;   // a hero that reaches the end of the content stays there (DUR adds < 1 frame of rounding)
    if (!m.hold) rtl.fromTo('#ta-plate', { x: dx, y: dy, scale: s }, { x: 0, y: 0, scale: 1, duration: m.fly, ease: m.ease }, r3(m.g1 - m.fly));
    report.push(`TA plate hero ×${s} ${f3(m.g0)}–${m.hold ? 'end' : f3(m.g1)} (${m.by})`);
  }
  // ---- logo rule: every sponsor logo ≤ TA logo at that moment (plate scale counted only in the hold part of a hero move) ----
  const scaleAt = (g) => { for (const m of plate.moves) { const a = m.g0 + m.fly, b = m.hold ? Infinity : m.g1 - m.fly; if (g >= a - 1e-3 && g <= b + 1e-3) return m.scale; } return 1; };
  const viol = [];
  for (const L of OUT.logos) {
    let minS = Infinity; for (let g = L.g0 + 0.02; g <= L.g1 - 0.02; g += 1 / 30) minS = Math.min(minS, scaleAt(g));
    if (minS === Infinity) minS = scaleAt(L.g0);
    const ok = L.need <= minS + 1e-3;
    report.push(`${ok ? 'OK' : 'XX'} logo ${L.label}: ${L.w}×${L.h} (needs TA ×${L.need.toFixed(2)}, plate ×${minS})`);
    if (!ok) viol.push(L.label);
  }
  // motion: the logo at its peak scale (start / end of a tween > 1) against the smallest plate scale during that tween
  for (const M of logoMotion) {
    const T = plate.logo, need = Math.max(M.w / T.w, Math.sqrt((M.w * M.h) / (T.w * T.h))) * M.k;
    let minS = Infinity; for (let g = M.g0; g <= M.g1 + 1e-6; g += 1 / 60) minS = Math.min(minS, scaleAt(g));
    if (minS === Infinity) minS = scaleAt(M.g0);
    const ok = need <= minS + 1e-3;
    if (!ok || ENV.LOGO_VERBOSE) report.push(`${ok ? 'OK' : 'XX'} logo motion ${M.label}: ×${M.k} via ${M.sel} at ${f3(M.g0)} → needs TA ×${need.toFixed(2)}, plate ×${minS}`);
    if (!ok) viol.push(`${M.label} (scale ×${M.k} on ${M.sel})`);
  }
  if (viol.length) throw new Error('LOGO RULE violated: ' + viol.join(', '));

  // ---- root page ----
  const P0 = plate;
  const plateUrl = A.ref(TK.plate.src);
  const easeJs = Object.entries(fx.EASES).map(([k, v]) => `CustomEase.create(${J(k)}, ${J(v)});`).join(' ');
  const title = mode === 'film' ? 'MČR 2026 · partneři · reklamní film' : `MČR 2026 · ${mode} ${blockKey}`;
  const html = `<!doctype html>
<html lang="cs"><head><meta charset="UTF-8" /><meta name="viewport" content="width=${W}, height=${H}" />
<title>${esc(title)}</title>
<script src="assets/gsap.min.js"></script>
<script src="assets/CustomEase.min.js"></script>
<script>gsap.registerPlugin(CustomEase); ${easeJs}</script>
<style>
${fontCss('assets/fonts/')}
* { box-sizing:border-box; }
html, body { margin:0; background:#000; }
body { font-family:'Inter', sans-serif; color:#fff; -webkit-font-smoothing:antialiased; }
#root { position:relative; width:100%; height:100%; overflow:hidden; background:#000; }
.host { position:absolute; inset:0; }
.blk { position:absolute; inset:0; }
${fx.CSS}
/* the ONLY persistent layer: TA CZ plate (top-left, inside the Reels safe zone; never covered — highest z) */
#ta-plate { position:absolute; left:${P0.x}px; top:${P0.y}px; width:${P0.w}px; height:${P0.h}px; z-index:1000; transform-origin:0 0; border-radius:${TK.plate.radius}px; overflow:hidden; box-shadow:${TK.plate.shadow}; background:#fff; }
#ta-plate img { display:block; width:100%; height:100%; }
#badge { position:absolute; left:${TK.safe.left}px; bottom:28px; z-index:1001; font:600 18px/1 'Inter', sans-serif; letter-spacing:.2em; color:#fff; opacity:.5; text-shadow:0 1px 3px rgba(0,0,0,.8); }
</style></head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${f3(DUR)}" data-width="${W}" data-height="${H}">
  ${hosts.join('\n  ')}
  ${audio.join('\n  ')}
  <div id="ta-plate"><img src="${plateUrl}" alt="Trout Area Czech Republic"></div>
  ${FINAL ? '' : `<div id="badge">DRAFT · ${esc(VER)}${mode !== 'film' ? ` · ${esc(mode)} ${esc(blockKey)}` : ''}</div>`}
</div>
<script>
  const tl = gsap.timeline({ paused: true });
  ${rtl.code('  ')}
  tl.set({}, {}, ${f3(DUR)});
  window.__timelines["main"] = tl;
</script>
</body></html>`;
  A.flush();
  const dirName = mode === 'film' ? 'film' : `${mode}_${blockKey}`;
  const dir = path.join(A.PROTO, dirName);
  fs.mkdirSync(dir, { recursive: true });
  const ln = path.join(dir, 'assets'); if (!exists(ln)) fs.symlinkSync('../assets', ln);
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  const cdir = path.join(dir, 'compositions'); fs.mkdirSync(cdir, { recursive: true });
  for (const f of fs.readdirSync(cdir)) if (f.endsWith('.html')) fs.unlinkSync(path.join(cdir, f));
  for (const sc of subs) fs.writeFileSync(path.join(cdir, `${sc.cid}.html`), sc.html);
  console.log(`${path.relative(ROOT, dir)}/index.html · ${mode} · DUR ${f3(DUR)} s · grid ${G.real ? `track ${G.tempo} BPM` : 'synthetic'}`);
  if (mode === 'film') PLAN.forEach((p) => console.log(`   ${f3(p.t0).padStart(8)}–${f3(p.t1).padStart(8)}  bars ${String(p.bar0).padStart(2)}–${String(p.bar1).padStart(2)}  ${p.key}${p.block !== p.key ? ` (${p.block})` : ''}`));
  else inst.forEach((I) => console.log(`   ${f3(I.gT0).padStart(8)}–${f3(I.gT0 + I.dur).padStart(8)}  ${I.part}`));
  for (const m of [...report, ...OUT.reports]) console.log('  ' + m);
  for (const m of OUT.warns) console.warn('  ! ' + m);
  return { dir, DUR };
}

// ======================================================================================
// MAIN
// ======================================================================================
const mode = ENV.BLOCK ? (ENV.REEL ? 'reel' : 'block') : 'film';
if (ENV.BLOCK === 'all') {
  for (const p of PLAN) { if (mode === 'reel' && !MODS[p.block].meta?.reel) continue; build(mode, p.key); }
} else if (ENV.BLOCK) build(mode, ENV.BLOCK);
else build('film');
