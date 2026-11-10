# Daisy Lab

Personal blog for Daisy Lab. The homepage is the article stream. The works album stays at `/works/`.

The blog is an [Astro](https://astro.build) static site. Notes are Markdown files. The album, categories, and detail view are still the portfolio runtime (`public/project-data.js`, `public/portfolio-state.js`, `public/script.js`, `public/styles.css`). Astro is a small static generator: one person can add a note by adding one Markdown file, and Cloudflare Pages only needs the built `dist/` folder.

## Structure

- `src/content/posts/` — one Markdown file per note. Drop in a file to publish.
- `src/pages/` — home, note list, note page, tag archive, works, RSS, robots.
- `src/layouts/Base.astro` — shared room background, SEO tags, and page shell.
- `src/styles/site.css` — reading layout. Portfolio motion and album styling stay in `public/styles.css`.
- `public/project-data.js` — portfolio owner, categories, and works. Contact details live here and in the identity panel.
- `public/` — background video, work media, and the portfolio scripts served as-is.
- `tests/` — contract checks, including the built HTML.
- `docs/maintenance.md` — editing rules.

## Add a note

Create `src/content/posts/your-note.md`:

```markdown
---
title: Note title
description: One or two sentences for the list, RSS, and the page description.
date: 2026-01-15
tags:
  - Houdini
category: 分享 / Share
lang: zh
sample: false
draft: false
---

Write the note in Markdown. Chinese and English can share a page.
Fenced code blocks, images, and `<video>` embeds are rendered on the note page.
```

- `draft: true` keeps the file in the repo and leaves it off the site, RSS, and tag pages.
- `sample: true` publishes the note and marks it as 样稿.
- `dateLabel` replaces the visible date when the archive only has a year, such as `2024` or `当前`.
- `sort` controls order when dates are only archive years. Higher numbers are newer.
- `image` is the Open Graph image. Root-relative paths such as `/assets/...` work from every page.

## Local preview

```bash
npm install
npm run dev
```

Open the URL Astro prints. `npm run preview` serves the built site.

## Checks

```bash
npm run check
```

This syntax-checks the portfolio scripts, runs the contract tests, builds `dist/`, and checks the generated pages, RSS, and sitemap.

## Cloudflare Pages

The site is static. No adapter and no server.

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node.js version | `22` |

Set the environment variable `SITE_URL` to the public origin, including `https://`, with no trailing path. Canonical URLs, Open Graph images, the sitemap, and RSS use it. If it is unset, the build defaults to `https://daisy553.pages.dev`.

Pages serves the directory build with trailing slashes (`/notes/`, `/works/`). Pretty URLs can stay on. No `_redirects` file is required.

Do not upload `node_modules/`, `.astro/`, or a hand-copied `dist/` to git. Pages builds from the repository.
