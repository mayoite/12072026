# Site marketing CSS bundles

## Load order (after Batch 1)

| Bundle | Imported from | Scope |
|--------|---------------|--------|
| `site-marketing.css` | `app/(site)/layout.tsx` | `site-surfaces` + `marketing-primitives` |
| `homepage-sections.css` | `app/(site)/page.tsx` only | `@reference` main Tailwind entry; carousel, trust KPI, projects, `planner-landing.css` |
| `catalog.css` | `app/(site)/products/layout.tsx` | All `/products/*` |
| `pdp.css` | `app/(site)/products/[category]/[product]/layout.tsx` | Product detail only |
| `legal.css` | `(site)/layout.tsx` | Legal route utilities |
| `contact.css` | `(site)/layout.tsx` | Contact teaser + contact page |

Planner marketing CSS: `app/css/core/locked/planner/marketing.css` (not the site homepage sections bundle).

## Two problems (do not confuse)

1. **Global load boundaries** — fixed Batch 1 (`homepage-only` no longer on every route).
2. **Per-page markup dialect** — still open on most routes (see tiers below).

Batch 2+ is TSX class migration, not rewriting `routes/home/*.css`.

## Markup dialects on marketing pages

| Dialect | Classes | Status |
|---------|---------|--------|
| **Home contract** (target) | `HomeSection`, `home-heading`, `scheme-panel`, `page-copy` | `/`, `/about`, `/service`, `/solutions`, `/showrooms` |
| **Legacy shell** | `shell-card`, `shell-card-soft`, `shell-dark-cta-panel` | cleared from `(site)/page.tsx`; shared components (`RouteCtaBand`, etc.) may still use shell internally |
| **Workspace** | `shell-workspace-*`, dashboard chrome | `/dashboard`, `/portal`, `/access` — different lane |

Replacing `shell-card` with `scheme-panel scheme-border rounded-2xl border` (see `/about`) fixes visual drift **without** new CSS files.

## Migration tiers (Batch 2+)

Work **one tier per PR**. Run `pnpm --filter oando-site run check:site-ui:dialect` when touching marketing TSX.

### Tier A — Legal cluster (same layout pattern) ✓

- `/privacy`, `/terms`, `/imprint`, `/refund-and-return-policy` — migrated to home contract panels.

### Tier B — Content marketing ✓

- `/news`, `/gallery`, `/portfolio`, `/projects`, `/planning`, `/downloads`, `/templates`

### Tier C — Social / proof ✓

- `/trusted-by`, `/social`, `/tracking`, `/sustainability`

### Tier D — Already on home contract (verify only)

- `/about`, `/service`, `/solutions`, `/showrooms`, `/solutions/[category]`

### Out of scope for marketing uniformity

- `/dashboard`, `/portal`, `/login`, `/choose-product`, `/access`, `/catalog` — workspace/catalog lanes

## Definition of done (per page)

- [ ] `HomeMarketingLayout` + `Hero` + `HomeSection` / `HomeSectionInner`
- [ ] No `shell-card` / `shell-card-soft` unless contract documents an exception
- [ ] Section titles use `home-heading` or `SectionIntro`, not ad-hoc `typ-section` alone
- [ ] Visual spot-check or `test:site-ui` snapshot for that route if it exists

Track progress in `Failures.md` → UI / quality backlog.

## Products lane (index → category → PDP)

This lane feels extra tangled because each level uses a different shell and card system — not because one CSS file is wrong.

```
(site)/layout                    → site-marketing (global)
/products/layout                 → catalog.css
/products/[category]/[product]/layout → pdp.css (detail only)

/products                        → HomeMarketingLayout + CategoryGrid
/products/[category]             → HomeCatalogLayout + catalog-card
/products/[category]/[product]   → HomeMarketingLayout + pdp-page
```

Fixes applied: `pdp.css` no longer on `/products` index; `CategoryGrid` pillars use `scheme-panel`; `CompareDock` uses `scheme-panel`.

Unifying all three into one layout would break PDP (full-bleed gallery) or category (filter grid). Goal: same **tokens**, different **templates**.

