# Kingdom — website directions

Static site, served live by the Cloudflare Worker `kingdom-silver` (https://kingdom-silver.jacob43906.workers.dev), which reads this branch at a pinned commit.

- `index.html`: hub listing every direction
- `ceremony.html`, `sovereign.html`, `vitrine.html`: built around the 3D ewer (`assets/model/ewer-2k.glb`)
- `nocturne.html`, `hallmark.html`: built around the flat photograph
- `descent.html`, `atelier.html`, `arch.html`, `vault.html`: first round
- `kingdom.config.js`: set `editor:false` to hide the Design studio for the public launch
- `src/`: React Three Fiber + GSAP source for `dist/` (bundle with `src/build.sh`, esbuild)

## Round four (built on Regalia)
`threshold`, `maison`, `diptych`, `filled`, `sceptre` (photograph) and `majesty` (3D). Source: `src/royal/pages/*`, `css/royal-<page>.css`, HTML in `src/royal/build-pages.mjs`.
Campaign ads: `assets/ads/` (listed in `assets/ads/ads.js`), shown in the campaign reel with a full-screen viewer.

## Links
- Public: `https://kingdom-silver.jacob43906.workers.dev/<page>` (e.g. `/threshold`). No Design studio, no list of directions. The root redirects to the home page (`HOME` setting on the Worker, default `regalia`).
- Private studio: `https://kingdom-silver.jacob43906.workers.dev/<STUDIO>/` — the hub, with the Design studio on every page. `<STUDIO>` is a Worker setting; change it to revoke the old link.

## Round five (built on Regalia, photograph only)
`monarch`, `sapphire`, `rosewater`, `dusk`. Source: `src/crown/` (`build.mjs` for HTML, `kit.js` for interactions), `css/crown.css` + `css/crown-<page>.css`. Build: `bash src/crown/build.sh`.
Shop pieces: `assets/items/` (from Items.zip, black and white). The Design studio's new Details tab writes `data-eyebrow`, `data-banner`, `data-finish`, `data-word`, `data-shape`, `data-space` on `<html>`.
