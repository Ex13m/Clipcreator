# VO_TEMPLATE: Czech voice-over per block

The approved lines build on `vo/script_cs.md` (v1, verified 19. 10. 2026). The timing is retargeted to the final design (`DESIGN.md` §5.3, `STORYBOARD.md`).
`vo/script_cs.json` stays the machine source. Update it from this file.

---

## 1. Voice, files, timing

| | |
|---|---|
| Voice | **Paul Broadcaster**, ElevenLabs v3 via HeyGen (`create_speech`). `voiceId 02733a92a0db457aadf63b235d2aa457`, engine `elevenlabs`, model `eleven_v3`, language `cs` (BRIEF) |
| Tone | Presentational, confident, warm, premium. „Presenting a collection", not a sales voice and not shouting. Smile in the voice on partner names |
| Input | Plain text from the **TTS** line (numbers as words). No SSML. Use the **Přepis** respelling only if a test render misreads a name |
| Files | `vo/<unit>.wav`, one per unit: `intro`, `libechov`, `troutshop`, `activefishing`, `moonky`, `jigovky`, `velkaryba`, `bosset`, `gausseholler`, `finale_a`, `finale_b`. The same file serves the master and every banner (B8 / B10) |
| Post | Trim silence at −45 dBFS (keep 40 ms head / 80 ms tail), normalise to −16 LUFS, then check the length with `ffprobe` against the window |
| Rate | Measured 2.9 spoken words/s. Estimate = spoken words / 2.9 |
| Counting | Space-separated tokens. Dashes and „·" do not count. „1 300" counts as 1 written word; the spoken count uses the TTS line |

### 1.1 Windows
| Unit | Master in → target out (hard) | Local | Max length (target / hard) |
|---|---|---|---|
| Intro | 0.25 → 3.60 | — | 3.35 s |
| Each Look | block + 0.50 → block + 6.50 (block + 7.00) | 0.50 → 6.50 (7.00) | **6.0 s / 6.5 s** |
| Finale A | 68.40 → 70.60 | 0.40 → 2.60 | 2.2 s |
| *(music shout „Trout Area!" ≈ 71.0, no VO 70.60–72.20)* | | | |
| Finale B | 72.20 → 73.80 | 4.20 → 5.80 | 1.6 s |

Look block starts: L01 4 · L02 12 · L03 20 · L04 28 · L05 36 · L06 44 · L07 52 · L08 60.

**If a take is too long:**
1. Regenerate (same text).
2. If it still runs over, time-compress with rubberband by at most 4 %.
3. If it still runs over, use the **SHORT** line.

VO never crosses the louvre close (7.30) and never enters the shout gap.

### 1.2 Template (every Look)
```
VO        „{JMENO_VO} – {CLAIM_VO}. {FAKT1_VO}[ a {FAKT2_VO}]."      2 sentences, ≤ 17 written words
TTS       same text, numbers as words, nothing else changed
PŘEPIS    phonetic respelling of brand names only (fallback)
SHORT     „{JMENO_VO} – {CLAIM_VO}[, {FAKT1_VO}]."                   ≤ 12 spoken words (≤ 4.6 s) — CUT-59 and over-long takes
```
- Sentence 1 names the partner. It lands with the hallmark plate (≈ 1.0 s).
- Sentence 2 carries the facts. It lands with fact A (≈ 4.0 s).
- Domains are **never spoken**; they are on screen.

---

## 2. Copy guardrails (never say, never show)
- **Format:** MČR is a **hard-baits** event (troutareacz.cz). Moonky soft baits and Jigovky jigs are presented as *partners and makers*, never as baits used at this championship.
- **Líheň / venue:**
  - Malý Sporťáček is **not** „chyť a pusť" (it has been „chyť a vem" since 23. 6. 2026).
  - „nejníže položené pstruhařství v Evropě" is used **only with „donedávna"**, and only as the site's claim. Never show both 164 m n. m. and our measured ≈ 167 m.
  - Do not quote the area of Velký Sporťák (2,4 vs 2,5 ha).
