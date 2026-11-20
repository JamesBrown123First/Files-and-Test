// Magnifying loupe over the ewer photograph (shared by Regalia and Majesty).
import { gsap, reduced, fine } from './boot.js';

// loupe: lens follows the pointer; otherwise rests on the chosen detail
const SPOTS = [[0.47, 0.085], [0.18, 0.235], [0.86, 0.3], [0.5, 0.6], [0.5, 0.91]];
export function initLoupe() {
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

