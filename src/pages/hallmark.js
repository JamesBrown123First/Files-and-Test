// HALLMARK — the photograph as an object to inspect: a jeweller's loupe, a turning hallmark seal,
// and a horizontal walk through the details at the photograph's full resolution.
import { boot, gsap, ScrollTrigger, reduced, getState, onState, preloadImages, fine } from '../core/index.js';

const { loader, start } = boot({ id: 'hallmark', kind: 'png', preset: 'blush-atelier' });
const HI = 'assets/img/ewer-2400.webp';
const IMG_W = 1113, IMG_H = 2400;

(async () => {
  await preloadImages(['assets/img/ewer-1400.webp', 'assets/img/basin-1200.webp'], (p) => loader.progress(p * 0.8));
  preloadImages([HI]);
  await document.fonts?.ready;
  loader.done();
  await loader.ready;
  start();
  const R = reduced();
  document.querySelectorAll('.hm-hero [data-split]').forEach((e, i) => setTimeout(() => e._reveal?.(), R ? 0 : 200 + i * 140));
  gsap.fromTo('.hm-ewer', { yPercent: 8, opacity: 0, filter: 'blur(10px)' }, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: R ? 0 : 2.2, ease: 'expo.out', delay: R ? 0 : 0.3 });
  gsap.fromTo('.hm-seal', { scale: 0.7, opacity: 0, rotation: -40 }, { scale: 1, opacity: 1, rotation: 0, duration: R ? 0 : 2.4, ease: 'expo.out', delay: R ? 0 : 0.5 });
  gsap.to('.hm-hero__intro > *', { opacity: 1, y: 0, duration: 1.3, ease: 'power3.out', stagger: 0.08, delay: R ? 0 : 1.1 });
  if (!R) gsap.to('.hm-seal__ring', { rotation: 360, duration: 60, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });
  gsap.to('.hm-ewer', { yPercent: -6, ease: 'none', scrollTrigger: { trigger: '.hm-hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hm-seal', { yPercent: 14, rotation: 30, ease: 'none', scrollTrigger: { trigger: '.hm-hero', start: 'top top', end: 'bottom top', scrub: true } });

  initLoupe();
  initSweep();
  initDetails();
  initStory();
  // basin medallion: lower half, turning with the scroll and slowly on its own
  gsap.fromTo('.hm-basin__img', { rotation: -40 }, { rotation: 60, ease: 'none', scrollTrigger: { trigger: '.hm-basin', start: 'top bottom', end: 'bottom top', scrub: 1 } });
  gsap.fromTo('.hm-basin__wrap', { yPercent: 20 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.hm-basin', start: 'top bottom', end: 'center center', scrub: 1 } });
})();

// Jeweller's loupe: a magnified window onto the full-resolution photograph
function initLoupe() {
  const box = document.querySelector('.hm-ewer');
  const lens = document.querySelector('.hm-loupe');
  const lensImg = lens.querySelector('img');
  const ZOOM = 2.6;
  let on = false, x = 0, y = 0, cx = 0, cy = 0, raf = 0, parked = false;
  const size = () => lens.offsetWidth;
  const place = () => {
    cx += (x - cx) * 0.22; cy += (y - cy) * 0.22;
    const b = box.getBoundingClientRect();
    const D = size();
    const w = b.width * ZOOM, h = b.height * ZOOM;
    lens.style.transform = `translate3d(${cx - D / 2}px, ${cy - D / 2}px, 0) scale(${on ? 1 : 0.4})`;
    lens.style.opacity = on ? 1 : 0;
    lensImg.style.width = w + 'px'; lensImg.style.height = h + 'px';
    lensImg.style.transform = `translate3d(${-((cx - b.left) * ZOOM - D / 2)}px, ${-((cy - b.top) * ZOOM - D / 2)}px, 0)`;
    if (Math.abs(x - cx) > 0.2 || Math.abs(y - cy) > 0.2 || on) raf = requestAnimationFrame(place); else raf = 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(place); };
  const inside = (e) => { const b = box.getBoundingClientRect(); return e.clientX > b.left + b.width * 0.06 && e.clientX < b.right - b.width * 0.04 && e.clientY > b.top && e.clientY < b.bottom; };
  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' && !parked) return;
    const now = inside(e);
    if (now && !on) { cx = e.clientX; cy = e.clientY; }
    on = now; x = e.clientX; y = e.clientY;
    document.documentElement.classList.toggle('hm-inspecting', on);
    kick();
  }, { passive: true });
  addEventListener('scroll', () => { if (on && !parked) { on = false; document.documentElement.classList.remove('hm-inspecting'); kick(); } }, { passive: true });
  // touch: drag the lens over the ewer
  box.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse') return; parked = true; on = true; x = cx = e.clientX; y = cy = e.clientY - 70; kick(); });
  box.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' || !parked) return; x = e.clientX; y = e.clientY - 70; kick(); });
  addEventListener('pointerup', (e) => { if (e.pointerType === 'mouse') return; if (parked) { parked = false; on = false; kick(); } });
}

// A soft band of light passes over the silver, masked to the photograph
function initSweep() {
  const band = document.querySelectorAll('.hm-sweep');
  const sync = (s) => band.forEach((b) => { b.style.setProperty('--sweep', s.shimmer === 'off' ? 0 : s.shimmer === 'bright' ? 0.95 : 0.6); b.dataset.follow = s.follow && fine ? '1' : '0'; });
  sync(getState()); onState(sync);
  if (!reduced()) band.forEach((b, i) => gsap.fromTo(b, { '--p': '-40%' }, { '--p': '140%', duration: 5.5, ease: 'power1.inOut', repeat: -1, repeatDelay: 2.2, delay: 1.5 + i * 0.8 }));
  if (fine) document.querySelector('.hm-ewer').addEventListener('pointermove', (e) => {
    const b = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', ((e.clientX - b.left) / b.width) * 100 + '%');
    e.currentTarget.style.setProperty('--my', ((e.clientY - b.top) / b.height) * 100 + '%');
  });
}

// Horizontal walk through the details, each a circular crop of the photograph
function initDetails() {
  const sec = document.querySelector('.hm-details');
  const track = sec.querySelector('.hm-track');
  const panels = [...track.querySelectorAll('.hm-panel')];
  const crop = () => panels.forEach((p) => {
    const lens = p.querySelector('.hm-lens'); const img = lens.querySelector('img');
    const D = lens.offsetWidth; const z = parseFloat(p.dataset.z); const fx = parseFloat(p.dataset.x), fy = parseFloat(p.dataset.y);
    const w = D * z, h = w * IMG_H / IMG_W;
    Object.assign(img.style, { width: w + 'px', height: h + 'px', transform: `translate(${D / 2 - fx * w}px, ${D / 2 - fy * h}px)` });
  });
  crop(); addEventListener('resize', crop);
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    const dist = () => track.scrollWidth - innerWidth;
    const tween = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true } });
    panels.forEach((p) => {
      gsap.fromTo(p.querySelector('.hm-lens'), { scale: 0.72, rotation: -12 }, { scale: 1, rotation: 0, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left right', end: 'center center', scrub: true } });
      gsap.fromTo(p.querySelector('.hm-lens img'), { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
      gsap.fromTo(p.querySelector('.hm-panel__text'), { opacity: 0, x: 60 }, { opacity: 1, x: 0, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left 80%', end: 'left 35%', scrub: true } });
    });
    const bar = sec.querySelector('.hm-progress i');
    ScrollTrigger.create({ trigger: sec, start: 'top top', end: () => '+=' + dist(), onUpdate: (st) => (bar.style.transform = `scaleX(${st.progress})`) });
  });
}

function initStory() {
  gsap.fromTo('.hm-story__ewer', { rotation: -3 }, { rotation: 3, ease: 'none', scrollTrigger: { trigger: '.hm-story', start: 'top bottom', end: 'bottom top', scrub: true } });
}
