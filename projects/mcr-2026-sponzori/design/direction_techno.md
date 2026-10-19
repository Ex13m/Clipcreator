# Direction TECHNO: „TELEMETRIE" — MČR 2026 · partneři

A vertical 9:16 sponsor film for **Mistrovství ČR v Trout Area 2026**, styled as the graphics package of a sports broadcast and set to minimal techno. Every partner block is an 8.000 s **channel**. Each channel is a self-contained sub-composition that also exports as a standalone vertical banner.

| | |
|---|---|
| Master | **75.0 s** = intro 4.0 + 8 channels × 8.0 + finale 7.0 (120 BPM, 37½ bars) |
| Channel / banner | 8.000 s = 4 bars = 16 beats. Variants: BANNER-10 (10.0 s) and LOOP-6 (6.0 s, seamless) |
| Canvas / time | 1080 × 1920, 30 fps. 1 frame = 33.3 ms, 1 beat = 15 frames, 1 bar = 60 frames |
| Grid | **MATRIX 9 × 16**: 120 px cells, vertical keylines at x = 60 + 120k, horizontals at y = 120k |
| Type | Montserrat only (600 / 700 / 800 / 900). The GH mark keeps its own lockup |
| Palette | `#0b1e42` `#304285` `#8ea2d8` `#eef2f9` `#e31e24` + white logo plates |
| Voice | Paul Broadcaster, ElevenLabs v3 via HeyGen, `cs` (BRIEF decision) |
| Hard rules | The **TA CZ plate is visible in every frame**. A sponsor logo is never wider, and never larger in area, than the TA logo. Every channel reads **muted**. |

> **Inputs reconciled.** The computed task said date and place were unknown. BRIEF.md has since verified **24.–25. 10. 2026, Líheň Liběchov, rybník Malý Sporťáček**. This doc keeps the variables `{DATUM}`, `{DATUM_KRATKY}`, `{MISTO}`, `{MISTO_KRATKO}` and `{REVIR}`, with the verified values as defaults. BRIEF also adds an 8th unit, the venue ad (Líheň Liběchov), plus b-roll from the user's own trout-area photos. Both are built in: the venue is CH 01, and the b-roll is the **FEED** that opens every channel.

---

## 1. Concept and mood

### 1.1 The idea: the championship as a live broadcast
**"MČR běží na telemetrii."** The film is the opening graphics package of a championship broadcast. Each partner is a **channel**, CH 01 / 08 … CH 08 / 08. Each channel is *acquired like a signal*, always in the same 16-beat order, like a step sequencer that plays one pattern per partner:

1. The **feed** comes in: a real fishing photo.
2. The scanner **locks on** to the partner's logo.
3. The departure board **flaps** in the partner's name.
4. A **scan line** turns the photo into a data stage.
5. Products are **locked, labelled and glinted**.
6. Three **data rows** report the facts.
7. The URL is **called**.
8. The **faders close** the channel on the downbeat.

Team tagline: **Precision is the fashion.** Nothing wobbles and nothing glitches. Every element lands on the grid and on the beat.

### 1.2 Why it reads as fashion-grade
| Fashion / design device | How TELEMETRIE uses it |
|---|---|
| A visible Swiss grid as the aesthetic (Müller-Brockmann; the Off-White and Balenciaga web systems) | **MATRIX**: the 9:16 canvas is literally a 9 × 16 grid of 120 px cells, drawn as hairlines with registration crosses. Every element snaps to it. |
| Spec labels and "quotation" labelling (Virgil Abloh; Nike ACG and Tech Pack spec tags) | Product labels (`SPOON · 2,1 g`), timing-tower **data rows**, and claims set in “quotes”. |
| Split-flap departure boards (Solari di Udine; luxury pop-ups) | **FLAP**: the name board, the counters and the CH number. |
| Techno show scores (Balenciaga × BFRND, Prada × Richie Hawtin) | Minimal techno at 120 BPM, sparse enough to sit under a VO. |
| Product films lit with specular light (Apple, Prada Linea Rossa) | **GLINT** on spoons, the chrome thermos and the carbon tubes. |
| Hardware instrument UI (Teenage Engineering OP-1 / OP-Z, Braun) | **STEP rail**: 16 pads = 16 beats = the channel's progress bar. |
| Sports broadcast (F1 TV timing tower, UEFA graphics) | Channel header, data rows, **LOCK-ON** brackets, scan. |

Restraint carries the "fashion" read. There is one accent colour and one type family. No decoration lacks a job, except the matrix itself, which is the brand.

### 1.3 Why it is unmistakably TA CZ (heritage map)
| Previous TA CZ films | TELEMETRIE (evolved, same DNA) |
|---|---|
| Drum-pad lights: a running light on every beat | **STEP rail**: 16 pads. The lit pad is the current beat, and the pads behind it stay half-lit, so the rail *is* the channel's progress bar. Same `padHit` red and `padHit2` sky. |
| Mixer-fader transition: 16 random faders rise and fall on the bar | **FADER GATE**: 10 grid-aligned columns with fader caps. They rise to close the channel exactly on the cut and pass through upward to open the next. |
| Equalizer bars animated on charts | **SPECTRUM**: 28 bars driven by the *real* track (precomputed bands), with red peak-hold caps. |
| Full-frame flash on downbeats, rotating rays | **MATRIX row pulse**: local 10 % light that walks down one grid row per beat. Plus the **SCAN** line, which gives directional light. |
| Navy / red / ice, Montserrat 900, TA logo on a white plate | The same tokens. The plate is fixed top-left in every frame of every unit. |
| librosa beat grid, `build.mjs` generator | The same pipeline. Every event anchor is quantized to frames. |
| GH "made by" gear with a rotating ring | The finale sign-off, live, with the ring turning. |

The content is ours too. Real trout-area photos (H-BATTLE 2026, Klonówiec 2026) are the feeds. Procedural spoon, crank and jig glyphs supply the motion texture. Copy and VO are Czech.

### 1.4 What "a level above the previous films" means in practice
- **No full-frame flashes.** Light is directional (scan, glint) and local (pads, rows).
- **No random heights or jitter.** All pseudo-variation is seeded at build time, and everything lands on integer px and on frames.
- **Real audio drives the meters** (spectrum bands from the track), not decorative random scale.
- **Frame-exact durations** (9 f, 10 f, 15 f, 17 f…) and a fixed ease palette, so the film moves like one instrument.
- **New moves:** split-flap boards, lock-on brackets, scan, specular glints, macro loupe, grid snap. Each one is reused, so each becomes a signature.
- **One system for master and banners.** Each channel is its own composition and exports untouched.

### 1.5 Mood, references, anti-references
**Mood words:** nocturnal navy · cold precision · one red signal · machined · confident · quiet.
**References:** F1 TV timing graphics, Solari split-flap boards, the Teenage Engineering OP-Z sequencer, Off-White spec labels, Apple product-film light sweeps, Balenciaga and BFRND techno shows, the Swiss International Style.
**Anti-references (never):** RGB-split or glitch, VHS, datamosh, camera shake, cyberpunk neon or cyan, hexagon "gaming HUD", fake "% loading" bars, full-frame strobes, chrome 3D text, lens flares, gradients on type, bouncy `back.out` pops (overshoot is allowed only at the moment of lock).

---

## 2. Design tokens

### 2.1 Palette and usage rules
| Token | Hex | Role | Max share of frame | Rules |
|---|---|---|---|---|
| `deep` | `#0b1e42` | Stage base. Board and flap cells | 60–70 % | Background gradient: `radial-gradient(110% 60% at 22% 14%, #1d3a86 0%, #0b1e42 46%, #050d22 100%)` |
| `cover` / `navy` | `#304285` | Gate columns, pad-wipe cells, data-row hairline base, ink on light cards | full frame only during the cover state | Never used for small text on deep navy (contrast is too low) |
| `sky` | `#8ea2d8` | HUD chrome: labels, scan glow, spectrum tips, registration crosses | ≤ 8 % | Text on deep navy has 6.5 : 1 contrast, so it is fine for LABEL 24 |
| `ice` | `#eef2f9` | Primary type on dark. LIGHTBOX cards | 10–20 % | 15 : 1 on deep navy |
| `red` | `#e31e24` | **The signal**: the current pad, the lock moment, the scan head, the URL dot, peak caps, *one* keyword per channel | **≤ 4 %** | Only 3.5 : 1 on deep navy, so red text must be ≥ 44 px / 800. Never a large fill. |
| `white` | `#ffffff` | Logo plates only (TA and sponsors) | ≤ 8 % | Products never sit on pure white. They sit on ice (LIGHTBOX). |
| `bg0` | `#050d22` | Vignette, edge falloff | — | — |
| `gold` | `#ffd36b` | **Not used** in this direction | 0 | Keeps the single-accent discipline |

**Sponsor accent rule.** A sponsor's own colours appear only inside its logo artwork and in a **6 px accent tab** on the left edge of its logo plate, like a garment tag. There is one exception: in the Jigovky channel the STEP pads borrow the five jig colours (§4.9).

### 2.2 Typography (1080 × 1920, px)
Montserrat is local in `proto/assets/fonts` at 600, 800 and 900 (plus 800/900 italic), latin and latin-ext. **The 700 weight is missing.** Add `montserrat-latin-700-normal.woff2` and `montserrat-latin-ext-700-normal.woff2` (fontsource). Until then, labels fall back to 800.

| Token | px | Weight | Tracking | Line-height | Use |
|---|---|---|---|---|---|
| MEGA | 220 | 900 | −0.04em | 0.86 | Intro "2026" |
| DISPLAY | 132 (120 for long words) | 900 | −0.03em | 0.92 | Finale "DĚKUJEME / PARTNERŮM" |
| BOARD-XL | 60 in 62 × 84 cells | 800 | cells | — | Intro flap rows |
| H1 / VALUE-NUM | 72 (56 when > 6 chars) | 900, tabular | −0.02em | 1.0 | CALL URL, numeric data values |
| H2 | 64 | 800 | −0.015em | 1.10 | Headline / one-liner, ≤ 2 lines |
| BOARD | 34–52 in cells | 800 | cells | — | Name board (M4) |
| VALUE-TXT | 40 | 800 | −0.01em | 1.10 | Text data values, ≤ 2 lines |
| BODY | 34 | 600 | 0 | 1.20 | Sub-line, CTA sub, sign-off lines |
| LABEL | 24 | 700 | +0.12em (data), +0.18em (kicker) | 1.20 | Data labels, kicker, product labels, header |
| MICRO | 18 | 600 | +0.22em | 1.20 | **Decor only** (scan readout, plate tags). Never carries information. |

Rules:
- **Readability floor:** any text that carries information is ≥ 24 px, and stays on screen ≥ 1.5 s (3 beats). Body copy is ≥ 34 px.
- **Line limits:** H2 ≤ 22 characters per line, ≤ 2 lines. VALUE-TXT ≤ 16 characters per line, ≤ 2 lines, in a 400 px column. LABEL ≤ 18 characters in a 400 px column. BODY ≤ 44 characters.
- **Czech diacritics:** masked text (SLAB) uses a mask box of **1.12em**, not 1.0. Uppercase `Č Ř Š Ž Ů É` carons and rings are otherwise clipped.
- **Czech typesetting:** use `&nbsp;` after single-letter prepositions and conjunctions (`v k s z o u a i`). Thousands use a thin space (`1 300`), decimals a comma (`2,1 g`), ranges an en dash (`0,5–0,7 l`), and dates the form `24.–25. 10. 2026`.
- **Numerals:** `font-variant-numeric: tabular-nums` everywhere digits animate.
- **Case:** headlines in sentence case, with uppercase only for claims in “quotes”. Labels, kickers and boards are uppercase.

### 2.3 Grid and safe zones
**MATRIX.** Vertical hairlines at x = 60, 180, 300 … 1020 (9 lines). Horizontal hairlines at y = 0, 120 … 1920 (17 lines). Cells are 120 × 120, with half-cells (60 px) at the left and right edges. Lines: 1 px `rgba(142,162,216,.10)`. **Registration crosses** sit at intersections inside the safe box: 13 × 13 px, 1 px, `rgba(142,162,216,.28)`.

**Safe zones (Reels / TikTok):**
- **Content box:** x 60–1020, y 240–1440 (8 columns × 10 rows).
- **Right action column:** for y ≥ 900, content must stay at **x ≤ 900** (gridline 8).
- **Decor-only bands:** y 0–240, y 1440–1920, and the strip x 900–1080 for y ≥ 900. Only the matrix, feed imagery, the lure field and the ticker go there.

**Module map** (fixed for every channel; x, y, w, h in px):

