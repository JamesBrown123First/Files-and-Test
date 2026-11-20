// Shared effects for the round-four photograph directions.
import { gsap, reduced, fine } from './boot.js';

// Smoothed pointer in -1..1 (wanders gently on touch / when idle)
export const pointer = { x: 0, y: 0, tx: 0, ty: 0, vx: 0, idle: 0 };
let started = false;
export function trackPointer() {
  if (started) return pointer; started = true;
  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    pointer.tx = (e.clientX / innerWidth) * 2 - 1; pointer.ty = (e.clientY / innerHeight) * 2 - 1; pointer.idle = 0;
  }, { passive: true });
  gsap.ticker.add((t, dt) => {
    pointer.idle += dt;
    if (!fine || pointer.idle > 4000) { pointer.tx = Math.sin(t * 0.32) * 0.6; pointer.ty = Math.cos(t * 0.27) * 0.3; }
    if (reduced()) { pointer.tx = 0.2; pointer.ty = 0; }
    const px = pointer.x;
    pointer.x += (pointer.tx - pointer.x) * 0.06; pointer.y += (pointer.ty - pointer.y) * 0.06;
    pointer.vx = pointer.x - px;
  });
  return pointer;
}

// A band of light that follows the pointer across a masked photograph (sets --sx on el)
export function sheen(el) {
  trackPointer();
  gsap.ticker.add(() => el.style.setProperty('--sx', (50 + pointer.x * 62).toFixed(2) + '%'));
}

// Subtle 3D tilt of an element toward the pointer
export function tilt3d(el, amt = 5) {
  trackPointer();
  gsap.ticker.add(() => { el.style.transform = `perspective(1400px) rotateY(${(pointer.x * amt).toFixed(3)}deg) rotateX(${(-pointer.y * amt * 0.5).toFixed(3)}deg)`; });
}

// Split a heading's text into masked lines/words for reveals (keeps <em>)
export function words(el) {
  if (!el || el.dataset.words) return [];
  el.dataset.words = 1;
  const out = [];
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((w) => {
          if (!w) return;
          if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
          const s = document.createElement('span'); s.className = 'w'; const i = document.createElement('i'); i.textContent = w; s.appendChild(i); frag.appendChild(s); out.push(i);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
    });
  };
  walk(el);
  return out;
}
