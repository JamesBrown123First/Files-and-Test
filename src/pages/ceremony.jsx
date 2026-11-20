// CEREMONY — the original idea, in real 3D.
// Scroll: the ewer descends from above with a slow turn while the basin rises from below at a
// steep angle and straightens. They meet with a physical landing (spring + floor contact: a small
// recoil, then it settles). The basin's polished centre is a live mirror, so it reflects the real ewer.
import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { boot, gsap, ScrollTrigger, reduced, getState } from '../core/index.js';
import { SilverCanvas, Studio, Ewer, CameraRig, makeRig, useDrag, usePointer, ProgressBridge, Shadow, useInView, useKingdomState } from '../three/stage.jsx';

const { loader, start } = boot({ id: 'ceremony', kind: '3d', preset: 'royal-blue' });
const BASE = document.querySelector('meta[name="kingdom-base"]')?.content || '';
const isMobile = () => innerWidth < 900;

// --- choreography state (written by the scroll timeline, read every frame) ---------------
const FLOOR = 0;                          // ewer group y when its foot touches the ground
const R = 0.98;                           // basin radius (world units); the ewer is ~1.95 tall
const BASIN_REST = { y: -0.955 + R * Math.cos(0.1) + 0.004, z: -0.62, rx: -0.1 };
const C = {
  ewerY: 0.62, ewerRot: -1.05,            // target height / turn of the ewer
  basinY: -3.6, basinRx: -1.32, basinRz: 0.22, basinSpin: 0
};
const rig = makeRig({ az: 0, el: 0.05, dist: 7.6, tx: 0, ty: 0.2, rotY: 0, fov: 30, idle: 1 });
const dummy = { current: null };

// The basin's mirror renders the scene from its own camera. Give that pass the studio as a
// backdrop so the mirror shows soft light around the ewer (like a real silver shoot), while the
// page itself keeps its animated background.
function MirrorBackdrop() {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    const orig = gl.render;
    gl.render = function (sc, cam) {
      if (sc === scene && cam !== camera && cam.isPerspectiveCamera && scene.environment) {
        const b = sc.background, bb = sc.backgroundBlurriness, bi = sc.backgroundIntensity;
        sc.background = scene.environment; sc.backgroundBlurriness = 0.18; sc.backgroundIntensity = 1.0;
        orig.call(this, sc, cam);
        sc.background = b; sc.backgroundBlurriness = bb; sc.backgroundIntensity = bi;
        return;
      }
      return orig.call(this, sc, cam);
    };
    return () => { gl.render = orig; };
  }, [gl, scene, camera]);
  return null;
}

function Basin({ physics }) {
  const g = useRef();
  const [map, normal] = useLoader(THREE.TextureLoader, [BASE + 'assets/img/basin-1024.webp', BASE + 'assets/img/basin-normal.webp']);
  useMemo(() => { map.colorSpace = THREE.SRGBColorSpace; map.anisotropy = 8; normal.anisotropy = 8; }, [map, normal]);
  const mirror = useMemo(() => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const size = Math.round((isMobile() ? 512 : 1024) * dpr);
    const m = new Reflector(new THREE.CircleGeometry(R * 0.35 * 0.985, 96), { textureWidth: size, textureHeight: size, clipBias: 0.003, color: 0xd4d6da, multisample: 4 });
    return m;
  }, []);
  useEffect(() => () => { mirror.getRenderTarget().dispose(); mirror.geometry.dispose(); }, [mirror]);
  useFrame((_, dt) => {
    if (!g.current) return;
    const k = 1 - Math.exp(-Math.min(dt, 0.05) * 5);
    const o = g.current;
    o.position.y += (C.basinY - o.position.y) * k;
    o.rotation.x += (C.basinRx + physics.wobble - o.rotation.x) * k;
    o.rotation.z += (C.basinRz + C.basinSpin - o.rotation.z) * k;
  });
  return (
    <group ref={g} position={[0, C.basinY, BASIN_REST.z]} rotation={[C.basinRx, 0, C.basinRz]}>
      <mesh>
        <planeGeometry args={[R * 2, R * 2]} />
        <meshStandardMaterial map={map} normalMap={normal} normalScale={[0.45, 0.45]} metalness={0.6} roughness={0.42} alphaTest={0.5} side={THREE.DoubleSide} envMapIntensity={1.05} />
      </mesh>
      {/* polished centre: a true planar mirror that reflects the ewer standing in front of it */}
      <primitive object={mirror} position={[0, 0, 0.004]} />
      {/* a soft rim where the mirror meets the engraving */}
      <mesh position={[0, 0, 0.005]}>
        <ringGeometry args={[R * 0.35 * 0.975, R * 0.35 * 1.02, 96]} />
        <meshStandardMaterial color="#e9e9ec" metalness={1} roughness={0.12} />
      </mesh>
    </group>
  );
}

