# clipchat-dump

Снимает полный визуальный и структурный слепок `clipchat.ai/create/clipboard` (или любой SPA-страницы за логином) в режиме «только чтение».

Выход — `./clipchat-dump/<state>/{dom.html, shot@1x.png, shot@2x.png, styles.json, meta.json}` + `README.md` (таблица состояний, mermaid-граф навигации, дубликаты, нативные селекты, сеть) + `index.json` + `network.log` + `_assets/fonts/`.

## Запуск (локально, на машине с твоим Chrome)

```bash
cd tools/clipchat-dump
npm install                     # только playwright; браузер не качается, используется установленный Chrome
# закрой Chrome (профиль копируется, живой профиль не трогается)
npm run dump                    # авто-обход + вопросы в терминале (логин, трек, ручные состояния)
```

Что происходит:

1. Профиль `Default` из стандартной папки Chrome копируется в `./.chrome-profile-copy` (кэши пропускаются). Chrome 136+ отказывается работать под автоматизацией на живой default-папке, поэтому копия обязательна. Куки расшифровываются тем же Chrome на той же машине, сессия сохраняется.
2. Открывается видимое окно Chrome (`headless=false`, 1440×900, dpr 2), переход на целевой URL. Если редирект на логин — скрипт ждёт Enter после ручного входа.
3. Снимается `empty`. Дальше авто-обход: все `[role=tab]`, `[role=combobox]`, `[aria-haspopup]`, `[aria-expanded]`, `summary`, Radix `data-state=closed`. Каждый клик → снимок, затем закрытие (Escape / повторный клик), проверка возврата к базовому состоянию, вложенность до `--max-depth` (по умолчанию 3).
4. Ветка `track-loaded`: скрипт спрашивает, загрузить ли трек вручную (или `--track file.mp3` для автозагрузки, или `--no-track`). После загрузки повторяет обход с префиксом `track-loaded__`.
5. `clipchat-dump.config.mjs` → `extraStates` (ручные сценарии), потом предложение добавить состояния в REPL: ты кликаешь в браузере, вводишь имя, скрипт снимает.
6. Скачиваются шрифты из `@font-face`, пишутся `README.md`, `index.json`, `network.log`.

## Безопасность сессии и «ничего не отправлять»

- Кнопки с текстом из deny-списка (generate, render, export, delete, save, upload, publish, logout, pay, …) никогда не кликаются. Переключатели (`role=switch/checkbox`) не трогаются. Тэбы — всегда безопасны.
- Все не-GET запросы логируются в `network.log` и в README. `--writes block` — жёсткий режим: любой POST/PUT/PATCH/DELETE обрывается на клиенте. Если SPA читает данные через POST (GraphQL), добавь `--allow-write "graphql"`.
- Загрузка трека по определению отправляет файл на сервер. Поэтому ветка `track-loaded` включается только явно (`--track`, `--pause-for-track` или ответ `y` в терминале).
- Диалоги закрываются, загрузки отменяются, навигация в сторону откатывается `goBack`.

## Ключи

```
--url <url>                 цель (default https://clipchat.ai/create/clipboard)
--out <dir>                 выход (default ./clipchat-dump)
--user-data-dir <dir>       папка профилей Chrome (default: стандартная для ОС)
--profile-directory <name>  профиль (default Default; см. chrome://version → Profile Path)
--copy-profile false        работать прямо на указанной папке (Chrome должен быть закрыт; для не-default папок)
--refresh-profile           пересобрать копию профиля
--cdp http://localhost:9222 подключиться к уже запущенному Chrome (см. ниже)
--channel chrome|chromium   chromium не расшифрует куки Chrome — только для тестов
--executable-path <bin>     явный бинарь браузера
--viewport 1440x900
--writes log|block          сеть: логировать или блокировать не-GET
--allow-write <regex>       исключения для block
--track <file> | --pause-for-track | --no-track
--manual                    только REPL, без авто-обхода
--max-depth 3  --settle 700  --deny-text <regex>  --hard-reset  --headless
```

## Режим CDP (если копия профиля не залогинена)

```bash
# macOS
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --remote-debugging-port=9222 --user-data-dir="$PWD/.chrome-profile-copy" --profile-directory=Default
# залогинься в этом окне, затем:
node dump.mjs --cdp http://localhost:9222
```

В CDP-режиме 2x-скрин делается через эмуляцию `deviceScaleFactor`, 1x — реальный.

## styles.json

- `fonts` — семейства с частотой и примерами текста; `loadedFonts` — `document.fonts`; `fontFaces` — `@font-face` (файлы в `_assets/fonts/`).
- `typography` — уникальные комбинации family/size/weight/line-height/letter-spacing с цветами и примерами.
- `colors` / `palette` — все computed-цвета (text/background/border/outline/caret) с hex; `iconColors` — fill/stroke SVG.
- `tokens` — CSS custom properties по селекторам/медиа; `tokensResolved` — значения на `:root`.
- `radii`, `shadows`, `gradients`, `borders`, `keyframes`, `stylesheets`.

## Если авто-обход что-то пропустил

1. Открой `clipchat-dump/README.md`, найди недостающее состояние.
2. Либо добавь его в `extraStates` в `clipchat-dump.config.mjs` (шаги `click/hover/press/wait`), либо сними через `--manual`.
3. Нативные `<select>` в раскрытом виде снять нельзя (рисует ОС) — их опции записаны в README.
