import { boot } from '../boot.js';
const { loader, start } = boot({ id: 'shop', name: 'Shop', preset: 'royal-night', presets: ['royal-night', 'blush-atelier', 'pearl'] });
loader.finish().then(start);
