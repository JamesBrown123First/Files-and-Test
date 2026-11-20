// HTML partials for the Royal concepts. Each section has variants so the pages differ in
// structure, not just colour. Built to static HTML by src/royal/build-pages.mjs.
import { readFileSync } from 'node:fs';
const ROOT = new URL('../../', import.meta.url).pathname;
export const sprite = readFileSync(ROOT + 'assets/royal/sprite.svg.html', 'utf8');

export const logo = (id, cls = '', label = '') => `<svg class="k-logo k-logo--${id.replace('k-', '')} ${cls}" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}><use href="#${id}"/></svg>`;
const arrow = '<svg class="r-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
const bag = '<svg class="r-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 8.5h13l-1 11.5h-11z"/><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5"/></svg>';
const search = '<svg class="r-ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>';
const crown = '<svg class="r-crown" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 18h18M4 16l1.6-9 4.4 4.6L12 5l2 6.6L18.4 7 20 16z"/></svg>';
export const icons = { arrow, bag, search, crown };

export const COPY = {
  h1a: 'The Art of', h1b: 'Silver', h1c: 'Gifting.',
  sub: 'Filled with silver. Given with pride.',
  story1: 'Kingdom was created to redefine silver gifting, bringing the beauty, presence, and elegance of silver to a price that makes generous giving possible.',
  story2: 'From carefully selected silver-filled pieces to thoughtful packaging, every detail is designed to make giving feel elevated.',
  close: ['Filled with silver.', 'Beautifully gifted.', 'Priced within reach.'],
  slogan: 'A Royal Touch.'
};

export const PRODUCTS = [
  { id: 'set', name: 'The Baroque Set', line: 'Ewer and basin, presented together', img: 'assets/img/pair.webp', kind: 'photo', tag: 'Signature' },
  { id: 'ewer', name: 'The Baroque Ewer', line: 'Acanthus relief, flared spout, crowned stopper', img: 'assets/img/ewer-1400.webp', kind: 'cut', tag: 'New' },
  { id: 'basin', name: 'The Baroque Basin', line: 'Pierced scroll rim, engraved foliage', img: 'assets/img/basin-1024.webp', kind: 'cut', tag: '' }
];

export const OCCASIONS = [
  ['Shabbos & Yom Tov', 'For the table that gathers everyone.', 'assets/royal/o-1.webp'],
  ['Weddings', 'A first heirloom for a new home.', 'assets/royal/o-2.webp'],
  ['Bar Mitzvah', 'A milestone worth keeping.', 'assets/royal/o-5.webp'],
  ['New Home', 'Silver that makes a house feel finished.', 'assets/royal/o-4.webp'],
  ['Chanukah', 'Light, reflected beautifully.', 'assets/royal/o-3.webp'],
  ['Thank You', 'Gratitude, with presence.', 'assets/royal/o-6.webp']
];

export const DETAILS = [
  ['The Crowned Stopper', 'An ovoid finial wrapped in acanthus, set on a fluted collar.', 'assets/royal/d-finial.webp'],
  ['The Flared Spout', 'A mirror-polished lip that catches every light in the room.', 'assets/royal/d-spout.webp'],
  ['The Scroll Handle', 'A beaded, leaf-capped handle that curls into a single bead.', 'assets/royal/d-handle.webp'],
  ['The Acanthus Body', 'Deep relief over a finely stippled ground, so the polish reads brighter.', 'assets/royal/d-body.webp'],
  ['The Footed Base', 'Pierced scrolled feet that lift the piece like a crown on a cushion.', 'assets/royal/d-base.webp']
];

export function head({ id, title, css, preloadModel }) {
  return `<!DOCTYPE html>
<html lang="en" data-mode="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="Kingdom Silver Collection — the art of silver gifting. Filled with silver. Given with pride.">
<meta name="theme-color" content="#131c2b">
<link rel="icon" href="assets/img/logo-icon.svg" type="image/svg+xml">
${preloadModel ? '<link rel="preload" href="assets/model/ewer-2k.glb" as="fetch" crossorigin>' : ''}
<link rel="stylesheet" href="css/royal.css">
<link rel="stylesheet" href="css/royal-${id}.css">
<script src="kingdom.config.js"></script>
<script src="assets/ads/ads.js"></script>
</head>`;
}

