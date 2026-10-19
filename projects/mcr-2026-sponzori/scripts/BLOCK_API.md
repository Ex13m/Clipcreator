# Block API — MČR 2026 partner ad film (engine v5)

The film is an **advertising film for the sponsors and their products**. Every sponsor gets its **own visual world** taken from its
brand (logo colours, web CSS colours and fonts, see `research/<key>.md`). The only thing from our TA style is the **TA CZ logo
plate**, which the engine draws for you. Each sponsor block must also work as a standalone **Reel**.

You own **one file**, `scripts/blocks/<block>.mjs`, plus your data file `data/blocks/<key>.json`. Do not edit the shared files
(`build.mjs`, `lib/*`, `data/content.json`, `data/tokens.json`). If you need something there, write it in your report and say why.

## 1. Build and check

```bash
cd projects/mcr-2026-sponzori
BLOCK=troutshop node scripts/build.mjs          # bare block: proto/block_troutshop/ (its own music slice + VO)
BLOCK=troutshop REEL=1 node scripts/build.mjs   # Reel: proto/reel_troutshop/ = 1-bar hook + block + 2-bar end card
node scripts/build.mjs                          # master film: proto/film/ (whole track, 106.4 s)
BLOCK=all [REEL=1] node scripts/build.mjs       # every block / every Reel (REEL only for modules with meta.reel = true)
FINAL=1 …                                       # without the DRAFT badge

cd .. && export HYPERFRAMES_BROWSER_PATH=$(ls -d /opt/pw-browsers/chromium_headless_shell-1194/*/)headless_shell
npx --prefix hb-battle-2026 hyperframes lint mcr-2026-sponzori/proto/block_troutshop          # must be 0 errors
npx --prefix hb-battle-2026 hyperframes snapshot mcr-2026-sponzori/proto/block_troutshop --at 0.3,1.9,3.7,5.6,7.2 --no-end -o mcr-2026-sponzori/_work/snap/<you>/
```

Look at every snapshot and fix what you see before you report. Check the frames at the block edges (first and last 0.3 s) and on every
downbeat. The build prints warnings (`! …`) for VO overflow, timelines that run past the block end, headlines that do not fit,
and products that would be upscaled. It **throws** on a logo-rule violation.

## 2. Module shape

```js
import * as fx from '../lib/fx.mjs';

export const theme = {               // your brand world; neighbours use it for transitions, the Reel uses it for hook / end card
  bg: '#070707', bg2: '#2a0306', fg: '#ffffff', accent: '#e3000f', accent2: '#ffffff',
  font: { display: 'Anton', text: 'Inter' }, wght: 400, upper: true, light: false,   // light: true → end card uses logo on_light
};
export const meta = {
  reel: true,                                                     // build a Reel for this block with BLOCK=all REEL=1
  hook: { product: 0, headline: 'Milujeme lov pstruhů', sub: 'troutshop.eu', rot: -8 },   // default 1-bar hook
  endCard: { logo: 'on_dark', line: 'Partner MČR v Trout Area 2026' },                    // default 2-bar end card
};
export const fonts = { /* optional: extra families, same shape as FONTS in lib/fonts.mjs; files go to fonts/ */ };
export function hook(ctx) { … }      // optional: your own hook (same return shape); default = lib/reel.mjs defaultHook
export function endCard(ctx) { … }   // optional: your own end card; default = lib/reel.mjs defaultEndCard

export default function troutshop(ctx) {
  let html = '';
  html += fx.field(ctx, { kind: 'radial', c1: theme.bg2, c2: theme.bg });
  …
  return { html, css: `${ctx.S} .my-thing { … }` };   // timeline defaults to ctx.tl; you may also return timeline: '<js>' or ctx.tl
}
```

The engine wraps your HTML in a sub-composition:
`#b-<cid>` (composition root) › `#bw-<cid>` (background `theme.bg`) › `#<cid>-stage` (your HTML) + overlays (transitions and flashes).
Your CSS goes into a `<style>` inside that template. **Prefix every selector with `ctx.S`** (`#b-<cid>`) so it does not leak into other
blocks. The fx classes (`.fx-*`) are global.

## 3. ctx reference

