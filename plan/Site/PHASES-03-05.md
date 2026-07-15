# Site Phases 3–5 — content, product discovery, and release proof

## Phase 3 — search-led content expansion

### Outcome

Oando publishes useful content for verified customer demand.

### Demand research

- Use current search evidence during execution.
- Separate commercial, product, planning, and informational intent.
- Compare demand with Oando capability and inventory.
- Reject topics Oando cannot answer credibly.
- Record the evidence and date behind each approved topic.

### Content system

- Give each page one query set, audience, purpose, and next action.
- Create briefs before drafting.
- Use original Oando knowledge, examples, and images where available.
- Cite factual and regulatory claims where needed.
- Avoid thin, duplicated, or mass-generated pages.
- Keep authorship, review date, and owner visible internally.
- Keep every claim specific, supportable, owned, and reviewed.
- Reject filler and mass duplication.

### Internal journeys

- Link supporting content to commercial pages and products.
- Link relevant products and guidance into Planner.
- Provide useful related content without link stuffing.
- Prevent dead ends and orphaned pages.
- Preserve campaign and content-source context.
- Ensure each page ends in a relevant product, Planner, or contact action.

### Interface acceptance

This phase owns `SITE-CONTENT-01` through `SITE-CONTENT-03`.

It also rechecks content-specific parts of `SITE-SEO-*` and `SITE-MEASURE-*`.

### Done when

- Published content answers verified demand with original value.
- Weak or duplicate content is not shipped.
- Every page has ownership and lifecycle rules.
- Search journeys lead to measurable customer actions.

---

## Phase 4 — public product discovery

### Outcome

Public visitors can find published Oando products and carry valid product identity into Planner.

### Catalog boundary

- Consume only the released Products database catalog through a server API.
- Use an isolated published-catalog fixture before live integration.
- Exclude drafts, retired private records, internal prices, and approval data.
- Preserve product, family, version, option, and asset identity.
- Show source and freshness failures honestly.

### Discovery

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

### Product detail

- Show accurate product name, description, dimensions, options, assets, and availability.
- Use licensed and approved assets.
- Keep specification units clear.
- Explain configurable choices without exposing invalid combinations.
- Link the exact product or family into Planner where supported.
- Expose a recognizable image or symbol, SKU, family, dimensions, availability, and configuration state.
- Keep visible product data and structured data identical.

### Planner handoff

- Carry exact product or family identity.
- Carry source page, campaign, locale, and intent.
- Confirm imported context in Planner.
- Preserve a recoverable path when import fails.

### Interface acceptance

This phase owns:

- `SITE-PROD-01` through `SITE-PROD-06`.
- `SITE-PLAN-01` through `SITE-PLAN-03`.
- `SITE-MOB-04`.
- Product-specific parts of `SITE-A11Y-01` through `SITE-A11Y-04`.

### Done when

- Visitors find only valid published products.
- Product identity survives entry into Planner.
- Retired and replaced products are handled honestly.
- Private catalog and commercial data remain private.

---

## Phase 5 — structured data and release proof

### Outcome

Public pages expose accurate machine-readable information and pass a full release recheck.

### Structured data

- Map each eligible page type to supported structured-data types.
- Match every field to visible page content.
- Use stable canonical identifiers.
- Keep organization, breadcrumb, article, and product entities consistent.
- Include offer and availability data only when published and accurate.
- Remove markup that cannot be maintained.
- Never use markup to imply unsupported ratings, reviews, prices, or claims.
- Match product entities to the released Products database contract.
- Use the same stable product and family identifiers used by Planner handoff.

### Search controls

- Give every indexable page unique metadata and one canonical URL.
- Keep private, duplicate, filtered, and workspace routes out of indexing.
- Keep sitemap entries limited to canonical public routes.
- Verify redirects, not-found states, and retired-product behavior.
- Keep robots controls aligned with actual route access.

### Release recheck

- Recheck every Site checklist item from live code.
- Test representative landing, content, product, and Planner-entry journeys.
- Validate structured data on representative rendered pages.
- Recheck accessibility, performance, responsive layout, and browser errors.
- Recheck conversion event receipt and funnel continuity.
- Recheck catalog freshness and private-data boundaries.
- Record only active failures in `Failures.md`.
- Recheck every `SITE-*` acceptance ID from a production-like build.

### Interface acceptance

This phase closes only after:

- `SITE-SEO-01` through `SITE-SEO-04` pass.
- `SITE-PERF-01` through `SITE-PERF-04` pass with the required evidence.
- `SITE-A11Y-01` through `SITE-A11Y-04` pass on representative journeys.
- Every other `SITE-*` ID is freshly rechecked.

### Done when

- Structured data matches visible truth.
- Search controls match live routes.
- Public journeys pass from discovery into Planner.
- Monitoring detects material regressions.