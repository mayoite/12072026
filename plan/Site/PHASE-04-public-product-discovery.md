# Site Phase 4 — public product discovery

## Outcome

Public visitors can find published Oando products and carry valid product identity into Planner.

## Catalog boundary

- Consume only the published Admin catalog contract.
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

## Product detail

- Show accurate product name, description, dimensions, options, assets, and availability.
- Use licensed and approved assets.
- Keep specification units clear.
- Explain configurable choices without exposing invalid combinations.
- Link the exact product or family into Planner where supported.

## Lifecycle

- Handle retired products without silent substitution.
- Show approved replacements when available.
- Preserve valid historical links with an honest status.
- Remove unavailable products from active discovery when required.
- Keep sitemap and canonical behavior aligned with lifecycle state.

## Security and performance

- Prevent unpublished catalog and commercial data exposure.
- Validate server-side filtering and authorization boundaries.
- Cache only safe published data.
- Keep catalog responses and images within recorded budgets.
- Rate-limit abusive public search behavior where needed.

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
