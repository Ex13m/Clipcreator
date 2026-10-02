# Продолжение на локальном компе

Облако не пускает к Google Photos и Facebook, поэтому шаг 1 делается локально.

## Что уже есть
- Каркас проекта и скрипт шага 1 (`scripts/01_fetch_album.mjs`), ветка `ccr-3d27d21c-gby4bd`.
- Оригинал логотипа H-BATTLE: `_brand/H-BATTLE.png` (Drive: Trout area grafics / sponzorza and partneres), 1200×1200, RGB, белый фон за кругом.
- Логотипы TA: Drive-папка `13qN3IBPAYkg_3CcGU06ec-kIjN4e78hR` (`logo-TACR2-ready.png` и др.).
- Пропозиции/правила HB CUP 2026 (PDF) в Drive — сверка чешского текста и канона жеребьёвки.

## Шаг 1 локально
```powershell
git fetch origin ccr-3d27d21c-gby4bd; git checkout ccr-3d27d21c-gby4bd
cd projects\hb-battle-2026
npm install
npm run fetch          # альбом -> 01_RAW + 01_RAW\_manifest.json
```
Если альбом требует входа, проще: Google Photos → ⋮ → «Скачать все», распаковать в `01_RAW`.

## Дополнительные видео с компа
Скопировать как есть (имена не менять) в `01_RAW\` — можно подпапкой `01_RAW\local\`.
Шаг 2 (контакт-лист + CSV) берёт всё, что лежит в `01_RAW` рекурсивно.

## Трек
Suno-трек → `03_MUSIC\` (wav предпочтительно).

## Дальше
Шаги 2–5 по README; после каждого — стоп и показ.
