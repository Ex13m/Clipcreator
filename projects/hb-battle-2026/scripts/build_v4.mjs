// HB2026 v4: стиль спортивных постеров (референсы команд H-BATTLE): тёмный фон, диагональный триколор, лучи, блёстки,
// жирный курсив Montserrat 900. Каждое фото: живой кадр -> превращение в графику (дуотон+растр фона, фигура-стикер) -> графика двигается.
// Фото «1st PLACE» — постановочное, используется как короткие вспышки-«видения».
// python3 scripts/edit_track.py && python3 scripts/make_gfx.py && node scripts/build_v4.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROTO = path.join(ROOT, 'proto');
const FONTS = fs.readFileSync(path.join(PROTO, 'assets/fonts.css'), 'utf8');
const G = JSON.parse(fs.readFileSync(path.join(ROOT, '03_MUSIC/Trout_Area_edit60.grid.json'), 'utf8'));
const IMG = JSON.parse(fs.readFileSync(path.join(PROTO, 'assets/photos.json'), 'utf8'));
const GFX = JSON.parse(fs.readFileSync(path.join(PROTO, 'assets/gfx.json'), 'utf8'));

const T0 = 1.2, SONG = G.duration, DUR = +(T0 + SONG + 0.6).toFixed(2);
const at = (x) => +(x + T0).toFixed(3);
const s = (bar, k = 0) => { const i = G.beats.findIndex((t) => Math.abs(t - G.downbeats[bar - 1]) < 0.06); return G.beats[i + k]; };
const len = (a, b) => +(b - a).toFixed(3);
const rnd = (seed) => { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); };
const beatsIn = (a, b) => G.beats.filter((t) => t > a + 0.05 && t < b - 0.05);

const SCENES = [
  [s(5), s(9), 'prijezd', 'Příjezd', 'Arrival'],
  [s(9), s(16), 'trenink', 'Den 1 · trénink', 'Day 1 · practice'],
  [s(18), s(20), 'zmena', 'Změna v sestavě', 'Line-up change'],
  [s(20), s(25), 'losovani', 'Losování', 'The draw'],
  [s(25), s(26), 'vtip', 'Zákulisí', 'Backstage'],
  [s(26), s(29), 'pratele', 'Přátelé', 'Friends'],
];

// Шот: фото, слово-постер, плашка с именем, движение камеры, режим (auto | poster — уже графика, без превращения)
const SH = (n, a, b, sc, img, o = {}) => ({ n, a, b, d: len(a, b), sc, img, mv: 'push', ...o });
const MONT = ['g_team_moldova', 'g_team_germany', 'g_team_slovakia', 'g_team_bulgaria', 'g_team_hungary', 'g_team_poland',
  'g_team_belgium', 'p_team_romania', 'g_event_banner', 'p_trophies', 'p_selfie_lake', 'p_tying_ms'];
const SHOTS = [
  SH(1, s(5), s(7), 'prijezd', 'p_car', { word: 'Cesta', mv: 'panR' }),
  SH(2, s(7), s(9), 'prijezd', 'p_lake_mist', { word: 'Hofer Lake', mv: 'push' }),
  SH(3, s(9), s(10), 'trenink', 'p_trenink_gear', { word: 'Příprava', mv: 'panL' }),
  SH(4, s(10), s(11), 'trenink', 'p_tying_young', { word: 'Uzly', mv: 'push' }),
  SH(5, s(11), s(12), 'trenink', 'p_selfie_lake', { word: 'Ráno u vody', mv: 'pull' }),
  SH(6, s(12), s(13), 'trenink', 'p_tying_ms', { word: 'Trpělivost', mv: 'push' }),
  SH(7, s(13), s(14), 'trenink', 'p_reeling', { word: 'Záběr', mv: 'panR' }),
  SH(8, s(14), s(15), 'trenink', 'p_landing1', { word: 'Podběrák', mv: 'push' }),
  SH(9, s(15), s(15, 2), 'trenink', 'p_landing2', { word: 'Máme ho!', mv: 'pull' }),
  SH(10, s(15, 2), s(16), 'trenink', 'p_net_close', { word: 'Pstruh', mv: 'push' }),
  SH(11, s(18), s(19), 'zmena', 'g_zmena_sestavy', { mode: 'poster', mv: 'push' }),
  SH(12, s(19), s(20), 'zmena', 'p_green_fish', { word: 'Nastupuje', plate: ['Martin Stoklasa', 'nastupuje do sestavy'], mv: 'pull' }),
  SH(13, s(20), s(21), 'losovani', 'p_training_plan', { word: '12 kol', mv: 'tilt' }),
  SH(14, s(21), s(22), 'losovani', 'p_portrait_dres', { word: 'Sektor 2', plate: ['Dominik Švub', 'č. 23 · sektor 2'], mv: 'push' }),
  SH(15, s(22), s(25), 'losovani', 'g_losovani_den1', { mode: 'poster', mv: 'scan' }),
  SH(16, s(25), s(26), 'vtip', 'p_lunch', { word: 'Boj', caption: ['Takhle vypadá náš „boj“.', 'This is what our “battle” looks like.'], mv: 'push' }),
  ...MONT.map((img, k) => SH(17 + k, s(26, k), s(26, k + 1), 'pratele', img, { mode: img.startsWith('g_') ? 'poster' : 'auto', mv: k % 2 ? 'pull' : 'push', card: true, tilt: k % 2 ? 2.5 : -2.5 })),
  SH(29, s(29), s(29) + (DUR - T0 - s(29)), 'final', 'p_cheers', { mv: 'pull', final: true }),
];

