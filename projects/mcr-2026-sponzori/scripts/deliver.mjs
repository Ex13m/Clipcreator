// MČR 2026 · delivery audio pass for rendered MP4s
//
//   node scripts/deliver.mjs                         → every renders/*_v<N>.mp4 that has a matching pre-mix
//   node scripts/deliver.mjs renders/film_9x16_v2.mp4 renders/reel_bosset_v2.mp4
//   v9: any frame rate (60 fps renders `*_v9_60fps.mp4`): the video stream is copied, so frame timing is untouched; the build
//   rounds every output UP to whole 1/30 s frames, which are whole 1/60 s frames too (audio = video length within < 1 ms)
//
// Why: HyperFrames encodes the (already mastered) pre-mix with ffmpeg's native AAC at 192 kbit/s. On near-mono passages close to
// the ceiling that encoder (intensity stereo / PNS on) occasionally produces a single-frame glitch of +1…+4.5 dB (measured on the
// velkaryba Reel with a −1.5 dBTP master: wav −1.52 dBTP → AAC +1.5 dBTP); the renderer then lowers the WHOLE mix to get back under
// −1 dBTP (that Reel came out at −15.1 LUFS). The master ceiling is now −2 dBTP (build.mjs MIX) and this pass is the safety net:
// it replaces the audio stream with the same pre-mix
// (proto/assets/audio/mix_<film|reel_<key>|block_<key>>.wav) encoded once (AAC 256k, intensity stereo + PNS off), copies the video
// untouched, and verifies the delivery spec: −14 LUFS ±0.5 integrated, true peak ≤ −1.0 dBTP (ffmpeg ebur128, 4× oversampled).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { ROOT } from './lib/util.mjs';

const AUD = path.join(ROOT, 'proto/assets/audio');
const mixFor = (f) => {
  // v9: names may carry a frame-rate suffix (film_9x16_v9_60fps.mp4, reel_bosset_v9_60fps.mp4) → strip `_v<N>[_<fps>fps]`
  const b = path.basename(f).replace(/\.mp4$/, '').replace(/_v\d+(_\d+fps)?$/, '');
  const m = /^film/.test(b) ? 'film' : (/^(reel|block)_(.+)$/.exec(b) || []).slice(1).join('_');
  const p = m ? path.join(AUD, `mix_${m}.wav`) : null;
  return p && fs.existsSync(p) ? p : null;
};
const dur = (f) => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim();
const meter = (f) => {
  const e = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', f, '-map', '0:a:0', '-af', 'ebur128=peak=true', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
  const I = [...e.matchAll(/^\s*I:\s*(-?[\d.]+) LUFS/gm)].at(-1)?.[1], P = [...e.matchAll(/^\s*Peak:\s*(-?[\d.]+|-inf) dBFS/gm)].at(-1)?.[1];
  return { I: +I, TP: +P };
};

const files = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(path.join(ROOT, 'renders')).filter((f) => /_v\d+(_\d+fps)?\.mp4$/.test(f)).map((f) => path.join(ROOT, 'renders', f));
let bad = 0;
for (const f of files) {
  const mix = mixFor(f);
  if (!mix) { console.log(`- ${path.basename(f)}: no pre-mix found, skipped`); continue; }
  const dv = dur(f), da = dur(mix);
  if (Math.abs(dv - da) > 0.05) console.warn(`  ! ${path.basename(f)}: video ${dv.toFixed(3)} s vs mix ${da.toFixed(3)} s — rebuild before delivering?`);
  const before = meter(f);
  const tmp = f.replace(/\.mp4$/, '.deliver.tmp.mp4');
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', f, '-i', mix, '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-aac_is', '0', '-aac_pns', '0', '-ar', '48000', '-ac', '2', '-movflags', '+faststart', tmp]);
  const after = meter(tmp);
  const ok = after.TP <= -1.0 && Math.abs(after.I + 14) <= 0.5;
  if (ok) fs.renameSync(tmp, f); else { fs.rmSync(tmp, { force: true }); bad++; }
  console.log(`${ok ? 'OK' : 'XX'} ${path.basename(f)}: render audio ${before.I} LUFS / ${before.TP} dBTP → delivered ${after.I} LUFS / ${after.TP} dBTP (${path.basename(mix)})`);
}
if (bad) { console.error(`${bad} file(s) failed the delivery spec`); process.exit(1); }
