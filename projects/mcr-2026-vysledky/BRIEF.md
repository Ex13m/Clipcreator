# MČR 2026 – výsledky / analytika (video)
Zadání (operátor 26. 10. 2026): dynamický analytický ролик z výsledků Mistrovství ČR v Trout Area 2026 (24.–25. 10. 2026, Líheň Liběchov, rybník Malý Sporťáček), styl jako Klonówiec D1/D2 (`klonowiec-2026/`), pár fotek z MČR, nenápadné vložky partnerů, hudba (Suno, prompt v `03_MUSIC/suno_prompt.md`).
Vstupy (čeká se): výsledková listina (xlsx export z webu jako `klonowiec-2026/01_RAW/docs/ratings_d*.xlsx`, ideálně den 1 + den 2 + finále/celkové), fotky → `01_RAW/photos/`.
Partneři (nenápadně): Líheň Liběchov (místo), Gausse Holler (hlavní cena Revolut 8 – u vítěze), Bosset (termosky Zojirushi – u stupňů vítězů), Activefishing, Jigovky, Troutshop, Velká ryba, FT Fishing (pás log / „Ceny věnovali“), ČRS (poděkování, „provozuje ČRS, MO Mělník“). Bez Moonky.
Formáty: 9:16 + 16:9, 60 fps (jako vše MČR 2026).

## Data (26. 10., `data/results.json` z `scripts/parse.py`)
- Den 1 (24. 10., slunečno): 39 závodníků (40. los volný „Mirek Dušín“ vyřazen), 12 kol, 1 341 ryb (kola 292→48). 1. Lumír Kadlčík 32 b / 65 ryb, 2. Denis Zaikin, 3. Petr Hrabalík. Nejvíc ryb Kadlčík 65.
- Den 2 (25. 10., déšť): 767 ryb (−43 %). 1. Kadlčík, 2. Kulaev, 3. Zaikin. Nejvíc ryb Miroslav Kučera 37.
- MČR (průměr umístění z 2 dnů): 1. Kadlčík 1,00 · 2. Zaikin 2,50 · 3. Kulaev 4,00 · 4. Hrabalík 5,00.
- Mistr ČR 2026 = sezóna 8 bodovaných závodů (Klonowiec jaro D1/D2, Liběchov jaro D1/D2, Klonowiec podzim D1/D2, MČR D1/D2), počítá se 6 nejlepších z 8: 1. Denis Zaikin 3,00 (2. rok po sobě – dle operátora), 2. Dominik Švub 4,33, 3. Alexandr Kulaev 4,67. Pozor: v exportu best6 jsou škrtnuté výsledky přepsané nesmyslnými čísly (54, 58, 72…) → skutečná umístění brát z `season_all`.

## Storyboard v1 (čeká na hudbu a fotky)
1. Intro: Mistrovství České republiky 2026 → Líheň Liběchov (schéma Malého Sporťáčku) → Dva dny fair play (39 závodníků · 2 dny · 24 kol · hard).
2. Den 1: živé počítadlo ryb po kolech, sloupce ryby/kolo, bump chart pohybu finální top 10 v pořadí po kolech, top 3 dne.
3. Den 2: totéž + déšť, srovnání s dnem 1, kdo vypadl/naskočil do top 10.
4. Výsledek MČR: pravidlo průměru umístění, stupně vítězů + statistiky top 3; mapa stanovišť, kde vyhráli.
5. Mistr ČR 2026: 8 závodů, top 10 ze všech 8 → pravidlo 6 z 8 → škrtnutí 2 nejhorších, přeskupení → finální top 10 → top 3 → Denis Zaikin podruhé mistrem; foto vítězů.
6. Partneři: pár sekund motion grafiky bez textu.
Nenápadně: Revolut 8 (Gausse Holler) u vítěze MČR, termosky Bosset u stupňů, Líheň Liběchov u místa, logo strip v rohu.
