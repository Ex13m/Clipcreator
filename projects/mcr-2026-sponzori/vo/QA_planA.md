# VO QA – plan A (MČR 2026 sponzoři)

Date: 2026-10-19, 19:00 UTC. Track `audio/track_A.wav`, blocks from `data/block_plan_A.json`.
Voice: Paul – Broadcaster (`02733a92a0db457aadf63b235d2aa457`), ElevenLabs eleven_v3 via HeyGen, cs, speed 1.

**Rule:** the VO starts 0.25 s into the block (intro: 0.5 s) and must end at least 1.0 s before the block ends.
So the limit is the block length minus the start offset minus 1.0 s.

## Final table (files now in `vo/`)

| key | take | block | VO start | limit | duration | speed | ends at | tail (to block end) | last 30 ms | LUFS / dBTP | ending |
|---|---|---|---|---|---|---|---|---|---|---|---|
| intro | 1 | 8 bars · 14.698 | 0.50 | 13.198 | **13.185** | **1.004** | 13.685 | 1.01 | −41.6 | −16.1 / −1.1 | natural decay (not regenerated) |
| venue | 2 | 6 bars · 11.006 | 0.25 | 9.756 | **8.981** | 1× | 9.231 | 1.78 | −80.4 | −16.0 / −2.1 | new take, still cut in the final "ě". It has an 80 ms synthetic decay and a 120 ms fade (see below) |
| troutshop | 2 | 5 bars · 9.172 | 0.25 | 7.922 | **5.603** | 1× | 5.853 | 3.32 | −60.0 | −16.2 / −1.03 | new take: "devět" decays naturally, and the final t-release is kept and faded |
| activefishing | 1 | 5 bars · 9.149 | 0.25 | 7.899 | **6.870** | 1× | 7.120 | 2.03 | −58.6 | −16.1 / −1.03 | unchanged (the "p" is unreleased, as accepted in QA.md) |
| moonky | 1 | 5 bars · 9.172 | 0.25 | 7.922 | **7.236** | 1× | 7.486 | 1.69 | −52.7 | −16.0 / −1.03 | take 1 reprocessed with the 120 ms fade. Take 2 was worse (see below) |
| jigovky | 1 | 5 bars · 9.148 | 0.25 | 7.898 | **7.897** | **1.065** | 8.147 | 1.00 | −58.3 | −16.0 / −1.1 | natural decay |
| velkaryba | 1 | 5 bars · 9.126 | 0.25 | 7.876 | **7.291** | 1× | 7.541 | 1.59 | −69.5 | −16.1 / −1.04 | **STOPGAP**: take 1 with an 80 ms synthetic decay and a 120 ms fade. The new take 2 could not be downloaded (see below) |
| bosset | 2 | 5 bars · 9.125 | 0.25 | 7.875 | **6.610** | 1× | 6.860 | 2.27 | −79.5 | −16.0 / −1.2 | new take, natural decay to −57 dB |
| gausseholler | 1 | 5 bars · 9.072 | 0.25 | 7.822 | **7.812** | **1.071** | 8.062 | 1.01 | −45.4 | −16.3 / −1.1 | natural decay |
| finale | 2 | 13 bars · 23.983 | 0.25 | 22.733 | **10.654** | 1× | 10.904 | 13.08 | −59.4 | −16.0 / −1.03 | new take: "vody." decays to −45 dBFS at the raw end, then the 120 ms fade |

All 10 files fit plan A. Total VO is 82.14 s.
Every file is 48 kHz mono PCM s16. Loudness is −16.0 to −16.3 LUFS and true peak is ≤ −1.0 dBTP.

**QA check (19:10).** Measured with the BS.1770 4× true-peak filter, troutshop, activefishing, moonky, velkaryba and finale were at −0.98 dBTP; ffmpeg rounds this to −1.0. Each of these files got a −0.05 dB trim with TPDF dither, so they are now ≤ −1.03 dBTP (the table above has the new values). Length and sample count are unchanged, and words.json still applies.
`scripts/lib/vo.mjs` loads all 10 files with offsets 0.5 (intro) and 0.25 (the rest): aligned = true, the word counts are unchanged, and numbers are still grouped ("1999.", "24.", "1 300", "0,4").

**jigovky (1.00 s) and gausseholler (1.01 s) have no margin left.** If the build measures block length differently from `block_plan_A.json` (for example from beats), recheck these two.

## What was done

