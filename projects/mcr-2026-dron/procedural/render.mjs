// Offline deterministic renderer driver: headless Chromium (SwiftShader WebGL2) + three.js scene.
// usage: node render.mjs --aspect 16x9 --frames 0,40,80,119 --ss 2 --sub 3 --out frames/test [--params '{"exposure":1.1}']
import { chromium } from 'playwright-core';
import http from 'http'; import fs from 'fs'; import path from 'path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');   // .../drone
const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith('--') ? a.concat([[v.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]]) : a), []));
const aspect = args.aspect || '16x9';
const [outW, outH] = aspect === '16x9' ? [1920, 1080] : [1080, 1920];
const vfov = aspect === '16x9' ? 45.6 : 73.7;
const scale = parseFloat(args.scale || '1');   // preview downscale
let frames;
if (args.frames && args.frames.includes('-')) { const [a, b] = args.frames.split('-').map(Number); frames = Array.from({ length: b - a + 1 }, (_, i) => a + i); }
else frames = (args.frames || '0').split(',').map(Number);
const outDir = path.resolve(args.out || 'frames/test'); fs.mkdirSync(outDir, { recursive: true });
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png', '.f32': 'application/octet-stream' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': mime[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const exe = fs.readdirSync('/opt/pw-browsers/chromium_headless_shell-1194').map(d => `/opt/pw-browsers/chromium_headless_shell-1194/${d}/headless_shell`).find(p => fs.existsSync(p));
const browser = await chromium.launch({ executablePath: exe, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--use-gl=angle', '--disable-gpu-watchdog', '--js-flags=--max-old-space-size=8192'] });
const page = await browser.newPage();
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning' || args.verbose) console.log('[page]', m.type(), m.text().slice(0, 2000)); });
page.on('pageerror', e => console.log('[pageerror]', e.message));
page.setDefaultTimeout(0);
await page.goto(`http://127.0.0.1:${port}/procedural/src/index.html`);
await page.waitForFunction(() => window.__ready === true);
const opts = { outW: Math.round(outW * scale), outH: Math.round(outH * scale), vfov, ss: parseFloat(args.ss || '2'), subframes: parseInt(args.sub || '1'),
  msaa: parseInt(args.msaa ?? '4'), shadowSize: parseInt(args.shadow || '8192'), reflScale: parseFloat(args.refl || '0.33'), noRefl: !!args.norefl, noTrees: !!args.notrees,
  grain: args.grain !== undefined ? parseFloat(args.grain) : 0.010, sharpen: args.sharpen !== undefined ? parseFloat(args.sharpen) : 0.35,
  params: args.params ? JSON.parse(args.params) : {} };
const t0 = Date.now();
const info = await page.evaluate(o => window.setup(o), opts);
console.log('setup', JSON.stringify(info), 'wall', Date.now() - t0, 'ms');
for (const f of frames) {
  const t = Date.now();
  const r = await page.evaluate(f => window.renderFrame(f), f);
  const buf = Buffer.from(r.url.split(',')[1], 'base64');
  fs.writeFileSync(path.join(outDir, `f${String(f).padStart(3, '0')}.png`), buf);
  console.log(`frame ${f} render ${r.ms} ms read ${r.readMs} ms wall ${Date.now() - t} ms`);
}
await browser.close(); server.close();