| ID | Module | Box | Content |
|---|---|---|---|
| M1 | **TA PLATE** | 60, 256, 444, 163 | `ta_logo_h.png` at 400 w (131 h) on white, padding 22 / 16, radius 16, shadow `0 8px 24px rgba(0,0,0,.35)`. **Top z-order, always.** HERO pose: same origin (top-left), scale 2.05 (910 × 334), at x 60, y 300 (intro) or x 60, y 520 (finale). |
| M2 | Header data | 540, 256, 480, 163, right-aligned | A y 262: `CH 03 / 08` (red 10 × 10 "LED" square, LABEL `CH` in ice, flap digits 28 × 36. Red stays a shape here, since red *text* must be ≥ 44 px). B y 310: kicker LABEL sky. C y 350: `MČR TROUT AREA 2026` LABEL ice 72 %. D y 390: `{DATUM_KRATKY} · {MISTO_KRATKO}` LABEL ice 55 %. |
| M3 | Sponsor logo plate | 60, 488, ≤ 444, ≤ 160 | White plate, radius 16, padding 22 / 16, 6 px accent tab. Logo size per §2.7. |
| M4 | Name board | 520, 496, 500, 64 | Flap cells: pitch p = min(46, ⌊500 / n⌋), cell w = p − 4, font = min(52, round(1.25 · w)) |
| M4b | Tag | 520, 576, 500, 30 | LABEL sky, optional (e.g. `E-SHOP · PIEŠŤANY`) |
| M5 | Headline | 60, 680, 960, 142 | H2 × 2 lines. In CALL, replaced by the URL (H1 72) |
| M6 | Sub | 60, 836, 960, 42 | BODY sky. In CALL, replaced by the CTA sub |
| M7 | **Stage** | 60, 904, 840, 408 | HERO: one product box 840 × 408. SPLIT: data column **M7L** 60, 904, 400 × 408 plus product column **M7R** 500, 904, 400 × 408 |
| M8 | Spectrum | 60, 1324, 840, 44 | 28 bars 24 px wide, gap ≈ 6.2, baseline y 1368 |
| M9 | Step rail | 60, 1392, 840, 24 | 16 pads 46 × 24, radius 4, `justify-content: space-between`. 4 px downbeat ticks at y 1420 |
| M10 | Ticker (decor) | 0, 1484, 1080, 32 | LABEL sky 45 %, crawl |

A **data row** in M7L is 400 × 136. It has a 1 px hairline at the top (ice 30 %), the label at +14 (LABEL sky) and the value at +48 (VALUE-NUM 72 or VALUE-TXT 40). An optional footnote at +118 is MICRO, decor only, so it never holds a required claim. Three rows fill 408 px.

```
y=0     ┌───────────────────────── decor band: matrix · feed · lure field ─────────────────────────┐
y=240   ├─ M1 TA PLATE 444×163 ───────────────┐            M2  CH 03 / 08 · PARTNER MISTROVSTVÍ  │
        │  [TROUT AREA CZECH REPUBLIC]         │                MČR TROUT AREA 2026 · 24.–25. 10.  │
y=480   ├─ M3 LOGO PLATE ≤444×160 ─────┐  M4 [T][R][O][U][T][S][H][O][P][.][E][U]  M4b TAG      │
y=680   ├─ M5 HEADLINE  H2 64 · 2 lines ─────────────────────────────────────────────────────────┤
y=836   ├─ M6 SUB  BODY 34 ──────────────────────────────────────────────────────────────────────┤
y=900   ├─ M7 STAGE 840×408   HERO │ SPLIT: M7L data rows 400 · M7R product 400 ──────┐  action  │
y=1324  ├─ M8 SPECTRUM ▁▃▅▇▅▃▁▂▅▇█▆▃ ─────────────────────────────────────────────────┤  column  │
y=1392  ├─ M9 STEP RAIL ■■■■■■■□□□□□□□□□ ────────────────────────────────────────────────┤  decor   │
y=1440  ├───────────────────────────────────────────────────────────────────────────────┴──────────┤
y=1484  │ M10 TICKER · MISTROVSTVÍ ČR V TROUT AREA 2026 · 24.–25. 10. 2026 · LÍHEŇ LIBĚCHOV ·       │
y=1920  └──────────────────────── decor band (platform captions / UI) ─────────────────────────────┘
        x=60                                                                       x=900   x=1020
```

### 2.4 Texture and light
**Layer stack** (inside every channel; bottom to top):
1. **BG.** The gradient from §2.1.
2. **FEED.** A full-bleed photo or video, visible in BAR 1 only (cleared by the scan).
3. **FEED-DIM.** The same image in navy/sky duotone at 14 %, which stays as stage texture.
4. **MATRIX.** Lines, crosses, and 16 row strips for the row pulse.
5. **LURE FIELD.** Procedural glyphs (§2.6) at 7 %, **only in the decor bands** and the right action column, to fill dead zones with motion.
6. **STAGE.** Cards, products, brackets, data rows.
7. **TYPE.** M3–M6.
8. **RIG.** M8, M9, M10.
9. **SCAN.**
10. **VIGNETTE.** `radial-gradient(120% 80% at 50% 45%, transparent 55%, rgba(5,13,34,.55) 100%)`.
11. **GATE / PAD-WIPE.**
12. **HEADER.** M1, M2.
13. **GRAIN.** Topmost.

- **Grain:** `assets/brand/grain.png` (256 px), `mix-blend-mode: overlay`, opacity **0.18** (the old films used 0.42–0.5; finer is more fashion). It steps at 12 fps through 8 baked offsets, inside the rig driver (deterministic). Over a white plate, overlay grain is invisible, so the plates stay clean.
- **Key light:** static. A soft ellipse of sky at 10 % in the top-left (part of the BG gradient).
- **Floor glow** under floating products: an ellipse 520 × 90 px, `radial-gradient(closest-side, rgba(142,162,216,.22), transparent)`.
- **Scanlines** only inside FEED windows: `repeating-linear-gradient(0deg, rgba(5,13,34,.18) 0 1px, transparent 1px 3px)`. Static, never animated (no flicker).
- **Moving light:** only the SCAN line and the GLINT bands. Nothing else changes luminance on its own.

### 2.5 Image treatments for heterogeneous product photos
The photos mix pure-white JPGs (Velká ryba, Jigovky, Bosset, part of Troutshop and Activefishing) with RGBA cut-outs (Velvet Arts, Timon). Sizes run from 600 to 3024 px, and the GH renders are on dark grey seamless. One rule unifies them: **every product gets the same plate, padding, label and lock behaviour, whatever its source**.

| ID | Treatment | When | Recipe |
|---|---|---|---|
| **T1** | **LIGHTBOX** (multiply on ice) | Any white-background packshot, so no cut-out is needed | Card `#eef2f9`, radius 22, inner hairline `inset 0 0 0 1px rgba(48,66,133,.12)`, corner ticks (12 px L, navy 40 %), a 1 px ruler along the bottom edge (tick every 12 px, every 5th 8 px tall, navy 25 %). Image `object-fit: contain` inside a 40 px inset, with `mix-blend-mode: multiply`. White becomes ice, so the photo's background disappears seamlessly. Product label LABEL navy at bottom-left. |
| **T2** | **FLOAT** (cut-out on navy) | RGBA PNGs, or white shots after masking | Product directly on the stage. `filter: drop-shadow(0 18px 28px rgba(0,0,0,.45))` (static, never animated), floor glow, and a reflection: a copy with `scaleY(-1)`, opacity .16, masked by `linear-gradient(to bottom, #000 0, transparent 40%)`. |
| **T3** | **FEED duotone** | b-roll photos, venue photos, GH video | SVG filter below, navy shadows to sky highlights, then the scanline overlay. "Signal acquired" variant: duotone → full colour over 0.5 s on lock (venue only). |
| **T4** | **LOUPE** | Detail on small or low-contrast products (jig points, spoon hammering, carbon weave) | A circular window 320 px wide showing the same image at 2.0× (§3.2 M09). |
| **T5** | **SPECIMEN STRIP** | Colourways (Moonky, Jigovky) | Four rows of 400 × 96. Each holds a mini LIGHTBOX (cut to 220 × 80), a 24 × 24 colour swatch (dominant colour from prep) and a code label (`C06`, `DC04`). |
| **T6** | **DARK STUDIO** | GH renders (grey seamless, corner RGB 18–101) | `object-fit: cover`, `filter: brightness(.85) contrast(1.08)`. An overlay of `#0b1e42` multiply at 55 %, then a radial feather mask `radial-gradient(75% 70% at 50% 50%, #000 60%, transparent 100%)`. The grey seamless melts into deep navy. |
| **T7** | **LINEUP** | Tall products (Bosset thermoses, 400 × 1500 px) | 5 slots of 168 × 408 on one LIGHTBOX card. Each thermos `contain`s to 360 px tall, bases aligned to the same baseline (y = card bottom − 32). |
| **T8** | **TOPO** | Venue | DSM / ortho render from `drone/data` in duotone, with the crosshair locked on Malý Sporťáček (§4.5). |

**Duotone filter** (inline once per composition):
```html
<svg width="0" height="0" style="position:absolute"><filter id="duo" color-interpolation-filters="sRGB">
  <feColorMatrix type="matrix" values=".2126 .7152 .0722 0 0  .2126 .7152 .0722 0 0  .2126 .7152 .0722 0 0  0 0 0 1 0"/>
  <feComponentTransfer>
    <feFuncR type="table" tableValues="0.020 0.188 0.557 0.933"/>  <!-- #050d22 → #304285 → #8ea2d8 → #eef2f9 -->
    <feFuncG type="table" tableValues="0.051 0.259 0.635 0.949"/>
    <feFuncB type="table" tableValues="0.133 0.522 0.847 0.976"/>
  </feComponentTransfer></filter></svg>
```

**Preparation pipeline.** Extend `scripts/assets_prep/` to write `data/products.json`, deterministic and done once:
1. **Trim and bbox.** Find the bbox of non-background pixels (alpha > 8, or ΔE > 6 from white). Store it as fractions, so LOCK-ON brackets hug the *product*, not the photo.
2. **Mask.** Flood-fill from the image border only, with tolerance ΔE < 6 against white, then a morphological close (2 px) and a 1 px feather. Save as `*_mask.png`. A border flood keeps **interior whites**: white thermos `p03`, Moonky `C05 white`, silver spoon highlights. Plain thresholding would eat them, and so would `rembg`, which also loses thin hooks. Use `npx hyperframes remove-background` only for photos that are not on seamless white.
3. **Dominant colour** of the masked pixels (k-means, k = 3, take the most saturated). Used for swatches.
4. **Resolution rule.** Effective magnification (displayed px ÷ native px) must stay ≤ 1.0, or ≤ 1.15 with a light unsharp mask. Flag any violation at build time. Watch `troutshop/p05` (600 px), `p08` (720 px), `p09` (800 px): use these only in the 400 px column or the strip, never in an 840 px HERO, and never under the LOUPE.
5. **Downscale** any source over 2× its largest display size (e.g. `jigovky/p06` at 3024 × 4032) to 2× the display size, Lanczos.
6. **Loupe point.** An optional `loupe: {x, y}` in fractions, picked by hand per product (hook point, hammered face, carbon weave).

### 2.6 Procedural vector lures (SVG motion texture)
Three stroke-only symbols. They are drawn with `fill:none; stroke:currentColor; stroke-width:2; vector-effect:non-scaling-stroke` and `pathLength="1"` so they can be drawn with a dash.
```html
<svg width="0" height="0" style="position:absolute"><defs>
  <symbol id="g-spoon" viewBox="0 0 60 120"><circle cx="30" cy="8" r="5"/>
    <path pathLength="1" d="M30 16 C41 16 48 30 48 50 C48 74 40 96 30 96 C20 96 12 74 12 50 C12 30 19 16 30 16 Z"/>
    <path pathLength="1" d="M30 96 V106 C30 114 40 114 40 106"/></symbol>
  <symbol id="g-crank" viewBox="0 0 140 90"><path pathLength="1" d="M8 34 C8 18 30 8 62 8 C96 8 122 20 122 35 C122 50 96 62 62 62 C30 62 8 50 8 34 Z"/>
    <path d="M12 40 L2 58 L18 52 Z"/><circle cx="30" cy="28" r="5"/><path pathLength="1" d="M70 62 V70 C70 78 80 78 80 70"/></symbol>
  <symbol id="g-jig" viewBox="0 0 100 80"><circle cx="30" cy="30" r="16"/>
    <path pathLength="1" d="M42 36 H78 C90 36 92 54 80 58 C72 61 66 54 70 48"/></symbol>
</defs></svg>
```
Uses:
- **LURE FIELD.** 18 glyphs on matrix intersections inside the decor bands and the right action column, 48–72 px, sky at 7 %. Each is driven by the rig clock (a pure function of t):
  - Spoon "flutter": `scaleX = cos(2π·t/0.5 + φ)`, one flip per beat.
  - Crank "wobble": `rotation = 6·sin(2π·t/0.5 + φ)` degrees.
  - Jig "bob": `y = 4·sin(2π·t/1.0 + φ)` px.
  - The phase is φ = 2π·rnd(i).
- **Label icons.** A 24 px glyph before each product label: `g-spoon` for spoons, `g-crank` for cranks, `g-jig` for jigs.
- **Spec draw.** In CH 08 the dimension lines and tube outlines draw with `strokeDashoffset: 1 → 0` (§4.12).

### 2.7 Logo plates and the area rule
The TA logo at 400 px wide has a trimmed artwork area of **47 900 px²** (400 × 120). Sponsor logos are trimmed (`assets_prep/*/logo_on_light.png`, alpha bbox) and sized by aspect ratio *a* = w / h:
`w = min(400, √(47 900·a), 128·a)`, `h = w / a`. The plate adds 22 / 16 padding.

| Logo | Trimmed | a | Displayed | Area |
|---|---|---|---|---|
| Líheň Liběchov | 2000 × 2000 | 1.00 | 128 × 128 | 16 384 |
| Troutshop | 1933 × 915 | 2.11 | 270 × 128 | 34 612 |
| Activefishing | 1599 × 666 | 2.40 | 307 × 128 | 39 336 |
| Moonky | 1998 × 509 | 3.93 | 400 × 102 | 40 761 |
| Jigovky | 1800 × 895 | 2.01 | 257 × 128 | 32 951 |
| Velka-ryba | 1800 × 823 | 2.19 | 280 × 128 | 35 834 |
| Bosset | 2000 × 322 | 6.21 | 400 × 64 | 25 760 |
| Gausse Holler | 1600 × 1494 | 1.07 | 137 × 128 | 17 546 |

