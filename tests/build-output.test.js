const assert = require('assert');
const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');

function read(rel) {
  const file = path.join(dist, rel);
  assert.ok(fs.existsSync(file), `missing build output: ${rel}`);
  return fs.readFileSync(file, 'utf8');
}

function walk(dir, found = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, found);
    } else {
      found.push(full);
    }
  }
  return found;
}

const home = read('index.html');
const notes = read(path.join('notes', 'index.html'));
const works = read(path.join('works', 'index.html'));
const tags = read(path.join('tags', 'index.html'));
const trail = read(path.join('notes', 'trail-effect', 'index.html'));
const houdini = read(path.join('notes', 'houdini-procedural-workflow', 'index.html'));
const niagara = read(path.join('notes', 'niagara-vfx-study', 'index.html'));
const feed = read('rss.xml');
const robots = read('robots.txt');
const sitemap = read('sitemap-index.xml');

for (const html of [home, notes, works, trail, tags]) {
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /<meta name="description" content="[^"]+"/);
  assert.match(html, /<meta property="og:title" content="[^"]+"/);
  assert.match(html, /<meta property="og:description" content="[^"]+"/);
  assert.match(html, /<meta property="og:image" content="https?:\/\/[^"]+"/);
  assert.match(html, /<link rel="canonical" href="https?:\/\/[^"]+"/);
  assert.match(html, /rel="alternate" type="application\/rss\+xml"/);
}

assert.match(home, /bigorangeyong@gmail.com/);
assert.match(home, /18747442595/);
assert.match(works, /bigorangeyong@gmail.com/);
assert.match(works, /18747442595/);
assert.match(home, /Houdini Procedural Workflow/);
assert.match(home, /Niagara VFX Study/);
assert.match(home, /Trail Effect/);
assert.match(home, /进入作品档案/);
assert.match(notes, /Houdini Procedural Workflow/);
assert.match(notes, /Niagara VFX Study/);
assert.match(notes, /Trail Effect/);

assert.match(works, /id="room-bg-video"/);
assert.match(works, /data-album-track/);
assert.match(works, /data-category-nav/);
assert.match(works, /id="work-detail"/);
assert.match(works, /src="\/project-data\.js"/);
assert.match(works, /src="\/portfolio-state\.js"/);
assert.match(works, /src="\/script\.js"/);
assert.ok(works.indexOf('</main>') < works.indexOf('id="work-detail"'));

assert.match(trail, /约 \d+ 分钟/);
assert.match(trail, /<time /);
assert.match(trail, /<video/);
assert.match(trail, /trail-effect-demo\.mp4/);
assert.match(trail, /<pre/);
assert.match(trail, /循环覆盖最旧数据/);
assert.match(trail, /较旧/);
assert.match(houdini, /较新/);
assert.match(houdini, /Parameterized controls|parameterized controls/i);
assert.match(niagara, /<img /);
assert.match(tags, /href="\/tags\/houdini\/"/);
assert.match(tags, /实时特效/);

assert.match(feed, /<rss/);
assert.match(feed, /Houdini Procedural Workflow/);
assert.match(feed, /Niagara VFX Study/);
assert.match(feed, /Trail Effect/);
assert.match(robots, /Sitemap: https?:\/\/\S+sitemap-index\.xml/);
assert.match(sitemap, /sitemap/);

const htmlFiles = walk(dist).filter((file) => file.endsWith('.html') || file.endsWith('.xml'));
const blob = htmlFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
assert.ok(!/snowbreak/i.test(blob), 'built pages should not reference snowbreak');

assert.ok(fs.existsSync(path.join(dist, 'assets', 'background-loop.webm')));
assert.ok(fs.existsSync(path.join(dist, 'styles.css')));
assert.ok(fs.existsSync(path.join(dist, 'script.js')));

console.log('build output contract passed');
