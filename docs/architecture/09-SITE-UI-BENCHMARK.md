# Public Site UI benchmark

## Status

This is the interface and journey benchmark for Site work.

It is not an execution plan.

It was refreshed on 2026-07-13.

The root `.env.local` was loaded for the final live checks.

## Verdict

The public Site has a usable visual foundation.

It is not release-ready.

Responsive layout and basic semantic coverage are stronger than Planner.

The commercial journey is still too broad and weakly proved.

The route group contains 44 page files.

Several look public but are protected, redirected, duplicated, or operational.

The Workstations category shows zero products against the loaded environment.

The homepage heading has broken text spacing for assistive technology.

The catalog redirect lands on a page with a broken hero image request.

Several titles repeat the brand.

## Scope and evidence

The local check used the package-defined development command.

The root environment validation passed.

The Admin database connection check passed.

The checked public routes were:

- `/`
- `/products`
- `/products/workstations`
- `/solutions`
- `/planning`
- `/contact`
- `/catalog`, which redirects to `/downloads/`

The checked viewports were:

- Desktop: 1440 by 900 CSS pixels.
- Phone: 390 by 844 CSS pixels.

The check inspected status, headings, titles, controls, image alternatives, labels, overflow, console errors, and failed requests.

This is a dated baseline.

It does not prove future builds.

It closes no plan item.

## Current baseline

### Useful foundations

The tested primary pages returned HTTP 200.

They had one main landmark.

They had a skip link.

Checked images had `alt` attributes.

Checked form controls had programmatic labels.

No page-level horizontal overflow appeared at 390 pixels.

The desktop and phone layouts reflowed.

These are useful foundations.

They are not a complete accessible or commercial journey.

### Homepage

The homepage has 48 images and a document height near 5001 pixels on desktop.

Its phone document is near 6951 pixels.

The visible heading is split into animated lines.

Its DOM text is `Spaces that workas hard asyour team`.

Missing spaces make the accessible heading wrong.

The homepage title repeats the brand suffix.

The page offers Products, quote, and Planner actions.

Their hierarchy needs one primary commercial intent.

### Products

The Products landing page provides six category links.

The checked Workstations category exposes search, series filtering, more filters, and comparison controls.

It returns `0 OF 0 PRODUCTS` with the root environment loaded.

That may reflect incomplete catalog data.

It still makes the public category commercially empty.

The empty state is clear.

It cannot substitute for actual product discovery.

The Workstations title is `Workstations | One&Only | One&Only`.

### Navigation and routes

The public route group contains 44 page files.

It includes marketing, legal, account, portal, tracking, operational, and redirect surfaces.

The proxy protects `/dashboard` and most `/portal` routes.

The file grouping still makes ownership and indexing easy to misunderstand.

Every route needs one explicit access and indexing classification.

The header also contains an empty quote-cart link in the checked DOM.

An icon-only link still needs an accessible name.

### Redirect and image failure

`/catalog` redirects to `/downloads/`.

The final page requests `/images/hero/hero-3.webp` through the image optimizer.

That request returned HTTP 400 in the checked run.

The redirect destination therefore has a broken hero asset.

### Mobile composition

The checked pages do not overflow horizontally.

They become long vertical documents:

| Route | Approximate phone height |
|---|---:|
| `/` | 6951 px |
| `/products` | 5426 px |
| `/solutions` | 3379 px |
| `/planning` | 5398 px |
| `/contact` | 4463 px |
| `/downloads/` | 5535 px |

Page length is not automatically bad.

These lengths increase the cost of weak hierarchy and repeated content.

The first viewport must establish audience, value, proof, and next action.

### Current score

| Area | Result | Reason |
|---|---|---|
| Responsive reflow | PARTIAL | No checked horizontal overflow. Full device coverage is unproved. |
| Semantic foundation | PARTIAL | Main, skip, labels, and image alternatives exist. Full accessibility is unproved. |
| Homepage heading | FAIL | The accessible text loses spaces between animated lines. |
| Commercial hierarchy | PARTIAL | Several actions exist. One primary intent is not consistent. |
| Route truth | FAIL | Forty-four page files lack one accepted public, protected, redirect, or dead classification. |
| Product discovery | FAIL | The checked Workstations category has zero products. |
| Catalog redirect | FAIL | The destination requests a hero image that returns 400. |
| Metadata quality | FAIL | Checked titles repeat the brand suffix. |
| Planner handoff | OPEN | Product and campaign identity continuity is not proved. |
| Conversion receipt | OPEN | Form and analytics delivery were not executed in this read-only pass. |
| Performance | OPEN | Image count creates risk. Field Core Web Vitals were not measured here. |

