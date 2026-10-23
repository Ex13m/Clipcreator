// ČRS · Český rybářský svaz — poděkování za dlouholetou podporu (v3, plan B bars 55–58, 4 bars ≈ 7.3 s, VO 0.25–4.37 s, music: peak 1)
// Concept „PEČEŤ“ (the seal): a calm, respectful thank-you letter set as one centred lockup in the ČRS world (deep blue / navy, engraved
// hatching = the fin lines of the ČRS fish, slow water light). Nothing jumps; type and logo are revealed, not slammed.
//   0.00  cut from Velká ryba: DĚKUJEME (Inter 900) is there on frame 1 and settles (tracking closes); the TA logo rises from its
//         corner to the top of the lockup (plate hero ×SC — the thank-you comes from Trout Area CZ)
//   „Českému“  the ČRS logo (white, ≤ TA) is revealed along the fish, tail → head, a light runs through it; hairlines draw out of it
//   „za / dlouholetou / podporu“  ZA DLOUHOLETOU PODPORU word by word on the voice → the kinetic line reads
//         DĚKUJEME · [ČRS] · ZA DLOUHOLETOU PODPORU
//   bar 2 + 1 beat  verified fact (lihenlibechov.cz/cs/kontakt): „Areál MČR 2026 · Líheň Liběchov / provozuje ČRS · místní organizace Mělník“
//   bar 2 + 3 beats  rybsvaz.cz · bars 1–3 (peak 1) water rings out of the seal on every downbeat · bar 3 light sweep
//   film: TA mixer faders rise over the still lockup into the finale (our one fader); the TA logo flies home, the ČRS logo shrinks
//         in sync with it (always ≤ TA)
//   Reel: custom hook (MČR 2025 photo from our league gallery, „Dlouholetá podpora“) → block → end card = the same lockup continued
//         (the TA hero holds through the end card; no bounce) over the MČR 2025 crowd photo.
// role 'supporter': NO „Věnuje ceny“ chip (research/crs.md §2); never „pod záštitou ČRS“ / „MČR pořádá ČRS“.
import * as fx from '../lib/fx.mjs';
import * as cx from '../lib/fx_crs.mjs';

const C = { blue: '#2B5DA9', navy: '#182F5D', deep: '#0c1934', mid: '#20488a', turq: '#38B0C0', ice: '#cfe6ff' };
export const theme = { bg: C.navy, bg2: C.blue, fg: '#ffffff', accent: C.turq, accent2: '#ffffff', font: { display: 'Inter', text: 'Inter' }, wght: 900, upper: true, light: false };
export const meta = {
  reel: true,
  role: 'supporter',                     // build rule: no prize chip (only sponsors carry „Věnuje ceny“)
  hook: { headline: 'Dlouholetá podpora', sub: 'rybsvaz.cz' },
  endCard: { logo: 'on_dark', line: 'Děkujeme za dlouholetou podporu' },
};

// ---- lockup geometry (shared by the block and its Reel end card so the end card continues the last frame exactly) ----
const SC = 1.8, CX = 540, TA_CY = 335;           // TA hero: 506×176 at the top of the lockup (y 247–423)
const Y = { thanks: 500, logo: 846, line: 994, fact: 1240, url: 1398 };
const PHOTO = 'assets/gallery_tacz/gtacz_mcr25_1000046063.webp';   // MČR 2025 Polička, opening (league race, our gallery)

function world(ctx, { t0 = 0, t1 = ctx.dur } = {}) {
  let h = fx.field(ctx, { kind: 'radial', c1: C.mid, c2: C.deep, at: '50% 40%' });
  h += fx.mesh(ctx, { id: 'mesh', colors: [C.blue, C.turq, C.navy, '#1d3f7c'], size: 980, blur: 170, opacity: 0.42, drift: 120, seed: 4, t0, t1 });
  h += cx.caustic(ctx, { id: 'cau', t0, t1 });
  h += cx.hatch(ctx, { id: 'hatch', t0, t1 });
  h += `<div class="fx-full" style="background:radial-gradient(95% 62% at 50% 46%, rgba(12,25,52,0) 0%, rgba(12,25,52,.5) 72%, rgba(8,16,34,.86) 100%)"></div>`;
  return h;
}