export function loader(word = 'Kingdom') {
  return `<div class="r-loader" role="status" aria-label="Loading">
  <div class="r-loader__in">${logo('k-icon', 'r-loader__mark')}
    <div class="r-loader__bar"><i></i></div>
    <div class="r-loader__row"><span>${word}</span><span class="r-loader__num">000</span></div>
  </div>
</div>`;
}

export function announce(text = 'Every piece arrives gift-ready in Kingdom packaging') {
  return `<div class="r-announce"><p>${crown}<span>${text}</span><a href="#collection">Shop the collection ${arrow}</a></p></div>`;
}

export function header(variant = 'center') {
  const occ = OCCASIONS.map(([n, l]) => `<a href="#occasions"><b>${n}</b><span>${l}</span></a>`).join('');
  return `<header class="r-head r-head--${variant}">
  <nav class="r-head__nav r-head__nav--l" aria-label="Main">
    <a href="shop.html" class="r-head__shop">Shop</a>
    <button type="button" data-mega="mega-occ" aria-expanded="false">Occasions</button>
    <a href="#collection">Collection</a>
  </nav>
  <a class="r-head__logo" href="#top" aria-label="Kingdom Silver Collection — home">${logo(variant === 'left' ? 'k-name' : 'k-icon')}</a>
  <div class="r-head__nav r-head__nav--r">
    <a href="#story" class="r-hide-m">Our Story</a>
    <a href="#concierge" class="r-hide-m">Concierge</a>
    <a href="shop.html" class="r-head__icon" aria-label="Search">${search}</a>
    <a href="shop.html" class="r-head__icon r-head__bag" aria-label="Bag">${bag}<b data-bag-count>0</b></a>
    <button class="r-burger" type="button" data-menu aria-expanded="false" aria-label="Menu"><i></i><i></i></button>
  </div>
  <div class="r-mega" id="mega-occ">
    <div class="r-mega__in">
      <div class="r-mega__links">${occ}</div>
      <a class="r-mega__card" href="#collection"><img src="assets/royal/o-1.webp" alt="" loading="lazy"><span>The Baroque Collection</span><b>Shop now ${arrow}</b></a>
    </div>
  </div>
</header>
<div class="r-menu" aria-hidden="true">
  <nav class="r-menu__big"><a href="shop.html">Shop</a><a href="#occasions">Occasions</a><a href="#collection">Collection</a><a href="#story">Our Story</a><a href="#concierge">Concierge</a></nav>
  <div class="r-menu__foot"><p>${COPY.slogan}</p><a href="#concierge">Gift concierge ${arrow}</a></div>
</div>`;
}

export function ticker(items = ['Filled with silver', 'Given with pride', 'Gift-ready packaging', 'A royal touch', 'Priced within reach'], cls = '') {
  const row = items.map((t) => `<span>${t}</span>${crown}`).join('');
  return `<div class="r-ticker ${cls}" aria-label="${items.join(', ')}"><div class="r-ticker__run" aria-hidden="true">${row}${row}${row}</div></div>`;
}

export function occasions(variant = 'accordion', heading = 'A gift for every<br><em>occasion</em>') {
  const items = OCCASIONS.map(([n, l, img], i) => `<a class="r-occ__item${i === 0 ? ' is-open' : ''}" href="shop.html" data-cursor="Explore">
      <img src="${img}" alt="" loading="lazy">
      <span class="r-occ__num">0${i + 1}</span>
      <span class="r-occ__v">${n}</span>
      <span class="r-occ__body"><b>${n}</b><span>${l}</span><em>Shop ${arrow}</em></span>
    </a>`).join('');
  return `<section class="r-occ r-occ--${variant}" id="occasions" aria-label="Shop by occasion">
  <div class="r-sec-head">
    <p class="r-label" data-reveal>Shop by occasion</p>
    <h2 class="r-h2" data-split>${heading}</h2>
    <p class="r-lead" data-reveal>Choose the moment. We’ll help you choose the silver.</p>
  </div>
  <div class="r-occ__list" data-drag>${items}</div>
</section>`;
}

