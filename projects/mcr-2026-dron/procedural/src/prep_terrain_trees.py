# Terrain heightmaps, modified ortho textures, tree/shrub instances, water masks.
import numpy as np, tifffile, json, cv2
from PIL import Image
from scipy import ndimage as ndi
Image.MAX_IMAGE_PIXELS=None
D='/home/user/Clipcreator/projects/mcr-2026-sponzori/drone/data/'
B='/home/user/Clipcreator/projects/mcr-2026-sponzori/drone/procedural/build/'
OX,ON=461550.0,5584850.0   # local origin (X=E-OX, Z=-(N-ON))
rng=np.random.default_rng(20261024)
z=np.load(B+'cls_inputs.npz'); ndsm=z['ndsm']; exg=z['exg']; water1=z['water']; dtm=z['dtm']; dsm=z['dsm']
cls=np.load(B+'cls.npz'); tree=cls['tree']; shrub=cls['shrub']
bfoot=np.load(B+'bld_final_mask.npy') if __import__('os').path.exists(B+'bld_final_mask.npy') else cls['bld']
labels=np.asarray(Image.open(D+'water_labels.png'))  # 6400
# ---------------- terrain core ----------------
wm=water1.astype(np.float32)
inner=ndi.gaussian_filter(ndi.binary_erosion(water1,iterations=1).astype(np.float32),1.0)
terr=dtm-0.7*inner
terr.astype('<f4').tofile(B+'terrain_core.f32')
# ---------------- ortho core (6400) ----------------
o6=np.asarray(Image.open(D+'orto_core_6400.jpg').convert('RGB')).astype(np.float32)
def up8(m,blur=4.0):
    a=cv2.resize(m.astype(np.float32),(6400,6400),interpolation=cv2.INTER_LINEAR)
    return cv2.GaussianBlur(a,(0,0),blur)
# building footprints (+~1.2 m margin) -> fill with surrounding ground colours (normalized convolution)
bm=up8(ndi.binary_dilation(bfoot,iterations=1),2.0)>0.35
valid=(~bm).astype(np.float32)
fill=np.zeros_like(o6); wsum=np.zeros(o6.shape[:2],np.float32)
acc=o6*valid[...,None]
for s in (6,16,40):
    num=cv2.GaussianBlur(acc,(0,0),s); den=cv2.GaussianBlur(valid,(0,0),s)
    ok=(den>0.05)&(wsum<0.5)
    fill[ok]=num[ok]/den[ok,None]; wsum[ok]=1
o6b=np.where(bm[...,None],fill,o6)
# feather the boundary
fe=cv2.GaussianBlur(bm.astype(np.float32),(0,0),3)
o6b=o6*(1-fe[...,None])+np.where(bm[...,None],o6b,fill*0+o6b)*fe[...,None]
# understory darkening under tree canopy (keeps the ortho colour but darker/desaturated)
tm=up8(ndi.binary_erosion(tree,iterations=1),3.0)
lum=o6b.mean(axis=2,keepdims=True)
dark=(o6b*0.55+lum*0.12)*0.62
o6c=o6b*(1-tm[...,None])+dark*tm[...,None]
Image.fromarray(np.clip(o6c,0,255).astype(np.uint8)).save(B+'ortho_core.jpg',quality=93,subsampling=0)
# ---------------- water masks (RGBA 4096): R big, G small, B rearing, A north ----------------
lab4=cv2.resize(labels,(4096,4096),interpolation=cv2.INTER_NEAREST)
wmask=np.zeros((4096,4096,4),np.uint8)
for ch,l in enumerate((1,2,4,3)):
    m=(lab4==l).astype(np.float32)
    m=cv2.GaussianBlur(m,(0,0),0.9)
    wmask[...,ch]=np.clip(m*255,0,255).astype(np.uint8)
