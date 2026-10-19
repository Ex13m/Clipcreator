# Troutshop.eu: reklamní blok (sortiment, hrdinové, svět značky, koncepty)

Datum: 19. 10. 2026. Směr: BRIEF.md › „ZMĚNA SMĚRU“ (reklamní film produktů, sponzor ve vlastním vizuálním světě, z TA zůstává jen logo).
Podklady: `research/troutshop.md` (+ Verification), `vo/script_cs.json` › troutshop, `vo/troutshop.words.json`, DESIGN.md (jen choreografie: vějíř plandavek, otočka plandavky ve světle).
Výstupy:
- `assets_prep/troutshop/ads/`: PNG cut-outy, `_ads.json` (velikost, pad, dominantní barvy, glint, zdrojová URL, role) a `_sheet.jpg`.
- Skripty `scripts/assets_prep/ts_ads_finalize.py` a nově `ts_polish.py` (refit oček, defringe).
- Higgsfield log `assets_prep/troutshop/hf_log.md`.
- Fonty v `fonts/` a `proto/assets/fonts/`.

---

## 1. Sortiment a pozicování (stránky staženy přes bridge 19. 10. 2026)

E-shop běží na WooCommerce s motivem WoodMart. Počty jsou z výpisu kategorie („Showing 1–36 of N results“) a z filtru značek (`filter_brand`, počet položek). Položka je jedna barva × gramáž. Cenový strop je horní mez posuvníku ceny, kterou WooCommerce zaokrouhluje nahoru na 10 €.

| Kategorie (URL) | Položek | Značky (filtr, počet položek) | Ceny ve výpisu | Strop filtru |
|---|---|---|---|---|
| Spoons / plandavky `https://troutshop.eu/pc/spoons/` | **3 102** | SV Fishing Lures 1 014 · **Nories 897** · **Forest 636** · Rodio Craft 117 · ValkeIN 102 · Lacko 68 · Velvet Arts 60 · Rapture 49 · Vanfook 32 · YARIE 32 · Daiwa 25 · FATA 11 · FPB Lures 10 · KHOR 6 · Shimano 2 (15 značek) | SV AIR 1 g 4,90 €, Nories / Forest 5,50–6,50 € | 20 € |
| Wobblers `https://troutshop.eu/pc/woblers/` | **992** | **Nories 290** · Rodio Craft 201 · Forest 91 · Mukai 81 · ValkeIN 78 · Daiwa 24 · Rapture 24 · Jackall 20 · Shimano 19 · Smith 18 · Naburaya 16 · Office Eucalyptus 15 · DUO 8 · Daysprout 4 · Hand Made Slovakia 3 · Illex 2 (16 značek) | 9,50 € (Beetle) · 14,90 € (Nories) · 16,90 € (Daiwa Presso) · 19,90 € | 30 € |
| Soft Baits `https://troutshop.eu/pc/soft-baits/` | **698** | **FishUp 474** · Berkley 88 · Libra 73 · Ratter Baits 22 · Rainbow Baits 2 · Fresh Lures 1 | 4,99–8,99 € / balení | 10 € |

Řazení „podle oblíbenosti“ (`?orderby=popularity`, ve WooCommerce podle počtu prodaných kusů), prvních 36 položek:
- **Plandavky** (`https://troutshop.eu/pc/spoons/?orderby=popularity`): první tři místa drží **Nories ROONEY 101** (2,8 g, 2,2 g, 1,8 g). Z 36 položek je 24 ROONEY a 31 Nories (ROONEY, SOFIA, TULLE). Zbylých 5 je Forest MIU (NATIVE 10 a TS4 Limited Color).
- **Woblery** (`https://troutshop.eu/pc/woblers/?orderby=popularity`): 33 z 36 je Nories (MEET 29DR-SS, RUSH BELL, RICE, CRANKIN' PUPA, SPISH, Pelican Minnow). Na 1. místě je Nories MEET 29DR-SS 2,2 g **109**. Barva **109** (čirá) se v žebříčku opakuje (MEET, RUSH BELL a CRANKIN' PUPA 109 je v kategorii první podle názvu).
- **Gumy** (`https://troutshop.eu/pc/soft-baits/?orderby=popularity`): dominuje FishUp Tanta a Pupa. Sedí to s textem na webu: „The best selling product are Tanta and Pupa.“

