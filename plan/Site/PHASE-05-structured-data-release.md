# Site Phase 5 — structured data and release proof

## Outcome

Public pages expose accurate machine-readable information and pass a full release recheck.

## Structured data

- Map each eligible page type to supported structured-data types.
- Match every field to visible page content.
- Use stable canonical identifiers.
- Keep organization, breadcrumb, article, and product entities consistent.
- Include offer and availability data only when published and accurate.
- Remove markup that cannot be maintained.
- Never use markup to imply unsupported ratings, reviews, prices, or claims.
- Match product entities to the released Products database contract.
- Use the same stable product and family identifiers used by Planner handoff.

## Search controls

- Give every indexable page unique metadata and one canonical URL.
- Keep private, duplicate, filtered, and workspace routes out of indexing.
- Keep sitemap entries limited to canonical public routes.
- Verify redirects, not-found states, and retired-product behavior.
- Keep robots controls aligned with actual route access.

## Release recheck

- Recheck every Site checklist item from live code.
- Test representative landing, content, product, and Planner-entry journeys.
- Validate structured data on representative rendered pages.
- Recheck accessibility, performance, responsive layout, and browser errors.
- Recheck conversion event receipt and funnel continuity.
- Recheck catalog freshness and private-data boundaries.
- Record only active failures in `Failures.md`.
- Recheck every `SITE-*` acceptance ID from a production-like build.
- Recheck the 44-page route classification against live routes.
- Recheck the Workstations category with the root environment loaded.
- Recheck the `/catalog` redirect and final hero request.
- Recheck accessible heading text and unique title suffixes.

## Interface acceptance

This phase closes only after:

- `SITE-SEO-01` through `SITE-SEO-04` pass.
- `SITE-PERF-01` through `SITE-PERF-04` pass with the required evidence.
- `SITE-A11Y-01` through `SITE-A11Y-04` pass on representative journeys.
- Every other `SITE-*` ID is freshly rechecked.

## Monitoring

- Monitor route failures, search visibility, structured-data errors, and conversion breaks.
- Detect analytics silence and event-volume anomalies.
- Detect stale catalog publication.
- Assign an owner and response path for each alert.
- Keep raw tool output in stable overwritten results folders.

## Parallel work

- Schema work can run per stable page type.
- Search controls and release automation can run together.
- Monitoring can be added as each signal becomes reliable.

## Required proof

- Rendered structured-data validation.
- Canonical, sitemap, robots, redirect, and not-found checks.
- Full public browser journeys.
- Accessibility and performance budget checks.
- Conversion funnel and catalog-boundary checks.
- Fresh plan, link, and layout checks.

## Done when

- Structured data matches visible truth.
- Search controls match live routes.
- Public journeys pass from discovery into Planner.
- Monitoring detects material regressions.
