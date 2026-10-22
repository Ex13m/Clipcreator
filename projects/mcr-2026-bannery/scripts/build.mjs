#!/usr/bin/env node
// MČR 2026 sponsor banners — ONE command builds every format for one sponsor key.
//   node scripts/build.mjs <key>                         all: 4 statics + 4 carousel cards + 2 MP4 + contact sheet + QA
//   node scripts/build.mjs <key> --only=static,carousel  skip the MP4s while iterating (fast, ~10 s)
//   node scripts/build.mjs <key> --fmt=4x5               only these formats
//   node scripts/build.mjs <key> --draft                 DRAFT badge
//   node scripts/build.mjs --list                        sponsor keys + module status
// Outputs: renders/<key>/<key>_{static_1x1,static_4x5,static_191,static_9x16}.png, <key>_carousel_{1..4}.png,
//          <key>_anim_{4x5,1x1}.mp4, _sheet.jpg (contact sheet), _qa.json (rule checks). Exit 1 on a rule error.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { ROOT } from './engine/util.mjs';
import { FORMATS, OUTPUTS, CAROUSEL, ANIM, DEFAULT_SEQ } from './engine/formats.mjs';
import { buildPage, EVENT } from './engine/page.mjs';
import { serve, browser, open, still, video, withLock } from './engine/render.mjs';

const KEYS = ['venue', 'gausseholler', 'activefishing', 'bosset', 'jigovky', 'moonky', 'troutshop', 'velkaryba', 'crs', 'ftfishing'];
const args = process.argv.slice(2);
const opt = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
const key = args.find((a) => !a.startsWith('--'));

if (opt.list || !key) {
  for (const k of KEYS) {
    const m = path.join(ROOT, 'scripts/sponsors', `${k}.mjs`), r = path.join(ROOT, 'renders', k);
    const n = fs.existsSync(r) ? fs.readdirSync(r).filter((f) => /\.(png|mp4)$/.test(f)).length : 0;
    console.log(`${k.padEnd(14)} module: ${fs.existsSync(m) ? 'yes' : '—  '}  renders: ${n}`);
  }
  if (!key) { console.log('\nusage: node scripts/build.mjs <key> [--only=static,carousel,anim] [--fmt=1x1,4x5,191,9x16] [--draft]'); process.exit(opt.list ? 0 : 2); }
  process.exit(0);
}

const modPath = path.join(ROOT, 'scripts/sponsors', `${key}.mjs`);
if (!fs.existsSync(modPath)) { console.error(`no module scripts/sponsors/${key}.mjs (copy scripts/sponsors/_template.mjs)`); process.exit(2); }
const mod = await import(pathToFileURL(modPath).href + `?v=${Date.now()}`);
const M = { brand: mod.brand, theme: mod.theme || {}, fonts: mod.fonts, css: mod.css, scenes: mod.scenes, anim: mod.anim };
if (!M.brand?.url || !M.brand?.role || !EVENT.roles[M.brand.role]) throw new Error(`${key}: brand.url and brand.role (${Object.keys(EVENT.roles).filter((k) => k[0] !== '_').join('|')}) are required`);
M.brand.key = key;

const only = new Set(String(opt.only || 'static,carousel,anim').split(','));
const fmts = opt.fmt ? new Set(String(opt.fmt).split(',')) : null;
const SEQ = M.anim?.seq || DEFAULT_SEQ;
const fps = +(opt.fps || ANIM.fps);

// which scenes each format page needs
const plan = {};
const need = (fk, ids) => { if (fmts && !fmts.has(fk)) return; (plan[fk] ||= new Set()); ids.forEach((i) => plan[fk].add(i)); };
if (only.has('static')) OUTPUTS.static.forEach((fk) => need(fk, ['poster']));
if (only.has('carousel')) OUTPUTS.carousel.forEach((fk) => need(fk, CAROUSEL));
if (only.has('anim')) OUTPUTS.anim.forEach((fk) => need(fk, SEQ.map((s) => s.scene)));

const OUT = path.join(ROOT, 'renders', key), WORK = path.join(ROOT, 'build', key);
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(WORK, { recursive: true });
// QA of a partial build (--only / --fmt) is merged into the previous _qa.json
let prevQa = {}; try { prevQa = JSON.parse(fs.readFileSync(path.join(OUT, '_qa.json'), 'utf8')).outputs || {}; } catch { /* first build */ }
const qa = { key, built: new Date().toISOString(), outputs: { ...prevQa } };
const t0 = Date.now();
const log = (...a) => console.log(...a);

const { srv, base } = await serve();
const br = await browser();
let errors = 0;
const note = (name, q, extra = {}) => {
  qa.outputs[name] = { ...q, ...extra };
  const e = q.err?.length || 0, w = q.warn?.length || 0; errors += e;
  log(`  ${e ? 'XX' : w ? ' !' : 'OK'} ${name}${e ? `  ERR: ${q.err.join(' | ')}` : ''}${w ? `  warn: ${q.warn.join(' | ')}` : ''}`);
};
try {
  for (const fk of Object.keys(FORMATS)) {
    if (!plan[fk]) continue;
    const f = FORMATS[fk];
    const { html, missingFonts } = buildPage(M, f, [...plan[fk]], { draft: !!opt.draft });
    const hp = path.join(WORK, `${fk}.html`); fs.writeFileSync(hp, html);
    const { page, logs, unfit } = await open(br, base, hp, f);
    if (unfit.length) log(`  ! ${fk}: text shrunk to its minimum and still too wide: ${unfit.join(', ')}`);
    if (logs.length) log(`  ! ${fk} page: ${[...new Set(logs)].slice(0, 6).join(' | ')}`);
    if (only.has('static') && OUTPUTS.static.includes(fk)) note(`${key}_static_${fk}.png`, await still(page, 'poster', path.join(OUT, `${key}_static_${fk}.png`)));
    if (only.has('carousel') && OUTPUTS.carousel.includes(fk)) {
      for (const [i, id] of CAROUSEL.entries()) note(`${key}_carousel_${i + 1}.png`, await still(page, id, path.join(OUT, `${key}_carousel_${i + 1}.png`)), { scene: id });
    }
    if (only.has('anim') && OUTPUTS.anim.includes(fk)) {
      const out = path.join(OUT, `${key}_anim_${fk}.mp4`);
      const r = await withLock('video', () => video(page, SEQ, out, { fps, onProgress: (i, n) => process.stdout.write(`\r  rendering ${fk} ${i}/${n}   `) }), log);
      process.stdout.write('\r');
      const merged = { err: [...new Set(r.qa.flatMap((q) => q.err))], warn: [...new Set(r.qa.flatMap((q) => q.warn))] };
      note(`${key}_anim_${fk}.mp4`, merged, { dur: r.dur, frames: r.frames, fps, samples: r.qa.map((q) => q.t) });
    }
    await page.close();
  }
} finally {
  await br.close(); srv.close();
}
fs.writeFileSync(path.join(OUT, '_qa.json'), JSON.stringify(qa, null, 1));
try {
  execFileSync('python3', [path.join(ROOT, 'scripts/engine/sheet.py'), OUT, key], { stdio: 'inherit' });
} catch (e) { log(`  ! contact sheet failed: ${e.message}`); }
log(`${errors ? 'XX' : 'OK'} ${key}: ${Object.keys(qa.outputs).length} outputs in ${((Date.now() - t0) / 1000).toFixed(1)} s → renders/${key}/ (sheet: renders/${key}/_sheet.jpg)`);
process.exit(errors ? 1 : 0);