// the lockup parts (static markup; the block animates them, the end card shows them settled)
function lockup(ctx, { at }) {
  const W = ctx.W, L = ctx.safe.left, Wt = W - 2 * L;
  const out = {};
  const sz = ctx.fit('DĚKUJEME', { font: 'Inter', wght: 900, upper: true, tracking: -0.01, maxW: 860, maxLines: 1, sizes: [168, 160, 150, 140, 130] }).size;
  out.thanks = cx.charsLine(ctx, { id: 'thx', text: 'Děkujeme', x: L, y: Y.thanks, w: Wt, size: sz, font: 'Inter', wght: 900, tracking: -0.01 });
  const LG = ctx.logo('on_dark', { box: [560, 200], scale: SC, at, id: 'logo', label: `${ctx.cid} ČRS logo`, style: 'position:absolute;left:0;top:0' });
  out.LG = LG;
  out.logoBox = { x: CX - LG.w / 2, y: Y.logo - LG.h / 2, w: LG.w, h: LG.h };
  out.line = cx.wordsBlock(ctx, { id: 'za', text: 'za dlouholetou podporu', x: L, y: Y.line, w: Wt, sizes: [104, 96, 90, 84, 78, 72], maxLines: 2, font: 'Inter', wght: 800, color: '#fff' });
  // verified fact (lihenlibechov.cz/cs/historie: „od roku 2022 ji provozuje Český rybářský svaz, místní organizace Mělník pomocí firmy
  // Líheň Liběchov s.r.o.“; MO Mělník = nájemce, ne vlastník areálu → „provozuje“, ne „vlastní“ — operátor 23. 10. 2026)
  const fv = ctx.fit(ctx.nb('provozuje ČRS · místní organizace Mělník'), { font: 'Inter', wght: 800, maxW: Wt - 80 - 64, maxLines: 1, sizes: [42, 40, 38, 36, 34] }).size;
  out.factHtml = `<div class="fx-abs crs-fact" id="${ctx.id('fact')}" style="left:${L + 40}px;width:${Wt - 80}px;top:${Y.fact}px">
    <i id="${ctx.id('fact-bar')}"></i><span>${ctx.esc(ctx.nb('Areál MČR 2026 · Líheň Liběchov'))}</span><b style="font-size:${fv}px">${ctx.esc(ctx.nb('provozuje ČRS · místní organizace Mělník'))}</b></div>`;
  out.urlHtml = `<div class="fx-abs" id="${ctx.id('url')}" style="left:0;width:${W}px;top:${Y.url}px;text-align:center;font-family:'Inter';font-weight:800;font-size:64px;line-height:1;color:#fff;letter-spacing:-.01em">${ctx.esc(ctx.data.url)}</div>`;
  // hairlines out of the logo (the seal's „water line“)
  const hy = Y.logo + 2, gap = 34;
  out.hairHtml = `<i class="fx-abs" id="${ctx.id('hl-l')}" style="left:${L}px;top:${hy}px;width:${out.logoBox.x - gap - L}px;height:2px;background:linear-gradient(90deg,rgba(56,176,192,0),${C.turq})"></i>
    <i class="fx-abs" id="${ctx.id('hl-r')}" style="left:${out.logoBox.x + LG.w + gap}px;top:${hy}px;width:${W - L - (out.logoBox.x + LG.w + gap)}px;height:2px;background:linear-gradient(90deg,${C.turq},rgba(56,176,192,0))"></i>`;
  return out;
}
const CSS = (S) => `${S} .crs-fact{display:flex;flex-direction:column;align-items:center;gap:10px;padding:24px 30px 26px;box-sizing:border-box;border-radius:24px;background:rgba(255,255,255,.08);-webkit-backdrop-filter:blur(18px) saturate(1.3);backdrop-filter:blur(18px) saturate(1.3);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.22),0 24px 50px rgba(0,0,0,.25);text-align:center;font-family:'Inter';color:#fff}
${S} .crs-fact span{font-size:30px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:${C.ice};line-height:1.1}
${S} .crs-fact b{font-size:42px;font-weight:800;line-height:1.08}
${S} .crs-fact i{position:absolute;left:50%;top:0;width:120px;margin-left:-60px;height:3px;border-radius:0 0 3px 3px;background:${C.turq}}`;

