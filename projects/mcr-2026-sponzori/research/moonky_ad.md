# Moonky: reklamní blok (sortiment, hrdinové, svět značky, koncepty)

Datum: 19. 10. 2026 · směr: BRIEF.md › „ZMĚNA SMĚRU“ (reklamní film produktů, vlastní svět sponzora, z TA jen logo).
Podklady: `research/moonky.md` (+ Verification), `research/moonky_user.md`, `vo/script_cs.json` › moonky, `vo/moonky.words.json`,
DESIGN.md (jen choreografie: „mřížka barev gumových nástrah“, Look-číslování, pravidla loopů).
Výstupy: `assets_prep/moonky/ads/` (15 PNG + `_meta.json` + `_sheet.jpg` + `_src/`), skripty `scripts/assets_prep/moonky_ad/`
(`crop_sources.py`, `cut_moonky.py`, `sheet.py`, README), log `assets_prep/moonky/hf_log.md`, fonty Exo 2 + Source Sans 3 (`fonts/`,
`proto/assets/fonts/`, `proto/assets/fonts.css`).

---

## 1. Sortiment a pozicování (stránky staženy přes bridge 19. 10. 2026)

Čísla jsou z filtrů a stránkování Shoptetu („Na skladě N“, „Značky: … N“, „N položek celkem“). Položka = jedna kombinace
model × barva × příchuť × balení.

| Stránka (URL) | Položek | Značka (filtr) | Cena | Co dominuje |
|---|---|---|---|---|
| Gumové nástrahy `https://www.moonky.cz/gumove-nastrahy/` | **560** (47 stran) | **Moonky 560** | 160–175 Kč / balení | 15 modelů (podkategorie): Bagy L, Gamer Baby, Gamer Big, Gamer Small, Coccon, Coccon Jr., Kukla, Long Worm, Savory, Scelet, Scelet Jr., Sweet, Sweet Big, Worm, Master. Filtr barev: oranžová 137, hnědá 123, růžová 115 (+6 „ružová“), žlutá 78, bílá 71, černá 42, zelená 42, modrá 24, světle hnědá 21, broskvová 6. Příchutě: **banán 202 · sýr 181 · oliheň 177**. Perex: „Gumové nástrahy Moonky byly vytvořeny závodníky… Vše bylo detailně ozkoušeno ve spolupráci s českou reprezentací…“ |
| Nejprodávanější (blok na téže stránce) | 10 | Moonky | 169–170 Kč | Gamer Small 36mm DC02 White/Orange Fluo · Gamer Big 46mm DC03 Brown Metalic/Orange Fluo · Gamer Big C05 White · Bagy L C07 Yellow · Coccon Jr. DC06 Coffee/Peach · 5× Sweet Big (C08, C06, C05, C03, C01). **Larvy (Gamer, Sweet Big, Bagy, Coccon Jr.) vedou.** |
| Gamer Big `https://www.moonky.cz/gumove-nastrahy-gamer-big/` | 37 | Moonky 37 | 169–170 Kč / 8 ks | 9 jednobarevných (C01–C09) + dvoubarevné DC01–DC04 × 3 příchutě. Perex: „věrnou napodobeninou larvy… Plovoucí tělo… extrémně jemnou gumou a silným aroma“ |
| Limitované edice `https://www.moonky.cz/limitovane-edice/` | 11 | Moonky 11 | **22–25 Kč / 1 ks** | Coccon 42mm LE (Olive/Toxic red, Toxic red, Green-orange, Blue, White/Peach/Black-toxic-red) a Scelet LE (Toxic red, white/Pink Bubblegum, peach, olive). Prodej po kusech, část „Dočasně vyprodáno“ |
| HD Barbless `https://www.moonky.cz/hd--barbless/` (menu „Jigové hlavičky“) | 194 | **Jigovky CZ 194** | 75–149 Kč / 5 ks | Přeprodej jigových hlaviček **Jigovky.cz** (jiný partner MČR). Perex: „…jigové hlavičky z dílny Jigovky.cz!!“. Do bloku Moonky nepatří |

