// VITRINE — a gallery-white study of the ewer. The display case opens, the piece turns a full
// circle with the scroll, and hairline notes pin themselves to the real 3D details.
import * as THREE from 'three';
import { useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { useFrame, useThree } from '@react-three/fiber';
import { boot, gsap, ScrollTrigger, reduced } from '../core/index.js';
import { SilverCanvas, Studio, Ewer, CameraRig, makeRig, useDrag, usePointer, ProgressBridge, Shadow, useInView, useKingdomState } from '../three/stage.jsx';

const { loader, start } = boot({ id: 'vitrine', kind: '3d', preset: 'ivory-gallery' });
const isMobile = () => innerWidth < 900;

const HERO = () => isMobile() ? { az: 0.25, el: 0.05, dist: 6.2, tx: 0, ty: 0.92, rotY: 0, fov: 30 } : { az: 0.28, el: 0.06, dist: 6.6, tx: -1.5, ty: 0.06, rotY: 0, fov: 30 };
const STUDY = () => isMobile() ? { az: 0, el: 0.08, dist: 6.4, tx: 0, ty: 0.12, fov: 30 } : { az: 0, el: 0.08, dist: 5.5, tx: 0, ty: 0.02, fov: 30 };
const rig = makeRig({ ...HERO(), y: 0, rotY: -1.6 });
rig.target.baseRot = -1.6;
const turn = { deg: 0 }; // scroll-driven rotation in degrees

// Details on the model (local coordinates) and when each note is shown (scroll progress window)
const NOTES = [
  { id: 'finial', p: [0, 0.86, 0.04], win: [0.16, 0.3] },
  { id: 'spout', p: [-0.44, 0.52, 0], win: [0.3, 0.44] },
  { id: 'foot', p: [0.05, -0.84, 0.24], win: [0.46, 0.6] },
  { id: 'handle', p: [0.42, 0.24, 0], win: [0.62, 0.78] },
  { id: 'body', p: [0, -0.3, 0.37], win: [0.8, 0.95] }
];
const noteEls = {};
const sceneState = { p: 0 };

function Notes({ model }) {
  const { camera, size } = useThree();
  const v = new THREE.Vector3();
  useFrame(() => {
    if (!model.current) return;
    camera.updateMatrixWorld(); model.current.updateMatrixWorld();
    for (const n of NOTES) {
      const el = noteEls[n.id]; if (!el) continue;
      v.set(...n.p); model.current.localToWorld(v); v.project(camera);
      const x = (v.x * 0.5 + 0.5) * size.width, y = (-v.y * 0.5 + 0.5) * size.height;
      el.style.setProperty('--x', x.toFixed(1) + 'px'); el.style.setProperty('--y', y.toFixed(1) + 'px');
      const on = sceneState.p >= n.win[0] && sceneState.p <= n.win[1];
      if (on !== el._on) { el._on = on; el.classList.toggle('is-on', on); }
    }
  });
  return null;
}

function Scene() {
  const model = useRef();
  const pointer = usePointer();
  const s = useKingdomState();
  const light = ['blush', 'peach', 'ivory'].includes(s.palette);
  useFrame(() => { rig.target.rotY = THREE.MathUtils.degToRad(turn.deg) + (rig.target.baseRot || 0); });
  return (
    <>
      <Studio rotation={-0.35} />
      <Ewer innerRef={model} onReady={() => ready()} />
      <Shadow opacity={light ? 0.3 : 0.6} color={light ? '#6b4a3a' : '#03060b'} />
      <CameraRig rig={rig} model={model} pointer={pointer} lambda={3.6} />
      <Notes model={model} />
    </>
  );
}

function App() {
  const wrap = useRef();
  const inView = useInView(wrap);
  useDrag(wrap, rig);
  return <div ref={wrap} className="vt-stage__in"><ProgressBridge loader={loader} /><SilverCanvas frameloop={inView ? 'always' : 'never'}><Scene /></SilverCanvas></div>;
}
createRoot(document.getElementById('stage')).render(<App />);

document.querySelectorAll('.vt-note').forEach((el) => (noteEls[el.dataset.note] = el));

let isReady = false;
function ready() { if (isReady) return; isReady = true; loader.done(); loader.ready.then(intro); }

function intro() {
  start();
  const R = reduced();
  if (R) { rig.target.baseRot = 0; rig.cur.rotY = 0; }
  else {
    // the piece is revealed in its case: the frame draws itself, then the ewer turns to face you
    gsap.fromTo('.vt-frame', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.6, ease: 'expo.inOut' });
    gsap.fromTo(rig.target, { baseRot: -1.6, y: -0.25 }, { baseRot: 0, y: 0, duration: 2.8, ease: 'expo.out', delay: 0.4 });
  }
  document.querySelectorAll('.vt-hero [data-split]').forEach((e) => setTimeout(() => e._reveal?.(), R ? 0 : 500));
  gsap.to('.vt-hero__foot > *, .vt-hero .k-eyebrow, .vt-caption', { opacity: 1, y: 0, duration: 1.3, ease: 'power3.out', stagger: 0.08, delay: R ? 0 : 1.2 });
  buildScroll();
}

