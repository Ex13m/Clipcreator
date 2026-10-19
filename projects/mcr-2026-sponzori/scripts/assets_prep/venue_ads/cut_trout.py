import numpy as np, cv2
from PIL import Image
from scipy import ndimage as ndi
S='/tmp/claude-0/-home-user-Clipcreator/71aa791e-2b52-549a-940d-d7fdf5b83edd/scratchpad/venue/work/'
rgb=np.array(Image.open(S+'trout_up_crop.png').convert('RGB'))
isn=np.array(Image.open(S+'trout_up_isnet.png').convert('RGBA'))[...,3]
H,W=isn.shape
k=0.5
small=cv2.resize(rgb,(int(W*k),int(H*k)),interpolation=cv2.INTER_AREA)
isn_s=cv2.resize(isn,(int(W*k),int(H*k)),interpolation=cv2.INTER_AREA)
h,w=isn_s.shape
f=1.344  # display(1000px grid image) -> half-scale coords
def P(pts): return np.array([[int(x*f),int(y*f)] for x,y in pts],np.int32)
mask=np.full((h,w),cv2.GC_BGD,np.uint8)
mask[isn_s>40]=cv2.GC_PR_FGD
mask[(isn_s>5)&(isn_s<=40)]=cv2.GC_PR_BGD
fg=[(150,357),(230,350),(320,340),(420,322),(520,305),(620,300),(700,318),(770,355),(815,410),(840,470),(845,530),(830,580),(815,600)]
bg_lower=[(715,508),(640,488),(540,470),(450,462),(390,480),(355,540),(340,620),(345,700),(350,780),(320,850),(290,880)]
bg_lower2=[(500,560),(560,600),(470,640),(450,690)]
bg_fin=[(600,110),(630,160),(650,200),(600,190),(560,130)]
cv2.polylines(mask,[P(fg)],False,cv2.GC_FGD,thickness=22)
cv2.polylines(mask,[P(bg_lower)],False,cv2.GC_BGD,thickness=30)
cv2.polylines(mask,[P(bg_lower2)],False,cv2.GC_BGD,thickness=30)
cv2.polylines(mask,[P(bg_fin)],False,cv2.GC_BGD,thickness=30)
belly_bg=[(345,421),(380,405),(410,393),(450,385),(500,383),(550,386),(600,394),(640,406),(668,418),(700,432),(725,448)]
belly_fg=[(352,399),(410,382),(450,372),(500,370),(550,373),(600,380),(640,392),(668,401),(700,415),(728,436)]
back_bg=[(540,212),(565,215),(600,219),(640,222),(668,221)]
back_fg=[(565,231),(600,234),(650,239),(680,240),(705,250)]
cv2.polylines(mask,[P(belly_bg)],False,cv2.GC_BGD,thickness=5)
cv2.polylines(mask,[P(belly_fg)],False,cv2.GC_FGD,thickness=8)
cv2.polylines(mask,[P(back_bg)],False,cv2.GC_BGD,thickness=6)
cv2.polylines(mask,[P(back_fg)],False,cv2.GC_FGD,thickness=6)
# everything below the belly_bg line (inside lower fish) between x 345..725 -> BG
poly=np.array(P(belly_bg).tolist()+[[int(725*f),int(700*f)],[int(345*f),int(700*f)]],np.int32)
cv2.fillPoly(mask,[poly],cv2.GC_BGD)
poly2=np.array(P(back_bg).tolist()+[[int(668*f),int(60*f)],[int(540*f),int(60*f)]],np.int32)
cv2.fillPoly(mask,[poly2],cv2.GC_BGD)
bgd=np.zeros((1,65),np.float64); fgd=np.zeros((1,65),np.float64)
cv2.grabCut(cv2.cvtColor(small,cv2.COLOR_RGB2BGR),mask,None,bgd,fgd,6,cv2.GC_INIT_WITH_MASK)
m=((mask==cv2.GC_FGD)|(mask==cv2.GC_PR_FGD)).astype(np.uint8)
lab,n=ndi.label(m)
seed=lab[int(350*f),int(320*f)]
m=(lab==seed).astype(np.uint8)
m=ndi.binary_fill_holes(m).astype(np.uint8)
# smooth
m=cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((5,5),np.uint8))
m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((7,7),np.uint8))
Image.fromarray(m*255).save(S+'trout_gc_half.png')
# debug overlay
dbg=small.copy(); dbg[m==0]=(dbg[m==0]*0.25).astype(np.uint8)
cv2.polylines(dbg,[P(fg)],False,(0,255,0),3); cv2.polylines(dbg,[P(bg_lower)],False,(255,0,0),3); cv2.polylines(dbg,[P(bg_fin)],False,(255,0,0),3); cv2.polylines(dbg,[P(bg_lower2)],False,(255,0,0),3); cv2.polylines(dbg,[P(belly_bg)],False,(255,0,0),2); cv2.polylines(dbg,[P(belly_fg)],False,(0,255,0),2); cv2.polylines(dbg,[P(back_bg)],False,(255,0,0),2); cv2.polylines(dbg,[P(back_fg)],False,(0,255,0),2)
Image.fromarray(dbg).resize((1000,1000)).save(S+'trout_gc_dbg.jpg',quality=88)
