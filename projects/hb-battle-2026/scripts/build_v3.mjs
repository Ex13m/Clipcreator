// HB2026 v3: живые кадры в сцене «под Дали» (пустыня, тающие рамки, длинные тени, ходули), монтаж по треку Suno.
// Фото не деформируются: «тают» только рамки (капли под рамкой), лица целые. Логотипы — оригиналы PNG, тексты — шрифтом.
// python3 scripts/edit_track.py && node scripts/build_v3.mjs  ->  proto/9x16/index.html, proto/16x9/index.html
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROTO = path.join(ROOT, 'proto');
const FONTS = fs.readFileSync(path.join(PROTO, 'assets/fonts.css'), 'utf8');
const G = JSON.parse(fs.readFileSync(path.join(ROOT, '03_MUSIC/Trout_Area_edit60.grid.json'), 'utf8'));

// T0 — игла касается пластинки, стартует трек. Сценарий задан в тактах смонтированного трека.
const T0 = 1.2, SONG = G.duration, DUR = +(T0 + SONG + 0.6).toFixed(2);
const at = (x) => +(x + T0).toFixed(3);
const s = (bar, k = 0) => { const i = G.beats.findIndex((t) => Math.abs(t - G.downbeats[bar - 1]) < 0.06); return G.beats[i + k]; };
const len = (a, b) => +(b - a).toFixed(3);

// размеры web-копий фото (пишет шаг подготовки фото)
const IMG = JSON.parse(fs.readFileSync(path.join(PROTO, 'assets/photos.json'), 'utf8'));

const SCENES = [
  [s(5), s(9), 'prijezd', 'Příjezd', 'Arrival'],
  [s(9), s(16), 'trenink', 'Den 1 · trénink', 'Day 1 · practice'],
  [s(18), s(20), 'prezentace', 'Prezentace týmů', 'Team presentation'],
  [s(20), s(22), 'zahajeni', 'Zahájení', 'Opening ceremony'],
  [s(22), s(25), 'losovani', 'Losování', 'The draw'],
  [s(25), s(26), 'vtip', 'Zákulisí', 'Backstage'],
  [s(26), s(29), 'pratele', 'Přátelé', 'Friends'],
];

// Шот: [№, начало, конец, сцена, фото, тип сцены, движение камеры, {crop:[size%, x%, y%], aspect}]
// типы: enter (рамка в пустыне → въезд в кадр), easel (мольберт), tree (рамка на ветке), stilts (рамка на ногах-ходулях), full (почти во весь кадр), card (карточка «Přátelé»)
const SH = (n, a, b, sc, img, kind, mv, o = {}) => ({ n, a, b, d: len(a, b), sc, img, kind, mv, ...o });
const MONT = ['g_team_moldova', 'g_team_germany', 'g_team_slovakia', 'g_team_bulgaria', 'g_team_hungary', 'g_team_poland',
  'g_team_belgium', 'p_team_romania', 'p_selfie_lake', 'p_ceremony_hall', 'p_cheers', 'g_event_banner'];
const MONT_MV = ['push', 'pull', 'push', 'pull', 'push', 'pull', 'push', 'pull', 'push', 'pull', 'push', 'pull'];
const SHOTS = [
  // příjezd: машина «на ходулях» → озеро-картина, въезд внутрь
  SH(1, s(5), s(7), 'prijezd', 'p_car', 'stilts', 'panR'),
  SH(2, s(7), s(9), 'prijezd', 'p_lake_mist', 'enter', 'push'),
  // trénink: по такту, к концу — по полтакта (разгон перед брейком)
  SH(3, s(9), s(10), 'trenink', 'p_trenink_gear', 'easel', 'panL'),
  SH(4, s(10), s(11), 'trenink', 'p_tying_young', 'tree', 'push'),
  SH(5, s(11), s(12), 'trenink', 'p_training_plan', 'full', 'tilt'),
  SH(6, s(12), s(13), 'trenink', 'p_tying_ms', 'easel', 'pull'),
  SH(7, s(13), s(14), 'trenink', 'p_reeling', 'stilts', 'panR'),
  SH(8, s(14), s(15), 'trenink', 'p_landing1', 'full', 'push'),
  SH(9, s(15), s(15, 2), 'trenink', 'p_landing2', 'card', 'push', { tilt: -2 }),
  SH(10, s(15, 2), s(16), 'trenink', 'p_net_close', 'card', 'pull', { tilt: 2 }),
  // prezentace
  SH(11, s(18), s(19), 'prezentace', 'p_stage_cz', 'full', 'push', { flag: true }),
  SH(12, s(19), s(20), 'prezentace', 'p_portrait_dres', 'easel', 'pull'),
  // zahájení
  SH(13, s(20), s(21), 'zahajeni', 'p_ceremony_hall', 'full', 'push'),
  SH(14, s(21), s(21, 2), 'zahajeni', 'g_event_banner', 'easel', 'tilt'),
  SH(15, s(21, 2), s(22), 'zahajeni', 'p_trophies', 'easel', 'pull'),
  // zákulisí: «boj» = guláš
  SH(16, s(25), s(26), 'vtip', 'p_lunch', 'tree', 'whip', { stache: true }),
  // přátelé: 12 кадров по доле
  ...MONT.map((img, k) => SH(17 + k, s(26, k), s(26, k + 1), 'pratele', img, 'card', MONT_MV[k], { tilt: k % 2 ? 3 : -3 })),
];

