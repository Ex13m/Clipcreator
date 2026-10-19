# Direction RUNWAY: „Kolekce partnerů MČR 26"

Vertical 9:16 (1080×1920, 30 fps) animated sponsor presentation for **Mistrovství ČR v Trout Area 2026** by Trout Area Czech Republic.
Every sponsor block is an 8.000 s **Look**, a self-contained sub-composition that also exports as a standalone vertical banner.

| | |
|---|---|
| Master length | **75.0 s** = intro 4 s + 8 Looks × 8 s + finale 7 s (120 BPM, 37½ bars) |
| Block / banner | 8.000 s = 4 bars = 16 beats, loop-safe |
| Tempo grid | 120 BPM → beat 0.5 s, bar 2.0 s (matches `vo/suno_sponzori.md`) |
| Voice | Paul Broadcaster, ElevenLabs v3 via HeyGen, `cs` (BRIEF decision) |
| Fonts | Montserrat only (600 / 700 / 800 / 900 / 900 italic) |
| Hard rule | **TA CZ logo on its white plate is visible in every frame** (BRIEF) |

> Inputs reconciled. The computed task said "date/place unknown". BRIEF.md has since verified **24.–25. 10. 2026 · Líheň Liběchov (Malý Sporťáček)**. The design still uses the variables `{DATUM}`, `{DATUM_KRATKY}`, `{MISTO}`, with the verified values as defaults. BRIEF also adds an 8th unit, the **venue ad for Líheň Liběchov**, and b-roll from the users' own fishing photos. Both are built in.
> The master runs 75.0 s, at the top of the 60–75 s window. A ≤ 60 s fallback is in §4.1.

---

## 1. Concept and mood

### 1.1 The idea
**The championship is the show; each partner is a Look.**
The film is staged like a fashion show running order: title card, then *LOOK 01 / 08 … LOOK 08 / 08*, then the finale walk, where all looks come back out together, and the designer's signature.
Products are photographed like couture accessories: a lure on a seamless paper sweep, under a strobe, with a chrome glint.
Each sponsor gets one deadpan, oversized word (TROUT/SHOP, JIGY, CENY, BLACK) set the way a Balenciaga title card would set it, and a giant number where the sponsor has one (1 340, 777, 1934, 2011), the way a Nike campaign would.

Mood words: **couture-clean · industrial-precise · strobe-lit · cold navy night with one red thread.**
References: Balenciaga show invites and title cards (oversized deadpan type, hard cuts); Nike campaign stat cards (huge numerals, italic speed); Off-White industrial tape (our kinetic crawls); Jacquemus and Prada lookbooks (single product on seamless, look numbering); Apple product films (light sweeps on metal); Thom Browne's tricolour grosgrain tab (our Czech tricolour tab).

### 1.2 Why it is fashion-grade and still clearly TA CZ
| Fashion device | TA CZ anchor that keeps it ours |
|---|---|
| Oversized deadpan type, stretched | Montserrat 900 uppercase only, the house face. "Condensed" comes from scaleY stretch and frame bleed, never from another family. |
| Look numbering, show notes | "LOOK 03 / 08 · PARTNER MČR 26". Czech copy, Czech VO. |
| Seamless paper sweep and studio sets | The paper is the house light card `#eef2f9`. The stage is house navy `#0b1e42` / `#304285`. |
| One accent colour | House red `#e31e24` is the only accent: the "red thread" runway line, the LOOK number, one word at a time. |
| Strobes, flashes | Heritage: the previous films' "flash on the downbeat", now choreographed rather than constant. |
| Runway floor lights | Heritage: the old **drum-pad step lights**, now 8 runway lights (one per Look). |
| Shutter slats | Heritage: the old **mixer-fader transition**. 8 slats rise like faders and close like a camera shutter. |
| Garment tab | A **tricolour tab** (white / red / navy stripes) stitched to every logo plate. It reads as Czech and as TA. |
| Logo always on | TA horizontal logo on its white plate, fixed in the header, identical in every block and banner. |

### 1.3 What "a level above the previous films" means in practice
The Klonówiec films are dense infographic HUDs with rays, stars, flag bands and `back.out` bounces on everything. RUNWAY keeps their DNA but moves up through restraint:
- **One idea per beat.** At most 5 text elements on screen, against 12+ in the previous films.
- **Physical light instead of ornaments.** Grain, softbox gradients, rim light, chrome sweeps and halation replace stars and rays (rays appear once, as a Troutshop nod).
- **Precise eases.** `power4.out` / `expo` for everything; overshoot is banned except for Moonky's rubber baits, where it is the material.
- **Choreographed strobes.** Flashes now come from the product being "photographed", with a photosensitivity cap, instead of a global flash on every downbeat.
- **Product as hero.** Real packshots, cut out and lit consistently, replace photos used as wallpaper.
- Gold `#ffd36b` (a Klonówiec label colour) is **retired** here. Labels use `#8ea2d8`.

---

## 2. Design tokens

### 2.1 Palette and usage rules
| Token | Hex | Role | Typical frame share |
|---|---|---|---|
| `--ta-void` | `#050d22` | Cold-open black, vignette edge, dark studio base | — |
| `--ta-night` | `#0b1e42` | **Runway.** Main background, navy stage, shutter slats, ink plates, text on light | 50–60 % |
| `--ta-navy` | `#304285` | Secondary planes, monogram ink, podium, chip text on light | 10–20 % |
| `--ta-sky` | `#8ea2d8` | Hairlines, labels on dark, idle floor lights, duotone highlight, MEGA ghost stroke | ≤ 10 % |
| `--ta-card` | `#eef2f9` | **Paper.** Light cyc, chips on dark, paper plates | 0–60 % (light Looks) |
| `--ta-white` | `#ffffff` | TA plate, flash, chrome highlight, text on dark | — |
| `--ta-red` | `#e31e24` | **The one accent.** Red thread, LOOK number, one emphasised word, tape B, RED SET | ≤ 10 % (RED SET Look ≥ 70 %) |
| derived `--ta-red-deep` | `#b5121a` | Bottom stop of red gradients only | — |
| derived `--chrome` | `linear-gradient(115deg,#fff 0%,#8ea2d8 30%,#304285 52%,#eef2f9 70%,#fff 100%)` | Procedural metal (fallback thermos, glyphs) | — |

Rules:
1. **60 / 30 / 10.** Night 60, card + navy 30, red ≤ 10. The one exception is the RED SET Look (Bosset, prizes): the show's "red look".
2. **No more than two red elements at once**, the red tape included.
3. **Sponsor brand colours appear only inside their logo and their own product photos.** They never become UI colour. Products supply the fashion colour; the frame stays TA.
4. Contrast (WCAG, measured):
   | Pair | Ratio | Allowed use |
   |---|---|---|
   | `#ffffff` on `#0b1e42` | 16.4 | Anything |
   | `#eef2f9` / `#0b1e42` | 14.6 | Anything |
   | `#304285` on `#eef2f9` | 8.3 | Anything |
   | `#8ea2d8` on `#0b1e42` | 6.5 | Labels ≥ 24 px |
   | `#ffffff` on `#e31e24` | 4.7 | Text ≥ 24 px bold |
   | `#e31e24` on `#eef2f9` | 4.2 | Display ≥ 48 px only |
   | `#e31e24` on `#0b1e42` | 3.5 | Display ≥ 64 px only (numbers, LOOK digits) |
   | `#8ea2d8` on `#eef2f9` | 2.3 | **Decoration only** |
   | `#304285` on `#0b1e42` | 1.75 | **Decoration only** (monogram) |
5. **Tricolour tab**: 3 vertical stripes, each 8 × 64 px: `#ffffff | #e31e24 | #304285`. On paper plates the white stripe gets a 1 px `rgba(11,30,66,.15)` keyline.

### 2.2 Typography (1080 × 1920, px)
Montserrat only. On disk (`klonowiec-2026/proto/assets/fonts`): 600, 800, 800i, 900, 900i in latin + latin-ext. **Add 700 (latin + latin-ext)** for chips; until then map 700 to 800. Czech needs **latin-ext** (ě š č ř ž ů).

| Role | Weight | Size | Line height | Tracking | Case | Notes |
|---|---|---|---|---|---|---|
| **MEGA** | 900 | fit, 280–440 | 0.82 | −0.045em | UPPER | Wrapper `scaleY(1.18)` stretch; may bleed ≤ 8 % per side; max 2 lines of ≤ 6 chars |
| **DISPLAY** (numbers) | 900 | 150–220 | 0.86 | −0.03em | — | `font-variant-numeric: tabular-nums`; thin space as thousands separator (`1 340`) |
| **HEADLINE** | 900 | 112–150 | 0.9 | −0.02em | UPPER | Finale "DĚKUJEME / SPONZORŮM" |
| **ONE-LINER** | 800 | 64–68 (56 min) | 1.0 | −0.01em | Sentence | ≤ 20 chars/line, max 2 lines |
| **CHIP** (fact) | 700 | 42–46 (38 min) | 1.1 | 0 | Sentence | Single line, ≤ 30 chars (32 hard max) |
| **LOOK no.** | 900 | 44 | 1 | 0.02em | UPPER | Digits red |
| **URL** | 700 | 34 | 1 | 0.04em | lower | Inside the logo plate |
| **LABEL** (show notes) | 600 | 26–30 | 1.2 | 0.30–0.34em | UPPER | ≥ 26 px whenever it carries required info |
| **MICRO** | 600 | 20–22 | 1.2 | 0.24em | UPPER | Decoration only (right rail, swatch codes) |
| **TAPE** | 900 italic | 52 | 1 | 0.02em | UPPER | Speed / Nike nod |

- **Stretch token:** MEGA sits in `.stretch { transform: scaleY(1.18); transform-origin: 50% 100%; }`. Never animate `scale` on the `.stretch` element itself; GSAP would overwrite the stretch. Pump and slam the parent or the chars (see M2).
- **Diacritics guard:** Czech caps with háček or čárka (Ě Š Č Ř Ž Á Í É Ý Ů Ú) rise about 0.22em above cap height. Every masked line box (`overflow:hidden`) gets `padding-top:.24em; margin-top:-.24em`. Must-check words: LIBĚCHOV, DĚKUJEME, SPONZORŮM, VELKÁ, PŘÍVLAČ, SPORŤÁČEK.
- Sizes are fitted at runtime with `window.__hyperframes.fitTextFontSize(text,{maxWidth,fontFamily:'Montserrat',fontWeight:900})` against `maxWidth: 1166` (108 % of the frame) and capped at the table maximum. Fitting happens inside the `document.fonts.ready` build, and the timeline is registered only after it.

### 2.3 Grid and safe zones
Platform UI worst case (IG Reels / TikTok / YT Shorts / FB Reels): top 0–220 (tabs, status), bottom 1440–1920 (caption, audio, CTA), right 940–1080 between y 760 and 1480 (action icons).

```
x: 0   72                                        936  1080
y:0 ┌──────────────────────────────────────────────────┐  BLEED: background / photo only
    │                                                  │
252 ├────┬──────────────────────────────────────┬──────┤  ── SAFE BOX top
264 │    │[TA PLATE 272×100]       [LOOK 03 / 08]│      │  HEADER ROW (fixed in every Look)
364 │    │                                      │      │
392 │    │      [▮ SPONSOR LOGO PLATE 520×170 ]  │ right│  Z1 logo plate (+ URL)
560 │ M  E  G  A    T  Y  P  E  (bleed allowed, │ rail │  Z2 MEGA band 560–1000 (behind product)
600 │    │          ┌── PRODUCT STAGE ──┐        │ (deco│  Z3 stage 600–1180
    │    │          │                   │        │ only)│
1100│════╪══════════╧═ floor · RED THREAD ═╧════╪══════│  floor line y 1100
1180│    │  reflection / contact shadow          │      │
1196│    │ ONE-LINER 64–68 px (≤ 2 lines)        │      │  Z4
1308│    │ [▌CHIP 1 ]                            │      │  Z5a
1388│    │ [▌CHIP 2 ]                            │      │  Z5b
1452├────┴──────────────────────────────────────┴──────┤  ── SAFE BOX bottom
1478│          ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪   runway lights          │  BLEED: decoration only
1530│ ≡≡≡≡ TAPE A (white, navy text, −7°) ≡≡≡≡≡≡≡≡≡≡≡≡ │
1640│ ≡≡≡≡ TAPE B (red, white text, +5°)  ≡≡≡≡≡≡≡≡≡≡≡≡ │
1920└──────────────────────────────────────────────────┘
```
- **Safe box (all required info): x 72–936 (864 w) × y 252–1452 (1200 h).**
- Columns: 6 × 124 px with 24 px gutters inside the 864 px. Rows: 12 × 100 px from y 252. Baseline 8 px.
- **TA plate:** x 72, y 264, 272 × 100, radius 16, white. It has the same pixel position in every Look, banner, intro dock and finale undock, and its z-index is above everything (shutters and iris transitions included).
- **LOOK card:** right-aligned to x 936, y 270–360.
- **Right rail** (x 948–1060, y 520–1400): vertical MICRO text "MISTROVSTVÍ ČR · TROUT AREA · 26 —" in `#8ea2d8` at 50 %. Decoration only; platform icons may cover it.
- Bleed zone (y > 1460): tapes, runway lights, reflections. **Never required info.**

