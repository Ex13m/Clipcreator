// Page builder (sponsor agents: read-only). One HTML page per sponsor × format: chrome (TA logo, URL, role line, role chip,
// event line — engine-owned, so every banner keeps the rules) + the sponsor's scenes stacked in .scene layers.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, FILM, PROJECTS, esc, nb, px, dims, hex2rgba } from './util.mjs';
import { fontCss } from './fonts.mjs';

export const EVENT = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/event.json'), 'utf8'));
const RUNTIME = fs.readFileSync(path.join(ROOT, 'scripts/engine/runtime.js'), 'utf8');
// visible ink box of every brand logo (scripts/engine/brand_trims.py → data/brand_trims.json), used by E.brandStrip
const TRIMS = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'data/brand_trims.json'), 'utf8')); } catch { return {}; } })();
// TA logo shadow levels (= film tokens.json plate.levels): blurred dark copies 3 px / 14 px + faint radial halo
export const TONES = { dark: { sh: 0.4, sh2: 0.15, scrim: 0 }, scrim: { sh: 0.7, sh2: 0.55, scrim: 0.35 }, halo: { sh: 0.95, sh2: 0.85, scrim: 0.55 } };

// URL of any file under projects/ (served by render.mjs from the projects/ dir)
export const urlOf = (abs) => '/' + path.relative(PROJECTS, abs).split(path.sep).map(encodeURIComponent).join('/');

// ---------- geometry of the chrome for a format ----------
export function layout(f, roleInfo, theme = {}) {
  const T = EVENT.ta, s = f.ta / T.cw, taH = T.ch * s;
  const ta = { x: f.safe.l, y: f.safe.t, w: f.ta, h: taH, img: { x: f.safe.l - T.pad * s, y: f.safe.t - T.pad * s, w: 2079 * s, h: 679 * s } };
  const R = f.w - f.safe.r;
  const hx = ta.x + ta.w + (f.kind === 'wide' ? 28 : 36);           // header text column (URL + role line) right of the TA logo
  const urlH = f.url * 1.12, roleH = roleInfo.roleLine ? f.role * 1.35 : 0, hh = urlH + roleH;
  const urlY = ta.y + (taH - hh) / 2 + 2;
  const evH = f.event * 1.3, evY = f.h - f.safe.b - evH;
  const chipH = Math.round(f.chip * 2), chipY = evY - 14 - chipH;
  const bodyY = ta.y + taH + (f.kind === 'wide' ? 14 : 26), bodyB = chipY - (f.kind === 'wide' ? 12 : 22);
  return {
    ta, url: { x: hx, y: urlY, w: R - hx, h: urlH }, role: roleInfo.roleLine ? { x: hx, y: urlY + urlH, w: R - hx, h: roleH } : null,
    chip: { x: f.safe.l, y: chipY, h: chipH, maxW: R - f.safe.l }, event: { x: f.safe.l, y: evY, w: R - f.safe.l, h: evH },
    body: { x: f.safe.l, y: bodyY, w: R - f.safe.l, h: bodyB - bodyY, r: R, b: bodyB },
  };
}

