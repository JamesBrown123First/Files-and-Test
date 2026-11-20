// Animated background: one full-screen shader with four quiet moods.
// Colors ease toward the palette whenever the editor changes them.
import { getState, palette, onState, rgb01 } from './state.js';

const VERT = `attribute vec2 p; varying vec2 vUv; void main(){ vUv = p*0.5+0.5; gl_Position = vec4(p,0.,1.); }`;
const FRAG = `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uScroll;
uniform vec3 c0; uniform vec3 c1; uniform vec3 c2; uniform vec3 c3;
uniform float uStyle; uniform float uLight; uniform float uGrain; uniform float uFocus;
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 perm(vec4 x){return mod289(((x*34.)+1.)*x);}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.); const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy; i=mod289(i);
  vec4 p=perm(perm(perm(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857; vec3 ns=n_*D.wyz-D.xzx; vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.*x_); vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw); vec4 s0=floor(b0)*2.+1.; vec4 s1=floor(b1)*2.+1.; vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=1.79284291400159-0.85373472095314*vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)); p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.); m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }
float blob(vec2 p, vec2 c, float r){ float d = length(p-c); return exp(-d*d/(r*r)); }
void main(){
  vec2 p = (gl_FragCoord.xy - 0.5*uRes)/uRes.y;
  float t = uTime;
  float sc = uScroll;
  // base: deep tone at the top, palette base below, a touch of drift
  vec3 col = mix(c0, c1, smoothstep(-0.7, 0.75, p.y + 0.06*sin(t*0.07)));
  vec2 m = (uMouse - 0.5) * vec2(uRes.x/uRes.y, 1.);
  if (uStyle < 0.5) {
    // SILK: two slow wave trains, warped by noise, shaded like satin
    float n = snoise(vec3(p*0.9, t*0.035 + sc*0.15));
    float a = p.x*2.2 + p.y*1.2 + n*1.6 + t*0.11;
    float b = p.x*1.3 - p.y*2.1 + n*1.1 - t*0.07;
    float h = sin(a)*0.62 + sin(b)*0.38;
    float dh = cos(a)*0.62*2.2 + cos(b)*0.38*1.3; // slope across x
    float fold = smoothstep(-1.0, 1.0, h);
    col = mix(col, c2, 0.28*fold);
    float sheen = pow(clamp(0.5 + 0.5*dh*0.35, 0., 1.), 6.0);
    col += mix(c3, vec3(1.), 0.3) * sheen * (uLight > 0.5 ? 0.10 : 0.075);
    col *= mix(0.9, 1.04, fold);
  } else if (uStyle < 1.5) {
    // AURORA: navy, royal and peach light drifting past each other
    vec2 q = p + 0.08*vec2(snoise(vec3(p*1.2, t*0.03)), snoise(vec3(p*1.2+7., t*0.03)));
    vec2 a = vec2(-0.55 + 0.35*sin(t*0.05), 0.15 + 0.2*cos(t*0.043));
    vec2 b = vec2( 0.6 + 0.3*cos(t*0.038), -0.25 + 0.22*sin(t*0.051));
    vec2 c = vec2( 0.1 + 0.45*sin(t*0.029 + 2.), 0.42 + 0.15*cos(t*0.033));
    col = mix(col, c2, blob(q, a, 0.85) * 0.75);
    col = mix(col, c1, blob(q, c, 0.6) * 0.55);
    col = mix(col, c3, blob(q, b, 0.42) * (uLight > 0.5 ? 0.42 : 0.26));
    col = mix(col, c3, blob(q, m*0.6, 0.35) * 0.08 * uFocus);
  } else if (uStyle < 2.5) {
    // LIQUID: molten silver ribbons
    vec2 q = p*1.25;
    float n1 = snoise(vec3(q, t*0.04));
    float n2 = snoise(vec3(q*1.8 + n1*0.9, t*0.05 + 3.));
    float r = sin((q.y + n2*0.55)*7.0 + t*0.15);
    float rib = smoothstep(0.82, 1.0, r) + 0.45*smoothstep(0.6, 1.0, sin((q.x*0.6 + n1)*5. - t*0.1));
    col = mix(col, c2, 0.35*smoothstep(-0.6, 0.8, n2));
    col += mix(c3, vec3(0.95), 0.55) * rib * (uLight > 0.5 ? 0.09 : 0.06);
  } else {
    // STILL: soft radial light
    col = mix(col, c2, blob(p, vec2(0.35, 0.25), 1.1)*0.45);
    col = mix(col, c3, blob(p, vec2(-0.5, -0.4), 0.7)*(uLight > 0.5 ? 0.25 : 0.12));
  }
  // gentle light following the pointer
  col += c3 * blob(p, m, 0.55) * 0.035 * uFocus;
  // vignette
  float v = smoothstep(1.35, 0.25, length(p*vec2(0.85,1.0)));
  col *= mix(uLight > 0.5 ? 0.94 : 0.72, 1.0, v);
  // film grain
  col += (hash(gl_FragCoord.xy + fract(t)*100.) - 0.5) * 0.035 * uGrain;
  gl_FragColor = vec4(col, 1.);
}`;