### 2.4 Sets (the "seamless backgrounds")
| Set | Build | Used in |
|---|---|---|
| **LIGHT CYC** | `linear-gradient(180deg,#fff 0%,#eef2f9 58%,#dfe5f1 100%)`; softbox `radial-gradient(60% 30% at 50% 0%,#fff,transparent)`; floor bounce `radial-gradient(50% 12% at 50% 100%,rgba(48,66,133,.10),transparent)` below y 1100 | L02, L04, L06 (top half) |
| **NAVY STAGE** | Heritage `radial-gradient(70% 45% at 50% 52%,#1d3a86 0%,#0b1e42 60%,#050d22 100%)`; spot cone `linear-gradient(180deg,rgba(255,255,255,.16),transparent 70%)` clipped to a trapezoid; floor ellipse highlight under product; vignette | L03, L05, finale |
| **RED SET** | `#e31e24` + `radial-gradient(55% 40% at 50% 45%,#ff4a4f,transparent)` + red-deep floor; navy podium | L07 |
| **DARK STUDIO** | `#050d22` + GH render with radial mask + 25 % navy colour overlay | L08 |
| **PHOTO / ORTHO** | Full-bleed photo, pre-baked duotone or cool grade, `linear-gradient(180deg,transparent 52%,rgba(11,30,66,.85) 78%)` under copy | L01, intro |

Base colour under every set is `#0b1e42`, which is also the shutter colour. A set can therefore "roll on" over navy, and a banner can start and end on navy.

### 2.5 Texture and light
- **Film grain:** `assets/fx/grain.png` (copy from `klonowiec-2026/proto/assets/grain.png`, 256 px tile). `mix-blend-mode: overlay` at 0.22 on dark sets; `soft-light` at 0.18 on paper. Stepped at **12 fps** ("on twos"), deterministically:
  `tl.fromTo('#grain',{backgroundPosition:'0px 0px'},{backgroundPosition:'16608px 9312px',duration:8,ease:'steps(96)'},0)`, which is 96 jumps of (173, 97) px and looks random.
- **Softbox:** a top radial gradient on paper; a spot cone on navy.
- **Rim light** on dark sets: `filter: drop-shadow(0 0 24px rgba(142,162,216,.45))` on product wrappers (static, never animated).
- **Halation** on strobe: product `filter: brightness(1.5)` → 1 over 0.18 s.
- **Anamorphic streak:** `#streak`, a 1080 × 6 px white line blurred 6 px at product centre y. It fires with strobes.
- **Vignette** on dark sets: `radial-gradient(transparent 55%,rgba(5,13,34,.55))`.
- **Red thread:** a 4 px `#e31e24` line across the full width at **y 1100** (floor horizon) in every Look. At hard cuts it reads as one continuous runway. In master mode it is present from t = 0; in banner mode it draws on b2. On the GH studio it sits at 60 % opacity.
- **Monogram canvas:** a procedural SVG pattern tile (180 × 180) with 4 glyphs (spoon, crank, jig, soft bait) plus the letters "T" and "A" (Montserrat 900, 28 px), quincunx offset, rotated 0° / 45°. Ink `#304285` at 35 % on navy; `#8ea2d8` at 10 % on paper. Drift: `backgroundPosition 0 0 → 0 360px` over 8 s, linear, which is exactly 2 tiles and therefore loop-safe. It is the TA "luxury monogram".
- **Not used:** RGB-split glitch, VHS, light leaks from stock. Keep it couture.

### 2.6 Image treatments for heterogeneous product photos
Most problems are solved **at build time** (`scripts/prep_images.py`, PIL + numpy), so runtime CSS stays cheap and deterministic.

**Pipeline**
1. **Cut-out.**
   - Packshots on pure white use a **luma key**. It keeps thin dark hooks, which AI background removal tends to destroy:
     ```python
     a = np.asarray(img.convert('RGB'), np.float32); m = a.min(axis=2)
     alpha = np.clip((250 - m) / (250 - 232), 0, 1)        # soft edge 232–250
     alpha = erode(alpha, 2px); alpha = gaussian(alpha, 0.8)
     ```
   - White objects on white (Moonky `p05_master_c05_white`, the white Velvet Arts back faces) use `npx hyperframes remove-background` instead.
   - Then trim to the bbox, pad 6 %, and resize so the longest side is 1600 px. Never upscale more than 1.5×.
2. **Crops.**
   - Jigovky `p02–p07`: drop the vise (left ~45 %). The LENS move (M7) also frames it out.
   - Velká ryba `p01–p03`: split into **BACK** and **FRONT** faces (two crops) and remove the "BACK/FRONT" labels. These faces feed the SPOON FLIP.
3. **Watermarks.** Troutshop JPGs carry a light "TROUTSHOP.EU" mark. Use the RGBA PNGs `p01 p02 p03 p05` instead (already transparent), and keep JPGs for small multiples only.
4. **Half-transparent panels.** Activefishing `p01 p02 p04` are "white panel on transparent", so luma-key the panel as well.
5. **Normalise.** Auto-levels, contrast +6 %, saturation +8 %, unsharp 0.6 px when the source is < 1000 px.
6. **Metadata to `cutouts.json`.** Per image: bbox, aspect, dominant colour (k-means k = 3 on the alpha region, used for swatches) and a **glint point**: the argmax of luminance after a 6 px blur inside alpha, as normalised x / y. M6 uses it.
7. **B-roll duotones, baked.**
   - **NAVY DUO** gradient map: `#050d22 → #304285 → #8ea2d8`.
   - **RED TRI**: `#0b1e42 → #e31e24 → #ffffff`.
   - Output 1080 × 1920 JPG at q 85. Videos, once delivered, get the same map via `ffmpeg lut3d`.
8. **Logos.** Troutshop `logo.png` is only 408 × 201: display ≤ 300 px wide, or vectorise with potrace (3 layers: black, red, white). All other logos are ≥ 798 px and can be used as they are.

**Runtime treatments (CSS)**
| Treatment | Recipe | Use |
|---|---|---|
| **Seamless hero** | Cut-out + contact shadow `radial-gradient(ellipse, rgba(11,30,66,.35), transparent 70%)` 70 % of product width × 28 px under the object + floor reflection (`scaleY(-1)`, opacity .16, `mask-image: linear-gradient(#000,transparent 40%)`) | All Looks with light or navy sets |
| **Multiply fallback** | Original white-background JPG, `mix-blend-mode: multiply` on paper only | Any cut-out that fails QC |
| **Ink tile** | Cut-out on a white 176 px tile with 8 px radius and a soft shadow (lookbook grid) | Moonky colourways |
| **Lens** (circular mask) | `clip-path: circle()` macro window with a hairline tick ring | Jigovky heads, the Líheň trout, GH top view |
| **Duotone** | Pre-baked NAVY DUO / RED TRI | B-roll, ortho map, flash frames |
| **Masked render** | `mask-image: radial-gradient(ellipse 46% 50% at 50% 55%,#000 60%,transparent 100%)` + `contrast(1.12) brightness(.95)` + 25 % navy colour overlay | GH renders (dark studio backgrounds) |
| **Light sweep** | Overlay `<i class="sweep">` masked by the same cut-out PNG (`mask-size: contain`) | Spoons, jig heads, thermos, GH aluminium |

**Asset map**
| Look | Hero assets | Source background | Treatment |
|---|---|---|---|
| L01 Líheň | `drone/data/orto_scout.jpg`, `assets/libechov/maly_sportacek_photo.jpg` (portrait), `nasazeni_trofejnich_pstruhu.jpg`, `logo.png` (round disc) | Photos | NAVY DUO ortho, cool-graded photo, lens |
| L02 Troutshop | `p01 p02 p03 p05` Velvet Arts Forte (RGBA) | Transparent | Seamless hero, fan |
| L03 Activefishing | `p03 p08` (RGBA), `p04` (panel), `p07 p09` (white) | Mixed | Luma key, rim light |
| L04 Moonky | `p01…p09 *_crop.png` | White | Luma key (p05: AI), ink tiles |
| L05 Jigovky | `p01` (clean), `p02 p03 p04 p05 p07` (vise) | White | Crop + lens; swatch colour from k-means |
| L06 Velká ryba | `p01` front + back faces, `p04 p05 p06 p09` | White | Luma key, flip faces |
| L07 Bosset | **missing** (folder empty) | — | Procedural SVG thermos until packshots arrive |
| L08 Gausse Holler | `p03_revolut8_black_side.jpg` (portrait), `p04_…_top.jpg`, `assets/gausseholler/logo_layer_*.png` | Dark studio | Masked render, rosette spin |
| B-roll | `klonowiec-2026/proto/assets/photos/d1_01…d2_08, aerial.jpg`, `hb-battle-2026/01_RAW/*` | Photos | NAVY DUO / RED TRI flash frames |

### 2.7 Procedural vector lures (SVG, used as motion texture)
All paths are drawn in a 100 × 160 box, filled with `currentColor` (no strokes, so they scale cleanly):
- **SPOON**: `M50 6C78 6 92 40 88 82C84 124 66 154 50 154C34 154 16 124 12 82C8 40 22 6 50 6Z`, with an eyelet `circle(50,18,r4)` cut out via `fill-rule:evenodd`. The split ring and a single barbless hook are a separate path, so they can swing.
- **CRANK**: an ellipse body 70 × 34, a trapezoid lip at the nose, an eye dot, and a single hook under the belly.
- **JIG**: a head `circle r14` plus a hook path with a barbless point (no barb notch).
- **SOFT BAIT**: a rounded 18 × 120 body with 9 rib arcs and a split tail.
- **GEAR** (for the GEAR IRIS): 8 teeth, outer r 50, inner r 34, hub hole r 18. This is a vector echo of the GH ring, so the raster never has to be upscaled.

Uses:
- Monogram canvas (§2.5).
- SPOON IRIS and GEAR IRIS transitions (§3.3).
- Wireframe ghosts behind products on navy (`#8ea2d8` at 8 %, slow rotation).
- Fallback thermos for Bosset: a rounded rectangle body, cap and lid ring filled with `--chrome`.

### 2.8 Logo plates (sponsor)
520 × 170 "woven label". Radius 16. Tricolour tab on the left edge. Logo fit-box 420 × 96 at top centre, URL (34 px / 700) below. Round logos switch to a horizontal layout: disc 132 px plus URL to its right.
| Sponsor | File | Plate |
|---|---|---|
| Líheň Liběchov | `libechov/logo.png` (white disc) | INK `#0b1e42` + 1.5 px `#8ea2d8` 30 % border, round layout |
| Troutshop.eu | `troutshop/logo.png` (≤ 300 px wide) | PAPER `#fff` + keyline |
| Activefishing.cz | `activefishing/logo.png` (orange fish) | INK |
| Moonky | `moonky/logo.png` (white) | INK |
| Jigovky.cz | `jigovky/logo.png` (white, includes "Jigy, které chytají!") | INK |
| Velka-ryba.cz | `velkaryba/logo.png` (navy script, transparent) | PAPER |
| Bosset.cz | TBD | Decide when the logo arrives |
| Gausse Holler | `gausseholler/logo_layer_ring/core/word.png` (ring animates) | INK, round layout |

---

## 3. Motion language

### 3.1 Timing system
- **Grid:** block-local beat `B[n] = (n−1)·0.5 s`, n = 1…16. Bars start at B1 = 0, B5 = 2, B9 = 4, B13 = 6. Off-beats ("&") fall at +0.25.
  `build.mjs` snaps every `B[n]` to the real beat grid from `data/beats.json`: librosa, global time minus block start, maximum correction ±40 ms. If the track is time-stretched to exactly 120.000 BPM, the nominal grid is used.
- **Frame:** 30 fps, so 1 frame = 0.0333 s. A "3-frame" flash is 0.10 s.
- **Ease vocabulary** (only these):
  | Name | Ease | Used for |
  |---|---|---|
  | slam | `power4.out` | Entrances on the kick |
  | snap | `expo.out` | Wipes, plates, iris openings |
  | travel | `expo.inOut` | Catwalk steps, dock / undock, cyc roll |
  | settle | `power3.inOut` | Hero lock, flips |
  | exit | `power3.in` | Everything leaving |
  | glide | `sine.inOut` | Sweeps, Ken Burns, breathing |
  | mechanical | `none` | Tapes, monogram, rings |
  | rubber | `elastic.out(1,0.45)` | **Moonky only** |
- **Durations:** entrances 0.30–0.45 s; wipes 0.22–0.35 s; flashes 0.08–0.10 s; settles 0.5–0.6 s. Nothing important lasts longer than 0.6 s.
- **Code conventions:**
  - Every pulse is `fromTo` with `immediateRender:false`.
  - Discrete changes (pose snaps, split-flap digits, image swaps) use `tl.set`.
  - Initial states are set with `tl.set(…, 0)` or CSS.
  - Element transforms are owned by GSAP: set base rotations with `tl.set`, never mix CSS `transform` with GSAP on the same node.