Menu kategorií ukazuje šíři sortimentu: Accessories, Boxes and Storage, Clothing (vč. „Brand caps“), Fishing lines (Varivas…), Fishing rods, Hooks (Vanfook, Rodio Craft, Varivas), Landing nets, Reels, Spinners, Spoons (vč. podsérií Nories ROONEY 1,5 / 1,8 / 2,2 / 2,8 g a Forest MIU 1,4–7 g), Wobblers (vč. „Hand Made Slovakia – 3STAN“), Gift certificates a Special Offer.

**Zjištění**
- **Pozicování: specializovaný přeprodejce japonských trout-area značek.** Jádrem jsou plandavky (3 102 položek, téměř dvě třetiny z 4 792 nástrah ve třech hlavních kategoriích). Nejsilnější značky jsou Nories a Forest. SV Fishing Lures má nejvíc položek, ale v žebříčku oblíbenosti se neobjevuje.
- **Vlastní výroba: žádná.** Všechny nástrahy jsou cizí značky. Jediná „domácí“ řada je *Hand Made Slovakia* (3STAN, 3 woblery), ani ta ale není Troutshopu. Vlastní je jen merch („Brand caps“). Titulky nesmí naznačovat vlastní značku (viz troutshop.md Verification).
- **Cenový segment: střední až prémiový.** Plandavka stojí 4,90–6,50 €, japonský wobler 14,90–19,90 €, guma 5–9 € za balení. Jde o originální japonské zboží, ne o levné noname.
- **Speciality:** závodní plandavky Nories (ROONEY, SOFIA, TULLE) a Forest (MIU, CHASER, PAL, Limited Colors), nové Velvet Arts (Forte 2.1 g, upload 2026/10), crankbaity Nories v barvě 109, gumy FishUp Tanta a Pupa. Doplňky jsou čistě trout-area: UV marker, háčky Vanfook a Varivas, vlasce Varivas.
- **Souvislost s MČR:** MČR 2026 je kategorie **hard baits** (`research/mcr_tournament.md`). Plandavky a woblery jsou přesně hard baits, takže hero produkty volíme jen z nich. Gumu (FishUp) nechat jen jako drobnou zmínku o sortimentu, nikdy jako „nástrahu na MČR“.

---

## 2. Hrdinové a vedlejší produkty (`assets_prep/troutshop/ads/`)

Všechny cut-outy jsou průhledné PNG bez vodoznaku. Okraj (pad) je 3 %, `pad` je uložený v `_ads.json`. Páry plandavek jsou rozdělené: `_a` = horní levá plandavka, `_b` = dolní pravá. Do `fx.product` dávat `pad` z `_ads.json`. Zvětšení nejvýš 1,3× (engine to hlídá).

### HERO 1: Nories ROONEY 2,8 g 101 (nejoblíbenější plandavka obchodu)
- `hero_01_nories_rooney_2-8g_101.png` je pár 1123 × 2078. `_a` je zlatá strana s raženým „ROONEY 2.8g“ (931 × 1332), `_b` fluo žlutá s červeno-oranžovými pruhy (891 × 1300).
- Zdroj: `https://troutshop.eu/wp-content/uploads/2020/07/nories-rooney-101-1.jpg` (800 px) → Higgsfield upscale 2k → lokální odvodoznakování a cut-out → `ts_polish` (očko zlaté plandavky přepasované jako čistá elipsa, bílý roztřepený kroužek odstraněn). Produkt: `https://troutshop.eu/p/rooney-28g-101/`, 6,50 €.
- Proč: ve „popularity“ drží 1.–3. místo (všechny tři gramáže), takže je to „tvář“ obchodu. Zlatá ražba dobře nese makro push-in a světelný přejezd, fluo strana dává barevný kontrast. Gramáže řady jsou ověřené z menu: 1,5 · 1,8 · 2,2 · 2,8 g.

### HERO 2: Velvet Arts Forte 2,1 g 32 Glow Fluorescent Pink (novinka 2026)
- `hero_02_velvetarts_forte_2-1g_32_glow_pink.png` je pár 731 × 1382, `_a` 695 × 752 (líc, matná růžová) a `_b` 670 × 840 (rub s raženým „VA 2.1“).
- Zdroj je PNG obchodu s vlastní alfou (`…/uploads/2026/10/velvet-arts-forte-2_1g-32.png`, 1500 px), duchy vodoznaku odstraněné lokálně. Na Higgsfield nešel (zdroj ≥ 1000 px, bez vad).
- Proč: nejnovější přírůstek (upload 10/2026), japonská značka (Yudai Ito), „The maximum impact in a spoon. Compact Size, Big Performance“. Hodí se na **otočku líc/rub** (`fx.flip`) a na „glow“ moment. Velvet Arts je cizí značka, nikdy ji neprezentovat jako Troutshop.