Produktové stránky (parametry Shoptetu, staženo 19. 10.):
- Gamer Big DC03 `…/gumova-nastraha-moonky-gamer-big-46mm-dc03-brown-metalic-orange-fluo-cheese--8ks-/`: balení 8 ks · délka 46 mm ·
  hmotnost 2,12 g · tvrdost gumy **Extra měkká** · ruční výroba **Ano** · země původu **Česká republika** · 169 Kč. Popis: „…Plovoucí tělo…
  při kombinaci s extrémně lehkou jigovou hlavičkou nebo jen korálkem docílíte extrémně pomalého propadu…“, „testovány jak na řekách…,
  tak také pro lov Trout Area“.
- Gamer Small DC02 (nejprodávanější): 12 ks · 36 mm · 1,2 g · extra měkká · ruční výroba Ano · ČR · 169 Kč.
- Savory C06 Green `…/gumova-nastraha-moonky-savory-43mm-c06-green-olihen-12ks-/`: 12 ks · 43 mm · 1,05 g · extra měkká · ruční výroba Ano ·
  ČR · 160 Kč. Popis: „unikátním asymetrickým designem. Nerovnoměrné tělo… jemné výstupky, které fungují jako miniaturní nožičky.
  Nástrahu zakončují tři malé ocásky…“, materiál „pružný, elastický, a díky tomu má větší životnost“.

**Zjištění**
- **100 % vlastní značka u gumových nástrah** (Moonky 560/560, limitky 11/11). Výroba vlastní (o-nas: vlastní CNC formy; produktové
  parametry „ruční výroba: Ano“, „země původu: Česká republika“). Jediný přeprodej: jigové hlavičky Jigovky.cz (194 v HD Barbless).
- **Specializace:** výhradně měkké nástrahy na pstruhy / Trout Area. Tvarově dominují **larvy a kukly** (Gamer ×3, Coccon ×2, Bagy L,
  Kukla, Sweet ×2), druhá rodina jsou **„ploutvičkové“ nymfy s ocásky** (Savory, Scelet ×2), třetí **červi** (Worm, Long Worm, Master).
- **Systém sortimentu = model × barva × příchuť.** Barvy jsou kódované (C01 Pink Bubblegum … C09 Peach, DC01–DC06 dvoubarevné, LE
  limitky), 3 aromata (banán, sýr, oliheň). Barevně dominují fluo oranžová, hnědá metalíza a bubblegum růžová.
- **Cena: dostupný až střední segment, malá balení:** 160–175 Kč za 8–12 ks (≈ 13–21 Kč/ks), limitky 22–25 Kč/ks.
- **Pozicování:** „závodnická“ výbava (vytvořeno závodníky, vývoj s reprezentací, Trout Area v hlavičce webu) + řemeslo
  (HANDMADE LURES, ruční výroba, CNC formy) + hravé názvy a příchutě (Gamer, Sweet, Savory, Pink Bubblegum, Coffee milk, banán/sýr).

---

## 2. Hrdinové a vedlejší produkty (cut-outy v `assets_prep/moonky/ads/`)

Všechny PNG: průhledné, ořez + 3 % okraj, `_meta.json` má `size`, `bbox`, `pad` [l,t,r,b], `aspect`, `dominant` (3 × hex + podíl),
`glint` (normované nejjasnější místo pro sweep), `method`, `source`, `source_url`. Žádné zvětšení nad zdroj kromě H1 (Higgsfield 4k).

### HERO 1: Gamer Big 46 mm DC03 Brown Metalic / Orange Fluo (bestseller, larva)
- `H1_gamer_big_dc03_brown_orange.png`, **2544 × 1006**. Zdroj shop 1024×768 (lure ≈ 817 px) → Higgsfield upscale 4k (2 kr.) →
  alfa obchodu ×4 + lokální F/B unmix + geometrická obrysová linka, okraj obarven barvou těla (bez šedého lemu).
