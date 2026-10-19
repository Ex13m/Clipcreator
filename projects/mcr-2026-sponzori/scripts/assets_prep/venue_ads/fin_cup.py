import sys; sys.path.insert(0,'/tmp/claude-0/-home-user-Clipcreator/71aa791e-2b52-549a-940d-d7fdf5b83edd/scratchpad/venue/tools')
import numpy as np, cv2
from PIL import Image
from scipy import ndimage as ndi
from finalize import *
W='/tmp/claude-0/-home-user-Clipcreator/71aa791e-2b52-549a-940d-d7fdf5b83edd/scratchpad/venue/work/'
rgb=np.array(Image.open(W+'cup_up_crop.png').convert('RGB'))
a=np.array(Image.open(W+'cup_up_isnet.png').convert('RGBA'))[...,3].copy()
H,Wd=a.shape
# --- handle holes: remove photo background inside the handle loops
hsv=cv2.cvtColor(rgb,cv2.COLOR_RGB2HSV)
h,s,v=hsv[...,0].astype(int),hsv[...,1].astype(int),hsv[...,2].astype(int)
gold=(h<=30)&(s>=95)&(v>=85)
navy=(h>=95)&(h<=135)&(s>=60)
white=(s<40)&(v>200)
obj=gold|navy|white
bgc=~obj
bgc=cv2.morphologyEx(bgc.astype(np.uint8),cv2.MORPH_OPEN,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(9,9))).astype(bool)
holes=np.zeros_like(bgc)
for (x0,y0,x1,y1) in [(120,760,430,1310),(1290,800,1545,1290)]:
    sub=bgc[y0:y1,x0:x1]
    lab,n=ndi.label(sub)
    if n:
        sizes=ndi.sum(sub,lab,range(1,n+1))
        keep=np.zeros(n+1,bool); keep[1+int(np.argmax(sizes))]=True
        holes[y0:y1,x0:x1]=keep[lab]
holes=cv2.dilate(holes.astype(np.uint8),np.ones((3,3),np.uint8),iterations=1).astype(bool)
a[holes]=0
Image.fromarray((holes*255).astype(np.uint8)).save(W+'cup_holes.png')
# --- base: rebuild bottom strip (banner painted over it in the poster)
AX=849; Y0=2195; YB=2268
a[YB:]=0
band=a[Y0:YB]; band[band<200]=0; a[Y0:YB]=band
prof=rgb[Y0:YB,530:590].astype(np.float32).mean(axis=1)
aprof=a[Y0:YB,530:590].astype(np.float32).min(axis=1)
for x in range(590,AX+1):
    t=min(1.0,(x-590)/40.0)
    rgb[Y0:YB,x]=(rgb[Y0:YB,x].astype(np.float32)*(1-t)+prof*t).astype(np.uint8) if x<630 else prof.astype(np.uint8)
    a[Y0:YB,x]=np.maximum(a[Y0:YB,x],aprof.astype(np.uint8)) if x<630 else aprof.astype(np.uint8)
for x in range(AX+1,Wd):
    xm=2*AX-x
    if xm<0: a[Y0:YB,x]=0; continue
    rgb[Y0:YB,x]=rgb[Y0:YB,xm]; a[Y0:YB,x]=a[Y0:YB,xm]
a=clean_alpha(a,min_island=0.01,fill=False)
a=shrink(a,1.0)
a=feather(a,0.6)
rgb2=decontaminate(rgb,a)
print(save_cut(rgb2,a,'/home/user/Clipcreator/projects/mcr-2026-sponzori/assets_prep/venue/ads/h3_mcr_trophy.png',pad_frac=0.02))