### HERO 3: Nories CRANKIN' PUPA 2,6 g 109 (čirý crank, hard bait)
- `hero_03_nories_crankin_pupa_109.png` 1518 × 832. Zdroj `…/uploads/2022/03/crankin-pupa-109-2048x2048.jpg` (bez vodoznaku) → Higgsfield `remove_background` (lokální ISNet dělal z čirého těla neprůhledné bílé). Alfa je záměrně poloprůhledná (≈ 254), tělo propouští pozadí, a proto se **nepolishuje**. Produkt: `https://troutshop.eu/p/crankin-pupa-26g-109/`, 14,90 €.
- Proč: woblery Nories ovládají žebříček oblíbenosti a barva 109 se v něm opakuje. Je to druhý typ hard baitu (vedle plandavek) a čiré tělo umožní lom světla / caustics na barevném pozadí. Spec čip je ověřený: „Floating / Silent · 1,8 m · 34 mm · 2,6 g“ (`research/troutshop.md`).

### Vedlejší (vějíř / mřížka / swatch)
| Soubor | Produkt | Rozměr (pár) | Použití |
|---|---|---|---|
| `sec_01_nories_rooney_002` | Nories ROONEY 2,8 g 002 (růžová / limetková) | 809 × 1434 | vějíř, barevný drop |
| `sec_02_nories_rooney_sk20_magma` | Nories ROONEY SK20 Magma (oranžová / glitr) | 780 × 1464 | vějíř |
| `sec_03_forest_miu_ts4_limited` | Forest MIU TS4 Limited Color (zelená / žluto-červená) | 775 × 1460 | vějíř, druhá top značka |
| `sec_04_velvetarts_forte_2-1g_35_yellow_red` | Velvet Arts Forte 2,1 g 35 | 734 × 1419 | vějíř, mřížka |
| `sec_05_nories_tulle_3g_101` | Nories TULLE 3,0 g 101 | 530 × 1055 | jen malá (do 1,3×) |
| `sec_07_velvetarts_forte_2-1g_30_glow_gold` | Velvet Arts Forte 2,1 g 30 Glow Gold | 734 × 1421 | vějíř, glow |
| `sec_06_fishup_baffi_fly_hot_pink` | FishUp Baffi Fly 1,5 Hot Pink (guma) | 731 × 575 | nanejvýš „v nabídce také gumy“, ne hard bait |

Starší `assets_prep/troutshop/heroes/h0*` jsou nahrazené (h01 = hero_02, h02 = sec_04, h04 = hero_03 ve verzi bez HF, h05 = sec_06).

### Pipeline a QA
- `python3 -I scripts/assets_prep/ts_ads_finalize.py` → polish → trim → split → `_ads.json` → `_sheet.jpg`.
- **Nově `ts_polish.py`:**
  1. *Refit oček.* Jen kulaté očko celé obklopené tělem plandavky, bez drátu kroužku. Bílý kroužek po pozadí se přičte k díře, díra se přepasuje jako vyhlazená elipsa a dostane 1,5 px tmavší hranu.
  2. *Defringe.* 1–2 px světlý lem na tělech se nahradí barvou okolního interiéru. Silnější bílý lem (3–5 px) se opraví jen na sytých tělech. Na tenkých drátech (háček, kroužek) bělavé okrajové pixely ztratí alfu.
  Bílá a stříbrná těla zůstanou beze změny. Refit proběhl u očka zlatého ROONEY 101 a ROONEY 002. Úzké mezery mezi kroužkem a plandavkou se záměrně nepřepasovávají (elipsa by prořízla drát) a čistí je jen defringe.
- **Kontrola v sheetu:** `_sheet.jpg` ukazuje každou položku na černé `#0A0A0A`, světlé `#F2F2F2` a značkové červené `#E3000F`, s kontaktním stínem. Zkontrolováno přes Read plus zoomy všech 30 oček (před a po). Halo ani vodoznak nejsou vidět. Zbytky: tenký narůžovělý lem v očku TULLE `_b` (kroužkem prostrčené očko) a nepatrné duchy „TO“ ve fluo žluté ROONEY `_b`, viditelné až při 4× high-passu, v běžném kontrastu ne. Obojí je v pořádku pro pohyb a pro ≤ 1,3×.
- **Higgsfield: 3 z 12 kreditů** (1× upscale 2k = 2, 1× remove_background = 1). Další útrata nebyla potřeba: Forte je 1500 px se čistou alfou a ostatní jsou vedlejší. Detail je v `hf_log.md`.

