import numpy as np, cv2, json
from PIL import Image, ImageDraw, ImageFont
T=np.load('wm_union.npy'); H,W=T.shape
known=T>=0
C=np.clip(np.where(known,T,0)/0.0784,0,1.0)
G=json.load(open('wm_glyphs.json'))
# interpolate missing O (index 7)
for i,g in enumerate(G):
    if g['err'] is None or (g['err']>0.1 and g['ch']!='.'):
        g['dx']=(G[i-1]['dx']+G[i+1]['dx'])/2; g['dy']=(G[i-1]['dy']+G[i+1]['dy'])/2; g['blur']=1.2
        print('interp',i,g['ch'],g['dx'])
SX=4; f=ImageFont.truetype('mont800.ttf',int(round(133.28*SX))); Y0=9.58
R=np.zeros((H,W),np.float32)
for g in G:
    im=Image.new('L',(200*SX,H*SX),0); ImageDraw.Draw(im).text((0,0),g['ch'],font=f,fill=255)
    a=cv2.resize(np.array(im,np.float32)/255.0,(200,H),interpolation=cv2.INTER_AREA)
    o=cv2.warpAffine(a,np.float32([[1,0,g['x']+g['dx']],[0,1,Y0+g['dy']]]),(W,H),flags=cv2.INTER_LINEAR)
    o=cv2.GaussianBlur(o,(0,0),max(g['blur'],1.0))
    R=np.maximum(R,o)
# trust observation where known & reliable; feather the switch
k=known.astype(np.float32)
k=cv2.erode(k,np.ones((3,3),np.uint8))
kb=cv2.GaussianBlur(k,(0,0),1.5)
F=kb*C+(1-kb)*R
F[F<0.04]=0
lm=cv2.dilate((R>0.02).astype(np.uint8),np.ones((7,7),np.uint8)).astype(np.float32)
F=F*cv2.GaussianBlur(lm,(0,0),1.0)
# full-size 1500 template (alpha)
full=np.zeros((1500,1500),np.float32)
full[660:850,150:1350]=F*0.0784
np.save('/home/user/Clipcreator/projects/mcr-2026-sponzori/scripts/assets_prep/ts_watermark_alpha_1500.npy',full.astype(np.float16))
Image.fromarray(np.clip(F*255,0,255).astype(np.uint8)).save('view/wm_final.png')
print('done', full.max())
