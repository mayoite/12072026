# Site Phase 4 — public product discovery

## Outcome

Public visitors can find published Oando products and carry valid product identity into Planner.

## Catalog boundary

- Consume only the released Products database catalog through a server API.
- Use an isolated published-catalog fixture before live integration.
- Exclude drafts, retired private records, internal prices, and approval data.
- Preserve product, family, version, option, and asset identity.
- Show source and freshness failures honestly.

## Discovery

- Provide useful categories, search, filters, sorting, and pagination.
- Keep filter combinations understandable and reversible.
- Use stable, canonical product routes.
- Show availability and lead-time claims only when supported.
- Handle empty, loading, error, and no-result states.
- Keep discovery usable by keyboard and assistive technology.
- Never present a released category with active inventory as a false empty category.
- Preserve the query and explain why zero results occurred.
- Keep active filters visible and reversible.
- Use a deliberate phone filter and comparison composition.

## Product detail

- Show accurate product name, description, dimensions, options, assets, and availability.
- Use licensed and approved assets.
- Keep specification units clear.
- Explain configurable choices without exposing invalid combinations.
- Link the exact product or family into Planner where supported.
- Expose a recognizable image or symbol, SKU, family, dimensions, availability, and configuration state.
- Keep visible product data and structured data identical.

## Lifecycle

- Handle retired products without silent substitution.
- Show approved replacements when available.
- Preserve valid historical links with an honest status.
- Remove unavailable products from active discovery when required.
- Keep sitemap and canonical behavior aligned with lifecycle state.

## Security and performance

- Prevent unpublished catalog and commercial data exposure.
- Validate server-side filtering and authorization boundaries.
- Cache only safe released data and immutable artifact identity.
- Keep catalog responses and images within recorded budgets.
- Rate-limit abusive public search behavior where needed.

## Planner handoff

- Carry exact product or family identity.
- Carry source page, campaign, locale, and intent.
- Confirm imported context in Planner.
- Preserve a recoverable path when import fails.

## Interface acceptance

This phase owns:

- `SITE-PROD-01` through `SITE-PROD-06`.
- `SITE-PLAN-01` through `SITE-PLAN-03`.
- `SITE-MOB-04`.
- Product-specific parts of `SITE-A11Y-01` through `SITE-A11Y-04`.

## Parallel work

- Search and product-detail work can run together against the fixture.
- Lifecycle and security checks can run with live integration.
- Planner deep-link proof can run when identity contracts are stable.

## Required proof

- Fixture and live catalog contract tests.
- Search, filter, no-result, and lifecycle browser journeys.
- Draft and commercial-data exposure checks.
- Canonical, sitemap, and replacement checks.
- Product-to-Planner identity test.
- Accessibility and performance checks.

## Done when

- Visitors find only valid published products.
- Product identity survives entry into Planner.
- Retired and replaced products are handled honestly.
- Private catalog and commercial data remain private.
