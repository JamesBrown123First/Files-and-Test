import{b as P,c as X,d as p,e as q,f as $,g as Y,h as j,i as Q}from"./chunks/chunk-QSV622DV.js";import{F as I,I as z,K as O,L as W,U as A,_ as C,aa as F,ea as D,fa as V,ja as B,ka as G,v as k}from"./chunks/chunk-SRQMDWYI.js";import"./chunks/chunk-LOKUJV26.js";var{loader:L,start:J}=j({id:"nocturne",kind:"png",preset:"midnight-silk"}),_=innerWidth<900,K=_?"assets/img/ewer-1400.webp":"assets/img/ewer-2400.webp",N=1113/2400,Z="varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }",ee=`
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
}`,te=`
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
}`;function oe(g){let c=document.getElementById("stage"),a=new B({antialias:!0,alpha:!0,powerPreference:"high-performance"});a.setPixelRatio(Math.min(devicePixelRatio,2)),a.setClearColor(0,0),c.appendChild(a.domElement);let y=new G,s=new V(0,1,1,0,-10,10);g.colorSpace=I,g.anisotropy=8,g.generateMipmaps=!0,g.minFilter=k;let b=Array.from({length:8},()=>new W(0,0,0,0)),t={uTex:{value:g},uTime:{value:0},uMouse:{value:new z(-999,-999)},uRes:{value:new z(1,1)},uShimmer:{value:.6},uFollow:{value:1},uReveal:{value:0},uTint:{value:new A},uRip:{value:b},uStrength:{value:.5}},x=new D(1,1).translate(.5,.5,0),w=new C(x,new F({vertexShader:Z,fragmentShader:ee,uniforms:t,transparent:!0,depthWrite:!1})),R=new C(x,new F({vertexShader:Z,fragmentShader:te,uniforms:t,transparent:!0,depthWrite:!1}));y.add(R,w);let i={scale:1,lift:0,horizon:_?.79:.72},o=1,e=1,f=()=>{o=c.clientWidth,e=c.clientHeight,a.setSize(o,e,!1),s.right=o,s.top=e,s.updateProjectionMatrix(),t.uRes.value.set(o*a.getPixelRatio(),e*a.getPixelRatio())};f(),addEventListener("resize",f);let E=r=>{t.uShimmer.value=r.shimmer==="off"?0:r.shimmer==="bright"?1:.55,t.uFollow.value=r.follow&&$&&r.shimmer!=="off"?r.shimmer==="bright"?1.2:.8:0;let u=document.documentElement.dataset.mode==="dark";t.uTint.value.set(getComputedStyle(document.documentElement).getPropertyValue("--c0").trim()||"#0c1424"),t.uStrength.value=u?.55:.42};E(P()),X(E);let T=0,S=0,n=(r,u,d)=>{let m=b[S++%8],v=a.getPixelRatio();m.set(r*v,(e-u)*v,0,d)};c.addEventListener("pointermove",r=>{let u=c.getBoundingClientRect(),d=r.clientX-u.left,m=r.clientY-u.top;t.uMouse.value.set(d*a.getPixelRatio(),(e-m)*a.getPixelRatio());let v=performance.now();m>e*i.horizon&&v-T>140&&(T=v,n(d,m,.55))}),c.addEventListener("pointerdown",r=>{let u=c.getBoundingClientRect(),d=r.clientY-u.top;d>e*i.horizon-40&&n(r.clientX-u.left,d,1.2)}),c.addEventListener("pointerleave",()=>t.uMouse.value.set(-999,-999));let h=0,l=!0;new IntersectionObserver(([r])=>l=r.isIntersecting).observe(c);let H=2.5;return p.ticker.add((r,u)=>{if(!l)return;let d=Math.min(.05,u/1e3);h+=d*(P().motion==="reduced"?0:1),t.uTime.value=h,b.forEach(M=>{M.w>0&&(M.z+=d,M.z>4&&(M.w=0))}),H-=d,H<0&&P().motion!=="reduced"&&(H=5+Math.random()*4,n(o*(.38+Math.random()*.24),e*(i.horizon+.06+Math.random()*.12),.45));let m=e*(_?.44:.62)*i.scale,v=m*N,U=e*(1-i.horizon)+i.lift*e;w.position.set(o/2-v/2,U,0),w.scale.set(v,m,1),R.position.set(o/2-v/2,U-m,0),R.scale.set(v,m,1),a.render(y,s)}),{U:t,view:i}}(async()=>{let g=document.fonts?.ready,[c]=await Q([K,"assets/img/basin-1200.webp"],o=>L.progress(o*.9));await g;let a=new O(c);a.needsUpdate=!0;let y=oe(a);L.done(),await L.ready,J();let s=Y();p.fromTo(y.U.uReveal,{value:0},{value:1.1,duration:s?0:2.6,ease:"power3.inOut"}),document.querySelectorAll(".nc-hero [data-split]").forEach((o,e)=>setTimeout(()=>o._reveal?.(),s?0:900+e*180)),p.to(".nc-hero__foot > *, .nc-hero .k-eyebrow, .nc-horizon",{opacity:1,y:0,duration:1.4,ease:"power3.out",stagger:.1,delay:s?0:1.6}),p.fromTo(".nc-horizon",{scaleX:0},{scaleX:1,duration:2.4,ease:"expo.inOut",delay:s?0:.2});let b=document.querySelector(".nc-scene"),t=p.timeline({defaults:{ease:"none"}});t.to(y.view,{scale:.8,lift:.07,duration:.5,ease:"power2.inOut"},0),t.to(".nc-left",{xPercent:-14,opacity:0,duration:.4},.05),t.to(".nc-right",{xPercent:14,opacity:0,duration:.4},.05),t.to(".nc-hero__foot",{y:40,opacity:0,duration:.3},.05),t.to(".nc-horizon, .nc-mirror",{y:"-7vh",duration:.5,ease:"power2.inOut"},0),t.fromTo(".nc-mid",{opacity:0,y:30},{opacity:1,y:0,duration:.2},.32),t.to(".nc-mid",{opacity:0,y:-30,duration:.15},.62);let x=document.querySelector(".nc-dawn path"),w={k:0},R=()=>{let o=w.k,e=100-o*100,f=100-o*150;x.setAttribute("d",`M0 100 L0 ${Math.max(0,e+20*(1-o)).toFixed(2)} Q50 ${f.toFixed(2)} 100 ${Math.max(0,e+20*(1-o)).toFixed(2)} L100 100 Z`)};R(),t.to(w,{k:1,duration:.36,ease:"power2.in",onUpdate:R},.64),q.create({trigger:b,start:"top top",end:"bottom bottom",scrub:1,animation:t});let i=document.querySelector(".nc-basin__img");if(i){let o=0,e=s?0:.03,f=!1,E=0,T=()=>{let n=i.getBoundingClientRect();return[n.left+n.width/2,n.top+n.height/2]},S=n=>{let[h,l]=T();return Math.atan2(n.clientY-l,n.clientX-h)*180/Math.PI};i.addEventListener("pointerdown",n=>{f=!0,E=S(n),i.setPointerCapture(n.pointerId)}),i.addEventListener("pointermove",n=>{if(!f)return;let h=S(n),l=h-E;l>180&&(l-=360),l<-180&&(l+=360),E=h,o+=l,e=l}),i.addEventListener("pointerup",()=>f=!1),p.ticker.add(()=>{f||(o+=e,e+=((s?0:.03)-e)*.03),i.style.transform=`rotate(${o}deg)`}),p.fromTo(".nc-basin__wrap",{yPercent:30},{yPercent:0,ease:"none",scrollTrigger:{trigger:".nc-basin",start:"top bottom",end:"bottom bottom",scrub:!0}})}})();
