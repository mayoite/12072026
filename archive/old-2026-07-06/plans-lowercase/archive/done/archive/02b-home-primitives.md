# Phase 2b — Homepage Primitives (Components)

## Purpose

Extract reusable blocks from `/` and `solutions/page.tsx` **before** route migration (Phase 3).

## Components (`site/components/home/layout/`)

| Component | Markup |
|-----------|--------|
| `HomeMarketingLayout` | `min-h-screen overflow-x-hidden` + optional `ContactTeaser` |
| `HomeSection` | `home-section--{variant}` + `border-theme-soft` + `section-y*` |
| `HomeSectionInner` | `home-shell-xl` wrapper |

Props typed; variants: `white` | `soft` | `sand` (match existing `home-section--*`).

## Reference extraction

Copy structure from:

- `app/(site)/solutions/page.tsx` — inner-page template
- `components/home/WhyChooseUs.tsx` — section + heading pattern

## Tests

One Vitest per primitive: renders `data-testid` + expected section class.

## Acceptance Checklist

- [x] Three primitives exported.
- [x] `solutions/page.tsx` refactored to use primitives (proof pattern).
- [x] Contract doc updated with import paths.
