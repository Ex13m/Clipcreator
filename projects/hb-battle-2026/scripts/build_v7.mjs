// HB2026 v5 — чистый современный моушн: без рамок, вырезанные люди прямо на фоне, крупная типографика за людьми (глубина),
// анимированная инфографика по данным банеров TA CZ (состав, сектора, жеребьёвка, 15 поединков, 13 стран).
// Фото -> графика: фон дуотон+растр (растворён в navy), фигура постер-заливкой без обводки. Логотипы — оригиналы.
// python3 scripts/edit_track.py && python3 scripts/make_gfx.py [--clean] && node scripts/build_v5.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROTO = path.join(ROOT, 'proto');
const FONTS = fs.readFileSync(path.join(PROTO, 'assets/fonts.css'), 'utf8');
const G0 = JSON.parse(fs.readFileSync(path.join(ROOT, '03_MUSIC/Trout_Area.beats.json'), 'utf8'));
// полный трек Suno 1:33 без монтажа
const G = { beats: G0.beats, downbeats: G0.downbeats, duration: G0.duration, beat: +(G0.beats.slice(1).map((t, i) => t - G0.beats[i]).sort((a, b) => a - b)[Math.floor(G0.beats.length / 2)]).toFixed(4) };
const IMG = JSON.parse(fs.readFileSync(path.join(PROTO, 'assets/photos.json'), 'utf8'));
const NO_CUT = new Set(['p_podium', 'p_trenink_gear', 'p_landing2', 'p_fishpen', 'p_seq1', 'p_seq2', 'p_seq3', 'p_seq4', 'p_plaque']);
const GROUP = new Set(['p_team_romania', 'p_team_romania_hi', 'p_lunch', 'p_cheers', 'p_selfie_lake', 'p_car', 'p_laugh']);

const T0 = 1.2, SONG = G.duration, DUR = +(T0 + SONG + 0.6).toFixed(2);
const at = (x) => +(x + T0).toFixed(3);
const s = (bar, k = 0) => { const i = G.beats.findIndex((t) => Math.abs(t - G.downbeats[bar - 1]) < 0.06); return G.beats[i + k]; };
const len = (a, b) => +(b - a).toFixed(3);
const BEAT = G.beat;

// ---------- данные (банеры TA CZ: HBCUP2026_Los_Vsechny_tymy, HBCUP2026_Kola_CZ_vse, Fandime, Stoklasa) ----------
const TEAM = [
  { no: 7, name: 'Petr Hrabalík', sek: 1, range: '1–16' },
  { no: 23, name: 'Dominik Švub', sek: 2, range: '17–32' },
  { no: 39, name: 'Míra Kučera', sek: 3, range: '33–48' },
  { no: 55, name: 'Martin Stoklasa', sek: 4, range: '49–64' },
];
const OPP = [
  [[10, 'Martin Drgoň', 'SK'], [8, 'Alex Benkendorf', 'DE'], [6, 'Ignatas Krastinas', 'GB'], [4, 'Johnny Dubois', 'BE'], [2, 'Pavlo Melanich', 'UA'], [15, 'Viorel Preda', 'RO'], [13, 'Andrzej Olejnik', 'PL'], [11, 'Milan Popovič', 'SK'], [9, 'Rinalds Tischenko', 'GB'], [1, 'Jonas Čivinskas', 'LT'], [5, 'Petko Ivanov', 'BG'], [3, 'Anton Kishinets', 'DK'], [16, 'Gellert Pankotay', 'HU'], [14, 'Gustas Juozelskis', 'LT'], [12, 'Aleksandr Potrakov', 'MD']],
  [[26, 'David Drančák', 'SK'], [24, 'Frank Hens', 'DE'], [22, 'Donatas Krastinas', 'GB'], [20, 'Lucas Leonard', 'BE'], [18, 'Oleksandr Mokhnatko', 'UA'], [31, 'Ianis Colonescu', 'RO'], [29, 'Filip Lukasz', 'PL'], [27, 'Michal Slávik', 'SK'], [25, 'Ruslan Navickij', 'GB'], [17, 'Žilvinas Žalėnas', 'LT'], [21, 'Ivan Radev', 'BG'], [19, 'Oleksandr Shvets', 'DK'], [32, 'Aniko Pankotayne', 'HU'], [30, 'Julius Puidokas', 'LT'], [28, 'Ionas Sergiu', 'MD']],
  [[42, 'Juraj Kozár', 'SK'], [40, 'Alexander Choroschailow', 'DE'], [38, 'Jurgita Krastiniene', 'GB'], [36, 'Stephane Braham', 'BE'], [34, 'Oleg Dorodniev', 'UA'], [47, 'Sorin Dobre', 'RO'], [45, 'Pawel Zakrzewski', 'PL'], [43, 'Samuel Nagy', 'SK'], [41, 'Mareks Selavins', 'GB'], [33, 'Benas Žalėnas', 'LT'], [37, 'Gani Mitev', 'BG'], [35, 'Oleksand Kundelskyi', 'DK'], [48, 'Imre Enessey', 'HU'], [46, 'Leonardo Tofano', 'LT'], [44, 'Oleh Chaus', 'MD']],
  [[58, 'Ján Potoček', 'SK'], [56, 'Yannick Bruyninckx', 'DE'], [54, 'Viktors Sidorovs', 'GB'], [52, 'Leonard Cedric', 'BE'], [50, 'Dmytro Korinchevskyi', 'UA'], [63, 'Valentin Rossi', 'RO'], [61, 'David Helman', 'PL'], [59, 'Marián Michalka', 'SK'], [57, 'Aleksandrs Zencaks', 'GB'], [49, 'Mindaugas Narkus', 'LT'], [53, 'Angov Martin', 'BG'], [51, 'Maryan Podan', 'DK'], [64, 'Daniel Szabó', 'HU'], [62, 'Tomas Gulbis', 'LT'], [60, 'Anton Akshyakov', 'MD']],
];
const COUNTRIES = ['LT', 'UA', 'DK', 'BE', 'BG', 'GB', 'CZ', 'DE', 'SK', 'MD', 'PL', 'RO', 'HU'];

// ---------- сцены и шоты ----------
// результаты (банеры HBCUP2026_Team_CZ_2dny, HBCUP2026_Vysledky_tymy_final)
const RES = [
  { name: 'Petr Hrabalík', no: 7, d1: 22, d2: 16, pts: 38, vrp: '9 · 7 · 14', fish: 67, duels: ['WWWFLLDLLLFLWWF', 'WLLLDDLLLLWFLWW'] },
  { name: 'Dominik Švub', no: 23, d1: 22, d2: 27, pts: 49, vrp: '12 · 10 · 8', fish: 69, duels: ['WWLDDWWDLWLLFFL', 'WFDLDDWLWWWWLDW'] },
  { name: 'Miroslav Kučera', no: 39, d1: 33, d2: 15, pts: 48, vrp: '14 · 5 · 11', fish: 56, duels: ['LFWWLWWWLWWWWWD', 'LLDWLLLDLLLWWWD'] },
  { name: 'Martin Stoklasa', no: 55, d1: 21, d2: 10, pts: 31, vrp: '5 · 10 · 15', fish: 52, duels: ['WFWLWFLLLDLWLFF', 'LDLLDFLDLLLFLLW'] },
];
// улов по командам (конечная таблица), по убыванию
const FISH = [['LT', 322, 'Juozelskis'], ['BG', 318, 'Ivanov'], ['UA', 289, 'Melanich'], ['CZ', 243, 'Hrabalík'], ['RO', 231, 'Preda'], ['SK', 215, 'Popovič'], ['DE', 211, 'Benkendorf'],
  ['GB', 206, 'Gadisauskas'], ['HU', 204, 'Pankotay'], ['SK', 198, 'Drgoň'], ['LT', 198, 'Čivinskas'], ['BE', 193, 'Dubois'], ['PL', 185, 'Olejnik'], ['DK', 182, 'Kishinets'], ['MD', 182, 'Potrakov'], ['GB', 175, 'I. Krastinas']];

const SCENES = [
  [s(5), s(9), 'prijezd', 'Příjezd', 'Arrival'],
  [s(9), s(11), 'tym', 'Tým', 'Team'],
  [s(11), s(13), 'zmena', 'Změna v sestavě', 'Line-up change'],
  [s(13), s(16), 'losovani', 'Losování', 'The draw'],
  [s(18), s(26), 'zavod', 'Trénink a závod', 'Practice & race'],
  [s(26), s(35), 'vysledky', 'Výsledky', 'Results'],
  [s(35), s(43), 'pratele', 'Přátelé', 'Friends'],
  [s(43), s(47), 'recap', 'Takhle to bylo', 'That was it'],
];
const PH = (n, a, b, img, o = {}) => ({ n, a, b, d: len(a, b), img, ...o });
const SHOTS = [
  PH(1, s(5), s(6), 'p_car', { word: 'Cesta', sub: 'Na Slovensko' }),
  PH(2, s(6), s(7), 'p_lake_mist', { word: 'Pružina', sub: 'Hofer Lake' }),
  PH(3, s(7), s(8), 'p_fishpen', { word: '300 kg', sub: 'Zarybnění · pstruzi čekají' }),
  PH(4, s(8), s(9), 'p_selfie_lake', { word: 'Ráno' }),
  PH(5, s(12), s(13), 'p_green_fish', { word: '#55', plate: ['Martin Stoklasa', 'nastupuje · sektor 4'] }),
  PH(6, s(18), s(19), 'p_tying_young', { word: 'Uzly' }),
  PH(7, s(19), s(20), 'p_phone', { word: 'Plán', sub: '12 kol tréninku' }),
  PH(8, s(20), s(21), 'p_tying_ms', { word: 'Klid' }),
  PH(9, s(21), s(22), 'p_reeling', { word: 'Záběr' }),
  // stop-motion: podebírání po dobách
  PH(10, s(22, 0), s(22, 1), 'p_seq1', { flash: true, word: 'Pod' }),
  PH(11, s(22, 1), s(22, 2), 'p_seq2', { flash: true, word: 'bě' }),
  PH(12, s(22, 2), s(22, 3), 'p_seq3', { flash: true, word: 'rák' }),
  PH(13, s(22, 3), s(23), 'p_seq4', { flash: true, word: '!' }),
  PH(14, s(23), s(24), 'p_svub_water', { word: '#23', plate: ['Dominik Švub', 'Hofer Lake'] }),
  PH(15, s(24), s(25), 'p_net_close', { word: 'Pstruh' }),
  PH(16, s(25), s(26), 'p_kucera_lake', { word: 'Fokus' }),
  PH(17, s(34), s(35), 'p_podium', { word: 'Top 3', sub: '1. Litva · 2. Ukrajina · 3. Bulharsko' }),
  PH(18, s(36), s(37), 'p_team_romania_hi', { word: 'Přátelé', sub: 'Team Romania' }),
  PH(19, s(37), s(38), 'p_lunch', { word: 'Boj', caption: ['Takhle vypadá náš „boj“.', 'This is what our “battle” looks like.'] }),
  PH(20, s(38), s(39), 'p_laugh', { word: 'Smích' }),
  PH(21, s(39), s(43), 'p_lake_mist', { quote: true }),
  ...['p_car', 'p_lake_mist', 'p_fishpen', 'p_tying_young', 'p_phone', 'p_seq2', 'p_seq4', 'p_svub_water',
    'p_net_close', 'p_green_fish', 'p_portrait_dres', 'p_lunch', 'p_team_romania_hi', 'p_laugh', 'p_plaque', 'p_cheers']
    .map((img, k) => PH(22 + k, s(43, k), s(43, k + 1), img, { flash: true })),
  PH(38, s(47), s(47) + 0.001, 'p_cheers', { final: true }),
];

