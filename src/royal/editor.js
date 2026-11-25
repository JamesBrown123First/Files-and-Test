// Design studio: presets first, then fine control. Every option is pre-designed and brand-bounded.
import { PALETTES, ACCENTS, BACKGROUNDS, TYPE, MOODS, PRESETS, DETAILS, getState, getPage, setState, setPreset, resetState, onState, shareURL, editorAllowed } from './state.js';

const BG_ICON = {
  aurora: 'radial-gradient(60% 70% at 25% 35%, var(--sw2) 0, transparent 70%), radial-gradient(50% 60% at 80% 75%, var(--swa) 0, transparent 70%)',
  silk: 'repeating-linear-gradient(115deg, transparent 0 9px, rgba(255,255,255,.14) 11px, transparent 15px)',
  guilloche: 'repeating-radial-gradient(circle at 70% 50%, transparent 0 3px, rgba(255,255,255,.22) 3.6px, transparent 4.4px)',
  liquid: 'radial-gradient(40% 30% at 30% 60%, rgba(255,255,255,.35), transparent 70%), radial-gradient(30% 40% at 75% 30%, rgba(255,255,255,.22), transparent 70%)',
  stardust: 'radial-gradient(1.2px 1.2px at 20% 30%, #fff, transparent), radial-gradient(1px 1px at 60% 70%, #fff, transparent), radial-gradient(1.4px 1.4px at 80% 20%, #fff, transparent), radial-gradient(1px 1px at 35% 80%, #fff, transparent)',
  still: 'radial-gradient(70% 80% at 70% 30%, var(--sw2), transparent 75%)',
  tide: 'radial-gradient(120% 40% at 50% 115%, var(--sw2) 60%, transparent 61%), radial-gradient(120% 40% at 40% 80%, transparent 58%, var(--swa) 59%, transparent 62%), radial-gradient(130% 45% at 60% 95%, rgba(255,255,255,.08) 60%, transparent 61%)',
  rays: 'conic-gradient(from 160deg at 50% -10%, transparent 0 4deg, rgba(255,255,255,.18) 6deg, transparent 9deg 14deg, rgba(255,255,255,.12) 16deg, transparent 19deg 24deg, rgba(255,255,255,.16) 26deg, transparent 29deg 40deg), radial-gradient(40% 30% at 50% 0, var(--swa), transparent 70%)',
  velvet: 'repeating-linear-gradient(95deg, rgba(0,0,0,.25) 0 6px, rgba(255,255,255,.08) 10px, rgba(0,0,0,.2) 16px), radial-gradient(60% 60% at 60% 40%, var(--sw2), transparent 70%)',
  moire: 'repeating-radial-gradient(circle at 20% 30%, transparent 0 3px, rgba(255,255,255,.14) 4px, transparent 5px), repeating-radial-gradient(circle at 80% 70%, transparent 0 3px, rgba(255,255,255,.12) 4px, transparent 5px)',
  veil: 'linear-gradient(90deg, transparent, var(--sw2) 30%, transparent 50%, var(--swa) 70%, transparent)',
  bloom: 'radial-gradient(circle at 50% 45%, var(--swa) 0, var(--sw2) 30%, transparent 70%)',
  mesh: 'radial-gradient(60% 60% at 20% 20%, var(--sw2), transparent 70%), radial-gradient(50% 50% at 80% 80%, var(--swa), transparent 70%)',
  dawn: 'linear-gradient(180deg, var(--sw2), transparent 60%), radial-gradient(80% 40% at 50% 100%, var(--swa), transparent 70%)',
  sovereign: 'radial-gradient(70% 60% at 95% 100%, var(--swa), transparent 70%), linear-gradient(140deg, var(--sw1), var(--sw2) 60%, var(--sw3))'
};

