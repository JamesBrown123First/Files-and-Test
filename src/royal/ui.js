// Shared interactions: smooth scroll, reveals, split text, cursor, magnetic buttons,
// tilt, drag strips, menus, word-fill, bag feedback, forms.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { getState, onState } from './state.js';
gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };

export const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
export const reduced = () => getState().motion === 'still';
export let lenis = null;

export function initScroll() {
  if (reduced()) return;
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, touchMultiplier: 1.4 });
  window.__lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const id = a.getAttribute('href'); if (id.length < 2 || /^#(k=|edit)/.test(id)) return;
    const el = document.querySelector(id); if (!el) return;
    e.preventDefault(); lenis.scrollTo(el, { offset: 0, duration: 1.6 });
  });
}

// Loader: crown mark draws, counter runs, then the curtain lifts
export function initLoader() {
  const el = document.querySelector('.r-loader');
  let shown = 0, target = 0, done = false, raf;
  const num = el?.querySelector('.r-loader__num'), bar = el?.querySelector('.r-loader__bar i');
  const tick = () => {
    shown += (target - shown) * 0.08;
    if (num) num.textContent = String(Math.round(shown * 100)).padStart(3, '0');
    if (bar) bar.style.transform = `scaleX(${shown})`;
    if (!done || shown < 0.995) raf = requestAnimationFrame(tick);
  };
  if (el) tick();
  return {
    progress(p) { target = Math.max(target, Math.min(1, p)); },
    finish() {
      target = 1; done = true;
      return new Promise((res) => {
        const end = () => {
          if (!el) return res();
          if (shown < 0.97) return requestAnimationFrame(end);
          cancelAnimationFrame(raf);
          document.documentElement.classList.add('is-loaded');
          gsap.to(el, { yPercent: -100, duration: reduced() ? 0.01 : 1.1, ease: 'expo.inOut', delay: 0.15, onComplete: () => { el.remove(); res(); } });
        };
        end();
      });
    }
  };
}

// Split headings into masked words (keeps <em> styling)
export function split(el) {
  if (el.dataset.splitDone) return el.querySelectorAll('.w > i');
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const parts = n.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(' '));
          else { const w = document.createElement('span'); w.className = 'w'; const i = document.createElement('i'); i.textContent = p; w.appendChild(i); frag.appendChild(w); }
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && !n.classList.contains('w')) walk(n);
    });
  };
  walk(el); el.dataset.splitDone = 1;
  return el.querySelectorAll('.w > i');
}

