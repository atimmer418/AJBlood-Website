# Insights Article Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a standalone article page at `/insights/the-broken-middle` with the full clinical trial eligibility article and wire the "Read Full Insight" button on the insights index to navigate there.

**Architecture:** Flat lazy-loaded route added to `app.routes.ts` — new standalone component at `src/app/pages/insights/article-broken-middle/`. Content hard-coded in the template. No services or data layer. Insights index button swapped from `<button>` to `<a routerLink>`.

**Tech Stack:** Angular 19 standalone components, NgOptimizedImage, RouterLink, Karma/Jasmine

---

### Task 1: Component scaffold, spec, and route

**Files:**
- Create: `frontend/src/app/pages/insights/article-broken-middle/article-broken-middle.component.ts`
- Create: `frontend/src/app/pages/insights/article-broken-middle/article-broken-middle.component.html`
- Create: `frontend/src/app/pages/insights/article-broken-middle/article-broken-middle.component.scss`
- Create: `frontend/src/app/pages/insights/article-broken-middle/article-broken-middle.component.spec.ts`
- Modify: `frontend/src/app/app.routes.ts`

- [ ] **Step 1: Write the failing spec**

Create `frontend/src/app/pages/insights/article-broken-middle/article-broken-middle.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ArticleBrokenMiddleComponent } from './article-broken-middle.component';

describe('ArticleBrokenMiddleComponent', () => {
  let component: ArticleBrokenMiddleComponent;
  let fixture: ComponentFixture<ArticleBrokenMiddleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleBrokenMiddleComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleBrokenMiddleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a breadcrumb link back to insights', () => {
    const el: HTMLElement = fixture.nativeElement;
    const link = el.querySelector('a.breadcrumb-link');
    expect(link?.textContent?.trim()).toBe('Insights');
  });
});
```

- [ ] **Step 2: Run spec — verify it fails (component not found)**

```bash
cd frontend && npx ng test --include='**/article-broken-middle.component.spec.ts' --watch=false
```

Expected: Error — cannot find module `./article-broken-middle.component`.

- [ ] **Step 3: Create the bare component files**

Create `frontend/src/app/pages/insights/article-broken-middle/article-broken-middle.component.ts`:

```typescript
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-article-broken-middle',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './article-broken-middle.component.html',
  styleUrl: './article-broken-middle.component.scss'
})
export class ArticleBrokenMiddleComponent {}
```

Create `frontend/src/app/pages/insights/article-broken-middle/article-broken-middle.component.html`:

```html
<p>placeholder</p>
```

Create `frontend/src/app/pages/insights/article-broken-middle/article-broken-middle.component.scss`:

```scss
// styles added in later tasks
```

- [ ] **Step 4: Run spec — "should create" passes, breadcrumb test fails**

```bash
cd frontend && npx ng test --include='**/article-broken-middle.component.spec.ts' --watch=false
```

Expected: `should create` PASS, `should render a breadcrumb link back to insights` FAIL (element not found in placeholder template).

- [ ] **Step 5: Add the route to `app.routes.ts`**

In `frontend/src/app/app.routes.ts`, add this entry before the wildcard `{ path: '**', redirectTo: '' }`:

```typescript
{
  path: 'insights/the-broken-middle',
  loadComponent: () =>
    import('./pages/insights/article-broken-middle/article-broken-middle.component')
      .then(m => m.ArticleBrokenMiddleComponent),
  title: 'The Broken Middle — Dr. Alexander J. Blood'
},
```

- [ ] **Step 6: Build to verify clean compile**

```bash
cd frontend && npm run build 2>&1 | tail -8
```

Expected: `Application bundle generation complete.` with no errors.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/app/pages/insights/article-broken-middle/ frontend/src/app/app.routes.ts
git commit -m "scaffold article-broken-middle component and route"
```

---

### Task 2: Wire Read Full Insight button on insights index

**Files:**
- Modify: `frontend/src/app/pages/insights/insights.component.html`
- Modify: `frontend/src/app/pages/insights/insights.component.ts`

- [ ] **Step 1: Replace the button with a routerLink anchor**

In `frontend/src/app/pages/insights/insights.component.html`, find:

```html
        <button class="read-btn">
          Read Full Insight
          <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
        </button>
