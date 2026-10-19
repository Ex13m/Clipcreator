# Higgsfield spend log: Jigovky.cz (budget ≤ 12 credits)

Balance before: 495.28 credits (2026-10-19). Only public product packshots from www.jigovky.cz are imported (no user photos).

| # | Time (UTC) | Action | Input | Job / media id | Credits | Running total | Note |
|---|---|---|---|---|---|---|---|
| 1 | 2026-10-19 16:5x | media_import_url | https://cdn.myshoptet.com/usr/www.jigovky.cz/user/shop/orig/11199_jig-troutjig-barbless--6-5-ks--2-g.jpg (1088×960) | media 629adc76-907f-49be-b67e-72d8ba246edd | 0 | 0 | TroutJig Barbless #6 2 g |
| 2 | 2026-10-19 16:5x | upscale_image get_cost (2k and 4k) | media 629adc76… | — | 0 | 0 | both quote 2 credits |
| 3 | 2026-10-19 16:53:21 | upscale_image 4k | media 629adc76… | job 831d33f7-e6be-4efa-acbb-aa50cb0f0287 | 2 | 2 | 4k instead of 2k: same price, and 2k would leave the jig at ≈1170 px (< 1400 px hero target) |
| 4 | 2026-10-19 16:5x | media_import_url | https://cdn.myshoptet.com/usr/www.jigovky.cz/user/shop/orig/9151_jig-sickle-classic--2.jpg (1200×1600) | media 05968b22-7eec-4fb6-82ae-e6f761c15a7b | 0 | 2 | SICKLE Classic #2 |
| 5 | 2026-10-19 16:53:33 | upscale_image 4k | media 05968b22… (SICKLE) | job a64c0bdf-d82a-444c-99c4-5cc936779eca | 2 | 4 | 4k = 3072×4096; jig ≈ 2460 px |
| 6 | 2026-10-19 17:0x | media_import_url | https://cdn.myshoptet.com/usr/www.jigovky.cz/user/shop/orig/6223_hd-barbless--10--fluo--0-4-g.jpg | media fa7b6b85-4f9f-4d16-9488-8c51b5cb3f39 | 0 | 4 | HD BARBLESS #10 FLUO 0,4 g (head 126 px in source) |
| 7 | 2026-10-19 17:0x | media_import_url | https://cdn.myshoptet.com/usr/www.jigovky.cz/user/shop/orig/7063_hd-barbless--6--red--1-3-g.jpg | media 2b41cf4f-1eba-4ce4-9b27-f168531e97e2 | 0 | 4 | HD BARBLESS #6 RED 1,3 g (head 162 px) |
| 8 | 2026-10-19 17:0x | media_import_url | https://cdn.myshoptet.com/usr/www.jigovky.cz/user/shop/orig/8536-1_hd-barbless--2--5-ks--pink--0-4-g.jpg | media 8ac7a6da-5150-459c-85f6-d53f149a7300 | 0 | 4 | HD BARBLESS #2 PINK 0,4 g (head 104 px) |
| 9 | 2026-10-19 17:04:38 | upscale_image 4k | media fa7b6b85… (FLUO) | job 312a3434-7696-42ae-a507-b04c7e0eb897 | 2 | 6 | colour-head macro |
| 10 | 2026-10-19 17:04:40 | upscale_image 4k | media 2b41cf4f… (RED) | job 90425128-fed1-424d-a3d2-bab6ed67f9e9 | 2 | 8 | colour-head macro |
| 11 | 2026-10-19 17:04:42 | upscale_image 4k | media 8ac7a6da… (PINK) | job fcafc60c-1e83-4d23-8e4d-a6e94c17c236 | 2 | 10 | colour-head macro |

## Summary
- **Spent: 10 credits of 12** (5 × upscale_image 4k at 2 credits; media_import_url and get_cost are free). The account is shared with
  the parallel sponsor agents, so the balance alone does not show this; the 5 Jigovky charges are in `transactions` as
  "Bytedance Image Upscale −2" at 16:53:21, 16:53:33, 17:04:38, 17:04:40 and 17:04:42 UTC (2026-10-19).
- Why 4k and not 2k: identical price (get_cost 2 = 2), and only 4k brings the heroes over the 1400 px target (TroutJig 2k ≈ 1170 px).
- `remove_background` was **not** used (0 credits): every source is a retouched pure-white (255) packshot, and the local
  white-distance key in `scripts/assets_prep/prep_jigovky_ads.py` keeps the 0.3 mm hook wire, the eye hole and the barb
  sharper than a segmentation model (ISNet lost hook wire in earlier tests, see MEMORY.md). Reserve: 2 credits.
- Upscaler side effects fixed locally: faint paper texture in the white background (killed by the halo guard), crisp dust
  specks on the chrome TroutJig head (198 specks inpainted, OpenCV Telea, body only).
- Results brought to disk via the Zapier → Drive buffer `_zdroje` (private, not shared): jig_troutjig_hf4k.png,
  jig_sickle_hf4k.png, jig_hd10_fluo_hf4k.png, jig_hd_red_hf4k.png, jig_hd_pink_hf4k.png → `assets_prep/jigovky/ads/_src/`.
- No user photos were uploaded to Higgsfield; only public product images from www.jigovky.cz.
