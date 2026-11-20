// Design studio: a small, bounded editor. Every option is a finished, on-brand choice.
import { PALETTES, BG_STYLES, ACCENTS, TYPE, MOODS, PRESETS, CONCEPTS, getState, getPage, setState, setPreset, resetState, onState, shareURL, palette } from './state.js';
import { lenis } from './ui.js';

const h = (tag, attrs = {}, kids = []) => {
  const e = document.createElement(tag);
  for (const k in attrs) {
    if (k.startsWith('on')) e.addEventListener(k.slice(2), attrs[k]);
    else if (k === 'style' && typeof attrs[k] === 'object') Object.assign(e.style, attrs[k]);
    else if (attrs[k] !== false && attrs[k] != null) e.setAttribute(k, attrs[k]);
  }
  (Array.isArray(kids) ? kids : [kids]).forEach((c) => c != null && e.append(c.nodeType ? c : document.createTextNode(c)));
  return e;
};

const grad = (c) => `linear-gradient(135deg, ${c[1]} 0%, ${c[0]} 38%, ${c[2]} 78%, ${c[3]} 100%)`;

export function initEditor() {
  const cfg = window.KINGDOM_CFG || {};
  if (cfg.editor === false) return;
  const page = getPage();
  const wrap = h('div', { class: 'k-ed', 'data-lenis-prevent': '' });
  const toggle = h('button', { class: 'k-ed__toggle', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'k-ed-panel', 'data-cursor': 'none' }, [
    h('span', { class: 'k-ed__toggle-ico', 'aria-hidden': 'true' }), h('span', {}, 'Design')
  ]);
  const panel = h('aside', { class: 'k-ed__panel', id: 'k-ed-panel', 'aria-label': 'Design studio' });
  wrap.append(toggle, panel);
  document.body.append(wrap);

  const open = (v) => {
    wrap.classList.toggle('is-open', v); toggle.setAttribute('aria-expanded', v);
    if (innerWidth < 760) v ? lenis?.stop() : lenis?.start();
  };
  toggle.addEventListener('click', () => open(!wrap.classList.contains('is-open')));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') open(false);
    if ((e.key === 'e' || e.key === 'E') && !/input|textarea|select/i.test(e.target.tagName) && !e.metaKey && !e.ctrlKey && !e.altKey) open(!wrap.classList.contains('is-open'));
  });

  const section = (title, body, hint) => h('section', { class: 'k-ed__sec' }, [h('div', { class: 'k-ed__sec-head' }, [h('h3', {}, title), hint ? h('span', {}, hint) : null]), body]);
  const seg = (items, cur, onPick) => h('div', { class: 'k-ed__seg', role: 'radiogroup' }, items.map(([id, name, hint]) =>
    h('button', { type: 'button', role: 'radio', 'aria-checked': cur === id ? 'true' : 'false', title: hint || null, class: cur === id ? 'is-on' : '', onclick: () => onPick(id) }, name)));
  const sw = (on, label, onclick) => h('button', { type: 'button', class: 'k-ed__switch' + (on ? ' is-on' : ''), role: 'switch', 'aria-checked': on ? 'true' : 'false', onclick }, [h('span', {}, label), h('i', { 'aria-hidden': 'true' })]);

  let scrollPos = 0;
  const render = () => {
    const s = getState();
    const body = panel.querySelector('.k-ed__body');
    if (body) scrollPos = body.scrollTop;
    panel.innerHTML = '';
    const head = h('header', { class: 'k-ed__head' }, [
      h('div', {}, [h('p', { class: 'k-ed__eyebrow' }, 'Kingdom'), h('h2', {}, 'Design studio')]),
      h('button', { type: 'button', class: 'k-ed__close', 'aria-label': 'Close', onclick: () => open(false) }, '×')
    ]);
    const b = h('div', { class: 'k-ed__body' });

    b.append(section('Concept', h('div', { class: 'k-ed__concepts' }, CONCEPTS.map((c) =>
      h('a', { href: c.href, class: 'k-ed__concept' + (c.id === page.id ? ' is-on' : '') }, [h('b', {}, c.name), h('span', {}, c.kind)])))));

    b.append(section('Presets', h('div', { class: 'k-ed__presets' }, Object.entries(PRESETS).map(([id, p]) => {
      const P = PALETTES[p.palette];
      return h('button', { type: 'button', class: 'k-ed__preset' + (s.preset === id ? ' is-on' : ''), 'aria-pressed': s.preset === id ? 'true' : 'false', onclick: () => setPreset(id) }, [
        h('span', { class: 'k-ed__preset-sw', style: { background: grad(P.colors) } }, [
          h('span', { class: 'k-ed__preset-aa', style: { fontFamily: TYPE[p.type].display, color: P.mode === 'dark' ? '#f3eee8' : '#18263b', textTransform: TYPE[p.type].caseUp ? 'uppercase' : 'none' } }, 'Ag'),
          h('i', { style: { background: p.accent } })
        ]),
        h('span', { class: 'k-ed__preset-name' }, p.name)
      ]);
    })), 'A finished look in one tap'));

    b.append(section('Background', h('div', { class: 'k-ed__stack' }, [
      h('div', { class: 'k-ed__palettes' }, Object.entries(PALETTES).map(([id, P]) =>
        h('button', { type: 'button', class: 'k-ed__pal' + (s.palette === id ? ' is-on' : ''), title: P.name, 'aria-label': P.name, 'aria-pressed': s.palette === id ? 'true' : 'false', style: { background: grad(P.colors) }, onclick: () => setState({ palette: id }) }))),
      h('p', { class: 'k-ed__cap' }, PALETTES[s.palette].name + ' · ' + (PALETTES[s.palette].mode === 'dark' ? 'dark' : 'light')),
      seg(BG_STYLES, s.bg, (id) => setState({ bg: id }))
    ])));

    b.append(section('Accent', h('div', { class: 'k-ed__accents' }, ACCENTS[palette().mode].map(([c, n]) =>
      h('button', { type: 'button', class: 'k-ed__acc' + (s.accent === c ? ' is-on' : ''), title: n, 'aria-label': n, style: { background: c }, onclick: () => setState({ accent: c }) }))), 'Buttons, details, highlights'));

    b.append(section('Typography', h('div', { class: 'k-ed__types' }, Object.entries(TYPE).map(([id, T]) =>
      h('button', { type: 'button', class: 'k-ed__type' + (s.type === id ? ' is-on' : ''), 'aria-pressed': s.type === id ? 'true' : 'false', onclick: () => setState({ type: id }) }, [
        h('span', { class: 'k-ed__type-aa', style: { fontFamily: T.display, fontWeight: T.weight, textTransform: T.caseUp ? 'uppercase' : 'none' } }, 'Silver'),
        h('span', { class: 'k-ed__type-meta' }, [h('b', {}, T.name), h('span', {}, T.note)])
      ])))));

    if (page.kind === '3d') {
      b.append(section('Silver lighting', h('div', { class: 'k-ed__stack' }, [
        seg(Object.entries(MOODS).map(([id, m]) => [id, m.name, m.note]), s.mood, (id) => setState({ mood: id })),
        h('label', { class: 'k-ed__range' }, [h('span', {}, 'Brightness'),
          h('input', { type: 'range', min: '0.85', max: '1.2', step: '0.01', value: s.exposure, oninput: (e) => setState({ exposure: +e.target.value }, { keepPreset: true }) })])
      ]), 'Studio light on the model'));
    } else {
      b.append(section('Silver light', h('div', { class: 'k-ed__stack' }, [
        seg([['off', 'Off'], ['soft', 'Soft'], ['bright', 'Bright']], s.shimmer, (id) => setState({ shimmer: id }, { keepPreset: true })),
        sw(s.follow, 'Light follows the cursor', () => setState({ follow: !s.follow }, { keepPreset: true }))
      ]), 'Shimmer across the photograph'));
    }

    b.append(section('Details', h('div', { class: 'k-ed__stack' }, [
      seg([['full', 'Full motion'], ['reduced', 'Reduced']], s.motion, (id) => { setState({ motion: id }, { keepPreset: true }); setTimeout(() => location.reload(), 150); }),
      sw(s.grain, 'Film grain', () => setState({ grain: !s.grain }, { keepPreset: true })),
      sw(s.cursor, 'Custom cursor', () => setState({ cursor: !s.cursor }, { keepPreset: true }))
    ])));

    const foot = h('footer', { class: 'k-ed__foot' }, [
      h('button', { type: 'button', class: 'k-ed__btn', onclick: () => resetState() }, 'Reset'),
      h('button', { type: 'button', class: 'k-ed__btn k-ed__btn--solid', onclick: async (e) => {
        const url = shareURL();
        try { await navigator.clipboard.writeText(url); e.target.textContent = 'Link copied'; } catch { history.replaceState(null, '', url); e.target.textContent = 'Saved to address bar'; }
        setTimeout(() => (e.target.textContent = 'Copy link to this look'), 1800);
      } }, 'Copy link to this look')
    ]);
    panel.append(head, b, foot);
    b.scrollTop = scrollPos;
  };
  render();
  onState(render);
}
