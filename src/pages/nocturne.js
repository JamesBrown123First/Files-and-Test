// NOCTURNE — the photograph of the ewer standing on a night-dark mirror.
// The reflection ripples where you move, a slow band of light passes over the silver,
// and a peach dawn rises to carry you into the story.
import * as THREE from 'three';
import { boot, gsap, ScrollTrigger, reduced, getState, onState, preloadImages, fine } from '../core/index.js';

const { loader, start } = boot({ id: 'nocturne', kind: 'png', preset: 'midnight-silk' });
const mobile = innerWidth < 900;
const SRC = mobile ? 'assets/img/ewer-1400.webp' : 'assets/img/ewer-2400.webp';
const RATIO = 1113 / 2400;

const VERT = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`;
const EWER_FRAG = `
precision highp float;
varying vec2 vUv; uniform sampler2D uTex; uniform float uTime; uniform vec2 uMouse; uniform vec2 uRes;
uniform float uShimmer; uniform float uFollow; uniform float uReveal;
void main(){
  vec4 c = texture2D(uTex, vUv);
  float L = dot(c.rgb, vec3(.299,.587,.114));
  float metal = smoothstep(0.42, 0.92, L);
  float d = vUv.x * 0.55 + vUv.y;
  float pos = mod(uTime * 0.06, 1.0) * 3.2 - 0.9;
  float band = exp(-pow((d - pos) * 7.0, 2.0));
  float m = exp(-pow(distance(gl_FragCoord.xy, uMouse) / (uRes.y * 0.16), 2.0));
  c.rgb += vec3(1.0, 0.975, 0.95) * metal * (band * 0.32 * uShimmer + m * 0.3 * uFollow);
  c.rgb = mix(vec3(L), c.rgb, 1.0);
  // reveal: rises from the mirror line
  float rv = smoothstep(uReveal - 0.08, uReveal, vUv.y);
  c.a *= 1.0 - rv;
  gl_FragColor = vec4(c.rgb, c.a);
}`;
const REFL_FRAG = `
precision highp float;
varying vec2 vUv; uniform sampler2D uTex; uniform float uTime; uniform vec2 uRes; uniform vec3 uTint; uniform float uReveal;
uniform vec4 uRip[8];   // x, y (px), age, strength
uniform float uStrength;
void main(){
  float below = 1.0 - vUv.y;               // 0 at the mirror line
  vec2 uv = vec2(vUv.x, below);
  vec2 off = vec2(sin(below * 46.0 - uTime * 1.3) * 0.0026 * (0.3 + below), 0.0);
  for (int i = 0; i < 8; i++) {
    vec4 r = uRip[i];
    if (r.w <= 0.0) continue;
    vec2 dv = (gl_FragCoord.xy - r.xy) * vec2(1.0, 3.2);
    float dist = length(dv);
    float w = sin(dist * 0.055 - r.z * 7.0) * exp(-r.z * 1.15) * exp(-dist * 0.0032) * r.w;
    off += normalize(dv + 0.0001) * w * 0.012;
  }
  uv += off;
  vec4 c = texture2D(uTex, uv);
  c += texture2D(uTex, uv + vec2(0.0, 0.006 * below));
  c += texture2D(uTex, uv - vec2(0.0, 0.006 * below));
  c /= 3.0;
  float fade = pow(1.0 - below, 1.8) * uStrength;
  c.rgb = mix(c.rgb, uTint, 0.38 + below * 0.3);
  float rv = smoothstep(uReveal - 0.08, uReveal, below);
  gl_FragColor = vec4(c.rgb, c.a * fade * (1.0 - rv));
}`;

function stageInit(tex) {
  const host = document.getElementById('stage');
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0, 0);
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const cam = new THREE.OrthographicCamera(0, 1, 1, 0, -10, 10);
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter;
  const rips = Array.from({ length: 8 }, () => new THREE.Vector4(0, 0, 0, 0));
  const U = {
    uTex: { value: tex }, uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(-999, -999) }, uRes: { value: new THREE.Vector2(1, 1) },
    uShimmer: { value: 0.6 }, uFollow: { value: 1 }, uReveal: { value: 0 }, uTint: { value: new THREE.Color() }, uRip: { value: rips }, uStrength: { value: 0.5 }
  };
  const geo = new THREE.PlaneGeometry(1, 1).translate(0.5, 0.5, 0);
  const ewer = new THREE.Mesh(geo, new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: EWER_FRAG, uniforms: U, transparent: true, depthWrite: false }));
  const refl = new THREE.Mesh(geo, new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: REFL_FRAG, uniforms: U, transparent: true, depthWrite: false }));
  scene.add(refl, ewer);

  const view = { scale: 1, lift: 0, horizon: mobile ? 0.79 : 0.72 };
  let W = 1, H = 1;
  const layout = () => {
    W = host.clientWidth; H = host.clientHeight;
    renderer.setSize(W, H, false);
    cam.right = W; cam.top = H; cam.updateProjectionMatrix();
    U.uRes.value.set(W * renderer.getPixelRatio(), H * renderer.getPixelRatio());
  };
  layout(); addEventListener('resize', layout);

  const sync = (s) => {
    U.uShimmer.value = s.shimmer === 'off' ? 0 : s.shimmer === 'bright' ? 1 : 0.55;
    U.uFollow.value = s.follow && fine && s.shimmer !== 'off' ? (s.shimmer === 'bright' ? 1.2 : 0.8) : 0;
    const dark = document.documentElement.dataset.mode === 'dark';
    U.uTint.value.set(getComputedStyle(document.documentElement).getPropertyValue('--c0').trim() || '#0c1424');
    U.uStrength.value = dark ? 0.55 : 0.42;
  };
  sync(getState()); onState(sync);

  // pointer: light on the silver, ripples on the mirror
  let lastRip = 0, ri = 0;
  const addRip = (x, y, s) => { const r = rips[ri++ % 8]; const pr = renderer.getPixelRatio(); r.set(x * pr, (H - y) * pr, 0, s); };
  host.addEventListener('pointermove', (e) => {
    const b = host.getBoundingClientRect(); const x = e.clientX - b.left, y = e.clientY - b.top;
    U.uMouse.value.set(x * renderer.getPixelRatio(), (H - y) * renderer.getPixelRatio());
    const now = performance.now();
    if (y > H * view.horizon && now - lastRip > 140) { lastRip = now; addRip(x, y, 0.55); }
  });
  host.addEventListener('pointerdown', (e) => { const b = host.getBoundingClientRect(); const y = e.clientY - b.top; if (y > H * view.horizon - 40) addRip(e.clientX - b.left, y, 1.2); });
  host.addEventListener('pointerleave', () => U.uMouse.value.set(-999, -999));

  let t = 0, visible = true;
  new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(host);
  // an occasional drop on the mirror keeps it alive when nobody touches it
  let auto = 2.5;
  gsap.ticker.add((time, dms) => {
    if (!visible) return;
    const dt = Math.min(0.05, dms / 1000); t += dt * (getState().motion === 'reduced' ? 0 : 1);
    U.uTime.value = t;
    rips.forEach((r) => { if (r.w > 0) { r.z += dt; if (r.z > 4) r.w = 0; } });
    auto -= dt; if (auto < 0 && getState().motion !== 'reduced') { auto = 5 + Math.random() * 4; addRip(W * (0.38 + Math.random() * 0.24), H * (view.horizon + 0.06 + Math.random() * 0.12), 0.45); }
    const eh = H * (mobile ? 0.44 : 0.62) * view.scale;
    const ew = eh * RATIO;
    const hz = H * (1 - view.horizon) + view.lift * H;
    ewer.position.set(W / 2 - ew / 2, hz, 0); ewer.scale.set(ew, eh, 1);
    refl.position.set(W / 2 - ew / 2, hz - eh, 0); refl.scale.set(ew, eh, 1);
    renderer.render(scene, cam);
  });
  return { U, view };
}

(async () => {
  const fontsP = document.fonts?.ready;
  const [img] = await preloadImages([SRC, 'assets/img/basin-1200.webp'], (p) => loader.progress(p * 0.9));
  await fontsP;
  const tex = new THREE.Texture(img); tex.needsUpdate = true;
  const st = stageInit(tex);
  loader.done();
  await loader.ready;
  start();
  const R = reduced();
  // the ewer rises out of its own reflection
  gsap.fromTo(st.U.uReveal, { value: 0 }, { value: 1.1, duration: R ? 0 : 2.6, ease: 'power3.inOut' });
  document.querySelectorAll('.nc-hero [data-split]').forEach((e, i) => setTimeout(() => e._reveal?.(), R ? 0 : 900 + i * 180));
  gsap.to('.nc-hero__foot > *, .nc-hero .k-eyebrow, .nc-horizon', { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out', stagger: 0.1, delay: R ? 0 : 1.6 });
  gsap.fromTo('.nc-horizon', { scaleX: 0 }, { scaleX: 1, duration: 2.4, ease: 'expo.inOut', delay: R ? 0 : 0.2 });

  // scroll: the view rises, the mirror widens, then dawn breaks
  const hero = document.querySelector('.nc-scene');
  const tl = gsap.timeline({ defaults: { ease: 'none' } });
  tl.to(st.view, { scale: 0.8, lift: 0.07, duration: 0.5, ease: 'power2.inOut' }, 0);
  tl.to('.nc-left', { xPercent: -14, opacity: 0, duration: 0.4 }, 0.05);
  tl.to('.nc-right', { xPercent: 14, opacity: 0, duration: 0.4 }, 0.05);
  tl.to('.nc-hero__foot', { y: 40, opacity: 0, duration: 0.3 }, 0.05);
  tl.to('.nc-horizon, .nc-mirror', { y: '-7vh', duration: 0.5, ease: 'power2.inOut' }, 0);
  tl.fromTo('.nc-mid', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.2 }, 0.32);
  tl.to('.nc-mid', { opacity: 0, y: -30, duration: 0.15 }, 0.62);
  // dawn: a flat line swells into an arc and fills the screen
  const arc = document.querySelector('.nc-dawn path');
  const shape = { k: 0 };
  const draw = () => { const k = shape.k; const top = 100 - k * 100; const ctrl = 100 - k * 150; arc.setAttribute('d', `M0 100 L0 ${Math.max(0, top + 20 * (1 - k)).toFixed(2)} Q50 ${ctrl.toFixed(2)} 100 ${Math.max(0, top + 20 * (1 - k)).toFixed(2)} L100 100 Z`); };
  draw();
  tl.to(shape, { k: 1, duration: 0.36, ease: 'power2.in', onUpdate: draw }, 0.64);
  ScrollTrigger.create({ trigger: hero, start: 'top top', end: 'bottom bottom', scrub: 1, animation: tl });

  // basin: drag to spin, with inertia; otherwise a slow turn
  const basin = document.querySelector('.nc-basin__img');
  if (basin) {
    let ang = 0, vel = R ? 0 : 0.03, down = false, last = 0;
    const center = () => { const b = basin.getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; };
    const angle = (e) => { const [cx, cy] = center(); return Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI; };
    basin.addEventListener('pointerdown', (e) => { down = true; last = angle(e); basin.setPointerCapture(e.pointerId); });
    basin.addEventListener('pointermove', (e) => { if (!down) return; const a = angle(e); let d = a - last; if (d > 180) d -= 360; if (d < -180) d += 360; last = a; ang += d; vel = d; });
    basin.addEventListener('pointerup', () => (down = false));
    gsap.ticker.add(() => { if (!down) { ang += vel; vel += ((R ? 0 : 0.03) - vel) * 0.03; } basin.style.transform = `rotate(${ang}deg)`; });
    gsap.fromTo('.nc-basin__wrap', { yPercent: 30 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.nc-basin', start: 'top bottom', end: 'bottom bottom', scrub: true } });
  }
})();