| field | meaning |
|---|---|
| `key`, `cid`, `part` | plan key (`troutshop`); composition id (`troutshop`, `troutshop-hook`, `troutshop-endcard`); part `main` / `hook` / `endcard` |
| `mode`, `film`, `reel` | `film` / `block` / `reel` output. **Build the block identically in all modes**: the engine only shifts it in time. |
| `data` | `data/blocks/<key>.json`: `name`, `url`, `logo{on_dark,on_light,plate…}`, `products[]`, `copy{headline,facts,lines[{t,s,src}]}`, `brand.colors`, `notes` |
| `dataOf(key)` | another block's data, read-only (finale uses it for the logo wall) |
| `event`, `C` | global event texts (`data/content.json`: title, date, place…) |
| `theme`, `prev`, `next` | your theme; neighbours `{key, theme}` or `null` (film start/end, bare block). In a Reel, `prev`/`next` = your own hook/end card. |
| `W`, `H`, `safe` | 1080 × 1920; Reels safe zone `{top:240, bottom:460, left:64, right:64, uiRight:140, uiRightFromY:900}` |
| `dur`, `BEAT`, `BAR`, `nBars` | block length (s), beat ≈ 0.464 s, bar ≈ 1.834 s (129 BPM), number of bars |
| `bar(i)`, `beat(i)`, `at(bar, beat)` | block-local times **from the real beat grid** (`audio/track.beats.json`); `bar(nBars)` = `dur` |
| `beats`, `downs` | arrays of local beat / downbeat times |
| `snap(t, 'beat'\|'bar'\|'half')` | nearest grid time (use it after `vo.at()`) |
| `id(s)`, `sel(s)` | unique id `<cid>-s` / selector `#<cid>-s`. **Every id you create must go through `ctx.id`.** |
| `S`, `stage`, `root` | CSS scope `#b-<cid>`; stage selector (transitions animate it, **you never do**); wrapper |
| `tl` | timeline builder: `fromTo(sel, from, to, t)` · `hit(sel, from, to, t)` · `set(sel, vars, t)` · `raw(js)` |
| `overlay(html)` | add a layer above the stage (flashes and transition panels use it) |
| `asset(rel)`, `dims(rel)`, `img(rel, opts)`, `has(rel)`, `srcOf(rel)` | stage an asset → URL; staged size; `<img>` helper; exists?; absolute source path |
| `video(rel, {id, start, dur, style})` | framework-owned `<video class="clip">` (the drone in venue). Do not put it inside an element with `data-start`. |
| `fit(text, opts)`, `wrap()`, `measure()` | exact text fitting with the real font files (fontkit): `fit(t, {font, wght, wdth, italic, upper, tracking, maxW, maxLines, sizes})` → `{size, lines}` |
| `plate` | TA plate: `rect` (corner box, keep it free), `logo` (TA logo size at ×1 = the logo-rule reference), `hero(t0, t1, {scale, cx, cy, fly})` |
| `logo(which, {box, scale, at, id})` | sponsor logo `<img>` fitted to the logo rule → `{html, w, h}` (see §5) |
| `vo` | VO timing (§6) |
| `esc`, `nb`, `rnd`, `rgba`, `report`, `warn` | HTML escape; Czech NBSP typography; seeded random; hex→rgba; build log lines |

### Timeline rules (seek-safe, deterministic)
- Use `ctx.tl.fromTo` for **entrances, moves and exits**. The builder applies the from-state of the earliest tween per (selector,
  property) at load (`gsap.set`), so the element waits hidden or offset from frame 0. **Never** set an initial CSS `transform` on
  something you animate (lint `gsap_css_transform_conflict`). Position with `left` / `top` and animate `x` / `y` / `scale` / `rotation`.
- Use `ctx.tl.hit` for **accents** (flash, punch, chroma). It gets no initial state, so before `t` the element looks as it normally does.
- Chain consistently: the `from` of a later tween = the state the element is in right before it.
- One selector per element per property group. `#a` and `.b` pointing at the same node are invisible to the builder.
- No `Math.random`, `Date`, `repeat:-1`, or `.to()` / `.from()`. For a seeded jitter use `ctx.rnd(seed)`. For idle loops use a finite `repeat` (see `fx.float`).
- `display` / `visibility` must never be tweened. Show or hide whole groups with `fx.scene()` (opacity).
- No `<br>` in text. Pass the text through `ctx.nb()` (`fx.headline` already does) so that `v`, `k`, `s`, `z`, `o`, `u`, `a`, `i` and `1 300` never break at a line end.

## 4. fx.mjs cookbook (all seek-safe; one-line index at the top of `lib/fx.mjs`)

