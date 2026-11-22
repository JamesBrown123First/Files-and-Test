// REGALIA II — Regalia, refined to the notes: black & white silver and light, headline over KINGDOM,
// a soft banner, a loupe whose details scroll past while the lens follows your mouse, a basin you turn
// by hand, a Kingdom gift box that opens as you scroll, and the campaign at one height.
import { boot, gsap, ScrollTrigger, reduced, fine, preloadImages, getLenis } from '../boot.js';

const { loader, start } = boot({ id: 'regalia2', name: 'Regalia II', preset: 'blush-atelier', presets: ['blush-atelier', 'peach-salon', 'rose-gold', 'pearl', 'porcelain', 'royal-night'] });
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const smoothTo = (y) => { const L = getLenis(); L ? L.scrollTo(y, { duration: 1.4 }) : scrollTo({ top: y, behavior: 'smooth' }); };

// light sweep across the silver: follows the cursor, wanders on its own when idle or on touch
function sheen() {
  const el = document.querySelector('.rg-ewer');
  let target = 30, cur = -20, idle = 9999;
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
  const still = reduced(), d = still ? 0.01 : 1;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.fromTo('.rg-word', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.8 * d, ease: 'expo.inOut' })
    .fromTo('.rg-ewer', { yPercent: 14, opacity: 0, scale: 0.94 }, { yPercent: 0, opacity: 1, scale: 1, duration: 2.2 * d }, still ? 0 : 0.5)
    .fromTo('.rg2-h1 > span', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 1.4 * d }, still ? 0 : 1)
    .fromTo('.rg-copy--r > *, .rg-specs li', { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 1.2 * d }, still ? 0 : 1.3);
  if (still) return;
  gsap.matchMedia().add('(min-width: 901px)', () => {
    const st = { trigger: '.rg-hero', start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('.rg-word', { scale: 1.12, yPercent: -24, opacity: 0.3, ease: 'none', scrollTrigger: st });
    gsap.to('.rg-ewer', { yPercent: -8, scale: 0.95, ease: 'none', scrollTrigger: st });
    gsap.to('.rg2-h1, .rg-specs, .rg-copy', { y: -80, opacity: 0, ease: 'none', scrollTrigger: { ...st, end: '55% top' } });
  });
}

// loupe: the lens follows your mouse over the ewer; otherwise it rests on the detail you're reading
const SPOTS = [[0.47, 0.085], [0.18, 0.235], [0.8, 0.31], [0.5, 0.6], [0.5, 0.91]];
function loupe() {
  const stage = document.querySelector('.rg2-loupe .rg-loupe__stage'), lens = stage.querySelector('.rg-lens'), inner = lens.querySelector('span'), img = stage.querySelector('img');
  const dets = [...document.querySelectorAll('.rg2-det')];
  let active = 0, hover = false, px = 0, py = 0, cx = 0, cy = 0, first = true;
  const ZOOM = 2.8;
  const rectOf = () => {
    const r = img.getBoundingClientRect(), s = stage.getBoundingClientRect();
    const ar = 649 / 1400, w = Math.min(r.width, r.height * ar), h = w / ar;
    return { x: r.left - s.left + (r.width - w) / 2, y: r.top - s.top + (r.height - h) / 2, w, h };
  };
  const toSpot = (i) => { const b = rectOf(); px = b.x + SPOTS[i][0] * b.w; py = b.y + SPOTS[i][1] * b.h; };
  const select = (i) => { active = i; dets.forEach((d, k) => d.classList.toggle('is-on', k === i)); };
  dets.forEach((d, i) => ScrollTrigger.create({ trigger: d, start: 'top 60%', end: 'bottom 60%', onToggle: (s) => s.isActive && select(i) }));
  dets.forEach((d, i) => d.addEventListener('click', () => select(i)));
  stage.addEventListener('pointermove', (e) => { if (e.pointerType !== 'mouse') return; hover = true; const s = stage.getBoundingClientRect(); px = e.clientX - s.left; py = e.clientY - s.top; });
  stage.addEventListener('pointerleave', () => (hover = false));
  stage.addEventListener('click', (e) => {
    const s = stage.getBoundingClientRect(), b = rectOf(); const x = (e.clientX - s.left - b.x) / b.w, y = (e.clientY - s.top - b.y) / b.h;
    let best = 0, dd = 9; SPOTS.forEach(([sx, sy], i) => { const q = (sx - x) ** 2 + (sy - y) ** 2; if (q < dd) { dd = q; best = i; } }); select(best);
  });
  gsap.ticker.add(() => {
    if (!hover) toSpot(active);
    if (first) { cx = px; cy = py; first = false; }
    const k = reduced() ? 1 : 0.14;
    cx += (px - cx) * k; cy += (py - cy) * k;
    const L = lens.offsetWidth, b = rectOf();
    lens.style.transform = `translate3d(${cx - L / 2}px,${cy - L / 2}px,0)`;
    inner.style.backgroundSize = `${b.w * ZOOM}px ${b.h * ZOOM}px`;
    inner.style.backgroundPosition = `${-((cx - b.x) * ZOOM - L / 2)}px ${-((cy - b.y) * ZOOM - L / 2)}px`;
  });
}

