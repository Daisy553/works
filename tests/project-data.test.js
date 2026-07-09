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
  DAISY_PORTFOLIO.background.src.endsWith("assets/interior-room-reference.png"),
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
assert.strictEqual(about.thumbnail, "assets/work/zhiyong-avatar.png");
assert.strictEqual(about.media[0].src, "assets/work/zhiyong-avatar.png");
assert.strictEqual(about.media[0].fit, "contain");
assert.deepStrictEqual(about.technicalPoints, [
  "用热爱做游戏。",
  "做着 Shader，也做着各种奇奇怪怪的想法。",
  "好奇心驱动一切，希望我永远在前进的路上。",
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

console.log("project data contract passed");