export function initReveals(root = document) {
  const still = reduced();
  // refined pages reveal text a little later, once it is well on screen
  const late = document.body.hasAttribute('data-refined'), at = (n) => `top ${late ? n - 16 : n}%`;
  root.querySelectorAll('[data-split]:not([data-manual])').forEach((el) => {
    const words = split(el);
    if (still) return;
    gsap.fromTo(words, { yPercent: 110 }, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: el, start: at(88) } });
  });
  root.querySelectorAll('[data-reveal]').forEach((el) => {
    if (still) return gsap.set(el, { opacity: 1 });
    const d = +(el.dataset.delay || 0);
    gsap.fromTo(el, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1.1, delay: d, ease: 'power3.out', scrollTrigger: { trigger: el, start: at(90) } });
  });
  root.querySelectorAll('[data-stagger]').forEach((el) => {
    if (still) return;
    gsap.fromTo(el.children, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.09, scrollTrigger: { trigger: el, start: at(86) } });
  });
  root.querySelectorAll('[data-img-reveal]').forEach((el) => {
    if (still) return;
    gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 85%' } });
    const img = el.querySelector('img');
    if (img) gsap.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
  });
  root.querySelectorAll('[data-parallax]').forEach((el) => {
    if (still) return;
    const amt = +el.dataset.parallax || 12;
    gsap.fromTo(el, { yPercent: -amt }, { yPercent: amt, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  // words light up as you read
  root.querySelectorAll('[data-fill]').forEach((el) => {
    const words = split(el);
    gsap.set(words, { opacity: 0.18 });
    if (still) return gsap.set(words, { opacity: 1 });
    gsap.to(words, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: el, start: at(78), end: late ? 'bottom 32%' : 'bottom 45%', scrub: true } });
  });
  root.querySelectorAll('[data-count]').forEach((el) => {
    const to = +el.dataset.count; const o = { v: 0 };
    if (still) { el.textContent = to; return; }
    gsap.to(o, { v: to, duration: 2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%' }, onUpdate: () => (el.textContent = Math.round(o.v)) });
  });
}

export function initCursor() {
  if (!fine) return;
  const c = document.createElement('div');
  c.className = 'r-cursor'; c.innerHTML = '<i></i><span></span>';
  document.body.appendChild(c);
  const label = c.querySelector('span');
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; c.classList.add('is-on'); }, { passive: true });
  document.addEventListener('pointerleave', () => c.classList.remove('is-on'));
  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest('[data-cursor], a, button, input, label, [role="button"]');
    c.classList.toggle('is-link', !!t && !t.dataset.cursor);
    c.classList.toggle('is-label', !!t?.dataset.cursor);
    // refined pages: over a real button the cursor steps aside — no label disc covering the button
    c.classList.toggle('is-btn', document.body.hasAttribute('data-refined') && !!t && (t.matches('.r-btn, .r-shop__btn, button') || !!t.closest('.r-btn, .r-shop__btn')));
    label.textContent = t?.dataset.cursor || '';
  });
  gsap.ticker.add(() => {
    cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
    c.style.transform = `translate3d(${cx}px,${cy}px,0)`;
  });
}

export function initMagnetic() {
  if (!fine) return;
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    // refined pages: the same playful pull, a little firmer — less travel, a softer spring
    const calm = document.body.hasAttribute('data-refined');
    const s = (+el.dataset.magnetic || 0.3) * (calm ? 0.7 : 1), ease = calm ? 'elastic.out(1, 0.7)' : 'elastic.out(1, 0.4)', dur = calm ? 1 : 0.8;
    const xTo = gsap.quickTo(el, 'x', { duration: dur, ease });
    const yTo = gsap.quickTo(el, 'y', { duration: dur, ease });
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * s); yTo((e.clientY - r.top - r.height / 2) * s); });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
}

export function initTilt() {
  if (!fine) return;
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    const amt = +el.dataset.tilt || 6;
    el.addEventListener('pointermove', (e) => {
      if (reduced()) return;
      const r = el.getBoundingClientRect(); const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(el, { rotateY: px * amt, rotateX: -py * amt, duration: 0.6, ease: 'power2.out', transformPerspective: 900 });
      el.style.setProperty('--gx', (px + 0.5) * 100 + '%'); el.style.setProperty('--gy', (py + 0.5) * 100 + '%');
    });
    el.addEventListener('pointerleave', () => gsap.to(el, { rotateY: 0, rotateX: 0, duration: 1, ease: 'elastic.out(1,0.5)' }));
  });
}

// Drag-to-scroll strips (touch scrolls natively)
export function initDrag() {
  document.querySelectorAll('[data-drag]').forEach((el) => {
    let down = false, sx = 0, sl = 0, moved = 0;
    el.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = 0; sx = e.clientX; sl = el.scrollLeft; el.classList.add('is-drag'); });
    addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - sx; moved = Math.abs(dx); el.scrollLeft = sl - dx; });
    addEventListener('pointerup', () => { down = false; el.classList.remove('is-drag'); });
    el.addEventListener('click', (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
  });
}

// Occasion accordion: hover/focus/tap to expand
export function initOccasions() {
  document.querySelectorAll('.r-occ__list').forEach((list) => {
    const items = [...list.children];
    const open = (it) => items.forEach((x) => x.classList.toggle('is-open', x === it));
    items.forEach((it) => {
      it.addEventListener('pointerenter', () => fine && open(it));
      it.addEventListener('focusin', () => open(it));
      it.addEventListener('click', (e) => { if (!it.classList.contains('is-open')) { e.preventDefault(); open(it); } });
    });
  });
}

