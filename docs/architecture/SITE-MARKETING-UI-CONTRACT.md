# Site marketing UI contract

> **⏸ DEFERRED — UI-3 only.** Do not prioritize marketing dialect migration ahead of **1A** (`/planner/open3d`) or **1B** (SVG publish). This doc is **reference** for future marketing work.

**Status:** Reference (execution priority **UI-3** — post-1A)  
**Authority:** `plann/00-REVISION.md` → `plann/06-UI-PLAN.md` → [`MODULE-UI-CONTRACT.md`](MODULE-UI-CONTRACT.md) → **this file**  
**Index:** [`README.md`](README.md) · [`docs/Lockedfiles/INDEX.md`](../Lockedfiles/INDEX.md)  
**Placement:** [`MODULE-LAYOUT.md`](MODULE-LAYOUT.md) — marketing UI in `components/`, not `features/planner/open3d/`  
**Locked baseline:** [`docs/Lockedfiles/architecture/current.md`](../Lockedfiles/architecture/current.md) · [`proposed.md`](../Lockedfiles/architecture/proposed.md)

**Source of truth:** homepage (`/`) for visual language; `app/(site)/solutions/page.tsx` for inner-page structure.

**Matrix:** `results/site-ui/route-matrix.csv` (regenerate: `node site/scripts/generate-site-ui-route-matrix.mjs`).

**Primitives (Phase 2b):** `@/components/home/layout` — `HomeMarketingLayout`, `HomeSection`, `HomeSectionInner`.

---

## Current vs proposed

| Area | Current | Proposed (UI-3) |
|------|---------|-----------------|
| Outer shell | Mostly `HomeMarketingLayout` on `(site)` routes | Complete dialect cleanup |
| Section titles | Mix of `home-heading` and `typ-section` | `home-heading` canonical |
| Legacy `scheme-page` | Few remaining routes | Migrate to solutions-like template |
| Enforcement | `check:site-ui:dialect` warn | `SITE_UI_DIALECT_MODE=error` at Phase 10 |
| Token reuse | Independent marketing palette | Reuse semantic tokens only; no new palette |

**Not in scope for 1A/1B:** marketing rewrite, cross-surface UI sprint, Option F design system.

---

## Homepage section inventory (`/`)

| Order | Block | Component | Section surface |
|------:|-------|-----------|-----------------|
| 1 | Hero carousel | `HomepageHero` | full-bleed hero |
| 2 | Partnership strip | `PartnershipBanner` | `home-section--*` family |
| 3 | Collections grid | `Collections` | white / soft alternation |
| 4 | Trust KPIs | `TrustStrip` | soft band |
| 5 | Interactive tools | `InteractiveTools` | white |
| 6 | Why choose us | `WhyChooseUs` | `home-section--white` + `home-shell-xl` |
| 7 | Showcase carousel | `ShowcaseCarousel` | `home-section--*` |
| 8 | Contact footer | `ContactTeaser` | shared footer block |

Copy for homepage blocks: `lib/site-data/homepage.ts`.

---

## Canonical page anatomy

```tsx
<HomeMarketingLayout>
  {/* `/` only: <HomepageHero /> */}
  {/* Subpages: <Hero variant="small" | "default" | "cinema" /> */}
  <HomeSection variant="white" | "soft" | "sand">
    <HomeSectionInner>{/* content */}</HomeSectionInner>
  </HomeSection>
  <ContactTeaser /> {/* optional */}
</HomeMarketingLayout>
```

**Outer wrapper:** `min-h-screen overflow-x-hidden` via `HomeMarketingLayout`.

**Not canonical (remove on marketing routes):**

```tsx
<section className="scheme-page flex min-h-screen flex-col items-center">
```

Legacy `container px-6 2xl:px-0` section shells → `HomeSection` + `HomeSectionInner`.

---

## Typography

| Use | Class |
|-----|--------|
| Section titles | `home-heading` |
| Kickers | `typ-label` |
| Accent words in titles | `text-accent-italic` (light sections) / `text-accent-italic-on-dark` (hero) |
| Body | `page-copy` |

**Demote on marketing routes:** `typ-section` as default section title — homepage inner template uses `home-heading`.

---

## Surfaces

| Use | Class |
|-----|--------|
| Section backgrounds | `home-section--white`, `home-section--soft`, `home-section--sand` |
| Inner width | `home-shell-xl` (`HomeSectionInner`) |
| Cards / media | `ShowcaseCarousel`, `Collections`, `home-frame` patterns from `/` and `/solutions` |

Map legacy `shell-card` / `scheme-panel` marketing grids to home-section content over time. Legal dense layouts may retain `shell-card` **inside** `HomeSection` until copy migration (Phase 4).

---

## Shell components

| Shell | Routes | Notes |
|-------|--------|-------|
| `HomeMarketingLayout` | All `(site)` marketing pages | `data-testid="home-marketing-layout"` |
| `SiteWorkspaceShell` | access, choose-product, dashboard | Phase 6 — homepage tokens, not full marketing layout |
| `HomeCatalogLayout` | `/products/*`, `/compare`, `/quote-cart` | `HomeMarketingLayout` + white section band + header offset |
| `SiteErrorShell` | offline, not-found | unchanged |

---

## Heroes

| Route | Component | Variant |
|-------|-----------|---------|
| `/` | `HomepageHero` | carousel — do not change in this pack |
| Subpages | `Hero` | `small` (legal, about), `default`, `cinema` — **match `/solutions` styling** |