// Ewer with weight: a spring follows the scroll target, and the floor stops it with a little bounce.
function Physics({ ewer, physics }) {
  const st = useRef({ y: C.ewerY, v: 0, rot: C.ewerRot, rv: 0, t: 0, landed: false });
  useFrame((_, dt) => {
    dt = Math.min(dt, 1 / 30);
    const p = st.current; p.t += dt;
    const sub = 4, h = dt / sub;
    const idle = (getState().motion === 'reduced' ? 0 : 1) * rig.cur.idle;
    for (let i = 0; i < sub; i++) {
      // gentle underdamped spring = inertia; the floor turns the overshoot into a soft impact
      const target = C.ewerY;
      p.v += ((target - p.y) * 38 - p.v * 9.5) * h;
      p.y += p.v * h;
      if (p.y < FLOOR) {
        const impact = -p.v;
        p.y = FLOOR;
        p.v = impact > 0.25 ? impact * 0.22 : 0;           // slight recoil, then rest
        if (impact > 0.25) { physics.amp = Math.min(0.045, impact * 0.011); physics.t0 = p.t; }  // the basin feels it
      }
      p.rv += ((C.ewerRot + rig.cur.drag - p.rot) * 26 - p.rv * 8.5) * h;
      p.rot += p.rv * h;
    }
    const e = p.t - (physics.t0 || 0);
    physics.wobble = physics.amp ? physics.amp * Math.exp(-e * 3.4) * Math.sin(e * 12) : 0;
    if (ewer.current) {
      const airborne = Math.min(1, Math.max(0, (p.y - FLOOR) / 0.35));
      ewer.current.position.y = p.y + Math.sin(p.t * 0.6) * 0.012 * idle * airborne;
      ewer.current.rotation.y = p.rot + Math.sin(p.t * 0.35) * 0.04 * idle;
      physics.air = airborne;
    }
  });
  return null;
}

function Scene() {
  const ewer = useRef();
  const pointer = usePointer();
  const s = useKingdomState();
  const physics = useMemo(() => ({ wobble: 0, amp: 0, t0: 0, air: 1 }), []);
  const light = ['blush', 'peach', 'ivory'].includes(s.palette);
  return (
    <>
      <Studio rotation={0.2} />
      <Ewer innerRef={ewer} onReady={() => ready()} />
      <MirrorBackdrop />
      <Basin physics={physics} />
      <Physics ewer={ewer} physics={physics} />
      <Shadow opacity={light ? 0.34 : 0.62} color={light ? '#5a3a2a' : '#03060b'} scale={3.4} />
      <CameraRig rig={rig} model={dummy} pointer={pointer} lambda={3} />
    </>
  );
}

function App() {
  const wrap = useRef();
  const inView = useInView(wrap);
  useDrag(wrap, rig);
  return <div ref={wrap} className="cr-stage__in"><ProgressBridge loader={loader} /><SilverCanvas frameloop={inView ? 'always' : 'never'}><Scene /></SilverCanvas></div>;
}
createRoot(document.getElementById('stage')).render(<App />);

let isReady = false;
function ready() { if (isReady) return; isReady = true; loader.done(); loader.ready.then(intro); }

