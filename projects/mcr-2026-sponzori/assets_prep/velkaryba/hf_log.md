# Higgsfield spend log — velkaryba (budget ≤ 12 credits, operator option B)

Balance before: 495.28 credits (2026-10-19 ~16:52 UTC; other sponsor agents may spend in parallel, so per-job costs are logged from get_cost / job).

| # | Time (UTC) | Step | Source (public sponsor URL) | Media / job id | Credits | Note |
|---|---|---|---|---|---|---|
| 1 | 16:53 | media_import_url | https://www.velka-ryba.cz/img/p/3/6/6/3/3/36633.jpg (Shimano Vanquish FA Competition Edition C2000S, 861×1000) | media b7153e3e-4e94-4c7c-8328-d2fb6c03dba7 | 0 | source < 1000 px |
| 2 | 16:53 | upscale_image 2k | ↑ | job dc7b8597-565b-4097-aef5-82b115de3b80 | 2 | get_cost = 2 |
| 3 | 16:54 | media_import_url | https://www.velka-ryba.cz/img/p/3/1/3/1/2/31312.jpg (Shimano Cardiff Roll Swimmer CE 4,5 g Orange Gold, 1000×748) | media 73c6b25f-f1d4-409a-a232-a3dc304f41af | 0 | front spoon only ~560 px in source |
| 4 | 16:54 | upscale_image 2k | ↑ | job ba318e98-c3b8-4d48-ac60-b44c70ef4f16 | 2 | |
| 5 | 16:54 | media_import_url | https://www.velka-ryba.cz/img/p/2/6/0/6/7/26067.jpg (Illex Native Spoon 2,5 g Pink Yamame, 894×1000) | media 84f098b9-40e8-437b-a070-fe825a99d2d2 | 0 | width < 1000 px |
| 6 | 16:54 | upscale_image 2k | ↑ | job fa5012a5-c0e5-4b1e-949c-449cd5ad93d5 | 2 | |

Confirmed in `transactions`: Bytedance Image Upscale −2 at 16:53:09 (Vanquish) and −2 / −2 at 16:54:07–16:54:12 (Cardiff, Illex). The other upscale lines in the same minutes belong to parallel sponsor agents.

**Total spent for velkaryba: 6 credits (budget 12, 6 left).**

- `remove_background` was **not used** (0 credits). The local cut-out (ISNet trimap + colour unmixing against the paper white, script `scratchpad/vr_ad/py/cut.py::cutout3`) gave clean alpha with no halos, kept hooks and barbs intact and opened the line-tie holes. QA is in `ads/_sheet.jpg`.
- Results came to disk via the Zapier→Drive bridge (Drive buffer `_zdroje`, files vr_hf_vanquish_2k.png, vr_hf_cardiff_orange_2k.png, vr_hf_illex_pink_2k.png; none made public).
- Upscaler artefacts found and fixed:
  - Vanquish: the two torx screws on the rotor came out as "speaker-grille" domes. Patched back from a Lanczos ×2.51 upscale of the original, with feathered circles at (655,1645,r74) and (990,1642,r48).
  - Cardiff: the embossed "SHIMANO" is faithful. The stylised logotype reads like "SUIMNNO" in the original packshot as well.
- No user photos were uploaded to Higgsfield.
