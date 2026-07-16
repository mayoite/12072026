# Planner checklist

Code map: `FEATURES.md`. Blockers: `../../Failures.md`.

Fresh commands and exit codes must be recorded here. Old reports prove nothing.

---

## Step 0 — test isolation

- [ ] Catalog-writing tests satisfy Admin Step 0 isolation.
- [ ] Planner fixtures never change canonical catalog files.
- [ ] Browser tests use normal controls — no forced clicks.
- [ ] Each command overwrites its stable `results/planner/` folder.

---

## Phase 1 — start and BOQ

- [ ] Member, Admin, and private routes remain protected — fresh auth proof.
- [ ] Optional setup metadata can be skipped and edited later (`UI-ENTRY-03`).
- [ ] Setup is keyboard-complete with visible focus.
- [ ] One BOQ authority: unify or retire `workstationBoqV0`, `buildBoq` in favour of `projectFurnitureBoq`.
- [ ] BOQ groups stable product, family, option, and commercial identity.
- [ ] `PROJECT_START`, `FIRST_PLACEMENT`, `BOQ_GENERATED` conversion events wired without duplicates or private geometry.
  - Gap: events defined in `conversionContract.ts`; Planner never calls `trackConversionEvent`.
- [ ] Marketing, help, coach, and guest-command behavior verified in browser.

---

## Phase 2 — design workspace

- [ ] Deferred tools removed or implemented: room, dimension, text on rail.
- [ ] Columns and keep-outs creatable from canvas.
- [ ] `UI-CAT-01`…`UI-CAT-04` catalog presentation verified in browser.
- [ ] `DB-SVG-10`…`DB-SVG-16` released SVG served through server catalog API — not disk-only.
  - Gap: `svg-blocks` reads `block_descriptors` definitions when DB configured; falls back to disk; not committed artifact bytes.
- [ ] Released SVG is primary 2D symbol; honest fallback only on load/miss.
- [ ] `UI-STATE-01`/`02` save states distinct; failed save never shows success.
- [ ] `UI-SHELL-01`…`UI-SHELL-04` desktop shell benchmarks closed in browser.
- [ ] `UI-MOB-01`…`UI-MOB-04` phone layout benchmarks closed in browser.
- [ ] `UI-A11Y-01`…`UI-A11Y-04` primary journey accessibility verified.
- [ ] Primary journeys free of unexplained console, request, or hydration errors.
- [ ] Generated GLB loads end-to-end when policy allows.
- [ ] AI assisted layout verified in browser without errors.
- [ ] Quote cart covers all placed catalog furniture — not workstation-only.

---

## Phase 3 — scale, validate, and price

- [ ] Configuration survives 2D → 3D → validation → BOQ end-to-end.
- [ ] Row, array, grid bulk placement; group/ungroup; exact spacing; bulk preview.
- [ ] 100-seat and 2,000-seat layout performance budgets recorded and met.
- [ ] Production validation: overlaps (rotate-aware), walls, openings, boundaries, aisles, chairs.
  - Gap: `furnitureOverlap.ts` is stub only; no compliance rule engine exists in codebase.
- [ ] Approved accessibility rules versioned; advisory waivers require a reason.
- [ ] Revisions, BOQ, and handoff share the same validation result.
- [ ] Live price-book version and currency pinned in workspace BOQ.
  - Gap: demo-list INR in CSV export path today; admin price books not pinned in workspace.
- [ ] Workspace shows qty, unit price, adjustment, tax, line total; draft/demo prices never reach customers.
- [ ] Historical priced outputs reproducible from approved price book.
- [ ] Named immutable revisions record project, catalog, family, validation, and price versions.
  - Gap: `versioning.ts` is local snapshots only; no named revisions.
- [ ] Read-only review links, comments, and revocation work end-to-end.
  - Gap: schema exists; no API routes or review UI.
- [ ] Portal and admin plan views verified with live data.

---

## Phase 4 — deliver and handoff

- [ ] `UI-BOQ-02` customer-ready export distinct from draft export.
- [ ] `UI-BOQ-03` Send to Oando: explicit, recoverable, and idempotent.
  - Gap: not implemented.
- [ ] Handoff shows named revision, BOQ, pricing, exclusions, validation; blocks on hard errors.
- [ ] Submission delivers revision, BOQ, price version, validation result, and hash to Oando.
- [ ] Consent, status, time, revision, and hash recorded; safe retry on failure.
- [ ] All exports use one calculation authority; preserve product, revision, price, validation, hash.
- [ ] Handoff events defined in `conversionContract.ts` and emitted from Planner.
  - Gap: `HANDOFF_INTENT/SUCCESS/FAILURE` do not exist anywhere in codebase — define and implement from scratch.
- [ ] Handoff passes commercial authorization, CSRF, rate-limit, privacy, and provenance checks.

---

## Admin dependency

- [ ] Admin DB-SVG cutover (`DB-SVG-01`…`05`) complete; `svg-blocks` reads DB artifact bytes, not disk descriptors.
- [ ] Admin publish + catalog browser proof without false success.

---

## Close

- [ ] External customer completes full journey without developer help.
- [ ] Same product identity from discovery through BOQ and handoff.
- [ ] Oando receives the exact branded package the customer reviewed.
- [ ] Every applicable UI benchmark ID has fresh browser evidence.
- [ ] Fresh commands and exit codes recorded here.
- [ ] Only active failures remain in `../../Failures.md`.
