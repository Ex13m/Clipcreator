// Approach B - "game-engine realism" offline renderer for the Liben Libechov drone flyover.
// Deterministic: everything is driven by frame index; all randomness is seeded.
import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

const OX = 461550, ON = 5584850;
const BUILD = '/procedural/build/', DATA = '/data/';
const FPS = 30;

// ---------------------------------------------------------------- utils
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function makePerlin(seed) {
  const rnd = mulberry32(seed); const perm = [...Array(256).keys()];
  for (let i = 255; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
  const p = new Uint8Array(512); for (let i = 0; i < 512; i++) p[i] = perm[i & 255];
  const fade = t => t * t * t * (t * (t * 6 - 15) + 10), lerp = (a, b, t) => a + t * (b - a);
  const grad = (h, x, y, z) => { const u = h < 8 ? x : y, v = h < 4 ? y : (h === 12 || h === 14 ? x : z); return ((h & 1) ? -u : u) + ((h & 2) ? -v : v); };
  return (x, y, z) => {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
    x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
    const u = fade(x), v = fade(y), w = fade(z);
    const A = p[X] + Y, AA = p[A] + Z, AB = p[A + 1] + Z, B = p[X + 1] + Y, BA = p[B] + Z, BB = p[B + 1] + Z;
    return lerp(lerp(lerp(grad(p[AA] & 15, x, y, z), grad(p[BA] & 15, x - 1, y, z), u), lerp(grad(p[AB] & 15, x, y - 1, z), grad(p[BB] & 15, x - 1, y - 1, z), u), v),
      lerp(lerp(grad(p[AA + 1] & 15, x, y, z - 1), grad(p[BA + 1] & 15, x - 1, y, z - 1), u), lerp(grad(p[AB + 1] & 15, x, y - 1, z - 1), grad(p[BB + 1] & 15, x - 1, y - 1, z - 1), u), v), w);
  };
}
async function fetchF32(url) { const r = await fetch(url); return new Float32Array(await r.arrayBuffer()); }
async function fetchJSON(url) { return (await fetch(url)).json(); }
const texLoader = new THREE.TextureLoader();
async function loadTex(url, srgb = true, aniso = 8) {
  const t = await texLoader.loadAsync(url);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = aniso; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter;
  return t;
}

// ---------------------------------------------------------------- global look parameters
const P = {
  sunAz: 230, sunEl: 45,
  sunColor: new THREE.Color(1.0, 0.95, 0.86), sunIntensity: 7.0,
  envIntensity: 0.6,
  exposure: 0.62,
  hazeDensity: 1.7e-4, hazeFalloff: 1 / 420, hazeBase: 150,
  hazeColor: [0.90, 0.94, 1.0], hazeSunColor: [1.25, 1.16, 1.0],
  zenith: [0.36, 0.50, 0.78], horizon: [0.95, 0.99, 1.05],
  envZenith: [0.58, 0.64, 0.74], envHorizon: [0.92, 0.93, 0.94], envGround: [0.22, 0.24, 0.16],
  groundShadow: 0.55,
};
function sunDir() {
  const az = THREE.MathUtils.degToRad(P.sunAz), el = THREE.MathUtils.degToRad(P.sunEl);
  // toward the sun, E=+x, N=-z
  return new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el)).normalize();
}

// shared GLSL: haze (aerial perspective), constants baked at setup
function hazeGLSL() {
  const s = sunDir();
  const v3 = a => `vec3(${a.map(x => x.toFixed(5)).join(',')})`;
  return `
  const vec3 HZ_SUN = vec3(${s.x.toFixed(5)},${s.y.toFixed(5)},${s.z.toFixed(5)});
  vec3 hazeApply(vec3 col, vec3 toP, vec3 camPos) {
    float dist = max(length(toP), 1e-3); vec3 rd = toP / dist;
    float b = ${P.hazeFalloff.toFixed(7)};
    float h0 = max(camPos.y - ${P.hazeBase.toFixed(2)}, 0.0);
    float k = ${P.hazeDensity.toExponential(4)} * exp(-h0 * b);
    float ry = rd.y;
    float optical = (abs(ry * b * dist) > 1e-4) ? k * (1.0 - exp(-dist * ry * b)) / (ry * b) : k * dist;
    float f = 1.0 - exp(-max(optical, 0.0));
    float sd = max(dot(rd, HZ_SUN), 0.0);
    vec3 hz = mix(${v3(P.hazeColor)}, ${v3(P.hazeSunColor)}, pow(sd, 5.0));
    return mix(col, hz, f);
  }`;
}
function patchFogChunks() {
  THREE.ShaderChunk.fog_pars_vertex = `#ifdef USE_FOG
  varying vec3 vFogToP;
#endif`;
  THREE.ShaderChunk.fog_vertex = `#ifdef USE_FOG
  vFogToP = transpose(mat3(viewMatrix)) * mvPosition.xyz;
#endif`;
  THREE.ShaderChunk.fog_pars_fragment = `#ifdef USE_FOG
  uniform vec3 fogColor; varying vec3 vFogToP;
  #ifdef FOG_EXP2
  uniform float fogDensity;
  #else
  uniform float fogNear; uniform float fogFar;
  #endif
  ${hazeGLSL()}
#endif`;
  THREE.ShaderChunk.fog_fragment = `#ifdef USE_FOG
  gl_FragColor.rgb = hazeApply(gl_FragColor.rgb, vFogToP, cameraPosition);
#endif`;
}
const SHADOW_FROM = 'directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;';
const SHADOW_TO = 'directLight.color *= ( directLight.visible && receiveShadow ) ? mix(1.0, getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ), uShadowK) : 1.0;';
function withShadowK(fs) {
  const chunk = THREE.ShaderChunk.lights_fragment_begin;
  if (!chunk.includes(SHADOW_FROM)) throw new Error('shadow chunk mismatch');
  return fs.replace('#include <lights_fragment_begin>', chunk.replace(SHADOW_FROM, SHADOW_TO));
}

