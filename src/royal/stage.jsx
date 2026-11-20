// Shared React Three Fiber stage for the Royal 3D concepts.
// The ewer is rendered exactly as modelled (geometry, textures, PBR materials untouched);
// lighting is live: HDR light tent + soft boxes + black flags, never baked.
import * as THREE from 'three';
import { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei/core/Gltf.js';
import { ContactShadows } from '@react-three/drei/core/ContactShadows.js';
import { useProgress } from '@react-three/drei/core/Progress.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { buildStudio } from '../studio.js';
import { getState, onState, MOODS } from './state.js';

const BASE = document.querySelector('meta[name="kingdom-base"]')?.content || '';
export const MODEL = BASE + 'assets/model/ewer-2k.glb';
export const DRACO = BASE + 'assets/draco/';
const HDR = BASE + 'assets/env/studio-2k.hdr', HDR_S = BASE + 'assets/env/studio-1k.hdr';
export const mobile = matchMedia('(max-width: 900px)').matches || matchMedia('(pointer: coarse)').matches;

export function useRoyal() {
  const [s, set] = useState(() => ({ ...getState() }));
  useEffect(() => onState((n) => set({ ...n })), []);
  return s;
}

export function Studio({ rotation = 0 }) {
  const { gl, scene } = useThree();
  const hdr = useLoader(RGBELoader, mobile ? HDR_S : HDR);
  const s = useRoyal();
  const cache = useRef({}), expo = useRef(0.6);
  useEffect(() => {
    const m = MOODS[s.mood] || MOODS.studio;
    scene.environment = cache.current[s.mood] || (cache.current[s.mood] = buildStudio(gl, hdr, m.studio));
  }, [s.mood, gl, hdr, scene]);
  useEffect(() => () => Object.values(cache.current).forEach((t) => t.dispose()), []);
  useFrame((_, dt) => {
    const st = getState(), m = MOODS[st.mood] || MOODS.studio;
    const target = m.exposure * (st.exposure || 1) * 1.3;
    expo.current += (target - expo.current) * Math.min(1, dt * 2.5);
    gl.toneMappingExposure = expo.current;
    scene.environmentRotation.y = rotation;
  });
  return null;
}

export function Ewer({ innerRef }) {
  const g = useGLTF(MODEL, DRACO);
  const [hi, setHi] = useState(null);
  useEffect(() => {
    const cfg = window.KINGDOM_CFG || {}, conn = navigator.connection;
    if (!cfg.hiResModel || mobile || innerWidth < 1100 || (conn && (conn.saveData || /2g|3g/.test(conn.effectiveType || '')))) return;
    const t = setTimeout(async () => {
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      const { DRACOLoader } = await import('three/examples/jsm/loaders/DRACOLoader.js');
      new GLTFLoader().setDRACOLoader(new DRACOLoader().setDecoderPath(DRACO)).load(BASE + cfg.hiResModel, (r) => { prep(r.scene); setHi(r.scene); }, undefined, () => {});
    }, 3000);
    return () => clearTimeout(t);
  }, []);
  const scene = useMemo(() => { prep(g.scene); return g.scene; }, [g]);
  return <group ref={innerRef}><primitive object={hi || scene} /></group>;
}
function prep(root) {
  root.traverse((o) => {
    if (!o.isMesh) return;
    const m = o.material; if (!m) return;
    m.envMapIntensity = 1;
    ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap'].forEach((k) => m[k] && (m[k].anisotropy = 8));
  });
}

// Camera rig. Scroll timelines write `target`; the camera eases toward it for natural inertia.
export function makeRig(init) {
  const base = { az: 0, el: 0.05, dist: 6.4, tx: 0, ty: 0, tz: 0, fov: 30, rotY: 0, y: 0, x: 0, tilt: 0, idle: 1, drag: 0, fit: 1, my: 0 };
  return { target: { ...base, ...init }, cur: { ...base, ...init } };
}
export function Rig({ rig, model, pointer, lambda = 3 }) {
  const { camera, size } = useThree();
  const clock = useRef(0);
  useFrame((_, dt) => {
    dt = Math.min(dt, 0.05); clock.current += dt;
    const T = rig.target, C = rig.cur, k = 1 - Math.exp(-dt * lambda);
    for (const key in T) C[key] += (T[key] - C[key]) * k;
    const st = getState(), live = st.motion === 'still' ? 0 : st.motion === 'calm' ? 0.5 : 1;
    const px = pointer?.current?.[0] || 0, py = pointer?.current?.[1] || 0;
    const az = C.az + px * 0.07 * C.idle * live, el = C.el + py * 0.04 * C.idle * live;
    const aspect = size.width / size.height;
    const fit = (aspect < 0.85 ? 1 + (0.85 - aspect) * 0.95 : 1) * C.fit;
    const d = C.dist * fit;
    // tx is a screen-horizontal offset (camera right vector), so compositions hold while orbiting
    const tx = C.tx * Math.min(1, aspect / 1.5);
    const ty = C.ty - (aspect < 0.85 ? C.my * (C.dist / 6.4) : 0);
    const rx = Math.cos(az) * tx, rz = -Math.sin(az) * tx;
    camera.position.set(rx + Math.sin(az) * Math.cos(el) * d, ty + Math.sin(el) * d, C.tz + rz + Math.cos(az) * Math.cos(el) * d);
    camera.lookAt(rx, ty, C.tz + rz);
    if (Math.abs(camera.fov - C.fov) > 0.01) { camera.fov = C.fov; camera.updateProjectionMatrix(); }
    if (model.current) {
      const t = clock.current;
      model.current.rotation.y = C.rotY + C.drag + Math.sin(t * 0.32) * 0.06 * C.idle * live;
      model.current.rotation.z = C.tilt;
      model.current.position.set(C.x * Math.min(1, aspect / 1.5), C.y + Math.sin(t * 0.6) * 0.012 * C.idle * live, 0);
    }
  });
  return null;
}

// Project points on the ewer to the screen so HTML annotations can follow the model.
export function Anchors({ model, points, onFrame }) {
  const { camera, size } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);
  const n = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    if (!model.current) return;
    model.current.updateMatrixWorld();
    const out = points.map(([x, y, z, nx = 0, ny = 0, nz = 1]) => {
      v.set(x, y, z).applyMatrix4(model.current.matrixWorld);
      n.set(nx, ny, nz).transformDirection(model.current.matrixWorld);
      const toCam = camera.position.clone().sub(v).normalize();
      const facing = n.dot(toCam);
      v.project(camera);
      return { x: (v.x * 0.5 + 0.5) * size.width, y: (-v.y * 0.5 + 0.5) * size.height, facing };
    });
    onFrame(out);
  });
  return null;
}

