const assert = require('assert');
const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');

const requiredSelectors = [
  '#pixel-bg',
  '.portfolio-shell',
  '.identity-panel',
  '.album-stage',
  '.album-card',
  '.album-card.is-active',
  '.album-card.is-before',
  '.album-card.is-after',
  '.directory',
  '.directory.is-switching-out',
  '.directory-button.is-active',
  '.detail-view.is-open',
  '.archive-status',
  '.album-controls',
  '.album-control-prev::before',
  '@keyframes archiveNextActive',
  '@keyframes directoryPress',
  '@keyframes ambientGridBreath',
  '@keyframes directoryFadeIn',
  '@media (max-width: 760px)',
  'image-rendering: pixelated',
];

for (const selector of requiredSelectors) {
  assert.ok(css.includes(selector), `required CSS contract missing: ${selector}`);
}

assert.ok(!/orb|bokeh/i.test(css), 'CSS should not include orb or bokeh visual language');
assert.ok(!/ambient-light-layer|ambient-beam|ambient-glint|ambientBeam/i.test(css), 'CSS should not reintroduce detached ambient light layers');
assert.ok(!/letter-spacing\s*:\s*-\d/i.test(css), 'CSS should not use negative letter spacing');
assert.ok(!/font-size\s*:\s*-?\d*\.?\d+vw\s*;/i.test(css), 'CSS should not use unbounded vw-only font sizes');

const radiusDeclarations = css.match(/border-radius\s*:\s*[^;]+;/gi) || [];

for (const declaration of radiusDeclarations) {
  assert.ok(!/50%/i.test(declaration), `CSS should not use circular radius: ${declaration}`);
  assert.ok(!/\b999px\b/i.test(declaration), `CSS should not use pill radius: ${declaration}`);

  const pixelRadii = declaration.match(/\b\d*\.?\d+px\b/gi) || [];

  for (const radius of pixelRadii) {
    const value = Number.parseFloat(radius);
    assert.ok(value <= 8, `CSS radius should be 8px or less: ${declaration}`);
  }
}

console.log('css contract passed');
