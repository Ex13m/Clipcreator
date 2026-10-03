// HB2026 v2: монтаж по реальному треку Suno (сетка из 03_MUSIC/Trout_Area_edit60.grid.json).
// Два формата из одного сценария; фото пока слейты с 2.5D-параллаксом; логотипы — только оригиналы PNG.
// python3 scripts/edit_track.py && node scripts/build_v2.mjs  ->  proto/9x16/index.html, proto/16x9/index.html
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROTO = path.join(ROOT, 'proto');
const FONTS = fs.readFileSync(path.join(PROTO, 'assets/fonts.css'), 'utf8');

const G = JSON.parse(fs.readFileSync(path.join(ROOT, '03_MUSIC/Trout_Area_edit60.grid.json'), 'utf8'));
const BEAT = G.beat;
// T0 — момент, когда игла касается пластинки: с него стартует трек. Сценарий задан в тактах трека.
const T0 = 1.2, SONG = G.duration, DUR = +(T0 + SONG + 0.6).toFixed(2);
const at = (x) => +(x + T0).toFixed(3);
// s(bar, beat) — время доли в треке (такты 1..N по смонтированной версии)
const s = (bar, k = 0) => { const i = G.beats.findIndex((t) => Math.abs(t - G.downbeats[bar - 1]) < 0.06); return G.beats[i + k]; };
const len = (a, b) => +(b - a).toFixed(3);

// Сцены: [start, end, id, CZ, EN]
// Сцены по структуре трека: интро 1–4 | příjezd 5–8 | trénink 9–15 | брейк 16 | пик 17 | prezentace 18–19 | zahájení 20–21 | losování 22–24 | zákulisí 25 | přátelé 26–28 | финал 29–
const SCENES = [
  [s(5), s(9), 'prijezd', 'Příjezd', 'Arrival'],
  [s(9), s(16), 'trenink', 'Den 1 · trénink', 'Day 1 · practice'],
  [s(18), s(20), 'prezentace', 'Prezentace týmů', 'Team presentation'],
  [s(20), s(22), 'zahajeni', 'Zahájení', 'Opening ceremony'],
  [s(22), s(25), 'losovani', 'Losování', 'The draw'],
  [s(25), s(26), 'vtip', 'Zákulisí', 'Backstage'],
  [s(26), s(29), 'pratele', 'Přátelé', 'Friends'],
];
// Шоты: [num, start, dur, sceneId, действие (CZ), движение камеры]
const SH = (n, a, b, sc, act, mv) => [n, a, len(a, b), sc, act, mv];
const MONTAGE_MOVES = ['push', 'panL', 'pull', 'panR', 'tilt', 'push', 'panR', 'pull', 'panL', 'push', 'tilt', 'pull'];
const SHOTS = [
  SH(1, s(5), s(7), 'prijezd', 'Příjezd na revír, vykládání prutů', 'push'),
  SH(2, s(7), s(9), 'prijezd', 'Přivítání s domácím týmem', 'panR'),
  SH(3, s(9), s(11), 'trenink', 'Nához z břehu', 'panL'),
  SH(4, s(11), s(13), 'trenink', 'Záběr, ohnutý prut', 'push'),
  SH(5, s(13), s(15), 'trenink', 'Pstruh v podběráku', 'pull'),
  SH(6, s(15), s(16), 'trenink', 'Pustit zpátky do vody', 'tilt'),
  SH(7, s(18), s(19), 'prezentace', 'Tým ČR na pódiu', 'push'),
  SH(8, s(19), s(20), 'prezentace', 'Ostatní týmy, vlajky', 'panR'),
  SH(9, s(20), s(21), 'zahajeni', 'Nástup týmů', 'push'),
  SH(10, s(21), s(21, 2), 'zahajeni', 'Vlajky, hymna', 'tilt'),
  SH(11, s(21, 2), s(22), 'zahajeni', 'Přípitek pořadatelů', 'pull'),
  SH(12, s(25), s(26), 'vtip', 'Vtipná fotka týmu', 'whip'),
  // «Přátelé»: 12 кадров по одной доле — лучшие моменты (выбор после шага 3)
  ...MONTAGE_MOVES.map((mv, k) => SH(13 + k, s(26, k), s(26, k + 1), 'pratele', `Nejlepší moment ${k + 1}`, mv)),
];
const DRAW_ROWS = ['Závodník 1', 'Závodník 2', 'Závodník 3', 'Závodník 4', 'Závodník 5'];

