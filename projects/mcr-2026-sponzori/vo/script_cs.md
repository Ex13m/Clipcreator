# MČR 2026 Trout Area · partneři: VO + texty na obrazovku (CZ)

Verze v1 · 19. 10. 2026 · strojová podoba: `vo/script_cs.json` (stejný obsah).

- **Hlas:** Paul – Broadcaster, ElevenLabs v3 přes HeyGen (`02733a92a0db457aadf63b235d2aa457`, `eleven_v3`, `cs`). Tón: prezentační, sebejistý, vřelý, prémiový, ne prodejní.
- **Tempo:** 2,9 slova/s (testovací věta). Odhad = mluvená slova / 2,9. VO začíná 0,25 s po začátku bloku (`data/content.json` → `vo.offset`).
- **Mřížka:** 120 bpm, doba 0,5 s, takt 2 s, blok 4 takty = 8 s. Intro a finále 16 s. Zatím syntetická, po dodání tracku `audio/track.beats.json`.
- **Soubory VO:** `vo/<klíč>.wav` (intro, venue, troutshop, activefishing, moonky, jigovky, velkaryba, bosset, gausseholler, finale). Build je sám najde.
- **Tři řádky VO:** *VO* = psaný text (z něj se počítají limity) · *TTS* = co poslat do TTS (čísla slovy) · *Přepis* = záloha bez SSML, jen když TTS přečte značku špatně.
- **Počítání slov:** tokeny oddělené mezerou; pomlčky a „·“ se nepočítají; „1 300“ = 1 slovo.

## Pravidla
- **Logo TA CZ je vidět vždy:** pevná plaketa v rohu (safe zóna) v každém bloku i samostatném banneru, hero v intru a finále. Logo sponzora nikdy nepřekryje naše a v témže záběru není větší.
- **Bannery:** 8 s banner = blok s vlastní VO (konec ≤ 6,5 s, čistý nástup i odchod). 6 s loop = bez VO, jen hudba + stejné texty.
- **Nikdy neříkat / nepsat:**
  - Malý Sporťáček NENÍ „chyť a pusť“ (od 23. 6. 2026 „chyť a vem“) – libechov.md:110
  - „nejníže položené pstruhařství v Evropě“ jen s „donedávna“ – libechov.md:60
  - Rozlohu Velkého Sporťáku neuvádět jako 2,5 ha (web uvádí 2,4 i 2,5) – libechov.md:102
  - Troutshop: ne „vítězové v SK, CZ, PL i UA“; Velvet Arts/Nories nejsou jeho značky – troutshop.md Verification #3
  - Activefishing / Troutshop / Velka-ryba / Bosset: nevydávat cizí značky za vlastní
  - Moonky: ne „nejlepší“, ne „8 let“ ve VO (nedatováno) – moonky.md Verification #3
  - Jigovky: ne „největší výběr“, „vlastní výroba“, „+1300 druhů“ jako naše tvrzení
  - Bosset: nic o původu Zojirushi (bosset.md:75)

## Výslovnost (záložní přepis, bez SSML)
| Značka | Přepis | Pozn. |
|---|---|---|
| Troutshop | traut-šop | zadání |
| Activefishing | ektiv-fišing | zadání |
| Moonky | múnky | zadání |
| Gausse Holler | gaus holer | zadání |
| Trout Area | traut erija | jen když v3 čte „trout área“ |
| Trout Area Slovakia | traut erija slovakija |  |
| hard baits | hárd bejts |  |
| Black Standard Edition | blek standard edyšn |  |
| Bosset | boset |  |
| Jigovky / jigy | džigovky / džigy |  |
| Shimano | šimano |  |
| e-shop | í-šop |  |