```

Replace with:

```html
        <a routerLink="/insights/the-broken-middle" class="read-btn">
          Read Full Insight
          <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
        </a>
```

- [ ] **Step 2: Add `RouterLink` import to `InsightsComponent`**

Replace the full contents of `frontend/src/app/pages/insights/insights.component.ts` with:

```typescript
import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.scss'
})
export class InsightsComponent {}
```

- [ ] **Step 3: Fix `.read-btn` so it renders correctly as an `<a>` tag**

`<a>` elements don't naturally inherit button display styles. Open `frontend/src/app/pages/insights/insights.component.scss` and append at the bottom:

```scss
a.read-btn {
  display: inline-flex;
  text-decoration: none;
}
```

- [ ] **Step 4: Build to verify**

```bash
cd frontend && npm run build 2>&1 | tail -8
```

Expected: `Application bundle generation complete.` with no errors.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/pages/insights/
git commit -m "wire Read Full Insight button to article route"
```

---

### Task 3: Hero section of article page

**Files:**
- Modify: `frontend/src/app/pages/insights/article-broken-middle/article-broken-middle.component.html`
- Modify: `frontend/src/app/pages/insights/article-broken-middle/article-broken-middle.component.scss`

- [ ] **Step 1: Replace placeholder HTML with the hero**

Replace the full contents of `frontend/src/app/pages/insights/article-broken-middle/article-broken-middle.component.html` with:

```html
<section class="article-hero">
  <div class="radial-glow"></div>
  <div class="hero-inner">
    <nav class="breadcrumb" aria-label="breadcrumb">
      <a routerLink="/insights" class="breadcrumb-link">Insights</a>
      <span class="breadcrumb-sep" aria-hidden="true">/</span>
      <span class="breadcrumb-current">The Broken Middle</span>
    </nav>
    <div class="article-meta">
      <span class="tag">Clinical Trials</span>
      <span class="tag">Patient Recruitment</span>
    </div>
    <h1 class="article-title">
      The Broken Middle: Three Structural Failures in Clinical Trial Eligibility
    </h1>
    <p class="article-date">April 2026</p>
  </div>
</section>
```

- [ ] **Step 2: Replace the SCSS placeholder with hero styles**

Replace the full contents of `frontend/src/app/pages/insights/article-broken-middle/article-broken-middle.component.scss` with:

```scss
.article-hero {
  background: #000f22;
  position: relative;
  overflow: hidden;
  padding: 100px 40px 60px;
}

.radial-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 70% 50%, rgba(0, 106, 97, 0.1), transparent 60%);
  pointer-events: none;
}

.hero-inner {
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 28px;
}

.breadcrumb-link {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #006a61;
  text-decoration: none;

  &:hover { text-decoration: underline; }
}

.breadcrumb-sep {
  font-size: 13px;
  color: rgba(255, 248, 240, 0.3);
}

.breadcrumb-current {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: rgba(255, 248, 240, 0.45);
}

.article-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.tag {
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 3px 10px;
  border-radius: 999px;
  background: rgba(96, 246, 229, 0.15);
  color: #006a61;
}

.article-title {
  font-family: 'Noto Serif', serif;
  font-size: 44px;
  font-weight: 700;
  color: #fff8f0;
  line-height: 1.15;
  margin-bottom: 16px;
  max-width: 800px;
}

.article-date {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: rgba(255, 248, 240, 0.45);
}

@media (max-width: 768px) {
  .article-hero {
    padding: var(--hero-pt) var(--page-px) 40px;
  }

  .article-title {
    font-size: clamp(1.75rem, 7vw, 2.5rem);
  }
}
```

- [ ] **Step 3: Run spec — verify both tests now pass**

