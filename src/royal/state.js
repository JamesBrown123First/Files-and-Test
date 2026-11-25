// Kingdom · Royal kit — design state, presets and theming.
// Every editor option maps to values defined here, so any mix stays on-brand.
// Brand colours only: #a35234 #f3c09b · #18263b #14395c #3472a8 · #dba58c>#2b3a4a · #cc917b #f2d4be · #124980>#131c2b

export const PALETTES = {
  royal:    { name: 'Royal Night',  mode: 'dark',  colors: ['#0b1220', '#131c2b', '#124980', '#3472a8'], note: 'Navy · royal blue' },
  navy:     { name: 'Midnight',     mode: 'dark',  colors: ['#0c1522', '#18263b', '#14395c', '#2b3a4a'], note: 'Deep navy' },
  sapphire: { name: 'Sapphire',     mode: 'dark',  colors: ['#0d1626', '#123058', '#124980', '#3472a8'], note: 'Gradient #124980 › #131c2b' },
  copper:   { name: 'Ink & Copper', mode: 'dark',  colors: ['#0e1520', '#18263b', '#a35234', '#f3c09b'], note: 'Navy · copper' },
  dusk:     { name: 'Dusk Rose',    mode: 'dark',  colors: ['#18212c', '#2b3a4a', '#dba58c', '#14395c'], note: 'Gradient #dba58c › #2b3a4a' },
  blush:    { name: 'Blush',        mode: 'light', colors: ['#f2d4be', '#f9ebe0', '#cc917b', '#f3c09b'], note: 'Gradient #cc917b › #f2d4be' },
  peach:    { name: 'Peach',        mode: 'light', colors: ['#f3c09b', '#f8dcc6', '#dba58c', '#a35234'], note: 'Peach · copper' },
  pearl:    { name: 'Pearl',        mode: 'light', colors: ['#ece3da', '#f8f4ef', '#f2d4be', '#3472a8'], note: 'Ivory · blush' },
  rose:     { name: 'Rose Gold',    mode: 'light', colors: ['#e2b39d', '#f2d4be', '#cc917b', '#fff2e8'], note: 'Rose · blush' },
  porcelain:{ name: 'Porcelain',    mode: 'light', colors: ['#e3e9f1', '#f5f7fa', '#3472a8', '#f2d4be'], note: 'Cool white · royal' },
  // round four — richer, deeper gradients (brand colours and their shades)
  regal:    { name: 'Regal Night',  mode: 'dark',  colors: ['#060c18', '#0f1d33', '#14395c', '#3472a8'], note: 'Night · royal · light from above' },
  velvet:   { name: 'Sapphire Velvet', mode: 'dark', colors: ['#080f1d', '#131c2b', '#124980', '#cc917b'], note: 'Gradient #124980 › #131c2b, copper rose glow' },
  ember:    { name: 'Copper Night', mode: 'dark',  colors: ['#0f0b0b', '#1f1512', '#a35234', '#f3c09b'], note: 'Black copper · peach' },
  twilight: { name: 'Twilight',     mode: 'dark',  colors: ['#161f2a', '#2b3a4a', '#dba58c', '#3472a8'], note: '#dba58c › #2b3a4a, royal edge' },
  champagne:{ name: 'Champagne',    mode: 'light', colors: ['#ead9ca', '#faf3ec', '#dba58c', '#a35234'], note: 'Ivory · champagne · copper' },
  ivory:    { name: 'Ivory & Navy', mode: 'light', colors: ['#efe8e0', '#fbf8f4', '#cc917b', '#18263b'], note: 'Gallery ivory, navy ink' },
  apricot:  { name: 'Apricot',      mode: 'light', colors: ['#cc917b', '#f2d4be', '#f3c09b', '#a35234'], note: 'Gradient #cc917b › #f2d4be' },
  mist:     { name: 'Silver Mist',  mode: 'light', colors: ['#d5dbe4', '#eef1f5', '#3472a8', '#cc917b'], note: 'Cool silver · royal · rose' },
  // round five — deeper, richer gradients built from the brand colours
  abyss:    { name: 'Abyss Sapphire', mode: 'dark', colors: ['#03060b', '#0b1626', '#124980', '#f3c09b'], note: 'Near black · sapphire · a peach flame' },
  royalblush:{ name: 'Royal Blush',  mode: 'dark',  colors: ['#0a1322', '#14395c', '#3472a8', '#f2d4be'], note: 'Royal blue lit with blush' },
  duskfall: { name: 'Dusk Fall',    mode: 'dark',  colors: ['#1a232e', '#2b3a4a', '#cc917b', '#dba58c'], note: 'Gradient #dba58c › #2b3a4a, warm' },
  terracotta:{ name: 'Terracotta Night', mode: 'dark', colors: ['#120a08', '#24160f', '#a35234', '#dba58c'], note: 'Espresso · copper · rose' },
  obsidian: { name: 'Obsidian',     mode: 'dark',  colors: ['#060709', '#111419', '#2b3a4a', '#9fb1c6'], note: 'Black silver, a royal edge' },
  nude:     { name: 'Nude Silk',    mode: 'light', colors: ['#efcdb6', '#fbf1e8', '#dba58c', '#cc917b'], note: 'Gradient #cc917b › #f2d4be, softer' },
  sunrise:  { name: 'Sunrise',      mode: 'light', colors: ['#e7b49c', '#f7e3d4', '#cc917b', '#3472a8'], note: 'Copper rose dawn, a royal glint' },
  delft:    { name: 'Delft Porcelain', mode: 'light', colors: ['#d9e3ee', '#f7f9fc', '#124980', '#cc917b'], note: 'Porcelain white · sapphire' },
  linen:    { name: 'Copper Linen', mode: 'light', colors: ['#ecdccd', '#fbf6f0', '#a35234', '#14395c'], note: 'Linen · copper · royal ink' },
  duskpeach:{ name: 'Dusk Peach',   mode: 'light', colors: ['#d9a58c', '#f3d9c8', '#2b3a4a', '#a35234'], note: '#dba58c with slate shadows' }
};

