#!/usr/bin/env python3
"""MČR 2026 · music re-edit from the source song with a phase-consistent beat grid.

    python3 scripts/music_edit.py data/block_plan_B.json          # → audio/track_B.wav + audio/track_B.beats.json
    python3 scripts/music_edit.py data/block_plan_B.json --grid   # (re)analyse the source grid only → music/<src>.grid.json

1. SOURCE GRID (music/<src>.grid.json, cached): the librosa analysis (music/<src>.beats.json, 23 ms frames, ~27 ms late) is
   refined on a 2.7 ms onset envelope: the song drifts 130.0 → 132.3 BPM (Suno), so the grid is a smooth polynomial of the beat
   index (deg 5) + a smoothed local phase correction (±40 ms comb search over 16 beats). Residual of the onset peaks vs the grid:
   p5..p95 ≈ −8..+6 ms. Then the whole grid is shifted to the ATTACK START (hi-band transient onset ≈ 12 ms before the flux peak),
   so a visual hit on a grid time lands on the first frame of the drum hit. Downbeat phase = librosa's (k0, every 4th beat).
2. EDIT: `source_segments_bars` = half-open [a, b) ranges of source bars (0-based, bar i = source downbeat i; "end" = file end).
   Every splice happens exactly on a downbeat: the outgoing segment plays until T − 6 ms, the incoming one fades in over
   [T − 24 ms, T − 6 ms] (equal power), so both drum attacks stay intact and the beat phase continues (bar length across the
   splice = the incoming bar). 2 ms fade-in at t = 0, `tailFade` s cosine fade to silence at the end.
3. GRID OF THE OUTPUT: every source beat inside a segment is mapped to output time; downbeats = mapped source downbeats
   → every block boundary (integer bars) sits on a downbeat by construction. Written with the per-bar energy profile
   (`bars`: dB full / low / high) so block agents can see fills, breaks and peaks.
"""
import json, sys, os, hashlib
import numpy as np, soundfile as sf, subprocess, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda rel: os.path.join(ROOT, rel)
SR = 48000
ATTACK_SHIFT = -0.012          # flux peak → transient start (measured: hi-band attack median −12.8 ms, p25 −14.1, p75 −10.1)
XF_A, XF_B = 0.024, 0.006      # splice crossfade window [T − XF_A, T − XF_B]


def decode(src):
    tmp = tempfile.NamedTemporaryFile(suffix='.wav', delete=False).name
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-ar', str(SR), '-ac', '2', '-c:a', 'pcm_f32le', tmp], check=True)
    y, sr = sf.read(tmp, dtype='float32'); os.unlink(tmp)
    assert sr == SR
    return y


def analyse(src_rel, y):
    import librosa
    from scipy.ndimage import median_filter, uniform_filter1d
    lib = json.load(open(P(src_rel.rsplit('.', 1)[0] + '.beats.json')))
    b = np.array(lib['beats']); n = len(b); idx = np.arange(n)
    m = y.mean(1); hop = 128; fps = SR / hop
    oe = librosa.onset.onset_strength(y=m, sr=SR, hop_length=hop, n_fft=2048, n_mels=64)
    pred = np.polyval(np.polyfit(idx, b, 5), idx)
    offs = np.arange(-0.04, 0.0401, 1 / fps)
    def score(times):
        j = np.round(times * fps).astype(int); j = j[(j >= 0) & (j < len(oe))]; return oe[j].sum()
    loc = np.array([offs[int(np.argmax([score(pred[max(0, i - 8):i + 8] + o) for o in offs]))] for i in range(n)])
    grid = pred + uniform_filter1d(median_filter(loc, 9), 9)
    res = []
    for t in grid:
        j0, j1 = int((t - 0.025) * fps), int((t + 0.025) * fps)
        if j0 < 0 or j1 > len(oe): continue
        res.append((j0 + np.argmax(oe[j0:j1])) / fps - t)
    k0 = int(np.argmin(np.abs(b - lib['downbeats'][0])))
    beats = grid + ATTACK_SHIFT
    # local tempo for the record
    downs = beats[k0::4]
    out = {
        'file': src_rel, 'duration': round(len(y) / SR, 3), 'k0': k0,
        'note': 'refined grid (music_edit.py): poly deg 5 + local comb phase, shifted to the transient start (−12 ms vs onset flux peak)',
        'residual_ms_p5_p95': [round(float(np.percentile(res, 5)) * 1000, 1), round(float(np.percentile(res, 95)) * 1000, 1)],
        'bpm_first_last': [round(240 / float(np.median(np.diff(downs[:12]))), 2), round(240 / float(np.median(np.diff(downs[-12:]))), 2)],
        'beats': [round(float(t), 4) for t in beats], 'downbeats': [round(float(t), 4) for t in downs],
    }
    return out


def bar_profile(y, downs, end):
    import scipy.signal as ss
    m = y.mean(1)
    lo = ss.sosfiltfilt(ss.butter(4, 150, 'low', fs=SR, output='sos'), m)
    hi = ss.sosfiltfilt(ss.butter(4, 4000, 'high', fs=SR, output='sos'), m)
    db = lambda x: round(float(10 * np.log10((x ** 2).mean() + 1e-12)), 1)
    edges = list(downs) + [end]
    rows = []
    for i in range(len(downs)):
        a, b = int(edges[i] * SR), int(min(edges[i + 1], len(m) / SR) * SR)
        if b - a < SR * 0.2: continue
        rows.append({'bar': i, 't': round(float(edges[i]), 3), 'db': db(m[a:b]), 'low': db(lo[a:b]), 'high': db(hi[a:b])})
    return rows


