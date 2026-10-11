SP='scripts/'
s=open('scripts/build.mjs').read()
def rep(a,b,c=1):
    global s
    assert s.count(a)==c,(s.count(a),a[:80]); s=s.replace(a,b)
rep("// Klonowiec Trout Area Cup podzim 2026 — Den 1 «den v číslech».","// Klonowiec Trout Area Cup podzim 2026 — Den 2 + srovnání s Dnem 1 (odvozeno z build.mjs, track zkrácený na 2:05).")
rep("const D = JSON.parse(fs.readFileSync(path.join(ROOT, '02_SELECT/data_d1.json'), 'utf8'));",
    "const D = JSON.parse(fs.readFileSync(path.join(ROOT, '02_SELECT/data_d2.json'), 'utf8'));\nconst D1 = JSON.parse(fs.readFileSync(path.join(ROOT, '02_SELECT/data_d1.json'), 'utf8'));\nconst OUT = path.join(ROOT, 'proto_d2');")
rep("const BEATS_F = path.join(ROOT, '03_MUSIC/track.beats.json');","const BEATS_F = path.join(ROOT, '03_MUSIC/track_d2_edit.beats.json');")
rep("fs.existsSync(path.join(PROTO, 'assets/track.wav'))","fs.existsSync(path.join(PROTO, 'assets/track_d2.wav'))")
rep("const DAYEND_T = HAS_TRACK ? 129.8 : DUR - 25;","const DAYEND_T = 100.3;")
rep("const PRE = 12;","const PRE = 19.5;")
rep("""const KN = HAS_TRACK
  ? [[DAY0, 0], [6 * 60 + 30, 3], [7 * 60 + 20, 7.6], [7 * 60 + 50, 10.6], [8 * 60, PRE], [700, 61.23], [760, 76.46], [870, 112.6], [900, 122.16], [DAY1, DAYEND_T]]
  : [[DAY0, 0], [6 * 60 + 30, 3], [7 * 60 + 20, 7.6], [7 * 60 + 50, 10.6], [8 * 60, PRE], [DAY1, DUR - TAIL]];""",
"""// zkrácená píseň: intro 0–19.5, groove = kola 1–8, breakdown 57.9–65.6 = díky Davide, drop 65.6–113.5 = lídři → ryby≠body → vyhlášení → srovnání, outro 113.5–125
const KN = [[DAY0, 0], [6 * 60 + 30, 5.6], [7 * 60 + 20, 11.4], [7 * 60 + 50, 15.3], [8 * 60, PRE], [700, 57.95], [760, 65.6], [870, 86.1], [900, 92.4], [DAY1, DAYEND_T]];""")
rep("const TL = HAS_TRACK ? { tab: 14, org: 5, host: 7, mont: 24 } : { tab: 11, org: 4, host: 5, mont: 0 };","const TL = { cmp1: 6.6, cmp2: 6.6 };")
rep('<div class="l1"><span>OPĚT</span></div><div class="l1 red"><span>POLSKO</span></div>','<div class="l1"><span>DEN</span></div><div class="l1 red"><span>DRUHÝ</span></div>')
rep('<div class="l3"><span>Den 1 · sobota 10. 10. 2026 · Łowisko Klonówiec</span></div><div class="l3 w"><span>${D.weather.min}–${D.weather.max} °C · déšť ${D.weather.rain_pct} % · vítr ${D.weather.wind_ms} m/s</span></div></div>`);',
    '<div class="l3"><span>Den 2 · neděle 11. 10. 2026 · Łowisko Klonówiec</span></div><div class="l3 w"><span>+ srovnání s 1. dnem</span></div></div>`);')
rep("const tiles = [[480, 'kg', 'pstruhů v revíru'], [2700, '', 'ryb · Ø 180 g'], [100, 'kg', 'navíc před každým dnem']];",
    "const tiles = [[100, 'kg', 'navíc před 2. dnem'], [555, '', 'ryb · Ø 180 g'], [580, 'kg', 'celkem nasazeno']];")
