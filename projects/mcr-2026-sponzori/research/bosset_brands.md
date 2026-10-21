# BOSSET.CZ — brands, wider assortment, prize thermoses, VO v3 (film v3, 21. 10. 2026)

> **RU кратко:** Bosset.cz — Shoptet e-shop для přívlač, 6 254 позиции (21. 10.). На сайте раздел ZNAČKY с 14 плитками-логотипами брендов; все 13 рабочих логотипов скачаны с сайта магазина (`/user/categories/orig/…`) и подготовлены в `assets_prep/bosset/brands/` (прозрачные + версия для тёмного фона). Ядро — **Keitech и YGK X-Braid (официальный дистрибьютор в ČR)**, объём — Select, нишевый слой JDM-воблеров (Megabass, ZipBaits, O.S.P) — актуально, т.к. MČR = формат **hard baits**. Новые вырезки героев ассортимента: ZipBaits Orbit 110 SP, Megabass X-52 Acrobat (прозрачное тело), O.S.P Asura Durga 73 SP, Reins Bubbling Shaker (W1–W4). Призы: термосы **Zojirushi 0,6 l** (бриф оператора); конкретные модели нигде не опубликованы → в кадре только «termosky Zojirushi 0,6 l», модели подтвердить у Bosset. Новый текст VO (15 произносимых слов) — в конце файла и в `vo/script_cs.json`.

All counts, prices and bestseller orders are snapshots of **21. 10. 2026**, fetched through the bridge (Zapier WebHook GET; images by Drive upload of `images.weserv.nl/?url=…&output=png&l=0`). They are internal context, **not on-screen copy** (bosset_ad.md copy guardrails still apply).

---

## 1. Brands presented on the site

Source: https://www.bosset.cz/znacky/ — category "ZNAČKY", 14 sub-categories with logo tiles (`/user/categories/thumb/…`, originals at `/user/categories/orig/…`). Item counts = manufacturer filter of the same page ("Stránka 1 z 522 - 6254 položek celkem").

| # | Brand (site tile) | Items (filter) | What Bosset sells | Logo file (`assets_prep/bosset/brands/`) | Logo source URL |
|---|---|---|---|---|---|
| 1 | **Keitech** | 1 450 | soft baits (19 lines: Easy Shiner, Swing Impact, Live Impact …) + tungsten jig heads (132). **Oficiální distributor pro ČR** | `keitech.png` (377×96) · hi-res `keitech_hires.png` (726×184, same wordmark from velka-ryba.cz) | https://cdn.myshoptet.com/usr/www.bosset.cz/user/categories/orig/znacky_keitech.png |
| 2 | **YGK X-Braid** | 78 + 19 (YGK) | braided lines (Upgrade X8, Cord X8, Super Jigman X8, Bornrush WX8 …), FC Absorber fluorocarbon. **Oficiální distributor pro ČR** | `ygk.png` (913×300) | …/categories/orig/ygk_x-braid1.jpg |
| 3 | **Zojirushi** | 215 | the whole TERMOSKY category (bottles, food jars, spare parts) — **source of the MČR prize thermoses** | `zojirushi.png` (897×263; source tile is only 285×71 → 3× Lanczos, show ≤ 570 px), `zojirushi_on_dark.png` = white chip | …/categories/orig/vrnt2819_896.jpg |
| 4 | Select (Select Tackles) | 2 323 | volume brand: soft baits, wobblers (Prank, Dementor), spoons/spinners/tail spinners (Sonic), rods (Sprint), reels (Reflex), hooks, boxes, clothing | `select.png` (310×88) | …/categories/orig/selectjpg11.jpg |
| 5 | Fresh Lures | 363 | Trout-Area soft baits (FlatWorm, FlipWorm, Kasper, Junior, Mokhnatka …) | `freshlures.png` (357×357), on dark = white chip | …/categories/orig/fresh_lures_logo1.png |
| 6 | Decoy | 248 | area hooks (AH-12 Jiggy Barbless = no. 1 in HÁČKY), jig heads (Round Magic SV-52), sinkers, rings, swivels | `decoy.png` (269×56) | …/categories/orig/decoy1.png |
| 7 | ZipBaits | 156 | JDM wobblers (Orbit, Rigge, Khamsin, B-Switcher, Hickory …) | `zipbaits.png` (920×221) | …/categories/orig/zipbaits_logo.png |
| 8 | Megabass | 85 | JDM wobblers (X-52 Acrobat, Vision Q-GO, PopX, Vision Oneten, X-70 …) | `megabass.png` (304×55) | …/categories/orig/megabass_logo1.png |
| 9 | O.S.P | 58 | JDM wobblers (Asura Durga/Varuna/Rudra, Blitz, Louder, Bent Minnow …) | `osp.png` (347×159) | …/categories/orig/osp_logo.png |
| 10 | Reins | 64 | JDM soft baits (Aji Ringer Shad, Bubbling Shaker, Rockvibe Shad, G-Tail Saturn Micro …) | `reins.png` (616×209) | …/categories/orig/reins_logo.png |
| 11 | X-Fish | 418 | budget rods, reels, wobblers, spoons, fluorocarbon (Hard-X) | `xfish.png` (386×71) | …/categories/orig/x_fish_logo_woby_znacka.png |
| 12 | Brain | 769 (+1 clothing) | carp / feeder gear (rods, reels, bite alarms, rod pods …) — not spinning | `brain.png` (1171×328) | …/categories/orig/brain_logo.png |
| 13 | Bassday | 3 | wobblers (Bun) | `bassday.png` (276×73) | …/categories/orig/bassday_logo.png |
| — | HOPA (Skládací podběrák) | — (not in filter) | folding landing net | not taken: the original tile is only 140×100 | …/categories/orig/logo_v6_final.png |
| — | MojePřívlač.cz | 4 | listed only in the filter (no tile); relation unverified (bosset_ad.md) — do not use | — | — |

