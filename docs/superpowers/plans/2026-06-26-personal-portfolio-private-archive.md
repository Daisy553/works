# Personal Portfolio Private Archive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved private-work-album portfolio: a dynamic pixelated interior background, right-side category directory, horizontal thumbnail album, and same-page full-screen case studies.

**Architecture:** Keep the site static and data-driven. `project-data.js` owns content, `portfolio-state.js` owns testable album/category state helpers, `script.js` owns DOM rendering and background animation, and `styles.css` owns the visual system and responsive layout.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Canvas 2D, Node-based contract tests.

---

## Scope Check

This plan implements one cohesive static portfolio experience. It does not introduce a backend, CMS, WebGL-only renderer, independent case-study pages, or heavy 3D book simulation.

## File Structure

- Create: `assets/interior-room-reference.png`  
  Project-owned copy of the user-provided room image from `C:\Users\zhiyong\AppData\Local\Temp\codex-clipboard-599ea2b1-e42f-4345-8dfc-25b5daefea13.png`.
- Create: `.gitignore`  
  Ignores `.superpowers/` visual brainstorming artifacts.
- Modify: `project-data.js`  
  Exports `DAISY_PORTFOLIO` with categories, background asset, contact, and work items.
- Create: `portfolio-state.js`  
  Pure, testable helpers for category filtering, cyclic navigation, and album item positioning.
- Modify: `index.html`  
  Replaces the old reference-site/canvas shell with semantic portfolio regions.
- Modify: `styles.css`  
  Replaces old string-gallery styling with the pixel-room background, private album UI, detail view, and responsive rules.
- Modify: `script.js`  
  Replaces old gallery code with data-driven rendering, album navigation, detail view, keyboard/touch/pointer handling, and Canvas 2D background animation.
- Modify: `tests/project-data.test.js`  
  Validates the new content schema.
- Create: `tests/portfolio-state.test.js`  
  Validates pure state helpers.
- Create: `tests/dom-contract.test.js`  
  Validates required HTML anchors and regions.
- Create: `tests/css-contract.test.js`  
  Validates critical CSS selectors and responsive/background requirements.
- Delete: `case-snowbreak.html`  
  Removes the stale independent case page from the previous direction. Detail content is now same-page.

---

### Task 1: Portfolio Data, Asset Copy, And Cleanup

**Files:**
- Create: `assets/interior-room-reference.png`
- Create: `.gitignore`
- Modify: `project-data.js`
- Modify: `tests/project-data.test.js`
- Delete: `case-snowbreak.html`

- [ ] **Step 1: Copy the room image into the project asset folder**

Run:

```powershell
New-Item -ItemType Directory -Force -Path .\assets
Copy-Item -LiteralPath "C:\Users\zhiyong\AppData\Local\Temp\codex-clipboard-599ea2b1-e42f-4345-8dfc-25b5daefea13.png" -Destination .\assets\interior-room-reference.png -Force
Test-Path .\assets\interior-room-reference.png
```

Expected: `True`

- [ ] **Step 2: Add local brainstorm artifacts to `.gitignore`**

Create or replace `.gitignore` with:

```gitignore
.superpowers/
```

- [ ] **Step 3: Write the failing project-data contract test**

Replace `tests/project-data.test.js` with:

```javascript
const assert = require("node:assert/strict");
const { DAISY_PORTFOLIO } = require("../project-data.js");

const requiredCategories = ["Commercial", "Personal", "Breakdown", "Research", "About"];

assert.ok(DAISY_PORTFOLIO, "portfolio data should be exported");
assert.equal(DAISY_PORTFOLIO.owner.name, "Daisy", "portfolio owner should be Daisy");
assert.ok(DAISY_PORTFOLIO.background.src.endsWith("assets/interior-room-reference.png"));
assert.deepEqual(
  DAISY_PORTFOLIO.categories.map((category) => category.label),
  requiredCategories,
  "category order should match the approved directory"
);

assert.ok(Array.isArray(DAISY_PORTFOLIO.items), "portfolio items should be an array");
assert.ok(DAISY_PORTFOLIO.items.length >= 5, "portfolio should expose at least five items");

const validCategoryIds = new Set(DAISY_PORTFOLIO.categories.map((category) => category.id));

DAISY_PORTFOLIO.items.forEach((item) => {
  assert.equal(typeof item.id, "string", "item should have an id");
  assert.equal(typeof item.title, "string", "item should have a title");
  assert.ok(validCategoryIds.has(item.category), `invalid category: ${item.category}`);
  assert.equal(typeof item.year, "string", "item should have a year or phase");
  assert.equal(typeof item.role, "string", "item should have a role");
  assert.equal(typeof item.summary, "string", "item should have a summary");
  assert.equal(typeof item.thumbnail, "string", "item should have a thumbnail");
  assert.ok(Array.isArray(item.media), "item should have media entries");
  assert.ok(item.media.length >= 1, "item should have at least one media entry");
  assert.ok(Array.isArray(item.technicalPoints), "item should have technical points");
  assert.ok(item.technicalPoints.length >= 3, "item should have at least three technical points");
});

assert.ok(
  DAISY_PORTFOLIO.items.some((item) => item.media.some((media) => media.type === "video")),
  "at least one item should expose video media"
);

console.log("project data contract passed");
```

