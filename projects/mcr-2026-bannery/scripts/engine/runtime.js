// Browser runtime of the banner engine (inlined into every page). Pure functions of time → seek-safe and deterministic.
// Attributes a sponsor scene can put on any element (all optional, combinable on one element):
//   data-in="up|down|left|right|scale|slam|fade|wipe-l|wipe-r|wipe-u|rise"  entrance when its scene starts (not on the 1st scene of the loop)
//     data-d="0.15" delay (s) · data-dur="0.7" · data-dist="70" (px)
//   data-spin="360"        continuous rotation, degrees per whole loop (positive = clockwise); 0 in statics
//   data-kb="1,1.08"       scale over its scene window (Ken Burns)   · data-pan="dx,dy" translate over the scene window
//                          (in the loop's last window, if it repeats the first scene, both run backwards → seamless loop)
//   data-float="8,5"       sine bob: amplitude px, period s (snapped so the loop stays seamless)
//   data-cycle="0.35"      container: children .cy shown one at a time every 0.35 s inside the scene window (data-rest="k" = still frame)
//   data-sweep="0.5,0.9"   light band: x −130% → 130% between scene t0+a and t0+b
(function () {
  const C = window.__CFG;   // {w,h,dur,fps,ta:{x,y,w,h},tones,url,chip,role,event,minMain,fmt}
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const scenes = $$('.scene');
  const byId = Object.fromEntries(scenes.map((s) => [s.dataset.id, s]));
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const expo = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
  const cubic = (x) => 1 - Math.pow(1 - x, 3);
  const nums = (s, n) => { const a = String(s || '').split(',').map(Number); while (a.length < n) a.push(a[a.length - 1] ?? 0); return a; };
  const ANIM = '[data-in],[data-spin],[data-kb],[data-pan],[data-float],[data-sweep]';
  const els = $$(ANIM).map((el) => ({ el, sc: el.closest('.scene'), base: el.style.transform || '' }));
  const cycles = $$('[data-cycle]').map((el) => ({ el, sc: el.closest('.scene'), kids: $$(':scope > .cy', el) }));

  // ---- fit: shrink font-size until the element fits its box (white-space:nowrap → width; data-lines → height) ----
  function fit() {
    const bad = [];
    for (const el of $$('[data-fit]')) {
      const min = +el.dataset.fit || 12, lines = +el.dataset.lines || 0;
      let fs = parseFloat(getComputedStyle(el).fontSize);
      const over = () => (lines ? el.scrollHeight > Math.ceil(parseFloat(getComputedStyle(el).lineHeight) * lines + 2) : false) || el.scrollWidth > el.clientWidth + 1;
      let guard = 200;
      while (over() && fs > min && guard--) { fs -= 1; el.style.fontSize = fs + 'px'; }
      el.dataset.fs = fs;
      if (over()) bad.push(el.id || el.textContent.slice(0, 40));
    }
    return bad;
  }

  function setTone(t) {
    const L = C.tones[t] || C.tones.dark;
    document.getElementById('ta-sh').style.opacity = L.sh;
    document.getElementById('ta-sh2').style.opacity = L.sh2;
    document.getElementById('ta-scrim').style.opacity = L.scrim;
  }

  // element state at local time u (s since its scene window start), entrance on/off
  function apply(o, t, w) {
    const d = o.el.dataset;
    let tx = 0, ty = 0, sc = 1, rot = 0, op = null, clip = null;
    const u = w ? t - w.t0 : 1e9, span = w ? w.t1 - w.t0 : 1;
    if (d.in && w && w.enter) {
      const del = +(d.d || 0), dur = +(d.dur || 0.7), dist = +(d.dist || 70);
      const x = clamp((u - del) / dur), e = expo(x);
      const k = 1 - e, pop = clamp(u / 0.09);   // opaque within ~3 frames of the cut whatever the delay: only the MOTION is staggered (delayed fades = empty cut frames)
      switch (d.in) {
        case 'up': ty += dist * k; op = pop; break;
        case 'down': ty -= dist * k; op = pop; break;
        case 'left': tx -= dist * k; op = pop; break;
        case 'right': tx += dist * k; op = pop; break;
        case 'scale': sc *= 0.86 + 0.14 * e; op = pop; break;
        case 'slam': sc *= 1 + 0.12 * k; op = pop; break;
        case 'rise': ty += dist * 2.2 * (1 - cubic(x)); op = pop; break;
        case 'fade': op = cubic(clamp((u - del) / Math.min(dur, 0.35))); break;
        case 'wipe-l': clip = `inset(-20% ${(100 * k).toFixed(2)}% -20% -20%)`; break;
        case 'wipe-r': clip = `inset(-20% -20% -20% ${(100 * k).toFixed(2)}%)`; break;
        case 'wipe-u': clip = `inset(${(100 * k).toFixed(2)}% -20% -20% -20%)`; break;
      }
    }
    const q = w ? (w.rev ? 1 - clamp(u / span) : clamp(u / span)) : 0;
    if (d.kb && w) { const [a, b] = nums(d.kb, 2); sc *= a + (b - a) * q; }
    if (d.pan && w) { const [dx, dy] = nums(d.pan, 2); tx += dx * q; ty += dy * q; }
    if (d.float && C.playing) { let [amp, per] = nums(d.float, 2); per = C.dur / Math.max(1, Math.round(C.dur / per)); ty += amp * Math.sin((2 * Math.PI * t) / per); }
    if (d.spin && C.playing) rot += (+d.spin * t) / C.dur;
    if (d.sweep) { const [a, b] = nums(d.sweep, 2); const x = w ? clamp((u - a) / (b - a)) : 1.2; tx = 0; o.el.style.left = `${(-130 + 260 * cubic(x)).toFixed(2)}%`; }
    o.el.style.transform = `${o.base} translate(${tx.toFixed(2)}px,${ty.toFixed(2)}px) scale(${sc.toFixed(4)}) rotate(${rot.toFixed(3)}deg)`;
    if (d.in) { o.el.style.opacity = op == null ? '' : op.toFixed(3); o.el.style.clipPath = clip || ''; }
  }

  let SEQ = [];
  // ---- still frame of one scene (statics, carousel cards) ----
  window.__rest = function (id) {
    C.playing = false;
    for (const s of scenes) { s.style.opacity = s.dataset.id === id ? 1 : 0; s.style.transform = ''; s.style.zIndex = s.dataset.id === id ? 2 : 0; }
    for (const o of els) apply(o, 0, null);
    for (const c of cycles) c.kids.forEach((k, i) => { k.style.opacity = i === +(c.el.dataset.rest || 0) ? 1 : 0; });
    setTone(byId[id]?.dataset.tone || C.tone);
  };
  // ---- animated sequence ----
  window.__setSeq = function (seq) {   // [{scene, d}]
    let t = 0; SEQ = seq.map((s, i) => { const w = { id: s.scene, t0: t, t1: t + s.d, enter: i > 0 }; t += s.d; return w; });
    // seamless loop: when the last window shows the same scene as the first, its Ken Burns / pan runs BACKWARDS (end → rest), so
    // the last frame equals frame 0 (review 22. 10. M3/M4: data-kb on the poster made the loop seam jump, 21–22 dB)
    if (SEQ.length > 1 && SEQ[SEQ.length - 1].id === SEQ[0].id) SEQ[SEQ.length - 1].rev = true;
    C.dur = t; return t;
  };
  const XF = 0.1;   // near-hard cut (3 frames): incoming on top, settles 1.03 → 1; outgoing pushes 1 → 1.04 under it (long cross-fades = ghosts)
  window.__seek = function (t) {
    C.playing = true;
    const k = Math.max(0, SEQ.findIndex((w) => t >= w.t0 && t < w.t1) === -1 ? SEQ.length - 1 : SEQ.findIndex((w) => t >= w.t0 && t < w.t1));
    const cur = SEQ[k], prev = k > 0 ? SEQ[k - 1] : null, u = t - cur.t0;
    const inX = cur.enter ? clamp(u / XF) : 1;
    const active = { [cur.id]: cur };
    for (const s of scenes) { s.style.opacity = 0; s.style.zIndex = 0; s.style.transform = ''; }
    if (prev && inX < 1 && prev.id !== cur.id) {
      const ps = byId[prev.id]; ps.style.opacity = 1; ps.style.zIndex = 1; ps.style.transform = `scale(${(1 + 0.04 * cubic(inX)).toFixed(4)})`;
      active[prev.id] = prev;
    }
    const cs = byId[cur.id]; cs.style.opacity = cubic(inX).toFixed(3); cs.style.zIndex = 2;
    cs.style.transform = cur.enter ? `scale(${(1.03 - 0.03 * expo(clamp(u / 0.6))).toFixed(4)})` : '';
    for (const o of els) apply(o, t, active[o.sc?.dataset.id] || null);
    for (const c of cycles) {
      const w = active[c.sc?.dataset.id]; const step = +c.el.dataset.cycle || 0.4;
      const i = w ? Math.floor(Math.max(0, t - w.t0 - (+c.el.dataset.d || 0)) / step) % c.kids.length : +(c.el.dataset.rest || 0);
      c.kids.forEach((kd, j) => { kd.style.opacity = j === i ? 1 : 0; });
    }
    // TA logo shadow strength: the stronger of the visible scenes
    const order = ['dark', 'scrim', 'halo'];
    const tones = Object.keys(active).map((id) => byId[id].dataset.tone || C.tone);
    setTone(tones.sort((a, b) => order.indexOf(b) - order.indexOf(a))[0]);
  };

  // ---- QA of the frame currently shown (rules of the brief) ----
  window.__qa = function () {
    const err = [], warn = [];
    const R = (el) => el.getBoundingClientRect();
    const vis = (el) => { let n = el; while (n && n !== document.body) { const cs = getComputedStyle(n); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05) return false; n = n.parentElement; } return true; };
    const ta = C.ta, taArea = ta.w * ta.h;
    const lg = document.getElementById('ta-logo');
    if (!lg || !vis(lg) || !lg.complete || !lg.naturalWidth) err.push('TA logo missing / not visible');
    const shown = scenes.filter((s) => +s.style.opacity > 0.5);
    for (const s of [...shown, document.getElementById('chrome')]) {   // + a sponsor mark in the chrome (brand.urlIcon)
      for (const el of $$('.sp-logo', s)) {
        if (!vis(el)) continue;
        const r = R(el), cw = +(el.dataset.cw || 1), ch = +(el.dataset.ch || 1);   // content fraction of the box (padding in the PNG)
        const w = r.width * cw, h = r.height * ch;
        if (w > ta.w + 1) err.push(`sponsor logo wider than TA logo (${w.toFixed(0)} > ${ta.w.toFixed(0)}) [${el.id || el.className}]`);
        if (w * h > taArea * 1.02) err.push(`sponsor logo area > TA logo area (${(w * h / 1000).toFixed(1)}k > ${(taArea / 1000).toFixed(1)}k px²) [${el.id || el.className}]`);
      }
    }
    const url = document.getElementById('ch-url'), chip = document.getElementById('ch-chip'), ev = document.getElementById('ch-event');
    if (!url || url.textContent.trim() !== C.url) err.push(`URL missing / wrong (${url?.textContent})`);
    if (!ev || !ev.textContent.includes('2026')) err.push('event line missing');
    if (C.chip && (!chip || chip.textContent.replace(/\s+/g, ' ').trim().toLowerCase() !== C.chip.toLowerCase())) err.push(`role chip missing / wrong (${chip?.textContent}) ≠ ${C.chip}`);
    if (!C.prize && /věnuje ceny|hlavní cena/i.test(document.body.innerText)) err.push('prize wording on a non-prize role (host / supporter)');
    const chrome = ['ta-logo-box', 'ch-url', 'ch-role', 'ch-chip', 'ch-event'].map((id) => document.getElementById(id)).filter(Boolean).map((el) => ({ id: el.id, r: R(el) }));
    const hit = (a, b) => a.left < b.right - 2 && a.right > b.left + 2 && a.top < b.bottom - 2 && a.bottom > b.top + 2;
    for (const s of shown) for (const el of $$('.t', s)) {
      if (!vis(el)) continue;
      const r = R(el), name = (el.id || el.textContent).slice(0, 36);
      if (r.left < -1 || r.top < -1 || r.right > C.w + 1 || r.bottom > C.h + 1) err.push(`text outside the canvas: "${name}"`);
      else if (r.left < C.safe.l - 8 || r.right > C.w - C.safe.r + 8 || r.top < C.safe.t - 8 || r.bottom > C.h - C.safe.b + 8) warn.push(`text outside the safe zone: "${name}"`);
      for (const c of chrome) if (hit(r, c.r)) err.push(`text "${name}" overlaps ${c.id}`);
      if (el.classList.contains('main')) { const fs = parseFloat(getComputedStyle(el).fontSize); if (fs < C.minMain - 0.5) warn.push(`main line < ${C.minMain}px (${fs}px): "${name}"`); }
    }
    for (const s of shown) for (const im of $$('img', s)) {
      if (!vis(im) || !im.naturalWidth || im.dataset.noscale != null) continue;
      const r = R(im); if (r.width > im.naturalWidth * 1.3 + 2) warn.push(`image upscaled ${(r.width / im.naturalWidth).toFixed(2)}×: ${im.src.split('/').pop()}`);
    }
    for (const el of $$('[data-fit]')) if (vis(el) && el.scrollWidth > el.clientWidth + 1) err.push(`text does not fit: "${el.textContent.slice(0, 36)}"`);
    return { err: [...new Set(err)], warn: [...new Set(warn)] };
  };
  window.__fit = fit;
})();
