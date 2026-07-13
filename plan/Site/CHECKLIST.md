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

### Foundation acceptance

- [ ] `SITE-IA-01` Every page file has one accepted access and lifecycle classification.
- [ ] `SITE-IA-02` Every public page has an audience, intent, owner, canonical URL, and primary action.
- [ ] `SITE-IA-03` Duplicate and legacy routes use one deliberate redirect chain.
- [ ] `SITE-MEASURE-01` One event contract covers the complete commercial journey.
- [ ] `SITE-MEASURE-02` Rerenders, retries, redirects, and route changes do not duplicate events.
- [ ] `SITE-MEASURE-03` Analytics excludes private and unnecessary data.
- [ ] `SITE-PERF-01` Field LCP is at most 2.5 seconds at the 75th percentile.
- [ ] `SITE-PERF-02` Field INP is at most 200 milliseconds at the 75th percentile.
- [ ] `SITE-PERF-03` Field CLS is at most 0.1 at the 75th percentile.
- [ ] `SITE-PERF-04` Responsive images have no broken request and below-fold media is deferred.
- [ ] `SITE-SEO-01` Every indexable page has unique metadata, canonical URL, and a coherent H1.
- [ ] `SITE-SEO-02` Titles do not duplicate the brand suffix.
- [ ] `SITE-SEO-03` Sitemap, robots, redirects, not-found behavior, and access classification agree.

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

### Landing and form acceptance

- [ ] `SITE-NAV-01` Desktop and phone navigation expose the stable primary paths.
- [ ] `SITE-NAV-02` Protected and operational routes are absent from public navigation.
- [ ] `SITE-NAV-03` Every navigation and cart link has a clear accessible name.
- [ ] `SITE-NAV-04` Site search is scoped, keyboard-usable, and announced.
- [ ] `SITE-HOME-01` The first desktop and phone viewport states audience, value, proof, and one primary action.
- [ ] `SITE-HOME-02` Animated and split headings preserve correct text and reading order.
- [ ] `SITE-HOME-03` Trust claims have an approved source, owner, and review date.
- [ ] `SITE-HOME-04` Unsupported testimonials, ratings, urgency, and scale claims are absent.
- [ ] `SITE-FORM-01` Forms use minimal fields, visible labels, precise validation, and preserved valid input.
- [ ] `SITE-FORM-02` Form success appears only after accepted server receipt.
- [ ] `SITE-FORM-03` Failure, retry, duplicate, and rate-limit states are truthful.
- [ ] `SITE-FORM-04` Consent and privacy use are clear before submission.
- [ ] `SITE-MOB-01` The first 844 phone pixels include purpose and the primary action.
- [ ] `SITE-MOB-02` Phone pages do not scroll horizontally at 390 pixels.
- [ ] `SITE-MOB-03` Frequent phone actions use 44 by 44 pixel targets where practical.
- [ ] `SITE-A11Y-01` Primary Site journeys meet WCAG 2.2 AA.
- [ ] `SITE-A11Y-02` Primary navigation, discovery, form, and Planner-entry tasks are keyboard-completable.
- [ ] `SITE-A11Y-03` Focus stays visible and recovers correctly.
- [ ] `SITE-A11Y-04` Dynamic Site states are announced.

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

### Content acceptance

- [ ] `SITE-CONTENT-01` Claims are specific, supportable, owned, and reviewed.
- [ ] `SITE-CONTENT-02` Content provides original Oando value without filler or mass duplication.
- [ ] `SITE-CONTENT-03` Every content page leads to a relevant product, Planner, or contact action.

## Phase 4 — public product discovery

- [ ] Only the released Products database catalog contract is consumed through a server API.
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

### Product and Planner acceptance

- [ ] `SITE-PROD-01` Released categories with active inventory never render as false empty categories.
- [ ] `SITE-PROD-02` Product results expose the required identity and comparison data.
- [ ] `SITE-PROD-03` Search, filter, sort, paging, and comparison are clear and reversible.
- [ ] `SITE-PROD-04` Loading, empty catalog, no result, error, stale snapshot, and recovery are distinct.
- [ ] `SITE-PROD-05` Product detail matches the released database contract and visible structured data.
- [ ] `SITE-PROD-06` Public responses exclude drafts, internal prices, audit data, and private retired records.
- [ ] `SITE-PLAN-01` Product or family identity survives Site-to-Planner entry.
- [ ] `SITE-PLAN-02` Source, campaign, locale, and intent survive Site-to-Planner entry.
- [ ] `SITE-PLAN-03` Planner confirms imported context and provides recoverable failure.
- [ ] `SITE-MOB-04` Product filters and comparison use a deliberate phone composition.

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
- [ ] `SITE-SEO-04` Structured data matches visible released content and stable identifiers.
- [ ] Every `SITE-*` acceptance ID is freshly rechecked in a production-like build.

## Completion

- [ ] Public visitors can discover truthful Oando content and products.
- [ ] Product identity survives entry into Planner.
- [ ] The journey from discovery to handoff is measurable.
- [ ] Fresh commands and exit codes are recorded here.
- [ ] Only active failures remain in `../../Failures.md`.
