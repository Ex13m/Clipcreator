// Trout Area CZ – náborové motivační video (podle článku pro časopis + web jako otevřený automatizovaný systém).
// Název systému se v obraze NEUVÁDÍ. Fotky: album MČR 2026 (Drive „Уменьшенные с логотипами — 2048 px“, oříznutý spodní pruh partnerů).
// Hudba: výřez MČR tracku (03_MUSIC/track.beats.json) – placeholder, než bude vlastní Suno track. Scény v taktech.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROTO = path.join(ROOT, 'proto');
const FONTS = fs.readFileSync(path.join(PROTO, 'assets/fonts.css'), 'utf8');
const VER = process.env.VER || 'v1';
const G = JSON.parse(fs.readFileSync(path.join(ROOT, '03_MUSIC/track.beats.json'), 'utf8'));
const BEAT = G.beats[1] - G.beats[0];
const BAR = (n) => (n < G.downbeats.length ? G.downbeats[n] : G.downbeats.at(-1) + (n - G.downbeats.length + 1) * BEAT * 4);
const DUR = G.duration;
const len = (a, b) => +(b - a).toFixed(3);
const rnd = (seed) => { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); };
const nb = (s) => s.replace(/ ([vkszouaiVKSZOUAI]|na|do|po|za|ke|ve|se|ze|od) /g, ' $1\u00a0');   // čeština: předložky nenechat na konci řádku

