# Direction LUXURY — „Šperkovnice / L'Écrin"
### MČR v Trout Area 2026 · prezentace sponzorů · 9:16 (1080×1920) · HyperFrames

> **Кратко (RU):** Блёсны и воблеры снимаем как ювелирку Cartier/Tiffany: бархатный тёмно-синий фон TA, медленные макро-повороты, блик света по металлу, глубина резкости, пара шрифтов: редакционный сериф Instrument Serif и наш Montserrat. Каждый спонсор — 8-секундная «витрина», которая открывается и закрывается жалюзи (наследник фейдеров микшера из прошлых роликов), поэтому каждый блок сам по себе готовый зацикленный баннер. Логотип TA висит «шапкой журнала» всегда и ничем не перекрывается. Музыка 120 BPM: 4 такта = 1 блок.

Author: art direction draft for the workflow · 2026-10-19 · status: **proposal**
Sources read: `BRIEF.md`, `research/*.md`, `vo/suno_sponzori.md`, `../klonowiec-2026/scripts/build.mjs` (house look), all `assets/*`.

---

## 0. TL;DR for the builder

| | |
|---|---|
| Concept | The championship is a jewellery house (maison) launching its 2026 collection. Every sponsor gets a **vitrine** (shop window). The lures are the jewels and the facts are **price tags**. The sponsor logo gets a **hallmark (punc)** card. The TA logo is the maison's **masthead**. |
| Grid | 120 BPM: beat 0.5 s, bar 2.0 s. **Block = 4 bars = 8.0 s** (240 frames @ 30 fps). |
| Master | **Cut B 82 s** (intro 8 + venue 8 + 7 × 8 + finale 10), recommended because BRIEF requires a venue ad block. **Cut A 74 s** (no venue block) meets the 60–75 s target. Same files, different host list. |
| Signature | 10 named moves (§3): LOUVRE, RACK FOCUS, TURNTABLE, SPECULAR SWEEP, HALLMARK, COUTURE TYPE, PRICE TAG, LOUPE, PAVÉ GLINTS, DOCK. |
| Banner-ready | Every block starts and ends on the **same closed-louvre frame**. That makes the cut between blocks invisible and every block a seamless 8 s loop. A 10 s variant inserts one bar. |
| Never | Covering the TA plate, bouncy eases (except the one red seal pop), red used as a surface colour, camera "pumping" on the beat, `Math.random` at runtime. |

---

## 1. Concept + mood

### 1.1 The idea
**„Nástrahy jako šperky."** A plandavka is polished metal on a hook. Shot with a single soft key light on dark velvet, it is indistinguishable from an earring in a Cartier film, so the direction uses that literally:

- **The boutique.** Every sponsor block is a vitrine. It opens and closes with Venetian-blind **louvres**, and the louvre faces show a slice of real Trout Area photography in navy duotone, like a shop window you look through.
- **The jewel.** One hero product per block sits on navy velvet. It rotates slowly in macro, a single specular light sweep crosses the metal, and depth of field separates it from two blurred "sister" lures behind.
- **The hallmark.** The sponsor logo arrives on a small card like a **puncovní značka** (Czech hallmarking is a real craft tradition, a quiet local wink) with a hairline frame and a tiny red seal.
- **The price tag.** Facts hang off the product on hairline threads as ivory tags: a serif number and a tracked grotesk caption.
- **The masthead.** The TA horizontal logo on its white plate is the maison name, always at the top. In the intro it is the hero; it then docks to the masthead, and in the finale it undocks back to hero.

### 1.2 Mood words
Velvet night · single key light · slow against fast (camera at a half-time feel while the music runs at 120) · restraint · precision watchmaking · cold water light (caustics) · editorial.

### 1.3 Why it is fashion-grade
1. **Typography pairing.** A condensed editorial serif (Instrument Serif, Vogue/Bottega energy) is set against Montserrat in widely tracked caps. Mixing serif italic with grotesk caps is the fashion-magazine signature.
2. **Negative space.** At least 55 % of every frame is empty velvet. Only one hero object at a time.
3. **Light is the effect.** There are no flashes, shakes or glitches. Motion comes from specular light, depth of field and slow rotation.
4. **Musical counterpoint.** The runway-house beat runs at 120 BPM while big moves happen once per bar and micro-sparkles sit on the hi-hats. It feels expensive because nothing is in a hurry.
5. **Runway grammar.** Each block is a "look": „PARTNER 01 · MČR TROUT AREA 2026". There is a vertical selvedge rail (fabric-edge brand text) and a catalogue-page inversion block.

### 1.4 Why it is unmistakably TA CZ
| Previous films (klonowiec build.mjs) | Luxury reinterpretation |
|---|---|
| Palette `--blue #304285 --red #e31e24 --navy #0b1e42 --ice #eef2f9`, deep `#050d22` | Same tokens, nothing added except two derived navy steps (§2.1). |
| Ivory cards `rgba(238,242,249,.96)` with red/navy text | Hallmark cards and price tags are the same ivory card, refined: hairline frame, smaller radius. |
| White plate `.tap` with TA horizontal logo | The **masthead**, always visible and always the top layer. |
| Montserrat 900 caps headlines | Kept for championship words (MISTROVSTVÍ text block, SPONZORŮM). |
| Czech flag brush band (white/red/blue) | **Tricolour ribbon**: three 2 px satin lines (white / red / light-blue). |
| Twinkling 4-point stars | **Pavé glints** on product highlights, synced to hi-hats. |
| Drum-pad running lights on beats | Glints and light-pool "breathing" on downbeats. |
| Mixer-fader wipe (16 vertical bars rising on the downbeat) | **LOUVRE**: 12 vertical slats rotating shut/open on the downbeat. |
| Beat grid from librosa (`track.beats.json`) | The same pipeline, with the track locked to 120.000 BPM (§7.6). |
| GH „made by ⚙ © 2026" mark | The same mark, refined: `MADE BY ⚙ © 2026 [GH word-line]`. |

### 1.5 Level-up vs previous films
- Physical light simulation (specular sweep, DOF, caustics, contact shadow, reflection) instead of flat white flashes.
- Three depth planes per shot (fg bokeh pass, hero, bg sisters).
- Metadata-driven choreography: an offline prep script computes anchor, glint and loupe points for every product photo, so motion "knows" where the hook eye or highlight is.
- Modular blocks: each one is a HyperFrames sub-composition and doubles as a banner.

---

## 2. Design tokens

### 2.1 Palette and usage rules
```css
:root{
  --velvet-0:#050d22;  /* deepest vignette, noir block (house --deep) */
  --velvet-1:#0b1e42;  /* base velvet = house navy */
  --velvet-2:#1e3064;  /* light-pool core (50 % mix of #0b1e42 + #304285) */
  --navy:#304285;      /* text on ivory, ribbon/logo accents */
  --ivory:#eef2f9;     /* cards, headline text, hairlines (35–60 % alpha) */
  --mist:#8ea2d8;      /* secondary text, eyebrows, threads, ribbon 3rd line */
  --red:#e31e24;       /* seal dot + ribbon red line ONLY */
  --white:#ffffff;     /* TA plate + specular highlights only */
}
```
Rules:
- **Frame budget:** roughly 70 % velvet, 20 % product, 8 % ivory/mist, at most 2 % red and white accents.
- **Red = jewel.** It is allowed only on the hallmark seal dot (12 px), the red ribbon line, and the TA logo itself. It is never a background, never body text, and appears at most once per frame outside the TA plate. Red on navy is 3.5 : 1, so it is fine as an accent and never used as small text.
- **Text contrast (verified):** ivory on velvet-1 is 14.6 : 1, mist on velvet-1 is 6.5 : 1 (eyebrows OK), navy on ivory is 8.3 : 1.
- **Sponsor colours** (AF orange, Bosset teal, Troutshop red…) live only inside their logo and their product photos. They are never used for UI.
- **Scene modes** (per block): `velvet` (default), `ivory` (catalogue-page inversion: bg `--ivory`, text `--velvet-1`, tags become navy cards with ivory text), `noir` (bg `--velvet-0`, one top spotlight), `cover` (full-bleed graded photo, venue only). The louvre slats are always navy in every mode.

### 2.2 Typography
Fonts, all local and deterministic:
- **Montserrat** 600 / 800 / 900 (+ italics) from `../klonowiec-2026/proto/assets/fonts/` (+ `fonts.css`). **700 is not in the local kit.** Either add `montserrat-latin(-ext)-700-normal.woff2` from `@fontsource/montserrat`, or use 600 for text and 800 for emphasis. The tables below use only 600/800/900.
- **Instrument Serif** Regular + Italic (OFL), copied from `/mnt/skills/examples/canvas-design/canvas-fonts/InstrumentSerif-{Regular,Italic}.ttf` into `assets/fonts/`. **Czech coverage verified** by rendering „Děkujeme sponzorům · Liběchov · Ř ž ů ť ň ď Ě": all glyphs are present. Italiana (rejected) lacks ě/ů.

Type scale at 1080×1920 (px):

| Token | Font | Size | Line-height | Tracking | Case | Use |
|---|---|---|---|---|---|---|
| `num-xxl` | Instrument Serif Reg | 300 | .82 | −.02em | — | Intro "2026" (SVG text, hairline → fill) |
| `serif-hero` | Instrument Serif Ital | 136 | .90 | −.01em | — | „Mistrovství", „Děkujeme" |
| `serif-h1` | Instrument Serif (Reg + Ital accent word) | 76 | 1.0 | 0 | — | Block headline, **≤ 22 chars, 1 line** |
| `serif-h1-2l` | Instrument Serif | 68 | 1.0 | 0 | — | 2-line claim variant, each line ≤ 20 chars |
| `serif-tag` | Instrument Serif Reg | 60 | 1.0 | 0 | — | Price-tag number/keyword (≤ 8 chars) |
| `grot-xl` | Montserrat 900 | 60–64 | .95 | .04em | CAPS | „ČESKÉ REPUBLIKY", „SPONZORŮM" |
| `label` | Montserrat 600 | 22 | 1.2 | .32em | CAPS | Eyebrows (≤ 34 chars) |
| `tag-cap` | Montserrat 600 | 22 | 1.25 | .12em | CAPS | Tag captions (≤ 3 words, max 2 lines) |
| `url` | Montserrat 800 | 26 | 1.0 | .14em | lower | URL on hallmark card |
| `meta` | Montserrat 800 | 26 | 1.2 | .14em | CAPS | Date · place line |
| `selvedge` | Montserrat 600 | 18 | 1 | .40em | CAPS | Vertical side rail (decorative, 30 % alpha) |
| `micro` | Montserrat 600 | 18 | 1 | .28em | CAPS | GH signature |

