# Building footprints (lidar nDSM + ortho overrides), roof fitting and mesh export.
import numpy as np, cv2, json, struct
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
from scipy.interpolate import RegularGridInterpolator
Image.MAX_IMAGE_PIXELS=None
D='/home/user/Clipcreator/projects/mcr-2026-sponzori/drone/data/'
B='/home/user/Clipcreator/projects/mcr-2026-sponzori/drone/procedural/build/'
OX,ON=461550.0,5584850.0
z=np.load(B+'cls_inputs.npz'); ndsm=z['ndsm']; exg=z['exg']; lum=z['lum']; dtm=z['dtm']; dsm=z['dsm']; water=z['water']
lab=np.load(B+'bld_lab.npy'); feats={f['id']:f for f in json.load(open(B+'bld_feats.json'))}
o6=Image.open(D+'orto_core_6400.jpg').convert('RGB')
rng=np.random.default_rng(7)
EXCLUDE={1021,1087,1198,1287,1006,1150,1249,951,893}
OVERRIDE_REPLACE={993,692,667}   # handled by ortho segmentation below
def auto_ok(f):
    if f['id'] in EXCLUDE or f['id'] in OVERRIDE_REPLACE: return False
    if f['area']<14 or f['W']<3.2: return False
    if f['L']/f['W']>4.5 and f['W']<8: return False   # roads / hedges
    if f['exg']>0.035: return False
    if f['rect']>=0.55:
        if f['lum']<0.22 and f['exg']>-0.02: return False
        if f['treering']>0.85 and f['lum']<0.32: return False
        return True
    return f['rect']>=0.35 and f['lum']>0.33 and f['exg']<0.025 and f['treering']<0.8
# ---------- helpers ----------
yy=5585250-np.arange(800)-0.5; xx=461150+np.arange(800)+0.5
dsm_i=RegularGridInterpolator((yy[::-1],xx),dsm[::-1],bounds_error=False,fill_value=None)
dtm_i=RegularGridInterpolator((yy[::-1],xx),dtm[::-1],bounds_error=False,fill_value=None)
def seg_ortho(box,rule,close=5):
    x0,y0,x1,y1=box
    c=np.asarray(o6.crop((int((x0-461150)*8),int((5585250-y1)*8),int((x1-461150)*8),int((5585250-y0)*8)))).astype(np.int16)
    m=rule(c[...,0],c[...,1],c[...,2]).astype(np.uint8)
    m=cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
    m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((close,close),np.uint8))
    n,l,st,_=cv2.connectedComponentsWithStats(m)
    k=1+np.argmax(st[1:,cv2.CC_STAT_AREA])
    cnts,_=cv2.findContours((l==k).astype(np.uint8),cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)
    c=max(cnts,key=cv2.contourArea).reshape(-1,2).astype(np.float64)
    E=x0+(c[:,0]+0.5)/8; N=y1-(c[:,1]+0.5)/8
    return np.stack([E,N],1)
def rect_from_pts(P):
    (cx,cy),(w,h),ang=cv2.minAreaRect(P.astype(np.float32))
    a=np.radians(ang)
    if w>=h: L,W,axis=w,h,np.array([np.cos(a),np.sin(a)])
    else: L,W,axis=h,w,np.array([-np.sin(a),np.cos(a)])
    return dict(c=np.array([cx,cy]),L=float(L),W=float(W),axis=axis)
buildings=[]
def add_rect(P,source,forced=None):
    r=rect_from_pts(P); r['source']=source; r['forced']=forced; buildings.append(r)
def max_rect(g):
    # largest all-ones axis-aligned rectangle in binary grid g -> (area,r0,r1,c0,c1)
    H,W=g.shape; h=np.zeros(W,int); best=(0,0,0,0,0)
    for i in range(H):
        h=np.where(g[i],h+1,0); st=[]
        for j in range(W+1):
            cur=h[j] if j<W else 0
            s0=j
            while st and st[-1][1]>=cur:
                s0,hh=st.pop()
                a=hh*(j-s0)
                if a>best[0]: best=(a,i-hh+1,i+1,s0,j)
            st.append((s0,cur))
    return best
