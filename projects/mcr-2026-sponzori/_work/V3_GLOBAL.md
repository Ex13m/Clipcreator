# MČR 2026 · film v3 — globální změny enginu (21. 10.)

> **AKTUÁLNÍ PLÁN = v7 (22. 10., FT Fishing) — viz §0.** Tabulky §1–§2 níže jsou historie v6 (bez FT Fishing, 72 taktů); všechny
> bloky za intrem jsou ve v7 posunuté o +5 taktů / +9,174 s, jejich zdrojové takty (= hudba pod nimi) se NEZMĚNILY.

## 0. v7 (22. 10.): nový blok FT Fishing mezi intro a venue (rozhodnutí operátora 22. 10.)

Výstup: `proto/film/` (FINAL=1, **145,046 s**, 77 taktů), lint 0 chyb. Mix filmu −14,05 LUFS / −2,02 dBTP, VO +9,42 LU nad hudbou.

**Hudba** (`python3 scripts/music_edit.py data/block_plan_B.json`): segmenty zdroje **[10, 23) · [18, 69) · [81, 89) · [101, konec)**.
Intro build 10–17 beze změny → **DROP (zdroj 18) teď padá na začátek FT Fishing** (takt 8), FT = zdroj 18–22 (drop + 4 takty groove A).
Venue pak znovu startuje zdrojem 18 (střih 22 → 18 na době taktu 23,863 s: stejný příchozí takt jako původní drop → „re-drop“, groove
venue je bit po bitu stejná jako ve v6). Všechno za venue = stejné zdrojové takty jako ve v6 (události §2 platí, jen +5 taktů).
Střihy jen na dobách (odchozí do T−6 ms, příchozí equal-power [T−24, T−6] ms); střih 22→18 má stejný profil jako drop 17→18
(max |Δ| 0,188, RMS 5 ms před/po 0,062/0,115). `track_B.wav` + `track_B.beats.json` přegenerovány (mřížka fázově konzistentní,
na náběh úderu), `data/block_plan_B.json` (`total_bars` 77), `data/content.json` (plan, v7), `vo/script_cs.json › order`.
Záloha předchozího stavu: `_work/bak_ftfishing/`.

| blok | takty | počet | t0, s | t1, s | délka, s | takty zdroje | VO, s | rezerva VO → konec, s |
|---|---|---|---|---|---|---|---|---|
| intro | 0–7 | 8 | 0.000 | 14.689 | 14.689 | 10–17 | 13.18 (od 0,5) | 1.01 |
| **ftfishing** (nový) | 8–12 | 5 | 14.689 | 23.863 | 9.174 | 18–22 (DROP) | 6.12 | 2.80 |
| venue | 13–20 | 8 | 23.863 | 38.541 | 14.678 | 18–25 (re-drop) | 12.49 | 1.93 |
| gausseholler | 21–25 | 5 | 38.541 | 47.705 | 9.164 | 26–30 | 5.87 | 3.04 |
| activefishing | 26–30 | 5 | 47.705 | 56.863 | 9.158 | 31–35 | 6.50 | 2.41 |
| bosset | 31–36 | 6 | 56.863 | 67.853 | 10.990 | 36–41 | 8.26 | 2.48 |
| jigovky | 37–41 | 5 | 67.853 | 76.998 | 9.145 | 42–46 | 7.88 | 1.02 |
| moonky | 42–46 | 5 | 76.998 | 86.120 | 9.122 | 47–51 | 7.38 | 1.49 |
| broll | 47 | 1 | 86.120 | 87.946 | 1.826 | 52 | — | — |
| brollbreak | 48–49 | 2 | 87.946 | 91.599 | 3.653 | 53–54 | — | — |
| troutshop | 50–54 | 5 | 91.599 | 100.722 | 9.123 | 55–59 | 6.10 | 2.78 |
| velkaryba | 55–59 | 5 | 100.722 | 109.834 | 9.112 | 60–64 | 6.80 | 2.06 |
| crs | 60–63 | 4 | 109.834 | 117.123 | 7.289 | 65–68 | 4.12 | 2.92 |
| finale | 64–76 | 13 | 117.123 | 145.046 | 27.923 | 81–88 + 101–konec | 12.64 | 15.03 |

VO start 0,25 s (intro 0,5 s), tail ≥ 1,0 s u všech (nejtěsněji intro 1,01, jigovky 1,02). Délky ostatních bloků beze změny (±1 ms).

