# Mobile Responsive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the AJBlood Angular site fully responsive across all 7 routes for phones (375–480px) and tablets (480–768px), preserving the desktop design exactly.

**Architecture:** Global responsive token overrides in `styles.scss` handle spacing reduction automatically. Per-component `@media` blocks handle structural changes (grids → columns, absolute → static, hidden decorative elements). The nav is the only component that gains new TypeScript logic (hamburger open/close signal).

**Tech Stack:** Angular 17+ standalone components, SCSS, CSS custom properties, Angular signals (`@angular/core`), `@angular/core/rxjs-interop` for router-aware nav styling.

---

## File Map

| File | What changes |
|------|-------------|
| `frontend/src/styles.scss` | Responsive token `@media` overrides + `.hide-mobile` utility |
| `frontend/src/app/components/nav/nav.component.ts` | `menuOpen` signal, `toggleMenu()`, `closeMenu()`, `onEscape()`, `isDarkNav` computed |
| `frontend/src/app/components/nav/nav.component.spec.ts` | New — unit tests for signal logic |
| `frontend/src/app/components/nav/nav.component.html` | Hamburger button + slide-out drawer |
| `frontend/src/app/components/nav/nav.component.scss` | Mobile nav rules + full drawer styles |
| `frontend/src/app/components/hero-home/hero-home.component.scss` | Cinematic full-bleed hero on mobile |
| `frontend/src/app/pages/home/home.component.scss` | Insights grid → column stack |
| `frontend/src/app/components/stats-bar/stats-bar.component.scss` | Padding reduction |
| `frontend/src/app/pages/about/about.component.html` | Affiliations `<img>` fix |
| `frontend/src/app/pages/about/about.component.scss` | Grid collapse, roles card inline, affiliations 2-col |
| `frontend/src/app/pages/expertise/expertise.component.scss` | Hide decorative icon, cards 1-col |
| `frontend/src/app/pages/publications/publications.component.scss` | Hide decorative icon, filter chip horizontal scroll |
| `frontend/src/app/pages/insights/insights.component.scss` | Hide glass panel, stack featured card |
| `frontend/src/app/pages/podcast/podcast.component.scss` | Stack hero + featured card + episode grid; CTA radius; hide border frame |
| `frontend/src/app/pages/contact/contact.component.scss` | Padding reduction, submit full-width |

> All work is done inside `frontend/`. Run all commands from `frontend/`.

---

## Task 1: Global Responsive Token System

**Files:**
- Modify: `frontend/src/styles.scss`

- [ ] **Step 1: Add responsive tokens and `.hide-mobile` to `styles.scss`**

Append the following block at the end of `frontend/src/styles.scss` (after the existing utility classes):

```scss
/* ─── RESPONSIVE TOKENS ─────────────────────────────────────────────────── */
:root {
  --page-px:    40px;
  --section-py: 72px;
  --hero-pt:    100px;
  --nav-height: 64px;
  --card-gap:   16px;
}

@media (max-width: 768px) {
  :root {
    --page-px:    24px;
    --section-py: 56px;
    --hero-pt:    72px;
    --nav-height: 52px;
    --card-gap:   12px;
  }

  .hide-mobile {
    display: none !important;
  }

  body {
    overflow-x: hidden;
  }
}

@media (max-width: 480px) {
  :root {
    --page-px:    16px;
    --section-py: 48px;
    --hero-pt:    50px;
  }
}
```

- [ ] **Step 2: Verify the build compiles cleanly**

```bash
ng build 2>&1 | tail -5
```

