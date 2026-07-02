# Daisy Ambient Archive

Static personal portfolio for Daisy. The site is a lightweight, data-driven archive for technical art, realtime visuals, process notes, and case-study media.

## Structure

- `index.html` - semantic page shell and detail dialog anchors.
- `styles.css` - visual system, responsive layout, album transitions, and detail view styling.
- `script.js` - data rendering, album/category interactions, detail view behavior, and background video/canvas fallback handling.
- `project-data.js` - portfolio owner info, categories, items, media, and technical notes.
- `portfolio-state.js` - pure helpers for category filtering and cyclic album navigation.
- `assets/` - background poster/video and portfolio media.
- `tests/` - Node contract tests for DOM, CSS, data, script behavior, and state helpers.
- `docs/maintenance.md` - maintenance rules for future edits.

## Local Preview

Open `index.html` directly in a browser. No build step is required.

## Checks

Run before pushing changes:

```powershell
node --check .\script.js
node .\tests\script-contract.test.js
node .\tests\css-contract.test.js
node .\tests\dom-contract.test.js
node .\tests\project-data.test.js
node .\tests\portfolio-state.test.js
```
