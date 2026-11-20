# Royal kit (round three)

Pages: `coronation.html` (3D), `regalia.html`, `lumiere.html`, `exhibit.html`, `procession.html` (photograph), `shop.html` (placeholder until the e-commerce shop is added).

- `src/royal/partials.mjs` — shared sections (header, occasions, collection, story, gift box, campaign, Shop Now, concierge, footer) with variants
- `src/royal/build-pages.mjs` — assembles each page; edit copy here
- `src/royal/state.js` — palettes, presets, backgrounds, type pairings, lighting moods
- `src/royal/pages/*.js(x)` — each page's own hero and interactions
- `css/royal.css` + `css/royal-<page>.css`
- Build: `bash src/royal/build.sh` (needs node_modules from src/package.json)

Ads: drop images into `assets/ads/` and list them in `assets/ads/ads.js`.
Lock a look for everyone: in the Design studio press "Copy settings" and paste into `kingdom.config.js`, e.g.
`window.KINGDOM_CFG = { editor: false, hiResModel: "assets/model/ewer-4k.glb", "regalia": { ...pasted... } };`