export const ACCENTS = {
  dark:  [['#f3c09b', 'Peach'], ['#f2d4be', 'Blush'], ['#dba58c', 'Rose'], ['#cc917b', 'Copper rose'], ['#e6ebf2', 'Silver']],
  light: [['#a35234', 'Copper'], ['#18263b', 'Navy'], ['#14395c', 'Royal'], ['#124980', 'Sapphire'], ['#cc917b', 'Copper rose']]
};

export const BACKGROUNDS = [
  ['aurora', 'Aurora', 'Navy, royal and peach light drifting'],
  ['silk', 'Silk', 'Slow satin waves'],
  ['guilloche', 'Guilloché', 'Engine-turned silver lines'],
  ['liquid', 'Liquid silver', 'Molten sheen'],
  ['stardust', 'Stardust', 'Faint glints of light'],
  ['still', 'Still', 'A quiet gradient'],
  ['tide', 'Royal tide', 'Navy, royal and peach waves rolling slowly'],
  ['rays', 'Throne light', 'Soft beams falling from above'],
  ['velvet', 'Velvet', 'Deep folds of a jewel-case lining'],
  ['moire', 'Moiré', 'Watered-silk rings, barely moving']
];

export const TYPE = {
  heritage: { name: 'Heritage', note: 'Italiana · Manrope',        display: "'Italiana', 'Times New Roman', serif",          italic: "'Cormorant Garamond', serif", text: "'Manrope', system-ui, sans-serif", weight: 400, track: '-0.01em', up: false, scale: 1 },
  couture:  { name: 'Couture',  note: 'Bodoni Moda · Manrope',     display: "'Bodoni Moda', 'Times New Roman', serif",       italic: "'Bodoni Moda', serif",        text: "'Manrope', system-ui, sans-serif", weight: 400, track: '-0.035em', up: false, scale: 0.94 },
  crest:    { name: 'Crest',    note: 'Cinzel · Poppins',          display: "'Cinzel', 'Times New Roman', serif",            italic: "'Cormorant Garamond', serif", text: "'Poppins', system-ui, sans-serif", weight: 400, track: '0.01em', up: true, scale: 0.8 },
  atelier:  { name: 'Atelier',  note: 'Cormorant · Manrope',       display: "'Cormorant Garamond', 'Times New Roman', serif", italic: "'Cormorant Garamond', serif", text: "'Manrope', system-ui, sans-serif", weight: 300, track: '-0.025em', up: false, scale: 1.04 },
  gilda:    { name: 'Gilda',    note: 'Gilda Display · Poppins',   display: "'Gilda Display', 'Times New Roman', serif",     italic: "'Cormorant Garamond', serif", text: "'Poppins', system-ui, sans-serif", weight: 400, track: '-0.02em', up: false, scale: 0.92 },
  bellefair:{ name: 'Bellefair',note: 'Bellefair · Manrope',       display: "'Bellefair', 'Times New Roman', serif",         italic: "'Cormorant Garamond', serif", text: "'Manrope', system-ui, sans-serif", weight: 400, track: '-0.01em', up: false, scale: 0.98 },
  brand:    { name: 'Brand book',note: 'Poppins (brand font)',     display: "'Poppins', system-ui, sans-serif",              italic: "'Cormorant Garamond', serif", text: "'Poppins', system-ui, sans-serif", weight: 300, track: '-0.03em', up: false, scale: 0.84 },
  regent:   { name: 'Regent',   note: 'Aboreto · Cormorant · Jost',   display: "'Aboreto', 'Times New Roman', serif",        italic: "'Cormorant Garamond', serif", text: "'Jost', system-ui, sans-serif", weight: 400, track: '0.02em', up: true, scale: 0.62 },
  maison:   { name: 'Maison',   note: 'Libre Caslon · Inter Tight',   display: "'Libre Caslon Display', 'Times New Roman', serif", italic: "'Playfair Display', serif", text: "'Inter Tight', system-ui, sans-serif", weight: 400, track: '-0.03em', up: false, scale: 0.98 },
  modern:   { name: 'Instrument', note: 'Instrument Serif · Hanken',  display: "'Instrument Serif', 'Times New Roman', serif", italic: "'Instrument Serif', serif", text: "'Hanken Grotesk', system-ui, sans-serif", weight: 400, track: '-0.025em', up: false, scale: 1.04, ital: 400 },
  deco:     { name: 'Deco',     note: 'Forum · Josefin Sans',         display: "'Forum', 'Times New Roman', serif",          italic: "'Cormorant Garamond', serif", text: "'Josefin Sans', system-ui, sans-serif", weight: 400, track: '0em', up: true, scale: 0.76 },
  playfair: { name: 'Playfair', note: 'Playfair Display · Jost',      display: "'Playfair Display', 'Times New Roman', serif", italic: "'Playfair Display', serif", text: "'Jost', system-ui, sans-serif", weight: 400, track: '-0.035em', up: false, scale: 0.9, ital: 400 },
  soft:     { name: 'Fraunces', note: 'Fraunces · Inter Tight',       display: "'Fraunces', 'Times New Roman', serif",       italic: "'Fraunces', serif", text: "'Inter Tight', system-ui, sans-serif", weight: 300, track: '-0.04em', up: false, scale: 0.94 },
  salon:    { name: 'Salon',    note: 'Marcellus · Tenor Sans',       display: "'Marcellus', 'Times New Roman', serif",      italic: "'Cormorant Garamond', serif", text: "'Tenor Sans', system-ui, sans-serif", weight: 400, track: '-0.01em', up: false, scale: 0.9 },
  // round five
  didone:   { name: 'Didone',   note: 'Noto Serif Display · Outfit',  display: "'Noto Serif Display', 'Times New Roman', serif", italic: "'Noto Serif Display', serif", text: "'Outfit', system-ui, sans-serif", weight: 200, track: '-0.03em', up: false, scale: 1, ital: 300 },
  dmserif:  { name: 'Grand',    note: 'DM Serif Display · Urbanist',  display: "'DM Serif Display', 'Times New Roman', serif", italic: "'DM Serif Display', serif", text: "'Urbanist', system-ui, sans-serif", weight: 400, track: '-0.03em', up: false, scale: 0.9, ital: 400 },
  prata:    { name: 'Prata',    note: 'Prata · Cormorant · Jost',     display: "'Prata', 'Times New Roman', serif",          italic: "'Cormorant Garamond', serif", text: "'Jost', system-ui, sans-serif", weight: 400, track: '-0.02em', up: false, scale: 0.88 },
  gloock:   { name: 'Gloock',   note: 'Gloock · Instrument · Inter Tight', display: "'Gloock', 'Times New Roman', serif",     italic: "'Instrument Serif', serif", text: "'Inter Tight', system-ui, sans-serif", weight: 400, track: '-0.03em', up: false, scale: 0.9, ital: 400 },
  calligraphy:{ name: 'Calligraphy', note: 'Italiana · Pinyon Script · Outfit', display: "'Italiana', 'Times New Roman', serif", italic: "'Pinyon Script', cursive", text: "'Outfit', system-ui, sans-serif", weight: 400, track: '-0.01em', up: false, scale: 1, ital: 400, iscale: 1.18 },
  vibes: { name: 'Grand Vibes', note: 'Noto Serif Display · Great Vibes · Jost', display: "'Noto Serif Display', serif", italic: "'Great Vibes', cursive", text: "'Jost', sans-serif", weight: 300, track: '-0.03em', up: false, scale: 1, ital: 400, iscale: 1.22 },
  italianno: { name: 'Italianno', note: 'Bodoni Moda · Italianno · Urbanist', display: "'Bodoni Moda', serif", italic: "'Italianno', cursive", text: "'Urbanist', sans-serif", weight: 400, track: '-0.035em', up: false, scale: 0.92, ital: 400, iscale: 1.5 },
  parisienne: { name: 'Parisienne', note: 'Cormorant Garamond · Parisienne · Jost', display: "'Cormorant Garamond', serif", italic: "'Parisienne', cursive", text: "'Jost', sans-serif", weight: 300, track: '-0.02em', up: false, scale: 1.06, ital: 400, iscale: 1.1 },
  allura: { name: 'Allura', note: 'Playfair Display · Allura · Manrope', display: "'Playfair Display', serif", italic: "'Allura', cursive", text: "'Manrope', sans-serif", weight: 400, track: '-0.03em', up: false, scale: 0.9, ital: 400, iscale: 1.3 },
  corinthia: { name: 'Corinthia', note: 'Gilda Display · Corinthia · Jost', display: "'Gilda Display', serif", italic: "'Corinthia', cursive", text: "'Jost', sans-serif", weight: 400, track: '-0.02em', up: false, scale: 0.92, ital: 400, iscale: 1.55 },
  decorative: { name: 'Decorative', note: 'Cinzel Decorative · Great Vibes · Jost', display: "'Cinzel Decorative', serif", italic: "'Great Vibes', cursive", text: "'Jost', sans-serif", weight: 400, track: '0.01em', up: false, scale: 0.74, ital: 400, iscale: 1.3 },
  yeseva: { name: 'Yeseva', note: 'Yeseva One · Parisienne · Outfit', display: "'Yeseva One', serif", italic: "'Parisienne', cursive", text: "'Outfit', sans-serif", weight: 400, track: '-0.02em', up: false, scale: 0.86, ital: 400, iscale: 1.1 },
  upright: { name: 'Upright', note: 'Cormorant Upright · Pinyon Script · Jost', display: "'Cormorant Upright', serif", italic: "'Pinyon Script', cursive", text: "'Jost', sans-serif", weight: 300, track: '-0.01em', up: false, scale: 1.04, ital: 400, iscale: 1.2 },
  respira: { name: 'Respira', note: 'Della Respira · Italianno · Urbanist', display: "'Della Respira', serif", italic: "'Italianno', cursive", text: "'Urbanist', sans-serif", weight: 400, track: '-0.02em', up: false, scale: 0.9, ital: 400, iscale: 1.55 },
  smallcaps: { name: 'Small Caps', note: 'Playfair Display SC · Allura · Manrope', display: "'Playfair Display SC', serif", italic: "'Allura', cursive", text: "'Manrope', sans-serif", weight: 400, track: '0.01em', up: false, scale: 0.84, ital: 400, iscale: 1.35 },
  cormorantsc: { name: 'Engraved SC', note: 'Cormorant SC · Cormorant italic · Jost', display: "'Cormorant SC', serif", italic: "'Cormorant Garamond', serif", text: "'Jost', sans-serif", weight: 300, track: '0.02em', up: false, scale: 1, ital: 300, iscale: 1 },
  rozha: { name: 'Rozha', note: 'Rozha One · Great Vibes · Inter Tight', display: "'Rozha One', serif", italic: "'Great Vibes', cursive", text: "'Inter Tight', sans-serif", weight: 400, track: '-0.02em', up: false, scale: 0.86, ital: 400, iscale: 1.25 },
  sovereign: { name: 'Sovereign Script', note: 'Noto Serif Display · Pinyon Script · Jost', display: "'Noto Serif Display', 'Times New Roman', serif", italic: "'Pinyon Script', cursive", text: "'Jost', system-ui, sans-serif", weight: 300, track: '-0.03em', up: false, scale: 1, ital: 400, iscale: 1.28 },
  royalscript:{ name: 'Royal Script', note: 'Bodoni Moda · Pinyon Script · Urbanist', display: "'Bodoni Moda', 'Times New Roman', serif", italic: "'Pinyon Script', cursive", text: "'Urbanist', system-ui, sans-serif", weight: 400, track: '-0.035em', up: false, scale: 0.92, ital: 400, iscale: 1.2 },
  engraved: { name: 'Engraved', note: 'Cinzel · Noto Display italic · Urbanist', display: "'Cinzel', 'Times New Roman', serif", italic: "'Noto Serif Display', serif", text: "'Urbanist', system-ui, sans-serif", weight: 400, track: '0.02em', up: true, scale: 0.74, ital: 300, iscale: 1.08 }
};

