// Offline deterministic renderer: serves the scene, drives headless Chromium (SwiftShader WebGL2) frame by
// frame, writes raw RGBA frames, then encodes H.264 (yuv420p, CRF 16) and extracts key stills with ffmpeg.
import { chromium } from 'playwright-core';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.resolve(ROOT, '../data');
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? '1']; }));
const aspect = args.aspect || '9x16';
const [W, H] = aspect === '16x9' ? [1920, 1080] : [1080, 1920];
const vfov = aspect === '16x9' ? 45.7 : 73.7;   // 24 mm-equivalent lens, true-vertical for 9:16
const frames = args.frames ? args.frames.split(',').flatMap(s => { if (s.includes('-')) { const [a, b] = s.split('-').map(Number); return Array.from({ length: b - a + 1 }, (_, i) => a + i); } return [Number(s)]; }) : Array.from({ length: 120 }, (_, i) => i);
const opts = { w: W, h: H, vfov, ss: Number(args.ss || 2), sub: Number(args.sub || 2), reflScale: Number(args.refl || 0.5) };
for (const k of ['shutter', 'disp', 'reflBoost', 'haze', 'exposure', 'postExposure', 'sat', 'contrast', 'grain', 'sharpen', 'vignette', 'ca', 'sunAz', 'sunEl']) if (args[k] !== undefined) opts[k] = Number(args[k]);
if (args.debugWater) opts.debugWater = 1;
if (args.path) opts.path = JSON.parse(fs.readFileSync(args.path, 'utf8'));
const tag = args.tag || aspect;
const outDir = path.join(ROOT, args.outdir || 'tmp/frames', tag);
fs.mkdirSync(outDir, { recursive: true });

const MIME = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.html': 'text/html', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.f32': 'application/octet-stream' };
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  let fp = u.startsWith('/data/') ? path.join(DATA, u.slice(6)) : path.join(ROOT, u === '/' ? 'src/index.html' : u.slice(1));
  if (!fp.startsWith(ROOT) && !fp.startsWith(DATA)) { res.writeHead(403); return res.end(); }
  fs.readFile(fp, (e, b) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'Content-Type': MIME[path.extname(fp)] || 'application/octet-stream' }); res.end(b); });
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const exe = fs.readdirSync('/opt/pw-browsers/chromium_headless_shell-1194').map(d => `/opt/pw-browsers/chromium_headless_shell-1194/${d}/headless_shell`).find(p => fs.existsSync(p));
const browser = await chromium.launch({ executablePath: exe, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--use-gl=angle', '--js-flags=--max-old-space-size=8192', '--disable-gpu-watchdog', '--disable-features=GpuWatchdog'] });
const page = await browser.newPage({ viewport: { width: 400, height: 400 } });
page.on('console', m => console.log('[page]', m.text()));
page.on('pageerror', e => console.log('[pageerror]', e.message));
await page.goto(`http://127.0.0.1:${port}/src/index.html`);
await page.waitForFunction(() => window.__ready === true, null, { timeout: 120000 });
let t0 = Date.now();
const info = await page.evaluate(async (o) => window.__scene.init(o), opts);
console.log('init', (Date.now() - t0) / 1000, 's', JSON.stringify(info), JSON.stringify(opts));

for (const f of frames) {
  t0 = Date.now();
  const b64 = await page.evaluate((f) => {
    const px = window.__scene.renderFrame(f);
    let s = ''; const CH = 0x8000;
    for (let i = 0; i < px.length; i += CH) s += String.fromCharCode.apply(null, px.subarray(i, i + CH));
    return btoa(s);
  }, f);
  const buf = Buffer.from(b64, 'base64');
  fs.writeFileSync(path.join(outDir, `f${String(f).padStart(4, '0')}.rgba`), buf);
  const ci = await page.evaluate((f) => window.__scene.camInfo(f), f);
  const tm = await page.evaluate(() => { const t = { ...window.__scene.TIMES }; for (const k in window.__scene.TIMES) delete window.__scene.TIMES[k]; return t; });
  console.log('  times', JSON.stringify(Object.fromEntries(Object.entries(tm).map(([k, v]) => [k, Math.round(v)]))));
  console.log(`frame ${f} ${(Date.now() - t0) / 1000}s yaw ${ci.yaw.toFixed(2)} pitch ${ci.pitch.toFixed(2)} v ${ci.speed.toFixed(2)} m/s y ${ci.pos[1].toFixed(1)}`);
}
await browser.close();
server.close();

// stills (PNG) for requested frames
const stills = (args.stills || '').split(',').filter(Boolean).map(Number);
const toPng = (f, out) => spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-i', path.join(outDir, `f${String(f).padStart(4, '0')}.rgba`), '-vf', 'vflip', out], { stdio: 'inherit' });
if (args.pngall) for (const f of frames) toPng(f, path.join(outDir, `f${String(f).padStart(4, '0')}.png`));
for (const f of stills) if (frames.includes(f)) toPng(f, path.join(ROOT, 'out', `flyover_${aspect}_f${String(f).padStart(3, '0')}.png`));
if (args.encode) {
  const list = frames.map(f => path.join(outDir, `f${String(f).padStart(4, '0')}.rgba`));
  const cat = path.join(outDir, 'all.raw');
  fs.writeFileSync(cat, '');
  for (const l of list) fs.appendFileSync(cat, fs.readFileSync(l));
  const mp4 = path.join(ROOT, 'out', `flyover_${aspect}.mp4`);
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', '30', '-i', cat,
    '-vf', 'vflip,format=yuv420p', '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart',
    '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', mp4], { stdio: 'inherit' });
  fs.unlinkSync(cat);
  console.log('encoded', mp4, r.status);
}