def decompose(P,r,res=0.25,maxn=3,minarea=14.0):
    c,ax=r['c'],r['axis']; perp=np.array([-ax[1],ax[0]])
    L,W=r['L'],r['W']
    nu=int(np.ceil(L/res))+2; nv=int(np.ceil(W/res))+2
    rel=P-c; uv=np.stack([rel@ax,rel@perp],1)
    q=np.stack([(uv[:,0]+L/2)/res+1,(uv[:,1]+W/2)/res+1],1).astype(np.int32)
    g=np.zeros((nv,nu),np.uint8); cv2.fillPoly(g,[q],1)
    out=[]
    for k in range(maxn):
        a,r0,r1,c0,c1=max_rect(g.astype(bool))
        if a*res*res<minarea or (r1-r0)*res<3.0 or (c1-c0)*res<3.0: break
        u0=(c0-1)*res-L/2; u1=(c1-1)*res-L/2; v0=(r0-1)*res-W/2; v1=(r1-1)*res-W/2
        cc=c+(u0+u1)/2*ax+(v0+v1)/2*perp
        lu,lv=u1-u0,v1-v0
        if lu>=lv: out.append(dict(c=cc,L=float(lu),W=float(lv),axis=ax.copy(),source='lidar_dec',forced=None))
        else: out.append(dict(c=cc,L=float(lv),W=float(lu),axis=perp.copy(),source='lidar_dec',forced=None))
        # remove covered cells, keep a 1-cell overlap so wings join
        g[r0+1:r1-1,c0+1:c1-1]=0
        g[r0:r1,c0:c1]=0
    return out
# ---------- auto (lidar) ----------
auto_ids=[i for i,f in feats.items() if auto_ok(f)]
objs=ndi.find_objects(lab)
poly_bld=[]
for i in auto_ids:
    sl=objs[i-1]; m=(lab[sl]==i).astype(np.uint8)
    m=cv2.resize(m,(m.shape[1]*4,m.shape[0]*4),interpolation=cv2.INTER_LINEAR)
    m=cv2.GaussianBlur(m.astype(np.float32),(0,0),2.0)>0.5
    cnts,_=cv2.findContours(m.astype(np.uint8),cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)
    c=max(cnts,key=cv2.contourArea).reshape(-1,2).astype(np.float64)
    E=461150+sl[1].start+(c[:,0]+0.5)/4; N=5585250-sl[0].start-(c[:,1]+0.5)/4
    P=np.stack([E,N],1)
    r=rect_from_pts(P)
    area=cv2.contourArea(P.astype(np.float32))
    fill=area/(r['L']*r['W'])
    if fill>0.84:
        add_rect(P,'lidar')
    else:
        for rc in decompose(P,r,maxn=4):
            # reject pieces that are vegetation / ground
            cc,ax_=rc['c'],rc['axis']; pp=np.array([-ax_[1],ax_[0]])
            us=np.linspace(-rc['L']/2+0.5,rc['L']/2-0.5,6); vs=np.linspace(-rc['W']/2+0.5,rc['W']/2-0.5,4)
            Q=np.array([cc+u*ax_+v*pp for u in us for v in vs])
            rr=np.clip((5585250-Q[:,1]).astype(int),0,799); cc_=np.clip((Q[:,0]-461150).astype(int),0,799)
            if exg[rr,cc_].mean()<0.04 and np.median(ndsm[rr,cc_])>2.3:
                buildings.append(rc)
