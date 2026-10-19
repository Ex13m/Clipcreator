import numpy as np, json
from PIL import Image, ImageDraw
Image.MAX_IMAGE_PIXELS=None
B='build/'; D='/home/user/Clipcreator/projects/mcr-2026-sponzori/drone/data/'
cam=json.load(open(B+'camera.json'))
o=Image.open(D+'orto_context_3000.jpg').convert('RGB')
x0,y0,x1,y1=461050,5584250,461950,5585150   # view window
im=o.crop((x0-460050,5586350-y1,x1-460050,5586350-y0)).resize((1350,1350))
sc=1350/900
d=ImageDraw.Draw(im)
def P(E,N): return ((E-x0)*sc,(y1-N)*sc)
def rays(fr,vfov,aspect):
    yaw=np.radians(fr['yaw']); pit=np.radians(fr['pitch']); rol=np.radians(fr['roll'])
    ty=np.tan(np.radians(vfov)/2); tx=ty*aspect
    pts=[]
    for (sx,sy) in [(-1,-1),(-0.5,-1),(0,-1),(0.5,-1),(1,-1),(1,-0.5),(1,0),(1,0.5),(1,1),(0.5,1),(0,1),(-0.5,1),(-1,1),(-1,0.5),(-1,0),(-1,-0.5)]:
        v=np.array([sx*tx,sy*ty,1.0])  # x right, y up, z forward
        # roll about forward
        v=np.array([v[0]*np.cos(rol)-v[1]*np.sin(rol),v[0]*np.sin(rol)+v[1]*np.cos(rol),v[2]])
        # pitch: rotate (y,z)
        fy=v[1]*np.cos(pit)+v[2]*np.sin(pit); fz=-v[1]*np.sin(pit)+v[2]*np.cos(pit)
        # yaw: forward z -> (sin yaw, cos yaw) in (E,N); right x -> (cos yaw, -sin yaw)
        E=v[0]*np.cos(yaw)+fz*np.sin(yaw); N=-v[0]*np.sin(yaw)+fz*np.cos(yaw); U=fy
        if U>=-0.02: t=1500/np.hypot(E,N)
        else: t=(fr['H']-168.0)/(-U)
        t=min(t,1500/np.hypot(E,N))
        pts.append(P(fr['E']+E*t,fr['N']+N*t))
    return pts
cols={0:(255,60,60),60:(255,220,0),119:(0,255,255)}
for f,c in cols.items():
    fr=cam['frames'][f]
    d.polygon(rays(fr,73.7,9/16),outline=c,width=3)
    d.polygon(rays(fr,45.6,16/9),outline=tuple(int(v*0.6) for v in c),width=2)
    d.ellipse([*(np.array(P(fr['E'],fr['N']))-5),*(np.array(P(fr['E'],fr['N']))+5)],fill=c)
pts=[P(fr['E'],fr['N']) for fr in cam['frames']]
d.line(pts,fill=(255,255,255),width=2)
d.text((10,10),'footprints: red f0, yellow f60, cyan f119; bright=9:16 (VFOV 73.7), dim=16:9',fill=(255,255,255))
im.save(B+'qa/footprints.jpg',quality=88)
