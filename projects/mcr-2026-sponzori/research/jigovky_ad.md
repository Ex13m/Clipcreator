# Jigovky.cz: reklamní blok (sortiment, hrdinové, svět značky, koncepty)

Datum: 19. 10. 2026 · směr: BRIEF.md › „ZMĚNA SMĚRU“ (reklamní film produktů, vlastní svět sponzora, z TA jen logo).
Podklady: `research/jigovky.md` (+ Verification), `vo/script_cs.json` › jigovky, `vo/jigovky.words.json`, DESIGN.md (jen choreografie: L05 „lens + swatches“).
Výstupy: `assets_prep/jigovky/ads/` (PNG + `_meta.json` + `_sheet.jpg`), skript `scripts/assets_prep/prep_jigovky_ads.py`, log `assets_prep/jigovky/hf_log.md`, fonty `fonts/` + `proto/assets/fonts/` + `proto/assets/fonts.css`.

---

## 1. Sortiment a pozicování (zdroje: stránky staženy přes bridge 19. 10. 2026)

Čísla jsou z filtrů Shoptetu na stránce kategorie („Na skladě N“ a „Značky: … N“). Ceny jsou rozsah posuvníku ceny v kategorii (Kč za balení, většinou 5 ks).

| Kategorie (URL) | Položek | Značky (filtr) | Cena / bal. | Co dominuje |
|---|---|---|---|---|
| Jigové hlavičky `https://www.jigovky.cz/jigove-hlavicky/` | 990 | Jigovky.cz 976 · CFA 11 | 65–145 Kč | Řady JIGEXTRA, SICKLE, SHARP, JIGMASTER. Výpis: SICKLE #2/#4/#6 2–4 g (69 Kč), JIGEXTRA DRÁTEK #1/0, #2/0 2–15 g (109–125 Kč, štítek „Novinka“), JIGEXTRA StandUp DRÁTEK #5/0 5–15 g (135–139 Kč) |
| Bezprotihrotové jigy `https://www.jigovky.cz/bezprotihrotove-jigy/` | 286 | Jigovky.cz 285 · CFA 1 | 69–159 Kč | Podkategorie TROUT JIG, KNÁPEK, HD BARBLESS, Tungsten H 360 BL, Tungsten HD BARBLESS, LL BARBLESS |
| TROUT JIG `https://www.jigovky.cz/jig-trout/` | 16 | Jigovky.cz 16 | 89 Kč | „Jig - TroutJig Barbless“ #4 (0,4 / 0,7 / 1 / 1,3 / 2 / 3 g), #6 a #8 (0,4–2 g). Všech 16 variant má **stejnou fotku** (orig 0,4 g i 3 g mají identické md5 jako p01), takže reálný „žebříček gramáží“ z fotek nejde |
| Tungsten HD BARBLESS `https://www.jigovky.cz/tungsten-hd-barbless/` | 168 | Jigovky.cz 168 | 109–159 Kč | Háčky #2, #4, #6, #8, #10. Barvy FLUO, PINK, RED, ORANGE, BLACK, SILVER, GOLD. #10: 0,4 / 0,6 / 0,9 / 1,3 g; #2: 0,4 g a 2 g |
| Čeburašky `https://www.jigovky.cz/ceburasky/` | 26 | Jigovky.cz 26 | 45–85 Kč | Classic 2–30 g, StandUp 2,5–25 g (pro trout area nerelevantní; fotka 2 g má zapečený text „Kloubová zátěž Čeburaška CFA“ a logo, nepoužitelná) |
| VARIVAS `https://www.jigovky.cz/varivas/` | 140 na skladě | VARIVAS 206 | 125–2 580 Kč | Přeprodej japonské značky: Fluorocarbony, Háčky, Doplňky, Oblečení, Muškařský program, Pletené šňůry, Vlasce. Mj. „Vlasec VARIVAS Trout Nylon Orange / Natural 100 m“ 179 Kč, „Fluorocarbon VARIVAS Hard Top Fluoro“ 365 Kč, „Zátěž Nogales Grenade Sinker“ 130–148 Kč |

