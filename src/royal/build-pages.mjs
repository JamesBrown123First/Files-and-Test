// Builds the Royal concept pages to static HTML in the site root.
// Run: node src/royal/build-pages.mjs
import { writeFileSync } from 'node:fs';
import * as P from './partials.mjs';
const { COPY, DETAILS, icons, logo } = P;
const ROOT = new URL('../../', import.meta.url).pathname;
const a = icons.arrow;

const pageRaw = (cfg, body) => `${P.head(cfg)}
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
const page = (cfg, body) => (cfg.post ? cfg.post(pageRaw(cfg, body)) : pageRaw(cfg, body));

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

/* =====================================================================
   ROUND FOUR — built on Regalia: the photograph, a monumental mark, light.
   ===================================================================== */
const EWER = 'assets/img/ewer-2400.webp';
const EWER_ALT = 'The Baroque Ewer, a silver-filled ewer with acanthus relief and a crowned stopper';
const h1 = (cls = '') => `<h1 class="r-h1 ${cls}"><span>${COPY.h1a}</span> <span><em>${COPY.h1b}</em></span> <span>${COPY.h1c}</span></h1>`;

/* ============ 6 · THRESHOLD (photo · the royal doors open; scroll walks you through) ============ */
pages.threshold = page({ id: 'threshold', title: 'Kingdom — Threshold · The Art of Silver Gifting', announce: 'The Kingdom has opened its doors — every piece arrives gift-ready' }, `
<section class="th-hero" aria-label="The Kingdom has opened its doors">
  <div class="th-pin">
    <div class="th-word" aria-hidden="true"><i></i></div>
    <div class="th-portal">
      <div class="th-arch">
        <span class="th-arch__glow" aria-hidden="true"></span>
        <span class="th-arch__floor" aria-hidden="true"></span>
        <figure class="th-ewer" data-cursor="Light">
          <img class="th-ewer__img" src="${EWER}" alt="${EWER_ALT}" width="1113" height="2400">
          <span class="th-ewer__sheen" aria-hidden="true"></span>
          <img class="th-ewer__refl" src="assets/img/ewer-1400.webp" alt="" aria-hidden="true">
        </figure>
        <span class="th-door th-door--l" aria-hidden="true"><i></i>${logo('k-icon')}</span>
        <span class="th-door th-door--r" aria-hidden="true"><i></i>${logo('k-icon')}</span>
      </div>
      <svg class="th-arch__line" viewBox="0 0 100 160" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M0.5,159.5 V50 A49.5,49.5 0 0 1 99.5,50 V159.5"/></svg>
      <svg class="th-arch__line th-arch__line--2" viewBox="0 0 100 160" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M0.5,159.5 V50 A49.5,49.5 0 0 1 99.5,50 V159.5"/></svg>
      <span class="th-step" aria-hidden="true"></span>
    </div>
    <div class="th-copy th-copy--l">
      <p class="r-label">The Kingdom has opened its doors</p>
      ${h1('th-h1')}
    </div>
    <div class="th-copy th-copy--r">
      <p class="r-lead">${COPY.sub}</p>
      <a class="r-btn" href="#collection" data-magnetic="0.25"><span>Step inside</span>${a}</a>
    </div>
    <p class="th-scroll" aria-hidden="true"><i></i><span>Scroll to enter</span></p>
    <div class="th-inside" id="story">
      <p class="r-label">Our story</p>
      <p class="th-inside__big">${COPY.story1}</p>
      <p class="th-inside__small">${COPY.story2}</p>
    </div>
  </div>
</section>
${P.ticker(undefined, 'r-ticker--solid')}
<section class="th-treasury" aria-label="Five details">
  <div class="r-sec-head r-sec-head--row"><div><p class="r-label" data-reveal>The treasury</p><h2 class="r-h2" data-split>Five details,<br><em>each in its niche</em></h2></div><p class="r-lead" data-reveal>Move along the colonnade. Every niche holds a detail of the ewer, lit like a crown jewel.</p></div>
  <div class="th-niches" data-drag>${DETAILS.map(([t, d, img], i) => `<a class="th-niche th-niche--${i}" href="shop.html" data-cursor="View"><span class="th-niche__arch"><img src="${img}" alt="${t}" loading="lazy"></span><span class="th-niche__n">${['I', 'II', 'III', 'IV', 'V'][i]}</span><span class="th-niche__t">${t}</span><span class="th-niche__d">${d}</span></a>`).join('')}</div>
