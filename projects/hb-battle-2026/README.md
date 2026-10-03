# H-BATTLE 2026 — začátek

Video-prezentace pro Trout Area Czech Republic (Hofer Lake – Pružina, SK, 2.–4. 10. 2026; Trout Area European Hardbaits CUP 2026, pořádá Trout Area Slovakia + H-Battle).
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

## Ryba v0 (prototyp bez fotek)
`proto/9x16/` a `proto/16x9/` — HyperFrames kompozice generované z `scripts/build_proto.mjs` (jeden scénář → dva formáty).
- 3D loga (three.js): originální PNG jako textura na disku s fazetou; žádné AI překreslování.
- Fotky/videa = slejty se 2.5D paralaxou (3 vrstvy, každý shot má pohyb kamery). Po kroku 3 se nahradí výběrem z 02_SELECT + depth mapy.
- Hudba = dočasný klik 120 BPM (`proto/assets/placeholder_120bpm.wav`, generuje ffmpeg). Po dodání tracku Suno přepočítat grid.
- Losování = šablona, data a kánon MiČR doplnit.

```bash
npm install
node scripts/build_proto.mjs
export HYPERFRAMES_BROWSER_PATH=...   # lokálně netřeba, hyperframes si Chrome stáhne sám
cd proto/9x16 && npx hyperframes preview      # Studio
npx hyperframes render . -o ../../04_RELEASE/v0_ryba/HB2026_start_9x16_RYBA.mp4
```
