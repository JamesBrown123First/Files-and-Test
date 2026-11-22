// Round five ("Crown" kit) — shared interactions for the photograph directions built on Regalia.
// Hero light sweep (black & white), soft wave banner, sticky loupe, turnable basin,
// a real 3D gift box, the campaign reel, and the Shop Now ring.
import { boot, gsap, ScrollTrigger, reduced, fine, preloadImages, getState, onState, getLenis } from '../royal/boot.js';
export { gsap, ScrollTrigger, reduced, fine };

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const mq = (q) => matchMedia(q).matches;

// ---------- hero: black & white light sweep, auto + cursor ----------
function heroLight() {
  const ewer = document.querySelector('.cr-ewer'), word = document.querySelector('.cr-word');
  if (!ewer) return;
  let target = 30, cur = -30, idle = 9999, ty = 40, cy = 40;
  if (fine) addEventListener('pointermove', (e) => { target = (e.clientX / innerWidth) * 130 - 15; ty = (e.clientY / innerHeight) * 100; idle = 0; }, { passive: true });
  gsap.ticker.add((t, dt) => {
    idle += dt;
    if (!fine || idle > 3200) { target = 50 + Math.sin(t * 0.42) * 62; ty = 45 + Math.sin(t * 0.31) * 20; }
    if (reduced()) { target = 42; ty = 40; }
    cur += (target - cur) * 0.055; cy += (ty - cy) * 0.05;
    ewer.style.setProperty('--sx', cur.toFixed(2) + '%');
    ewer.style.setProperty('--sy', cy.toFixed(2) + '%');
    if (word) { word.style.setProperty('--lx', cur.toFixed(2) + '%'); word.style.setProperty('--ly', cy.toFixed(2) + '%'); }
  });
}

function heroIntro() {
  const still = reduced();
  const d = still ? 0.01 : 1;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.fromTo('.cr-word', { clipPath: 'inset(0 0 100% 0)', yPercent: 8 }, { clipPath: 'inset(0 0 -10% 0)', yPercent: 0, duration: 1.9 * d, ease: 'expo.inOut' })
    .fromTo('.cr-ewer', { yPercent: 10, opacity: 0, scale: 0.95 }, { yPercent: 0, opacity: 1, scale: 1, duration: 2.2 * d }, still ? 0 : 0.55)
    .fromTo('.cr-h1__l > span', { yPercent: 110 }, { yPercent: 0, stagger: 0.12, duration: 1.5 * d }, still ? 0 : 0.9)
    .fromTo('.cr-side > *, .cr-specs li, .cr-scroll', { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07, duration: 1.2 * d }, still ? 0 : 1.3);
  if (still) return;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    const st = { trigger: '.cr-hero', start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('.cr-word', { yPercent: -26, scale: 1.06, opacity: 0.25, ease: 'none', scrollTrigger: st });
    gsap.to('.cr-ewer', { yPercent: -12, ease: 'none', scrollTrigger: st });
    gsap.to('.cr-h1, .cr-specs', { y: -90, opacity: 0, ease: 'none', scrollTrigger: { ...st, end: '50% top' } });
    gsap.to('.cr-side, .cr-scroll', { y: -70, opacity: 0, ease: 'none', scrollTrigger: { ...st, end: '50% top' } });
  });
}