// Header: hide on the way down, show on the way up; mega menu; mobile menu
export function initHeader() {
  const root = document.documentElement;
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    root.classList.toggle('is-scrolled', y > 40);
    if (Math.abs(y - lastY) > 6) { root.classList.toggle('head-hidden', y > lastY && y > 200 && !root.classList.contains('menu-open')); lastY = y; }
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  document.querySelectorAll('[data-mega]').forEach((trigger) => {
    const panel = document.getElementById(trigger.dataset.mega); if (!panel) return;
    let tm;
    const show = () => { clearTimeout(tm); panel.classList.add('is-open'); trigger.setAttribute('aria-expanded', 'true'); };
    const hide = () => { tm = setTimeout(() => { panel.classList.remove('is-open'); trigger.setAttribute('aria-expanded', 'false'); }, 160); };
    [trigger, panel].forEach((n) => { n.addEventListener('pointerenter', show); n.addEventListener('pointerleave', hide); });
    trigger.addEventListener('click', (e) => { e.preventDefault(); panel.classList.contains('is-open') ? hide() : show(); });
    addEventListener('keydown', (e) => e.key === 'Escape' && hide());
  });
  const btn = document.querySelector('[data-menu]'), menu = document.querySelector('.r-menu');
  if (btn && menu) {
    const set = (on) => {
      root.classList.toggle('menu-open', on); btn.setAttribute('aria-expanded', on);
      menu.setAttribute('aria-hidden', !on); on ? lenis?.stop() : lenis?.start();
      if (on && !reduced()) gsap.fromTo(menu.querySelectorAll('.r-menu__big a, .r-menu__foot > *'), { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.05, duration: 0.9, ease: 'expo.out', delay: 0.2 });
    };
    btn.addEventListener('click', () => set(!root.classList.contains('menu-open')));
    menu.addEventListener('click', (e) => e.target.closest('a') && set(false));
    addEventListener('keydown', (e) => e.key === 'Escape' && set(false));
  }
}

// "Add to bag" feedback until the shop is connected
export function initBag() {
  const count = document.querySelectorAll('[data-bag-count]');
  let n = 0;
  const toast = document.createElement('div'); toast.className = 'r-toast'; toast.setAttribute('role', 'status'); document.body.appendChild(toast);
  let tm;
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-add]'); if (!b) return;
    e.preventDefault(); n++;
    count.forEach((c) => { c.textContent = n; c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); });
    b.classList.add('is-added'); const t = b.querySelector('span'); const old = t?.textContent;
    if (t) t.textContent = 'Added'; setTimeout(() => { b.classList.remove('is-added'); if (t) t.textContent = old; }, 1800);
    toast.innerHTML = `<b>${b.dataset.add}</b> was added to your bag. <a href="shop.html">View bag</a>`;
    toast.classList.add('is-on'); clearTimeout(tm); tm = setTimeout(() => toast.classList.remove('is-on'), 3200);
  });
  document.querySelectorAll('[data-newsletter]').forEach((f) => {
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const i = f.querySelector('input'), msg = f.querySelector('.r-form__msg');
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(i.value.trim());
      f.classList.toggle('is-error', !ok); f.classList.toggle('is-done', ok);
      msg.textContent = ok ? 'Welcome to the court. Your first invitation is on its way.' : 'Please enter a full email address, like name@example.com.';
      if (ok) i.value = '';
    });
  });
}

export function initYear() { document.querySelectorAll('[data-year]').forEach((e) => (e.textContent = new Date().getFullYear())); }

// Ensure motion setting changes take effect where they matter
export function watchMotion() { let m = getState().motion; onState((s) => { if (s.motion !== m) { m = s.motion; document.documentElement.dataset.motion = m; } }); }
