// Round five ("Crown" kit): four photograph directions built on Regalia.
// Builds static HTML into the site root. Run: node src/crown/build.mjs
import { writeFileSync, readFileSync } from 'node:fs';
import * as P from '../royal/partials.mjs';
const { COPY, icons, logo } = P;
const ROOT = new URL('../../', import.meta.url).pathname;
const A = icons.arrow, BAG = icons.bag;

// The logo path without a fixed fill, so a wordmark can be solid, outlined, silver or a gradient.
const raw = readFileSync(ROOT + 'assets/royal/sprite.svg.html', 'utf8');
const crownSprite = raw.replace('<path id="k-p" fill="currentColor"', '<path id="k-p"').replace('</defs>', `
<linearGradient id="cw-metal" gradientUnits="userSpaceOnUse" x1="0" y1="72" x2="0" y2="124"><stop offset="0" stop-color="#ffffff"/><stop offset=".38" stop-color="#b9c0ca"/><stop offset=".5" stop-color="#6d7581"/><stop offset=".56" stop-color="#eef1f5"/><stop offset=".8" stop-color="#9aa2ae"/><stop offset="1" stop-color="#ffffff"/></linearGradient>
<linearGradient id="cw-brand" gradientUnits="userSpaceOnUse" x1="0" y1="72" x2="0" y2="124"><stop offset="0" style="stop-color:var(--wg1)"/><stop offset="1" style="stop-color:var(--wg2);stop-opacity:var(--wo2)"/></linearGradient>
</defs>`);

const crown = icons.crown;
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const swash = '<svg class="cr-eb__swash" viewBox="0 0 120 14" aria-hidden="true"><path d="M2 9c18-7 34 5 52 0s30-9 46-3c7 3 12 3 18-1"/></svg>';
// Section label: one markup, five designed styles (chosen in the Design studio)
const eb = (n, text, cls = '') => `<p class="cr-eb ${cls}" data-reveal><span class="cr-eb__seal">${crown}</span><span class="cr-eb__n">${ROMAN[n - 1]}</span><span class="cr-eb__t">${text}</span>${swash}</p>`;

const ITEMS = [
  { id: 'decanter', name: 'Crowned Decanter', line: 'Repoussé body, crowned stopper', tag: 'Signature' },
  { id: 'candlesticks', name: 'Grand Candlesticks', line: 'A tall pair, acanthus feet', tag: 'Shabbos' },
  { id: 'spice-tower', name: 'Crown Spice Tower', line: 'Domed, belled and engraved', tag: '' },
  { id: 'casket', name: 'Baroque Casket', line: 'Gadrooned, on scrolled feet', tag: 'New' },
  { id: 'ewer-basin', name: 'Ewer & Basin', line: 'The washing set, presented together', tag: 'Set' },
  { id: 'candelabra', name: 'Five-Branch Candelabra', line: 'Scrolled arms, square foot', tag: '' },
  { id: 'wine-barrel', name: 'Wine Barrel', line: 'On a stand, with a crowned lid', tag: '' },
  { id: 'tureen', name: 'Songbird Tureen', line: 'Twin handles, a bird on the lid', tag: '' },
  { id: 'vase', name: 'Twin-Handle Vase', line: 'Scrolled handles, fluted lip', tag: '' },
  { id: 'honey-dish', name: 'Honey Dish & Tray', line: 'For a sweet new year', tag: 'Yom Tov' }
];
const OCC = [
  ['Shabbos', 'For the table that gathers everyone.', 'candlesticks'],
  ['Weddings', 'A first heirloom for a new home.', 'ewer-basin'],
  ['Bar Mitzvah', 'A milestone worth keeping.', 'decanter'],
  ['Yom Tov', 'A sweet year, served in silver.', 'honey-dish'],
  ['New Home', 'Silver that makes a house feel finished.', 'cutlery-chest'],
  ['Thank You', 'Gratitude, with presence.', 'casket']
];
const DET = [
  ['The Crowned Stopper', 'An ovoid finial wrapped in acanthus, set on a fluted collar.', [0.47, 0.085]],
  ['The Flared Spout', 'A mirror-polished lip that catches every light in the room.', [0.2, 0.235]],
  ['The Scroll Handle', 'A beaded, leaf-capped handle that curls into a single bead.', [0.86, 0.3]],
  ['The Acanthus Body', 'Deep relief over a finely stippled ground, so the polish reads brighter.', [0.5, 0.6]],
  ['The Footed Base', 'Pierced scrolled feet that lift the piece like a crown on a cushion.', [0.5, 0.91]]
];
const ads = P.ADS.slice(0, 10);
const img = (id, w = 960) => `assets/items/${id}-${w}.webp`;

