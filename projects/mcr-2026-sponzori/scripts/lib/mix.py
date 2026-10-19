#!/usr/bin/env python3
"""Deterministic broadcast mix for the MČR 2026 sponsor film / blocks / Reels (called by scripts/build.mjs).

  python3 scripts/lib/mix.py <spec.json>      → writes spec["out"] (WAV 48 kHz stereo PCM_16) + prints a JSON report

spec = {
  "out": "/abs/mix.wav",
  "dur": 119.131,                                   # output length (s)
  "music": {"src": "/abs/track_A.wav", "start": 0.0, "fadeIn": 0.0, "fadeOut": 0.0},   # slice [start, start+dur] of the track
  "vo": [{"src": "/abs/vo/venue.wav", "at": 14.948, "dur": 8.98}],                      # placed at output time `at`, cut to `dur`
  "duck": {"depth": -7.0, "attack": 0.12, "release": 0.30, "hold": 0.22, "lookahead": 0.12, "thresh": -42.0, "carve": -2.5},
  "master": {"lufs": -14.0, "tp": -1.5}
}

Signal flow (all offline, numpy; no randomness → bit-identical output for the same inputs):
  music slice ─ linear fades ─┬─ × duck gain (sidechain envelope from the VO bus) ─┐
                              └─ presence carve (1–4 kHz, zero-phase) × envelope ─┘
  VO files (mono → L=R) placed on the output timeline ─────────────────────────────┴─ sum ─ gain to target LUFS ─ true-peak limiter
Sidechain: VO bus RMS (10 ms) above `thresh` dBFS = speech; hold `hold` s; the duck starts `lookahead` s before each onset so the music
is already down when the first syllable lands; gain slews in dB: down `depth` in `attack` s, back up in `release` s.
Loudness: ITU-R BS.1770-4 integrated (pyloudnorm), true peak = 4× oversampled peak; the pre-gain is iterated so the integrated
loudness after the limiter lands on the target (±0.05 LU).
"""
import json, sys
import numpy as np
import soundfile as sf
import pyloudnorm as pyln
from scipy.signal import resample_poly, butter, sosfiltfilt
from scipy.ndimage import minimum_filter1d, uniform_filter1d, maximum_filter1d

SR = 48000


def load(path, sr=SR):
    x, r = sf.read(path, dtype='float64', always_2d=True)
    if r != sr:
        x = resample_poly(x, sr, r, axis=0)
    return x


def tp_db(x):
    """true peak (dBTP) = 4× oversampled sample peak over all channels"""
    up = resample_poly(x, 4, 1, axis=0)
    return 20 * np.log10(max(np.max(np.abs(up)), 1e-9))


def tp_env(x):
    """per-sample true-peak envelope (max over channels of the 4× oversampled |x|, folded back to SR)"""
    up = np.abs(resample_poly(x, 4, 1, axis=0)).max(axis=1)
    n = x.shape[0]
    up = up[: n * 4].reshape(n, 4).max(axis=1)
    return up


def limiter(x, ceil_db, look=0.025, smooth=0.010):
    """brick-wall true-peak limiter: gain = moving average (smooth) of the moving minimum (look ± window) of the needed gain.
    Because the minimum window is wider than the averaging window, the gain at every peak is ≤ what that peak needs."""
    c = 10 ** (ceil_db / 20)
    need = np.minimum(1.0, c / np.maximum(tp_env(x), 1e-9))
    if need.min() >= 1.0:
        return x, 0.0
    g = minimum_filter1d(need, size=int(look * SR) * 2 + 1, mode='nearest')
    g = uniform_filter1d(g, size=int(smooth * SR) | 1, mode='nearest')
    g = np.minimum(g, need)   # safety (edge effects of the average)
    return x * g[:, None], float(20 * np.log10(g.min()))


