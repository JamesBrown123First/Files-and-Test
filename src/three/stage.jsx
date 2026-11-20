// Shared React Three Fiber stage for the 3D concepts.
import * as THREE from 'three';
import { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei/core/Gltf.js';
import { ContactShadows } from '@react-three/drei/core/ContactShadows.js';
import { useProgress } from '@react-three/drei/core/Progress.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { buildStudio } from '../studio.js';
import { getState, onState } from '../core/state.js';
import { MOODS } from '../core/state.js';

const BASE = document.querySelector('meta[name="kingdom-base"]')?.content || '';
export const MODEL_2K = BASE + 'assets/model/ewer-2k.glb';
export const DRACO = BASE + 'assets/draco/';
export const HDR = BASE + 'assets/env/studio-2k.hdr';
export const HDR_SMALL = BASE + 'assets/env/studio-1k.hdr';
const _q = new URLSearchParams(location.search);
// ACES keeps the strong contrast of a real silver shoot: crisp mirror highlights, deep recesses.
const TM = _q.get('tm') === 'agx' ? THREE.AgXToneMapping : THREE.ACESFilmicToneMapping;
export const EXPO = +(_q.get('ex') || 1.3);
const mobile = matchMedia('(max-width: 900px)').matches || matchMedia('(pointer: coarse)').matches;

export function useKingdomState() {
  const [s, set] = useState(() => ({ ...getState() }));
  useEffect(() => onState((n) => set({ ...n })), []);
  return s;
}

// Studio environment: supplied HDR + soft boxes + black flags, rebuilt when the mood changes
export function Studio({ rotation = 0 }) {
  const { gl, scene } = useThree();
  const hdr = useLoader(RGBELoader, mobile ? HDR_SMALL : HDR);
  const s = useKingdomState();
  const cache = useRef({});
  const exposure = useRef(1);
  useEffect(() => {
    const m = MOODS[s.mood] || MOODS.studio;
    const tex = cache.current[s.mood] || (cache.current[s.mood] = buildStudio(gl, hdr, m.studio));
    scene.environment = tex;
  }, [s.mood, gl, hdr, scene]);
  useEffect(() => () => Object.values(cache.current).forEach((t) => t.dispose()), []);
  useFrame((_, dt) => {
    const m = MOODS[s.mood] || MOODS.studio;
    const target = m.exposure * (s.exposure || 1) * EXPO;
    exposure.current += (target - exposure.current) * Math.min(1, dt * 3);
    gl.toneMappingExposure = exposure.current;
    scene.environmentRotation.y = rotation;
  });
  return null;
}

// The ewer, exactly as modelled: geometry, textures and PBR materials untouched.
// A 4K version replaces the 2K one on large screens when the site provides it.
export function Ewer({ innerRef, onReady }) {
  const g = useGLTF(MODEL_2K, DRACO);
  const [hi, setHi] = useState(null);
  const cfg = window.KINGDOM_CFG || {};
  useEffect(() => {
    onReady?.();
    const conn = navigator.connection;
    const ok = cfg.hiResModel && !mobile && innerWidth >= 1100 && !(conn && (conn.saveData || /2g/.test(conn.effectiveType || '')));
    if (!ok) return;
    const t = setTimeout(() => {
      import('three/examples/jsm/loaders/GLTFLoader.js').then(async ({ GLTFLoader }) => {
        const { DRACOLoader } = await import('three/examples/jsm/loaders/DRACOLoader.js');
        const l = new GLTFLoader().setDRACOLoader(new DRACOLoader().setDecoderPath(DRACO));
        l.load(BASE + cfg.hiResModel, (r) => { prep(r.scene); setHi(r.scene); }, undefined, () => {});
      });
    }, 2500);
    return () => clearTimeout(t);
  }, []);
  const scene = useMemo(() => { prep(g.scene); return g.scene; }, [g]);
  return <group ref={innerRef}><primitive object={hi || scene} /></group>;
}
function prep(root) {
  root.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = false; o.receiveShadow = false;
      const m = o.material;
      if (m) { m.envMapIntensity = 1; if (m.normalMap) m.normalMap.anisotropy = 8; if (m.map) m.map.anisotropy = 8; }
    }
  });
}

