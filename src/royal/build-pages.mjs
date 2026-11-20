// Builds the Royal concept pages to static HTML in the site root.
// Run: node src/royal/build-pages.mjs
import { writeFileSync } from 'node:fs';
import * as P from './partials.mjs';
const { COPY, DETAILS, icons, logo } = P;
const ROOT = new URL('../../', import.meta.url).pathname;
const a = icons.arrow;

const page = (cfg, body) => `${P.head(cfg)}
<body class="pg-${cfg.id}">
${P.sprite}
${P.loader()}
${P.announce(cfg.announce)}
${P.header(cfg.header || 'center')}
<main id="top">
${body}
</main>
${P.footer()}
${P.tail(cfg.id)}`;

const pages = {};

/* ============ 1 · CORONATION (3D) ============ */
pages.coronation = page({ id: 'coronation', title: 'Kingdom — Coronation · The Art of Silver Gifting', preloadModel: true }, `
<section class="co-hero" aria-label="The Baroque Ewer in 3D">
  <div class="co-pin">
    <h1 class="co-title r-h1"><span>${COPY.h1a}</span><span><em>${COPY.h1b}</em></span><span>${COPY.h1c}</span></h1>
    <div id="stage" class="co-stage" data-cursor="Drag" role="img" aria-label="A silver ewer, shown in 3D. Drag to turn it; scroll to explore its details."></div>
    <svg class="co-line" aria-hidden="true"><path d=""/></svg>
    ${DETAILS.map((_, i) => `<i class="co-dot" aria-hidden="true"></i>`).join('')}
    <div class="co-intro">
      <p class="r-lead">${COPY.sub}</p>
      <div class="co-intro__btns"><a class="r-btn" href="#collection" data-magnetic="0.25"><span>Shop the collection</span>${a}</a><a class="r-btn r-btn--ghost" href="#story"><span>Our story</span></a></div>
    </div>
    <p class="co-hint"><span>Drag to turn</span><i></i><span>Scroll to explore</span></p>
    ${DETAILS.map(([t, d], i) => `<article class="co-card co-card--${i % 2 ? 'l' : 'r'}" data-i="${i}"><b>0${i + 1} <span>/ 05</span></b><h2 class="r-h3">${t}</h2><p>${d}</p></article>`).join('')}
    <nav class="co-rail" aria-label="Details">${DETAILS.map(([t], i) => `<button type="button" aria-label="${t}"><span>${t.replace('The ', '')}</span></button>`).join('')}<span class="co-rail__track"><i class="co-rail__fill"></i></span></nav>
    <div class="co-final">
      <p class="r-label">Signature piece</p>
      <h2 class="r-h2">The Baroque<br><em>Ewer</em></h2>
      <p class="r-lead">Acanthus relief, a flared mirror spout and a crowned stopper. Silver-filled, gift-boxed, ready to give.</p>
      <div class="co-intro__btns"><button class="r-btn" type="button" data-add="The Baroque Ewer" data-magnetic="0.2">${icons.bag}<span>Add to bag</span></button><a class="r-btn r-btn--ghost" href="shop.html"><span>View details</span></a></div>
    </div>
  </div>
</section>
${P.ticker()}
${P.occasions('accordion')}
${P.collection('arch')}
${P.story('center')}
${P.gift()}
${P.campaign()}
${P.shopNow('grand')}
${P.concierge()}`);

