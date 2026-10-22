"""Sestaví karusel partnerů MČR 2026 do JEDNOHO samostatného HTML (vše inline, média base64).

python3 scripts/build.py            -> dist/karusel_mcr2026.html   (H.264 MP4, produkční)
python3 scripts/build.py vp9        -> _work/karusel_test_vp9.html (VP9 WebM – jen QA v Playwright Chromium, který nemá H.264)
python3 scripts/build.py capture    -> _work/karusel_capture.html  (odkazy na 1080p VP9 + statiky 1080, režim KZ_CAPTURE pro záznam MP4)
"""
import base64, json, os, sys

P = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = f'{P}/_work/assets'; C = f'{P}/_work/clips'
variant = sys.argv[1] if len(sys.argv) > 1 else 'dist'

def b64(path): return base64.b64encode(open(path, 'rb').read()).decode()
def uri(path, mime): return f'data:{mime};base64,{b64(path)}'

# pořadí dle operátora 22. 10.: Líheň, GH, Activefishing, Bosset, Jigovky, Troutshop, Velká ryba, FT Fishing (předposlední), ČRS (poslední); bez Moonky
SPONSORS = [
    dict(key='venue', name='Líheň Liběchov', sub='Rybník Malý Sporťáček', url='lihenlibechov.cz', chip='Místo konání · MČR 2026', logo='venue'),
    dict(key='gausseholler', name='Gausse Holler Custom Lab', sub='Partner a informační sponzor', url='gausseholler.com', chip='Hlavní cena · Revolut 8', prize=True),
    dict(key='activefishing', name='Activefishing.cz', url='activefishing.cz', chip='Věnuje ceny · MČR 2026'),
    dict(key='bosset', name='Bosset.cz', url='bosset.cz', chip='Věnuje ceny · MČR 2026'),
    dict(key='jigovky', name='Jigovky.cz', url='jigovky.cz', chip='Věnuje ceny · MČR 2026'),
    dict(key='troutshop', name='Troutshop.eu', url='troutshop.eu', chip='Věnuje ceny · MČR 2026'),
    dict(key='velkaryba', name='Velká ryba', url='velka-ryba.cz', chip='Věnuje ceny · MČR 2026'),
    dict(key='ftfishing', name='FT Fishing', sub='Vše pro přívlač', url='ftfishing.cz', chip='Věnuje ceny · MČR 2026'),
    dict(key='crs', name='Český rybářský svaz', sub='Areál MČR · MO Mělník', url='rybsvaz.cz', chip='Děkujeme za podporu', static=True),
]

hi = variant == 'capture'
slides = [dict(type='intro', bg=uri(f'{A}/intro_bg.jpg', 'image/jpeg'))]
data = []
for s in SPONSORS:
    k = s['key']
    d = dict(type='partner', name=s['name'], sub=s.get('sub', ''), url=s['url'], href=f"https://{s['url']}/",
             chip=s['chip'], prize=bool(s.get('prize')), logo=uri(f'{A}/logo_{k}.png', 'image/png'))
    if s.get('static'):
        d['poster'] = uri(f"{A}/{k}{'_1080' if hi else ''}.jpg", 'image/jpeg'); d['kb'] = True
    else:
        d['poster'] = uri(f'{C}/{k}.jpg', 'image/jpeg'); d['video'] = k
        if variant == 'dist':
            data.append(f'<script type="application/octet-stream" id="d-{k}" data-type="video/mp4">{b64(f"{C}/{k}.mp4")}</script>')
        elif variant == 'vp9':
            data.append(f'<script type="application/octet-stream" id="d-{k}" data-type="video/webm">{b64(f"{C}/{k}.webm")}</script>')
        else:
            data.append(f'<script type="text/plain" id="d-{k}" data-type="video/webm" data-src="clips/{k}_1080.webm"></script>')
    slides.append(d)

ta = uri(f'{A}/ta_logo.png', 'image/png')
cfg = dict(interval=4.0, trans=0.75, ta=ta, slides=slides,
           videoType='video/mp4; codecs="avc1.4D401F"' if variant == 'dist' else 'video/webm; codecs="vp9"')

fonts = []
for w in (600, 800, 900):
    for sub, rng in (('latin', 'U+0000-00FF,U+2000-206F,U+2190-21FF'), ('latin-ext', 'U+0100-024F,U+1E00-1EFF')):
        fonts.append("@font-face{font-family:'Montserrat';font-style:normal;font-display:swap;font-weight:%d;src:url(data:font/woff2;base64,%s) format('woff2');unicode-range:%s}"
                     % (w, b64(f'{A}/mont-{sub}-{w}.woff2'), rng))

html = open(f'{P}/src/karusel.html', encoding='utf-8').read()
html = html.replace('/*__FONTS__*/', '\n'.join(fonts))
html = html.replace('/*__CFG__*/', json.dumps(cfg, ensure_ascii=False))
html = html.replace('<!--__DATA__-->', '\n'.join(data))
html = html.replace('__TA__', ta)
if hi:
    html = html.replace('<head>', '<head><script>window.KZ_CAPTURE=true</script>', 1)

out = {'dist': f'{P}/dist/karusel_mcr2026.html', 'vp9': f'{P}/_work/karusel_test_vp9.html', 'capture': f'{P}/_work/karusel_capture.html'}[variant]
os.makedirs(os.path.dirname(out), exist_ok=True)
open(out, 'w', encoding='utf-8').write(html)
print(out, f'{os.path.getsize(out)/1e6:.2f} MB')