// ---------- helpers handed to sponsor scenes (E) ----------
export function makeE(mod, f, L, roleInfo) {
  const fileOf = (rel) => {
    if (rel.startsWith('film:')) return path.join(FILM, rel.slice(5));
    if (rel.startsWith('own:')) return path.join(ROOT, rel.slice(4));
    if (rel.startsWith('shared:')) return path.join(PROJECTS, '_shared', rel.slice(7));
    return path.join(PROJECTS, rel);
  };
  const taArea = L.ta.w * L.ta.h;
  const E = {
    f, W: f.w, H: f.h, kind: f.kind, body: L.body, ta: { ...L.ta, area: taArea }, chrome: L, event: EVENT, role: roleInfo, brand: mod.brand,
    esc, nb, px, hex2rgba, t: (s) => esc(nb(s)),
    file: fileOf,
    src: (rel) => urlOf(fileOf(rel)),
    dims: (rel) => dims(fileOf(rel)),
    // largest logo box allowed next to the TA logo: width ≤ TA width, area ≤ TA area (× scale for a deliberate hero moment —
    // the TA logo is NOT scaled in banners, so keep scale = 1). aspect = w / h of the visible logo
    logoFit(aspect, { maxW = Infinity, maxH = Infinity } = {}) {
      let w = Math.min(L.ta.w, Math.sqrt(taArea * aspect), maxW, maxH * aspect);
      w = Math.floor(w * 0.985); return { w, h: w / aspect };
    },
    // sponsor logo <img> fitted to the rule. trim = [x, y, w, h] visible bbox in PNG px (default: whole image)
    logo(rel, { x, y, cx, maxW, maxH, trim, id = 'sp-logo', cls = '', style = '', attrs = '' } = {}) {
      const [nw, nh] = dims(fileOf(rel)), T = trim || [0, 0, nw, nh];
      const fit = E.logoFit(T[2] / T[3], { maxW, maxH }), k = fit.w / T[2];
      const bw = nw * k, bh = nh * k, left = (cx != null ? cx - fit.w / 2 : x) - T[0] * k, top = y - T[1] * k;
      return { html: `<img id="${id}" class="sp-logo ${cls}" src="${E.src(rel)}" alt="" data-cw="${(fit.w / bw).toFixed(4)}" data-ch="${(fit.h / bh).toFixed(4)}" style="position:absolute;left:${px(left)};top:${px(top)};width:${px(bw)};height:${px(bh)};${style}" ${attrs}>`, w: fit.w, h: fit.h };
    },
    // product / photo <img> at a given width, never larger than its natural size × maxUp
    img(rel, { x, y, cx, cy, w, h, maxUp = 1, id = '', cls = '', style = '', attrs = '' } = {}) {
      const [nw, nh] = dims(fileOf(rel)), ar = nw / nh;
      let ww = w ?? (h ? h * ar : nw); if (h && w) ww = Math.min(w, h * ar);
      ww = Math.min(ww, nw * maxUp); const hh = ww / ar;
      const left = cx != null ? cx - ww / 2 : x, top = cy != null ? cy - hh / 2 : y;
      return { html: `<img ${id ? `id="${id}" ` : ''}class="${cls}" src="${E.src(rel)}" alt="" style="position:absolute;left:${px(left)};top:${px(top)};width:${px(ww)};height:${px(hh)};${style}" ${attrs}>`, x: left, y: top, w: ww, h: hh };
    },
    // Row of THIRD-PARTY brand logos the shop carries (operator 22. 10.: „vyveď jejich značky na banner“).
    //   items: ['film:assets_prep/<key>/brands/x_on_dark.png' | {f, s (size weight, default 1), trim:[x,y,w,h]} | {wm:'TIMON', sub:'by Jackall'}]
    //   box: x, y, w, h (row height = tallest logo), label (small caps text left of / above the row), labelPos 'left'|'top',
    //   labelSize, labelCss, gap (px between logos), align 'left'|'center'|'right'|'justify', mono 'white'|'black'|null,
    //   opacity, rows (1|2: split the list into two rows, h = height of ONE row), rowGap, font (wordmarks), color (wordmarks), inAttr
    // Logos are sized by equal visual AREA (sqrt-normalised, × s) so wide wordmarks and round badges read the same weight, all
    // capped by h and never upscaled > maxUp. Every logo is a .sp-logo (QA: ≤ TA logo); the whole strip is a .t box (QA: no chrome overlap).
    brandStrip(items, { x, y, w, h, label = '', labelPos = 'left', labelSize = null, labelCss = '', gap = null, align = 'left', mono = null, opacity = 1, rows = 1, rowGap = null, font = 'Montserrat', color = '#fff', maxUp = 1, maxLogoW = null, inAttr = '', id = 'brand-strip', cls = '' }) {
      const its = items.map((it) => (typeof it === 'string' ? { f: it } : it)).map((it) => {
        if (it.wm) return { ...it, ar: Math.max(2.2, it.wm.length * 0.78), nat: 1e9 };
        const [nw, nh] = dims(fileOf(it.f)), T = it.trim || TRIMS[it.f] || [0, 0, nw, nh];
        return { ...it, nw, nh, T, ar: T[2] / T[3], nat: T[2] };
      });
      const ls = labelSize ?? Math.max(14, Math.round(h * 0.3));
      const labW = label && labelPos === 'left' ? label.length * ls * 0.7 + ls * 1.2 : 0;
      const labH = label && labelPos === 'top' ? ls * 1.6 : 0;
      const g = gap ?? Math.round(h * 0.55), rg = rowGap ?? Math.round(h * 0.35);
      const perRow = Math.ceil(its.length / rows), R = [];
      for (let i = 0; i < its.length; i += perRow) R.push(its.slice(i, i + perRow));
      // unit-area sizes → one scale k for all rows (largest k whose row fits the width); each logo is then capped at the row
      // height h on its own (a tall badge stops at h, the wordmarks keep growing) — binary search on k
      const unit = (it) => { const hh = Math.sqrt(1 / it.ar) * (it.s || 1); return { w: hh * it.ar, h: hh }; };
      const rowW = w - labW;
      // per-logo cap: width ≤ 0.8 × TA logo width (logo rule with margin), never upscaled > maxUp
      const capW = Math.min(maxLogoW ?? Infinity, L.ta.w * 0.8);
      const sized = (it, kk) => { const u = unit(it); let hh = Math.min(u.h * kk, h), ww = hh * it.ar; const cw = Math.min(capW, it.nat * maxUp); if (ww > cw) { ww = cw; hh = ww / it.ar; } return { w: ww, h: hh }; };
      const fits = (kk) => R.every((r) => r.reduce((a, it) => a + sized(it, kk).w, 0) + g * (r.length - 1) <= rowW);
      // k ≤ the value where the median logo reaches the row height (only the tall badges get clamped by h)
      const uh = its.map((it) => unit(it).h).sort((p, q) => p - q);
      let lo = 0, hi = h / uh[Math.floor((uh.length - 1) / 2)];
      if (fits(hi)) lo = hi;
      for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (fits(m)) lo = m; else hi = m; }
      const k = lo;
      const filt = mono === 'white' ? 'filter:brightness(0) invert(1);' : mono === 'black' ? 'filter:brightness(0);' : '';
      let html = '', used = 0, n = 0;
      const top0 = labH;
      R.forEach((r, ri) => {
        const S = r.map((it) => ({ it, ...sized(it, k) }));
        const tot = S.reduce((a, q) => a + q.w, 0);
        let gg = g, cx = labW;
        if (align === 'justify' && r.length > 1) gg = (rowW - tot) / (r.length - 1);
        else if (align === 'center') cx = labW + (rowW - tot - g * (r.length - 1)) / 2;
        else if (align === 'right') cx = labW + rowW - tot - g * (r.length - 1);
        const cy = top0 + ri * (h + rg) + h / 2;
        for (const q of S) {
          const { it } = q, l = cx, t = cy - q.h / 2;
          if (it.wm) {
            html += `<span class="sp-wm" style="position:absolute;left:${px(l)};top:${px(cy - h / 2)};width:${px(q.w)};height:${px(h)};display:flex;flex-direction:column;align-items:center;justify-content:center;font:800 ${px(q.h * 0.62)}/1 ${font};letter-spacing:.04em;text-transform:uppercase;color:${color};opacity:${opacity}">${esc(it.wm)}${it.sub ? `<small style="display:block;margin-top:.3em;font-size:.36em;font-weight:600;letter-spacing:.14em;opacity:.8">${esc(it.sub)}</small>` : ''}</span>`;
          } else {
            const s = q.w / it.T[2];
            html += `<span id="${id}-${n}" class="sp-logo" data-cw="1" data-ch="1" style="position:absolute;left:${px(l)};top:${px(t)};width:${px(q.w)};height:${px(q.h)};opacity:${opacity}"><img src="${E.src(it.f)}" alt="" data-noscale style="position:absolute;left:${px(-it.T[0] * s)};top:${px(-it.T[1] * s)};width:${px(it.nw * s)};height:${px(it.nh * s)};max-width:none;${filt}"></span>`;
          }
          cx += q.w + gg; used = Math.max(used, cx - gg); n++;
        }
      });
      const H = labH + R.length * h + (R.length - 1) * rg;
      const lab = !label ? '' : labelPos === 'left'
        ? `<span class="sp-strip-l" style="position:absolute;left:0;top:${px(h / 2 - ls * 0.6)};height:${px(ls * 1.2)};font:700 ${ls}px/${px(ls * 1.2)} Montserrat;letter-spacing:.14em;text-transform:uppercase;color:${color};${labelCss}">${esc(nb(label))}</span>`
        : `<span class="sp-strip-l" style="position:absolute;left:0;top:0;height:${px(ls * 1.2)};font:700 ${ls}px/${px(ls * 1.2)} Montserrat;letter-spacing:.14em;text-transform:uppercase;color:${color};${labelCss}">${esc(nb(label))}</span>`;
      const W = align === 'left' ? Math.min(w, used) : w;
      return { html: `<div id="${id}" class="t sp-strip ${cls}" ${inAttr} style="left:${px(x)};top:${px(y)};width:${px(W)};height:${px(H)};overflow:visible">${lab}${html}</div>`, w: W, h: H, k };
    },
  };
  return E;
}

