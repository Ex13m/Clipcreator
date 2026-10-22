// Output formats (sponsor agents: read-only). Coordinates are canvas px.
//   safe = margins kept free of key content (9:16: Instagram/FB Story + Reels UI: profile bar on top, reply bar / caption at the bottom)
//   ta   = TA logo content width (the logo-rule reference: a sponsor logo in the same frame must not be wider nor larger in area)
//   url / chip / event / role = chrome font sizes; body = free box for the sponsor scene (computed in page.mjs)
export const FORMATS = {
  '1x1': { key: '1x1', w: 1080, h: 1080, kind: 'square', safe: { t: 52, r: 56, b: 48, l: 56 }, ta: 300, url: 44, role: 21, chip: 27, event: 25 },
  '4x5': { key: '4x5', w: 1080, h: 1350, kind: 'portrait', safe: { t: 60, r: 60, b: 56, l: 60 }, ta: 320, url: 46, role: 22, chip: 29, event: 27 },
  '191': { key: '191', w: 1200, h: 628, kind: 'wide', safe: { t: 34, r: 44, b: 30, l: 44 }, ta: 230, url: 36, role: 17, chip: 22, event: 20 },
  '9x16': { key: '9x16', w: 1080, h: 1920, kind: 'tall', safe: { t: 250, r: 64, b: 380, l: 64 }, ta: 340, url: 48, role: 22, chip: 30, event: 27 },
};

// What one build produces. static = poster scene; anim = scene sequence → MP4; carousel = 4 cards (1x1)
export const OUTPUTS = {
  static: ['1x1', '4x5', '191', '9x16'],
  anim: ['4x5', '1x1'],
  carousel: ['1x1'],
};
export const CAROUSEL = ['who', 'range', 'hero', 'mcr'];   // 1 who they are → 2 assortment / brands → 3 hero product → 4 MČR role + URL + event
export const ANIM = { dur: 10, fps: 30 };
// default animated sequence (seconds). First and last scene = the poster at rest → seamless loop; a module may override (export const anim)
export const DEFAULT_SEQ = [
  { scene: 'poster', d: 2.6 },
  { scene: 'range', d: 2.3 },
  { scene: 'hero', d: 2.3 },
  { scene: 'poster', d: 2.8 },
];