# ---------- ortho overrides ----------
white=lambda R,G,B:(np.minimum(np.minimum(R,G),B)>170)&((np.maximum(np.maximum(R,G),B)-np.minimum(np.minimum(R,G),B))<45)
red=lambda R,G,B:(R>G+35)&(R>110)
dark=lambda R,G,B:((R+G+B)/3<100)&((R+G+B)/3>25)&((np.maximum(np.maximum(R,G),B)-np.minimum(np.minimum(R,G),B))<30)&((2*G-R-B)<10)
add_rect(seg_ortho((461398,5584638,461436,5584679),white),'ortho_white_hall')
add_rect(seg_ortho((461413,5584637,461432,5584656),red),'ortho_red_annex')
add_rect(seg_ortho((461421,5584649,461431,5584659),white,3),'ortho_white_box')
Ps=seg_ortho((461489,5584862,461517,5584899),dark,9)
add_rect(Ps,'ortho_solar',forced=dict(eave=5.2,ridge=7.8,model='gable_long'))
# ---------- roof fitting ----------
def fit_roof(b):
    c,L,W,ax=b['c'],b['L'],b['W'],b['axis']; perp=np.array([-ax[1],ax[0]])
    us=np.arange(-L/2+0.9,L/2-0.89,0.5); vs=np.arange(-W/2+0.9,W/2-0.89,0.5)
    if len(us)<2 or len(vs)<2:
        us=np.linspace(-L/4,L/4,3); vs=np.linspace(-W/4,W/4,3)
    U,V=np.meshgrid(us,vs); U=U.ravel(); V=V.ravel()
    P=c+U[:,None]*ax+V[:,None]*perp
    zs=dsm_i(np.stack([P[:,1],P[:,0]],1))
    # ground: low percentile of dtm on the outline
    t=np.linspace(0,1,40)
    corners=[c+sx*L/2*ax+sy*W/2*perp for sx,sy in((-1,-1),(1,-1),(1,1),(-1,1))]
    outline=np.concatenate([corners[k]+(corners[(k+1)%4]-corners[k])*t[:,None] for k in range(4)])
    g=float(np.percentile(dtm_i(np.stack([outline[:,1],outline[:,0]],1)),15))
    models={'flat':np.zeros_like(U),'gable_long':np.abs(V),'gable_short':np.abs(U),'hip':np.maximum(np.abs(V),np.abs(U)-(L-W)/2)}
    best=None
    for name,f in models.items():
        if name=='flat':
            a=np.median(zs); res=zs-a; b_=0
        else:
            A=np.stack([np.ones_like(f),-f],1); sol,*_=np.linalg.lstsq(A,zs,rcond=None); a,b_=sol; res=zs-(a-b_*f)
            if not (0.14<b_<1.25): continue
        rmse=float(np.sqrt(np.mean(res**2)))*(1.0 if name=='flat' else 0.8)+(0.06 if name=='gable_short' else 0)+(0.03 if name=='hip' else 0)
        if best is None or rmse<best[0]: best=(rmse,name,float(a),float(b_))
    _,name,a,b_=best
    half={'flat':0,'gable_long':W/2,'gable_short':L/2,'hip':W/2}[name]
    if name=='flat':
        eave=ridge=a
    else:
        ridge=a+0.35; eave=ridge-b_*half
    eave=max(eave,g+2.3); ridge=max(ridge,eave)
    if name!='flat' and ridge-eave<0.6: name='flat'; ridge=eave
    return dict(model=name,ground=g,eave=float(eave),ridge=float(ridge))
# ---------- mesh ----------
V=[]   # x,y,z, nx,ny,nz, kind, u,v, bid
def L2(E,N): return (E-OX,-(N-ON))
def tri(p0,p1,p2,kind,uv0,uv1,uv2,bid):
    p0,p1,p2=map(np.asarray,(p0,p1,p2))
    n=np.cross(p1-p0,p2-p0); ln=np.linalg.norm(n)
    if ln<1e-9: return
    n=n/ln
    for p,uv in ((p0,uv0),(p1,uv1),(p2,uv2)): V.append([*p,*n,kind,*uv,bid])
def quad(a,b,c,d,kind,uva,uvb,uvc,uvd,bid):
    tri(a,b,c,kind,uva,uvb,uvc,bid); tri(a,c,d,kind,uva,uvc,uvd,bid)