| technique | helper(s) | note |
|---|---|---|
| colour field / aurora mesh / sunburst / glow | `field`, `mesh`, `rays`, `glow` | brand-coloured worlds behind products |
| full-frame group in time | `scene(ctx, id, t0, t1, html, {inD, outD})` | |
| kinetic type | `headline({text, font, wght, wdth, italic, upper, sizes, maxLines, reveal:'lines'\|'chars'\|'words'\|'fade'\|'scale', t, out, variable})` | measured and fitted; mask lines are diacritic-safe |
| split chars or words | `split`, `typeIn`, `typeOut` | |
| variable weight / width / tracking | `varType(sel, t, {from:{wght,wdth,trk}, to})` on `headline({variable:true})` / `bigType({variable:true})` | Archivo (wght + wdth), Bricolage |
| outline → fill | element with class `fx-of` + `--ofc` (fill) and `--ofw` (stroke); `outlineFill(sel, t)` | see `moonky.mjs` |
| oversized cropped type behind the product | `bigType({text, size, y, outline, drift})` | |
| marquee band | `marquee({text, y, size, bg, color, rot, speed, dir, outline})` | seamless, linear |
| product hero (cut-out + contact shadow / floor reflection) | `product({src, w\|h, cx, cy\|floor, ground:'float'\|'floor'\|'none', reflect, pad: p.pad, rot})` → `{html, sel, cam}` | `pad` from data keeps the shadow under the visible object; never upscales > `maxUp` (1.3) |
| product animation | `productIn/Out(id, t, {from/to})`, `sweep(id, t)` (specular light sweep masked by the product alpha), `tilt(id, t0, t1)` (3D), `float(P.cam, …)`, `pushIn(P.cam, …)`, `flip(frontId, backId, t)` | entrance on `sel`, camera on `cam`, tilt/flip on `#…-tl` (the helpers pick the right layer) |
| depth parallax stack | `parallax([{sel, depth}], t0, t1, {x, y, scale})` | use `P.cam` for products |
| speed-ramp zoom / beat accents | `ramp(sel, t0, t1, {from, to})` (CustomEase `fxRampIn`), `punch`, `pulse` | |
| counters | `odometer({value:'1 300', suffix:'+', size, font, t, d, align, w})` | rolling digits, transform only |
| sticker / badge burst | `sticker({text, sub, shape:'burst'\|'circle'\|'pill', color, fg, rot, t})` | |
| glass UI chips (price / spec) | `chip({label, value, tone:'dark'\|'light', accent, t, from})` | backdrop blur |
| chromatic aberration | `chroma(sel, t, {amt, kind:'text'\|'img'})` | keep it subtle |
| duotone / mono / halftone photo | `photo({src, treat:'duo'\|'mono'\|'halftone', d1, d2, kb:{from, to, t0, t1}})` | Ken Burns built in |
| split-screen grid assemble | `grid({src \| cells:[{src, fit, bg, pad}], cols, rows, mode:'cols'\|'scatter'\|'scale', t})` | |
| colour flash on a downbeat | `flash(t, {color, peak, d, blend})` | |
| transitions | `tIn(type, {color, d, dir})` / `tOut(type, …)`: `cut`, `wipe`, `iris`, `slice`, `whip` (directional blur and skew), `zoom` (zoom-through), `blob` (liquid mask: 8 drops fused by an SVG goo filter), `grid`, `flash` | |
| end-card lockup | `endCard({t, logo, url, line, scale, plateT, plateFly, settle})` | flies the TA plate into the lockup (`ctx.plate.hero`) and fits the sponsor logo ≤ the TA logo. Reel end cards: `plateT: -0.42, plateFly: 0.42, settle: true` → the plate flies over the block's out-transition, lands on the downbeat, the lockup is complete on frame 1 |

**Transition handoff contract.** Each block owns its own in and out. At a boundary the two sides either **hard-cut on the downbeat** or
**meet at a solid colour**: `tOut` covers the frame with `ctx.next.theme.bg` by default, and `tIn` starts covered by your own
`theme.bg`. That way any out works with any in. `whip` and `zoom` move `ctx.stage` (and its children), so never animate the stage yourself.

## 5. TA logo and the logo rule (hard rules, enforced by the build)
- The TA CZ plate (`assets_prep/ta_cz/logo_h_plate.png`, 300 px wide, top-left at 64,250) is the **only persistent layer**. It sits in
  the root page above every block, so nothing can cover it. **Do not draw another TA logo** and do not put key content under
  `ctx.plate.rect`.
- A sponsor logo or mark (logo, badge, GH gear, MADE BY lockup…) must **never be larger than the TA logo in the same frame** (width and area).
  `ctx.logo(which, {box:[w,h]})` fits it automatically at plate scale ×1, which is at most about 281 px wide and 23.6k px² area.
