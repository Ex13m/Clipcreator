// MČR 2026 Trout Area · prezentace partnerů · 9:16 · HyperFrames generátor
//
//   node scripts/build.mjs                      → proto/9x16/index.html            (celý film)
//   BLOCK=troutshop node scripts/build.mjs      → proto/banner_troutshop/index.html (8 s banner, čistý nástup/odchod)
//   BLOCK=troutshop LOOP=1 node scripts/build.mjs → proto/banner_troutshop_loop/index.html (6 s bezešvá smyčka)
//   BLOCK=all [LOOP=1] node scripts/build.mjs   → všechny bannery (+ smyčky)
//   ORDER=intro,venue,… přepíše pořadí · FINAL=1 bez DRAFT · CLICK=1 metronom místo tichého tracku · VER=v2
//
// Vzhled: data/tokens.json (+ volitelně design/tokens.json jako přepis) · obsah: data/content.json
// Čas: audio/track.wav + audio/track.beats.json, jinak syntetická mřížka 120 BPM (doba 0,5 s, takt 2 s, blok 4 takty = 8 s).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROJ = path.resolve(ROOT, '..');
const SHARED = path.join(PROJ, '_shared/brand');
const PROTO = path.join(ROOT, 'proto');
const PA = path.join(PROTO, 'assets');
const ENV = process.env;
const rd = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const exists = (f) => { try { fs.accessSync(f); return true; } catch { return false; } };
const J = (v) => JSON.stringify(v);
const f3 = (n) => (+n).toFixed(3);
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const rnd = (seed) => { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); };
// česká typografie: jednopísmenné předložky/spojky a čísla s jednotkou nezůstanou na konci řádku (NBSP)
const nb = (s) => String(s ?? '')
  .replace(/(^|[\s(„])([vkszouaiVKSZOUAI])\s+/g, '$1$2 ').replace(/(^|[\s(„])([vkszouaiVKSZOUAI])\s+/g, '$1$2 ')
  .replace(/(\d)\s(?=\d{3}\b)/g, '$1 ').replace(/(\d)\s(?=(m|g|l|h|ha|s|ks|Kč)\b)/g, '$1 ').replace(/\bn\.\s(?=m\.)/g, 'n. ');

// ======================================================================================
// TOKENS (jediné místo pro vzhled) + volitelný přepis z design panelu
// ======================================================================================
const deepMerge = (a, b) => { for (const [k, v] of Object.entries(b || {})) a[k] = v && typeof v === 'object' && !Array.isArray(v) ? deepMerge(a[k] || {}, v) : v; return a; };
const TK = rd(path.join(ROOT, 'data/tokens.json'));
const DESIGN_TOKENS = path.join(ROOT, 'design/tokens.json');
if (exists(DESIGN_TOKENS)) { deepMerge(TK, rd(DESIGN_TOKENS)); console.log('tokens: + design/tokens.json'); }
if (exists(path.join(ROOT, 'design/DESIGN.md'))) console.log('design/DESIGN.md existuje → převést do design/tokens.json (viz TODO)');
const C = rd(path.join(ROOT, 'data/content.json'));
const W = TK.canvas.w, H = TK.canvas.h, SF = TK.safe, CO = TK.color, TY = TK.type, LY = TK.layout, MO = TK.motion, EA = MO.ease, DU = MO.dur;
const CW = W - SF.left - SF.right;          // plná šířka obsahu
const CWU = W - SF.left - SF.uiRight;        // šířka obsahu pod sloupcem UI akcí (y > uiRightFromY)
const VER = ENV.VER || C.meta.version;
const FINAL = !!ENV.FINAL;

// ======================================================================================
// ASSETY: content.json → proto/assets/ (resize/trim přes scripts/stage_assets.py)
// ======================================================================================
const IMG_RE = /\.(png|jpe?g|webp)$/i;
const dstOf = (rel) => {
  if (rel.startsWith('brand/')) return 'assets/' + rel;
  if (rel.startsWith('assets/')) return rel;
  if (rel.startsWith('assets_prep/')) return 'assets/prep/' + rel.slice('assets_prep/'.length);   // výřezy/b-roll z assets_prep (bez kolizí jmen)
  if (rel.startsWith('drone/') || /\.(mp4|mov|webm)$/i.test(rel)) return 'assets/venue/' + path.basename(rel);
  if (rel.startsWith('../')) return 'assets/broll/' + path.basename(rel);
  return 'assets/misc/' + path.basename(rel);
};
const thumbOf = (rel) => 'assets/thumbs/' + rel.replace(/^assets\//, '').replace(/[\/]/g, '_');   // náhledy pro pady
const srcOf = (rel) => (rel.startsWith('brand/') ? path.join(SHARED, rel.slice(6)) : path.join(ROOT, rel));
function stageAll() {
  fs.mkdirSync(PA, { recursive: true });
  // značka (kopie 1:1)
  for (const d of ['fonts', 'gh']) {
    fs.mkdirSync(path.join(PA, d === 'gh' ? 'brand/gh' : d), { recursive: true });
    for (const f of fs.readdirSync(path.join(SHARED, d))) fs.copyFileSync(path.join(SHARED, d, f), path.join(PA, d === 'gh' ? 'brand/gh' : d, f));
  }
  fs.copyFileSync(path.join(SHARED, 'fonts.css'), path.join(PA, 'fonts.css'));
  fs.mkdirSync(path.join(PA, 'brand'), { recursive: true });
  for (const f of ['ta_logo_h.png', 'logo-TACR2-ready.png', 'grain.png']) fs.copyFileSync(path.join(SHARED, f), path.join(PA, 'brand', f));
  const gsapSrc = [path.join(PROJ, 'hb-battle-2026/node_modules/gsap/dist/gsap.min.js'), path.join(PROJ, 'klonowiec-2026/proto/assets/gsap.min.js')].find(exists);
  fs.copyFileSync(gsapSrc, path.join(PA, 'gsap.min.js'));
  // obrázky z content.json
  const jobs = new Map();
  const add = (rel, key) => {
    const dst = dstOf(rel), src = srcOf(rel);
    if (!exists(src)) { if (!/drone\/final/.test(rel)) console.warn('  ! chybí asset', rel); return; }
    const logo = /(^|\/)logo[^/]*\.png$|logo_layer_/.test(rel);
    jobs.set(dst, { src, dst: path.join(PROTO, dst), trim: logo && !/logo_layer_/.test(rel), maxSide: logo ? 1200 : /broll|\.\.\//.test(rel) || /bg|photo|sportak|poster|fallback/.test(key) ? 1920 : 1400 });
  };
  const walk = (o, key = '') => { if (typeof o === 'string') { if (IMG_RE.test(o)) { add(o, key); if (key === 'src') jobs.set(thumbOf(o), { src: srcOf(o), dst: path.join(PROTO, thumbOf(o)), trim: false, maxSide: 420 }); } } else if (Array.isArray(o)) o.forEach((v) => walk(v, key)); else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) walk(v, k); };
  walk(C.blocks);
  add(TK.plate.src, 'logo');
  const man = JSON.parse(execFileSync('python3', [path.join(ROOT, 'scripts/stage_assets.py')], { input: J([...jobs.values()]), maxBuffer: 1 << 24 }).toString());
  const M = {};
  for (const [abs, wh] of Object.entries(man)) M[path.relative(PROTO, abs)] = wh;
  return M;
}
const MAN = stageAll();
let APFX = '';                                           // '' v rootu, '../' v compositions/<blok>.html
const A = (rel) => APFX + (rel.startsWith('assets/thumbs/') ? rel : dstOf(rel));
const dims = (rel) => MAN[dstOf(rel)] || [1000, 500];
const has = (rel) => exists(srcOf(rel));

// ======================================================================================
// BEAT GRID: skutečný track (beats.json) nebo syntetická mřížka
// ======================================================================================
const BPB = C.music.beatsPerBar || 4;
function loadGrid(needBars) {
  const bf = path.join(ROOT, C.music.beats), tf = path.join(ROOT, C.music.track);
  let beats, real = false, trackDur = 0;
  if (exists(bf) && exists(tf)) {
    const g = rd(bf); real = true; trackDur = g.duration;
    beats = [...g.beats];
    const iv = beats.slice(1).map((t, i) => t - beats[i]).sort((a, b) => a - b)[Math.floor((beats.length - 1) / 2)];
    const ph = beats.indexOf(g.downbeats[0]);                        // fáze první sudé doby
    while (beats[0] - iv > -1e-6) beats.unshift(+(beats[0] - iv).toFixed(4)); // prodloužit k 0
    const k0 = (ph + Math.round((g.beats[0] - beats[0]) / iv)) % BPB;
    while (beats.length < (needBars + 4) * BPB + k0) beats.push(+(beats[beats.length - 1] + iv).toFixed(4));
    const downbeats = beats.filter((_, i) => i % BPB === k0);
    return { beats, downbeats, beat: iv, real, trackDur };
  }
  const b = 60 / C.music.bpm, n = (needBars + 4) * BPB;
  beats = Array.from({ length: n }, (_, i) => +(i * b).toFixed(4));
  return { beats, downbeats: beats.filter((_, i) => i % BPB === 0), beat: b, real, trackDur };
}

// ======================================================================================
// PLAN: pořadí bloků → časy na sudých dobách
// ======================================================================================
const ORDER = (ENV.ORDER ? ENV.ORDER.split(',') : C.order).map((s) => s.trim()).filter(Boolean);
for (const k of ORDER) if (!C.blocks[k]) throw new Error('neznámý blok ' + k);
const G = loadGrid(ORDER.reduce((s, k) => s + C.blocks[k].bars, 0) + (C.music.offsetBars || 0));
const FILM0 = G.downbeats[C.music.offsetBars || 0];             // čas tracku, kde film začíná
function planFilm() {
  let bar = C.music.offsetBars || 0; const P = [];
  const sponsors = ORDER.filter((k) => C.blocks[k].type === 'sponsor');
  for (const key of ORDER) {
    const B = C.blocks[key];
    P.push({ key, B, bar0: bar, t0: +(G.downbeats[bar] - FILM0).toFixed(4), t1: +(G.downbeats[bar + B.bars] - FILM0).toFixed(4), idx: sponsors.indexOf(key), nSp: sponsors.length });
    bar += B.bars;
  }
  return P;
}

// ======================================================================================
// BUILD jedné kompozice (film / banner / loop)
// ======================================================================================
function build({ block = null, loop = false } = {}) {
  const FILM = planFilm();
  const mode = block ? (loop ? 'loop' : 'banner') : 'film';
  let plan, DUR, trackOffset;
  if (!block) { plan = FILM; DUR = plan[plan.length - 1].t1; trackOffset = FILM0; }
  else {
    const p = FILM.find((x) => x.key === block) || (() => { const B = C.blocks[block]; if (!B) throw new Error('neznámý blok ' + block); return { key: block, B, bar0: 0, t0: 0, t1: B.bars * BPB * G.beat, idx: -1, nSp: 0 }; })();
    const bars = loop ? 3 : (['intro', 'finale'].includes(p.B.type) ? p.B.bars : Math.min(4, p.B.bars) || 4);
    const tEnd = G.downbeats[p.bar0 + bars] - G.downbeats[p.bar0];
    plan = [{ ...p, t0: 0, t1: +tEnd.toFixed(4), banner: true }];
    DUR = plan[0].t1; trackOffset = FILM0 + p.t0;
  }
  // doby a sudé doby v čase kompozice
  const shift = (t) => +(t - trackOffset).toFixed(4);
  const BEATS = G.beats.map(shift).filter((t) => t >= -1e-6 && t < DUR - 1e-6);
  const DOWN = G.downbeats.map(shift).filter((t) => t >= -1e-6 && t < DUR - 1e-6);
  const BEAT = G.beat;

  const out = [];                 // GSAP řádky ROOT timeline (perzistentní vrstva, přelety loga)
  let cur = out;                  // cíl emitorů: root nebo právě stavěný blok (sub-kompozice)
  const css = [];                 // CSS bloků
  const audio = [];
  const report = [];
  // T = nástup (immediateRender → prvek skrytý do svého času), R = opakované / pulzy (bez immediateRender)
  const T = (sel, from, to, pos) => cur.push(`tl.fromTo(${J(sel)}, ${J(from)}, ${J(to)}, ${f3(pos)});`);
  const R = (sel, from, to, pos) => cur.push(`tl.fromTo(${J(sel)}, ${J(from)}, ${J({ ...to, immediateRender: false })}, ${f3(pos)});`);
  const S = (sel, vars, pos) => cur.push(`tl.set(${J(sel)}, ${J(vars)}, ${f3(pos)});`);
  const RG = (sel, from, to, pos) => out.push(`tl.fromTo(${J(sel)}, ${J(from)}, ${J({ ...to, immediateRender: false })}, ${f3(pos)});`); // vždy root

  // ---------- logo pravidlo: logo partnera nikdy větší než naše ----------
  const [taW0, taH0] = dims(TK.plate.src);
  const TA = { w: TK.plate.logoW, h: Math.round((TK.plate.logoW * taH0) / taW0) };
  const PLATE = { x: SF.left, y: SF.top + 4, w: TA.w + 2 * TK.plate.padX, h: TA.h + 2 * TK.plate.padY };
  const logoFit = (rel, boxW, boxH, label, scale = 1) => {
    const [iw, ih] = dims(rel), ar = iw / ih, LR = TK.logoRule;
    let w = Math.min(boxW, boxH * ar, TA.w * LR.maxWidthRatio * scale);
    w = Math.min(w, Math.sqrt(TA.w * TA.h * LR.maxAreaRatio * scale * scale * ar));
    const h = w / ar;
    const ok = w <= TA.w + 0.5 && w * h <= TA.w * TA.h + 1;
    report.push(`${ok ? 'OK ' : 'XX '} ${label}: ${Math.round(w)}×${Math.round(h)} (TA ${TA.w}×${TA.h})`);
    if (!ok) throw new Error('LOGO RULE: ' + label);
    return { w: Math.round(w), h: Math.round(h) };
  };

  // ---------- text fit (odhad šířky Montserrat 900) ----------
  const chW = (c, up) => (c === ' ' || c === ' ' ? 0.28 : /[.,:;·!'’]/.test(c) ? 0.3 : /[0-9]/.test(c) ? 0.66 : /[–—-]/.test(c) ? 0.5 : up || /[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]/.test(c) ? (/[MWŠ]/.test(c) ? 0.98 : /[IÍ]/.test(c) ? 0.36 : 0.8) : /[mw]/.test(c) ? 0.92 : /[ijlí]/.test(c) ? 0.3 : 0.64);
  const textW = (s, size, up) => [...s].reduce((a, c) => a + chW(up ? c.toUpperCase() : c, up), 0) * size;
  const lines = (s, size, maxW, up) => { const ws = s.split(' '); let n = 1, cur = 0; for (const w of ws) { const ww = textW(w, size, up), sp = 0.28 * size; if (cur && cur + sp + ww > maxW) { n++; cur = ww; } else cur += (cur ? sp : 0) + ww; if (ww > maxW) return 99; } return n; };
  const fit = (s, maxW, maxLines, sizes, up = true) => sizes.find((z) => lines(s, z, maxW, up) <= maxLines) || sizes[sizes.length - 1];

  // ---------- kontext bloku ----------
  const mkCtx = (p) => {
    const { key } = p, g = p.t0, t0 = 0, t1 = +(p.t1 - p.t0).toFixed(4);
    const bb = BEATS.filter((t) => t >= g - 1e-6 && t < p.t1 - 1e-6).map((t) => +(t - g).toFixed(4));
    const db = DOWN.filter((t) => t >= g - 1e-6 && t < p.t1 - 1e-6).map((t) => +(t - g).toFixed(4));
    return {
      ...p, g, t0, t1, mode, loop: mode === 'loop', banner: mode !== 'film', dur: t1 - t0,
      id: (s) => `${key}-${s}`, sel: (s) => `#b-${key} ${s}`,
      beat: (i) => (i < bb.length ? bb[i] : t0 + i * BEAT), bar: (i) => (i < db.length ? db[i] : t0 + i * BPB * BEAT),
      beats: bb, downs: db, nBeats: bb.length, nBars: db.length,
    };
  };

  // ======================================================================================
  // SDÍLENÉ STAVEBNÍ PRVKY
  // ======================================================================================
  const plateFly = (ctx, toHero, t, d = DU.fly, heroY = TK.plate.heroY) => {
    const s = TK.plate.heroScale, tx = (W - PLATE.w * s) / 2 - PLATE.x, ty = heroY - PLATE.y;
    const A0 = toHero ? { x: 0, y: 0, scale: 1 } : { x: tx, y: ty, scale: s }, A1 = toHero ? { x: tx, y: ty, scale: s } : { x: 0, y: 0, scale: 1 };
    RG('#plate', A0, { ...A1, duration: d, ease: EA.fly }, ctx.g + t);
    report.push(`plate ${toHero ? '→ hero' : '→ roh'} @${f3(ctx.g + t)} (hero ${Math.round(PLATE.w * s)}×${Math.round(PLATE.h * s)})`);
  };
  // řádky s maskou (span vyjede zespodu)
  const rise = (sel, t, d = DU.in) => T(sel, { yPercent: 112, opacity: 0 }, { yPercent: 0, opacity: 1, duration: d, ease: EA.in }, t);
  const pop = (sel, t, d = DU.in) => T(sel, { opacity: 0, scale: 0.86, y: 24 }, { opacity: 1, scale: 1, y: 0, duration: d, ease: EA.pop }, t);
  const leave = (sel, t, d = DU.out) => R(sel, { opacity: 1, y: 0 }, { opacity: 0, y: -36, duration: d, ease: EA.out }, t);
  const punch = (sel, t, k = MO.punchScale, d = DU.punch) => R(sel, { scale: k }, { scale: 1, duration: d, ease: EA.punch }, t);
  const flashEl = (sel, t, lv = 1.7, d = DU.pad) => R(sel, { filter: `brightness(${lv})` }, { filter: 'brightness(1)', duration: d, ease: EA.punch }, t);
  // pomalý drift přes celý blok (zoom pozadí, marquee); ve smyčce tam a zpět → konec = začátek, šev bez skoku
  const drift = (ctx, sel, from, to) => {
    if (!ctx.loop) return T(sel, from, { ...to, duration: ctx.dur, ease: 'none' }, ctx.t0);
    const h = ctx.dur / 2;
    T(sel, from, { ...to, duration: h, ease: EA.soft }, ctx.t0);
    R(sel, to, { ...from, duration: h, ease: EA.soft }, ctx.t0 + h);
  };

  const kicker = (ctx, label) => `<div class="kick" id="${ctx.id('kick')}"><b>${esc(label)}</b>${ctx.idx >= 0 && !ctx.banner ? `<i>${String(ctx.idx + 1).padStart(2, '0')} / ${String(ctx.nSp).padStart(2, '0')}</i>` : ''}</div>`;
  const img = (rel, pos = '50% 50%', fitm = 'cover', extra = '', idA = '') => `<img class="im"${idA ? ` id="${idA}"` : ''} src="${A(rel)}" alt="" style="object-fit:${fitm}; object-position:${pos};${extra}">`;
  // contain → scale-down: malé packshoty (Activefishing ~400–750 px, detaily Jigovky ~500 px) se nikdy nezvětšují
  const prodImg = (pr, thumb = false) => img(thumb ? thumbOf(pr.src) : pr.src, pr.pos || '50% 50%', pr.fit === 'cover' || pr.fit === 'zoom' ? 'cover' : 'scale-down', pr.fit === 'zoom' ? ` transform:scale(${pr.zoom || 1}); transform-origin:${pr.pos || '50% 50%'};` : '');

  // zprávy: 1 zpráva = 1 takt (film/banner: 4 zprávy · loop: první, druhá, poslední)
  const msgPick = (ctx, msgs) => (ctx.loop ? [msgs[0], msgs[1], msgs[msgs.length - 1]] : msgs.slice(0, Math.max(1, ctx.nBars)));
  const msgHtml = (ctx, B, msgs, opt = {}) => msgs.map((m, j) => {
    const cta = !!m.cta, up = !cta, mt = nb(m.t);
    const tz = cta ? fit(mt, CW, 1, [96, 84, 72, 64, 56], false) : fit(mt, CW, 2, [TY.msg + 8, TY.msg, TY.msg - 8, TY.msg - 14, 46]);
    const inner = m.benefits && B.benefits
      ? `<div class="chips">${B.benefits.map((b, i) => `<span id="${ctx.id(`chip${i}`)}">${esc(b)}</span>`).join('')}</div>`
      : `<div class="t${cta ? ' cta' : ''}" style="font-size:${tz}px"><span>${esc(mt)}</span></div>${m.s ? `<div class="s">${esc(nb(m.s))}</div>` : ''}${cta ? '<i class="ul"></i>' : ''}`;
    return `<div class="msg" id="${ctx.id(`m${j}`)}"${ctx.loop && j === 0 ? ' style="opacity:1"' : ''}>${inner}</div>`;
  }).join('');
  const msgAnim = (ctx, B, msgs) => {
    msgs.forEach((m, j) => {
      const s = `#${ctx.id(`m${j}`)}`, tin = j === 0 ? (ctx.loop ? ctx.t0 : ctx.beat(1)) : ctx.bar(j), tout = j < msgs.length - 1 ? ctx.bar(j + 1) : null;
      if (ctx.loop) {
        if (j > 0) S(s, { opacity: 1 }, tin);
        R(`${s} .t, ${s} .chips`, { y: 34, opacity: 0.4 }, { y: 0, opacity: 1, duration: 0.3, ease: EA.in }, tin);
        if (tout != null) S(s, { opacity: 0 }, tout);
      } else {
        T(s, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: 'none' }, tin);
        T(`${s} .t span, ${s} .chips`, { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: DU.in, ease: EA.in }, tin);
        if (m.s) T(`${s} .s`, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.4, ease: EA.in }, tin + BEAT * 0.5);
        if (m.cta) T(`${s} .ul`, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: EA.in }, tin + BEAT * 0.5);
        if (tout != null) leave(s, tout - 0.2, 0.2);
      }
      // chips = pady benefitů, rozsvěcují se po dobách
      if (m.benefits && B.benefits) {
        const t1 = tout ?? ctx.t1;
        ctx.beats.filter((t) => t >= tin - 1e-6 && t < t1 - 0.05).forEach((t, i) => flashEl(`#${ctx.id(`chip${i % B.benefits.length}`)}`, t, 1.6, 0.35));
      }
      // punch na každou sudou dobu, když je zpráva vidět
      if (!m.benefits) ctx.downs.filter((t) => t > tin + 0.05 && t < (tout ?? ctx.t1) - 0.05).forEach((t) => punch(`${s} .t`, t, 1.035));
    });
  };

  // hero dlaždice s produkty + řada padů (drum pady = náhledy produktů)
  const stepPlan = (ctx, n) => {
    const step = ctx.loop ? Math.max(1, Math.floor(ctx.nBeats / n)) : MO.productStepBeats;
    // loop: produkt 0 je vidět od t=0; film/banner: produkt 0 se ukáže s odkrytím dlaždice (doba 1), střídání od doby 2
    const steps = ctx.loop ? [] : [{ t: ctx.beat(1), k: 0, first: true }];
    for (let b = ctx.loop ? 0 : 2, s = ctx.loop ? 0 : 1; b < ctx.nBeats; b += step, s++) steps.push({ t: ctx.beat(b), k: s % n });
    return steps;
  };
  const heroHtml = (ctx, B, inner) => `<div class="hero" id="${ctx.id('hero')}"><div class="hin">${inner ?? B.products.map((p, k) => `<div class="pr" id="${ctx.id(`pr${k}`)}"${ctx.loop && k === 0 ? ' style="opacity:1"' : ''}><div class="pi">${prodImg(p)}</div></div>`).join('')}</div><i class="hl" id="${ctx.id('hl')}"></i></div>`;
  const padsHtml = (ctx, B) => { const n = B.products.length; const w = (CWU - (n - 1) * LY.padsGap) / n;
    return `<div class="pads" id="${ctx.id('pads')}">${B.products.map((p, k) => `<div class="pd" id="${ctx.id(`pd${k}`)}" style="width:${w.toFixed(1)}px"><div class="pdi">${prodImg({ ...p, fit: p.fit === 'cover' ? 'cover' : 'contain', pos: p.fit === 'cover' ? p.pos : '50% 50%' }, true)}</div><em>${String(k + 1).padStart(2, '0')}</em><i class="pl" id="${ctx.id(`pl${k}`)}"></i></div>`).join('')}</div>`; };
  const heroAnim = (ctx, B, opt = {}) => {
    const n = B.products.length, steps = stepPlan(ctx, n);
    let prev = ctx.loop ? 0 : -1;
    steps.forEach(({ t, k }, i) => {
      if (!opt.noProd && !(ctx.loop && i === 0)) { if (prev >= 0 && prev !== k) S(`#${ctx.id(`pr${prev}`)}`, { opacity: 0 }, t); S(`#${ctx.id(`pr${k}`)}`, { opacity: 1 }, t); }
      if (!opt.noProd) R(`#${ctx.id(`pr${k}`)} .pi`, { scale: 1.07 }, { scale: 1, duration: BEAT * 1.6, ease: EA.punch }, t);
      if (steps[i].first) { S(`#${ctx.id(`pd${k}`)}`, { '--on': 1 }, t); prev = k; return; }   // první zobrazení s odkrytím dlaždice: bez záblesku
      R(`#${ctx.id('hl')}`, { opacity: 0.32 }, { opacity: 0, duration: 0.3, ease: EA.punch }, t);
      // pad: rozsvítit aktivní, ostatní zhasnout
      if (prev >= 0 && prev !== k) S(`#${ctx.id(`pd${prev}`)}`, { '--on': 0 }, t);
      S(`#${ctx.id(`pd${k}`)}`, { '--on': 1 }, t);
      R(`#${ctx.id(`pl${k}`)}`, { opacity: 1 }, { opacity: 0.18, duration: 0.45, ease: EA.punch }, t);
      R(`#${ctx.id(`pd${k}`)}`, { scale: 1.08 }, { scale: 1, duration: 0.3, ease: EA.pop }, t);
      if (opt.onStep) opt.onStep(t, k, i);
      prev = k;
    });
    // mezi kroky: ostatní pady jemně „dýchají" na dobu (step sequencer)
    ctx.beats.forEach((t, bi) => { if (steps.some((s) => Math.abs(s.t - t) < 1e-3)) return; const k = bi % n; R(`#${ctx.id(`pl${k}`)}`, { opacity: 0.5 }, { opacity: 0, duration: 0.3, ease: EA.punch }, t); });
  };
  // nástup a odchod bloku (film/banner); loop je bez nich
  const enterSponsor = (ctx) => {
    const { beat } = ctx;
    T(`#${ctx.id('kick')}`, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.45, ease: EA.in }, ctx.t0 + 0.02);
    T(`#${ctx.id('lcard')}`, { opacity: 0, scale: 0.8, rotation: -4 }, { opacity: 1, scale: 1, rotation: 0, duration: DU.in, ease: EA.pop }, ctx.t0 + 0.04);
    T(`#${ctx.id('lmeta')}`, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: DU.in, ease: EA.in }, beat(1));
    T(`#${ctx.id('hero')}`, { clipPath: 'inset(100% 0% 0% 0% round 26px)' }, { clipPath: 'inset(0% 0% 0% 0% round 26px)', duration: 0.6, ease: EA.in }, beat(1));
    T(`#${ctx.id('pads')} .pd`, { opacity: 0, y: 40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: EA.pop, stagger: BEAT / 4 }, beat(2));
  };
  const exitBlock = (ctx, sels) => { const t = ctx.t1 - DU.out - 0.04; R(sels.join(', '), { opacity: 1, y: 0 }, { opacity: 0, y: -30, duration: DU.out, ease: EA.out, stagger: 0.02 }, t); };
  const pulseCard = (ctx) => ctx.downs.forEach((t, i) => { if (i === 0 && !ctx.loop) return; R(`#${ctx.id('lcard')}`, { boxShadow: '0 0 0 6px var(--acc), 0 18px 40px rgba(0,0,0,.35)' }, { boxShadow: '0 0 0 0px var(--acc), 0 18px 40px rgba(0,0,0,.35)', duration: 0.45, ease: EA.punch }, t); });

  // ======================================================================================
  // GENERICKÝ SPONZORSKÝ BLOK (layout + rytmus); signatury dodávají funkce jednotlivých partnerů
  // ======================================================================================
  function sponsor(ctx, B, X = {}) {
    const lb = { w: LY.logoCardH * 2.4, h: LY.logoCardH - 2 * LY.logoCardPad };
    const lg = logoFit(B.logo, Math.min(lb.w, TA.w), lb.h, `${ctx.key} (blok)`);
    const cardW = lg.w + 2 * LY.logoCardPad + 16;
    const msgs = msgPick(ctx, B.messages);
    const html = `
      ${X.bg || ''}
      ${kicker(ctx, X.kicker || 'Partner MČR 2026')}
      ${X.behindCard || ''}
      <div class="lcard ${B.logoCard}" id="${ctx.id('lcard')}" style="width:${cardW}px"><img src="${A(B.logo)}" alt="${esc(B.name)}" style="width:${lg.w}px; height:${lg.h}px"></div>
      <div class="lmeta" id="${ctx.id('lmeta')}" style="left:${SF.left + cardW + 28}px; width:${W - SF.right - (SF.left + cardW + 28)}px"><b>${esc(B.name)}</b><span>${esc(B.url)}</span>${X.meta || ''}</div>
      <div class="msgs" id="${ctx.id('msgs')}">${msgHtml(ctx, B, msgs)}</div>
      ${X.hero ?? heroHtml(ctx, B)}
      ${X.pads ?? padsHtml(ctx, B)}
      ${X.front || ''}`;
    if (!ctx.loop) enterSponsor(ctx);
    msgAnim(ctx, B, msgs);
    if (X.heroAnim) X.heroAnim(); else heroAnim(ctx, B, X.heroOpt);
    pulseCard(ctx);
    if (X.anim) X.anim();
    if (!ctx.loop) exitBlock(ctx, [`#${ctx.id('kick')}`, `#${ctx.id('lcard')}`, `#${ctx.id('lmeta')}`, `#${ctx.id('msgs')}`, `#${ctx.id('hero')}`, `#${ctx.id('pads')}`, ...(X.exitSel || [])]);
    const style = `--acc:${B.accent}; --acc2:${B.accent2 || B.accent}; --tile:${B.tileBg}`;
    return { html, cls: `sp${B.dark ? ' dark' : ''}`, style };
  }

  // ======================================================================================
  // BLOKY — jedna funkce na blok
  // ======================================================================================
  const BLOCKS = {
    // ---------------- INTRO 16 s: titul, datum, místo, 40 závodníků, TA hero ----------------
    intro(ctx, B) {
      const E = C.event, { bar, beat, id } = ctx;
      const st = E.stats;
      const html = `
        <div class="ibg" id="${id('bg')}"><div class="ibi" id="${id('bgi')}">${img(B.bg, '50% 60%')}</div></div>
        <div class="ph" id="${id('p0')}"><div class="ln k"><span>uvádí</span></div></div>
        <div class="ph" id="${id('p1')}">
          <div class="ln a"><span>${esc(E.title1.replace(/\s*ČR$/, ''))}</span></div>
          <div class="ln b"><span>ČR</span></div>
          <div class="ln c"><span>${esc(nb(E.title2))}</span></div></div>
        <div class="ph" id="${id('p2')}">
          <div class="ln d"><span>${esc(E.dateBig)}</span></div>
          <div class="ln e"><span>${esc(E.year)}</span><em>${esc(E.days)}</em></div>
          <div class="ln f"><span>${esc(E.place)}</span></div>
          <div class="ln g"><span>${esc(E.pond)}</span></div></div>
        <div class="ph" id="${id('p3')}"><div class="stats">${st.map((s, i) => `<div class="stp" id="${id(`st${i}`)}"><b id="${id(`sv${i}`)}">${typeof s.v === 'number' ? s.v : esc(s.v)}</b><span>${esc(s.l)}</span><i class="pl" id="${id(`sl${i}`)}"></i></div>`).join('')}</div></div>
        <div class="ph" id="${id('p4')}"><div class="ln h"><span>${esc(E.partnersTitle.split(' ')[0])}</span></div><div class="ln i"><span>${esc(E.partnersTitle.split(' ').slice(1).join(' '))}</span></div>
          <div class="names">${C.blocks.finale.wall.map((k) => `<span>${esc(C.blocks[k].name)}</span>`).join('')}</div></div>`;
      // pozadí: pomalý zoom + pulz na takt
      T(`#${id('bg')}`, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'none' }, ctx.t0);
      T(`#${id('bgi')}`, { scale: 1.18 }, { scale: 1.0, duration: ctx.dur, ease: 'none' }, ctx.t0);
      // takt 0: TA logo z rohu do hero
      plateFly(ctx, true, beat(1));
      rise(`#${id('p0')} .k span`, beat(3));
      leave(`#${id('p0')}`, bar(1) - 0.15, 0.15);
      // takty 1–2: MISTROVSTVÍ / ČR / v Trout Area 2026
      rise(`#${id('p1')} .a span`, bar(1)); T(`#${id('p1')} .b span`, { scale: 2.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'expo.out' }, bar(1) + BEAT * 2);
      rise(`#${id('p1')} .c span`, bar(2));
      [bar(2), bar(2) + BEAT * 2].forEach((t) => punch(`#${id('p1')} .b span`, t, 1.08));
      leave(`#${id('p1')}`, bar(3) - 0.22);
      // takty 3–4: datum a místo
      rise(`#${id('p2')} .d span`, bar(3)); rise(`#${id('p2')} .e span`, bar(3) + BEAT); T(`#${id('p2')} .e em`, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.4, ease: EA.in }, bar(3) + BEAT * 2);
      rise(`#${id('p2')} .f span`, bar(4)); rise(`#${id('p2')} .g span`, bar(4) + BEAT);
      leave(`#${id('p2')}`, bar(5) - 0.22);
      // takty 5–6: statistiky jako drum pady
      st.forEach((s, i) => pop(`#${id(`st${i}`)}`, bar(5) + i * BEAT * 0.5, 0.45));
      st.forEach((s, i) => { if (typeof s.v === 'number' && s.v > 2) out.push(`{ const o={v:0}, el=document.getElementById(${J(id(`sv${i}`))}); tl.fromTo(o,{v:0},{v:${s.v},duration:1.2,ease:"power2.out",immediateRender:false,onUpdate(){el.textContent=Math.round(o.v);}}, ${f3(bar(5) + i * BEAT * 0.5 + 0.1)}); }`); });
      ctx.beats.filter((t) => t >= bar(5) + BEAT * 2 && t < bar(7) - 0.1).forEach((t, i) => { R(`#${id(`sl${i % st.length}`)}`, { opacity: 0.9 }, { opacity: 0, duration: 0.35, ease: EA.punch }, t); R(`#${id(`st${i % st.length}`)}`, { scale: 1.05 }, { scale: 1, duration: 0.3, ease: EA.pop }, t); });
      leave(`#${id('p3')}`, bar(7) - 0.22);
      // takt 7: Partneři mistrovství → logo zpět do rohu
      rise(`#${id('p4')} .h span`, bar(7)); rise(`#${id('p4')} .i span`, bar(7) + BEAT * 0.5);
      // všech 8 jmen musí být celé vidět dřív, než přijdou fadery (dřív Bosset/GH jen ~0,3 s)
      T(`#${id('p4')} .names span`, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3, ease: EA.in, stagger: BEAT / 6 }, bar(7) + BEAT * 0.5);
      plateFly(ctx, false, bar(7) + BEAT * 1, DU.fly);
      if (ctx.banner) leave(`#${id('p4')}`, ctx.t1 - 0.36, 0.3);
      return { html, cls: 'intro' };
    },

    // ---------------- MÍSTO KONÁNÍ: Líheň Liběchov (dron nebo foto) ----------------
    venue(ctx, B) {
      const { id, beat, bar } = ctx;
      if (ENV.VENUE_VIDEO) B = { ...B, video: path.relative(ROOT, path.resolve(ENV.VENUE_VIDEO)) };   // test/přepis cesty k dronu
      const vid = B.video && has(B.video); let droneHtml = '', still = null, vdur = 0;
      const lg = logoFit(B.logo, LY.logoCardH, LY.logoCardH, 'venue (blok)');
      const msgs = msgPick(ctx, B.messages);
      const vb = { ...B, products: B.photos.map((p) => ({ ...p, fit: 'cover' })) };
      if (vid) {
        vdur = ffDur(srcOf(B.video));
        copyIfNewer(srcOf(B.video), path.join(PROTO, A(B.video)));
        // dron (≈4 s) je kratší než blok (8 s): podržet jeho poslední snímek místo střihu na zimní foto
        if (vdur > 0 && vdur < ctx.dur - 0.05) {
          const rel = 'drone/final/' + path.basename(B.video).replace(/\.[^.]+$/, '') + '_last.jpg', dst = path.join(PROTO, dstOf(rel));
          try {
            if (!exists(dst) || fs.statSync(dst).mtimeMs < fs.statSync(srcOf(B.video)).mtimeMs) { fs.mkdirSync(path.dirname(dst), { recursive: true }); execFileSync('ffmpeg', ['-v', 'error', '-y', '-sseof', '-0.15', '-i', srcOf(B.video), '-frames:v', '1', '-q:v', '2', dst]); }
            if (exists(dst)) { still = rel; report.push(`venue: po ${vdur}s drží poslední snímek dronu (${dstOf(rel)})`); }
          } catch (e) { report.push('venue: poslední snímek dronu se nepodařilo vytáhnout → foto'); }
        }
        droneHtml = `<video id="${id('drone')}" class="clip vfull" src="${A(B.video)}" muted playsinline data-start="0" data-duration="${f3(Math.min(vdur, ctx.dur))}" data-track-index="1"></video>`;
        report.push(`venue: dron ${B.video} (${vdur}s)`);
      } else report.push(`venue: dron chybí → foto ${B.fallback}`);
      const html = `
        <div class="vbg" id="${id('bg')}"><div class="vph${still ? ' freeze' : ''}" id="${id('vph')}">${img(still || B.fallback, '50% 50%')}</div>${droneHtml}</div>
        <div class="vshade"></div>
        ${kicker(ctx, B.kicker + ' · MČR 2026')}
        <div class="vlogo" id="${id('lcard')}"><img src="${A(B.logo)}" alt="${esc(B.name)}" style="width:${lg.w}px; height:${lg.h}px"></div>
        <div class="lmeta vname" id="${id('lmeta')}" style="left:${SF.left + lg.w + 34}px; width:${W - SF.right - (SF.left + lg.w + 34)}px"><b>${esc(B.name)}</b><span>${esc(B.url)}</span></div>
        <div class="msgs" id="${id('msgs')}">${msgHtml(ctx, B, msgs)}</div>
        <div class="vplace" id="${id('place')}"><i></i><span>${esc(nb(B.place))}</span></div>
        ${padsHtml(ctx, vb)}`;
      if (still) T(`#${id('vph')}`, { scale: 1 }, { scale: 1.05, duration: ctx.dur - vdur, ease: 'none' }, ctx.t0 + vdur);   // navazuje na konec dronu
      else drift(ctx, `#${id('vph')}`, { scale: 1.22, xPercent: -3 }, { scale: 1.04, xPercent: 3 }); // foto = záloha
      if (!ctx.loop) {
        T(`#${id('kick')}`, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.45, ease: EA.in }, ctx.t0 + 0.02);
        T(`#${id('lcard')}`, { opacity: 0, scale: 0.6, rotation: -60 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.7, ease: EA.pop }, ctx.t0 + 0.04);
        T(`#${id('lmeta')}`, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: DU.in, ease: EA.in }, beat(1));
        T(`#${id('place')}`, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: EA.in }, beat(3));
        T(`#${id('pads')} .pd`, { opacity: 0, y: 40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: EA.pop, stagger: BEAT / 4 }, beat(2));
      }
      msgAnim(ctx, B, msgs);
      // pady s fotkami: krok po 2 dobách, bez hero dlaždice (hero = dron/foto na pozadí)
      const n = vb.products.length, steps = stepPlan(ctx, n); let prev = ctx.loop ? 0 : -1;
      steps.forEach(({ t, k }) => { if (prev >= 0 && prev !== k) S(`#${id(`pd${prev}`)}`, { '--on': 0 }, t); S(`#${id(`pd${k}`)}`, { '--on': 1 }, t); R(`#${id(`pl${k}`)}`, { opacity: 1 }, { opacity: 0.18, duration: 0.45, ease: EA.punch }, t); R(`#${id(`pd${k}`)}`, { scale: 1.08 }, { scale: 1, duration: 0.3, ease: EA.pop }, t); prev = k; });
      ctx.downs.forEach((t, i) => { if (i || ctx.loop) R(`#${id('lcard')}`, { rotation: -8, scale: 1.06 }, { rotation: 0, scale: 1, duration: 0.45, ease: EA.pop }, t); });
      if (!ctx.loop) exitBlock(ctx, [`#${id('kick')}`, `#${id('lcard')}`, `#${id('lmeta')}`, `#${id('msgs')}`, `#${id('place')}`, `#${id('pads')}`]);
      return { html, cls: 'sp venue', style: `--acc:#17a1c8; --acc2:#d8af64; --tile:#0b1e42` };
    },

    // ---------------- 7 PARTNERŮ: společný layout + vlastní signatura ----------------
    troutshop(ctx, B) { // červené „vycházející slunce" z jejich loga za kartou loga, točí se a pulzuje na takt
      const r = `<div class="sun" id="${ctx.id('sun')}"><i></i></div>`;
      return sponsor(ctx, B, { behindCard: r, anim: () => {
        T(`#${ctx.id('sun')} i`, { rotation: 0 }, { rotation: 45, duration: ctx.dur, ease: 'none' }, ctx.t0);
        ctx.downs.forEach((t) => R(`#${ctx.id('sun')}`, { scale: 1.12, opacity: 1 }, { scale: 1, opacity: 0.75, duration: 0.6, ease: EA.punch }, t));
      }, exitSel: [`#${ctx.id('sun')}`] });
    },
    activefishing(ctx, B) { // benefity jako tři pady (v msgAnim) + oranžová linka přes dlaždici
      return sponsor(ctx, B, { front: `<i class="afl" id="${ctx.id('afl')}"></i>`, anim: () => {
        ctx.downs.forEach((t) => R(`#${ctx.id('afl')}`, { scaleX: 0, opacity: 1 }, { scaleX: 1, opacity: 0, duration: BEAT * 2, ease: EA.in }, t));
      } });
    },
    moonky(ctx, B) { // ruční výroba: makro foto nástrah jako rozmazané pozadí + HANDMADE LURES
      const bg = `<div class="sbg" id="${ctx.id('sbg')}">${img(B.bg, '50% 50%')}</div><div class="hm" id="${ctx.id('hm')}">Handmade lures</div>`;
      return sponsor(ctx, B, { bg, anim: () => {
        drift(ctx, `#${ctx.id('sbg')}`, { scale: 1.15 }, { scale: 1.0 });
        drift(ctx, `#${ctx.id('hm')}`, { xPercent: 0 }, { xPercent: -18 });
      } });
    },
    jigovky(ctx, B) { // barvy jigových hlaviček jako step-sequencer tečky vedle URL
      const dots = `<div class="jdots">${B.colors.map((c, i) => `<i id="${ctx.id(`jd${i}`)}" style="background:${c}"></i>`).join('')}</div>`;
      return sponsor(ctx, B, { meta: dots, anim: () => {
        ctx.beats.forEach((t, i) => R(`#${ctx.id(`jd${i % B.colors.length}`)}`, { scale: 1.7 }, { scale: 1, duration: 0.35, ease: EA.pop }, t));
      } });
    },
    velkaryba(ctx, B) { // „VŠE NA PŘÍVLAČ" jako obří obrysový pás v pozadí
      const mq = `<div class="mq" id="${ctx.id('mq')}">${Array.from({ length: 4 }, () => `<span>Vše na přívlač ·</span>`).join('')}</div>`;
      return sponsor(ctx, B, { bg: mq, anim: () => drift(ctx, `#${ctx.id('mq')}`, { x: 0 }, { x: -620 }) });
    },
    bosset(ctx, B) { // termosky v řadě = ekvalizér; aktivní termoska povyskočí
      const n = B.products.length;
      const lineup = `<div class="lineup">${B.products.map((p, k) => `<div class="th" id="${ctx.id(`th${k}`)}"><div class="pi">${img(p.src, '50% 100%', 'contain')}</div></div>`).join('')}</div>`;
      return sponsor(ctx, B, { hero: heroHtml(ctx, B, lineup), heroAnim: () => {
        heroAnim(ctx, B, { noProd: true, onStep: (t, k) => R(`#${ctx.id(`th${k}`)}`, { y: -46, filter: 'brightness(1.15)' }, { y: 0, filter: 'brightness(1)', duration: BEAT * 1.8, ease: 'bounce.out' }, t) });
        ctx.beats.forEach((t, bi) => { const k = (bi * 2 + 1) % n; R(`#${ctx.id(`th${k}`)}`, { scaleY: 1.05 }, { scaleY: 1, duration: 0.3, ease: EA.punch }, t); });
      } });
    },
    gausseholler(ctx, B) { // tmavé studio, otáčející se ozubené kolo GH za dlaždicí, oranžová Black edice
      const ring = `<img class="ghr" id="${ctx.id('ghr')}" src="${A(B.ring)}" alt="">`;
      return sponsor(ctx, B, { bg: ring, kicker: 'Partner MČR 2026 · Custom Lab', anim: () => {
        T(`#${ctx.id('ghr')}`, { rotation: 0 }, { rotation: 60, duration: ctx.dur, ease: 'none' }, ctx.t0);   // prstenec má 6 zubů → 60° = bezešvá smyčka
        ctx.downs.forEach((t) => R(`#${ctx.id('ghr')}`, { scale: 1.06 }, { scale: 1, duration: 0.5, ease: EA.punch }, t));
      } });
    },

    // ---------------- B-ROLL: krátký střih fotek z rybaření na doby ----------------
    broll(ctx, B) {
      const { id } = ctx;
      const html = B.photos.map((p, k) => `<div class="bp" id="${id(`bp${k}`)}"${k === 0 ? ' style="opacity:1"' : ''}><div class="bpi">${img(p, '50% 40%')}</div></div>`).join('') + '<div class="bshade"></div>';
      const bb = ctx.beats.length ? ctx.beats : [ctx.t0];
      bb.forEach((t, i) => { const k = i % B.photos.length; if (i) { S(`#${id(`bp${(i - 1) % B.photos.length}`)}`, { opacity: 0 }, t); S(`#${id(`bp${k}`)}`, { opacity: 1 }, t); }
        R(`#${id(`bp${k}`)} .bpi`, { scale: 1.16 }, { scale: 1.04, duration: BEAT, ease: EA.punch }, t); });
      return { html, cls: 'broll' };
    },

    // ---------------- FINÁLE 16 s: díky, logo wall (drum pady), TA hero, MADE BY GH ----------------
    finale(ctx, B) {
      const { id, bar, beat } = ctx, E = C.event;
      const keys = B.wall.filter((k) => C.blocks[k]);
      const cols = 2, rows = Math.ceil(keys.length / cols), gx = 20, gy = 18;
      const top = LY.kickerY + 72, bottom = H - SF.bottom - 30;
      const cw = (CWU - gx) / cols, chh = Math.min(200, (bottom - top - (rows - 1) * gy) / rows);
      const cards = keys.map((k, i) => {
        const b = C.blocks[k];
        const lg = logoFit(b.logo, cw - 48, chh - 66, `${k} (logo wall)`, TK.logoRule.wallScale);
        return `<div class="wc ${b.logoCard === 'dark' ? 'dark' : b.logoCard === 'none' ? 'dark' : 'light'}" id="${id(`wc${i}`)}" style="left:${(SF.left + (i % cols) * (cw + gx)).toFixed(1)}px; top:${(top + Math.floor(i / cols) * (chh + gy)).toFixed(1)}px; width:${cw.toFixed(1)}px; height:${chh.toFixed(1)}px; --acc:${b.accent || '#17a1c8'}"><img src="${A(b.logo)}" alt="${esc(b.name)}" style="width:${lg.w}px; height:${lg.h}px"><em>${esc(b.type === 'venue' ? 'Místo konání' : b.url)}</em><i class="pl" id="${id(`wl${i}`)}"></i></div>`;
      }).join('');
      const html = `
        <div class="ibg" id="${id('bg')}"><div class="ibi" id="${id('bgi')}">${img(B.bg, '50% 50%')}</div></div>
        <div class="ph" id="${id('p0')}"><div class="ln a"><span>${esc(E.thanks1)}</span></div><div class="ln b"><span>${esc(E.thanks2)}</span></div></div>
        <div class="ph" id="${id('p1')}"><div class="wt" id="${id('wt')}"><b>${esc(E.thanks1)} ${esc(E.thanks2)}</b><span>MČR ${esc(E.year)}</span></div>${cards}</div>
        <div class="ph" id="${id('p2')}">
          <div class="ln c"><span>${esc(E.title1)} ${esc(E.title2)}</span></div>
          <div class="ln d"><span>${esc(E.date)} · ${esc(E.place)}</span></div>
          <div class="ln e"><span>${esc(E.web)}</span></div>
          <div class="ghm" id="${id('ghm')}"><span class="by">${esc(B.made.by)}</span><span class="gear"><img class="ring" id="${id('ring')}" src="${A('brand/gh/ring.png')}" alt=""><img class="core" src="${A('brand/gh/core.png')}" alt=""></span><span class="by">${esc(B.made.c)} ${esc(B.made.name)}</span></div></div>`;
      T(`#${id('bg')}`, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'none' }, ctx.t0);
      T(`#${id('bgi')}`, { scale: 1.0 }, { scale: 1.15, duration: ctx.dur, ease: 'none' }, ctx.t0);
      // takty 0–1: Děkujeme partnerům
      rise(`#${id('p0')} .a span`, ctx.t0 + 0.02); T(`#${id('p0')} .b span`, { scale: 1.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'expo.out' }, beat(2));
      punch(`#${id('p0')} .b span`, bar(1), 1.08);
      leave(`#${id('p0')}`, bar(2) - 0.22);
      // takty 2–5: logo wall jako drum pady
      T(`#${id('wt')}`, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.4, ease: EA.in }, bar(2));
      keys.forEach((_, i) => pop(`#${id(`wc${i}`)}`, bar(2) + i * BEAT / 2, 0.45));
      ctx.beats.filter((t) => t >= bar(2) + BEAT * 4 && t < bar(6) - 0.1).forEach((t, i) => { const k = i % keys.length;
        R(`#${id(`wl${k}`)}`, { opacity: 1 }, { opacity: 0, duration: 0.45, ease: EA.punch }, t); R(`#${id(`wc${k}`)}`, { scale: 1.06 }, { scale: 1, duration: 0.3, ease: EA.pop }, t); });
      ctx.downs.filter((t) => t >= bar(3) && t < bar(6)).forEach((t) => R(`#${id('p1')} .wc`, { filter: 'brightness(1.25)' }, { filter: 'brightness(1)', duration: 0.4, ease: EA.punch }, t));
      R(`#${id('p1')}`, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.94, duration: 0.35, ease: EA.out }, bar(6) - 0.3);
      // takty 6–7: TA hero + titul + MADE BY GH
      plateFly(ctx, true, bar(6), DU.fly, TK.plate.heroY + 80);
      rise(`#${id('p2')} .c span`, bar(6) + BEAT * 2); rise(`#${id('p2')} .d span`, bar(6) + BEAT * 3); rise(`#${id('p2')} .e span`, bar(7));
      T(`#${id('ghm')}`, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: EA.in }, bar(7) + BEAT);
      T(`#${id('ring')}`, { rotation: 0 }, { rotation: 140, duration: ctx.t1 - bar(7), ease: 'none' }, bar(7));
      return { html, cls: 'finale' };
    },
  };

  // ======================================================================================
  // SESTAVENÍ
  // ======================================================================================
  const hosts = [];          // sloty sub-kompozic v rootu
  const subs = [];           // soubory compositions/<blok>.html
  const transitions = [];   // časy přechodů (fadery)
  const phraseT = [];       // silný flash: začátky bloků
  plan.forEach((p, i) => {
    const ctx = mkCtx(p);
    const fn = BLOCKS[p.B.fn] || BLOCKS[p.B.type] || BLOCKS[p.key];
    if (!fn) throw new Error('chybí funkce bloku ' + p.key);
    const bout = []; cur = bout; APFX = '';   // sub-kompozice: cesty relativní ke kořeni projektu (assets/…)
    const r = fn(ctx, p.B);
    cur = out; APFX = '';
    const d = f3(p.t1 - p.t0);
    subs.push({ key: p.key, html: `<!doctype html>
<html lang="cs"><head><meta charset="UTF-8" /><title>${esc(p.key)} · MČR 2026 blok</title></head>
<body><template>
<div id="b-${p.key}" data-composition-id="${p.key}" data-width="${W}" data-height="${H}" data-duration="${d}">
  <div id="bw-${p.key}" class="blk ${r.cls || ''}"${r.style ? ` style="${r.style}"` : ''}>${r.html}
  </div>
</div>
<script>
  const tl = gsap.timeline({ paused: true });
  ${bout.join('\n  ')}
  tl.set({}, {}, ${d});
  window.__timelines[${J(p.key)}] = tl;
</script>
</template></body></html>
` });
    hosts.push(`<div id="el-${p.key}" class="host" data-composition-id="${p.key}" data-composition-src="compositions/${p.key}.html" data-start="${f3(p.t0)}" data-duration="${d}" data-track-index="${2 + (i % 2)}" data-width="${W}" data-height="${H}"></div>`);
    phraseT.push(p.t0);
    const prev = plan[i - 1];
    if (prev && TK.transition.style === 'fader' && prev.B.type !== 'broll' && p.B.type !== 'broll') transitions.push(p.t0);
    // VO slot
    // 6 s smyčka je bez VO (script_cs: „6 s loop = bez VO“) — jinak by se věta usekla v 5,75 s a opakovala s každou smyčkou
    const vo = p.B.type === 'broll' || mode === 'loop' ? null : ['wav', 'mp3', 'm4a'].map((e) => path.join(ROOT, C.vo.dir, `${p.key}.${e}`)).find(exists);
    if (vo) {
      const dst = `assets/vo/${path.basename(vo)}`; copyIfNewer(vo, path.join(PROTO, dst));
      const d = Math.min(ffDur(vo), p.t1 - p.t0 - C.vo.offset);
      audio.push(`<audio id="vo-${p.key}" src="${dst}" data-start="${f3(p.t0 + C.vo.offset)}" data-duration="${f3(d)}" data-track-index="${11 + (i % 2)}" data-volume="${C.vo.volume}"></audio>`);
      report.push(`VO ${p.key}: ${path.basename(vo)} ${d.toFixed(2)} s`);
    } else if (p.B.type !== 'broll' && mode !== 'loop') report.push(`VO ${p.key}: — (slot vo/${p.key}.wav)`);
  });
  if (mode === 'banner' && plan[0].B.type !== 'finale') transitions.push(DUR);       // čistý odchod: fadery zakryjí poslední takt (finále končí na TA hero)
  // hudba: skutečný track (s offsetem) nebo tichý/klik placeholder
  if (G.real) {
    const dst = 'assets/audio/track.wav'; copyIfNewer(path.join(ROOT, C.music.track), path.join(PROTO, dst));
    audio.unshift(`<audio id="music" src="${dst}" data-start="0" data-duration="${f3(DUR)}" data-media-start="${f3(trackOffset)}" data-track-index="10" data-volume="${C.music.volume}"></audio>`);
  } else {
    const ph = ENV.CLICK ? 'assets/audio/placeholder_click_120.wav' : 'assets/audio/placeholder_silence.wav';
    writePlaceholder(path.join(PROTO, ph), Math.max(DUR, 180), !!ENV.CLICK, BEAT);
    audio.unshift(`<audio id="music" src="${ph}" data-start="0" data-duration="${f3(DUR)}" data-track-index="10" data-volume="${ENV.CLICK ? 0.6 : 1}"></audio>`);
  }

  // ---------- perzistentní vrstva: driver (pady, EQ, fadery, flash, zrno) — vše z času t, seek-safe ----------
  const isDown = BEATS.map((t) => DOWN.some((d) => Math.abs(d - t) < 0.02));
  const FD = MO.fader, nF = FD.n;
  const fHeights = Array.from({ length: nF }, (_, i) => +(FD.minH + rnd(i + 3) * (1 - FD.minH)).toFixed(3));
  const RIG = { B: BEATS, D: isDown.map((x) => (x ? 1 : 0)), P: phraseT.filter((t) => t > 0.05 || mode !== 'film'), X: transitions, H: fHeights, dur: DUR,
    fl: MO.flash, fd: FD, eqFloor: TK.rig.eq.floor, gfps: TK.rig.grainFps, loop: mode === 'loop', tk: TK.rig.ticker?.on ? TK.rig.ticker.pxPerSec : 0 };
  out.push(`(function(){ const R=${J(RIG)};
    const q=(s)=>Array.from(document.querySelectorAll(s));
    const pads=q('#pads b'), eq=q('#eq i'), fb=q('#wipe .fb'), fc=q('#wipe .fc'), gr=document.getElementById('grain'), fl=document.getElementById('flash'), tk=document.getElementById('tk-in'), seg=document.getElementById('tk-seg');
    const rnd=(s)=>{const x=Math.sin(s*9301+49297)*233280; return x-Math.floor(x);};
    const bi=(t)=>{ const B=R.B; if(!B.length||t<B[0]-1e-4) return -1; let lo=0,hi=B.length-1; while(lo<hi){const m=(lo+hi+1)>>1; if(B[m]<=t+1e-4) lo=m; else hi=m-1;} return lo; };
    const eo=(x)=>1-Math.pow(1-x,3), ei=(x)=>x*x*x;
    function fader(t,c){ let lv=0; const F=R.fd, mid=(R.H.length-1)/2;
      for(const X of R.X){ const s=X-F.lead+Math.abs(c-mid)*F.spread, a=t-s; if(a<0||a>F.rise+F.hold+F.fall+0.05) continue;
        let v= a<F.rise ? eo(a/F.rise) : a<F.rise+F.hold ? 1 : 1-ei(Math.min(1,(a-F.rise-F.hold)/F.fall));
        if(X>=R.dur-1e-3) v = a<F.rise ? eo(a/F.rise) : 1;   // čistý odchod banneru: zůstane zakryto
        lv=Math.max(lv,v*R.H[c]); }
      return lv; }
    function rig(t){
      const i=bi(t), ph=i<0?9:t-R.B[i], dec=Math.exp(-ph*7), down=i>=0&&R.D[i];
      const pk = R.loop ? (i%4)+4*(i%2) : i%pads.length;   // smyčka 12 dob: perioda 4 → šev bez skoku sekvenceru
      pads.forEach((p,k)=>{ const on=i>=0&&pk===k; p.style.opacity=on?(0.25+0.75*dec).toFixed(3):'0'; p.style.background=on&&down?'var(--pad-hit)':'var(--pad-hit2)'; });
      eq.forEach((e,k)=>{ const base=R.eqFloor+(1-R.eqFloor)*(0.2+0.8*rnd((i+1)*31+k*7)); const lv=i<0?R.eqFloor:R.eqFloor+(base-R.eqFloor)*(0.3+0.7*dec); e.style.transform='scaleY('+lv.toFixed(3)+')'; });
      fb.forEach((e,c)=>{ const lv=fader(t,c); e.style.transform='scaleY('+lv.toFixed(4)+')'; fc[c].style.transform='translateY('+(-lv*${H}).toFixed(1)+'px)'; fc[c].style.opacity=lv>0.01?'1':'0'; });
      let f=0; if(i>=0&&down){ const isP=R.P.some((p)=>Math.abs(p-R.B[i])<0.02); f=(isP?R.fl.phrase:R.fl.bar)*Math.exp(-ph*(isP?5:8)); }
      fl.style.opacity=f.toFixed(3);
      if(tk&&seg&&R.tk){ const w=seg.offsetWidth||1, per=R.loop?R.dur:w/R.tk; tk.style.transform='translateX('+(-((t%per)/per)*w).toFixed(1)+'px)'; } // smyčka: přesně 1 segment za LOOP
      const g=Math.floor(t*R.gfps); gr.style.backgroundPosition=Math.floor(rnd(g+1)*256)+'px '+Math.floor(rnd(g+77)*256)+'px';
    }
    const o={v:0}; tl.fromTo(o,{v:0},{v:R.dur,duration:R.dur,ease:'none',onUpdate(){ rig(o.v); }},0); rig(0); })();`);

  // ---------- HTML ----------
  const FONTS = fs.readFileSync(path.join(PA, 'fonts.css'), 'utf8');
  const cssVars = `--bg0:${CO.bg0}; --bg1:${CO.bg1}; --bg2:${CO.bg2}; --navy:${CO.navy}; --sky:${CO.sky}; --ice:${CO.ice}; --red:${CO.red}; --gold:${CO.gold}; --ink:${CO.ink}; --ink2:${CO.inkSoft};
    --card-l:${CO.cardLight}; --card-d:${CO.cardDark}; --pad-idle:${CO.padIdle}; --pad-line:${CO.padLine}; --pad-hit:${CO.padHit}; --pad-hit2:${CO.padHit2}; --shadow:${CO.shadow};
    --f-disp:'${TK.font.display}'; --f-text:'${TK.font.text}'; --f-alt:'${TK.font.alt}';`;
  const pd = TK.rig.pads, eqT = TK.rig.eq;
  const padsW = pd.cols * pd.size + (pd.cols - 1) * pd.gap, padsH = pd.rows * pd.size + (pd.rows - 1) * pd.gap;
  const gh = '';
  const title = block ? `MČR 2026 · banner ${block}${loop ? ' (loop)' : ''}` : 'MČR 2026 · partneři (9:16)';
  const html = `<!doctype html>
<html lang="cs"><head><meta charset="UTF-8" /><meta name="viewport" content="width=${W}, height=${H}" />
<title>${esc(title)}</title>
<script src="assets/gsap.min.js"></script>
<style>
${FONTS}
:root { ${cssVars} }
* { box-sizing:border-box; }
body { margin:0; background:var(--bg0); color:var(--ice); font-family:var(--f-text), sans-serif; }
#root { position:relative; width:100%; height:100%; overflow:hidden; background:var(--bg0); }
.clip, .host { position:absolute; inset:0; }
.blk { position:absolute; inset:0; overflow:hidden; }
/* ---------- scéna ---------- */
#stage { position:absolute; inset:0; overflow:hidden; }
#st-bg { position:absolute; inset:-60px; background:radial-gradient(90% 55% at 50% 40%, var(--bg2) 0%, var(--bg1) 60%, var(--bg0) 100%); }
#st-rays { position:absolute; left:50%; top:42%; width:2600px; height:2600px; margin:-1300px 0 0 -1300px; border-radius:50%; opacity:${TK.rig.raysOpacity};
  background:repeating-conic-gradient(from 0deg, rgba(238,242,249,.5) 0deg 2.5deg, transparent 2.5deg 12deg); -webkit-mask-image:radial-gradient(circle, #000 0%, transparent 60%); }
.vfull { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
/* ---------- perzistentní vrstva ---------- */
#plate { position:absolute; left:${PLATE.x}px; top:${PLATE.y}px; padding:${TK.plate.padY}px ${TK.plate.padX}px; background:${TK.plate.bg}; border-radius:${TK.radius.plate}px; box-shadow:0 10px 30px rgba(0,0,0,.35); z-index:50; transform-origin:0 0; }
#plate img { display:block; width:${TA.w}px; height:${TA.h}px; }
#pads { position:absolute; right:${SF.right}px; top:${(PLATE.y + (PLATE.h - padsH) / 2).toFixed(1)}px; width:${padsW}px; display:grid; grid-template-columns:repeat(${pd.cols}, ${pd.size}px); gap:${pd.gap}px; z-index:40; }
#pads i { position:relative; display:block; width:${pd.size}px; height:${pd.size}px; border-radius:${Math.round(pd.size * 0.22)}px; background:var(--pad-idle); box-shadow:inset 0 0 0 2px var(--pad-line); overflow:hidden; }
#pads b { position:absolute; inset:0; opacity:0; background:var(--pad-hit2); box-shadow:0 0 18px currentColor; }
#eq { position:absolute; left:${SF.left}px; right:${SF.right}px; bottom:${eqT.yFromBottom}px; height:${eqT.h}px; display:flex; gap:${eqT.gap}px; align-items:flex-end; z-index:40; opacity:.85; }
#eq i { flex:1; height:100%; transform-origin:bottom; transform:scaleY(${eqT.floor}); border-radius:3px 3px 0 0; background:linear-gradient(0deg, ${CO.eq[0]}, ${CO.eq[1]} 70%, ${CO.eq[2]}); }
#wipe { position:absolute; inset:0; display:flex; gap:6px; padding:0 6px; align-items:flex-end; pointer-events:none; z-index:30; }
#wipe .fd { position:relative; flex:1; height:100%; }
#wipe .fb { position:absolute; left:0; right:0; bottom:0; height:100%; transform-origin:bottom; transform:scaleY(0); background:linear-gradient(0deg, ${CO.fader[0]} 0%, ${CO.fader[1]} 55%, ${CO.fader[2]} 100%); border-radius:8px 8px 0 0; }
#wipe .fc { position:absolute; left:-2px; right:-2px; bottom:0; height:22px; margin-bottom:-11px; border-radius:6px; background:${CO.faderCap}; box-shadow:0 6px 14px rgba(0,0,0,.45); opacity:0; }
#flash { position:absolute; inset:0; background:radial-gradient(70% 55% at 50% 45%, #fff 0%, rgba(255,255,255,.45) 40%, transparent 80%); opacity:0; pointer-events:none; mix-blend-mode:screen; z-index:55; }
#grain { position:absolute; inset:0; background:url(assets/brand/grain.png) 0 0 / 256px 256px; opacity:${TK.rig.grainOpacity}; mix-blend-mode:overlay; pointer-events:none; z-index:60; }
#ticker { position:absolute; left:0; right:0; top:${TK.rig.ticker?.y ?? 1548}px; overflow:hidden; white-space:nowrap; z-index:40; opacity:${TK.rig.ticker?.opacity ?? 0.5}; }
#tk-in { display:inline-block; font-family:var(--f-disp); font-weight:800; font-size:${TK.rig.ticker?.size ?? 26}px; letter-spacing:.14em; text-transform:uppercase; color:var(--sky); }
#badge { position:absolute; right:${SF.right}px; bottom:40px; font-family:var(--f-disp); font-weight:600; font-size:20px; letter-spacing:.2em; opacity:.45; z-index:61; }
/* ---------- společné prvky bloků (platí i pro obsah sub-kompozic, ten se vkládá do tohoto dokumentu) ---------- */
.im { position:absolute; inset:0; width:100%; height:100%; display:block; }
.kick { position:absolute; left:${SF.left}px; right:${SF.right}px; top:${LY.kickerY}px; display:flex; justify-content:space-between; align-items:baseline; font-family:var(--f-disp); font-weight:800; font-size:${TY.kicker}px; letter-spacing:${TY.trackKicker}; text-transform:uppercase; }
.kick b { color:var(--ice); font-weight:800; } .kick b::before { content:''; display:inline-block; width:34px; height:6px; margin-right:14px; vertical-align:middle; background:var(--red); border-radius:3px; }
.kick i { font-style:normal; color:var(--sky); }
.lcard { position:absolute; left:${SF.left}px; top:${LY.logoCardY}px; height:${LY.logoCardH}px; display:flex; align-items:center; justify-content:center; border-radius:${TK.radius.card}px; box-shadow:0 18px 40px rgba(0,0,0,.35); }
.lcard.light { background:var(--card-l); } .lcard.dark { background:var(--card-d); box-shadow:inset 0 0 0 2px rgba(238,242,249,.14), 0 18px 40px rgba(0,0,0,.35); }
.lcard img { display:block; object-fit:contain; }
.lmeta { position:absolute; top:${LY.logoCardY}px; height:${LY.logoCardH}px; display:flex; flex-direction:column; justify-content:center; gap:8px; }
.lmeta b { font-family:var(--f-disp); font-weight:900; font-size:44px; line-height:1.02; letter-spacing:-.01em; }
.lmeta span { font-family:var(--f-disp); font-weight:700; font-size:28px; color:var(--sky); letter-spacing:.02em; }
.msgs { position:absolute; left:${SF.left}px; width:${CW}px; top:${LY.msgY}px; height:${LY.msgH}px; }
.msg { position:absolute; inset:0; opacity:0; display:flex; flex-direction:column; justify-content:center; }
.msg > * { flex-shrink:0; }
.msg .t { font-family:var(--f-disp); font-weight:900; line-height:${TY.lead}; letter-spacing:${TY.trackHead}; text-transform:uppercase; text-wrap:balance; overflow:hidden; padding-top:.1em; margin-top:-.1em; transform-origin:left center; }
.msg .t span { display:block; }
.msg .t.cta { text-transform:none; color:var(--ice); }
.msg .s { margin-top:10px; font-family:var(--f-disp); font-weight:700; font-size:${TY.msgSub}px; color:var(--gold); letter-spacing:.02em; }
.msg .ul { display:block; width:240px; height:10px; margin-top:14px; border-radius:5px; background:var(--acc); transform-origin:left; }
.chips { display:flex; flex-wrap:wrap; gap:14px; }
.chips span { font-family:var(--f-disp); font-weight:900; font-size:36px; text-transform:uppercase; letter-spacing:.01em; padding:14px 22px; border-radius:16px; background:var(--card-d); color:var(--ice); box-shadow:inset 0 0 0 3px var(--acc); }
.hero { position:absolute; left:${SF.left}px; top:${LY.heroY}px; width:${CWU}px; height:${LY.heroH}px; border-radius:${TK.radius.tile}px; overflow:hidden; background:var(--tile); box-shadow:0 24px 60px rgba(0,0,0,.45); }
.hin { position:absolute; inset:0; }
.pr { position:absolute; inset:0; opacity:0; }
.pi { position:absolute; inset:26px; overflow:hidden; }
.sp.dark .pi { inset:0; }
.hl { position:absolute; inset:0; background:radial-gradient(75% 85% at 50% 50%, rgba(255,255,255,.0) 55%, var(--acc)); opacity:0; mix-blend-mode:multiply; pointer-events:none; }
.sp.dark .hl { mix-blend-mode:screen; }
.pads { position:absolute; left:${SF.left}px; top:${LY.padsY}px; width:${CWU}px; height:${LY.padsH}px; display:flex; gap:${LY.padsGap}px; }
.pd { --on:0; position:relative; height:100%; border-radius:${TK.radius.pad}px; background:var(--tile); overflow:hidden; box-shadow:0 0 0 calc(var(--on) * 5px) var(--acc), 0 10px 24px rgba(0,0,0,.35); }
.pd::after { content:''; position:absolute; inset:0; background:rgba(5,13,34,.5); opacity:calc(1 - var(--on)); pointer-events:none; }
.pdi { position:absolute; inset:8px; overflow:hidden; }
.pd em { position:absolute; left:8px; top:6px; font-style:normal; font-family:var(--f-disp); font-weight:800; font-size:16px; color:var(--ink2); opacity:.8; }
.sp.dark .pd em, .venue .pd em { color:var(--ice); }
.pl { position:absolute; inset:0; background:var(--acc); opacity:0; mix-blend-mode:screen; pointer-events:none; }
/* ---------- signatury partnerů ---------- */
.sun { position:absolute; left:${SF.left - 220}px; top:${LY.logoCardY - 260}px; width:760px; height:760px; opacity:.75; pointer-events:none; }
.sun i { position:absolute; inset:0; border-radius:50%; background:repeating-conic-gradient(from 0deg, var(--acc) 0deg 9deg, transparent 9deg 22.5deg); -webkit-mask-image:radial-gradient(circle, transparent 0 18%, #000 19%, transparent 66%); }
.afl { position:absolute; left:${SF.left}px; top:${LY.heroY - 18}px; width:${CWU}px; height:8px; border-radius:4px; background:linear-gradient(90deg, #e39025, #df5942); transform-origin:left; opacity:0; }
.sbg { position:absolute; inset:-60px; filter:blur(20px) brightness(.36) saturate(1.1); }   /* blur 20: nápis MOONKY na víčku nesmí číst jako logo větší než TA */
.hm { position:absolute; left:${SF.left}px; top:${H - SF.bottom + 120}px; white-space:nowrap; font-family:var(--f-disp); font-weight:900; font-size:150px; text-transform:uppercase; letter-spacing:-.02em; color:transparent; -webkit-text-stroke:2px rgba(238,242,249,.12); pointer-events:none; }
.jdots { display:flex; gap:12px; margin-top:6px; } .jdots i { width:26px; height:26px; border-radius:50%; box-shadow:inset -4px -4px 0 rgba(0,0,0,.18); }
.mq { position:absolute; left:0; top:${LY.heroY + LY.heroH - 40}px; white-space:nowrap; font-family:var(--f-disp); font-weight:900; font-size:210px; text-transform:uppercase; letter-spacing:-.03em; color:transparent; -webkit-text-stroke:2px rgba(142,162,216,.22); pointer-events:none; }
.mq span { margin-right:40px; }
.lineup { position:absolute; inset:22px 26px 14px; display:flex; align-items:flex-end; justify-content:space-between; gap:10px; }
.th { position:relative; flex:1; height:100%; transform-origin:bottom; }
.th .pi { inset:0; overflow:visible; }
.ghr { position:absolute; right:-260px; top:${LY.heroY - 300}px; width:900px; height:900px; opacity:.13; pointer-events:none; }
.sp.dark .hero { box-shadow:inset 0 0 0 2px rgba(240,144,79,.35), 0 24px 60px rgba(0,0,0,.6); }
/* ---------- intro / finále ---------- */
.ibg { position:absolute; inset:0; overflow:hidden; filter:brightness(.32) saturate(.85); } .ibi { position:absolute; inset:0; }
.intro::after, .finale::after { content:''; position:absolute; inset:0; background:linear-gradient(180deg, rgba(5,13,34,.55) 0%, rgba(5,13,34,.1) 35%, rgba(5,13,34,.75) 100%); pointer-events:none; }
.ph { position:absolute; inset:0; z-index:2; }
.ln { position:absolute; left:${SF.left}px; right:${SF.right}px; overflow:hidden; padding:.16em 0 .06em; margin-top:-.16em; font-family:var(--f-disp); text-transform:uppercase; }
.ln span { display:inline-block; transform-origin:left center; }
.intro .k { top:${TK.plate.heroY + PLATE.h * TK.plate.heroScale + 22}px; text-align:center; font-weight:700; font-size:30px; letter-spacing:.4em; color:var(--sky); }
.intro .a { top:870px; font-weight:900; font-size:${fit('MISTROVSTVÍ', CW, 1, [128, 120, 112, 104, 96])}px; letter-spacing:-.02em; line-height:1.0; }
.intro .b { top:1004px; font-weight:900; font-size:290px; line-height:.9; color:var(--red); letter-spacing:-.04em; overflow:visible; }
.intro .c { top:1262px; font-weight:800; font-size:52px; letter-spacing:.01em; text-transform:none; }
.intro .d { top:870px; font-weight:900; font-size:${fit(C.event.dateBig, CW, 1, [150, 140, 130, 120])}px; letter-spacing:-.03em; line-height:1; }
.intro .e { top:1030px; font-weight:900; font-size:150px; line-height:1; letter-spacing:-.03em; color:transparent; -webkit-text-stroke:3px var(--ice); }
.intro .e em { display:inline-block; margin-left:26px; vertical-align:middle; font-style:normal; font-size:30px; letter-spacing:.2em; color:var(--gold); -webkit-text-stroke:0; }
.intro .f { top:1210px; font-weight:900; font-size:64px; color:var(--ice); text-transform:none; }
.intro .g { top:1290px; font-weight:700; font-size:32px; color:var(--sky); letter-spacing:.12em; }
.stats { position:absolute; left:${SF.left}px; top:860px; width:${CWU}px; display:grid; grid-template-columns:1fr 1fr; gap:24px; }
.stp { position:relative; height:${Math.round((1440 - 860 - 24) / 2)}px; border-radius:${TK.radius.tile}px; background:var(--card-l); color:var(--ink); padding:26px 30px; overflow:hidden; display:flex; flex-direction:column; justify-content:flex-end; box-shadow:0 20px 50px rgba(0,0,0,.4); --acc:var(--red); }
.stp b { font-family:var(--f-disp); font-weight:900; font-size:132px; line-height:.9; letter-spacing:-.03em; color:var(--red); }
.stp:nth-child(2) b { font-size:96px; color:var(--ink); text-transform:uppercase; }
.stp span { font-family:var(--f-disp); font-weight:800; font-size:34px; text-transform:uppercase; letter-spacing:.06em; color:var(--ink2); margin-top:8px; }
.intro .h { top:840px; font-weight:900; font-size:120px; letter-spacing:-.02em; }
.intro .i { top:975px; font-weight:900; font-size:${fit(C.event.partnersTitle.split(' ').slice(1).join(' '), CW, 1, [120, 110, 100, 92, 84])}px; letter-spacing:-.02em; color:var(--red); }
.names { position:absolute; left:${SF.left}px; width:${CWU}px; top:1130px; display:flex; flex-wrap:wrap; gap:12px 14px; }
.names span { font-family:var(--f-disp); font-weight:800; font-size:28px; padding:10px 18px; border-radius:12px; background:rgba(238,242,249,.1); box-shadow:inset 0 0 0 2px rgba(238,242,249,.2); }
.finale .a { top:780px; font-weight:900; font-size:${fit(C.event.thanks1, CW, 1, [150, 136, 124, 112])}px; letter-spacing:-.03em; }
.finale .b { top:940px; font-weight:900; font-size:${fit(C.event.thanks2, CW, 1, [150, 136, 124, 112])}px; letter-spacing:-.03em; color:var(--red); overflow:visible; }
.wt { position:absolute; left:${SF.left}px; right:${SF.right}px; top:${LY.kickerY}px; display:flex; justify-content:space-between; align-items:baseline; font-family:var(--f-disp); text-transform:uppercase; }
.wt b { font-weight:900; font-size:44px; letter-spacing:-.01em; } .wt span { font-weight:800; font-size:26px; letter-spacing:.2em; color:var(--sky); }
.wc { position:absolute; border-radius:${TK.radius.card}px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; overflow:hidden; box-shadow:0 14px 34px rgba(0,0,0,.4); }
.wc.light { background:var(--card-l); color:var(--ink2); } .wc.dark { background:var(--card-d); color:var(--sky); box-shadow:inset 0 0 0 2px rgba(238,242,249,.16), 0 14px 34px rgba(0,0,0,.4); }
.wc img { display:block; object-fit:contain; } .wc em { font-style:normal; font-family:var(--f-disp); font-weight:800; font-size:20px; letter-spacing:.08em; text-transform:uppercase; }
.wc .pl { background:var(--acc); }
.finale .c { top:${TK.plate.heroY + 80 + PLATE.h * TK.plate.heroScale + 40}px; text-align:center; font-weight:900; font-size:${fit(C.event.title1 + ' ' + C.event.title2, CW, 1, [50, 46, 42, 38])}px; letter-spacing:-.01em; }
.finale .d { top:${TK.plate.heroY + 80 + PLATE.h * TK.plate.heroScale + 112}px; text-align:center; font-weight:700; font-size:34px; text-transform:none; color:var(--gold); }
.finale .e { top:${TK.plate.heroY + 80 + PLATE.h * TK.plate.heroScale + 172}px; text-align:center; font-weight:900; font-size:44px; text-transform:none; color:var(--red); }
.ghm { position:absolute; left:0; right:0; top:${H - SF.bottom - 70}px; display:flex; justify-content:center; align-items:center; gap:16px; filter:drop-shadow(0 2px 8px rgba(0,0,0,.7)); }
.ghm .by { font-family:var(--f-alt); font-weight:600; font-size:22px; letter-spacing:.24em; text-transform:uppercase; color:var(--ice); }
.ghm .gear { position:relative; width:54px; height:54px; } .ghm .gear img { position:absolute; inset:0; width:100%; height:100%; }
/* ---------- venue / b-roll ---------- */
.vbg { position:absolute; inset:0; overflow:hidden; z-index:0; } .vbg .vfull { filter:brightness(.78) saturate(1.05); }
.venue .vshade { z-index:1; } .venue .kick, .venue .vlogo, .venue .lmeta, .venue .msgs, .venue .vplace, .venue .pads { z-index:2; } .vph { position:absolute; inset:0; filter:brightness(.62) saturate(1.05); } .vph.freeze { filter:brightness(.78) saturate(1.05); }
.vshade { position:absolute; inset:0; background:linear-gradient(180deg, rgba(5,13,34,.8) 0%, rgba(5,13,34,.35) 24%, rgba(5,13,34,.15) 45%, rgba(5,13,34,.25) 62%, rgba(5,13,34,.85) 100%); }
.vlogo { position:absolute; left:${SF.left}px; top:${LY.logoCardY}px; border-radius:50%; box-shadow:0 18px 40px rgba(0,0,0,.45); }
.vlogo img { display:block; }
.vname b { font-size:${fit('Líheň Liběchov', 560, 2, [72, 64, 56], false)}px; }
.vplace { position:absolute; left:${SF.left}px; top:${LY.heroY + LY.heroH - 70}px; display:flex; align-items:center; gap:14px; padding:14px 22px; border-radius:16px; background:rgba(5,13,34,.78); font-family:var(--f-disp); font-weight:800; font-size:28px; }
.vplace i { width:22px; height:22px; border-radius:50% 50% 50% 0; transform:rotate(-45deg); background:var(--red); }
.bp { position:absolute; inset:0; opacity:0; overflow:hidden; } .bpi { position:absolute; inset:0; }
.bshade { position:absolute; inset:0; background:linear-gradient(180deg, rgba(5,13,34,.45) 0%, transparent 28%, transparent 70%, rgba(5,13,34,.5) 100%); }
</style></head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${f3(DUR)}" data-width="${W}" data-height="${H}">
  <div id="stage"><div id="st-bg"></div><div id="st-rays"></div></div>
  ${hosts.join('\n  ')}
  ${audio.join('\n  ')}
  <div id="wipe">${Array.from({ length: nF }, () => '<div class="fd"><i class="fb"></i><b class="fc"></b></div>').join('')}</div>
  <div id="eq">${Array.from({ length: eqT.bars }, () => '<i></i>').join('')}</div>
  <div id="pads">${Array.from({ length: pd.cols * pd.rows }, () => '<i><b></b></i>').join('')}</div>
  ${TK.rig.ticker?.on ? `<div id="ticker"><div id="tk-in">${Array.from({ length: 6 }, (_, i) => `<span${i ? '' : ' id="tk-seg"'}>${esc(TK.rig.ticker.text)}&nbsp;·&nbsp;</span>`).join('')}</div></div>` : ''}
  <div id="plate"><img src="assets/brand/ta_logo_h.png" alt="Trout Area Czech Republic"></div>
  <div id="flash"></div>
  <div id="grain"></div>
  ${FINAL ? '' : `<div id="badge">DRAFT · ${esc(VER)}${G.real ? '' : ` · ${C.music.bpm} BPM grid`}${block ? ` · ${esc(block)}${loop ? ' loop' : ''}` : ''}</div>`}
</div>
<script>
  const tl = gsap.timeline({ paused: true });
  tl.fromTo("#st-rays", {rotation:0}, {rotation:${Math.round(DUR * 0.6)}, duration:${f3(DUR)}, ease:"none"}, 0);
  ${out.join('\n  ')}
  tl.set({}, {}, ${f3(DUR)});
  window.__timelines["main"] = tl;
</script>
</body></html>`;
  const dir = path.join(PROTO, block ? `banner_${block}${loop ? '_loop' : ''}` : '9x16');
  fs.mkdirSync(dir, { recursive: true });
  const ln = path.join(dir, 'assets'); if (!exists(ln)) fs.symlinkSync('../assets', ln);
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  const cdir = path.join(dir, 'compositions'); fs.mkdirSync(cdir, { recursive: true });
  for (const f of fs.readdirSync(cdir)) if (f.endsWith('.html')) fs.unlinkSync(path.join(cdir, f));
  for (const sc of subs) fs.writeFileSync(path.join(cdir, `${sc.key}.html`), sc.html);
  const rel = path.relative(ROOT, dir);
  console.log(`${rel}/index.html · ${mode} · DUR ${f3(DUR)} s · ${out.length} řádků timeline · grid ${G.real ? 'track' : C.music.bpm + ' BPM synt.'}`);
  if (!block) {
    console.log('  plán:'); plan.forEach((p) => console.log(`   ${f3(p.t0).padStart(8)}–${f3(p.t1).padStart(8)}  ${p.key} (${p.B.bars} t.)`));
  }
  console.log('  ' + report.join('\n  '));
  return { dir, DUR, plan };
}

