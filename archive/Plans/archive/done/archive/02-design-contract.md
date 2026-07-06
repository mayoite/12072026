# Phase 2 — Design Contract (Homepage as Reference)

## Purpose

Write `docs/architecture/SITE-MARKETING-UI-CONTRACT.md` with **`/` as the visual and structural source of truth.**

No implementation in this phase.

## Reference files (mandatory read list)

| Role | Path |
|------|------|
| Page composition | `app/(site)/page.tsx` |
| Hero (home) | `components/home/HomepageHero.tsx` |
| Section blocks | `components/home/Collections.tsx`, `WhyChooseUs.tsx`, `ShowcaseCarousel.tsx`, … |
| Inner page template | `app/(site)/solutions/page.tsx` |
| Copy source | `lib/site-data/homepage.ts` |
| CSS bundle | `app/css/core/site/bundles/homepage.css`, `routes/home/` |

## Page anatomy (canonical)

```tsx
// Outer — match app/(site)/page.tsx
<div className="min-h-screen overflow-x-hidden">
  {/* hero: HomepageHero on / only; Hero (homepage-styled) on subpages */}
  {/* sections: home-section--white | home-section--soft + border-theme-soft */}
  {/* inner width: home-shell-xl */}
  {/* optional: ContactTeaser footer block like home */}
</div>
```

**Not canonical:** `section.scheme-page.flex.min-h-screen.flex-col.items-center` wrapper used on about/legal/portfolio.

## Typography (homepage)

| Use | Class |
|-----|--------|
| Section titles | `home-heading` |
| Kickers | `typ-label` |
| Accent words in titles | `text-accent-italic` or `text-accent-italic-on-dark` (on dark hero) |
| Body | `page-copy` |

**Demote on marketing routes:** `typ-section` as default section title (keep only if homepage uses it in that context — it does not).

## Surfaces (homepage)

| Use | Class |
|-----|--------|
| Section backgrounds | `home-section--white`, `home-section--soft`, `home-section--sand` (as on home) |
| Cards / media | Patterns from `ShowcaseCarousel`, `Collections` — not legal `shell-card` grids unless homepage equivalent exists |
| Width | `home-shell-xl` |

Map legacy `shell-card` / `shell-card-soft` usages to homepage card components or document explicit allowed exceptions in contract.

## Shells (Phase 3)

| Shell | Behavior |
|-------|----------|
| `HomeMarketingLayout` | Wraps children in homepage outer `min-h-screen overflow-x-hidden`; optional `ContactTeaser` |
| `HomeWorkspaceShell` | access, choose-product, dashboard — may use homepage tokens but not full marketing layout |
| `HomeCatalogLayout` | products lane — `CategoryGrid` / solutions pattern |
| `SiteErrorShell` | offline, not-found — unchanged |

Rename from `SiteMarketingShell` → `HomeMarketingLayout` in implementation.

## Heroes

| Route | Component | Variants |
|-------|-----------|----------|
| `/` | `HomepageHero` | carousel — do not change in this pack |
| Subpages | `Hero` | `small` (legal, about), `default` (marketing), `cinema` (if already used) — **style to match solutions** |

**No `SiteHero` merge** in this pack.

## Legal inner-page template

Mirror `solutions/page.tsx` — not homepage carousel density:

1. `Hero variant="small"` + dark/light hero image
2. `HomeSection variant="white|soft"` + `HomeSectionInner`
3. `home-heading` + `typ-label` + `page-copy`
4. Optional `ContactTeaser`

Legal pages **do not** use `shell-card` stacks as primary layout.

## CSS (Phase 5)

- **Canonical utilities:** existing `home-*` in `routes/home/base.css` and related files
- **Retire / alias:** `contact-shell`, legal-only bundles as modifiers on home section model
- **Do not** introduce `surface-section-*` renames that replace `home-section--*` — homepage names stay

## Matrix mapping

Phase 1 each row gets `homepage_gap` column and `homepage_fidelity` score (0–5).

## Acceptance Checklist

- [x] Contract doc includes screenshots or section inventory from `/`
- [x] Every marketing route mapped to homepage or solutions template
- [x] Legacy `scheme-page` + `shell-card` dialect marked for removal
- [x] No code changes in Phase 2 (doc-only; implementation in 02b/03)
