# mcr-2026-web-karusel — karusel partnerů MČR 2026 pro web (9:16)

Zadání a rozhodnutí: `BRIEF.md`. Moonky je z karuselu vyřazen (operátor 22. 10.).

## Výstupy (`dist/`)
| soubor | co |
|---|---|
| `karusel_mcr2026.html` | **jediný samostatný soubor** (~3,7 MB): CSS/JS inline, Montserrat (podmnožina, base64), 8× H.264 MP4 540×960 + plakáty + statiky jako base64. Žádné externí požadavky. |
| `karusel_mcr2026_9x16.mp4` | stejný karusel jako němá smyčka 40 s, 1080×1920, 30 fps, H.264 (pro CMS, které bere jen video) |
| `karusel_preview.gif` | malý náhled (pokud je) |

Pozn.: `static/` a `dist/karusel_mcr2026_9x16*.gif`, `*_60fps.mp4` vyrábí jiný (paralelní) agent – tento README je nepopisuje.

## Vložení na web
Nahrát `karusel_mcr2026.html` do CMS jako soubor (média / dokumenty) a vložit iframe:

```html
<div style="max-width:420px;margin:0 auto">
  <div style="position:relative;width:100%;aspect-ratio:9/16">
    <iframe src="/cesta/karusel_mcr2026.html" title="Partneři MČR 2026" loading="lazy"
            style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe>
  </div>
</div>
```
Karusel si v jakémkoli rámu drží 9:16 (vejde se celý, `width:min(100vw, 100vh·9/16)`). Nepoužívat `sandbox` bez `allow-scripts allow-popups`
(jinak nepůjde JS / odkazy do nového okna).

## Pipeline
```bash
cd projects/mcr-2026-web-karusel
scripts/cut_clips.sh            # Reels v8 → _work/clips: <key>.mp4 (540, CRF 26), .webm (QA), _1080.webm (záznam), .jpg plakát; okna v scripts/clips.txt
python3 scripts/prep_assets.py  # logo TA (ořez), loga partnerů, pozadí úvodu (poháry TA CZ), ČRS statika (vyčištěná), fonty-subset
python3 scripts/build.py        # → dist/karusel_mcr2026.html   (vp9 → _work/karusel_test_vp9.html, capture → _work/karusel_capture.html)
node scripts/qa.cjs vp9|dist    # Playwright: 360×640, 540×960, iframe 1280×800, reduced-motion → _work/qa/*.png + report_*.json
node scripts/qa_logo.cjs        # snímek každé stránky (zarovnání loga TA)
node scripts/record_mp4.cjs     # deterministický záznam přes window.__kz.at(t) → dist/karusel_mcr2026_9x16.mp4
```
- Šablona: `src/karusel.html` (placeholdery `/*__FONTS__*/`, `/*__CFG__*/`, `<!--__DATA__-->`, `__TA__`). Pořadí/texty partnerů: `scripts/build.py`.
- Playwright Chromium nemá H.264 → QA přehrávání videa běží na VP9 variantě se stejným kódem; `dist` varianta v QA ukazuje plakáty (fallback).
- Video se v HTML ukládá jako base64 v `<script type="application/octet-stream">` a převádí se líně na Blob URL (jen aktivní + následující snímek).