All of them pass. Every logo sits on **white** (`logo_on_light` variants), including the logos that are normally light-on-dark (GH, Activefishing). The plates then read as one label system with the TA plate. The partner's *presence* is carried by the name board, the products and the URL, not by an oversized logo. Logo wall (finale): artwork ≤ 340 × 80 inside 400 × 112 plates.

### 2.8 Token delta (merge over `data/tokens.json` as `design/tokens.json`)
```json
{
  "_note": "TELEMETRIE direction overrides. px for 1080x1920.",
  "safe": { "top": 240, "bottom": 480, "left": 60, "right": 60, "uiRight": 180, "uiRightFromY": 900 },
  "grid": { "cell": 120, "x0": 60, "line": "rgba(142,162,216,.10)", "cross": "rgba(142,162,216,.28)", "rowPulse": 0.10, "rowPulseDown": 0.16, "rowTau": 0.18 },
  "color": { "cover": "#304285", "scanGlow": "rgba(142,162,216,.55)", "railIdle": "rgba(238,242,249,.08)", "railPast": "rgba(238,242,249,.30)", "railHit": "#e31e24" },
  "type": { "mega": 220, "display": 132, "h1": 72, "h2": 64, "valueTxt": 40, "body": 34, "label": 24, "micro": 18, "boardMax": 52, "maskEm": 1.12 },
  "plate": { "logoW": 400, "padX": 22, "padY": 16, "x": 60, "y": 256, "heroScale": 2.05, "heroIntroY": 300, "heroFinaleY": 520 },
  "logoRule": { "maxW": 400, "maxH": 128, "maxArea": 47900, "wallMaxW": 340, "wallMaxH": 80 },
  "rig": { "pads": 16, "padW": 46, "padH": 24, "bars": 28, "barW": 24, "barH": 44, "peakFall": 1.6, "grainOpacity": 0.18, "grainFps": 12 },
  "motion": {
    "fps": 30, "bpm": 120,
    "ease": { "arrive": "expo.out", "slab": "power4.out", "exit": "power3.in", "move": "power3.inOut", "sweep": "power2.inOut", "gateOpen": "power3.out", "gateClose": "power3.in", "lock": "back.out(2.2)", "ambient": "none" },
    "frames": { "arrive": 9, "lock": 5, "slabIn": 17, "slabOut": 7, "snap": 15, "scan": 15, "glint": 21, "loupeIn": 12, "loupeOut": 7, "gateClose": 10, "gateOpen": 11, "flapPeriod": 2, "flapStagger": 1 },
    "productStepBeats": 2, "loopProductStepBeats": 3
  },
  "transition": { "style": "gate" }
}
```

---

## 3. Motion language

### 3.1 Timing system
- **Grid:** 120 BPM. Beat *b* = 0.5 s = 15 f. A channel is 16 beats, b0–b15. Downbeats are b0, b4, b8 and b12.
- With a real track, block-local beat times come from the librosa grid (`audio/track.beats.json`, minus the block start). Without one, the synthetic 0.5 s grid is used. **All event anchors are frame-quantized:** `q(t) = round(t·30)/30`. Staggers inside one move may be sub-frame.
- **LAUNCH vs LAND:**
  - **LAUNCH** moves *start* on the beat. These are arrivals with `expo.out` / `power4.out`, where most of the travel happens in the first frames, so the impact reads on the beat.
  - **LAND** moves *finish* on the beat. These are exits, gate closes, SNAP and SCAN, where the state change should complete on the beat.
- **Ease palette.** Nothing else is used.

| Role | Ease | Frames (s) |
|---|---|---|
| Arrive (UI, brackets, labels, cards) | `expo.out` | 9 f (0.300) – 12 f (0.400) |
| Lock "bite" (the only overshoot) | `back.out(2.2)` | 5 f (0.167) |
| Type slab in | `power4.out` | 17 f (0.567), stagger 2 f per line |
| Exit | `power3.in` | 7 f (0.233), stagger 1 f |
| Reposition (SNAP, plate dock) | `power3.inOut` | 15 f (0.500) |
| Sweeps (SCAN, GLINT) | `power2.inOut` | 15 f (0.500) / 21 f (0.700) |
| Gate open / close | `power3.out` / `power3.in` | 11 f (0.367) / 10 f (0.333) |
| Digital readouts (flaps, counters, rig) | driver with `ease: "none"` + stepped math | — |
| Ambient (push-ins, ring rotation, ticker) | `none` or `sine.inOut` | long |

### 3.2 Ten signature moves
Common contract: one paused timeline per composition. Moves use `fromTo` with explicit from-states, transforms and opacity (plus `clipPath`) only, seeded variation, and no CSS `transition`. Drivers are pure functions of time.

---

#### M01 · MATRIX (grid, row pulse, pad-wipe)
- **Draw-on** (intro only; in channels the matrix is already present at frame 0):
  - Horizontals: `scaleX 0→1`, origin centre, 18 f `expo.out`, stagger 0.02 s from the centre row (row 8) outwards.
  - Verticals: `scaleY 0→1`, 18 f `expo.out`, stagger 0.03 s from the centre.
  - Crosses: `opacity 0→1` with stagger 0.01 after the lines.
- **Row pulse** (every channel, the walking light): on beat *k* (k = 0…15) row strip *k* (y = 120k) lights to opacity `0.10` (`0.16` on downbeats) in sky and decays `exp(−Δt / 0.18 s)`. Over 16 beats the light walks from the top of the frame to the bottom, a quiet progress cue.
- **PAD-WIPE** variant (intro → CH 01 and CH 08 → finale): 160 cells, 10 columns (60 / 120×8 / 60) × 16 rows, `#304285`.
  - Close: `rotationY 90→0`, 6 f `power2.out`, `transformPerspective: 900`, delay (r + c) × 0.012 s (diagonal from the top-left), **LAND** the last cell on the cut (start = T_cut − 0.488).
  - Open: `rotationY 0→−90`, 6 f `power2.in`, same order from T₀.
  - It is the drum-pad heritage at full-screen scale.
- **SFX:** none for the pulse; `sfx_padwave` for the wipe.

#### M02 · FADER GATE (channel in and out; the evolved mixer fader)
- **DOM:** 10 columns `.gate > i` aligned to the matrix (widths 60, 120 × 8, 60), each `height: 1920px; background: #304285`. **Fader caps** sit *outside* the column body, so the closed state is a clean solid: a top cap `top:-10px` (8 px ice + 2 px red line beneath) and a bottom cap `bottom:-10px` (mirrored).
- **Close** (end of channel): `yPercent 100→0`, 10 f `power3.in`. Centre-first offset dᵢ = ⌊|i − 4.5|⌋ frames (0–4 f). Start = T_cut − 15 f + dᵢ, so **every column is closed by the last frame of the outgoing block** (edges last). The caps rise like faders pushed up.
- **Open** (start of channel): `yPercent 0→−100`, 11 f `power3.out`, start = T₀ + dᵢ. The centre opens first, and the columns pass through and exit at the top.
- **During cover:** M2 flaps the new channel number. M1 never moves.
- **SFX:** `sfx_gate_close` (peaks at the cut), `sfx_gate_open`.

#### M03 · SCAN (feed → data stage)
- **DOM:** `.scan` is a 2 px ice line, full bleed 1080 wide, `box-shadow: 0 0 24px 4px rgba(142,162,216,.55)`. Above it, a 180 px trailing gradient `linear-gradient(to top, rgba(142,162,216,.28), transparent)`. A red head marker 24 × 2 px sits at x 60, and a MICRO readout `SCAN · CH 03` sits at the right margin, 12 px above the line.
- **Motion:** a single proxy `{y: 0→1920}`, 15 f `power2.inOut`, **LAND on b4**. Its `onUpdate` sets the line's `translateY(y)` and the FEED `clip-path: inset(${y}px 0 0 0)`. One driver means zero drift between the line and the wipe. Below the line the feed is still full; above it only FEED-DIM (14 % duotone) remains. `tl.set` puts the line's opacity to 1 at the start and to 0 at the end.
- **Use:** once per channel (b3 → b4); once in LOOP-6 as a "refresh" (b6); in the finale over the logo wall.
- **SFX:** `sfx_scan`.

#### M04 · LOCK-ON (bracket acquisition + label tail)
- **DOM:** four 32 × 32 L-brackets (borders 3 px ice) placed by CSS at the **product bbox** (from `products.json`) outset by 4 px. A 1 px leader and a LABEL chip.
- **Motion:**
  1. Fly: from `{x: sx·80, y: sy·80, opacity: 0}` to `{x: sx·8, y: sy·8, opacity: 1}`, 9 f `expo.out`, LAUNCH on the beat.
  2. **Bite:** `{x: sx·8, y: sy·8} → {x: 0, y: 0}`, 5 f `back.out(2.2)` at +9 f.
  3. **Lock colour:** `borderColor #e31e24 → #eef2f9`, 12 f `power2.out` at +9 f (red only at the moment of lock).
  4. Target reveal, in parallel: `clipPath inset(0 100% 0 0) → inset(0 0% 0 0)` (logos, cards) or `inset(100% 0 0 0) → inset(0% 0 0 0)` plus `y 40→0` (products), 11 f `expo.out` at +2 f.
  5. Label tail: leader `scaleX 0→1`, 6 f `expo.out` at +9 f. Label text: mask rise `yPercent 112→0`, 9 f `expo.out` at +11 f.
- **Release:** brackets `scale 1→1.15, opacity→0`, 7 f `power3.in`, when the target leaves.
- **SFX:** `sfx_lock` on the bite.

#### M05 · FLAP (split-flap boards, counters, CH number)
- **Cell:** w × h (from the M4 formula). Background `#0b1e42`, border 1 px `#304285`, radius 4. A centre seam: 1 px `rgba(5,13,34,.9)` at 50 %. Glyph Montserrat 800 ice, tabular.
- **Rule:** each cell flips **3 + ((i + seed) mod 3)** times through seeded glyphs from `" ABCDEFGHIJKLMNOPQRSTUVWXYZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ0123456789.,-–·/+"`, then shows its final glyph. **Period 2 f (no state shorter than 2 frames), stagger 1 f** from left to right. A 12-character row completes in ≈ 0.53 s (≈ 1 beat). Spaces never flip.
- **Counters (odometer mode):** each digit walks upwards from 0 to its target (at most 6 flips, skipping in even steps). The units digit starts first. Example: `0000 → 1300` then a `+` flaps in.
- **Look:** "Lite" (default) uses a per-frame CSS var `--f` (phase 0…1 inside a flip). It squashes the glyph `scaleY(1 − .5·f)` and darkens the lower half `opacity: .6·f`. At 2 f per flip this reads as a mechanical flap. "Full" (optional, hero boards only) uses two half-cells with `rotateX`.
- **Implementation:** a single **row driver** whose `onUpdate` computes every cell from elapsed time (§7.4). Seek-safe and cheap.
- **SFX:** `sfx_flap` ticks, round-robin, at most 4 per frame.

#### M06 · SLAB (masked type rise + after-image)
- **In:** each line sits in an `overflow:hidden` mask of 1.12em. The inner `span` (display: block) goes `yPercent 112→0`, 17 f `power4.out`, stagger 2 f per line, LAUNCH on the beat.
- **After-image** (headlines and DISPLAY only): a duplicate `em.echo` with `color: transparent; -webkit-text-stroke: 1.5px #8ea2d8` rises the same way +2 f later at opacity .6, then fades `opacity .6→0` over 15 f at +12 f. It reads like a print double-strike that resolves sharp. This is *not* a glitch: one pass, clean resolve.
- **Out:** `yPercent 0→−112`, 7 f `power3.in`, stagger 1 f, **LAND on the next downbeat**.
- **Emphasis:** at most one red word per channel (`.em { color:#e31e24 }`), and only at ≥ 44 px.
- No punch-scale on held headlines (precision). Punches are reserved for pads and the CH digits.

#### M07 · SNAP (grid re-layout between modes)
- **Use:** HERO → SPLIT at b7 → b8, plate dock in the intro and finale, the logo-wall bracket hop.
- **Motion:** 15 f `power3.inOut`, **LAND on the downbeat**. Only `x`, `y` and `scale` move, from module coordinates to module coordinates (integers).
  - The LIGHTBOX card changes shape with a paint-only `clipPath: inset(0px 0px 0px 0px round 22px) → inset(0px 0px 0px 440px round 22px)`.
  - The product wrapper moves `x 0→220, scale 1→0.62`.
  - Width and height are never tweened.
- **SFX:** `sfx_snap` (short airy swish, −20 dB).

#### M08 · GLINT (specular sweep)
- **DOM:** `.glint` sits over the product box, masked by the product's alpha: `mask: url(p_mask.png) center / contain no-repeat`. This matches `object-fit: contain`, so it lines up exactly. Inside it, a band `i` (40 % of the box width, 140 % of its height) with `background: linear-gradient(90deg, transparent 0, rgba(255,255,255,0) 30%, rgba(255,255,255,.85) 50%, rgba(255,255,255,0) 70%, transparent 100%)` and `transform: skewX(-18deg)`. Blend `screen` (FLOAT) or `soft-light` at 1.0 (LIGHTBOX).
- **Motion:** band `xPercent −160 → 260`, 21 f `power2.inOut`, LAUNCH on the beat.
  - Spoons get a **double glint**: a second band at 60 % intensity, 15 f later.
  - Thermos: a vertical cylinder highlight, no skew, 36 f `sine.inOut`.
  - Carbon (GH): skew −40°, 27 f.
- **SFX:** `sfx_shimmer` (spoons and chrome only).

