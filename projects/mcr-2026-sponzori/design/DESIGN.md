> **⚠ ČÁSTEČNĚ NAHRAZENO (19. 10.):** uživatel odmítl „náš TA styl“ — platí BRIEF.md › „ZMĚNA SMĚRU“: moderní reklama produktů, každý sponzor ve svém vlastním vizuálním světě (barvy/typo jeho značky), z TA zůstává jen logo. Z tohoto dokumentu převzít jen **choreografii produktů podle materiálu** (vějíř plandavek, mřížka barev gumových nástrah, otočka plandavky ve světle, pódium pro termosky, spec-sheet stojanu GH), strobe/světelné přejezdy, číslování „Look 01–08“, pravidla loopů a banner exportů. Ignorovat: navy paletu, Montserrat-only, runway světla v TA barvách.

# DESIGN.md: „KOLEKCE PARTNERŮ MČR 26" (final direction)

**Status:** final art direction, 19. 10. 2026. It supersedes `direction_runway.md`, `direction_luxury.md` and `direction_techno.md`. Those three are now reference only.
**Companion files:** `STORYBOARD.md` (timecodes, every Look, banner cuts) · `VO_TEMPLATE.md` (Czech VO).
**Inputs:** `BRIEF.md`, `data/content.json`, `vo/script_cs.md`, `research/*.md` (Verification sections), `assets_prep/*`, `scripts/build.mjs` (v1 generator).

> **Кратко (RU):** Основа — RUNWAY: чемпионат как показ мод, каждый партнёр — «Look» на 8 с с огромным словом-названием, студийным светом, вспышками папарацци и бликом по металлу. Стиль строго наш: только Montserrat, наша палитра, один красный акцент, плашка TA видна в каждом кадре. Из LUXURY взяты жалюзи с кадрами нашей рыбалки на ламелях, rack focus без живого blur, поворот блесны на свет и сдержанность. Из TECHNO взяты единый контракт блока (мастер = баннер), рамки LOCK-ON, SCAN, драйверы как чистые функции t, правило логотипов, LOOP-6 и QC. Убраны: вторая лента, правый рейл, частые белые вспышки, красный фон Bosset, мелкий текст.

---

## 0. Decision record

### 0.1 Scores and spine
| Direction | Judge 1 | Judge 2 | Judge 3 | **Total** | brand_fit avg |
|---|---|---|---|---|---|
| **RUNWAY** | 41.0 | 41.5 | 42.0 | **124.5** | 8.83 |
| TECHNO | 40.5 | 42.5 | 41.0 | 123.5 | 8.83 |
| LUXURY | 35.0 | 35.5 | 34.0 | 104.5 | 6.0 |

**Spine = RUNWAY.** It has the highest total, all three judges picked it, and it is the only direction that is both clearly fashion and clearly TA CZ.
TECHNO came within one point. It supplies the engineering: the block contract, the drivers, the rules and QC. LUXURY supplies the light craft and the restraint.

### 0.2 Graft ledger (what came from where)
| Idea | From | Used in |
|---|---|---|
| Show running order: LOOK NN / 08, MEGA name, paparazzi strobe, chrome glint, spoon flip, catwalk, colourway grid, lens + swatches, podium, spec sheet, spoon iris, gear iris, tricolour tab, runway lights | RUNWAY | Whole film |
| **Louvre** with navy-duotone fishing photos on the slat faces (replaces the white b-roll flash frames) | LUXURY + RUNWAY shutter | Every block in/out (M1) |
| Rack focus by crossfading pre-blurred `_b18` images (no live image blur) | LUXURY | All product arrivals (M7) |
| Turntable coupled to the specular sweep | LUXURY | Hanging spoons, spoon flip (M6) |
| Masthead-lane mask · TA plate sheen · hallmark stamp · `W(t)` time-warp · caustics | LUXURY | §2.3, M12, M11, §4, §2.5 |
| **Cover-state contract** · TA plate inside every block · one code path for master and banner | TECHNO | §4.1 |
| LOCK-ON bite (red only at the moment of lock) · SCAN · LAUNCH/LAND · `q(t)` · pure-function drivers | TECHNO | M4, M3, §3.1, §6.3 |
| Logo-area rule · LIGHTBOX · flood-fill masks · magnification rule · LOOP-6 · Reels/TikTok overlay QC · muted phone test · copy guardrails · THERMO DIAL · RADAR | TECHNO | §2.6, §2.8, §4, §6.6, VO_TEMPLATE |

