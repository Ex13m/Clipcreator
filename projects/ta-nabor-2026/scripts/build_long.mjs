// Trout Area CZ – náborové motivační video (podle článku pro časopis + web jako otevřený automatizovaný systém).
// Název systému se v obraze NEUVÁDÍ. Fotky: album TA 2026 (Drive „Уменьшенные с логотипами — 2048 px“, oříznutý spodní pruh partnerů).
// DLOUHÁ VERZE (~2:50): pravidla, sezóna, žebříček, mistr, mezinárodní závody, nominace. Hudba: střih Suno tracku (03_MUSIC/track_long.beats.json). VO: hlas Igor Novák (HeyGen klon).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROTO = path.join(ROOT, 'proto');
const FONTS = fs.readFileSync(path.join(PROTO, 'assets/fonts.css'), 'utf8');
const VER = process.env.VER || 'v1';
const G = JSON.parse(fs.readFileSync(path.join(ROOT, '03_MUSIC/track_long.beats.json'), 'utf8'));
G.beats = G.downbeats.flatMap((t, i) => { const n = G.downbeats[i + 1] ?? t + (t - G.downbeats[i - 1]); return [0, 1, 2, 3].map((k) => +(t + ((n - t) * k) / 4).toFixed(4)); });
const SPEC = JSON.parse(fs.readFileSync(path.join(ROOT, 'proto/assets/spec_long.json'), 'utf8'));
const pngWH = (f) => { const b = fs.readFileSync(f); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
const BEAT = G.beats[1] - G.beats[0];
const BAR = (n) => (n < G.downbeats.length ? G.downbeats[n] : G.downbeats.at(-1) + (n - G.downbeats.length + 1) * BEAT * 4);
const DUR = G.duration;
const len = (a, b) => +(b - a).toFixed(3);
const rnd = (seed) => { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); };
const nb = (s) => s.replace(/ ([vkszouaiVKSZOUAI]|na|do|po|za|ke|ve|se|ze|od) /g, ' $1\u00a0');   // čeština: předložky nenechat na konci řádku

const BARS = { hook: [0, 4], what: [4, 10], duel: [10, 21], cr: [21, 27], all: [27, 32], season: [32, 39], rank: [39, 47], champ: [47, 51], world: [51, 59], num: [59, 63], sys: [63, 70], start: [70, 76], crs: [76, 79], cta: [79, 88] };
// ohniska fotek (x% y%) – ať ořez nesebere hlavy
const FOC = { 9027: '50% 30%', 9032: '50% 25%', 9005: '50% 30%', 9030: '50% 25%', 9050: '50% 40%', 9028: '50% 20%', 9033: '50% 40%', 9054: '45% 40%', 9014: '50% 60%', 9055: '60% 60%', 9016: '40% 55%', 9006: '35% 60%', 9008: '35% 55%', 9015: '60% 60%', 9007: '50% 40%', 9000: '50% 50%', 86451: '95% 35%', 86406: '50% 30%', 86407: '40% 30%', 86408: '55% 35%', 86409: '50% 55%', 86410: '50% 20%', 86412: '50% 30%', 86422: '60% 25%', 86423: '60% 15%', 86425: '60% 25%',
  86429: '50% 25%', 86430: '50% 20%', 86431: '50% 30%', 86432: '50% 40%', 86434: '50% 45%', 86435: '50% 55%', 86436: '50% 25%', 86437: '50% 50%', 86438: '50% 60%', 86439: '50% 45%',
  86442: '50% 55%', 86443: '50% 55%', 86444: '50% 55%', 86450: '50% 40%', 86456: '50% 35%', 86459: '50% 40%', 86440: '50% 40%', 86433: '45% 45%', 86426: '50% 25%', 86420: '50% 30%' };
Object.assign(FOC, { 9627: '45% 70%', 9305: '30% 75%', 9513: '50% 50%', 9526: '50% 55%', 9527: '50% 55%', 9508: '50% 55%', 9511: '50% 55%', 9502: '50% 40%', 9601: '50% 35%', 9802: '50% 55%', 9812: '50% 40%', 9820: '50% 55%', 9813: '50% 40%', 9901: '50% 45%', 9926: '50% 35%', 9902: '50% 30%', 9302: '45% 55%', 9303: '50% 55%', 9304: '35% 55%', 9305: '50% 50%', 9307: '50% 8%', 9308: '50% 55%', 9309: '50% 35%', 9224: '50% 50%', 9203: '50% 45%', 9222: '50% 30%', 9223: '55% 40%', 9210: '50% 50%', 9200: '50% 45%', 9225: '50% 60%', 86445: '50% 45%', 9056: '50% 55%', 9701: '45% 50%', 9704: '60% 45%', 9705: '50% 40%', 9706: '50% 50%', 9707: '50% 40%', 9708: '50% 40%', 9709: '50% 50%', 9710: '60% 40%', 9711: '40% 40%', 9713: '50% 60%', 9714: '50% 45%' });
const ph = (n) => `background-image:url(assets/photos/p${n}.jpg); background-position:${FOC[n] || '50% 40%'}`;