#### M09 · LOUPE (macro circle)
- **DOM:** `.loupe` is 320 × 320 and centred at the product's `loupe` point (clamped inside the stage). It holds the same image at 2.0× (respecting the magnification rule in §2.5). A tick ring (SVG circle r = 164, 2 px ice, 60 ticks via `stroke-dasharray`) and a LABEL tag (e.g. `BARBLESS`, `CARBON`, `HAMMERED`) sit with it.
- **Motion:**
  - Open: `clipPath circle(0px at 50% 50%) → circle(160px at 50% 50%)`, 12 f `expo.out`, LAUNCH b13.
  - Inner image drift: `x/y ±12 px` over 30 f `sine.inOut`.
  - Ring: `rotation 0→45°` over 1.0 s, ease `none`.
  - Close: 7 f `power3.in` (or left to the gate).
- **SFX:** `sfx_loupe` (lens servo).

#### M10 · RIG (STEP rail + SPECTRUM + ticker + lure field)
- **One driver** per composition: `{t: 0 → dur}`, `ease: "none"`. Its `onUpdate(t)` computes the whole rig as a pure function of t (§7.4). No per-beat tweens.
- **STEP:** pad j shows *past* (ice 30 %) if j < k, *hit* if j = k, *idle* otherwise (ice 8 % fill, 1 px ice 22 % border). A hit pad is red `#e31e24`, `--hit = exp(−Δt / 0.12)` drives `brightness(1 + 1.2·hit)` and `box-shadow 0 0 14px rgba(227,30,36,.6·hit)`. Downbeat pads carry a 4 px tick. On b15 all 16 are lit, the gate closes, and the channel is "complete".
- **SPECTRUM:** bar height = band level 0…1 × 44 px (`scaleY`, origin bottom). Ice 38 %, top 6 px sky. A red 2 px peak cap: `peak = max over the last 18 frames of (level(t − s) − 1.6·s)`. Levels come from `audio/track.bands.json` (28 bands × 30 fps, §7.5). The synthetic fallback is a seeded decay per beat.
- **Ticker:** x moves exactly **one text-repeat width per block** (8 s), or per 6 s in LOOP-6. Every unit therefore starts at the same phase, so it is seamless across gates and loops.
- **Lure field** and **grain** offsets (§2.4, §2.6) live in the same driver.

### 3.3 Transitions
**Cover-state contract.** Every unit begins and ends on the identical **cover state**: solid `#304285` full-frame, with M1 (TA plate) and M2 (header) on top, plus grain. Any unit can therefore follow any other, and the order can change at build time with zero rework.

| Boundary | OUT half (end of outgoing unit) | IN half (start of incoming unit) |
|---|---|---|
| Intro → CH 01 | PAD-WIPE close, LAND 4.00 | GATE open |
| CH n → CH n+1 | GATE close, all closed by the last frame | GATE open; CH number flaps during cover |
| CH 08 → finale | GATE close | PAD-WIPE open (diagonal from the top-left) |
| Finale, internal (wall → sign-off) | GATE close, LAND +4.00 | GATE open while the TA plate SNAPs to HERO |

### 3.4 Standalone-banner contract
- **BANNER-8 (default):** the channel composition, untouched, as a standalone root. It opens from cover (gate open) and closes to cover (gate close). Because the first and last frames match, it also loops acceptably in players that loop. M2 line A shows `MČR · 2026` instead of `CH 03 / 08`. Audio is the same 4 bars of music the channel uses in the master (`data-media-start` = master start + track offset) + SFX; VO is optional (`VO=1`). The text carries everything, so it works muted.
- **BANNER-10:** identical to 7.50 s, then the CALL is extended. The URL holds 6.00–9.50 and the product cycle continues: P1 returns at b16, with a second GLINT at b16. The gate closes so the last column lands on the final frame (9.967 s). That is 5 bars of music.
- **LOOP-6 (seamless, 12 beats):** no gate, no feed, no scan-reveal. It starts in SPLIT with M3–M6 and the data rows static and visible from frame 0. Products cycle P1 → P4 every **3 beats** (`loopProductStepBeats: 3`). Each step LANDs on its beat (LOCK-ON launched 9 f early), so P1 is fully locked at t = 0 *and* lands again exactly at t = 6.00. One "refresh" SCAN passes at b6 with no state change. A 12-pad rail, and a ticker phase of 6 s. Frame 0 = frame 180 by construction; QC checks a pixel diff below 1 % (§7.7).
- **Poster frame:** t = 6.60 s of each channel (URL + product + data), exported as PNG for the cover / thumbnail.

### 3.5 Guardrails
- **Photosensitivity:** no full-frame luminance change > 10 % within ⅓ s, except the gate and pad-wipe, which are motion, not flashes, and are luminance-matched (navy ↔ deep navy). At most 3 red lock events per second, and each covers < 1 % of the frame.
- **Reading load:** at most 4 informative text blocks on screen at once. Each informative text is held ≥ 1.5 s. The headline and the data rows never animate while the VO speaks the same fact; only their entrance coincides.
- **Precision:** the end state of every move is integer px on the module map. No `+=` relative tweens, and no tweening of `width`, `height`, `top` or `left`.
- **Simultaneity:** at most 3 primary moves per beat. Secondaries (rig, row pulse, lure field, grain) stay low-contrast.

---

## 4. Storyboard

### 4.1 Master running order (75.0 s)
| # | Unit | Master in–out | Bars | Music section | VO window (master) | Feed / set |
|---|---|---|---|---|---|---|
| 0 | INTRO, title card | 0.00–4.00 | 1–2 | Intro: filtered kick, riser | 0.40–3.20 | br10 lake mist, MATRIX |
| 1 | CH 01 · Líheň Liběchov (místo konání) | 4.00–12.00 | 3–6 | **Drop A** | 4.50–10.50 | venue photo / flyover → TOPO |
| 2 | CH 02 · Troutshop.eu | 12.00–20.00 | 7–10 | Groove A | 12.50–18.50 | br02 → LIGHTBOX + FLOAT |
| 3 | CH 03 · Activefishing.cz | 20.00–28.00 | 11–14 | Groove A + arp | 20.50–26.50 | br05 → FLOAT |
| 4 | CH 04 · Moonky | 28.00–36.00 | 15–18 | Groove A + arp | 28.50–34.50 | br03 → SPECIMEN |
| 5 | CH 05 · Jigovky.cz | 36.00–44.00 | 19–22 | Lift (bass filtered); build in bar 22 | 36.50–42.50 | br13 → LIGHTBOX + LOUPE |
| 6 | CH 06 · Velka-ryba.cz | 44.00–52.00 | 23–26 | **Drop B** | 44.50–50.50 | br07 → LIGHTBOX diptych |
| 7 | CH 07 · Bosset.cz (ceny) | 52.00–60.00 | 27–30 | Drop B | 52.50–58.50 | br16 → LINEUP |
| 8 | CH 08 · Gausse Holler | 60.00–68.00 | 31–34 | "Black" section | 60.50–66.50 | br09 / GH reel → DARK STUDIO |
| 9 | FINALE | 68.00–75.00 | 35–37½ | Final groove, **stab at 72.00**, tail | 68.50–71.50 | br11 → wall → sign-off |

Order is TBD by the user. CH numbers follow the order at build time (`ORDER=`). GH stays last by default because it leads into the "MADE BY" sign-off.

**CUT-60 fallback (59 s):** intro 4 + 8 × **SHORT-6** + finale 7. SHORT-6 is ACQUIRE (b0–b3), then SPLIT directly at b4 (headline + data rows 1–2 at b4 / b5), then CALL at b8, with the gate closing in the last 15 f of 6.0 s. VO is sentence 1 only (≤ 22 syllables).

### 4.2 Persistent in every channel
- **M1 TA plate:** fixed from frame 0 to the last frame, top z-order. Above the gate and the pad-wipe.
- **M2 header:** CH flaps at 0.03–0.40, then holds.
- **MATRIX** with the row pulse, **RIG** (step rail, spectrum), **ticker**, **lure field**, grain and vignette: present from frame 0. The spectrum and rail are at idle until b4.

### 4.3 INTRO, championship title card (master 0.00–4.00)
| t | Beat | On screen | Motion | Audio |
|---|---|---|---|---|
| 0.00 | b0 | Deep navy. FEED `br10_lake_mist` duotone 30 %, push `scale 1.10→1.00` over 4 s `power1.out`. MATRIX draws. | M01 draw-on (0.00–0.70) | Filtered kick; `sfx_riser` 0.00–4.00 |
| 0.10 | — | **TA plate HERO** (x 60, y 300, scale 2.05, 910 × 334) | M04 LOCK-ON from the canvas corners (bite at 0.40); plate wipe 0.17–0.53 | `sfx_lock` (hero variant) at 0.40 |
| 0.40 | — | — | — | **VO** 0.40–3.20 |
| 0.50 | b1 | Board row 1 `MISTROVSTVÍ ČR` (y 690, 14 cells 62 × 84, font 60) | M05 FLAP, done ≈ 1.07 | flap ticks |
| 1.00 | b2 | Board row 2 `V TROUT AREA` (y 786, 12 cells) | M05 FLAP | flap ticks |
| 1.50 | b3 | **`2026`** MEGA 220 ice (x 52, y 896–1086), with a red 8 px rule under it (x 60–660) | M06 SLAB; rule `scaleX 0→1`, 12 f `expo.out` at 1.63 | soft impact |
| 2.00 | b4 | Stats: three data cells (x 60 / 340 / 620, w 260, y 1130–1250): `40` ZÁVODNÍKŮ · `12` KOL · `2` DNY, plus chip `HARD BAITS` | Hairlines `scaleX` 9 f `expo.out`, stagger 2 f. Values FLAP odometer 2.00–2.45. Labels mask-rise at 2.10. | flap ticks |
| 2.50 | b5 | `{DATUM} · {MISTO}` BODY 34 / 800 (y 1282). MATRIX FLASH: 6 seeded cells in rows 12–15 (decor band) show duotone b-roll crops (br01, br04, br08, br15) for 1 beat each | SLAB; cell `opacity` set on the beat, then 12 f `power2.out` decay | — |
| 3.00 | b6 | Title type exits. **TA plate docks** HERO → M1 | SLAB-out LAND 3.27; M07 SNAP 3.00–3.50 | `sfx_snap` |
| 3.50 | b7 | M2 header: `PARTNEŘI MISTROVSTVÍ` | M05 FLAP 3.50–3.90 | reverse cymbal (music) |
| 3.51 | — | Cover | M01 PAD-WIPE close, LAND 4.00 | `sfx_padwave` |

### 4.4 Channel template (block-local t; master = block start + t)
| t | Beat | Phase | On screen | Moves | Audio |
|---|---|---|---|---|---|
| 0.00 | b0 | **ACQUIRE** | Gate opens on the FEED (b-roll duotone + scanlines, push `1.06→1.00` over 2.0 s `power2.out`). CH number flaps. | M02 open; M05 (M2, 0.03) | `sfx_gate_open`; music downbeat stab |
| 0.50 | b1 | | **Logo plate** (M3) locks | M04 (bite 0.80); plate wipe 0.57–0.93 | `sfx_lock` · **VO starts 0.50** |
| 1.00 | b2 | | **Name board** (M4) and tag (M4b) | M05 row; tag mask-rise 1.30 | flap ticks |
| 1.50 | b3 | | **SCAN**: feed → data stage | M03, LAND 2.00 | `sfx_scan` |
| 2.00 | b4 | **IDENT** | **Headline** (M5). LIGHTBOX card or FLOAT floor appears in M7 (HERO). Rig wakes. | M06 in; card `clipPath inset(100% 0 0 0)→inset(0% …)` 12 f `expo.out` | — |
| 2.50 | b5 | | **P1** locks in HERO, with its label tail | M04 | `sfx_lock` (−6 dB) |
| 3.00 | b6 | | GLINT on P1 | M08 | `sfx_shimmer` (metal) |
| 3.50 | b7 | | **Sub** (M6) rises. SNAP HERO → SPLIT starts. | `opacity 0→1, y 12→0`, 9 f `expo.out`; M07 LAND 4.00 | `sfx_snap` |
| 4.00 | b8 | **SPEC** | **Row 1** (M7L). **P2** replaces P1 in M7R. | Hairline 9 f; label mask; value M05; P1 out `x −40, opacity 0` 7 f `power3.in`, P2 via M04 | `sfx_blip` + flaps |
| 5.00 | b10 | | **Row 2**. **P3** | same | `sfx_blip` |
| 5.50 | b11 | | **Row 3** (or status chips) | same | `sfx_blip` |
| 5.77 | — | | Headline out (LAND 6.00) | M06 out | — |
| 6.00 | b12 | **CALL** | **URL** (M5, H1 72 with a red `.`), **CTA sub** (M6). **P4** | M06 in; M04 | `sfx_lock` |
| 6.50 | b13 | | LOUPE on the P4 detail | M09 | `sfx_loupe` |
| 7.00 | b14 | | Hold. VO must have ended (target ≤ 6.50). Rail at 15/16. | — | music only |
| 7.50 | b15 | | Last pad. Gate closes (all closed by 7.967). Content dims `opacity 1→.7, scale 1→.985` 9 f `power2.in` at 7.53. | M02 close | `sfx_gate_close` 7.45→8.00 |

Text hold times: headline 2.0–5.8 (3.8 s), row 1 4.0–8.0 (4.0 s), row 2 3.0 s, row 3 2.5 s, URL 2.0 s. The board shows the name from 1.0 s to the end (7 s).

