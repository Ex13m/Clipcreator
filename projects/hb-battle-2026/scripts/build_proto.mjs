// Рыба HB2026: генерирует две HyperFrames-композиции (9:16 и 16:9) из одного сценария.
// Фото/видео пока заменены слейтами с 2.5D-параллаксом; логотипы — только оригиналы PNG.
// node scripts/build_proto.mjs  ->  proto/index.html (9:16), proto/hb2026_16x9.html (16:9)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROTO = path.join(ROOT, 'proto');
const FONTS = fs.readFileSync(path.join(PROTO, 'assets/fonts.css'), 'utf8');

const BPM = 120, BEAT = 60 / BPM, BAR = BEAT * 4, DUR = 60;

// Сцены: [start, end, id, CZ, EN]
const SCENES = [
  [10, 18, 'prijezd', 'Příjezd', 'Arrival'],
  [18, 26, 'trenink', 'Den 1 · trénink', 'Day 1 · practice'],
  [26, 34, 'prezentace', 'Prezentace týmů', 'Team presentation'],
  [34, 40, 'zahajeni', 'Zahájení', 'Opening ceremony'],
  [40, 48, 'losovani', 'Losování', 'The draw'],
  [48, 52, 'vtip', 'Zákulisí', 'Backstage'],
];
// Шоты: [num, start, dur, sceneId, действие (CZ), движение камеры]
const SHOTS = [
  [1, 10, 4, 'prijezd', 'Příjezd na revír, vykládání prutů', 'push'],
  [2, 14, 4, 'prijezd', 'Přivítání s domácím týmem', 'panR'],
  [3, 18, 2, 'trenink', 'Nához z břehu', 'panL'],
  [4, 20, 2, 'trenink', 'Záběr, ohnutý prut', 'push'],
  [5, 22, 2, 'trenink', 'Pstruh v podběráku', 'pull'],
  [6, 24, 2, 'trenink', 'Pustit zpátky do vody', 'tilt'],
  [7, 26, 4, 'prezentace', 'Tým ČR na pódiu', 'push'],
  [8, 30, 4, 'prezentace', 'Ostatní týmy, vlajky', 'panR'],
  [9, 34, 2, 'zahajeni', 'Nástup týmů', 'push'],
  [10, 36, 2, 'zahajeni', 'Vlajky, hymna', 'tilt'],
  [11, 38, 2, 'zahajeni', 'Přípitek pořadatelů', 'pull'],
  [12, 48, 4, 'vtip', 'Vtipná fotka týmu', 'whip'],
];
const DRAW_ROWS = ['Závodník 1', 'Závodník 2', 'Závodník 3', 'Závodník 4', 'Závodník 5'];