export function useDrag(el, rig, k = 4.2) {
  useEffect(() => {
    const node = el.current; if (!node) return;
    let down = false, lastX = 0, vel = 0, raf = 0;
    const loop = () => {
      if (!down) { rig.target.drag += vel; vel *= 0.93; rig.target.drag *= 0.97; }
      if (down || Math.abs(vel) > 0.0001 || Math.abs(rig.target.drag) > 0.001) raf = requestAnimationFrame(loop); else raf = 0;
    };
    const start = (e) => { down = true; lastX = e.clientX; vel = 0; node.classList.add('is-dragging'); if (!raf) raf = requestAnimationFrame(loop); };
    const move = (e) => { if (!down) return; const dx = (e.clientX - lastX) / innerWidth; lastX = e.clientX; rig.target.drag += dx * k; vel = dx * k; };
    const end = () => { down = false; node.classList.remove('is-dragging'); };
    node.addEventListener('pointerdown', start); addEventListener('pointermove', move); addEventListener('pointerup', end); addEventListener('pointercancel', end);
    return () => { node.removeEventListener('pointerdown', start); removeEventListener('pointermove', move); removeEventListener('pointerup', end); removeEventListener('pointercancel', end); };
  }, [el, rig]);
}

export function usePointer() {
  const p = useRef([0, 0]);
  useEffect(() => {
    const f = (e) => { p.current[0] = (e.clientX / innerWidth) * 2 - 1; p.current[1] = (e.clientY / innerHeight) * 2 - 1; };
    addEventListener('pointermove', f, { passive: true });
    return () => removeEventListener('pointermove', f);
  }, []);
  return p;
}

export function ProgressBridge({ loader }) {
  const { progress } = useProgress();
  useEffect(() => { loader.progress((progress / 100) * 0.96); }, [progress]);
  return null;
}

export function useInView(ref, margin = '15%') {
  const [v, setV] = useState(true);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => setV(e.isIntersecting), { rootMargin: margin });
    io.observe(ref.current); return () => io.disconnect();
  }, [ref]);
  return v;
}

export function RoyalCanvas({ children, frameloop = 'always', className }) {
  return (
    <Canvas className={className} frameloop={frameloop} dpr={[1, mobile ? 1.6 : 2]} camera={{ fov: 30, near: 0.1, far: 60, position: [0, 0.3, 6.4] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}>
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  );
}

export function Shadow({ opacity = 0.5, y = -0.955, scale = 2.4, color = '#05080e' }) {
  return <ContactShadows position={[0, y, 0]} opacity={opacity} scale={scale} blur={2.6} far={1.2} resolution={mobile ? 256 : 512} color={color} frames={Infinity} />;
}

// When the model finishes loading, tell the page.
export function Ready({ onReady }) {
  useEffect(() => { onReady?.(); }, []);
  return null;
}

useGLTF.preload(MODEL, DRACO);