Type rules:
- The minimum *informational* size is 22 px. 18 px is reserved for decorative and signature lines.
- `serif-h1` at 76 px is about 30 px per character, so 22 characters ≈ 660 px, inside the 736 px centre column. The generator **must assert length**.
- Czech carons on capitals (Ř, Č, Ě) get clipped by `overflow:hidden` reveal masks. Every mask line gets `padding-top:.2em; margin-top:-.2em; padding-bottom:.12em`.
- Italic marks **one** accent word per headline, e.g. „Specialista na *pstruhy*".
- No `<br>` in text (HF determinism rule). Lines are separate block elements.

### 2.3 Grid and safe zones (Reels / TikTok / Shorts)
```
y=0     ┌────────────────────────────────────┐
        │  APP UI (status, tabs) – bleed only│
y=232   ├──────── MASTHEAD LANE (TA only) ───┤
y=244   │        [ TA PLATE 264×96 ]         │  ← always on top of everything
y=356   │           ══ ribbon 120 ══         │
y=396   │  PARTNER 01 · MČR TROUT AREA 2026  │  eyebrow (label)
y=440   ├──────────── STAGE ─────────────────┤
        │ ┌tag┐                              │
 S      │ └───┘       ◆ HERO ◆        ┌tag┐ │  hero centre (540,760), box 720×560
 E      │            (product)        └───┘ │
 L      │ ┌tag┐                              │
y=1100  │ └───┘                              │
y=1124  ├──────────── COPY ──────────────────┤
        │      [ HALLMARK CARD 440×140 ]     │  logo + url
y=1288  │     Headline serif-h1 (≤22 zn.)    │
y=1432  ├────────────────────────────────────┤
y=1440  │ APP UI (caption, music, CTA) bleed │
y=1920  └────────────────────────────────────┘
        x: 72 ─────────── 908 │ 930–1080 = right action rail (y 880–1600)
```
- **Full safe:** x 72–908, y 232–1432. **Centre column** for centred text: x 172–908 (736 px). Nothing informative right of x = 908, because the like/comment rail sits there.
- **Masthead lane y 232–372 is exclusive to TA.** The stage content container has a CSS mask that fades it out at y 380–440, so no product, glint or loupe can ever cross into the TA lane. This enforces the BRIEF rule that a sponsor never overlaps the TA logo.
- The bottom zone below 1440 and the top zone above 232 get only bleed art: velvet, caustics, the ends of the selvedge rail.
- Baseline grid 8 px. Six-column grid inside 72–908: col 118, gutter 24.
- **Hard numbers for the TA plate:** white `#fff`, radius 14, padding 12/22, logo height 72 px (≈ 220 px wide), plate 264×96 at x 408 (centred), y 244. Shadow `0 10px 30px rgba(5,13,34,.45)` plus a 1 px inner hairline `rgba(11,30,66,.10)`. In ivory scenes the shadow becomes `0 8px 24px rgba(11,30,66,.18)`. The plate is **static** inside blocks: no scale pulses, only a sheen sweep at block 6.25 s.

### 2.4 Texture and light (all deterministic)
| Layer | Spec | Motion (loop-safe within 8 s) |
|---|---|---|
| Velvet base | `background: var(--velvet-1)` | — |
| Light pool (key light) | `radial-gradient(55% 34% at 50% 38%, rgba(48,66,133,.60), transparent 70%)` over `radial-gradient(90% 60% at 50% 40%, #1e3064 0%, #0b1e42 60%, #050d22 100%)` | "Breath" on each downbeat: opacity 1 → .86, 1.75 s `sine.out` |
| Softbox reflection | 260 px vertical white bar, `filter:blur(60px)` (static, baked), opacity .05, `mix-blend-mode:screen` | x −120 → +120, 4 s `sine.inOut`, yoyo ×1 (returns at 8.0) |
| Caustics (water light) | Tileable 1024² PNG generated offline (Python, seeded), tinted `--mist`, opacity .07 (venue .14), `screen` | x 0 → −1024 over 8 s `none` (wraps exactly) |
| Monogram canvas | SVG pattern of spoon/crank/jig silhouettes, 140 px cell, rotated −30°, `--ivory` at 3.5 % | y 0 → −140 over 8 s `none` (one cell = seamless) |
| Selvedge rail | `TROUT AREA CZECH REPUBLIC — MČR 2026 — ` repeated, rotated −90°, centreline x = 36, y 480–1400, 30 % | y 0 → −period over 8 s `none` |
| Grain | `../klonowiec-2026/proto/assets/grain.png` 256 tile, overlay, opacity .20, layer `inset:-800px` | Per-frame jitter: `{x:0,y:0}→{x:-776,y:-488}`, `ease:"steps(8)"`, duration 0.2667, `repeat:29`. Each step jumps 97/61 px (not multiples of 256), giving a fresh grain every frame. |
| Vignette | `radial-gradient(120% 80% at 50% 45%, transparent 55%, rgba(5,13,34,.85) 100%)` | static |

### 2.5 Image treatments for heterogeneous product photos
**Offline prep (mandatory, once).** `scripts/prep_products.py` (PIL + numpy, seeded) or `npx hyperframes remove-background` for hard cases. It writes `assets/products/<sponsor>/<asset>{.png,_b18.png,_dark.png,.json}`:
1. **Cut-out.** White-background JPGs: remove-background, then a 1 px erode and 0.6 px feather on alpha. Transparent PNGs with a white panel inside (Activefishing p01/p02/p04): crop to the panel first. Troutshop PNGs carry a `TROUTSHOP.EU` watermark in semi-alpha pixels: keep only `alpha > 0.6`, then hand-check that nothing survives over the lure.
2. **Trim** to the alpha bbox and pad 6 %. **Size classes** (display long edge): spoon 560, crank 600, soft bait 520, jig 440, thermos 760 (height), GH stand full-bleed. Sources are resampled to 1.25× display (2.2× for the loupe source). **Upscale cap 1.25×.** Below that, use treatment T4 (loupe/bezel) or an AI upscaler (optional: Higgsfield `upscale_image`).
3. **Unify grade.** Contrast +6 %, saturation −8 % (gummies and glow paints stay at −0 %), plus a cool rim: `drop-shadow(0 0 1px rgba(238,242,249,.55))` baked in.
4. **Variants for motion:** `_b18.png` (pre-blurred 18 px, padded so the blur is not clipped) for rack focus and DOF, so blur radius is **never** animated on large layers. `_dark.png` (brightness .35) is the fake-thickness edge layer for TURNTABLE.
5. **Metadata `<asset>.json`**, computed from the alpha mask:
   - `bbox`
   - `axis` (PCA major axis angle)
   - `anchors.eye` / `anchors.tail` (axis endpoints; eye = end nearer the split ring) and `anchors.body` (centroid)
   - `glints` (top-3 luminance maxima inside the mask, min distance 40 px)
   - `tagSlots` (the 3 of 4 corner slots TL/TR/BL/BR with the least alpha coverage)
   - `loupePath` (3 points: eye, then paint detail, then body)
   - `sheenBlend` (`screen` metal / `soft-light` paint and gummy / `overlay` clear plastic)

Treatments (assigned per asset in `sponsors.lux.json`):

| Code | Name | For | Recipe |
|---|---|---|---|
| **T1** | Velvet cut-out (default) | spoons, cranks, gummies, thermos | Cut-out on velvet. Contact shadow: an ellipse 70 % of bbox width × 26 px, `rgba(0,0,0,.55)`, blur baked, under the product. Reflection: a flipped copy `scaleY(-1)`, opacity .16, `mask-image: linear-gradient(to bottom, #000, transparent 35%)`. Sheen layer per `sheenBlend`. |
| **T2** | Ivory plate (catalogue) | hairline hooks/jigs that cut-outs destroy (Jigovky), clean white packshots in `ivory` scenes | Keep the original white background and put the image on an `--ivory` scene or card with **`mix-blend-mode:multiply`**: white disappears into ivory with no seams. A hairline frame (1 px `rgba(11,30,66,.25)`) is optional. |
| **T3** | Navy duotone | b-roll (klonowiec `photos/d1_*`, `d2_*`, `aerial.jpg`; Liběchov photos; user videos later), backgrounds, louvre faces | Pre-baked offline: grayscale, then map shadows → `#0b1e42` and highlights → `#8ea2d8` (luminance curve gamma 1.1). Never applied to a product hero. |
| **T4** | Bezel loupe | low-res or small items, and macro detail | Circular mask Ø 300–420 with a 1.5 px `--ivory` ring, inner shadow `inset 0 0 40px rgba(0,0,0,.35)`. Content is a 2.2× crop. |
| **T5** | Noir studio | GH renders (already on grey studio) | Full-bleed `object-fit:cover`. A navy multiply layer (`#304285` at 40 %, `multiply`) turns the grey studio into a navy studio. Radial mask fades the edges into `--velvet-0`. |
| **T6** | Gallery plate | sponsor lifestyle photos with colour that matters (Moonky u04 macro) | Full colour inside a 3:4 frame (600×800) with a 1 px ivory hairline and 16 px inner padding, like a magazine plate. Slow Ken Burns scale 1.06 → 1.0. |
| **T7** | Cover grade | venue photo (`maly_sportacek_photo.jpg`, 3024×4032 portrait) | Desaturate 40 %, multiply `#304285` at 45 %, vignette. Ken Burns 1.08 → 1.0, y −20. |

**Logos:** trim to bbox, then fit a 360×96 box with a per-logo `optical` factor (0.85–1.15). Card colour comes from the logo ink:
- **Ivory card:** Troutshop, Activefishing, Velka-ryba, Bosset.
- **Navy card + mist hairline:** Moonky (white), Jigovky (white line), Gausse Holler (light text).
- **Medallion (no card, circle):** Líheň Liběchov (round badge).

### 2.6 Procedural vector elements (`assets/svg/`)
For the monogram canvas, the intro chrome spoon, hairline croquis drawings and the louvre glint. All are drawn in local coordinates and scaled by transform.
```svg
<!-- spoon.svg  viewBox="-70 -140 140 290" -->
<path id="spoon" d="M0,-120 C46,-110 62,-40 52,30 C42,92 18,124 0,128 C-18,124 -42,92 -52,30 C-62,-40 -46,-110 0,-120 Z"/>
<circle cx="0" cy="-104" r="6"/>                        <!-- eye hole (fill velvet) -->
<path d="M0,128 C0,150 18,160 26,146 C30,138 26,130 20,134" fill="none" stroke-width="3"/>  <!-- single hook -->
<!-- crank.svg  viewBox="-120 -60 240 120" -->
<path d="M-90,0 C-90,-34 -30,-46 30,-38 C70,-32 92,-14 92,0 C92,14 70,32 30,38 C-30,46 -90,34 -90,0 Z"/>
<path d="M-90,-6 L-118,-30 L-112,8 Z"/>                <!-- lip -->
<circle cx="-62" cy="-8" r="7"/>                        <!-- eye -->
<!-- jig.svg  viewBox="-40 -60 140 120" -->
<circle cx="0" cy="0" r="18"/><path d="M14,-4 L80,-4 C96,-4 98,30 80,34 C70,36 66,28 70,22" fill="none" stroke-width="3"/>
<!-- star4.svg (glint, house star) --> <path d="M50 0 L58 42 L100 50 L58 58 L50 100 L42 58 L0 50 L42 42 Z"/>
```
The intro **chrome spoon** uses `spoon.svg` filled with `linearGradient(100°: #ffffff 0, #eef2f9 .22, #8ea2d8 .48, #304285 .62, #eef2f9 .80, #ffffff 1)`. It is built entirely from the palette ("TA chrome") and is neutral, so no sponsor product is favoured in the intro.