## Přehled
| Blok | Délka | Slova / limit | Mluvená | Odhad | Konec VO |
|---|---|---|---|---|---|
| intro | 16 s | 22 / 30 | 25 | 8,6 s | 8,85 s |
| venue | 8 s | 15 / 24 | 18 | 6,2 s | 6,45 s |
| troutshop | 8 s | 15 / 18 | 18 | 6,2 s | 6,45 s |
| activefishing | 8 s | 13 / 18 | 15 | 5,2 s | 5,45 s |
| moonky | 8 s | 14 / 18 | 14 | 4,8 s | 5,05 s |
| jigovky | 8 s | 13 / 18 | 15 | 5,2 s | 5,45 s |
| velkaryba | 8 s | 16 / 18 | 16 | 5,5 s | 5,75 s |
| bosset | 8 s | 15 / 18 | 15 | 5,2 s | 5,45 s |
| gausseholler | 8 s | 16 / 18 | 16 | 5,5 s | 5,75 s |
| finale | 16 s | 21 / 26 | 21 | 7,2 s | 7,45 s |

B-roll vsuvky (broll1–4, po 2 s): jen hudba, bez VO a bez textu. TA plaketa zůstává.

## INTRO · 16 s

**VO** (22 slov, ~8,6 s): Mistrovství České republiky v Trout Area 2026. 24. a 25. října, Líheň Liběchov. Čtyřicet závodníků, hard baits. Seznamte se s partnery mistrovství.

**TTS:** Mistrovství České republiky v Trout Area dva tisíce dvacet šest. Čtyřiadvacátého a pětadvacátého října, Líheň Liběchov. Čtyřicet závodníků, hard baits. Seznamte se s partnery mistrovství.

**Přepis:** Mistrovství České republiky v Traut Erija dva tisíce dvacet šest. Čtyřiadvacátého a pětadvacátého října, Líheň Liběchov. Čtyřicet závodníků, hárd bejts. Seznamte se s partnery mistrovství.

**Na obrazovce:**
- Hero: TA CZ logo (hero, velké)
- Titulek: Mistrovství ČR / v Trout Area 2026
- Datum: 24.–25. 10. 2026
- Místo: Líheň Liběchov
- Statistika: 40 závodníků · hard baits
- One-liner: Partneři mistrovství

**Zdroje:**
- Mistrovství ČR v Trout Area 2026 · 24.–25. 10. 2026 · Líheň Liběchov → `BRIEF.md:15; research/mcr_tournament.md:4–5` · https://www.troutareacz.cz/tournaments/6aaaf5fd24c8e2804242764b ; https://www.lihenlibechov.cz/cs/aktualita/22-25-10-uzavren-maly-sportacek
- 40 závodníků (max 40, obsazeno 40/40), formát hard baits → `research/mcr_tournament.md:6` · https://www.troutareacz.cz/tournaments/6aaafdd124c8e28042428a49

**Poznámky:**
- VO může začít později (např. po 2taktovém nástupu, t = 4,0 s); i tak skončí před 16 s.

## MÍSTO KONÁNÍ · Líheň Liběchov · 8 s (alt. 10 s)

**VO** (15 slov, ~6,2 s): Hostí nás Líheň Liběchov – pstruží líheň od roku 1934, donedávna nejníže položené pstruhařství v Evropě.

**TTS:** Hostí nás Líheň Liběchov – pstruží líheň od roku devatenáct set třicet čtyři, donedávna nejníže položené pstruhařství v Evropě.

**Přepis:** Hostí nás Líheň Liběchov – pstruží líheň od roku devatenáct set třicet čtyři, donedávna nejníže položené pstruhařství v Evropě.

**Alternativa venue_10s (5 taktů = 10 s)** (19 slov, ~7,6 s): Hostí nás Líheň Liběchov u pramene Boží Voda. Pstruží líheň od roku 1934, donedávna nejníže položené pstruhařství v Evropě.

TTS: Hostí nás Líheň Liběchov u pramene Boží Voda. Pstruží líheň od roku devatenáct set třicet čtyři, donedávna nejníže položené pstruhařství v Evropě.

