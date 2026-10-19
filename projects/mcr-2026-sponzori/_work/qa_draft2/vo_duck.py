import numpy as np, json
from scipy.io import wavfile
from scipy.signal import fftconvolve, resample_poly
P='/home/user/Clipcreator/projects/mcr-2026-sponzori'
def load(p):
    sr,x=wavfile.read(p)
    x=x.astype(np.float64)/(32768 if x.dtype==np.int16 else 1)
    if x.ndim==1: x=x[:,None]
    return sr,x.mean(1)
sr,r=load('render.wav'); _,m=load(P+'/audio/track_A.wav')
spec=json.load(open(P+'/proto/assets/audio/mix_film.wav.spec.json'))
plan=json.load(open(P+'/data/block_plan_A.json'))['blocks']
def db(x): return 20*np.log10(max(x,1e-12))
def rms(x): return np.sqrt(np.mean(x*x)+1e-20)
out=[]
# music gain estimate via LS projection in 50ms windows
W=int(0.05*sr); n=min(len(r),len(m))//W
rr=r[:n*W].reshape(n,W); mm=m[:n*W].reshape(n,W)
g=(rr*mm).sum(1)/((mm*mm).sum(1)+1e-12)
gdb=20*np.log10(np.clip(np.abs(g),1e-6,None))
tt=(np.arange(n)+0.5)*0.05
# VO activity mask from VO stems placed at 'at'
vomask=np.zeros(n,bool); vo_env=np.zeros(n)
for c in spec['vo']:
    vsr,v=load(c['src'])
    if vsr!=sr: v=resample_poly(v,sr,vsr)
    s=int(round(c['at']*sr)); 
    for i in range(len(v)//W):
        k=s//W+i
        if k<n:
            e=rms(v[i*W:(i+1)*W]); vo_env[k]=max(vo_env[k],e)
for i in range(n): vomask[i]= vo_env[i]>10**(-42/20)
print('VO clips:')
for c in spec['vo']:
    vsr,v=load(c['src'])
    if vsr!=sr: v=resample_poly(v,sr,vsr)
    at=c['at']; s=int(round(at*sr))
    # speech onset in VO file
    env=np.array([rms(v[i:i+int(0.01*sr)]) for i in range(0,len(v)-int(0.01*sr),int(0.005*sr))])
    on=np.argmax(env>10**(-40/20))*0.005
    # xcorr VO vs render around expected spot
    pad=int(0.3*sr)
    seg=r[s-pad:s+len(v)+pad]
    c_=fftconvolve(seg,v[::-1],mode='valid')  # index k -> v starts at s-pad+k
    k=np.argmax(c_); lag=(k-pad)/sr*1000
    gain=c_[k]/(v*v).sum()
    corr=c_[k]/np.sqrt((v*v).sum()*(seg[k:k+len(v)]**2).sum())
    # envelope check around speech onset in render: VO-band energy 0.3s before vs 0.5s after onset
    t_on=at+on
    a0=int((t_on-0.35)*sr); a1=int((t_on-0.05)*sr); b0=int((t_on+0.02)*sr); b1=int((t_on+0.52)*sr)
    # residual after removing estimated music (LS per window) is hard; use raw render RMS
    pre=db(rms(r[a0:a1])); post=db(rms(r[b0:b1]))
    # music gain under this clip vs 1s before clip and outside
    i0=int(t_on/0.05)+4; i1=int((at+c['dur'])/0.05)-4
    gin=np.median(gdb[i0:i1][vomask[i0:i1]])
    # reference: music-only gain = windows w/o VO within ±3 s outside clip
    ref=[j for j in range(max(0,int((at-2.5)/0.05)),min(n,int((at+c['dur']+2.5)/0.05))) if not vomask[j] and not (int(at/0.05)-6<=j<=int((at+c['dur'])/0.05)+8)]
    gout=np.median(gdb[ref]) if ref else float('nan')
    key=c['src'].split('/')[-1][:-4]
    bt0=plan[key]['t0'] if key in plan else None
    row=dict(key=key,block_t0=bt0,vo_at=at,speech_onset=round(t_on,3),xcorr_lag_ms=round(lag,2),vo_gain_db=round(db(gain),2),corr=round(corr,3),pre_db=round(pre,1),post_db=round(post,1),music_gain_under_vo_db=round(gin,2),music_gain_near_novo_db=round(gout,2),duck_db=round(gin-gout,2),vo_end=round(at+c['dur'],3),block_t1=plan[key]['t1'] if key in plan else None)
    out.append(row); print(row)
# global: music gain distribution
print('music gain median where VO active: %.2f dB, where no VO: %.2f dB'%(np.median(gdb[vomask]),np.median(gdb[~vomask & (tt>0.3)])))
json.dump(out,open('vo_duck.json','w'),indent=1)
np.save('gdb.npy',np.stack([tt,gdb,vomask.astype(float)]))