/* ============ 2 · REGALIA (photo · light sweep + loupe) ============ */
pages.regalia = page({ id: 'regalia', title: 'Kingdom — Regalia · The Art of Silver Gifting' }, `
<section class="rg-hero" aria-label="The Baroque Ewer">
  <div class="rg-word" aria-hidden="true">${logo('k-name')}</div>
  <figure class="rg-ewer" data-cursor="Light">
    <img class="rg-ewer__img" src="assets/img/ewer-2400.webp" alt="The Baroque Ewer, a silver-filled ewer with acanthus relief and a crowned stopper" width="1113" height="2400">
    <span class="rg-ewer__sheen" aria-hidden="true"></span>
    <span class="rg-ewer__floor" aria-hidden="true"></span>
  </figure>
  <div class="rg-copy rg-copy--l">
    <p class="r-label">Kingdom · Silver Collection</p>
    <h1 class="r-h1 rg-h1"><span>${COPY.h1a}</span> <span><em>${COPY.h1b}</em></span> <span>${COPY.h1c}</span></h1>
  </div>
  <div class="rg-copy rg-copy--r">
    <p class="r-lead">${COPY.sub}</p>
    <a class="r-btn" href="#collection" data-magnetic="0.25"><span>Shop the collection</span>${a}</a>
  </div>
  <ul class="rg-specs" aria-label="Highlights"><li><b>Silver-filled</b><span>Presence of solid silver</span></li><li><b>Gift-ready</b><span>Kingdom packaging</span></li><li><b>Within reach</b><span>Priced for generous giving</span></li></ul>
</section>
${P.ticker(undefined, 'r-ticker--solid')}
<section class="rg-loupe" aria-label="Look closer">
  <div class="r-sec-head"><p class="r-label" data-reveal>Look closer</p><h2 class="r-h2" data-split>Every detail,<br><em>magnified.</em></h2><p class="r-lead" data-reveal>Move over the ewer to inspect it, or choose a detail.</p></div>
  <div class="rg-loupe__grid">
    <div class="rg-loupe__stage" data-cursor="Inspect">
      <img src="assets/img/ewer-1400.webp" alt="The Baroque Ewer" loading="lazy">
      <span class="rg-lens" aria-hidden="true"><span></span></span>
    </div>
    <ol class="rg-loupe__list">${DETAILS.map(([t, d], i) => `<li><button type="button" data-spot="${i}"${i === 0 ? ' class="is-on"' : ''}><b>0${i + 1}</b><span><strong>${t}</strong><em>${d}</em></span></button></li>`).join('')}</ol>
  </div>
</section>
${P.collection('rail', 'The Baroque<br><em>Collection</em>')}
${P.story('split')}
${P.occasions('accordion', 'Silver for<br><em>every table</em>')}
${P.gift()}
${P.campaign()}
${P.shopNow('grand')}
${P.concierge()}`);

/* ============ 3 · LUMIÈRE (photo · cursor spotlight) ============ */
pages.lumiere = page({ id: 'lumiere', title: 'Kingdom — Lumière · The Art of Silver Gifting', announce: 'Silver, revealed by candlelight — every piece arrives gift-ready' }, `
<section class="lu-hero" aria-label="The Baroque Ewer by candlelight">
  <div class="lu-stage" data-cursor="Light">
    <img class="lu-dim" src="assets/img/ewer-2400.webp" alt="" aria-hidden="true" width="1113" height="2400">
    <img class="lu-lit" src="assets/img/ewer-2400.webp" alt="The Baroque Ewer, revealed by a pool of light" width="1113" height="2400">
    <span class="lu-glow" aria-hidden="true"></span>
    <p class="lu-hint"><i></i>Move your light across the silver</p>
    <div class="lu-copy">
      <h1 class="r-h1 lu-h1"><span>${COPY.h1a}</span> <span><em>${COPY.h1b}</em></span> <span>${COPY.h1c}</span></h1>
      <div class="lu-copy__row"><p class="r-lead">${COPY.sub}</p><a class="r-btn" href="#collection" data-magnetic="0.25"><span>Shop the collection</span>${a}</a></div>
    </div>
  </div>
</section>
<section class="lu-details" aria-label="Five details">
  <div class="r-sec-head"><p class="r-label" data-reveal>By candlelight</p><h2 class="r-h2" data-split>Five details<br><em>worth a closer look</em></h2></div>
  ${DETAILS.map(([t, d, img], i) => `<article class="lu-det lu-det--${i % 2 ? 'r' : 'l'}">
    <div class="lu-det__media" data-img-reveal><img src="${img}" alt="${t}" loading="lazy"></div>
    <div class="lu-det__copy"><span class="lu-det__n">0${i + 1}</span><h3 class="r-h2" data-split>${t.replace('The ', 'The<br>')}</h3><p class="r-lead" data-reveal>${d}</p></div>
  </article>`).join('')}
</section>
${P.story('center')}
${P.ticker()}
${P.collection('arch')}
${P.occasions('accordion')}
${P.gift()}
${P.campaign()}
${P.shopNow('grand')}
${P.concierge()}`);