- For a bigger logo moment, request a plate hero for that window and pass the same scale:
  `ctx.plate.hero(t0, t1, {scale:1.6, cy:600})` + `ctx.logo('on_dark', {box:[600,240], scale:1.6, at:[t0+0.7, t1]})`.
  `at` must lie inside the hold, after the fly (`fly` s). A hero that reaches the end of the output stays there (Reel end card, finale).
- Moves of the plate must not overlap between blocks. A hero changes the plate in every output (film, block, Reel), so keep it short and intentional.
- Typed text in the brand's web font (the name as headline, URL) is type, not a logo. Do not fake the logo artwork with type.
- Logo variants: `on_dark` / `on_light` / `plate` (`assets_prep/<key>/`). Velká ryba needs `plate` on dark. Troutshop on pure black: `on_dark` (red keyline) or `plate`.

## 6. VO timing (kinetic type synced to the voice)
- VO files `vo/<key>.wav` (+ `vo/<key>.words.json` with aligned words) are placed automatically at block start + `voOffset`
  (0.25 s, intro 1.2 s; `data/content.json` → plan). They are the same in the film, the block and the Reel.
- `ctx.vo.words` gives `[{w, t0, t1}]` (block-local, on-screen Czech tokens). `ctx.vo.phrases` gives `[{text, t0, t1}]`. `ctx.vo.at('1 300')` gives the
  first word's t0 or `null`. Also available: `ctx.vo.start` / `end` / `aligned` / `real`.
- Pattern: `const t = ctx.snap(ctx.vo.at('1999') ?? ctx.bar(2), 'beat')` → show the fact **on the beat nearest the spoken word**.
  Keep a fallback, because the VO may be regenerated and become shorter or longer. Then clamp it into the right bar with `Math.max` / `Math.min`.
- On-screen texts: use only verified copy (`data.copy`, `vo/script_cs.json → onscreen`, `research/*.md → Verification`). Respect `data.notes`
  (e.g. venue: always „donedávna“, never „chyť a pusť“; Moonky: no „nejlepší“ / „8 let“; Bosset: nothing about Zojirushi origin).
- VO longer than the block is cut by the build (`!! VO … CUT`). Report it; do not stretch the block.

## 7. Timing / plan (do not change bar counts on your own)
Bars are 0-based on `audio/track.wav` (129 BPM; bar ≈ 1.834 s; beat grid in `audio/track.beats.json`). Plan (`data/content.json`):
intro 0–7 (build-up, no kick) · **venue 8–12 (drop on bar 8)** · troutshop 13–16 · activefishing 17–20 · moonky 21–24 · jigovky 25–28 ·
velkaryba 29–32 · broll 33–34 · brollbreak 35–36 (musical break) · bosset 37–40 · gausseholler 41–44 · finale 45–55 + tail to track end.
Every block boundary sits on a downbeat. Put big hits on `ctx.downs` and cuts on `ctx.beats`.

## 8. Reels
`BLOCK=<key> REEL=1` builds: **hook** (the bar before the block; `meta.hook` or your `hook(ctx)`) → **your block** (unchanged) → **end
card** (2 bars after it; `meta.endCard` or your `endCard(ctx)`). The music is the matching slice of `track.wav` with a 0.12 s fade-in and
a 0.9 s fade-out, and the VO is included (see §12: every output gets ONE pre-mixed, ducked and mastered audio track). The hook must sell in one bar: strongest product shot + headline, readable at 0.3 s. The default hook fits the product into the free box under the
headline (max 920 × 760 px, never > 1.25× natural size), so wide lures do not run off the frame. The end
card is the lockup sponsor logo + URL + „Partner MČR v Trout Area 2026“ + TA logo (`fx.endCard` does it and respects the logo rule).
Your block must not depend on what comes before or after it: use `ctx.prev` / `ctx.next` only for transition colours.

## 9. Assets
- Use the **clean cut-outs** in `assets_prep/<key>/heroes/*.png` (alpha, no watermark; `data.products[i].src`, `.pad`, `.glint`, `.dominant`).
  `orig/` holds the raw shop files: do not use them as heroes. Raw `assets/<key>/` photos are often watermarked or have props, so check them first.
- Small packshots (Activefishing 386–756 px, Jigovky details about 500 px) must not be blown up. `fx.product` caps them at 1.3× and warns.
  Show them smaller, in grids or as macro crops with motion.
- B-roll: `assets_prep/broll/*.jpg` (1080 × 1920). Venue: `assets_prep/libechov/venue/*`. Drone: `drone/final/flyover_9x16.mp4` (venue
  picks it up automatically when it exists; until then it uses the newest draft `drone/mesh/out/v<N>/flyover_9x16.mp4` and the build
  log says `DRAFT`). The held last frame is written to `assets_prep/libechov/venue/_drone_<dir>_last.jpg`.
