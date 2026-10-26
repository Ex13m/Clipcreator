// node scripts/snap.mjs <9x16|16x9> t1 t2 ... -> _work/snap_<fmt>_<t>.png + contact sheet
import { chromium } from '/opt/node-tools/node_modules/playwright-core/index.mjs';
import path from 'node:path'; import fs from 'node:fs';
const [fmt, ...ts] = process.argv.slice(2);
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const [W, H] = fmt === '9x16' ? [1080, 1920] : [1920, 1080];
fs.mkdirSync(path.join(ROOT, '_work'), { recursive: true });
const b = await chromium.launch({ executablePath: process.env.HB });
const p = await b.newPage({ viewport: { width: W, height: H } });
await p.goto('file://' + path.join(ROOT, 'proto', fmt, 'index.html')); await p.waitForTimeout(800);
for (const t of ts) { await p.evaluate((t) => window.__timelines.main.seek(+t, false), t); await p.waitForTimeout(80);
  await p.screenshot({ path: path.join(ROOT, '_work', `snap_${fmt}_${t}.png`) }); }
await b.close();