// детерминированный «рандом» для капель
const rnd = (seed) => { let x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); };

function build(W, H, file) {
  const P = H > W, u = Math.min(W, H) / 100;
  const px = (n) => `${Math.round(n * u)}px`;
  const f = (n) => n.toFixed(1) + 'px';
  const HZ = P ? 0.63 : 0.68; // линия горизонта (доля высоты)
  const sceneName = Object.fromEntries(SCENES.map((x) => [x[2], x]));

  // --- виджет-проигрыватель ---
  const CW = (P ? 60 : 44) * u, CH = (P ? 17 : 11.5) * u, CM = (P ? 5 : 3.5) * u, CB = (P ? 10 : 3.5) * u;
  const VD = CH * 1.32, VL = 1.6 * u, VT = (CH - VD) / 2, HERO = P ? 1.45 : 1.75;
  const dockX = W / 2 - (W - CM - CW / 2), dockY = H / 2 - (H - CB - CH / 2);

  // --- геометрия рамки для шота ---
  function frameBox(sh) {
    const [iw, ih] = IMG[sh.img];
    const ar = sh.aspect || iw / ih;
    let fw, fh;
    if (sh.kind === 'full') { fw = W - (P ? 8 : 14) * u; fh = fw / ar; if (fh > H * (P ? 0.5 : 0.72)) { fh = H * (P ? 0.5 : 0.72); fw = fh * ar; } }
    else if (sh.kind === 'card') { fh = P ? (ar < 1 ? 62 : 44) * u : 64 * u; fw = fh * ar; if (fw > W * (P ? 0.86 : 0.62)) { fw = W * (P ? 0.86 : 0.62); fh = fw / ar; } }
    else { fw = P ? (ar < 1 ? 58 : 80) * u : (ar < 1 ? 42 : 96) * u; fh = fw / ar; if (fh > (P ? 64 : 58) * u) { fh = (P ? 64 : 58) * u; fw = fh * ar; } }
    if (sh.kind === 'enter') { fw *= 0.7; fh *= 0.7; }
    if (sh.kind === 'stilts') { const k = P ? 0.8 : 0.62; fw *= k; fh *= k; }
    const cx = W / 2 + (sh.kind === 'tree' ? (P ? 4 : 10) * u : 0);
    const bottom = sh.kind === 'stilts' ? H * HZ - (P ? 16 : 12) * u : sh.kind === 'full' || sh.kind === 'card' ? H * (P ? 0.46 : 0.5) + fh / 2 : H * HZ + (P ? 3 : 2) * u;
    return { fw, fh, x: cx - fw / 2, y: bottom - fh };
  }

  const photoDiv = (sh, fw, fh) => {
    const bg = `url(assets/photos/${sh.img}.jpg)`;
    const pos = sh.crop ? `background-size:${sh.crop[0]}% auto; background-position:${sh.crop[1]}% ${sh.crop[2]}%;` : 'background-size:cover; background-position:50% 50%;';
    return `<div class="photo" style="width:${f(fw)}; height:${f(fh)}; background-image:${bg}; ${pos}"></div>`;
  };
  // капли «тающей» рамки — под нижней кромкой, фото не задевают
  const drips = (sh, fw) => {
    const n = 4, h = (P ? 9 : 8) * u, out = [];
    for (let i = 0; i < n; i++) {
      const x = fw * (0.12 + 0.76 * rnd(sh.n * 7 + i)), w = (1.6 + 1.8 * rnd(sh.n * 3 + i)) * u, d = h * (0.45 + 0.55 * rnd(sh.n * 5 + i));
      out.push(`<path d="M ${(x - w).toFixed(1)} 0 C ${(x - w).toFixed(1)} ${(d * 0.5).toFixed(1)} ${(x - w * 0.35).toFixed(1)} ${(d * 0.55).toFixed(1)} ${(x - w * 0.3).toFixed(1)} ${(d * 0.85).toFixed(1)} A ${(w * 0.3).toFixed(1)} ${(w * 0.3).toFixed(1)} 0 0 0 ${(x + w * 0.3).toFixed(1)} ${(d * 0.85).toFixed(1)} C ${(x + w * 0.35).toFixed(1)} ${(d * 0.55).toFixed(1)} ${(x + w).toFixed(1)} ${(d * 0.5).toFixed(1)} ${(x + w).toFixed(1)} 0 Z" fill="#eef2f9"/>`);
    }
    return `<svg class="drips" width="${f(fw)}" height="${f(h)}" viewBox="0 0 ${fw.toFixed(1)} ${h.toFixed(1)}">${out.join('')}</svg>`;
  };
  const deadTree = (x, y, sc) => `<svg class="prop" style="left:${f(x)}; top:${f(y)}" width="${f(260 * sc)}" height="${f(420 * sc)}" viewBox="0 0 260 420" fill="none" stroke="#2b1d12" stroke-linecap="round">
      <path d="M40 420 C 46 330 30 250 52 160" stroke-width="16"/><path d="M50 190 C 110 160 180 150 250 166" stroke-width="9"/><path d="M46 230 C 20 200 6 170 -6 130" stroke-width="7"/></svg>`;
  const stache = (x, y, sc) => `<svg class="prop" style="left:${f(x)}; top:${f(y)}" width="${f(300 * sc)}" height="${f(120 * sc)}" viewBox="-150 -60 300 120">
      <path d="M -110 0 C -60 -30 60 -30 100 -4 L 132 -26 L 124 2 L 136 28 L 100 6 C 60 30 -60 28 -110 0 Z" fill="#8aa0cf" stroke="#0b1e42" stroke-width="3"/>
      <path d="M -96 4 C -50 12 40 12 96 4" stroke="#e31e24" stroke-width="7" fill="none"/>
      <circle cx="-86" cy="-6" r="5" fill="#0b1e42"/>
      <path d="M -112 6 C -124 0 -128 -16 -116 -36 M -112 6 C -96 6 -88 -8 -82 -38" stroke="#0b1e42" stroke-width="4.5" fill="none" stroke-linecap="round"/></svg>`;
  const czFlag = (x, y, sc) => `<svg class="prop" style="left:${f(x)}; top:${f(y)}" width="${f(150 * sc)}" height="${f(320 * sc)}" viewBox="0 0 150 320">
      <path d="M8 0 V 320" stroke="#2b1d12" stroke-width="6"/>
      <clipPath id="fl${sc.toFixed(2).replace('.', '')}"><path d="M8 10 H 140 C 146 50 118 80 108 130 C 100 170 70 112 46 100 C 30 94 16 102 8 98 Z"/></clipPath>
      <g clip-path="url(#fl${sc.toFixed(2).replace('.', '')})"><rect x="8" y="10" width="140" height="44" fill="#fff"/><rect x="8" y="54" width="140" height="90" fill="#d7141a"/><path d="M8 10 L 74 54 L 8 98 Z" fill="#11457e"/></g></svg>`;

  const shotHtml = (sh) => {
    const id = `sh${String(sh.n).padStart(2, '0')}`;
    const b = frameBox(sh);
    const shadowW = b.fw * 1.5, shadowY = sh.kind === 'stilts' ? H * HZ + 1 * u : b.y + b.fh + 0.5 * u;
    let props = '';
    if (sh.kind === 'tree') props += deadTree(b.x - (P ? 30 : 34) * u, b.y - (P ? 22 : 20) * u, P ? 1.25 : 1.15);
    if (sh.flag) props += czFlag(W - (P ? 30 : 26) * u, H * HZ - (P ? 50 : 52) * u, P ? 1.3 : 1.25);
    if (sh.stache) props += stache(W - (P ? 44 : 40) * u, b.y + b.fh + (P ? 2 : -14) * u, P ? 1.3 : 1.1);
    const legs = sh.kind === 'stilts' ? [0.12, 0.36, 0.64, 0.88].map((k, i) =>
      `<div class="leg leg${i % 2}" style="left:${f(b.x + b.fw * k)}; top:${f(b.y + b.fh - 0.5 * u)}; height:${f(H * HZ + 1 * u - (b.y + b.fh))}"></div>`).join('') : '';
    const easel = sh.kind === 'easel' || sh.kind === 'enter' ? `<div class="easel" style="left:${f(b.x + b.fw * 0.2)}; top:${f(b.y + b.fh * 0.6)}; height:${f(b.fh * 0.4 + 3 * u)}"></div><div class="easel" style="left:${f(b.x + b.fw * 0.8)}; top:${f(b.y + b.fh * 0.6)}; height:${f(b.fh * 0.4 + 3 * u)}"></div>` : '';
    const tilt = sh.tilt ?? (sh.kind === 'tree' ? -3 : 0);
    return `
      <section id="${id}" class="clip shot k-${sh.kind}" data-start="${at(sh.a)}" data-duration="${sh.d}" data-track-index="2">
        <div class="layer l-sky"><div class="sky"></div><div class="sun"></div><div class="speed"></div></div>
        <div class="layer l-ground"><div class="sand" style="top:${(HZ * 100).toFixed(1)}%"></div><div class="cliffs" style="top:${(HZ * 100 - 3).toFixed(1)}%"></div>
          <div class="shadow" style="left:${f(b.x + b.fw * 0.3)}; top:${f(shadowY)}; width:${f(shadowW)}; height:${f(2.6 * u)}"></div></div>
        <div class="layer l-frame">${easel}${legs}
          <div class="frame" style="left:${f(b.x)}; top:${f(b.y)}; width:${f(b.fw)}; height:${f(b.fh)};${tilt ? ` rotate:${tilt}deg;` : ''}">
            ${photoDiv(sh, b.fw, b.fh)}<div class="drip-wrap">${drips(sh, b.fw)}</div>
          </div></div>
        <div class="layer l-fg">${props}</div>
      </section>`;
  };

  // --- камера: слои с разной глубиной ---
  const DEPTH = { 'l-sky': 0.2, 'l-ground': 0.45, 'l-frame': 0.85, 'l-fg': 1.3 };
  const shotTweens = SHOTS.map((sh) => {
    const id = `#sh${String(sh.n).padStart(2, '0')}`, st = at(sh.a), d = sh.d, out = [];
    const L = (ly, from, to) => out.push(`tl.fromTo("${id} .${ly}", ${JSON.stringify(from)}, ${JSON.stringify({ ...to, duration: d, ease: 'none' })}, ${st});`);
    for (const [ly, dz] of Object.entries(DEPTH)) {
      if (sh.kind === 'enter') {
        // рамка в пустыне -> въезд внутрь кадра (кадр заполняет экран)
        const b = frameBox(sh), fill = Math.max(W / b.fw, H / b.fh) * 1.04;
        const cy = H / 2 - (b.y + b.fh / 2);
        if (ly === 'l-frame') { out.push(`tl.fromTo("${id} .l-frame", {scale:1, y:0}, {scale:1.08, y:0, duration:${(d * 0.55).toFixed(3)}, ease:"none"}, ${st});`);
          out.push(`tl.to("${id} .l-frame", {scale:${fill.toFixed(3)}, y:${cy.toFixed(1)}, duration:${(d * 0.45).toFixed(3)}, ease:"power2.in"}, ${(st + d * 0.55).toFixed(3)});`); }
        else L(ly, { scale: 1 }, { scale: 1 + 0.1 * dz });
        continue;
      }
      if (sh.mv === 'push') L(ly, { scale: 1.02 }, { scale: 1.02 + 0.09 * dz });
      if (sh.mv === 'pull') L(ly, { scale: 1.02 + 0.1 * dz }, { scale: 1.02 });
      if (sh.mv === 'panR') L(ly, { scale: 1.1, xPercent: -3.5 * dz }, { scale: 1.1, xPercent: 3.5 * dz });
      if (sh.mv === 'panL') L(ly, { scale: 1.1, xPercent: 3.5 * dz }, { scale: 1.1, xPercent: -3.5 * dz });
      if (sh.mv === 'tilt') L(ly, { scale: 1.1, yPercent: 3 * dz }, { scale: 1.1, yPercent: -3 * dz });
      if (sh.mv === 'whip') {
        out.push(`tl.fromTo("${id} .${ly}", {scale:${(1.5 + dz * 0.3).toFixed(2)}, xPercent:${(-26 * dz).toFixed(1)}}, {scale:1.04, xPercent:0, duration:0.4, ease:"expo.out"}, ${st});`);
        out.push(`tl.to("${id} .${ly}", {scale:${(1.04 + 0.05 * dz).toFixed(3)}, duration:${(d - 0.4).toFixed(3)}, ease:"none"}, ${(st + 0.4).toFixed(3)});`);
      }
    }
    // «таяние»: капли растут весь шот; карточки Přátelé падают в кадр
    out.push(`tl.fromTo("${id} .drips", {scaleY:0.25}, {scaleY:1, duration:${d}, ease:"power1.in"}, ${st});`);
    if (sh.kind === 'card') out.push(`tl.fromTo("${id} .frame", {yPercent:-18, opacity:0}, {yPercent:0, opacity:1, duration:0.18, ease:"back.out(2)"}, ${st});`);
    if (sh.kind === 'stilts') out.push(`tl.fromTo("${id} .leg0", {rotation:-4}, {rotation:4, duration:${(d / 2).toFixed(3)}, ease:"sine.inOut", repeat:1, yoyo:true}, ${st});`,
      `tl.fromTo("${id} .leg1", {rotation:4}, {rotation:-4, duration:${(d / 2).toFixed(3)}, ease:"sine.inOut", repeat:1, yoyo:true}, ${st});`);
    return out.join('\n      ');
  }).join('\n      ');

  const chipsHtml = SCENES.map(([st, en, id, cz, eng], i) => `
      <section id="chip-${id}" class="clip chip-clip" data-start="${at(st)}" data-duration="${len(st, en)}" data-track-index="4">
        <div class="chip"><span class="chip-num">${String(i + 1).padStart(2, '0')}</span><span class="chip-cz">${cz}</span><span class="chip-en">${eng}</span></div>
      </section>`).join('');

  // переходы на стыках сцен
  const cuts = [s(5), s(9), s(18), s(20), s(22), s(25), s(26), s(29)];
  const wipes = cuts.map((t, i) => `tl.fromTo("#wipe", {xPercent:-101}, {xPercent:101, duration:0.5, ease:"power2.inOut"${i ? ', immediateRender:false' : ''}}, ${at(t - 0.25)});`).join('\n      ');

  // кинетика: брейк (такт 16) и пик (такт 17) — слова на каменных плитах в пустыне
  const words1 = ['Nepřijeli', 'jsme', 'bojovat,'], words2 = ['přijeli', 'jsme', 'za', 'přáteli.'];
  const kin = [
    ...words1.map((w, i) => `tl.fromTo("#k1w${i}", {yPercent:110}, {yPercent:0, duration:0.3, ease:"power3.out"}, ${at(s(16, i))});`),
    ...words2.map((w, i) => `tl.fromTo("#k2w${i}", {yPercent:110}, {yPercent:0, duration:0.22, ease:"expo.out"}, ${at(s(17) + i * 0.04)});`),
    `tl.fromTo("#k-l2", {scale:1.18}, {scale:1, duration:0.5, ease:"expo.out"}, ${at(s(17))});`,
    `tl.fromTo("#k-under", {scaleX:0}, {scaleX:1, duration:0.35, ease:"power2.out"}, ${at(s(17, 1))});`,
    `tl.fromTo("#k-en", {opacity:0, y:${Math.round(2 * u)}}, {opacity:1, y:0, duration:0.3, ease:"power2.out"}, ${at(s(17, 2))});`,
    `tl.fromTo("#kin-cam", {scale:1}, {scale:1.07, duration:${len(s(16), s(18))}, ease:"none"}, ${at(s(16))});`,
    `tl.fromTo("#flash", {opacity:0.85}, {opacity:0, duration:0.35, ease:"power2.out", immediateRender:false}, ${at(s(17))});`,
  ].join('\n      ');

  // жеребьёвка: официальная графика TA CZ, камера едет по 4 секторам
  const DRAW_AR = 3840 / 2300;
  const DW = P ? 170 * u : 118 * u, DH = DW / DRAW_AR, DPAN = P ? (DW - W) / 2 + 4 * u : 4 * u;

  // финал: фото победителей
  const WIN = { fw: P ? 80 * u : 54 * u * (1448 / 1086), fh: 0 };
  WIN.fh = WIN.fw / (1448 / 1086);
  const winTop = P ? 40 * u : 9 * u;

  const html = `<!doctype html>
<html lang="cs">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <title>H-BATTLE 2026 – začátek (${P ? '9:16' : '16:9'}) — v3</title>
    <script src="assets/gsap.min.js"></script>
    <style>
      ${FONTS}
      :root { --blue:#304285; --red:#e31e24; --navy:#0b1e42; --ice:#eef2f9; }
      body { margin:0; background:var(--navy); color:var(--ice); font-family:'Source Sans 3', sans-serif; }
      #root { position:relative; width:100%; height:100%; overflow:hidden; background:var(--navy); }
      .clip { position:absolute; inset:0; }
      .layer { position:absolute; inset:0; will-change:transform; }

      /* ---- сцена «под Дали» в палитре TA ---- */
      .sky { position:absolute; inset:${px(-8)}; background:linear-gradient(180deg, #0b1e42 0%, #304285 ${(HZ * 62).toFixed(0)}%, #c9b48c ${(HZ * 96).toFixed(0)}%, #f2d9a6 ${(HZ * 100).toFixed(0)}%); }
      .sun { position:absolute; left:50%; top:${(HZ * 100 - 14).toFixed(1)}%; width:${px(70)}; height:${px(70)}; margin-left:${px(-35)}; border-radius:50%;
        background:radial-gradient(circle, rgba(255,232,180,.55) 0%, rgba(255,232,180,0) 65%); }
      .speed { position:absolute; inset:${px(-8)}; opacity:.12; background:repeating-linear-gradient(180deg, transparent 0 ${px(1.8)}, #bfe0ff ${px(1.8)} ${px(2.2)});
        -webkit-mask-image:linear-gradient(180deg, #000 0, #000 ${(HZ * 70).toFixed(0)}%, transparent ${(HZ * 95).toFixed(0)}%); }
      .sand { position:absolute; left:${px(-10)}; right:${px(-10)}; bottom:${px(-10)}; background:linear-gradient(180deg, #d9b47a 0%, #a77c47 45%, #6e4a26 100%);
        border-radius:60% 40% 0 0 / ${px(2)} ${px(1.4)} 0 0; }
      .cliffs { position:absolute; right:${px(-4)}; width:${px(P ? 46 : 40)}; height:${px(4)}; background:#6f7f9e; opacity:.6; border-radius:70% 30% 0 0 / 100% 100% 0 0; }
      .shadow { position:absolute; border-radius:50%; background:radial-gradient(ellipse at 0% 50%, rgba(43,26,10,.55), rgba(43,26,10,0) 70%); }
      .frame { position:absolute; box-sizing:border-box; border:${px(0.9)} solid var(--ice); outline:${px(0.3)} solid var(--navy); box-shadow:${px(1.2)} ${px(1.6)} ${px(3)} rgba(0,0,0,.45); background:#111; }
      .photo { position:absolute; left:0; top:0; background-repeat:no-repeat; }
      .drip-wrap { position:absolute; left:${px(-0.9)}; top:100%; }
      .drips { display:block; transform-origin:top center; }
      .easel { position:absolute; width:${px(0.9)}; background:#3a2a1a; }
      .leg { position:absolute; width:${px(0.7)}; background:#2b1d12; transform-origin:top center; }
      .prop { position:absolute; overflow:visible; }

      #stage { position:absolute; inset:0; }
      #three-wrap { position:absolute; inset:0; }
      #three-layer { width:100%; height:100%; display:block; }

      /* титул */
      #title-clip .t-wrap { position:absolute; left:0; right:0; top:${(HZ * 100 + 3).toFixed(1)}%; display:flex; flex-direction:column; align-items:center; gap:${px(1.2)}; }
      .t-main { font-family:Montserrat; font-weight:800; font-size:${px(P ? 10.5 : 7)}; letter-spacing:.02em; line-height:1; text-shadow:0 ${px(0.4)} ${px(1.5)} rgba(43,26,10,.5); }
      .t-main .red { color:var(--red); }
      .t-sub { font-family:Montserrat; font-weight:600; font-size:${px(P ? 4 : 2.8)}; letter-spacing:.18em; text-transform:uppercase; color:var(--navy); }

      /* кинетика на плитах */
      #kin-cam { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; padding:0 ${px(7)} ${px(P ? 20 : 8)}; }
      .k-line { display:flex; flex-wrap:wrap; gap:${px(1.2)} ${px(1.6)}; font-family:Montserrat; font-weight:800; line-height:1; font-size:${px(P ? 11 : 8)}; }
      .k-mask { display:block; overflow:hidden; padding:${px(0.4)} 0 ${px(1.2)}; }
      .k-word { display:block; background:#d8cdb8; color:var(--navy); padding:${px(0.8)} ${px(2)} ${px(1)}; border:${px(0.25)} solid #5c4a33;
        box-shadow:${px(2.2)} ${px(1)} 0 rgba(43,26,10,.35); }
      .k-word.red { color:var(--red); }
      #k-l2 { transform-origin:left center; margin-top:${px(1.2)}; }
      #k-under { height:${px(1)}; width:${px(P ? 60 : 48)}; background:var(--red); transform-origin:left center; margin:${px(2)} 0 ${px(1.6)}; }
      #k-en { font-size:${px(P ? 4.6 : 3.4)}; font-weight:600; color:var(--ice); text-shadow:0 ${px(0.3)} ${px(1.2)} rgba(0,0,0,.6); }
      #flash { position:absolute; inset:0; background:var(--ice); opacity:0; pointer-events:none; }

      /* плашки сцен */
      .chip { position:absolute; left:${px(7)}; ${P ? `bottom:${px(31)}` : `bottom:${px(5)}`}; display:flex; align-items:baseline; gap:${px(2)};
        background:rgba(11,30,66,.88); border-left:${px(1)} solid var(--red); padding:${px(1.6)} ${px(3)}; }
      .chip-num { font-family:Montserrat; font-weight:800; font-size:${px(P ? 4.4 : 3.2)}; color:var(--red); }
      .chip-cz { font-family:Montserrat; font-weight:800; font-size:${px(P ? 4.4 : 3.2)}; text-transform:uppercase; }
      .chip-en { font-size:${px(P ? 3.4 : 2.5)}; opacity:.75; }
      #lt-cz .lt { position:absolute; left:${px(7)}; ${P ? `top:${px(26)}` : `top:${px(8)}`}; background:var(--ice); color:var(--navy); padding:${px(1.6)} ${px(3)};
        font-family:Montserrat; font-weight:800; font-size:${px(P ? 5.4 : 4)}; letter-spacing:.04em; }

      /* жеребьёвка */
      #draw .chest { position:absolute; left:50%; width:${px(P ? 70 : 56)}; margin-left:${px(P ? -35 : -28)}; top:${(HZ * 100 - 6).toFixed(1)}%; height:${px(P ? 26 : 20)};
        background:#7a5230; border:${px(0.5)} solid #3a2412; }
      #draw .chest i { position:absolute; left:6%; right:6%; height:22%; background:#304285; border:${px(0.25)} solid #0b1e42; }
      #draw-sheet { position:absolute; left:${f((W - DW) / 2)}; top:${f(P ? H * 0.14 : H * 0.06)}; width:${f(DW)}; height:${f(DH)};
        background:url(assets/photos/g_losovani_den1.jpg) center / 100% 100% no-repeat; border:${px(0.9)} solid var(--ice); box-shadow:${px(1.5)} ${px(2)} ${px(4)} rgba(0,0,0,.5); }

      /* зákulisí */
      #vtip-cap .cap { position:absolute; left:${px(7)}; right:${px(7)}; ${P ? `top:${px(22)}` : `top:${px(5)}`}; font-family:Montserrat; font-weight:800; font-size:${px(P ? 7 : 5)}; line-height:1.05;
        text-shadow:0 ${px(0.4)} ${px(1.6)} rgba(0,0,0,.55); }
      #vtip-cap .cap .en { display:block; font-family:'Source Sans 3'; font-weight:600; font-size:.5em; opacity:.9; margin-top:${px(1.2)}; }

      /* финал */
      #outro .win { position:absolute; left:${f((W - WIN.fw) / 2)}; top:${f(winTop)}; width:${f(WIN.fw)}; height:${f(WIN.fh)}; }
      #outro .o-wrap { position:absolute; left:${px(P ? 6 : 24)}; right:${px(P ? 6 : 24)}; top:${f(winTop + WIN.fh + (P ? 9 : 5.5) * u)}; display:flex; flex-direction:column; align-items:center; text-align:center; gap:${px(1.4)};
        background:rgba(11,30,66,.86); padding:${px(2)} ${px(3)}; border-left:${px(1)} solid var(--red); }
      .o-quote { font-family:Montserrat; font-weight:800; font-size:${px(P ? 5.2 : 3.4)}; line-height:1.1; text-shadow:0 ${px(0.3)} ${px(1.2)} rgba(0,0,0,.5); }
      .o-quote .red { color:var(--red); }
      .o-meta { font-family:Montserrat; font-weight:600; font-size:${px(P ? 3.2 : 2.2)}; letter-spacing:.16em; text-transform:uppercase; color:var(--ice); }

      /* виджет-проигрыватель */
      #player { position:absolute; right:${f(CM)}; bottom:${f(CB)}; width:${f(CW)}; height:${f(CH)}; }
      #card { position:absolute; inset:0; border-radius:${f(CH * 0.22)}; background:linear-gradient(135deg, rgba(48,66,133,.94), rgba(11,30,66,.96));
        box-shadow:0 ${px(1.2)} ${px(4)} rgba(0,0,0,.45), inset 0 0 0 ${px(0.15)} rgba(238,242,249,.18); }
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
      #proto-badge { position:absolute; right:${px(3)}; top:${px(3)}; font-family:Montserrat; font-weight:600; font-size:${px(2)}; letter-spacing:.2em; opacity:.5; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-width="${W}" data-height="${H}" data-duration="${DUR}" data-fps="30">
      <!-- общий фон-сцена (видна в интро, брейке, финале) -->
      <div id="stage">
        <div class="layer" id="st-sky"><div class="sky"></div><div class="sun"></div><div class="speed"></div></div>
        <div class="layer" id="st-ground"><div class="sand" style="top:${(HZ * 100).toFixed(1)}%"></div><div class="cliffs" style="top:${(HZ * 100 - 3).toFixed(1)}%"></div></div>
      </div>

      ${SHOTS.map(shotHtml).join('')}

      <section id="draw" class="clip" data-start="${at(s(22))}" data-duration="${len(s(22), s(25))}" data-track-index="2">
        <div class="layer" id="draw-bg"><div class="sky"></div><div class="speed"></div><div class="sand" style="top:${(HZ * 100).toFixed(1)}%"></div>
          <div class="chest"><i style="top:8%"></i><i style="top:39%"></i><i style="top:70%"></i></div></div>
        <div class="layer" id="draw-cam"><div id="draw-sheet"></div></div>
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
        <div id="win-cam" class="layer">
          <div class="frame win" style="rotate:-2deg"><div class="photo" style="width:100%; height:100%; background-image:url(assets/photos/p_winners.jpg); background-size:cover; background-position:50% 50%"></div></div>
        </div>
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
          <div class="p-row"><div id="p-eq"><i></i><i></i><i></i><i></i><i></i></div><span id="p-time">0:00</span><div class="p-bar"><div id="p-fill"></div></div><span>${Math.floor(SONG / 60)}:${String(Math.round(SONG % 60)).padStart(2, '0')}</span></div>
        </div>
      </div>
      <div id="flash"></div>
      <div id="wipe-holder"><div id="wipe"></div></div>
      <div id="proto-badge">DRAFT · v3</div>

      <audio id="bgm" src="assets/track_edit60.wav" data-start="${T0}" data-duration="${SONG}" data-track-index="9" data-volume="1"></audio>
    </div>

    <script>
      const tl = gsap.timeline({ paused: true });
      // общая сцена: медленный дрейф неба и песка
      tl.fromTo("#st-sky", { xPercent: -2, scale: 1.04 }, { xPercent: 2, scale: 1.08, duration: ${DUR}, ease: "none" }, 0);
      tl.fromTo("#st-ground", { xPercent: 1.5, scale: 1.04 }, { xPercent: -1.5, scale: 1.1, duration: ${DUR}, ease: "none" }, 0);
      // 3D-слой: интро и финал
      tl.fromTo("#three-wrap", { opacity: 1 }, { opacity: 0, duration: 0.25 }, ${at(s(5) - 0.25)});
      tl.to("#three-wrap", { opacity: 1, duration: 0.3 }, ${at(s(29) - 0.15)});
      // титул
      tl.fromTo("#t-main", { opacity: 0, y: ${Math.round(3 * u)} }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, ${at(s(2))});
      tl.fromTo("#t-sub", { opacity: 0, scaleX: 1.15 }, { opacity: 0.9, scaleX: 1, duration: 0.8, ease: "power2.out" }, ${at(s(2, 2))});
      tl.fromTo("#t-date", { opacity: 0, y: ${Math.round(2 * u)} }, { opacity: 0.9, y: 0, duration: 0.5, ease: "power2.out" }, ${at(s(3))});
      ${kin}
      ${shotTweens}
      ${SCENES.map(([st, , id]) => `tl.fromTo("#chip-${id} .chip", {xPercent:-120}, {xPercent:0, duration:0.4, ease:"power3.out"}, ${at(st + G.beat)});`).join('\n      ')}
      tl.fromTo("#lt-box", { xPercent: -110 }, { xPercent: 0, duration: 0.35, ease: "power3.out" }, ${at(s(18, 1))});
      tl.fromTo("#vtip-text", { opacity: 0, y: ${Math.round(3 * u)} }, { opacity: 1, y: 0, duration: 0.3, ease: "back.out(2)" }, ${at(s(25, 1))});
      // жеребьёвка: лист выезжает из комода, камера идёт по секторам 1→4
      tl.fromTo("#draw-sheet", { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, ${at(s(22))});
      tl.fromTo("#draw-cam", { x: ${DPAN.toFixed(1)}, scale: 1.0 }, { x: ${(-DPAN).toFixed(1)}, scale: 1.04, duration: ${len(s(22, 1), s(25))}, ease: "sine.inOut" }, ${at(s(22, 1))});
      tl.fromTo("#draw-bg", { scale: 1.02 }, { scale: 1.08, duration: ${len(s(22), s(25))}, ease: "none" }, ${at(s(22))});
      // финал
      tl.fromTo("#win-cam", { scale: 1.08, y: ${Math.round(4 * u)} }, { scale: 1, y: 0, duration: ${len(at(s(29)), DUR)}, ease: "power2.out" }, ${at(s(29))});
      tl.fromTo("#o-quote", { opacity: 0, y: ${Math.round(3 * u)} }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, ${at(s(29, 2))});
      tl.fromTo("#o-meta", { opacity: 0 }, { opacity: 0.9, duration: 0.6 }, ${at(s(30))});
      ${wipes}

      // проигрыватель: старт в центре, игла в T0, затем мини-плеер в углу
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
      renderer.setSize(W, H, false);
      renderer.setPixelRatio(1);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(PORTRAIT ? 50 : 32, W / H, 0.1, 200);
      const loader = new THREE.TextureLoader();
      function disc(src, edge) {
        const tex = loader.load(src);
        tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; tex.center.set(0.5, 0.5); tex.rotation = Math.PI / 2;
        const geo = new THREE.CylinderGeometry(1, 1, 0.14, 160, 1, false);
        geo.rotateX(Math.PI / 2);
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
      const T0 = ${T0}, OUT0 = ${s(29)}, INTRO_END = ${s(5)};
      function renderAt(tt) {
        const t = tt - T0;
        camera.position.set(Math.sin(t * 0.15) * 0.25, 0, 6.2 - Math.min(t, 10) * 0.04);
        camera.lookAt(0, 0, 0);
        if (t > 0 && t < INTRO_END + 0.1) {
          // логотип восходит над горизонтом пустыни, как солнце
          const a = eo(t / 2.2), rise = eo((t - 0.2) / 2.4);
          hb.visible = true; ta.visible = false;
          hb.position.set(0, lerp(PORTRAIT ? -0.6 : -0.6, PORTRAIT ? 0.95 : 0.55, rise), lerp(-24, 0, a));
          hb.rotation.set(Math.sin(t * 0.9) * 0.06, lerp(-2.6, 0, eo(t / 2.6)) + Math.sin(t * 0.7) * 0.08, 0);
          hb.scale.setScalar(PORTRAIT ? 0.78 : 0.6);
          key.position.set(lerp(-6, 6, clamp((t - 1.4) / 1.6)), 2, 4); rim.intensity = 0;
        } else if (t >= OUT0 - 0.15) {
          const lt = t - OUT0, a = eo(lt / 1.4);
          hb.visible = ta.visible = true;
          const sc = PORTRAIT ? 0.42 : 0.5;
          ta.scale.setScalar(sc); hb.scale.setScalar(sc);
          if (PORTRAIT) { ta.position.set(lerp(-6, -0.62, a), 2.05, 0); hb.position.set(lerp(6, 0.62, a), 2.05, 0); }
          else { ta.position.set(lerp(-8, -2.45, a), 0.35, 0); hb.position.set(lerp(8, 2.45, a), 0.35, 0); }
          ta.rotation.set(0, lerp(2.2, 0, eo(lt / 1.8)) + Math.sin(lt * 0.8) * 0.06, 0);
          hb.rotation.set(0, lerp(-2.2, 0, eo(lt / 1.8)) - Math.sin(lt * 0.8) * 0.06, 0);
          key.position.set(lerp(-6, 6, clamp((lt - 2.2) / 1.6)), 2, 4);
          rim.position.set(0, -2, 2.5); rim.intensity = 4 * clamp((lt - 1) / 1);
          camera.position.set(0, 0, 6.2); camera.lookAt(0, 0, 0);
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
