import sys; sys.path.insert(0,'/tmp/claude-0/-home-user-Clipcreator/71aa791e-2b52-549a-940d-d7fdf5b83edd/scratchpad/venue/tools')
import numpy as np, cv2
from PIL import Image
from finalize import *
W='/tmp/claude-0/-home-user-Clipcreator/71aa791e-2b52-549a-940d-d7fdf5b83edd/scratchpad/venue/work/'
rgb=np.array(Image.open(W+'smoked_in.png').convert('RGB'))
a=np.array(Image.open(W+'smoked_isnet.png').convert('RGBA'))[...,3].copy()
poly=np.array([(668,470),(700,470),(704,515),(750,539),(820,550),(828,575),(825,600),(815,615),(798,628),(780,642),(740,650),(700,646),(675,640),(668,600)],np.int32)
cut=np.zeros_like(a); cv2.fillPoly(cut,[poly],255)
cut=cv2.GaussianBlur(cut.astype(np.float32),(0,0),1.2)
a=(a.astype(np.float32)*(1-cut/255)).astype(np.uint8)
a[1700:,1215:]=0
reg=a[1100:1750,1185:]; reg[reg<200]=0; a[1100:1750,1185:]=reg
a[a<60]=0
a=clean_alpha(a,lo=60,min_island=0.01,fill=False)
a=shrink(a,1.0)
a=feather(a,0.6)
rgb2=decontaminate(rgb,a)
print(save_cut(rgb2,a,'/home/user/Clipcreator/projects/mcr-2026-sponzori/assets_prep/venue/ads/s1_smoked_trout_pair.png',pad_frac=0.02))
