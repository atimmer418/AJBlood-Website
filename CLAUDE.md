# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website for Dr. Alexander J. Blood. Currently frontend-only (Angular 19); `backend/` is an empty placeholder.

All work happens inside `frontend/`.

## Commands

```bash
cd frontend

npm start          # dev server (ng serve)
npm run build      # production build
npm test           # Karma/Jasmine unit tests
npm run optimize:images  # regenerate WebP assets from originals
```

To run a single spec file:
```bash
cd frontend && npx ng test --include='**/nav.component.spec.ts'
```

## Architecture

### Angular setup
- Angular 19, **standalone components throughout** — no NgModules.
- Lazy-loaded routes via `loadComponent` in `app.routes.ts`.
- `app.config.ts` bootstraps: zone change detection, router with `PreloadAllModules` + scroll-to-top, and a global `IMAGE_LOADER`.

### Directory layout
- `src/app/pages/` — one component per route (Home, About, Expertise, Publications, Insights, Podcast, Contact).
- `src/app/components/` — shared UI pieces composed inside pages.
- `src/app/services/` — `ImagePrefetchService` (idle-time `<link rel="prefetch">` injection).

### Image pipeline
Images must be pre-processed before use:
1. Place originals (JPG/PNG/WebP) in `public/assets/_originals/`.
2. Run `npm run optimize:images` — uses Sharp to emit four WebP widths (480, 960, 1600, 2400) into `public/assets/optimized/`.
3. In templates, use Angular's `NgOptimizedImage` (`ngSrc`) with just the base name (e.g. `ngSrc="headshot"`). The custom `IMAGE_LOADER` in `app.config.ts` automatically resolves the correct `assets/optimized/<name>-<width>.webp` path.

### Nav dark/light mode
`NavComponent` exposes `isDarkNav` — a computed signal that is `true` only on `/` and `/publications`. Components on those routes must work against a dark background; all others use the light surface.

### Design tokens
All styling is done with CSS custom properties defined in `src/styles.scss`. Never hard-code colors, sizes, or shadows — reference the tokens:

| Category | Key tokens |
|---|---|
| Color | `--color-primary`, `--color-secondary`, `--fg1`, `--fg2`, `--fg-accent`, `--bg`, `--bg-low/mid/high`, `--bg-dark`, `--accent` |
| Typography | `--font-serif` (Noto Serif), `--font-sans` (Inter); `--text-display-lg` → `--text-label-sm` scale |
| Spacing | `--page-px`, `--section-py`, `--hero-pt`, `--nav-height`, `--card-gap` (all responsive via breakpoints) |
| Shape | `--radius-sm/md/lg/full/card/chip` |
| Elevation | `--shadow-card`, `--shadow-md`, `--shadow-float` |

Responsive breakpoints: **768 px** (tablet/mobile) and **480 px** (small mobile). Responsive tokens shrink automatically at these breakpoints. Use `.hide-mobile` / `.show-mobile` utility classes for conditional visibility.

### Global utility classes
`.label`, `.label-accent`, `.text-accent`, `.text-muted`, `.italic-accent`, `.glass`, `.pulse-line` — defined in `styles.scss`, available everywhere without import.