function build(W, H, file) {
  const P = H > W, u = Math.min(W, H) / 100; // u = 1% короткой стороны
  const px = (n) => `${Math.round(n * u)}px`;
  const sceneName = Object.fromEntries(SCENES.map((s) => [s[2], s]));

  const shotsHtml = SHOTS.map(([n, st, d, sc, act]) => {
    const id = `sh${String(n).padStart(2, '0')}`;
    return `
      <section id="${id}" class="clip shot" data-start="${st}" data-duration="${d}" data-track-index="2">
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
      <section id="chip-${id}" class="clip chip-clip" data-start="${st}" data-duration="${en - st}" data-track-index="4">
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
    const L = (layer, from, to) => `tl.fromTo("${id} .${layer}", ${JSON.stringify(from)}, ${JSON.stringify({ ...to, duration: d, ease: 'none' })}, ${st});`;
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
        out.push(`tl.fromTo("${id} .${ly}", {scale:${1.6 + dz * 0.4}, xPercent:${-30 * dz}}, {scale:1.04, xPercent:0, duration:0.45, ease:"expo.out"}, ${st});`);
        out.push(`tl.to("${id} .${ly}", {scale:${1.04 + 0.06 * dz}, duration:${d - 0.45}, ease:"none"}, ${st + 0.45});`);
      }
    });
    out.push(`tl.fromTo("${id} .slate-meta", {opacity:0, y:${Math.round(2 * u)}}, {opacity:1, y:0, duration:0.25, ease:"power2.out"}, ${st + 0.05});`);
    return out.join('\n      ');
  }).join('\n      ');

  // Переходы: красная шторка на стыках сцен (ровно в бит)
  const cuts = [10, 18, 26, 34, 40, 48, 52];
  const wipes = cuts.map((t, i) => `tl.fromTo("#wipe", {xPercent:-101}, {xPercent:101, duration:0.5, ease:"power2.inOut"${i ? ', immediateRender:false' : ''}}, ${t - 0.25});`).join('\n      ');

  // Кинетическая типографика S1 — слова на доли
  const words1 = ['Nepřijeli', 'jsme', 'bojovat,'];
  const words2 = ['přijeli', 'jsme', 'za', 'přáteli.'];
  const kin = [
    ...words1.map((w, i) => `tl.fromTo("#k1w${i}", {yPercent:110}, {yPercent:0, duration:0.35, ease:"power3.out"}, ${4 + i * BEAT});`),
    ...words2.map((w, i) => `tl.fromTo("#k2w${i}", {yPercent:110}, {yPercent:0, duration:0.35, ease:"power3.out"}, ${6 + i * BEAT});`),
    `tl.fromTo("#k-under", {scaleX:0}, {scaleX:1, duration:0.5, ease:"power2.inOut"}, 7.5);`,
    `tl.fromTo("#k-en", {opacity:0, y:${Math.round(2 * u)}}, {opacity:1, y:0, duration:0.4, ease:"power2.out"}, 8);`,
    `tl.fromTo("#kin-cam", {scale:1}, {scale:1.06, duration:6, ease:"none"}, 4);`,
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
      .chip { position:absolute; left:${px(7)}; ${P ? `bottom:${px(30)}` : `bottom:${px(7)}`}; display:flex; align-items:baseline; gap:${px(2)};
        background:rgba(11,30,66,.86); border-left:${px(1)} solid var(--red); padding:${px(1.6)} ${px(3)}; }
      .chip-num { font-family:Montserrat; font-weight:800; font-size:${px(P ? 4.4 : 3.2)}; color:var(--red); }
      .chip-cz { font-family:Montserrat; font-weight:800; font-size:${px(P ? 4.4 : 3.2)}; text-transform:uppercase; }
      .chip-en { font-size:${px(P ? 3.4 : 2.5)}; opacity:.75; }

      /* нижняя плашка «Tým ČR» */
      #lt-cz .lt { position:absolute; left:${px(7)}; ${P ? `bottom:${px(44)}` : `bottom:${px(20)}`}; background:var(--ice); color:var(--navy); padding:${px(1.6)} ${px(3)};
        font-family:Montserrat; font-weight:800; font-size:${px(P ? 5.4 : 4)}; letter-spacing:.04em; }

      /* жеребьёвка */
      #draw-cam { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; padding:0 ${px(6)}; perspective:${px(200)}; }
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
      #outro .o-wrap { position:absolute; left:${px(7)}; right:${px(7)}; ${P ? `top:${px(138)}` : `bottom:${px(7)}`}; display:flex; flex-direction:column; align-items:center; text-align:center; gap:${px(1.6)}; }
      .o-quote { font-family:Montserrat; font-weight:800; font-size:${px(P ? 5.6 : 3.8)}; line-height:1.1; }
      .o-quote .red { color:var(--red); }
      .o-meta { font-family:Montserrat; font-weight:600; font-size:${px(P ? 3.4 : 2.4)}; letter-spacing:.16em; text-transform:uppercase; opacity:.85; }

      #wipe { position:absolute; inset:0; background:var(--red); }
      #wipe-holder { position:absolute; inset:0; overflow:hidden; pointer-events:none; }
      #proto-badge { position:absolute; right:${px(3)}; top:${px(3)}; font-family:Montserrat; font-weight:600; font-size:${px(2)}; letter-spacing:.2em; opacity:.45; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-width="${W}" data-height="${H}" data-duration="${DUR}" data-fps="30">
      <div id="bg"><div id="stripes"></div></div>

      ${shotsHtml}

      <section id="draw" class="clip" data-start="40" data-duration="8" data-track-index="2">
        <div id="draw-cam">
          <div class="d-title">LOSOVÁNÍ<span class="en">The draw</span></div>
          <div class="d-note">ryba · data z losování doplnit</div>
          <div id="draw-table">
            <div class="tr th"><span class="td">Závodník</span><span class="td">Kolo 1</span><span class="td">Kolo 2</span><span class="td">Kolo 3</span></div>${drawRows}
          </div>
        </div>
      </section>

      <div id="three-wrap"><canvas id="three-layer"></canvas></div>

      <section id="title-clip" class="clip" data-start="1.5" data-duration="2.5" data-track-index="3">
        <div class="t-wrap">
          <div id="t-main" class="t-main">H-BATTLE <span class="red">2026</span></div>
          <div id="t-sub" class="t-sub">Slovensko · 1.–2.&nbsp;10.&nbsp;2026</div>
        </div>
      </section>

      <section id="kin" class="clip" data-start="4" data-duration="6" data-track-index="3">
        <div id="kin-cam">
          <div class="k-line">${words1.map((w, i) => `<span class="k-mask"><span id="k1w${i}" class="k-word">${w}</span></span>`).join('')}</div>
          <div class="k-line">${words2.map((w, i) => `<span class="k-mask"><span id="k2w${i}" class="k-word${i === 3 ? ' red' : ''}">${w}</span></span>`).join('')}</div>
          <div id="k-under"></div>
          <div id="k-en">We didn’t come to fight. We came for friends.</div>
        </div>
      </section>

      ${chipsHtml}

      <section id="lt-cz" class="clip" data-start="27" data-duration="3" data-track-index="5">
        <div id="lt-box" class="lt">TÝM ČESKÁ REPUBLIKA</div>
      </section>

      <section id="vtip-cap" class="clip" data-start="48.5" data-duration="3.5" data-track-index="5">
        <div id="vtip-text" class="cap">Takhle vypadá náš „boj“.<span class="en">This is what our “battle” looks like.</span></div>
      </section>

      <section id="outro" class="clip" data-start="53" data-duration="7" data-track-index="3">
        <div class="o-wrap">
          <div id="o-quote" class="o-quote">Nepřijeli jsme bojovat. <span class="red">Přijeli jsme za přáteli.</span></div>
          <div id="o-meta" class="o-meta">H-BATTLE 2026 · Slovensko · 1.–2.&nbsp;10.&nbsp;2026</div>
        </div>
      </section>

      <div id="wipe-holder"><div id="wipe"></div></div>
      <div id="proto-badge">RYBA · v0</div>

      <audio id="bgm" src="assets/placeholder_120bpm.wav" data-start="0" data-duration="${DUR}" data-track-index="9" data-volume="0.8"></audio>
    </div>

    <script>
      const tl = gsap.timeline({ paused: true });
      // фон: полосы дрейфуют весь ролик
      tl.fromTo("#stripes", { xPercent: -3 }, { xPercent: 3, duration: ${DUR}, ease: "none" }, 0);
      // 3D-слой виден в интро и в финале
      tl.fromTo("#three-wrap", { opacity: 1 }, { opacity: 0.18, duration: 0.5, ease: "power1.inOut" }, 4);
      tl.to("#three-wrap", { opacity: 0, duration: 0.25 }, 9.75);
      tl.to("#three-wrap", { opacity: 1, duration: 0.3 }, 52);
      // титул
      tl.fromTo("#t-main", { opacity: 0, y: ${Math.round(3 * u)} }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 2);
      tl.fromTo("#t-sub", { opacity: 0, scaleX: 1.15 }, { opacity: 0.85, scaleX: 1, duration: 0.8, ease: "power2.out" }, 2.5);
      ${kin}
      ${shotTweens}
      // плашки сцен: въезд на сильную долю
      ${SCENES.map(([st, , id]) => `tl.fromTo("#chip-${id} .chip", {xPercent:-120}, {xPercent:0, duration:0.4, ease:"power3.out"}, ${st + BEAT});`).join('\n      ')}
      tl.fromTo("#lt-box", { xPercent: -110 }, { xPercent: 0, duration: 0.4, ease: "power3.out" }, 27);
      tl.fromTo("#vtip-text", { opacity: 0, y: ${Math.round(3 * u)} }, { opacity: 1, y: 0, duration: 0.35, ease: "back.out(2)" }, 48.5);
      // жеребьёвка: камера + строки на доли
      tl.fromTo("#draw-cam", { scale: 1.0 }, { scale: 1.07, duration: 8, ease: "none" }, 40);
      tl.fromTo("#draw-table", { rotationX: 18 }, { rotationX: 4, duration: 8, ease: "power1.out" }, 40);
      ${DRAW_ROWS.map((_, i) => `tl.fromTo("#dr${i}", {xPercent:-104, opacity:0}, {xPercent:0, opacity:1, duration:0.35, ease:"power3.out"}, ${41 + i * BEAT});`).join('\n      ')}
      // финал
      tl.fromTo("#o-quote", { opacity: 0, y: ${Math.round(3 * u)} }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 54);
      tl.fromTo("#o-meta", { opacity: 0 }, { opacity: 0.85, duration: 0.6 }, 55);
      ${wipes}
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

      function renderAt(t) {
        camera.position.set(Math.sin(t * 0.15) * 0.25, 0, 6.2 - Math.min(t, 10) * 0.04);
        camera.lookAt(0, 0, 0);

        // H-BATTLE: интро 0–10 с, финал 52–60 с
        if (t < 10.5) {
          const a = eo(t / 2.2);
          const lift = eo((t - 3.6) / 0.8);
          hb.visible = true;
          hb.position.set(0, lerp(PORTRAIT ? 0.5 : 0.25, PORTRAIT ? 2.4 : 1.2, lift), lerp(-28, 0, a));
          hb.rotation.set(Math.sin(t * 0.9) * 0.06, lerp(-2.6, 0, eo(t / 2.6)) + Math.sin(t * 0.7) * 0.08, 0);
          hb.scale.setScalar(lerp(PORTRAIT ? 1.35 : 1.1, PORTRAIT ? 0.7 : 0.55, lift));
          ta.visible = false;
          key.position.set(lerp(-6, 6, clamp((t - 1.4) / 1.6)), 2, 4);
          rim.intensity = 0;
        } else if (t >= 51.9) {
          const lt = t - 52;
          const a = eo(lt / 1.4);
          const gap = PORTRAIT ? 1.25 : 1.35;
          hb.visible = ta.visible = true;
          const sc = PORTRAIT ? 0.85 : 0.95;
          ta.scale.setScalar(sc); hb.scale.setScalar(sc);
          if (PORTRAIT) {
            ta.position.set(lerp(-6, 0, a), 1.45, 0);
            hb.position.set(lerp(6, 0, a), -0.45, 0);
          } else {
            ta.position.set(lerp(-7, -gap, a), 0.45, 0);
            hb.position.set(lerp(7, gap, a), 0.45, 0);
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