### 0.3 Weaknesses resolved
| Weakness (judges) | Resolution |
|---|---|
| Too many layers (2 tapes, right rail, monogram, thread, lights, grain, card, MEGA, strobes) | Layer budget (§1.3): **one** quiet hem tape, **no** right rail, monogram only on navy sets, one ambient texture per set |
| Off-White caution tape is a dated trope | The tape is now a straight, low-contrast **jacquard hem** in the bleed band. No rotation, no skew kicks, no red tape |
| Flash pile-up at boundaries; 0.85 flashes | No flash at any block boundary (the louvre replaces it). Full-frame flash ≤ 0.35 (stab 0.40). ≤ 2 strobes per block. ≤ 3 flashes in any 1 s, asserted at build |
| B-roll used only as 3-frame flashes | B-roll on every louvre (≈ 1 s visible per boundary), a 2 s b-roll backstage open in the intro, a full-colour venue photo with SCAN, and user videos via the FEED slot |
| Faux-condensed `scaleY(1.18)` | Stretch ≤ **1.10**, MEGA only |
| MEGA words not sponsor-owned (JIGY, CENY, BLACK) | **MEGA is always the partner's own name.** Category words move to the LOOK card label |
| RED SET for Bosset outshines the others | Paper set with **one red podium face** (winner's step). Red ≤ 15 % of the frame |
| TA plate too small; sponsor plate could outweigh it | TA plate **384 × 136**. The sponsor plate has the same box and is never larger. Sponsor logo artwork ≤ TA logo artwork (w ≤ 344 px, area ≤ 38 700 px²), asserted at build |
| Host/block split of TA ownership; two transition paths | TA plate and transitions live **inside every block**. The master host only sequences. Irises are in/out variants of the same block file |
| Bosset doc out of date | Real packshots (`assets_prep/bosset/heroes`) and verified facts (až 6 h, Zojirushi 0,6 l, `{OBJEM}`) |
| 8 bespoke choreographies = heavy build | They are 8 `hero.type` presets on one shared move library (M1–M12). Each preset is data plus 20–40 emitted tweens |
| Lens at 2.2× upscales low-res crops | Magnification ≤ 1.0 (≤ 1.15 with unsharp), asserted. Jig lens uses the prepped head-detail crops at 1:1 |
| Thread anchors drift on rotating products (LUXURY) | Hanging products rotate about their **eye anchor**, which is the thread end, so the anchor cannot drift |
| English copy in a Czech film | All info copy is Czech. English survives only as fashion terms (LOOK) and partners' own marks (HANDMADE LURES, MADE BY) |
| Split-flap 2-frame flicker | Flap period **3 frames** |
| GH mark in Source Sans 3 | "MADE BY" and "© 2026" are set in Montserrat 600. The GH word-line is GH's own logo artwork, not typesetting |
| Intro stats unverified | Verified on troutareacz.cz (`research/mcr_tournament.md`): 40 závodníků, 12 kol, 2 dny, hard baits. They are used only on the hem tape |

---

## 1. Concept

### 1.1 The idea
**The championship is the show. Each partner is a Look.**
The film is staged as a fashion show running order:
1. Backstage open (real trout-area photos).
2. Title card.
3. LOOK 01 / 08 … LOOK 08 / 08.
4. Finale walk: all labels on one wall.
5. The house signs (TA hero), then the maker signs (MADE BY ⚙ Gausse Holler).

Products are shot like couture accessories: a lure on a paper sweep under a strobe, a spoon turning into the light, a thermos on a podium, a rod stand on a spec sheet. Each Look opens through **Venetian blinds whose slats carry a slice of our own fishing photos**, so the community's water is literally the door to every Look.

Mood words: **couture-clean · strobe-lit · cold navy night · one red thread · precise.**

### 1.2 House rules (non-negotiable)
1. **The TA plate is visible in every frame** of the master, every banner and every loop. It sits at a fixed position and is the top layer. Nothing covers it: no louvre, iris, flash or sponsor (BRIEF).
2. **Montserrat only** (600 / 700 / 800 / 900, plus 900 italic for the hem tape).
3. **House palette only.** Sponsor colours live only inside their logos and product photos.
4. **Red is the one accent** (§2.1).
5. **No sponsor logo is wider, or larger in area, than the TA logo** (§2.8).
6. **Every banner reads muted**: name, what they do, one fact and the URL within 8 s.
7. **Deterministic:** no `Math.random`, `Date`, `performance.now` or CSS `@keyframes`. Seeded values are baked at build.

### 1.3 Restraint rules (what makes it fashion and not a HUD)
- **One big move per bar.** Bar 1 = identity. Bar 2 = the product's signature move. Bar 3 = facts. Bar 4 = hero lock and poster. Copy entrances follow the fixed copy schedule and do not count as big moves.
- **≤ 4 informative text blocks at once:** sponsor plate + URL, one-liner, fact A, fact B. MEGA, the LOOK card, product tags and the hem tape are display or decoration.
- **Poster frame (t = 7.00):** at least 40 % of the frame shows only the set (no text, product or plate). Checked visually in QC.
- **Layer budget per frame.** Allowed at once:
  - one set
  - one ambient texture (monogram **or** caustics **or** none)
  - grain and vignette
  - MEGA, stage, copy, header
  - one bleed device group (runway lights + hem tape)
  - the louvre
  
  Never used: a second tape, a right rail, rays, light leaks, RGB split, glitch, VHS or lens flares.
- **Overshoot only where it means something:**
  - `back.out(2.2)` for the LOCK-ON bite
  - `back.out(3)` for the hallmark tab stamp
  - `elastic.out(1,.45)` for Moonky rubber
  - the intro TA undock settle (1.04 → 1)
  
  Nothing else overshoots.
- **Beat pump on MEGA only** (1.03, the house DNA). The stage, products and copy never pump.

### 1.4 Heritage map (why it is still a TA CZ film)
| Previous films (`klonowiec-2026/scripts/build.mjs`) | This film |
|---|---|
| Flash on the downbeat (0.08 / 0.22) and stage punch 1.035 | Choreographed paparazzi strobe (local halation, full-frame ≤ 0.35). MEGA pump 1.03 |
| Drum-pad running lights | **Runway lights:** 8 lights = 8 Looks. Beat chase plus "you are here" in red |
| Mixer-fader transition | **Louvre shutter:** 12 slats close with a seeded fader stagger |
| Navy / red / ice, Montserrat 900, TA logo on a white plate | Same tokens. Plate is larger and fixed |
| librosa beat grid, `build.mjs` generator | Same pipeline, frame-quantised |
| Czech flag band | Tricolour garment tab on every label |
| GH gear "made by" | Live GH mark: the ring turns, and the gear is the iris into the finale |

---

## 2. Tokens

### 2.1 Palette
```css
:root{
  --ta-void:#050d22;   /* vignette edge, studio base, intro void */
  --ta-night:#0b1e42;  /* main dark, louvre back, ink plates, text on paper */
  --ta-navy:#304285;   /* secondary planes, podium, monogram ink */
  --ta-sky:#8ea2d8;    /* hairlines, labels on dark, idle lights, ghost stroke */
  --ta-card:#eef2f9;   /* paper set, chips on dark */
  --ta-white:#ffffff;  /* TA plate, flash, chrome highlight, text on dark */
  --ta-red:#e31e24;    /* THE accent */
  --ta-red-deep:#b5121a;  /* shading on red surfaces only */
  --chrome:linear-gradient(115deg,#fff 0%,#8ea2d8 30%,#304285 52%,#eef2f9 70%,#fff 100%);
}
```
Gold `#ffd36b` is **retired** in this film.

**Shares.** Night ≈ 60 %, card + navy ≈ 30 %, red ≤ 10 %. The Bosset Look allows red ≤ 15 %.

**Red is allowed on:**
- LOOK digits and the LOOK rule
- the red thread (floor line)
- the LOCK-ON bite (≤ 12 frames)
- the active swatch indicator
- the runway light of the current Look
- DISPLAY numerals ≥ 64 px on dark
- one emphasised word per Look (optional)
- the spoon iris (transition)
- the Bosset winner's podium face

Red is never body text and never a background. At most **3 red elements** may be visible at once, not counting the TA logo or the tricolour tabs.

**Contrast (WCAG):**
| Pair | Ratio | Allowed use |
|---|---|---|
| white on `#0b1e42` | 16.4 | anything |
| `#eef2f9` / `#0b1e42` | 14.6 | anything |
| `#304285` on `#eef2f9` | 8.3 | anything |
| `#8ea2d8` on `#0b1e42` | 6.5 | text ≥ 24 px |
| white on `#e31e24` | 4.7 | bold ≥ 24 px |
| `#e31e24` on `#eef2f9` | 4.2 | display ≥ 48 px |
| `#e31e24` on `#0b1e42` | 3.5 | display ≥ 64 px |
| `#8ea2d8` on `#eef2f9` | 2.3 | **decoration only** |
| `#304285` on `#0b1e42` | 1.75 | **decoration only** |

**Tricolour tab:** 3 vertical stripes, 6 × 48 px each: `#fff | #e31e24 | #304285`. On light grounds the white stripe gets a 1 px `rgba(11,30,66,.15)` keyline.

### 2.2 Typography (1080 × 1920, px)
Fonts come from `_shared/brand/fonts`: Montserrat 600 / 800 / 900 / 800i / 900i, latin and latin-ext.
**Add Montserrat 700** (latin and latin-ext woff2 from `@fontsource/montserrat`). Until then, 700 maps to 800.
Every template inlines its `@font-face`. Fonts must be ready (`document.fonts.ready`) before the timeline is registered.

| Role | Weight | Size | LH | Tracking | Case | Rules |
|---|---|---|---|---|---|---|
| **MEGA** | 900 | fit: 200–360; 2-line cap 288; intro „MČR" cap 440 | 0.84 | −0.04em | UPPER | Wrapper `.stretch{transform:scaleY(1.10);transform-origin:50% 100%}`. Fit width 1166 (bleed ≤ 43 px per side). ≤ 2 lines, split only at a word or compound boundary |
| **DISPLAY** | 900, tabular | 150–180 | 0.86 | −0.03em | — | Thin space for thousands (`1 300+`). Red on dark only if ≥ 64 px |
| **HEADLINE** | 900 | 112–150 | 0.90 | −0.02em | UPPER | Finale only |
| **ONE-LINER** | 800 | 64 (min 56) | 1.00 | −0.01em | Sentence | ≤ 22 chars per line, ≤ 2 lines |
| **CHIP** | 700 | 42 (min 38) | 1.10 | 0 | Sentence | 1 line, ≤ 30 chars (32 hard max) |
| **URL** | 700 | 34 | 1 | 0.04em | lower | Next to the sponsor plate |
| **LOOK** | 900 | 44 | 1 | 0.02em | UPPER | Digits red |
| **LABEL** | 600 | 24–28 | 1.2 | 0.28em | UPPER | ≥ 24 px whenever it carries information |
| **TAG** (product / hang tag / callout) | 800 | 24 | 1.1 | 0.08em | UPPER | Brand · model; ≤ 26 chars |
| **MICRO** | 600 | 18–20 | 1.2 | 0.24em | UPPER | Decoration only (coordinates, codes) |
| **HEM** | 900 italic | 26 | 1 | 0.18em | UPPER | Decoration only |

Rules:
- **Fitting happens at build time.** The generator measures with the local woff2 (fontkit) or, at runtime before registration, with `window.__hyperframes.fitTextFontSize`. There is no DOM read-back after registration.
- **Diacritics guard.** Every masked line box (`overflow:hidden`) gets `padding-top:.24em; margin-top:-.24em; padding-bottom:.08em`. Snapshot-check these words: LIBĚCHOV, LÍHEŇ, SPORŤÁČEK, PŘÍVLAČ, VELKÁ, DĚKUJEME, PARTNERŮM, MISTROVSTVÍ, ČESKÉ, VÍTĚZE, ČÍSLOVANÝ.
- **Czech typesetting.** Put NBSP after single-letter prepositions and conjunctions (`v k s z o u a i`), as the existing `nb()` helper does. Thousands use a thin space, decimals a comma (`2,1 g`), ranges an en dash (`0,5–0,7 l`), and dates `24.–25. 10. 2026`.
- **No `<br>`.** Lines are separate block elements.
- Use `font-variant-numeric: tabular-nums` wherever digits animate.

### 2.3 Grid, safe zones and module map
The worst case of platform UI (Reels / TikTok / Shorts / FB):
- top 0–220
- bottom 1440–1920
- right action column x 936–1080 for y 760–1480

Therefore:
- **Information box:** x 72–936 × y 252–1440. The header row (y 252–400) may extend to x 1008.
- **Decoration / bleed only:** y < 252, y > 1440, and x > 936 for y 760–1480.
- 8 px baseline. 6 columns of 124 px with 24 px gutters inside 864 px.

```
x: 72                                                  936  1008
y 252 ┌[ TA PLATE 384×136 ]─────────────┐        LOOK 03 / 08 ┐  H1 / H2  (masthead lane 240–404)
  388 └─────────────────────────────────┘     PARTNER · MČR 26 │
  404 ░░░░░░ stage mask fades in 404→452 ░░░░░░░░░░ ▬▬ red rule ┘
  420 ┌[ SPONSOR PLATE 384×136 ]────────┐  activefishing.cz           P1 + P2 (URL x 480, y 470)
  556 └─────────────────────────────────┘
  580  M E G A   (behind the stage, bleed allowed) ─────────────────── MG band 580–1080
  600  ┌DISPLAY slot (optional) x72 y600–800┐   ┌── STAGE ──┐          S  600–1080
 1080 ═══════════════ floor · RED THREAD (4 px) ═════════════════      floor y 1080
 1136  ONE-LINER 64 px, ≤ 2 lines (1136–1264)                         C1
 1284  [▌FACT A chip 72 h]                                            C2
 1368  [▌FACT B chip 72 h]  ────────────────────────────── 1440      C3
 1468        ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪   runway lights (decoration)             R
 1520  ══════ hem tape 44 px, 0°, quiet jacquard (decoration) ══════  T
 1920
```

| ID | Module | Box (x, y, w × h) | Notes |
|---|---|---|---|
| H1 | **TA PLATE** | 72, 252, 384 × 136, r 18 | White plate. Logo `assets/brand/ta_logo_h.png` at 344 × 112. Top z-order. Static in blocks |
| H2 | LOOK CARD | right edge x 1008, y 258–374 | Line 1 „LOOK" 900/44 + digits red + „/ 08" 600/26 (y 258). Label 600/24, 0.30em (y 318). Rule 120 × 3 red (y 370) |
| — | Masthead lane | y 240–404 | H1 and H2 only. The stage layer carries `mask-image:linear-gradient(to bottom,transparent 404px,#000 452px)`, so no product, glint, lens or MEGA can ever enter it |
| P1 | **SPONSOR PLATE** | 72, 420, 384 × 136, r 18 | Same box as the TA plate (§2.8). Not inside the masked stage layer |
| P2 | URL | x 480, y 470, h 36, w ≤ 456 | URL 700/34, white on dark sets, navy on paper |
| MG | MEGA band | y 580–1080, centre y 830 | Behind the stage |
| D | DISPLAY slot | x 72, y 600–800 | Label 26 px at y 600, numerals at y 636–800. The Look keeps this corner free of product |
| S | STAGE | x 72–1008 (products may bleed), y 600–1080 | Floor at y 1080; reflection 1080–1120 |
| C1 | ONE-LINER | 72, 1136, w 864 | ≤ 2 × 64 px |
| C2 | FACT A | 72, 1284, h 72 | Chip, or empty when fact A is a DISPLAY (then fact B moves up to C2) |
| C3 | FACT B | 72, 1368, h 72 | Ends at 1440 |
| R | RUNWAY LIGHTS | centred, y 1468, 8 × (20 × 20), gap 20 (x 390–690) | Decoration |
| T | HEM TAPE | y 1520–1564, full bleed | Decoration |

**TA plate DOM (pixel-identical everywhere).**
- The plate is authored at hero size: 840 × 297, padding 40 / 24, logo 760 × 249, radius 40.
- **Docked** = `x:72, y:252, scale:.4571` → 384 × 135.8, radius 18.3.
- **Hero** = `x:120, y:690, scale:1`.
- Style: `background:#fff; box-shadow:0 12px 32px rgba(5,13,34,.28), inset 0 0 0 1px rgba(11,30,66,.08)`. One style on every set, so cover states are identical.
- In blocks the docked transform is a static CSS transform, and nothing tweens the plate itself (the sheen is a child). In intro and finale GSAP owns the transform and sets it at t = 0 with `tl.set`.

### 2.4 Sets
The base colour under every set is `#0b1e42`, which is also the louvre back.

| Set | Build | Ambient texture | Grain | Looks |
|---|---|---|---|---|
| **PAPER** | `linear-gradient(180deg,#fff 0%,#eef2f9 58%,#dfe5f1 100%)` + softbox `radial-gradient(60% 30% at 50% 0%,#fff,transparent)` + floor bounce `radial-gradient(50% 12% at 50% 100%,rgba(48,66,133,.10),transparent)` below y 1080 | none | soft-light .10 | L02, L04, L07 |
| **NAVY STAGE** | `radial-gradient(70% 45% at 50% 52%,#1d3a86 0%,#0b1e42 60%,#050d22 100%)` + spot cone (`linear-gradient(180deg,rgba(255,255,255,.14),transparent 70%)` clipped to a trapezoid x 300–780 top / 120–960 floor) + floor ellipse under product + vignette | monogram | overlay .16 | L03, L05 |
| **DIPTYCH** | PAPER for y 0–1100, plus a `#0b1e42` panel for y 1100–1920 | none | soft-light .10 / overlay .16 | L06 |
| **STUDIO** | `#050d22` + top spot `radial-gradient(40% 30% at 50% 18%,rgba(238,242,249,.18),transparent)` + floor ellipse `rgba(142,162,216,.12)` + vignette | none | overlay .16 | L08 |
| **PHOTO / ORTHO** | Full-bleed photo (cover grade, T6) or ortho (NAVY DUO, T3), plus `linear-gradient(180deg,transparent 52%,rgba(11,30,66,.86) 72%)` under the copy | caustics | overlay .16 | L01 |
| **FINALE** | NAVY STAGE | monogram, then caustics from 4.0 s | overlay .16 | Finale |

### 2.5 Texture and light (all deterministic, all loop-safe in 8 s)
- **Grain:** `_shared/brand/grain.png` (256 px tile) on a layer at `inset:-256px`. It steps at 12 fps through 8 baked offsets inside the rig driver (§6.3). Opacity per §2.4. Grain sits above the louvre and under the TA plate. Overlay is invisible on white, so the plate stays clean.
- **Vignette** (dark sets): `radial-gradient(120% 80% at 50% 45%,transparent 55%,rgba(5,13,34,.55) 100%)`.
- **Rim light** (dark sets): static `filter:drop-shadow(0 0 22px rgba(142,162,216,.40))` on the product wrapper. Never animated.
- **Contact shadow:** `radial-gradient(ellipse,rgba(11,30,66,.35),transparent 70%)`, 70 % of product width × 26 px, at the floor.
- **Reflection:** a copy with `scaleY(-1)`, opacity .14, `mask-image:linear-gradient(#000,transparent 40%)`, 40 px tall. Paper and navy sets only.
- **Red thread:** a 4 px `#e31e24` line at y 1080, full width, drawn at B2 in every Look (M3). On STUDIO it sits at 60 %. In L05 it doubles as the swatch rail.
- **Monogram** (navy sets and the finale): a 180 × 180 SVG tile with spoon, crank, jig and soft-bait glyphs plus „T" and „A" (Montserrat 900, 28 px), quincunx, rotated 0° / 45°. Ink `#304285` at 35 %. Drifts `backgroundPosition 0 → 0 360px` in 8 s (exactly 2 tiles).
- **Caustics** (venue, finale end card): a seeded, tileable 1024² PNG generated offline (`scripts/assets_prep/prep_caustics.py`), tinted `#8ea2d8`, `screen`, opacity .10. Moves x 0 → −1024 in 8 s, linear (1 tile).
- **Hem tape:** a 44 px band. On dark sets `rgba(238,242,249,.07)` with text in `#8ea2d8` at 70 %; on paper `rgba(11,30,66,.06)` with text in `#304285` at 55 %.
  - Text: HEM 900i/26, set in 1080 px cells: „MISTROVSTVÍ ČR V TROUT AREA 2026 · 24.–25. 10. 2026 · LÍHEŇ LIBĚCHOV · 40 ZÁVODNÍKŮ · 12 KOL · HARD BAITS · TROUTAREACZ.CZ ·"
  - Motion: x 0 → −2160 in 8 s (2 cells), linear. No rotation, no skew.
- **Anamorphic streak:** a 1080 × 6 px white line, blurred 6 px (static blur), at the product's centre y. Fires only with strobes.

### 2.6 Image treatments for heterogeneous product photos
**Build-time pipeline.** Extend `scripts/assets_prep/` (the existing `prep_heroes.py`, `lib.py`); do not write a parallel one. Outputs go next to the existing heroes:
1. **Cut-outs** stay as already prepped:
   - `shop_alpha` for Troutshop RGBA
   - `ml_isnet` for most products
   - classic white luma key with shank fade for jig head details
   
   For any white packshot that still needs a mask, use a **border flood-fill** (ΔE < 6 against white, then close 2 px, then feather 1 px). It keeps interior whites (white thermos, Moonky C05 Master White, spoon highlights) and thin hooks.
2. **New variants per hero:**
   - `*_b18.png`: pre-blurred 18 px, padded 36 px so the blur is not clipped. Used by M7.
   - `*_dark.png`: brightness .35. The thickness layer for M6 turntable spoons.
3. **Metadata.** `assets_prep/_meta.json` extends `_heroes_notes.json`. Per image it stores:
   - `bbox`
   - `axis` (PCA angle)
   - `anchors.eye` / `anchors.tail` / `anchors.body` (axis endpoints; the eye is the end nearer the split ring or line tie)
   - `glints` (top 3 luminance maxima inside alpha; the existing `glint` field is #1)
   - `dominant` (k-means, already present)
   - `native` px
   - `sheen` (`screen` for bare metal, `overlay` for lacquer, `soft-light` for rubber and plastic)
4. **New crops:**
   - `jigovky/heroes/h06_tungsten_gold_detail.png` and `h07_tungsten_orange_detail.png`, from `p04` / `p05`. Drop the vise (left ≈ 45 %) with the same luma key and shank fade as h03–h05.
   - `libechov/venue/v05_orto_duo.jpg`: crop of `drone/data/orto_core_6400.jpg` centred on Malý Sporťáček, NAVY DUO.
   - `libechov/venue/v02_velky_sportak_duo.jpg`.
   - `caustics.png`.
5. **Duotone NAVY DUO** (`#050d22 → #304285 → #8ea2d8`) is already baked in `assets_prep/broll/duo_navy/`. User videos, once delivered, get the same map (`ffmpeg lut3d`). Their stills (best frames) are extracted for louvre faces.
6. **Magnification rule:** displayed px ÷ native px ≤ **1.0**, or ≤ 1.15 with a 0.6 px unsharp mask. The build asserts it per element and per keyframe scale.

**Runtime treatments**
| Code | Name | Recipe | Used for |
|---|---|---|---|
| **T1** | SEAMLESS | RGBA cut-out + contact shadow + reflection (paper/navy) or rim light (dark) | All hero products |
| **T2** | LIGHTBOX | Original white-background image on a `#fff` or `#eef2f9` tile/card with `mix-blend-mode:multiply` (white disappears, hooks stay hairline-sharp). Tile radius 12, shadow `0 10px 24px rgba(11,30,66,.12)` | Moonky grid tiles, lens interior on jigs |
| **T3** | NAVY DUO | Pre-baked duotone | Louvre faces, intro b-roll, ortho |
| **T4** | LENS | `clip-path:circle()` window with a hairline tick ring | Jigovky, GH radar, venue (B10) |
| **T5** | STUDIO RENDER | GH RGBA cut-outs on STUDIO + rim light. Fallback for the raw JPGs: `object-fit:cover`, `brightness(.85) contrast(1.08)`, a `#0b1e42` multiply layer at 55 %, and a radial feather `radial-gradient(75% 70% at 50% 50%,#000 60%,transparent 100%)` | L08 |
| **T6** | COVER GRADE | Real colour, desaturate 25 %, `#304285` multiply at 20 %, vignette, Ken Burns 1.06 → 1.00 | Venue bar 1 (photo or drone video) |
| **T7** | INK TILE | Flood-fill cut-out on a `#0b1e42` tile | Moonky C05 white only |

**Sheen blend per material:** spoons, jig heads and GH aluminium use `screen`; painted cranks use `overlay`; rubber and thermos plastic use `soft-light`.
**TURNTABLE** (rotationY) is allowed **only on flat objects** (spoons). It is never used on photos of volumetric objects: cranks, thermoses, renders, soft baits.

**Asset map**
| Look | Files | Treatment |
|---|---|---|
| Intro | `assets_prep/broll/duo_navy/br01_fight_splash, br02_netting_sunrays, br04_net_with_fish, br15_net_splash` | T3 |
| L01 Líheň | `assets_prep/libechov/venue/v01_maly_sportacek.jpg` (or `drone/final/flyover_9x16.mp4` when delivered), `v05_orto_duo.jpg` (new), `v03_trout_in_net.jpg` (B10 only), `assets_prep/libechov/logo.png` | T6 → T3, T4 |
| L02 Troutshop | `assets_prep/troutshop/heroes/h01_velvetarts_forte_glow_pink.png`, `h04_nories_crankin_pupa.png`, `h05_fishup_baffi_fly_pink.png` (+ `h02` for LOOP-6); `logo_on_dark.png` | T1, turntable on the spoons |
| L03 Activefishing | `assets_prep/activefishing/heroes/h01_nories_sofia … h05_timon_chibi_futten.png`; `logo_on_dark.png` | T1 + rim light |
| L04 Moonky | `assets/moonky/p01…p09_*_crop.png` (9 tiles), `assets_prep/moonky/heroes/h01_coccon_yellow_orange.png` (hero); `logo_on_dark.png` | T2 tiles, T7 for C05, T1 hero |
| L05 Jigovky | `assets_prep/jigovky/heroes/h04_fluo, h05_pink, h06_gold (new), h07_orange (new), h03_red` details + `h01_troutjig_barbless.png`; `logo_on_dark.png` | T4 with a T2 paper interior |
| L06 Velká ryba | `assets_prep/velkaryba/heroes/h05_*_front.png` + `h05_*_back.png` (flip), `h01_illex_pink_yamame`, `h02_illex_copper_trout`, `h03_daiwa_presso_manhattan`, `h04_daiwa_presso_flashing_green`; `logo_on_dark.png` | T1, M7 sisters |
| L07 Bosset | `assets_prep/bosset/heroes/h02_zojirushi_black` (1st), `h03_zojirushi_mint` (2nd), `h01_zojirushi_orange` (3rd), `h04_pink` / `h05_green_vb` (B10 / LOOP-6); `logo_on_dark.png` | T1 on paper |
| L08 Gausse Holler | `assets_prep/gausseholler/heroes/h02_revolut8_black_side` (hero), `h04_…_top` (radar), `h03_…_threeq` (B10); `gear_ring.png`, `gear_core.png` | T5 |
| Finale | all `logo_on_dark.png`, `gausseholler/gear_ring/core.png`, `wordline_on_dark.png` | — |

Low-res limits:
- Activefishing `h02_khor_frea` (386 × 527) is shown ≤ 240 px tall.
- Troutshop `h05_fishup_baffi_fly` (732 × 575) is shown ≤ 260 px.
- Velká ryba `h05_*_back` (617 × 318) is shown ≤ 600 px long.
- Bosset `h01_orange` (392 × 1272) is shown ≤ 300 px tall.

### 2.7 Procedural vectors
All are drawn in local boxes and filled with `currentColor`. Scale them by transform only.
- **SPOON** (100 × 160): `M50 6C78 6 92 40 88 82C84 124 66 154 50 154C34 154 16 124 12 82C8 40 22 6 50 6Z`, with an eyelet `circle(50,18,r4)` cut out by `fill-rule:evenodd`. Split ring and single hook are a separate path.
- **CRANK**, **JIG**, **SOFT BAIT**: as in `direction_runway.md` §2.7. Used for the monogram and wireframe ghosts.
- **GEAR** (100 × 100): 8 teeth, outer r 50, inner r 34, hub hole r 18. The vector echo of the GH ring, used for the GEAR IRIS so no raster is upscaled.
- **STAR4** glint: `M50 0 L58 42 L100 50 L58 58 L50 100 L42 58 L0 50 L42 42 Z`.
- **THERMO DIAL**: circle r 16, stroke 3, `pathLength=1`, plus 6 hour ticks.
- **CALLOUT**: 2 px line, `pathLength=1`, end dots r 5.

### 2.8 Labels: TA plate, sponsor plate, logo rule
- **Logo rule (asserted at build):**
  - sponsor logo artwork **w ≤ 344 px** and **area ≤ 38 700 px²** (the TA logo is 344 × 112.6)
  - artwork h ≤ 112 for wide logos; round logos are Ø ≤ 112
  - the sponsor plate box is **never larger than the TA plate** (384 × 136)
  - logo wall plates are smaller than the TA hero plate
- **Sponsor plate = „woven label".**
  - 384 × 136, radius 18, **INK on every set**: `#0b1e42` + 1.5 px `rgba(142,162,216,.30)` border, logo `logo_on_dark.png`.
  - The TA plate is always the white one: house constant and dominant. The sponsor plate is always the ink one.
  - Inside: an 8 px inset hairline frame (SVG rect, `pathLength=1`, `#8ea2d8` at 40 %).
  - **Tricolour tab** stitched over the left edge (x 66–84, vertically centred).
- **Round logos (Líheň, Gausse Holler)** use a medallion layout: emblem Ø 104 at the left, plus the name set in the label (Montserrat 800/30 + 600/20, white): „LÍHEŇ / LIBĚCHOV" or „GAUSSE HOLLER / CUSTOM LAB". The GH ring is the separate layer `gear_ring.png` and rotates.

| Partner | Logo file | a = w/h | Displayed artwork | Area |
|---|---|---|---|---|
| Líheň Liběchov | `assets_prep/libechov/logo.png` | 1.00 | Ø 104 + name | 10 816 |
| Troutshop.eu | `troutshop/logo_on_dark.png` (vectorised) | 2.11 | 236 × 112 | 26 432 |
| Activefishing.cz | `activefishing/logo_on_dark.png` | 2.40 | 269 × 112 | 30 128 |
| Moonky | `moonky/logo_on_dark.png` | 3.93 | 344 × 88 | 30 272 |
| Jigovky.cz | `jigovky/logo_on_dark.png` | 2.01 | 225 × 112 | 25 200 |
| Velka-ryba.cz | `velkaryba/logo_on_dark.png` | 2.19 | 245 × 112 | 27 440 |
| Bosset.cz | `bosset/logo_on_dark.png` | 6.21 | 344 × 55 | 18 920 |
| Gausse Holler | `gausseholler/gear_ring.png` + `gear_core.png` | 1.00 | Ø 104 + name | 10 816 |

The partner's presence is carried by the **MEGA name** (the largest type on screen, but set in house Montserrat, so it reads as TA's show card), plus products and URL. It is not carried by an oversized logo.

### 2.9 Z-order inside every block (bottom → top)
1. set
2. ambient texture
3. MEGA
4. stage (products, threads, brackets, lens, glints)
5. reflections / floor / red thread
6. copy (one-liner, chips, DISPLAY)
7. sponsor plate + URL
8. LOOK card
9. runway lights + hem tape
10. streak + full-frame flash (z 70)
11. vignette
12. louvre / iris covers (z 80)
13. grain (z 85)
14. **TA plate (z 90)**

---

## 3. Motion language

### 3.1 Timing system
- **Grid:** 120 BPM. Beat 0.5 s = 15 frames; bar 2.0 s = 60 frames; Look = 4 bars = 8.000 s = 240 frames at 30 fps.
- **Block-local beats:** `B[n] = (n−1)·0.5`, n = 1…16. Downbeats are B1, B5, B9, B13; off-beats fall at +0.25.
  - With a real track, the generator snaps each `B[n]` to `audio/track.beats.json` (librosa, block start subtracted, correction ≤ ±40 ms).
  - If the track is warped to exactly 120.000 BPM (preferred), the nominal grid is used and **the same block file serves master and banner**.
- **Frame quantisation:** every event anchor is `q(t) = Math.round(t*30)/30`. Staggers inside a move may be sub-frame.
- **LAUNCH vs LAND:**
  - Arrivals **start** on the beat (`expo.out` / `power4.out`, so most travel happens in the first frames).
  - Exits, louvre closes, SCAN and SNAP **finish** on their beat.
- **Ease vocabulary** (nothing else):

| Name | Ease | For |
|---|---|---|
| slam | `power4.out` | MEGA, DISPLAY, product drops |
| snap | `expo.out` | Wipes, plates, lens, brackets fly-in |
| travel | `expo.inOut` | Catwalk, rail slide, dock/undock, grid → hero |
| settle | `power3.inOut` | Hero lock, flips, rack focus |
| exit | `power3.in` | Leaving, louvre close |
| glide | `sine.inOut` | Turntable, sweeps, Ken Burns, pendulum |
| light | `power2.inOut` | SCAN, callout draw, thread draw |
| mech | `none` | Rings, drivers, tape, monogram |
| bite | `back.out(2.2)` | LOCK-ON only (5 frames) |
| stamp | `back.out(3)` | Hallmark tab only |
| rubber | `elastic.out(1,.45)` | Moonky only |

- **Durations:** entrances 0.30–0.45 s; wipes 0.22–0.35 s; full-frame flashes 0.08 s; settles 0.5–0.6 s. Nothing that must be read moves after **6.60 s** (hero lock).
- **Code conventions:**
  - `fromTo` only, with `immediateRender:false` on every later tween of the same property.
  - Discrete changes (text swaps, image swaps, pose snaps) use `tl.set`.
  - Initial states are set by `tl.set(…,0)`.
  - GSAP owns every transform it tweens: no CSS `transform` on a tweened node.
  - Never tween `display`, `visibility` or `autoAlpha` on `.clip` elements.
  - Repeats are finite.

### 3.2 Signature moves
The generator emits literals; the selectors below refer to the block skeleton (§6.2).

**M1 · LOUVRE SHUTTER**: block in/out. It is the mixer fader reborn, with our water on the slats.
- **DOM:** `#lv` (z 80, `perspective:1600px`) contains 12 `.slat` (90 × 1920, left = 90k, `backface-visibility:hidden`, `transform-origin:50% 50%`). Each slat holds:
  - `b.fin` / `b.fout`: face slices with `background:url(<img>) -90k px 0/1080px 1920px`
  - `b.sh`: a shade layer, `#050d22`
  - static crease: `linear-gradient(90deg,rgba(5,13,34,.35),transparent 40%,rgba(255,255,255,.06) 50%,transparent 60%,rgba(5,13,34,.35))`
  - 1 px right edge `rgba(238,242,249,.14)`
  
  `#lvGlint` is a 220 px white → transparent bar, `skewX(-18deg)`, `screen`, opacity .45.
- **Faces:** `lvIn` / `lvOut` are NAVY DUO stills. In the master each boundary has its own still; in a banner `lvIn = lvOut` (§4). Navy duo is luminance-matched to navy, so the louvre is **not** a flash.
```js
const SL='#lv .slat';
tl.set(SL,{rotationY:0},0); tl.set('#lv .fin',{opacity:1},0); tl.set('#lv .fout',{opacity:0},0);      // cover state
// OPEN (inFx='louvre'), launch on B1:
tl.fromTo(SL,{rotationY:0},{rotationY:90,duration:.50,ease:'power3.out',stagger:{each:.02,from:'center'},immediateRender:false},0);
tl.fromTo('#lv .sh',{opacity:0},{opacity:.6,duration:.50,ease:'power3.out',stagger:{each:.02,from:'center'},immediateRender:false},0);
tl.fromTo('#lvGlint',{xPercent:-150},{xPercent:520,duration:.45,ease:'power2.inOut',immediateRender:false},0);
tl.set('#lv .fin',{opacity:0},4.00); tl.set('#lv .fout',{opacity:1},4.00);                          // swap while open
// CLOSE (outFx='louvre'): edges first, seeded fader jitter d_k ∈ {0,1,2} frames, closed by 7.85, held to 8.00
for (let k=0;k<12;k++){ const t=q(7.30+Math.min(k,11-k)*.02+Math.round(rnd(k+11)*2)/30);
  tl.fromTo(`#lv .slat:nth-child(${k+1})`,{rotationY:-90},{rotationY:0,duration:.375,ease:'power3.in',immediateRender:false},t);
  tl.fromTo(`#lv .slat:nth-child(${k+1}) .sh`,{opacity:.6},{opacity:0,duration:.375,ease:'power3.in',immediateRender:false},t); }
