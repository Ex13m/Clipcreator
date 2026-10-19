import subprocess, json, os
P='/home/user/Clipcreator/projects/mcr-2026-sponzori'
B=[('start',0.0),('intro>venue',14.698),('venue>troutshop',25.704),('troutshop>activefishing',34.876),('activefishing>moonky',44.025),('moonky>jigovky',53.197),('jigovky>broll',62.345),('broll>brollbreak',64.180),('brollbreak>velkaryba',67.825),('velkaryba>bosset',76.951),('bosset>gausseholler',86.076),('gausseholler>finale',95.148),('end',119.131)]
frames=set(); groups=[]
for name,t in B:
    d=round(t*30); fl=[d-3,d-1,d,d+1,d+3]
    fl=[f for f in fl if 0<=f<=3573]
    groups.append((name,t,fl)); frames.update(fl)
S=[('intro 5.1 dark',[150,152,153,156,160]),('intro static 5.5-6.4',[165,172,180,190,193]),('intro freeze 10.1',[299,303,310,312]),
   ('activefishing bright 40.3',[1207,1209,1210,1211,1213]),('activefishing 42.2',[1264,1267,1270]),('moonky static 46.6',[1397,1402,1408]),
   ('velkaryba static 75.7-76.6',[2270,2280,2286,2297,2299]),('bosset static 80.0',[2398,2405,2410]),('bosset freeze 83.7-84.3',[2510,2520,2528,2530]),
   ('GH freeze 91.0-91.6',[2730,2738,2747,2749]),('GH freeze 94.2-94.9',[2825,2835,2846,2848]),('finale static 108.5-109.6',[3255,3270,3289,3291]),
   ('finale static 114.5-115.3',[3434,3447,3460,3462]),('finale end 117.4-119.1',[3520,3540,3555,3573])]
for name,fl in S: groups.append((name,None,fl)); frames.update(fl)
fr=sorted(frames)
expr='+'.join(f'eq(n\\,{f})' for f in fr)
open('sel.txt','w').write(f"select='{expr}',scale=540:960:flags=lanczos")
subprocess.run(['ffmpeg','-v','error','-y','-i',P+'/renders/draft2_film_9x16.mp4','-filter_script:v','sel.txt','-vsync','0','fr/x_%04d.png'],check=True)
files=sorted(os.listdir('fr'))
assert len(files)==len(fr),(len(files),len(fr))
for f,n in zip(files,fr): os.rename('fr/'+f,f'fr/f{n:04d}.png')
json.dump(groups,open('groups.json','w'))
print(len(fr),'frames')