Image.fromarray(wmask,'RGBA').save(B+'water_mask.png')
# ---------------- trees (watershed on CHM) ----------------
o32=np.asarray(Image.open(D+'orto_core_6400.jpg').convert('RGB').resize((3200,3200),Image.BOX)).astype(np.float32)/255
chm=np.where(tree,ndsm,0).astype(np.float32)
chs=ndi.gaussian_filter(chm,0.7)
mx3=ndi.maximum_filter(chs,size=3); mx5=ndi.maximum_filter(chs,size=5)
peaks=tree&(chs>2.5)&(((chs<12)&(chs>=mx3))|((chs>=12)&(chs>=mx5)))
mk,npk=ndi.label(peaks)
markers=mk.astype(np.int32)
inv=(np.clip(40-chs,0,40)*1000).astype(np.uint16)
inv[~tree]=65000
ws=ndi.watershed_ift(inv,markers)
ws[~tree]=0
print('peaks',npk,'ws px',(ws>0).sum())
ids=np.arange(1,npk+1)
area=ndi.sum(np.ones_like(chs),ws,ids)
cy,cx=np.array(ndi.center_of_mass(np.ones_like(chs),ws,ids)).T
hmax=ndi.maximum(chm,ws,ids)
py,px=np.array(ndi.center_of_mass(peaks.astype(np.float32),mk,ids)).T
trees=[]
for i in range(npk):
    if area[i]<1.5 or hmax[i]<2.6: continue
    r=np.sqrt(area[i]/np.pi)*1.12
    h=float(hmax[i])
    r=float(np.clip(r,0.9,min(9.0,0.75*h+1.0)))
    # crown centre: mix of peak and region centroid
    ry=0.5*py[i]+0.5*cy[i]; rx=0.5*px[i]+0.5*cx[i]
    ry+=rng.normal(0,0.15); rx+=rng.normal(0,0.15)
    E=461150+rx+0.5; N=5585250-ry-0.5
    gi=int(np.clip(round(ry),0,799)); gj=int(np.clip(round(rx),0,799))
    g=float(terr[gi,gj])
    # colour from ortho (0.25 m), disc of 0.55 r
    rr=max(1,int(r*0.55*4)); yy=int(ry*4+2); xx=int(rx*4+2)
    patch=o32[max(0,yy-rr):yy+rr+1,max(0,xx-rr):xx+rr+1].reshape(-1,3)
    col=np.median(patch,axis=0) if len(patch) else np.array([0.2,0.3,0.15])
    bright=np.percentile(patch.mean(axis=1),85) if len(patch) else 0.3
    trees.append([E-OX,g,-(N-ON),r,h,col[0],col[1],col[2],float(bright),float(rng.random())])
trees=np.array(trees,np.float32)
print('core trees',len(trees),'mean r',trees[:,3].mean(),'mean h',trees[:,4].mean())
# ---------------- shrubs ----------------
sh=[]
ys,xs=np.nonzero(shrub)
sel=rng.random(len(ys))<0.33
for y,x in zip(ys[sel],xs[sel]):
    h=float(ndsm[y,x]);
    E=461150+x+0.5+rng.uniform(-0.5,0.5); N=5585250-y-0.5+rng.uniform(-0.5,0.5)
    col=o32[y*4:y*4+4,x*4:x*4+4].reshape(-1,3).mean(axis=0)
    r=float(np.clip(0.55*h+0.35,0.6,1.5))
    sh.append([E-OX,float(terr[y,x]),-(N-ON),r,max(h,0.9),col[0],col[1],col[2],float(col.mean()*1.2),float(rng.random())])
