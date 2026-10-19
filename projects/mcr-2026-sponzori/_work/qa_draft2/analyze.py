import json, numpy as np
R=json.load(open('vscan.json'))
def runs(mask, minlen=1):
    out=[];s=None
    for i,v in enumerate(mask):
        if v and s is None: s=i
        if not v and s is not None:
            if i-s>=minlen: out.append((s,i-1))
            s=None
    if s is not None and len(mask)-s>=minlen: out.append((s,len(mask)-1))
    return out
std=np.array([r['std'] for r in R]); cstd=np.array([r['cstd'] for r in R]); mean=np.array([r['mean'] for r in R])
print('Near-uniform frames (luma std<6 and max chan std<8):')
for a,b in runs((std<6)&(cstd<8)):
    print(f'  f{a}-{b} t={a/30:.3f}-{(b+1)/30:.3f}s dur={(b-a+1)/30:.3f}s mean={mean[a:b+1].mean():.1f} std={std[a:b+1].min():.2f}')
print('Low-detail frames (luma std<12):')
for a,b in runs(std<12):
    print(f'  f{a}-{b} t={a/30:.3f}-{(b+1)/30:.3f}s dur={(b-a+1)/30:.3f}s mean={mean[a:b+1].mean():.1f} minstd={std[a:b+1].min():.2f}')
print('Very dark frames (mean<12):')
for a,b in runs(mean<12):
    print(f'  f{a}-{b} t={a/30:.3f}-{(b+1)/30:.3f}s dur={(b-a+1)/30:.3f}s mean={mean[a:b+1].mean():.1f}')
print('Very bright frames (mean>235):')
for a,b in runs(mean>235):
    print(f'  f{a}-{b} t={a/30:.3f}-{(b+1)/30:.3f}s mean={mean[a:b+1].mean():.1f}')
mad=np.array([r['mad'] if r['mad'] is not None else 99 for r in R]); frac=np.array([r['frac'] if r['frac'] is not None else 1 for r in R]); mx=np.array([r['mx'] if r['mx'] is not None else 255 for r in R])
# frozen: frame identical to previous
frz=(frac<0.0005)&(mad<0.15)
print('Frozen runs (>=6 frames i.e. >=0.2 s; frame t = diff to previous below threshold):')
for a,b in runs(frz,6):
    print(f'  f{a-1}-{b} t={(a-1)/30:.3f}-{(b+1)/30:.3f}s held={(b-a+2)/30:.3f}s maxdiff={mx[a:b+1].max()} frac={frac[a:b+1].max():.5f}')
print('Near-static runs (frac<0.003, >=9 frames):')
for a,b in runs(frac<0.003,9):
    print(f'  f{a-1}-{b} t={(a-1)/30:.3f}-{(b+1)/30:.3f}s held={(b-a+2)/30:.3f}s')
