# FT Fishing: značky v sortimentu + loga (22. 10. 2026)

Navazuje na `research/ftfishing.md`. Počty = položky ve výpisech kategorií ftfishing.cz (barva × gramáž/délka), stav 22. 10. 2026, do titulků jen zaokrouhleně a s „v nabídce“.
Klíčový zdroj značek: **hero banner homepage FT** `https://www.ftfishing.cz/data/animace/28.jpg` (1160×500) — obchod sám ukazuje: FAVORITE · SPINMAD · CRAZY FISH | SV FISHING LURES · TROUT AREA · VANFOOK. To je zároveň pořadí „vlastní“ váhy značek.

## 1. Váha značek

| # | Značka | Co FT prodává | Položek | Váha | Na banneru FT |
|---|---|---|---|---|---|
| 1 | **Favorite** | pruty (Arena, Arena Stream/Vivid, Blue Bird 2026, Skyline, Totem, X1, U1, Black Swan, Rapid…), navijáky (Totem, Arena, Blue Bird, X1, U1), šňůry (U1 PE, Smart PE 8×, X1, Arena) | 233 prutů + 39 navijáků + ~40 šňůr ≈ **310** | **FOKUS** | ano (1.) |
| 2 | **Crazy Fish** | gumové „jedlé“ nástrahy (Vibro Fat, Nano Minnow, Nimble, Polaris, Trout Worm MF, Allure…), pruty Arion/Versus/Nano/Alpha/Perfect Jig, jig hlavy | 722 nástrah + 51 prutů ≈ **775** | **FOKUS** | ano (3.) |
| 3 | **Spinmad** | rotující ocásky (Tail Spinners), cikády Spicy Blade (Hart, King), Impulse PRO, Crazy Bug, Jigmaster, Koguty, **Target Spoon** (trout area plandavky) | 286 + 36 = **322** | **FOKUS** | ano (2.) |
| 4 | SV Fishing Lures | plandavky (Koketka, Sense, Individ, Air, Lema, Soar, Seeker, Swirl, Iris, Cory…) | **≈ 753** | vysoká (největší počet) | ano |
| 5 | Vanfook | háčky, trojháčky, karabinky, kroužky, plandavky Vanfook (Accuracy, Exceed, Dohna, Frontier…) | 150–180 + 23 plandavek | střední | ano |
| 6 | Trout Area (řada šňůr „Trout area Asso“) | vlasce/šňůry pro trout area | 17 | malá, ale tematická | ano (logo TROUT AREA) |
| 7 | Gurza | lanka, háčky, offsety, FC návazce | 210–240 | střední (přívlač na dravce) | ne |
| 8 | Jigovky.cz | jig hlavičky (filtr „Jigovkycz“) — **sponzor MČR** | v kat. jigových hlav | malá, ale propojení sponzorů | ne |
| 9 | Asso | PE 8× „Made in Japan“, Trout area Asso | ~22 | malá | ne |
| 10 | Sunline | V Hard, fluorocarbon | ~9 | malá | ne |
| 11 | Mahi Mahi | pletenky | 8 | malá | ne |
| 12 | Ebisu | pruty Violet II Nano Jig | 2 | okrajová | ne |

Souvislost s MČR (hard baits): ze „hard“ nástrah má FT **Spinmad** (Target Spoon plandavky, cikády, Impulse) a **SV** plandavky; Crazy Fish jsou gumy → ve filmu jako značka sortimentu, ne jako „nástraha na MČR“.

## 2. Loga → `assets_prep/ftfishing/brands/` (skript `scripts/assets_prep/ftfishing/prep_brands_ft.py`, QA `_sheet.jpg` na bílé / #0E1110 / FT zelené)

| slug | Zdroj | Výsledek | on_dark | Pozn. |
|---|---|---|---|---|
| `favorite` | výřez z banneru FT (1160×500) | 918×217 (×3 Lanczos, white key) | `lift` (černá → bílá) | verze s claimem „my new favorite“; oficiální `favoriteusa.com/cdn/shop/files/Img_FavUSA-09.png` jen 356×70 (chrom, „future of fishing“) → `assets/ftfishing/src/b_favorite_logo.png`; en.favorite-fishing.com za Cloudflare |
| `spinmad` | výřez z banneru FT | 886×380 | `keep` (šedá + modrá) | oficiální `spinmad.pl/gfx/spinmad-logo.png` jen 194×77 (`src/b_spinmad_logo.png`); logo je i na každém produktovém foto Spinmad |
| `crazyfish` | dlaždice kategorie FT `…/data/shop/categories/68.jpg` (400×400) | 1084×840 | `chip` (bílá zaoblená plaketa — ilustrované logo s bílými plochami) | crazy-fish.eu má jen banner 1160×150 s EFTTA (`src/b_crazyfish_banner.png`) |
| `svfishing` | výřez z banneru FT | 719×362 | `lift` | |
| `vanfook` | výřez z banneru FT (červený terč + VANFOOK) | 670×403 | `chip` | Troutshop má jiný Vanfook asset (háček) — tady záměrně podle FT |
| `jigovky` | převzato z `assets_prep/activefishing/brands/jigovky*.png` | | | sponzor MČR |

Všechna loga jsou rastrová (max. ~900 px šířky po ×3) — ve filmu v boxu ≈ 200–300 px, tj. dost. **Pravidlo loga:** loga značek i logo FT ≤ logo TA CZ (`ctx.logo`).

### Wordmark plán (bez loga)
Gurza, Asso, Sunline, Mahi Mahi, Trout Area (řada šňůr): text `GURZA · ASSO · SUNLINE` v **Saira Semi Condensed 700**, verzálky, tracking +0,06 em, #1A1A1A na bílé / bílá na tmavé — stejná výška verzálek jako sousední loga; nenapodobovat jejich loga.