- [ ] **Step 4: Run the data test to verify it fails**

Run:

```powershell
node .\tests\project-data.test.js
```

Expected: FAIL with an assertion or export error for `DAISY_PORTFOLIO`.

- [ ] **Step 5: Replace `project-data.js` with the new schema**

Replace `project-data.js` with:

```javascript
(function (root) {
  const categories = [
    { id: "commercial", label: "Commercial", note: "Project work and production-facing pieces" },
    { id: "personal", label: "Personal", note: "Self-directed visual experiments" },
    { id: "breakdown", label: "Breakdown", note: "Shader, VFX, material, and process notes" },
    { id: "research", label: "Research", note: "Tooling, pipeline, and technical-art studies" },
    { id: "about", label: "About", note: "Identity, skill stack, and contact" }
  ];

  const DAISY_PORTFOLIO = {
    owner: {
      name: "Daisy",
      title: "Technical Artist / Realtime Visual Maker",
      summary:
        "I build realtime visual systems, technical-art workflows, and project-facing effects with a focus on clarity, mood, and production reliability.",
      email: "bigorangeyong@gmail.com"
    },
    background: {
      src: "assets/interior-room-reference.png",
      alt: "Pixelated sunlit room background reference"
    },
    categories,
    items: [
      {
        id: "snowbreak-production",
        category: "commercial",
        title: "Snowbreak Production Support",
        year: "Project Work",
        role: "Technical Art / UE5 Workflow",
        thumbnail: "66ce5350b77c68049dce5cc5c33cc1bb.jpg",
        summary:
          "Realtime production support across material, VFX, cinematic, and workflow needs for a UE5 project environment.",
        media: [
          {
            type: "video",
            src: "5200-183786525_large.mp4",
            poster: "66ce5350b77c68049dce5cc5c33cc1bb.jpg",
            label: "Production reel excerpt"
          }
        ],
        tags: ["UE5", "Rendering", "Niagara", "Pipeline"],
        technicalPoints: [
          "Translated art-direction needs into material, VFX, cinematic, and workflow tasks.",
          "Supported UE5 cinematic production flow with attention to asset organization and render output.",
          "Balanced realtime visual quality, performance cost, and maintainable iteration paths.",
          "Documented reusable checks so similar effects could be iterated more reliably."
        ]
      },
      {
        id: "houdini-procedural-workflow",
        category: "research",
        title: "Houdini Procedural Workflow",
        year: "Research",
        role: "Procedural Asset / Tooling",
        thumbnail: "66ce5350b77c68049dce5cc5c33cc1bb.jpg",
        summary:
          "A workflow study for turning repetitive environment production into controllable rules and reusable parameters.",
        media: [
          {
            type: "image",
            src: "66ce5350b77c68049dce5cc5c33cc1bb.jpg",
            label: "Procedural workflow study"
          }
        ],
        tags: ["Houdini", "HDA", "Environment", "Tool"],
        technicalPoints: [
          "Separated generation rules from artist-facing controls for cleaner iteration.",
          "Mapped Houdini output requirements to engine naming, hierarchy, and material-slot expectations.",
          "Focused on reusable logic for vegetation, water, cloth, and environment assets.",
          "Kept generated assets readable enough for team handoff and revision."
        ]
      },
      {
        id: "niagara-vfx-study",
        category: "breakdown",
        title: "Niagara VFX Study",
        year: "Breakdown",
        role: "Niagara / Shader / Blueprint",
        thumbnail: "66ce5350b77c68049dce5cc5c33cc1bb.jpg",
        summary:
          "Realtime VFX experiments focused on particle rhythm, material response, camera distance, and tuning control.",
        media: [
          {
            type: "image",
            src: "66ce5350b77c68049dce5cc5c33cc1bb.jpg",
            label: "Niagara visual study"
          }
        ],
        tags: ["Niagara", "Shader", "Blueprint", "VFX"],
        technicalPoints: [
          "Split particle behavior, material sampling, and Blueprint triggers into readable layers.",
          "Used parameters for brightness, falloff, distortion, and timing control.",
          "Adjusted density and lifetime against camera scale and scene mood.",
          "Kept the effect structure portable for project-facing reuse."
        ]
      },
      {
        id: "water-lookdev",
        category: "personal",
        title: "Realtime Water Lookdev",
        year: "Personal Study",
        role: "Material / Lighting / Post Process",
        thumbnail: "66ce5350b77c68049dce5cc5c33cc1bb.jpg",
        summary:
          "A visual study of water transparency, reflection, fog, lighting, and post-process relationships in realtime scenes.",
        media: [
          {
            type: "image",
            src: "66ce5350b77c68049dce5cc5c33cc1bb.jpg",
            label: "Water lookdev image"
          }
        ],
        tags: ["Water", "Material", "Post Process", "Lighting"],
        technicalPoints: [
          "Layered transparency, normal disturbance, reflection, and foam behavior.",
          "Used lighting and post-process to control image focus beyond the material graph.",
          "Checked parameter stability across close and distant camera scales.",
          "Recorded lookdev decisions as reusable visual judgment notes."
        ]
      },
      {
        id: "production-pipeline-notes",
        category: "commercial",
        title: "Production Pipeline Notes",
        year: "Workflow",
        role: "Sequence / Render / Documentation",
        thumbnail: "66ce5350b77c68049dce5cc5c33cc1bb.jpg",
        summary:
          "A production workflow archive for cinematic sequences, asset organization, render output, and shared checks.",
        media: [
          {
            type: "image",
            src: "66ce5350b77c68049dce5cc5c33cc1bb.jpg",
            label: "Pipeline note preview"
          }
        ],
        tags: ["Sequence", "Render", "Workflow", "Docs"],
        technicalPoints: [
          "Mapped Sequence assets, shot organization, render output, and version checks.",
          "Converted technical limits into clear production rules for art and technical collaborators.",
          "Reduced repeated communication by documenting common checks and failure points.",
          "Kept the workflow archive compact enough to use during active production."
        ]
      }
    ]
  };

  root.DAISY_PORTFOLIO = DAISY_PORTFOLIO;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { DAISY_PORTFOLIO };
  }
})(typeof window !== "undefined" ? window : globalThis);
```