tl.fromTo('#lvGlint',{xPercent:-150},{xPercent:520,duration:.45,ease:'power2.inOut',immediateRender:false},7.55);
```
- Open ends by 0.61 s. The b-roll is visible ≈ 0.6 s on open, plus ≈ 0.55 s closing and 0.15 s held: about 1.3 s of real fishing per boundary.
- SFX: SFX08 open (silk swish + sub thump); SFX09 close (velvet whoosh + 3 slat clicks at 7.70 / 7.74 / 7.78).

**M2 · MEGA SLAM (+ PUMP, GHOST, STEP-BACK)**: the partner's name as a deadpan show card.
- **DOM:** `#mega > .stretch > .line > .ch` (chars; `.line` carries `overflow:hidden` plus the diacritics pad). CSS sets `-webkit-text-stroke:2.5px #8ea2d8` from the start (dark sets only).
```js
tl.fromTo('#mega .ch',{yPercent:24,scaleY:1.6,opacity:0,filter:'blur(6px)'},
  {yPercent:0,scaleY:1,opacity:1,filter:'blur(0px)',duration:.38,ease:'power4.out',stagger:{each:.022,from:'center'}},0.04);
[2,4,6].forEach(t=>tl.fromTo('#mega',{scale:1.03},{scale:1,duration:.30,ease:'power3.out',immediateRender:false},t));   // pump B5/B9/B13
// GHOST (dark sets) at B5: fill → outline
tl.fromTo('#mega .ch',{color:'rgba(238,242,249,1)'},{color:'rgba(238,242,249,0)',duration:.30,ease:'power2.out',immediateRender:false},2.00);
// STEP-BACK (paper sets) at B5: navy → 16 %
tl.fromTo('#mega',{opacity:1},{opacity:.16,duration:.40,ease:'power2.out',immediateRender:false},2.00);
// Looks with a DISPLAY at B9: ghost dims so the number owns the stage
tl.fromTo('#mega',{opacity:1},{opacity:.35,duration:.40,ease:'power2.out',immediateRender:false},4.00);
```
- The name is readable by **≤ 0.40 s**: the central slats open first and MEGA is centred.
- Live blur is ≤ 6 px and only on MEGA chars for 0.38 s. It is the only animated blur in a Look.

