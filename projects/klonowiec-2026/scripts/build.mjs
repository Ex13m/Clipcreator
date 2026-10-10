// Klonowiec Trout Area Cup podzim 2026 — Den 1 «den v číslech».
// Celý den (06:00–15:30) je natažený na délku tracku: počítadlo ryb roste jen během kol a reálnou rychlostí kola.
// Data: 02_SELECT/data_d1.json (výsledková listina TA CZ, 40 závodníků × 12 kol). Bez dabingu.
// Track: 03_MUSIC/track.wav + track.beats.json (Suno) — dokud není, běží syntetická mřížka 128 BPM.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROTO = path.join(ROOT, 'proto');
const FONTS = fs.readFileSync(path.join(PROTO, 'assets/fonts.css'), 'utf8');
const IMG = JSON.parse(fs.readFileSync(path.join(PROTO, 'assets/photos.json'), 'utf8'));
const D = JSON.parse(fs.readFileSync(path.join(ROOT, '02_SELECT/data_d1.json'), 'utf8'));
const VER = process.env.VER || 'v14';

// ---------- čas: track nebo syntetická mřížka ----------
const BEATS_F = path.join(ROOT, '03_MUSIC/track.beats.json');
const HAS_TRACK = fs.existsSync(BEATS_F) && fs.existsSync(path.join(PROTO, 'assets/track.wav'));
const G = HAS_TRACK ? JSON.parse(fs.readFileSync(BEATS_F, 'utf8')) : (() => {
  const bpm = 130, b = 60 / bpm, dur = 120, beats = [], downbeats = [];
  for (let t = 0, i = 0; t < dur; t += b, i++) { beats.push(+t.toFixed(4)); if (i % 4 === 0) downbeats.push(+t.toFixed(4)); }
  return { beats, downbeats, duration: dur };
})();
const DUR = +G.duration.toFixed(2);
const DAYEND_T = HAS_TRACK ? 133.6 : DUR - 25;
const TAIL = +(DUR - DAYEND_T).toFixed(3);                     // po 15:30: organizátoři, David, outro
const DAY0 = 6 * 60, DAY1 = 15 * 60 + 30;
const PRE = 12;  // 06:00–08:00 zhuštěno do 12 s
// s trackem: kotvy na strukturu písně (breakdown = oběd/sektory, drop = závod lídrů, 2. breakdown = ryby≠body, finální drop = vyhlášení)
const KN = HAS_TRACK
  ? [[DAY0, 0], [6 * 60 + 30, 3], [7 * 60 + 20, 7.6], [7 * 60 + 50, 10.6], [8 * 60, PRE], [700, 61.23], [760, 76.46], [870, 112.6], [900, 122.16], [DAY1, DAYEND_T]]
  : [[DAY0, 0], [6 * 60 + 30, 3], [7 * 60 + 20, 7.6], [7 * 60 + 50, 10.6], [8 * 60, PRE], [DAY1, DUR - TAIL]];
const TL = HAS_TRACK ? { tab: 13, org: 5, host: 7, mont: 20 } : { tab: 11, org: 4, host: 5, mont: 0 };
const tOf = (hhmm) => { const m = typeof hhmm === 'number' ? hhmm : +hhmm.slice(0, 2) * 60 + +hhmm.slice(3);
  for (let i = 1; i < KN.length; i++) if (m <= KN[i][0]) { const [m0, t0] = KN[i - 1], [m1, t1] = KN[i]; return +(t0 + ((m - m0) / (m1 - m0)) * (t1 - t0)).toFixed(3); }
  return DUR - TAIL; };
const snap = (t) => G.beats.reduce((a, b) => (Math.abs(b - t) < Math.abs(a - t) ? b : a), G.beats[0]);
const len = (a, b) => +(b - a).toFixed(3);
const rnd = (seed) => { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); };
const BEAT = G.beats[1] - G.beats[0];

// ---------- data ----------
const R = D.schedule.rounds.map((r, i) => ({ ...r, n: i + 1, fish: D.fish_per_round[i], a: tOf(r.from), b: tOf(r.to) }));
const A = D.anglers;
const name = (a) => `${a.first} ${a.last}`;
const bestOfRound = (k) => A.reduce((m, a) => (a.rounds[k].fish > m.rounds[k].fish ? a : m), A[0]);
const cum = (a, k) => a.rounds.slice(0, k + 1).reduce((s, r) => s + r.pts, 0);
const LEAD = [...A].sort((x, y) => x.rank - y.rank).slice(0, 10);
const TOP5 = LEAD.slice(0, 5);
const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const CTRY = Object.entries(A.reduce((m, a) => ((m[a.country] = (m[a.country] || 0) + 1), m), {})).sort((a, b) => b[1] - a[1]);
const TOTAL = D.fish_total;