### 3.2 Ten signature moves
Selectors refer to the block skeleton in §7.3.

**M1 · KICK CUT**: every scene change lands on a kick.
```js
// t = block start (0) or any internal cut on a downbeat
tl.fromTo('#stage',{scale:1.045},{scale:1,duration:.35,ease:'expo.out',immediateRender:false},t);
tl.fromTo('#flash',{opacity:.85},{opacity:0,duration:.10,ease:'power2.out',immediateRender:false},t);
```
At most one per bar. Counts toward the flash budget (§3.5).

**M2 · MEGA SLAM (+ STRETCH PUMP, GHOST)**: the deadpan word.
- DOM: `#mega > .stretch(scaleY 1.18) > .line(overflow:hidden, diacritics pad) > .ch`.
- Slam on B1:
  ```js
  tl.fromTo('#mega .ch',{yPercent:22,scaleY:1.7,opacity:0,filter:'blur(14px)'},
    {yPercent:0,scaleY:1,opacity:1,filter:'blur(0px)',duration:.38,ease:'power4.out',stagger:{each:.022,from:'center'}},B[1]);
  ```
- Pump on B5, B9 and B13:
  ```js
  tl.fromTo('#mega',{scale:1.03},{scale:1,duration:.30,ease:'power3.out',immediateRender:false},t)
  ```
- **GHOST** phase (dark and photo sets, at B5): fill → outline.
  ```js
  tl.fromTo('#mega .ch',{color:'rgba(238,242,249,1)'},{color:'rgba(238,242,249,0)',duration:.30,ease:'power2.out',immediateRender:false},B[5])
  ```
  `-webkit-text-stroke: 2.5px #8ea2d8` is set in CSS from the start.
- Exit in banner mode at 7.50:
  ```js
  tl.to('#mega .ch',{yPercent:-110,duration:.22,ease:'power3.in',stagger:{each:.012,from:'edges'}},7.50)
  ```

**M3 · SET ON (CYC ROLL / SPOT ON)**: the set turns on with the kick.
- **CYC ROLL** (paper and red sets): the paper drops like a studio backdrop.
  ```js
  tl.fromTo('#set',{clipPath:'inset(0% 0% 100% 0%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:.40,ease:'expo.out'},B[1])
  ```
  The roll edge carries a 40 px shadow gradient bar moving with it (`y: 0 → 1920`, same tween values).
- **SPOT ON** (navy and studio sets): a deterministic stage-light flicker.
  ```js
  tl.set('#spot',{opacity:.7},B[1]); tl.set('#spot',{opacity:.15},B[1]+.05); tl.set('#spot',{opacity:1},B[1]+.09)
  ```
- **Red thread** in banner mode:
  ```js
  tl.fromTo('#thread',{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut',transformOrigin:'0% 50%'},B[2])
  ```

**M4 · CATWALK STEP**: products walk the floor line in a move-hold rhythm.
- Products sit in a horizontal strip `#walk`, 360 px apart, standing on y 1100. One step per beat:
  ```js
  tl.to('#walk',{x:x0-k*360,duration:.30,ease:'expo.inOut'},B[n])
  ```
  The remaining 0.20 s of each beat is the hold.
- **Sway:** the arriving item gets `rotation: ±3°`, alternating per step (seeded), plus `y: -6 → 0`, 0.2 s, `power2.out`.
- A strobe (M5) may fire on a hold, but never on consecutive beats.
- The strip contains a duplicate of item 1 at the end, so the final position equals the start (loop-safe).

**M5 · PAPARAZZI STROBE**: the product gets "photographed".
```js
const strobe=(p,t,pose)=>{
  tl.fromTo('#flash',{opacity:.55},{opacity:0,duration:.08,ease:'power2.out',immediateRender:false},t);   // full frame
  tl.fromTo(p+' .bloom',{opacity:.9},{opacity:0,duration:.22,ease:'power2.out',immediateRender:false},t); // local
  tl.fromTo('#streak',{scaleX:0,opacity:1},{scaleX:1,opacity:0,duration:.20,ease:'power2.out',immediateRender:false},t);
  tl.fromTo(p+' img',{filter:'brightness(1.5)'},{filter:'brightness(1)',duration:.18,ease:'power2.out',immediateRender:false},t);
  tl.set(p,pose,t);                                   // stop-motion pose snap, e.g. {rotation:-6,x:-24,scale:1.04}
};
```
Poses come from a seeded table at build time. **Maximum 3 strobes per block.** Full-frame flash opacity never exceeds 0.55 on strobes. Each strobe gets the SFX camera shutter + flash pop.

**M6 · CHROME GLINT (+ SPOON FLIP)**: light runs over the metal.
- **Sweep:**
  - `.sweep` is masked by the product PNG (`mask-image:url(cut.png); mask-size:contain; mask-position:center`).
  - `background: linear-gradient(112deg,transparent 38%,rgba(255,255,255,.95) 50%,transparent 62%) 0 0/300% 100%`.
  - Blend mode `overlay` for coloured lacquer, `screen` for bare metal.
  ```js
  tl.fromTo(p+' .sweep',{backgroundPosition:'120% 0%'},{backgroundPosition:'-40% 0%',duration:.55,ease:'sine.inOut',immediateRender:false},t)
  ```
- **Glint star:** a 4-point SVG star, 64 px, placed at `cutouts.json` glint point.
  ```js
  tl.fromTo(p+' .star',{scale:0,rotation:0},{scale:1.15,rotation:90,duration:.18,ease:'power2.out',immediateRender:false},t);
  tl.fromTo(p+' .star',{scale:1.15,rotation:90},{scale:0,rotation:135,duration:.22,ease:'power2.in',immediateRender:false},t+.18);
  ```
- Glints land on the snare (even beats): at most one per product per bar. SFX: metal shimmer.
- **SPOON FLIP** (fake 3D):
  - Structure: `.flip{transform-style:preserve-3d}` with `.front` and `.back` faces (`backface-visibility:hidden`); `.back` is pre-set to `rotationY:180`.
  ```js
  tl.to(p+' .flip',{rotationY:'+=180',duration:.42,ease:'power3.inOut',transformPerspective:1400},t);
  tl.fromTo(p+' .shade',{opacity:0},{opacity:.55,duration:.21,ease:'sine.in',yoyo:true,repeat:1,immediateRender:false},t);   // edge-on darkening
  ```
  - Single-sided spoons fake the flip with `scaleX: 1 → -1` through 0, with brightness dipping to .4 at the midpoint.

**M7 · LENS**: a circular macro window, the loupe of the show.
- `.lens`: Ø 500–620, centre in the stage; contains the image at 1.3–2.4×.
- Hairline ring: SVG circle with 24 ticks every 15°, `#8ea2d8`, 1.5 px.
  ```js
  tl.fromTo('#lens',{clipPath:'circle(0% at 50% 50%)'},{clipPath:'circle(50% at 50% 50%)',duration:.50,ease:'expo.out'},t);
  tl.fromTo('#lensRing',{rotation:0},{rotation:90,duration:8-t,ease:'none'},t);    // 90° = 6 tick steps → seamless
  tl.fromTo('#lens .img',{x:-20},{x:20,duration:4,ease:'sine.inOut',immediateRender:false},t);
  ```
- Image swaps inside the lens use `tl.set('#lens .img-k',{opacity:1})`. Each swap gets a lens-local bloom (not full-frame, so it does not count as a flash).

**M8 · RUNWAY TAPE**: industrial kinetic crawl.
- Two tapes in the bleed zone, 84 px tall.
  - Tape A: `#eef2f9` background, navy text, centre y 1530, `rotation:-7`, moving left.
  - Tape B: `#e31e24` background, white text, centre y 1640, `rotation:5`, moving right. On the RED SET it becomes navy.
- Text sits in fixed **1080 px cells** (`display:inline-block;width:1080px;white-space:nowrap`), one repetition per cell, fitted inside.
- Speed is one cell per 2 bars, i.e. 270 px/s, so the tape moves exactly 2 cells in 8 s and loops seamlessly.
  ```js
  tl.set('#tapeA',{rotation:-7},0);
  tl.fromTo('#tapeA',{scaleY:0},{scaleY:1,duration:.25,ease:'expo.out'},B[1]);
  tl.fromTo('#tapeA .run',{x:0},{x:-2160,duration:8,ease:'none'},0);
  // kick skew on downbeats B1,B5,B9,B13:
  tl.fromTo('#tapeA .run',{skewX:-14},{skewX:0,duration:.30,ease:'power3.out',immediateRender:false},t);
  ```
- Tape A carries the house line: `MČR TROUT AREA 2026 · KOLEKCE PARTNERŮ · {MISTO} · {DATUM_KRATKY} ·`.
- Tape B carries the sponsor's third fact and keywords (§6). It is the third information surface after the two chips.

**M9 · LOOK CARD (split-flap)**: show notes.
- DOM: `LOOK` (900 / 44, white or navy) + `#lookNum` (900 / 44, red) + `/ 08` (600 / 26) + label `PARTNER · MČR 26` (600 / 26, 0.3em) + `#lookRule` (120 × 3, red).
```js
['07','02','05','08','01',NN].forEach((s,i)=>tl.set('#lookNum',{innerText:s},B[1]+.10+i*.04));   // seeded flap
tl.fromTo('#lookRule',{scaleX:0},{scaleX:1,duration:.40,ease:'power3.inOut',transformOrigin:'0% 50%'},B[1]+.10);
```
Same mechanism (`innerText` with `snap`) as the house counters. SFX: split-flap clicks.

**M10 · RUNWAY LIGHTS (drum-pad heritage)**: the step sequencer, reborn.
- 8 square lights, 20 × 20, 20 px gap, centred at y 1478. Idle: `#8ea2d8` at 25 %.
- On beat n, light `(n−1) mod 8` fires; downbeats fire red:
  ```js
  tl.fromTo('#rl'+i,{backgroundColor:'#ffffff',boxShadow:'0 0 18px rgba(255,255,255,.9)'},
    {backgroundColor:'rgba(142,162,216,.25)',boxShadow:'0 0 0 rgba(0,0,0,0)',duration:.24,ease:'power2.out',immediateRender:false},B[n]);
  ```
- The light with this Look's own index stays red ("you are here" in the show).
- 16 beats ÷ 8 lights = 2 full cycles, so it is loop-safe.

Supporting micro-moves (not signatures, but standard):
| Move | Spec |
|---|---|
| **LABEL WIPE** (logo plate) | `clipPath: inset(0 50% 0 50%) → inset(0)`, 0.35 s `expo.out`; logo `scale 1.08 → 1`, 0.5 s `power3.out`; URL chars `opacity` with stagger 0.012 |
| **TAG WIPE** (chip in) | `clipPath: inset(0 100% 0 0) → inset(0)`, 0.32 s `expo.out`; text `yPercent 100 → 0`, 0.30 s `power3.out` at +0.04 |
| TAG out | `inset(0) → inset(0 0 0 100%)`, 0.22 s `power3.in` |
| **LINE RISE** (one-liner) | Words `yPercent 105 → 0`, 0.40 s `power4.out`, stagger 0.05 |
| **PRODUCT RISE** | `y +140, opacity 0, blur 10 → 0`, 0.40 s `power4.out` |
| **COUNTER** | `innerText 0 → N`, `snap:{innerText:10}`, 0.9 s `power2.out`; formatting with thin space happens in `onUpdate` |
| **HERO LOCK** | Every product settles to its final pose over 0.6 s `power3.inOut` at B13; nothing that must be read moves after 6.6 s |

### 3.3 Transitions
| Name | Where | Spec |
|---|---|---|
| **KICK CUT + B-ROLL FLASH FRAME** | Between all Looks (master) | Outgoing block at 7.75: `#broll` (RED TRI still) `opacity 1` for 3 frames, then `0`. Hard cut at 8.00 (clip boundary). Incoming M1 flash at 0.00. SFX: reverse-whoosh tail into the cut + sub impact. |
| **SHUTTER (fader shutter)** | Banner in/out | 8 slats, each 135 × 1920, `#0b1e42`; odd slats hinge from top, even from bottom. **Open** at 0.00: `scaleY 1 → 0`, 0.30 s `expo.out`, stagger 0.018 from centre. **Close** at 7.70: `scaleY 0 → 1`, 0.24 s `power3.in`, seeded per-slat delay 0–0.03 (they arrive like faders), fully closed by 7.97. TA plate stays on top. |
| **SPOON IRIS** | Intro → L01 (host, 3.70–4.40) | A red procedural spoon flies at camera: `scale .1 → 9`, `rotation -30 → 0`, 0.30 s `power3.in`, covering the frame at 4.00. Its eyelet then opens as an iris onto L01: overlay `mask-image: radial-gradient(circle at 50% 50%, transparent var(--r), #000 calc(var(--r) + 1px))`, `--r: 0 → 1200px`, 0.40 s `expo.out`. Lives on the host fx track **below** the host TA plate. |
| **GEAR IRIS** | L08 → finale (host, 67.60–68.40) | Same mechanism with the procedural 8-tooth GEAR in `#0b1e42`. Gear rotates 0 → 45° while it scales 0.2 → 10 (0.40 s `power3.in`); the hub hole opens onto the finale (`--r: 0 → 1200px`, 0.40 s `expo.out`). The film's author mark becomes the door to the finale. |
| **TA DOCK / UNDOCK** | Intro end, finale | FLIP via transform only. The plate is authored at hero size (840 × 309: logo 760 × 249 + 40 / 30 px padding, radius 49) and docked with `x:72, y:264, scale:.3238` (gives exactly 272 × 100, radius 16). Hero position: `x:120, y:690, scale:1`. Dock: 3.50 → 3.95, `expo.inOut`. Undock: 72.00 → 72.55, `expo.inOut`. Blocks render the same plate statically with the docked transform, so it is pixel-identical. |