rep('${Array.from({ length: 270 }, (_, i) => `<i id="dd${i}"></i>`).join(\'\')}','${Array.from({ length: 56 }, (_, i) => `<i id="dd${i}"></i>`).join(\'\')}')
rep("for (let i = 0; i < 270; i++) out.push(","for (let i = 0; i < 56; i++) out.push(")
rep('el.textContent=(${i === 2} ? "+" : "")+','el.textContent=(${i === 0} ? "+" : "")+')
rep("photo('d1_05', a, b, 'dim')","photo('d2_03', a, b, 'dim')")
rep("<em>${CTRY.length} země · 40 anglers</em>","<em>${CTRY.length} země · ${A.length} anglers</em>")
rep("const RPH = ['d1_10', 'd1_08', 'd1_09', 'd1_11', 'd1_06', 'd1_07', 'd1_03', 'd1_04'];","const RPH = ['d1_10', 'd2_03', 'd1_09', 'd1_08', 'd2_02', 'd1_06', 'd1_11', 'd2_04'];")
rep("const extra = k === 5 ? `<div class=\"plate\"><b>Jiří Nachlinger</b><i>Trout Area CZ</i></div>` : '';","const extra = '';")
st=s.index("  // ===== 6) oběd"); en=s.index("  // ===== 7)")
s=s[:st]+'''  // ===== 6) oběd → díky Davide (breakdown) =====
  {
    const a = tOf('11:40'), b = tOf('12:40');
    scene('s-host', a, b, `${photo('d2_01', a, b, 'dimx')}<div class="dav" id="dav"><div class="dvi" style="background-image:url(assets/photos/david.jpg)"></div></div><div class="host"><div class="hk"><span>Děkujeme</span></div><div class="hn"><span>David Helman</span></div>
      <div class="hs" id="hs">Hostitel · 2 dny · ${fmt(TOTAL + D.d1_total)} ulovených ryb</div>
      <div class="kp" id="kp"><img src="assets/kolorowe_logo.png" alt="Kolorowe Pstrągi"><div><b>Kolorowe Pstrągi · Łowisko Klonówiec</b><span>Klonowiec 37B, Polsko · +48 539 946 787 · rezervace telefonicky</span></div></div></div>`);
    T('#dav', { opacity: 0, scale: 0.85, rotation: -4 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.6)' }, onBeat(a + 0.05)); T('#dav .dvi', { scale: 1.12 }, { scale: 1, duration: len(a, b), ease: 'sine.out' }, a);
    rise('#s-host .hk span', a + 0.15); rise('#s-host .hn span', a + 0.15 + BEAT); fade('#hs', a + 0.4 + BEAT * 2); fade('#kp', a + 0.6 + BEAT * 4, 0.5);
    T('#kp img', { rotation: -90, scale: 0.6 }, { rotation: 0, scale: 1, duration: 0.6, ease: 'back.out(1.6)' }, onBeat(a + 0.6 + BEAT * 4));
  }
'''+s[en:]
rep("photo('d1_07', a, b, 'dimx')}<div class=\"h2\"><span>Závod lídrů</span>","photo('d2_05', a, b, 'dimx')}<div class=\"h2\"><span>Závod lídrů</span>")
rep("photo('d1_04', a, b, 'dimx')}<div class=\"h2\"><span>Ryby ≠ body</span>","photo('d2_04', a, b, 'dimx')}<div class=\"h2\"><span>Ryby ≠ body</span>")
rep("const tf = G.downbeats.find((t) => t > a + 4.6) ?? a + 5;","const tf = G.downbeats.find((t) => t > a + 3.6) ?? a + 4;")
rep("const hi = [SEL.findIndex((x) => x.last === 'Stoklasa'), SEL.findIndex((x) => x.last === 'Švub')];","const hi = [0, SEL.findIndex((x) => x.rank === 1)].filter((v, i, z) => v >= 0 && z.indexOf(v) === i);")
rep('<div class="snote" id="snote"><b>Stoklasa: 91 ryb → 4. místo</b> · Švub: 95 ryb → 1. místo</div>`);',
    '<div class="snote" id="snote"><b>${SEL[0].last}: ${SEL[0].fish} ryb → ${SEL[0].rank}. místo</b> · ${byRank[0].last}: ${byRank[0].fish} ryb → 1. místo</div>`);')
