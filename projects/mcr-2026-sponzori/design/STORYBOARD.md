# STORYBOARD: „KOLEKCE PARTNERŮ MČR 26"

Master: **75.0 s**, 1080 × 1920, 30 fps, 120 BPM (beat 0.5 s, bar 2.0 s).
Built as intro 4.0 + 8 Looks × 8.0 + finale 7.0 = 37½ bars.
Grid, moves (M1–M12), tokens and banner rules: `DESIGN.md`. Czech VO: `VO_TEMPLATE.md`.

Conventions:
- `b1…b16` = block-local beats (b1 = 0.00, b5 = 2.00, b9 = 4.00, b13 = 6.00).
- Master time = block start + local t.
- All times are frame-quantised by `q(t)` and snapped to `track.beats.json` (±40 ms).
- **Bold** = informative on-screen text (counts toward the 4-block limit).
- „MEGA" is always the partner's own name.

---

## 1. Master running order

| # | Segment | Set | Master | Bars | In | Out (louvre still → next Look) | Music |
|---|---|---|---|---|---|---|---|
| 0 | INTRO, title card | VOID + b-roll → NAVY | 0.00–4.00 | 1–2 | film start | SPOON IRIS | Intro build |
| L01 | **Líheň Liběchov** (místo konání) | PHOTO → ORTHO | 4.00–12.00 | 3–6 | SPOON IRIS | louvre: `br08_landing_ripples` | Drop + Groove A |
| L02 | **Troutshop.eu** | PAPER | 12.00–20.00 | 7–10 | louvre | `br05_reeling_portrait` | Groove A |
| L03 | **Activefishing.cz** | NAVY | 20.00–28.00 | 11–14 | louvre | `br03_fish_in_net` | Groove A |
| L04 | **Moonky** | PAPER | 28.00–36.00 | 15–18 | louvre | `br13_lure_check` | Groove A |
| L05 | **Jigovky.cz** | NAVY | 36.00–44.00 | 19–22 | louvre | `br07_landing_rod_up` | Groove B |
| L06 | **Velka-ryba.cz** | DIPTYCH | 44.00–52.00 | 23–26 | louvre | `br12_keepnet_trout` | Groove B |
| L07 | **Bosset.cz** (ceny) | PAPER + red podium face | 52.00–60.00 | 27–30 | louvre | `br09_landing_rods_flare` | Groove B, filter lift |
| L08 | **Gausse Holler** | STUDIO | 60.00–68.00 | 31–34 | louvre | GEAR IRIS | „Black" groove |
| F | FINALE | NAVY + monogram → caustics | 68.00–75.00 | 35–37½ | GEAR IRIS | end card | Final hook, stab 74.00 |

All louvre stills are in `assets_prep/broll/duo_navy/`.

**Why this order** (proposal; the user decides, and the cover-state contract makes any order free):
- The venue sets the scene and gets the drop.
- Sets alternate light and dark like runway looks.
- The two spoon shops (L02, L06) are separated, and so are the two makers (L04, L05).
- Prizes are the climax before the author.
- GH closes, because the gear becomes the door to the „MADE BY" finale.

**Hero preset per Look** (brief mapping):
| Kind | Look | Preset | What it shows |
|---|---|---|---|
| Venue | L01 | `scan` | Real place → map |
| Shop | L02 Troutshop | `rail` | Brand mix: Velvet Arts · Nories · FishUp |
| Shop | L03 Activefishing | `catwalk` | Brand mix: Nories · Khor · Velvet Arts · Lucky Craft · Timon |
| Shop | L06 Velká ryba | `flip` | Shimano hero + brand mix Illex · Daiwa |
| Maker | L04 Moonky | `grid` | Own soft-bait colourways |
| Maker | L05 Jigovky | `lens` | Own jig heads, swatches, barbless |
| Rod stand hero | L08 Gausse Holler | `spec` | Revolut 8 Black Standard Edition |
| Prize | L07 Bosset | `podium` | Zojirushi thermoses 0,5–0,7 l |

### 1.1 Audio lanes (master)
| Lane | Content |
|---|---|
| Music | One track, 120.000 BPM. Crash on each Look's downbeat (the louvre opens on it). Shout „Trout Area!" ≈ 71.0. Final stab at 74.00 |
| VO | Intro 0.25–3.60 · each Look at block + 0.50 → ≤ block + 6.50 (hard + 7.00) · finale A 68.40–70.60, B 72.20–73.80 |
| SFX | Pre-rendered per block (`audio/sfx/LNN_<slug>.wav`); the master stem is concatenated |
| Ducking | Music −7 dB under VO (attack 120 ms, release 350 ms) |

---

## 2. INTRO: „MČR" title card (0.00–4.00, bars 1–2)
The TA plate is docked in the header **from frame 0** (BRIEF: logo always on).
VO 0.25–3.60: „Mistrovství České republiky v Trout Area 2026."

