// GLSL 3.00 ES shaders for the photogrammetry-look renderer.
export const SHADER_COMMON = /* glsl */`
precision highp float;
precision highp sampler2D;
uniform vec3 uSunDir;
uniform vec3 uCam;
uniform float uHaze;
uniform float uExposure;
uniform float uClipY;
uniform float uTime;
layout(location = 0) out vec4 outColor;

float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float hash13(vec3 p3){ p3 = fract(p3 * .1031); p3 += dot(p3, p3.zyx + 31.32); return fract((p3.x + p3.y) * p3.z); }
float vnoise2(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  float a = hash12(i), b = hash12(i+vec2(1,0)), c = hash12(i+vec2(0,1)), d = hash12(i+vec2(1,1));
  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
}
float vnoise3(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  float n000 = hash13(i), n100 = hash13(i+vec3(1,0,0)), n010 = hash13(i+vec3(0,1,0)), n110 = hash13(i+vec3(1,1,0));
  float n001 = hash13(i+vec3(0,0,1)), n101 = hash13(i+vec3(1,0,1)), n011 = hash13(i+vec3(0,1,1)), n111 = hash13(i+vec3(1,1,1));
  return mix(mix(mix(n000,n100,f.x), mix(n010,n110,f.x), f.y), mix(mix(n001,n101,f.x), mix(n011,n111,f.x), f.y), f.z);
}

// Analytic hazy late-summer sky (linear radiance; sunlit ground of albedo a ~ radiance a)
vec3 skyRadiance(vec3 d){
  float y = d.y;
  float mu = dot(d, uSunDir);
  float yy = max(y, 0.0);
  vec3 zen = vec3(0.085, 0.205, 0.560);
  vec3 hor = vec3(0.600, 0.715, 0.890);
  float t = exp(-yy * 7.0);
  vec3 c = mix(zen, hor, t);
  c = mix(c, hor * vec3(0.90, 0.91, 0.93), smoothstep(0.0, -0.10, y));
  float g = 0.78;
  float hg = (1.0 - g*g) / pow(1.0 + g*g - 2.0*g*mu, 1.5);
  c += vec3(1.0, 0.87, 0.68) * hg * 0.040 * (0.45 + 0.55*t);
  c += vec3(1.0, 0.96, 0.88) * smoothstep(0.99990, 0.99996, mu) * 60.0;
  return c;
}

// aerial perspective: exponential haze, in-scatter = horizon sky radiance in that azimuth
vec3 hazeApply(vec3 col, vec3 wp){
  vec3 v = wp - uCam; float d = length(v); vec3 dir = v / max(d, 1e-3);
  float hAvg = 0.5 * (wp.y + uCam.y) + 160.0;
  float dens = uHaze * exp(-(hAvg - 175.0) / 1100.0);
  float T = exp(-dens * d);
  vec3 hdir = normalize(vec3(dir.x, max(dir.y, 0.0) * 0.25 + 0.03, dir.z));
  vec3 ins = skyRadiance(hdir) * 0.93;
  return col * T + ins * (1.0 - T);
}
`;

