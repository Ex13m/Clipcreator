# Estimate sun azimuth/elevation of the ortho by matching DSM-cast shadows with dark ortho pixels.
import numpy as np, tifffile
from PIL import Image
from scipy import ndimage as ndi
Image.MAX_IMAGE_PIXELS=None
D='/home/user/Clipcreator/projects/mcr-2026-sponzori/drone/data/'
dsm=tifffile.imread(D+'dsm_core_1m_render.tif').astype(np.float64)
ort=np.asarray(Image.open(D+'orto_core_4096.jpg').convert('RGB').resize((800,800),Image.BOX)).astype(np.float64)/255
lum=0.2126*ort[...,0]+0.7152*ort[...,1]+0.0722*ort[...,2]
water=np.asarray(Image.open(D+'water_mask_1m.png'))>20
def shadow(az,el,steps=50):
    # az: compass bearing of sun (deg, from N clockwise), el elevation deg. grid row0=north, 1 m px
    dx=np.sin(np.radians(az)); dy=-np.cos(np.radians(az))  # toward sun in (col,row)
    t=np.tan(np.radians(el))
    H,W=dsm.shape; rr,cc=np.mgrid[0:H,0:W].astype(np.float64)
    sh=np.zeros_like(dsm,bool)
    for s in range(1,steps):
        r=rr+dy*s; c=cc+dx*s
        h=ndi.map_coordinates(dsm,[r,c],order=1,mode='nearest')
        sh|= h > dsm + s*t + 0.3
    return sh
dark = lum < np.percentile(lum[~water],18)
valid=~water
best=[]
for az in range(200,301,15):
    for el in (30,40,50):
        s=shadow(az,el)
        # use correlation (phi coefficient)
        a=s[valid]; b=dark[valid]
        n11=float((a&b).sum()); n10=float((a&~b).sum()); n01=float((~a&b).sum()); n00=float((~a&~b).sum())
        phi=(n11*n00-n10*n01)/np.sqrt((n11+n10)*(n01+n00)*(n11+n01)*(n10+n00)+1e-9)
        best.append((phi,az,el)); 
best.sort(reverse=True); print(best[:8])
