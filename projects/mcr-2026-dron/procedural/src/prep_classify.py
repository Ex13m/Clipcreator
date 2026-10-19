# Step 1: classification of nDSM into trees / buildings / shrubs at 1 m, QA overlay.
import numpy as np, tifffile, json
from PIL import Image
from scipy import ndimage as ndi
Image.MAX_IMAGE_PIXELS=None
D='/home/user/Clipcreator/projects/mcr-2026-sponzori/drone/data/'
B='/home/user/Clipcreator/projects/mcr-2026-sponzori/drone/procedural/build/'
dsm=tifffile.imread(D+'dsm_core_1m_render.tif').astype(np.float32)
dtm=tifffile.imread(D+'dtm_core_1m_render.tif').astype(np.float32)
ndsm=np.clip(dsm-dtm,0,None)
o6=Image.open(D+'orto_core_6400.jpg').convert('RGB')
o1=np.asarray(o6.resize((800,800),Image.BOX)).astype(np.float32)/255
R,G,Bc=o1[...,0],o1[...,1],o1[...,2]
S=R+G+Bc+1e-3
exg=(2*G-R-Bc)/S
lum=0.299*R+0.587*G+0.114*Bc
# texture: std of luminance at 0.25 m within each 1 m cell (trees are textured)
o4=np.asarray(o6.resize((3200,3200),Image.BOX).convert('L')).astype(np.float32)/255
tex=o4.reshape(800,4,800,4).std(axis=(1,3))
water=np.asarray(Image.open(D+'water_mask_1m.png'))>127
sm=ndi.gaussian_filter(dsm,1.2)
rough=ndi.uniform_filter(np.abs(dsm-sm),3)
np.savez_compressed(B+'cls_inputs.npz',ndsm=ndsm,exg=exg,lum=lum,tex=tex,rough=rough,water=water,dsm=dsm,dtm=dtm)
print('exg pct',np.percentile(exg,[5,25,50,75,95]))
print('rough on tall',np.percentile(rough[ndsm>3],[10,50,90]))