function head(id, title) {
  return `<!DOCTYPE html>
<html lang="en" data-mode="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="Kingdom Silver Collection — the art of silver gifting. Filled with silver. Given with pride.">
<meta name="theme-color" content="#f3ece4">
<link rel="icon" href="assets/img/logo-icon.svg" type="image/svg+xml">
<link rel="preload" href="assets/img/ewer-bw-2400.webp" as="image">
<link rel="stylesheet" href="css/royal.css">
<link rel="stylesheet" href="css/crown.css">
<link rel="stylesheet" href="css/crown-${id}.css">
<script src="kingdom.config.js"></script>
</head>`;
}

// ---------- sections ----------
const hero = (v) => `<section class="cr-hero cr-hero--${v}" aria-label="The Baroque Ewer">
  <h1 class="cr-h1"><span class="cr-h1__l"><span>${COPY.h1a}</span></span> <span class="cr-h1__l"><span><em>${COPY.h1b}</em> ${COPY.h1c}</span></span></h1>
  <div class="cr-word" aria-hidden="true">
    <svg class="cr-word__base"><use href="#k-name"/></svg>
    <svg class="cr-word__lit"><use href="#k-name"/></svg>
  </div>
  <figure class="cr-ewer" data-cursor="Light">
    <img class="cr-ewer__img cr-silver" src="assets/img/ewer-bw-2400.webp" alt="The Baroque Ewer, a silver-filled ewer with acanthus relief and a crowned stopper" width="1113" height="2400" fetchpriority="high">
    <span class="cr-ewer__sheen" aria-hidden="true"></span>
    <span class="cr-ewer__glint" aria-hidden="true"></span>
    <span class="cr-ewer__floor" aria-hidden="true"></span>
  </figure>
  <ul class="cr-specs" aria-label="Highlights"><li><b>Silver-filled</b><span>The presence of silver</span></li><li><b>Gift-ready</b><span>Kingdom packaging</span></li><li><b>Within reach</b><span>For generous giving</span></li></ul>
  <div class="cr-side">
    <p class="cr-sub">${COPY.sub}</p>
    <a class="r-btn" href="#collection" data-magnetic="0.25"><span>Shop the collection</span>${A}</a>
  </div>
  <p class="cr-scroll" aria-hidden="true"><i></i><span>Scroll</span></p>
</section>`;

const BANNER = ['Filled with silver', 'Given with pride', 'Gift-ready packaging', 'A royal touch', 'Priced within reach'];
const banner = () => {
  const flat = BANNER.map((t, i) => `<span class="${i % 2 ? 'is-i' : ''}">${t}</span><i class="cr-band__gem" aria-hidden="true"></i>`).join('');
  const wave = BANNER.map((t, i) => (i % 2 ? `<tspan class="is-i">${t}</tspan>` : `<tspan>${t}</tspan>`)).join('<tspan class="cr-band__dot">  ✦  </tspan>') + '<tspan class="cr-band__dot">  ✦  </tspan>';
  return `<div class="cr-band" aria-label="${BANNER.join(', ')}">
  <svg class="cr-band__wave" viewBox="0 0 1600 140" preserveAspectRatio="none" aria-hidden="true">
    <path id="cr-wave" d="M-400 70 C 0 20, 400 120, 800 70 S 1600 20, 2000 70" fill="none"/>
    <path class="cr-band__thread" d="M-400 70 C 0 20, 400 120, 800 70 S 1600 20, 2000 70" fill="none"/>
    <text><textPath href="#cr-wave" startOffset="0">${wave}${wave}${wave}${wave}</textPath></text>
  </svg>
  <div class="cr-band__flat" aria-hidden="true"><div class="cr-band__run">${flat}${flat}${flat}</div></div>
</div>`;
};