export const TERRAIN_VS = /* glsl */`
precision highp float;
precision highp sampler2D;
in vec3 position; in vec3 normal;
uniform mat4 modelMatrix; uniform mat4 viewMatrix; uniform mat4 projectionMatrix;
uniform sampler2D uCls; uniform vec4 uClsBox; uniform float uHasCls;
uniform sampler2D uDtm; uniform float uHasDtm;
uniform float uDisp; uniform vec3 uCam;
out vec3 vW; out vec3 vN; out float vTreeK;
float h12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(h12(i), h12(i+vec2(1,0)), f.x), mix(h12(i+vec2(0,1)), h12(i+vec2(1,1)), f.x), f.y); }
void main(){
  vec4 w = modelMatrix * vec4(position, 1.0);
  vTreeK = 0.0;
  if (uHasCls > 0.5 && uHasDtm > 0.5 && uDisp > 0.0) {
    vec2 uvc = vec2((w.x - uClsBox.x) / uClsBox.z, (uClsBox.y - w.z) / uClsBox.w);
    float tree = textureLod(uCls, uvc, 0.0).g;
    float hg = w.y - textureLod(uDtm, uvc, 0.0).r;
    float k = tree * smoothstep(2.0, 7.0, hg) * (1.0 - smoothstep(260.0, 420.0, distance(w.xyz, uCam)));
    float nz = vn2(w.xz / 2.4) * 0.55 + vn2(w.xz / 1.05 + 5.3) * 0.30 + vn2(w.xz / 5.5 + 1.7) * 0.15;
    w.xyz += normalize(normal) * (nz - 0.5) * 2.0 * uDisp * k;
    vTreeK = k;
  }
  vW = w.xyz; vN = normal;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

export const TERRAIN_FS = /* glsl */`
in vec3 vW; in vec3 vN;
uniform sampler2D uOrtho; uniform vec4 uBox;
uniform sampler2D uCls; uniform vec4 uClsBox; uniform float uHasCls;
uniform sampler2D uDtm; uniform float uHasDtm;
uniform float uBias; uniform float uIsRing;
in float vTreeK;
vec2 toUV(vec2 xz, vec4 b){ return vec2((xz.x - b.x) / b.z, (b.y - xz.y) / b.w); }
void main(){
#ifdef REFL
  if (vW.y < uClipY) discard;
#endif
  vec2 uv = toUV(vW.xz, uBox);
  vec3 n = normalize(vN);
  float steep = 1.0 - clamp(n.y, 0.0, 1.0);
  vec4 cls = vec4(0.0, 0.0, 0.85, 0.0);
  vec2 uvc = toUV(vW.xz, uClsBox);
  if (uHasCls > 0.5) cls = texture(uCls, uvc);
  float bld = cls.r, tree = cls.g, ao = cls.b;
  float hg = 0.0;
  if (uHasDtm > 0.5) hg = max(vW.y - texture(uDtm, uvc).r, 0.0);
#ifdef REFL
  float wall = smoothstep(0.30, 0.80, steep);
  vec3 alb = texture(uOrtho, uv, uBias + 1.0 + wall * 2.0).rgb;
#else
  vec3 gn = normalize(cross(dFdx(vW), dFdy(vW)));
  if (gn.y < 0.0) gn = -gn;
  float steepG = 1.0 - clamp(gn.y, 0.0, 1.0);
  float wall = smoothstep(0.28, 0.75, max(steep, steepG * 0.85));
  vec3 alb = texture(uOrtho, uv, uBias).rgb;
  if (wall > 0.001 && uHasDtm > 0.5) {
    // fold the ortho onto steep faces: height above ground -> horizontal distance into the object,
    // so crown / roof texture is laid on the wall at true scale instead of being stretched vertically
    vec2 nh = n.xz; float nl = length(nh); nh = nl > 1e-4 ? nh / nl : vec2(0.0);
    // trees & buildings: fold inward (crown / roof texture); other walls (embankments, bridges, cut
    // slopes): take the colour of the ground at the wall foot, outward
    vec2 qIn = vW.xz - nh * (hg * 0.85 + 0.6);
    vec2 qOut = vW.xz + nh * (1.5 + 0.25 * hg);
    vec3 albIn = texture(uOrtho, toUV(qIn, uBox), uBias + 0.3).rgb;
    vec3 albOut = texture(uOrtho, toUV(qOut, uBox), uBias + 1.5).rgb * 0.8;
    float objk = clamp(tree + bld, 0.0, 1.0);
    alb = mix(alb, mix(albOut, albIn, objk), wall);
  }
  // crown sides / forest edges: leafy breakup + under-canopy shade towards the ground
  float side = smoothstep(0.10, 0.50, steep);
  if (tree > 0.01) {
    float nz = vnoise3(vW * vec3(1.6, 1.1, 1.6)) * 0.55 + vnoise3(vW * 3.9 + 7.1) * 0.45;
    float under = mix(0.50, 1.0, smoothstep(1.0, 11.0, hg));
    alb *= mix(1.0, (0.62 + 0.76 * nz) * under, tree * side);
  }
  // building walls: plaster, darker plinth (only true building pixels, only up to eave height)
  vec3 plaster = vec3(0.47, 0.44, 0.39) * (0.9 + 0.2 * vnoise3(vW * vec3(0.7, 0.15, 0.7)));
  float plinth = mix(0.72, 1.0, smoothstep(0.0, 2.5, hg));
  float bw = smoothstep(0.55, 0.85, bld) * wall * (1.0 - smoothstep(9.0, 13.0, hg)) * (1.0 - tree);
  alb = mix(alb, mix(alb, plaster, 0.6) * plinth, bw);
  // crowns: shade with the displaced facet normal (lumpy crown-scale light/shadow)
  n = normalize(mix(n, gn, 0.55 * vTreeK));
#endif
  // relight steep faces with the scene sun (the ortho's baked shading is valid only for top surfaces)
  float ndl = max(dot(n, uSunDir), 0.0);
  float skyv = 0.55 + 0.45 * n.y;
  float amb = 0.45;
  float relit = (ndl + amb * skyv) / (uSunDir.y + amb);
  float shade = mix(1.0, relit, smoothstep(0.10, 0.60, steep));
  float aoF = mix(1.0, 0.30 + 0.70 * ao, 0.5);
  vec3 col = alb * shade * aoF * uExposure;
  col = hazeApply(col, vW);
  outColor = vec4(col, 1.0);
}
`;

export const WATER_VS = /* glsl */`
precision highp float;
in vec3 position;
uniform mat4 modelMatrix; uniform mat4 viewMatrix; uniform mat4 projectionMatrix;
out vec3 vW;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }
`;

export const WATER_FS = /* glsl */`
in vec3 vW;
uniform sampler2D uOrtho; uniform vec4 uBox;
uniform sampler2D uMask; uniform vec4 uMaskBox; uniform vec4 uChan;
uniform sampler2D uRefl; uniform mat4 uReflMat; uniform float uHasRefl;
uniform float uLevel; uniform float uSeed; uniform float uDebug; uniform float uReflBoost;

