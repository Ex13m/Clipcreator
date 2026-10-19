# Moonky ad cut-outs (2026-10-19)

Run from `projects/mcr-2026-sponzori`, all with `python3 -I`. `<wd>` = a scratch work dir.

1. `crop_sources.py $PWD <wd>`: white-background shop packshots (assets/moonky/p0*, assets_prep/moonky/ads/_src/w20*) → `<wd>/crop/*.png`
   (lure + white padding) + `<wd>/crop/_meta.json`.
2. ISNet mattes: `node <scratchpad>/bgnode/rmbg.mjs medium <wd>/crop/X.png <wd>/isnet/X.png …` (@imgly/background-removal-node, offline).
3. `cut_moonky.py $PWD <wd> [NAME …]` → `assets_prep/moonky/ads/{H1..H3,S1..S12}_*.png` + `_meta.json` (only NAMEs if given; meta is merged).
   - `white_unmix`: velkaryba_ad/cut.py `cutout3` (holes disabled: soft lures have no through-holes) + `edge_guard`
     (`underside_ghost` = table reflection / contact shadow under the belly, light rim on dark bodies, dark rim on the white lure,
     thin fibres, edge colour = body colour). Per-item knobs in `ITEMS`: `ghost`, `smooth_r`, `erase_thin` (output-coordinate boxes).
   - `shop_alpha_hf`: H1 = Higgsfield 4k (`_src/hf4k_gamer_big_dc03.png`) + shop alpha ×4 (`_src/w289_…png`) → F/B unmix → `clean_contour`.
   - `shop_alpha`: S11/S12 shop alpha + `clean_contour` + decontamination.
4. `sheet.py $PWD <wd>/ttf` → `assets_prep/moonky/ads/_sheet.jpg` (brand header + 4 backgrounds; instantiates Exo 2 / Source Sans 3 TTFs).

Sources and URLs: `assets_prep/moonky/ads/_meta.json` (`source`, `source_url`). Higgsfield spend: `assets_prep/moonky/hf_log.md`.