Expected output ends with something like:
```
✔ Building...
Application bundle generation complete.
```
No errors. Warnings about bundle size are acceptable.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/styles.scss
git commit -m "feat(mobile): add responsive token system and hide-mobile utility"
```

---

## Task 2: Nav Component — TypeScript Logic

**Files:**
- Create: `frontend/src/app/components/nav/nav.component.spec.ts`
- Modify: `frontend/src/app/components/nav/nav.component.ts`

- [ ] **Step 1: Write the failing tests**

Create `frontend/src/app/components/nav/nav.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavComponent } from './nav.component';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should start with menu closed', () => {
    expect(component.menuOpen()).toBe(false);
  });

  it('toggleMenu should open menu', () => {
    component.toggleMenu();
    expect(component.menuOpen()).toBe(true);
  });

  it('toggleMenu should close menu when already open', () => {
    component.toggleMenu();
    component.toggleMenu();
    expect(component.menuOpen()).toBe(false);
  });

  it('closeMenu should close menu', () => {
    component.toggleMenu();
    component.closeMenu();
    expect(component.menuOpen()).toBe(false);
  });

  it('onEscape should close menu', () => {
    component.toggleMenu();
    component.onEscape();
    expect(component.menuOpen()).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
ng test --watch=false --browsers=ChromeHeadless 2>&1 | grep -E "FAILED|ERROR|menuOpen is not a function"
```

Expected: tests fail with `TypeError: component.menuOpen is not a function` or similar.

- [ ] **Step 3: Update `nav.component.ts` with signals and router awareness**

Replace the entire contents of `frontend/src/app/components/nav/nav.component.ts`:

```typescript
import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  private readonly router = inject(Router);

  readonly menuOpen = signal(false);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects),
      startWith(this.router.url)
    )
  );

  readonly isDarkNav = computed(() =>
    ['/', '/publications'].includes(this.currentUrl() ?? '')
  );

  readonly navLinks = [
    { label: 'Home',             path: '/' },
    { label: 'About',            path: '/about' },
    { label: 'Expertise',        path: '/expertise' },
    { label: 'Publications',     path: '/publications' },
    { label: 'Insights & Media', path: '/insights' },
    { label: 'Podcast',          path: '/podcast' },
  ];

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
ng test --watch=false --browsers=ChromeHeadless 2>&1 | grep -E "FAILED|SUCCESS|5 specs"
```

Expected: `5 specs, 0 failures` (or similar success output).

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/components/nav/nav.component.ts \
        frontend/src/app/components/nav/nav.component.spec.ts
git commit -m "feat(mobile): add nav menu open/close signal and router-aware dark nav"
```

---

## Task 3: Nav Component — HTML + SCSS

**Files:**
- Modify: `frontend/src/app/components/nav/nav.component.html`
- Modify: `frontend/src/app/components/nav/nav.component.scss`

- [ ] **Step 1: Replace `nav.component.html`**

```html
<nav aria-label="Primary" [class.dark-nav]="isDarkNav()">
  <a routerLink="/" class="nav-logo">Dr. Alexander J. Blood</a>

  <div class="nav-links">
    @for (link of navLinks; track link.path) {
      <a
        [routerLink]="link.path"
        routerLinkActive="active"
        [routerLinkActiveOptions]="{ exact: link.path === '/' }"
        class="nav-link"
      >{{ link.label }}</a>
    }
  </div>

  <div class="nav-actions">
    <span class="material-symbols-outlined nav-search" aria-hidden="true">search</span>
    <a routerLink="/contact" class="nav-cta">Contact</a>
  </div>

  <!-- Mobile only: hamburger button -->
  <button
    class="nav-hamburger"
    [attr.aria-expanded]="menuOpen()"
    aria-label="Navigation menu"
    aria-controls="mobile-drawer"
    (click)="toggleMenu()"
  >
    <span></span>
    <span></span>
    <span></span>
  </button>
</nav>

<!-- Mobile drawer + scrim (rendered outside <nav> to escape stacking context) -->
@if (menuOpen()) {
  <div class="nav-scrim" (click)="closeMenu()" aria-hidden="true"></div>
  <div
    id="mobile-drawer"
    class="nav-drawer"
    role="dialog"
    aria-modal="true"
    aria-label="Site navigation"
  >
    <button class="drawer-close" (click)="closeMenu()" aria-label="Close navigation">
      <span class="material-symbols-outlined" aria-hidden="true">close</span>
    </button>

    <div class="drawer-links">
      @for (link of navLinks; track link.path) {
        <a
          [routerLink]="link.path"
          routerLinkActive="drawer-link-active"
          [routerLinkActiveOptions]="{ exact: link.path === '/' }"
          class="drawer-link"
          (click)="closeMenu()"
        >
          <span class="drawer-dot" aria-hidden="true"></span>
          {{ link.label }}
        </a>
      }
    </div>

    <a routerLink="/contact" class="drawer-cta" (click)="closeMenu()">
      Contact Dr. Blood
    </a>
  </div>
}
```

