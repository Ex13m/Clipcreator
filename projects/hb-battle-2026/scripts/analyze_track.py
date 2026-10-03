# Анализ трека: темп, доли, такты, энергия по тактам -> 03_MUSIC/Trout_Area.beats.json
import json, sys, numpy as np, librosa
src = sys.argv[1] if len(sys.argv) > 1 else '03_MUSIC/Trout_Area.wav'
y, sr = librosa.load(src, sr=22050, mono=True)
dur = len(y) / sr
onset = librosa.onset.onset_strength(y=y, sr=sr)
tempo, beats = librosa.beat.beat_track(onset_envelope=onset, sr=sr, units='time')
tempo = float(np.atleast_1d(tempo)[0])
# первая заметная доля (начало звука)
rms = librosa.feature.rms(y=y)[0]; t_rms = librosa.times_like(rms, sr=sr)
first_sound = float(t_rms[np.argmax(rms > rms.max() * 0.05)])
# сильная доля: фаза 4 долей с макс. суммой onset (низы)
yb = librosa.effects.preemphasis(y, coef=-0.95)
low = librosa.onset.onset_strength(y=librosa.effects.harmonic(y) * 0 + y, sr=sr, fmax=200, n_mels=32)
bt = np.array(beats); bf = librosa.time_to_frames(bt, sr=sr)
scores = [low[bf[k::4][bf[k::4] < len(low)]].sum() for k in range(4)]
k0 = int(np.argmax(scores)); downbeats = bt[k0::4]
# энергия по тактам (RMS dB)
bars = []
for i in range(len(downbeats) - 1):
    a, b = downbeats[i], downbeats[i + 1]
    m = (t_rms >= a) & (t_rms < b)
    bars.append({'bar': i + 1, 't': round(float(a), 3), 'db': round(float(20 * np.log10(rms[m].mean() + 1e-9)), 1)})
out = {'file': src, 'duration': round(dur, 3), 'tempo': round(tempo, 2), 'first_sound': round(first_sound, 3),
       'beats': [round(float(t), 3) for t in bt], 'downbeats': [round(float(t), 3) for t in downbeats], 'bars': bars}
json.dump(out, open(src.rsplit('.', 1)[0] + '.beats.json', 'w'), indent=1)
print('dur', round(dur, 2), 'tempo', round(tempo, 2), 'first_sound', round(first_sound, 2), 'beats', len(bt), 'downbeat phase', k0)
iv = np.diff(bt); print('beat interval median', round(float(np.median(iv)), 4), 'std', round(float(iv.std()), 4))
print('first beats', [round(float(t), 2) for t in bt[:8]])
for b in bars: print(f"{b['bar']:>3} {b['t']:>7.2f}s {b['db']:>6.1f} " + '#' * max(0, int((b['db'] + 40))))