| Beat | t | Picture / motion | On screen | SFX / music |
|---|---|---|---|---|
| b1 | 0.00 | VOID `#050d22` + grain. **Backstage b-roll** #1 `br01_fight_splash` (NAVY DUO) full-bleed at 70 %, Ken Burns 1.06 → 1.00 over 2.0 s (glide). **MEGA „MČR"** (white, fit ≤ 440, stretch 1.10) slams centre (y ≈ 640–1010), M2 | **MČR** | Filtered kick + sub |
| b2 | 0.50 | Hard cut to b-roll #2 `br02_netting_sunrays`. MEGA pump 1.03 | — | SFX02 shutter |
| b3 | 1.00 | **TA UNDOCK-SLAM**: plate to hero (x 120, y 690, 840 × 297), 0.40 s `power4.out` to scale 1.04, then 0.25 s `power3.out` to 1. Full-frame flash .30. MČR → GHOST behind. Hard cut to b-roll #3 `br04_net_with_fish` | (TA hero) | SFX01 impact; riser starts |
| b4 | 1.50 | Hard cut to b-roll #4 `br15_net_splash`. LABEL types under the plate (600/28, 0.28em, white, char stagger 0.015): 2 lines at y 1010 / 1050 | **MISTROVSTVÍ ČESKÉ REPUBLIKY / V TROUT AREA** | SFX12 ticks |
| b5 | 2.00 | B-roll fades out (0.40 s) to NAVY STAGE. Monogram fades in (0.50 s). **DISPLAY „2026"** red, 220 px, slams at y 1100–1290. Runway lights start (chase only) | **2026** | Kick |
| b6 | 2.50 | LABEL sky 600/28 at y 1310 | **24.–25. 10. 2026 · LÍHEŇ LIBĚCHOV** | Tick |
| b7 | 3.00 | Chip (card fill, navy text, tricolour tab) at y 1368–1440. Hem tape fades in (0.3 s) | **KOLEKCE PARTNERŮ** | Snare roll |
| b8 | 3.50 | **TA DOCK** 3.50–3.95 (`expo.inOut`) back to the header. All intro elements exit (`yPercent −110`, 0.25 s `power3.in`, stagger 0.03). **SPOON IRIS cover** 3.70 → 4.00: a red procedural spoon flies at camera (`scale .1 → 9`, `rotation −30 → 0`, `power3.in`) | — | SFX05 reverse cymbal |
| — | 4.00 | Last frame = full red spoon body, eyelet hole r 0 at (540, 883), TA plate on top | — | Drop at 4.00 |

Flash events: 1.00 (TA slam) and ≈ 3.95 (spoon iris).

---

## 3. LOOK template (applies to every Look; Look tables below list only what is specific)