- [ ] **Step 6: Remove the stale independent case page**

Run:

```powershell
if (Test-Path .\case-snowbreak.html) { Remove-Item -LiteralPath .\case-snowbreak.html }
```

Expected: `case-snowbreak.html` no longer exists.

- [ ] **Step 7: Run the data test to verify it passes**

Run:

```powershell
node .\tests\project-data.test.js
```

Expected: `project data contract passed`

- [ ] **Step 8: Commit Task 1**

Run:

```powershell
git add -- .gitignore assets/interior-room-reference.png project-data.js tests/project-data.test.js case-snowbreak.html
git commit -m "feat: add portfolio data and room asset"
```

Expected: commit succeeds with the data file, image asset, test, `.gitignore`, and deletion if the stale file existed.

---

### Task 2: Pure Album State Helpers

**Files:**
- Create: `portfolio-state.js`
- Create: `tests/portfolio-state.test.js`

- [ ] **Step 1: Write the failing state-helper tests**

Create `tests/portfolio-state.test.js`:

```javascript
const assert = require("node:assert/strict");
const {
  getCategoryItems,
  getAdjacentAlbumItems,
  normalizeAlbumIndex,
  getInitialCategoryId
} = require("../portfolio-state.js");

const data = {
  categories: [
    { id: "commercial", label: "Commercial" },
    { id: "personal", label: "Personal" }
  ],
  items: [
    { id: "a", category: "commercial" },
    { id: "b", category: "commercial" },
    { id: "c", category: "commercial" },
    { id: "d", category: "personal" }
  ]
};

assert.equal(getInitialCategoryId(data), "commercial");
assert.deepEqual(getCategoryItems(data, "commercial").map((item) => item.id), ["a", "b", "c"]);
assert.deepEqual(getCategoryItems(data, "missing"), []);
assert.equal(normalizeAlbumIndex(3, 3), 0);
assert.equal(normalizeAlbumIndex(-1, 3), 2);
assert.equal(normalizeAlbumIndex(4, 0), 0);

const adjacent = getAdjacentAlbumItems(data.items.slice(0, 3), 0);
assert.equal(adjacent.previous.id, "c");
assert.equal(adjacent.current.id, "a");
assert.equal(adjacent.next.id, "b");

console.log("portfolio state helpers passed");
```

- [ ] **Step 2: Run the state-helper test to verify it fails**

Run:

```powershell
node .\tests\portfolio-state.test.js
```

Expected: FAIL with `Cannot find module '../portfolio-state.js'`.

- [ ] **Step 3: Implement `portfolio-state.js`**

Create `portfolio-state.js`:

```javascript
(function (root) {
  function getInitialCategoryId(portfolio) {
    if (!portfolio || !Array.isArray(portfolio.categories) || portfolio.categories.length === 0) {
      return "";
    }

    return portfolio.categories[0].id;
  }

  function getCategoryItems(portfolio, categoryId) {
    if (!portfolio || !Array.isArray(portfolio.items)) {
      return [];
    }

    return portfolio.items.filter((item) => item.category === categoryId);
  }

  function normalizeAlbumIndex(index, length) {
    if (!Number.isFinite(length) || length <= 0) {
      return 0;
    }

    return ((index % length) + length) % length;
  }

  function getAdjacentAlbumItems(items, index) {
    if (!Array.isArray(items) || items.length === 0) {
      return { previous: null, current: null, next: null };
    }

    const currentIndex = normalizeAlbumIndex(index, items.length);
    const previousIndex = normalizeAlbumIndex(currentIndex - 1, items.length);
    const nextIndex = normalizeAlbumIndex(currentIndex + 1, items.length);

    return {
      previous: items[previousIndex],
      current: items[currentIndex],
      next: items[nextIndex]
    };
  }

  const api = {
    getInitialCategoryId,
    getCategoryItems,
    normalizeAlbumIndex,
    getAdjacentAlbumItems
  };

  root.DAISY_PORTFOLIO_STATE = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
```

- [ ] **Step 4: Run the state-helper test to verify it passes**

Run:

```powershell
node .\tests\portfolio-state.test.js
```

Expected: `portfolio state helpers passed`

