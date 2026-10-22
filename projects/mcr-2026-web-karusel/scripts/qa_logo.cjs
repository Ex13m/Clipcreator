// screenshot každého snímku (po dosednutí) – kontrola zarovnání trvalého loga TA s logem v Reels
const { chromium } = require('playwright'); const path = require('path');
const P = path.resolve(__dirname, '..'), Q = P + '/_work/qa';
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 540, height: 960 } });
  await pg.goto('file://' + P + '/_work/karusel_test_vp9.html'); await pg.mouse.move(270, 480);
  const n = await pg.evaluate(() => document.querySelectorAll('.slide').length);
  for (let i = 0; i < n; i++) { await pg.click(`.dots button:nth-child(${i + 1})`); await pg.mouse.move(270, 480); await new Promise(r => setTimeout(r, 1700));
    await pg.screenshot({ path: `${Q}/slide_${String(i).padStart(2, '0')}.png` }); }
  await b.close(); })();
