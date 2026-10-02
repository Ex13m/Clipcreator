# H-BATTLE 2026 — začátek

Video-prezentace pro Trout Area Czech Republic (Slovensko, 1.–2. 10. 2026).
Koncepce: «Nepřijeli jsme bojovat, přijeli jsme za přáteli». 9:16 + 16:9, ~60 s, pod trek Suno.

## Struktura (zrcadlí `G:\Мой диск\TROUT AREA NEW\competition\HB battle 2026\`)
- `01_RAW/` — originály alba (fotky `=d`, videa `=dv`), jména a EXIF beze změn. V gitu jen manifest.
- `02_SELECT/` — výběr + CSV.
- `03_MUSIC/` — trek Suno + beat-grid.
- `04_RELEASE/vN/` — výstupy; verze se nepřepisují, nová iterace = nová složka.
- `scripts/` — pipeline po krocích.

## Brand
Barvy `#304285` / `#e31e24` / `#0b1e42` / `#eef2f9`; fonty Montserrat + Source Sans 3.
Loga TA jen originály (Drive `13qN3IBPAYkg_3CcGU06ec-kIjN4e78hR`), logo H-BATTLE jen originál z jejich FB.
Žádné AI kreslení loga/textu, obličeje nedeformovat.

## Kroky
1. `node scripts/01_fetch_album.mjs` — stažení alba.
2. Kontaktní list + CSV, rozdělení do scén.
3. Návrh výběru + 5 kandidátů na i2v.
4. Animatik (slejty v taktu).
5. Sestava HyperFrames + three.js/GSAP → `04_RELEASE/v1/`.
