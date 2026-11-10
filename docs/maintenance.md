# Maintenance Rules

## Product Direction

This repository is a personal blog. The homepage is the article stream. `/archive/` lists titles by year, `/about/` is the short introduction, and `/works/` is the album, linked from the end of the navigation and from the about page.

Do not turn the homepage into a marketing landing page. Notes stay in Markdown. Work entries stay in `public/project-data.js`.

## Editing Boundaries

- Add or edit a note as one file in `src/content/posts/`.
- Put portfolio content changes in `public/project-data.js`.
- Keep album and category state logic in `public/portfolio-state.js`.
- Keep portfolio DOM rendering and interaction logic in `public/script.js`.
- Keep the album, detail view, and room motion in `public/styles.css`.
- Keep reading layout, navigation, and long-form type in `src/styles/site.css`.
- Keep shared head, room background, and SEO tags in `src/layouts/Base.astro`.
- Do not give a work its own case-study URL. The album detail view is still the work page. A note may link back to `/works/`.
- Do not change the owner's email, Bilibili URL, or GitHub URL unless that contact change is the task. The footer and the about page list only those three. Do not add a phone number back into the site or `public/project-data.js`.
  - `bigorangeyong@gmail.com`

## Notes

A note needs `title`, `description`, `date`, `tags`, `category`, and `lang` (`zh` or `en`). Optional fields:

- `dateLabel` — visible date when the real day was not recorded.
- `sort` — list order. Higher is newer.
- `image` and `imageAlt` — social preview. Use an asset already in `public/assets/`.
- `sample` — show the 样稿 label.
- `draft` — omit the note from pages, the tag archive, the sitemap, and RSS.
- `sourceItem` — portfolio item id the note was assembled from.

Sample notes already in the repo only reuse text that was already in the archive. Do not add biographical claims when editing them.

Images and video in Markdown should use root-relative URLs (`/assets/...`) so they resolve from nested note URLs. Portfolio data can keep `assets/...` paths; `script.js` prefixes a leading slash at runtime.

## Assets

- Store site background assets under `public/assets/`.
- Store project thumbnails, posters, and reels under `public/assets/work/` or a descriptive project folder such as `public/assets/traileffect/`.
- Use descriptive asset names, for example `trail-effect-demo.mp4` and `trail-effect-cover.jpg`.
- Keep large videos compressed for web preview. Prefer a short reel or poster image over raw capture files.
- Animated background work should use prepared `mp4/webm` cinemagraph assets with a static poster fallback, not ad hoc full-screen distortion effects.

## Motion

- Foreground album transitions may be expressive but should remain readable.
- Background motion should be calm and subordinate to notes and portfolio content.
- Avoid abstract light streaks, large area shaking, camera movement, or effects that make text harder to read.
- Keep the background video layer separate from the canvas overlay. The canvas should only provide subtle dust, scanline, vignette, or static fallback treatment.
- Respect `prefers-reduced-motion` for animation-heavy changes.
- Reading pages should not add looping motion of their own. The room background is the motion.

## Visual Limits

Shared by `public/styles.css` and `src/styles/site.css`:

- No circular or pill radii. Corner radius stays at 8px or below.
- No negative letter-spacing.
- No font size that is only `vw`.
- No orb, bokeh, or detached light-beam layers.

## Testing

Run the full check before committing:

```bash
npm run check
```

That command checks syntax, runs the contract tests, builds the static site, and verifies titles, descriptions, Open Graph tags, the note pages, RSS, and the sitemap.

When changing structure, update the relevant contract test in `tests/` during the same change.

## Deploy

Cloudflare Pages, static output only:

- Build command: `npm run build`
- Output directory: `dist`
- Set `SITE_URL` to the public `https://` origin so canonical URLs, Open Graph, RSS, and the sitemap match the real host.

## Git

- Commit cohesive changes with clear messages.
- Do not commit `node_modules/`, `dist/`, `.astro/`, local tool caches, screenshots, logs, or temporary worktrees.
- Keep `main` deployable: every pushed commit should pass `npm run check`.
