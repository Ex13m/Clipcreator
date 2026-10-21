# Jigovky.cz: značky v sortimentu (film v3, úkol „brands A“)

Datum: 21. 10. 2026. Stránky staženy přes most (Zapier GET), logo přes Zapier Drive upload → Drive download.
Počty jsou z filtru „Značky“ na stránce kategorie Shoptetu („Položek k zobrazení: N“). Navazuje na `research/jigovky.md` a `research/jigovky_ad.md` (19. 10.); čísla jigových hlaviček a bezprotihrotových jigů jsou 21. 10. stejná.

## 1. Ověřené zdroje (citace + URL)

| Co | Citace (doslova, text filtru) | URL |
|---|---|---|
| Jigové hlavičky | „Značky CFA 11 Jigovky.cz 976 Položek k zobrazení: 990“ | https://www.jigovky.cz/jigove-hlavicky/ |
| Bezprotihrotové jigy | „Značky CFA 1 Jigovky.cz 285 Položek k zobrazení: 286“ | https://www.jigovky.cz/bezprotihrotove-jigy/ |
| VARIVAS | „Značky VARIVAS 206 Položek k zobrazení: 206“; podkategorie „Fluorocarbony Háčky Doplňky Oblečení Muškařský program Pletené šňůry“ (+ Vlasce v menu) | https://www.jigovky.cz/varivas/ |
| Gumové nástrahy | „10 položek celkem“ (Bagy L, Gamer baby/big/small, Kukla, Long worm, Master, Sweet, Sweet big, Worm; 169 Kč); výrobce v datech produktu `"manufacturer":null` (značka neuvedena) | https://www.jigovky.cz/gumove-nastrahy/, https://www.jigovky.cz/master/ |
| Vlastní značka | v datech produktů homepage `"manufacturer":"Jigovky.cz"` (44×) | https://www.jigovky.cz/ |
| Jigovky prodává i Activefishing | filtr „Jigovky.cz 48“ v kategorii Jigové hlavičky, háčky | https://www.activefishing.cz/jigove-hlavicky--hacky--ceburasky/ |

Menu (21. 10.): Signalizátory (Čihátka, Čihátka na chemické světlo, Kačenky, Splávky) · Mořské jigy (Jig STRONG, Jig ZOOM Torpedo, Jig BULLET STRONG) · Rotační třpytky (CLASSIC 000–2, CLASSIC BARBLESS 000–2) · Jigové hlavičky (JIGEXTRA, SICKLE, SHARP, JIGMASTER) · Bezprotihrotové jigy (TROUT JIG, KNÁPEK, HD BARBLESS, Tungsten H 360 BL, Tungsten HD BARBLESS, LL BARBLESS) · Čeburašky (Classic, StandUp, háčky na čeburašky) · Zavrtávací hlavy · VARIVAS · Gumové nástrahy. Nově proti 19. 10. jsou v menu Signalizátory a Mořské jigy (pro trout area nerelevantní).

## 2. Značky a pořadí pro trout area

1. **Jigovky.cz** (vlastní výroba): 976/990 jigových hlaviček, 285/286 bezprotihrotových jigů (TroutJig Barbless, HD BARBLESS, Tungsten…), rotačky, čeburašky. Dominantní značka obchodu; logo už je v projektu (`assets_prep/jigovky/logo_on_dark.png`, `logo_on_light.png`, `logo_plate.png`).
2. **VARIVAS** (přeprodej): 206 položek; pro trout area hlavně „Vlasec VARIVAS Trout Nylon“ (`jigovky_ad.md`), fluorocarbony, háčky.
3. **CFA**: 11 jigových hlaviček + 1 barbless jig (čeburašky „Kloubová zátěž Čeburaška CFA“, `jigovky_ad.md`); okrajové.
4. **Nogales** (zátěže „Nogales Grenade Sinker“ v sekci VARIVAS, `jigovky_ad.md`); okrajové.
5. **OWNER**: jen trojháček na rotačkách („Rotačka je vyzbrojena trojháčkem značky OWNER“, `jigovky.md`); do trout-area klipu nepatří.

Gumové nástrahy (10 modelů) nemají uvedenou značku, nepřipisovat je nikomu.

## 3. Stažená loga → `assets_prep/jigovky/brands/` (1)

| slug | Zdroj | Velikost | Poznámka |
|---|---|---|---|
| varivas | **oficiální SVG** https://www.varivas.co.jp/bjAhvt/wp-content/themes/swell_child/assets/img/common/logo_header.svg (rastr 2400 px, průhledné) | 2400×524 | `varivas.png` modrá #003F98 (světlé pozadí), `varivas_on_dark.png` bílá. Na webu Jigovky žádné logo VARIVAS není (jen produktové fotky). Stejný soubor jako u Troutshopu a Activefishingu |

Vlastní logo Jigovky se nekopíruje (už je v `assets_prep/jigovky/`). Soubory `manifest.json` a `_sheet.jpg` (QA na bílé / #0A0C0B / černé / TA navy) v `assets_prep/jigovky/brands/`.

## 4. Typografický wordmark (logo nedostupné)

Styl jako v ostatních blocích: **Montserrat 800, verzálky, tracking +0,04 em**, bílá na tmavém, výška verzálek = výška sousedních log.

| Značka | Text | Poznámka |
|---|---|---|
| CFA | `CFA` | logo jen zapečené ve fotce čeburašky; nepoužívat v trout bloku |
| Nogales | `NOGALES` | jen pokud bude záběr na zátěže |

## 5. Doporučení pro blok a bannery

- Jigovky je **výrobce**, ne prodejce značek: příběh stavět na vlastní značce (JIGOVKY.CZ, „Poctivě vyrobeno v ČR“, `jigovky.md` #1) a sortimentu po řadách: **TROUT JIG BARBLESS** → **HD BARBLESS** (7 barev) → **TUNGSTEN** → **LL BARBLESS**. Značková stěna tu nedává smysl; stačí jeden řádek „V nabídce také: VARIVAS“ s logem `varivas_on_dark.png` (menší než logo Jigovky i logo TA).
- Propojení sponzorů (volitelně do bloku Activefishing, ne sem): Jigovky.cz hlavičky prodává i Activefishing (48 položek).
- Nepoužívat: „největší výběr“, „+1300 druhů“, rotačky (trojháček OWNER), naznačovat použití jigů na MČR (kategorie hard baits) – viz `jigovky_ad.md`.
- **Pravidlo loga:** logo VARIVAS i logo Jigovky menší než logo TA CZ (`ctx.logo`, max ≈ 281 px šířky a 23,6k px² plochy při plaketě ×1).
