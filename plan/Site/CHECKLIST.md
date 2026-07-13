# Site checklist

This file records status only.

Treat every item as not done.

## Shared start gate

- [ ] Catalog-writing tests satisfy Admin Step 0 isolation.
- [ ] Site catalog fixtures never change canonical catalog files.
- [ ] Browser tests use normal controls without forced clicks.
- [ ] Each Site command overwrites its stable results folder.

## Phase 1 — conversion measurement and foundation

- [ ] Live public routes, navigation, forms, metadata, and analytics code are freshly checked.
- [ ] Public, private, duplicate, redirected, and dead routes are classified.
- [ ] Indexing, accessibility, performance, and conversion failures are recorded.
- [ ] One funnel covers landing entry through Planner handoff.
- [ ] Every event has a stable name, trigger, fields, and owner.
- [ ] Site and Planner use the same event meanings.
- [ ] Source and campaign context survives entry into Planner.
- [ ] Rerenders, retries, and route transitions do not duplicate events.
- [ ] Analytics excludes private geometry, BOQ lines, secrets, and unnecessary personal data.
- [ ] Consent and identifier scope are enforced.
- [ ] Event receipt is verified in a production-like build.
- [ ] Funnel, source, failure, and page reports work.
- [ ] Missing measurement is visible and never reported as success.
- [ ] Canonical, indexing, sitemap, and robots ownership is defined.
- [ ] Accessibility and performance budgets are recorded.
- [ ] Critical console, request, hydration, and navigation failures are removed.

## Phase 2 — commercial landing-page expansion

- [ ] Customer segments, needs, offers, and decisions are mapped.
- [ ] Every page has one primary intent and next action.
- [ ] Navigation is shallow and understandable.
- [ ] Duplicate, orphaned, and conflicting routes are resolved.
- [ ] Value propositions are specific and supportable.
- [ ] Product, capability, proof, and commercial claims are truthful.
- [ ] Generic filler, fake urgency, and invented testimonials are absent.
- [ ] Planner, contact, and product-discovery actions have clear roles.
- [ ] Responsive hierarchy works at supported widths.
- [ ] Primary journeys meet WCAG 2.2 AA.
- [ ] Images are approved, licensed, responsive, and performant.
- [ ] Pages meet recorded performance budgets.
- [ ] Forms show truthful success, failure, and retry states.
- [ ] Page-to-Planner conversion events are verified.

## Phase 3 — search-led content expansion

- [ ] Topic decisions use current dated search evidence.
- [ ] Commercial, product, planning, and informational intent are separated.
- [ ] Approved topics match Oando capability and inventory.
- [ ] Every page has an accepted audience, query set, purpose, and action.
- [ ] Content provides original Oando value.
- [ ] Factual and regulatory claims have adequate sources.
- [ ] Thin, duplicated, and mass-generated pages are rejected.
- [ ] Every page has an owner and review date.
- [ ] Content links to relevant commercial pages, products, and Planner actions.
- [ ] Orphaned pages and dead ends are absent.
- [ ] Weak pages are refreshed, consolidated, redirected, or removed.
- [ ] Redirects are intentional and limited.
- [ ] Search entries, Planner entries, and assisted conversions are measured.
- [ ] Traffic alone is not treated as commercial success.

## Phase 4 — public product discovery

- [ ] Only the published Admin catalog contract is consumed.
- [ ] Drafts, internal prices, approval data, and private retired records are excluded.
- [ ] Product, family, version, option, and asset identity are preserved.
- [ ] Categories, search, filters, sorting, and pagination work.
- [ ] Filter combinations are understandable and reversible.
- [ ] Product routes are stable and canonical.
- [ ] Availability and lead-time claims are supported.
- [ ] Loading, empty, error, and no-result states are distinct.
- [ ] Product discovery is keyboard and assistive-technology usable.
- [ ] Product details show accurate identity, dimensions, options, assets, and availability.
- [ ] Configurable choices do not expose invalid combinations.
- [ ] Exact product or family identity can enter Planner.
- [ ] Retired products are never silently substituted.
- [ ] Approved replacements and historical links are handled honestly.
- [ ] Sitemap and canonical behavior match product lifecycle state.
- [ ] Public search cannot expose unpublished or commercial data.
- [ ] Catalog responses and images meet recorded performance budgets.

## Phase 5 — structured data and release proof

- [ ] Eligible page types use supported structured-data types.
- [ ] Structured-data fields match visible content.
- [ ] Canonical entity identifiers are stable.
- [ ] Organization, breadcrumb, article, and product entities are consistent.
- [ ] Offer and availability markup uses only accurate published data.
- [ ] Unsupported ratings, reviews, prices, and claims are absent.
- [ ] Every indexable page has unique metadata and one canonical URL.
- [ ] Private, duplicate, filtered, and workspace routes are not indexed.
- [ ] Sitemap contains only canonical public routes.
- [ ] Redirect, not-found, and retired-product behavior is correct.
- [ ] Robots controls match actual route access.
- [ ] Representative rendered pages pass structured-data validation.
- [ ] Landing, content, product, and Planner-entry journeys pass.
- [ ] Accessibility, performance, responsive, and browser checks pass.
- [ ] Conversion funnel continuity passes.
- [ ] Catalog freshness and private-data boundaries pass.
- [ ] Monitoring detects route, schema, analytics, catalog, and conversion failures.

## Completion

- [ ] Public visitors can discover truthful Oando content and products.
- [ ] Product identity survives entry into Planner.
- [ ] The journey from discovery to handoff is measurable.
- [ ] Fresh commands and exit codes are recorded here.
- [ ] Only active failures remain in `../../Failures.md`.
