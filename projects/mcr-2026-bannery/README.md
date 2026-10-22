# mcr-2026-bannery — FB/IG bannery partnerů MČR 2026

Jeden příkaz = všechny formáty jednoho sponzora:

```bash
cd projects/mcr-2026-bannery
node scripts/build.mjs <key>                         # 5 statik + 4 karty karuselu + 3× MP4 + _sheet.jpg + _qa.json (~5–6 min, MP4 60 fps)
node scripts/build.mjs <key> --only=static,carousel  # rychlá iterace bez videa (~10 s)
node scripts/build.mjs <key> --fmt=9x16              # jen vybrané formáty (1x1, 4x5, 191, 9x16, 16x9)
node scripts/build.mjs <key> --fmt=16x9 --only=peek --peek=hero,mcr   # náhled libovolné scény → build/<key>/peek_<fmt>_<scene>.png
node scripts/build.mjs --list                        # stav všech klíčů
```

**16:9 (22. 10.)**: formát `16x9` = 1920×1080 — statika `<key>_static_16x9.png` + MP4 `<key>_anim_16x9.mp4` (10 s, 60 fps, bez zvuku).
Je to rodina `wide` (stejná landscape kompozice jako 1,91:1: text vlevo, produkt vpravo) na plátně 1200×675 CSS px renderovaná
s `deviceScaleFactor` 1,6 → každý wide poster se přizpůsobí bez nových souřadnic; MP4 16:9 hraje `anim.wide` (scény s wide layoutem).
Balíček všech 16:9: `dist/MCR2026_bannery_16x9.zip`.

Nový sponzor: `docs/ADD_SPONSOR.md` (paralelní agenti, každý jen svůj `scripts/sponsors/<key>.mjs`). Zadání: `BRIEF.md`.

## Engine (sdílený, sponzorští agenti ho nemění)
- `scripts/build.mjs` — CLI: načte modul sponzora, postaví 1 HTML stránku na formát (`build/<key>/<fmt>.html`), vyrenderuje,
  zkontroluje pravidla, udělá kontaktní arch.
- `scripts/engine/formats.mjs` — rozměry, safe zóny, velikost loga TA a chrome písma; výstupy, pořadí karuselu, default sekvence MP4.
- `scripts/engine/page.mjs` — **chrome** (logo TA bílo-červené se stínem dle tónu dark/scrim/halo, URL, řádek role, chip role,
  řádek akce s TA červenou linkou) + scény sponzora jako vrstvy `.scene`; pomocníci `E` (img / logo podle pravidla loga / typografie).
- `scripts/engine/runtime.js` — v prohlížeči: animace přes `data-*` atributy jako čistá funkce času (seek-safe), přizpůsobení
  textu (`data-fit`), QA pravidel na každém výstupu (logo TA vs `.sp-logo`, URL, chip, akce, přetečení textu, upscale).
- `scripts/engine/render.mjs` — statický server nad `projects/`, Playwright (`/opt/pw-browsers/chromium_headless_shell`),
  snímky → ffmpeg libx264 (High, yuv420p, CRF 18, 60 fps — operátor 22. 10., faststart, bez zvuku); meziprocesový zámek na video render.
- `scripts/engine/sheet.py` — `renders/<key>/_sheet.jpg`.
- `scripts/engine/fonts.mjs` — registr fontů (woff2 z `mcr-2026-sponzori/fonts/`), `data/event.json` — texty akce + chipy rolí.

Proč ne `hyperframes render`: potřebujeme 4 různé rozměry + statiky + QA DOM pravidel v jednom průchodu; vlastní Playwright
renderer to dělá přímo (stejný headless_shell jako HyperFrames; 10 s MP4 při 60 fps ≈ 60–70 s na 4 jádrech).

## Stav (22. 10.)
| key | výstupy | dist |
|---|---|---|
| venue, gausseholler, activefishing, bosset, jigovky, troutshop, velkaryba, ftfishing, crs | `renders/<key>/` — 5 statik (1:1, 4:5, 1,91:1, 9:16, 16:9), 4 karty karuselu, 3× MP4 (4:5, 1:1, 16:9; 60 fps), sheet, QA 0 chyb | `dist/MCR2026_banner_<key>.zip` |
| moonky | modul existuje, **nedodává se** (vyřazen z balíčků) | — |

Souhrnné balíčky: `dist/MCR2026_bannery_9x16.zip` (9 × statika 9:16), `dist/MCR2026_bannery_16x9.zip` (9 × statika + 9 × MP4 16:9).