## External benchmark

### Office-furniture journeys

[Haworth](https://www.haworth.com/) joins product categories, planning ideas, workplace expertise, and real-space proof.

[Steelcase planning ideas](https://www.steelcase.com/eu-en/planning-ideas/) organizes inspiration by workplace need and industry.

[Steelcase design consultation](https://www.steelcase.com/design-consultation/) explains the audience, decisions, product options, budget, timeline, and assisted next step.

The lesson is not their visual styling.

The lesson is continuity between need, proof, product, planning, and contact.

### Product finding

[Baymard product-list research](https://baymard.com/research/ecommerce-product-lists) treats list layout, filters, sorting, comparison data, and loading as one system.

[Baymard homepage and navigation research](https://baymard.com/blog/ecommerce-navigation-best-practice) requires clear category scope and mobile navigation paths.

Oando's public catalog must expose useful product identity before asking the visitor to enter Planner.

### Search and structured data

[Google Search Essentials](https://developers.google.com/search/docs/essentials) is the indexing floor.

[Google product-data guidance](https://developers.google.com/search/docs/specialty/ecommerce/share-your-product-data-with-google) connects visible product truth, structured data, and product feeds.

Structured data must match visible released data.

It cannot repair empty or misleading pages.

### Performance

[Core Web Vitals](https://web.dev/articles/defining-core-web-vitals-thresholds) defines good field thresholds at the 75th percentile:

- LCP at most 2.5 seconds.
- INP at most 200 milliseconds.
- CLS at most 0.1.

These are release targets.

One local Lighthouse score is not field proof.

### Accessibility

[WCAG 2.2](https://www.w3.org/TR/WCAG22/) is the conformance floor.

Navigation, search, filters, comparison, forms, consent, Planner entry, and error recovery must be keyboard and assistive-technology usable.

## Package decision

No new Site UI package is approved.

The installed stack already provides:

| Need | Existing authority |
|---|---|
| Routing, metadata, images, and server rendering | Next.js |
| Localized content | `next-intl` |
| Accessible interactive controls | `react-aria-components` |
| Remote catalog state | `@tanstack/react-query` |
| Ranked local search when required | `fuse.js` |
| Existing carousels | Embla or Swiper already in the repo |
| Analytics | `@vercel/analytics` and the existing event layer |
| Field signals | `@vercel/speed-insights` |
| Browser and accessibility proof | Playwright and Axe |

Use one carousel system per surface.

Do not add another component framework.

Fix content, hierarchy, data, and assets before adding effects.

## Required interaction model

### Public entry

The first viewport must answer:

1. What Oando provides.
2. Who it serves.
3. Why the claim is credible.
4. What the visitor should do next.

Use one primary action.

Secondary actions support it.

Animated text must preserve a coherent accessible name.

### Navigation

Use one stable label for each destination.

Keep primary product, solution, proof, Planner, and contact paths visible.

Put secondary corporate and legal routes in deliberate groups.

Do not place protected or operational routes in public navigation.

Search must state its scope and announce results.

### Product discovery

The path is:

1. Choose a category or search.
2. Narrow by useful attributes.
3. Compare released products.
4. Open a truthful product detail.
5. Send the exact product or family into Planner.

Each result needs:

- Recognizable image or symbol.
- Full name.
- SKU.
- Family.
- Dimensions.
- Availability.
- Configuration state.
- Clear detail or Planner action.

Filters are reversible.

Active filters remain visible.

Zero results explain why and preserve the visitor's query.

An empty database category is a catalog failure.

It is not a finished discovery page.

### Planner handoff

The handoff carries:

- Product or family identity when selected.
- Source page.
- Campaign context.
- Locale.
- User intent.

Planner must confirm what carried over.

Failure must preserve a safe retry path.

### Forms

Ask only for information needed for the stated response.

Show field errors beside fields.

Preserve valid input after failure.

Show success only after accepted server receipt.

State response expectations and privacy use.

### Mobile

Do not only stack desktop sections.

The first 844 pixels must include purpose and the primary action.

Navigation, filters, compare, quote cart, and form actions need deliberate phone controls.

Frequent phone actions use 44 by 44 pixel targets where practical.

## Acceptance contract

These IDs are stable.

| ID | Requirement |
|---|---|
| SITE-IA-01 | Every page file is classified as public, protected, redirect, not-found, or removed. |
| SITE-IA-02 | Every public page has one audience, intent, owner, canonical URL, and primary action. |
| SITE-IA-03 | Duplicate and legacy routes use one deliberate redirect chain. |
| SITE-NAV-01 | Desktop and phone navigation expose stable product, solution, proof, Planner, and contact paths. |
| SITE-NAV-02 | Protected and operational routes never appear as public destinations. |
| SITE-NAV-03 | Every navigation and cart link has a clear accessible name. |
| SITE-NAV-04 | Site search states its scope, supports keyboard use, and announces result state. |
| SITE-HOME-01 | The first desktop and phone viewport states audience, value, proof, and one primary action. |
| SITE-HOME-02 | Animated or split headings retain correct text spacing and reading order. |
| SITE-HOME-03 | Trust claims have an approved source, owner, and review date. |
| SITE-HOME-04 | Unsupported testimonials, ratings, urgency, and scale claims are absent. |
| SITE-PROD-01 | Released categories with active inventory never render as false empty categories. |
| SITE-PROD-02 | Product results expose image or symbol, name, SKU, family, dimensions, availability, and configuration state. |
| SITE-PROD-03 | Search, filter, sort, paging, and comparison are clear and reversible. |
| SITE-PROD-04 | Loading, empty catalog, no result, error, stale snapshot, and recovery are distinct. |
| SITE-PROD-05 | Product detail matches the released database contract and visible structured data. |
| SITE-PROD-06 | Drafts, internal prices, audit data, and private retired records never enter public responses. |
| SITE-PLAN-01 | Product or family identity survives Site-to-Planner entry. |
| SITE-PLAN-02 | Source, campaign, locale, and intent survive Site-to-Planner entry. |
| SITE-PLAN-03 | Planner confirms imported context and provides recoverable failure. |
| SITE-FORM-01 | Forms use minimal fields, visible labels, precise validation, and preserved valid input. |
| SITE-FORM-02 | Success appears only after accepted server receipt. |
| SITE-FORM-03 | Failure, retry, duplicate submission, and rate-limit states are truthful. |
| SITE-FORM-04 | Consent and privacy use are clear before submission. |
| SITE-MOB-01 | The first 844 phone pixels include page purpose and the primary action. |
| SITE-MOB-02 | Phone pages have no page-level horizontal scrolling at 390 pixels. |
| SITE-MOB-03 | Frequent phone actions use 44 by 44 pixel targets where practical. |
| SITE-MOB-04 | Product filters and comparison use a deliberate phone composition. |
| SITE-A11Y-01 | Primary Site journeys meet WCAG 2.2 AA. |
| SITE-A11Y-02 | Navigation, search, filter, compare, form, and Planner entry are keyboard-completable. |
| SITE-A11Y-03 | Focus stays visible and follows dialogs, menus, errors, and route changes correctly. |
| SITE-A11Y-04 | Search, filter, form, cart, and navigation states are announced. |
| SITE-PERF-01 | Field LCP is at most 2.5 seconds at the 75th percentile. |
| SITE-PERF-02 | Field INP is at most 200 milliseconds at the 75th percentile. |
| SITE-PERF-03 | Field CLS is at most 0.1 at the 75th percentile. |
| SITE-PERF-04 | Responsive images produce no broken request and below-fold media is deferred. |
| SITE-SEO-01 | Every indexable page has a unique title, description, canonical URL, and one coherent H1. |
| SITE-SEO-02 | Titles do not duplicate the brand suffix. |
| SITE-SEO-03 | Sitemap, robots, redirects, not-found behavior, and access classification agree. |
| SITE-SEO-04 | Structured data matches visible released content and uses stable identifiers. |
| SITE-CONTENT-01 | Claims are specific, supportable, owned, and reviewed. |
| SITE-CONTENT-02 | Content provides original Oando value and avoids filler or mass duplication. |
| SITE-CONTENT-03 | Every content page leads to a relevant product, Planner, or contact action. |
| SITE-MEASURE-01 | One event contract covers entry, engagement, product discovery, Planner entry, BOQ, and handoff. |
| SITE-MEASURE-02 | Rerenders, retries, redirects, and route changes do not duplicate events. |
| SITE-MEASURE-03 | Analytics excludes private geometry, BOQ lines, secrets, and unnecessary personal data. |

## Verification standard

Do not close an ID from static code review.

Load the root environment through the package-defined scripts.

Use a production-like build for final proof.

Check representative routes at 1440 by 900 and 390 by 844.

Check real keyboard order.

Check accessible names and announcements.

Check live and empty catalog categories.

Check product-to-Planner identity.

Check form success, failure, retry, and duplicate submission against isolated endpoints.

Check every request failure and console error.

Use field data for Core Web Vitals when available.

Use lab data only as a diagnostic.

Record exact commands and failures.

Never use screenshots or `results/` as proof of completion.

Never copy competitor assets, content, code, or trade dress.
