// Asset staging: project-relative source paths → proto/assets/… (resized / trimmed copies shared by all outputs).
//   ref(rel)   → URL used in HTML/CSS ('assets/prep/troutshop/heroes/h01….png'); registers a staging job
//   dims(rel)  → [w, h] of the STAGED file (after trim/resize) — use it for layout and the logo rule
//   flush()    → runs scripts/stage_assets.py for all pending jobs (cached by mtime)
// Path conventions (rel to projects/mcr-2026-sponzori/): assets_prep/… (clean cut-outs, logos, b-roll — PREFER), assets/… (raw shop files),
// brand/… (projects/_shared/brand), ../<other project>/… (b-roll from other projects), drone/… (venue flyover video).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT, PROJ, J, exists, imgSize, copyIfNewer } from './util.mjs';

export const PROTO = path.join(ROOT, 'proto');
export const PA = path.join(PROTO, 'assets');
const SHARED = path.join(PROJ, '_shared/brand');
export const IMG_RE = /\.(png|jpe?g|webp)$/i;
export const VID_RE = /\.(mp4|mov|webm)$/i;
const isLogo = (rel) => /(^|\/)(logo[^/]*|mark[^/]*|badge|gear[^/]*|madeby[^/]*|wordline[^/]*)\.png$/i.test(rel);

export const dstOf = (rel) => {
  if (rel.startsWith('brand/')) return 'assets/' + rel;
  if (rel.startsWith('assets_prep/')) return 'assets/prep/' + rel.slice('assets_prep/'.length);
  if (rel.startsWith('assets/')) return rel;
  if (rel.startsWith('drone/') || VID_RE.test(rel)) return 'assets/venue/' + path.basename(rel);
  if (rel.startsWith('../')) return 'assets/ext/' + rel.replace(/^(\.\.\/)+/, '').replace(/\//g, '_');
  return 'assets/misc/' + path.basename(rel);
};
export const srcOf = (rel) => (rel.startsWith('brand/') ? path.join(SHARED, rel.slice(6)) : path.join(ROOT, rel));
export const has = (rel) => exists(srcOf(rel));

const jobs = new Map();        // dst(abs) → job
let MAN = {};                  // dst(rel to PROTO) → [w,h]
const pending = new Set();

export function ref(rel, { maxSide, trim } = {}) {
  const dst = dstOf(rel);
  if (VID_RE.test(rel) || /\.(wav|mp3|m4a|svg|json)$/i.test(rel)) { if (has(rel)) copyIfNewer(srcOf(rel), path.join(PROTO, dst)); return dst; }
  if (!IMG_RE.test(rel)) throw new Error('ref(): not an image/video: ' + rel);
  if (!has(rel)) throw new Error('missing asset: ' + rel);
  const abs = path.join(PROTO, dst);
  if (!jobs.has(abs)) {
    const logo = trim ?? isLogo(rel);
    const ms = maxSide ?? (logo ? 1400 : /broll|venue|\.jpe?g$/i.test(rel) ? 1920 : 1600);
    jobs.set(abs, { src: srcOf(rel), dst: abs, trim: !!logo, maxSide: ms });
    pending.add(abs);
  }
  return dst;
}
export function flush() {
  if (!pending.size) return;
  const list = [...pending].map((a) => jobs.get(a));
  const man = JSON.parse(execFileSync('python3', [path.join(ROOT, 'scripts/stage_assets.py')], { input: J(list), maxBuffer: 1 << 26 }).toString());
  for (const [abs, wh] of Object.entries(man)) MAN[path.relative(PROTO, abs)] = wh;
  pending.clear();
}
export function dims(rel) {
  const dst = dstOf(rel);
  if (!MAN[dst]) { ref(rel); flush(); }
  return MAN[dst] || imgSize(srcOf(rel));
}
// pre-stage every image path found in a JSON tree (data files) in one python call
export function prestage(tree) {
  const walk = (o) => { if (typeof o === 'string') { if (IMG_RE.test(o) && has(o)) ref(o); } else if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') Object.values(o).forEach(walk); };
  walk(tree); flush();
}
// fonts, gsap → proto/assets
export function stageRuntime() {
  fs.mkdirSync(PA, { recursive: true });
  const nm = path.join(PROJ, 'hb-battle-2026/node_modules/gsap/dist');
  for (const f of ['gsap.min.js', 'CustomEase.min.js']) copyIfNewer(path.join(nm, f), path.join(PA, f));
}