Logo files: every brand has `<slug>.png` (transparent, original colours, for light/white backgrounds) and `<slug>_on_dark.png` (dark neutrals lifted to white, colours kept; Zojirushi and Fresh Lures = logo on a white rounded chip, like the shop's own white tile). QA: `assets_prep/bosset/brands/_sheet.jpg` (white · #0A4A58 · black). Manifest with URLs, sizes and counts: `assets_prep/bosset/brands/manifest.json`. Raw downloads: `assets/bosset/brands/`. Script: `scripts/assets_prep/brands_b/prep_brands.py`.

**Recommended brand set for the film / banners (order of importance):**
1. **Keitech · YGK X-Braid** — the shop's own claim: "Oficiální distributor – Keitech a YGK X-Braid pro ČR" (footer banner, https://www.bosset.cz/) and meta "Jsme oficiálním distributorem značek té nejvyšší Japonské kvality - Keitech a YGK X-Braid" (https://www.bosset.cz/).
2. **Zojirushi** — the prize thermoses (end accent).
3. **Megabass · ZipBaits · O.S.P** — JDM hard baits; MČR 2026 is a **hard-baits** format ("Formát: bodovaný, hard baits", research/mcr_tournament.md, troutareacz.cz tournament page).
4. **Fresh Lures · Decoy** — the Trout Area section (TROUT AREA category, 826 items on 19. 10.: Select 423, Fresh Lures 363, Decoy 40).
5. Select as the volume brand (optional). Skip Brain (carp/feeder), X-Fish (budget), Bassday (3 items), HOPA.

---

## 2. Wider assortment map (category → items → brands)

Main menu (https://www.bosset.cz/, menu tree in `/znacky/`): TROUT AREA · ZNAČKY · PRUTY · NAVIJÁKY · GUMOVÉ NÁSTRAHY · WOBLERY · TŘPYTKY, PLANDAVKY, TAIL SPINNERY · JIGOVÉ HLAVIČKY A ZÁTĚŽE · PLETENÉ ŠŇŮRY · FLUOROCARBONY · VLASCE · HÁČKY · PŘÍSLUŠENSTVÍ · ŽIDLIČKY A LEHÁTKA · OBLEČENÍ · TERMOSKY · VYBERTE SI CÍLOVOU RYBU (okoun, pstruh, candát, štika, sumec, tloušť, bolen).

| Category (URL) | Items | Brands (manufacturer filter) | No. 1–3 by `?order=bestseller` |
|---|---|---|---|
| GUMOVÉ NÁSTRAHY `/gumove-nastrahy/` | 2 786 (19. 10.) | Keitech 1 346 · Select 1 011 · Fresh Lures 363 · Reins 66 | Keitech Easy Shiner (whole-shop top 12 = Easy Shiner, 19. 10.) |
| WOBLERY `/woblery/` | 761 | Select 345 · ZipBaits 156 · X-Fish 114 · Megabass (JDM) 85 · O.S.P. (JDM) 58 · Bassday 3 | Select Prank 36F 36 mm 3,1 g · Select Dementor 130SP · X-Fish Deeper 75F |
| TŘPYTKY, PLANDAVKY, TAIL SPINNERY `/plandavky--rotacni-trpytky/` | 571 | Select 398 · X-Fish 173 | Select Sonic 7 g / 10 g (tail spinner) |
| JIGOVÉ HLAVIČKY A ZÁTĚŽE `/jigove-hlavicky-a-zateze/` | 228 | Keitech 132 · Decoy 63 · Select 33 | Decoy Round Magic SV-52 (5 ks) · Decoy Sinker DS-5/DS-6 · Select wolfram |
| PLETENÉ ŠŇŮRY `/pletene-snury/` | 189 (19. 10.) | YGK X-Braid 94 · Select 85 · Brain 10 | YGK X-Braid Cord X8 · Upgrade X8 · Bornrush WX8 (19. 10.) |
| FLUOROCARBONY `/fluorocarbony/` | 28 | X-Fish 15 · Select 8 · YGK X-Braid 5 | X-Fish Hard-X · Select fluorokarbon · YGK FC Absorber Slim＆Strong |
| VLASCE `/vlasce/` | 54 | Brain 54 | Brain Classic Carp Line |
| HÁČKY `/hacky/` | 322 | Decoy 148 · Select 89 · X-Fish 85 | **Decoy Area Hook XII AH-12 Jiggy Barbless** · Decoy Worm 4 / Worm 30 / Worm 17 |
| PRUTY `/pruty/` | 203 | Brain 112 · Select 78 · X-Fish 13 | Brain Black Pond (carp) · **Select Sprint Solid 652SUL-S 1,95 m 0,6–3,5 g** · X-Fish Boss Pole |
| NAVIJÁKY `/navijaky/` | 82 | Brain 35 · Select 29 · X-Fish 18 | X-Fish Terminator 4000 · MPP 3000 · Loki · Select Reflex |
| PŘÍSLUŠENSTVÍ `/prislusenstvi/` | 884 | Brain 558 · Select 220 · Decoy 95 · MojePřívlač.cz 4 | Select lure boxes (SLXD) · Brain floats · Select swivels |
| OBLEČENÍ `/obleceni/` | 32 | Select 29 · Decoy 2 · Brain 1 | Buff · Brain beanie · Select gloves · dresy |
| TERMOSKY `/termosky/` | 215 | Zojirushi 215 | **Zojirushi SM-VB 0,6l Black** · SW-KA 0,52l Beige · SM-WR48 0,48 l |
| ŽIDLIČKY A LEHÁTKA `/zidlicky-a-lehatka/` | 0 | — | page says "Produkty teprve připravujeme." |
| TROUT AREA `/trout-area/` | 826 (19. 10.) | Select 423 · Fresh Lures 363 · Decoy 40 | Decoy AH-12 · Decoy SV-52 · Fresh Lures FlatWorm/FlipWorm (19. 10.) |

Reading for the ad: the spinning/lure core is **soft baits (Keitech) + lines (YGK)**, a **JDM hard-bait** shelf (Megabass, ZipBaits, O.S.P) and a **Trout Area** shelf (Fresh Lures, Decoy). Rods/reels are budget (Select, X-Fish) or carp (Brain) — not hero material. Thermoses are the unusual, prize-relevant line.

### Hero products for the wider assortment (`assets_prep/bosset/ads/`)
Existing (19. 10., see bosset_ad.md): H1–H3, S1–S6 (thermoses, Keitech, YGK spool), L1–L9 (Keitech ×4, Fresh Lures ×2, Select ×2, Decoy SV-52).
**New 21. 10.** — the no. 1 item of each JDM brand category (`?order=bestseller`), shop originals `/user/shop/orig/…` → `assets/bosset/lures2/`, cut by `scripts/assets_prep/brands_b/cut_heroes.py` (cutout3 + clear_plastic + decontaminate, ISNet medium). QA `ads/_wobblers_sheet.jpg` (ink · teal #0A4A58 · light). Meta in `ads/_lures_meta.json`.

| File | Product (exact name on site) | Price 21. 10. | Source px | Cut-out | Product page |
|---|---|---|---|---|---|
| `W1_zipbaits_orbit_110sp_510r.png` 841×277 (+ `_shadow`) | Orbit 110 SP 110mm 16.5g #510R (ZipBaits) | 662 Kč | 815×253 | trebles + split rings kept, frosted see-through lip | https://www.bosset.cz/zipbaits-woblery-orbit-110sp-sr-2/orbit-110-sp-110mm-16-5g--510r/ |
| `W2_megabass_x-52_acrobat_f_shigyo.png` 1008×322 | Megabass X-52 Acrobat F 52mm 3.2g Shigyo | 644 Kč | 1000×500 | **clear body** = glassy alpha (≥ 0,34), eye / foil / orange belly opaque; reads best on dark | https://www.bosset.cz/woblery-megabass-x-52-acrobat-f/megabass-x-52-acrobat-f-52mm-3-2g-shigyo/ |
| `W3_osp_asura_durga_73sp_s76.png` 848×203 | OSP Asura Durga 73 SP 73mm 4.7g S76 (1.4m) | 768 Kč | 1000×667 | single-hook belly, clear lip | https://www.bosset.cz/woblery-osp-asura-duraga-73sp/osp-asura-durga-73-sp-73mm-4-7g-s76--1-4m/ |
| `W4_reins_bubbling_shaker_4in_567.png` 823×124 | Soft Lure Bubbring Shaker 4" 567 Lilac Silver & Blue Flake (12 pcs/pack) (Reins) | 189 Kč | 800×99 | small source (99 px tall): grid tile only | https://www.bosset.cz/gumove-nastrahy-reins-bubbling-shaker-4/soft-lure--bubbring-shaker-4--567-lilac-silver-blue-flake--12-pcs-pack/ |

Suggested assortment beat (≈ 1 bar): bento/e-shop grid with **one product + its brand logo per tile**: Keitech Easy Shiner (H3/L1) · YGK spool (S6) · Megabass X-52 (W2) · ZipBaits Orbit (W1) · O.S.P Durga (W3) · Fresh Lures FlipWorm (L5) · Decoy SV-52 (L9) · Select Dementor (L8). Never caption prices, counts or "nejprodávanější".

---

## 3. Prize thermoses (end accent)

- What is confirmed: **"Bosset = rybářský e-shop (Keitech, YGK…) + termosky Zojirushi 0,6 l mezi cenami."** (BRIEF.md:11, operator 19. 10.), and the operator's v3 note 21. 10.: "в конце акцент о špičkových термосах, которые получат победители".
- **Exact prize models are not published anywhere we can read**: the MČR tournament page (https://www.troutareacz.cz/tournaments/6aaaf5fd24c8e2804242764b, re-read 21. 10.) lists no prizes; bosset.cz has no MČR page. → On screen say only **"Termosky Zojirushi 0,6 l"**; show the 0,6 l line (H1/H2/S1–S5) as "the kind of bottle", not as "this exact prize". **Ask the operator / Bosset (Taras Burakov, info@bosset.cz) which models and how many.**
- The 0,6 l bottles Bosset sells (all Zojirushi; TERMOSKY volume filter 0,6 l = 8 items):

| Model (exact name on bosset.cz) | Code · EAN | Colour param. | Price | In film assets | Page |
|---|---|---|---|---|---|
| Termoska Zojirushi **SM-VB 0,6l Black** — no. 1 bestseller of TERMOSKY | SM-VB60BM · 4974305226716 | Černá | 1 485 Kč | H1 | https://www.bosset.cz/termosky/termoska-zojirushi-sm-vb-0-6l-black/ |
| Termoska Zojirushi SM-VB 0,6l Green / Beige | SM-VB60GM / SM-VB60CM | (Green / Beige) | 1 485 Kč | S4 / S5 | …/termoska-zojirushi-sm-vb-0-6l-green/ · …-beige/ |
| Termoska Zojirushi **SM-SR 0,6l Green** | SM-SR60EGP · 4974305716217 | Zelená | 1 200 Kč | H2 + H2m (lid macro) | https://www.bosset.cz/termosky/termoska-zojirushi-sm-sr-0-6l-green/ |
| Termoska Zojirushi SM-SR 0,6l Pink / White | SM-SR60EVP / SM-SR60EWA | (Pink / White) | 1 200 Kč | S2 (+ S2m) / S3 | …/termoska-zojirushi-sm-sr-0-6l-pink/ · …-white/ |
| Termoska Zojirushi SM-SHE 0,6l Orange | SM-SHE60DV | Oranžová | 1 347 Kč | S1 (+ S1m) | …/termoska-zojirushi-sm-she-0-6l-orange/ |
| Termoska Zojirushi SM-SF 0,6l Beige | SM-SF60WM | Béžová | 1 200 Kč | — (small packshot) | …/termoska-zojirushi-sm-sf-0-6l-beige/ |

Key specs, verbatim from the shop pages (SM-VB60BM and SM-SR60EGP re-read 21. 10.; parameters "Materiál : Plast, Nerezová ocel", "Objem : 0,6l"):
- "technologie vakuové izolace umožňuje udržet věci horké a studené **až 6 hodin**." (SM-VB, SM-SR; also SM-SHE, SM-SF per bosset.md)
- "TECHNOLOGICKÉ MATERIÁLY: nerezová ocel a ekologický plast **bez BPA**."
- "VNITŘNÍ POVLAK: Nepřilnavý povlak, který neabsorbuje chutě a vůně nápojů." (SM-VB, SM-SR)
- "**DOUBLE LOCK**: tlačítko pro otevření a uzamčení víka. Láhev můžete otevřít **jednou rukou** – stačí přejet a stisknout." (SM-VB, SM-SR only)
- "Plastová tryska umožňuje pít přímo z láhve a chrání vaše rty před spálením." (SM-VB, SM-SR)
- "ÚŽASNĚ LEHKÁ: Díky zmenšené tloušťce ocelového těla váží termoska **téměř stejně jako váš telefon**." (SM-VB; SM-SR "…tloušťce oceli…")
- No weight, dimensions or temperature figures are given on the shop pages; the brand's own spec sheets were not fetched → do not invent "°C po 6 h" or grams.

On-screen copy allowed for the accent (Czech): **"Pro vítěze MČR · termosky Zojirushi 0,6 l"**, **"Horké i studené až 6 hodin"**, **"Double Lock · otevřeš jednou rukou"** (only next to SM-VB/SM-SR visuals), **"bez BPA"**. Not allowed: "jen Bosset věnuje ceny" (all sponsors give prizes, BRIEF.md:11), origin of Zojirushi ("japonská"), "více než 6 hodin", prices.

---

## 4. VO v3 (Bosset) — saved to `vo/script_cs.json` → `blocks.bosset.vo` (old take 3 kept in `cs_prev`)

- **vo.cs (on-screen spelling):** „Bosset – rybářský e-shop: Keitech a YGK. A vítězové mistrovství získají špičkové termosky Zojirushi.“
- **vo.tts (respelled for eleven_v3):** „Boset – rybářský í-šop: Kejtek a wáj dží kej. A vítězové mistrovství získají špičkové termosky Zodžiruši.“
- 13 written words / **15 spoken** (≤ 17). Est. ≈ 34 syllables → ≈ 7,3–7,9 s with Paul (take-3 rate 3,9–4,7 syl/s; take 3 Bosset 27 syl = 6,9 s, Jigovky 15 spoken = 7,9 s) → fits a 5-bar sponsor block (≈ 9,2 s) with VO in at 0,25 s; tighter than the old 6,5 s banner rule — check after TTS.
- Respell choices: Bosset → *Boset*, e-shop → *í-šop* (both approved 19. 10.); **Keitech → *Kejtek*** (how Czech anglers say it); **YGK → *wáj dží kej*** (English letter names, the usual way anglers name the Japanese line brand; alternative if the operator prefers Czech letters: *ypsilon gé ká*, +2 syllables); **Zojirushi → *Zodžiruši***. The `process_v2.py` RESPELL map needs: Keitech→Kejtek (1), YGK→wáj dží kej (3), Zojirushi→Zodžiruši (1).
- Sources: e-shop for přívlač + "Oficiální distributor – Keitech a YGK X-Braid pro ČR" (https://www.bosset.cz/ footer + meta); Zojirushi = TERMOSKY 215/215 (https://www.bosset.cz/termosky/); prizes = BRIEF.md:11 + operator 21. 10. ("špičkové termosky", operator's word).
- Why not three brands in the first half: with Megabass the line grows to ≈ 37 syllables (≈ 8,5 s) and collides with the end card; the logo wall shows the other brands visually (Megabass, ZipBaits, O.S.P, Fresh Lures, Decoy) while the VO names the two official distributions + Zojirushi (= 3 brands spoken).