Doplňkově z vlastního CSS e-shopu (`https://cdn.myshoptet.com/usr/506750.myshoptet.com/user/documents/smUpravy/code-2.css`) a z banneru rotaček (balení „Výrobce - www.jigovky.cz - Jan Nový“, „Vyrobeno v České republice. Made in Czech republic.“; jen text v obrázku).

**Zjištění**
- **Dominuje vlastní značka.** V jigových kategoriích je značka Jigovky.cz u 976/990, 285/286, 168/168, 16/16 a 26/26 položek. Jde o olověné a wolframové jigové hlavičky prodávané po 5 ks a tříděné podle velikosti háčku a gramáže.
- **Cenový segment: dostupný až střední.** 45–159 Kč za 5 ks (zhruba 9–32 Kč za kus). Prémiový segment tvoří jen přeprodávaný VARIVAS (až 2 580 Kč).
- **Výroba vs. přeprodej.** Vlastní výrobu dokládají USP „Poctivě vyrobeno v ČR“ (HTML homepage) a balení „Výrobce … Jan Nový“ (jen obrázek). Přeprodej tvoří prakticky jen **VARIVAS** (vlasce, fluorocarbony, háčky, oblečení; Nogales) a pár položek CFA.
- **Specialita pro trout area je řada bez protihrotu (286 položek):** TroutJig Barbless (samostatná pstruhová řada, kulatá chromová hlavička, dlouhé raménko), barevné HD BARBLESS v 7 barvách, LL BARBLESS, Tungsten H 360 BL. K tomu VARIVAS Trout Nylon (trout-area vlasec, cizí značka).
- **Pozor na kontext MČR.** MČR 2026 je kategorie **hard baits** (`research/mcr_tournament.md:6`). Klip nesmí naznačovat, že se jigy na mistrovství používají. Jigovky prezentujeme jako partnera s vlastními produkty.
- Rotačky mají trojháček OWNER (`jigovky.md` Verification #5), proto do trout-area klipu nepatří.

---

## 2. Hrdinové a vedlejší produkty (cut-outy v `assets_prep/jigovky/ads/`)

Pravidlo zobrazení: hlavičku nikdy neukazovat větší než asi 1,15 × `head_px` (viz `_meta.json`). Malé swatch výřezy (hlavička kolem 100 px) jen jako čipy ≤ 200 px.

### HERO 1: TroutJig Barbless (vlastní značka, pstruhová řada, bez protihrotu)
- `hero_troutjig_barbless.png`, 2400 × 1571, hlavička Ø ≈ 520 px. Zdroj p01 → Higgsfield 4k upscale → lokální klíč.
- Kotvy v `_meta.json` (normované): `head` [0.148, 0.772], `eye_top` [0.097, 0.393], `hook_point` [0.636, 0.097] (pro callout „BEZ PROTIHROTU“).
- Proč: nejčistší packshot, vlastní značka (na produktu „Značka: Jigovky.cz“), přímo „trout“ a „barbless“. Fakta 0,4–3 g, #4/#6/#8 a 89 Kč/5 ks jsou ověřená.

### HERO 2: barevné hlavičky HD BARBLESS (trio FLUO · PINK · RED)
- `head_fluo.png` (HD BARBLESS #10 FLUO 0,4 g; 1097 × 439; hlavička 325 px), `head_pink.png` (#2 PINK 0,4 g; 1081 × 440; 268 px), `head_red.png` (#6 RED 1,3 g; 1249 × 547; 414 px). Všechny Higgsfield 4k + lokální klíč.
- Výřez začíná vpravo od svěráku. Raménko se doleva rozplývá alfa rampou (45 %), nic není domalované. Levý okraj nikdy neukazovat jako tvrdý řez.
- Proč: barevnost je jejich vizuální podpis (7 barev). FLUO a PINK jsou ve výpisu kategorie **Tungsten** HD BARBLESS. U RED (p07, kategorie HD BARBLESS) materiál neuvádět.

### HERO 3: SICKLE (jádro sortimentu, „jigové hlavičky“)
- `hero_sickle.png`, 2600 × 1098, tmavá hlavička s háčkem SICKLE a protihrotem. Kotvy: `head` [0.161, 0.602], `eye_top` [0.198, 0.089], `hook_point` [0.720, 0.170].
- Proč: zastupuje 990 jigových hlaviček. Je to kontrast k barbless řadě a „druhý svět“ značky (candát/přívlač). V trout klipu jen jako krátký záběr na sortiment (nebo vynechat, pokud blok dostane jen 4 takty).

### Vedlejší (mřížky / vějíř / swatch lišta)
| Soubor | Produkt | Rozměr | Použití |
|---|---|---|---|
| `head_chrome_macro.png` | HD BARBLESS #4 3 g (chrom, iPhone foto 3024 px) | 1159 × 684, hlavička 449 px | makro / přechod, bez upscale |
| `head_silver.png` | HD BARBLESS #2 SILVER 2 g | 468 × 212 | swatch SILVER |
| `head_fluo2.png` | HD BARBLESS #2 FLUO 0,4 g | 414 × 167 | swatch (záloha) |
| `head_gold.png` / `head_orange.png` | Tungsten H 360 BL #6 GOLD / ORANGE 0,4 g | 415 × 96 / 436 × 103 | swatch GOLD / ORANGE (očko vodorovně = „360“) |
| `sec_head_ll_raw.png` | LL BARBLESS #6 2 g (nelakovaná) | 1163 × 677 | „syrová“ hlavička, výroba |
| `sec_varivas_trout_nylon_orange.png` | Vlasec VARIVAS Trout Nylon Orange 100 m | 1320 × 907 | jen „v nabídce také“ (cizí značka, nikdy jako vlastní) |

Nepoužité: banner obrázky (zapečený text, CTA, osoba), čeburaška CFA (text a logo v obrázku), rotačky (trojháček), LL/HD svěrákové fotky v celku (svěrák zakrývá ohyb).

### Pipeline a QA (`scripts/assets_prep/prep_jigovky_ads.py`, `python3 -I …`)
- Všechny zdroje leží na retušované čistě bílé (255). Použitý postup: klíč podle vzdálenosti od bílé + flood z okraje + „ochrana tělesa“ (kružnice napasovaná na hlavičku, oříznutá siluetou), malé uzavřené světlé plochy jako opaque, relativní alfa v pásu u hrany (tmavý drátek bez světlého lemu), un-mix od bílé, halo guard proti textuře papíru z upscaleru a retuš 198 prachových teček na chromové hlavičce (OpenCV Telea, jen těleso).
- Opravené vady (viděno v sheetu a zoomech): bílá dírka v očku (fill-holes), světlý lem na drátku, světlý srpek pod oválnou hlavičkou, prach na chromu.
- Contact sheet: `assets_prep/jigovky/ads/_sheet.jpg` (každá položka na tmavém `#0A0C0B`, světlém `#F7F7F7` a značkovém `#006F33`, s kontaktním stínem). Zkontrolováno vizuálně: bez halo, bez vodoznaků, očka průhledná.
- Higgsfield: **10 z 12 kreditů** (5 × upscale 4k), `remove_background` nepoužit (lokální klíč je na drátku přesnější). Detaily v `assets_prep/jigovky/hf_log.md`.

---

## 3. Svět značky

### Barvy (zdroj: vlastní CSS e-shopu `code-2.css`, ověřeno pixelově na bannerech)
| Token | Hex | Kde ji používají | Role ve filmu |
|---|---|---|---|
| forest | `#006F33` | `#header` background, menu | hlavní pozadí, světlo „lightbox“ |
| deep | `#01431F` | `.submenu`, menu-level-2 | hloubka, vinětace, spodní gradient |
| leaf | `#00AB4E` | horní lišta, názvy produktů, `.big--title` (banner CTA `#00AB4D`) | aktivní stav, linky, ticky |
| button | `#006633` | `.btn-primary/.btn-cart` | čipy, štítky |
| yellow | `#FFD600` | text menu, nadpisy, text tlačítek (banner `#FED700`) | **titulky a akcent** (claim, gramáže) |
| price | `#FF6600` | `.p .prices` | jen cena / jeden bod (střídmě) |
| paper | `#F7F7F7` | body background | světlá scéna, mezititulek |
| ink | `#000000` / `#343434` | Shoptet colorScheme | text na světlé |
| brown | `#593900` | USP texty | nepoužívat (jen reference) |
| logo | `#FFFFFF` | logo bílé na průhledném (`assets_prep/jigovky/logo_on_dark.png`) | vždy na tmavé / zelené |

Barvy produktů pro swatch čipy (změřené z cut-outů a z manifestu): FLUO `#D3FC02`, PINK `#DF0AA1`, RED `#EC0102`, ORANGE `#FE5F00`, GOLD ≈ `#C9A13B` (odhad, kov), SILVER `#D6D6D6`, BLACK `#2F2F2F`.

### Typografie
- E-shop sám nastavuje **Roboto Slab** (nadpisy, tlačítka, titulky blogu, USP) a **PT Sans Narrow** (horní lišta, velké titulky, ceny, názvy produktů); Poppins je jen základ šablony Shoptet. Bannery používají stejný slab (Roboto Slab), balení zúžený tučný grotesk. Logo je vlastní kurzivní patkové písmo, kde „J“ tvoří jigová hlavička (nekopírovat, používat jen logo).
- **Do filmu:** display = **Roboto Slab 900/700** (žlutá `#FFD600` na zelené), labely, čísla a spec čipy = **PT Sans Narrow 700** VERSALKAMI, tracking +0,04 em. Obě písma mají plnou češtinu (kontrola cmap: Č, Ř, Ů, ě, „ “ jsou OK).
- Soubory: `fonts/roboto-slab-{latin,latin-ext}-{400,700,900}-normal.woff2`, `fonts/pt-sans-narrow-{latin,latin-ext}-{400,700}-normal.woff2` (+ licence; @fontsource 5.3.0, Roboto Slab Apache-2.0, PT Sans Narrow OFL). Kopie jsou v `proto/assets/fonts/` a @font-face v `proto/assets/fonts.css`.
- Registrace v bloku (`scripts/blocks/jigovky.mjs`, sdílený `fonts.mjs` se needituje):
  ```js
  export const fonts = {
    'Roboto Slab': { s: { 400: 'roboto-slab-{r}-400-normal', 700: 'roboto-slab-{r}-700-normal', 900: 'roboto-slab-{r}-900-normal' }, use: 'Jigovky display (shop CSS headings)' },
    'PT Sans Narrow': { s: { 400: 'pt-sans-narrow-{r}-400-normal', 700: 'pt-sans-narrow-{r}-700-normal' }, use: 'Jigovky labels / prices (shop CSS)' },
  };
  export const theme = { bg: '#01431F', bg2: '#006F33', fg: '#FFFFFF', accent: '#FFD600', accent2: '#00AB4E', font: { display: 'Roboto Slab', text: 'PT Sans Narrow' } };
  ```

### Tón (tone of voice)
Přímý, praktický, „od rybáře pro rybáře“. Slogan s vykřičníkem („Jigy, které chytají!“), vykání a nabídka rady („Rádi Vám poradíme s výběrem…“), důraz na kvalitu háčku („Na jigových hlavičkách a na háčcích se určitě nevyplácí šetřit… pevnost, ostrost a také tvar.“ – blog 21. 3. 2022). Patriotismus výroby („Poctivě vyrobeno v ČR“). **Ve filmu:** krátké, věcné, číselné titulky (gramy, velikosti háčků, barvy). Žádný luxusní patos, žádné superlativy.

---

## 4. Ověřená fakta pro titulky / VO (jen tato)
| Text | Zdroj |
|---|---|
| „Jigy, které chytají!“ (jejich slogan, v uvozovkách) | logo, `jigovky.md` Verification |
| TroutJig Barbless 0,4–3 g · háčky #4 / #6 / #8 | `https://www.jigovky.cz/jig-trout/` (16 položek) |
| Bez protihrotu / barbless | názvy produktů, kategorie Bezprotihrotové jigy |
| 7 barev: FLUO · PINK · RED · ORANGE · BLACK · SILVER · GOLD | `https://www.jigovky.cz/tungsten-hd-barbless/` |
| Poctivě vyrobeno v ČR | USP v HTML homepage |
| 990 jigových hlaviček v nabídce (stav 19. 10. 2026) | `/jigove-hlavicky/` filtr „Na skladě 990“ (číslo se mění, použít jen s „v nabídce“, ne jako „největší“) |
| jigovky.cz | doména |

Nepoužívat: „největší výběr“, „+1300 druhů“, „japonské háčky“, „vlastní výroba“ jako vlastní tvrzení klipu (jen text v obrázku banneru), „TOP na závodní přívlač“, rotačky. Nenaznačovat použití jigů na MČR (hard baits). VARIVAS nikdy jako produkt Jigovky.

VO (hotové, `vo/jigovky.wav`, 7,79 s): „Jigovky – jigy, které chytají. Bezprotihrotové hlavičky od 0,4 gramu, poctivě vyrobené v Česku.“ Časy slov: *jigy* 1,02 · *Bezprotihrotové* 2,58 · *0,4* 4,43 · *gramu* 5,30 · *poctivě* 5,98 · *Česku* 7,15–7,79.

---

## 5. Dva koncepty

Společné: 1080 × 1920; texty v Reels safe zóně (x 72–960, y 250–1460; dole 420 px a vpravo 120 px bez textu). **TA CZ plaketa** je pevná v rohu (malá, nikdy nepřekrytá, nikdy menší než logo Jigovky v témže záběru: logo sponzora ≤ plaketa TA). Hudba track 3 (129 BPM → takt 1,860 s). Blok = 4 takty (7,44 s), viz otevřený bod 1.

### A) „MAKRO 0,4 g“: produktový film ve stylu Apple / Shimano macro (DOPORUČENO)
Svět: hluboký les `#01431F` → `#006F33` (radiální „lightbox“ světlo za produktem), jemná mlha (mesh), bílé logo, žluté titulky Roboto Slab, spec čipy PT Sans Narrow ve **žlutých kolečkách** jako „vel.“ odznaky na jejich balení (most k jejich obalovému designu).

| Takt | Obraz | Typo / VO |
|---|---|---|
| 1 (0–1,86) | Ze tmy extrémní makro chromové hlavičky TroutJig (`hero_troutjig_barbless`, crop na hlavičku a očko, ≤ 1:1), světelný přejezd (sweep, `screen`) přes chrom na *jigy* (1,02), pomalý push-in | „Jigy, které chytají!“ Roboto Slab 900 žlutá, slovo po slově s VO (1,02–2,4) |
| 2 (1,86–3,72) | Pull-back: celý TroutJig se diagonálně „vznáší“, parallax hloubka (rozmazaný druhý jig v popředí), callout se nakreslí z `hook_point` | čip „BEZ PROTIHROTU“ na *Bezprotihrotové* (2,58); čipy #4 · #6 · #8 |
| 3 (3,72–5,58) | **Barevný drop:** FLUO → PINK → RED hlavičky střih na každou dobu, pozadí se na 20 % tónuje barvou hlavičky; dole vyjede swatch lišta 7 barev (kolečka) | odometer „0,4“ → „g“ přesně na *0,4* (4,43); „0,4–3 g“ |
| 4 (5,58–7,44) | Lock: TroutJig + SICKLE v hloubce (SICKLE rozostřený vzadu = „990 hlaviček“), logo bílé + jigovky.cz, plaketa TA v rohu | „Poctivě vyrobeno v ČR“ PT Sans Narrow 700 na *poctivě* (5,98), URL žlutě |

- Techniky: specular sweep maskovaný alfou, macro push-in, depth parallax, kinetické titulky synchronní s VO (`vo.at`), odometer, swatch čipy, barevný flash jen lokálně (žádné full-frame stroby), přechod `wipe` zelená → další blok.
- **REEL (BLOCK=jigovky REEL=1):** hook takt = makro chromové hlavičky + „0,4 gramu. Bez protihrotu.“ (Roboto Slab, žlutá), pak blok, pak 2-taktový end card na `#006F33`: logo (on_dark) + **jigovky.cz** + „Partner MČR v Trout Area 2026“ + TA logo (≥ logo Jigovky).
- Plusy: prémiové, čisté, opravdu „produkt jako hrdina“. Makro funguje díky 4k výřezům, barvy hlaviček dělají show. Mínusy: vyžaduje přesné tempo (VO je dlouhé).

### B) „OBALOVKA“: retail svět jejich balení (zelená karta, žlutá kolečka)
Svět: zelený gradient blistru jako na balení rotaček (`#145B43` → `#00AB4E`), bílé okno, žluté kulaté odznaky „vel.“, peg-wall.

| Takt | Obraz | Typo |
|---|---|---|
| 1 | Jig „spadne“ na blistrovou kartu, karta se otočí (flip) a ukáže logo | „Jigy, které chytají!“ |
| 2 | Žlutá kolečka popnou na beat s gramážemi 0,4 · 0,7 · 1 · 1,3 · 2 · 3 g | „BEZ PROTIHROTU“ |
| 3 | Peg-wall: karty s barevnými hlavičkami jedou jako marquee (sortiment) | 7 barev |
| 4 | Karta se zastaví, logo + URL | „Poctivě vyrobeno v ČR“ |

- Plusy: okamžitě rozpoznatelné jako jejich značka, hravé, hodně „retail“. Mínusy: blíž k e-shop banneru (to uživatel nechce), víc textu, méně prémiové. Blistr navíc musíme vytvořit sami (nemáme čistý obal TroutJig), což je riziko „vydávat za reálný obal“.

**Doporučení: A „MAKRO 0,4 g“.** Z B si vzít jen žlutá kulatá kolečka jako spec čipy (DNA jejich balení) a zelený gradient. SICKLE ponechat jen na krátký depth záběr v taktu 4, nebo ho vynechat, pokud blok zůstane 4 takty.

---

## 6. Otevřené body
1. **Délka VO 7,79 s je víc než 4 takty (7,44 s).** Doporučuji blok na 5 taktů (9,30 s; VO 0,25 → 8,04 s) nebo VO zrychlit ×1,1 (atempo). Jinak „Česku.“ přeteče do dalšího bloku.
2. Placeholder `scripts/blocks/jigovky.mjs` používá Poppins a `#176E37` (aproximace z banneru). Přepnout na Roboto Slab / PT Sans Narrow a CSS barvy výše (`#006F33`, `#01431F`, `#FFD600`, `#00AB4E`).
3. `content.json` / `data.products` napojit na `assets_prep/jigovky/ads/*` (pořadí: hero_troutjig_barbless, head_fluo, head_pink, head_red, hero_sickle, head_chrome_macro; swatche head_silver / head_gold / head_orange). Starší `assets_prep/jigovky/heroes/h0*` jsou nahrazené.
4. Případný reálný „žebříček gramáží“ by potřeboval fotky od sponzora (e-shop má pro všech 16 variant TroutJigu jednu fotku). Do té doby gramáž ukazovat jen typograficky (odometer), ne škálováním fotky.