const STYLE = { silk: 0, aurora: 1, liquid: 2, still: 3 };

export function initBackground(el) {
  const canvas = document.createElement('canvas');
  canvas.className = 'k-bg';
  canvas.setAttribute('aria-hidden', 'true');
  (el || document.body).prepend(canvas);
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) { canvas.remove(); document.documentElement.classList.add('no-webgl'); return null; }
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(s)); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(prog); gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = {}; ['uRes', 'uTime', 'uMouse', 'uScroll', 'c0', 'c1', 'c2', 'c3', 'uStyle', 'uLight', 'uGrain', 'uFocus'].forEach((n) => (U[n] = gl.getUniformLocation(prog, n)));

  const cur = { c: [0, 1, 2, 3].map(() => [0, 0, 0]), style: 0, light: 0 };
  const target = { c: cur.c.map((x) => x.slice()), style: 0, light: 0 };
  let first = true;
  const sync = (s) => {
    const P = palette();
    target.c = P.colors.map(rgb01);
    target.style = STYLE[s.bg] ?? 0;
    target.light = P.mode === 'light' ? 1 : 0;
    target.grain = s.grain ? 1 : 0;
    target.speed = s.motion === 'reduced' ? 0 : 1;
    if (first) { cur.c = target.c.map((x) => x.slice()); cur.style = target.style; cur.light = target.light; first = false; }
  };
  sync(getState());
  onState(sync);

  // Style changes cross-fade: the canvas dips briefly while the shader switches.
  let shownStyle = cur.style, fade = 1;
  const mouse = [0.5, 0.5], mT = [0.5, 0.5];
  addEventListener('pointermove', (e) => { mT[0] = e.clientX / innerWidth; mT[1] = 1 - e.clientY / innerHeight; }, { passive: true });
  let scale = Math.min(devicePixelRatio, 1.5) * (innerWidth < 760 ? 0.5 : 0.6);
  const resize = () => { canvas.width = Math.round(innerWidth * scale); canvas.height = Math.round(innerHeight * scale); gl.viewport(0, 0, canvas.width, canvas.height); };
  resize(); addEventListener('resize', resize);
  let time = Math.random() * 100, last = performance.now(), visible = true, fps = [];
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; last = performance.now(); });
  const frame = (now) => {
    requestAnimationFrame(frame);
    if (!visible) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    // drop resolution once if the device struggles
    fps.push(dt); if (fps.length === 90) { const avg = fps.reduce((a, b) => a + b) / 90; if (avg > 1 / 40 && scale > 0.35) { scale *= 0.7; resize(); } fps.length = 0; }
    time += dt * (target.speed ?? 1);
    const k = 1 - Math.exp(-dt * 2.5);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) cur.c[i][j] += (target.c[i][j] - cur.c[i][j]) * k;
    cur.light += (target.light - cur.light) * k;
    if (target.style !== shownStyle) { fade -= dt * 3; if (fade <= 0) { shownStyle = target.style; fade = 0; } } else fade = Math.min(1, fade + dt * 1.6);
    mouse[0] += (mT[0] - mouse[0]) * k; mouse[1] += (mT[1] - mouse[1]) * k;
    canvas.style.opacity = (0.35 + 0.65 * fade).toFixed(3);
    gl.uniform2f(U.uRes, canvas.width, canvas.height);
    gl.uniform1f(U.uTime, time);
    gl.uniform2f(U.uMouse, mouse[0], mouse[1]);
    gl.uniform1f(U.uScroll, scrollY / innerHeight);
    for (let i = 0; i < 4; i++) gl.uniform3fv(U['c' + i], cur.c[i]);
    gl.uniform1f(U.uStyle, shownStyle);
    gl.uniform1f(U.uLight, cur.light);
    gl.uniform1f(U.uGrain, target.grain ?? 1);
    gl.uniform1f(U.uFocus, matchMedia('(pointer:fine)').matches ? 1 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  requestAnimationFrame(frame);
  return { canvas };
}
