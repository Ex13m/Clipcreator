import numpy as np, cv2, json
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
Image.MAX_IMAGE_PIXELS=None
B='/home/user/Clipcreator/projects/mcr-2026-sponzori/drone/procedural/build/'
D='/home/user/Clipcreator/projects/mcr-2026-sponzori/drone/data/'
z=np.load(B+'cls_inputs.npz'); globals().update({k:z[k] for k in z.files})
tall=(ndsm>2.2)&~water
veg=(exg>0.045)|((exg>0.0)&(rough>0.45))
cand=tall&~veg
cand=ndi.binary_opening(cand,np.ones((2,2)))
cand=ndi.binary_closing(cand,np.ones((3,3)))
cand=ndi.binary_fill_holes(cand)
lab,k=ndi.label(cand)
treeish=tall&veg
objs=ndi.find_objects(lab)
feats=[]
for i,sl in enumerate(objs):
    m=(lab[sl]==i+1)
    area=m.sum()
    if area<12: continue
    cnts,_=cv2.findContours(m.astype(np.uint8),cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)
    c=max(cnts,key=cv2.contourArea)
    (cx,cy),(w,h),ang=cv2.minAreaRect(c.astype(np.float32))
    W,L=sorted([w+1,h+1])
    rect=area/(W*L)
    ring=ndi.binary_dilation(m,iterations=2,border_value=0)
    # boundary ring in global coords
    rs=(slice(max(sl[0].start-2,0),sl[0].stop+2),slice(max(sl[1].start-2,0),sl[1].stop+2))
    mm=(lab[rs]==i+1)
    ring=ndi.binary_dilation(mm,iterations=2)&~mm
    tf=treeish[rs][ring].mean()
    f=dict(id=i+1,area=int(area),W=float(W),L=float(L),rect=float(rect),lum=float(lum[sl][m].mean()),exg=float(exg[sl][m].mean()),
           rough=float(rough[sl][m].mean()),hmed=float(np.median(ndsm[sl][m])),treering=float(tf),
           r=int(sl[0].start+cy),c=int(sl[1].start+cx))
    feats.append(f)
json.dump(feats,open(B+'bld_feats.json','w'))
def score(f):
    ok = f['area']>=15 and f['W']>=3.5 and f['rect']>0.6 and f['L']/f['W']<7
    ok = ok and (f['lum']>0.24 or f['exg']<-0.02) and f['exg']<0.03
    ok = ok and not (f['treering']>0.8 and f['lum']<0.3)
    return ok
keep=[f['id'] for f in feats if score(f)]
print(len(feats),'cands',len(keep),'kept')
bld=np.isin(lab,keep)
np.save(B+'bld_auto.npy',bld); np.save(B+'bld_lab.npy',lab)
o=np.asarray(Image.open(D+'orto_core_4096.jpg').convert('RGB').resize((2400,2400),Image.BILINEAR)).astype(np.float32)
def up(m): return np.repeat(np.repeat(m,3,0),3,1)
ov=o.copy()
kept=up(bld); rej=up(cand&~bld)
ov[kept]=ov[kept]*0.45+np.array([255,0,255])*0.55
ov[rej]=ov[rej]*0.55+np.array([0,200,255])*0.45
img=Image.fromarray(ov.astype(np.uint8)); d=ImageDraw.Draw(img)
for f in feats:
    if f['area']>=12: d.text((f['c']*3,f['r']*3),str(f['id']),fill=(255,255,0))
# crop: x 461300..461650, y 5584600..5584950
x0,x1,y0,y1=461290,461660,5584590,5584960
img.crop(((x0-461150)*3,(5585250-y1)*3,(x1-461150)*3,(5585250-y0)*3)).save(B+'qa/bld_ids.jpg',quality=88)