const BARS = { hook: [0, 4], what: [4, 7], duel: [7, 17], all: [17, 21], cr: [21, 24], num: [24, 28], sys: [28, 32], start: [32, 35], crs: [35, 37], cta: [37, 40] };
// ohniska fotek (x% y%) – ať ořez nesebere hlavy
const FOC = { 86406: '50% 30%', 86407: '40% 30%', 86408: '55% 35%', 86409: '50% 55%', 86410: '50% 20%', 86412: '50% 30%', 86422: '60% 25%', 86423: '60% 15%', 86425: '60% 25%',
  86429: '50% 25%', 86430: '50% 20%', 86431: '50% 30%', 86432: '50% 40%', 86434: '50% 45%', 86435: '50% 55%', 86436: '50% 25%', 86437: '50% 50%', 86438: '50% 60%', 86439: '50% 45%',
  86442: '50% 55%', 86443: '50% 55%', 86444: '50% 55%', 86450: '50% 40%', 86456: '50% 35%', 86459: '50% 40%', 86440: '50% 40%', 86433: '45% 45%', 86426: '50% 25%', 86420: '50% 30%' };
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
  const photos = (id, list, a, b, { op = 1, hard = false } = {}) => {
    const n = list.length, cuts = Array.from({ length: n + 1 }, (_, k) => (k === 0 ? a : k === n ? b : G.beats.find((t) => t >= a + ((b - a) * k) / n - 0.05) ?? a + ((b - a) * k) / n));
    list.forEach((im, k) => { const ia = cuts[k], ib = cuts[k + 1], zin = k % 2 === 0, el = `#${id}_${k}`;
      SET(el, { opacity: 0 }, 0);
      if (hard) { SET(el, { opacity: op }, ia); if (k < n - 1) SET(el, { opacity: 0 }, ib); }
      else { T0(el, { opacity: 0 }, { opacity: op, duration: k ? 0.25 : 0.45, ease: 'power2.out' }, k ? ia - 0.1 : ia); if (k < n - 1) T(el, { opacity: op }, { opacity: 0, duration: 0.3 }, ib + 0.1); }
      T0(el, { scale: zin ? 1.12 : 1.02, xPercent: zin ? -1.5 : 1.5 }, { scale: zin ? 1.02 : 1.12, xPercent: zin ? 1.5 : -1.5, duration: len(ia - 0.1, ib + 0.4), ease: 'none' }, ia - 0.1); });
    return list.map((im, k) => `<div class="ph" id="${id}_${k}" style="${ph(im)}"></div>`).join('') + '<div class="pho"></div>';
  };
  const kick = (t) => `<div class="kick"><i></i>${t}</div>`;

  // ===================== 1) HOOK: rychlé střihy akce + „Rybaření, jak ho neznáš.“ =====================
  {
    const id = 's-hook', a = 0, b = BAR(BARS.hook[1]), t1 = BAR(2);
    const fast = [86444, 86409, 86438, 86425, 86443, 86410, 86437, 86432];
    scene(id, a, b, `${photos('hk', fast, BAR(0) + 0.0001, t1, { hard: true })}${photos('hk2', [86442], t1, b, { op: 0.7 })}
      <div class="mega" id="hk-t"><div class="ln"><span>Rybaření,</span></div><div class="ln red"><span>jak ho neznáš.</span></div></div>`);
    rise('#hk-t .ln:nth-child(1) span', t1); rise('#hk-t .ln:nth-child(2) span', t1 + BEAT * 2);
    T('#hk-t', { scale: 1 }, { scale: 1.06, duration: len(t1, b), ease: 'none' }, t1);
    outT('#hk-t', b);
  }

  // ===================== 2) CO TO JE: moderní přívlač =====================
  {
    const id = 's-what', a = BAR(BARS.what[0]), b = BAR(BARS.what[1]);
    scene(id, a, b, `${photos('wh', [86432, 86408, 86431], a, b, { op: 0.55 })}
      <div class="blk lft" id="wh-h">${kick('Trout Area')}<h1><span>Moderní</span><span class="red">přívlač</span></h1><p>${nb('Sportovní disciplína z Japonska. Lov lososovitých ryb na menších, dobře zarybněných stojatých vodách.')}</p></div>`);
    rise('#wh-h .kick', a + 0.05); rise('#wh-h h1 span', a + BEAT, 0.6, BEAT); pop('#wh-h p', a + BEAT * 3);
    outT('#wh-h', b);
  }

  // ===================== 2b) JAK PROBÍHÁ SOUBOJ: rybník, dvojice, duel, rotace (liché +, sudé −) =====================
  {
    const id = 's-duel', a = BAR(BARS.duel[0]), b = BAR(BARS.duel[1]), BB = (k) => BAR(BARS.duel[0] + k);
    // rybník = zaoblený obdélník, 16 stanovišť po obvodu (1–8 dolní břeh zleva, 9–16 horní zprava) – jako Liběchov
    const NS = 16, PW = P ? 84 * u : 96 * u, PH = P ? 46 * u : 40 * u;
    const pos = (n) => { const k = ((n - 1) % NS + NS) % NS, half = NS / 2;
      return k < half ? [PW * (0.09 + (0.82 * k) / (half - 1)), PH * 0.97] : [PW * (0.91 - (0.82 * (k - half)) / (half - 1)), PH * 0.03]; };
    const COLS = ['#e31e24', '#ffd36b', '#7fd0ff', '#9be27a', '#ff8fd0', '#ffb05c', '#b9a6ff', '#ffffff', '#5fe0c8', '#ff6a5a', '#c6e04a', '#8ea2d8', '#f5c2c7', '#e0b37a', '#6fb7ff', '#d0d0d0'];
    const st0 = Array.from({ length: NS }, (_, i) => i + 1);           // závodník i stojí na stanovišti i+1 (kolo 1)
    const step = 2;                                                      // liché místo +2, sudé −2 → nová dvojice
    const at = (i, r) => (i % 2 === 0 ? st0[i] + step * r : st0[i] - step * r);
    const ROT = [0, 1, 2];
    const res1 = [3, 0, 2, 2, 0, 3, 3, 0, 1, 1, 3, 0, 0, 3, 3, 0];      // body kola 1 (dvojice 1–2, 3–4, …)
    scene(id, a, b, `<div class="dbg"></div>
      <div class="blk dhd" id="dhd">${kick('Jak probíhá souboj')}<h2><span>Jeden na jednoho.</span></h2></div>
      <div class="pond" id="pond" style="width:${PW.toFixed(0)}px; height:${PH.toFixed(0)}px">
        <div class="water" id="water"></div>
        ${st0.map((n) => { const [x, y] = pos(n); return `<i class="sn${n > NS / 2 ? ' up' : ''}" id="sn${n}" style="left:${x.toFixed(1)}px; top:${y.toFixed(1)}px"><em>${n}</em></i>`; }).join('')}
        ${Array.from({ length: NS / 2 }, (_, p) => { const [x1, y1] = pos(p * 2 + 1), [x2] = pos(p * 2 + 2); return `<i class="pr" id="pr${p}" style="left:${Math.min(x1, x2).toFixed(1)}px; top:${y1.toFixed(1)}px; width:${Math.abs(x2 - x1).toFixed(1)}px"></i>`; }).join('')}
        ${st0.map((n, i) => { const [x, y] = pos(n); return `<i class="ag" id="ag${i}" style="left:${x.toFixed(1)}px; top:${y.toFixed(1)}px; --c:${COLS[i]}"><b>${String.fromCharCode(65 + i)}</b><s class="pt" id="pt${i}">+${res1[i]}</s></i>`; }).join('')}
      </div>
      <div class="duel" id="duel">
        <div class="dc" id="dcA" style="--c:${COLS[0]}"><b>Závodník A</b><em id="fa">0</em><small>počet ryb</small></div>
        <div class="vs"><div class="clock"><svg viewBox="0 0 100 100"><circle class="cb" cx="50" cy="50" r="44"/><circle class="cf" id="clk" cx="50" cy="50" r="44" pathLength="1"/></svg><span id="clkt">20:00</span></div><i>VS</i></div>
        <div class="dc" id="dcB" style="--c:${COLS[1]}"><b>Závodník B</b><em id="fb">0</em><small>počet ryb</small></div>
        <div class="win" id="win"><span>výhra <b>3 b.</b></span><span>remíza s úlovkem <b>2 b.</b></span><span>remíza 0:0 <b>1 b.</b></span><span>prohra <b>0 b.</b></span></div>
      </div>
      <div class="dcap" id="dcap1">${nb('Souboj trvá 20 minut. Kdo uloví víc ryb, vyhrává.')}</div>
      <div class="dcap" id="dcap2"><b>Rotace</b> ${nb('· lichá místa se posouvají jedním směrem, sudá opačným → každé kolo jiné místo i jiný soupeř')}</div>
      <div class="rnd" id="rnd"><small>kolo</small><b id="rndn">1</b><small>/ 12</small></div>
      <div class="dcap fin" id="dcap3">${nb('Stejný princip jako na mistrovství světa: místa i soupeři se střídají, aby rozhodoval rybář, ne místo.')}</div>`);
    // 0: nadpis + rybník
    rise('#dhd .kick', a + 0.05); rise('#dhd h2 span', a + BEAT);
    T0('#pond', { opacity: 0, rotationX: 55, scale: 0.8, transformPerspective: 1600 }, { opacity: 1, rotationX: P ? 0 : 18, scale: 1, duration: 0.9, ease: 'expo.out' }, a + 0.1);
    T0('.sn', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(3)', stagger: 0.035 }, a + 0.4);
    // 1: závodníci padnou na místa, dvojice se spojí
    T0('.ag', { opacity: 0, y: -8 * u, scale: 0.4 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(2)', stagger: 0.04 }, BB(1));
    T0('.pr', { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.35, ease: 'expo.out', stagger: 0.05 }, BB(1) + BEAT * 2);
    // 2–4: přiblížení na dvojici A–B + karta duelu
    const [zx, zy] = pos(1.5 > 0 ? 1 : 1), zs = P ? 1.0 : 1.0; void zs;
    T('#ag2, #ag3, #ag4, #ag5, #ag6, #ag7, #ag8, #ag9, #ag10, #ag11, #ag12, #ag13, #ag14, #ag15', { opacity: 1 }, { opacity: 0.25, duration: 0.3 }, BB(2));
    T('#ag0, #ag1', { scale: 1 }, { scale: 1.5, duration: 0.4, ease: 'back.out(2)' }, BB(2));
    T0('#duel', { opacity: 0, y: 6 * u, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'expo.out' }, BB(2));
    pop('#dcap1', BB(2) + BEAT * 2);
    const ta = BB(2) + BEAT * 2, tb = BB(4) + BEAT;
    T0('#clk', { strokeDashoffset: 0 }, { strokeDashoffset: 1, duration: len(ta, tb), ease: 'none' }, ta);
    out.push(`{ const o={v:1200}, el=document.getElementById("clkt"); tl.fromTo(o,{v:1200},{v:0,duration:${len(ta, tb)},ease:"none",immediateRender:false,onUpdate(){const s=Math.round(o.v);el.textContent=String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");}}, ${ta.toFixed(3)}); }`);
    const fish = [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [3, 2]];
    fish.slice(1).forEach(([fa, fb], k) => { const t = ta + ((tb - ta) * (k + 0.6)) / fish.length, w = fa !== fish[k][0] ? 'a' : 'b';
      SET(`#f${w}`, { textContent: w === 'a' ? fa : fb }, t);
      T(`#dc${w.toUpperCase()}`, { scale: 1.1 }, { scale: 1, duration: 0.35, ease: 'power2.out' }, t);
      T(`#ag${w === 'a' ? 0 : 1}`, { scale: 1.9 }, { scale: 1.5, duration: 0.3, ease: 'power2.out' }, t); });
    T0('#win', { opacity: 0, y: 2 * u }, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(2)' }, tb);
    T0('#win span', { opacity: 0.35 }, { opacity: 1, duration: 0.2, stagger: BEAT / 2 }, tb + 0.1);
    // 5: konec kola – všichni dostanou body
    const t5 = BB(5);
    T('#duel, #dcap1', { opacity: 1 }, { opacity: 0, duration: 0.3 }, t5 - 0.3);
    T('.ag', { opacity: 0.25, scale: 1.5 }, { opacity: 1, scale: 1, duration: 0.35 }, t5);
    T0('.pt', { opacity: 0, y: 0 }, { opacity: 1, y: -3 * u, duration: 0.35, ease: 'back.out(2)', stagger: 0.03 }, t5 + 0.2);
    T('.pt', { opacity: 1 }, { opacity: 0, duration: 0.25 }, BB(6) - 0.1);
    pop('#rnd', t5);
    // 6–8: rotace ×2
    ROT.slice(1).forEach((r) => { const tr = BB(4 + r * 2), tm = tr + 0.15;
      if (r === 1) { pop('#dcap2', tr); }
      T('.pr', { opacity: 1 }, { opacity: 0.15, duration: 0.2 }, tr);
      st0.forEach((_, i) => { const s0 = at(i, r - 1), dir = i % 2 === 0 ? 1 : -1, d1 = 0.9 / step;
        for (let k = 0; k < step; k++) { const [x0, y0] = pos(s0 + dir * k), [x1, y1] = pos(s0 + dir * (k + 1));
          T(`#ag${i}`, { left: x0, top: y0 }, { left: x1, top: y1, duration: d1, ease: k === 0 ? 'power2.in' : 'power2.out' }, tm + (i % 2) * 0.06 + k * d1); } });
      T('.pr', { opacity: 0.15 }, { opacity: 1, duration: 0.3 }, tm + 1.0);
      SET('#rndn', { textContent: r + 1 }, tm + 0.5);
      T('#rnd', { scale: 1.25 }, { scale: 1, duration: 0.3, ease: 'power2.out' }, tm + 0.5); });
    // 9: počítadlo kol doběhne + závěrečná věta
    const t9 = BB(9);
    out.push(`{ const o={v:3}, el=document.getElementById("rndn"); tl.fromTo(o,{v:3},{v:12,duration:${(BEAT * 2).toFixed(3)},ease:"power1.in",immediateRender:false,onUpdate(){el.textContent=Math.round(o.v);}}, ${(t9 - BEAT * 2).toFixed(3)}); }`);
    T('#dcap2', { opacity: 1 }, { opacity: 0, duration: 0.25 }, t9 - 0.2);
    pop('#dcap3', t9);
    T('#ag0, #ag1', { scale: 1 }, { scale: 1.4, duration: 0.2, yoyo: true, repeat: 1 }, t9 + BEAT);
    outT('#pond, #dhd, #rnd, #dcap3', b);
    void zx; void zy;
  }

  // ===================== 3) PRO KAŽDÉHO =====================
  {
    const id = 's-all', a = BAR(BARS.all[0]), b = BAR(BARS.all[1]), tm = BAR(BARS.all[0] + 2);
    const W4 = [86429, 86412, 86425, 86423], WORDS = ['Muži', 'Ženy', 'Junioři', 'Začátečníci'];
    scene(id, a, b, `${photos('al', [86422, 86436], tm, b, { op: 0.55 })}
      <div class="tiles" id="tiles">${W4.map((im, i) => `<div class="tl" id="tl${i}"><div class="tph" style="${ph(im)}"></div></div>`).join('')}</div>
      <div class="words" id="words">${WORDS.map((w, i) => `<b id="wd${i}"><span>${w}</span></b>`).join('')}</div>
      <div class="tagl" id="tagl">${kick('Stejné podmínky pro všechny')}<h2><span>Nerozhoduje síla.</span></h2><h2 class="red"><span>${nb('Rozhoduje cit, taktika a přesnost.')}</span></h2></div>`);
    W4.forEach((_, i) => { const t = a + BEAT * i * 2;
      T0(`#tl${i}`, { opacity: 0, yPercent: i % 2 ? -30 : 30, rotation: (i % 2 ? 4 : -4) }, { opacity: 1, yPercent: 0, rotation: 0, duration: 0.5, ease: 'expo.out' }, t);
      T0(`#tl${i} .tph`, { scale: 1.25 }, { scale: 1, duration: 2.5, ease: 'power2.out' }, t); rise(`#wd${i} span`, t + 0.1); });
    T('#words', { opacity: 1 }, { opacity: 0, duration: 0.35 }, tm - 0.35);
    T('#tiles', { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.9, duration: 0.35, ease: 'power2.in' }, tm - 0.35);
    rise('#tagl .kick', tm); rise('#tagl h2:nth-of-type(1) span', tm + BEAT); rise('#tagl h2:nth-of-type(2) span', tm + BEAT * 3);
    outT('#tagl', b);
  }

  // ===================== 4) CHYŤ A PUSŤ =====================
  {
    const id = 's-cr', a = BAR(BARS.cr[0]), b = BAR(BARS.cr[1]);
    const CH = [['Umělé nástrahy', 'nejčastěji plandavky a woblery'], ['Háčky bez protihrotu', 'šetrné k rybě'], ['Co nejrychleji zpět do vody', 'šetrně podebrat a pustit']];
    scene(id, a, b, `${photos('cr', [86437, 86438, 86434], a, b, { op: 0.75 })}
      <div class="blk crb" id="crb"><h1><span>Chyť</span><span class="red">a pusť.</span></h1>
        <div class="chips">${CH.map(([t, s], i) => `<div class="chip" id="ch${i}"><i>${i + 1}</i><div><b>${t}</b><small>${s}</small></div></div>`).join('')}</div></div>`);
    rise('#crb h1 span', a + 0.05, 0.6, BEAT);
    CH.forEach((_, i) => T0(`#ch${i}`, { opacity: 0, x: -6 * u }, { opacity: 1, x: 0, duration: 0.45, ease: 'expo.out' }, a + BEAT * (4 + i * 2)));
    outT('#crb', b);
  }

  // ===================== 5) MČR 2026 V ČÍSLECH =====================
  {
    const id = 's-num', a = BAR(BARS.num[0]), b = BAR(BARS.num[1]);
    const N = [['n0', 40, 'závodníků'], ['n1', 24, 'soutěžních kol'], ['n2', 2108, 'ulovených ryb'], ['n3', 17, 'let měl nejmladší závodník']];
    scene(id, a, b, `${photos('nm', [86459, 86450, 86456], a, b, { op: 0.5 })}
      <div class="blk nmh" id="nmh">${kick('Mistrovství ČR 2026 · Líheň\u00a0Liběchov')}<h2><span>Vrchol sezóny</span></h2></div>
      <div class="nums" id="nums">${N.map(([k, v, l]) => `<div class="nm" id="${k}w"><b id="${k}">0</b><small>${l}</small></div>`).join('')}</div>`);
    rise('#nmh .kick', a + 0.05); rise('#nmh h2 span', a + BEAT);
    N.forEach(([k, v], i) => { const t = a + BEAT * (3 + i * 2.5); pop(`#${k}w`, t); CNT(k, v, t, i === 2 ? 1.6 : 0.8); });
    T('#n3w', { scale: 1 }, { scale: 1.1, duration: 0.22, yoyo: true, repeat: 1 }, b - BEAT * 3);
    outT('#nmh, #nums', b);
  }

  // ===================== 6) OTEVŘENÝ SYSTÉM (jen krátce, pozadí: tmavé siluety pstruhů) =====================
  {
    const id = 's-sys', a = BAR(BARS.sys[0]), b = BAR(BARS.sys[1]);
    // pstruh – silueta z boku (hlava vpravo); ocas je zvlášť kvůli vlnění
    const BODY = 'M8 30 C20 18 44 12 70 13 C86 14 98 20 104 27 C106 30 104 33 100 35 C92 41 76 45 60 45 C40 45 22 40 8 30 Z M44 13 C48 6 56 4 62 6 C60 9 58 12 56 13 Z M52 45 C56 51 62 53 66 52 C64 49 62 46 60 45 Z M82 41 C84 46 88 48 92 47 C90 44 88 42 86 41 Z';
    const TAIL = 'M10 30 C4 24 -4 18 -12 14 C-8 22 -8 38 -12 46 C-4 42 4 36 10 30 Z';
    const FISH = Array.from({ length: 11 }, (_, i) => ({ y: 8 + rnd(i * 3 + 1) * 84, s: 0.55 + rnd(i * 7 + 2) * 1.0, sp: 6 + rnd(i * 5 + 3) * 6, ph: rnd(i * 11 + 4), d: rnd(i * 13 + 5) }));
    scene(id, a, b, `<div class="sysbg"></div><div class="fishes">${FISH.map((fh, i) => `<div class="fw" id="fw${i}" style="top:${fh.y.toFixed(1)}%; --s:${fh.s.toFixed(2)}; opacity:${(0.35 + fh.d * 0.5).toFixed(2)}; filter:blur(${((1 - fh.d) * 3).toFixed(1)}px)"><div class="ff" id="ff${i}"><svg viewBox="-14 0 120 56"><g class="tail" id="ft${i}"><path d="${TAIL}"/></g><path d="${BODY}"/></svg></div></div>`).join('')}</div>
      <div class="blk sysh" id="sysh">${kick('Otevřený systém')}<h1><span>Přihlásit se</span><span class="red">může každý.</span></h1>
        <div class="sysl" id="sysl">${['Registrace a platba online', 'Losování automaticky', 'Výsledky online'].map((t, i) => `<span id="sl${i}"><i>✓</i>${t}</span>`).join('')}</div></div>
      <div class="dev" id="dev"><img class="lap" id="lap" src="assets/screens/a036.png" alt=""><img class="phn" id="phn" src="assets/screens/a050.png" alt=""></div>`);
    // ryby: plavou tam a zpět (otočka = scaleX), ocas kmitá, tělo se lehce vlní
    FISH.forEach((fh, i) => { const dur = len(a, b), half = fh.sp, dir = i % 2 ? 1 : -1, x0 = dir > 0 ? -25 : 115, x1 = dir > 0 ? 115 : -25;
      const legs = Math.ceil(dur / half) + 1, st = a - fh.ph * half;
      for (let k = 0; k < legs; k++) { const t = st + k * half, fwd = k % 2 === 0;
        T(`#fw${i}`, { left: `${fwd ? x0 : x1}%` }, { left: `${fwd ? x1 : x0}%`, duration: half, ease: 'sine.inOut' }, t);
        SET(`#ff${i}`, { scaleX: (fwd ? dir : -dir) }, t); }
      T(`#fw${i}`, { y: 0 }, { y: (rnd(i) - 0.5) * 8 * u, duration: half * 0.7, ease: 'sine.inOut', yoyo: true, repeat: Math.ceil(dur / (half * 0.7)) }, a);
      T(`#ft${i}`, { rotation: -16 }, { rotation: 16, duration: 0.32 + rnd(i) * 0.12, ease: 'sine.inOut', yoyo: true, repeat: Math.ceil(dur / 0.32), transformOrigin: '10px 30px' }, a);
      T(`#ff${i} svg`, { skewY: -2 }, { skewY: 2, duration: 0.64, ease: 'sine.inOut', yoyo: true, repeat: Math.ceil(dur / 0.64) }, a); });
    rise('#sysh .kick', a + 0.05); rise('#sysh h1 span', a + BEAT, 0.6, BEAT);
    T0('#sysl span', { opacity: 0, x: -3 * u }, { opacity: 1, x: 0, duration: 0.4, ease: 'expo.out', stagger: BEAT }, a + BEAT * 5);
    T0('#lap', { opacity: 0, x: 20 * u, rotationY: -25, transformPerspective: 1600 }, { opacity: 1, x: 0, rotationY: 0, duration: 0.9, ease: 'expo.out' }, a + BEAT * 2);
    T0('#phn', { opacity: 0, y: 25 * u, rotation: 8 }, { opacity: 1, y: 0, rotation: 0, duration: 0.8, ease: 'expo.out' }, a + BEAT * 4);
    T('#lap', { y: 0 }, { y: -1.5 * u, duration: len(a + 1, b), ease: 'sine.inOut' }, a + 1);
    outT('#sysh, #dev', b);
  }

  // ===================== 7) JAK ZAČÍT =====================
  {
    const id = 's-start', a = BAR(BARS.start[0]), b = BAR(BARS.start[1]);
    const KIT = [['Lehký přívlačový prut', 'rod'], ['Naviják', 'reel'], ['Pár malých nástrah', 'lure'], ['Šetrný podběrák', 'net']];
    const ICO = {
      rod: '<path d="M8 92 L88 8" stroke-width="5"/><path d="M8 92 L24 76" stroke-width="10"/><circle cx="56" cy="40" r="3"/><circle cx="72" cy="24" r="2.5"/>',
      reel: '<circle cx="50" cy="52" r="26" stroke-width="6"/><circle cx="50" cy="52" r="9" stroke-width="5"/><path d="M50 26 V10 M40 10 H60" stroke-width="6"/><path d="M76 52 H90" stroke-width="6"/>',
      lure: '<path d="M30 20 C70 20 80 60 50 84 C24 64 22 36 30 20 Z" stroke-width="6"/><path d="M50 84 C46 92 54 96 58 90" stroke-width="5"/><circle cx="32" cy="20" r="5" stroke-width="4"/>',
      net: '<ellipse cx="44" cy="36" rx="28" ry="22" stroke-width="6"/><path d="M24 46 C30 70 56 72 64 48 M34 52 L54 30 M44 58 L62 38" stroke-width="3"/><path d="M66 50 L92 90" stroke-width="7"/>',
    };
    scene(id, a, b, `${photos('sa', [86439, 86433, 86426], a, b, { op: 0.5 })}
      <div class="blk sth" id="sth">${kick('Jak začít?')}<h2><span>${nb('Na začátek stačí základní výbava.')}</span></h2></div>
      <div class="kit" id="kit">${KIT.map(([t, k], i) => `<div class="ki" id="ki${i}"><svg viewBox="0 0 100 100">${ICO[k].replace(/<(path|circle|ellipse) /g, '<$1 pathLength="1" ')}</svg><b>${t}</b></div>`).join('')}</div>
      <div class="hint" id="hint">${nb('Přijď na závod. Zkušení závodníci rádi poradí.')}</div>`);
    rise('#sth .kick', a + 0.05); rise('#sth h2 span', a + BEAT);
    KIT.forEach((_, i) => { const t = a + BEAT * (3 + i * 1.5); pop(`#ki${i}`, t); T0(`#ki${i} svg *`, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.out' }, t); });
    pop('#hint', BAR(BARS.start[0] + 2) - BEAT);
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
    scene(id, a, b, `${photos('ct', [86450, 86436], a, b, { op: 0.42 })}
      <div class="cta" id="cta"><img class="tal" id="tal" src="assets/ta_logo.png" alt="Trout Area Czech Republic">
        <h1 id="cth"><span>Přijď si to</span><span class="red">vyzkoušet.</span></h1>
        <div class="url" id="url"><small>Pravidla · termíny · výsledky · registrace</small><b>troutareacz.cz</b><i class="cur" id="cur"></i></div></div>`);
    T0('#tal', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }, a + 0.05);
    rise('#cth span', a + BEAT * 2, 0.6, BEAT);
    T0('#url', { opacity: 0, y: 3 * u, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(2)' }, a + BEAT * 5);
    T0('#cur', { opacity: 0, x: 10 * u, y: 8 * u }, { opacity: 1, x: 0, y: 0, duration: 0.6, ease: 'power3.out' }, a + BEAT * 6);
    T('#url', { scale: 1 }, { scale: 0.95, duration: 0.12, yoyo: true, repeat: 1 }, a + BEAT * 7.5);
    T('#url', { boxShadow: '0 0 0 0px rgba(227,30,36,.0)' }, { boxShadow: `0 0 0 ${px(1.4)} rgba(227,30,36,.9)`, duration: 0.3, yoyo: true, repeat: 3 }, a + BEAT * 7.5);
    T('#cta', { opacity: 1 }, { opacity: 0, duration: 0.8 }, b - 0.8);
  }

  // ===================== globální rytmus =====================
  const NW = 14;
  starts.filter((t) => t > 1).forEach((t0) => { const t = t0 - 0.16;
    for (let i = 0; i < NW; i++) { const dl = Math.abs(i - (NW - 1) / 2) * 0.012;
      out.push(`tl.fromTo("#wp${i}", {scaleY:0}, {scaleY:${(0.6 + rnd(i + t0) * 0.4).toFixed(2)}, duration:0.15, ease:"power3.out", immediateRender:false}, ${(t + dl).toFixed(3)});`);
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
<title>Trout Area CZ – nábor (${P ? '9:16' : '16:9'})</title>
<script src="assets/gsap.min.js"></script>
<style>
  ${FONTS}
  :root { --blue:#304285; --red:#e31e24; --navy:#0b1e42; --ice:#eef2f9; --deep:#050d22; --gold:#ffd36b; --lb:#8ea2d8; }
  body { margin:0; background:var(--deep); color:var(--ice); }
  * { font-family:Montserrat, sans-serif !important; box-sizing:border-box; }
  #root { position:relative; width:${W}px; height:${H}px; overflow:hidden; background:var(--deep); }
  .clip { position:absolute; inset:0; }
  #stage { position:absolute; inset:0; overflow:hidden; background:radial-gradient(90% 60% at 50% 42%, #1d3a86 0%, #0b1e42 62%, #050d22 100%); }
  .blob { position:absolute; width:${px(P ? 110 : 80)}; height:${px(P ? 110 : 80)}; border-radius:50%; filter:blur(${px(9)}); }
  #blob0 { left:-15%; top:-10%; background:radial-gradient(circle, rgba(42,91,214,.5) 0%, transparent 65%); } #blob1 { right:-20%; bottom:-15%; background:radial-gradient(circle, rgba(227,30,36,.3) 0%, transparent 65%); }
  .ph { position:absolute; inset:-4%; background-size:cover; opacity:0; filter:saturate(1.08) brightness(1.06) contrast(1.06); }
  .pho { position:absolute; inset:0; background:linear-gradient(${P ? '180deg' : '90deg'}, rgba(5,13,34,.78) 0%, rgba(5,13,34,.35) 45%, rgba(5,13,34,.1) 70%, rgba(5,13,34,.35) 100%); }
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
  .words { position:absolute; ${P ? `left:${px(6)}; right:${px(6)}; bottom:${px(10)}` : `left:${px(6)}; right:${px(6)}; bottom:${px(3)}`}; display:flex; flex-wrap:wrap; gap:0 ${px(3)}; font:900 ${px(P ? 9 : 7)}/1 Montserrat; text-transform:uppercase; text-shadow:0 ${px(0.5)} ${px(2)} rgba(0,0,0,.6); }
  .words b { display:block; overflow:hidden; padding-top:.1em; } .words b span { display:block; } .words b:nth-child(even) { color:var(--red); }
  .tl b { position:absolute; left:${px(2)}; bottom:${px(1.6)}; z-index:1; font:900 ${px(P ? 7 : 5)} Montserrat; text-transform:uppercase; }
  .tl:nth-child(2) b, .tl:nth-child(4) b { color:var(--red); }
  .tagl { position:absolute; ${P ? `left:${px(7)}; right:${px(7)}; top:${px(64)}` : `left:${px(7)}; bottom:${px(14)}; width:${px(110)}`}; }
  /* chyť a pusť */
  .crb { ${P ? `top:${px(54)}` : `top:auto; bottom:${px(12)}`}; }
  .chips { margin-top:${px(3)}; display:flex; flex-direction:${P ? 'column' : 'row'}; gap:${px(1.4)}; }
  .chip { display:flex; align-items:center; gap:${px(1.4)}; background:rgba(238,242,249,.95); color:var(--navy); border-radius:${px(1.6)}; padding:${px(1.3)} ${px(2)}; opacity:0; }
  .chip i { width:${px(4.4)}; height:${px(4.4)}; flex-shrink:0; border-radius:50%; background:var(--red); color:#fff; display:flex; align-items:center; justify-content:center; font:900 ${px(2.2)} Montserrat; font-style:normal; }
  .chip b { display:block; font:800 ${px(P ? 3 : 2.2)} Montserrat; white-space:nowrap; } .chip small { font:600 ${px(P ? 2.3 : 1.7)} Montserrat; color:var(--blue); }
  /* čísla */
  .nmh { top:${px(P ? 20 : 14)}; }
  .nums { position:absolute; ${P ? `left:${px(7)}; right:${px(7)}; top:${px(52)}` : `left:${px(7)}; right:${px(7)}; bottom:${px(12)}`}; display:grid; grid-template-columns:${P ? '1fr 1fr' : 'repeat(4, 1fr)'}; gap:${px(2)}; }
  .nm { background:rgba(5,13,34,.72); border-top:${px(0.7)} solid var(--red); border-radius:${px(1.4)}; padding:${px(2)} ${px(2.2)}; opacity:0; backdrop-filter:blur(${px(1)}); }
  .nm b { display:block; font:900 ${px(P ? 13 : 10)}/1 Montserrat; font-variant-numeric:tabular-nums; } .nm small { display:block; margin-top:${px(0.8)}; font:700 ${px(P ? 2.6 : 2)} Montserrat; text-transform:uppercase; letter-spacing:.08em; color:var(--gold); }
  /* souboj */
  .dbg { position:absolute; inset:0; background:radial-gradient(80% 70% at 50% 60%, #1b3c8c 0%, #0b1e42 60%, #050d22 100%); }
  .dhd { top:${px(P ? 16 : 13)}; }
  #s-duel .duel { ${P ? `top:${px(112)}` : `top:${px(13)}`}; } #s-duel .dcap { ${P ? `top:${px(146)}` : ''} }
  .pond { position:absolute; left:50%; ${P ? `top:${px(60)}` : `top:${px(44)}`}; transform:translateX(-50%); transform-style:preserve-3d; opacity:0; }
  .water { position:absolute; inset:${px(2.2)} ${px(1)}; border-radius:${px(4)}; background:linear-gradient(180deg, #16407a, #0d2c5c); box-shadow:inset 0 0 ${px(4)} rgba(0,0,0,.6), 0 0 0 ${px(0.5)} rgba(142,162,216,.45); }
  .water::after { content:''; position:absolute; inset:0; border-radius:inherit; opacity:.25; background:repeating-linear-gradient(170deg, transparent 0 ${px(2)}, rgba(238,242,249,.35) ${px(2)} ${px(2.2)}); }
  .sn { position:absolute; width:${px(3.4)}; height:${px(3.4)}; margin:${px(-1.7)} 0 0 ${px(-1.7)}; border-radius:50%; border:${px(0.3)} solid rgba(238,242,249,.55); background:rgba(5,13,34,.6); opacity:0; }
  .sn em { position:absolute; left:50%; transform:translateX(-50%); font:700 ${px(1.4)} Montserrat; font-style:normal; color:var(--lb); white-space:nowrap; }
  .sn em { top:${px(3.4)}; } .sn.up em { top:${px(-2.6)}; }
  .pr { position:absolute; height:${px(0.5)}; margin-top:${px(-0.25)}; background:linear-gradient(90deg, var(--red), var(--gold)); transform-origin:50% 50%; opacity:0; border-radius:${px(0.3)}; }
  .ag { position:absolute; width:${px(4)}; height:${px(4)}; margin:${px(-2)} 0 0 ${px(-2)}; border-radius:50%; background:var(--c); box-shadow:0 0 0 ${px(0.35)} #0b1e42, 0 0 ${px(1.6)} var(--c); display:flex; align-items:center; justify-content:center; opacity:0; z-index:2; }
  .ag b { font:900 ${px(1.9)} Montserrat; color:#0b1e42; } .pt { position:absolute; bottom:100%; left:50%; transform:translateX(-50%); font:900 ${px(2)} Montserrat; text-decoration:none; color:var(--gold); opacity:0; white-space:nowrap; }
  .rnd { position:absolute; ${P ? `right:${px(7)}; top:${px(44)}` : `right:${px(7)}; top:${px(10)}`}; display:flex; align-items:baseline; gap:${px(0.8)}; opacity:0; }
  .rnd small { font:800 ${px(2.2)} Montserrat; text-transform:uppercase; letter-spacing:.12em; color:var(--lb); } .rnd b { font:900 ${px(8)}/1 Montserrat; color:var(--gold); font-variant-numeric:tabular-nums; min-width:${px(9)}; text-align:right; }
  .dcap { position:absolute; ${P ? `left:${px(7)}; right:${px(7)}; top:${px(120)}` : `left:${px(7)}; right:${px(7)}; bottom:${px(6)}`}; font:700 ${px(P ? 3.3 : 2.6)}/1.35 Montserrat; text-align:${P ? 'left' : 'center'}; opacity:0; }
  .dcap b { color:var(--gold); text-transform:uppercase; letter-spacing:.1em; } .dcap.fin { font-weight:800; color:var(--ice); } 
  .win { display:flex; justify-content:center; gap:${px(1.6)}; flex-wrap:wrap; } .win span { white-space:nowrap; } .win b { font-weight:900; }
  /* ryby */
  .fishes { position:absolute; inset:0; overflow:hidden; }
  .fw { position:absolute; left:-25%; width:${px(16)}; height:${px(8)}; margin-top:${px(-4)}; transform:scale(var(--s)); }
  .ff { width:100%; height:100%; } .ff svg { width:100%; height:100%; overflow:visible; } .ff path { fill:#020610; }
  .sysl { margin-top:${px(3)}; display:flex; flex-direction:column; gap:${px(1.2)}; } .sysl span { display:flex; align-items:center; gap:${px(1.2)}; font:700 ${px(P ? 3.2 : 2.4)} Montserrat; opacity:0; } .sysl i { width:${px(3.4)}; height:${px(3.4)}; border-radius:50%; background:#1fae5b; color:#fff; display:flex; align-items:center; justify-content:center; font:900 ${px(1.8)} Montserrat; font-style:normal; }
  /* ČRS */
  .crsw { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:${px(2.4)}; text-align:center; }
  .crsw small { font:700 ${px(P ? 3.4 : 2.6)} Montserrat; text-transform:uppercase; letter-spacing:.12em; color:var(--gold); opacity:0; }
  .crsc { background:#fff; border-radius:${px(2.4)}; padding:${px(2)} ${px(3.2)}; opacity:0; box-shadow:0 ${px(1)} ${px(4)} rgba(0,0,0,.5); } .crsc img { display:block; width:${px(P ? 50 : 30)}; } .crsw b { display:block; overflow:hidden; font:900 ${px(P ? 6.4 : 5.4)} Montserrat; text-transform:uppercase; }
  /* systém */
  .sysbg { position:absolute; inset:0; background:radial-gradient(80% 70% at 70% 40%, #2a4aa8 0%, #0b1e42 60%, #050d22 100%); }
  .sysbg::after { content:''; position:absolute; inset:0; opacity:.14; background:linear-gradient(rgba(238,242,249,.6) 1px, transparent 1px) 0 0 / ${px(5)} ${px(5)}, linear-gradient(90deg, rgba(238,242,249,.6) 1px, transparent 1px) 0 0 / ${px(5)} ${px(5)}; -webkit-mask-image:radial-gradient(circle at 60% 50%, #000, transparent 75%); }
  .sysh { ${P ? `top:${px(16)}` : ''}; } .sysh h1 { ${P ? `font-size:${px(11)};` : ''} } .sysh p { opacity:0; }
  .dev { position:absolute; ${P ? `left:${px(4)}; right:${px(4)}; top:${px(84)}; height:${px(80)}` : `right:${px(2)}; top:${px(8)}; width:${px(98)}; height:${px(84)}`}; }
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
  .sth { top:${px(P ? 20 : 14)}; }
  .kit { position:absolute; ${P ? `left:${px(7)}; right:${px(7)}; top:${px(52)}` : `left:${px(7)}; right:${px(7)}; top:${px(42)}`}; display:grid; grid-template-columns:${P ? '1fr 1fr' : 'repeat(4, 1fr)'}; gap:${px(2)}; }
  .ki { background:rgba(5,13,34,.72); border:${px(0.25)} solid rgba(238,242,249,.25); border-radius:${px(2)}; padding:${px(2.4)}; display:flex; flex-direction:column; align-items:flex-start; gap:${px(1.4)}; opacity:0; backdrop-filter:blur(${px(1)}); }
  .ki svg { width:${px(P ? 13 : 10)}; height:${px(P ? 13 : 10)}; } .ki svg * { fill:none; stroke:var(--ice); stroke-linecap:round; stroke-linejoin:round; stroke-dasharray:1; } .ki svg circle[r="3"], .ki svg circle[r="2.5"] { stroke-width:4; }
  .ki b { font:800 ${px(P ? 3.2 : 2.4)}/1.2 Montserrat; }
  .hint { position:absolute; ${P ? `left:${px(7)}; right:${px(7)}; top:${px(124)}` : `left:${px(7)}; right:${px(7)}; bottom:${px(10)}`}; font:800 ${px(P ? 3.6 : 2.8)} Montserrat; color:var(--gold); opacity:0; }
  /* CTA */
  .cta { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; gap:${px(P ? 4 : 2.6)}; }
  .tal { width:${px(P ? 70 : 46)}; opacity:0; filter:drop-shadow(0 ${px(0.6)} ${px(2)} rgba(0,0,0,.5)); }
  .cta h1 { margin:0; display:flex; flex-direction:column; align-items:center; font:900 ${px(P ? 11 : 9.5)}/0.95 Montserrat; text-transform:uppercase; letter-spacing:-.02em; } .cta h1 span { display:block; overflow:hidden; padding-top:.1em; margin-top:-.1em; }
  .url { position:relative; background:var(--ice); color:var(--navy); border-radius:${px(10)}; padding:${px(1.6)} ${px(5)}; display:flex; flex-direction:column; align-items:center; opacity:0; }
  .url small { font:700 ${px(P ? 2.4 : 1.8)} Montserrat; text-transform:uppercase; letter-spacing:.12em; color:var(--blue); } .url b { font:900 ${px(P ? 6.4 : 5)} Montserrat; letter-spacing:-.01em; color:var(--red); }
  .cur { position:absolute; right:${px(2)}; bottom:${px(-2.4)}; width:${px(4)}; height:${px(4)}; opacity:0; background:no-repeat center/contain url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M4 2l16 9-7 2-3 7z' fill='%23fff' stroke='%230b1e42' stroke-width='1.5'/%3E%3C/svg%3E"); }
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
  <audio id="music" class="clip" data-start="0" data-duration="${DUR}" data-track-index="0" src="assets/track.wav" data-volume="1"></audio>
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
  const dir = path.join(PROTO, P ? '9x16' : '16x9');
  fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(path.join(dir, 'assets'))) fs.symlinkSync('../assets', path.join(dir, 'assets'));
  fs.writeFileSync(path.join(dir, 'index.html'), doc);
  console.log(file, 'DUR', DUR, 'tweens', out.length);
}
build(1080, 1920, '9x16');
build(1920, 1080, '16x9');
