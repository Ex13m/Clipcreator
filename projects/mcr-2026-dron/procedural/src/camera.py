# Camera path: one continuous Catmull-Rom spline (position) + eased look-at target, realistic DJI speeds.
import numpy as np, json, tifffile, sys
from scipy.interpolate import RegularGridInterpolator
D='/home/user/Clipcreator/projects/mcr-2026-sponzori/drone/data/'
B='/home/user/Clipcreator/projects/mcr-2026-sponzori/drone/procedural/build/'
OX,ON=461550.0,5584850.0
FPS=30; NF=120
dtm=tifffile.imread(D+'dtm_core_1m_render.tif'); dsm=tifffile.imread(D+'dsm_core_1m_render.tif')
yy=5585250-np.arange(800)-0.5; xx=461150+np.arange(800)+0.5
gi=RegularGridInterpolator((yy[::-1],xx),dtm[::-1]); si=RegularGridInterpolator((yy[::-1],xx),dsm[::-1])
POND=np.array([461451.67,5584691.84,167.19])
# --- keyframes (UTM E, N, height Bpv) ---
P_end=np.array([461486.0,5584755.0,227.5])
P_mid=np.array([461498.6,5584782.0,236.3])
P_start=np.array([461513.5,5584809.2,245.6])
ctrl=[2*P_start-P_mid, P_start, P_mid, P_end, 2*P_end-P_mid]
def catmull(p0,p1,p2,p3,t,alpha=0.5):
    # centripetal Catmull-Rom
    def tj(ti,pi,pj): return ti+np.linalg.norm(pj-pi)**alpha
    t0=0; t1=tj(t0,p0,p1); t2=tj(t1,p1,p2); t3=tj(t2,p2,p3)
    tt=t1+(t2-t1)*t
    A1=(t1-tt)/(t1-t0)*p0+(tt-t0)/(t1-t0)*p1
    A2=(t2-tt)/(t2-t1)*p1+(tt-t1)/(t2-t1)*p2
    A3=(t3-tt)/(t3-t2)*p2+(tt-t2)/(t3-t2)*p3
    B1=(t2-tt)/(t2-t0)*A1+(tt-t0)/(t2-t0)*A2
    B2=(t3-tt)/(t3-t1)*A2+(tt-t1)/(t3-t1)*A3
    return (t2-tt)/(t2-t1)*B1+(tt-t1)/(t2-t1)*B2
# dense arc-length table
segs=[(ctrl[0],ctrl[1],ctrl[2],ctrl[3]),(ctrl[1],ctrl[2],ctrl[3],ctrl[4])]
dense=[]
for s in segs:
    for t in np.linspace(0,1,2001)[:-1]: dense.append(catmull(*s,t))
dense.append(ctrl[3]); dense=np.array(dense)
cum=np.concatenate([[0],np.cumsum(np.linalg.norm(np.diff(dense,axis=0),axis=1))]); Ltot=cum[-1]
def at_s(s): 
    i=np.searchsorted(cum,s); i=np.clip(i,1,len(cum)-1); f=(s-cum[i-1])/(cum[i]-cum[i-1]+1e-12)
    return dense[i-1]*(1-f)+dense[i]*f
# speed profile: mild ease-in-out (clip is cut from a longer shot): v(u) = a + b*sin(pi u)^2 shaped, ends slower
def prog(u):
    # integral of v(u)=1-k*cos(2*pi*u) style ease mixed with slow-down towards end
    k1,k2=0.22,0.18
    # v = 1 + k1*sin(pi*u)^2*... keep simple: smootherstep blend
    lin=u; e=u*u*(3-2*u)
    return 0.78*lin+0.22*e
# look-at target: from a point SE of the pond (frames big pond + forest) easing onto the pond centre
T_start=np.array([461506.0,5584728.0,169.0])
T_end=POND.copy()
def ease(u): return u*u*(3-2*u)
rngp=np.random.default_rng(1957)
def micro(seed,amp,t):
    r=np.random.default_rng(seed); v=0
    for f in (0.31,0.53,0.87,1.37):
        v+=np.sin(2*np.pi*f*t+r.uniform(0,6.28))*r.uniform(0.5,1.0)
    return amp*v/2.5
frames=[]
for f in range(NF):
    t=f/FPS; u=f/(NF-1)
    s=prog(u)*Ltot
    p=at_s(s)
    p=p+np.array([micro(11,0.12,t),micro(12,0.12,t),micro(13,0.08,t)])
    tg=T_start+(T_end-T_start)*ease(u)
    d=tg-p
    yaw=(np.degrees(np.arctan2(d[0],d[1]))+360)%360
    pitch=np.degrees(np.arctan2(d[2],np.hypot(d[0],d[1])))
    yaw+=micro(21,0.12,t); pitch+=micro(22,0.08,t); roll=micro(23,0.10,t)
    g=float(gi([[p[1],p[0]]])[0]); sfc=float(si([[p[1],p[0]]])[0])
    frames.append(dict(f=f,t=t,E=float(p[0]),N=float(p[1]),H=float(p[2]),yaw=float(yaw),pitch=float(pitch),roll=float(roll),
                       agl=float(p[2]-g),clear=float(p[2]-sfc),
                       pos=[float(p[0]-OX),float(p[2]),float(-(p[1]-ON))]))
sp=[np.linalg.norm(np.array([frames[i+1]['E']-frames[i]['E'],frames[i+1]['N']-frames[i]['N'],frames[i+1]['H']-frames[i]['H']]))*FPS for i in range(NF-1)]
info=dict(length_m=float(Ltot),speed_min=float(min(sp)),speed_max=float(max(sp)),speed_avg=float(np.mean(sp)),
          yaw0=frames[0]['yaw'],yaw1=frames[-1]['yaw'],pitch0=frames[0]['pitch'],pitch1=frames[-1]['pitch'],
          agl0=frames[0]['agl'],agl1=frames[-1]['agl'],min_clear=min(fr['clear'] for fr in frames),
          vfov_16x9=45.6,vfov_9x16=73.7)
json.dump(dict(info=info,origin=[OX,ON],frames=frames),open(B+'camera.json','w'),indent=0)
print(json.dumps(info,indent=1))