---

## 3. Svět značky

### Barvy (logo + CSS motivu `xts-theme_settings_default-*.css` + inline CSS webu)
| Token | Hex | Zdroj na webu | Role ve filmu |
|---|---|---|---|
| red | `#E3000F` | logo (paprsky), `--wd-primary-color`, `--btn-accented-bgcolor`, horní lišta | hlavní akcent, paprsky, čipy, flash |
| red-hi → red-lo | `#E6000F` → `#C80411` | horní lišta `linear-gradient(hsl(356,100%,45%), hsl(356,96%,40%))`, tlačítka „Sale“ | gradient pozadí/plochy, wipe |
| black | `#000000` / `#0A0A0A` | hlavička `whb-general-header`, `--wd-alternative-color`, page title bg | **hlavní pozadí** (studio černá) |
| ink | `#242424` | `--wd-title-color` | text na světlé |
| grey | `#777777` | `--wd-text-color` | jen drobné popisky na světlé |
| white | `#FFFFFF` | logo (text, paprsky), text v hlavičce | titulky na černé |
| (brown `#422C1C`, blue `#145F82`) | drobné UI prvky | nepoužívat |

Barvy produktů (z `_ads.json`): ROONEY 101 zlatá `#BAA360` / `#574122`, fluo žlutá `#F1E80F`, červeno-oranžová `#F32F07`; Forte 32 růžová `#EC2D5A`; ROONEY 002 růžová `#FA026E` / limetková `#C9DE02`; SK20 oranžová `#F8A112`; MIU TS4 zelená `#1B9544`; Crankin' Pupa čirá + žluté oči.

**Motiv loga:** černá silueta pstruha, bílé kurzivní versálky TROUTSHOP a **červené „vycházející slunce“** (paprsky, japonská vlajka). Ladí se sortimentem japonských značek. Na čistě černé dávat `logo_on_dark.png` (červená kontura) nebo `logo_plate.png`. Logo vždy ≤ plaketa TA (`ctx.logo` to hlídá).

### Typografie (z CSS motivu)
- `--wd-title-font` / `--wd-entities-title-font` / widget titles = **Anton 400** (versálky). `--wd-text-font` a menu hlavičky = **Roboto Condensed 400** (versálky, 13 px). `--wd-alternative-font` = Roboto. Google Fonts: `Roboto Condensed 400;600 + Anton 400 + Roboto 400`.
- **Do filmu:** display a kinetické titulky **Anton 400 VERSALKAMI** (jako jejich nadpisy). Labely, čipy a URL **Roboto Condensed 600/700 VERSALKAMI**, tracking +0,06 em. Akcentní řádek **Roboto Condensed 800 italic** odkazuje na kurzivní wordmark loga, nefalšuje ho. Latin + latin-ext pokrývají celou češtinu (kontrola cmap: ě š č ř ž ů ť ď ň, „ “, –).
- Soubory (OFL, @fontsource 5.3.0): `fonts/anton-{latin,latin-ext}-400-normal.woff2` (už v registru `lib/fonts.mjs`), nově `fonts/roboto-condensed-{latin,latin-ext}-{400,600,700,800}-normal.woff2` + `-{700,800}-italic` + `LICENSE-roboto-condensed.txt`. Kopie jsou v `proto/assets/fonts/` a @font-face v `proto/assets/fonts.css`.
- Registrace v bloku (sdílený `fonts.mjs` se needituje):
  ```js
  export const fonts = {
    'Roboto Condensed': { s: { 400: 'roboto-condensed-{r}-400-normal', 600: 'roboto-condensed-{r}-600-normal', 700: 'roboto-condensed-{r}-700-normal', 800: 'roboto-condensed-{r}-800-normal' },
                          si: { 700: 'roboto-condensed-{r}-700-italic', 800: 'roboto-condensed-{r}-800-italic' }, use: 'Troutshop text font (site CSS --wd-text-font); italic = logo wordmark mood' },
  };
  export const theme = { bg: '#050505', bg2: '#2a0306', fg: '#ffffff', accent: '#e3000f', accent2: '#c80411', font: { display: 'Anton', text: 'Roboto Condensed' }, wght: 400, upper: true, light: false };
  ```

