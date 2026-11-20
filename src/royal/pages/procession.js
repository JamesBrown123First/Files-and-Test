// PROCESSION — the page opens inside the engraving at 320%; scrolling pulls back to reveal
// the whole ewer framed in a castle arch, which then steps aside for the headline.
import { boot, gsap, ScrollTrigger, reduced, preloadImages } from '../boot.js';

const { loader, start } = boot({ id: 'procession', name: 'Procession', preset: 'coronation', presets: ['coronation', 'ink-copper', 'royal-night', 'dusk-rose', 'rose-gold', 'starlit'] });

function hero() {
  const arch = document.querySelector('.pr-arch'), img = document.querySelector('.pr-img');
  const zoomN = document.querySelector('.pr-zoom__n'), side = document.querySelector('.pr-side');
  const words = [...document.querySelectorAll('.pr-word')];
  const st = { z: 3.2 };
  const apply = () => { img.style.setProperty('--z', st.z.toFixed(3)); zoomN.textContent = Math.round(st.z * 100); };
  gsap.fromTo(img, { opacity: 0 }, { opacity: 1, duration: 1.6, ease: 'power2.out' });
  gsap.fromTo(words[0], { opacity: 0, yPercent: -30 }, { opacity: 1, yPercent: -50, duration: 1.4, ease: 'expo.out', delay: 0.3 });
  const mm = gsap.matchMedia();
  mm.add({ desk: '(min-width: 901px)', mob: '(max-width: 900px)' }, (ctx) => {
    const desk = ctx.conditions.desk;
    const W = desk ? 'min(36vw, 50vh)' : '72vw', H = desk ? 'min(80vh, 860px)' : '56vh';
    if (reduced()) {
      st.z = 1; apply(); gsap.set(arch, { width: W, height: H, '--rad': '999px', x: desk ? '22vw' : 0, yPercent: desk ? -50 : -64, xPercent: -50 }); gsap.set(arch, { '--ring': 0.8 });
      gsap.set(words, { opacity: 0 }); gsap.set(side, { opacity: 1 }); side.classList.add('is-on'); gsap.set('.pr-scroll', { opacity: 0 });
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.pr-hero', start: 'top top', end: 'bottom bottom', scrub: 0.8,
      onUpdate: (s) => side.classList.toggle('is-on', s.progress > 0.85) } });
    tl.to('.pr-scroll', { opacity: 0, duration: 0.05 }, 0)
      .to(words[0], { opacity: 0, yPercent: -70, duration: 0.08 }, 0.08)
      .fromTo(words[1], { opacity: 0, yPercent: -30 }, { opacity: 1, yPercent: -50, duration: 0.08 }, 0.14)
      .to(words[1], { opacity: 0, yPercent: -70, duration: 0.08 }, 0.26)
      .fromTo(words[2], { opacity: 0, yPercent: -30 }, { opacity: 1, yPercent: -50, duration: 0.08 }, 0.32)
      .to(words[2], { opacity: 0, yPercent: -70, duration: 0.08 }, 0.44)
      .to(st, { z: 1, duration: 0.5, ease: 'power2.inOut', onUpdate: apply }, 0.05)
      .to(arch, { width: W, height: H, '--rad': '999px', duration: 0.35, ease: 'power2.inOut' }, 0.3)
      .to(arch, { '--ring': 0.8, duration: 0.2 }, 0.55)
      .to(arch, { x: desk ? '22vw' : 0, yPercent: desk ? -50 : -64, duration: 0.2, ease: 'power2.inOut' }, 0.72)
      .fromTo(side, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.14 }, 0.8)
      .to({}, { duration: 0.06 }, 0.94);
    return () => tl.kill();
  });
  apply();
}

preloadImages(['assets/img/ewer-2400.webp'], (p) => loader.progress(p)).then(async () => {
  await loader.finish();
  hero();
  await start();
});