| Beat | t | Layer | Event | Move |
|---|---|---|---|---|
| b1 | 0.00 | louvre | **OPEN** 0.00–0.61, centre first, window glint (iris variant for L01 in the master) | M1 |
| | 0.04 | MEGA | **SLAM** (partner name) | M2 |
| | 0.04–0.14 | set | SPOT ON flicker (navy / studio only) | M3 |
| | 0.10 | LOOK card | Flap digits (3 f period) + red rule | M9 |
| | 0.00 → | rig | Lights chase, hem tape, ambient texture, grain (running from frame 0) | M10 |
| b2 | 0.50 | floor | Red thread draws | M3 |
| | 0.50 | audio | **VO in** | — |
| b3 | 1.00 | plate | **HALLMARK LABEL**; tab stamp + **URL** at 1.25 | M11 |
| b4 | 1.50 | stage | **Product arrival #1** (preset) | M7 + preset |
| b5 | 2.00 | copy | **ONE-LINER** (line rise). MEGA pump + GHOST (dark) / STEP-BACK (paper) | M2 |
| b6–b8 | 2.50–3.50 | stage | **Signature move of the preset**, glint(s), ≤ 1 strobe | M4–M8 |
| b9 | 4.00 | copy | **FACT A** (chip, or DISPLAY in the D slot). MEGA pump (dim to .35 if DISPLAY) | — |
| b10 | 4.50 | stage | Preset beat (counter / lens / flip) | — |
| b11 | 5.00 | copy | **FACT B** (chip; moves up to the C2 slot when fact A is a DISPLAY) | — |
| b12 | 5.50 | stage | Glint #2 | M6 |
| b13 | 6.00 | stage | **HERO LOCK** (0.60 s settle). MEGA pump. Nothing readable moves after 6.60 | — |
| b14 | 6.25 / 6.50 | header / stage | TA plate SHEEN / wink star (optional strobe #2) | M12 / M6 |
| b15 | **7.00** | — | **POSTER FRAME** | — |
| b16 | 7.30–7.85 | louvre | **CLOSE** edges first (fader jitter ≤ 2 f), glint 7.55, held closed to 8.00 | M1 |
| — | ≤ 7.00 | audio | VO hard end (target ≤ 6.50) | — |

One big move per bar: **bar 1 = identity · bar 2 = product signature · bar 3 = facts · bar 4 = hero lock + poster.**

---

## 4. The Looks

### L01 · LÍHEŇ LIBĚCHOV: „Místo konání" · master 4.00–12.00 · PHOTO → ORTHO · preset `scan`
| | |
|---|---|
| MEGA | LIBĚCHOV (1 line, ≈ 216 px) |
| LOOK card | LOOK 01 / 08 · MÍSTO KONÁNÍ |
| Plate | INK medallion: Líheň disc Ø 104 + „LÍHEŇ / LIBĚCHOV" |
| URL | lihenlibechov.cz |
| One-liner | Dějiště MČR / v Trout Area 2026 |
| Fact A | DISPLAY 1934 + label PSTRUŽÍ LÍHEŇ OD ROKU |
| Fact B | Malý Sporťáček · 24.–25. 10. |

Strobes: 0. Ambient: caustics.

| Beat | t | Master | Picture / motion | On screen | SFX |
|---|---|---|---|---|---|
| b1 | 0.00 | 4.00 | **SPOON IRIS** opens (hole r 0 → 1250, 0.40 s `expo.out`, chrome ring on the edge). Banner: louvre. PHOTO set: `v01_maly_sportacek.jpg` (or the drone flyover, muted `<video>`, 2 s) in COVER GRADE, Ken Burns 1.06 → 1.00 over 2.0 s. MEGA slams white solid | LIBĚCHOV · LOOK 01 / 08 | Crash (drop) + SFX17 plip |
| b2 | 0.50 | 4.50 | Red thread. Caustics fade in (0.5 s). VO in | — | — |
| b3 | 1.00 | 5.00 | Hallmark plate (medallion) + URL | **lihenlibechov.cz** | SFX26 |
| b4 | 1.50 | 5.50 | **SCAN** 1.50 → LAND 2.00: the photo wipes to `v05_orto_duo.jpg` (NAVY DUO ortho at 1.0, transform-origin = Malý Sporťáček centroid) | MICRO „SCAN · LIBĚCHOV" | SFX25 |
| b5 | 2.00 | 6.00 | **ORTHO PUSH** 1.0 → 2.4 (2.00–4.00, `power2.inOut`; magnification ≤ 1.0 from `orto_core_6400`). MEGA → GHOST. One-liner | **Dějiště MČR / v Trout Area 2026** | — |
| b7 | 3.00 | 7.00 | **PIN LOCK**: viewfinder corners fly to the pond bbox (0.24 s), bite red → ice at 3.24. Red crosshair (circle r 34 + 4 ticks, 4 px) draws 0.40 s at the measured centroid (50.412996 N, 14.457456 E; pixel position via `orto_core_6400.jgw`). TAG + MICRO to its right | MALÝ SPORŤÁČEK · 50.4130° N 14.4575° E | SFX24 + SFX18 |
| b9 | 4.00 | 8.00 | **FACT A DISPLAY**: label + odometer „1934" (white, 180 px) in the D slot. MEGA dims to .35 | **PSTRUŽÍ LÍHEŇ OD ROKU 1934** | SFX13 |
| b11 | 5.00 | 9.00 | **FACT B** chip (C2 slot) | **Malý Sporťáček · 24.–25. 10.** | Tick |
| b13 | 6.00 | 10.00 | HERO LOCK: ortho holds at 2.4; crosshair breathes 1 → 1.04 → 1 (0.6 s, once) | — | Soft impact |
| b14 | 6.25 | 10.25 | TA sheen | — | — |
| b15 | 7.00 | 11.00 | **POSTER** | — | — |
| b16 | 7.30 | 11.30 | Louvre close, still `br08_landing_ripples` | — | SFX09 |

Hem tape carries the house line. The altitude claim („donedávna nejníže položené pstruhařství v Evropě, 164 m n. m.") appears only in the VO and only with „donedávna".

### L02 · TROUTSHOP.EU: „Showroom rail" · master 12.00–20.00 · PAPER · preset `rail`
| | |
|---|---|
| MEGA | TROUT / SHOP (navy) |
| LOOK card | LOOK 02 / 08 · PARTNER · MČR 26 |
| Plate | INK |
| URL | troutshop.eu |
| One-liner | Milujeme lov pstruhů |
| Fact A | Rodinná firma od roku 1999 |
| Fact B | Generální partner TA Slovakia |

Strobes: 2 (3.50, 6.50).

| Beat | t | Master | Picture / motion | On screen | SFX |
|---|---|---|---|---|---|
| b1 | 0.00 | 12.00 | Louvre opens onto PAPER. MEGA slams navy solid (2 lines ≤ 288 px) | TROUT / SHOP · LOOK 02 / 08 | SFX08 |
| b2 | 0.50 | 12.50 | Red thread. **RAIL**: chrome tube 8 px (`--chrome`, shadow below) at y 640, x −20 → 1100, `scaleX 0 → 1` from the left, 0.50 s `power3.inOut`. VO in | — | SFX04 |
| b3 | 1.00 | 13.00 | Hallmark plate + URL | **troutshop.eu** | SFX26 |
| b4 | 1.50 | 13.50 | **RAIL SLIDE**: 3 hangers slide in from the right along the rail (travel 0.60 s, stagger 0.10) to slots x 270 / 540 / 810. Each hangs on a 1 px `#304285` 60 % thread from the rail to its **eye anchor**:<br>(1) `h01` Velvet Arts Forte 2,1 g Glow Pink, h 300, thread 120<br>(2) `h04` Nories Crankin' Pupa 2,6 g, hung nose-up from its line tie, long side 280, thread 60<br>(3) `h05` FishUp Baffi Fly 1,5 g, h 240, thread 150<br>On stop: PENDULUM about the eye. TURNTABLE ±24° starts on (1) φ 0 and (3) φ 0.5 | — | SFX27 rail slide; SFX07 tinkles A5 / C6 / E6 on stops |
| b5 | 2.00 | 14.00 | One-liner. MEGA step-back to 16 % | **Milujeme lov pstruhů** | — |
| b6 | 2.50 | 14.50 | **HANG TAGS**: white paper tags (auto width, 44 h, r 6, 1 px keyline, punched hole) hang 34 px above each eye on the thread, TAG 800/24 navy. Wipe in, stagger 0.08; tags rest at ±3° | VELVET ARTS · NORIES · FISHUP | Paper flick |
| b7 | 3.00 | 15.00 | **GLINT** on spoon 1: sweep at 2.725 → peak 3.00 = face-on, + star | — | SFX06 |
| b8 | 3.50 | 15.50 | **STROBE #1** on the crank; swing kick (rotation 0 → 4°, then pendulum back) | — | SFX02 + SFX03 |
| b9 | 4.00 | 16.00 | **FACT A**. MEGA pump | **Rodinná firma od roku 1999** | Tick |
| b11 | 5.00 | 17.00 | **FACT B**. Glint on spoon 3 at 5.225 (peak 5.50 = its face-on) | **Generální partner TA Slovakia** | Tick + SFX06 |
| b13 | 6.00 | 18.00 | HERO LOCK: swings settle to 0 (the turntables continue as ambient) | — | Soft whoosh |
| b14 | 6.25 / 6.50 | 18.25 / 18.50 | TA sheen / **STROBE #2** (halation only) on spoon 1 | — | SFX02 |
| b15 | 7.00 | 19.00 | **POSTER** (spoon 1 face-on) | — | — |
| b16 | 7.30 | 19.30 | Louvre close, still `br05_reeling_portrait` | — | SFX09 |

### L03 · ACTIVEFISHING.CZ: „By the numbers" · master 20.00–28.00 · NAVY · preset `catwalk`
| | |
|---|---|
| MEGA | ACTIVE / FISHING (white) |
| LOOK card | LOOK 03 / 08 · PARTNER · MČR 26 |
| Plate | INK (orange fish) |
| URL | activefishing.cz |
| One-liner | Pro všechny, / kdo milují přívlač |
| Fact A | DISPLAY 1 300+ PLANDAVEK |
| Fact B | Osobní přístup, rychlé doručení |

Strobes: 2 (2.50, 6.50). Ambient: monogram.

| Beat | t | Master | Picture / motion | On screen | SFX |
|---|---|---|---|---|---|
| b1 | 0.00 | 20.00 | Louvre → NAVY STAGE + SPOT ON + monogram. MEGA slams white | ACTIVE / FISHING · LOOK 03 / 08 | SFX08 + SFX10 |
| b2 | 0.50 | 20.50 | Red thread. VO in | — | — |
| b3 | 1.00 | 21.00 | Hallmark plate + URL | **activefishing.cz** | SFX26 |
| b4 | 1.50 | 21.50 | **VIEWFINDER** flies in from the canvas corners (0.30 s `expo.out`). **CATWALK step 1**: `h01` Nories Sofia arrives at centre (rack focus sharp). Neighbours are blurred sisters. Bite at 1.74. Label tail | NORIES · SOFIA 1,2 g | SFX11 + SFX24 |
| b5 | 2.00 | 22.00 | Step 2: `h02` Khor Frea (≤ 240 px tall). One-liner. MEGA → GHOST | **Pro všechny, / kdo milují přívlač** · KHOR · FREA 0,7 g | SFX11 + SFX24 |
| b6 | 2.50 | 22.50 | Step 3: `h03` Velvet Arts Forte 0,6 g. **STROBE #1** + seeded pose snap | VELVET ARTS · FORTE 0,6 g | SFX11 + SFX02 + SFX03 |
| b7 | 3.00 | 23.00 | Step 4: `h04` Lucky Craft WAH 33F | LUCKY CRAFT · WAH 33F | SFX11 + SFX24 |
| b8 | 3.50 | 23.50 | Step 5: `h05` Timon Chibi Futten (hologram). Glint (screen) at 3.75 | TIMON · CHIBI FUTTEN | SFX11 + SFX06 |
| b9 | 4.00 | 24.00 | **FACT A DISPLAY**: label PLANDAVEK, odometer 0000 → 1300, then „+" flaps (0.9 s). MEGA dims to .35. Catwalk holds on Timon | **1 300+ PLANDAVEK** | SFX13 |
| b11 | 5.00 | 25.00 | **FACT B** (C2 slot) | **Osobní přístup, rychlé doručení** | Tick |
| b13 | 6.00 | 26.00 | HERO LOCK: final step to Sofia (the strip duplicate), bite, brackets settle | NORIES · SOFIA 1,2 g | SFX11 + SFX24 |
| b14 | 6.25 / 6.50 | 26.25 / 26.50 | TA sheen / **STROBE #2** (halation, no pose) | — | SFX02 |
| b15 | 7.00 | 27.00 | **POSTER** | — | — |
| b16 | 7.30 | 27.30 | Louvre close, still `br03_fish_in_net` | — | SFX09 |

The 1 300+ figure is the count as of 19. 10. 2026 (1 340 items). Recheck it on export day.

### L04 · MOONKY: „Atelier colourways" · master 28.00–36.00 · PAPER · preset `grid`
| | |
|---|---|
| MEGA | MOONKY (navy, 1 line) |
| LOOK card | LOOK 04 / 08 · PARTNER · MČR 26 |
| Plate | INK (white logo) |
| URL | moonky.cz |
| One-liner | Ručně dělané / gumové nástrahy |
| Fact A | Vlastní formy z CNC strojů |
| Fact B | Vyvíjeno s českou reprezentací |

Strobes: 2 (3.00, 6.50). Overshoot: rubber only.

| Beat | t | Master | Picture / motion | On screen | SFX |
|---|---|---|---|---|---|
| b1 | 0.00 | 28.00 | Louvre → PAPER. MEGA slams navy | MOONKY · LOOK 04 / 08 | SFX08 |
| b2 | 0.50 | 28.50 | Red thread. VO in | — | — |
| b3 | 1.00 | 29.00 | Hallmark plate + URL | **moonky.cz** | SFX26 |
| b4 | 1.50 | 29.50 | **COLOURWAY GRID 3 × 3**: tiles 160, gap 14, x 286–794, y 568–1076. T2 white tiles; C05 is a T7 ink tile. Order:<br>C01 Scelet pink (`p03`) · C02 Coccon orange (`p02`) · C04 Coccon Jr black (`p04`)<br>C06 Savory green (`p01`) · **DC04 Coccon yellow/orange** (`p09`, centre) · C05 Master white (`p05`)<br>C08 Scelet Jr coffee (`p07`) · DC03 Savory brown/orange (`p08`) · C01 Savory pink (`p06`)<br>RUBBER pop: `scaleX 1.35 → 1, scaleY .7 → 1, opacity 0 → 1`, 0.60 s `elastic.out(1,.45)`, stagger `{each:.09, grid:[3,3], from:'start'}` (1.50–2.94). MICRO codes under the tiles | C01 … DC04 (decoration) | 9 × SFX14 squeaks, pentatonic A minor |
| b5 | 2.00 | 30.00 | One-liner. MEGA step-back | **Ručně dělané / gumové nástrahy** | — |
| b7 | 3.00 | 31.00 | **STROBE #1** + SQUISH: all baits `scaleY .9 → 1`, 0.5 s rubber | — | SFX02 + SFX14 |
| b9 | 4.00 | 32.00 | **GRID → HERO**:<br>• 8 tiles exit (scale 0, 0.30 s `power3.in`, stagger 0.03 from centre outward)<br>• the centre tile swaps (`tl.set`, same pose) to the RGBA hero `h01_coccon_yellow_orange` and scales 1 → 2.6 (0.50 s `expo.inOut`)<br>• its tile background fades, leaving the bait on paper with a contact shadow<br>**FACT A** | **Vlastní formy z CNC strojů** | SFX04 |
| b10 | 4.50 | 32.50 | Hero wobble `rotation ±3°` (three 0.5 s `sine.inOut` legs, 4.50–6.00) | — | — |
| b11 | 5.00 | 33.00 | **FACT B** | **Vyvíjeno s českou reprezentací** | Tick |
| b13 | 6.00 | 34.00 | HERO LOCK (rotation 0). **WOVEN LABEL** pops at the hero's right shoulder (rubber): ink label 236 × 52, 2 px dashed `#8ea2d8` inner stitch, tricolour tab, TAG | HANDMADE LURES | SFX26 + SFX14 |
| b14 | 6.25 / 6.50 | 34.25 / 34.50 | TA sheen / **STROBE #2** + squish | — | SFX02 |
| b15 | 7.00 | 35.00 | **POSTER** | — | — |
| b16 | 7.30 | 35.30 | Louvre close, still `br13_lure_check` | — | SFX09 |

Copy guardrail: the MČR format is hard baits. Moonky is presented as a partner and maker, never as a bait used at this event.

### L05 · JIGOVKY.CZ: „Macro swatches" · master 36.00–44.00 · NAVY · preset `lens`
| | |
|---|---|
| MEGA | JIGOVKY (white, 1 line) |
| LOOK card | LOOK 05 / 08 · PARTNER · MČR 26 |
| Plate | INK (white logo with slogan) |
| URL | jigovky.cz |
| One-liner | „Jigy, které chytají!" (their slogan, in quotes) |
| Fact A | TroutJig Barbless 0,4–3 g |
| Fact B | Poctivě vyrobeno v ČR |

Strobes: 0 (lens-local blooms only).

Custom layout:
- lens Ø 460 at (540, 800), spanning y 570–1030
- swatch strip y 1040–1124: 5 cards of 144 × 84 (colour block 48 h, then TAG 24), x 156–924
- swatch rail = the red thread at y 1132 (2 px sky line + red 144 × 4 active indicator)
- one-liner one line at y 1150
- facts at 1284 and 1368

| Beat | t | Master | Picture / motion | On screen | SFX |
|---|---|---|---|---|---|
| b1 | 0.00 | 36.00 | Louvre → NAVY + SPOT ON + monogram. MEGA slams white | JIGOVKY · LOOK 05 / 08 | SFX08 + SFX10 |
| b2 | 0.50 | 36.50 | Swatch rail draws. VO in | — | — |
| b3 | 1.00 | 37.00 | Hallmark plate + URL | **jigovky.cz** | SFX26 |
| b4 | 1.50 | 37.50 | **LENS** opens (paper interior) on the FLUO 0,4 g head detail `h04` at ≤ 1.0×. Ring ticks rotate. Glint across the head at 1.75 | — | SFX16 |
| b5 | 2.00 | 38.00 | MEGA → GHOST. **SWATCH STRIP** on 8ths: 2.00 FLUO · 2.25 PINK · 2.50 GOLD · 2.75 ORANGE · 3.00 RED. Card wipe `inset(100% 0 0 0) → inset(0)` 0.22 s `expo.out`. Each card swaps the lens image (`tl.set`) with a lens-local bloom, and the red indicator jumps (`tl.set x`). Weights as MICRO: 0,4 g ×4, 1,3 g | FLUO · PINK · GOLD · ORANGE · RED | 5 × SFX15, pitched |
| b6 | 2.50 | 38.50 | One-liner | **„Jigy, které chytají!"** | — |
| b8 | 3.50 | 39.50 | Glint + star on the RED head | — | SFX06 |
| b9 | 4.00 | 40.00 | **LENS SWAP** by rack focus (0.40 s) to the full TroutJig Barbless `h01` (≤ 440 px wide). The indicator hides. **BARBLESS CALLOUT**: line from the hook point (`anchors.tail`) to a TAG outside the lens (right, x ≤ 936), draws 0.35 s. **FACT A** | **TroutJig Barbless 0,4–3 g** · BEZ PROTIHROTU | SFX21 |
| b11 | 5.00 | 41.00 | **FACT B** | **Poctivě vyrobeno v ČR** | Tick |
| b13 | 6.00 | 42.00 | HERO LOCK (lens drift ends) | — | — |
| b14 | 6.25 / 6.50 | 42.25 / 42.50 | TA sheen / glint + star on the jig head | — | SFX06 |
| b15 | 7.00 | 43.00 | **POSTER** | — | — |
| b16 | 7.30 | 43.30 | Louvre close, still `br07_landing_rod_up` | — | SFX09 |

Prep: GOLD and ORANGE need the new crops `h06` / `h07` (DESIGN §2.6). Until then the strip has 3 cards (2.00 / 2.25 / 2.50). Do not say „největší výběr" or „vlastní výroba" (VO_TEMPLATE §2).

### L06 · VELKA-RYBA.CZ: „Diptych" · master 44.00–52.00 · DIPTYCH · preset `flip`
| | |
|---|---|
| MEGA | VELKÁ / RYBA (navy on paper) |
| LOOK card | LOOK 06 / 08 · PARTNER · MČR 26 |
| Plate | INK |
| URL | velka-ryba.cz (navy on paper) |
| One-liner | Vše na přívlač (white, in the navy panel) |
| Fact A | Olomouc · od roku 2011 |
| Fact B | Partner Shimano Rod Test Center |

Strobes: 2 (1.50, 3.50).

| Beat | t | Master | Picture / motion | On screen | SFX |
|---|---|---|---|---|---|
| b1 | 0.00 | 44.00 | Louvre → DIPTYCH (paper y 0–1100, navy panel from 1100). MEGA slams navy | VELKÁ / RYBA · LOOK 06 / 08 | SFX08 |
| b2 | 0.50 | 44.50 | Red thread on the paper floor (y 1080). VO in | — | — |
| b3 | 1.00 | 45.00 | Hallmark plate + URL | **velka-ryba.cz** | SFX26 |
| b4 | 1.50 | 45.50 | **HERO SPOON** `h05` Shimano Cardiff Roll Swimmer CE 4,5 g, FRONT face: rack focus + drop `y −600 → 0`, 0.45 s `power4.out`, to (540, 820), long side 520. **STROBE #1** (pose `{rotation:-6}`). TAG under it | SHIMANO · CARDIFF 4,5 g | SFX02 + SFX03 |
| b5 | 2.00 | 46.00 | One-liner. MEGA step-back | **Vše na přívlač** | — |
| b6 | 2.50 | 46.50 | **SPOON FLIP → BACK** (0.42 s) + edge shade. Glint + star at 2.92 (new face-on) | — | SFX06 („shing") |
| b7 | 3.00 | 47.00 | **BRAND-MIX FLANK**, 200 px tall each:<br>(190, 880) Illex Pink Yamame `h01` · (330, 700) Illex Copper Trout `h02`<br>(750, 700) Daiwa Presso Manhattan `h03` · (890, 880) Daiwa Presso Flashing Green `h04`<br>They enter as `_b18` sisters (opacity 0 → .5, 0.3 s), then rack sharp at 3.00 / 3.125 / 3.25 / 3.375. TAGs wipe at 3.25 | ILLEX · DAIWA | 4 × SFX07 |
| b8 | 3.50 | 47.50 | **STROBE #2** (halation only) on the hero | — | SFX02 |
| b9 | 4.00 | 48.00 | **FACT A** | **Olomouc · od roku 2011** | Tick |
| b10 | 4.50 | 48.50 | **FLIP → FRONT**, glint at 4.92 | — | SFX06 |
| b11 | 5.00 | 49.00 | **FACT B** | **Partner Shimano Rod Test Center** | Tick |
| b13 | 6.00 | 50.00 | HERO LOCK: sisters settle (counter-drift ends at 0). Hero FRONT | — | — |
| b14 | 6.25 / 6.50 | 50.25 / 50.50 | TA sheen / wink star | — | SFX06 |
| b15 | 7.00 | 51.00 | **POSTER** | — | — |
| b16 | 7.30 | 51.30 | Louvre close, still `br12_keepnet_trout` | — | SFX09 |

### L07 · BOSSET.CZ: „Ceny" · master 52.00–60.00 · PAPER + red podium face · preset `podium`
| | |
|---|---|
| MEGA | BOSSET (navy, 1 line) |
| LOOK card | LOOK 07 / 08 · CENY PRO VÍTĚZE |
| Plate | INK |
| URL | bosset.cz |
| One-liner | Termosky pro vítěze |
| Fact A | Horké i studené až 6 h (with THERMO DIAL) |
| Fact B | Termosky Zojirushi {OBJEM} (default 0,5–0,7 l) |

Strobes: 2 (2.32, 3.00). Red ≤ 15 %; actual ≈ 4 %.

| Beat | t | Master | Picture / motion | On screen | SFX |
|---|---|---|---|---|---|
| b1 | 0.00 | 52.00 | Louvre → PAPER. MEGA slams navy | BOSSET · LOOK 07 / 08 · CENY PRO VÍTĚZE | SFX08 |
| b2 | 0.50 | 52.50 | Red thread. VO in | — | — |
| b3 | 1.00 | 53.00 | Hallmark plate + URL | **bosset.cz** | SFX26 |
| b4 | 1.50 | 53.50 | **PODIUM** rises on the floor (y 1080):<br>• 2nd x 210–430 h 150 · 1st x 430–650 h 200 · 3rd x 650–870 h 110<br>• faces: `#304285 → #0b1e42` gradient, top edge 4 px `#8ea2d8`<br>• **1st face `#e31e24`** (bottom 20 % `#b5121a`)<br>• numerals 900/72 white<br>`scaleY 0 → 1` from the bottom, 0.40 s `power4.out`, order 1st, 2nd, 3rd, stagger 0.08 | 2 · 1 · 3 | 3 × SFX23 |
| b5 | 2.00 | 54.00 | **THERMOSES DROP**: 1st `h02` Zojirushi SM-VB 0,6 l black (h 360), 2nd `h03` SM-SR mint (h 320), 3rd `h01` SM-SHE orange (h 300). `y −800 → 0` 0.32 s `power3.in`; land squash `scaleY .94 / scaleX 1.04 → 1` 0.18 s `power2.out`; stagger 0.12. **STROBE #1** at 2.32 (1st landing). One-liner. MEGA step-back | **Termosky pro vítěze** | SFX19 clinks + SFX02 + SFX03 |
| b6 | 2.50 | 54.50 | **CYLINDER SPECULAR**: a vertical band (no skew) sweeps L → R across all three thermoses, masked by each alpha, `soft-light`, 0.9 s glide, stagger 0.08 | — | SFX06 |
| b7 | 3.00 | 55.00 | **STROBE #2** (halation only) | — | SFX02 |
| b9 | 4.00 | 56.00 | **FACT A** chip with the THERMO DIAL glyph (ring r 16 + 6 hour ticks; `strokeDashoffset 1 → 0`, 0.70 s) | **Horké i studené až 6 h** | SFX19 lid twist + hiss |
| b11 | 5.00 | 57.00 | **FACT B** | **Termosky Zojirushi 0,5–0,7 l** | Tick |
| b13 | 6.00 | 58.00 | HERO LOCK: the 1st-place thermos scales to 1.04 (0.6 s). Star on its lid at 6.50 | — | SFX22 cheer (−22 dB) |
| b14 | 6.25 | 58.25 | TA sheen | — | — |
| b15 | 7.00 | 59.00 | **POSTER** | — | — |
| b16 | 7.30 | 59.30 | Louvre close, still `br09_landing_rods_flare` | — | SFX09 |

### L08 · GAUSSE HOLLER: „Spec sheet" · master 60.00–68.00 · STUDIO · preset `spec`
| | |
|---|---|
| MEGA | GAUSSE / HOLLER (white) |
| LOOK card | LOOK 08 / 08 · STOJAN NA PRUTY |
| Plate | INK medallion: GH gear (ring + core Ø 104; the ring rotates 0 → 360° over 8 s, `none`, loop-safe) + „GAUSSE HOLLER / CUSTOM LAB" |
| URL | gausseholler.com |
| One-liner | Black Standard Edition |
| Fact A | Ručně stavěno v Česku |
| Fact B | Série 5 kusů, každý číslovaný |

Strobes: 1.

| Beat | t | Master | Picture / motion | On screen | SFX |
|---|---|---|---|---|---|
| b1 | 0.00 | 60.00 | Louvre → STUDIO + SPOT ON. MEGA slams white | GAUSSE / HOLLER · LOOK 08 / 08 | SFX08 + SFX10 |
| b2 | 0.50 | 60.50 | Red thread (60 %). VO in | — | — |
| b3 | 1.00 | 61.00 | Hallmark plate (medallion) + URL | **gausseholler.com** | SFX26; SFX20 ratchet ticks on beats (−24 dB) |
| b4 | 1.50 | 61.50 | **HERO** `h02_revolut8_black_side` (h 520, centre x 540, on the floor) arrives (rack + `y +120`, 0.40 s slam) with rim light. **LIGHT SWEEP** down the carbon tubes: vertical band, skew −40°, masked by alpha, `screen`, 0.9 s glide | — | SFX20 carbon thock |
| b5 | 2.00 | 62.00 | MEGA → GHOST. One-liner. **CALLOUT 1** (tube top → left label) draws | **Black Standard Edition** · 8× KARBON · Ø 32 MM | SFX21 A5 |
| b6 | 2.50 | 62.50 | **CALLOUT 2** (hub / arm → right label) | HLINÍK · ELOX | SFX21 C6 |
| b7 | 3.00 | 63.00 | **CALLOUT 3** (legs → left label). **STROBE #1** (halation) | REVOLUT 8 | SFX21 E6 + SFX02 |
| b8 | 3.50 | 63.50 | Sweep again (0.7 s) | — | SFX06 |
| b9 | 4.00 | 64.00 | **KICK CUT** (no flash) → **RADAR**:<br>• callouts and side hero hide (`tl.set`)<br>• LENS Ø 520 at (540, 820) with the top render `h04`<br>• conic sweep `conic-gradient(from 0deg,rgba(142,162,216,.35),transparent 60deg)` turns 360° per 1.0 s (`none`)<br>• **ROSETTE SPIN** 0 → 45° over 4.0 s (8-arm symmetry, so the end pose matches the start)<br>• 8 mini-brackets (20 px, children of the rotating group) lock onto the 8 tube ends, one per 16th, 4.25 … 5.125, each biting red → ice<br>• TAG under the lens<br>**FACT A** | 8 KARBONOVÝCH TUBUSŮ · **Ručně stavěno v Česku** | SFX28 + 8 × SFX24 (−6 dB) + SFX02 |
| b11 | 5.00 | 65.00 | **FACT B** | **Série 5 kusů, každý číslovaný** | Tick |
| b13 | 6.00 | 66.00 | **KICK CUT** back to the side hero (radar hides). Final sweep | — | SFX02 |
| b14 | 6.25 / 6.50 | 66.25 / 66.50 | TA sheen / glint star on the orange GH inlay on the handle (`_meta.glints`) | — | SFX06 |
| b15 | 7.00 | 67.00 | **POSTER** | — | — |
| b16 | 7.60 | 67.60 | Master: **GEAR IRIS** cover 7.60 → 8.00 (navy gear, sky edge, `scale .2 → 10`, `rotation 0 → 45°`). Banner: louvre close at 7.30 | — | SFX05 + ratchet roll |

---

## 5. FINALE (master 68.00–75.00; finale-local t)
| t | Master | Picture / motion | On screen | SFX / music |
|---|---|---|---|---|
| 0.00 | 68.00 | **GEAR IRIS** opens (hub hole r 0 → 1250, 0.40 s `expo.out`) onto NAVY STAGE + monogram. TA plate docked.<br>**LOGO WALL**: 8 INK plates 400 × 120 (logo artwork ≤ 300 × 84, tricolour tabs) in LOOK order, 2 columns at x 72 / 536 × 4 rows at y 520 / 656 / 792 / 928. Each slams on an 8th note, 0.00 … 1.75: `rotationX 60 → 0`, `scale 1.12 → 1`, 0.25 s `power4.out`, `transformPerspective:1200`, plate-local bloom (exempt) | 8 partner logos | Crash; 8 × SFX02 (−6 dB) |
| 0.40 | 68.40 | VO A | — | VO |
| 2.00 | 70.00 | **RUNWAY-LIGHT CHASE** over the wall: plate borders flash red on 8ths, 2.00–3.75 (the drum pads at full force; plate-local). Wall `scale 1 → .82, y +120`, 0.50 s `expo.inOut`. **HEADLINE** slams at y 430–680 (line rise 0.40 s slam, stagger 0.08) | **DĚKUJEME** (150, white) / **PARTNERŮM** (112, red) | Kick |
| 3.00 | 71.00 | Hold. Music shout „Trout Area!" in the VO gap (70.6–72.2) | — | Shout |
| 4.00 | 72.00 | Wall plates fly out radially (0.35 s `power3.in`, stagger 0.02 from centre). Headline `yPercent −110` (0.25 s). **TA UNDOCK** to hero (4.00–4.55 `expo.inOut`; x 120, y 690, 840 × 297; logo artwork stays inside x 160–920). Monogram crossfades to caustics (1.0 s) | (TA hero) | SFX01 + SFX04 |
| 4.20 | 72.20 | VO B | — | VO |
| 4.60 | 72.60 | Labels under the hero, stagger 0.10:<br>• 800/34 white, y 1020<br>• 600/30 sky, y 1068<br>• URL 700/34, y 1116 | **MISTROVSTVÍ ČR V TROUT AREA 2026** · **24.–25. 10. 2026 · LÍHEŇ LIBĚCHOV** · **troutareacz.cz** | SFX12 ticks |
| 5.00 | 73.00 | **GH MARK** fades in (0.5 s, `y 8 → 0`), centred at y 1330–1390:<br>„MADE BY" (600/24 sky, 0.24em) · gear 60 px (`gear_ring` + `gear_core`; the ring turns 0 → 120° over 2.0 s, `none`) · „© 2026" (600/24 sky) · `wordline_on_dark.png` 24 px tall (≈ 338 px wide) | MADE BY ⚙ © 2026 GAUSSE HOLLER | SFX20 ratchet |
| 6.00 | 74.00 | **FINAL STAB**: full-frame flash .40 → 0 (0.30 s). TA plate pump 1.04 → 1 (0.40 s `power3.out`) | — | Final stab + sub |
| 6.00–7.00 | 74.00–75.00 | Hold the end card. Caustics drift; the GH ring keeps turning (120 → 180°) | — | Reverb tail |

---

## 6. CUT-59 fallback (≤ 60 s)
Intro 4.0 + 8 × **LOOK-6** + finale 7.0 = **59.0 s**. Banners stay 8 / 10 / 6 s.

LOOK-6 = 3 bars:
| Beat | t | Event |
|---|---|---|
| b1 | 0.00 | Louvre open, MEGA, LOOK card |
| b2 | 0.50 | Red thread |
| b2.5 | 0.75 | Plate + URL |
| b3 | 1.00 | Product arrival |
| b5 | 2.00 | One-liner + the preset's signature move (one step only) |
| b7 | 3.00 | Fact A |
| b9 | 4.00 | Fact B + hero lock |
| b11 | 5.00 | Poster |
| — | 5.30–5.85 | Louvre close |

VO: the Look's short line (VO_TEMPLATE), in at 0.40, ≤ 4.6 s.

---

## 7. Banner cut specs (per partner)
All variants come from the same Look template (DESIGN §4.2):
- `lvIn = lvOut = cover still`
- LOOK card reads „MČR **26**" + „KOLEKCE PARTNERŮ"
- runway lights chase only (no position)
- B8 audio: a 4-bar music slice (Groove A for L01–L04, Groove B for L05–L07, „Black" for L08), pre-ducked, + the block VO (`_vo`) or none (`_novo`) + the block SFX

| Partner | Cover still (NAVY DUO) | **B8-LOOP / B8-HOLD** | **B10**: inserted „LOOK HOLD" bar (warped 6.0–8.0) | **L6-LOOP** (6.0 s, no VO; poster state static, cycle below) | Posters |
|---|---|---|---|---|---|
| Líheň Liběchov | `v02_velky_sportak_duo` (new) | As L01, with the louvre instead of the iris | LENS Ø 420 opens lower-right on `v03_trout_in_net` (trophy trout) + SFX17; crosshair breathes | Ortho at 2.4 with the pin. Sonar ring (scale 1 → 2.2, opacity .6 → 0) at 0 / 2 / 4. Caustics 1 tile | B8 7.00 · B10 9.00 |
| Troutshop.eu | `br02_netting_sunrays` | As L02 | Pendulum kick on all three hangers (stagger 0.12), glint on spoon 3 at its face-on, tags swing ±3° | Turntables with a 3 s period. Micro-swing ±2° with a 3 s period. Glints at 1.5 and 4.5 (face-on) | 7.00 · 9.00 |
| Activefishing.cz | `br05_reeling_portrait` | As L03 | Catwalk encore: steps to Velvet Arts (6.5) and Lucky Craft (7.0) with bites; hero lock returns Sofia at warped 8.0 | Catwalk every 3 beats: Sofia → Timon → Velvet → Lucky → Sofia′ (4 steps = 6 s) with viewfinder bites. DISPLAY static 1 300+ | 7.00 · 9.00 |
| Moonky | `br14_crouch_net` (or user photo `u01_jars_stump` in duo) | As L04 | Hero colourway swap with rubber pop: DC04 → C06 green (`h03`) at 6.5 → DC04 at 7.5 | Hero colourway cycle every 1.5 s: DC04 → C06 → C01 pink → DC03 → DC04, rubber pop + squish | 7.00 · 9.00 |
| Jigovky.cz | `br13_lure_check` | As L05 | Lens back to the GOLD macro (6.0) and RED (7.0) with indicator jumps and glints. The callout hides during the bar and returns at warped 8.0 | Lens cycles the 5 swatches every 1.2 s with the indicator. Callout hidden. Fact A chip stays | 7.00 · 9.00 |
| Velka-ryba.cz | `br07_landing_rod_up` | As L06 | Flip → BACK (6.0) → FRONT (7.0), glints at each face-on. Sisters counter-drift | Flip every 1.5 s (4 flips; FRONT at 0 / 6), glint on each face-on | 7.00 · 9.00 |
| Bosset.cz | `br16_dock_gear` | As L07 | Pink SM-SR (`h04`) and green SM-VB (`h05`) slide in behind the podium as `_b18` sisters. Cylinder sweep. 3 steam wisps (SVG, `strokeDashoffset`, 1.2 s) over the 1st thermos + SFX19 hiss | Cylinder specular every 2 s (3 passes). Lid star at 1.0 / 3.0 / 5.0 | 7.00 · 9.00 |
| Gausse Holler | `br09_landing_rods_flare` (or a still from `v01_revolut8_standard_reel`, duo) | As L08 with the louvre instead of the gear iris | Angle cut to the three-quarter render `h03` (6.0) with a tube sweep; hero lock cuts back to the side view at warped 8.0 | RADAR state: rosette 0 → 45° over 6 s, conic sweep 360° per 1.5 s, the 8 brackets re-bite in turn (one per 0.75 s) | 7.00 · 9.00 |

Optional extras:
- **Intro teaser** (4.0 s): the intro unchanged. The last frame (the spoon) cuts to the poster of LOOK 01.
- **Finale** (7.0 s): standalone from a navy cover (louvre instead of the gear iris).

Checks per banner: DESIGN §6.6 items 3, 10, 13, 14. Naming: DESIGN §4.5.