**Švy**: intro → FT: intro `tOut('zoom')` do bílé → FT svět je bílý papír, kadr 1 = FT/FISHING + pruhy + prut (bez prázdného snímku).
FT → venue: FT `slashOut` (zelené pruhy + bílý panel, zavřeno přesně na konci) → venue `tIn('flash')` z bílé 0,12 s (1 bílý snímek, dron
od 3. snímku) — stejný kontrakt jako původní intro → venue. Ostatní švy beze změny (sousedé stejní), zkontrolováno snímky:
`_work/snap/v3_ftfishing/film_seams/seams_A.jpg`, `seams_B.jpg` (každý šev −0,2 / −0,067 / +0,034 / +0,2 s).

**FT Fishing blok** (`scripts/blocks/ftfishing.mjs` + `scripts/lib/fx_ftfishing.mjs` + `data/blocks/ftfishing.json`), koncept A „Tři
značky – tři takty“: T0 DROP FT/FISHING + VŠE·PRO·PŘÍVLAČ po slovech, prut Arena Stream na pruhy · T1 Favorite (X1 2000S slam na dobu,
PRUTY A NAVIJÁKY na „Pruty“, logo na „Favorite“, Totem na 4. dobu) · T2 Crazy Fish (zelené pruhy stírají do černé + magenta, Vibro Fat,
NÁSTRAHY, logo, hejno 5 gum na osminy) · T3 Spinmad (stěrka do stříbrné, Impulse PRO → Hart → King → Target Spoon 1,5 g na doby) ·
T4 lockup (logo FT ≤ TA, VŠE PRO PŘÍVLAČ, ftfishing.cz, chip „Věnuje ceny · MČR 2026“, 3 sloupce značka + produkt). 13 produktů.
Reel: hook = Impulse PRO + VŠE PRO PŘÍVLAČ (hotové na 1. snímku), end card = plate hero ×1,5 + logo FT + značky + URL + chip.

**Finále**: FT Fishing na kartě montáže (bílý papír + FT zelená, Impulse PRO, „FT FISHING“ v Exo 2) — 9 partnerů na 8 dob → doba 6
taktu 1 rozdělena na osminy (Velká ryba · Bosset), Gausse Holler drží celou poslední dobu před výbuchem; v „burstu“ Target Spoon místo
druhé Moonky; logo stěna 3 × 3 (stejná plocha 21 000 px², max 260 px), GH kolečko se točí (kód beze změny).

**Bosset (operátor 22. 10.)**: bez litráže termosek — velká „0,6 l“ ve spec stacku pryč (stack posunut pod logo Zojirushi), lockup
„Pro vítěze MČR · termosky Zojirushi“, hook pill „termosky Zojirushi“; `data/blocks/bosset.json` + `vo/script_cs.json` onscreen.


Výstup: `proto/film/` (FINAL=1, **135,900 s**, 72 taktů), lint 0 chyb (7 varování, viz §6), všech 12 bloků se staví samostatně
(`BLOCK=all`) a 9 Reels (`BLOCK=all REEL=1`, včetně nového `crs`). Mix filmu −14,04 LUFS / −2,02 dBTP, VO +9,45 LU nad hudbou.
Snímky: `_work/snap/v3_global/seam_1..3.jpg` (každý šev −0,2 / −0,067 / +0,034 / +0,2 s), `logo_bars.jpg` (výřez loga TA uprostřed
každého taktu), `reel_<key>/` (hook 1,0 s + první snímek end cardu + konec).

## 1. Plán B (nové pořadí, takty na mřížce `audio/track_B.beats.json`)

| blok | takty | počet | t0, s | t1, s | délka, s | takty zdroje | VO, s | rezerva VO → konec, s | plán A |
|---|---|---|---|---|---|---|---|---|---|
| intro | 0–7 | 8 | 0.000 | 14.689 | 14.689 | 10–17 | 13.18 (od 0,5) | 1.01 | 8 |
| venue | 8–15 | **8** | 14.689 | 29.366 | 14.677 | 18–25 | 12.49 | 1.93 | 6 |
| gausseholler | 16–20 | 5 | 29.366 | 38.531 | 9.165 | 26–30 | 5.87 | 3.04 | 5 |
| activefishing | 21–25 | 5 | 38.531 | 47.689 | 9.158 | 31–35 | 6.50 | 2.41 | 5 |
| bosset | 26–31 | **6** | 47.689 | 58.679 | 10.990 | 36–41 | 8.26 | 2.48 | 5 |
| jigovky | 32–36 | 5 | 58.679 | 67.824 | 9.145 | 42–46 | 7.88 | 1.02 | 5 |
| moonky | 37–41 | 5 | 67.824 | 76.946 | 9.122 | 47–51 | 7.38 | 1.49 | 5 |
| broll | 42 | 1 | 76.946 | 78.772 | 1.826 | 52 | — | — | 1 |
| brollbreak | 43–44 | 2 | 78.772 | 82.424 | 3.652 | 53–54 | — | — | 2 |
| troutshop | 45–49 | 5 | 82.424 | 91.548 | 9.124 | 55–59 | 6.10 | 2.78 | 5 |
| velkaryba | 50–54 | 5 | 91.548 | 100.660 | 9.112 | 60–64 | 6.80 | 2.06 | 5 |
| crs | 55–58 | **4 (nový)** | 100.660 | 107.949 | 7.289 | 65–68 | 4.12 | 2.92 | — |
| finale | 59–71 | 13 | 107.949 | 135.872 | 27.923 | 81–88 + 101–konec | 12.64 | 15.03 | 13 |

