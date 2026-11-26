import { boot } from '../boot.js';
const { loader, start } = boot({ id: 'shop', name: 'Shop', preset: 'royal-shop', presets: ['royal-shop', 'royal-night', 'blush-atelier', 'pearl'] });
loader.finish().then(start);