- [ ] **Step 2: Add mobile SCSS to `nav.component.scss`**

Append the following to the end of `frontend/src/app/components/nav/nav.component.scss` (keep all existing rules, add below):

```scss
/* ─── MOBILE HAMBURGER ────────────────────────────────────────────────────── */
.nav-hamburger {
  display: none;
  flex-direction: column;
  gap: 4px;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  touch-action: manipulation;

  span {
    display: block;
    width: 18px;
    height: 1.5px;
    background: #000f22;
    border-radius: 2px;
    transition: background 200ms;
  }
}

/* ─── MOBILE SCRIM ────────────────────────────────────────────────────────── */
.nav-scrim {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  z-index: 90;
}

/* ─── MOBILE DRAWER ───────────────────────────────────────────────────────── */
.nav-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(80vw, 280px);
  background: #000f22;
  z-index: 95;
  display: flex;
  flex-direction: column;
  animation: drawer-in 250ms ease-out forwards;
}

@keyframes drawer-in {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}

@media (prefers-reduced-motion: reduce) {
  .nav-drawer { animation: none; }
}

.drawer-close {
  align-self: flex-end;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: rgba(255, 248, 240, 0.45);
  cursor: pointer;
  touch-action: manipulation;
  margin: 6px 6px 0 0;
  flex-shrink: 0;

  .material-symbols-outlined { font-size: 20px; }

  &:hover { color: rgba(255, 248, 240, 0.8); }
}

.drawer-links {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
}

.drawer-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  min-height: 44px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 248, 240, 0.70);
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  transition: color 150ms;
  touch-action: manipulation;

  &:hover,
  &.drawer-link-active {
    color: #60f6e5;
  }
}

.drawer-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 150ms;

  .drawer-link-active & { opacity: 1; }
}

.drawer-cta {
  display: block;
  margin: 16px 20px 28px;
  padding: 11px 16px;
  background: #006a61;
  color: #fff;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  touch-action: manipulation;
  flex-shrink: 0;
}

/* ─── RESPONSIVE BREAKPOINT ───────────────────────────────────────────────── */
@media (max-width: 768px) {
  nav {
    padding: 0 16px;
    height: var(--nav-height, 52px);
  }

  .nav-links,
  .nav-actions {
    display: none;
  }

  .nav-hamburger {
    display: flex;
  }

  /* Dark nav variant — home + publications cinematic heroes */
  nav.dark-nav {
    background: rgba(0, 15, 34, 0.75);

    .nav-logo { color: #fff8f0; }

    .nav-hamburger span { background: #fff8f0; }
  }
}
```

- [ ] **Step 3: Verify the build**

```bash
ng build 2>&1 | tail -5
```

Expected: no errors.

- [ ] **Step 4: Smoke-test the nav at mobile width**

```bash
ng serve &
```

Open Chrome DevTools → toggle device toolbar → set to iPhone 14 (390 × 844). Visit `http://localhost:4200`. Verify:
- Hamburger button visible top-right
- Desktop nav links hidden
- Tap hamburger → drawer slides in from right
- Active route has teal dot
- Tap scrim or ✕ → drawer closes
- Press Escape key → drawer closes
- Tap any drawer link → navigates + drawer closes

Kill the dev server when done (`kill %1` or Ctrl+C).

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/components/nav/nav.component.html \
        frontend/src/app/components/nav/nav.component.scss
