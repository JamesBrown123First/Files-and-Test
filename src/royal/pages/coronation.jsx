// CORONATION — the 3D ewer descends into the headline, then the camera orbits five details.
import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { boot, gsap, ScrollTrigger, reduced, getState } from '../boot.js';
import { RoyalCanvas, Studio, Ewer, Rig, Anchors, makeRig, usePointer, useDrag, ProgressBridge, Ready, Shadow, mobile, useInView } from '../stage.jsx';

const { loader, start } = boot({ id: 'coronation', name: 'Coronation', preset: 'royal-night', three: true, presets: ['royal-night', 'coronation', 'guilloche', 'starlit', 'ink-copper', 'dusk-rose'] });

// detail anchors on the model (local space) + outward normal
const POINTS = [[0, 0.74, 0.11, 0, 0.2, 1], [-0.37, 0.55, 0, -1, 0.3, 0], [0.41, 0.36, 0, 1, 0, 0], [0, -0.22, 0.37, 0, 0, 1], [0, -0.83, 0.21, 0, -0.2, 1]];
// camera poses: hero, five details, finale
const POSES = [
  { az: 0, el: 0.05, dist: 4.9, tx: 0, ty: -0.02, rotY: 0, x: 0, my: -0.16 },
  { az: -0.3, el: 0.16, dist: 3.7, tx: 0.42, ty: 0.5, rotY: 0.25, x: 0 , my: 0.36 },
  { az: -0.75, el: 0.1, dist: 3.9, tx: -0.42, ty: 0.42, rotY: -0.1, x: 0 , my: 0.36 },
  { az: 0.95, el: 0.06, dist: 4.1, tx: 0.42, ty: 0.28, rotY: 0.15, x: 0 , my: 0.36 },
  { az: 0.12, el: 0.02, dist: 3.7, tx: -0.42, ty: -0.2, rotY: -0.35, x: 0 , my: 0.36 },
  { az: -0.25, el: 0.3, dist: 3.5, tx: 0.42, ty: -0.62, rotY: 0.3, x: 0 , my: 0.36 },
  { az: 0.3, el: 0.06, dist: 5.4, tx: -0.62, ty: 0, rotY: 0.6, x: 0 , my: 0.62 }
];
const rig = makeRig({ ...POSES[0], y: 2.8, rotY: -1.3, idle: 0 });
const state = { chapter: -1 };

function Scene() {
  const model = useRef(), wrap = useRef(document.getElementById('stage'));
  const pointer = usePointer();
  useDrag(wrap, rig);
  const inView = useInView(wrap);
  const dots = useRef([]), line = useRef(null), svg = useRef(null);
  useEffect(() => {
    dots.current = [...document.querySelectorAll('.co-dot')];
    line.current = document.querySelector('.co-line path');
  }, []);
  const onFrame = (pts) => {
    const i = state.chapter;
    pts.forEach((p, k) => {
      const d = dots.current[k]; if (!d) return;
      d.style.transform = `translate3d(${p.x}px,${p.y}px,0)`;
      d.classList.toggle('is-on', k === i && p.facing > -0.2);
    });
    const card = i >= 0 && document.querySelector(`.co-card[data-i="${i}"]`);
    if (line.current) {
      if (!card || mobile) { line.current.setAttribute('d', ''); return; }
      const r = card.getBoundingClientRect(), p = pts[i];
      const left = r.left > p.x;
      const ex = left ? r.left - 16 : r.right + 16, ey = r.top + 28;
      const mx = (p.x + ex) / 2;
      line.current.setAttribute('d', `M${p.x},${p.y} C${mx},${p.y} ${mx},${ey} ${ex},${ey}`);
    }
  };
  return (
    <RoyalCanvas className="co-canvas" frameloop={inView ? 'always' : 'never'}>
      <Studio />
      <Ewer innerRef={model} />
      <Shadow opacity={0.45} y={-0.96} />
      <Rig rig={rig} model={model} pointer={pointer} lambda={2.6} />
      <Anchors model={model} points={POINTS} onFrame={onFrame} />
      <ProgressBridge loader={loader} />
      <Ready onReady={ready} />
    </RoyalCanvas>
  );
}

let readyOnce = false;
function ready() {
  if (readyOnce) return; readyOnce = true;
  loader.finish().then(intro);
  start().then(timeline);
}

function intro() {
  const still = reduced();
  const T = rig.target;
  if (still) { Object.assign(rig.cur, { y: 0, rotY: 0 }); Object.assign(T, { y: 0, rotY: 0, idle: 1 }); }
  else {
    // a slow descent, a soft touch-down with a little recoil, then it settles
    gsap.timeline()
      .to(T, { y: -0.045, rotY: 0.05, duration: 2.6, ease: 'power3.inOut' })
      .to(T, { y: 0, rotY: 0, duration: 1.4, ease: 'elastic.out(1, 0.45)' })
      .to(T, { idle: 1, duration: 2 }, '-=1');
  }
  const lines = document.querySelectorAll('.co-title > span');
  gsap.fromTo(lines, { yPercent: 105, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.6, ease: 'expo.out', stagger: 0.12, delay: still ? 0 : 0.5 });
  gsap.fromTo('.co-intro > *, .co-hint, .co-rail', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', stagger: 0.08, delay: still ? 0 : 1.6 });
}

function timeline() {
  const hero = document.querySelector('.co-hero');
  const cards = [...document.querySelectorAll('.co-card')], ticks = [...document.querySelectorAll('.co-rail button')];
  const meter = document.querySelector('.co-rail__fill');
  const N = 5, A = 0.1, B = 0.8; // chapters live between A and B
  const setChapter = (i) => {
    if (i === state.chapter) return; state.chapter = i;
    cards.forEach((c, k) => c.classList.toggle('is-on', k === i));
    ticks.forEach((t, k) => t.classList.toggle('is-on', k === i));
    document.documentElement.classList.toggle('co-in-detail', i >= 0 && i < N);
  };
  // pose timeline (duration units = progress)
  const tl = gsap.timeline({ paused: true });
  const T = rig.target;
  const seg = (B - A) / N;
  tl.to('.co-title', { yPercent: -18, opacity: 0, duration: A, ease: 'power1.in' }, 0)
    .to('.co-intro, .co-hint', { opacity: 0, y: -20, duration: A * 0.6 }, 0);
  for (let i = 1; i <= N; i++) tl.to(T, { ...POSES[i], duration: seg * 0.55, ease: 'power2.inOut' }, A + seg * (i - 1));
  tl.to(T, { ...POSES[6], duration: 1 - B - 0.04, ease: 'power2.inOut' }, B);
  tl.fromTo('.co-final', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.08 }, B + 0.08);
  tl.set({}, {}, 1);
  ScrollTrigger.create({
    trigger: hero, start: 'top top', end: 'bottom bottom', scrub: true,
    onUpdate: (st) => {
      const p = st.progress;
      tl.progress(p);
      setChapter(p < A ? -1 : p >= B ? N : Math.min(N - 1, Math.floor((p - A) / seg)));
      if (meter) meter.style.transform = `scaleY(${gsap.utils.clamp(0, 1, (p - A) / (B - A))})`;
      document.documentElement.classList.toggle('co-final-on', p > B + 0.04);
    }
  });
  ticks.forEach((t, k) => t.addEventListener('click', () => {
    const top = hero.offsetTop + (hero.offsetHeight - innerHeight) * (A + seg * (k + 0.3));
    window.__lenis ? window.__lenis.scrollTo(top) : scrollTo({ top, behavior: 'smooth' });
  }));
}

createRoot(document.getElementById('stage')).render(<Scene />);