No `SiteHero` merge in this pack.

---

## Inner-page template (`/solutions`)

1. `HomeMarketingLayout` outer
2. `Hero variant="small"` + hero image
3. `HomeSection` (`white` / `soft`, `borderY` on sandwiched soft bands)
4. `HomeSectionInner` → `home-shell-xl`
5. `home-heading` + `typ-label` + `page-copy`
6. `ContactTeaser` footer

Legal pages (`/privacy`, `/terms`, `/imprint`, `/refund-and-return-policy`) follow the same **outer** template; inner content may still use aside panels until Phase 4 copy migration.

---

## CSS

- **Canonical utilities:** `home-*` in `app/css/core/site/routes/home/` and `bundles/site-marketing.css`
- **Retire over time:** `contact-shell` as primary layout; legal-only modifiers folded into `HomeSection`
- **Do not** rename `home-section--*` to `surface-section-*`

See [`CSS-SOLUTION.md`](CSS-SOLUTION.md) for folder ownership.

---

## Matrix mapping (Phase 1)

| `dialect` | Target |
|-----------|--------|
| `homepage` | `/` only |
| `solutions-like` | `HomeMarketingLayout` + `Hero` + `home-section--*` |
| `scheme-page` | **Migrate** → solutions-like |
| `legal-shell` | **Migrate** outer shell; inner cards phased |
| `workspace` / `catalog-product` | Phases 6–7 |

**Migration backlog (2026-06-30):** Phase 3 complete — `(site)` marketing routes use `HomeMarketingLayout`. Remaining dialect warnings (`typ-section-h2`) tracked by `check:site-ui:dialect` until Phase 10.

---

## RouteChrome matrix (Phase 6)

Rules live in `site/lib/site-data/routeChromeRules.ts`; `RouteChrome.tsx` consumes `resolveRouteChromeMode()`.

| Path pattern | Header | Footer |
|--------------|--------|--------|
| `/login` (no `next` query) | hidden | login-tools (bot + WhatsApp) |
| `/login?next=…`, `/oando-planner/login`, `/buddy-planner/login` | full (when `next` present on `/login`) | login-tools |
| `/access`, `/choose-product`, `/dashboard`, `/portal/*`, `/admin` | hidden | hidden |
| `/planner/canvas`, `/planner/guest`, **`/planner/open3d`**, `/buddy-planner/editor`, `/buddy-planner/t/*`, other CAD prefixes | hidden | hidden |
| `/oando-planner`, `/buddy-planner` (marketing landings) | full | full |
| All other `(site)` marketing routes | full | full (marquee + footer + consent + bot) |

`html lang` on `(site)` layout: `getHtmlLang(locale)` from `site/lib/i18n/htmlLang.ts`.

---

## i18n copy (Phase 4)

| Stage | Scope | Status |
|-------|-------|--------|
| 4a | `en.json` — 20 marketing namespaces + `workspace` | committed via `i18n:sync:marketing` |
| 4b | `hi.json` wave1: home, about, contact, products, solutions | `i18n:sync:hi-wave1` + `check:i18n:parity` |
| 4c | de / es / fr | **deferred** — dated entry in `Failures.md` |

---

## Legacy → homepage mapping (Phase 5)

| Legacy | Homepage replacement |
|--------|---------------------|
| `scheme-page flex min-h-screen flex-col items-center` | `HomeMarketingLayout` |
| `typ-section` (h2 section titles) | `home-heading` |
| `shell-card` marketing stacks | `HomeSection` + homepage card patterns |
| `contact-shell` | `HomeSection` + `home-shell-xl` (contact inner layout phased) |

**Dialect checks:** `check:site-ui:dialect` — `warn` until Phase 10 (`SITE_UI_DIALECT_MODE=error`).

**Inline styles:** `check:site-ui:inline-style` — allowlisted: `Hero.tsx`, `HomeTrustStrip.tsx`, `opengraph-image.tsx`, `ProductViewer.tsx`.

---

## `home-*` utility inventory (Phase 5a)

Defined under `site/app/css/core/site/routes/home/` and loaded via `bundles/site-marketing.css`:

| Utility | Role |
|---------|------|
| `home-section--white` / `--soft` / `--sand` | Section surface bands |
| `home-shell-xl` | Inner max-width container (`HomeSectionInner`) |
| `home-heading` | Canonical section title |
| `home-frame` / `home-frame--standard` | Content frame on inner pages |
| `home-trust-kpi` / `home-trust-kpi--light` | KPI stat cells |
| `home-marketing-layout` | Outer page wrapper (via component) |

No renames in this pack.

---

## Route → template map (marketing)

| Template | Routes |
|----------|--------|
| Homepage reference | `/` |
| Solutions inner | `/solutions`, all marketing pages after Phase 3 |
| Workspace | `/access`, `/dashboard`, `/choose-product` | `SiteWorkspaceShell` |
| Catalog | `/products`, `/catalog`, `/quote-cart`, `/compare` | `HomeCatalogLayout` |

---

## Import paths

```ts
import {
  HomeCatalogLayout,
  HomeMarketingLayout,
  HomeSection,
  HomeSectionInner,
} from "@/components/home/layout";
```

---

## References

- [`MODULE-LAYOUT.md`](MODULE-LAYOUT.md) — `components/` vs `features/`
- [`CSS-SOLUTION.md`](CSS-SOLUTION.md) — site bundle ownership
- `plann/06-UI-PLAN.md` — UI-3 sequencing