const loupe = (n, heading = 'Every detail,<br><em>magnified.</em>') => `<section class="cr-loupe" id="details" aria-label="Look closer">
  <div class="cr-loupe__pin">
    <div class="cr-loupe__stage" data-cursor="Inspect">
      <span class="cr-loupe__ring" aria-hidden="true"></span>
      <img class="cr-silver" src="assets/img/ewer-bw-1400.webp" alt="The Baroque Ewer" loading="lazy" width="649" height="1400">
      <span class="cr-lens" aria-hidden="true"><span></span><i>×2.8</i></span>
    </div>
    <div class="cr-loupe__copy">
      ${eb(n, 'Look closer')}
      <h2 class="cr-h2" data-split>${heading}</h2>
      <div class="cr-loupe__ch" aria-live="polite">
        <span class="cr-loupe__num" aria-hidden="true">${DET.map((_, i) => `<b>${ROMAN[i]}</b>`).join('')}</span>
        <div class="cr-loupe__texts">${DET.map(([t, d], i) => `<article class="cr-loupe__t${i === 0 ? ' is-on' : ''}"><h3>${t}</h3><p>${d}</p></article>`).join('')}</div>
      </div>
      <nav class="cr-loupe__dots" aria-label="Details">${DET.map(([t], i) => `<button type="button" data-spot="${i}" aria-label="${t}"${i === 0 ? ' class="is-on"' : ''}><i></i></button>`).join('')}</nav>
      <p class="cr-hint"><i></i>Scroll, or move over the ewer</p>
    </div>
  </div>
</section>`;

const collection = (n, heading = 'The <em>collection</em>') => `<section class="cr-coll" id="collection" aria-label="The collection">
  <div class="cr-head cr-head--row">
    <div>${eb(n, 'The collection')}<h2 class="cr-h2" data-split>${heading}</h2></div>
    <a class="r-link" href="shop.html" data-reveal>View all pieces ${A}</a>
  </div>
  <div class="cr-coll__grid">${ITEMS.slice(0, 8).map((p, i) => `<article class="cr-prod cr-prod--${i}" data-reveal data-delay="${(i % 4) * 0.06}">
      <a class="cr-prod__media" href="shop.html" data-cursor="View">
        <img class="cr-silver" src="${img(p.id, i === 0 ? 960 : 480)}" srcset="${img(p.id, 480)} 480w, ${img(p.id, 960)} 960w" sizes="(max-width:900px) 50vw, 30vw" alt="${p.name}" loading="lazy" width="480" height="600">
        <span class="cr-prod__shine" aria-hidden="true"></span>
        ${p.tag ? `<span class="cr-prod__tag">${p.tag}</span>` : ''}
      </a>
      <div class="cr-prod__meta"><div><h3>${p.name}</h3><p>${p.line}</p></div><button class="cr-prod__add" type="button" data-add="${p.name}" aria-label="Add ${p.name} to bag">${BAG}</button></div>
    </article>`).join('')}
  </div>
</section>`;

const story = (n, v = 'center') => `<section class="cr-story cr-story--${v}" id="story" aria-label="Our story">
  <div class="cr-story__in">
    ${eb(n, 'Our story')}
    <p class="cr-story__big" data-fill>${COPY.story1}</p>
    <div class="cr-story__row">
      <p class="cr-lead" data-reveal>${COPY.story2}</p>
      <ul class="cr-story__close" data-stagger>${COPY.close.map((c) => `<li><span>${c}</span></li>`).join('')}</ul>
    </div>
  </div>
</section>`;