- Proč: 2. nejprodávanější položka kategorie, nejsilnější makro fotka (lesk, „nožičky“, přechod oranž → hnědá metalíza), plné ověřené
  parametry pro spec čipy: **46 mm · 2,12 g · 8 ks · extra měkká · plovoucí tělo**.
- Makro: detail segmentů a tří „nožiček“ drží i při crop 1:1 (zkontrolováno). Glint [0.369, 0.181].

### HERO 2: Savory 43 mm C06 Green (signature tvar, fluo lime)
- `H2_savory_c06_green.png`, **2005 × 586**, lokální white-unmix z originálu 2252×4000 (lure 1887 px), bez upscale.
- Proč: „unikátní asymetrický design“, tři ocásky = poznávací tvar Moonky; nejsvítivější barva sortimentu (lime `#9CC903`) = akcent
  světa. Je to i kotva **colourway řady Savory** (S1–S5 mají stejné studiové osvětlení i úhel). Spec: **43 mm · 1,05 g · 12 ks · extra měkká**.

### HERO 3: Coccon Jr. 34 mm C04 Black (lesk, světelné přejezdy)
- `H3_coccon_jr_c04_black.png`, **2268 × 1330**, lokální z originálu 3000×4000 (lure 2142 px). Bílé odlesky jsou neprůhledné (starý
  `heroes/h06` je měl jako díry), odraz stolu pod břichem odstraněn.
- Proč: zrcadlový lesk = ideální pro moonlight sweep a makro push-in; černá dává prémiový kontrast k fluo barvám. Coccon/Coccon Jr. je
  rodina „realistická larva“ s limitovanými edicemi.
- Omezení: hlavová (licí) ploška vpravo dole je drsná (reálný detail produktu) a pod 2.–4. segmentem zůstává tenký tmavý okraj odrazu;
  na tmavém pozadí neviditelné. **H3 používat na tmavé scéně, makro jen na střed těla s odlesky.**

### Vedlejší (vějíř / mřížka / colourway karusel), min. 6–8 v záběru
| Soubor | Produkt | Rozměr | Použití |
|---|---|---|---|
| `S1_savory_c01_pink_bubblegum.png` | Savory C01 Pink Bubblegum | 2089 × 885 | colourway Savory (spodní obrys po odstranění odrazu mírně nerovný: do ~1000 px šířky) |
| `S2_savory_c02_orange_fluo.png` | Savory C02 Orange fluo | 1485 × 1385 | colourway (lure je zahnutý, šikmo) |
| `S3_savory_c03_brown_metalic.png` | Savory C03 Brown metalic | 2077 × 958 | colourway |
| `S4_savory_c04_black.png` | Savory C04 Black | 1693 × 1029 | colourway |
| `S5_savory_dc03_brown_orange.png` | Savory DC03 Brown metalic / Orange fluo | 2100 × 1703 | colourway (dvoubarevná) |
| `S6_scelet_c01_pink_bubblegum.png` | Scelet C01 Pink Bubblegum | 1168 × 430 | mřížka (JPEG zdroj; vlákno pod tělem vyretušováno) |
| `S7_coccon_dc04_yellow_orange.png` | Coccon 42mm DC04 Yellow / Orange fluo | 1189 × 781 | mřížka / vějíř |
| `S8_scelet_jr_c08_coffee_milk.png` | Scelet Jr. C08 Coffee milk | 1015 × 480 | mřížka |
| `S9_coccon_c02_orange_fluo.png` | Coccon 42mm C02 Orange fluo | 982 × 600 | mřížka |
| `S10_master_c05_white.png` | Master C05 White | 2120 × 895 | jen tmavá scéna (bílý na bílém: obrys vyhlazen) |
| `S11_gamer_big_c01_pink_bubblegum.png` | Gamer Big 46mm C01 Pink Bubblegum | 911 × 340 | mřížka, max. ~700 px šířky (zdroj 1024) |
| `S12_gradient_blue_pink.png` | lure z obrázku kategorie (modrá → růžová, model neuveden) | 891 × 269 | jen barevný akcent, **nepojmenovávat** |