/* ============ 4 · EXHIBIT (photo · horizontal museum) ============ */
pages.exhibit = page({ id: 'exhibit', title: 'Kingdom — Exhibit · The Art of Silver Gifting', header: 'left', announce: 'Now showing: The Baroque Collection — every piece gift-ready' }, `
<section class="ex-hall" aria-label="The exhibition">
  <div class="ex-pin">
    <div class="ex-track">
      <div class="ex-room ex-room--title">
        <p class="r-label">Hall I · Now showing</p>
        <h1 class="r-h1 ex-h1"><span>${COPY.h1a}</span> <span><em>${COPY.h1b}</em></span> <span>${COPY.h1c}</span></h1>
        <p class="r-lead">${COPY.sub}</p>
        <p class="ex-enter"><span>Scroll to walk the hall</span>${a}</p>
      </div>
      <div class="ex-room ex-room--plinth">
        <div class="ex-spot" aria-hidden="true"></div>
        <img class="ex-piece" src="assets/img/ewer-2400.webp" alt="The Baroque Ewer on a plinth" loading="eager">
        <div class="ex-plinth" aria-hidden="true"><span></span></div>
        <aside class="ex-label"><b>No. 01</b><h2>The Baroque Ewer</h2><p>Silver-filled. Acanthus relief over a stippled ground; mirror-polished spout; crowned stopper.</p><button class="r-link" type="button" data-add="The Baroque Ewer">Add to bag ${a}</button></aside>
      </div>
      <div class="ex-room ex-room--wall" id="story"><div class="ex-wall__in"><p class="r-label">Our story</p><p class="ex-wall">${COPY.story1}</p><p class="r-lead">${COPY.story2}</p></div></div>
      <div class="ex-room ex-room--plinth ex-room--basin">
        <div class="ex-spot" aria-hidden="true"></div>
        <img class="ex-piece ex-piece--basin" src="assets/img/basin-1200.webp" alt="The Baroque Basin" loading="lazy">
        <aside class="ex-label"><b>No. 02</b><h2>The Baroque Basin</h2><p>Silver-filled. A pierced scroll rim and engraved foliage around a polished well.</p><button class="r-link" type="button" data-add="The Baroque Basin">Add to bag ${a}</button></aside>
      </div>
      <div class="ex-room ex-room--frame">
        <figure class="ex-frame"><img src="assets/img/pair.webp" alt="The Baroque Ewer and Basin together" loading="lazy"></figure>
        <aside class="ex-label"><b>No. 03</b><h2>The Baroque Set</h2><p>Ewer and basin, presented together in one Kingdom box.</p><button class="r-link" type="button" data-add="The Baroque Set">Add to bag ${a}</button></aside>
      </div>
      <div class="ex-room ex-room--exit">
        <p class="r-label">Exit through the shop</p>
        <h2 class="r-h1">Take the<br><em>exhibit</em> home.</h2>
        <a class="r-btn" href="shop.html" data-magnetic="0.25"><span>Shop now</span>${a}</a>
      </div>
    </div>
    <div class="ex-progress" aria-hidden="true"><span>Hall I</span><i><b></b></i><span class="ex-room-n">01 / 06</span></div>
  </div>
</section>
${P.ticker()}
${P.occasions('accordion', 'Choose the<br><em>occasion</em>')}
${P.gift()}
${P.campaign('From the <em>campaign</em>')}
${P.shopNow('grand')}
${P.concierge()}`);

