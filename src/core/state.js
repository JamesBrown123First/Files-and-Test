// Kingdom: design state, presets and theming.
// Every choice in the editor maps to values defined here, so any mix stays on-brand.

export const PALETTES = {
  royalNight:  { name: 'Royal Night',  mode: 'dark',  colors: ['#0c1424', '#131c2b', '#124980', '#f3c09b'] },
  midnight:    { name: 'Midnight',     mode: 'dark',  colors: ['#090e17', '#18263b', '#2b3a4a', '#dba58c'] },
  royalBlue:   { name: 'Royal Blue',   mode: 'dark',  colors: ['#0e2747', '#131c2b', '#3472a8', '#f2d4be'] },
  inkCopper:   { name: 'Ink & Copper', mode: 'dark',  colors: ['#0f1622', '#18263b', '#a35234', '#f3c09b'] },
  dusk:        { name: 'Dusk',         mode: 'dark',  colors: ['#1f2b38', '#2b3a4a', '#dba58c', '#f2d4be'] },
  blush:       { name: 'Blush',        mode: 'light', colors: ['#f2d4be', '#f9ebe0', '#cc917b', '#fff8f2'] },
  peach:       { name: 'Peach Copper', mode: 'light', colors: ['#f3c09b', '#f2d4be', '#cc917b', '#fff4ea'] },
  ivory:       { name: 'Ivory',        mode: 'light', colors: ['#f4eee7', '#fbf8f4', '#f2d4be', '#ffffff'] }
};

export const BG_STYLES = [
  ['silk', 'Silk', 'Slow satin waves'],
  ['aurora', 'Aurora', 'Colour drifting light'],
  ['liquid', 'Liquid', 'Molten silver sheen'],
  ['still', 'Still', 'Quiet gradient']
];

export const ACCENTS = {
  dark:  [['#f3c09b', 'Peach'], ['#f2d4be', 'Blush'], ['#dba58c', 'Rose'], ['#cc917b', 'Copper rose'], ['#8fb6dc', 'Royal light']],
  light: [['#a35234', 'Copper'], ['#18263b', 'Navy'], ['#14395c', 'Royal'], ['#cc917b', 'Copper rose'], ['#3472a8', 'Blue']]
};

export const TYPE = {
  heritage: { name: 'Heritage', note: 'Italiana · Manrope', display: "'Italiana', 'Times New Roman', serif", italic: "'Cormorant Garamond', serif", text: "'Manrope', system-ui, sans-serif", weight: 400, track: '-0.01em', caseUp: false },
  atelier:  { name: 'Atelier',  note: 'Cormorant · Manrope', display: "'Cormorant Garamond', 'Times New Roman', serif", italic: "'Cormorant Garamond', serif", text: "'Manrope', system-ui, sans-serif", weight: 300, track: '-0.02em', caseUp: false },
  couture:  { name: 'Couture',  note: 'Bodoni Moda · Manrope', display: "'Bodoni Moda', 'Times New Roman', serif", italic: "'Bodoni Moda', serif", text: "'Manrope', system-ui, sans-serif", weight: 400, track: '-0.03em', caseUp: false },
  crest:    { name: 'Crest',    note: 'Marcellus · Poppins', display: "'Marcellus', 'Times New Roman', serif", italic: "'Cormorant Garamond', serif", text: "'Poppins', system-ui, sans-serif", weight: 400, track: '0.02em', caseUp: true }
};

export const MOODS = {
  studio:  { name: 'Studio',  note: 'Balanced, crisp',     exposure: 1.0,  studio: { base: 1.25,  flags: 0.75, strips: 1,   key: 1,   warm: 0.35, cool: 0 } },
  gallery: { name: 'Gallery', note: 'Bright and airy',     exposure: 1.05, studio: { base: 1.35, flags: 0.45, strips: 0.9, key: 1.2, warm: 0.5,  cool: 0 } },
  noir:    { name: 'Noir',    note: 'Deep, dramatic',      exposure: 0.95, studio: { base: 0.8,  flags: 1,    strips: 1.2, key: 0.8, warm: 0.25, cool: 0.8 } }
};

export const PRESETS = {
  'royal-night': { name: 'Royal Night', palette: 'royalNight', bg: 'aurora', accent: '#f3c09b', type: 'heritage', mood: 'studio' },
  'midnight-silk': { name: 'Midnight Silk', palette: 'midnight', bg: 'silk', accent: '#dba58c', type: 'crest', mood: 'noir' },
  'royal-blue': { name: 'Royal Blue', palette: 'royalBlue', bg: 'silk', accent: '#f2d4be', type: 'heritage', mood: 'studio' },
  'ink-copper': { name: 'Ink & Copper', palette: 'inkCopper', bg: 'liquid', accent: '#f3c09b', type: 'couture', mood: 'noir' },
  'dusk': { name: 'Dusk', palette: 'dusk', bg: 'aurora', accent: '#f2d4be', type: 'atelier', mood: 'studio' },
  'blush-atelier': { name: 'Blush Atelier', palette: 'blush', bg: 'silk', accent: '#a35234', type: 'couture', mood: 'gallery' },
  'peach-copper': { name: 'Peach Copper', palette: 'peach', bg: 'aurora', accent: '#18263b', type: 'atelier', mood: 'gallery' },
  'ivory-gallery': { name: 'Ivory Gallery', palette: 'ivory', bg: 'still', accent: '#14395c', type: 'atelier', mood: 'gallery' }
};

