# Český rybářský svaz (ČRS): poděkování za dlouholetou podporu (nový blok `crs`, film v3)

> **Кратко (RU):** ČRS = крупнейший рыболовный союз Чехии (некоммерческий, z. s.), официальный сайт rybsvaz.cz (RIS-портал). Связь с MČR: **владелец площадки Líheň Liběchov = ČRS z. s., místní organizace Mělník** (страница Kontakt), с 2022 г. хозяйство эксплуатирует MO Mělník через Líheň Liběchov s.r.o. (Historie). ČRS стоит в партнёрской полосе логотипов на troutareacz.cz (логотип загружен в CMS 19. 8. 2024), на открытии MČR 2025 стол с кубками был под баннером ČRS (фото из нашей галереи). Логотип взят с rybsvaz.cz (SVG → PNG 1900 px, прозрачный) + варианты white/navy/mark + круглая эмблема с нашего сайта. Цвета: синий #2B5DA9, navy #182F5D.

Stav 21. 10. 2026 · zdroje staženy přes most (Zapier GET, Zapier→Drive upload → Drive download).

## 1. Ověřená fakta (citace + URL)

1. **Kdo jsou.** Celostátní spolek rybářů, nezisková organizace.
   Zdroj: https://www.rybsvaz.cz/cesky-rybarsky-svaz
   > „Český rybářský svaz (ČRS) je nezisková organizace s dlouholetou tradicí, která se věnuje rybářství, ochraně vodních živočichů a přírody.“
   > „Dnes patří Český rybářský svaz mezi největší zájmová sdružení v České republice a pokračuje ve své bohaté tradici ochrany a podpory rybářství a přírody.“
   Historie na téže stránce: 1957 vznikl Československý svaz rybářů; „V roce 1968 došlo k rozdělení Československého svazu rybářů na dva samostatné svazy: Český rybářský svaz a Slovenský rybársky zväz.“
   Patička webu: „Český rybářský svaz, z. s. · Nad Olšinami 282/31, 100 00 Praha 10 – Vinohrady · IČO: 00443191“.

2. **ČRS a místo konání MČR: vlastníkem areálu Líheň Liběchov je místní organizace ČRS Mělník.**
   Zdroj: https://www.lihenlibechov.cz/cs/kontakt (staženo 21. 10. 2026)
   > „vlastník: Český rybářský svaz, z. s., místní organizace Mělník · IČ: 185 84 187 · Nůšařská 2912, 276 01 Mělník“
   Zdroj: https://www.lihenlibechov.cz/cs/historie
   > „…od roku 2022 ji provozuje Český rybářský svaz, místní organizace Mělník pomocí firmy Líheň Liběchov s.r.o. Postupně probíhá rekonstrukce a modernizace.“
   (Provozovatel: Líheň Liběchov s.r.o., IČ 14332663, sídlo Nůšařská 2912, Mělník — stejná adresa jako MO Mělník.)

3. **ČRS a závodní rybolov.**
   Zdroj: https://www.rybsvaz.cz/sport-a-mezinarodni-cinnost
   > „Sportovní (závodní) lov ryb je nedílnou součástí činnosti ČRS.“ · „ČRS v průběhu roku pořádá řadu domácích a mezinárodních soutěží (od místních závodů až po mistrovství republiky a mistrovství světa) a připravuje a vysílá reprezentaci ČR na mezinárodní závody a šampionáty.“