def P3(EN,y):
    x,zz=L2(EN[0],EN[1]); return [x,y,zz]
def wall(e0,e1,y0,y1,bid,u0=0.0):
    # outward normal must point away from the centre: caller orders CCW (viewed from above, in E/N)
    l=float(np.linalg.norm(np.asarray(e1)-np.asarray(e0)))
    quad(P3(e0,y0),P3(e1,y0),P3(e1,y1),P3(e0,y1),1,(u0,0),(u0+l,0),(u0+l,y1-y0),(u0,y1-y0),bid)
    return u0+l
def build_rect(b,bid):
    r=b['roof']; c,L,W,ax=b['c'],b['L'],b['W'],b['axis']; perp=np.array([-ax[1],ax[0]])
    o=0.45 if r['model']!='flat' else 0.12
    Lw,Ww=L-2*o,W-2*o
    g=r['ground']-0.4; eave=r['eave']; ridge=r['ridge']
    if r['model']=='gable_short':   # swap axes so ridge is along 'ax'
        ax,perp=perp,-ax; L,W=W,L; Lw,Ww=Ww,Lw; model='gable_long'
    else: model=r['model']
    cw=[c+sx*Lw/2*ax+sy*Ww/2*perp for sx,sy in((-1,-1),(1,-1),(1,1),(-1,1))]
    # ensure CCW in (E,N)
    area=sum(cw[k][0]*cw[(k+1)%4][1]-cw[(k+1)%4][0]*cw[k][1] for k in range(4))
    if area<0: cw=cw[::-1]
    # wall top at eave where roof meets wall (slope continues to overhang)
    slope=(ridge-eave)/(W/2) if model!='flat' else 0
    wall_top=eave+slope*o if model!='flat' else eave
    u=0
    for k in range(4): u=wall(cw[k],cw[(k+1)%4],g,wall_top,bid,u)
    if model=='gable_long':
        for sx in (-1,1):   # gable triangles at the two short ends
            e=c+sx*Lw/2*ax
            a1=e-Ww/2*perp; a2=e+Ww/2*perp
            top=P3(e,ridge); pa=P3(a1,wall_top); pb=P3(a2,wall_top)
            # orientation: normal outward along sx*ax
            tri(pa,pb,top,1,(0,wall_top-g),(Ww,wall_top-g),(Ww/2,ridge-g),bid) if sx>0 else tri(pb,pa,top,1,(0,wall_top-g),(Ww,wall_top-g),(Ww/2,ridge-g),bid)
    # roof
    E0=[c+sx*L/2*ax+sy*W/2*perp for sx,sy in((-1,-1),(1,-1),(1,1),(-1,1))]
    zE=eave-slope*0 if model=='flat' else eave-slope*0  # roof outline at fitted eave (overhang tip)
    if model=='flat':
        pts=[P3(p,ridge) for p in E0]
        quad(pts[0],pts[1],pts[2],pts[3],0,(0,0),(0,0),(0,0),(0,0),bid)
        # fascia/parapet band
        for k in range(4):
            a,bq=E0[k],E0[(k+1)%4]
            quad(P3(a,ridge-0.35),P3(bq,ridge-0.35),P3(bq,ridge+0.12),P3(a,ridge+0.12),2,(0,0),(1,0),(1,1),(0,1),bid)
        quad(*[P3(p,ridge+0.12) for p in E0],0,(0,0),(0,0),(0,0),(0,0),bid)
    elif model=='gable_long':
        r0=P3(c-L/2*ax,ridge); r1=P3(c+L/2*ax,ridge)
        for sy in (-1,1):
            e0=P3(c-L/2*ax+sy*W/2*perp,eave); e1=P3(c+L/2*ax+sy*W/2*perp,eave)
            if sy<0: quad(e0,e1,r1,r0,0,(0,0),(0,0),(0,0),(0,0),bid)
            else: quad(e1,e0,r0,r1,0,(0,0),(0,0),(0,0),(0,0),bid)
            # fascia under eave edge
            f0=P3(c-L/2*ax+sy*W/2*perp,eave-0.22); f1=P3(c+L/2*ax+sy*W/2*perp,eave-0.22)
            if sy<0: quad(f0,f1,e1,e0,2,(0,0),(1,0),(1,1),(0,1),bid)
            else: quad(f1,f0,e0,e1,2,(0,0),(1,0),(1,1),(0,1),bid)
        # verge boards on gable ends
        for sx in (-1,1):
            for sy in (-1,1):
                a=P3(c+sx*L/2*ax+sy*W/2*perp,eave); bq=P3(c+sx*L/2*ax,ridge)
                a2=[a[0],a[1]-0.22,a[2]]; b2=[bq[0],bq[1]-0.22,bq[2]]
                if sx*sy>0: quad(a2,b2,bq,a,2,(0,0),(1,0),(1,1),(0,1),bid)
                else: quad(b2,a2,a,bq,2,(0,0),(1,0),(1,1),(0,1),bid)
    else:  # hip
        hl=max((L-W)/2,0.01)
        r0=P3(c-hl*ax,ridge); r1=P3(c+hl*ax,ridge)
        e=[P3(p,eave) for p in E0]  # order: (-,-),(+,-),(+,+),(-,+)
        quad(e[0],e[1],r1,r0,0,(0,0),(0,0),(0,0),(0,0),bid)
        quad(e[2],e[3],r0,r1,0,(0,0),(0,0),(0,0),(0,0),bid)
        tri(e[1],e[2],r1,0,(0,0),(0,0),(0,0),bid)
        tri(e[3],e[0],r0,0,(0,0),(0,0),(0,0),bid)
        for k in range(4):
            a,bq=E0[k],E0[(k+1)%4]
            quad(P3(a,eave-0.22),P3(bq,eave-0.22),P3(bq,eave),P3(a,eave),2,(0,0),(1,0),(1,1),(0,1),bid)
