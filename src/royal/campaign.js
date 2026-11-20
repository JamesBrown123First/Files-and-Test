// Campaign gallery: pinned horizontal scroll on large screens, swipe on touch.
// Real ads listed in assets/ads/ads.js replace the designed placeholders automatically.
import { gsap, ScrollTrigger, reduced } from './ui.js';

export function initCampaign() {
  document.querySelectorAll('.r-camp').forEach((sec) => {
    const track = sec.querySelector('.r-camp__track');
    const ads = window.KINGDOM_ADS || [];
    if (ads.length) {
      track.innerHTML = ads.map((a, i) => `<figure class="r-ad r-ad--file r-ad--${a.format || 'post'}"><img src="${a.src}" alt="${a.alt || 'Kingdom campaign ' + (i + 1)}" loading="lazy"><figcaption>${a.caption || ''}</figcaption></figure>`).join('');
    }
    const count = sec.querySelector('[data-camp-count]'); if (count) count.textContent = String(track.children.length).padStart(2, '0');
    const bar = sec.querySelector('.r-camp__bar i');
    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px)', () => {
      if (reduced()) return;
      const dist = () => Math.max(0, track.scrollWidth - innerWidth + parseFloat(getComputedStyle(track).paddingLeft));
      const tw = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: sec, pin: sec.querySelector('.r-camp__pin'), start: 'top top', end: () => '+=' + dist(), scrub: 0.6, invalidateOnRefresh: true, onUpdate: (st) => bar && (bar.style.transform = `scaleX(${st.progress})`) } });
      // cards lean slightly with scroll velocity
      const cards = track.children;
      const lean = gsap.quickTo(cards, 'skewX', { duration: 0.6, ease: 'power3' });
      const st = ScrollTrigger.create({ trigger: sec, start: 'top bottom', end: 'bottom top', onUpdate: (s) => lean(gsap.utils.clamp(-3, 3, s.getVelocity() / -400)) });
      return () => { tw.kill(); st.kill(); };
    });
    mm.add('(max-width: 900px)', () => {
      const f = () => bar && (bar.style.transform = `scaleX(${track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth)})`);
      track.addEventListener('scroll', f, { passive: true });
      return () => track.removeEventListener('scroll', f);
    });
  });
}