**Na obrazovce:**
- Nadtitulek: Místo konání
- Název: Líheň Liběchov
- One-liner: Pstruží líheň od roku 1934
- Mikro fakta: (1) Malý Sporťáček · 24.–25. 10. (2) Pramen Boží Voda
- Volitelně: (1) 164 m n. m. + popisek „donedávna nejníže v Evropě“ (jen spolu, nikdy bez „donedávna“) (2) 90+ let tradice
- URL: lihenlibechov.cz

**Zdroje:**
- Dějiště MČR, rybník Malý Sporťáček, 24.–25. 10. 2026 → `research/libechov.md:26–28, Verification #1 (ř. 98)` · https://www.lihenlibechov.cz/cs/aktualita/22-25-10-uzavren-maly-sportacek
- Pstruží líheň od roku 1934, 90+ let tradice (2026 = 92 let) → `research/libechov.md:30–32, Verification #2 (ř. 99), opravený one-liner ř. 105` · https://www.lihenlibechov.cz/cs/historie
- Donedávna nejníže položené pstruhařství v Evropě, 164 m n. m. → `research/libechov.md:34–36, ř. 60 („donedávna“ musí zůstat)` · https://www.lihenlibechov.cz/cs/o-nas
- Pramen Boží Voda → `research/libechov.md:38–40, Verification #4 (ř. 101)` · https://www.lihenlibechov.cz/cs/o-nas

**Poznámky:**
- Základ je pro 8 s blok (content.json: bars 4). Build ořízne VO na konci bloku, takže delší verzi použít jen při bars 5 (10 s).
- NEŘÍKAT „chyť a pusť“ u Malého Sporťáčku (od 23. 6. 2026 „chyť a vem“, libechov.md:110). Neuvádět 2,5 ha.

## Troutshop.eu · 8 s

**VO** (15 slov, ~6,2 s): Troutshop – specialista na pstruhy. Rodinná firma od roku 1999 a generální partner Trout Area Slovakia.

**TTS:** Troutshop – specialista na pstruhy. Rodinná firma od roku devatenáct set devadesát devět a generální partner Trout Area Slovakia.

**Přepis:** Traut-šop – specialista na pstruhy. Rodinná firma od roku devatenáct set devadesát devět a generální partner Traut Erija Slovakija.

**Na obrazovce:**
- Název: Troutshop.eu
- One-liner: Milujeme lov pstruhů
- Mikro fakta: (1) Rodinná firma od 1999 (2) Generální partner TA Slovakia
- URL: troutshop.eu

**Zdroje:**
- „Specialista na pstruhy“ ← „The trout fishing SPECIALIST!“; „Milujeme lov pstruhů“ ← SK hero „Milujeme lov pstruhov“ → `research/troutshop.md:11–12, Verification ř. 95` · https://troutshop.eu/ ; https://troutshop.eu/sk/
- Rodinná firma, v oboru od roku 1999 → `research/troutshop.md:18, Verification #1 (ř. 89)` · https://troutshop.eu/en/about-us/
- Generální partner Trout Area Slovakia → `research/troutshop.md:20, Verification #2 (ř. 90)` · https://troutshop.eu/pc/spoons/velvet-arts-2/

