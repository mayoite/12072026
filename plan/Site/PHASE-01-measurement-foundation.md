# Site Phase 1 — conversion measurement and foundation

## Outcome

The public journey has a trustworthy baseline and one measurable conversion contract.

## Fresh baseline

- Read live routes, navigation, metadata, forms, and analytics code.
- Treat old reports and screenshots as reference only.
- Record current indexing, accessibility, performance, and conversion failures.
- Verify claims in a production-like build.

## Conversion contract

- Define the funnel from landing entry to Planner handoff completion.
- Define events for page view, meaningful engagement, Planner entry, project start, first placement, BOQ generation, handoff intent, success, and failure.
- Give every event a stable name, trigger, required fields, and owner.
- Use one source and campaign model.
- Prevent duplicate events from rerenders, retries, and route transitions.
- Keep Site and Planner event meanings identical.

## Privacy and consent

- Collect only fields needed for measurement.
- Exclude secrets, private project geometry, BOQ lines, and unnecessary personal data.
- Respect consent and regional requirements.
- Keep identifiers scoped and documented.
- Prevent analytics payloads from entering public logs accidentally.

## Reporting

- Verify event receipt in development and a production-like build.
- Build funnel, source, failure, and page reports.
- Separate real customers from internal and automated traffic where possible.
- Make missing data visible.
- Do not claim conversion performance from incomplete instrumentation.

## Public quality foundation

- Inventory public, private, duplicate, redirected, and dead routes.
- Set canonical, indexing, sitemap, and robots ownership.
- Establish accessibility and performance budgets.
- Establish supported mobile and desktop widths.
- Remove critical console, request, hydration, and navigation failures.

## Parallel work

- Route inventory and event design can run together.
- Privacy review can run with analytics integration.
- Performance and accessibility baselines can run in parallel.

## Required proof

- Event contract tests.
- Duplicate-event tests.
- Consent and payload privacy checks.
- Production-like receipt verification.
- Route, canonical, sitemap, robots, accessibility, and performance baseline.

## Done when

- Every primary conversion event has one meaning and owner.
- Site and Planner events join into one funnel.
- Measurement does not expose private data.
- Baseline failures are visible before expansion begins.