### 4.5 CH 01 · LÍHEŇ LIBĚCHOV, místo konání (master 4.00–12.00)
| Field | Content |
|---|---|
| Set | FEED (full colour) → **TOPO** (T8) → SPLIT with photo |
| Feed b0–b3 | `drone/final/flyover_9x16.mp4` if delivered (muted `<video>`, `data-start` inside the sub-composition). Fallback: `assets/libechov/velky_sportak.jpg`, push 1.00→1.10 |
| M2 kicker | `MÍSTO KONÁNÍ` |
| M3 logo | `assets_prep/libechov/logo.png`, 128 × 128 |
| M4 board / M4b | `LÍHEŇ LIBĚCHOV` (14 cells) / `PSTRUŽÍ LÍHEŇ · BOŽÍ VODA` |
| M5 headline / M6 sub | `Dějiště MČR v Trout Area 2026` / `{REVIR}` = `rybník Malý Sporťáček` |
| Stage | b4: TOPO card. `drone/data/dsm_core_1m_render.tif` → PNG, duotone, a crop of 840 × 408 centred on the pond. b5: LOCK-ON crosshair on Malý Sporťáček at fractions (0.377, 0.698) of the 800 m core bbox (UTM 461451.7 E / 5584691.8 N). Label `MALÝ SPORŤÁČEK · 50.4130° N 14.4575° E` (measured centroid, `drone/data/README.md`). b7 SNAP: TOPO → M7R, then P2 `nasazeni_trofejnich_pstruhu.jpg` (duotone → colour 15 f), P3 `maly_sportacek_photo.jpg` |
| Rows | 1 `TERMÍN` / `{DATUM_KRATKY}` = `24.–25. 10.` · 2 `TRADICE OD` / `1934` (odometer) · 3 `PSTRUHAŘSTVÍ` / `164 m n. m.`, footnote `donedávna nejníže položené v Evropě` |
| CALL | `lihenlibechov.cz` / `Přijďte se podívat · 24.–25. 10.` |
| Special | **TOPO LOCK** (b5) with `sfx_sonar` (soft ping). b13 LOUPE on the ortho of the pond at 2× |
| VO | „Mistrovství hostí Líheň Liběchov. Pstruží líheň s&nbsp;tradicí od roku 1934." (29 syllables) |

### 4.6 CH 02 · TROUTSHOP.EU (12.00–20.00)
| Field | Content |
|---|---|
| Set | br02 `netting_sunrays` → **FLOAT** for the RGBA spoons, LIGHTBOX for the JPG cranks. Accent tab `#e3000f` |
| M4 / M4b | `TROUTSHOP.EU` / `E-SHOP · PIEŠŤANY · SK` |
| M5 / M6 | `“THE TROUT FISHING SPECIALIST!”` (their EN claim in quote marks; `SPECIALIST` is the red word) / `Milujeme lov pstruhů` |
| Products | P1 `p01_velvet-arts-forte-2-1g-32-glow-pink.png` (`VELVET ARTS FORTE · 2,1 g`, double glint) · P2 `p02 …-35-yellow-red.png` · P3 `p09_nories-rooney-2-8g` (`NORIES ROONEY · 2,8 g`, 800 px, column only) · P4 `p06_nories-crankin-pupa` (2048 px, LOUPE on the lip) |
| Rows | 1 `V OBORU OD` / `1999` (footnote `rodinná firma`) · 2 `SÍDLO` / `Piešťany · SK` · 3 `GENERÁLNÍ PARTNER` / `Trout Area Slovakia` |
| CALL | `troutshop.eu` / `do Česka do pár dní` |
| Special | **QUOTE LABELS**: the claim is set in Off-White-style quotes with a LABEL `"CLAIM"` tag top-right of M5. Double glint on spoons. |
| VO | „Troutshop. Specialista na lov pstruhů – a&nbsp;generální partner Trout Area Slovakia." (26) |

### 4.7 CH 03 · ACTIVEFISHING.CZ (20.00–28.00)
| Field | Content |
|---|---|
| Set | br05 `reeling_portrait` → **FLOAT**. Accent `#e2812d` |
| M4 / M4b | `ACTIVEFISHING.CZ` (16 cells, font 34) / `E-SHOP · PŘÍVLAČ` |
| M5 / M6 | `Vybavení pro všechny, kdo milují přívlač` / `e-shop Stanislava Lukáška` |
| Products | P1 `p03_timon-rhomy-218` · P2 `p06_nories-sofia-sk017` (RGB white, needs a mask) · P3 `p04_khor-frea-fc09` · P4 `p08_timon-micro-panicra-yazy` (LOUPE) |
| Rows | 1 `PLANDAVKY` / **`1 300+`** (odometer 0000 → 1300, then `+`; footnote `předních japonských značek`) · 2+3 merged into **STATUS PADS**: three chips `RYCHLOST DORUČENÍ` · `UNIKÁTNÍ SORTIMENT` · `OSOBNÍ PŘÍSTUP`, each with a 24 × 14 pad that lights red then settles to sky on b10, b10.5 and b11 |
| CALL | `activefishing.cz` / `plandavky · woblery · pruty` |
| Special | **ODOMETER**, the biggest counter in the film, with `sfx_counter` (fast flap clatter) |
| VO | „Activefishing. Přes tisíc tři sta plandavek předních japonských značek – i&nbsp;do turnajových podmínek." (28) |

### 4.8 CH 04 · MOONKY (28.00–36.00)
| Field | Content |
|---|---|
| Set | br03 `fish_in_net` → LIGHTBOX → **SPECIMEN STRIP** (T5). Accent `#6883ba` |
| M4 / M4b | `MOONKY.CZ` / `HANDMADE LURES` |
| M5 / M6 | `Speciální gumové nástrahy pro Trout Area` / `vyrobeno v&nbsp;České republice` |
| Products | P1 HERO `p01_savory_c06_green_crop.png`. At the b7 SNAP the HERO folds into a **4-row specimen stack** in M7R: `C06 green` · `C01 pink bubblegum` · `DC04 yellow-orange` · `DC03 brown-orange`. Rows lock one per beat (b8–b11), each with a swatch chip. P4 = `u04_gamer_big_macro.jpg` in the LOUPE at b13 |
| Rows | 1 `S REPREZENTACÍ ČR` / `8 let` · 2 `VÝROBA` / `návrh → CNC forma` · 3 `MATERIÁL` / `guma bez ftalátů` |
| CALL | `moonky.cz` / `nástrahy, které pstruzi milují` (packaging claim; alternative `vyrobeno v ČR`) |
| Special | **COLOUR STORY**: swatches fill in step with the pads, with `sfx_blip` per swatch |
| VO | „Moonky. Speciální gumové nástrahy pro Trout Area – od návrhu až po vlastní formy." (27) |

### 4.9 CH 05 · JIGOVKY.CZ (36.00–44.00)
| Field | Content |
|---|---|
| Set | br13 `lure_check` → LIGHTBOX + heavy **LOUPE**. Accent `#fed700` / `#176e37` |
| M4 / M4b | `JIGOVKY.CZ` / `JIGOVÉ HLAVIČKY · TÁBOR` |
| M5 / M6 | `Jigy, které chytají!` (`chytají` is the red word) / `poctivě vyrobeno v&nbsp;ČR` |
| Products | P1 `p01_troutjig-barbless.jpg` · P2 `p07_hd-barbless-red-1-3g.jpg` (crop zoom 2.2 at 88 % / 44 %) · P3 `p08_sickle-classic-2.jpg` · P4 `p02_hd-barbless-fluo-0-4g.jpg`, with the LOUPE on the hook point tagged `BARBLESS` |
| Rows | 1 `TROUTJIG BARBLESS` / `0,4–3 g` · 2 `VÝROBA` / `poctivě v ČR` · 3 `VÝBĚR` / `největší výběr jigových hlaviček` (footnote `dle jigovky.cz`) |
| CALL | `jigovky.cz` / `jigy · rotačky · háčky` |
| Special | **COLOURWAY PADS**: in this channel only, the 16 STEP pads use the five jig colours `#c9ff3a #ff3fa8 #ff7a1a #e31e24 #d8a93a` in rotation for the *hit* state. Music: lift section, with the build in the last bar (42–44) |
| VO | „Jigovky. Jigy, které chytají – poctivě vyrobené v&nbsp;Česku, i&nbsp;bez protihrotu." (25) |

### 4.10 CH 06 · VELKA-RYBA.CZ (44.00–52.00)
| Field | Content |
|---|---|
| Set | br07 `landing_rod_up` → LIGHTBOX **diptych**. Accent `#143d6b` |
| M4 / M4b | `VELKA-RYBA.CZ` / `PŘÍVLAČOVÁ SPECIÁLKA · OLOMOUC` |
| M5 / M6 | `Vše na přívlač` / `e-shop i&nbsp;kamenná prodejna v&nbsp;Olomouci` |
| Products | HERO **diptych**: P1 `p05_illex-native-spoon-pink-yamame` and P2 `p06_…-copper-trout` side by side (2 × 420). Both lock at b5, a **double glint** crosses both at b6. At the SNAP, P2 stays in M7R. P3 `p01_cardiff-roll-swimmer-ce-orange-gold` · P4 `p09_daiwa-presso-adm-flashing-green` (LOUPE, `HAMMERED`) |
| Rows | 1 `OD ROKU` / `2011` · 2 `PRODEJNA` / `Olomouc + e-shop` · 3 `PARTNER` / `Shimano Rod Test Center` (footnote `pruty si půjčíte a vyzkoušíte u vody`) |
| CALL | `velka-ryba.cz` / `plandavky pro pstruhy a&nbsp;Trout Areu` |
| Special | **DIPTYCH** + double shimmer. Music Drop B lands at b0 |
| VO | „Velká ryba. Přívlačová speciálka z&nbsp;Olomouce – a&nbsp;partner Shimano Rod Test Center." (26) |

### 4.11 CH 07 · BOSSET.CZ, ceny (52.00–60.00)
| Field | Content |
|---|---|
| Set | br16 `dock_gear` → **LINEUP** (T7). Accent `#1b97b1` / `#ffc500` |
| M2 kicker | `PARTNER · CENY` |
| M4 / M4b | `BOSSET.CZ` / `TERMOSKY DO CEN` |
| M5 / M6 | `Termosky do cen` (`cen` is the red word) / `Zojirushi · {OBJEM}` = `0,5–0,7 l` |
| Products | LINEUP of 5: `p07 orange` · `p04 black` · `p01 green` · `p02 pink` · `p06 beige`. They rise `y 60→0`, 12 f `expo.out`, one per half-beat from b5. A single bracket set **SNAPs** along the lineup (7 f per hop). Vertical cylinder GLINT across all five at b6. At the SNAP the lineup compresses into M7R (scale 0.48) |
| Rows | 1 `OBJEM` / `{OBJEM}` · 2 `HORKÉ I STUDENÉ` / `až 6 h` with the **THERMO DIAL** · 3 `DISTRIBUTOR` / `Keitech · YGK X-Braid` (footnote `přívlači se věnují víc než 20 let`) |
| CALL | `bosset.cz` / `expedujeme do 24 h` |
| Special | **THERMO DIAL**: a 72 px SVG ring with 6 hour ticks. It draws `strokeDashoffset 1→0` over 21 f with the value flap, and `sfx_cap` (cap click + short steam hiss). `{CENY_POPIS}` (which placings win the thermoses) is shown as MICRO only once confirmed |
| VO | „Bosset věnuje do cen termosky Zojirushi. Horké i&nbsp;studené až šest hodin." (24) |

### 4.12 CH 08 · GAUSSE HOLLER (60.00–68.00)
| Field | Content |
|---|---|
| Set | Feed `gausseholler/v01_revolut8_standard_reel.mp4` (muted, cropped 9:16), or br09 `landing_rods_flare` → **DARK STUDIO** (T6). Accent `#f0904f` (the orange gear inlay) |
| M3 / M4 / M4b | GH logo 137 × 128 / `GAUSSE HOLLER` / `CUSTOM LAB · CZ` |
| M5 / M6 | `Revolut 8 · Black Standard Edition` (`Black` is the red word) / `stojan na pruty pro trout area` |
| Products | P1 HERO `p05_revolut8_panel_hero.jpg` (cover) · P2 `p03_revolut8_black_side.jpg` (portrait → M7R) · P3 **RADAR**: `p04_revolut8_black_top.jpg` in a 400 px circular scope with a conic sweep (`conic-gradient(from 0deg, rgba(142,162,216,.35), transparent 60deg)` rotating 360° over 2 beats, ease none). 8 mini-brackets lock onto the 8 tubes one per 16th-note, 0.125 s · P4 `p02_revolut8_black_threeq.jpg`, LOUPE `CARBON` |
| Rows | 1 `KARBONOVÉ TUBUSY` / `8` · 2 `SÉRIE` / `5 ks · číslované` · 3 `VÝROBA` / `ručně v Česku` (footnote `karbon · hliník`) |
| CALL | `gausseholler.com` / `Gausse Holler Custom Lab` |
| Special | **CAD SPEC**: on P1 at b6, dimension lines and a tube outline draw (`strokeDashoffset 1→0`, 21 f `power2.inOut`, stagger 3 f) with the label `8× CARBON`. The GH gear (`gear_ring.png` + `gear_core.png`) sits as a 56 px loader beside M4b, the ring turning 90° per bar. `sfx_radar` + machined click. Music: the darker "black" section |
| VO | „Gausse Holler. Stojan na pruty Black Standard Edition – ručně stavěný v&nbsp;Česku z&nbsp;karbonu a&nbsp;hliníku." (29) |