def main():
    plan_rel = sys.argv[1]
    plan = json.load(open(P(plan_rel)))
    src_rel = plan['source']
    y = decode(P(src_rel))
    gpath = P(src_rel.rsplit('.', 1)[0] + '.grid.json')
    h = hashlib.md5(open(P(src_rel), 'rb').read()).hexdigest()
    if '--grid' in sys.argv or not os.path.exists(gpath) or json.load(open(gpath)).get('md5') != h:
        g = analyse(src_rel, y); g['md5'] = h
        json.dump(g, open(gpath, 'w'), indent=1)
        print('source grid', gpath, 'residual', g['residual_ms_p5_p95'], 'ms · bpm', g['bpm_first_last'])
    g = json.load(open(gpath))
    if '--grid' in sys.argv: return
    SB, SD = np.array(g['beats']), np.array(g['downbeats'])
    src_end = len(y) / SR
    segs = []
    for a, b in plan['source_segments_bars']:
        t0 = SD[a]; t1 = src_end if b == 'end' else SD[b]
        segs.append((a, b, t0, t1))
    # ---- assemble ----
    total = sum(t1 - t0 for _, _, t0, t1 in segs)
    N = int(round(total * SR))
    out = np.zeros((N + SR, 2), np.float32)
    beats_out, downs_out, src_map = [], [], []
    T = 0.0
    xa, xb = int(XF_A * SR), int(XF_B * SR)
    for si, (a, b, t0, t1) in enumerate(segs):
        first, last = si == 0, si == len(segs) - 1
        i0 = int(round(t0 * SR)) - (0 if first else xa)
        i1 = int(round(t1 * SR)) - (0 if last else xb)
        seg = y[i0:min(i1, len(y))].copy()
        o0 = int(round(T * SR)) - (0 if first else xa)
        if first:
            k = int(0.002 * SR); seg[:k] *= np.linspace(0, 1, k)[:, None]
        else:   # equal-power fade-in over [T − XF_A, T − XF_B]
            k = xa - xb; ph = np.linspace(0, np.pi / 2, k)
            seg[:k] *= np.sin(ph)[:, None]
            # fade the previous segment's overlap (already written) with cos
            prev = out[o0:o0 + k]; prev *= np.cos(ph)[:, None]
            out[o0 + k:o0 + xa] = 0      # previous segment ended at T − XF_B (never wrote beyond) – keep clean
        out[o0:o0 + len(seg)] += seg
        # grid mapping
        for t in SB[(SB >= t0 - 1e-4) & (SB < t1 - 1e-4)]: beats_out.append(T + (t - t0))
        for j, t in enumerate(SD):
            if t0 - 1e-4 <= t < t1 - 1e-4: downs_out.append(T + (t - t0)); src_map.append(j)
        T += t1 - t0
    out = out[:int(round(T * SR))]
    dur = len(out) / SR
    # beats past the source grid inside the tail (song ends after the last analysed beat): extend with the last interval
    iv = float(np.median(np.diff(SB[-16:])))
    while beats_out[-1] + iv < dur - 1e-3: beats_out.append(beats_out[-1] + iv)
    # clean fade tail
    tf = float(plan.get('tailFade', 2.5))
    k = int(tf * SR); out[-k:] *= (np.cos(np.linspace(0, np.pi / 2, k)) ** 2)[:, None]
    peak = float(np.abs(out).max())
    sf.write(P(plan['track']), out, SR, subtype='PCM_16')
    prof = bar_profile(out, downs_out, dur)
    for r, s in zip(prof, src_map): r['src'] = s
    gj = {'file': plan['track'], 'duration': round(dur, 3), 'tempo': 129.2,
          'note': f'{os.path.basename(plan_rel)}: mapped from {os.path.basename(gpath)} (refined, attack-aligned); source bars {plan["source_segments_bars"]}',
          'beats': [round(t, 3) for t in beats_out], 'downbeats': [round(t, 3) for t in downs_out], 'bars': prof}
    json.dump(gj, open(P(plan['beats']), 'w'), indent=1)
    # block table into the plan
    D = downs_out + [dur]
    for k_, e in plan['blocks'].items():
        e['t0'] = round(D[e['start_bar']], 3)
        e['t1'] = round(dur if e.get('tail') else D[e['start_bar'] + e['bars']], 3)
        e['src_bars'] = [src_map[i] for i in range(e['start_bar'], min(len(src_map), e['start_bar'] + e['bars']))]
    plan['duration'] = round(dur, 3)
    json.dump(plan, open(P(plan_rel), 'w'), indent=1, ensure_ascii=False)
    print(f'{plan["track"]}: {dur:.3f} s · {len(downs_out)} bars · peak {20*np.log10(peak):.2f} dBFS · splices at',
          [round(D[i], 3) for i in range(1, len(src_map)) if src_map[i] != src_map[i - 1] + 1])


if __name__ == '__main__':
    main()