Nepoužito: jigové hlavičky (značka Jigovky.cz), banner s týmem (foto lidí, text v obrázku), u01–u05 (fotky uživatele: jen lokálně,
nikdy do AI služeb; vhodné jako b-roll/obalový detail), starý `assets_prep/moonky/heroes/*` (h06 má průhledné odlesky, h04 vlákno).

### Pipeline a QA (`scripts/assets_prep/moonky_ad/`, spouštět `python3 -I`)
1. `crop_sources.py` ořízne bílé packshoty na lure + bílý okraj; ISNet medium matte (`scratchpad/bgnode/rmbg.mjs medium …`).
2. `cut_moonky.py`: `velkaryba_ad/cut.py cutout3` (ISNet trimap + unmix proti bílé) s vypnutými „dírami“ (gumy nemají průchozí otvory,
   bílé odlesky zůstanou neprůhledné) + `edge_guard`: odstranění odrazu stolu a kontaktního stínu pod břichem (`underside_ghost`:
   bledé/nízkochroma pixely, pod nimiž je do 40 px pozadí a které se dotýkají okraje), světlý kant u tmavých těl, tmavý kant u bílého
   lure, otevření tenkých vláken, okraj obarven barvou těla. Shop-alpha položky: alfa obchodu, geometrická linka, dekontaminace.
3. `sheet.py` → `_sheet.jpg` (záhlaví se swatchi a ukázkou písma + všechny výřezy na černé, světlé, Moonky night `#0E1424` a web blue
   `#6883BA`, s kontaktním stínem). Zkontrolováno vizuálně + zoomy hran 1:1: bez halo, bez vodoznaků (Moonky fotky žádné nemají),
   odlesky H3 neprůhledné, vlákno S6 pryč.
- Higgsfield: **2 z 12 kreditů** (1× upscale 4k pro H1), `remove_background` nepoužit. Detail v `assets_prep/moonky/hf_log.md`.

---

## 3. Svět značky

### Barvy
| Token | Hex | Zdroj | Role ve filmu |
|---|---|---|---|
| night | `#0E1424` | FB avatar / badge, jar labely (vzorek `#0C1424`), manifest | hlavní pozadí (noc, „moon“) |
| night-2 | `#141C24` | banner HANDMADE LURES (vzorek) | gradient / vinětace |
| moon | `#FFFFFF` | logo (bílé na průhledném) | logo, titulky, světelné přejezdy |
| moonlight | `#6883BA` | moonky.cz CSS `body {background-color:#6883BA}` (desktop) | studené světlo, druhá scéna, end-card glow |
| ink | `#000000` | CSS `--color-primary`, `--color-header-background` | nejhlubší stín, letterbox |
| grey | `#E2E2E2` | CSS `--color-tertiary` | jemné linky, popisky na světlé |
| lime (akcent) | `#9CC903` | Savory C06 (vzorek z H2) | **hlavní akcent** titulků a čipů |
| bubblegum | `#EC638B` / `#E1287F` | Savory C01 / Gamer Big C01 | druhý akcent (střídmě) |
| orange fluo | `#F49E0B` | Savory C02 / H1 ocas `#F7940D` | barevný tint scény při colourway |
| brown metalic | `#734545` | Savory C03 / H1 tělo `#6B3643` | tint |
| blue | `#1184B8` | kategorie lure | tint (jen akcent) |

Barvy produktů jsou změřené z výřezů (`_meta.json › dominant`), nejsou z CSS. Na pozadí scény je tónovat max. 15–20 %.

