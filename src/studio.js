import * as THREE from 'three';
// Photo-studio environment for polished silver, rendered once into a PMREM cube.
// Base: the supplied light-tent HDR (bright, even light for the matte engraved ground).
// On top: soft boxes and strip lights for crisp highlights, and black flags so the
// mirror-polished parts pick up deep, defined dark reflections (as in a real silver shoot).
export function buildStudio(renderer, hdr, opts = {}) {
  const o = Object.assign({ base: 1, room: 0.0, flags: 1, strips: 1, key: 1, warm: 0.4, cool: 0 }, opts);
  const s = new THREE.Scene();
  if (hdr) {
    const sky = new THREE.Mesh(new THREE.SphereGeometry(30, 64, 32), new THREE.MeshBasicMaterial({ map: hdr, side: THREE.BackSide, toneMapped: false }));
    sky.material.color.setScalar(o.base);
    hdr.mapping = THREE.EquirectangularReflectionMapping; // used as a plain texture here
    sky.material.map = hdr; sky.material.map.mapping = THREE.UVMapping;
    s.add(sky);
  } else s.background = new THREE.Color(o.room, o.room, o.room);
  const geo = new THREE.PlaneGeometry(1, 1);
  const O = [0, 0, 0];
  const card = (w, h, pos, inten, color = [1, 1, 1]) => {
    const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(color[0] * inten, color[1] * inten, color[2] * inten), side: THREE.DoubleSide, toneMapped: false });
    const p = new THREE.Mesh(geo, m); p.scale.set(w, h, 1); p.position.set(...pos); p.lookAt(...O); s.add(p); return p;
  };
  // black flags: tall dark panels close to the subject
  if (o.flags > 0) {
    const k = Math.max(0, 1 - o.flags) * 0.05;
    card(2.6, 9, [-3.2, 0, 3.4], k);
    card(2.0, 9, [3.6, 0, 2.6], k);
    card(3.0, 9, [0.4, 0, -4.2], k);
    card(9, 3, [0, -4.5, 0.5], k);
  }
  card(0.7, 7, [-4.6, 0.6, 1.2], 6 * o.strips);           // left strip light
  card(0.7, 7, [4.4, 0.6, 0.4], 4.5 * o.strips);          // right strip light
  card(0.35, 6, [-1.6, 0.6, -4.6], 3 * o.strips);         // back rims
  card(0.35, 6, [2.2, 0.6, -4.4], 2.4 * o.strips);
  card(5, 3.5, [0, 6.5, 1.5], 2.4 * o.key);               // overhead soft box
  card(2.4, 1.8, [2.6, 1.6, 5.4], 1.8 * o.key);           // small front key
  if (o.warm) card(7, 1.2, [0, -2.8, 4.6], 1.2 * o.warm, [1, 0.7, 0.52]);   // warm peach bounce (brand accent)
  if (o.cool) card(3, 7, [-5, 0.5, -2], 1.4 * o.cool, [0.55, 0.72, 1]);     // royal-blue kick
  const pm = new THREE.PMREMGenerator(renderer);
  const rt = pm.fromScene(s, 0.0, 0.1, 100);
  pm.dispose(); geo.dispose();
  return rt.texture;
}