### Tón (tone of voice)
Sebevědomý závodník a specialista, nadšený a stručný, s vykřičníky: „The trout fishing SPECIALIST!“, „Milujeme lov pstruhov“, „We are professionals“, „We guarantee the reliability with our name“. Důvěra rodinné firmy (od 1999) a závodní zázemí (generální partner TA Slovakia). **Ve filmu:** krátké versálkové údery v Anton (2–3 slova), fakta a spec čipy, žádný luxusní patos a žádné superlativy, které nejsou ověřené („největší“, „nejlepší“, „vítězové v SK/CZ/PL/UA“).

---

## 4. Ověřená fakta pro titulky / VO (jen tato)
| Text (CZ) | Zdroj |
|---|---|
| „Specialista na pstruhy“ / „Milujeme lov pstruhů“ | EN a SK hero homepage (troutshop.md, Verification) |
| Rodinná firma od roku 1999 | `https://troutshop.eu/en/about-us/` (Verification #1) |
| Generální partner Trout Area Slovakia | `…/pc/spoons/velvet-arts-2/` a další (Verification #2) |
| Partner několika japonských značek | about-us, formulace „několika“ (Verification #4) |
| Doručení do Česka do pár dní | SK meta description |
| ROONEY 1,5 · 1,8 · 2,2 · 2,8 g | menu kategorie Spoons › NORIES – ROONEY |
| Crankin' Pupa: Floating · 1,8 m · 34 mm · 2,6 g | stránka produktu (troutshop.md) |
| Velvet Arts Forte 2,1 g (japonská značka) | `…/pc/spoons/velvet-arts-2/` |
| **3 100+ plandavek v nabídce · 15 značek** (stav 19. 10. 2026) | `https://troutshop.eu/pc/spoons/` (3 102 výsledků, filtr značek). Číslo se mění, takže jen s „v nabídce“, nikdy jako „největší výběr“ |
| troutshop.eu | doména |

Nepoužívat: ceny (mění se, cílí na SK/€), „nejprodávanější“ (řazení podle oblíbenosti je naše analýza, ne tvrzení sponzora), loga Nories/Forest/Velvet Arts (cizí ochranné známky; názvy produktů jen jako text u výrobku), „vlastní značka / vlastní výroba“, nic o tom, že se konkrétní nástrahy používají na MČR.

VO (hotové, `vo/troutshop.wav`, 5,58 s, offset 0,25 s): „Troutshop – specialista na pstruhy. Rodinná firma od roku 1999.“ Časy v bloku (s offsetem): *Troutshop* 0,25 · *specialista* 1,02 · *pstruhy* 1,93–2,35 · *Rodinná* 2,63 · *firma* 3,07 · *1999* 4,13–5,71. Blok má takty 13–16 (4 takty ≈ 7,34 s, takt ≈ 1,834 s), takže VO se vejde.

---

## 5. Dva koncepty

Společné: 1080 × 1920, texty v Reels safe zóně (x 64–1016, y 240–1460, vpravo od y 900 nechat 140 px volných). **Plaketa TA CZ** je pevně v rohu (64, 250), nikdy překrytá a nikdy menší než logo Troutshopu. Hudba track 3, 129 BPM. Hard cut nebo předávka přes barvu podle BLOCK_API §4.

### A) „RISING SUN · SPECIALISTA“: produktový film ve stylu Shimano Japan / Apple macro (DOPORUČENO)
Svět: studiová černá `#050505`, za produktem pomalu rotující **červené paprsky** jako jejich logo (`fx.rays`, `#E3000F`, duty 0,4, opacity ≤ 0,55) a hluboká červená záře `#2A0306` zespodu. Bílé titulky v Anton, červené čipy v Roboto Condensed.

| Takt (lokálně) | Obraz | Typo / VO |
|---|---|---|
| 1 (0–1,83) | Tma → na downbeat se zespodu otevře „vycházející slunce“ z paprsků. ROONEY 101 `_a` (zlatá) vyjede jako hrdina, **světelný přejezd** po ražbě (`fx.sweep`), pomalý macro push-in na „ROONEY 2.8g“ | „SPECIALISTA NA PSTRUHY“ Anton, znaky s VO (*specialista* 1,02) |
| 2 (1,83–3,67) | Whip: ROONEY `_b` (fluo) se otočí, za ním se na beaty rozevře **vějíř** 6 plandavek (ROONEY 002, SK20, MIU TS4, Forte 30/35, TULLE). Parallax ve 3 hloubkách, pozadí se jemně tónuje dominantní barvou aktuální plandavky | čip „ROONEY 1,5 · 1,8 · 2,2 · 2,8 g“; volitelně odometer „3 100+ plandavek v nabídce“ (≥ 1,2 s) |
| 3 (3,67–5,50) | Crankin' Pupa 109 prolétne zleva doprava (čiré tělo s červenými paprsky za sebou = lom světla), zastaví se na downbeat s kontaktním stínem | „RODINNÁ FIRMA OD ROKU“ + **odometer 1999** (červený) přesně na *1999* (4,13) |
| 4 (5,50–7,34) | Velvet Arts Forte 32 se **otočí líc → rub** (`fx.flip`) s glow pulzem. Lockup: logo `on_dark` (≤ plaketa) + troutshop.eu | čip „Generální partner Trout Area Slovakia“, URL Roboto Condensed 700. Ven přes `slice` / `wipe` v červené |

- Techniky: specular sweep maskovaný alfou, macro push-in, depth parallax, vějíř na beat, flip, odometer, glass čipy, lokální červené záblesky na downbeatech (≤ 0,15, bez full-frame strobů).
- **REEL (`BLOCK=troutshop REEL=1`):** hook (1 takt) = makro zlaté ROONEY 101 se sweepem + „MILUJEME LOV PSTRUHŮ“ (Anton, bílá, „PSTRUHŮ“ červeně), sub troutshop.eu. Pak blok a 2-taktový end card na černé s paprsky: `logo_on_dark` + **troutshop.eu** + „Partner MČR v Trout Area 2026“ + plaketa TA (≥ logo Troutshopu, `fx.endCard`).
- Plusy: přesně „produkty jako hrdinové“. Svět je čistě jejich (černá, červená a paprsky z loga). Japonský „rising sun“ motiv propojuje logo se sortimentem japonských značek. Všechny tři hrdiny jsou hard baits (= MČR). Mínusy: 4 takty jsou hustý střih a vějíř musí být rychlý (6 položek za 1 takt).

### B) „3 100 BAREV“: katalogová zeď (retail energy)
Svět: červená horní lišta webu jako UI prvek, černá zeď s mřížkou plandavek (`fx.grid`, mode `scatter`), nekonečný marquee barev a velký counter.

| Takt | Obraz | Typo |
|---|---|---|
| 1 | Mřížka 4 × 6 plandavek se složí na beat, ROONEY 101 vystoupí dopředu | „SPECIALISTA NA PSTRUHY“ |
| 2 | Zeď se rozjede jako marquee (barvy), counter 0 → 3 102 | „3 100+ PLANDAVEK V NABÍDCE“ |
| 3 | Řádek značek jako text: NORIES · FOREST · VELVET ARTS · VALKEIN · RODIO CRAFT | „RODINNÁ FIRMA OD 1999“ |
| 4 | Zeď se zastaví, logo + URL | „troutshop.eu“ |

- Plusy: ukazuje skutečné USP (šíře sortimentu specialisty), hodně energie a counterů. Mínusy: blíží se e-shop banneru (to oprávněně odmítl operátor), na zeď je potřeba 20+ čistých cut-outů (máme 10, ostatní fotky jsou 400–800 px s vodoznakem), vedou cizí značky a číslo se mění.

**Doporučení: A „RISING SUN · SPECIALISTA“.** Z B převzít jen malý counter „3 100+ plandavek v nabídce“ v taktu 2 (volitelně) a řádek značek nanejvýš jako drobný popisek pod vějířem. Gumu Baffi Fly v bloku nepoužívat (MČR = hard baits).

---

## 6. Otevřené body (pro autora bloku)
1. `data/blocks/troutshop.json › products` stále ukazuje na `assets_prep/troutshop/heroes/h0*`. Přepnout na `ads/` v pořadí: hero_01 `_a`, hero_01 `_b`, hero_03, hero_02 `_a`, hero_02 `_b`, sec_01–05, sec_07 (+ `pad` a `glint` z `_ads.json`).
2. `scripts/blocks/troutshop.mjs` (placeholder) má Inter jako text font. Přepnout na Roboto Condensed (`export const fonts` výše) a doplnit `accent2: '#c80411'`.
3. Krátké přejezdy na čirém Crankin' Pupa jsou v pořádku (alfa ≈ 254). Pod ním ale nedávat kontrastní text, protože tělo je průhledné.
4. Pokud by někdo chtěl jako hero woblerů MEET 29DR-SS 109 (č. 1 v oblíbenosti), je potřeba nový cut-out. Rozpočet HF na to zbývá (9 kreditů).