### Typografie
- **Web (ověřeno v CSS stránek moonky.cz):** `--template-headings-font: "Exo 2"`, `--template-font: "Source Sans 3"` (Shoptet šablona 12).
- Logo je geometrický široký grotesk (kulatá O, rovné M), blízký Montserratu. Montserrat je ale font TA (zakázaný „náš styl“), a logo se
  nemá napodobovat písmem, proto ve filmu **jen originální logo** a typografie webu:
  - display: **Exo 2 900 italic** VERSALKAMI (sportovní, technická, rychlá: „závodnická“ stránka značky), tracking −0,01 em;
  - podtitulky: **Exo 2 300** VERSALKY s širokým prostrkáním (+0,3 em) jako ozvěna „H A N D M A D E  L U R E S“ pod logem;
  - spec čipy, URL, popisky: **Source Sans 3 600/400**.
- Soubory: `fonts/exo-2-{latin,latin-ext}-wght-{normal,italic}.woff2`, `fonts/source-sans-3-{latin,latin-ext}-wght-{normal,italic}.woff2`
  (+ licence; @fontsource-variable/exo-2 5.3.0, @fontsource-variable/source-sans-3 5.3.1, OFL). Kopie v `proto/assets/fonts/`,
  @font-face v `proto/assets/fonts.css`. Čeština zkontrolována přes cmap (ěščřžýáíéůúťďň + velká, „ “, –, ·: vše OK).
- Registrace v bloku (`scripts/blocks/moonky.mjs`, sdílený `fonts.mjs` se needituje; nahrazuje placeholder Unbounded):
  ```js
  export const fonts = {
    'Exo 2': { v: 'exo-2-{r}-wght-normal', vi: 'exo-2-{r}-wght-italic', weight: '100 900', axes: ['wght'], use: 'Moonky display (moonky.cz headings)' },
    'Source Sans 3': { v: 'source-sans-3-{r}-wght-normal', vi: 'source-sans-3-{r}-wght-italic', weight: '200 900', axes: ['wght'], use: 'Moonky text (moonky.cz body)' },
  };
  export const theme = { bg: '#0E1424', bg2: '#1B2742', fg: '#FFFFFF', accent: '#9CC903', accent2: '#6883BA',
    font: { display: 'Exo 2', text: 'Source Sans 3' }, wght: 900, upper: true, light: false };
  ```

