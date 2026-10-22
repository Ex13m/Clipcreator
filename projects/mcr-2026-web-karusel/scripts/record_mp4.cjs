// Záznam karuselu do MP4 1080×1920 (bez zvuku): deterministické snímky přes window.__kz.at(t) → ffmpeg
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const path = require('path');
const P = path.resolve(__dirname, '..'); const FPS = 30;
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
  pg.on('pageerror', e => console.error('pageerror', e.message));
  await pg.goto('file://' + P + '/_work/karusel_capture.html'); await pg.evaluate(() => document.fonts.ready);
  const total = await pg.evaluate(() => window.__kz.total); const n = Math.round(total * FPS);
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-vf', 'scale=1080:1920,format=yuv420p',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-profile:v', 'high', '-g', '60', '-movflags', '+faststart', '-an', P + '/dist/karusel_mcr2026_9x16.mp4'], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = 0; f < n; f++) {
    await pg.evaluate(t => window.__kz.at(t), f / FPS);
    const buf = await pg.screenshot({ type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 150 === 0) console.log('frame', f, '/', n);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); console.log('done');
})();