function build(W, H, file) {
  const P = H > W, u = Math.min(W, H) / 100;
  const px = (n) => `${Math.round(n * u)}px`;
  const f = (n) => n.toFixed(1) + 'px';
  // HUD: na výšku nahoře, na šířku dole
  const HUD_H = P ? 30 * u : 15 * u;
  const SC = P ? { top: HUD_H + 3 * u, bot: H - 5 * u } : { top: 5 * u, bot: H - HUD_H - 2 * u };
  const scH = SC.bot - SC.top;
  const out = [];  // tweens
  const T = (sel, from, to, pos) => out.push(`tl.fromTo(${JSON.stringify(sel)}, ${JSON.stringify(from)}, ${JSON.stringify(to)}, ${(+pos).toFixed(3)});`);
  const scenes = [];
  const starts = [];
  const scene = (id, a, b, html, track = 2) => ((/^s-m\d/.test(id) ? 0 : starts.push(a)), scenes.push(`<section id="${id}" class="clip" data-start="${a.toFixed(3)}" data-duration="${len(a, b)}" data-track-index="${track}">${html}</section>`));
  const onBeat = (t) => G.beats.find((b) => b >= t - 0.04) ?? t;
  const rise = (sel, t, d = 0.5) => T(sel, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: d, ease: 'expo.out' }, onBeat(t));
  const fade = (sel, t, d = 0.4) => T(sel, { opacity: 0, y: 2 * u, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: d, ease: 'back.out(2)' }, onBeat(t));
  // fotka s pomalým zoomem + pulsem na dobách
  let phN = 0;
  const photo = (img, a, b, cls = '') => {
    const k = phN++, zin = k % 2 === 0, id = `ph${k}`;
    T(`#${id}`, { scale: zin ? 1.0 : 1.12, xPercent: zin ? -1.5 : 1.5 }, { scale: zin ? 1.12 : 1.0, xPercent: zin ? 1.5 : -1.5, duration: len(a, b), ease: 'sine.inOut' }, a);
    T(`#${id}`, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out', immediateRender: false }, a);
    G.downbeats.filter((t) => t > a + 0.1 && t < b - 0.2).forEach((t) => out.push(`tl.fromTo("#${id} .pb", {scale:1.025}, {scale:1, duration:0.35, ease:"power2.out", immediateRender:false}, ${t.toFixed(3)});`));
    const por = IMG[img] && IMG[img][1] > IMG[img][0];
    return `<div class="phw ${cls}" id="${id}"><div class="pb" style="background-image:url(assets/photos/${img}.jpg)${por ? '; background-position:50% 12%' : ''}"></div></div>`;
  };

  // ===== 1) intro 06:00–06:40 =====
  {
    const a = 0, b = tOf('06:30');
    scene('s-intro', a, b, `
      <div class="aer">${photo('aerial', a, b)}</div>
      <div class="ttl"><div class="tap" id="tap-in"><img src="assets/ta_logo_h.png" alt="Trout Area Czech Republic"></div><div class="l1"><span>OPĚT</span></div><div class="l1 red"><span>POLSKO</span></div>
        <div class="l2"><span>Klonowiec Trout Area Cup · podzim 2026</span></div><div class="l3"><span>Den 1 · sobota 10. 10. 2026 · Łowisko Klonówiec</span></div><div class="l3 w"><span>${D.weather.min}–${D.weather.max} °C · déšť ${D.weather.rain_pct} % · vítr ${D.weather.wind_ms} m/s</span></div></div>`);
    T('#tap-in', { opacity: 0, x: -4 * u }, { opacity: 1, x: 0, duration: 0.4, ease: 'expo.out' }, 0.05); rise('#s-intro .l1:nth-child(2) span', a + 0.2, 0.5); rise('#s-intro .l1:nth-child(3) span', a + 0.2 + BEAT, 0.5);
    fade('#s-intro .l2 span', a + BEAT * 2.5); fade('#s-intro .l3 span', a + BEAT * 3); fade('#s-intro .l3.w span', a + BEAT * 3.5);
  }
  // ===== 2) zarybnění 06:40–07:20 =====
  {
    const a = tOf('06:30'), b = tOf('07:20');
    const tiles = [[480, 'kg', 'pstruhů v revíru'], [2700, '', 'ryb · Ø 180 g'], [100, 'kg', 'navíc před každým dnem']];
    scene('s-stock', a, b, `<div class="h2"><span>Zarybnění</span><em>Stocking</em></div>
      <div class="dots" id="dots">${Array.from({ length: 270 }, (_, i) => `<i id="dd${i}"></i>`).join('')}<em>1 tečka = 10 ryb</em></div><div class="tiles">${tiles.map(([v, un, l], i) => `<div class="tile" id="tl${i}"><b><i id="tv${i}">0</i>${un ? `<small>${un}</small>` : ''}</b><span>${i === 1 ? '≈ ' : ''}${l}</span></div>`).join('')}</div>`);
    rise('#s-stock .h2 span', a + 0.1); fade('#s-stock .h2 em', a + 0.3);
    tiles.forEach(([v], i) => {
      const t = a + 0.3 + i * BEAT;
      T(`#tl${i}`, { opacity: 0, y: 4 * u, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.6)' }, t);
      out.push(`{ const o={v:0}, el=document.getElementById("tv${i}"); tl.fromTo(o,{v:0},{v:${v},duration:1.4,ease:"power2.out",onUpdate(){el.textContent=(${i === 2} ? "+" : "")+Math.round(o.v).toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g,"\\u2009");}}, ${(t + 0.1).toFixed(3)}); }`);
    });
    for (let i = 0; i < 270; i++) out.push(`tl.fromTo("#dd${i}", {scale:0, opacity:0}, {scale:1, opacity:1, duration:0.25, ease:"back.out(3)"}, ${(a + 1.0 + (i % 18) * 0.02 + Math.floor(i / 18) * 0.035).toFixed(3)});`);
    
  }
  // ===== 3) startovka 07:20–07:50 =====
  {
    const a = tOf('07:20'), b = tOf('07:50');
    const max = CTRY[0][1];
    scene('s-field', a, b, `${photo('d1_05', a, b, 'dim')}
      <div class="h2"><span>${A.length} závodníků</span><em>${CTRY.length} země · 40 anglers</em></div>
      <div class="cbars">${CTRY.map(([c, n], i) => `<div class="cb" id="cb${i}"><span class="cc">${c}</span><span class="cbar"><i id="cbi${i}" style="width:${((n / max) * 100).toFixed(1)}%"></i></span><b>${n}</b></div>`).join('')}</div>`);
    rise('#s-field .h2 span', a + 0.2); fade('#s-field .h2 em', a + 0.4);
    CTRY.forEach((_, i) => { fade(`#cb${i}`, a + 0.5 + i * BEAT * 0.5); T(`#cbi${i}`, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power3.out' }, a + 0.6 + i * BEAT * 0.5); });
  }
  // ===== 4) porada 07:50–08:00 =====
  {
    const a = tOf('07:50'), b = tOf('08:00');
    scene('s-brief', a, b, `${photo('d1_12', a, b)}<div class="tag"><b>7:30</b><span>porada · briefing</span></div>`);
    fade('#s-brief .tag', a + 0.2);
  }
  // ===== 5) kola 1–8: fotky + callout po každém kole =====
  const RPH = ['d1_07', 'd1_08', 'd1_09', 'd1_11', 'd1_10', 'd1_06', 'd1_03', 'd1_04'];
  const RPH2 = ['d1_12', 'd1_05', 'd1_06', 'd1_10', 'd1_09', 'd1_11', 'd1_08', 'd1_12'];
  const roundCard = (k) => {
    const best = bestOfRound(k);
    return `<div class="rc" id="rc${k}"><div class="rc-n"><span>${k + 1}. kolo</span></div><div class="rc-f"><b>${R[k].fish}</b><span>ryb · ${(R[k].fish / ((tOf(R[k].to) - tOf(R[k].from)) || 1) * 0 + D.fish_rate_per_min[k]).toFixed(1).replace('.', ',')} / min</span></div>
      <div class="rc-b">Nejvíc: <b>${name(best)}</b> ${best.rounds[k].fish} ryb</div></div>`;
  };
  for (let k = 0; k < 8; k++) {
    const a = k === 0 ? tOf('08:00') : R[k - 1].b, b = R[k].b + (k === 7 ? 0 : 0);
    const end = k === 7 ? tOf('11:40') : R[k].b;
    const extra = k === 0 ? `<div class="plate"><b>Jiří Nachlinger</b><i>8 ryb v 1. kole</i></div>` : '';
    const mid = G.downbeats.find((t) => t > a + (end - a) * 0.5) ?? (a + end) / 2;
    const two = end - a > 4.5 && k !== 0;
    scene(`s-r${k}`, a, end, `${photo(RPH[k], a, two ? mid : end)}${two ? photo(RPH2[k], mid, end) : ''}${extra}${roundCard(k)}`);
    // karta kola vyjede v polovině kola a drží do konce úseku
    const tc = Math.min(R[k].a + (R[k].b - R[k].a) * 0.35, end - 1.2);
    T(`#rc${k}`, { opacity: 0, x: -5 * u }, { opacity: 1, x: 0, duration: 0.45, ease: 'expo.out' }, tc);
    rise(`#rc${k} .rc-n span`, tc + 0.05);
    if (extra) fade(`#s-r${k} .plate`, a + 0.4);
  }
  // ===== 6) oběd 11:40–12:40: menu + díky Davide + průběžné pořadí =====
  {
    const a = tOf('11:40'), m = tOf('12:00'), b = tOf('12:40');
    scene('s-lunch', a, m, `${photo('d1_01', a, m, 'dim')}
      <div class="h2"><span>Oběd</span><em>11:40 · lunch</em></div>
      <div class="menu"><div class="mi" id="mi0"><b>1.</b> Polévka</div><div class="mi" id="mi1"><b>2.</b> Kotleta, brambory, salát</div></div>
      <div class="thx" id="thx"><span>Díky, Davide!</span><em>David Helman — zase vřelé přivítání, dobré jídlo a revír plný ryb.</em></div>`);
    rise('#s-lunch .h2 span', a + 0.1); fade('#s-lunch .h2 em', a + 0.3); fade('#mi0', a + 0.5); fade('#mi1', a + 0.5 + BEAT);
    T('#thx', { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }, a + 1.4);
    T('#thx span', { color: '#0b1e42' }, { color: '#e31e24', duration: 0.25, yoyo: true, repeat: 3 }, a + 2.1);
    const SEC = D.fish_per_sector, smax = Math.max(...Object.values(SEC)), smin = Math.min(...Object.values(SEC));
    const mix = (t) => { const c0 = [223, 229, 241], c1 = [48, 66, 133]; return `rgb(${c0.map((v, i) => Math.round(v + (c1[i] - v) * t)).join(',')})`; };
    const heat = (v) => mix((v - smin) / (smax - smin));
    const ink = (v, lo, hi) => ((v - lo) / (hi - lo) > 0.45 ? '#eef2f9' : '#0b1e42');
    const order = P ? Array.from({ length: 20 }, (_, i) => i + 1) : [...Array.from({ length: 10 }, (_, i) => 11 + i), ...Array.from({ length: 10 }, (_, i) => 10 - i)];
    const PL = {}; A.forEach((x) => x.rounds.forEach((r) => (PL[r.sec] = (PL[r.sec] || 0) + r.fish)));
    const pmax = Math.max(...Object.values(PL)), pmin = Math.min(...Object.values(PL));
    const best = Object.entries(PL).sort((p, q) => q[1] - p[1])[0], worst = Object.entries(PL).sort((p, q) => p[1] - q[1])[0];
    const pcol = (v) => mix((v - pmin) / (pmax - pmin));
    scene('s-mid', m, b, `${photo('d1_08', m, b, 'dimx')}<div class="h2"><span>${P ? 'Sektory' : 'Sektory a místa'}</span><em>${P ? 'a místa · 20 sektorů · 40 míst' : '20 sektorů · 40 míst · ryby za 12 kol'}</em></div>
      <div class="heat">${order.map((n) => `<div class="hcell" id="hcell${n}" style="background:${heat(SEC[n])}; color:${ink(SEC[n], smin, smax)}"><em>S${n}</em><b>${SEC[n]}</b>
        <div class="pp"><span style="background:${pcol(PL[2 * n - 1])}; color:${ink(PL[2 * n - 1], pmin, pmax)}">${2 * n - 1}<i>${PL[2 * n - 1]}</i></span><span style="background:${pcol(PL[2 * n])}; color:${ink(PL[2 * n], pmin, pmax)}">${2 * n}<i>${PL[2 * n]}</i></span></div></div>`).join('')}</div>
      <div class="pstrip" id="pstrip">${Array.from({ length: 40 }, (_, i) => `<i id="pb${i + 1}" style="height:${((PL[i + 1] / pmax) * 100).toFixed(1)}%; background:${pcol(PL[i + 1])}"></i>`).join('')}<em class="pse">místo 1 → 40</em></div>
      <div class="hnote" id="hnote"><b>Nejlepší místo ${best[0]}: ${best[1]} ryb</b> · nejslabší místo ${worst[0]}: ${worst[1]} ryb · Ø ${Math.round(TOTAL / 40)} na místo</div>`);
    rise('#s-mid .h2 span', m + 0.1); fade('#s-mid .h2 em', m + 0.3);
    order.forEach((n, i) => T(`#hcell${n}`, { opacity: 0, rotationY: -100, transformPerspective: 600 }, { opacity: 1, rotationY: 0, duration: 0.5, ease: 'back.out(1.6)' }, m + 0.5 + i * 0.06));
    T('#s-mid .pp span', { opacity: 0, y: u }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.03, ease: 'power3.out' }, m + 2.0);
    for (let i = 1; i <= 40; i++) T(`#pb${i}`, { scaleY: 0 }, { scaleY: 1, duration: 0.4, ease: 'power3.out' }, m + 3.0 + i * 0.03);
    fade('#hnote', m + 4.4);
    T(`#pb${best[0]}`, { filter: 'brightness(1)' }, { filter: 'brightness(1.8)', duration: 0.3, yoyo: true, repeat: 5, immediateRender: false }, m + 4.6);
    T('#hcell1', { boxShadow: '0 0 0 0 rgba(227,30,36,0)' }, { boxShadow: `0 0 0 ${px(0.7)} rgba(227,30,36,1)`, duration: 0.3, yoyo: true, repeat: 5, ease: 'sine.inOut' }, m + 4.6);
  }
  // ===== 7) kola 9–12: závod lídrů — bar chart race po kolech =====
  {
    const a = tOf('12:40'), b = tOf('14:30');
    const COL = LEAD.map((x, j) => (j === 0 ? '#e31e24' : j < 3 ? '#304285' : '#5a6fb8'));
    const rowH = P ? 5.4 * u : 4.6 * u, BW = P ? 46 * u : W * 0.4, maxP = 33;
    // časy stavů: kola 1–8 rychlý replay v první třetině, 9–12 přesně na konci kola
    const iv = Math.min(0.4, (R[8].b - 0.5 - a - 0.7) / 9);
    const ts = R.map((r, k) => (k < 8 ? a + 0.7 + k * iv : r.b - 0.5));
    const rankAt = (k) => [...LEAD].sort((x, y) => cum(y, k) - cum(x, k) || y.fish - x.fish).map((x) => x.last);
    scene('s-path', a, b, `${photo('d1_07', a, b, 'dimx')}<div class="h2"><span>Závod lídrů</span><em>leaders' race · body po kolech</em></div>
      <div class="race" style="height:${f(rowH * 10)}">${LEAD.map((x, j) => `<div class="rr" id="rr${j}" style="top:0">
        <span class="rn">${x.first[0]}. ${x.last}</span><span class="rb"><i id="rbi${j}" style="background:${COL[j]}; width:${f(BW)}"></i></span><b id="rv${j}">0</b></div>`).join('')}
        <div class="rk" id="rk"><span id="rkn">1</span><em>kolo</em></div></div>
      <div class="rmini" id="rmini">${[8, 9, 10, 11].map((k) => roundCard(k).replace(`id="rc${k}"`, `id="rc${k}" style="position:absolute; inset:0"`)).join('')}</div>`);
    rise('#s-path .h2 span', a + 0.1); fade('#s-path .h2 em', a + 0.3);
    LEAD.forEach((x, j) => { T(`#rr${j}`, { opacity: 0, x: -4 * u }, { opacity: 1, x: 0, duration: 0.35, ease: 'power3.out' }, a + 0.3 + j * 0.05);
      out.push(`tl.set("#rr${j}", {y:${(rankAt(0).indexOf(x.last) * rowH).toFixed(1)}}, ${a.toFixed(3)});`);
      out.push(`tl.set("#rbi${j}", {scaleX:0}, ${a.toFixed(3)});`); });
    R.forEach((_, k) => {
      const t = ts[k], ord = rankAt(k), d = k < 8 ? +(iv * 0.85).toFixed(3) : 0.6;
      const prevOrd = k ? rankAt(k - 1) : ord;
      LEAD.forEach((x, j) => {
        const p0 = k ? cum(x, k - 1) : 0;
        out.push(`tl.fromTo("#rbi${j}", {scaleX:${(p0 / maxP).toFixed(4)}}, {scaleX:${(cum(x, k) / maxP).toFixed(4)}, duration:${d}, ease:"power2.out", immediateRender:false}, ${t.toFixed(3)});`);
        out.push(`tl.fromTo("#rr${j}", {y:${(prevOrd.indexOf(x.last) * rowH).toFixed(1)}}, {y:${(ord.indexOf(x.last) * rowH).toFixed(1)}, duration:${d}, ease:"power3.inOut", immediateRender:false}, ${t.toFixed(3)});`);
        out.push(`tl.fromTo("#rv${j}", {innerText:${p0}}, {innerText:${cum(x, k)}, snap:{innerText:1}, duration:${d}, ease:"none", immediateRender:false}, ${t.toFixed(3)});`);
      });
      out.push(`tl.set("#rkn", {innerText:${k + 1}}, ${t.toFixed(3)});`);
      out.push(`tl.fromTo("#rk", {scale:1.25}, {scale:1, duration:${Math.min(0.35, k < 8 ? iv * 0.85 : 0.35).toFixed(3)}, ease:"back.out(3)", immediateRender:false}, ${t.toFixed(3)});`);
    });
    T('#rr0', { backgroundColor: 'rgba(227,30,36,0)' }, { backgroundColor: 'rgba(227,30,36,.18)', duration: 0.3, yoyo: true, repeat: 3, immediateRender: false }, R[11].b + 0.2);
    [8, 9, 10, 11].forEach((k, i) => {
      const tc = R[k].a + (R[k].b - R[k].a) * 0.3, nx = i < 3 ? R[k + 1].a + (R[k + 1].b - R[k + 1].a) * 0.3 : b;
      T(`#rc${k}`, { opacity: 0, x: -4 * u }, { opacity: 1, x: 0, duration: 0.4, ease: 'expo.out' }, tc);
      if (i < 3) T(`#rc${k}`, { opacity: 1 }, { opacity: 0, duration: 0.25, immediateRender: false }, nx - 0.25);
    });
  }
  // ===== 8) ryby ≠ body: bump chart — hladké stuhy z pořadí podle ryb do konečného pořadí =====
  {
    const a = tOf('14:30'), b = tOf('15:00');
    const SEL = [...A].sort((x, y) => y.fish - x.fish || x.rank - y.rank).slice(0, 10);
    const byRank = [...SEL].sort((x, y) => x.rank - y.rank);
    const CW = P ? 92 * u : W * 0.66, CH = P ? 62 * u : scH * 0.66;
    const padT = 6 * u, padB = 2 * u, lw = P ? 30 * u : 22 * u, rw = P ? 22 * u : 18 * u;
    const xl = lw, xr = CW - rw, yy = (i) => padT + (i + 0.5) * ((CH - padT - padB) / 10);
    const fmin = Math.min(...SEL.map((x) => x.fish)), fmax = Math.max(...SEL.map((x) => x.fish));
    const sw = (fv) => (0.5 + ((fv - fmin) / (fmax - fmin)) * 1.6) * u;
    const fs = P ? 2.6 * u : 2 * u;
    const defs = SEL.map((x, i) => { const d = byRank.indexOf(x) - i, c2 = d > 0 ? '#e31e24' : '#304285';
      return `<linearGradient id="bg${i}" gradientUnits="userSpaceOnUse" x1="${xl}" x2="${xr}" y1="0" y2="0"><stop offset="0" stop-color="#8ea2d8"/><stop offset="1" stop-color="${c2}"/></linearGradient>`; }).join('');
    const rib = SEL.map((x, i) => { const y1 = yy(i), y2 = yy(byRank.indexOf(x)), xm = (xl + xr) / 2;
      return `<path class="rb" id="rb${i}" d="M${xl.toFixed(1)},${y1.toFixed(1)} C${xm.toFixed(1)},${y1.toFixed(1)} ${xm.toFixed(1)},${y2.toFixed(1)} ${xr.toFixed(1)},${y2.toFixed(1)}" stroke="url(#bg${i})" stroke-width="${sw(x.fish).toFixed(1)}" pathLength="1"/>`; }).join('');
    const lp = SEL.map((x, i) => `<div class="bl" id="bl${i}" style="top:${f(yy(i))}; width:${f(lw - 1.2 * u)}; font-size:${f(fs)}"><span class="bn">${x.first[0]}. ${x.last}</span><b>${x.fish}</b></div>`).join('');
    const rp = byRank.map((x, j) => `<div class="br" id="br${SEL.indexOf(x)}" style="top:${f(yy(j))}; left:${f(xr + 1.2 * u)}; font-size:${f(fs)}"><b>${x.rank}.</b><span>${x.pts} b.</span></div>`).join('');
    scene('s-scatter', a, b, `${photo('d1_04', a, b, 'dimx')}<div class="h2"><span>Ryby ≠ body</span><em>top 10 podle ryb → konečné pořadí</em></div>
      <div class="bump" style="width:${f(CW)}; height:${f(CH)}"><div class="bhd" style="left:0; width:${f(lw)}">ryby</div><div class="bhd" style="left:${f(xr)}; width:${f(rw)}">místo · body</div>
        <svg viewBox="0 0 ${CW.toFixed(0)} ${CH.toFixed(0)}"><defs>${defs}</defs>${rib}</svg>${lp}${rp}</div>
      <div class="snote" id="snote"><b>Stoklasa: 91 ryb → 4. místo</b> · Švub: 95 ryb → 1. místo</div>`);
    rise('#s-scatter .h2 span', a + 0.1); fade('#s-scatter .h2 em', a + 0.3);
    T('#s-scatter .bump', { opacity: 0, y: 3 * u }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, onBeat(a + 0.3));
    const bts = G.beats.filter((t) => t > a + 0.8).slice(0, 12);
    SEL.forEach((x, i) => {
      const t = bts[Math.floor(i / 2)] + (i % 2) * BEAT / 2;
      T(`#bl${i}`, { opacity: 0, x: -3 * u }, { opacity: 1, x: 0, duration: 0.3, ease: 'expo.out' }, t);
      T(`#rb${i}`, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, t + 0.1);
      T(`#br${i}`, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(3)' }, t + 0.9);
    });
    // fokus: ostatní stuhy ztlumí, Stoklasa a Švub svítí
    const tf = G.downbeats.find((t) => t > a + 4.6) ?? a + 5;
    const hi = [SEL.findIndex((x) => x.last === 'Stoklasa'), SEL.findIndex((x) => x.last === 'Švub')];
    SEL.forEach((_, i) => { if (!hi.includes(i)) { T(`#rb${i}`, { opacity: 1 }, { opacity: 0.18, duration: 0.4, immediateRender: false }, tf); T(`#bl${i}, #br${i}`, { opacity: 1 }, { opacity: 0.35, duration: 0.4, immediateRender: false }, tf); } });
    hi.forEach((i) => T(`#rb${i}`, { filter: 'drop-shadow(0 0 0px rgba(227,30,36,0))' }, { filter: `drop-shadow(0 0 ${px(1.2)} rgba(227,30,36,.9))`, duration: 0.3, yoyo: true, repeat: 5, immediateRender: false }, tf + 0.1));
    fade('#snote', tf + 0.2);
  }
  // ===== 9) vyhlášení 15:00–15:30 =====
  {
    const a = tOf('15:00'), b = tOf('15:30');
    scene('s-podium', a, b, `${photo('d1_02', a, b, 'top pod')}
      <div class="t5">${TOP5.map((x, i) => `<div class="t5r" id="t5${i}"><span class="lp">${i + 1}</span><span class="ln">${name(x)}</span><span class="tf">${x.fish} ryb</span><b>${x.pts} b</b></div>`).join('')}</div>`);
    TOP5.forEach((_, i) => fade(`#t5${4 - i}`, a + 0.4 + i * BEAT, 0.35));
    T('#t50', { backgroundColor: 'rgba(238,242,249,.96)' }, { backgroundColor: 'rgba(255,214,216,.98)', duration: 0.3, yoyo: true, repeat: 3 }, a + 0.4 + 5 * BEAT);
  }
  // ===== 10a) výsledky všech 40: 12 čtverců na kolo (barva = body, číslo = ryby) =====
  {
    const ta = DUR - TAIL, tb = ta + TL.tab;
    const S = [...A].sort((x, y) => x.rank - y.rank);
    const cols = P ? [S] : [S.slice(0, 20), S.slice(20)];
    const sq = (r) => `<i class="q p${r.pts}${r.fish >= 10 ? ' hot' : ''}">${r.fish}</i>`;
    scene('s-all', ta, tb, `${photo('d1_05', ta, tb, 'dimx')}<div class="h2"><span>${P ? 'Výsledky' : 'Výsledky · Den 1'}</span><em>${P ? 'Den 1 · kolo po kole' : 'všech 40 · kolo po kole · ryby v kole'}</em></div>
      <div class="qleg"><span><i class="q p3"></i>výhra${P ? "" : " 3 b."}</span><span><i class="q p2"></i>remíza s rybou${P ? "" : " 2 b."}</span><span><i class="q p1"></i>0:0${P ? "" : " 1 b."}</span><span><i class="q p0"></i>prohra</span></div>
      <div class="allw"><div class="allc" id="allc">${cols.map((c) => `<div class="allcol">${c.map((x) => `<div class="ar" id="ar${x.rank}"><span class="ap">${x.rank}</span><span class="an">${x.first[0]}. ${x.last}<i>${x.country}</i></span><span class="qs">${x.rounds.map(sq).join('')}</span><span class="af">${x.fish}</span><b>${x.pts}</b></div>`).join('')}</div>`).join('')}</div></div>`);
    rise('#s-all .h2 span', ta + 0.1); fade('#s-all .h2 em', ta + 0.3); fade('#s-all .qleg', ta + 0.5);
    S.forEach((x, i) => T(`#ar${x.rank}`, { opacity: 0, x: -3 * u }, { opacity: 1, x: 0, duration: 0.3, ease: 'power3.out' }, ta + 0.5 + (P ? i : i % 20) * 0.04 + (P ? 0 : Math.floor(i / 20) * 0.25)));
    // čtverce vyskakují vlnou po kolech (sloupcích)
    for (let k = 0; k < 12; k++) T(`#s-all .q:nth-child(${k + 1})`, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2.5)', stagger: 0.012 }, ta + 1.2 + k * 0.14);
    T('#s-all .ar:nth-child(-n+3) .q.p3', { boxShadow: '0 0 0 0 rgba(227,30,36,0)' }, { boxShadow: `0 0 0 ${px(0.3)} rgba(227,30,36,.95)`, duration: 0.3, yoyo: true, repeat: 3, immediateRender: false }, ta + 3.4);
    if (P) { const rowH = 4.15 * u, vis = Math.floor((SC.bot - SC.top - 24 * u) / rowH); T('#allc', { y: 0 }, { y: -(40 - vis) * rowH, duration: tb - ta - 4.4, ease: 'sine.inOut' }, ta + 3.6); }
  }
  // ===== 10) tail: organizátoři · David · outro =====
  {
    const t0 = DUR - TAIL + TL.tab, t1 = t0 + TL.org, t2h = t1 + TL.host, t3 = DUR;
    const ORG = ['Igor Novák', 'Denis Zaikin', 'Stanislav Lukášek', 'Michal Horák'];
    scene('s-org', t0, t1, `${photo('organizers_lowres', t0, t1, 'org')}<div class="h2 low"><span>Organizátoři</span><em>organizers · Trout Area CZ</em></div>
      <div class="orgn">${ORG.map((n, i) => `<span id="on${i}">${n}</span>`).join('')}</div>`);
    rise('#s-org .h2 span', t0 + 0.2); fade('#s-org .h2 em', t0 + 0.4); ORG.forEach((_, i) => fade(`#on${i}`, t0 + 0.8 + i * BEAT));
    const h = A.find((x) => x.last === 'Helman');
    scene('s-host', t1, t2h, `<div class="host"><div class="hk"><span>Děkujeme</span></div><div class="hn"><span>David Helman</span></div>
      <div class="hs" id="hs">Hostitel · a k tomu ${h.rank}. místo a ${h.fish} ryb</div>
      <div class="kp" id="kp"><img src="assets/kolorowe_logo.png" alt="Kolorowe Pstrągi"><div><b>Kolorowe Pstrągi · Łowisko Klonówiec</b><span>Klonowiec 37B, Polsko · +48 539 946 787 · rezervace telefonicky</span></div></div></div>`);
    rise('#s-host .hk span', t1 + 0.15); rise('#s-host .hn span', t1 + 0.15 + BEAT); fade('#hs', t1 + 0.4 + BEAT * 2); fade('#kp', t1 + 0.6 + BEAT * 4, 0.5);
    T('#kp img', { rotation: -90, scale: 0.6 }, { rotation: 0, scale: 1, duration: 0.6, ease: 'back.out(1.6)' }, onBeat(t1 + 0.6 + BEAT * 4));
    // rekapitulace: všechny fotky střihem na doby
    let t2 = t2h;
    if (TL.mont) {
      const MB = G.beats.filter((t) => t >= t2h - 0.05).slice(0, TL.mont + 1);
      const MP = ['d1_10', 'd1_08', 'd1_09', 'd1_11', 'd1_06', 'd1_07', 'd1_03', 'd1_04', 'd1_12', 'd1_05', 'd1_01', 'd1_02'];
      const pairs = MP.map((img, i) => [img, MB[i * 2], MB[i * 2 + 2]]).filter(([, a, b]) => a && b);
      pairs.forEach(([img, a, b], i) => {
        scene(`s-m${i}`, a, b, `<div class="phw mon" id="mo${i}"><div class="pb" style="background-image:url(assets/photos/${img}.jpg)"></div></div>`);
        T(`#mo${i} .pb`, { scale: 1.18 }, { scale: 1.04, duration: len(a, b), ease: 'power2.out' }, a);
      });
      t2 = pairs.length ? pairs[pairs.length - 1][2] : t2h;
    }
    scene('s-out', t2, t3, `<div class="fin"><div class="fv"><b id="fin-n">${fmt(TOTAL)}</b><span>ryb za den · ≈ ${Math.round(TOTAL * 0.18)} kg</span></div>
      <div class="tap big" id="tap-out"><img src="assets/ta_logo_h.png" alt="Trout Area Czech Republic"></div><div class="fz"><span>Zítra Den 2 · buďte připraveni!</span></div></div>`);
    fade('#s-out .fv', t2 + 0.1); T('#tap-out', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }, t2 + 0.4 + BEAT); fade('#s-out .fz', t2 + 0.6 + BEAT * 2);
    T('#gh-end', { opacity: 0 }, { opacity: 0.6, duration: 0.8 }, DUR - 5.5);
    T('#gh-end .gh-ring', { rotation: 0 }, { rotation: 140, duration: 5.5, ease: 'none' }, DUR - 5.5);
  }
  T('#gh-intro', { opacity: 0 }, { opacity: 0.6, duration: 0.5 }, 0.4);
  T('#gh-intro .gh-ring', { rotation: 0 }, { rotation: 70, duration: 2.8, ease: 'none' }, 0.4);
  out.push(`tl.to("#gh-intro", {opacity:0, duration:0.5}, 2.6);`);

  // ===== DRUM-PAD: běžící světlo po dobách (step sequencer) + údery na „horkých“ datech =====
  const beatsIn = (a, b) => G.beats.filter((t) => t >= a && t < b - 0.05);
  const padRun = (selFn, n, a, b, lvl = 2.2, d = 0.22) => beatsIn(a, b).forEach((t, i) =>
    out.push(`tl.fromTo(${JSON.stringify(selFn(i % n))}, {filter:"brightness(${lvl}) saturate(1.3)"}, {filter:"brightness(1) saturate(1)", duration:${d}, ease:"power2.out", immediateRender:false}, ${t.toFixed(3)});`));
  const padHit = (sel, a, b, every = 1, lvl = 1.9) => beatsIn(a, b).filter((_, i) => i % every === 0).forEach((t) =>
    out.push(`tl.fromTo(${JSON.stringify(sel)}, {filter:"brightness(${lvl})", scale:1.08}, {filter:"brightness(1)", scale:1, duration:0.2, ease:"power2.out", immediateRender:false}, ${t.toFixed(3)});`));
  { // zarybnění: sloupce matice
    const a = tOf('06:30') + 2.4, b = tOf('07:20'), nc = P ? 30 : 45;
    padRun((c) => `#dots i:nth-child(${nc}n+${c + 1})`, nc, a, b, 2.4, 0.18);
  }
  { // sektory: běh přes 20 dlaždic + top sektory bijí na dobu
    const m = tOf('12:00'), b = tOf('12:40');
    const SEC = D.fish_per_sector, hot = Object.keys(SEC).filter((k) => SEC[k] >= 150).map((k) => `#hcell${k}`).join(', ');
    padRun((k) => `#hcell${k + 1}`, 20, m + 2, b, 1.8, 0.24);
    padHit(hot, m + 2, b, 2, 1.5);
    beatsIn(m + 2, b).forEach((t, i) => out.push(`tl.fromTo("#hcell${(i % 20) + 1}", {scale:0.9}, {scale:1, duration:0.2, ease:"back.out(3)", immediateRender:false}, ${t.toFixed(3)});`));
    padRun((k) => `#pb${k + 1}`, 40, m + 3.5, b, 2.4, 0.18);
  }
  { // výsledky: světlo jede po kolech (sloupcích) + „horká“ kola (10+ ryb) bijí na každou 2. dobu
    const ta = DUR - TAIL + 1.8, tb = DUR - TAIL + TL.tab;
    padRun((k) => `#s-all .q:nth-child(${k + 1})`, 12, ta, tb, 2.0, 0.22);
    padHit('#s-all .q.hot', ta, tb, 2, 1.7);
  }
  { // HUD: mezi koly krokuje kurzor po 12 sloupcích
    const idle = [[0, R[0].a], ...R.slice(0, -1).map((r, k) => [r.b, R[k + 1].a]), [R[11].b, DUR - TAIL]];
    idle.forEach(([a, b]) => padRun((k) => `#hc${k}`, 12, a, b, 2.2, 0.2));
  }

  // ===== MIXÁŽNÍ PULT: přechod scén = fadery vyjedou a spadnou na takt =====
  const NW = 16;
  [...new Set(starts)].filter((t) => t > 1 && t < DUR - 1).forEach((t0) => {
    const t = G.downbeats.reduce((a, b) => (Math.abs(b - t0) < Math.abs(a - t0) ? b : a), t0) - 0.18;
    for (let i = 0; i < NW; i++) {
      const dl = Math.abs(i - (NW - 1) / 2) * 0.012;
      out.push(`tl.fromTo("#wp${i}", {scaleY:0}, {scaleY:${(0.55 + rnd(i + t0) * 0.45).toFixed(2)}, duration:0.16, ease:"power3.out", immediateRender:false}, ${(t + dl).toFixed(3)});`);
      out.push(`tl.to("#wp${i}", {scaleY:0, duration:0.22, ease:"power3.in"}, ${(t + 0.2 + dl).toFixed(3)});`);
    }
  });
  // ===== EKVALIZÉR: sloupcové grafy po dokreslení „hrají“ na doby =====
  const eq = (selFn, n, a, b, amp = 0.35) => G.beats.filter((t) => t >= a && t < b - 0.3).forEach((t, bi) => {
    for (let k = 0; k < n; k++) { const lv = 1 - amp + rnd(bi * 31 + k * 7) * amp * 1.6;
      out.push(`tl.fromTo(${JSON.stringify(selFn(k))}, {scaleY:${lv.toFixed(2)}}, {scaleY:1, duration:${(BEAT * 0.9).toFixed(3)}, ease:"power2.out", immediateRender:false}, ${t.toFixed(3)});`); } });
  eq((k) => `#hc${k}`, 12, R[11].b + 0.2, DUR - 0.5, 0.45);
  eq((k) => `#pb${k + 1}`, 40, tOf('12:00') + 4.6, tOf('12:40'), 0.5);
  eq((k) => `#cb${k} .cbar`, CTRY.length, tOf('07:20') + 2.2, tOf('07:50'), 0.3);

  // ===== GLOBAL FX pod hudbu: flash na takt, silnější každé 4 takty, pozadí a titulky pulzují =====
  G.downbeats.forEach((t, i) => { if (t < 0.3 || t > DUR - 0.3) return; const big = i % 4 === 0;
    out.push(`tl.fromTo("#flash", {opacity:${big ? 0.22 : 0.08}}, {opacity:0, duration:${big ? 0.45 : 0.25}, ease:"power2.out", immediateRender:false}, ${t.toFixed(3)});`);
    out.push(`tl.fromTo(".h2 span", {scale:${big ? 1.06 : 1.025}, x:${big ? -0.4 * u : 0}}, {scale:1, x:0, duration:0.3, ease:"power3.out", immediateRender:false}, ${t.toFixed(3)});`);
    if (big) out.push(`tl.fromTo("#stage", {scale:1.035}, {scale:1, duration:0.5, ease:"power2.out", immediateRender:false}, ${t.toFixed(3)});`); });
  G.beats.forEach((t) => { if (t < 0.3 || t > DUR - 0.3) return; out.push(`tl.fromTo("#st-rays", {opacity:.34}, {opacity:.16, duration:0.3, ease:"power2.out", immediateRender:false}, ${t.toFixed(3)});`); });
  // offbeat hi-hat: hvězdičky v HUD čísle kola
  G.beats.forEach((t, i) => { if (i % 2 || t < 0.3 || t > DUR - 0.5) return; out.push(`tl.fromTo("#kolo", {opacity:.55}, {opacity:1, duration:0.18, ease:"none", immediateRender:false}, ${(t + BEAT / 2).toFixed(3)});`); });

  // ===== HUD: hodiny + počítadlo + 12 sloupců kol (celý den) =====
  const DAYEND = DUR - TAIL, maxR = Math.max(...D.fish_per_round);
  const hud = `<section id="hud" class="clip" data-start="0" data-duration="${DUR}" data-track-index="6"><div class="hud">
      <div class="hc"><b id="clk">06:00</b><span id="kolo">prezentace</span></div>
      <div class="hn"><b id="cnt">0</b><span>ulovených ryb · fish caught</span></div>
      <div class="hr">${R.map((r, k) => `<div class="hcol${k === 8 ? ' gap' : ''}" id="hc${k}"><i id="hci${k}" style="height:${((r.fish / maxR) * 100).toFixed(1)}%"></i><em>${k + 1}</em></div>`).join('')}</div>
    </div></section>`;
  const RJS = JSON.stringify(D.schedule.rounds.map((r, i) => [+r.from.slice(0, 2) * 60 + +r.from.slice(3), +r.to.slice(0, 2) * 60 + +r.to.slice(3), D.fish_per_round[i]]));
  out.push(`{ const RR=${RJS}, o={v:0}, ck=document.getElementById("clk"), cn=document.getElementById("cnt"), ko=document.getElementById("kolo");
      const cols=RR.map((_,k)=>document.getElementById("hci"+k)), cells=RR.map((_,k)=>document.getElementById("hc"+k));
      const fishAt=(m)=>RR.reduce((s,[a,b,n])=>s+n*Math.max(0,Math.min(1,(m-a)/(b-a))),0);
      const lab=(m)=>{ for(let k=0;k<RR.length;k++){ if(m>=RR[k][0]&&m<RR[k][1]) return (k+1)+". kolo · round "+(k+1); } if(m<420) return "prezentace · check-in"; if(m<480) return "porada · briefing"; if(m>=700&&m<760) return "oběd · lunch"; if(m>=870&&m<900) return "konec · finish"; if(m>=900) return "vyhlášení · ceremony"; return "přestávka · break"; };
      const KN=${JSON.stringify(KN)}; const mOf=(t)=>{ for(let i=1;i<KN.length;i++){ if(t<=KN[i][1]){ const [m0,t0]=KN[i-1],[m1,t1]=KN[i]; return m0+(t-t0)/(t1-t0)*(m1-m0); } } return ${DAY1}; };
      tl.fromTo(o,{v:0},{v:${DAYEND},duration:${DAYEND},ease:"none",onUpdate(){ const m=mOf(o.v); const hh=Math.floor(m/60), mm=Math.floor(m%60);
        ck.textContent=String(hh).padStart(2,"0")+":"+String(mm).padStart(2,"0"); cn.textContent=Math.round(fishAt(m)).toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g,"\\u2009"); ko.textContent=lab(m);
        RR.forEach(([a,b],k)=>{ const p=Math.max(0,Math.min(1,(m-a)/(b-a))); cols[k].style.transform="scaleY("+p.toFixed(3)+")"; cells[k].classList.toggle("on", m>=a&&m<b); }); }}, 0); }`);
  // puls počítadla na každou dobu během kol
  G.beats.filter((t) => t > 0.5 && t < DUR - 0.3).forEach((t) => out.push(`tl.fromTo("#cnt", {scale:1.06}, {scale:1, duration:0.25, ease:"power2.out", immediateRender:false}, ${t.toFixed(3)});`));
  T('#hud .hud', { opacity: 0, y: (P ? -4 : 4) * u }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.2);

  // ---------- pozadí ----------
  const brush = (yc, th, seed) => { const n = 26, p1 = [], p2 = []; for (let i = 0; i <= n; i++) { const x = -10 + (120 * i) / n; p1.push(`${x.toFixed(1)},${(yc - th / 2 + (rnd(seed + i) - 0.5) * th * 0.35).toFixed(1)}`); p2.unshift(`${x.toFixed(1)},${(yc + th / 2 + (rnd(seed + 50 + i) - 0.5) * th * 0.35).toFixed(1)}`); } return p1.concat(p2).join(' '); };
  const band = `<svg class="band" viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="${brush(46, 12, 1)}" fill="#ffffff" opacity=".92"/><polygon points="${brush(58, 12, 2)}" fill="#d7141a" opacity=".95"/><polygon points="-10,38 22,52 -10,66" fill="#11457e"/></svg>`;
  const STARS = Array.from({ length: 24 }, (_, i) => ({ x: rnd(i * 3 + 1) * 100, y: rnd(i * 5 + 2) * 80 + 4, s: 0.6 + rnd(i * 7) * 1.6, p: rnd(i * 11) * 2.2 }));
  const stars = STARS.map((st, i) => `<i class="star" id="star${i}" style="left:${st.x.toFixed(1)}%; top:${st.y.toFixed(1)}%; width:${px(st.s * 1.6)}; height:${px(st.s * 1.6)}"></i>`).join('');
  STARS.forEach((st, i) => { const per = 1.6 + rnd(i * 13) * 1.4, rep = Math.floor((DUR - st.p) / per) - 1; out.push(`tl.fromTo("#star${i}", {scale:0, opacity:0}, {scale:1, opacity:1, duration:${(per / 2).toFixed(2)}, ease:"sine.inOut", repeat:${rep * 2 + 1}, yoyo:true}, ${st.p.toFixed(2)});`); });
  out.push(`tl.fromTo("#st-rays", {rotation:0}, {rotation:40, duration:${DUR}, ease:"none"}, 0);`);
  G.downbeats.forEach((t) => out.push(`tl.fromTo("#st-band", {scale:1.02}, {scale:1, duration:0.4, ease:"power2.out", immediateRender:false}, ${t.toFixed(3)});`));
  const gh = (id) => `<div id="${id}" class="ghm"><span class="gh-by">made by</span><span class="gh-gear"><img class="gh-ring" src="assets/gh/ring.png"><img class="gh-core" src="assets/gh/core.png"></span><span class="gh-by gh-c">© 2026</span></div>`;

  const html = `<!doctype html>
<html lang="cs"><head><meta charset="UTF-8" /><meta name="viewport" content="width=${W}, height=${H}" />
<title>Klonówiec 2026 – Den 1 v číslech (${P ? '9:16' : '16:9'})</title>
<script src="assets/gsap.min.js"></script>
<style>
  ${FONTS}
  :root { --blue:#304285; --red:#e31e24; --navy:#0b1e42; --ice:#eef2f9; --deep:#050d22; --gold:#ffd36b; }
  body { margin:0; background:var(--deep); color:var(--ice); font-family:'Source Sans 3', sans-serif; }
  #root { position:relative; width:100%; height:100%; overflow:hidden; background:var(--deep); }
  .clip { position:absolute; inset:0; }
  #stage { position:absolute; inset:0; overflow:hidden; }
  #st-bg { position:absolute; inset:${px(-6)}; background:radial-gradient(90% 60% at 50% 42%, #1d3a86 0%, #0b1e42 62%, #050d22 100%); }
  #st-rays { position:absolute; left:50%; top:45%; width:${px(260)}; height:${px(260)}; margin:${px(-130)} 0 0 ${px(-130)}; border-radius:50%; opacity:.18;
    background:repeating-conic-gradient(from 0deg, rgba(238,242,249,.55) 0deg 3deg, transparent 3deg 14deg); -webkit-mask-image:radial-gradient(circle, #000 0%, transparent 62%); }
  .band { position:absolute; left:${px(-10)}; width:calc(100% + ${px(20)}); top:${P ? '10%' : '0%'}; height:${P ? '70%' : '100%'}; }
  #st-band { position:absolute; inset:0; rotate:${P ? -24 : -12}deg; opacity:.32; }
  #st-dots { position:absolute; inset:0; opacity:.14; background:radial-gradient(circle, #9cc8f0 ${px(0.18)}, transparent ${px(0.24)}) 0 0 / ${px(1.6)} ${px(1.6)}; }
  .star { position:absolute; background:#fff; clip-path:polygon(50% 0, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0 50%, 40% 40%); box-shadow:0 0 ${px(1)} #fff; }
  #wipe { position:absolute; left:0; right:0; ${P ? `top:${f(SC.top)}; bottom:${f(H - SC.bot)}` : `top:0; bottom:${f(H - SC.bot)}`}; display:flex; gap:${px(0.6)}; padding:0 ${px(3)}; align-items:flex-end; pointer-events:none; z-index:6; }
  #wipe i { flex:1; height:100%; transform-origin:bottom; transform:scaleY(0); background:linear-gradient(0deg, var(--red) 0%, #304285 55%, rgba(48,66,133,.0) 100%); border-radius:${px(0.6)} ${px(0.6)} 0 0; }
  .hcol { transform-origin:bottom; } .cbar { transform-origin:left bottom; }
  #flash { position:absolute; inset:0; background:radial-gradient(70% 60% at 50% 45%, #fff 0%, rgba(255,255,255,.5) 40%, transparent 80%); opacity:0; pointer-events:none; mix-blend-mode:screen; z-index:7; }
  .h2 span { transform-origin:left center; }
  #grain { position:absolute; inset:0; background:url(assets/grain.png) 0 0 / 256px 256px; opacity:.5; mix-blend-mode:overlay; pointer-events:none; }

  /* scéna = oblast mimo HUD */
  .clip > .phw { position:absolute; left:0; right:0; top:${f(SC.top - 3 * u)}; height:${f(scH + 6 * u)}; overflow:hidden;
    -webkit-mask-image:linear-gradient(180deg, transparent 0, #000 9%, #000 86%, transparent 100%); }
  .phw .pb { position:absolute; inset:0; background-size:cover; background-position:50% 35%; }
  .phw.dim .pb { filter:brightness(.38) saturate(.8); }
  .clip > .phw.mon { top:0; height:100%; -webkit-mask-image:none; }
  .phw.dimx .pb { filter:brightness(.26) saturate(.7) blur(${px(0.35)}); }
  .phw.top .pb { background-position:50% 25%; }
  .clip > .phw.org { left:${P ? '0' : '44%'}; right:${P ? '0' : '4%'}; ${P ? `top:${f(SC.top + 16 * u)}; height:${f(scH * 0.62)};` : ''} }
  .phw.org .pb { background-size:contain; background-repeat:no-repeat; background-position:50% 30%; }
  .aer { position:absolute; inset:0; }
  .aer .phw { position:absolute; left:0; right:0; overflow:hidden; top:${f(P ? H * 0.66 : 0)}; height:${f(P ? H * 0.27 : H)}; }
  .aer .phw .pb { ${P ? '' : 'filter:brightness(.42) saturate(.9);'} }
  .h2 { position:absolute; left:${px(6)}; right:${px(6)}; top:${f(SC.top + 1 * u)}; }
  .h2.low { ${P ? '' : `top:${f(SC.top + 14 * u)}; right:58%;`} }
  .h2 span { display:inline-block; font-family:Montserrat; font-weight:900; font-size:${px(P ? 9.5 : 7.4)}; text-transform:uppercase; letter-spacing:-.01em; line-height:1.05; }
  .h2 em { display:block; font-style:normal; font-family:Montserrat; font-weight:600; font-size:${px(P ? 3.3 : 2.5)}; letter-spacing:.16em; text-transform:uppercase; color:var(--gold); margin-top:${px(0.8)}; }
  .h2, .l1, .l2, .l3, .hk, .hn, .rc-n { overflow:hidden; }

  .ttl { position:absolute; left:${px(6)}; right:${px(6)}; top:${f(P ? SC.top + 2 * u : H * 0.16)}; }
  .l1 span { display:inline-block; font-family:Montserrat; font-weight:900; font-size:${px(P ? 20 : 17)}; line-height:.98; letter-spacing:-.03em; }
  .l1.red span { color:var(--red); }
  .l2 span, .l3 span { display:inline-block; font-family:Montserrat; font-weight:800; font-size:${px(P ? 4.4 : 3)}; margin-top:${px(1.4)}; }
  .l3 span { font-weight:600; font-size:${px(P ? 3.2 : 2.2)}; letter-spacing:.08em; color:var(--gold); text-transform:uppercase; }

  .tiles { position:absolute; left:${px(6)}; right:${px(6)}; top:${f(SC.top + (P ? 22 : 18) * u)}; display:grid; grid-template-columns:${P ? '1fr' : '1fr 1fr 1fr'}; gap:${px(P ? 3 : 2.4)}; }
  .tile { background:rgba(11,30,66,.86); border-radius:${px(2)}; padding:${px(P ? 3.4 : 2.6)} ${px(3)}; border:${px(0.2)} solid rgba(238,242,249,.12); }
  .tile b { display:block; font-family:Montserrat; font-weight:900; font-size:${px(P ? 13 : 9)}; color:var(--red); line-height:1; font-variant-numeric:tabular-nums; }
  .tile b i { font-style:normal; } .tile b small { font-size:.42em; margin-left:${px(1)}; color:var(--ice); }
  .tile span { display:block; font-family:Montserrat; font-weight:600; font-size:${px(P ? 3.2 : 2.1)}; letter-spacing:.1em; text-transform:uppercase; margin-top:${px(0.8)}; }

  .cbars { position:absolute; left:${px(6)}; right:${px(P ? 6 : 40)}; top:${f(SC.top + (P ? 24 : 20) * u)}; display:flex; flex-direction:column; gap:${px(P ? 2.6 : 1.8)}; }
  .cb { display:grid; grid-template-columns:${px(P ? 12 : 8)} 1fr ${px(P ? 10 : 7)}; align-items:center; gap:${px(1.6)}; }
  .cc { font-family:Montserrat; font-weight:900; font-size:${px(P ? 5 : 3.4)}; }
  .cbar { height:${px(P ? 4.4 : 3)}; background:rgba(238,242,249,.1); border-radius:${px(1)}; overflow:hidden; }
  .cbar i { display:block; height:100%; background:linear-gradient(90deg, var(--blue), #5b7fe0); transform-origin:left; border-radius:${px(1)}; }
  .cb b { font-family:Montserrat; font-weight:900; font-size:${px(P ? 5 : 3.4)}; text-align:right; }
  .cb:first-child .cbar i { background:linear-gradient(90deg, #b5121a, var(--red)); }

  .heat { position:absolute; left:${px(6)}; right:${px(6)}; top:${f(SC.top + (P ? 20 : 16) * u)}; display:grid; grid-template-columns:repeat(${P ? 4 : 10}, 1fr); gap:${px(P ? 1.4 : 1)}; }
  .hcell { border-radius:${px(1)}; padding:${px(P ? 1.4 : 1)} ${px(0.8)} ${px(0.8)}; text-align:center; box-shadow:0 ${px(0.4)} ${px(1.4)} rgba(0,0,0,.25); }
  .pp { display:grid; grid-template-columns:1fr 1fr; gap:${px(0.4)}; margin-top:${px(0.6)}; }
  .pp span { border-radius:${px(0.5)}; font-family:Montserrat; font-weight:700; font-size:${px(P ? 1.7 : 1.25)}; padding:${px(0.3)} 0; box-shadow:inset 0 0 0 ${px(0.15)} rgba(238,242,249,.35); }
  .pp span i { display:block; font-style:normal; font-weight:900; font-size:1.25em; }
  .pstrip { position:absolute; left:${px(6)}; right:${px(6)}; bottom:${f(H - SC.bot + (P ? 14 : 11) * u)}; height:${px(P ? 9 : 7)}; display:flex; align-items:flex-end; gap:${px(0.35)}; }
  .pstrip i { flex:1; border-radius:${px(0.3)} ${px(0.3)} 0 0; transform-origin:bottom; }
  .pstrip em { position:absolute; right:0; top:${px(-3)}; font-style:normal; font-family:Montserrat; font-weight:600; font-size:${px(P ? 2.2 : 1.6)}; letter-spacing:.1em; text-transform:uppercase; opacity:.7; }
  .hcell em { display:block; font-style:normal; font-family:Montserrat; font-weight:700; font-size:${px(P ? 2.4 : 1.6)}; opacity:.7; }
  .hcell b { display:block; font-family:Montserrat; font-weight:900; font-size:${px(P ? 4.6 : 3.2)}; line-height:1.05; }
  .hnote { position:absolute; left:${px(6)}; right:${px(6)}; bottom:${f(H - SC.bot + (P ? 3 : 3.5) * u)}; font-size:${px(P ? 3.8 : 2.6)}; } .hnote b { font-family:Montserrat; font-weight:900; color:var(--gold); }
  .dots { position:absolute; ${P ? `left:${px(6)}; right:${px(6)}; bottom:${f(H - SC.bot + 2 * u)}` : `left:${px(6)}; right:${px(6)}; bottom:${f(H - SC.bot + 3 * u)}`}; display:grid; grid-template-columns:repeat(${P ? 30 : 45}, 1fr); gap:${px(P ? 0.6 : 0.7)}; }
  .dots i { display:block; aspect-ratio:1; border-radius:50%; background:radial-gradient(circle at 35% 35%, #ff8a8d, var(--red)); }
  .dots em { grid-column:1 / -1; font-style:normal; font-family:Montserrat; font-weight:600; font-size:${px(P ? 2.6 : 1.8)}; letter-spacing:.12em; text-transform:uppercase; color:var(--gold); margin-top:${px(0.8)}; }
  .race { position:absolute; left:${px(6)}; right:${px(P ? 6 : 42)}; top:${f(SC.top + (P ? 20 : 15) * u)}; }
  .race::before { content:''; position:absolute; left:${px(-2)}; right:${px(-2)}; top:${px(-1.6)}; bottom:${px(-1.6)}; background:rgba(238,242,249,.96); border-radius:${px(2)}; }
  .race .rr, .race .rn, .race .rr b { color:#0b1e42; }
  .rr { position:absolute; left:0; right:0; height:${px(P ? 4.8 : 4.1)}; display:grid; grid-template-columns:${px(P ? 27 : 21)} auto ${px(P ? 7 : 5)}; align-items:center; gap:${px(1.4)}; border-radius:${px(1)}; padding:0 ${px(1)}; }
  .rn { font-family:Montserrat; font-weight:800; font-size:${px(P ? 3.2 : 2.4)}; white-space:nowrap; }
  .rb i { display:block; height:${px(P ? 3.6 : 3)}; border-radius:0 ${px(1)} ${px(1)} 0; transform-origin:left; }
  .rr b { font-family:Montserrat; font-weight:900; font-size:${px(P ? 4 : 3)}; }
  .rk { position:absolute; right:${px(P ? 0 : -34)}; top:${P ? f(5.4 * u * 10 + 3 * u) : px(22)}; text-align:right; } .rk span { display:block; font-family:Montserrat; font-weight:900; font-size:${px(P ? 9 : 12)}; line-height:1; color:var(--red); }
  .rk em { font-style:normal; font-family:Montserrat; font-weight:600; font-size:${px(P ? 2.4 : 2)}; letter-spacing:.2em; text-transform:uppercase; }
  .slope .sl { stroke-width:${px(0.4)}; stroke-dasharray:1; stroke-dashoffset:1; fill:none; } .slope text.nm { fill:#0b1e42; font-weight:700; } .slope text.rkt { font-weight:900; }
  .sw { position:absolute; left:${px(P ? 4 : 6)}; right:${px(P ? 4 : 30)}; top:${f(SC.top + (P ? 20 : 15) * u)}; }
  .sw::before { content:''; position:absolute; left:${px(-1.6)}; right:${px(-1.6)}; top:${px(-1.4)}; bottom:${px(-1.4)}; background:rgba(238,242,249,.96); border-radius:${px(2)}; }
  .swr { position:absolute; left:0; right:0; height:${px(P ? 5 : 3.9)}; display:grid; grid-template-columns:${px(P ? 6 : 4.5)} ${px(P ? 20 : 15)} 1fr ${px(P ? 10 : 7)} ${px(P ? 8 : 6)} ${px(P ? 6 : 4.5)}; align-items:center; gap:${px(1)}; padding:0 ${px(1)}; border-radius:${px(0.8)}; color:#0b1e42; font-family:Montserrat; }
  .swr.cz { background:rgba(227,30,36,.08); }
  .swk { position:relative; height:100%; } .swk i { position:absolute; inset:0; display:flex; align-items:center; font-style:normal; font-weight:900; font-size:${px(P ? 3 : 2.3)}; }
  .swk i:first-child { color:#8ea2d8; } .swk i:last-child { color:var(--red); opacity:0; }
  .swn { font-weight:800; font-size:${px(P ? 2.5 : 2)}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .sws { display:grid; grid-template-columns:repeat(12, ${px(P ? 2.6 : 2.3)}); gap:${px(P ? 0.3 : 0.5)}; justify-content:center; } .sws .q { width:100%; aspect-ratio:1; border-radius:${px(0.3)}; }
  .swf, .swp { font-size:${px(P ? 2.2 : 1.6)}; text-align:right; white-space:nowrap; } .swf b, .swp b { font-weight:900; font-size:1.3em; } .swp b { color:#304285; }
  .swd { font-weight:900; font-size:${px(P ? 2.3 : 1.7)}; text-align:center; color:#304285; opacity:0; }
  .sw-h { font-weight:600; transition:none; } .sw-h + .sw-h { margin-left:${px(1.2)}; color:var(--ice); }
  .bump { position:absolute; left:${px(P ? 4 : 6)}; top:${f(SC.top + (P ? 20 : 15) * u)}; }
  .bump::before { content:''; position:absolute; inset:${px(-1.6)}; background:rgba(238,242,249,.96); border-radius:${px(2.2)}; box-shadow:0 ${px(1)} ${px(4)} rgba(0,0,0,.35); }
  .bump svg { position:absolute; inset:0; width:100%; height:100%; overflow:visible; } .bump .rb { fill:none; stroke-linecap:round; stroke-dasharray:1; stroke-dashoffset:1; }
  .bhd { position:absolute; top:${px(1)}; font-family:Montserrat; font-weight:700; font-size:${px(P ? 2.2 : 1.6)}; letter-spacing:.14em; text-transform:uppercase; color:#8ea2d8; text-align:center; }
  .bl { position:absolute; left:0; transform:translateY(-50%); display:flex; justify-content:space-between; align-items:center; gap:${px(1)}; font-family:Montserrat; color:#0b1e42; padding:0 ${px(1)}; }
  .bl .bn { font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; } .bl b { font-weight:900; background:#dfe5f1; border-radius:${px(1)}; padding:${px(0.2)} ${px(0.9)}; }
  .br { position:absolute; transform:translateY(-50%); display:flex; align-items:center; gap:${px(1)}; font-family:Montserrat; color:#0b1e42; transform-origin:left center; }
  .br b { font-weight:900; color:#fff; background:#304285; border-radius:${px(1)}; padding:${px(0.2)} ${px(0.9)}; min-width:${px(P ? 4.6 : 3.4)}; text-align:center; } .br span { font-weight:700; opacity:.75; }
  .snote { position:absolute; left:${px(6)}; right:${px(6)}; bottom:${f(H - SC.bot + 3 * u)}; font-size:${px(P ? 3.6 : 2.6)}; } .snote b { font-family:Montserrat; font-weight:900; color:var(--gold); }
  .allw { position:absolute; left:${px(5)}; right:${px(5)}; top:${f(SC.top + (P ? 22 : 16) * u)}; bottom:${f(H - SC.bot + 1 * u)}; overflow:hidden; ${P ? '-webkit-mask-image:linear-gradient(180deg, #000 85%, transparent 100%);' : ''} }
  .allw { background:rgba(238,242,249,.96); color:#0b1e42; border-radius:${px(1.6)}; padding:${px(0.8)} ${px(1.6)}; }
  .allc { display:grid; grid-template-columns:${P ? '1fr' : '1fr 1fr'}; gap:0 ${px(3)}; }
  .ar { display:grid; grid-template-columns:${px(P ? 4.4 : 3)} ${px(P ? 22 : 15)} 1fr ${px(P ? 5 : 3.4)} ${px(P ? 5 : 3.4)}; align-items:center; gap:${px(1)}; height:${px(P ? 4.15 : 3.0)}; border-bottom:${px(0.1)} solid rgba(238,242,249,.08); font-family:Montserrat; }
  .ap { font-weight:900; font-size:${px(P ? 2.4 : 1.8)}; color:#304285; text-align:right; } .an { font-weight:700; font-size:${px(P ? 2.4 : 1.8)}; white-space:nowrap; overflow:hidden; } .an i { font-style:normal; font-weight:600; opacity:.55; margin-left:${px(0.8)}; font-size:.8em; }
  .qs { display:grid; grid-template-columns:repeat(12, 1fr); gap:${px(0.35)}; }
  .q { display:flex; align-items:center; justify-content:center; aspect-ratio:1; max-height:${px(P ? 3.6 : 2.6)}; border-radius:${px(0.5)}; font-style:normal; font-weight:800; font-size:${px(P ? 1.75 : 1.3)}; color:#06142e; }
  .q.hot { box-shadow:inset 0 0 0 ${px(0.18)} rgba(255,255,255,.55); }
  .q.p3 { background:#304285; color:#eef2f9; } .q.p2 { background:#8ea2d8; color:#0b1e42; } .q.p1 { background:#dfe5f1; color:#0b1e42; } .q.p0 { background:#e31e24; color:#fff; }
  .qleg { position:absolute; left:${px(6)}; right:${px(6)}; top:${f(SC.top + (P ? 15.5 : 12.4) * u)}; display:flex; gap:${px(3)}; font-family:Montserrat; font-weight:600; font-size:${px(P ? 2.2 : 1.6)}; letter-spacing:.06em; text-transform:uppercase; }
  .qleg span { display:flex; align-items:center; gap:${px(0.8)}; } .qleg .q { width:${px(P ? 2.6 : 1.9)}; height:${px(P ? 2.6 : 1.9)}; }
  .af { font-weight:800; font-size:${px(P ? 2.4 : 1.8)}; text-align:right; color:#304285; }
  .ar b { font-weight:900; font-size:${px(P ? 2.8 : 2)}; text-align:right; }
  .ar:nth-child(-n+3) .ap { color:var(--red); }
  .tag { position:absolute; left:${px(6)}; bottom:${f(H - SC.bot + 4 * u)}; display:flex; align-items:baseline; gap:${px(2)}; }
  .tag b { font-family:Montserrat; font-weight:900; font-size:${px(P ? 12 : 8)}; } .tag span { font-family:Montserrat; font-weight:600; font-size:${px(P ? 3.6 : 2.4)}; letter-spacing:.12em; text-transform:uppercase; color:var(--gold); }

  .rc { position:absolute; left:${px(6)}; bottom:${f(H - SC.bot + (P ? 5 : 3) * u)}; width:${px(P ? 74 : 44)}; background:rgba(5,13,34,.82); backdrop-filter:blur(${px(1.2)});
    border-left:${px(0.9)} solid var(--red); border-radius:${px(1.6)}; padding:${px(2.4)} ${px(3)}; opacity:0; }
  .rc-n span { display:inline-block; font-family:Montserrat; font-weight:800; font-size:${px(P ? 3.6 : 2.4)}; letter-spacing:.14em; text-transform:uppercase; color:var(--gold); }
  .rc-f { display:flex; align-items:baseline; gap:${px(1.6)}; margin-top:${px(0.6)}; }
  .rc-f b { font-family:Montserrat; font-weight:900; font-size:${px(P ? 12 : 8)}; line-height:1; } .rc-f span { font-family:Montserrat; font-weight:600; font-size:${px(P ? 3.4 : 2.3)}; }
  .rc-b { font-size:${px(P ? 3.4 : 2.3)}; margin-top:${px(0.8)}; opacity:.92; } .rc-b b { font-weight:600; color:var(--gold); }
  .plate { position:absolute; right:${px(6)}; top:${f(SC.top + 3 * u)}; text-align:right; }
  .plate b { display:block; font-family:Montserrat; font-weight:900; font-size:${px(P ? 7 : 4.6)}; } .plate i { font-style:normal; font-weight:600; font-size:${px(P ? 3.2 : 2.2)}; color:var(--gold); letter-spacing:.06em; }

  .menu { position:absolute; left:${px(6)}; right:${px(6)}; top:${f(SC.top + (P ? 22 : 18) * u)}; display:flex; flex-direction:column; gap:${px(1.6)}; }
  .mi { font-family:Montserrat; font-weight:800; font-size:${px(P ? 6 : 4)}; } .mi b { color:var(--red); }
  .thx { position:absolute; left:${px(6)}; right:${px(6)}; bottom:${f(H - SC.bot + 4 * u)}; background:rgba(5,13,34,.85); border-radius:${px(2)}; padding:${px(3)} ${px(3.4)}; border-left:${px(0.9)} solid var(--gold); }
  .thx span { display:block; font-family:Montserrat; font-weight:900; font-size:${px(P ? 9 : 6)}; line-height:1; }
  .thx em { display:block; font-style:normal; font-weight:600; font-size:${px(P ? 3.6 : 2.5)}; margin-top:${px(1.2)}; line-height:1.3; }

  .lb { position:absolute; left:${px(6)}; right:${px(6)}; top:${f(SC.top + (P ? 20 : 16) * u)}; display:flex; flex-direction:column; gap:${px(P ? 2 : 1.4)}; }
  .lr, .t5r { display:grid; grid-template-columns:${px(P ? 6 : 4)} ${px(P ? 40 : 30)} 1fr ${px(P ? 8 : 6)}; align-items:center; gap:${px(1.6)}; font-family:Montserrat; }
  .lp { font-weight:900; font-size:${px(P ? 4.4 : 3)}; color:var(--gold); } .ln { font-weight:800; font-size:${px(P ? 3.8 : 2.6)}; white-space:nowrap; }
  .lbar { height:${px(P ? 3.6 : 2.4)}; background:rgba(238,242,249,.1); border-radius:${px(1)}; overflow:hidden; } .lbar i { display:block; height:100%; background:linear-gradient(90deg, var(--blue), #6d8ff0); transform-origin:left; }
  .lr:first-child .lbar i { background:linear-gradient(90deg, #b5121a, var(--red)); }
  .lr b, .t5r b { font-weight:900; font-size:${px(P ? 4.4 : 3)}; text-align:right; }

  .chart { position:absolute; left:${px(P ? 4 : 5)}; top:${f(SC.top + (P ? 22 : 16) * u)}; }
  .chart.panel { background:rgba(238,242,249,.96); border-radius:${px(2)}; border:${px(0.2)} solid rgba(238,242,249,.1); }
  .chart svg { position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
  .chart line { stroke:rgba(11,30,66,.14); stroke-width:${px(0.15)}; } .chart text { fill:rgba(11,30,66,.6); font-family:Montserrat; font-weight:600; } .chart text.ax { fill:var(--red); }
  .chart polyline { fill:none; stroke-linejoin:round; stroke-linecap:round; stroke-dasharray:1; stroke-dashoffset:1; }
  .le { position:absolute; display:flex; align-items:center; gap:${px(0.8)}; font-family:Montserrat; font-weight:700; white-space:nowrap; }
  .le i { width:${px(1.4)}; height:${px(1.4)}; border-radius:50%; } .le b { color:var(--gold); }
  .rmini { position:absolute; ${P ? `left:${px(6)}; bottom:${f(H - SC.bot + 3 * u)}` : `right:${px(5)}; top:${f(SC.top + 16 * u)}`}; width:${px(P ? 74 : 36)}; height:${px(P ? 20 : 16)}; }
  .rmini .rc { left:0; bottom:auto; padding:${px(1.6)} ${px(2.4)}; }
  .sc circle { fill:rgba(156,200,240,.75); } .sc circle.hl { fill:var(--red); stroke:#fff; stroke-width:${px(0.25)}; }
  .dl { position:absolute; transform:translate(${px(1.6)}, -50%); } .dl.l { transform:translate(calc(-100% - ${px(1.6)}), -50%); } .dl span { display:inline-block; font-family:Montserrat; font-weight:800; background:rgba(5,13,34,.85); padding:${px(0.4)} ${px(1)}; border-radius:${px(0.6)}; white-space:nowrap; }

  .t5 { position:absolute; left:${px(6)}; right:${P ? px(6) : '52%'}; bottom:${f(H - SC.bot + 3 * u)}; display:flex; flex-direction:column; gap:${px(1)}; }
  .t5r { grid-template-columns:${px(P ? 6 : 4)} 1fr ${px(P ? 16 : 11)} ${px(P ? 12 : 8)}; white-space:nowrap; background:rgba(5,13,34,.84); border-radius:${px(1.2)}; padding:${px(1.2)} ${px(2)}; }
  .tf { font-weight:600; font-size:${px(P ? 3.2 : 2.2)}; color:var(--gold); text-align:right; }

  .orgn { position:absolute; left:${px(6)}; ${P ? `right:${px(6)}; bottom:${f(H - SC.bot + 3 * u)}` : `right:58%; top:${f(SC.top + 36 * u)}; flex-direction:column`}; display:flex; flex-wrap:wrap; justify-content:${P ? 'center' : 'flex-start'}; gap:${px(1)} ${px(3)}; font-family:Montserrat; font-weight:800; font-size:${px(P ? 3.8 : 3.4)}; }
  .kp { display:inline-flex; align-items:center; gap:${px(2)}; margin-top:${px(P ? 5 : 3)}; background:rgba(238,242,249,.96); color:#0b1e42; border-radius:${px(2)}; padding:${px(1.4)} ${px(2.6)} ${px(1.4)} ${px(1.4)}; text-align:left; }
  .kp img { width:${px(P ? 13 : 9)}; height:${px(P ? 13 : 9)}; border-radius:50%; }
  .kp b { display:block; font-family:Montserrat; font-weight:800; font-size:${px(P ? 3 : 2.2)}; } .kp span { display:block; font-size:${px(P ? 2.4 : 1.7)}; margin-top:${px(0.4)}; opacity:.85; }
  .host { position:absolute; left:${px(6)}; right:${px(6)}; top:${f(SC.top + scH * (P ? 0.22 : 0.18))}; text-align:center; }
  .hk span { display:inline-block; font-family:Montserrat; font-weight:600; font-size:${px(P ? 4.4 : 3)}; letter-spacing:.24em; text-transform:uppercase; color:var(--gold); }
  .hn span { display:inline-block; font-family:Montserrat; font-weight:900; font-size:${px(P ? 13 : 9)}; letter-spacing:-.02em; line-height:1.05; }
  .hs { font-size:${px(P ? 3.6 : 2.5)}; margin-top:${px(1.6)}; }
  .fin { position:absolute; left:${px(6)}; right:${px(6)}; top:${f(SC.top + scH * 0.12)}; display:flex; flex-direction:column; align-items:center; gap:${px(3)}; text-align:center; }
  .fv b { display:block; font-family:Montserrat; font-weight:900; font-size:${px(P ? 18 : 12)}; color:var(--red); line-height:1; } .fv span { font-family:Montserrat; font-weight:700; font-size:${px(P ? 3.8 : 2.6)}; letter-spacing:.1em; text-transform:uppercase; }
  .tap { display:inline-block; background:#fff; border-radius:${px(1.6)}; padding:${px(1)} ${px(2)}; margin-bottom:${px(2)}; box-shadow:0 ${px(0.6)} ${px(2)} rgba(0,0,0,.35); }
  .tap img { display:block; height:${px(P ? 9 : 7)}; width:auto; }
  .tap.big img { height:${px(P ? 14 : 12)}; }
  .ta { width:${px(P ? 60 : 34)}; height:auto; } .fz span { font-family:Montserrat; font-weight:700; font-size:${px(P ? 3.4 : 2.3)}; letter-spacing:.16em; text-transform:uppercase; color:var(--gold); }

  /* HUD */
  .hud { position:absolute; left:${px(5)}; right:${px(5)}; ${P ? `top:${px(4)}` : `bottom:${px(2.6)}`}; height:${f(HUD_H - (P ? 6 : 4.2) * u)}; display:grid;
    grid-template-columns:${P ? '1fr 1fr' : `${px(24)} ${px(40)} 1fr`}; grid-template-rows:${P ? 'auto 1fr' : '1fr'}; gap:${px(P ? 1.6 : 2)} ${px(3)}; align-items:${P ? 'start' : 'center'};
    background:rgba(5,13,34,.78); border-radius:${px(2)}; padding:${px(P ? 2.6 : 1.6)} ${px(3)}; border:${px(0.2)} solid rgba(238,242,249,.12); }
  .hc b { display:block; font-family:Montserrat; font-weight:900; font-size:${px(P ? 9 : 5.6)}; line-height:1; font-variant-numeric:tabular-nums; }
  .hc span { display:block; font-family:Montserrat; font-weight:700; font-size:${px(P ? 2.6 : 1.7)}; letter-spacing:.1em; text-transform:uppercase; color:var(--gold); margin-top:${px(0.6)}; white-space:nowrap; }
  .hud .hn { text-align:right; } .hud .hn b { display:inline-block; font-family:Montserrat; font-weight:900; font-size:${px(P ? 11 : 7)}; line-height:1; color:var(--red); font-variant-numeric:tabular-nums; transform-origin:right center; }
  .hud .hn span { display:block; font-family:Montserrat; font-weight:600; font-size:${px(P ? 2.3 : 1.6)}; letter-spacing:.1em; text-transform:uppercase; margin-top:${px(0.6)}; }
  .hr { ${P ? 'grid-column:1 / span 2;' : 'grid-column:3; grid-row:1;'} display:flex; align-items:flex-end; gap:${px(P ? 1 : 0.8)}; height:100%; }
  .hcol { position:relative; flex:1; height:100%; display:flex; flex-direction:column; justify-content:flex-end; }
  .hcol.gap { margin-left:${px(P ? 2.4 : 2)}; }
  .hcol i { display:block; width:100%; background:linear-gradient(180deg, #6d8ff0, var(--blue)); border-radius:${px(0.5)} ${px(0.5)} 0 0; transform-origin:bottom; transform:scaleY(0); }
  .hcol em { position:absolute; left:0; right:0; bottom:${px(-2.4)}; text-align:center; font-style:normal; font-family:Montserrat; font-weight:700; font-size:${px(P ? 1.8 : 1.3)}; opacity:.6; }
  .hcol.on i { background:linear-gradient(180deg, #ff6b6f, var(--red)); box-shadow:0 0 ${px(1.4)} rgba(227,30,36,.8); } .hcol.on em { opacity:1; color:var(--gold); }
  .hr { padding-bottom:${px(2.6)}; }

  .ghm { position:absolute; left:${P ? f(W * 0.05) : f(W * 0.03)}; ${P ? `bottom:${f(H * 0.018)}` : `top:${f(H * 0.03)}`}; display:flex; align-items:center; gap:${px(P ? 0.9 : 0.7)}; opacity:0; z-index:9; }
  .ghm .gh-gear { position:relative; width:${px(P ? 3.2 : 2.2)}; height:${px(P ? 3.2 : 2.2)}; } .ghm .gh-gear img { position:absolute; inset:0; width:100%; height:100%; }
  .ghm .gh-by { font-family:'Source Sans 3'; font-weight:600; font-size:${px(P ? 1.35 : 0.95)}; letter-spacing:.22em; text-transform:uppercase; color:var(--ice); opacity:.85; }
  .ghm .gh-c { letter-spacing:.12em; }
  ${process.env.FINAL ? '' : `#badge { position:absolute; right:${px(3)}; ${P ? `bottom:${px(2)}` : `top:${px(2)}`}; font-family:Montserrat; font-weight:600; font-size:${px(1.8)}; letter-spacing:.2em; opacity:.4; z-index:9; }`}

  /* ===== jednotný styl karet podle banerů TA CZ ===== */
  .tile, .rc, .thx, .menu, .cbars, .t5r, .orgn span, .tag, .plate, .hnote, .snote { --card:rgba(238,242,249,.96); }
  .tile { background:var(--card); border:none; box-shadow:0 ${px(0.8)} ${px(3)} rgba(0,0,0,.3); }
  .tile b { color:var(--red); } .tile b small { color:#0b1e42; } .tile span { color:#304285; }
  .rc { background:var(--card); backdrop-filter:none; color:#0b1e42; border-left-color:var(--red); box-shadow:0 ${px(0.8)} ${px(3)} rgba(0,0,0,.3); }
  .rc-n span { color:var(--red); } .rc-f b { color:#0b1e42; } .rc-f span { color:#304285; } .rc-b { color:#0b1e42; } .rc-b b { color:#304285; font-weight:800; }
  .thx { background:var(--card); border-left-color:var(--red); color:#0b1e42; box-shadow:0 ${px(0.8)} ${px(3)} rgba(0,0,0,.3); } .thx span { color:#0b1e42; } .thx em { color:#304285; }
  .menu { right:auto; background:var(--card); border-radius:${px(2)}; padding:${px(2)} ${px(3)}; box-shadow:0 ${px(0.8)} ${px(3)} rgba(0,0,0,.3); } .mi { color:#0b1e42; } .mi b { color:var(--red); }
  .cbars { background:var(--card); border-radius:${px(2)}; padding:${px(2.4)} ${px(3)}; box-shadow:0 ${px(0.8)} ${px(3)} rgba(0,0,0,.3); }
  .cc, .cb b { color:#0b1e42; } .cbar { background:rgba(11,30,66,.1); } .cbar i { background:#304285; } .cb:first-child .cbar i { background:var(--red); }
  .t5r { background:var(--card); color:#0b1e42; box-shadow:0 ${px(0.5)} ${px(2)} rgba(0,0,0,.25); } .t5r .lp { color:var(--red); } .t5r .tf { color:#304285; } .t5r b { color:#0b1e42; }
  .orgn span { background:var(--card); color:#0b1e42; border-radius:${px(1)}; padding:${px(0.6)} ${px(1.6)}; }
  .hnote, .snote { text-shadow:0 ${px(0.3)} ${px(1.4)} rgba(0,0,0,.8); } .hnote b, .snote b { color:#fff; background:var(--red); padding:0 ${px(0.8)}; border-radius:${px(0.5)}; text-shadow:none; }
  .dots i { background:radial-gradient(circle at 35% 35%, #ff7a7e, var(--red)); }
  .orgn { align-items:${P ? 'center' : 'flex-start'}; gap:${px(1)}; } .thx { ${P ? '' : 'right:auto; max-width:56%;'} }
  .clip > .phw.pod { ${P ? `top:${f(SC.top)}; height:${f(scH * 0.56)};` : 'left:36%;'} -webkit-mask-image:linear-gradient(180deg, #000 85%, transparent 100%); }
  .phw.pod .pb { background-position:50% 30%; }
  .t5 { ${P ? '' : 'right:66%;'} }
  .plate { background:rgba(238,242,249,.96); border-radius:${px(1.6)}; padding:${px(1.2)} ${px(2.2)}; box-shadow:0 ${px(0.8)} ${px(3)} rgba(0,0,0,.3); } .plate b { color:#0b1e42; } .plate i { color:var(--red); }
</style></head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="${W}" data-height="${H}">
  <div id="stage"><div id="st-bg"></div><div id="st-rays"></div><div id="st-band">${band}</div><div id="st-dots"></div>${stars}</div>
  ${scenes.join('\n  ')}
  ${hud}
  <section id="ghs" class="clip" data-start="0" data-duration="${DUR}" data-track-index="8">${gh('gh-intro')}${gh('gh-end')}</section>
  ${HAS_TRACK ? `<audio id="music" class="clip" data-start="0" data-duration="${DUR}" data-track-index="0" src="assets/track.wav" data-volume="1"></audio>` : ''}
  <div id="wipe">${Array.from({ length: NW }, (_, i) => `<i id="wp${i}"></i>`).join('')}</div>
  <div id="flash"></div>
  <div id="grain"></div>
  ${process.env.FINAL ? '' : `<div id="badge">DRAFT · ${VER}${HAS_TRACK ? '' : ' · 130 BPM placeholder'}</div>`}
</div>
<script>
  window.__timelines = window.__timelines || {};
  const tl = gsap.timeline({ paused: true });
  ${out.join('\n  ')}
  tl.set({}, {}, ${DUR});
  window.__timelines["main"] = tl;
</script>
</body></html>`;
  fs.writeFileSync(path.join(PROTO, file), html);
  console.log(file, 'DUR', DUR, 'tweens', out.length, 'track', HAS_TRACK);
}

build(1080, 1920, '9x16/index.html');
build(1920, 1080, '16x9/index.html');