### 3.4 Standalone-banner contract
Each Look sub-composition declares a `mode` variable. Scripts read it once at init.
| Mode | In | Out | Loops | Use |
|---|---|---|---|---|
| `master` | Hard cut + M1 flash; red thread pre-drawn; no shutter; block TA plate hidden (`showTA:false`, the host draws it) | B-roll flash frame at 7.75 then hard cut | — | Inside the 75 s film |
| `loop` (default) | Shutter opens 0.00–0.30 over navy + TA plate | Exits 7.50–7.72, shutter closed by 7.97 | **Yes**: frame 0 = frame 240 (navy + TA plate) | Stories / Reels ads, web sidebars, LED screens |
| `hold` | As `loop` | No exit, no shutter. Poster frame holds 7.0–8.0 | No | Placements that stop on the last frame |

Readability guarantees, all muted:
| Time | On screen |
|---|---|
| ≤ 0.30 s | First readable frame: MEGA word + TA plate |
| 1.0 s | Sponsor logo + URL; they stay on to the end, so ≥ 6.5 s |
| 2.0–2.4 s | One-liner, on screen ≥ 5 s |
| 4.0 / 5.0 s | Chips 1 / 2, each on screen ≥ 2.5 s |
| 7.00 s | **Poster frame**: everything on screen, nothing moving except tapes, grain, lights and rings. Exported as PNG for static banners. |

Loop math (all integer cycles within 8 s): tapes 2 cells; monogram 2 tiles; runway lights 2 cycles; lens ring 90° (6 tick steps); GH ring 360°; grain is irrelevant.

Banner audio: music slice of the Look's 4 bars (or the 4-bar loop stem) + block VO + block SFX. Fades: 20 ms in, 120 ms out. −14 LUFS.

### 3.5 Guardrails (photosensitivity and readability)
- **≤ 3 flashes in any 1 s window**, counting the full-frame white flash, the b-roll flash frame and any full-frame red change. `build.mjs` asserts this (§7.6).
- Full-frame flash peak opacity: 0.85 on kick cuts, 0.55 on strobes, 0.6 on the finale stab.
- Lens-local and plate-local blooms are not full-frame and are exempt, but stay ≤ 4 per second.
- Text that must be read never moves faster than a 0.6 s settle and never overlaps another text layer. Tapes are always redundant information.
- The TA plate has 100 % opacity in every frame, sits inside the safe box and is never covered. In the master it is on the top track; in banners it is the top layer of the block.

---

## 4. Storyboard

### 4.1 Master running order (75.0 s)
Proposed order (TBD by the user; the system is order-agnostic and LOOK numbers come from the order in `sponsors.json`):

| # | Segment | Set | Master in–out | Bars | Transition in |
|---|---|---|---|---|---|
| 0 | **INTRO**: championship title card | VOID → NAVY | 0.00–4.00 | 1–2 | — |
| L01 | **Líheň Liběchov** (venue / místo konání) | ORTHO → PHOTO | 4.00–12.00 | 3–6 | SPOON IRIS |
| L02 | **Troutshop.eu** | LIGHT CYC | 12.00–20.00 | 7–10 | Kick cut + flash frame |
| L03 | **Activefishing.cz** | NAVY STAGE | 20.00–28.00 | 11–14 | Kick cut |
| L04 | **Moonky** | LIGHT CYC | 28.00–36.00 | 15–18 | Kick cut |
| L05 | **Jigovky.cz** | NAVY STAGE | 36.00–44.00 | 19–22 | Kick cut |
| L06 | **Velka-ryba.cz** | LIGHT / NAVY DIPTYCH | 44.00–52.00 | 23–26 | Kick cut |
| L07 | **Bosset.cz** (prizes) | RED SET | 52.00–60.00 | 27–30 | Kick cut |
| L08 | **Gausse Holler** | DARK STUDIO | 60.00–68.00 | 31–34 | Kick cut |
| F | **FINALE**: logo wall, Děkujeme sponzorům, TA, GH mark | NAVY + MONOGRAM | 68.00–75.00 | 35–38½ | GEAR IRIS |

Why this order:
- The venue sets the scene first.
- Light and dark sets alternate like runway looks.
- The two spoon retailers (L02 / L06) are separated.
- Prizes (the RED look) come as the climax.
- GH closes because GH is also the film's author: L08 hands straight into the GEAR IRIS and the final "MADE BY" mark.

≤ 60 s fallback: cut each Look to 3 bars (6 s: identity, product, hero lock, with facts carried on tape B only). That gives 4 + 8 × 6 + 7 = 59 s. Banners stay 8 s.

### 4.2 INTRO: "MČR" title card (0.00–4.00, bars 1–2)
| Beat | t | Picture / motion | Text | SFX / music |
|---|---|---|---|---|
| b1 | 0.00 | `#050d22` void + grain. B-roll flash frame #1 (`d1_10` RED TRI, 3 frames). **MEGA "MČR"** (white, ≈ 440 px, stretch) slams centre (M2). Host **TA plate is already visible, docked in the header, from frame 0** (BRIEF rule: logo always on) | MČR | Filtered kick + sub hit, flash pop |
| b2 | 0.50 | B-roll flash frame #2 (`d2_03` NAVY DUO, 3 frames); MEGA pump | — | Camera shutter |
| b3 | 1.00 | **TA UNDOCK-SLAM**: the header plate jumps to hero centre (840 × 309 at y 690–999) in 0.40 s `power4.out`, overshooting to `scale 1.06` and settling to 1 over 0.25 s `power3.out`, + M1 flash. MEGA "MČR" goes **GHOST** (outline) behind | (TA logo) | Impact + riser starts |
| b4 | 1.50 | Label types under the plate (char stagger 0.015) | MISTROVSTVÍ ČESKÉ REPUBLIKY | Tick |
| b5 | 2.00 | **"2026"** DISPLAY red, 220 px, slams at y 1180–1400; runway lights begin; monogram fades in | 2026 | Kick |
| b6 | 2.50 | Label in `#8ea2d8` | {DATUM} · {MISTO} → 24.–25. 10. 2026 · LÍHEŇ LIBĚCHOV | — |
| b7 | 3.00 | Chip (ink) with tricolour tab; tapes A/B scale in | KOLEKCE PARTNERŮ | Snare roll |
| b8 | 3.50 | **TA DOCK** (3.50–3.95) to the header; all other intro elements exit (`yPercent -110`, 0.25 s `power3.in`, stagger 0.03); **SPOON IRIS** cover 3.70 → 4.00 | — | Reverse cymbal into 4.00 |
| — | 4.00 | Iris opens onto L01 (4.00–4.40); **DROP** | — | Crash + sub |

VO 0.25–3.70: "Mistrovství České republiky v Trout Area 2026."

### 4.3 Generic LOOK template (block-local; master time = block start + t)
| Beat | t | Picture / motion | Text |
|---|---|---|---|
| b1 | 0.00 | **KICK.** SET ON (M3); **MEGA SLAM** (M2); LOOK card flap (M9); tapes in (M8); lights start (M10). Banner: shutter opens 0.00–0.30 | MEGA word, LOOK NN / 08 |
| — | 0.40 | **VO starts** (window ends ≤ 7.30) | — |
| b2 | 0.50 | Red thread draws (banner); monogram fades in 0 → 1, 0.5 s | — |
| b3 | 1.00 | **Logo plate** LABEL WIPE + URL | Logo, URL |
| b4 | 1.50 | **Product #1** PRODUCT RISE + **STROBE #1** | — |
| b5 | 2.00 | Bar 2: **one-liner** LINE RISE; MEGA pump (+ GHOST on dark sets) | One-liner |
| b6 | 2.50 | CHROME GLINT #1 | — |
| b7 | 3.00 | Product #2 / #3 (fan / catwalk / grid) + **STROBE #2** | — |
| b8 | 3.50 | Glint star / sponsor accent | — |
| b9 | 4.00 | Bar 3: **CHIP 1** TAG WIPE; MEGA pump; b-roll flash frame (3 frames) unless noted | Fact 1 |
| b10 | 4.50 | Sponsor-specific (lens / counter / flip) | — |
| b11 | 5.00 | **CHIP 2** | Fact 2 |
| b12 | 5.50 | Glint #2 | — |
| b13 | 6.00 | Bar 4: **HERO LOCK**; MEGA pump; optional STROBE #3 at b14 | — |
| b14 | 6.50 | Glint star finale | — |
| b15 | 7.00 | **POSTER FRAME** | All |
| b16 | 7.50 | `loop`: exits 7.50–7.72, shutter 7.70–7.97. `master`: b-roll flash frame 7.75 → cut 8.00. `hold`: nothing | — |

Each Look below lists only the **specific** content per beat. Anything not listed follows the template.

### 4.4 L01 · LÍHEŇ LIBĚCHOV: "Místo konání" (master 4.00–12.00) · ORTHO → PHOTO
| Beat | t | Master | Picture / motion | Text | SFX |
|---|---|---|---|---|---|
| b1 | 0.00 | 4.00 | Revealed by SPOON IRIS. **ORTHO set**: `orto_scout.jpg` NAVY DUO, `scale 1`, transform-origin at Malý Sporťáček (≈ 0.45 / 0.34 of the image, **confirm with `user_map_arrow.jpg`**). MEGA **"LIBĚ / CHOV"** white, 2 lines | LIBĚCHOV · LOOK 01 / 08 · MÍSTO KONÁNÍ | Iris whoosh + impact |
| b2 | 0.50 | 4.50 | **ORTHO PUSH** `scale 1 → 2.6`, 0.50 → 3.50, `power2.inOut` (camera dive) | — | Air swell |
| b3 | 1.00 | 5.00 | Logo plate INK, round layout (Líheň disc + URL) | lihenlibechov.cz | Tick |
| b4 | 1.50 | 5.50 | **PIN**: red crosshair (circle r 34 + 4 ticks, stroke 4 px) draws `strokeDashoffset 1 → 0` 0.40 s; label types next to it | MALÝ SPORŤÁČEK · {GPS} | Sonar ping (A5) |
| b5 | 2.00 | 6.00 | **Internal KICK CUT** to PHOTO `maly_sportacek_photo.jpg` (portrait, cool grade, bottom navy gradient; push `1.06 → 1` over 6 s `sine.inOut`). MEGA → GHOST. One-liner | Dějiště MČR 2026 | Shutter + kick |
| b6 | 2.50 | 6.50 | Soft diagonal light band crosses the photo (white at .25, 0.8 s `sine.inOut`) | — | — |
| b7 | 3.00 | 7.00 | **DISPLAY "1934"** split-flaps in (white, 200 px, at x 72 / y 900) + label above it | PSTRUŽÍ LÍHEŇ OD ROKU · 1934 | Flap clicks |
| b9 | 4.00 | 8.00 | **LENS** Ø 520 opens (centre 600, 820) on `nasazeni_trofejnich_pstruhu.jpg` (trout in net) at 1.3×. **Chip 1**. No b-roll flash here (the venue is its own photo) | Malý Sporťáček · 24.–25. 10. | Water "plip" + shimmer |
| b11 | 5.00 | 9.00 | **Chip 2** | Boží Voda 289, Liběchov | Tick |
| b13 | 6.00 | 10.00 | HERO LOCK: lens settles; "1934" pumps | — | Soft impact |
| b15 | 7.00 | 11.00 | Poster | — | — |

Tape B: `164 M N. M. · DONEDÁVNA NEJNÍŽE POLOŽENÉ PSTRUHAŘSTVÍ V EVROPĚ · PRAMEN BOŽÍ VODA · LIHENLIBECHOV.CZ ·` ("donedávna" is mandatory, per the research verification.)