// ---------- pomocné: ffprobe, kopie, placeholder audio ----------
function ffDur(f) { try { return +(+execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim()).toFixed(3); } catch { return 0; } }
function copyIfNewer(src, dst) { fs.mkdirSync(path.dirname(dst), { recursive: true }); if (!exists(dst) || fs.statSync(dst).mtimeMs < fs.statSync(src).mtimeMs) fs.copyFileSync(src, dst); }
function writePlaceholder(file, dur, click, beat) {
  if (exists(file) && !click) return;
  const sr = 8000, n = Math.ceil(dur * sr), buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(sr, 24); buf.writeUInt32LE(sr * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(n * 2, 40);
  if (click) for (let b = 0, t = 0; t < dur; b++, t = b * beat) { const f = b % 4 === 0 ? 1600 : 1000, s0 = Math.round(t * sr); for (let i = 0; i < sr * 0.03 && s0 + i < n; i++) buf.writeInt16LE(Math.round(Math.sin((2 * Math.PI * f * i) / sr) * 12000 * (1 - i / (sr * 0.03))), 44 + (s0 + i) * 2); }
  fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, buf);
}

// ======================================================================================
// MAIN
// ======================================================================================
if (ENV.BLOCK === 'all') {
  for (const k of ORDER) { const t = C.blocks[k].type; if (t === 'broll') continue; build({ block: k }); if (ENV.LOOP && (t === 'sponsor' || t === 'venue')) build({ block: k, loop: true }); }
} else if (ENV.BLOCK) {
  const t = C.blocks[ENV.BLOCK]?.type;
  if (ENV.LOOP && !['sponsor', 'venue'].includes(t)) console.warn(`LOOP jen pro partnery/venue — ${ENV.BLOCK} se staví jako banner`);
  build({ block: ENV.BLOCK, loop: !!ENV.LOOP && ['sponsor', 'venue'].includes(t) });
} else build();
