// REGALIA — photograph hero with a cursor-driven light sweep, and a magnifying loupe.
import { boot, gsap, ScrollTrigger, reduced, fine, preloadImages } from '../boot.js';

const { loader, start } = boot({ id: 'regalia', name: 'Regalia', preset: 'blush-atelier', presets: ['blush-atelier', 'peach-salon', 'rose-gold', 'pearl', 'porcelain', 'royal-night'] });

// light sweep: follows the cursor, wanders on its own when idle or on touch
function sheen() {
  const el = document.querySelector('.rg-ewer');
  let target = 30, cur = -20, idle = 0;
  if (fine) addEventListener('pointermove', (e) => { target = (e.clientX / innerWidth) * 120 - 10; idle = 0; }, { passive: true });
  gsap.ticker.add((t, dt) => {
    idle += dt;
    if (!fine || idle > 3500) target = 50 + Math.sin(t * 0.45) * 55;
    if (reduced()) target = 40;
    cur += (target - cur) * 0.06;
    el.style.setProperty('--sx', cur.toFixed(2) + '%');
  });
}

function hero() {
  const still = reduced();
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.fromTo('.rg-word', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: still ? 0.01 : 1.8, ease: 'expo.inOut' })
    .fromTo('.rg-ewer', { yPercent: 14, opacity: 0, scale: 0.94 }, { yPercent: 0, opacity: 1, scale: 1, duration: still ? 0.01 : 2.2 }, still ? 0 : 0.5)
    .fromTo('.rg-h1 > span', { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.1, duration: 1.4 }, still ? 0 : 1)
    .fromTo('.rg-copy .r-label, .rg-copy--r > *, .rg-specs li', { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 1.2 }, still ? 0 : 1.3);
  if (still) return;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    const st = { trigger: '.rg-hero', start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('.rg-word', { scale: 1.18, yPercent: -30, opacity: 0.4, ease: 'none', scrollTrigger: st });
    // scroll drift runs on the ewer's inner layers, not on .rg-ewer itself: the intro animates .rg-ewer, and two
    // animations on the same element made it jump (vanish and return) on the first scroll
    gsap.to('.rg-ewer > *', { yPercent: -8, scale: 0.94, ease: 'none', transformOrigin: '50% 100%', scrollTrigger: st });
    gsap.to('.rg-copy, .rg-specs', { y: -80, opacity: 0, ease: 'none', scrollTrigger: { ...st, end: '60% top' } });
  });
}

// loupe: lens follows the pointer; otherwise rests on the chosen detail
const SPOTS = [[0.47, 0.085], [0.18, 0.235], [0.86, 0.3], [0.5, 0.6], [0.5, 0.91]];
function loupe() {
  const stage = document.querySelector('.rg-loupe__stage'), lens = stage.querySelector('.rg-lens'), inner = lens.querySelector('span'), img = stage.querySelector('img');
  const btns = [...document.querySelectorAll('[data-spot]')];
  let active = 0, hover = false, px = 0, py = 0, cx = 0, cy = 0;
  const ZOOM = 2.8;
  const rectOf = () => {
    // the drawn image box inside object-fit:contain
    const r = img.getBoundingClientRect(), s = stage.getBoundingClientRect();
    const ar = 1113 / 2400, w = Math.min(r.width, r.height * ar), h = w / ar;
    return { x: r.left - s.left + (r.width - w) / 2, y: r.top - s.top + (r.height - h) / 2, w, h };
  };
  const toSpot = (i) => { const b = rectOf(); px = b.x + SPOTS[i][0] * b.w; py = b.y + SPOTS[i][1] * b.h; };
  const select = (i) => { active = i; btns.forEach((b, k) => b.classList.toggle('is-on', k === i)); if (!hover) toSpot(i); };
  btns.forEach((b, i) => { b.addEventListener('click', () => select(i)); b.addEventListener('pointerenter', () => fine && select(i)); });
  stage.addEventListener('pointermove', (e) => { if (e.pointerType !== 'mouse') return; hover = true; const s = stage.getBoundingClientRect(); px = e.clientX - s.left; py = e.clientY - s.top; });
  stage.addEventListener('pointerleave', () => { hover = false; toSpot(active); });
  stage.addEventListener('click', (e) => {
    // tap: jump to the nearest detail
    const s = stage.getBoundingClientRect(), b = rectOf(); const x = (e.clientX - s.left - b.x) / b.w, y = (e.clientY - s.top - b.y) / b.h;
    let best = 0, d = 9; SPOTS.forEach(([sx, sy], i) => { const dd = (sx - x) ** 2 + (sy - y) ** 2; if (dd < d) { d = dd; best = i; } }); select(best);
  });
  toSpot(0); cx = px; cy = py;
  addEventListener('resize', () => !hover && toSpot(active));
  gsap.ticker.add(() => {
    const k = reduced() ? 1 : 0.14;
    cx += (px - cx) * k; cy += (py - cy) * k;
    const L = lens.offsetWidth, b = rectOf();
    lens.style.transform = `translate3d(${cx - L / 2}px,${cy - L / 2}px,0)`;
    const bw = b.w * ZOOM, bh = b.h * ZOOM;
    inner.style.backgroundSize = `${bw}px ${bh}px`;
    inner.style.backgroundPosition = `${-((cx - b.x) * ZOOM - L / 2)}px ${-((cy - b.y) * ZOOM - L / 2)}px`;
  });
}

preloadImages(['assets/img/ewer-2400.webp'], (p) => loader.progress(p)).then(async () => {
  sheen(); loupe();
  await loader.finish();
  hero();
  await start();
});
