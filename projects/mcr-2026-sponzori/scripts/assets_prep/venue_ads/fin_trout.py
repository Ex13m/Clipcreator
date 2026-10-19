import sys; sys.path.insert(0,'/tmp/claude-0/-home-user-Clipcreator/71aa791e-2b52-549a-940d-d7fdf5b83edd/scratchpad/venue/tools')
import numpy as np, cv2
from PIL import Image
from finalize import *
W='/tmp/claude-0/-home-user-Clipcreator/71aa791e-2b52-549a-940d-d7fdf5b83edd/scratchpad/venue/work/'
rgb=np.array(Image.open(W+'trout_up_crop.png').convert('RGB'))
isn=np.array(Image.open(W+'trout_up_isnet.png').convert('RGBA'))[...,3]
gc=np.array(Image.open(W+'trout_gc_half.png'))
H,Wd=isn.shape
gcf=cv2.resize(gc,(Wd,H),interpolation=cv2.INTER_LINEAR)
gcf=cv2.GaussianBlur(gcf.astype(np.float32),(0,0),2.0)
gcf=np.clip((gcf-128)*2+128,0,255).astype(np.uint8)
a=np.minimum(isn,gcf)
a=clean_alpha(a)
a=shrink(a,1.5)
a=feather(a,0.7)
rgb2=decontaminate(rgb,a)
print(save_cut(rgb2,a,'/home/user/Clipcreator/projects/mcr-2026-sponzori/assets_prep/venue/ads/h2_trout_potocak.png',pad_frac=0.02,max_side=2200))
