# Přidat sponzora — návod pro paralelního agenta (1 agent = 1 sponzor)

Engine je hotový a sdílený. **Upravuješ JEN `scripts/sponsors/<key>.mjs`** (+ případné vlastní assety v `assets/<key>/`).
Neměň `scripts/build.mjs`, `scripts/engine/*`, `data/event.json` ani filmový projekt `mcr-2026-sponzori/` (z něj jen čteš).
Potřebuješ něco v enginu? Napiš to do závěrečné zprávy a proč.

## Klíče sponzorů

| key | role (`brand.role`) | chip (kreslí engine) | URL | svět z filmu |
|---|---|---|---|---|
| `venue` | `host` | Místo konání MČR 2026 (bez cenového chipu) | lihenlibechov.cz | `blocks/venue.mjs`, Bitter + Montserrat, navy/tyrkys/zlatá |
| `gausseholler` | `prize` | Hlavní cena pro vítěze MČR · Revolut 8 + řádek „Partner a informační sponzor“ | gausseholler.com | **hotovo — reference** |
| `activefishing` | `sponsor` | Věnuje ceny · MČR 2026 | activefishing.cz | světlý svět (`light: true`), Saira Extra Condensed + Nunito |
| `bosset` | `sponsor` | Věnuje ceny · MČR 2026 | bosset.cz | Saira, deep/teal/žlutá |
| `jigovky` | `sponsor` | Věnuje ceny · MČR 2026 | jigovky.cz | Roboto Slab + PT Sans Narrow, zelená/žlutá |
| `moonky` | `sponsor` | Věnuje ceny · MČR 2026 | moonky.cz | Exo 2 + Source Sans 3, noc/limetka/měsíc |
| `troutshop` | `sponsor` | Věnuje ceny · MČR 2026 | troutshop.eu | Anton + Roboto Condensed, černá/červená |
| `velkaryba` | `sponsor` | Věnuje ceny · MČR 2026 | velka-ryba.cz | Nunito 900 italic, navy/červená/oranžová |
| `crs` | `supporter` | Děkujeme za dlouholetou podporu (bez cenového chipu) | rybsvaz.cz | Inter, modrá #2B5DA9 / navy #182F5D / tyrkys |
| `ftfishing` | `sponsor` | Věnuje ceny · MČR 2026 | ftfishing.cz | bílý web + zelené šikmé pruhy #6DB52C, Exo 2 800 + Saira, koncept „Tři značky“ (research/ftfishing_ad.md) |

URL ber z `mcr-2026-sponzori/data/blocks/<key>.json → url` (ověřené). Barvy/fonty: `theme` ve filmovém bloku `scripts/blocks/<key>.mjs`
a `lib/fx_<key>.mjs`, výřezy `assets_prep/<key>/ads|heroes|brands/`, fakta `research/<key>*.md` (sekce Verification) a
`vo/script_cs.json → blocks.<key>.onscreen`. Respektuj `rules.never_say` ve `vo/script_cs.json` a `notes` v datech bloku.

## Postup

```bash
cd /home/user/Clipcreator/projects/mcr-2026-bannery
cp scripts/sponsors/_template.mjs scripts/sponsors/<key>.mjs        # startér: sám načte logo/produkty/copy z filmových dat
node scripts/build.mjs <key> --only=static,carousel                  # rychlá iterace (~10 s): 4 statiky + 4 karty karuselu
#   … otevři renders/<key>/_sheet.jpg, podívej se, oprav, opakuj (min. 2 kola) …
node scripts/build.mjs <key>                                         # finál: + 2× MP4 (4:5, 1:1, 10 s, ~70 s), sheet, _qa.json
```

Výstupy: `renders/<key>/<key>_static_{1x1,4x5,191,9x16}.png`, `<key>_carousel_{1..4}.png`, `<key>_anim_{4x5,1x1}.mp4`,
`_sheet.jpg` (kontaktní arch), `_qa.json`. Build skončí kódem 1 a řádkem `XX`, když se poruší pravidlo (viz níže).
MP4 rendery se mezi agenty řadí přes zámek (`/tmp/mcr-bannery-video.lock`), takže paralelní agenti nepřetíží 4 jádra —
když build píše „waiting for the video lock“, jen čeká.

## Co modul exportuje (vzor: `scripts/sponsors/gausseholler.mjs`)

| export | povinné | význam |
|---|---|---|
| `brand = { name, url, role }` | ano | `url` = přesný text na banneru; `role` = sponsor / prize / host / supporter |
| `theme = { bg, light, taTone, chrome:{…} }` | ne | barva pozadí stránky; `light:true` = silný stín loga TA; `chrome` = barvy/font URL (`url`, `urlFont`, `urlW`), řádku role (`sub`), chipu (`chipBg`, `chipFg`, `chipLine`, `dot`), řádku akce (`event`), `shadow` |
| `fonts` | ne | další rodiny (woff2 latin + latin-ext v `mcr-2026-sponzori/fonts/`); v registru už jsou Inter, Montserrat, Saira, Saira Extra Condensed, Nunito, Anton, Roboto Condensed, Roboto Slab, PT Sans Narrow, Exo 2, Source Sans 3, Bitter, Jost, Cormorant Garamond, Oswald, Outfit, Poppins, Archivo, Playfair Display… |
| `css(E)` | ne | globální CSS (prefixuj třídy zkratkou sponzora, např. `.gh-`) |
| `scenes = { poster, who, range, hero, mcr }` | `poster` ano | každá `(E) => ({ html, css?, taTone? })`. `poster` = všechny 4 statiky + začátek/konec smyčky MP4; `who` / `range` / `hero` / `mcr` = karty karuselu 1–4 (chybí-li `mcr`, použije se poster) |
| `anim = { seq:[{scene, d}] }` | ne | sekvence MP4 (součet ≈ 10 s; první a poslední scéna = `poster` → bezešvá smyčka). Default: poster 2,6 · range 2,3 · hero 2,3 · poster 2,8 |