- **Troutshop:** never „vítězové v SK, CZ, PL i UA" (rejected in verification). Velvet Arts and Nories are brands they sell, not their own.
- **Shops** (Troutshop, Activefishing, Velká ryba, Bosset): never present other companies' brands as their own. Brand names appear as product labels only.
- **Moonky:** no „nejlepší"; no „8 let" (the page is undated).
- **Jigovky:** no „největší výběr", „vlastní výroba" or „+1300 druhů" as our statements.
- **Velká ryba:** no „nejdéle provozovaná speciálka" (valid only with the full qualifier).
- **Bosset:**
  - nothing about where Zojirushi comes from
  - not „prodávají jen vyzkoušené" (rejected)
  - „až 6 h" is shown only with the 0,6 l drinking thermoses (SM-SR / SM-VB / SM-SHE), which are the ones on screen
- **Superlatives** are allowed only as the partner's own words: their slogan, in quotes, or „dle <web>".

---

## 3. Verified facts registry (placeholders → current values)
Status: **OK** = passed the adversarial Verification in `research/*.md` · **CITED** = quoted from the source, no Verification section yet · **CONFIRM** = needs the user or sponsor · **LIVE** = a moving number; recheck on export day.

| Placeholder | Value (default) | Used in | Source | Status |
|---|---|---|---|---|
| `{AKCE}` | Mistrovství České republiky v Trout Area 2026 | intro VO, finale screen | `BRIEF.md`; `research/mcr_tournament.md` | OK |
| `{DATUM}` / `{DATUM_KRATKY}` | 24.–25. 10. 2026 / 24.–25. 10. | screen | `mcr_tournament.md` (Den 1 so 24. 10., Den 2 ne 25. 10.) | OK |
| `{MISTO}` / `{REVIR}` | Líheň Liběchov / Malý Sporťáček | screen, L01 | `BRIEF.md`; lihenlibechov.cz news 22.–25. 10. | OK |
| `{STATS}` | 40 závodníků · 12 kol · 2 dny · hard baits | hem tape only | `mcr_tournament.md` | OK |
| `{WEB_TA}` | troutareacz.cz | finale screen | `mcr_tournament.md` | OK |
| `{LIHEN_ROK}` | 1934 | L01 VO + DISPLAY | `libechov.md` Verification #2 | OK |
| `{LIHEN_NADM}` | „donedávna nejníže položené pstruhařství v Evropě" (164 m n. m.) | L01 VO only | `libechov.md:34–36, 60` | OK, with „donedávna" |
| `{TS_CLAIM}` | specialista na pstruhy (← „The trout fishing SPECIALIST!") | L02 VO | `troutshop.md:11–12` | OK |
| `{TS_ONELINER}` | Milujeme lov pstruhů (← SK hero „Milujeme lov pstruhov") | L02 screen | `troutshop.md` | OK |
| `{TS_ROK}` | rodinná firma od roku 1999 | L02 | `troutshop.md` Verification #1 | OK |
| `{TS_PARTNER}` | generální partner Trout Area Slovakia | L02 | `troutshop.md` Verification #2 | OK |
| `{AF_ORIGIN}` | e-shop zrozený z vášně pro přívlač | L03 VO | `activefishing.md` Verification #2 | OK |
| `{AF_CLAIM}` | Pro všechny, kdo milují přívlač | L03 screen | `activefishing.md` Verification #1 | OK |
| `{AF_PLANDAVKY}` | přes 1 300 plandavek (1 340 on 19. 10. 2026) | L03 VO + DISPLAY | `activefishing.md` Verification #3 | **LIVE** |
| `{AF_BENEFIT}` | osobní přístup, rychlé doručení | L03 | activefishing.cz homepage benefits | OK |
| `{MO_CLAIM}` | ručně dělané gumové nástrahy (HANDMADE LURES) | L04 | `moonky.md` Verification #5 | OK |
| `{MO_CNC}` | vlastní formy z CNC strojů | L04 screen | `moonky.md` Verification #2 | OK |
| `{MO_REPRE}` | vyvíjené a testované s českou reprezentací | L04 | `moonky.md` Verification #3 (without „8 let") | OK |
| `{JI_SLOGAN}` | „Jigy, které chytají!" | L05 | `jigovky.md:10` (logo slogan) | CITED |
| `{JI_BARBLESS}` | bezprotihrotové hlavičky od 0,4 g · TroutJig Barbless 0,4–3 g | L05 | `jigovky.md:23` | CITED |
| `{JI_CZ}` | poctivě vyrobeno v ČR | L05 | `jigovky.md:21, 67` (HTML USP) | CITED |
| `{VR_CLAIM}` | Vše na přívlač | L06 | `velkaryba.md:6` | CITED |
| `{VR_MESTO}` / `{VR_ROK}` | Olomouc / od roku 2011 | L06 | `velkaryba.md:26, 29` | CITED |
| `{VR_SHIMANO}` | partner Shimano Rod Test Center; pruty si vyzkoušíte u vody | L06 | `velkaryba.md:35` | CITED |
| `{BO_OBJEM}` | 0,5–0,7 l (the shop's drinking thermoses are 0,6 l) | L07 screen | `BRIEF.md`; `bosset.md:13` | **CONFIRM** |
| `{BO_HODINY}` | horké i studené až 6 hodin | L07 | `bosset.md` Verification #4 | OK (0,6 l lines) |
| `{BO_ZNACKA}` | Zojirushi (name only) | L07 screen | `bosset.md` | OK |
| `{GH_PRODUKT}` | Black Standard Edition (= Revolut 8 · Standard Edition · Black) | L08 | `BRIEF.md`; `gausseholler.md:80` | **CONFIRM** with Igor |
| `{GH_RUCNE}` | ručně stavěný v Česku: karbon, hliník, limitovaná série | L08 | `gausseholler.md` facts 1–2 | CITED |
| `{GH_SERIE}` | série 5 kusů, každý číslovaný | L08 screen | `gausseholler.md` fact 5 | CITED |
| `{GH_TUBUSY}` | 8 karbonových tubusů · Ø 32 mm | L08 screen | `gausseholler.md` fact 4 + carbon-tube-set page | CITED |

Before the final render, rerun Verification for the CITED rows (Jigovky, Velká ryba, Gausse Holler). Then recheck the LIVE and CONFIRM rows.

---

## 4. Lines per unit

### INTRO · master 0.25 → 3.60 (3.35 s)
| | |
|---|---|
| **VO** | Mistrovství České republiky v Trout Area 2026. |
| **TTS** | Mistrovství České republiky v Trout Area dva tisíce dvacet šest. |
| **Přepis** | Mistrovství České republiky v Traut Erija dva tisíce dvacet šest. |
| **SHORT** | Mistrovství České republiky v Trout Area. *(use if the take is > 3.35 s; „2026" stays on screen)* |
| Count | 7 written / 10 spoken → ≈ 3.4 s (tight); SHORT 6 → ≈ 2.1 s |
| On screen | MČR · TA hero · MISTROVSTVÍ ČESKÉ REPUBLIKY / V TROUT AREA · 2026 · 24.–25. 10. 2026 · LÍHEŇ LIBĚCHOV · KOLEKCE PARTNERŮ |

### L01 · LÍHEŇ LIBĚCHOV (místo konání) · master 4.50 → ≤ 10.50 (11.00)
| | |
|---|---|
| **VO** | Hostí nás Líheň Liběchov – pstruží líheň od roku 1934, donedávna nejníže položené pstruhařství v Evropě. |
| **TTS** | Hostí nás Líheň Liběchov – pstruží líheň od roku devatenáct set třicet čtyři, donedávna nejníže položené pstruhařství v Evropě. |
| **Přepis** | (Czech native; no respelling) |
| **SHORT** | Hostí nás Líheň Liběchov – pstruží líheň od roku 1934. *(TTS: …od roku devatenáct set třicet čtyři.)* |
| Count | 15 written / 18 spoken → ≈ 6.2 s (inside the hard limit; if > 6.5 s use SHORT) · SHORT 9 / 12 → ≈ 4.1 s |
| Placeholders | `{MISTO}` · `{LIHEN_ROK}` · `{LIHEN_NADM}` |
| On screen | LIBĚCHOV · lihenlibechov.cz · Dějiště MČR v Trout Area 2026 · 1934 PSTRUŽÍ LÍHEŇ OD ROKU · Malý Sporťáček · 24.–25. 10. |
| Notes | Stress: **LÍ**-heň **LI**-bě-chov. Never „chyť a pusť". „donedávna" is mandatory |

### L02 · TROUTSHOP.EU · master 12.50 → ≤ 18.50 (19.00)
| | |
|---|---|
| **VO** | Troutshop – specialista na pstruhy. Rodinná firma od roku 1999 a generální partner Trout Area Slovakia. |
| **TTS** | Troutshop – specialista na pstruhy. Rodinná firma od roku devatenáct set devadesát devět a generální partner Trout Area Slovakia. |
| **Přepis** | Traut-šop – specialista na pstruhy. Rodinná firma od roku devatenáct set devadesát devět a generální partner Traut Erija Slovakija. |
| **SHORT** | Troutshop – specialista na pstruhy a generální partner Trout Area Slovakia. |
| Count | 15 written / 18 spoken → ≈ 6.2 s · SHORT 11 → ≈ 3.8 s |
| Placeholders | `{TS_CLAIM}` · `{TS_ROK}` · `{TS_PARTNER}` |
| On screen | TROUT / SHOP · troutshop.eu · Milujeme lov pstruhů · Rodinná firma od roku 1999 · Generální partner TA Slovakia · tags VELVET ARTS · NORIES · FISHUP |

### L03 · ACTIVEFISHING.CZ · master 20.50 → ≤ 26.50 (27.00)
| | |
|---|---|
| **VO** | Activefishing – e-shop zrozený z vášně pro přívlač. Přes 1 300 plandavek a osobní přístup. |
| **TTS** | Activefishing – e-shop zrozený z vášně pro přívlač. Přes tisíc tři sta plandavek a osobní přístup. |
| **Přepis** | Ektiv-fišing – í-šop zrozený z vášně pro přívlač. Přes tisíc tři sta plandavek a osobní přístup. |
| **SHORT** | Activefishing – přes 1 300 plandavek a osobní přístup. *(TTS: …přes tisíc tři sta…)* |
| Count | 13 written / 15 spoken → ≈ 5.2 s · SHORT 8 / 10 → ≈ 3.4 s |
| Placeholders | `{AF_ORIGIN}` · `{AF_PLANDAVKY}` (LIVE) · `{AF_BENEFIT}` |
| On screen | ACTIVE / FISHING · activefishing.cz · Pro všechny, kdo milují přívlač · 1 300+ PLANDAVEK · Osobní přístup, rychlé doručení · tags NORIES · KHOR · VELVET ARTS · LUCKY CRAFT · TIMON |
| Notes | Never „vlastní značka" or „jen japonské nástrahy" |

### L04 · MOONKY · master 28.50 → ≤ 34.50 (35.00)
| | |
|---|---|
| **VO** | Moonky – ručně dělané gumové nástrahy pro Trout Area. Vyvíjené a testované s českou reprezentací. |
| **TTS** | Moonky – ručně dělané gumové nástrahy pro Trout Area. Vyvíjené a testované s českou reprezentací. |
| **Přepis** | Múnky – ručně dělané gumové nástrahy pro Traut Erija. Vyvíjené a testované s českou reprezentací. |
| **SHORT** | Moonky – ručně dělané gumové nástrahy, vyvíjené s českou reprezentací. |
| Count | 14 written / 14 spoken → ≈ 4.8 s · SHORT 9 → ≈ 3.1 s |
| Placeholders | `{MO_CLAIM}` · `{MO_REPRE}` |
| On screen | MOONKY · moonky.cz · Ručně dělané gumové nástrahy · Vlastní formy z CNC strojů · Vyvíjeno s českou reprezentací · HANDMADE LURES |
| Notes | „pro Trout Area" is the brand's general claim. Do not add anything that implies use at this MČR (hard baits) |

### L05 · JIGOVKY.CZ · master 36.50 → ≤ 42.50 (43.00)
| | |
|---|---|
| **VO** | Jigovky – jigy, které chytají. Bezprotihrotové hlavičky od 0,4 gramu, poctivě vyrobené v Česku. |
| **TTS** | Jigovky – jigy, které chytají. Bezprotihrotové hlavičky od nula celá čtyři gramu, poctivě vyrobené v Česku. |
| **Přepis** | Džigovky – džigy, které chytají. Bezprotihrotové hlavičky od nula celá čtyři gramu, poctivě vyrobené v Česku. |
| **SHORT** | Jigovky – jigy, které chytají. Poctivě vyrobené v Česku. |
| Count | 13 written / 15 spoken → ≈ 5.2 s · SHORT 8 → ≈ 2.8 s |
| Placeholders | `{JI_SLOGAN}` · `{JI_BARBLESS}` · `{JI_CZ}` |
| On screen | JIGOVKY · jigovky.cz · „Jigy, které chytají!" · FLUO · PINK · GOLD · ORANGE · RED · BEZ PROTIHROTU · TroutJig Barbless 0,4–3 g · Poctivě vyrobeno v ČR |
| Notes | Never „největší výběr" or „vlastní výroba". Never imply the jigs are used at MČR |

### L06 · VELKA-RYBA.CZ · master 44.50 → ≤ 50.50 (51.00)
| | |
|---|---|
| **VO** | Velká ryba – vše na přívlač. Speciálka z Olomouce, kde si pruty Shimano vyzkoušíte přímo u vody. |
| **TTS** | Velká ryba – vše na přívlač. Speciálka z Olomouce, kde si pruty Shimano vyzkoušíte přímo u vody. |
| **Přepis** | Velká ryba – vše na přívlač. Speciálka z Olomouce, kde si pruty Šimano vyzkoušíte přímo u vody. |
| **SHORT** | Velká ryba – vše na přívlač. Speciálka z Olomouce. |
| Count | 16 written / 16 spoken → ≈ 5.5 s · SHORT 8 → ≈ 2.8 s |
| Placeholders | `{VR_CLAIM}` · `{VR_MESTO}` · `{VR_SHIMANO}` |
| On screen | VELKÁ / RYBA · velka-ryba.cz · Vše na přívlač · Olomouc · od roku 2011 · Partner Shimano Rod Test Center · tags SHIMANO · ILLEX · DAIWA |
| Notes | Spoken as „Velká ryba", never „velka-ryba tečka cé zet" |

### L07 · BOSSET.CZ (ceny) · master 52.50 → ≤ 58.50 (59.00)
| | |
|---|---|
| **VO** | Ceny pro vítěze věnuje Bosset – termosky, které udrží nápoj horký i studený až šest hodin. |
| **TTS** | Ceny pro vítěze věnuje Bosset – termosky, které udrží nápoj horký i studený až šest hodin. |
| **Přepis** | Ceny pro vítěze věnuje Boset – termosky, které udrží nápoj horký i studený až šest hodin. |
| **SHORT** | Ceny věnuje Bosset – termosky, horké i studené až šest hodin. |
| Count | 15 written / 15 spoken → ≈ 5.2 s · SHORT 11 → ≈ 3.8 s |
| Placeholders | `{BO_HODINY}` · (screen only: `{BO_OBJEM}` CONFIRM, `{BO_ZNACKA}`) |
| On screen | BOSSET · CENY PRO VÍTĚZE · bosset.cz · Termosky pro vítěze · Horké i studené až 6 h · Termosky Zojirushi 0,5–0,7 l |
| Notes | Do not say „Zojirushi" in the VO (origin and pronunciation risk). If the placings are confirmed, an alternative sentence 1 is „Ceny pro nejlepší tři věnuje Bosset." (CONFIRM) |

### L08 · GAUSSE HOLLER · master 60.50 → ≤ 66.50 (67.00)
| | |
|---|---|
| **VO** | Gausse Holler – stojan na pruty Black Standard Edition. Ručně stavěný v Česku: karbon, hliník, limitovaná série. |
| **TTS** | Gausse Holler – stojan na pruty Black Standard Edition. Ručně stavěný v Česku: karbon, hliník, limitovaná série. |
| **Přepis** | Gaus Holer – stojan na pruty Blek Standard Edyšn. Ručně stavěný v Česku: karbon, hliník, limitovaná série. |
| **SHORT** | Gausse Holler – stojan Black Standard Edition, ručně stavěný v Česku. |
| Count | 16 written / 16 spoken → ≈ 5.5 s · SHORT 10 → ≈ 3.4 s |
| Placeholders | `{GH_PRODUKT}` (CONFIRM) · `{GH_RUCNE}` |
| On screen | GAUSSE / HOLLER · STOJAN NA PRUTY · gausseholler.com · Black Standard Edition · 8× KARBON · Ø 32 MM · HLINÍK · ELOX · REVOLUT 8 · 8 KARBONOVÝCH TUBUSŮ · Ručně stavěno v Česku · Série 5 kusů, každý číslovaný |

### FINALE · A master 68.40 → 70.60 · B 72.20 → 73.80
| | A | B |
|---|---|---|
| **VO** | Děkujeme všem partnerům za podporu. | Uvidíme se u vody! |
| **TTS** | Děkujeme všem partnerům za podporu. | Uvidíme se u vody! |
| Count | 5 → ≈ 1.7 s | 4 → ≈ 1.4 s |
| Delivery | Warm, grateful, slower | Smile, a little lift, a short pause before „u vody" |

On screen: DĚKUJEME / PARTNERŮM · logo wall · TA hero · MISTROVSTVÍ ČR V TROUT AREA 2026 · 24.–25. 10. 2026 · LÍHEŇ LIBĚCHOV · troutareacz.cz · MADE BY ⚙ © 2026 GAUSSE HOLLER.

The date and place are on screen, not in the VO, because the 16 s finale was cut to 7 s. The longer v1 finale line in `script_cs.md` is retired.

---

## 5. Pronunciation (respell in the TTS input only after a failed test render)
| Name | Say | Note |
|---|---|---|
| Troutshop | traut-šop | |
| Activefishing | ektiv-fišing | One word, stress on „ek" |
| Moonky | múnky | |
| Jigovky / jigy | džigovky / džigy | |
| Velká ryba | (Czech) | Never „velka-ryba" |
| Bosset | boset | Not „bosé" |
| Gausse Holler | gaus holer | |
| Black Standard Edition | blek standard edyšn | |
| Trout Area | traut erija | Only if v3 reads „trout área" (test: `vo/test_B_paul_el3.wav`) |
| Trout Area Slovakia | traut erija slovakija | |
| Shimano | šimano | |
| e-shop | í-šop | |
| hard baits | hárd bejts | Not spoken in this cut |
| Líheň Liběchov / Malý Sporťáček | (Czech) | First-syllable stress; „Sporťáček" with a soft ť |
| Zojirushi | zodžiruši | Not spoken in this cut |
| Domains (.cz / .eu / .com) | — | Never spoken |

---

## 6. Production checklist
1. Generate each unit with the TTS line (one `create_speech` call per unit), at the settings in §1.
2. Listen for: brand names (§5), „donedávna" present (L01), numbers read as written words, no English-ised Czech.
3. Trim and normalise. Measure the length with `ffprobe` and compare it with §1.1. Apply the long-take rule if needed.
4. Write the lengths and the chosen line (main or SHORT) into `vo/script_cs.json`. The generator places files at block + 0.50.
5. Mix check in the master: ducking −7 dB, nothing in 70.60–72.20 except the shout, master −14 LUFS / −1 dBTP.
6. Banner check: every B8 / B10 with `_vo` ends its VO ≤ 7.00 local. L6 has no VO.
7. On export day: recheck the LIVE value (`{AF_PLANDAVKY}`). Resolve CONFIRM items (`{BO_OBJEM}`, `{GH_PRODUKT}`) or keep the defaults above.