**M3 · SET LIGHT (SPOT ON · RED THREAD · SCAN)**
- **SPOT ON** (navy / studio), behind the opening louvre:
  ```js
  tl.set('#spot',{opacity:.7},.04); tl.set('#spot',{opacity:.15},.10); tl.set('#spot',{opacity:1},.14)
  ```
- **RED THREAD**, every Look at B2:
  ```js
  tl.fromTo('#thread',{scaleX:0},{scaleX:1,duration:.50,ease:'power3.inOut',transformOrigin:'0% 50%'},0.50)
  ```
- **SCAN** (L01, the photo → data stage): one proxy drives both the line and the wipe, so they cannot drift. It LANDs on B5.
  ```js
  const S={y:0}, line='#scan', feed='#feed';
  tl.set(line,{opacity:1},1.50);
  tl.fromTo(S,{y:0},{y:1920,duration:.50,ease:'power2.inOut',immediateRender:false,onUpdate(){
    document.querySelector(line).style.transform=`translateY(${S.y.toFixed(1)}px)`;
    document.querySelector(feed).style.clipPath=`inset(${S.y.toFixed(1)}px 0px 0px 0px)`; }},1.50);
  tl.set(line,{opacity:0},2.00);
  ```
  - The line is 2 px `#eef2f9` with `box-shadow:0 0 24px 4px rgba(142,162,216,.55)` and a 180 px trailing gradient.
  - A red head marker 24 × 2 px sits at x 72. A MICRO readout „SCAN · LIBĚCHOV" sits at the right margin.
  - `#feed` starts with `clip-path:inset(0px 0px 0px 0px)` in CSS.
  - SFX25.

