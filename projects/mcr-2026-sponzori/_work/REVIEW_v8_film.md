# REVIEW · film_9x16_v8.mp4 (CD + QC, 22. 10. 2026)

Soubor: `renders/film_9x16_v8.mp4` · kontrola jen z hotového renderu (ffmpeg extrakce snímků + numpy, bez nového renderu, nice 15).
Snímky: `_work/snap/review_v8/` (níže jen název souboru).

**Verdikt: 0 BLOCKER · 3 MAJOR · 9 MINOR.** Technicky se dá předat (zvuk, formát, logo TA, GH kolečko, fakta i rozhodnutí z 22. 10. sedí). Před akcí ale
opravit MAJOR 1 (u data akce rolují nesmyslná data) a ideálně i MAJOR 2–3. Všechny tři jsou lokální úpravy jednoho bloku (finale / troutshop + activefishing / brollbreak).

---

## Co prošlo (souhrn kontrol)

| oblast | výsledek |
|---|---|
| Kontejner | H.264 High L4.0, yuv420p, bt709 tv, 1080×1920, 30/1 CFR, **4078 snímků = 135,933 s** (= tabulka §00), AAC LC 48 kHz stereo 262 kb/s, video 6,6 Mb/s, 116,8 MB, `moov` před `mdat` (faststart), 34 klíčových snímků |
| Hlasitost | ebur128: **I = −14,0 LUFS**, **TP = −1,9 dBTP**, LRA 3,7 LU ✔ |
| VO vs hudba | Fit metodou nejmenších čtverců mix ≈ a·track_B + b·VO (okna 100 ms, reziduum −20…−26 dB, takže pozice VO v renderu jsou správně). **VO je nad hudbou o +7,6 až +11,1 dB** ve všech 11 blocích (nejméně crs +7,6, finale +7,8, FT +7,7). Srozumitelné ✔ |
| Střihy hudby | 14,689 / 23,863 / 76,998 s: v okně [T−60, T] ms žádná HF špička (|Δ²| max 0,05–0,18 = úroveň okolní hudby), energie roste až na úderu → **bez kliků** ✔ |
| Začátky/konce VO | Stemy: řeč začíná 30–90 ms od začátku souboru, končí 30–120 ms před koncem. V mixu offset 0,25 s / 0,5 s → začátky nejsou useknuté. Nejtěsnější je intro (konec řeči 13,15 s z 13,18 s, posledních 30 ms −50 dBFS) → jen poslechnout |
| A/V sync | slova VO vs kinetické texty: 1934 (VO 28,21 → na obraze 27,8), „od 0,4 g“ (72,69 → 72,64), „Speciálka“ (93,90 → 93,9), „Shimano“ (96,33 → 96,35), „1999“ (86,66 → 87,1), datum ve finále (114,99 → 115,03) ✔. Výjimka viz MINOR 3 |
| Logo TA | Bílé TROUT + červené AREA bez destičky v rohu ve **všech 72 taktech** (`logo_every_bar.jpg`), nikdy překryté. V intru 0,2–2,1 s, v ČRS 101–107,7 a ve finále 111,5–konec je jako hero uprostřed (větší). Na konci zůstává do posledního snímku (`end_fade.jpg`). Žádné logo sponzora (asset) není větší než TA; k nápisům viz MINOR 5 |
| GH kolečko | Měřeno polární korelací modré masky (kladný úhel = po směru hodin na obrazovce). Lockup GH 46,0/46,5/47,0 s: +12,5° / +13,0° za 0,5 s. Stěna ve finále 121,5–123,5 s: +12…+13,5° za 0,5 s. „MADE BY ⚙“ 126,5/127,0/127,5 s: +13,0° / +12,5°. **Všude se točí po směru hodin, ~25°/s** ✔ (`gh_ring_lockup.jpg`, `gh_ring_wall.jpg`, `gh_ring_madeby.jpg`) |
| Rozhodnutí z BRIEFu | **770+ woblerů** (AF 55,9) ✔ · Bosset bez litráže (jen „Až 6 hodin“, „termosky Zojirushi“) ✔ · **Moonky nikde**: intro teaser = 8 partnerů filmu (`intro_teaser.jpg`), finálová montáž = 8 karet (`finale_montage.jpg`), stěna 2×4, burst bez Moonky (růžová guma = Crazy Fish) ✔ · FT lockup Favorite · Crazy Fish · Spinmad · **Vanfook „HÁČKY“** ✔ · GH „Hlavní cena pro vítěze MČR · Revolut 8“ + „Věnuje hlavní cenu“ ✔ · ČRS bez chipu cen, „vlastní ČRS · místní organizace Mělník“ ✔ · venue bez chipu cen („Místo konání MČR 2026“) ✔ · „Donedávna nejníže…“ + 164 m n. m. jen spolu, štítek „AI ilustrace“ ✔ |
| Fakta vs research | 1934 + „Založil Karel Stutzig“ (libechov.md:32) ✔ · 50 × 40 m, 0,2 ha, hloubka 1,5 m ✔ · Troutshop 1999, „Generální partner Trout Area Slovakia“, „3 100+ plandavek v nabídce“ (troutshop_ad.md:128) ✔ · AF 1 300+ plandavek ✔ · Jigovky od 0,4 g, barbless, Varivas ✔ · Velká ryba od 2011, Olomouc, Shimano Rod Test Center ✔ · Bosset distributor Keitech / YGK X-Braid ✔ |
| Pravopis | Diakritika a typografie všech čitelných titulků v pořádku (24.–25. 10. 2026 s mezerami, „Sporťáček“, „Liběchov“, „vyzkoušíte“, „od značek … a mnoha dalších“ = správný genitiv). Překlep jsem nenašel |