// ---------------------------------------------------------------- procedural textures
function makeNoise3D(seed) {
  const N = 64, data = new Uint8Array(N * N * N * 4), rnd = mulberry32(seed);
  const periods = [4, 8, 16, 32];
  periods.forEach((Pd, ch) => {
    const lat = new Float32Array(Pd * Pd * Pd); for (let i = 0; i < lat.length; i++) lat[i] = rnd();
    const L = (x, y, z) => lat[((z % Pd + Pd) % Pd) * Pd * Pd + ((y % Pd + Pd) % Pd) * Pd + ((x % Pd + Pd) % Pd)];
    const s = t => t * t * (3 - 2 * t);
    for (let z = 0; z < N; z++) for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const fx = x * Pd / N, fy = y * Pd / N, fz = z * Pd / N;
      const ix = Math.floor(fx), iy = Math.floor(fy), iz = Math.floor(fz);
      const tx = s(fx - ix), ty = s(fy - iy), tz = s(fz - iz);
      let v = 0;
      for (let c = 0; c < 8; c++) {
        const dx = c & 1, dy = (c >> 1) & 1, dz = (c >> 2) & 1;
        v += L(ix + dx, iy + dy, iz + dz) * (dx ? tx : 1 - tx) * (dy ? ty : 1 - ty) * (dz ? tz : 1 - tz);
      }
      data[((z * N + y) * N + x) * 4 + ch] = Math.round(v * 255);
    }
  });
  const t = new THREE.Data3DTexture(data, N, N, N);
  t.format = THREE.RGBAFormat; t.type = THREE.UnsignedByteType;
  t.wrapS = t.wrapT = t.wrapR = THREE.RepeatWrapping;
  t.minFilter = THREE.LinearFilter; t.magFilter = THREE.LinearFilter; t.unpackAlignment = 1; t.needsUpdate = true;
  return t;
}
function makeWaveNormals(seed) {
  const N = 256, rnd = mulberry32(seed), waves = [];
  for (let i = 0; i < 48; i++) {
    const kmag = 2 + Math.floor(rnd() * 14), ang = rnd() * Math.PI * 2;
    const kx = Math.round(Math.cos(ang) * kmag), ky = Math.round(Math.sin(ang) * kmag);
    if (kx === 0 && ky === 0) continue;
    waves.push([kx, ky, 1 / Math.pow(Math.hypot(kx, ky), 1.25), rnd() * Math.PI * 2]);
  }
  const data = new Uint8Array(N * N * 4);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    let gx = 0, gy = 0;
    for (const [kx, ky, a, ph] of waves) {
      const arg = 2 * Math.PI * (kx * x + ky * y) / N + ph, c = Math.cos(arg) * a * 2 * Math.PI / N;
      gx += c * kx; gy += c * ky;
    }
    const s = 22; // slope scale
    const n = new THREE.Vector3(-gx * s, 1, -gy * s).normalize();
    const o = (y * N + x) * 4;
    data[o] = Math.round((n.x * 0.5 + 0.5) * 255); data[o + 1] = Math.round((n.y * 0.5 + 0.5) * 255); data[o + 2] = Math.round((n.z * 0.5 + 0.5) * 255); data[o + 3] = 255;
  }
  const t = new THREE.DataTexture(data, N, N, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter; t.needsUpdate = true;
  return t;
}

// ---------------------------------------------------------------- state
const S = {};
window.S = S;

// ---------------------------------------------------------------- geometry builders
function gridGeometry(h, nx, nz, x0, z0, dx, uvFn, skipQuad) {
  const pos = new Float32Array(nx * nz * 3), uv = new Float32Array(nx * nz * 2);
  for (let i = 0; i < nz; i++) for (let j = 0; j < nx; j++) {
    const k = i * nx + j, X = x0 + j * dx, Z = z0 + i * dx;
    pos[k * 3] = X; pos[k * 3 + 1] = h[k]; pos[k * 3 + 2] = Z;
    const [u, v] = uvFn(X, Z); uv[k * 2] = u; uv[k * 2 + 1] = v;
  }
  const idx = [];
  for (let i = 0; i < nz - 1; i++) for (let j = 0; j < nx - 1; j++) {
    if (skipQuad && skipQuad(x0 + j * dx, z0 + i * dx, dx)) continue;
    const a = i * nx + j, b = a + 1, c = a + nx, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setIndex(idx.length > 65535 ? new THREE.Uint32BufferAttribute(idx, 1) : new THREE.Uint16BufferAttribute(idx, 1));
  g.computeVertexNormals();
  return g;
}

function terrainMaterial(map, opts = {}) {
  const m = new THREE.MeshStandardMaterial({ map, roughness: 0.93, metalness: 0.0, envMapIntensity: P.envIntensity });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uShadowK = { value: opts.shadowK ?? P.groundShadow };
    sh.uniforms.tNoise = { value: S.noise3 };
    sh.uniforms.uDetail = { value: opts.detail ?? 1.0 };
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP;')
      .replace('#include <fog_vertex>', '#include <fog_vertex>\n vWP = (modelMatrix * vec4(transformed,1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP; uniform float uShadowK; uniform highp sampler3D tNoise; uniform float uDetail;')
      .replace('#include <map_fragment>', `#include <map_fragment>
        {
          float n1 = texture(tNoise, vec3(vWP.xz * 0.055, 0.31)).g;
          float n2 = texture(tNoise, vec3(vWP.xz * 0.21, 0.73)).b;
          float n3 = texture(tNoise, vec3(vWP.xz * 0.9, 0.11)).a;
          float d = (n1 - 0.5) * 0.10 + (n2 - 0.5) * 0.12 + (n3 - 0.5) * 0.10;
          diffuseColor.rgb *= 1.0 + d * uDetail;
        }`);
    sh.fragmentShader = withShadowK(sh.fragmentShader);
  };
  return m;
}

function buildTerrain(hCore, hCtx, orthoCore, orthoCtx) {
  // decimate: core 2 m (native DTM resolution), context 6 m
  const dec = (h, n, f) => { const m = Math.floor(n / f), o = new Float32Array(m * m);
    for (let i = 0; i < m; i++) for (let j = 0; j < m; j++) { let s = 0; for (let a = 0; a < f; a++) for (let b = 0; b < f; b++) s += h[(i * f + a) * n + j * f + b]; o[i * m + j] = s / (f * f); } return o; };
  const cs = S.opts.coreStep || 2, xs = S.opts.ctxStep || 2;
  const hc = cs > 1 ? dec(hCore, 800, cs) : hCore, nc = 800 / cs;
  const gCore = gridGeometry(hc, nc, nc, -400 + cs / 2, -400 + cs / 2, cs, (X, Z) => [(X + 400) / 800, (400 - Z) / 800]);
  const core = new THREE.Mesh(gCore, terrainMaterial(orthoCore));
  core.receiveShadow = true; core.castShadow = true;
  const inside = (X, Z, d) => Math.abs(X) < 394 && Math.abs(Z) < 394 && Math.abs(X + d) < 394 && Math.abs(Z + d) < 394;
  const hx = xs > 1 ? dec(hCtx, 1000, xs) : hCtx, nx = 1000 / xs, dx = 3 * xs;
  const gCtx = gridGeometry(hx, nx, nx, -1500 + dx / 2, -1500 + dx / 2, dx, (X, Z) => [(X + 1500) / 3000, (1500 - Z) / 3000], inside);
  const ctx = new THREE.Mesh(gCtx, terrainMaterial(orthoCtx, { detail: 0.6 }));
  ctx.receiveShadow = true; ctx.castShadow = true;
  // far ring: from the context border outwards, heights blend to a smooth valley floor
  const rings = 26, per = 4 * 96, pos = [], uv = [], idx = [];
  const edgeH = (X, Z) => {
    const j = Math.min(999, Math.max(0, Math.round((X + 1498.5) / 3))), i = Math.min(999, Math.max(0, Math.round((Z + 1498.5) / 3)));
    return hCtx[i * 1000 + j];
  };
  const prl = makePerlin(99);
  for (let r = 0; r <= rings; r++) {
    const t = r / rings, half = 1494 + (24000 - 1494) * t * t;
    for (let k = 0; k < per; k++) {
      const s = k / per * 4, side = Math.floor(s), f = s - side;
      let X, Z;
      if (side === 0) { X = -half + 2 * half * f; Z = -half; } else if (side === 1) { X = half; Z = -half + 2 * half * f; }
      else if (side === 2) { X = half - 2 * half * f; Z = half; } else { X = -half; Z = half - 2 * half * f; }
      const ex = Math.max(-1494, Math.min(1494, X)), ez = Math.max(-1494, Math.min(1494, Z));
      const he = edgeH(ex, ez) - 1.0;
      const base = 168 + 45 * prl(X / 5200, Z / 5200, 0.5) + 18 * prl(X / 1700, Z / 1700, 2.5);
      const w = THREE.MathUtils.smoothstep(half, 1500, 4200);
      pos.push(X, he * (1 - w) + base * w - (r === 0 ? 0.6 : 0), Z);
      uv.push((X + 1500) / 3000, (1500 - Z) / 3000);
    }
  }
  for (let r = 0; r < rings; r++) for (let k = 0; k < per; k++) {
    const a = r * per + k, b = r * per + (k + 1) % per, c = a + per, d = b + per;
    idx.push(a, b, c, b, d, c);
  }
  const gR = new THREE.BufferGeometry();
  gR.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  gR.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  gR.setIndex(idx); gR.computeVertexNormals();
  const ringTex = orthoCtx.clone(); ringTex.wrapS = ringTex.wrapT = THREE.MirroredRepeatWrapping; ringTex.needsUpdate = true;
  const ring = new THREE.Mesh(gR, terrainMaterial(ringTex, { detail: 0.3 }));
  ring.receiveShadow = false;
  return [core, ctx, ring];
}

