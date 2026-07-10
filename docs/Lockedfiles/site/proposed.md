# Site — proposed (locked)

**Baseline:** 2026-07-05  
**Authority:** [`Plans/global-standard-revision/README.md`](../../../Plans/global-standard-revision/README.md) — site stays separate from planner engine graph; **1B** owns portal svg-catalog publish seam

## Cross-links

| Doc | Path |
|-----|------|
| Module layout | [`docs/architecture/MODULE-LAYOUT.md`](../../architecture/MODULE-LAYOUT.md) |
| UI contract | [`docs/architecture/MODULE-UI-CONTRACT.md`](../../architecture/MODULE-UI-CONTRACT.md) |
| Marketing contract | [`docs/architecture/SITE-MARKETING-UI-CONTRACT.md`](../../architecture/SITE-MARKETING-UI-CONTRACT.md) |
| Architecture index | [`docs/architecture/README.md`](../../architecture/README.md) |
| Locked index | [`docs/Lockedfiles/INDEX.md`](../INDEX.md) |

---

| Topic | Policy | Paths | Docs |
|--------|--------|-------|------|
| Marketing | Routes thin; copy in `site-data`; semantic CSS tokens only (no hex in components) | `site/app/(site)/`, `site/components/`, `site/lib/site-data/` | `SITE-MARKETING-UI-CONTRACT.md` |
| Member | Authenticated member surfaces; not admin | `site/app/(site)/dashboard/` | `Readme.md` |
| Portal | Member/guest plan views; SVG catalog is public Puck `Render` preview (≤1 per route) | `site/app/(site)/portal/` | `plans/01-phase1-execution/06-benchmark-delivery.md` |
| Site catalog | Products DB via Drizzle; path strings in DB only | `site/features/catalog/`, `site/lib/catalog/` | `docs/database/SCHEMA.md` |
| i18n | Locale JSON is source; async page tests use `nextIntlServerEnMock` | `site/i18n/` | `TESTING.md` |
| CSS | Single token source `core/tokens/theme.css` | `site/app/css/core/site/bundles/*` | `CSS-SOLUTION.md` |

## Packages (proposed per plan)

| Package | Policy |
|---------|--------|
| `next`, `next-intl`, `react` | Framework baseline |
| `@radix-ui/react-*`, `gsap`, `swiper`, `lenis` | Marketing-only motion/UI — not in planner workspace |
| `@puckeditor/core` | **Portal svg-catalog only** — ≤1 `Render` per route |
| `drizzle-orm` | Product catalog reads — no new Supabase `.from()` |
| `three` | Product 3D previews only — not planner workspace |

**Excluded from marketing bundles where possible:** planner admin compiler, fabric, open3d workspace deps.
