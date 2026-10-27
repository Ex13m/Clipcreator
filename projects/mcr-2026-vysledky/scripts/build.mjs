// MČR 2026 – analytika výsledků (Mistrovství České republiky v Trout Area, Líheň Liběchov, 24.–25. 10. 2026).
// Čistá analytika, ne finální film. Data: data/results.json (scripts/parse.py), data/stats.json (scripts/stats.py), data/pond.json (stanoviště).
// Hudba: 03_MUSIC/track.beats.json + proto/assets/track.wav (Suno) — dokud není, syntetická mřížka 124 BPM.
// Scény jsou v taktech (BARS) → po příchodu tracku se jen přepočítá mřížka, struktura zůstává.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROTO = path.join(ROOT, 'proto');
const FONTS = fs.readFileSync(path.join(PROTO, 'assets/fonts.css'), 'utf8');
const R = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/results.json'), 'utf8'));
const ST = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/stats.json'), 'utf8'));
const POND = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/pond.json'), 'utf8'));
const PHOTOS = fs.existsSync(path.join(PROTO, 'assets/photos.json')) ? JSON.parse(fs.readFileSync(path.join(PROTO, 'assets/photos.json'), 'utf8')) : {};
const AER = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/aerial.json'), 'utf8'));   // ortofoto ČÚZK, stanoviště v px (malys_ortho.jpg)
const VER = process.env.VER || 'v7';

// ---------- struktura v taktech ----------
// track_edit2: originál takty 1–53 + kopie 18–53 + originál 54–65 (≈ 101 taktů, 197,9 s)
const BARS = { intro: [0, 8], d1: [8, 23], d1s: [23, 30], d1l: [30, 35], d2: [35, 50], d2s: [50, 57], d2l: [57, 62], mcr: [62, 70], fpa: [70, 76], pod: [76, 88], sez: [88, 99], end: [99, 101] };
const NBARS = 101;

// ---------- čas: track nebo syntetická mřížka ----------
const BEATS_F = path.join(ROOT, '03_MUSIC/track_edit2.beats.json');
const HAS_TRACK = fs.existsSync(BEATS_F) && fs.existsSync(path.join(PROTO, 'assets/track.wav'));
const G = HAS_TRACK ? JSON.parse(fs.readFileSync(BEATS_F, 'utf8')) : (() => {
  const bpm = 124, b = 60 / bpm, beats = [], downbeats = [];
  for (let i = 0; i < NBARS * 4 + 8; i++) { const t = +(i * b).toFixed(4); beats.push(t); if (i % 4 === 0) downbeats.push(t); }
  return { beats, downbeats, duration: +(NBARS * 4 * b).toFixed(3) };
})();
const BEAT = G.beats[1] - G.beats[0];
const BAR = (n) => (n < G.downbeats.length ? G.downbeats[n] : G.downbeats.at(-1) + (n - G.downbeats.length + 1) * BEAT * 4);
const DUR = +(HAS_TRACK ? G.duration : BAR(NBARS)).toFixed(3);
const len = (a, b) => +(b - a).toFixed(3);
const rnd = (seed) => { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); };
const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const dec = (v, d = 2) => (+v).toFixed(d).replace('.', ',');

// ---------- data ----------
const short = (n) => { const p = n.split(' '); return `${p[0][0]}. ${p.slice(1).join(' ')}`; };
const last = (n) => n.split(' ').slice(1).join(' ');
const DAYS = ['d1', 'd2'].map((k) => {
  const A = R[k], n = A.length;
  // pořadí po každém kole: kumulativní body, pak ryby; po 12. kole oficiální umístění
  const rankAfter = (j) => {
    if (j === 11) return Object.fromEntries(A.map((a) => [a.name, a.place]));
    // oficiální pořadí: body → výhry (3 b) → remízy s rybou (2 b) → ryby
    const sum = (a, fn) => a.rounds.slice(0, j + 1).reduce((s, r) => s + fn(r), 0);
    const s = A.map((a) => ({ n: a.name, p: sum(a, (r) => r.pts || 0), w: sum(a, (r) => +(r.pts === 3)), d: sum(a, (r) => +(r.pts === 2)), f: sum(a, (r) => r.fish || 0) }))
      .sort((x, y) => y.p - x.p || y.w - x.w || y.d - x.d || y.f - x.f);
    return Object.fromEntries(s.map((x, i) => [x.n, i + 1]));
  };
  const ranks = Array.from({ length: 12 }, (_, j) => rankAfter(j));
  const perRound = ST[k].per_round, total = ST[k].total;
  const top = [...A].sort((x, y) => x.place - y.place);
  const mostFish = [...A].sort((x, y) => y.fish - x.fish)[0];
  const recF = Math.max(...A.flatMap((a) => a.rounds.map((r) => r.fish || 0)));
  const recL = A.flatMap((a) => a.rounds.map((r, j) => ({ f: r.fish || 0, n: a.name, j: j + 1 }))).filter((x) => x.f === recF);
  const rec = { f: recF, txt: recL.length > 1 ? recL.map((x) => `${short(x.n)} (${x.j}. k.)`).join(' · ') : `${recL[0].n} · ${recL[0].j}. kolo` };
  return { k, A, n, ranks, perRound, total, top, mostFish, rec, stand: ST[k].per_stand, zero: ST[k].zero_rounds, rounds: ST[k].angler_rounds };
});
const MCR = R.mcr.rows.slice(0, 10).map((x) => ({ name: x.name, d1: x.res[1].pos, d2: x.res[0].pos, avg: +x.avg }));
const FINAL10 = MCR.map((x) => x.name);
const byName = (day, n) => DAYS[day].A.find((a) => a.name === n);
// celé MČR (39 závodníků, součet umístění) a ryby na závodníka za oba dny
const MCRALL = R.mcr.rows.filter((x, i, A) => byName(0, x.name) && A.findIndex((y) => y.name === x.name) === i).map((x) => ({ name: x.name, d1: x.res[1].pos, d2: x.res[0].pos }));
const FPA = DAYS[0].A.map((a) => { const b = byName(1, a.name); return { name: a.name, f1: a.fish, f2: b.fish, t: a.fish + b.fish }; })
  .sort((x, y) => y.t - x.t || x.name.localeCompare(y.name, 'cs'));
// sezóna: chronologicky (export je od nejnovějšího)
const EV = ['Klonówiec jaro D1', 'Klonówiec jaro D2', 'Liběchov jaro D1', 'Liběchov jaro D2', 'Klonówiec podzim D1', 'Klonówiec podzim D2', 'MČR D1', 'MČR D2'];
const EVS = ['KL', 'KL', 'LIB', 'LIB', 'KL', 'KL', 'MČR', 'MČR'];
const EVD = ['14.3.', '15.3.', '25.4.', '26.4.', '10.10.', '11.10.', '24.10.', '25.10.'];
const SALL = Object.fromEntries(R.season_all.rows.map((x) => [x.name, { rank: x.rank, avg: +x.avg, pos: [...x.res].reverse().map((e) => e.pos) }]));
const SB6 = Object.fromEntries(R.season_best6.rows.map((x) => [x.name, { rank: x.rank, avg: +x.avg, cnt: [...x.res].reverse().map((e) => e.counted) }]));
const ALL10 = R.season_all.rows.slice(0, 10).map((x) => x.name);
const B6TOP = R.season_best6.rows.slice(0, 10).map((x) => x.name);
const SEZ = [...new Set([...ALL10, ...B6TOP])].map((n) => ({ name: n, pos: SALL[n].pos, all: SALL[n].avg, allRank: SALL[n].rank, b6: SB6[n].avg, b6Rank: SB6[n].rank, cnt: SB6[n].cnt }));
const ABSENT = (p) => p > 40;
const PARTNERS = ['libechov', 'gausseholler', 'activefishing', 'bosset', 'jigovky', 'troutshop', 'velkaryba', 'ftfishing', 'crs'];