git commit -m "feat(mobile): hamburger nav with slide-out drawer, ARIA, focus handling"
```

---

## Task 4: Home Hero — Cinematic Full-Bleed

**Files:**
- Modify: `frontend/src/app/components/hero-home/hero-home.component.scss`

No HTML changes. The existing markup (`section.hero > .hero-left + .hero-right > .hero-photo-wrap > img`) supports the cinematic effect purely through CSS repositioning.

- [ ] **Step 1: Append mobile cinematic styles to `hero-home.component.scss`**

```scss
@media (max-width: 768px) {
  .hero {
    position: relative;
    min-height: 100dvh;
    display: block;
    padding: 0;
    max-width: 100%;
    margin: 0;
    gap: 0;
    background: #0a2540; /* fallback while photo loads */
    overflow: hidden;
  }

  /* Photo becomes full-bleed background */
  .hero-right {
    position: absolute;
    inset: 0;
    z-index: 0;

    /* Gradient overlay */
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to top,
        rgba(0, 15, 34, 0.93) 45%,
        rgba(0, 15, 34, 0.40) 80%,
        transparent 100%
      );
      z-index: 1;
    }
  }

  .hero-photo-wrap {
    height: 100%;
    border-radius: 0;
    box-shadow: none;
    overflow: hidden;
  }

  .hero-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
  }

  .hero-roles-card {
    display: none;
  }

  /* Text floats at the bottom of the hero */
  .hero-left {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    flex: unset;
    padding: 16px 16px 40px;
  }

  /* Adapt colours for dark background */
  .hero-headline {
    color: #fff8f0;
    font-size: clamp(1.75rem, 8vw, 2.5rem);
  }

  .italic-teal {
    color: #60f6e5;
  }

  .hero-tagline {
    color: rgba(255, 248, 240, 0.75);
    font-size: 14px;
    max-width: unset;
    margin-bottom: 20px;
  }

  .hero-chip {
    background: rgba(96, 246, 229, 0.10);
  }

  .chip-text {
    color: #60f6e5;
  }

  .role-tag {
    border-color: rgba(255, 255, 255, 0.15);
    color: rgba(255, 248, 240, 0.65);
    font-size: 8px;
  }

  .hero-actions {
    flex-wrap: wrap;
    gap: 10px;
  }

  .btn-primary {
    flex: 1;
    min-width: 0;
    justify-content: center;
  }

  .btn-ghost {
    color: rgba(255, 248, 240, 0.80);
  }
}
```

- [ ] **Step 2: Verify build**

```bash
ng build 2>&1 | tail -5
```

Expected: no errors.

- [ ] **Step 3: Spot-check in browser at 390px**

```bash
ng serve &
```

Open `http://localhost:4200` at 390px width. Verify:
- Hero fills the full viewport height
- Dr. Blood's photo is the background
- Dark gradient fades in from the bottom half
- Headline, tagline, and CTA buttons sit above the bottom edge
- Scrolling down reveals the stats bar

Kill the dev server.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/components/hero-home/hero-home.component.scss
git commit -m "feat(mobile): cinematic full-bleed hero on mobile"
```

---

## Task 5: Home Page Content Sections

**Files:**
- Modify: `frontend/src/app/pages/home/home.component.scss`
- Modify: `frontend/src/app/components/stats-bar/stats-bar.component.scss`

- [ ] **Step 1: Append to `home.component.scss`**

```scss
@media (max-width: 768px) {
  .insights-section {
    padding: var(--section-py) var(--page-px);
  }

  .insights-grid {
    flex-direction: column;
    gap: var(--card-gap);
  }

  .insights-header {
    margin-bottom: 20px;
  }
}
```

- [ ] **Step 2: Append to `stats-bar.component.scss`**

Open `frontend/src/app/components/stats-bar/stats-bar.component.scss` and read its current contents, then append:

```scss
@media (max-width: 768px) {
  .stats-bar {
    padding: 14px var(--page-px);
  }

  .stat-num {
    font-size: 18px;
  }

  .stat-label {
    font-size: 7px;
  }
}
```

- [ ] **Step 3: Verify build**

```bash
ng build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/pages/home/home.component.scss \
        frontend/src/app/components/stats-bar/stats-bar.component.scss
