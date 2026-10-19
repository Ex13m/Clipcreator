# Estimate sun azimuth/elevation of the ortho by matching DSM cast shadows to dark ortho pixels.
import numpy as np, tifffile
from PIL import Image
Image.MAX_IMAGE_PIXELS=None
D='/home/user/Clipcreator/projects/mcr-2026-sponzori/drone/data/'
dsm=tifffile.imread(D+'dsm_core_1m_render.tif').astype(np.float32)
dtm=tifffile.imread(D+'dtm_core_1m_render.tif').astype(np.float32)
orto=np.asarray(Image.open(D+'orto_core_4096.jpg').convert('RGB').resize((800,800),Image.BOX)).astype(np.float32)/255
lum=orto@np.array([0.299,0.587,0.114],np.float32)
water=np.asarray(Image.open(D+'water_mask_1m.png'))>127
ndsm=dsm-dtm
# evaluate on open ground pixels (nDSM<0.7, not water): shadowed ground is dark
ground=(ndsm<0.7)&(~water)
def shadow(az,el,steps=80):
    # direction toward sun in raster coords: east=+col, north=-row
    dx=np.sin(np.radians(az)); dy=-np.cos(np.radians(az)); t=np.tan(np.radians(el))
    sh=np.zeros_like(dsm,bool)
    H,W=dsm.shape
    for k in range(1,steps):
        sx=int(round(dx*k)); sy=int(round(dy*k))
        # value at (r+sy, c+sx)
        src=np.full_like(dsm,-1e9)
        r0=max(0,-sy); r1=min(H,H-sy); c0=max(0,-sx); c1=min(W,W-sx)
        src[r0:r1,c0:c1]=dsm[r0+sy:r1+sy,c0+sx:c1+sx]
        dist=np.hypot(sx,sy)
        sh|= src > dsm + dist*t + 0.3
    return sh
best=[]
L=lum[ground]
for az in range(130,235,5):
    for el in range(30,70,5):
        s=shadow(az,el)[ground]
        if s.sum()<100: continue
        # separation of luminance between shadow and lit ground
        d=(L[~s].mean()-L[s].mean())/L.std()
        best.append((d,az,el,s.mean()))
best.sort(reverse=True)
for b in best[:10]: print('score %.3f az %d el %d frac %.3f'%b)