function build(W, H, file) {
  const P = H > W, u = Math.min(W, H) / 100;
  const px = (n) => `${Math.round(n * u)}px`;
  const out = [];
  const T = (sel, from, to, pos) => out.push(`tl.fromTo(${JSON.stringify(sel)}, ${JSON.stringify(from)}, ${JSON.stringify({ immediateRender: false, ...to })}, ${(+pos).toFixed(3)});`);
  const T0 = (sel, from, to, pos) => out.push(`tl.fromTo(${JSON.stringify(sel)}, ${JSON.stringify(from)}, ${JSON.stringify(to)}, ${(+pos).toFixed(3)});`);
  const SET = (sel, v, pos) => out.push(`tl.set(${JSON.stringify(sel)}, ${JSON.stringify(v)}, ${(+pos).toFixed(3)});`);
  const CNT = (id, to, pos, d) => out.push(`{ const o={v:0}, el=document.getElementById("${id}"); tl.fromTo(o,{v:0},{v:${to},duration:${d.toFixed(3)},ease:"power2.out",immediateRender:false,onUpdate(){el.textContent=Math.round(o.v).toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g,"\\u00a0");}}, ${(+pos).toFixed(3)}); }`);
  const scenes = [], starts = [];
  const scene = (id, a, b, html) => { starts.push(a);
    out.push(`tl.set("#${id}", {visibility:"hidden"}, 0); tl.set("#${id}", {visibility:"visible"}, ${a.toFixed(3)}); tl.set("#${id}", {visibility:"hidden"}, ${b.toFixed(3)});`);
    scenes.push(`<section id="${id}" class="clip" data-start="${a.toFixed(3)}" data-duration="${len(a, b)}" data-track-index="2">${html}</section>`); };
  const rise = (sel, t, d = 0.55, st = 0) => T0(sel, { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: d, ease: 'expo.out', stagger: st }, t);
  const pop = (sel, t, d = 0.5) => T0(sel, { opacity: 0, y: 2 * u, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: d, ease: 'back.out(1.8)' }, t);
  const outT = (sel, t, d = 0.3) => T(sel, { opacity: 1 }, { opacity: 0, duration: d, ease: 'power2.in' }, t - d);
  // fotky: sled střihů; každá s vlastním pomalým Ken Burns, střih na dobu
  const photos = (id, list, a, b, { op = 1, hard = false } = {}) => { op = Math.min(1, op * 1.35);
    const n = list.length, cuts = Array.from({ length: n + 1 }, (_, k) => (k === 0 ? a : k === n ? b : G.beats.find((t) => t >= a + ((b - a) * k) / n - 0.05) ?? a + ((b - a) * k) / n));
    list.forEach((im, k) => { const ia = cuts[k], ib = cuts[k + 1], zin = k % 2 === 0, el = `#${id}_${k}`;
      SET(el, { opacity: 0 }, 0);
      if (hard) { SET(el, { opacity: op }, ia); SET(el, { opacity: 0 }, k < n - 1 ? ib : ib + 0.45); }
      else { T0(el, { opacity: 0 }, { opacity: op, duration: k ? 0.25 : 0.45, ease: 'power2.out' }, k ? ia - 0.1 : ia); if (k < n - 1) T(el, { opacity: op }, { opacity: 0, duration: 0.3 }, ib + 0.1); }
      T0(el, { scale: zin ? 1.12 : 1.02, xPercent: zin ? -1.5 : 1.5 }, { scale: zin ? 1.02 : 1.12, xPercent: zin ? 1.5 : -1.5, duration: len(ia - 0.1, ib + 0.4), ease: 'none' }, ia - 0.1); });
    return list.map((im, k) => `<div class="ph" id="${id}_${k}" style="${ph(im)}"></div>`).join('') + '<div class="pho"></div>';
  };
  const kick = (t) => `<div class="kick"><i></i>${t}</div>`;
  // sportovec – výřez s barevnými ozvěnami (červená/modrá silueta posunutá za postavou)
  const hero = (id, n, hgt) => { const [w, h] = pngWH(path.join(PROTO, `assets/cut/c${n}.png`)), wd = (hgt * w) / h, src = `assets/cut/c${n}.png`;
    const m = `-webkit-mask-image:url(${src}); mask-image:url(${src}); -webkit-mask-size:100% 100%; mask-size:100% 100%;`;
    return `<div class="hero" id="${id}" style="width:${wd.toFixed(0)}px; height:${hgt.toFixed(0)}px"><img src="${src}" alt=""></div>`; };
  const heroIn = (id, t, dir = 1) => { T0(`#${id}`, { opacity: 0, x: dir * 18 * u }, { opacity: 1, x: 0, duration: 0.7, ease: 'expo.out' }, t);
 };

  // ===================== 1) HOOK: rychlé střihy akce + „Rybaření, jak ho neznáš.“ =====================
  {
    const id = 's-hook', a = 0, b = BAR(BARS.hook[1]), t1 = BAR(2);
    const fast = [9513, 9302, 9526, 9709, 9308, 9527, 9304, 9707];
    scene(id, a, b, `${photos('hk', fast, BAR(0) + 0.0001, t1, { hard: true })}${photos('hk2', [86442], t1, b, { op: 0.7 })}
      <div class="mega" id="hk-t"><div class="ln"><span>Rybaření,</span></div><div class="ln red"><span>jak ho neznáš.</span></div></div>`);
    rise('#hk-t .ln:nth-child(1) span', t1); rise('#hk-t .ln:nth-child(2) span', t1 + BEAT * 2);
    T('#hk-t', { scale: 1 }, { scale: 1.06, duration: len(t1, b), ease: 'none' }, t1);
    outT('#hk-t', b);
  }

  // ===================== 2) CO TO JE: moderní přívlač =====================
  {
    const id = 's-what', a = BAR(BARS.what[0]), b = BAR(BARS.what[1]);
    scene(id, a, b, `${photos('wh', [9502, 86408, 9511], a, b, { op: 0.55 })}
      <div class="blk lft" id="wh-h">${kick('Trout Area')}<h1><span>Moderní</span><span class="red">přívlač</span></h1><p>${nb('Sportovní disciplína z Japonska. Lov pstruhů a sivenů na menších, dobře zarybněných stojatých vodách.')}</p></div>`);
    rise('#wh-h .kick', a + 0.05); rise('#wh-h h1 span', a + BEAT, 0.6, BEAT); pop('#wh-h p', a + BEAT * 3);
    outT('#wh-h', b);
  }

  // ===================== 2b) JAK PROBÍHÁ SOUBOJ: rybník, dvojice, duel, rotace (lichá místa jedním směrem, sudá opačným) =====================
  {
    const id = 's-duel', a = BAR(BARS.duel[0]), b = BAR(BARS.duel[1]), BB = (k) => BAR(BARS.duel[0] + k);
    const snap = (t) => G.beats.reduce((p, c) => (Math.abs(c - t) < Math.abs(p - t) ? c : p));
    // rybník: obdélník A×B (na šířku), 16 stanovišť po dvojicích na dlouhých březích; v 9:16 otočený na výšku
    const A = P ? 100 * u : 96 * u, B = P ? 46 * u : 38 * u, L = 2 * A + 2 * B, NS = 16;
    const CW = P ? B : A, CH = P ? A : B;                               // rozměr kontejneru
    const map = ([x, y]) => (P ? [B - y, x] : [x, y]);                  // 9:16: dolní břeh → levý, zleva doprava → shora dolů
    const rim = (s) => { s = ((s % L) + L) % L;
      if (s < A) return { p: [s, B], n: [0, 1] }; s -= A;
      if (s < B) return { p: [A, B - s], n: [1, 0] }; s -= B;
      if (s < A) return { p: [A - s, 0], n: [0, -1] }; s -= A;
      return { p: [0, s], n: [-1, 0] }; };
    const xs = (j) => A * (0.12 + Math.floor(j / 2) * (0.76 / 3)) + (j % 2 ? 1 : -1) * A * 0.045;
    const sOf = (n) => { const k = (((n - 1) % NS) + NS) % NS; return k < 8 ? xs(k) : A + B + xs(k - 8); };
    const XY = (s, lane = 0) => { const { p, n } = rim(s); const [nx, ny] = P ? [-n[1], n[0]] : n; const [x, y] = map(p); return [x + nx * lane, y + ny * lane]; };
    const COLS = ['#e31e24', '#ffd36b', '#7fd0ff', '#9be27a', '#ff8fd0', '#ffb05c', '#b9a6ff', '#ffffff', '#5fe0c8', '#ff6a5a', '#c6e04a', '#8ea2d8', '#f5c2c7', '#e0b37a', '#6fb7ff', '#d0d0d0'];
    const st0 = Array.from({ length: NS }, (_, i) => i + 1), step = 6;
    const at = (i, r) => (i % 2 === 0 ? st0[i] + step * r : st0[i] - step * r);
    const nrm = (n) => ((((n - 1) % NS) + NS) % NS) + 1;
    const opp = (r) => { const sa = nrm(at(0, r)), sp = sa % 2 ? sa + 1 : sa - 1; return st0.findIndex((_, j) => nrm(at(j, r)) === sp); };
    const res1 = [3, 0, 2, 2, 0, 3, 3, 0, 1, 1, 3, 0, 0, 3, 3, 0];
    const xy0 = (n) => XY(sOf(n));
    scene(id, a, b, `<div class="dbg"></div>
      <div class="blk dhd" id="dhd">${kick('Jak probíhá souboj')}<h2><span>Jeden na jednoho.</span></h2></div>
      <div class="pond" id="pond" style="width:${CW.toFixed(0)}px; height:${CH.toFixed(0)}px; left:${((W - CW) / 2).toFixed(0)}px">
        <div class="water" id="water"></div>
        ${st0.map((n) => { const [x, y] = xy0(n); const out = n > NS / 2; return `<i class="sn${out ? ' up' : ''}" id="sn${n}" style="left:${x.toFixed(1)}px; top:${y.toFixed(1)}px"><em>${n}</em></i>`; }).join('')}
        ${Array.from({ length: NS / 2 }, (_, p) => { const [x1, y1] = xy0(p * 2 + 1), [x2, y2] = xy0(p * 2 + 2); const w = Math.hypot(x2 - x1, y2 - y1), ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
          return `<i class="pr" id="pr${p}" style="left:${x1.toFixed(1)}px; top:${y1.toFixed(1)}px; width:${w.toFixed(1)}px; transform:rotate(${ang.toFixed(1)}deg)"></i>`; }).join('')}
        ${st0.map((n, i) => { const [x, y] = xy0(n); return `<i class="ag" id="ag${i}" style="left:${x.toFixed(1)}px; top:${y.toFixed(1)}px; --c:${COLS[i]}"><b>${String.fromCharCode(65 + i)}</b><s class="pt" id="pt${i}">+${res1[i]}</s></i>`; }).join('')}
        <span class="ntag" id="ntag">nový soupeř</span>
      </div>
      <div class="duel" id="duel">
        <div class="dc" id="dcA"><b>Závodník A</b><em id="fa">0</em><small>počet ryb</small></div>
        <div class="vs"><div class="clock"><svg viewBox="0 0 100 100"><circle class="cb" cx="50" cy="50" r="44"/><circle class="cf" id="clk" cx="50" cy="50" r="44" pathLength="1"/></svg><span id="clkt">20:00</span></div><i>VS</i></div>
        <div class="dc" id="dcB"><b>Závodník B</b><em id="fb">0</em><small>počet ryb</small></div>
        <div class="win" id="win"><span>výhra <b>3 b.</b></span><span>remíza s úlovkem <b>2 b.</b></span><span>remíza 0:0 <b>1 b.</b></span><span>prohra <b>0 b.</b></span></div>
      </div>
      <div class="dcap" id="dcap1">${nb('Souboj trvá 20 minut. Kdo uloví víc ryb, vyhrává.')}</div>
      <div class="dcap" id="dcap2"><b>Rotace</b> <span class="lg lo">● lichá místa ↻</span> <span class="lg le">● sudá místa ↺</span><br>${nb('posun o 2–10 míst podle počtu závodníků (40–50 závodníků: 6–8 míst)')}</div>
      <div class="rnd" id="rnd"><small>kolo</small><b id="rndn">1</b><small>/ 12</small></div>
      <div class="dcap fin" id="dcap3">${nb('Stejný princip jako na mistrovství světa: místa i soupeři se střídají, aby rozhodoval rybář, ne místo.')}</div>`);
    const others = (keep) => st0.map((_, i) => i).filter((i) => !keep.includes(i)).map((i) => `#ag${i}`).join(', ');
    // 0–1: nadpis, rybník, místa, závodníci, dvojice
    rise('#dhd .kick', a + 0.05); rise('#dhd h2 span', a + BEAT);
    T0('#pond', { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'expo.out' }, a + 0.1);
    T0('.sn', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(3)', stagger: BEAT / 4 }, a + BEAT);
    T0('.ag', { opacity: 0, y: -8 * u, scale: 0.4 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(2)', stagger: BEAT / 4 }, BB(1));
    T0('.pr', { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.35, ease: 'expo.out', stagger: BEAT / 2, transformOrigin: '0% 50%' }, BB(1) + BEAT * 2);
    // 2–5: duel A–B
    T(others([0, 1]), { opacity: 1 }, { opacity: 0.3, duration: 0.3 }, BB(2));
    T('#ag0, #ag1', { scale: 1 }, { scale: 1.4, duration: 0.4, ease: 'back.out(2)' }, BB(2));
    T0('#duel', { opacity: 0, y: 6 * u, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'expo.out' }, BB(2));
    pop('#dcap1', BB(2) + BEAT * 2);
    const ta = BB(2) + BEAT * 2, tb = BB(4);
    T0('#clk', { strokeDashoffset: 0 }, { strokeDashoffset: 1, duration: len(ta, tb), ease: 'none' }, ta);
    out.push(`{ const o={v:1200}, el=document.getElementById("clkt"); tl.fromTo(o,{v:1200},{v:0,duration:${len(ta, tb)},ease:"none",immediateRender:false,onUpdate(){const s=Math.round(o.v);el.textContent=String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");}}, ${ta.toFixed(3)}); }`);
    const fish = [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [3, 2]];
    fish.slice(1).forEach(([fa, fb], k) => { const t = snap(ta + ((tb - BEAT - ta) * (k + 0.5)) / (fish.length - 1)), w = fa !== fish[k][0] ? 'a' : 'b';
      SET(`#f${w}`, { textContent: w === 'a' ? fa : fb }, t);
      T(`#dc${w.toUpperCase()}`, { scale: 1.1 }, { scale: 1, duration: 0.35, ease: 'power2.out' }, t);
      T(`#ag${w === 'a' ? 0 : 1}`, { scale: 1.8 }, { scale: 1.4, duration: 0.3, ease: 'power2.out' }, t); });
    T0('#win', { opacity: 0, y: 2 * u }, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(2)' }, tb - BEAT * 2);
    T0('#win span', { opacity: 0.3 }, { opacity: 1, duration: 0.2, stagger: BEAT / 2 }, tb - BEAT * 2 + 0.1);
    const t5 = BB(5) + BEAT * 2;
    T('#duel, #dcap1', { opacity: 1 }, { opacity: 0, duration: 0.3 }, t5 - 0.3);
    T(others([0, 1]), { opacity: 0.3 }, { opacity: 1, duration: 0.3 }, t5);
    T('#ag1', { scale: 1.4 }, { scale: 1, duration: 0.3 }, t5);
    T0('.pt', { opacity: 0, y: 0 }, { opacity: 1, y: -2.5 * u, duration: 0.35, ease: 'back.out(2)', stagger: 0.03 }, t5);
    T('.pt', { opacity: 1 }, { opacity: 0, duration: 0.25 }, BB(6) + BEAT * 0.5);
    pop('#rnd', t5);
    // 6–9: dvě rotace; lichá místa po vnějším pruhu, sudá po vnitřním; A zůstává hrdina, nový soupeř se rozsvítí
    [1, 2].forEach((r) => { const tr = BB(4 + r * 2) + BEAT, d = BEAT * 2, N = 10;
      if (r === 1) pop('#dcap2', BB(6));
      T('.pr', { opacity: 1 }, { opacity: 0.12, duration: 0.2 }, tr);
      T(others([0]), { opacity: 1 }, { opacity: 0.5, duration: 0.2 }, tr);
      st0.forEach((_, i) => { const dir = i % 2 === 0 ? 1 : -1, sa = sOf(at(i, r - 1)); let sb = sOf(at(i, r)); 
        if (dir > 0 && sb < sa) sb += L; if (dir < 0 && sb > sa) sb -= L;
        const lane = (dir > 0 ? 3.2 : -3.2) * u, sm = (x) => x * x * (3 - 2 * x);
        for (let k = 0; k < N; k++) { const f0 = k / N, f1 = (k + 1) / N, p0 = XY(sa + (sb - sa) * sm(f0), lane * Math.sin(Math.PI * f0)), p1 = XY(sa + (sb - sa) * sm(f1), lane * Math.sin(Math.PI * f1));
          T(`#ag${i}`, { left: p0[0], top: p0[1] }, { left: p1[0], top: p1[1], duration: d / N, ease: 'none' }, tr + (d * k) / N); } });
      const tl2 = tr + d, o = opp(r);
      T('.pr', { opacity: 0.12 }, { opacity: 1, duration: 0.3 }, tl2);
      T(others([0, o]), { opacity: 0.5 }, { opacity: 0.35, duration: 0.2 }, tl2);
      T(`#ag${o}`, { opacity: 0.5, scale: 1 }, { opacity: 1, scale: 1.4, duration: 0.35, ease: 'back.out(2.5)' }, tl2);
      const [ox, oy] = xy0(nrm(at(o, r)));
      T('#ntag', { opacity: 0, left: ox, top: oy, scale: 0.6 }, { opacity: 1, left: ox, top: oy, scale: 1, duration: 0.35, ease: 'back.out(2)' }, tl2 + 0.05);
      T('#ntag', { opacity: 1 }, { opacity: 0, duration: 0.2 }, tl2 + BEAT * 3);
      T(`#ag${o}`, { scale: 1.4 }, { scale: 1, duration: 0.3 }, tl2 + BEAT * 4 - 0.1);
      SET('#rndn', { textContent: r + 1 }, tl2);
      T('#rnd', { scale: 1.25 }, { scale: 1, duration: 0.3, ease: 'power2.out' }, tl2); });
    T('#ag0', { scale: 1.4 }, { scale: 1.4, duration: 0.01 }, t5);
    const t9 = BB(9);
    T(others([0]), { opacity: 0.35 }, { opacity: 1, duration: 0.3 }, t9 - BEAT);
    out.push(`{ const o={v:3}, el=document.getElementById("rndn"); tl.fromTo(o,{v:3},{v:12,duration:${(BEAT * 2).toFixed(3)},ease:"power1.in",immediateRender:false,onUpdate(){el.textContent=Math.round(o.v);}}, ${(t9 - BEAT * 2).toFixed(3)}); }`);
    T('#dcap2', { opacity: 1 }, { opacity: 0, duration: 0.25 }, t9 - 0.2);
    pop('#dcap3', t9);
    outT('#pond, #dhd, #rnd, #dcap3', b);
  }

  // ===================== 3) PRO KAŽDÉHO =====================
  {
    const id = 's-all', a = BAR(BARS.all[0]), b = BAR(BARS.all[1]), tm = BAR(BARS.all[0] + 2);
    const W4 = [86429, 9032, 9005, 86423], WORDS = ['Muži', 'Ženy', 'Junioři', 'Začátečníci'];
    scene(id, a, b, `${photos('al', [9033, 9601], tm, b, { op: 0.55 })}
      <div class="tiles" id="tiles">${W4.map((im, i) => `<div class="tl" id="tl${i}"><div class="tph" style="${ph(im)}"></div></div>`).join('')}</div>
      <div class="words" id="words">${WORDS.map((w, i) => `<b id="wd${i}"><span>${w}</span></b>`).join('')}</div>
      <div class="tagl" id="tagl">${kick('Jednotná pravidla pro všechny')}<h2><span>Nerozhoduje síla.</span></h2><h2 class="red"><span>${nb('Rozhoduje cit, taktika a přesnost.')}</span></h2></div>`);
    W4.forEach((_, i) => { const t = a + BEAT * i * 2;
      T0(`#tl${i}`, { opacity: 0, yPercent: i % 2 ? -30 : 30, rotation: (i % 2 ? 4 : -4) }, { opacity: 1, yPercent: 0, rotation: 0, duration: 0.5, ease: 'expo.out' }, t);
      T0(`#tl${i} .tph`, { scale: 1.25 }, { scale: 1, duration: 2.5, ease: 'power2.out' }, t); rise(`#wd${i} span`, t + 0.1); });
    T('#words', { opacity: 1 }, { opacity: 0, duration: 0.35 }, tm - 0.35);
    T('#tiles', { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.9, duration: 0.35, ease: 'power2.in' }, tm - 0.35);
    rise('#tagl .kick', tm); rise('#tagl h2:nth-of-type(1) span', tm); rise('#tagl h2:nth-of-type(2) span', tm + BEAT * 2);
    outT('#tagl', b);
  }

  // ===================== 4) PRAVIDLA (jednotná) =====================
  {
    const id = 's-cr', a = BAR(BARS.cr[0]), b = BAR(BARS.cr[1]);
    const RU = [['Umělé nástrahy', 'plandavky, woblery i gumy'], ['Jeden jednoháček', 'originální, bez protihrotu'], ['Nástraha min. 18 mm', 'zátěž uvnitř těla'], ['Prut max. 2,7 m', 'bez teleskopů a baitcastu'], ['Podběrák', 'bezuzlová gumová síťka'], ['Chyť a pusť', 'každá ryba zpět do vody']];
    scene(id, a, b, `${photos('cr', [9513, 86438, 9508], a, b, { op: 0.35 })}
      <div class="blk rlh" id="rlh">${kick('Soutěžní a závodní řád')}<h2><span>Jednotná pravidla</span></h2><h2 class="red"><span>pro všechny.</span></h2></div>
      <div class="rules" id="rules">${RU.map(([t, s2], i) => `<div class="ru" id="ru${i}"><i>${String(i + 1).padStart(2, '0')}</i><b>${nb(t)}</b><small>${nb(s2)}</small></div>`).join('')}</div>`);
    rise('#rlh .kick', a + 0.05); rise('#rlh h2:nth-of-type(1) span', a + BEAT); rise('#rlh h2:nth-of-type(2) span', a + BEAT * 2);
    RU.forEach((_, i) => T0(`#ru${i}`, { opacity: 0, y: 4 * u, rotationX: -60, transformPerspective: 900 }, { opacity: 1, y: 0, rotationX: 0, duration: 0.55, ease: 'expo.out' }, a + BEAT * (4 + i * 2)));
    T('#ru5', { boxShadow: '0 0 0 0px rgba(227,30,36,0)' }, { boxShadow: `0 0 0 ${px(0.6)} rgba(227,30,36,1)`, duration: 0.3, yoyo: true, repeat: 3 }, a + BEAT * 15);
    outT('#rlh, #rules', b);
  }

  // ===================== 5a) SEZÓNA: 2 dvoudenní víkendy na jaře + 2 na podzim (vč. MČR) = 8 závodních dnů =====================
  {
    const id = 's-season', a = BAR(BARS.season[0]), b = BAR(BARS.season[1]);
    const WK = [['Jaro', 'víkend 1'], ['Jaro', 'víkend 2'], ['Podzim', 'víkend 3'], ['Podzim', 'MČR']];
    scene(id, a, b, `${photos('se', [9802, 9812, 9820], a, b, { op: 0.3 })}<div class="gridbg"></div>
      <div class="blk seh" id="seh">${kick('Jak probíhá sezóna')}<h2><span>${nb('4 dvoudenní víkendy.')}</span></h2><h2 class="red"><span>${nb('8 závodních dnů.')}</span></h2></div>
      <div class="cal" id="cal"><i class="tline" id="tline"></i>
        <div class="sea s1" id="sea0"><b>Jaro</b><small>březen – květen</small></div><div class="sea s2" id="sea1"><b>Podzim</b><small>září – listopad</small></div>
        <div class="wks">${WK.map(([s2, n], k) => `<div class="wk${n === 'MČR' ? ' mcr' : ''}" id="wk${k}"><small>${n}</small><div class="dd">${[1, 2].map((dn) => `<span class="dpin" id="dp${k * 2 + dn - 1}"><em>${k * 2 + dn}</em><s>den ${dn}</s></span>`).join('')}</div></div>`).join('')}</div>
        <div class="free" id="free"><b>${nb('Volné termíny')}</b><small>${nb('pro další závody doma i v zahraničí')}</small></div></div>`);
    rise('#seh .kick', a + 0.05); rise('#seh h2:nth-of-type(1) span', a + BEAT); rise('#seh h2:nth-of-type(2) span', a + BEAT * 10);
    T0('#tline', { scaleX: 0 }, { scaleX: 1, duration: BEAT * 4, ease: 'power2.inOut' }, a + BEAT * 1.5);
    T0('#sea0', { opacity: 0, y: 3 * u }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' }, a + BEAT * 2);
    T0('#sea1', { opacity: 0, y: 3 * u }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' }, a + BEAT * 6);
    [0, 1, 2, 3].forEach((k) => { const t = a + BEAT * (3 + k * 2 + (k > 1 ? 1 : 0));
      T0(`#wk${k}`, { opacity: 0, y: 4 * u, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(2)' }, t);
      [0, 1].forEach((j) => T0(`#dp${k * 2 + j}`, { opacity: 0, y: -4 * u }, { opacity: 1, y: 0, duration: 0.35, ease: 'back.out(2.5)' }, t + 0.15 + j * 0.15)); });
    T('#wk3', { boxShadow: '0 0 0 0px rgba(255,211,107,0)' }, { boxShadow: `0 0 0 ${px(0.6)} rgba(255,211,107,1)`, duration: 0.3, yoyo: true, repeat: 3 }, a + BEAT * 11);
    T0('#free', { opacity: 0, x: 4 * u }, { opacity: 1, x: 0, duration: 0.5, ease: 'expo.out' }, a + BEAT * 14);
    T0('.dpin em', { scale: 1 }, { scale: 1.25, duration: 0.15, yoyo: true, repeat: 1, stagger: 0.08 }, a + BEAT * 10);
    outT('#seh, #cal', b);
  }

  // ===================== 5b) ŽEBŘÍČEK: 8 dnů, umístění = body, 2 nejhorší se škrtají (pojistka i pro neúčast) =====================
  {
    const id = 's-rank', a = BAR(BARS.rank[0]), b = BAR(BARS.rank[1]);
    const AB = 60;   // neúčast = počet závodníků (40) + 20
    const R = { A: [3, 1, 4, 2, 9, 2, 5, 3], B: [1, 5, 2, 6, 4, 8, 2, 7], C: [6, 2, 1, 8, 2, 3, 4, 6], D: [2, AB, 3, 1, 5, 4, AB, 2], E: [4, 3, 6, 3, 1, 6, 5, 9] };
    const K = Object.keys(R), CC = { A: '#e31e24', B: '#ffd36b', C: '#7fd0ff', D: '#9be27a', E: '#ff8fd0' }, ND = 8;
    const sum = (k, n = ND) => R[k].slice(0, n).reduce((x, y) => x + y, 0);
    const avg = (k, n = ND) => sum(k, n) / n, cz = (v) => v.toFixed(2).replace('.', ',');
    const worst2 = (k) => R[k].map((v, i) => [v, i]).sort((x, y) => y[0] - x[0]).slice(0, 2).map(([, i]) => i);
    const fin = (k) => (sum(k) - worst2(k).reduce((s2, i) => s2 + R[k][i], 0)) / (ND - 2);
    const RH = P ? 9.2 * u : 6.4 * u;
    scene(id, a, b, `<div class="rbg"></div>${hero('rk-h', 9030, P ? 60 * u : 92 * u)}
      <div class="blk rkh" id="rkh">${kick('Celoroční žebříček')}<h2><span>${nb('Umístění = body.')}</span></h2><h2 class="red"><span>${nb('Nejnižší průměr vede.')}</span></h2></div>
      <div class="tbl t8" id="tbl"><div class="thd"><span></span>${Array.from({ length: ND }, (_, n) => `<span>${n + 1}</span>`).join('')}<span>Ø</span></div>
        <div class="tbd" style="height:${(RH * 5).toFixed(0)}px">${K.map((k) => `<div class="tr" id="tr${k}" style="height:${RH.toFixed(0)}px"><span class="who" style="--c:${CC[k]}"><b>${k}</b></span>${R[k].map((v, c) => `<span class="cl${v === AB ? ' ab' : ''}" id="c${k}${c}"><em>${v === AB ? '×' : v}</em><s class="x" id="x${k}${c}"></s></span>`).join('')}<span class="sm" id="sm${k}">0</span><i class="lead" id="ld${k}">1.</i></div>`).join('')}</div>
        <div class="tleg"><span><i>×</i> ${nb('neúčast = počet závodníků + 20 bodů')}</span></div></div>
      <div class="rnote" id="rnote"><b>${nb('Ø = součet umístění / počet závodů')}</b><small>${nb('z 8 dnů se 2 nejhorší škrtají · pojistka, když nestihneš víkend')}</small></div>`);
    heroIn('rk-h', a + BEAT * 2, 1);
    rise('#rkh .kick', a + 0.05); rise('#rkh h2:nth-of-type(1) span', a + BEAT); rise('#rkh h2:nth-of-type(2) span', a + BEAT * 8);
    K.forEach((k, r) => SET(`#tr${k}`, { y: r * RH }, a));
    T0('#tbl', { opacity: 0, y: 4 * u }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' }, a + BEAT * 2);
    T0('.tr', { opacity: 0, x: -4 * u }, { opacity: 1, x: 0, duration: 0.4, ease: 'expo.out', stagger: 0.07 }, a + BEAT * 2.5);
    for (let c = 0; c < ND; c++) { const t = a + BEAT * (4 + c * 1.1);
      K.forEach((k) => { T0(`#c${k}${c} em`, { opacity: 0, scale: 1.8 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, t); SET(`#sm${k}`, { textContent: cz(avg(k, c + 1)) }, t + 0.05); });
      T0(`.thd span:nth-child(${c + 2})`, { color: '#ffd36b' }, { color: '#8ea2d8', duration: 0.6 }, t); }
    const sortRows = (key, t) => { const ord = [...K].sort((x, y) => key(x) - key(y)); ord.forEach((k, r) => T(`#tr${k}`, {}, { y: r * RH, duration: 0.7, ease: 'power3.inOut' }, t)); return ord; };
    const t1 = a + BEAT * 13.5; sortRows((k) => avg(k), t1);
    const t2 = a + BEAT * 18;
    T0('#rnote', { opacity: 0, y: 3 * u }, { opacity: 1, y: 0, duration: 0.45, ease: 'back.out(2)' }, t2 - BEAT);
    K.forEach((k) => { worst2(k).forEach((w, j) => {
        T0(`#x${k}${w}`, { scaleX: 0, rotation: -14 }, { scaleX: 1, rotation: -14, duration: 0.3, ease: 'power2.out' }, t2 + j * 0.25);
        T(`#c${k}${w} em`, { opacity: 1 }, { opacity: 0.35, duration: 0.3 }, t2 + 0.1 + j * 0.25); });
      out.push(`{ const o={v:${avg(k)}}, el=document.getElementById("sm${k}"); tl.fromTo(o,{v:${avg(k)}},{v:${fin(k)},duration:0.8,ease:"power2.out",immediateRender:false,onUpdate(){el.textContent=o.v.toFixed(2).replace(".",",");}}, ${(t2 + 0.5).toFixed(3)}); }`); });
    const ord2 = sortRows(fin, t2 + BEAT * 3);
    T('#trD', { backgroundColor: 'rgba(155,226,122,0)' }, { backgroundColor: 'rgba(155,226,122,.28)', duration: 0.35, yoyo: true, repeat: 3 }, t2 + BEAT * 3);
    T0(`#ld${ord2[0]}`, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(3)' }, t2 + BEAT * 5);
    T(`#tr${ord2[0]}`, { backgroundColor: 'rgba(255,211,107,0)' }, { backgroundColor: 'rgba(255,211,107,.22)', duration: 0.4 }, t2 + BEAT * 5);
    outT('#rkh, #tbl, #rnote, #rk-h', b);
  }

  // ===================== 5c) MISTR ČR TROUT AREA =====================
  {
    const id = 's-champ', a = BAR(BARS.champ[0]), b = BAR(BARS.champ[1]);
    const NP = 26;
    scene(id, a, b, `${photos('ch', [9714, 9713], a, b, { op: 0.5 })}<div class="burst" id="burst"></div>
      <div class="sparks">${Array.from({ length: NP }, (_, i) => `<i id="sp${i}" style="left:${(rnd(i * 7 + 1) * 100).toFixed(1)}%; --d:${(0.4 + rnd(i * 3 + 2) * 0.8).toFixed(2)}"></i>`).join('')}</div>
      <div class="chw" id="chw">${kick('Vítěz celé sezóny')}<h1 id="chh"><span>Mistr ČR</span><span class="gold">Trout Area</span></h1><small>${nb('putovní pohár · vyhlášení nejlepší trojice · zvlášť i kategorie HB')}</small></div>`);
    T0('#burst', { opacity: 0, scale: 0.6, rotation: 0 }, { opacity: 1, scale: 1.1, rotation: 40, duration: len(a, b), ease: 'none' }, a);
    rise('#chw .kick', a + 0.05); rise('#chh span', a + BEAT * 1.5, 0.7, BEAT);
    T0('#chw small', { opacity: 0 }, { opacity: 1, duration: 0.4 }, a + BEAT * 5);
    T0('#chh .gold', { backgroundPosition: '-150% 0' }, { backgroundPosition: '250% 0', duration: 1.4, ease: 'power2.inOut' }, a + BEAT * 4);
    for (let i = 0; i < NP; i++) { const t = a + BEAT * (1.5 + rnd(i * 5) * 6), d = 2 + rnd(i * 9) * 1.5;
      T0(`#sp${i}`, { opacity: 0, y: 10 * u, scale: 0.5 }, { opacity: 1, y: -60 * u * (0.5 + rnd(i * 2)), scale: 1, duration: d, ease: 'power1.out' }, t);
      T(`#sp${i}`, { opacity: 1 }, { opacity: 0, duration: 0.6 }, t + d - 0.6); }
    outT('#chw, #burst', b);
  }

  // ===================== 5d) MEZINÁRODNÍ SCÉNA: reprezentace → H-Battle, ATLAS, MS FIPSed =====================
  {
    const id = 's-world', a = BAR(BARS.world[0]), b = BAR(BARS.world[1]);
    const CARDS = [['lg_hb', 'H-Battle', 'evropský pohár na tvrdé nástrahy · dvoudenní'], ['lg_atlas', 'ATLAS', 'mezinárodní unie lig · týmový World Cup'], ['lg_fips', 'Mistrovství světa', 'FIPSed · reprezentace ČR']];
    const HH = P ? 92 * u : 62 * u;
    const tc0 = a + BEAT * 12.4;
    scene(id, a, b, `<div class="wbg"><i class="glb" id="glb"></i></div>${photos('wp', [9901, 9926, 9307, 9902], a, b, { op: 0.7 })}<div class="otx" id="otx">Reprezentace</div>
      <div class="blk wdh" id="wdh">${kick('Mezinárodní scéna')}<h2><span>${nb('Žebříček otevírá')}</span></h2><h2 class="red"><span>dveře do světa.</span></h2></div>
      <div class="wcards" id="wcards">${CARDS.map(([lg, t, s2], i) => `<div class="wc" id="wc${i}"><span class="wl"><img src="assets/${lg}.png" alt=""></span><div><b>${t}</b><small>${s2}</small></div></div>`).join('')}</div>`);
    T0('#glb', { rotation: 0, opacity: 0 }, { rotation: 25, opacity: 1, duration: len(a, b), ease: 'none' }, a);
    T0('#otx', { opacity: 0, xPercent: P ? -5 : 8 }, { opacity: 1, xPercent: P ? -25 : -12, duration: len(a, b), ease: 'none' }, a);
    rise('#wdh .kick', a + 0.05); rise('#wdh h2:nth-of-type(1) span', a + BEAT); rise('#wdh h2:nth-of-type(2) span', a + BEAT * 2);
    const tc = a + BEAT * 13;
    CARDS.forEach((_, i) => { const t = tc + BEAT * i * 2.2;
      T0(`#wc${i}`, { opacity: 0, x: 12 * u, rotationY: -50, transformPerspective: 1200 }, { opacity: 1, x: 0, rotationY: 0, duration: 0.6, ease: 'expo.out' }, t);
      T0(`#wc${i} .wl`, { scale: 0.3, rotation: -40 }, { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2)' }, t + 0.1); });
    outT('#wdh, #wcards, #otx', b);
  }

  // ===================== 5e) NOMINACE: žádné roky postupů, jedna sezóna =====================
  {
    const id = 's-num', a = BAR(BARS.num[0]), b = BAR(BARS.num[1]);
    scene(id, a, b, `<div class="rbg alt"></div>${hero('nm-h', 9032, P ? 70 * u : 96 * u)}
      <div class="blk nmh" id="nmh">${kick('Nominace')}<div class="ladder" id="ladder"><span>Krajská liga</span><span>2. liga</span><span>1. liga</span><i class="lx" id="lx"></i></div>
        <h2><span>${nb('Jedna sezóna')}</span></h2><h2 class="red"><span>stačí.</span></h2>
        <div class="flow" id="flow"><b>Žebříček</b><i>→</i><b>Nominace</b><i>→</i><b class="r">Reprezentace</b></div>
        <small class="fnote" id="fnote">${nb('ATLAS a H-Battle: 6 nejlepších výsledků z posledních 8 závodů. MS FIPSed: nominaci navrhuje státní trenér, žebříček je hlavní kritérium. Max. 2 mezinárodní závody ročně na závodníka.')}</small></div>`);
    heroIn('nm-h', a + 0.1, 1);
    rise('#nmh .kick', a + 0.05);
    T0('#ladder span', { opacity: 0, y: 2 * u }, { opacity: 1, y: 0, duration: 0.3, stagger: BEAT / 2 }, a + BEAT * 0.5);
    T0('#lx', { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: 'power2.out' }, a + BEAT * 3);
    T('#ladder', { opacity: 1 }, { opacity: 0.45, duration: 0.3 }, a + BEAT * 4);
    rise('#nmh h2:nth-of-type(1) span', a + BEAT * 4.5); rise('#nmh h2:nth-of-type(2) span', a + BEAT * 5.5);
    T0('#flow b, #flow i', { opacity: 0, x: -2 * u }, { opacity: 1, x: 0, duration: 0.35, ease: 'expo.out', stagger: BEAT / 2 }, a + BEAT * 7);
    T0('#fnote', { opacity: 0 }, { opacity: 1, duration: 0.4 }, a + BEAT * 9);
    outT('#nmh, #nm-h', b);
  }

  // ===================== 6) OTEVŘENÝ SYSTÉM (jen krátce, pozadí: tmavé siluety pstruhů) =====================
  {
    const id = 's-sys', a = BAR(BARS.sys[0]), b = BAR(BARS.sys[1]);
    // pstruh – silueta z boku (hlava vpravo): přední část pevná, zadní část + ocas se vlní (posunutá fáze)
    const FRONT = 'M56 9 C70 7 88 8 102 13 C110 15 116 18 117 20 C116 23 110 26 102 28 C88 32 70 33 56 31 Z M63 8.5 C65 3 72 2 75 6.5 C71 7.2 67 8 65 8.6 Z M90 28 C92 33 96 34 98 32 C96 30 94 29 92 28 Z M60 31 C62 35 66 36 68 34 C66 33 63 32 61 31 Z';
    const REAR = 'M59 9 C44 9 30 12 16 16.5 L16 23.5 C30 28 44 31 59 31 Z M26 14 C27 10.5 30.5 10.5 31.5 13 Z M31 27.5 C33 32 36.5 33 38.5 30 Z';
    const TAIL = 'M17.5 16.5 C11 13 5 9 0.5 6.5 C2.5 13 3.5 17 4.5 20 C3.5 23 2.5 27 0.5 33.5 C5 31 11 27 17.5 23.5 Z';
    const NF = 7;
    const FISH = Array.from({ length: NF }, (_, i) => { const d = rnd(i * 13 + 5);
      const band = P ? [8 + rnd(i * 3 + 1) * 18, 70 + rnd(i * 3 + 1) * 24][i % 2] : [10 + rnd(i * 3 + 1) * 14, 58 + rnd(i * 3 + 1) * 34][i % 2];
      return { y: band, s: 0.5 + d * 1.0, d, half: (4.5 + rnd(i * 5 + 3) * 3) * (1.4 - d * 0.5), ph: rnd(i * 11 + 4), x0: 6 + rnd(i * 17) * 22, x1: (P ? 55 : 45) + rnd(i * 19) * 35, beat: 0.26 + rnd(i * 23) * 0.06 }; });
    scene(id, a, b, `<div class="sysbg"></div><div class="fishes">${FISH.map((fh, i) => `<div class="fw" id="fw${i}" style="top:${fh.y.toFixed(1)}%; --s:${fh.s.toFixed(2)}; opacity:${(0.45 + fh.d * 0.45).toFixed(2)}; filter:blur(${((1 - fh.d) * 3).toFixed(1)}px)"><div class="ff" id="ff${i}"><svg viewBox="0 0 120 40"><g id="fr${i}"><g id="ft${i}"><path d="${TAIL}"/></g><path d="${REAR}"/></g><path d="${FRONT}"/></svg></div></div>`).join('')}</div>
      <div class="blk sysh" id="sysh">${kick('Otevřený systém')}<h1><span>Přihlásit se</span><span class="red">může každý.</span></h1>
        <div class="sysl" id="sysl">${['Registrace a platba online', 'Losování automaticky', 'Výsledky a žebříček online'].map((t, i) => `<span id="sl${i}"><i>✓</i>${t}</span>`).join('')}</div></div>
      <div class="dev" id="dev"><img class="lap" id="lap" src="assets/screens/a036.png" alt=""><img class="phn" id="phn" src="assets/screens/a050.png" alt=""></div>`);
    // ryby: plavou tam a zpět v záběru, na konci úseku plynulá otočka (scaleX) s náklonem, ocas a zadek těla kmitají s fázovým posunem
    FISH.forEach((fh, i) => { const dur = len(a, b) + 1, st = a - fh.ph * fh.half, legs = Math.ceil((b - st) / fh.half) + 1, dir0 = i % 2 ? 1 : -1;
      const xA = dir0 > 0 ? fh.x0 : fh.x1, xB = dir0 > 0 ? fh.x1 : fh.x0;
      SET(`#ff${i}`, { scaleX: dir0 }, a - 0.01);
      for (let k = 0; k < legs; k++) { const t = st + k * fh.half, fwd = k % 2 === 0, fx = fwd ? dir0 : -dir0;
        T(`#fw${i}`, { left: `${fwd ? xA : xB}%` }, { left: `${fwd ? xB : xA}%`, duration: fh.half, ease: 'sine.inOut' }, t);
        T(`#ff${i}`, { scaleX: fx }, { scaleX: -fx, duration: 0.7, ease: 'sine.inOut' }, t + fh.half - 0.35);
        T(`#fw${i}`, { rotation: 0 }, { rotation: fx * 7, duration: 0.35, ease: 'sine.out', yoyo: true, repeat: 1 }, t + fh.half - 0.35); }
      const bob = fh.half * 0.6, nb2 = Math.ceil(dur / bob);
      T(`#fw${i}`, { y: -2 * u * fh.s }, { y: 2 * u * fh.s, duration: bob, ease: 'sine.inOut', yoyo: true, repeat: nb2 }, a - 0.5);
      const per = fh.beat, n2 = Math.ceil(dur / per);
      T(`#fr${i}`, { rotation: -5 }, { rotation: 5, duration: per, ease: 'sine.inOut', yoyo: true, repeat: n2, svgOrigin: '58 20' }, a - 0.5);
      T(`#ft${i}`, { rotation: -11 }, { rotation: 11, duration: per, ease: 'sine.inOut', yoyo: true, repeat: n2, svgOrigin: '17 20' }, a - 0.5 + per / 2); });
    rise('#sysh .kick', a + 0.05); rise('#sysh h1 span', a + BEAT, 0.6, BEAT);
    T0('#sysl span', { opacity: 0, x: -3 * u }, { opacity: 1, x: 0, duration: 0.4, ease: 'expo.out', stagger: BEAT }, a + BEAT * 5);
    T0('#lap', { opacity: 0, x: 20 * u, rotationY: -25, transformPerspective: 1600 }, { opacity: 1, x: 0, rotationY: 0, duration: 0.9, ease: 'expo.out' }, a + BEAT * 4);
    T0('#phn', { opacity: 0, y: 25 * u, rotation: 8 }, { opacity: 1, y: 0, rotation: 0, duration: 0.8, ease: 'expo.out' }, a + BEAT * 6);
    T('#lap', { y: 0 }, { y: -1.5 * u, duration: len(a + 1, b), ease: 'sine.inOut' }, a + 1);
    outT('#sysh, #dev', b);
  }

  // ===================== 7) JAK ZAČÍT – reálné vybavení (výřezy produktů) v kartách s animací =====================
  {
    const id = 's-start', a = BAR(BARS.start[0]), b = BAR(BARS.start[1]);
    const KIT = [['Prut', 'Rodio Craft 999.9 Chimera 62L+', 'rod'], ['Naviják', 'Daiwa Exist', 'reel'], ['Nástrahy', 'Rodio Craft NOA', 'lure'], ['Podběrák', 'Timon T-Connection', 'net']];
    const VIS = {
      rod: `<img class="pr-rod" src="assets/cut/g_rod.png" alt=""><img class="pr-rodlogo" src="assets/cut/g_rodlogo.png" alt="">`,
      reel: `<img class="pr-reel" src="assets/cut/g_reel.png" alt="">`,
      lure: [0, 1, 2, 3, 4].map((k) => `<img class="pr-noa" id="noa${k}" src="assets/cut/g_noa${k}.png" alt="">`).join(''),
      net: `<img class="pr-net" src="assets/cut/g_net.png" alt="">`,
    };
    scene(id, a, b, `${photos('sa', [9627, 9305, 9813], a, b, { op: 0.45 })}
      <div class="blk sth" id="sth">${kick('Jak začít?')}<h2><span>${nb('Na začátek stačí základní výbava.')}</span></h2></div>
      <div class="kit gk" id="kit">${KIT.map(([t, br, k], i) => `<div class="ki gp" id="ki${i}"><div class="gvis" id="gv${i}">${VIS[k]}<i class="glint" id="gl${i}"></i></div><b>${t}</b><small>${br}</small></div>`).join('')}</div>
      <div class="hint" id="hint">${nb('Přátelská atmosféra. Zkušení rádi poradí.')}</div>`);
    rise('#sth .kick', a + 0.05); rise('#sth h2 span', a + BEAT);
    const tk = KIT.map((_, i) => a + BEAT * (3 + i * 1.6)), life = (t) => len(t, b + 0.5);
    KIT.forEach((_, i) => { const t = tk[i]; pop(`#ki${i}`, t);
      T0(`#gl${i}`, { xPercent: -160 }, { xPercent: 260, duration: 0.9, ease: 'power2.inOut' }, t + 0.5);
      T0(`#gl${i}`, { xPercent: -160 }, { xPercent: 260, duration: 0.9, ease: 'power2.inOut' }, t + 0.5 + BEAT * 8); });
    // prut: vjede zleva, mírně se vlní
    T0('#ki0 .pr-rod', { xPercent: -60, opacity: 0, rotation: -6 }, { xPercent: 0, opacity: 1, rotation: -4, duration: 0.8, ease: 'expo.out' }, tk[0] + 0.1);
    T0('#ki0 .pr-rod', { rotation: -4 }, { rotation: -2, duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: Math.ceil(life(tk[0]) / 1.2) }, tk[0] + 0.9);
    T0('#ki0 .pr-rodlogo', { opacity: 0, y: 2 * u }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' }, tk[0] + 0.6);
    // naviják: přiletí s rotací, pak se vznáší
    T0('#ki1 .pr-reel', { scale: 0.3, rotation: -40, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.8)' }, tk[1] + 0.1);
    T0('#ki1 .pr-reel', { y: -1 * u, rotation: -3 }, { y: 1 * u, rotation: 3, duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: Math.ceil(life(tk[1]) / 1.1) }, tk[1] + 0.9);
    // nástrahy: vějíř balení
    [0, 1, 2, 3, 4].forEach((k) => { const r = (k - 2) * 13, dx = (k - 2) * 18;
      T0(`#noa${k}`, { rotation: 0, xPercent: 0, opacity: 0, y: 4 * u }, { rotation: r, xPercent: dx, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.6)' }, tk[2] + 0.1 + k * 0.07);
      T0(`#noa${k}`, { rotation: r - 2 }, { rotation: r + 2, duration: 0.9 + k * 0.1, ease: 'sine.inOut', yoyo: true, repeat: Math.ceil(life(tk[2]) / 0.9) }, tk[2] + 0.8); });
    // podběrák: šikmo vjede, houpe se
    T0('#ki3 .pr-net', { xPercent: 40, yPercent: 30, rotation: 12, opacity: 0 }, { xPercent: 0, yPercent: 0, rotation: -8, opacity: 1, duration: 0.8, ease: 'expo.out' }, tk[3] + 0.1);
    T0('#ki3 .pr-net', { rotation: -8 }, { rotation: -4, duration: 1.0, ease: 'sine.inOut', yoyo: true, repeat: Math.ceil(life(tk[3]) / 1.0) }, tk[3] + 0.9);
    pop('#hint', tk[3] + BEAT * 3);
    outT('#sth, #kit, #hint', b);
  }

  // ===================== 7b) SPOLUPRÁCE S ČRS =====================
  {
    const id = 's-crs', a = BAR(BARS.crs[0]), b = BAR(BARS.crs[1]);
    scene(id, a, b, `${photos('cs', [86415], a, b, { op: 0.4 })}
      <div class="crsw" id="crsw"><small>Ve spolupráci s</small><span class="crsc" id="crsl"><img src="assets/crs.png" alt="Český rybářský svaz"></span></div>`);
    T0('#crsw small', { opacity: 0, y: 2 * u }, { opacity: 1, y: 0, duration: 0.4, ease: 'expo.out' }, a + 0.05);
    T0('#crsl', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }, a + BEAT);
    outT('#crsw', b);
  }

  // ===================== 8) CTA =====================
  {
    const id = 's-cta', a = BAR(BARS.cta[0]), b = DUR;
    scene(id, a, b, `${photos('ct', [9701, 9033], a, b, { op: 0.28 })}
      <div class="cta" id="cta"><img class="tal" id="tal" src="assets/ta_logo.png" alt="Trout Area Czech Republic">
        <h1 id="cth"><span>Přijď si to</span><span class="red">vyzkoušet.</span></h1>
        <div class="url" id="url"><small>Pravidla · termíny · výsledky · registrace</small><b>troutareacz.cz</b><i class="cur" id="cur"></i></div></div>
      <div class="ghm" id="gh-end"><span class="by">made by</span><span class="gear"><img class="ring" src="assets/gh/ring.png" alt=""><img class="core" src="assets/gh/core.png" alt=""></span><img class="wl2" src="assets/gh/word-line.png" alt="Gausse Holler"></div>`);
    T0('#gh-end', { opacity: 0, y: 2 * u }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, a + BEAT * 10);
    T0('#gh-end .ring', { rotation: 0 }, { rotation: 360, duration: len(a + BEAT * 10, b), ease: 'none' }, a + BEAT * 10);
    T0('#tal', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }, a + 0.05);
    rise('#cth span', a + BEAT * 2, 0.6, BEAT);
    T0('#url', { opacity: 0, y: 3 * u, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(2)' }, a + BEAT * 5);
    T0('#cur', { opacity: 0, x: 10 * u, y: 8 * u }, { opacity: 1, x: 0, y: 0, duration: 0.6, ease: 'power3.out' }, a + BEAT * 6);
    T('#url', { scale: 1 }, { scale: 0.95, duration: 0.12, yoyo: true, repeat: 1 }, a + BEAT * 7.5);
    T('#url', { boxShadow: '0 0 0 0px rgba(227,30,36,.0)' }, { boxShadow: `0 0 0 ${px(1.4)} rgba(227,30,36,.9)`, duration: 0.3, yoyo: true, repeat: 3 }, a + BEAT * 7.5);
    T('#cta, #gh-end', { opacity: 1 }, { opacity: 0, duration: 0.8 }, b - 0.8);
  }

  // ===================== hudební prvky: přehrávač, spektrum, bokeh, light leak =====================
  {
    const pa = BAR(BARS.what[0]), pb = BAR(BARS.cta[0]);
    T0('#player', { opacity: 0, y: 4 * u }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, pa + 0.3);
    T('#player', { opacity: 1 }, { opacity: 0, duration: 0.5 }, pb - 0.5);
    T0('#vinyl', { rotation: 0 }, { rotation: 200 * DUR, duration: DUR, ease: 'none' }, 0);
    T0('#pfill', { scaleX: 0 }, { scaleX: 1, duration: DUR, ease: 'none' }, 0);
    T0('#spec', { opacity: 0 }, { opacity: 0.6, duration: 0.8 }, 0.2);
    T('#spec', { opacity: 0.6 }, { opacity: 0, duration: 1.2 }, DUR - 1.4);
    T0('#bokeh i', { opacity: 0 }, { opacity: 0.8, duration: 1.0, stagger: 0.05 }, 0.5);
    for (let i = 0; i < 22; i++) T0(`#bk${i}`, { x: 0, y: 0 }, { x: (rnd(i * 3) - 0.5) * 16 * u, y: -(6 + rnd(i * 7) * 14) * u, duration: DUR, ease: 'none' }, 0);
    G.downbeats.forEach((t, i) => { if (i % 8 === 4 && t > 2 && t < DUR - 4) T0('#leak', { opacity: 0, xPercent: -40 }, { opacity: 1, xPercent: 40, duration: 1.6, ease: 'sine.inOut', yoyo: false }, t); });
    G.downbeats.forEach((t, i) => { if (i % 8 === 4 && t > 2 && t < DUR - 4) T('#leak', { opacity: 1 }, { opacity: 0, duration: 0.6 }, t + 1.1); });
    out.push(`{ const SP=${JSON.stringify(SPEC.spec)}, RM=${JSON.stringify(SPEC.rms)}, sb=[...document.querySelectorAll("#spec i")], eq=[...document.querySelectorAll("#peq i")], bk=[...document.querySelectorAll("#bokeh i")], pt=document.getElementById("ptime"), st=document.getElementById("stage"), o={t:0};
      tl.fromTo(o,{t:0},{t:${DUR.toFixed(2)},duration:${DUR.toFixed(2)},ease:"none",onUpdate(){ const f=Math.min(SP.length-1,Math.max(0,Math.round(o.t*30))), fr=SP[f], r=RM[f]/99;
        for(let i=0;i<sb.length;i++){ sb[i].style.transform="scaleY("+(0.04+0.96*Math.pow(fr[i]/99,1.6)).toFixed(3)+")"; }
        for(let i=0;i<eq.length;i++){ eq[i].style.transform="scaleY("+(0.15+0.85*fr[2+i*4]/99).toFixed(3)+")"; }
        for(let i=0;i<bk.length;i++){ bk[i].style.filter="brightness("+(0.6+1.4*r*(0.5+((i*37)%10)/20)).toFixed(2)+")"; }
        pt.textContent=Math.floor(o.t/60)+":"+String(Math.floor(o.t%60)).padStart(2,"0");
        st.style.setProperty("--pulse",(r*r).toFixed(3)); }},0); }`);
  }

  // ===================== globální rytmus =====================
  const NW = 14;
  starts.filter((t) => t > 1).forEach((t0) => { const t = t0 - 0.16;
    for (let i = 0; i < NW; i++) { const dl = Math.abs(i - (NW - 1) / 2) * 0.012;
      out.push(`tl.fromTo("#wp${i}", {scaleY:0}, {scaleY:1, duration:0.15, ease:"power3.out", immediateRender:false}, ${(t + dl).toFixed(3)});`);
      out.push(`tl.to("#wp${i}", {scaleY:0, duration:0.2, ease:"power3.in"}, ${(t + 0.19 + dl).toFixed(3)});`); } });
  G.downbeats.forEach((t, i) => { if (t < 0.3 || t > DUR - 2.5) return; const big = i % 4 === 0;
    out.push(`tl.fromTo("#flash", {opacity:${big ? 0.18 : 0.07}}, {opacity:0, duration:${big ? 0.45 : 0.25}, ease:"power2.out", immediateRender:false}, ${t.toFixed(3)});`);
    out.push(`tl.fromTo("#stage", {scale:${big ? 1.035 : 1.012}}, {scale:1, duration:0.4, ease:"power2.out", immediateRender:false}, ${t.toFixed(3)});`); });
  G.beats.filter((t) => t < BAR(2)).forEach((t) => out.push(`tl.fromTo("#stage", {filter:"brightness(1.35)"}, {filter:"brightness(1)", duration:0.18, immediateRender:false}, ${t.toFixed(3)});`));
  T0('#corner', { opacity: 0 }, { opacity: 0.92, duration: 0.5 }, BAR(BARS.what[0]));
  T('#corner', { opacity: 0.92 }, { opacity: 0, duration: 0.4 }, BAR(BARS.cta[0]) - 0.4);
  [[0, -18, 10], [1, 22, -14]].forEach(([k, dx, dy]) => out.push(`tl.fromTo("#blob${k}", {xPercent:0, yPercent:0}, {xPercent:${dx}, yPercent:${dy}, duration:${(DUR / 2).toFixed(2)}, ease:"sine.inOut", yoyo:true, repeat:1}, 0);`));

  const doc = `<!doctype html>
<html lang="cs"><head><meta charset="UTF-8" /><meta name="viewport" content="width=${W}, height=${H}" />
<title>Trout Area CZ – nábor LONG (${P ? '9:16' : '16:9'})</title>
<script src="assets/gsap.min.js"></script>
<style>
  ${FONTS}
  :root { --blue:#304285; --red:#e31e24; --navy:#0b1e42; --ice:#eef2f9; --deep:#050d22; --gold:#ffd36b; --lb:#8ea2d8; }
  body { margin:0; background:var(--deep); color:var(--ice); }
  * { font-family:Montserrat, sans-serif !important; box-sizing:border-box; }
  #root { position:relative; width:${W}px; height:${H}px; overflow:hidden; background:var(--deep); }
  .clip { position:absolute; inset:0; }
  #stage { --pulse:0; position:absolute; inset:0; overflow:hidden; background:radial-gradient(90% 60% at 50% 42%, #1d3a86 0%, #0b1e42 62%, #050d22 100%); }
  .blob { position:absolute; width:${px(P ? 110 : 80)}; height:${px(P ? 110 : 80)}; border-radius:50%; filter:blur(${px(9)}); }
  #blob0 { left:-15%; top:-10%; background:radial-gradient(circle, rgba(42,91,214,.5) 0%, transparent 65%); } #blob1 { right:-20%; bottom:-15%; background:radial-gradient(circle, rgba(227,30,36,.3) 0%, transparent 65%); }
  .ph { position:absolute; inset:-4%; background-size:cover; opacity:0; filter:saturate(1.3) brightness(1.12) contrast(1.12); }
  .pho { position:absolute; inset:0; background:linear-gradient(${P ? '180deg' : '90deg'}, rgba(5,13,34,.72) 0%, rgba(5,13,34,.22) 45%, rgba(5,13,34,0) 70%, rgba(5,13,34,.2) 100%); }
  .red { color:var(--red); }
  .kick { display:inline-flex; align-items:center; gap:${px(1.2)}; font:800 ${px(P ? 3 : 2.3)} Montserrat; letter-spacing:.16em; text-transform:uppercase; color:var(--gold); overflow:hidden; padding-top:.1em; }
  .kick i { width:${px(4)}; height:${px(0.5)}; background:var(--red); display:inline-block; }
  .blk { position:absolute; ${P ? `left:${px(7)}; right:${px(7)}; top:${px(30)}` : `left:${px(7)}; top:${px(17)}; width:${px(95)}`}; }
  .blk h1, .mega .ln { margin:${px(1)} 0 0; display:flex; flex-direction:column; font:900 ${px(P ? 13 : 11.5)}/0.95 Montserrat; letter-spacing:-.02em; text-transform:uppercase; }
  .blk h1 span, .blk h2 span, .mega span, .tagl h2 span { display:block; overflow:hidden; padding-top:.1em; margin-top:-.1em; }
  .blk h2, .tagl h2 { margin:${px(1)} 0 0; font:900 ${px(P ? 7.4 : 6.2)}/1.02 Montserrat; text-transform:uppercase; letter-spacing:-.01em; }
  .blk p { margin:${px(2.4)} 0 0; font:600 ${px(P ? 3.4 : 2.6)}/1.35 Montserrat; color:rgba(238,242,249,.88); max-width:${px(P ? 86 : 70)}; opacity:0; }
  .mega { position:absolute; ${P ? `left:${px(7)}; right:${px(7)}; top:${px(62)}` : `left:${px(7)}; bottom:${px(14)}`}; transform-origin:0 100%; }
  .mega .ln { font-size:${px(P ? 14 : 13)}; } .mega span { text-shadow:0 ${px(0.6)} ${px(3)} rgba(0,0,0,.45); }
  /* duel */
  .duel { position:absolute; ${P ? `left:${px(6)}; right:${px(6)}; top:${px(68)}` : `right:${px(7)}; top:${px(17)}; width:${px(76)}`}; display:grid; grid-template-columns:1fr auto 1fr; gap:${px(2)}; align-items:center; opacity:0; }
  .dc { background:rgba(238,242,249,.96); color:var(--navy); border-radius:${px(2)}; padding:${px(2.2)} ${px(1.6)}; text-align:center; box-shadow:0 ${px(1)} ${px(4)} rgba(0,0,0,.4); }
  .dc b { display:block; font:800 ${px(2.1)} Montserrat; text-transform:uppercase; letter-spacing:.08em; color:var(--blue); } .dc em { display:block; font:900 ${px(13)}/1 Montserrat; font-style:normal; color:var(--red); font-variant-numeric:tabular-nums; } .dc small { font:700 ${px(2)} Montserrat; text-transform:uppercase; letter-spacing:.12em; }
  .vs { display:flex; flex-direction:column; align-items:center; gap:${px(1)}; } .vs i { font:900 ${px(3.4)} Montserrat; font-style:normal; color:var(--gold); }
  .clock { position:relative; width:${px(13)}; height:${px(13)}; } .clock svg { width:100%; height:100%; transform:rotate(-90deg); } .clock circle { fill:none; stroke-width:7; } .cb { stroke:rgba(238,242,249,.2); } .cf { stroke:var(--gold); stroke-dasharray:1; stroke-linecap:round; }
  .clock span { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font:800 ${px(2.5)} Montserrat; font-variant-numeric:tabular-nums; }
  .win { grid-column:1 / 4; text-align:center; font:800 ${px(P ? 2.6 : 2.1)} Montserrat; text-transform:uppercase; letter-spacing:.08em; background:var(--red); border-radius:${px(1)}; padding:${px(1.2)}; opacity:0; }
  .rds { position:absolute; ${P ? `left:${px(6)}; right:${px(6)}; bottom:${px(22)}` : `left:${px(7)}; right:${px(7)}; bottom:${px(8)}`}; display:flex; flex-wrap:wrap; align-items:center; gap:${px(0.9)}; opacity:0; }
  .rds i { width:${px(P ? 6 : 4.6)}; height:${px(P ? 6 : 4.6)}; border-radius:50%; border:${px(0.4)} solid var(--gold); display:flex; align-items:center; justify-content:center; } .rds i b { font:800 ${px(P ? 2.4 : 1.9)} Montserrat; }
  .rds span { ${P ? 'flex-basis:100%;' : `margin-left:${px(1.5)};`} font:700 ${px(P ? 2.8 : 2.2)} Montserrat; color:rgba(238,242,249,.9); }
  /* pro každého */
  .tiles { position:absolute; inset:${P ? `${px(26)} ${px(6)} ${px(34)}` : `${px(14)} ${px(6)} ${px(16)}`}; display:grid; grid-template-columns:${P ? '1fr 1fr' : 'repeat(4, 1fr)'}; gap:${px(1.6)}; }
  .tl { position:relative; border-radius:${px(1.8)}; overflow:hidden; opacity:0; box-shadow:0 ${px(1)} ${px(4)} rgba(0,0,0,.45); }
  .tph { position:absolute; inset:0; background-size:cover; filter:saturate(1.08) brightness(1.06); } .tl::after { content:''; position:absolute; inset:0; background:linear-gradient(0deg, rgba(5,13,34,.85), transparent 45%); }
  .words { position:absolute; ${P ? `left:${px(6)}; right:${px(6)}; bottom:${px(32)}` : `left:${px(6)}; right:${px(6)}; bottom:${px(3)}`}; display:flex; flex-wrap:wrap; gap:0 ${px(3)}; font:900 ${px(P ? 9 : 7)}/1 Montserrat; text-transform:uppercase; text-shadow:0 ${px(0.5)} ${px(2)} rgba(0,0,0,.6); }
  .words b { display:block; overflow:hidden; padding-top:.1em; } .words b span { display:block; } .words b:nth-child(even) { color:var(--red); }
  .tl b { position:absolute; left:${px(2)}; bottom:${px(1.6)}; z-index:1; font:900 ${px(P ? 7 : 5)} Montserrat; text-transform:uppercase; }
  .tl:nth-child(2) b, .tl:nth-child(4) b { color:var(--red); }
  .tagl { position:absolute; ${P ? `left:${px(7)}; right:${px(7)}; top:${px(64)}` : `left:${px(7)}; bottom:${px(14)}; width:${px(110)}`}; }
  /* chyť a pusť */
  .crb { ${P ? `top:${px(54)}` : `top:auto; bottom:${px(12)}`}; }
  .chips { margin-top:${px(3)}; display:flex; flex-direction:${P ? 'column' : 'row'}; gap:${px(1.4)}; }
  .chip { display:flex; align-items:center; gap:${px(1.4)}; background:rgba(238,242,249,.95); color:var(--navy); border-radius:${px(1.6)}; padding:${px(1.3)} ${px(2)}; opacity:0; }
  .chip i { width:${px(4.4)}; height:${px(4.4)}; flex-shrink:0; border-radius:50%; background:var(--red); color:#fff; display:flex; align-items:center; justify-content:center; font:900 ${px(2.2)} Montserrat; font-style:normal; }
  .chip b { display:block; font:800 ${px(P ? 3.2 : 2.8)} Montserrat; white-space:nowrap; } .chip small { font:600 ${px(P ? 2.5 : 2.1)} Montserrat; color:var(--blue); }
  /* čísla */
  .nmh { top:${px(P ? 24 : 14)}; }
  .nums { position:absolute; ${P ? `left:${px(7)}; right:${px(7)}; top:${px(68)}` : `left:${px(7)}; right:${px(7)}; bottom:${px(12)}`}; display:grid; grid-template-columns:${P ? '1fr 1fr' : 'repeat(4, 1fr)'}; gap:${px(2)}; }
  .nm { background:rgba(5,13,34,.72); border-top:${px(0.7)} solid var(--red); border-radius:${px(1.4)}; padding:${px(2)} ${px(2.2)}; opacity:0; backdrop-filter:blur(${px(1)}); }
  .nm b { display:block; font:900 ${px(P ? 13 : 10)}/1 Montserrat; font-variant-numeric:tabular-nums; } .nm small { display:block; margin-top:${px(0.8)}; font:700 ${px(P ? 2.6 : 2)} Montserrat; text-transform:uppercase; letter-spacing:.08em; color:var(--gold); }
  /* souboj */
  .dbg { position:absolute; inset:0; background:radial-gradient(80% 70% at 50% 60%, #1b3c8c 0%, #0b1e42 60%, #050d22 100%); }
  .dhd { top:${px(P ? 22 : 13)}; }
  #s-duel .duel { ${P ? `top:${px(62)}; left:${px(5)}; right:${px(5)}` : `top:${px(44)}; left:50%; right:auto; width:${px(80)}; margin-left:${px(-40)}`}; background:rgba(5,13,34,.82); padding:${px(2)}; border-radius:${px(2)}; } #s-duel .dcap { ${P ? `top:${px(150)}` : ''} }
  .pond { position:absolute; ${P ? `top:${px(34)}` : `top:${px(36)}`}; opacity:0; }
  .ntag { position:absolute; margin:${px(-8)} 0 0 ${px(-7)}; background:var(--red); color:#fff; border-radius:${px(1)}; padding:${px(0.5)} ${px(1.2)}; font:900 ${px(P ? 2.4 : 1.9)} Montserrat; text-transform:uppercase; letter-spacing:.06em; white-space:nowrap; opacity:0; z-index:3; }
  .lg { white-space:nowrap; font-weight:800; } .lg.lo { color:var(--red); } .lg.le { color:var(--gold); }
  .water { position:absolute; inset:${px(2.2)} ${px(1)}; border-radius:${px(4)}; background:linear-gradient(180deg, #16407a, #0d2c5c); box-shadow:inset 0 0 ${px(4)} rgba(0,0,0,.6), 0 0 0 ${px(0.5)} rgba(142,162,216,.45); }
  .water::after { content:''; position:absolute; inset:0; border-radius:inherit; opacity:.25; background:repeating-linear-gradient(170deg, transparent 0 ${px(2)}, rgba(238,242,249,.35) ${px(2)} ${px(2.2)}); }
  .sn { position:absolute; width:${px(3.4)}; height:${px(3.4)}; margin:${px(-1.7)} 0 0 ${px(-1.7)}; border-radius:50%; border:${px(0.3)} solid rgba(238,242,249,.55); background:rgba(5,13,34,.6); opacity:0; }
  .sn em { position:absolute; left:50%; transform:translateX(-50%); font:700 ${px(1.4)} Montserrat; font-style:normal; color:var(--lb); white-space:nowrap; }
  .sn em { top:${px(3.4)}; font-size:${px(2)} !important; } .sn.up em { top:${px(-3.2)}; }
  .pr { position:absolute; height:${px(0.5)}; margin-top:${px(-0.25)}; background:linear-gradient(90deg, var(--red), var(--gold)); transform-origin:0 50%; opacity:0; border-radius:${px(0.3)}; }
  .ag { position:absolute; width:${px(P ? 5.5 : 4.4)}; height:${px(P ? 5.5 : 4.4)}; margin:${px(P ? -2.75 : -2.2)} 0 0 ${px(P ? -2.75 : -2.2)}; border-radius:50%; background:var(--c); box-shadow:0 0 0 ${px(0.35)} #0b1e42, 0 0 ${px(1.6)} var(--c); display:flex; align-items:center; justify-content:center; opacity:0; z-index:2; }
  .ag b { font:900 ${px(P ? 2.6 : 2.1)} Montserrat; color:#0b1e42; } .pt { position:absolute; bottom:100%; left:50%; transform:translateX(-50%); font:900 ${px(2.8)} Montserrat; text-decoration:none; color:var(--gold); opacity:0; white-space:nowrap; }
  .rnd { position:absolute; ${P ? `right:${px(7)}; top:${px(138)}` : `right:${px(7)}; top:${px(12)}`}; display:flex; align-items:baseline; gap:${px(0.8)}; opacity:0; }
  .rnd small { font:800 ${px(2.2)} Montserrat; text-transform:uppercase; letter-spacing:.12em; color:var(--lb); } .rnd b { font:900 ${px(8)}/1 Montserrat; color:var(--gold); font-variant-numeric:tabular-nums; min-width:${px(9)}; text-align:right; }
  .dcap { position:absolute; ${P ? `left:${px(7)}; right:${px(7)}; top:${px(120)}` : `left:${px(7)}; right:${px(7)}; bottom:${px(6)}`}; font:700 ${px(P ? 3.3 : 2.6)}/1.35 Montserrat; text-align:${P ? 'left' : 'center'}; opacity:0; }
  .dcap b { color:var(--gold); text-transform:uppercase; letter-spacing:.1em; } .dcap.fin { font-weight:800; color:var(--ice); } 
  .win { display:flex; justify-content:center; gap:${px(1.6)}; flex-wrap:wrap; font-size:${px(P ? 3 : 2.4)} !important; } .win span { white-space:nowrap; } .win b { font-weight:900; }
  /* ryby */
  .fishes { position:absolute; inset:0; overflow:hidden; }
  .fw { position:absolute; left:-25%; width:${px(18)}; height:${px(6)}; margin:${px(-3)} 0 0 ${px(-9)}; scale:var(--s); }
  .ff { width:100%; height:100%; } .ff svg { width:100%; height:100%; overflow:visible; } .ff path { fill:#020610; }
  .sysl { margin-top:${px(3)}; display:flex; flex-direction:column; gap:${px(1.2)}; } .sysl span { display:flex; align-items:center; gap:${px(1.2)}; font:700 ${px(P ? 3.2 : 2.4)} Montserrat; opacity:0; } .sysl i { width:${px(3.4)}; height:${px(3.4)}; border-radius:50%; background:#1fae5b; color:#fff; display:flex; align-items:center; justify-content:center; font:900 ${px(1.8)} Montserrat; font-style:normal; }
  /* ČRS */
  .crsw { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:${px(2.4)}; text-align:center; }
  .crsw small { font:700 ${px(P ? 3.4 : 2.6)} Montserrat; text-transform:uppercase; letter-spacing:.12em; color:var(--gold); opacity:0; }
  .crsc { background:#fff; border-radius:${px(2.4)}; padding:${px(2)} ${px(3.2)}; opacity:0; box-shadow:0 ${px(1)} ${px(4)} rgba(0,0,0,.5); } .crsc img { display:block; width:${px(P ? 50 : 30)}; } .crsw b { display:block; overflow:hidden; font:900 ${px(P ? 6.4 : 5.4)} Montserrat; text-transform:uppercase; }
  /* systém */
  .sysbg { position:absolute; inset:0; background:radial-gradient(80% 70% at 70% 40%, #2a4aa8 0%, #0b1e42 60%, #050d22 100%); }
  .sysbg::after { content:''; position:absolute; inset:0; opacity:.14; background:linear-gradient(rgba(238,242,249,.6) 1px, transparent 1px) 0 0 / ${px(5)} ${px(5)}, linear-gradient(90deg, rgba(238,242,249,.6) 1px, transparent 1px) 0 0 / ${px(5)} ${px(5)}; -webkit-mask-image:radial-gradient(circle at 60% 50%, #000, transparent 75%); }
  .sysh { ${P ? `top:${px(24)}` : ''}; } .sysh h1 { ${P ? `font-size:${px(11)};` : ''} } .sysh p { opacity:0; }
  .dev { position:absolute; ${P ? `left:${px(4)}; right:${px(4)}; top:${px(84)}; height:${px(80)}` : `right:${px(2)}; top:${px(12)}; width:${px(82)}; height:${px(76)}`}; }
  .lap { position:absolute; ${P ? 'left:0; width:88%; top:0' : 'right:6%; width:92%; top:2%'}; filter:drop-shadow(0 ${px(2)} ${px(5)} rgba(0,0,0,.5)); opacity:0; }
  .phn { position:absolute; ${P ? 'right:-4%; width:52%; bottom:-8%' : 'right:-6%; width:40%; bottom:-6%'}; filter:drop-shadow(0 ${px(2)} ${px(4)} rgba(0,0,0,.5)); opacity:0; }
  .stph { top:${px(P ? 20 : 12)}; } .stph .kick { color:var(--gold); }
  .steps { position:absolute; ${P ? `left:${px(6)}; right:${px(6)}; top:${px(44)}; bottom:${px(26)}; grid-template-columns:1fr 1fr` : `left:${px(7)}; right:${px(7)}; top:${px(32)}; bottom:${px(15)}; grid-template-columns:repeat(4, 1fr)`}; display:grid; gap:${px(1.8)}; }
  .st { background:rgba(238,242,249,.97); color:var(--navy); border-radius:${px(2)}; padding:${px(1.8)}; opacity:0; display:flex; flex-direction:column; gap:${px(1.4)}; box-shadow:0 ${px(1.4)} ${px(5)} rgba(0,0,0,.45); }
  .sh { display:flex; gap:${px(1.68)}; align-items:flex-start; position:relative; } .sh > i { width:${px(6.44)}; height:${px(6.44)}; flex-shrink:0; border-radius:${px(1.4)}; background:var(--blue); color:#fff; display:flex; align-items:center; justify-content:center; font:900 ${px(3.36)} Montserrat; font-style:normal; }
  .sh b { display:block; font:800 ${px(P ? 3.4 : 2.6)}/1.15 Montserrat; padding-right:${px(4)}; } .sh small { display:block; margin-top:${px(0.56)}; font:600 ${px(P ? 2.5 : 2)}/1.3 Montserrat; color:#5a6a9a; }
  .ck { position:absolute; right:0; top:0; width:${px(5.04)}; height:${px(5.04)}; border-radius:50%; background:#1fae5b; color:#fff; display:flex; align-items:center; justify-content:center; font:900 ${px(2.8)} Montserrat; font-style:normal; opacity:0; }
  .ui { flex:1; border-radius:${px(1.68)}; background:#e3e9f6; padding:${px(1.96)}; display:flex; flex-direction:column; gap:${px(1.26)}; justify-content:center; }
  .uform .f { display:block; height:${px(5.04)}; border-radius:${px(2.52)}; background:#fff; border:${px(0.28)} solid #b8c4e3; padding:0 ${px(1.96)}; font:600 ${px(2.38)}/${px(4.48)} Montserrat; } .uform em { font-style:normal; }
  .btn { align-self:flex-start; background:var(--blue); color:#fff; border-radius:${px(2.8)}; padding:${px(1.26)} ${px(2.8)}; font:800 ${px(2.38)} Montserrat; }
  .upay .ev { background:#fff; border-radius:${px(1.4)}; padding:${px(1.4)} ${px(1.68)}; } .upay .ev b { display:block; font:800 ${px(2.52)} Montserrat; } .upay .ev small { font:600 ${px(2.1)} Montserrat; color:#5a6a9a; }
  .ok { font:800 ${px(2.24)} Montserrat; color:#1a8f4c; opacity:0; }
  .udraw { display:grid; grid-template-columns:repeat(3, 1fr); gap:${px(1.12)}; } .udraw i { background:#fff; border-radius:${px(1.12)}; height:${px(7.0)}; display:flex; align-items:center; gap:${px(0.84)}; padding:0 ${px(1.12)}; opacity:0; }
  .udraw i b { width:${px(3.92)}; height:${px(3.92)}; border-radius:50%; background:var(--red); color:#fff; display:flex; align-items:center; justify-content:center; font:900 ${px(1.96)} Montserrat; flex-shrink:0; } .udraw i span { flex:1; height:${px(1.12)}; border-radius:${px(0.56)}; background:#b8c4e3; }
  .ures i { display:flex; align-items:center; gap:${px(1.12)}; font-style:normal; } .ures b { width:${px(3.64)}; font:900 ${px(2.24)} Montserrat; } .ures span { height:${px(2.24)}; border-radius:${px(1.12)}; background:linear-gradient(90deg, var(--blue), #4f6fd0); transform-origin:0 50%; } .ures i:first-child span { background:linear-gradient(90deg, var(--red), #ff6a5a); } .ures em { white-space:nowrap; font:800 ${px(2.1)} Montserrat; font-style:normal; color:var(--blue); }
  .auto { position:absolute; ${P ? `left:${px(6)}; right:${px(6)}; bottom:${px(16)}` : `left:${px(7)}; right:${px(7)}; bottom:${px(7)}`}; display:flex; align-items:center; gap:${px(2)}; opacity:0; font:800 ${px(P ? 2.8 : 2.2)} Montserrat; text-transform:uppercase; letter-spacing:.14em; color:var(--gold); }
  .auto i { flex:1; height:${px(0.5)}; background:linear-gradient(90deg, var(--gold), var(--red)); transform-origin:0 50%; border-radius:${px(0.3)}; }
  /* jak začít */
  .sth { top:${px(P ? 24 : 14)}; }
  .kit { position:absolute; ${P ? `left:${px(7)}; right:${px(7)}; top:${px(68)}` : `left:${px(7)}; right:${px(7)}; top:${px(42)}`}; display:grid; grid-template-columns:${P ? '1fr 1fr' : 'repeat(4, 1fr)'}; gap:${px(2)}; }
  .ki { background:rgba(5,13,34,.72); border:${px(0.25)} solid rgba(238,242,249,.25); border-radius:${px(2)}; padding:${px(2.4)}; display:flex; flex-direction:column; align-items:flex-start; gap:${px(1.4)}; opacity:0; backdrop-filter:blur(${px(1)}); }
  .kit:not(.gk) .ki svg { width:${px(P ? 13 : 10)}; height:${px(P ? 13 : 10)}; } .kit:not(.gk) .ki svg * { fill:none; stroke:var(--ice); stroke-linecap:round; stroke-linejoin:round; stroke-dasharray:1; } .kit:not(.gk) .ki svg circle[r="3"], .kit:not(.gk) .ki svg circle[r="2.5"] { stroke-width:4; }
  .ki b { font:800 ${px(P ? 3.2 : 2.4)}/1.2 Montserrat; }
  .hint { position:absolute; ${P ? `left:${px(7)}; right:${px(7)}; top:${px(132)}` : `left:${px(7)}; right:${px(7)}; bottom:${px(10)}`}; font:800 ${px(P ? 3.6 : 2.8)} Montserrat; color:var(--gold); opacity:0; }
  /* CTA */
  .cta { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; gap:${px(P ? 4 : 2.6)}; }
  .tal { width:${px(P ? 70 : 46)}; opacity:0; filter:drop-shadow(0 ${px(0.6)} ${px(2)} rgba(0,0,0,.5)); }
  #s-cta .pho { background:radial-gradient(60% 50% at 50% 50%, rgba(5,13,34,.85), rgba(5,13,34,.5)); }
  .cta h1 { text-shadow:0 ${px(0.6)} ${px(3)} rgba(0,0,0,.6); margin:0; display:flex; flex-direction:column; align-items:center; font:900 ${px(P ? 11 : 9.5)}/0.95 Montserrat; text-transform:uppercase; letter-spacing:-.02em; } .cta h1 span { display:block; overflow:hidden; padding-top:.1em; margin-top:-.1em; }
  .url { position:relative; background:var(--ice); color:var(--navy); border-radius:${px(10)}; padding:${px(1.6)} ${px(5)}; display:flex; flex-direction:column; align-items:center; opacity:0; }
  .url small { font:700 ${px(P ? 2.4 : 1.8)} Montserrat; text-transform:uppercase; letter-spacing:.12em; color:var(--blue); } .url b { font:900 ${px(P ? 6.4 : 5)} Montserrat; letter-spacing:-.01em; color:var(--red); }
  .cur { position:absolute; right:${px(2)}; bottom:${px(-2.4)}; width:${px(4)}; height:${px(4)}; opacity:0; background:no-repeat center/contain url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M4 2l16 9-7 2-3 7z' fill='%23fff' stroke='%230b1e42' stroke-width='1.5'/%3E%3C/svg%3E"); }
  /* hero výřezy */
  .hero { position:absolute; opacity:0; } .hero img, .hero i { position:absolute; inset:0; width:100%; height:100%; display:block; }
  .hero .e1 { background:var(--red); opacity:0; } .hero .e2 { background:#2a5bd6; opacity:0; } .hero img { filter:drop-shadow(0 ${px(1.4)} ${px(3)} rgba(0,0,0,.55)) saturate(1.08) contrast(1.04); }
  .gold { background:linear-gradient(100deg, #ffd36b 0%, #ffd36b 38%, #fff6d8 50%, #ffd36b 62%, #ffd36b 100%) 0 0 / 300% 100%; -webkit-background-clip:text; background-clip:text; color:transparent !important; }
  /* pravidla */
  .rlh { top:${px(P ? 22 : 12)}; }
  .rules { position:absolute; ${P ? `left:${px(6)}; right:${px(6)}; top:${px(60)}; grid-template-columns:1fr 1fr` : `left:${px(7)}; right:${px(7)}; top:${px(42)}; grid-template-columns:repeat(3, 1fr)`}; display:grid; gap:${px(1.8)}; }
  .ru { background:rgba(5,13,34,.78); border:${px(0.22)} solid rgba(238,242,249,.18); border-left:${px(0.8)} solid var(--red); border-radius:${px(1.6)}; padding:${px(P ? 2.4 : 2)} ${px(2.4)}; opacity:0; backdrop-filter:blur(${px(1)}); }
  .ru i { display:block; font:900 ${px(P ? 3 : 2.2)} Montserrat; font-style:normal; color:var(--gold); letter-spacing:.1em; } .ru b { display:block; margin-top:${px(0.6)}; font:900 ${px(P ? 4 : 3)}/1.1 Montserrat; text-transform:uppercase; } .ru small { display:block; margin-top:${px(0.6)}; font:600 ${px(P ? 2.7 : 2.1)}/1.3 Montserrat; color:rgba(238,242,249,.75); }
  /* sezóna */
  .gridbg { position:absolute; inset:0; opacity:.12; background:linear-gradient(rgba(238,242,249,.6) 1px, transparent 1px) 0 0 / ${px(6)} ${px(6)}, linear-gradient(90deg, rgba(238,242,249,.6) 1px, transparent 1px) 0 0 / ${px(6)} ${px(6)}; }
  .seh { top:${px(P ? 20 : 11)}; }
  .track { position:absolute; ${P ? `left:${px(6)}; right:${px(6)}; top:${px(64)}` : `left:${px(7)}; right:${px(7)}; top:${px(43)}`}; display:grid; grid-template-columns:1fr 1fr; gap:${px(P ? 3 : 6)}; }
  .tline { position:absolute; left:0; right:0; top:${px(P ? 15 : 11.5)}; height:${px(0.5)}; background:linear-gradient(90deg, #7fd0ff, var(--gold), var(--red)); transform-origin:0 50%; border-radius:${px(0.3)}; }
  .tseg { opacity:0; } .tseg b { display:block; font:900 ${px(P ? 6 : 4.6)} Montserrat; text-transform:uppercase; } .tseg small { display:block; font:700 ${px(P ? 2.8 : 2.1)} Montserrat; color:var(--gold); text-transform:uppercase; letter-spacing:.1em; }
  .pins { display:flex; gap:${px(P ? 2 : 3)}; margin-top:${px(P ? 5 : 4.5)}; }
  .pin { position:relative; width:${px(P ? 10 : 8)}; height:${px(P ? 10 : 8)}; border-radius:50% 50% 50% 0; transform-origin:50% 100%; background:var(--red); display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow:0 ${px(0.8)} ${px(2.4)} rgba(0,0,0,.5); opacity:0; }
  .pin em { font:900 ${px(P ? 4 : 3.2)}/1 Montserrat; font-style:normal; } .pin s { text-decoration:none; font:700 ${px(P ? 1.6 : 1.3)} Montserrat; text-transform:uppercase; letter-spacing:.08em; }
  .tseg:nth-child(3) .pin { background:#2a5bd6; }
  .day { position:absolute; ${P ? `left:${px(6)}; right:${px(6)}; top:${px(122)}` : `left:${px(7)}; right:${px(7)}; bottom:${px(8)}`}; display:flex; align-items:center; gap:${px(3)}; background:rgba(5,13,34,.78); border-radius:${px(2)}; padding:${px(2)} ${px(3)}; opacity:0; }
  .dclock { position:relative; width:${px(P ? 16 : 11)}; height:${px(P ? 16 : 11)}; flex-shrink:0; } .dclock svg { width:100%; height:100%; transform:rotate(-90deg); } .dclock circle { fill:none; stroke-width:7; }
  .dclock span { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font:800 ${px(P ? 3.2 : 2.3)} Montserrat; font-variant-numeric:tabular-nums; }
  .dtx { flex:1; } .dtx b { display:block; font:900 ${px(P ? 4 : 3)} Montserrat; text-transform:uppercase; } .dtx small { display:block; margin-top:${px(0.5)}; font:700 ${px(P ? 2.6 : 2)} Montserrat; color:var(--lb); }
  .ticks { display:flex; gap:${px(0.6)}; margin-top:${px(1.2)}; } .ticks i { flex:1; height:${px(1.4)}; border-radius:${px(0.4)}; background:var(--gold); transform-origin:50% 100%; }
  /* žebříček */
  .rbg { position:absolute; inset:0; background:radial-gradient(70% 70% at ${P ? '50% 20%' : '80% 50%'}, #2a4aa8 0%, #0b1e42 55%, #050d22 100%); }
  .rbg.alt { background:radial-gradient(70% 70% at ${P ? '50% 15%' : '78% 45%'}, #8a1c2a 0%, #2a1e52 45%, #050d22 100%); }
  #rk-h { ${P ? `right:${px(-4)}; top:${px(4)}; opacity:0` : `right:${px(4)}; bottom:0`}; } #rk-h img { opacity:.95; }
  .rkh { top:${px(P ? 20 : 11)}; ${P ? `right:${px(36)}` : ''} } .rkh h2 { ${P ? `font-size:${px(6.4)}` : ''} }
  .tbl { position:absolute; ${P ? `left:${px(5)}; right:${px(5)}; top:${px(72)}` : `left:${px(7)}; width:${px(108)}; top:${px(36)}`}; background:rgba(5,13,34,.82); border-radius:${px(2)}; padding:${px(1.6)} ${px(2)}; opacity:0; box-shadow:0 ${px(1.4)} ${px(5)} rgba(0,0,0,.45); }
  .thd, .tr { display:grid; grid-template-columns:${P ? `${px(10)} repeat(6, 1fr) ${px(13)}` : `${px(8)} repeat(6, 1fr) ${px(10)}`}; align-items:center; text-align:center; }
  .thd span { font:800 ${px(P ? 2.6 : 1.9)} Montserrat; color:var(--lb); letter-spacing:.08em; padding-bottom:${px(1)}; }
  .tbd { position:relative; } .tr { position:absolute; left:0; right:0; top:0; border-radius:${px(1.2)}; border-top:1px solid rgba(238,242,249,.08); }
  .who { display:flex; justify-content:center; } .who b { width:${px(P ? 6.4 : 4.6)}; height:${px(P ? 6.4 : 4.6)}; border-radius:50%; background:var(--c); color:#0b1e42; display:flex; align-items:center; justify-content:center; font:900 ${px(P ? 3 : 2.2)} Montserrat; }
  .cl { position:relative; font:800 ${px(P ? 3.6 : 2.6)} Montserrat; font-variant-numeric:tabular-nums; } .cl em { display:inline-block; font-style:normal; opacity:0; }
  .x { position:absolute; left:20%; right:20%; top:50%; height:${px(0.45)}; background:var(--red); transform:scaleX(0); transform-origin:50% 50%; border-radius:${px(0.3)}; box-shadow:0 0 ${px(0.8)} rgba(227,30,36,.8); }
  .sm { font:900 ${px(P ? 3.6 : 2.7)} Montserrat; color:var(--gold); font-variant-numeric:tabular-nums; }
  .lead { position:absolute; left:${px(P ? -4.2 : -3.4)}; top:50%; margin-top:${px(P ? -3 : -2.3)}; font:900 ${px(P ? 3.4 : 2.4)} Montserrat; font-style:normal; color:var(--gold); opacity:0; }
  .rnote { position:absolute; ${P ? `left:${px(5)}; right:${px(5)}; top:${px(140)}` : `left:${px(7)}; width:${px(108)}; bottom:${px(5)}`}; opacity:0; border-left:${px(0.8)} solid var(--red); padding-left:${px(2)}; }
  .rnote b { display:block; font:900 ${px(P ? 4 : 2.9)} Montserrat; text-transform:uppercase; } .rnote small { font:700 ${px(P ? 2.6 : 2)} Montserrat; color:var(--lb); }
  /* mistr */
  .burst { position:absolute; left:50%; top:${P ? '40%' : '50%'}; width:${px(P ? 220 : 200)}; height:${px(P ? 220 : 200)}; margin:${px(P ? -110 : -100)} 0 0 ${px(P ? -110 : -100)}; background:repeating-conic-gradient(rgba(255,211,107,.22) 0deg 6deg, transparent 6deg 18deg); -webkit-mask-image:radial-gradient(circle, #000 10%, transparent 65%); mask-image:radial-gradient(circle, #000 10%, transparent 65%); opacity:0; }
  .sparks i { position:absolute; bottom:-2%; width:${px(0.9)}; height:${px(0.9)}; border-radius:50%; background:var(--gold); box-shadow:0 0 ${px(1.2)} var(--gold); opacity:0; scale:var(--d); }
  .chw { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; gap:${px(1.6)}; }
  .chw h1 { margin:0; display:flex; flex-direction:column; align-items:center; font:900 ${px(P ? 14 : 12)}/0.95 Montserrat; text-transform:uppercase; letter-spacing:-.02em; text-shadow:0 ${px(0.6)} ${px(3)} rgba(0,0,0,.5); } .chw h1 span { display:block; overflow:hidden; padding-top:.1em; margin-top:-.1em; } .chw h1 .gold { text-shadow:none; filter:drop-shadow(0 ${px(0.5)} ${px(2)} rgba(0,0,0,.5)); }
  .chw small { font:700 ${px(P ? 2.8 : 2.1)} Montserrat; text-transform:uppercase; letter-spacing:.1em; color:rgba(238,242,249,.85); opacity:0; max-width:${px(P ? 85 : 120)}; }
  #s-champ .pho { background:radial-gradient(60% 55% at 50% 50%, rgba(5,13,34,.55), rgba(5,13,34,.85)); }
  /* svět */
  .wbg { position:absolute; inset:0; background:radial-gradient(80% 70% at 50% 40%, #1d3a86 0%, #0b1e42 55%, #050d22 100%); overflow:hidden; }
  .glb { position:absolute; left:50%; top:${P ? '36%' : '55%'}; width:${px(P ? 150 : 120)}; height:${px(P ? 150 : 120)}; margin:${px(P ? -75 : -60)} 0 0 ${px(P ? -75 : -60)}; border-radius:50%; border:${px(0.3)} solid rgba(142,162,216,.35);
    background:repeating-linear-gradient(0deg, transparent 0 ${px(7.5)}, rgba(142,162,216,.22) ${px(7.5)} ${px(7.8)}), repeating-radial-gradient(ellipse 30% 100% at 50% 50%, transparent 0 ${px(7.5)}, rgba(142,162,216,.18) ${px(7.5)} ${px(7.8)}); -webkit-mask-image:radial-gradient(circle, #000 55%, transparent 72%); }
  .otx { position:absolute; ${P ? `left:0; top:${px(66)}` : `left:0; top:${px(30)}`}; white-space:nowrap; font:900 ${px(P ? 26 : 22)}/1 Montserrat; text-transform:uppercase; letter-spacing:-.02em; color:transparent; -webkit-text-stroke:${px(0.25)} rgba(238,242,249,.22); opacity:0; }
  .heroes { position:absolute; left:0; right:0; bottom:0; height:${px(P ? 92 : 62)}; display:flex; justify-content:center; align-items:flex-end; gap:${px(P ? 2 : 5)}; } .heroes .hero { position:relative; }
  .wdh { top:${px(P ? 16 : 11)}; }
  .wcards { position:absolute; ${P ? `left:${px(6)}; right:${px(6)}; top:${px(70)}` : `left:50%; width:${px(96)}; margin-left:${px(-48)}; top:${px(40)}`}; display:flex; flex-direction:column; gap:${px(1.8)}; }
  .wc { display:flex; align-items:center; gap:${px(2.4)}; background:rgba(238,242,249,.96); color:var(--navy); border-radius:${px(2)}; padding:${px(1.6)} ${px(2.4)}; opacity:0; box-shadow:0 ${px(1.4)} ${px(5)} rgba(0,0,0,.45); }
  .wl { width:${px(P ? 12 : 9)}; height:${px(P ? 12 : 9)}; flex-shrink:0; border-radius:50%; background:#fff; display:flex; align-items:center; justify-content:center; overflow:hidden; box-shadow:0 0 0 ${px(0.4)} rgba(48,66,133,.25); } .wl img { width:92%; height:92%; object-fit:contain; }
  .wc b { display:block; font:900 ${px(P ? 4.6 : 3.4)} Montserrat; text-transform:uppercase; color:var(--blue); } .wc small { display:block; font:700 ${px(P ? 2.6 : 2)} Montserrat; color:#5a6a9a; }
  /* nominace */
  #nm-h { ${P ? `right:${px(-6)}; bottom:0` : `right:${px(6)}; bottom:0`}; }
  #s-num .nmh { top:${px(P ? 18 : 12)}; ${P ? '' : `width:${px(100)}`} }
  .ladder { position:relative; display:flex; gap:${px(1.4)}; margin:${px(2)} 0 ${px(1.2)}; } .ladder span { font:800 ${px(P ? 2.8 : 2.1)} Montserrat; text-transform:uppercase; letter-spacing:.06em; padding:${px(0.8)} ${px(1.6)}; border:${px(0.25)} solid rgba(238,242,249,.4); border-radius:${px(1)}; opacity:0; }
  .lx { position:absolute; left:-2%; right:-2%; top:50%; height:${px(0.6)}; background:var(--red); transform:scaleX(0) rotate(-3deg); transform-origin:0 50%; }
  .flow { display:flex; flex-wrap:wrap; align-items:center; gap:${px(1.2)}; margin-top:${px(3)}; } .flow b { font:900 ${px(P ? 3.4 : 2.6)} Montserrat; text-transform:uppercase; background:rgba(238,242,249,.95); color:var(--navy); padding:${px(0.8)} ${px(1.6)}; border-radius:${px(1)}; opacity:0; } .flow b.r { background:var(--red); color:#fff; } .flow i { font:900 ${px(3)} Montserrat; font-style:normal; color:var(--gold); opacity:0; }
  .fnote { display:block; margin-top:${px(2.4)}; max-width:${px(P ? 60 : 92)}; font:600 ${px(P ? 2.5 : 1.9)}/1.35 Montserrat; color:rgba(238,242,249,.75); opacity:0; }

  /* sezóna – víkendy */
  .cal { position:absolute; ${P ? `left:${px(6)}; right:${px(6)}; top:${px(62)}` : `left:${px(7)}; right:${px(7)}; top:${px(40)}`}; }
  .cal .tline { top:${px(P ? 13 : 10)}; }
  .sea { position:absolute; top:0; opacity:0; } .sea.s1 { left:0; } .sea.s2 { left:50%; } .sea b { display:block; font:900 ${px(P ? 5.6 : 4.4)} Montserrat; text-transform:uppercase; } .sea small { display:block; font:700 ${px(P ? 2.6 : 2)} Montserrat; color:var(--gold); text-transform:uppercase; letter-spacing:.1em; }
  .wks { position:absolute; left:0; right:0; top:${px(P ? 19 : 15)}; display:grid; grid-template-columns:repeat(4, 1fr); gap:${px(P ? 1.6 : 2.4)}; }
  .wk { background:rgba(5,13,34,.8); border:${px(0.22)} solid rgba(238,242,249,.2); border-radius:${px(1.6)}; padding:${px(1.4)}; opacity:0; } .wk:nth-child(-n+2) { border-top:${px(0.7)} solid #7fd0ff; } .wk:nth-child(n+3) { border-top:${px(0.7)} solid var(--red); }
  .wk > small { display:block; font:800 ${px(P ? 2.4 : 1.9)} Montserrat; text-transform:uppercase; letter-spacing:.1em; color:var(--lb); } .wk.mcr > small { color:var(--gold); }
  .dd { display:flex; gap:${px(P ? 1 : 1.4)}; margin-top:${px(1)}; } .dpin { flex:1; border-radius:${px(1.2)}; background:var(--red); display:flex; flex-direction:column; align-items:center; padding:${px(0.8)} 0; opacity:0; } .wk:nth-child(-n+2) .dpin { background:#2a5bd6; }
  .dpin em { font:900 ${px(P ? 4.2 : 3.4)}/1 Montserrat; font-style:normal; } .dpin s { text-decoration:none; font:700 ${px(P ? 1.6 : 1.3)} Montserrat; text-transform:uppercase; letter-spacing:.06em; }
  .free { position:absolute; left:0; ${P ? `top:${px(50)}` : `top:${px(36)}`}; border-left:${px(0.8)} solid var(--gold); padding-left:${px(2)}; opacity:0; } .free b { display:block; font:900 ${px(P ? 4 : 3)} Montserrat; text-transform:uppercase; } .free small { font:700 ${px(P ? 2.6 : 2)} Montserrat; color:var(--lb); }
  /* žebříček 8 dnů */
  .t8 .thd, .t8 .tr { grid-template-columns:${P ? `${px(9)} repeat(8, 1fr) ${px(11)}` : `${px(8)} repeat(8, 1fr) ${px(10)}`}; }
  .t8 .cl { font-size:${px(P ? 3.2 : 2.4)}; } .cl.ab em { color:var(--red); }
  .tleg { margin-top:${px(1.2)}; font:700 ${px(P ? 2.3 : 1.7)} Montserrat; color:var(--lb); } .tleg i { color:var(--red); font-style:normal; font-weight:900; }
  .ghm { position:absolute; left:0; right:0; top:${P ? '84%' : '86%'}; display:flex; align-items:center; justify-content:center; gap:${px(1.4)}; opacity:0; font:800 ${px(2)} Montserrat; letter-spacing:.24em; text-transform:uppercase; color:rgba(238,242,249,.88); z-index:6; }
  .ghm .gear { position:relative; width:${px(6.4)}; height:${px(6.4)}; } .ghm .gear img { position:absolute; inset:0; width:100%; height:100%; } .ghm .wl2 { height:${px(2.8)}; }
  .kip { padding:0; overflow:hidden; gap:0; } .kip .kph { width:100%; height:${px(P ? 18 : 14)}; background-size:cover; filter:saturate(1.08) brightness(1.05); }
  .kip svg { position:absolute; margin:${px(1.2)}; width:${px(P ? 7 : 5.5)} !important; height:${px(P ? 7 : 5.5)} !important; filter:drop-shadow(0 0 ${px(0.6)} rgba(0,0,0,.8)); } .kip b { padding:${px(1.6)} ${px(2)} ${px(2)}; }
  .ki { position:relative; }
  #s-start .hint { ${P ? `top:${px(146)}` : ''} }
  .gk .ki { align-items:center; text-align:center; } .gk .gsv { width:100% !important; height:${px(P ? 20 : 15)} !important; overflow:visible; }
  .gk .gsv .dr { stroke-dasharray:1; }
  .gk .ki b { font:900 ${px(P ? 3.6 : 2.8)} Montserrat; text-transform:uppercase; letter-spacing:.04em; } .gk .ki small { font:700 ${px(P ? 2.6 : 2)} Montserrat; color:var(--gold); }
  .gp { overflow:hidden; } .gvis { position:relative; width:100%; height:${px(P ? 20 : 15)}; display:flex; align-items:center; justify-content:center; background:radial-gradient(60% 70% at 50% 55%, rgba(127,208,255,.28), transparent 70%); border-radius:${px(1.4)}; overflow:hidden; }
  .gvis img { position:absolute; filter:drop-shadow(0 ${px(0.8)} ${px(1.6)} rgba(0,0,0,.6)); }
  .pr-rod { width:96%; left:2%; top:28%; transform-origin:12% 50%; } .pr-rodlogo { width:70%; left:15%; bottom:8%; opacity:0; }
  .pr-reel { height:92%; left:50%; top:4%; margin-left:${px(P ? -7.8 : -5.9)}; }
  .pr-noa { height:88%; left:50%; top:8%; margin-left:${px(P ? -3.6 : -2.7)}; transform-origin:50% 100%; }
  .pr-net { width:92%; left:4%; top:22%; transform-origin:85% 60%; }
  .glint { position:absolute; top:-20%; bottom:-20%; left:0; width:35%; background:linear-gradient(100deg, transparent, rgba(255,255,255,.55), transparent); mix-blend-mode:overlay; transform:skewX(-18deg); pointer-events:none; }
  /* hudební prvky */
  #spec { position:absolute; left:0; right:0; bottom:0; height:${px(P ? 7 : 6)}; display:flex; align-items:flex-end; gap:${px(0.35)}; padding:0 ${px(1)}; z-index:4; pointer-events:none; opacity:.0; mix-blend-mode:screen; }
  #spec i { flex:1; height:100%; transform-origin:50% 100%; transform:scaleY(.05); background:linear-gradient(0deg, rgba(227,30,36,.95), rgba(255,211,107,.85) 60%, rgba(238,242,249,.6)); border-radius:${px(0.3)} ${px(0.3)} 0 0; }
  #bokeh { position:absolute; inset:0; pointer-events:none; z-index:3; mix-blend-mode:screen; } #bokeh i { position:absolute; width:${px(1.6)}; height:${px(1.6)}; border-radius:50%; background:radial-gradient(circle, rgba(255,230,170,.9), rgba(255,211,107,0) 70%); scale:var(--z); opacity:.0; }
  #leak { position:absolute; inset:-20%; pointer-events:none; z-index:7; mix-blend-mode:screen; opacity:0; background:linear-gradient(115deg, transparent 30%, rgba(255,150,60,.35) 45%, rgba(255,230,180,.5) 50%, rgba(227,30,36,.25) 56%, transparent 70%); }
  #player { position:absolute; ${P ? `left:${px(6)}; right:${px(6)}; bottom:${px(8.5)}; height:${px(12)}` : `right:${px(3)}; bottom:${px(8)}; width:${px(44)}; height:${px(11)}`}; z-index:6; opacity:0; }
  #pcard { position:absolute; inset:0; border-radius:${px(3)}; background:rgba(11,30,66,.72); backdrop-filter:blur(${px(2)}); box-shadow:0 ${px(1.2)} ${px(4)} rgba(0,0,0,.45), inset 0 0 0 1px rgba(238,242,249,.14); }
  #vwrap { position:absolute; left:${px(1.2)}; top:${px(1)}; width:${px(P ? 11 : 9)}; height:${px(P ? 11 : 9)}; }
  #vinyl { position:absolute; inset:0; border-radius:50%; background:repeating-radial-gradient(circle at 50% 50%, #0d0d10 0 ${px(0.12)}, #1c1c22 ${px(0.12)} ${px(0.22)}); box-shadow:0 ${px(0.6)} ${px(1.6)} rgba(0,0,0,.6); }
  #vinyl img { position:absolute; left:28%; top:28%; width:44%; height:44%; border-radius:50%; } #vinyl .hole { position:absolute; left:48.5%; top:48.5%; width:3%; height:3%; border-radius:50%; background:#c9ced8; }
  #sheen { position:absolute; inset:0; border-radius:50%; background:conic-gradient(from 20deg, transparent 0 8%, rgba(255,255,255,.16) 12%, transparent 18% 52%, rgba(255,255,255,.12) 60%, transparent 66%); }
  #ptext { position:absolute; left:${px(P ? 14.5 : 12)}; right:${px(2)}; top:${px(1.4)}; bottom:${px(1.3)}; display:flex; flex-direction:column; justify-content:space-between; }
  .ptitle { font:900 ${px(P ? 3.2 : 2.2)}/1.1 Montserrat; letter-spacing:.04em; } .partist { font:600 ${px(P ? 2.4 : 1.6)} Montserrat; opacity:.75; }
  .prow { display:flex; align-items:center; gap:${px(1)}; font:600 ${px(P ? 2.1 : 1.4)} Montserrat; opacity:.9; font-variant-numeric:tabular-nums; }
  .pbar { position:relative; flex:1; height:${px(0.45)}; background:rgba(238,242,249,.22); border-radius:${px(0.5)}; overflow:hidden; } #pfill { position:absolute; inset:0; background:var(--red); transform-origin:left center; transform:scaleX(0); }
  #peq { display:flex; align-items:flex-end; gap:${px(0.35)}; height:${px(P ? 2.2 : 1.5)}; } #peq i { display:block; width:${px(0.5)}; height:100%; background:var(--ice); transform-origin:bottom center; }
  #stage::after { content:''; position:absolute; inset:0; pointer-events:none; z-index:2; background:radial-gradient(70% 60% at 50% 110%, rgba(227,30,36,calc(.28 * var(--pulse))), transparent 70%), radial-gradient(60% 50% at 0% 0%, rgba(42,91,214,calc(.35 * var(--pulse))), transparent 70%); }
  /* globální */
  #corner { position:absolute; ${P ? `left:${px(7)}; top:${px(6)}; width:${px(30)}` : `left:${px(7)}; top:${px(5)}; width:${px(18)}`}; opacity:0; z-index:5; } #corner img { width:100%; display:block; }
  #wipe { position:absolute; inset:0; display:flex; pointer-events:none; z-index:8; } #wipe i { flex:1; background:var(--red); transform:scaleY(0); } #wipe i:nth-child(even) { background:var(--blue); transform-origin:50% 0; } #wipe i:nth-child(odd) { transform-origin:50% 100%; }
  #flash { position:absolute; inset:0; background:#fff; opacity:0; pointer-events:none; z-index:9; mix-blend-mode:overlay; }
  #grain { position:absolute; inset:0; background:url(assets/grain.png) 0 0 / 256px 256px; opacity:.4; mix-blend-mode:overlay; pointer-events:none; z-index:10; }
  #badge { position:absolute; left:${px(2)}; bottom:${px(1.4)}; font:800 ${px(1.4)} Montserrat; letter-spacing:.14em; color:rgba(238,242,249,.5); z-index:11; }
</style></head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="${W}" data-height="${H}">
  <div id="stage"><i class="blob" id="blob0"></i><i class="blob" id="blob1"></i>
  ${scenes.join('\n  ')}
  </div>
  <div id="corner"><img src="assets/ta_logo.png" alt=""></div>
  <div id="spec">${Array.from({ length: 24 }, (_, i) => `<i id="sb${i}"></i>`).join('')}</div>
  <div id="bokeh">${Array.from({ length: 22 }, (_, i) => `<i id="bk${i}" style="left:${(rnd(i * 31 + 7) * 100).toFixed(1)}%; top:${(rnd(i * 17 + 3) * 100).toFixed(1)}%; --z:${(0.4 + rnd(i * 5 + 1) * 1.2).toFixed(2)}"></i>`).join('')}</div>
  <div id="leak"></div>
  <div id="player"><div id="pcard"></div>
    <div id="vwrap"><div id="vinyl"><img src="assets/ta_label.png" alt=""><div class="hole"></div></div><div id="sheen"></div></div>
    <div id="ptext"><div class="ptitle">TROUT AREA CZ</div><div class="partist">Pojď hrát · sezóna 2027</div>
      <div class="prow"><div id="peq">${Array.from({ length: 5 }, () => '<i></i>').join('')}</div><span id="ptime">0:00</span><div class="pbar"><div id="pfill"></div></div><span>${Math.floor(DUR / 60)}:${String(Math.round(DUR % 60)).padStart(2, '0')}</span></div></div></div>
  <audio id="music" class="clip" data-start="0" data-duration="${DUR}" data-track-index="0" src="assets/mix_long.wav" data-volume="1"></audio>
  <div id="wipe">${Array.from({ length: NW }, (_, i) => `<i id="wp${i}"></i>`).join('')}</div>
  <div id="flash"></div>
  <div id="grain"></div>
  ${process.env.FINAL ? '' : `<div id="badge">DRAFT · ${VER}</div>`}
</div>
<script>
  window.__timelines = window.__timelines || {};
  const tl = gsap.timeline({ paused: true });
  ${out.join('\n  ')}
  tl.set({}, {}, ${DUR});
  window.__timelines["main"] = tl;
</script>
</body></html>`;
  const dir = path.join(ROOT, 'proto_long', P ? '9x16' : '16x9');
  fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(path.join(dir, 'assets'))) fs.symlinkSync('../../proto/assets', path.join(dir, 'assets'));
  fs.writeFileSync(path.join(dir, 'index.html'), doc);
  console.log(file, 'DUR', DUR, 'tweens', out.length);
}
build(1080, 1920, '9x16');
build(1920, 1080, '16x9');
