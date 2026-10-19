# VO QA – MČR 2026 sponzoři

QA date: 2026-10-19 (17:20 UTC). Voice: Paul – Broadcaster, ElevenLabs eleven_v3 via HeyGen, cs, speed 1.
Files checked: `vo/<key>.wav` (10 files). For the 8 files that were sped up, the originals are kept as `vo/<key>_1x.wav` and `vo/<key>_1x.words.json`.

## Block limits (real grid, not the 8 s / 16 s assumed in the script)

Block lengths come from `audio/track.beats.json` and the plan in `data/content.json`. A bar is about 1.834 s.
**Limit = block length − 1.5 s tail − VO start.** Finale uses the 15 s cap from the brief.

- Sponsor blocks are 4 bars, which is **7.26–7.34 s, not 8 s**. With a 0.25 s start, the limit is 5.51–5.59 s.
- Venue is 5 bars (9.172 s), so its limit is 7.42 s.
- Intro is 8 bars (14.698 s). **Its `voOffset` changed from 1.857 to 1.2 in `data/content.json` at 17:11 UTC, while this QA was running.** At 1.2 the intro limit is 12.00 s (the brief's estimate was about 12.5 s).
- The build warns when the tail is under 0.9 s (`vo.tailMin`). It cuts the audio when the VO runs past the block end.

Because sponsor blocks are 7.3 s, not 8 s, **five 1× files would have been cut by the build**, not three: moonky, jigovky, velkaryba and gausseholler, and intro too at the old 1.857 offset.

## Final table (files now in `vo/`)

| key | block | VO start | limit | 1× dur | atempo | final dur | ends at | tail to block end | vs limit | build | LUFS / dBTP |
|---|---|---|---|---|---|---|---|---|---|---|---|
| intro | 8 bars · 14.698 s | 1.20 | 12.00 | 13.244 | – (not a sponsor block) | 13.244 | 14.44 | 0.25 | **+1.25 over** | warn <0.9 | −16.0 / −1.0 |
| venue | 5 bars · 9.172 s | 0.25 | 7.42 | 8.691 | **1.08** | 8.060 | 8.31 | 0.86 | **+0.64 over** | warn <0.9 | −16.0 / −1.6 |
| troutshop | 4 bars · 7.337 s | 0.25 | 5.59 | 5.721 | **1.026** | 5.582 | 5.83 | 1.51 | OK (−0.005) | ok | −16.0 / −1.1 |
| activefishing | 4 bars · 7.338 s | 0.25 | 5.59 | 6.870 | **1.08** | 6.363 | 6.61 | 0.73 | **+0.78 over** | warn <0.9 | −16.3 / −1.1 |
| moonky | 4 bars · 7.314 s | 0.25 | 5.56 | 7.236 | **1.08** | 6.716 | 6.97 | 0.35 | **+1.15 over** | warn <0.9 (1×: CUT) | −16.1 / −1.1 |
| jigovky | 4 bars · 7.338 s | 0.25 | 5.59 | 8.401 | **1.08** | 7.786 | 8.04 | −0.70 | **+2.20 over** | **CUT** | −16.0 / −1.1 |
| velkaryba | 4 bars · 7.314 s | 0.25 | 5.56 | 7.211 | **1.08** | 6.685 | 6.94 | 0.38 | **+1.12 over** | warn <0.9 (1×: CUT) | −16.0 / −1.1 |
| bosset | 4 bars · 7.315 s | 0.25 | 5.57 | 6.531 | **1.08** | 6.058 | 6.31 | 1.01 | **+0.49 over** | ok | −16.1 / −1.1 |
| gausseholler | 4 bars · 7.261 s | 0.25 | 5.51 | 8.359 | **1.08** | 7.738 | 7.99 | −0.73 | **+2.23 over** | **CUT** | −16.1 / −1.1 |
| finale | 11 bars · 23.983 s (tail) | 0.25 | 15.00 | 10.604 | – | 10.604 | 10.85 | 13.13 | OK | ok | −16.0 / −1.0 |

Total VO is now 78.84 s (it was 82.87 s at 1×).

The speed factor is `min(1.08, duration / limit)`. Only **troutshop** fits with a speed-up alone: at 1.026 it is 5.582 s against a limit of 5.587 s. The other seven sponsor and venue blocks would need 1.17–1.52×, which is far past the natural range. I capped them at 1.08, so they are now as short as atempo can make them, but **they still need a text cut**.

Venue was treated as a sponsor block because it is the partner's ad block (BRIEF: "venue ad"). The intro was not sped up because it is not a sponsor block (see below).

## Blocks that still need a text cut

The word budget is the number of spoken words that fit the limit at the speech rate this voice actually has in each file. Numbers count as read aloud. The script assumed 2.9 words per second. The measured rate is **about 2.0 words/s at 1× and 2.2–2.5 at 1.08×**, so `vo_limit_words: 18` cannot work. **A realistic sponsor budget is about 11 spoken words at 1×, or about 12–13 at 1.08×.** The suggestions below are deletions only, so they make no new claims. The final wording is your decision.

| key | spoken words now | budget at 1.08× | possible cut (spoken words) |
|---|---|---|---|
| gausseholler | 16 | 11 | "Gausse Holler – ručně stavěný stojan na pruty, limitovaná série." (9) |
| jigovky | 15 | 10 | "Jigovky – jigy, které chytají. Poctivě vyrobené v Česku." (8; 0,4 g stays on screen) |
| moonky | 14 | 11 | "Moonky – ručně dělané gumové nástrahy. Testované s českou reprezentací." (9) |
| velkaryba | 16 | 13 | "Velká ryba – vše na přívlač. Pruty Shimano si vyzkoušíte přímo u vody." (12; Olomouc stays on screen) |
| activefishing | 15 | 13 | "Activefishing – e-shop zrozený z vášně pro přívlač. Přes 1 300 plandavek." (12) |
| venue | 18 | 16 | Drop "Hostí nás": "Líheň Liběchov – pstruží líheň od roku 1934, donedávna nejníže položené pstruhařství v Evropě." (16, borderline. Keep "donedávna" per the rules) |
| bosset | 15 | 13 | "… termosky, které udrží nápoj horký až šest hodin." (13, borderline). Or accept it as is: the build is OK with a 1.0 s tail. It only misses the 1.5 s rule. |
| intro | 25 | 22 (at 1×) | This was not sped up. Choose one: (a) atempo 1.08 → 12.26 s plus `voOffset` ≤ 0.93; (b) atempo 1.08 plus drop "hard baits"; (c) at 1×, drop "Čtyřicet závodníků, hard baits." (21 words) |

Regenerating with the cut text at speed 1 will still read at about 2.0 words/s, so stay at or under the 1× budget, or regenerate at HeyGen speed 1.1. Keep about 0.3 s of margin, because eleven_v3 timing varies from take to take.

## Signal checks (all 10 final files)

| check | result |
|---|---|
| Format | All files are 48 kHz mono PCM s16 WAV. |
| Loudness | −16.0 to −16.3 LUFS integrated, LRA 0.6–1.8 LU. |
| Peaks / clipping | True peak −1.0 to −1.6 dBTP. 0 samples at or above −0.01 dBFS. Longest flat top is 2 samples, so no clipping. After atempo, a −0.05 dB trim keeps true peak ≤ −1.0 dBTP. |
| DC | About −0.0005 (−66 dBFS), negligible. |
| Lead / tail silence | Lead 0.025–0.06 s. Atempo shortens the lead by about 20 ms. Tail 0.002–0.056 s. |
| Internal pauses | Longest pauses are at punctuation and sound natural: intro 0.52 s (after "Liběchov."), jigovky 0.40 s (after "gramu,"), venue 0.39 s (after "1934,"). There are no unexpected gaps. |
| Noise floor in pauses | −56 to −57 dBFS RMS, from the TTS room tone raised by the +4 dB gain. It is inaudible under music. |
| Dropouts | None. |
| Clicks / discontinuities | None. The isolated high-frequency spikes the detector finds are glottal pulses repeating about every 9 ms, and they are already in the raw MP3s. bosset has the most (68), from vocal fry in the voice itself, not a defect. Atempo added no new events: the strongest new ones are under −30 dB and fall inside the pulse trains. |
| Spectrum | The ~16 kHz cutoff comes from the MP3 source (energy above 16 kHz is −87 dB). 99.9 % of energy is below 7.5–9 kHz. No 50/60 Hz hum. Faint steady tones in the pauses are at −67 dBFS or lower (bosset 1.58 kHz, venue 1.2 kHz, both already in the raw files), so they are inaudible in the mix. Spectrograms: `vo/qa/<key>.spec.png` (final) and `vo/qa/<key>_1x.spec.png`. |
| Word timing | In `<key>.words.json`, `words` and `words_tts` are scaled by 1/tempo. `word_timestamps_raw` is unchanged, and new fields `tempo` and `duration_1x_s` were added. The envelope cross-check between 1× and final files agrees within 15 ms. `scripts/lib/vo.mjs` reads all 10 files (aligned = true, word counts unchanged). |

### Glitch: truncated last word (source side)

**HeyGen cuts the audio at its `<end>` timestamp before the final phoneme has died away.** You can see it in the raw MP3 spectrograms: harmonics stay at full strength right up to the last sample. The processing added a 20 ms fade, which prevents a click but not the chopped sound.

| key | last word | raw level in the last 10 ms | verdict |
|---|---|---|---|
| velkaryba | "vody." | −20 dBFS | truncated |
| troutshop | "devět." | −23 dBFS | truncated |
| venue | "Evropě." | −28 dBFS | truncated |
| finale | "vody." | −30 dBFS | truncated |
| bosset | "hodin." | −32 dBFS | truncated |
| moonky | "reprezentací." | −41 dBFS | mildly truncated |
| intro, gausseholler, jigovky | – | −53 to −75 dBFS | natural decay |
| activefishing | "přístup." | −32 dBFS burst | The "25 ms click" removed in processing is most likely the cut-off release of the final "p". Removing it leaves an unreleased "p", which is acceptable. |

How to fix: when you regenerate the blocks above that need a cut, add a trailing pause to the end of the TTS text, for example "…". After processing, check that the last 30 ms of each raw file is below −50 dBFS. **troutshop and finale need no regeneration for timing**, so for those two either regenerate just for the ending, or use a 60–80 ms fade-out as a stopgap.

## Files changed by this QA

- `vo/<key>.wav` was rebuilt for venue, troutshop, activefishing, moonky, jigovky, velkaryba, bosset and gausseholler: atempo, then a −0.05 dB trim on all but venue, then 48 kHz s16 with TPDF dither.
- The originals were moved to `vo/<key>_1x.wav`, and their timing files copied to `vo/<key>_1x.words.json`. The build ignores both because it only loads `vo/<key>.*`.
- `vo/<key>.words.json` was rescaled for those 8 keys.
- `vo/durations.json` was updated to the final durations.
- Spectrograms were added in `vo/qa/`.

To revert a block, rename `<key>_1x.wav` and `<key>_1x.words.json` back to `<key>.wav` and `<key>.words.json`.

Scripts are in `/tmp/claude-0/-home-user-Clipcreator/71aa791e-2b52-549a-940d-d7fdf5b83edd/scratchpad/qa/`: `qa.py` (measurements), `clicks.py`, `limits.py` and `apply_tempo.py`.