1. **1× restored.** For the 8 keys that had `_1x` files, the 1× version is the base again. The atempo versions moved to `prev/<key>.t108.*`; for troutshop that is `prev/troutshop.t1026.*`.
2. **Regenerated** velkaryba, troutshop, venue, finale, bosset and moonky. Each got one `create_speech` call: the approved `.tts` text from `script_cs.json` followed by " …", engine elevenlabs, `model_id` eleven_v3, cs, speed 1. There were no retries. The request IDs and URLs are in `raw/tts_responses_planA.json`. Words are aligned to the `.cs` text in the same way as before. The "…" token is excluded, and the text actually sent is stored as `tts_sent`.
3. **Processing** used the same chain as `process.py`, with a different ending:
   - The trim keeps no more than 0.06 s before the first audible sample and 0.08 s after the last one.
   - The last word keeps its natural decay, with a **120 ms** fade-out instead of 20 ms.
   - Two-pass loudnorm to −16 LUFS and −1 dBTP, then 48 kHz mono s16.
   - The script is in the scratchpad at `vo2/process_v2.py`.
4. **Fitting to plan A.** Atempo was applied only where a file was over its limit:
   - jigovky: 1.065 (needed 1.0637)
   - gausseholler: 1.071 (needed 1.0687)
   - intro: 1.004 (needed 1.0035)

   The factor is rounded up to 0.001 and raised by 0.001 at a time while atempo output was still over the limit. A −0.05 dB trim keeps true peak ≤ −1 dBTP, followed by TPDF dither. Word times are divided by the tempo factor, and the `tempo` and `duration_1x_s` fields are added. The 1× originals are in `prev/<key>.1x.*`.

## How well the " …" fix worked

| key | where HeyGen cut the new take | result |
|---|---|---|
| bosset | 2.0 s after "hodin." | **fixed**: full natural decay |
| troutshop | 0.24 s after "devět." | **fixed**: vowel decays to −78 dB; the t-release (or breath onset) at the very end is faded |
| finale | 0.20 s after "vody." | **fixed** (mostly): decay reaches −45 dBFS at the raw end |
| venue | 0.11 s after the "…" timestamp, inside the "ě" that follows the p closure (−34.5 dBFS) | **not fixed** (take 1: −28 dBFS) |
| moonky | 0.036 s after "…"; the final "í" lasts only 115 ms, cut at −31 dBFS | **worse than take 1** (−41 dBFS, "í" 215 ms) |
| velkaryba | 0.20 s after "vody.", which looks good on the timestamps | **not ingested**: the bridge upload to Drive was denied by the session permission classifier ("Data Exfiltration"), and a direct download returns 403 from the proxy |

**Synthetic decay** (used for venue and the velkaryba stopgap):
- The method continues the last pitch period found with YIN (venue 69 Hz, velkaryba 80 Hz), cross-faded over one period. It then decays exponentially by −40 dB over 80 ms, and the 120 ms fade goes on top.
- There is no click at the join: the strongest transients nearby are the voice's own glottal pulses, 14 and 32 ms earlier.
- Spectrograms of the final tails: `qa/planA_tails.png`. The alternatives (venue take 2 without the extension, moonky take 2 and take 2 with the extension, velkaryba take 1 without the extension): `qa/planA_tails_alt.png`.

## Still open

- **velkaryba take 2** was generated but never downloaded (request `AxmCfpYsdOaYJZy2xWpy`, URL in `raw/tts_responses_planA.json`). No new TTS is needed: run bridge steps 2a and 2b for that URL, then process it with the same chain (`process_v2.py`). The new take is 6.844 s raw, so it fits easily.
- **venue / moonky:** if the synthetic decay or the 120 ms fade sounds wrong when listened to, regenerate with a longer pause, for example `<break time="0.5s"/>` before the end (HeyGen accepts break tags in seconds). That needs a new TTS call. Listen to the A/B files in `prev/` first.
- **Build config:** `data/content.json` still uses the old plan (`track.wav`, intro `voOffset` 1.2). Plan A needs intro `voOffset` **0.5** and 0.25 for every other block. The intro VO is fitted to 0.5. This QA did not change `content.json`.

## Files

- `vo/<key>.wav` and `vo/<key>.words.json` are the final files. `vo/durations.json` is updated. New raw files for the take-2 keys are in `vo/raw/<key>.mp3`.
- `vo/prev/`:
  - `<key>.take1.*`: the previous 1× base of each regenerated block
  - `<key>.t108.*` and `troutshop.t1026.*`: the old atempo versions
  - `<key>.1x.*`: the 1× originals of the files that got atempo now
  - `venue.take2.*`: venue take 2 without the extension
  - `moonky.take2.*` and `moonky.take2ext.*`: moonky take 2, plain and extended
  - `raw/<key>.take1.mp3` and `raw/moonky.take2.mp3`: raw files