---

## BLOCKER

Žádný.

---

## MAJOR

### MAJOR 1: Finále, odometr data akce roluje přes nesmyslná data (114,73–115,03 s, ~10 snímků)
`odo_fin_date_ff.jpg`, `sync_fin_date.jpg`. Pod „MISTROVSTVÍ ČR v Trout Area 2026“ se datum dotáčí přes čitelné **„10.–00. 00. 0000“, „89.–99. 65. 6441“, „13.–14. 09. 1915“** a teprve v 115,03 s ukáže 24.–25. 10. 2026. Je to přesně datum akce a hlavní CTA filmu. Na pauze nebo při screenshotu z Reels je vidět špatné datum. Stejnou chybu už jednou řešil venue blok (MEMORY ř. 93: odometr = 4–5 snímků kaše).
**Oprava** (`scripts/blocks/finale.mjs`, poster v taktech 2–5): datum neodometrovat. Použít `fx.headline` / settle (maska zdola + blur 6→0, 0,25 s) nebo per-digit reveal bez rolování: každá číslice vyjede ze svého okna `overflow:hidden` jen o 1 pozici. Načasování ponechat (settle na 115,0 = VO „24.“ v 114,99).

### MAJOR 2: Odometry Troutshop „1999“ a Activefishing „1 300“ ukazují cizí čísla a přetékají z okna
`odo_ts_1999.jpg`, `odo_af_1300.jpg`, `midbars_3.jpg` (m47 87,04).
- Troutshop 86,6–87,0 s: „4?5?“, „0776“. V 87,04–87,15 s nad hotovým „1999“ ještě trčí useknutá řada číslic (v okně je vidět spodek předchozí řady). Je to letopočet, tedy fakt.
- Activefishing 51,45–51,75 s: „6 746“, „0 290“ a „PŘES 2 ½ 2“ (to je i snímek na downbeatu taktu 28, `downbeats_all.jpg` b28). Číslo přitom VO právě říká („Přes tisíc tři sta“ od 51,39 s).
- Venue 1934 (27,65 s) a Troutshop „3 100+“ (88,0) jsou jen krátké, ale mají stejný mechanismus (`odo_venue_1934.jpg`).

**Oprava** (`scripts/blocks/troutshop.mjs`, `scripts/blocks/activefishing.mjs`, případně `fx.odometer`): u letopočtů a „1 300“ nahradit odometr headline/settle (lekce venue). Pokud odometr zůstane: `spins:0`, okno `overflow:hidden` s výškou = 1 řádek + `y` ≥ výška okna + rezerva na `scaleY` (lekce Bosset, MEMORY ř. 89), cílová hodnota hotová ≥ 0,1 s před slovem ve VO.