// Round five: layout details. Each is a set of designed variations, so any mix stays clean.
export const DETAILS = {
  eyebrow: { name: 'Section labels', opts: [['cartouche', 'Cartouche', 'A small framed hallmark'], ['numeral', 'Numerals', 'Roman numeral and fine rule'], ['seal', 'Seal', 'A tiny crown in a ring'], ['flourish', 'Flourish', 'Script word with a swash'], ['minimal', 'Minimal', 'Small caps only']] },
  banner:  { name: 'Ribbon banner', opts: [['wave', 'Silk wave', 'Words gliding along a gentle curve'], ['ribbon', 'Ribbon', 'A soft rounded band'], ['pearls', 'Pearls', 'Hairlines strung with pearls'], ['script', 'Script', 'Large script, slow and airy']] },
  finish:  { name: 'Silver finish', opts: [['mono', 'Monochrome', 'True black and white'], ['crisp', 'Crisp', 'More contrast, brighter polish'], ['soft', 'Soft', 'Lifted shadows, gentle'], ['noir', 'Noir', 'Deep shadows, bright highlights']] },
  word:    { name: 'Wordmark', opts: [['solid', 'Solid', 'Filled with the page colour'], ['outline', 'Outline', 'A fine engraved line'], ['metal', 'Silver', 'Brushed silver gradient'], ['gradient', 'Gradient', 'Brand gradient']] },
  shape:   { name: 'Shapes', opts: [['arch', 'Arches', 'Castle arches from the logo'], ['soft', 'Soft', 'Rounded corners'], ['sharp', 'Sharp', 'Square, architectural']] },
  space:   { name: 'Spacing', opts: [['airy', 'Airy', 'The most negative space'], ['balanced', 'Balanced', 'Even rhythm'], ['compact', 'Compact', 'Tighter sections']] }
};
export const DETAIL_DEFAULTS = { eyebrow: 'cartouche', banner: 'wave', finish: 'mono', word: 'solid', shape: 'arch', space: 'airy' };

