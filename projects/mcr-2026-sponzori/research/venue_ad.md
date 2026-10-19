# Venue ad — Líheň Liběchov (místo konání MČR 2026): assortment, heroes, brand world, concepts

> **Кратко (RU):** Líheň Liběchov — не магазин, а действующее пстругово хозяйство (líheň с 1934 г., ČRS MO Mělník) + фермерская рыбная лавка + 2 пруда для спортивной ловли + площадка событий (TA, мушка, Rybí košt). Герои: (H1) сам пруд Malý Sporťáček сверху — реальный ортофото ČÚZK, AI‑апскейл 4k, вырезан как линза и как «летающий 3D‑остров»; (H2) ручьевая форель (pstruh obecný = «Liběchovský potočák» в лавке), апскейл 4k + отделение от второй рыбы; (H3) кубок MČR 2026 из официального постера, апскейл 4k, ручки и цоколь вычищены. Вторичные: копчёная форель, гравюра‑форель из логотипа (вектор 4000 px), мальки осетра в бассейне líheň. Мир бренда: бирюза #17a1c8 / navy #1a212e / aqua #9ae7e8 / золото #d8af64, шрифт логотипа ≈ **Bitter** (добавлен в fonts.mjs), сайт — Montserrat 800 italic uppercase. Рекомендую концепт **A «Od pramene k mistrovství»** (дайв с 3D‑острова в пруд → форель → кубок), из B берём гравюру как переходы. Higgsfield: 6 из 12 кредитов.

Status 19. 10. 2026 · inputs: BRIEF.md (ZMĚNA SMĚRU), research/libechov.md (+ Verification), vo/script_cs.json (`venue`), data/blocks/venue.json, assets_prep/manifest.json, DESIGN.md (product choreography only), scripts/lib/fx.mjs. `scripts/BLOCK_API.md` did not exist at the time of writing (fx.mjs header points to it).

---

## 1. Assortment & positioning (what the venue actually "sells")

