// REGALIA II — Regalia, refined to the notes.
import { boot, gsap, ScrollTrigger, reduced, fine, preloadImages, getLenis } from '../boot.js';

const { loader, start } = boot({ id: 'regalia2', name: 'Regalia II', v: '489f', preset: 'royal-489', presets: ['royal-489', 'royal-489-veil', 'royal-2766', 'royal-2766-veil', 'royal-2766-ink', 'royal-couture', 'ink-royal', 'royal-veil', 'royal-bloom', 'royal-mesh', 'royal-dawn', 'royal-script', 'royal-didone', 'royal-calligraphy', 'blush-atelier'] });
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const smoothTo = (y) => { const L = getLenis(); L ? L.scrollTo(y, { duration: 1.4 }) : scrollTo({ top: y, behavior: 'smooth' }); };
const lerp = (a, b, k) => a + (b - a) * k;

// scroll velocity (px/s), smoothed — the banner and the ads respond to it
let vel = 0, velRaw = 0, lastY = scrollY, lastT = performance.now();
gsap.ticker.add(() => { const now = performance.now(), dt = Math.max(1, now - lastT); velRaw = (scrollY - lastY) / dt * 1000; lastY = scrollY; lastT = now; vel = lerp(vel, velRaw, 0.2); });

// hero light: black & white sweep that follows the cursor, wanders when idle or on touch
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
    .fromTo('.rg2-h1 > span, .rg2-sub, .rg2-lead .r-btn', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 1.4 * d }, still ? 0 : 1)
    .fromTo('.rg-specs li', { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 1.2 * d }, still ? 0 : 1.3);
  if (still) return;
  gsap.matchMedia().add('(min-width: 901px)', () => {
    const st = { trigger: '.rg-hero', start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('.rg-word', { scale: 1.12, yPercent: -24, opacity: 0.3, ease: 'none', scrollTrigger: st });
    gsap.to('.rg-ewer', { yPercent: -8, scale: 0.95, ease: 'none', scrollTrigger: st });
    gsap.to('.rg2-lead, .rg-specs', { y: -80, opacity: 0, ease: 'none', scrollTrigger: { ...st, end: '55% top' } });
  });
}

// banner: a slow glide; scrolling pushes it faster, and it follows the direction you scroll
function band() {
  const run = document.querySelector('.rg2-band__run'); if (!run) return;
  let x = 0, dir = -1, speed = 0;
  gsap.ticker.add((t, dt) => {
    if (reduced()) return;
    if (Math.abs(vel) > 40) dir = vel > 0 ? -1 : 1;
    speed = lerp(speed, 18 + Math.min(900, Math.abs(vel)) * 0.12, 0.05);
    x += dir * speed * dt / 1000;
    const w = run.scrollWidth / 4;
    if (x < -w) x += w; if (x > 0) x -= w;
    run.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
  });
}

