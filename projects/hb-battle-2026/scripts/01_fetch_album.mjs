// Шаг 1: скачать оригиналы общего альбома Google Photos в 01_RAW.
// Фото: <base>=d (оригинал с EXIF), видео: <base>=dv (оригинальный поток).
// Ничего не перезаписывает: существующий файл пропускается.
// Выход: 01_RAW/<оригинальное имя> + 01_RAW/_manifest.json (имя, тип, время из инфо-панели, base URL).
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const ALBUM = process.argv[2] || 'https://photos.app.goo.gl/u9B7oqEaWCKnYZuR6';
const OUT = path.resolve(new URL('..', import.meta.url).pathname, '01_RAW');
await fs.mkdir(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || undefined,
  proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined,
});
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, locale: 'cs-CZ', acceptDownloads: true });
const page = await ctx.newPage();
await page.goto(ALBUM, { waitUntil: 'networkidle', timeout: 90000 });

// Ссылки на элементы альбома: прокручиваем до стабилизации счётчика.
let links = new Set(), stable = 0;
while (stable < 4) {
  const n = links.size;
  for (const h of await page.$$eval('a[href*="/photo/"]', as => as.map(a => a.href))) links.add(h.split('?')[0]);
  await page.mouse.wheel(0, 4000);
  await page.waitForTimeout(800);
  stable = links.size === n ? stable + 1 : 0;
}
links = [...links];
console.log(`items: ${links.length}`);

const manifest = [];
for (const [i, href] of links.entries()) {
  await page.goto(href, { waitUntil: 'networkidle' });
  // Базовый URL медиа из крупного <img> просмотрщика; видео определяем по наличию плеера.
  const info = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('img[src*="googleusercontent.com/pw/"]')];
    const big = imgs.sort((a, b) => b.naturalWidth - a.naturalWidth)[0];
    const isVideo = !!document.querySelector('video, [aria-label*="Video" i], [aria-label*="Přehrát" i]');
    return { base: big?.src.split('=')[0], isVideo };
  });
  // Инфо-панель (клавиша i): имя файла и дата/время съёмки.
  await page.keyboard.press('i');
  await page.waitForTimeout(700);
  const meta = await page.evaluate(() => {
    const txt = document.body.innerText;
    const name = txt.match(/[\w\-\. ()]+\.(jpe?g|heic|png|mp4|mov|webp|dng)/i)?.[0];
    return { name, panel: txt.slice(0, 4000) };
  });
  if (!info.base) { console.warn(`skip ${href}: no media url`); continue; }
  const url = info.base + (info.isVideo ? '=dv' : '=d');
  const resp = await ctx.request.get(url, { timeout: 300000 });
  const cd = resp.headers()['content-disposition'] || '';
  const fname = (cd.match(/filename="?([^";]+)/)?.[1]) || meta.name || `item_${String(i + 1).padStart(2, '0')}${info.isVideo ? '.mp4' : '.jpg'}`;
  const dst = path.join(OUT, fname);
  try { await fs.access(dst); console.log(`exists, keep: ${fname}`); }
  catch { await fs.writeFile(dst, await resp.body()); console.log(`saved ${fname}`); }
  manifest.push({ idx: i + 1, file: fname, type: info.isVideo ? 'video' : 'photo', href, base: info.base,
    panel_datetime: meta.panel.match(/\d{1,2}\.\s?\d{1,2}\.\s?\d{4}[^\n]*|\w+ \d{1,2}, \d{4}[^\n]*/)?.[0] || null });
}
const mf = path.join(OUT, '_manifest.json');
await fs.writeFile(mf, JSON.stringify(manifest, null, 2));
await browser.close();
