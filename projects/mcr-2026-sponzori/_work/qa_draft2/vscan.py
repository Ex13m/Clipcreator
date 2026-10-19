import numpy as np, subprocess, json, sys
P='/home/user/Clipcreator/projects/mcr-2026-sponzori'
src=P+'/renders/draft2_film_9x16.mp4'
w,h=270,480
cmd=['ffmpeg','-v','error','-i',src,'-vf',f'scale={w}:{h}:flags=area','-f','rawvideo','-pix_fmt','rgb24','-']
p=subprocess.Popen(cmd,stdout=subprocess.PIPE,bufsize=10**8)
fs=w*h*3; prev=None; rows=[]; i=0
while True:
    b=p.stdout.read(fs)
    if len(b)<fs: break
    f=np.frombuffer(b,np.uint8).reshape(h,w,3).astype(np.int16)
    g=(0.299*f[...,0]+0.587*f[...,1]+0.114*f[...,2])
    # exclude TA plate (top-left 64..364 x 250..~330 at 1080 scale → /4) and DRAFT badge bottom-left
    st=f.reshape(-1,3).std(0)
    row=dict(i=i,t=i/30,mean=float(g.mean()),std=float(g.std()),cstd=float(st.max()),
             p99=float(np.percentile(g,99)),p1=float(np.percentile(g,1)))
    if prev is not None:
        d=np.abs(f-prev).max(2)
        row.update(mad=float(d.mean()),mx=int(d.max()),frac=float((d>6).mean()))
    else: row.update(mad=None,mx=None,frac=None)
    rows.append(row); prev=f; i+=1
p.wait()
json.dump(rows,open('vscan.json','w'))
print('frames',i)
