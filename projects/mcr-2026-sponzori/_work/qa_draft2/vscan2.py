import numpy as np, subprocess, json
P='/home/user/Clipcreator/projects/mcr-2026-sponzori'
w,h=270,480
cmd=['ffmpeg','-v','error','-i',P+'/renders/draft2_film_9x16.mp4','-vf',f'scale={w}:{h}:flags=area','-f','rawvideo','-pix_fmt','rgb24','-']
p=subprocess.Popen(cmd,stdout=subprocess.PIPE,bufsize=10**8)
mask=np.ones((h,w),bool)
mask[55:95,10:100]=False   # TA plate (64..364 x 250..~340 @1080 → /4 with margin)
mask[455:480,0:70]=False   # DRAFT badge
fs=w*h*3; out=[]
while True:
    b=p.stdout.read(fs)
    if len(b)<fs: break
    f=np.frombuffer(b,np.uint8).reshape(h,w,3).astype(np.float32)[mask]
    out.append([float(f.std(0).max()), *map(float,f.mean(0))])
p.wait(); json.dump(out,open('vscan2.json','w')); print(len(out))
