# Insights Article Page Design
**Date:** 2026-04-29

## Goal
Add a dedicated reading page for the article "The Broken Middle: Three Structural Failures in Clinical Trial Eligibility" at `/insights/the-broken-middle`. Wire the "Read Full Insight" button on the insights index to navigate there.

## Route Structure
Flat route at `/insights/the-broken-middle` — a new standalone lazy-loaded component added to `app.routes.ts`, matching the pattern of every other page in the app. No restructuring of the existing insights page.

## Page Layout

### Hero
- Same dark navy (`#000f22`) background with radial glow as the insights index hero
- Breadcrumb line above the title: `Insights / The Broken Middle` — left portion is a `routerLink` back to `/insights`, styled as a small teal link
- Article title in Noto Serif, large (≈42px desktop / clamp down mobile)
- Two tag chips: `Clinical Trials`, `Patient Recruitment`
- Date: `April 2026`

### Featured Image
- The `clinical-trial-data` image (already in the optimized asset pipeline) rendered via `NgOptimizedImage`
- Contained to max-width 1100px, centered, full bleed to that width
- Small caption below: `Photo: National Cancer Institute / Unsplash`

### Article Body
- Max-width 720px, centered with `margin: 0 auto`
- Font: Inter, 16px, `line-height: 1.75`, color `--fg1`
- Section headers (three structural failures) styled as: thin teal rule above, then the header text in Noto Serif small-caps, color `--fg-accent`, font-size ~11px letter-spaced — same visual weight as the `label-accent` utility class
- Paragraphs spaced with `margin-bottom: 1.25em`
- Opening deck paragraph (the thesis) rendered slightly larger (17px) and in a muted color to visually separate it from body text

### Navigation
- `← Back to Insights` as a `routerLink="/insights"` at the top-left of the hero
- No footer "more articles" section

## Components / Files
- New page: `src/app/pages/insights/article-broken-middle/article-broken-middle.component.ts|html|scss`
- Route added to `app.routes.ts` with title `'The Broken Middle — Dr. Alexander J. Blood'`
- `NgOptimizedImage` and `RouterLink` imported in the standalone component
- `insights.component.html`: change `<button>` to `<a routerLink="/insights/the-broken-middle">` styled identically, import `RouterLink` in `InsightsComponent`

## Content
Full article text hard-coded in the HTML template — no CMS or data layer. The article has exactly three section headers and a closing reframe section, all included verbatim.