**M4 · CATWALK STEP + VIEWFINDER LOCK**: products walk into a fixed viewfinder that bites on each hold.
- **Strip:** `#walk` with items 360 px apart, standing on y 1080. Neighbours are pre-blurred sisters (`_b18`, scale .6, opacity .5). The arriving item rack-focuses sharp (M7).
  ```js
  tl.to('#walk',{x:x0-k*360,duration:.24,ease:'expo.inOut'},B[n])
  ```
  The rest of the beat is the hold. Sway: the arriving item gets `rotation ±3°` (seeded sign) and `y −6 → 0`, 0.2 s `power2.out`.
- **Viewfinder** `#vf`: 4 L-corners, 28 × 28, 3 px border `#eef2f9`.
  - Fly-in once: from the canvas corners, 0.30 s `expo.out`, at B4.
  - During each travel the corners move to the arriving item's bbox (`_meta.json`, outset 8 px), 0.24 s `expo.inOut`.
  - On arrival, `t = B[n]+.24`:
    ```js
    tl.fromTo('#vf',{scale:1.10},{scale:1,duration:5/30,ease:'back.out(2.2)',immediateRender:false},t);
    tl.fromTo('#vf .c',{borderColor:'#e31e24'},{borderColor:'#eef2f9',duration:12/30,ease:'power2.out',immediateRender:false},t);
    ```
- **Label tail:** a TAG under the viewfinder, `BRAND · MODEL · g`. Text swap via `tl.set` at the arrival, then a mask rise `yPercent 112 → 0`, 9 frames `expo.out`.
- SFX: SFX11 heel click on each step; SFX24 lock bite.

**M5 · PAPARAZZI STROBE**: the product gets photographed. **≤ 2 per block, never on consecutive beats.**
```js
const strobe=(p,t,pose)=>{
  tl.fromTo('#flash',{opacity:.35},{opacity:0,duration:.08,ease:'power2.out',immediateRender:false},t);            // full frame ≤ .35
  tl.fromTo(p+' .bloom',{opacity:.9},{opacity:0,duration:.22,ease:'power2.out',immediateRender:false},t);          // local
  tl.fromTo('#streak',{scaleX:0,opacity:1},{scaleX:1,opacity:0,duration:.20,ease:'power2.out',immediateRender:false},t);
  tl.fromTo(p+' img.s',{filter:'brightness(1.5)'},{filter:'brightness(1)',duration:.18,ease:'power2.out',immediateRender:false},t);
  if (pose) tl.set(p+' .pose',pose,t);              // seeded stop-motion pose, e.g. {rotation:-5,x:-18,scale:1.03}
  FLASHES.push(t); };
```
SFX: SFX02 camera shutter + SFX03 flash pop.

**M6 · CHROME GLINT (+ TURNTABLE, SPOON FLIP)**: light runs over metal.
- **Sweep:** `.sweep` sits over the product, masked by the product's own PNG (`mask-image:url(cut.png);mask-size:contain;mask-position:center`). `background:linear-gradient(112deg,transparent 38%,rgba(255,255,255,.95) 50%,transparent 62%) 0 0/300% 100%`. Blend per `_meta.sheen`.
  ```js
  tl.fromTo(p+' .sweep',{backgroundPosition:'120% 0%'},{backgroundPosition:'-40% 0%',duration:.55,ease:'sine.inOut',immediateRender:false},t)
  ```
- **Star:** STAR4, 64 px, at `_meta.glints[0]`.
  ```js
  tl.fromTo(p+' .star',{scale:0,rotation:0},{scale:1.15,rotation:90,duration:.18,ease:'power2.out',immediateRender:false},t+.12);
  tl.fromTo(p+' .star',{scale:1.15,rotation:90},{scale:0,rotation:135,duration:.22,ease:'power2.in',immediateRender:false},t+.30);
  ```
- **TURNTABLE** (flat spoons only):
  - DOM: `.p > .tt` (`transformPerspective:1400`, `transform-style:preserve-3d`, transform-origin = eye anchor) > `img._dark` (`translateZ(-6px)`, x +3) + `.dof` + `.sweep`.
  ```js
  tl.fromTo(p+' .tt',{rotationY:-24},{rotationY:24,duration:2,ease:'sine.inOut',yoyo:true,repeat:3,immediateRender:false},φ)   // 8 s, loop-safe
  ```
  - With φ = 0 the spoon is face-on (rotationY 0) at 1, 3, 5 and 7 s.
  - **Coupling rule:** a sweep on a turntable spoon is timed so its band peak (t + 0.275) coincides with a face-on moment. Example: sweep at 2.725 → peak 3.00.
  - |rotationY| ≤ 24°.
- **SPOON FLIP** (Velká ryba):
  - `.flip{transform-style:preserve-3d}` holds `.front` and `.back` (`backface-visibility:hidden`). `.back` is preset to `rotationY:180` via `tl.set`.
  ```js
  tl.to(p+' .flip',{rotationY:'+=180',duration:.42,ease:'power3.inOut',transformPerspective:1400},t);
  tl.fromTo(p+' .shade',{opacity:0},{opacity:.55,duration:.21,ease:'sine.in',yoyo:true,repeat:1,immediateRender:false},t);
  ```
  - Glint fires at t + 0.42 (new face-on).
- SFX06 metal shimmer on every glint. At most one glint per product per bar.

**M7 · RACK FOCUS**: depth of field without animated blur.
- DOM: `.dof > img.s` (sharp) + `img.b` (`_b18`), stacked.
  ```js
  const rack=(p,t,d=.40)=>{ tl.fromTo(p+' .b',{opacity:1},{opacity:0,duration:d,ease:'power3.inOut',immediateRender:false},t);
                           tl.fromTo(p+' .s',{opacity:0},{opacity:1,duration:d,ease:'power3.inOut',immediateRender:false},t); };
  ```
- **PRODUCT ARRIVAL** = `rack(p,t)` + `y:+120 → 0, scale:1.06 → 1`, 0.40 s `power4.out`.
- **Sisters:** `_b18` only, scale .45–.6, opacity .5, counter-drift x ±16 px over the block (`sine.inOut`, yoyo).

**M8 · LENS**: the loupe of the show.
- `.lens`: Ø 460–560, `clip-path:circle()`. A hairline ring SVG with 24 ticks every 15°, `#8ea2d8`, 1.5 px. Interior is paper `#eef2f9` (jig details) or the image itself.
  ```js
  tl.fromTo('#lens',{clipPath:'circle(0% at 50% 50%)'},{clipPath:'circle(50% at 50% 50%)',duration:.50,ease:'expo.out'},t);
  tl.fromTo('#lensRing',{rotation:0},{rotation:90,duration:8-t,ease:'none'},t);           // integer tick steps
  tl.fromTo('#lens .img',{x:-12},{x:12,duration:4,ease:'sine.inOut',immediateRender:false},t);
  ```
- Image swaps use `tl.set` with a lens-local bloom. The bloom is not full-frame, so it does not count as a flash.
- **Magnification ≤ 1.0** (≤ 1.15 with unsharp), asserted. Never upscale a crop to fill the lens: size the lens to the crop.

**M9 · LOOK CARD (split-flap, pure driver)**
- Two digit cells, each 30 × 44, background `#0b1e42`, 1 px `#304285` border, centre seam.
- Each cell flips `3 + ((i+seed) % 3)` times through seeded digits, **period 3 frames**, stagger 1 frame. It starts at 0.10 and lands by ≈ 0.55 s.
- Driver: the flap function in §6.3. The label fades in at 0.30; `#lookRule` scaleX 0 → 1, 0.40 s `power3.inOut` from the left, at 0.10.
- The same driver runs DISPLAY odometers: each digit walks up to its target, ≤ 6 flips, units first; then a `+` flaps in.
- SFX12 flap clicks.

**M10 · RUNWAY LIGHTS** (drum-pad heritage, now meaningful)
- 8 lights, 20 × 20, radius 4. They are computed in the rig driver as pure functions of t. Look order index = `L`.
- **Master:**
  - lights `< L`: *past*, `#8ea2d8` at 55 %
  - light `L`: *here*, `#e31e24`, with a soft pulse on downbeats
  - lights `> L`: *idle*, `rgba(142,162,216,.22)`
- **Beat chase:** on beat n, light `(n−1) mod 8` flashes white (`--hit = exp(−Δt/0.24)`, box-shadow `0 0 16px rgba(255,255,255,.9·hit)`). 16 beats = 2 cycles, so it is loop-safe.
- **Banners:** no past or here state (it would reveal the order). The chase only; the downbeat light fires red.