const ringText = (id, txt) => `<svg class="cr-ring" viewBox="0 0 200 200" aria-hidden="true"><defs><path id="${id}" d="M100,100 m-92,0 a92,92 0 1,1 184,0 a92,92 0 1,1 -184,0"/></defs><text><textPath href="#${id}">${txt}</textPath></text></svg>`;
const hallmark = (n) => `<section class="cr-hall" id="hallmark" aria-label="The hallmark">
  <div class="cr-hall__head">
    ${eb(n, 'The hallmark')}
    <h2 class="cr-h2" data-split>Turned by<br><em>your hand.</em></h2>
    <p class="cr-lead" data-reveal>Every piece is marked as Kingdom. Drag the basin to turn it, and watch the light travel across the engraving.</p>
  </div>
  <div class="cr-hall__stage">
    ${ringText('cr-ring-a', 'KINGDOM · SILVER-FILLED · GIFT-READY · A ROYAL TOUCH · KINGDOM · SILVER-FILLED · GIFT-READY · A ROYAL TOUCH · ')}
    <div class="cr-hall__basin" data-cursor="Turn" role="img" aria-label="The Baroque Basin. Drag to turn it.">
      <img class="cr-silver" src="assets/img/basin-bw-1200.webp" alt="" width="1200" height="1200" loading="lazy" draggable="false">
      <span class="cr-hall__sheen" aria-hidden="true"></span>
    </div>
    <div class="cr-hall__seal" aria-hidden="true">${logo('k-icon')}<b>Kingdom</b><small>Silver collection</small></div>
    <ul class="cr-hall__marks" aria-label="Hallmarks">
      <li><b>${logo('k-icon')}</b><span>Maker’s mark</span></li>
      <li><b>925</b><span>Silver-filled</span></li>
      <li><b>${crown}</b><span>Gift-ready</span></li>
    </ul>
    <p class="cr-hint cr-hall__hint"><i></i>Drag to turn</p>
  </div>
</section>`;

const occasions = (n, heading = 'A gift for every<br><em>occasion</em>') => `<section class="r-occ cr-occ" id="occasions" aria-label="Shop by occasion">
  <div class="cr-head">${eb(n, 'Shop by occasion')}<h2 class="cr-h2" data-split>${heading}</h2><p class="cr-lead" data-reveal>Choose the moment. We’ll help you choose the silver.</p></div>
  <div class="r-occ__list" data-drag>${OCC.map(([t, l, id], i) => `<a class="r-occ__item${i === 0 ? ' is-open' : ''}" href="shop.html" data-cursor="Explore">
      <img class="cr-silver" src="${img(id)}" alt="" loading="lazy">
      <span class="r-occ__num">${ROMAN[i]}</span>
      <span class="r-occ__v">${t}</span>
      <span class="r-occ__body"><b>${t}</b><span>${l}</span><em>Shop ${A}</em></span>
    </a>`).join('')}</div>
</section>`;