### 4.5 L02 · TROUTSHOP.EU: "Color story" (master 12.00–20.00) · LIGHT CYC
| Beat | t | Master | Picture / motion | Text | SFX |
|---|---|---|---|---|---|
| b1 | 0.00 | 12.00 | CYC ROLL; MEGA **"TROUT / SHOP"** navy solid | TROUTSHOP · LOOK 02 / 08 | Paper roll + sub |
| b2 | 0.50 | 12.50 | Heritage **red rays** (`repeating-conic-gradient`, opacity .10) behind the stage, rotation 0 → 15° over 7.5 s `none`. A nod to the "rising sun" in Troutshop's logo and to the previous films | — | — |
| b3 | 1.00 | 13.00 | Logo plate PAPER (logo ≤ 300 px) | troutshop.eu | Tick |
| b4 | 1.50 | 13.50 | **Spoon 1** (`p01` Forte 2,1 g Glow Pink) drops on its split ring: `y -700 → 0` 0.45 s `power4.out`; swing `rotation 7 → -2` (0.35 s) `→ 0` (0.35 s `sine.inOut`); STROBE #1 | — | Metal ting + shutter |
| b5 | 2.00 | 14.00 | **FAN** step 1: `p02` (Yellow-Red) slides from behind to −9°, pivot `transformOrigin:'50% 6%'`, 0.30 s `expo.out`. One-liner. STROBE #2 | Milujeme lov pstruhů | Tinkle A5 |
| b6 | 2.50 | 14.50 | `p03` (Glow Gold) to +9°; GLINT on spoon 1 | — | Tinkle C6 + shimmer |
| b7 | 3.00 | 15.00 | `p05` (Mustard Gold) to +27°, `p02` on to −27°. Final fan [−27, −9, 9, 27] | — | Tinkle E6 |
| b8 | 3.50 | 15.50 | GLINT sweep across all 4, stagger 0.08; star on `p03` | — | Shimmer |
| b9 | 4.00 | 16.00 | **Chip 1**; b-roll flash (`d1_10` NAVY DUO) | Rodinná firma od roku 1999 | Flash pop |
| b10 | 4.50 | 16.50 | Fan breath: rotations × 1.06 and back, 0.5 s `sine.inOut` yoyo once | — | — |
| b11 | 5.00 | 17.00 | **Chip 2** | Generální partner TA Slovakia | Tick |
| b13 | 6.00 | 18.00 | HERO LOCK: fan closes to [−20, −7, 7, 20], `y -16`, 0.6 s `power3.inOut`; STROBE #3 at b14 | — | Soft whoosh |
| b14 | 6.50 | 18.50 | Star on spoon 1 | — | Shimmer |

Tape B: `THE TROUT FISHING SPECIALIST · NORIES · FOREST · VANFOOK · VELVET ARTS · TROUTSHOP.EU ·`

### 4.6 L03 · ACTIVEFISHING.CZ: "By the numbers" (master 20.00–28.00) · NAVY STAGE
| Beat | t | Master | Picture / motion | Text | SFX |
|---|---|---|---|---|---|
| b1 | 0.00 | 20.00 | SPOT ON; MEGA **"ACTIVE / FISHING"** white | ACTIVEFISHING · LOOK 03 / 08 | Stage-light clunk + sub |
| b3 | 1.00 | 21.00 | Logo plate INK (orange fish) | activefishing.cz | Tick |
| b4 | 1.50 | 21.50 | **CATWALK STEP** begins: strip enters from the right; `p03` Timon Rhomy arrives at centre; STROBE #1; rim light | — | Heel click + shutter |
| b5 | 2.00 | 22.00 | Step → `p08` Micro PaniCra (crank). One-liner. MEGA → GHOST | Pro všechny, kdo milují přívlač | Heel click |
| b6 | 2.50 | 22.50 | Step → `p04` Khor Frea; STROBE #2 | — | Heel + shutter |
| b7 | 3.00 | 23.00 | Step → `p07` Chibi Futten | — | Heel |
| b8 | 3.50 | 23.50 | Step → `p09` Lucky Craft WAH 33F; glint | — | Heel + shimmer |
| b9 | 4.00 | 24.00 | MEGA ghost exits up; **COUNTER "1 340"** DISPLAY 200 px at y 560–780 counts up (0.9 s) + label PLANDAVEK. Products shrink to 0.8 on the floor and keep stepping. **Chip 1**; b-roll flash | 1 340 PLANDAVEK · Přední japonské značky | Counter ticks → ding |
| b11 | 5.00 | 25.00 | Counter **split-flaps to "777"** + label WOBLERŮ. **Chip 2** | 777 WOBLERŮ · Rychlé doručení, osobní přístup | Flap |
| b13 | 6.00 | 26.00 | HERO LOCK: catwalk stops on `p03` (duplicate at strip end); DISPLAY stacks to two lines, 150 px each: "1 340+ PLANDAVEK / 777 WOBLERŮ"; STROBE #3 at b14 | — | Soft impact |

Tape B: `RYCHLOST DORUČENÍ · UNIKÁTNÍ SORTIMENT · OSOBNÍ PŘÍSTUP · VARIVAS · NORIES · TIMON · ACTIVEFISHING.CZ ·`
Note: 1 340 / 777 are counts as of 19. 10. 2026. Re-verify on export day, or show "1 300+".

### 4.7 L04 · MOONKY: "Atelier colorways" (master 28.00–36.00) · LIGHT CYC
| Beat | t | Master | Picture / motion | Text | SFX |
|---|---|---|---|---|---|
| b1 | 0.00 | 28.00 | CYC ROLL; MEGA **"MOONKY"** navy (1 line) + label under it | MOONKY · HANDMADE LURES · LOOK 04 / 08 | Paper roll + sub |
| b3 | 1.00 | 29.00 | Logo plate INK (white Moonky logo) | moonky.cz | Tick |
| b4 | 1.50 | 29.50 | **COLORWAYS GRID 3 × 3**: ink tiles 176 px, gap 16, grid 560 × 560 centred at y 600–1160. Baits pop with **RUBBER**: `scaleX 1.35, scaleY .7, opacity 0 → 1, 1, 1`, 0.6 s `elastic.out(1,.45)`, `stagger:{each:.09,grid:[3,3],from:'start'}`. Order: C01 Scelet pink, C02 Coccon orange, C04 Coccon Jr black, C05 Master white, C06 Savory green, C08 Scelet Jr coffee, DC03 Savory, DC04 Coccon, C01 Savory pink. MICRO codes under the tiles | C01 … DC04 (decoration) | 9 rubber squeaks, pentatonic A minor |
| b5 | 2.00 | 30.00 | One-liner (2 lines) | Ručně dělané gumové nástrahy | — |
| b7 | 3.00 | 31.00 | STROBE #1 + **SQUISH**: all baits `scaleY .9 → 1`, 0.5 s rubber (the rubber reacts to the flash) | — | Shutter + squish |
| b9 | 4.00 | 32.00 | **GRID → HERO**: 8 tiles exit (`scale 0`, 0.30 s `power3.in`, stagger 0.03 from centre); the centre tile (DC03 two-tone) scales to 2.4×, 0.5 s `expo.inOut`, and its tile background fades, leaving the bait on paper with a contact shadow. **Chip 1**; b-roll flash | Vlastní formy z CNC strojů | Whoosh + flash pop |
| b10 | 4.50 | 32.50 | Hero wobble: `rotation -4 ↔ 4`, 1.0 s `sine.inOut`, yoyo, `repeat:2` (ends 7.50) | — | — |
| b11 | 5.00 | 33.00 | **Chip 2** | 8 let s reprezentací ČR | Tick |
| b13 | 6.00 | 34.00 | HERO LOCK; **woven label** chip "HANDMADE · CZ" (ink, 2 px dashed `#8ea2d8` inner stitch, tricolour tab) pops at the hero's right shoulder with rubber | HANDMADE · CZ | Sewing-machine stitch (0.4 s) |
| b14 | 6.50 | 34.50 | STROBE #2 + squish | — | Shutter |

Tape B: `GUMA BEZ FTALÁTŮ · BANANA · CHEESE · OLIHEŇ · SAVORY · SCELET · COCCON · MOONKY.CZ ·`

### 4.8 L05 · JIGOVKY.CZ: "Macro swatches" (master 36.00–44.00) · NAVY STAGE
Custom layout: lens Ø 500 centred (540, 820) → y 570–1070; swatch strip y 1090–1270; one-liner (56 px) y 1290–1350; one chip at a time y 1366–1452.
| Beat | t | Master | Picture / motion | Text | SFX |
|---|---|---|---|---|---|
| b1 | 0.00 | 36.00 | SPOT ON; MEGA **"JIGY"** white (≈ 400 px) behind the lens area | JIGY · LOOK 05 / 08 | Clunk + sub |
| b3 | 1.00 | 37.00 | Logo plate INK (white logo with its slogan) | jigovky.cz | Tick |
| b4 | 1.50 | 37.50 | **LENS** opens on `p04` Tungsten H 360 BL **GOLD** 0,4 g at 2.2× (the vise stays outside the circle); ring ticks; GLINT across the head | — | Lens focus servo |
| b5 | 2.00 | 38.00 | MEGA → GHOST. **SWATCH STRIP** in 8ths: 2.00 / 2.25 / 2.50 / 2.75 / 3.00. Cards 150 × 180: colour block 150 × 120 from k-means, label 800 / 24, weight 600 / 20. Wipe `inset(100% 0 0 0) → inset(0)`, 0.22 s `expo.out`. Each card swaps the lens image (`tl.set`) with a lens-local bloom; a red 150 × 4 indicator jumps under the active card | FLUO 0,4 g · PINK 0,4 g · GOLD 0,4 g · ORANGE 0,4 g · RED 1,3 g | 5 pitched tungsten ticks |
| b6 | 2.50 | 38.50 | One-liner | Jigy, které chytají! | — |
| b8 | 3.50 | 39.50 | Lens holds RED; glint star | — | Shimmer |
| b9 | 4.00 | 40.00 | **LENS ZOOM-OUT** `2.2 → 1.0`, 0.6 s `power3.inOut`; image swaps on the flash to `p01` TroutJig Barbless (clean packshot, full hook). **BARBLESS callout**: hairline from the hook point to its label (SVG draw 0.35 s). **Chip 1**; b-roll flash | Největší výběr jigových hlaviček · BEZ PROTIHROTU | Zoom whoosh + flash pop |
| b11 | 5.00 | 41.00 | **Chip 2** replaces chip 1 (one chip at a time in this layout) | TroutJig Barbless 0,4–3 g | Tick |
| b13 | 6.00 | 42.00 | HERO LOCK: internal kick cut back to GOLD macro at 1.6×; GOLD swatch active | — | Kick |
| b14 | 6.50 | 42.50 | Glint + star on the gold head | — | Shimmer |

Tape B: `POCTIVĚ VYROBENO V ČR · HD BARBLESS · TUNGSTEN H 360 BL · ROTAČKY · JIGOVKY.CZ ·`

### 4.9 L06 · VELKA-RYBA.CZ: "Diptych" (master 44.00–52.00) · LIGHT / NAVY
Layout: paper y 0–1180; navy panel y 1180–1920. Copy sits in the navy panel and is white; chips use the light style.
| Beat | t | Master | Picture / motion | Text | SFX |
|---|---|---|---|---|---|
| b1 | 0.00 | 44.00 | CYC ROLL (paper down) and **NAVY PANEL ROLL** (`clipPath inset(100% 0 0 0) → inset(0)`, 0.45 s `expo.inOut`) together; MEGA **"VELKÁ / RYBA"** navy on paper | VELKÁ RYBA · LOOK 06 / 08 | Paper + panel slide |
| b3 | 1.00 | 45.00 | Logo plate PAPER (navy script; its tagline is part of the logo) | velka-ryba.cz | Tick |
| b4 | 1.50 | 45.50 | **Hero spoon** Shimano Cardiff Roll Swimmer CE 4,5 g, FRONT face (`p01` orange): drop `y -600 → 0` 0.45 s `power4.out`; STROBE #1 | — | Shutter |
| b5 | 2.00 | 46.00 | One-liner (white, in the panel) | Vše na přívlač | — |
| b6 | 2.50 | 46.50 | **SPOON FLIP** → BACK (gold) 0.42 s + edge shade; glint at 2.95 | — | Whip "shing" |
| b7 | 3.00 | 47.00 | **CATWALK STEP**: `p04` Presso Manhattan, `p05` Illex Pink Yamame, `p06` Copper Trout and `p09` Presso Flashing Green enter on the paper floor in 2 steps (b7, b8) and flank the hero at scale 0.55 | — | Heel clicks |
| b8 | 3.50 | 47.50 | STROBE #2 | — | Shutter |
| b9 | 4.00 | 48.00 | **DISPLAY "2011"** red, 180 px, slams in the panel (left) with label above; **Chip 1** (right / below); b-roll flash | OD ROKU 2011 · E-shop i prodejna v Olomouci | Impact |
| b10 | 4.50 | 48.50 | FLIP → FRONT; glint | — | Shing |
| b11 | 5.00 | 49.00 | **Chip 2** | Přes 30 let u vody | Tick |
| b13 | 6.00 | 50.00 | HERO LOCK: flanking spoons settle; hero holds FRONT; star | — | Shimmer |

Tape B: `SHIMANO ROD TEST CENTER · PRUTY SHIMANO NA ZKOUŠKU U VODY · CARDIFF · PRESSO · ILLEX · VELKA-RYBA.CZ ·`