// ---------- banner: words glide along a softly breathing silk curve ----------
function banner() {
  document.querySelectorAll('.cr-band').forEach((el) => {
    const tp = el.querySelector('textPath'), paths = el.querySelectorAll('path'), run = el.querySelector('.cr-band__run');
    let off = 0, flat = 0, boost = 0, phase = Math.random() * 6;
    const len = () => paths[0].getTotalLength();
    let L = len(); addEventListener('resize', () => (L = len()));
    const text = el.querySelector('text');
    let tl = 0; const measure = () => { try { tl = text.getComputedTextLength() / 4; } catch { tl = 1600; } };
    measure(); document.fonts?.ready.then(measure); onState(() => setTimeout(measure, 300));
    const st = ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'bottom top', onUpdate: (s) => (boost = clamp(Math.abs(s.getVelocity()) / 1500, 0, 3)) });
    let visible = true; new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(el);
    gsap.ticker.add((t, dt) => {
      if (!visible) return;
      const still = reduced();
      const speed = still ? 0 : getState().motion === 'calm' ? 0.5 : 1;
      boost *= 0.94;
      off -= (0.028 + boost * 0.06) * dt * speed;
      flat -= (0.03 + boost * 0.06) * dt * speed;
      if (tl && off < -tl) off += tl;
      tp.setAttribute('startOffset', off.toFixed(1));
      if (run) { const w = run.scrollWidth / 3; if (flat < -w) flat += w; run.style.transform = `translate3d(${flat.toFixed(1)}px,0,0)`; }
      // the curve breathes very gently
      if (!still) {
        phase += dt * 0.00035 * speed;
        const a = 26 + Math.sin(phase * 1.3) * 10, b = Math.sin(phase) * 18;
        const dd = `M-400 70 C 0 ${70 - a + b}, 400 ${70 + a + b}, 800 70 S 1600 ${70 - a - b}, 2000 70`;
        paths.forEach((p) => p.setAttribute('d', dd));
      }
    });
    return st;
  });
}

// ---------- loupe: pinned; scrolling travels the lens through five details ----------
const SPOTS = [[0.47, 0.085], [0.2, 0.235], [0.86, 0.3], [0.5, 0.6], [0.5, 0.91]];
function loupe() {
  const sec = document.querySelector('.cr-loupe'); if (!sec) return;
  const stage = sec.querySelector('.cr-loupe__stage'), lens = sec.querySelector('.cr-lens'), inner = lens.querySelector('span'), im = stage.querySelector('img');
  const texts = [...sec.querySelectorAll('.cr-loupe__t')], dots = [...sec.querySelectorAll('[data-spot]')], nums = sec.querySelector('.cr-loupe__num');
  const ZOOM = 2.8; let active = -1, hover = false, px = 0, py = 0, cx = 0, cy = 0, sp = 0;
  const rectOf = () => {
    const r = im.getBoundingClientRect(), s = stage.getBoundingClientRect();
    const ar = 649 / 1400, w = Math.min(r.width, r.height * ar), h = w / ar;
    return { x: r.left - s.left + (r.width - w) / 2, y: r.top - s.top + (r.height - h) / 2, w, h };
  };
  const at = (f) => { // position along the route between details (f: 0..4)
    const i = clamp(Math.floor(f), 0, 3), k = clamp(f - i, 0, 1), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    const a = SPOTS[i], b = SPOTS[Math.min(4, i + 1)];
    return [a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e];
  };
  const select = (i) => {
    if (i === active) return; active = i;
    texts.forEach((t, k) => t.classList.toggle('is-on', k === i));
    dots.forEach((d, k) => d.classList.toggle('is-on', k === i));
    nums.style.setProperty('--i', i);
  };
  select(0);
  // scroll drives the route (pinned on every screen size)
  const st = ScrollTrigger.create({
    trigger: sec, start: 'top top', end: () => '+=' + innerHeight * 3.2, pin: sec.querySelector('.cr-loupe__pin'), scrub: true, invalidateOnRefresh: true,
    onUpdate: (s) => { sp = s.progress * 4; select(Math.round(sp)); }
  });
  dots.forEach((d, i) => d.addEventListener('click', () => {
    const y = st.start + (st.end - st.start) * (i / 4);
    const L = getLenis(); L ? L.scrollTo(y, { duration: 1.4 }) : scrollTo({ top: y, behavior: 'smooth' });
  }));
  stage.addEventListener('pointermove', (e) => { if (e.pointerType !== 'mouse') return; hover = true; const s = stage.getBoundingClientRect(); px = e.clientX - s.left; py = e.clientY - s.top; });
  stage.addEventListener('pointerleave', () => (hover = false));
  let first = true;
  gsap.ticker.add(() => {
    const b = rectOf();
    if (!hover) { const [fx, fy] = at(sp); px = b.x + fx * b.w; py = b.y + fy * b.h; }
    if (first) { cx = px; cy = py; first = false; }
    const k = reduced() ? 1 : hover ? 0.16 : 0.22;
    cx += (px - cx) * k; cy += (py - cy) * k;
    const L = lens.offsetWidth;
    lens.style.transform = `translate3d(${cx - L / 2}px,${cy - L / 2}px,0)`;
    inner.style.backgroundSize = `${b.w * ZOOM}px ${b.h * ZOOM}px`;
    inner.style.backgroundPosition = `${-((cx - b.x) * ZOOM - L / 2)}px ${-((cy - b.y) * ZOOM - L / 2)}px`;
  });
}

