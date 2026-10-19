# Bosset ad cut-outs (2026-10-19)

- `build.py <workdir> [name filters…]`: all cut-outs into `assets_prep/bosset/ads/`. `<workdir>` holds `src/` (shop originals: `assets/bosset/p0*.jpg`,
  gallery shots `smsr_green_g3.jpg`, `smsr_pink_g3.jpg`, `smshe_orange_g5.jpg`, `ygk_upgrade_x8.png`), `isnet/<name>.png`
  (`scratchpad/bgnode/rmbg.mjs medium …`) and `dl/hf_keitech_es4_4k.png` (Higgsfield 4k upscale, copy in `assets/bosset/hf/`).
  - bottles: `dark_cut` (pure paper white → darkness > 10, row-filled, rim alpha from a darkness ramp) + `edge_clean` (rim colour from inside);
  - lid-open macros + YGK spool: `velkaryba_ad/cut.py::cutout3` with `clean_isnet` (ISNet bleeds onto pure white at the frame edge);
  - Keitech: `smooth_cut` (smoothed ISNet ∪ darkness contour, pulled in 2 px, rim colours from 6 px inside → no upscaler dust), 2400 px.
- `manifest.py` → `ads/manifest.json` (size, pad [l,t,r,b], aspect, dominant colours, product page, source image, verified claims).
- `sheet.py` → `ads/_sheet.jpg` (dark / light / teal #1B97B1 / light blue #C5EBFC).
- `moodboard.py` → `ads/_brandworld.jpg` (4 mood frames 1080×1920, Saira instances via fontTools, real TA plate, Reels UI zones tinted).
