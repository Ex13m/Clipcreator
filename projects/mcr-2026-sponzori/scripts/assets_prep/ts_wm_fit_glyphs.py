import numpy as np, cv2, json
from PIL import Image, ImageDraw, ImageFont
T=np.load('wm_union.npy'); H,W=T.shape
known=(T>=0); band=np.zeros_like(known); band[38:150,30:1175]=True; known&=band
C=np.clip(T/0.0784,0,1.0)
SX=4; w=800; size=133.28; X0=46.48; Y0=9.58
f=ImageFont.truetype(f'mont{w}.ttf',int(round(size*SX)))
text='TROUTSHOP.EU'; xs=[]; cx=0
for ch in text: xs.append(cx/SX); cx+=f.getlength(ch)
GW=200; PAD=24
def base(ch):
    im=Image.new('L',(GW*SX,H*SX),0); ImageDraw.Draw(im).text((0,0),ch,font=f,fill=255)
    a=np.array(im,np.float32)/255.0
    return cv2.resize(a,(GW,H),interpolation=cv2.INTER_AREA)
res=[]
for i,ch in enumerate(text):
    g=base(ch); gx=X0+xs[i]
    cols=np.where(g.max(0)>0.01)[0]; gw=cols.max()+1
    xa=int(max(0,gx-PAD)); xb=int(min(W,gx+gw+PAD))
    Cc=C[:,xa:xb]; Kc=known[:,xa:xb]
    def place(x,y,bl):
        o=cv2.warpAffine(g,np.float32([[1,0,x-xa],[0,1,y]]),(xb-xa,H),flags=cv2.INTER_LINEAR)
        return cv2.GaussianBlur(o,(0,0),bl) if bl>0 else o
    g0=place(gx,Y0,0)
    m=(cv2.dilate((g0>0.01).astype(np.uint8),np.ones((11,11),np.uint8))>0)&Kc
    vis=(m&(g0>0.5)).sum()/max(1,(g0>0.5).sum())
    best=(None,0.0,0.0,0.0)
    if vis>0.2:
        for dx in np.arange(-16,16.01,1.0):
            for dy in np.arange(-2,2.01,1.0):
                o=place(gx+dx,Y0+dy,0.8); e=float(np.mean((o[m]-Cc[m])**2))
                if best[0] is None or e<best[0]: best=(e,dx,dy,0.8)
        e0,dx0,dy0,_=best
        for dx in np.arange(dx0-1,dx0+1.01,0.25):
            for dy in np.arange(dy0-1,dy0+1.01,0.25):
                for bl in (0.4,0.8,1.2):
                    o=place(gx+dx,Y0+dy,bl); e=float(np.mean((o[m]-Cc[m])**2))
                    if e<best[0]: best=(e,dx,dy,bl)
    res.append(dict(ch=ch,x=float(gx),vis=float(vis),err=best[0],dx=float(best[1]),dy=float(best[2]),blur=float(best[3])))
    print(ch,round(float(vis),2),best,flush=True)
json.dump(res,open('wm_glyphs.json','w'))
