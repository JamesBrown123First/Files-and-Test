/* ==========================================================================
   Kingdom — shared engine
   Theme presets · animated WebGL backgrounds · style editor · cursor ·
   magnetic buttons · tilt cards · text reveals · smooth scroll · loader
   ========================================================================== */
(function () {
  'use strict';

  // ------------------------------------------------------------ brand
  const BRAND = {
    terracotta: '#a35234', peach: '#f3c09b',
    navy: '#18263b', deep: '#14395c', royal: '#3472a8',
    blush: '#dba58c', slate: '#2b3a4a',
    rose: '#cc917b', cream: '#f2d4be',
    sapphire: '#124980', ink: '#131c2b',
    ivory: '#f8f1ea', onyx: '#0b1018', silver: '#c9ccd1'
  };
  const SWATCHES = [
    ['ink', 'Ink'], ['onyx', 'Onyx'], ['navy', 'Navy'], ['slate', 'Slate'], ['deep', 'Deep blue'], ['sapphire', 'Sapphire'],
    ['royal', 'Royal blue'], ['terracotta', 'Terracotta'], ['rose', 'Rosé'], ['blush', 'Blush'], ['peach', 'Peach'],
    ['cream', 'Cream'], ['ivory', 'Ivory'], ['silver', 'Silver']
  ];

  const BG_STYLES = [
    ['aurora', 'Aurora', 'Soft colour fields drifting'],
    ['silk', 'Silk', 'Slow satin folds'],
    ['guilloche', 'Engraved waves', 'Fine lines, like engraving'],
    ['metal', 'Liquid metal', 'Molten, slow and subtle'],
    ['dust', 'Silver dust', 'Floating light particles'],
    ['still', 'Still gradient', 'No motion']
  ];

  const FONTS = {
    display: [
      ['cormorant', 'Cormorant', '"Cormorant Garamond", "Times New Roman", serif', 300],
      ['bodoni', 'Bodoni', '"Bodoni Moda", Didot, serif', 400],
      ['italiana', 'Italiana', 'Italiana, "Times New Roman", serif', 400],
      ['cinzel', 'Cinzel', 'Cinzel, "Times New Roman", serif', 400],
      ['marcellus', 'Marcellus', 'Marcellus, serif', 400]
    ],
    text: [
      ['manrope', 'Manrope', 'Manrope, system-ui, sans-serif'],
      ['poppins', 'Poppins', 'Poppins, system-ui, sans-serif']
    ]
  };

  // Each preset is a complete look; every value can then be overridden in the editor.
  const PRESETS = {
    'royal-midnight': {
      name: 'Royal Midnight', mode: 'dark',
      bg: { style: 'aurora', colors: ['ink', 'deep', 'royal', 'peach'], speed: 0.5, intensity: 0.75, grain: 0.06, angle: 160 },
      ink: '#f6eee7', accent: 'peach', display: 'cormorant', text: 'manrope', silverTint: 0.55
    },
    'sapphire-silk': {
      name: 'Sapphire Silk', mode: 'dark',
      bg: { style: 'silk', colors: ['ink', 'sapphire', 'royal', 'blush'], speed: 0.45, intensity: 0.7, grain: 0.05, angle: 200 },
      ink: '#f5ede6', accent: 'blush', display: 'bodoni', text: 'manrope', silverTint: 0.5
    },
    'dusk-engraving': {
      name: 'Dusk Engraving', mode: 'dark',
      bg: { style: 'guilloche', colors: ['slate', 'navy', 'blush', 'peach'], speed: 0.4, intensity: 0.55, grain: 0.05, angle: 180 },
      ink: '#f7efe8', accent: 'peach', display: 'italiana', text: 'manrope', silverTint: 0.5
    },
    'rose-atelier': {
      name: 'Rosé Atelier', mode: 'light',
      bg: { style: 'silk', colors: ['cream', 'ivory', 'rose', 'peach'], speed: 0.35, intensity: 0.55, grain: 0.04, angle: 150 },
      ink: '#18263b', accent: 'terracotta', display: 'cormorant', text: 'manrope', silverTint: 0.4
    },
    'terracotta-seal': {
      name: 'Terracotta Seal', mode: 'dark',
      bg: { style: 'metal', colors: ['ink', 'terracotta', 'rose', 'peach'], speed: 0.35, intensity: 0.6, grain: 0.06, angle: 170 },
      ink: '#fbf1e8', accent: 'peach', display: 'cinzel', text: 'manrope', silverTint: 0.55
    },
    'ivory-ink': {
      name: 'Ivory & Ink', mode: 'light',
      bg: { style: 'dust', colors: ['ivory', 'cream', 'blush', 'royal'], speed: 0.4, intensity: 0.5, grain: 0.035, angle: 180 },
      ink: '#131c2b', accent: 'terracotta', display: 'bodoni', text: 'manrope', silverTint: 0.35
    },
    'onyx-vault': {
      name: 'Onyx Vault', mode: 'dark',
      bg: { style: 'dust', colors: ['onyx', 'ink', 'deep', 'peach'], speed: 0.3, intensity: 0.45, grain: 0.07, angle: 180 },
      ink: '#f3ece6', accent: 'peach', display: 'marcellus', text: 'manrope', silverTint: 0.35
    },
    'sunset-court': {
      name: 'Sunset Court', mode: 'dark',
      bg: { style: 'aurora', colors: ['slate', 'navy', 'rose', 'blush'], speed: 0.45, intensity: 0.8, grain: 0.05, angle: 165 },
      ink: '#fbf2ea', accent: 'peach', display: 'cormorant', text: 'poppins', silverTint: 0.6
    }
  };

  const DIRECTIONS = [
    ['descent.html', 'The Descent', 'Cinematic scroll — the ewer meets the basin'],
    ['atelier.html', 'Atelier', 'Light editorial — drag to turn the ewer'],
    ['arch.html', 'Royal Arch', 'Architectural — the basin as a halo'],
    ['vault.html', 'The Vault', 'Spotlight — reveal silver in the dark']
  ];

  const hex = (k) => (k && k[0] === '#') ? k : (BRAND[k] || k || '#000000');
  const rgb = (h) => { h = hex(h).replace('#', ''); const n = parseInt(h, 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; };
  const mixHex = (a, b, t) => { const A = rgb(a), B = rgb(b); return '#' + A.map((v, i) => Math.round((v + (B[i] - v) * t) * 255).toString(16).padStart(2, '0')).join(''); };
  const luminance = (h) => { const c = rgb(h).map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // ------------------------------------------------------------ state
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* noop */ } }
  };

  function presetToState(id) {
    const p = clone(PRESETS[id] || PRESETS['royal-midnight']);
    return {
      preset: id, mode: p.mode, bg: p.bg, ink: p.ink, accent: p.accent, display: p.display, text: p.text,
      silver: { tint: p.silverTint, shine: 1, follow: true, turn: 1 },
      motion: { level: 'full', smooth: true, cursor: true }
    };
  }

  // ------------------------------------------------------------ background (WebGL)
  const BG_FRAG = `#version 300 es
  precision highp float;
  out vec4 o;
  uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse;
  uniform vec3 uC0, uC1, uC2, uC3;
  uniform int uMode; uniform float uInt; uniform float uGrain; uniform float uAngle;
  uniform float uPulse; uniform vec2 uPulseAt; uniform float uLight;
  float h21(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
  float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
    return mix(mix(h21(i),h21(i+vec2(1,0)),u.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),u.x), u.y); }
  float fbm(vec2 p){ float v=0.0,a=0.5; mat2 r=mat2(0.8,-0.6,0.6,0.8); for(int i=0;i<5;i++){ v+=a*noise(p); p=r*p*2.02; a*=0.5;} return v; }
  vec3 base(vec2 uv){
    float a = radians(uAngle);
    float t = dot(uv-0.5, vec2(sin(a), cos(a))) + 0.5;
    vec3 c = mix(uC0, uC1, smoothstep(0.0, 1.0, t));
    return c;
  }
  void main(){
    vec2 uv = gl_FragCoord.xy/uRes;
    vec2 p = uv; p.x *= uRes.x/uRes.y;
    vec2 m = uMouse; m.x *= uRes.x/uRes.y;
    float T = uTime;
    vec3 col = base(uv);
    if (uMode == 0){ // aurora — colour fields drifting
      vec2 c1 = vec2(0.25+0.18*sin(T*0.21), 0.75+0.12*cos(T*0.17)); c1.x*=uRes.x/uRes.y;
      vec2 c2 = vec2(0.85+0.2*cos(T*0.13), 0.25+0.15*sin(T*0.19)); c2.x*=uRes.x/uRes.y;
      vec2 c3 = vec2(0.6+0.25*sin(T*0.11+1.7), 0.55+0.25*cos(T*0.09)); c3.x*=uRes.x/uRes.y;
      c3 = mix(c3, m, 0.18);
      float w = fbm(p*1.3 + T*0.05)*0.35;
      float b1 = exp(-pow(length(p-c1)+w*0.3,2.0)*3.2);
      float b2 = exp(-pow(length(p-c2)-w*0.2,2.0)*2.6);
      float b3 = exp(-pow(length(p-c3)+w*0.25,2.0)*4.2);
      col = mix(col, uC1, b1*0.9*uInt);
      col = mix(col, uC2, b2*0.85*uInt);
      col = mix(col, uC3, b3*0.55*uInt);
    } else if (uMode == 1){ // silk folds
      vec2 q = p*vec2(1.0,1.4);
      float f = q.y + 0.18*sin(q.x*2.1 + T*0.35) + 0.12*sin(q.x*3.7 - T*0.27 + q.y*1.3) + 0.06*sin(q.x*7.0+T*0.5);
      f += (fbm(q*1.5 + T*0.04)-0.5)*0.25 + 0.05*exp(-length(p-m)*3.0);
      float fold = sin(f*5.0);
      float sheen = pow(0.5+0.5*fold, 6.0);
      float shade = 0.5+0.5*sin(f*5.0 - 1.2);
      vec3 silk = mix(uC1, uC2, smoothstep(0.1, 1.2, f));
      col = mix(col, silk, 0.6*uInt);
      col *= mix(1.0, 0.72+0.42*shade, uInt);
      col = mix(col, uC3, sheen*0.35*uInt);
    } else if (uMode == 2){ // engraved waves (guilloché)
      vec2 q = p;
      float d = length(p-m);
      float warp = 0.035*sin(q.x*3.0 + T*0.25) + 0.025*sin(q.x*5.3 - T*0.18) + 0.02*exp(-d*4.0)*sin(T);
      float y = q.y + warp + 0.06*fbm(q*1.2 + T*0.03);
      float lines = abs(fract(y*42.0)-0.5);
      float aa = fwidth(y*42.0);
      float ln = 1.0 - smoothstep(0.0, aa*1.5, lines - 0.02);
      float y2 = q.y - 0.4*q.x + 0.04*sin(q.y*6.0 + T*0.2);
      float l2 = 1.0 - smoothstep(0.0, fwidth(y2*30.0)*1.5, abs(fract(y2*30.0)-0.5)-0.015);
      float glow = exp(-pow(length(p - vec2(0.75*uRes.x/uRes.y, 0.6)),2.0)*1.8);
      col = mix(col, uC2, glow*0.45*uInt);
      col = mix(col, uC3, ln*0.10*uInt*(0.5+glow));
      col = mix(col, uC3, l2*0.05*uInt*(1.0-glow));
    } else if (uMode == 3){ // liquid metal
      vec2 q = p*1.4;
      vec2 w = vec2(fbm(q + T*0.05), fbm(q + vec2(5.2,1.3) - T*0.04));
      float f = fbm(q + 1.8*w + 0.15*(m-p));
      float band = 0.5+0.5*sin(f*9.0 + T*0.15);
      vec3 metal = mix(uC1, uC2, f);
      col = mix(col, metal, 0.55*uInt);
      col = mix(col, uC3, pow(band, 10.0)*0.28*uInt);
    } else if (uMode == 4){ // silver dust
      vec3 acc = vec3(0.0);
      for (int L=0; L<3; L++){
        float s = 9.0 + float(L)*7.0;
        vec2 g = p*s + vec2(T*0.04*(1.0+float(L)), -T*0.11*(1.0+float(L)*0.6));
        vec2 id = floor(g), f = fract(g)-0.5;
        float r = h21(id+float(L)*13.1);
        if (r > 0.82){
          vec2 off = vec2(h21(id*1.7)-0.5, h21(id*2.3)-0.5)*0.6;
          float d = length(f-off);
          float tw = 0.6+0.4*sin(T*1.5 + r*40.0);
          acc += uC3 * smoothstep(0.08+0.03*float(L), 0.0, d) * tw * (0.55 - float(L)*0.12);
        }
      }
      float glow = exp(-pow(length(p - vec2(0.7*uRes.x/uRes.y,0.55)),2.0)*1.6);
      col = mix(col, uC2, glow*0.35*uInt);
      col += acc*uInt*0.8;
    }
    // impact pulse ring
    if (uPulse > 0.0){
      vec2 pa = uPulseAt; pa.x *= uRes.x/uRes.y;
      float r = length(p-pa);
      float ring = exp(-pow((r - (1.0-uPulse)*0.9)*14.0, 2.0)) * uPulse;
      col = mix(col, uC3, ring*0.12);
    }
    // vignette + grain
    vec2 vv = uv-0.5; col *= 1.0 - dot(vv,vv)*(uLight > 0.5 ? 0.18 : 0.55);
    col += (h21(gl_FragCoord.xy + fract(T)*100.0)-0.5)*uGrain;
    o = vec4(col, 1.0);
  }`;
  const BG_VERT = `#version 300 es
  in vec2 a; void main(){ gl_Position = vec4(a,0.0,1.0); }`;
  const MODES = { aurora: 0, silk: 1, guilloche: 2, metal: 3, dust: 4, still: 5 };

  class Background {
    constructor() {
      const c = document.createElement('canvas');
      c.className = 'k-bg'; c.setAttribute('aria-hidden', 'true');
      document.body.prepend(c);
      this.c = c; this.t = Math.random() * 100; this.mouse = [0.5, 0.5]; this.m = [0.5, 0.5]; this.pulse = 0; this.pulseAt = [0.5, 0.5];
      const gl = c.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'low-power' });
      this.gl = gl;
      if (!gl) return;
      const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(o)); return o; };
      const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, BG_VERT)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, BG_FRAG)); gl.linkProgram(p);
      this.p = p; this.u = {};
      ['uRes', 'uTime', 'uMouse', 'uC0', 'uC1', 'uC2', 'uC3', 'uMode', 'uInt', 'uGrain', 'uAngle', 'uPulse', 'uPulseAt', 'uLight'].forEach(n => this.u[n] = gl.getUniformLocation(p, n));
      const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(p, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      window.addEventListener('pointermove', e => { this.mouse = [e.clientX / innerWidth, 1 - e.clientY / innerHeight]; }, { passive: true });
    }
    set(bg, mode) { this.bg = bg; this.light = mode === 'light'; this.dirty = true; }
    hit(x, y) { this.pulse = 1; this.pulseAt = [x, y]; }
    frame(dt, motion) {
      const gl = this.gl; if (!gl || !this.bg) return;
      const bg = this.bg, still = bg.style === 'still' || motion === 'off';
      const scale = bg.style === 'guilloche' ? Math.min(1.5, devicePixelRatio || 1) : 0.6;
      const w = Math.round(innerWidth * scale), h = Math.round(innerHeight * scale);
      if (this.c.width !== w || this.c.height !== h) { this.c.width = w; this.c.height = h; this.dirty = true; }
      if (still && !this.dirty && this.pulse <= 0) return;
      const spd = motion === 'calm' ? 0.45 : 1;
      if (!still) this.t += dt * bg.speed * spd;
      this.m[0] += (this.mouse[0] - this.m[0]) * Math.min(1, dt * 1.5);
      this.m[1] += (this.mouse[1] - this.m[1]) * Math.min(1, dt * 1.5);
      if (this.pulse > 0) this.pulse = Math.max(0, this.pulse - dt * 0.55);
      gl.viewport(0, 0, w, h); gl.useProgram(this.p);
      const u = this.u, C = bg.colors.map(rgb);
      gl.uniform2f(u.uRes, w, h); gl.uniform1f(u.uTime, this.t); gl.uniform2f(u.uMouse, this.m[0], this.m[1]);
      gl.uniform3fv(u.uC0, C[0]); gl.uniform3fv(u.uC1, C[1]); gl.uniform3fv(u.uC2, C[2]); gl.uniform3fv(u.uC3, C[3]);
      gl.uniform1i(u.uMode, MODES[bg.style] ?? 0); gl.uniform1f(u.uInt, bg.intensity); gl.uniform1f(u.uGrain, still ? bg.grain * 0.6 : bg.grain);
      gl.uniform1f(u.uAngle, bg.angle || 180); gl.uniform1f(u.uPulse, this.pulse); gl.uniform2f(u.uPulseAt, this.pulseAt[0], this.pulseAt[1]);
      gl.uniform1f(u.uLight, this.light ? 1 : 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      this.dirty = false;
    }
  }

  // ------------------------------------------------------------ theme → CSS
  function applyTheme(s) {
    const r = document.documentElement.style;
    const C = s.bg.colors.map(hex);
    const ink = hex(s.ink), accent = hex(s.accent);
    const dark = s.mode === 'dark';
    r.setProperty('--bg', C[0]);
    r.setProperty('--bg-2', C[1]);
    r.setProperty('--c2', C[2]);
    r.setProperty('--c3', C[3]);
    r.setProperty('--ink', ink);
    r.setProperty('--ink-2', mixHex(ink, C[0], 0.28));
    r.setProperty('--ink-3', mixHex(ink, C[0], 0.45));
    r.setProperty('--line', dark ? 'rgba(255,255,255,.14)' : 'rgba(19,28,43,.14)');
    r.setProperty('--accent', accent);
    r.setProperty('--on-accent', luminance(accent) > 0.4 ? '#131c2b' : '#fbf3ec');
    r.setProperty('--glass', dark ? 'rgba(14,20,32,.55)' : 'rgba(255,250,246,.6)');
    r.setProperty('--glass-line', dark ? 'rgba(255,255,255,.12)' : 'rgba(19,28,43,.1)');
    const D = FONTS.display.find(f => f[0] === s.display) || FONTS.display[0];
    const T = FONTS.text.find(f => f[0] === s.text) || FONTS.text[0];
    r.setProperty('--font-display', D[2]);
    r.setProperty('--display-weight', D[3]);
    r.setProperty('--font-text', T[2]);
    document.documentElement.dataset.mode = s.mode;
    document.documentElement.dataset.display = s.display;
    document.documentElement.dataset.motion = s.motion.level;
    document.documentElement.classList.toggle('k-no-cursor', !s.motion.cursor || !fine);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = C[0];
  }

  // ------------------------------------------------------------ cursor
  function initCursor() {
    if (!fine) return null;
    const dot = document.createElement('div'); dot.className = 'k-cursor';
    dot.innerHTML = '<span class="k-cursor__ring"></span><span class="k-cursor__label"></span>';
    document.body.appendChild(dot);
    const label = dot.querySelector('.k-cursor__label');
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, shown = false;
    window.addEventListener('pointermove', e => {
      tx = e.clientX; ty = e.clientY;
      if (!shown) { x = tx; y = ty; shown = true; dot.classList.add('is-on'); }
      const t = e.target.closest && e.target.closest('a, button, [data-cursor], input, label, select');
      const txt = t && t.dataset ? (t.dataset.cursor || '') : '';
      dot.classList.toggle('is-hover', !!t && !txt);
      dot.classList.toggle('is-label', !!txt);
      label.textContent = txt;
    }, { passive: true });
    const refresh = () => {
      if (!shown) return;
      const t0 = document.elementFromPoint(tx, ty);
      const t = t0 && t0.closest && t0.closest('a, button, [data-cursor], input, label, select');
      const txt = t && t.dataset ? (t.dataset.cursor || '') : '';
      dot.classList.toggle('is-hover', !!t && !txt); dot.classList.toggle('is-label', !!txt); label.textContent = txt;
    };
    window.addEventListener('scroll', refresh, { passive: true });
    setInterval(refresh, 300);
    document.addEventListener('pointerleave', () => { dot.classList.remove('is-on'); shown = false; });
    window.addEventListener('pointerdown', () => dot.classList.add('is-down'));
    window.addEventListener('pointerup', () => dot.classList.remove('is-down'));
    return (dt) => {
      const k = 1 - Math.exp(-dt * 22);
      x += (tx - x) * k; y += (ty - y) * k;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
  }

  // ------------------------------------------------------------ magnetic & tilt
  function initMagnetic(root = document) {
    if (!fine) return;
    root.querySelectorAll('[data-magnetic]').forEach(el => {
      const strength = parseFloat(el.dataset.magnetic) || 0.3;
      const inner = el.querySelector('.k-btn__label') || null;
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
        if (inner) inner.style.transform = `translate(${dx * strength * 0.4}px, ${dy * strength * 0.4}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; if (inner) inner.style.transform = ''; });
    });
  }

  function initTilt(root = document) {
    if (!fine) return;
    root.querySelectorAll('[data-tilt]').forEach(el => {
      const max = parseFloat(el.dataset.tilt) || 8;
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--rx', ((0.5 - py) * max).toFixed(2) + 'deg');
        el.style.setProperty('--ry', ((px - 0.5) * max).toFixed(2) + 'deg');
        el.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
        el.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
        el.classList.add('is-tilting');
      });
      el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); el.classList.remove('is-tilting'); });
    });
  }

  // ------------------------------------------------------------ text split & reveals
  function split(el) {
    if (el.dataset.splitDone) return;
    const mode = el.dataset.split || 'words';
    const walk = (node) => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(w => {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(' ')); return; }
            const outer = document.createElement('span'); outer.className = 'k-w';
            if (mode === 'chars') {
              [...w].forEach(ch => { const c = document.createElement('span'); c.className = 'k-c'; c.textContent = ch; outer.appendChild(c); });
            } else {
              const inner = document.createElement('span'); inner.className = 'k-wi'; inner.textContent = w; outer.appendChild(inner);
            }
            frag.appendChild(outer);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains('k-w')) walk(n);
      });
    };
    walk(el);
    el.dataset.splitDone = '1';
    el.querySelectorAll('.k-wi, .k-c').forEach((s, i) => s.style.setProperty('--i', i));
  }

  function initReveals() {
    document.querySelectorAll('[data-split]').forEach(split);
    // clipped elements report no intersection in some browsers, so watch a proxy (their parent)
    const proxy = new Map();
    const io = new IntersectionObserver((ents) => {
      ents.forEach(e => {
        if (!e.isIntersecting) return;
        (proxy.get(e.target) || [e.target]).forEach(t => t.classList.add('is-in'));
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.01 });
    document.querySelectorAll('[data-reveal], [data-split]:not([data-split-manual])').forEach(el => {
      if (el.dataset.reveal === 'mask' && el.parentElement) {
        const p = el.parentElement; if (!proxy.has(p)) proxy.set(p, []); proxy.get(p).push(el); io.observe(p);
      } else io.observe(el);
    });
  }

  // scrub text: words light up as the paragraph scrolls through
  function initScrub() {
    const els = [...document.querySelectorAll('[data-scrub]')];
    els.forEach(el => { split(el); });
    return () => {
      const vh = innerHeight;
      els.forEach(el => {
        const r = el.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.45)));
        const ws = el.querySelectorAll('.k-wi');
        const n = ws.length;
        ws.forEach((w, i) => { const t = Math.min(1, Math.max(0, p * n * 1.05 - i)); w.style.opacity = (0.16 + 0.84 * t).toFixed(3); });
      });
    };
  }

  // ------------------------------------------------------------ editor
  function el(tag, attrs = {}, kids = []) {
    const e = document.createElement(tag);
    for (const k in attrs) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
    (Array.isArray(kids) ? kids : [kids]).forEach(c => c != null && e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
    return e;
  }

  function buildEditor(K) {
    const wrap = el('div', { class: 'k-ed', 'data-lenis-prevent': '' });
    const toggle = el('button', { class: 'k-ed__toggle', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'k-ed-panel', 'data-cursor': '' }, [
      el('span', { class: 'k-ed__dot', 'aria-hidden': 'true' }), el('span', {}, 'Style')
    ]);
    const panel = el('div', { class: 'k-ed__panel', id: 'k-ed-panel', role: 'dialog', 'aria-label': 'Style editor' });
    wrap.append(toggle, panel);
    document.body.appendChild(wrap);
    const open = (v) => {
      wrap.classList.toggle('is-open', v); toggle.setAttribute('aria-expanded', v ? 'true' : 'false');
      if (K.lenis) v ? K.lenis.stop() : K.lenis.start();
    };
    toggle.addEventListener('click', () => open(!wrap.classList.contains('is-open')));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') open(false);
      if ((e.key === 'e' || e.key === 'E') && !/input|textarea|select/i.test(e.target.tagName) && !e.metaKey && !e.ctrlKey) open(!wrap.classList.contains('is-open'));
    });

    const render = () => {
      const s = K.state;
      panel.innerHTML = '';
      const head = el('div', { class: 'k-ed__head' }, [
        el('div', {}, [el('p', { class: 'k-ed__eyebrow' }, 'Kingdom'), el('h2', { class: 'k-ed__title' }, 'Style editor')]),
        el('button', { class: 'k-ed__close', type: 'button', 'aria-label': 'Close editor', onclick: () => open(false) }, '×')
      ]);
      const body = el('div', { class: 'k-ed__body' });

      // directions
      const dirs = el('div', { class: 'k-ed__dirs' }, DIRECTIONS.map(([href, name]) =>
        el('a', { href, class: 'k-ed__dir' + (location.pathname.endsWith(href) ? ' is-active' : '') }, name)));
      body.append(section('Direction', dirs));

      // presets
      const grid = el('div', { class: 'k-ed__presets' });
      Object.entries(PRESETS).forEach(([id, p]) => {
        const sw = el('span', { class: 'k-ed__preset-sw', style: `background: linear-gradient(135deg, ${hex(p.bg.colors[0])} 0%, ${hex(p.bg.colors[1])} 45%, ${hex(p.bg.colors[2])} 75%, ${hex(p.bg.colors[3])} 100%)` });
        const b = el('button', { type: 'button', class: 'k-ed__preset' + ((s.preset || '').replace('*', '') === id ? ' is-active' : ''), 'aria-pressed': (s.preset || '').replace('*', '') === id ? 'true' : 'false', onclick: () => { K.setPreset(id); } }, [
          sw, el('span', { class: 'k-ed__preset-name' }, p.name), el('span', { class: 'k-ed__preset-meta' }, (s.preset === id + '*') ? 'Edited' : (p.mode === 'dark' ? 'Dark' : 'Light'))
        ]);
        grid.appendChild(b);
      });
      body.append(section('Presets', grid, 'Start from a look, then fine-tune below.'));

      // background
      const styles = el('div', { class: 'k-ed__chips' }, BG_STYLES.map(([id, name, hint]) =>
        el('button', { type: 'button', title: hint, class: 'k-ed__chip' + (s.bg.style === id ? ' is-active' : ''), onclick: () => K.set(st => { st.bg.style = id; }) }, name)));
      const colorRow = el('div', { class: 'k-ed__colors' }, ['Base', 'Depth', 'Glow', 'Accent light'].map((lbl, i) => swatchPicker(lbl, s.bg.colors[i], v => K.set(st => { st.bg.colors[i] = v; }))));
      body.append(section('Background', [styles, colorRow,
        slider('Motion speed', s.bg.speed, 0, 1.2, 0.05, v => K.set(st => { st.bg.speed = v; }, true)),
        slider('Intensity', s.bg.intensity, 0, 1, 0.05, v => K.set(st => { st.bg.intensity = v; }, true)),
        disclosure('More background options', [
          slider('Gradient angle', s.bg.angle, 0, 360, 5, v => K.set(st => { st.bg.angle = v; }, true), '°'),
          slider('Film grain', s.bg.grain, 0, 0.12, 0.005, v => K.set(st => { st.bg.grain = v; }, true))
        ])
      ]));

      // surface & text
      const modeSeg = segmented([['dark', 'Dark'], ['light', 'Light']], s.mode, v => K.set(st => { st.mode = v; }));
      const inkRow = el('div', { class: 'k-ed__colors k-ed__colors--2' }, [
        swatchPicker('Text', s.ink, v => K.set(st => { st.ink = v; }), true),
        swatchPicker('Accent', s.accent, v => K.set(st => { st.accent = v; }))
      ]);
      body.append(section('Colour', [labelRow('Surface', modeSeg), inkRow]));

      // type
      const disp = el('div', { class: 'k-ed__fonts' }, FONTS.display.map(([id, name, fam, w]) =>
        el('button', { type: 'button', class: 'k-ed__font' + (s.display === id ? ' is-active' : ''), style: `font-family:${fam};font-weight:${w}`, onclick: () => K.set(st => { st.display = id; }) }, [
          el('span', { class: 'k-ed__font-aa' }, 'Aa'), el('span', { class: 'k-ed__font-name' }, name)])));
      const textSeg = segmented(FONTS.text.map(f => [f[0], f[1]]), s.text, v => K.set(st => { st.text = v; }));
      body.append(section('Typography', [disp, labelRow('Body', textSeg)]));

      // silver
      body.append(section('Silver', [
        toggleRow('Light follows cursor', s.silver.follow, v => K.set(st => { st.silver.follow = v; })),
        slider('Shine', s.silver.shine, 0, 1.6, 0.05, v => K.set(st => { st.silver.shine = v; }, true)),
        slider('Ambient reflection', s.silver.tint, 0, 1, 0.05, v => K.set(st => { st.silver.tint = v; }, true)),
        slider('Turn response', s.silver.turn, 0, 1.5, 0.05, v => K.set(st => { st.silver.turn = v; }, true))
      ]));

      // motion
      body.append(section('Motion', [
        labelRow('Animation', segmented([['full', 'Full'], ['calm', 'Calm'], ['off', 'Off']], s.motion.level, v => K.set(st => { st.motion.level = v; }))),
        toggleRow('Smooth scrolling', s.motion.smooth, v => K.set(st => { st.motion.smooth = v; })),
        toggleRow('Custom cursor', s.motion.cursor, v => K.set(st => { st.motion.cursor = v; }))
      ]));

      const foot = el('div', { class: 'k-ed__foot' }, [
        el('button', { type: 'button', class: 'k-ed__btn', onclick: async (e) => {
          const txt = JSON.stringify({ [K.page]: K.state }, null, 2);
          const b = e.currentTarget;
          try { await navigator.clipboard.writeText(txt); b.textContent = 'Copied ✓'; }
          catch (err) { showExport(txt); b.textContent = 'Shown below'; }
          setTimeout(() => { b.textContent = 'Copy settings'; }, 1800);
        } }, 'Copy settings'),
        el('button', { type: 'button', class: 'k-ed__btn k-ed__btn--ghost', onclick: () => K.reset() }, 'Reset')
      ]);
      const exportBox = el('textarea', { class: 'k-ed__export', readonly: '', rows: '6', 'aria-label': 'Settings JSON' });
      function showExport(t) { exportBox.value = t; exportBox.classList.add('is-on'); exportBox.select(); }
      panel.append(head, body, foot, exportBox);
    };

    function section(title, kids, hint) {
      return el('section', { class: 'k-ed__sec' }, [el('h3', { class: 'k-ed__h' }, title), hint ? el('p', { class: 'k-ed__hint' }, hint) : null].concat(kids));
    }
    function labelRow(lbl, ctrl) { return el('div', { class: 'k-ed__row' }, [el('span', { class: 'k-ed__lbl' }, lbl), ctrl]); }
    function segmented(opts, val, on) {
      return el('div', { class: 'k-ed__seg', role: 'group' }, opts.map(([v, l]) => el('button', { type: 'button', class: v === val ? 'is-active' : '', 'aria-pressed': v === val ? 'true' : 'false', onclick: () => on(v) }, l)));
    }
    function toggleRow(lbl, val, on) {
      const id = 'k-t-' + Math.random().toString(36).slice(2, 8);
      const inp = el('input', { type: 'checkbox', id, class: 'k-ed__switch' });
      inp.checked = !!val; inp.addEventListener('change', () => on(inp.checked));
      return el('label', { class: 'k-ed__row k-ed__row--toggle', for: id }, [el('span', { class: 'k-ed__lbl' }, lbl), inp]);
    }
    function slider(lbl, val, min, max, step, on, unit = '') {
      const out = el('output', { class: 'k-ed__val' }, fmt(val));
      const inp = el('input', { type: 'range', min, max, step, value: val, class: 'k-ed__range', 'aria-label': lbl });
      const sync = () => inp.style.setProperty('--p', ((inp.value - min) / (max - min) * 100) + '%');
      sync();
      inp.addEventListener('input', () => { sync(); out.textContent = fmt(+inp.value); on(+inp.value); });
      function fmt(v) { return unit ? Math.round(v) + unit : (max <= 2 ? Math.round(v / max * 100) + '%' : v); }
      return el('div', { class: 'k-ed__slider' }, [el('div', { class: 'k-ed__row' }, [el('span', { class: 'k-ed__lbl' }, lbl), out]), inp]);
    }
    function disclosure(lbl, kids) {
      const d = el('details', { class: 'k-ed__more' }, [el('summary', {}, lbl)].concat(kids));
      return d;
    }
    function swatchPicker(lbl, val, on, allowInk) {
      const box = el('div', { class: 'k-ed__sw' });
      const btn = el('button', { type: 'button', class: 'k-ed__sw-btn', 'aria-haspopup': 'true', 'aria-label': lbl + ' colour' }, [
        el('span', { class: 'k-ed__sw-chip', style: `background:${hex(val)}` }), el('span', { class: 'k-ed__sw-lbl' }, lbl)]);
      const pop = el('div', { class: 'k-ed__pop', role: 'listbox' });
      const list = SWATCHES.slice();
      if (allowInk) list.push(['#f6eee7', 'Warm white'], ['#ffffff', 'White']);
      list.forEach(([k, name]) => {
        const v = BRAND[k] ? k : k;
        pop.appendChild(el('button', { type: 'button', role: 'option', title: name + ' ' + hex(v), class: 'k-ed__pop-sw' + (hex(v).toLowerCase() === hex(val).toLowerCase() ? ' is-active' : ''), style: `background:${hex(v)}`, onclick: () => on(v) }));
      });
      const custom = el('input', { type: 'text', class: 'k-ed__hex', value: hex(val), maxlength: '7', 'aria-label': 'Custom hex' });
      custom.addEventListener('change', () => { if (/^#[0-9a-f]{6}$/i.test(custom.value)) on(custom.value); });
      pop.appendChild(custom);
      btn.addEventListener('click', (e) => { e.stopPropagation(); document.querySelectorAll('.k-ed__sw.is-open').forEach(x => x !== box && x.classList.remove('is-open')); box.classList.toggle('is-open'); });
      box.append(btn, pop);
      return box;
    }
    panel.addEventListener('click', e => { if (!e.target.closest('.k-ed__sw')) panel.querySelectorAll('.k-ed__sw.is-open').forEach(x => x.classList.remove('is-open')); });
    return { render, open };
  }

  // ------------------------------------------------------------ loader
  function runLoader(waitFor) {
    const L = document.querySelector('.k-loader');
    if (!L) return Promise.resolve();
    const start = performance.now();
    return Promise.race([Promise.all(waitFor), new Promise(r => setTimeout(r, 6000))]).then(() => {
      const wait = Math.max(0, 1300 - (performance.now() - start));
      return new Promise(r => setTimeout(() => {
        L.classList.add('is-done');
        document.documentElement.classList.add('is-loaded');
        setTimeout(() => { L.remove(); }, 1400);
        r();
      }, reduced ? 0 : wait));
    });
  }

  // ------------------------------------------------------------ main
  const K = {
    BRAND, PRESETS, hex, rgb, mixHex, reduced, fine,
    listeners: [], tickers: [],
    on(fn) { this.listeners.push(fn); },
    tick(fn) { this.tickers.push(fn); },
    init(opts) {
      this.page = opts.page;
      this.key = 'kingdom:v1:' + opts.page;
      const cfg = (window.KINGDOM_CONFIG && window.KINGDOM_CONFIG[opts.page]) || null;
      this.editorEnabled = opts.editor !== false && (!(window.KINGDOM_CONFIG && window.KINGDOM_CONFIG.editor === false) || location.hash === '#edit');
      const saved = this.editorEnabled ? store.get(this.key) : null;
      this.defaultPreset = opts.preset;
      this.state = saved || cfg || presetToState(opts.preset);
      if (reduced && !saved) this.state.motion.level = 'calm';
      this.bg = new Background();
      applyTheme(this.state);
      this.bg.set(this.state.bg, this.state.mode);
      this.cursor = initCursor();
      initMagnetic(); initTilt(); initReveals();
      const scrub = initScrub();
      this.tick(scrub);
      // smooth scroll
      if (window.Lenis && this.state.motion.smooth && this.state.motion.level !== 'off') {
        this.lenis = new window.Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9 });
              }
      document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
        const id = a.getAttribute('href'); if (id.length < 2) return;
        const t = document.querySelector(id); if (!t) return;
        e.preventDefault();
        if (this.lenis) this.lenis.scrollTo(t, { offset: 0, duration: 1.6 }); else t.scrollIntoView({ behavior: 'smooth' });
      }));
      if (this.editorEnabled) { this.editor = buildEditor(this); this.editor.render(); }
      // loop
      let last = performance.now();
      const loop = (now) => {
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        if (this.lenis) this.lenis.raf(now);
        if (!document.hidden) this.bg.frame(dt, this.state.motion.level);
        if (this.cursor) this.cursor(dt);
        for (const f of this.tickers) f(dt, now);
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
      // nav state
      const nav = document.querySelector('.k-nav');
      if (nav) {
        let lastY = 0;
        this.tick(() => {
          const y = window.scrollY;
          nav.classList.toggle('is-scrolled', y > 40);
          nav.classList.toggle('is-hidden', y > lastY + 2 && y > innerHeight * 0.8);
          if (y < lastY - 2) nav.classList.remove('is-hidden');
          lastY = y;
        });
      }
      const menuBtn = document.querySelector('.k-nav__menu');
      if (menuBtn) menuBtn.addEventListener('click', () => {
        const o = document.documentElement.classList.toggle('menu-open');
        menuBtn.setAttribute('aria-expanded', o ? 'true' : 'false');
        if (this.lenis) o ? this.lenis.stop() : this.lenis.start();
      });
      document.querySelectorAll('.k-menu a').forEach(a => a.addEventListener('click', () => { document.documentElement.classList.remove('menu-open'); if (this.lenis) this.lenis.start(); }));
      document.querySelectorAll('form[data-k-form]').forEach(f => f.addEventListener('submit', e => {
        e.preventDefault();
        const inp = f.querySelector('input[type=email]'), msg = f.querySelector('.k-form__msg');
        if (!inp.value || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inp.value)) { msg.textContent = 'Please enter a valid email, like name@example.com.'; msg.dataset.state = 'error'; inp.focus(); return; }
        msg.textContent = 'Thank you — you’re on the list for new pieces.'; msg.dataset.state = 'ok'; f.reset();
      }));
      return this;
    },
    set(mut, light) {
      mut(this.state);
      this.state.preset = this.state.preset && !this.state.preset.endsWith('*') ? this.state.preset + '*' : this.state.preset;
      this.commit(!light);
    },
    setPreset(id) {
      const keepMotion = this.state.motion;
      this.state = presetToState(id); this.state.motion = keepMotion;
      this.commit(true);
    },
    reset() { store.del(this.key); this.state = presetToState(this.defaultPreset); this.commit(true); },
    commit(rerender) {
      applyTheme(this.state);
      this.bg.set(this.state.bg, this.state.mode);
      store.set(this.key, this.state);
      this.listeners.forEach(f => f(this.state));
      if (this.editor && rerender) this.editor.render();
      if (this.editor && !rerender) { /* keep slider focus while dragging */ }
    },
    loader: runLoader,
    split,
    initMagnetic, initTilt
  };
  // preset names with * mean "modified"
  K.presetName = (id) => { const base = (id || '').replace('*', ''); return (PRESETS[base] ? PRESETS[base].name : 'Custom') + (id && id.endsWith('*') ? ' (edited)' : ''); };
  window.Kingdom = K;
})();
