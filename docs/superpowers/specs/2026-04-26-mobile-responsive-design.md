# Mobile Responsive Design — AJBlood Website

**Date:** 2026-04-26  
**Status:** Approved  
**Approach:** Global Responsive Tokens + Targeted Component Overrides

---

## Overview

Full mobile conversion of the AJBlood Angular site across all 7 routes. The goal is a premium, phone-first experience that preserves the desktop design exactly and layers responsive behaviour on top via a shared token system plus targeted `@media` overrides.

**Primary audience:** General public / patients (phones, ~375–390px) and medical professionals (mix of phones and tablets).

---

## Breakpoints

| Name | Range | Behaviour |
|------|-------|-----------|
| Phone | `< 480px` | Single column, full mobile treatment |
| Tablet | `480px – 768px` | Some 2-col layouts permitted |
| Desktop | `768px – 1024px` | Current desktop layout, minor padding tweaks |
| Wide | `> 1024px` | Unchanged — site as built |

---

## Approach: Global Responsive Tokens + Targeted Overrides

### How it works

A single `@media` block in `styles.scss` overrides CSS custom properties at the two mobile breakpoints. Every component that consumes these tokens adapts automatically. Only components with structural layout changes (grids, side-by-side sections, absolute-positioned cards) receive additional `@media` blocks in their own SCSS files.

### Token overrides (`styles.scss`)

```scss
@media (max-width: 768px) {
  :root {
    --page-px:   24px;   // was 40px
    --section-py: 56px;  // was 72px
    --hero-pt:    72px;  // was 100px
    --nav-height: 52px;  // was 64px
    --card-gap:   12px;  // was 16–32px
  }
}

@media (max-width: 480px) {
  :root {
    --page-px:   16px;
    --section-py: 48px;
    --hero-pt:    50px;
  }
}
```

### Global utility additions (`styles.scss`)

```scss
.hide-mobile { display: none !important; }   // applied at <= 768px breakpoint
```

Used for: decorative 220px icons (Expertise, Publications), Insights glass panel, Podcast border frame.

---

## Navigation (`nav.component`)

### Changes
- Add hamburger button (3-bar icon, 44×44px hit area) — visible only on mobile
- Hide `.nav-links` and `.nav-actions` on mobile
- Add slide-out drawer component (dark navy `#000f22`, slides from right)
- Drawer contains all 6 nav links + "Contact Dr. Blood" CTA at the bottom
- Scrim overlay (45% black + 2px backdrop-blur) covers the content behind the open drawer

### Drawer behaviour
- Opens on hamburger tap
- Closes on: scrim tap, close button tap (✕), Escape key, route navigation
- `aria-expanded` on hamburger button, `aria-label="Navigation menu"`
- Focus trapped inside open drawer (tab cycles through links → CTA → close button)
- Drawer width: `min(80vw, 280px)` — never full-screen
- Animation: `transform: translateX(100%)` → `translateX(0)`, `250ms ease-out`
- Respects `prefers-reduced-motion` (no transform animation if enabled)
- Active route gets teal dot indicator inside drawer

### Nav bar on mobile
- Logo stays left (Noto Serif, 10px)
- Hamburger right
- Height: `52px`
- Background: `rgba(255,248,240,0.92)` + `backdrop-filter: blur(20px)` (same as desktop, just shorter)
- On pages with dark/cinematic hero (Home, Publications): nav bar uses `rgba(0,15,34,0.75)` background with light text

---

## Home Page (`home.component`)

### Hero (`hero-home.component`)

**Desktop:** `flex` row, 55%/45% split, photo right with floating roles card.  
**Mobile:** Full-bleed cinematic. Photo fills `100dvh`, dark gradient overlay (`linear-gradient(to top, rgba(0,15,34,0.93) 45%, rgba(0,15,34,0.4) 80%, transparent)`). Text and CTAs float at the bottom of the hero.