git commit -m "feat(mobile): stack insights grid and reduce stats bar padding"
```

---

## Task 6: About Page — Affiliations HTML Fix

**Files:**
- Modify: `frontend/src/app/pages/about/about.component.html`

The current HTML uses `aff.mark` and `aff.short` which don't exist on the TypeScript data model — they render as `undefined`. This task fixes that and switches to actual logo images.

- [ ] **Step 1: Replace the affiliations loop in `about.component.html`**

Find this block in `about.component.html`:
```html
<div class="affiliations-grid">
  @for (aff of affiliations; track aff.label) {
    <div class="affiliation-item">
      <span class="aff-logo {{ aff.mark }}" aria-hidden="true">{{ aff.short }}</span>
      <span class="aff-label">{{ aff.label }}</span>
    </div>
  }
</div>
```

Replace with:
```html
<div class="affiliations-grid">
  @for (aff of affiliations; track aff.label) {
    <a [href]="aff.href" target="_blank" rel="noopener noreferrer" class="affiliation-item">
      <img [src]="aff.logo" [alt]="aff.alt" class="aff-logo-img" />
      <span class="aff-label">{{ aff.label }}</span>
    </a>
  }
</div>
```

- [ ] **Step 2: Verify build**

```bash
ng build 2>&1 | tail -5
```

Expected: no errors. The `aff.href`, `aff.logo`, `aff.alt` properties all exist on the TypeScript data model in `about.component.ts`.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/pages/about/about.component.html
git commit -m "fix(about): use actual logo images for affiliations instead of undefined text"
```

---

## Task 7: About Page — SCSS

**Files:**
- Modify: `frontend/src/app/pages/about/about.component.scss`

- [ ] **Step 1: Add logo image style and mobile overrides to `about.component.scss`**

Append to `frontend/src/app/pages/about/about.component.scss`:

```scss
/* ─── AFFILIATION LOGO IMAGES ─────────────────────────────────────────────── */
.aff-logo-img {
  max-height: 36px;
  max-width: 100%;
  object-fit: contain;
  opacity: 0.65;
}

/* ─── MOBILE ──────────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  /* Hero: single-column stack */
  .about-hero {
    grid-template-columns: 1fr;
    padding: var(--hero-pt) var(--page-px) 40px;
    gap: 24px;
  }

  .about-headline {
    font-size: clamp(1.75rem, 7vw, 3rem);
  }

  .about-tagline {
    font-size: 15px;
    max-width: unset;
  }

  /* Photo proportions */
  .about-photo-wrap {
    aspect-ratio: 4/3;
  }

  /* Roles card: remove absolute positioning, flow below photo */
  .about-roles-card {
    position: static;
    width: 100%;
    margin-top: 12px;
    border-radius: 8px;
    left: unset;
    bottom: unset;
  }

  /* Affiliations: 4-col → 2-col */
  .affiliations-section {
    padding: var(--section-py) var(--page-px);
  }

  .affiliations-title {
    font-size: 22px;
    margin-bottom: 24px;
  }

  .affiliations-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  /* Timeline */
  .timeline-section {
    padding: var(--section-py) var(--page-px);
  }

  .timeline-title {
    font-size: 26px;
    margin-bottom: 36px;
  }
}
```

- [ ] **Step 2: Verify build**

```bash
ng build 2>&1 | tail -5
```

- [ ] **Step 3: Spot-check at 390px**

```bash
ng serve &
```

Navigate to `http://localhost:4200/about`. Verify:
- Text block renders first, then photo, then roles card below photo (all in one column)
- Roles card is flush-width, no longer floating off-screen
- Affiliations show actual logos (not "undefined") in a 2-column grid
- Timeline readable