export default function crs(ctx) {
  const at = (q, fb) => ctx.vo.at(q) ?? fb;
  const film = ctx.film;
  const FLY = 0.62;
  // TA hero: up from the corner on the cut. Film: flies home over the exit (faders); bare block = end of output (holds);
  // Reel: holds THROUGH the end card (g1 past the output end → hold) so the end card continues this lockup without a bounce.
  ctx.plate.hero(0, ctx.reel ? ctx.dur + 60 : ctx.dur, { scale: SC, cx: CX, cy: TA_CY, fly: FLY, ease: 'power3.inOut' });
  const tLogo = Math.max(FLY + 0.02, at('Českému', ctx.beat(2)) - 0.1);
  const logoEnd = film ? ctx.dur - FLY : ctx.dur;
  const K = lockup(ctx, { at: [tLogo, logoEnd] });
  let html = world(ctx);

  // ---- DĚKUJEME: on frame 1, tracking closes + container settles ----
  html += K.thanks.html;
  const n = K.thanks.n;
  K.thanks.ids.forEach((id, i) => { if (id) ctx.tl.fromTo(ctx.sel(id), { x: (i - (n - 1) / 2) * 12 }, { x: 0, duration: 1.3, ease: 'expo.out' }, 0); });
  ctx.tl.set(ctx.sel('thx'), { transformOrigin: '50% 60%' }, 0);
  ctx.tl.fromTo(ctx.sel('thx'), { scale: 1.04 }, { scale: 1, duration: 1.1, ease: 'expo.out' }, 0);

  // ---- soft turquoise light behind the seal: blooms with the reveal, breathes on the bar-2/3 downbeats ----
  html += fx.glow(ctx, { id: 'sg', x: CX, y: Y.logo, size: 900, color: C.turq, opacity: 0.22 });
  ctx.tl.fromTo(ctx.sel('sg'), { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 0.22, duration: 1.2, ease: 'expo.out' }, tLogo);
  [ctx.bar(2), ctx.bar(3)].forEach((t) => ctx.tl.hit(ctx.sel('sg'), { opacity: 0.36 }, { opacity: 0.22, duration: 1.0, ease: 'power2.out' }, t));
  // ---- water rings out of the seal on the peak-1 downbeats (bars 1–3): the calm lockup breathes with the loudest music so far ----
  html += cx.ripples(ctx, { id: 'rp', cx: CX, cy: Y.logo, color: C.turq, times: [ctx.bar(1), ctx.bar(2), ctx.bar(3)], peak: 0.42 });
  // ---- ČRS logo: diagonal reveal along the fish + light sweep; hairlines draw out of it ----
  const R = cx.reveal(ctx, { id: 'rv', ...K.logoBox, inner: K.LG.html, src: K.LG.src, t: tLogo, d: 1.1 });
  html += R.html;
  R.sweep(tLogo + 0.45, 1.0);
  html += K.hairHtml;
  ctx.tl.set(ctx.sel('hl-l'), { transformOrigin: '100% 50%' }, 0);
  ctx.tl.set(ctx.sel('hl-r'), { transformOrigin: '0% 50%' }, 0);
  ctx.tl.fromTo(ctx.sel('hl-l'), { scaleX: 0 }, { scaleX: 1, duration: 1.0, ease: 'expo.out' }, tLogo + 0.25);
  ctx.tl.fromTo(ctx.sel('hl-r'), { scaleX: 0 }, { scaleX: 1, duration: 1.0, ease: 'expo.out' }, tLogo + 0.25);

  // ---- ZA DLOUHOLETOU PODPORU word by word on the voice ----
  html += K.line.html;
  const vw = ['za', 'dlouholetou', 'podporu'];
  const tw = [at('za', ctx.at(1, 2)), at('dlouholetou', ctx.at(1, 3)), at('podporu', ctx.bar(2))];
  // words in the fitted lines (NBSP may glue „za dlouholetou“ into one token → it takes the time of its first word)
  K.line.words.forEach((wd) => {
    const first = wd.w.split(/ /)[0].toLowerCase();
    const k = Math.max(0, vw.indexOf(first));
    ctx.tl.fromTo(ctx.sel(wd.id), { yPercent: 118, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.75, ease: 'expo.out' }, tw[k] - 0.06);
  });

  // ---- fact + URL ----
  html += K.factHtml + K.urlHtml;
  const tF = ctx.at(2, 1) - 0.04, tU = ctx.at(2, 3) - 0.04;   // fact one beat after „podporu“ lands (no double entry)
  ctx.tl.fromTo(ctx.sel('fact'), { opacity: 0 }, { opacity: 1, duration: 0.07, ease: 'none' }, tF);
  ctx.tl.fromTo(ctx.sel('fact'), { y: 36 }, { y: 0, duration: 0.8, ease: 'expo.out' }, tF);
  ctx.tl.set(ctx.sel('fact-bar'), { transformOrigin: '50% 50%' }, 0);
  ctx.tl.fromTo(ctx.sel('fact-bar'), { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'expo.out' }, tF + 0.1);
  ctx.tl.fromTo(ctx.sel('url'), { opacity: 0 }, { opacity: 1, duration: 0.07, ease: 'none' }, tU);
  ctx.tl.fromTo(ctx.sel('url'), { y: 30 }, { y: 0, duration: 0.8, ease: 'expo.out' }, tU);

  // ---- bar 3 (music only): one more light through the seal on the downbeat ----
  R.sweep(ctx.bar(3) - 0.2, 1.1);

  if (film) {
    // exit: nothing is thrown or faded (no ghosts) — the TA mixer faders rise over the still lockup into the finale's black,
    // the TA logo flies home meanwhile, and the ČRS logo shrinks in exact sync with it (same window + ease, scale = TA scale ÷ SC)
    // so it is never larger than the TA logo while the plate is in flight (logo rule; the registered window ends at dur − FLY)
    ctx.tl.set(ctx.sel('rv'), { transformOrigin: '50% 50%' }, 0);
    ctx.tl.fromTo(ctx.sel('rv'), { scale: 1 }, { scale: 1 / SC, duration: FLY, ease: 'power3.inOut' }, ctx.dur - FLY);
    fx.tOut(ctx, 'fader', { d: 0.55 });
  } else if (!ctx.reel) {
    fx.tOut(ctx, 'cut');
  }
  ctx.report(`bars ${ctx.downs.map((t) => t.toFixed(2)).join(' ')} · logo ${tLogo.toFixed(2)} · words ${tw.map((t) => t.toFixed(2)).join(' ')} · fact ${tF.toFixed(2)} · url ${tU.toFixed(2)}`);
  return { html, css: CSS(ctx.S) };
}

