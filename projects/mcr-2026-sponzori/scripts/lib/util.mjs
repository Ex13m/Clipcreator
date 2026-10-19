// Shared tiny helpers (no project state). Imported by build.mjs, lib/*, blocks/*.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');   // projects/mcr-2026-sponzori
export const PROJ = path.resolve(ROOT, '..');                                                // projects/
export const rd = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
export const exists = (f) => { try { fs.accessSync(f); return true; } catch { return false; } };
export const J = (v) => JSON.stringify(v);
export const f3 = (n) => (+n).toFixed(3);
export const r3 = (n) => +(+n).toFixed(3);
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, k) => a + (b - a) * k;
export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// deterministic pseudo-random 0..1 from an integer/float seed (never Math.random in compositions)
export const rnd = (seed) => { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); };
// Czech typography: one-letter prepositions/conjunctions never end a line; "1 300", "6 hodin", "164 m n. m." stay together (NBSP)
export const nb = (s) => String(s ?? '')
  .replace(/(^|[\s(„])([vkszouaiVKSZOUAI])\s+/g, '$1$2 ').replace(/(^|[\s(„])([vkszouaiVKSZOUAI])\s+/g, '$1$2 ')
  .replace(/(\d)\s(?=\d{3}\b)/g, '$1 ')
  .replace(/(\d)\s(?=(m|g|l|h|ha|s|ks|Kč|mm|gramů?|gramy|hodin|let|litru|kusů)(?![\p{L}\d]))/gu, '$1 ')
  .replace(/\bn\.\s(?=m\.)/g, 'n. ');
// hex colour → rgba() string
export const rgba = (hex, a = 1) => { const h = hex.replace('#', ''); const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h; const n = parseInt(v, 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; };
export const ffDur = (f) => { try { return r3(+execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim()); } catch { return 0; } };
export const copyIfNewer = (src, dst) => { fs.mkdirSync(path.dirname(dst), { recursive: true }); if (!exists(dst) || fs.statSync(dst).mtimeMs < fs.statSync(src).mtimeMs) fs.copyFileSync(src, dst); };

// image size from file header (PNG / JPEG / WebP) without decoding — used for layout + logo rule before staging
export function imgSize(file) {
  const b = fs.readFileSync(file);
  if (b.readUInt32BE(0) === 0x89504e47) return [b.readUInt32BE(16), b.readUInt32BE(20)];
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1], len = b.readUInt16BE(i + 2);
      if ((m >= 0xc0 && m <= 0xc3) || (m >= 0xc5 && m <= 0xc7) || (m >= 0xc9 && m <= 0xcb) || (m >= 0xcd && m <= 0xcf)) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
      i += 2 + len;
    }
  }
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const k = b.toString('ascii', 12, 16);
    if (k === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
    if (k === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
    if (k === 'VP8L') { const n = b.readUInt32LE(21); return [1 + (n & 0x3fff), 1 + ((n >> 14) & 0x3fff)]; }
  }
  return [1000, 1000];
}
