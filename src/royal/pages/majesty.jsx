// MAJESTY — Regalia's composition with the real 3D ewer. It descends in front of the wordmark,
// then scrolling turns it a full circle while the camera moves between four views.
import { useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { boot, gsap, ScrollTrigger, reduced } from '../boot.js';
import { RoyalCanvas, Studio, Ewer, Rig, makeRig, usePointer, useDrag, ProgressBridge, Ready, Shadow, useInView } from '../stage.jsx';
import { initLoupe } from '../loupe.js';

const { loader, start } = boot({ id: 'majesty', name: 'Majesty', preset: 'majesty', three: true, presets: ['majesty', 'champagne', 'maison-ivory', 'pearl', 'throne-room', 'regal-salon'] });

const TAU = Math.PI * 2;
const POSES = [
  { az: 0, el: 0.05, dist: 4.9, tx: 0, ty: -0.02, rotY: 0, my: -0.12 },
  { az: -0.2, el: 0.1, dist: 4.5, tx: 0.5, ty: 0.02, rotY: TAU * 0.22, my: 0.3 },
  { az: 0.22, el: 0.16, dist: 3.5, tx: -0.42, ty: 0.28, rotY: TAU * 0.48, my: 0.36 },
  { az: -0.28, el: 0.06, dist: 3.9, tx: 0.44, ty: 0.22, rotY: TAU * 0.7, my: 0.36 },
  { az: 0.12, el: 0.3, dist: 3.6, tx: -0.42, ty: -0.55, rotY: TAU * 0.9, my: 0.36 },
  { az: 0, el: 0.06, dist: 5.2, tx: -0.62, ty: 0, rotY: TAU + 0.35, my: 0.6 }
];
const rig = makeRig({ ...POSES[0], y: 2.8, rotY: -1.3, idle: 0 });

function Scene() {
  const model = useRef(), wrap = useRef(document.getElementById('stage'));
  const pointer = usePointer();
  useDrag(wrap, rig);
  const inView = useInView(wrap);
  return (
    <RoyalCanvas className="mj-canvas" frameloop={inView ? 'always' : 'never'}>
      <Studio />
      <Ewer innerRef={model} />
      <Shadow opacity={0.38} y={-0.96} color="#2b1c16" />
      <Rig rig={rig} model={model} pointer={pointer} lambda={2.6} />
      <ProgressBridge loader={loader} />
      <Ready onReady={ready} />
    </RoyalCanvas>
  );
}

let once = false;
function ready() {
  if (once) return; once = true;
  loader.finish().then(intro);
  start().then(() => { timeline(); initLoupe(); ScrollTrigger.refresh(); });
}

function intro() {
  const still = reduced(), T = rig.target;
  if (still) { Object.assign(rig.cur, { y: 0, rotY: 0 }); Object.assign(T, { y: 0, rotY: 0, idle: 1 }); }
  else {
    gsap.timeline()
      .to(T, { y: -0.045, rotY: 0.05, duration: 2.6, ease: 'power3.inOut' })
      .to(T, { y: 0, rotY: 0, duration: 1.4, ease: 'elastic.out(1, 0.45)' })
      .to(T, { idle: 1, duration: 2 }, '-=1');
  }
  const d = (v) => (still ? 0.01 : v);
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .fromTo('.mj-word', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: d(1.8), ease: 'expo.inOut' })
    .fromTo('.mj-h1 > span', { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.1, duration: d(1.4) }, d(1.2))
    .fromTo('.mj-copy .r-label, .mj-copy--r > *, .mj-specs li, .mj-hint', { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: d(1.2) }, d(1.5));
}

function timeline() {
  const hero = document.querySelector('.mj-hero');
  const chs = [...document.querySelectorAll('.mj-ch')], bar = document.querySelector('.mj-progress b'), first = document.querySelector('.mj-progress span');
  const N = chs.length, A = 0.1, B = 0.82, seg = (B - A) / N, T = rig.target;
  let cur = -2;
  const set = (i) => {
    if (i === cur) return; cur = i;
    chs.forEach((c, k) => c.classList.toggle('is-on', k === i));
    document.documentElement.classList.toggle('mj-in-detail', i >= 0 && i < N);
    if (i >= 0 && i < N) first.textContent = String(i + 1).padStart(2, '0');
  };
  const tl = gsap.timeline({ paused: true });
  tl.to('.mj-copy, .mj-specs', { opacity: 0, y: -24, duration: A * 0.7 }, 0)
    .to('.mj-word', { scale: 1.16, opacity: 0.25, duration: B }, 0);
  for (let i = 1; i <= N; i++) tl.to(T, { ...POSES[i], duration: seg * 0.6, ease: 'power2.inOut' }, A + seg * (i - 1));
  tl.to(T, { ...POSES[N + 1], duration: 1 - B - 0.04, ease: 'power2.inOut' }, B)
    .to('.mj-word', { opacity: 0.6, scale: 1, duration: 1 - B }, B)
    .fromTo('.mj-final', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.08 }, B + 0.06)
    .set({}, {}, 1);
  ScrollTrigger.create({
    trigger: hero, start: 'top top', end: 'bottom bottom', scrub: true,
    onUpdate: (st) => {
      const p = st.progress; tl.progress(p);
      set(p < A ? -1 : p >= B ? N : Math.min(N - 1, Math.floor((p - A) / seg)));
      bar.style.transform = `scaleX(${gsap.utils.clamp(0, 1, (p - A) / (B - A))})`;
      document.documentElement.classList.toggle('mj-final-on', p > B + 0.04);
    }
  });
}

createRoot(document.getElementById('stage')).render(<Scene />);
