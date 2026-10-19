import { chromium } from 'playwright-core';
import fs from 'fs';
const exe = fs.readdirSync('/opt/pw-browsers/chromium_headless_shell-1194').map(d=>`/opt/pw-browsers/chromium_headless_shell-1194/${d}/headless_shell`).find(p=>fs.existsSync(p));
console.log(exe);
const browser = await chromium.launch({ executablePath: exe, args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--use-gl=angle'] });
const page = await browser.newPage();
const r = await page.evaluate(() => {
  const c = document.createElement('canvas'); const gl = c.getContext('webgl2');
  if (!gl) return 'no webgl2';
  const dbg = gl.getExtension('WEBGL_debug_renderer_info');
  return { r: dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER), maxTex: gl.getParameter(gl.MAX_TEXTURE_SIZE), maxRb: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE), maxVp: gl.getParameter(gl.MAX_VIEWPORT_DIMS), fl: !!gl.getExtension('EXT_color_buffer_float'), fll: !!gl.getExtension('OES_texture_float_linear'), aniso: !!gl.getExtension('EXT_texture_filter_anisotropic'), maxSamples: gl.getParameter(gl.MAX_SAMPLES), hw: navigator.hardwareConcurrency };
});
console.log(r);
await browser.close();
