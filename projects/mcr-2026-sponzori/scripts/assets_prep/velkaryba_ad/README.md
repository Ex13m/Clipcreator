# Velká ryba ad cut-outs (2026-10-19)

- `cut.py`: white-packshot cut-out. `cutout3` = ISNet trimap + colour unmixing against the paper white (no halos) + topology
  (everything enclosed by the product stays opaque, paper-white holes with low ISNet alpha are opened). `contact_shadow2` = soft
  elliptical floor shadow.
- `build_heroes.py <dir of cut.py> <workdir>`: H1–H3 from the Higgsfield 2k upscales (`assets/velkaryba/hf/*.png`, copy them to
  `<workdir>/dl/`, ISNet mattes in `<workdir>/isnet/` via `scratchpad/bgnode/rmbg.mjs medium …`, Lanczos ref
  `<workdir>/work/vanquish_lanczos.png` = original 36633 resized to 2160×2496 + UnsharpMask(3,90,2)).
- `build_sec.py`: S1–S7 from `assets/velkaryba/p0*.jpg` (+ `extra/p11_*` rod).
- `fix_hole.py <png> x0 y0 x1 y1`: clears paper-white slivers in a box (H2 front: 1112 540 1148 595 and 1162 595 1210 645).
- `sheet.py` → `assets_prep/velkaryba/ads/_sheet.jpg`; `moodboard.py` → `_brandworld.jpg` (needs fontTools; scratch venv `ap/venv`).
- `build_assort.py <workdir> <outdir>` (block build 19. 10.): assortment cut-outs S8–S11 (Lucky John EOS, Westin Fidusen Slim,
  Vanpla, Berkley Sukoshi) from `assets/velkaryba/extra/p12–p14` (bridge, weserv PNG) + `p07`; Sukoshi hole opened with
  `fix_hole.py S11… 34 100 92 158`. S2b/S3b = single views split from the S2/S3 pairs by connected component.