VO start 0,25 s (intro 0,5 s), `vo.tailMin` = 1,0 s → všechny VO sedí (nejtěsněji intro 1,01 a jigovky 1,02). Žádné `!`/CUT.
Troutshop + Velká ryba stojí jako dvojice před crs (čeká na potvrzení operátora — změna pořadí = jen `content.json` + `block_plan_B.json`
+ `python3 scripts/music_edit.py data/block_plan_B.json`, hudba se přestříhá sama).

## 2. Hudba — `audio/track_B.wav` (+ `track_B.beats.json`, `data/block_plan_B.json`)

- Nástroj: `scripts/music_edit.py data/block_plan_B.json` (reprodukovatelný). Zdroj `music/sponsors_3.mp3`, segmenty zdroje (polootevřené):
  **[10, 69) · [81, 89) · [101, konec)** = intro build od taktu 10, **drop přesně na začátku venue (zdroj 18)**, jedna souvislá groove
  sekce 18–68 (venue → crs), střih do peaku 2 na začátku finále (zdroj 81), konec skladby + 2,5 s kosinový fade do ticha.
- Skladba (Suno) zrychluje 130,0 → 132,3 BPM → lineární mřížka nesedí. Nová zdrojová mřížka `music/sponsors_3.grid.json`: polynom
  st. 5 přes doby librosy + lokální fázová korekce z onset obálky 2,7 ms (rezidua p5..p95 −8..+6 ms), **posunutá na začátek úderu**
  (hi-band attack; librosa mřížka plánu A byla ~27 ms za vrcholem flux = ~39 ms za úderem). Na track_B: hi-attack vs doba medián −0,2 ms.
- Střihy jen na dobách taktu, fázově konzistentní: odcházející segment hraje do T−6 ms, příchozí equal-power fade-in [T−24, T−6] ms →
  oba údery celé, žádný klik (HF 5ms okna před T bez špičky). Délka taktu přes střih = příchozí takt (1,815 / 1,798 s).
- `track_B.beats.json → bars[]`: profil každého taktu (dB full/low/high + takt zdroje) pro agenty bloků.

**Hudební události uvnitř bloků (na co se bloky mají napojit):**

| blok (takty bloku) | co hraje |
|---|---|
| intro 0–7 | build bez plného kicku; takt 2 bez basu (low −53 dB); takty 5–7 hi-hat riser do dropu |
| venue 0 | **DROP** (takt 0 přechodový, plný groove od taktu 1), groove A (tiché hi-haty) |
| gausseholler 4 | **fill / dip** (full −20 dB) = nádech před Activefishing |
| activefishing 0 | re-entry akcent zdroje 31 (silný úder), groove B |
| bosset 2–5 | groove B, jasnější hi-haty |
| jigovky 3–4 | **hudební BREAK** zdroje 45–46 (hi-haty pryč −45 dB, takt 4 bez basu) — druhá půlka VO jde přes break |
| moonky 0–1 | rebuild (bas zpět, bez hi-hatů); 2–4 groove C (řídké haty) — sedí na „Moonlight“ |
| broll + brollbreak | groove C, haty se vrací v taktu 44 — **už to není hudební break** (v plánu A byl) |
| troutshop 0–4 | groove D, hi-haty sílí každý takt (build) |
| velkaryba 2 / 3 | takt 2 = **fill / dip**, takt 3 = **vstup peaku 1** (velký úder) |
| crs 0–3 | peak 1 (zatím nejhlasitější) |
| finale 0–7 / 8 / 9–11 / 12 | 0–7 **peak 2** (nejhlasitější, střih na zdroj 81); 8 poslední hlasitý takt bez hatů; 9–11 doznění (−23 dB); 12 finální úder + dozvuk + fade (blok-lokálně: 14,52 / 16,32 / 21,70 s, konec 27,92 s) |