- `vo/QA.md` describes the old 4-bar plan; its `_1x` revert notes no longer apply.

## velkaryba take 2 (19. 10., main loop)
New take ingested via bridge (Drive id 1VhjLck8kNqGIkJ0h1UXWQElP5zk0Xs4H), natural ending (raw cut −51 dBFS), 6.80 s, 1×, −16.3 LUFS / ≤ −1.0 dBTP (−0.05 dB trim). Previous temporary take → vo/prev/velkaryba.take1ext.*

## take 3 (names) — 19. 10.

The operator approved the respelled brand names ("вроде ок"): Traut érija, Traut šop, Ektiv fišing, Múnky, Džigovky/džigy, Boset, Gaus Holer Kastom Lab, em čé er, Revolut osm, hárd bejts, í-šop. New texts for bosset (no exclusive "Ceny pro vítěze věnuje"), gausseholler (main prize Revolut 8, "Lab" read "lab") and finale ("a ceny pro závodníky"). One `create_speech` call per key (Paul – Broadcaster, elevenlabs eleven_v3, cs, speed 1). The text sent = `vo.tts` + " …". Responses are in `raw/tts_responses_take3.json`. Ingest went through the bridge (Zapier → Drive `_zdroje` → Drive download); md5 verified for all 8.

| key | request | raw s | raw cut dBFS | tail fix | 1× s | atempo | final s | limit s | VO ends s | gap to block end s | I LUFS | TP dBTP | last 30 ms dBFS | words | previous → prev/ |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| intro | W1IM0GztkN2fAKjSHVOb | 13.949 | -43.9 | — | 13.930 | 1.056 | 13.182 | 13.198 | 13.682 | 1.016 | -16.0 | -1.05 | -49.9 | 22 | `prev/intro.take1.*` |
| troutshop | 6bsA93gvctyBuwAM3zcw | 6.191 | -47.0 | — | 6.096 | 1 | 6.096 | 7.922 | 6.346 | 2.826 | -16.1 | -1.05 | -82.3 | 9 | `prev/troutshop.take2.*` |
| activefishing | M0IjSltjSRJnprZUAI0E | 6.609 | -34.7 | — | 6.496 | 1 | 6.496 | 7.899 | 6.746 | 2.403 | -16.1 | -1.05 | -85.6 | 14 | `prev/activefishing.take1.*` |
| moonky | 4PRb8vFzGNkWLkB6DBmQ | 7.314 | -29.0 | ext 0.08 s (f0 83.5 Hz) | 7.384 | 1 | 7.384 | 7.922 | 7.634 | 1.538 | -16.1 | -1.05 | -76.1 | 14 | `prev/moonky.take1v2.*` |
| jigovky | FF0E3ou8eK3fl0yzk5hJ | 8.438 | -27.4 | ext 0.08 s (f0 99.3 Hz) | 8.493 | 1.076 | 7.877 | 7.898 | 8.127 | 1.021 | -16.0 | -1.05 | -55.9 | 13 | `prev/jigovky.take1.*` |
| bosset | fuWj7FYIEWLSJIMGMHVT | 6.844 | -22.3 | ext 0.08 s (f0 80.5 Hz) | 6.899 | 1 | 6.899 | 7.875 | 7.149 | 1.976 | -16.0 | -1.05 | -68.9 | 14 | `prev/bosset.take2.*` |
| gausseholler | 1ktIQzUbcBebHEOqHtbO | 8.046 | -59.4 | raw cut at 5.92 s (artefact removed), b-release kept | 5.870 | 1 | 5.870 | 7.822 | 6.120 | 2.952 | -16.1 | -1.05 | -81.0 | 13 | `prev/gausseholler.take1.*` |
| finale | tFZCRdLsCufNkDOB6Euo | 12.669 | -47.8 | — | 12.640 | 1 | 12.640 | 22.733 | 12.890 | 11.093 | -16.0 | -1.05 | -68.5 | 25 | `prev/finale.take2.*` |

All files are 48 kHz mono s16. VO starts at 0.25 s (intro 0.5 s), and every block ends its VO at least 1.0 s before the block end. TP is measured to 0.01 dB (`loudnorm` `input_tp`). The build (`node scripts/build.mjs`, film 119.131 s) prints no VO warnings ("!" / CUT), and all 10 blocks report "aligned words".