// ---------- the page ----------
export function buildPage(mod, f, sceneIds, { draft = false } = {}) {
  const roleInfo = { ...EVENT.roles[mod.brand.role], ...(mod.brand.roleLine ? { roleLine: mod.brand.roleLine } : {}) };
  const th = mod.theme || {};
  const L = layout(f, roleInfo, th);
  const E = makeE(mod, f, L, roleInfo);
  const ch = { fg: '#ffffff', sub: 'rgba(255,255,255,.78)', url: '#ffffff', urlFont: "'Inter'", urlW: 800, chipBg: 'rgba(8,10,14,.66)', chipFg: '#ffffff', chipLine: 'rgba(255,255,255,.22)', dot: EVENT.ta.red, event: 'rgba(255,255,255,.9)', shadow: '0 1px 2px rgba(0,0,0,.55),0 0 14px rgba(0,0,0,.45)', ...(th.chrome || {}) };
  const tone = th.taTone || (th.light ? 'halo' : 'dark');
  const fonts = fontCss(urlOf, mod.fonts || {});
  let scenesHtml = '', css = '';
  const done = new Set();
  for (const id of sceneIds) {
    if (done.has(id)) continue; done.add(id);
    const fn = mod.scenes[id] || (id === 'mcr' ? mod.scenes.poster : null);
    if (!fn) throw new Error(`${mod.brand.key}: scene "${id}" missing`);
    const r = fn(E) || {};
    scenesHtml += `<section class="scene" data-id="${id}" data-tone="${r.taTone || tone}" style="opacity:0">${r.html || ''}</section>\n`;
    if (r.css) css += `\n/* scene ${id} */\n${r.css}`;
  }
  if (mod.css) css = `${mod.css(E) || ''}\n${css}`;
  const taUrl = urlOf(path.join(PROJECTS, EVENT.ta.logo));
  // optional sponsor icon right before the URL (brand.urlIcon = {ring, core, canvas:[w,h], box:[x,y,w,h] visible, pivot:[x,y], spin, cap, scale, gap, dy})
  // sized in em of the URL font → follows data-fit; height = scale × cap height; outer ring turns clockwise in MP4s (data-spin)
  let urlIcon = '';
  const UI = mod.brand.urlIcon;
  if (UI) {
    const [cw, chh] = UI.canvas, [bx, by, bw, bh] = UI.box, hEm = (UI.cap ?? 0.727) * (UI.scale ?? 1.2), s = hEm / bh, em = (n) => `${(Math.round(n * 10000) / 10000)}em`;
    const lay = (rel, extra = '') => `<img src="${E.src(rel)}" alt="" data-noscale style="position:absolute;left:${em(-bx * s)};top:${em(-by * s)};width:${em(cw * s)};height:${em(chh * s)};max-width:none;${extra}"`;
    urlIcon = `<span id="ch-urlicon" class="sp-logo" data-cw="1" data-ch="1" style="position:relative;flex:none;display:block;width:${em(bw * s)};height:${em(bh * s)};margin-right:${em(UI.gap ?? 0.3)};top:${em(UI.dy ?? 0)}">`
      + (UI.ring ? `${lay(UI.ring, `transform-origin:${em((UI.pivot?.[0] ?? cw / 2) * s)} ${em((UI.pivot?.[1] ?? chh / 2) * s)}`)}${UI.spin === false ? '' : ` data-spin="${UI.spin ?? 360}"`}>` : '')
      + (UI.core ? `${lay(UI.core)}>` : '') + (UI.img ? `${lay(UI.img)}>` : '') + '</span>';
  }
  const T = L.ta, I = T.img;
  const roleHtml = L.role ? `<div id="ch-role" class="ch" style="left:${px(L.role.x)};top:${px(L.role.y)};width:${px(L.role.w)};height:${px(L.role.h)};font:700 ${f.role}px/${px(L.role.h)} Montserrat;letter-spacing:.12em;text-transform:uppercase;color:${ch.sub};text-align:right" data-fit="12">${esc(nb(roleInfo.roleLine))}</div>` : '';
  const evParts = EVENT.line.split(' · ');
  const evHtml = evParts.map((p, i) => `${i ? '<i class="ch-sep">·</i>' : ''}<span${i === 0 ? ' class="ch-ev1"' : ''}>${esc(nb(p))}</span>`).join('');
  const chipHtml = roleInfo.chip ? `<div id="ch-chip" class="ch" style="left:${px(L.chip.x)};top:${px(L.chip.y)};height:${px(L.chip.h)};max-width:${px(L.chip.maxW)};font:800 ${f.chip}px/${px(L.chip.h)} Montserrat" data-fit="14"><b class="ch-dot"></b>${esc(nb(roleInfo.chip))}</div>` : '';
  const cfg = { w: f.w, h: f.h, fmt: f.key, ta: { x: T.x, y: T.y, w: T.w, h: T.h }, safe: f.safe, tones: TONES, tone, url: mod.brand.url, chip: roleInfo.chip, prize: !!roleInfo.prize, minMain: 40 };
  const html = `<!doctype html><html lang="cs"><head><meta charset="utf-8"><title>${esc(mod.brand.key)} ${f.key}</title>
<style>
${fonts.css}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${f.w}px;height:${f.h}px;overflow:hidden;background:${th.bg || '#000'}}
body{position:relative;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision;font-kerning:normal}
.scene{position:absolute;inset:0;overflow:hidden;transform-origin:50% 50%}
.abs{position:absolute}
.full{position:absolute;inset:0}
.t{position:absolute;white-space:nowrap}
.cy{position:absolute;inset:0}
#chrome{position:absolute;inset:0;z-index:10;pointer-events:none}
#ta-logo,#ta-sh,#ta-sh2{position:absolute;left:${px(I.x)};top:${px(I.y)};width:${px(I.w)};height:${px(I.h)}}
#ta-sh,#ta-sh2{background:url(${taUrl}) center/100% 100% no-repeat}
#ta-sh{filter:brightness(0) blur(3px)}
#ta-sh2{filter:brightness(0) blur(14px)}
#ta-scrim{position:absolute;left:${px(T.x - T.w * 0.18)};top:${px(T.y - T.h * 0.7)};width:${px(T.w * 1.36)};height:${px(T.h * 2.4)};background:radial-gradient(closest-side,rgba(6,10,20,.5),rgba(6,10,20,.22) 60%,rgba(6,10,20,0))}
#ta-logo-box{position:absolute;left:${px(T.x)};top:${px(T.y)};width:${px(T.w)};height:${px(T.h)}}
.ch{position:absolute;white-space:nowrap;overflow:hidden;text-shadow:${ch.shadow}}
#ch-url{left:${px(L.url.x)};top:${px(L.url.y)};width:${px(L.url.w)};height:${px(L.url.h)};font:${ch.urlW} ${f.url}px/${px(L.url.h)} ${ch.urlFont};letter-spacing:-.01em;color:${ch.url};text-align:right}
#ch-chip{display:inline-flex;align-items:center;gap:.6em;padding:0 1.05em 0 .85em;border-radius:999px;background:${ch.chipBg};border:1.5px solid ${ch.chipLine};color:${ch.chipFg};letter-spacing:.07em;text-transform:uppercase;text-shadow:none;backdrop-filter:blur(10px);box-shadow:0 6px 24px rgba(0,0,0,.25)}
.ch-dot{display:block;flex:none;width:.5em;height:.5em;border-radius:50%;background:${ch.dot};box-shadow:0 0 0 .18em ${hex2rgba(ch.dot.startsWith('#') ? ch.dot : '#e31e24', 0.25)}}
#ch-event{left:${px(L.event.x)};top:${px(L.event.y)};width:${px(L.event.w)};height:${px(L.event.h)};font:600 ${f.event}px/${px(L.event.h)} Montserrat;color:${ch.event};padding-left:${px(f.event * 1.5)}}
#ch-event::before{content:"";position:absolute;left:0;top:50%;width:${px(f.event * 1.05)};height:3px;margin-top:-1px;background:${EVENT.ta.red}}
#ch-event .ch-ev1{font-weight:800}
#ch-event .ch-sep{font-style:normal;padding:0 .45em;opacity:.7}
#draft{position:absolute;right:8px;bottom:6px;font:600 14px Inter;color:rgba(255,255,255,.5);letter-spacing:.1em;z-index:11}
${css}
</style></head><body>
${scenesHtml}
<div id="chrome">
  <i id="ta-scrim"></i><i id="ta-sh2"></i><i id="ta-sh"></i><img id="ta-logo" src="${taUrl}" alt="Trout Area Czech Republic"><i id="ta-logo-box"></i>
  <div id="ch-url" class="ch" data-fit="18"${urlIcon ? ' style="display:flex;justify-content:flex-end;align-items:center"' : ''}>${urlIcon}${urlIcon ? `<span>${esc(mod.brand.url)}</span>` : esc(mod.brand.url)}</div>${roleHtml}
  ${chipHtml}
  <div id="ch-event" class="ch" data-fit="14">${evHtml}</div>
</div>
${draft ? `<div id="draft">DRAFT · ${esc(mod.brand.key)} · ${f.key}</div>` : ''}
<script>window.__CFG=${JSON.stringify(cfg)};</script>
<script>${RUNTIME}</script>
</body></html>`;
  return { html, E, L, missingFonts: fonts.missing };
}