**M11 · HALLMARK LABEL** (sponsor plate)
```js
tl.fromTo('#plate',{clipPath:'inset(0 50% 0 50%)'},{clipPath:'inset(0 0% 0 0%)',duration:.35,ease:'expo.out'},1.00);
tl.fromTo('#plate .frame',{strokeDashoffset:1},{strokeDashoffset:0,duration:.60,ease:'power2.inOut'},1.00);
tl.fromTo('#plate .logo',{opacity:0,scale:1.06},{opacity:1,scale:1,duration:.50,ease:'power3.out'},1.08);
tl.fromTo('#plate .tab',{scale:1.5,opacity:0},{scale:1,opacity:1,duration:.22,ease:'back.out(3)'},1.25);        // the hallmark stamp
tl.fromTo('#url .ch',{opacity:0,y:8},{opacity:1,y:0,duration:.30,ease:'power3.out',stagger:.012},1.25);
```
SFX26 hallmark stamp (felt thud + paper tick) at 1.25.

**M12 · TA PLATE (static, SHEEN, DOCK / UNDOCK)**
- **Blocks:** static. Once per block, at 6.25, `#ta .sheen` (a band masked to the plate, `screen`, opacity .35) sweeps across in 0.60 s `power2.inOut`. The masthead catches the light. No scale pulse.
- **Intro and finale:** FLIP via transform only, between docked `{x:72,y:252,scale:.4571}` and hero `{x:120,y:690,scale:1}`.
  - Intro undock-slam at 1.00: 0.40 s `power4.out` to `scale:1.04`, then 0.25 s `power3.out` to 1.
  - Intro dock: 3.50–3.95, `expo.inOut`.
  - Finale undock: 4.00–4.55, `expo.inOut`.
  - The opacity stays 1 throughout.

**Micro-moves (standard)**
| Move | Spec |
|---|---|
| LINE RISE (one-liner) | words `yPercent 105 → 0`, 0.40 s `power4.out`, stagger 0.05 |
| TAG WIPE (chip) | `clipPath inset(0 100% 0 0) → inset(0)`, 0.32 s `expo.out`; text `yPercent 100 → 0`, 0.30 s `power3.out` at +0.04 |
| COUNTER / ODOMETER | M9 driver |
| THREAD / CALLOUT DRAW | `strokeDashoffset 1 → 0`, 0.35 s `power2.inOut`; end dots `scale 0 → 1`, 0.18 s `expo.out`; label chars stagger 0.015 |
| HERO LOCK | every product settles to its final pose over 0.60 s `power3.inOut` at B13; nothing readable moves after 6.60 |
| PENDULUM (hanging items) | `rotation` about the eye anchor: 6° → −3° (0.35 s `sine.out`) → 0 (0.35 s `sine.inOut`) |

### 3.3 Transitions
| Name | Where | Spec |
|---|---|---|
| **LOUVRE** (M1) | Every Look in/out, master and banners | Default. Cover state at the cut |
| **SPOON IRIS** | Intro OUT (3.70–4.00) + L01 IN (`inFx:'spoonIris'`, 0.00–0.40), master only | Intro: a procedural SPOON (fill `#e31e24`, `--chrome` edge highlight) at the frame centre, `scale .1 → 9`, `rotation −30 → 0`, 0.30 s `power3.in`, covering the frame at 4.00. L01 frame 0: `#irisCover` = full-frame SVG `<rect fill="#e31e24" mask="url(#irisM)">` whose mask holds a black `<circle id="hole" cx="540" cy="883" r="0">`; tween `attr:{r:0→1250}` 0.40 s `expo.out`. A 6 px chrome ring follows the hole edge (`attr r` matched). With `inFx:'spoonIris'` the louvre is preset open (`tl.set(SL,{rotationY:90},0)`) and has no open tween. Counts as 1 flash |
| **GEAR IRIS** | L08 OUT (7.60–8.00, `outFx:'gearIris'`) + finale IN (0.00–0.40), master only | L08: the procedural GEAR in `#0b1e42` with a 2 px `#8ea2d8` edge, `scale .2 → 10` + `rotation 0 → 45°`, 0.40 s `power3.in`. Finale frame 0: navy cover with a hub hole `r 0 → 1250`, 0.40 s `expo.out`. The author's gear is the door to „MADE BY". With `outFx:'gearIris'` the louvre close tweens are not emitted |
| **KICK CUT** | Internal cuts only (L08 side ↔ radar) | Hard cut on a downbeat + SFX02. No flash |
| **SCAN** (M3) | L01 internal (photo → ortho) | LAND on B5 |

### 3.4 Guardrails
- **Flashes:** no full-frame flash at any block boundary.
  - Full-frame peak ≤ 0.35 (strobes); finale stab 0.40; intro TA slam 0.30.
  - The spoon iris counts as one flash event.
  - **≤ 3 flash events in any 1 s window**, asserted from `FLASHES[]`.
  - Lens- and plate-local blooms are exempt but stay ≤ 4 per second.
- **Reading:**
  - Informative text never moves after its entrance settles.
  - No informative text overlaps another text layer.
  - Each informative text is on screen ≥ 2.0 s (facts) / ≥ 5.0 s (one-liner) / ≥ 6.0 s (logo + URL).
- **TA plate:** opacity 1 and bbox (72, 252, 384 × 136) in every sampled frame, except the intro/finale dock moves (opacity still 1).

---

## 4. Banner rules

### 4.1 Cover-state contract (from TECHNO)
Every Look starts and ends on the **identical cover state**:
- the closed louvre (faces = NAVY DUO still)
- the TA plate
- grain

The TA plate, louvre, LOOK card, lights and tape all live **inside the Look**. The master host only places Looks on the timeline. Consequences:
- **Master block markup = banner markup.** Variants differ only in a handful of baked constants (§4.2).
- **Sponsor order is free.** `ORDER=` reorders the master, and LOOK numbers and boundary stills follow.

### 4.2 Variants (baked by the generator from one template)
| Variant | Length | In | Out | LOOK card | Lights | Audio | Use |
|---|---|---|---|---|---|---|---|
| **MASTER** | 8.0 s | louvre (`lvIn` = boundary still) · L01: spoon iris | louvre (`lvOut` = next boundary still) · L08: gear iris | `LOOK 03 / 08` + category | past / here / idle + chase | host music + block VO + block SFX | Inside the 75 s film |
| **B8-LOOP** (default deliverable) | 8.0 s | louvre (`lvIn = lvOut = cover`) | louvre | `MČR 26` (digits red) + `KOLEKCE PARTNERŮ` | chase only | 4-bar music slice + VO + SFX | Stories / Reels ads, web, LED. **Frame 0 = frame 240** |
| **B8-HOLD** | 8.0 s | louvre | none: holds the poster 7.00–8.00 | as B8 | as B8 | as B8 | Placements that stop on the last frame |
| **B10** | 10.0 s | louvre | louvre at warped 9.30 | as B8 | as B8 | 5-bar slice + VO + SFX | 10 s placements |
| **L6-LOOP** | 6.0 s | none (poster state from frame 0) | none | as B8 | chase on 8ths (24 steps = 3 cycles) | 3-bar loop, **no VO** | Seamless feed / DOOH loop. **Frame 0 = frame 180** |
| **POSTER** | PNG | — | — | as B8 | — | — | Static banner and thumbnail: B8 at 7.00, B10 at 9.00 |

- **B10 time-warp:** `W(t) = t < 6 ? t : t + 2`. Every tween position ≥ 6.0 shifts +2 s, which inserts a **„LOOK HOLD" bar** (6.0–8.0). It plays the Look's B10 extra (STORYBOARD §5). VO is unchanged: it ends ≤ 7.0 inside the inserted bar.
- **L6:** everything readable is static from frame 0:
  - MEGA in its ghost / step-back state
  - plate + URL, one-liner, facts A and B
  - TA plate and LOOK card
  
  Only the product choreography cycles (period 6 s, defined per Look in STORYBOARD §5) and the ambient layers move. Loop math for 6 s:
  - tape 1 cell (180 px/s)
  - monogram 2 tiles (60 px/s)
  - lens ring 45°
  - turntable period 3 s (`duration:1.5`, `yoyo`, `repeat:3`)
  - caustics 1 tile per 6 s

### 4.3 Readability timeline (muted, B8)
| t | On screen |
|---|---|
| 0.00 | Cover: our fishing photo through closed slats + **TA plate** |
| ≤ 0.40 | **MEGA partner name** readable (thumb-stop) |
| 1.00–1.35 | Sponsor plate + URL; they stay to the end (≥ 6.0 s) |
| 2.00 | One-liner (≥ 5.3 s on screen) |
| 4.00 / 5.00 | Fact A / fact B (≥ 3.3 s / 2.3 s on screen) |
| 6.00–6.60 | Hero lock; nothing readable moves afterwards |
| **7.00** | **Poster frame:** everything visible. Only ambient layers, glints and lights move |
| 7.30–7.85 | Louvre closes. Held closed to 8.00 |

### 4.4 Loop math (B8: integer cycles in 8 s)
- hem tape: 2 cells
- monogram: 2 tiles
- caustics: 1 tile
- runway lights: 2 cycles
- lens ring: 90° (6 ticks)
- GH ring: 360°
- turntable: 2 periods
- radar sweep: 360° per 1 s
- grain: not relevant

### 4.5 Exports and naming
`04_RELEASE/banners/MCR26_<slug>_<variant>[_vo|_novo].mp4` and `MCR26_<slug>_poster.png`.
- variant ∈ `b8loop | b8hold | b10 | l6`
- slug ∈ `libechov | troutshop | activefishing | moonky | jigovky | velkaryba | bosset | gausseholler`

Optional: `MCR26_intro_teaser` (4 s) and `MCR26_finale` (7 s).

---

## 5. Sound and VO rules

### 5.1 Music
- **Brief:** fashion-runway techno / catwalk house, **120.000 BPM, A minor**, 4/4. Tight kick (50–60 Hz body), rolling 16th bass, crisp hats, glossy analog stabs, metallic percussion. Polished and minimal. Sparse in the midrange for the VO.
- **Suno:** reuse `vo/suno_sponzori.md` (style and exclude lists) with these lyric-map changes:
  - delete the „Partners!" shout and the spoken „Mistrovství republiky" line
  - keep **one** shout, „Trout Area!", in the final hook only
  - add `[Dark groove: saturated bass, mechanical clicks]` for the GH section
  
  Generate ≥ 2:00. Beat-track with librosa into `audio/track.beats.json`. Cut on downbeats (20 ms crossfades at zero crossings). Time-stretch (rubberband) to **exactly 120.000** if the drift exceeds 10 ms over 75 s.

