// LUMIÈRE — a pool of light follows the cursor across the dark silver; scrolling lights the room.
import { boot, gsap, ScrollTrigger, reduced, fine, preloadImages } from '../boot.js';

const { loader, start } = boot({ id: 'lumiere', name: 'Lumière', preset: 'starlit', presets: ['starlit', 'royal-night', 'guilloche', 'dusk-rose', 'brand-book', 'ink-copper'] });

function light() {
  const stage = document.querySelector('.lu-stage'), lit = stage.querySelector('.lu-lit');
  const s = { x: innerWidth * 0.5, y: innerHeight * 0.3, tx: innerWidth * 0.5, ty: innerHeight * 0.3, r: 0, open: 0 };
  let idle = 9999, t0 = 0;
  if (fine) addEventListener('pointermove', (e) => { s.tx = e.clientX; s.ty = e.clientY; idle = 0; }, { passive: true });
  ScrollTrigger.create({ trigger: '.lu-hero', start: 'top top', end: 'bottom top', scrub: true, onUpdate: (st) => (s.open = st.progress) });
  gsap.ticker.add((t, dt) => {
    idle += dt;
    const r = lit.getBoundingClientRect();
    if (idle > 2500 || reduced()) {
      // wander over the silver: stopper → body → base, slowly
      const k = reduced() ? 0 : t * 0.22;
      s.tx = r.left + r.width * (0.5 + 0.32 * Math.sin(k * 1.3));
      s.ty = r.top + r.height * (0.42 + 0.34 * Math.sin(k * 0.8));
    }
    t0 += (s.open - t0) * 0.1;
    const base = Math.min(innerWidth, innerHeight) * (fine ? 0.24 : 0.3);
    const rad = base + t0 * Math.max(innerWidth, innerHeight) * 1.2;
    s.x += (s.tx - s.x) * 0.08; s.y += (s.ty - s.y) * 0.08;
    stage.style.setProperty('--lx', s.x + 'px'); stage.style.setProperty('--ly', s.y + 'px'); stage.style.setProperty('--r', rad.toFixed(1) + 'px');
    lit.style.setProperty('--mx', (s.x - r.left) + 'px'); lit.style.setProperty('--my', (s.y - r.top) + 'px');
  });
}

function hero() {
  const still = reduced();
  gsap.fromTo('.lu-stage img', { opacity: 0, scale: 0.97 }, { opacity: (i) => (i === 0 ? 0.9 : 1), scale: 1, duration: still ? 0.01 : 2.4, ease: 'power2.out' });
  gsap.fromTo('.lu-h1 > span', { yPercent: 80, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.6, ease: 'expo.out', stagger: 0.12, delay: still ? 0 : 0.6 });
  gsap.fromTo('.lu-copy__row > *, .lu-hint', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', stagger: 0.1, delay: still ? 0 : 1.2 });
  if (still) return;
  gsap.to('.lu-copy', { y: -60, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.lu-hero', start: '10% top', end: '45% top', scrub: true } });
  gsap.to('.lu-hint', { opacity: 0, ease: 'none', scrollTrigger: { trigger: '.lu-hero', start: 'top top', end: '15% top', scrub: true } });
}

preloadImages(['assets/img/ewer-2400.webp'], (p) => loader.progress(p)).then(async () => {
  light();
  await loader.finish();
  hero();
  await start();
});
