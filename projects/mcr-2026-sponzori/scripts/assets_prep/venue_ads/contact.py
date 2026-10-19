import sys
from PIL import Image, ImageDraw, ImageFont
Image.MAX_IMAGE_PIXELS=None
O='/home/user/Clipcreator/projects/mcr-2026-sponzori/assets_prep/venue/ads/'
items=[('h1_arena_disc.png','H1 arena lens (ortho ČÚZK, AI 4k)'),('h1_pond_island_3d.png','H1 Malý Sporťáček island 3D'),('h1_pond_island.png','H1 pond island flat'),
('h2_trout_potocak.png','H2 pstruh obecný (potočák), AI 4k'),('h3_mcr_trophy.png','H3 MČR 2026 trophy (poster), AI 4k'),
('s1_smoked_trout_pair.png','S1 uzení pstruzi (prodejna)'),('s2_etched_trout_sticker.png','S2 etched trout sticker (logo)'),('s2_etched_trout_ink.png','S2 etched trout ink (tint)'),
('../../libechov/logo.png','logo badge (existing)')]
bgs=[('#1a212e',(26,33,46)),('#f8f8f8',(248,248,248)),('#17a1c8',(23,161,200))]
cell=420; lab=34
fnt=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',18)
sheet=Image.new('RGB',(cell*3,(cell+lab)*len(items)),(10,12,16))
d=ImageDraw.Draw(sheet)
for r,(f,t) in enumerate(items):
    im=Image.open(O+f).convert('RGBA'); w,h=im.size
    th=im.copy(); th.thumbnail((cell-24,cell-24),Image.Resampling.LANCZOS)
    y=r*(cell+lab)
    d.text((10,y+7),f'{t}  —  {f.split("/")[-1]}  {w}×{h}',fill=(230,230,230),font=fnt)
    for c,(n,bg) in enumerate(bgs):
        tile=Image.new('RGBA',(cell,cell),bg+(255,))
        t2=th
        if 'ink' in f and c==0:
            import numpy as np
            arr=np.array(th); arr[...,:3]=(232,236,240); t2=Image.fromarray(arr,'RGBA')
        tile.alpha_composite(t2,((cell-th.width)//2,(cell-th.height)//2))
        sheet.paste(tile.convert('RGB'),(c*cell,y+lab))
sheet.save(O+'_sheet.jpg',quality=86)
print(sheet.size)
