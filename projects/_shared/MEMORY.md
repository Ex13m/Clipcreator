# Общая память проектов Trout Area CZ / Gausse Holler

Каждый ролик — отдельный проект в `projects/<slug>/`. Этот файл — общая память для всех проектов: читать перед работой, дополнять после каждого проекта (раздел «Уроки» и «Индекс проектов»).

## Оператор и предпочтения
- Оператор: Igor Novák (Gausse Holler, gausseholler.com), один из организаторов Trout Area Czech Republic. Ответы в чат — по-русски, кратко, без преамбул и эмодзи; на развилках — варианты + плюсы/минусы + рекомендация, решает оператор.
- Тексты для публикаций (FB/Instagram, экранные надписи, VO) — по-чешски. Музыкальные промпты Suno — давать прямо в чат (не только в md).
- Перед рендером финала — показать кадры/превью на утверждение. Не ломать синхронизацию с битом при правках (урок Klonówiec v14).

## Бренд TA CZ (наш стиль)
- Палитра: navy `#304285`, глубокий фон `#0b1e42`, светлые карточки `#eef2f9`, красный `#e31e24`, светло-синий `#8ea2d8`.
- Шрифт: Montserrat 800/900 (заголовки), 600/700 (текст); Source Sans 3 как запасной. Файлы: `_shared/brand/fonts/`, `fonts.css`.
- Логотип TA CZ: горизонтальный на белой плашке (`_shared/brand/ta_logo_h.png`), полный `logo-TACR2-ready.png`. **Наш логотип должен быть виден всегда** (интро, каждый блок/баннер, финал); спонсоры его не перекрывают.
- Знак GH: «MADE BY ⚙ © 2026 Gausse Holler» (`_shared/brand/gh/` core.png, ring.png, word-line.png). В 16:9 — справа сверху, крупнее, без подложки, с тенью; надпись DRAFT не должна его перекрывать (финал рендерить с `FINAL=1`).
- Фактура: `_shared/brand/grain.png`. Стиль анимации: всё в бит — дрампады, эквалайзер, переходы-фейдеры микшера; «наш стиль, но круто, fashion».
- Музыка «в нашем стиле»: fashion/minimal techno, позитивно, без свиста, без лаунжа; короткие выкрики «Trout Area!». Генерирует оператор в Suno по нашему промпту.

## Люди и партнёры
- Организаторы TA CZ: Stanislav Lukášek (+420 734 459 948), Michal Horák (+420 603 504 400), Denis Zaikin (+420 724 818 443), Igor Novák (+420 603 500 959, igor.novak@troutareacz.cz).
- Сайт: troutareacz.cz (Next.js; страницы турниров содержат расписание, участников, спонсоров). FB-страница «Trout Area Czech Republic» id 625549374537871.
- Klonówiec (PL): хозяин David Helman, рыбник Kolorowe Pstrągi · Łowisko Klonówiec. Из текстов убрать «Saska».
- MČR 2026: Líheň Liběchov (Boží Voda 289, Liběchov; lihenlibechov.cz; пруд Malý Sporťáček), 24.–25. 10. 2026.
- Спонсоры 2026: Troutshop.eu, Activefishing.cz, Moonky (handmade soft lures, только FB), Jigovky.cz, Velka-ryba.cz, Gausse Holler (стойка Black Standard Edition), Bosset.cz (термосы 0,5–0,7 л в призы).

