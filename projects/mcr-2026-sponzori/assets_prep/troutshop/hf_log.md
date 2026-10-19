# Higgsfield spend log — Troutshop (budget ≤ 12 credits, operator option B)

Balance before: 459.53 credits (2026-10-19).

| # | Time (UTC) | Action | Source | Job / media id | Credits | Result |
|---|---|---|---|---|---|---|
| 1 | 2026-10-19 | media_import_url | https://troutshop.eu/wp-content/uploads/2020/07/nories-rooney-101-1.jpg (800×800, public shop image) | media 1fc8292d-1e58-44d2-be82-26ef718193e1 | 0 | ok |
| 2 | 2026-10-19 17:08 | upscale_image 2k (bytedance), get_cost = 2 | media above | job 094d26b2-e556-461a-915b-b62828957d95 | 2 | ok → 2160×2160 PNG (watermark kept, removed locally afterwards) → ads/src/ts_rooney_101_hf2k.png |
| 3 | 2026-10-19 17:19 | media_import_url | https://troutshop.eu/wp-content/uploads/2022/03/crankin-pupa-109-2048x2048.jpg (2048 px, no watermark) | media 697a081d-72ca-4ffc-b0fd-36a55a8a8697 | 0 | ok |
| 4 | 2026-10-19 17:20 | remove_background (image_background_remover) — local ISNet cut of the clear crank had an opaque white lip/body | media above | job d10c2026-e0df-4b3d-8aa9-17a138b28ec7 | 1 | ok → ads/src/ts_pupa_109_hf_rmbg.png |

Balance after #4: 456.53 (−3.00).

Running total: 3 / 12

## Status 2026-10-19 (assortment & heroes step, re-run)
- No further Higgsfield spend. Forte 32 (hero 2) is a 1500 px shop PNG with clean alpha, so it does not qualify (rule: only hero images with visible cut-out defects or a source < 1000 px). Secondaries are not heroes.
- Hero 3 uses the local cut `heroes/h04` cleaned with `ts_polish.clear_lure`. The HF remove_background result (#4) was kept for reference only: it has a more transparent lip but still carries the NORIES logo in frame.
- **Final total: 3 / 12 credits.**