</section>
${P.collection('rail', 'The Baroque<br><em>Collection</em>')}
${P.occasions('accordion', 'A gift for every<br><em>occasion</em>')}
${P.gift()}
${P.reel({ heading: 'The Kingdom <em>campaign</em>', lead: 'Our ads, page by page. Drag, use the arrows, or open any page full screen.' })}
${P.shopNow('grand')}
${P.concierge()}`);

/* ============ 7 · MAISON (photo · couture magazine cover; scroll lookbook) ============ */
const ROMAN = ['I', 'II', 'III', 'IV', 'V'];
pages.maison = page({ id: 'maison', title: 'Kingdom — Maison · The Art of Silver Gifting', header: 'left', announce: 'The Baroque Issue — gift-ready, in Kingdom packaging' }, `
<section class="ma-cover" aria-label="The Baroque Issue">
  <div class="ma-mast" aria-hidden="true">${logo('k-name')}</div>
  <div class="ma-bar" aria-hidden="true"><span>No. 01 — The Baroque Issue</span><span class="r-hide-m">Silver · Gifting · Heirlooms</span><span>Winter 2026</span></div>
  <span class="ma-disc" aria-hidden="true"></span>
  <figure class="ma-ewer" data-cursor="Light">
    <img class="ma-ewer__img" src="${EWER}" alt="${EWER_ALT}" width="1113" height="2400">
    <span class="ma-ewer__sheen" aria-hidden="true"></span>
  </figure>
  <div class="ma-feature">
    <p class="r-label">Cover story</p>
    ${h1('ma-h1')}
    <p class="r-lead">${COPY.sub}</p>
    <a class="r-btn" href="#collection" data-magnetic="0.25"><span>Shop the issue</span>${a}</a>
  </div>
  <ol class="ma-lines" aria-label="In this issue">
    <li><b>p. 04</b><strong>Filled with silver</strong><span>The presence of silver, within reach</span></li>
    <li><b>p. 12</b><strong>The ewer, <em>up close</em></strong><span>Five details worth a long look</span></li>
    <li><b>p. 24</b><strong>Given with pride</strong><span>Inside the Kingdom gift box</span></li>
  </ol>
  <div class="ma-seal" aria-hidden="true"><svg viewBox="0 0 200 200"><defs><path id="ma-seal" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0"/></defs><text><textPath href="#ma-seal">THE BAROQUE ISSUE · A ROYAL TOUCH · KINGDOM · </textPath></text></svg>${logo('k-icon')}</div>
</section>
<section class="ma-look" aria-label="The ewer, up close">
  <div class="ma-look__stage">
    <div class="ma-look__frame"><img class="ma-look__img" src="${EWER}" alt="${EWER_ALT}" loading="lazy"></div>
    <p class="ma-look__num" aria-hidden="true"><span>I</span></p>
    <p class="ma-look__cap" aria-hidden="true">Detail <b>01</b> / 05</p>
  </div>
  <div class="ma-look__text">
    <div class="ma-look__intro"><p class="r-label">p. 12 — Up close</p><h2 class="r-h2">The ewer,<br><em>up close.</em></h2><p class="r-lead">Scroll slowly. The lens moves over each detail as you read.</p></div>
    ${DETAILS.map(([t, d], i) => `<article class="ma-ch" data-i="${i}"><span class="ma-ch__n">${ROMAN[i]}</span><h3 class="r-h3">${t}</h3><p>${d}</p></article>`).join('')}
  </div>