// Studio lighting for the 3D silver (base light tent + soft boxes + black flags)
export const MOODS = {
  studio:  { name: 'Studio',  note: 'Crisp and balanced', exposure: 1.0,  studio: { base: 1.25, flags: 0.75, strips: 1,   key: 1,   warm: 0.35, cool: 0 } },
  gallery: { name: 'Gallery', note: 'Bright and airy',    exposure: 1.06, studio: { base: 1.4,  flags: 0.45, strips: 0.9, key: 1.2, warm: 0.45, cool: 0 } },
  noir:    { name: 'Noir',    note: 'Deep contrast',      exposure: 0.95, studio: { base: 0.8,  flags: 1,    strips: 1.25,key: 0.8, warm: 0.2,  cool: 0.7 } },
  candle:  { name: 'Candle',  note: 'Warm peach glow',    exposure: 1.0,  studio: { base: 1.0,  flags: 0.85, strips: 0.9, key: 0.9, warm: 1.1,  cool: 0 } },
  moon:    { name: 'Moonlit', note: 'Cool royal light',   exposure: 0.98, studio: { base: 1.0,  flags: 0.9,  strips: 1.1, key: 0.9, warm: 0.1,  cool: 1.2 } }
};

export const PRESETS = {
  'royal-night':   { name: 'Royal Night',        palette: 'royal',    bg: 'aurora',    accent: '#f3c09b', type: 'heritage',  mood: 'studio' },
  'coronation':    { name: 'Coronation Blue',    palette: 'sapphire', bg: 'silk',      accent: '#f2d4be', type: 'crest',     mood: 'noir' },
  'guilloche':     { name: 'Midnight Guilloché', palette: 'navy',     bg: 'guilloche', accent: '#dba58c', type: 'couture',   mood: 'noir' },
  'ink-copper':    { name: 'Ink & Copper',       palette: 'copper',   bg: 'liquid',    accent: '#f3c09b', type: 'gilda',     mood: 'candle' },
  'dusk-rose':     { name: 'Dusk Rose',          palette: 'dusk',     bg: 'aurora',    accent: '#f2d4be', type: 'atelier',   mood: 'candle' },
  'starlit':       { name: 'Starlit Vault',      palette: 'navy',     bg: 'stardust',  accent: '#f3c09b', type: 'bellefair', mood: 'moon' },
  'royal-couture': { name: 'Royal Couture',      palette: 'royal',    bg: 'aurora',    accent: '#f3c09b', type: 'sovereign', mood: 'moon' },
  'royal-script':  { name: 'Royal Script',       palette: 'royal',    bg: 'aurora',    accent: '#f3c09b', type: 'royalscript', mood: 'moon' },
  'royal-didone':  { name: 'Royal Didone',       palette: 'sapphire', bg: 'silk',      accent: '#f3c09b', type: 'didone',    mood: 'noir' },
  'royal-calligraphy': { name: 'Royal Calligraphy', palette: 'regal', bg: 'aurora',   accent: '#f2d4be', type: 'calligraphy', mood: 'moon' },
  'blush-atelier': { name: 'Blush Atelier',      palette: 'blush',    bg: 'silk',      accent: '#a35234', type: 'couture',   mood: 'gallery' },
  'peach-salon':   { name: 'Peach Salon',        palette: 'peach',    bg: 'aurora',    accent: '#18263b', type: 'atelier',   mood: 'gallery' },
  'pearl':         { name: 'Pearl Gallery',      palette: 'pearl',    bg: 'still',     accent: '#14395c', type: 'heritage',  mood: 'gallery' },
  'rose-gold':     { name: 'Rose Gold',          palette: 'rose',     bg: 'liquid',    accent: '#18263b', type: 'gilda',     mood: 'studio' },
  'porcelain':     { name: 'Porcelain',          palette: 'porcelain',bg: 'guilloche', accent: '#124980', type: 'crest',     mood: 'studio' },
  'brand-book':    { name: 'Brand Book',         palette: 'navy',     bg: 'still',     accent: '#f3c09b', type: 'brand',     mood: 'studio' },
  // round four
  'throne-room':   { name: 'Throne Room',        palette: 'regal',    bg: 'rays',      accent: '#f3c09b', type: 'regent',    mood: 'noir' },
  'royal-tide':    { name: 'Royal Tide',         palette: 'regal',    bg: 'tide',      accent: '#f3c09b', type: 'modern',    mood: 'moon' },
  'sapphire-velvet':{ name: 'Sapphire Velvet',   palette: 'velvet',   bg: 'velvet',    accent: '#cc917b', type: 'playfair',  mood: 'noir' },
  'copper-night':  { name: 'Copper Night',       palette: 'ember',    bg: 'velvet',    accent: '#f3c09b', type: 'maison',    mood: 'candle' },
  'twilight':      { name: 'Twilight Salon',     palette: 'twilight', bg: 'moire',     accent: '#f2d4be', type: 'salon',     mood: 'candle' },
  'deco-night':    { name: 'Deco Midnight',      palette: 'navy',     bg: 'tide',      accent: '#dba58c', type: 'deco',      mood: 'studio' },
  'maison-ivory':  { name: 'Maison Ivory',       palette: 'ivory',    bg: 'moire',     accent: '#a35234', type: 'maison',    mood: 'gallery' },
  'champagne':     { name: 'Champagne',          palette: 'champagne',bg: 'silk',      accent: '#a35234', type: 'modern',    mood: 'gallery' },
  'apricot-court': { name: 'Apricot Court',      palette: 'apricot',  bg: 'rays',      accent: '#18263b', type: 'regent',    mood: 'gallery' },
  'apricot-soft':  { name: 'Apricot Soft',       palette: 'apricot',  bg: 'tide',      accent: '#a35234', type: 'soft',      mood: 'candle' },
  'silver-mist':   { name: 'Silver Mist',        palette: 'mist',     bg: 'moire',     accent: '#14395c', type: 'modern',    mood: 'studio' },
  'deco-blush':    { name: 'Deco Blush',         palette: 'blush',    bg: 'moire',     accent: '#18263b', type: 'deco',      mood: 'gallery' },
  'velvet-regent': { name: 'Velvet Regent',      palette: 'velvet',   bg: 'aurora',    accent: '#f3c09b', type: 'regent',    mood: 'moon' },
  'twilight-play': { name: 'Twilight Editorial', palette: 'twilight', bg: 'silk',      accent: '#f3c09b', type: 'playfair',  mood: 'studio' },
  'diptych':       { name: 'Apricot Diptych',    palette: 'apricot',  bg: 'silk',      accent: '#18263b', type: 'modern',    mood: 'gallery' },
  'majesty':       { name: 'Champagne Salon',    palette: 'champagne',bg: 'rays',      accent: '#a35234', type: 'salon',     mood: 'gallery', exposure: 1.18 },
  'filled':        { name: 'Silver Tide',        palette: 'regal',    bg: 'tide',      accent: '#f3c09b', type: 'playfair',  mood: 'moon' },
  'sceptre':       { name: 'Sapphire Deco',      palette: 'velvet',   bg: 'guilloche', accent: '#dba58c', type: 'deco',      mood: 'noir' },
  'regal-salon':   { name: 'Regal Salon',        palette: 'regal',    bg: 'moire',     accent: '#f2d4be', type: 'salon',     mood: 'moon' }
};