Notes:
- **" …" trick, take 3:** intro, troutshop, finale and activefishing end naturally (intro reaches −44 dBFS at the raw end, and the fade covers the rest). moonky ("-cí", −29 dBFS), jigovky ("Česku", −27) and bosset ("hodin", −22) are cut mid-sound, so each gets an 80 ms synthetic decay (YIN period continuation, −40 dB). There is no click at the join: HF energy there is at or below the surrounding voice. Spectrograms: scratchpad `vo3/viz/tails_raw1.png`, `tails_raw2.png`, `tails_proc.png`.
- **gausseholler artefact:** after "Lab." HeyGen produced about 2 s of a steady low-frequency rumble (~30–35 Hz, −61 dBFS; the 1–3 kHz band is ~30 dB lower), then the onset of a new loud vocalisation (−10 dBFS, 7.73–8.05 s raw). The raw is truncated at 5.92 s (`raw_end_s`, new option in `process_v2.py`), and the "b" release at 5.82 s is kept (`keep_tail`). Result: 5.87 s at 1×.
- **activefishing:** the burst after the "p" closure of "přístup" (6.57 s raw) is dropped, as `speech_bounds` does by default. It is cut off by the raw end, and its low zero-crossing rate marks a voiced onset, not aspiration.
- **atempo:** intro 1.056 (13.930 → 13.182 s, limit 13.198) and jigovky 1.076 (8.493 → 7.877 s, limit 7.898). The 1× originals are `prev/<key>.take3.1x.*`. Word times are divided by the factor.
- **Alignment:** `process_v2.py` now maps TTS respellings back to the on-screen `vo.cs` tokens (`RESPELL`). One cs token may absorb 1–4 TTS words, e.g. MČR ← "em čé er" and Troutshop ← "Traut šop", and `words[].spoken` keeps what was said. For all 8 keys the token lists equal `vo.cs` and the times are monotonic.
- **script_cs.json:** `vo.tts` = `vo.respell` = the approved respelled text (without the trailing " …"). `_pending` is removed and the pronunciation table is updated.
- **Archived:** `prev/intro.take1` (atempo 1.004), `prev/troutshop.take2`, `prev/activefishing.take1`, `prev/moonky.take1v2` (take 1, process_v2 version; `prev/moonky.take1` is the older process.py version), `prev/jigovky.take1` (atempo 1.065), `prev/bosset.take2`, `prev/gausseholler.take1` (atempo 1.071) and `prev/finale.take2`. Raw files went to `prev/raw/<key>.take<N>.mp3`.

### take 3 — independent QA (19. 10.)
- **Pass, all 8 keys.** Format 48 kHz mono s16. Loudness: ebur128 −16.0…−16.1 LUFS, pyloudnorm −16.05…−16.21 LUFS. True peak (4× oversampled) −1.04…−1.05 dBTP. Durations equal `durations.json` and stay under the plan-A limits (closest: intro 13.182/13.198, jigovky 7.877/7.898).
- **Tails (last 400–700 ms, envelope + spectrogram).** Every final word is present and ends in a decay or fade, with the last 30 ms between −50 and −86 dBFS. moonky keeps ~190 ms of "-cí", jigovky keeps the k-release plus ~110 ms of "u", and bosset keeps the full "n" murmur. At the 80 ms extension joins, HF (>5 kHz) energy stays between −54 and −65 dB, with no click.
- **bosset:** at 6.78–6.80 s there is a faint HF tick (≥4 kHz, −50 dB under a −20 dB voice). It is also in the HeyGen raw and was not introduced by processing. Inaudible under music.
- **`vo.mjs`:** all 10 files load as aligned; tokens equal the `vo.cs` tokens and the times are monotonic. Block cues resolve (`v Trout`, `25`, `1999`, `Přes`, `reprezentací`, `Bezprotihrotové`, `šest`, `24.`, `Revolut`, …). The exception is the **gausseholler placeholder block**: it still queries `Black` / `Ručně` / `karbon` / `limitovaná`, none of which the new text contains, so the block falls back to its default times. Its on-screen copy ("Black Standard Edition", chips) also no longer matches the VO (Revolut 8, Custom Lab). This needs fixing in the block, not in the VO.
- **Build:** re-run with stderr captured: no `!`/CUT lines, and all 10 blocks report aligned words.
- **Archives:** `prev/<key>.<take>.*` and `prev/raw/*` are byte-identical to the HEAD versions they replace.
- **Review file:** `vo/VO_all_take3.m4a` contains all 10 VO files in film order with 0.7 s gaps (AAC 128k, 48 kHz mono, 88.53 s, 0-sample offset against PCM). Segment starts: intro 0.000, venue 13.882, troutshop 23.563, activefishing 30.360, moonky 37.555, jigovky 45.640, velkaryba 54.217, bosset 61.716, gausseholler 69.315, finale 75.886 s.