function build(W, H, file) {
  const P = H > W, u = Math.min(W, H) / 100;
  const px = (n) => `${Math.round(n * u)}px`;
  const f = (n) => n.toFixed(1) + 'px';
  // безопасные зоны: снизу плашка сцены + плеер
  const SAFE_B = P ? 34 * u : 16 * u;

  // --- виджет-проигрыватель ---
  const CW = (P ? 60 : 44) * u, CH = (P ? 17 : 11.5) * u, CM = (P ? 5 : 3.5) * u, CB = (P ? 10 : 3.5) * u;
  const VD = CH * 1.32, VL = 1.6 * u, VT = (CH - VD) / 2, HERO = P ? 1.45 : 1.75;
  const dockX = W / 2 - (W - CM - CW / 2), dockY = H / 2 - (H - CB - CH / 2);

  const hasFg = (img) => !NO_CUT.has(img) && fs.existsSync(path.join(PROTO, `assets/cut/${img}.png`));
  const wordSize = (w) => Math.min(P ? 30 * u : 26 * u, (W * 0.92) / (Math.max(3, w.length) * 0.72));
  // фото целиком (contain), поля — размытая копия; края кадра растворены
  const photoBox = (img) => {
    const [iw, ih] = IMG[img], ar = iw / ih;
    const mw = W, mh = H * (P ? 0.86 : 1);
    let w = mw, h = w / ar; if (h > mh) { h = mh; w = h * ar; }
    return { x: (W - w) / 2, y: (P ? H * 0.44 : H * 0.5) - h / 2, w, h };
  };

  // ===== фото-шот: целиком, люди вырезаны (родные цвета), слово между фото и людьми, толчки на каждую долю =====
  const shotHtml = (sh) => {
    const id = `sh${String(sh.n).padStart(2, '0')}`;
    const word = (sh.word || '').toUpperCase();
    const fg = hasFg(sh.img) && !sh.quote;
    const b = photoBox(sh.img), bx = `left:${f(b.x)}; top:${f(b.y)}; width:${f(b.w)}; height:${f(b.h)};`;
    // где слово: на свободном поле (узкое фото), поверх (групповые/без вырезки) или за людьми (глубина)
    const side = !P && b.w < W * 0.72, above = P && b.h < H * 0.62;
    const depth = fg && !side && !above && !GROUP.has(sh.img);
    let wstyle = `font-size:${f(wordSize(word))}`;
    if (side) { const ww = Math.max(b.x - 6 * u, 24 * u); wstyle = `left:${f(8 * u)}; right:auto; width:${f(ww)}; top:${f(H * 0.3)}; text-align:left; white-space:nowrap; font-size:${f(Math.min(13 * u, ww / (Math.max(3, word.length) * 0.86)))}`; }
    if (above) wstyle = `top:${f(Math.max(6 * u, b.y - 22 * u))}; font-size:${f(Math.min(18 * u, wordSize(word)))}`;
    const wordEl = word ? `<div class="bigword${depth ? '' : ' over'}" style="${wstyle}"><span>${word}</span></div>` : '';
    return `
      <section id="${id}" class="clip shot" data-start="${at(sh.a)}" data-duration="${sh.final ? len(at(sh.a), DUR) : sh.d}" data-track-index="2">
        <div class="blurfill" style="background-image:url(assets/photos/${sh.img}.jpg)"></div>
        <div class="cam"><div class="beat">
          <div class="pc" style="${bx} background-image:url(assets/photos/${sh.img}.jpg)"></div>
          ${depth ? wordEl : ''}
          ${fg ? `<div class="fgc" style="${bx} background-image:url(assets/cut/${sh.img}.png)"></div>` : ''}
          ${depth ? '' : wordEl}
        </div></div>
        ${sh.quote ? `<div class="qwrap"><div class="ql" id="q0"><span>Nepřijeli jsme bojovat.</span></div><div class="ql red" id="q1"><span>Přijeli jsme za přáteli.</span></div>
          <div class="ql small" id="q2"><span>16 týmů · 13 zemí · 64 závodníků</span></div><div class="ql big" id="q3"><span>Jedna parta.</span><i class="mk"></i></div></div>` : ''}
        ${sh.sub ? `<div class="sub"><span>${sh.sub}</span></div>` : ''}
        ${sh.plate ? `<div class="plate"><b>${sh.plate[0]}</b><i>${sh.plate[1]}</i><span class="mk"></span></div>` : ''}
        ${sh.caption ? `<div class="caption">${sh.caption[0]}<span>${sh.caption[1]}</span></div>` : ''}
      </section>`;
  };
  const shotTweens = SHOTS.map((sh) => {
    const id = `#sh${String(sh.n).padStart(2, '0')}`, out = [];
    const end = sh.final ? DUR - T0 : sh.b, d = end - sh.a;
    const T = (sel, from, to, pos) => out.push(`tl.fromTo("${id} ${sel}", ${JSON.stringify(from)}, ${JSON.stringify(to)}, ${(+pos).toFixed(3)});`);
    const inBeats = G.beats.filter((t) => t > sh.a + 0.05 && t < end - 0.05);
    // камера: медленный дрейф + удар на склейке
    if (sh.flash) T('.cam', { scale: 1.14 }, { scale: 1.0, duration: Math.min(0.35, d), ease: 'expo.out' }, at(sh.a));
    else T('.cam', { scale: 1.0, xPercent: sh.n % 2 ? -1 : 1 }, { scale: 1.07, xPercent: sh.n % 2 ? 1 : -1, duration: d, ease: 'none' }, at(sh.a));
    T('.blurfill', { scale: 1.25 }, { scale: 1.15, duration: d, ease: 'none' }, at(sh.a));
    // толчок на каждую долю (под бит), слабее на слабых долях
    inBeats.forEach((t) => {
      const strong = G.downbeats.some((db) => Math.abs(db - t) < 0.06);
      out.push(`tl.fromTo("${id} .beat", {scale:${strong ? 1.03 : 1.015}}, {scale:1, duration:0.32, ease:"power2.out", immediateRender:false}, ${at(t).toFixed(3)});`);
    });
    if (hasFg(sh.img) && !sh.quote) T('.fgc', { opacity: 0, yPercent: 2 }, { opacity: 1, yPercent: 0, duration: sh.flash ? 0.01 : 0.3, ease: 'power3.out' }, at(sh.a));
    if (sh.word) {
      const tw = inBeats[0] ?? sh.a;
      T('.bigword span', { yPercent: 105, skewY: 8 }, { yPercent: 0, skewY: 0, duration: 0.45, ease: 'expo.out' }, at(tw));
      T('.bigword', { x: 0 }, { x: 1.5 * u, duration: Math.max(0.3, end - tw), ease: 'none' }, at(tw));
    }
    if (sh.sub) T('.sub span', { yPercent: 110 }, { yPercent: 0, duration: 0.4, ease: 'power3.out' }, at(inBeats[1] ?? sh.a + BEAT));
    if (sh.plate) {
      T('.plate', { opacity: 0, x: -4 * u }, { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out' }, at(inBeats[0] ?? sh.a));
      T('.plate .mk', { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power2.inOut' }, at(inBeats[1] ?? sh.a + BEAT));
    }
    if (sh.caption) T('.caption', { opacity: 0, y: 3 * u }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, at(inBeats[0] ?? sh.a));
    if (sh.quote) {
      [0, 1, 2, 3].forEach((q) => T(`#q${q} span`, { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: 'expo.out' }, at(s(39 + q))));
      T('#q3 .mk', { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, at(s(42, 1)));
      T('.pc', { opacity: 1 }, { opacity: 0.35, duration: 1.2, ease: 'none' }, at(s(39)));
    }
    return out.join('\n      ');
  }).join('\n      ');

  // ===== инфографика =====
  // 1) счётчики в интро
  const COUNT = [[16, 'týmů', 'teams'], [64, 'závodníků', 'anglers'], [13, 'zemí', 'countries']];
  // 2) состав (такт 9)
  const roster = TEAM.map((m, i) => `
          <div class="rcard" id="rc${i}"><span class="rno">${m.no}</span><span class="rtx"><b>${m.name}</b><i>Sektor ${m.sek} · místa ${m.range}</i></span></div>`).join('');
  // 3) замена (такт 18)
  // 4) сектора (такт 20)
  const sectors = TEAM.map((m, i) => `
          <div class="sec" id="sec${i}"><div class="sec-h">Sektor ${m.sek}</div><div class="sec-r">${m.range}</div><div class="sec-no" id="secno${i}">${m.no}</div><div class="sec-n">${m.name.split(' ')[1]}</div></div>`).join('');
  // 5) поединки (такты 22–24)
  const ROWS_VIS = P ? 7 : 9;
  const duels = TEAM.map((m, i) => `
          <div class="dcol" id="dcol${i}">
            <div class="dh"><span class="dno">${m.no}</span><b>${m.name}</b></div>
            <div class="dwin"><div class="dlist" id="dlist${i}">${OPP[i].map(([no, nm, c], k) => `<div class="drow"><span class="dk">${k + 1}</span><span class="dn">${no}</span><span class="dname">${nm}</span><span class="dc">${c}</span></div>`).join('')}</div></div>
          </div>`).join('');
  // 6) страны (такт 26)
  const chips = COUNTRIES.map((c, i) => `<span class="chip-c${c === 'CZ' ? ' cz' : ''}" id="cc${i}">${c}</span>`).join('');

  // --- результаты ---
  const MAXP = 50;
  const angler = `<svg viewBox="0 0 48 48" class="ico"><circle cx="20" cy="12" r="6" fill="currentColor"/><path d="M10 44 L13 26 Q20 20 27 26 L30 44 Z" fill="currentColor"/><path d="M27 27 L35 22" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M34 23 Q42 10 46 4" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M46 4 L46 30" stroke="currentColor" stroke-width=".8" stroke-dasharray="2 2"/></svg>`;
  const ptsRows = RES.map((r, i) => `
          <div class="prow" id="prow${i}">
            <div class="pava">${angler}<span>${r.no}</span></div>
            <div class="pmain"><div class="pname">${r.name}<i>V · R · P ${r.vrp} · ${r.fish} ryb</i></div>
              <div class="pbar"><div class="pb1" id="pb1_${i}" style="width:${(r.d1 / MAXP * 100).toFixed(1)}%"></div><div class="pb2" id="pb2_${i}" style="left:${(r.d1 / MAXP * 100).toFixed(1)}%; width:${(r.d2 / MAXP * 100).toFixed(1)}%"></div></div></div>
            <div class="pval"><b id="pv${i}">0</b><i>b.</i></div>
          </div>`).join('');
  const heat = RES.map((r, i) => `
          <div class="hrow"><div class="hname"><span class="hno">${r.no}</span>${r.name.split(' ')[1]}</div>
            <div class="hgrid">${r.duels.map((d, dd) => `<div class="hline"><em>${dd + 1}. den</em>${[...d].map((c, k) => `<i class="hc h${c}" id="hc${i}_${dd}_${k}"></i>`).join('')}</div>`).join('')}</div></div>`).join('');
  const FMAX = 330;
  const fishRows = FISH.map(([c, v, cap], i) => `
          <div class="frow${c === 'CZ' ? ' cz' : ''}" id="fr${i}"><span class="fpos">${i + 1}</span><span class="fc">${c}</span>
            <div class="fbar"><div class="ffill" id="ff${i}" style="width:${(v / FMAX * 100).toFixed(1)}%"></div></div><b class="fv" id="fv${i}">0</b></div>`).join('');

  const resTweens = [
    // очки по участникам: бары растут (1. den, затем 2. den), счётчик
    `tl.fromTo("#pts-h span", { yPercent: 110 }, { yPercent: 0, duration: 0.4, ease: "expo.out" }, ${at(s(26))});`,
    ...RES.map((r, i) => `tl.fromTo("#prow${i}", { opacity: 0, rotationX: -75, y: ${Math.round(2 * u)}, transformPerspective: ${Math.round(120 * u)} }, { opacity: 1, rotationX: 0, y: 0, transformPerspective: ${Math.round(120 * u)}, duration: 0.5, ease: "back.out(1.4)" }, ${at(s(26, i))});`),
    ...RES.map((r, i) => `tl.fromTo("#pb1_${i}", { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power3.out" }, ${at(s(26, i) + 0.15)});`),
    ...RES.map((r, i) => `tl.fromTo("#pb2_${i}", { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power3.out" }, ${at(s(27, i))});`),
    ...RES.map((r, i) => `{ const o = { v: 0 }, el = document.getElementById("pv${i}"); tl.fromTo(o, { v: 0 }, { v: ${r.pts}, duration: ${len(s(26, i), s(27, i) + 0.6)}, ease: "power1.inOut", onUpdate() { el.textContent = Math.round(o.v); } }, ${at(s(26, i) + 0.15)}); }`),
    `tl.fromTo("#pts-total", { opacity: 0, y: ${Math.round(3 * u)} }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, ${at(s(28))});`,
    // тепловая карта поединков: клетки вспыхивают волной
    `tl.fromTo("#heat-h span", { yPercent: 110 }, { yPercent: 0, duration: 0.4, ease: "expo.out" }, ${at(s(29))});`,
    ...RES.flatMap((r, i) => r.duels.map((d, dd) => `tl.fromTo("#heat .hrow:nth-child(${i + 1}) .hline:nth-child(${dd + 1}) .hc", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.18, ease: "back.out(3)", stagger: 0.035 }, ${at(s(29) + 0.15 + i * 0.4 + dd * 0.2)});`)),
    `tl.fromTo("#heat-legend", { opacity: 0 }, { opacity: 1, duration: 0.4 }, ${at(s(30))});`,
    // улов: бар-чарт 16 команд
    `tl.fromTo("#fish-h span", { yPercent: 110 }, { yPercent: 0, duration: 0.4, ease: "expo.out" }, ${at(s(31))});`,
    ...FISH.map((f, i) => `tl.fromTo("#fr${i}", { opacity: 0, x: ${Math.round(-3 * u)} }, { opacity: 1, x: 0, duration: 0.35, ease: "power3.out" }, ${at(s(31) + 0.15 + i * 0.1)});`),
    ...FISH.map((f, i) => `tl.fromTo("#ff${i}", { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: "power3.out" }, ${at(s(31) + 0.2 + i * 0.1)});`),
    ...FISH.map(([, v], i) => `{ const o = { v: 0 }, el = document.getElementById("fv${i}"); tl.fromTo(o, { v: 0 }, { v: ${v}, duration: 1.3, ease: "power3.out", onUpdate() { el.textContent = Math.round(o.v); } }, ${at(s(31) + 0.2 + i * 0.1)}); }`),
    `tl.fromTo("#fish .cz", { scale: 1 }, { scale: 1.04, duration: 0.25, ease: "power2.out", yoyo: true, repeat: 1 }, ${at(s(32))});`,
    `tl.fromTo("#fish-note", { opacity: 0, y: ${Math.round(2 * u)} }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, ${at(s(32, 1))});`,
    // итоговое место
    `tl.fromTo("#rank-n", { scale: 2.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "expo.out" }, ${at(s(33))});`,
    `{ const o = { v: 16 }, el = document.getElementById("rank-v"); tl.fromTo(o, { v: 16 }, { v: 9, duration: 0.7, ease: "power2.out", onUpdate() { el.textContent = Math.round(o.v); } }, ${at(s(33))}); }`,
    `tl.fromTo("#rank-t", { opacity: 0, x: ${Math.round(-4 * u)} }, { opacity: 1, x: 0, duration: 0.4, ease: "power3.out" }, ${at(s(33, 1))});`,
    `tl.fromTo("#rank-s", { opacity: 0 }, { opacity: 1, duration: 0.4 }, ${at(s(33, 2))});`,
  ].join('\n      ');

  const infoTweens = [
    // счётчики
    ...COUNT.map(([n], i) => `{ const o = { v: 0 }, el = document.getElementById("cnt${i}"); tl.fromTo(o, { v: 0 }, { v: ${n}, duration: 0.8, ease: "power2.out", onUpdate() { el.textContent = Math.round(o.v); } }, ${at(s(3, i))}); }`),
    ...COUNT.map((_, i) => `tl.fromTo("#cntb${i}", { opacity: 0, y: ${Math.round(3 * u)} }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, ${at(s(3, i))});`),
    // состав
    `tl.fromTo("#roster-h span", { yPercent: 110 }, { yPercent: 0, duration: 0.4, ease: "expo.out" }, ${at(s(9))});`,
    ...TEAM.map((_, i) => `tl.fromTo("#rc${i}", { opacity: 0, x: ${Math.round(-6 * u)} }, { opacity: 1, x: 0, duration: 0.3, ease: "power3.out" }, ${at(s(9, i))});`),
    `tl.fromTo("#roster-coach", { opacity: 0 }, { opacity: 1, duration: 0.3 }, ${at(s(9, 3) + 0.2)});`,
    `tl.fromTo("#roster .rgrid", { scale: 1 }, { scale: 1.03, duration: ${len(s(9), s(11))}, ease: "none" }, ${at(s(9))});`,
    // замена
    `tl.fromTo("#swap-h span", { yPercent: 110 }, { yPercent: 0, duration: 0.4, ease: "expo.out" }, ${at(s(11))});`,
    `tl.fromTo("#swap-out", { opacity: 0, x: ${Math.round(-5 * u)} }, { opacity: 1, x: 0, duration: 0.3, ease: "power3.out" }, ${at(s(11))});`,
    `tl.fromTo("#swap-out .strike", { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: "power2.inOut" }, ${at(s(11, 1))});`,
    `tl.fromTo("#swap-out", { opacity: 1 }, { opacity: 0.45, duration: 0.3, immediateRender: false }, ${at(s(11, 1))});`,
    `tl.fromTo("#swap-in", { opacity: 0, x: ${Math.round(6 * u)} }, { opacity: 1, x: 0, duration: 0.35, ease: "back.out(1.6)" }, ${at(s(11, 2))});`,
    `tl.fromTo("#swap-note", { opacity: 0 }, { opacity: 1, duration: 0.4 }, ${at(s(11, 3))});`,
    // сектора
    `tl.fromTo("#sectors-h span", { yPercent: 110 }, { yPercent: 0, duration: 0.4, ease: "expo.out" }, ${at(s(13))});`,
    `tl.fromTo("#lake", { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power3.inOut" }, ${at(s(13))});`,
    ...TEAM.map((_, i) => `tl.fromTo("#sec${i}", { opacity: 0, y: ${Math.round(4 * u)} }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, ${at(s(13, i) + 0.05)});`),
    ...TEAM.map((_, i) => `tl.fromTo("#secno${i}", { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(2.4)" }, ${at(s(13, i) + 0.2)});`),
    // поединки: шапка, колонки, прокрутка списков
    `tl.fromTo("#duels-h span", { yPercent: 110 }, { yPercent: 0, duration: 0.4, ease: "expo.out" }, ${at(s(14))});`,
    ...TEAM.map((_, i) => `tl.fromTo("#dcol${i}", { opacity: 0, y: ${Math.round(5 * u)} }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, ${at(s(14, i % 4) + 0.05)});`),
    ...TEAM.map((_, i) => `tl.fromTo("#dlist${i}", { yPercent: 0 }, { yPercent: ${(-(15 - ROWS_VIS) / 15 * 100).toFixed(1)}, duration: ${len(s(14, 2), s(16) - 0.1)}, ease: "sine.inOut" }, ${at(s(14, 2))});`),
    // страны
    `tl.fromTo("#world-h span", { yPercent: 110 }, { yPercent: 0, duration: 0.4, ease: "expo.out" }, ${at(s(35))});`,
    ...COUNTRIES.map((_, i) => `tl.fromTo("#cc${i}", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(2.5)" }, ${at(s(35) + i * BEAT * 0.5)});`),
    `tl.fromTo("#world-sub", { opacity: 0 }, { opacity: 1, duration: 0.4 }, ${at(s(35, 3) + 0.4)});`,
    resTweens,
    // подсветка важного: красное свечение + пульс на доли
    `tl.fromTo("#g-pts", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }, ${at(s(28))});`,
    `tl.fromTo("#g-pts", { opacity: 1 }, { opacity: 0.45, duration: ${(BEAT * 0.9).toFixed(3)}, ease: "sine.inOut", repeat: 5, yoyo: true, immediateRender: false }, ${at(s(28, 1))});`,
    `tl.fromTo("#g-fish", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }, ${at(s(32, 1))});`,
    `tl.fromTo("#mk-fish", { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power2.inOut" }, ${at(s(32, 2))});`,
    `tl.fromTo("#g-rank", { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1.1, duration: 0.6, ease: "power2.out" }, ${at(s(33, 1))});`,
    `tl.fromTo("#g-rank", { opacity: 1 }, { opacity: 0.5, duration: ${(BEAT * 0.9).toFixed(3)}, ease: "sine.inOut", repeat: 3, yoyo: true, immediateRender: false }, ${at(s(33, 2))});`,
    // дрейф панелей в 3D (глубина) на всю длину секции
    ...[['roster', 9, 11], ['swap', 11, 12], ['sectors', 13, 14], ['duels', 14, 16], ['pts', 26, 29], ['heat', 29, 31], ['fish', 31, 33], ['world', 35, 36]]
      .map(([id, a, b]) => `tl.fromTo("#${id} .panel", { rotationY: ${P ? 4 : 6}, rotationX: 2, transformPerspective: ${Math.round(160 * u)} }, { rotationY: ${P ? -4 : -6}, rotationX: -1, transformPerspective: ${Math.round(160 * u)}, duration: ${len(s(a), s(b))}, ease: "sine.inOut" }, ${at(s(a))});`),
  ].join('\n      ');

  // мягкие переходы между сценами: вертикальный «шторка-градиент» navy
  const cuts = [s(5), s(9), s(11), s(13), s(16), s(18), s(26), s(35), s(39), s(43), s(47)];
  const wipes = cuts.map((t) => `tl.fromTo("#flash", {opacity:0.28}, {opacity:0, duration:0.22, ease:"power2.out", immediateRender:false}, ${at(t)});`).join('\n      ');

  const words1 = ['Nepřijeli', 'jsme', 'bojovat,'], words2 = ['přijeli', 'jsme', 'za', 'přáteli.'];
  const kin = [
    ...words1.map((w, i) => `tl.fromTo("#k1w${i}", {yPercent:110}, {yPercent:0, duration:0.3, ease:"expo.out"}, ${at(s(16, i))});`),
    ...words2.map((w, i) => `tl.fromTo("#k2w${i}", {yPercent:110}, {yPercent:0, duration:0.22, ease:"expo.out"}, ${at(s(17) + i * 0.04)});`),
    `tl.fromTo("#k-l1", {opacity:1}, {opacity:0.35, duration:0.3, immediateRender:false}, ${at(s(17))});`,
    `tl.fromTo("#k-en", {opacity:0, y:${Math.round(2 * u)}}, {opacity:1, y:0, duration:0.3, ease:"power2.out"}, ${at(s(17, 2))});`,
    `tl.fromTo("#kin-cam", {scale:1}, {scale:1.06, duration:${len(s(16), s(18))}, ease:"none"}, ${at(s(16))});`,
    `tl.fromTo("#flash", {opacity:0.6}, {opacity:0, duration:0.4, ease:"power2.out", immediateRender:false}, ${at(s(17))});`,
  ].join('\n      ');

  // одна короткая вспышка постановочного фото с кубком (в финале)
  const BL = [s(48, 2), 0.14];
  const blink = `tl.set("#blink", {opacity:0}, 0);\n      tl.set("#blink", {opacity:1}, ${at(BL[0])});\n      tl.fromTo("#blink .bf", {scale:1.06}, {scale:1, duration:${BL[1]}, ease:"none", immediateRender:false}, ${at(BL[0])});\n      tl.set("#blink", {opacity:0}, ${at(BL[0] + BL[1])});`;

  const chipsHtml = SCENES.map(([st, en, id, cz, eng], i) => `
      <section id="chip-${id}" class="clip chip-clip" data-start="${at(st)}" data-duration="${len(st, en)}" data-track-index="4">
        <div class="chip"><span class="chip-num">${String(i + 1).padStart(2, '0')}</span><span class="chip-cz">${cz}</span><span class="chip-en">${eng}</span></div>
      </section>`).join('');

  const H2 = (id, cz, en) => `<div class="h2" id="${id}"><span>${cz}</span><em>${en}</em></div>`;

  const html = `<!doctype html>
<html lang="cs">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <title>HB BATTLE 2026 – začátek (${P ? '9:16' : '16:9'}) — v8</title>
    <script src="assets/gsap.min.js"></script>
    <style>
      ${FONTS}
      :root { --blue:#304285; --red:#e31e24; --navy:#0b1e42; --ice:#eef2f9; --deep:#050d22; }
      body { margin:0; background:var(--deep); color:var(--ice); font-family:'Source Sans 3', sans-serif; }
      #root { position:relative; width:100%; height:100%; overflow:hidden; background:var(--deep); }
      .clip { position:absolute; inset:0; }

      /* фон: мягкий mesh-gradient + зерно */
      #mesh { position:absolute; inset:0; overflow:hidden; background:linear-gradient(180deg, #0b1e42 0%, #050d22 100%); }
      .blob { position:absolute; border-radius:50%; filter:blur(${px(10)}); }
      #b1 { width:${px(90)}; height:${px(90)}; left:-15%; top:5%; background:radial-gradient(circle, rgba(48,66,133,.85), transparent 70%); }
      #b2 { width:${px(70)}; height:${px(70)}; right:-12%; top:40%; background:radial-gradient(circle, rgba(227,30,36,.28), transparent 70%); }
      #b3 { width:${px(80)}; height:${px(80)}; left:20%; bottom:-25%; background:radial-gradient(circle, rgba(64,110,200,.45), transparent 70%); }
      #grain { position:absolute; inset:0; background:url(assets/grain.png) 0 0 / 256px 256px; opacity:.55; mix-blend-mode:overlay; pointer-events:none; }

      #three-wrap { position:absolute; inset:0; }
      #three-layer { width:100%; height:100%; display:block; }

      /* фото-шоты без рамок */
      .cam { position:absolute; inset:0; }
      .ph, .gbg, .gfg { position:absolute; inset:0; background-size:cover; background-position:50% 35%; background-repeat:no-repeat; }
      .ph, .gbg { -webkit-mask-image:linear-gradient(180deg, #000 0%, #000 52%, transparent 92%); }
      .ph { filter:saturate(.9) brightness(.85); }
      .gfg { filter:drop-shadow(0 ${px(1.5)} ${px(3)} rgba(0,0,0,.55)); -webkit-mask-image:linear-gradient(180deg, #000 70%, transparent 96%); }
      .bigword { position:absolute; left:0; right:0; top:${P ? '14%' : '10%'}; text-align:center; overflow:hidden; line-height:.86; pointer-events:none;
        font-family:Montserrat; font-weight:900; letter-spacing:-.02em; text-transform:uppercase; white-space:nowrap; }
      .bigword span { display:inline-block; color:var(--ice); opacity:.95; }
      .sub { position:absolute; left:${px(6)}; right:${px(6)}; bottom:${f(SAFE_B + 4 * u)}; overflow:hidden; font-family:Montserrat; font-weight:600; font-size:${px(P ? 4 : 2.8)}; letter-spacing:.14em; text-transform:uppercase; color:#ffd36b; }
      .sub span { display:inline-block; }
      .plate { position:absolute; left:${px(6)}; bottom:${f(SAFE_B + 3 * u)}; display:flex; flex-direction:column; gap:${px(0.4)}; }
      .plate b { font-family:Montserrat; font-weight:900; font-size:${px(P ? 7.5 : 5)}; letter-spacing:-.01em; line-height:1; }
      .plate i { font-style:normal; font-weight:600; font-size:${px(P ? 3.6 : 2.5)}; color:#ffd36b; letter-spacing:.06em; text-transform:uppercase; }
      .caption { position:absolute; left:${px(6)}; right:${px(6)}; bottom:${f(SAFE_B + 3 * u)}; font-family:Montserrat; font-weight:900; font-size:${px(P ? 6.6 : 4.6)}; line-height:1.04; }
      .caption span { display:block; font-family:'Source Sans 3'; font-weight:600; font-size:.5em; margin-top:${px(1)}; color:#ffd36b; }

      /* фото целиком */
      .blurfill { position:absolute; inset:${px(-6)}; background-size:cover; background-position:50% 50%; filter:blur(${px(4)}) brightness(.42) saturate(1.15); }
      .beat { position:absolute; inset:0; }
      .pc, .fgc { position:absolute; background-size:100% 100%; background-repeat:no-repeat; }
      .pc { -webkit-mask-image:linear-gradient(90deg, transparent 0, #000 5%, #000 95%, transparent 100%), linear-gradient(180deg, transparent 0, #000 5%, #000 92%, transparent 100%);
        -webkit-mask-composite:source-in; mask-composite:intersect; }
      .fgc { filter:drop-shadow(0 ${px(1)} ${px(2.4)} rgba(0,0,0,.5)); }
      .bigword.over span { text-shadow:0 ${px(0.6)} ${px(3)} rgba(0,0,0,.55); }
      .qwrap { position:absolute; left:${px(7)}; right:${px(7)}; top:${P ? '30%' : '24%'}; display:flex; flex-direction:column; gap:${px(1.4)}; }
      .ql { overflow:hidden; font-family:Montserrat; font-weight:900; font-size:${px(P ? 8.5 : 6.4)}; line-height:1.02; text-transform:uppercase; letter-spacing:-.01em; position:relative; }
      .ql span { display:inline-block; } .ql.red { color:var(--red); }
      .ql.small { font-size:${px(P ? 3.6 : 2.6)}; font-weight:700; letter-spacing:.12em; color:#ffd36b; margin-top:${px(1.6)}; }
      .ql.big { font-size:${px(P ? 12 : 9)}; padding-bottom:${px(1.6)}; }
      .mk { position:absolute; left:0; bottom:0; height:${px(0.8)}; width:100%; background:var(--red); transform-origin:left center; border-radius:${px(0.4)}; }
      .ql .mk { width:${P ? '78%' : '52%'}; }
      .plate { padding-bottom:${px(1.2)}; }
      .glow { position:absolute; inset:-35%; background:radial-gradient(closest-side, rgba(227,30,36,.55), rgba(227,30,36,0)); opacity:0; pointer-events:none; z-index:-1; }
      .hlbox { position:relative; isolation:isolate; }

      /* общие заголовки инфографики */
      .h2 { overflow:hidden; display:flex; flex-direction:column; }
      .h2 span { display:block; font-family:Montserrat; font-weight:900; font-size:${px(P ? 9 : 6.4)}; letter-spacing:-.02em; line-height:.95; text-transform:uppercase; }
      .h2 em { font-style:normal; font-weight:600; font-size:${px(P ? 3.4 : 2.4)}; color:#ffd36b; letter-spacing:.1em; text-transform:uppercase; margin-top:${px(1)}; }
      .panel { position:absolute; left:${px(6)}; right:${px(6)}; top:${P ? '9%' : '9%'}; }

      /* интро-титул и счётчики */
      #title-clip .t-wrap { position:absolute; left:${px(6)}; right:${px(6)}; top:${P ? '50%' : '56%'}; display:flex; flex-direction:column; align-items:center; text-align:center; gap:${px(1.2)}; }
      .t-main { font-family:Montserrat; font-weight:900; font-size:${px(P ? 15 : 10)}; letter-spacing:-.03em; line-height:.9; }
      .t-main .red { color:var(--red); }
      .t-cup { font-family:Montserrat; font-weight:700; font-size:${px(P ? 3.6 : 2.4)}; letter-spacing:.14em; text-transform:uppercase; opacity:.85; }
      .counts { display:flex; gap:${px(P ? 5 : 6)}; margin-top:${px(2)}; }
      .cnt { display:flex; flex-direction:column; align-items:center; }
      .cnt b { font-family:Montserrat; font-weight:900; font-size:${px(P ? 9 : 6)}; line-height:1; color:var(--ice); font-variant-numeric:tabular-nums; }
      .cnt i { font-style:normal; font-weight:600; font-size:${px(P ? 3 : 2.1)}; color:#ffd36b; text-transform:uppercase; letter-spacing:.08em; }

      /* состав */
      .rgrid { display:grid; grid-template-columns:${P ? '1fr' : '1fr 1fr'}; gap:${px(P ? 2.4 : 2)}; margin-top:${px(P ? 5 : 3.5)}; }
      .rcard { display:flex; align-items:center; gap:${px(2.4)}; background:rgba(238,242,249,.06); border:1px solid rgba(238,242,249,.12); border-radius:${px(2.4)}; padding:${px(2)} ${px(2.6)};
        backdrop-filter:blur(${px(1.5)}); }
      .rno { flex:none; width:${px(P ? 13 : 9)}; height:${px(P ? 13 : 9)}; border-radius:${px(2)}; background:var(--red); display:grid; place-items:center;
        font-family:Montserrat; font-weight:900; font-size:${px(P ? 6.4 : 4.4)}; }
      .rtx { display:flex; flex-direction:column; }
      .rtx b { font-family:Montserrat; font-weight:800; font-size:${px(P ? 5.4 : 3.6)}; line-height:1.05; }
      .rtx i { font-style:normal; font-weight:600; font-size:${px(P ? 3.2 : 2.2)}; color:#9fb4e6; }
      #roster-coach { margin-top:${px(2.6)}; font-weight:600; font-size:${px(P ? 3.6 : 2.5)}; color:#ffd36b; letter-spacing:.06em; text-transform:uppercase; }

      /* замена */
      .swap { display:flex; flex-direction:${P ? 'column' : 'row'}; align-items:${P ? 'stretch' : 'center'}; gap:${px(3)}; margin-top:${px(P ? 7 : 5)}; }
      .person { position:relative; flex:1; border-radius:${px(2.4)}; padding:${px(3)}; background:rgba(238,242,249,.06); border:1px solid rgba(238,242,249,.12); }
      .person b { display:block; font-family:Montserrat; font-weight:900; font-size:${px(P ? 7 : 5)}; line-height:1; }
      .person i { display:block; font-style:normal; font-weight:600; font-size:${px(P ? 3.4 : 2.4)}; color:#9fb4e6; margin-top:${px(1)}; text-transform:uppercase; letter-spacing:.06em; }
      .person .tag { display:inline-block; margin-bottom:${px(1.2)}; font-family:Montserrat; font-weight:800; font-size:${px(P ? 2.8 : 2)}; padding:${px(0.6)} ${px(1.4)}; border-radius:${px(1)}; }
      #swap-out .tag { background:rgba(238,242,249,.15); }
      #swap-in { background:linear-gradient(135deg, rgba(227,30,36,.35), rgba(48,66,133,.35)); border-color:rgba(227,30,36,.6); }
      #swap-in .tag { background:var(--red); }
      .strike { position:absolute; left:${px(3)}; right:${px(3)}; top:${P ? '42%' : '40%'}; height:${px(0.7)}; background:var(--red); transform-origin:left center; }
      .arrow { font-family:Montserrat; font-weight:900; font-size:${px(P ? 8 : 6)}; color:var(--red); text-align:center; }
      #swap-note { margin-top:${px(3)}; font-weight:600; font-size:${px(P ? 3.8 : 2.6)}; color:#ffd36b; }

      /* сектора */
      #lake { height:${px(P ? 1.4 : 1)}; margin-top:${px(P ? 8 : 5)}; border-radius:${px(1)}; background:linear-gradient(90deg, #9cc8f0, #304285, #9cc8f0); transform-origin:left center; }
      .secs { display:grid; grid-template-columns:${P ? '1fr 1fr' : 'repeat(4, 1fr)'}; gap:${px(2.4)}; margin-top:${px(2.4)}; }
      .sec { border-radius:${px(2.4)}; padding:${px(2.4)}; background:rgba(238,242,249,.06); border:1px solid rgba(238,242,249,.12); display:flex; flex-direction:column; }
      .sec-h { font-family:Montserrat; font-weight:800; font-size:${px(P ? 3.6 : 2.4)}; text-transform:uppercase; letter-spacing:.08em; color:#9fb4e6; }
      .sec-r { font-size:${px(P ? 3 : 2.1)}; color:rgba(238,242,249,.6); }
      .sec-no { font-family:Montserrat; font-weight:900; font-size:${px(P ? 16 : 11)}; line-height:1; color:var(--red); margin-top:${px(1.2)}; transform-origin:left bottom; }
      .sec-n { font-family:Montserrat; font-weight:800; font-size:${px(P ? 4.6 : 3)}; text-transform:uppercase; }

      /* поединки */
      .duels { display:grid; grid-template-columns:${P ? '1fr 1fr' : 'repeat(4, 1fr)'}; gap:${px(1.8)}; margin-top:${px(3)}; }
      .dcol { border-radius:${px(2)}; background:rgba(238,242,249,.95); color:var(--navy); overflow:hidden; }
      .dh { display:flex; align-items:center; gap:${px(1.2)}; background:var(--navy); color:var(--ice); padding:${px(1.2)} ${px(1.4)}; border-bottom:${px(0.4)} solid var(--red); }
      .dno { background:var(--red); border-radius:${px(0.8)}; padding:${px(0.2)} ${px(0.8)}; font-family:Montserrat; font-weight:900; font-size:${px(P ? 3.4 : 2.3)}; }
      .dh b { font-family:Montserrat; font-weight:800; font-size:${px(P ? 2.9 : 2)}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .dwin { height:calc(${ROWS_VIS} * ${px(P ? 4.6 : 3.3)}); overflow:hidden; }
      .drow { display:grid; grid-template-columns:${px(P ? 3.6 : 2.6)} ${px(P ? 4.4 : 3)} 1fr ${px(P ? 4.4 : 3)}; align-items:center; height:${px(P ? 4.6 : 3.3)}; padding:0 ${px(1.2)};
        font-size:${px(P ? 2.6 : 1.8)}; border-bottom:1px solid rgba(11,30,66,.08); }
      .dk { font-weight:700; color:#9fb4e6; } .dn { font-weight:800; color:var(--red); } .dname { font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; } .dc { font-weight:700; text-align:right; color:var(--blue); }
      #duels-note { margin-top:${px(1.6)}; font-size:${px(P ? 2.6 : 1.8)}; color:rgba(238,242,249,.6); }

      /* страны */
      .chips { display:flex; flex-wrap:wrap; gap:${px(1.6)}; margin-top:${px(P ? 6 : 4)}; max-width:${px(P ? 88 : 120)}; }
      .chips span { font-family:Montserrat; font-weight:900; font-size:${px(P ? 6 : 4.2)}; padding:${px(1)} ${px(2.2)}; border-radius:${px(1.6)};
        background:rgba(238,242,249,.07); border:1px solid rgba(238,242,249,.16); }
      .chips span.cz { background:var(--red); border-color:var(--red); }
      #world-sub { margin-top:${px(3)}; font-family:Montserrat; font-weight:800; font-size:${px(P ? 4.4 : 3)}; }
      #world-sub em { font-style:normal; color:var(--red); }

      /* результаты */
      .prows { display:flex; flex-direction:column; gap:${px(P ? 2.6 : 1.8)}; margin-top:${px(P ? 5 : 3)}; }
      .prow { display:grid; grid-template-columns:${px(P ? 12 : 8)} 1fr ${px(P ? 16 : 11)}; align-items:center; gap:${px(2)}; }
      .pava { position:relative; width:${px(P ? 12 : 8)}; height:${px(P ? 12 : 8)}; border-radius:50%; background:linear-gradient(135deg, #304285, #0b1e42); border:${px(0.35)} solid rgba(238,242,249,.35); display:grid; place-items:center; color:#9fc4f0; }
      .pava .ico { width:62%; height:62%; }
      .pava span { position:absolute; right:${px(-0.8)}; bottom:${px(-0.8)}; background:var(--red); color:#fff; border-radius:${px(1)}; padding:0 ${px(0.8)}; font-family:Montserrat; font-weight:900; font-size:${px(P ? 2.8 : 1.9)}; }
      .pname { font-family:Montserrat; font-weight:800; font-size:${px(P ? 4.2 : 2.8)}; line-height:1.1; }
      .pname i { display:block; font-family:'Source Sans 3'; font-style:normal; font-weight:600; font-size:${px(P ? 2.6 : 1.8)}; color:#9fb4e6; }
      .pbar { position:relative; height:${px(P ? 2.6 : 1.8)}; margin-top:${px(1)}; border-radius:${px(1.3)}; background:rgba(238,242,249,.08); overflow:hidden; }
      .pb1, .pb2 { position:absolute; top:0; bottom:0; transform-origin:left center; }
      .pb1 { left:0; background:linear-gradient(90deg, #304285, #4b6bd1); border-radius:${px(1.3)} 0 0 ${px(1.3)}; }
      .pb2 { background:linear-gradient(90deg, #e31e24, #ff5a5f); border-radius:0 ${px(1.3)} ${px(1.3)} 0; }
      .pval { text-align:right; } .pval b { font-family:Montserrat; font-weight:900; font-size:${px(P ? 9 : 6)}; font-variant-numeric:tabular-nums; } .pval i { font-style:normal; font-weight:700; color:#9fb4e6; margin-left:${px(0.4)}; }
      #pts-total { margin-top:${px(P ? 4 : 2.6)}; display:flex; align-items:baseline; gap:${px(2)}; }
      #pts-total b { font-family:Montserrat; font-weight:900; font-size:${px(P ? 13 : 8)}; color:var(--red); line-height:1; }
      #pts-total span { font-weight:600; font-size:${px(P ? 3.2 : 2.2)}; color:#ffd36b; }
      .heat { display:flex; flex-direction:column; gap:${px(P ? 3 : 1.8)}; margin-top:${px(P ? 5 : 3)}; }
      .hrow { display:flex; flex-direction:${P ? 'column' : 'row'}; align-items:${P ? 'flex-start' : 'center'}; gap:${px(P ? 1 : 2)}; }
      .hname { width:${P ? 'auto' : px(22)}; font-family:Montserrat; font-weight:800; font-size:${px(P ? 3.8 : 2.6)}; text-transform:uppercase; display:flex; align-items:center; gap:${px(1)}; }
      .hno { background:var(--red); border-radius:${px(0.8)}; padding:0 ${px(0.8)}; font-weight:900; }
      .hgrid { display:flex; flex-direction:column; gap:${px(0.6)}; }
      .hline { display:flex; align-items:center; gap:${px(P ? 0.7 : 0.6)}; } .hline em { font-style:normal; width:${px(P ? 8 : 5.5)}; font-size:${px(P ? 2.4 : 1.6)}; color:#9fb4e6; font-weight:600; }
      .hc { display:inline-block; width:${px(P ? 4.4 : 3.6)}; height:${px(P ? 4.4 : 3.6)}; border-radius:${px(0.8)}; }
      .hW { background:#4b6bd1; } .hF { background:#9fb4e6; } .hD { background:rgba(238,242,249,.28); } .hL { background:var(--red); }
      #heat-legend { margin-top:${px(P ? 4 : 2.4)}; display:flex; flex-wrap:wrap; gap:${px(1.4)} ${px(3)}; font-weight:600; font-size:${px(P ? 2.8 : 1.9)}; }
      #heat-legend span { display:flex; align-items:center; gap:${px(0.8)}; } #heat-legend .hc { width:${px(P ? 2.8 : 2)}; height:${px(P ? 2.8 : 2)}; }
      .frows { display:flex; flex-direction:column; gap:${px(P ? 0.9 : 0.5)}; margin-top:${px(P ? 4 : 2.4)}; }
      .frow { display:grid; grid-template-columns:${px(P ? 4.4 : 3)} ${px(P ? 6.4 : 4.4)} 1fr ${px(P ? 9 : 6)}; align-items:center; gap:${px(1.2)}; font-size:${px(P ? 2.8 : 1.9)}; }
      .fpos { color:#9fb4e6; font-weight:700; } .fc { font-family:Montserrat; font-weight:800; }
      .fbar { height:${px(P ? 2.4 : 1.7)}; background:rgba(238,242,249,.06); border-radius:${px(1)}; overflow:hidden; }
      .ffill { height:100%; background:linear-gradient(90deg, #304285, #6f8fe0); border-radius:${px(1)}; transform-origin:left center; }
      .frow.cz .ffill { background:linear-gradient(90deg, #e31e24, #ff6b6f); } .frow.cz .fc, .frow.cz .fv { color:#ff6b6f; }
      .frow { transform-origin:left center; }
      .fv { font-family:Montserrat; font-weight:900; text-align:right; font-variant-numeric:tabular-nums; }
      #fish-note { position:relative; display:inline-block; padding-bottom:${px(1)}; margin-top:${px(P ? 3 : 1.8)}; font-family:Montserrat; font-weight:800; font-size:${px(P ? 4.4 : 3)}; } #fish-note b { color:var(--red); }
      .rank-wrap { position:absolute; left:${px(6)}; right:${px(6)}; top:${P ? '22%' : '16%'}; display:flex; flex-direction:column; align-items:center; text-align:center; }
      #rank-n { font-family:Montserrat; font-weight:900; font-size:${px(P ? 60 : 40)}; line-height:.85; letter-spacing:-.04em; color:var(--ice); font-variant-numeric:tabular-nums; }
      #rank-n span { color:var(--red); }
      #rank-t { font-family:Montserrat; font-weight:900; font-size:${px(P ? 7 : 5)}; text-transform:uppercase; letter-spacing:-.01em; margin-top:${px(1)}; }
      #rank-s { margin-top:${px(2)}; font-weight:600; font-size:${px(P ? 3.4 : 2.4)}; color:#ffd36b; }

      /* кинетика */
      #kin-cam { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; padding:0 ${px(6)} ${f(SAFE_B * 0.6)}; }
      .k-line { display:flex; flex-wrap:wrap; gap:0 ${px(2.4)}; font-family:Montserrat; font-weight:900; letter-spacing:-.02em; text-transform:uppercase; line-height:.95; }
      #k-l1 { font-size:${px(P ? 12 : 8.5)}; }
      #k-l2 { font-size:${px(P ? 13.5 : 10)}; margin-top:${px(1.5)}; }
      .k-mask { display:block; overflow:hidden; }
      .k-word { display:block; }
      .k-word.red { color:var(--red); }
      #k-en { font-size:${px(P ? 4.2 : 3)}; font-weight:600; margin-top:${px(2.4)}; color:#ffd36b; }
      #flash { position:absolute; inset:0; background:var(--ice); opacity:0; pointer-events:none; }

      /* вспышка-видение */
      #blink { position:absolute; inset:0; opacity:0; pointer-events:none; }
      #blink .bb, #blink .bf { position:absolute; inset:0; background-size:cover; background-position:50% 40%; }
      #blink .bb { background-image:url(assets/photos/p_winners.jpg); filter:brightness(1.1) saturate(1.1); }
      #blink .bf { background-image:url(assets/cut/p_winners.png); }

      /* плашки сцен */
      .chip { position:absolute; left:${px(6)}; ${P ? `bottom:${px(31)}` : `bottom:${px(5)}`}; display:flex; align-items:baseline; gap:${px(1.6)}; }
      .chip-num { font-family:Montserrat; font-weight:900; font-size:${px(P ? 3.6 : 2.6)}; color:var(--red); }
      .chip-cz { font-family:Montserrat; font-weight:800; font-size:${px(P ? 3.6 : 2.6)}; text-transform:uppercase; letter-spacing:.06em; }
      .chip-en { font-size:${px(P ? 3 : 2.1)}; color:rgba(238,242,249,.6); font-weight:600; }

      /* финал */
      #outro .o-wrap { position:absolute; left:${px(6)}; right:${px(6)}; bottom:${f(SAFE_B + 2 * u)}; background:rgba(5,13,34,.78); backdrop-filter:blur(${px(1.5)}); border-radius:${px(2)}; padding:${px(2.4)} ${px(3)}; display:flex; flex-direction:column; align-items:${P ? 'flex-start' : 'center'}; text-align:${P ? 'left' : 'center'}; gap:${px(1.2)}; }
      .o-quote { font-family:Montserrat; font-weight:900; font-size:${px(P ? 6.2 : 4.2)}; line-height:1.02; letter-spacing:-.01em; text-transform:uppercase; }
      .o-quote .red { color:var(--red); }
      .o-meta { font-family:Montserrat; font-weight:700; font-size:${px(P ? 3.2 : 2.2)}; letter-spacing:.14em; text-transform:uppercase; color:#ffd36b; }
      #outro .ph-final { position:absolute; inset:0; background-size:cover; background-position:50% 30%; -webkit-mask-image:linear-gradient(180deg, #000 0%, #000 50%, transparent 80%); }
      #outro .ph-final.bg { background-image:url(assets/gfx/p_cheers_bg.jpg); opacity:.55; }
      #outro .ph-final.fg { background-image:url(assets/gfx/p_cheers_fgc.png); -webkit-mask-image:linear-gradient(180deg, #000 0%, #000 60%, transparent 85%); }

      /* виджет-проигрыватель */
      #player { position:absolute; right:${f(CM)}; bottom:${f(CB)}; width:${f(CW)}; height:${f(CH)}; }
      #card { position:absolute; inset:0; border-radius:${f(CH * 0.24)}; background:rgba(11,30,66,.72); backdrop-filter:blur(${px(2)});
        box-shadow:0 ${px(1.2)} ${px(4)} rgba(0,0,0,.45), inset 0 0 0 1px rgba(238,242,249,.14); }
      #vinyl-wrap { position:absolute; left:${f(VL)}; top:${f(VT)}; width:${f(VD)}; height:${f(VD)}; }
      #vinyl { position:absolute; inset:0; border-radius:50%; background:repeating-radial-gradient(circle at 50% 50%, #0d0d10 0 ${f(VD * 0.006)}, #1c1c22 ${f(VD * 0.006)} ${f(VD * 0.011)});
        box-shadow:0 ${px(0.8)} ${px(2.2)} rgba(0,0,0,.6); }
      #vinyl img { position:absolute; left:30%; top:30%; width:40%; height:40%; border-radius:50%; }
      #vinyl .hole { position:absolute; left:48.6%; top:48.6%; width:2.8%; height:2.8%; border-radius:50%; background:#c9ced8; }
      #sheen { position:absolute; inset:0; border-radius:50%; pointer-events:none;
        background:conic-gradient(from 20deg, transparent 0 8%, rgba(255,255,255,.16) 12%, transparent 18% 52%, rgba(255,255,255,.12) 60%, transparent 66%);
        -webkit-mask-image:radial-gradient(circle, transparent 0 20%, #000 21%); }
      #arm { position:absolute; left:${f(VL + VD * 0.97)}; top:${f(VT + VD * 0.04)}; width:0; height:0; }
      #arm svg { position:absolute; left:${f(-VD * 0.5)}; top:${f(-VD * 0.12)}; overflow:visible; }
      #p-text { position:absolute; left:${f(VL + VD + 3.2 * u)}; right:${f(2.4 * u)}; top:${f(CH * 0.17)}; bottom:${f(CH * 0.14)}; display:flex; flex-direction:column; justify-content:space-between; }
      .p-title { font-family:Montserrat; font-weight:900; font-size:${px(P ? 3.4 : 2.3)}; line-height:1.1; white-space:nowrap; }
      .p-artist { font-size:${px(P ? 2.6 : 1.75)}; font-weight:600; opacity:.72; white-space:nowrap; }
      .p-row { display:flex; align-items:center; gap:${px(1.2)}; font-size:${px(P ? 2.2 : 1.5)}; font-weight:600; opacity:.9; }
      .p-bar { position:relative; flex:1; height:${px(0.5)}; background:rgba(238,242,249,.22); border-radius:${px(0.5)}; overflow:hidden; }
      #p-fill { position:absolute; inset:0; background:var(--red); transform-origin:left center; }
      #p-eq { display:flex; align-items:flex-end; gap:${px(0.4)}; height:${px(P ? 2.2 : 1.5)}; }
      #p-eq i { display:block; width:${px(0.55)}; height:100%; background:var(--ice); transform-origin:bottom center; }
      .nw { white-space:nowrap; }
      #wipe-holder { position:absolute; inset:0; overflow:hidden; pointer-events:none; }
      #wipe { position:absolute; left:0; right:0; top:-30%; height:160%; background:linear-gradient(180deg, transparent 0%, #050d22 22%, #050d22 78%, transparent 100%); }
      #proto-badge { position:absolute; right:${px(3)}; top:${px(3)}; font-family:Montserrat; font-weight:600; font-size:${px(2)}; letter-spacing:.2em; opacity:.45; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-width="${W}" data-height="${H}" data-duration="${DUR}" data-fps="30">
      <div id="mesh"><div class="blob" id="b1"></div><div class="blob" id="b2"></div><div class="blob" id="b3"></div></div>

      ${SHOTS.map(shotHtml).join('')}

      <section id="roster" class="clip" data-start="${at(s(9))}" data-duration="${len(s(9), s(11))}" data-track-index="2">
        <div class="panel">${H2('roster-h', 'Team Czech Republic', 'Reprezentují nás')}
          <div class="rgrid">${roster}</div>
          <div id="roster-coach">kouč Denis Zaikin</div>
        </div>
      </section>

      <section id="swap" class="clip" data-start="${at(s(11))}" data-duration="${len(s(11), s(12))}" data-track-index="2">
        <div class="panel">${H2('swap-h', 'Změna v sestavě', 'Line-up change')}
          <div class="swap">
            <div class="person" id="swap-out"><span class="tag">ze zdravotních důvodů</span><b>Michael Boček</b><i>nemůže nastoupit</i><div class="strike"></div></div>
            <div class="arrow">${P ? '↓' : '→'}</div>
            <div class="person" id="swap-in"><span class="tag">nastupuje</span><b>Martin Stoklasa</b><i>č. 55 · sektor 4</i></div>
          </div>
          <div id="swap-note">Michaele, brzy se uzdrav – tým za tebe zabojuje.</div>
        </div>
      </section>

      <section id="sectors" class="clip" data-start="${at(s(13))}" data-duration="${len(s(13), s(14))}" data-track-index="2">
        <div class="panel">${H2('sectors-h', 'Losování', '4 sektory · 64 lovných míst')}
          <div id="lake"></div>
          <div class="secs">${sectors}</div>
        </div>
      </section>

      <section id="duels" class="clip" data-start="${at(s(14))}" data-duration="${len(s(14), s(16))}" data-track-index="2">
        <div class="panel">${H2('duels-h', '15 soubojů', 'každý s každým ve svém sektoru')}
          <div class="duels">${duels}</div>
          <div id="duels-note">Předběžný rozpis podle losovací tabulky H-Battle · 1. závodní den, sobota 3. 10. 2026</div>
        </div>
      </section>

      <section id="world" class="clip" data-start="${at(s(35))}" data-duration="${len(s(35), s(36))}" data-track-index="2">
        <div class="panel">${H2('world-h', '13 zemí', '16 týmů · 64 závodníků')}
          <div class="chips">${chips}</div>
          <div id="world-sub">Jedno jezero. <em>Jedna parta.</em></div>
        </div>
      </section>

      <section id="pts" class="clip" data-start="${at(s(26))}" data-duration="${len(s(26), s(29))}" data-track-index="2">
        <div class="panel">${H2('pts-h', 'Body Team CZ', 'oba dny · 1. den + 2. den')}
          <div class="prows">${ptsRows}</div>
          <div id="pts-total" class="hlbox"><span class="glow" id="g-pts"></span><b>166</b><span>bodů týmu z 360 · 30 soubojů na závodníka</span></div>
        </div>
      </section>

      <section id="heat" class="clip" data-start="${at(s(29))}" data-duration="${len(s(29), s(31))}" data-track-index="2">
        <div class="panel">${H2('heat-h', '120 soubojů', 'každý čtvereček = jeden souboj')}
          <div class="heat">${heat}</div>
          <div id="heat-legend"><span><i class="hc hW"></i>výhra 3 b.</span><span><i class="hc hF"></i>remíza s rybou 2 b.</span><span><i class="hc hD"></i>remíza 0:0 1 b.</span><span><i class="hc hL"></i>prohra</span></div>
        </div>
      </section>

      <section id="fish" class="clip" data-start="${at(s(31))}" data-duration="${len(s(31), s(33))}" data-track-index="2">
        <div class="panel">${H2('fish-h', 'Ryby', 'úlovky týmů za oba dny')}
          <div class="frows">${fishRows}</div>
          <div id="fish-note" class="hlbox"><span class="glow" id="g-fish"></span><b>243 ryb</b> – 4. nejvíc ze všech týmů<span class="mk" id="mk-fish"></span></div>
        </div>
      </section>

      <section id="rank" class="clip" data-start="${at(s(33))}" data-duration="${len(s(33), s(34))}" data-track-index="2">
        <div class="rank-wrap">
          <div id="rank-n" class="hlbox"><span class="glow" id="g-rank"></span><b id="rank-v">16</b><span>.</span></div>
          <div id="rank-t">místo ze 16 týmů</div>
          <div id="rank-s">součet umístění 78 (32 + 46) · 166 b. · 243 ryb</div>
        </div>
      </section>

      <div id="three-wrap"><canvas id="three-layer"></canvas></div>

      <section id="title-clip" class="clip" data-start="${at(s(2))}" data-duration="${len(s(2), s(5))}" data-track-index="3">
        <div class="t-wrap">
          <div id="t-main" class="t-main">HB BATTLE <span class="red">2026</span></div>
          <div id="t-cup" class="t-cup">Trout Area European Hardbaits Cup · <span class="nw">Pružina (SK)</span> · <span class="nw">2.–4. 10. 2026</span></div>
          <div class="counts">${COUNT.map(([n, cz], i) => `<div class="cnt" id="cntb${i}"><b id="cnt${i}">0</b><i>${cz}</i></div>`).join('')}</div>
        </div>
      </section>

      <section id="kin" class="clip" data-start="${at(s(16))}" data-duration="${len(s(16), s(18))}" data-track-index="3">
        <div id="kin-cam">
          <div id="k-l1" class="k-line">${words1.map((w, i) => `<span class="k-mask"><span id="k1w${i}" class="k-word">${w}</span></span>`).join('')}</div>
          <div id="k-l2" class="k-line">${words2.map((w, i) => `<span class="k-mask"><span id="k2w${i}" class="k-word${i === 3 ? ' red' : ''}">${w}</span></span>`).join('')}</div>
          <div id="k-en">We didn’t come to fight. We came for friends.</div>
        </div>
      </section>

      ${chipsHtml}

      <section id="outro" class="clip" data-start="${at(s(47))}" data-duration="${len(at(s(47)), DUR)}" data-track-index="3">
        <div id="out-cam" class="clip"></div>
        <div class="o-wrap">
          <div id="o-quote" class="o-quote">Nepřijeli jsme bojovat. <span class="red">Přijeli jsme za přáteli.</span></div>
          <div id="o-meta" class="o-meta">Držíme palce, kluci! · Pružina (SK) · <span class="nw">2.–4. 10. 2026</span></div>
        </div>
      </section>

      <div id="blink"><div class="bb"></div><div class="bf"></div></div>
      <div id="flash"></div>

      <div id="player">
        <div id="card"></div>
        <div id="vinyl-wrap">
          <div id="vinyl"><img src="assets/ta_label.png" alt="" /><div class="hole"></div></div>
          <div id="sheen"></div>
        </div>
        <div id="arm">
          <svg width="${f(VD)}" height="${f(VD)}" viewBox="${(-VD * 0.5).toFixed(1)} ${(-VD * 0.12).toFixed(1)} ${VD.toFixed(1)} ${VD.toFixed(1)}">
            <circle cx="0" cy="0" r="${(VD * 0.075).toFixed(1)}" fill="#c9ced8" stroke="#0b1e42" stroke-width="${(VD * 0.012).toFixed(1)}" />
            <circle cx="0" cy="0" r="${(VD * 0.03).toFixed(1)}" fill="#0b1e42" />
            <path d="M 0 0 L ${(-VD * 0.08).toFixed(1)} ${(VD * 0.62).toFixed(1)} L ${(-VD * 0.2).toFixed(1)} ${(VD * 0.82).toFixed(1)}" fill="none" stroke="#dfe4ee" stroke-width="${(VD * 0.028).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round" />
            <rect x="${(-VD * 0.27).toFixed(1)}" y="${(VD * 0.8).toFixed(1)}" width="${(VD * 0.13).toFixed(1)}" height="${(VD * 0.075).toFixed(1)}" rx="${(VD * 0.015).toFixed(1)}" fill="#e31e24" transform="rotate(-34 ${(-VD * 0.2).toFixed(1)} ${(VD * 0.84).toFixed(1)})" />
          </svg>
        </div>
        <div id="p-text">
          <div class="p-title">HB BATTLE 2026</div>
          <div class="p-artist">začátek · Trout Area CZ</div>
          <div class="p-row"><div id="p-eq"><i></i><i></i><i></i><i></i><i></i></div><span id="p-time">0:00</span><div class="p-bar"><div id="p-fill"></div></div><span>${Math.floor(SONG / 60)}:${String(Math.round(SONG % 60)).padStart(2, '0')}</span></div>
        </div>
      </div>
      <div id="grain"></div>
      
      <div id="proto-badge">DRAFT · v8</div>

      <audio id="bgm" src="assets/track_full.wav" data-start="${T0}" data-duration="${SONG}" data-track-index="9" data-volume="1"></audio>
    </div>

    <script>
      const tl = gsap.timeline({ paused: true });
      tl.fromTo("#b1", { x: 0, y: 0 }, { x: ${Math.round(30 * u)}, y: ${Math.round(20 * u)}, duration: ${DUR}, ease: "sine.inOut" }, 0);
      tl.fromTo("#b2", { x: 0, y: 0 }, { x: ${Math.round(-25 * u)}, y: ${Math.round(-15 * u)}, duration: ${DUR}, ease: "sine.inOut" }, 0);
      tl.fromTo("#b3", { x: 0, y: 0 }, { x: ${Math.round(20 * u)}, y: ${Math.round(-20 * u)}, duration: ${DUR}, ease: "sine.inOut" }, 0);
      tl.fromTo("#grain", { x: 0 }, { x: 64, duration: ${DUR}, ease: "steps(${Math.round(DUR * 12)})" }, 0);
      tl.fromTo("#three-wrap", { opacity: 1 }, { opacity: 0, duration: 0.25 }, ${at(s(5) - 0.25)});
      tl.to("#three-wrap", { opacity: 1, duration: 0.3 }, ${at(s(47) - 0.15)});
      tl.fromTo("#t-main", { opacity: 0, y: ${Math.round(4 * u)} }, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }, ${at(s(2))});
      tl.fromTo("#t-cup", { opacity: 0 }, { opacity: 0.85, duration: 0.5 }, ${at(s(2, 2))});
      ${infoTweens}
      ${kin}
      ${shotTweens}
      ${SCENES.map(([st, , id]) => `tl.fromTo("#chip-${id} .chip", {opacity:0, x:${Math.round(-3 * u)}}, {opacity:1, x:0, duration:0.35, ease:"power3.out"}, ${at(st + BEAT)});`).join('\n      ')}
      tl.fromTo("#out-cam", { scale: 1.08 }, { scale: 1, duration: ${len(at(s(47)), DUR)}, ease: "power2.out" }, ${at(s(47))});
      tl.fromTo("#o-quote", { opacity: 0, y: ${Math.round(3 * u)} }, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }, ${at(s(47, 2))});
      tl.fromTo("#o-meta", { opacity: 0 }, { opacity: 1, duration: 0.5 }, ${at(s(48))});
      ${blink}
      ${wipes}

      tl.fromTo("#player", { x: ${dockX.toFixed(1)}, y: ${dockY.toFixed(1)}, scale: ${HERO}, opacity: 0 }, { x: ${dockX.toFixed(1)}, y: ${dockY.toFixed(1)}, scale: ${HERO}, opacity: 1, duration: 0.3, ease: "power1.out" }, 0);
      tl.to("#player", { x: 0, y: 0, scale: 1, duration: 0.8, ease: "power3.inOut" }, ${at(0.45)});
      tl.fromTo("#arm", { rotation: -20 }, { rotation: 0, duration: 0.75, ease: "power2.inOut" }, 0.3);
      tl.fromTo("#arm svg", { scale: 1.06 }, { scale: 1, duration: 0.15, ease: "power2.in" }, ${(T0 - 0.15).toFixed(2)});
      tl.to("#arm", { rotation: 9, duration: ${(SONG - 0.2).toFixed(2)}, ease: "none" }, ${at(0)});
      tl.to("#arm", { rotation: -20, duration: 0.7, ease: "power2.inOut" }, ${(DUR - 0.9).toFixed(2)});
      tl.fromTo("#vinyl", { rotation: 0 }, { rotation: 60, duration: 0.6, ease: "power1.in" }, ${at(-0.1)});
      tl.to("#vinyl", { rotation: ${(60 + 200 * (SONG - 0.5)).toFixed(0)}, duration: ${(SONG - 0.5).toFixed(2)}, ease: "none" }, ${at(0.5)});
      tl.to("#vinyl", { rotation: ${(60 + 200 * (SONG - 0.5) + 70).toFixed(0)}, duration: 0.6, ease: "power2.out" }, ${(T0 + SONG).toFixed(2)});
      tl.fromTo("#p-fill", { scaleX: 0 }, { scaleX: 1, duration: ${SONG}, ease: "none" }, ${T0});
      const BEATS = ${JSON.stringify(G.beats)};
      const pClock = { t: 0 }, pTime = document.getElementById("p-time"), pEq = [...document.querySelectorAll("#p-eq i")];
      tl.fromTo(pClock, { t: 0 }, { t: ${DUR}, duration: ${DUR}, ease: "none", onUpdate() {
        const s = Math.max(0, pClock.t - ${T0});
        pTime.textContent = Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");
        let bi = 0; while (bi < BEATS.length - 1 && BEATS[bi + 1] <= s) bi++;
        const ph = s >= BEATS[0] ? s - BEATS[bi] : 9, on = pClock.t >= ${T0} && s < ${SONG - 0.3};
        pEq.forEach((el, i) => { const k = on ? 0.25 + 0.75 * Math.exp(-(6 + i * 2.3) * (ph + i * 0.03)) : 0.12; el.style.transform = "scaleY(" + k.toFixed(3) + ")"; });
      } }, 0);
      window.__timelines["main"] = tl;
    </script>

    <script type="module">
      import * as THREE from "./assets/three.module.js";
      const W = ${W}, H = ${H}, PORTRAIT = ${P};
      const canvas = document.getElementById("three-layer");
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(W, H, false); renderer.setPixelRatio(1); renderer.outputColorSpace = THREE.SRGBColorSpace;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(PORTRAIT ? 50 : 32, W / H, 0.1, 200);
      const loader = new THREE.TextureLoader();
      function disc(src, edge) {
        const tex = loader.load(src);
        tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; tex.center.set(0.5, 0.5); tex.rotation = Math.PI / 2;
        const geo = new THREE.CylinderGeometry(1, 1, 0.14, 160, 1, false); geo.rotateX(Math.PI / 2);
        const side = new THREE.MeshStandardMaterial({ color: edge, metalness: 0.75, roughness: 0.3 });
        const face = new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: 0.82, color: 0x2a2a2a, metalness: 0.15, roughness: 0.35 });
        const back = new THREE.MeshStandardMaterial({ color: 0x0b1e42, metalness: 0.4, roughness: 0.5 });
        const m = new THREE.Mesh(geo, [side, face, back]); scene.add(m); return m;
      }
      const hb = disc("assets/H-BATTLE.png", 0x304285);
      const ta = disc("assets/logo-TACR2-ready.png", 0x0b1e42);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x0b1e42, 0.5));
      const key = new THREE.DirectionalLight(0xfff2d8, 1.1); scene.add(key);
      const rim = new THREE.PointLight(0xe31e24, 0, 12); scene.add(rim);
      const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
      const eo = (x) => 1 - Math.pow(1 - clamp(x), 3);
      const lerp = (a, b, t) => a + (b - a) * t;
      const T0 = ${T0}, OUT0 = ${s(47)}, INTRO_END = ${s(5)};
      function renderAt(tt) {
        const t = tt - T0;
        camera.position.set(Math.sin(t * 0.15) * 0.25, 0, 6.2); camera.lookAt(0, 0, 0);
        if (t > 0 && t < INTRO_END + 0.1) {
          const a = eo(t / 1.8);
          hb.visible = true; ta.visible = false;
          hb.position.set(0, PORTRAIT ? 1.5 : 0.9, lerp(-24, 0, a));
          hb.rotation.set(Math.sin(t * 0.9) * 0.06, lerp(-5.2, 0, eo(t / 2.2)) + Math.sin(t * 0.7) * 0.08, 0);
          hb.scale.setScalar(PORTRAIT ? 0.8 : 0.58);
          key.position.set(lerp(-6, 6, clamp((t - 1.4) / 1.6)), 2, 4); rim.intensity = 0;
        } else if (t >= OUT0 - 0.15) {
          const lt = t - OUT0, a = eo(lt / 1.2);
          hb.visible = ta.visible = true;
          const sc = 0.36;
          ta.scale.setScalar(sc); hb.scale.setScalar(sc);
          if (PORTRAIT) { ta.position.set(lerp(-6, -0.5, a), 2.75, 0); hb.position.set(lerp(6, 0.5, a), 2.75, 0); }
          else { ta.position.set(lerp(-8, -0.45, a), 1.45, 0); hb.position.set(lerp(8, 0.45, a), 1.45, 0); }
          ta.rotation.set(0, lerp(2.2, 0, eo(lt / 1.6)) + Math.sin(lt * 0.8) * 0.06, 0);
          hb.rotation.set(0, lerp(-2.2, 0, eo(lt / 1.6)) - Math.sin(lt * 0.8) * 0.06, 0);
          key.position.set(lerp(-6, 6, clamp((lt - 2.2) / 1.6)), 2, 4);
          rim.position.set(0, -2, 2.5); rim.intensity = 3 * clamp((lt - 1) / 1);
        } else { hb.visible = ta.visible = false; }
        renderer.render(scene, camera);
      }
      window.addEventListener("hf-seek", (e) => renderAt(e.detail.time));
      renderAt(window.__hfThreeTime || 0);
    </script>
  </body>
</html>
`;
  fs.writeFileSync(path.join(PROTO, file), html);
  console.log('wrote', file);
}

build(1080, 1920, '9x16/index.html');
build(1920, 1080, '16x9/index.html');
