const assert = require("assert");
const { DAISY_PORTFOLIO } = require("../project-data.js");

const requiredCategories = [
  ["about", "关于我 / About"],
  ["personal", "作品 / Works"],
  ["breakdown", "分享 / Share"],
  ["commercial", "商业项目 / Commercial"],
];

assert.ok(DAISY_PORTFOLIO, "DAISY_PORTFOLIO export is required");
assert.strictEqual(DAISY_PORTFOLIO.owner.name, "Daisy Lab");
assert.strictEqual(
  DAISY_PORTFOLIO.owner.links.bilibili,
  "https://space.bilibili.com/3247232?spm_id_from=333.1007.0.0",
  "bilibili link should point at Daisy's profile"
);
assert.strictEqual(
  DAISY_PORTFOLIO.owner.links.github,
  "https://github.com/Daisy553",
  "github link should point at Daisy's profile"
);
assert.ok(
  DAISY_PORTFOLIO.background.src.endsWith("assets/interior-room-reference.webp"),
  "background source should point at the room reference asset"
);
assert.strictEqual(
  DAISY_PORTFOLIO.background.video.mp4,
  "assets/background-loop.mp4",
  "background mp4 loop should use the processed asset"
);
assert.strictEqual(
  DAISY_PORTFOLIO.background.video.webm,
  "assets/background-loop.webm",
  "background webm loop should use the processed asset"
);

assert.deepStrictEqual(
  DAISY_PORTFOLIO.categories.map(({ id, label }) => [id, label]),
  requiredCategories
);

const validCategoryIds = new Set(requiredCategories.map(([id]) => id));
const requiredItemIds = [
  "about-daisy-lab",
  "trail-effect",
  "snowbreak-production",
  "houdini-procedural-workflow",
  "niagara-vfx-study",
  "water-lookdev",
  "production-pipeline-notes",
];

assert.ok(DAISY_PORTFOLIO.items.length >= 5, "at least five portfolio items are required");
const itemIds = new Set(DAISY_PORTFOLIO.items.map(({ id }) => id));
for (const id of requiredItemIds) {
  assert.ok(itemIds.has(id), `required item ${id} is missing`);
}

const about = DAISY_PORTFOLIO.items.find(({ id }) => id === "about-daisy-lab");
assert.ok(about, "about-daisy-lab item is required");
assert.strictEqual(about.title, "智勇");
assert.strictEqual(about.role, "技术美术（美术向）");
assert.strictEqual(about.summary, "什么都会一点的菜鸟");
assert.strictEqual(about.thumbnail, "assets/work/zhiyong-avatar.webp");
assert.strictEqual(about.media[0].src, "assets/work/zhiyong-avatar.webp");
assert.strictEqual(about.media[0].fit, "contain");
assert.deepStrictEqual(about.technicalPoints, [
  "爱猫人士",
  "各种奇奇怪怪的想法。",
  "调参大师",
]);

let hasVideo = false;
for (const item of DAISY_PORTFOLIO.items) {
  assert.ok(item.id, "item id is required");
  assert.ok(item.title, `${item.id} title is required`);
  assert.ok(validCategoryIds.has(item.category), `${item.id} category must be valid`);
  assert.ok(item.year, `${item.id} year is required`);
  assert.ok(item.role, `${item.id} role is required`);
  assert.ok(item.summary, `${item.id} summary is required`);
  assert.ok(item.thumbnail, `${item.id} thumbnail is required`);
  assert.ok(Array.isArray(item.tags) && item.tags.length > 0, `${item.id} tags are required`);
  assert.ok(Array.isArray(item.media) && item.media.length > 0, `${item.id} media is required`);
  assert.ok(
    Array.isArray(item.technicalPoints) && item.technicalPoints.length >= 3,
    `${item.id} needs at least three technical points`
  );

  if (item.media.some((media) => media.type === "video")) {
    hasVideo = true;
  }
}

assert.ok(hasVideo, "at least one item must include video media");

const snowbreak = DAISY_PORTFOLIO.items.find(({ id }) => id === "snowbreak-production");
assert.ok(snowbreak, "snowbreak-production item is required");
const snowbreakVideo = snowbreak.media.find(
  (media) => media.type === "video" && media.src === "assets/work/snowbreak-reel.mp4"
);
assert.ok(snowbreakVideo, "snowbreak-production must include the production video media");
assert.strictEqual(
  snowbreakVideo.poster,
  "assets/work/snowbreak-poster.jpg",
  "snowbreak-production video poster should use the expected image"
);

const trailEffect = DAISY_PORTFOLIO.items.find(({ id }) => id === "trail-effect");
assert.ok(trailEffect, "trail-effect item is required");
assert.strictEqual(trailEffect.category, "personal");
assert.strictEqual(trailEffect.year, "当前");
assert.strictEqual(trailEffect.role, "技术美术 / C++");
assert.ok(trailEffect.summary.includes("角色残影组件"), "trail-effect summary should use concise Chinese copy");
assert.strictEqual(trailEffect.thumbnail, "assets/traileffect/trail-effect-cover.jpg");
const trailEffectVideo = trailEffect.media.find(
  (media) => media.type === "video" && media.src === "assets/traileffect/trail-effect-demo.mp4"
);
assert.ok(trailEffectVideo, "trail-effect must include the compressed demonstration video");
assert.strictEqual(
  trailEffectVideo.poster,
  "assets/traileffect/trail-effect-cover.jpg",
  "trail-effect video poster should use the cover image"
);
assert.strictEqual(trailEffect.media.length, 1, "trail-effect should keep the demo video as its only primary media");
assert.strictEqual(trailEffect.media[0].type, "video", "trail-effect primary media should be the demo video");
assert.strictEqual(trailEffect.breakdown.length, 3, "trail-effect should explain the technical flow in three steps");
assert.deepStrictEqual(
  trailEffect.codeSamples.map(({ file }) => file),
  [
    "Private/Components/TrailEffectComponent.cpp",
    "Private/Components/TrailEffectComponent.cpp",
    "Private/Ghost/TrailGhostPool.cpp",
  ],
  "trail-effect code samples should reference the real plugin source files"
);
assert.ok(
  trailEffect.codeSamples.every(({ code }) => code.includes("//")),
  "trail-effect code samples should include concise Chinese annotations"
);

console.log("project data contract passed");
