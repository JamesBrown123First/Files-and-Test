import { initState, getState, onState } from './state.js';
import { initBackground } from './bg.js';
import { initScroll, initReveals, initCursor, initMagnetic, initTilt, initDrag, initOccasions, initHeader, initBag, initYear, initLoader, gsap, ScrollTrigger, fine, reduced, split, lenis } from './ui.js';
import { initEditor } from './editor.js';
import { initCampaign } from './campaign.js';
import { initGift } from './gift.js';
import { initReel } from './reel.js';
export { gsap, ScrollTrigger, fine, reduced, getState, onState, split, initReveals };
export const getLenis = () => lenis;

export function boot(cfg) {
  initState(cfg);
  const loader = initLoader();
  initBackground();
  initScroll();
  initHeader();
  initCursor();
  initEditor();
  initBag();
  initYear();
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  const start = async () => {
    await fonts;
    initReveals();
    initMagnetic();
    initTilt();
    initDrag();
    initOccasions();
    initCampaign();
    initGift();
    initReel();
    ScrollTrigger.refresh();
  };
  return { loader, start, fonts };
}

export function preloadImages(urls, onProgress) {
  let n = 0;
  return Promise.all(urls.map((u) => new Promise((res) => {
    const i = new Image(); i.decoding = 'async'; i.src = u;
    const done = () => { n++; onProgress?.(n / urls.length); res(i); };
    (i.decode ? i.decode() : new Promise((r) => (i.onload = r))).then(done, done);
  })));
}
