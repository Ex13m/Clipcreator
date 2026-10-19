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
- `build_lures.py <workdir> [--pre | keys…]` (2026-10-19, block agent): assortment cut-outs `ads/L1…L9` for the „rybářský e-shop“ grid — Keitech Easy Shiner
  424T / 416T / 426T / EA12T, Fresh Lures FlipWorm #122 / FlatWorm #104, Select Easy Shad #280 / Dementor 130SP #13, Decoy Round Magic SV-52.
  Sources = shop originals in `assets/bosset/lures/` (bridge: Drive upload of `images.weserv.nl/?url=…/orig/…&output=png&l=0`). Pass `--pre` paints shop
  branding out (largest component kept, paper by normalised convolution), then ISNet (`scratchpad/bgnode/rmbg.mjs medium`), then the cut pass:
  soft baits `cutout3` + decontaminate, wobbler + frosted lip, jig head `white_key lo=30` gated by ISNet. Pads → `ads/_lures_meta.json`; QA `ads/_lures_sheet.jpg`.