## Инструменты и пайплайн
- Видео: HyperFrames CLI 0.8.113 (`npx --prefix projects/hb-battle-2026 hyperframes lint|snapshot|render`), env `HYPERFRAMES_BROWSER_PATH=$(ls -d /opt/pw-browsers/chromium_headless_shell-1194/*/)headless_shell`. GSAP paused timeline `window.__timelines["main"]`, секции `class="clip"` + data-start/duration, `immediateRender:false` для повторных fromTo.
- Бит: `projects/hb-battle-2026/scripts/analyze_track.py <file>` → `<file>.beats.json` (beats, downbeats, bars). Сетку при необходимости продлить к t=0.
- Монтаж трека: ffmpeg atrim + acrossfade + afade; вставка повтора N тактов по сильной доле.
- FB-версии: ffmpeg two-pass H.264 < 30 MB, `-g 30`, aac 128k/48k. Проверка: сдвиг аудио кросс-корреляцией (норма 0 мс), вспышки vs downbeats (< 1 кадра).
- Озвучка CZ: HeyGen `create_speech`, голос **Paul – Broadcaster** voiceId `02733a92a0db457aadf63b235d2aa457`, engine `elevenlabs`, model `eleven_v3`, language `cs` (выбран оператором). Альтернатива — Adam (родной CZ) `32bb79c6f93241b7b956c219aa9bcf75`.
- Сеть: облачный контейнер не ходит в интернет напрямую (только pypi/npm). **Мост** (работает): страницы — Zapier Webhooks GET; файлы — Zapier Google Drive «Upload File» по URL (connection `024bd1e5-cb3e-8146-810d-11b1cf9971dc`) в папку-буфер → Drive MCP `download_file_content` (≤ ~10 MB; большие ответы сохраняются в tool-results JSON → base64 decode). Подробно: `_shared/BRIDGE.md`.
- Drive: `TROUT AREA NEW` = `1lWDBW4qpYEgJKlvo_R0WBZZwXZ97A57I`; `Klonówiec 2026` = `1V6i1ZXy5S4mLy4j4nsC8OImkvLYyOjw5`; `MČR 2026 – sponzoři` = `1yInPFfMshMuJeGwBydbBXQ-2Zg4wB_ps`; буфер `_zdroje` = `1VlabddjjydMD4Mpkg2Utd7K4-hYxb5JT`.
- Геоданные CZ: ČÚZK ORTOFOTO MapServer (до 0,125 м/px), DMP 1G (поверхность с деревьями/домами), DMR 5G (рельеф) — через мост, CRS EPSG:32633.
- Отправка готовых файлов оператору — SendUserFile (видео < 30 MB → FB-версия).

## Уроки
- Вырезка фона офлайн: npm `@imgly/background-removal-node@1.4.5` (веса ISNet внутри npm-пакета, сеть не нужна) — отлично для блёсен/воблеров/рендеров. Не годится для пастельных бутылок на белом (полупрозрачные) и тонких крючков (теряет проволоку) → классика: порог+fill-holes / luma-key. Скрипты: `mcr-2026-sponzori/scripts/assets_prep/`.
- Troutshop: водяной знак TROUTSHOP.EU в части фото лежит поверх блесны — такие кадры отбраковывать, в PNG брать собственную альфу магазина. Мелкие плоские логотипы (408 px) — векторизация vtracer по цветовым слоям (unmix) → рендер 2000 px.
- Klonówiec v14: удлинение подиума и лишние фото сдвинули сцены с бита → откат. Правки только без сдвига таймингов или с пересчётом сетки.
- Карточки в 16:9 уезжали за экран: `box-sizing:border-box; width:auto; right:0` только для 16:9.
- «Рассинхрон звука» оказался низким битрейтом превью — превью с `-g 30`.
- Контейнер: 4 ядра → воркфлоу выполняет ~2 агента одновременно; крупные задачи планировать с учётом этого.
- При рестарте контейнера фоновый рендер умирает — перезапускать.
- HyperFrames суб-композиции (MČR спонсоры): в `compositions/*.html` пути к ассетам от корня проекта (`assets/…`), не `../assets/` (lint `invalid_parent_traversal_in_asset_path`). CSS из root действует и на суб-композиции; то, что живёт поверх блоков (плашка TA, её перелёты), — только в ROOT timeline: суб-композиция не может анимировать элементы хоста.
- Маскированные титры (overflow:hidden) обрезали диакритику (Í, Č) и 2-ю строку во flex-колонке: `padding-top:.1em; margin-top:-.1em` + `flex-shrink:0` у детей.
- MČR ревью: подготовленные ассеты (`assets_prep/` — вырезки без водяных знаков, b-roll 1080×1920) надо реально подключить в `content.json`, иначе в кадр идут сырые фото магазинов (водяной знак, «glow»-панель, тиски, BACK/FRONT). Мелкие packshot'ы — `object-fit:scale-down` (не апскейлить).
- Швы 6 с лупов: всё, что дрейфует через весь блок (zoom фона, marquee), в лупе — туда-обратно (sine), вращение — кратно симметрии (шестерня GH = 60°), первый кадр лупа = чистый «постер» (без сдвига титра). В лупе без VO. Чешская типографика: NBSP после v/k/s/z/o/u/a/i и в «1 300», «6 hodin».

## Индекс проектов
| Папка | Что | Статус |
|---|---|---|
| `hb-battle-2026/` | H-BATTLE 2026 (Hofer Lake, SK), ролик + Reels | сдан (v18_final) |
| `klonowiec-2026/` | Klonówiec День 1 (2:56) и День 2 (2:20, сравнение дней, все результаты) | сдан, тексты FB день 1/2 |
| `mcr-2026-sponzori/` | Презентация спонсоров MČR 2026, 9:16, CZ VO, блоки = вертикальные баннеры | в работе |
| `mcr-2026-dron/` | 4 с пролёт дрона над Líheň Liběchov (реальные ортофото + лидар, Three.js офлайн) для ролика спонсоров | в работе |