</section>
${P.ticker(['The Baroque Issue', 'Filled with silver', 'Given with pride', 'A royal touch'])}
${P.collection('rail', 'In this<br><em>issue</em>')}
${P.story('split')}
${P.reel({ label: 'p. 32 — The campaign', heading: 'Seen in<br><em>our ads</em>', lead: 'Every page from the campaign, at the size it was printed. Spreads open across two pages.', variant: 'paper' })}
${P.occasions('accordion', 'Chosen for<br><em>the occasion</em>')}
${P.gift()}
${P.shopNow('grand')}
${P.concierge()}`);

/* ============ 8 · DIPTYCH (photo · ewer and basin as two panels that become one) ============ */
pages.diptych = page({ id: 'diptych', title: 'Kingdom — Diptych · The Art of Silver Gifting' }, `
<section class="dp-hero" aria-label="The Baroque Ewer and Basin">
  <div class="dp-pin">
    <div class="dp-word" aria-hidden="true">${logo('k-name')}</div>
    <div class="dp-panels">
      <a class="dp-panel dp-panel--l" href="shop.html" data-cursor="The Ewer">
        <span class="dp-panel__bg" aria-hidden="true"></span>
        <img class="dp-ewer" src="${EWER}" alt="${EWER_ALT}" width="1113" height="2400">
        <span class="dp-ewer__sheen" aria-hidden="true"></span>
        <span class="dp-cap"><b>I</b>The Ewer</span>
      </a>
      <a class="dp-panel dp-panel--r" href="shop.html" data-cursor="The Basin">
        <span class="dp-panel__bg" aria-hidden="true"></span>
        <span class="dp-basin" aria-hidden="true"><img src="assets/img/basin-1200.webp" alt=""></span>
        <span class="dp-cap"><b>II</b>The Basin</span>
      </a>
      <figure class="dp-pair"><img src="assets/img/pair.webp" alt="The Baroque Ewer and Basin together, the basin's polished centre reflecting the ewer" loading="lazy"></figure>
    </div>
    <div class="dp-title">
      <p class="r-label">Kingdom · Silver Collection</p>
      ${h1('dp-h1')}
    </div>
    <div class="dp-foot"><p class="r-lead">${COPY.sub}</p><a class="r-btn" href="#collection" data-magnetic="0.25"><span>Shop the pair</span>${a}</a></div>
    <div class="dp-set">
      <p class="r-label">Better together</p>
      <h2 class="r-h2">The Baroque<br><em>Set</em></h2>
      <p class="r-lead">Ewer and basin, presented together in one Kingdom box. Its polished well holds the ewer’s reflection.</p>
      <div class="dp-set__btns"><button class="r-btn" type="button" data-add="The Baroque Set" data-magnetic="0.2">${icons.bag}<span>Add the set</span></button><a class="r-btn r-btn--ghost" href="shop.html"><span>View details</span></a></div>
    </div>
  </div>
</section>
${P.ticker()}
<section class="dp-facts" aria-label="Ewer and basin">
  <div class="dp-facts__col"><p class="r-label" data-reveal>I · The Ewer</p><h2 class="r-h2" data-split>Poured with<br><em>ceremony</em></h2><ul>${DETAILS.slice(0, 3).map(([t, d]) => `<li data-reveal><b>${t}</b><span>${d}</span></li>`).join('')}</ul></div>
  <figure class="dp-facts__mid" data-img-reveal><img src="assets/img/pair.webp" alt="" loading="lazy"></figure>
  <div class="dp-facts__col"><p class="r-label" data-reveal>II · The Basin</p><h2 class="r-h2" data-split>Received with<br><em>grace</em></h2><ul><li data-reveal><b>The Pierced Rim</b><span>Scrolled acanthus, opened up so the light passes through.</span></li><li data-reveal><b>The Engraved Ground</b><span>Foliage over a finely stippled field.</span></li><li data-reveal><b>The Mirror Well</b><span>A polished centre that reflects whatever stands above it.</span></li></ul></div>
</section>
${P.occasions('accordion', 'For every<br><em>table</em>')}
${P.story('center')}
${P.reel({ heading: 'The <em>campaign</em>', lead: 'Single pages and full spreads, all at the same height. Drag or use the arrows.' })}
${P.collection('arch')}
${P.gift()}
${P.shopNow('grand')}
${P.concierge()}`);

/* ============ 9 · FILLED (photo · the engraving fills with silver as you scroll) ============ */
pages.filled = page({ id: 'filled', title: 'Kingdom — Filled · The Art of Silver Gifting', announce: 'Filled with silver. Given with pride. — every piece gift-ready' }, `
<section class="fi-hero" aria-label="Filled with silver">
  <div class="fi-pin">
    <div class="fi-word" aria-hidden="true">${logo('k-name')}</div>
    <figure class="fi-vessel" data-cursor="Silver">
      <img class="fi-etch" src="assets/img/ewer-etch.webp" alt="" aria-hidden="true">
      <div class="fi-silver"><img src="${EWER}" alt="${EWER_ALT}" width="1113" height="2400"><span class="fi-sheen" aria-hidden="true"></span></div>
      <svg class="fi-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d=""/><path class="fi-line__glow" d=""/></svg>
    </figure>
    <div class="fi-copy">
      <p class="fi-kicker" aria-live="polite"><span class="is-on">Filled with <em>silver.</em></span><span>Given with <em>pride.</em></span></p>
      ${h1('fi-h1')}
      <div class="fi-copy__row"><a class="r-btn" href="#collection" data-magnetic="0.25"><span>Shop the collection</span>${a}</a><a class="r-btn r-btn--ghost" href="#silver-filled"><span>What silver-filled means</span></a></div>
    </div>
    <div class="fi-gauge" aria-hidden="true"><span class="fi-gauge__n">000</span><i><b></b></i><span>Silver</span></div>
    <p class="fi-hint" aria-hidden="true"><i></i>Scroll to fill</p>
  </div>
