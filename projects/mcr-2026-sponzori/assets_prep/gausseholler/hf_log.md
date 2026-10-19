# Higgsfield spend log: gausseholler (budget ≤ 12 credits, operator option B)

| # | Time (UTC) | Step | Source | Media / job id | Credits | Note |
|---|---|---|---|---|---|---|
| none | | | | | 0 | no Higgsfield call made |

**Total spent for gausseholler: 0 credits (budget 12, 12 left).**

Why no AI upscale or remove_background was used:
- Both conditions from the brief are false. Every source is a 2048 px shop render, with no source under 1000 px. The local cut-outs show no visible defects at 100 % on dark, light and #1D8FD5 (`ads/_sheet.jpg`).
- The products are black carbon and anodised parts on a dark grey studio gradient. That case is dark-on-dark, not white-packshot, and HF `remove_background` would have to guess there too. The local pipeline estimates the studio plate, unmixes the edge colour against it, and handles end caps whose rim equals the plate grey with a fitted ellipse (see `scripts/assets_prep/gausseholler_ad/cut.py`).
- The upscaler would invent detail on the carbon twill, the grip pattern and the gear logo (see MEMORY: Velká ryba torx screws). On this brand those details are what the ad sells.
- If a later macro push-in needs more than about 1.3× on `H1_revolut8_black_threeq`, the best single 2-credit spend is a 4k upscale of `https://cdn.shopify.com/s/files/1/0994/1775/1900/files/r8-alu-black.jpg`. Check the gear logo and the grip pattern against the original afterwards.
- No user photos were uploaded anywhere. The Drive buffer files (`gh_*.jpg` in `_zdroje`) are private and were never shared.