/* ============ 5 · PROCESSION (photo · scroll-scrubbed zoom-out) ============ */
pages.procession = page({ id: 'procession', title: 'Kingdom — Procession · The Art of Silver Gifting' }, `
<section class="pr-hero" aria-label="The Baroque Ewer, revealed">
  <div class="pr-pin">
    <div class="pr-arch">
      <div class="pr-arch__in"><div class="pr-arch__clip"><img class="pr-img" src="assets/img/ewer-2400.webp" alt="The Baroque Ewer, revealed from a close-up of its engraving" width="1113" height="2400"></div></div>
      <svg class="pr-arch__line" viewBox="0 0 100 140" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M1,139 V50 A49,49 0 0 1 99,50 V139" vector-effect="non-scaling-stroke"/></svg>
    </div>
    <p class="pr-word pr-word--1" aria-hidden="true">${COPY.h1a}</p>
    <p class="pr-word pr-word--2" aria-hidden="true"><em>${COPY.h1b}</em></p>
    <p class="pr-word pr-word--3" aria-hidden="true">${COPY.h1c}</p>
    <div class="pr-side">
      <p class="r-label">Kingdom · Silver Collection</p>
      <h1 class="r-h1 pr-h1">${COPY.h1a} <em>${COPY.h1b}</em> ${COPY.h1c}</h1>
      <p class="r-lead">${COPY.sub}</p>
      <div class="pr-btns"><a class="r-btn" href="#collection" data-magnetic="0.25"><span>Shop the collection</span>${a}</a><a class="r-btn r-btn--ghost" href="#details"><span>See the details</span></a></div>
    </div>
    <p class="pr-scroll"><i></i>Scroll</p>
    <p class="pr-zoom" aria-hidden="true"><span class="pr-zoom__n">320</span>%</p>
  </div>
</section>
<section class="pr-details" id="details" aria-label="Details">
  <div class="r-sec-head r-sec-head--row"><div><p class="r-label" data-reveal>In detail</p><h2 class="r-h2" data-split>Made to be<br><em>looked at closely</em></h2></div><p class="r-camp__meta"><span>Drag</span>${a}</p></div>
  <div class="pr-rail" data-drag>${DETAILS.map(([t, d, img], i) => `<figure class="pr-card" data-tilt="4"><div class="pr-card__m"><img src="${img}" alt="${t}" loading="lazy"></div><figcaption><b>0${i + 1}</b><h3>${t}</h3><p>${d}</p></figcaption></figure>`).join('')}</div>
</section>
${P.collection('arch')}
${P.ticker()}
${P.story('center')}
${P.occasions('accordion')}
${P.gift()}
${P.campaign()}
${P.shopNow('grand')}
${P.concierge()}`);

/* ============ shop placeholder (e-commerce is added later) ============ */
pages.shop = page({ id: 'shop', title: 'Kingdom — Shop' }, `
<section class="sh-wait" aria-label="Shop">
  <p class="r-label">The Kingdom shop</p>
  <h1 class="r-h1">Opening<br><em>soon.</em></h1>
  <p class="r-lead">The full shop is being prepared. Until then, our gift concierge can reserve any piece for you.</p>
  <div class="sh-btns"><a class="r-btn" href="#concierge" data-magnetic="0.2"><span>Reserve a piece</span>${a}</a><a class="r-btn r-btn--ghost" href="javascript:history.back()"><span>Go back</span></a></div>
  <img src="assets/img/ewer-1400.webp" alt="" aria-hidden="true">
</section>
${P.concierge()}`);

for (const [id, html] of Object.entries(pages)) { writeFileSync(ROOT + id + '.html', html); console.log('wrote', id + '.html', (html.length / 1024).toFixed(1) + 'KB'); }
