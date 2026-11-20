// DIPTYCH — ewer and basin in two arches; scrolling closes them into one, revealing the pair together.
import { boot, gsap, ScrollTrigger, reduced, preloadImages, getLenis } from '../boot.js';
import { sheen, trackPointer, pointer } from '../fx.js';

const { loader, start } = boot({ id: 'diptych', name: 'Diptych', preset: 'diptych', presets: ['diptych', 'apricot-soft', 'blush-atelier', 'champagne', 'sapphire-velvet', 'regal-salon'] });

// the basin turns slowly forever; scrolling and the cursor nudge it
function basin() {
  const img = document.querySelector('.dp-basin img');
  trackPointer();
  let a = 0, v = 0, lastY = scrollY;
  gsap.ticker.add((t, dt) => {
    const still = reduced();
    const sv = (scrollY - lastY); lastY = scrollY;
    v += (sv * 0.02 - v) * 0.08;
    a += still ? 0 : (dt / 1000) * 4 + v + pointer.vx * 6;
    img.style.transform = `rotate(${a.toFixed(3)}deg)`;
  });
}

function intro() {
  const still = reduced(), d = (v) => (still ? 0.01 : v);
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.fromTo('.dp-word', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: d(1.8), ease: 'expo.inOut' })
    .fromTo('.dp-panel', { yPercent: 100 }, { yPercent: 0, duration: d(2), stagger: 0.14, ease: 'expo.inOut' }, d(0.3))
    .fromTo('.dp-ewer, .dp-basin', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: d(2), stagger: 0.12 }, d(1.4))
    .fromTo('.dp-cap', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: d(1), stagger: 0.1 }, d(1.9))
    .fromTo('.dp-h1 > span', { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.1, duration: d(1.4) }, d(1.6))
    .fromTo('.dp-title .r-label, .dp-foot > *', { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: d(1.2) }, d(1.9));
}

function merge() {
  if (reduced()) return;
  const panels = document.querySelector('.dp-panels');
  const mob = matchMedia('(max-width: 900px)').matches;
  const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.dp-hero', start: 'top top', end: 'bottom bottom', scrub: 0.7,
    onUpdate: (s) => panels.classList.toggle('is-merging', s.progress > 0.04) } });
  tl.to('.dp-title, .dp-foot', { opacity: 0, y: -30, duration: 0.12 }, 0)
    .to('.dp-cap', { opacity: 0, duration: 0.1 }, 0.05)
    .to('.dp-panel', { flexGrow: 1, duration: 0.05 }, 0)
    .to(panels, { '--gap': '0px', duration: 0.3, ease: 'power2.inOut' }, 0.08)
    .to('.dp-panel--l', { borderTopRightRadius: 0, duration: 0.3, ease: 'power2.inOut' }, 0.08)
    .to('.dp-panel--r', { borderTopLeftRadius: 0, duration: 0.3, ease: 'power2.inOut' }, 0.08)
    .fromTo('.dp-pair', { opacity: 0, visibility: 'hidden' }, { opacity: 1, visibility: 'visible', duration: 0.18 }, 0.4)
    .to('.dp-pair img', { scale: 1, duration: 0.5 }, 0.4)
    .to('.dp-word', { yPercent: -40, opacity: 0.3, duration: 0.5 }, 0.2)
    .to(panels, mob ? { scale: 0.86, yPercent: -6, duration: 0.3 } : { x: () => -innerWidth * 0.2, scale: 0.9, transformOrigin: '50% 100%', duration: 0.3, ease: 'power2.inOut' }, 0.6)
    .fromTo('.dp-set', { opacity: 0, visibility: 'hidden', y: 30 }, { opacity: 1, visibility: 'visible', y: 0, duration: 0.15 }, 0.75)
    .to({}, { duration: 0.1 });
}

preloadImages(['assets/img/ewer-2400.webp', 'assets/img/basin-1200.webp'], (p) => loader.progress(p)).then(async () => {
  sheen(document.querySelector('.dp-panel--l'));
  basin();
  await loader.finish();
  intro();
  await start();
  merge();
  ScrollTrigger.refresh();
});