### 4.13 FINALE (master 68.00–75.00; finale-local t)
| t | Beat | On screen | Moves | Audio |
|---|---|---|---|---|
| 0.00 | b0 | PAD-WIPE opens on: `br11_lake_sunflare` duotone 18 %, MATRIX, M1 (corner), M2 `PARTNEŘI MČR 2026 · 08 / 08` | M01 open | Final section downbeat (bar 35) |
| 0.10 | — | **`DĚKUJEME`** DISPLAY 132 (x 60, y 470) | M06 + after-image | — |
| 0.50 | b1 | **`PARTNERŮM`** DISPLAY 120 (y 600): outline first (`-webkit-text-stroke 2px ice`), fills ice at 0.90 (`color` 9 f). **Logo wall** row 1 (CH 01 + CH 02) | M06; plates wipe 9 f `expo.out`; one shared bracket group locks the row | **VO** 0.50–2.10 „Děkujeme všem partnerům." |
| 1.00 | b2 | Wall row 2 (CH 03 + CH 04) | Bracket group M07 SNAP to the row (7 f, LAND on the beat) | lock ticks |
| 1.50 | b3 | Wall row 3 (CH 05 + CH 06) | same | — |
| 2.00 | b4 | Wall row 4 (CH 07 + CH 08) | same | — |
| 2.40 | — | — | — | **VO** 2.40–3.50 „Uvidíme se u&nbsp;vody!" |
| 2.50 | b5 | One diagonal **GLINT** across the whole wall | M08, 30 f, masked to the plates | `sfx_shimmer` (long) |
| 3.00 | b6 | Brackets release. Hold. | M04 release | — |
| 3.60 | b7 | Gate closes | M02 close, closed by 3.967 | `sfx_gate_close` |
| 4.00 | b8 | Gate opens on the **SIGN-OFF**. The TA plate SNAPs corner → **HERO** (x 60, y 520, scale 2.05) | M02 open; M07 4.00–4.50 | **Final stab** (master 72.00) + `sfx_impact_final` |
| 4.50 | b9 | `MISTROVSTVÍ ČR V TROUT AREA 2026` BODY 34 / 800 (y 892) · `{DATUM} · {MISTO}` BODY 34 sky (y 940) · `troutareacz.cz` URL 44 / 900 with a red dot (y 1004) | M06, stagger 2 f | — |
| 5.00 | b10 | **GH MARK**, live: `MADE BY` + gear (56 px: ring rotating, core static) + `© 2026 GAUSSE HOLLER`, x 60, y 1300–1356, in the GH lockup style (Source Sans 3 600, ice 80 %) | mask-rise 12 f `expo.out`; core `scale .6→1` 12 f `expo.out`; ring `rotation 0→120°` 5.00–7.00 ease none | `sfx_gear` (ratchet) |
| 5.00–7.00 | b10–b13 | Hold on a clean last frame (the TA hero + GH mark). The rail has completed 16/16; the spectrum follows the real reverb tail | — | Tail; music silent by 6.80 |

Wall geometry: plates 400 × 112 at x 60 / 500, y 752 / 884 / 1016 / 1148. Logo artwork ≤ 340 × 80. Each plate carries a MICRO tag `01`…`08` (navy 50 %, decor).

---

## 5. Sound

### 5.1 Music brief
- **Genre:** minimal techno with a fashion-show polish. Precise, dry and confident. Not hard techno, not trance.
- **BPM 120, locked.** This gives 8.000 s blocks, the existing pipeline and the existing Suno brief. Speed comes from 16th-note hats and the rolling bass, not tempo. **Key: A minor.** 4/4.
- **Palette:**
  - tight 4-on-the-floor kick
  - rolling 16th-note bass (sidechained)
  - closed 16th hats, open hat on the off-beats
  - dry clap on 2 and 4
  - a resonant **sequencer arp** (the sonic twin of the step rail)
  - metallic percussion (rimshots, small bells, which tie in with the spoons)
  - a glossy chord **stab on bar 1 of each channel**
- **No vocals or shouts.** The VO needs the space, and English shouts would clash with Czech copy.
- **Bar map** (bar n = [2(n−1), 2n) s):

| Bars | Master s | Section | Notes |
|---|---|---|---|
| 1–2 | 0–4 | Intro | Kick behind an LPF opening 300 Hz → full by 3.5 s; riser; reverse cymbal into 4.0 |
| 3–10 | 4–20 | Drop A / Groove A | Stab at 4.0 and 12.0 |
| 11–18 | 20–36 | Groove A + arp | Arp enters at 20.0 |
| 19–22 | 36–44 | Lift | Bass filtered, metallic perc forward; build (snare roll / riser) in bar 22 |
| 23–30 | 44–60 | Drop B | Full, plus a second stab voice |
| 31–34 | 60–68 | "Black" | Darker, saturated bass, hats thinned, mechanical clicks (GH carbon and aluminium) |
| 35–36 | 68–72 | Final groove | Full energy under "Děkujeme" |
| 37–37½ | 72–75 | Final stab + tail | Stab on 72.00, kick out, reverb / delay tail, silent by 74.8 |

- **Sourcing:** generate in Suno (≥ 2:00), detect beats with librosa (`scripts/analyze_track.py` from hb-battle-2026), and cut by bars in the generator using `offsetBars`. Variant prompt for this direction:
  - **Style:** `minimal techno, 120 bpm, A minor, tight four-on-the-floor kick, rolling 16th-note sidechained bassline, crisp closed hats, open hats on offbeats, dry clap on 2 and 4, resonant analog sequencer arpeggio, metallic percussion, glossy chord stab every 4 bars, clean premium fashion-show mix, instrumental, sparse midrange for spoken voice-over`
  - **Exclude:** `vocals, singing, shouts, vocal chops, whistle, trance supersaw, dubstep, distorted kick, hardstyle, lo-fi, vinyl crackle, guitar, piano ballad, big EDM build-up`
  - **Tags:** `[Intro: filtered kick] [Groove] [Groove with arp] [Break: filtered bass] [Groove with stab] [Dark groove: saturated bass, metallic percussion] [Outro: final stab, reverb tail] [End]`

### 5.2 SFX list
| ID | Sound | Sync (block-local unless noted) | Level |
|---|---|---|---|
| `sfx_gate_open` | Short air release + soft mechanical clack, 0.35 s | 0.00 every channel; finale 4.00 | −14 dB |
| `sfx_gate_close` | Rising fader slide + air whoosh, 0.5 s, peaks at the cut | 7.45 → 8.00; finale 3.45 | −12 dB |
| `sfx_padwave` | 24 soft ticks in an accelerating diagonal + air (reversed for open) | intro 3.50; finale 0.00 | −16 dB |
| `sfx_lock` | Sub thump (60 Hz, 80 ms) + bright click (3 kHz, 10 ms) | logo bite 0.80; product locks at −6 dB | −10 dB |
| `sfx_scan` | Band-passed noise sweep 400 Hz → 6 kHz, 0.5 s | 1.50 | −18 dB |
| `sfx_flap` | Split-flap tick, 3 round-robin variants, one per flip (≤ 4 per frame) | board 1.00, values, CH number | −22 dB each, bus −16 |
| `sfx_shimmer` | Metallic shimmer: bell tree + 6–9 kHz sine pings, 0.6 s (long version 1.0 s) | GLINT on spoons and chrome, b6; finale 2.50 | −18 dB |
| `sfx_blip` | UI data blip, 1.2 kHz sine, 30 ms | data rows b8, b10, b11; swatches | −24 dB |
| `sfx_snap` | Short airy swish, 0.25 s | SNAP 3.50; intro 3.00 | −20 dB |
| `sfx_loupe` | Lens servo whirr up, 0.4 s | 6.50 | −20 dB |
| `sfx_riser` | 4 s filtered riser | intro 0.00–4.00 | −16 dB |
| `sfx_impact_final` | Sub drop + low stab layer | finale 4.00 (master 72.00) | −8 dB |
| `sfx_water` | Light splash / ripple under water feeds (br02, br03, br13) | 0.05 | −24 dB |
| **Specials** | `sfx_sonar` (CH 01 topo lock) · `sfx_counter` (CH 03 odometer clatter) · `sfx_cap` (CH 07 cap click + steam hiss) · `sfx_radar` + machined click (CH 08) · `sfx_gear` (finale ratchet) | per §4 | −18 to −22 dB |

Budget: at most 3 SFX starts per beat, and nothing louder than the VO.