Specific changes:
- `.hero` switches from `flex` row to a single positioned container with `min-height: 100dvh`
- `hero-photo` becomes a background fill (`position: absolute; inset: 0; object-fit: cover`)
- `.hero-left` content moves to `position: absolute; bottom: 0` with padding
- `.hero-right` becomes `position: absolute; inset: 0; z-index: 0` on mobile. The `.hero-photo` inside gets `width: 100%; height: 100%; object-fit: cover; object-position: top`. No DOM changes — only CSS repositioning.
- `.hero-roles-card` gets `display: none` on mobile
- Nav bar: dark transparent style over the photo
- Headline font size: `clamp(1.75rem, 5vw, 3.5rem)` — already partially handled by existing tokens, verify at 375px
- Role tags: `flex-wrap: wrap` (already set), reduce font size to 8px on mobile
- CTA buttons: stack vertically on `< 400px` if they don't fit inline

### Stats Bar (`stats-bar.component`)

**Desktop:** Flex row, 4 stats inline.  
**Mobile:** Stays 4-across — stat labels are short enough (`140+`, `12K+`, `18yr`, `3`). Reduce `padding` from `40px` side to `16px`. Reduce `stat-num` font size slightly if needed.

### Insights Section (home page)

**Desktop:** `display: flex; gap: 16px` — 3 cards in a row.  
**Mobile:** `flex-direction: column` — cards stack vertically, each full width.

---

## About Page (`about.component`)

### Hero section

**Desktop:** `grid-template-columns: 7fr 5fr`, floating `.about-roles-card` at `bottom: -24px; left: -24px`.  
**Mobile:** Single column. Order: text block → photo → roles card (inline).

Specific changes:
- Grid becomes `grid-template-columns: 1fr`
- `.about-hero-left` and `.about-hero-right` are already in the correct DOM order (text first, photo second) — single-column grid renders them top-to-bottom with no `order` changes needed
- `.about-roles-card` `position: absolute` removed — becomes `position: static`, `width: 100%`, `margin-top: 12px`, within normal flow
- Photo `aspect-ratio: 4/5` on desktop → `aspect-ratio: 4/3` on mobile (less tall, shows more of the hospital scene)

### Affiliations section

**Desktop:** `grid-template-columns: repeat(4, 1fr)`.  
**Mobile:** `grid-template-columns: repeat(2, 1fr)`.

**Logo fix (also applies on desktop):** The current HTML uses `aff.mark` / `aff.short` (text abbreviations) but the TypeScript data model exposes `aff.logo` and `aff.alt`. Update `about.component.html` to use:
```html
<a [href]="aff.href" target="_blank" rel="noopener" class="affiliation-item">
  <img [src]="aff.logo" [alt]="aff.alt" class="aff-logo-img {{ aff.size }}" />
  <span class="aff-label">{{ aff.label }}</span>
</a>
```
Logo image constraints: `max-height: 36px; max-width: 100%; object-fit: contain`.

### Timeline section

No structural changes needed — already single-column. Padding reduction via tokens only.

---

## Expertise Page (`expertise.component`)

### Hero section
- `display: flex; justify-content: space-between` → on mobile, hide the `.hero-icon` (220px decorative Material Symbol). Add class `hide-mobile` to it.
- Text block becomes full width

### Cards section

**Desktop:** `grid-template-columns: 1fr 1fr`.  
**Mobile:** `grid-template-columns: 1fr`.

---

## Publications Page (`publications.component`)

### Hero section
- Dark navy hero, hide the `.pub-hero-icon` (220px decorative icon) on mobile with `.hide-mobile`
- Title font size scales via existing `clamp` token

### Filter chips

**Desktop:** `flex-wrap: wrap`.  
**Mobile:** `overflow-x: auto; flex-wrap: nowrap; -webkit-overflow-scrolling: touch`. Add `scrollbar-width: none` / `::-webkit-scrollbar { display: none }` to hide the scrollbar. This lets chips scroll horizontally without wrapping.

### Publication list

No structural changes — already a single-column list. Padding reduction via tokens.

---

## Insights Page (`insights.component`)

### Hero section

**Desktop:** `grid-template-columns: 1fr 1fr` — title/desc left, glass panel with icon right.  
**Mobile:** Hide `.hero-glass-panel` with `.hide-mobile`. Title and desc go full width.

### Featured card

**Desktop:** `grid-template-columns: 1fr 2fr` — thumb left, body right.  
**Mobile:** `grid-template-columns: 1fr`, `grid-template-rows: auto auto`. Thumbnail stacks on top, body below. Thumbnail height: `180px` on mobile (fixed, not `min-height: 280px`).

