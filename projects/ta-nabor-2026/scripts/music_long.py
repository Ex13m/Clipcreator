# Střih Suno tracku po taktech + VO + mix + spektrum pro LONG verzi.
# python3 scripts/music_long.py  → 03_MUSIC/track_long.beats.json, proto/assets/{track_long,mix_long}.wav, spec_long.json
import json, subprocess, os, sys
import numpy as np
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
g = json.load(open('03_MUSIC/suno_track.beats.json'))
D = g['downbeats']; DUR_IN = g['duration']
SEG = [(68, 72), (18, 115), (116, None)]
XF = 0.25
outdb, parts, t = [], [], 0.0
for s, e in SEG:
    a = D[s]; b = D[e] if e is not None else DUR_IN
    for k in range(s, (e if e is not None else len(D))):
        outdb.append(round(t + D[k] - a, 4))
    parts.append((a, b)); t += b - a
DUR = round(t, 3)
# ffmpeg: segmenty s přesahem XF a acrossfade (zachová časování taktů)
inp, fl = [], []
for i, (a, b) in enumerate(parts):
    tail = XF if i < len(parts) - 1 else 0
    fl.append(f"[0:a]atrim={a:.4f}:{b + tail:.4f},asetpts=PTS-STARTPTS[p{i}]")
cur = 'p0'
for i in range(1, len(parts)):
    fl.append(f"[{cur}][p{i}]acrossfade=d={XF}:c1=qsin:c2=qsin[x{i}]"); cur = f'x{i}'
fl.append(f"[{cur}]afade=t=out:st={DUR - 3:.3f}:d=3,aresample=48000[m]")
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', '03_MUSIC/suno_track.mp3', '-filter_complex', ';'.join(fl), '-map', '[m]', '-ac', '2', 'proto/assets/track_long.wav'], check=True)
json.dump({'file': 'track_long.wav', 'duration': DUR, 'downbeats': outdb, 'segments': SEG}, open('03_MUSIC/track_long.beats.json', 'w'))
print('DUR', DUR, 'bars', len(outdb))
BAR = lambda n: outdb[n] if n < len(outdb) else outdb[-1] + (n - len(outdb) + 1) * (outdb[-1] - outdb[-2])
# VO: (soubor, takt, offset s)
VO = [('s00', 2, 0.05), ('s01', 4, 0.5), ('s02', 10, 0.6), ('s03', 24, 0.6), ('s04', 30, 0.5), ('s05', 35, 0.6), ('s06', 42, 0.4), ('s07', 50, 0.5),
      ('s08', 54, 0.6), ('s09', 62, 0.4), ('s14', 66, 0.5), ('s10', 76, 0.6), ('s11', 83, 0.6), ('s15', 89, 0.4), ('s12', 94, 0.3), ('s16', 94, 3.6), ('s13', 101, 0.6)]
def vdur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
args, fl, prev = ['-i', 'proto/assets/track_long.wav'], [], None
for i, (f, b, o) in enumerate(VO):
    st = BAR(b) + o; fn = f'vo/v6igor/{f}_t.wav'; d = vdur(fn)
    if prev and st < prev[1] + 0.15: print('!! VO overlap', prev[0], f, round(prev[1] - st, 2))
    print(f, 'bar', b, 'start', round(st, 2), 'end', round(st + d, 2)); prev = (f, st + d)
    args += ['-i', fn]; ms = int(st * 1000)
    fl.append(f"[{i + 1}:a]aresample=48000,pan=stereo|c0=c0|c1=c0,adelay={ms}|{ms},apad=whole_dur={DUR}[v{i}]")
n = len(VO)
fl.append(''.join(f'[v{i}]' for i in range(n)) + f"amix=inputs={n}:normalize=0:duration=longest,volume=1.0,asplit=2[vo][sc]")
fl.append("[0:a][sc]sidechaincompress=threshold=0.035:ratio=4:attack=120:release=900:knee=6[md]")
fl.append(f"[md]volume=0.85[mm];[mm][vo]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[o]")
subprocess.run(['ffmpeg', '-y', '-v', 'error', *args, '-filter_complex', ';'.join(fl), '-map', '[o]', '-ac', '2', '-t', str(DUR), 'proto/assets/mix_long.wav'], check=True)
# spektrum z hudby (24 log pásem, 30 fps)
import librosa
y, sr = librosa.load('proto/assets/track_long.wav', sr=22050, mono=True)
hop = sr // 30
S = np.abs(librosa.stft(y, n_fft=2048, hop_length=hop))
fr = librosa.fft_frequencies(sr=sr, n_fft=2048); edges = np.geomspace(40, 10000, 25)
B = np.stack([S[(fr >= edges[i]) & (fr < edges[i + 1])].mean(0) for i in range(24)], 1)
B = np.log1p(B * 10); B = B / np.percentile(B, 99, axis=0, keepdims=True); B = np.clip(B, 0, 1)
rms = librosa.feature.rms(y=y, hop_length=hop)[0]; rms = np.clip(rms / np.percentile(rms, 99), 0, 1)
m = min(len(B), len(rms))
json.dump({'spec': (B[:m] * 99).round().astype(int).tolist(), 'rms': (rms[:m] * 99).round().astype(int).tolist()}, open('proto/assets/spec_long.json', 'w'), separators=(',', ':'))
print('spec frames', m)