**Poznámky:**
- Nepoužívat „vítězové v SK, CZ, PL i UA“ (Verification #3 ZAMÍTNUTO). Velvet Arts/Nories nejsou vlastní značky Troutshopu.

## Activefishing.cz · 8 s

**VO** (13 slov, ~5,2 s): Activefishing – e-shop zrozený z vášně pro přívlač. Přes 1 300 plandavek a osobní přístup.

**TTS:** Activefishing – e-shop zrozený z vášně pro přívlač. Přes tisíc tři sta plandavek a osobní přístup.

**Přepis:** Ektiv-fišing – í-šop zrozený z vášně pro přívlač. Přes tisíc tři sta plandavek a osobní přístup.

**Na obrazovce:**
- Název: Activefishing.cz
- One-liner: Pro všechny, kdo milují přívlač
- Mikro fakta: (1) 1 300+ plandavek (2) 777 woblerů
- URL: activefishing.cz

**Zdroje:**
- E-shop vznikl z vášně zakladatele pro přívlač („vášeň“ = přijatelné zesílení „záliby“) → `research/activefishing.md:27, Verification #2 (ř. 77)` · https://www.activefishing.cz/o-nas/
- Pro všechny, kdo milují přívlač (převyprávěno ve 3. osobě) → `research/activefishing.md:23, Verification #1 (ř. 76)` · https://www.activefishing.cz/
- Přes 1 300 plandavek (1340 položek k 19. 10. 2026) → `research/activefishing.md:31, Verification #3 (ř. 78)` · https://www.activefishing.cz/plandavky/
- 777 woblerů (k 19. 10. 2026) → `research/activefishing.md:35, Verification #4 (ř. 79)` · https://www.activefishing.cz/woblery/
- Osobní přístup (benefit na homepage) → `research/activefishing.md:8, Verification ř. 85` · https://www.activefishing.cz/

**Poznámky:**
- Počty 1 300+ / 777 jsou živá čísla k 19. 10. 2026; před finálním renderem ověřit.
- Neříkat „vlastní značka“ ani „jen japonské nástrahy“.

## Moonky · 8 s

**VO** (14 slov, ~4,8 s): Moonky – ručně dělané gumové nástrahy pro Trout Area. Vyvíjené a testované s českou reprezentací.

**TTS:** Moonky – ručně dělané gumové nástrahy pro Trout Area. Vyvíjené a testované s českou reprezentací.

**Přepis:** Múnky – ručně dělané gumové nástrahy pro Traut Erija. Vyvíjené a testované s českou reprezentací.

**Na obrazovce:**
- Název: Moonky
- One-liner: Ručně dělané gumové nástrahy
- Mikro fakta: (1) Vlastní CNC formy (2) Vývoj s reprezentací ČR
- URL: moonky.cz
- Alt. one-liner: Nástrahy, které pstruzi milují (jen z banneru na fotce u03 od uživatele, na webu není)

**Zdroje:**
- Gumové nástrahy pro lov Trout Area → `research/moonky.md:15, 26–27, Verification #1 (ř. 90)` · https://www.moonky.cz/
- Ručně dělané (HANDMADE LURES) → `research/moonky.md:17, Verification #5 (ř. 94)` · https://www.moonky.cz/ (banner) + u02
- Vývoj a testování s českou reprezentací (v lovu pstruhů ze břehu) → `research/moonky.md:23, 31, Verification #3 (ř. 92)` · https://www.moonky.cz/o-nas/
- Vlastní formy na CNC strojích → `research/moonky.md:21, 29, Verification #2 (ř. 91)` · https://www.moonky.cz/o-nas/

**Poznámky:**
- „8 let“ záměrně vynecháno: stránka není datovaná, číslo může být zastaralé (Verification #3).
- Neříkat „nejlepší nástrahy“ (superlativ = marketing).

## Jigovky.cz · 8 s

**VO** (13 slov, ~5,2 s): Jigovky – jigy, které chytají. Bezprotihrotové hlavičky od 0,4 gramu, poctivě vyrobené v Česku.

**TTS:** Jigovky – jigy, které chytají. Bezprotihrotové hlavičky od nula celá čtyři gramu, poctivě vyrobené v Česku.

**Přepis:** Džigovky – džigy, které chytají. Bezprotihrotové hlavičky od nula celá čtyři gramu, poctivě vyrobené v Česku.

**Na obrazovce:**
- Název: Jigovky.cz
- One-liner: Jigy, které chytají!
- Mikro fakta: (1) Barbless 0,4–3 g (2) Poctivě vyrobeno v ČR
- URL: jigovky.cz

**Zdroje:**
- „Jigy, které chytají!“ (slogan v logu) → `research/jigovky.md:10` · https://www.jigovky.cz/ (logo)
- Bezprotihrotové TroutJigy 0,4–3 g → `research/jigovky.md:23` · https://www.jigovky.cz/jig-trout/
- Poctivě vyrobeno v ČR (USP ikona v HTML homepage) → `research/jigovky.md:21, 67` · https://www.jigovky.cz/

**Poznámky:**
- „Největší výběr“, „vlastní výroba“, „+1300 druhů“ nepoužito (vlastní superlativ / jen text v obrázku banneru).
- jigovky.md zatím nemá sekci Verification.

## Velka-ryba.cz · 8 s

**VO** (16 slov, ~5,5 s): Velká ryba – vše na přívlač. Speciálka z Olomouce, kde si pruty Shimano vyzkoušíte přímo u vody.

**TTS:** Velká ryba – vše na přívlač. Speciálka z Olomouce, kde si pruty Shimano vyzkoušíte přímo u vody.

**Přepis:** Velká ryba – vše na přívlač. Speciálka z Olomouce, kde si pruty Šimano vyzkoušíte přímo u vody.

**Na obrazovce:**
- Název: Velka-ryba.cz
- One-liner: Vše na přívlač
- Mikro fakta: (1) Olomouc · od 2011 (2) Shimano Rod Test Center
- URL: velka-ryba.cz

**Zdroje:**
- „Vše na přívlač“ (title/H1), „přívlačová speciálka“ (logo) → `research/velkaryba.md:6` · https://www.velka-ryba.cz/
- Olomouc, e-shop i prodejna → `research/velkaryba.md:26` · https://www.velka-ryba.cz/
- Od roku 2011 → `research/velkaryba.md:29` · https://www.velka-ryba.cz/cs/content/48-o-nas
- Shimano Rod Test Center: pruty si půjčíte a vyzkoušíte u vody (od 2025) → `research/velkaryba.md:35` · https://www.velka-ryba.cz/cs/content/48-o-nas

**Poznámky:**
- „Nejdéle provozovaná speciálka“ nepoužito (platí jen s celou výhradou o e-shopu i prodejně).
- velkaryba.md zatím nemá sekci Verification.

## Bosset.cz · ceny pro vítěze · 8 s

**VO** (15 slov, ~5,2 s): Ceny pro vítěze věnuje Bosset – termosky, které udrží nápoj horký i studený až šest hodin.

**TTS:** Ceny pro vítěze věnuje Bosset – termosky, které udrží nápoj horký i studený až šest hodin.

**Přepis:** Ceny pro vítěze věnuje Boset – termosky, které udrží nápoj horký i studený až šest hodin.

**Na obrazovce:**
- Název: Bosset.cz
- One-liner: Ceny pro vítěze
- Mikro fakta: (1) Termosky 0,5–0,7 l (2) Horké až 6 hodin
- URL: bosset.cz

**Zdroje:**
- Termosky Bosset 0,5–0,7 l jako ceny (rozhodnutí uživatele) → `BRIEF.md:11` · —
- Horké i studené až 6 hodin (vakuová izolace) → `research/bosset.md:33, 42, 53–54` · https://www.bosset.cz/termosky/termoska-zojirushi-sm-sr-0-6l-green/
- Rozsah 0,5–0,7 l: skladem 0,52 l a 0,6 l → `research/bosset.md:13` · https://www.bosset.cz/termosky/

**Poznámky:**
- „až 6 hodin“ platí pro modely 0,6 l (SM-SR/VB/SHE/SF) i pro 0,52 l SW-KA (jídlo, 6 h). Předpoklad: ceny jsou z řady termosek na bosset.cz.
- Neříkat nic o původu Zojirushi (bosset.md:75). bosset.md zatím nemá sekci Verification.

## Gausse Holler · 8 s

**VO** (16 slov, ~5,5 s): Gausse Holler – stojan na pruty Black Standard Edition. Ručně stavěný v Česku: karbon, hliník, limitovaná série.

**TTS:** Gausse Holler – stojan na pruty Black Standard Edition. Ručně stavěný v Česku: karbon, hliník, limitovaná série.

**Přepis:** Gaus Holer – stojan na pruty Blek Standard Edyšn. Ručně stavěný v Česku: karbon, hliník, limitovaná série.

**Na obrazovce:**
- Název: Gausse Holler
- One-liner: Stojan na pruty Black Standard Edition
- Mikro fakta: (1) Ručně stavěno v Česku (2) Série 5 kusů · číslováno
- URL: gausseholler.com
- Volitelně: (1) Revolut 8 (malý popisek u produktu) (2) 8 karbonových tubusů
- Autorská značka: MADE BY ⚙ © 2026 Gausse Holler

**Zdroje:**
- Stojan Black Standard Edition = Revolut 8 Standard Edition, varianta Black → `BRIEF.md:12; research/gausseholler.md:80` · https://gausseholler.com/products/rod-stand-v2
- Ručně stavěné v Česku; karbon, hliník, limitovaná série → `research/gausseholler.md:11–13, 21–23` · https://gausseholler.com/
- Série pěti kusů, každý číslovaný → `research/gausseholler.md:29` · https://gausseholler.com/products/rod-stand-v2
- 8 karbonových tubusů na radiálních hliníkových ramenech → `research/gausseholler.md:13, 27` · https://gausseholler.com/
- Autorská značka „MADE BY ⚙ © 2026 Gausse Holler“ → `BRIEF.md:12; research/gausseholler.md:17` · —

**Poznámky:**
- gausseholler.md zatím nemá sekci Verification.

## FINÁLE · 16 s

**VO** (21 slov, ~7,2 s): Děkujeme všem partnerům za podporu. Mistrovství České republiky v Trout Area – 24. a 25. října, Líheň Liběchov. Uvidíme se u vody.

**TTS:** Děkujeme všem partnerům za podporu. Mistrovství České republiky v Trout Area – čtyřiadvacátého a pětadvacátého října, Líheň Liběchov. Uvidíme se u vody.

**Přepis:** Děkujeme všem partnerům za podporu. Mistrovství České republiky v Traut Erija – čtyřiadvacátého a pětadvacátého října, Líheň Liběchov. Uvidíme se u vody.

**Na obrazovce:**
- Poděkování: Děkujeme / partnerům
- Logo wall: Líheň Liběchov · Troutshop.eu · Activefishing.cz · Moonky · Jigovky.cz · Velka-ryba.cz · Bosset.cz · Gausse Holler (žádné větší než TA)
- Hero: TA CZ logo (velké)
- Akce: Mistrovství ČR v Trout Area 2026 · 24.–25. 10. 2026 · Líheň Liběchov
- Závěr: Uvidíme se u vody
- Autorská značka: MADE BY ⚙ © 2026 Gausse Holler

**Zdroje:**
- Název, datum a místo MČR → `BRIEF.md:15; research/mcr_tournament.md:4–5` · https://www.troutareacz.cz/tournaments/6aaaf5fd24c8e2804242764b
- Diváci mohou přijít 24.–25. 10. (opora pro „Uvidíme se u vody“) → `research/libechov.md:7, 28` · https://www.lihenlibechov.cz/cs/aktualita/22-25-10-uzavren-maly-sportacek
- Značka MADE BY ⚙ © 2026 Gausse Holler → `BRIEF.md:12` · —

**Poznámky:**
- VO lze rozdělit na 2 soubory: A „Děkujeme všem partnerům za podporu.“ (≈ 1,7 s) a B zbytek. Mezera mezi nimi pro výkřik „Trout Area!“ z hudby.

## Otevřené body
- Velka-ryba, Jigovky, Bosset a Gausse Holler zatím nemají v `research/*.md` sekci Verification. Texty stojí jen na citacích ze zdrojů. Po doplnění Verification projít znovu.
- Místo konání: `content.json` má `bars: 4` (8 s) a build ořízne VO na konci bloku. Delší VO (10 s) jen s `bars: 5`.
- Počty Activefishing (1 300+ / 777) platí k 19. 10. 2026.
- Moonky: claim „Nástrahy, které pstruzi milují“ je jen z fotky od uživatele (u03). Na webu není, proto je jen alternativa.
- Gausse Holler: „Black Standard Edition“ je podle briefu. Na webu jde o „Revolut 8 · Standard Edition · Black“.
