/* ==========================================================================
   Kingdom — SilverStage
   A tiny WebGL2 renderer that turns two flat silver photographs into a
   living, relightable 2.5D scene:
     • Ewer  — "turntable illusion": the lathe-shaped body is remapped around
               its own axis (cylindrical warp) so it can genuinely turn ±30°,
               while the handle/spout move as rigid parts. Studio shading stays
               fixed to the camera, engraving detail rotates with the metal.
     • Basin — a real 3D plane (tilt / spin are physically exact for a plate).
               Its mirror centre reflects the ewer and the page ambience.
     • Both  — normals from silhouette + engraving relief, cursor-driven
               specular light, fresnel ambience tint, impact glint, spotlight.
   Drop-in GLB later: see /js/glb-slot.js (same pose API).
   ========================================================================== */
(function () {
  'use strict';

  const VERT = `#version 300 es
  in vec2 aPos;
  uniform mat4 uMVP;
  uniform vec2 uSize;
  out vec2 vUv;
  void main(){
    vUv = vec2(aPos.x, 1.0 - aPos.y);
    vec2 p = (aPos - 0.5) * uSize;
    gl_Position = uMVP * vec4(p, 0.0, 1.0);
  }`;

  const FRAG = `#version 300 es
  precision highp float;
  in vec2 vUv;
  out vec4 outColor;
  uniform int uKind;              // 0 ewer, 1 basin, 2 contact shadow
  uniform sampler2D uTex;         // premultiplied colour
  uniform sampler2D uMap;         // r low-pass lum, g rigid, b mirror disc, a alpha
  uniform sampler2D uRows;        // ewer: r axis, g radius (u units)
  uniform sampler2D uOther;       // the other object's colour (reflections)
  uniform vec2  uTexel;
  uniform vec2  uRes;
  uniform float uTheta;
  uniform vec3  uLight;           // light dir (view space)
  uniform float uSpec;            // highlight strength
  uniform float uBump;
  uniform vec3  uEnvA;            // ambience top (warm)
  uniform vec3  uEnvB;            // ambience bottom (deep)
  uniform vec3  uRoomA;           // page background (mirror)
  uniform vec3  uRoomB;
  uniform float uEnvAmt;
  uniform float uGlint;           // impact flash 0..1
  uniform float uGlintPos;        // sweep position
  uniform float uOpacity;
  uniform vec4  uOtherRect;       // screen-space rect of reflected object (xy min, zw size)
  uniform float uOtherAmt;
  uniform float uOtherRot;
  uniform vec3  uSpot;            // xy screen uv, z radius (0 = off)
  uniform float uSpotAmb;
  uniform float uShadow;          // shadow darkness
  uniform vec3  uShadowCol;
  uniform float uTime;

  float lum(vec3 c){ return dot(c, vec3(0.299,0.587,0.114)); }

  vec4 envColor(vec3 n){
    float t = clamp(n.y*0.5+0.5, 0.0, 1.0);
    return vec4(mix(uEnvB, uEnvA, smoothstep(0.1,0.9,t)), 1.0);
  }

  vec2 otherUV(vec2 sp){
    vec2 c = uOtherRect.xy + uOtherRect.zw*0.5;
    vec2 d = sp - c;
    float aspect = uRes.x/uRes.y;
    d.x *= aspect;
    float cs = cos(-uOtherRot), sn = sin(-uOtherRot);
    d = mat2(cs,-sn,sn,cs)*d;
    d.x /= aspect;
    vec2 uv = d/uOtherRect.zw + 0.5;
    return vec2(uv.x, 1.0-uv.y);
  }

  vec3 shade(vec3 base, float a, vec3 n, float detailL, vec2 sp){
    vec3 V = vec3(0.0,0.0,1.0);
    vec3 L = normalize(uLight);
    vec3 H = normalize(L+V);
    float ndh = max(dot(n,H),0.0);
    float ndl = max(dot(n,L),0.0);
    float L0 = lum(base);
    // broad sheen + crisp glint, stronger on bright polished metal
    float sheen = pow(ndh, 24.0)*0.35 + pow(ndh, 180.0)*1.4;
    float polish = smoothstep(0.25, 0.85, L0);
    vec3 spec = vec3(1.0,0.985,0.96) * sheen * uSpec * (0.25+0.75*polish);
    // fresnel ambience: the room's colour wraps the silhouette
    float fr = pow(1.0 - clamp(n.z,0.0,1.0), 2.2);
    vec3 env = envColor(n).rgb;
    vec3 c = base;
    c = mix(c, c*0.55 + env*0.75*L0 + env*0.08, fr*uEnvAmt);
    // ambient tint in the shadows (silver picks up surroundings)
    c += (env - vec3(0.5))*uEnvAmt*0.18*(1.0-L0);
    c *= 0.88 + 0.22*ndl;
    c += spec*a;
    // impact glint: a soft band of light sweeping across
    float band = exp(-pow((sp.y - uGlintPos)*7.0 + (sp.x-0.5)*1.6, 2.0));
    c += vec3(1.0,0.97,0.93)*band*uGlint*0.55*a*(0.3+polish);
    // spotlight mode: brighter inside the beam
    if (uSpot.z > 0.0){
      vec2 d = sp - uSpot.xy; d.x *= uRes.x/uRes.y;
      float s = smoothstep(uSpot.z, 0.0, length(d));
      c *= mix(0.55, 1.22, s);
    }
    return c;
  }
  // spotlight visibility: outside the beam the silver dissolves into the dark room
  float spotVis(vec2 sp){
    if (uSpot.z <= 0.0) return 1.0;
    vec2 d = sp - uSpot.xy; d.x *= uRes.x/uRes.y;
    float s = smoothstep(uSpot.z, uSpot.z*0.15, length(d));
    return mix(uSpotAmb, 1.0, s);
  }

  void main(){
    vec2 sp = gl_FragCoord.xy / uRes;
    if (uKind == 2){
      vec2 d = (vUv-0.5)*2.0;
      float r = length(d*vec2(1.0,1.0));
      float a = exp(-r*r*3.2) * uShadow;
      outColor = vec4(uShadowCol*a, a) * uOpacity;
      return;
    }
    vec2 uv = vUv;
    if (uKind == 0){
      vec2 row = texture(uRows, vec2(0.5, uv.y)).rg;
      float ax = row.r, r = row.g;
      float dx = uv.x - ax;
      vec4 body = vec4(0.0); float sBody = 0.0; vec2 buv = uv; float valid = 0.0;
      if (r > 0.001 && abs(dx) < r){
        float s = dx/r;
        float ang = asin(clamp(s,-1.0,1.0));
        float a2 = ang - uTheta;
        if (a2 < -1.5707963) a2 = -3.1415926 - a2;   // wrap onto mirrored back
        if (a2 >  1.5707963) a2 =  3.1415926 - a2;
        // fade the warp out toward the silhouette: outline stays crisp, no edge smear
        float keep = smoothstep(0.5, 0.93, abs(s));
        buv = vec2(mix(ax + r*sin(a2), uv.x, keep), uv.y);
        body = texture(uTex, buv);
        // body pixels only (exclude rigid parts sampled by accident)
        float rg = texture(uMap, buv).g;
        body *= 1.0 - rg;
        sBody = s; valid = 1.0;
        // keep studio lighting fixed to camera, let the engraving turn
        float lowW = texture(uMap, buv).r;
        float lowU = texture(uMap, uv).r;
        body.rgb += (lowU - lowW)*0.85*body.a;
      }
      // rigid parts: handle & spout swing on the same axis
      float ct = cos(uTheta), st = sin(uTheta);
      float ds = dx/max(ct,0.2);
      vec2 ruv = vec2(ax + ds, uv.y);
      vec4 rig = texture(uTex, ruv) * texture(uMap, ruv).g;
      float front = -ds*st;               // depth of the rigid part
      vec4 col;
      if (front > 0.0) col = rig + body*(1.0-rig.a);
      else             col = body + rig*(1.0-body.a);
      if (col.a < 0.003){ outColor = vec4(0.0); return; }
      vec3 base = col.rgb/col.a;
      // normals: lathe geometry + engraving relief
      float rU = texture(uRows, vec2(0.5, uv.y - 0.004)).g;
      float rD = texture(uRows, vec2(0.5, uv.y + 0.004)).g;
      float slope = (rU - rD) / 0.008 * 0.35;
      float s = clamp(sBody, -0.98, 0.98);
      vec3 n = (valid > 0.5 && body.a > rig.a) ? vec3(s, slope, sqrt(1.0 - s*s)) : vec3(0.0, 0.0, 1.0);
      vec2 g = vec2(
        lum(texture(uTex, buv + vec2(uTexel.x,0)).rgb) - lum(texture(uTex, buv - vec2(uTexel.x,0)).rgb),
        lum(texture(uTex, buv - vec2(0,uTexel.y)).rgb) - lum(texture(uTex, buv + vec2(0,uTexel.y)).rgb));
      n = normalize(n + vec3(-g*uBump, 0.0));
      vec3 c = shade(base, col.a, n, 0.0, sp);
      // rim reflections of the basin behind (only at grazing angles)
      if (uOtherAmt > 0.0){
        float fr = pow(1.0 - n.z, 2.0);
        vec2 rsp = sp + vec2(n.x, n.y) * vec2(0.09, 0.06);
        vec2 ouv = otherUV(rsp);
        if (ouv.x>0.0 && ouv.x<1.0 && ouv.y>0.0 && ouv.y<1.0){
          vec4 o = textureLod(uOther, ouv, 2.0);
          c = mix(c, o.rgb*1.05, fr*o.a*uOtherAmt*0.85);
        }
      }
      outColor = vec4(c*col.a, col.a) * uOpacity * spotVis(sp);
      return;
    }
    // ---------------- basin ----------------
    vec4 col = texture(uTex, uv);
    if (col.a < 0.003){ outColor = vec4(0.0); return; }
    vec3 base = col.rgb/col.a;
    vec4 m = texture(uMap, uv);
    vec2 d = uv - 0.5;
    vec2 g = vec2(
      lum(texture(uTex, uv + vec2(uTexel.x,0)).rgb) - lum(texture(uTex, uv - vec2(uTexel.x,0)).rgb),
      lum(texture(uTex, uv - vec2(0,uTexel.y)).rgb) - lum(texture(uTex, uv + vec2(0,uTexel.y)).rgb));
    vec3 n = normalize(vec3(d*vec2(1.0,-1.0)*0.55 - g*uBump, 1.0));
    float disc = m.b;
    if (disc > 0.0){
      // polished mirror: page ambience + the ewer standing in front of it
      vec3 nm = vec3(0.0,0.0,1.0);
      float t = clamp(sp.y,0.0,1.0);
      vec3 room = mix(uRoomB, uRoomA, smoothstep(0.0,1.0,t));
      float rr = length(d)/0.18;
      vec3 mir = mix(base*0.7, room, 0.6) * (1.0 - 0.25*smoothstep(0.55,1.0,rr));
      // soft studio streak that follows the light
      vec2 dd = d; float streak = exp(-pow((dd.x*0.8 + dd.y*0.6) - uLight.x*0.18 + uLight.y*0.1, 2.0)*90.0);
      mir += vec3(1.0,0.98,0.95)*streak*0.22*uSpec;
      if (uOtherAmt > 0.0){
        vec2 ouv = otherUV(sp);
        if (ouv.x>0.0 && ouv.x<1.0 && ouv.y>0.0 && ouv.y<1.0){
          vec4 o = textureLod(uOther, ouv, 0.6);
          mir = mix(mir, o.rgb*0.92 + room*0.06, o.a*uOtherAmt);
        }
      }
      base = mix(base, mir, disc);
      n = normalize(mix(n, nm, disc));
    }
    vec3 c = shade(base, col.a, n, 0.0, sp);
    outColor = vec4(c*col.a, col.a) * uOpacity * spotVis(sp);
  }`;

  // ------------------------------------------------------------------ math
  const M4 = {
    persp(fovy, aspect, near, far) {
      const f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
      return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0];
    },
    mul(a, b) {
      const o = new Array(16);
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
        let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + j] * b[i * 4 + k];
        o[i * 4 + j] = s;
      }
      return o;
    },
    trs(x, y, z, rx, ry, rz, s) {
      const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry), cz = Math.cos(rz), sz = Math.sin(rz);
      // R = Rz * Ry * Rx (column-major)
      const r00 = cz * cy, r01 = cz * sy * sx - sz * cx, r02 = cz * sy * cx + sz * sx;
      const r10 = sz * cy, r11 = sz * sy * sx + cz * cx, r12 = sz * sy * cx - cz * sx;
      const r20 = -sy, r21 = cy * sx, r22 = cy * cx;
      return [r00 * s, r10 * s, r20 * s, 0, r01 * s, r11 * s, r21 * s, 0, r02 * s, r12 * s, r22 * s, 0, x, y, z, 1];
    },
    apply(m, v) {
      const x = v[0], y = v[1], z = v[2], w = 1;
      return [m[0] * x + m[4] * y + m[8] * z + m[12] * w, m[1] * x + m[5] * y + m[9] * z + m[13] * w,
        m[2] * x + m[6] * y + m[10] * z + m[14] * w, m[3] * x + m[7] * y + m[11] * z + m[15] * w];
    }
  };

  function hexToRgb(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const n = parseInt(h, 16);
    return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
  }

  function loadImage(src) {
    return new Promise((res, rej) => {
      const im = new Image();
      im.decoding = 'async';
      im.onload = () => res(im);
      im.onerror = rej;
      im.src = src;
    });
  }

  // ------------------------------------------------------------------ stage
  class SilverStage {
    constructor(canvas, opts = {}) {
      this.canvas = canvas;
      this.opts = Object.assign({ base: 'assets/img/', fov: 28, dpr: 2 }, opts);
      this.ready = false;
      this.poses = {
        ewer: { x: 0, y: 0, z: 0, rz: 0, theta: 0, h: 1.45, op: 1, visible: true },
        basin: { x: 0, y: 0, z: -0.3, rx: 0, ry: 0, rz: 0, h: 1.5, op: 1, visible: true },
        shadow: { x: 0, y: -0.75, z: 0, w: 0.8, h: 0.12, amt: 0, op: 1, visible: false }
      };
      this.look = {
        light: [0.35, 0.45, 0.85], spec: 1, bump: 2.2, envA: '#f3c09b', envB: '#14395c', envAmt: 0.55,
        glint: 0, glintPos: 0.5, reflShift: 0.62, roomA: '#2b3a4a', roomB: '#131c2b', reflect: 0.8, spot: [0.5, 0.5, 0], spotAmb: 0.12, shadowCol: '#0b1320'
      };
      this.time = 0;
      const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, alpha: true, antialias: true });
      this.gl = gl;
      if (!gl) { this.failed = true; return; }
      this._init();
    }

    _init() {
      const gl = this.gl;
      const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
      const p = gl.createProgram();
      gl.attachShader(p, sh(gl.VERTEX_SHADER, VERT));
      gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
      this.prog = p;
      this.u = {};
      const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) { const inf = gl.getActiveUniform(p, i); this.u[inf.name] = gl.getUniformLocation(p, inf.name); }
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
      this.vao = gl.createVertexArray();
      gl.bindVertexArray(this.vao);
      const loc = gl.getAttribLocation(p, 'aPos');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    }

    _tex(img, premult, mip) {
      const gl = this.gl, t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premult);
      gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      if (mip) { gl.generateMipmap(gl.TEXTURE_2D); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); }
      else gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      return t;
    }

    _rowsTex(axis, radius) {
      const gl = this.gl, t = gl.createTexture(), n = axis.length;
      const d = new Float32Array(n * 2);
      for (let i = 0; i < n; i++) { d[i * 2] = axis[i]; d[i * 2 + 1] = radius[i]; }
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG32F, 1, n, 0, gl.RG, gl.FLOAT, d);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return t;
    }

    async load() {
      if (this.failed) return false;
      // GLB slot: if 3D models are configured in site.config.js, render those instead
      const models = window.KINGDOM_CONFIG && window.KINGDOM_CONFIG.models;
      if (models && (models.ewer || models.basin)) {
        try {
          if (!window.KingdomGLB) await new Promise((res, rej) => { const s = document.createElement('script'); s.src = this.opts.glbScript || 'vendor/kingdom-glb.min.js'; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
          this.glb = await new window.KingdomGLB.GLBRenderer(this.canvas, this.gl, { fov: this.opts.fov, forceSilver: models.forceSilver !== false, keepColorMap: !!models.keepColorMap }).load(models);
          this.ready = true; this.resize();
          return true;
        } catch (e) { console.warn('GLB models failed to load, using the photographs instead', e); this.glb = null; }
      }
      const b = this.opts.base;
      const [ec, em, bc, bm, ej, bj] = await Promise.all([
        loadImage(b + 'ewer.webp'), loadImage(b + 'ewer-map.png'), loadImage(b + 'basin.webp'), loadImage(b + 'basin-map.png'),
        fetch(b + 'ewer.json').then(r => r.json()), fetch(b + 'basin.json').then(r => r.json())
      ]);
      this.meta = { ewer: ej, basin: bj };
      this.tex = {
        ewer: this._tex(ec, true, true), ewerMap: this._tex(em, false, false),
        basin: this._tex(bc, true, true), basinMap: this._tex(bm, false, false),
        rows: this._rowsTex(ej.axis, ej.radius)
      };
      this.ready = true;
      this.resize();
      return true;
    }

    resize() {
      const c = this.canvas, dpr = Math.min(window.devicePixelRatio || 1, this.opts.dpr);
      const w = Math.max(1, Math.round(c.clientWidth * dpr)), h = Math.max(1, Math.round(c.clientHeight * dpr));
      if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
      this.aspect = c.clientWidth / Math.max(1, c.clientHeight);
    }

    // world → screen uv helper
    _project(mvp, x, y) {
      const p = M4.apply(mvp, [x, y, 0]);
      return [(p[0] / p[3]) * 0.5 + 0.5, (p[1] / p[3]) * 0.5 + 0.5];
    }

    _mvp(pose, w, h, extra) {
      const fov = this.opts.fov * Math.PI / 180;
      const dist = 1 / Math.tan(fov / 2);
      const P = M4.persp(fov, this.aspect, 0.1, 50);
      const V = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -dist, 1];
      const Mm = M4.trs(pose.x, pose.y, pose.z, pose.rx || 0, pose.ry || 0, pose.rz || 0, 1);
      return M4.mul(P, M4.mul(V, Mm));
    }

    _rect(mvp, w, h) {
      const pts = [[-w / 2, -h / 2], [w / 2, -h / 2], [-w / 2, h / 2], [w / 2, h / 2]].map(([x, y]) => this._project(mvp, x, y));
      const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
      const x0 = Math.min(...xs), y0 = Math.min(...ys);
      return [x0, y0, Math.max(...xs) - x0, Math.max(...ys) - y0];
    }

    render(dt = 0.016) {
      if (!this.ready) return;
      this.time += dt;
      this.resize();
      if (this.glb) { this.glb.render(this); return; }
      const gl = this.gl, u = this.u, L = this.look, P = this.poses;
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(this.prog);
      gl.bindVertexArray(this.vao);
      const ln = L.light, ll = Math.hypot(...ln);
      gl.uniform3f(u.uLight, ln[0] / ll, ln[1] / ll, ln[2] / ll);
      gl.uniform2f(u.uRes, this.canvas.width, this.canvas.height);
      gl.uniform1f(u.uSpec, L.spec);
      gl.uniform1f(u.uBump, L.bump);
      gl.uniform3fv(u.uEnvA, hexToRgb(L.envA));
      gl.uniform3fv(u.uEnvB, hexToRgb(L.envB));
      gl.uniform1f(u.uEnvAmt, L.envAmt);
      gl.uniform3fv(u.uRoomA, hexToRgb(L.roomA));
      gl.uniform3fv(u.uRoomB, hexToRgb(L.roomB));
      gl.uniform1f(u.uGlint, L.glint);
      gl.uniform1f(u.uGlintPos, L.glintPos);
      gl.uniform3fv(u.uSpot, L.spot);
      gl.uniform1f(u.uSpotAmb, L.spotAmb);
      gl.uniform1f(u.uTime, this.time);
      gl.uniform1i(u.uTex, 0); gl.uniform1i(u.uMap, 1); gl.uniform1i(u.uRows, 2); gl.uniform1i(u.uOther, 3);

      const em = this.meta.ewer, bm = this.meta.basin;
      const ew = P.ewer, bs = P.basin;
      const eW = ew.h * em.w / em.h, bW = bs.h * bm.w / bm.h;
      const mvpE = this._mvp(ew), mvpB = this._mvp(bs);
      const rectE = this._rect(mvpE, eW, ew.h);
      const rectB = this._rect(mvpB, bW, bs.h);

      // contact shadow
      const sd = P.shadow;
      if (sd.visible && sd.amt > 0.001) {
        const mvpS = this._mvp({ x: sd.x, y: sd.y, z: sd.z, rx: -1.35 });
        gl.uniform1i(u.uKind, 2);
        gl.uniformMatrix4fv(u.uMVP, false, mvpS);
        gl.uniform2f(u.uSize, sd.w, sd.h * 4);
        gl.uniform1f(u.uShadow, sd.amt);
        gl.uniform3fv(u.uShadowCol, hexToRgb(L.shadowCol));
        gl.uniform1f(u.uOpacity, sd.op);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }

      // virtual image of the ewer in the basin mirror (planar mirror ⇒ same x/y, pushed behind)
      if (bs.visible && bs.op > 0.001) {
        // planar mirror: virtual ewer sits behind the basin. A slightly off-axis viewpoint
        // (like the studio photograph) brings the reflection into the polished centre.
        const virt = Object.assign({}, ew, { x: ew.x - (ew.x - bs.x) * this.look.reflShift, z: bs.z - (ew.z - bs.z) - 0.05, rz: ew.rz });
        const rectV = this._rect(this._mvp(virt), eW, ew.h);
        const facing = Math.max(0, Math.cos(bs.rx || 0)) * Math.max(0, Math.cos(bs.ry || 0));
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.tex.basin);
        gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.tex.basinMap);
        gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D, this.tex.ewer);
        gl.uniform1i(u.uKind, 1);
        gl.uniformMatrix4fv(u.uMVP, false, mvpB);
        gl.uniform2f(u.uSize, bW, bs.h);
        gl.uniform2f(u.uTexel, 1.4 / bm.w, 1.4 / bm.h);
        gl.uniform1f(u.uTheta, 0);
        gl.uniform4f(u.uOtherRect, rectV[0], rectV[1], rectV[2], rectV[3]);
        gl.uniform1f(u.uOtherRot, -(ew.rz || 0));
        gl.uniform1f(u.uOtherAmt, ew.visible ? L.reflect * Math.pow(facing, 3) * ew.op : 0);
        gl.uniform1f(u.uOpacity, bs.op);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }

      if (ew.visible && ew.op > 0.001) {
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.tex.ewer);
        gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.tex.ewerMap);
        gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, this.tex.rows);
        gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D, this.tex.basin);
        gl.uniform1i(u.uKind, 0);
        gl.uniformMatrix4fv(u.uMVP, false, mvpE);
        gl.uniform2f(u.uSize, eW, ew.h);
        gl.uniform2f(u.uTexel, 1.2 / em.w, 1.2 / em.h);
        gl.uniform1f(u.uTheta, ew.theta);
        gl.uniform4f(u.uOtherRect, rectB[0], rectB[1], rectB[2], rectB[3]);
        gl.uniform1f(u.uOtherRot, bs.rz || 0);
        gl.uniform1f(u.uOtherAmt, bs.visible ? L.reflect * 0.9 * bs.op : 0);
        gl.uniform1f(u.uOpacity, ew.op);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
    }

    // screen rect (CSS px) of an object, for HTML annotations
    screenRect(name) {
      if (!this.ready) return null;
      if (this.glb) return this.glb.screenRect(name, this) || { x: 0, y: 0, w: 0, h: 0 };
      const m = this.meta[name], p = this.poses[name];
      const w = p.h * m.w / m.h;
      const r = this._rect(this._mvp(p), w, p.h);
      const cw = this.canvas.clientWidth, ch = this.canvas.clientHeight;
      return { x: r[0] * cw, y: (1 - r[1] - r[3]) * ch, w: r[2] * cw, h: r[3] * ch };
    }
  }

  // ------------------------------------------------------------------ physics helpers
  class Spring {
    constructor(v = 0, k = 120, c = 16) { this.v = v; this.t = v; this.vel = 0; this.k = k; this.c = c; }
    step(dt) {
      const steps = Math.ceil(dt / 0.008), h = dt / steps;
      for (let i = 0; i < steps; i++) {
        const a = -this.k * (this.v - this.t) - this.c * this.vel;
        this.vel += a * h; this.v += this.vel * h;
      }
      return this.v;
    }
    snap(v) { this.v = this.t = v; this.vel = 0; }
  }

  window.SilverStage = SilverStage;
  window.KSpring = Spring;
  window.KM4 = M4;
})();
