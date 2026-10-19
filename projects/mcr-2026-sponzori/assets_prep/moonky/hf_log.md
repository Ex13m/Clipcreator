# Higgsfield spend log: Moonky (budget ≤ 12 credits)

Balance before: 450.53 credits (2026-10-19 ~18:55 UTC; account shared with parallel sponsor agents, so the balance alone
does not prove this log). Only public product images from www.moonky.cz are imported. No user photos (u01–u05) were uploaded.

| # | Time (UTC) | Action | Input | Job / media id | Credits | Running total | Note |
|---|---|---|---|---|---|---|---|
| 1 | 2026-10-19 18:5x | media_import_url | https://cdn.myshoptet.com/usr/www.moonky.cz/user/shop/orig/289_gamer-big-brown-orange.png (1024×768, shop alpha, lure ≈ 817 px) | media 39dc26fd-02ba-44f9-b6ec-a707bedb35ce | 0 | 0 | Gamer Big 46mm DC03 (bestseller) |
| 2 | 2026-10-19 18:5x | upscale_image get_cost 4k | media 39dc26fd… | — | 0 | 0 | quote 2 credits |
| 3 | 2026-10-19 18:5x | upscale_image 4k | media 39dc26fd… | job b3f773af-e4f6-4dff-8c52-d8541e8efdd0 | 2 | 2 | source < 1000 px → hero needs ≥ 1400 px |
| 4 | 2026-10-19 18:58 | (bridge) result → Drive `_zdroje` → disk | https://d8j0ntlcm91z4.cloudfront.net/…/hf_20261019_185442_b3f773af-….png (4096×3072) | Drive 15Jeqaq6LdiT_LCA_efFrAUG21dgNBCOJ (private) | 0 | 2 | saved as `assets_prep/moonky/ads/_src/hf4k_gamer_big_dc03.png` |

## Summary
- **Spent: 2 credits of 12** (1 × upscale_image 4k; media_import_url and get_cost are free). 4k chosen over 2k at the same price:
  2k would leave the lure at ≈ 1630 px, 4k gives ≈ 3270 px, so the hero is downscaled to 2400 px (crisper).
- Only the Gamer Big DC03 hero qualified (shop original 1024×768, lure ≈ 817 px < 1000 px). The other two heroes have 2252×4000 /
  3000×4000 shop originals (lure 1890 / 2140 px) and were cut locally. Secondaries were not upscaled (rule: heroes only).
- `remove_background` was **not** used: the upscaler drops the shop alpha and returns the grey studio photo under it, so the shop's own
  alpha (×4 Lanczos) was re-fitted to the 4k image locally (F/B unmix + geometric contour rebuild, `scripts/assets_prep/moonky_ad/cut_moonky.py`).
- Upscaler check (viewed at 1:1): segment ridges, the three "legs" and gloss highlights are faithful; no invented details found.
- No user photos (u01–u05, b-roll) were uploaded anywhere; the Drive buffer file stays private.
