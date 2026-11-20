// EXHIBIT — scroll walks you sideways through a gallery hall.
import { boot, gsap, ScrollTrigger, reduced, preloadImages, split } from '../boot.js';

const { loader, start } = boot({ id: 'exhibit', name: 'Exhibit', preset: 'pearl', presets: ['pearl', 'porcelain', 'blush-atelier', 'guilloche', 'royal-night', 'rose-gold'] });

function hall() {
  const hallEl = document.querySelector('.ex-hall'), track = hallEl.querySelector('.ex-track'), rooms = [...track.children];
  const bar = hallEl.querySelector('.ex-progress b'), num = hallEl.querySelector('.ex-room-n');
  const still = reduced();
  gsap.fromTo('.ex-h1 > span', { yPercent: 80, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.12, duration: 1.6, ease: 'expo.out' });
  gsap.fromTo('.ex-room--title .r-lead, .ex-room--title .r-label, .ex-enter', { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 1.2, ease: 'power3.out', delay: 0.5 });
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    const dist = () => track.scrollWidth - innerWidth;
    const move = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: hallEl, pin: '.ex-pin', start: 'top top', end: () => '+=' + dist(), scrub: still ? true : 0.7, invalidateOnRefresh: true,
      onUpdate: (st) => { bar.style.transform = `scaleX(${st.progress})`; num.textContent = String(Math.min(rooms.length, 1 + Math.floor(st.progress * rooms.length * 0.999))).padStart(2, '0') + ' / ' + String(rooms.length).padStart(2, '0'); } } });
    if (still) return () => move.kill();
    // pieces rise onto their plinths, labels slide in, wall text lights up word by word
    rooms.slice(1).forEach((room) => {
      const piece = room.querySelector('.ex-piece, .ex-frame'), label = room.querySelector('.ex-label');
      if (piece) gsap.fromTo(piece, { y: 60, opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { trigger: room, containerAnimation: move, start: 'left 85%', end: 'left 35%', scrub: true } });
      if (label) gsap.fromTo(label, { x: 80, opacity: 0 }, { x: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { trigger: room, containerAnimation: move, start: 'left 60%', end: 'left 20%', scrub: true } });
    });
    const basin = document.querySelector('.ex-piece--basin');
    gsap.fromTo(basin, { rotate: -30 }, { rotate: 30, ease: 'none', scrollTrigger: { trigger: basin.closest('.ex-room'), containerAnimation: move, start: 'left right', end: 'right left', scrub: true } });
    const words = split(document.querySelector('.ex-wall'));
    gsap.fromTo(words, { opacity: 0.15 }, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: '.ex-room--wall', containerAnimation: move, start: 'left 70%', end: 'right 80%', scrub: true } });
    return () => move.kill();
  });
}

preloadImages(['assets/img/ewer-2400.webp', 'assets/img/basin-1200.webp'], (p) => loader.progress(p)).then(async () => {
  await loader.finish();
  hall();
  await start();
});