// ---- Reel hook (1 bar): the MČR 2025 (Polička) trophy table under the ČRS banner (our league gallery), natural colour cooled to ČRS blue; „Poděkování“ + DLOUHOLETÁ PODPORA, ready on frame 1 ----
export function hook(ctx) {
  // the proof shot: the MČR 2025 trophy table dressed in the ČRS banner (our league gallery) — crop on the table, natural colour,
  // cooled; slow push-in toward the banner. Type sits in the darkened sky above it (the TA logo corner stays clear).
  const L = ctx.safe.left, W = ctx.W;
  let html = fx.field(ctx, { bg: C.deep });
  html += fx.photo(ctx, { id: 'ph', src: PHOTO, treat: 'none', pos: '88% 50%', kb: { from: { scale: 1.06 }, to: { scale: 1.16 }, t0: 0, t1: ctx.dur }, style: 'filter:saturate(.9) contrast(1.08) brightness(1.02)' });
  ctx.tl.set(ctx.sel('ph-in'), { transformOrigin: '52% 76%' }, 0);
  html += `<div class="fx-full" style="background:linear-gradient(180deg, rgba(12,25,52,.9) 0%, rgba(12,25,52,.84) 30%, rgba(12,25,52,.45) 46%, rgba(12,25,52,0) 60%, rgba(12,25,52,0) 84%, rgba(12,25,52,.55) 100%)"></div>`;
  html += `<div class="fx-full" style="background:${C.blue};mix-blend-mode:soft-light;opacity:.32"></div>`;
  const k = fx.taChip(ctx, { id: 'k', text: 'Poděkování', sub: 'MČR 2026', x: L, y: 400, size: 30, tone: 'dark', t: null });
  html += k.html;
  const H = fx.headline(ctx, { id: 'hh', text: 'Dlouholetá podpora', x: L, y: 480, w: W - 2 * L, maxLines: 2, upper: true, font: 'Inter', wght: 900, color: '#fff', t: null, sizes: [150, 140, 130, 120, 110] });
  html += H.html;
  ctx.tl.set(H.sel, { transformOrigin: '0% 0%' }, 0);
  ctx.tl.fromTo(H.sel, { scale: 1.07 }, { scale: 1, duration: 0.8, ease: 'expo.out' }, 0);
  html += `<div class="fx-abs" id="${ctx.id('sub')}" style="left:${L}px;top:${480 + H.h + 26}px;font-family:'Inter';font-weight:800;font-size:50px;line-height:1;color:${C.ice}">${ctx.esc(ctx.data.name)}</div>`;
  html += `<div class="fx-abs" id="${ctx.id('cap')}" style="left:${L}px;top:${480 + H.h + 96}px;font-family:'Inter';font-weight:700;font-size:24px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.7)">${ctx.esc(ctx.nb('Foto: MČR 2025 · Polička'))}</div>`;
  ctx.plate.tone(0, ctx.dur, 'scrim');
  fx.tOut(ctx, 'flash', { color: C.navy, d: 0.12 });
  return { html, css: '' };
}

