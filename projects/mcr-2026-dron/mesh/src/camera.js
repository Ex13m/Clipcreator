// Drone camera path: one continuous centripetal Catmull-Rom spline, arc-length parametrised, with an
// ease-in-out speed profile, a gimbal that eases its aim from the big pond to Maly Sportacek, and a
// deterministic low-frequency micro-drift (wind buffeting / gimbal settle). Pure function of time.
import * as THREE from 'three';

export const DEFAULT_PATH = {
  // UTM 33N E, N, H (m Bpv). Flies SSW (bearing ~200 deg) along the big pond's west shore.
  pts: [[461500.0, 5584850.0, 264.0], [461489.0, 5584820.0, 256.5], [461478.0, 5584790.0, 249.0]],
  tgtStart: [461523.0, 5584687.0, 168.0],   // aim over the big pond's south half (pond fills lower-left)
  tgtEnd: [461447.0, 5584683.0, 167.4],     // Maly Sportacek (hero), slightly beyond its centroid
  duration: 119 / 30,
  // speed profile v(u) ~ 1 + a*sin(pi u) - b*u^2  (gentle ease-in peak, ease-out towards the pond)
  va: 0.25, vb: 0.38,
  aimEase: 'smootherstep',
  drift: 1.0,
};

export function makeCameraPath(meta, cfg) {
  const P = Object.assign({}, DEFAULT_PATH, cfg.path || {});
  const L = (p) => new THREE.Vector3(p[0] - meta.E0, p[2] - meta.Z0, -(p[1] - meta.N0));
  const curve = new THREE.CatmullRomCurve3(P.pts.map(L), false, 'centripetal');
  curve.arcLengthDivisions = 2000;
  const len = curve.getLength();
  // cumulative distance table for the speed profile
  const NS = 4000, cum = new Float64Array(NS + 1);
  const v = (u) => 1 + P.va * Math.sin(Math.PI * u) - P.vb * u * u;
  for (let i = 1; i <= NS; i++) { const u0 = (i - 1) / NS, u1 = i / NS; cum[i] = cum[i - 1] + 0.5 * (v(u0) + v(u1)) / NS; }
  const tot = cum[NS];
  const sOf = (tau) => { // tau may slightly exceed [0,1] for motion-blur sub-frames -> linear extrapolation
    if (tau <= 0) return tau * v(0) / tot;
    if (tau >= 1) return 1 + (tau - 1) * v(1) / tot;
    const x = tau * NS, i = Math.floor(x), fr = x - i;
    return (cum[i] + (cum[Math.min(NS, i + 1)] - cum[i]) * fr) / tot;
  };
  const pointAt = (s) => {
    if (s < 0) { const p0 = curve.getPointAt(0), t0 = curve.getTangentAt(0); return p0.addScaledVector(t0, s * len); }
    if (s > 1) { const p1 = curve.getPointAt(1), t1 = curve.getTangentAt(1); return p1.addScaledVector(t1, (s - 1) * len); }
    return curve.getPointAt(s);
  };
  const ease = (x) => { x = Math.min(1, Math.max(0, x)); return x * x * x * (x * (x * 6 - 15) + 10); };
  const TS = L(P.tgtStart), TE = L(P.tgtEnd);
  const deg = Math.PI / 180;
  const Y = new THREE.Vector3(0, 1, 0), X = new THREE.Vector3(1, 0, 0), Z = new THREE.Vector3(0, 0, 1);

  function at(t) {
    const tau = t / P.duration;
    const s = sOf(tau);
    const pos = pointAt(s);
    const k = P.drift;
    // micro drift (metres / degrees), smooth sums of incommensurate sines (deterministic)
    pos.x += k * 0.10 * Math.sin(2 * Math.PI * 0.29 * t + 0.4);
    pos.y += k * 0.08 * Math.sin(2 * Math.PI * 0.41 * t + 1.0);
    pos.z += k * 0.10 * Math.sin(2 * Math.PI * 0.37 * t + 2.1);
    const e = ease(tau * 1.0);
    const tgt = TS.clone().lerp(TE, e);
    const f = tgt.clone().sub(pos).normalize();
    let yaw = Math.atan2(f.x, -f.z) / deg;          // compass bearing
    let pitch = Math.asin(f.y) / deg;
    yaw += k * (0.10 * Math.sin(2 * Math.PI * 0.31 * t + 1.1) + 0.04 * Math.sin(2 * Math.PI * 0.83 * t + 0.3));
    pitch += k * (0.06 * Math.sin(2 * Math.PI * 0.47 * t + 2.0) + 0.025 * Math.sin(2 * Math.PI * 1.13 * t + 0.7));
    const roll = k * (0.10 * Math.sin(2 * Math.PI * 0.23 * t + 0.5) + 0.04 * Math.sin(2 * Math.PI * 0.71 * t + 1.9));
    const q = new THREE.Quaternion().setFromAxisAngle(Y, -yaw * deg)
      .multiply(new THREE.Quaternion().setFromAxisAngle(X, pitch * deg))
      .multiply(new THREE.Quaternion().setFromAxisAngle(Z, roll * deg));
    // speed (m/s) by finite difference of the un-drifted path
    const dt = 1e-3;
    const speed = pointAt(sOf((t + dt) / P.duration)).distanceTo(pointAt(sOf((t - dt) / P.duration))) / (2 * dt);
    return { pos, quat: q, yaw, pitch, roll, speed, tgt };
  }
  return { at, len, frames: 120 };
}
