from PIL import Image, ImageDraw, ImageFont, ImageFilter
from fontTools.ttLib import TTFont
import numpy as np
F='/home/user/Clipcreator/projects/mcr-2026-sponzori/fonts/_ttf/'
D='/home/user/Clipcreator/projects/mcr-2026-sponzori/assets_prep/velkaryba/ads/'
CM={}
for r in ['latin','latin-ext']:
    for st in ['italic','normal']:
        CM[(r,st)]=set(TTFont(F+f'nunito-{r}-wght-{st}.ttf').getBestCmap().keys())
_fc={}
def font(size,w,st,r):
    k=(size,w,st,r)
    if k not in _fc:
        f=ImageFont.truetype(F+f'nunito-{r}-wght-{st}.ttf',size); f.set_variation_by_axes([w]); _fc[k]=f
    return _fc[k]
def text(layer,xy,s,size,w,italic,fill,track=0):
    st='italic' if italic else 'normal'; d=ImageDraw.Draw(layer); x,y=xy
    for ch in s:
        r='latin' if ord(ch) in CM[('latin',st)] else 'latin-ext'
        f=font(size,w,st,r); d.text((x,y),ch,font=f,fill=fill); x+=f.getlength(ch)+track*size
    return x
W,H=1080,1920
def frame(bgtop,bgbot,prod,head,sub,chips,glowc=(255,255,255),big='PŘÍVLAČ'):
    y=np.linspace(0,1,H)[:,None,None]
    im=Image.fromarray(((np.array(bgtop)*(1-y)+np.array(bgbot)*y)*np.ones((1,W,1))).astype(np.uint8)).convert('RGBA')
    g=Image.new('RGBA',(W,H),(0,0,0,0)); ImageDraw.Draw(g).ellipse((140,700,940,1400),fill=glowc+(80,)); im.alpha_composite(g.filter(ImageFilter.GaussianBlur(120)))
    L=Image.new('RGBA',(W,H),(0,0,0,0)); text(L,(-30,640),big,300,950,True,(255,255,255,26)); im.alpha_composite(L)
    p=Image.open(D+prod+'.png'); full=p.width; p.thumbnail((700,600)); px=(W-p.width)//2; py=940-p.height//2
    s=Image.open(D+prod+'_shadow.png'); k=p.width/full; s=s.resize((int(s.width*k),int(s.height*k))); im.alpha_composite(s,(W//2-s.width//2,py+p.height-s.height//2))
    im.alpha_composite(p,(px,py))
    T=Image.new('RGBA',(W,H),(0,0,0,0)); text(T,(64,400),head,112,950,True,(255,255,255,255),-0.01); text(T,(70,550),sub,44,700,False,(205,218,236,255)); im.alpha_composite(T)
    y0=1180
    for lab,val in chips:
        C=Image.new('RGBA',(W,H),(0,0,0,0)); end=text(C,(112,y0+52),val,42,850,False,(255,255,255,255)); text(C,(112,y0+18),lab.upper(),24,800,False,(175,195,225,255),0.06)
        box=Image.new('RGBA',(W,H),(0,0,0,0)); ImageDraw.Draw(box).rounded_rectangle((72,y0,int(end)+40,y0+118),28,fill=(255,255,255,34),outline=(255,255,255,90),width=2)
        im.alpha_composite(box); im.alpha_composite(C); y0+=138
    lg=Image.open(D+'logo_reverse_on_navy.png'); lg.thumbnail((250,120)); im.alpha_composite(lg,(W-64-lg.width,1440-lg.height))
    pl=Image.new('RGBA',(W,H),(0,0,0,0)); ImageDraw.Draw(pl).rounded_rectangle((64,250,364,346),12,fill=(255,255,255,255)); text(pl,(96,278),'TA CZ (plaketa)',30,800,False,(48,66,133,255)); im.alpha_composite(pl)
    return im.convert('RGB')
a=frame((24,60,107),(15,37,65),'H1_shimano_vanquish_fa_ce_c2000s','VŠE NA PŘÍVLAČ','Speciálka z Olomouce · od 2011',[('Shimano Rod Test Center','Pruty si vyzkoušíte u vody'),('Shimano Vanquish FA Competition Edition','145 g · 5,1 : 1 · 11 + 1 ložisek')])
b=frame((240,138,40),(24,60,107),'H2_shimano_cardiff_roll_swimmer_ce_orange_front','TROUT AREA','Shimano Cardiff Roll Swimmer CE · 4,5 g',[('velka-ryba.cz','„vhodná zejména pro Trout Areu“')],glowc=(255,220,150),big='CARDIFF')
c=frame((15,37,65),(8,16,30),'H3_illex_native_spoon_pink_yamame','NA PSTRUHY','Illex Native Spoon · 2,5 g · Pink Yamame',[('Plandavky na pstruhy','Illex · Shimano · Daiwa · Westin')],glowc=(214,48,122),big='PSTRUH')
s=Image.new('RGB',(W*3+40,H),(0,0,0)); s.paste(a,(0,0)); s.paste(b,(W+20,0)); s.paste(c,(2*W+40,0)); s=s.resize((s.width//2,s.height//2),Image.LANCZOS); s.save(D+'_brandworld.jpg',quality=88); print(s.size)
