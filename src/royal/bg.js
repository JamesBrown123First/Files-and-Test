// Animated background: one full-screen shader, six quiet styles.
// Colours ease toward the palette whenever the editor changes them.
import { getState, palette, onState, rgb01, isDark } from './state.js';

const STYLES = { aurora: 0, silk: 1, guilloche: 2, liquid: 3, stardust: 4, still: 5, tide: 6, rays: 7, velvet: 8, moire: 9, ribbons: 10, mercury: 11, halo: 12, drift: 13 };
const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;
const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uScroll;
uniform vec3 c0; uniform vec3 c1; uniform vec3 c2; uniform vec3 c3; uniform vec3 cA;
uniform float uStyle; uniform float uLight; uniform float uAmt;
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
  vec2 uv = gl_FragCoord.xy/uRes;
  vec2 p = (gl_FragCoord.xy - 0.5*uRes)/uRes.y;
  float t = uTime; float sc = uScroll;
  vec2 m = (uMouse - 0.5) * vec2(uRes.x/uRes.y, 1.);
  vec3 col = mix(c0, c1, smoothstep(-0.8, 0.7, p.y + 0.05*sin(t*0.06)));
  float A = uAmt;
  if (uStyle < 0.5) {
    // AURORA — navy, royal blue and the peach accent drifting past each other
    vec2 q = p + 0.1*vec2(snoise(vec3(p*1.1, t*0.03)), snoise(vec3(p*1.1+7., t*0.03)));
    vec2 a = vec2(-0.6 + 0.38*sin(t*0.05), 0.12 + 0.24*cos(t*0.043) - sc*0.15);
    vec2 b = vec2( 0.62 + 0.3*cos(t*0.038), -0.28 + 0.24*sin(t*0.051) + sc*0.1);
    vec2 c = vec2( 0.08 + 0.5*sin(t*0.029 + 2.), 0.4 + 0.16*cos(t*0.033));
    col = mix(col, c2, blob(q, a, 0.9) * 0.8 * A);
    col = mix(col, c3, blob(q, c, 0.62) * 0.5 * A);
    col = mix(col, cA, blob(q, b, 0.46) * (uLight > 0.5 ? 0.4 : 0.3) * A);
    col = mix(col, cA, blob(q, m*0.7, 0.4) * 0.07);
  } else if (uStyle < 1.5) {
    // SILK — two slow wave trains warped by noise, shaded like satin
    float n = snoise(vec3(p*0.9, t*0.035 + sc*0.2));
    float a = p.x*2.2 + p.y*1.2 + n*1.6 + t*0.11;
    float b = p.x*1.3 - p.y*2.1 + n*1.1 - t*0.07;
    float h = sin(a)*0.62 + sin(b)*0.38;
    float dh = cos(a)*0.62*2.2 + cos(b)*0.38*1.3;
    float fold = smoothstep(-1.0, 1.0, h);
    col = mix(col, c2, 0.32*fold*A);
    float sheen = pow(clamp(0.5 + 0.5*dh*0.35, 0., 1.), 6.0);
    col += mix(cA, vec3(1.), 0.4) * sheen * (uLight > 0.5 ? 0.12 : 0.09) * A;
    col *= mix(0.9, 1.04, fold);
  } else if (uStyle < 2.5) {
    // GUILLOCHÉ — engine-turned silver: fine rosette lines that slowly turn
    vec2 o = p - vec2(0.42, -0.05) - m*0.04;
    float r = length(o); float an = atan(o.y, o.x);
    float w = sin(an*14. + t*0.05) * 0.018 + sin(an*5. - t*0.03)*0.02;
    float lines = abs(fract((r + w) * 46. - t*0.05) - 0.5);
    float l1 = smoothstep(0.06, 0.0, lines);
    vec2 o2 = p + vec2(0.7, 0.35);
    float r2 = length(o2); float an2 = atan(o2.y, o2.x);
    float lines2 = abs(fract((r2 + sin(an2*10. - t*0.04)*0.02) * 38.) - 0.5);
    float l2 = smoothstep(0.05, 0.0, lines2);
    float fade = smoothstep(1.3, 0.1, r) ;
    float fade2 = smoothstep(1.2, 0.2, r2);
    col = mix(col, c2, 0.35*smoothstep(1.4, 0., r)*A);
    vec3 lc = mix(c3, cA, 0.45);
    col = mix(col, lc, (l1*fade*0.16 + l2*fade2*0.08) * (uLight > 0.5 ? 1.1 : 1.0) * A);
  } else if (uStyle < 3.5) {
    // LIQUID SILVER — domain-warped noise with metallic bands
    vec2 q = p*1.1;
    float n1 = snoise(vec3(q, t*0.04));
    float n2 = snoise(vec3(q*1.7 + n1, t*0.05 + 3.));
    float v = snoise(vec3(q + vec2(n1, n2)*0.9, t*0.03 + sc*0.15));
    float band = 0.5 + 0.5*sin(v*5.5 + t*0.15);
    col = mix(col, c2, 0.3*smoothstep(0.2, 1., band)*A);
    float spec = pow(band, 14.);
    col += mix(vec3(1.), cA, 0.35) * spec * (uLight > 0.5 ? 0.16 : 0.12) * A;
    col = mix(col, cA, blob(p, m*0.7, 0.5) * 0.05);
  } else if (uStyle < 4.5) {
    // STARDUST — faint glints drifting upward, like light catching polished silver
    col = mix(col, c2, blob(p, vec2(0.3, 0.1), 1.0)*0.4*A);
    col = mix(col, cA, blob(p, vec2(-0.7, -0.5), 0.6)*0.12*A);
    for (int k=0;k<3;k++){
      float s = 26. + float(k)*22.;
      vec2 g = p*s + vec2(0., t*(0.12 + float(k)*0.05)*s*0.04);
      vec2 id = floor(g); vec2 f = fract(g) - 0.5;
      float h = hash(id + float(k)*17.);
      vec2 off = vec2(hash(id+3.1), hash(id+5.7)) - 0.5;
      float d = length(f - off*0.6);
      float tw = 0.5 + 0.5*sin(t*(0.8 + h*1.8) + h*40.);
      float star = smoothstep(0.08, 0.0, d) * step(0.93, h) * tw;
      col += mix(vec3(1.), cA, 0.4) * star * (0.5 - float(k)*0.12) * A;
    }
  } else if (uStyle < 5.5) {
    // STILL — a quiet gradient with one soft glow
    col = mix(col, c2, blob(p, vec2(0.45, 0.2), 1.1)*0.35*A);
    col = mix(col, cA, blob(p, vec2(-0.6, -0.55), 0.7)*0.08*A);
  } else if (uStyle < 6.5) {
    // ROYAL TIDE — long, slow waves: navy troughs, royal bodies, a peach light on each crest
    vec3 acc = col;
    for (int k=0;k<4;k++){
      float fk = float(k);
      float yb = 0.42 - fk*0.3 + sc*0.12*(fk+1.);
      float n = snoise(vec3(p.x*0.7 + fk*3.1, fk*1.7, t*0.04));
      float wave = yb + 0.09*sin(p.x*(1.6+fk*0.35) + t*(0.16 + fk*0.03) + fk*2.) + 0.07*n;
      float d = p.y - wave;
      float body = smoothstep(0.02, -0.4, d);
      vec3 wc = mix(c2, c3, 0.25 + 0.2*fk);
      acc = mix(acc, mix(wc, c0, 0.15*fk), body*(0.38 - fk*0.05)*A);
      float crest = exp(-d*d*900.) * (0.55 + 0.45*sin(p.x*3. - t*0.3 + fk));
      acc += cA * crest * (uLight > 0.5 ? 0.16 : 0.22) * A;
      acc += cA * exp(-d*d*60.) * 0.025 * A;
    }
    col = acc;
    col = mix(col, cA, blob(p, m*0.7, 0.45) * 0.05);
  } else if (uStyle < 7.5) {
    // THRONE LIGHT — beams falling from a source above, slowly breathing, dust in the light
    vec2 src = vec2(0.15*sin(t*0.05) + m.x*0.08, 0.95);
    vec2 d = p - src; float an = atan(d.x, -d.y);
    float beams = 0.;
    beams += pow(0.5 + 0.5*sin(an*9. + t*0.07), 6.) * 0.6;
    beams += pow(0.5 + 0.5*sin(an*15. - t*0.05 + 1.3), 8.) * 0.4;
    beams *= smoothstep(0.9, 0.0, abs(an)) * smoothstep(2.2, 0.2, length(d));
    col = mix(col, c2, blob(p, vec2(0., 0.6), 1.0)*0.45*A);
    col += mix(cA, vec3(1.), 0.3) * beams * (uLight > 0.5 ? 0.14 : 0.18) * A;
    col = mix(col, cA, blob(p, src - vec2(0., 0.2), 0.35)*0.18*A);
    vec2 g = p*40. + vec2(0., t*0.6); vec2 id = floor(g); vec2 f = fract(g)-0.5;
    float h = hash(id); float dust = smoothstep(0.06, 0., length(f - (vec2(hash(id+1.3), hash(id+4.2))-0.5)*0.7)) * step(0.97, h);
    col += cA * dust * beams * 2.5 * A;
  } else if (uStyle < 8.5) {
    // VELVET — deep folds of a jewel-case lining, light grazing the ridges
    vec2 q = p*vec2(1.4, 0.9);
    float n = snoise(vec3(q*0.8, t*0.025 + sc*0.2));
    float f1 = sin(q.x*3.4 + n*2.4 + t*0.05);
    float f2 = sin(q.x*5.6 - q.y*1.2 + n*1.8 - t*0.04);
    float h = f1*0.65 + f2*0.35;
    float ridge = pow(clamp(h*0.5+0.5, 0., 1.), 3.);
    col = mix(c0, col, 0.55 + 0.45*ridge);
    col = mix(col, c2, ridge*0.35*A);
    col += mix(cA, c3, 0.4) * pow(ridge, 6.) * (uLight > 0.5 ? 0.1 : 0.14) * A;
    col = mix(col, cA, blob(p, m*0.7, 0.5) * 0.05);
  } else if (uStyle > 9.5 && uStyle < 10.5) {
    // RIBBONS — three wide silk ribbons (navy, royal, peach) folding slowly past each other
    vec3 acc = col;
    for (int k=0;k<3;k++){
      float fk = float(k);
      float n = snoise(vec3(p.x*0.55 + fk*4.0, fk, t*0.035));
      float y0 = 0.38 - fk*0.36 + 0.22*sin(p.x*(1.1+fk*0.25) + t*(0.09+fk*0.02) + fk*1.7) + 0.12*n - sc*0.1*(fk-1.);
      float d = p.y - y0;
      float w = 0.075 + 0.03*sin(p.x*1.7 + t*0.07 + fk);
      float band = smoothstep(w, w*0.55, abs(d));
      float twist = 0.5 + 0.5*sin(p.x*2.6 - t*0.12 + fk*2.);
      vec3 rc = fk < 0.5 ? c2 : (fk < 1.5 ? c3 : cA);
      vec3 shade = mix(rc*0.72, mix(rc, vec3(1.), 0.18), twist);
      acc = mix(acc, shade, band*(fk > 1.5 ? (uLight > 0.5 ? 0.18 : 0.1) : 0.24)*A);
      acc += mix(vec3(1.), cA, 0.4) * exp(-pow(d/(w*0.2), 2.)) * pow(twist, 6.) * 0.05 * A;
    }
    col = mix(acc, cA, blob(p, m*0.7, 0.45) * 0.04);
  } else if (uStyle > 10.5 && uStyle < 11.5) {
    // MERCURY — polished liquid metal: domain-warped, with tight bright highlights
    vec2 q = p*0.9 + m*0.05;
    float n1 = snoise(vec3(q*1.2, t*0.03));
    float n2 = snoise(vec3(q*1.2 + vec2(n1*1.4, -n1), t*0.035 + 5.));
    float h = snoise(vec3(q*0.9 + vec2(n2, n1)*0.8, t*0.025 + sc*0.12));
    float e = 0.004;
    float hx = snoise(vec3((q+vec2(e,0.))*0.9 + vec2(n2, n1)*0.8, t*0.025 + sc*0.12));
    float hy = snoise(vec3((q+vec2(0.,e))*0.9 + vec2(n2, n1)*0.8, t*0.025 + sc*0.12));
    vec3 nrm = normalize(vec3((h-hx)/e*0.03, (h-hy)/e*0.03, 1.));
    vec3 L = normalize(vec3(-0.4 + m.x*0.3, 0.6 + m.y*0.2, 0.8));
    float diff = dot(nrm, L)*0.5 + 0.5;
    float spec = pow(max(dot(reflect(-L, nrm), vec3(0.,0.,1.)), 0.), 40.);
    col = mix(col, mix(c0, mix(c1, c2, 0.4), diff), 0.34*A);
    col += mix(vec3(1.), cA, 0.3) * spec * (uLight > 0.5 ? 0.22 : 0.3) * A;
  } else if (uStyle > 11.5 && uStyle < 12.5) {
    // HALO — a slow breathing ring of light behind the centre, with soft rays
    vec2 o = p - vec2(0., 0.05) - m*0.02;
    float r = length(o); float an = atan(o.y, o.x);
    float breathe = 0.5 + 0.5*sin(t*0.35);
    float R = 0.42 + 0.02*breathe + sc*0.15;
    float ring = exp(-pow((r - R)/0.11, 2.));
    float ring2 = exp(-pow((r - R*1.55)/0.22, 2.));
    float rays = pow(0.5 + 0.5*sin(an*18. + t*0.04), 14.) * smoothstep(1.4, R, r) * smoothstep(R*0.6, R, r);
    col = mix(col, c2, blob(p, vec2(0., 0.05), 0.85)*0.45*A);
    col = mix(col, cA, ring*(uLight > 0.5 ? 0.22 : 0.26)*A);
    col = mix(col, c3, ring2*0.12*A);
    col += mix(cA, vec3(1.), 0.4) * rays * 0.018 * A;
  } else if (uStyle > 12.5 && uStyle < 13.5) {
    // DRIFT — soft out-of-focus lights (bokeh) floating upward
    col = mix(col, c2, blob(p, vec2(0.35, 0.2), 1.0)*0.38*A);
    col = mix(col, cA, blob(p, vec2(-0.65, -0.45), 0.7)*0.12*A);
    for (int k=0;k<3;k++){
      float fk = float(k);
      float s = 3.2 + fk*2.2;
      vec2 g = p*s + vec2(t*0.012*(fk+1.), t*(0.03 + fk*0.012)) + sc*vec2(0., 1.2);
      vec2 id = floor(g); vec2 f = fract(g) - 0.5;
      float h = hash(id + fk*9.1);
      vec2 off = (vec2(hash(id+1.7), hash(id+8.3)) - 0.5)*0.5;
      float d = length(f - off);
      float rad = 0.16 + 0.18*hash(id+2.9);
      float bok = smoothstep(rad, rad*0.75, d) * step(0.55, h);
      vec3 bc = h > 0.82 ? cA : (h > 0.68 ? c3 : mix(vec3(1.), cA, 0.5));
      col = mix(col, bc, bok*(0.13 - fk*0.03)*A*(0.75 + 0.25*sin(t*0.4 + h*30.)));
    }
  } else {
    // MOIRÉ — watered silk: two ring fields interfering, very slowly drifting
    vec2 a = p - vec2(-0.5 + 0.1*sin(t*0.03), 0.3);
    vec2 b = p - vec2(0.6, -0.4 + 0.1*cos(t*0.025)) - m*0.03;
    float w = snoise(vec3(p*1.5, t*0.03))*0.04;
    float r1 = sin((length(a) + w)*70.); float r2 = sin((length(b) - w)*66.);
    float moire = smoothstep(0.6, 1.0, r1*r2*0.5+0.5);
    col = mix(col, c2, blob(p, vec2(0.4, 0.1), 1.0)*0.3*A);
    col = mix(col, mix(c3, cA, 0.5), moire * (uLight > 0.5 ? 0.09 : 0.11) * A);
    col = mix(col, cA, blob(p, vec2(-0.6, -0.5), 0.7)*0.08*A);
  }
  // vignette + grain
  col *= mix(1.0, 0.86 + 0.14*smoothstep(1.4, 0.25, length(p*vec2(0.85, 1.))), uLight > 0.5 ? 0.4 : 1.0);
  col += (hash(gl_FragCoord.xy + fract(t)*100.) - 0.5) * 0.012;
  gl_FragColor = vec4(col, 1.0);
}`;

export function initBackground() {
  const cv = document.createElement('canvas');
  cv.className = 'r-bg'; cv.setAttribute('aria-hidden', 'true');
  document.body.prepend(cv);
  const gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power', preserveDrawingBuffer: false });
  if (!gl) { cv.remove(); document.documentElement.classList.add('no-webgl-bg'); return; }
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(s)); return s; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(pr); gl.useProgram(pr);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = {}; ['uRes', 'uTime', 'uMouse', 'uScroll', 'c0', 'c1', 'c2', 'c3', 'cA', 'uStyle', 'uLight', 'uAmt'].forEach((n) => (U[n] = gl.getUniformLocation(pr, n)));
  const cur = { c0: [0, 0, 0], c1: [0, 0, 0], c2: [0, 0, 0], c3: [0, 0, 0], cA: [0, 0, 0] };
  let target = null, style = 0, light = 0, amt = 1, first = true;
  const sync = () => {
    const s = getState(), P = palette();
    target = { c0: rgb01(P.colors[0]), c1: rgb01(P.colors[1]), c2: rgb01(P.colors[2]), c3: rgb01(P.colors[3]), cA: rgb01(s.accent) };
    style = STYLES[s.bg] ?? 0; light = isDark() ? 0 : 1; amt = s.intensity ?? 1;
    if (first) { for (const k in cur) cur[k] = target[k].slice(); first = false; }
  };
  sync(); onState(sync);
  const mouse = [0.5, 0.5], mT = [0.5, 0.5];
  addEventListener('pointermove', (e) => { mT[0] = e.clientX / innerWidth; mT[1] = 1 - e.clientY / innerHeight; }, { passive: true });
  const scale = Math.min(devicePixelRatio, 1.5) * 0.5;
  const resize = () => { cv.width = Math.round(innerWidth * scale); cv.height = Math.round(innerHeight * scale); gl.viewport(0, 0, cv.width, cv.height); };
  resize(); addEventListener('resize', resize);
  let t = Math.random() * 40, last = performance.now(), visible = true;
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; });
  const frame = (now) => {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!visible) return;
    const s = getState();
    const speed = s.motion === 'still' ? 0 : s.motion === 'calm' ? 0.45 : 1;
    t += dt * speed;
    const k = 1 - Math.exp(-dt * 2.4);
    for (const n in cur) for (let i = 0; i < 3; i++) cur[n][i] += (target[n][i] - cur[n][i]) * k;
    mouse[0] += (mT[0] - mouse[0]) * k; mouse[1] += (mT[1] - mouse[1]) * k;
    gl.uniform2f(U.uRes, cv.width, cv.height); gl.uniform1f(U.uTime, t);
    gl.uniform2f(U.uMouse, mouse[0], mouse[1]);
    gl.uniform1f(U.uScroll, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight));
    for (const n in cur) gl.uniform3fv(U[n], cur[n]);
    gl.uniform1f(U.uStyle, style); gl.uniform1f(U.uLight, light); gl.uniform1f(U.uAmt, amt);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  requestAnimationFrame(frame);
}
