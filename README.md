# Kingdom — website directions

Static site, served live by the Cloudflare Worker `kingdom-silver` (https://kingdom-silver.jacob43906.workers.dev), which reads this branch at a pinned commit.

- `index.html`: hub listing every direction
- `ceremony.html`, `sovereign.html`, `vitrine.html`: built around the 3D ewer (`assets/model/ewer-2k.glb`)
- `nocturne.html`, `hallmark.html`: built around the flat photograph
- `descent.html`, `atelier.html`, `arch.html`, `vault.html`: first round
- `kingdom.config.js`: set `editor:false` to hide the Design studio for the public launch
- `src/`: React Three Fiber + GSAP source for `dist/` (bundle with `src/build.sh`, esbuild)
