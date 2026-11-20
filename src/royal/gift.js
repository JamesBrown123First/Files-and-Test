// The gift box opens as you scroll: lid lifts away, the ewer rises, the card slides in.
import { gsap, reduced } from './ui.js';

export function initGift() {
  document.querySelectorAll('.r-gift').forEach((sec) => {
    const steps = sec.querySelectorAll('.r-gift__steps li');
    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px)', () => {
      const lid = sec.querySelector('.r-box__lid'), piece = sec.querySelector('.r-box__piece'), card = sec.querySelector('.r-box__card'), box = sec.querySelector('.r-box');
      if (reduced()) { gsap.set(lid, { yPercent: -160, rotateX: -40 }); gsap.set(piece, { opacity: 1, yPercent: -55 }); gsap.set(card, { opacity: 1, y: 0, rotate: 6 }); steps.forEach((s) => s.classList.add('is-on')); return; }
      const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 0.8,
        onUpdate: (st) => { const i = Math.min(steps.length - 1, Math.floor(st.progress * steps.length * 0.999)); steps.forEach((s, k) => s.classList.toggle('is-on', k <= i)); } } });
      tl.to(box, { rotateY: -8, rotateX: 10, duration: 1 }, 0)
        .to(lid, { yPercent: -340, rotateX: -50, x: '70%', rotateZ: 22, duration: 1.2, ease: 'power2.inOut' }, 0.2)
        .to(lid, { opacity: 0, duration: 0.4 }, 1.0)
        .fromTo(piece, { opacity: 0, yPercent: 20 }, { opacity: 1, yPercent: -62, duration: 1.4, ease: 'power2.out' }, 0.7)
        .fromTo(card, { opacity: 0, y: 80, rotate: 18 }, { opacity: 1, y: 0, rotate: 6, duration: 1, ease: 'power3.out' }, 1.5)
        .to(box, { rotateY: -22, duration: 1 }, 1.6);
      return () => tl.kill();
    });
  });
}
