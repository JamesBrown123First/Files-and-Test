// Campaign reel: native horizontal scroll (touch/trackpad), mouse drag with inertia,
// arrow buttons, keyboard, progress bar, and a full-screen viewer.
import gsap from 'gsap';
export function initReel() {
  document.querySelectorAll('.r-reel').forEach((sec) => {
    const view = sec.querySelector('.r-reel__view'), items = [...sec.querySelectorAll('.r-reel__item')];
    const bar = sec.querySelector('.r-reel__bar i'), count = sec.querySelector('.r-reel__count b');
    const max = () => view.scrollWidth - view.clientWidth;
    const current = () => { const x = view.scrollLeft + 1; let k = 0; items.forEach((it, i) => { if (it.offsetLeft - items[0].offsetLeft <= x + it.offsetWidth * 0.4) k = i; }); return k; };
    const upd = () => { const p = max() > 0 ? view.scrollLeft / max() : 0; bar.style.transform = `scaleX(${0.06 + p * 0.94})`; count.textContent = String(current() + 1).padStart(2, '0'); };
    view.addEventListener('scroll', upd, { passive: true }); upd();
    const go = (dir) => { const k = Math.max(0, Math.min(items.length - 1, current() + dir)); view.scrollTo({ left: items[k].offsetLeft - items[0].offsetLeft, behavior: 'smooth' }); };
    sec.querySelectorAll('.r-reel__btn').forEach((b) => b.addEventListener('click', () => go(+b.dataset.dir)));
    view.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } });
    // mouse drag (touch uses native scrolling)
    let down = false, sx = 0, sl = 0, moved = 0, vel = 0, lx = 0, raf = 0;
    view.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = 0; sx = lx = e.clientX; sl = view.scrollLeft; vel = 0; cancelAnimationFrame(raf); view.classList.add('is-drag'); });
    addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx)); vel = e.clientX - lx; lx = e.clientX; view.scrollLeft = sl - dx; });
    addEventListener('pointerup', () => {
      if (!down) return; down = false; view.classList.remove('is-drag');
      const glide = () => { if (Math.abs(vel) < 0.4) return; view.scrollLeft -= vel; vel *= 0.94; raf = requestAnimationFrame(glide); }; glide();
    });
    view.addEventListener('click', (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
    // gentle entrance
    gsap.fromTo(items, { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: view, start: 'top 85%' } });
    // viewer
    const lb = document.querySelector('.r-lb'); if (!lb) return;
    const img = lb.querySelector('img'), cap = lb.querySelector('figcaption');
    let at = 0, last = null;
    const show = (k) => { at = (k + items.length) % items.length; const src = items[at].querySelector('img'); img.src = src.dataset.hi; img.alt = src.alt; cap.textContent = `${String(at + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')} · ${items[at].querySelector('figcaption span').textContent}`; lb.classList.toggle('is-spread', items[at].classList.contains('is-spread')); };
    const open = (k) => { last = document.activeElement; show(k); lb.hidden = false; requestAnimationFrame(() => lb.classList.add('is-on')); document.documentElement.classList.add('lb-open'); lb.querySelector('.r-lb__x').focus(); window.__lenis?.stop(); };
    const close = () => { lb.classList.remove('is-on'); setTimeout(() => (lb.hidden = true), 400); document.documentElement.classList.remove('lb-open'); window.__lenis?.start(); last?.focus(); };
    items.forEach((it, k) => it.querySelector('.r-reel__open').addEventListener('click', () => open(k)));
    lb.querySelector('.r-lb__x').addEventListener('click', close);
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    lb.querySelectorAll('.r-lb__nav').forEach((b) => b.addEventListener('click', () => show(at + +b.dataset.dir)));
    addEventListener('keydown', (e) => { if (lb.hidden) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') show(at + 1); if (e.key === 'ArrowLeft') show(at - 1); });
    let tx = 0; lb.addEventListener('touchstart', (e) => (tx = e.touches[0].clientX), { passive: true });
    lb.addEventListener('touchend', (e) => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) show(at + (d < 0 ? 1 : -1)); });
  });
}