### MAJOR 3: Brollbreak, prolínačka ZÁBĚR. → PSTRUH. = dvojexpozice přes downbeat (80,60–80,80 s, ~6 snímků)
`ff_brb_grey.jpg`, `downbeats_all.jpg` b44 (80,69). Ve filmu, kde je všechno jinak tvrdý střih na úder, je právě tady ~0,2 s kaše: obličej závodníka přes rybu a průhledné „PSTRUH.“ přes „ZÁBĚR.“. Na úderu vypadá jako chyba renderu.
**Oprava** (`scripts/blocks/broll*.mjs`, brollbreak): tvrdý střih + slam přesně na úder 80,65 (jako NERVY. → ZÁBĚR. v 78,82), případně whip/slice ≤ 3 snímky. Žádný crossfade fotek.

---

## MINOR

### MINOR 1: Mléčné / šedé snímky na švech (každý 1–2 snímky)
- GH → AF **47,634** (šedá „pelena“ přes tmavý GH lockup) + 47,667 prázdná bílá (`ff_gh_af.jpg`, `seams_1.jpg`).
- Jigovky → broll **77,000**: první snímek slamu je zesvětlený a vybledlý (`ff_jig_broll.jpg`).
- Broll → brollbreak **78,833** mléčný snímek, pak 78,867–78,90 **šedé** letterbox pruhy, černé jsou až od 78,93 (`ff_brb_top.jpg`).
- ČRS → finále **108,034** mléčná první karta DĚKUJEME (`ff_crs_fin.jpg`; známé z §6 V3_GLOBAL).

