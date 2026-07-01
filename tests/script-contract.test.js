const assert = require('assert');
const fs = require('fs');
const path = require('path');

const script = fs.readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8');

const requiredSnippets = [
  '#pixel-bg',
  'DAISY_PORTFOLIO',
  'DAISY_PORTFOLIO_STATE',
  'renderNavigation',
  'renderAlbum',
  'openDetail',
  'closeDetail',
  'requestAnimationFrame',
  'imageSmoothingEnabled = false',
  'items.length === 1',
  'items.length === 2',
  'previousFocus',
  '.focus()',
  'inert',
  'pause()',
  'currentTime',
  'prefers-reduced-motion: reduce',
  'album-action',
  'softLightRegions',
  'drawSoftImageRegion',
  'drawBreathingImageRegions',
  'updateNavigationState',
  'is-switching-out',
  'directorySwitchTimer',
  'is-moving-next',
  'is-feedback',
];

for (const snippet of requiredSnippets) {
  assert.ok(script.includes(snippet), `script contract missing: ${snippet}`);
}

const removedSnippets = [
  '#starfield',
  '.site-nav',
  '.tilt-card',
  '.menu-toggle',
  '.reveal',
  'pointermove',
  'drawLightShafts',
  'drawWindowGlints',
  'drawLivingBackground',
  'drawImageRegion',
];

for (const snippet of removedSnippets) {
  assert.ok(!script.includes(snippet), `old script selector should be removed: ${snippet}`);
}

console.log('script contract passed');