vec2 waveGrad(vec2 p, float t){
  vec2 g = vec2(0.0);
  for (int i = 0; i < 16; i++){
    float fi = float(i);
    float ang = 0.70 + (hash12(vec2(fi, uSeed)) - 0.5) * 2.4;     // wind from SW, spread
    vec2 d = vec2(cos(ang), -sin(ang));
    float lambda = mix(0.6, 6.0, pow(hash12(vec2(fi * 1.7 + 3.1, uSeed + 1.0)), 1.5));
    float k = 6.2831853 / lambda;
    float w = sqrt(9.81 * k + 7.4e-5 * k * k * k);
    float ak = 0.028;
    float ph = hash12(vec2(fi * 2.3, uSeed + 2.0)) * 6.2831853;
    float th = dot(d, p) * k - w * t + ph;
    g += d * (ak * cos(th));
  }
  return g;
}

void main(){
  vec2 uvm = vec2((vW.x - uMaskBox.x) / uMaskBox.z, (uMaskBox.y - vW.z) / uMaskBox.w);
  float m = dot(texture(uMask, uvm), uChan);
  float alpha = smoothstep(0.30, 0.70, m);
  if (alpha < 0.004) discard;
  vec2 uv = vec2((vW.x - uBox.x) / uBox.z, (uBox.y - vW.z) / uBox.w);
  vec3 body = texture(uOrtho, uv, 0.6).rgb * uExposure * 0.92;
  float paw = vnoise2(vW.xz / 26.0 + vec2(0.30, -0.22) * uTime + uSeed) * 0.65 + vnoise2(vW.xz / 8.0 - vec2(0.25, 0.45) * uTime + 3.0) * 0.35;
  float amp = mix(0.30, 1.35, smoothstep(0.25, 0.80, paw));
  vec2 g = waveGrad(vW.xz, uTime) * amp;
  vec3 n = normalize(vec3(-g.x, 1.0, -g.y));
  vec3 V = normalize(uCam - vW);
  float cosv = max(dot(n, V), 0.03);
  float F = 0.02 + 0.98 * pow(1.0 - cosv, 5.0);
  vec3 refl;
  if (uHasRefl > 0.5){
    vec4 rp = uReflMat * vec4(vW + vec3(n.x, 0.0, n.z) * 7.0, 1.0);
    vec2 ruv = clamp(rp.xy / rp.w, 0.001, 0.999);
    refl = texture(uRefl, ruv).rgb;
  } else {
    refl = skyRadiance(reflect(-V, n));
  }
  vec3 H = normalize(V + uSunDir);
  float ch = max(dot(n, H), 1e-3);
  float t2 = (1.0 - ch * ch) / (ch * ch);
  float s2 = 0.0035 * amp + 0.0008;
  float D = exp(-t2 / s2) / (3.14159 * s2 * ch * ch * ch * ch);
  float spec = 4.5 * F * D / (4.0 * cosv);
  float Fr = min(1.0, F * uReflBoost + 0.012);
  vec3 col = hazeApply(body * (1.0 - Fr) + vec3(1.0, 0.95, 0.86) * spec, vW) + refl * Fr;
  if (uDebug > 0.5) col = refl * 0.5;
  outColor = vec4(col, alpha);
}
`;

export const SKY_VS = /* glsl */`
precision highp float;
in vec3 position;
uniform mat4 modelMatrix; uniform mat4 viewMatrix; uniform mat4 projectionMatrix;
out vec3 vW;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; gl_Position.z = gl_Position.w * 0.99999; }
`;

export const SKY_FS = /* glsl */`
in vec3 vW;
void main(){ vec3 d = normalize(vW - uCam); outColor = vec4(skyRadiance(d), 1.0); }
`;

export const FS_VS = /* glsl */`
precision highp float;
in vec3 position;
out vec2 vUv;
void main(){ vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

// supersample -> output: separable [1 3 3 1]/8 tent via 9 bilinear taps, weighted accumulation
export const DOWN_FS = /* glsl */`
precision highp float;
precision highp sampler2D;
in vec2 vUv;
uniform sampler2D uSrc; uniform vec2 uSrcSize; uniform float uWeight; uniform float uStep;
layout(location = 0) out vec4 outColor;
void main(){
  vec2 px = 1.0 / uSrcSize;
  vec3 acc = vec3(0.0);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++){
    float w = (i == 0 ? 0.5 : 0.25) * (j == 0 ? 0.5 : 0.25);
    acc += w * texture(uSrc, vUv + vec2(float(i), float(j)) * px * uStep).rgb;
  }
  outColor = vec4(acc * uWeight, 1.0);
}
`;

export const POST_FS = /* glsl */`
precision highp float;
precision highp sampler2D;
in vec2 vUv;
uniform sampler2D uSrc; uniform vec2 uSize; uniform float uFrame;
uniform float uGrain; uniform float uVignette; uniform float uSharpen; uniform float uCA;
uniform float uPostExposure; uniform float uSat; uniform float uContrast;
layout(location = 0) out vec4 outColor;
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
const mat3 ACESIn = mat3(0.59719, 0.07600, 0.02840, 0.35458, 0.90834, 0.13383, 0.04823, 0.01566, 0.83777);
const mat3 ACESOut = mat3(1.60475, -0.10208, -0.00327, -0.53108, 1.10813, -0.07276, -0.07367, -0.00605, 1.07602);
vec3 rrt(vec3 v){ vec3 a = v * (v + 0.0245786) - 0.000090537; vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081; return a / b; }
vec3 toSRGB(vec3 c){ return mix(c * 12.92, 1.055 * pow(c, vec3(1.0/2.4)) - 0.055, step(0.0031308, c)); }
void main(){
  vec2 px = 1.0 / uSize;
  vec2 c = vUv - 0.5;
  float aspect = uSize.x / uSize.y;
  vec2 ca = c * vec2(1.0, 1.0) * uCA * 2.0 * px * min(uSize.x, uSize.y) / 1080.0;
  vec3 col;
  col.r = texture(uSrc, vUv - ca).r;
  col.g = texture(uSrc, vUv).g;
  col.b = texture(uSrc, vUv + ca).b;
  vec3 blur = 0.25 * (texture(uSrc, vUv + vec2(px.x, 0.0)).rgb + texture(uSrc, vUv - vec2(px.x, 0.0)).rgb + texture(uSrc, vUv + vec2(0.0, px.y)).rgb + texture(uSrc, vUv - vec2(0.0, px.y)).rgb);
  col = max(col + (col - blur) * uSharpen, 0.0);
  col *= vec3(1.035, 1.0, 0.945) * uPostExposure;
  col = ACESOut * rrt(ACESIn * (col / 0.6));
  col = clamp(col, 0.0, 1.0);
  col = toSRGB(col);
  float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(vec3(l), col, uSat);
  col = (col - 0.45) * uContrast + 0.45;
  vec2 cc = c * vec2(aspect, 1.0); float rn = length(cc) / length(vec2(aspect, 1.0) * 0.5);
  col *= 1.0 - uVignette * pow(rn, 2.4);
  float g = hash12(gl_FragCoord.xy + uFrame * 37.17) + hash12(gl_FragCoord.xy * 1.37 + uFrame * 11.31) - 1.0;
  col += g * uGrain * (0.55 + 0.45 * (1.0 - l));
  outColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;