| Bars | Master | Section | Content |
|---|---|---|---|
| 1–2 | 0–4 | Intro build | Filtered kick (LPF 200 Hz → open), riser, snare roll on bar 2 beats 3–4, reverse cymbal into 4.00 |
| 3 | 4.00 | **Drop** | Crash + sub. L01 iris opens |
| 3–18 | 4–36 | Groove A (L01–L04) | Kick, off-beat open hat, rolling bass, stab on beat 4&. Crash on every Look downbeat |
| 19–30 | 36–60 | Groove B (L05–L07) | + clap on 2 and 4, 16th hats, filtered arp. L07 opens the filter (prizes lift) |
| 31–34 | 60–68 | „Black" groove (L08) | Darker saturated bass, thinner hats, mechanical clicks |
| 35–36 | 68–72 | Final hook | Full mix; shout „Trout Area!" at ≈ 71.0 (VO gap) |
| 37 | 72–74 | Outro | Impact at 72.00; drums thin out |
| 37½ | 74.00 | End | Single final stab + sub; reverb tail to 75.0 |

- **Banner stems:** 4-bar loops of Groove A, Groove B and „Black" (B8); 5-bar cuts (B10); 3-bar loops (L6). All are phrase-clean with a 10 ms loop crossfade and pre-ducked offline under each block's VO.

### 5.2 SFX palette
All SFX are high-passed under the VO and tuned to A minor where tonal. Levels are relative to music. **SFX are pre-rendered per block** to `audio/sfx/LNN_<slug>.wav` (8.000 s, block-local) from the same event list the timeline uses, so banners reuse them as they are. The master SFX stem is concatenated from the blocks.

| ID | Sound | Len | Level | Trigger |
|---|---|---|---|---|
| SFX01 | Sub impact (45 Hz) | 0.4 | −6 | Intro TA slam, finale 72.00 |
| SFX02 | Camera shutter (DSLR) | 0.08 | −10 | Strobes, internal cuts |
| SFX03 | Flash pop | 0.15 | −12 | Strobes, final stab |
| SFX04 | Air whoosh short | 0.3 | −14 | Dock / undock, grid → hero, rail slide |
| SFX05 | Reverse whoosh | 0.5 | −12 | Into 4.00 and 68.00 irises |
| SFX06 | Metal shimmer (A6 / E7 bells) | 0.6 | −16 | Glints |
| SFX07 | Spoon tinkle (A5 / C6 / E6) | 0.3 | −16 | Rail arrivals |
| SFX08 | Louvre open (silk swish + sub thump) | 0.5 | −12 | Every Look 0.00 |
| SFX09 | Louvre close (velvet whoosh + 3 slat clicks) | 0.7 | −12 | 7.30 → 7.78 |
| SFX10 | Stage-light clunk | 0.3 | −14 | SPOT ON |
| SFX11 | Heel click on concrete | 0.1 | −16 | Catwalk steps |
| SFX12 | Split-flap clicks | 0.25 | −16 | LOOK card, odometers |
| SFX13 | Odometer clatter → ding | 0.9 | −16 | DISPLAY counters |
| SFX14 | Rubber squeak / squish | 0.15 | −16 | Moonky |
| SFX15 | Tungsten tick | 0.08 | −16 | Jigovky swatches |
| SFX16 | Lens focus servo | 0.35 | −18 | Lens open |
| SFX17 | Water plip | 0.6 | −16 | Venue |
| SFX18 | Sonar ping | 0.5 | −18 | Venue pin |
| SFX19 | Steel clink / lid twist / steam hiss | 0.3 / 0.4 / 0.6 | −14 | Bosset |
| SFX20 | Carbon thock / ratchet / gear whirr | 0.2 / 0.05 / 0.8 | −16 / −24 / −18 | GH, GH mark |
| SFX21 | Callout ping (A5 / C6 / E6) | 0.25 | −18 | GH callouts, barbless callout |
| SFX22 | Crowd cheer swell | 0.8 | −22 | Bosset hero lock |
| SFX23 | Podium thud | 0.2 | −12 | Bosset podium |
| SFX24 | Lock bite (60 Hz thump + 3 kHz click) | 0.1 | −14 | LOCK-ON |
| SFX25 | Scan sweep (noise 400 Hz → 6 kHz) | 0.5 | −18 | SCAN |
| SFX26 | Hallmark stamp (felt thud + paper tick) | 0.2 | −18 | Plate tab 1.25 |
| SFX27 | Hanger slide on chrome rail | 0.6 | −16 | Troutshop rail |
| SFX28 | Radar sweep tone | 1.0 | −20 | GH radar |

Budget: ≤ 3 SFX starts per beat. Nothing is louder than the VO.

### 5.3 VO rules (full copy in `VO_TEMPLATE.md`)
- **Voice:** Paul Broadcaster, ElevenLabs v3 via HeyGen. `voiceId 02733a92a0db457aadf63b235d2aa457`, `eleven_v3`, `cs`. Tone: presentational, confident, warm, premium, not a sales voice.
- **One file per unit:** `vo/<slug>.wav`, silence-trimmed, normalised to −16 LUFS. The same file serves master and banners.
- **Look window:** in at **0.50 s** (local). Target end ≤ **6.50 s**; hard end ≤ **7.00 s**, before the louvre closes.
  - At the measured 2.9 spoken words/s: ≤ 17 written words, 2 sentences.
  - Sentence 1 names the partner (it lands with the plate at ≈ 1.0 s).
  - Sentence 2 carries one or two facts (it lands with the facts at ≈ 4.0 s).
- **Intro** 0.25–3.60. **Finale** A 0.40–2.60 (master 68.40–70.60) and B 4.20–5.80 (master 72.20–73.80). The gap 70.6–72.2 is for the music shout.
- **Over-long takes:** first regenerate; then rubberband ≤ 4 %; then use the short fallback line. Never let VO cross into the louvre close.
- **Numbers:** written as words in the TTS field. Domains are never spoken (they are on screen).
- **Mix:**
  - Music ducks −7 dB under the VO (attack 120 ms, release 350 ms) via a `data-automation` volume lane (hyperframes-audio). Banners use pre-ducked slices.
  - SFX bus −10 dB relative to music.
  - **Master −14 LUFS integrated, −1 dBTP.** Banners the same.
  - Fades: 10 ms in, louvre whoosh to the end.

---

## 6. Implementation (HyperFrames + GSAP)

### 6.1 Structure: extend the existing generator, do not rewrite
- `scripts/build.mjs` (v1) already provides `BLOCK=`, `LOOP=1`, `ORDER=`, `content.json`, `tokens.json` + `design/tokens.json`, asset staging, the beat grid and `nb()`. Add a **v2 design layer**: `VER=v2`, with `scripts/lib/runway.mjs` as the move library M1–M12 and the hero presets.
- **One generator function** `look(slug, variant) → {css, html, js}` with two emitters:
  1. **template-wrapped** `proto/v2/compositions/look-<slug>.html` for the master
  2. **standalone root** `proto/v2/banners/<slug>_<variant>/index.html`
  
  Variant constants (`lvIn`, `lvOut`, `inFx`, `outFx`, `lookText`, `lightsMode`, `W`) are **baked**. Per-instance `data-variable-values` may be used for the master instead (`getVariables()` is documented per instance), but baking is the default because it removes a runtime dependency.
- **Master host** `proto/v2/index.html` (`data-duration="75"`):
  - intro (0–4)
  - 8 Look slots at 4, 12 … 60 (`data-duration="8"`)
  - finale (68–75)
  - music track
  
  VO and SFX travel inside each sub-composition as `<audio>`. The host timeline is empty (`window.__timelines.main = gsap.timeline({paused:true})`). Never add children by hand.
- **Hero presets** (`hero.type` in content.json): `scan | rail | catwalk | grid | lens | flip | podium | spec`.

**content.json extension** (example; all copy is in VO_TEMPLATE / STORYBOARD):
```json
"activefishing": { "type":"sponsor","bars":4,"set":"navy","mega":["ACTIVE","FISHING"],"lookLabel":"PARTNER · MČR 26",
  "plate":{"logo":"assets_prep/activefishing/logo_on_dark.png","w":269,"h":112},"url":"activefishing.cz",
  "oneLiner":"Pro všechny, kdo milují přívlač",
  "factA":{"kind":"display","value":"1 300+","label":"PLANDAVEK","odometer":[0,1300]},
  "factB":{"kind":"chip","text":"Osobní přístup, rychlé doručení"},
  "hero":{"type":"catwalk","items":[
    {"src":"assets_prep/activefishing/heroes/h01_nories_sofia.png","tag":"NORIES · SOFIA 1,2 g","h":220},
    {"src":"assets_prep/activefishing/heroes/h02_khor_frea.png","tag":"KHOR · FREA 0,7 g","h":220} ]},
  "strobes":[2.5,6.5],"cover":"assets_prep/broll/duo_navy/br05_reeling_portrait.jpg",
  "b10":"catwalkEncore","l6":"catwalk3beat","vo":"vo/activefishing.wav","sfx":"audio/sfx/L03_activefishing.wav" }
```

### 6.2 Look skeleton (template-wrapped; everything inside `<template>`)
```html
<template>
<style>/* inlined @font-face + runway.css + Look overrides; root styled by #root */
  #root{position:absolute;inset:0;overflow:hidden;background:#0b1e42;font-family:Montserrat,sans-serif;color:#fff}
  #stage{position:absolute;inset:0;-webkit-mask-image:linear-gradient(to bottom,transparent 404px,#000 452px);mask-image:linear-gradient(to bottom,transparent 404px,#000 452px)}
  #ta{position:absolute;left:0;top:0;width:840px;height:297px;border-radius:40px;background:#fff;transform-origin:0 0;
      transform:translate(72px,252px) scale(.4571);z-index:90;box-shadow:0 12px 32px rgba(5,13,34,.28),inset 0 0 0 1px rgba(11,30,66,.08)}
</style>
<div id="root" data-composition-id="look-activefishing" data-width="1080" data-height="1920">
  <div id="set"></div><div id="ambient"></div>
  <div id="stage"><div id="mega"><div class="stretch"><div class="line">…</div><div class="line">…</div></div></div>
    <div id="walk">…products (.p > .pose > .tt > .dof(img.s,img.b) + .sweep + .star + .bloom)…</div><div id="vf">…</div>
    <i id="thread"></i></div>
  <div id="copy"><div id="display">…</div><div id="oneliner">…</div><div id="factA" class="chip">…</div><div id="factB" class="chip">…</div></div>
  <div id="plate">…</div><div id="url">…</div><div id="look">…</div>
  <div id="lights">…8×i…</div><div id="hem"><div class="run">…</div></div>
  <i id="streak"></i><div id="flash"></div><div id="vig"></div>
  <div id="lv">…12×.slat…</div><i id="lvGlint"></i>
  <div id="grain"></div>
  <div id="ta"><img src="assets/brand/ta_logo_h.png" alt="Trout Area Czech Republic"><i class="sheen"></i></div>
  <audio id="vo-activefishing" src="assets/vo/activefishing.wav" data-start="0.50" data-track-index="1" data-volume="1"></audio>
  <audio id="sfx-activefishing" src="assets/audio/sfx/L03_activefishing.wav" data-start="0" data-track-index="2" data-volume="1"></audio>
</div>
<script>
document.fonts.ready.then(()=>{ const tl=gsap.timeline({paused:true});
  /* emitted literals: rig driver, M1 open, M2, M9, M3 thread, M11, hero preset, copy, M5/M6, hero lock, M12 sheen, M1 close */
  window.__timelines['look-activefishing']=tl; });                         // register LAST
</script>
</template>
```
Ids follow the rule: host `data-composition-id` = root id = timeline key. Every element id is local to the Look; shared CSS uses classes.

