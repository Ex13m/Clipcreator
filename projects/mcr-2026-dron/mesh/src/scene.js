// Approach A "photogrammetry look": DSM-displaced terrain mesh + 0.125 m ortho, PBR-ish water with planar
// reflections, aerial perspective, analytic sky. Deterministic offline renderer driven frame-by-frame.
import * as THREE from 'three';
import { SHADER_COMMON, TERRAIN_VS, TERRAIN_FS, WATER_VS, WATER_FS, SKY_VS, SKY_FS, FS_VS, DOWN_FS, POST_FS } from './shaders.js';
import { makeCameraPath } from './camera.js';

let R, meta, cfg, path;
let sceneMain, sceneRefl, cam, reflCam, skyMesh;
let rtSS, rtAcc, rtRefl = {}, fsScene, fsCam, downMat, postMat;
const terrainMats = [];
const lodMeshes = [], matMeshes = [];
const waterMeshes = [];
const U = {}; // shared uniforms

const DATA = '/data/';
const BUILD = '/build/';

function loadTex(url, { srgb = true, wrap = THREE.ClampToEdgeWrapping, mip = true, aniso = 16 } = {}) {
  return new Promise((res, rej) => {
    new THREE.TextureLoader().load(url, (t) => {
      t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      t.wrapS = t.wrapT = wrap;
      t.generateMipmaps = mip;
      t.minFilter = mip ? THREE.LinearMipmapLinearFilter : THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.anisotropy = aniso;
      res(t);
    }, undefined, rej);
  });
}
async function loadF32(url) { return new Float32Array(await (await fetch(url)).arrayBuffer()); }

// ---------- heightfield chunk geometry ----------
function heightNormals(h, nr, nc, dx, dz, k = 2) {
  const N = new Float32Array(nr * nc * 3);
  for (let i = 0; i < nr; i++) {
    const i0 = Math.max(0, i - k), i1 = Math.min(nr - 1, i + k);
    for (let j = 0; j < nc; j++) {
      const j0 = Math.max(0, j - k), j1 = Math.min(nc - 1, j + k);
      const gx = (h[i * nc + j1] - h[i * nc + j0]) / ((j1 - j0) * dx);
      const gz = (h[i1 * nc + j] - h[i0 * nc + j]) / ((i1 - i0) * dz);
      const l = Math.hypot(gx, 1, gz);
      const o = (i * nc + j) * 3;
      N[o] = -gx / l; N[o + 1] = 1 / l; N[o + 2] = -gz / l;
    }
  }
  return N;
}

// Build one chunk at a given step (LOD) with a skirt around its border (hides LOD T-junction cracks).
function buildChunk(h, nr, nc, x0, z0, dx, dz, normals, ci, cj, chunk, step, skip, drop) {
  const i1 = Math.min(nr - 1, ci + chunk), j1 = Math.min(nc - 1, cj + chunk);
  const rows = [], cols = [];
  for (let i = ci; i < i1; i += step) rows.push(i); rows.push(i1);
  for (let j = cj; j < j1; j += step) cols.push(j); cols.push(j1);
  const vr = rows.length, vc = cols.length;
  const nv = vr * vc, nsk = 2 * (vr + vc) * 1;
  const pos = new Float32Array((nv + 2 * (vr + vc) * 2) * 3), nor = new Float32Array(pos.length);
  let o = 0;
  const put = (gi, gj, dy) => { const g = gi * nc + gj; pos[o] = x0 + gj * dx; pos[o + 1] = h[g] - dy; pos[o + 2] = z0 + gi * dz; nor[o] = normals[g * 3]; nor[o + 1] = normals[g * 3 + 1]; nor[o + 2] = normals[g * 3 + 2]; o += 3; };
  for (let a = 0; a < vr; a++) for (let b = 0; b < vc; b++) put(rows[a], cols[b], 0);
  const idx = [];
  for (let a = 0; a < vr - 1; a++) for (let b = 0; b < vc - 1; b++) {
    if (skip && skip(rows[a], cols[b], rows[a + 1], cols[b + 1])) continue;
    const A = a * vc + b, B = A + 1, C = A + vc, D = C + 1;
    idx.push(A, C, B, B, C, D);
  }
  if (!idx.length) return null;
  if (drop > 0) {
    const edges = [
      cols.map((_, b) => [0, b]), rows.map((_, a) => [a, vc - 1]),
      cols.map((_, b) => [vr - 1, vc - 1 - b]), rows.map((_, a) => [vr - 1 - a, 0]),
    ];
    for (const e of edges) {
      const base = o / 3;
      for (const [a, b] of e) { put(rows[a], cols[b], 0); put(rows[a], cols[b], drop); }
      for (let k = 0; k < e.length - 1; k++) { const A = base + 2 * k, B = A + 1, C = A + 2, D = A + 3; idx.push(A, B, C, C, B, D, A, C, B, C, D, B); }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos.subarray(0, o), 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nor.subarray(0, o), 3));
  g.setIndex(o / 3 > 65535 ? new THREE.BufferAttribute(new Uint32Array(idx), 1) : new THREE.BufferAttribute(new Uint16Array(idx), 1));
  g.computeBoundingSphere(); g.computeBoundingBox();
  return g;
}

