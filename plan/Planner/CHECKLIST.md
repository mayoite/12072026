# Planner checklist

Status only. Code map: `FEATURES.md`. Requirements: `PHASES-01-02.md`, `PHASES-03-04.md`.

Treat every item as not done unless noted. Reconciled against `site/` on 2026-07-14.

## Shared start gate

- [ ] Catalog-writing tests satisfy Admin Step 0 isolation.
- [ ] Planner fixtures never change canonical catalog files.
- [ ] Browser tests use normal controls without forced clicks.
- [ ] Each Planner command overwrites its stable results folder.

## Phase 1 — start and BOQ

- [ ] Member, Admin, and private routes remain protected (fresh auth proof).
- [ ] `UI-ENTRY-03` optional setup metadata can be skipped and edited later.
- [ ] Setup is keyboard-complete with visible focus.
- [ ] One BOQ calculation authority (`projectFurnitureBoq`; unify or retire `workstationBoqV0`, `buildBoq`).
- [ ] BOQ groups stable product, family, option, and commercial identity.
- [ ] Site conversion events wired without duplicates or private geometry (`PROJECT_START`, `FIRST_PLACEMENT`, `BOQ_GENERATED`).
- [ ] Marketing, help, coach, and guest-command behavior verified in browser.
- [ ] Remove or wire dead `StartingPointStep.tsx`.

## Phase 2 — design workspace

- [ ] Deferred tools removed or implemented (room, dimension, text on rail).
- [ ] Columns and keep-outs creatable from canvas.
- [ ] `UI-CAT-01` … `UI-CAT-04` catalog presentation verified in browser.
- [ ] `DB-SVG-10` … `DB-SVG-16` released SVG authority through server catalog (not disk-only).
- [ ] Released SVG is primary 2D symbol; honest fallback only on load/miss.
- [ ] `UI-STATE-01` … `UI-STATE-02` save states distinct; failed save never shows success.
- [ ] `UI-SHELL-01` … `UI-SHELL-04` desktop shell benchmarks closed in browser.
- [ ] `UI-MOB-01` … `UI-MOB-04` phone layout benchmarks closed in browser.
- [ ] `UI-A11Y-01` … `UI-A11Y-04` primary journey accessibility verified.
- [ ] Primary journeys free of unexplained console, request, or hydration errors.
- [ ] Generated GLB loads when policy allows (end-to-end proof).
- [ ] AI assisted layout verified in browser without errors.
- [ ] Asset engine: PNG thumb stage; DB SVG revision tables live for planner reads.
- [ ] Quote cart covers all placed catalog furniture (not workstation-only).

## Phase 3 — scale, validate, and price

- [ ] Configuration survives 2D, 3D, validation, and BOQ end-to-end.
- [ ] Row, array, grid bulk placement; group/ungroup; exact spacing; bulk preview.
- [ ] 100-seat and 2,000-seat layout performance budgets recorded and met.
- [ ] Production validation: overlaps (rotate-aware), walls, openings, boundaries, aisles, chairs.
- [ ] Approved accessibility rules versioned; advisory waivers require a reason.
- [ ] Revisions, BOQ, and handoff share the same validation result.
- [ ] Live price-book version and currency pinned in workspace BOQ.
- [ ] Workspace shows qty, unit price, adjustment, tax, line total; draft/demo prices never reach customers.
- [ ] Historical priced outputs reproducible from approved price book.
- [ ] Named immutable revisions record project, catalog, family, validation, and price versions.
- [ ] Read-only review links, comments, and revocation work end-to-end (API + UI).
- [ ] Portal and admin plan views verified with live data.

## Phase 4 — deliver and handoff

- [ ] `UI-BOQ-02` customer-ready export distinct from draft export.
- [ ] `UI-BOQ-03` Send to Oando explicit, recoverable, and idempotent.
- [ ] Handoff shows named revision, BOQ, pricing, exclusions, validation; blocks on hard errors.
- [ ] Submission delivers revision, BOQ, price version, validation result, and hash to Oando.
- [ ] Consent, status, time, revision, and hash recorded; safe retry on failure.
- [ ] All exports use one calculation authority and preserve product, revision, price, validation, hash.
- [ ] `HANDOFF_INTENT`, `HANDOFF_SUCCESS`, `HANDOFF_FAILURE` emitted per Site contract.
- [ ] Handoff passes commercial authorization, CSRF, rate-limit, privacy, and provenance checks.

## Admin dependency

- [ ] Admin DB-SVG authority cutover (`DB-SVG-01`…`05`); Planner `svg-blocks` reads DB bytes not disk descriptors.
- [ ] Admin publish + catalog browser proof without false success (`FEATURES.md` Admin section).

## Completion

- [ ] External customer completes full journey without developer help.
- [ ] Same product identity from discovery through BOQ and handoff.
- [ ] Oando receives the exact branded package the customer reviewed.
- [ ] Every applicable UI benchmark ID has fresh browser evidence.
- [ ] Fresh commands and exit codes recorded here.
- [ ] Only active failures remain in `../../Failures.md`.