// loupe: pinned. Each detail moves the camera to it and dims the rest; the lens always follows your mouse.
const SPOTS = [[0.47, 0.085], [0.17, 0.235], [0.95, 0.27], [0.5, 0.6], [0.5, 0.91]];
function loupe() {
  const sec = document.querySelector('.rg2-loupe'), stage = sec.querySelector('.rg2-loupe__stage'), zoom = sec.querySelector('.rg2-loupe__zoom'), img = zoom.querySelector('img');
  const lens = stage.querySelector('.rg-lens'), inner = lens.querySelector('span');
  const texts = [...sec.querySelectorAll('.rg2-ch__t')], dots = [...sec.querySelectorAll('.rg2-dots button')], count = sec.querySelector('.rg2-count b');
  const pin = sec.querySelector('.rg2-loupe__pin'), leader = sec.querySelector('.rg2-leader'), ln = leader.querySelector('line'), dot = leader.querySelector('circle');
  texts.forEach((t) => { let k = 0; t.querySelectorAll('h3, h3 em').forEach((n) => n.childNodes.forEach((c) => { if (c.nodeType !== 3) return; const f = document.createDocumentFragment(); [...c.textContent].forEach((ch) => { if (ch === ' ') { f.append(' '); return; } const i = document.createElement('i'); i.style.setProperty('--c', k++); i.textContent = ch; f.append(i); }); c.replaceWith(f); })); });
  let active = -1, prog = 0, f = 0, hover = false, mx = 0, my = 0, lx = 0, ly = 0, first = true;
  const select = (i) => { if (i === active) return; active = i; texts.forEach((t, k) => t.classList.toggle('is-on', k === i)); dots.forEach((d, k) => d.classList.toggle('is-on', k === i)); count.textContent = ['I', 'II', 'III', 'IV', 'V'][i]; };
  select(0);
  const st = ScrollTrigger.create({ trigger: sec, start: 'top top', end: () => '+=' + innerHeight * (innerWidth <= 900 ? 1.5 : 2.4), pin: sec.querySelector('.rg2-loupe__pin'), scrub: true, invalidateOnRefresh: true,
    onUpdate: (s) => { prog = s.progress; select(clamp(Math.round(s.progress * 4.4 - 0.2), 0, 4)); } });
  dots.forEach((d, i) => d.addEventListener('click', () => smoothTo(st.start + (st.end - st.start) * ((i + 0.2) / 4.4))));
  stage.addEventListener('pointermove', (e) => { if (e.pointerType !== 'mouse') return; hover = true; const s = stage.getBoundingClientRect(); mx = e.clientX - s.left; my = e.clientY - s.top; });
  stage.addEventListener('pointerleave', () => (hover = false));
  // the image box inside the (unzoomed) stage
  const base = () => { const W = stage.clientWidth, H = stage.clientHeight; const bx = W * 0.1, by = H * 0.06, bw = W * 0.8, bh = H * 0.9; const ar = 1113 / 2400, w = Math.min(bw, bh * ar), h = w / ar; return { x: bx + (bw - w) / 2, y: by + (bh - h) / 2, w, h, W, H }; };
  let S = 1, px = 0.5, py = 0.5, vis = 0;
  gsap.ticker.add(() => {
    const b = base();
    // where we are along the route of details, eased between stops
    const tgt = clamp(prog * 4.4 - 0.2, 0, 4);
    f = reduced() ? tgt : lerp(f, tgt, 0.12);
    const i = Math.min(3, Math.floor(f)), k = f - i, e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    const tx = lerp(SPOTS[i][0], SPOTS[i + 1][0], e), ty = lerp(SPOTS[i][1], SPOTS[i + 1][1], e);
    const zoomIn = clamp(prog * 8, 0, 1) * clamp((1 - prog) * 10, 0, 1);
    const tS = 1 + 0.7 * zoomIn;
    S = lerp(S, tS, 0.1); px = lerp(px, tx, 0.14); py = lerp(py, ty, 0.14);
    // camera: bring the detail toward the centre of the stage
    const dX = b.x + px * b.w, dY = b.y + py * b.h;
    const cx = lerp(dX, b.W / 2, zoomIn), cy = lerp(dY, b.H * 0.5, zoomIn);
    const TX = cx - S * dX, TY = cy - S * dY;
    zoom.style.transform = `translate3d(${TX.toFixed(1)}px,${TY.toFixed(1)}px,0) scale(${S.toFixed(4)})`;
    // lens: on your mouse when you hover, otherwise on the detail
    const ax = hover ? mx : cx, ay = hover ? my : cy;
    if (first) { lx = ax; ly = ay; first = false; }
    lx = lerp(lx, ax, reduced() ? 1 : 0.16); ly = lerp(ly, ay, reduced() ? 1 : 0.16);
    const L = lens.offsetWidth, Z = 2.6 * S;
    lens.style.transform = `translate3d(${lx - L / 2}px,${ly - L / 2}px,0)`;
    const imgX = TX + S * b.x, imgY = TY + S * b.y;
    inner.style.backgroundSize = `${b.w * Z}px ${b.h * Z}px`;
    inner.style.backgroundPosition = `${-((lx - imgX) / S * Z - L / 2)}px ${-((ly - imgY) / S * Z - L / 2)}px`;
    // a fine leader line from the lens to the detail's name
    if (leader.getClientRects().length) {
      const P = pin.getBoundingClientRect(), Sg = stage.getBoundingClientRect(), h = texts[Math.max(0, active)].querySelector('h3').getBoundingClientRect();
      // side by side: from the lens across to the name. Stacked (phone/tablet): from the lens down to the top of the name.
      // side by side: across to the name. Name below the window: down to its top. Name above (phones/tablets): up to the line under its description.
      const below = h.top > Sg.bottom - 4, above = h.bottom < Sg.top + 4;
      const tx = texts[Math.max(0, active)], tb = tx.getBoundingClientRect();
      const r = L * 0.5 * 0.72;
      let x1 = Sg.left - P.left + lx + r, y1 = Sg.top - P.top + ly, x2 = h.left - P.left - 18, y2 = h.top - P.top + h.height * 0.35;
      if (below) { x1 = Sg.left - P.left + lx; y1 = Sg.top - P.top + ly + r; x2 = h.left - P.left + Math.min(h.width * 0.25, 40); y2 = h.top - P.top - 12; }
      if (above) { x1 = Sg.left - P.left + lx; y1 = Sg.top - P.top + ly - r; x2 = tb.left - P.left + Math.min(tb.width * 0.5, 90); y2 = tb.bottom - P.top + 10; }
      ln.setAttribute('x1', x1.toFixed(1)); ln.setAttribute('y1', y1.toFixed(1)); ln.setAttribute('x2', x2.toFixed(1)); ln.setAttribute('y2', y2.toFixed(1));
      dot.setAttribute('cx', x2.toFixed(1)); dot.setAttribute('cy', y2.toFixed(1));
      // stays drawn while you steer the lens yourself; it follows the lens to the current name
      vis = reduced() ? (hover ? 1 : zoomIn) : lerp(vis, hover ? 1 : zoomIn, 0.08);
      leader.style.setProperty('--len', (Math.hypot(x2 - x1, y2 - y1) * vis).toFixed(1) + 'px');
      dot.style.opacity = vis.toFixed(3);
    }
  });
}

