# Higgsfield spend log — venue (Líheň Liběchov)

Budget: ≤ 12 credits (operator option B). Balance before: 489.28 credits (19. 10. 2026).
Only public web images (lihenlibechov.cz, ČÚZK ORTOFOTO export) were imported. No user photos, no Drive files.

| # | Time (UTC) | Action | Source | Job / media id | Credits | Running total |
|---|---|---|---|---|---|---|
| 1 | 2026-10-19 16:5x | media_import_url | https://www.lihenlibechov.cz/uploads/images/6ad6194b0611c422794668.png (MČR poster 1448×1086) | media 78e7f57c-5fb3-4337-836b-0342e4b370bb | 0 | 0 |
| 2 | 2026-10-19 16:5x | media_import_url | https://www.lihenlibechov.cz/uploads/images/632b618a081b8172055605.jpg (trophy brown trout 1600×1200) | media 7f075736-6c42-4e0e-ad43-8ff98cb48928 | 0 | 0 |
| 3 | 2026-10-19 16:5x | media_import_url | ČÚZK ORTOFOTO export bbox 461375,5584610,461531,5584766 (EPSG:32633, 156 m, 1248 px = 0.125 m/px) | media bd32afec-2e59-4573-8708-623c5072574c | 0 | 0 |
| 4 | 2026-10-19 16:5x | upscale_image 4k (bytedance) — get_cost said 2 (2k = 4k = 2) | poster (#1) | job 28d0aa2e-1c5c-490e-ad04-853857880a8e | 2 | 2 |
| 5 | 2026-10-19 16:5x | upscale_image 4k | trout (#2) | job 0528c9f5-543d-4266-926a-91daabf0f65a | 2 | 4 |
| 6 | 2026-10-19 16:5x | upscale_image 4k | ortho Malý Sporťáček (#3) | job 49363abd-5d59-4184-8aa5-ef2fed114427 | 2 | 6 |

Results (4096 px long side; poster ×2.83, trout ×2.56, ortho ×3.28) — brought to disk via Zapier→Drive bridge. The PNG results were 17–29 MB (> 10 MB Drive MCP limit), so the Drive copy was re-fetched through its own thumbnail URL with `=s4096-rj-l95` (Google image server → JPEG q95, full 4096 px) and that JPEG was downloaded. Drive files stay private (buffer folder `_zdroje`).
- `src/hf_poster_up4k.jpg` 4096×3072 ← job 28d0aa2e… (result https://d8j0ntlcm91z4.cloudfront.net/user_2vVGC2DWe2MM7XDhdxjTNwWTi4E/hf_20261019_165407_28d0aa2e-1c5c-490e-ad04-853857880a8e.png)
- `src/hf_trout_up4k.jpg` 4096×3072 ← job 0528c9f5… (…/hf_20261019_165410_0528c9f5-543d-4266-926a-91daabf0f65a.png)
- `src/hf_orto_sportacek_up4k.jpg` 4096×4096 ← job 49363abd… (…/hf_20261019_165412_49363abd-5d59-4184-8aa5-ef2fed114427.png)

**Total spent: 6 credits of 12** (3 × upscale 4k; no remove_background — local ISNet + manual fixes were clean). Account balance is shared with the other sponsor agents (489.28 before → 456.53 at 17:2x incl. their spend); this sponsor: 6.
Cut-outs made from these: `ads/h3_mcr_trophy.png`, `ads/h2_trout_potocak.png`, `ads/h1_arena_disc.png`, `ads/h1_pond_island*.png`.
