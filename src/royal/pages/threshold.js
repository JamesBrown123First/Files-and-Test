// THRESHOLD — the doors of the castle arch swing open on the ewer; scrolling walks you through.
import { boot, gsap, ScrollTrigger, reduced, preloadImages } from '../boot.js';
import { sheen, trackPointer, pointer } from '../fx.js';

const { loader, start } = boot({ id: 'threshold', name: 'Threshold', preset: 'throne-room', presets: ['throne-room', 'velvet-regent', 'regal-salon', 'royal-tide', 'sapphire-velvet', 'apricot-court'] });

function light() {
  sheen(document.querySelector('.th-ewer'));
  trackPointer();
  const word = document.querySelector('.th-word i'), glow = document.querySelector('.th-arch__glow');
  gsap.ticker.add((t) => {
    word.style.setProperty('--wx', (50 + pointer.x * 40 + Math.sin(t * 0.25) * 8).toFixed(2) + '%');
    glow.style.transform = `translate(${(pointer.x * 4).toFixed(2)}%, ${(pointer.y * 2).toFixed(2)}%)`;
  });
}

function intro() {
  const still = reduced();
  const d = (v) => (still ? 0.01 : v);
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.fromTo('.th-arch__line path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d(2.2), ease: 'power2.inOut', stagger: 0.25 })
    .fromTo('.th-word', { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: d(2.4) }, 0.2)
    .fromTo('.th-door', { '--seam': 0.2 }, { '--seam': 1, duration: d(0.9), ease: 'power2.in' }, d(0.6))
    .to('.th-door--l', { rotateY: -104, duration: d(2.6), ease: 'power3.inOut' }, d(1.3))
    .to('.th-door--r', { rotateY: 104, duration: d(2.6), ease: 'power3.inOut' }, d(1.3))
    .to('.th-arch__glow', { opacity: 1, duration: d(2.4), ease: 'power2.out' }, d(1.6))
    .fromTo('.th-ewer', { opacity: 0, scale: 0.94, yPercent: 3 }, { opacity: 1, scale: 1, yPercent: 0, duration: d(2.6) }, d(1.8))
    .fromTo('.th-h1 > span', { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.1, duration: d(1.4) }, d(2.4))
    .fromTo('.th-copy .r-label, .th-copy--r > *, .th-scroll', { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: d(1.2) }, d(2.7));
  return tl;
}

function walkIn() {
  if (reduced()) { gsap.set('.th-inside', { opacity: 1, visibility: 'visible', position: 'relative' }); return; }
  const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.th-hero', start: 'top top', end: 'bottom bottom', scrub: 0.6 } });
  tl.to('.th-copy, .th-scroll', { opacity: 0, y: -40, duration: 0.15 }, 0)
    .to('.th-word', { scale: 1.5, opacity: 0, duration: 0.45, ease: 'power1.in' }, 0)
    .to('.th-portal', { scale: () => Math.max(innerWidth / document.querySelector('.th-portal').offsetWidth, innerHeight / document.querySelector('.th-portal').offsetHeight) * 2.6, yPercent: 8, duration: 0.6, ease: 'power2.in' }, 0.05)
    .to('.th-ewer', { opacity: 0, scale: 1.08, duration: 0.25, ease: 'power1.in' }, 0.35)
    .to('.th-arch__line', { opacity: 0, duration: 0.15 }, 0.3)
    .fromTo('.th-inside', { opacity: 0, visibility: 'hidden', y: 40 }, { opacity: 1, visibility: 'visible', y: 0, duration: 0.18 }, 0.62)
    .fromTo('.th-inside__big', { '--p': 0 }, { '--p': 1, duration: 0.2 }, 0.66)
    .to({}, { duration: 0.14 });
}

preloadImages(['assets/img/ewer-2400.webp'], (p) => loader.progress(p)).then(async () => {
  light();
  await loader.finish();
  intro();
  await start();
  walkIn();
  ScrollTrigger.refresh();
});
