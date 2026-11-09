const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const base = fs.readFileSync(path.join(root, 'src', 'layouts', 'Base.astro'), 'utf8');
const works = fs.readFileSync(path.join(root, 'src', 'pages', 'works.astro'), 'utf8');
const identity = fs.readFileSync(path.join(root, 'src', 'components', 'IdentityPanel.astro'), 'utf8');
const html = `${base}\n${works}`;

const requiredHooks = [
  'id="room-bg-video"',
  'autoplay',
  'muted',
  'loop',
  'playsinline',
  'poster="/assets/interior-room-reference.webp"',
  'src="/assets/background-loop.webm"',
  'src="/assets/background-loop.mp4"',
  'id="pixel-bg"',
  'class="portfolio-shell"',
  'data-category-nav',
  'data-album-track',
  'data-album-prev',
  'data-album-next',
  'id="work-detail"',
  'data-detail-media',
  'data-detail-evidence',
  'data-detail-breakdown',
  'data-detail-code',
  'detail-copy-section',
  'data-detail-close',
  'src="/project-data.js"',
  'src="/portfolio-state.js"',
  'src="/script.js"',
];

for (const hook of requiredHooks) {
  assert.ok(html.includes(hook), `required hook missing: ${hook}`);
}

const oldHooks = ['id="scene"', 'id="nav"', 'class="ambient-light-layer"'];

for (const hook of oldHooks) {
  assert.ok(!html.includes(hook), `old hook should be removed: ${hook}`);
}

const mainCloseIndex = works.indexOf('</main>');
const detailIndex = works.indexOf('id="work-detail"');

assert.ok(mainCloseIndex !== -1, 'portfolio shell closing </main> should exist');
assert.ok(detailIndex !== -1, 'work detail should exist');
assert.ok(mainCloseIndex < detailIndex, 'work detail should be outside the inert portfolio shell');

const scriptOrder = [
  base.indexOf('src="/project-data.js"'),
  base.indexOf('src="/portfolio-state.js"'),
  base.indexOf('src="/script.js"'),
];

assert.ok(
  scriptOrder.every((index) => index !== -1) &&
    scriptOrder[0] < scriptOrder[1] &&
    scriptOrder[1] < scriptOrder[2],
  'scripts should load in project-data, portfolio-state, script order',
);

assert.ok(identity.includes('bigorangeyong@gmail.com'), 'identity panel should keep the owner email');
assert.ok(identity.includes('18747442595'), 'identity panel should keep the owner phone');
assert.ok(works.includes('IdentityPanel'), 'works page should keep the identity panel');

console.log('dom contract passed');