// ---------- hallmark: drag to turn the basin, with inertia; it idles slowly on its own ----------
function hallmark() {
  const sec = document.querySelector('.cr-hall'); if (!sec) return;
  const basin = sec.querySelector('.cr-hall__basin'), ring = sec.querySelector('.cr-ring');
  let ang = 0, vel = 0, down = false, last = 0, lastT = 0, idle = 0, scrollV = 0;
  const angleAt = (e) => { const r = basin.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI; };
  basin.addEventListener('pointerdown', (e) => { down = true; last = angleAt(e); lastT = performance.now(); vel = 0; basin.setPointerCapture(e.pointerId); basin.classList.add('is-drag'); sec.classList.add('was-turned'); });
  basin.addEventListener('pointermove', (e) => {
    if (!down) return;
    const a = angleAt(e); let d = a - last; if (d > 180) d -= 360; if (d < -180) d += 360;
    const now = performance.now(); ang += d; vel = d / Math.max(8, now - lastT) * 16; last = a; lastT = now; idle = 0;
  });
  const up = () => { down = false; basin.classList.remove('is-drag'); };
  basin.addEventListener('pointerup', up); basin.addEventListener('pointercancel', up);
  basin.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') vel -= 4; if (e.key === 'ArrowRight') vel += 4; });
  basin.tabIndex = 0;
  ScrollTrigger.create({ trigger: sec, start: 'top bottom', end: 'bottom top', onUpdate: (s) => (scrollV = s.getVelocity() / 260) });
  let visible = false; new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(sec);
  gsap.ticker.add((t, dt) => {
    if (!visible) return;
    idle += dt;
    if (!down) {
      const base = reduced() ? 0 : 0.012 * dt; // slow idle turn
      vel *= 0.955; scrollV *= 0.9;
      ang += vel + base + scrollV * 0.06;
    }
    basin.style.setProperty('--a', ang.toFixed(2) + 'deg');
    if (ring) ring.style.transform = `rotate(${(-ang * 0.35).toFixed(2)}deg)`;
    // light reads fixed in the room while the metal turns
    basin.style.setProperty('--la', (-ang).toFixed(2) + 'deg');
  });
  if (!reduced()) gsap.fromTo(basin, { yPercent: 18, rotate: -30, opacity: 0 }, { yPercent: 0, rotate: 0, opacity: 1, duration: 2, ease: 'expo.out', scrollTrigger: { trigger: sec, start: 'top 70%' } });
}

