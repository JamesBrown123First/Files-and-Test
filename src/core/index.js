import { initState, getState, onState } from './state.js';
import { initBackground } from './bg.js';
import { initScroll, initReveals, initCursor, initMagnetic, initTilt, initMenu, initLoader, gsap, ScrollTrigger, fine, reduced } from './ui.js';
import { initEditor } from './editor.js';

export { gsap, ScrollTrigger, fine, reduced, getState, onState, initReveals };

export const LINKS = [['Collection', '#collection'], ['Our Story', '#story'], ['Gifting', '#gifting'], ['Visit', '#visit']];

export function boot(cfg) {
  initState(cfg);
  const loader = initLoader();
  initBackground();
  initScroll();
  initCursor();
  initMenu(document.querySelector('[data-menu]'), LINKS);
  initEditor();
  // header: hide on the way down, return on the way up
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY, root = document.documentElement;
    root.classList.toggle('is-scrolled', y > 40);
    if (Math.abs(y - lastY) > 6) { root.classList.toggle('head-hidden', y > lastY && y > 160); lastY = y; }
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  // Year in footers
  document.querySelectorAll('[data-year]').forEach((e) => (e.textContent = new Date().getFullYear()));
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  const start = async () => {
    await fonts;
    initReveals();
    initMagnetic();
    initTilt();
    ScrollTrigger.refresh();
  };
  return { loader, start, fonts };
}

// Wait for images to decode, reporting progress (used by the photograph concepts)
export function preloadImages(urls, onProgress) {
  let n = 0;
  return Promise.all(urls.map((u) => new Promise((res) => {
    const i = new Image(); i.decoding = 'async'; i.src = u;
    const done = () => { n++; onProgress?.(n / urls.length); res(i); };
    (i.decode ? i.decode() : new Promise((r) => (i.onload = r))).then(done, done);
  })));
}
