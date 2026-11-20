// FILLED — an engraving of the ewer fills with silver as you scroll; the surface sloshes with your movement.
import { boot, gsap, ScrollTrigger, reduced, preloadImages } from '../boot.js';
import { sheen, trackPointer, pointer } from '../fx.js';

const { loader, start } = boot({ id: 'filled', name: 'Filled', preset: 'filled', presets: ['filled', 'twilight-play', 'twilight', 'royal-tide', 'copper-night', 'champagne', 'apricot-soft'] });

const S = { intro: 0, scroll: 0, level: 0, tilt: 0, tv: 0, full: false };
const N = 28;

function liquid() {
  const vessel = document.querySelector('.fi-vessel'), silver = vessel.querySelector('.fi-silver');
  const paths = [...vessel.querySelectorAll('.fi-line path')];
  const num = document.querySelector('.fi-gauge__n'), bar = document.querySelector('.fi-gauge b');
  const kick = [...document.querySelectorAll('.fi-kicker span')];
  sheen(vessel); trackPointer();
  let lastY = scrollY, shown = -1;
  gsap.ticker.add((time) => {
    const still = reduced();
    const target = Math.max(S.intro, S.scroll);
    S.level += (target - S.level) * (still ? 1 : 0.07);
    // slosh: a damped spring pushed by scrolling and by the cursor
    const dy = scrollY - lastY; lastY = scrollY;
    const force = still ? 0 : gsap.utils.clamp(-0.01, 0.01, dy * 0.00025) + pointer.vx * 0.35;
    S.tv += -S.tilt * 0.05 - S.tv * 0.09 + force;
    S.tilt = gsap.utils.clamp(-0.07, 0.07, S.tilt + S.tv);
    const L = S.level, base = (1 - L) * 1.05 - 0.025;
    const amp = still ? 0 : 0.004 + Math.min(0.012, Math.abs(S.tv) * 0.6);
    const t = time;
    let poly = '', d = '';
    for (let i = 0; i <= N; i++) {
      const x = i / N;
      const y = base + amp * Math.sin(x * 9 + t * 1.6) + amp * 0.6 * Math.sin(x * 17 - t * 2.3) + S.tilt * (x - 0.5);
      poly += `${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%,`;
      d += `${i ? 'L' : 'M'}${(x * 100).toFixed(2)},${(y * 100).toFixed(2)}`;
    }
    silver.style.clipPath = `polygon(${poly}100% 100%,0% 100%)`;
    const vis = L > 0.005 && L < 0.995 ? d : '';
    paths.forEach((p) => p.setAttribute('d', vis));
    const pct = Math.round(L * 100);
    if (pct !== shown) { shown = pct; num.textContent = String(pct).padStart(3, '0'); bar.style.transform = `scaleY(${L})`; }
    const full = L > 0.985;
    if (full !== S.full) {
      S.full = full;
      kick.forEach((k, i) => k.classList.toggle('is-on', full ? i === 1 : i === 0));
      if (full && !still) gsap.fromTo(vessel, { '--fx': '-30%' }, { '--fx': '130%', duration: 1.6, ease: 'power2.inOut' });
    }
  });
}

function intro() {
  const still = reduced(), d = (v) => (still ? 0.01 : v);
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.fromTo('.fi-word', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: d(1.8), ease: 'expo.inOut' })
    .fromTo('.fi-etch', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: d(2.6), ease: 'power2.inOut' }, d(0.2))
    .to(S, { intro: 0.2, duration: d(2.6), ease: 'power2.inOut' }, d(1.4))
    .fromTo('.fi-h1 > span', { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.1, duration: d(1.4) }, d(1.2))
    .fromTo('.fi-kicker, .fi-copy__row, .fi-gauge, .fi-hint', { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: d(1.2) }, d(1.5));
}

function fill() {
  ScrollTrigger.create({ trigger: '.fi-hero', start: 'top top', end: 'bottom bottom', onUpdate: (s) => { S.scroll = 0.2 + 0.8 * gsap.utils.clamp(0, 1, s.progress / 0.78); } });
  if (!reduced()) gsap.to('.fi-word', { scale: 1.12, opacity: 0.5, ease: 'none', scrollTrigger: { trigger: '.fi-hero', start: 'top top', end: 'bottom bottom', scrub: true } });
  document.querySelectorAll('.fi-know__list li').forEach((li) => ScrollTrigger.create({ trigger: li, start: 'top 80%', once: true, onEnter: () => li.classList.add('is-in') }));
}

preloadImages(['assets/img/ewer-2400.webp', 'assets/img/ewer-etch.webp'], (p) => loader.progress(p)).then(async () => {
  liquid();
  await loader.finish();
  intro();
  await start();
  fill();
  ScrollTrigger.refresh();
});