Scény se kreslí pro formáty `E.kind`: `square` (1080², karusel + MP4 1:1 + statika), `portrait` (1080×1350), `tall` (1080×1920),
`wide` (1200×628). Karty `who/range/hero/mcr` a scény v `anim.seq` musí fungovat ve `square` i `portrait`.

**Engine kreslí sám (chrome), scéna to NEKRESLÍ:** logo TA vlevo nahoře (bílé TROUT + červené AREA, měkký tmavý stín, nikdy
destička), URL vpravo nahoře (+ řádek role u GH), chip role dole a řádek akce
„MČR v Trout Area 2026 · 24.–25. 10. 2026 · Líheň Liběchov“ úplně dole. Scéna má volný box **`E.body` = {x, y, w, h, r, b}**
mezi hlavičkou a patičkou; pozadí kresli přes celé plátno, texty a klíčový obsah drž v `E.body`.

### Pomocníci `E`
- `E.W`, `E.H`, `E.kind`, `E.body`, `E.ta` (box loga TA: x, y, w, h, area), `E.f` (formát), `E.brand`, `E.event`.
- `E.src('film:assets_prep/…')` → URL souboru (`film:` = mcr-2026-sponzori, `own:` = tento projekt, `shared:` = _shared); `E.dims(rel)` → [w, h].
- `E.img(rel, {x|cx, y|cy, w, h, maxUp=1, id, cls, style, attrs})` → `{html, x, y, w, h}` — nikdy nezvětší nad nativní velikost.
- `E.logo(rel, {x|cx, y, maxW, maxH, trim:[x,y,w,h], attrs})` → `<img class="sp-logo">` už **zmenšené podle pravidla loga**
  (šířka ≤ logo TA, plocha ≤ plocha loga TA). `E.logoFit(aspect)` → max {w, h}. Vlastní složené logo (jako GH 3 vrstvy) musí
  mít třídu `sp-logo` a velikost z `E.logoFit`.
- `E.t(text)` = escape + česká typografie (NBSP po v/k/s/z/o/u/a/i, „1 300“, „24. 10.“); `E.esc`, `E.nb`, `E.px`, `E.hex2rgba`.

### Animace (atributy na libovolném prvku scény; čistě funkce času → deterministické)
- `data-in="up|down|left|right|scale|slam|rise|fade|wipe-l|wipe-r|wipe-u"` vstup při začátku scény (`data-d` zpoždění,
  `data-dur`, `data-dist` px). Prvky jsou neprůhledné do 3 snímků od střihu, zpoždění posouvá jen pohyb (žádné prázdné snímky).
- `data-spin="360"` = rotace za celou smyčku po směru hodin (GH vnější prstenec loga). Ve statikách 0°.
- `data-kb="1,1.06"` Ken Burns, `data-pan="dx,dy"`, `data-float="amp,perioda"`, `data-cycle="0.3"` (děti `.cy` se střídají —
  barevné varianty; `data-rest="k"` = co je na statice), `data-sweep="a,b"` (světelný přejezd; maskuj alfou produktu jako GH).
- Nedávej prvku s animací `transform` přes vlastnost `transform` v CSS třídě — inline `style="transform:…"` se zachová jako základ.

## Pravidla (hlídá je build → `XX`)
1. Logo TA viditelné, nikdy menší než logo sponzora (šířka i plocha) — `.sp-logo` se měří.
2. URL sponzora na každém výstupu; řádek akce na každém výstupu.
3. Chip podle role přesně (`data/event.json → roles`); `host`/`supporter` nesmí obsahovat „Věnuje ceny“ / „Hlavní cena“.
4. Texty `.t` nesmí vylézt z plátna ani do chrome (logo TA, URL, chip, řádek akce); `[data-fit]` text se musí vejít.
5. Varování (`!`): text mimo safe zónu, hlavní řádek (`.main`) < 40 px, obrázek zvětšený > 1,3×.

Texty: česky, krátce, jen ověřená fakta. Hlavní řádky ≥ 40 px (třída `main`), vedlejší ≥ ~22 px. Bez „nejlepší“ apod. (viz never_say).
Lekce z filmu platí i tady: žádné poloprůhledné „duchy“ produktů, žádné šedé flash přechody, produkt = hrdina, čisté výřezy.

## QA před odevzdáním
1. `node scripts/build.mjs <key>` → `OK`, 0 × `XX`.
2. Prohlédni `renders/<key>/_sheet.jpg` (statiky, karusel, snímky obou MP4) a aspoň 9:16 a 1.91:1 v plném rozlišení.
3. Snímky kolem střihů MP4: `ffmpeg -ss <t> -i renders/<key>/<key>_anim_4x5.mp4 -frames:v 1 x.png` (t = hranice scén + 0,03 s).
4. Zpráva: cesty výstupů, co je na kterém formátu, otevřené otázky.
