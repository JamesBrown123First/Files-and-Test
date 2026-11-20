// Shared motion layer: smooth scroll, reveals, cursor, magnetic buttons, menu and loader.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { getState, onState } from './state.js';

gsap.registerPlugin(ScrollTrigger, SplitText);
export { gsap, ScrollTrigger };

export const fine = matchMedia('(pointer:fine)').matches;
export const reduced = () => getState().motion === 'reduced';
export let lenis = null;

export function initScroll() {
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, touchMultiplier: 1.4 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href'); if (id.length < 2) { e.preventDefault(); return; }
    const t = document.querySelector(id); if (t) { e.preventDefault(); lenis.scrollTo(t, { duration: 1.6 }); }
  }));
  return lenis;
}

// ---------- reveals ----------
export function initReveals(root = document) {
  const R = reduced();
  root.querySelectorAll('[data-split]').forEach((el) => {
    if (el._split) return;
    const split = new SplitText(el, { type: 'lines,words', linesClass: 'k-line', wordsClass: 'k-word', mask: 'lines' });
    el._split = split;
    if (R) return;
    const delay = parseFloat(el.dataset.delay || 0);
    gsap.set(split.words, { yPercent: 115 });
    const go = () => gsap.to(split.words, { yPercent: 0, duration: 1.35, ease: 'expo.out', stagger: 0.045, delay });
    if (el.hasAttribute('data-manual')) el._reveal = go;
    else ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: go });
  });
  root.querySelectorAll('[data-reveal]').forEach((el) => {
    if (R || el._rv) return; el._rv = 1;
    const kind = el.dataset.reveal;
    const delay = parseFloat(el.dataset.delay || 0);
    const from = kind === 'mask' ? { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.08 } : kind === 'fade' ? { opacity: 0 } : { opacity: 0, y: 28 };
    const to = kind === 'mask' ? { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.6, ease: 'expo.out', delay } : { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay };
    gsap.set(el, from);
    if (el.hasAttribute('data-manual')) el._reveal = () => gsap.to(el, to);
    else ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => gsap.to(el, to) });
  });
  root.querySelectorAll('[data-scrub-words]').forEach((el) => {
    const split = new SplitText(el, { type: 'words', wordsClass: 'k-sw' });
    if (R) return;
    gsap.fromTo(split.words, { opacity: 0.16 }, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 } });
  });
  root.querySelectorAll('[data-parallax]').forEach((el) => {
    if (R) return;
    const amt = parseFloat(el.dataset.parallax);
    gsap.fromTo(el, { yPercent: -amt * 50 }, { yPercent: amt * 50, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  root.querySelectorAll('[data-draw]').forEach((el) => {
    if (R) return;
    gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
  });
}

// ---------- cursor ----------
export function initCursor() {
  if (!fine) return null;
  const c = document.createElement('div');
  c.className = 'k-cursor';
  c.innerHTML = '<span class="k-cursor__ring"><span class="k-cursor__label"></span></span><span class="k-cursor__dot"></span>';
  document.body.appendChild(c);
  const ring = c.firstChild, dot = c.lastChild, label = c.querySelector('.k-cursor__label');
  const pos = { x: innerWidth / 2, y: innerHeight / 2 }, r = { x: pos.x, y: pos.y };
  let hidden = true;
  addEventListener('pointermove', (e) => {
    pos.x = e.clientX; pos.y = e.clientY;
    if (hidden) { hidden = false; c.classList.add('is-on'); r.x = pos.x; r.y = pos.y; }
  }, { passive: true });
  document.addEventListener('pointerleave', () => { hidden = true; c.classList.remove('is-on'); });
  addEventListener('pointerdown', () => c.classList.add('is-down'));
  addEventListener('pointerup', () => c.classList.remove('is-down'));
  let curLabel = '';
  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest('[data-cursor], a, button, input, label, [role="button"]');
    const txt = t?.dataset?.cursor || '';
    c.classList.toggle('is-link', !!t && !txt);
    c.classList.toggle('is-label', !!txt);
    c.classList.toggle('is-hide', t?.dataset?.cursor === 'none');
    if (txt !== curLabel) { curLabel = txt; label.textContent = txt === 'none' ? '' : txt; }
  });
  gsap.ticker.add((time, dms) => {
    const k = 1 - Math.pow(0.0008, (dms || 16) / 1000);
    r.x += (pos.x - r.x) * k; r.y += (pos.y - r.y) * k;
    dot.style.transform = `translate3d(${pos.x}px,${pos.y}px,0)`;
    ring.style.transform = `translate3d(${r.x}px,${r.y}px,0)`;
  });
  return c;
}

export function initMagnetic(root = document) {
  if (!fine) return;
  root.querySelectorAll('[data-magnetic]').forEach((el) => {
    const s = parseFloat(el.dataset.magnetic || 0.3);
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1,0.45)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1,0.45)' });
    el.addEventListener('pointermove', (e) => { const b = el.getBoundingClientRect(); xTo((e.clientX - b.left - b.width / 2) * s); yTo((e.clientY - b.top - b.height / 2) * s); });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
}

export function initTilt(root = document) {
  if (!fine) return;
  root.querySelectorAll('[data-tilt]').forEach((el) => {
    const a = parseFloat(el.dataset.tilt || 6);
    const inner = el.firstElementChild || el;
    el.addEventListener('pointermove', (e) => {
      const b = el.getBoundingClientRect(); const x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
      gsap.to(inner, { rotateY: x * a, rotateX: -y * a, duration: 0.9, ease: 'power3.out', transformPerspective: 900 });
      el.style.setProperty('--mx', (x + 0.5) * 100 + '%'); el.style.setProperty('--my', (y + 0.5) * 100 + '%');
    });
    el.addEventListener('pointerleave', () => gsap.to(inner, { rotateY: 0, rotateX: 0, duration: 1.2, ease: 'elastic.out(1,0.5)' }));
  });
}

// ---------- full-screen menu ----------
export function initMenu(btn, links) {
  if (!btn) return;
  const m = document.createElement('div');
  m.className = 'k-menu'; m.setAttribute('aria-hidden', 'true');
  m.innerHTML = `<div class="k-menu__inner">
    <nav class="k-menu__nav" aria-label="Main">${links.map((l, i) => `<a href="${l[1]}" class="k-menu__link"><span class="k-menu__n">0${i + 1}</span><span class="k-menu__t">${l[0]}</span></a>`).join('')}</nav>
    <div class="k-menu__aside"><p class="k-eyebrow">Kingdom · Silver Collection</p><p class="k-menu__line">Filled with silver.<br>Beautifully gifted.<br>Priced within reach.</p></div>
  </div>`;
  document.body.appendChild(m);
  let open = false;
  const items = m.querySelectorAll('.k-menu__t, .k-menu__n, .k-menu__aside > *');
  const set = (v) => {
    open = v; btn.classList.toggle('is-open', v); btn.setAttribute('aria-expanded', v); m.setAttribute('aria-hidden', !v);
    document.documentElement.classList.toggle('menu-open', v);
    const b = btn.getBoundingClientRect(); const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
    const R = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy));
    gsap.killTweensOf([m, items]);
    if (v) {
      lenis?.stop(); m.style.visibility = 'visible';
      gsap.fromTo(m, { clipPath: `circle(0px at ${cx}px ${cy}px)` }, { clipPath: `circle(${R}px at ${cx}px ${cy}px)`, duration: 1.1, ease: 'expo.inOut' });
      gsap.fromTo(items, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: 0.05, delay: 0.35 });
    } else {
      lenis?.start();
      gsap.to(m, { clipPath: `circle(0px at ${cx}px ${cy}px)`, duration: 0.85, ease: 'expo.inOut', onComplete: () => { m.style.visibility = 'hidden'; } });
    }
  };
  btn.setAttribute('aria-expanded', 'false');
  btn.addEventListener('click', () => set(!open));
  m.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => set(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) set(false); });
}