---

## 3. Motion language

### 3.1 Principles
- **Timing:** structural events land on a downbeat (x.1) or beat 3 (x.3). Durations are quantised to eighth notes (0.25 s) wherever possible. Micro-moves (glints) are 0.125–0.25 s.
- **Camera never pumps.** No beat-scale on the stage (unlike klonowiec's `#stage` 1.035 pulse). Only the light pool breathes.
- **Ease vocabulary:**

| Token | GSAP ease | Use |
|---|---|---|
| `silk` | `power3.inOut` | product and camera moves, docking |
| `reveal` | `expo.out` | type, cards, arrivals |
| `drift` | `sine.inOut` | turntable, float, ambient |
| `light` | `power2.inOut` | light sweeps, thread draws |
| `exit` | `power3.in` | exits |
| `slatIn` / `slatOut` | `power3.in` / `power3.out` | louvre |
| `seal` | `back.out(3)` | **only** the red seal dot, the single overshoot in the film |

- **Seek-safety:** every tween is `fromTo`. Later tweens on an already-animated property use `immediateRender:false`. Repeats are finite. All coordinates are pre-computed by the generator (no `getBoundingClientRect`). The generator uses seeded `rnd(seed)` as klonowiec does; no runtime randomness.

Notation: `B(n.k)` = bar n, beat k, local to the block (`B(1.1)=0.00`, `B(1.3)=1.00`, `B(2.1)=2.00`…). "+" = the eighth after (`B(2.1+)=2.25`).

### 3.2 Signature moves

#### M1 · LOUVRE (Žaluzie): transition in/out, the house mixer-fader reborn
- **DOM:** `#<k>-lv` with 12 `<i>` slats, each 90×1920. Container `perspective:1600px`. Slat `backface-visibility:hidden`. Face = the boundary b-roll in T3 duotone: `background:url(broll.jpg) -<i*90>px 0 / 1080px 1920px`, plus a 1 px right edge `rgba(238,242,249,.18)` and a centre crease `linear-gradient(90deg, rgba(0,0,0,.25), transparent 45%, rgba(255,255,255,.06) 50%, transparent 55%, rgba(0,0,0,.25))`. Window glint: `#<k>-lvg`, a 220 px wide white→transparent bar, `skewX(-18deg)`, `screen`, opacity .55.
- **IN** (every block starts closed):
  ```js
  tl.fromTo("#k-lv i",{rotationY:0},{rotationY:90,duration:0.5,ease:"power3.out",stagger:{each:0.02,from:"center"}},0.00); // fully open at 0.60
  tl.fromTo("#k-lvg",{xPercent:-150},{xPercent:520,duration:0.5,ease:"power2.inOut"},0.00);
  ```
- **OUT:**
  ```js
  tl.fromTo("#k-lv i",{rotationY:-90},{rotationY:0,duration:0.375,ease:"power3.in",stagger:{each:0.02,from:"center"},immediateRender:false},7.375); // closed at 7.85
  tl.fromTo("#k-lvg",{xPercent:-150},{xPercent:520,duration:0.45,ease:"power2.inOut",immediateRender:false},7.50);
  ```
- **Frame 0 == frame 240:** closed slats + the same face image + TA plate on top. This is the seamless cut in the master and the seamless loop in banners.
- **Z-order:** louvre z 50 **under** the TA plate (z 90). The masthead stays while the blinds close beneath it.
- **Beat:** the open starts exactly on `B(1.1)` and the close ends 0.15 s before the next downbeat (≈ 4.5 frames of closed hold, enough for the b-roll slice to register as a "subliminal" flash of real fishing).

#### M2 · RACK FOCUS (Přeostření): depth-of-field arrival and exit
- **DOM:** each depth object = `.dof > img.s (sharp) + img.b (_b18)`, stacked.
- **Hero in:**
  ```js
  tl.fromTo("#k-hero .b",{opacity:1},{opacity:0,duration:1.0,ease:"power3.inOut"},0.25);
  tl.fromTo("#k-hero .s",{opacity:0},{opacity:1,duration:1.0,ease:"power3.inOut"},0.25);
  tl.fromTo("#k-heroScale",{scale:1.10},{scale:1,duration:2.0,ease:"expo.out"},0.25);
  ```
- **BG sisters** (always the `_b18` image, scale .42–.5): opacity 0 → .45, 1.25 s `sine.inOut` @ 0.75. Slow counter-drift x ±16 px over the block.
- **FG bokeh pass** (`_b18` at scale 2.2, opacity .35): `x: 1300 → -400`, `y` fixed at 1000, 2.0 s `none` @ 2.0. It crosses the stage once.
- **Hero exit** (only before the louvre in the master; banners hold): sharp → blur crossfade 0.5 s `power2.in` @ 7.125.
- Live `filter: blur()` is allowed only on text (≤ 6 px) and on the finale wall container (one layer).

#### M3 · TURNTABLE (Otočný podstavec): fake-3D macro rotation of flat packshots
- **DOM:** `#k-hero` (`transformPerspective:1400`) > `.flt` (float) > `.rot` (`transform-style:preserve-3d`) > `img._dark` (`translateZ(-6px)`, x +4) + `.dof` (front) + `.sheen`.
- **Tweens:**
  ```js
  tl.fromTo("#k-rot",{rotationY:-32,rotation:-4},{rotationY:14,rotation:2,duration:5.5,ease:"sine.inOut"},0.25);
  tl.fromTo("#k-rot",{rotationY:14,rotation:2},{rotationY:0,rotation:0,duration:1.0,ease:"power3.inOut",immediateRender:false},5.75); // "present to camera"
  tl.fromTo("#k-flt",{y:-8},{y:8,duration:2.0,ease:"sine.inOut",repeat:3,yoyo:true},0.00);             // 1 bar per swing
  tl.fromTo("#k-shadow",{scaleX:.84,opacity:.35},{scaleX:1,opacity:.55,duration:6.5,ease:"sine.inOut"},0.25);
  ```
- **Make room** for tags: `#k-heroScale {scale:1 → .86, y:0 → -30}`, 1.0 s `silk` @ 3.75 (`immediateRender:false`).
- **Limits:** |rotationY| ≤ 32° or the flatness shows. **Not** used for photos of 3D objects (GH stand renders, Bosset thermos, Liběchov photo). Those use *Dolly* instead: scale 1.0 → 1.06 + x 12 px over 8 s `drift`.

#### M4 · SPECULAR SWEEP (Odlesk): light travelling over metal
- **DOM:** `.sheen` sits over the hero's front image with `-webkit-mask:url(<asset>.png) center/contain no-repeat` (the product's own alpha) and `mix-blend-mode: <sheenBlend>`. Child `<i>`: width 38 %, height 140 %, top −20 %, `background:linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 22%, rgba(255,255,255,.85) 50%, rgba(255,255,255,0) 78%)`.
- **Sweep #1** (peak on beat `B(2.3)=3.00`):
  ```js
  tl.fromTo("#k-sheen i",{xPercent:-160,skewX:-20},{xPercent:300,skewX:-20,duration:1.0,ease:"power2.inOut"},2.50);
  ```
- **Peak glint** at `asset.glints[0]`: star4, 64 px, `#fff`, `drop-shadow(0 0 12px rgba(255,255,255,.9))`.
  ```js
  tl.fromTo("#k-g0",{scale:0,rotation:-30,opacity:0},{scale:1,rotation:15,opacity:1,duration:0.125,ease:"power2.out"},2.875);
  tl.fromTo("#k-g0",{scale:1,rotation:15,opacity:1},{scale:0,rotation:60,opacity:0,duration:0.25,ease:"power2.in",immediateRender:false},3.00);
  ```
- **Sweep #2** (when no loupe): same, opacity .6, duration 0.75 @ 5.25.
- **Wink** (resolve): `glints[1]` @ 6.50 (same pair, 0.125 + 0.25).
- **TA plate sheen** (once per block): the same recipe masked to the plate rect, opacity .35 @ 6.25. This is the masthead "catching the light".
- **Tuning:** the sweep must cross while TURNTABLE passes rotationY ≈ −10…+5° (2.5–3.5 s). That coupling is what sells "metal turning into the light".

#### M5 · HALLMARK (Punc): sponsor logo card
- **DOM:** `#k-hm` card 440×140 at x 320, y 1124, radius 10. Ivory or navy per §2.5. An inset SVG `rect` hairline 8 px in (`pathLength=1`, dasharray 1). `.logo` sits inside a 360×88 box. `.url` is in `url` style. `.seal` is a 12 px `--red` circle at top-right inner corner (24 px, 24 px).
- **Tweens:**
  ```js
  tl.fromTo("#k-hm",{opacity:0,scale:1.06,y:14},{opacity:1,scale:1,y:0,duration:0.75,ease:"expo.out"},1.00);
  tl.fromTo("#k-hm rect",{strokeDashoffset:1},{strokeDashoffset:0,duration:1.0,ease:"power2.inOut"},1.00);
  tl.fromTo("#k-hmLogo",{opacity:0,scale:.96,filter:"blur(6px)"},{opacity:1,scale:1,filter:"blur(0px)",duration:0.5,ease:"power3.out"},1.25);
  tl.fromTo("#k-seal",{scale:0},{scale:1,duration:0.25,ease:"back.out(3)"},1.50);           // the only overshoot
  tl.fromTo("#k-url",{opacity:0,y:6},{opacity:1,y:0,duration:0.5,ease:"power3.out"},1.75);
  ```
- **Variants:** *Gear hallmark* (GH): the logo is split into `logo_layer_ring` and `logo_layer_core`, and the ring rotates 0 → 90° over 6.5 s `none`. *Medallion* (Líheň): no card. A 220 px circle logo plus an outer 1 px ivory ring Ø 260 that rotates 0 → 30° over 8 s `none`.

