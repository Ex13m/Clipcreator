import numpy as np, json
from scipy.io import wavfile
P='/home/user/Clipcreator/projects/mcr-2026-sponzori'
def load(p):
    sr,x=wavfile.read(p); x=x.astype(np.float64)/(32768 if x.dtype==np.int16 else 1)
    return sr,(x.mean(1) if x.ndim>1 else x)
sr,r=load('render.wav'); _,m=load(P+'/audio/track_A.wav')
n=min(len(r),len(m)); r=r[:n]; m=m[:n]
W=int(0.02*sr); k=n//W
rr=r[:k*W].reshape(k,W); mm=m[:k*W].reshape(k,W)
g=(rr*mm).sum(1)/((mm*mm).sum(1)+1e-12)
res=rr-g[:,None]*mm
renv=10*np.log10((res**2).mean(1)+1e-20)
V=json.load(open('vo_duck.json'))
print('key        onset    resid_before  resid_after  rise(dB)')
for v in V:
    t=v['speech_onset']; i=int(t/0.02)
    b=renv[i-15:i-2].mean(); a=renv[i+1:i+25].mean()
    print(f"{v['key']:13s} {t:7.3f}  {b:8.1f}   {a:8.1f}   {a-b:+6.1f}")
gdb=20*np.log10(np.clip(np.abs(g),1e-6,None))
for name,a,b in [('broll+break (no VO)',62.4,67.8),('finale tail after VO',108.6,118.9),('intro VO',1,13.5)]:
    i0,i1=int(a/0.02),int(b/0.02)
    print(f'{name}: residual {renv[i0:i1].mean():.1f} dB, music gain median {np.median(gdb[i0:i1]):.2f} dB')