4. **ČRS a Trout Area CZ (podpora, doložitelné stopy):**
   - Úvodní stránka https://www.troutareacz.cz/ má v pruhu partnerů logo ČRS s odkazem na `https://www.rybsvaz.cz/` (vedle Velká ryba, Activefishing, Gausse Holler, Jigovky, Moonky, Bosset, Líheň Liběchov…). Soubor loga v CMS: `https://admin.troutareacz.cz/media/1000023322.webp`, **createdAt 2024-08-19** (Payload API `api/media?where[filename][like]=1000023322`), tj. ČRS je na našem webu jako partner nejméně od srpna 2024.
   - Galerie troutareacz.cz, album „Mistrovství České republiky Trout Area 2025“ (vytvořeno 2. 11. 2025): fotka zahájení `assets/gallery_tacz/gtacz_mcr25_1000046063.webp` (zdroj https://admin.troutareacz.cz/media/1000046063.webp): stůl s poháry MČR 2025 je potažený bannerem **„ČESKÝ RYBÁŘSKÝ [SVAZ]“** s kulatým znakem ČRS (ověřeno pohledem).
   - „Dlouholetá podpora“ je formulace operátora (21. 10.). Web ČRS Trout Area nezmiňuje: na stránce Sport jsou vyjmenované disciplíny „rybolovná technika, plavaná, muška, přívlač, feeder“. **Netvrdit** proto „pod záštitou ČRS“, „MČR pořádá ČRS“ ani „oficiální disciplína ČRS“, dokud to operátor nepotvrdí.

## 2. Doporučené texty (CZ)

- VO (návrh, ~4 s): „Děkujeme Českému rybářskému svazu za dlouholetou podporu.“ Volitelně: „…a místní organizaci Mělník, která je vlastníkem Líhně Liběchov.“ (Fakt 2.) Pro TTS není potřeba fonetický přepis, zkratku „ČRS“ číst „čé er es“.
- Na obrazovce: kicker „Děkujeme“ · titul „Český rybářský svaz“ · podtitul „za dlouholetou podporu“ · chip „Vlastník areálu Líheň Liběchov · MO Mělník“ · URL „rybsvaz.cz“.
- Nepoužívat: „největší“ bez kontextu (web říká „mezi největší zájmová sdružení v ČR“, to lze citovat celé), počty členů (na webu chybí aktuální číslo; 78 767 je údaj z roku 1957).
- Chip „Věnuje ceny“ ČRS **nenese** (nevíme, že věnuje ceny; je to poděkování, ne sponzor cen). Kontrola sestavení `PRIZE CHIP` (build.mjs) musí blok `crs` vynechat stejně jako venue.

## 3. Logo a barvy (`assets_prep/crs/`)

| Soubor | Co | Rozměr |
|---|---|---|
| `src/crs_logoCRSLight_w1900_weserv.png` | oficiální logo z rybsvaz.cz (SVG `logoCRSLight.svg`, viewBox 158×47) vyrenderované images.weserv.nl na 1900 px, průhledné | 1900×565 |
| `logo_crs_color.png` | **hlavní**: horizontální logo (ryba + „ČESKÝ / RYBÁŘSKÝ / SVAZ“) v originálních barvách, ořez | 1825×565 |
| `logo_crs_white.png` | monochrom bílá pro tmavá pole (oko ryby = průhledná díra) | 1825×565 |
| `logo_crs_navy.png` | monochrom navy #182F5D pro světlá pole | 1825×565 |
| `mark_crs_color.png` / `mark_crs_white.png` | jen ryba (značka) | 1032×565 |
| `wordmark_crs_color.png` / `wordmark_crs_white.png` | jen nápis | 758×487 |
| `badge_crs_round.png` | kulatý znak ČRS (modrý kruh, šedý lem, ryba + prut, nápis „ČESKÝ RYBÁŘSKÝ SVAZ“), převzatý z partnerského pruhu troutareacz.cz (864×852 RGB na bílé → kruhová alfa) | 767×767 |
| `_logo_sheet.jpg` | náhled variant na bílé / světlé / navy / TA červené / černé | — |

- Zdroj SVG: `https://www.rybsvaz.cz/g/cms/api/rest/documents/by-uuid/b01c4638-0bcb-f7ab-b6d8-de1234fa39ab/content/logoCRSLight.svg` (z hlavičky rybsvaz.cz; jiná verze loga v hlavičce ani patičce není). Drive kopie SVG: `1xUqhXAiWfCZeByrYbtoowvALEWdHfoxB` (složka `_zdroje`).
- Barvy loga (výplně SVG): **modrá #2B5DA9** (ryba, „ČESKÝ“, „SVAZ“), **navy #182F5D** („RYBÁŘSKÝ“), bílá (oko). Portál RIS (`--gov-color-primary-*`): 600 #2B5DA9, 700 #0E428F, 800 #11356C, 900 #20254D, 500 #2196F3. Kulatý znak: modrá ≈ #2252A0, tyrkys ≈ #38B0C0, šedý lem ≈ #A8A8A8.
- Písmo: web používá Roboto (gov design system); nápis v logu je bezpatkový grotesk blízký Roboto Medium/Bold.
- Pravidlo loga TA platí i tady: logo ČRS v záběru nikdy větší než plaketa TA (ctx.logo, ×1 ≈ 281 px šířky).
- Doporučení pro blok: na tmavém/brand poli `logo_crs_white.png`; v end cardu na bílé kartě `logo_crs_color.png`; kulatý znak jako „pečeť“ poděkování (`badge_crs_round.png`, je to oficiální znak, který máme i na našem webu).

## 4. Volitelné (neověřeno / k potvrzení operátorem)
- Zda poděkování směřuje celému ČRS, nebo konkrétně MO Mělník (vlastník areálu) a/nebo Středočeskému územnímu svazu. Na webu nemáme podklad pro konkrétní formu podpory (finance, ceny, rozhodčí…), proto jen obecné „za dlouholetou podporu“.
- Logo MO Mělník (samostatné) nebylo hledáno: lihenlibechov.cz ho nemá.
