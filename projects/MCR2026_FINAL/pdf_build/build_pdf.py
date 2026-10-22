import re,subprocess,base64,io,html,os
from PIL import Image
R='/home/user/Clipcreator/projects'
s=open(f'{R}/mcr-2026-bannery/texty/PLAN_publikace_23-10.md').read()
blocks=re.findall(r'### (\d\d:\d\d) – ([^\n]+)\n\nSoubor: `([^`]+)`\n\n```\n(.*?)\n```',s,re.S)
def b64(im,w):
    im=im.convert('RGB'); im.thumbnail((w,w*2)); b=io.BytesIO(); im.save(b,'JPEG',quality=78); return base64.b64encode(b.getvalue()).decode()
cards=[]
for t,title,f,txt in blocks:
    if f.endswith('.png'):
        k=f.split('_static')[0]; src=b64(Image.open(f'{R}/mcr-2026-bannery/renders/{k}/{f}'),900); cls='h'
    else:
        p=f'{R}/mcr-2026-sponzori/renders/{f}'; out=f'fr_{f}.png'
        subprocess.run(['ffmpeg','-v','error','-y','-ss','4','-i',p,'-frames:v','1',out],check=True)
        src=b64(Image.open(out),420); cls='v'
    cards.append(f'<section class="c"><div class="hd"><span class="t">{t}</span><span class="n">{html.escape(title)}</span></div><div class="row {cls}"><img src="data:image/jpeg;base64,{src}"><pre>{html.escape(txt.strip())}</pre></div><div class="f">{f}</div></section>')
head=s.split('## Texty k vložení')[0]
rows=re.findall(r'\| (\d\d:\d\d) \| ([^|]+) \| ([^|]+) \| `([^`]+)` \|',head)
tbl=''.join(f'<tr><td>{a}</td><td>{html.escape(b.strip())}</td><td>{html.escape(c.strip())}</td></tr>' for a,b,c,d in rows)
doc=f'''<!doctype html><html lang="cs"><head><meta charset="utf-8"><style>
@page{{size:A4;margin:14mm}}body{{font-family:"DejaVu Sans",Arial,sans-serif;color:#111;font-size:10.5pt}}
h1{{font-size:20pt;margin:0 0 4px}}.sub{{color:#555;margin-bottom:12px}}table{{width:100%;border-collapse:collapse;margin:8px 0 6px}}td{{border-bottom:1px solid #ddd;padding:4px 6px}}td:first-child{{font-weight:700;color:#c8102e;width:52px}}
.c{{page-break-inside:avoid;border:1px solid #ddd;border-radius:8px;padding:10px;margin:10px 0}}.hd{{display:flex;gap:10px;align-items:baseline;margin-bottom:8px}}.t{{font-weight:800;font-size:14pt;color:#c8102e}}.n{{font-weight:700;font-size:12pt}}
.row{{display:flex;gap:12px}}.row.h img{{width:300px;height:auto;border-radius:4px;flex:none;align-self:flex-start}}.row.v img{{width:120px;height:auto;border-radius:4px;flex:none}}
pre{{white-space:pre-wrap;font-family:inherit;margin:0;font-size:9.5pt;line-height:1.35}}.f{{color:#888;font-size:8pt;margin-top:6px}}
</style></head><body><h1>Plán publikace – MČR v Trout Area 2026</h1><div class="sub">pátek 23. 10. 2026 · Facebook: Trout Area Czech Republic · automaticky přes Zapier · čas SELČ</div>
<table>{tbl}</table><div style="page-break-after:always"></div>{''.join(cards)}</body></html>'''
open('plan.html','w').write(doc)
