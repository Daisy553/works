import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readingMinutesFromText, tagSlug } from '../src/lib/posts.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = path.join(root, 'src', 'content', 'posts');
const requiredPosts = [
  'houdini-procedural-workflow.md',
  'niagara-vfx-study.md',
  'trail-effect.md',
];

const files = fs.readdirSync(postsDir).filter((file) => file.endsWith('.md')).sort();
assert.deepEqual(files, requiredPosts);

const houdini = fs.readFileSync(path.join(postsDir, requiredPosts[0]), 'utf8');
const niagara = fs.readFileSync(path.join(postsDir, requiredPosts[1]), 'utf8');
const trail = fs.readFileSync(path.join(postsDir, requiredPosts[2]), 'utf8');

for (const post of [houdini, niagara, trail]) {
  assert.match(post, /^---\n/);
  assert.match(post, /\nsample: true\n/);
  assert.match(post, /样稿/);
  assert.doesNotMatch(post, /snowbreak/i);
}

assert.match(houdini, /title: Houdini Procedural Workflow/);
assert.match(
  houdini,
  /A procedural study for generating reusable environment and effect-support assets with predictable art controls\./,
);
assert.match(houdini, /Built parameterized controls for shape variation and repeatable asset output\./);
assert.match(houdini, /Organized node networks around artist-facing inputs and deterministic export steps\./);
assert.match(houdini, /Documented handoff notes for engine import, scale checks, and material assignment\./);

assert.match(niagara, /title: Niagara VFX Study/);
assert.match(
  niagara,
  /A breakdown-oriented Niagara study exploring layered motion, material modulation, and timing hierarchy\./,
);
assert.match(niagara, /Separated primary, secondary, and detail emitters for readable effect staging\./);
assert.match(niagara, /Used material parameters to drive color, dissolve, and soft edge transitions\./);
assert.match(niagara, /Profiled emitter counts and bounds to keep the setup practical for realtime scenes\./);

assert.match(trail, /title: Trail Effect/);
assert.match(trail, /一个可复用的 Unreal Engine 角色残影组件，通过记录运动历史生成清晰、可控的实时残影。/);
assert.match(trail, /按时间间隔或位移阈值捕获角色姿态/);
assert.match(trail, /循环覆盖最旧数据，避免历史记录持续增长/);
assert.match(trail, /assets\/traileffect\/trail-effect-demo\.mp4/);
assert.match(trail, /```cpp/);

assert.equal(tagSlug('C++'), 'cplusplus');
assert.equal(tagSlug('VFX Breakdown'), 'vfx-breakdown');
assert.equal(tagSlug('实时特效'), '实时特效');
assert.equal(readingMinutesFromText('中'.repeat(450)), 1);
assert.equal(readingMinutesFromText(''), 1);

console.log('posts contract passed');
