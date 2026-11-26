import { boot } from '../boot.js';
const { loader, start } = boot({ id: 'shop', name: 'Shop', preset: 'royal-shop', presets: ['royal-shop', 'royal-night', 'blush-atelier', 'pearl'] });

// announcement bar: the two lines take turns, as on the landing page
function ann() {
  const items = [...document.querySelectorAll('.rg2-ann__rot span')]; if (items.length < 2) return;
  let i = 0; setInterval(() => { items[i].classList.remove('is-on'); i = (i + 1) % items.length; items[i].classList.add('is-on'); }, 4200);
}

// the shop: one row of filters (categories and occasions) with search on the left and sort on the right.
// "All pieces" is the default; tapping the active filter again returns to it.
function shop() {
  const grid = document.querySelector('.sp-grid'); if (!grid) return;
  const cards = [...grid.querySelectorAll('.sp-card')];
  const chips = [...document.querySelectorAll('.sp-chip')];
  const sel = document.querySelector('.sp-sort select');
  const q = document.querySelector('.sp-search input');
  let active = chips.find((c) => c.dataset.cat === 'all'), sort = 'featured', term = '';
  // each card's searchable words: its own text plus the names of its occasions and its category
  const occName = Object.fromEntries(chips.filter((c) => c.dataset.occ).map((c) => [c.dataset.occ, c.textContent.trim()]));
  occName.shabbos = 'Shabbos & Yom Tov';
  cards.forEach((c) => (c.dataset.words = (c.textContent + ' ' + c.dataset.occ.split(' ').map((k) => occName[k] || k.replace('-', ' ')).join(' ')).toLowerCase()));
  const match = (c) => {
    const d = active.dataset;
    const ok = d.cat ? (d.cat === 'all' || c.dataset.cat === d.cat) : c.dataset.occ.split(' ').includes(d.occ);
    return ok && (!term || term.split(/\s+/).every((w) => c.dataset.words.includes(w)));
  };
  const render = () => {
    const list = cards.filter(match);
    const by = { featured: (a, b) => a.dataset.i - b.dataset.i, name: (a, b) => a.dataset.name.localeCompare(b.dataset.name),
      low: (a, b) => (+a.dataset.price || 1e9) - (+b.dataset.price || 1e9), high: (a, b) => (+b.dataset.price || -1) - (+a.dataset.price || -1) }[sort];
    const first = new Map(cards.map((c) => [c, c.getBoundingClientRect()]));
    cards.forEach((c) => (c.hidden = !list.includes(c)));
    list.sort(by).forEach((c) => grid.appendChild(c));
    list.forEach((c, k) => {
      const a = first.get(c), b = c.getBoundingClientRect();
      if (a.width) c.animate([{ transform: `translate(${a.left - b.left}px,${a.top - b.top}px)` }, { transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.2,.7,.2,1)' });
      else c.animate([{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: k * 30, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' });
    });
    grid.classList.toggle('is-empty', !list.length);
  };
  const setActive = (b) => {
    active = b; chips.forEach((x) => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b); });
    b.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' }); render();
  };
  const all = chips.find((c) => c.dataset.cat === 'all');
  chips.forEach((b) => b.addEventListener('click', () => setActive(b === active && b !== all ? all : b)));
  sel?.addEventListener('change', () => { sort = sel.value; render(); });
  // the filter row: the mouse wheel scrolls it sideways while the pointer is over it (the page carries on once it reaches an end);
  // it can also be dragged with the mouse
  const row = document.querySelector('.sp-chips');
  if (row) {
    row.addEventListener('wheel', (e) => {
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const max = row.scrollWidth - row.clientWidth;
      if (max <= 0 || (d < 0 && row.scrollLeft <= 0) || (d > 0 && row.scrollLeft >= max - 1)) return;
      e.preventDefault(); e.stopPropagation(); row.scrollLeft += d;
    }, { passive: false });
    let down = null, moved = false;
    row.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = { x: e.clientX, l: row.scrollLeft }; moved = false; });
    addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - down.x; if (Math.abs(dx) > 4) moved = true; row.scrollLeft = down.l - dx; });
    addEventListener('pointerup', () => { down = null; });
    row.addEventListener('click', (e) => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
  }
  q?.addEventListener('input', () => { term = q.value.trim().toLowerCase(); render(); });
}

loader.finish().then(() => { ann(); shop(); return start(); });
