// Shared helpers of the banner engine (sponsor agents: read-only).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

export const ENGINE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(ENGINE, '../..');                 // projects/mcr-2026-bannery
export const PROJECTS = path.resolve(ROOT, '..');                  // projects/
export const FILM = path.join(PROJECTS, 'mcr-2026-sponzori');      // film project (read-only source of assets / fonts)
export const SHARED = path.join(PROJECTS, '_shared');
// playwright lives in hb-battle-2026/node_modules (no install needed)
export const requireHB = createRequire(path.join(PROJECTS, 'hb-battle-2026/node_modules/'));

export const exists = (p) => { try { fs.accessSync(p); return true; } catch { return false; } };
export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Czech typography: NBSP after one-letter prepositions/conjunctions, inside numbers („1 300“, „24. 10.“) and before units
export function nb(s) {
  return String(s ?? '')
    .replace(/(^|[\s(„])([vkszouaiVKSZOUAI])\s+/g, (m, a, b) => `${a}${b} `)
    .replace(/(\d)\s+(\d{3})(?!\d)/g, '$1 $2')
    .replace(/(\d\.)\s+(\d)/g, '$1 $2')
    .replace(/(\d)\s+(mm|cm|m|g|kg|l|ks|Kč|%)(?=$|[\s.,·)])/g, '$1 $2');
}
export const px = (n) => `${Math.round(n * 10) / 10}px`;

// natural size of a PNG / JPEG without dependencies (cached)
const DIMS = new Map();
export function dims(abs) {
  if (DIMS.has(abs)) return DIMS.get(abs);
  const b = fs.readFileSync(abs);
  let r = null;
  if (b[0] === 0x89 && b[1] === 0x50) r = [b.readUInt32BE(16), b.readUInt32BE(20)];
  else if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1], len = b.readUInt16BE(i + 2);
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) { r = [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)]; break; }
      i += 2 + len;
    }
  } else if (b.toString('ascii', 8, 12) === 'WEBP') {
    const c = b.toString('ascii', 12, 16);
    if (c === 'VP8X') r = [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
  }
  if (!r) throw new Error(`dims: unsupported image ${abs}`);
  DIMS.set(abs, r);
  return r;
}
export const hex2rgba = (h, a) => { const n = parseInt(h.replace('#', ''), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; };