sh=np.array(sh,np.float32)
print('shrubs',len(sh))
# ---------------- context (3 m) ----------------
dsc=tifffile.imread(D+'dmp1g_context_3m.tif').astype(np.float32)
dtc=tifffile.imread(D+'dmr5g_context_3m.tif').astype(np.float32)
oc=np.asarray(Image.open(D+'orto_context_3000.jpg').convert('RGB')).astype(np.float32)
oc3=cv2.resize(oc,(1000,1000),interpolation=cv2.INTER_AREA)/255
R,G,Bc=oc3[...,0],oc3[...,1],oc3[...,2]
exc=(2*G-R-Bc)/(R+G+Bc+1e-3)
nc=np.clip(dsc-dtc,0,None)
vegc=(nc>2.5)&(exc>0.03)
bldc=(nc>2.5)&(exc<0.02)
bldc=ndi.binary_opening(bldc,np.ones((2,2)))
# core region in context grid: rows/cols where pixel centre inside core bbox
xc=460050+np.arange(1000)*3+1.5; yc=5586350-np.arange(1000)*3-1.5
incx=(xc>461150)&(xc<461950); incy=(yc>5584450)&(yc<5585250)
core=np.outer(incy,incx)
terrc=dtc+np.where(bldc,ndi.gaussian_filter(nc*bldc,0.6),0)
# water in context: flatten using context ortho? keep dtm
# replace core cells with core terrain (bilinear) - 0.25 m so the core mesh sits on top
from scipy.interpolate import RegularGridInterpolator
ycore=5585250-np.arange(800)-0.5; xcore=461150+np.arange(800)+0.5
interp=RegularGridInterpolator((ycore[::-1],xcore),terr[::-1],bounds_error=False,fill_value=None)
YY,XX=np.meshgrid(yc,xc,indexing='ij')
cvals=interp(np.stack([YY[core],XX[core]],-1))
terrc[core]=cvals-0.25
terrc.astype('<f4').tofile(B+'terrain_ctx.f32')
# context ortho: darken under canopy
tmc=cv2.GaussianBlur(cv2.resize(ndi.binary_erosion(vegc).astype(np.float32),(3000,3000),interpolation=cv2.INTER_LINEAR),(0,0),1.5)
lumc=oc.mean(axis=2,keepdims=True)
ocd=oc*(1-tmc[...,None])+((oc*0.55+lumc*0.12)*0.62)*tmc[...,None]
Image.fromarray(np.clip(ocd,0,255).astype(np.uint8)).save(B+'ortho_ctx.jpg',quality=92)
# context trees: 3 m CHM, wedge visible from the flight
chc=np.where(vegc&~core,nc,0)
chcs=ndi.gaussian_filter(chc,0.7)
pk=(chcs>=ndi.maximum_filter(chcs,size=3))&(chcs>3)&vegc&~core
ctr=[]
cam=np.array([461480,5584760])
ys,xs=np.nonzero(pk)
for y,x in zip(ys,xs):
    E=xc[x]+rng.uniform(-1,1); N=yc[y]+rng.uniform(-1,1)
    d=np.hypot(E-cam[0],N-cam[1]); brg=(np.degrees(np.arctan2(E-cam[0],N-cam[1]))+360)%360
    if d>1700 or not (115<=brg<=295): continue
    h=float(nc[y,x]); r=float(np.clip(0.28*h+1.6,2.0,6.5))
    col=oc[y*3:y*3+3,x*3:x*3+3].reshape(-1,3).mean(axis=0)/255
    ctr.append([E-OX,float(dtc[y,x]),-(N-ON),r,h,col[0],col[1],col[2],float(col.mean()*1.3),float(rng.random())])
ctr=np.array(ctr,np.float32)
print('context trees',len(ctr))
np.save(B+'trees_core.npy',trees); np.save(B+'shrubs.npy',sh); np.save(B+'trees_ctx.npy',ctr)
allt=np.concatenate([trees,sh,ctr]) ; kinds=np.concatenate([np.zeros(len(trees)),np.ones(len(sh)),np.full(len(ctr),2)]).astype(np.float32)
out=np.concatenate([allt,kinds[:,None]],1).astype('<f4')
out.tofile(B+'trees.f32')
json.dump({'count':int(len(out)),'stride':11,'core':int(len(trees)),'shrubs':int(len(sh)),'ctx':int(len(ctr)),
           'fields':['x','ground','z','r','h','r_','g_','b_','bright','seed','kind']},open(B+'trees.json','w'))