export const CONCEPTS = [
  { id: 'ceremony', href: 'ceremony.html', name: 'Ceremony', kind: '3D model' },
  { id: 'sovereign', href: 'sovereign.html', name: 'Sovereign', kind: '3D model' },
  { id: 'vitrine', href: 'vitrine.html', name: 'Vitrine', kind: '3D model' },
  { id: 'nocturne', href: 'nocturne.html', name: 'Nocturne', kind: 'Photograph' },
  { id: 'hallmark', href: 'hallmark.html', name: 'Hallmark', kind: 'Photograph' }
];

const listeners = new Set();
let state = null;
let pageCfg = null;

const clone = (o) => JSON.parse(JSON.stringify(o));

export function stateFromPreset(id) {
  const p = PRESETS[id];
  return { preset: id, palette: p.palette, bg: p.bg, accent: p.accent, type: p.type, mood: p.mood, exposure: 1, motion: 'full', grain: true, cursor: true, shimmer: 'soft', follow: true };
}

function decodeHash() {
  const m = location.hash.match(/k=([A-Za-z0-9_-]+)/);
  if (!m) return null;
  try { return JSON.parse(decodeURIComponent(escape(atob(m[1].replace(/-/g, '+').replace(/_/g, '/'))))); } catch { return null; }
}
export function shareURL() {
  const b = btoa(unescape(encodeURIComponent(JSON.stringify(state)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return location.href.split('#')[0] + '#k=' + b;
}

function store(k, v) { try { localStorage.setItem(k, v); } catch {} }
function load(k) { try { return localStorage.getItem(k); } catch { return null; } }

export function initState(cfg) {
  pageCfg = cfg;
  const def = stateFromPreset(cfg.preset);
  let s = decodeHash();
  if (!s) { const raw = load('kingdom:v2:' + cfg.id); if (raw) try { s = JSON.parse(raw); } catch {} }
  state = Object.assign(def, s || {});
  if (!PALETTES[state.palette]) state.palette = def.palette;
  if (!TYPE[state.type]) state.type = def.type;
  if (!MOODS[state.mood]) state.mood = def.mood;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches && !s) state.motion = 'reduced';
  apply();
  return state;
}

export const getState = () => state;
export const getPage = () => pageCfg;
export const defaults = () => stateFromPreset(pageCfg.preset);
export const onState = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };

export function setState(patch, opts = {}) {
  Object.assign(state, patch);
  if (!opts.keepPreset && !('preset' in patch)) state.preset = null;
  store('kingdom:v2:' + pageCfg.id, JSON.stringify(state));
  apply();
}
export function setPreset(id) {
  const keep = { motion: state.motion, grain: state.grain, cursor: state.cursor, shimmer: state.shimmer, follow: state.follow, exposure: 1 };
  state = Object.assign(stateFromPreset(id), keep);
  store('kingdom:v2:' + pageCfg.id, JSON.stringify(state));
  apply();
}
export function resetState() { state = defaults(); store('kingdom:v2:' + pageCfg.id, JSON.stringify(state)); apply(); }

export function palette() { return PALETTES[state.palette]; }
export function mode() { return palette().mode; }

function hexToRgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
export const rgb01 = (h) => hexToRgb(h).map((v) => v / 255);
function lum(h) { const [r, g, b] = rgb01(h).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }

function apply() {
  const root = document.documentElement;
  const P = palette(); const T = TYPE[state.type];
  const dark = P.mode === 'dark';
  // keep the accent readable for the palette's mode
  const allowed = ACCENTS[P.mode].map((a) => a[0]);
  if (!allowed.includes(state.accent)) state.accent = allowed[0];
  const ink = dark ? '#f3eee8' : '#18263b';
  const inkRgb = hexToRgb(ink).join(',');
  const acc = state.accent;
  const v = {
    '--c0': P.colors[0], '--c1': P.colors[1], '--c2': P.colors[2], '--c3': P.colors[3],
    '--ink': ink, '--ink-rgb': inkRgb,
    '--ink-2': `rgba(${inkRgb},${dark ? 0.74 : 0.76})`, '--ink-3': `rgba(${inkRgb},${dark ? 0.5 : 0.52})`, '--ink-4': `rgba(${inkRgb},${dark ? 0.26 : 0.24})`,
    '--line': `rgba(${inkRgb},${dark ? 0.14 : 0.16})`, '--line-2': `rgba(${inkRgb},${dark ? 0.28 : 0.3})`,
    '--accent': acc, '--accent-rgb': hexToRgb(acc).join(','), '--on-accent': lum(acc) > 0.35 ? '#131c2b' : '#fbf3ec',
    '--surface': dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.45)',
    '--glass': dark ? 'rgba(14,20,32,0.62)' : 'rgba(255,250,245,0.66)',
    '--font-display': T.display, '--font-italic': T.italic, '--font-text': T.text,
    '--display-weight': T.weight, '--display-track': T.track, '--display-case': T.caseUp ? 'uppercase' : 'none',
    '--display-scale': T.caseUp ? 0.82 : 1
  };
  for (const k in v) root.style.setProperty(k, v[k]);
  root.dataset.mode = P.mode;
  root.dataset.type = state.type;
  root.dataset.motion = state.motion;
  root.classList.toggle('no-grain', !state.grain);
  root.classList.toggle('no-cursor', !state.cursor);
  const meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.content = P.colors[1];
  listeners.forEach((fn) => fn(state));
}