Alternativa (na přání): plán „B2“ s 8taktovou smyčkou groove B dá break zdroje 45–46 pod brollbreak a fill 62 na konec crs — za cenu
jedné smyčky uvnitř groove (nebylo by „jedna souvislá sekce“).

## 3. Logo TA (rozhodnutí operátora 21. 10.)

- **Vždy bílé „TROUT“ + červené „AREA“ na průhledném pozadí** (`assets_prep/ta_cz/logo_h_on_dark.png`), žádná destička, **navy varianta
  se nepoužívá nikde** (původní auto-přepínání na `logo_h_on_light.png` zrušeno). Box `ctx.plate.rect` = původní 300×98 @ 64,250,
  logo uvnitř 281 px = reference pravidla loga (nezměněno, kontrola loga OK ve všech výstupech).
- Čitelnost na světlém / pestrém pozadí = **měkký tmavý stín, ne destička**: `#ta-sh` (rozmazaná tmavá kopie loga 3 px), `#ta-sh2`
  (14 px, měkká záře podél písmen), `#ta-scrim` (velmi slabé radiální halo). Síla podle „tónu“ (`tokens.plate.levels`):
  `dark` (základ) · `scrim` (střední: pestré foto, červené pod AREA) · `halo` (světlé pozadí; alias `light`).
- Kdo tón určuje (nejvyšší první): `ctx.plate.tone(t0,t1,…)` z bloku > `content.json plan[].plate` > **sonda jasu**
  (`node scripts/plate_probe.mjs film|reel:<key>|block:<key>|reels` → `data/plate_tone.json`; měří skutečné snímky pod logem, rozhoduje
  JEN sílu stínu; posílení vyhrává u rychlého střídání světů) > `theme.plate` > jas `theme.bg`. Sonda je platná, jen dokud se kompozice
  bloků nezmění (stamp) → po úpravách bloků ji pustit znovu (film ≈ 9 min), build jinak varuje a padá na default z theme.
- Aktuální film (sonda 21:45 + re-analýza): dark většinu času; halo: intro bílé/světlé karty, Activefishing celé, Bosset bílé karty
  e-shopu (49,98–51,81), začátek finále (krémové světy partnerů 108,6–111,1); scrim: venue voda/dron 19,7–29,4, Bosset, troutshop
  červený svět 85,8–88,4.
- Reels (sonda 22:1x): AF halo celé; bosset halo 3,9–5,95 (bílé karty) + scrim; troutshop scrim na hooku (červená) a 5,0–7,5;
  velkaryba halo na oranžovém hooku 0–2,28; crs/GH/jigovky/moonky dark. Venue reel se během sondy nepostavil — `venue.mjs` právě
  přepisuje agent bloku (chybí default export) → sondu venue pustit po jeho dokončení. Sondy zastarají s každou úpravou bloků
  (agenti teď pracují paralelně) → po integraci: `node scripts/plate_probe.mjs film` + `reels`.
- Kontrola čitelnosti (`logo_bars.jpg`, `reels_endcards.jpg`, `reel_*/`): čitelné na všech taktech včetně bílé (AF), krémové (finále), oranžové, tyrkysové
  vody, zelené, červené. Nejslabší: červené „AREA“ na plně červeném světě Troutshopu (85,8–88,4; bílé TROUT čitelné, AREA drží jen
  tmavý obrys) — případně `ctx.plate.tone(…, 'halo')` v troutshopu nebo neumisťovat plnou červenou pod roh.

## 4. „Trochu našeho stylu“ (jen akcenty, světy sponzorů nepřebarveny)

1. **Podpisový záblesk loga TA v rytmu — jen intro a finále**: světelný pruh projede logem (maskováno alfou loga) na každou dobu taktu,
   nejjasnější přesně na doběhu (23× ve filmu; `tokens.ta.glint`).
2. **End card lockupy** (`fx.endCard`, `ta: true` default): řádek pod logem TA v Montserrat caps + TA-červená hairline 140×3 px.
3. **`fx.taChip`** (Montserrat 800 caps + TA-červená hairline, skleněná pilulka) — k dispozici pro „Věnuje ceny · MČR 2026“.
4. **Přechod `fader`** (`fx.tIn/tOut('fader')`): 8 sloupců jako fadery mixu jede nahoru s TA-červenými „knoflíky“ na hraně.
   Ve filmu použit jednou: **crs → finále**.
