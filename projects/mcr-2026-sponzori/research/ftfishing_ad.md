# FT Fishing: reklamní blok (svět značky, hrdinové, koncepty)

Datum: 22. 10. 2026. Podklady: `research/ftfishing.md` (+ Verification), `research/ftfishing_brands.md`, `vo/script_cs.json › blocks.ftfishing`, `vo/ftfishing.words.json`.
Zadání operátora (22. 10.): stejné schéma jako ostatní obchody — storytelling, nástrahy, značky; **hlavní fokus FAVORITE, CRAZY FISH, SPINMAD**; blok ve filmu **před blokem místa konání (Liběchov)**, vlastní Reel + FB bannery; role **„Věnuje ceny · MČR 2026“** (konkrétní ceny neznámé → nic konkrétního).
Blok: **5 taktů ≈ 9,15 s** (takt ≈ 1,83 s), VO od 0,25 s.

## 1. Assety

### Logo FT Fishing — `assets_prep/ftfishing/`
- `logo.svg` (vektor z `css/local/logo.png` 500×500, vtracer po barevných vrstvách), `logo_on_light.png` 1881×1879, `logo_on_dark.png` (šedá #878786 → #C9CAC8, zelená beze změny), `logo_nosl_on_light|on_dark.png` 1881×1604 bez řádku „VŠE PRO PŘÍVLAČ“ (pro malé velikosti a chip). Skript `scripts/assets_prep/ftfishing/prep_logo.py`.
- Logo je **čtvercové** (FT / okoun v kruhu / FISHING) → v plaketě/lockupu dávat na výšku, ne na šířku; vždy ≤ logo TA (plocha i šířka).

### Produkty — `assets_prep/ftfishing/ads/` (průhledné PNG, `_sheet.jpg` na tmavé #0E1110 / světlé #F2F2F0 / FT zelené #6DB52C, `manifest.json`)
| Soubor | Produkt | Rozměr | Pozn. |
|---|---|---|---|
| **H1_spinmad_impulse_pro_10g_3907_firetiger** | Spinmad Impulse PRO 10 g Firetiger | 2400×921 (+ `_shadow`) | HF 4k; vyčištěný odlesk stolu pod břichem (`erase_pale`) |
| **H2_crazyfish_vibro_fat_4in_09_caramel** | Crazy Fish Vibro Fat 4" barva 09 Caramel | 2400×545 (+ `_shadow`) | HF 4k z 460 px — glitr drží, detail „malovaný“ |
| **H3_favorite_totem_2000s_reel** | Favorite Totem 2000S | 1941×2400 (+ `_shadow`) | HF 4k, otevřená mezera v bailu |
| **H4_favorite_x1_2000s_reel** | Favorite X1 2000S (nápis X1, zelená cívka = FT zelená!) | 1996×2400 (+ `_shadow`) | HF 4k |
| **H5_spinmad_target_spoon_1-5g_3201_pair** | Spinmad Target Spoon 1,5 g 3201 (fluo žlutá + černá) — **trout-area plandavka** | 1118×1800 (+ `_shadow`) | HF 4k; očko přepasováno kruhem, bílý lem hrany přebarven |
| S1_spinmad_impulse_pro_10g_3908_electric_lime | Impulse PRO 10 g Electric Lime | 802×327 | nativ |
| S2_spinmad_hart_9g_spicy_blade_3705_firetiger | Cikáda Hart 9 g Spicy Blade | 1075×653 | 3 otvory otevřené |
| S3_spinmad_king_14g_spicy_blade_3801 | Cikáda King 14 g Spicy Blade | 1265×691 | |
| S4_crazyfish_scalp_minnow_100_06_chartreuse | Scalp Minnow 100 mm 06 | 479×122 | malé, ≤ 1,3× |
| S5_crazyfish_nimble_50_14_motor_oil | Nimble 50 mm 14 (rak) | 389×390 | malé |
| S6_crazyfish_polaris_68_4d_pair | Polaris 6,8 4D (2 ks) | 656×585 | |
| S7_crazyfish_glider_55_20_kiwi | Glider 55 mm 20 Kiwi | 475×107 | malé |
| S8_crazyfish_comet_2-5in_20_kiwi | Comet 2,5" 20 Kiwi (průsvitná) | 460×349 | |
| S10_favorite_arena_stream_arns1_rod | Favorite Arena Stream ARNS1 (2 díly, diagonála) | 1200×909 | tenký — nekřížit text |
| S11_favorite_x1_2000s_reel_native | X1 2000S nativ (záloha k H4) | 736×878 | |

Pipeline: `isolate.py` (z fotky obchodu vymaže logo výrobce / název / UV odznak, ořez) → ISNet (`scratchpad/bgnode/rmbg.mjs medium`) → `cut_ft.py` (cutout3 + open_white + decontaminate + per-job opravy: `underside_ghost` z Moonky, `erase_pale`, `punch_eye`, `clear_box`) → `sheet_ft.py`. HF: 10 kr. (`hf_log.md`). Vyřazeno: Nano Minnow 70 3D (šedé studio, ghost-removal ukousl břicho), navijáky Arena/Blue Bird (dvojfoto, každý ~400 px).
Zbytky (OK pro pohyb): u gum Crazy Fish (zdroj 460–640 px) mírně měkké hrany; Nimble má vylisované „CF“; H1 drobné tečky u závěsu háčku při 4× zoomu; H5 nazelenalý okraj žluté plandavky = hrana plechu.

### Loga značek — `assets_prep/ftfishing/brands/` (favorite, spinmad, crazyfish, svfishing, vanfook, jigovky; `_on_dark`, `_sheet.jpg`) — viz `ftfishing_brands.md`.

## 2. Svět značky

### Barvy (logo + CSS webu `css/all.css` + hero banner)
| Token | Hex | Zdroj | Role |
|---|---|---|---|
| ft-green | **#6DB52C** | logo (FT, FISHING) | hlavní akcent, pruhy, čipy |
| ft-green-ui | #2EA200 | CSS: odkazy, ceny, tlačítka, `h1` kategorií | sytější varianta pro text na bílé |
| ft-green-dark | #237C00 | CSS (rangeSlider handle) | stín/gradient zelené |
| ft-grey | #878786 | logo (okoun, kruh, slogan) | sekundární, tenké linky |
| ink | #333333 / #1A1A1A | CSS text, patička #333 | text na světlé, tmavé pozadí |
| paper | #FFFFFF / #DDDDDD | CSS header, menu lišta | hlavní pozadí (web je bílý) |
| — značky — | Favorite chrom + červená ≈ #B33840 · Spinmad šedá ≈ #9EA2A6 + modrá #066BB4 · Crazy Fish magenta #E3027D + černá · SV černá + růžová #E21E70 | loga (měřeno na pixelech) | lokální akcenty v taktech značek |

**Motiv:** hero banner webu = bílé pole, nahoře a dole **zelené šikmé pruhy** (jako výstražná páska / „rychlost“), uprostřed logo FT, po stranách loga značek. To je hotový „svět“: bílá + zelené šikmé pruhy + okoun v kruhu. Druhý motiv: **kruhová závorka „( )“** kolem okouna v logu → rámeček/iris pro hrdiny.

### Typografie
- Logo: „FT“ a „FISHING“ = vlastní široké techno písmo se zaoblenými rohy; slogan „VŠE PRO PŘÍVLAČ“ = široký polotučný grotesk (blízko Saira SemiExpanded/Semi Condensed 700). Web používá Source Sans Pro (generické, nepoužívat).
- **Návrh:** display **Saira (wdth 125 = Expanded, wght 800)** — široké hranaté verzálky ladí s „FISHING“; texty/čipy **Saira (wdth 100, 600–700)** verzálky, tracking +0,04 em. Soubory jsou v `fonts/` (saira variable wght×wdth, latin + latin-ext, OFL; registr `scripts/lib/fonts.mjs`). Čeština ověřena v bloku Bosset (Ř, Č, Ě…).
- Pozor: Bosset blok už používá Saira Expanded Black → u FT rozlišit **vahou a barvou** (800, zelená/černá na bílé, ne bílá na tealu) nebo alternativa **Exo 2 800** (`fonts/exo-2-*-wght-normal|italic.woff2`, latin-ext) pro titulky — techno, zaoblené rohy, blíž „FT“. Doporučení: **Exo 2 800 (titulky) + Saira 600 (čipy, URL)**.

### Tón
Praktický, „od vody“, vlastník píše sám (František Čáha, články „Přívlač podle slabikáře“, „Spinmad – rotující ocásky“). Krátké věcné údery: VŠE PRO PŘÍVLAČ · PRUTY · NAVIJÁKY · NÁSTRAHY. Žádné superlativy, žádné „oficiální dovozce“.

## 3. VO (hotové) — `vo/ftfishing.wav` 6,12 s, take 1
„**FT Fishing – vše pro přívlač. Pruty Favorite, nástrahy Crazy Fish a Spinmad.**“ (12 slov, TTS: „Ef té fišing – vše pro přívlač. Pruty Fejvorit, nástrahy Krejzy fiš a Spinmad.“)
Časy v bloku (offset 0,25 s): *FT* 0,26 · *Fishing* 0,55–1,11 · *vše* 1,33 · *pro* 1,59 · *přívlač* 1,88–2,47 · *Pruty* 2,63 · *Favorite* 3,08–3,67 · *nástrahy* 3,86 · *Crazy* 4,45 · *Fish* 4,87–5,19 · *a* 5,31 · *Spinmad* 5,51–6,15 (konec 6,37 s → 2,8 s rezerva).
Takty (1,83 s): T1 0–1,83 · T2 1,83–3,66 · T3 3,66–5,49 · T4 5,49–7,32 · T5 7,32–9,15. Každé jméno značky padá do „svého“ taktu: Favorite → T2, Crazy Fish → T3, Spinmad → T4. Ideální pro „1 značka = 1 takt“.

## 4. Dva koncepty (5 taktů)

Společné: plaketa TA CZ vždy viditelná a ≥ logo FT; chip **„Věnuje ceny · MČR 2026“** v lockupu i v end cardu Reels; ≥ 6–8 nástrah (máme 5 Spinmad + 6 Crazy Fish + 4 Favorite = 15 položek); přechody na barvu dalšího bloku (venue) podle BLOCK_API.

### A) „VŠE PRO PŘÍVLAČ — TŘI ZNAČKY, TŘI TAKTY“ (DOPORUČENO)
Svět: bílý „papír“ webu + **zelené šikmé pruhy** (#6DB52C, 30°) jako stíračka mezi takty; každá značka dostane na jeden takt **svůj barevný svět** (chrom/červená, magenta/černá, modrá/stříbrná), ale pruhy FT drží jednotu. Typo Exo 2 800 verzálky.

| Takt | Obraz | Typo / VO |
|---|---|---|
| T1 0–1,83 | Hard cut: zelené pruhy přejedou kadr (wipe) a odhalí **logo FT** (okoun v „( )“ — kruhová závorka se roztáhne jako iris). Na *Fishing* se iris otevře do bílé | „VŠE PRO PŘÍVLAČ“ (slovo po slovu na *vše · pro · přívlač* 1,33–2,47) |
| T2 1,83–3,66 | **FAVORITE**: diagonála prutu Arena Stream (S10) projede kadrem jako „rychlostní pruh“, na downbeat T2 + *Pruty* slam **H4 X1 2000S** (zelená cívka rýmuje se zelenou FT), whip na **H3 Totem**, chromový sweep po cívce; logo Favorite (`favorite.png`) malé vpravo dole | „PRUTY · NAVIJÁKY“ + logo Favorite na *Favorite* 3,08 |
| T3 3,66–5,49 | **CRAZY FISH**: pozadí přepne na magentu/černou (barvy loga), **H2 Vibro Fat** projede s glitrovým leskem, pak na beaty „hejno“ gum S4–S8 (Scalp Minnow, Glider, Comet, Polaris, Nimble) v rychlých střizích / vějíři; badge `crazyfish_on_dark` (chip) | „NÁSTRAHY“ na *nástrahy* 3,86, logo CF na *Crazy Fish* 4,45 |
| T4 5,49–7,32 | **SPINMAD**: modro-stříbrný svět, **H1 Impulse PRO** slam s rotačním „spin“ blur (rotující ocásek), na doby S2 Hart → S3 King → S1 Electric Lime (cikády, výměna na místě), na poslední dobu **H5 Target Spoon** pár — trout-area plandavka; logo Spinmad | logo Spinmad na *Spinmad* 5,51; drobně „TARGET SPOON 1,5 g“ |
| T5 7,32–9,15 | **Lockup** na bílé + zelené pruhy dole: logo FT (on_light), řádek tří log značek (Favorite · Crazy Fish · Spinmad, stejná plocha), **ftfishing.cz**, chip „Věnuje ceny · MČR 2026“; výstup do barvy venue | URL Saira 700, chip |

- Plusy: přesně splňuje fokus (každá značka = takt, zarovnáno s VO), barevně bohaté (tři světy) a přitom jednotné (FT zelená, pruhy); hodně produktů (13–15). Zelená cívka X1 = vizuální most k FT zelené. Mínusy: tři světy v 9 s jsou rychlé; nutné, aby loga značek byla malá a nepřebila TA plaketu.
- **Reel (`BLOCK=ftfishing REEL=1`):** hook = makro H1 Impulse PRO (Firetiger) se sweepem + „VŠE PRO PŘÍVLAČ“ (settle 1,06→1, žádné masky na 1. kadru) → blok → end card na bílé s pruhy: logo FT + 3 loga + ftfishing.cz + „Věnuje ceny · MČR 2026“ + plaketa TA (`plate.hero(-0.42)`).
- **FB bannery** (`mcr-2026-bannery`, `scripts/sponsors/ftfishing.mjs`): scény T2/T3/T4 jako tři karty karuselu (Favorite / Crazy Fish / Spinmad) + titulní karta s logem FT; statiky 1:1 a 4:5 = lockup T5 s H4 + H1 + H2.

### B) „OBCHOD OD VODY — STĚNA ZNAČEK“
Svět: grafitová tma (#1A1A1A) + FT zelená jako neon; jako regál/stěna e-shopu.

| Takt | Obraz | Typo |
|---|---|---|
| T1 | Logo FT na grafitu, zelená linka okolo „( )“ se vykreslí | „VŠE PRO PŘÍVLAČ“ |
| T2 | Mřížka 3×4 „dlaždic“ (všech 15 produktů) se poskládá na doby, dlaždice Favorite se zvýrazní (ostatní ztmavnou) | logo Favorite, „230+ PRUTŮ“* |
| T3 | Stejná mřížka, zvýrazní se Crazy Fish | „700+ NÁSTRAH CRAZY FISH“* |
| T4 | Zvýrazní se Spinmad, H1 vyjede z mřížky dopředu | „300+ NÁSTRAH SPINMAD“* |
| T5 | Mřížka odjede, lockup | ftfishing.cz + chip |
*živá čísla 22. 10., jen s „v nabídce“.
- Plusy: čísla dávají „váhu“ obchodu, jeden konzistentní svět. Mínusy: blízko e-shop banneru (operátor dříve odmítl „katalog“), tmavý svět se tlučeme s venue/Gausse Holler, gumy Crazy Fish z malých zdrojů (460 px) v mřížce vedle 4k hrdinů nesedí kvalitou.

**Doporučení: A „Tři značky, tři takty“** — VO je napsané přesně pro to (jméno značky v každém taktu), bílý svět s pruhy je originální vůči ostatním blokům a čerpá přímo z webu FT. Z B převzít nanejvýš jeden drobný počet („700+ nástrah Crazy Fish“) jako podtitulek v T3.

## 5. Ověřená fakta pro titulky
| Text | Zdroj |
|---|---|
| VŠE PRO PŘÍVLAČ | logo FT |
| Pruty a navijáky Favorite · Nástrahy Crazy Fish · Nástrahy Spinmad | menu/kategorie ftfishing.cz |
| Target Spoon 1,5 g · Impulse PRO 10 g · Hart 9 g · King 14 g · Vibro Fat 4" · X1 2000S · Totem 2000S · Arena Stream | názvy produktů FT |
| 700+ nástrah Crazy Fish · 300+ Spinmad · 230+ prutů Favorite (v nabídce, 22. 10.) | výpisy kategorií |
| ftfishing.cz | doména |
Nepoužívat: „oficiální/výhradní dovozce“, ceny, konkrétní ceny MČR, původ značek, „nejlepší/největší“.

## 6. Otevřené body
1. Fonty: Exo 2 vs Saira — rozhodne autor bloku (Saira Expanded je už u Bosset).
2. Výslovnost: take 1 „Ef té fišing … Spinmad“ (česky), alternativy v `vo/prev/ftfishing.take2|3.*` („Ef tý“, „Spinmed“) — schválit u operátora.
3. Hrdina Crazy Fish je soft bait (MČR = hard baits) — v bloku jen jako značka, ne „nástraha na MČR“.
4. Vyšší kvalita gum Crazy Fish: zdroje FT jen 460–640 px; případně dodat packshoty od FT (e-mail fishingtradecz@gmail.com) nebo HF upscale dalších barev (2 kr./ks).
