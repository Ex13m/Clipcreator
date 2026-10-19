// FINALE · bars 45–55 + tail to the end of the track (peak → fade). Event world (not a sponsor): black, deep water, cold accent.
//
//   A  bars 0–1   PEAK MONTAGE: one partner per beat (8 beats = 8 partners), hard colour-blocked cuts in each brand's world
//                 (brand colours + brand display font as a tone-on-tone name + the hero product), "DĚKUJEME / PARTNERŮM" on top,
//                 type colour flips per card (dark type on the light worlds) — synced to VO „Děkujeme všem partnerům…“
//   B  bars 2–5   BURST: all products explode out of the centre on the bar-2 downbeat while the TA plate flies in as hero →
//                 kinetic event poster built line by line on the VO (title · Trout Area 2026 · date odometer · place · closer)
//   C  bars 6–8   LOGO WALL: partners in equal weight (same optical area), below the TA hero, hairline grid, metallic glint
//                 across every logo on the downbeats
//   D  drop→end   SIGN-OFF on the music drop: misty lake, „Uvidíme se u vody“, event line, MADE BY ⚙ © 2026 Gausse Holler;
//                 everything fades to black except the TA hero and the GH mark
import * as fx from '../lib/fx.mjs';

export const theme = { bg: '#04060a', bg2: '#0e2233', fg: '#ffffff', accent: '#8fe3ff', accent2: '#ffffff', font: { display: 'Archivo', text: 'Inter' }, wght: 900, upper: true };
export const meta = { reel: false };

// ---- A: one card per partner (film order). p = index into data.products; bg = radial [centre, edge]; fg = type colour on this card;
//      name = the partner's name in ITS web/display font, tone-on-tone behind the product (type, not logo artwork)
const CARDS = [
  { k: 'venue', photo: 'assets_prep/libechov/venue/v03_trout_in_net.jpg', pos: '50% 38%', fg: '#ffffff' },
  { k: 'troutshop', p: 0, h: 660, rot: -10, bg: ['#5c0009', '#070707'], glow: '#e3000f', go: 0.5, fg: '#ffffff', name: 'TROUTSHOP', font: 'Anton', wght: 400, nc: 'rgba(227,0,15,.34)' },
  { k: 'activefishing', p: 0, rot: -6, bg: ['#ffffff', '#efe7dc'], glow: '#f0a24a', go: 0.45, fg: '#141414', name: 'activefishing', font: 'Nunito', wght: 900, upper: false, nc: 'rgba(223,89,66,.16)' },
  { k: 'moonky', p: 0, rot: -8, bg: ['#24305c', '#0e1424'], glow: '#ff4f8b', go: 0.42, fg: '#ffffff', name: 'MOONKY', font: 'Unbounded', wght: 900, nc: 'rgba(184,255,46,.16)' },
  { k: 'jigovky', p: 1, rot: -8, bg: ['#ffe866', '#f4c400'], glow: '#ffffff', go: 0.55, fg: '#0c2414', name: 'jigovky', font: 'Poppins', wght: 900, upper: false, nc: 'rgba(23,110,55,.18)' },
  { k: 'velkaryba', p: 4, rot: -6, bg: ['#22599a', '#0f2541'], glow: '#7fb0e6', go: 0.32, fg: '#ffffff', name: 'VELKÁ RYBA', font: 'Oswald', wght: 700, nc: 'rgba(127,176,230,.18)' },
  { k: 'bosset', trio: [1, 0, 2], bg: ['#ffffff', '#bfe6f8'], glow: '#1b97b1', go: 0.22, fg: '#0b1d24', name: 'bosset', font: 'Outfit', wght: 800, upper: false, nc: 'rgba(27,151,177,.18)' },
  { k: 'gausseholler', p: 2, h: 700, bg: ['#3a434c', '#0f1113'], glow: '#7fb2c7', go: 0.5, fg: '#e9e6e2', name: 'Gausse Holler', font: 'Playfair Display', wght: 900, italic: true, upper: false, nc: 'rgba(240,144,79,.18)' },
];
// ---- B: products that explode out of the centre on the bar-2 downbeat (every sponsor, other products than in A)
// they burst out from behind the TA logo and settle into a depth-of-field constellation around it: small + sharp = focal plane
// (next to the logo), big + blurred = close to the camera (frame edges). [key, product, x, y, box px, blur px, opacity, rot]
const BURST = [
  ['troutshop', 3, 150, 410, 190, 0, 1, -18], ['moonky', 3, 360, 330, 170, 0, 1, 8], ['bosset', 0, 540, 330, 200, 0, 1, 0], ['jigovky', 2, 720, 330, 170, 0, 1, -6], ['velkaryba', 0, 930, 410, 190, 0, 1, 22],
  ['activefishing', 1, 110, 650, 150, 0, 1, 12], ['moonky', 2, 975, 650, 170, 0, 1, -14],
  ['velkaryba', 3, 120, 1580, 420, 9, 0.6, 30], ['troutshop', 2, 980, 1620, 440, 9, 0.6, -20],
];