// ---- Reel end card (2 bars): the block's lockup continues (TA hero still held from the block) over our MČR 2025 crowd photo;
//      the fact chip gives way to the TA line „Děkujeme za dlouholetou podporu“ (TA signature: Montserrat caps + red hairline) ----
export function endCard(ctx) {
  const K = lockup(ctx, { at: [0, ctx.dur] });
  let html = world(ctx);
  html += fx.photo(ctx, { id: 'ph', src: PHOTO, treat: 'duo', d1: '#0c1934', d2: '#5d8fd8', pos: '22% 50%', kb: { from: { scale: 1.04 }, to: { scale: 1.12 }, t0: 0, t1: ctx.dur }, style: 'opacity:.2' });
  html += `<div class="fx-full" style="background:radial-gradient(90% 60% at 50% 46%, rgba(12,25,52,.35) 0%, rgba(12,25,52,.8) 100%)"></div>`;
  html += K.thanks.html;
  html += cx.ripples(ctx, { id: 'rp', cx: CX, cy: Y.logo, color: C.turq, times: [0, ctx.bar(1)], peak: 0.32 });
  html += `<div class="fx-abs" style="left:${K.logoBox.x}px;top:${K.logoBox.y}px;width:${K.LG.w}px;height:${K.LG.h}px">${K.LG.html}</div>`;
  html += K.hairHtml + K.line.html + K.urlHtml;
  html += K.factHtml;
  // calm life: a light through the logo on the beats (no scale on the logo — logo rule)
  const R = cx.reveal(ctx, { id: 'rv', ...K.logoBox, inner: '', src: K.LG.src, t: null });
  html += R.html;
  R.sweep(0.35, 1.1);
  R.sweep(ctx.bar(1) - 0.2, 1.1);
  return { html, css: CSS(ctx.S) };
}