### Tón (tone of voice)
Závodník, který si nástrahy dělá sám: věcně technický (CNC formy, tvrdost gumy, plovoucí tělo, pomalý propad) a zároveň hravý (Gamer,
Sweet, Savory, Pink Bubblegum, Coffee milk, příchuť banán/sýr/oliheň, „neodolatelná pochoutka“). Krátké věty, žádné vykřičníky.
**Ve filmu:** krátké versálkové titulky + přesná čísla na čipech. Nepoužívat superlativy webu („nejlepší“, „bezkonkurenční“,
„extrémní účinnost“) ani „8 let“ (data/notes, Verification #3).

---

## 4. Ověřená fakta pro titulky / VO (jen tato)
| Text na obrazovce | Zdroj |
|---|---|
| Ručně dělané gumové nástrahy · HANDMADE LURES | banner homepage, obaly; produktové parametry „ruční výroba: Ano“ |
| Pro Trout Area | hlavička webu „Speciální gumové nástrahy pro lov Trout Area“; Gamer Big popis |
| Vlastní CNC formy | `/o-nas/` |
| Vývoj a testování s reprezentací ČR | `/o-nas/`, perex kategorie |
| Vyrobeno v ČR / země původu ČR | produktové parametry (Gamer Big, Gamer Small, Savory) + obal u02 |
| Gamer Big: 46 mm · 2,12 g · 8 ks · extra měkká · plovoucí tělo | produktová stránka Gamer Big DC03 |
| Savory: 43 mm · 1,05 g · 12 ks · extra měkká · tři ocásky · asymetrický design | produktová stránka Savory C06 |
| Gamer Small: 36 mm · 1,2 g · 12 ks | produktová stránka Gamer Small DC02 |
| 15 modelů gumových nástrah | menu / podkategorie `/gumove-nastrahy/` (stav 19. 10. 2026) |
| 3 příchutě: banán · sýr · oliheň | filtr kategorie |
| Guma bez ftalátů | `/o-nas/` (jejich tvrzení, bez certifikátu: jen jako „bez ftalátů“, ne „testováno“) |
| Limitovaná edice (Coccon LE, Scelet LE) | `/limitovane-edice/` (11 položek, část vyprodaná: jen jako štítek, ne „skladem“) |
| moonky.cz | doména |

Nepoužívat: „nejlepší“, „bezkonkurenční“, „8 let“, „560 nástrah“ jako headline (živé číslo e-shopu a jde o varianty, ne modely),
počty barev (filtr má duplicity „Růžová/Ružová“), jigové hlavičky jako produkt Moonky, název modelu u S12.

VO (hotové, `vo/moonky.wav`, 7,04 s, start bloku + 0,25 s): „Moonky – ručně dělané gumové nástrahy pro Trout Area. Vyvíjené a testované
s českou reprezentací.“ Časy slov v bloku (+0,25): *Moonky* 0,25 · *ručně* 1,13 · *dělané* 1,58 · *gumové* 1,99 · *nástrahy* 2,52 ·
*Trout* 3,36 · *Area* 3,79–4,17 · *Vyvíjené* 4,46 · *testované* 5,19 · *českou* 5,99 · *reprezentací* 6,46–7,29.
Blok = takty 24–28 (`data/content.json`), 4 takty ≈ 7,34 s: VO končí 0,05 s před koncem bloku, poslední titulek musí stát už od 6,4 s.

---

## 5. Dva koncepty

Společné: 1080 × 1920; texty v Reels safe zóně (`ctx.safe`: x 64–1016, y 240–1460; od y 900 vpravo jen do x 940). **TA CZ plaketa** pevně vlevo
nahoře (64, 250), nikdy nepřekrytá a nikdy menší než logo Moonky v témže záběru (`ctx.logo` s `box`, větší logo jen s `plate.hero`).
Takt ≈ 1,834 s (129 BPM), doba ≈ 0,464 s. Časy níže jsou lokální v bloku.

### A) „MOONLIGHT MACRO“: noční produktový film (DOPORUČENO)
Svět: hluboká noc `#0E1424` → `#000000` vinětace, jediný zdroj světla = studený „měsíc“ (velký měkký kruh `#6883BA` → bílá, geometrie
kruhu z loga jako tenká linka, ne logo). Nástrahy plavou ve tmě jako objekty ve vesmíru, světlo po nich přejíždí (sweep maskovaný
alfou), titulky Exo 2 900 italic bílé, akcent lime. Ref.: Apple product macro × Shimano Japan reel spots.

| Čas | Obraz | Typo / VO |
|---|---|---|
| Takt 1 (0–1,83) | Ze tmy se nakreslí měsíční kruh, moonlight sweep odhalí **makro H1** (crop na segmenty a „nožičky“, 1:1, push-in 1,0 → 1,08) | na *Moonky* (0,25) malé **logo on_dark** (≤ TA logo) vpravo dole; na *ručně dělané* (1,13–1,68) „RUČNĚ DĚLANÉ“ maskou po slovech |
| Takt 2 (1,83–3,67) | Pull-back: celý H1 se otočí (tilt 3D ±8°), kontaktní stín + odraz, depth parallax s rozmazaným H3 vzadu; spec čipy na doby | čipy „46 mm“ · „2,12 g“ · „EXTRA MĚKKÁ“ (Source Sans 3, glass dark, lime proužek); *gumové nástrahy* (1,99–2,80) 2. řádek titulku lime; *Trout Area* (3,36) = whip/zoom-through |
| Takt 3 (3,67–5,50) | **Colourway Savory**: H2 lime ve středu, na každou dobu střih barvy C01 → C02 → C03 → C04 → DC03 (stejná poloha, stejné světlo); pozadí tónované 15 % dominantní barvou; dole lišta 6 barevných teček | kód barvy jako malý chip („C06 GREEN“…); na *Vyvíjené a testované* (4,46) vyjede „VYVÍJENO S REPREZENTACÍ ČR“ (Exo 2 800) |
| Takt 4 (5,50–7,34) | **Měsíční fáze:** 8 nástrah (H3 uprostřed, S7, S6, S11, S12, S8, S9, S10) se seřadí do oblouku kolem kruhu; sweep přes lesk H3 na downbeat; jemný float | čipy „VLASTNÍ CNC FORMY“ · „RUČNÍ VÝROBA · ČR“; od 6,4 s logo on_dark + **moonky.cz** (Source Sans 3 600) |

- Techniky: `fx.sweep` (glint z `_meta`), `fx.pushIn`, `fx.tilt`, `fx.parallax`, `fx.chip`, `fx.headline({reveal:'words'})`
  na `ctx.vo.at()`, `fx.grid`/vlastní oblouk, `fx.glow` (měsíc), přechody `zoom` dovnitř a `iris` (kruh = měsíc) ven.
- **REEL (`BLOCK=moonky REEL=1`):** hook 1 takt = makro H1 + „RUČNĚ DĚLANÉ. PRO TROUT AREA.“ (Exo 2 900 italic, čitelné za 0,3 s);
  blok; end card 2 takty na `#0E1424` s měsíčním glow: logo on_dark + moonky.cz + „Partner MČR v Trout Area 2026“ + TA logo
  (≥ logo Moonky).
- Plusy: prémiové, drží „závodnickou“ serióznost (reprezentace, CNC), barvy nástrah září na tmě, navazuje na název (moon) a navy
  identitu značky; H1 4k nese makro. Mínusy: hodně tmy, nutné hlídat kontrast černých nástrah (H3, S4: rim light zezadu).

### B) „TROUT SNACK BAR“: hravý candy-pop svět
Svět: plné barevné plochy podle nástrah (bubblegum, lime, orange, coffee milk), nástrahy jako cukrovinky v nabídce; názvy barev a
příchutí jako „menu“; pružné gumové animace (`elastic.out`), sticker bursty. Ref.: Haribo / Skittles × Nike colourway drop.

| Čas | Obraz | Typo |
|---|---|---|
| Takt 1 | Bubblegum pole, H1 „spadne“ a odpruží (squash & stretch) | „RUČNĚ DĚLANÉ“ |
| Takt 2 | Pole se střídají na doby (lime → orange → brown), uprostřed vždy lure té barvy | čipy „BANÁN · SÝR · OLIHEŇ“ |
| Takt 3 | Mřížka 3 × 3 výřezů, každý na své barvě, buňky se otáčejí jako automat | „PRO TROUT AREA“ · „15 MODELŮ“ |
| Takt 4 | Návrat na night navy, logo + moonky.cz | „VYVÍJENO S REPREZENTACÍ ČR“ |

- Plusy: maximálně barevné, okamžitě čitelné na telefonu, využívá jejich hravé názvy a příchutě. Mínusy: blíží se dětské/levné
  estetice, oslabuje serióznost (reprezentace, závody), plné barevné plochy mimo identitu značky (ta je navy + bílá).

### Doporučení
**A „Moonlight Macro“**, s jedním prvkem z B: v taktu 3 colourway karusel s tónováním pozadí barvou nástrahy (to je ten „drop“
moment). A odpovídá identitě (navy + bílé logo, název Moonky), mluví k závodníkům na MČR a nejlépe využije 4k makro H1 a lesk H3.
B nechat jako variantu pro samostatný Reel na sociální sítě, pokud bude partner chtít hravější tón.
