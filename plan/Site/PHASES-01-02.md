# Site Phases 1–2 — measurement foundation and commercial landing pages

## Phase 1 — conversion measurement and foundation

### Outcome

The public journey has a trustworthy baseline and one measurable conversion contract.

### Fresh baseline

- Read live routes, navigation, metadata, forms, and analytics code.
- Treat old reports and screenshots as reference only.
- Record current indexing, accessibility, performance, and conversion failures.
- Verify claims in a production-like build.
- Load root `.env.local` through package-defined scripts before live checks.
- Classify all current `(site)` page files as public, protected, redirect, not-found, or removed.
- Record the accepted audience, intent, owner, canonical URL, and primary action for every public page.

### Conversion contract

- Define the funnel from landing entry to Planner handoff completion.
- Define events for page view, meaningful engagement, Planner entry, project start, first placement, BOQ generation, handoff intent, success, and failure.
- Give every event a stable name, trigger, required fields, and owner.
- Use one source and campaign model.
- Prevent duplicate events from rerenders, retries, and route transitions.
- Keep Site and Planner event meanings identical.

### Privacy and consent

- Collect only fields needed for measurement.
- Exclude secrets, private project geometry, BOQ lines, and unnecessary personal data.
- Respect consent and regional requirements.
- Keep identifiers scoped and documented.
- Prevent analytics payloads from entering public logs accidentally.

### Reporting

- Verify event receipt in development and a production-like build.
- Build funnel, source, failure, and page reports.
- Separate real customers from internal and automated traffic where possible.
- Make missing data visible.
- Do not claim conversion performance from incomplete instrumentation.

### Public quality foundation

- Inventory public, private, duplicate, redirected, and dead routes.
- Set canonical, indexing, sitemap, and robots ownership.
- Establish accessibility and performance budgets.
- Establish supported mobile and desktop widths.
- Remove critical console, request, hydration, and navigation failures.
- Enforce unique titles, descriptions, canonical URLs, and coherent H1 text.
- Prevent duplicate brand suffixes.
- Require one deliberate redirect chain for legacy routes.
- Verify every navigation and cart link has an accessible name.
- Use field Core Web Vitals at the 75th percentile when available.

### Interface acceptance

This phase owns the baseline for:

- `SITE-IA-01` through `SITE-IA-03`.
- `SITE-MEASURE-01` through `SITE-MEASURE-03`.
- `SITE-PERF-01` through `SITE-PERF-04`.
- `SITE-SEO-01` through `SITE-SEO-03`.

The exact requirements are in `../../docs/architecture/09-SITE-UI-BENCHMARK.md`.

### Required proof

- Event contract tests.
- Duplicate-event tests.
- Consent and payload privacy checks.
- Production-like receipt verification.
- Route, canonical, sitemap, robots, accessibility, and performance baseline.

### Done when

- Every primary conversion event has one meaning and owner.
- Site and Planner events join into one funnel.
- Measurement does not expose private data.
- Baseline failures are visible before expansion begins.

---

## Phase 2 — commercial landing-page expansion

### Outcome

Public visitors understand Oando offers and reach the correct next action.

### Information architecture

- Define customer segments, needs, offers, and decisions.
- Map each page to one primary intent.
- Keep navigation shallow and understandable.
- Remove duplicate, orphaned, and conflicting routes.
- Give Planner, contact, and product discovery clear roles.

### Page quality

- State a specific value proposition.
- Use real Oando products, capabilities, and proof.
- Keep claims supportable.
- Explain who the offer serves and what happens next.
- Use one primary action and limited secondary actions.
- Avoid generic filler, fake urgency, and invented testimonials.
- Put audience, value, approved proof, and one primary action in the first desktop and phone viewport.
- Preserve correct text spacing and reading order in animated headings.
- Give every trust claim an approved source, owner, and review date.

### Interface quality

- Use a consistent responsive page system.
- Preserve content hierarchy across supported widths.
- Keep navigation and actions keyboard-accessible.
- Meet WCAG 2.2 AA for primary journeys.
- Keep images responsive and licensed.
- Meet the Phase 1 performance budgets.
- Keep product, solution, proof, Planner, and contact paths stable in desktop and phone navigation.
- Keep protected and operational routes out of public navigation.
- Give every icon-only navigation and cart link a clear accessible name.
- Make Site search scoped, keyboard-usable, and announced.
- At 390 by 844, show page purpose and the primary action in the first viewport.
- Avoid page-level horizontal scrolling at 390 pixels.
- Use 44 by 44 pixel frequent phone targets where practical.

### Conversion integration

- Attach the Phase 1 source and event contract.
- Preserve campaign context when entering Planner.
- Measure page-to-Planner progression and failure.
- Keep forms short and truthful.
- Confirm success only after successful delivery.
- Preserve valid input after failure.
- Show precise field errors and a recoverable retry state.
- Handle duplicate submissions and rate limits truthfully.
- Explain consent and privacy use before submission.

### Interface acceptance

This phase owns:

- `SITE-NAV-01` through `SITE-NAV-04`.
- `SITE-HOME-01` through `SITE-HOME-04`.
- `SITE-FORM-01` through `SITE-FORM-04`.
- `SITE-MOB-01` through `SITE-MOB-03`.
- `SITE-A11Y-01` through `SITE-A11Y-04` for landing and form journeys.

### Required proof

- Representative desktop and mobile browser journeys.
- Keyboard and accessibility checks.
- Performance-budget checks.
- Form success, failure, and retry checks.
- Page-to-Planner event verification.

### Done when

- Every commercial page has a clear audience, purpose, and next action.
- Claims are supported.
- Pages meet accessibility and performance budgets.
- Conversion paths are measurable.