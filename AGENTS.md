# Agent Guide - DavidRubioMoreno.github.io

Pure vanilla HTML/CSS/JS static portfolio. No frameworks, bundlers, build step, package.json, or test suite.

## Entrypoint

`index.html` — everything in one file:
- **CSS**: embedded in a single `<style>` block inside `<head>`
- **HTML layout**: sections for hero, about, skills, portfolio, contact, GitHub contributions
- **Inline JS**: GitHub contributions calendar (~line 1634, see below)
- **External scripts** (loaded at bottom of `<body>`):
  - `scripts/carousel.js` — skills carousel with drag/inertia
  - `scripts/project-videos.js` — play/pause `.project-video` on card hover
  - `scripts/project-modal.js` — detailed modal with YouTube embeds + local video
  - `scripts/cv-preview.js` — PDF modal via `<embed>`

## Assets

| Directory | Contents |
|---|---|
| `assets/icons/` | Skill icons (WebP preferred, PNG fallback) |
| `assets/images/` | Background images (WebP) |
| `assets/videos/` | Project demos (mixed MP4/MKV) |
| `assets/information/` | `.txt` files with per-project metadata |
| `assets/information/cv/` | PDF resume (`David_Rubio_cv.pdf`) |

## Design System

All tokens live under `:root` in the `<style>` block:
- `--bg` (#030303), `--panel` (#08080c), `--text` (#eee)
- `--accent` (#00ff88), `--accent-warm` (#ff6b35), `--accent-glow`
- `--font-sans` (Plus Jakarta Sans), `--font-mono` (JetBrains Mono) — loaded via Google Fonts

## GitHub Contributions Calendar

Inline JS in `index.html` (~line 1634):
- **API**: `https://github-contributions-api.jogruber.de/v4/{user}?y={year}`
- **Cache**: 10-minute in-memory Map; auto-refreshes via `setInterval`
- **Grid**: CSS grid with explicit positioning — `grid-template-columns: 32px repeat(54, 14px)` (label column + 54 data columns), `grid-template-rows: auto repeat(7, 14px)`, `gap: 3px`
- Month labels (row 1), weekday labels (col 1, rows 3/5/7), offset cells (col 2), contribution cells (cols 2-55)
- `daysToMonth` is cloned before leap year mutation (`const d2m = [...daysToMonth]`)
- Cell columns clamped via `Math.min(col, 55)`
- Cell levels: 0=transparent+border, 1-4=increasing accent-green opacity

## Critical Gotchas

- **CSS is one contiguous block**: a single unclosed brace (`}`) breaks every rule from that point onward — double-check CSS edits.
- **No build, no server**: open `index.html` directly or serve with `python -m http.server 8000`.
- **Verify in browser manually**: no automated tests.
- **`backdrop-filter` on `.panel`** can cause child rendering issues in some browsers — add `isolation: isolate` if needed.
- **Videos use mixed codecs**: MKV files are H.264/H.265 muxed in Matroska; ensure `type` attributes on `<source>` match.
