#!/usr/bin/env node
// TA logo luminance probe (v3): measures what is UNDER the TA logo in a built output and writes the tone windows
// (dark = white+red logo · light = navy+red · scrim = white+red on a soft dark halo) to data/plate_tone.json, which build.mjs
// applies automatically (prio above the theme default, below content.json plan[].plate and ctx.plate.tone()).
//
//   node scripts/plate_probe.mjs                 # film (≈ 1.2 s per sampled frame; step 0.3 s → ~9 min for the 2:16 film)
//   node scripts/plate_probe.mjs reel:venue      # one Reel   ·  block:venue  one bare block  ·  reels  every Reel
//   STEP=0.25 FINAL=1 node scripts/plate_probe.mjs film
//
// How: build the output with PLATE_HIDE=1 (logo hidden, compositions byte-identical) → hyperframes snapshot every STEP s →
// scripts/lib/plate_probe.py reads each frame where the logo is at that moment (corner or hero move, proto/<out>/plate.json),
// weights the pixels by the logo alpha and decides per frame; short blips (< 0.6 s, e.g. a flash) are absorbed, changes are
// snapped to the nearest beat / block boundary → windows + a stamp of the probed compositions (a later block edit makes them stale:
// the build then warns and falls back to the theme default) → rebuild normally.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROJ = path.resolve(ROOT, '..');
const STEP = +(process.env.STEP || 0.3);
const arg = process.argv[2] || 'film';
const targets = arg === 'reels'
  ? fs.readdirSync(path.join(ROOT, 'proto')).filter((d) => d.startsWith('reel_')).map((d) => `reel:${d.slice(5)}`)
  : [arg];
const browser = (() => { try { const b = '/opt/pw-browsers'; const d = fs.readdirSync(b).find((x) => x.startsWith('chromium_headless_shell')); const sub = fs.readdirSync(path.join(b, d))[0]; return path.join(b, d, sub, 'headless_shell'); } catch { return process.env.HYPERFRAMES_BROWSER_PATH; } })();

function build(t, hide) {
  const [mode, key] = t.split(':');
  const env = { ...process.env, ...(hide ? { PLATE_HIDE: '1' } : {}) };
  delete env.BLOCK; delete env.REEL; if (!hide) delete env.PLATE_HIDE;
  if (mode === 'reel') { env.BLOCK = key; env.REEL = '1'; } else if (mode === 'block') env.BLOCK = key;
  execFileSync('node', [path.join(ROOT, 'scripts/build.mjs')], { env, stdio: hide ? 'ignore' : 'inherit' });
  return mode === 'film' ? 'film' : `${mode}_${key}`;
}

for (const t of targets) {
  const out = build(t, true);
  const dir = path.join(ROOT, 'proto', out);
  const side = JSON.parse(fs.readFileSync(path.join(dir, 'plate.json'), 'utf8'));
  const times = []; for (let g = STEP / 2; g < side.dur - 0.02; g += STEP) times.push(+g.toFixed(3));
  const snap = path.join(ROOT, '_work/snap/_probe', out);
  fs.rmSync(snap, { recursive: true, force: true }); fs.mkdirSync(snap, { recursive: true });
  console.log(`probe ${out}: ${times.length} frames (step ${STEP} s) …`);
  // chunks keep one browser session short (the film page is heavy)
  for (let i = 0; i < times.length; i += 120) {
    const part = times.slice(i, i + 120);
    const sub = path.join(snap, `c${String(i / 120).padStart(2, '0')}`);
    execFileSync('npx', ['--prefix', path.join(PROJ, 'hb-battle-2026'), 'hyperframes', 'snapshot', dir, '--at', part.join(','), '--no-end', '--timeout', '60000', '--describe', 'false', '-o', sub],
      { env: { ...process.env, HYPERFRAMES_BROWSER_PATH: browser }, stdio: 'ignore', maxBuffer: 1 << 26 });
  }
  const res = JSON.parse(execFileSync('python3', [path.join(ROOT, 'scripts/lib/plate_probe.py'), path.join(dir, 'plate.json'), snap, JSON.stringify(times)], { maxBuffer: 1 << 26 }).toString());
  const f = path.join(ROOT, 'data/plate_tone.json');
  const all = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {};
  all[out] = { stamp: side.stamp, date: new Date().toISOString().slice(0, 16), step: STEP, frames: times.length, windows: res.windows, stats: res.stats };
  fs.writeFileSync(f, JSON.stringify(all, null, 1));
  console.log(`  ${out}: ${res.windows.map(([a, b, tn]) => `${tn} ${a}–${b}`).join(' · ')}`);
  build(t, false);
}