- Fonts: families in `lib/fonts.mjs → FONTS` (Archivo, Bricolage Grotesque, Inter, Inter Tight, Montserrat (+italic), Nunito, Unbounded, Oswald,
  Outfit, Space Grotesk, Anton, Poppins, Playfair Display, …). To add one: put the woff2 files (latin + latin-ext) in `fonts/` and declare it in
  **your** module with `export const fonts = {…}`. Measuring converts it to `fonts/_ttf/` automatically.
- Need a new asset (AI upscale, new cut-out)? Put it under `assets_prep/<key>/…`, never in `proto/`.

## 10. Banned (old TA house style — the operator rejected it)
Drum pads, EQ strip, mixer faders, ticker, grain over everything, navy (#304285 / #0b1e42) as default background, red TA bars on
kickers, „01 / 08“ counters, logo cards in TA style, TA-blue/red colouring of sponsor blocks. No second TA logo, no TA colours in sponsor worlds.

## 11. Definition of done (per block)
1. `BLOCK=<key>` and `BLOCK=<key> REEL=1` build without `XX` / errors, and lint shows 0 errors.
2. Snapshots on every downbeat + first and last 0.3 s look like a 2025/26 product ad in the sponsor's world: products are the heroes, clean edges, nothing upscaled.
3. Texts are verified and readable (≥ 1.2 s per message, inside the safe zone), and Czech NBSP rules are respected.
4. Logo rule OK (build log `OK logo …`), and the TA plate is never covered.
5. Transitions meet the handoff contract, and the block looks right as the first and last thing in its Reel.

## 12. Audio mix (integration 19. 10.)
- The build writes ONE audio track per output: `proto/assets/audio/mix_<film|block_<key>|reel_<key>>.wav` (`scripts/lib/mix.py`,
  numpy, deterministic, cached by a stamp of the spec + input mtimes). `<audio id="mix">` replaces the separate music / VO elements
  (`STEMS=1` brings the old separate tracks back for editing in the studio).
- Music is ducked by a sidechain envelope from the VO bus: speech = 10 ms RMS over −42 dBFS, 220 ms hold, 120 ms look-ahead,
  **120 ms attack / 300 ms release**, depth per VO clip adaptive in **−6…−8 dB** (aim: VO ≥ 9.5 LU over the music under it) + a
  presence dip 1–4 kHz (−2.5 dB, up to −4.5 dB) on the same envelope; if the deepest duck is not enough the VO clip is lifted ≤ 1.5 dB.
  Music runs at full level wherever there is no VO.
- Master: **−14 LUFS integrated** (BS.1770-4) and a 4× oversampled true-peak limiter at **−2 dBTP**: ffmpeg's native AAC at 192 kbit/s
  (what the renderer uses) overshoots by 0.1–0.6 dB and on near-mono passages at −1.5 dBTP glitched to +1.5 dBTP (velkaryba Reel).
- After rendering run `node scripts/deliver.mjs`: it re-muxes the pre-mix into each rendered MP4 (video copied, AAC 256 kbit/s once,
  intensity stereo / PNS off) and fails unless −14 ±0.5 LUFS and true peak ≤ −1.0 dBTP.
- Every output length is rounded UP to whole video frames (`FPS`, default 30): otherwise the renderer pads/trims the AAC by re-encoding
  it (2nd AAC generation: +1.3 dB true peak) and then lowers the whole mix by 1.5 dB to get back under −1 dBTP.
  The build log prints `MIX …` with LUFS / dBTP / limiter GR / VO-over-music; per-clip values are in `mix_*.wav.stamp`.
- Settings: `MIX` in `build.mjs` (override with `"mix": {…}` in `data/content.json`). Blocks never touch audio.
- Logo rule, motion part: any `scale > 1` tween on a sponsor logo or one of its ancestors (a lockup „settle 1.05 → 1“) is checked at
  its peak against the plate scale at that moment (`XX logo motion …` throws). Fit such a logo to `scale ÷ settle`.
- Build rules added: `PRIZE CHIP` (every sponsor block + its Reel end card shows „Věnuje ceny · MČR 2026“ / GH „Věnuje hlavní cenu“,
  the venue never does) throws like the logo rule; duplicate `<img>` of one file in a sub-composition get a `#d2…` URL fragment
  (lint `duplicate_media_discovery_risk`; the browser still loads the one cached file).