const mixHex = (c1, c2, t) => '#' + [0, 2, 4].map((o) => Math.round(parseInt(c1.slice(1 + o, 3 + o), 16) * (1 - t) + parseInt(c2.slice(1 + o, 3 + o), 16) * t).toString(16).padStart(2, '0')).join('');
const heat = (k) => (k < 0.5 ? mixHex('#304285', '#ffd36b', k / 0.5) : mixHex('#ffd36b', '#e31e24', (k - 0.5) / 0.5));
function build(W, H, file) {
  const P = H > W, u = Math.min(W, H) / 100;
  const px = (n) => `${Math.round(n * u)}px`;
  const f = (n) => n.toFixed(1) + 'px';
  const out = [];
  const T = (sel, from, to, pos) => out.push(`tl.fromTo(${JSON.stringify(sel)}, ${JSON.stringify(from)}, ${JSON.stringify({ immediateRender: false, ...to })}, ${(+pos).toFixed(3)});`);
  const T0 = (sel, from, to, pos) => out.push(`tl.fromTo(${JSON.stringify(sel)}, ${JSON.stringify(from)}, ${JSON.stringify(to)}, ${(+pos).toFixed(3)});`);
  const SET = (sel, v, pos) => out.push(`tl.set(${JSON.stringify(sel)}, ${JSON.stringify(v)}, ${(+pos).toFixed(3)});`);
  const CNT = (id, from, to, pos, d, decs = 0) => out.push(`{ const o={v:${from}}, el=document.getElementById("${id}"); tl.fromTo(o,{v:${from}},{v:${to},duration:${d.toFixed(3)},ease:"power2.out",immediateRender:false,onUpdate(){el.textContent=${decs ? `o.v.toFixed(${decs}).replace(".",",")` : `Math.round(o.v).toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g,"\\u2009")`};}}, ${(+pos).toFixed(3)}); }`);
  const scenes = [], starts = [];
  const scene = (id, a, b, html, track = 2) => { starts.push(a);
    if (a > 0.5) T0(`#${id}`, { rotationY: -14, z: -260, opacity: 0, transformPerspective: 1800 }, { rotationY: 0, z: 0, opacity: 1, duration: 0.7, ease: 'expo.out' }, a);
    if (b < DUR - 0.5) T(`#${id}`, { rotationY: 0, z: 0, opacity: 1 }, { rotationY: 12, z: -220, opacity: 0, duration: 0.35, ease: 'power2.in', transformPerspective: 1800 }, b - 0.35); out.push(`tl.set("#${id}", {visibility:"hidden"}, 0); tl.set("#${id}", {visibility:"visible"}, ${a.toFixed(3)}); tl.set("#${id}", {visibility:"hidden"}, ${b.toFixed(3)});`); scenes.push(`<section id="${id}" class="clip" data-start="${a.toFixed(3)}" data-duration="${len(a, b)}" data-track-index="${track}">${html}</section>`); };
  const onBeat = (t) => G.beats.find((b) => b >= t - 0.04) ?? t;
  const rise = (sel, t, d = 0.55) => T0(sel, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: d, ease: 'expo.out' }, onBeat(t));
  const pop = (sel, t, d = 0.5) => T0(sel, { opacity: 0, y: 2 * u, scale: 0.94, rotationX: -55, transformPerspective: 900, transformOrigin: '50% 100%' }, { opacity: 1, y: 0, scale: 1, rotationX: 0, duration: d, ease: 'back.out(1.8)' }, t);
  // atmosféra: fotka z TA CZ / Liběchova (tlumená, pomalý Ken Burns) + obří obrysové slovo, které pluje
  const bgp = (img, a, b, { op = 0.42, word = '', id = `bg${Math.round(a * 100)}` } = {}) => {
    T0(`#${id}`, { opacity: 0 }, { opacity: op, duration: 0.6, ease: 'power2.out' }, a);
    T0(`#${id}`, { scale: 1.12, xPercent: -1.5 }, { scale: 1.0, xPercent: 1.5, duration: len(a, b), ease: 'none' }, a);
    if (word) T0(`#${id}w`, { xPercent: 6 }, { xPercent: -10, duration: len(a, b), ease: 'none' }, a);
    if (word) { T0(`#${id}w`, { opacity: 0 }, { opacity: 1, duration: 0.6 }, a); T(`#${id}w`, { opacity: 1 }, { opacity: 0, duration: 0.3 }, b - 0.3); }
    return `<div class="bgp" id="${id}" style="background-image:url(assets/photos/${img})"></div><div class="bgo"></div>${word ? `<div class="bgw" id="${id}w">${word}</div>` : ''}`;
  };
  const head = (id, big, small, t) => { rise(`#${id} .h2 span`, t); pop(`#${id} .h2 em`, t + BEAT); return `<div class="h2"><span>${big}</span><em>${small}</em></div>`; };
  const SAFE = P ? { l: 6 * u, r: 6 * u, t: 13 * u, b: 6 * u } : { l: 5 * u, r: 5 * u, t: 6 * u, b: 5 * u };

  // ---------- rybník (SVG) ----------
  const SECC = ['#7fb2ff', '#5fe0b4', '#ffd36b', '#ff7a59'];
  const CEN = [560, 525];
  const outw = (x, y, d) => { const dx = x - CEN[0], dy = y - CEN[1], l = Math.hypot(dx, dy) || 1; return [x + (dx / l) * d, y + (dy / l) * d]; };
  const pondSVG = (id, size, { stands = true, labels = false, sectors = false } = {}) => {
    const sec = sectors ? [1, 11, 21, 31].map((lo, k) => {
      const pts = Array.from({ length: 10 }, (_, i) => POND.stands[lo + i]).map(([x, y]) => outw(x, y, 30));
      const [mx, my] = POND.stands[lo + 5], [lx, ly] = outw(mx, my, 105);
      return `<polyline class="secb" id="${id}-sec${k}" points="${pts.map((q) => q.map((v) => v.toFixed(1)).join(',')).join(' ')}" stroke="${SECC[k]}" pathLength="1"/>
        <g class="secl" id="${id}-sl${k}" transform="translate(${lx.toFixed(1)} ${ly.toFixed(1)})"><rect x="-62" y="-30" width="124" height="${sectors === 'val' ? 82 : 46}" rx="12" fill="${SECC[k]}"/><text class="sln" y="2" text-anchor="middle">${lo}–${lo + 9}</text>${sectors === 'val' ? `<text class="slv" id="${id}-slv${k}" y="40" text-anchor="middle">0</text>` : ''}</g>`;
    }).join('') : '';
    return `<svg class="pond" id="${id}" viewBox="40 40 1040 980" style="width:${f(size)}; height:${f(size * 980 / 1040)}">
      <path class="po" d="${POND.outer}" pathLength="1"/>${POND.inner ? `<path class="pi" d="${POND.inner}"/>` : ''}${sec}
      ${stands ? Object.entries(POND.stands).map(([n, [x, y]]) => `<g class="sd" id="${id}-s${n}" transform="translate(${x} ${y})"><circle class="sdc" r="15"/>${labels ? `<text y="5" text-anchor="middle">${n}</text>` : ''}</g>`).join('') : ''}
    </svg>`;
  };

  // ---------- letecký snímek (ortofoto) jako 3D rovina: .aw perspektiva → .ax náklon (rotationX) → .az otáčení (rotation) ----------
  // vše, co má stát „nahoru“ (sloupce, piny, popisky), nese třídu .bb a otáčí se opačně než .az → vždy čelem ke kameře
  const CB = { x0: 430, y0: 470, w: 1380, h: 1300 }, CFULL = { x0: 0, y0: 0, w: AER.size, h: AER.size };
  const apos = (n, S, c) => { const k = S / c.w, [x, y] = AER.stands[n]; return [(x - c.x0) * k, (y - c.y0) * k]; };
  const aerial = (id, S, c, inner, { outline = false } = {}) => { const k = S / c.w, hh = c.h * k;
    return `<div class="ax" id="${id}-x" style="width:${f(S)}; height:${f(hh)}; margin:${f(-hh / 2)} 0 0 ${f(-S / 2)}"><div class="az" id="${id}-z">
      <div class="aimg" style="background-size:${f(AER.size * k)} auto; background-position:${f(-c.x0 * k)} ${f(-c.y0 * k)}"></div>
      ${outline ? `<svg class="aol" viewBox="${c.x0} ${c.y0} ${c.w} ${c.h}"><polygon points="${AER.outline.map((q) => q.join(',')).join(' ')}" pathLength="1"/></svg>` : ''}${inner}</div></div>`; };
  // kamera: náklon x0→x1, otočení z0→z1 (billboardy s ním)
  const orbit = (id, a, b, { x0 = 0, x1, z0, z1, s0 = 0.9, s1 = 1, tin = 1.1 }) => {
    T0(`#${id}-x`, { rotationX: x0, scale: s0 }, { rotationX: x1, scale: s1, duration: tin, ease: 'power3.out' }, a);
    T0(`#${id}-z`, { rotation: z0 }, { rotation: z1, duration: len(a, b), ease: 'sine.inOut' }, a);
    T0(`#${id} .bb`, { rotation: -z0 }, { rotation: -z1, duration: len(a, b), ease: 'sine.inOut' }, a);
  };

  // ===================== 1) INTRO =====================
  {
    const a = 0, m1 = BAR(1) + BEAT * 2, mf = m1 + 3.75, m2 = BAR(6), b = BAR(BARS.intro[1]);
    const AS = 104 * u, dots = Object.keys(AER.stands).map((n) => { const [x, y] = apos(n, AS, CFULL); return `<i class="ad" id="ad${n}" style="left:${f(x)}; top:${f(y)}"></i>`; }).join('');
    scene('s-intro', a, b, `${bgp('bg_mcr26_porada.jpg', a, m1, { op: 0.72, id: 'bgi1' })}${bgp('bg_mcr26_breh_pruty.jpg', m2, b, { op: 0.68, id: 'bgi3', word: 'FAIR PLAY' })}
      <div class="it" id="it1"><div class="tap"><img src="assets/ta_logo.png" alt="Trout Area Czech Republic"></div>
        <div class="l1"><span>Mistrovství</span></div><div class="l1"><span>České republiky</span></div><div class="l1 red"><span>2026</span></div>
        <div class="l3"><span>Trout Area · hard baits · výsledky v číslech</span></div></div>
      <div class="aw aw-i" id="ai">${aerial('ai', AS, CFULL, dots, { outline: true })}</div>
      <div class="it" id="it2"><div class="vt"><div class="l1"><span>Líheň Liběchov</span></div><div class="l3"><span>rybník Malý Sporťáček · 40 stanovišť</span></div>
        <div class="vlogo"><img src="assets/logos/libechov.png" alt=""></div></div></div>
      <div class="it" id="it3"><div class="l1 big"><span>Dva dny</span></div><div class="l1 big red"><span>fair play</span></div>
        <div class="tiles">${[[39, 'závodníků'], [2, 'dny'], [24, 'kol'], [40, 'stanovišť']].map(([v, l], i) => `<div class="tile" id="itl${i}"><b id="itv${i}">0</b><span>${l}</span></div>`).join('')}</div>
        <div class="l3 dte"><span>sobota 24. 10. · neděle 25. 10. 2026</span></div></div>`);
    // 1a titul
    T0('#it1 .tap', { opacity: 0, y: -3 * u, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }, a + 0.1);
    ['#it1 .l1:nth-of-type(2) span', '#it1 .l1:nth-of-type(3) span', '#it1 .l1:nth-of-type(4) span'].forEach((s, i) => rise(s, a + 0.4 + i * BEAT * 2));
    pop('#it1 .l3 span', a + 0.4 + BEAT * 6);
    T0('#fly', { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power1.out' }, m1 - 0.05);
    T('#it1', { opacity: 1 }, { opacity: 0, y: -4 * u, duration: 0.35, ease: 'power2.in' }, m1 - 0.35); T('#bgi1', { opacity: 0.72 }, { opacity: 0, duration: 0.4 }, m1 - 0.2);
    // 1b průlet dronem nad Liběchovem → z posledního záběru „vyroste“ ortofoto rybníka (stejný úhel: pohled k západu, náklon) → kamera se zvedne nad rybník
    T0('#ai', { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power1.in' }, mf - 0.3);
    T0('#ai-x', { rotationX: 52, scale: 1.05, x: (P ? -2 : -3) * u, y: 6 * u }, { rotationX: 0, scale: 1.3, x: P ? 0 : -34 * u, y: P ? -16 * u : 0, duration: 1.9, ease: 'power2.inOut' }, mf);
    T0('#ai-z', { rotation: 90 }, { rotation: 0, duration: 1.9, ease: 'power2.inOut' }, mf);
    T0('#ai .aol polygon', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' }, mf + 1.4);
    Object.keys(AER.stands).forEach((n, i) => T0(`#ad${n}`, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(3)' }, mf + 1.7 + i * 0.025));
    T0('#ai-x', { scale: 1.3 }, { scale: 1.38, duration: len(mf + 1.9, m2), ease: 'none' }, mf + 1.9);
    T0('#it2', { opacity: 0 }, { opacity: 1, duration: 0.01 }, mf + 1.6);
    rise('#it2 .l1 span', mf + 1.7); pop('#it2 .l3 span', mf + 1.7 + BEAT * 2); pop('#it2 .vlogo', mf + 1.7 + BEAT * 3);
    T('#it2, #ai', { opacity: 1 }, { opacity: 0, scale: 1.04, duration: 0.35, ease: 'power2.in' }, m2 - 0.35);
    // 1c dva dny fair play
    T0('#it3', { opacity: 0 }, { opacity: 1, duration: 0.01 }, m2);
    rise('#it3 .l1:nth-of-type(1) span', m2 + 0.05); rise('#it3 .l1:nth-of-type(2) span', m2 + 0.05 + BEAT);
    [[39], [2], [24], [40]].forEach(([v], i) => { const t = m2 + BEAT * (2 + i * 0.5); pop(`#itl${i}`, t); CNT(`itv${i}`, 0, v, t + 0.05, 0.7); });
    pop('#it3 .dte span', m2 + BEAT * 4.5);
    T('#it3', { opacity: 1 }, { opacity: 0, scale: 0.96, duration: 0.3, ease: 'power2.in' }, b - 0.45);
  }

  // ===================== 2/4) ŽIVÝ PRŮBĚH DNE =====================
  const live = (di) => {
    const D = DAYS[di], id = `s-${D.k}`, [b0, b1] = BARS[D.k], a = BAR(b0), b = BAR(b1);
    const rt = (j) => BAR(b0 + 1 + j);                          // kolo j běží v taktu b0+1+j
    const CW = P ? W - SAFE.l - SAFE.r : W * 0.62, CH = P ? H * 0.44 : H - SAFE.t - SAFE.b - 17 * u;
    const padL = P ? 4 * u : 4 * u, padR = P ? 24 * u : 18 * u, padT = 2 * u, padB = 3 * u;
    const X = (j) => padL + (j / 11) * (CW - padL - padR), Y = (r) => padT + ((r - 1) / 38) * (CH - padT - padB);
    const COL = ['#e31e24', '#ffd36b', '#ffffff', '#7fb2ff', '#9be3c7', '#c9a7ff', '#ff9e6b', '#5fd3e8', '#b8c4e6', '#f4a3c0'];
    const lines = FINAL10.map((n, i) => {
      const pts = D.ranks.map((rk, j) => `${X(j).toFixed(1)},${Y(rk[n]).toFixed(1)}`).join(' ');
      return `<polyline class="bl${i < 3 ? ' hi' : ''}" points="${pts}" stroke="${COL[i]}" stroke-width="${(i < 3 ? 0.6 : 0.16) * u}"/>`;
    }).join('');
    // štítky: skutečná pozice = tečka, text se rozestoupí (min. mezera), mimo top 10 ztlumené
    const GAP = (P ? 2.5 : 2.3) * u;
    const LY = D.ranks.map((rk) => { const o = FINAL10.map((n, i) => ({ i, y: Y(rk[n]) })).sort((p, q) => p.y - q.y); let prev = -1e9;
      o.forEach((e) => { e.d = Math.max(e.y, prev + GAP); prev = e.d; }); const over = prev - (CH - padB); if (over > 0) o.forEach((e) => (e.d -= over * ((e.d - o[0].d) / Math.max(1, prev - o[0].d))));
      return Object.fromEntries(o.map((e) => [e.i, e.d])); });
    const dots = FINAL10.map((n, i) => `<i class="bdot${i < 3 ? ' hi' : ''}" id="${id}-o${i}" style="left:${f(X(0))}; top:${f(Y(D.ranks[0][n]))}; background:${COL[i]}"></i>
      <div class="bd${i < 3 ? ' hi' : ''}" id="${id}-d${i}" style="left:${f(X(0) + 1.4 * u)}; top:${f(LY[0][i])}; color:${i < 3 ? COL[i] : '#eef2f9'}"><span>${short(n)}</span><b id="${id}-r${i}">${D.ranks[0][n]}.</b></div>`).join('');
    const grid = [1, 10, 20, 30, 39].map((r) => `<line x1="${padL}" x2="${CW - padR}" y1="${Y(r)}" y2="${Y(r)}" class="gl"/><text x="${padL - 1 * u}" y="${Y(r) + 1 * u}" text-anchor="end">${r}.</text>`).join('')
      + Array.from({ length: 12 }, (_, j) => `<text x="${X(j)}" y="${CH - 0.2 * u}" text-anchor="middle" class="kx">${j + 1}</text>`).join('');
    const band = `<rect x="${padL}" y="${Y(1) - 1.2 * u}" width="${CW - padL - padR}" height="${Y(10) - Y(1) + 2.4 * u}" class="t10"/><text x="${CW - padR - 0.8 * u}" y="${Y(1) + 1.6 * u}" text-anchor="end" class="t10l">TOP 10</text>`;
    const maxR = Math.max(...DAYS[0].perRound);
    const ghost = di === 1 ? DAYS[0].perRound : null;
    const icon = di === 0
      ? `<svg class="wx sun" viewBox="0 0 40 40"><circle cx="20" cy="20" r="8"/>${Array.from({ length: 8 }, (_, k) => `<line x1="${20 + 12 * Math.cos(k * Math.PI / 4)}" y1="${20 + 12 * Math.sin(k * Math.PI / 4)}" x2="${20 + 17 * Math.cos(k * Math.PI / 4)}" y2="${20 + 17 * Math.sin(k * Math.PI / 4)}"/>`).join('')}</svg>`
      : `<svg class="wx rain" viewBox="0 0 40 40"><path d="M11 22a8 8 0 0 1 2-15.5A10 10 0 0 1 32 10a6 6 0 0 1-1 12z"/>${[12, 19, 26].map((x) => `<line class="drop" x1="${x}" y1="27" x2="${x - 3}" y2="35"/>`).join('')}</svg>`;
    const hud = `<div class="hud"><div class="hf"><div class="hk">kolo <b id="${id}-k">0</b> / 12</div><b id="${id}-c">0</b><span>ulovených ryb</span></div>
      <div class="hrw"><div class="hrl">ryb v kole${ghost ? ' · <s></s> sobota' : ''}</div><div class="hr">${D.perRound.map((v, j) => `<div class="hcol" id="${id}-hc${j}">${ghost ? `<s style="height:${((ghost[j] / maxR) * 100).toFixed(1)}%"></s>` : ''}<i id="${id}-hi${j}" style="height:${((v / maxR) * 100).toFixed(1)}%"></i><u class="hv" id="${id}-hv${j}" style="bottom:${((v / maxR) * 100).toFixed(1)}%">${v}</u><em>${j + 1}</em></div>`).join('')}</div></div></div>`;
    scene(id, a, b, `${bgp(di === 0 ? 'bg_mcr26_podberak.jpg' : 'bg_v02_velky_sportak.jpg', a, b, { op: 0.36, word: di === 0 ? 'SOBOTA' : 'NEDĚLE', id: `bg-${id}` })}${head(id, `Den ${di + 1}`, di === 0 ? 'sobota 24. 10. · slunečno' : 'neděle 25. 10. · déšť', a + 0.05)}${icon}${hud}
      <div class="bump" style="width:${f(CW)}; height:${f(CH)}"><svg viewBox="0 0 ${CW.toFixed(0)} ${CH.toFixed(0)}"><defs><clipPath id="${id}-cp"><rect id="${id}-cr" x="0" y="0" width="${f(X(0) + 1.5 * u)}" height="${CH}"/></clipPath></defs>${band}${grid}<g clip-path="url(#${id}-cp)">${lines}</g></svg>${dots}
        <div class="bcap">průběžné pořadí konečné top 10 MČR po kolech</div></div>
      <div class="dtop" id="${id}-top"><div class="dth">Den ${di + 1} · top 10</div><div class="dtg">${D.top.slice(0, 10).map((x, i) => `<div class="dt${i < 3 ? ' t3' : ''}"><b>${i + 1}.</b><span>${x.name}</span><em>${x.points} b · ${x.fish} ryb</em></div>`).join('')}</div></div>`);
    T0(`#${id} .wx`, { opacity: 0, scale: 0.5, rotation: -30 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2)' }, a + 0.2);
    if (di === 0) out.push(`tl.fromTo("#${id} .sun", {rotation:0}, {rotation:90, duration:${len(a, b)}, ease:"none", immediateRender:false}, ${a.toFixed(3)});`);
    else [0, 1, 2].forEach((k) => out.push(`tl.fromTo("#${id} .drop:nth-of-type(${k + 1})", {y:-4, opacity:0}, {y:4, opacity:1, duration:0.5, ease:"none", repeat:${Math.floor(len(a, b) / 0.5) - 1}, immediateRender:false}, ${(a + k * 0.17).toFixed(3)});`));
    T0(`#${id} .hud`, { opacity: 0, y: -3 * u }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, a + 0.3);
    T0(`#${id} .bump`, { opacity: 0, y: 3 * u }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, a + BEAT * 2);
    const lop = (i, j) => (i < 3 ? 1 : D.ranks[j][FINAL10[i]] <= 10 ? 0.85 : 0.32);
    FINAL10.forEach((_, i) => { T0(`#${id}-d${i}`, { opacity: 0, x: -2 * u }, { opacity: lop(i, 0), x: 0, duration: 0.3, ease: 'expo.out' }, a + BEAT * 2 + i * 0.05);
      T0(`#${id}-o${i}`, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(3)' }, a + BEAT * 2 + i * 0.05); });
    // kola: počítadlo, sloupec kola, linie a body jedou za taktem
    let cum = 0;
    D.perRound.forEach((v, j) => {
      const t = rt(j), d = BEAT * 4 - 0.05;
      CNT(`${id}-c`, cum, cum + v, t, d); cum += v;
      SET(`#${id}-k`, { innerText: j + 1 }, t);
      T(`#${id}-k`, { scale: 1.35 }, { scale: 1, duration: 0.35, ease: 'back.out(3)' }, t);
      T0(`#${id}-hi${j}`, { scaleY: 0 }, { scaleY: 1, duration: d, ease: 'none' }, t);
      T0(`#${id}-hv${j}`, { opacity: 0, y: 1 * u }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, t + d * 0.6);
      T(`#${id}-hc${j}`, { filter: 'brightness(2)' }, { filter: 'brightness(1)', duration: d, ease: 'power2.out' }, t);
      if (j > 0) {
        T(`#${id}-cr`, { attr: { width: X(j - 1) + 1.5 * u } }, { attr: { width: X(j) + 1.5 * u }, duration: d * 0.8, ease: 'power2.inOut' }, t);
        FINAL10.forEach((n, i) => {
          T(`#${id}-o${i}`, { left: X(j - 1), top: Y(D.ranks[j - 1][n]) }, { left: X(j), top: Y(D.ranks[j][n]), duration: d * 0.8, ease: 'power2.inOut' }, t);
          T(`#${id}-d${i}`, { left: X(j - 1) + 1.4 * u, top: LY[j - 1][i], opacity: lop(i, j - 1) }, { left: X(j) + 1.4 * u, top: LY[j][i], opacity: lop(i, j), duration: d * 0.8, ease: 'power2.inOut' }, t);
          if (D.ranks[j - 1][n] !== D.ranks[j][n]) SET(`#${id}-r${i}`, { innerText: `${D.ranks[j][n]}.` }, t + d * 0.4);
        });
      }
    });
    // závěr dne: top 3 dne
    const te = BAR(b0 + 13);
    T(`#${id} .bump`, { opacity: 1 }, { opacity: 0.18, duration: 0.4, ease: 'power2.out' }, te - 0.1);
    if (!P) T(`#${id} .hud`, { opacity: 1 }, { opacity: 0, y: -3 * u, duration: 0.4, ease: 'power2.in' }, te - 0.2);
    T0(`#${id}-top`, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.7)' }, te);
    T0(`#${id}-top .dt`, { opacity: 0, rotationX: -90, transformPerspective: 900, transformOrigin: '50% 0%' }, { opacity: 1, rotationX: 0, duration: 0.4, ease: 'back.out(1.6)', stagger: BEAT / 4 }, te + 0.15);
  };
  live(0); live(1);

  // ===================== 3/5) STATISTIKA DNE: 3D rybník, sloupec ryb na každém stanovišti =====================
  const stats = (di) => {
    const D = DAYS[di], id = `s-${D.k}s`, [b0, b1] = BARS[`${D.k}s`], a = BAR(b0), b = BAR(b1);
    const mx = Math.max(...Object.values(DAYS[0].stand), ...Object.values(DAYS[1].stand));
    const S = P ? 100 * u : 94 * u, colW = (P ? 2.3 : 2.1) * u, maxH = (P ? 19 : 16) * u;
    // každý den jiný úhel kamery: sobota od lesa (JV), neděle z protějšího břehu od silnice
    const CAM = di === 0 ? { x1: 56, z0: -38, z1: -12, s1: 1 } : { x1: 42, z0: 206, z1: 168, s1: 1.08 };
    const ranked = Object.entries(D.stand).map(([n, v]) => [+n, v]).sort((x, y) => y[1] - x[1] || x[0] - y[0]);
    const top5 = ranked.slice(0, 10), low3 = ranked.slice(-3).reverse();
    const tiles = [
      [D.total, 'ryb celkem', di ? `−${Math.round((1 - D.total / DAYS[0].total) * 100)} % proti sobotě` : `${dec(D.total / D.n, 1)} na závodníka`],
      [D.mostFish.fish, 'nejvíc ryb', D.mostFish.name],
      [D.rec.f, 'rekord kola', D.rec.txt],
      [D.zero, 'kol bez ryby', `z ${D.rounds} startů v kolech`],
    ];
    const pos = (n) => apos(n, S, CB);
    const cols = Object.entries(D.stand).map(([n, v]) => { const [x, y] = pos(n), h = Math.max(0.6 * u, (v / mx) * maxH), kk = v / mx;
      const g = di === 1 ? `<i class="c3g bb" id="${id}-g${n}" style="left:${f(x)}; top:${f(y)}; width:${f(colW)}; height:${f(Math.max(0.6 * u, (DAYS[0].stand[n] / mx) * maxH))}; margin:${f(-Math.max(0.6 * u, (DAYS[0].stand[n] / mx) * maxH))} 0 0 ${f(-colW / 2)}"></i>` : '';
      return `${g}<div class="c3 bb" id="${id}-c${n}" style="left:${f(x)}; top:${f(y)}; width:${f(colW)}; height:${f(h)}; margin:${f(-h)} 0 0 ${f(-colW / 2)}; --c:${heat(kk)}"><b class="cv">${v}</b></div>`; }).join('');
    const stands = Object.keys(AER.stands).map((n) => { const [x, y] = pos(n); return `<i class="sd3" style="left:${f(x)}; top:${f(y)}"><em class="bb">${n}</em></i>`; }).join('');
    scene(id, a, b, `${bgp(di === 0 ? 'bg_mcr26_zarybneni.jpg' : 'bg__drone_final_last.jpg', a, b, { op: 0.3, word: 'STANOVIŠTĚ', id: `bg-${id}` })}${head(id, `Den ${di + 1} · ryby na stanovištích`, `všech 40 stanovišť${di ? ' · čárkovaně sobota' : ''}`, a + 0.05)}
      <div class="aw aw-s" id="${id}-a">${aerial(`${id}-a`, S, CB, stands + cols, { outline: true })}</div>
      <div class="side">
        <div class="stl"><div class="sth">Top 10 stanovišť</div>${top5.map(([n, v], i) => `<div class="str" id="${id}-r${i}"><b>${i + 1}.</b><span>č. ${n}</span><i><u style="width:${((v / top5[0][1]) * 100).toFixed(1)}%; background:${heat(v / mx)}"></u></i><em>${v}</em></div>`).join('')}
          <div class="slow" id="${id}-low">nejméně ryb: ${low3.map(([n, v]) => `č. ${n} (${v})`).join(' · ')}</div></div>
        <div class="tiles2">${tiles.map(([v, l, s], i) => `<div class="tile2" id="${id}-t${i}"><b id="${id}-tv${i}">0</b><span>${l}</span><em>${s}</em></div>`).join('')}</div>
      </div>`);
    // letecký snímek se sklopí do 3D, kamera pak krouží kolem rybníka (sloupce stojí čelem ke kameře)
    T0(`#${id}-a`, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' }, a + 0.1);
    orbit(`${id}-a`, a + 0.1, b, { x0: 0, x1: CAM.x1, z0: CAM.z0, z1: CAM.z1, s0: 0.86, s1: CAM.s1, tin: 1.2 });
    T0(`#${id}-a .aol polygon`, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, a + 0.3);
    Object.keys(D.stand).forEach((n, i) => {
      SET(`#${id}-c${n}`, { rotationX: -90, transformOrigin: '50% 100%' }, a);
      if (di === 1) SET(`#${id}-g${n}`, { rotationX: -90, transformOrigin: '50% 100%', opacity: 0 }, a);
      const t = a + 1.0 + i * 0.045;
      T0(`#${id}-c${n}`, { scaleY: 0 }, { scaleY: 1, duration: 0.55, ease: 'back.out(1.6)' }, t);
      T0(`#${id}-c${n} .cv`, { opacity: 0 }, { opacity: 1, duration: 0.2 }, t + 0.35);
    });
    if (di === 1) T(`#${id} .c3g`, { opacity: 0 }, { opacity: 1, duration: 0.5 }, a + BEAT * 9);
    // top 5: řádek + sloupec na rybníku zazáří
    top5.forEach(([n], i) => { const t = a + BEAT * (6 + i * 0.5);
      T0(`#${id}-r${i}`, { opacity: 0, x: 4 * u, rotationY: -40, transformPerspective: 900 }, { opacity: 1, x: 0, rotationY: 0, duration: 0.5, ease: 'expo.out' }, t);
      T(`#${id}-c${n}`, { filter: 'brightness(1)' }, { filter: 'brightness(1.8) drop-shadow(0 0 10px rgba(255,211,107,.9))', duration: 0.3, yoyo: true, repeat: 1 }, t); });
    pop(`#${id}-low`, a + BEAT * 11.5); pop(`#${id} .sth`, a + BEAT * 5.5);
    tiles.forEach(([v], i) => { const t = a + BEAT * (13 + i); pop(`#${id}-t${i}`, t); CNT(`${id}-tv${i}`, 0, v, t + 0.05, 0.9); });
  };
  stats(0); stats(1);

  // ===================== kompletní pořadí (všech 39): mřížka 3×13 (16:9) / 2×20 (9:16) =====================
  const LG = P ? { cols: 2, rows: 20, top: 40 * u, h: 126 * u } : { cols: 3, rows: 13, top: SAFE.t + 14 * u, h: 66 * u };
  const lgrid = (id, rows, hdr) => `<div class="lgh" style="top:${f(LG.top - 3 * u)}; grid-template-columns:repeat(${LG.cols}, 1fr)">${Array.from({ length: LG.cols }, () => `<div class="lr lrh">${hdr}</div>`).join('')}</div>
    <div class="lg" id="${id}-lg" style="top:${f(LG.top)}; height:${f(LG.h)}; grid-template-columns:repeat(${LG.cols}, 1fr); grid-template-rows:repeat(${LG.rows}, 1fr)">${rows.join('')}</div>`;
  const lrow = (id, i, inner, bar = null) => `<div class="lr${i < 3 ? ' g' : ''}${i < 10 ? ' t' : ''}" id="${id}-l${i}">${bar !== null ? `<i class="lb" style="width:${(bar * 100).toFixed(1)}%"></i>` : ''}<b>${i + 1}.</b>${inner}</div>`;
  const lin = (id, n, t, bars = true, step = 0.035) => { for (let i = 0; i < n; i++) {
    T0(`#${id}-l${i}`, { opacity: 0, rotationX: -90, transformPerspective: 900, transformOrigin: '50% 0%' }, { opacity: 1, rotationX: 0, duration: 0.42, ease: 'back.out(1.6)' }, t + i * step);
    if (bars) T0(`#${id}-l${i} .lb`, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'expo.out' }, t + 0.15 + i * step); } };
  const lhi = (id, t) => { [0, 1, 2].forEach((i) => T(`#${id}-l${i}`, { scale: 1 }, { scale: 1.06, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.inOut' }, t + i * BEAT * 0.5)); };
  const dayList = (di) => {
    const D = DAYS[di], id = `s-${D.k}l`, [b0, b1] = BARS[`${D.k}l`], a = BAR(b0), b = BAR(b1);
    const mf = Math.max(...D.A.map((x) => x.fish));
    scene(id, a, b, `${bgp(di === 0 ? 'bg_mcr26_breh_pruty.jpg' : 'bg_mcr26_kontrola_vysledku.jpg', a, b, { op: 0.2, word: di === 0 ? 'SOBOTA' : 'NEDĚLE', id: `bg-${id}` })}${head(id, `Den ${di + 1} · celé pořadí`, `všech ${D.n} závodníků · body · ryby`, a + 0.05)}
      ${lgrid(id, D.top.map((x, i) => lrow(id, i, `<span>${x.name}</span><em>${x.points} b</em><u>${x.fish}</u>`, x.fish / mf)), '<b>#</b><span>závodník</span><em>body</em><u>ryby</u>')}`);
    T0(`#${id} .lgh`, { opacity: 0 }, { opacity: 1, duration: 0.4 }, a + BEAT * 2);
    lin(id, D.n, a + BEAT * 2); lhi(id, a + BEAT * 9);
  };
  dayList(0); dayList(1);

  // ===================== 6) VÝSLEDEK MČR: součet umístění, všech 39 =====================
  {
    const id = 's-mcr', a = BAR(BARS.mcr[0]), b = BAR(BARS.mcr[1]), tl0 = a + BEAT * 8;
    scene(id, a, b, `${bgp('bg_mcr26_kontrola_vysledku.jpg', a, b, { op: 0.24, word: 'MČR 2026', id: 'bg-mcr' })}${head(id, 'Výsledek MČR', 'součet umístění z obou dnů · nižší vyhrává', a + 0.05)}
      <div class="rule big" id="mr-rule"><b>Den 1 + Den 2 = Σ</b><span>soutěžní řád 6.4–6.5 · při shodě rozhoduje řád</span></div>
      ${lgrid(id, MCRALL.map((x, i) => lrow(id, i, `<span>${x.name}</span><em>${x.d1}.</em><em>${x.d2}.</em><u>${x.d1 + x.d2}</u>`)), '<b>#</b><span>závodník</span><em>D1</em><em>D2</em><u>Σ</u>')}`);
    T0('#mr-rule', { opacity: 0, scale: 0.6, rotationX: -60, transformPerspective: 900 }, { opacity: 1, scale: 1, rotationX: 0, duration: 0.6, ease: 'back.out(2)' }, a + BEAT * 2);
    T('#mr-rule', { scale: 1 }, { scale: 1.08, duration: 0.2, yoyo: true, repeat: 1 }, a + BEAT * 4);
    T('#mr-rule', { opacity: 1 }, { opacity: 0, scale: 0.8, duration: 0.3, ease: 'power2.in' }, tl0 - 0.35);
    T0(`#${id} .lgh`, { opacity: 0 }, { opacity: 1, duration: 0.4 }, tl0);
    lin(id, MCRALL.length, tl0, false);
    [0, 1, 2].forEach((i) => T(`#${id}-l${i}`, { boxShadow: '0 0 0 0px rgba(255,211,107,0)' }, { boxShadow: `0 0 0 ${(0.35 * u).toFixed(1)}px rgba(255,211,107,1), 0 0 ${(2.5 * u).toFixed(0)}px rgba(255,211,107,.45)`, duration: 0.4, ease: 'power2.out' }, b - BEAT * 9 + i * BEAT));
  }

  // ===================== 6b) RYBY NA ZÁVODNÍKA (oba dny) =====================
  {
    const id = 's-fpa', a = BAR(BARS.fpa[0]), b = BAR(BARS.fpa[1]), mt = FPA[0].t, avg = FPA.reduce((s0, x) => s0 + x.t, 0) / FPA.length;
    scene(id, a, b, `${bgp('bg_mcr26_podberak.jpg', a, b, { op: 0.2, word: 'RYBY', id: 'bg-fpa' })}${head(id, 'Ryby na závodníka', `oba dny · Ø ${dec(avg, 1)} ryb na závodníka`, a + 0.05)}
      <div class="fleg" id="fleg"><span><i></i>sobota</span><span><i class="n"></i>neděle</span></div>
      ${lgrid(id, FPA.map((x, i) => `<div class="lr fr${i < 3 ? ' g' : ''}" id="${id}-l${i}"><b>${FPA.findIndex((y) => y.t === x.t) + 1}.</b><span>${short(x.name)}</span><i class="fb"><s style="width:${((x.f1 / mt) * 100).toFixed(1)}%"></s><s class="n" style="width:${((x.f2 / mt) * 100).toFixed(1)}%"></s></i><em>${x.f1}+${x.f2}</em><u>${x.t}</u></div>`), '<b>#</b><span>závodník</span><i></i><em>So+Ne</em><u>Σ</u>')}`);
    pop('#fleg', a + BEAT * 2);
    T0(`#${id} .lgh`, { opacity: 0 }, { opacity: 1, duration: 0.4 }, a + BEAT * 2);
    FPA.forEach((_, i) => { const t = a + BEAT * 2 + i * 0.04;
      T0(`#${id}-l${i}`, { opacity: 0, x: -2 * u }, { opacity: 1, x: 0, duration: 0.35, ease: 'expo.out' }, t);
      T0(`#${id}-l${i} .fb s:first-child`, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'expo.out' }, t + 0.1);
      T0(`#${id}-l${i} .fb s.n`, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'expo.out' }, t + 0.5); });
    lhi(id, a + BEAT * 10);
  }

  // ===================== 7) STUPNĚ VÍTĚZŮ + kde vyhrávali =====================
  {
    const id = 's-pod', a = BAR(BARS.pod[0]), b = BAR(BARS.pod[1]), mid = BAR(BARS.pod[0] + 3);
    const top3 = MCR.slice(0, 3).map((x) => {
      const r1 = byName(0, x.name), r2 = byName(1, x.name);
      return { ...x, r1, r2, fish: r1.fish + r2.fish, wins: r1.wins + r2.wins, pts: r1.points + r2.points };
    });
    const PC = ['#e31e24', '#ffd36b', '#7fd0ff'];
    // každý medailista: vlastní barva, vlastní úhel kamery; pin na stanovišti každého kola (výška = ryby v kole)
    const MS = P ? 98 * u : 86 * u;
    const CAMS = [{ x1: 52, z0: -32, z1: -6 }, { x1: 40, z0: 28, z1: 8 }, { x1: 60, z0: 196, z1: 168 }];
    const TROPHY = '<svg viewBox="0 0 24 24"><path d="M6 3h12v2h3v3a4 4 0 0 1-4 4h-.6A6 6 0 0 1 13 14.9V17h3v3H8v-3h3v-2.1A6 6 0 0 1 7.6 12H7a4 4 0 0 1-4-4V5h3zm0 4H5v1a2 2 0 0 0 1 1.7zm12 0v2.7A2 2 0 0 0 19 8V7z"/></svg>';
    const pinsOf = (x, i) => [x.r1, x.r2].flatMap((rr, d) => rr.rounds.map((r, j) => { const [px0, py0] = apos(r.los, MS, CB), kind = r.pts === 3 ? 'w' : r.pts > 0 ? 'd' : 'l';
      const h = (0.8 + (r.fish || 0) * 0.75) * u, off = (d ? 0.9 : -0.9) * u;
      const pw = 6 * u, ph = h + 5 * u;
      return `<div class="pin bb ${kind} dd${d}" id="pn${i}_${d}_${j}" style="left:${f(px0)}; top:${f(py0)}; width:${f(pw)}; height:${f(ph)}; margin:${f(-ph)} 0 0 ${f(-pw / 2)}; --c:${PC[i]}"><i class="stem" style="height:${f(h)}; left:calc(50% + ${f(off)})"></i><b class="hd" style="bottom:${f(h)}; left:calc(50% + ${f(off)})">${kind === 'w' ? TROPHY : ''}</b></div>`; })).join('');
    const sdots = (i) => Object.keys(AER.stands).map((n) => { const [x0, y0] = apos(n, MS, CB); return `<i class="sd3 sm3" style="left:${f(x0)}; top:${f(y0)}"></i>`; }).join('');
    const maps = top3.map((x, i) => `<div class="aw aw-p" id="wm${i}">${aerial(`wm${i}`, MS, CB, sdots(i) + pinsOf(x, i))}</div>
      <div class="pcard" id="pcard${i}" style="--c:${PC[i]}"><div class="pcn"><b>${i + 1}.</b> ${x.name}</div>
        <div class="pcs"><span><b>${x.r1.wins}+${x.r2.wins}</b>výher</span><span><b>${x.r1.fish}+${x.r2.fish}</b>ryb</span><span><b>${x.d1}.+${x.d2}.</b>místo</span></div>
        <div class="pleg"><span><i class="lw">${TROPHY}</i>výhra</span><span><i class="ld"></i>remíza</span><span><i class="ll"></i>prohra</span><span><i class="l1"></i>sobota</span><span><i class="l2"></i>neděle</span><span>výška = ryby v kole</span></div></div>`).join('');
    const order = [1, 0, 2];
    scene(id, a, b, `${bgp('bg_t07_gold_cups.jpg', a, b, { op: 0.55, word: 'VÍTĚZOVÉ', id: 'bg-pod' })}${head(id, 'Stupně vítězů', 'Mistrovství ČR v Trout Area 2026', a + 0.05)}
      <div class="pods" id="pods">${order.map((i) => { const x = top3[i]; return `<div class="pd p${i + 1}" id="pd${i}">${i === 0 ? '<div class="glow" id="pglow"></div>' : ''}<div class="pn">${i + 1}.</div><div class="pnm">${x.name}</div>
        <div class="pst"><span><b>${x.d1}.+${x.d2}.</b>umístění</span><span><b>${x.fish}</b>ryb</span><span><b>${x.wins}</b>výher</span></div>
        <div class="col" style="height:${[0, 1, 2].map((k) => [22, 16, 11][k])[i] * u}px"></div></div>`; }).join('')}</div>
      <div class="prize" id="prize"><img src="assets/logos/gausseholler.png" alt=""><span>hlavní cena <b>Revolut 8</b></span><img class="pb" src="assets/logos/bosset.png" alt=""><span>termosky <b>Zojirushi</b></span></div>
      ${maps}<div class="wcap" id="wcap">kde medailisté vyhrávali · 24 kol</div>`);
    [2, 1, 0].forEach((i, k) => { const t = a + BEAT * (2 + k * 2); T0(`#pd${i}`, { opacity: 0, y: 8 * u, rotationX: 70, transformPerspective: 1200, transformOrigin: '50% 100%' }, { opacity: 1, y: 0, rotationX: 0, duration: 0.7, ease: 'back.out(1.6)' }, t); T0(`#pd${i} .col`, { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: 'expo.out' }, t + 0.1); });
    T(`#pd0`, { scale: 1 }, { scale: 1.06, duration: 0.25, yoyo: true, repeat: 3 }, a + BEAT * 7);
    T0('#pglow', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }, a + BEAT * 6);
    out.push(`tl.fromTo("#pglow", {rotation:0}, {rotation:60, duration:${len(a, mid)}, ease:"none", immediateRender:false}, ${a.toFixed(3)});`);
    T0('#prize', { opacity: 0, y: 2 * u }, { opacity: 0.95, y: 0, duration: 0.5, ease: 'power3.out' }, a + BEAT * 8);
    // mapy medailistů – každý 3 takty, jiný úhel
    T('#pods, #prize', { opacity: 1 }, { opacity: 0, y: -3 * u, duration: 0.35, ease: 'power2.in' }, mid - 0.35);
    T('#pglow', { opacity: 1 }, { opacity: 0, duration: 0.35 }, mid - 0.35);
    pop('#wcap', mid);
    top3.forEach((x, i) => { const t0 = BAR(BARS.pod[0] + 3 + i * 3), t1 = i < 2 ? BAR(BARS.pod[0] + 6 + i * 3) : b, C = CAMS[i];
      T0(`#wm${i}`, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power2.out' }, t0);
      orbit(`wm${i}`, t0, t1, { x0: 0, x1: C.x1, z0: C.z0, z1: C.z1, s0: 0.85, s1: 1, tin: 1.0 });
      [0, 1].forEach((d) => (d ? x.r2 : x.r1).rounds.forEach((r, j) => SET(`#pn${i}_${d}_${j}`, { rotationX: -90, transformOrigin: '50% 100%' }, t0)));
      const seq = [0, 1].flatMap((d) => Array.from({ length: 12 }, (_, j) => [d, j]));
      seq.forEach(([d, j], k) => T0(`#pn${i}_${d}_${j} > *`, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2.6)', transformOrigin: '50% 100%' }, t0 + 0.6 + k * 0.1));
      T0(`#pcard${i}`, { opacity: 0, x: (P ? 0 : 4) * u, y: (P ? 2 : 0) * u }, { opacity: 1, x: 0, y: 0, duration: 0.5, ease: 'expo.out' }, t0 + 0.2);
      T0(`#pcard${i} .pcs span`, { opacity: 0, rotationX: -80, transformPerspective: 700 }, { opacity: 1, rotationX: 0, duration: 0.4, ease: 'back.out(2)', stagger: BEAT / 2 }, t0 + BEAT * 2);
      T(`#wm${i} .pin.w .hd`, { scale: 1 }, { scale: 1.35, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.inOut' }, t0 + BEAT * 9);
      if (i < 2) T(`#wm${i}, #pcard${i}`, { opacity: 1 }, { opacity: 0, duration: 0.3, ease: 'power2.in' }, t1 - 0.3); });
  }

  // ===================== 8) MISTR TROUT AREA ČR: 6 nejlepších z 8 =====================
  {
    const id = 's-sez', a = BAR(BARS.sez[0]), b = BAR(BARS.sez[1]);
    const tStrike = BAR(BARS.sez[0] + 3) + BEAT * 2, tSort = BAR(BARS.sez[0] + 5) + BEAT * 2, tFin = BAR(BARS.sez[0] + 7) + BEAT * 2;
    const N = SEZ.length, rowH = P ? 5 * u : 6 * u;
    const yAll = (r) => ALL10.indexOf(r.name) >= 0 ? ALL10.indexOf(r.name) : 10 + B6TOP.indexOf(r.name);
    const yB6 = (r) => B6TOP.indexOf(r.name) >= 0 ? B6TOP.indexOf(r.name) : 10 + ALL10.indexOf(r.name);
    const cell = (p, c, k) => `<span class="sc${ABSENT(p) ? ' ab' : ''}${c ? '' : ' x'}"><i>${ABSENT(p) ? '–' : p}</i></span>`;
    const champ = SEZ.find((x) => x.b6Rank === 1), s2 = SEZ.find((x) => x.b6Rank === 2), s3 = SEZ.find((x) => x.b6Rank === 3);
    const hra = SEZ.filter((x) => x.allRank > 10).sort((x, y) => (x.allRank - x.b6Rank) - (y.allRank - y.b6Rank)).pop();
    const ph = PHOTOS.winners ? `<div class="chph" style="background-image:url(assets/photos/${PHOTOS.winners})"></div>` : '';
    scene(id, a, b, `${bgp('bg_mcr26_porada.jpg', a, tFin, { op: 0.24, word: 'SEZÓNA 2026', id: 'bg-sez' })}${head(id, 'Mistr Trout Area ČR 2026', 'sezóna · 8 bodovaných závodů', a + 0.05)}
      <div class="sm" id="sm"><div class="smh"><span class="sp">#</span><span class="sn">závodník</span>${EV.map((e, k) => `<span class="sc h"><i>${EVS[k]}</i><em>${EVD[k]}</em></span>`).join('')}<span class="sa">Ø</span></div>
        <div class="smb" style="height:${f(rowH * 10)}">${SEZ.map((x, i) => `<div class="smr" id="sr${i}" style="top:${f(yAll(x) * rowH)}; height:${f(rowH)}"><span class="sp"><b id="srp${i}">${yAll(x) + 1}</b></span><span class="sn">${x.name}${x === hra ? `<em class="jmp" id="sz-jump">▲ ${hra.allRank}. → ${hra.b6Rank}.</em>` : ''}</span>${x.pos.map((p, k) => cell(p, x.cnt[k], k)).join('')}<span class="sa"><b id="sra${i}">${dec(x.all)}</b></span></div>`).join('')}</div></div>
      <div class="rule srule" id="sz-rule"><b>Počítá se 6 nejlepších z 8</b><span>2 nejhorší výsledky se škrtají</span></div>
      <div class="champ" id="champ">${ph}<div class="chk"><span>Mistr Trout Area ČR 2026</span></div><div class="chn"><span>${champ.name}</span></div>
        <div class="chs" id="chs">podruhé za sebou · Ø ${dec(champ.b6)}</div>
        <div class="ch23"><span><b>2.</b> ${s2.name} · Ø ${dec(s2.b6)}</span><span><b>3.</b> ${s3.name} · Ø ${dec(s3.b6)}</span></div></div>`);
    // matice: řádky top 10 (všech 8), sloupce po závodech
    SEZ.forEach((x, i) => { SET(`#sr${i}`, { opacity: yAll(x) < 10 ? 1 : 0 }, a); });
    T0('#sm', { opacity: 0, y: 3 * u }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, a + BEAT * 2);
    for (let k = 0; k < 8; k++) T0(`#sm .smr .sc:nth-of-type(${k + 3}) i, #sm .smh .sc:nth-of-type(${k + 3})`, { rotationY: 90, opacity: 0, transformPerspective: 600 }, { rotationY: 0, opacity: 1, duration: 0.4, ease: 'back.out(2)', stagger: 0.025 }, a + BEAT * (3 + k * 0.75));
    // pravidlo + škrtání
    T0('#sz-rule', { opacity: 0, y: -2 * u }, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(2)' }, tStrike - BEAT * 3);
    T('#sz-rule', { scale: 1 }, { scale: 1.08, duration: 0.2, yoyo: true, repeat: 1 }, tStrike - BEAT);
    T('#sz-rule', { opacity: 1 }, { opacity: 0, duration: 0.3 }, tFin - 0.4);
    SEZ.forEach((x, i) => x.cnt.forEach((c, k) => { if (!c) { const t = tStrike + (yAll(x) % 10) * 0.12;
      T(`#sr${i} .sc:nth-of-type(${k + 3})`, { '--x': 0 }, { '--x': 1, duration: 0.3, ease: 'power2.out' }, t);
      T(`#sr${i} .sc:nth-of-type(${k + 3}) i`, { opacity: 1 }, { opacity: 0.3, duration: 0.3 }, t); } }));
    // přepočet Ø a přeskupení
    SEZ.forEach((x, i) => {
      CNT(`sra${i}`, x.all, x.b6, tSort - BEAT * 2, 0.8, 2);
      T(`#sr${i}`, { top: yAll(x) * rowH, opacity: yAll(x) < 10 ? 1 : 0 }, { top: yB6(x) * rowH, opacity: yB6(x) < 10 ? 1 : 0, duration: 0.9, ease: 'power3.inOut' }, tSort);
      SET(`#srp${i}`, { innerText: yB6(x) + 1 }, tSort + 0.45);
    });
    if (hra) { const hi = SEZ.indexOf(hra);
      T(`#sr${hi}`, { backgroundColor: 'rgba(255,211,107,0)' }, { backgroundColor: 'rgba(255,211,107,.32)', duration: 0.35 }, tSort + 1);
      T0('#sz-jump', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2.5)' }, tSort + 1.1); }
    ['#sr' + SEZ.indexOf(champ), '#sr' + SEZ.indexOf(s2), '#sr' + SEZ.indexOf(s3)].forEach((s, k) =>
      T(s, { backgroundColor: 'rgba(227,30,36,0)' }, { backgroundColor: k ? 'rgba(142,162,216,.3)' : 'rgba(227,30,36,.35)', duration: 0.35 }, tFin - BEAT * 2 + k * BEAT));
    // šampion
    T('#sm', { opacity: 1 }, { opacity: 0, scale: 0.96, duration: 0.4, ease: 'power2.in' }, tFin - 0.1);
    T0('#champ', { opacity: 0 }, { opacity: 1, duration: 0.3 }, tFin + 0.2);
    if (ph) T0('#champ .chph', { scale: 1.12 }, { scale: 1, duration: len(tFin, b), ease: 'sine.out' }, tFin);
    rise('#champ .chk span', tFin + 0.3); rise('#champ .chn span', tFin + 0.3 + BEAT);
    pop('#chs', tFin + 0.3 + BEAT * 3); T('#chs', { scale: 1 }, { scale: 1.1, duration: 0.25, yoyo: true, repeat: 3 }, tFin + BEAT * 6);
    pop('#champ .ch23 span:nth-child(1)', tFin + BEAT * 6); pop('#champ .ch23 span:nth-child(2)', tFin + BEAT * 7);
  }

  // ===================== 9) PARTNEŘI (bez textu) =====================
  {
    const id = 's-end', a = BAR(BARS.end[0]), b = DUR;
    scene(id, a, b, `<div class="pgw"><div class="pg">${PARTNERS.map((k, i) => `<div class="pl" id="pl${i}"><img src="assets/logos/light/${k}.png" alt=""></div>`).join('')}</div></div>
      <div class="tap end" id="tap-end"><img src="assets/ta_logo.png" alt="Trout Area Czech Republic"></div>
      <div class="ghm" id="gh-end"><span class="by">made by</span><span class="gear"><img class="ring" src="assets/gh/ring.png" alt=""><img class="core" src="assets/gh/core.png" alt=""></span><img class="wl2" src="assets/gh/word-line.png" alt="Gausse Holler"></div>`);
    PARTNERS.forEach((_, i) => { const t = a + 0.05 + i * BEAT * 0.5, ang = rnd(i + 3) * 16 - 8;
      T0(`#pl${i}`, { opacity: 0, scale: 0.4, rotation: ang, y: (rnd(i) - 0.5) * 20 * u }, { opacity: 1, scale: 1, rotation: 0, y: 0, duration: 0.55, ease: 'back.out(1.8)' }, t); });
    G.beats.filter((t) => t > a + BEAT * 5 && t < b - BEAT * 4).forEach((t, k) => T(`#pl${k % 9}`, { scale: 1.12 }, { scale: 1, duration: 0.3, ease: 'power2.out' }, t));
    T('.pgw', { opacity: 1 }, { opacity: 0, scale: 0.92, duration: 0.4 }, b - BEAT * 4);
    T0('#tap-end', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.6)' }, b - BEAT * 3.5);
    T0('#gh-end', { opacity: 0, y: 2 * u }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, b - BEAT * 2.5);
    T0('#gh-end .ring', { rotation: 0 }, { rotation: 120, duration: BEAT * 2.5, ease: 'none' }, b - BEAT * 2.5);
  }

  // ===================== BEAT FX (styl Klonówiec): drum-pad, ekvalizér, údery =====================
  const beatsIn = (a, b) => G.beats.filter((t) => t >= a && t < b - 0.05);
  const padRun = (selFn, n, a, b, lvl = 2.2, d = 0.22) => beatsIn(a, b).forEach((t, i) =>
    out.push(`tl.fromTo(${JSON.stringify(selFn(i % n))}, {filter:"brightness(${lvl}) saturate(1.3)"}, {filter:"brightness(1) saturate(1)", duration:${d}, ease:"power2.out", immediateRender:false}, ${t.toFixed(3)});`));
  const eq = (selFn, n, a, b, amp = 0.35) => beatsIn(a, b).forEach((t, bi) => { for (let k = 0; k < n; k++) { const lv = 1 - amp + rnd(bi * 31 + k * 7) * amp * 1.6;
    out.push(`tl.fromTo(${JSON.stringify(selFn(k))}, {scaleY:${lv.toFixed(2)}}, {scaleY:1, duration:${(BEAT * 0.9).toFixed(3)}, ease:"power2.out", immediateRender:false}, ${t.toFixed(3)});`); } });
  const punch = (sel, a, b, every = 1, sc = 1.06) => beatsIn(a, b).filter((_, i) => i % every === 0).forEach((t) =>
    out.push(`tl.fromTo(${JSON.stringify(sel)}, {scale:${sc}}, {scale:1, duration:0.25, ease:"power2.out", immediateRender:false}, ${t.toFixed(3)});`));
  ['d1', 'd2'].forEach((k) => { const id = `s-${k}`, [b0, b1] = BARS[k];
    punch(`#${id}-c`, BAR(b0 + 1), BAR(b0 + 13), 1, 1.07);                                           // počítadlo ryb na každou dobu
    padRun((j) => `#${id}-hc${j}`, 12, BAR(b0 + 1), BAR(b0 + 13), 1.9, 0.2);                        // běžící světlo po sloupcích kol
    eq((j) => `#${id}-hi${j}`, 12, BAR(b0 + 13), BAR(b1), 0.4);                                     // po dni: sloupce kol hrají
    padRun((j) => `#${id}-top .dt:nth-child(${j + 1})`, 10, BAR(b0 + 13) + 1.6, BAR(b1), 1.25, 0.25); });
  ['d1s', 'd2s'].forEach((k) => { const id = `s-${k}`, [b0, b1] = BARS[k], keys = Object.keys(POND.stands);
    padRun((j) => `#${id}-c${keys[j]}`, 40, BAR(b0) + 3.2, BAR(b1), 1.7, 0.18);                      // světlo běží kolem rybníka po stanovištích
    padRun((j) => `#${id}-r${j}`, 10, BAR(b0) + BEAT * 11, BAR(b1), 1.12, 0.22); });
  // celé pořadí: světlo běží po řádcích na každou dobu
  ['d1l', 'd2l'].forEach((k) => padRun((j) => `#s-${k}-l${j}`, 39, BAR(BARS[k][0]) + BEAT * 6, BAR(BARS[k][1]), 1.35, 0.25));
  padRun((j) => `#s-mcr-l${j}`, 39, BAR(BARS.mcr[0]) + BEAT * 14, BAR(BARS.mcr[1]), 1.35, 0.25);
  padRun((j) => `#s-fpa-l${j}`, 39, BAR(BARS.fpa[0]) + BEAT * 8, BAR(BARS.fpa[1]), 1.6, 0.25);
  padRun((j) => `#sm .smh .sc:nth-of-type(${j + 3})`, 8, BAR(BARS.sez[0]) + BEAT * 9, BAR(BARS.sez[0] + 3), 2.2, 0.2);
  // nadpisy dostanou úder na každý takt (silnější každé 4 takty)
  G.downbeats.forEach((t, i) => { if (t < 0.3 || t > DUR - 0.3) return; const big = i % 4 === 0;
    out.push(`tl.fromTo(".h2 span", {scale:${big ? 1.06 : 1.03}, x:${big ? -0.4 * u : 0}}, {scale:1, x:0, duration:0.3, ease:"power3.out", immediateRender:false}, ${t.toFixed(3)});`); });

  // ===================== globální FX =====================
  const NW = 16;
  starts.filter((t) => t > 1 && t < DUR - 1).forEach((t0) => {
    const t = t0 - 0.18;
    for (let i = 0; i < NW; i++) { const dl = Math.abs(i - (NW - 1) / 2) * 0.012;
      out.push(`tl.fromTo("#wp${i}", {scaleY:0}, {scaleY:${(0.55 + rnd(i + t0) * 0.45).toFixed(2)}, duration:0.16, ease:"power3.out", immediateRender:false}, ${(t + dl).toFixed(3)});`);
      out.push(`tl.to("#wp${i}", {scaleY:0, duration:0.22, ease:"power3.in"}, ${(t + 0.2 + dl).toFixed(3)});`); }
  });
  G.downbeats.forEach((t, i) => { if (t < 0.3 || t > DUR - 0.3) return; const big = i % 4 === 0;
    out.push(`tl.fromTo("#flash", {opacity:${big ? 0.16 : 0.06}}, {opacity:0, duration:${big ? 0.45 : 0.25}, ease:"power2.out", immediateRender:false}, ${t.toFixed(3)});`);
    if (big) out.push(`tl.fromTo("#stage", {scale:1.03}, {scale:1, duration:0.5, ease:"power2.out", immediateRender:false}, ${t.toFixed(3)});`); });
  G.beats.forEach((t) => { if (t < 0.3 || t > DUR - 0.3) return; out.push(`tl.fromTo("#st-rays", {opacity:.3}, {opacity:.14, duration:0.3, ease:"power2.out", immediateRender:false}, ${t.toFixed(3)});`); });
  out.push(`tl.fromTo("#st-rays", {rotation:0}, {rotation:40, duration:${DUR}, ease:"none"}, 0);`);
  // pomalu plující barevné skvrny (mesh gradient) a stoupající částice (bublinky)
  [[0, '#2a5bd6', -20, 10], [1, '#e31e24', 25, -15], [2, '#1aa0c8', -10, 25]].forEach(([k, , dx, dy]) =>
    out.push(`tl.fromTo("#blob${k}", {xPercent:0, yPercent:0}, {xPercent:${dx}, yPercent:${dy}, duration:${(DUR / 4).toFixed(2)}, ease:"sine.inOut", yoyo:true, repeat:3}, 0);`));
  for (let i = 0; i < 34; i++) { const per = 9 + rnd(i * 5) * 9, st = rnd(i * 11) * per * 0.6, rep = Math.ceil((DUR - st) / per);
    out.push(`tl.fromTo("#pt${i}", {y:${H * 1.05}, x:0, opacity:0}, {y:${-H * 0.08}, x:${((rnd(i) - 0.5) * 8 * u).toFixed(1)}, opacity:${(0.25 + rnd(i * 13) * 0.4).toFixed(2)}, duration:${per.toFixed(2)}, ease:"none", repeat:${rep}}, ${st.toFixed(2)});`); }
  // paprsky jen v intru, na stupních, u šampiona a na konci; v datových scénách tlumené + vinětace
  const calm = (t, on) => { T('#rays-w', { opacity: on ? 1 : 0.3 }, { opacity: on ? 0.3 : 1, duration: 0.5 }, t); T('#vig', { opacity: on ? 0 : 1 }, { opacity: on ? 1 : 0, duration: 0.5 }, t); };
  SET('#vig', { opacity: 0 }, 0);
  calm(BAR(BARS.d1[0]), true); calm(BAR(BARS.pod[0]), false); calm(BAR(BARS.sez[0]), true); calm(BAR(BARS.sez[0] + 7) + BEAT * 2, false);
  // malý TA logo v rohu (mimo intro a konec)
  T0('#corner', { opacity: 0 }, { opacity: 0.9, duration: 0.5 }, BAR(BARS.d1[0]));
  T('#corner', { opacity: 0.9 }, { opacity: 0, duration: 0.4 }, BAR(BARS.end[0]) - 0.4);

  // vložit kruhy výher do SVG rybníka
  let html = scenes.join('\n  ');
  scenesExtra.forEach(({ svg, html: h }) => { html = html.replace(new RegExp(`(<svg class="pond" id="${svg}"[^>]*>)`), `$1${h}`); });
  scenesExtra.length = 0;

  const doc = `<!doctype html>
<html lang="cs"><head><meta charset="UTF-8" /><meta name="viewport" content="width=${W}, height=${H}" />
<title>MČR 2026 – výsledky v číslech (${P ? '9:16' : '16:9'})</title>
<script src="assets/gsap.min.js"></script>
<style>
  ${FONTS}
  :root { --blue:#304285; --red:#e31e24; --navy:#0b1e42; --ice:#eef2f9; --deep:#050d22; --gold:#ffd36b; --lb:#8ea2d8; }
  body { margin:0; background:var(--deep); color:var(--ice); font-family:Montserrat, sans-serif; font-variant-numeric:tabular-nums; }
  * { font-family:Montserrat, sans-serif !important; } svg text { font-family:Montserrat !important; }
  #root { position:relative; width:${W}px; height:${H}px; overflow:hidden; background:var(--deep); }
  .clip { position:absolute; inset:0; transform-style:preserve-3d; } #root { perspective:2000px; }
  #stage { position:absolute; inset:0; overflow:hidden; }
  #st-bg { position:absolute; inset:${px(-6)}; background:radial-gradient(90% 60% at 50% 42%, #1d3a86 0%, #0b1e42 62%, #050d22 100%); }
  #st-rays { position:absolute; left:50%; top:45%; width:${px(260)}; height:${px(260)}; margin:${px(-130)} 0 0 ${px(-130)}; border-radius:50%; opacity:.16;
    background:repeating-conic-gradient(from 0deg, rgba(238,242,249,.55) 0deg 3deg, transparent 3deg 14deg); -webkit-mask-image:radial-gradient(circle, #000 0%, transparent 62%); }
  #rays-w { position:absolute; inset:0; }
  .blob { position:absolute; width:${px(P ? 110 : 80)}; height:${px(P ? 110 : 80)}; border-radius:50%; filter:blur(${px(9)}); opacity:.35; }
  #blob0 { left:-15%; top:-10%; background:radial-gradient(circle, #2a5bd6 0%, transparent 65%); } #blob1 { right:-20%; bottom:-15%; background:radial-gradient(circle, rgba(227,30,36,.75) 0%, transparent 65%); opacity:.22; } #blob2 { left:30%; top:40%; background:radial-gradient(circle, #1aa0c8 0%, transparent 65%); opacity:.18; }
  #parts { position:absolute; inset:0; pointer-events:none; z-index:1; } #parts i { position:absolute; top:0; border-radius:50%; background:radial-gradient(circle, rgba(220,236,255,.95), rgba(220,236,255,0) 70%); opacity:0; }
  .bgp { position:absolute; inset:-4%; background-size:cover; background-position:50% 40%; filter:grayscale(.15) saturate(.95) brightness(.82) contrast(1.06); opacity:0; }
  .bgo { position:absolute; inset:0; background:linear-gradient(180deg, rgba(5,13,34,.45) 0%, rgba(11,30,66,.2) 45%, rgba(5,13,34,.6) 100%); mix-blend-mode:multiply; }
  .bgw { position:absolute; left:0; ${P ? `top:${px(150)}` : `bottom:${px(-4)}`}; white-space:nowrap; font:900 ${px(P ? 30 : 24)} Montserrat; text-transform:uppercase; letter-spacing:-.02em; color:transparent; -webkit-text-stroke:${px(0.22)} rgba(238,242,249,.10); }
  .pond .secb { fill:none; stroke-width:34; stroke-linecap:round; stroke-linejoin:round; opacity:.55; stroke-dasharray:1; }
  .pond .secl { transform-box:fill-box; } .pond .secl text.sln { font:900 26px Montserrat; fill:#0b1e42; } .pond .secl text.slv { font:900 30px Montserrat; fill:#0b1e42; } #vig { position:absolute; inset:0; background:radial-gradient(75% 70% at 50% 55%, rgba(11,30,66,.65) 0%, rgba(11,30,66,.35) 60%, rgba(5,13,34,.2) 100%); opacity:0; }
  #st-dots { position:absolute; inset:0; opacity:.12; background:radial-gradient(circle, #9cc8f0 ${px(0.18)}, transparent ${px(0.24)}) 0 0 / ${px(1.6)} ${px(1.6)}; }
  #grain { position:absolute; inset:0; background:url(assets/grain.png) 0 0 / 256px 256px; opacity:.45; mix-blend-mode:overlay; pointer-events:none; }
  #flash { position:absolute; inset:0; background:radial-gradient(70% 60% at 50% 45%, #fff 0%, rgba(255,255,255,.5) 40%, transparent 80%); opacity:0; pointer-events:none; mix-blend-mode:screen; z-index:7; }
  #wipe { position:absolute; inset:0; display:flex; gap:${px(0.6)}; padding:0 ${px(3)}; align-items:flex-end; pointer-events:none; z-index:6; }
  #wipe i { flex:1; height:100%; transform-origin:bottom; transform:scaleY(0); background:linear-gradient(0deg, var(--red) 0%, #304285 55%, rgba(48,66,133,0) 100%); border-radius:${px(0.6)} ${px(0.6)} 0 0; }
  #corner { position:absolute; ${P ? `left:${px(6)}; top:${px(4)}; width:${px(26)}` : `right:${px(3)}; top:${px(3)}; width:${px(15)}`}; opacity:0; z-index:5; } #corner img { width:100%; display:block; }
  #badge { position:absolute; left:${px(2)}; bottom:${px(1.5)}; font:700 ${px(1.4)} Montserrat; letter-spacing:.2em; color:rgba(255,255,255,.45); z-index:9; }

  .h2 { position:absolute; left:${f(SAFE.l)}; right:${f(SAFE.r)}; top:${f(SAFE.t)}; overflow:hidden; }
  .h2 span { transform-origin:left center; display:inline-block; font-family:Montserrat; font-weight:900; font-size:${px(P ? 8 : 6.2)}; text-transform:uppercase; letter-spacing:-.01em; line-height:1.05; }
  .h2 em { display:block; font-style:normal; font-family:Montserrat; font-weight:700; font-size:${px(P ? 2.6 : 2.1)}; letter-spacing:.14em; text-transform:uppercase; color:var(--gold); margin-top:${px(0.8)}; }
  .l1, .l3, .chk, .chn { overflow:hidden; } .l1 span, .l3 span, .chk span, .chn span { display:inline-block; }

  /* intro */
  .it { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; }
  #it2, #it3 { opacity:0; }
  .tap { width:${px(P ? 72 : 46)}; margin-bottom:${px(3)}; } .tap img { width:100%; display:block; filter:drop-shadow(0 ${px(0.8)} ${px(2)} rgba(0,0,0,.45)); }
  .l1 span { font-family:Montserrat; font-weight:900; font-size:${px(P ? 10.5 : 8.6)}; text-transform:uppercase; line-height:1.02; letter-spacing:-.01em; }
  .l1.red span { color:var(--red); } .l1.big span { font-size:${px(P ? 15 : 11)}; }
  .l3 span { font-family:Montserrat; font-weight:700; font-size:${px(P ? 2.8 : 2.2)}; letter-spacing:.16em; text-transform:uppercase; color:var(--gold); margin-top:${px(2)}; }
  #it2 { flex-direction:${P ? 'column' : 'row'}; gap:${px(4)}; }
  .vt { text-align:${P ? 'center' : 'left'}; display:flex; flex-direction:column; align-items:${P ? 'center' : 'flex-start'}; }
  .vlogo { width:${px(P ? 16 : 11)}; margin-top:${px(2.5)}; opacity:.9; } .vlogo img { width:100%; display:block; }
  .tiles { display:flex; flex-wrap:wrap; justify-content:center; gap:${px(2)}; margin-top:${px(4)}; width:${px(P ? 84 : 120)}; } .tiles .tile { width:${px(P ? 38 : 25)}; box-sizing:border-box; }
  .tile { background:rgba(238,242,249,.96); color:var(--navy); border-radius:${px(1.6)}; padding:${px(1.6)}; font-family:Montserrat; box-shadow:0 ${px(0.8)} ${px(3)} rgba(0,0,0,.3); }
  .tile b { display:block; font-weight:900; font-size:${px(P ? 10 : 8)}; line-height:1; color:var(--red); } .tile span { display:block; font-weight:800; font-size:${px(P ? 2.2 : 1.7)}; letter-spacing:.08em; text-transform:uppercase; color:var(--blue); margin-top:${px(0.4)}; }

  /* rybník */
  .pond { display:block; overflow:visible; }
  .pond .po { fill:rgba(142,162,216,.10); stroke:#eef2f9; stroke-width:6; stroke-linejoin:round; stroke-dasharray:1; }
  .pond .pi { fill:rgba(48,66,133,.35); stroke:rgba(238,242,249,.35); stroke-width:2; }
  .pond .sd { transform-box:fill-box; transform-origin:center; } .pond .sdc { fill:var(--red); stroke:#fff; stroke-width:1.6; }
  .pond text { font:800 15px Montserrat; fill:#fff; }
  .pond .wd { transform-box:fill-box; }

  /* živý den */
  .wx { position:absolute; ${P ? `right:${f(SAFE.r)}; top:${f(SAFE.t)}` : `left:${px(36)}; top:${f(SAFE.t)}`}; width:${px(P ? 12 : 9)}; height:${px(P ? 12 : 9)}; overflow:visible; }
  .wx.sun circle { fill:var(--gold); } .wx.sun line { stroke:var(--gold); stroke-width:3; stroke-linecap:round; } .wx.sun { transform-origin:center; }
  .wx.rain path { fill:#cfd8ee; } .wx.rain line { stroke:#7fb2ff; stroke-width:2.6; stroke-linecap:round; }
  .hud { position:absolute; ${P ? `left:${f(SAFE.l)}; right:${f(SAFE.r)}; top:${px(30)}; height:${px(19)}` : `right:${f(SAFE.r)}; top:${px(19)}; width:${px(54)}; height:${px(52)}; flex-direction:column`}; display:flex; gap:${px(2.4)}; align-items:stretch; }
  .hf { background:rgba(238,242,249,.96); color:var(--navy); border-radius:${px(1.6)}; padding:${px(1.4)} ${px(2.4)}; font-family:Montserrat; display:flex; flex-direction:column; justify-content:center; box-shadow:0 ${px(0.8)} ${px(3)} rgba(0,0,0,.3); ${P ? `width:${px(36)}` : ''} }
  .hf .hk { font-weight:800; font-size:${px(2.2)}; letter-spacing:.12em; text-transform:uppercase; color:var(--blue); } .hf .hk b { display:inline-block; font-weight:900; color:var(--red); font-size:${px(3.2)}; min-width:${px(3.6)}; text-align:center; }
  .hf > b { font-weight:900; font-size:${px(P ? 9 : 8.5)}; line-height:1; color:var(--red); } .hf > span { font-weight:800; font-size:${px(1.9)}; letter-spacing:.12em; text-transform:uppercase; color:var(--blue); }
  .hrw { flex:1; display:flex; flex-direction:column; } .hrl { font:800 ${px(1.7)} Montserrat; letter-spacing:.14em; text-transform:uppercase; color:var(--lb); margin-bottom:${px(2.6)}; } .hrl s { display:inline-block; width:${px(1.6)}; height:${px(1.2)}; border:${px(0.2)} dashed rgba(238,242,249,.7); vertical-align:middle; }
  .hv { position:absolute; left:-50%; right:-50%; text-align:center; text-decoration:none; font:900 ${px(1.6)} Montserrat; color:#fff; margin-bottom:${px(0.4)}; opacity:0; }
  .hr { flex:1; display:flex; gap:${px(0.6)}; align-items:flex-end; padding-bottom:${px(2.4)}; position:relative; ${P ? '' : `min-height:${px(18)}`} }
  .hcol { flex:1; height:100%; position:relative; display:flex; align-items:flex-end; }
  .hcol i { position:absolute; left:0; right:0; bottom:0; background:linear-gradient(0deg, var(--red), #ff6b6f); border-radius:${px(0.5)} ${px(0.5)} 0 0; transform-origin:bottom; transform:scaleY(0); }
  .hcol s { position:absolute; left:0; right:0; bottom:0; border:${px(0.2)} dashed rgba(238,242,249,.55); border-bottom:0; border-radius:${px(0.5)} ${px(0.5)} 0 0; }
  .hcol em { position:absolute; bottom:${px(-2.4)}; left:0; right:0; text-align:center; font:700 ${px(1.4)} Montserrat; font-style:normal; color:var(--lb); }
  .bump { position:absolute; ${P ? `left:${f(SAFE.l)}; top:${px(52)}` : `left:${f(SAFE.l)}; top:${f(SAFE.t + 15 * u)}`}; }
  .bump svg { position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
  .bump polyline { fill:none; stroke-linecap:round; stroke-linejoin:round; opacity:.28; } .bump polyline.hi { opacity:1; filter:drop-shadow(0 0 ${px(0.6)} rgba(0,0,0,.6)); }
  .bump .gl { stroke:rgba(142,162,216,.25); stroke-width:1; } .bump text { fill:var(--lb); font:700 ${px(1.5)} Montserrat; } .bump .kx { fill:rgba(142,162,216,.8); }
  .bump .t10 { fill:rgba(255,211,107,.08); stroke:rgba(255,211,107,.35); stroke-dasharray:6 6; } .bump .t10l { fill:var(--gold); font:800 ${px(1.5)} Montserrat; letter-spacing:.15em; }
  .bd { position:absolute; transform:translateY(-50%); display:flex; align-items:center; gap:${px(0.8)}; white-space:nowrap; font-family:Montserrat; font-size:${px(P ? 2 : 1.8)}; }
  .bd span { font-weight:700; } .bd b { font-weight:900; color:var(--gold); }
  .bd.hi { font-size:${px(P ? 2.7 : 2.5)}; } .bd.hi span { font-weight:900; } .bd.hi b { color:#fff; }
  .bdot { position:absolute; width:${px(1.2)}; height:${px(1.2)}; margin:${px(-0.6)} 0 0 ${px(-0.6)}; border-radius:50%; box-shadow:0 0 0 ${px(0.25)} rgba(5,13,34,.8); }
  .bdot.hi { width:${px(2)}; height:${px(2)}; margin:${px(-1)} 0 0 ${px(-1)}; box-shadow:0 0 0 ${px(0.3)} #fff, 0 0 ${px(1.5)} rgba(255,255,255,.6); }
  .bcap { position:absolute; left:0; bottom:${px(-3.6)}; font:700 ${px(1.5)} Montserrat; letter-spacing:.14em; text-transform:uppercase; color:var(--lb); }
  .dtop { position:absolute; left:50%; top:${P ? '56%' : '56%'}; transform:translate(-50%,-50%); width:${px(P ? 88 : 150)}; display:flex; flex-direction:column; gap:${px(1)}; opacity:0; z-index:3; }
  .dtg { display:grid; grid-template-columns:${P ? '1fr' : '1fr 1fr'}; grid-auto-flow:${P ? 'row' : 'column'}; grid-template-rows:${P ? 'none' : 'repeat(5, auto)'}; gap:${px(1)} ${px(1.6)}; }
  .dth { font:900 ${px(P ? 3.2 : 3)} Montserrat; letter-spacing:.14em; text-transform:uppercase; color:var(--gold); margin-bottom:${px(0.6)}; }
  .dt { display:grid; grid-template-columns:${px(5.5)} 1fr auto; align-items:center; gap:${px(1.4)}; background:rgba(238,242,249,.97); color:var(--navy); border-radius:${px(1.2)}; padding:${px(P ? 0.9 : 1)} ${px(1.8)}; box-shadow:0 ${px(0.8)} ${px(3)} rgba(0,0,0,.4); }
  .dt b { font-weight:900; font-size:${px(P ? 3 : 3.2)}; color:var(--red); } .dt span { font-weight:900; font-size:${px(P ? 2.7 : 2.8)}; } .dt em { font-style:normal; font-weight:800; font-size:${px(P ? 2 : 2.1)}; color:var(--blue); }
  .dt.t3 { box-shadow:0 0 0 ${px(0.35)} var(--gold), 0 ${px(0.8)} ${px(3)} rgba(0,0,0,.4); }

  /* statistika dne */
  .p3w { position:absolute; ${P ? `left:0; right:0; top:${px(24)}; height:${px(80)}` : `left:${f(SAFE.l - 2 * u)}; top:${f(SAFE.t + 8 * u)}; width:${px(100)}; height:${px(84)}`}; perspective:${px(160)}; perspective-origin:50% 40%; display:flex; align-items:center; justify-content:center; }
  .p3 { position:relative; transform-style:preserve-3d; }
  .pond3 { position:absolute; inset:0; width:100%; height:100%; overflow:visible; } .pond3 .po { fill:rgba(48,66,133,.45); stroke:#eef2f9; stroke-width:6; stroke-dasharray:1; } .pond3 .pi { fill:rgba(26,160,200,.18); stroke:rgba(238,242,249,.3); stroke-width:2; }
  .sd3 { position:absolute; width:${px(1.2)}; height:${px(1.2)}; margin:${px(-0.6)} 0 0 ${px(-0.6)}; border-radius:50%; background:#eef2f9; } .sd3 em { position:absolute; left:${px(1.4)}; top:${px(-0.4)}; font:800 ${px(1.5)} Montserrat; font-style:normal; color:rgba(238,242,249,.7); }
  .c3 { position:absolute; transform-style:preserve-3d; background:linear-gradient(0deg, var(--c), color-mix(in srgb, var(--c) 60%, #fff)); box-shadow:0 0 ${px(0.6)} rgba(0,0,0,.35); }
  .c3::after { content:''; position:absolute; left:100%; top:0; width:${px(1.2)}; height:100%; transform-origin:left; transform:rotateY(90deg); background:color-mix(in srgb, var(--c) 55%, #000); }
  .c3::before { content:''; position:absolute; left:0; top:0; width:100%; height:${px(1.2)}; transform-origin:top; transform:rotateX(90deg); background:color-mix(in srgb, var(--c) 70%, #fff); }
  .c3 .cv { position:absolute; left:50%; bottom:100%; transform:translateX(-50%); margin-bottom:${px(0.4)}; font:900 ${px(P ? 2.1 : 1.9)} Montserrat; color:#fff; text-shadow:0 0 ${px(0.5)} rgba(0,0,0,.9); white-space:nowrap; opacity:0; }
  .c3g { position:absolute; border:${px(0.18)} dashed rgba(238,242,249,.75); box-sizing:border-box; }
  .stl { display:flex; flex-direction:column; gap:${px(0.6)}; } .sth { font:900 ${px(2.4)} Montserrat; letter-spacing:.12em; text-transform:uppercase; color:var(--gold); opacity:0; }
  .str { display:grid; grid-template-columns:${px(4)} ${px(9)} 1fr ${px(6)}; align-items:center; gap:${px(1.2)}; background:rgba(238,242,249,.96); color:var(--navy); border-radius:${px(1)}; padding:${px(0.45)} ${px(1.4)}; opacity:0; }
  .str b { font-weight:900; font-size:${px(2.2)}; color:var(--red); } .str span { font-weight:900; font-size:${px(2.2)}; } .str i { height:${px(1.6)}; background:rgba(48,66,133,.15); border-radius:${px(0.8)}; overflow:hidden; display:block; } .str u { display:block; height:100%; } .str em { font-style:normal; font-weight:900; font-size:${px(2.4)}; text-align:right; }
  .slow { font:700 ${px(1.9)} Montserrat; color:var(--lb); opacity:0; }
  .hm { position:absolute; ${P ? `left:50%; transform:translateX(-50%); top:${px(24)}` : `left:${f(SAFE.l)}; top:${f(SAFE.t + 11 * u)}`}; }
  .hmb { margin-top:${px(0.4)}; text-align:center; font:800 ${px(2.8)} Montserrat; color:var(--ice); opacity:0; } .hmb b { color:var(--gold); font-weight:900; font-size:1.3em; }
  .hleg { position:relative; margin:${px(0.8)} auto 0; justify-content:center; display:flex; align-items:center; gap:${px(1)}; font:700 ${px(1.6)} Montserrat; color:var(--lb); opacity:0; } .hleg i { width:${px(12)}; height:${px(1.2)}; border-radius:${px(0.6)}; background:linear-gradient(90deg,#304285,#ffd36b,#e31e24); }
  .side { position:absolute; ${P ? `left:${f(SAFE.l)}; right:${f(SAFE.r)}; top:${px(104)}` : `right:${f(SAFE.r)}; top:${f(SAFE.t + 13 * u)}; width:${px(68)}`}; display:flex; flex-direction:column; gap:${px(2.4)}; }
  .secs { display:flex; flex-direction:column; gap:${px(1)}; }
  .sec { display:grid; grid-template-columns:${px(9)} 1fr ${px(7)}; align-items:center; gap:${px(1.2)}; font-family:Montserrat; opacity:0; }
  .sec span { font-weight:800; font-size:${px(2.2)}; color:var(--lb); } .sec i { height:${px(2.4)}; background:rgba(142,162,216,.18); border-radius:${px(0.6)}; overflow:hidden; display:block; }
  .sec u { display:block; height:100%; background:linear-gradient(90deg, #304285, var(--red)); transform-origin:left; } .sec b { font-weight:900; font-size:${px(2.6)}; text-align:right; }
  .tiles2 { display:grid; grid-template-columns:repeat(${P ? 4 : 2}, 1fr); gap:${px(1.2)}; }
  .tile2 { background:rgba(238,242,249,.96); color:var(--navy); border-radius:${px(1.6)}; padding:${px(1.4)} ${px(1.8)}; font-family:Montserrat; opacity:0; }
  .tile2 b { display:block; font-weight:900; font-size:${px(P ? 5 : 4.4)}; line-height:1; color:var(--red); } .tile2 span { display:block; font-weight:800; font-size:${px(1.7)}; letter-spacing:.1em; text-transform:uppercase; color:var(--blue); margin-top:${px(0.4)}; }
  .tile2 em { display:block; font-style:normal; font-weight:700; font-size:${px(1.8)}; color:#0b1e42; opacity:.8; margin-top:${px(0.3)}; }

  /* výsledek MČR */
  .rule { position:absolute; ${P ? `left:${f(SAFE.l)}; top:${px(27)}` : `right:${f(SAFE.r)}; top:${px(16)}`}; background:var(--red); color:#fff; border-radius:${px(1.4)}; padding:${px(1.2)} ${px(2.2)}; font-family:Montserrat; opacity:0; }
  .rule b { font-weight:900; font-size:${px(P ? 3.4 : 2.8)}; } .rule span { display:block; font-weight:700; font-size:${px(1.9)}; opacity:.9; }
  .rule.big { left:50%; top:50%; right:auto; transform:translate(-50%,-50%); text-align:center; padding:${px(2.4)} ${px(4)}; z-index:4; box-shadow:0 ${px(1)} ${px(5)} rgba(0,0,0,.5); } .rule.big b { font-size:${px(P ? 6.5 : 6)}; } .rule.big span { font-size:${px(2.4)}; }
  .tab { position:absolute; left:${f(SAFE.l)}; right:${f(SAFE.r)}; top:${P ? px(36) : f(SAFE.t + 15 * u)}; display:flex; flex-direction:column; gap:${px(0.7)}; ${P ? '' : `max-width:${px(110)}; margin:0 auto;`} }
  .tr { display:grid; grid-template-columns:${px(5)} 1fr ${px(P ? 11 : 10)} ${px(P ? 11 : 10)} ${px(P ? 13 : 12)}; align-items:center; gap:${px(1)}; background:rgba(238,242,249,.95); color:var(--navy); border-radius:${px(1.2)}; padding:${px(0.9)} ${px(1.6)}; font-family:Montserrat; opacity:0; }
  .tr.th { background:none; color:var(--gold); opacity:1; font-weight:800; font-size:${px(1.6)}; letter-spacing:.12em; text-transform:uppercase; padding-top:0; padding-bottom:0; }
  .tp { font-weight:900; font-size:${px(2.8)}; color:var(--red); } .tn { font-weight:900; font-size:${px(P ? 2.7 : 2.6)}; } .tc { text-align:center; } .tc i { display:inline-block; font-style:normal; font-weight:800; font-size:${px(2.2)}; color:var(--blue); }
  .ta { text-align:right; } .ta b { font-weight:900; font-size:${px(3.4)}; color:var(--red); }
  .tnote { font:700 ${px(1.7)} Montserrat; color:var(--lb); letter-spacing:.06em; margin-top:${px(0.6)}; opacity:0; }
  .th .tp, .th .tn, .th .ta { color:var(--gold); font-size:${px(1.6)}; font-weight:800; }

  /* stupně vítězů */
  .pods { position:absolute; left:${f(SAFE.l)}; right:${f(SAFE.r)}; ${P ? `top:${px(40)}` : `top:${f(SAFE.t + 14 * u)}`}; display:flex; align-items:flex-end; justify-content:center; gap:${px(2)}; }
  .pd { width:${px(P ? 29 : 36)}; text-align:center; font-family:Montserrat; display:flex; flex-direction:column; align-items:center; opacity:0; position:relative; }
  .pd > *:not(.glow) { position:relative; } .glow { position:absolute; left:50%; top:${px(-6)}; width:${px(70)}; height:${px(70)}; margin-left:${px(-35)}; border-radius:50%; background:repeating-conic-gradient(from 0deg, rgba(255,211,107,.35) 0deg 6deg, transparent 6deg 18deg); -webkit-mask-image:radial-gradient(circle, #000 0%, transparent 65%); opacity:0; }
  .pn { font-weight:900; font-size:${px(P ? 10 : 8)}; color:var(--gold); line-height:1; } .p1 .pn { color:var(--red); font-size:${px(P ? 13 : 10)}; }
  .pnm { font-weight:900; font-size:${px(P ? 3 : 2.8)}; margin:${px(0.6)} 0 ${px(1.2)}; min-height:2.2em; display:flex; align-items:center; }
  .pst { display:flex; gap:${px(0.8)}; margin-bottom:${px(1.2)}; } .pst span { background:rgba(238,242,249,.95); color:var(--blue); border-radius:${px(1)}; padding:${px(0.7)} ${px(1)}; font-weight:700; font-size:${px(1.9)}; text-transform:uppercase; letter-spacing:.06em; }
  .pst b { display:block; font-weight:900; font-size:${px(3.2)}; color:var(--navy); letter-spacing:0; }
  .pd .col { width:100%; background:linear-gradient(180deg, #304285, #0b1e42); border-radius:${px(1)} ${px(1)} 0 0; transform-origin:bottom; box-shadow:inset 0 ${px(0.5)} 0 rgba(255,255,255,.25); } .p1 .col { background:linear-gradient(180deg, var(--red), #7a0d12); }
  .prize { position:absolute; left:0; right:0; ${P ? `top:${px(118)}` : `bottom:${f(SAFE.b)}`}; display:flex; justify-content:center; align-items:center; gap:${px(1.4)}; font:700 ${px(2.3)} Montserrat; color:var(--ice); opacity:0; }
  .prize img { height:${px(5)}; } .prize img.pb { height:${px(2.8)}; margin-left:${px(4)}; } .prize b { color:var(--ice); font-weight:900; }
  .wmap { position:absolute; inset:0; display:flex; flex-direction:${P ? 'column' : 'row'}; align-items:center; justify-content:center; gap:${px(3)}; opacity:0; padding-top:${px(P ? 8 : 6)}; }
  .wl { display:flex; flex-direction:column; gap:${px(1.6)}; font:900 ${px(3.2)} Montserrat; } .wl span { display:flex; align-items:center; gap:${px(1)}; } .wl i { width:${px(2.8)}; height:${px(2.8)}; border-radius:50%; box-shadow:0 0 0 ${px(0.25)} #fff; }
  .wcap { position:absolute; opacity:0; ${P ? `top:${px(26)}` : `top:${f(SAFE.t + 9.5 * u)}`}; left:${f(SAFE.l)}; font:800 ${px(2.4)} Montserrat; letter-spacing:.14em; text-transform:uppercase; color:var(--gold); }

  /* sezóna */
  .sm { position:absolute; left:${f(SAFE.l)}; right:${f(SAFE.r)}; top:${P ? px(36) : f(SAFE.t + 15 * u)}; font-family:Montserrat; }
  .srule { ${P ? `left:${f(SAFE.l)}; top:${px(27.5)}` : `right:${f(SAFE.r)}; top:${px(9)}`}; } .srule b { font-size:${px(P ? 3.2 : 3)}; }
  .smh, .smr { display:grid; grid-template-columns:${px(4)} ${px(P ? 24 : 38)} repeat(8, 1fr) ${px(P ? 9 : 10)}; align-items:center; gap:${px(0.5)}; }
  .smh { color:var(--gold); margin-bottom:${px(1)}; } .smh .sc.h { display:flex; flex-direction:column; align-items:center; } .smh .sc.h i { font-style:normal; font-weight:900; font-size:${px(1.6)}; } .smh .sc.h em { font-style:normal; font-weight:600; font-size:${px(1.2)}; color:var(--lb); }
  .smh .sp, .smh .sn, .smh .sa { font-weight:800; font-size:${px(1.5)}; letter-spacing:.12em; text-transform:uppercase; }
  .smb { position:relative; } .smr { position:absolute; left:0; right:0; border-radius:${px(1)}; padding:0 ${px(0.6)}; box-sizing:border-box; }
  .smr .sp b { font-weight:900; font-size:${px(2.2)}; color:var(--red); } .smr .sn { font-weight:900; font-size:${px(P ? 2.1 : 2.4)}; white-space:nowrap; position:relative; }
  .jmp { position:absolute; left:100%; top:50%; transform:translateY(-50%); margin-left:${px(0.6)}; font-style:normal; font:900 ${px(P ? 1.6 : 1.9)} Montserrat; background:var(--gold); color:var(--navy); border-radius:${px(0.8)}; padding:${px(0.2)} ${px(0.8)}; opacity:0; z-index:2; white-space:nowrap; }
  .sc { position:relative; text-align:center; --x:0; } .smr .sc i { display:inline-block; font-style:normal; font-weight:800; font-size:${px(P ? 2.2 : 2.6)}; background:rgba(238,242,249,.93); color:var(--navy); border-radius:${px(0.6)}; min-width:${px(P ? 4.6 : 5.6)}; padding:${px(0.25)} 0; }
  .smr .sc.ab i { background:rgba(142,162,216,.25); color:var(--lb); }
  .smr .sc.x::after { content:''; position:absolute; left:10%; right:10%; top:50%; height:${px(0.45)}; background:var(--red); transform:rotate(-14deg) scaleX(var(--x)); transform-origin:left; border-radius:${px(0.3)}; }
  .smr .sa b { font-weight:900; font-size:${px(P ? 2.5 : 2.9)}; color:var(--gold); }
  .jump { position:absolute; ${P ? `left:${f(SAFE.l)}; bottom:${px(14)}` : `right:${f(SAFE.r)}; bottom:${f(SAFE.b)}`}; background:var(--gold); color:var(--navy); border-radius:${px(1.4)}; padding:${px(1.2)} ${px(2)}; font-family:Montserrat; opacity:0; }
  .jump b { display:block; font-weight:900; font-size:${px(2.6)}; } .jump span { font-weight:800; font-size:${px(2)}; }
  .champ { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; text-align:center; opacity:0; padding-bottom:${px(P ? 12 : 5)}; }
  .chph { position:absolute; left:0; right:0; top:${P ? px(24) : px(13)}; height:${P ? px(70) : '64%'}; background-size:${P ? '170% auto' : 'contain'}; background-repeat:no-repeat; background-position:50% 0%; -webkit-mask-image:linear-gradient(180deg, #000 0%, #000 60%, transparent 88%); filter:drop-shadow(0 0 ${px(1.2)} rgba(255,211,107,.55)) drop-shadow(0 ${px(1)} ${px(3)} rgba(0,0,0,.5)); }
  .champ > div:not(.chph) { position:relative; }
  .chk span { font-family:Montserrat; font-weight:800; font-size:${px(P ? 3 : 2.6)}; letter-spacing:.16em; text-transform:uppercase; color:var(--gold); }
  .chn span { font-family:Montserrat; font-weight:900; font-size:${px(P ? 11 : 9)}; text-transform:uppercase; line-height:1.05; text-shadow:0 ${px(0.6)} ${px(3)} rgba(0,0,0,.6); }
  .chs { display:inline-block; background:var(--red); color:#fff; font:900 ${px(P ? 3.2 : 2.8)} Montserrat; text-transform:uppercase; letter-spacing:.06em; border-radius:${px(1.2)}; padding:${px(1)} ${px(2.4)}; margin-top:${px(1.6)}; opacity:0; }
  .ch23 { display:flex; ${P ? 'flex-direction:column;' : ''} gap:${px(P ? 1 : 3)}; margin-top:${px(2.4)}; font:800 ${px(2.4)} Montserrat; } .ch23 span { opacity:0; background:rgba(5,13,34,.6); border-radius:${px(1)}; padding:${px(0.6)} ${px(1.6)}; } .ch23 b { color:var(--gold); }

  /* letecký snímek ve 3D */
  #fly { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0; }
  .aw { position:absolute; perspective:${px(150)}; perspective-origin:50% 45%; opacity:0; }
  .aw-i { inset:0; } .aw-i .ax, .aw-s .ax, .aw-p .ax { left:50%; top:50%; }
  .aw-s { ${P ? `left:0; right:0; top:${px(22)}; height:${px(84)}` : `left:${f(SAFE.l - 3 * u)}; top:${f(SAFE.t + 5 * u)}; width:${px(106)}; height:${px(84)}`}; }
  .aw-p { ${P ? `left:0; right:0; top:${px(24)}; height:${px(92)}` : `left:${f(SAFE.l - 2 * u)}; top:${f(SAFE.t + 5 * u)}; width:${px(112)}; height:${px(84)}`}; }
  .ax { position:absolute; transform-style:preserve-3d; } .az { position:absolute; inset:0; transform-style:preserve-3d; }
  .aimg { position:absolute; inset:0; background-image:url(assets/aerial/malys_ortho.jpg); background-repeat:no-repeat; border-radius:${px(2)}; filter:saturate(1.05) brightness(.92);
    -webkit-mask-image:radial-gradient(ellipse 72% 72% at 50% 50%, #000 58%, transparent 100%); }
  .aol { position:absolute; inset:0; width:100%; height:100%; overflow:visible; } .aol polygon { fill:rgba(26,160,200,.10); stroke:rgba(238,242,249,.85); stroke-width:5; stroke-dasharray:1; stroke-linejoin:round; }
  .ad { position:absolute; width:${px(1.1)}; height:${px(1.1)}; margin:${px(-0.55)} 0 0 ${px(-0.55)}; border-radius:50%; background:var(--red); box-shadow:0 0 0 ${px(0.22)} #fff; }
  #it2 { ${P ? `justify-content:flex-end; padding-bottom:${px(26)}` : `align-items:flex-end; padding-right:${px(9)}`}; box-sizing:border-box; }
  #it2 .vt { max-width:${px(P ? 90 : 62)}; } #it2 .l1 span { font-size:${px(P ? 10 : 7.4)}; text-shadow:0 ${px(0.5)} ${px(3)} rgba(0,0,0,.75); white-space:normal; }
  #it2 .l3 span { text-shadow:0 ${px(0.3)} ${px(1.5)} rgba(0,0,0,.9); }
  .sd3.sm3 { width:${px(0.8)}; height:${px(0.8)}; margin:${px(-0.4)} 0 0 ${px(-0.4)}; background:rgba(238,242,249,.7); }
  .side { background:rgba(5,13,34,.78); border-radius:${px(1.8)}; padding:${px(2)}; box-shadow:0 ${px(1)} ${px(4)} rgba(0,0,0,.45); }
  /* piny medailistů */
  .pin { position:absolute; }
  .pin .stem { position:absolute; bottom:0; width:${px(0.5)}; margin-left:${px(-0.25)}; box-shadow:0 0 ${px(0.4)} rgba(0,0,0,.6); background:linear-gradient(0deg, rgba(255,255,255,.35), var(--c)); border-radius:${px(0.2)}; }
  .pin .hd { position:absolute; display:flex; align-items:center; justify-content:center; border-radius:50%; box-sizing:border-box; }
  .pin.w .hd { width:${px(4)}; height:${px(4)}; margin:0 0 ${px(-0.8)} ${px(-2)}; background:var(--c); box-shadow:0 0 0 ${px(0.25)} #fff, 0 0 ${px(1.6)} var(--c); }
  .pin.w .hd svg { width:68%; height:68%; fill:#0b1e42; } .pin.w.dd1 .hd { background:#fff; box-shadow:0 0 0 ${px(0.35)} var(--c), 0 0 ${px(1.6)} var(--c); } .pin.w.dd1 .hd svg { fill:var(--c); }
  .pin.d .hd { width:${px(2.5)}; height:${px(2.5)}; margin:0 0 ${px(-0.5)} ${px(-1.25)}; border:${px(0.45)} solid var(--c); background:rgba(5,13,34,.6); } .pin.d.dd1 .hd { background:#fff; }
  .pin.l .hd { width:${px(1)}; height:${px(1)}; margin:0 0 ${px(-0.2)} ${px(-0.5)}; background:rgba(238,242,249,.55); } .pin.l .stem { opacity:.45; }
  .pcard { position:absolute; ${P ? `left:${f(SAFE.l)}; right:${f(SAFE.r)}; top:${px(120)}` : `right:${f(SAFE.r)}; top:${f(SAFE.t + 15 * u)}; width:${px(58)}`}; background:rgba(5,13,34,.82); border-radius:${px(1.8)}; padding:${px(2.2)}; border-left:${px(0.8)} solid var(--c); opacity:0; box-shadow:0 ${px(1)} ${px(4)} rgba(0,0,0,.45); }
  .pcn { font:900 ${px(P ? 4.2 : 3.8)} Montserrat; text-transform:uppercase; line-height:1.05; } .pcn b { color:var(--c); }
  .pcs { display:flex; gap:${px(1.2)}; margin:${px(1.8)} 0; } .pcs span { flex:1; background:rgba(238,242,249,.96); color:var(--blue); border-radius:${px(1)}; padding:${px(0.9)} ${px(1.2)}; font:700 ${px(1.8)} Montserrat; text-transform:uppercase; letter-spacing:.06em; }
  .pcs b { display:block; font-weight:900; font-size:${px(P ? 4 : 3.6)}; color:var(--navy); letter-spacing:0; }
  .pleg { display:flex; flex-wrap:wrap; gap:${px(0.8)} ${px(1.8)}; font:700 ${px(1.7)} Montserrat; color:var(--lb); } .pleg span { display:flex; align-items:center; gap:${px(0.6)}; }
  .pleg i { display:inline-flex; align-items:center; justify-content:center; width:${px(1.9)}; height:${px(1.9)}; border-radius:50%; box-sizing:border-box; }
  .pleg .lw { background:var(--c); } .pleg .lw svg { width:70%; height:70%; fill:#0b1e42; } .pleg .ld { border:${px(0.4)} solid var(--c); } .pleg .ll { width:${px(1)}; height:${px(1)}; background:rgba(238,242,249,.55); }
  .pleg .l1 { background:var(--c); } .pleg .l2 { background:#fff; box-shadow:inset 0 0 0 ${px(0.4)} var(--c); }
  /* celé pořadí */
  .lg, .lgh { position:absolute; left:${f(SAFE.l)}; right:${f(SAFE.r)}; display:grid; grid-auto-flow:column; gap:${px(0.7)} ${px(P ? 1.6 : 2)}; font-family:Montserrat; }
  .lgh { grid-auto-flow:row; opacity:0; }
  .lr { position:relative; display:grid; grid-template-columns:${px(4.4)} 1fr ${px(P ? 6 : 6.5)} ${px(P ? 5 : 5.5)}; align-items:center; gap:${px(0.8)}; padding:0 ${px(1.2)}; border-radius:${px(1)}; background:rgba(238,242,249,.12); color:var(--ice); overflow:hidden; opacity:0; }
  .lr > * { position:relative; } .lr .lb { position:absolute; left:0; top:0; bottom:0; background:linear-gradient(90deg, rgba(26,160,200,.0), rgba(26,160,200,.38)); transform-origin:left; }
  .lr b { font-weight:900; font-size:${px(P ? 2.1 : 2.2)}; color:var(--gold); } .lr span { font-weight:800; font-size:${px(P ? 2.05 : 2.2)}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .lr em { font-style:normal; font-weight:800; font-size:${px(P ? 1.9 : 2)}; text-align:right; color:var(--lb); } .lr u { text-decoration:none; font-weight:900; font-size:${px(P ? 2.2 : 2.4)}; text-align:right; }
  .lr.t { background:rgba(238,242,249,.95); color:var(--navy); } .lr.t b { color:var(--red); } .lr.t em { color:var(--blue); } .lr.t .lb { background:linear-gradient(90deg, rgba(255,211,107,0), rgba(255,211,107,.55)); }
  .lr.g { box-shadow:0 0 0 ${px(0.3)} var(--gold), 0 0 ${px(1.6)} rgba(255,211,107,.35); }
  #s-mcr .lr { grid-template-columns:${px(4.4)} 1fr ${px(P ? 4.6 : 5)} ${px(P ? 4.6 : 5)} ${px(P ? 4.6 : 5)}; } #s-mcr .lr u { color:var(--red); } #s-mcr .lr:not(.t) u { color:var(--gold); }
  .lrh { opacity:1; background:none; height:${px(2.6)}; } .lrh b, .lrh span, .lrh em, .lrh u { font-weight:800 !important; font-size:${px(1.4)} !important; letter-spacing:.12em; text-transform:uppercase; color:var(--gold) !important; }
  #s-fpa .lr { grid-template-columns:${px(4.4)} ${px(P ? 14 : 15)} 1fr ${px(P ? 7 : 7)} ${px(P ? 4.4 : 4.6)}; background:none; padding:0 ${px(0.4)}; }
  #s-fpa .lr span { font-size:${px(P ? 1.95 : 2)}; } #s-fpa .lr em { font-size:${px(1.6)}; }
  .fb { display:flex; height:58%; background:rgba(142,162,216,.12); border-radius:${px(0.4)}; overflow:hidden; } .fb s { display:block; height:100%; background:var(--gold); transform-origin:left; } .fb s.n { background:#7fd0ff; }
  .fleg { position:absolute; ${P ? `left:${f(SAFE.l)}; top:${px(168.5)}` : `right:${f(SAFE.r)}; top:${f(SAFE.t + 8 * u)}`}; display:flex; gap:${px(2)}; font:800 ${px(1.8)} Montserrat; text-transform:uppercase; letter-spacing:.1em; opacity:0; }
  .fleg span { display:flex; align-items:center; gap:${px(0.7)}; } .fleg i { width:${px(2.4)}; height:${px(1.4)}; border-radius:${px(0.3)}; background:var(--gold); } .fleg i.n { background:#7fd0ff; }

  /* partneři */
  .pgw { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; }
  .pg { width:${px(P ? 84 : 120)}; display:grid; grid-template-columns:repeat(3, 1fr); gap:${px(P ? 2.6 : 2.4)}; }
  .pl { height:${px(P ? 15 : 14)}; display:flex; align-items:center; justify-content:center; background:#f4f6fb; border-radius:${px(1.6)}; box-shadow:0 ${px(0.8)} ${px(3)} rgba(0,0,0,.35); }
  .pl img { max-width:80%; max-height:76%; object-fit:contain; display:block; }
  .ghm { position:absolute; left:0; right:0; top:${P ? '61%' : '68%'}; display:flex; align-items:center; justify-content:center; gap:${px(1.4)}; opacity:0; font:800 ${px(2)} Montserrat; letter-spacing:.24em; text-transform:uppercase; color:rgba(238,242,249,.88); }
  .ghm .gear { position:relative; width:${px(6.4)}; height:${px(6.4)}; } .ghm .gear img { position:absolute; inset:0; width:100%; height:100%; } .ghm .wl2 { height:${px(2.8)}; }
  .tap.end { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); width:${px(P ? 80 : 60)}; margin:0; opacity:0; }
</style></head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="${W}" data-height="${H}">
  <div id="stage"><div id="st-bg"></div><i class="blob" id="blob0"></i><i class="blob" id="blob1"></i><i class="blob" id="blob2"></i><div id="rays-w"><div id="st-rays"></div></div><div id="st-dots"></div><div id="vig"></div></div>
  <div id="parts">${Array.from({ length: 34 }, (_, i) => `<i id="pt${i}" style="left:${(rnd(i * 7 + 1) * 100).toFixed(1)}%; width:${(0.3 + rnd(i * 3) * 0.9).toFixed(2) * u}px; height:${(0.3 + rnd(i * 3) * 0.9).toFixed(2) * u}px"></i>`).join('')}</div>
  <video id="fly" class="clip" src="assets/aerial/flyover_${P ? '9x16' : '16x9'}.mp4" muted playsinline data-start="${FLY_T.toFixed(3)}" data-duration="4" data-track-index="1"></video>
  ${html}
  <div id="corner"><img src="assets/ta_logo.png" alt=""></div>
  ${HAS_TRACK ? `<audio id="music" class="clip" data-start="0" data-duration="${DUR}" data-track-index="0" src="assets/track.wav" data-volume="1"></audio>` : ''}
  <div id="wipe">${Array.from({ length: NW }, (_, i) => `<i id="wp${i}"></i>`).join('')}</div>
  <div id="flash"></div>
  <div id="grain"></div>
  ${process.env.FINAL ? '' : `<div id="badge">DRAFT · ${VER}${HAS_TRACK ? '' : ' · 124 BPM placeholder'}</div>`}
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
  console.log(file, 'DUR', DUR, 'tweens', out.length, 'track', HAS_TRACK);
}
const scenesExtra = [];
const FLY_T = BAR(1) + BEAT * 2;   // = m1 v intru
build(1080, 1920, '9x16');
build(1920, 1080, '16x9');