const STEPS = [
  ['Choose your piece', 'From the collection, or with our gift concierge.'],
  ['Dressed in Kingdom', 'Navy and blush packaging, lined with soft tissue.'],
  ['Your words, on a card', 'A handwritten-style note tucked inside.'],
  ['Tied with a bow', 'Sealed, ribboned and ready to give.']
];
const face = (c, extra = '') => `<i class="gb-f gb-f--${c}">${extra}</i>`;
const gift = (n) => `<section class="cr-gift" id="gifting" aria-label="The gift">
  <div class="cr-gift__pin">
    <div class="cr-gift__copy">
      ${eb(n, 'The gift')}
      <h2 class="cr-h2">Given with<br><em>pride.</em></h2>
      <ol class="cr-gift__steps">${STEPS.map(([t, d], i) => `<li${i === 0 ? ' class="is-on"' : ''}><button type="button" data-step="${i}"><b>${ROMAN[i]}</b><span><strong>${t}</strong><em>${d}</em></span></button></li>`).join('')}</ol>
      <span class="cr-gift__bar" aria-hidden="true"><i></i></span>
    </div>
    <div class="cr-gift__scene" aria-hidden="true">
      <span class="cr-gift__glow"></span>
      <div class="gb">
        <img class="gb__piece cr-silver" src="assets/img/ewer-bw-800.webp" alt="">
        <div class="gb__tissue"><i></i><i></i></div>
        <div class="gb__base">${face('front', `<span class="gb__foil">${logo('k-full')}</span>`)}${face('back')}${face('left')}${face('right')}${face('bottom')}</div>
        <div class="gb__lid">${face('top', '<span class="gb__bow"><i></i><i></i><b></b></span>')}${face('lfront')}${face('lback')}${face('lleft')}${face('lright')}</div>
        <span class="gb__shadow"></span>
      </div>
      <div class="gb__card"><span>For you,</span><em>with love.</em>${logo('k-icon')}</div>
      <span class="gb__sparkle"><i></i><i></i><i></i></span>
    </div>
  </div>
</section>`;

const reel = (n, heading = 'The <em>campaign</em>') => `<section class="cr-reel" id="campaign" aria-label="Campaign gallery">
  <div class="cr-reel__pin">
    <div class="cr-head cr-head--row">
      <div>${eb(n, 'As seen in our ads')}<h2 class="cr-h2" data-split>${heading}</h2></div>
      <div class="cr-reel__meta"><span class="cr-reel__count"><b>01</b> / ${String(ads.length).padStart(2, '0')}</span><span class="cr-reel__bar"><i></i></span>
        <span class="cr-reel__btns"><button type="button" data-dir="-1" aria-label="Previous ad">${A}</button><button type="button" data-dir="1" aria-label="Next ad">${A}</button></span></div>
    </div>
    <div class="cr-reel__view" data-cursor="Drag">
      <div class="cr-reel__track">${ads.map((a, i) => `<figure class="cr-ad${a.spread ? ' is-spread' : ''}" style="--ar:${a.spread ? '1236/800' : '618/800'}">
        <button type="button" class="cr-ad__open" aria-label="Open ${a.title}"><img src="${a.lo}" data-hi="${a.src}" alt="${a.alt}" loading="lazy" decoding="async" width="${a.spread ? 1236 : 618}" height="800" draggable="false"></button>
        <figcaption><b>${String(i + 1).padStart(2, '0')}</b><span>${a.title}</span></figcaption>
      </figure>`).join('')}</div>
    </div>
  </div>
</section>
<div class="cr-lb" role="dialog" aria-modal="true" aria-label="Ad viewer" hidden>
  <button type="button" class="cr-lb__x" aria-label="Close">×</button>
  <button type="button" class="cr-lb__nav cr-lb__nav--p" data-dir="-1" aria-label="Previous">${A}</button>
  <figure class="cr-lb__fig"><img alt=""><figcaption></figcaption></figure>
  <button type="button" class="cr-lb__nav cr-lb__nav--n" data-dir="1" aria-label="Next">${A}</button>
</div>`;

const shopNow = (n) => `<section class="cr-shop" id="shop" aria-label="Shop now">
  <img class="cr-shop__bg cr-silver" src="assets/img/pair-bw.webp" alt="" aria-hidden="true" loading="lazy">
  <div class="cr-shop__in">
    ${eb(n, 'The shop is open')}
    <h2 class="cr-shop__title" data-split>Find the <em>perfect gift.</em></h2>
    <a class="cr-shop__btn" href="shop.html" data-magnetic="0.3" data-cursor="Enter">
      ${ringText('cr-ring-shop', 'SHOP NOW · SHOP NOW · SHOP NOW · SHOP NOW · ')}
      <span class="cr-shop__core"><b>Shop</b><em>now</em>${A}</span>
    </a>
    <p class="cr-lead" data-reveal>Silver-filled pieces, gift-boxed and priced within reach.</p>
  </div>
</section>`;