// ---------------------------------------------------------------- trees
function crownGeometry(detail, seed, kind) {
  // star-shaped union of sub-blobs ("cauliflower" deciduous crown), plus fine lumps
  let g = new THREE.IcosahedronGeometry(1, detail);
  g.deleteAttribute('normal'); g.deleteAttribute('uv');
  g = mergeVertices(g);
  const prl = makePerlin(seed), rnd = mulberry32(seed * 7 + 3);
  const pos = g.attributes.position, n = pos.count, cav = new Float32Array(n), rr = new Float32Array(n);
  const blobs = [];
  const nb = kind === 1 ? 4 + Math.floor(rnd() * 3) : 9 + Math.floor(rnd() * 7);
  blobs.push([0, 0.05, 0, 0.62]);
  for (let i = 0; i < nb; i++) {
    let x, y, z; do { x = rnd() * 2 - 1; y = rnd() * 2 - 1; z = rnd() * 2 - 1; } while (x * x + y * y + z * z > 1);
    y = y * 0.75 + 0.22;                                   // upper-heavy
    const d = 0.32 + 0.30 * rnd(), L = Math.hypot(x, y, z) || 1;
    blobs.push([x / L * d, y / L * d, z / L * d, 0.30 + 0.20 * rnd()]);
  }
  const o1 = [rnd() * 50, rnd() * 50, rnd() * 50], o2 = [rnd() * 50, rnd() * 50, rnd() * 50];
  const v = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    let best = 0.35;
    for (const [cx, cy, cz, R] of blobs) {
      const b = v.x * cx + v.y * cy + v.z * cz, c = cx * cx + cy * cy + cz * cz - R * R, disc = b * b - c;
      if (disc >= 0) best = Math.max(best, b + Math.sqrt(disc));
    }
    const a = prl(v.x * 2.2 + o1[0], v.y * 2.2 + o1[1], v.z * 2.2 + o1[2]);
    const c2 = prl(v.x * 8.0 + o2[0], v.y * 8.0 + o2[1], v.z * 8.0 + o2[2]);
    let r = best * (1 + 0.07 * a + 0.06 * c2 + 0.035 * prl(v.x * 17.0 + o1[2], v.y * 17.0 + o2[0], v.z * 17.0 + o1[1]));
    if (v.y < 0) r *= 1 - 0.22 * v.y * v.y;
    rr[i] = r;
  }
  const srt = Array.from(rr).sort((p, q) => p - q), norm = srt[Math.floor(srt.length * 0.85)];
  for (let i = 0; i < n; i++) {
    v.fromBufferAttribute(pos, i).normalize().multiplyScalar(rr[i] / norm);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  // cavity: compare radius to the mean radius of the neighbourhood (concave creases between blobs -> dark)
  const idx = g.index.array, sum = new Float32Array(n), cnt = new Float32Array(n);
  for (let t = 0; t < idx.length; t += 3) for (let k = 0; k < 3; k++) {
    const a = idx[t + k], b = idx[t + (k + 1) % 3];
    sum[a] += rr[b]; cnt[a]++; sum[b] += rr[a]; cnt[b]++;
  }
  for (let i = 0; i < n; i++) cav[i] = THREE.MathUtils.clamp(0.6 + (rr[i] - sum[i] / cnt[i]) / norm * 9.0, 0, 1);
  g.setAttribute('aCav', new THREE.BufferAttribute(cav, 1));
  return g;
}
function foliageMaterial(opts) {
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, metalness: 0, envMapIntensity: P.envIntensity * 1.5 });
  const SHELL = opts.shell ? 1 : 0;
  m.customProgramCacheKey = () => 'fol' + SHELL + (opts.orthoMix > 0 ? 'o' : 'n');
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, {
      uShadowK: { value: 1.0 }, tNoise: { value: S.noise3 }, tOrtho: { value: S.orthoOrig }, uOrthoMix: { value: opts.orthoMix },
      uAlb: { value: opts.albedo ?? 1.0 }, uBaked: { value: opts.baked ?? 0.5 }, uSun: { value: sunDir() }, uSunCol: { value: P.sunColor.clone().multiplyScalar(P.sunIntensity) },
      uClump: { value: opts.clump ?? 0.75 },
    });
    sh.vertexShader = sh.vertexShader.replace('#include <common>', `#include <common>
      attribute float aCav; attribute vec2 aInst; varying vec3 vWP; varying vec3 vObj; varying float vCav; varying vec2 vInst; varying vec3 vNW;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
      #if ${SHELL}
      transformed *= 1.06 + 0.03 * aCav;
      #endif`)
      .replace('#include <fog_vertex>', `#include <fog_vertex>
      vWP = (modelMatrix * instanceMatrix * vec4(transformed,1.0)).xyz; vObj = position; vCav = aCav; vInst = aInst;
      { mat3 im = mat3(instanceMatrix); vec3 nn = objectNormal / vec3(dot(im[0],im[0]), dot(im[1],im[1]), dot(im[2],im[2])); vNW = normalize(mat3(modelMatrix) * im * nn); }`);
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
      varying vec3 vWP; varying vec3 vObj; varying float vCav; varying vec2 vInst; varying vec3 vNW;
      uniform float uShadowK; uniform highp sampler3D tNoise; uniform sampler2D tOrtho; uniform float uOrthoMix; uniform float uAlb; uniform float uBaked; uniform float uClump;
      uniform vec3 uSun; uniform vec3 uSunCol;
      vec3 hash33(vec3 p){ p = fract(p * vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yxz + 33.33); return fract((p.xxy + p.yxx) * p.zyx); }
      // cellular clumps: returns F1, F2-F1, vector surface->nearest feature, cell hash
      void worley(vec3 p, out float f1, out float edge, out vec3 vfeat, out float cid){
        vec3 i = floor(p), f = fract(p); float d1 = 9.0, d2 = 9.0; vec3 v1 = vec3(0.0); vec3 c1 = vec3(0.0);
        for (int z = -1; z <= 1; z++) for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
          vec3 g = vec3(float(x), float(y), float(z)); vec3 o = hash33(i + g); vec3 r = g + o - f; float d = dot(r, r);
          if (d < d1) { d2 = d1; d1 = d; v1 = r; c1 = i + g; } else if (d < d2) d2 = d;
        }
        f1 = sqrt(d1); edge = sqrt(d2) - f1; vfeat = v1; cid = hash33(c1 * 1.37).x;
      }
      float fol(vec3 p){ return texture(tNoise, p*0.11).b*0.45 + texture(tNoise, p*0.23).a*0.35 + texture(tNoise, p*0.53).a*0.20; }`)
      .replace('#include <color_fragment>', `#include <color_fragment>
      vec3 wp = vWP * 1.15 + vec3(vInst.y*13.0, 0.0, vInst.y*7.0);
      float fn = fol(wp);
      #if ${SHELL}
      {
        float hn = texture(tNoise, vWP * 0.62 + vInst.y * 3.0).a * 0.6 + texture(tNoise, vWP * 0.23).b * 0.4;
        if (hn < 0.53) discard;
      }
      #endif
      float inCore = step(abs(vWP.x), 399.0) * step(abs(vWP.z), 399.0);
      float top = smoothstep(0.2, 0.75, normalize(vNW).y);
      vec2 jit = (texture(tNoise, vWP * 0.31).rg - 0.5) * 2.4 * (1.0 - top);
      vec2 oxz = vWP.xz + jit;
      #define OUV(p) vec2(((p).x + 400.0) / 800.0, (400.0 - (p).y) / 800.0)
      vec3 oc = texture(tOrtho, OUV(oxz)).rgb;
      float veg = smoothstep(0.0, 0.02, oc.g - 0.5 * (oc.r + oc.b)) * (1.0 - smoothstep(0.22, 0.40, dot(oc, vec3(0.33))));
      float wO = uOrthoMix * inCore * veg;
      vec3 bakedCol = vec3(0.0);
      {
        vec3 inst = diffuseColor.rgb;
        vec3 alb = mix(inst * (0.82 + 0.36 * fn), oc * (0.92 + 0.16 * fn), wO) * vec3(1.04, 1.02, 0.9);
        float ao = mix(0.62, 1.0, smoothstep(-0.9, 0.6, vObj.y)) * mix(0.6, 1.0, vCav);
        diffuseColor.rgb = alb * ao * uAlb;
        bakedCol = oc * ao * wO * top;
      }`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
      {
        vec3 nW = normalize((vec4(normal, 0.0) * viewMatrix).xyz);
        nW = normalize(mix(nW, vec3(0.0, 1.0, 0.0), 0.35 * top + 0.15));
        float e = 0.16;
        vec3 LW = vec3(0.3, 0.6, 0.1);
        float l0 = dot(oc, LW);
        float lx = dot(texture(tOrtho, OUV(oxz + vec2(e, 0.0))).rgb, LW);
        float lz = dot(texture(tOrtho, OUV(oxz + vec2(0.0, e))).rgb, LW);
        vec3 g = vec3(lx - l0, 0.0, lz - l0) / e * 3.2 * wO;
        if (wO < 0.5) {
          float px = fol(wp + vec3(0.2,0,0)) - fn, py = fol(wp + vec3(0,0.2,0)) - fn, pz = fol(wp + vec3(0,0,0.2)) - fn;
          g += vec3(px, py, pz) / 0.2 * 0.5;
        }
        nW = normalize(nW - g);
        normal = normalize(mat3(viewMatrix) * nW);
      }`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
      {
        vec3 V = normalize(vWP - cameraPosition);
        float tr = pow(clamp(dot(V, uSun), 0.0, 1.0), 4.0);
        totalEmissiveRadiance += diffuseColor.rgb * uSunCol * 0.14 * tr;
        totalEmissiveRadiance += bakedCol * uBaked;
      }`);
    sh.fragmentShader = withShadowK(sh.fragmentShader);
  };
  return m;
}
async function buildTrees(scene) {
  const meta = await fetchJSON(BUILD + 'trees.json'), a = await fetchF32(BUILD + 'trees.f32'), st = meta.stride;
  const variants = { 0: [], 1: [], 2: [] };
  for (let i = 0; i < 8; i++) variants[0].push(crownGeometry(3, 101 + i, 0));
  const lo0 = []; for (let i = 0; i < 8; i++) lo0.push(crownGeometry(2, 101 + i, 0));
  variants[3] = lo0;
  for (let i = 0; i < 4; i++) variants[1].push(crownGeometry(2, 201 + i, 1));
  for (let i = 0; i < 5; i++) variants[2].push(crownGeometry(2, 301 + i, 2));
  const mats = { 0: foliageMaterial({ orthoMix: 0.85, albedo: 1.0 }), 1: foliageMaterial({ orthoMix: 0.6, albedo: 1.0, clump: 0.6 }), 2: foliageMaterial({ orthoMix: 0.0, albedo: 1.0 }) };
  mats[3] = mats[0];
  const shellMat = foliageMaterial({ orthoMix: 0.85, albedo: 1.0, shell: true });
  const camEnd = S.cam.frames[S.cam.frames.length - 1].pos;
  const groups = new Map();
  const cell = { 0: 80, 1: 100, 2: 400, 3: 120 };
  for (let i = 0; i < meta.count; i++) {
    const o = i * st, seed = a[o + 9];
    let kind = a[o + 10];
    if (kind === 0 && (a[o + 3] < 2.8 || Math.hypot(a[o] - camEnd[0], a[o + 2] - camEnd[2]) > (S.opts.lodDist || 200))) kind = 3;
    const nv = variants[kind].length, vi = Math.min(nv - 1, Math.floor(seed * nv));
    const cx = Math.floor(a[o] / cell[kind]), cz = Math.floor(a[o + 2] / cell[kind]);
    const key = `${kind}|${vi}|${cx}|${cz}`;
    if (!groups.has(key)) groups.set(key, { kind, vi, items: [] });
    groups.get(key).items.push(o);
  }
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), ps = new THREE.Vector3(), col = new THREE.Color(), up = new THREE.Vector3(0, 1, 0);
  let count = 0;
  for (const { kind, vi, items } of groups.values()) {
    const geo = variants[kind][vi].clone();
    const inst = new Float32Array(items.length * 2);
    const mesh = new THREE.InstancedMesh(geo, mats[kind], items.length);
    items.forEach((o, k) => {
      const x = a[o], g = a[o + 1], z = a[o + 2], r = a[o + 3], h = a[o + 4], seed = a[o + 9];
      const rnd = mulberry32(Math.floor(seed * 1e6) + 17);
      let cv, cy, rx = r * (0.92 + 0.16 * rnd()), rz = r * (0.92 + 0.16 * rnd());
      const edge = a[o + 8];
      if (kind === 1) { cv = Math.max(h * 0.55, 0.45); cy = g + h - cv; }
      else if (kind === 2) { cv = THREE.MathUtils.clamp(0.42 * h, 0.8 * r, 1.4 * r); cy = g + h - cv; }
      else { cv = THREE.MathUtils.clamp((0.40 + 0.12 * edge) * h, 0.85 * r, (1.3 + 0.5 * edge) * r); cy = g + h - cv; rx *= 0.95; rz *= 0.95; }
      ps.set(x, cy, z); q.setFromAxisAngle(up, seed * Math.PI * 2 * 7.0); sc.set(rx, cv, rz);
      m4.compose(ps, q, sc); mesh.setMatrixAt(k, m4);
      col.setRGB(a[o + 5], a[o + 6], a[o + 7], THREE.SRGBColorSpace);
      mesh.setColorAt(k, col);
      inst[k * 2] = a[o + 8]; inst[k * 2 + 1] = seed;
    });
    geo.setAttribute('aInst', new THREE.InstancedBufferAttribute(inst, 2));
    mesh.castShadow = true; mesh.receiveShadow = true;
    mesh.computeBoundingSphere();
    mesh.userData.kind = kind;
    if (kind === 1 || kind === 2) mesh.layers.set(1);
    if (kind === 3) mesh.layers.enable(1);
    scene.add(mesh); count += items.length;
    if ((kind === 0 || kind === 3) && !S.opts.noShell) {
      const sh = new THREE.InstancedMesh(geo, shellMat, items.length);
      sh.instanceMatrix = mesh.instanceMatrix; sh.instanceColor = mesh.instanceColor;
      sh.castShadow = false; sh.receiveShadow = true; sh.boundingSphere = mesh.boundingSphere.clone(); sh.boundingSphere.radius += 2.0;
      sh.layers.set(1); sh.userData.shell = true;
      scene.add(sh);
    }
  }
  // trunks for trees whose crown base is clearly above ground
  const tr = [];
  for (let i = 0; i < meta.count; i++) {
    const o = i * st, kind = a[o + 10]; if (kind !== 0) continue;
    const g = a[o + 1], r = a[o + 3], h = a[o + 4];
    const e8 = a[o + 8], cv = THREE.MathUtils.clamp((0.40 + 0.12 * e8) * h, 0.85 * r, (1.3 + 0.5 * e8) * r), base = g + h - 2 * cv * 0.8;
    if (base - g > 1.5 && e8 > 0.6) tr.push([a[o], g, a[o + 2], base - g + cv * 0.6, 0.08 + 0.012 * h]);
  }
  const tg = new THREE.CylinderGeometry(0.75, 1.0, 1, 6, 1, true); tg.translate(0, 0.5, 0);
  const tm = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.11, 0.095, 0.08), roughness: 0.95, envMapIntensity: P.envIntensity });
  const tmesh = new THREE.InstancedMesh(tg, tm, tr.length);
  tr.forEach(([x, g, z, len, rad], k) => { m4.compose(ps.set(x, g - 0.3, z), q.identity(), sc.set(rad, len, rad)); tmesh.setMatrixAt(k, m4); });
  tmesh.castShadow = true; tmesh.receiveShadow = true; tmesh.computeBoundingSphere();
  scene.add(tmesh);
  return count;
}

// ---------------------------------------------------------------- buildings
async function buildBuildings(scene) {
  const meta = await fetchJSON(BUILD + 'buildings.json'), a = await fetchF32(BUILD + 'buildings.f32');
  const n = meta.vertices, st = meta.stride;
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), kind = new Float32Array(n), wuv = new Float32Array(n * 2), bid = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const o = i * st;
    pos.set([a[o], a[o + 1], a[o + 2]], i * 3); nor.set([a[o + 3], a[o + 4], a[o + 5]], i * 3);
    kind[i] = a[o + 6]; wuv[i * 2] = a[o + 7]; wuv[i * 2 + 1] = a[o + 8]; bid[i] = a[o + 9];
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  g.setAttribute('aKind', new THREE.BufferAttribute(kind, 1));
  g.setAttribute('aWall', new THREE.BufferAttribute(wuv, 2));
  g.setAttribute('aBld', new THREE.BufferAttribute(bid, 1));
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, metalness: 0, side: THREE.DoubleSide, envMapIntensity: P.envIntensity });
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, { uShadowK: { value: 1.0 }, tOrtho: { value: S.orthoOrig }, tNoise: { value: S.noise3 } });
    sh.vertexShader = sh.vertexShader.replace('#include <common>', `#include <common>
      attribute float aKind; attribute vec2 aWall; attribute float aBld; varying float vKind; varying vec2 vWall; varying float vBld; varying vec3 vWP;`)
      .replace('#include <fog_vertex>', `#include <fog_vertex>
      vKind = aKind; vWall = aWall; vBld = aBld; vWP = (modelMatrix * vec4(transformed,1.0)).xyz;`);
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
      varying float vKind; varying vec2 vWall; varying float vBld; varying vec3 vWP;
      uniform float uShadowK; uniform sampler2D tOrtho; uniform highp sampler3D tNoise;
      float h11(float x){ return fract(sin(x*127.1)*43758.5453); }
      vec3 s2l(vec3 c){ return pow(c, vec3(2.2)); }
      float winMask; float glassMask;`)
      .replace('#include <color_fragment>', `#include <color_fragment>
      winMask = 0.0; glassMask = 0.0;
      if (vKind < 0.5) {
        vec2 ouv = vec2((vWP.x + 400.0) / 800.0, (400.0 - vWP.z) / 800.0);
        diffuseColor.rgb = texture(tOrtho, ouv).rgb * 0.95;
      } else if (vKind < 1.5) {
        bool hall = vBld >= 2.0;
        float r = fract(vBld);
        vec3 c;
        if (hall) c = s2l(vec3(0.80, 0.81, 0.80));
        else {
          int k = int(floor(r * 7.0));
          c = k==0 ? vec3(0.86,0.85,0.81) : k==1 ? vec3(0.86,0.80,0.66) : k==2 ? vec3(0.88,0.80,0.58) : k==3 ? vec3(0.74,0.74,0.72)
            : k==4 ? vec3(0.82,0.70,0.52) : k==5 ? vec3(0.86,0.74,0.66) : vec3(0.90,0.89,0.86);
          c = s2l(c);
        }
        float u = vWall.x, v = vWall.y;
        // grime / variation
        float gn = texture(tNoise, vec3(vWP.xz*0.15, vWP.y*0.15)).g;
        c *= 0.88 + 0.2*gn;
        c *= mix(0.62, 1.0, smoothstep(0.25, 0.7, v));      // plinth
        if (hall) {
          c *= 0.95 + 0.05 * sin(u * 31.4);                   // corrugated cladding
          float band = step(2.4, v) * step(v, 3.3) * step(0.4, fract(u / 3.0)) * step(fract(u/3.0), 0.92);
          winMask = band;
        } else {
          float sp = 2.7 + 1.1 * h11(r * 13.0);
          float fu = fract((u + h11(r*7.0) * sp) / sp);
          float fl = mod(v - 0.95, 2.9);
          float wx = step(0.5 - 0.55/sp, fu) * step(fu, 0.5 + 0.55/sp);
          float wy = step(0.0, fl) * step(fl, 1.35) * step(0.9, v);
          winMask = wx * wy;
          float fx = step(0.5 - 0.47/sp, fu) * step(fu, 0.5 + 0.47/sp);
          float fy = step(0.08, fl) * step(fl, 1.27);
          glassMask = winMask * fx * fy;
        }
        if (winMask > 0.5) c = glassMask > 0.5 || hall ? vec3(0.025, 0.03, 0.035) : s2l(vec3(0.92));
        diffuseColor.rgb = c;
      } else {
        diffuseColor.rgb = s2l(vec3(0.20, 0.17, 0.15));
      }`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
      if (vKind < 0.5) roughnessFactor = 0.62; else if (winMask > 0.5) roughnessFactor = 0.12; else roughnessFactor = 0.9;`);
    sh.fragmentShader = withShadowK(sh.fragmentShader);
  };
  const mesh = new THREE.Mesh(g, m);
  mesh.castShadow = true; mesh.receiveShadow = true;
  scene.add(mesh);
  return meta.buildings.length;
}

// ---------------------------------------------------------------- water
const PONDS = [
  { name: 'big', level: 169.85, bbox: [461497.31, 5584738.56, 461650.94, 5584981.69], chan: [1, 0, 0, 0], reflect: true },
  { name: 'small', level: 167.19, bbox: [461422.69, 5584665.06, 461480.94, 5584719.44], chan: [0, 1, 0, 0], reflect: true },
  { name: 'rearing', level: 166.86, bbox: [461348.06, 5584727.56, 461487.69, 5584774.06], chan: [0, 0, 1, 0], reflect: false },
  { name: 'north', level: 172.06, bbox: [461625.31, 5585098.81, 461689.44, 5585218.19], chan: [0, 0, 0, 1], reflect: false },
];
function waterMaterial(pond) {
  const s = sunDir();
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: {
      tMask: { value: S.waterMask }, uChan: { value: new THREE.Vector4(...pond.chan) }, tOrtho: { value: S.orthoOrig },
      tWave: { value: S.waveN }, uTime: { value: 0 }, tReflect: { value: null }, uReflVP: { value: new THREE.Matrix4() }, uHasRefl: { value: 0 },
      uSunDir: { value: s }, uSunCol: { value: P.sunColor.clone().multiplyScalar(P.sunIntensity) },
      uZen: { value: new THREE.Vector3(...P.zenith) }, uHor: { value: new THREE.Vector3(...P.horizon) },
    },
    vertexShader: `varying vec3 vWP; void main(){ vec4 w = modelMatrix*vec4(position,1.0); vWP=w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,
    fragmentShader: `
      precision highp float;
      varying vec3 vWP;
      uniform sampler2D tMask, tOrtho, tWave, tReflect; uniform vec4 uChan; uniform float uTime, uHasRefl; uniform mat4 uReflVP;
      uniform vec3 uSunDir, uSunCol, uZen, uHor;
      ${hazeGLSL()}
      vec3 sky(vec3 d){ float h = max(d.y, 0.0); return mix(uHor, uZen, pow(h, 0.5)); }
      void main(){
        vec2 ouv = vec2((vWP.x + 400.0) / 800.0, (400.0 - vWP.z) / 800.0);
        float a = dot(texture(tMask, ouv), uChan);
        if (a < 0.02) discard;
        vec2 p = vWP.xz;
        vec3 w1 = texture(tWave, p / 4.7 + uTime * vec2(0.011, 0.006)).xyz * 2.0 - 1.0;
        vec3 w2 = texture(tWave, p / 1.9 + uTime * vec2(-0.017, 0.021)).xyz * 2.0 - 1.0;
        vec3 w3 = texture(tWave, p / 0.8 + uTime * vec2(0.031, -0.012)).xyz * 2.0 - 1.0;
        vec3 n = normalize(vec3(0.0, 1.0, 0.0) + vec3(w1.x + w2.x * 0.8 + w3.x * 0.5, 0.0, w1.z + w2.z * 0.8 + w3.z * 0.5) * 0.045);
        vec3 V = normalize(cameraPosition - vWP);
        float ndv = clamp(dot(n, V), 0.0, 1.0);
        float F = 0.02 + 0.98 * pow(1.0 - ndv, 5.0);
        vec3 R = reflect(-V, n);
        vec3 refl = sky(R);
        if (uHasRefl > 0.5) {
          vec4 rc = uReflVP * vec4(vWP + vec3(n.x, 0.0, n.z) * 1.2, 1.0);
          vec2 ruv = rc.xy / rc.w * 0.5 + 0.5;
          if (ruv.x > 0.0 && ruv.x < 1.0 && ruv.y > 0.0 && ruv.y < 1.0) refl = texture(tReflect, ruv).rgb;
        }
        vec3 body = texture(tOrtho, ouv).rgb * 0.92;
        vec3 col = mix(body, refl, F);
        vec3 H = normalize(V + uSunDir);
        float nh = max(dot(n, H), 0.0);
        float spec = pow(nh, 2600.0) * 22.0 + pow(nh, 300.0) * 0.35;
        float Fs = 0.02 + 0.98 * pow(1.0 - max(dot(H, V), 0.0), 5.0);
        col += uSunCol * spec * Fs;
        col = hazeApply(col, vWP - cameraPosition, cameraPosition);
        gl_FragColor = vec4(col, smoothstep(0.02, 0.9, a));
      }`,
  });
}
function buildWater(scene) {
  S.water = [];
  for (const pd of PONDS) {
    const [e0, n0, e1, n1] = pd.bbox, m = 3;
    const w = e1 - e0 + 2 * m, h = n1 - n0 + 2 * m;
    const g = new THREE.PlaneGeometry(w, h, 1, 1); g.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(g, waterMaterial(pd));
    mesh.position.set((e0 + e1) / 2 - OX, pd.level, -((n0 + n1) / 2 - ON));
    mesh.renderOrder = 2;
    mesh.userData.pond = pd;
    scene.add(mesh); S.water.push(mesh);
  }
}