#### M6 · COUTURE TYPE (+ RIBBON): serif headline reveal and tricolour underline
- **DOM:** the generator splits the headline into `.w > .ch` spans (words `white-space:nowrap`). The line wrapper is `overflow:hidden` with caron padding (§2.2).
- **Reveal** (n chars):
  ```js
  tl.fromTo("#k-hl .ch",{yPercent:105,opacity:0},{yPercent:0,opacity:1,duration:1.0,ease:"expo.out",stagger:0.025},2.00);
  tl.fromTo("#k-hl .ch",{x:(i)=>(i-n/2)*5},{x:0,duration:1.5,ease:"expo.out",stagger:0.025},2.00); // tracking settles wide → tight
  ```
- **Eyebrow** (`label`): opacity 0 → 1 and x 12 → 0, 0.75 s `reveal` @ 0.50.
- **Ribbon:** three SVG lines (white / `--red` / `--mist`), 2 px, 3 px gap, 240 px, centred 18 px under the headline baseline.
  ```js
  tl.fromTo("#k-rb line",{scaleX:0},{scaleX:1,duration:1.0,ease:"power4.inOut",stagger:0.06,transformOrigin:"50% 50%"},2.50);
  ```
  The persistent masthead mini-ribbon (120 px, y 356) is static.
- **Exit** (master only): `.ch {yPercent:0 → -105, opacity → 0}`, 0.25 s `exit`, stagger .008 @ 7.25.

#### M7 · PRICE TAG (Visačka): facts as hanging tags
- **DOM per fact j:**
  - Tag card: 300 wide, auto height, radius 10, padding 18/22, ivory (navy in `ivory` scenes), shadow `0 12px 30px rgba(5,13,34,.45)`.
  - `b` = `serif-tag` (≤ 8 chars) and `span` = `tag-cap` (≤ 3 words).
  - Thread: an SVG cubic path from the tag's inner top corner to `asset.anchors[...]` (projected through the hero pose after make-room), stroke `--mist` 1.5 px, `pathLength=1`, plus a ring `circle r=5` at the product end.
- **Slots:** chosen from `asset.tagSlots`. TL (72, 520), TR (608, 640), BL (72, 900), BR (608, 940).
- **Timing** (tag j at t_j = 4.00, 4.50, 5.00 = `B(3.1)`, `B(3.2)`, `B(3.3)`):
  ```js
  tl.fromTo("#k-th"+j,{strokeDashoffset:1},{strokeDashoffset:0,duration:0.5,ease:"power2.inOut"},tj);
  tl.fromTo("#k-tag"+j,{opacity:0,rotationX:-70,y:-10,transformPerspective:900,transformOrigin:"50% 0%"},
                       {opacity:1,rotationX:0,y:0,duration:0.75,ease:"expo.out"},tj+0.125);
  tl.fromTo("#k-tag"+j,{rotation:j%2?1.5:-1.5},{rotation:0,duration:1.5,ease:"sine.out",immediateRender:false},tj+0.5);
  ```
- **Read time:** the last tag lands at 5.75 and holds until 7.25, so every fact is on screen for at least 1.5 s. With the muted rule (≤ 3 words + number) this tests readable.

#### M8 · LOUPE (Lupa): jeweller's magnifier pass (used in 3 of 8 blocks)
- **DOM:** `#k-lp` circle Ø 300, `overflow:hidden; border-radius:50%`, shadow `0 0 0 1.5px #eef2f9, 0 20px 50px rgba(0,0,0,.5), inset 0 0 40px rgba(0,0,0,.35)`. Child `img` = the hero at 2.2× from the hi-res source.
- **Path:** `asset.loupePath` [p0, p1, p2] in stage coordinates. For each keyframe the generator writes the lens position as `x = p.x − 150, y = p.y − 150` (lens centre on p). The inner image is the hero's hi-res source, drawn at 2.2× the hero's display scale. With `(hx, hy)` = the hero image's top-left in stage coordinates at that moment (after make-room), the inner offset is `i.x = 150 − 2.2·(p.x − hx)` and `i.y = 150 − 2.2·(p.y − hy)`, so the lens shows exactly the magnified point beneath it. No runtime measuring. (In the tweens below, `p0..p2` already denote the lens top-left values.)
  ```js
  tl.fromTo("#k-lp",{x:p0.x,y:p0.y,scale:.6,opacity:0},{x:p1.x,y:p1.y,scale:1,opacity:1,duration:0.75,ease:"power3.out"},5.25);
  tl.fromTo("#k-lpi",{x:i0.x,y:i0.y},{x:i1.x,y:i1.y,duration:0.75,ease:"power3.out"},5.25);
  tl.fromTo("#k-lp",{x:p1.x,y:p1.y},{x:p2.x,y:p2.y,duration:1.0,ease:"sine.inOut",immediateRender:false},6.00);
  tl.fromTo("#k-lpi",{x:i1.x,y:i1.y},{x:i2.x,y:i2.y,duration:1.0,ease:"sine.inOut",immediateRender:false},6.00);
  tl.fromTo("#k-lp",{scale:1,opacity:1},{scale:.6,opacity:0,duration:0.375,ease:"power2.in",immediateRender:false},7.00);
  ```
- **Caveat:** the loupe's inner image does not follow the TURNTABLE rotation, so the hero turntable must be in its "present" state (rotationY 0) during 5.75–7.0. That is already true from M3's resolve. Loupe blocks start the resolve at 5.25.

#### M9 · PAVÉ GLINTS (Třpyt): hi-hat sparkles, the drum-pad lights reborn
- **Slots:** 4 per block from `asset.glints` (hero + sisters). star4 28–48 px.
- **Times:** off-beat eighths `B(2.1+)=2.25`, `B(3.1+)=4.25`, `B(3.3+)=5.25`, `B(4.1+)=6.25`, plus the M4 peak (3.00) and the wink (6.50). That is at most one glint visible at a time.
  ```js
  tl.fromTo(g,{scale:0,rotation:0,opacity:0},{scale:1,rotation:45,opacity:1,duration:0.16,ease:"power2.out"},t);
  tl.fromTo(g,{scale:1,rotation:45,opacity:1},{scale:0,rotation:90,opacity:0,duration:0.24,ease:"power2.in",immediateRender:false},t+0.16);
  ```
- **Light-pool breath** on each downbeat (0, 2, 4, 6): `#k-pool {opacity:1 → .86}`, 1.75 s `sine.out`, `immediateRender:false`. Felt, not seen.

#### M10 · DOCK / UNDOCK (Puncování TA): the TA plate between hero and masthead
- The TA plate is laid out at its masthead position (x 408, y 244, 264×96). Hero state = `{y: +468, scale: 2.2}` (centre y 760, plate ≈ 581 px wide).
- **Intro dock:** `tl.fromTo("#i-ta",{y:468,scale:2.2},{y:0,scale:1,duration:1.0,ease:"power3.inOut"},2.00)` on the bar-2 downbeat impact.
- **Finale undock:** `tl.fromTo("#f-ta",{y:0,scale:1},{y:420,scale:2.4,duration:1.25,ease:"power3.inOut"},4.00)`.
- The plate shadow scales inversely (box-shadow is baked on a separate shadow div so it can tween opacity and scale cheaply).

### 3.3 Block-specific "specials" (variations on the system, one per block)
| Code | Block | Spec |
|---|---|---|
| S-EARRING | Troutshop | Two spoons hang like an earring pair from 1 px `--ivory` (40 %) vertical "chains" from y 440. Pendulum `rotation ±3°`, 2.0 s `drift`, repeat 3 yoyo, phases offset 0.5 s; `transformOrigin` = eye anchor. Double sweep (spoon A @ 2.5, spoon B @ 2.75). |
| S-RATTLE | Activefishing | The Micro PaniCra (a rattle crank) gets a micro-shake on 4 hi-hats in bar 3 (4.25, 4.75, 5.25, 5.75): `x ±2, rotation ±0.8°`, 0.08 s each, back to 0. A rattle SFX sits on the same times. |
| S-TRIO | Moonky | Three gummies (green Savory, orange Coccon, pink Scelet) stacked as a vertical pendant. Each "breathes" on its downbeat (scale 1 → 1.025 → 1, 0.5 s `sine.inOut`) for softness. Sheen `soft-light`. A T6 gallery plate of `u04_gamer_big_macro.jpg` slides in behind in bar 3 (x 680, y 560, 3:4, 300 wide, opacity 0 → 1, 0.75 s `reveal`). |
| S-CATALOGUE | Jigovky | Scene `ivory`. Jigs are T2 multiply on ivory, three heads (fluo / pink / red HD barbless) in a row like studs. LOUPE on the barbless point (`anchors.tail`). |
| S-NOIR | Gausse Holler | Scene `noir`. Top spotlight `radial-gradient(40% 30% at 50% 18%, rgba(238,242,249,.18), transparent)`. **Angle-cut turntable:** `p05_panel_hero` → `p02_threeq` → `p03_side` cross-cut on `B(2.1)` and `B(3.1)` with a 0.5 s M2 crossfade (sharp A → blur → sharp B). Gear hallmark. Music breakdown. |
| S-FAN | Velka-ryba | Three spoons (Roll Swimmer orange-gold, lime-gold, Illex pink yamame) stacked, then fan out to −24° / 0° / +24° around the shared eye anchor: 1.5 s `power3.out` @ 0.75. A sweep crosses all three (one mask per spoon, staggered 0.08). |
| S-CAROUSEL | Bosset | Scene `ivory`. Four thermoses (green p01, pink p02, white p03, black p04) on a glass plinth (ivory gradient bar with a 1 px top highlight). Carousel steps on `B(2.1)`, `B(3.1)`, `B(4.1)`: track `x −280`, 0.75 s `silk`. The centre one is sharp at scale 1, the sides are `_b18` at scale .82. A vertical sweep (bottom → top, `yPercent`) runs on each arrival. |
| S-COVER | Líheň (venue) | Scene `cover` (T7 photo full-bleed + caustics .14). Medallion hallmark. No turntable; Ken Burns only. |

### 3.4 Transitions between blocks
- **Default (all boundaries):** LOUVRE. Block N's OUT closes on b-roll image X, block N+1's IN opens from the same image X, and the cut happens at the closed frame. The generator assigns images per boundary from `broll[]`: klonowiec `photos/d1_05, d1_10, d2_03…`, `aerial.jpg`, Liběchov `velky_sportak.jpg`, and later the user's fishing videos (muted `<video>` in the slat face, same duotone via pre-graded files).
- **Intro → first block:** the intro's ribbon extends to full width (scaleX 1 → 4.5, 0.375 s `power3.in` @ 7.25) just before its louvre closes. The ribbon "pulls the blinds".
- **Last block → finale:** standard louvre. The finale opens on the closed louvre that shows the **TA plate's** own colours (slat face = velvet-1 with the tricolour ribbon running across all slats), a "curtain" moment.

