# Venue (Líheň Liběchov) ad cut-outs — scripts as run on 19. 10. 2026

Order: ISNet (`../rmbg.mjs medium …`) on crops of `assets_prep/venue/src/hf_*_up4k.jpg` / `assets/libechov/web2/lib_uzeni_pstruzi.jpg`
→ `cut_trout.py` (GrabCut separation, seeds in 1000-px grid coords) → `fin_trout.py`, `fin_cup.py`, `fin_smoked.py`, `fin_aerial.py` → `contact.py` (`ads/_sheet.jpg`).
`finalize.py` = shared helpers (alpha clean, 1–1.5 px edge shrink, feather, colour decontamination, trim, shadow layer).
Paths inside point to the session scratchpad (`…/scratchpad/venue/work/`) where the crops / ISNet outputs lived; inputs and outputs are documented in `assets_prep/venue/ads/_meta.json` and `assets_prep/venue/hf_log.md`.