rep("photo('d1_02', a, b, 'top')","photo('d2_08', a, b, 'top')")
st=s.index("  // ===== 10a)"); en=s.index("  T('#gh-intro', { opacity: 0 }")
s=s[:st]+open(SP+'tail_d2.js').read()+s[en:]
st=s.index("  { // sektory: běh přes 20 dlaždic"); en=s.index("  { // HUD: mezi koly krokuje")
s=s[:st]+'''  { // srovnání: okvětní lístky Dne 2 bijí na doby jako pady
    const a = DAYEND_T + 1.6, b = DAYEND_T + TL.cmp1;
    padRun((k) => `#pt2_${k}`, 12, a, b, 1.7, 0.24);
  }
'''+s[en:]
rep("  eq((k) => `#pb${k + 1}`, 40, tOf('12:00') + 4.6, tOf('12:40'), 0.5);\n","")
rep("<title>Klonówiec 2026 – Den 1 v číslech","<title>Klonówiec 2026 – Den 2 v číslech")
rep('src="assets/track.wav"','src="assets/track_d2.wav"')
rep("fs.writeFileSync(path.join(PROTO, file), html);","fs.writeFileSync(path.join(OUT, file), html);")
css='''
  /* Den 2: srovnání */
  .polar { position:absolute; ${P ? `left:50%; margin-left:${f(-38 * u)}; top:${f(SC.top + 17 * u)};` : `left:${px(14)}; top:${f(SC.top + 13 * u)};`} }
  .polar::before { content:''; position:absolute; inset:${px(-1)}; border-radius:50%; background:radial-gradient(circle, rgba(238,242,249,.96) 0 58%, rgba(238,242,249,.0) 72%); }
  .polar svg { position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
  .polar .rg { fill:none; stroke:rgba(11,30,66,.12); stroke-width:${px(0.15)}; } .polar text { fill:#304285; font-family:Montserrat; font-weight:800; }
  .polar .pt1 { fill:#c9d3ee; stroke:#8ea2d8; stroke-width:${px(0.12)}; } .polar .pt2 { fill:#304285; }
  .polar .pt2:first-of-type { fill:var(--red); }
  .polar .pc { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); text-align:center; font-family:Montserrat; color:#0b1e42; }
  .polar .pc b { display:block; font-weight:900; font-size:${px(P ? 7 : 5)}; line-height:1; color:var(--red); } .polar .pc span { display:block; font-weight:800; font-size:${px(P ? 2.2 : 1.6)}; letter-spacing:.12em; text-transform:uppercase; }
  .polar .pc i { display:block; font-style:normal; font-weight:600; font-size:${px(P ? 2 : 1.4)}; opacity:.7; margin-top:${px(0.4)}; }
  .cmpt { position:absolute; ${P ? `left:${px(6)}; right:${px(6)}; bottom:${f(H - SC.bot + 3 * u)}; display:grid; grid-template-columns:1fr 1fr 1fr; gap:${px(1.6)};` : `right:${px(5)}; width:${px(46)}; top:${f(SC.top + 16 * u)}; display:flex; flex-direction:column; gap:${px(1.6)};`} }
  .ct { background:rgba(238,242,249,.96); border-radius:${px(1.6)}; padding:${px(1.6)} ${px(2.2)}; color:#0b1e42; font-family:Montserrat; box-shadow:0 ${px(0.8)} ${px(3)} rgba(0,0,0,.3); position:relative; }
  .ct b { display:block; font-weight:900; font-size:${px(P ? 5.4 : 5)}; line-height:1; } .ct span { display:block; font-weight:700; font-size:${px(P ? 1.9 : 1.7)}; letter-spacing:.06em; text-transform:uppercase; color:#304285; margin-top:${px(0.5)}; }
  .ct.red b { color:var(--red); } .ct i { position:absolute; right:${px(1.4)}; top:${px(1.4)}; width:${px(2)}; height:${px(2)}; border-radius:${px(0.4)}; } .ct .sw1 { background:#c9d3ee; border:${px(0.15)} solid #8ea2d8; } .ct .sw2 { background:#304285; }
  .mvw .mv { fill:none; stroke-linecap:round; stroke-dasharray:1; stroke-dashoffset:1; } .mvw .ax { stroke:#8ea2d8; stroke-width:${px(0.2)}; } .mvw .tk { stroke:#8ea2d8; stroke-width:${px(0.15)}; }
  .mvw text { fill:#304285; font-family:Montserrat; font-weight:700; }
  .mvr { position:absolute; transform:translateY(-50%); display:flex; align-items:center; gap:${px(1)}; font-family:Montserrat; color:#0b1e42; white-space:nowrap; }
  .mvr b { font-weight:900; color:#fff; background:#304285; border-radius:${px(0.8)}; padding:${px(0.1)} ${px(0.8)}; min-width:${px(P ? 3.6 : 3)}; text-align:center; } .mvr span { font-weight:800; } .mvr em { font-style:normal; font-weight:900; color:var(--red); }
  .mvr:first-of-type b { background:var(--red); }
  .fsp { display:flex; gap:${px(3)}; font-family:Montserrat; font-weight:700; font-size:${px(P ? 3 : 2.2)}; color:var(--ice); } .fsp b { font-weight:900; color:#fff; font-size:1.3em; }
'''
i=s.index("</style>"); s=s[:i]+css+s[i:]
open('scripts/build_d2.mjs','w').write(s); print('ok')
