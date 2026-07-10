# UI/UX remediation — 9-phase plan

**Created:** 2026-07-01  
**Scope:** Marketing site, products funnel, planner workspace + marketing, admin CRM, member portal  
**Source:** UI/UX audit (15 major + 25 other findings)

> **Execution packs (2026-07-01):** This file is the audit summary. Checklists and handover live in:
> - Site: `plans/ui-ux-site-plan/`
> - Planner: `plans/ui-ux-planner-plan/`
> - Admin: `plans/ui-ux-admin-plan/`
> - Tech stack: `plans/tech-stack-generator-7-file-plan/`
>
> Old monolith index: `plans/ui-ux-9-phase-plan/00-start.md` (router only)

## Phase overview

| Phase | Focus | Outcomes | Gate |
|-------|--------|----------|------|
| **1** | Motion + gutters foundation | `home-section` class, mobile CSS hooks, contact/newsletter gutters | Unit + typecheck |
| **2** | Products funnel heroes | Compare + quote-cart heroes; compare dock mobile position | Playwright catalog routes |
| **3** | Marketing dialect cleanup | Showrooms tail; residual `typ-section` bands | Visual spot-check |
| **4** | Planner workspace chrome | Mobile tool access, tokenized dock, offline reduced-motion | Planner chrome tests |
| **5** | Planner marketing parity | `marketing-cta-band` on landing/help/features | Manual `/planner/` |
| **6** | Admin CRM chrome | Embedded hero dedup; demo banner; mobile nav a11y | Admin unit tests |
| **7** | Admin catalog UX | Demo warnings; catalog route clarity (split deferred) | Admin README |
| **8** | Member portal lane | `shell-portal-*` adoption on portal view | Portal unit test |
| **9** | Measurement + regression | Route matrix, extended Playwright, Lighthouse hooks | `release:gate:fast` |

---

## Phase 1 — Motion + gutters foundation

**Goal:** Make homepage interaction contract apply to all `HomeSection` routes.

- Add `home-section` base class to `HomeSection.tsx`
- Fix `mobile.css` selectors (`section-y` not `section-y-md`)
- Remove double horizontal padding on contact (`contact-shell` inside `home-shell-xl`)
- Align `Newsletter` + `Teaser` to `home-shell-xl` gutter contract

**Files:** `HomeSection.tsx`, `mobile.css`, `contact-page.css`, `Newsletter.tsx`, `Teaser.tsx`

---

## Phase 2 — Products funnel heroes

**Goal:** Compare and quote-cart match contact/planning hero rhythm.

- Add `Hero variant="small"` to `/compare` and `/quote-cart`
- Remove `pt-24` / `pt-28` padding hacks
- Raise compare dock on mobile (`bottom-20` → `bottom-4`) to clear thumb zone

**Files:** `compare/page.tsx`, `quote-cart/page.tsx`, `CompareDock.tsx`

---

## Phase 3 — Marketing dialect cleanup

**Goal:** Remove homepage-only legacy blocks from inner routes.

- `/showrooms`: drop `FeaturedCarousel`, `BrandStatement`, `CollaborationSection`, `ClientQuote`
- Replace with `RouteCtaBand` + retained `Teaser` / `ContactTeaser`
- Migrate dark `typ-h2` bands on downloads/sustainability/portfolio (follow-up batch)

**Files:** `showrooms/page.tsx`, route copy as needed

---

## Phase 4 — Planner workspace chrome

**Goal:** Mobile planner reaches all tools; chrome uses design tokens.

- Pass full tool list to `PlannerMobileDock` (remove `slice(0, 5)`)
- Overflow “More tools” sheet grouped by `TOOL_GROUPS`
- Remove `role="toolbar"` from mobile dock; use `pw-mobile-dock` CSS
- Offline banner: `motion-reduce:animate-none`
- Mobile status: show abbreviated status line instead of hiding `.pw-status-detail`