function lodChunks(h, nr, nc, x0, z0, dx, dz, chunk, steps, skip, normals, drop) {
  const out = [];
  for (let ci = 0; ci < nr - 1; ci += chunk) for (let cj = 0; cj < nc - 1; cj += chunk) {
    const levels = steps.map(st => buildChunk(h, nr, nc, x0, z0, dx, dz, normals, ci, cj, chunk, st, skip, drop));
    if (!levels[0]) continue;
    out.push({ levels, box: levels[0].boundingBox.clone() });
  }
  return out;
}

function skirtGeometry(h, nr, nc, x0, z0, dx, dz, drop) {
  const pos = [], nor = [], idx = [];
  const edges = [
    [...Array(nc).keys()].map(j => [0, j]),
    [...Array(nr).keys()].map(i => [i, nc - 1]),
    [...Array(nc).keys()].reverse().map(j => [nr - 1, j]),
    [...Array(nr).keys()].reverse().map(i => [i, 0]),
  ];
  for (const e of edges) {
    const base = pos.length / 3;
    for (const [i, j] of e) {
      const x = x0 + j * dx, z = z0 + i * dz, y = h[i * nc + j];
      pos.push(x, y, z, x, y - drop, z); nor.push(0, 1, 0, 0, 1, 0);
    }
    for (let k = 0; k < e.length - 1; k++) {
      const a = base + 2 * k, b = a + 1, c = a + 2, d = a + 3;
      idx.push(a, b, c, c, b, d, a, c, b, c, d, b); // both windings
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setIndex(idx); g.computeBoundingSphere();
  return g;
}

// far ring: non-linear grid around the context, heights continue the context edge and decay to gentle hills
function ringGeometry(ctxH, meta) {
  const [cE0, cN0, cE1, cN1] = meta.ctx;
  const cx = (cE0 + cE1) / 2 - meta.E0, cz = -((cN0 + cN1) / 2 - meta.N0);
  const R0 = (cE1 - cE0) / 2 - 12, Rmax = 22000, n = 180, a = 0.2;
  const g = (u) => { const s = Math.sign(u), v = Math.abs(u); return s * (v <= a ? v / a * R0 : R0 + (Rmax - R0) * Math.pow((v - a) / (1 - a), 2.2)); };
  const nc = 1000, res = 3;
  const sampleCtx = (x, z) => { // bilinear, clamped
    const E = x + meta.E0, N = meta.N0 - z;
    let fj = (E - cE0) / res - 0.5, fi = (cN1 - N) / res - 0.5;
    fj = Math.min(nc - 1.001, Math.max(0, fj)); fi = Math.min(nc - 1.001, Math.max(0, fi));
    const j = Math.floor(fj), i = Math.floor(fi), tj = fj - j, ti = fi - i;
    const h00 = ctxH[i * nc + j], h01 = ctxH[i * nc + j + 1], h10 = ctxH[(i + 1) * nc + j], h11 = ctxH[(i + 1) * nc + j + 1];
    return (h00 * (1 - tj) + h01 * tj) * (1 - ti) + (h10 * (1 - tj) + h11 * tj) * ti;
  };
  const hill = (x, z) => 18 * Math.sin(x / 2100 + 1.3) * Math.sin(z / 2700 + 0.4) + 9 * Math.sin(x / 900 - z / 1300 + 2.0) + 5 * Math.sin(z / 600 + x / 1700);
  const pos = new Float32Array(n * n * 3), nor = new Float32Array(n * n * 3);
  const base = 45 - meta.Z0 + 160; // local y of 205 m Bpv
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const u = -1 + 2 * j / (n - 1), v = -1 + 2 * i / (n - 1);
    const x = cx + g(u), z = cz + g(v);
    const half = (cE1 - cE0) / 2;
    const dB = Math.max(Math.abs(x - cx) - half, Math.abs(z - cz) - half);
    const he = sampleCtx(x, z);
    const w = 1 - Math.exp(-Math.max(dB, 0) / 1800);
    let y = he * (1 - w) + (base + hill(x, z)) * w;
    if (dB <= 0) y = he - 2.0;
    const o = (i * n + j) * 3; pos[o] = x; pos[o + 1] = y; pos[o + 2] = z;
  }
  // normals by finite differences on the irregular grid
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const jl = Math.max(0, j - 1), jr = Math.min(n - 1, j + 1), iu = Math.max(0, i - 1), id = Math.min(n - 1, i + 1);
    const ax = pos[(i * n + jr) * 3] - pos[(i * n + jl) * 3], ay = pos[(i * n + jr) * 3 + 1] - pos[(i * n + jl) * 3 + 1];
    const bz = pos[(id * n + j) * 3 + 2] - pos[(iu * n + j) * 3 + 2], by = pos[(id * n + j) * 3 + 1] - pos[(iu * n + j) * 3 + 1];
    const gx = ay / ax, gz = by / bz, l = Math.hypot(gx, 1, gz), o = (i * n + j) * 3;
    nor[o] = -gx / l; nor[o + 1] = 1 / l; nor[o + 2] = -gz / l;
  }
  const idx = [];
  const inner = (i, j) => { const u0 = -1 + 2 * j / (n - 1), u1 = -1 + 2 * (j + 1) / (n - 1), v0 = -1 + 2 * i / (n - 1), v1 = -1 + 2 * (i + 1) / (n - 1); return Math.max(Math.abs(u0), Math.abs(u1)) < a - 0.02 && Math.max(Math.abs(v0), Math.abs(v1)) < a - 0.02; };
  for (let i = 0; i < n - 1; i++) for (let j = 0; j < n - 1; j++) {
    if (inner(i, j)) continue;
    const A = i * n + j, B = A + 1, C = A + n, D = C + 1; idx.push(A, C, B, B, C, D);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  geo.setIndex(new THREE.BufferAttribute(new Uint32Array(idx), 1)); geo.computeBoundingSphere();
  return geo;
}

function boxUniform(bbox) { // [Emin,Nmin,Emax,Nmax] -> (a,b,w,h): u=(x-a)/w, v=(b-z)/h
  return new THREE.Vector4(bbox[0] - meta.E0, meta.N0 - bbox[1], bbox[2] - bbox[0], bbox[3] - bbox[1]);
}

function terrainMaterial({ ortho, box, cls, clsBox, dtm, det, disp = true, bias = 0, isRing = 0, refl = false }) {
  const m = new THREE.RawShaderMaterial({
    glslVersion: THREE.GLSL3,
    vertexShader: TERRAIN_VS,
    fragmentShader: (refl ? '#define REFL 1\n' : '') + SHADER_COMMON + TERRAIN_FS,
    uniforms: {
      ...U,
      uOrtho: { value: ortho }, uBox: { value: box },
      uCls: { value: cls || U._dummy.value }, uClsBox: { value: clsBox || box }, uHasCls: { value: cls ? 1 : 0 },
      uDtm: { value: dtm || U._dummyF.value }, uHasDtm: { value: dtm ? 1 : 0 },
      uBias: { value: bias }, uIsRing: { value: isRing }, uDisp: { value: (refl || !disp) ? 0.0 : (cfg.disp ?? 1.0) },
      uDet: { value: det || U._dummy.value }, uHasDet: { value: det ? 1 : 0 },
    },
  });
  terrainMats.push(m);
  return m;
}
function terrainPair(o) { return { main: terrainMaterial(o), refl: terrainMaterial({ ...o, refl: true }) }; }

export async function init(opts) {
  cfg = Object.assign({ w: 1080, h: 1920, ss: 2, sub: 2, vfov: 73.7, reflScale: 0.5 }, opts);
  meta = await (await fetch(BUILD + 'meta.json')).json();
  const canvas = document.createElement('canvas');
  canvas.width = cfg.w; canvas.height = cfg.h; document.body.appendChild(canvas);
  R = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance', alpha: false });
  R.setPixelRatio(1); R.setSize(cfg.w, cfg.h, false);
  R.outputColorSpace = THREE.LinearSRGBColorSpace; R.toneMapping = THREE.NoToneMapping;
  R.autoClear = true;
  const gl = R.getContext();

  // shared uniforms
  const az = THREE.MathUtils.degToRad(cfg.sunAz ?? 235), el = THREE.MathUtils.degToRad(cfg.sunEl ?? 38);
  U.uSunDir = { value: new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el)) };
  U.uCam = { value: new THREE.Vector3() };
  U.uHaze = { value: cfg.haze ?? 2.2e-4 };
  U.uExposure = { value: cfg.exposure ?? 1.0 };
  U.uClipY = { value: -1e9 };
  U.uTime = { value: 0 };
  const dummy = new THREE.DataTexture(new Uint8Array([0, 0, 200, 0]), 1, 1); dummy.needsUpdate = true;
  U._dummy = { value: dummy };
  const dummyF = new THREE.DataTexture(new Float32Array([0]), 1, 1, THREE.RedFormat, THREE.FloatType); dummyF.needsUpdate = true;
  U._dummyF = { value: dummyF };

  const [orthoCore, orthoCtx, orthoCtxM, cls, wmask, coreH, ctxH, dtmH, det, clsCtx, dtmCtxH] = await Promise.all([
    loadTex(DATA + 'orto_core_6400.jpg'),
    loadTex(DATA + 'orto_context_3000.jpg'),
    loadTex(DATA + 'orto_context_3000.jpg', { wrap: THREE.MirroredRepeatWrapping }),
    loadTex(BUILD + 'cls_core_1m.png', { srgb: false, aniso: 1 }),
    loadTex(BUILD + 'water_core_025.png', { srgb: false, aniso: 4 }),
    loadF32(BUILD + 'core_h_05.f32'),
    loadF32(BUILD + 'ctx_h_3m.f32'),
    loadF32(BUILD + 'dtm_1m.f32'),
    loadTex(BUILD + 'crown_det_025.png', { srgb: false, aniso: 1 }),
    loadTex(BUILD + 'cls_ctx_3m.png', { srgb: false, aniso: 1 }),
    loadF32(BUILD + 'dtm_ctx_3m.f32'),
  ]);
  // DTM as float texture (flip rows: data row 0 = north, GL v=0 = south)
  const dflip = new Float32Array(800 * 800);
  for (let i = 0; i < 800; i++) dflip.set(dtmH.subarray(i * 800, (i + 1) * 800), (799 - i) * 800);
  const dtmTex = new THREE.DataTexture(dflip, 800, 800, THREE.RedFormat, THREE.FloatType);
  dtmTex.minFilter = dtmTex.magFilter = THREE.LinearFilter; dtmTex.needsUpdate = true;
  const cflip = new Float32Array(1000 * 1000);
  for (let i = 0; i < 1000; i++) cflip.set(dtmCtxH.subarray(i * 1000, (i + 1) * 1000), (999 - i) * 1000);
  const dtmCtxTex = new THREE.DataTexture(cflip, 1000, 1000, THREE.RedFormat, THREE.FloatType);
  dtmCtxTex.minFilter = dtmCtxTex.magFilter = THREE.LinearFilter; dtmCtxTex.needsUpdate = true;
  for (const t of [orthoCtx, orthoCtxM]) t.anisotropy = 4;
  orthoCore.anisotropy = cfg.aniso ?? 8;

  sceneMain = new THREE.Scene();
  // sky dome
  skyMesh = new THREE.Mesh(new THREE.SphereGeometry(30000, 64, 32), new THREE.RawShaderMaterial({
    glslVersion: THREE.GLSL3, vertexShader: SKY_VS, fragmentShader: SHADER_COMMON + SKY_FS,
    uniforms: { ...U }, side: THREE.BackSide, depthWrite: false, depthTest: false,
  }));
  skyMesh.renderOrder = -10; skyMesh.frustumCulled = false;
  sceneMain.add(skyMesh);

  // core terrain 0.5 m
  const [nr, nc] = meta.core_n, res = meta.core_res;
  const x0 = meta.core[0] + res / 2 - meta.E0, z0 = -(meta.core[3] - res / 2 - meta.N0);
  const coreN = heightNormals(coreH, nr, nc, res, res, 2);
  const coreBox = boxUniform(meta.core);
  const coreMat = terrainPair({ ortho: orthoCore, box: coreBox, cls, clsBox: coreBox, dtm: dtmTex, det });
  for (const c of lodChunks(coreH, nr, nc, x0, z0, res, res, 100, [1, 2, 4, 8], null, coreN, 1.2)) {
    const m = new THREE.Mesh(c.levels[0], coreMat.main); m.userData = { lod: c, mats: coreMat, kind: 'core' }; sceneMain.add(m); lodMeshes.push(m);
  }
  const skirt = new THREE.Mesh(skirtGeometry(coreH, nr, nc, x0, z0, res, res, 6), coreMat.main);
  skirt.userData = { mats: coreMat }; sceneMain.add(skirt); matMeshes.push(skirt);

  // context 3 m with a hole under the core
  const cn = meta.ctx_n[0], cr = meta.ctx_res;
  const cx0 = meta.ctx[0] + cr / 2 - meta.E0, cz0 = -(meta.ctx[3] - cr / 2 - meta.N0);
  const ctxN = heightNormals(ctxH, cn, cn, cr, cr, 1);
  const inCore = (ia, ja, ib, jb) => {
    const xa = cx0 + ja * cr, xb = cx0 + jb * cr, za = cz0 + ia * cr, zb = cz0 + ib * cr;
    const m = 6;
    return xa > meta.core[0] - meta.E0 + m && xb < meta.core[2] - meta.E0 - m && za > -(meta.core[3] - meta.N0) + m && zb < -(meta.core[1] - meta.N0) - m;
  };
  const ctxBox = boxUniform(meta.ctx);
  const ctxMat = terrainPair({ ortho: orthoCtx, box: ctxBox, cls: clsCtx, clsBox: ctxBox, dtm: dtmCtxTex, disp: false, bias: 0.0 });
  for (const c of lodChunks(ctxH, cn, cn, cx0, cz0, cr, cr, 100, [1, 2, 4], inCore, ctxN, 3.0)) {
    const m = new THREE.Mesh(c.levels[0], ctxMat.main); m.userData = { lod: c, mats: ctxMat, kind: 'ctx' }; sceneMain.add(m); lodMeshes.push(m);
  }

  // far ring
  const ringMat = terrainPair({ ortho: orthoCtxM, box: ctxBox, bias: 1.5, isRing: 1, disp: false });
  const ring = new THREE.Mesh(ringGeometry(ctxH, meta), ringMat.main); ring.frustumCulled = false;
  ring.userData = { mats: ringMat }; matMeshes.push(ring);
  sceneMain.add(ring);

  // water planes
  const chans = { '1': [1, 0, 0, 0], '2': [0, 1, 0, 0], '4': [0, 0, 1, 0], '3': [0, 0, 0, 1] };
  for (const L of ['1', '2', '3', '4']) {
    const bb = meta.pond_bbox[L], lvl = meta.levels[L] - meta.Z0, m = 4;
    const w = bb[2] - bb[0] + 2 * m, d = bb[3] - bb[1] + 2 * m;
    const geo = new THREE.PlaneGeometry(w, d, 1, 1); geo.rotateX(-Math.PI / 2);
    geo.translate((bb[0] + bb[2]) / 2 - meta.E0, lvl, -((bb[1] + bb[3]) / 2 - meta.N0));
    const reflKey = (L === '2' || L === '4') ? 'small' : 'big';
    const mat = new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3, vertexShader: WATER_VS, fragmentShader: SHADER_COMMON + WATER_FS,
      uniforms: {
        ...U, uOrtho: { value: orthoCore }, uBox: { value: coreBox }, uMask: { value: wmask }, uMaskBox: { value: coreBox },
        uChan: { value: new THREE.Vector4(...chans[L]) }, uRefl: { value: null }, uReflMat: { value: new THREE.Matrix4() },
        uHasRefl: { value: 0 }, uLevel: { value: lvl }, uSeed: { value: +L * 1.37 }, uDebug: { value: cfg.debugWater ? 1 : 0 }, uReflBoost: { value: cfg.reflBoost ?? 2.0 },
      },
      transparent: true, depthWrite: true,
    });
    const mesh = new THREE.Mesh(geo, mat); mesh.renderOrder = 5; mesh.userData = { L, reflKey, lvl, bb };
    sceneMain.add(mesh); waterMeshes.push(mesh);
  }

  // cameras
  cam = new THREE.PerspectiveCamera(cfg.vfov, cfg.w / cfg.h, 8, 45000);
  reflCam = new THREE.PerspectiveCamera(cfg.vfov, cfg.w / cfg.h, 1, 45000);
  path = makeCameraPath(meta, cfg);

  // render targets
  const SW = Math.round(cfg.w * cfg.ss), SH = Math.round(cfg.h * cfg.ss);
  rtSS = new THREE.WebGLRenderTarget(SW, SH, { type: THREE.HalfFloatType, format: THREE.RGBAFormat, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: true, generateMipmaps: false });
  rtAcc = new THREE.WebGLRenderTarget(cfg.w, cfg.h, { type: THREE.FloatType, format: THREE.RGBAFormat, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false });
  const RW = Math.round(cfg.w * cfg.reflScale * cfg.ss), RH = Math.round(cfg.h * cfg.reflScale * cfg.ss);
  for (const k of ['big', 'small']) rtRefl[k] = new THREE.WebGLRenderTarget(RW, RH, { type: THREE.HalfFloatType, format: THREE.RGBAFormat, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: true });

  // fullscreen passes
  fsCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  fsScene = new THREE.Scene();
  const tri = new THREE.BufferGeometry();
  tri.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  downMat = new THREE.RawShaderMaterial({ glslVersion: THREE.GLSL3, vertexShader: FS_VS, fragmentShader: DOWN_FS,
    uniforms: { uSrc: { value: rtSS.texture }, uSrcSize: { value: new THREE.Vector2(SW, SH) }, uWeight: { value: 1 }, uStep: { value: cfg.ss / 2 } },
    blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendEquation: THREE.AddEquation, depthTest: false, depthWrite: false });
  postMat = new THREE.RawShaderMaterial({ glslVersion: THREE.GLSL3, vertexShader: FS_VS, fragmentShader: POST_FS,
    uniforms: { uSrc: { value: rtAcc.texture }, uSize: { value: new THREE.Vector2(cfg.w, cfg.h) }, uFrame: { value: 0 },
      uGrain: { value: cfg.grain ?? 0.018 }, uVignette: { value: cfg.vignette ?? 0.15 }, uSharpen: { value: cfg.sharpen ?? 0.35 },
      uCA: { value: cfg.ca ?? 0.7 }, uPostExposure: { value: cfg.postExposure ?? 1.08 }, uSat: { value: cfg.sat ?? 1.16 }, uContrast: { value: cfg.contrast ?? 1.12 } },
    depthTest: false, depthWrite: false });
  fsScene.add(new THREE.Mesh(tri, downMat));
  const postScene = new THREE.Scene(); postScene.add(new THREE.Mesh(tri, postMat));
  fsScene.userData.post = postScene;

  return { maxTex: gl.getParameter(gl.MAX_TEXTURE_SIZE), verts: countVerts(), frames: path.frames };
}