**Oprava:** flash/screen při vstupu ≤ 0,3 a nanejvýš 2 snímky, na tmavém produktu ≤ 0,08 (lekce GH, MEMORY ř. 90). Letterbox brollbreaku černý (#000) od 1. snímku. U finále `tIn flash` zkrátit na 1 snímek nebo nahradit cutem.

### MINOR 2: Prázdné jednobarevné držení na švech (3–5 snímků)
- venue → GH 38,40–38,53 (černá, 5 snímků)
- **AF → Bosset 56,70–56,83 (prázdná tyrkysová, 5 snímků)**
- jigovky → broll 76,87–76,97 (černá, 4)
- ts → vr 91,50–91,57 (navy, 3)
- vr → crs 100,67–100,70 (2)
- crs → fin 107,90–108,00 (černá, 4)

Logo TA je vždy vidět. Nejhůř působí AF → Bosset: vypadá to jako výpadek, ne jako záměrný přechod (`seams_2.jpg`).
**Oprava:** u AF → Bosset nechat produkt Bosset (Keitech) najet už v 56,73 nebo zkrátit `tOut` AF o 3 snímky. Ostatní lze nechat.

### MINOR 3: Závěrečné „Uvidíme se u vody“ přijde na obraz ~5 s po VO
VO říká „Uvidíme se u vody“ v 119,46–120,5 s, na obraze je v tu chvíli logo stěna partnerů. Titul UVIDÍME SE U VODY se objeví až kolem 124,4 s (`midbars_5.jpg` m65–m68, `downbeats_all.jpg` b65–b68).
**Oprava:** buď na 119,4 krátký kinetický „Uvidíme se u vody“ nad stěnou (malý, pod TA), nebo nechat a brát end card jako opakování. Případně posunout VO věty o takt později (rezerva finále 15 s to dovolí).

### MINOR 4: Čitelnost loga TA ve dvou úsecích
- Troutshop, plně červený svět 85,8–88,4: červené AREA na červené drží jen tmavý obrys (`logo_every_bar.jpg`, 87,04).
- Konec intra 14,45–14,60 (zoom do bílé): bílé TROUT jde přes bílá písmena „PARTNEŘI“, čte se jen podle stínu (`logo_intro_zoom.jpg`).

**Oprava:** `ctx.plate.tone(85.8, 88.4, 'halo')` v troutshopu (už navrženo v V3_GLOBAL §3). V intru posunout „PARTNEŘI“ při zoomu o ~80 px níž nebo tónovat logo na `halo` v posledních 0,25 s taktu 7.

### MINOR 5: Typografické wordmarky sponzorů jsou širší než logo TA
TROUTSHOP.EU v lockupu 90,0–91,5 s (~950 px, stylizované jako jejich logotyp s červeným .EU) vs. TA v rohu ~281 px. Podobně VELKA-RYBA.CZ, activefishing.cz, ftfishing.cz, bosset.cz, gausseholler.com. Jsou to URL nápisy, ne logo assety, a pravidlo se tak doteď vykládalo. U TROUTSHOP.EU to ale vypadá jako logo větší než naše.
**Oprava:** potvrdit s operátorem. Případně u TROUTSHOP.EU zrušit červené „.EU“ / brandovou sazbu, nebo zmenšit na ≤ 700 px.

### MINOR 6: Schéma Malého Sporťáčku bez poznámky o orientačním rozmístění
35,0–38,5 s: 40 bodů podél břehů s titulem „40 závodních míst“. Čísla 1–20 / 21–40 ve filmu nejsou, takže rozhodnutí z 22. 10. formálně neporušuje. Body ale rozmístění naznačují.
**Oprava (volitelná):** pod pilulky „50 × 40 m · 0,2 ha · hloubka 1,5 m“ přidat drobné „rozmístění míst orientační“ (Montserrat 600, ≥ 24 px), jednotně s bannery.

### MINOR 7: Nejmenší texty jsou na telefonu nečitelné (výška verzálek ~14–20 px při 1080 px šířky)
„AI ILUSTRACE“ (venue), „KARBONOVÝCH TUBUSŮ / VNĚJŠÍ PRŮMĚR / DÉLKA“ (GH), popisky mřížky Jigovky („HD BARBLESS #4“), „CARDIFF EXLEAD COMPETITION · 1,83 M · 0,4–4,5 G“, „Floating · 34 mm · 2,6 g“, **„MADE BY ⚙ © 2026 GAUSSE HOLLER“** (~20 px) (`small_text_1.jpg`, `small_text_2.jpg`). Většina je dekorativní spec, chybou to není. Značka MADE BY je ale požadavek briefu.
**Oprava:** MADE BY zvětšit na ≥ 28 px verzálky, ostatní nechat.

### MINOR 8: Brollbreak, sticker výřez závodníka má u spodního okraje bílé útržky obrysu
78,93–79,4 s: tvary „=5\A“ pod vestou (`ff_brb_top.jpg`, `brb_cutout.jpg`).
**Oprava:** v masce odstranit malé ostrůvky (opening / min area) nebo spodní hranu výřezu oříznout letterboxem.

### MINOR 9: „PSTRUH.“ přes hlavu ryby na fotce
Brollbreak 81,3–82,4 s. Brief z 21. 10. (titulek ne přes tělo ryby) se týkal venue, tady jde o stejný princip.
**Oprava:** titul o ~120 px výš nebo foto posunout dolů.

---

## Seznam kontaktních archů (`_work/snap/review_v8/`)

- `seams_1.jpg`, `seams_2.jpg`, `seams_3.jpg`: všech 12 švů, každý −0,2 / −0,067 / +0,033 / +0,2 s.
- `downbeats_all.jpg`: všech 72 downbeatů (+40 ms).
- `midbars_0..5.jpg`: střed každého taktu, scale 0,3 (texty).
- `mid_blocks.jpg`: přehled bloků.
- `logo_every_bar.jpg`: výřez loga TA v každém taktu. `logo_intro_zoom.jpg`: logo při konci intra.
- `gh_ring_lockup.jpg`, `gh_ring_wall.jpg`, `gh_ring_madeby.jpg`: GH kolečko, 3 snímky po 0,5 s.
- `odo_fin_date_ff.jpg`, `sync_fin_date.jpg`, `odo_ts_1999.jpg`, `odo_af_1300.jpg`, `odo_venue_1934.jpg`: odometry.
- `ff_gh_af.jpg`, `ff_jig_broll.jpg`, `ff_brb_top.jpg`, `ff_brb_grey.jpg`, `ff_crs_fin.jpg`, `ff_vr_ghost.jpg`: snímek po snímku na švech a přechodech.
- `intro_open.jpg`, `intro_teaser.jpg`, `finale_montage.jpg`, `end_fade.jpg`, `sync_jig_04.jpg`, `sync_vr_shimano.jpg`, `small_text_1/2.jpg`, `brb_cutout.jpg`.

Metody: per-frame statistika (216×384, jas/σ/rozdíl) + detekce bílých/červených pixelů v oblasti loga (všech 4078 snímků). Ploché snímky σ < 12, záblesky Δjas > 35. Rotace GH = polární korelace modré masky. Zvuk: ebur128, LS fit mix ↔ track_B + VO stemy, Δ² HF okolo střihů.