function build(W, H, file) {
  const P = H > W, u = Math.min(W, H) / 100, FA = W / H;
  const px = (n) => `${Math.round(n * u)}px`;
  const f = (n) => n.toFixed(1) + 'px';

  // --- виджет-проигрыватель (как в v3) ---
  const CW = (P ? 60 : 44) * u, CH = (P ? 17 : 11.5) * u, CM = (P ? 5 : 3.5) * u, CB = (P ? 10 : 3.5) * u;
  const VD = CH * 1.32, VL = 1.6 * u, VT = (CH - VD) / 2, HERO = P ? 1.45 : 1.75;
  const dockX = W / 2 - (W - CM - CW / 2), dockY = H / 2 - (H - CB - CH / 2);

  // --- геометрия кадра: полный кадр или панель-постер ---
  function box(sh) {
    const [iw, ih] = IMG[sh.img];
    const ar = iw / ih;
    if (sh.final) { const w = P ? W * 0.86 : H * 0.62 * ar, h = w / ar; return { x: (W - w) / 2, y: P ? H * 0.2 : H * 0.07, w, h, panel: true }; }
    if (sh.card) { const h0 = P ? H * 0.44 : H * 0.7; let w = h0 * ar, h = h0; if (w > W * (P ? 0.86 : 0.7)) { w = W * (P ? 0.86 : 0.7); h = w / ar; } return { x: (W - w) / 2, y: (P ? H * 0.38 : H * 0.46) - h / 2, w, h, panel: true }; }
    if (sh.mv === 'scan') { const w = P ? W * 1.62 : W * 0.66, h = w / ar; return { x: (W - w) / 2, y: P ? H * 0.16 : H * 0.05, w, h, panel: true }; }
    if (Math.abs(Math.log(ar / FA)) < 0.3) return { x: 0, y: 0, w: W, h: H, panel: false };
    if (P) { const w = W * 0.92, h = Math.min(w / ar, H * 0.56), ww = h * ar; return { x: (W - ww) / 2, y: H * 0.36 - h / 2, w: ww, h, panel: true }; }
    const h = H * 0.84, w = Math.min(h * ar, W * 0.62); return { x: W * 0.6 - w / 2, y: H * 0.07, w, h: w / ar, panel: true };
  }
  // место для слова-постера
  function wordBox(sh, b) {
    if (!b.panel) return { x: 5 * u, y: P ? H * 0.5 : H * 0.42, w: W - 10 * u, align: 'center' };
    if (P) return { x: 5 * u, y: Math.max(8 * u, b.y - 16 * u), w: W - 10 * u, align: 'left' };
    return { x: 4 * u, y: H * 0.3, w: Math.max(30 * u, b.x - 6 * u), align: 'left' };
  }

  const bgUrl = (sh, layer) => layer === 'ph' ? `assets/photos/${sh.img}.jpg` : layer === 'bg' ? `assets/gfx/${sh.img}_bg.jpg` : `assets/gfx/${sh.img}_fg.png`;
  const hasFg = (sh) => sh.mode !== 'poster' && GFX[sh.img]?.fg;

  const shotHtml = (sh) => {
    const id = `sh${String(sh.n).padStart(2, '0')}`;
    const b = box(sh), wb = wordBox(sh, b);
    const word = sh.word ? sh.word.toUpperCase() : '';
    const wsize = word ? Math.min((P ? 15 : 13) * u, wb.w / (Math.max(4, word.length) * 0.74)) : 0;
    const lay = (layer, cls) => `<div class="${cls}" style="background-image:url(${bgUrl(sh, layer)})"></div>`;
    const inner = sh.mode === 'poster'
      ? `<div class="clipbox">${lay('ph', 'ph')}</div>`
      : `<div class="clipbox">${lay('ph', 'ph')}<div class="rv">${lay('bg', 'gbg')}</div></div>${hasFg(sh) ? lay('fg', 'gfg') : ''}`;
    const plate = sh.plate ? `<div class="plate" style="${P ? `left:${px(6)}; top:${f(b.y + b.h + 3 * u)}` : `left:${px(4)}; top:${f(H * 0.64)}`}"><b>${sh.plate[0]}</b><i>${sh.plate[1]}</i></div>` : '';
    const cap = sh.caption ? `<div class="caption" style="${P ? `left:${px(6)}; right:${px(6)}; top:${f(b.y + b.h + 3 * u)}` : `left:${px(4)}; width:${f(b.x - 8 * u)}; top:${f(H * 0.58)}`}">${sh.caption[0]}<span>${sh.caption[1]}</span></div>` : '';
    return `
      <section id="${id}" class="clip shot" data-start="${at(sh.a)}" data-duration="${sh.d}" data-track-index="2">
        ${word ? `<div class="word" style="left:${f(wb.x)}; top:${f(wb.y)}; width:${f(wb.w)}; font-size:${f(wsize)}; text-align:${wb.align}"><span>${word}</span></div>` : ''}
        <div class="cam">
          <div class="pbox${b.panel ? ' panel' : ''}" style="left:${f(b.x)}; top:${f(b.y)}; width:${f(b.w)}; height:${f(b.h)};${sh.tilt ? ` rotate:${sh.tilt}deg;` : ''}">${inner}</div>
        </div>
        ${sh.mode !== 'poster' && !sh.card && sh.d >= 0.7 ? '<div class="slash"><i></i><i></i><i></i></div>' : ''}
        ${plate}${cap}
      </section>`;
  };

  // --- анимация шота: живой кадр -> превращение (на долю) -> графика с параллаксом ---
  const shotTweens = SHOTS.map((sh) => {
    const id = `#sh${String(sh.n).padStart(2, '0')}`, st = at(sh.a), d = sh.d, out = [];
    const T = (sel, from, to, pos) => out.push(`tl.fromTo("${id} ${sel}", ${JSON.stringify(from)}, ${JSON.stringify(to)}, ${(+pos).toFixed(3)});`);
    // камера
    const cam = { push: [{ scale: 1 }, { scale: 1.07 }], pull: [{ scale: 1.08 }, { scale: 1 }], panR: [{ xPercent: -2.5, scale: 1.05 }, { xPercent: 2.5, scale: 1.05 }],
      panL: [{ xPercent: 2.5, scale: 1.05 }, { xPercent: -2.5, scale: 1.05 }], tilt: [{ yPercent: 2, scale: 1.05 }, { yPercent: -2, scale: 1.05 }],
      scan: [{ x: P ? W * 0.31 : 0, scale: 1 }, { x: P ? -W * 0.31 : 0, scale: P ? 1.02 : 1.06 }] }[sh.mv];
    T('.cam', cam[0], { ...cam[1], duration: d, ease: sh.mv === 'scan' ? 'sine.inOut' : 'none' }, st);
    if (sh.card) T('.pbox', { scale: 1.25, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.16, ease: 'back.out(2)' }, st);
    if (sh.final) T('.pbox', { y: 6 * u, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, st);
    if (sh.mode === 'poster') {
      if (!sh.card && sh.mv !== 'scan') T('.pbox', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.6)' }, st);
      if (sh.mv === 'scan') T('.pbox', { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }, st);
    } else {
      // момент превращения: первая доля после 35% длительности (короткие шоты — сразу графика)
      const bs = beatsIn(sh.a + d * 0.3, sh.b);
      const tc = sh.card || d < 0.7 ? sh.a : (bs[0] ?? sh.a + d * 0.4);
      const wipe = sh.card || d < 0.7 ? 0.01 : 0.28;
      T('.rv', { clipPath: 'polygon(-30% 0%, -10% 0%, -30% 100%, -50% 100%)' }, { clipPath: 'polygon(-30% 0%, 150% 0%, 130% 100%, -50% 100%)', duration: wipe, ease: 'power2.inOut', immediateRender: true }, at(tc));
      // фон-графика уходит влево, фигура выходит вперёд и вправо (параллакс)
      const rest = Math.max(0.2, sh.b - tc);
      T('.gbg', { xPercent: 0, scale: 1.02 }, { xPercent: -2.5, scale: 1.06, duration: rest, ease: 'none' }, at(tc));
      if (hasFg(sh)) {
        T('.gfg', { opacity: 0, scale: 1 }, { opacity: 1, scale: 1.05, duration: 0.22, ease: 'back.out(2.5)' }, at(tc + wipe * 0.6));
        T('.gfg', { xPercent: 0 }, { xPercent: 1.8, duration: rest, ease: 'none' }, at(tc));
      }
      if (!sh.card && d >= 0.7) T('.slash', { xPercent: -140 }, { xPercent: 140, duration: 0.42, ease: 'power2.inOut' }, at(tc - 0.12));
    }
    if (sh.word) {
      const tw = sh.card || d < 0.7 ? sh.a : (beatsIn(sh.a + d * 0.3, sh.b)[0] ?? sh.a + d * 0.4);
      T('.word span', { xPercent: -12, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.3, ease: 'expo.out' }, at(tw));
      T('.word', { x: 0 }, { x: (P ? 3 : 4) * u, duration: Math.max(0.3, sh.b - tw), ease: 'none' }, at(tw));
    }
    if (sh.plate) T('.plate', { xPercent: -110 }, { xPercent: 0, duration: 0.35, ease: 'power3.out' }, at(beatsIn(sh.a + d * 0.3, sh.b)[0] ?? sh.a + 0.3));
    if (sh.caption) T('.caption', { y: 3 * u, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'back.out(2)' }, at(sh.a + G.beat));
    return out.join('\n      ');
  }).join('\n      ');

  // --- фон: диагональный триколор с «рваными» краями, лучи, блёстки ---
  const brush = (yc, th, seed) => {
    const n = 26, pts = [], pts2 = [];
    for (let i = 0; i <= n; i++) {
      const x = -10 + (120 * i) / n;
      pts.push(`${x.toFixed(1)},${(yc - th / 2 + (rnd(seed + i) - 0.5) * th * 0.35).toFixed(1)}`);
      pts2.unshift(`${x.toFixed(1)},${(yc + th / 2 + (rnd(seed + 50 + i) - 0.5) * th * 0.35).toFixed(1)}`);
    }
    return pts.concat(pts2).join(' ');
  };
  const band = `<svg class="band" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polygon points="${brush(44, 9, 1)}" fill="#eef2f9" opacity=".9"/><polygon points="${brush(53, 9, 2)}" fill="#e31e24" opacity=".92"/>
      <polygon points="${brush(62, 9, 3)}" fill="#304285"/></svg>`;
  const STARS = Array.from({ length: 28 }, (_, i) => ({ x: rnd(i * 3 + 1) * 100, y: rnd(i * 5 + 2) * (P ? 70 : 60) + 4, s: 0.6 + rnd(i * 7) * 1.6, p: rnd(i * 11) * 2.2 }));
  const starsHtml = STARS.map((st, i) => `<i class="star" id="star${i}" style="left:${st.x.toFixed(1)}%; top:${st.y.toFixed(1)}%; width:${px(st.s * 1.6)}; height:${px(st.s * 1.6)}"></i>`).join('');
  const starTweens = STARS.map((st, i) => {
    const per = 1.6 + rnd(i * 13) * 1.4, rep = Math.floor((DUR - st.p) / per) - 1;
    return `tl.fromTo("#star${i}", {scale:0, opacity:0}, {scale:1, opacity:1, duration:${(per / 2).toFixed(2)}, ease:"sine.inOut", repeat:${rep * 2 + 1}, yoyo:true}, ${st.p.toFixed(2)});`;
  }).join('\n      ');

  const chipsHtml = SCENES.map(([st, en, id, cz, eng], i) => `
      <section id="chip-${id}" class="clip chip-clip" data-start="${at(st)}" data-duration="${len(st, en)}" data-track-index="4">
        <div class="chip"><span class="chip-num">${String(i + 1).padStart(2, '0')}</span><span class="chip-cz">${cz}</span><span class="chip-en">${eng}</span></div>
      </section>`).join('');

  // переходы: тройной слэш-триколор на стыках сцен
  const cuts = [s(5), s(9), s(18), s(20), s(25), s(26), s(29)];
  const wipes = cuts.map((t, i) => `tl.fromTo("#wipe", {xPercent:-160}, {xPercent:160, duration:0.55, ease:"power2.inOut"${i ? ', immediateRender:false' : ''}}, ${at(t - 0.27)});`).join('\n      ');

  // кинетика: брейк (такт 16) + пик (такт 17)
  const words1 = ['Nepřijeli', 'jsme', 'bojovat,'], words2 = ['přijeli', 'jsme', 'za', 'přáteli.'];
  const kin = [
    ...words1.map((w, i) => `tl.fromTo("#k1w${i}", {yPercent:120, skewX:-12}, {yPercent:0, skewX:0, duration:0.28, ease:"power4.out"}, ${at(s(16, i))});`),
    ...words2.map((w, i) => `tl.fromTo("#k2w${i}", {scale:2.4, opacity:0}, {scale:1, opacity:1, duration:0.2, ease:"expo.out"}, ${at(s(17) + i * 0.035)});`),
    `tl.fromTo("#k-en", {opacity:0, y:${Math.round(2 * u)}}, {opacity:1, y:0, duration:0.3, ease:"power2.out"}, ${at(s(17, 2))});`,
    `tl.fromTo("#kin-cam", {scale:1}, {scale:1.08, duration:${len(s(16), s(18))}, ease:"none"}, ${at(s(16))});`,
    `tl.fromTo("#kin-slash", {xPercent:-140}, {xPercent:140, duration:0.45, ease:"power2.inOut"}, ${at(s(17) - 0.1)});`,
    `tl.fromTo("#flash", {opacity:0.9}, {opacity:0, duration:0.35, ease:"power2.out", immediateRender:false}, ${at(s(17))});`,
  ].join('\n      ');

  // вспышки-«видения» постановочного фото с кубком
  const BLINKS = [[s(17) + 0.06, 0.1], [s(24, 3), 0.1], [s(30, 2), 0.14]];
  const blinks = ['tl.set("#blink", {opacity:0}, 0);', ...BLINKS.map(([t, d]) => `tl.set("#blink", {opacity:1}, ${at(t)});\n      tl.fromTo("#blink .bf", {scale:1.08}, {scale:1, duration:${d}, ease:"none", immediateRender:false}, ${at(t)});\n      tl.set("#blink", {opacity:0}, ${at(t + d)});`)].join('\n      ');

  const html = `<!doctype html>
<html lang="cs">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <title>H-BATTLE 2026 – začátek (${P ? '9:16' : '16:9'}) — v4</title>
    <script src="assets/gsap.min.js"></script>
    <style>
      ${FONTS}
      :root { --blue:#304285; --red:#e31e24; --navy:#0b1e42; --ice:#eef2f9; }
      body { margin:0; background:var(--navy); color:var(--ice); font-family:'Source Sans 3', sans-serif; }
      #root { position:relative; width:100%; height:100%; overflow:hidden; background:var(--navy); }
      .clip { position:absolute; inset:0; }

      /* постер-фон */
      #stage { position:absolute; inset:0; overflow:hidden; }
      #st-bg { position:absolute; inset:${px(-6)}; background:radial-gradient(90% 60% at 50% 38%, #1d3a86 0%, #0b1e42 62%, #050d22 100%); }
      #st-rays { position:absolute; left:50%; top:38%; width:${px(260)}; height:${px(260)}; margin:${px(-130)} 0 0 ${px(-130)}; border-radius:50%; opacity:.22;
        background:repeating-conic-gradient(from 0deg, rgba(238,242,249,.55) 0deg 3deg, transparent 3deg 14deg);
        -webkit-mask-image:radial-gradient(circle, #000 0%, transparent 62%); }
      .band { position:absolute; left:${px(-10)}; width:calc(100% + ${px(20)}); top:${P ? '6%' : '0%'}; height:${P ? '70%' : '100%'}; transform-origin:50% 50%; }
      #st-band { position:absolute; inset:0; rotate:${P ? -24 : -12}deg; opacity:.55; }
      #st-dots { position:absolute; inset:0; opacity:.16; background:radial-gradient(circle, #9cc8f0 ${px(0.18)}, transparent ${px(0.24)}) 0 0 / ${px(1.6)} ${px(1.6)};
        -webkit-mask-image:linear-gradient(180deg, transparent 0%, #000 55%, transparent 100%); }
      .star { position:absolute; background:#fff; clip-path:polygon(50% 0, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0 50%, 40% 40%); box-shadow:0 0 ${px(1)} #fff; }

      #three-wrap { position:absolute; inset:0; }
      #three-layer { width:100%; height:100%; display:block; }

      /* шоты */
      .cam { position:absolute; inset:0; }
      .pbox { position:absolute; }
      .pbox.panel .clipbox { box-shadow:0 0 0 ${px(0.7)} var(--ice), ${px(1.6)} ${px(2)} ${px(4)} rgba(0,0,0,.55); }
      .clipbox { position:absolute; inset:0; overflow:hidden; }
      .ph, .gbg, .gfg { position:absolute; inset:0; background-size:cover; background-position:50% 50%; background-repeat:no-repeat; }
      .rv { position:absolute; inset:0; }
      .gfg { filter:drop-shadow(${px(0.8)} ${px(1.2)} ${px(1.4)} rgba(0,0,0,.55)); transform-origin:50% 100%; }
      .word { position:absolute; font-family:Montserrat; font-weight:900; font-style:italic; line-height:.9; text-transform:uppercase; white-space:nowrap; pointer-events:none; }
      .word span { display:inline-block; color:transparent; -webkit-text-stroke:${px(0.35)} rgba(238,242,249,.9); text-shadow:${px(0.9)} ${px(0.9)} 0 rgba(227,30,36,.75); }
      .slash { position:absolute; left:-20%; top:-20%; width:140%; height:140%; rotate:-18deg; pointer-events:none; }
      .slash i { position:absolute; left:0; right:0; height:9%; }
      .slash i:nth-child(1) { top:40%; background:var(--ice); } .slash i:nth-child(2) { top:49%; background:var(--red); } .slash i:nth-child(3) { top:58%; background:var(--blue); }
      .plate { position:absolute; display:flex; flex-direction:column; background:#000; padding:${px(1.4)} ${px(3)}; border-left:${px(1.2)} solid var(--red);
        clip-path:polygon(0 0, 100% 0, 96% 100%, 0 100%); }
      .plate b { font-family:Montserrat; font-weight:900; font-style:italic; font-size:${px(P ? 6 : 4.4)}; text-transform:uppercase; letter-spacing:.01em; line-height:1; }
      .plate i { font-style:normal; font-weight:600; font-size:${px(P ? 3.4 : 2.5)}; color:#ffd36b; margin-top:${px(0.6)}; }
      .caption { position:absolute; font-family:Montserrat; font-weight:900; font-style:italic; font-size:${px(P ? 6.4 : 4.4)}; line-height:1.05; text-shadow:0 ${px(0.4)} ${px(1.6)} rgba(0,0,0,.7); }
      .caption span { display:block; font-family:'Source Sans 3'; font-style:normal; font-weight:600; font-size:.5em; margin-top:${px(1)}; opacity:.9; }

      /* титул */
      #title-clip .t-wrap { position:absolute; left:${px(5)}; right:${px(5)}; top:${P ? '53%' : '60%'}; display:flex; flex-direction:column; align-items:center; text-align:center; gap:${px(1.2)}; }
      .t-main { font-family:Montserrat; font-weight:900; font-style:italic; font-size:${px(P ? 13 : 9.5)}; line-height:.95; text-shadow:${px(0.6)} ${px(0.6)} 0 var(--red), 0 ${px(0.8)} ${px(3)} rgba(0,0,0,.6); }
      .t-cup { font-family:Montserrat; font-weight:800; font-style:italic; font-size:${px(P ? 4 : 2.9)}; text-transform:uppercase; letter-spacing:.04em; }
      .t-sub { font-family:Montserrat; font-weight:600; font-size:${px(P ? 3.6 : 2.5)}; letter-spacing:.18em; text-transform:uppercase; color:#ffd36b; }

      /* кинетика */
      #kin-cam { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; padding:0 ${px(6)} ${px(P ? 14 : 6)}; }
      .k-line { display:flex; flex-wrap:wrap; gap:0 ${px(2.2)}; font-family:Montserrat; font-weight:900; font-style:italic; text-transform:uppercase; line-height:.98; }
      #k-l1 { font-size:${px(P ? 12 : 9)}; }
      #k-l2 { font-size:${px(P ? 13.5 : 10.5)}; margin-top:${px(1)}; }
      .k-mask { display:block; overflow:hidden; padding:0 ${px(1)} ${px(0.6)} 0; }
      .k-word { display:block; text-shadow:${px(0.6)} ${px(0.6)} 0 rgba(227,30,36,.8); }
      .k-word.red { color:var(--red); text-shadow:${px(0.6)} ${px(0.6)} 0 var(--ice); }
      #k-l2 .k-word { transform-origin:50% 60%; }
      #k-en { font-size:${px(P ? 4.4 : 3.2)}; font-weight:600; margin-top:${px(2)}; color:#ffd36b; }
      #kin-slash { position:absolute; left:-20%; top:-20%; width:140%; height:140%; rotate:-18deg; pointer-events:none; }
      #kin-slash i { position:absolute; left:0; right:0; height:6%; }
      #kin-slash i:nth-child(1) { top:44%; background:var(--ice); } #kin-slash i:nth-child(2) { top:50%; background:var(--red); } #kin-slash i:nth-child(3) { top:56%; background:var(--blue); }
      #flash { position:absolute; inset:0; background:var(--ice); opacity:0; pointer-events:none; }

      /* вспышка-видение */
      #blink { position:absolute; inset:0; opacity:0; pointer-events:none; }
      #blink .bb, #blink .bf { position:absolute; inset:0; background-size:cover; background-position:50% 40%; }
      #blink .bb { background-image:url(assets/gfx/p_winners_bg.jpg); }
      #blink .bf { background-image:url(assets/gfx/p_winners_fg.png); }
      #blink::after { content:""; position:absolute; inset:0; background:radial-gradient(circle, rgba(255,233,170,.0) 40%, rgba(255,233,170,.55) 100%); }

      /* плашки сцен */
      .chip { position:absolute; left:${px(6)}; ${P ? `bottom:${px(31)}` : `bottom:${px(5)}`}; display:flex; align-items:baseline; gap:${px(1.8)};
        background:#000; border-left:${px(1.2)} solid var(--red); padding:${px(1.4)} ${px(3.4)} ${px(1.4)} ${px(2.4)}; clip-path:polygon(0 0, 100% 0, 95% 100%, 0 100%); }
      .chip-num { font-family:Montserrat; font-weight:900; font-style:italic; font-size:${px(P ? 4.4 : 3.2)}; color:var(--red); }
      .chip-cz { font-family:Montserrat; font-weight:900; font-style:italic; font-size:${px(P ? 4.4 : 3.2)}; text-transform:uppercase; }
      .chip-en { font-size:${px(P ? 3.2 : 2.4)}; color:#ffd36b; font-weight:600; }

      /* финал */
      #outro .o-wrap { position:absolute; left:${px(P ? 6 : 22)}; right:${px(P ? 6 : 22)}; top:${P ? '64%' : '73%'}; display:flex; flex-direction:column; align-items:center; text-align:center; gap:${px(1.2)};
        background:#000; padding:${px(1.8)} ${px(3)}; border-left:${px(1.2)} solid var(--red); }
      .o-quote { font-family:Montserrat; font-weight:900; font-style:italic; font-size:${px(P ? 5 : 3.2)}; line-height:1.08; text-transform:uppercase; }
      .o-quote .red { color:var(--red); }
      .o-meta { font-family:Montserrat; font-weight:600; font-size:${px(P ? 3 : 2.1)}; letter-spacing:.16em; text-transform:uppercase; color:#ffd36b; }

      /* виджет-проигрыватель */
      #player { position:absolute; right:${f(CM)}; bottom:${f(CB)}; width:${f(CW)}; height:${f(CH)}; }
      #card { position:absolute; inset:0; border-radius:${f(CH * 0.22)}; background:linear-gradient(135deg, rgba(48,66,133,.95), rgba(11,30,66,.97));
        box-shadow:0 ${px(1.2)} ${px(4)} rgba(0,0,0,.5), inset 0 0 0 ${px(0.15)} rgba(238,242,249,.2); }
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
      .p-title { font-family:Montserrat; font-weight:900; font-style:italic; font-size:${px(P ? 3.4 : 2.3)}; line-height:1.1; white-space:nowrap; }
      .p-artist { font-size:${px(P ? 2.6 : 1.75)}; font-weight:600; opacity:.72; white-space:nowrap; }
      .p-row { display:flex; align-items:center; gap:${px(1.2)}; font-size:${px(P ? 2.2 : 1.5)}; font-weight:600; opacity:.9; }
      .p-bar { position:relative; flex:1; height:${px(0.5)}; background:rgba(238,242,249,.22); border-radius:${px(0.5)}; overflow:hidden; }
      #p-fill { position:absolute; inset:0; background:var(--red); transform-origin:left center; }
      #p-eq { display:flex; align-items:flex-end; gap:${px(0.4)}; height:${px(P ? 2.2 : 1.5)}; }
      #p-eq i { display:block; width:${px(0.55)}; height:100%; background:var(--ice); transform-origin:bottom center; }
      .nw { white-space:nowrap; }
      #wipe-holder { position:absolute; inset:0; overflow:hidden; pointer-events:none; }
      #wipe { position:absolute; left:-30%; top:-30%; width:160%; height:160%; rotate:-18deg; }
      #wipe i { position:absolute; left:0; right:0; height:24%; }
      #wipe i:nth-child(1) { top:14%; background:var(--ice); } #wipe i:nth-child(2) { top:38%; background:var(--red); } #wipe i:nth-child(3) { top:62%; background:var(--blue); }
      #proto-badge { position:absolute; right:${px(3)}; top:${px(3)}; font-family:Montserrat; font-weight:600; font-size:${px(2)}; letter-spacing:.2em; opacity:.5; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-width="${W}" data-height="${H}" data-duration="${DUR}" data-fps="30">
      <div id="stage">
        <div id="st-bg"></div><div id="st-rays"></div>
        <div id="st-band">${band}</div>
        <div id="st-dots"></div>
        ${starsHtml}
      </div>

      ${SHOTS.map(shotHtml).join('')}

      <div id="three-wrap"><canvas id="three-layer"></canvas></div>

      <section id="title-clip" class="clip" data-start="${at(s(2))}" data-duration="${len(s(2), s(5))}" data-track-index="3">
        <div class="t-wrap">
          <div id="t-main" class="t-main">H-BATTLE 2026</div>
          <div id="t-cup" class="t-cup">Hard Baits Area Trout Fishing European Cup</div>
          <div id="t-sub" class="t-sub"><span class="nw">Hofer Lake · Pružina (SK)</span> · <span class="nw">2.–4. 10. 2026</span></div>
        </div>
      </section>

      <section id="kin" class="clip" data-start="${at(s(16))}" data-duration="${len(s(16), s(18))}" data-track-index="3">
        <div id="kin-slash"><i></i><i></i><i></i></div>
        <div id="kin-cam">
          <div id="k-l1" class="k-line">${words1.map((w, i) => `<span class="k-mask"><span id="k1w${i}" class="k-word">${w}</span></span>`).join('')}</div>
          <div id="k-l2" class="k-line">${words2.map((w, i) => `<span class="k-mask"><span id="k2w${i}" class="k-word${i === 3 ? ' red' : ''}">${w}</span></span>`).join('')}</div>
          <div id="k-en">We didn’t come to fight. We came for friends.</div>
        </div>
      </section>

      ${chipsHtml}

      <section id="outro" class="clip" data-start="${at(s(29))}" data-duration="${len(at(s(29)), DUR)}" data-track-index="3">
        <div class="o-wrap">
          <div id="o-quote" class="o-quote">Nepřijeli jsme bojovat. <span class="red">Přijeli jsme za přáteli.</span></div>
          <div id="o-meta" class="o-meta">Pružina (SK) · <span class="nw">2.–4. 10. 2026</span></div>
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
          <div class="p-title">H-BATTLE 2026</div>
          <div class="p-artist">začátek · Trout Area CZ</div>
          <div class="p-row"><div id="p-eq"><i></i><i></i><i></i><i></i><i></i></div><span id="p-time">0:00</span><div class="p-bar"><div id="p-fill"></div></div><span>${Math.floor(SONG / 60)}:${String(Math.round(SONG % 60)).padStart(2, '0')}</span></div>
        </div>
      </div>
      <div id="wipe-holder"><div id="wipe"><i></i><i></i><i></i></div></div>
      <div id="proto-badge">DRAFT · v4</div>

      <audio id="bgm" src="assets/track_edit60.wav" data-start="${T0}" data-duration="${SONG}" data-track-index="9" data-volume="1"></audio>
    </div>

    <script>
      const tl = gsap.timeline({ paused: true });
      tl.fromTo("#st-rays", { rotation: 0 }, { rotation: 40, duration: ${DUR}, ease: "none" }, 0);
      tl.fromTo("#st-band", { xPercent: -4 }, { xPercent: 4, duration: ${DUR}, ease: "none" }, 0);
      ${starTweens}
      tl.fromTo("#three-wrap", { opacity: 1 }, { opacity: 0, duration: 0.25 }, ${at(s(5) - 0.25)});
      tl.to("#three-wrap", { opacity: 1, duration: 0.3 }, ${at(s(29) - 0.15)});
      tl.fromTo("#t-main", { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: 0.35, ease: "expo.out" }, ${at(s(2))});
      tl.fromTo("#t-cup", { opacity: 0, xPercent: -8 }, { opacity: 1, xPercent: 0, duration: 0.45, ease: "power3.out" }, ${at(s(2, 2))});
      tl.fromTo("#t-sub", { opacity: 0, y: ${Math.round(2 * u)} }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, ${at(s(3))});
      ${kin}
      ${shotTweens}
      ${SCENES.map(([st, , id]) => `tl.fromTo("#chip-${id} .chip", {xPercent:-120}, {xPercent:0, duration:0.35, ease:"power3.out"}, ${at(st + G.beat)});`).join('\n      ')}
      tl.fromTo("#o-quote", { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: 0.35, ease: "expo.out" }, ${at(s(29, 2))});
      tl.fromTo("#o-meta", { opacity: 0 }, { opacity: 1, duration: 0.5 }, ${at(s(30))});
      ${blinks}
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
      const T0 = ${T0}, OUT0 = ${s(29)}, INTRO_END = ${s(5)};
      function renderAt(tt) {
        const t = tt - T0;
        camera.position.set(Math.sin(t * 0.15) * 0.25, 0, 6.2); camera.lookAt(0, 0, 0);
        if (t > 0 && t < INTRO_END + 0.1) {
          const a = eo(t / 1.8);
          hb.visible = true; ta.visible = false;
          hb.position.set(0, PORTRAIT ? 1.3 : 0.75, lerp(-24, 0, a));
          hb.rotation.set(Math.sin(t * 0.9) * 0.06, lerp(-2.6 * 2, 0, eo(t / 2.2)) + Math.sin(t * 0.7) * 0.08, 0);
          hb.scale.setScalar(PORTRAIT ? 0.85 : 0.62);
          key.position.set(lerp(-6, 6, clamp((t - 1.4) / 1.6)), 2, 4); rim.intensity = 0;
        } else if (t >= OUT0 - 0.15) {
          const lt = t - OUT0, a = eo(lt / 1.2);
          hb.visible = ta.visible = true;
          const sc = PORTRAIT ? 0.42 : 0.42;
          ta.scale.setScalar(sc); hb.scale.setScalar(sc);
          if (PORTRAIT) { ta.position.set(lerp(-6, -0.62, a), 2.15, 0); hb.position.set(lerp(6, 0.62, a), 2.15, 0); }
          else { ta.position.set(lerp(-8, -2.55, a), 0.15, 0); hb.position.set(lerp(8, 2.55, a), 0.15, 0); }
          ta.rotation.set(0, lerp(2.2, 0, eo(lt / 1.6)) + Math.sin(lt * 0.8) * 0.06, 0);
          hb.rotation.set(0, lerp(-2.2, 0, eo(lt / 1.6)) - Math.sin(lt * 0.8) * 0.06, 0);
          key.position.set(lerp(-6, 6, clamp((lt - 2.2) / 1.6)), 2, 4);
          rim.position.set(0, -2, 2.5); rim.intensity = 4 * clamp((lt - 1) / 1);
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