// the basin: half covered, turning with the scroll and slowly on its own; drag it to turn it yourself
function basin() {
  const sec = document.querySelector('.rg2-basin'), el = sec.querySelector('.rg2-basin__disc');
  let ang = -40, spin = 0, down = false, last = 0, lastT = 0, visible = false, scrollAng = 0;
  const angleAt = (e) => { const r = el.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI; };
  el.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') { down = 'touch'; } else down = true; last = angleAt(e); lastT = performance.now(); spin = 0; el.setPointerCapture(e.pointerId); el.classList.add('is-drag'); });
  el.addEventListener('pointermove', (e) => {
    if (!down) return; const a = angleAt(e); let d = a - last; if (d > 180) d -= 360; if (d < -180) d += 360;
    const now = performance.now(); ang += d; spin = (d / Math.max(8, now - lastT)) * 16; last = a; lastT = now;
  });
  const up = () => { down = false; el.classList.remove('is-drag'); };
  el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  el.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') spin -= 5; if (e.key === 'ArrowRight') spin += 5; });
  ScrollTrigger.create({ trigger: sec, start: 'top bottom', end: 'bottom top', onUpdate: (s) => (scrollAng = s.progress * 100) });
  if (!reduced()) gsap.fromTo('.rg2-basin__wrap', { yPercent: 20 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'center center', scrub: 1 } });
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(sec);
  let shown = scrollAng, light = 0, cursorAng = 0;
  if (fine) addEventListener('pointermove', (e) => { if (!visible) return; const r = el.getBoundingClientRect(); cursorAng = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI + 90; }, { passive: true });
  gsap.ticker.add((t, dt) => {
    if (!visible) return;
    if (!down) { spin *= 0.955; ang += spin + (reduced() ? 0 : 0.006 * dt); }
    shown = lerp(shown, scrollAng, 0.08);
    const a = ang + shown;
    el.style.setProperty('--a', a.toFixed(2) + 'deg');
    // the shine travels: a slow orbit of its own, drawn toward your cursor
    light = lerp(light, (reduced() ? 0 : t * 9) + cursorAng, 0.04);
    el.style.setProperty('--la', (light - a).toFixed(2) + 'deg');
  });
}

