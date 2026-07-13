# Planner checklist

Planner serves any external website customer.

The customer designs with available inventory and sends a branded BOQ to Oando.

All items require fresh verification.

## Public entry and site

- [ ] A clear public route explains the outcome and opens Planner quickly.
- [ ] Guest entry works without a false account requirement.
- [ ] Public navigation, product routes, contact paths, and Planner entry agree.
- [ ] Stable public routes have unique metadata and canonical URLs.
- [ ] Private, Admin, duplicate, and workspace-only routes are not indexed.
- [ ] Sitemap, robots rules, and structured data match live routes.
- [ ] Core Web Vitals are measured on representative mobile and desktop routes.
- [ ] Claims describe live capability. No fake cloud, price, AI, or sharing claims.

## Layout workflow

- [ ] The customer can create a room and edit dimensions in millimetres.
- [ ] Walls, openings, selection, move, rotate, resize, duplicate, and delete work.
- [ ] Undo and redo cover every document mutation.
- [ ] Grid, snapping, dimensions, text, zoom, pan, and fit controls are truthful.
- [ ] Inventory is searchable and placeable from the public catalog contract.
- [ ] Published SVG renders as the primary 2D symbol.
- [ ] `Block2D` appears only while SVG loads or when it is unavailable.
- [ ] Selection and properties remain synchronized.
- [ ] Save and reload preserve the normalized document.
- [ ] Failed save never displays success.
- [ ] Import and export round trips preserve canonical fields.

## 2D and 3D continuity

- [ ] The same item identity, position, rotation, scale, and options drive both views.
- [ ] Switching views does not mutate the document.
- [ ] 3D models use bounded scale, stable origin, and an explicit fallback.
- [ ] Camera, orbit, selection, and return to 2D are predictable.
- [ ] Missing models do not break the layout or BOQ.
- [ ] Representative layouts remain responsive at realistic item counts.

## Customer interface quality

- [ ] The canvas remains the dominant workspace.
- [ ] Catalog, tools, properties, and view controls have clear ownership.
- [ ] Contextual panels do not obscure the active design.
- [ ] Loading, empty, error, offline, saving, and saved states are distinct.
- [ ] Keyboard users can complete the workflow without dragging.
- [ ] Focus is visible and unobscured.
- [ ] Labels, targets, contrast, and announcements meet WCAG 2.2 AA.
- [ ] Supported mobile and desktop widths expose all essential controls.
- [ ] Destructive actions are recoverable or explicitly confirmed.

## Branded BOQ and Oando handoff

- [ ] BOQ is generated only from placed, catalog-backed products.
- [ ] Lines contain stable product identity, description, options, quantity, and units.
- [ ] Unsupported or unbranded items are excluded with a visible reason.
- [ ] The BOQ carries Oando branding and project context.
- [ ] JSON, CSV, and PDF totals and lines agree.
- [ ] Pricing is absent unless an approved price authority exists.
- [ ] Demo prices are removed from customer-facing output.
- [ ] The customer can review the BOQ before sending it.
- [ ] Submission reaches an Oando-controlled endpoint or inbox.
- [ ] Submission records consent, status, time, project revision, and BOQ hash.
- [ ] Retry does not create duplicate requests.
- [ ] The customer receives a truthful confirmation or actionable failure.

## Security and verification

- [ ] Guest and authenticated data boundaries are enforced server-side.
- [ ] Customer inputs, imports, SVG, and exports are validated and bounded.
- [ ] State-changing requests use CSRF protection where applicable.
- [ ] Public submission is rate-limited and abuse-resistant.
- [ ] Private project data is not exposed through URLs, logs, or client secrets.
- [ ] Focused unit, integration, and browser journeys pass from clean state.
- [ ] SEO, accessibility, responsive, and console checks pass on live routes.
- [ ] Typecheck, lint, and affected build checks pass.

## Completion record

- [ ] Fresh commands and exit codes are recorded here.
- [ ] Remaining failures are active entries in `../../Failures.md`.
- [ ] No resolved failure remains in `../../Failures.md`.