export function collection(variant = 'arch', heading = 'The Baroque<br><em>Collection</em>') {
  const cards = PRODUCTS.map((p, i) => `<article class="r-prod r-prod--${p.id}" data-reveal data-delay="${i * 0.08}">
      <a class="r-prod__media r-prod__media--${p.kind}" href="shop.html" data-tilt="5" data-cursor="View">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        ${p.tag ? `<span class="r-prod__tag">${p.tag}</span>` : ''}
        <span class="r-prod__glare" aria-hidden="true"></span>
      </a>
      <div class="r-prod__meta">
        <div><h3>${p.name}</h3><p>${p.line}</p></div>
        <button class="r-prod__add" type="button" data-add="${p.name}" aria-label="Add ${p.name} to bag">${bag}<span>Add</span></button>
      </div>
    </article>`).join('');
  return `<section class="r-coll r-coll--${variant}" id="collection" aria-label="The Baroque Collection">
  <div class="r-sec-head r-sec-head--row">
    <div><p class="r-label" data-reveal>The collection</p><h2 class="r-h2" data-split>${heading}</h2></div>
    <a class="r-link" href="shop.html" data-reveal>View all pieces ${arrow}</a>
  </div>
  <div class="r-coll__grid">${cards}
    <article class="r-prod r-prod--soon" data-reveal data-delay=".24">
      <div class="r-prod__media r-prod__media--soon">${logo('k-icon')}<p>More pieces are being prepared for the collection.</p><a class="r-link" href="#concierge">Be the first to know ${arrow}</a></div>
    </article>
  </div>
</section>`;
}

export function story(variant = 'center') {
  return `<section class="r-story r-story--${variant}" id="story" aria-label="Our story">
  <div class="r-story__seal" aria-hidden="true">
    <svg viewBox="0 0 200 200"><defs><path id="seal-${variant}" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"/></defs>
      <text><textPath href="#seal-${variant}">KINGDOM · SILVER COLLECTION · A ROYAL TOUCH · </textPath></text></svg>
    ${logo('k-icon')}
  </div>
  <p class="r-label" data-reveal>Our story</p>
  <p class="r-story__big" data-fill>${COPY.story1}</p>
  <div class="r-story__row">
    <p class="r-lead" data-reveal>${COPY.story2}</p>
    <p class="r-story__close" data-stagger>${COPY.close.map((c) => `<span>${c}</span>`).join('')}</p>
  </div>
</section>`;
}

export function gift() {
  return `<section class="r-gift" id="gifting" aria-label="The gift experience">
  <div class="r-gift__pin">
    <div class="r-gift__copy">
      <p class="r-label">The gift</p>
      <h2 class="r-h2">Given with<br><em>pride.</em></h2>
      <ol class="r-gift__steps">
        <li class="is-on"><b>01</b><span><strong>Choose your piece</strong>From the collection, or with our concierge.</span></li>
        <li><b>02</b><span><strong>Dressed in Kingdom</strong>Navy and blush packaging, ribboned and sealed.</span></li>
        <li><b>03</b><span><strong>Your words, on a card</strong>A handwritten-style note tucked inside.</span></li>
        <li><b>04</b><span><strong>Ready to give</strong>Delivered to you, or straight to them.</span></li>
      </ol>
    </div>
    <div class="r-gift__scene" aria-hidden="true">
      <div class="r-box">
        <img class="r-box__piece" src="assets/img/ewer-800.webp" alt="">
        <div class="r-box__base"><span class="r-box__ribbon-v"></span>${logo('k-full', 'r-box__foil')}</div>
        <div class="r-box__lid"><span class="r-box__ribbon-v"></span><span class="r-box__ribbon-h"></span><span class="r-box__bow"></span></div>
        <div class="r-box__card"><span>For you,</span><em>with love.</em>${logo('k-icon')}</div>
      </div>
    </div>
  </div>
</section>`;
}

