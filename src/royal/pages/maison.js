// MAISON — a couture cover, then a lookbook whose lens travels over the ewer as you read.
import { boot, gsap, ScrollTrigger, reduced, preloadImages } from '../boot.js';
import { sheen, tilt3d } from '../fx.js';

const { loader, start } = boot({ id: 'maison', name: 'Maison', preset: 'maison-ivory', presets: ['maison-ivory', 'champagne', 'silver-mist', 'deco-blush', 'copper-night', 'twilight-play'] });

function cover() {
  const still = reduced(), d = (v) => (still ? 0.01 : v);
  const ewer = document.querySelector('.ma-ewer');
  sheen(ewer);
  if (!still && matchMedia('(pointer:fine)').matches) tilt3d(ewer.querySelector('.ma-ewer__img'), 4);
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.fromTo('.ma-mast', { clipPath: 'inset(0 0 100% 0)', y: 30 }, { clipPath: 'inset(0 0 0% 0)', y: 0, duration: d(1.8), ease: 'expo.inOut' })
    .fromTo('.ma-bar', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: d(1.4), ease: 'expo.inOut' }, d(0.5))
    .fromTo('.ma-disc', { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: d(2.2) }, d(0.6))
    .fromTo(ewer, { yPercent: 12, opacity: 0 }, { yPercent: 0, opacity: 1, duration: d(2.2) }, d(0.8))
    .fromTo('.ma-h1 > span', { yPercent: 80, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.1, duration: d(1.4) }, d(1.2))
    .fromTo('.ma-feature > :not(h1), .ma-lines li, .ma-seal', { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07, duration: d(1.2) }, d(1.4));
  if (still) return;
  const st = { trigger: '.ma-cover', start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('.ma-mast', { yPercent: 30, ease: 'none', scrollTrigger: st });
  gsap.to(ewer, { yPercent: -10, ease: 'none', scrollTrigger: st });
  gsap.to('.ma-disc', { scale: 1.25, opacity: 0.4, ease: 'none', scrollTrigger: st });
}

const SPOTS = [[0.47, 0.085], [0.18, 0.235], [0.86, 0.3], [0.5, 0.6], [0.5, 0.91]];
const ROMAN = ['I', 'II', 'III', 'IV', 'V'];
function lookbook() {
  const frame = document.querySelector('.ma-look__frame'), img = frame.querySelector('img');
  const num = document.querySelector('.ma-look__num span'), cap = document.querySelector('.ma-look__cap b');
  const chs = [...document.querySelectorAll('.ma-ch')];
  img.style.left = '0'; img.style.top = '0';
  const lens = { sx: 0.5, sy: 0.5, z: 1 };
  const draw = () => {
    const W = frame.clientWidth, H = frame.clientHeight, h0 = H * 0.88, w0 = h0 * (1113 / 2400);
    const z = lens.z, x = W / 2 - lens.sx * w0 * z, y = H / 2 - lens.sy * h0 * z;
    img.style.transform = `translate3d(${x}px,${y}px,0) scale(${z})`;
  };
  gsap.ticker.add(draw);
  let cur = -2;
  const go = (i) => {
    if (i === cur) return; cur = i;
    chs.forEach((c, k) => c.classList.toggle('is-on', k === i));
    const [sx, sy] = i < 0 ? [0.5, 0.5] : SPOTS[i];
    gsap.to(lens, { sx, sy, z: i < 0 ? 1 : 2.5, duration: reduced() ? 0.01 : 1.6, ease: 'power3.inOut', overwrite: true });
    const label = i < 0 ? 'I' : ROMAN[i];
    if (num.textContent !== label) gsap.fromTo(num, { yPercent: 100 }, { yPercent: 0, duration: 0.9, ease: 'expo.out', onStart: () => (num.textContent = label) });
    cap.textContent = String(Math.max(0, i) + 1).padStart(2, '0');
  };
  go(-1);
  // the chapter nearest the middle of the screen is the one in focus
  const pick = () => {
    const mid = innerHeight * 0.55; let best = -1, bd = 1e9;
    chs.forEach((c, i) => { const r = c.getBoundingClientRect(); const cy = r.top + r.height / 2; const dd = Math.abs(cy - mid); if (r.top < innerHeight * 0.8 && dd < bd) { bd = dd; best = i; } });
    go(best);
  };
  ScrollTrigger.create({ trigger: '.ma-look', start: 'top bottom', end: 'bottom top', onUpdate: pick, onRefresh: pick });
}

preloadImages(['assets/img/ewer-2400.webp'], (p) => loader.progress(p)).then(async () => {
  await loader.finish();
  cover();
  await start();
  lookbook();
  ScrollTrigger.refresh();
});
