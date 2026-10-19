// Seek-safe GSAP timeline builder (build time → JS source for one paused timeline).
//
//   const tl = createTL();
//   tl.fromTo('#a', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' }, 1.2);
//   tl.set('#b', { opacity: 1 }, 2.0);
//   tl.code()  → 'tl.set(...,0); tl.fromTo(...); …'
//
// Rules it enforces (so every frame is the same no matter in which order the renderer seeks):
//   • every fromTo is emitted with immediateRender:false;
//   • for each (selector, property) the EARLIEST fromTo also gets an initial gsap.set(sel, {prop: from}) (applied at load,
//     outside the timeline), so the element sits in its start state from frame 0 (no CSS transform needed → no lint conflict);
//   • tl.set(…, 0) is emitted as gsap.set (a zero-duration set at 0 does not render while the playhead sits at 0);
//   • tl.hit(sel, from, to, t) = accent tween WITHOUT initial state (flash / punch / chroma): before t the element stays as it was;
//   • only fromTo / hit / set (no .to/.from — their start values depend on what was rendered before).
// Keep one selector per element per property group (the builder cannot know that '#x' and '.y' are the same node).
import { J, f3 } from './util.mjs';

const CTRL = new Set(['duration', 'ease', 'stagger', 'delay', 'repeat', 'yoyo', 'repeatDelay', 'immediateRender', 'overwrite']);

export function createTL() {
  const items = [];
  const api = {
    items,
    fromTo(sel, from, to, t) {
      if (!Number.isFinite(+t)) throw new Error(`tl.fromTo(${sel}): bad time ${t}`);
      items.push({ k: 'ft', sel, from, to, t: +t }); return api;
    },
    // accent / transient (flash, punch, chroma…): NO initial state — before t the element keeps its CSS / previous state,
    // the from-values apply only while the tween runs (GSAP restores the pre-tween value when seeking back before t)
    hit(sel, from, to, t) {
      if (!Number.isFinite(+t)) throw new Error(`tl.hit(${sel}): bad time ${t}`);
      items.push({ k: 'ft', hit: true, sel, from, to, t: +t }); return api;
    },
    set(sel, vars, t) {
      if (!Number.isFinite(+t)) throw new Error(`tl.set(${sel}): bad time ${t}`);
      items.push({ k: 'set', sel, vars, t: +t }); return api;
    },
    raw(code, t = 0) { items.push({ k: 'raw', code, t: +t }); return api; },   // escape hatch (must be seek-safe!)
    // latest end time (stagger counted for ~3 targets) → { t, sel } of the item that ends last
    end() { let best = { t: 0, sel: null }; for (const it of items) { const e = it.t + (it.to?.duration || 0) * (it.to?.repeat ? it.to.repeat + 1 : 1) + (it.to?.stagger ? (typeof it.to.stagger === 'number' ? it.to.stagger : (it.to.stagger.each || 0)) * 3 : 0); if (e > best.t) best = { t: e, sel: it.sel }; } return best; },
    code(indent = '  ') {
      // earliest item per (sel, prop) — fromTo or set
      const first = new Map();
      items.forEach((it, i) => {
        if (it.k === 'raw' || it.hit) return;
        const props = Object.keys(it.k === 'ft' ? it.from : it.vars).filter((p) => !CTRL.has(p));
        for (const p of props) { const key = it.sel + '\u0000' + p; const f = first.get(key); if (!f || it.t < f.t - 1e-6) first.set(key, { t: it.t, i }); }
      });
      const init = new Map();   // sel → {prop: fromValue}
      for (const [key, { i }] of first) {
        const it = items[i]; if (it.k !== 'ft') continue;
        const [sel, p] = key.split('\u0000');
        if (!init.has(sel)) init.set(sel, {});
        init.get(sel)[p] = it.from[p];
      }
      const out = [];
      // initial states are applied immediately (gsap.set outside the timeline): a zero-duration tl.set at 0 would not render on frame 0
      for (const [sel, vars] of init) out.push(`gsap.set(${J(sel)}, ${J(vars)});`);
      for (const it of items) if (it.k === 'set' && it.t <= 1e-6) out.push(`gsap.set(${J(it.sel)}, ${J(it.vars)});`);
      for (const it of items) {
        if (it.k === 'ft') out.push(`tl.fromTo(${J(it.sel)}, ${J(it.from)}, ${J({ ...it.to, immediateRender: false })}, ${f3(it.t)});`);
        else if (it.k === 'set') { if (it.t > 1e-6) out.push(`tl.set(${J(it.sel)}, ${J(it.vars)}, ${f3(it.t)});`); }
        else out.push(it.code);
      }
      return out.join('\n' + indent);
    },
  };
  return api;
}