function build(W, H, file) {
  const P = H > W, u = Math.min(W, H) / 100; // u = 1% короткой стороны
  const px = (n) => `${Math.round(n * u)}px`;
  const sceneName = Object.fromEntries(SCENES.map((s) => [s[2], s]));
  // Виджет-проигрыватель: карточка в нижнем правом углу, пластинка + тонарм
  const CW = (P ? 60 : 44) * u, CH = (P ? 17 : 11.5) * u, CM = (P ? 5 : 3.5) * u, CB = (P ? 10 : 3.5) * u;
  const VD = CH * 1.32;                // диаметр пластинки
  const VL = 1.6 * u, VT = (CH - VD) / 2; // пластинка торчит за верх/низ карточки
  const HERO = P ? 1.45 : 1.75;         // масштаб на старте (в центре кадра)
  const cardCx = W - CM - CW / 2, cardCy = H - CB - CH / 2;
  const dockX = W / 2 - cardCx, dockY = H / 2 - cardCy;
  const f = (n) => n.toFixed(1) + 'px';

  const shotsHtml = SHOTS.map(([n, st, d, sc, act]) => {
    const id = `sh${String(n).padStart(2, '0')}`;
    return `
      <section id="${id}" class="clip shot" data-start="${at(st)}" data-duration="${d}" data-track-index="2">
        <div class="layer l-bg"></div>
        <div class="layer l-mid"><span class="bignum">${String(n).padStart(2, '0')}</span></div>
        <div class="layer l-fg"><div class="horizon"></div><div class="reeds"></div></div>
        <div class="slate-meta">
          <div class="slate-tag">SHOT ${String(n).padStart(2, '0')} · ${sceneName[sc][3].toUpperCase()}</div>
          <div class="slate-act">${act}</div>
          <div class="slate-note">foto / video doplnit · ${d} s</div>
        </div>
      </section>`;
  }).join('');

  const chipsHtml = SCENES.map(([st, en, id, cz, eng], i) => `
      <section id="chip-${id}" class="clip chip-clip" data-start="${at(st)}" data-duration="${en - st}" data-track-index="4">
        <div class="chip"><span class="chip-num">${String(i + 1).padStart(2, '0')}</span><span class="chip-cz">${cz}</span><span class="chip-en">${eng}</span></div>
      </section>`).join('');

  const drawRows = DRAW_ROWS.map((r, i) => `
          <div class="tr" id="dr${i}"><span class="td name">${r}</span><span class="td">—</span><span class="td">—</span><span class="td">—</span></div>`).join('');

  // ---------- GSAP timeline ----------
  const moves = {
    push: [{ s: 1.0 }, { s: 1.1 }, { s: 1.06 }, { s: 1.16 }, { s: 1.1 }, { s: 1.26 }],
  };
  const shotTweens = SHOTS.map(([n, st, d, , , mv]) => {
    const id = `#sh${String(n).padStart(2, '0')}`;
    const L = (layer, from, to) => `tl.fromTo("${id} .${layer}", ${JSON.stringify(from)}, ${JSON.stringify({ ...to, duration: d, ease: 'none' })}, ${at(st)});`;
    const k = [0.35, 0.7, 1.2]; // глубина слоёв: фон / середина / передний план
    const out = [];
    const layers = ['l-bg', 'l-mid', 'l-fg'];
    layers.forEach((ly, i) => {
      const dz = k[i];
      if (mv === 'push') out.push(L(ly, { scale: 1.02 }, { scale: 1.02 + 0.1 * dz }));
      if (mv === 'pull') out.push(L(ly, { scale: 1.02 + 0.12 * dz }, { scale: 1.02 }));
      if (mv === 'panR') out.push(L(ly, { scale: 1.12, xPercent: -4 * dz }, { scale: 1.12, xPercent: 4 * dz }));
      if (mv === 'panL') out.push(L(ly, { scale: 1.12, xPercent: 4 * dz }, { scale: 1.12, xPercent: -4 * dz }));
      if (mv === 'tilt') out.push(L(ly, { scale: 1.12, yPercent: 4 * dz }, { scale: 1.12, yPercent: -4 * dz }));
      if (mv === 'whip') {
        out.push(`tl.fromTo("${id} .${ly}", {scale:${1.6 + dz * 0.4}, xPercent:${-30 * dz}}, {scale:1.04, xPercent:0, duration:0.45, ease:"expo.out"}, ${at(st)});`);
        out.push(`tl.to("${id} .${ly}", {scale:${1.04 + 0.06 * dz}, duration:${d - 0.45}, ease:"none"}, ${at(st + 0.45)});`);
      }
    });
    out.push(`tl.fromTo("${id} .slate-meta", {opacity:0, y:${Math.round(2 * u)}}, {opacity:1, y:0, duration:0.25, ease:"power2.out"}, ${at(st + 0.05)});`);
    return out.join('\n      ');
  }).join('\n      ');

  // Переходы: красная шторка на стыках сцен (ровно в бит)
  const cuts = [s(5), s(9), s(18), s(20), s(22), s(25), s(26), s(29)];
  const wipes = cuts.map((t, i) => `tl.fromTo("#wipe", {xPercent:-101}, {xPercent:101, duration:0.5, ease:"power2.inOut"${i ? ', immediateRender:false' : ''}}, ${at(t - 0.25)});`).join('\n      ');

  // Кинетическая типографика S1 — слова на доли
  const words1 = ['Nepřijeli', 'jsme', 'bojovat,'];
  const words2 = ['přijeli', 'jsme', 'za', 'přáteli.'];
  const kin = [
    // брейк: «Nepřijeli jsme bojovat,» — по слову на долю
    ...words1.map((w, i) => `tl.fromTo("#k1w${i}", {yPercent:110}, {yPercent:0, duration:0.3, ease:"power3.out"}, ${at(s(16, i))});`),
    // пик: «přijeli jsme za přáteli.» — удар целой строкой ровно в сильную долю
    ...words2.map((w, i) => `tl.fromTo("#k2w${i}", {yPercent:110}, {yPercent:0, duration:0.22, ease:"expo.out"}, ${at(s(17) + i * 0.04)});`),
    `tl.fromTo("#k-l2", {scale:1.18}, {scale:1, duration:0.5, ease:"expo.out"}, ${at(s(17))});`,
    `tl.fromTo("#k-under", {scaleX:0}, {scaleX:1, duration:0.35, ease:"power2.out"}, ${at(s(17, 1))});`,
    `tl.fromTo("#k-en", {opacity:0, y:${Math.round(2 * u)}}, {opacity:1, y:0, duration:0.3, ease:"power2.out"}, ${at(s(17, 2))});`,
    `tl.fromTo("#kin-cam", {scale:1}, {scale:1.07, duration:${len(s(16), s(18))}, ease:"none"}, ${at(s(16))});`,
    `tl.fromTo("#flash", {opacity:0.85}, {opacity:0, duration:0.35, ease:"power2.out", immediateRender:false}, ${at(s(17))});`,
  ].join('\n      ');

  const html = `<!doctype html>
<html lang="cs">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <title>H-BATTLE 2026 – začátek (${P ? '9:16' : '16:9'}) — RYBA</title>
    <script src="assets/gsap.min.js"></script>
    <style>
      ${FONTS}
      :root { --blue:#304285; --red:#e31e24; --navy:#0b1e42; --ice:#eef2f9; }
      body { margin:0; background:var(--navy); color:var(--ice); font-family:'Source Sans 3', sans-serif; }
      #root { position:relative; width:100%; height:100%; overflow:hidden; background:var(--navy); }
      .clip { position:absolute; inset:0; }
      .layer { position:absolute; inset:${px(-8)}; will-change:transform; }

      /* фон-мотив TA: горизонтальные «скоростные» полосы как в логотипе */
      #bg { position:absolute; inset:0; background:radial-gradient(120% 80% at 50% 40%, #16306b 0%, var(--navy) 70%); }
      #stripes { position:absolute; inset:${px(-10)}; opacity:.16;
        background:repeating-linear-gradient(180deg, transparent 0 ${px(1.6)}, #9cc8f0 ${px(1.6)} ${px(2.1)});
        -webkit-mask-image:linear-gradient(90deg, transparent, #000 30%, #000 70%, transparent); }

      #three-wrap { position:absolute; inset:0; }
      #three-layer { width:100%; height:100%; display:block; }

      /* заголовок интро */
      #title-clip .t-wrap { position:absolute; left:0; right:0; ${P ? `top:${px(118)}` : `bottom:${px(8)}`}; display:flex; flex-direction:column; align-items:center; gap:${px(1.4)}; }
      .t-main { font-family:Montserrat; font-weight:800; font-size:${px(P ? 10.5 : 7.5)}; letter-spacing:.02em; line-height:1; }
      .t-main .red { color:var(--red); }
      .t-sub { font-family:Montserrat; font-weight:600; font-size:${px(P ? 4.2 : 3)}; letter-spacing:.18em; text-transform:uppercase; opacity:.85; }

      /* кинетика */
      #kin-cam { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; padding:0 ${px(8)}; }
      .k-line { display:flex; flex-wrap:wrap; column-gap:.28em; font-family:Montserrat; font-weight:800; line-height:1.02; font-size:${px(P ? 13 : 9.5)}; }
      .k-mask { display:block; overflow:hidden; padding-bottom:.06em; }
      .k-word { display:block; }
      .k-word.red { color:var(--red); }
      #k-l2 { transform-origin:left center; }
      #flash { position:absolute; inset:0; background:var(--ice); opacity:0; pointer-events:none; }
      #k-under { height:${px(1)}; width:${px(P ? 60 : 48)}; background:var(--red); transform-origin:left center; margin:${px(2.5)} 0 ${px(2)}; }
      #k-en { font-size:${px(P ? 4.6 : 3.4)}; font-weight:600; opacity:.9; }

      /* слейты-заглушки шотов */
      .l-bg { background:linear-gradient(160deg, var(--blue) 0%, #1a2b62 55%, var(--navy) 100%); }
      .l-bg::after { content:""; position:absolute; inset:0; opacity:.2;
        background:repeating-linear-gradient(180deg, transparent 0 ${px(2.4)}, #bfe0ff ${px(2.4)} ${px(2.8)}); }
      .l-mid { display:flex; align-items:center; justify-content:center; }
      .bignum { font-family:Montserrat; font-weight:800; font-size:${px(P ? 62 : 48)}; color:transparent; -webkit-text-stroke:${px(0.35)} rgba(238,242,249,.28); line-height:1; }
      .horizon { position:absolute; left:-10%; right:-10%; bottom:-6%; height:34%; background:#0a1838; border-radius:50% 50% 0 0 / 22% 22% 0 0; }
      .reeds { position:absolute; left:4%; bottom:20%; width:30%; height:30%;
        background:repeating-linear-gradient(95deg, transparent 0 ${px(1.2)}, rgba(10,24,56,.95) ${px(1.2)} ${px(1.7)});
        -webkit-mask-image:linear-gradient(0deg, #000 30%, transparent); }
      .slate-meta { position:absolute; left:${px(7)}; right:${px(7)}; ${P ? `top:${px(40)}` : `top:${px(10)}`}; display:flex; flex-direction:column; gap:${px(1.6)}; }
      .slate-tag { font-family:Montserrat; font-weight:600; font-size:${px(P ? 3.2 : 2.4)}; letter-spacing:.16em; color:#9fb4e6; }
      .slate-act { font-family:Montserrat; font-weight:800; font-size:${px(P ? 7.4 : 5.6)}; line-height:1.05; max-width:${px(P ? 86 : 110)}; }
      .slate-note { font-size:${px(P ? 3.2 : 2.4)}; color:var(--red); font-weight:600; letter-spacing:.08em; text-transform:uppercase; }

      /* плашка сцены */
      .chip { position:absolute; left:${px(7)}; ${P ? `bottom:${px(31)}` : `bottom:${px(5)}`}; display:flex; align-items:baseline; gap:${px(2)};
        background:rgba(11,30,66,.86); border-left:${px(1)} solid var(--red); padding:${px(1.6)} ${px(3)}; }
      .chip-num { font-family:Montserrat; font-weight:800; font-size:${px(P ? 4.4 : 3.2)}; color:var(--red); }
      .chip-cz { font-family:Montserrat; font-weight:800; font-size:${px(P ? 4.4 : 3.2)}; text-transform:uppercase; }
      .chip-en { font-size:${px(P ? 3.4 : 2.5)}; opacity:.75; }

      /* нижняя плашка «Tým ČR» */
      #lt-cz .lt { position:absolute; left:${px(7)}; ${P ? `bottom:${px(44)}` : `bottom:${px(20)}`}; background:var(--ice); color:var(--navy); padding:${px(1.6)} ${px(3)};
        font-family:Montserrat; font-weight:800; font-size:${px(P ? 5.4 : 4)}; letter-spacing:.04em; }

      /* жеребьёвка */
      #draw-cam { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; padding:0 ${px(6)} ${P ? '0' : px(14)}; perspective:${px(200)}; }
      .d-title { font-family:Montserrat; font-weight:800; font-size:${px(P ? 9 : 6.4)}; margin-bottom:${px(1)}; }
      .d-title .en { font-size:.45em; opacity:.7; font-weight:600; margin-left:.4em; }
      .d-note { color:var(--red); font-weight:600; font-size:${px(P ? 3.2 : 2.3)}; letter-spacing:.1em; text-transform:uppercase; margin-bottom:${px(3)}; }
      #draw-table { transform-origin:50% 0%; }
      .tr { display:grid; grid-template-columns:${P ? '1.7fr 1fr 1fr 1fr' : '2.2fr 1fr 1fr 1fr'}; align-items:center; background:rgba(238,242,249,.06); margin-bottom:${px(0.8)}; border-left:${px(0.8)} solid var(--blue); }
      .tr.th { background:var(--blue); border-left-color:var(--red); }
      .td { padding:${px(1.8)} ${px(2)}; font-size:${px(P ? 3.8 : 2.8)}; font-weight:600; }
      .th .td { font-family:Montserrat; font-weight:800; text-transform:uppercase; font-size:${px(P ? 2.6 : 2.3)}; letter-spacing:.04em; white-space:nowrap; }

      /* «боевой» мем */
      #vtip-cap .cap { position:absolute; left:${px(7)}; right:${px(7)}; ${P ? `bottom:${px(44)}` : `bottom:${px(18)}`}; font-family:Montserrat; font-weight:800; font-size:${px(P ? 7 : 5)}; line-height:1.05; }
      #vtip-cap .cap .en { display:block; font-family:'Source Sans 3'; font-weight:600; font-size:.5em; opacity:.85; margin-top:${px(1.2)}; }

      /* финал */
      #outro .o-wrap { position:absolute; left:${px(7)}; right:${px(7)}; ${P ? `top:${px(86)}` : `bottom:${px(22)}`}; display:flex; flex-direction:column; align-items:center; text-align:center; gap:${px(1.6)}; }
      .o-quote { font-family:Montserrat; font-weight:800; font-size:${px(P ? 5.6 : 3.8)}; line-height:1.1; }
      .o-quote .red { color:var(--red); }
      .o-meta { font-family:Montserrat; font-weight:600; font-size:${px(P ? 3.4 : 2.4)}; letter-spacing:.16em; text-transform:uppercase; opacity:.85; }


      /* ---- виджет-проигрыватель ---- */
      #player { position:absolute; right:${f(CM)}; bottom:${f(CB)}; width:${f(CW)}; height:${f(CH)}; }
      #card { position:absolute; inset:0; border-radius:${f(CH * 0.22)}; background:linear-gradient(135deg, rgba(48,66,133,.92), rgba(11,30,66,.94));
        box-shadow:0 ${px(1.2)} ${px(4)} rgba(0,0,0,.45), inset 0 0 0 ${px(0.15)} rgba(238,242,249,.18); }
      #vinyl-wrap { position:absolute; left:${f(VL)}; top:${f(VT)}; width:${f(VD)}; height:${f(VD)}; }
      #vinyl { position:absolute; inset:0; border-radius:50%;
        background:repeating-radial-gradient(circle at 50% 50%, #0d0d10 0 ${f(VD * 0.006)}, #1c1c22 ${f(VD * 0.006)} ${f(VD * 0.011)});
        box-shadow:0 ${px(0.8)} ${px(2.2)} rgba(0,0,0,.6); }
      #vinyl img { position:absolute; left:30%; top:30%; width:40%; height:40%; border-radius:50%; }
      #vinyl .hole { position:absolute; left:48.6%; top:48.6%; width:2.8%; height:2.8%; border-radius:50%; background:#c9ced8; }
      #sheen { position:absolute; inset:0; border-radius:50%; pointer-events:none;
        background:conic-gradient(from 20deg, transparent 0 8%, rgba(255,255,255,.16) 12%, transparent 18% 52%, rgba(255,255,255,.12) 60%, transparent 66%);
        -webkit-mask-image:radial-gradient(circle, transparent 0 20%, #000 21%); }
      #arm { position:absolute; left:${f(VL + VD * 0.97)}; top:${f(VT + VD * 0.04)}; width:0; height:0; }
      #arm svg { position:absolute; left:${f(-VD * 0.5)}; top:${f(-VD * 0.12)}; overflow:visible; }
      #p-text { position:absolute; left:${f(VL + VD + 3.2 * u)}; right:${f(2.4 * u)}; top:${f(CH * 0.17)}; bottom:${f(CH * 0.14)}; display:flex; flex-direction:column; justify-content:space-between; }
      .p-title { font-family:Montserrat; font-weight:800; font-size:${px(P ? 3.4 : 2.3)}; line-height:1.1; white-space:nowrap; }
      .p-artist { font-size:${px(P ? 2.6 : 1.75)}; font-weight:600; opacity:.72; white-space:nowrap; }
      .p-row { display:flex; align-items:center; gap:${px(1.2)}; font-size:${px(P ? 2.2 : 1.5)}; font-weight:600; opacity:.9; }
      .p-bar { position:relative; flex:1; height:${px(0.5)}; background:rgba(238,242,249,.22); border-radius:${px(0.5)}; overflow:hidden; }
      #p-fill { position:absolute; inset:0; background:var(--red); transform-origin:left center; }
      #p-eq { display:flex; align-items:flex-end; gap:${px(0.4)}; height:${px(P ? 2.2 : 1.5)}; }
      #p-eq i { display:block; width:${px(0.55)}; height:100%; background:var(--ice); transform-origin:bottom center; }
      .nw { white-space:nowrap; }
      #wipe { position:absolute; inset:0; background:var(--red); }
      #wipe-holder { position:absolute; inset:0; overflow:hidden; pointer-events:none; }
      #proto-badge { position:absolute; right:${px(3)}; top:${px(3)}; font-family:Montserrat; font-weight:600; font-size:${px(2)}; letter-spacing:.2em; opacity:.45; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-width="${W}" data-height="${H}" data-duration="${DUR}" data-fps="30">
      <div id="bg"><div id="stripes"></div></div>

      ${shotsHtml}

      <section id="draw" class="clip" data-start="${at(s(22))}" data-duration="${len(s(22), s(25))}" data-track-index="2">
        <div id="draw-cam">
          <div class="d-title">LOSOVÁNÍ<span class="en">The draw</span></div>
          <div class="d-note">ryba · data z losování doplnit</div>
          <div id="draw-table">
            <div class="tr th"><span class="td">Závodník</span><span class="td">Kolo 1</span><span class="td">Kolo 2</span><span class="td">Kolo 3</span></div>${drawRows}
          </div>
        </div>
      </section>

      <div id="three-wrap"><canvas id="three-layer"></canvas></div>

      <section id="title-clip" class="clip" data-start="${at(s(2))}" data-duration="${len(s(2), s(5))}" data-track-index="3">
        <div class="t-wrap">
          <div id="t-main" class="t-main">H-BATTLE <span class="red">2026</span></div>
          <div id="t-sub" class="t-sub"><span class="nw">Hofer Lake · Pružina (SK)</span></div>
          <div id="t-date" class="t-sub">2.–4. 10. 2026</div>
        </div>
      </section>

      <section id="kin" class="clip" data-start="${at(s(16))}" data-duration="${len(s(16), s(18))}" data-track-index="3">
        <div id="kin-cam">
          <div class="k-line">${words1.map((w, i) => `<span class="k-mask"><span id="k1w${i}" class="k-word">${w}</span></span>`).join('')}</div>
          <div id="k-l2" class="k-line">${words2.map((w, i) => `<span class="k-mask"><span id="k2w${i}" class="k-word${i === 3 ? ' red' : ''}">${w}</span></span>`).join('')}</div>
          <div id="k-under"></div>
          <div id="k-en">We didn’t come to fight. We came for friends.</div>
        </div>
      </section>

      ${chipsHtml}

      <section id="lt-cz" class="clip" data-start="${at(s(18, 1))}" data-duration="${len(s(18, 1), s(19))}" data-track-index="5">
        <div id="lt-box" class="lt">TÝM ČESKÁ REPUBLIKA</div>
      </section>

      <section id="vtip-cap" class="clip" data-start="${at(s(25, 1))}" data-duration="${len(s(25, 1), s(26))}" data-track-index="5">
        <div id="vtip-text" class="cap">Takhle vypadá náš „boj“.<span class="en">This is what our “battle” looks like.</span></div>
      </section>

      <section id="outro" class="clip" data-start="${at(s(29))}" data-duration="${len(at(s(29)), DUR)}" data-track-index="3">
        <div class="o-wrap">
          <div id="o-quote" class="o-quote">Nepřijeli jsme bojovat. <span class="red">Přijeli jsme za přáteli.</span></div>
          <div id="o-meta" class="o-meta">Pružina (SK) · <span class="nw">2.–4. 10. 2026</span></div>
        </div>
      </section>


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
          <div class="p-title">H-BATTLE 2026</div>
          <div class="p-artist">začátek · Trout Area CZ</div>
          <div class="p-row"><div id="p-eq"><i></i><i></i><i></i><i></i><i></i></div><span id="p-time">0:00</span><div class="p-bar"><div id="p-fill"></div></div><span>${Math.floor(SONG / 60)}:${String(Math.round(SONG % 60)).padStart(2, "0")}</span></div>
        </div>
      </div>
      <div id="flash"></div>
      <div id="wipe-holder"><div id="wipe"></div></div>
      <div id="proto-badge">RYBA · v2 · Suno</div>

      <audio id="bgm" src="assets/track_edit60.wav" data-start="${T0}" data-duration="${SONG}" data-track-index="9" data-volume="1"></audio>
    </div>

    <script>
      const tl = gsap.timeline({ paused: true });
      // фон: полосы дрейфуют весь ролик
      tl.fromTo("#stripes", { xPercent: -3 }, { xPercent: 3, duration: ${DUR}, ease: "none" }, 0);
      // 3D-слой виден в интро и в финале
      tl.fromTo("#three-wrap", { opacity: 1 }, { opacity: 0, duration: 0.25 }, ${at(s(5) - 0.25)});
      tl.to("#three-wrap", { opacity: 1, duration: 0.3 }, ${at(s(29) - 0.15)});
      // титул
      tl.fromTo("#t-main", { opacity: 0, y: ${Math.round(3 * u)} }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, ${at(s(2))});
      tl.fromTo("#t-sub", { opacity: 0, scaleX: 1.15 }, { opacity: 0.85, scaleX: 1, duration: 0.8, ease: "power2.out" }, ${at(s(2, 2))});
      tl.fromTo("#t-date", { opacity: 0, y: ${Math.round(2 * u)} }, { opacity: 0.85, y: 0, duration: 0.5, ease: "power2.out" }, ${at(s(3))});
      ${kin}
      ${shotTweens}
      // плашки сцен: въезд на сильную долю
      ${SCENES.map(([st, , id]) => `tl.fromTo("#chip-${id} .chip", {xPercent:-120}, {xPercent:0, duration:0.4, ease:"power3.out"}, ${at(st + BEAT)});`).join('\n      ')}
      tl.fromTo("#lt-box", { xPercent: -110 }, { xPercent: 0, duration: 0.35, ease: "power3.out" }, ${at(s(18, 1))});
      tl.fromTo("#vtip-text", { opacity: 0, y: ${Math.round(3 * u)} }, { opacity: 1, y: 0, duration: 0.3, ease: "back.out(2)" }, ${at(s(25, 1))});
      // жеребьёвка: камера + строки на доли
      tl.fromTo("#draw-cam", { scale: 1.0 }, { scale: 1.07, duration: ${len(s(22), s(25))}, ease: "none" }, ${at(s(22))});
      tl.fromTo("#draw-table", { rotationX: 18 }, { rotationX: 4, duration: ${len(s(22), s(25))}, ease: "power1.out" }, ${at(s(22))});
      ${DRAW_ROWS.map((_, i) => `tl.fromTo("#dr${i}", {xPercent:-104, opacity:0}, {xPercent:0, opacity:1, duration:0.3, ease:"power3.out"}, ${at(s(22, 2 + i))});`).join('\n      ')}
      // финал
      tl.fromTo("#o-quote", { opacity: 0, y: ${Math.round(3 * u)} }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, ${at(s(29, 2))});
      tl.fromTo("#o-meta", { opacity: 0 }, { opacity: 0.85, duration: 0.6 }, ${at(s(30))});
      ${wipes}

      // ---- проигрыватель: старт в центре, рука опускает иглу в T0, виджет уезжает в угол ----
      tl.fromTo("#player", { x: ${dockX.toFixed(1)}, y: ${dockY.toFixed(1)}, scale: ${HERO}, opacity: 0 }, { x: ${dockX.toFixed(1)}, y: ${dockY.toFixed(1)}, scale: ${HERO}, opacity: 1, duration: 0.3, ease: "power1.out" }, 0);
      tl.to("#player", { x: 0, y: 0, scale: 1, duration: 0.8, ease: "power3.inOut" }, ${at(0.45)});
      tl.fromTo("#arm", { rotation: -20 }, { rotation: 0, duration: 0.75, ease: "power2.inOut" }, 0.3);
      tl.fromTo("#arm svg", { scale: 1.06 }, { scale: 1, duration: 0.15, ease: "power2.in" }, ${(T0 - 0.15).toFixed(2)});
      tl.to("#arm", { rotation: 9, duration: ${(SONG - 0.2).toFixed(2)}, ease: "none" }, ${at(0)});
      tl.to("#arm", { rotation: -20, duration: 0.7, ease: "power2.inOut" }, ${(DUR - 0.9).toFixed(2)});
      // 33⅓ об/мин = 200°/с; разгон 0.6 с от иглы
      tl.fromTo("#vinyl", { rotation: 0 }, { rotation: 60, duration: 0.6, ease: "power1.in" }, ${at(-0.1)});
      tl.to("#vinyl", { rotation: ${(60 + 200 * (SONG - 0.5)).toFixed(0)}, duration: ${(SONG - 0.5).toFixed(2)}, ease: "none" }, ${at(0.5)});
      tl.to("#vinyl", { rotation: ${(60 + 200 * (SONG - 0.5) + 70).toFixed(0)}, duration: 0.6, ease: "power2.out" }, ${(T0 + SONG).toFixed(2)});
      tl.fromTo("#p-fill", { scaleX: 0 }, { scaleX: 1, duration: ${SONG}, ease: "none" }, ${T0});
      // время и эквалайзер — от позиции плейхеда (seek-safe)
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
      renderer.setSize(W, H, false);
      renderer.setPixelRatio(1);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(PORTRAIT ? 50 : 32, W / H, 0.1, 200);

      const loader = new THREE.TextureLoader();
      function disc(src, edge) {
        const tex = loader.load(src);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        tex.center.set(0.5, 0.5);
        tex.rotation = Math.PI / 2; // UV крышки цилиндра повёрнуты на 90°
        const geo = new THREE.CylinderGeometry(1, 1, 0.14, 160, 1, false);
        geo.rotateX(Math.PI / 2); // крышка смотрит в камеру (+Z)
        const side = new THREE.MeshStandardMaterial({ color: edge, metalness: 0.75, roughness: 0.3 });
        // цвета логотипа держит emissive (без пересвета), блик даёт key-свет поверх
        const face = new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: 0.82, color: 0x2a2a2a, metalness: 0.15, roughness: 0.35 });
        const back = new THREE.MeshStandardMaterial({ color: 0x0b1e42, metalness: 0.4, roughness: 0.5 });
        const m = new THREE.Mesh(geo, [side, face, back]);
        scene.add(m);
        return m;
      }
      const hb = disc("assets/H-BATTLE.png", 0x304285);
      const ta = disc("assets/logo-TACR2-ready.png", 0x0b1e42);

      scene.add(new THREE.HemisphereLight(0xffffff, 0x0b1e42, 0.5));
      const key = new THREE.DirectionalLight(0xffffff, 1.1);
      scene.add(key);
      const rim = new THREE.PointLight(0xe31e24, 0, 12);
      scene.add(rim);

      const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
      const eo = (x) => 1 - Math.pow(1 - clamp(x), 3);
      const lerp = (a, b, t) => a + (b - a) * t;

      const T0 = ${T0}, OUT0 = ${s(29)};
      function renderAt(tt) {
        const t = tt - T0; // время от опускания иглы
        camera.position.set(Math.sin(t * 0.15) * 0.25, 0, 6.2 - Math.min(t, 10) * 0.04);
        camera.lookAt(0, 0, 0);

        // H-BATTLE: интро 0–10 с, финал 52–60 с
        if (t > 0 && t < ${s(5) + 0.1}) {
          const a = eo(t / 2.2);
          const lift = 0;
          hb.visible = true;
          hb.position.set(0, lerp(PORTRAIT ? 0.7 : 0.35, PORTRAIT ? 2.5 : 1.3, lift), lerp(-28, 0, a));
          hb.rotation.set(Math.sin(t * 0.9) * 0.06, lerp(-2.6, 0, eo(t / 2.6)) + Math.sin(t * 0.7) * 0.08, 0);
          hb.scale.setScalar(lerp(PORTRAIT ? 0.8 : 0.62, PORTRAIT ? 0.42 : 0.34, lift));
          ta.visible = false;
          key.position.set(lerp(-6, 6, clamp((t - 1.4) / 1.6)), 2, 4);
          rim.intensity = 0;
        } else if (t >= OUT0 - 0.15) {
          const lt = t - OUT0;
          const a = eo(lt / 1.4);
          const gap = PORTRAIT ? 1.25 : 1.35;
          hb.visible = ta.visible = true;
          const sc = PORTRAIT ? 0.55 : 0.58;
          ta.scale.setScalar(sc); hb.scale.setScalar(sc);
          if (PORTRAIT) {
            ta.position.set(lerp(-6, -0.72, a), 0.9, 0);
            hb.position.set(lerp(6, 0.72, a), 0.9, 0);
          } else {
            ta.position.set(lerp(-7, -0.8, a), 0.5, 0);
            hb.position.set(lerp(7, 0.8, a), 0.5, 0);
          }
          ta.rotation.set(0, lerp(2.2, 0, eo(lt / 1.8)) + Math.sin(lt * 0.8) * 0.06, 0);
          hb.rotation.set(0, lerp(-2.2, 0, eo(lt / 1.8)) - Math.sin(lt * 0.8) * 0.06, 0);
          key.position.set(lerp(-6, 6, clamp((lt - 2.2) / 1.6)), 2, 4);
          rim.position.set(0, -2, 2.5);
          rim.intensity = 6 * clamp((lt - 1) / 1);
          camera.position.set(Math.sin(lt * 0.2) * 0.2, 0, 6.6 - lt * 0.08);
          camera.lookAt(0, PORTRAIT ? 0 : 0.4, 0);
        } else {
          hb.visible = ta.visible = false;
        }
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
