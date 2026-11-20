// SOVEREIGN — the 3D ewer as a throne-room hero, choreographed by scroll.
import { useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { boot, gsap, ScrollTrigger, reduced } from '../core/index.js';
import { SilverCanvas, Studio, Ewer, CameraRig, makeRig, useDrag, usePointer, ProgressBridge, Shadow, useInView, useKingdomState } from '../three/stage.jsx';

const { loader, start } = boot({ id: 'sovereign', kind: '3d', preset: 'royal-night' });
const isMobile = () => innerWidth < 900;

// Chapter poses. tx shifts the frame so the ewer sits opposite its text.
const POSE = {
  presence: { az: 0.32, el: 0.07, dist: 6.0, tx: 0, ty: 0.02, rotY: 0, fov: 30 },
  ornament: { az: -0.42, el: 0.12, dist: 4.65, tx: -0.66, ty: -0.1, rotY: 0.28, fov: 30 },
  line: { az: 1.18, el: 0.2, dist: 4.5, tx: 0.66, ty: 0.16, rotY: 0.12, fov: 30 },
  gift: { az: 0.12, el: 0.05, dist: 6.6, tx: 0, ty: 0.28, rotY: -0.25, fov: 30 }
};
const mob = (p) => (isMobile() ? (p === POSE.presence || p.az === POSE.presence.az ? { ...p, tx: 0, dist: 6.6, ty: 0.38 } : { ...p, tx: 0, dist: p.dist * 1.04, ty: p.ty - 0.12 }) : p);

const rig = makeRig({ ...mob(POSE.presence), y: 2.8, rotY: 1.4 });

function Scene() {
  const model = useRef();
  const pointer = usePointer();
  const s = useKingdomState();
  const dark = s.palette && !['blush', 'peach', 'ivory'].includes(s.palette);
  return (
    <>
      <Studio rotation={0.15} />
      <Ewer innerRef={model} onReady={() => ready()} />
      <Shadow opacity={dark ? 0.6 : 0.32} color={dark ? '#03060b' : '#5a3a2a'} />
      <CameraRig rig={rig} model={model} pointer={pointer} />
    </>
  );
}

function App() {
  const wrap = useRef();
  const inView = useInView(wrap);
  useDrag(wrap, rig);
  return <div ref={wrap} className="sv-stage__in"><ProgressBridge loader={loader} /><SilverCanvas frameloop={inView ? 'always' : 'never'}><Scene /></SilverCanvas></div>;
}

createRoot(document.getElementById('stage')).render(<App />);

let isReady = false;
function ready() {
  if (isReady) return; isReady = true;
  loader.done();
  loader.ready.then(intro);
}

function intro() {
  start();
  const h1 = document.querySelectorAll('.sv-h1 [data-split]');
  const R = reduced();
  // The ewer descends from above with a slow quarter-turn, lands, recoils a hair and settles.
  if (R) { rig.target.y = 0; rig.target.rotY = 0; rig.cur.y = 0; rig.cur.rotY = 0; }
  else {
    gsap.timeline()
      .to(rig.target, { y: -0.035, duration: 2.3, ease: 'power3.inOut' }, 0)
      .to(rig.target, { y: 0, duration: 1.1, ease: 'elastic.out(1, 0.55)' }, 2.3)
      .to(rig.target, { rotY: 0, duration: 3.2, ease: 'power3.out' }, 0);
  }
  setTimeout(() => h1.forEach((e) => e._reveal?.()), R ? 0 : 900);
  document.querySelectorAll('.sv-intro [data-reveal], .sv-rail, .sv-scroll').forEach((e, i) => gsap.to(e, { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out', delay: (R ? 0 : 1.6) + i * 0.08 }));
  buildScroll();
}

function buildScroll() {
  const hero = document.querySelector('.sv-hero');
  const set = (p) => () => Object.assign(rig.target, mob(p));
  const chap = (n) => document.querySelector('.sv-chap--' + n);
  const title = document.querySelector('.sv-title');
  const introEl = document.querySelector('.sv-intro');
  const halo = document.querySelector('.sv-halo');
  const rail = [...document.querySelectorAll('.sv-rail li')];

  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
  const proxy = { ...mob(POSE.presence) };
  const to = (pose, at, dur) => tl.to(proxy, { ...pose, duration: dur, onUpdate: () => Object.assign(rig.target, mob({ ...proxy })) }, at);
  // 0 — presence (hold)
  tl.to({}, { duration: 0.08 }, 0);
  // 1 — ornament
  tl.to(title, { yPercent: -18, opacity: 0, filter: 'blur(8px)', duration: 0.16 }, 0.08);
  tl.to(introEl, { y: -30, opacity: 0, duration: 0.12 }, 0.08);
  tl.fromTo('.sv-scroll', { opacity: 1 }, { opacity: 0, duration: 0.06, immediateRender: false }, 0.06);
  to(POSE.ornament, 0.08, 0.22);
  tl.fromTo(chap(1), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.12, ease: 'power3.out' }, 0.22);
  // 2 — line
  tl.to(chap(1), { opacity: 0, y: -40, duration: 0.1 }, 0.42);
  to(POSE.line, 0.42, 0.2);
  tl.fromTo(chap(2), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.12, ease: 'power3.out' }, 0.54);
  // 3 — the gift: pull back, the basin rises behind as a low halo
  tl.to(chap(2), { opacity: 0, y: -40, duration: 0.1 }, 0.72);
  to(POSE.gift, 0.72, 0.2);
  tl.fromTo(halo, { opacity: 0, yPercent: 38, scale: 0.86 }, { opacity: 1, yPercent: 0, scale: 1, duration: 0.2, ease: 'power3.out' }, 0.74);
  tl.fromTo(chap(3), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.12, ease: 'power3.out' }, 0.84);
  tl.to({}, { duration: 0.06 }, 0.96);

  ScrollTrigger.create({
    trigger: hero, start: 'top top', end: 'bottom bottom', scrub: 1.1, animation: tl,
    onUpdate: (st) => {
      const p = st.progress;
      const idx = p < 0.2 ? 0 : p < 0.48 ? 1 : p < 0.78 ? 2 : 3;
      rail.forEach((li, i) => li.classList.toggle('is-on', i === idx));
      document.querySelector('.sv-rail__fill').style.transform = `scaleY(${p})`;
      rig.target.idle = p < 0.05 || p > 0.9 ? 1 : 0.4;
    }
  });
  rail.forEach((li, i) => li.addEventListener('click', () => {
    const r = hero.getBoundingClientRect(); const total = hero.offsetHeight - innerHeight;
    const stops = [0, 0.33, 0.63, 0.97];
    window.scrollTo({ top: scrollY + r.top + total * stops[i] });
  }));
  // slow, endless turn of the basin halo
  if (!reduced()) gsap.to('.sv-halo img', { rotation: 360, duration: 140, ease: 'none', repeat: -1 });
  gsap.to('.sv-halo img', { rotation: '+=40', ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: true } });

  // collection strip: drag to scroll
  const strip = document.querySelector('.sv-strip');
  if (strip) {
    let down = false, x0 = 0, s0 = 0, v = 0, lx = 0;
    strip.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; x0 = lx = e.clientX; s0 = strip.scrollLeft; strip.classList.add('is-drag'); });
    addEventListener('pointermove', (e) => { if (!down) return; strip.scrollLeft = s0 - (e.clientX - x0); v = e.clientX - lx; lx = e.clientX; });
    addEventListener('pointerup', () => { if (!down) return; down = false; strip.classList.remove('is-drag'); gsap.to(strip, { scrollLeft: strip.scrollLeft - v * 14, duration: 1.2, ease: 'power3.out' }); });
    gsap.from('.sv-card', { y: 80, opacity: 0, duration: 1.4, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: strip, start: 'top 85%', once: true } });
  }
  gsap.utils.toArray('.sv-card__spin').forEach((el) => gsap.to(el, { rotation: 360, duration: 90, ease: 'none', repeat: -1 }));
  addEventListener('resize', () => Object.assign(rig.target, mob({ ...proxy })));
}

// safety: never trap the visitor behind the loader
setTimeout(() => ready(), 20000);