### 3.5 Each block as a standalone banner
| Export | How | Notes |
|---|---|---|
| **Banner-8 loop** | The block sub-comp in a banner wrapper (§7.3). Face image IN = OUT = the sponsor's cover slice (their lifestyle photo in T3, or plain velvet slats with the tricolour ribbon). | Frame 0 ≡ frame 240, so it loops seamlessly. All ambient layers have whole periods inside 8 s (§2.4). |
| **Banner-10** | The generator time-warp `W(t) = t < 6 ? t : t + 2` inserts a **"look hold" bar** (6.0–8.0). Tweens spanning 6.0 are stretched automatically. The inserted bar plays LOUPE (if unused) or sweep #3 plus two glints. | For 10 s placements. Music: a 5-bar loop cut. |
| **Clean-out** | Replaces the louvre OUT with a 0.6 s fade to velvet (for DOOH screens that do not loop). | Variable `outMode: "louvre" \| "fade"`. |
| **Poster / still** | PNG at t = 7.00 (inside the poster window 6.50–7.20, where nothing but ambient moves). | For feed thumbnails and static banners. |
| **Muted** | Default. The on-screen copy is complete (eyebrow, logo + URL, headline, 2–3 facts). | VO is never needed to understand a banner. |
| **With sound** | Optional banner music loop (4 bars) plus the block VO. | Music −1 dB, 0.1 s edge fades. |