- `TA` paleta exportována z `fx.mjs`. BLOCK_API §10/§13: víc TA prvků bloky samy nepřidávají.

## 5. Nový blok `crs` (Český rybářský svaz) — placeholder

`scripts/blocks/crs.mjs` + `data/blocks/crs.json` + `vo/crs.wav` (4,12 s „Děkujeme Českému rybářskému svazu za dlouholetou podporu.“).
Svět ČRS (modrá #2B5DA9 / navy #182F5D / tyrkys znaku), DĚKUJEME (Montserrat + TA hairline) → titul ČESKÝ RYBÁŘSKÝ SVAZ na „Českému“
→ logo ČRS bílé (≤ TA) → „za dlouholetou podporu“ na „za“ → ověřený chip „Vlastník areálu Líheň Liběchov · ČRS · MO Mělník“ → kulatý
znak + rybsvaz.cz → fader do finále. `meta.role = 'supporter'` → build hlídá, že **nenese** „Věnuje ceny“. Reel: default hook +
default end card („Děkujeme za dlouholetou podporu“). Výchozí hook/end card v `lib/reel.mjs` jsou nově hotové na 1. snímku.

## 6. Co musí bloky přizpůsobit (pro agenty bloků)

- **venue: 8 taktů** (bylo 6) — VO 12,49 s od 0,25 s; dron v2 zůstává; 3D „koryto“ → motion-graphics schéma (`data/pond_scheme.json`).
  Teď se původních 6 taktů natáhne a poslední scéna stojí ~3,7 s navíc. Drop = takt 0. Vstup z intra = zoom-through do bílé (OK).
- **bosset: 6 taktů** (bylo 5) — VO 8,26 s, lockup teď trvá 2 takty; doplnit akcent na termosky na konci. Lint varování
  `overlapping_gsap_tweens #bosset-hero-rot` (0,81 s) = časování z nové mřížky.
- **crs: 4 takty** — placeholder k dopracování.
- **gausseholler** je hned po venue (vstup: venue blob do černé → cut, OK); poslední takt = hudební fill; výstup zoom do bílé →
  Activefishing (světlý svět) funguje.
- **jigovky**: takty 3–4 = hudební break (bez kicku) — dobré místo pro zklidnění / makro, ne pro velké údery.
- **moonky**: takty 0–1 rebuild bez hatů.
- **broll/brollbreak**: už není pod hudebním breakem (groove); lint varování `overlapping_gsap_tweens #broll-u0..2-cam` (nová mřížka).
- **velkaryba**: takt 2 fill, takt 3 vstup peaku 1 — přirozené místo pro hlavní úder bloku.
- **finale**: začíná peakem 2 hned po crs (fader v barvě finále `#04060a`); první snímek po švu je mléčný kvůli `tIn flash 0,16` přes
  fotku — zvážit kratší flash. Struktura konce (8 peak + 101 + doznění + úder) je stejná jako v plánu A.
- Všechny bloky: mřížka je nově na začátku úderu (o ~39 ms dřív vůči audiu než v2) — vizuální údery teď sedí přesně, nic neposouvat.
- Sousedé se změnili → přechody se barevně napojují automaticky (`ctx.next.theme.bg`); švy viz `seam_1..3.jpg` — žádný prázdný /
  dvojexpoziční šev, nejdelší jednobarevný úsek ~0,2 s (venue→GH černá, velkaryba→crs navy).
- Při změně bloků znovu pustit sondu loga (`node scripts/plate_probe.mjs film`, pak `reels`).

## 7. Změněné / nové soubory

`scripts/music_edit.py` (nový), `music/sponsors_3.grid.json` (nový), `audio/track_B.wav`, `audio/track_B.beats.json`,
`data/block_plan_B.json`, `data/content.json` (plán B, v6; záloha `content.pre_planB.json`), `data/tokens.json` (logo bez destičky,
stínové úrovně, TA akcenty), `data/plate_tone.json` (sonda), `data/blocks/crs.json`, `scripts/blocks/crs.mjs`, `scripts/build.mjs`
(tóny loga, sonda, záblesk, role, sidecar `proto/<out>/plate.json`, `PLATE_HIDE`), `scripts/lib/ctx.mjs` (`plate.tone`, geometrie),
`scripts/lib/fx.mjs` (`TA`, `fader`, `taChip`, `endCard ta`), `scripts/lib/reel.mjs`, `scripts/plate_probe.mjs` + `scripts/lib/plate_probe.py`
(nové), `scripts/BLOCK_API.md` (§5, §7, §10, §13).