### 4.10 L07 · BOSSET.CZ: "Ceny" (master 52.00–60.00) · RED SET. **Assets pending**
| Beat | t | Master | Picture / motion | Text | SFX |
|---|---|---|---|---|---|
| b1 | 0.00 | 52.00 | **RED CYC ROLL**; MEGA **"CENY"** white (≈ 400 px); tape B switches to navy | CENY · LOOK 07 / 08 · CENY PRO VÍTĚZE | Paper roll + big sub |
| b3 | 1.00 | 53.00 | Logo plate (TBD) | bosset.cz | Tick |
| b4 | 1.50 | 53.50 | **PODIUM** rises: 3 navy blocks 220 px wide, heights 230 / 170 / 120, numbers 1 2 3 (900 / 72, white). `scaleY 0 → 1` (origin bottom), 0.40 s `power4.out`, stagger 0.08 (centre first) | 1 · 2 · 3 | 3 thuds |
| b5 | 2.00 | 54.00 | **THERMOSES** drop onto the steps (largest on 1st; sizes per available packshots): `y -800 → 0` 0.32 s `power3.in`, then land squash `scaleY .94, scaleX 1.04 → 1` 0.18 s `power2.out`, stagger 0.12. STROBE #1 on the 1st landing. One-liner | Termosky pro vítěze | Steel clinks |
| b6 | 2.50 | 54.50 | **TURNTABLE** illusion on the 1st-place thermos: vertical specular band masked to the body slides L → R (0.9 s `sine.inOut`); 3 SVG steam wisps draw (`strokeDashoffset`, 1.2 s) | — | Lid twist + pop, hiss |
| b7 | 3.00 | 55.00 | STROBE #2 (no pose snap, just halation) | — | Shutter |
| b9 | 4.00 | 56.00 | **Chip 1**; b-roll flash (`d1_02` ceremony, NAVY DUO); MEGA pump | {BOSSET_FAKT1} | Flash pop |
| b10 | 4.50 | 56.50 | Turntable band repeats | — | — |
| b11 | 5.00 | 57.00 | **Chip 2** | Objem 0,5–0,7 l | Tick |
| b13 | 6.00 | 58.00 | HERO LOCK: 1st-place thermos `scale 1.06` (0.6 s `power3.inOut`); star on its lid | — | Short crowd cheer (−22 dB) |

Tape B (navy on the red set): `{BOSSET_FAKT2} · {BOSSET_FAKT3} · BOSSET.CZ ·`
Fallback until packshots arrive: the procedural chrome thermos (§2.7), never shipped in a final.

### 4.11 L08 · GAUSSE HOLLER: "Spec sheet" (master 60.00–68.00) · DARK STUDIO
| Beat | t | Master | Picture / motion | Text | SFX |
|---|---|---|---|---|---|
| b1 | 0.00 | 60.00 | SPOT ON (studio); MEGA **"BLACK"** white + label under it | BLACK · STANDARD EDITION · LOOK 08 / 08 | Studio clunk + sub |
| b3 | 1.00 | 61.00 | Logo plate INK, round layout: GH layered logo. **Ring rotates 0 → 360° over the block** (`none`, loop-safe); core and wordmark static | gausseholler.com | Ratchet ticks on beats (−24 dB) |
| b4 | 1.50 | 61.50 | **Hero render** `p03_revolut8_black_side.jpg` rises (`y +120, opacity 0 → 0, 1`, 0.5 s `power4.out`) into the masked studio; LIGHT SWEEP over the carbon tubes (full-image overlay band, 0.7 s) | — | Carbon "thock" |
| b5 | 2.00 | 62.00 | MEGA → GHOST; one-liner; **CALLOUT 1**: hairline (2 px `#8ea2d8`, end dots r 5) draws 0.35 s `power2.inOut`, label chars stagger 0.015. Anchors are normalised points stored in `sponsors.json` | Ručně stavěno v Česku · 8× KARBON · Ø 32 MM | Ping (A5) |
| b6 | 2.50 | 62.50 | **CALLOUT 2** | HLINÍK · ELOX | Ping (C6) |
| b7 | 3.00 | 63.00 | **CALLOUT 3**; STROBE #1 | REVOLUT 8 | Ping (E6) + shutter |
| b8 | 3.50 | 63.50 | Sweep again | — | Shimmer |
| b9 | 4.00 | 64.00 | **Internal KICK CUT** → LENS Ø 620 with the **top view** `p04`: **ROSETTE SPIN** 0 → 45° over 4.0 s `power1.inOut` (8 arms, so the end pose matches the start). **Chip 1**. No b-roll flash (product purity) | 8 karbonových tubusů | Gear whirr |
| b11 | 5.00 | 65.00 | **Chip 2** | Série 5 kusů, každý číslovaný | Tick |
| b13 | 6.00 | 66.00 | **Internal KICK CUT** back to the side-view hero; final sweep; callouts hidden | — | Kick |
| b14 | 6.50 | 66.50 | Glint star on the orange GH logo on the stand's handle | — | Shimmer |
| b16 | 7.50 | 67.50 | `master`: **GEAR IRIS** cover 67.60 → 68.00 (host) | — | Ratchet roll into the cut |

Tape B: `HAND-BUILT IN CZECHIA · CARBON · ALUMINIUM · REVOLUT 8 · SHIPS ACROSS THE EU · GAUSSEHOLLER.COM ·`
Optional: a 2-bar muted slice of `v01_revolut8_standard_reel.mp4` inside the lens instead of the still. It has burned-in titles, so crop to the product area only.

### 4.12 FINALE (master 68.00–75.00, finale-local t)
| t | Master | Picture / motion | Text | SFX / music |
|---|---|---|---|---|
| 0.00 | 68.00 | GEAR IRIS opens (68.00–68.40) on NAVY STAGE + monogram. **LOGO WALL**: 8 plates (2 columns × 4 rows; columns x 72–492 / 516–936, rows y 520–1340, plates 420 × 190). Each slams on an 8th note 0.00…1.75 in Z order: `rotationX 60 → 0, scale 1.12 → 1, blur 6 → 0`, 0.25 s `power4.out`, `transformPerspective:1200`, plus a plate-local flash (exempt) | 8 logos | Crash; 8 shutter clicks |
| 0.40 | 68.40 | VO part 1 starts | — | VO |
| 2.00 | 70.00 | **RUNWAY LIGHTS chase over the wall**: each plate's border flashes red on 8ths (the drum-pad heritage, full force). Wall `scale 1 → .82, y +140`, 0.5 s `expo.inOut`. **"DĚKUJEME"** (HEADLINE 150 px, white) and **"SPONZORŮM"** (112 px, red) slam above it at y 392–640 | DĚKUJEME SPONZORŮM | Kick |
| 3.00 | 71.00 | Hold. **Music shout "Trout Area!"** in the VO gap (70.8–72.0) | — | Shout |
| 4.00 | 72.00 | Wall plates fly out radially (0.35 s `power3.in`, stagger 0.02 from centre); title `yPercent -110`. **TA UNDOCK**: the header plate grows to hero (centre, y 690–999), 0.55 s `expo.inOut` | (TA hero) | Whoosh + impact |
| 4.20 | 72.20 | VO part 2 | — | VO |
| 4.60 | 72.60 | Labels type in under the TA plate | MISTROVSTVÍ ČR · TROUT AREA 2026 / 24.–25. 10. 2026 · LÍHEŇ LIBĚCHOV | Ticks |
| 5.00 | 73.00 | **GH MARK** fades in (0.5 s), centred at y 1360–1420: label "MADE BY" (600 / 24, `#8ea2d8`) · gear (`brand/gh/ring.png` + `core.png`, 60 px; ring rotates 0 → 120° over 2.0 s `none`) · "© 2026" (600 / 24) · `brand/gh/word-line.png` at 30 px height (GAUSSE HOLLER · CUSTOM LAB). Reads "MADE BY ⚙ © 2026 Gausse Holler" | MADE BY ⚙ © 2026 GAUSSE HOLLER | Ratchet tick |
| 6.00 | 74.00 | **Final stab**: full-frame flash .6 → 0 (0.30 s); TA plate pump `1.04 → 1` | — | Stab + sub |
| 6.00–7.00 | 74.00–75.00 | Hold end card; monogram drifts; GH ring keeps turning | — | Reverb tail |

---

## 5. Sound

### 5.1 Music brief
- **Genre:** fashion-runway techno / catwalk house. Polished, confident, minimal-industrial. **120.000 BPM, A minor**, 4/4.
- Kick: tight, short, 50–60 Hz body. Bass: rolling 16ths. Hats: crisp. Stabs: glossy analog. Vocals: only one male shout, "Trout Area!".
- **Generation:** reuse `vo/suno_sponzori.md` (style and exclude lists are good) with an updated lyrics map:
  - **Remove** the "Partners!" shout after the drop and the spoken "Mistrovství republiky" line. Both collide with the VO.
  - Keep only the final-hook shout.
  - Generate ≥ 2:00, beat-track with librosa to `data/beats.json` (`beats`, `downbeats`), pick sections, cut on downbeats with 20 ms crossfades at zero crossings, and time-stretch (rubberband) to exactly 120.000 if drift exceeds 10 ms over 75 s.

| Bars | Master | Section | Content |
|---|---|---|---|
| 1–2 | 0–4 | Intro build | Filtered kick (LPF sweep 200 Hz → open), riser, snare roll on bar 2 beats 3–4, reverse cymbal into 4.00. No vocal (VO owns this) |
| 3 | 4.00 | **DROP** | Crash + sub hit |
| 3–18 | 4–36 | Groove A (L01–L04) | Kick, offbeat open hat, rolling bass, stab on beat 4&. **Crash on every Look downbeat** (4, 12, 20, 28). 1-beat fill on beat 16 of each Look |
| 19–34 | 36–68 | Groove B (L05–L08) | + clap on 2 & 4, 16th closed hats, filtered arp. Crash on 36, 44, 52, 60. L07 (52–60) opens the filter for the "prizes" lift |
| 35–36 | 68–72 | Final hook | Full mix; **shout "Trout Area!" at ≈ 71.0** (VO gap) |
| 37 | 72–74 | Outro | Drums thin out, bass holds |
| 37½ | 74.00 | End | **Single final stab + sub**, reverb tail to 75.0 |

- Banner stems: export one **4-bar loop of Groove A** and one of **Groove B**, phrase-clean, so banners loop seamlessly.
- Each master Look slice should also stand alone: there are no vocals inside Looks.

### 5.2 SFX list
All SFX are tuned or high-passed to sit under the VO and pitched to A minor where tonal.
| ID | Sound | Length | Level vs music | Trigger |
|---|---|---|---|---|
| SFX01 | Sub impact (45 Hz boom) | 0.4 s | −6 dB | Every Look b1, intro b3, finale 74.00 |
| SFX02 | Camera shutter (DSLR mechanical) | 0.08 s | −10 dB | M5 strobes, internal cuts |
| SFX03 | Flash pop (+ short recycle whine before big ones) | 0.15 / 0.3 s | −12 dB | Flashes, b-roll frames |
| SFX04 | Air whoosh short | 0.3 s | −14 dB | Dock / undock, grid → hero, lens zoom |
| SFX05 | Reverse whoosh / reverse cymbal | 0.5 s | −12 dB | Into the 4.00 and 68.00 iris cuts; tail into each Look cut |
| SFX06 | Metal ting / shimmer (bell 4–8 kHz, A6 / E7) | 0.6 s | −16 dB | CHROME GLINT, glint stars |
| SFX07 | Spoon tinkle (pitched A5 / C6 / E6) | 0.3 s | −16 dB | Troutshop fan steps |
| SFX08 | Paper backdrop roll / unfurl | 0.4 s | −14 dB | CYC ROLL |
| SFX09 | Stage-light clunk (relay + hum) | 0.3 s | −14 dB | SPOT ON |
| SFX10 | High-heel click on concrete | 0.1 s | −16 dB | CATWALK STEP (wink) |
| SFX11 | Split-flap clicks (rapid) | 0.25 s | −16 dB | LOOK card, DISPLAY flaps |
| SFX12 | Counter ticks 12 Hz → ding | 0.9 s | −16 dB | Activefishing 1 340 |
| SFX13 | Rubber squeak / squish | 0.15 s | −16 dB | Moonky tiles and squish |
| SFX14 | Sewing-machine stitch | 0.4 s | −18 dB | Moonky woven label |
| SFX15 | Tungsten tick (tiny metallic) | 0.08 s | −16 dB | Jigovky swatches |
| SFX16 | Lens focus servo | 0.35 s | −18 dB | LENS open |
| SFX17 | Water "plip" + splash tail | 0.6 s | −16 dB | Líheň lens, pin |
| SFX18 | Sonar ping | 0.5 s | −18 dB | Líheň pin |
| SFX19 | Steel clink, lid twist + pop, steam hiss | 0.3 / 0.4 / 0.6 s | −14 dB | Bosset thermoses |
| SFX20 | Carbon "thock", ratchet clicks, gear whirr | 0.2 / 0.05 / 0.8 s | −16 / −24 / −18 dB | Gausse Holler, GH mark |
| SFX21 | Callout ping (sine, A5 / C6 / E6) | 0.25 s | −18 dB | GH callouts, Jigovky barbless |
| SFX22 | Crowd cheer swell (short) | 0.8 s | −22 dB | Bosset b13, finale wall |
| SFX23 | Podium thud | 0.2 s | −12 dB | Bosset podium |