function countVerts() { let v = 0; sceneMain.traverse(o => { if (o.isMesh) v += o.geometry.attributes.position.count; }); return v; }

function setCamera(c, st, jitter, fullW, fullH) {
  c.position.copy(st.pos);
  c.up.set(0, 1, 0);
  c.quaternion.copy(st.quat);
  c.updateMatrixWorld(true);
  if (jitter) c.setViewOffset(fullW, fullH, jitter[0], jitter[1], fullW, fullH); else c.clearViewOffset();
  c.updateProjectionMatrix();
}

const _v = new THREE.Vector3();
function selectLOD(camPos, mode) {
  for (const m of lodMeshes) {
    const { lod, mats, kind } = m.userData;
    let L;
    if (mode === 'refl') { const d = lod.box.distanceToPoint(camPos); L = kind === 'core' ? 3 : 2; }
    else {
      if (lod.fixedL === undefined) {
        let d = Infinity;
        for (let i = 0; i <= 16; i++) d = Math.min(d, lod.box.distanceToPoint(path.at(i / 16 * 119 / 30).pos));
        lod.fixedL = kind === 'core' ? (d < (cfg.lod0 ?? 200) ? 0 : d < (cfg.lod1 ?? 420) ? 1 : d < 800 ? 2 : 3) : (d < 900 ? 0 : d < 1800 ? 1 : 2);
      }
      L = lod.fixedL;
    }
    L = Math.min(L, lod.levels.length - 1);
    while (L > 0 && !lod.levels[L]) L--;
    m.geometry = lod.levels[L];
    m.material = mode === 'refl' ? mats.refl : mats.main;
  }
  for (const m of matMeshes) m.material = mode === 'refl' ? m.userData.mats.refl : m.userData.mats.main;
}
const _plane = new THREE.Plane();
function renderReflection(key, level, st, jitter, fullW, fullH) {
  // virtual camera mirrored across y = level
  const p = st.pos.clone(); p.y = 2 * level - p.y;
  const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(st.quat); fwd.y = -fwd.y;
  const up = new THREE.Vector3(0, 1, 0).applyQuaternion(st.quat); up.y = -up.y;
  reflCam.position.copy(p); reflCam.up.copy(up); reflCam.lookAt(p.clone().add(fwd));
  reflCam.fov = cam.fov; reflCam.aspect = cam.aspect;
  if (jitter) reflCam.setViewOffset(fullW, fullH, jitter[0], jitter[1], fullW, fullH); else reflCam.clearViewOffset();
  reflCam.updateProjectionMatrix(); reflCam.updateMatrixWorld(true);
  U.uCam.value.copy(p); U.uClipY.value = level - 0.05;
  for (const w of waterMeshes) w.visible = false;
  selectLOD(p, 'refl');
  R.setRenderTarget(rtRefl[key]); R.setClearColor(0x000000, 1); R.clear(); R.render(sceneMain, reflCam);
  for (const w of waterMeshes) w.visible = true;
  U.uClipY.value = -1e9;
  const tm = new THREE.Matrix4().set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
  tm.multiply(reflCam.projectionMatrix).multiply(reflCam.matrixWorldInverse);
  return tm;
}

