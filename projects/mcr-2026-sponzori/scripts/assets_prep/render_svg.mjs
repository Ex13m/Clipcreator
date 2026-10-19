// Render SVG/HTML snippets to transparent PNG with headless Chromium (playwright from hb-battle-2026).
// usage: node render_svg.mjs <in.svg> <out.png> <widthPx> [fontCssFile]
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const require = createRequire('/home/user/Clipcreator/projects/hb-battle-2026/package.json');
const { chromium } = require('playwright');
const [inp, out, widthStr, fontCss] = process.argv.slice(2);
const W = parseInt(widthStr, 10);
const svg = fs.readFileSync(inp, 'utf8');
const vb = svg.match(/viewBox="([\d.\s-]+)"/)[1].trim().split(/\s+/).map(Number);
const H = Math.round(W * vb[3] / vb[2]);
const css = fontCss ? fs.readFileSync(fontCss, 'utf8') : '';
const html = `<!doctype html><html><head><style>${css} html,body{margin:0;padding:0;background:transparent} svg{display:block;width:${W}px;height:${H}px}</style></head><body>${svg}</body></html>`;
const exe = fs.readdirSync('/opt/pw-browsers').filter(d => d.startsWith('chromium_headless_shell')).map(d => path.join('/opt/pw-browsers', d, 'chrome-linux', 'headless_shell')).find(p => fs.existsSync(p));
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: out, omitBackground: true, clip: { x: 0, y: 0, width: W, height: H } });
await browser.close();
console.log('rendered', out, W, 'x', H);