### 5.3 VO timing and mix
- **Voice:** Paul Broadcaster, ElevenLabs v3 via HeyGen, voiceId `02733a92a0db457aadf63b235d2aa457`, `cs`. The tone is presentational and warm, a stadium announcer at a quiet level, not a hype voice.
- **Window per channel:** start at **0.50 s** (b1, with the logo lock). Target end **≤ 6.50 s**, hard limit 7.00 s. The last beat stays VO-free for the gate.
- **Budget:** 2 sentences, **≤ 18 words and ≤ 30 syllables** (≈ 5.5 s at the broadcaster's ≈ 5.5 syllables/s). **Numbers are seen, not spoken**: years and big figures belong on screen (flap counters), because spoken Czech numerals cost 6–11 syllables. Exceptions are allowed only when the number is the story (1934, tisíc tři sta).
- **Intro:** 0.40–3.20. **Finale:** 0.50–2.10 and 2.40–3.50.
- **Files:** `vo/<unit>.wav`, one per unit, silence-trimmed. If audio exceeds the window, rewrite the copy; never time-stretch more than 4 %.
- **Pronunciation** (respell in the TTS input only if the test render misreads):
  - Troutshop [traut-šop]
  - Activefishing [ektiv-fišink]
  - Moonky [múnky]
  - Jigovky [džigovky]
  - Velká ryba (spoken; not "velka-ryba")
  - Bosset [boset]
  - Gausse Holler [gause holer]
  - Zojirushi [zodžiruši]
  - Trout Area [traut érija]
  - Shimano [šimano]
  - Black Standard Edition [blek standard ediš(e)n]
- **Mix:**
  - VO around −16 LUFS short-term.
  - Music ducks −8 dB under the VO (attack 50 ms, release 300 ms, 20 ms lookahead) and returns to full on each b15 so the gate whoosh and stab land.
  - SFX bus −6 dB.
  - Master **−14 LUFS integrated, −1 dBTP** (Reels / TikTok).
  - Banners: 10 ms fade-in at 0, and the close whoosh peaks on the last frame. LOOP-6 audio = exactly 3 bars, cut on zero crossings.

---

## 6. Copy: VO and on-screen templates (Czech)

### 6.1 Template (every channel)
```
M2 kicker   : {KICKER}                       PARTNER MISTROVSTVÍ | MÍSTO KONÁNÍ | PARTNER · CENY
M4 board    : {BOARD}                        ≤ 16 chars, uppercase (usually the URL)
M4b tag     : {TAG}                          ≤ 30 chars, LABEL
M5 headline : {ONELINER}                     ≤ 2 × 22 chars; one optional red word {EM}
M6 sub      : {SUB}                          ≤ 44 chars, BODY
Products    : {P1_LABEL} … {P4_LABEL}        "<MODEL> · <weight/size>", ≤ 26 chars
Row 1–3     : {FAKT1_LABEL}/{FAKT1}, {FAKT2_LABEL}/{FAKT2}, {FAKT3_LABEL}/{FAKT3}
              label ≤ 18 chars · numeric value ≤ 6 chars (72 px) or text ≤ 2 × 16 chars (40 px)
              {FAKTn_POZN} footnote = MICRO (decor; never a required claim)
CALL        : {URL} + {CTA_SUB}               ≤ 36 chars
VO          : „{JMENO}. {VO_VETA1} – {VO_VETA2}."   ≤ 18 words · ≤ 30 syllables · 2 sentences
Global vars : {DATUM}=24.–25. 10. 2026 · {DATUM_KRATKY}=24.–25. 10. · {MISTO}=Líheň Liběchov
              {MISTO_KRATKO}=LIBĚCHOV · {REVIR}=rybník Malý Sporťáček · {WEB_TA}=troutareacz.cz
```

### 6.2 Filled drafts
Facts come from `data/content.json` and `research/*.md` (Verification sections). The values below are defaults; the placeholder names stay in the generator.

| Unit | VO (draft) | Words / syllables | On-screen copy (board · headline · sub · rows · CALL) |
|---|---|---|---|
| INTRO | „Mistrovství republiky v&nbsp;Trout Area 2026." | 6 / ≈ 20 | `MISTROVSTVÍ ČR` · `V TROUT AREA` · `2026` · `40 ZÁVODNÍKŮ · 12 KOL · 2 DNY · HARD BAITS` · `{DATUM} · {MISTO}` |
| CH 01 Líheň Liběchov | „Mistrovství hostí Líheň Liběchov. Pstruží líheň s&nbsp;tradicí od roku 1934." | 11 / 29 | `LÍHEŇ LIBĚCHOV` · Dějiště MČR v Trout Area 2026 · rybník Malý Sporťáček · TERMÍN 24.–25. 10. / TRADICE OD 1934 / PSTRUHAŘSTVÍ 164 m n. m. (*donedávna nejníže položené v Evropě*) · lihenlibechov.cz · Přijďte se podívat · 24.–25. 10. |
| CH 02 Troutshop.eu | „Troutshop. Specialista na lov pstruhů – a&nbsp;generální partner Trout Area Slovakia." | 11 / 26 | `TROUTSHOP.EU` · “THE TROUT FISHING SPECIALIST!” · Milujeme lov pstruhů · V OBORU OD 1999 / SÍDLO Piešťany · SK / GENERÁLNÍ PARTNER Trout Area Slovakia · troutshop.eu · do Česka do pár dní |
| CH 03 Activefishing.cz | „Activefishing. Přes tisíc tři sta plandavek předních japonských značek – i&nbsp;do turnajových podmínek." | 13 / 28 | `ACTIVEFISHING.CZ` · Vybavení pro všechny, kdo milují přívlač · e-shop Stanislava Lukáška · PLANDAVKY 1 300+ / RYCHLOST DORUČENÍ · UNIKÁTNÍ SORTIMENT · OSOBNÍ PŘÍSTUP · activefishing.cz · plandavky · woblery · pruty |
| CH 04 Moonky | „Moonky. Speciální gumové nástrahy pro Trout Area – od návrhu až po vlastní formy." | 13 / 27 | `MOONKY.CZ` · Speciální gumové nástrahy pro Trout Area · vyrobeno v České republice · S REPREZENTACÍ ČR 8 let / VÝROBA návrh → CNC forma / MATERIÁL guma bez ftalátů · moonky.cz · nástrahy, které pstruzi milují |
| CH 05 Jigovky.cz | „Jigovky. Jigy, které chytají – poctivě vyrobené v&nbsp;Česku, i&nbsp;bez protihrotu." | 11 / 25 | `JIGOVKY.CZ` · Jigy, které chytají! · poctivě vyrobeno v ČR · TROUTJIG BARBLESS 0,4–3 g / VÝROBA poctivě v ČR / VÝBĚR největší výběr jigových hlaviček · jigovky.cz · jigy · rotačky · háčky |
| CH 06 Velka-ryba.cz | „Velká ryba. Přívlačová speciálka z&nbsp;Olomouce – a&nbsp;partner Shimano Rod Test Center." | 12 / 26 | `VELKA-RYBA.CZ` · Vše na přívlač · e-shop i kamenná prodejna v Olomouci · OD ROKU 2011 / PRODEJNA Olomouc + e-shop / PARTNER Shimano Rod Test Center · velka-ryba.cz · plandavky pro pstruhy a Trout Areu |
| CH 07 Bosset.cz | „Bosset věnuje do cen termosky Zojirushi. Horké i&nbsp;studené až šest hodin." | 12 / 24 | `BOSSET.CZ` · Termosky do cen · Zojirushi · {OBJEM} · OBJEM {OBJEM} / HORKÉ I STUDENÉ až 6 h / DISTRIBUTOR Keitech · YGK X-Braid · bosset.cz · expedujeme do 24 h |
| CH 08 Gausse Holler | „Gausse Holler. Stojan na pruty Black Standard Edition – ručně stavěný v&nbsp;Česku z&nbsp;karbonu a&nbsp;hliníku." | 16 / 29 | `GAUSSE HOLLER` · Revolut 8 · Black Standard Edition · stojan na pruty pro trout area · KARBONOVÉ TUBUSY 8 / SÉRIE 5 ks · číslované / VÝROBA ručně v Česku · gausseholler.com · Gausse Holler Custom Lab |
| FINALE | „Děkujeme všem partnerům. Uvidíme se u&nbsp;vody!" | 7 / 16 | `DĚKUJEME` · `PARTNERŮM` · wall 01–08 · TA hero · MISTROVSTVÍ ČR V TROUT AREA 2026 · {DATUM} · {MISTO} · troutareacz.cz · MADE BY ⚙ © 2026 GAUSSE HOLLER |

### 6.3 Copy guardrails
- **The MČR format is hard baits** (troutareacz.cz). Moonky (soft plastics) and the Jigovky jigs must **not** be presented as baits used at this championship. The copy above only describes the partner, which keeps it safe.
- **Venue altitude:** keep „donedávna" with „nejníže položené pstruhařství v Evropě" (research verification). Our own measurement puts Malý Sporťáček's water level at ≈ 167.2 m Bpv, while the site claims 164 m n. m. for the hatchery. Show only the site's figure, attributed to the hatchery, and never both numbers.
- **Sponsor claims** („největší výběr", „specialista") are shown as the partner's own words, either in quotes or with a `dle <web>` footnote.
- Thermos volume `{OBJEM}`: the brief says 0,5–0,7 l, but the asset filenames show 0,52 l and 0,6 l. Confirm before final.

---

## 7. Implementation notes (HyperFrames / GSAP)

### 7.1 Structure: one sub-composition per unit
```
proto/telemetry/
  index.html                      master host (75.0 s): sequences units + audio, nothing else
  compositions/
    intro.html  ch-venue.html  ch-troutshop.html  ch-activefishing.html  ch-moonky.html
    ch-jigovky.html  ch-velkaryba.html  ch-bosset.html  ch-gausseholler.html  finale.html
  assets/  (gsap.min.js, fonts/, brand/, products/, masks/, broll/, audio/, vo/)
proto/telemetry_banners/<slug>/index.html            BANNER-8 (standalone root, own assets/)
proto/telemetry_banners/<slug>_10/index.html         BANNER-10
proto/telemetry_banners/<slug>_loop/index.html       LOOP-6
```
- **Everything a channel needs lives inside the channel**: TA plate, header, matrix, rig, gate, grain, and the in/out halves of the transitions. The master host only places units on the timeline. That makes every banner the *same markup* as its master block.
- One generator function, `channel(unit, ctx) → {css, html, js}`, has two emitters:
  - **Template-wrapped** for `compositions/*.html`: style and script *inside* `<template>`, root styled by `#root`.
  - **Standalone** for banners: root directly in `<body>`, no template, plus its own `<audio>`.
- Ids match exactly: host `data-composition-id` = inner root id = `window.__timelines` key (e.g. `ch-troutshop`).
- Shared CSS and JS (`shared/telemetry.css`, `shared/telemetry.js`) are **inlined** into each composition at build time. No runtime fetch, no external `<script src>` inside templates. GSAP is loaded once by the host head (or the standalone banner's head).
- Asset URLs are relative to the output root (sub-composition markup is cloned into the host document). Banners get their own copied `assets/`.

### 7.2 Channel composition skeleton (template-wrapped)
```html
<!doctype html><html><head><meta charset="UTF-8"></head><body>
<template>
<style>
  /* inlined: @font-face (assets/fonts/…), telemetry.css, then channel overrides */
  #root { position:absolute; inset:0; overflow:hidden; background:#0b1e42; font-family:Montserrat, sans-serif; color:#eef2f9; }
</style>
<div id="root" data-composition-id="ch-troutshop" data-width="1080" data-height="1920">
  <div class="bg"></div>
  <div class="feed"><img src="assets/broll/br02_netting_sunrays.jpg" alt=""></div>
  <div class="feed-dim"><img src="assets/broll/br02_netting_sunrays.jpg" alt="" style="filter:url(#duo)"></div>
  <div class="mx"><!-- 9 .mx-v, 17 .mx-h, crosses, 16 .mx-row --></div>
  <div class="lure-field"><!-- 18 <svg><use href="#g-spoon"/></svg> … --></div>
  <section class="stage"><!-- M7: .card, .prod#p1…#p4 (img + .glint), .lk brackets, .rows, .loupe --></section>
  <section class="type"><!-- M3 .plate, M4 .board > .sf*, M4b, M5 .hl > .ln > span(+em.echo), M6 --></section>
  <section class="rig"><div class="spec"><!-- 28 × <i></i><b></b> --></div><div class="rail"><!-- 16 <i> --></div><div class="ticker"></div></section>
  <div class="scan"></div><div class="vig"></div>
  <div class="gate"><!-- 10 <i> with caps --></div>
  <header class="hdr"><div class="ta-plate"><img src="assets/brand/ta_logo_h.png" alt="Trout Area Czech Republic"></div><div class="m2"><!-- CH flap, kicker, lines --></div></header>
  <div class="grain"></div>
  <!-- inline <svg> defs: #duo filter, lure symbols -->
</div>
<script>
(() => {
  const ID = "ch-troutshop", root = document.querySelector(`[data-composition-id="${ID}"]`);
  const B = /*baked*/[0,0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5];   // block-local beats from track grid
  const BANDS = /*baked or null*/ null;                                      // 240 frames × 28
  const tl = gsap.timeline({ paused: true });
  /* inlined telemetry.js → TM */
  TM.rig(tl, root, { dur: 8, beats: B, bands: BANDS });
  TM.gateOpen(tl, root, 0);
  TM.flap(tl, root.querySelector(".m2 .ch"), "03", 1/30, { seed: 3 });
  TM.lockOn(tl, root, "#lk-logo", B[1]);
  TM.flap(tl, root.querySelector(".board"), "TROUTSHOP.EU", B[2], { seed: 2 });
  TM.scan(tl, root, B[4]);                          // LAND on b4
  TM.slabIn(tl, root, ".hl", B[4]);
  TM.lockOn(tl, root, "#lk-p1", B[5]); TM.glint(tl, root, "#p1", B[6], { double: true });
  TM.snap(tl, root, B[8]);                          // LAND on b8
  /* rows b8/b10/b11, products b8/b10/b12, CALL b12, loupe b13 … */
  TM.gateClose(tl, root, 8);
  window.__timelines[ID] = tl;                     // register last
})();
</script>
</template></body></html>
```

### 7.3 Master host
```html
<!doctype html><html lang="cs"><head><meta charset="UTF-8"><script src="assets/gsap.min.js"></script>
<style> html,body{margin:0;background:#0b1e42} #root{position:relative;width:1080px;height:1920px;overflow:hidden;background:#0b1e42} </style></head>
<body><div id="root" data-composition-id="main" data-start="0" data-duration="75" data-width="1080" data-height="1920">
  <div id="intro" data-composition-id="intro" data-composition-src="compositions/intro.html" data-start="0" data-duration="4" data-track-index="1" data-width="1080" data-height="1920"></div>
  <div id="ch-venue" data-composition-id="ch-venue" data-composition-src="compositions/ch-venue.html" data-start="4" data-duration="8" data-track-index="1" data-width="1080" data-height="1920"></div>
  <!-- … ch-troutshop 12, ch-activefishing 20, ch-moonky 28, ch-jigovky 36, ch-velkaryba 44, ch-bosset 52, ch-gausseholler 60 … -->
  <div id="finale" data-composition-id="finale" data-composition-src="compositions/finale.html" data-start="68" data-duration="7" data-track-index="1" data-width="1080" data-height="1920"></div>
  <audio id="music" src="assets/audio/track.wav" data-start="0" data-duration="75" data-media-start="{TRACK_OFFSET}" data-track-index="10" data-volume="1"></audio>
  <audio id="sfx" src="assets/audio/sfx_master.wav" data-start="0" data-duration="75" data-track-index="11" data-volume="1"></audio>
  <audio id="vo-intro" src="assets/vo/intro.wav" data-start="0.40" data-duration="2.80" data-track-index="12"></audio>
  <!-- one <audio> per unit's VO at block start + 0.50 (tracks 12/13 alternating) -->
</div>
<script> window.__timelines["main"] = gsap.timeline({ paused: true }); </script>
</body></html>
```
- **SFX are pre-rendered** by the generator into one `sfx_master.wav` (and one `sfx_<slug>.wav` per banner). The cue list is the same event list the timeline uses, rendered with Python / sox at the frame-quantized times. That is one track instead of about 300 `<audio>` clips, and it is sample-exact. Ducking and gain go through the `hyperframes-audio` skill.
- Sub-composition timelines are auto-nested by the runtime. Never add them to `main` by hand.

### 7.4 `telemetry.js` core (seek-safe drivers; inlined)
```js
const TM = (() => {
  const FPS = 30, q = (t) => Math.round(t * FPS) / FPS;
  const rnd = (s) => { const x = Math.sin(s * 9301 + 49297) * 233280; return x - Math.floor(x); };
  const CHARSET = " ABCDEFGHIJKLMNOPQRSTUVWXYZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ0123456789.,-–·/+";
  const cols = (root) => [...root.querySelectorAll(".gate > i")];
  const off = (i) => Math.floor(Math.abs(i - 4.5)) / FPS;                    // 0–4 frames, centre first

  function gateOpen(tl, root, t0) { cols(root).forEach((c, i) =>
    tl.fromTo(c, { yPercent: 0 }, { yPercent: -100, duration: 11 / FPS, ease: "power3.out" }, q(t0) + off(i))); }
  function gateClose(tl, root, tCut) { cols(root).forEach((c, i) =>
    tl.fromTo(c, { yPercent: 100 }, { yPercent: 0, duration: 10 / FPS, ease: "power3.in", immediateRender: false }, q(tCut) - 15 / FPS + off(i))); }

  function flap(tl, row, text, t, { period = 2 / FPS, stagger = 1 / FPS, seed = 1 } = {}) {
    const cells = [...row.querySelectorAll(".sf b")];                        // one <b> per char, initial " "
    const plan = [...text].map((ch, i) => {
      const n = ch === " " ? 0 : 3 + ((i + seed) % 3);
      const seq = Array.from({ length: n }, (_, j) => CHARSET[Math.floor(rnd(seed * 97 + i * 13 + j) * CHARSET.length)]);
      return { el: cells[i], s: i * stagger, n, seq: [...seq, ch] };
    });
    const dur = (text.length - 1) * stagger + 6 * period, p = { e: 0 };
    tl.fromTo(p, { e: 0 }, { e: dur, duration: dur, ease: "none", immediateRender: false, onUpdate() {
      for (const c of plan) {
        const k = p.e <= c.s ? -1 : Math.floor((p.e - c.s) / period);
        const g = k < 0 ? " " : c.seq[Math.min(k, c.n)];
        if (c.el.textContent !== g) c.el.textContent = g;
        c.el.parentNode.style.setProperty("--f", k >= 0 && k < c.n ? (((p.e - c.s) % period) / period).toFixed(2) : "0");
      }
    } }, q(t));
  }

  function scan(tl, root, tLand) {
    const line = root.querySelector(".scan"), feed = root.querySelector(".feed"), S = { y: 0 }, t0 = q(tLand) - 15 / FPS;
    tl.set(line, { opacity: 1 }, t0);
    tl.fromTo(S, { y: 0 }, { y: 1920, duration: 15 / FPS, ease: "power2.inOut", immediateRender: false, onUpdate() {
      line.style.transform = `translateY(${S.y.toFixed(1)}px)`; feed.style.clipPath = `inset(${S.y.toFixed(1)}px 0px 0px 0px)`; } }, t0);
    tl.set(line, { opacity: 0 }, q(tLand));
  }

  function lockOn(tl, root, sel, t) {
    const k = root.querySelectorAll(`${sel} .lk i`), D = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    k.forEach((el, i) => {
      const [sx, sy] = D[i];
      tl.fromTo(el, { x: sx * 80, y: sy * 80, opacity: 0 }, { x: sx * 8, y: sy * 8, opacity: 1, duration: 9 / FPS, ease: "expo.out" }, q(t));
      tl.fromTo(el, { x: sx * 8, y: sy * 8 }, { x: 0, y: 0, duration: 5 / FPS, ease: "back.out(2.2)", immediateRender: false }, q(t) + 9 / FPS);
    });
    tl.fromTo(k, { borderColor: "#e31e24" }, { borderColor: "#eef2f9", duration: 12 / FPS, ease: "power2.out", immediateRender: false }, q(t) + 9 / FPS);
    tl.fromTo(root.querySelector(`${sel} .tgt`), { clipPath: "inset(100% 0% 0% 0%)", y: 40 }, { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 11 / FPS, ease: "expo.out" }, q(t) + 2 / FPS);
  }

  const slabIn = (tl, root, sel, t) => tl.fromTo(root.querySelectorAll(`${sel} .ln > span`), { yPercent: 112 }, { yPercent: 0, duration: 17 / FPS, ease: "power4.out", stagger: 2 / FPS }, q(t));
  const slabOut = (tl, root, sel, tLand) => tl.fromTo(root.querySelectorAll(`${sel} .ln > span`), { yPercent: 0 }, { yPercent: -112, duration: 7 / FPS, ease: "power3.in", stagger: 1 / FPS, immediateRender: false }, q(tLand) - 8 / FPS);
  const glint = (tl, root, sel, t, o = {}) => {
    const bands = root.querySelectorAll(`${sel} .glint > i`);
    tl.fromTo(bands[0], { xPercent: -160 }, { xPercent: 260, duration: (o.frames || 21) / FPS, ease: "power2.inOut", immediateRender: false }, q(t));
    if (o.double && bands[1]) tl.fromTo(bands[1], { xPercent: -160 }, { xPercent: 260, duration: 21 / FPS, ease: "power2.inOut", immediateRender: false }, q(t) + 15 / FPS);
  };
  const loupe = (tl, root, sel, t) => {
    tl.fromTo(root.querySelector(`${sel} .loupe`), { clipPath: "circle(0px at 50% 50%)" }, { clipPath: "circle(160px at 50% 50%)", duration: 12 / FPS, ease: "expo.out" }, q(t));
    tl.fromTo(root.querySelector(`${sel} .loupe .ring`), { rotation: 0 }, { rotation: 45, duration: 1, ease: "none" }, q(t));
  };
  const snap = (tl, root, tLand) => {
    const t0 = q(tLand) - 15 / FPS;
    tl.fromTo(root.querySelector(".card"), { clipPath: "inset(0px 0px 0px 0px round 22px)" }, { clipPath: "inset(0px 0px 0px 440px round 22px)", duration: 15 / FPS, ease: "power3.inOut", immediateRender: false }, t0);
    tl.fromTo(root.querySelector(".hero-wrap"), { x: 0, scale: 1 }, { x: 220, scale: 0.62, duration: 15 / FPS, ease: "power3.inOut", immediateRender: false }, t0);
  };

  function rig(tl, root, { dur, beats, bands }) {
    const pads = [...root.querySelectorAll(".rail i")], bars = [...root.querySelectorAll(".spec i")], caps = [...root.querySelectorAll(".spec b")];
    const rows = [...root.querySelectorAll(".mx-row")], grain = root.querySelector(".grain");
    const lvl = (j, t) => {
      if (t < 0) return 0;
      if (bands) return bands[Math.min(bands.length - 1, Math.round(t * FPS))][j];
      let v = 0.08; for (const b of beats) { const d = t - b; if (d >= 0 && d < 1) v += (0.45 + 0.5 * rnd(j * 31 + b * 2)) * Math.exp(-d / 0.16) * (j < 8 ? 1 : 0.6); }
      return Math.min(1, v);
    };
    const R = { t: 0 };
    tl.fromTo(R, { t: 0 }, { t: dur, duration: dur, ease: "none", onUpdate() {
      const t = R.t; let k = -1; beats.forEach((b, i) => { if (b <= t + 1e-4) k = i; });
      pads.forEach((p, j) => { p.className = j < k ? "past" : j === k ? "hit" : ""; });
      if (k >= 0 && pads[k]) pads[k].style.setProperty("--hit", Math.exp(-(t - beats[k]) / 0.12).toFixed(3));
      bars.forEach((el, j) => {
        const h = lvl(j, t); let pk = h;
        for (let s = 1; s <= 18; s++) pk = Math.max(pk, lvl(j, t - s / FPS) - 1.6 * s / FPS);
        el.style.transform = `scaleY(${h.toFixed(3)})`; caps[j].style.transform = `translateY(${(-pk * 44).toFixed(1)}px)`;
      });
      rows.forEach((r, i) => { const b = beats[i]; r.style.opacity = b !== undefined && t >= b ? ((i % 4 ? 0.10 : 0.16) * Math.exp(-(t - b) / 0.18)).toFixed(3) : "0"; });
      const g = Math.floor(t * 12) % 8; grain.style.backgroundPosition = `${(rnd(g) * 256) | 0}px ${(rnd(g + 9) * 256) | 0}px`;
      /* ticker x, lure-field flutter/wobble/bob: same pattern, pure functions of t */
    } }, 0);
  }
  return { q, rnd, gateOpen, gateClose, flap, scan, lockOn, slabIn, slabOut, glint, loupe, snap, rig };
})();
```
Notes:
- Every driver is `ease: "none"` with an `onUpdate` that reads only its proxy value. This is the documented seek-safe pattern (as in `counting-dynamic-scale` and `chart-scrub-readout`).
- No `Math.random`, `Date.now` or `performance.now`. Repeats are finite.
- No DOM measurement: all geometry comes from module constants and `products.json` bboxes.
- `.feed` starts with `clip-path: inset(0px 0px 0px 0px)` in CSS, so its pre-scan state is correct without a tween.

### 7.5 Beat grid and audio bands
- `audio/track.beats.json` comes from librosa (`analyze_track.py`) or `npx hyperframes beats`. The generator takes a block start as the nearest downbeat to `4 + 8n` (+ `offsetBars`), and bakes the block-local beats (16 values) into each composition.
- `audio/track.bands.json` is a new precompute: `librosa.stft` → 28 log-spaced bands (40 Hz–12 kHz) → dB → normalised 0…1 per band over the track → resampled to 30 fps. The generator slices 240 frames per channel (180 for LOOP-6, where the last 6 frames are crossfaded to the first 6 so the meter loops).
- Without a track: synthetic 120 BPM grid, `BANDS = null` (seeded decay).

### 7.6 Generator conventions
New file `scripts/build_telemetry.mjs`, reusing `data/content.json` (plus the new fields below), `data/tokens.json` with `design/tokens.json` (§2.8), and `data/products.json`.
```
node scripts/build_telemetry.mjs                         → proto/telemetry/ (master + compositions)
BLOCK=troutshop node scripts/build_telemetry.mjs         → BANNER-8
BLOCK=troutshop LEN=10 node scripts/build_telemetry.mjs  → BANNER-10
BLOCK=troutshop LOOP=1 node scripts/build_telemetry.mjs  → LOOP-6
BLOCK=all [LEN=10|LOOP=1] VO=0|1 ORDER=venue,troutshop,… CUT=60 FINAL=1
```
New `content.json` fields per channel:
```json
"troutshop": { "set": "float+lightbox", "feed": "assets_prep/broll/br02_netting_sunrays.jpg",
  "kicker": "PARTNER MISTROVSTVÍ", "board": "TROUTSHOP.EU", "tag": "E-SHOP · PIEŠŤANY · SK",
  "headline": "“THE TROUT FISHING SPECIALIST!”", "em": "SPECIALIST", "sub": "Milujeme lov pstruhů",
  "rows": [ { "l": "V OBORU OD", "v": "1999", "num": true, "foot": "rodinná firma" },
            { "l": "SÍDLO", "v": "Piešťany · SK" }, { "l": "GENERÁLNÍ PARTNER", "v": "Trout Area Slovakia" } ],
  "products": [ { "src": "assets/troutshop/p01_velvet-arts-forte-2-1g-32-glow-pink.png", "label": "VELVET ARTS FORTE · 2,1 g", "glyph": "spoon", "glint": "double" }, "…" ],
  "loupe": { "product": 3, "x": 0.30, "y": 0.62, "tag": "LIP" },
  "url": "troutshop.eu", "cta": "do Česka do pár dní", "special": "quote",
  "vo": ["Troutshop.", "Specialista na lov pstruhů – a generální partner Trout Area Slovakia."] }
```

### 7.7 QC gates (automated in the generator, then manual)
1. `npx hyperframes check` passes with zero errors, in master and in every banner folder.
2. **Build assertions:**
   - M1 is present and top z-order in every composition.
   - Logo `w ≤ 400`, `h ≤ 128`, area ≤ 47 900.
   - Every informative box lies inside the safe box, and x ≤ 900 when y ≥ 900.
   - Character and line limits from §2.2 hold.
   - Each text hold is ≥ 1.5 s.
   - VO wav ≤ window (ffprobe) and VO syllables ≤ 30 (vowel-group counter).
   - Every event anchor is a multiple of 1/30 s.
   - `grep -E "Math.random|Date.now|performance.now"` on the output finds nothing.
   - Image magnification ≤ 1.0 (or ≤ 1.15 when flagged).
3. **Snapshots:** `npx hyperframes snapshot --at` block start + `0.20, 1.20, 2.80, 4.80, 6.60, 7.98`, for every unit. Check for unstyled text (a sub-composition mount defect), clipped carons, cover-state identity at the boundaries, and LOOP-6 frame 0 vs frame 180 (pixel diff < 1 %).
4. **Reels/TikTok overlay check:** composite each snapshot with `qc/reels_ui_overlay.png` and `qc/tiktok_ui_overlay.png`. No information may sit under the UI.
5. **Muted test:** watch each BANNER-8 muted on a phone. In 8 s a viewer must get the name, what the partner does, one fact, and the URL.

### 7.8 Render and export
```
cd proto/telemetry && npx hyperframes render --quality looks --output ../../renders/mcr26_telemetrie_master_draft.mp4
cd proto/telemetry && npx hyperframes render --quality delivery --output ../../renders/mcr26_telemetrie_master_9x16.mp4
for d in proto/telemetry_banners/*/; do (cd "$d" && npx hyperframes render --quality delivery --output "../../../renders/banners/$(basename "$d").mp4"); done
```
Deliverables:
- Master MP4 (H.264, 1080 × 1920, 30 fps, −14 LUFS).
- Per channel: BANNER-8 (with and without VO), BANNER-10, and LOOP-6 (no VO), plus a poster PNG at 6.60 s.
- CUT-60 on request.

Performance:
- The pad-wipe (160 cells × 2 tweens) is the heaviest moment and is fine.
- Never animate `filter: drop-shadow`. Shadows are static.
- `mix-blend-mode` is limited to the LIGHTBOX images, glints and grain.
- Video feeds (flyover, GH reel) are framework-owned `<video muted>` inside the sub-composition, with timing on the video element only.

---

## 8. Open items and risks
- **Order of partners:** TBD by the user. The cover-state contract makes reordering free; GH last is recommended.
- **Montserrat 700** is not in `proto/assets/fonts`. Add it (fontsource), or labels render at 800.
- **Music:** no track yet (`placeholder_silence.wav`). The SPECTRUM is synthetic until `track.wav` and `track.bands.json` exist. Bar-accurate cutting depends on a clean Suno render at 120 BPM.
- **Drone flyover** (`drone/final/flyover_9x16.mp4`) is not delivered yet. CH 01 falls back to the photo feed plus the TOPO card from `drone/data` (DSM render + measured coordinates).
- **The user's fishing videos** are still to come. The FEED slot accepts video (`<video muted>`), with the same duotone and scanline treatment.
- **Activefishing white-background shots** (`p06`, `p07`, `p09`) need the border flood-fill masks to sit in the FLOAT set. Otherwise switch that channel to LIGHTBOX.
- **Low-resolution packshots** (Troutshop `p05` 600 px, `p08` 720 px, `p09` 800 px) are restricted to the 400 px column or the strip, and never the LOUPE.
- **Copy facts to confirm with partners:**
  - Bosset `{OBJEM}` and prize allocation `{CENY_POPIS}`.
  - The Activefishing "1 300+" count (a moving stock number; 1 340 on 19. 10. 2026).
  - GH series size ("5 ks, číslované").
  - Moonky's packaging claim „nástrahy, které pstruzi milují" (visible only on the user's photo, not on the web).
- **Hard-baits format vs. soft-bait and jig partners:** the copy must not imply these baits are used at MČR (§6.3).
- **Venue altitude:** the site's 164 m n. m. differs from our measured ≈ 167.2 m water level. Show only the attributed site claim, with „donedávna".
- **"Fandovy plandavky"** (via Luboš): sponsor yes or no? A 9th channel would push the master to 83 s. In that case, use CUT-60 timings for all channels (4 + 9 × 6 + 7 = 65 s).
- **Split-flap legibility at 30 fps:** the 2-frame period is the minimum. If the review finds it busy, raise it to 3 f (the board then lands ≈ 1.3 beats after launch; keep the LAUNCH on b2).
- **Banner first frame** is the cover state (navy + TA plate). Platforms that auto-pick a thumbnail must be given the poster PNG.