function buildScroll() {
  const scene = document.querySelector('.vt-scene');
  const deg = document.querySelector('.vt-deg b');
  const steps = [...document.querySelectorAll('.vt-index li')];
  const proxy = { ...HERO() };
  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
  // 0 → 0.14: the case opens into the full stage (shared-element transition)
  tl.to(proxy, { ...STUDY(), duration: 0.14, onUpdate: () => Object.assign(rig.target, { ...proxy }) }, 0);
  tl.to('.vt-hero__copy', { xPercent: -8, opacity: 0, duration: 0.1 }, 0);
  tl.to('.vt-hero__foot', { opacity: 0, duration: 0.06 }, 0);
  tl.fromTo('.vt-caption', { opacity: 1 }, { opacity: 0, duration: 0.05, immediateRender: false }, 0);
  const fr = document.querySelector('.vt-frame'), pin = fr.parentElement;
  const fromFrame = () => ({ '--t': fr.offsetTop + 'px', '--l': fr.offsetLeft + 'px', '--r': (pin.clientWidth - fr.offsetLeft - fr.offsetWidth) + 'px', '--b': (pin.clientHeight - fr.offsetTop - fr.offsetHeight) + 'px' });
  tl.fromTo(fr, fromFrame(), { '--t': '0px', '--l': '0px', '--r': '0px', '--b': '0px', duration: 0.14 }, 0);
  tl.fromTo('.vt-study', { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.1);
  // 0.14 → 0.96: one full, unhurried turn
  tl.fromTo(turn, { deg: 0 }, { deg: 360, ease: 'none', duration: 0.82 }, 0.14);
  tl.to({}, { duration: 0.04 }, 0.96);
  ScrollTrigger.create({
    trigger: scene, start: 'top top', end: 'bottom bottom', scrub: 1, animation: tl,
    onUpdate: (st) => {
      sceneState.p = st.progress;
      const i = NOTES.findIndex((n) => st.progress >= n.win[0] && st.progress <= n.win[1]);
      steps.forEach((li, k) => li.classList.toggle('is-on', k === i));
      rig.target.idle = st.progress < 0.04 ? 1 : 0.25;
    }
  });
  addEventListener('resize', () => Object.assign(rig.target, sceneState.p < 0.14 ? HERO() : STUDY()));
  // live turn readout (includes any drag)
  let lastDeg = -1;
  gsap.ticker.add(() => {
    const d = Math.round((((turn.deg + THREE.MathUtils.radToDeg(rig.cur.drag || 0)) % 360) + 360) % 360);
    if (d !== lastDeg) { lastDeg = d; deg.textContent = String(d).padStart(3, '0'); }
  });
  // collection: basin turns slowly
  if (!reduced()) gsap.utils.toArray('.vt-spin').forEach((el) => gsap.to(el, { rotation: 360, duration: 100, ease: 'none', repeat: -1 }));
}

setTimeout(() => ready(), 20000);