const AD_SET = [
  ['post', 'A Royal Touch.', 'assets/img/pair.webp', 'cover'],
  ['story', 'The Baroque Ewer', 'assets/img/ewer-1400.webp', 'cut'],
  ['wide', 'Filled with silver.<br><em>Given with pride.</em>', 'assets/royal/d-body.webp', 'cover'],
  ['post', 'For the table that gathers everyone.', 'assets/royal/o-1.webp', 'cover'],
  ['story', 'The Baroque Basin', 'assets/img/basin-1024.webp', 'cut'],
  ['post', 'Priced within reach.', 'assets/royal/d-finial.webp', 'cover']
];
export function campaign(heading = 'The <em>campaign</em>') {
  const ads = AD_SET.map(([f, t, img, mode], i) => `<figure class="r-ad r-ad--${f} r-ad--${mode} r-ad--t${i % 3}">
      <img src="${img}" alt="" loading="lazy">
      <figcaption>${logo('k-icon')}<span>${t}</span><small>kingdom · silver collection</small></figcaption>
    </figure>`).join('');
  return `<section class="r-camp" id="campaign" aria-label="Campaign gallery">
  <div class="r-camp__pin">
    <div class="r-camp__head">
      <div><p class="r-label">As seen in our ads</p><h2 class="r-h2">${heading}</h2></div>
      <p class="r-camp__meta"><span data-camp-count>06</span> pieces <span class="r-camp__bar"><i></i></span><span class="r-hide-m">Scroll</span></p>
    </div>
    <div class="r-camp__track" data-drag>${ads}</div>
  </div>
</section>`;
}

export function shopNow(variant = 'grand') {
  return `<section class="r-shop r-shop--${variant}" id="shop" aria-label="Shop now">
  <img class="r-shop__basin" src="assets/img/basin-1200.webp" alt="" aria-hidden="true" loading="lazy">
  <div class="r-shop__in">
    <p class="r-label" data-reveal>The shop is open</p>
    <h2 class="r-shop__title" data-split><span>Shop</span> <em>now</em></h2>
    <p class="r-lead" data-reveal>Silver-filled pieces, gift-boxed and priced within reach.</p>
    <a class="r-shop__btn" href="shop.html" data-magnetic="0.35" data-cursor="Enter"><span>Enter the shop</span>${arrow}</a>
    <nav class="r-shop__quick" aria-label="Quick links" data-stagger>
      <a href="shop.html">The Ewer ${arrow}</a><a href="shop.html">The Basin ${arrow}</a><a href="shop.html">The Set ${arrow}</a><a href="#occasions">By occasion ${arrow}</a>
    </nav>
  </div>
</section>`;
}

export function concierge() {
  return `<section class="r-conc" id="concierge" aria-label="Gift concierge">
  <div class="r-conc__card" data-reveal>
    <p class="r-label">Gift concierge</p>
    <h2 class="r-h3">Not sure what to give?</h2>
    <p>Tell us who it’s for, the occasion and your budget. We’ll suggest three pieces and handle the wrapping.</p>
    <div class="r-conc__btns"><a class="r-btn" href="#concierge" data-magnetic="0.2"><span>Chat with us</span>${arrow}</a><a class="r-btn r-btn--ghost" href="#concierge"><span>Book a private viewing</span></a></div>
  </div>
  <form class="r-conc__card r-form" data-newsletter novalidate data-reveal data-delay=".1">
    <p class="r-label">Join the court</p>
    <h2 class="r-h3">First to see new pieces.</h2>
    <label class="r-form__field"><span class="r-sr">Email address</span><input type="email" placeholder="Your email address" autocomplete="email" required><button type="submit" aria-label="Join">${arrow}</button></label>
    <p class="r-form__msg" role="status">One letter a month. Unsubscribe anytime.</p>
  </form>
</section>`;
}