// gift: the lid swings open on its hinge as the silver rises; tissue, a card, then it closes and the bow is tied
function gift() {
  if (!document.querySelector('.rg2-gift')) return;
  const sec = document.querySelector('.rg2-gift'), steps = [...sec.querySelectorAll('.rg2-gt__t')], segs = [...sec.querySelectorAll('.rg2-segs button')], count = sec.querySelector('.rg2-count b');
  steps.forEach((t) => { let k = 0; t.querySelectorAll('h3, h3 em').forEach((n) => n.childNodes.forEach((c) => { if (c.nodeType !== 3) return; const f = document.createDocumentFragment(); [...c.textContent].forEach((ch) => { if (ch === ' ') { f.append(' '); return; } const i = document.createElement('i'); i.style.setProperty('--c', k++); i.textContent = ch; f.append(i); }); c.replaceWith(f); })); });
  const box = sec.querySelector('.g2'), card = sec.querySelector('.g2-card');
  const S = { open: 0, rise: 0, tis: 0, bow: 0 };
  const apply = () => { box.style.setProperty('--open', S.open.toFixed(2) + 'deg'); box.style.setProperty('--rise', S.rise.toFixed(3)); box.style.setProperty('--tis', S.tis.toFixed(3)); box.style.setProperty('--bow', S.bow.toFixed(3)); };
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut', onUpdate: apply } });
  tl.to(S, { open: 112, duration: 1 }, 0)                                  // 01 the lid swings back on its hinge…
    .to(S, { rise: 0.88, duration: 1, ease: 'power3.out' }, 0.15)          //    …and the silver rises with it
    .to(S, { tis: 1, duration: 0.6, ease: 'back.out(1.6)' }, 1.15)         // 02 laid in tissue
    .to(S, { rise: 0.3, duration: 0.8 }, 1.15)
    .to(card, { opacity: 1, y: 0, rotate: -3, duration: 0.9, ease: 'power3.out' }, 2.15)   // 03 the card
    .to(S, { rise: 0, duration: 0.7, ease: 'power2.in' }, 3.0)             // 04 the silver settles in,
    .to(S, { tis: 0.55, duration: 0.4 }, 3.2)
    .to(S, { open: 0, duration: 0.8, ease: 'power3.inOut' }, 3.3)          //    the lid closes,
    .to(S, { bow: 1, duration: 0.7, ease: 'back.out(2.2)' }, 4.05)         //    and the bow is tied
    .to({}, { duration: 0.3 });
  const marks = [0, 1.15, 2.15, 3.0, tl.duration()];
  const set = (t) => { let on = 0; steps.forEach((el, i) => {
    const a = t >= marks[i] - 0.02 && (i === steps.length - 1 || t < marks[i + 1] - 0.02); if (a) on = i;
    el.classList.toggle('is-on', a);
    segs[i].style.setProperty('--p', clamp((t - marks[i]) / (marks[i + 1] - marks[i]), 0, 1).toFixed(3));
  }); count.textContent = '0' + (on + 1); };
  apply();
  if (reduced()) { tl.progress(1); apply(); set(tl.duration()); return; }
  const st = ScrollTrigger.create({ trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 0.8, animation: tl });
  tl.eventCallback('onUpdate', () => set(tl.time()));
  set(0);
  segs.forEach((b, i) => b.addEventListener('click', () => smoothTo(st.start + (st.end - st.start) * ((marks[i] + (marks[i + 1] - marks[i]) * 0.6) / tl.duration()))));
  // the box turns a little toward your cursor
  if (fine) {
    const scene = sec.querySelector('.rg2-gift__scene'); let ry = -16, rx = -14, try_ = -16, trx = -14;
    scene.addEventListener('pointermove', (e) => { const r = scene.getBoundingClientRect(); try_ = -16 + ((e.clientX - r.left) / r.width - 0.5) * 18; trx = -14 - ((e.clientY - r.top) / r.height - 0.5) * 8; });
    scene.addEventListener('pointerleave', () => { try_ = -16; trx = -14; });
    gsap.ticker.add(() => { ry = lerp(ry, try_, 0.06); rx = lerp(rx, trx, 0.06); box.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`; });
  }
}

// campaign: pinned sideways scroll. The ads lean with your scroll speed on a soft spring, so they answer acceleration.
function campaign() {
  const sec = document.querySelector('.rg2-camp'), track = sec.querySelector('.rg2-camp__track'), items = [...track.children];
  const bar = sec.querySelector('.rg2-camp__bar i'), count = sec.querySelector('.rg2-camp__meta b');
  const dist = () => Math.max(0, track.scrollWidth - innerWidth);
  const upd = (p) => { bar.style.transform = `scaleX(${p})`; const x = p * dist() + innerWidth * 0.3; let k = 0; items.forEach((it, i) => { if (it.offsetLeft <= x) k = i; }); count.textContent = String(k + 1).padStart(2, '0'); };
  gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: sec, pin: sec.querySelector('.rg2-camp__pin'), start: 'top top', end: () => '+=' + dist(), scrub: 0.6, invalidateOnRefresh: true, onUpdate: (s) => upd(s.progress) } });
  // spring: target lean comes from velocity; the spring's own motion adds a natural overshoot when you speed up or stop
  let a = 0, av = 0, visible = false;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(sec);
  gsap.ticker.add(() => {
    if (!visible || reduced()) return;
    const target = clamp(-vel / 600, -3.2, 3.2);
    av += (target - a) * 0.09; av *= 0.78; a += av;
    const s = 1 - Math.min(0.025, Math.abs(a) * 0.006);
    items.forEach((it) => (it.style.transform = `skewX(${a.toFixed(3)}deg) scale(${s.toFixed(4)})`));
  });
  // the viewer: a big preview over a deep branded veil; it only moves between the ads that are shown on this screen
  const lb = document.querySelector('.rg2-lb'), lim = lb.querySelector('img'), cap = lb.querySelector('figcaption'); let at = 0, list = items;
  const show = (k) => { at = (k + list.length) % list.length; const it = list[at], src = it.querySelector('img'); lim.src = src.dataset.hi; lim.alt = src.alt; cap.textContent = [...it.querySelector('figcaption').childNodes].map((n) => n.textContent.trim()).filter(Boolean).join('  ·  '); lb.classList.toggle('is-spread', it.classList.contains('is-spread')); };
  const open = (it) => { list = items.filter((x) => x.offsetParent !== null); show(list.indexOf(it)); lb.hidden = false; requestAnimationFrame(() => lb.classList.add('is-on')); getLenis()?.stop(); document.documentElement.style.overflow = 'hidden'; };
  const close = () => { lb.classList.remove('is-on'); setTimeout(() => (lb.hidden = true), 400); getLenis()?.start(); document.documentElement.style.overflow = ''; };
  items.forEach((it) => it.querySelector('button').addEventListener('click', () => open(it)));
  lb.querySelector('.r-lb__x').addEventListener('click', close);
  // anywhere outside the picture, the arrows and the close button closes it
  lb.addEventListener('click', (e) => { if (!e.target.closest('img, .r-lb__nav, .r-lb__x')) close(); });
  lb.querySelectorAll('.r-lb__nav').forEach((b) => b.addEventListener('click', () => show(at + +b.dataset.dir)));
  addEventListener('keydown', (e) => { if (lb.hidden) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') show(at + 1); if (e.key === 'ArrowLeft') show(at - 1); });
}

// page tone: each section asks for a tone; the fixed tone layer eases between them as you scroll
function tones() {
  const layers = { deep: document.querySelector('.t-deep'), royal: document.querySelector('.t-royal'), warm: document.querySelector('.t-warm') };
  const map = [['.rg2-loupe', 'deep'], ['.rg2-coll', 'royal'], ['.r-story', 'warm'], ['.rg2-basin', 'deep'], ['.r-occ', 'royal'], ['.rg2-gift', 'deep'], ['.rg2-camp', 'royal'], ['.r-shop', 'warm'], ['.r-conc', 'deep']]
    .map(([sel, t]) => [document.querySelector(sel), t]).filter(([el]) => el);
  const cur = { deep: 0, royal: 0, warm: 0 };
  gsap.ticker.add(() => {
    const mid = innerHeight / 2, tgt = { deep: 0, royal: 0, warm: 0 };
    map.forEach(([el, t]) => {
      const sp = el.parentElement.classList.contains('pin-spacer') ? el.parentElement : el;
      const r = sp.getBoundingClientRect();
      // weight: 1 while the section covers the middle of the screen, easing over 45% of a screen at each end
      const fade = innerHeight * 0.45;
      const w = clamp(Math.min((mid - r.top) / fade + 0.5, (r.bottom - mid) / fade + 0.5), 0, 1);
      tgt[t] = Math.max(tgt[t], w * w * (3 - 2 * w));
    });
    for (const k in cur) { cur[k] = lerp(cur[k], tgt[k], reduced() ? 1 : 0.06); layers[k].style.opacity = cur[k].toFixed(3); }
  });
}

// shop now: a slow procession of real pieces orbiting the title; front pieces pass beneath it, back pieces behind it.
// It turns faster with your scroll and leans toward your cursor.
function orbit() {
  const el = document.querySelector('.rg2-orbit'); if (!el) return;
  const cards = [...el.children], N = cards.length, sec = el.closest('.r-shop');
  let a = 0, mx = 0, tmx = 0, on = false;
  new IntersectionObserver(([e]) => (on = e.isIntersecting)).observe(sec);
  sec.addEventListener('pointermove', (e) => { const r = sec.getBoundingClientRect(); tmx = (e.clientX - r.left) / r.width - 0.5; });
  sec.addEventListener('pointerleave', () => (tmx = 0));
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'still';
  const draw = () => {
    const W = sec.clientWidth, H = sec.clientHeight, small = W < 900;
    const RX = W * (small ? 0.62 : 0.44), RY = H * (small ? 0.36 : 0.4), cy = H * (small ? 0.06 : 0.07);
    cards.forEach((c, i) => {
      const t = a + (i / N) * Math.PI * 2, z = Math.cos(t), x = Math.sin(t) * RX, y = z * RY + cy;
      const k = (z + 1) / 2, s = 0.5 + 0.5 * k;
      c.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${s.toFixed(3)}) rotate(${(Math.sin(t) * -6).toFixed(2)}deg)`;
      c.style.opacity = (0.22 + 0.78 * k * k).toFixed(3);
      c.style.zIndex = z > 0.15 ? 3 : 1;
      c.style.filter = `blur(${((1 - k) * 2.2).toFixed(2)}px)`;
    });
  };
  gsap.ticker.add((time, dt) => {
    if (!on) return;
    mx = lerp(mx, tmx, 0.05);
    if (!still) a += (0.00012 + Math.min(Math.abs(vel), 4000) * 0.0000009) * dt * Math.sign(vel || 1) + mx * 0.0004 * dt;
    draw();
  });
  draw();
}

