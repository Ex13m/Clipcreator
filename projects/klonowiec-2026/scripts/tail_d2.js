  // ===== 10) SROVNÁNÍ 1: okvětní (polární) graf — kolo po kole Den 1 vs Den 2 =====
  {
    const a = DAYEND_T, b = DAYEND_T + TL.cmp1;
    const F1 = D1.fish_per_round, F2 = D.fish_per_round, mx = Math.max(...F1, ...F2);
    const S = P ? 76 * u : scH * 0.74, c = S / 2, rmax = S * 0.42, rmin = S * 0.13;
    const pet = (k, v, w) => { const a0 = (k * 30 - 90 - w) * Math.PI / 180, a1 = (k * 30 - 90 + w) * Math.PI / 180, r = rmin + (v / mx) * (rmax - rmin);
      return `M${(c + rmin * Math.cos(a0)).toFixed(1)},${(c + rmin * Math.sin(a0)).toFixed(1)} L${(c + r * Math.cos(a0)).toFixed(1)},${(c + r * Math.sin(a0)).toFixed(1)} A${r.toFixed(1)},${r.toFixed(1)} 0 0 1 ${(c + r * Math.cos(a1)).toFixed(1)},${(c + r * Math.sin(a1)).toFixed(1)} L${(c + rmin * Math.cos(a1)).toFixed(1)},${(c + rmin * Math.sin(a1)).toFixed(1)} A${rmin},${rmin} 0 0 0 ${(c + rmin * Math.cos(a0)).toFixed(1)},${(c + rmin * Math.sin(a0)).toFixed(1)}Z`; };
    const lab = F1.map((_, k) => { const an = (k * 30 - 90) * Math.PI / 180, r = rmax + S * 0.05; return `<text x="${(c + r * Math.cos(an)).toFixed(1)}" y="${(c + r * Math.sin(an) + S * 0.012).toFixed(1)}" text-anchor="middle" font-size="${(S * 0.032).toFixed(1)}">${k + 1}</text>`; }).join('');
    const rings = [100, 200, 300].map((v) => `<circle cx="${c}" cy="${c}" r="${(rmin + (v / mx) * (rmax - rmin)).toFixed(1)}" class="rg"/>`).join('');
    const p1 = F1.map((v, k) => `<path id="pt1_${k}" class="pt1" d="${pet(k, v, 13)}"/>`).join('');
    const p2 = F2.map((v, k) => `<path id="pt2_${k}" class="pt2" d="${pet(k, v, 8)}"/>`).join('');
    const drop = Math.round((1 - TOTAL / D.d1_total) * 100);
    scene('s-cmp1', a, b, `${photo('d2_06', a, b, 'dimx')}<div class="h2"><span>Den 1 vs Den 2</span><em>ryby kolo po kole · fish per round</em></div>
      <div class="polar" style="width:${f(S)}; height:${f(S)}"><svg viewBox="0 0 ${S.toFixed(0)} ${S.toFixed(0)}">${rings}${p1}${p2}${lab}</svg>
        <div class="pc"><b id="pcv">${fmt(TOTAL)}</b><span>Den 2</span><i>Den 1: ${fmt(D.d1_total)}</i></div></div>
      <div class="cmpt"><div class="ct" id="ct0"><i class="sw1"></i><b>${fmt(D.d1_total)}</b><span>ryb · Den 1</span></div><div class="ct" id="ct1"><i class="sw2"></i><b>${fmt(TOTAL)}</b><span>ryb · Den 2</span></div>
        <div class="ct red" id="ct2"><b>−${drop} %</b><span>ryby braly výrazně hůř</span></div></div>`);
    rise('#s-cmp1 .h2 span', a + 0.1); fade('#s-cmp1 .h2 em', a + 0.3);
    T('#s-cmp1 .polar', { opacity: 0, rotation: -40, scale: 0.8 }, { opacity: 1, rotation: 0, scale: 1, duration: 0.8, ease: 'expo.out' }, onBeat(a + 0.2));
    const bts = G.beats.filter((t) => t > a + 0.5).slice(0, 12);
    F1.forEach((_, k) => {
      T(`#pt1_${k}`, { scale: 0, transformOrigin: `${c}px ${c}px` }, { scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, a + 0.5 + k * 0.05);
      T(`#pt2_${k}`, { scale: 0, transformOrigin: `${c}px ${c}px` }, { scale: 1, duration: 0.45, ease: 'back.out(2.2)' }, (bts[Math.floor(k / 2)] ?? a + 1) + (k % 2) * BEAT / 2);
    });
    out.push(`{ const o={v:0}, el=document.getElementById("pcv"); tl.fromTo(o,{v:0},{v:${TOTAL},duration:2.2,ease:"power2.out",onUpdate(){el.textContent=Math.round(o.v).toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g,"\\u2009");}}, ${(a + 0.8).toFixed(3)}); }`);
    [0, 1, 2].forEach((i) => fade(`#ct${i}`, a + 1.2 + i * BEAT * 2));
    out.push(`tl.fromTo("#s-cmp1 .polar svg", {rotation:0}, {rotation:12, duration:${len(a, b)}, ease:"none", transformOrigin:"50% 50%"}, ${a.toFixed(3)});`);
  }
  // ===== 11) SROVNÁNÍ 2: posun pořadí Den 1 → Den 2 (žebřík se stuhami na skutečné škále 1–40) =====
  {
    const a = DAYEND_T + TL.cmp1, b = DAYEND_T + TL.cmp1 + TL.cmp2;
    const SEL = [...A].sort((x, y) => x.rank - y.rank).slice(0, 8).map((x) => ({ x, d1: (D1.anglers.find((z) => z.last === x.last && z.first === x.first) || {}).rank }));
    const CW = P ? 92 * u : W * 0.62, CH = P ? 64 * u : scH * 0.78, pt = 5 * u, pb = 2.5 * u, xl = CW * 0.16, xr = CW * 0.58;
    const yl = (r) => pt + ((r - 1) / 39) * (CH - pt - pb), yr = (i) => pt + i * ((CH - pt - pb) * 0.62 / 7);
    const fs = P ? 2.5 * u : 1.9 * u;
    const axis = [1, 10, 20, 30, 40].map((r) => `<line x1="${xl - 1.4 * u}" x2="${xl}" y1="${yl(r)}" y2="${yl(r)}" class="tk"/><text x="${xl - 2 * u}" y="${yl(r) + fs * 0.35}" text-anchor="end" font-size="${fs}">${r}.</text>`).join('')
      + `<line x1="${xl}" x2="${xl}" y1="${pt}" y2="${CH - pb}" class="ax"/>`;
    const rib = SEL.map(({ x, d1 }, i) => { if (!d1) return ''; const y1 = yl(d1), y2 = yr(i), xm = (xl + xr) / 2, up = d1 - x.rank;
      return `<path id="mv${i}" class="mv" d="M${xl},${y1.toFixed(1)} C${xm},${y1.toFixed(1)} ${xm},${y2.toFixed(1)} ${xr},${y2.toFixed(1)}" stroke="${up >= 10 ? '#e31e24' : '#304285'}" stroke-width="${(up >= 10 ? 0.9 : 0.55) * u}" pathLength="1"/><circle id="md${i}" cx="${xl}" cy="${y1.toFixed(1)}" r="${0.8 * u}" fill="${up >= 10 ? '#e31e24' : '#304285'}"/>`; }).join('');
    const rl = SEL.map(({ x, d1 }, i) => `<div class="mvr" id="mvr${i}" style="top:${f(yr(i))}; left:${f(xr + 1.4 * u)}; font-size:${f(fs)}"><b>${x.rank}.</b><span>${x.first[0]}. ${x.last}</span><em>${d1 ? (d1 - x.rank > 0 ? '▲' + (d1 - x.rank) : d1 - x.rank < 0 ? '▼' + (x.rank - d1) : '•') : ''}</em></div>`).join('');
    const star = SEL.reduce((m, s) => ((s.d1 || 0) - s.x.rank > (m.d1 || 0) - m.x.rank ? s : m), SEL[0]);
    scene('s-cmp2', a, b, `${photo('d2_07', a, b, 'dimx')}<div class="h2"><span>Den 1 → Den 2</span><em>top 8 dne 2 · odkud přišli</em></div>
      <div class="bump mvw" style="width:${f(CW)}; height:${f(CH)}"><div class="bhd" style="left:0; width:${f(xl)}">Den 1</div><div class="bhd" style="left:${f(xr)}; width:${f(CW - xr)}">Den 2</div>
        <svg viewBox="0 0 ${CW.toFixed(0)} ${CH.toFixed(0)}">${axis}${rib}</svg>${rl}</div>
      <div class="snote" id="snote2"><b>${star.x.first} ${star.x.last}: ${star.d1}. → ${star.x.rank}. místo</b> · největší skok dne</div>`);
    rise('#s-cmp2 .h2 span', a + 0.1); fade('#s-cmp2 .h2 em', a + 0.3);
    T('#s-cmp2 .bump', { opacity: 0, y: 3 * u }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, onBeat(a + 0.2));
    const bts = G.beats.filter((t) => t > a + 0.6).slice(0, 8);
    SEL.forEach((_, i) => { const t = bts[i] ?? a + 1 + i * 0.3;
      T(`#md${i}`, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.25, ease: 'back.out(3)' }, t);
      T(`#mv${i}`, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' }, t + 0.05);
      T(`#mvr${i}`, { opacity: 0, x: -2 * u }, { opacity: 1, x: 0, duration: 0.3, ease: 'expo.out' }, t + 0.6); });
    const si = SEL.indexOf(star);
    T(`#mv${si}`, { filter: 'drop-shadow(0 0 0px rgba(227,30,36,0))' }, { filter: `drop-shadow(0 0 ${px(1.2)} rgba(227,30,36,.9))`, duration: 0.3, yoyo: true, repeat: 5, immediateRender: false }, a + 4.2);
    fade('#snote2', a + 4.0);
  }
  // ===== 12) outro: 2 dny dohromady =====
  {
    const t2 = DAYEND_T + TL.cmp1 + TL.cmp2, t3 = DUR;
    scene('s-out', t2, t3, `<div class="fin"><div class="fv"><b id="fin-n">0</b><span>ryb za 2 dny · ≈ ${Math.round((TOTAL + D.d1_total) * 0.18)} kg</span></div>
      <div class="fsp"><span><b>${fmt(D.d1_total)}</b> Den 1</span><span><b>${fmt(TOTAL)}</b> Den 2</span></div>
      <div class="tap big" id="tap-out"><img src="assets/ta_logo_h.png" alt="Trout Area Czech Republic"></div><div class="fz"><span>Díky, Klonówiec · see you next time!</span></div></div>`);
    out.push(`{ const o={v:0}, el=document.getElementById("fin-n"); tl.fromTo(o,{v:0},{v:${TOTAL + D.d1_total},duration:2.4,ease:"power2.out",onUpdate(){el.textContent=Math.round(o.v).toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g,"\\u2009");}}, ${(t2 + 0.2).toFixed(3)}); }`);
    fade('#s-out .fv', t2 + 0.1); fade('#s-out .fsp', t2 + 0.4 + BEAT * 2); T('#tap-out', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }, t2 + 0.6 + BEAT * 4); fade('#s-out .fz', t2 + 0.8 + BEAT * 6);
    T('#gh-end', { opacity: 0 }, { opacity: P ? 0.6 : 1, duration: 0.8 }, DUR - 5.5);
    T('#gh-end .gh-ring', { rotation: 0 }, { rotation: 140, duration: 5.5, ease: 'none' }, DUR - 5.5);
  }