- [ ] **Step 5: Commit Task 2**

Run:

```powershell
git add -- portfolio-state.js tests/portfolio-state.test.js
git commit -m "feat: add portfolio album state helpers"
```

Expected: commit succeeds.

---

### Task 3: Semantic HTML Shell

**Files:**
- Modify: `index.html`
- Create: `tests/dom-contract.test.js`

- [ ] **Step 1: Write the failing DOM contract test**

Create `tests/dom-contract.test.js`:

```javascript
const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");

[
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
  'src="script.js"'
].forEach((needle) => {
  assert.ok(html.includes(needle), `index.html should contain ${needle}`);
});

assert.ok(!html.includes('id="scene"'), "old string-gallery canvas should be removed");
assert.ok(!html.includes('id="nav"'), "old hidden nav link should be removed");

console.log("dom contract passed");
```

- [ ] **Step 2: Run the DOM contract test to verify it fails**

Run:

```powershell
node .\tests\dom-contract.test.js
```

Expected: FAIL because the current `index.html` still uses the old `scene` and `nav` shell.

- [ ] **Step 3: Replace `index.html`**

Replace `index.html` with:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daisy Private Archive</title>
  <meta
    name="description"
    content="Daisy 的技术美术与实时视觉个人作品档案，展示商业项目、个人实验、技术拆解与研究笔记。"
  >
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@500;700&family=Space+Grotesk:wght@500;700&display=swap"
    rel="stylesheet"
  >
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <canvas id="pixel-bg" aria-hidden="true"></canvas>

  <main class="portfolio-shell" data-portfolio-shell>
    <header class="identity-panel" aria-label="Portfolio identity">
      <p class="eyebrow">Daisy / Technical Artist</p>
      <h1>Private Work Album</h1>
      <p class="identity-summary">
        Realtime visual systems, technical-art workflows, project-facing effects, and visual research.
      </p>
    </header>

    <section class="album-stage" aria-label="Selected works">
      <button class="album-control previous" type="button" data-album-prev aria-label="Previous work">Prev</button>
      <div class="album-track" data-album-track></div>
      <button class="album-control next" type="button" data-album-next aria-label="Next work">Next</button>
    </section>

    <nav class="directory" aria-label="Portfolio categories" data-category-nav></nav>
  </main>

  <section class="detail-view" id="work-detail" aria-hidden="true" aria-labelledby="detail-title">
    <button class="detail-backdrop" type="button" data-detail-close aria-label="Close detail"></button>
    <article class="detail-surface" role="dialog" aria-modal="true">
      <button class="detail-close" type="button" data-detail-close aria-label="Close detail">Close</button>
      <div class="detail-media" data-detail-media></div>
      <div class="detail-copy">
        <p class="detail-kicker" data-detail-kicker>Case Study</p>
        <h2 id="detail-title" data-detail-title></h2>
        <p class="detail-summary" data-detail-summary></p>
        <dl class="detail-meta">
          <div>
            <dt>Role</dt>
            <dd data-detail-role></dd>
          </div>
          <div>
            <dt>Tags</dt>
            <dd data-detail-tags></dd>
          </div>
        </dl>
        <ul class="detail-points" data-detail-points></ul>
      </div>
    </article>
  </section>

  <script src="project-data.js"></script>
  <script src="portfolio-state.js"></script>
  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 4: Run the DOM contract test to verify it passes**

Run:

```powershell
node .\tests\dom-contract.test.js
```

Expected: `dom contract passed`

- [ ] **Step 5: Commit Task 3**

Run:

```powershell
git add -- index.html tests/dom-contract.test.js
git commit -m "feat: add private archive html shell"
```

Expected: commit succeeds.

---

### Task 4: Visual System And Responsive CSS

**Files:**
- Modify: `styles.css`
- Create: `tests/css-contract.test.js`

- [ ] **Step 1: Write the failing CSS contract test**

Create `tests/css-contract.test.js`:

```javascript
const assert = require("node:assert/strict");
const fs = require("node:fs");

const css = fs.readFileSync("styles.css", "utf8");

[
  "#pixel-bg",
  ".portfolio-shell",
  ".identity-panel",
  ".album-stage",
  ".album-card",
  ".album-card.is-active",
  ".directory",
  ".directory-button.is-active",
  ".detail-view.is-open",
  ".detail-surface",
  "@media (max-width: 760px)",
  "image-rendering: pixelated"
].forEach((needle) => {
  assert.ok(css.includes(needle), `styles.css should contain ${needle}`);
});

assert.ok(!/orb|bokeh/i.test(css), "visual system should not use orb or bokeh decoration");

console.log("css contract passed");
```

- [ ] **Step 2: Run the CSS contract test to verify it fails**

Run:

```powershell
node .\tests\css-contract.test.js
```

Expected: FAIL because the current CSS still belongs to the old string-gallery direction.

- [ ] **Step 3: Replace `styles.css` with the approved visual system**

Replace `styles.css` with CSS that includes these complete sections:

```css
:root {
  --ink: #f4efe3;
  --muted: rgba(244, 239, 227, 0.68);
  --line: rgba(244, 239, 227, 0.58);
  --line-soft: rgba(244, 239, 227, 0.18);
  --glass: rgba(8, 10, 12, 0.48);
  --glass-strong: rgba(8, 10, 12, 0.72);
  --paper: rgba(236, 226, 205, 0.12);
  --shadow: rgba(0, 0, 0, 0.42);
  font-family: "Space Grotesk", "Noto Sans SC", system-ui, sans-serif;
}

* {
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  min-height: 100%;
  margin: 0;
  background: #060707;
  color: var(--ink);
  overflow: hidden;
}

button,
a {
  font: inherit;
}

#pixel-bg {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  display: block;
  image-rendering: pixelated;
  background: #060707;
}

.portfolio-shell {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  padding: clamp(22px, 4vw, 56px);
  display: grid;
  grid-template-columns: minmax(180px, 0.76fr) minmax(330px, 1.2fr) minmax(180px, 0.46fr);
  gap: clamp(18px, 4vw, 54px);
  align-items: center;
}

.identity-panel {
  align-self: end;
  max-width: 340px;
  padding-bottom: 5vh;
}

.eyebrow,
.detail-kicker {
  margin: 0 0 12px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1,
h2,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 16px;
  font-size: clamp(34px, 6vw, 72px);
  line-height: 0.92;
  letter-spacing: 0;
}

.identity-summary {
  margin-bottom: 0;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.65;
}

.album-stage {
  position: relative;
  min-height: clamp(360px, 58vh, 620px);
  display: grid;
  place-items: center;
}

.album-track {
  position: relative;
  width: min(58vw, 640px);
  height: min(64vh, 520px);
  max-height: 620px;
}

.album-card {
  position: absolute;
  inset: 7% 10%;
  border: 1px solid var(--line);
  background: linear-gradient(135deg, var(--paper), rgba(4, 5, 6, 0.54));
  box-shadow: 0 28px 80px var(--shadow);
  overflow: hidden;
  opacity: 0;
  transform: translateX(0) scale(0.84);
  transition:
    transform 720ms cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 560ms ease,
    filter 560ms ease;
  cursor: pointer;
}

.album-card.is-active {
  opacity: 1;
  transform: translateX(0) scale(1);
  z-index: 3;
}

.album-card.is-before {
  opacity: 0.44;
  transform: translateX(-38%) scale(0.82);
  z-index: 2;
  filter: brightness(0.72);
}

.album-card.is-after {
  opacity: 0.44;
  transform: translateX(38%) scale(0.82);
  z-index: 2;
  filter: brightness(0.72);
}

.album-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: saturate(0.86) contrast(1.05);
}

.album-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background:
    linear-gradient(180deg, transparent 48%, rgba(0, 0, 0, 0.72)),
    repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 4px);
  pointer-events: none;
}

.album-caption {
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 18px;
  z-index: 2;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
}

.album-caption strong {
  display: block;
  font-size: clamp(22px, 3vw, 42px);
  line-height: 0.96;
}

.album-caption span {
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.album-control {
  position: absolute;
  top: 50%;
  z-index: 4;
  width: 46px;
  height: 46px;
  border: 1px solid var(--line-soft);
  background: var(--glass);
  color: var(--ink);
  cursor: pointer;
  transform: translateY(-50%);
}

.album-control.previous {
  left: 0;
}

.album-control.next {
  right: 0;
}

.directory {
  display: grid;
  gap: 12px;
  justify-self: start;
}

.directory-button {
  border: 0;
  border-left: 1px solid var(--line-soft);
  padding: 8px 0 8px 14px;
  background: transparent;
  color: var(--muted);
  text-align: left;
  text-transform: uppercase;
  font-size: clamp(14px, 1.4vw, 18px);
  font-weight: 700;
  cursor: pointer;
  transition: color 240ms ease, border-color 240ms ease, transform 240ms ease;
}

.directory-button.is-active {
  color: var(--ink);
  border-color: var(--line);
  transform: translateX(5px);
}

.detail-view {
  position: fixed;
  inset: 0;
  z-index: 5;
  display: grid;
  place-items: center;
  padding: clamp(18px, 4vw, 56px);
  opacity: 0;
  pointer-events: none;
  transition: opacity 460ms ease;
}

.detail-view.is-open {
  opacity: 1;
  pointer-events: auto;
}

.detail-backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(0, 0, 0, 0.68);
}

.detail-surface {
  position: relative;
  width: min(1120px, 100%);
  max-height: min(760px, 92vh);
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
  gap: clamp(20px, 4vw, 44px);
  overflow: auto;
  border: 1px solid var(--line);
  background: var(--glass-strong);
  box-shadow: 0 40px 110px rgba(0, 0, 0, 0.6);
  padding: clamp(18px, 3vw, 34px);
  transform: translateY(20px) scale(0.98);
  transition: transform 520ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.detail-view.is-open .detail-surface {
  transform: translateY(0) scale(1);
}

.detail-media img,
.detail-media video {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  display: block;
  background: #0a0b0c;
}

.detail-copy h2 {
  margin-bottom: 14px;
  font-size: clamp(32px, 4vw, 56px);
  line-height: 0.96;
}

.detail-summary {
  color: var(--muted);
  line-height: 1.72;
}

.detail-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin: 24px 0;
}

.detail-meta dt {
  color: var(--muted);
  font-size: 11px;
  text-transform: uppercase;
}

.detail-meta dd {
  margin: 4px 0 0;
}

.detail-points {
  margin: 0;
  padding-left: 18px;
  color: var(--muted);
  line-height: 1.65;
}

.detail-close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  border: 1px solid var(--line-soft);
  background: rgba(0, 0, 0, 0.38);
  color: var(--ink);
  padding: 8px 10px;
  cursor: pointer;
}

@media (max-width: 760px) {
  html,
  body {
    overflow: auto;
  }

  .portfolio-shell {
    min-height: 100svh;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    align-items: stretch;
    padding: 18px;
    gap: 18px;
  }

  .identity-panel {
    align-self: start;
    padding-bottom: 0;
  }

  .album-stage {
    min-height: 440px;
  }

  .album-track {
    width: 100%;
    height: 420px;
  }

  .directory {
    grid-auto-flow: column;
    grid-auto-columns: max-content;
    overflow-x: auto;
    justify-self: stretch;
    padding-bottom: 6px;
  }

  .directory-button {
    border-left: 0;
    border-bottom: 1px solid var(--line-soft);
    padding: 10px 0;
    white-space: nowrap;
  }

  .detail-surface {
    grid-template-columns: 1fr;
    max-height: 94svh;
  }

  .detail-meta {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 4: Run the CSS contract test to verify it passes**

Run:

```powershell
node .\tests\css-contract.test.js
```

Expected: `css contract passed`

- [ ] **Step 5: Commit Task 4**

Run:

```powershell
git add -- styles.css tests/css-contract.test.js
git commit -m "feat: style private archive portfolio"
```

Expected: commit succeeds.

---

### Task 5: Browser Rendering, Album Interaction, And Dynamic Pixel Background

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Replace `script.js` with the browser controller**

Replace `script.js` with:

```javascript
(function () {
  const portfolio = window.DAISY_PORTFOLIO;
  const stateApi = window.DAISY_PORTFOLIO_STATE;

  if (!portfolio || !stateApi) {
    return;
  }

  const canvas = document.querySelector("#pixel-bg");
  const shell = document.querySelector("[data-portfolio-shell]");
  const nav = document.querySelector("[data-category-nav]");
  const albumTrack = document.querySelector("[data-album-track]");
  const previousButton = document.querySelector("[data-album-prev]");
  const nextButton = document.querySelector("[data-album-next]");
  const detailView = document.querySelector("#work-detail");
  const detailMedia = document.querySelector("[data-detail-media]");
  const detailTitle = document.querySelector("[data-detail-title]");
  const detailKicker = document.querySelector("[data-detail-kicker]");
  const detailSummary = document.querySelector("[data-detail-summary]");
  const detailRole = document.querySelector("[data-detail-role]");
  const detailTags = document.querySelector("[data-detail-tags]");
  const detailPoints = document.querySelector("[data-detail-points]");

  const appState = {
    categoryId: stateApi.getInitialCategoryId(portfolio),
    albumIndex: 0,
    pointerX: 0,
    pointerY: 0,
    targetPointerX: 0,
    targetPointerY: 0,
    backgroundReady: false
  };

  const backgroundImage = new Image();
  backgroundImage.src = portfolio.background.src;
  backgroundImage.onload = () => {
    appState.backgroundReady = true;
  };

  function getCurrentItems() {
    return stateApi.getCategoryItems(portfolio, appState.categoryId);
  }

  function setCategory(categoryId) {
    appState.categoryId = categoryId;
    appState.albumIndex = 0;
    renderNavigation();
    renderAlbum();
  }

  function moveAlbum(delta) {
    const items = getCurrentItems();
    appState.albumIndex = stateApi.normalizeAlbumIndex(appState.albumIndex + delta, items.length);
    renderAlbum();
  }

  function renderNavigation() {
    nav.replaceChildren();

    portfolio.categories.forEach((category) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "directory-button";
      button.textContent = category.label;
      button.dataset.category = category.id;
      button.setAttribute("aria-pressed", String(category.id === appState.categoryId));

      if (category.id === appState.categoryId) {
        button.classList.add("is-active");
      }

      button.addEventListener("click", () => setCategory(category.id));
      nav.append(button);
    });
  }

  function createAlbumCard(item, positionClass) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `album-card ${positionClass}`;
    card.dataset.itemId = item.id;
    card.setAttribute("aria-label", `Open ${item.title}`);

    const image = document.createElement("img");
    image.src = item.thumbnail;
    image.alt = item.title;
    image.loading = "eager";

    const caption = document.createElement("div");
    caption.className = "album-caption";
    caption.innerHTML = `<strong>${item.title}</strong><span>${item.year} / ${item.role}</span>`;

    card.append(image, caption);
    card.addEventListener("click", () => {
      if (positionClass === "is-before") {
        moveAlbum(-1);
        return;
      }

      if (positionClass === "is-after") {
        moveAlbum(1);
        return;
      }

      openDetail(item);
    });

    return card;
  }

  function renderAlbum() {
    const items = getCurrentItems();
    albumTrack.replaceChildren();

    if (items.length === 0) {
      const empty = document.createElement("p");
      empty.className = "album-empty";
      empty.textContent = "Archive section coming soon.";
      albumTrack.append(empty);
      return;
    }

    appState.albumIndex = stateApi.normalizeAlbumIndex(appState.albumIndex, items.length);
    const adjacent = stateApi.getAdjacentAlbumItems(items, appState.albumIndex);

    if (items.length > 1 && adjacent.previous) {
      albumTrack.append(createAlbumCard(adjacent.previous, "is-before"));
    }

    albumTrack.append(createAlbumCard(adjacent.current, "is-active"));

    if (items.length > 1 && adjacent.next) {
      albumTrack.append(createAlbumCard(adjacent.next, "is-after"));
    }
  }

  function openDetail(item) {
    detailKicker.textContent = `${getCategoryLabel(item.category)} / ${item.year}`;
    detailTitle.textContent = item.title;
    detailSummary.textContent = item.summary;
    detailRole.textContent = item.role;
    detailTags.textContent = item.tags.join(" / ");
    detailPoints.replaceChildren();

    item.technicalPoints.forEach((point) => {
      const li = document.createElement("li");
      li.textContent = point;
      detailPoints.append(li);
    });

    renderDetailMedia(item);
    detailView.classList.add("is-open");
    detailView.setAttribute("aria-hidden", "false");
    shell.setAttribute("aria-hidden", "true");
  }

  function closeDetail() {
    detailView.classList.remove("is-open");
    detailView.setAttribute("aria-hidden", "true");
    shell.removeAttribute("aria-hidden");
  }

  function renderDetailMedia(item) {
    detailMedia.replaceChildren();
    const media = item.media[0];

    if (media.type === "video") {
      const video = document.createElement("video");
      video.src = media.src;
      video.poster = media.poster || item.thumbnail;
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";
      detailMedia.append(video);
      return;
    }

    const image = document.createElement("img");
    image.src = media.src;
    image.alt = media.label || item.title;
    detailMedia.append(image);
  }

  function getCategoryLabel(categoryId) {
    const category = portfolio.categories.find((entry) => entry.id === categoryId);
    return category ? category.label : categoryId;
  }

  function bindEvents() {
    previousButton.addEventListener("click", () => moveAlbum(-1));
    nextButton.addEventListener("click", () => moveAlbum(1));

    document.querySelectorAll("[data-detail-close]").forEach((button) => {
      button.addEventListener("click", closeDetail);
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && detailView.classList.contains("is-open")) {
        closeDetail();
        return;
      }

      if (detailView.classList.contains("is-open")) {
        return;
      }

      if (event.key === "ArrowLeft") {
        moveAlbum(-1);
      }

      if (event.key === "ArrowRight") {
        moveAlbum(1);
      }
    });

    albumTrack.addEventListener("wheel", (event) => {
      if (Math.abs(event.deltaY) < 4 && Math.abs(event.deltaX) < 4) {
        return;
      }

      event.preventDefault();
      moveAlbum(event.deltaY + event.deltaX > 0 ? 1 : -1);
    }, { passive: false });

    window.addEventListener("pointermove", (event) => {
      appState.targetPointerX = event.clientX / window.innerWidth - 0.5;
      appState.targetPointerY = event.clientY / window.innerHeight - 0.5;
    });
  }

  function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  }

  function drawBackground(time) {
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const lowWidth = Math.max(120, Math.floor(width / 6));
    const lowHeight = Math.max(90, Math.floor(height / 6));
    const offscreen = document.createElement("canvas");
    offscreen.width = lowWidth;
    offscreen.height = lowHeight;
    const offCtx = offscreen.getContext("2d");

    appState.pointerX += (appState.targetPointerX - appState.pointerX) * 0.035;
    appState.pointerY += (appState.targetPointerY - appState.pointerY) * 0.035;

    offCtx.fillStyle = "#060707";
    offCtx.fillRect(0, 0, lowWidth, lowHeight);

    if (appState.backgroundReady) {
      const imageRatio = backgroundImage.width / backgroundImage.height;
      const canvasRatio = lowWidth / lowHeight;
      let drawWidth = lowWidth;
      let drawHeight = lowHeight;

      if (imageRatio > canvasRatio) {
        drawHeight = lowHeight;
        drawWidth = lowHeight * imageRatio;
      } else {
        drawWidth = lowWidth;
        drawHeight = lowWidth / imageRatio;
      }

      const driftX = Math.sin(time * 0.00008) * 2 + appState.pointerX * 5;
      const driftY = Math.cos(time * 0.00006) * 2 + appState.pointerY * 4;
      offCtx.drawImage(
        backgroundImage,
        (lowWidth - drawWidth) / 2 + driftX,
        (lowHeight - drawHeight) / 2 + driftY,
        drawWidth,
        drawHeight
      );
    }

    const breath = 0.08 + Math.sin(time * 0.0005) * 0.025;
    const grainStep = 6;

    offCtx.fillStyle = `rgba(255, 232, 178, ${breath})`;
    offCtx.fillRect(lowWidth * 0.18, lowHeight * 0.05, lowWidth * 0.26, lowHeight * 0.5);

    for (let y = 0; y < lowHeight; y += grainStep) {
      for (let x = 0; x < lowWidth; x += grainStep) {
        const flicker = Math.sin((x * 12.9898 + y * 78.233 + time * 0.02)) * 43758.5453;
        const alpha = (flicker - Math.floor(flicker)) * 0.055;
        offCtx.fillStyle = `rgba(255,255,255,${alpha})`;
        offCtx.fillRect(x, y, 1, 1);
      }
    }

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(offscreen, 0, 0, width, height);

    const vignette = ctx.createRadialGradient(
      width * (0.42 + appState.pointerX * 0.04),
      height * (0.28 + appState.pointerY * 0.03),
      width * 0.04,
      width * 0.46,
      height * 0.52,
      width * 0.82
    );
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,0.64)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(0,0,0,0.2)";
    for (let y = 0; y < height; y += ratio * 5) {
      ctx.fillRect(0, y, width, ratio);
    }

    requestAnimationFrame(drawBackground);
  }

  function init() {
    resizeCanvas();
    renderNavigation();
    renderAlbum();
    bindEvents();
    requestAnimationFrame(drawBackground);
  }

  window.addEventListener("resize", resizeCanvas);
  init();
})();
```

- [ ] **Step 2: Run syntax and unit checks**

Run:

```powershell
node --check .\script.js
node .\tests\project-data.test.js
node .\tests\portfolio-state.test.js
node .\tests\dom-contract.test.js
node .\tests\css-contract.test.js
```

Expected:

```text
project data contract passed
portfolio state helpers passed
dom contract passed
css contract passed
```

`node --check` prints no output when syntax is valid.

- [ ] **Step 3: Commit Task 5**

Run:

```powershell
git add -- script.js
git commit -m "feat: render private archive interactions"
```

Expected: commit succeeds.

---

### Task 6: Preview, Responsive QA, And Final Cleanup

**Files:**
- Modify only if verification exposes a specific issue: `index.html`, `styles.css`, `script.js`, `project-data.js`

- [ ] **Step 1: Run all local checks**

Run:

```powershell
node --check .\script.js
node .\tests\project-data.test.js
node .\tests\portfolio-state.test.js
node .\tests\dom-contract.test.js
node .\tests\css-contract.test.js
git status --short
```

Expected:

```text
project data contract passed
portfolio state helpers passed
dom contract passed
css contract passed
```

`git status --short` should show no uncommitted tracked implementation files after commits, except ignored `.superpowers/` files.

- [ ] **Step 2: Open the static page for visual QA**

Run:

```powershell
Start-Process -FilePath (Resolve-Path .\index.html).Path
```

Expected: the browser opens the portfolio page.

- [ ] **Step 3: Verify desktop behavior**

Manual checks:

- The first viewport reads as a private work album, not a marketing landing page.
- The pixelated room background fills the viewport and moves subtly.
- The album is center-left or visually central and the right-side directory is visible.
- Clicking `Commercial`, `Personal`, `Breakdown`, `Research`, and `About` changes the album smoothly.
- Left/right buttons and keyboard arrows move the album without abrupt jumps.
- Clicking the active item opens a full-screen case-study surface.
- Closing the detail view returns to the same category and album position.

- [ ] **Step 4: Verify mobile behavior**

Manual checks at a narrow viewport:

- Directory becomes a compact horizontal navigation.
- Album remains touch-friendly and does not overflow horizontally.
- Detail view stacks media above text.
- No visible text overlaps, clipped buttons, or unreadable controls.

- [ ] **Step 5: Fix any visual QA issue with a focused patch**

If a QA issue appears, patch only the affected file and rerun:

```powershell
node --check .\script.js
node .\tests\project-data.test.js
node .\tests\portfolio-state.test.js
node .\tests\dom-contract.test.js
node .\tests\css-contract.test.js
```

Expected: all checks pass after the patch.

- [ ] **Step 6: Commit final QA fixes if any were needed**

Run only when Step 5 changed files:

```powershell
git add -- index.html styles.css script.js project-data.js tests
git commit -m "fix: polish private archive preview"
```

Expected: commit succeeds if there were QA fixes.

---

## Self-Review

Spec coverage:

- Dynamic pixelated room background: Task 1 copies the asset, Task 4 styles the canvas, Task 5 animates it.
- Right-side directory: Task 3 adds the nav, Task 4 styles it, Task 5 renders categories and switching.
- Horizontal album: Task 2 tests state helpers, Task 3 adds the track, Task 4 styles active/adjacent cards, Task 5 renders and navigates.
- Same-page detail view: Task 3 adds the dialog surface, Task 4 styles the full-screen detail, Task 5 renders media and copy.
- Data-driven content: Task 1 defines `DAISY_PORTFOLIO` and tests the schema.
- Desktop and mobile QA: Task 4 includes the mobile breakpoint, Task 6 verifies both.

Placeholder scan:

- No unfinished-marker words or unspecified implementation steps remain.
- Each code-changing task contains the exact code or command needed for the planned change.

Type consistency:

- Data export is `DAISY_PORTFOLIO` in `project-data.js` and in `tests/project-data.test.js`.
- State export is `DAISY_PORTFOLIO_STATE` in `portfolio-state.js` and consumed by `script.js`.
- DOM hooks in `index.html`, CSS selectors in `styles.css`, and query selectors in `script.js` use the same names.
