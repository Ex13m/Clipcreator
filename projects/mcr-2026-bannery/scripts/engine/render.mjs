// Renderer (sponsor agents: read-only): static file server over projects/ + Playwright (headless_shell) + ffmpeg.
// Stills = screenshot of a scene at rest; MP4 = frame-by-frame seek (pure function of time) piped into libx264.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { PROJECTS, requireHB } from './util.mjs';

const MIME = { '.html': 'text/html; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.js': 'text/javascript', '.json': 'application/json', '.mp4': 'video/mp4' };

export function serve() {
  const srv = http.createServer((req, res) => {
    const p = path.join(PROJECTS, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!p.startsWith(PROJECTS) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(p).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'max-age=3600' });
    fs.createReadStream(p).pipe(res);
  });
  return new Promise((ok) => srv.listen(0, '127.0.0.1', () => ok({ srv, base: `http://127.0.0.1:${srv.address().port}` })));
}

export async function browser() {
  const { chromium } = requireHB('playwright');
  const root = '/opt/pw-browsers';
  const shell = fs.readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell')).sort().pop();
  const sub = fs.readdirSync(path.join(root, shell)).find((d) => fs.existsSync(path.join(root, shell, d, 'headless_shell')));
  const exe = process.env.HYPERFRAMES_BROWSER_PATH || path.join(root, shell, sub, 'headless_shell');
  return chromium.launch({ executablePath: exe, args: ['--force-color-profile=srgb', '--disable-lcd-text', '--font-render-hinting=none'] });
}

// open a page (html string written next to the outputs so it is served from projects/)
export async function open(br, base, htmlPath, f) {
  const page = await br.newPage({ viewport: { width: f.w, height: f.h }, deviceScaleFactor: f.scale || 1 });   // 16x9: 1200×675 × 1.6 = 1920×1080
  const logs = [];
  page.on('console', (m) => { if (m.type() === 'error') logs.push(m.text()); });
  page.on('pageerror', (e) => logs.push(String(e)));
  page.on('requestfailed', (r) => logs.push(`request failed ${r.url()}`));
  page.on('response', (r) => { if (r.status() >= 400) logs.push(`HTTP ${r.status()} ${r.url()}`); });
  await page.goto(`${base}/${path.relative(PROJECTS, htmlPath).split(path.sep).map(encodeURIComponent).join('/')}`, { waitUntil: 'load' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((ok) => { i.onload = i.onerror = ok; }))));
    for (const i of document.images) { try { await i.decode(); } catch { /* reported by QA */ } }
  });
  const unfit = await page.evaluate(() => window.__fit());
  return { page, logs, unfit };
}

export async function still(page, id, out) {
  await page.evaluate((s) => window.__rest(s), id);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const qa = await page.evaluate(() => window.__qa());
  await page.screenshot({ path: out, type: out.endsWith('.jpg') ? 'jpeg' : 'png', ...(out.endsWith('.jpg') ? { quality: 92 } : {}) });
  return qa;
}

// MP4: H.264 High, yuv420p, CRF 18, faststart, silent. Returns QA of a frame in the middle of every scene window.
export async function video(page, seq, out, { fps = 60, onProgress } = {}) {
  const dur = await page.evaluate((s) => window.__setSeq(s), seq);
  const n = Math.round(dur * fps);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-r', String(fps),
    '-threads', String(Math.max(1, Math.min(2, os.cpus().length - 2))), '-movflags', '+faststart', '-an', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((ok, ko) => ff.on('close', (c) => (c ? ko(new Error(`ffmpeg exit ${c}`)) : ok())));
  const qa = [];
  let t0 = 0; const mids = seq.map((s) => { const m = t0 + s.d * 0.75; t0 += s.d; return Math.round(m * fps); });
  for (let i = 0; i < n; i++) {
    await page.evaluate((t) => window.__seek(t), i / fps);
    if (mids.includes(i)) qa.push({ t: +(i / fps).toFixed(2), ...(await page.evaluate(() => window.__qa())) });
    const buf = await page.screenshot({ type: 'jpeg', quality: 96 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (onProgress && i % fps === 0) onProgress(i, n);
  }
  ff.stdin.end();
  await done;
  return { dur, frames: n, qa };
}

// cross-process render lock (parallel sponsor agents queue their MP4 renders; 4 cores) — mkdir is atomic
export async function withLock(name, fn, log = console.log) {
  const dir = path.join(os.tmpdir(), `mcr-bannery-${name}.lock`);
  let waited = false;
  for (;;) {
    try { fs.mkdirSync(dir); fs.writeFileSync(path.join(dir, 'pid'), String(process.pid)); break; } catch {
      let pid = 0; try { pid = +fs.readFileSync(path.join(dir, 'pid'), 'utf8'); } catch { /* being created */ }
      let alive = false; if (pid) { try { process.kill(pid, 0); alive = true; } catch { alive = false; } }
      if (pid && !alive) { fs.rmSync(dir, { recursive: true, force: true }); continue; }
      if (!waited) { log(`  … waiting for the ${name} lock (pid ${pid}) — another sponsor is rendering video`); waited = true; }
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  try { return await fn(); } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}