Pages fetched through the bridge (Zapier GET) on 19. 10. 2026:
[/cs/prodejna](https://www.lihenlibechov.cz/cs/prodejna) · [/cs/sportovni-rybolov](https://www.lihenlibechov.cz/cs/sportovni-rybolov) · [/cs/historie](https://www.lihenlibechov.cz/cs/historie) · [/cs/o-nas](https://www.lihenlibechov.cz/cs/o-nas) · [/cs/aktuality](https://www.lihenlibechov.cz/cs/aktuality) (all 74 posts) · [/cs/aktualita/maly-sportacek](https://www.lihenlibechov.cz/cs/aktualita/maly-sportacek) · [/css/index.css](https://www.lihenlibechov.cz/css/index.css).

**Positioning in one line:** a working trout hatchery and fish farm with a farm shop and two sport-fishing ponds, run by the anglers' union (ČRS MO Mělník via Líheň Liběchov s.r.o. since 2022). It is not a tackle retailer and not a chain. The pitch is *place + fish + tradition*.

| Pillar | What dominates (counted / quoted) | Source |
|---|---|---|
| **Own production (líheň / chov)** | Breeding focuses on **siven americký, pstruh duhový, pstruh potoční**; expanding to jeseteři, kapři, amuři, candáti, štiky. History: hatchery founded 1934 by Karel Stutzig; 1953 → 500 000 rainbow-trout eggs; late 1980s/90s rebuilt as a breeding station for salmonids "s jednou z největších a nejmodernějších líhní v ČR". | /cs/o-nas, /cs/historie |
| **Farm shop (prodejna)** | **11 live species** on the price list: kapr 125, amur 130, pstruh duhový 229, **pstruh obecný „Liběchovský potočák“ 299**, siven 229, štika 385, jeseter 395, lín 195, okoun 300, candát 585, sumec 330 Kč/kg. **Uzené výrobky** (pstruh duhový 399, kapr 349 Kč/kg; by offer úhoř, sumec, jeseter, krevety, klobásky, siven) — *„každý čtvrtek od 16 hod. a pá + so“*. Add-ons: frozen sea fish & shrimps, rybí klobásy, šunka, saláty, paštiky; fresh Norwegian salmon fillet on order (549 Kč/kg). Cleaning service 10 Kč/trout. Price stance quoted: *„Ceny ryb i ceny za služby zpracování držíme dlouhodobě nízké.“* | /cs/prodejna; aktuality „Objednávka lososa“ |
| **Sport fishing** | Two ponds: **Velký Sporťák** (site gives 2,4 ha on O nás/Historie, 2,5 ha in the price list → say „přes 2 hektary“) and **Malý Sporťáček** (0,2 ha, 1,5 m; aktualita 4. 1. 2025: *„Má rozměry 50x40m … maximálně pro 10 rybářů“*). Rules on Sporťáček: 1 rod, max 2 single **barbless** hooks (spinning) / 3 barbless flies. Permits for river **Liběchovka 1 (č. 413 036)**. Ethics line: *„Ryba je živý tvor, který si zaslouží úctu!“* Since 23. 6. 2026 Malý Sporťáček is **„chyť a vem“** (no „chyť a pusť“ claims!). | /cs/sportovni-rybolov; aktuality |
| **Events / community** | Of 74 news posts: **24 shop & food** products, **20 competitions & events**, **17 opening-hours notices**, **13 fishing operations/rules/stocking**. Events: Trout Area (MČR 2026; TA Tour 1. závod 7. 3. 2026 on Sporťáček; Winter Trout Cup 18. 1. 2025; TA Masters hard baits 30. 11. 2024), fly-fishing „Liběchovský pstruh“ (4 posts, 2023–2026), **Rybí košt** (5. ročník 2026), children's fishing camp (2024, 2026), Easter „chytačka“. | /cs/aktuality |

Price segment: low/local (farm-gate prices, cheap services). Own production vs reseller: **own** salmonid breeding + live fish; **resold** frozen sea products and salmon fillets. Specialities: Liběchovský potočák (brown trout), weekly smoked trout, the TA pond, heritage (1934, Stutzig story, spring Boží Voda, „donedávna nejníže položené pstruhařství v Evropě“).

**Implication for the ad:** the "products" are the **pond** (the MČR arena), the **trout** (what the hatchery raises and the shop sells) and the **championship** itself. Shop items (smoked trout) and the hatchery (sturgeon fry) are secondary colour, not the message.

## 2. Hero picks + secondaries (files in `assets_prep/venue/ads/`, see `_meta.json`, sheet `_sheet.jpg`)

| # | Asset | Why | Source & processing | Size |
|---|---|---|---|---|
| **H1** | `h1_arena_disc.png` (+ `h1_arena_disc_watermask.png`, `h1_arena_aerial.jpg`) | The venue's real "product": **Malý Sporťáček from above** (fish-farm raceways at the top, farm hall bottom-left — building roles not verified). Lens for a map-pin dive; water mask lets caustics/shimmer play only on the water. | ČÚZK ORTOFOTO export (0,125 m/px, EPSG:32633) → Higgsfield upscale 4k → circle lens, light grade | 2000² (0,051 m/px) |
| **H1b** | `h1_pond_island_3d.png` (+ flat `h1_pond_island.png`, watermask, shadow) | The pond + 4 m bank as a **floating diorama island** (Apple-Maps-landmark look) — perfect drop-hit object on a brand-colour field, then rotateX → top-down dive. | same ortho, pond mask from `mcr-2026-dron/data/water_labels.png`, extruded soil side 110 px | 1863×1870 |
| **H2** | `h2_trout_potocak.png` (+ shadow) | **Pstruh obecný** = the shop's „Liběchovský potočák“; trophy fish from the 2022 stocking photo. Living product of the líheň; red-spot macro is gorgeous for push-ins and light sweeps. | lihenlibechov.cz stocking photo 1600×1200 → Higgsfield upscale 4k → ISNet + GrabCut (second fish and a third tail removed) + edge shrink + decontamination | 2154×1122 |
| **H3** | `h3_mcr_trophy.png` (+ shadow) | **MČR 2026 trophy** key visual from the official poster published by the venue → ties the place to the championship; gold = metallic sweep. | poster → Higgsfield upscale 4k → ISNet; handle holes cleared; plinth bottom rebuilt (date banner was painted over it) | 1623×2290 |
| S1 | `s1_smoked_trout_pair.png` | Shop speciality (uzení pstruzi, every Thursday). Warm gold-brown → pairs with gold #d8af64. | web 1536×2048 → local ISNet, wood gap + shadow removed | 1207×2103 |
| S2 | `s2_etched_trout_ink.png`, `s2_etched_trout_sticker.png` | The logo's **etched trout** as a brand device (line-draw reveal, giant background etching, sticker). | logo.svg rendered at 4000 px → ink extraction | 2235×2548 |
| S3 | `s3_hatchery_sturgeon_fry.jpg` | „Líheň“ in one picture: sturgeon fry in a blue tank (top-down). Background/transition plate. | aktualita „Jeseter“ (2023) | 1536×2048 |
| S4 | `libechov/logo.png` | End card / badge. | existing | 2000² |
| S5 | `libechov/venue/v01–v04` | Winter pond photos 9:16, trout in net, full MČR poster. | existing | 1080×1920 |

Not used: Liběchovský pstruh tankards (boxes cropped by the photo frame, glass), siven illustration (licence unknown), sturgeon-with-person photo (identifiable person), Rybí košt / Christmas team photos (people), TA race banners (AI art + other logos).
Higgsfield: 3 × upscale 4k = **6 credits** (log `assets_prep/venue/hf_log.md`); no remove_background needed (local ISNet + manual fixes were clean). Drone flyover `drone/final/flyover_9x16.mp4` **not present** → H1/H1b replace it; when it arrives, it slots in at the "dive" beat.

## 3. Brand world

**Colours** (CSS `/css/index.css` + logo):

| Token | Hex | Where on their site | Use in the block |
|---|---|---|---|
| turquoise | `#17a1c8` | header band, h2, hover | main field / water light |
| navy | `#1a212e` | navbar, body text, logo ink | deep field, ink, text on light |
| aqua | `#9ae7e8` | links, „LÍHEŇ“ in header | kicker text on navy, glints |
| gold | `#d8af64` | buttons, nav underline, phone icon | numerals 1934, rules, trophy sweep |
| paper | `#f8f8f8` / white | page bg, logo disc | etching plate, stickers |
| deep (derived) | `#0f6f8c` | — | white text ≥ 5,7:1 on it (white on #17a1c8 is only 3,0:1 → big bold type only) |

Contrast: navy on turquoise 5,4:1 · aqua on navy 11,5:1 · gold on navy 7,9:1 · gold on turquoise 1,5:1 (never).

**Typography:** logo lettering is a bracketed slab → closest OFL match **Bitter** (checked side by side against the logo). Added: `fonts/bitter-{latin,latin-ext}-wght-{normal,italic}.woff2` + `_ttf` mirrors, registered in `scripts/lib/fonts.mjs` (`font-family:'Bitter'`, wght 100–900); static weights also in `proto/assets/fonts.css`. Website = **Montserrat** 300 (body, light h1), 700 uppercase (h2), **800 italic uppercase** (header „LIBĚCHOV“, aqua „LÍHEŇ“ 500 italic).
→ Display/numerals: Bitter 800–900 (1934, 164 m n. m., LÍHEŇ LIBĚCHOV). Kickers/chips: Montserrat 800 italic uppercase, tracking .08–.12em. Secondary lines: Montserrat 300.

**Visual motifs:** etching/stipple (the logo trout), round badge, water (caustics, spring), gold rule lines (nav underline), summer-green ortho vs. turquoise water light.

**Tone of voice:** local, warm, honest, a bit informal on the web („malej Sporťáček“, „pstroužek“, „přijďte nasát jarní energii“), with real pride in heritage (Stutzig's „zlatonosný claim“) and fish ethics. For the ad: calm confidence + heritage, no hype words, no superlatives except the verified „donedávna nejníže položené pstruhařství v Evropě“.

## 4. Two concepts

### A — „Od pramene k mistrovství“ (spring → championship) · **recommended**
The block sits on the **music drop (bar 8)** → it needs a physical hit and one continuous camera move.
- **Bar 0 (drop):** turquoise field + aqua glow; **3D island H1b** slams in from above (scale 1.25→1, slight rotateX 50°), contact shadow lands on the beat. Kicker „MÍSTO KONÁNÍ · MČR 2026“ (Montserrat 800 italic, aqua) + **„LÍHEŇ LIBĚCHOV“** Bitter 900 char reveal. VO: „Hostí nás Líheň Liběchov“.
- **Bar 1 (dive):** island rotates to top-down and pushes in → match-cut to **H1 arena disc** → full-bleed `h1_arena_aerial.jpg`; caustic shimmer only inside the water mask; map pin + chip „Malý Sporťáček · 24.–25. 10.“. **Odometer 1934** (Bitter 900, gold) on VO „od roku 1934“.
- **Bar 2 (trout):** depth stack — giant `s2_etched_trout_ink` (tinted aqua, 15 % opacity) → **H2 brown trout** swims across with parallax + specular sweep along the spots; chip „donedávna nejníže položené pstruhařství v Evropě · 164 m n. m.“ (both parts always together).
- **Bar 3 (payoff):** **H3 trophy** rises from the water line with gold sweep + soft rays; chip „Pramen Boží Voda“; URL **lihenlibechov.cz**; 0,6 s clean poster frame.
- **Reel:** hook bar = island hit + „Kde se rozhodne mistr republiky?“ / „Líheň Liběchov“ (MČR is held there — verified); end card = logo badge + URL + „Partner MČR v Trout Area 2026“ + TA plate.
- Pros: one readable story (place → fish → title), strong drop hit, every asset is real (ortho, own photo, official poster). Cons: H2 tail is blunt in the source → keep the trout moving/cropped; aerial is summer while pond photos are winter (don't intercut them in the same bar).

### B — „Rytina 1934“ (etched heritage catalogue)
Paper `#f8f8f8` + navy etching world. The logo trout draws itself (mask line-draw), then "specimen plates" pop into colour: H2 trout, S1 smoked trout, S3 sturgeon fry — each with a Bitter caption and a gold rule; the aerial lens H1 appears as a map plate with coordinates; ends on the logo badge.
- Pros: very distinctive vs. other sponsors (only light/editorial world in the film), heritage-forward, shows the shop.
- Cons: calm, editorial — fights the **drop** at bar 8; more text to read; trophy/MČR link weaker.

**Recommendation: A**, borrowing B's etching as the transition device (etched trout line-draw wipes in/out of the block) and B's light paper plate for the Reel end card variant. Keep the block on turquoise/navy so the TA CZ white plate stays the brightest small element in its corner.

## 5. Verified copy for this block (CZ)
- „Místo konání MČR 2026“ / „Líheň Liběchov“ / „Hostí nás Líheň Liběchov“
- „Pstruží líheň od roku 1934“ (2026 = 92 let; „90+ let tradice“ ok)
- „Donedávna nejníže položené pstruhařství v Evropě · 164 m n. m.“ — never without „donedávna“
- „Malý Sporťáček · 24.–25. 10.“ · „Pramen Boží Voda“ · „lihenlibechov.cz“
- Secondary (Reel/extra only): „Uzené pstruhy každý čtvrtek“ (prodejna), „Malý Sporťáček 50 × 40 m“ (aktualita 4. 1. 2025), „Dva sportovní rybníky“.
- Never: „chyť a pusť“ for Malý Sporťáček; 2,5 ha; prices on screen (they change).
