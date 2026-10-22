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
import * as gh from '../lib/fx_gausseholler.mjs';

// event world = ink + cold lake teal + ice accent (same family as the intro); deliberately NOT navy (old TA house style)
export const theme = { bg: '#04060a', bg2: '#0a2325', fg: '#ffffff', accent: '#8fe3ff', accent2: '#ffffff', font: { display: 'Archivo', text: 'Inter' }, wght: 900, upper: true };
export const meta = { reel: false };

// ---- A: one card per partner (film order). p = index into data.products; bg = radial [centre, edge]; fg = type colour on this card;
//      name = the partner's name in ITS web/display font, tone-on-tone behind the product (type, not logo artwork)
const CARDS = [
  // venue = a brand-world card like the others (was a gallery photo, t14_libechov_briefing.jpg: on the first beat after the ČRS fader it
  // read as a stray random photo for ~0.4 s before DĚKUJEME — operator 22. 10.). Líheň colours (turquoise / navy, aqua name) + its
  // trout (the venue's own fish, same cut-out as the venue block) as the „product“
  { k: 'venue', src: 'assets_prep/fish_ai/fish_rainbow_a_cut.png', h: 330, rot: -8, bg: ['#17607a', '#1a212e'], glow: '#17a1c8', go: 0.5, fg: '#ffffff', name: 'LÍHEŇ LIBĚCHOV', font: 'Montserrat', wght: 900, italic: true, nc: 'rgba(154,231,232,.16)' },
  // FT Fishing (22. 10.): its white paper + FT green, the Impulse PRO Firetiger, name in Exo 2 (its block's display font), ink type on the light world
  { k: 'ftfishing', p: 0, rot: -10, bg: ['#ffffff', '#e4e9dc'], glow: '#6DB52C', go: 0.42, fg: '#1A1A1A', name: 'FT FISHING', font: 'Exo 2', wght: 900, nc: 'rgba(109,181,44,.2)' },
  { k: 'troutshop', p: 0, h: 660, rot: -10, bg: ['#5c0009', '#070707'], glow: '#e3000f', go: 0.5, fg: '#ffffff', name: 'TROUTSHOP', font: 'Anton', wght: 400, nc: 'rgba(227,0,15,.34)' },
  { k: 'activefishing', p: 0, rot: -6, bg: ['#ffffff', '#efe7dc'], glow: '#f0a24a', go: 0.45, fg: '#141414', name: 'activefishing', font: 'Nunito', wght: 900, upper: false, nc: 'rgba(223,89,66,.16)' },
  { k: 'jigovky', p: 1, rot: -8, bg: ['#ffe866', '#f4c400'], glow: '#ffffff', go: 0.55, fg: '#0c2414', name: 'jigovky', font: 'Poppins', wght: 900, upper: false, nc: 'rgba(23,110,55,.18)' },
  { k: 'velkaryba', p: 4, rot: -6, bg: ['#22599a', '#0f2541'], glow: '#7fb0e6', go: 0.32, fg: '#ffffff', name: 'VELKÁ RYBA', font: 'Oswald', wght: 700, nc: 'rgba(127,176,230,.18)' },
  { k: 'bosset', trio: [1, 0, 2], bg: ['#ffffff', '#bfe6f8'], glow: '#1b97b1', go: 0.22, fg: '#0b1d24', name: 'bosset', font: 'Outfit', wght: 800, upper: false, nc: 'rgba(27,151,177,.18)' },
  { k: 'gausseholler', p: 2, h: 700, bg: ['#56616c', '#0f1113'], glow: '#9cc6d8', go: 0.72, fg: '#e9e6e2', name: 'Gausse Holler', font: 'Playfair Display', wght: 900, italic: true, upper: false, nc: 'rgba(240,144,79,.18)' },
];
// ---- B: products that explode out of the centre on the bar-2 downbeat (every sponsor, other products than in A;
//      v8: the Moonky slot → Crazy Fish Vibro Fat (FT Fishing), a soft lure of the same silhouette)
// they burst out from behind the TA logo and settle into a depth-of-field constellation around it: an arc of sharp products
// (focal plane, alternating colours, 200–300 px so each one reads as a product, not a sticker) + two big, fully opaque,
// rack-focused foreground pieces cropped by the bottom corners (camera-near bokeh). [key, product, x, y, box px, blur px, opacity, rot]
const BURST = [
  ['activefishing', 1, 150, 410, 230, 0, 1, -14], ['ftfishing', 1, 345, 300, 300, 0, 1, -18], ['bosset', 0, 545, 285, 290, 0, 1, 6],
  ['velkaryba', 0, 752, 310, 260, 0, 1, 22], ['troutshop', 3, 945, 425, 220, 0, 1, 12],
  ['jigovky', 0, 128, 655, 200, 0, 1, -8], ['ftfishing', 4, 972, 655, 230, 0, 1, -14],
  ['velkaryba', 3, 70, 1760, 700, 15, 1, 32], ['activefishing', 2, 1010, 1790, 640, 15, 1, -24],
];

