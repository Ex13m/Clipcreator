// Рендер раскадровки HTML -> PNG (полная страница, 1x)
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const b = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });
const p = await b.newPage({ viewport: { width: 2096, height: 1200 }, deviceScaleFactor: 1 });
await p.goto(pathToFileURL(path.join(root, 'storyboard/storyboard_dali.html')).href);
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(500);
await p.screenshot({ path: path.join(root, 'storyboard/storyboard_dali.png'), fullPage: true });
await b.close();
