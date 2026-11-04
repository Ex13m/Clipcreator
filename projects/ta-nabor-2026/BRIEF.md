# Trout Area CZ — náborové motivační video (2026-11-04)

Zadání operátora: „на основе всех данных, статьи сделай мотивационное видео под эту статью, дополни нюансами; моушн-графикой со ссылкой на сайт; фото из наших альбомов — экшн; нужно привлечь новых. Самое важное — открытая система, каждый может зарегистрироваться. Система автоматизирована. Название системы не упоминай. Правила есть на сайте по ссылкам.“

## Zdroje
- Článek pro časopis: `01_RAW/clanek.pdf` (Trout Area – moderní přívlač…).
- Prezentace webu (interní, název systému se v obraze NEUVÁDÍ): obrázky vytažené do `01_RAW/atlas/` (gitignore). Použité jen neutrální mockupy: `a036` (laptop, úvod webu), `a050` (telefon v ruce). Nepoužívat: screeny s testovacími jmény (a032), cyrilicí (a010, a028, a030, a044), platební bránou s osobními údaji (a034), logo systému.
- Fotky: Drive `2026 MSCR/foto/Уменьшенные с логотипами — 2048 px` (61 ks) → `01_RAW/album/` (gitignore) → oříznutý spodní pruh partnerů (krajina y < 1528, portrét y < 1754) → `proto/assets/photos/p<N>.jpg`.
- Hudba: placeholder = výřez MČR tracku (`track_edit2.wav` takty 2–34, fade) → `proto/assets/track.wav`, mřížka `03_MUSIC/track.beats.json` (33 taktů, 63,8 s). Vlastní track: `03_MUSIC/suno_prompt.md`.

## Struktura (takty, ~1,95 s)
| takty | scéna | obsah (CZ na obrazovce) |
|---|---|---|
| 0–4 | hook | rychlé střihy akce na dobu → „Rybaření, jak ho neznáš.“ |
| 4–9 | co to je | „Moderní přívlač“ (Japonsko, lososovité ryby) → duel A vs B, hodiny 20:00, ryby 3:2, „výhra = 3 body…“, 12 kol × 20 min |
| 9–13 | pro každého | muži · ženy · junioři · zkušení → „Nerozhoduje síla. Rozhoduje cit, taktika a přesnost.“ |
| 13–16 | chyť a pusť | umělé nástrahy · háčky bez protihrotu · hned zpět do vody |
| 16–20 | MČR 2026 | 40 závodníků · 24 kol · 2 108 ryb · 17 let nejmladší |
| 20–27 | otevřený systém | „Přihlásit se může každý.“ (laptop + telefon) → „Vše automaticky: od přihlášky po výsledky“ 4 kroky (účet, přihláška+platba online, losování, výsledky živě) |
| 27–30 | jak začít | prut · naviják · pár nástrah · podběrák; „Přijď na závod. Zkušení rádi poradí.“ |
| 30–33 | CTA | logo TA · „Přijď si to vyzkoušet.“ · „Pravidla · termíny · registrace — troutareacz.cz“ |

## Rozhodnutí
- Bez VO (texty na obrazovce, čeština); 16:9 + 9:16.
- Popisky „muži/ženy/junioři“ nejsou přiřazeny ke konkrétním lidem na fotkách.
- Fotky jsou obecně „akce“, jména závodníků se v tomto videu neuvádějí (kromě čísel z článku).
