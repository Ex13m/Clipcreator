// QA: node scripts/qa.cjs [vp9|dist]  → _work/qa/*.png + report.json
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const P = path.resolve(__dirname, '..'), Q = P + '/_work/qa';
const variant = process.argv[2] || 'vp9';
const FILE = variant === 'dist' ? 'dist/karusel_mcr2026.html' : '_work/karusel_test_vp9.html';
const url = 'file://' + P + '/' + FILE;
const rep = { variant, file: FILE, size_bytes: fs.statSync(P + '/' + FILE).size, runs: [] };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const curIdx = page => page.evaluate(() => [...document.querySelectorAll('.dots button')].findIndex(b => b.classList.contains('on')));
(async () => {
  const b = await chromium.launch();
  for (const [w, h] of [[360, 640], [540, 960]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, hasTouch: false });
    const page = await ctx.newPage(); const errs = [];
    page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', e => errs.push('pageerror: ' + e.message));
    page.on('requestfailed', r => errs.push('reqfail: ' + r.url().slice(0, 40) + ' ' + (r.failure() && r.failure().errorText)));
    await page.goto(url); await sleep(1200);
    const tag = `${variant}_${w}x${h}`;
    const r = { vp: `${w}x${h}`, checks: {} };
    r.checks.noHScroll = await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
    r.checks.box = await page.evaluate(() => { const e = document.getElementById('kz').getBoundingClientRect(); return [Math.round(e.width), Math.round(e.height), +(e.width / e.height).toFixed(4)]; });
    r.checks.imagesOk = await page.evaluate(() => [...document.images].every(i => i.complete && i.naturalWidth > 0));
    r.checks.fonts = await page.evaluate(async () => { await document.fonts.ready; return [...document.fonts].filter(f => f.status === 'loaded').length; });
    await page.screenshot({ path: `${Q}/${tag}_s0_intro.png` });
    // autoplay: po ~3,4 s přechod na 1
    await page.mouse.move(w + 50, h + 50);
    await sleep(3000); r.checks.autoplayIdxAfter4s = await curIdx(page);
    await sleep(600);
    r.checks.autoplayIdx = await curIdx(page);
    // klik na tečku 2 (GH) → video běží?
    await page.click('.dots button:nth-child(3)'); await sleep(1500);
    r.checks.video = await page.evaluate(() => { const v = document.querySelectorAll('.slide')[2].querySelector('video'); return v ? { paused: v.paused, rs: v.readyState, t: +v.currentTime.toFixed(2), live: v.classList.contains('live'), err: v.error && v.error.code } : null; });
    r.checks.playingCount = await page.evaluate(() => [...document.querySelectorAll('video')].filter(v => !v.paused).length);
    await page.screenshot({ path: `${Q}/${tag}_s2_gh.png` });
    // přechod uprostřed (šipka)
    await page.keyboard.press('ArrowRight'); await sleep(330);
    await page.screenshot({ path: `${Q}/${tag}_mid_transition.png` });
    await sleep(1200); r.checks.afterArrow = await curIdx(page);
    await page.screenshot({ path: `${Q}/${tag}_s3_af.png` });
    // hover pauza
    await page.mouse.move(w / 2, h / 2); const i0 = await curIdx(page); await sleep(5000); r.checks.hoverPauseHolds = (await curIdx(page)) === i0;
    // swipe (pointer events myší): doleva = další
    const before = await curIdx(page);
    await page.mouse.move(w * 0.8, h * 0.5); await page.mouse.down();
    for (let k = 1; k <= 10; k++) { await page.mouse.move(w * (0.8 - k * 0.05), h * 0.5); await sleep(16); }
    await page.screenshot({ path: `${Q}/${tag}_swipe_drag.png` });
    await page.mouse.up(); await sleep(900); r.checks.swipeLeft = [before, await curIdx(page)];
    // swipe doprava = předchozí
    const b2 = await curIdx(page);
    await page.mouse.move(w * 0.2, h * 0.5); await page.mouse.down();
    for (let k = 1; k <= 10; k++) { await page.mouse.move(w * (0.2 + k * 0.05), h * 0.5); await sleep(16); }
    await page.mouse.up(); await sleep(900); r.checks.swipeRight = [b2, await curIdx(page)];
    // ČRS (poslední) + venue
    await page.click('.dots button:nth-child(10)'); await sleep(1300); await page.screenshot({ path: `${Q}/${tag}_s9_crs.png` });
    await page.click('.dots button:nth-child(2)'); await sleep(1500); await page.screenshot({ path: `${Q}/${tag}_s1_venue.png` });
    // odkaz
    r.checks.links = await page.evaluate(() => [...document.querySelectorAll('a.btn')].map(a => [a.textContent.trim(), a.href, a.target, a.rel].join(' | ')));
    r.errors = errs; rep.runs.push(r); await ctx.close();
  }
  // iframe v hostitelské stránce 1280×800
  { const host = fs.readFileSync(Q + '/iframe_host.html', 'utf8').replace('../FILE', '../../' + FILE);
    fs.writeFileSync(Q + `/iframe_host_${variant}.html`, host);
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } }); const page = await ctx.newPage(); const errs = [];
    page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); page.on('pageerror', e => errs.push(e.message));
    await page.goto('file://' + Q + `/iframe_host_${variant}.html`); await sleep(5200);
    await page.screenshot({ path: `${Q}/${variant}_iframe_1280x800.png` });
    const fr = page.frames()[1];
    const r = { vp: 'iframe 1280x800', checks: { box: await fr.evaluate(() => { const e = document.getElementById('kz').getBoundingClientRect(); return [Math.round(e.width), Math.round(e.height)]; }), idx: await fr.evaluate(() => [...document.querySelectorAll('.dots button')].findIndex(b => b.classList.contains('on'))),
      hostHScroll: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) }, errors: errs };
    rep.runs.push(r); await ctx.close(); }
  // reduced motion – crossfade
  { const ctx = await b.newContext({ viewport: { width: 540, height: 960 }, reducedMotion: 'reduce' }); const page = await ctx.newPage();
    await page.goto(url); await sleep(800); await page.keyboard.press('ArrowRight'); await sleep(220);
    await page.screenshot({ path: `${Q}/${variant}_reduced_mid.png` });
    rep.runs.push({ vp: 'reduced-motion', checks: { transform: await page.evaluate(() => document.querySelectorAll('.slide')[1].style.transform || 'none') } }); await ctx.close(); }
  await b.close();
  fs.writeFileSync(`${Q}/report_${variant}.json`, JSON.stringify(rep, null, 1));
  console.log(JSON.stringify(rep, null, 1));
})();
