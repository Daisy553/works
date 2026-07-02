const assert = require('assert');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

const requiredHooks = [
  'id="room-bg-video"',
  'autoplay',
  'muted',
  'loop',
  'playsinline',
  'poster="assets/interior-room-reference.png"',
  'src="assets/background-loop.webm"',
  'src="assets/background-loop.mp4"',
  'id="pixel-bg"',
  'class="portfolio-shell"',
  'data-category-nav',
  'data-album-track',
  'data-album-prev',
  'data-album-next',
  'id="work-detail"',
  'data-detail-media',
  'data-detail-close',
  'src="project-data.js"',
  'src="portfolio-state.js"',
  'src="script.js"',
];

for (const hook of requiredHooks) {
  assert.ok(html.includes(hook), `required hook missing: ${hook}`);
}

const oldHooks = ['id="scene"', 'id="nav"', 'class="ambient-light-layer"'];

for (const hook of oldHooks) {
  assert.ok(!html.includes(hook), `old hook should be removed: ${hook}`);
}

const mainCloseIndex = html.indexOf('</main>');
const detailIndex = html.indexOf('id="work-detail"');

assert.ok(mainCloseIndex !== -1, 'portfolio shell closing </main> should exist');
assert.ok(detailIndex !== -1, 'work detail should exist');
assert.ok(mainCloseIndex < detailIndex, 'work detail should be outside the inert portfolio shell');

const scriptOrder = [
  html.indexOf('src="project-data.js"'),
  html.indexOf('src="portfolio-state.js"'),
  html.indexOf('src="script.js"'),
];

assert.ok(
  scriptOrder.every((index) => index !== -1) &&
    scriptOrder[0] < scriptOrder[1] &&
    scriptOrder[1] < scriptOrder[2],
  'scripts should load in project-data, portfolio-state, script order',
);

console.log('dom contract passed');