In banners the eyebrow drops the index („PARTNER · MČR TROUT AREA 2026"). The TA masthead is present and static the whole time (BRIEF requirement).

---

## 4. Storyboard

### 4.1 Master timeline
Grid 120.000 BPM, 30 fps. **Recommended order** (user may reorder; blocks are independent): open on pure jewellery (spoons), alternate product types, place the noir GH block in the middle as the musical breakdown, end on prizes (Bosset) to bridge into the thank-you.

| # | Block | Scene | Cut B (82 s) | Cut A (74 s) | Music |
|---|---|---|---|---|---|
| 0 | Intro: title card | velvet | 0:00.0–0:08.0 (bars 1–4) | 0:00–0:08 | Intro: filtered kick, crystal arp, riser |
| V | Líheň Liběchov (venue) | cover | 0:08–0:16 (5–8) | — (info in intro + finale) | Drop A |
| 1 | Troutshop.eu | velvet | 0:16–0:24 (9–12) | 0:08–0:16 | Drop A |
| 2 | Activefishing.cz | velvet | 0:24–0:32 (13–16) | 0:16–0:24 | Drop A |
| 3 | Moonky | velvet | 0:32–0:40 (17–20) | 0:24–0:32 | Drop A |
| 4 | Jigovky.cz | **ivory** | 0:40–0:48 (21–24) | 0:32–0:40 | Drop A (last 4 bars, filter sweep down) |
| 5 | Gausse Holler | **noir** | 0:48–0:56 (25–28) | 0:40–0:48 | **Breakdown** (half-time, filtered) |
| 6 | Velka-ryba.cz | velvet | 0:56–1:04 (29–32) | 0:48–0:56 | Drop B |
| 7 | Bosset.cz | **ivory** | 1:04–1:12 (33–36) | 0:56–1:04 | Drop B |
| F | Finale: wall + thanks + TA + GH | velvet | 1:12–1:22 (37–41) | 1:04–1:14 | Final hook + stab @ bar 41.1, tail |

> **Duration note.** The computed task asks for a 60–75 s master. BRIEF (the user's decisions) adds a separate venue ad block, and the Suno note targets about 1:36. With 8 blocks of at least 8 s plus intro and finale, ≥ 82 s is unavoidable. **Cut A (74 s)** honours the 60–75 s target. **Cut B (82 s)** honours BRIEF. Both come from the same files; only the host list differs.

### 4.2 Intro: championship title card (8.0 s, bars 1–4)
VO window 2.10–7.10.

| t | B | On screen | Motion | Text |
|---|---|---|---|---|
| 0.00 | 1.1 | Darkness: velvet with the light pool at 0. The **TA plate is already present at hero size** (centre, scale 2.2), in shadow. Caustics and monogram at 0. | Light pool opacity 0 → 1, 1.5 s `drift`. Caustics and monogram fade in 2.0 s. | — |
| 0.50 | 1.2 | TA plate catches the light. | M4 sweep across the plate (mask = plate), 1.0 s, peak 1.00 + glint at the plate's top-right. | — |
| 1.00 | 1.3 | Chrome spoon (procedural) appears behind/below at y 1000, diagonal −35°, macro scale 1.6. | M2 from `_b18` render (pre-rendered blurred SVG→PNG), 1.0 s. M3 rotationY −30 → 10 over 6 s. | — |
| 2.00 | 2.1 | **Impact.** TA plate docks to the masthead. | M10 dock, 1.0 s `silk`. Light-pool breath. | — |
| 2.25 | 2.1+ | Eyebrow | `label` reveal | TROUT AREA CZ UVÁDÍ |
| 2.50 | 2.2 | Title stack builds (centre column, y 470–1180) | M6 per line, stagger between lines 0.25 s | *Mistrovství* (serif-hero 136) / ČESKÉ REPUBLIKY (grot-xl 60) / v Trout Area (serif 88, `--mist`) |
| 3.00 | 2.3 | Giant **2026** (SVG text, num-xxl 300, y ≈ 1000), the spoon passing *behind* it | Stroke draw `strokeDashoffset 1 → 0`, 1.25 s `light`. Then `fill-opacity 0 → 1`, 0.75 s @ 4.25. | 2026 |
| 4.00 | 3.1 | Date/place line + ribbon (240 px) under it | `meta` fade + x 12 → 0. M6 ribbon @ 4.25. | {DATUM} · {MISTO} → *24.–25. 10. 2026 · LÍHEŇ LIBĚCHOV* |
| 4.50 | 3.2 | Chrome spoon sweep, glint on its tip | M4, peak 5.00 | — |
| 5.00 | 3.3 | Claim | M6 (serif-h1 italic, y 1310) | *Partneři šampionátu* |
| 6.00 | 4.1 | Hold: glints on hi-hats (6.25, 6.75) | M9 | — |
| 7.00 | 4.3 | Title chars exit up; spoon rack-focuses out | M6 exit 0.25 s; M2 out | — |
| 7.25 | 4.3+ | Ribbon pulls to full width | scaleX 1 → 4.5, `power3.in` | — |
| 7.375 | 4.4 | Louvre closes (face: `velky_sportak.jpg` T3 in Cut B; first sponsor's boundary image in Cut A) | M1 out | — |

### 4.3 Sponsor block template (8.0 s), applies to every block unless overridden in 4.4
| t | B | On screen | Motion | SFX | VO |
|---|---|---|---|---|---|
| 0.00 | 1.1 | Louvre opens onto the velvet stage; the hero is soft | M1 in | silk swish, sub thump | — |
| 0.25 | 1.1+ | Hero comes into focus; turntable starts | M2 in, M3 | — | — |
| 0.50 | 1.2 | Eyebrow | M6 label | — | — |
| 0.75 | 1.2+ | BG sisters (blurred) fade in | M2 bg | — | **VO in** |
| 1.00 | 1.3 | **Hallmark card:** logo + URL | M5 | felt thud + card tick | sponsor name ≈ 0.8–1.6 |
| 1.50 | 1.4 | Red seal | M5 seal | glass tick | — |
| 2.00 | 2.1 | **Headline** | M6; FG bokeh pass 2.0–4.0 | silk swish (−24 dB) | — |
| 2.25 | 2.1+ | Glint | M9 | micro ting | — |
| 2.50 | 2.2 | Ribbon under the headline; **specular sweep #1** (peak 3.00 + star) | M6 ribbon, M4 | crystal shimmer gliss (peak on 3.00) | — |
| 3.75 | 2.4+ | Make room: hero scale .86, y −30 | M3 | — | sentence 2 ≈ 3.4 → |
| 4.00 | 3.1 | **Tag 1** | M7 | card flick | — |
| 4.25 | 3.1+ | Glint | M9 | micro ting | — |
| 4.50 | 3.2 | **Tag 2** | M7 | card flick | — |
| 5.00 | 3.3 | **Tag 3** (optional) | M7 | card flick | — |
| 5.25 | 3.3+ | **Loupe** pass (if used) **or sweep #2** | M8 / M4 | lens swish / shimmer (−22 dB) | — |
| 5.75 | 3.4+ | Turntable resolves to 0° (loupe blocks: 5.25) | M3 | — | — |
| 6.00 | 4.1 | Settled; light-pool breath | — | — | — |
| 6.25 | 4.1+ | TA plate sheen | M4 (plate) | — | — |
| 6.50 | 4.2 | Wink glint on the hero | M4 glint | bell ting (A5) | VO out ≤ 7.00 |
| 6.50–7.20 | 4.2–4.3+ | **Poster window** (still frame for thumbnails at 7.00) | ambient only | — | — |
| 7.25 | 4.3+ | Headline chars exit | M6 exit | — | — |
| 7.375 | 4.4 | Louvre closes; window glint at 7.50 | M1 out | velvet whoosh + 3 slat clicks (7.70/7.73/7.76) | — |

### 4.4 Sponsor blocks: overrides, assets and copy
Only rows that differ from 4.3 are listed. Every block has eyebrow `PARTNER 0n · MČR TROUT AREA 2026`, except V (MÍSTO KONÁNÍ · MČR 2026) and Bosset (CENY PRO VÍTĚZE · MČR 2026).

#### V · Líheň Liběchov (venue ad), scene `cover`, special S-COVER
Assets: `libechov/maly_sportacek_photo.jpg` (T7, full-bleed), `logo.png` (medallion). Optional `velky_sportak.jpg` in the louvre face.

| t | On screen / motion | Text |
|---|---|---|
| 0.00–8.00 | Photo Ken Burns 1.08 → 1.0, y −20 (`drift`). Caustics .14. No hero product. | — |
| 0.50 | Eyebrow | MÍSTO KONÁNÍ · MČR 2026 |
| 1.00 | **Medallion** hallmark: logo circle 220 px at (540, 1194) plus a rotating outer ring | lihenlibechov.cz |
| 2.00 | Headline (serif-h1) | Líheň *Liběchov* |
| 4.00 / 4.50 / 5.00 | Tags without threads (no product); tags stand at TL / TR / BL like museum labels | **1934** / tradice líhně · **MČR** / Malý Sporťáček · **24.–25. 10.** / sobota a neděle |
| 1.00 | SFX: water drip + soft splash instead of the felt thud | — |

#### 1 · Troutshop.eu, special S-EARRING
- **Hero:** `p03_velvet-arts-forte-2-1g-30-glow-gold` and `p01_…-32-glow-pink` (T1, sheen `screen` / `soft-light`).
- **BG:** `p05_…-74-mustard-gold`, `p09_nories-rooney`. **FG pass:** `p02_…-35-yellow-red`.
- **Hallmark:** ivory card.

| t | On screen / motion | Text |
|---|---|---|
| 0.25 | Two spoons hang on chains at x 470 / 610, mirrored rotation −14° / +14°. Pendulum swing starts. | — |
| 2.00 | Headline | Specialista na *pstruhy* |
| 2.50 / 2.75 | Double sweep (gold, then pink) | — |
| 4.00–5.00 | Tags | **1999** / rodinná firma · **TA SK** / generální partner · **4 země** / vítězství v závodech |
| 5.25 | Sweep #2 (no loupe) | — |
| URL | — | troutshop.eu |
| SFX accent | spoon flutter (metallic whirr) under the sweeps | — |

#### 2 · Activefishing.cz, special S-RATTLE
- **Hero:** `p07_timon-chibi-futten-hologram` (crop + cut-out, T1, sheen `screen`: the hologram flakes love the sweep).
- **BG:** `p03_timon-rhomy-218` (crop off the glow panel), `p08_timon-micro-panicra` (the rattle crank sits in the BG and shakes).
- **FG:** `p06_nories-sofia`. **Hallmark:** ivory card (the orange fish logo reads well).

| t | On screen / motion | Text |
|---|---|---|
| 2.00 | Headline | Z vášně pro *přívlač* |
| 4.00–5.00 | Tags | **1 300+** / plandavek · **777** / woblerů · **Varivas** / japonská špička |
| 4.25–5.75 | Rattle micro-shake on hi-hats | — |
| 5.25 | Loupe over the crank eye → hologram flank | — |
| URL | — | activefishing.cz |
| SFX | rattle ticks on 4.25 / 4.75 / 5.25 / 5.75 | — |

#### 3 · Moonky, special S-TRIO
- **Hero:** `p01_savory_c06_green_crop`, `p02_coccon_c02_orange_fluo_crop`, `p03_scelet_c01_pink_bubblegum_crop` (re-cut to alpha, T1, sheen `soft-light` .7).
- **Gallery plate:** `u04_gamer_big_macro.jpg` (T6). **Hallmark:** navy card (white logo).

| t | On screen / motion | Text |
|---|---|---|
| 0.25 | Vertical pendant trio, each with its own small turntable (±18°), phases 0 / 0.33 / 0.66 | — |
| 2.00 | **2-line headline** (serif-h1-2l, 68 px, y 1288–1432) | Nástrahy, které / pstruzi *milují* |
| 4.00 | T6 gallery plate slides in behind the trio (right side) | — |
| 4.00–5.00 | Tags | **CNC** / vlastní formy · **8 let** / s reprezentací ČR · **0 ftalátů** / moderní guma |
| 5.25 | Loupe over the ribbed body texture | — |
| URL | — | moonky.cz |
| SFX | soft "squish" (very quiet) on the downbeat breaths | — |

#### 4 · Jigovky.cz, special S-CATALOGUE (scene `ivory`)
- **Hero row:** `p02_hd-barbless-fluo-0-4g`, `p03_hd-barbless-pink-0-4g`, `p07_hd-barbless-red-1-3g` (T2 multiply on ivory, no cut-out, hooks stay hairline-sharp). No turntable on T2: they get Dolly + sweep, with the sweep masked to the head only (a circle mask at `anchors.body`).
- **Hallmark:** navy card (white line logo). Text colours are inverted.

| t | On screen / motion | Text |
|---|---|---|
| 0.00 | The louvre opens onto the **ivory catalogue page**: a contrast flip for rhythm | — |
| 0.25 | Three jigs in a row like studs, stagger 0.125 rack focus | — |
| 2.00 | Headline (navy) | Jigy, které *chytají* |
| 4.00–5.00 | Navy tags | **0,4–3 g** / barbless trout jigy · **1 300+** / druhů skladem · **CZ** / vlastní výroba |
| 5.25 | **Loupe** on the barbless hook point | — |
| URL | — | jigovky.cz |
| SFX | tungsten bead clink at 1.00 and 5.25 | — |

#### 5 · Gausse Holler, special S-NOIR (scene `noir`, music breakdown)
- **Hero:** `p05_revolut8_panel_hero.jpg` (T5), `p02_threeq`, `p03_side`. Optional: `v01_revolut8_standard_reel.mp4` muted as the bar-3/4 background (T5 grade) instead of the angle cuts.
- **Hallmark:** navy card, *gear hallmark* (logo layers ring + core).

| t | On screen / motion | Text |
|---|---|---|
| 0.00 | Louvre opens into near-black; spotlight cone fades in 1.0 s | — |
| 0.25–8.00 | Dolly 1.0 → 1.06 on the current angle | — |
| 2.00 | **Angle cut** → three-quarter (0.5 s rack crossfade); headline | Black Standard *Edition* |
| 4.00 | Angle cut → side; tags (threads to the hub, tubes, legs) | **8** / karbonových tubusů · **5 ks** / limitovaná série · **CZ** / ručně stavěno |
| 2.50 | Sweep runs vertically down the carbon tubes (mask = tube region rect) | — |
| URL | — | gausseholler.com |
| SFX | carbon-tube "tock" at 1.00; gear ratchet ticks with the ring rotation; breakdown pad | — |

> Confirm the product name: BRIEF says „Black Standard Edition"; the web says *Revolut 8 · Standard Edition* in colourway Black (`research/gausseholler.md`). The headline uses the BRIEF wording. The small line on the hallmark card can read `Revolut 8 · gausseholler.com`.

#### 6 · Velka-ryba.cz, special S-FAN
- **Hero fan:** `p01_cardiff-roll-swimmer-ce-orange-gold`, `p03_…-lime-gold`, `p05_illex-native-spoon-pink-yamame` (white JPG → cut-out T1; check source size against the 1.25× cap; if short, display long edge 480).
- **BG:** `p08_berkley-power-flail`. **Hallmark:** ivory card.

| t | On screen / motion | Text |
|---|---|---|
| 0.75 | Fan spread −24° / 0 / +24° around the shared eye (1.5 s `power3.out`) | — |
| 2.00 | Headline | Vše na *přívlač* |
| 2.50 | Sweep across all three, stagger .08 | — |
| 4.00–5.00 | Tags | **2011** / přívlačová speciálka · **Olomouc** / e-shop i prodejna · **Shimano** / Rod Test Center |
| URL | — | velka-ryba.cz |
| SFX | reel-drag click ×3 synced to the fan blades | — |

#### 7 · Bosset.cz, special S-CAROUSEL (scene `ivory`)
- **Hero carousel:** `p01_…-green`, `p02_…-pink`, `p03_…-white`, `p04_…-black` (T1 cut-out, tall 760 px). Do not use `p09` (a food jar).
- **Hallmark:** ivory card (teal logo). Eyebrow `CENY PRO VÍTĚZE · MČR 2026`.

| t | On screen / motion | Text |
|---|---|---|
| 0.25 | Green thermos centre on the glass plinth, sides blurred | — |
| 2.00 / 4.00 / 6.00 | Carousel steps (pink → white → black), vertical sweep on each arrival | — |
| 2.00 | Headline | Ceny pro *vítěze* |
| 4.00–5.00 | Tags (navy on ivory scene) | **0,5–0,7 l** / termosky Zojirushi · **až 6 h** / horké i studené · **20+ let** / na přívlači |
| URL | — | bosset.cz |
| SFX | lid click (DOUBLE LOCK) on each carousel step | — |

### 4.5 Finale (10.0 s, bars 1–5 local)
VO S1 0.50–2.00, S2 4.40–7.70.

| t | B | On screen | Motion | Text |
|---|---|---|---|---|
| 0.00 | 1.1 | The louvre (face: velvet + full tricolour ribbon) opens | M1 in | — |
| 0.25–2.00 | 1.1+ → | **Jewel tray:** 8 hallmark mini-cards (7 sponsors + Líheň), 2×4 grid, card 356×150, gap 20, x 174–906, y 470–1130. Zigzag order, one card every 0.25 s. | M5 per card (no URL). Each seal ticks like a watch. | logos |
| 2.00 | 2.1 | Thanks | M6: serif-hero italic + grot-xl caps, y 1160–1400 | *Děkujeme* / SPONZORŮM |
| 3.00 | 2.3 | **Tray glint:** one diagonal sweep across the whole wall | M4 (one bar, `screen`, masked to the card union) | — |
| 4.00 | 3.1 | Wall and thanks recede: wall container scale .9, opacity .22, `blur(6px)`; thanks fades | 1.0 s `silk` | — |
| 4.00 | 3.1 | **TA plate undocks** to hero (centre y ≈ 664) | M10 undock 1.25 s | — |
| 4.75 | 3.2+ | Full-width ribbon under the plate | M6 ribbon (720 px) | — |
| 5.25 | 3.3+ | Championship line + date line | `meta` reveals | MISTROVSTVÍ ČR V TROUT AREA 2026 / {DATUM} · {MISTO} |
| 5.50 | 3.4 | TA plate sheen + glint | M4 | — |
| 6.00 | 4.1 | Sign-off | M6 (serif-h1 italic, y 1230) | *Uvidíme se u vody.* |
| 8.00 | 5.1 | **GH signature** at y 1392, centred: `MADE BY` · gear (ring rotates 0 → 120°, 2.0 s `none`; core static) · `© 2026` · `word-line.png` (height 22) | fade + y 8 → 0, 0.5 s `reveal` (on the final music stab) | MADE BY ⚙ © 2026 Gausse Holler |
| 9.40–10.00 | 5.3+ | Master: hold (end card). Loop variant: louvre closes 9.40 → 9.875. | — | — |

---

## 5. Sound

### 5.1 Music brief
Tempo **120.000 BPM** (locked), key A minor. Genre: **luxury runway house / minimal tech-house**, a glossier sibling of the existing `vo/suno_sponzori.md` brief, which is compatible (also 120 BPM). If that track already exists, it can be used. Replace its shouted vocals with a whisper or nothing, because shouts fight the luxury tone.

Suno prompt (luxury variant):
- **Style:** `luxury fashion runway house, 120 bpm, deep minimal tech-house groove, warm round sub bass, crisp shaker and closed hi-hats, glassy crystal pluck arpeggios, felt piano stabs, soft cinematic risers, Paris fashion week show, elegant expensive minimal, A minor, instrumental-focused with lots of space for voice-over, clean polished master`
- **Exclude:** `aggressive, distorted, hard techno, festival EDM drop, dubstep, trap, guitar, choir, singing verses, autotune, lo-fi, chiptune, shouting`
- **Lyrics/structure:** `[Intro – filtered kick, crystal arp, riser] [Whisper: "Trout Area"] [Drop – groove, sparse] [Groove – instrumental] [Break – half-time, filtered, glass textures] [Drop – groove] [Final hook – full groove] [Outro – single stab, reverb tail] [End]`

Edit plan (bars at 120 BPM, 2 s each; generate 2:00+, cut on downbeats from librosa, then quantise/warp to exactly 120.000):

| Section | Cut B bars (time) | Cut A bars | Under |
|---|---|---|---|
| Intro (filtered, riser into 5.1) | 1–4 (0–8) | 1–4 | Title card |
| Drop A | 5–24 (8–48) | 5–20 | V, TS, AF, MO, JI |
| Breakdown (half-time, LPF ~800 Hz, no kick) | 25–28 (48–56) | 21–24 | **GH noir** |
| Drop B (kick back on 29.1 = louvre open) | 29–36 (56–72) | 25–32 | VR, BO |
| Final hook + outro stab on 41.1 + 2 s tail | 37–41 (72–82) | 33–37 | Finale |

Mix: music under VO ducks −7 dB (sidechain from the VO bus, attack 80 ms, release 400 ms). Master −14 LUFS integrated, −1 dBTP. Banner loops: 4-bar cuts from Drop A (or B for the IVORY blocks), 10 ms crossfade at the loop point.

### 5.2 SFX list (block-local times; mixed into one `sfx_stem.wav` by the generator via ffmpeg `adelay`/`amix`)
| File | Character | When | Peak |
|---|---|---|---|
| `lux_louvre_close.wav` | velvet/air whoosh rising + 3 tiny slat clicks | 7.375 (clicks 7.70/7.73/7.76) | −16 dB |
| `lux_louvre_open.wav` | silk swish falling + sub thump | 0.00 | −14 dB |
| `lux_hallmark.wav` | felt thud (80 Hz) + paper card tick | 1.00 | −18 dB |
| `lux_seal.wav` | glass tick, very short | 1.50 | −22 dB |
| `lux_shimmer_A.wav` | crystal chime gliss tuned to A/E, 1 s, peak at 0.5 s | 2.50 (peak 3.00) | −18 dB |
| `lux_ting_[1-4].wav` | tiny bells (A5, C6, E6, A6) cycled deterministically | glint times | −26 dB |
| `lux_tag_flick.wav` | soft card flick | 4.00 / 4.50 / 5.00 | −24 dB |
| `lux_loupe.wav` | glass lens swish | 5.25 | −24 dB |
| `lux_impact_title.wav` | deep boom + shimmer tail | intro 2.00, finale 4.00 | −12 dB |
| `lux_watch_tick.wav` | precision watch tick (on beats) | intro 0–2 s; finale seals 0.25–2.0 | −28 dB |
| Accents | spoon flutter (TS) · rattle (AF) · gummy squish (MO) · tungsten clink (JI) · carbon tock + gear ratchet (GH) · reel drag click (VR) · thermos lid click (BO) · water drip + splash (V) | per §4.4 | −20 dB |
| `lux_gh_gear.wav` | small mechanical click + soft ratchet | finale 8.00 | −20 dB |

Source via `/media-use resolve` (SFX catalogue). Freeze the files into `assets/audio/sfx/` with a ledger entry.

### 5.3 VO timing
- Voice: **Paul Broadcaster, ElevenLabs v3 via HeyGen**, voiceId `02733a92a0db457aadf63b235d2aa457`, `eleven_v3`, `cs` (per BRIEF).
- Delivery: calm, confident, warm smile; "presenting a collection", not shouting an ad. Average about 2.6 words/s.
- **Block window 0.75–7.00 s (6.25 s).** Each block is 2 sentences and ≤ 18 written words. Sentence 1 carries the sponsor name, landing with the hallmark (≈ 1.0 s). Sentence 2 lands with the tags (≈ 3.4 s).
- One file per block (`vo/lux/<id>.wav`), trimmed to the first and last phoneme, placed at block start + 0.75. If a take is longer than 6.25 s: first re-generate with a speed of about 1.05, then shorten using the fallback lines in §6.
- Intro window 2.10–7.10. Finale: S1 0.50–2.00, S2 4.40–7.70.
- The TTS script writes numbers as words (column "TTS" in §6). Brand pronunciation hints: Troutshop [traut-šop], Active Fishing [ektyv fišing], Moonky [múnky], Gausse Holler [gaus holer], Zojirushi [zodžiruši], Bosset [boset]. Domains are not spoken (they are on screen).

---

## 6. Czech VO + on-screen copy

### 6.1 Template (every sponsor block)
```
EYEBROW   PARTNER {NN} · MČR TROUT AREA 2026        (banner: PARTNER · MČR TROUT AREA 2026)
HALLMARK  {LOGO} + {URL}
HEADLINE  {CLAIM}                                    (serif-h1 ≤ 22 zn., 1 accent word in italic)
TAG 1     {CISLO1} / {POPIS1}                        (big ≤ 8 zn., caption ≤ 3 slova)
TAG 2     {CISLO2} / {POPIS2}
TAG 3     {CISLO3} / {POPIS3}                        (optional)
VO        „{JMENO} – {CLAIM_VO}. {FAKT1} a {FAKT2}."    (≤ 18 slov, 2 věty)
```
Event placeholders: `{DATUM}` = **24.–25. 10. 2026**, `{MISTO}` = **Líheň Liběchov** (verified in BRIEF.md / research/mcr_tournament.md). Keep them as variables so the copy can still change.

### 6.2 Filled drafts (facts from `research/*.md`, already verified there)
| Block | VO (written, word count) | TTS spelling (numbers as words) | On-screen headline | Tags |
|---|---|---|---|---|
| **Intro** | Mistrovství České republiky v Trout Area 2026. Představujeme partnery, díky nimž šampionát září. (13) | …v Trout Area dva tisíce dvacet šest. … | *Mistrovství* / ČESKÉ REPUBLIKY / v Trout Area / 2026 · *Partneři šampionátu* | {DATUM} · {MISTO} |
| **V Líheň** | Hostí nás Líheň Liběchov – pstruží líheň s tradicí od roku 1934. Závodí se na Malém Sporťáčku. (16) | …od roku devatenáct set třicet čtyři… | Líheň *Liběchov* | 1934 / tradice líhně · MČR / Malý Sporťáček · 24.–25. 10. / sobota a neděle |
| **Troutshop** | Troutshop – specialista na pstruhy. Rodinná firma od roku 1999 a generální partner Trout Area Slovakia. (15) | …od roku devatenáct set devadesát devět… | Specialista na *pstruhy* | 1999 / rodinná firma · TA SK / generální partner · 4 země / vítězství v závodech |
| **Activefishing** | Active Fishing – e-shop zrozený z vášně pro přívlač. Přes 1 300 plandavek a stovky woblerů. (14) | …Přes tisíc tři sta plandavek… | Z vášně pro *přívlač* | 1 300+ / plandavek · 777 / woblerů · Varivas / japonská špička |
| **Moonky** | Moonky – ručně dělané gumové nástrahy z Česka. Vlastní CNC formy a osm let vývoje s českou reprezentací. (17) | …Vlastní cé-en-cé formy… | Nástrahy, které / pstruzi *milují* | CNC / vlastní formy · 8 let / s reprezentací ČR · 0 ftalátů / moderní guma |
| **Jigovky** | Jigovky – jigy, které chytají. Největší výběr jigových hlaviček, poctivě vyrobených v Česku. (12) | — | Jigy, které *chytají* | 0,4–3 g / barbless trout jigy · 1 300+ / druhů skladem · CZ / vlastní výroba |
| **Gausse Holler** | Gausse Holler – ručně stavěné stojany na pruty. Black Standard Edition: karbon, hliník a limitovaná série. (15) | — | Black Standard *Edition* | 8 / karbonových tubusů · 5 ks / limitovaná série · CZ / ručně stavěno |
| **Velka-ryba** | Velká ryba – přívlačová speciálka z Olomouce. Od roku 2011 e-shop i prodejna, partner Shimano Rod Test Center. (17) | …Od roku dva tisíce jedenáct… | Vše na *přívlač* | 2011 / přívlačová speciálka · Olomouc / e-shop i prodejna · Shimano / Rod Test Center |
| **Bosset** | Bosset věnuje vítězům japonské termosky Zojirushi. Udrží nápoj horký i studený až šest hodin. (14) | — | Ceny pro *vítěze* | 0,5–0,7 l / termosky Zojirushi · až 6 h / horké i studené · 20+ let / na přívlači |
| **Finale** | Děkujeme všem partnerům. Mistrovství České republiky v Trout Area – uvidíme se u vody. (13) | — | *Děkujeme* / SPONZORŮM · *Uvidíme se u vody.* | MISTROVSTVÍ ČR V TROUT AREA 2026 · {DATUM} · {MISTO} |

Fallback S2 lines if a take runs long:
- Velka-ryba: „Od roku 2011 – a partner Shimano Rod Test Center." (9)
- Moonky: „Vlastní CNC formy, vyvíjeno s reprezentací." (6)
- Troutshop: „Rodinná firma od roku 1999." (5)

Copy caveats (from research):
- The numbers 1 340 / 777 (Activefishing) are valid as of 19. 10. 2026.
- „Největší výběr" (Jigovky) and „nejdéle provozovaná speciálka" (Velka-ryba) are the sponsors' own claims. They are fine as their headline/VO, but never restate them as TA's statement.
- Bosset volumes actually in stock: 0,52 l and 0,6 l. The range „0,5–0,7 l" follows the brief.
- „4 země" (Troutshop) = SK, CZ, PL, UA wins per their about-us page.

---

## 7. Implementation notes (HyperFrames / GSAP)

### 7.1 Folder structure
```
mcr-2026-sponzori/
  design/direction_luxury.md            ← this file
  design/sponsors.lux.json              ← per-block data (copy, assets, treatments, specials, order)
  scripts/prep_products.py              ← §2.5 cut-outs, _b18, _dark, asset JSON, duotones, caustics.png
  scripts/build_luxury.mjs              ← generator (Node, same style as klonowiec build.mjs)
  hf/                                   ← HyperFrames project root (master)
    index.html                          ← host: block slots + music + VO + SFX stem
    compositions/lux-intro.html
    compositions/lux-venue.html
    compositions/lux-troutshop.html … lux-bosset.html  (one per sponsor)
    compositions/lux-finale.html
    assets/ fonts/ (Montserrat woff2 + InstrumentSerif ttf) · brand/ (ta_logo_h.png, gh/) · logos/ · products/<id>/ · broll/ (T3 duo) · textures/ (grain.png, caustics.png) · svg/ · audio/ (track_120.wav, sfx_stem.wav, banner_loop_A.wav) · vo/lux/*.wav
  hf-banners/<id>/index.html            ← standalone wrapper per block
                 assets -> ../../hf/assets, compositions -> ../../hf/compositions   (symlinks, like klonowiec proto/9x16/assets)
```

### 7.2 Master host (`hf/index.html`, standalone root, no `<template>`)
```html
<div id="root" data-composition-id="mcr-lux" data-start="0" data-duration="82" data-width="1080" data-height="1920">
  <div id="lux-intro" data-composition-id="lux-intro" data-composition-src="compositions/lux-intro.html"
       data-start="0" data-duration="8" data-track-index="2" data-width="1080" data-height="1920"
       data-variable-values='{"lvOut":"assets/broll/velky_sportak_duo.jpg"}'></div>
  <div id="lux-venue" data-composition-id="lux-venue" data-composition-src="compositions/lux-venue.html"
       data-start="8" data-duration="8" data-track-index="2" data-width="1080" data-height="1920"
       data-variable-values='{"lvIn":"assets/broll/velky_sportak_duo.jpg","lvOut":"assets/broll/d1_05_duo.jpg","index":"","mode":"master"}'></div>
  <!-- … one slot per block, data-start = 8*k … finale data-duration="10" -->
  <audio id="music" class="clip" src="assets/audio/track_120.wav" data-start="0" data-duration="82" data-track-index="0" data-volume="1"></audio>
  <audio id="vo-intro" class="clip" src="assets/vo/lux/intro.wav" data-start="2.10" data-duration="5.0" data-track-index="1"></audio>
  <!-- vo-<id>: data-start = blockStart + 0.75 -->
  <audio id="sfx" class="clip" src="assets/audio/sfx_stem.wav" data-start="0" data-duration="82" data-track-index="3"></audio>
</div>
```
- Cut A vs Cut B: the generator flag `--cut A|B` drops the venue slot and recomputes `data-start`s and the stems. Order comes from `sponsors.lux.json.order`.
- The host timeline is a near-empty `gsap.timeline({paused:true})` registered as `window.__timelines["mcr-lux"]`. **Do not** nest the block timelines; the runtime drives them.

### 7.3 Block sub-composition (`compositions/lux-<id>.html`)
- Templated form: `<template>` contains **all** `<style>`, markup and `<script>` (head content is dropped by the assembler).
- Root per `hyperframes-core/references/sub-compositions.md`: `data-composition-id="lux-<id>"`, 1080×1920 via `data-width`/`data-height`, `inset:0`, no hard-coded px size. Timeline key `window.__timelines["lux-<id>"]`, equal to the host slot's `data-composition-id`.
- **Every element id is prefixed with the block key** (`ts-hero`, `ts-lv`, `ts-hm`…), and every tween targets ids. Shared CSS uses classes; block-specific overrides are scoped by `[data-composition-id="lux-troutshop"] …`. This prevents cross-block selector bleed in the assembled page.
- **Layer stack** (z-index), all inside the block:
  1. velvet/pool/softbox/caustics/monogram/selvedge
  2. bg sisters
  3. hero (+shadow, reflection)
  4. tags/threads
  5. loupe
  6. fg bokeh
  7. glints
  8. hallmark + headline
  9. grain + vignette
  10. louvre (z 50)
  11. **TA plate (z 90)**
  
  The stage container (layers 2–7) carries `mask-image: linear-gradient(to bottom, transparent 380px, #000 440px)` to protect the masthead lane.
- **Fonts:** an `@font-face` block is inlined in each template (lint rule `font_family_without_font_face`), URLs `assets/fonts/...`.
- **Variables** (declared on `<html data-composition-variables>`):
  - `lvIn`, `lvOut` (image URLs for the louvre faces): bound via CSS custom properties `--lvIn`/`--lvOut` on two slat-face sets (IN set visible 0–4 s, OUT set visible 4–8 s; swapped with `tl.set` opacity at 4.0 under the open louvre).
  - `index` (eyebrow number, empty for banners), `outMode` (`louvre` | `fade`).
  
  Read once at init via `window.__hyperframes.getVariables()` for logic. Scalar vars are also auto-exposed as `--<id>` CSS props.
- **Beat times:** with the track warped to exactly 120.000 BPM, local beat k = `0.5*k` in **every** block. That is why the same sub-comp file serves both master and banner. The generator asserts: the librosa beat grid of `track_120.wav` deviates < 15 ms from the arithmetic grid, and block starts fall on every 4th downbeat. If warping is impossible, fallback: the generator emits `lux-<id>.master.html` (grid-baked) and `lux-<id>.banner.html` (nominal) from the same template function.

### 7.4 Banner wrapper (`hf-banners/<id>/index.html`)
```html
<div id="root" data-composition-id="banner-<id>" data-start="0" data-duration="8" data-width="1080" data-height="1920">
  <div id="lux-<id>" data-composition-id="lux-<id>" data-composition-src="compositions/lux-<id>.html"
       data-start="0" data-duration="8" data-track-index="1" data-width="1080" data-height="1920"
       data-variable-values='{"lvIn":"assets/broll/<id>_cover_duo.jpg","lvOut":"assets/broll/<id>_cover_duo.jpg","index":"","mode":"banner","outMode":"louvre"}'></div>
  <!-- optional: <audio id="music" class="clip" src="assets/audio/banner_loop_A.wav" data-start="0" data-duration="8" data-track-index="0"></audio> -->
</div>
```
- The 10 s variant is generated with the time-warp `W(t)` (§3.5) into `compositions/lux-<id>.b10.html` and a wrapper with `data-duration="10"`.
- Exports per sponsor: `banner_<id>_8s.mp4`, `banner_<id>_10s.mp4`, `banner_<id>_poster.png` (snapshot at 7.0 s), and an optional `_sound` version.

### 7.5 Generator (`scripts/build_luxury.mjs`)
Port klonowiec's proven pattern: a `T(sel, from, to, pos)` helper pushes tween strings, `rnd(seed)` gives determinism, and HTML is assembled in template literals. Add a small motion library with one function per signature move:
```js
// each returns tween strings; k = block key; all positions numeric, precomputed
louvreIn(k, t=0) · louvreOut(k, t=7.375) · rackFocus(k, sel, t, dir='in') · turntable(k, pose) ·
sheen(k, target, t, {dur=1.0, opacity=.85}) · glint(k, slot, t) · hallmark(k, t=1.0, variant) ·
couture(k, sel, t, nChars) · ribbon(k, sel, t) · priceTag(k, j, slot, anchor, t) · loupe(k, path, t=5.25) ·
pave(k, slots, times) · breath(k, downbeats) · dock(k, dir, t)
const W = (t) => (VARIANT === 'b10' && t >= 6 ? t + 2 : t);   // time-warp for 10 s banners
```
- Inputs: `design/sponsors.lux.json` (order, copy, asset ids, scene, specials, tag slots), `hf/assets/products/**/<asset>.json` (anchors), `hf/assets/audio/track_120.beats.json`.
- Asserts:
  - headline ≤ 22 chars (or 2-line ≤ 20/20)
  - tag big ≤ 8 chars, caption ≤ 3 words
  - VO ≤ 18 words
  - no element bbox enters x > 908 or the masthead lane
  - every VO wav ≤ 6.25 s
- It also builds `sfx_stem.wav` (ffmpeg `adelay` + `amix`) from the per-block SFX plan, so the SFX timing comes from the same constants as the visuals.

### 7.6 Determinism and performance
- No `Math.random`, `Date.now` or `performance.now`. Finite repeats only. All `fromTo`, with `immediateRender:false` on later same-property tweens. No `from()`. No tweens on `.clip`, `display` or `visibility`. Do not pair a CSS initial `transform` with a GSAP tween on the same element (lint `gsap_css_transform_conflict`). Initial states live in `fromTo`.
- Blur radius is never animated on large layers (pre-baked `_b18` crossfades). Allowed live blur: text ≤ 6 px, plus the finale wall container (one layer).
- At most 4 `mix-blend-mode` layers per frame (sheen, softbox, caustics, grain). `mask-image` only on the sheen, stage and reflection.
- Images pre-sized to 1.25× display (2.2× for loupe sources). Per-block DOM < 160 nodes.
- Render: check the summary line for `beginframe` + GPU. `screenshot` + software GPU is the slow path with this many masks and blends. Fallback: bake caustics, monogram and selvedge into one pre-rendered 8 s muted `<video>` loop (`assets/textures/ambient_8s.mp4`) per scene mode.
- Validation:
  1. `npx hyperframes check` (0 findings; clear lint errors first so the layout/contrast audits actually run)
  2. `npx hyperframes snapshot --at` 1.0, 3.0, 5.5, 7.0 of every block plus 0.0 / 7.9 to prove the closed-louvre identity
  3. `animation-map.mjs` audit for dead zones and stagger consistency
  4. `contrast-report.mjs` on the ivory scenes
- Preview: `npx hyperframes preview --background`. Render only after user approval.

---

## 8. Risks and open questions
1. **Duration conflict:** 60–75 s (task) vs. a separate venue block plus ~1:36 in the Suno note (BRIEF). Pick Cut A or Cut B.
2. **Flat-packshot rotation:** TURNTABLE above ±32°, or on photos of 3D objects, exposes the 2D cut-out. It is restricted by design (GH/Bosset/venue use Dolly, Angle-cut or Carousel).
3. **Cut-out quality:** thin hooks (Jigovky, cranks) and the Troutshop watermark. Mitigated by T2 multiply and a manual check of every `<asset>.png` at 200 %.
4. **Source resolution:** Velka-ryba JPGs (~60–80 KB) and Bosset p07 (326×1200) may sit below the 1.25× cap at hero size. Then shrink the display size, use T4, or upscale.
5. **Fonts:** Instrument Serif has only Regular and Italic, so hierarchy relies on size and the Montserrat pairing. Montserrat 700 is missing locally.
6. **Music:** the Suno tempo may drift (the klonowiec track was 123.05). A warp to 120.000 is required for "one file = master + banner". Otherwise use the two-file fallback (§7.3).
7. **Render cost:** masks plus blends plus 3D transforms in headless Chromium. Verify the GPU path early with one block before building all 10.
8. **Copy to confirm with sponsors/user:** the GH product name (Black Standard Edition vs. Revolut 8 Standard Edition Black), the Bosset volume range, whether Fandovy plandavky joins (an extra block slots in at +8 s), and the final block order.
9. **B-roll:** user fishing videos are still missing. The louvre faces and venue block run on existing photos until they arrive (drop-in via `lvIn`/`lvOut` variables).
