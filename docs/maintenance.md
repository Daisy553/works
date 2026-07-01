# Maintenance Rules

## Product Direction

This repository is a static personal portfolio, not a marketing landing page. The homepage should stay as the usable browsing surface: ambient room background, album-style project window, right-side category index, and same-page detail view.

## Editing Boundaries

- Put content changes in `project-data.js` whenever possible.
- Keep album/category state logic in `portfolio-state.js`.
- Keep DOM rendering and interaction logic in `script.js`.
- Keep visual layout and motion styling in `styles.css`.
- Do not create standalone case-study pages unless the information architecture is intentionally changed.

## Assets

- Store site background assets under `assets/`.
- Store project thumbnails, posters, and reels under `assets/work/`.
- Use descriptive asset names, for example `snowbreak-reel.mp4` and `snowbreak-poster.jpg`.
- Keep large videos compressed for web preview. Prefer a short reel or poster image over raw capture files.
- Future animated background work should use a prepared `mp4/webm` cinemagraph asset with a static poster fallback, not ad hoc full-screen distortion effects.

## Motion

- Foreground album transitions may be expressive but should remain readable.
- Background motion should be calm and subordinate to portfolio content.
- Avoid abstract light streaks, large area shaking, camera movement, or effects that make text harder to read.
- Respect `prefers-reduced-motion` for animation-heavy changes.

## Testing

Run the full test set before committing:

```powershell
node --check .\script.js
node .\tests\script-contract.test.js
node .\tests\css-contract.test.js
node .\tests\dom-contract.test.js
node .\tests\project-data.test.js
node .\tests\portfolio-state.test.js
```

When changing structure, update the relevant contract test in `tests/` during the same change.

## Git

- Commit cohesive changes with clear messages.
- Do not commit local tool caches, screenshots, logs, or temporary worktrees.
- Keep `main` deployable: every pushed commit should pass the local checks above.