export function initEditor() {
  if (!editorAllowed()) return;
  const page = getPage();
  const wrap = document.createElement('div');
  wrap.className = 'r-ed';
  wrap.innerHTML = `
  <button class="r-ed__fab" type="button" aria-expanded="false" aria-controls="r-ed-panel" data-cursor="Design">
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17M3.5 12h17" opacity=".35"/><circle cx="12" cy="12" r="3"/></svg>
    <span>Design</span>
  </button>
  <aside class="r-ed__panel" id="r-ed-panel" aria-label="Design studio" aria-hidden="true">
    <header class="r-ed__head">
      <div><p class="r-ed__kicker">Design studio</p><h2>${page.name}</h2></div>
      <div class="r-ed__hbtns">
        <button class="r-ed__peek" type="button" aria-label="Hide the studio and view the design" title="View design (H)">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.6-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.6 6.5-9.5 6.5S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/></svg>
          <span>View design</span>
        </button>
        <button class="r-ed__x" type="button" aria-label="Close design studio">×</button>
      </div>
    </header>
    <nav class="r-ed__tabs" role="tablist">
      <button role="tab" data-tab="presets" aria-selected="true">Presets</button>
      <button role="tab" data-tab="colour">Colour</button>
      <button role="tab" data-tab="type">Type</button>
      ${page.details ? '<button role="tab" data-tab="details">Details</button>' : ''}
      ${page.three ? '<button role="tab" data-tab="silver">Silver</button>' : ''}
      <button role="tab" data-tab="motion">Motion</button>
    </nav>
    <div class="r-ed__body">
      <section data-pane="presets">
        <p class="r-ed__hint">Ready-made looks. Pick one, then fine-tune in the other tabs.</p>
        <button type="button" class="r-ed__surprise" data-act="surprise"><span>✦</span> Surprise me <small>a new, balanced combination</small></button>
        <h3 class="r-ed__group">Suggested for ${page.name}</h3>
        <div class="r-ed__presets" data-group="rec"></div>
        <h3 class="r-ed__group">All looks</h3>
        <div class="r-ed__presets" data-group="all"></div>
      </section>
      <section data-pane="colour" hidden>
        <h3>Dark palettes</h3><div class="r-ed__pals" data-mode="dark"></div>
        <h3>Light palettes</h3><div class="r-ed__pals" data-mode="light"></div>
        <h3>Accent</h3><div class="r-ed__accents"></div>
        <h3>Background</h3><div class="r-ed__bgs"></div>
      </section>
      <section data-pane="type" hidden><div class="r-ed__types"></div></section>
      ${page.details ? `<section data-pane="details" hidden>
        <p class="r-ed__hint">Designed variations of the page’s details. Every combination works.</p>
        ${Object.entries(DETAILS).map(([k, d]) => `<h3>${d.name}</h3><div class="r-ed__dets" data-det="${k}">${d.opts.map(([v, n, note]) => `<button type="button" data-v="${v}" title="${note}"><span class="r-ed__dv r-ed__dv--${k}-${v}" aria-hidden="true"></span><b>${n}</b><small>${note}</small></button>`).join('')}</div>`).join('')}
      </section>` : ''}
      ${page.three ? `<section data-pane="silver" hidden>
        <p class="r-ed__hint">Studio lighting for the 3D ewer. Reflections stay live as it turns.</p>
        <div class="r-ed__moods"></div>
        <label class="r-ed__slider"><span>Exposure</span><input type="range" min="0.75" max="1.3" step="0.01" data-k="exposure"><output></output></label>
      </section>` : ''}
      <section data-pane="motion" hidden>
        <h3>Motion</h3>
        <div class="r-ed__seg" data-k="motion"><button data-v="full">Full</button><button data-v="calm">Calm</button><button data-v="still">Still</button></div>
        <label class="r-ed__slider"><span>Background strength</span><input type="range" min="0.2" max="1.4" step="0.05" data-k="intensity"><output></output></label>
        <label class="r-ed__toggle"><span>Film grain</span><input type="checkbox" data-k="grain"><i></i></label>
        <label class="r-ed__toggle"><span>Custom cursor</span><input type="checkbox" data-k="cursor"><i></i></label>
      </section>
    </div>
    <footer class="r-ed__foot">
      <button type="button" data-act="reset">Reset</button>
      <button type="button" data-act="share">Copy share link</button>
      <button type="button" data-act="copy" class="is-main">Copy settings</button>
    </footer>
    <p class="r-ed__status" role="status"></p>
  </aside>
  <button class="r-ed__back" type="button" aria-label="Back to the design studio" title="Back to studio (H)">
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3"/></svg>
    <span>Back to studio</span>
  </button>`;
  document.body.appendChild(wrap);
  const $ = (s) => wrap.querySelector(s);
  const fab = $('.r-ed__fab'), panel = $('.r-ed__panel');
  const toggle = (on) => { wrap.classList.toggle('is-open', on); fab.setAttribute('aria-expanded', on); panel.setAttribute('aria-hidden', !on); };
  fab.addEventListener('click', () => toggle(!wrap.classList.contains('is-open')));
  $('.r-ed__x').addEventListener('click', () => toggle(false));
  // view design: the whole studio steps away (panel + button) so the page is seen clean
  let dimT;
  const preview = (on) => {
    wrap.classList.toggle('is-preview', on);
    clearTimeout(dimT); wrap.classList.remove('is-dim');
    if (on) { toggle(false); dimT = setTimeout(() => wrap.classList.add('is-dim'), 2600); }
    else toggle(true);
  };
  $('.r-ed__peek').addEventListener('click', () => preview(true));
  $('.r-ed__back').addEventListener('click', () => preview(false));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { wrap.classList.contains('is-preview') ? preview(false) : toggle(false); return; }
    if ((e.key === 'h' || e.key === 'H') && !e.metaKey && !e.ctrlKey && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '')) {
      if (wrap.classList.contains('is-preview')) preview(false);
      else if (wrap.classList.contains('is-open')) preview(true);
    }
  });
  if (/edit/.test(location.hash)) toggle(true);

  wrap.querySelectorAll('[data-tab]').forEach((b) => b.addEventListener('click', () => {
    wrap.querySelectorAll('[data-tab]').forEach((x) => x.setAttribute('aria-selected', x === b));
    wrap.querySelectorAll('[data-pane]').forEach((p) => (p.hidden = p.dataset.pane !== b.dataset.tab));
  }));

  // presets — this page's recommended looks first, then every look
  const card = (id, rec) => {
    const p = PRESETS[id], P = PALETTES[p.palette], T = TYPE[p.type];
    return `<button class="r-ed__preset" data-preset="${id}" style="--a:${P.colors[0]};--b:${P.colors[1]};--g:${P.colors[2]};--x:${p.accent};--f:${T.display};--ink:${P.mode === 'dark' ? '#f4efe9' : '#18263b'}">
      <span class="r-ed__pv"><i style="background-image:${BG_ICON[p.bg].replace(/var\(--sw2\)/g, P.colors[2]).replace(/var\(--swa\)/g, p.accent)}"></i><b style="text-transform:${T.up ? 'uppercase' : 'none'}">Aa</b><em></em></span>
      <span class="r-ed__pn">${p.name}${rec ? '<small>Suggested</small>' : p.d ? '<small>New</small>' : ''}</span></button>`;
  };
  const recs = (page.presets || []).filter((k) => PRESETS[k]);
  $('[data-group="rec"]').innerHTML = recs.map((id) => card(id, true)).join('');
  const rest = Object.keys(PRESETS).filter((k) => !recs.includes(k)).sort((a, b) => (PRESETS[b].d ? 1 : 0) - (PRESETS[a].d ? 1 : 0));
  $('[data-group="all"]').innerHTML = rest.map((id) => card(id, false)).join('');
  wrap.querySelectorAll('[data-preset]').forEach((b) => b.addEventListener('click', () => setPreset(b.dataset.preset)));

  ['dark', 'light'].forEach((m) => {
    wrap.querySelector(`.r-ed__pals[data-mode="${m}"]`).innerHTML = Object.entries(PALETTES).filter(([, p]) => p.mode === m).map(([id, p]) =>
      `<button class="r-ed__pal" data-pal="${id}" title="${p.note}"><span style="background:linear-gradient(135deg,${p.colors[0]},${p.colors[1]} 45%,${p.colors[2]} 80%,${p.colors[3]})"></span><b>${p.name}</b></button>`).join('');
  });
  wrap.querySelectorAll('[data-pal]').forEach((b) => b.addEventListener('click', () => setState({ palette: b.dataset.pal })));
  wrap.querySelectorAll('.r-ed__bgs').forEach((el) => (el.innerHTML = BACKGROUNDS.map(([id, n, note]) => `<button class="r-ed__bg" data-bg="${id}" title="${note}"><span data-bgprev="${id}"></span><b>${n}</b></button>`).join('')));
  wrap.querySelectorAll('[data-bg]').forEach((b) => b.addEventListener('click', () => setState({ bg: b.dataset.bg })));
  // luxury pairings with a script accent first, then the rest
  const typeOrder = Object.entries(TYPE).sort((a, b) => (b[1].iscale ? 1 : 0) - (a[1].iscale ? 1 : 0));
  $('.r-ed__types').innerHTML = typeOrder.map(([id, t]) =>
    `<button class="r-ed__type" data-type="${id}"><b style="font-family:${t.display};font-weight:${t.weight};letter-spacing:${t.track};text-transform:${t.up ? 'uppercase' : 'none'}">The Art of <i style="font-family:${t.italic};font-style:italic;font-weight:${t.ital || 300};font-size:${t.iscale || 1}em;text-transform:none;color:var(--a1)">Silver</i></b><span><em>${t.name}</em> ${t.note}</span></button>`).join('');
  wrap.querySelectorAll('[data-type]').forEach((b) => b.addEventListener('click', () => setState({ type: b.dataset.type })));
  if (page.three) {
    $('.r-ed__moods').innerHTML = Object.entries(MOODS).map(([id, m]) => `<button class="r-ed__mood" data-mood="${id}"><span data-moodprev="${id}"></span><b>${m.name}</b><small>${m.note}</small></button>`).join('');
    wrap.querySelectorAll('[data-mood]').forEach((b) => b.addEventListener('click', () => setState({ mood: b.dataset.mood })));
  }
  wrap.querySelectorAll('.r-ed__dets button').forEach((b) => b.addEventListener('click', () => setState({ [b.parentElement.dataset.det]: b.dataset.v })));
  wrap.querySelectorAll('.r-ed__seg button').forEach((b) => b.addEventListener('click', () => setState({ [b.parentElement.dataset.k]: b.dataset.v })));
  wrap.querySelectorAll('input[type=range]').forEach((i) => i.addEventListener('input', () => setState({ [i.dataset.k]: +i.value })));
  wrap.querySelectorAll('input[type=checkbox]').forEach((i) => i.addEventListener('change', () => setState({ [i.dataset.k]: i.checked })));

  const status = $('.r-ed__status');
  const say = (t) => { status.textContent = t; status.classList.add('is-on'); clearTimeout(say.tm); say.tm = setTimeout(() => status.classList.remove('is-on'), 2600); };
  const copy = async (txt, ok) => { try { await navigator.clipboard.writeText(txt); say(ok); } catch { prompt('Copy this:', txt); } };
  // Surprise me: a random but balanced look — palette, matching accent, background, type and details
  wrap.querySelector('[data-act="surprise"]').addEventListener('click', () => {
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    const pal = pick(Object.keys(PALETTES)), mode = PALETTES[pal].mode;
    const patch = { palette: pal, accent: pick(ACCENTS[mode])[0], bg: pick(BACKGROUNDS.filter((b) => b[0] !== 'still'))[0], type: pick(Object.keys(TYPE).filter((t) => t !== 'brand')) };
    if (page.details) for (const k in DETAILS) patch[k] = pick(DETAILS[k].opts)[0];
    setState(patch); say(`${PALETTES[pal].name} · ${TYPE[patch.type].name} · ${BACKGROUNDS.find((b) => b[0] === patch.bg)[1]}`);
  });
  wrap.querySelector('[data-act="reset"]').addEventListener('click', () => { resetState(); say('Back to this page’s original look.'); });
  wrap.querySelector('[data-act="share"]').addEventListener('click', () => copy(shareURL(), 'Link copied. Anyone who opens it sees this exact look.'));
  wrap.querySelector('[data-act="copy"]').addEventListener('click', () => {
    const s = getState(); const o = { palette: s.palette, bg: s.bg, accent: s.accent, type: s.type, mood: s.mood, intensity: s.intensity, exposure: s.exposure };
    if (page.details) for (const k in DETAILS) o[k] = s[k];
    copy(`"${page.id}": ${JSON.stringify(o)}`, 'Settings copied. Paste them into site.config.js to make this the look for everyone.');
  });

  const sync = (s) => {
    const mode = PALETTES[s.palette].mode;
    wrap.querySelectorAll('[data-preset]').forEach((b) => b.classList.toggle('is-on', b.dataset.preset === s.preset));
    wrap.querySelectorAll('[data-pal]').forEach((b) => b.classList.toggle('is-on', b.dataset.pal === s.palette));
    wrap.querySelectorAll('[data-bg]').forEach((b) => b.classList.toggle('is-on', b.dataset.bg === s.bg));
    wrap.querySelectorAll('[data-type]').forEach((b) => b.classList.toggle('is-on', b.dataset.type === s.type));
    wrap.querySelectorAll('[data-mood]').forEach((b) => b.classList.toggle('is-on', b.dataset.mood === s.mood));
    $('.r-ed__accents').innerHTML = ACCENTS[mode].map(([c, n]) => `<button class="r-ed__acc${c === s.accent ? ' is-on' : ''}" data-acc="${c}" style="--sw:${c}" aria-label="${n}"><i></i><b>${n}</b></button>`).join('');
    wrap.querySelectorAll('[data-acc]').forEach((b) => b.addEventListener('click', () => setState({ accent: b.dataset.acc })));
    wrap.querySelectorAll('.r-ed__dets').forEach((g) => g.querySelectorAll('button').forEach((b) => b.classList.toggle('is-on', s[g.dataset.det] === b.dataset.v)));
    wrap.querySelectorAll('.r-ed__seg').forEach((g) => g.querySelectorAll('button').forEach((b) => b.classList.toggle('is-on', s[g.dataset.k] === b.dataset.v)));
    wrap.querySelectorAll('input[type=range]').forEach((i) => { i.value = s[i.dataset.k] ?? 1; i.nextElementSibling.textContent = Math.round((s[i.dataset.k] ?? 1) * 100) + '%'; });
    wrap.querySelectorAll('input[type=checkbox]').forEach((i) => (i.checked = !!s[i.dataset.k]));
    const P = PALETTES[s.palette];
    wrap.querySelectorAll('[data-bgprev]').forEach((el) => {
      el.style.background = `${BG_ICON[el.dataset.bgprev].replace(/var\(--sw2\)/g, P.colors[2]).replace(/var\(--swa\)/g, s.accent)}, linear-gradient(160deg, ${P.colors[0]}, ${P.colors[1]})`;
    });
  };
  sync(getState()); onState(sync);
}
