import sys; sys.path.insert(0,'/tmp/claude-0/-home-user-Clipcreator/71aa791e-2b52-549a-940d-d7fdf5b83edd/scratchpad/venue/tools')
import numpy as np, cv2
from PIL import Image
from finalize import *
Image.MAX_IMAGE_PIXELS=None
up=np.array(Image.open('/home/user/Clipcreator/projects/mcr-2026-sponzori/assets_prep/venue/src/hf_orto_sportacek_up4k.jpg').convert('RGB'))
pm=np.array(Image.open('/tmp/claude-0/-home-user-Clipcreator/71aa791e-2b52-549a-940d-d7fdf5b83edd/scratchpad/venue/work/pond_mask_4k.png'))>127
cx,cy=2013,1947
# light grade: a touch more contrast/saturation (summer ortho is hazy)
f=up.astype(np.float32)/255
f=np.clip((f-0.5)*1.08+0.5+0.01,0,1)
hsv=cv2.cvtColor((f*255).astype(np.uint8),cv2.COLOR_RGB2HSV).astype(np.float32); hsv[...,1]*=1.12
g=cv2.cvtColor(np.clip(hsv,0,255).astype(np.uint8),cv2.COLOR_HSV2RGB)
# (a) disc lens
R=1350
x0,y0=cx-R,cy-R
crop=g[y0:y0+2*R,x0:x0+2*R]
ss=4
yy,xx=np.mgrid[0:2*R,0:2*R]
d=np.sqrt((xx+0.5-R)**2+(yy+0.5-R)**2)
a=np.clip((R-2-d)+0.5,0,1)  # 1px AA edge
A=(a*255).astype(np.uint8)
im=Image.fromarray(np.dstack([crop,A]),'RGBA').convert('RGBa').resize((2000,2000),Image.Resampling.LANCZOS).convert('RGBA')
im.save('/home/user/Clipcreator/projects/mcr-2026-sponzori/assets_prep/venue/ads/h1_arena_disc.png',optimize=True)
Image.fromarray(crop).resize((2048,2048),Image.Resampling.LANCZOS).save('/home/user/Clipcreator/projects/mcr-2026-sponzori/assets_prep/venue/ads/h1_arena_aerial.jpg',quality=92)
# water mask in the disc frame
wm=(pm[y0:y0+2*R,x0:x0+2*R]).astype(np.float32)
wm=cv2.GaussianBlur(wm,(0,0),1.5)
Image.fromarray((wm*255).astype(np.uint8)).resize((2000,2000),Image.Resampling.LANCZOS).save('/home/user/Clipcreator/projects/mcr-2026-sponzori/assets_prep/venue/ads/h1_arena_disc_watermask.png',optimize=True)
# (b) island = pond + ~4 m bank
k=cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(211,211))
isl=cv2.dilate(pm.astype(np.uint8),k)
isl=cv2.GaussianBlur(isl.astype(np.float32),(0,0),25)>0.5
isl=isl.astype(np.float32)
isl=cv2.GaussianBlur(isl,(0,0),1.0)
ys,xs=np.where(isl>0.02); bx0,bx1,by0,by1=xs.min(),xs.max()+1,ys.min(),ys.max()+1
pad=60
bx0-=pad;by0-=pad;bx1+=pad;by1+=pad
rgbI=g[by0:by1,bx0:bx1]; aI=(isl[by0:by1,bx0:bx1]*255).astype(np.uint8)
Image.fromarray(np.dstack([rgbI,aI]),'RGBA').save('/home/user/Clipcreator/projects/mcr-2026-sponzori/assets_prep/venue/ads/h1_pond_island.png',optimize=True)
wmI=cv2.GaussianBlur(pm[by0:by1,bx0:bx1].astype(np.float32),(0,0),1.5)
Image.fromarray((wmI*255).astype(np.uint8)).save('/home/user/Clipcreator/projects/mcr-2026-sponzori/assets_prep/venue/ads/h1_pond_island_watermask.png',optimize=True)
# (c) 3D floating island: extrude the silhouette down as an earth/rock side
H,Wd=aI.shape; ext=110
canvas=np.zeros((H+ext,Wd,4),np.float32)
base=aI.astype(np.float32)/255
top_soil=np.array([96,74,52],np.float32); deep=np.array([38,30,24],np.float32)
for i in range(ext,0,-1):
    t=i/ext
    col=top_soil*(1-t)+deep*t
    shade=0.9+0.1*np.sin(i*0.9)  # faint strata
    sl=canvas[i:i+H]
    m=base[...,None]
    sl[...,:3]=sl[...,:3]*(1-m)+col*shade*m
    sl[...,3:]=np.maximum(sl[...,3:],m)
top=np.dstack([rgbI.astype(np.float32),base])
m=top[...,3:]
canvas[:H,:,:3]=canvas[:H,:,:3]*(1-m)+top[...,:3]*m
canvas[:H,:,3:]=np.maximum(canvas[:H,:,3:],m)
# rim highlight on the top edge (grass lip)
edge=cv2.morphologyEx((base>0.5).astype(np.uint8),cv2.MORPH_GRADIENT,np.ones((5,5),np.uint8)).astype(np.float32)
edge=cv2.GaussianBlur(edge,(0,0),1.2)[...,None]
canvas[:H,:,:3]=np.clip(canvas[:H,:,:3]+edge*28,0,255)
out=np.dstack([canvas[...,:3],canvas[...,3]*255]).astype(np.uint8)
Image.fromarray(out,'RGBA').save('/home/user/Clipcreator/projects/mcr-2026-sponzori/assets_prep/venue/ads/h1_pond_island_3d.png',optimize=True)
print('island',aI.shape,'3d',out.shape)