function pondVisible(mesh, c) {
  const fr = new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(c.projectionMatrix, c.matrixWorldInverse));
  mesh.geometry.computeBoundingBox();
  return fr.intersectsBox(mesh.geometry.boundingBox);
}

// Halton jitter
function halton(i, b) { let f = 1, r = 0; while (i > 0) { f /= b; r += f * (i % b); i = Math.floor(i / b); } return r; }

export const TIMES = {};
function tick(name, t0) { const gl = R.getContext(); gl.finish(); const dt = performance.now() - t0; TIMES[name] = (TIMES[name] || 0) + dt; return performance.now(); }
export function renderFrame(f, { readback = true } = {}) {
  let tt = performance.now();
  const SW = rtSS.width, SH = rtSS.height;
  R.setRenderTarget(rtAcc); R.setClearColor(0x000000, 1); R.clear();
  const K = cfg.sub;
  const shutter = cfg.shutter ?? 0.2; // fraction of frame interval (72 deg: bright-sun DJI without ND)
  for (let s = 0; s < K; s++) {
    const tFrame = f / 30;
    const ts = tFrame + ((s + 0.5) / K - 0.5) * shutter / 30;
    const st = path.at(ts);
    const jit = K > 1 ? [(halton(s + 1, 2) - 0.5) * 1.0, (halton(s + 1, 3) - 0.5) * 1.0] : null;
    U.uTime.value = ts;
    setCamera(cam, st, jit, SW, SH);
    // reflections
    for (const k of ['big', 'small']) {
      const ws = waterMeshes.filter(w => w.userData.reflKey === k);
      const vis = ws.some(w => pondVisible(w, cam));
      if (!vis) { ws.forEach(w => { w.material.uniforms.uHasRefl.value = 0; }); continue; }
      const lvl = (k === 'small' ? meta.levels['2'] : meta.levels['1']) - meta.Z0;
      const tm = renderReflection(k, lvl, st, jit ? [jit[0] * cfg.reflScale, jit[1] * cfg.reflScale] : null, rtRefl[k].width, rtRefl[k].height);
      ws.forEach(w => { w.material.uniforms.uRefl.value = rtRefl[k].texture; w.material.uniforms.uReflMat.value.copy(tm); w.material.uniforms.uHasRefl.value = 1; });
      tt = tick('refl_' + k, tt);
    }
    U.uCam.value.copy(st.pos);
    skyMesh.position.copy(st.pos);
    selectLOD(st.pos, 'main');
    R.setRenderTarget(rtSS); R.setClearColor(0x000000, 1); R.clear();
    R.render(sceneMain, cam);
    tt = tick('main', tt);
    // accumulate
    downMat.uniforms.uWeight.value = 1 / K;
    R.setRenderTarget(rtAcc); R.autoClear = false; R.render(fsScene, fsCam); R.autoClear = true;
  }
  postMat.uniforms.uFrame.value = f;
  R.setRenderTarget(null); R.render(fsScene.userData.post, fsCam);
  if (!readback) return null;
  const gl = R.getContext();
  const px = new Uint8Array(cfg.w * cfg.h * 4);
  gl.readPixels(0, 0, cfg.w, cfg.h, gl.RGBA, gl.UNSIGNED_BYTE, px);
  return px;
}

export function pick(f, pts) {
  const st = path.at(f / 30);
  setCamera(cam, st, null, 1, 1);
  selectLOD(st.pos, 'main');
  const rc = new THREE.Raycaster();
  const objs = lodMeshes;
  return pts.map(([px, py]) => {
    const ndc = new THREE.Vector2(px / cfg.w * 2 - 1, -(py / cfg.h * 2 - 1));
    rc.setFromCamera(ndc, cam);
    const hit = rc.intersectObjects(objs, false)[0];
    if (!hit) return null;
    const p = hit.point;
    return { E: p.x + meta.E0, N: meta.N0 - p.z, H: p.y + meta.Z0, d: hit.distance, kind: hit.object.userData.kind };
  });
}
export function camInfo(f) { const st = path.at(f / 30); return { pos: st.pos.toArray(), yaw: st.yaw, pitch: st.pitch, speed: st.speed, agl: st.agl }; }

// expose for the driver
window.__scene = { init, renderFrame, camInfo, TIMES, pick };
window.__ready = true;