export default function finale(ctx) {
  const E = ctx.event, D = ctx.data, T = theme, { bar, BEAT } = ctx;
  const L = ctx.safe.left, CW = ctx.W - L - ctx.safe.right, CX = ctx.W / 2;
  const voAt = (q, d) => ctx.vo.at(q) ?? d;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const tB = bar(2), tC = bar(6), tD = ctx.at(8, 2), tGH = bar(10), tFade = bar(11), END = ctx.dur;
  const beatsA = ctx.beats.filter((t) => t < tB - 0.05).slice(0, CARDS.length);
  let html = fx.field(ctx, { kind: 'radial', c1: T.bg2, c2: T.bg, at: '50% 42%' });
  const fitSize = (text, o) => ctx.fit(ctx.nb(text), { maxW: CW, maxLines: 1, ...o }).size;

  // =====================================================================================================
  // A · PEAK MONTAGE (bars 0–1)
  // =====================================================================================================
  const tH1 = clamp(ctx.snap(voAt('Děkujeme', 0.25), 'half'), 0.1, 0.5);
  const tH2 = clamp(ctx.snap(voAt('partnerům', 1.19), 'half'), tH1 + 0.4, bar(1));
  const y1 = 404;
  const h1o = { font: 'Archivo', wght: 900, wdth: 75, upper: true, tracking: -0.02, sizes: [210, 200, 190, 180, 170, 160, 150] };
  const h2o = { font: 'Archivo', wght: 900, wdth: 75, upper: true, tracking: -0.02, sizes: [190, 180, 176, 170, 160, 150, 140] };
  const s2 = fitSize(E.thanks2, h2o), y2 = 1446 - s2 * 0.98;
  const H1 = fx.headline(ctx, { id: 'h1', text: E.thanks1, x: L, y: y1, w: CW, maxLines: 1, ...h1o, align: 'center', color: CARDS[0].fg, t: tH1, reveal: 'chars', stagger: 0.028, d: 0.55, variable: true });
  const H2 = fx.headline(ctx, { id: 'h2', text: E.thanks2, x: L, y: y2, w: CW, maxLines: 1, ...h2o, align: 'center', color: CARDS[0].fg, t: tH2, reveal: 'chars', stagger: 0.024, d: 0.5, variable: true });
  fx.varType(ctx, H1.sel, tH1, { from: { wght: 300, wdth: 62, trk: 0.08 }, to: { wght: 900, wdth: 75, trk: -0.02 }, d: 0.9, ease: 'expo.out' });
  fx.varType(ctx, H2.sel, tH2, { from: { wght: 300, wdth: 62, trk: 0.08 }, to: { wght: 900, wdth: 75, trk: -0.02 }, d: 0.9, ease: 'expo.out' });
  // product zone between the two lines
  const zTop = y1 + H1.h + 24, zBot = y2 - 18, zCy = (zTop + zBot) / 2, zH = zBot - zTop;

  CARDS.forEach((c, i) => {
    const t0 = beatsA[i] ?? i * BEAT, t1 = beatsA[i + 1] ?? tB, dk = ctx.dataOf(c.k);
    let h = '';
    if (c.photo) {
      h += fx.photo(ctx, { id: `c${i}ph`, src: c.photo, pos: c.pos, kb: { from: { scale: 1.18 }, to: { scale: 1.04 }, t0, t1: t1 + 0.2, ease: 'expo.out' } });
      h += `<div class="fx-full" style="background:linear-gradient(180deg,rgba(26,33,46,.78) 0%,rgba(18,60,85,.18) 34%,rgba(18,60,85,.12) 62%,rgba(26,33,46,.8) 100%)"></div>`;
    } else {
      // brand world: radial colour field + product halo in ONE layer (fewer heavy gradient layers in the capture)
      const at = `50% ${Math.round(((zCy + 40) / ctx.H) * 100)}%`;
      h += `<div class="fx-field" id="${ctx.id(`c${i}f`)}" style="background:radial-gradient(560px 560px at ${at},${ctx.rgba(c.glow, c.go)},${ctx.rgba(c.glow, 0)} 100%),radial-gradient(120% 80% at ${at},${c.bg[0]} 0%,${c.bg[1]} 100%)"></div>`;
      const ns = c.ns || 330;
      h += fx.bigType(ctx, { id: `c${i}n`, text: c.name, font: c.font, wght: c.wght, size: ns, x: 30, y: zCy - ns * 0.46, color: c.nc, upper: c.upper ?? true, tracking: c.font === 'Anton' ? 0 : -0.03, drift: -110, t0, t1, style: c.italic ? 'font-style:italic' : '' });
      const items = c.trio ? c.trio.map((pi, j) => ({ pi, j, off: (j - 1) * 250, hh: j === 1 ? zH * 0.98 : zH * 0.86 })) : [{ pi: c.p, j: 0, off: 0, hh: Math.min(zH, c.h || zH) }];
      // trio: side bottles first (painted behind), centre bottle last
      items.sort((a, b) => Math.abs(b.off) - Math.abs(a.off)).forEach(({ pi, j, off, hh }) => {
        const p = dk.products[pi], [nw, nh] = ctx.dims(p.src), ar = nw / nh;
        const w = Math.min(860, hh * ar, nw);
        const id = `c${i}p${j}`;
        const P = fx.product(ctx, { id, src: p.src, w, cx: CX + off, cy: zCy + (c.trio ? (j === 1 ? 0 : (zH * 0.98 - hh) / 2) : 0), ground: 'float', shadow: c.bg ? 0.42 : 0.5, pad: p.pad, rot: c.rot || 0, maxUp: 1.0 });
        h += P.html;
        ctx.tl.fromTo(P.sel, { scale: 1.24, x: (i % 2 ? 1 : -1) * 90, rotation: off ? off / 60 : -5 }, { scale: 1, x: 0, rotation: 0, duration: 0.42, ease: 'expo.out' }, t0 + (c.trio ? Math.abs(off) / 2500 : 0));
        fx.pushIn(ctx, P.cam, t0, t1 + 0.1, { from: 1, to: 1.06, ease: 'none' });
        fx.sweep(ctx, id, t0 + 0.06, { d: 0.42 });
      });
    }
    html += fx.scene(ctx, `c${i}`, t0, t1, h, { inD: 0.001, outD: 0.001 });
    // type colour flips with the card (dark type on light brand worlds)
    if (i) { ctx.tl.set(H1.sel, { color: c.fg }, t0); ctx.tl.set(H2.sel, { color: c.fg }, t0); }
  });
  html += fx.scene(ctx, 'sA', 0, tB, H1.html + H2.html, { outD: 0.001 });
  fx.tIn(ctx, 'flash', { color: '#ffffff', d: 0.4 });                    // gausseholler hands over on white (zoom-through)
  fx.flash(ctx, bar(1), { id: 'pk1', color: '#ffffff', peak: 0.45, d: 0.28 });
  fx.chroma(ctx, H1.sel, bar(1), { amt: 12, d: 0.35 });
  fx.chroma(ctx, H2.sel, bar(1), { amt: 12, d: 0.35 });

  // =====================================================================================================
  // B · BURST + TA hero + kinetic event poster (bars 2–5)
  // =====================================================================================================
  const HERO = { scale: 2.2, cy: 600, fly: 0.8 };
  const PH = ctx.plate.hero(tB, END, HERO);
  // background for B + C: the actual competition pond, duotone deep water, slow pull-back; aurora + vignette
  let bg = fx.photo(ctx, { id: 'bph', src: 'assets_prep/libechov/venue/v01_maly_sportacek.jpg', treat: 'duo', d1: '#04060a', d2: '#2f86ad', pos: '50% 60%', kb: { from: { scale: 1.22 }, to: { scale: 1.04 }, t0: tB, t1: tD + 1.4 }, style: 'opacity:.42' });
  bg += fx.mesh(ctx, { id: 'mesh', colors: ['#0d3550', '#1b4f7a', '#0a5a66', '#26215a'], size: 1000, blur: 160, opacity: 0.55, drift: 240, seed: 9, t0: tB, t1: tD + 1.4 });
  bg += `<div class="fx-full" style="background:radial-gradient(90% 60% at 50% 46%,rgba(4,6,10,0) 0%,rgba(4,6,10,.55) 70%,rgba(4,6,10,.9) 100%)"></div>`;
  bg += fx.glow(ctx, { id: 'hg', x: CX, y: HERO.cy, size: 1300, color: '#1d6f95', opacity: 0.55 });
  html += fx.scene(ctx, 'sbg', tB, tD + 1.4, bg, { outD: 1.2 });

  // burst: products fly out of the centre, past the camera (expo.out), fading as they leave
  let bu = '';
  const BX = CX, BY = HERO.cy;          // burst origin = behind the TA logo landing spot
  BURST.forEach(([k, pi, x, y, box, blur, op, rot], j) => {
    const p = ctx.dataOf(k).products?.[pi]; if (!p) return;
    const [nw, nh] = ctx.dims(p.src), ar = nw / nh;
    const w = Math.min(box, box * ar, nw);
    const P = fx.product(ctx, { id: `bu${j}`, src: p.src, w, cx: x, cy: y, ground: 'none', sweep: !blur, pad: p.pad, maxUp: 1.0 });
    bu += P.html;
    const d = 1.1 + 0.05 * j;
    ctx.tl.fromTo(P.sel, { x: BX - x, y: BY - y, scale: 0.15, rotation: rot - 160 }, { x: 0, y: 0, scale: 1, rotation: rot, duration: d, ease: 'expo.out' }, tB + 0.02 * j);
    ctx.tl.fromTo(P.sel, { opacity: 0 }, { opacity: op, duration: 0.25, ease: 'none' }, tB + 0.02 * j);
    if (blur) ctx.tl.fromTo(`#${ctx.id(`bu${j}-im`)}`, { filter: 'blur(0px)' }, { filter: `blur(${blur}px)`, duration: 0.9, ease: 'power2.inOut' }, tB + 0.45);
    else {
      fx.sweep(ctx, `bu${j}`, bar(4) + 0.05 * j, { d: 0.6 });
      [bar(3), bar(4), bar(5)].forEach((t) => fx.punch(ctx, P.sel, t, { scale: 1.14, d: 0.32 }));   // the crown pulses on the downbeats
    }
    fx.float(ctx, P.cam, tB + d, tC, { y: blur ? -26 : -12, rot: blur ? 3 : 2, period: ctx.BAR / (blur ? 1 : 2) });
  });
  bu = `<i class="fin-ring" id="${ctx.id('ring')}" style="left:${BX - 300}px;top:${BY - 300}px"></i>` + bu;
  ctx.tl.fromTo(ctx.sel('ring'), { scale: 0.15, opacity: 0.9 }, { scale: 2.6, opacity: 0, duration: 0.75, ease: 'expo.out' }, tB);
  html += fx.scene(ctx, 'sbu', tB, tC, bu, { outD: 0.35 });
  fx.flash(ctx, tB, { id: 'pk2', color: '#ffffff', peak: 0.75, d: 0.4 });

  // poster lines (centred under the TA hero), each lands on the beat nearest its VO word
  const tTitle = tB + 0.08, tSub = tB + BEAT;
  const tDate = clamp(ctx.snap(voAt('24.', bar(3)), 'beat'), tB + 1.0, bar(4));
  const tPlace = clamp(ctx.snap(voAt('Líheň', bar(4) + BEAT * 2), 'beat'), tDate + 1.3, bar(5));
  const tClose = clamp(ctx.snap(voAt('Uvidíme', bar(5) + BEAT), 'beat'), tPlace + 0.9, tC - 1.2);
  let yy = PH.y + PH.h + 56;
  const pT = fx.headline(ctx, { id: 'pt', text: E.title1, x: L, y: yy, w: CW, maxLines: 1, font: 'Archivo', wght: 900, wdth: 75, upper: true, tracking: -0.01, sizes: [132, 126, 120, 112, 104, 96], align: 'center', t: tTitle, reveal: 'lines', d: 0.7, variable: true });
  fx.varType(ctx, pT.sel, tTitle, { from: { wght: 300, wdth: 62, trk: 0.06 }, to: { wght: 900, wdth: 75, trk: -0.01 }, d: 1.1, ease: 'expo.out' });
  yy += pT.h + 16;
  const pS = fx.headline(ctx, { id: 'ps', text: E.title2, x: L, y: yy, w: CW, maxLines: 1, font: 'Archivo', wght: 500, wdth: 100, sizes: [66, 62, 58], align: 'center', color: T.accent, t: tSub, reveal: 'lines' });
  yy += pS.h + 44;
  const dSize = fitSize(E.date, { font: 'Archivo', wght: 900, sizes: [116, 110, 104, 98, 92, 86] });
  const pDate = `<div class="fx-abs" id="${ctx.id('pdw')}" style="left:${L}px;top:${yy}px;width:${CW}px">${fx.odometer(ctx, { id: 'pd', value: E.date, x: 0, y: 0, w: CW, align: 'center', size: dSize, font: 'Archivo', wght: 900, t: tDate - 0.05, d: 1.0, spins: 1, stagger: 0.04 })}</div>`;
  ctx.tl.fromTo(ctx.sel('pdw'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.35, ease: 'expo.out' }, tDate - 0.05);
  yy += dSize + 40;
  const pP = fx.headline(ctx, { id: 'pp', text: E.place, x: L, y: yy, w: CW, maxLines: 1, font: 'Archivo', wght: 800, wdth: 100, sizes: [72, 68, 64], align: 'center', t: tPlace, reveal: 'chars', stagger: 0.02 });
  yy += pP.h + 50;
  const pC = fx.headline(ctx, { id: 'pc', text: D.copy?.closer || 'Uvidíme se u vody', x: L, y: yy, w: CW, maxLines: 1, font: 'Archivo', wght: 900, wdth: 87, upper: true, tracking: -0.02, sizes: [100, 96, 92, 86, 80, 74], align: 'center', color: T.accent, t: tClose, reveal: 'chars', stagger: 0.022 });
  if (yy + pC.h > ctx.H - ctx.safe.bottom) ctx.warn(`poster runs to y ${Math.round(yy + pC.h)} > safe ${ctx.H - ctx.safe.bottom}`);
  const poster = `<div class="fx-full" id="${ctx.id('pw')}">${pT.html}${pS.html}${pDate}${pP.html}${pC.html}</div>`;
  ctx.tl.fromTo(ctx.sel('pw'), { opacity: 1, y: 0 }, { opacity: 0, y: -70, duration: 0.3, ease: 'power3.in' }, tC - 0.3);
  html += fx.scene(ctx, 'sB', tB, tC, poster, { outD: 0.001 });
  fx.chroma(ctx, pT.sel, bar(3), { amt: 8, d: 0.3 });
  fx.punch(ctx, ctx.sel('pdw'), bar(4), { scale: 1.06, d: 0.3 });

  // =====================================================================================================
  // C · LOGO WALL (bars 6 → drop): equal optical weight, below the TA hero, metallic glint on the downbeats
  // =====================================================================================================
  const keys = D.wall, cols = 2, rows = Math.ceil(keys.length / cols);
  const kY = PH.y + PH.h + 44;
  const kick = fx.headline(ctx, { id: 'wk', text: E.partnersTitle || 'Partneři mistrovství', x: L, y: kY, w: CW, maxLines: 1, font: 'Inter', wght: 700, size: 30, upper: true, tracking: 0.24, align: 'center', color: T.accent, t: tC, reveal: 'chars', stagger: 0.012 });
  const gTop = kY + 70, gBot = ctx.H - ctx.safe.bottom - 16, gL = L, gR = ctx.W - L;
  const cw = (gR - gL) / cols, ch = (gBot - gTop) / rows;
  const AREA = 21000, MAXW = 330, MAXH = Math.min(108, ch - 50);
  const GLOW = { venue: '#17a1c8', troutshop: '#e3000f', activefishing: '#e39025', moonky: '#ff4f8b', jigovky: '#fed700', velkaryba: '#3d7fd0', bosset: '#1b97b1', gausseholler: '#1d8fd5' };
  const tWall1 = tD + 0.5;
  let wall = '';
  // hairline grid (draws in from the centre)
  wall += `<i class="fin-hl fin-v" id="${ctx.id('gv')}" style="left:${CX}px;top:${gTop}px;height:${gBot - gTop}px"></i>`;
  ctx.tl.fromTo(ctx.sel('gv'), { scaleY: 0 }, { scaleY: 1, duration: 0.8, ease: 'expo.out' }, tC);
  for (let r = 0; r <= rows; r++) {
    wall += `<i class="fin-hl fin-h" id="${ctx.id(`gh${r}`)}" style="left:${gL}px;top:${Math.round(gTop + r * ch)}px;width:${gR - gL}px;opacity:${r === 0 || r === rows ? 0.5 : 1}"></i>`;
    ctx.tl.fromTo(ctx.sel(`gh${r}`), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'expo.out' }, tC + 0.04 * r);
  }
  const glints = ctx.downs.filter((t) => t >= bar(7) - 1e-3 && t < tD - 0.2);
  keys.forEach((k, i) => {
    const dk = ctx.dataOf(k), variant = k === 'velkaryba' ? 'plate' : 'on_dark';
    const rel = dk.logo?.[variant] || dk.logo?.on_dark;
    const [iw, ih] = ctx.dims(rel), ar = iw / ih;
    const bw = Math.floor(Math.min(MAXW, Math.sqrt(AREA * ar), MAXH * ar));
    const lg = ctx.logo(rel, { box: [bw, Math.ceil(bw / ar)], scale: 1.2, at: [tC, tWall1], label: `wall ${k}` });
    const col = i % cols, row = Math.floor(i / cols);
    const cx = gL + cw * (col + 0.5), cy = gTop + ch * (row + 0.5);
    const lab = k === 'venue' ? 'lihenlibechov.cz' : dk.url || '';
    wall += `<i class="fin-glow" id="${ctx.id(`wg${i}`)}" style="left:${Math.round(cx - cw / 2)}px;top:${Math.round(cy - ch / 2)}px;width:${Math.round(cw)}px;height:${Math.round(ch)}px;background:radial-gradient(closest-side,${ctx.rgba(GLOW[k] || T.accent, 0.5)},${ctx.rgba(GLOW[k] || T.accent, 0)})"></i>`;
    wall += `<div class="fx-abs fin-cell" id="${ctx.id(`w${i}`)}" style="left:${Math.round(cx - cw / 2)}px;top:${Math.round(cy - ch / 2)}px;width:${Math.round(cw)}px;height:${Math.round(ch)}px">
      <div class="fin-lg" style="width:${lg.w}px;height:${lg.h}px">${lg.html}<i class="fx-prod-sweep" id="${ctx.id(`w${i}-sw`)}" style="-webkit-mask-image:url(${lg.src});mask-image:url(${lg.src});--sa:110deg;--so:.85"></i></div>
      <span>${ctx.esc(lab)}</span></div>`;
    const t = tC + 0.12 + i * BEAT * 0.5;
    ctx.tl.fromTo(ctx.sel(`w${i}`), { opacity: 0, y: 34, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'expo.out' }, t);
    ctx.tl.fromTo(ctx.sel(`wg${i}`), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1.1, duration: 0.3, ease: 'power2.out' }, t);
    ctx.tl.fromTo(ctx.sel(`wg${i}`), { opacity: 1, scale: 1.1 }, { opacity: 0.32, scale: 1, duration: 0.9, ease: 'power2.out' }, t + 0.3);
    ctx.tl.set(ctx.sel(`w${i}`), { filter: 'none' }, t + 0.62);
    glints.forEach((g) => ctx.tl.fromTo(ctx.sel(`w${i}-sw`), { backgroundPosition: '110% 0%' }, { backgroundPosition: '-10% 0%', duration: 0.75, ease: 'power2.inOut' }, g + (col * 0.06 + row * 0.07)));
  });
  ctx.downs.filter((t) => t >= bar(8) - 1e-3 && t < tD).forEach((t) => keys.forEach((_, i) => { fx.punch(ctx, ctx.sel(`w${i}`), t, { scale: 1.05, d: 0.35 }); ctx.tl.hit(ctx.sel(`wg${i}`), { opacity: 0.9 }, { opacity: 0.32, duration: 0.5, ease: 'power2.out' }, t); }));
  html += fx.scene(ctx, 'sC', tC, tWall1, kick.html + wall, { outD: 0.5 });
  [tC, bar(8)].forEach((t, j) => fx.flash(ctx, t, { id: `fc${j}`, color: T.accent, peak: 0.22, d: 0.4, blend: 'screen' }));

  // =====================================================================================================
  // D · SIGN-OFF on the music drop: misty lake, closer, event line, MADE BY GH; fade to black (TA hero + GH stay)
  // =====================================================================================================
  let d = fx.photo(ctx, { id: 'dph', src: 'assets_prep/broll/br10_lake_mist.jpg', pos: '50% 55%', kb: { from: { scale: 1.16 }, to: { scale: 1.02 }, t0: tD, t1: END, ease: 'sine.out' } });
  d += `<div class="fx-full" style="background:linear-gradient(180deg,rgba(4,6,10,.9) 0%,rgba(4,6,10,.6) 28%,rgba(4,6,10,.58) 50%,rgba(4,6,10,.8) 72%,rgba(4,6,10,.96) 100%)"></div>`;
  const dY = PH.y + PH.h + 70;
  const dC = fx.headline(ctx, { id: 'dc', text: D.copy?.closer || 'Uvidíme se u vody', x: L, y: dY, w: CW, maxLines: 2, font: 'Archivo', wght: 900, wdth: 100, upper: true, tracking: -0.03, lh: 0.92, sizes: [160, 150, 140, 130, 120, 110], align: 'center', t: tD + 0.2, reveal: 'lines', d: 1.0, stagger: 0.14 });
  const eY = dY + dC.h + 56;
  const dE1 = fx.headline(ctx, { id: 'de1', text: `${E.title1} ${E.title2}`, x: L, y: eY, w: CW, maxLines: 1, font: 'Archivo', wght: 700, wdth: 100, sizes: [46, 44, 42, 40, 38], align: 'center', t: tD + 0.9, reveal: 'fade', d: 0.9 });
  const dE2 = fx.headline(ctx, { id: 'de2', text: `${E.date} · ${E.place}`, x: L, y: eY + dE1.h + 14, w: CW, maxLines: 1, font: 'Inter', wght: 600, sizes: [36, 34, 32], align: 'center', color: T.accent, t: tD + 1.1, reveal: 'fade', d: 0.9 });
  d += dC.html + dE1.html + dE2.html;
  html += fx.scene(ctx, 'sD', tD, END, d, { inD: 1.2 });
  // tail: fade the block to black (TA plate = root layer stays; GH mark sits in an overlay above the fade)
  ctx.overlay(`<div class="fx-ov" id="${ctx.id('fade')}" style="background:#000"></div>`);
  ctx.tl.fromTo(ctx.sel('fade'), { opacity: 0 }, { opacity: 1, duration: Math.max(1, END - tFade - 0.5), ease: 'sine.inOut' }, tFade);
  const mb = ctx.logo(D.madeby.on_dark, { box: [520, 60], scale: 2.0, at: [tGH, END], label: 'MADE BY GH' });
  ctx.overlay(`<div class="fx-abs" id="${ctx.id('mb')}" style="left:${Math.round(CX - mb.w / 2)}px;top:${Math.round(ctx.H - ctx.safe.bottom - mb.h - 24)}px">${mb.html}</div>`);
  ctx.tl.fromTo(ctx.sel('mb'), { opacity: 0, y: 16, filter: 'blur(8px)' }, { opacity: 0.92, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'expo.out' }, tGH);

  const css = `
  ${ctx.S} .fin-hl { position:absolute; display:block; background:rgba(255,255,255,.16); }
  ${ctx.S} .fin-v { width:1.5px; margin-left:-.75px; transform-origin:50% 50%; }
  ${ctx.S} .fin-h { height:1.5px; margin-top:-.75px; transform-origin:50% 50%; }
  ${ctx.S} .fin-cell { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; }
  ${ctx.S} .fin-lg { position:relative; flex-shrink:0; }
  ${ctx.S} .fin-glow { position:absolute; display:block; pointer-events:none; }
  ${ctx.S} .fin-ring { position:absolute; display:block; width:600px; height:600px; border-radius:50%; box-shadow:inset 0 0 0 5px ${T.accent}, 0 0 40px ${ctx.rgba(T.accent, 0.5)}; pointer-events:none; }
  ${ctx.S} #${ctx.id('dc')}, ${ctx.S} #${ctx.id('de1')}, ${ctx.S} #${ctx.id('de2')} { text-shadow:0 4px 30px rgba(0,0,0,.55); }
  ${ctx.S} .fin-lg .fx-logo { display:block; }
  ${ctx.S} .fin-cell span { font:600 19px/1 'Inter'; letter-spacing:.16em; text-transform:uppercase; color:#fff; opacity:.55; white-space:nowrap; }
  `;
  return { html, css };
}