export default function finale(ctx) {
  const E = ctx.event, D = ctx.data, T = theme, { bar, BEAT } = ctx;
  const L = ctx.safe.left, CW = ctx.W - L - ctx.safe.right, CX = ctx.W / 2;
  const voAt = (q, d) => ctx.vo.at(q) ?? d;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const tB = bar(2), tC = bar(6), tD = ctx.at(8, 2), tGH = bar(10), tFade = bar(11), END = ctx.dur;
  // one partner per beat: v8 (22. 10., Moonky out of the film) = 8 partners on the 8 beats of bars 0–1, each a full beat again.
  // (fallback if a 9th partner comes back: beat 6 splits into two 8ths, Gausse Holler keeps the full last beat before the burst)
  const beats8 = ctx.beats.filter((t) => t < tB - 0.05).slice(0, 8);
  const beatsA = CARDS.length > beats8.length ? [...beats8.slice(0, 7), (beats8[6] + beats8[7]) / 2, beats8[7]] : beats8;
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
  // DĚKUJEME is on screen from frame 1 of the finale (designed opening frame, operator 22. 10.); it settles + gains weight instead of a char reveal
  const H1 = fx.headline(ctx, { id: 'h1', text: E.thanks1, x: L, y: y1, w: CW, maxLines: 1, ...h1o, align: 'center', color: CARDS[0].fg, t: null, variable: true });
  const H2 = fx.headline(ctx, { id: 'h2', text: E.thanks2, x: L, y: y2, w: CW, maxLines: 1, ...h2o, align: 'center', color: CARDS[0].fg, t: tH2, reveal: 'chars', stagger: 0.024, d: 0.5, variable: true });
  ctx.tl.set(H1.sel, { transformOrigin: '50% 50%' }, 0);
  ctx.tl.fromTo(H1.sel, { scale: 1.06 }, { scale: 1, duration: 0.6, ease: 'expo.out' }, 0);
  fx.varType(ctx, H1.sel, 0, { from: { wght: 500, wdth: 66, trk: 0.04 }, to: { wght: 900, wdth: 75, trk: -0.02 }, d: Math.max(0.6, tH1 + 0.5), ease: 'expo.out' });
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
        const p = c.src ? { src: c.src } : dk.products[pi], [nw, nh] = ctx.dims(p.src), ar = nw / nh;
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
  // gausseholler hands over on white (zoom-through). 0.16 s (was 0.4): one white frame on the kick, the trout reads from frame 3 —
  // the long fade left ~0.3 s of milky, washed-out frames on the peak downbeat (same treatment as intro → venue)
  fx.tIn(ctx, 'flash', { color: '#ffffff', d: 0.16 });
  fx.flash(ctx, bar(1), { id: 'pk1', color: '#ffffff', peak: 0.45, d: 0.28 });
  fx.chroma(ctx, H1.sel, bar(1), { amt: 12, d: 0.35 });
  fx.chroma(ctx, H2.sel, bar(1), { amt: 12, d: 0.35 });

  // =====================================================================================================
  // B · BURST + TA hero + kinetic event poster (bars 2–5)
  // =====================================================================================================
  // anticipation → slam: the corner plate starts growing on the last montage card and LANDS on the bar-2 downbeat (accelerating
  // ease), so the products explode from behind a logo that is already there — the hit frame is never empty
  const HERO = { scale: 2.2, cy: 600, fly: 0.5, ease: 'power2.in' };
  const PH = ctx.plate.hero(tB - HERO.fly, END, HERO);
  // background for B + C: the actual competition pond, duotone deep lake teal (not navy), slow pull-back; aurora + vignette
  let bg = fx.photo(ctx, { id: 'bph', src: 'assets_prep/libechov/venue/v01_maly_sportacek.jpg', treat: 'duo', d1: '#04060a', d2: '#2b8f8c', pos: '50% 60%', kb: { from: { scale: 1.22 }, to: { scale: 1.04 }, t0: tB, t1: tD + 1.4 }, style: 'opacity:.4' });
  bg += fx.mesh(ctx, { id: 'mesh', colors: ['#0b3a3a', '#0f524b', '#0a5866', '#132f2c'], size: 1000, blur: 160, opacity: 0.6, drift: 240, seed: 9, t0: tB, t1: tD + 1.4 });
  bg += `<div class="fx-full" style="background:radial-gradient(90% 60% at 50% 46%,rgba(4,6,10,0) 0%,rgba(4,6,10,.55) 70%,rgba(4,6,10,.9) 100%)"></div>`;
  bg += fx.glow(ctx, { id: 'hg', x: CX, y: HERO.cy, size: 1300, color: '#2a9c95', opacity: 0.55 });
  html += fx.scene(ctx, 'sbg', tB, tD + 1.4, bg, { outD: 1.2 });
  // light bloom behind the logo on the impact (glow over-exposes, then settles into the halo)
  ctx.tl.fromTo(ctx.sel('hg'), { scale: 0.35, opacity: 1 }, { scale: 1, opacity: 0.55, duration: 0.9, ease: 'expo.out' }, tB);

  // burst: products fly out of the centre, past the camera (expo.out), fading as they leave
  let bu = '';
  const BX = CX, BY = HERO.cy;          // burst origin = behind the TA logo landing spot
  BURST.forEach(([k, pi, x, y, box, blur, op, rot], j) => {
    const p = ctx.dataOf(k).products?.[pi]; if (!p) return;
    const [nw, nh] = ctx.dims(p.src), ar = nw / nh;
    const w = Math.min(box, box * ar, nw);
    const P = fx.product(ctx, { id: `bu${j}`, src: p.src, w, cx: x, cy: y, ground: 'none', sweep: !blur, pad: p.pad, maxUp: 1.0 });
    bu += P.html;
    const d = 1.0 + 0.04 * j;
    // start half-size right behind the logo, fully visible after 2 frames → the impact frame already shows products flying
    ctx.tl.fromTo(P.sel, { x: (BX - x) * 0.85, y: (BY - y) * 0.85, scale: 0.45, rotation: rot - 140 }, { x: 0, y: 0, scale: 1, rotation: rot, duration: d, ease: 'expo.out' }, tB + 0.015 * j);
    ctx.tl.fromTo(P.sel, { opacity: 0 }, { opacity: op, duration: 0.07, ease: 'none' }, tB + 0.015 * j);
    if (blur) ctx.tl.fromTo(`#${ctx.id(`bu${j}-im`)}`, { filter: 'blur(0px)' }, { filter: `blur(${blur}px)`, duration: 0.7, ease: 'power2.inOut' }, tB + 0.35);
    else {
      fx.sweep(ctx, `bu${j}`, bar(4) + 0.05 * j, { d: 0.6 });
      [bar(3), bar(4), bar(5)].forEach((t) => fx.punch(ctx, P.sel, t, { scale: 1.14, d: 0.32 }));   // the crown pulses on the downbeats
    }
    fx.float(ctx, P.cam, tB + d, tC, { y: blur ? -26 : -12, rot: blur ? 3 : 2, period: ctx.BAR / (blur ? 1 : 2) });
    // exit INTO the bar-6 downbeat: everything blows outward past the camera (no dead fade-to-empty before the wall)
    ctx.tl.fromTo(P.sel, { x: 0, y: 0, scale: 1, opacity: op }, { x: (x - BX) * 0.9, y: (y - BY) * 0.9, scale: blur ? 1.4 : 1.9, opacity: 0, duration: 0.34, ease: 'power3.in' }, tC - 0.34);
  });
  // shockwave: two rings (fat + thin echo) from behind the logo
  bu = `<i class="fin-ring" id="${ctx.id('ring')}" style="left:${BX - 300}px;top:${BY - 300}px"></i><i class="fin-ring fin-ring2" id="${ctx.id('ring2')}" style="left:${BX - 300}px;top:${BY - 300}px"></i>` + bu;
  ctx.tl.fromTo(ctx.sel('ring'), { scale: 0.45, opacity: 1 }, { scale: 2.8, opacity: 0, duration: 0.7, ease: 'expo.out' }, tB);
  ctx.tl.fromTo(ctx.sel('ring2'), { scale: 0.45, opacity: 0.8 }, { scale: 2.2, opacity: 0, duration: 0.9, ease: 'expo.out' }, tB + 0.08);
  html += fx.scene(ctx, 'sbu', tB, tC, bu, { outD: 0.001 });
  // cold ice flash in screen mode: punches the hit without washing the frame out to grey
  fx.flash(ctx, tB, { id: 'pk2', color: T.accent, peak: 0.5, d: 0.3, blend: 'screen' });

  // poster lines (centred under the TA hero), each lands on the beat nearest its VO word.
  // One family, one width (Archivo condensed, like DĚKUJEME / PARTNERŮM): two big lines (title + date) carry the info,
  // the in-between lines are small caps with tracking → clear 2-level hierarchy instead of five different styles.
  const tTitle = tB + 0.08, tSub = tB + BEAT;
  const tDate = clamp(ctx.snap(voAt('24.', bar(3)), 'beat'), tB + 1.0, bar(4));
  const tPlace = clamp(ctx.snap(voAt('Líheň', bar(4) + BEAT * 2), 'beat'), tDate + 1.3, bar(5));
  const tClose = clamp(ctx.snap(voAt('Uvidíme', bar(5) + BEAT), 'beat'), tPlace + 0.9, tC - 1.2);
  const CND = { font: 'Archivo', wdth: 75, upper: true };
  let yy = PH.y + PH.h + 50;
  const pT = fx.headline(ctx, { id: 'pt', text: E.title1, x: L, y: yy, w: CW, maxLines: 1, ...CND, wght: 900, tracking: -0.01, sizes: [150, 142, 136, 132, 126, 120], align: 'center', t: tTitle, reveal: 'lines', d: 0.7, variable: true });
  fx.varType(ctx, pT.sel, tTitle, { from: { wght: 300, wdth: 62, trk: 0.06 }, to: { wght: 900, wdth: 75, trk: -0.01 }, d: 1.1, ease: 'expo.out' });
  yy += pT.h + 10;
  const pS = fx.headline(ctx, { id: 'ps', text: E.title2, x: L, y: yy, w: CW, maxLines: 1, ...CND, wght: 700, tracking: 0.12, sizes: [54, 50, 46], align: 'center', color: T.accent, t: tSub, reveal: 'lines' });
  yy += pS.h + 34;
  const dSize = fitSize(E.date, { ...CND, wght: 900, tracking: 0, maxW: CW - 60, sizes: [176, 168, 160, 152, 144, 136, 128] });
  // fast roll (≈0.6 s) so the date is never on screen as a wrong number for long
  const pDate = `<div class="fx-abs" id="${ctx.id('pdw')}" style="left:${L}px;top:${yy}px;width:${CW}px">${fx.odometer(ctx, { id: 'pd', value: E.date, x: 0, y: 0, w: CW, align: 'center', size: dSize, font: 'Archivo', wght: 900, t: tDate - 0.05, d: 0.5, spins: 0, stagger: 0.02, style: 'font-stretch:75%' })}</div>`;
  ctx.tl.fromTo(ctx.sel('pdw'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: 'expo.out' }, tDate - 0.05);
  yy += dSize + 30;
  const pP = fx.headline(ctx, { id: 'pp', text: E.place, x: L, y: yy, w: CW, maxLines: 1, ...CND, wght: 800, tracking: 0.04, sizes: [84, 80, 76, 72], align: 'center', t: tPlace, reveal: 'chars', stagger: 0.02 });
  yy += pP.h + 40;
  const pC = fx.headline(ctx, { id: 'pc', text: D.copy?.closer || 'Uvidíme se u vody', x: L, y: yy, w: CW, maxLines: 1, ...CND, wght: 900, tracking: 0, sizes: [92, 88, 84, 80], align: 'center', color: T.accent, t: tClose, reveal: 'chars', stagger: 0.022 });
  if (yy + pC.h > ctx.H - ctx.safe.bottom) ctx.warn(`poster runs to y ${Math.round(yy + pC.h)} > safe ${ctx.H - ctx.safe.bottom}`);
  const poster = `<div class="fx-full" id="${ctx.id('pw')}">${pT.html}${pS.html}${pDate}${pP.html}${pC.html}</div>`;
  ctx.tl.fromTo(ctx.sel('pw'), { opacity: 1, y: 0 }, { opacity: 0, y: -70, duration: 0.3, ease: 'power3.in' }, tC - 0.3);
  html += fx.scene(ctx, 'sB', tB, tC, poster, { outD: 0.001 });
  fx.chroma(ctx, pT.sel, bar(3), { amt: 8, d: 0.3 });
  fx.punch(ctx, ctx.sel('pdw'), bar(4), { scale: 1.06, d: 0.3 });

  // =====================================================================================================
  // C · LOGO WALL (bars 6 → drop): equal optical weight, below the TA hero, metallic glint on the downbeats
  // =====================================================================================================
  const keys = D.wall, cols = keys.length > 8 ? 3 : 2, rows = Math.ceil(keys.length / cols);   // v8: 8 partners → 2 × 4 (9 → 3 × 3)
  const kY = PH.y + PH.h + 44;
  const kick = fx.headline(ctx, { id: 'wk', text: E.partnersTitle || 'Partneři mistrovství', x: L, y: kY, w: CW, maxLines: 1, font: 'Inter', wght: 700, size: 30, upper: true, tracking: 0.24, align: 'center', color: T.accent, t: tC, reveal: 'chars', stagger: 0.012 });
  const gTop = kY + 70, gBot = ctx.H - ctx.safe.bottom - 16, gL = L, gR = ctx.W - L;
  const cw = (gR - gL) / cols, ch = (gBot - gTop) / rows;
  // no URL captions (19 px = unreadable on a phone, and they ate 35 px of every cell) → logos get the whole cell; square
  // marks (Liběchov, GH) were capped by the cell height, now ~125 px instead of 105
  const AREA = cols > 2 ? 21000 : 24000, MAXW = cols > 2 ? 260 : 360, MAXH = Math.min(130, ch - 30);
  // halo per brand; Jigovky: its green, not yellow (yellow behind the thin white line logo killed the contrast)
  const GLOW = { venue: '#17a1c8', troutshop: '#e3000f', activefishing: '#e39025', moonky: '#ff4f8b', jigovky: '#1f9a4c', velkaryba: '#3d7fd0', bosset: '#1b97b1', gausseholler: '#1d8fd5', ftfishing: '#6DB52C' };
  const tWall1 = tD + 0.5;
  let wall = '';
  // hairline grid (draws in from the centre)
  for (let c = 1; c < cols; c++) {
    wall += `<i class="fin-hl fin-v" id="${ctx.id(`gv${c}`)}" style="left:${Math.round(gL + c * cw)}px;top:${gTop}px;height:${gBot - gTop}px"></i>`;
    ctx.tl.fromTo(ctx.sel(`gv${c}`), { scaleY: 0 }, { scaleY: 1, duration: 0.8, ease: 'expo.out' }, tC);
  }
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
    // GH: the site's layered mark (ring turns clockwise all the time it is on screen — operator rule 22. 10.), same size/logo rule
    const isGH = k === 'gausseholler';
    const GM = isGH ? gh.mark(ctx, { id: `w${i}m`, src: rel, cx: 0, y: 0, box: [bw, Math.ceil(bw / ar)], scale: 1.6, at: [tC, tWall1], label: `wall ${k}`, spin: { t0: tC, t1: tWall1 + 0.6 }, sweep: { sa: 110, so: 0.85 } }) : null;
    const lg = isGH ? { w: GM.w, h: Math.round(GM.h), html: GM.html.replace(/left:-?[\d.]+px;top:0px;/, 'left:0;top:0;') } : ctx.logo(rel, { box: [bw, Math.ceil(bw / ar)], scale: 1.6, at: [tC, tWall1], label: `wall ${k}` });
    const col = i % cols, row = Math.floor(i / cols);
    const cx = gL + cw * (col + 0.5), cy = gTop + ch * (row + 0.5);
    wall += `<i class="fin-glow" id="${ctx.id(`wg${i}`)}" style="left:${Math.round(cx - cw / 2)}px;top:${Math.round(cy - ch / 2)}px;width:${Math.round(cw)}px;height:${Math.round(ch)}px;background:radial-gradient(closest-side,${ctx.rgba(GLOW[k] || T.accent, 0.5)},${ctx.rgba(GLOW[k] || T.accent, 0)})"></i>`;
    wall += `<div class="fx-abs fin-cell" id="${ctx.id(`w${i}`)}" style="left:${Math.round(cx - cw / 2)}px;top:${Math.round(cy - ch / 2)}px;width:${Math.round(cw)}px;height:${Math.round(ch)}px">
      <div class="fin-lg" style="width:${lg.w}px;height:${lg.h}px">${lg.html}${isGH ? '' : `<i class="fx-prod-sweep" id="${ctx.id(`w${i}-sw`)}" style="-webkit-mask-image:url(${lg.src});mask-image:url(${lg.src});--sa:110deg;--so:.85"></i>`}</div></div>`;
    const t = tC + 0.02 + i * BEAT * 0.5;            // first logo ON the bar-6 downbeat, then one per half-beat
    ctx.tl.fromTo(ctx.sel(`w${i}`), { opacity: 0, y: 34, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'expo.out' }, t);
    ctx.tl.fromTo(ctx.sel(`wg${i}`), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1.1, duration: 0.29, ease: 'power2.out' }, t);
    ctx.tl.fromTo(ctx.sel(`wg${i}`), { opacity: 1, scale: 1.1 }, { opacity: 0.32, scale: 1, duration: 0.9, ease: 'power2.out' }, t + 0.3);
    ctx.tl.set(ctx.sel(`w${i}`), { filter: 'none' }, t + 0.62);
    const swSel = isGH ? GM.sweeps.join(', ') : ctx.sel(`w${i}-sw`);
    glints.forEach((g) => ctx.tl.fromTo(swSel, { backgroundPosition: '110% 0%' }, { backgroundPosition: '-10% 0%', duration: 0.75, ease: 'power2.inOut' }, g + (col * 0.06 + row * 0.07)));
  });
  ctx.downs.filter((t) => t >= bar(8) - 1e-3 && t < tD).forEach((t) => keys.forEach((_, i) => { fx.punch(ctx, ctx.sel(`w${i}`), t, { scale: 1.05, d: 0.35 }); ctx.tl.hit(ctx.sel(`wg${i}`), { opacity: 0.9 }, { opacity: 0.32, duration: 0.5, ease: 'power2.out' }, t); }));
  html += fx.scene(ctx, 'sC', tC, tWall1, kick.html + wall, { outD: 0.5 });
  [tC, bar(8)].forEach((t, j) => fx.flash(ctx, t, { id: `fc${j}`, color: T.accent, peak: 0.22, d: 0.4, blend: 'screen' }));

  // =====================================================================================================
  // D · SIGN-OFF on the music drop: misty lake, closer, event line, MADE BY GH; fade to black (TA hero + GH stay)
  // =====================================================================================================
  let d = fx.photo(ctx, { id: 'dph', src: 'assets_prep/broll_tacz/t13_dawn_trophies.jpg', pos: '50% 55%', kb: { from: { scale: 1.16 }, to: { scale: 1.02 }, t0: tD, t1: END, ease: 'sine.out' } });
  d += `<div class="fx-full" style="background:linear-gradient(180deg,rgba(4,6,10,.9) 0%,rgba(4,6,10,.6) 28%,rgba(4,6,10,.58) 50%,rgba(4,6,10,.8) 72%,rgba(4,6,10,.96) 100%)"></div>`;
  const dY = PH.y + PH.h + 70;
  // condensed like every other display line of the finale → the tagline can be ~40 % bigger in the same width
  const dC = fx.headline(ctx, { id: 'dc', text: D.copy?.closer || 'Uvidíme se u vody', x: L, y: dY, w: CW, maxLines: 2, font: 'Archivo', wght: 900, wdth: 75, upper: true, tracking: -0.01, lh: 0.9, sizes: [240, 228, 216, 204, 192, 180, 168, 160], align: 'center', t: tD + 0.2, reveal: 'lines', d: 1.0, stagger: 0.14 });
  const eY = dY + dC.h + 56;
  const dE1 = fx.headline(ctx, { id: 'de1', text: `${E.title1} ${E.title2}`, x: L, y: eY, w: CW, maxLines: 1, font: 'Archivo', wght: 700, wdth: 100, sizes: [46, 44, 42, 40, 38], align: 'center', t: tD + 0.9, reveal: 'fade', d: 0.9 });
  const dE2 = fx.headline(ctx, { id: 'de2', text: `${E.date} · ${E.place}`, x: L, y: eY + dE1.h + 14, w: CW, maxLines: 1, font: 'Inter', wght: 600, sizes: [36, 34, 32], align: 'center', color: T.accent, t: tD + 1.1, reveal: 'fade', d: 0.9 });
  d += dC.html + dE1.html + dE2.html;
  html += fx.scene(ctx, 'sD', tD, END, d, { inD: 1.2 });
  // tail: fade the block to black (TA plate = root layer stays; GH mark sits in an overlay above the fade)
  ctx.overlay(`<div class="fx-ov" id="${ctx.id('fade')}" style="background:#000"></div>`);
  ctx.tl.fromTo(ctx.sel('fade'), { opacity: 0 }, { opacity: 1, duration: Math.max(1, END - tFade - 0.5), ease: 'sine.inOut' }, tFade);
  // MADE BY ⚙ © 2026 Gausse Holler from layers: the gear ring turns clockwise for the whole sign-off (operator rule 22. 10.)
  const mb = gh.madeby(ctx, { id: 'mbg', src: D.madeby.on_dark, box: [520, 60], scale: 2.0, at: [tGH, END], label: 'MADE BY GH' });
  ctx.overlay(`<div class="fx-abs" id="${ctx.id('mb')}" style="left:${Math.round(CX - mb.w / 2)}px;top:${Math.round(ctx.H - ctx.safe.bottom - mb.h - 24)}px">${mb.html}</div>`);
  ctx.tl.fromTo(ctx.sel('mb'), { opacity: 0, y: 16, filter: 'blur(8px)' }, { opacity: 0.92, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'expo.out' }, tGH);

  const css = `
  ${ctx.S} .fin-hl { position:absolute; display:block; background:rgba(255,255,255,.16); }
  ${ctx.S} .fin-v { width:1.5px; margin-left:-.75px; transform-origin:50% 50%; }
  ${ctx.S} .fin-h { height:1.5px; margin-top:-.75px; transform-origin:50% 50%; }
  ${ctx.S} .fin-cell { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; }
  ${ctx.S} .fin-lg { position:relative; flex-shrink:0; }
  ${ctx.S} .fin-glow { position:absolute; display:block; pointer-events:none; }
  ${ctx.S} .fin-ring { position:absolute; display:block; width:600px; height:600px; border-radius:50%; box-shadow:inset 0 0 0 14px ${T.accent}, 0 0 60px ${ctx.rgba(T.accent, 0.6)}; pointer-events:none; }
  ${ctx.S} .fin-ring2 { box-shadow:inset 0 0 0 3px #ffffff; }
  ${ctx.S} #${ctx.id('dc')}, ${ctx.S} #${ctx.id('de1')}, ${ctx.S} #${ctx.id('de2')} { text-shadow:0 4px 30px rgba(0,0,0,.55); }
  ${ctx.S} .fin-lg .fx-logo { display:block; }
  `;
  return { html, css };
}
