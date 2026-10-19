import numpy as np
from PIL import Image
from scipy import ndimage as ndi
Image.MAX_IMAGE_PIXELS=None
B='/home/user/Clipcreator/projects/mcr-2026-sponzori/drone/procedural/build/'
D='/home/user/Clipcreator/projects/mcr-2026-sponzori/drone/data/'
z=np.load(B+'cls_inputs.npz'); globals().update({k:z[k] for k in z.files})
tall=(ndsm>2.2)&~water
veg=(exg>0.045)|((exg>0.0)&(rough>0.45))
bld=tall&~veg&(rough<0.6)
bld=ndi.binary_opening(bld,np.ones((2,2)))
bld=ndi.binary_closing(bld,np.ones((3,3)))
bld=ndi.binary_fill_holes(bld)
lab,k=ndi.label(bld)
idx=np.arange(1,k+1)
area=ndi.sum(np.ones_like(ndsm),lab,idx)
mexg=ndi.mean(exg,lab,idx)
mh=ndi.maximum(ndsm,lab,idx)
keep=(area>=14)&(mexg<0.05)&(mh>2.8)
bld=np.isin(lab,idx[keep])
tree=tall&~bld&~ndi.binary_dilation(bld,iterations=1)&(exg>-0.02)
shrub=(ndsm>0.7)&(ndsm<=2.2)&(exg>0.06)&~water&~ndi.binary_dilation(bld,iterations=1)
np.savez_compressed(B+'cls.npz',bld=bld,tree=tree,shrub=shrub)
print('buildings',keep.sum(),'bld px',bld.sum(),'tree px',tree.sum(),'shrub px',shrub.sum())
# QA overlay over the area of interest
o=np.asarray(Image.open(D+'orto_core_4096.jpg').convert('RGB').resize((1600,1600),Image.BILINEAR)).astype(np.float32)
def up(m): return np.repeat(np.repeat(m,2,0),2,1)
ov=o.copy()
ov[up(bld)]=ov[up(bld)]*0.4+np.array([255,0,255])*0.6
ov[up(tree)]=ov[up(tree)]*0.6+np.array([0,255,0])*0.4
ov[up(shrub)]=ov[up(shrub)]*0.6+np.array([255,255,0])*0.4
# crop to x 461250..461750, y 5584550..5585100
c=ov[(5585250-5585100)*2:(5585250-5584550)*2,(461250-461150)*2:(461750-461150)*2]
Image.fromarray(c.astype(np.uint8)).save(B+'qa/cls_overlay.jpg',quality=88)