def vo_activity(vo_bus, n_ctl, D):
    """speech activity on 1 kHz control steps: 10 ms RMS of the VO bus over `thresh`, + `hold` after, + `lookahead` before"""
    hop = SR // 1000
    p = uniform_filter1d(vo_bus[:, 0] ** 2, size=int(0.010 * SR), mode='constant')
    rms_db = 10 * np.log10(np.maximum(p[::hop][:n_ctl], 1e-12))
    rms_db = np.pad(rms_db, (0, max(0, n_ctl - rms_db.size)), constant_values=-120)
    act = rms_db > D.get('thresh', -42.0)
    # hold after speech (bridges the gaps between words → no pumping inside a phrase), pre-roll before speech (lookahead)
    hold = int(D.get('hold', 0.22) * 1000)
    look = int(D.get('lookahead', 0.12) * 1000)
    if hold > 0:
        act = maximum_filter1d(act.astype(np.uint8), size=hold + 1, origin=hold // 2).astype(bool)      # extends forward in time
    if look > 0:
        act = maximum_filter1d(act.astype(np.uint8), size=look + 1, origin=-(look // 2)).astype(bool)   # extends backward in time
    return act


def duck_env(act, depth, dur_n, D):
    """sidechain gain envelope in dB (0 = no duck, depth[i] = full duck at control step i), slewed so that every duck takes
    exactly `attack` s down and `release` s back up (sidechain-style), interpolated from 1 kHz control rate to samples"""
    hop = SR // 1000
    tgt = np.where(act, depth, 0.0)
    na, nr = D.get('attack', 0.12) * 1000, D.get('release', 0.30) * 1000
    g = np.empty_like(tgt)
    cur, span = 0.0, 1.0
    for i, t in enumerate(tgt):
        if t < cur:                       # attack: full depth of this duck in `attack`
            span = max(span, -t) if cur < 0 else -t
            cur = max(t, cur - span / na)
        elif t > cur:                     # release: the depth we are coming back from, in `release`
            cur = min(t, cur + span / nr)
        g[i] = cur
    xs = np.arange(dur_n) / hop
    return np.interp(xs, np.arange(tgt.size), g)


def music_bus(mus, band, gdb, depth_s, carve_s):
    """ducked music: broadband gain + presence dip (1–4 kHz band subtracted, zero phase) following the same envelope"""
    g = 10 ** (gdb / 20)
    out = mus * g[:, None]
    if band is not None:
        k = (1 - 10 ** (carve_s / 20)) * np.clip(gdb / np.minimum(depth_s, -1e-6), 0, 1)
        out = out - band * (k * g)[:, None]
    return out


def main(spec_path):
    S = json.load(open(spec_path))
    n = int(round(S['dur'] * SR))
    rep = {'out': S['out'], 'dur': S['dur']}
    # ---- music slice ----
    M = S['music']
    tr = load(M['src'])
    a = int(round(M.get('start', 0) * SR))
    mus = np.zeros((n, 2))
    seg = tr[a:a + n]
    mus[: seg.shape[0], : seg.shape[1]] = seg[:, :2] if seg.shape[1] >= 2 else np.repeat(seg, 2, axis=1)
    fi, fo = M.get('fadeIn', 0) or 0, M.get('fadeOut', 0) or 0
    if fi > 0:
        k = int(fi * SR); mus[:k] *= np.linspace(0, 1, k, endpoint=False)[:, None]
    if fo > 0:
        k = int(fo * SR); mus[n - k:] *= np.linspace(1, 0, k)[:, None]
    # ---- VO bus ----
    vo = np.zeros((n, 2))
    vg = 10 ** (S.get('voGain', 0.0) / 20)
    for v in S.get('vo', []):
        x = load(v['src'])
        x = x.mean(axis=1) if x.shape[1] > 1 else x[:, 0]
        s = int(round(v['at'] * SR)); k = min(x.size, int(round(v['dur'] * SR)), n - s)
        if k <= 0:
            continue
        seg = x[:k].copy()
        f = min(k, int(0.012 * SR)); seg[k - f:] *= np.linspace(1, 0, f)   # 12 ms de-click if the VO is cut
        vo[s:s + k] += seg[:, None] * vg
    # ---- sidechain duck + presence carve (adaptive per VO clip within the allowed range) ----
    D = S.get('duck', {})
    hop = SR // 1000
    n_ctl = int(np.ceil(n / hop)) + 1
    act = vo_activity(vo, n_ctl, D)
    on = np.repeat(act, hop)[:n]
    meter = pyln.Meter(SR)
    d0, c0 = float(D.get('depth', -7.0)), float(D.get('carve', 0.0))
    dmin, dmax = D.get('depthRange', [d0, d0])          # e.g. [-8, -6]: never deeper than -8 dB, never shallower than -6 dB
    cmin = float(D.get('carveMax', c0))                  # deepest presence dip allowed (e.g. -4.5)
    goal = D.get('voOver')                               # target VO-over-music (LU) per clip
    band = sosfiltfilt(butter(2, [1000, 4000], btype='bandpass', fs=SR, output='sos'), mus, axis=0) if c0 < 0 else None
    clips = []
    for v in S.get('vo', []):
        a0 = int(round(v['at'] * SR)); a1 = min(n, a0 + int(round(v['dur'] * SR)))
        if a1 - a0 > SR // 2:
            clips.append([a0, a1, d0, c0, 0.0])

    def build(clips):
        dep = np.full(n_ctl, d0); car = np.full(n_ctl, c0)
        pad0 = int(D.get('lookahead', 0.12) * 1000) + 30; pad1 = int(D.get('hold', 0.22) * 1000) + 30
        for a0, a1, dd, cc, _ in clips:
            i0, i1 = max(0, a0 // hop - pad0), min(n_ctl, a1 // hop + pad1)
            dep[i0:i1] = dd; car[i0:i1] = cc
        gdb = duck_env(act, dep, n, D)
        xs = np.arange(n) / hop
        return music_bus(mus, band, gdb, np.interp(xs, np.arange(n_ctl), dep), np.interp(xs, np.arange(n_ctl), car)), gdb

    def diffs(out_m):
        r = []
        for a0, a1, *_ in clips:
            m = on[a0:a1]
            r.append(meter.integrated_loudness(vo[a0:a1][m]) - meter.integrated_loudness(out_m[a0:a1][m]) if m.sum() > SR // 2 else None)
        return r

    out_m, gdb = build(clips)
    if goal is not None and clips:
        for c, df in zip(clips, diffs(out_m)):
            if df is None:
                continue
            need = goal - df                                # LU still missing (+) or spare (−) at the default depth
            c[2] = float(np.clip(d0 - need, dmin, dmax))
            rest = need - (d0 - c[2])                       # what the broadband duck could not give → deeper presence dip
            c[3] = float(np.clip(c0 - 1.5 * max(0.0, rest), cmin, c0))
        out_m, gdb = build(clips)
        # VO first: a clip that still misses the goal at the deepest allowed duck + dip gets a small lift (≤ voLiftMax dB)
        lift = float(D.get('voLiftMax', 0.0))
        for c, df in zip(clips, diffs(out_m)):
            if df is not None and df < goal - 0.2 and lift > 0:
                c[4] = float(min(lift, goal - df))
                vo[c[0]:c[1]] *= 10 ** (c[4] / 20)
    mix = out_m + vo
    # ---- loudness to target + true-peak limiter (iterate so the limited mix lands on target) ----
    T = S.get('master', {})
    tgt, ceil = T.get('lufs', -14.0), T.get('tp', -1.5)
    L0 = meter.integrated_loudness(mix)
    pre = tgt - L0
    for it in range(6):
        y, gr = limiter(mix * 10 ** (pre / 20), ceil)
        L = meter.integrated_loudness(y)
        if abs(L - tgt) <= 0.05:
            break
        pre += tgt - L
    tp = tp_db(y)
    if tp > ceil:      # numerical safety
        y *= 10 ** ((ceil - tp - 0.02) / 20); tp = tp_db(y); L = meter.integrated_loudness(y)
    # TPDF dither to 16 bit (seeded → deterministic)
    rng = np.random.default_rng(1234)
    d = (rng.random(y.shape) - rng.random(y.shape)) / 32768.0
    sf.write(S['out'], np.clip(y + d, -1, 1 - 1 / 32768), SR, subtype='PCM_16')
    # ---- report: VO vs ducked music (both after the master gain) ----
    gm = 10 ** (pre / 20)
    rep.update(lufs=round(L, 2), tp=round(tp, 2), preGain=round(pre, 2), limiterMaxGR=round(gr, 2), musicLufsRaw=round(L0, 2))
    if on.any() and on.sum() > SR * 0.5:
        vo_l = meter.integrated_loudness(vo[on] * gm)
        mu_l = meter.integrated_loudness(out_m[on] * gm)
        mu_free = meter.integrated_loudness(mus[~on] * gm) if (~on).sum() > SR * 0.5 else None
        rep.update(voLufs=round(vo_l, 2), musicUnderVoLufs=round(mu_l, 2), voOverMusic=round(vo_l - mu_l, 2),
                   musicNoVoLufs=None if mu_free is None else round(mu_free, 2), voActive=round(on.sum() / SR, 2))
    # per VO clip: VO vs the ducked music under it (short clips: momentary-gated loudness via pyloudnorm needs ≥ 0.4 s)
    segs = []
    for v in S.get('vo', []):
        a0 = int(round(v['at'] * SR)); a1 = min(n, a0 + int(round(v['dur'] * SR)))
        m = on[a0:a1]
        if m.sum() < SR * 0.5:
            continue
        vl = meter.integrated_loudness(vo[a0:a1][m] * gm); ml = meter.integrated_loudness(out_m[a0:a1][m] * gm)
        cl = next((c for c in clips if c[0] == a0), None)
        segs.append({'at': round(v['at'], 2), 'vo': round(vl, 1), 'music': round(ml, 1), 'diff': round(vl - ml, 1),
                     'duck': None if cl is None else round(cl[2], 2), 'carve': None if cl is None else round(cl[3], 2), 'voLift': None if cl is None else round(cl[4], 2)})
    rep['segments'] = segs
    print(json.dumps(rep))


if __name__ == '__main__':
    main(sys.argv[1])