// hallmark: drag to turn the basin; it keeps turning with your momentum, then idles slowly
function basin() {
  const sec = document.querySelector('.rg2-hall'), el = sec.querySelector('.rg2-basin');
  let ang = 0, vel = 0, down = false, last = 0, lastT = 0, visible = false;
  const angleAt = (e) => { const r = el.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI; };
  el.addEventListener('pointerdown', (e) => { down = true; last = angleAt(e); lastT = performance.now(); vel = 0; el.setPointerCapture(e.pointerId); el.classList.add('is-drag'); sec.classList.add('was-turned'); });
  el.addEventListener('pointermove', (e) => {
    if (!down) return; const a = angleAt(e); let d = a - last; if (d > 180) d -= 360; if (d < -180) d += 360;
    const now = performance.now(); ang += d; vel = (d / Math.max(8, now - lastT)) * 16; last = a; lastT = now;
  });
  const up = () => { down = false; el.classList.remove('is-drag'); };
  el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  el.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') vel -= 5; if (e.key === 'ArrowRight') vel += 5; });
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(sec);
  gsap.ticker.add((t, dt) => {
    if (!visible) return;
    if (!down) { vel *= 0.955; ang += vel + (reduced() ? 0 : 0.008 * dt); }
    el.style.setProperty('--a', ang.toFixed(2) + 'deg');
    el.style.setProperty('--la', (-ang).toFixed(2) + 'deg');
  });
}

// gift: scroll opens the box step by step; the steps on the left follow, and each one can be clicked
function gift() {
  const sec = document.querySelector('.rg2-gift'), steps = [...sec.querySelectorAll('.rg2-steps li')];
  const lid = sec.querySelector('.g2-lid'), piece = sec.querySelector('.g2-piece'), tissue = sec.querySelector('.g2-tissue'), card = sec.querySelector('.g2-card'), bow = sec.querySelector('.g2-bow');
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' } });
  tl.to(lid, { yPercent: -230, rotate: -7, x: '-8%', duration: 1 }, 0)            // 01 the lid lifts
    .to(piece, { yPercent: -100, duration: 1.1, ease: 'power3.out' }, 0.25)
    .to(tissue, { scaleY: 1, duration: 0.6 }, 1.1)                                // 02 laid in tissue
    .to(piece, { yPercent: -55, duration: 0.9 }, 1.2)
    .to(card, { opacity: 1, y: 0, rotate: -6, duration: 0.9, ease: 'power3.out' }, 2.1)  // 03 the card
    .to(piece, { yPercent: 0, duration: 0.7 }, 3.0)                               // 04 closed and tied
    .to(tissue, { scaleY: 0, duration: 0.4 }, 3.3)
    .to(lid, { yPercent: 0, rotate: 0, x: '0%', duration: 0.8, ease: 'power3.inOut' }, 3.2)
    .to(bow, { scale: 1, duration: 0.7, ease: 'back.out(2)' }, 3.95)
    .to({}, { duration: 0.3 });
  const marks = [0, 1.1, 2.1, 3.0, tl.duration()];
  const set = (t) => steps.forEach((li, i) => {
    const on = t >= marks[i] - 0.02 && (i === steps.length - 1 || t < marks[i + 1] - 0.02);
    li.classList.toggle('is-on', on); li.classList.toggle('is-done', t >= marks[i + 1] - 0.02);
    li.style.setProperty('--p', clamp((t - marks[i]) / (marks[i + 1] - marks[i]), 0, 1).toFixed(3));
  });
  if (reduced()) { tl.progress(1); set(tl.duration()); return; }
  const st = ScrollTrigger.create({ trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 0.8, animation: tl, onUpdate: () => set(tl.time()) });
  set(0);
  steps.forEach((li, i) => li.querySelector('button').addEventListener('click', () => smoothTo(st.start + (st.end - st.start) * ((marks[i] + (marks[i + 1] - marks[i]) * 0.6) / tl.duration()))));
}

