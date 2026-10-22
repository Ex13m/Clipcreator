// Output formats (sponsor agents: read-only). Coordinates are canvas px.
//   safe = margins kept free of key content (9:16: Instagram/FB Story + Reels UI: profile bar on top, reply bar / caption at the bottom)
//   ta   = TA logo content width (the logo-rule reference: a sponsor logo in the same frame must not be wider nor larger in area)
//   url / chip / event / role = chrome font sizes; body = free box for the sponsor scene (computed in page.mjs)
//   scale = device pixel ratio of the render: the page is laid out at w × h CSS px and saved at (w × scale) × (h × scale).
//           16:9 (operator 22. 10.) = the wide layout family (kind 'wide', like 1.91:1) on a 1200×675 canvas → 1920×1080 PNG / MP4,
//           so every sponsor's wide poster adapts without new coordinates; a module can still tweak it via E.f.key === '16x9'.
export const FORMATS = {
  '1x1': { key: '1x1', w: 1080, h: 1080, kind: 'square', safe: { t: 52, r: 56, b: 48, l: 56 }, ta: 300, url: 44, role: 21, chip: 27, event: 25 },
  '4x5': { key: '4x5', w: 1080, h: 1350, kind: 'portrait', safe: { t: 60, r: 60, b: 56, l: 60 }, ta: 320, url: 46, role: 22, chip: 29, event: 27 },
  '191': { key: '191', w: 1200, h: 628, kind: 'wide', safe: { t: 34, r: 44, b: 30, l: 44 }, ta: 230, url: 36, role: 17, chip: 22, event: 20 },
  '9x16': { key: '9x16', w: 1080, h: 1920, kind: 'tall', safe: { t: 250, r: 64, b: 380, l: 64 }, ta: 340, url: 48, role: 22, chip: 30, event: 27 },
  '16x9': { key: '16x9', w: 1200, h: 675, scale: 1.6, kind: 'wide', safe: { t: 38, r: 48, b: 34, l: 48 }, ta: 240, url: 36, role: 17, chip: 22, event: 20 },
};
export const pxW = (f) => Math.round(f.w * (f.scale || 1));   // output pixel size
export const pxH = (f) => Math.round(f.h * (f.scale || 1));

// What one build produces. static = poster scene; anim = scene sequence → MP4; carousel = 4 cards (1x1)
export const OUTPUTS = {
  static: ['1x1', '4x5', '191', '9x16', '16x9'],
  anim: ['4x5', '1x1', '16x9'],
  carousel: ['1x1'],
};
export const CAROUSEL = ['who', 'range', 'hero', 'mcr'];   // 1 who they are → 2 assortment / brands → 3 hero product → 4 MČR role + URL + event
export const ANIM = { dur: 10, fps: 60 };   // operator 22. 10.: 60 fps everywhere
// default animated sequence (seconds). First and last scene = the poster at rest → seamless loop; a module may override (export const anim)
export const DEFAULT_SEQ = [
  { scene: 'poster', d: 2.6 },
  { scene: 'range', d: 2.3 },
  { scene: 'hero', d: 2.3 },
  { scene: 'poster', d: 2.8 },
];
// 16:9 MP4 (kind 'wide'): its scenes must have a wide layout → a module sets anim.wide (default: poster → range → hero → poster)
export const DEFAULT_SEQ_WIDE = DEFAULT_SEQ;