def fix_normals_outward():
    pass
def build_poly(bp,bid):
    P=bp['poly']; area=sum(P[k][0]*P[(k+1)%len(P)][1]-P[(k+1)%len(P)][0]*P[k][1] for k in range(len(P)))
    if area<0: P=P[::-1]
    # flat-ish roof at robust height
    m=np.zeros((1,1))
    mn=P.min(0); mx=P.max(0)
    gx,gy=np.meshgrid(np.arange(mn[0],mx[0],0.7),np.arange(mn[1],mx[1],0.7))
    inside=np.array([cv2.pointPolygonTest(P.astype(np.float32),(float(a),float(b_)),False)>0 for a,b_ in zip(gx.ravel(),gy.ravel())])
    pts=np.stack([gx.ravel()[inside],gy.ravel()[inside]],1)
    if len(pts)<3: return
    zs=dsm_i(np.stack([pts[:,1],pts[:,0]],1))
    g=float(np.percentile(dtm_i(np.stack([P[:,1],P[:,0]],1)),15))
    top=max(float(np.percentile(zs,60)),g+2.5)
    u=0
    for k in range(len(P)): u=wall(P[k],P[(k+1)%len(P)],g-0.4,top,bid,u)
    # roof: fan triangulation via cv2 subdiv is overkill -> ear clipping
    idx=earclip(P)
    for a,b_,c_ in idx: tri(P3(P[a],top),P3(P[b_],top),P3(P[c_],top),0,(0,0),(0,0),(0,0),bid)
    for k in range(len(P)):
        a,bq=P[k],P[(k+1)%len(P)]
        quad(P3(a,top-0.3),P3(bq,top-0.3),P3(bq,top+0.1),P3(a,top+0.1),2,(0,0),(1,0),(1,1),(0,1),bid)
    for a,b_,c_ in idx: tri(P3(P[a],top+0.1),P3(P[b_],top+0.1),P3(P[c_],top+0.1),0,(0,0),(0,0),(0,0),bid)
    bp['roof']=dict(model='poly',ground=g,eave=top,ridge=top)