</section>
<section class="fi-know" id="silver-filled" aria-label="What silver-filled means">
  <div class="r-sec-head"><p class="r-label" data-reveal>Silver-filled</p><h2 class="r-h2" data-split>The beauty of silver,<br><em>within reach</em></h2><p class="r-lead" data-reveal>Silver-filled, also known as fusion silver: beautiful pieces, beautiful presentation, unbeatable prices.</p></div>
  <ol class="fi-know__list">
    <li data-reveal><span class="fi-know__n">01</span><span class="fi-know__drop" style="--f:.92"><i></i></span><h3 class="r-h3">Filled with silver</h3><p>The presence and gleam of silver in every piece.</p></li>
    <li data-reveal data-delay=".1"><span class="fi-know__n">02</span><span class="fi-know__drop" style="--f:.66"><i></i></span><h3 class="r-h3">Beautifully presented</h3><p>Every piece arrives in Kingdom packaging, ready to give.</p></li>
    <li data-reveal data-delay=".2"><span class="fi-know__n">03</span><span class="fi-know__drop" style="--f:.4"><i></i></span><h3 class="r-h3">Priced within reach</h3><p>So generous giving is possible, for every occasion.</p></li>
  </ol>
</section>
${P.collection('arch', 'Filled with<br><em>silver</em>')}
${P.story('center')}
${P.reel({ heading: 'As seen in<br><em>our ads</em>', lead: 'Every page of the campaign. Spreads are shown full width beside single pages.' })}
${P.occasions('accordion')}
${P.gift()}
${P.shopNow('grand')}
${P.concierge()}`);

/* ============ 10 · SCEPTRE (photo · deco sunburst, kinetic type in front of and behind the silver) ============ */
const rowOf = (t, n = 4) => Array.from({ length: n }, () => `<span>${t}</span><svg class="sc-star" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z"/></svg>`).join('');
pages.sceptre = page({ id: 'sceptre', title: 'Kingdom — Sceptre · The Art of Silver Gifting', announce: 'A royal touch — every piece arrives gift-ready' }, `
<section class="sc-hero" aria-label="The Baroque Ewer">
  <div class="sc-pin">
    <svg class="sc-fan" viewBox="-500 -500 1000 1000" aria-hidden="true"><g class="sc-fan__rays">${Array.from({ length: 72 }, (_, i) => `<line x1="0" y1="0" x2="0" y2="-500" transform="rotate(${i * 5})"/>`).join('')}</g><g class="sc-fan__rings">${[120, 200, 290, 390, 480].map((r) => `<circle r="${r}"/>`).join('')}</g></svg>
    <div class="sc-row sc-row--a" aria-hidden="true"><div>${rowOf(COPY.h1a)}</div></div>
    <div class="sc-row sc-row--b" aria-hidden="true"><div>${rowOf(COPY.h1b)}</div></div>
    <figure class="sc-ewer" data-cursor="Light"><img class="sc-ewer__img" src="${EWER}" alt="${EWER_ALT}" width="1113" height="2400"><span class="sc-ewer__sheen" aria-hidden="true"></span></figure>
    <div class="sc-row sc-row--c" aria-hidden="true"><div>${rowOf(COPY.h1c.replace('.', ''))}</div></div>
    <div class="sc-copy">
      <p class="r-label">Kingdom · Silver Collection</p>
      ${h1('sc-h1')}
    </div>
    <div class="sc-cta"><p class="r-lead">${COPY.sub}</p><a class="r-btn" href="#collection" data-magnetic="0.25"><span>Shop the collection</span>${a}</a></div>
    <ul class="sc-marks" aria-label="Highlights"><li><b>Silver-filled</b></li><li><b>Gift-ready</b></li><li><b>Within reach</b></li><li><b>A royal touch</b></li></ul>
  </div>
</section>
<section class="sc-deco" aria-label="Hallmarks of a Kingdom gift">
  <div class="r-sec-head"><p class="r-label" data-reveal>Hallmarks</p><h2 class="r-h2" data-split>Four marks of a<br><em>Kingdom gift</em></h2></div>
  <div class="sc-cards">
    ${[['Silver-filled', 'The beauty and presence of silver, also known as fusion silver.', 'M12 3l7 4v10l-7 4-7-4V7z'], ['Gift-ready', 'Dressed in navy and blush Kingdom packaging, ribboned and sealed.', 'M4 9h16v11H4zM2 6h20v3H2zM12 6v14'], ['Within reach', 'Priced so generous giving is possible, for every occasion.', 'M3 18h18M4 16l1.6-9 4.4 4.6L12 5l2 6.6L18.4 7 20 16z'], ['Concierge', 'Tell us who it is for. We’ll suggest three pieces and wrap the one you choose.', 'M4 5h16v11H8l-4 4z']].map(([t, d, path], i) => `<article class="sc-card" data-i="${i}"><svg class="sc-card__frame" viewBox="0 0 300 400" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M20,1 H280 L299,20 V380 L280,399 H20 L1,380 V20 Z"/><path pathLength="1" d="M28,9 H272 L291,28 V372 L272,391 H28 L9,372 V28 Z"/></svg><svg class="sc-card__ico" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg><b>0${i + 1}</b><h3 class="r-h3">${t}</h3><p>${d}</p></article>`).join('')}
  </div>
</section>
${P.collection('arch')}
${P.ticker()}
${P.story('center')}
${P.reel({ heading: 'The <em>campaign</em>', lead: 'Page by page, as printed. Drag the reel or open any ad full screen.' })}
${P.occasions('accordion')}
${P.gift()}
${P.shopNow('grand')}
${P.concierge()}`);

/* ============ 11 · MAJESTY (3D · Regalia’s composition, with the real model) ============ */
pages.majesty = page({ id: 'majesty', title: 'Kingdom — Majesty · The Art of Silver Gifting', preloadModel: true }, `
<section class="mj-hero" aria-label="The Baroque Ewer in 3D">
  <div class="mj-pin">
    <div class="mj-word" aria-hidden="true">${logo('k-name')}</div>
    <div id="stage" class="mj-stage" data-cursor="Drag" role="img" aria-label="A silver ewer, shown in 3D. Drag to turn it; scroll to see it from every side."></div>
    <div class="mj-copy mj-copy--l"><p class="r-label">Kingdom · Silver Collection</p>${h1('mj-h1')}</div>
    <div class="mj-copy mj-copy--r"><p class="r-lead">${COPY.sub}</p><a class="r-btn" href="#collection" data-magnetic="0.25"><span>Shop the collection</span>${a}</a></div>
    <ul class="mj-specs" aria-label="Highlights"><li><b>Silver-filled</b><span>Presence of solid silver</span></li><li><b>Gift-ready</b><span>Kingdom packaging</span></li><li><b>Within reach</b><span>Priced for generous giving</span></li></ul>
    ${[['Presence', 'The Baroque Ewer', 'Acanthus relief over a stippled ground, a flared mirror spout, a crowned stopper.'], ['Ornament', 'Deep relief', 'Polished leaves over a matte, finely stippled field, so the polish reads brighter.'], ['Line', 'The scroll handle', 'Beaded and leaf-capped, it curls down into a single bead.'], ['Foundation', 'The footed base', 'Pierced scrolled feet lift the piece like a crown on a cushion.']].map(([k, t, d], i) => `<article class="mj-ch mj-ch--${i % 2 ? 'l' : 'r'}" data-i="${i}"><p class="mj-ch__k"><b>0${i + 1}</b>${k}</p><h2 class="r-h2">${t.replace(/ (\S+)$/, '<br><em>$1</em>')}</h2><p class="r-lead">${d}</p></article>`).join('')}
    <div class="mj-final"><p class="r-label">Signature piece</p><h2 class="r-h2">Yours to<br><em>give.</em></h2><div class="mj-final__btns"><button class="r-btn" type="button" data-add="The Baroque Ewer" data-magnetic="0.2">${icons.bag}<span>Add to bag</span></button><a class="r-btn r-btn--ghost" href="shop.html"><span>View details</span></a></div></div>
    <div class="mj-progress" aria-hidden="true"><span>01</span><i><b></b></i><span>04</span></div>
    <p class="mj-hint" aria-hidden="true"><span>Drag to turn</span><i></i><span>Scroll to orbit</span></p>
  </div>
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
${P.reel({ heading: 'The <em>campaign</em>', lead: 'Every page from our ads. Spreads are twice as wide, at the same height.' })}
${P.occasions('accordion', 'Silver for<br><em>every table</em>')}
${P.gift()}
${P.shopNow('grand')}
${P.concierge()}`);


/* ============ REGALIA II — Regalia, refined to the notes (photograph) ============ */
const R2_DET = [
  ['The Silver', 'Silver-filled, with the presence of solid silver.'],
  ['The Shine', 'A mirror finish that catches every light.'],
  ['The Detail', 'Fine relief, made to be looked at closely.'],
  ['The Selection', 'Every piece carefully selected.'],
  ['The Price', 'The elegance of silver, within reach.']
];
const R2_ITEMS = [
  ['decanter', 'Crowned Decanter', 'Repoussé, crowned stopper'], ['candlesticks', 'Grand Candlesticks', 'A tall pair'],
  ['spice-tower', 'Crown Spice Tower', 'Domed and belled'], ['casket', 'Baroque Casket', 'On scrolled feet'],
  ['ewer-basin', 'Ewer & Basin', 'The washing set'], ['candelabra', 'Five-Branch Candelabra', 'Scrolled arms'],
  ['tureen', 'Songbird Tureen', 'A bird on the lid'], ['honey-dish', 'Honey Dish & Tray', 'For a sweet new year']
];
const R2_STEPS = [
  ['Choose your treasure', 'From the collection, or with our concierge.'],
  ['Laid in tissue', 'Blush tissue, folded by hand.'],
  ['Your words, on a card', 'A handwritten-style note inside.'],
  ['Tied with a bow', 'Navy box, blush ribbon. Ready to give.']
];
const R2_BOW = `<svg class="g2-bow" viewBox="0 0 200 124" aria-hidden="true"><defs><linearGradient id="g2r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f8e2d2"/><stop offset=".55" stop-color="#eec3a9"/><stop offset="1" stop-color="#d49d84"/></linearGradient><linearGradient id="g2s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d9a48a"/><stop offset=".5" stop-color="#f6dccb"/><stop offset="1" stop-color="#cf987f"/></linearGradient></defs>
  <path fill="url(#g2s)" d="M95 64 L66 122 L80 115 L88 124 L101 68 Z"/><path fill="url(#g2s)" d="M105 64 L134 122 L120 115 L112 124 L99 68 Z"/>
  <path fill="url(#g2r)" d="M100 60 C72 18 24 6 16 36 C9 64 58 76 100 60 Z"/><path fill="url(#g2r)" d="M100 60 C128 18 176 6 184 36 C191 64 142 76 100 60 Z"/>
  <path fill="none" stroke="rgba(163,82,52,.25)" stroke-width="1.2" d="M96 58 C70 30 34 24 28 40 M104 58 C130 30 166 24 172 40"/>
  <ellipse cx="100" cy="61" rx="13" ry="15" fill="url(#g2s)"/></svg>`;
const R2_ADS = (P.ADS || []).slice(0, 10);
const R2_BAND = ['Filled with silver', 'Given with pride', 'Gift-ready packaging', 'A royal touch', 'Priced within reach'];
pages.regalia2 = page({ id: 'regalia2', title: 'Kingdom — Regalia II · The Art of Silver Gifting', post: (h) => h
  .replace('<body class="pg-regalia2">', '<body class="pg-regalia2" data-refined>')
  .replace(/<div class="r-announce">[\s\S]*?<\/div>/, '<div class="r-announce rg2-ann" aria-live="polite"><p class="rg2-ann__rot"><span class="is-on">Order Today. <em>Delivered to Your Door.</em></span><span>Extraordinary Pieces. <em>Unbeatable Prices.</em></span></p></div>')
  .replace('<header class="r-head r-head--center">', '<header class="r-head r-head--center rg2-head">')
  .replace('    <a href="#collection">Collection</a>\n  </nav>', '    <a href="#collection">Collection</a>\n    <a href="#story">Our Story</a>\n  </nav>')
  .replace('    <a href="#story" class="r-hide-m">Our Story</a>\n    <a href="#concierge" class="r-hide-m">Concierge</a>', '    <a href="#concierge" class="r-hide-m rg2-head__cta">Gift concierge</a>')
  .replace('<a href="index.html">All design directions</a>', '<a href="https://dartmedia.us" target="_blank" rel="noopener">dartmedia.us</a>') }, `
<div class="rg2-tone" aria-hidden="true"><i class="t-deep"></i><i class="t-royal"></i><i class="t-warm"></i></div>
<section class="rg-hero rg2-hero" aria-label="The Art of Silver Gifting">
  <div class="rg-word" aria-hidden="true">${logo('k-name')}</div>
  <figure class="rg-ewer" data-cursor="Light">
    <img class="rg-ewer__img" src="assets/img/ewer-bw-2400.webp" alt="A silver-filled Kingdom piece with deep acanthus relief" width="1113" height="2400">
    <span class="rg-ewer__sheen" aria-hidden="true"></span>
    <span class="rg-ewer__floor" aria-hidden="true"></span>
  </figure>
  <div class="rg2-lead">
    <h1 class="r-h1 rg-h1 rg2-h1"><span>${COPY.h1a}</span> <span><em>${COPY.h1b}</em> ${COPY.h1c}</span></h1>
  </div>
  <div class="rg-copy rg-copy--r rg2-copy">
    <p class="r-lead">${COPY.sub}</p>
    <a class="r-btn" href="#collection" data-magnetic="0.25"><span>Shop the collection</span>${a}</a>
  </div>
  <ul class="rg-specs" aria-label="Highlights"><li><b>Silver-filled</b><span>Presence of solid silver</span></li><li><b>Gift-ready</b><span>Kingdom packaging</span></li><li><b>Within reach</b><span>Priced for generous giving</span></li></ul>
</section>
<div class="rg2-band" aria-label="${R2_BAND.join(', ')}">
  <div class="rg2-band__glass"><span class="rg2-band__shine" aria-hidden="true"></span>
    <div class="rg2-band__run" aria-hidden="true">${[0, 1, 2, 3].map(() => R2_BAND.map((t, i) => `<span class="${i % 2 ? 'is-i' : ''}">${t}</span>${icons.crown}`).join('')).join('')}</div>
  </div>
</div>
<section class="rg2-loupe" aria-label="Look closer">
  <div class="rg2-loupe__pin">
    <div class="rg2-loupe__stage" data-cursor="Inspect">
      <div class="rg2-loupe__zoom"><img src="assets/img/ewer-bw-2400.webp" alt="Kingdom silver, seen up close" loading="lazy" decoding="async" width="1113" height="2400"></div>
      <span class="rg-lens" aria-hidden="true"><span></span></span>
      <span class="rg2-frame" aria-hidden="true"><i class="rg2-frame__edge"></i><i class="rg2-frame__inner"></i><span class="rg2-frame__crown">${logo('k-icon')}</span></span>
    </div>
    <div class="rg2-loupe__copy">
      <p class="r-label">Look closer <span class="rg2-count"><b>I</b> / V</span></p>
      <div class="rg2-ch__texts" aria-live="polite">${R2_DET.map(([t, d], i) => { const w = t.split(' '); return `<div class="rg2-ch__t${i === 0 ? ' is-on' : ''}"><h3>${w[0]} <em>${w.slice(1).join(' ')}</em></h3><p>${d}</p></div>`; }).join('')}</div>
    </div>
    <nav class="rg2-dots" aria-label="Details">${R2_DET.map(([t], i) => `<button type="button" aria-label="${t}"${i === 0 ? ' class="is-on"' : ''}><i></i></button>`).join('')}</nav>
    <svg class="rg2-leader" aria-hidden="true"><line x1="0" y1="0" x2="0" y2="0"/><circle r="3.5"/></svg>
  </div>
</section>
<section class="rg2-coll" id="collection" aria-label="The Baroque Collection">
  <div class="rg2-feat">
    <a class="rg2-feat__media" href="shop.html" data-cursor="Explore"><img src="assets/img/pair-bw.webp" alt="Pieces from the Baroque Collection" width="1748" height="1800" loading="lazy"><span class="rg2-feat__shine" aria-hidden="true"></span></a>
    <div class="rg2-feat__copy">
      <p class="r-label" data-reveal>The collection</p>
      <h2 class="r-h2" data-split>The Baroque<br><em>Collection</em></h2>
      <div class="rg2-feat__cta" data-reveal><a class="r-btn" href="shop.html" data-magnetic="0.25"><span>Explore the collection</span>${a}</a><a class="r-link" href="shop.html">All collections ${a}</a></div>
    </div>
  </div>
</section>
${(() => { const h = P.story('split'); const seal = h.match(/  <div class="r-story__seal"[\s\S]*?<\/div>\n/)[0].replace('r-story__seal', 'r-story__seal rg2-seal'); return `<section class="r-story r-story--split rg2-story" id="story" aria-label="Our story">
  <p class="r-label" data-reveal>Our story</p>
  <p class="r-story__big" data-fill>${COPY.story1}</p>
  <p class="r-story__big rg2-story__more" data-fill>From carefully selected <em>silver-filled</em> pieces to thoughtful <em>packaging,</em> every detail is designed to make giving feel <em>elevated.</em></p>
  <div class="rg2-story__row">
${seal}  </div>
</section>
<section class="rg2-trio" aria-label="The Kingdom promise"><p class="rg2-trio__line" data-reveal>${COPY.close.map((c, i) => `<span>${i === 2 ? `<em>${c.replace(/\.$/, '')}</em>` : c.replace(/\.$/, '')}</span>`).join(`<i aria-hidden="true">${logo('k-icon')}</i>`)}</p></section>`; })()}
<section class="rg2-basin" aria-label="A royal touch">
  <p class="r-label" data-reveal>Kingdom silver</p>
  <h2 class="r-h2" data-split>A royal <em>touch</em></h2>
  <p class="r-lead" data-reveal>The beauty, presence and elegance of silver, at a price that makes generous giving possible.</p>
  <div class="rg2-basin__wrap"><div class="rg2-basin__disc" data-cursor="Turn" role="img" aria-label="A silver-filled basin. Drag to turn it." tabindex="0"><img src="assets/img/basin-bw-1200.webp" alt="" width="1200" height="1200" loading="lazy" draggable="false"><span class="rg2-basin__light" aria-hidden="true"></span></div></div>
</section>
${P.occasions('accordion', 'Silver for<br><em>every table</em>')}
<section class="rg2-camp" id="campaign" aria-label="Campaign gallery">
  <div class="rg2-camp__pin">
    <div class="rg2-camp__head">
      <div><p class="r-label">As seen in our ads</p><h2 class="r-h2">The <em>campaign</em></h2></div>
      <p class="rg2-camp__meta"><b>01</b> / ${String(R2_ADS.length).padStart(2, '0')}<span class="rg2-camp__bar"><i></i></span></p>
    </div>
    <div class="rg2-camp__track">${R2_ADS.map((ad, i) => `<figure class="rg2-ad${ad.spread ? ' is-spread' : ''}"><button type="button" class="rg2-ad__open" aria-label="Open ${ad.title}" data-cursor="View"><img src="${ad.lo}" data-hi="${ad.src}" alt="${ad.alt}" loading="lazy" decoding="async" width="${ad.spread ? 1236 : 618}" height="800" draggable="false"></button><figcaption><b>${String(i + 1).padStart(2, '0')}</b>${ad.title}</figcaption></figure>`).join('')}</div>
  </div>
</section>
<div class="r-lb rg2-lb" role="dialog" aria-modal="true" aria-label="Ad viewer" hidden>
  <button type="button" class="r-lb__x" aria-label="Close">×</button>
  <button type="button" class="r-lb__nav r-lb__nav--p" data-dir="-1" aria-label="Previous">${a}</button>
  <figure class="r-lb__fig"><img alt=""><figcaption></figcaption></figure>
  <button type="button" class="r-lb__nav r-lb__nav--n" data-dir="1" aria-label="Next">${a}</button>
</div>
${P.shopNow('grand').replace('<div class="r-shop__in">', '<div class="rg2-shopmark" aria-hidden="true">' + logo('k-icon') + '<span class="rg2-shopmark__sheen"></span></div>\n  <div class="r-shop__in">').replace(/\s*<nav class="r-shop__quick"[\s\S]*?<\/nav>/, '')}
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
