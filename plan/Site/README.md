# Site track

## Outcome

Site helps public visitors understand Oando, discover published products, and enter Planner.

The journey is truthful, searchable, accessible, fast, and measurable.

## Five phases

1. `PHASE-01-measurement-foundation.md`
   Conversion measurement and the public-site quality baseline.
2. `PHASE-02-commercial-landing-pages.md`
   Commercial landing-page expansion.
3. `PHASE-03-search-led-content.md`
   Search-led content expansion.
4. `PHASE-04-public-product-discovery.md`
   Public product discovery using published Admin inventory.
5. `PHASE-05-structured-data-release.md`
   Structured-data expansion and release proof.

## Ownership

- Site owns public acquisition, content, discovery, SEO, and measurement.
- Admin owns published catalog truth.
- Planner owns design, BOQ, pricing, review, handoff, and exports.
- Site links to Planner through explicit contracts.
- Site never exposes draft inventory, private projects, or commercial data.

## Interface authority

The public Site benchmark is `../../docs/architecture/09-SITE-UI-BENCHMARK.md`.

Its `SITE-*` IDs are acceptance requirements.

No Site requirement is deferred to a later decision bucket.

No new UI package is planned.

Use the installed stack first.

## Acceptance trace

| Phase | Acceptance groups |
|---|---|
| Phase 1 | `SITE-IA-*`, `SITE-MEASURE-*`, `SITE-PERF-*`, baseline `SITE-SEO-*` |
| Phase 2 | `SITE-NAV-*`, `SITE-HOME-*`, `SITE-FORM-*`, `SITE-MOB-*`, `SITE-A11Y-*` |
| Phase 3 | `SITE-CONTENT-*`, content lifecycle parts of `SITE-SEO-*` and `SITE-MEASURE-*` |
| Phase 4 | `SITE-PROD-*`, `SITE-PLAN-*`, product parts of `SITE-MOB-*` and `SITE-A11Y-*` |
| Phase 5 | Final `SITE-SEO-*`, `SITE-PERF-*`, `SITE-A11Y-*`, and full journey recheck |

## Parallel execution

- Measurement starts first and continues through every phase.
- Landing-page and search-content work can run in parallel.
- Product discovery can run against an isolated published-catalog fixture.
- Structured data can run when each public page type is stable.
- Security, accessibility, and performance run with the work they protect.

Two writers do not edit the same file at the same time.

## Limited blockers

- Missing analytics delivery blocks only production event receipt proof.
- Missing live catalog blocks only live product-discovery proof.
- Missing search evidence blocks only the affected content page.
- Missing structured-data eligibility blocks only that schema type.
- Unrelated Site work continues.

## Features

`FEATURES.md` maps each plan phase to code paths and known gaps.

## Status

`CHECKLIST.md` records open acceptance work only.

The phase files explain execution.

## Completion

Public visitors can find truthful Oando content, discover published products, enter Planner, and complete a measurable journey.