// campaign: pinned; scrolling moves the ads sideways with a gentle lean; drag on touch; full-screen viewer
function campaign() {
  const sec = document.querySelector('.rg2-camp'), track = sec.querySelector('.rg2-camp__track'), items = [...track.children];
  const bar = sec.querySelector('.rg2-camp__bar i'), count = sec.querySelector('.rg2-camp__meta b');
  const dist = () => Math.max(0, track.scrollWidth - innerWidth);
  const lean = gsap.quickTo(items, 'skewX', { duration: 0.9, ease: 'power3' });
  const upd = (p) => { bar.style.transform = `scaleX(${p})`; const x = p * dist() + innerWidth * 0.3; let k = 0; items.forEach((it, i) => { if (it.offsetLeft <= x) k = i; }); count.textContent = String(k + 1).padStart(2, '0'); };
  const tw = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: sec, pin: sec.querySelector('.rg2-camp__pin'), start: 'top top', end: () => '+=' + dist(), scrub: 0.6, invalidateOnRefresh: true,
    onUpdate: (s) => { upd(s.progress); if (!reduced()) lean(clamp(s.getVelocity() / -900, -1.2, 1.2)); } } });
  ScrollTrigger.addEventListener('scrollEnd', () => lean(0));
  const lb = document.querySelector('.rg2-lb'), lim = lb.querySelector('img'), cap = lb.querySelector('figcaption'); let at = 0;
  const show = (k) => { at = (k + items.length) % items.length; const s = items[at].querySelector('img'); lim.src = s.dataset.hi; lim.alt = s.alt; cap.textContent = items[at].querySelector('figcaption').textContent; lb.classList.toggle('is-spread', items[at].classList.contains('is-spread')); };
  const open = (k) => { show(k); lb.hidden = false; requestAnimationFrame(() => lb.classList.add('is-on')); getLenis()?.stop(); };
  const close = () => { lb.classList.remove('is-on'); setTimeout(() => (lb.hidden = true), 400); getLenis()?.start(); };
  items.forEach((it, k) => it.querySelector('button').addEventListener('click', () => open(k)));
  lb.querySelector('.r-lb__x').addEventListener('click', close);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  lb.querySelectorAll('.r-lb__nav').forEach((b) => b.addEventListener('click', () => show(at + +b.dataset.dir)));
  addEventListener('keydown', (e) => { if (lb.hidden) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') show(at + 1); if (e.key === 'ArrowLeft') show(at - 1); });
  return tw;
}

preloadImages(['assets/img/ewer-bw-2400.webp'], (p) => loader.progress(p)).then(async () => {
  sheen(); loupe();
  await loader.finish();
  hero();
  await start();
  basin(); gift(); campaign();
  ScrollTrigger.sort(); ScrollTrigger.refresh();
});
