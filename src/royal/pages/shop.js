import { boot, getLenis } from '../boot.js';
const { loader, start } = boot({ id: 'shop', name: 'Shop', preset: 'royal-shop', presets: ['royal-shop', 'royal-night', 'blush-atelier', 'pearl'] });

// announcement bar: the two lines take turns, as on the landing page
function ann() {
  const items = [...document.querySelectorAll('.rg2-ann__rot span')]; if (items.length < 2) return;
  let i = 0; setInterval(() => { items[i].classList.remove('is-on'); i = (i + 1) % items.length; items[i].classList.add('is-on'); }, 4200);
}

// the shop: filter by category or by occasion, sort, and let the cards fall into place
function shop() {
  const grid = document.querySelector('.sp-grid'); if (!grid) return;
  const cards = [...grid.querySelectorAll('.sp-card')];
  const chips = [...document.querySelectorAll('.sp-chip')];
  const sel = document.querySelector('.sp-sort select');
  const tag = document.querySelector('.sp-occ-tag');
  let cat = 'all', occ = '', sort = 'featured';
  const render = () => {
    const list = cards.filter((c) => (cat === 'all' || c.dataset.cat === cat) && (!occ || c.dataset.occ.split(' ').includes(occ)));
    const by = { featured: (a, b) => a.dataset.i - b.dataset.i, name: (a, b) => a.dataset.name.localeCompare(b.dataset.name),
      low: (a, b) => (+a.dataset.price || 1e9) - (+b.dataset.price || 1e9), high: (a, b) => (+b.dataset.price || -1) - (+a.dataset.price || -1) }[sort];
    const first = new Map(cards.map((c) => [c, c.getBoundingClientRect()]));
    cards.forEach((c) => (c.hidden = !list.includes(c)));
    list.sort(by).forEach((c) => grid.appendChild(c));
    list.forEach((c, k) => { // glide each card from where it was to its new place
      const a = first.get(c), b = c.getBoundingClientRect();
      if (a.width) c.animate([{ transform: `translate(${a.left - b.left}px,${a.top - b.top}px)` }, { transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.2,.7,.2,1)' });
      else c.animate([{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: k * 30, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' });
    });
    grid.classList.toggle('is-empty', !list.length);
  };
  chips.forEach((b) => b.addEventListener('click', () => {
    cat = b.dataset.cat; chips.forEach((x) => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b); }); render();
  }));
  sel?.addEventListener('change', () => { sort = sel.value; render(); });
  const setOcc = (k, label) => {
    occ = k; tag.hidden = !k; if (k) tag.querySelector('span').textContent = `Gift ideas · ${label}`;
    cat = 'all'; chips.forEach((x) => { x.classList.toggle('is-on', x.dataset.cat === 'all'); x.setAttribute('aria-pressed', x.dataset.cat === 'all'); });
    render();
  };
  tag?.querySelector('button').addEventListener('click', () => setOcc('', ''));
  document.querySelectorAll('.sp-occ__tile').forEach((t) => t.addEventListener('click', () => {
    setOcc(t.dataset.occ, t.querySelector('span').textContent);
    const y = document.querySelector('.sp-grid').getBoundingClientRect().top + scrollY - 90;
    const L = getLenis(); L ? L.scrollTo(y, { duration: 1.2 }) : scrollTo({ top: y, behavior: 'smooth' });
  }));
}

loader.finish().then(() => { ann(); shop(); return start(); });