---

## Podcast Page (`podcast.component`)

### Hero section

**Desktop:** `grid-template-columns: 7fr 5fr` — text left, image card right.  
**Mobile:** Single column. Text block first, then image card below at `aspect-ratio: 16/9; width: 100%`. The `.image-border-frame` decorative element (`position: absolute; top: -16px; right: -16px`) gets `display: none` on mobile (would overflow viewport).

### Featured Performance card

**Desktop:** `grid-template-columns: 2fr 3fr` — thumbnail left, body right.  
**Mobile:** `grid-template-columns: 1fr`. Thumbnail becomes full-width banner (`aspect-ratio: 16/9`), body drops below. Play button centres over the thumbnail.

### Episode grid

**Desktop:** `grid-template-columns: repeat(3, 1fr)`.  
**Mobile:** `grid-template-columns: 1fr`. Cards stack vertically.

### Guest CTA card (`.podcast-cta-card`)

- `border-radius: 40px` → `16px` on mobile
- `padding: 48px 48px 72px 48px` → `28px 16px` on mobile
- `margin: 0 16px 40px` (respect page padding)
- Background image and gradient retained

---

## Contact Page (`contact.component`)

Minimal changes — the form is already `max-width: 640px` centered.

- Side padding: `40px` → `16px` via token
- Submit button: `align-self: flex-start` → `align-self: stretch; width: 100%` on mobile (full-width button)
- Input height: already `padding: 12px 0` which meets 44px touch target with label above

---

## UX Compliance (UI/UX Pro Max)

| Rule | Requirement | Implementation |
|------|-------------|----------------|
| Touch targets | 44×44px minimum | Hamburger btn, drawer links (min-height: 44px), all CTAs |
| Touch spacing | 8px gap between targets | Drawer link padding + border separators |
| Tap delay | Eliminate 300ms | `touch-action: manipulation` on all interactive elements |
| Contrast | 4.5:1 minimum | Drawer link opacity bumped from 0.55 → 0.70 |
| Animations | 150–300ms, ease-out | Drawer: 250ms ease-out. Respects `prefers-reduced-motion` |
| No horizontal scroll | Content fits viewport | `overflow-x: hidden` on `body`; filter chips use `overflow-x: auto` within their container only |
| Viewport meta | Already set | `width=device-width, initial-scale=1` in `index.html` — verify not disabled |
| Focus management | Trap + restore | Drawer traps focus while open; restores to hamburger on close |
| Accessible nav | ARIA | `aria-expanded`, `aria-label="Navigation menu"`, `role="dialog"` on drawer |
| Reduced motion | Honour preference | All transitions wrapped with `@media (prefers-reduced-motion: reduce)` block already in `styles.scss` — extend to cover drawer |

---

## Files to Modify

| File | Change Type |
|------|-------------|
| `styles.scss` | Add responsive token overrides + `.hide-mobile` utility |
| `nav.component.html` | Add hamburger button + drawer markup |
| `nav.component.ts` | Add `menuOpen` signal, keyboard/click handlers |
| `nav.component.scss` | Hide desktop links on mobile; add drawer styles |
| `hero-home.component.scss` | Cinematic mobile hero |
| `hero-home.component.html` | Restructure for cinematic overlay |
| `home.component.scss` | Stack insights grid |
| `about.component.html` | Logo img fix + inline roles card |
| `about.component.scss` | Grid → single col; roles card static; affiliations 2-col |
| `expertise.component.scss` | Hide icon; cards 1-col |
| `publications.component.scss` | Hide icon; filter chip scroll |
| `insights.component.scss` | Hide glass panel; stack featured card |
| `podcast.component.scss` | Stack hero + featured + episode grid; fix border frame; CTA radius |
| `contact.component.scss` | Padding; submit full-width |
| `stats-bar.component.scss` | Padding reduction only |

---

## Out of Scope

- No changes to desktop layout at `> 768px`
- No dark mode
- No new routes or pages
- No backend / API changes
- No animation overhaul beyond drawer open/close
- Podcast and Insights pages do not yet have real content — stub layouts only
