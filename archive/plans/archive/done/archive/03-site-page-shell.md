# Phase 3 — Homepage-Aligned Layout Migration

## Purpose

Migrate routes using **Phase 2b primitives** + **Phase 5c codemods**. One PR per batch.

## Prerequisites

- Phase 2b (`HomeMarketingLayout`, `HomeSection`, `HomeSectionInner`)
- Phase 5 + 5c complete
- Template test: `tests/unit/app/(site)/_template.homepage.test.tsx`

## PR-sized batches

| PR | Routes | Acceptance grep |
|----|--------|-----------------|
| **3a** | about, news, imprint, privacy, terms, refund | 0 `scheme-page` wrapper on these paths |
| **3b** | portfolio, gallery, projects, showrooms, social | same |
| **3c** | planning, service, tracking, sustainability, templates | same |
| **3d** | contact, career, backend-architecture, repo-store, support-ivr | 0 `contact-shell` primary layout |
| **3e** | solutions/* (hero scale only) | already home-family |
| **3f** | `/` | extract layout only if duplicated |

**Phase 7:** products, quote-cart, compare.

## PageViews (priority)

`ContactPageView`, `CareerPageView`, `SupportIvrPageView` — highest `scheme-page` debt.

## Marketing tests (~17 hollow)

Rewrite `tests/unit/app/(site)/**`:

- `data-testid="home-marketing-layout"`
- `home-shell-xl` or `HomeSection` present
- Use `_template.homepage.test.tsx` pattern

Update `cross-pack-handshakes.json` → `hollow-audit-marketing` = `closed`.

## `html lang`

`(site)/layout.tsx` — `getLocale()` on `<html>`.

## Acceptance Checklist

- [x] All 3a–3f PRs merged (single branch).
- [x] `rg "scheme-page flex min-h-screen flex-col items-center" site/app/(site)` → 0.
- [x] `test:audit:hollow` full repo green (release-gate) — **passed 2026-06-30**.
- [x] Handshake JSON updated (`plans/cross-pack-handshakes.json`).