def earclip(P):
    idx=list(range(len(P))); out=[]
    def cross(o,a,b): return (a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0])
    guard=0
    while len(idx)>3 and guard<10000:
        guard+=1; n=len(idx); found=False
        for k in range(n):
            i0,i1,i2=idx[(k-1)%n],idx[k],idx[(k+1)%n]
            if cross(P[i0],P[i1],P[i2])<=1e-9: continue
            ok=True
            for j in idx:
                if j in (i0,i1,i2): continue
                if cross(P[i0],P[i1],P[j])>=0 and cross(P[i1],P[i2],P[j])>=0 and cross(P[i2],P[i0],P[j])>=0: ok=False;break
            if ok: out.append((i0,i1,i2)); idx.pop(k); found=True; break
        if not found: break
    if len(idx)==3: out.append(tuple(idx))
    return out
meta=[]
for bid,b in enumerate(buildings):
    rf=fit_roof(b)
    if b.get('forced'):
        f=b['forced']; rf['eave']=rf['ground']+f['eave']; rf['ridge']=rf['ground']+f['ridge']; rf['model']=f['model']
    b['roof']=rf
    build_rect(b,float(rng.random())+(2.0 if (b['L']>22 or b['source'].startswith('ortho_white')) else 0.0))
    meta.append(dict(src=b['source'],c=[float(b['c'][0]),float(b['c'][1])],L=b['L'],W=b['W'],**rf))
for bp in poly_bld:
    build_poly(bp,float(rng.random()))
    if 'roof' in bp: meta.append(dict(src=bp['source'],c=[float(bp['poly'][:,0].mean()),float(bp['poly'][:,1].mean())],**bp['roof']))
arr=np.array(V,np.float32)
# make normals face outward / upward consistently: for walls compare with vector from building centre is costly; instead
# rely on DoubleSide lighting fix in shader (normals flipped toward camera). Export.
arr.astype('<f4').tofile(B+'buildings.f32')
json.dump(dict(vertices=int(len(arr)),stride=10,buildings=meta),open(B+'buildings.json','w'),indent=0)
print('rect buildings',len(buildings),'poly',len(poly_bld),'verts',len(arr))
from collections import Counter
print(Counter(m['model'] for m in meta))
# final 1 m mask for terrain/ortho/trees
mask=np.zeros((800*4,800*4),np.uint8)
def tomask(P):
    q=np.stack([(P[:,0]-461150)*4,(5585250-P[:,1])*4],1).astype(np.int32); cv2.fillPoly(mask,[q],1)
for b in buildings:
    c,L,W,ax=b['c'],b['L'],b['W'],b['axis']; perp=np.array([-ax[1],ax[0]])
    tomask(np.array([c+sx*L/2*ax+sy*W/2*perp for sx,sy in((-1,-1),(1,-1),(1,1),(-1,1))]))
for bp in poly_bld: tomask(bp['poly'])
m1=cv2.resize(mask.astype(np.float32),(800,800),interpolation=cv2.INTER_AREA)>0.3
np.save(B+'bld_final_mask.npy',m1)
np.save(B+'bld_final_mask_q.npy',mask)
# QA overlay
o=np.asarray(o6.resize((3200,3200),Image.BILINEAR)).copy()
ov=o.copy(); ov[mask>0]=(ov[mask>0]*0.4+np.array([255,0,255])*0.6).astype(np.uint8)
img=Image.fromarray(ov); d=ImageDraw.Draw(img)
for k,m in enumerate(meta):
    x=(m['c'][0]-461150)*4; y=(5585250-m['c'][1])*4
    d.text((x,y),m['model'][:2],fill=(255,255,0))
x0,x1,y0,y1=461290,461660,5584590,5584960
img.crop(((x0-461150)*4,(5585250-y1)*4,(x1-461150)*4,(5585250-y0)*4)).resize((1110,1110)).save(B+'qa/bld_final.jpg',quality=88)