// ---------- gift: a real 3D box. Scroll opens it, step by step ----------
function gift() {
  const sec = document.querySelector('.cr-gift'); if (!sec) return;
  const steps = [...sec.querySelectorAll('.cr-gift__steps li')], bar = sec.querySelector('.cr-gift__bar i');
  const box = sec.querySelector('.gb'), lid = sec.querySelector('.gb__lid'), piece = sec.querySelector('.gb__piece'), tissue = sec.querySelector('.gb__tissue');
  const card = sec.querySelector('.gb__card'), bow = sec.querySelector('.gb__bow'), spark = sec.querySelector('.gb__sparkle'), glow = sec.querySelector('.cr-gift__glow');
  const set = (i) => steps.forEach((s, k) => { s.classList.toggle('is-on', k === i); s.classList.toggle('is-done', k < i); });
  gsap.set(box, { rotateX: -16, rotateY: -32 });
  gsap.set(bow, { scale: 0 });
  gsap.set(piece, { yPercent: 30, opacity: 0 });
  gsap.set(card, { opacity: 0, y: 60, rotate: 14 });
  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
  // I · the lid lifts, the piece rises
  tl.to(box, { rotateY: -20, duration: 1 }, 0)
    .to(lid, { y: '-60%', z: 40, rotateX: 18, rotateZ: -8, duration: 1 }, 0)
    .to(tissue, { scaleY: 1, opacity: 1, duration: 0.6 }, 0.25)
    .to(piece, { yPercent: -9, opacity: 1, duration: 1.1, ease: 'power3.out' }, 0.2)
    .to(glow, { opacity: 1, scale: 1.1, duration: 1 }, 0.2)
  // II · nestled in tissue, the lid comes home
    .to(piece, { yPercent: 30, duration: 1 }, 1.4)
    .to(tissue, { scaleY: 0.4, duration: 0.6 }, 1.7)
    .to(lid, { y: '0%', z: 0, rotateX: 0, rotateZ: 0, duration: 0.9, ease: 'power3.inOut' }, 1.75)
    .to(piece, { opacity: 0, duration: 0.2 }, 2.3)
    .to(box, { rotateY: -38, rotateX: -12, duration: 1 }, 1.8)
  // III · the card
    .to(card, { opacity: 1, y: 0, rotate: -5, duration: 0.9, ease: 'power3.out' }, 2.8)
    .to(box, { rotateY: -28, duration: 1 }, 2.8)
  // IV · the bow, a glint
    .to(bow, { scale: 1, duration: 0.8, ease: 'back.out(2.2)' }, 3.9)
    .fromTo(spark, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.5 }, 4.3)
    .to(box, { rotateY: -24, rotateX: -18, duration: 0.8 }, 4.1)
    .to({}, { duration: 0.6 });
  const total = tl.duration(), marks = [0, 1.4, 2.8, 3.9];
  if (reduced()) { tl.progress(1); set(3); bar.style.transform = 'scaleY(1)'; return; }
  const st = ScrollTrigger.create({
    trigger: sec, start: 'top top', end: () => '+=' + innerHeight * 3, pin: sec.querySelector('.cr-gift__pin'), scrub: 0.9, animation: tl, invalidateOnRefresh: true,
    onUpdate: (s) => { const t = s.progress * total; let i = 0; marks.forEach((m, k) => { if (t >= m - 0.05) i = k; }); set(i); bar.style.transform = `scaleY(${s.progress})`; }
  });
  steps.forEach((li, i) => li.querySelector('button').addEventListener('click', () => {
    const y = st.start + (st.end - st.start) * ((marks[i] + 0.7) / total);
    const L = getLenis(); L ? L.scrollTo(y, { duration: 1.6 }) : scrollTo({ top: y, behavior: 'smooth' });
  }));
  // the box answers the cursor a little
  if (fine) {
    const scene = sec.querySelector('.cr-gift__scene'); const r = gsap.quickTo(scene, 'rotationY', { duration: 1.2, ease: 'power3' }), rx = gsap.quickTo(scene, 'rotationX', { duration: 1.2, ease: 'power3' });
    scene.addEventListener('pointermove', (e) => { const b = scene.getBoundingClientRect(); r(((e.clientX - b.left) / b.width - 0.5) * 14); rx(-((e.clientY - b.top) / b.height - 0.5) * 8); });
    scene.addEventListener('pointerleave', () => { r(0); rx(0); });
  }
}

