// VO timing for a block: text from vo/script_cs.json, audio from vo/<key>.(wav|mp3|m4a), word times from
// vo/<key>.words.json when present (real alignment), otherwise an estimate (syllables, scaled to the audio length if the file exists).
//   ctx.vo.words   [{w, t0, t1}]  on-screen (cs) tokens, block-local seconds
//   ctx.vo.phrases [{text, t0, t1}] split on . , – : ;  (sentences / dashes)
//   ctx.vo.at('1 300')  → t0 of the first word sequence matching (case/diacritics-insensitive), or null
//   ctx.vo.start / end / file / real (true = audio file exists) / aligned (true = words.json)
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, rd, exists, ffDur, r3 } from './util.mjs';

const SCRIPT = path.join(ROOT, 'vo/script_cs.json');
const VOW = /[aeiouyáéěíóúůý]+/gi;
const NUM_SYL = (s) => { const d = s.replace(/\D/g, ''); return d.length ? Math.max(2, d.length * 2) : 0; };
const syl = (w) => { const n = (w.toLowerCase().match(VOW) || []).length; return Math.max(1, n + NUM_SYL(w) - (/\d/.test(w) ? (w.match(VOW) || []).length : 0)); };
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

let script = null;
export function voFor(key, { offset = 0.25, dur = 8, syllPerSec = 6.0 } = {}) {
  if (!script) script = exists(SCRIPT) ? rd(SCRIPT) : { blocks: {} };
  const B = key ? script.blocks?.[key] : null;
  const text = B?.vo?.cs || '';
  const file = key ? ['wav', 'mp3', 'm4a'].map((e) => path.join(ROOT, 'vo', `${key}.${e}`)).find(exists) : null;
  const audioDur = file ? ffDur(file) : 0;
  const wj = key ? path.join(ROOT, 'vo', `${key}.words.json`) : null;
  let words = [];
  let aligned = false;
  if (wj && exists(wj)) {
    const j = rd(wj); const arr = Array.isArray(j) ? j : j.words || j.segments?.flatMap((s) => s.words || []) || [];
    words = arr.map((w) => ({ w: (w.w ?? w.word ?? w.text ?? '').trim(), t0: r3(offset + (w.t0 ?? w.start)), t1: r3(offset + (w.t1 ?? w.end)) })).filter((w) => w.w);
    aligned = words.length > 0;
  }
  if (!aligned && text) {
    // estimate: syllables + pauses after punctuation
    const toks = text.split(/\s+/).filter((w) => w && !/^[–—-]$/.test(w));
    const raw = []; let t = 0;
    for (const w of toks) { const d = syl(w) / syllPerSec; raw.push({ w, t0: t, t1: t + d }); t += d + (/[.!?]$/.test(w) ? 0.32 : /[,;:]$/.test(w) ? 0.16 : 0.03); }
    const est = t;
    const k = audioDur ? (audioDur - 0.05) / est : 1;
    words = raw.map((x) => ({ w: x.w, t0: r3(offset + x.t0 * k), t1: r3(offset + x.t1 * k) }));
  }
  // phrases: split after punctuation or before a dash
  const phrases = []; let cur = null;
  const toksAll = text.split(/\s+/).filter(Boolean);
  let wi = 0;
  for (const tok of toksAll) {
    if (/^[–—-]$/.test(tok)) { if (cur) { phrases.push(cur); cur = null; } continue; }
    const w = words[wi++]; if (!w) break;
    if (!cur) cur = { text: '', t0: w.t0, t1: w.t1 };
    cur.text += (cur.text ? ' ' : '') + tok; cur.t1 = w.t1;
    if (/[.,;:!?]$/.test(tok)) { phrases.push(cur); cur = null; }
  }
  if (cur) phrases.push(cur);
  const start = words.length ? words[0].t0 : offset, end = words.length ? words[words.length - 1].t1 : offset;
  const at = (q) => {
    const nq = norm(q).split(' '); if (!nq[0]) return null;
    for (let i = 0; i < words.length; i++) {
      if (nq.every((p, j) => words[i + j] && norm(words[i + j].w) === p)) return words[i].t0;
    }
    return null;
  };
  return { key, text, tts: B?.vo?.tts || '', words, phrases, start, end: audioDur ? r3(offset + audioDur) : end, file, audioDur, real: !!file, aligned, offset, at, limit: B?.vo_limit_words, block: B };
}
