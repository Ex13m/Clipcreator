import numpy as np
from scipy.io import wavfile
from scipy.signal import fftconvolve
P='/home/user/Clipcreator/projects/mcr-2026-sponzori'
sr,R=wavfile.read('render.wav'); R=R.astype(np.float64)
_,X=wavfile.read(P+'/proto/assets/audio/mix_film.wav'); X=X.astype(np.float64)/32768
_,M=wavfile.read(P+'/audio/track_A.wav'); M=M.astype(np.float64)/32768
n=min(len(R),len(X)); R=R[:n]; X=X[:n]
D=R-X
W=int(0.05*sr); k=n//W
def wdb(a): return 10*np.log10((a[:k*W].reshape(k,W,-1)**2).mean((1,2))+1e-20)
dr=wdb(D); xr=wdb(X)
snr=xr-dr
print('residual render-mix: overall SNR %.1f dB; min window SNR %.1f dB at %.2fs'%(10*np.log10((X**2).mean()/(D**2).mean()), snr[xr>-60].min(), np.argmin(np.where(xr>-60,snr,999))*0.05))
bad=np.where((snr<20)&(xr>-50))[0]
print('windows SNR<20dB:',[(round(i*0.05,2),round(snr[i],1)) for i in bad][:30])
# sample peak, per-channel
print('sample peak render dBFS %.2f, mix %.2f'%(20*np.log10(np.abs(R).max()),20*np.log10(np.abs(X).max())))
# last window xcorr vs track
r=R.mean(1); m=M.mean(1)
a=r[int(109*sr):int(119.1*sr)]; b=m[int(109*sr):int(119.1*sr)]
c=fftconvolve(a-a.mean(),(b-b.mean())[::-1],mode='full'); mid=len(b)-1; L=int(0.1*sr)
print('xcorr 109-119.1s lag ms', (np.argmax(c[mid-L:mid+L+1])-L)/sr*1000)
# head/tail levels
for t0,t1 in [(0,0.05),(0,0.5),(118.6,119.0),(119.0,119.133)]:
    s=R[int(t0*sr):int(t1*sr)]; print('level %.3f-%.3f: %.1f dBFS rms'%(t0,t1,10*np.log10((s**2).mean()+1e-20)))
