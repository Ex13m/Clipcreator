import numpy as np, json, sys
from scipy.io import wavfile
from scipy.signal import fftconvolve, butter, sosfiltfilt
import pyloudnorm as pyln
P='/home/user/Clipcreator/projects/mcr-2026-sponzori'
def load(p):
    sr,x=wavfile.read(p)
    if x.dtype==np.int16: x=x.astype(np.float64)/32768
    elif x.dtype==np.int32: x=x.astype(np.float64)/2**31
    else: x=x.astype(np.float64)
    if x.ndim==1: x=x[:,None]
    return sr,x
sr,R=load('render.wav'); sr2,M=load(P+'/audio/track_A.wav'); sr3,MIX=load(P+'/proto/assets/audio/mix_film.wav')
print('sr',sr,sr2,sr3,'len s',len(R)/sr,len(M)/sr2,len(MIX)/sr3)
r=R.mean(1); m=M.mean(1); mx=MIX.mean(1)
def xcorr_offset(a,b,maxlag):
    # returns lag (samples) such that a[n] ~ b[n-lag]; positive = a delayed vs b
    n=min(len(a),len(b))
    a=a[:n]-a[:n].mean(); b=b[:n]-b[:n].mean()
    c=fftconvolve(a,b[::-1],mode='full')
    mid=n-1
    seg=c[mid-maxlag:mid+maxlag+1]
    k=np.argmax(seg)-maxlag
    # parabolic interp
    i=np.argmax(seg)
    if 0<i<len(seg)-1:
        y0,y1,y2=seg[i-1],seg[i],seg[i+1]; d=0.5*(y0-y2)/(y0-2*y1+y2)
    else: d=0
    peak=seg[i]/np.sqrt((a*a).sum()*(b*b).sum())
    return k+d, peak
maxlag=int(0.5*sr)
# whole-file
for name,b in [('track_A',m),('mix_film',mx)]:
    lag,pk=xcorr_offset(r,b,maxlag)
    print(f'xcorr whole render vs {name}: lag {lag:.2f} smp = {lag/sr*1000:.3f} ms, norm peak {pk:.3f}')
# windowed (music-only regions + overall), 10 s windows
print('windowed vs track_A (10s windows):')
res=[]
for t0 in np.arange(0,119-10,10):
    a=r[int(t0*sr):int((t0+10)*sr)]; b=m[int(t0*sr):int((t0+10)*sr)]
    lag,pk=xcorr_offset(a,b,int(0.1*sr))
    res.append((t0,lag/sr*1000,pk))
    print(f'  {t0:5.0f}-{t0+10:5.0f}s lag {lag/sr*1000:+7.3f} ms  peak {pk:.3f}')
# loudness
meter=pyln.Meter(sr)
print('LUFS render', meter.integrated_loudness(R), 'mix', meter.integrated_loudness(MIX), 'track', meter.integrated_loudness(M))
json.dump({'win':res},open('xcorr.json','w'))