function intro() {
  start();
  const Rd = reduced();
  document.querySelectorAll('.cr-intro [data-split]').forEach((e, i) => setTimeout(() => e._reveal?.(), (Rd ? 0 : 500) + i * 160));
  gsap.to('.cr-pin [data-fade], .cr-scroll, .cr-meter', { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out', delay: Rd ? 0 : 1.1, stagger: 0.08 });
  buildScroll();
}

function buildScroll() {
  const hero = document.querySelector('.cr-hero');
  const chap = (n) => document.querySelector('.cr-chap--' + n);
  const meterFill = document.querySelector('.cr-meter i');
  const meterNum = document.querySelector('.cr-meter b');
  const m = isMobile();
  const cam = { ...rig.target };
  const camTo = (o, at, dur, ease = 'power2.inOut') => tl.to(cam, { ...o, duration: dur, ease, onUpdate: () => Object.assign(rig.target, cam) }, at);

  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
  // 0.00–0.08: hold the opening frame
  tl.to({}, { duration: 0.06 }, 0);
  // 0.06–0.46: the descent and the rise
  tl.to('.cr-intro', { opacity: 0, y: -40, filter: 'blur(6px)', duration: 0.12, ease: 'power1.in' }, 0.06);
  tl.to('.cr-scroll, .cr-eyebrow', { opacity: 0, duration: 0.05 }, 0.05);
  tl.fromTo('.cr-horizon', { opacity: 0 }, { opacity: 0.7, duration: 0.12 }, 0.3);
  tl.to(C, { ewerY: FLOOR - 0.02, duration: 0.38, ease: 'power2.inOut' }, 0.08);       // aims just below the floor: it lands, not floats
  tl.to(C, { ewerRot: 0.1, duration: 0.4, ease: 'power3.inOut' }, 0.06);
  tl.to(C, { basinY: BASIN_REST.y, duration: 0.36, ease: 'power3.out' }, 0.1);
  tl.to(C, { basinRx: BASIN_REST.rx, basinRz: 0, duration: 0.38, ease: 'power2.inOut' }, 0.1);
  camTo({ dist: m ? 7.6 : 7.1, ty: 0.02, el: 0.07 }, 0.08, 0.38);
  tl.fromTo('.cr-meet', { opacity: 0, letterSpacing: '0.6em' }, { opacity: 1, letterSpacing: '0.34em', duration: 0.1, ease: 'power2.out' }, 0.4);
  // 0.50–0.72: closer, orbiting to the handle side: craftsmanship
  tl.to('.cr-meet', { opacity: 0, duration: 0.06 }, 0.5);
  camTo({ az: m ? 0.42 : 0.62, el: 0.16, dist: m ? 5.6 : 4.5, tx: m ? 0 : -0.55, ty: 0.32 }, 0.5, 0.18);
  tl.to(C, { ewerRot: -0.22, duration: 0.2 }, 0.5);
  tl.fromTo(chap(1), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.08, ease: 'power3.out' }, 0.6);
  // 0.72–0.94: across to the other side, then the full set
  tl.to(chap(1), { opacity: 0, y: -30, duration: 0.06 }, 0.72);
  camTo({ az: m ? -0.3 : -0.42, el: 0.08, dist: m ? 8.4 : 7.9, tx: 0, ty: m ? 0.55 : 0.5 }, 0.72, 0.18);
  tl.to(C, { ewerRot: 0.32, basinSpin: 0.0, duration: 0.18 }, 0.72);
  tl.fromTo(chap(2), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.08, ease: 'power3.out' }, 0.84);
  tl.to({}, { duration: 0.06 }, 0.94);

  ScrollTrigger.create({
    trigger: hero, start: 'top top', end: 'bottom bottom', scrub: 1.2, animation: tl,
    onUpdate: (st) => {
      const p = st.progress;
      meterFill.style.transform = `scaleX(${p})`;
      meterNum.textContent = String(Math.round(p * 100)).padStart(2, '0');
      rig.target.idle = p < 0.06 ? 1 : 0.45;
    }
  });
  // the basin keeps a very slow turn once it stands (barely perceptible life)
  if (!reduced()) gsap.to(C, { basinSpin: Math.PI * 2, duration: 220, ease: 'none', repeat: -1 });

  // set gallery: drag strip
  const strip = document.querySelector('.cr-strip');
  if (strip) {
    let down = false, x0 = 0, s0 = 0, v = 0, lx = 0;
    strip.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; x0 = lx = e.clientX; s0 = strip.scrollLeft; strip.classList.add('is-drag'); });
    addEventListener('pointermove', (e) => { if (!down) return; strip.scrollLeft = s0 - (e.clientX - x0); v = e.clientX - lx; lx = e.clientX; });
    addEventListener('pointerup', () => { if (!down) return; down = false; strip.classList.remove('is-drag'); gsap.to(strip, { scrollLeft: strip.scrollLeft - v * 14, duration: 1.2, ease: 'power3.out' }); });
  }
  // the ceremony ring in the story section turns with the scroll
  gsap.to('.cr-ring img', { rotation: 50, ease: 'none', scrollTrigger: { trigger: '.cr-story', start: 'top bottom', end: 'bottom top', scrub: true } });
  addEventListener('resize', () => ScrollTrigger.refresh());
}

setTimeout(() => ready(), 20000);
