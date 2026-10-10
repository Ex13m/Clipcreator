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
const VER = process.env.VER || 'v1';

// ---------- čas: track nebo syntetická mřížka ----------
const BEATS_F = path.join(ROOT, '03_MUSIC/track.beats.json');
const HAS_TRACK = fs.existsSync(BEATS_F) && fs.existsSync(path.join(PROTO, 'assets/track.wav'));
const G = HAS_TRACK ? JSON.parse(fs.readFileSync(BEATS_F, 'utf8')) : (() => {
  const bpm = 128, b = 60 / bpm, dur = 150, beats = [], downbeats = [];
  for (let t = 0, i = 0; t < dur; t += b, i++) { beats.push(+t.toFixed(4)); if (i % 4 === 0) downbeats.push(+t.toFixed(4)); }
  return { beats, downbeats, duration: dur };
})();
const DUR = +G.duration.toFixed(2);
const TAIL = 16;                     // po 15:30: organizátoři, David, outro
const DAY0 = 6 * 60, DAY1 = 15 * 60 + 30;
const tOf = (hhmm) => { const m = typeof hhmm === 'number' ? hhmm : +hhmm.slice(0, 2) * 60 + +hhmm.slice(3); return +(((m - DAY0) / (DAY1 - DAY0)) * (DUR - TAIL)).toFixed(3); };
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
const LEAD = [...A].sort((x, y) => x.rank - y.rank).slice(0, 8);
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
  const scene = (id, a, b, html, track = 2) => scenes.push(`<section id="${id}" class="clip" data-start="${a.toFixed(3)}" data-duration="${len(a, b)}" data-track-index="${track}">${html}</section>`);
  const rise = (sel, t, d = 0.5) => T(sel, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: d, ease: 'expo.out' }, t);
  const fade = (sel, t, d = 0.4) => T(sel, { opacity: 0, y: 2 * u }, { opacity: 1, y: 0, duration: d, ease: 'power3.out' }, t);
  // fotka s pomalým zoomem + pulsem na dobách
  let phN = 0;
  const photo = (img, a, b, cls = '') => {
    const k = phN++, zin = k % 2 === 0, id = `ph${k}`;
    T(`#${id}`, { scale: zin ? 1.0 : 1.12, xPercent: zin ? -1.5 : 1.5 }, { scale: zin ? 1.12 : 1.0, xPercent: zin ? 1.5 : -1.5, duration: len(a, b), ease: 'sine.inOut' }, a);
    T(`#${id}`, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out', immediateRender: false }, a);
    G.downbeats.filter((t) => t > a + 0.1 && t < b - 0.2).forEach((t) => out.push(`tl.fromTo("#${id} .pb", {scale:1.025}, {scale:1, duration:0.35, ease:"power2.out", immediateRender:false}, ${t.toFixed(3)});`));
    return `<div class="phw ${cls}" id="${id}"><div class="pb" style="background-image:url(assets/photos/${img}.jpg)"></div></div>`;
  };

  // ===== 1) intro 06:00–06:40 =====
  {
    const a = 0, b = tOf('06:40');
    scene('s-intro', a, b, `
      <div class="aer">${photo('aerial', a, b)}</div>
      <div class="ttl"><div class="l1"><span>OPĚT</span></div><div class="l1 red"><span>POLSKO</span></div>
        <div class="l2"><span>Klonowiec Trout Area Cup · podzim 2026</span></div><div class="l3"><span>Den 1 · sobota 10. 10. 2026 · Łowisko Klonówiec</span></div><div class="l3 w"><span>${D.weather.min}–${D.weather.max} °C · déšť ${D.weather.rain_pct} % · vítr ${D.weather.wind_ms} m/s</span></div></div>`);
    rise('#s-intro .l1:nth-child(1) span', a + 0.3, 0.6); rise('#s-intro .l1:nth-child(2) span', a + 0.3 + BEAT * 2, 0.6);
    fade('#s-intro .l2 span', a + BEAT * 5); fade('#s-intro .l3 span', a + BEAT * 6); fade('#s-intro .l3.w span', a + BEAT * 8);
  }
  // ===== 2) zarybnění 06:40–07:20 =====
  {
    const a = tOf('06:40'), b = tOf('07:20');
    const tiles = [[480, 'kg', 'pstruhů v revíru'], [2700, '', 'ryb · Ø 180 g'], [100, 'kg', 'navíc před každým dnem']];
    scene('s-stock', a, b, `<div class="h2"><span>Zarybnění</span><em>Stocking</em></div>
      <div class="tiles">${tiles.map(([v, un, l], i) => `<div class="tile" id="tl${i}"><b><i id="tv${i}">0</i>${un ? `<small>${un}</small>` : ''}</b><span>${i === 1 ? '≈ ' : ''}${l}</span></div>`).join('')}</div>`);
    rise('#s-stock .h2 span', a + 0.1); fade('#s-stock .h2 em', a + 0.3);
    tiles.forEach(([v], i) => {
      const t = a + 0.5 + i * BEAT * 2;
      T(`#tl${i}`, { opacity: 0, y: 4 * u, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.6)' }, t);
      out.push(`{ const o={v:0}, el=document.getElementById("tv${i}"); tl.fromTo(o,{v:0},{v:${v},duration:1.4,ease:"power2.out",onUpdate(){el.textContent=(${i === 2} ? "+" : "")+Math.round(o.v).toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g,"\\u2009");}}, ${(t + 0.1).toFixed(3)}); }`);
    });
    T('#tl0', { boxShadow: '0 0 0 0 rgba(227,30,36,0)' }, { boxShadow: `0 0 0 ${px(0.6)} rgba(227,30,36,.9)`, duration: 0.3, yoyo: true, repeat: 3, ease: 'sine.inOut' }, a + 2.4);
  }
  // ===== 3) startovka 07:20–07:50 =====
  {
    const a = tOf('07:20'), b = tOf('07:50');
    const max = CTRY[0][1];
    scene('s-field', a, b, `${photo('d1_05', a, b, 'dim')}
      <div class="h2"><span>${A.length} závodníků</span><em>${CTRY.length} země · 40 anglers</em></div>
      <div class="cbars">${CTRY.map(([c, n], i) => `<div class="cb" id="cb${i}"><span class="cc">${c}</span><span class="cbar"><i id="cbi${i}" style="width:${((n / max) * 100).toFixed(1)}%"></i></span><b>${n}</b></div>`).join('')}</div>`);
    rise('#s-field .h2 span', a + 0.2); fade('#s-field .h2 em', a + 0.4);
    CTRY.forEach((_, i) => { fade(`#cb${i}`, a + 0.8 + i * BEAT); T(`#cbi${i}`, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power3.out' }, a + 0.9 + i * BEAT); });
  }
  // ===== 4) porada 07:50–08:00 =====
  {
    const a = tOf('07:50'), b = tOf('08:00');
    scene('s-brief', a, b, `${photo('d1_12', a, b)}<div class="tag"><b>7:30</b><span>porada · briefing</span></div>`);
    fade('#s-brief .tag', a + 0.2);
  }
  // ===== 5) kola 1–8: fotky + callout po každém kole =====
  const RPH = ['d1_10', 'd1_08', 'd1_09', 'd1_11', 'd1_06', 'd1_07', 'd1_03', 'd1_04'];
  const roundCard = (k) => {
    const best = bestOfRound(k);
    return `<div class="rc" id="rc${k}"><div class="rc-n"><span>${k + 1}. kolo</span></div><div class="rc-f"><b>${R[k].fish}</b><span>ryb · ${(R[k].fish / ((tOf(R[k].to) - tOf(R[k].from)) || 1) * 0 + D.fish_rate_per_min[k]).toFixed(1).replace('.', ',')} / min</span></div>
      <div class="rc-b">Nejvíc: <b>${name(best)}</b> ${best.rounds[k].fish} ryb</div></div>`;
  };
  for (let k = 0; k < 8; k++) {
    const a = k === 0 ? tOf('08:00') : R[k - 1].b, b = R[k].b + (k === 7 ? 0 : 0);
    const end = k === 7 ? tOf('11:40') : R[k].b;
    const extra = k === 5 ? `<div class="plate"><b>Vít Bardon</b><i>6. místo · 75 ryb · 16 ryb v 5. kole</i></div>` : '';
    scene(`s-r${k}`, a, end, `${photo(RPH[k], a, end)}${extra}${roundCard(k)}`);
    // karta kola vyjede v polovině kola a drží do konce úseku
    const tc = Math.min(R[k].a + (R[k].b - R[k].a) * 0.35, end - 1.2);
    T(`#rc${k}`, { opacity: 0, x: -5 * u }, { opacity: 1, x: 0, duration: 0.45, ease: 'expo.out' }, tc);
    rise(`#rc${k} .rc-n span`, tc + 0.05);
    if (extra) fade(`#s-r${k} .plate`, a + 0.4);
  }
  // ===== 6) oběd 11:40–12:40: menu + díky Davide + průběžné pořadí =====
  {
    const a = tOf('11:40'), m = tOf('12:10'), b = tOf('12:40');
    scene('s-lunch', a, m, `${photo('d1_01', a, m, 'dim')}
      <div class="h2"><span>Oběd</span><em>11:40 · lunch</em></div>
      <div class="menu"><div class="mi" id="mi0"><b>1.</b> Polévka</div><div class="mi" id="mi1"><b>2.</b> Kotleta, brambory, salát</div></div>
      <div class="thx" id="thx"><span>Díky, Davide!</span><em>David Helman — zase vřelé přivítání, dobré jídlo a revír plný ryb.</em></div>`);
    rise('#s-lunch .h2 span', a + 0.1); fade('#s-lunch .h2 em', a + 0.3); fade('#mi0', a + 0.8); fade('#mi1', a + 0.8 + BEAT);
    T('#thx', { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }, a + 2.4);
    T('#thx span', { color: '#eef2f9' }, { color: '#ffd36b', duration: 0.25, yoyo: true, repeat: 3 }, a + 3.2);
    const SEC = D.fish_per_sector, smax = Math.max(...Object.values(SEC)), smin = Math.min(...Object.values(SEC));
    const heat = (v) => { const t = (v - smin) / (smax - smin); return `hsl(${(8 + t * 110).toFixed(0)} 72% ${(52 + t * 4).toFixed(0)}%)`; };
    const order = P ? Array.from({ length: 20 }, (_, i) => i + 1) : [...Array.from({ length: 10 }, (_, i) => 11 + i), ...Array.from({ length: 10 }, (_, i) => 10 - i)];
    scene('s-mid', m, b, `<div class="h2"><span>Sektory</span><em>fish per sector · 20 míst u vody</em></div>
      <div class="heat">${order.map((n) => `<div class="hcell" id="hcell${n}" style="background:${heat(SEC[n])}"><em>${n}</em><b>${SEC[n]}</b></div>`).join('')}</div>
      <div class="hnote" id="hnote"><b>Sektor 1: ${SEC[1]} ryb</b> — 4× víc než sektor 17 (${SEC[17]})</div>`);
    rise('#s-mid .h2 span', m + 0.1); fade('#s-mid .h2 em', m + 0.3);
    order.forEach((n, i) => T(`#hcell${n}`, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' }, m + 0.6 + i * 0.07));
    fade('#hnote', m + 2.4);
    T('#hcell1', { boxShadow: '0 0 0 0 rgba(255,211,107,0)' }, { boxShadow: `0 0 0 ${px(0.7)} rgba(255,211,107,1)`, duration: 0.3, yoyo: true, repeat: 5, ease: 'sine.inOut' }, m + 2.5);
  }
  // ===== 7) kola 9–12: cesta lídrů (čáry rostou po kolech) =====
  {
    const a = tOf('12:40'), b = tOf('14:30');
    const CW = P ? 88 * u : W * 0.62, CH = P ? 52 * u : scH * 0.7, pl = 5 * u, pr = 2 * u, pt = 2 * u, pb = 5 * u, maxP = 35;
    const xs = (k) => pl + (k / 11) * (CW - pl - pr), ys = (v) => pt + (1 - v / maxP) * (CH - pt - pb);
    const COL = ['#62d26f', '#a4d65e', '#d4d063', '#f0e05a', '#efc95c', '#efa65a', '#ef8a5d', '#ec6a5c'];
    const fs = P ? 2.4 * u : 1.7 * u;
    const lines = LEAD.map((x, j) => `<polyline id="ll${j}" points="${x.rounds.map((_, k) => `${xs(k).toFixed(1)},${ys(cum(x, k)).toFixed(1)}`).join(' ')}" stroke="${COL[j]}" stroke-width="${(j === 0 ? 0.75 : 0.5) * u}" pathLength="1" />`).join('');
    const grid = [0, 10, 20, 30].map((v) => `<line x1="${pl}" x2="${CW - pr}" y1="${ys(v)}" y2="${ys(v)}" /><text x="${pl - 1 * u}" y="${ys(v) + fs * 0.35}" text-anchor="end" font-size="${fs}">${v}</text>`).join('')
      + R.map((r, k) => `<text x="${xs(k)}" y="${CH - 1.2 * u}" text-anchor="middle" font-size="${fs}">${k + 1}</text>`).join('');
    // popisky na konci čar bez překryvu
    const lab = LEAD.map((x, j) => ({ j, y: ys(cum(x, 11)) })).sort((p, q) => p.y - q.y), gapL = fs * 1.35;
    lab.forEach((l, i) => { if (i && l.y < lab[i - 1].y + gapL) l.y = lab[i - 1].y + gapL; });
    const ends = lab.map(({ j, y }) => `<div class="le" id="le${j}" style="left:${f(CW + 1 * u)}; top:${f(y - fs * 0.7)}; font-size:${f(fs)}"><i style="background:${COL[j]}"></i>${LEAD[j].last} <b>${LEAD[j].pts}</b></div>`).join('');
    scene('s-path', a, b, `<div class="h2"><span>Cesta lídrů</span><em>leaders' path · body po kolech</em></div>
      <div class="chart panel" style="width:${f(CW)}; height:${f(CH)}"><svg viewBox="0 0 ${CW.toFixed(0)} ${CH.toFixed(0)}">${grid}${lines}</svg>${ends}</div>
      <div class="rmini" id="rmini">${[8, 9, 10, 11].map((k) => roundCard(k).replace(`id="rc${k}"`, `id="rc${k}" style="position:absolute; inset:0"`)).join('')}</div>`);
    rise('#s-path .h2 span', a + 0.1); fade('#s-path .h2 em', a + 0.3);
    T('#s-path .chart', { opacity: 0, y: 3 * u }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, a + 0.3);
    LEAD.forEach((_, j) => {
      T(`#ll${j}`, { strokeDashoffset: 1 }, { strokeDashoffset: 1 - 8 / 11, duration: 1.8, ease: 'power2.inOut' }, a + 0.6 + j * 0.06);
      [8, 9, 10, 11].forEach((k) => out.push(`tl.fromTo("#ll${j}", {strokeDashoffset:${(1 - (k - 1) / 11).toFixed(4)}}, {strokeDashoffset:${(1 - k / 11).toFixed(4)}, duration:0.6, ease:"power2.out", immediateRender:false}, ${(R[k].b - 0.6).toFixed(3)});`));
    });
    LEAD.forEach((_, j) => fade(`#le${j}`, R[11].b + 0.1 + j * 0.08, 0.3));
    [8, 9, 10, 11].forEach((k, i) => {
      const tc = R[k].a + (R[k].b - R[k].a) * 0.3, nx = i < 3 ? R[k + 1].a + (R[k + 1].b - R[k + 1].a) * 0.3 : b;
      T(`#rc${k}`, { opacity: 0, x: -4 * u }, { opacity: 1, x: 0, duration: 0.4, ease: 'expo.out' }, tc);
      if (i < 3) T(`#rc${k}`, { opacity: 1 }, { opacity: 0, duration: 0.25, immediateRender: false }, nx - 0.25);
    });
    T('#ll0', { strokeWidth: 0.75 * u }, { strokeWidth: 1.3 * u, duration: 0.3, yoyo: true, repeat: 3, ease: 'sine.inOut', immediateRender: false }, R[11].b + 0.6);
  }
  // ===== 8) ryby ≠ body 14:30–15:00 =====
  {
    const a = tOf('14:30'), b = tOf('15:00');
    const CW = P ? 88 * u : W * 0.62, CH = P ? 54 * u : scH * 0.7, pl = 6 * u, pr = 3 * u, pt = 3 * u, pb = 6 * u;
    const fx = (v) => pl + ((v - 25) / 75) * (CW - pl - pr), fy = (r) => pt + ((r - 1) / 39) * (CH - pt - pb);
    const fs = P ? 2.4 * u : 1.7 * u;
    const HL = { Švub: 'Švub · 95 ryb → 1.', Stoklasa: 'Stoklasa · 91 ryb → 4.', Saska: 'Saska · 82 ryb → 18.', Zaikin: 'Zaikin · 69 ryb → 2.' };
    const dots = A.map((x, i) => `<circle id="dt${i}" cx="${fx(x.fish).toFixed(1)}" cy="${fy(x.rank).toFixed(1)}" r="${(HL[x.last] ? 1.1 : 0.7) * u}" class="${HL[x.last] ? 'hl' : ''}"/>`).join('');
    const axes = `<line x1="${pl}" x2="${CW - pr}" y1="${CH - pb}" y2="${CH - pb}"/><line x1="${pl}" x2="${pl}" y1="${pt}" y2="${CH - pb}"/>`
      + [25, 50, 75, 100].map((v) => `<text x="${fx(v)}" y="${CH - pb + fs * 1.5}" text-anchor="middle" font-size="${fs}">${v}</text>`).join('')
      + [1, 10, 20, 30, 40].map((r) => `<text x="${pl - 1 * u}" y="${fy(r) + fs * 0.35}" text-anchor="end" font-size="${fs}">${r}.</text>`).join('')
      + `<text x="${CW - pr}" y="${CH - pb - 1 * u}" text-anchor="end" font-size="${fs}" class="ax">ryby →</text><text x="${pl + 1 * u}" y="${pt + fs}" font-size="${fs}" class="ax">↑ místo</text>`;
    const labs = A.filter((x) => HL[x.last]).map((x, i) => { const L = fx(x.fish) > CW * 0.55; return `<div class="dl${L ? ' l' : ''}" id="dl${i}" style="left:${f(fx(x.fish))}; top:${f(fy(x.rank))}"><span style="font-size:${f(fs * 1.1)}">${HL[x.last]}</span></div>`; }).join('');
    scene('s-scatter', a, b, `<div class="h2"><span>Ryby ≠ body</span><em>fish vs. final rank · bodovaný závod</em></div>
      <div class="chart panel sc" style="width:${f(CW)}; height:${f(CH)}"><svg viewBox="0 0 ${CW.toFixed(0)} ${CH.toFixed(0)}">${axes}${dots}</svg>${labs}</div>`);
    rise('#s-scatter .h2 span', a + 0.1); fade('#s-scatter .h2 em', a + 0.3);
    T('#s-scatter .chart', { opacity: 0, y: 3 * u }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, a + 0.3);
    A.forEach((_, i) => T(`#dt${i}`, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.3, ease: 'back.out(3)' }, a + 0.6 + rnd(i) * 1.2));
    A.filter((x) => HL[x.last]).forEach((_, i) => fade(`#dl${i}`, a + 2.0 + i * BEAT * 2, 0.35));
  }
  // ===== 9) vyhlášení 15:00–15:30 =====
  {
    const a = tOf('15:00'), b = tOf('15:30');
    scene('s-podium', a, b, `${photo('d1_02', a, b, 'top')}
      <div class="t5">${TOP5.map((x, i) => `<div class="t5r" id="t5${i}"><span class="lp">${i + 1}</span><span class="ln">${name(x)}</span><span class="tf">${x.fish} ryb</span><b>${x.pts} b</b></div>`).join('')}</div>`);
    TOP5.forEach((_, i) => fade(`#t5${4 - i}`, a + 0.4 + i * BEAT, 0.35));
    T('#t50', { backgroundColor: 'rgba(5,13,34,.84)' }, { backgroundColor: 'rgba(227,30,36,.75)', duration: 0.3, yoyo: true, repeat: 3 }, a + 0.4 + 5 * BEAT);
  }
  // ===== 10) tail: organizátoři · David · outro =====
  {
    const t0 = DUR - TAIL, t1 = t0 + 5.5, t2 = t1 + 5, t3 = DUR;
    const ORG = ['Igor Novák', 'Denis Zaikin', 'Stanislav Lukášek', 'Michal Horák'];
    scene('s-org', t0, t1, `${photo('organizers_lowres', t0, t1, 'org')}<div class="h2 low"><span>Organizátoři</span><em>organizers · Trout Area CZ</em></div>
      <div class="orgn">${ORG.map((n, i) => `<span id="on${i}">${n}</span>`).join('')}</div>`);
    rise('#s-org .h2 span', t0 + 0.2); fade('#s-org .h2 em', t0 + 0.4); ORG.forEach((_, i) => fade(`#on${i}`, t0 + 0.8 + i * BEAT));
    const h = A.find((x) => x.last === 'Helman');
    scene('s-host', t1, t2, `<div class="host"><div class="hk"><span>Děkujeme</span></div><div class="hn"><span>David Helman</span></div>
      <div class="hs" id="hs">Hostitel · Łowisko Klonówiec · a k tomu ${h.rank}. místo a ${h.fish} ryb</div></div>`);
    rise('#s-host .hk span', t1 + 0.15); rise('#s-host .hn span', t1 + 0.15 + BEAT); fade('#hs', t1 + 0.4 + BEAT * 2);
    scene('s-out', t2, t3, `<div class="fin"><div class="fv"><b id="fin-n">${fmt(TOTAL)}</b><span>ryb za den · ≈ ${Math.round(TOTAL * 0.18)} kg</span></div>
      <img class="ta" src="assets/logo-TACR2-ready.png" alt="Trout Area Czech Republic"><div class="fz"><span>Zítra Den 2 · see you again</span></div></div>`);
    fade('#s-out .fv', t2 + 0.1); T('#s-out .ta', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }, t2 + 0.4 + BEAT); fade('#s-out .fz', t2 + 0.6 + BEAT * 2);
    T('#gh-end', { opacity: 0 }, { opacity: 0.6, duration: 0.8 }, DUR - 5.5);
    T('#gh-end .gh-ring', { rotation: 0 }, { rotation: 140, duration: 5.5, ease: 'none' }, DUR - 5.5);
  }
  T('#gh-intro', { opacity: 0 }, { opacity: 0.6, duration: 0.5 }, 0.4);
  T('#gh-intro .gh-ring', { rotation: 0 }, { rotation: 70, duration: 2.8, ease: 'none' }, 0.4);
  out.push(`tl.to("#gh-intro", {opacity:0, duration:0.5}, 2.6);`);

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
      tl.fromTo(o,{v:0},{v:1,duration:${DAYEND},ease:"none",onUpdate(){ const m=${DAY0}+o.v*${DAY1 - DAY0}; const hh=Math.floor(m/60), mm=Math.floor(m%60);
        ck.textContent=String(hh).padStart(2,"0")+":"+String(mm).padStart(2,"0"); cn.textContent=Math.round(fishAt(m)).toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g,"\\u2009"); ko.textContent=lab(m);
        RR.forEach(([a,b],k)=>{ const p=Math.max(0,Math.min(1,(m-a)/(b-a))); cols[k].style.transform="scaleY("+p.toFixed(3)+")"; cells[k].classList.toggle("on", m>=a&&m<b); }); }}, 0); }`);
  // puls počítadla na každou dobu během kol
  G.beats.filter((t) => R.some((r) => t > r.a && t < r.b)).forEach((t) => out.push(`tl.fromTo("#cnt", {scale:1.06}, {scale:1, duration:0.25, ease:"power2.out", immediateRender:false}, ${t.toFixed(3)});`));
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
  #grain { position:absolute; inset:0; background:url(assets/grain.png) 0 0 / 256px 256px; opacity:.5; mix-blend-mode:overlay; pointer-events:none; }

  /* scéna = oblast mimo HUD */
  .clip > .phw { position:absolute; left:0; right:0; top:${f(SC.top - 3 * u)}; height:${f(scH + 6 * u)}; overflow:hidden;
    -webkit-mask-image:linear-gradient(180deg, transparent 0, #000 9%, #000 86%, transparent 100%); }
  .phw .pb { position:absolute; inset:0; background-size:cover; background-position:50% 35%; }
  .phw.dim .pb { filter:brightness(.38) saturate(.8); }
  .phw.top .pb { background-position:50% 25%; }
  .clip > .phw.org { left:${P ? '0' : '44%'}; right:${P ? '0' : '4%'}; ${P ? `top:${f(SC.top + 16 * u)}; height:${f(scH * 0.62)};` : ''} }
  .phw.org .pb { background-size:contain; background-repeat:no-repeat; background-position:50% 30%; }
  .aer { position:absolute; inset:0; }
  .aer .phw { position:absolute; left:0; right:0; overflow:hidden; top:${f(P ? H * 0.5 : 0)}; height:${f(P ? H * 0.32 : H)}; }
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
  .hcell { border-radius:${px(1)}; padding:${px(P ? 2.2 : 1.4)} ${px(1)}; text-align:center; color:#0b1e42; }
  .hcell em { display:block; font-style:normal; font-family:Montserrat; font-weight:700; font-size:${px(P ? 2.4 : 1.6)}; opacity:.7; }
  .hcell b { display:block; font-family:Montserrat; font-weight:900; font-size:${px(P ? 5.4 : 3.6)}; line-height:1.05; }
  .hnote { position:absolute; left:${px(6)}; right:${px(6)}; bottom:${f(H - SC.bot + 4 * u)}; font-size:${px(P ? 3.8 : 2.6)}; } .hnote b { font-family:Montserrat; font-weight:900; color:var(--gold); }
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
  .chart.panel { background:rgba(5,13,34,.82); border-radius:${px(2)}; border:${px(0.2)} solid rgba(238,242,249,.1); }
  .chart svg { position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
  .chart line { stroke:rgba(238,242,249,.16); stroke-width:${px(0.15)}; } .chart text { fill:rgba(238,242,249,.65); font-family:Montserrat; font-weight:600; } .chart text.ax { fill:var(--gold); }
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
  .host { position:absolute; left:${px(6)}; right:${px(6)}; top:${f(SC.top + scH * 0.28)}; text-align:center; }
  .hk span { display:inline-block; font-family:Montserrat; font-weight:600; font-size:${px(P ? 4.4 : 3)}; letter-spacing:.24em; text-transform:uppercase; color:var(--gold); }
  .hn span { display:inline-block; font-family:Montserrat; font-weight:900; font-size:${px(P ? 13 : 9)}; letter-spacing:-.02em; line-height:1.05; }
  .hs { font-size:${px(P ? 3.6 : 2.5)}; margin-top:${px(1.6)}; }
  .fin { position:absolute; left:${px(6)}; right:${px(6)}; top:${f(SC.top + scH * 0.12)}; display:flex; flex-direction:column; align-items:center; gap:${px(3)}; text-align:center; }
  .fv b { display:block; font-family:Montserrat; font-weight:900; font-size:${px(P ? 18 : 12)}; color:var(--red); line-height:1; } .fv span { font-family:Montserrat; font-weight:700; font-size:${px(P ? 3.8 : 2.6)}; letter-spacing:.1em; text-transform:uppercase; }
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
</style></head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="${W}" data-height="${H}">
  <div id="stage"><div id="st-bg"></div><div id="st-rays"></div><div id="st-band">${band}</div><div id="st-dots"></div>${stars}</div>
  ${scenes.join('\n  ')}
  ${hud}
  <section id="ghs" class="clip" data-start="0" data-duration="${DUR}" data-track-index="8">${gh('gh-intro')}${gh('gh-end')}</section>
  ${HAS_TRACK ? `<audio id="music" class="clip" data-start="0" data-duration="${DUR}" data-track-index="0" src="assets/track.wav" data-volume="1"></audio>` : ''}
  <div id="grain"></div>
  ${process.env.FINAL ? '' : `<div id="badge">DRAFT · ${VER}${HAS_TRACK ? '' : ' · 128 BPM placeholder'}</div>`}
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