// announcement bar: two lines that take turns, crossfading
function ann() {
  const items = [...document.querySelectorAll('.rg2-ann__rot span')]; if (items.length < 2) return;
  let i = 0; setInterval(() => { items[i].classList.remove('is-on'); i = (i + 1) % items.length; items[i].classList.add('is-on'); }, 4200);
}

// the promise: three short vows take the stage one after another as you scroll — each rises out of soft blur, holds, and lifts away
function vow() {
  // the promise band: hairlines draw outward from the centre, then the three pledges rise in, one after another
  const sec = document.querySelector('.rg2-pledge'); if (!sec) return;
  if (reduced()) return sec.classList.add('is-on');
  ScrollTrigger.create({ trigger: sec, start: 'top 85%', once: true, onEnter: () => sec.classList.add('is-on') });
}

// our story: a fine silver line draws itself beneath each key phrase as the words light up
function pills() {
  const ms = [...document.querySelectorAll('.rg2-mark')]; if (!ms.length) return;
  if (reduced()) return ms.forEach((m) => m.classList.add('is-on'));
  ms.forEach((m) => ScrollTrigger.create({ trigger: m, start: 'top 62%', onEnter: () => m.classList.add('is-on'), onLeaveBack: () => m.classList.remove('is-on') }));
}

function products() {
  const m = document.querySelector('.rg2-feat__media'); if (!m) return;
  m.addEventListener('pointermove', (e) => { const r = m.getBoundingClientRect(); m.style.setProperty('--px', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%'); m.style.setProperty('--py', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%'); });
  if (!reduced()) ScrollTrigger.create({ trigger: m, start: 'top bottom', end: 'bottom top', onUpdate: (s) => m.style.setProperty('--z', (1.14 - s.progress * 0.14).toFixed(4)) });
}

preloadImages(['assets/img/ewer-bw-2400.webp'], (p) => loader.progress(p)).then(async () => {
  sheen(); band(); ann();
  await loader.finish();
  hero();
  await start();
  loupe(); basin(); gift(); campaign(); products(); tones(); orbit(); vow(); pills();
  ScrollTrigger.sort(); ScrollTrigger.refresh();
});