// ---------- campaign reel: scroll moves it sideways, it leans with your speed; drag; full-screen viewer ----------
function reel() {
  const sec = document.querySelector('.cr-reel'); if (!sec) return;
  const view = sec.querySelector('.cr-reel__view'), track = sec.querySelector('.cr-reel__track'), items = [...track.children];
  const bar = sec.querySelector('.cr-reel__bar i'), count = sec.querySelector('.cr-reel__count b');
  const dist = () => Math.max(0, track.scrollWidth - view.clientWidth);
  let x = 0, tx = 0, dragOff = 0, st = null;
  const lean = gsap.quickTo(items, 'skewX', { duration: 0.7, ease: 'power3' });
  const tilt = gsap.quickTo(items, 'rotationY', { duration: 0.9, ease: 'power3' });
  const update = (p) => {
    bar.style.transform = `scaleX(${0.04 + p * 0.96})`;
    const cx = -x + view.clientWidth * 0.35; let k = 0; items.forEach((it, i) => { if (it.offsetLeft <= cx) k = i; });
    count.textContent = String(k + 1).padStart(2, '0');
  };
  st = ScrollTrigger.create({
    trigger: sec, start: 'top top', end: () => '+=' + dist(), pin: sec.querySelector('.cr-reel__pin'), invalidateOnRefresh: true,
    onUpdate: (s) => { tx = -s.progress * dist(); const v = clamp(s.getVelocity() / -350, -4, 4); if (!reduced()) { lean(v); tilt(v * 2.4); } }
  });
  gsap.ticker.add(() => {
    x += (tx - x) * (reduced() ? 1 : 0.14);
    track.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
    update(dist() ? -x / dist() : 0);
  });
  ScrollTrigger.addEventListener('scrollEnd', () => { lean(0); tilt(0); });
  const scrollToX = (nx) => { const p = clamp(-nx / Math.max(1, dist()), 0, 1); const y = st.start + (st.end - st.start) * p; const L = getLenis(); L ? L.scrollTo(y, { duration: 1.2 }) : scrollTo({ top: y }); };
  const go = (dir) => { const cx = -x + 2; let k = 0; items.forEach((it, i) => { if (it.offsetLeft <= cx + 4) k = i; }); k = clamp(k + dir, 0, items.length - 1); scrollToX(-items[k].offsetLeft); };
  sec.querySelectorAll('.cr-reel__btns button').forEach((b) => b.addEventListener('click', () => go(+b.dataset.dir)));
  // drag (mouse and touch-horizontal) maps to the same scroll
  let down = false, sx = 0, sy = 0, sScroll = 0, moved = 0, horiz = null;
  view.addEventListener('pointerdown', (e) => { down = true; moved = 0; horiz = e.pointerType === 'mouse' ? true : null; sx = e.clientX; sy = e.clientY; sScroll = scrollY; view.classList.add('is-drag'); });
  addEventListener('pointermove', (e) => {
    if (!down) return; const dx = e.clientX - sx, dy = e.clientY - sy;
    if (horiz === null && Math.abs(dx) + Math.abs(dy) > 8) horiz = Math.abs(dx) > Math.abs(dy);
    if (!horiz) return; moved = Math.max(moved, Math.abs(dx));
    const ratio = (st.end - st.start) / Math.max(1, dist());
    const L = getLenis(); const y = clamp(sScroll - dx * ratio, st.start, st.end);
    L ? L.scrollTo(y, { immediate: true }) : scrollTo(0, y);
  }, { passive: true });
  addEventListener('pointerup', () => { down = false; view.classList.remove('is-drag'); });
  view.style.touchAction = 'pan-y';
  view.addEventListener('click', (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
  if (!reduced()) gsap.fromTo(items, { y: 70, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: sec, start: 'top 75%' } });
  // viewer
  const lb = document.querySelector('.cr-lb'); if (!lb) return;
  const lim = lb.querySelector('img'), cap = lb.querySelector('figcaption'); let at = 0, lastF = null;
  const show = (k) => { at = (k + items.length) % items.length; const s = items[at].querySelector('img'); lim.src = s.dataset.hi; lim.alt = s.alt; cap.textContent = `${String(at + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')} · ${items[at].querySelector('figcaption span').textContent}`; lb.classList.toggle('is-spread', items[at].classList.contains('is-spread')); };
  const open = (k) => { lastF = document.activeElement; show(k); lb.hidden = false; requestAnimationFrame(() => lb.classList.add('is-on')); getLenis()?.stop(); lb.querySelector('.cr-lb__x').focus(); };
  const close = () => { lb.classList.remove('is-on'); setTimeout(() => (lb.hidden = true), 450); getLenis()?.start(); lastF?.focus(); };
  items.forEach((it, k) => it.querySelector('.cr-ad__open').addEventListener('click', () => open(k)));
  lb.querySelector('.cr-lb__x').addEventListener('click', close);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  lb.querySelectorAll('.cr-lb__nav').forEach((b) => b.addEventListener('click', () => show(at + +b.dataset.dir)));
  addEventListener('keydown', (e) => { if (lb.hidden) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') show(at + 1); if (e.key === 'ArrowLeft') show(at - 1); });
  let tx0 = 0; lb.addEventListener('touchstart', (e) => (tx0 = e.touches[0].clientX), { passive: true });
  lb.addEventListener('touchend', (e) => { const d = e.changedTouches[0].clientX - tx0; if (Math.abs(d) > 50) show(at + (d < 0 ? 1 : -1)); });
}

// ---------- collection: a sheen follows the pointer over each piece ----------
function collection() {
  document.querySelectorAll('.cr-prod__media').forEach((m) => {
    m.addEventListener('pointermove', (e) => { const r = m.getBoundingClientRect(); m.style.setProperty('--px', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%'); m.style.setProperty('--py', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%'); });
  });
  if (!reduced()) document.querySelectorAll('.cr-coll__grid').forEach((g) => {
    const odd = g.querySelectorAll('.cr-prod:nth-child(4n+2), .cr-prod:nth-child(4n+4)');
    gsap.matchMedia().add('(min-width: 901px)', () => { const tw = gsap.fromTo(odd, { y: 60 }, { y: -60, ease: 'none', scrollTrigger: { trigger: g, start: 'top bottom', end: 'bottom top', scrub: true } }); return () => tw.kill(); });
  });
}

// ---------- shop now: the ring turns faster when you come near ----------
function shop() {
  const btn = document.querySelector('.cr-shop__btn'); if (!btn) return;
  const ring = btn.querySelector('.cr-ring'); let a = 0, sp = 1, tsp = 1;
  btn.addEventListener('pointerenter', () => (tsp = 4)); btn.addEventListener('pointerleave', () => (tsp = 1));
  gsap.ticker.add((t, dt) => { if (reduced()) return; sp += (tsp - sp) * 0.06; a += dt * 0.006 * sp; ring.style.transform = `rotate(${a.toFixed(2)}deg)`; });
  if (!reduced()) gsap.fromTo('.cr-shop__bg', { scale: 1.2, yPercent: -6 }, { scale: 1, yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.cr-shop', start: 'top bottom', end: 'bottom top', scrub: true } });
}

// ---------- footer wordmark rises in ----------
function footer() {
  if (reduced()) return;
  gsap.fromTo('.cr-foot__mark svg', { yPercent: 40 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.cr-foot', start: 'top bottom', end: 'bottom bottom', scrub: true } });
}

// ---------- page ----------
export function crownPage(cfg) {
  const { loader, start } = boot({ details: true, ...cfg });
  preloadImages(['assets/img/ewer-bw-2400.webp', 'assets/img/ewer-bw-1400.webp'], (p) => loader.progress(p)).then(async () => {
    heroLight();
    await loader.finish();
    heroIntro();
    await start();
    banner(); loupe(); hallmark(); gift(); reel(); collection(); shop(); footer();
    cfg.extra?.();
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  });
}
