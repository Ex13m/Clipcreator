import { chromium } from '/opt/node-tools/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: process.env.HB });
for (const s of [1, 2]) {
  const p = await b.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: s });
  await p.goto('file://' + process.cwd() + '/cover.html'); await p.waitForTimeout(500);
  await p.screenshot({ path: `MCR2026_dekujeme_partnerum_1x1${s == 2 ? '_2160' : ''}.png` });
}
await b.close();