```bash
cd frontend && npx ng test --include='**/article-broken-middle.component.spec.ts' --watch=false
```

Expected: `should create` PASS, `should render a breadcrumb link back to insights` PASS.

- [ ] **Step 4: Build to verify**

```bash
cd frontend && npm run build 2>&1 | tail -8
```

Expected: `Application bundle generation complete.` with no errors.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/pages/insights/article-broken-middle/
git commit -m "add hero section to article page"
```

---

### Task 4: Featured image section

**Files:**
- Modify: `frontend/src/app/pages/insights/article-broken-middle/article-broken-middle.component.html`
- Modify: `frontend/src/app/pages/insights/article-broken-middle/article-broken-middle.component.scss`

- [ ] **Step 1: Append image section to the HTML (after `</section>`)**

Open `frontend/src/app/pages/insights/article-broken-middle/article-broken-middle.component.html` and append after the closing `</section>` tag:

```html

<div class="article-image-wrap">
  <img ngSrc="clinical-trial-data" width="2400" height="1600" priority
       alt="Healthcare professional reviewing patient data on a laptop"
       class="article-img" />
  <p class="image-caption">Photo: National Cancer Institute / Unsplash</p>
</div>
```

- [ ] **Step 2: Append image SCSS**

Append to the end of `frontend/src/app/pages/insights/article-broken-middle/article-broken-middle.component.scss`:

```scss

/* ── Featured image ── */
.article-image-wrap {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 40px 0;
}

.article-img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
}

.image-caption {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: #74777e;
  margin-top: 8px;
  text-align: right;
}

@media (max-width: 768px) {
  .article-image-wrap {
    padding: 24px var(--page-px) 0;
  }
}
```

- [ ] **Step 3: Build to verify**

```bash
cd frontend && npm run build 2>&1 | tail -8
```

Expected: `Application bundle generation complete.` with no errors.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/pages/insights/article-broken-middle/
git commit -m "add featured image to article page"
```

---

### Task 5: Full article body

**Files:**
- Modify: `frontend/src/app/pages/insights/article-broken-middle/article-broken-middle.component.html`
- Modify: `frontend/src/app/pages/insights/article-broken-middle/article-broken-middle.component.scss`

- [ ] **Step 1: Append the article body HTML (after the image `</div>`)**

Append to the end of `frontend/src/app/pages/insights/article-broken-middle/article-broken-middle.component.html`:

```html

<article class="article-body">
  <p class="article-deck">
    For decades, the industry has told itself the same story: the bottleneck isn't at the front of the funnel.
    It's in the middle — at the moment when a coordinator sits down with a list of potential patients and tries
    to figure out who is actually eligible. That step is broken. And it's been broken for structural reasons
    that no amount of additional outreach will fix.
  </p>

  <h2 class="section-header">The First Structural Failure: The Data Architecture of Clinical Eligibility</h2>
  <p>
    Roughly 80% of the data relevant to eligibility assessment lives in unstructured clinical text — physician
    notes, discharge summaries, imaging reports, pathology records. Standard screening tools read structured
    data: diagnosis codes, lab values, medication lists. That layer is important, but it captures only a
    fraction of the clinical picture.
  </p>
  <p>
    When a coordinator reviews a potential patient, they are essentially performing manual information retrieval
    across a fragmented record — pulling a note from 18 months ago, cross-referencing it against an imaging
    report, reconciling it with a contraindication buried in a discharge summary. This is not a workflow
    problem. It is a data architecture problem. The tools most sites use were not built to operate on the full
    depth of a patient's clinical history. They were built to query structured fields that happen to be
    machine-readable.
  </p>

  <h2 class="section-header">The Second Structural Failure: Manual Review Doesn't Scale to the Complexity We're Asking of It</h2>
  <p>
    A trained coordinator reviewing eligibility for a Phase III oncology trial might be managing three or four
    active studies simultaneously. For each patient, they are assessing up to 60 inclusion and exclusion
    criteria — many of which require clinical judgment, not just data lookup.
  </p>
  <p>
    The error rate on manual eligibility review is not marginal. Studies have consistently shown that trained
    staff misclassify patients at rates high enough to affect enrollment yield. The problem isn't that
    coordinators aren't skilled. It's that the volume and complexity of the task has exceeded what manual
    processes can reliably handle — particularly as protocol complexity has increased dramatically year over year.
  </p>
  <p>
    The result is a structural tension: the people best equipped to make these determinations accurately are
    the same people being asked to make them at a pace and volume that makes accuracy impossible to sustain.
  </p>

  <h2 class="section-header">The Third Structural Failure: The Criteria Problem No One Talks About</h2>
  <p>
    Inclusion and exclusion criteria for a clinical trial are written 12 to 18 months before the trial opens
    to enrollment. By the time coordinators are actively screening patients, the protocol reflects what a
    medical writer and clinical team thought the standard of care, lab normal ranges, and comorbidity landscape
    looked like well over a year ago.
  </p>
  <p>
    Clinical practice doesn't wait for your protocol to catch up. What constitutes "standard of care" in a
    particular indication shifts. Diagnostic thresholds get revised. Guidelines are updated. Comorbidity
    patterns evolve. New therapies enter the market. And yet the eligibility criteria remain static — a
    snapshot of clinical reality from before the trial began. Coordinators are screening in real time against
    criteria written in the past.
  </p>
  <p>
    This isn't a minor technical issue. It contributes materially to screen failure rates in indications where
    treatment patterns evolve quickly — which increasingly describes most of cardiometabolic, oncology,
    immunology, and CNS.
  </p>

  <h2 class="section-header">The Reframe</h2>
  <p>
    None of these three failures will be solved by hiring more patient recruitment coordinators or running
    better patient-facing campaigns. They are upstream, structural, and engrained in the people and processes
    that are difficult to change. The industry conflates "we need more patients" with "we need to find more
    patients" — but the actual failure is often happening after a patient has already been identified.
  </p>
  <p>
    The patients are there. The problem is that the system we use to determine who among them is eligible was
    not built to handle the data environments and protocol complexity of modern clinical trials.
  </p>
  <p>
    What does it look like to treat this as an infrastructure problem rather than a headcount problem?
  </p>

  <p class="article-hashtags">#ClinicalTrials #PatientRecruitment #ClinicalOps</p>
</article>
```

- [ ] **Step 2: Append article body SCSS**

Append to the end of `frontend/src/app/pages/insights/article-broken-middle/article-broken-middle.component.scss`:

```scss

/* ── Article body ── */
.article-body {
  max-width: 720px;
  margin: 60px auto;
  padding: 0 40px;
}

.article-deck {
  font-family: 'Inter', sans-serif;
  font-size: 17px;
  line-height: 1.75;
  color: #5c6370;
  margin-bottom: 0;
  padding-bottom: 48px;
  border-bottom: 1px solid rgba(0, 106, 97, 0.12);
}

.section-header {
  font-family: 'Noto Serif', serif;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  font-variant: small-caps;
  letter-spacing: 0.12em;
  color: #006a61;
  border-top: 1px solid rgba(0, 106, 97, 0.25);
  padding-top: 32px;
  margin-top: 48px;
  margin-bottom: 20px;
}

.article-body p {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  line-height: 1.75;
  color: #43474d;
  margin-bottom: 1.25em;
}

.article-hashtags {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #006a61;
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid rgba(0, 106, 97, 0.15);
  margin-bottom: 80px;
}

@media (max-width: 768px) {
  .article-body {
    padding: 0 var(--page-px);
    margin: 40px auto;
  }
}
```

- [ ] **Step 3: Build to verify**

```bash
cd frontend && npm run build 2>&1 | tail -8
```

Expected: `Application bundle generation complete.` with no errors.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/pages/insights/article-broken-middle/
git commit -m "add full article body to article page"
```