const footer = () => `<footer class="cr-foot">
  <div class="cr-foot__top">
    <form class="cr-foot__news" data-newsletter novalidate>
      <h2 class="cr-h3">First to see <em>new pieces.</em></h2>
      <label class="cr-field"><span class="r-sr">Email address</span><input type="email" placeholder="Your email address" autocomplete="email" required><button type="submit" aria-label="Join">${A}</button></label>
      <p class="r-form__msg" role="status">One letter a month. Unsubscribe anytime.</p>
    </form>
    <div class="cr-foot__cols">
      <div><h3>Shop</h3><a href="shop.html">The collection</a><a href="#occasions">Occasions</a><a href="shop.html">Gift sets</a></div>
      <div><h3>Kingdom</h3><a href="#story">Our story</a><a href="#gifting">Gifting</a><a href="#campaign">Campaign</a></div>
      <div><h3>Care</h3><a href="#shop">Shipping &amp; returns</a><a href="#shop">Caring for silver</a><a href="#shop">Contact</a></div>
    </div>
  </div>
  <div class="cr-foot__base"><span>© <span data-year>2026</span> Kingdom Silver Collection</span><span>${COPY.slogan}</span></div>
  <a class="cr-foot__mark" href="#top" aria-label="Back to top"><svg><use href="#k-name"/></svg></a>
</footer>`;

const page = (id, title, body, cfg = {}) => `${head(id, title)}
<body class="cr pg-${id}">
${crownSprite}
${P.loader()}
${P.announce(cfg.announce || 'Every piece arrives gift-ready in Kingdom packaging')}
${P.header('center')}
<main id="top">
${body}
</main>
${footer()}
<script type="module" src="dist/crown/${id}.js"></script>
</body>
</html>`;

const pages = {
  monarch: page('monarch', 'Kingdom — Monarch · The Art of Silver Gifting', `
${hero('monarch')}
${banner()}
${loupe(1)}
${collection(2)}
${story(3, 'center')}
${hallmark(4)}
${occasions(5)}
${gift(6)}
${reel(7)}
${shopNow(8)}`),
  sapphire: page('sapphire', 'Kingdom — Sapphire Court · The Art of Silver Gifting', `
${hero('sapphire')}
${banner()}
${hallmark(1)}
${loupe(2, 'Five details,<br><em>one crown.</em>')}
${occasions(3, 'Silver for<br><em>every table</em>')}
${collection(4, 'The royal <em>treasury</em>')}
${story(5, 'split')}
${gift(6)}
${reel(7)}
${shopNow(8)}`, { announce: 'The Kingdom has opened its doors · every piece arrives gift-ready' }),
  rosewater: page('rosewater', 'Kingdom — Rosewater · The Art of Silver Gifting', `
${hero('rosewater')}
${banner()}
${story(1, 'split')}
${loupe(2, 'Closer,<br><em>and closer.</em>')}
${occasions(3)}
${gift(4)}
${collection(5, 'Chosen <em>pieces</em>')}
${hallmark(6)}
${reel(7)}
${shopNow(8)}`),
  dusk: page('dusk', 'Kingdom — Dusk · The Art of Silver Gifting', `
${hero('dusk')}
${banner()}
${loupe(1, 'Lit by<br><em>your hand.</em>')}
${hallmark(2)}
${collection(3)}
${occasions(4, 'The right silver,<br><em>for the moment</em>')}
${story(5, 'center')}
${gift(6)}
${reel(7)}
${shopNow(8)}`, { announce: 'Silver at dusk · every piece arrives gift-ready in Kingdom packaging' })
};
for (const [id, html] of Object.entries(pages)) writeFileSync(ROOT + id + '.html', html);
console.log('built', Object.keys(pages).join(', '));