export function footer() {
  return `<footer class="r-foot">
  <div class="r-foot__cols">
    <div><h3>Shop</h3><a href="shop.html">The Baroque Collection</a><a href="#occasions">Occasions</a><a href="shop.html">Gift sets</a><a href="shop.html">New pieces</a></div>
    <div><h3>Kingdom</h3><a href="#story">Our story</a><a href="#concierge">Gift concierge</a><a href="#campaign">Campaign</a></div>
    <div><h3>Care</h3><a href="#concierge">Shipping &amp; returns</a><a href="#concierge">Caring for silver</a><a href="#concierge">Contact</a></div>
    <div class="r-foot__social"><h3>Follow</h3><a href="#concierge">Instagram</a><a href="#concierge">WhatsApp</a></div>
  </div>
  <a class="r-foot__mark" href="#top" aria-label="Back to top">${logo('k-name')}</a>
  <div class="r-foot__base"><span>© <span data-year>2026</span> Kingdom Silver Collection</span><span>${COPY.slogan}</span><a href="index.html">All design directions</a></div>
</footer>`;
}

export function tail(id) {
  return `<script type="module" src="dist/royal/${id}.js"></script>
</body>
</html>`;
}

// ---------- round four: the real ads, as a reel (same height; spreads twice as wide) ----------
const adsSrc = readFileSync(ROOT + 'assets/ads/ads.js', 'utf8');
export const ADS = JSON.parse(adsSrc.slice(adsSrc.indexOf('['), adsSrc.lastIndexOf(']') + 1));
export function reel({ label = 'From our campaigns', heading = 'The <em>campaign</em>', lead = 'Every page from the Kingdom campaigns. Spreads open full width.', variant = 'line' } = {}) {
  const items = ADS.map((a, i) => `<figure class="r-reel__item${a.spread ? ' is-spread' : ''}" data-i="${i}">
      <button type="button" class="r-reel__open" aria-label="Open ${a.title}" data-cursor="View"><img src="${a.lo}" data-hi="${a.src}" alt="${a.alt}" loading="lazy" decoding="async" width="${a.spread ? 1236 : 618}" height="800"></button>
      <figcaption><b>${String(i + 1).padStart(2, '0')}</b><span>${a.title}</span><small>${a.spread ? 'Spread' : 'Page'}</small></figcaption>
    </figure>`).join('');
  return `<section class="r-reel r-reel--${variant}" id="campaign" aria-label="Campaign gallery">
  <div class="r-reel__head">
    <div><p class="r-label" data-reveal>${label}</p><h2 class="r-h2" data-split>${heading}</h2></div>
    <div class="r-reel__side"><p class="r-lead" data-reveal>${lead}</p>
      <div class="r-reel__ctrl" data-reveal><button type="button" class="r-reel__btn" data-dir="-1" aria-label="Previous ad">${arrow}</button><span class="r-reel__count"><b>01</b> / ${String(ADS.length).padStart(2, '0')}</span><button type="button" class="r-reel__btn" data-dir="1" aria-label="Next ad">${arrow}</button></div>
    </div>
  </div>
  <div class="r-reel__view" tabindex="0" aria-label="Ads, scroll sideways" data-cursor="Drag">
    <div class="r-reel__track">${items}<span class="r-reel__end" aria-hidden="true"></span></div>
  </div>
  <div class="r-reel__bar" aria-hidden="true"><i></i></div>
</section>
<div class="r-lb" role="dialog" aria-modal="true" aria-label="Ad viewer" hidden>
  <button type="button" class="r-lb__x" aria-label="Close">×</button>
  <button type="button" class="r-lb__nav r-lb__nav--p" data-dir="-1" aria-label="Previous">${arrow}</button>
  <figure class="r-lb__fig"><img alt=""><figcaption></figcaption></figure>
  <button type="button" class="r-lb__nav r-lb__nav--n" data-dir="1" aria-label="Next">${arrow}</button>
</div>`;
}