Per-block SFX are pre-mixed to `audio/sfx/LNN_<slug>.wav` (8.000 s, block-local), so banners reuse them as they are.

### 5.3 Voice-over timing and mix
- **Voice:** Paul Broadcaster, ElevenLabs v3 via HeyGen, voiceId `02733a92a0db457aadf63b235d2aa457`, language `cs`, presentation tone (confident, warm, not shouty).
- **One file per block** (`audio/vo/LNN_<slug>.wav`) so banners carry their own VO. Trim silence and normalise each file to −16 LUFS.
- **Placement:** block-local in-point **0.40 s**. Must end ≤ **7.30 s** (window 6.9 s). Target 5.5–6.6 s at ≈ 2.6–2.8 spoken words/s.
  - If a take runs long: first re-generate; then time-compress ≤ 6 % (rubberband); finally trim copy. Never let it run into the next Look.
- **Ducking:** music −7 dB under VO, attack 150 ms, release 350 ms. Use the `data-automation` volume lane on the music track (see the hyperframes-audio skill); banner music slices are pre-ducked offline.
- **Master:** −14 LUFS integrated, −1 dBTP. SFX bus −10 dB relative to music.
- Numbers are written as words in the TTS script. The display copy is separate (§6).

| Segment | VO in → out (master) | Local | Words (written / spoken) | Target |
|---|---|---|---|---|
| Intro | 0.25 → 3.70 | — | 7 / 10 | 3.4 s (tight; if > 3.5 s drop "2026" from the VO, it stays on screen) |
| L01 Líheň | 4.40 → ~10.6 | 0.40 → 6.6 | 13 / 16 | 6.0 s |
| L02 Troutshop | 12.40 → ~18.8 | 0.40 → 6.8 | 13 / 19 | 6.4 s |
| L03 Activefishing | 20.40 → ~26.5 | 0.40 → 6.5 | 13 / 16 | 6.0 s |
| L04 Moonky | 28.40 → ~34.3 | 0.40 → 6.3 | 15 / 15 | 5.8 s |
| L05 Jigovky | 36.40 → ~42.9 | 0.40 → 6.9 | 13 / 17 | 6.4 s |
| L06 Velká ryba | 44.40 → ~50.5 | 0.40 → 6.5 | 14 / 16 | 6.0 s |
| L07 Bosset | 52.40 → ≤ 59.30 | 0.40 → ≤ 7.3 | ≤ 17 | ≤ 6.8 s |
| L08 Gausse Holler | 60.40 → ~67.0 | 0.40 → 7.0 | 16 / 16 | 6.5 s |
| Finale 1 | 68.40 → ~70.6 | — | 4 | 2.2 s |
| Finale 2 | 72.20 → ~73.4 | — | 4 | 1.2 s |

---

## 6. Copy: VO and on-screen templates (Czech)

### 6.1 Template (every Look)
```
LOOK CARD   LOOK {NN} / {TOTAL} · {KATEGORIE}            (default KATEGORIE = PARTNER · MČR 26)
MEGA        {MEGA_L1} / {MEGA_L2}                        (≤ 2 lines × ≤ 6 chars, uppercase)
LOGO PLATE  {LOGO} + {URL}
ONE-LINER   {CLAIM}                                      (≤ 2 × 20 chars)
CHIP 1      {FAKT1}                                      (≤ 30 chars, 32 hard max)
CHIP 2      {FAKT2}                                      (≤ 30 chars)
DISPLAY     {CISLO} + {CISLO_LABEL}                      (optional giant number)
TAPE A      MČR TROUT AREA 2026 · KOLEKCE PARTNERŮ · {MISTO} · {DATUM_KRATKY} ·
TAPE B      {FAKT3} · {KLICOVA_SLOVA} · {URL_UPPER} ·
VO          „{NAZEV} – {CLAIM_VO}. {FAKT_VO}."            (2 sentences, ≤ 18 words)
VO_TTS      same text with phonetic names and numbers written as words
```
Global variables: `{DATUM}` = 24.–25. 10. 2026 · `{DATUM_KRATKY}` = 24.–25. 10. · `{MISTO}` = LÍHEŇ LIBĚCHOV · `{TOTAL}` = 08.

### 6.2 Filled drafts (facts from `research/*.md`; source noted)
**INTRO**
- On screen: MČR / MISTROVSTVÍ ČESKÉ REPUBLIKY / 2026 / {DATUM} · {MISTO} / KOLEKCE PARTNERŮ
- VO: „Mistrovství České republiky v Trout Area 2026."
- TTS: „Mistrovství České republiky v Traut Erija, dva tisíce dvacet šest."

**L01 · Líheň Liběchov** (source: `libechov.md`, verified section)
- MEGA: LIBĚ / CHOV · Category: MÍSTO KONÁNÍ · URL: lihenlibechov.cz
- One-liner: **Dějiště MČR 2026**
- DISPLAY: 1934 + label "PSTRUŽÍ LÍHEŇ OD ROKU"
- Chip 1: **Malý Sporťáček · 24.–25. 10.** · Chip 2: **Boží Voda 289, Liběchov**
- Tape B: 164 M N. M. · DONEDÁVNA NEJNÍŽE POLOŽENÉ PSTRUHAŘSTVÍ V EVROPĚ · PRAMEN BOŽÍ VODA · LIHENLIBECHOV.CZ ·
- VO (13 words): „Hostí nás Líheň Liběchov. Pstruží líheň od roku 1934 a dějiště letošního mistrovství."
- TTS: „… od roku devatenáct set třicet čtyři …"
- Do not say "chyť a pusť" for Malý Sporťáček (it changed to "chyť a vem" on 23. 6. 2026).

**L02 · Troutshop.eu** (source: `troutshop.md`)
- MEGA: TROUT / SHOP · URL: troutshop.eu
- One-liner: **Milujeme lov pstruhů** (CZ form of their SK hero line)
- Chip 1: **Rodinná firma od roku 1999** · Chip 2: **Generální partner TA Slovakia**
- Tape B: THE TROUT FISHING SPECIALIST · NORIES · FOREST · VANFOOK · VELVET ARTS · TROUTSHOP.EU ·
- VO (13 words): „Troutshop.eu – specialista na lov pstruhů. Rodinná firma, v oboru už od roku 1999."
- TTS: „Trautšop tečka e u – … od roku devatenáct set devadesát devět."
- Do not call Velvet Arts their own brand (it is Japanese; research note).

**L03 · Activefishing.cz** (source: `activefishing.md`)
- MEGA: ACTIVE / FISHING · URL: activefishing.cz
- One-liner: **Pro všechny, kdo milují přívlač** (condensed from the homepage mission sentence)
- DISPLAY: 1 340 PLANDAVEK → 777 WOBLERŮ (counts as of 19. 10. 2026)
- Chip 1: **Přední japonské značky** · Chip 2: **Rychlé doručení, osobní přístup**
- Tape B: RYCHLOST DORUČENÍ · UNIKÁTNÍ SORTIMENT · OSOBNÍ PŘÍSTUP · VARIVAS · NORIES · TIMON · ACTIVEFISHING.CZ ·
- VO (13 words): „Activefishing.cz: přes třináct set plandavek předních japonských značek. Osobní přístup a rychlé doručení."
- TTS: „Ektyv fišing tečka cé zet: …"

**L04 · Moonky** (source: `moonky.md`, `moonky_user.md`)
- MEGA: MOONKY + label HANDMADE LURES · URL: moonky.cz
- One-liner: **Ručně dělané gumové nástrahy**
- Chip 1: **Vlastní formy z CNC strojů** · Chip 2: **8 let s reprezentací ČR** · woven label: HANDMADE · CZ
- Tape B: GUMA BEZ FTALÁTŮ · BANANA · CHEESE · OLIHEŇ · SAVORY · SCELET · COCCON · MOONKY.CZ ·
- VO (15 words): „Moonky – ručně dělané gumové nástrahy pro Trout Area. Už osm let je testuje česká reprezentace."
- TTS: „Múnky – … pro Traut Erija …"

**L05 · Jigovky.cz** (source: `jigovky.md`)
- MEGA: JIGY · URL: jigovky.cz
- One-liner: **Jigy, které chytají!**
- Swatches: FLUO 0,4 g · PINK 0,4 g · GOLD 0,4 g · ORANGE 0,4 g · RED 1,3 g · callout: BEZ PROTIHROTU
- Chip 1: **Největší výběr jigových hlaviček** · Chip 2: **TroutJig Barbless 0,4–3 g**
- Tape B: POCTIVĚ VYROBENO V ČR · HD BARBLESS · TUNGSTEN H 360 BL · ROTAČKY · JIGOVKY.CZ ·
- VO (13 words): „Jigovky.cz – jigy, které chytají. Bezprotihrotové hlavičky od 0,4 gramu, poctivě vyrobené v Česku."
- TTS: „Džigovky tečka cé zet – džigy, které chytají. … od nula celá čtyři gramu …"
- "Vlastní výroba / +1300 druhů" appear only in a banner image, so they are not used. "Poctivě vyrobeno v ČR" is in the HTML.

**L06 · Velka-ryba.cz** (source: `velkaryba.md`)
- MEGA: VELKÁ / RYBA · URL: velka-ryba.cz
- One-liner: **Vše na přívlač**
- DISPLAY: 2011 + label "OD ROKU"
- Chip 1: **E-shop i prodejna v Olomouci** · Chip 2: **Přes 30 let u vody**
- Tape B: SHIMANO ROD TEST CENTER · PRUTY SHIMANO NA ZKOUŠKU U VODY · CARDIFF · PRESSO · ILLEX · VELKA-RYBA.CZ ·
- VO (14 words): „Velká ryba – přívlačová speciálka z Olomouce. E-shop i kamenná prodejna, už od roku 2011."
- TTS: „… od roku dva tisíce jedenáct."
- "Nejdéle provozovaná…" may only be used with its full qualifier ("…která má e-shop i kamennou prodejnu"), so it is left out.

**L07 · Bosset.cz** (no research yet; everything in braces is pending)
- MEGA: CENY · Category: CENY PRO VÍTĚZE · URL: bosset.cz
- One-liner: **Termosky pro vítěze**
- Chip 1: **{BOSSET_FAKT1}** · Chip 2: **Objem 0,5–0,7 l**
- Tape B: {BOSSET_FAKT2} · {BOSSET_FAKT3} · BOSSET.CZ ·
- VO (11 + ≤ 6 words): „Ceny pro vítěze věnuje Bosset.cz: termosky od půl do 0,7 litru. {BOSSET_FAKT_VO}."
- TTS: „… Boset tečka cé zet: termosky od půl do nula celá sedm litru …"

**L08 · Gausse Holler** (source: `gausseholler.md`)
- MEGA: BLACK + label STANDARD EDITION · URL: gausseholler.com
- One-liner: **Ručně stavěno v Česku**
- Callouts: 8× KARBON · Ø 32 MM / HLINÍK · ELOX / REVOLUT 8
- Chip 1: **8 karbonových tubusů** · Chip 2: **Série 5 kusů, každý číslovaný**
- Tape B: HAND-BUILT IN CZECHIA · CARBON · ALUMINIUM · REVOLUT 8 · SHIPS ACROSS THE EU · GAUSSEHOLLER.COM ·
- VO (16 words): „Gausse Holler: stojany na pruty ručně stavěné v Česku. Black Standard Edition – karbon, hliník, limitovaná série."
- TTS: „Gause Holer: … Blek Standard Edyšn – …"
- "Black Standard Edition" = Revolut 8 · Standard Edition · Black (research). Confirm the name with Igor.

**FINALE**
- On screen: DĚKUJEME / SPONZORŮM · TA logo · MISTROVSTVÍ ČR · TROUT AREA 2026 / {DATUM} · {MISTO} · MADE BY ⚙ © 2026 GAUSSE HOLLER
- VO: „Děkujeme všem partnerům mistrovství." … „Uvidíme se u vody!"

Pronunciation note: check "Trout Area" against `vo/test_B_paul_el3.wav`. Use the phonetic "Traut Erija" only if v3 mispronounces it.

---

## 7. Implementation notes (HyperFrames / GSAP)