// ---------- loader ----------
export function initLoader() {
  const el = document.querySelector('.k-loader');
  let shown = 0, target = 0, finished = false, resolveDone;
  const done = new Promise((r) => (resolveDone = r));
  const bar = el?.querySelector('.k-loader__bar i'), num = el?.querySelector('.k-loader__num');
  let last = performance.now();
  const tick = (now = performance.now()) => {
    if (!el) return;
    const dt = Math.min(0.25, (now - last) / 1000); last = now;
    shown += (target - shown) * (1 - Math.exp(-dt * 7));
    if (finished && shown > 0.97) shown = 1;
    if (bar) bar.style.transform = `scaleX(${shown})`;
    if (num) num.textContent = String(Math.round(shown * 100)).padStart(3, '0');
    if (finished && shown > 0.995) { finish(); return; }
    requestAnimationFrame(tick);
  };
  const finish = () => {
    document.documentElement.classList.add('is-loaded');
    gsap.to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.25, ease: 'expo.inOut', delay: 0.15, onComplete: () => { el.remove(); } });
    setTimeout(resolveDone, 650);
  };
  if (el) requestAnimationFrame(tick); else { document.documentElement.classList.add('is-loaded'); resolveDone(); }
  return {
    progress: (p) => { target = Math.max(target, Math.min(1, p)); },
    done: () => { target = 1; finished = true; if (!el) resolveDone(); },
    ready: done
  };
}

export function onStateChange(fn) { return onState(fn); }