const listeners = new Set();
let state = null, page = null;
const KEY = () => 'kingdom:royal:' + page.id;
const store = (v) => { try { localStorage.setItem(KEY(), JSON.stringify(v)); } catch {} };
const load = () => { try { return JSON.parse(localStorage.getItem(KEY()) || 'null'); } catch { return null; } };

export function fromPreset(id) {
  const p = PRESETS[id] || PRESETS['royal-night'];
  const d = Object.assign({}, DETAIL_DEFAULTS, (page && page.details) || {}, p.d || {});
  return { preset: id, palette: p.palette, bg: p.bg, accent: p.accent, type: p.type, mood: p.mood, motion: 'full', grain: true, cursor: true, intensity: 1, exposure: p.exposure || 1, ...d };
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
export const editorAllowed = () => {
  const cfg = window.KINGDOM_CFG || {};
  if (window.KINGDOM_PUBLIC) return false; // public share links never show the studio
  return cfg.editor !== false || /edit/.test(location.hash);
};

export function initState(cfg) {
  page = cfg;
  const locked = (window.KINGDOM_CFG || {})[cfg.id];
  const def = Object.assign(fromPreset(cfg.preset), locked || {});
  let s = decodeHash();
  if (!s && editorAllowed()) s = load();
  state = Object.assign(def, s || {});
  if (!PALETTES[state.palette]) state.palette = def.palette;
  if (!TYPE[state.type]) state.type = def.type;
  if (!MOODS[state.mood]) state.mood = def.mood;
  if (!BACKGROUNDS.find((b) => b[0] === state.bg)) state.bg = def.bg;
  for (const k in DETAILS) if (!DETAILS[k].opts.find((o) => o[0] === state[k])) state[k] = def[k];
  if (matchMedia('(prefers-reduced-motion: reduce)').matches && !s) state.motion = 'still';
  apply();
  return state;
}
export const getState = () => state;
export const getPage = () => page;
export const onState = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
export function setState(patch) {
  Object.assign(state, patch);
  if (!('preset' in patch)) {
    const p = PRESETS[state.preset];
    if (p && ['palette', 'bg', 'accent', 'type', 'mood'].some((k) => p[k] !== state[k])) state.preset = null;
    if (p && p.d && Object.keys(p.d).some((k) => p.d[k] !== state[k])) state.preset = null;
  }
  store(state); apply();
}
export function setPreset(id) {
  const keep = { motion: state.motion, grain: state.grain, cursor: state.cursor, intensity: state.intensity };
  state = Object.assign(fromPreset(id), keep);
  store(state); apply();
}
export function resetState() { state = fromPreset(page.preset); store(state); apply(); }
export const palette = () => PALETTES[state.palette];
export const isDark = () => palette().mode === 'dark';

const hex = (h) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
export const rgb01 = (h) => hex(h).map((v) => v / 255);
const lum = (h) => { const [r, g, b] = rgb01(h).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };

function apply() {
  const root = document.documentElement;
  const P = palette(), T = TYPE[state.type], dark = P.mode === 'dark';
  const allowed = ACCENTS[P.mode].map((a) => a[0]);
  if (!allowed.includes(state.accent)) state.accent = allowed[0];
  const ink = dark ? '#f4efe9' : '#18263b';
  const ir = hex(ink).join(',');
  const acc = state.accent;
  const v = {
    '--c0': P.colors[0], '--c1': P.colors[1], '--c2': P.colors[2], '--c3': P.colors[3],
    '--c1-rgb': hex(P.colors[1]).join(','), '--c0-rgb': hex(P.colors[0]).join(','),
    '--ink': ink, '--ink-rgb': ir,
    '--ink-2': `rgba(${ir},${dark ? 0.76 : 0.8})`, '--ink-3': `rgba(${ir},${dark ? 0.56 : 0.62})`, '--ink-4': `rgba(${ir},${dark ? 0.3 : 0.3})`,
    '--line': `rgba(${ir},${dark ? 0.13 : 0.14})`, '--line-2': `rgba(${ir},${dark ? 0.26 : 0.28})`,
    '--accent': acc, '--accent-rgb': hex(acc).join(','), '--on-accent': lum(acc) > 0.32 ? '#131c2b' : '#fbf3ec',
    '--surface': dark ? 'rgba(255,255,255,0.045)' : 'rgba(255,255,255,0.5)',
    '--surface-2': dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.72)',
    '--glass': dark ? 'rgba(12,18,30,0.66)' : 'rgba(255,250,245,0.7)',
    '--shade': dark ? 'rgba(0,0,0,0.45)' : 'rgba(24,38,59,0.18)',
    '--font-display': T.display, '--font-italic': T.italic, '--font-text': T.text,
    '--ital-weight': T.ital || 300, '--ital-scale': T.iscale || 1,
    '--display-weight': T.weight, '--display-track': T.track, '--display-case': T.up ? 'uppercase' : 'none', '--ds': T.scale
  };
  for (const k in v) root.style.setProperty(k, v[k]);
  root.dataset.mode = P.mode; root.dataset.type = state.type; root.dataset.motion = state.motion;
  for (const k in DETAILS) root.dataset[k] = state[k];
  root.classList.toggle('no-grain', !state.grain);
  root.classList.toggle('no-cursor', !state.cursor);
  const meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.content = P.colors[1];
  listeners.forEach((fn) => fn(state));
}