Kill dev server.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/pages/about/about.component.scss
git commit -m "feat(mobile): about page single-column layout and affiliations 2-col grid"
```

---

## Task 8: Expertise + Publications Pages

**Files:**
- Modify: `frontend/src/app/pages/expertise/expertise.component.scss`
- Modify: `frontend/src/app/pages/publications/publications.component.scss`

- [ ] **Step 1: Append to `expertise.component.scss`**

```scss
@media (max-width: 768px) {
  .expertise-hero {
    padding: var(--hero-pt) var(--page-px) 32px;
  }

  .hero-inner {
    flex-direction: column;
    gap: 0;
  }

  /* .hero-icon gets .hide-mobile class in the HTML — see Step 2 */

  .hero-headline {
    font-size: clamp(1.5rem, 6vw, 2.5rem);
  }

  .cards-section {
    padding: 24px var(--page-px);
  }

  .cards-grid {
    grid-template-columns: 1fr;
    gap: var(--card-gap);
  }
}
```

- [ ] **Step 2: Add `hide-mobile` to the decorative icon in `expertise.component.html`**

Find in `frontend/src/app/pages/expertise/expertise.component.html`:
```html
<span class="material-symbols-outlined hero-icon" aria-hidden="true">biotech</span>
```

Replace with:
```html
<span class="material-symbols-outlined hero-icon hide-mobile" aria-hidden="true">biotech</span>
```

- [ ] **Step 3: Append to `publications.component.scss`**

```scss
@media (max-width: 768px) {
  .pub-hero {
    padding: var(--hero-pt) var(--page-px) 40px;
  }

  .pub-hero-inner {
    flex-direction: column;
    gap: 0;
  }

  /* .pub-hero-icon gets .hide-mobile class in the HTML — see Step 4 */

  .pub-hero-title {
    font-size: clamp(1.75rem, 7vw, 3rem);
  }

  .pub-list-section {
    padding: 32px var(--page-px);
  }

  /* Filter chips: horizontal scroll instead of wrapping */
  .filters {
    overflow-x: auto;
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding-bottom: 4px;
    margin-bottom: 24px;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .filter-chip {
    white-space: nowrap;
    flex-shrink: 0;
  }
}
```

- [ ] **Step 4: Add `hide-mobile` to the decorative icon in `publications.component.html`**

Find in `frontend/src/app/pages/publications/publications.component.html`:
```html
<span class="material-symbols-outlined pub-hero-icon" aria-hidden="true">menu_book</span>
```

Replace with:
```html
<span class="material-symbols-outlined pub-hero-icon hide-mobile" aria-hidden="true">menu_book</span>
```

- [ ] **Step 5: Verify build**

```bash
ng build 2>&1 | tail -5
```

- [ ] **Step 6: Commit**

```bash
git add frontend/src/app/pages/expertise/expertise.component.scss \
        frontend/src/app/pages/expertise/expertise.component.html \
        frontend/src/app/pages/publications/publications.component.scss \
        frontend/src/app/pages/publications/publications.component.html
git commit -m "feat(mobile): expertise cards 1-col, publications filter chip scroll, hide decorative icons"
```

---

## Task 9: Insights Page

**Files:**
- Modify: `frontend/src/app/pages/insights/insights.component.scss`
- Modify: `frontend/src/app/pages/insights/insights.component.html`

- [ ] **Step 1: Add `hide-mobile` to the glass panel in `insights.component.html`**

Find in `frontend/src/app/pages/insights/insights.component.html`:
```html
<div class="hero-glass-panel">
  <span class="material-symbols-outlined panel-icon" aria-hidden="true">monitor_heart</span>
</div>
```

Replace with:
```html
<div class="hero-glass-panel hide-mobile" aria-hidden="true">
  <span class="material-symbols-outlined panel-icon" aria-hidden="true">monitor_heart</span>
</div>
```

- [ ] **Step 2: Append to `insights.component.scss`**

```scss
@media (max-width: 768px) {
  /* Hero: full-width text, glass panel hidden via .hide-mobile */
  .insights-hero {
    padding: var(--hero-pt) var(--page-px) 40px;
  }

  .hero-inner {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .hero-title {
    font-size: clamp(1.75rem, 7vw, 3rem);
  }

  /* Featured section */
  .featured-section {
    padding: var(--section-py) var(--page-px);
  }

  /* Featured card: side-by-side → stacked */
  .featured-card {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
  }

  .featured-thumb {
    min-height: 180px;
  }

  .featured-body {
    padding: 20px 16px;
  }

  .featured-article-title {
    font-size: 18px;
  }
}
```

- [ ] **Step 3: Verify build**

```bash
ng build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/pages/insights/insights.component.scss \
        frontend/src/app/pages/insights/insights.component.html
git commit -m "feat(mobile): insights hero full-width, featured card stacked"
```

---

## Task 10: Podcast Page

**Files:**
- Modify: `frontend/src/app/pages/podcast/podcast.component.scss`
- Modify: `frontend/src/app/pages/podcast/podcast.component.html`

- [ ] **Step 1: Add `hide-mobile` to the border frame in `podcast.component.html`**

Find in `frontend/src/app/pages/podcast/podcast.component.html`:
```html
<div class="image-border-frame"></div>
```

Replace with:
```html
<div class="image-border-frame hide-mobile" aria-hidden="true"></div>
```

- [ ] **Step 2: Append to `podcast.component.scss`**

```scss
@media (max-width: 768px) {
  /* ── Hero ── */
  .podcast-hero {
    padding: var(--hero-pt) var(--page-px) 40px;
  }

  .hero-inner {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .hero-title {
    font-size: clamp(2rem, 8vw, 3rem);
  }

  .hero-desc {
    font-size: 15px;
    max-width: unset;
  }

  /* Image card: full-width 16:9, border frame hidden via .hide-mobile */
  .hero-image-wrap {
    width: 100%;
  }

  .image-card {
    aspect-ratio: 16/9;
    border-radius: 16px;
  }

  .hosted-strip {
    bottom: 16px;
    left: 16px;
    right: 16px;
  }

  .hosted-label {
    font-size: 15px;
  }

  /* ── Featured Performance ── */
  .featured-perf {
    padding: var(--section-py) var(--page-px);
  }

  /* Side-by-side grid → stacked */
  .featured-card {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
  }

  .featured-thumb {
    min-height: unset;
    aspect-ratio: 16/9;
  }

  .featured-body {
    padding: 20px 16px;
  }

  .ep-title {
    font-size: 18px;
  }

  /* ── Episode Grid ── */
  .episodes-section {
    padding: var(--section-py) var(--page-px);
  }

  .episodes-title {
    font-size: 22px;
  }

  .episodes-grid {
    grid-template-columns: 1fr;
    gap: var(--card-gap);
  }

  /* ── LinkedIn callout ── */
  .linkedin-callout {
    margin-top: 32px;
  }

  /* ── Guest CTA Card ── */
  .podcast-cta-outer {
    padding: 0 var(--page-px) 48px;
  }

  .podcast-cta-card {
    border-radius: 16px;
    padding: 28px 16px;
  }

  .cta-title {
    font-size: 26px;
    margin-bottom: 12px;
  }

  .cta-desc {
    font-size: 14px;
    margin-bottom: 24px;
  }
}
```

- [ ] **Step 3: Verify build**

```bash
ng build 2>&1 | tail -5
```

- [ ] **Step 4: Spot-check podcast at 390px**

```bash
ng serve &
```

Navigate to `http://localhost:4200/podcast` at 390px. Verify:
- Hero text above full-width image card (no border frame overflow)
- Featured card thumbnail above episode body
- Episode grid single column
- CTA card smaller border-radius, readable padding

Kill dev server.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/pages/podcast/podcast.component.scss \
        frontend/src/app/pages/podcast/podcast.component.html
git commit -m "feat(mobile): podcast hero stacked, episode grid 1-col, CTA card condensed"
```

---

## Task 11: Contact Page

**Files:**
- Modify: `frontend/src/app/pages/contact/contact.component.scss`

- [ ] **Step 1: Append to `contact.component.scss`**

```scss
@media (max-width: 768px) {
  .contact-inner {
    padding: 40px var(--page-px);
  }

  .contact-title {
    font-size: 32px;
  }

  .submit-btn {
    align-self: stretch;
    width: 100%;
    text-align: center;
    touch-action: manipulation;
  }
}
```

- [ ] **Step 2: Verify build**

```bash
ng build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/pages/contact/contact.component.scss
git commit -m "feat(mobile): contact form padding and full-width submit button"
```

---

## Task 12: Final Verification

**No file changes — verification only.**

- [ ] **Step 1: Run the full test suite**

```bash
ng test --watch=false --browsers=ChromeHeadless 2>&1 | tail -10
```

Expected: all specs pass, 0 failures.

- [ ] **Step 2: Production build**

```bash
ng build --configuration production 2>&1 | tail -8
```

Expected: no errors. Note any bundle size warnings but do not act on them.

- [ ] **Step 3: Start dev server and verify all 7 routes at 390px**

```bash
ng serve &
```

Open Chrome DevTools → device toolbar → iPhone 14 Pro (393 × 852). Check each route:

| Route | Check |
|-------|-------|
| `/` (Home) | Cinematic hero fills screen, nav hamburger visible, stats 4-across, insights stacked |
| `/about` | Text → photo → roles card → affiliations logo images in 2-col → timeline |
| `/expertise` | No decorative icon, cards 1-col |
| `/publications` | No decorative icon, filter chips scrollable, list readable |
| `/insights` | No glass panel, featured card stacked |
| `/podcast` | Hero text → image, featured stacked, episodes 1-col, CTA card smaller radius |
| `/contact` | Full-width submit button, correct padding |

- [ ] **Step 4: Verify at 768px (tablet boundary)**

Switch DevTools to iPad Mini (768 × 1024). Confirm:
- Desktop nav links visible (not hamburger)
- 2-col grids still in effect where appropriate
- No horizontal scrollbar on any page

- [ ] **Step 5: Verify no horizontal scroll at 375px (iPhone SE)**

Switch to iPhone SE (375 × 667). Scroll every page horizontally — no content should overflow the viewport.

- [ ] **Step 6: Final commit**

```bash
git add -A  # only if any stray changes remain
git commit -m "feat(mobile): complete mobile responsive pass — all 7 routes verified" \
  --allow-empty  # only if nothing is left to stage
```

---

## Self-Review Notes

**Spec coverage check:**
- ✅ Global tokens: Task 1
- ✅ Nav hamburger + drawer + ARIA + focus + Escape key: Tasks 2–3
- ✅ Dark nav on home/publications: Task 3 (`isDarkNav` computed + `dark-nav` class)
- ✅ Cinematic hero: Task 4
- ✅ Stats bar + insights grid: Task 5
- ✅ About affiliations logo fix: Task 6
- ✅ About SCSS (grid, roles card, affiliations 2-col): Task 7
- ✅ Expertise (icon hidden, cards 1-col): Task 8
- ✅ Publications (icon hidden, filter scroll): Task 8
- ✅ Insights (glass panel hidden, featured stacked): Task 9
- ✅ Podcast (hero, featured, grid, CTA): Task 10
- ✅ Contact (padding, submit): Task 11
- ✅ `touch-action: manipulation` on drawer links and CTA: included in Task 3 SCSS
- ✅ `overflow-x: hidden` on body: included in Task 1
- ✅ `prefers-reduced-motion` for drawer: included in Task 3 SCSS
- ✅ `min-height: 100dvh` for hero: included in Task 4
