# Higgsfield spend log: Activefishing.cz (budget ≤ 12 credits, operator option B)

Balance before: 456.53 credits (2026-10-19 ~18:33 UTC). The account is shared with parallel sponsor agents, so per-job charges
are confirmed in `transactions`. Only public product packshots from cdn.myshoptet.com/usr/www.activefishing.cz are imported (no user photos).

| # | Time (UTC) | Action | Source (public sponsor URL) | Media / job id | Credits | Running total | Note |
|---|---|---|---|---|---|---|---|
| 1 | 18:33 | media_import_url | https://cdn.myshoptet.com/usr/www.activefishing.cz/user/shop/orig/23817_tropical-chart-pink.jpg (800×600) | media 14fe9a39-6d29-424f-8b41-2b74fe086b5d | 0 | 0 | Timon Chibi Futten FS Tropical Chart Pink 51mm, lure ≈ 700 px |
| 2 | 18:33 | media_import_url | https://cdn.myshoptet.com/usr/www.activefishing.cz/user/shop/orig/23480_sk017.jpg (800×600) | media 76d1a164-41da-4577-8fd2-e01d76e2e9d1 | 0 | 0 | Nories Sofia 1,2g SK017 Hot Mango 101, spoons ≈ 300 px each |
| 3 | 18:33 | upscale_image get_cost 4k | media 14fe9a39… | — | 0 | 0 | quote 2 credits |
| 4 | 18:33:05 | upscale_image 4k (bytedance) | media 14fe9a39… (Chibi Futten) | job a0e1fc81-7fa8-4776-94f9-79c5b8dfa300 | 2 | 2 | ok → 4096×3072 → `ads/_src/af_chibi_tropchartpink_hf4k.png` |
| 5 | 18:33:07 | upscale_image 4k (bytedance) | media 76d1a164… (Sofia) | job e6c49ed4-b7a5-4aa0-a265-59a4dd94daef | 2 → refunded | 2 | job **failed**; refund +2 at 18:36:03 (transactions) |
| 6 | 18:36 | upscale_image 4k (bytedance), retry | media 76d1a164… (Sofia) | job c670c9fb-e799-4dd8-9f23-3509c897d992 | 2 | 4 | ok → 4096×3072 → `ads/_src/af_sofia_sk017_hf4k.png` |

## Summary
- **Spent: 4 credits of 12** (2 × upscale_image 4k; the failed job was refunded; imports and get_cost are free).
- `remove_background` was **not** used (0 credits): all sources are retouched pure-white (255) packshots, and the local
  ISNet trimap + white unmixing keeps the hook wire, line-tie holes and the translucent lips better (see MEMORY.md lessons).
- Not upscaled: VARIVAS ES2 spool (source already 1500×1500), Chibi Futten colourways and Velvet Arts Forte (secondary, native size).
- Results brought to disk via the Zapier → Drive buffer `_zdroje` (private, not shared).
