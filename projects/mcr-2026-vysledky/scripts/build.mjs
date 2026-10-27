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
// jména: každé slovo s velkým písmenem (export má např. „Mykhailo kobets“)
const capN = (n) => n.split(' ').map((w) => w.charAt(0).toLocaleUpperCase('cs') + w.slice(1)).join(' ');
[R.d1, R.d2, R.mcr.rows, R.season_all.rows, R.season_best6.rows].forEach((A) => A.forEach((x) => { x.name = capN(x.name); }));
const ST = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/stats.json'), 'utf8'));
const POND = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/pond.json'), 'utf8'));
const PHOTOS = fs.existsSync(path.join(PROTO, 'assets/photos.json')) ? JSON.parse(fs.readFileSync(path.join(PROTO, 'assets/photos.json'), 'utf8')) : {};
const AER = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/aerial.json'), 'utf8'));   // ortofoto ČÚZK, stanoviště v px (malys_ortho.jpg)
const VER = process.env.VER || 'v8';

// ---------- struktura v taktech ----------
// track_edit2: originál takty 1–53 + kopie 18–53 + originál 54–65 (≈ 101 taktů, 197,9 s)
const BARS = { intro: [0, 8], d1: [8, 23], d1s: [23, 30], d1l: [30, 35], d2: [35, 50], d2s: [50, 57], d2l: [57, 62], mcr: [62, 70], fpa: [70, 76], pod: [76, 88], sez: [88, 98], end: [98, 101] };
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
const MCRALL = R.mcr.rows.filter((x, i, A) => byName(0, x.name) && A.findIndex((y) => y.name === x.name) === i).map((x, i) => ({ name: x.name, d1: x.res[1].pos, d2: x.res[0].pos, rank: i + 1, f1: byName(0, x.name).fish, f2: byName(1, x.name).fish }));
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
    scene('s-intro', a, b, `${bgp('bg_mcr26_porada.jpg', a, m1, { op: 0.72, id: 'bgi1' })}${bgp('bg_mcr26_breh_pruty.jpg', m2 - 0.5, b, { op: 0.68, id: 'bgi3', word: 'FAIR PLAY' })}
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
    T0('#ai-x', { rotationX: 52, scale: 1.05, x: (P ? -2 : -3) * u, y: 6 * u }, { rotationX: 0, x: P ? 0 : 12 * u, y: P ? -16 * u : -4 * u, scale: P ? 1.3 : 1.75, duration: 1.9, ease: 'power2.inOut' }, mf);
    T0('#ai-z', { rotation: 90 }, { rotation: 0, duration: 1.9, ease: 'power2.inOut' }, mf);
    T0('#ai .aol polygon', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' }, mf + 1.4);
    Object.keys(AER.stands).forEach((n, i) => T0(`#ad${n}`, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(3)' }, mf + 1.7 + i * 0.025));
    T0('#ai-x', { scale: P ? 1.3 : 1.75 }, { scale: P ? 1.38 : 1.85, duration: len(mf + 1.9, m2), ease: 'none' }, mf + 1.9);
    T0('#it2', { opacity: 0 }, { opacity: 1, duration: 0.01 }, mf + 1.6);
    rise('#it2 .l1 span', mf + 1.7); pop('#it2 .l3 span', mf + 1.7 + BEAT * 2); pop('#it2 .vlogo', mf + 1.7 + BEAT * 3);
    T('#it2, #ai', { opacity: 1 }, { opacity: 0, scale: 1.04, duration: 0.35, ease: 'power2.in' }, m2 - 0.35);
    // 1c dva dny fair play
    T0('#it3', { opacity: 0 }, { opacity: 1, duration: 0.01 }, m2 - 0.4);
    rise('#it3 .l1:nth-of-type(1) span', m2 - 0.35); rise('#it3 .l1:nth-of-type(2) span', m2 + 0.05 + BEAT);
    [[39], [2], [24], [40]].forEach(([v], i) => { const t = m2 + BEAT * (2 + i * 0.5); pop(`#itl${i}`, t); CNT(`itv${i}`, 0, v, t + 0.05, 0.7); });
    pop('#it3 .dte span', m2 + BEAT * 4.5);
    T('#it3', { opacity: 1 }, { opacity: 0, scale: 0.96, duration: 0.3, ease: 'power2.in' }, b - 0.45);
  }

  // ===================== 2/4) ŽIVÝ PRŮBĚH DNE (styl Klonówiec): fotka, závod lídrů po kolech, karta kola, HUD =====================
  const RPH = [['bg_mcr26_porada.jpg', 'bg_mcr26_breh_pruty.jpg', 'bg_mcr26_podberak.jpg', 'bg_lib26_1000064829.jpg'], ['bg_mcr26_zarybneni.jpg', 'bg_lib26_1000065065.jpg', 'bg_mcr26_kontrola_vysledku.jpg', 'bg_lib26_1000064885.jpg']];
  const maxP = Math.max(...DAYS.flatMap((d) => d.A.map((x) => x.points)));
  const kphoto = (img, id, a, b, zin) => {
    T0(`#${id}`, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' }, a);
    T0(`#${id}`, { scale: zin ? 1 : 1.12, xPercent: zin ? -1.5 : 1.5 }, { scale: zin ? 1.12 : 1, xPercent: zin ? 1.5 : -1.5, duration: len(a, b), ease: 'sine.inOut' }, a);
    T(`#${id}`, { opacity: 1 }, { opacity: 0, duration: 0.35 }, b - 0.35);
    return `<div class="kph" id="${id}" style="background-image:url(assets/photos/${img})"></div>`; };
  const live = (di) => {
    const D = DAYS[di], id = `s-${D.k}`, [b0, b1] = BARS[D.k], a = BAR(b0), b = BAR(b1);
    const rt = (j) => BAR(b0 + 1 + j);                                   // kolo j = takt b0+1+j
    const LEAD = D.top.slice(0, 10);                                     // konečná top 10 dne
    const cumP = (x, k) => x.rounds.slice(0, k + 1).reduce((s0, r) => s0 + (r.pts || 0), 0);
    const ordAt = (k) => (k === 11 ? LEAD.map((x) => x.name) : [...LEAD].sort((x, y) => D.ranks[k][x.name] - D.ranks[k][y.name]).map((x) => x.name));
    const rowH = (P ? 5.2 : 4.4) * u, BW = P ? 46 * u : 62 * u;
    const COLR = (j) => (j === 0 ? '#e31e24' : j < 3 ? '#304285' : '#5a6fb8');
    const maxR = Math.max(...DAYS[0].perRound);
    const bestR = (k) => { const mxf = Math.max(...D.A.map((x) => x.rounds[k].fish || 0)), w = D.A.filter((x) => (x.rounds[k].fish || 0) === mxf);
      return `${w.slice(0, 2).map((x) => x.name).join(', ')}${w.length > 2 ? ` +${w.length - 2}` : ''} · ${mxf} ryb`; };
    const icon = di === 0
      ? `<svg class="wx sun" viewBox="0 0 40 40"><circle cx="20" cy="20" r="8"/>${Array.from({ length: 8 }, (_, k) => `<line x1="${20 + 12 * Math.cos(k * Math.PI / 4)}" y1="${20 + 12 * Math.sin(k * Math.PI / 4)}" x2="${20 + 17 * Math.cos(k * Math.PI / 4)}" y2="${20 + 17 * Math.sin(k * Math.PI / 4)}"/>`).join('')}</svg>`
      : `<svg class="wx rain" viewBox="0 0 40 40"><path d="M11 22a8 8 0 0 1 2-15.5A10 10 0 0 1 32 10a6 6 0 0 1-1 12z"/>${[12, 19, 26].map((x) => `<line class="drop" x1="${x}" y1="27" x2="${x - 3}" y2="35"/>`).join('')}</svg>`;
    const ghost = di === 1 ? DAYS[0].perRound : null;
    const phs = RPH[di].map((img, k) => { const pa = k === 0 ? a : BAR(b0 + k * 4), pb = k === 3 ? b : BAR(b0 + (k + 1) * 4); return kphoto(img, `${id}-ph${k}`, pa, pb, k % 2 === 0); }).join('');
    const hud = `<div class="khud" id="${id}-hud"><div class="hc"><b>Den ${di + 1}</b><span id="${id}-kl">${di ? 'neděle 25. 10.' : 'sobota 24. 10.'}</span></div>
      <div class="hn"><b id="${id}-c">0</b><span>ulovených ryb${di ? ` · sobota ${fmt(DAYS[0].total)}` : ''}</span></div>
      <div class="hr">${D.perRound.map((v, j) => `<div class="hcol" id="${id}-hc${j}">${ghost ? `<s style="height:${((ghost[j] / maxR) * 100).toFixed(1)}%"></s>` : ''}<i id="${id}-hi${j}" style="height:${((v / maxR) * 100).toFixed(1)}%"></i><b class="hon" id="${id}-ho${j}" style="height:${((v / maxR) * 100).toFixed(1)}%"></b><em>${j + 1}</em></div>`).join('')}</div></div>`;
    const race = `<div class="race" id="${id}-race" style="height:${f(rowH * 10)}">${LEAD.map((x, j) => `<div class="rr" id="${id}-rr${j}"><span class="rn">${short(x.name)}</span><span class="rb"><i id="${id}-rb${j}" style="background:${COLR(j)}; width:${f(BW)}"></i></span><b id="${id}-rv${j}">0</b></div>`).join('')}</div>
      <div class="rk" id="${id}-rk"><span id="${id}-rkn">1</span><em>po kole</em></div>`;
    const cards = D.perRound.map((v, k) => `<div class="rc" id="${id}-rc${k}"><div class="rc-n"><span>${k + 1}. kolo</span></div><div class="rc-f"><b>${v}</b><span>ryb v kole${ghost ? ` · sobota ${ghost[k]}` : ''}</span></div><div class="rc-b">Nejvíc: <b>${bestR(k)}</b></div></div>`).join('');
    scene(id, a, b, `${phs}<div class="kdim"></div>${head(id, P ? `Den ${di + 1}` : `Den ${di + 1} · závod lídrů`, P ? `závod lídrů · ${di ? 'neděle · déšť' : 'sobota · slunečno'}` : `${di ? 'neděle · déšť' : 'sobota · slunečno'} · top 10 dne · body po kolech`, a + 0.05)}${icon}${race}<div class="rcw">${cards}</div>${hud}`);
    T0(`#${id} .wx`, { opacity: 0, scale: 0.5, rotation: -30 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2)' }, a + 0.2);
    if (di === 0) out.push(`tl.fromTo("#${id} .sun", {rotation:0}, {rotation:90, duration:${len(a, b)}, ease:"none", immediateRender:false}, ${a.toFixed(3)});`);
    else [0, 1, 2].forEach((k) => out.push(`tl.fromTo("#${id} .drop:nth-of-type(${k + 1})", {y:-4, opacity:0}, {y:4, opacity:1, duration:0.5, ease:"none", repeat:${Math.floor(len(a, b) / 0.5) - 1}, immediateRender:false}, ${(a + k * 0.17).toFixed(3)});`));
    T0(`#${id}-hud`, { opacity: 0, y: (P ? -4 : 4) * u }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, a + 0.2);
    T0(`#${id}-race`, { opacity: 0, x: -4 * u }, { opacity: 1, x: 0, duration: 0.5, ease: 'expo.out' }, a + BEAT * 2);
    T0(`#${id}-rk`, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, a + BEAT * 3);
    const o0 = ordAt(0);
    LEAD.forEach((x, j) => { SET(`#${id}-rr${j}`, { y: o0.indexOf(x.name) * rowH }, a); SET(`#${id}-rb${j}`, { scaleX: 0, transformOrigin: 'left center' }, a);
      T0(`#${id}-rr${j}`, { opacity: 0 }, { opacity: 1, duration: 0.3 }, a + BEAT * 2 + j * 0.05); });
    let cum = 0;
    D.perRound.forEach((v, k) => {
      const t = rt(k), d = BEAT * 4 - 0.05, ord = ordAt(k), prev = k ? ordAt(k - 1) : ord;
      CNT(`${id}-c`, cum, cum + v, t, d); cum += v;
      T0(`#${id}-hi${k}`, { scaleY: 0 }, { scaleY: 1, duration: d, ease: 'none' }, t);
      T0(`#${id}-ho${k}`, { opacity: 0, scaleY: 0 }, { opacity: 1, scaleY: 1, duration: d, ease: 'none' }, t);
      T(`#${id}-ho${k}`, { opacity: 1 }, { opacity: 0, duration: 0.3 }, t + d);
      SET(`#${id}-kl`, { innerText: `${k + 1}. kolo · ${di ? 'neděle' : 'sobota'}` }, t);
      LEAD.forEach((x, j) => { const p0 = k ? cumP(x, k - 1) : 0, p1 = cumP(x, k);
        T(`#${id}-rb${j}`, { scaleX: p0 / maxP }, { scaleX: p1 / maxP, duration: 0.6, ease: 'power2.out' }, t + BEAT * 2);
        T(`#${id}-rr${j}`, { y: prev.indexOf(x.name) * rowH }, { y: ord.indexOf(x.name) * rowH, duration: 0.6, ease: 'power3.inOut' }, t + BEAT * 2);
        out.push(`tl.fromTo("#${id}-rv${j}", {innerText:${p0}}, {innerText:${p1}, snap:{innerText:1}, duration:0.6, ease:"none", immediateRender:false}, ${(t + BEAT * 2).toFixed(3)});`); });
      SET(`#${id}-rkn`, { innerText: k + 1 }, t + BEAT * 2);
      T(`#${id}-rk`, { scale: 1.25 }, { scale: 1, duration: 0.35, ease: 'back.out(3)' }, t + BEAT * 2);
      T0(`#${id}-rc${k}`, { opacity: 0, x: -4 * u }, { opacity: 1, x: 0, duration: 0.4, ease: 'expo.out' }, t + BEAT * 1.5);
      if (k < 11) T(`#${id}-rc${k}`, { opacity: 1 }, { opacity: 0, duration: 0.25 }, rt(k + 1) + BEAT * 1.5 - 0.25);
    });
    // konec dne: vítěz dne zazáří
    const te = BAR(b0 + 13);
    T(`#${id}-rr0`, { backgroundColor: 'rgba(227,30,36,0)' }, { backgroundColor: 'rgba(227,30,36,.2)', duration: 0.3, yoyo: true, repeat: 5 }, te);
    T(`#${id}-rr1, #${id}-rr2`, { backgroundColor: 'rgba(48,66,133,0)' }, { backgroundColor: 'rgba(48,66,133,.14)', duration: 0.3, yoyo: true, repeat: 3 }, te + BEAT);
  };
  live(0); live(1);

  // ===================== 3/5) SEKTORY A MÍSTA (styl Klonówiec): 20 sektorů = dvojice míst, které proti sobě hrají duel =====================
  const stats = (di) => {
    const D = DAYS[di], id = `s-${D.k}s`, [b0, b1] = BARS[`${D.k}s`], a = BAR(b0), b = BAR(b1), m = BAR(b0 + 3);   // a→m 3D pohled na rybník, m→b dlaždice sektorů
    // --- 1. část: letecký snímek ve 3D, sloupec = ryby na místě, kamera krouží (každý den jiný úhel) ---
    const mx = Math.max(...Object.values(DAYS[0].stand), ...Object.values(DAYS[1].stand));
    const AS = P ? 104 * u : 100 * u, colW = (P ? 2.4 : 2.2) * u, maxH = (P ? 20 : 17) * u;
    const CAM = di === 0 ? { x1: 56, z0: -38, z1: -14, s1: 1.05 } : { x1: 44, z0: 206, z1: 172, s1: 1.1 };
    const top10 = Object.entries(D.stand).map(([n, v]) => [+n, v]).sort((x, y) => y[1] - x[1] || x[0] - y[0]).slice(0, 10);
    const ist = (n) => top10.some(([k]) => k === +n);
    const apo = (n) => apos(n, AS, CB);
    const cols = Object.entries(D.stand).map(([n, v]) => { const [x, y] = apo(n), h = Math.max(0.6 * u, (v / mx) * maxH);
      return `<div class="c3 bb" id="${id}-c${n}" style="left:${f(x)}; top:${f(y)}; width:${f(colW)}; height:${f(h)}; margin:${f(-h)} 0 0 ${f(-colW / 2)}; --c:${heat(v / mx)}">${ist(n) ? `<b class="cv">${v}</b>` : ''}</div>`; }).join('');
    const sdots = Object.keys(AER.stands).map((n) => { const [x, y] = apo(n); return `<i class="sd3" style="left:${f(x)}; top:${f(y)}"><em class="bb">${n}</em></i>`; }).join('');
    const PL = D.stand, SEC = Object.fromEntries(Array.from({ length: 20 }, (_, i) => [i + 1, PL[2 * i + 1] + PL[2 * i + 2]]));
    const PL0 = DAYS[0].stand, SEC0 = Object.fromEntries(Array.from({ length: 20 }, (_, i) => [i + 1, PL0[2 * i + 1] + PL0[2 * i + 2]]));
    // společná škála pro oba dny → neděle je vidět bledší
    const SEC1 = Array.from({ length: 20 }, (_, i) => DAYS[1].stand[2 * i + 1] + DAYS[1].stand[2 * i + 2]);
    const smax = Math.max(...Object.values(SEC)), smin = Math.min(...Object.values(SEC));   // škála zvlášť pro každý den
    const pmax = Math.max(...Object.values(PL)), pmin = Math.min(...Object.values(PL));
    const mix = (t) => { t = Math.max(0, Math.min(1, t)); const c0 = [223, 229, 241], c1 = [48, 66, 133]; return `rgb(${c0.map((v, i) => Math.round(v + (c1[i] - v) * t)).join(',')})`; };
    const hs = (v) => mix((v - smin) / (smax - smin)), hp = (v) => mix((v - pmin) / (pmax - pmin));
    const ink = (v, lo, hi) => ((v - lo) / (hi - lo) > 0.45 ? '#eef2f9' : '#0b1e42');
    // 16:9 jako u vody: nahoře SZ břeh (S11–S20), dole JV břeh (S1–S10), obojí zleva od JZ konce
    const order = P ? Array.from({ length: 20 }, (_, i) => i + 1) : [...Array.from({ length: 10 }, (_, i) => 11 + i), ...Array.from({ length: 10 }, (_, i) => 1 + i)];
    const best = Object.entries(PL).sort((p, q) => q[1] - p[1])[0], worst = Object.entries(PL).sort((p, q) => p[1] - q[1])[0];
    const bestS = Object.entries(SEC).sort((p, q) => q[1] - p[1])[0];
    const tiles = [
      [D.total, 'ryb celkem', di ? `−${Math.round((1 - D.total / DAYS[0].total) * 100)} % proti sobotě` : `${dec(D.total / D.n, 1)} na závodníka`],
      [D.mostFish.fish, 'nejvíc ryb', D.mostFish.name],
      [D.rec.f, 'rekord kola', D.rec.txt],
      [D.zero, 'kol bez ryby', `z ${D.rounds} startů v kolech`],
    ];
    const cell = (n) => { const v = SEC[n], p1 = 2 * n - 1, p2 = 2 * n, dlt = di ? Math.round((v / SEC0[n] - 1) * 100) : null;
      return `<div class="hcell" id="${id}-h${n}" style="background:${hs(v)}; color:${ink(v, smin, smax)}"><em>S${n}${dlt !== null ? ` <s>${dlt > 0 ? '+' : '−'}${Math.abs(dlt)} %</s>` : ''}</em><b>${v}</b>
        <div class="pp"><span style="background:${hp(PL[p1])}; color:${ink(PL[p1], pmin, pmax)}">${p1}<i>${PL[p1]}</i></span><span style="background:${hp(PL[p2])}; color:${ink(PL[p2], pmin, pmax)}">${p2}<i>${PL[p2]}</i></span></div></div>`; };
    scene(id, a, b, `${bgp(di === 0 ? 'bg_mcr26_zarybneni.jpg' : 'bg__drone_final_last.jpg', a, b, { op: 0.3, word: 'SEKTORY', id: `bg-${id}` })}${head(id, `Den ${di + 1} · místa a sektory`, P ? (di ? '20 sektorů · % = proti sobotě' : '20 sektorů · 40 míst · 12 kol') : `20 sektorů · 40 míst · ryby za 12 kol${di ? ' · % = proti sobotě' : ''}`, a + 0.05)}
      <div class="aw aw-s" id="${id}-a">${aerial(`${id}-a`, AS, CB, sdots + cols, { outline: true })}</div>
      <div class="acap" id="${id}-acap"><b>výška sloupce = ryby na místě</b> · 40 míst · popsáno top 10</div>
      <div class="heat">${P ? '' : '<div class="bank">SZ břeh · u silnice</div>'}${order.map(cell).join('')}${P ? '' : '<div class="bank b2">JV břeh · u lesa</div>'}</div>
      <div class="pstrip" id="${id}-ps">${Array.from({ length: 40 }, (_, i) => `<i id="${id}-pb${i + 1}" style="height:${((PL[i + 1] / pmax) * 100).toFixed(1)}%; background:${hp(PL[i + 1])}"></i>`).join('')}<em class="pse">místo 1 → 40</em></div>
      <div class="hnote" id="${id}-note"><b>Nejlepší místo ${best[0]}: ${best[1]} ryb</b> · sektor S${bestS[0]}: ${bestS[1]} · nejslabší místo ${worst[0]}: ${worst[1]} · Ø ${dec(D.total / 40, 1)} na místo</div>
      <div class="tiles2">${tiles.map(([v, l, s0], i) => `<div class="tile2" id="${id}-t${i}"><b id="${id}-tv${i}">0</b><span>${l}</span><em>${s0}</em></div>`).join('')}</div>`);
    // 1. část: rybník se sklopí, sloupce vyrostou, top 10 zazáří; před m kamera odletí nahoru
    T0(`#${id}-a`, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' }, a + 0.1);
    orbit(`${id}-a`, a + 0.1, m, { x0: 0, x1: CAM.x1, z0: CAM.z0, z1: CAM.z1, s0: 0.86, s1: CAM.s1, tin: 1.1 });
    T0(`#${id}-a .aol polygon`, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, a + 0.3);
    Object.keys(D.stand).forEach((n, i) => { const t = a + 0.9 + i * 0.035;
      SET(`#${id}-c${n}`, { rotationX: -90, transformOrigin: '50% 100%' }, a);
      T0(`#${id}-c${n}`, { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: 'back.out(1.6)' }, t);
      if (ist(n)) T0(`#${id}-c${n} .cv`, { opacity: 0 }, { opacity: 1, duration: 0.2 }, t + 0.3); });
    top10.forEach(([n], i) => T(`#${id}-c${n}`, { filter: 'brightness(1)' }, { filter: 'brightness(1.8) drop-shadow(0 0 10px rgba(255,211,107,.9))', duration: 0.25, yoyo: true, repeat: 1 }, a + BEAT * (7 + i * 0.4)));
    pop(`#${id}-acap`, a + BEAT * 3);
    T(`#${id}-a, #${id}-acap`, { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.15, duration: 0.45, ease: 'power2.in' }, m - 0.45);
    // 2. část: dlaždice sektorů (styl Klonówiec)
    order.forEach((n, i) => T0(`#${id}-h${n}`, { opacity: 0, rotationY: -100, transformPerspective: 600 }, { opacity: 1, rotationY: 0, duration: 0.5, ease: 'back.out(1.6)' }, m + i * 0.05));
    T0(`#${id} .pp span`, { opacity: 0, y: u }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.02, ease: 'power3.out' }, m + 1.1);
    if (!P) T0(`#${id} .bank`, { opacity: 0 }, { opacity: 1, duration: 0.4 }, m);
    for (let i = 1; i <= 40; i++) T0(`#${id}-pb${i}`, { scaleY: 0 }, { scaleY: 1, duration: 0.4, ease: 'power3.out' }, m + BEAT * 3 + i * 0.025);
    T0(`#${id} .pse`, { opacity: 0 }, { opacity: 0.7, duration: 0.4 }, m + BEAT * 3);
    pop(`#${id}-note`, m + BEAT * 5.5);
    T(`#${id}-pb${best[0]}`, { filter: 'brightness(1)' }, { filter: 'brightness(1.8)', duration: 0.3, yoyo: true, repeat: 5 }, m + BEAT * 6);
    T(`#${id}-h${bestS[0]}`, { boxShadow: '0 0 0 0px rgba(227,30,36,0)' }, { boxShadow: `0 0 0 ${(0.7 * u).toFixed(1)}px rgba(227,30,36,1)`, duration: 0.3, yoyo: true, repeat: 5, ease: 'sine.inOut' }, m + BEAT * 6);
    tiles.forEach(([v], i) => { const t = m + BEAT * (8 + i * 0.75); pop(`#${id}-t${i}`, t); CNT(`${id}-tv${i}`, 0, v, t + 0.05, 0.8); });
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
    const S = D.top, N = S.length, half = Math.ceil(N / 2), cols = P ? [S] : [S.slice(0, half), S.slice(half)];
    const sq = (r) => `<i class="q p${r.pts}${(r.fish || 0) >= 8 ? ' hot' : ''}">${r.fish ?? 0}</i>`;
    scene(id, a, b, `${bgp(di === 0 ? 'bg_mcr26_breh_pruty.jpg' : 'bg_mcr26_kontrola_vysledku.jpg', a, b, { op: 0.2, id: `bg-${id}` })}${head(id, `Výsledky · Den ${di + 1}`, P ? `všech ${N} · kolo po kole` : `všech ${N} · kolo po kole · číslo = ryby v kole`, a + 0.05)}
      <div class="qleg" id="${id}-leg"><span><i class="q p3"></i>výhra${P ? '' : ' 3 b.'}</span><span><i class="q p2"></i>remíza s rybou${P ? '' : ' 2 b.'}</span><span><i class="q p1"></i>0:0${P ? '' : ' 1 b.'}</span><span><i class="q p0"></i>prohra</span></div>
      <div class="allw" id="${id}-w"><div class="allc" id="${id}-allc">${cols.map((c) => `<div class="allcol"><div class="ar arh"><span class="ap">#</span><span class="an">závodník</span><span class="qs">${Array.from({ length: 12 }, (_, k) => `<i>${k + 1}</i>`).join('')}</span><span class="af">ryby</span><b>body</b></div>${c.map((x) => `<div class="ar" id="${id}-ar${x.place}"><span class="ap">${x.place}</span><span class="an">${x.name}</span><span class="qs">${x.rounds.map(sq).join('')}</span><span class="af">${x.fish}</span><b>${x.points}</b></div>`).join('')}</div>`).join('')}</div></div>`);
    pop(`#${id}-leg`, a + BEAT * 2); T0(`#${id}-w`, { opacity: 0, y: 3 * u }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, a + BEAT * 1.5);
    S.forEach((x, i) => T0(`#${id}-ar${x.place}`, { opacity: 0, x: -3 * u }, { opacity: 1, x: 0, duration: 0.3, ease: 'power3.out' }, a + BEAT * 2 + (P ? i * 0.03 : (i % half) * 0.04 + Math.floor(i / half) * 0.25)));
    for (let k = 0; k < 12; k++) T0(`#${id} .ar:not(.arh) .q:nth-child(${k + 1})`, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2.5)', stagger: 0.008 }, a + BEAT * 3 + k * 0.12);
    T(`#${id}-ar1 .q.p3, #${id}-ar2 .q.p3, #${id}-ar3 .q.p3`, { boxShadow: '0 0 0 0 rgba(227,30,36,0)' }, { boxShadow: `0 0 0 ${(0.3 * u).toFixed(1)}px rgba(227,30,36,.95)`, duration: 0.3, yoyo: true, repeat: 3 }, a + BEAT * 9);
    if (P) { const rowH = 4.15 * u, vis = Math.floor((136 * u) / rowH) - 4; T0(`#${id}-allc`, { y: 0 }, { y: -(N - vis) * rowH, duration: len(a + BEAT * 9, b - 0.6), ease: 'sine.inOut' }, a + BEAT * 9); }
  };
  dayList(0); dayList(1);

  // ===================== 6) VÝSLEDEK MČR: součet umístění, všech 39 =====================
  {
    const id = 's-mcr', a = BAR(BARS.mcr[0]), b = BAR(BARS.mcr[1]), tl0 = a + BEAT * 8;
    scene(id, a, b, `${bgp('bg_mcr26_kontrola_vysledku.jpg', a, b, { op: 0.24, word: 'MČR 2026', id: 'bg-mcr' })}${head(id, 'Výsledek MČR', 'součet umístění z obou dnů · nižší vyhrává', a + 0.05)}
      <div class="rule big" id="mr-rule"><b>Den 1 + Den 2 = Σ</b><span>soutěžní řád 6.4–6.5 · při shodě rozhoduje řád</span></div>
      ${lgrid(id, MCRALL.map((x, i) => lrow(id, i, `<span>${x.name}</span><em>${x.d1}.</em><em>${x.d2}.</em><u>${x.d1 + x.d2}</u><em class="fz">${x.f1 + x.f2}</em>`)), '<b>#</b><span>závodník</span><em>D1</em><em>D2</em><u>Σ</u><em>ryby</em>')}`);
    T0('#mr-rule', { opacity: 0, scale: 0.6, rotationX: -60, transformPerspective: 900 }, { opacity: 1, scale: 1, rotationX: 0, duration: 0.6, ease: 'back.out(2)' }, a + BEAT * 2);
    T('#mr-rule', { scale: 1 }, { scale: 1.08, duration: 0.2, yoyo: true, repeat: 1 }, a + BEAT * 4);
    T('#mr-rule', { opacity: 1 }, { opacity: 0, scale: 0.8, duration: 0.3, ease: 'power2.in' }, tl0 - 0.35);
    T0(`#${id} .lgh`, { opacity: 0 }, { opacity: 1, duration: 0.4 }, tl0);
    T0(`#${id}-lg`, { opacity: 0 }, { opacity: 1, duration: 0.3 }, tl0 - 0.1);
    lin(id, MCRALL.length, tl0, false);
    [0, 1, 2].forEach((i) => T(`#${id}-l${i}`, { boxShadow: '0 0 0 0px rgba(255,211,107,0)' }, { boxShadow: `0 0 0 ${(0.35 * u).toFixed(1)}px rgba(255,211,107,1), 0 0 ${(2.5 * u).toFixed(0)}px rgba(255,211,107,.45)`, duration: 0.4, ease: 'power2.out' }, b - BEAT * 9 + i * BEAT));
  }

  // ===================== 6b) SROVNÁNÍ DNŮ (styl Klonówiec): okvětní graf Den 1 vs Den 2 → ryby ≠ body =====================
  {
    const id = 's-fpa', a = BAR(BARS.fpa[0]), b = BAR(BARS.fpa[1]), m = BAR(BARS.fpa[0] + 3);
    const F1 = DAYS[0].perRound, F2 = DAYS[1].perRound, mx = Math.max(...F1, ...F2), T1 = DAYS[0].total, T2 = DAYS[1].total;
    const S = P ? 76 * u : 66 * u, c = S / 2, rmax = S * 0.42, rmin = S * 0.13;
    const pet = (k, v, w) => { const a0 = (k * 30 - 90 - w) * Math.PI / 180, a1 = (k * 30 - 90 + w) * Math.PI / 180, r = rmin + (v / mx) * (rmax - rmin);
      return `M${(c + rmin * Math.cos(a0)).toFixed(1)},${(c + rmin * Math.sin(a0)).toFixed(1)} L${(c + r * Math.cos(a0)).toFixed(1)},${(c + r * Math.sin(a0)).toFixed(1)} A${r.toFixed(1)},${r.toFixed(1)} 0 0 1 ${(c + r * Math.cos(a1)).toFixed(1)},${(c + r * Math.sin(a1)).toFixed(1)} L${(c + rmin * Math.cos(a1)).toFixed(1)},${(c + rmin * Math.sin(a1)).toFixed(1)} A${rmin},${rmin} 0 0 0 ${(c + rmin * Math.cos(a0)).toFixed(1)},${(c + rmin * Math.sin(a0)).toFixed(1)}Z`; };
    const lab = F1.map((_, k) => { const an = (k * 30 - 90) * Math.PI / 180, r = rmax + S * 0.05; return `<text x="${(c + r * Math.cos(an)).toFixed(1)}" y="${(c + r * Math.sin(an) + S * 0.012).toFixed(1)}" text-anchor="middle" font-size="${(S * 0.034).toFixed(1)}">${k + 1}</text>`; }).join('');
    const rings = [100, 200, 300].map((v) => `<circle cx="${c}" cy="${c}" r="${(rmin + (v / mx) * (rmax - rmin)).toFixed(1)}" class="rg"/>`).join('');
    const drop = Math.round((1 - T2 / T1) * 100);
    // ryby ≠ body: top 10 podle ryb za 2 dny → místo v MČR
    const SEL = [...MCRALL].sort((x, y) => (y.f1 + y.f2) - (x.f1 + x.f2) || x.rank - y.rank).slice(0, 10), byRank = [...SEL].sort((x, y) => x.rank - y.rank);
    const CW = P ? 90 * u : 120 * u, CH = P ? 64 * u : 62 * u, padT = 6 * u, padB = 2 * u, lw = P ? 30 * u : 26 * u, rw = P ? 24 * u : 22 * u;
    const xl = lw, xr = CW - rw, yy = (i) => padT + (i + 0.5) * ((CH - padT - padB) / 10), fs = (P ? 2.5 : 2.1) * u;
    const fv = (x) => x.f1 + x.f2, fmin = Math.min(...SEL.map(fv)), fmax = Math.max(...SEL.map(fv)), sw = (v) => (0.5 + ((v - fmin) / Math.max(1, fmax - fmin)) * 1.6) * u;
    const defs = SEL.map((x, i) => `<linearGradient id="fg${i}" gradientUnits="userSpaceOnUse" x1="${xl}" x2="${xr}" y1="0" y2="0"><stop offset="0" stop-color="#8ea2d8"/><stop offset="1" stop-color="${byRank.indexOf(x) - i > 0 ? '#e31e24' : '#304285'}"/></linearGradient>`).join('');
    const rib = SEL.map((x, i) => { const y1 = yy(i), y2 = yy(byRank.indexOf(x)), xm = (xl + xr) / 2;
      return `<path class="rbn" id="fr${i}" d="M${xl.toFixed(1)},${y1.toFixed(1)} C${xm.toFixed(1)},${y1.toFixed(1)} ${xm.toFixed(1)},${y2.toFixed(1)} ${xr.toFixed(1)},${y2.toFixed(1)}" stroke="url(#fg${i})" stroke-width="${sw(fv(x)).toFixed(1)}" pathLength="1"/>`; }).join('');
    const lp = SEL.map((x, i) => `<div class="bl" id="fl${i}" style="top:${f(yy(i))}; width:${f(lw - 1.2 * u)}; font-size:${f(fs)}"><span class="bn">${short(x.name)}</span><b>${fv(x)}</b></div>`).join('');
    const rp = byRank.map((x, j) => `<div class="br" id="fb${SEL.indexOf(x)}" style="top:${f(yy(j))}; left:${f(xr + 1.2 * u)}; font-size:${f(fs)}"><b>${x.rank}.</b><span>Σ ${x.d1 + x.d2}</span></div>`).join('');
    const most = SEL[0], champ = MCRALL[0];
    scene(id, a, b, `${bgp('bg_mcr26_podberak.jpg', a, b, { op: 0.22, id: 'bg-fpa' })}
      <div id="fpa1"><div class="h2"><span>${P ? 'Den 1 vs Den 2' : 'Den 1 vs Den 2'}</span><em>ryby kolo po kole · sobota vs neděle</em></div>
        <div class="polar" style="width:${f(S)}; height:${f(S)}"><svg viewBox="0 0 ${S.toFixed(0)} ${S.toFixed(0)}">${rings}${F1.map((v, k) => `<path id="pt1_${k}" class="pt1" d="${pet(k, v, 13)}"/>`).join('')}${F2.map((v, k) => `<path id="pt2_${k}" class="pt2" d="${pet(k, v, 8)}"/>`).join('')}${lab}</svg>
          <div class="pc"><b id="pcv">0</b><span>neděle</span><i>sobota: ${fmt(T1)}</i></div></div>
        <div class="cmpt"><div class="ct" id="ct0"><i class="sw1"></i><b>${fmt(T1)}</b><span>ryb · sobota</span></div><div class="ct" id="ct1"><i class="sw2"></i><b>${fmt(T2)}</b><span>ryb · neděle · déšť</span></div>
          <div class="ct red" id="ct2"><b>−${drop} %</b><span>v neděli braly výrazně hůř</span></div></div></div>
      <div id="fpa2"><div class="h2"><span>Ryby ≠ body</span><em>top 10 podle ryb za 2 dny → místo v MČR</em></div>
        <div class="kbump" style="width:${f(CW)}; height:${f(CH)}"><div class="bhd" style="left:0; width:${f(lw)}">ryby · 2 dny</div><div class="bhd" style="left:${f(xr)}; width:${f(rw)}">místo MČR</div>
          <svg viewBox="0 0 ${CW.toFixed(0)} ${CH.toFixed(0)}"><defs>${defs}</defs>${rib}</svg>${lp}${rp}</div>
        <div class="snote" id="fnote"><b>${short(most.name)}: ${fv(most)} ryb → ${most.rank}. místo</b>${most.rank === 1 ? ' · nejvíc ryb i titul' : ` · ${short(champ.name)}: ${champ.f1 + champ.f2} ryb → 1. místo`}</div></div>`);
    // 1) polární graf
    rise('#fpa1 .h2 span', a + 0.05); pop('#fpa1 .h2 em', a + BEAT);
    T0(`#${id} .polar`, { opacity: 0, rotation: -40, scale: 0.8 }, { opacity: 1, rotation: 0, scale: 1, duration: 0.8, ease: 'expo.out' }, a + 0.2);
    F1.forEach((_, k) => { T0(`#pt1_${k}`, { scale: 0, transformOrigin: `${c}px ${c}px` }, { scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, a + 0.5 + k * 0.05);
      T0(`#pt2_${k}`, { scale: 0, transformOrigin: `${c}px ${c}px` }, { scale: 1, duration: 0.45, ease: 'back.out(2.2)' }, a + BEAT * 3 + k * BEAT / 2); });
    CNT('pcv', 0, T2, a + 0.8, 2.2);
    [0, 1, 2].forEach((i) => pop(`#ct${i}`, a + BEAT * (2 + i * 2)));
    out.push(`tl.fromTo("#${id} .polar svg", {rotation:0}, {rotation:12, duration:${len(a, m)}, ease:"none", transformOrigin:"50% 50%", immediateRender:false}, ${a.toFixed(3)});`);
    T('#fpa1', { opacity: 1 }, { opacity: 0, y: -3 * u, duration: 0.35, ease: 'power2.in' }, m - 0.35);
    // 2) ryby ≠ body
    T0('#fpa2', { opacity: 0 }, { opacity: 1, duration: 0.01 }, m);
    rise('#fpa2 .h2 span', m + 0.05); pop('#fpa2 .h2 em', m + BEAT);
    T0(`#${id} .kbump`, { opacity: 0, y: 3 * u }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, m + 0.2);
    SEL.forEach((_, i) => { const t = m + 0.6 + i * BEAT / 2;
      T0(`#fl${i}`, { opacity: 0, x: -3 * u }, { opacity: 1, x: 0, duration: 0.3, ease: 'expo.out' }, t);
      T0(`#fr${i}`, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, t + 0.1);
      T0(`#fb${i}`, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(3)' }, t + 0.9); });
    const tf = m + BEAT * 9, hi = [0, SEL.findIndex((x) => x.rank === 1)].filter((v, i, z) => v >= 0 && z.indexOf(v) === i);
    SEL.forEach((_, i) => { if (!hi.includes(i)) { T(`#fr${i}`, { opacity: 1 }, { opacity: 0.18, duration: 0.4 }, tf); T(`#fl${i}, #fb${i}`, { opacity: 1 }, { opacity: 0.35, duration: 0.4 }, tf); } });
    hi.forEach((i) => T(`#fr${i}`, { filter: 'drop-shadow(0 0 0px rgba(227,30,36,0))' }, { filter: `drop-shadow(0 0 ${(1.2 * u).toFixed(1)}px rgba(227,30,36,.9))`, duration: 0.3, yoyo: true, repeat: 5 }, tf + 0.1));
    pop('#fnote', tf + 0.2);
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
    const tStrike = BAR(BARS.sez[0] + 3), tSort = BAR(BARS.sez[0] + 4) + BEAT * 2, tFin = BAR(BARS.sez[0] + 6) + BEAT * 2;
    const N = SEZ.length, rowH = P ? 7 * u : 6 * u;
    const yAll = (r) => ALL10.indexOf(r.name) >= 0 ? ALL10.indexOf(r.name) : 10 + B6TOP.indexOf(r.name);
    const yB6 = (r) => B6TOP.indexOf(r.name) >= 0 ? B6TOP.indexOf(r.name) : 10 + ALL10.indexOf(r.name);
    const cell = (p, c, k) => `<span class="sc${ABSENT(p) ? ' ab' : ''}${c ? '' : ' x'}"><i>${ABSENT(p) ? '–' : p}</i></span>`;
    const champ = SEZ.find((x) => x.b6Rank === 1), s2 = SEZ.find((x) => x.b6Rank === 2), s3 = SEZ.find((x) => x.b6Rank === 3);
    const hra = SEZ.filter((x) => x.allRank > 10).sort((x, y) => (x.allRank - x.b6Rank) - (y.allRank - y.b6Rank)).pop();
    const ph = PHOTOS.winners ? `<div class="chph" style="background-image:url(assets/photos/${PHOTOS.winners})"></div>` : '';
    scene(id, a, b, `${bgp('bg_mcr26_porada.jpg', a, tFin, { op: 0.24, word: 'SEZÓNA 2026', id: 'bg-sez' })}${head(id, 'Mistr Trout Area ČR 2026', 'sezóna · 8 bodovaných závodů', a + 0.05)}
      <div class="sm" id="sm"><div class="smh"><span class="sp">#</span><span class="sn">závodník</span>${EV.map((e, k) => `<span class="sc h"><i>${EVS[k]}</i><em>${EVD[k]}</em></span>`).join('')}<span class="sa">Ø</span></div>
        <div class="smb" style="height:${f(rowH * 10)}">${SEZ.map((x, i) => `<div class="smr" id="sr${i}" style="top:${f(yAll(x) * rowH)}; height:${f(rowH)}"><span class="sp"><b id="srp${i}">${yAll(x) + 1}</b></span><span class="sn"><i class="snn">${x.name}</i>${x === hra ? `<em class="jmp" id="sz-jump">▲ ${hra.allRank}. → ${hra.b6Rank}.</em>` : ''}</span>${x.pos.map((p, k) => cell(p, x.cnt[k], k)).join('')}<span class="sa"><b id="sra${i}">${dec(x.all)}</b></span></div>`).join('')}</div></div>
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
    const id = 's-end', a0 = BAR(BARS.end[0]), a = a0 + BEAT * 6, b = DUR;
    scene(id, a0, b, `<div class="fin" id="fin"><div class="fv"><b id="fin-n">0</b><span>ryb za 2 dny · Mistrovství ČR 2026</span></div>
      <div class="fsp"><span><b>${fmt(DAYS[0].total)}</b> sobota</span><span><b>${fmt(DAYS[1].total)}</b> neděle</span><span><b>39</b> závodníků</span></div><div class="fz"><span>Díky, Liběchov · fair play!</span></div></div>
      <div class="pgw"><div class="pg">${PARTNERS.map((k, i) => `<div class="pl" id="pl${i}"><img src="assets/logos/light/${k}.png" alt=""></div>`).join('')}</div></div>
      <div class="tap end" id="tap-end"><img src="assets/ta_logo.png" alt="Trout Area Czech Republic"></div>
      <div class="ghm" id="gh-end"><span class="by">made by</span><span class="gear"><img class="ring" src="assets/gh/ring.png" alt=""><img class="core" src="assets/gh/core.png" alt=""></span><img class="wl2" src="assets/gh/word-line.png" alt="Gausse Holler"></div>`);
    CNT('fin-n', 0, DAYS[0].total + DAYS[1].total, a0 + 0.2, 1.8);
    pop('#fin .fv', a0 + 0.05); pop('#fin .fsp', a0 + BEAT * 2); pop('#fin .fz', a0 + BEAT * 3);
    T('#fin', { opacity: 1 }, { opacity: 0, scale: 0.94, duration: 0.3, ease: 'power2.in' }, a - 0.3);
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
    eq((j) => `#${id}-hi${j}`, 12, BAR(b0 + 13), BAR(b1), 0.4);                                     // po dni: sloupce kol hrají
    padRun((j) => `#${id}-rr${j}`, 10, BAR(b0 + 13), BAR(b1), 1.15, 0.25); });
  ['d1s', 'd2s'].forEach((k) => { const id = `s-${k}`, [b0, b1] = BARS[k], a = BAR(b0 + 3) + BEAT * 2, b = BAR(b1);   // sektory: světlo běží přes 20 dlaždic + úder na dobu
    padRun((j) => `#${id}-h${j + 1}`, 20, a, b, 1.6, 0.24);
    beatsIn(a, b).forEach((t, i) => out.push(`tl.fromTo("#${id}-h${(i % 20) + 1}", {scale:0.92}, {scale:1, duration:0.2, ease:"back.out(3)", immediateRender:false}, ${t.toFixed(3)});`));
    padRun((j) => `#${id}-pb${j + 1}`, 40, BAR(b0 + 3) + BEAT * 5, b, 2.2, 0.18); });
  // celé pořadí: světlo běží po řádcích na každou dobu
  ['d1l', 'd2l'].forEach((k) => padRun((j) => `#s-${k} .ar:not(.arh) .q:nth-child(${j + 1})`, 12, BAR(BARS[k][0]) + BEAT * 6.5, BAR(BARS[k][1]), 1.8, 0.22));   // světlo jede po kolech
  padRun((j) => `#s-mcr-l${j}`, 39, BAR(BARS.mcr[0]) + BEAT * 14, BAR(BARS.mcr[1]), 1.35, 0.25);
  padRun((k) => `#pt2_${k}`, 12, BAR(BARS.fpa[0]) + BEAT * 9.5, BAR(BARS.fpa[0] + 3) - 0.4, 1.7, 0.24);   // okvětní lístky bijí jako pady
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
  // pozadí jako v Klonówiec: tah štětcem v barvách vlajky ČR + blikající hvězdy
  const STARS = Array.from({ length: 24 }, (_, i) => ({ x: rnd(i * 3 + 1) * 100, y: rnd(i * 5 + 2) * 80 + 4, s: 0.6 + rnd(i * 7) * 1.6, p: rnd(i * 11) * 2.2 }));
  STARS.forEach((st, i) => { const per = 1.6 + rnd(i * 13) * 1.4, rep = Math.floor((DUR - st.p) / per) - 1; out.push(`tl.fromTo("#star${i}", {scale:0, opacity:0}, {scale:1, opacity:1, duration:${(per / 2).toFixed(2)}, ease:"sine.inOut", repeat:${rep * 2 + 1}, yoyo:true}, ${st.p.toFixed(2)});`); });
  G.downbeats.forEach((t) => out.push(`tl.fromTo("#st-band", {scale:1.02}, {scale:1, duration:0.4, ease:"power2.out", immediateRender:false}, ${t.toFixed(3)});`));
  out.push(`tl.fromTo("#st-band", {xPercent:-2}, {xPercent:2, duration:${(DUR / 4).toFixed(2)}, ease:"sine.inOut", yoyo:true, repeat:3}, 0);`);
  // paprsky jen v intru, na stupních, u šampiona a na konci; v datových scénách tlumené + vinětace
  const calm = (t, on) => { T('#rays-w', { opacity: on ? 1 : 0.3 }, { opacity: on ? 0.3 : 1, duration: 0.5 }, t); T('#vig', { opacity: on ? 0 : 1 }, { opacity: on ? 1 : 0, duration: 0.5 }, t); };
  SET('#vig', { opacity: 0 }, 0);
  calm(BAR(BARS.d1[0]), true); calm(BAR(BARS.pod[0]), false); calm(BAR(BARS.sez[0]), true); calm(BAR(BARS.sez[0] + 6) + BEAT * 2, false);
  // malý TA logo v rohu (mimo intro a konec)
  T0('#corner', { opacity: 0 }, { opacity: 0.9, duration: 0.5 }, BAR(BARS.d1[0]));
  T('#corner', { opacity: 0.9 }, { opacity: 0, duration: 0.4 }, BAR(BARS.end[0]) - 0.4);

  const brush = (yc, th, seed) => { const n = 26, p1 = [], p2 = []; for (let i = 0; i <= n; i++) { const x = -10 + (120 * i) / n; p1.push(`${x.toFixed(1)},${(yc - th / 2 + (rnd(seed + i) - 0.5) * th * 0.35).toFixed(1)}`); p2.unshift(`${x.toFixed(1)},${(yc + th / 2 + (rnd(seed + 50 + i) - 0.5) * th * 0.35).toFixed(1)}`); } return p1.concat(p2).join(' '); };
  const BAND = `<svg class="band" viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="${brush(46, 12, 1)}" fill="#ffffff" opacity=".92"/><polygon points="${brush(58, 12, 2)}" fill="#d7141a" opacity=".95"/><polygon points="-10,38 22,52 -10,66" fill="#11457e"/></svg>`;
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
  .band { position:absolute; left:${px(-10)}; width:calc(100% + ${px(20)}); top:${P ? '10%' : '0%'}; height:${P ? '70%' : '100%'}; }
  #st-band { position:absolute; inset:0; rotate:${P ? -24 : -12}deg; opacity:.32; }
  .star { position:absolute; background:#fff; clip-path:polygon(50% 0, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0 50%, 40% 40%); box-shadow:0 0 ${px(1)} #fff; opacity:0; }
  #parts { display:none; } #parts i { position:absolute; top:0; border-radius:50%; background:radial-gradient(circle, rgba(220,236,255,.95), rgba(220,236,255,0) 70%); opacity:0; }
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

  /* živý den (styl Klonówiec) */
  .wx { position:absolute; ${P ? `right:${f(SAFE.r)}; top:${f(SAFE.t)}` : `right:${px(22)}; top:${f(SAFE.t)}`}; width:${px(P ? 12 : 9)}; height:${px(P ? 12 : 9)}; overflow:visible; }
  .wx.sun circle { fill:var(--gold); } .wx.sun line { stroke:var(--gold); stroke-width:3; stroke-linecap:round; } .wx.sun { transform-origin:center; }
  .wx.rain path { fill:#cfd8ee; } .wx.rain line { stroke:#7fb2ff; stroke-width:2.6; stroke-linecap:round; }
  .kph { position:absolute; inset:0; background-size:cover; background-position:50% 35%; opacity:0; }
  .kdim { position:absolute; inset:0; background:linear-gradient(180deg, rgba(5,13,34,.55) 0%, rgba(5,13,34,.35) 40%, rgba(5,13,34,.75) 100%); }
  .race { position:absolute; left:${f(SAFE.l)}; ${P ? `right:${f(SAFE.r)}; top:${px(31)}` : `width:${px(104)}; top:${f(SAFE.t + 15 * u)}`}; opacity:0; }
  .race::before { content:''; position:absolute; left:${px(-2)}; right:${px(-2)}; top:${px(-1.6)}; bottom:${px(-1.6)}; background:rgba(238,242,249,.96); border-radius:${px(2)}; box-shadow:0 ${px(1)} ${px(4)} rgba(0,0,0,.35); }
  .rr { position:absolute; left:0; right:0; top:0; height:${px(P ? 5.2 : 4.4)}; display:grid; grid-template-columns:${px(P ? 24 : 20)} 1fr ${px(P ? 6 : 5)}; align-items:center; gap:${px(1.4)}; border-radius:${px(1)}; padding:0 ${px(1)}; color:#0b1e42; font-family:Montserrat; }
  .rn { font-weight:800; font-size:${px(P ? 2.8 : 2.4)}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .rb { overflow:hidden; } .rb i { display:block; height:${px(P ? 3.4 : 2.9)}; border-radius:0 ${px(1)} ${px(1)} 0; }
  .rr b { font-weight:900; font-size:${px(P ? 3.6 : 3)}; text-align:right; }
  .rk { position:absolute; ${P ? `right:${f(SAFE.r)}; top:${px(91)}` : `left:${px(114)}; top:${f(SAFE.t + 14 * u)}`}; text-align:${P ? 'right' : 'left'}; font-family:Montserrat; opacity:0; transform-origin:${P ? 'right' : 'left'} center; }
  .rk span { display:block; font-weight:900; font-size:${px(P ? 10 : 12)}; line-height:1; color:var(--red); } .rk em { font-style:normal; font-weight:700; font-size:${px(P ? 2.2 : 2)}; letter-spacing:.2em; text-transform:uppercase; }
  .rcw { position:absolute; ${P ? `left:${f(SAFE.l)}; right:${f(SAFE.r)}; top:${px(108)}; height:${px(24)}` : `left:${px(114)}; right:${f(SAFE.r)}; top:${f(SAFE.t + 32 * u)}; height:${px(22)}`}; }
  .rc { position:absolute; left:0; right:0; top:0; background:rgba(238,242,249,.96); color:#0b1e42; border-left:${px(0.9)} solid var(--red); border-radius:${px(1.6)}; padding:${px(1.8)} ${px(2.6)}; opacity:0; box-shadow:0 ${px(0.8)} ${px(3)} rgba(0,0,0,.3); font-family:Montserrat; }
  .rc-n span { display:inline-block; font-weight:800; font-size:${px(P ? 2.8 : 2.3)}; letter-spacing:.14em; text-transform:uppercase; color:var(--red); }
  .rc-f { display:flex; align-items:baseline; gap:${px(1.6)}; margin-top:${px(0.4)}; } .rc-f b { font-weight:900; font-size:${px(P ? 9 : 7.5)}; line-height:1; } .rc-f span { font-weight:700; font-size:${px(P ? 2.6 : 2.2)}; color:#304285; }
  .rc-b { font-weight:600; font-size:${px(P ? 2.4 : 2)}; margin-top:${px(0.6)}; } .rc-b b { font-weight:800; color:#304285; }
  .khud { position:absolute; left:${px(5)}; right:${px(5)}; bottom:${px(P ? 4 : 2.6)}; height:${px(P ? 26 : 11)}; display:grid; box-sizing:border-box;
    grid-template-columns:${P ? '1fr 1fr' : `${px(26)} ${px(40)} 1fr`}; grid-template-rows:${P ? 'auto 1fr' : '1fr'}; gap:${px(P ? 1.6 : 2)} ${px(3)}; align-items:${P ? 'start' : 'center'};
    background:rgba(5,13,34,.82); border-radius:${px(2)}; padding:${px(P ? 2.4 : 1.6)} ${px(3)}; border:${px(0.2)} solid rgba(238,242,249,.12); font-family:Montserrat; opacity:0; }
  .khud .hc b { display:block; font-weight:900; font-size:${px(P ? 6.5 : 5)}; line-height:1; text-transform:uppercase; }
  .khud .hc span { display:block; font-weight:700; font-size:${px(P ? 2.3 : 1.7)}; letter-spacing:.1em; text-transform:uppercase; color:var(--gold); margin-top:${px(0.6)}; white-space:nowrap; }
  .khud .hn { text-align:right; } .khud .hn b { display:inline-block; font-weight:900; font-size:${px(P ? 8 : 6.4)}; line-height:1; color:var(--red); transform-origin:right center; }
  .khud .hn span { display:block; font-weight:600; font-size:${px(P ? 2 : 1.5)}; letter-spacing:.1em; text-transform:uppercase; margin-top:${px(0.5)}; }
  .khud .hr { ${P ? 'grid-column:1 / span 2;' : 'grid-column:3; grid-row:1;'} display:flex; align-items:flex-end; gap:${px(P ? 1 : 0.8)}; height:100%; padding-bottom:${px(2.4)}; box-sizing:border-box; }
  .khud .hcol { position:relative; flex:1; height:100%; display:flex; flex-direction:column; justify-content:flex-end; }
  .khud .hcol i, .khud .hcol .hon { position:absolute; left:0; right:0; bottom:0; background:linear-gradient(180deg, #6d8ff0, var(--blue)); border-radius:${px(0.5)} ${px(0.5)} 0 0; transform-origin:bottom; transform:scaleY(0); }
  .khud .hcol .hon { background:linear-gradient(180deg, #ff6b6f, var(--red)); box-shadow:0 0 ${px(1.4)} rgba(227,30,36,.8); opacity:0; }
  .khud .hcol s { position:absolute; left:0; right:0; bottom:0; border:${px(0.18)} dashed rgba(238,242,249,.5); border-bottom:0; border-radius:${px(0.5)} ${px(0.5)} 0 0; }
  .khud .hcol em { position:absolute; left:0; right:0; bottom:${px(-2.4)}; text-align:center; font-style:normal; font-weight:700; font-size:${px(P ? 1.6 : 1.3)}; opacity:.7; }

  /* statistika dne */
  .p3w { position:absolute; ${P ? `left:0; right:0; top:${px(24)}; height:${px(80)}` : `left:${f(SAFE.l - 2 * u)}; top:${f(SAFE.t + 8 * u)}; width:${px(100)}; height:${px(84)}`}; perspective:${px(160)}; perspective-origin:50% 40%; display:flex; align-items:center; justify-content:center; }
  .p3 { position:relative; transform-style:preserve-3d; }
  .pond3 { position:absolute; inset:0; width:100%; height:100%; overflow:visible; } .pond3 .po { fill:rgba(48,66,133,.45); stroke:#eef2f9; stroke-width:6; stroke-dasharray:1; } .pond3 .pi { fill:rgba(26,160,200,.18); stroke:rgba(238,242,249,.3); stroke-width:2; }
  .sd3 { position:absolute; width:${px(1.2)}; height:${px(1.2)}; margin:${px(-0.6)} 0 0 ${px(-0.6)}; border-radius:50%; background:#eef2f9; } .sd3 em { position:absolute; left:${px(1.4)}; top:${px(-0.4)}; font:800 ${px(1.5)} Montserrat; font-style:normal; color:rgba(238,242,249,.7); }
  .c3 { position:absolute; transform-style:preserve-3d; background:linear-gradient(0deg, var(--c), color-mix(in srgb, var(--c) 60%, #fff)); box-shadow:0 0 ${px(0.6)} rgba(0,0,0,.35); }
  .c3::after { content:''; position:absolute; left:100%; top:0; width:${px(1.2)}; height:100%; transform-origin:left; transform:rotateY(90deg); background:color-mix(in srgb, var(--c) 55%, #000); }
  .c3::before { content:''; position:absolute; left:0; top:0; width:100%; height:${px(1.2)}; transform-origin:top; transform:rotateX(90deg); background:color-mix(in srgb, var(--c) 70%, #fff); }
  .c3 .cv { position:absolute; left:50%; bottom:100%; transform:translateX(-50%); margin-bottom:${px(0.4)}; font:900 ${px(P ? 2.6 : 2.4)} Montserrat; color:#fff; text-shadow:0 0 ${px(0.5)} rgba(0,0,0,.9); white-space:nowrap; opacity:0; }
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
  .rule.big { left:50%; top:50%; right:auto; transform:translate(-50%,-50%); text-align:center; padding:${px(2.4)} ${px(4)}; z-index:4; box-shadow:0 ${px(1)} ${px(5)} rgba(0,0,0,.5); } .rule.big b { font-size:${px(P ? 5.2 : 6)}; white-space:nowrap; } .rule.big span { font-size:${px(2.4)}; }
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
  .sm { position:absolute; left:${f(SAFE.l)}; right:${f(SAFE.r)}; top:${P ? px(48) : f(SAFE.t + 15 * u)}; font-family:Montserrat; }
  .srule { ${P ? `left:${f(SAFE.l)}; top:${px(36)}` : `right:${f(SAFE.r)}; top:${px(9)}`}; } .srule b { font-size:${px(P ? 3.2 : 3)}; }
  .smh, .smr { display:grid; grid-template-columns:${px(4)} ${px(P ? 29 : 40)} repeat(8, 1fr) ${px(P ? 8 : 10)}; align-items:center; gap:${px(0.5)}; }
  .smh { color:var(--gold); margin-bottom:${px(1)}; } .smh .sc.h { display:flex; flex-direction:column; align-items:center; } .smh .sc.h i { font-style:normal; font-weight:900; font-size:${px(1.6)}; } .smh .sc.h em { font-style:normal; font-weight:600; font-size:${px(1.2)}; color:var(--lb); }
  .smh .sp, .smh .sn, .smh .sa { font-weight:800; font-size:${px(1.5)}; letter-spacing:.12em; text-transform:uppercase; }
  .smb { position:relative; } .smr { position:absolute; left:0; right:0; border-radius:${px(1)}; padding:0 ${px(0.6)}; box-sizing:border-box; }
  .smr .sn .snn { font-style:normal; }
  .smr .sp b { font-weight:900; font-size:${px(2.2)}; color:var(--red); } .smr .sn { font-weight:900; font-size:${px(P ? 2.1 : 2.4)}; white-space:nowrap; position:relative; }
  .jmp { position:relative; display:inline-block; vertical-align:middle; margin-left:${px(0.8)}; font-style:normal; font:900 ${px(P ? 1.6 : 1.9)} Montserrat; background:var(--gold); color:var(--navy); border-radius:${px(0.8)}; padding:${px(0.2)} ${px(0.8)}; opacity:0; z-index:2; white-space:nowrap; }
  .sc { position:relative; text-align:center; --x:0; } .smr .sc i { display:inline-block; font-style:normal; font-weight:800; font-size:${px(P ? 2.2 : 2.6)}; background:rgba(238,242,249,.93); color:var(--navy); border-radius:${px(0.6)}; min-width:${px(P ? 4.6 : 5.6)}; padding:${px(0.25)} 0; }
  .smr .sc.ab i { background:rgba(142,162,216,.25); color:var(--lb); }
  .smr .sc.x::after { content:''; position:absolute; left:10%; right:10%; top:50%; height:${px(0.45)}; background:var(--red); transform:rotate(-14deg) scaleX(var(--x)); transform-origin:left; border-radius:${px(0.3)}; }
  .smr .sa b { font-weight:900; font-size:${px(P ? 2.5 : 2.9)}; color:var(--gold); }
  .jump { position:absolute; ${P ? `left:${f(SAFE.l)}; bottom:${px(14)}` : `right:${f(SAFE.r)}; bottom:${f(SAFE.b)}`}; background:var(--gold); color:var(--navy); border-radius:${px(1.4)}; padding:${px(1.2)} ${px(2)}; font-family:Montserrat; opacity:0; }
  .jump b { display:block; font-weight:900; font-size:${px(2.6)}; } .jump span { font-weight:800; font-size:${px(2)}; }
  .champ { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; text-align:center; opacity:0; padding-bottom:${px(P ? 12 : 5)}; }
  .chph { position:absolute; left:0; right:0; top:${P ? px(50) : px(13)}; height:${P ? px(72) : '64%'}; background-size:${P ? '170% auto' : 'contain'}; background-repeat:no-repeat; background-position:50% 0%; -webkit-mask-image:linear-gradient(180deg, #000 0%, #000 60%, transparent 88%); filter:drop-shadow(0 0 ${px(1.2)} rgba(255,211,107,.55)) drop-shadow(0 ${px(1)} ${px(3)} rgba(0,0,0,.5)); }
  .champ > div:not(.chph) { position:relative; }
  .chk span { font-family:Montserrat; font-weight:800; font-size:${px(P ? 3 : 2.6)}; letter-spacing:.16em; text-transform:uppercase; color:var(--gold); }
  .chn span { font-family:Montserrat; font-weight:900; font-size:${px(P ? 11 : 9)}; text-transform:uppercase; line-height:1.05; text-shadow:0 ${px(0.6)} ${px(3)} rgba(0,0,0,.6); }
  .chs { display:inline-block; background:var(--red); color:#fff; font:900 ${px(P ? 3.2 : 2.8)} Montserrat; text-transform:uppercase; letter-spacing:.06em; border-radius:${px(1.2)}; padding:${px(1)} ${px(2.4)}; margin-top:${px(1.6)}; opacity:0; }
  .ch23 { display:flex; ${P ? 'flex-direction:column;' : ''} gap:${px(P ? 1 : 3)}; margin-top:${px(2.4)}; font:800 ${px(2.4)} Montserrat; } .ch23 span { opacity:0; background:rgba(5,13,34,.6); border-radius:${px(1)}; padding:${px(0.6)} ${px(1.6)}; } .ch23 b { color:var(--gold); }

  /* letecký snímek ve 3D */
  #fly { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0; }
  .aw { position:absolute; perspective:${px(150)}; perspective-origin:50% 45%; opacity:0; }
  .aw-i { inset:0; } .aw-i .ax, .aw-s .ax, .aw-p .ax { left:50%; top:50%; }
  .aw-s { ${P ? `left:0; right:0; top:${px(34)}; height:${px(120)}` : `left:0; right:0; top:${f(SAFE.t + 8 * u)}; height:${px(86)}`}; }
  .acap { position:absolute; ${P ? `left:${f(SAFE.l)}; right:${f(SAFE.r)}; top:${px(158)}` : `left:${f(SAFE.l)}; bottom:${f(SAFE.b)}`}; font:600 ${px(P ? 2.6 : 2.2)} Montserrat; color:var(--ice); text-shadow:0 ${px(0.3)} ${px(1.4)} rgba(0,0,0,.85); opacity:0; }
  .acap b { font-weight:900; color:var(--navy); background:var(--gold); padding:0 ${px(0.8)}; border-radius:${px(0.5)}; text-shadow:none; }
  .aw-p { ${P ? `left:0; right:0; top:${px(24)}; height:${px(92)}` : `left:${f(SAFE.l - 2 * u)}; top:${f(SAFE.t + 5 * u)}; width:${px(112)}; height:${px(84)}`}; }
  .ax { position:absolute; transform-style:preserve-3d; } .az { position:absolute; inset:0; transform-style:preserve-3d; }
  .aimg { position:absolute; inset:0; background-image:url(assets/aerial/malys_ortho.jpg); background-repeat:no-repeat; border-radius:${px(2)}; filter:saturate(1.05) brightness(.92);
    -webkit-mask-image:radial-gradient(ellipse 72% 72% at 50% 50%, #000 58%, transparent 100%); }
  .aol { position:absolute; inset:0; width:100%; height:100%; overflow:visible; } .aol polygon { fill:rgba(26,160,200,.10); stroke:rgba(238,242,249,.85); stroke-width:5; stroke-dasharray:1; stroke-linejoin:round; }
  .ad { position:absolute; width:${px(1.1)}; height:${px(1.1)}; margin:${px(-0.55)} 0 0 ${px(-0.55)}; border-radius:50%; background:var(--red); box-shadow:0 0 0 ${px(0.22)} #fff; }
  #it2 { ${P ? `justify-content:flex-end; padding-bottom:${px(26)}` : `flex-direction:column; justify-content:flex-end; align-items:flex-start; padding:0 0 ${px(7)} ${px(7)}`}; box-sizing:border-box; }
  ${P ? '' : `#it2 .vt { background:linear-gradient(90deg, rgba(5,13,34,.72), rgba(5,13,34,.35)); border-radius:${px(1.8)}; padding:${px(2)} ${px(3)}; }`}
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
  /* srovnání dnů + ryby ≠ body (styl Klonówiec) */
  #fpa2 { opacity:0; }
  .polar { position:absolute; ${P ? `left:50%; margin-left:${px(-38)}; top:${px(36)};` : `left:${px(16)}; top:${f(SAFE.t + 13 * u)};`} }
  .polar::before { content:''; position:absolute; inset:${px(-1)}; border-radius:50%; background:radial-gradient(circle, rgba(238,242,249,.96) 0 58%, rgba(238,242,249,0) 72%); }
  .polar svg { position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
  .polar .rg { fill:none; stroke:rgba(11,30,66,.12); stroke-width:${px(0.15)}; } .polar text { fill:#304285; font-family:Montserrat; font-weight:800; }
  .polar .pt1 { fill:#c9d3ee; stroke:#8ea2d8; stroke-width:${px(0.12)}; } .polar .pt2 { fill:#304285; } .polar .pt2:first-of-type { fill:var(--red); }
  .polar .pc { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); text-align:center; font-family:Montserrat; color:#0b1e42; }
  .polar .pc b { display:block; font-weight:900; font-size:${px(P ? 7 : 5.4)}; line-height:1; color:var(--red); } .polar .pc span { display:block; font-weight:800; font-size:${px(P ? 2.2 : 1.7)}; letter-spacing:.12em; text-transform:uppercase; }
  .polar .pc i { display:block; font-style:normal; font-weight:600; font-size:${px(P ? 2 : 1.5)}; opacity:.7; margin-top:${px(0.4)}; }
  .cmpt { position:absolute; ${P ? `left:${f(SAFE.l)}; right:${f(SAFE.r)}; top:${px(122)}; display:grid; grid-template-columns:1fr 1fr 1fr; gap:${px(1.6)};` : `right:${px(8)}; width:${px(50)}; top:${f(SAFE.t + 18 * u)}; display:flex; flex-direction:column; gap:${px(1.8)};`} }
  .ct { background:rgba(238,242,249,.96); border-radius:${px(1.6)}; padding:${px(1.8)} ${px(2.2)}; color:#0b1e42; font-family:Montserrat; box-shadow:0 ${px(0.8)} ${px(3)} rgba(0,0,0,.3); position:relative; opacity:0; }
  .ct b { display:block; font-weight:900; font-size:${px(P ? 5.4 : 5.4)}; line-height:1; } .ct span { display:block; font-weight:700; font-size:${px(P ? 1.8 : 1.8)}; letter-spacing:.06em; text-transform:uppercase; color:#304285; margin-top:${px(0.5)}; }
  .ct.red b { color:var(--red); } .ct i { position:absolute; right:${px(1.4)}; top:${px(1.4)}; width:${px(2)}; height:${px(2)}; border-radius:${px(0.4)}; } .ct .sw1 { background:#c9d3ee; border:${px(0.15)} solid #8ea2d8; } .ct .sw2 { background:#304285; }
  .kbump { position:absolute; left:${P ? px(5) : f(SAFE.l + 1.6 * u)}; top:${P ? px(38) : f(SAFE.t + 15 * u)}; opacity:0; }
  .kbump::before { content:''; position:absolute; inset:${px(-1.6)}; background:rgba(238,242,249,.96); border-radius:${px(2.2)}; box-shadow:0 ${px(1)} ${px(4)} rgba(0,0,0,.35); }
  .kbump svg { position:absolute; inset:0; width:100%; height:100%; overflow:visible; } .kbump .rbn { fill:none; stroke-linecap:round; stroke-dasharray:1; stroke-dashoffset:1; }
  .bhd { position:absolute; top:${px(1)}; font:700 ${px(P ? 2 : 1.6)} Montserrat; letter-spacing:.14em; text-transform:uppercase; color:#8ea2d8; text-align:center; }
  .kbump .bl { position:absolute; left:0; transform:translateY(-50%); display:flex; justify-content:space-between; align-items:center; gap:${px(1)}; font-family:Montserrat; color:#0b1e42; padding:0 ${px(1)}; box-sizing:border-box; }
  .kbump .bl .bn { font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; } .kbump .bl b { font-weight:900; background:#dfe5f1; border-radius:${px(1)}; padding:${px(0.2)} ${px(0.9)}; }
  .kbump .br { position:absolute; transform:translateY(-50%); display:flex; align-items:center; gap:${px(1)}; font-family:Montserrat; color:#0b1e42; transform-origin:left center; }
  .kbump .br b { font-weight:900; color:#fff; background:#304285; border-radius:${px(1)}; padding:${px(0.2)} ${px(0.9)}; min-width:${px(P ? 4.6 : 3.6)}; text-align:center; } .kbump .br span { font-weight:700; opacity:.75; }
  .snote { position:absolute; left:${f(SAFE.l)}; right:${f(SAFE.r)}; top:${P ? px(110) : px(84)}; font:600 ${px(P ? 3 : 2.5)} Montserrat; text-shadow:0 ${px(0.3)} ${px(1.4)} rgba(0,0,0,.8); opacity:0; }
  .snote b { font-weight:900; color:#fff; background:var(--red); padding:0 ${px(0.8)}; border-radius:${px(0.5)}; text-shadow:none; }

  /* sektory (styl Klonówiec) */
  .heat { position:absolute; left:${f(SAFE.l)}; right:${f(SAFE.r)}; top:${P ? px(37) : f(SAFE.t + 13 * u)}; display:grid; grid-template-columns:repeat(${P ? 4 : 10}, 1fr); gap:${px(P ? 1.4 : 1)}; }
  .bank { grid-column:1 / -1; font:800 ${px(1.5)} Montserrat; letter-spacing:.16em; text-transform:uppercase; color:var(--gold); opacity:0; } .bank.b2 { margin-top:${px(0.2)}; }
  .hcell { border-radius:${px(1)}; padding:${px(P ? 1.3 : 1)} ${px(0.8)} ${px(0.8)}; text-align:center; box-shadow:0 ${px(0.4)} ${px(1.4)} rgba(0,0,0,.3); font-family:Montserrat; opacity:0; }
  .hcell em { display:block; font-style:normal; font-weight:700; font-size:${px(P ? 2.2 : 1.6)}; opacity:.8; } .hcell em s { text-decoration:none; font-weight:800; font-size:.85em; opacity:.85; }
  .hcell b { display:block; font-weight:900; font-size:${px(P ? 4.8 : 3.4)}; line-height:1.05; }
  .pp { display:grid; grid-template-columns:1fr 1fr; gap:${px(0.4)}; margin-top:${px(0.6)}; }
  .pp span { border-radius:${px(0.5)}; font-weight:700; font-size:${px(P ? 1.8 : 1.3)}; padding:${px(0.3)} 0; box-shadow:inset 0 0 0 ${px(0.15)} rgba(238,242,249,.35); } .pp span i { display:block; font-style:normal; font-weight:900; font-size:1.3em; }
  .pstrip { position:absolute; left:${f(SAFE.l)}; right:${f(SAFE.r)}; top:${P ? px(131) : px(59)}; height:${px(P ? 9 : 8)}; display:flex; align-items:flex-end; gap:${px(0.35)}; }
  .pstrip i { flex:1; border-radius:${px(0.3)} ${px(0.3)} 0 0; transform-origin:bottom; }
  .pstrip em { position:absolute; right:0; top:${px(-3)}; font:600 ${px(P ? 2 : 1.6)} Montserrat; font-style:normal; letter-spacing:.1em; text-transform:uppercase; opacity:0; }
  .hnote { position:absolute; left:${f(SAFE.l)}; right:${f(SAFE.r)}; top:${P ? px(143) : px(69)}; font:600 ${px(P ? 2.7 : 2.3)} Montserrat; text-shadow:0 ${px(0.3)} ${px(1.4)} rgba(0,0,0,.8); opacity:0; }
  .hnote b { font-weight:900; color:#fff; background:var(--red); padding:0 ${px(0.8)}; border-radius:${px(0.5)}; text-shadow:none; }
  #s-d1s .tiles2, #s-d2s .tiles2 { position:absolute; left:${f(SAFE.l)}; right:${f(SAFE.r)}; top:${P ? px(155) : px(76)}; grid-template-columns:repeat(4, 1fr); }

  /* výsledky dne: matice 12 kol (styl Klonówiec) */
  .allw { position:absolute; left:${f(SAFE.l - 1 * u)}; right:${f(SAFE.r - 1 * u)}; top:${P ? px(36) : f(SAFE.t + 16 * u)}; bottom:${P ? px(6) : f(SAFE.b - 1 * u)}; overflow:hidden; background:rgba(238,242,249,.96); color:#0b1e42; border-radius:${px(1.6)}; padding:${px(0.8)} ${px(1.6)}; box-shadow:0 ${px(1)} ${px(4)} rgba(0,0,0,.35); opacity:0; ${P ? '-webkit-mask-image:linear-gradient(180deg, #000 88%, transparent 100%);' : ''} }
  .allc { display:grid; grid-template-columns:${P ? '1fr' : '1fr 1fr'}; gap:0 ${px(3)}; }
  .ar { display:grid; grid-template-columns:${px(P ? 4.4 : 3)} ${px(P ? 24 : 17)} 1fr ${px(P ? 5 : 3.6)} ${px(P ? 5 : 3.6)}; align-items:center; gap:${px(1)}; height:${px(P ? 4.15 : 3.4)}; border-bottom:${px(0.1)} solid rgba(11,30,66,.07); font-family:Montserrat; }
  .ar.arh { height:${px(P ? 3 : 2.4)}; } .ar.arh * { font-weight:800 !important; font-size:${px(P ? 1.4 : 1.1)} !important; letter-spacing:.1em; text-transform:uppercase; color:#8ea2d8 !important; } .ar.arh .qs i { text-align:center; font-style:normal; }
  .ap { font-weight:900; font-size:${px(P ? 2.3 : 1.8)}; color:#304285; text-align:right; } .an { font-weight:700; font-size:${px(P ? 2.2 : 1.8)}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .qs { display:grid; grid-template-columns:repeat(12, 1fr); gap:${px(0.35)}; }
  .q { display:flex; align-items:center; justify-content:center; aspect-ratio:1; max-height:${px(P ? 3.5 : 2.6)}; border-radius:${px(0.5)}; font-style:normal; font-weight:800; font-size:${px(P ? 1.7 : 1.3)}; color:#06142e; }
  .q.hot { box-shadow:inset 0 0 0 ${px(0.18)} rgba(255,255,255,.6); }
  .q.p3 { background:#304285; color:#eef2f9; } .q.p2 { background:#8ea2d8; color:#0b1e42; } .q.p1 { background:#dfe5f1; color:#0b1e42; } .q.p0 { background:#e31e24; color:#fff; }
  .qleg { position:absolute; left:${f(SAFE.l)}; right:${f(SAFE.r)}; top:${P ? px(31.5) : f(SAFE.t + 12.4 * u)}; display:flex; gap:${px(P ? 2 : 3)}; font:600 ${px(P ? 1.9 : 1.6)} Montserrat; letter-spacing:.06em; text-transform:uppercase; opacity:0; }
  .qleg span { display:flex; align-items:center; gap:${px(0.8)}; } .qleg .q { width:${px(P ? 2.4 : 1.9)}; height:${px(P ? 2.4 : 1.9)}; }
  .af { font-weight:800; font-size:${px(P ? 2.2 : 1.8)}; text-align:right; color:#304285; } .ar b { font-weight:900; font-size:${px(P ? 2.6 : 2)}; text-align:right; }
  .allcol .ar:nth-child(-n+4) .ap { color:var(--red); }

  /* celé pořadí – bílý panel jako v Klonówiec */
  .lg { isolation:isolate; } .lg::before { content:''; position:absolute; left:${px(-1.6)}; right:${px(-1.6)}; top:${px(-4.2)}; bottom:${px(-1.4)}; background:rgba(238,242,249,.96); border-radius:${px(1.8)}; box-shadow:0 ${px(1)} ${px(4)} rgba(0,0,0,.35); z-index:-1; }
  .lgh { z-index:2; }
  .lg, .lgh { position:absolute; left:${f(SAFE.l)}; right:${f(SAFE.r)}; display:grid; grid-auto-flow:column; gap:${px(0.7)} ${px(P ? 1.6 : 2)}; font-family:Montserrat; }
  .lgh { grid-auto-flow:row; opacity:0; }
  .lr { position:relative; display:grid; grid-template-columns:${px(4.4)} 1fr ${px(P ? 6 : 6.5)} ${px(P ? 5 : 5.5)}; align-items:center; gap:${px(0.8)}; padding:0 ${px(1)}; border-radius:${px(0.8)}; background:none; color:#0b1e42; border-bottom:${px(0.1)} solid rgba(11,30,66,.08); overflow:hidden; opacity:0; }
  .lr > * { position:relative; } .lr .lb { display:none; }
  .lr b { font-weight:900; font-size:${px(P ? 2.1 : 2.2)}; color:#304285; text-align:right; } .lr span { font-weight:700; font-size:${px(P ? 1.85 : 2.1)}; letter-spacing:-.01em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .lr em { font-style:normal; font-weight:700; font-size:${px(P ? 1.8 : 1.9)}; text-align:right; color:#304285; } .lr u { text-decoration:none; font-weight:900; font-size:${px(P ? 2.2 : 2.4)}; text-align:right; }
  .lr.t { background:rgba(48,66,133,.08); } .lr.t span { font-weight:800; }
  .lr.g b { color:var(--red); } .lr.g { background:rgba(227,30,36,.08); }
  #s-mcr .lr { grid-template-columns:${px(P ? 3.6 : 4)} 1fr ${px(P ? 3.6 : 4.2)} ${px(P ? 3.6 : 4.2)} ${px(P ? 3.6 : 4.2)} ${px(P ? 3.8 : 4.4)}; gap:${px(P ? 0.5 : 0.7)}; } #s-mcr .lr u { color:var(--red); } #s-mcr .lr em.fz { color:#8ea2d8; font-weight:800; }
  .lrh { opacity:1; background:none; height:${px(2.6)}; border:0; } .lrh b, .lrh span, .lrh em, .lrh u { font-weight:800 !important; font-size:${px(1.3)} !important; letter-spacing:.1em; text-transform:uppercase; color:#8ea2d8 !important; }
  .fb { display:flex; height:58%; background:rgba(142,162,216,.12); border-radius:${px(0.4)}; overflow:hidden; } .fb s { display:block; height:100%; background:var(--gold); transform-origin:left; } .fb s.n { background:#7fd0ff; }
  .fleg { position:absolute; ${P ? `left:${f(SAFE.l)}; top:${px(168.5)}` : `right:${f(SAFE.r)}; top:${f(SAFE.t + 8 * u)}`}; display:flex; gap:${px(2)}; font:800 ${px(1.8)} Montserrat; text-transform:uppercase; letter-spacing:.1em; opacity:0; }
  .fleg span { display:flex; align-items:center; gap:${px(0.7)}; } .fleg i { width:${px(2.4)}; height:${px(1.4)}; border-radius:${px(0.3)}; background:var(--gold); } .fleg i.n { background:#7fd0ff; }

  /* sezóna v bílém panelu (Klonówiec) */
  .sm { isolation:isolate; color:#0b1e42; } .sm::before { content:''; position:absolute; left:${px(-1.6)}; right:${px(-1.6)}; top:${px(-1.4)}; bottom:${px(-1.6)}; background:rgba(238,242,249,.96); border-radius:${px(1.8)}; box-shadow:0 ${px(1)} ${px(4)} rgba(0,0,0,.35); z-index:-1; }
  .sm .smh { color:#304285; } .sm .smh .sc.h em { color:#8ea2d8; } .sm .smr .sc i { background:#dfe5f1; color:#0b1e42; } .sm .smr .sc.ab i { background:#f1f4fa; color:#8ea2d8; }
  .sm .smr .sa b { color:#304285; } .sm .smr .sp b { color:var(--red); } .sm .smb { margin-bottom:${px(0.4)}; }
  /* finále */
  .fin { position:absolute; left:${f(SAFE.l)}; right:${f(SAFE.r)}; top:${P ? '30%' : '22%'}; display:flex; flex-direction:column; align-items:center; gap:${px(3)}; text-align:center; font-family:Montserrat; }
  .fv b { display:block; font-weight:900; font-size:${px(P ? 20 : 15)}; color:var(--red); line-height:1; text-shadow:0 ${px(0.5)} ${px(3)} rgba(0,0,0,.5); } .fv span { font-weight:800; font-size:${px(P ? 3.4 : 2.6)}; letter-spacing:.1em; text-transform:uppercase; }
  .fsp { display:flex; gap:${px(3)}; font-weight:700; font-size:${px(P ? 3 : 2.3)}; } .fsp b { font-weight:900; color:#fff; font-size:1.3em; }
  .fz span { display:inline-block; font-weight:700; font-size:${px(P ? 3.2 : 2.4)}; letter-spacing:.16em; text-transform:uppercase; color:var(--gold); }
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
  <div id="stage"><div id="st-bg"></div><div id="rays-w"><div id="st-rays"></div></div><div id="st-band">${BAND}</div><div id="st-dots"></div>${STARS.map((st, i) => `<i class="star" id="star${i}" style="left:${st.x.toFixed(1)}%; top:${st.y.toFixed(1)}%; width:${px(st.s * 1.6)}; height:${px(st.s * 1.6)}"></i>`).join('')}<div id="vig"></div></div>
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
