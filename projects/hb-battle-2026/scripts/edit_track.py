# Монтаж трека под ~60 с: [0, A_OUT) + [B_IN, конец), склейка по сильным долям, кроссфейд 20 мс.
# Пишет 03_MUSIC/Trout_Area_edit60.wav и сетку в «монтажном» времени: 03_MUSIC/Trout_Area_edit60.grid.json
import json, subprocess, numpy as np
SRC, OUT = '03_MUSIC/Trout_Area.wav', '03_MUSIC/Trout_Area_edit60.wav'
A_OUT, B_IN, XF = 31.63, 64.83, 0.02   # конец такта 16 (брейк) -> начало такта 35 (первый пик)
g = json.load(open('03_MUSIC/Trout_Area.beats.json'))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', SRC, '-filter_complex',
  f'[0]atrim=0:{A_OUT + XF / 2},asetpts=N/SR/TB[a];[0]atrim={B_IN - XF / 2},asetpts=N/SR/TB[b];[a][b]acrossfade=d={XF}:c1=tri:c2=tri[o]',
  '-map', '[o]', '-c:a', 'pcm_s16le', OUT], check=True)
shift = B_IN - A_OUT
m = lambda ts: [round(t, 3) for t in ts if t < A_OUT - 0.05] + [round(t - shift, 3) for t in ts if t >= B_IN - 0.05]
dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', OUT]))
beats, downs = m(g['beats']), m(g['downbeats'])
grid = {'source': SRC, 'edit': {'a_out': A_OUT, 'b_in': B_IN, 'xfade': XF}, 'tempo': g['tempo'],
        'beat': round(float(np.median(np.diff(beats))), 4), 'duration': round(dur, 3), 'beats': beats, 'downbeats': downs,
        'sections': {'intro': [1, 8], 'build': [9, 15], 'break': [16, 16], 'peak1': [17, 20], 'calm': [21, 24], 'peak2': [25, 28], 'outro': [29, len(downs)]}}
json.dump(grid, open(OUT.replace('.wav', '.grid.json'), 'w'), indent=1)
print('dur', dur, 'bars', len(downs), 'beat', grid['beat'])
print('downbeats', downs)