// ---------------------------------------------------------------- sky
function buildSky(scene) {
  const s = sunDir();
  const m = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, depthTest: true,
    uniforms: { uSunDir: { value: s }, uZen: { value: new THREE.Vector3(...P.zenith) }, uHor: { value: new THREE.Vector3(...P.horizon) }, uSunCol: { value: P.sunColor } },
    vertexShader: `varying vec3 vDir; void main(){ vDir = (modelMatrix*vec4(position,0.0)).xyz; vec4 p = projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.0); gl_Position = p.xyww; }`,
    fragmentShader: `varying vec3 vDir; uniform vec3 uSunDir, uZen, uHor, uSunCol;
      ${hazeGLSL()}
      void main(){ vec3 d = normalize(vDir); float h = d.y;
        vec3 c = mix(uHor, uZen, pow(clamp(h, 0.0, 1.0), 0.48));
        c = mix(c, uHor * vec3(0.93, 0.95, 0.98), smoothstep(0.0, -0.08, h));
        float sd = max(dot(d, uSunDir), 0.0);
        c += uSunCol * (0.10 * pow(sd, 5.0) + 0.35 * pow(sd, 60.0));
        // faint high cirrus streaks
        gl_FragColor = vec4(c, 1.0); }`,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(20000, 48, 24), m);
  mesh.frustumCulled = false; mesh.renderOrder = -1;
  scene.add(mesh); S.sky = mesh;
}
function buildEnv(renderer) {
  const sc = new THREE.Scene();
  const s = sunDir();
  const m = new THREE.ShaderMaterial({
    side: THREE.BackSide, uniforms: { uSunDir: { value: s } },
    vertexShader: `varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `varying vec3 vDir; uniform vec3 uSunDir; void main(){ vec3 d=normalize(vDir); float h=d.y;
      vec3 zen=vec3(${P.envZenith.join(',')}), hor=vec3(${P.envHorizon.join(',')}), gnd=vec3(${P.envGround.join(',')});
      vec3 c = h>0.0 ? mix(hor, zen, pow(h,0.48)) : mix(gnd*1.3, gnd, smoothstep(0.0,-0.4,h));
      c += vec3(1.0,0.95,0.85)*0.25*pow(max(dot(d,uSunDir),0.0),8.0);
      gl_FragColor=vec4(c,1.0);}`,
  });
  sc.add(new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), m));
  const pm = new THREE.PMREMGenerator(renderer);
  const rt = pm.fromScene(sc, 0, 0.1, 100);
  return rt.texture;
}

// ---------------------------------------------------------------- post
const FS_TRI = `varying vec2 vUv; void main(){ vUv = position.xy*0.5+0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`;
function fsQuad(material) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  const m = new THREE.Mesh(g, material); m.frustumCulled = false;
  const sc = new THREE.Scene(); sc.add(m);
  return { scene: sc, mesh: m };
}

// ---------------------------------------------------------------- camera
function camParams(fr) {
  const F = S.cam.frames, n = F.length;
  const i0 = Math.max(0, Math.min(n - 1, Math.floor(fr))), i1 = Math.min(n - 1, i0 + 1), t = Math.max(0, Math.min(1, fr - i0));
  // extrapolate linearly beyond ends for the motion-blur shutter
  let A = F[i0], B = F[i1], tt = t;
  if (fr < 0) { A = F[0]; B = F[1]; tt = fr; }
  if (fr > n - 1) { A = F[n - 2]; B = F[n - 1]; tt = 1 + (fr - (n - 1)); }
  const L = (a, b) => a + (b - a) * tt;
  return { pos: [L(A.pos[0], B.pos[0]), L(A.pos[1], B.pos[1]), L(A.pos[2], B.pos[2])], yaw: L(A.yaw, B.yaw), pitch: L(A.pitch, B.pitch), roll: L(A.roll, B.roll) };
}
function applyCam(cam, p) {
  cam.position.set(...p.pos);
  const y = THREE.MathUtils.degToRad(p.yaw), pi = THREE.MathUtils.degToRad(p.pitch);
  const f = new THREE.Vector3(Math.sin(y) * Math.cos(pi), Math.sin(pi), -Math.cos(y) * Math.cos(pi));
  cam.up.set(0, 1, 0);
  cam.lookAt(cam.position.clone().add(f));
  cam.rotateZ(THREE.MathUtils.degToRad(p.roll));
  cam.updateMatrixWorld(true);
}

// ---------------------------------------------------------------- reflections
function renderReflections(renderer, scene, cam) {
  for (const w of S.water) w.visible = false;
  for (const w of S.water) {
    const pd = w.userData.pond;
    if (!pd.reflect) { w.material.uniforms.uHasRefl.value = 0; continue; }
    const L = pd.level;
    const rc = S.reflCam; rc.copy(cam); rc.layers.set(0);
    const p = cam.position.clone(); p.y = 2 * L - p.y;
    const f = new THREE.Vector3(); cam.getWorldDirection(f); f.y = -f.y;
    const u = new THREE.Vector3(0, 1, 0).applyQuaternion(cam.quaternion); u.y = -u.y;
    rc.position.copy(p); rc.up.copy(u); rc.lookAt(p.clone().add(f)); rc.updateMatrixWorld(true);
    rc.projectionMatrix.copy(cam.projectionMatrix); rc.projectionMatrixInverse.copy(cam.projectionMatrixInverse);
    renderer.clippingPlanes = [new THREE.Plane(new THREE.Vector3(0, 1, 0), -(L - 0.05))];
    const rt = S.reflRT[pd.name];
    renderer.setRenderTarget(rt); renderer.clear();
    S.sky.position.copy(rc.position);
    renderer.render(scene, rc);
    renderer.clippingPlanes = [];
    w.material.uniforms.tReflect.value = rt.texture;
    w.material.uniforms.uReflVP.value.multiplyMatrices(rc.projectionMatrix, rc.matrixWorldInverse);
    w.material.uniforms.uHasRefl.value = 1;
  }
  for (const w of S.water) w.visible = true;
}

// ---------------------------------------------------------------- setup / render API
window.setup = async (opts) => {
  const t0 = performance.now();
  Object.assign(P, opts.params || {});
  S.opts = opts;
  patchFogChunks();
  const outW = opts.outW, outH = opts.outH, ss = opts.ss || 2;
  const canvas = document.getElementById('c');
  canvas.width = outW; canvas.height = outH;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance', alpha: false });
  renderer.setPixelRatio(1); renderer.setSize(outW, outH, false);
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = (S.opts && S.opts.softShadow) ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap; renderer.shadowMap.autoUpdate = false;
  renderer.localClippingEnabled = false;
  S.renderer = renderer;
  S.noise3 = makeNoise3D(4242);
  S.waveN = makeWaveNormals(777);
  const [hCore, hCtx, cam] = await Promise.all([fetchF32(BUILD + 'terrain_core.f32'), fetchF32(BUILD + 'terrain_ctx.f32'), fetchJSON(BUILD + 'camera.json')]);
  S.cam = cam;
  const [orthoCore, orthoCtx, orthoOrig, waterMask] = await Promise.all([
    loadTex(BUILD + 'ortho_core.jpg'), loadTex(BUILD + 'ortho_ctx.jpg'), loadTex(DATA + 'orto_core_6400.jpg'), loadTex(BUILD + 'water_mask.png', false, 1)]);
  S.orthoOrig = orthoOrig; S.waterMask = waterMask;
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(new THREE.Color(...P.hazeColor), P.hazeDensity);
  scene.environment = buildEnv(renderer);
  S.scene = scene;
  // lights
  const sun = new THREE.DirectionalLight(P.sunColor, P.sunIntensity);
  const sd = sunDir();
  const center = new THREE.Vector3(461470 - OX, 170, -(5584700 - ON));
  sun.position.copy(center).addScaledVector(sd, 800); sun.target.position.copy(center);
  sun.castShadow = true;
  const sm = opts.shadowSize || 8192;
  sun.shadow.mapSize.set(sm, sm);
  const ext = opts.shadowExtent || 380;
  Object.assign(sun.shadow.camera, { left: -ext, right: ext, top: ext, bottom: -ext, near: 100, far: 1600 });
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.25;
  sun.layers.enableAll(); scene.add(sun, sun.target);
  S.sun = sun;
  // content
  for (const m of buildTerrain(hCore, hCtx, orthoCore, orthoCtx)) scene.add(m);
  const nTrees = opts.noTrees ? 0 : await buildTrees(scene);
  const nB = await buildBuildings(scene);
  buildWater(scene);
  buildSky(scene);
  // cameras + targets
  const ssW = Math.round(outW * ss), ssH = Math.round(outH * ss);
  S.ssW = ssW; S.ssH = ssH;
  const camera = new THREE.PerspectiveCamera(opts.vfov, outW / outH, 8, 40000);
  camera.layers.enableAll(); S.camera = camera; S.reflCam = camera.clone(); S.reflCam.layers.set(0);
  S.sceneRT = new THREE.WebGLRenderTarget(ssW, ssH, { type: THREE.HalfFloatType, samples: opts.msaa ?? 4, depthBuffer: true });
  S.accRT = new THREE.WebGLRenderTarget(ssW, ssH, { type: THREE.FloatType, depthBuffer: false });
  S.midRT = new THREE.WebGLRenderTarget(outW, outH, { type: THREE.HalfFloatType, depthBuffer: false });
  const rs = opts.reflScale || 0.33;
  S.reflRT = {};
  for (const pd of PONDS) if (pd.reflect) S.reflRT[pd.name] = new THREE.WebGLRenderTarget(Math.round(ssW * rs), Math.round(ssH * rs), { type: THREE.HalfFloatType, samples: 0 });
  // accumulation pass
  S.accQuad = fsQuad(new THREE.ShaderMaterial({
    uniforms: { tSrc: { value: null }, uW: { value: 1 } }, transparent: true, depthTest: false, depthWrite: false,
    blending: THREE.CustomBlending, blendEquation: THREE.AddEquation, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,
    vertexShader: FS_TRI, fragmentShader: `varying vec2 vUv; uniform sampler2D tSrc; uniform float uW; void main(){ gl_FragColor = vec4(texture(tSrc, vUv).rgb * uW, 1.0); }`,
  }));
  // downsample + tonemap
  S.downQuad = fsQuad(new THREE.ShaderMaterial({
    uniforms: { tSrc: { value: S.accRT.texture }, uSrcSize: { value: new THREE.Vector2(ssW, ssH) }, uSS: { value: ss }, uExposure: { value: P.exposure } },
    depthTest: false, depthWrite: false, vertexShader: FS_TRI,
    fragmentShader: `precision highp float; varying vec2 vUv; uniform sampler2D tSrc; uniform vec2 uSrcSize; uniform float uSS; uniform float uExposure;
      vec3 RRTAndODTFit(vec3 v){ vec3 a=v*(v+0.0245786)-0.000090537; vec3 b=v*(0.983729*v+0.4329510)+0.238081; return a/b; }
      vec3 aces(vec3 color){ const mat3 I=mat3(vec3(0.59719,0.07600,0.02840),vec3(0.35458,0.90834,0.13383),vec3(0.04823,0.01566,0.83777));
        const mat3 O=mat3(vec3(1.60475,-0.10208,-0.00327),vec3(-0.53108,1.10813,-0.07276),vec3(-0.07367,-0.00605,1.07602));
        color*=uExposure/0.6; color=I*color; color=RRTAndODTFit(color); color=O*color; return clamp(color,0.0,1.0); }
      void main(){
        // tent filter over the supersampled footprint (radius = uSS texels)
        vec2 c = vUv * uSrcSize; vec3 acc = vec3(0.0); float wsum = 0.0;
        float R = uSS;
        for (int y = -3; y <= 3; y++) for (int x = -3; x <= 3; x++) {
          vec2 o = vec2(float(x), float(y)) * 0.5 * (R / 2.0);
          float w = max(0.0, 1.0 - length(o) / R);
          if (w <= 0.0) continue;
          acc += texture(tSrc, (c + o) / uSrcSize).rgb * w; wsum += w;
        }
        vec3 col = acc / wsum;
        col = aces(col);
        gl_FragColor = vec4(col, 1.0);
      }`,
  }));
  // finish: sharpen, grade, vignette, CA, grain, sRGB
  S.finQuad = fsQuad(new THREE.ShaderMaterial({
    uniforms: { tSrc: { value: S.midRT.texture }, uSize: { value: new THREE.Vector2(outW, outH) }, uFrame: { value: 0 }, uSharp: { value: opts.sharpen ?? 0.35 }, uGrain: { value: opts.grain ?? 0.010 } },
    depthTest: false, depthWrite: false, vertexShader: FS_TRI,
    fragmentShader: `precision highp float; varying vec2 vUv; uniform sampler2D tSrc; uniform vec2 uSize; uniform float uFrame, uSharp, uGrain;
      float hash(vec3 p){ p = fract(p*0.1031); p += dot(p, p.zyx+31.32); return fract((p.x+p.y)*p.z); }
      vec3 toSRGB(vec3 c){ return mix(c*12.92, 1.055*pow(c, vec3(1.0/2.4))-0.055, step(0.0031308, c)); }
      void main(){
        vec2 px = 1.0 / uSize;
        vec2 cc = vUv - 0.5; float r2 = dot(cc*vec2(uSize.x/uSize.y,1.0), cc*vec2(uSize.x/uSize.y,1.0));
        // subtle lateral chromatic aberration
        vec2 ca = cc * 0.0012;
        vec3 c;
        c.r = texture(tSrc, vUv - ca).r; c.g = texture(tSrc, vUv).g; c.b = texture(tSrc, vUv + ca).b;
        vec3 bl = (texture(tSrc, vUv + vec2(px.x,0)).rgb + texture(tSrc, vUv - vec2(px.x,0)).rgb + texture(tSrc, vUv + vec2(0,px.y)).rgb + texture(tSrc, vUv - vec2(0,px.y)).rgb) * 0.25;
        c = max(c + (c - bl) * uSharp, 0.0);
        // grade (display-referred, linear): gentle contrast + saturation
        float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
        c = mix(vec3(l), c, 1.14);
        c *= vec3(1.02, 1.0, 0.965);
        c *= 1.0 - 0.10 * r2;                     // vignette
        vec3 s = toSRGB(clamp(c, 0.0, 1.0));
        float g = (hash(vec3(gl_FragCoord.xy, uFrame)) + hash(vec3(gl_FragCoord.xy + 17.0, uFrame + 3.0)) - 1.0);
        s += g * uGrain * (0.6 + 0.4 * (1.0 - abs(dot(s, vec3(0.333)) * 2.0 - 1.0)));
        gl_FragColor = vec4(s, 1.0);
      }`,
  }));
  S.orthoCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  S.depthMat = new THREE.MeshBasicMaterial({ colorWrite: false, side: THREE.FrontSide });
  // static shadow map, rendered once
  renderer.shadowMap.needsUpdate = true;
  applyCam(camera, camParams(0));
  renderer.setRenderTarget(S.sceneRT); renderer.render(scene, camera);
  renderer.shadowMap.needsUpdate = false;
  const info = { trees: nTrees, buildings: nB, ms: Math.round(performance.now() - t0), ssW, ssH };
  return info;
};

window.renderFrame = async (f) => {
  const { renderer, scene, camera } = S;
  const K = S.opts.subframes || 1, shutter = S.opts.shutter ?? 0.5;
  const t0 = performance.now();
  renderer.setRenderTarget(S.accRT); renderer.setClearColor(0x000000, 1); renderer.clear();
  for (let k = 0; k < K; k++) {
    const fr = K === 1 ? f : f + ((k + 0.5) / K - 0.5) * shutter;
    applyCam(camera, camParams(fr));
    for (const w of S.water) w.material.uniforms.uTime.value = fr / FPS;
    if (!S.opts.noRefl) renderReflections(renderer, scene, camera);
    S.sky.position.copy(camera.position);
    renderer.setRenderTarget(S.sceneRT); renderer.clear();
    if (S.opts.prepass !== false) {
      const hide = [S.sky, ...S.water]; hide.forEach(o => o.visible = false);
      const ml = camera.layers.mask; camera.layers.set(0); camera.layers.enable(2);
      scene.overrideMaterial = S.depthMat; renderer.render(scene, camera); scene.overrideMaterial = null;
      camera.layers.mask = ml; hide.forEach(o => o.visible = true);
      renderer.autoClear = false; renderer.render(scene, camera); renderer.autoClear = true;
    } else renderer.render(scene, camera);
    S.accQuad.mesh.material.uniforms.tSrc.value = S.sceneRT.texture;
    S.accQuad.mesh.material.uniforms.uW.value = 1 / K;
    renderer.setRenderTarget(S.accRT); renderer.render(S.accQuad.scene, S.orthoCam);
  }
  renderer.setRenderTarget(S.midRT); renderer.render(S.downQuad.scene, S.orthoCam);
  S.finQuad.mesh.material.uniforms.uFrame.value = f;
  renderer.setRenderTarget(null); renderer.render(S.finQuad.scene, S.orthoCam);
  const gl = renderer.getContext(); gl.finish();
  const ms = performance.now() - t0;
  const t1 = performance.now();
  const url = renderer.domElement.toDataURL('image/png');
  return { url, ms: Math.round(ms), readMs: Math.round(performance.now() - t1) };
};
window.__ready = true;
