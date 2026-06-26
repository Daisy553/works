# Personal Portfolio Private Archive Design

## Goal

Build a static personal portfolio site for Daisy that feels like an elegant private archive rather than a generic landing page. The site should serve two primary audiences:

- Recruiters and interviewers who need to understand skills, project roles, and evidence quickly.
- Technical-art peers who want to inspect process, media, breakdowns, and technical contribution.

The first version should be a complete, previewable static site with a strong visual identity, smooth interactions, and content that can grow through a data file.

## Design Direction

The selected direction is **Private Work Album**.

The page opens into a quiet personal space: a dynamic pixelated interior-light background based on the provided room reference image. In the foreground, a small horizontal album window presents project thumbnails. A right-side directory switches between top-level content categories. Selecting a project expands into a full-screen case study view with video, images, description, role, and technical notes.

The tone should be elegant, personal, restrained, and artful. It should avoid overbuilt sci-fi panels, strong neon styling, busy effects, or template-like portfolio layouts.

## Information Architecture

Top-level categories:

- `Commercial`
- `Personal`
- `Breakdown`
- `Research`
- `About`

Each category contains content items. A content item should support:

- Title
- Category
- Year or phase
- Role or responsibility
- Thumbnail image
- Short description
- Detail media: video or image gallery
- Technical points or contribution notes
- Optional link: full case, external video, code, document, or contact action

Recommended first-pass category intent:

- `Commercial`: shipped, professional, or client-facing projects.
- `Personal`: experiments, style studies, and self-directed work.
- `Breakdown`: shader, VFX, material, before/after, and process notes.
- `Research`: Houdini, Unreal, Niagara, pipeline, and tool workflow notes.
- `About`: identity, skill stack, contact, resume link, and short personal statement.

## Homepage Experience

The homepage is not a marketing hero. It is the actual portfolio browsing surface.

Primary elements:

- Dynamic pixelated room background.
- Small horizontal album window, positioned center-left or slightly left of center.
- Right-side English directory.
- Minimal identity text, enough to make the visitor understand that Daisy works in technical art, realtime visuals, and project-based visual production.

Default state:

- The album shows featured work thumbnails.
- The selected category is visible.
- The current work thumbnail is the largest and clearest.
- Adjacent works are partially visible on both sides.

Navigation:

- Clicking a right-side category updates the album content.
- Left/right controls, wheel, drag, or keyboard can move between album items.
- Clicking the active thumbnail opens the full-screen detail view.

## Visual System

### Background

Use the supplied interior-light image as the visual source. Convert it into a low-resolution pixelated image treatment, but avoid hard arcade-style pixel art. The desired effect is a low-resolution cinematic image with preserved sunlight, dark room depth, and soft domestic atmosphere.

Dynamic background effects:

- Slight grain and pixel flicker.
- Very slow light drift.
- Gentle dark-area breathing.
- Subtle mouse-driven parallax.
- Minimal pixel disturbance on pointer movement.

The background must remain calm enough that foreground text, thumbnails, and navigation are readable.

### Foreground UI

Use:

- Semi-transparent dark glass panels.
- Thin white or warm-white lines.
- Small amounts of album or paper-edge texture on thumbnail pages.
- Restrained typography with clear hierarchy.

Avoid:

- Heavy neon glow.
- Large metallic frames.
- Decorative gradients or floating blobs.
- Dense technical-dashboard styling.
- Overly playful game UI.

## Album Interaction

The main work browser is a horizontal album.

Behavior:

- Current item is centered and most readable.
- Previous and next items peek from the sides.
- Category changes update the album smoothly.
- Item transitions use transform and opacity, not abrupt jumps.
- Text stays minimal on the album: title, category, and role or year.

The album should feel like browsing a small curated work book rather than scrolling a conventional card grid.

## Detail View

Opening a work item expands into a same-page full-screen case study view.

Detail behavior:

- Background dims and recedes.
- The selected thumbnail visually transitions into the case study surface.
- The detail panel should not feel like a generic modal.
- Closing returns to the previous category and album position.

Detail content order:

- Main media: video first when available, otherwise image.
- Title, role, and project context.
- Short summary.
- Technical contribution points.
- Additional images or breakdown sections.
- Optional external or contact action.

## Responsiveness

Desktop:

- Background fills the viewport.
- Album remains the main focus.
- Right-side directory is visible and stable.

Mobile:

- Background remains atmospheric but simplified.
- Directory becomes a compact top or bottom navigation.
- Album remains horizontal and touch-friendly.
- Detail view stacks media and text vertically.

No text or controls should overlap, overflow, or become too small to tap.

## Implementation Shape

The first implementation should remain static and lightweight:

- `index.html` for the main portfolio surface.
- `styles.css` for layout, responsive rules, background treatment, and UI styling.
- `script.js` for album navigation, category switching, detail transitions, and dynamic background behavior.
- `project-data.js` or equivalent data module for portfolio content.
- Local image and video assets under project-owned paths.

Content should be data-driven so future additions mostly require editing data and adding assets rather than rewriting markup.

## Verification Criteria

The implementation is acceptable when:

- The first viewport clearly feels like an elegant personal archive, not a template page.
- The pixelated background is dynamic but does not compete with the content.
- Category switching, album browsing, and detail opening feel smooth and continuous.
- A recruiter can understand the portfolio focus within 10 seconds.
- A technical-art peer can open details and find concrete technical contributions.
- Desktop and mobile layouts have no overlapping text, clipped controls, or inaccessible interactions.
- Keyboard and pointer interactions work for core browsing.
- Existing project data tests or equivalent data-shape checks pass.

## Out Of Scope For First Version

- Backend CMS.
- Authentication.
- Complex WebGL-only rendering pipeline.
- Fully independent detail pages for every project.
- Heavy 3D book page simulation.
- Exact clone of the earlier reference website.