### 6.3 Pure drivers (seek-safe; one proxy each, `ease:'none'`)
```js
const FPS=30, q=t=>Math.round(t*FPS)/FPS, rnd=s=>{const x=Math.sin(s*9301+49297)*233280;return x-Math.floor(x)};
// RIG: lights + hem tape + monogram + caustics + grain, all f(t)
function rig(tl,root,{dur,beats,L,mode,amb:ambType}){ const R={t:0}, li=[...root.querySelectorAll('#lights i')];
  const run=root.querySelector('#hem .run'), amb=root.querySelector('#ambient'), gr=root.querySelector('#grain');
  const GX=[...Array(8)].map((_,i)=>Math.floor(rnd(i+1)*256)), GY=[...Array(8)].map((_,i)=>Math.floor(rnd(i+21)*256));
  tl.fromTo(R,{t:0},{t:dur,duration:dur,ease:'none',onUpdate(){ const t=R.t; let k=-1; beats.forEach((b,i)=>{if(b<=t+1e-4)k=i;});
    li.forEach((el,i)=>{ const hit=(k>=0&&k%8===i)?Math.exp(-(t-beats[k])/.24):0; el.style.setProperty('--hit',hit.toFixed(3));
      el.dataset.s = mode==='master' ? (i<L?'past':i===L?'here':'idle') : 'idle'; });
    run.style.transform=`translateX(${(-(t/dur)*(dur===6?1080:2160)).toFixed(1)}px)`;
    if(ambType==='monogram') amb.style.backgroundPosition=`0px ${((t/dur)*360).toFixed(1)}px`;            // 2 tiles per unit (8 s or 6 s)
    if(ambType==='caustics') amb.style.backgroundPosition=`${(-(t/dur)*1024).toFixed(1)}px 0px`;         // 1 tile per unit
    const g=Math.floor(t*12)%8; gr.style.backgroundPosition=`${GX[g]}px ${GY[g]}px`; }},0); }
// FLAP: LOOK digits and DISPLAY odometers (period 3 f)
function flap(tl,cells,text,t,{period=3/FPS,stagger=1/FPS,seed=1,charset='0123456789'}={}){
  const plan=[...text].map((ch,i)=>{ const n=ch===' '?0:3+((i+seed)%3);
    const seq=[...Array(n)].map((_,j)=>charset[Math.floor(rnd(seed*97+i*13+j)*charset.length)]);
    return {el:cells[i],s:i*stagger,n,seq:[...seq,ch]}; });
  const dur=(text.length-1)*stagger+6*period, p={e:0};
  tl.fromTo(p,{e:0},{e:dur,duration:dur,ease:'none',immediateRender:false,onUpdate(){ for(const c of plan){
    const k=p.e<=c.s?-1:Math.floor((p.e-c.s)/period), g=k<0?' ':c.seq[Math.min(k,c.n)];
    if(c.el.textContent!==g) c.el.textContent=g;
    c.el.style.setProperty('--f',k>=0&&k<c.n?(((p.e-c.s)%period)/period).toFixed(2):'0'); }}},q(t)); }
```
Rules:
- `FLASHES[]` collects every full-frame flash time (strobe, TA slam, iris, stab), and the build asserts ≤ 3 per 1 s.
- No DOM measurement after registration: geometry comes from tokens and `_meta.json`.

### 6.4 Determinism
- No `Math.random`, `Date.now` or `performance.now`; the build greps the output.
- No CSS `transition` or `@keyframes`.
- Finite repeats, computed with `floor`.
- No `from()`.
- Media timing lives only on `<audio>` / `<video>` elements (framework-owned).
- User videos (drone flyover, fishing clips) are `<video muted playsinline>` inside the Look, with `data-start` on the element.

### 6.5 Performance budget
- **Blend modes:** ≤ 3 `mix-blend-mode` layers per frame (grain + sweep + one of caustics / LIGHTBOX multiply).
- **Animated blur:** only MEGA chars (≤ 6 px, 0.38 s). Images use M7 crossfades.
- **3D:** the louvre (12 slats), the spoon flip and the turntable, with no more than 2 at once.
- **Animated masks:** one sweep `mask-image` per product at a time. The stage lane mask is static.
- **Images:** pre-sized to ≤ 1.25 × display (≥ 1.0 for the magnification rule).
- **Per-Look DOM:** < 220 nodes.
- **Render:** confirm the `beginframe` + GPU path on one Look before building all of them. Use `--quality draft` while iterating, `looks` for review and `delivery` for finals.

### 6.6 QC gates (automated in `build.mjs`, then manual)
1. `npx hyperframes check`: zero errors, in master and in every banner folder.
2. **Flash budget:** sort `FLASHES`; for every i, assert `FLASHES[i+3] − FLASHES[i] ≥ 1.0`.
3. **TA plate:** sample every 0.25 s in the master and all variants. Opacity 1, bbox (72, 252, 384 × 136); exceptions are the intro and finale dock moves only.
4. **Logo rule:** artwork w ≤ 344, area ≤ 38 700; sponsor plate ≤ TA plate; wall plates < TA hero.
5. **Safe box:** every informative text node lies in x 72–936 × y 252–1440 (header row to x 1008) at its mid-life and at the poster.
6. **Copy limits:** ONE-LINER ≤ 22 chars × 2 lines; CHIP ≤ 30 (32 hard); TAG ≤ 26; VO ≤ 17 written words.
7. **Magnification** ≤ 1.0 (≤ 1.15 flagged) for every image at every keyframe scale.
8. **Diacritics** snapshot list (§2.2).
9. **Beat sync:** every Look start, slam, strobe, louvre open and lock is within ±1 frame of a `beats.json` beat.
10. **Loops:**
    - B8 frame 0 vs frame 239: pixel diff ≈ 0 (excluding grain)
    - L6 frame 0 vs frame 180: < 1 %
    - master boundary frames: Look N frame 239 = Look N+1 frame 0
11. **Contrast:** `check` WCAG pass. Any pair on the "decoration only" list carrying text fails.
12. **Audio:**
    - VO end ≤ 7.00 local (target 6.50)
    - nothing in 70.6–72.2 except the shout
    - master −14 LUFS / −1 dBTP
13. **Snapshots** at local 0.00, 0.40, 1.35, 2.50, 4.00, 5.50, 7.00 and 7.95 for every Look. Composite each with `qc/reels_ui_overlay.png` and `qc/tiktok_ui_overlay.png`: no information under the UI.
14. **Muted phone test** of each B8: in 8 s a viewer gets the name, what the partner does, one fact and the URL.
15. **Copy guardrails** (VO_TEMPLATE §2) reviewed against `research/*.md` on export day. The live numbers (Activefishing) are rechecked.

### 6.7 Tokens delta for `design/tokens.json` (merged by the existing generator)
```json
{ "_note":"v2 RUNWAY final — see design/DESIGN.md",
  "safe":{"top":252,"bottom":480,"left":72,"right":144,"uiRight":144,"uiRightFromY":760,"headerRight":72},
  "color":{"bg0":"#050d22","bg1":"#0b1e42","bg2":"#1d3a86","navy":"#304285","sky":"#8ea2d8","ice":"#eef2f9","red":"#e31e24","redDeep":"#b5121a","gold":null},
  "type":{"megaMin":200,"megaMax":360,"mega2Line":288,"megaIntro":440,"stretch":1.10,"display":[150,180],"headline":[112,150],
          "oneLiner":64,"chip":42,"url":34,"look":44,"label":24,"tag":24,"micro":20,"hem":26,"maskPadEm":0.24},
  "plate":{"x":72,"y":252,"w":384,"h":136,"heroW":840,"heroH":297,"dockScale":0.4571,"heroX":120,"heroY":690,"logoW":344,"logoH":112},
  "sponsorPlate":{"x":72,"y":420,"w":384,"h":136,"style":"ink","urlX":480,"urlY":470},
  "logoRule":{"maxW":344,"maxH":112,"maxArea":38700,"roundD":104},
  "layout":{"megaBand":[580,1080],"display":[72,600],"floorY":1080,"oneLinerY":1136,"factAY":1284,"factBY":1368,"lightsY":1468,"hemY":1520},
  "rig":{"lights":8,"lightSize":20,"lightGap":20,"grainFps":12,"grainOpacity":{"dark":0.16,"paper":0.10},"monogramTile":180,"hemCell":1080},
  "motion":{"fps":30,"bpm":120,"flapPeriodFrames":3,"strobeMax":2,"flashMax":0.35,"flashStab":0.40,"pump":1.03,
            "louvre":{"slats":12,"open":0.50,"openStagger":0.02,"closeStart":7.30,"close":0.375,"jitterFrames":2},
            "ease":{"slam":"power4.out","snap":"expo.out","travel":"expo.inOut","settle":"power3.inOut","exit":"power3.in",
                    "glide":"sine.inOut","light":"power2.inOut","bite":"back.out(2.2)","stamp":"back.out(3)","rubber":"elastic.out(1,.45)"}},
  "transition":{"style":"louvre"} }
```

---

## 7. Open items (for the user)
1. **Sponsor order.** The proposal is in STORYBOARD §1. GH stays last, because it hands into the gear iris and the „MADE BY" sign-off. Reordering is free.
2. **Bosset `{OBJEM}`:** the brief says 0,5–0,7 l; the shop's in-range drinking thermoses are 0,6 l (plus a 0,52 l food jar). Confirm the wording and which placings win.
3. **„Black Standard Edition"** = Revolut 8 · Standard Edition · Black (research). Confirm the name with Igor.
4. **User videos and the drone flyover:** they drop into the FEED slot (L01 bar 1, intro) and the louvre stills.
5. **Music:** run Suno with the lyric-map changes (§5.1), pick a take and lock it to 120.000 BPM.
6. **Activefishing 1 300+:** a live stock number (1 340 on 19. 10. 2026). Recheck on export day.
7. **Length:** 75.0 s master. CUT-59 fallback in STORYBOARD §4.
