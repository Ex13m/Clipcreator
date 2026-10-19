import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
from scipy.optimize import minimize
T=np.load('wm_union.npy'); H,W=T.shape
known=(T>=0); band=np.zeros_like(known); band[38:150,30:1175]=True; known&=band
C=np.clip(T/0.0784,0,1.0)
SX=4
def render(w,size,ls,X,Y,xs=1.0):
    f=ImageFont.truetype(f'mont{w}.ttf',int(round(size*SX)))
    im=Image.new('L',(int(W*SX/xs)+10,H*SX),0); d=ImageDraw.Draw(im); cx=0
    for ch in 'TROUTSHOP.EU':
        d.text((cx,0),ch,font=f,fill=255); cx+=f.getlength(ch)+ls*SX
    a=np.array(im,np.float32)/255.0
    M=np.float32([[xs/SX,0,X],[0,1.0/SX,Y]])
    return cv2.warpAffine(a,M,(W,H),flags=cv2.INTER_AREA)
def err(p,w):
    size,ls,X,Y,xs=p
    R=render(w,size,ls,X,Y,xs)
    return float(np.mean((R[known]-C[known])**2))
res={}
for w in (600,700,800):
    best=None
    for size in np.arange(124,146,2.0):
        R=render(w,size,0,0,0)
        ys,xs_=np.where(R>0.5)
        X=42-xs_.min(); Y=45-ys.min()
        for ls in (-2,0,2):
            e=err((size,ls,X,Y,1.0),w)
            if best is None or e<best[0]: best=(e,(size,ls,X,Y,1.0))
    r=minimize(err,best[1],args=(w,),method='Nelder-Mead',options={'xatol':0.05,'fatol':1e-6,'maxiter':400,'initial_simplex':None})
    res[w]=(r.fun,r.x); print(w,best[0],r.fun,r.x)
w=min(res,key=lambda k:res[k][0]); p=res[w][1]
R=render(w,*p)
np.save('wm_fit.npy',R)
vis=np.zeros((H*2,W),np.uint8)
vis[:H]=(R*255).astype(np.uint8)
vis[H:]=np.clip(np.where(known,np.abs(R-C),0)*255*2,0,255).astype(np.uint8)
Image.fromarray(vis).save('view/wm_fit3.png')
print('chosen',w,p)
