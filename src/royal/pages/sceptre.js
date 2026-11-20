// SCEPTRE — Art Deco sunburst; giant words drift behind and in front of the ewer, pushed by your scroll.
import { boot, gsap, ScrollTrigger, reduced, preloadImages } from '../boot.js';
import { sheen, trackPointer, pointer } from '../fx.js';

const { loader, start } = boot({ id: 'sceptre', name: 'Sceptre', preset: 'sceptre', presets: ['sceptre', 'deco-night', 'throne-room', 'sapphire-velvet', 'copper-night', 'deco-blush', 'silver-mist'] });

function kinetic() {
  const rows = [...document.querySelectorAll('.sc-row > div')].map((el, i) => ({ el, dir: i === 1 ? 1 : -1, speed: [18, 13, 24][i], x: -Math.random() * 400 }));
  const rays = document.querySelector('.sc-fan__rays');
  trackPointer();
  let lastY = scrollY, boost = 0;
  gsap.ticker.add((t, dt) => {
    const still = reduced();
    const dy = scrollY - lastY; lastY = scrollY;
    boost += (dy * 0.6 - boost) * 0.1;
    rows.forEach((r) => {
      const w = r.el.scrollWidth / 4; // one repeat
      r.x += still ? 0 : r.dir * (r.speed * dt / 1000 + Math.abs(boost) * 0.35) * (boost < 0 ? -1 : 1);
      if (r.x < -w) r.x += w; if (r.x > 0) r.x -= w;
      r.el.style.transform = `translate3d(${r.x.toFixed(1)}px,0,0)`;
    });
    if (!still) rays.style.transform = `rotate(${(Math.sin(t * 0.08) * 4 + pointer.x * 3).toFixed(3)}deg)`;
  });
}

function intro() {
  const still = reduced(), d = (v) => (still ? 0.01 : v);
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.fromTo('.sc-fan', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: d(2.6) })
    .fromTo('.sc-row', { opacity: 0, yPercent: 40 }, { opacity: 1, yPercent: 0, stagger: 0.12, duration: d(1.8) }, d(0.3))
    .fromTo('.sc-ewer', { yPercent: 16, opacity: 0 }, { yPercent: 0, opacity: 1, duration: d(2.2) }, d(0.6))
    .fromTo('.sc-h1 > span', { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.1, duration: d(1.4) }, d(1.2))
    .fromTo('.sc-copy .r-label, .sc-cta > *, .sc-marks li', { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07, duration: d(1.2) }, d(1.4));
}

function scrolling() {
  if (!reduced()) {
    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.sc-hero', start: 'top top', end: 'bottom bottom', scrub: 0.6 } });
    tl.to('.sc-copy, .sc-cta, .sc-marks', { opacity: 0, y: -30, duration: 0.25 }, 0)
      .to('.sc-ewer', { scale: 0.82, yPercent: -6, duration: 1 }, 0)
      .to('.sc-row--a', { yPercent: -60, duration: 1 }, 0)
      .to('.sc-row--c', { yPercent: 60, duration: 1 }, 0)
      .to('.sc-fan', { scale: 1.3, opacity: 0.4, duration: 1 }, 0);
  }
  document.querySelectorAll('.sc-card').forEach((c, i) => {
    gsap.fromTo(c, { rotateX: reduced() ? 0 : -24, y: 60, opacity: 0 }, { rotateX: 0, y: 0, opacity: 1, duration: 1.4, ease: 'expo.out', delay: i * 0.1, scrollTrigger: { trigger: '.sc-cards', start: 'top 82%' } });
    gsap.to(c.querySelectorAll('.sc-card__frame path'), { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut', delay: 0.3 + i * 0.1, stagger: 0.2, scrollTrigger: { trigger: '.sc-cards', start: 'top 82%' } });
  });
}

preloadImages(['assets/img/ewer-2400.webp'], (p) => loader.progress(p)).then(async () => {
  sheen(document.querySelector('.sc-ewer'));
  kinetic();
  await loader.finish();
  intro();
  await start();
  scrolling();
  ScrollTrigger.refresh();
});
