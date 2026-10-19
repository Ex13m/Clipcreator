// Beat grid (audio/track.beats.json) + block plan in bars (data/content.json → plan).
// Bars are 0-based: bar i starts at downbeats[i]. A plan entry {key, bars:[a,b]} spans bars a..b inclusive
// → t0 = downbeats[a], t1 = downbeats[b+1] (or the track end when "tail": true).
import path from 'node:path';
import { ROOT, rd, exists, r3 } from './util.mjs';

export function loadGrid(C, needBars = 64) {
  const BPB = C.music.beatsPerBar || 4;
  const bf = path.join(ROOT, C.music.beats), tf = path.join(ROOT, C.music.track);
  if (exists(bf) && exists(tf)) {
    const g = rd(bf);
    const beats = [...g.beats];
    const iv = beats.slice(1).map((t, i) => t - beats[i]).sort((a, b) => a - b)[Math.floor((beats.length - 1) / 2)];
    // extend to t=0 keeping phase, and past the end for safety
    while (beats[0] - iv > -1e-6) beats.unshift(r3(beats[0] - iv));
    const downbeats = [...g.downbeats];
    while (downbeats[0] - iv * BPB > -1e-6) downbeats.unshift(r3(downbeats[0] - iv * BPB));
    while (beats.length < (needBars + 4) * BPB) beats.push(r3(beats[beats.length - 1] + iv));
    while (downbeats.length < needBars + 4) downbeats.push(r3(downbeats[downbeats.length - 1] + iv * BPB));
    return { beats, downbeats, beat: iv, bar: iv * BPB, BPB, real: true, trackDur: g.duration, tempo: g.tempo, track: tf };
  }
  const b = 60 / (C.music.bpm || 120), n = (needBars + 4) * BPB;
  const beats = Array.from({ length: n }, (_, i) => r3(i * b));
  return { beats, downbeats: beats.filter((_, i) => i % BPB === 0), beat: b, bar: b * BPB, BPB, real: false, trackDur: 0, tempo: C.music.bpm };
}

export function planFilm(C, G) {
  const P = [];
  let expect = null;
  for (const e of C.plan) {
    const [a, b] = e.bars;
    if (expect != null && a !== expect) throw new Error(`plan: ${e.key} starts at bar ${a}, expected ${expect} (blocks must be contiguous)`);
    expect = b + 1;
    const t0 = G.downbeats[a];
    const t1 = e.tail && G.real ? G.trackDur : G.downbeats[b + 1];
    P.push({ key: e.key, block: e.block || e.key, data: e.data || e.key, vo: e.vo === undefined ? e.key : e.vo, bar0: a, bar1: b, nBars: b - a + 1, t0: r3(t0), t1: r3(t1), tail: !!e.tail, opt: e });
  }
  return P;
}

// beats / downbeats that fall inside [g0, g1) shifted to local time (0 = g0)
export function localGrid(G, g0, g1) {
  const loc = (arr) => arr.filter((t) => t >= g0 - 1e-6 && t < g1 - 1e-6).map((t) => r3(t - g0));
  return { beats: loc(G.beats), downs: loc(G.downbeats) };
}