### 7.1 Structure: one sub-composition per Look
```
projects/mcr-2026-sponzori/
  data/sponsors.json          order, set, copy, assets, poses, callouts  (single source of truth)
  data/beats.json             librosa grid {beats[], downbeats[], duration}; synthetic 120 BPM until the track exists
  scripts/prep_images.py      cut-outs, crops, duotones, glint points → assets/sponsors/<slug>/cut/*.png + cutouts.json
  scripts/beats.py            librosa beat / downbeat tracking (house workflow)
  scripts/build.mjs           generator (house pattern from klonowiec build.mjs: emits static tweens)
  proto/
    index.html                MASTER host 1080×1920, data-duration 75
    compositions/intro.html
    compositions/look-libechov.html … look-gausseholler.html    (8, generated from ONE template)
    compositions/finale.html
    banners/<slug>/index.html thin standalone host per banner (8 s), mounts ../../compositions/look-<slug>.html
    assets/ fonts.css, fonts/, gsap.min.js, fx/grain.png, brand/, sponsors/<slug>/…, broll/*.jpg, audio/{track.wav,stems/,vo/,sfx/}
```

`sponsors.json` entry (example):
```json
{ "slug":"troutshop", "set":"cyc", "mega":["TROUT","SHOP"], "category":"PARTNER · MČR 26",
  "logo":{"src":"sponsors/troutshop/logo.png","plate":"paper","maxW":300}, "url":"troutshop.eu",
  "claim":"Milujeme lov pstruhů", "facts":["Rodinná firma od roku 1999","Generální partner TA Slovakia"],
  "tapeB":"THE TROUT FISHING SPECIALIST · NORIES · FOREST · VANFOOK · VELVET ARTS · TROUTSHOP.EU ·",
  "hero":{"type":"fan","items":[
    {"src":"sponsors/troutshop/cut/p01.png","rot":-27,"glint":[0.42,0.38]},
    {"src":"sponsors/troutshop/cut/p02.png","rot":-9,"glint":[0.40,0.35]} ]},
  "strobes":[1.5,2.0,6.5], "broll":"broll/d1_10_navy.jpg", "brollOut":"broll/d2_04_red.jpg",
  "vo":{"src":"audio/vo/L02_troutshop.wav"}, "sfx":{"src":"audio/sfx/L02_troutshop.wav"} }
```
`hero.type` selects one of the product choreographies: `fan | catwalk | grid | lens | diptych | podium | spec | photo`. Shared moves M1–M10 are library functions.

### 7.2 Look sub-composition skeleton
The `<template>` is the transport: styles, markup, audio and scripts must all be inside it. The root is styled by `#root`, never by a class.
```html
<!doctype html>
<html data-composition-variables='[
  {"id":"mode","type":"enum","label":"Mode","default":"loop","options":[
    {"value":"master","label":"Master (hard cuts)"},{"value":"loop","label":"Banner loop"},{"value":"hold","label":"Banner hold"}]},
  {"id":"showTA","type":"boolean","label":"TA plate in block","default":true}]'>
<head><meta charset="UTF-8"></head>
<body><template>
<style>
  /* @font-face block (fonts.css) — repeated here so the template is self-sufficient */
  #root{position:absolute;inset:0;overflow:hidden;background:#0b1e42;font-family:Montserrat,sans-serif;color:#fff}
  #stage{position:absolute;inset:0}
  .stretch{transform:scaleY(1.18);transform-origin:50% 100%}
  .line{overflow:hidden;padding-top:.24em;margin-top:-.24em}
  #ta{position:absolute;left:0;top:0;width:840px;height:309px;border-radius:49px;background:#fff;
      transform-origin:0 0;transform:translate(72px,264px) scale(.3238);z-index:20;box-shadow:0 24px 72px rgba(5,13,34,.35)}
  #flash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:15}
  #shutter i{position:absolute;top:0;width:135px;height:1920px;background:#0b1e42;transform:scaleY(0)}
  /* … sets, mega, prod, copy, plate, tapes, lights, grain … */
</style>
<div id="root" data-composition-id="look-troutshop" data-width="1080" data-height="1920">
  <div id="stage">
    <div id="set" class="cyc"></div><div id="mono"></div><i id="thread"></i>
    <div id="mega"><div class="stretch"><div class="line">…chars…</div><div class="line">…</div></div></div>
    <div id="prod"><div class="p" id="p1"><i class="shadow"></i><i class="bloom"></i>
      <img src="assets/sponsors/troutshop/cut/p01.png" alt=""><i class="sweep"></i><svg class="star">…</svg><i class="refl"></i></div>…</div>
    <div id="lights"><i id="rl0"></i>…<i id="rl7"></i></div>
  </div>
  <div id="copy"><div id="oneliner"></div><div id="chip1" class="chip"></div><div id="chip2" class="chip"></div></div>
  <div id="plate" class="plate paper"><i class="tab"></i><img alt=""><span class="url">troutshop.eu</span></div>
  <div id="tapes"><div id="tapeA"><div class="run">…</div></div><div id="tapeB"><div class="run">…</div></div></div>
  <div id="look">…</div>
  <div id="broll"></div><div id="flash"></div><i id="streak"></i>
  <div id="shutter"><i></i>…×8</div>
  <div id="grain"></div>
  <div id="ta"><img src="assets/brand/ta_logo_h.png" alt="Trout Area Czech Republic"></div>
  <audio id="vo-troutshop"  src="assets/audio/vo/L02_troutshop.wav"  data-start="0.40" data-track-index="1" data-volume="1"></audio>
  <audio id="sfx-troutshop" src="assets/audio/sfx/L02_troutshop.wav" data-start="0"    data-track-index="2" data-volume="1"></audio>
</div>
<script>
  document.fonts.ready.then(() => {
    const { mode, showTA } = window.__hyperframes.getVariables();
    const tl = gsap.timeline({ paused: true });
    /* ===== emitted by build.mjs: static literals only (B[], poses, grain steps) ===== */
    if (!showTA) tl.set('#ta', { opacity: 0 }, 0);
    // … M1–M10 calls …
    if (mode !== 'master') { /* shutter open 0.00, red thread draw, exits 7.50, shutter close 7.70 (loop) */ }
    window.__timelines['look-troutshop'] = tl;          // register LAST (async build rule)
  });
</script>
</template></body></html>
```
- **First spike task:** verify that `getVariables()` returns per-instance values inside a sub-composition script.
  - If it does not, `build.mjs` emits two files per Look instead: `look-<slug>.html` (master) and `look-<slug>.loop.html` (banner). They are generated anyway, so this costs nothing.
  - `showTA` can always fall back to a CSS-var binding (`--showTA`) on `#ta`.
- Media inside sub-compositions is rebased automatically, so VO and SFX travel with the block. The banner host only adds the music stem.

### 7.3 Master host
```html
<div id="root" data-composition-id="main" data-start="0" data-duration="75" data-width="1080" data-height="1920">
  <div id="intro" data-composition-id="intro" data-composition-src="compositions/intro.html"
       data-start="0" data-duration="4" data-track-index="3" data-width="1080" data-height="1920"></div>
  <div id="l01" data-composition-id="look-libechov" data-composition-src="compositions/look-libechov.html"
       data-variable-values='{"mode":"master","showTA":false}'
       data-start="4" data-duration="8" data-track-index="3" data-width="1080" data-height="1920"></div>
  <!-- l02 … l08 at 12, 20, 28, 36, 44, 52, 60 -->
  <div id="finale" data-composition-id="finale" data-composition-src="compositions/finale.html"
       data-start="68" data-duration="7" data-track-index="3" data-width="1080" data-height="1920"></div>
  <section id="fx"   class="clip" data-start="0" data-duration="75" data-track-index="8"><!-- SPOON IRIS, GEAR IRIS --></section>
  <section id="taL"  class="clip" data-start="0" data-duration="75" data-track-index="9"><div id="ta">…</div></section>
  <audio id="music" src="assets/audio/track.wav" data-start="0" data-duration="75" data-track-index="0" data-volume="1"></audio>
</div>
```
- **The host timeline owns** the TA plate dock and undock (3.50, 72.00), the iris transitions (3.70–4.40, 67.60–68.40) and music ducking. A sub-composition timeline cannot reach host elements.
- The intro and finale sub-compositions do **not** contain a TA plate; the host draws it.
- Do not `add()` child timelines into the host. HyperFrames seeks each one independently.

### 7.4 Generator conventions (`build.mjs`, same pattern as the house generator)
```js
const BEAT = 0.5, J = JSON.stringify;
const B = (n, blockStart) => snapLocal((n - 1) * BEAT, blockStart);     // ±40 ms snap to beats.json
const out = [];
const T = (s, f, t, p) => out.push(`tl.fromTo(${J(s)},${J(f)},${J({ immediateRender: false, ...t })},${p.toFixed(3)});`);
const S = (s, v, p) => out.push(`tl.set(${J(s)},${J(v)},${p.toFixed(3)});`);
const rnd = (seed) => { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); };  // house PRNG, build time only
const FLASHES = [];      // every full-frame flash time is pushed here by kickCut / strobe / brollFrame / stab
```
- Every random-looking value (poses, shutter delays, split-flap garbage, grain steps) is computed with `rnd()` at build time and written as literals. **No `Math.random`, no `Date`, no CSS `@keyframes`.** Repeats are finite and computed with `floor`.
- First-appearance tweens on elements that tween again later are preceded by an explicit `tl.set(…,0)` initial state.
- Never tween `display`, `visibility` or `autoAlpha` on `.clip` elements. Fade a child wrapper.
- GSAP owns all transforms on animated nodes. Base rotations (tapes) are set with `tl.set`, never in CSS.

### 7.5 Performance
- Bake duotones, cut-outs and crops offline. At runtime use at most 3 simultaneous `mix-blend-mode` layers (grain, sweep, flash).
- Blur filters only during 0.4 s entrances, and only on MEGA chars and products. Never animate blur on full-frame layers.
- Images are sized to their display size × 1.25 (products ≤ 1600 px, b-roll 1080 × 1920).
- Render at 30 fps. Use `--quality draft` while iterating, `looks` for the first review and `delivery` for finals.

### 7.6 QC gates (automate in `build.mjs` + `npx hyperframes check`)
1. **Flash budget:** `FLASHES.sort(); for i: assert(FLASHES[i+3] - FLASHES[i] >= 1.0)`, i.e. never 4 flashes inside 1 s.
2. **TA always visible:** sample every 0.25 s across the master and every banner. `#ta` must have opacity 1 and bbox (72, 264, 272 × 100), with no exceptions except the in-flight dock / undock moves (intro 1.00–1.40 and 3.50–3.95, finale 72.00–72.55), where opacity must still be 1.
3. **Safe box:** every text node that carries required info lies within x 72–936 × y 252–1452 at the poster frame and at its own mid-life.
4. **Diacritics:** snapshot LIBĚCHOV, DĚKUJEME, SPONZORŮM, VELKÁ, SPORŤÁČEK and check háčky are not clipped.
5. **Beat sync:** every cut and slam falls within ±1 frame of a `beats.json` beat.
6. **Loop:** banner frame 0 vs frame 239 pixel diff is ≈ 0, excluding the grain layer.
7. **Contrast:** `check` WCAG pass. Any text pair from the "decoration only" list fails the gate.
8. **Audio:** VO ends ≤ 7.30 s local; master −14 LUFS / −1 dBTP; no VO overlaps the 70.8–72.0 shout.
9. **Snapshots per Look** at t = 0.30, 1.0, 2.5, 4.0, 7.0 (poster), used for the user review sheet.

### 7.7 Render and export
```bash
# master (from proto/)
npx hyperframes check
npx hyperframes render --quality looks    --output ../04_RELEASE/MCR26_Sponzori_9x16_master_review.mp4
npx hyperframes render --quality delivery --output ../04_RELEASE/MCR26_Sponzori_9x16_master.mp4
# banners (from proto/banners/<slug>/)
npx hyperframes render --quality delivery --output ../../../04_RELEASE/banners/MCR26_<slug>_loop_9x16.mp4
# lightweight FB/IG versions + poster stills
ffmpeg -i in.mp4 -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 160k out_fb.mp4
ffmpeg -ss 7.0 -i banner.mp4 -frames:v 1 MCR26_<slug>_poster.png
```
Deliverables:
- 1 master (75 s), with a delivery and an FB-light encode.
- 8 banner loops (8 s); add `hold` variants only if asked.
- 8 poster PNGs, 1080 × 1920, from t = 7.0.
- Stems: music, VO, SFX.

---

## 8. Open items for the user
1. **Sponsor order.** Proposal in §4.1. Also: is Fandovy plandavky in? It would add LOOK 09: +8 s master, +1 banner.
2. **Bosset.cz:** logo, thermos packshots (0.5 / 0.7 l, ideally on white or transparent) and 1–3 facts.
3. **User fishing videos** for the intro, the venue Look and the flash frames. Until then, Klonówiec and H-Battle stills are used.
4. **Confirm** that "Black Standard Edition" = Revolut 8 · Standard Edition · Black.
5. **Music:** run Suno with the updated lyrics map (§5.1) and pick a take.
6. **Activefishing counts** (1 340 / 777): re-check on export day, or show "1 300+".
7. **Pin position** of Malý Sporťáček on `orto_scout.jpg`, and `{GPS}` if wanted.
8. **Length:** 75 s accepted, or use the ≤ 60 s fallback (§4.1)?
