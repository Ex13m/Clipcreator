import { chromium } from 'playwright-core';
import fs from 'fs';
const exe = fs.readdirSync('/opt/pw-browsers/chromium_headless_shell-1194').map(d=>`/opt/pw-browsers/chromium_headless_shell-1194/${d}/headless_shell`).find(p=>fs.existsSync(p));
const b = await chromium.launch({ executablePath: exe, args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--use-gl=angle'] });
const p = await b.newPage();
await p.goto('file://' + process.cwd() + '/src/gltest.html');
console.log(JSON.stringify(await p.evaluate(()=>window.info), null, 1));
await b.close();