**Files:** `PlannerMobileDock.tsx`, `PlannerWorkspaceContent.tsx`, `planner-responsive.css`, `PlannerWorkspaceLayout.tsx`

---

## Phase 5 — Planner marketing parity

**Goal:** Planner marketing routes use site CTA contract.

- Replace `shell-dark-cta-panel` with `marketing-cta-band` + `home-heading`
- Mark `RouteCtaBand` as client-safe for planner imports
- Add `BreadcrumbList` JSON-LD on `/planner/` (follow-up)

**Files:** `PlannerLandingPage.tsx`, `PlannerHelpPage.tsx`, `PlannerFeaturesHubPage.tsx`, `PlannerFeaturePageView.tsx`, `RouteCtaBand.tsx`

---

## Phase 6 — Admin CRM chrome

**Goal:** Single page header in admin CRM; mobile nav matches site drawer quality.

- Suppress embedded CRM view heroes (`ProjectsView`, `ClientsView`, `QuotesView`)
- Keep primary actions in compact toolbar when embedded
- `CrmDemoBanner` when `NEXT_PUBLIC_CRM_DEMO_MODE=1`
- Admin mobile drawer: focus trap + return focus to toggle

**Files:** CRM views, `AdminLayoutShell.tsx`, `CrmDemoBanner.tsx`

---

## Phase 7 — Admin catalog UX

**Goal:** Clarify demo vs production; reduce catalog manager risk.

- Surface localStorage persistence warning in admin CRM hub
- Document three catalog admin routes in `docs/audit/admin/README.md`
- **Deferred:** split `AdminCatalogManager` (~995 lines) into list/edit/JSON modes

---

## Phase 8 — Member portal lane

**Goal:** Portal matches dashboard/workspace visual system.

- Apply `shell-portal-page`, `shell-portal-panel`, `shell-portal-grid-card` on `PortalPageView`
- Align typography to workspace hub tokens

**Files:** `PortalPageView.tsx`, `portal.css` (import path verify)

---

## Phase 9 — Measurement + regression

**Goal:** Prevent visual and a11y regressions across lanes.

- Regenerate `site-ui/route-matrix.csv` after dialect migrations
- Extend Playwright screenshots: `/showrooms`, `/compare`, mobile PDP
- Add axe baseline for `/contact`, `/products/seating`, `/admin/crm/projects`
- Record Lighthouse mobile/desktop for `/`, `/products`, `/planner/`, `/admin`

**Commands:** `pnpm run test:site-ui`, `pnpm run test:a11y`, `pnpm run release:gate:fast`

---

## Risk register

| Risk | Mitigation |
|------|------------|
| Showrooms content loss after legacy block removal | RouteCtaBand + Teaser retain primary CTAs |
| Mobile dock overcrowding | More-tools sheet + horizontal scroll fallback |
| CRM demo banner noise in production | Gated on `NEXT_PUBLIC_CRM_DEMO_MODE` only |
| Admin catalog split scope creep | Phase 7 documents only; split is separate PR |

---

## Status

| Phase | Status |
|-------|--------|
| 1 | Done — `home-section` class, mobile CSS hooks, contact/newsletter/teaser gutters |
| 2 | Done — compare + quote-cart heroes, compare dock mobile position |
| 3 | Done — showrooms legacy tail replaced with `RouteCtaBand` |
| 4 | Done — mobile dock overflow sheet, tokenized dock CSS, offline reduced-motion |
| 5 | Done — planner marketing `marketing-cta-band` via `RouteCtaBand` |
| 6 | Done — CRM embedded hero dedup, demo banner, admin drawer focus trap |
| 7 | Partial — demo banner documents local-only CRM; catalog split deferred |
| 8 | Done — portal `shell-portal-*` classes |
| 9 | Partial — Playwright routes extended; Lighthouse/axe/full gate still open |

Update this table as phases land; log blockers in `Failures.md`. **Execution:** `plans/ui-ux-site-plan/`, `plans/ui-ux-planner-plan/`, `plans/ui-ux-admin-plan/`.
