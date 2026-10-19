// MČR 2026 Trout Area · partneři · reklamní film 9:16 · HyperFrames orchestrator
//
//   node scripts/build.mjs                         → proto/film/index.html          (master film, whole track 1:46)
//   BLOCK=troutshop node scripts/build.mjs         → proto/block_troutshop/          (bare block + its music slice + VO)
//   BLOCK=troutshop REEL=1 node scripts/build.mjs  → proto/reel_troutshop/           (1-bar hook + block + 2-bar end card, music slice with fades, VO)
//   BLOCK=all [REEL=1] node scripts/build.mjs      → every block (sponsor blocks only for REEL=1)
//   FINAL=1 (no DRAFT badge) · VER=v6 (badge text)
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
    copyIfNewer(G.track, path.join(A.PA, 'audio/track.wav'));
    music = { src: 'assets/audio/track.wav', mediaStart: 0 };
  } else {
    const P = PLAN.find((p) => p.key === blockKey);
    if (!P) throw new Error(`unknown block ${blockKey} (plan keys: ${PLAN.map((p) => p.key).join(', ')})`);
    if (mode === 'block') {
      inst.push({ P, part: 'main', gT0: 0, tT0: P.t0, dur: r3(P.t1 - P.t0), prev: null, next: null });
      DUR = r3(P.t1 - P.t0);
      music = { src: sliceTrack(`block_${P.key}`, P.t0, P.t1, { fadeIn: 0.04, fadeOut: 0.25 }) };
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
      music = { src: sliceTrack(`reel_${P.key}`, g0, g1) };
    }
  }

  // ---- build every instance ----
  const hosts = [], subs = [], audio = [], report = [];
  inst.forEach((I, i) => {
    const { P } = I, mod = MODS[P.block];
    const data = dataOf(P.data);
    const voInfo = I.part === 'main' && P.vo ? voFor(P.vo, { offset: P.opt.voOffset ?? C.vo.offset, dur: I.dur }) : voFor(null);
    const ctx = makeCtx({ key: P.key, part: I.part, P, gT0: I.gT0, tT0: I.tT0, dur: I.dur, data, event: C.event, C, theme: mod.theme, prev: themeOf(I.prev), next: themeOf(I.next), voInfo, mod, dataOf });
    const fn = I.part === 'hook' ? (mod.hook || defaultHook) : I.part === 'endcard' ? (mod.endCard || defaultEndCard) : mod.default;
    const r = fn(ctx) || {};
    const tlCode = typeof r.timeline === 'string' ? r.timeline : (r.timeline || ctx.tl).code('  ');
    const end = ctx.tl.end(); if (end.t > I.dur + 0.05) ctx.warn(`timeline runs to ${end.t.toFixed(2)} s > block ${I.dur} s (${end.sel} is cut off)`);
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
      report.push(`VO ${P.key}: ${path.basename(voInfo.file)} ${d.toFixed(2)} s${voInfo.aligned ? ' (aligned words)' : ''}`);
    } else if (I.part === 'main' && P.vo) report.push(`VO ${P.key}: — (slot vo/${P.vo}.wav · est. ${voInfo.start.toFixed(2)}–${voInfo.end.toFixed(2)} s of ${I.dur} s)`);
  });
  audio.unshift(`<audio id="music" src="${music.src}" data-start="0" data-duration="${f3(DUR)}"${music.mediaStart != null ? ` data-media-start="${f3(music.mediaStart)}"` : ''} data-track-index="10" data-volume="${C.music.volume}"></audio>`);

  // ---- TA plate (the only persistent layer): corner, hero moves requested by blocks ----
  const rtl = createTL();
  for (const m of plate.moves) {
    const s = m.scale, dx = r3(m.cx - (plate.w * s) / 2 - plate.x), dy = r3(m.cy - (plate.h * s) / 2 - plate.y);
    rtl.fromTo('#ta-plate', { x: 0, y: 0, scale: 1 }, { x: dx, y: dy, scale: s, duration: m.fly, ease: m.ease }, m.g0);
    m.hold = m.g1 >= DUR - 0.02;
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