// Camera rig: values are set by scroll timelines; the camera eases toward them for natural inertia.
export function makeRig(init) {
  const base = { az: 0, el: 0.06, dist: 6.4, tx: 0, ty: 0, tz: 0, fov: 30, rotY: 0, y: 0, idle: 1, drag: 0, sx: 0, sy: 0 };
  return { target: { ...base, ...init }, cur: { ...base, ...init } };
}
export function CameraRig({ rig, model, pointer, lambda = 3.2 }) {
  const { camera, size } = useThree();
  const t0 = useRef(0);
  useFrame((st, dt) => {
    dt = Math.min(dt, 0.05);
    t0.current += dt;
    const T = rig.target, C = rig.cur;
    const k = 1 - Math.exp(-dt * lambda);
    for (const key in T) C[key] += (T[key] - C[key]) * k;
    // pointer parallax + idle breathing (kept very small)
    const px = pointer?.current?.[0] || 0, py = pointer?.current?.[1] || 0;
    const idle = C.idle * (getState().motion === 'reduced' ? 0 : 1);
    const az = C.az + px * 0.06 * idle;
    const el = C.el + py * 0.035 * idle;
    // narrow screens need more distance to keep the whole form in frame
    const aspect = size.width / size.height;
    const fit = aspect < 0.8 ? 1 + (0.8 - aspect) * 0.9 : 1;
    const d = C.dist * fit;
    const tx = C.tx * Math.min(1, aspect / 1.4), ty = C.ty, tz = C.tz;
    camera.position.set(tx + Math.sin(az) * Math.cos(el) * d, ty + Math.sin(el) * d, tz + Math.cos(az) * Math.cos(el) * d);
    camera.lookAt(tx, ty, tz);
    if (Math.abs(camera.fov - C.fov) > 0.01) { camera.fov = C.fov; camera.updateProjectionMatrix(); }
    if (model.current) {
      model.current.rotation.y = C.rotY + C.drag + Math.sin(t0.current * 0.35) * 0.05 * idle;
      model.current.position.y = C.y + Math.sin(t0.current * 0.6) * 0.012 * idle;
    }
  });
  return null;
}

// Drag-to-turn with inertia; springs back to the scroll pose when released.
export function useDrag(el, rig) {
  useEffect(() => {
    const node = el.current; if (!node) return;
    let down = false, lastX = 0, vel = 0, raf = 0;
    const loop = () => {
      if (!down) { rig.target.drag += vel; vel *= 0.92; rig.target.drag *= 0.965; }
      if (down || Math.abs(vel) > 0.0001 || Math.abs(rig.target.drag) > 0.001) raf = requestAnimationFrame(loop); else raf = 0;
    };
    const start = (e) => { down = true; lastX = e.clientX; vel = 0; node.setPointerCapture?.(e.pointerId); node.classList.add('is-dragging'); if (!raf) raf = requestAnimationFrame(loop); };
    const move = (e) => { if (!down) return; const dx = (e.clientX - lastX) / innerWidth; lastX = e.clientX; rig.target.drag += dx * 4.2; vel = dx * 4.2; };
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

// Reports load progress to the page loader
export function ProgressBridge({ loader }) {
  const { progress } = useProgress();
  useEffect(() => { loader.progress(progress / 100 * 0.96); }, [progress]);
  return null;
}

// Pause rendering when the stage is off-screen
export function useInView(ref, margin = '10%') {
  const [v, setV] = useState(true);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => setV(e.isIntersecting), { rootMargin: margin });
    io.observe(ref.current); return () => io.disconnect();
  }, [ref]);
  return v;
}

export function SilverCanvas({ children, frameloop = 'always', className }) {
  return (
    <Canvas className={className} frameloop={frameloop} dpr={[1, mobile ? 1.6 : 2]} camera={{ fov: 30, near: 0.1, far: 60, position: [0, 0.4, 6.4] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: TM, outputColorSpace: THREE.SRGBColorSpace }}
      onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}>
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  );
}

export function Shadow({ opacity = 0.55, y = -0.955, scale = 2.4, color = '#05080e' }) {
  return <ContactShadows position={[0, y, 0]} opacity={opacity} scale={scale} blur={2.6} far={1.2} resolution={mobile ? 256 : 512} color={color} frames={Infinity} />;
}

useGLTF.preload(MODEL_2K, DRACO);
