# Plan Critique — 2026-07-04

Review covers the ten phase files in `plannnerplan/phases/` against
`IMPLEMENTATION-DECISIONS.md`, `QUALITY-GATES.md`, `DESIGN-BENCHMARK-PROTOCOL.md`,
`HANDOVER.md`, `FAILURESPLAN.md`, and `PACKAGES.md`. Cross-checked against
`plans/2026-07-04/benchmark.md`.

Cross-refs: `docs/superpowers/specs/2026-07-04-plannerplan-global-standard-revision-design.md`, `plans/2026-07-04/critique.md`, `plannnerplan/benchmarks/INDEX.md`.

## Coverage gaps

The ten phases all carry the eight required governance headings plus a
dated `Decision log` entry. Real holes are narrow but locally sharp:

- **Phase 02 §02-CAT-08 vs Phase 08 §08-PERS-05** — `generatedAt`
  generation rule and idempotency claim are mutually incompatible
  (see Internal contradictions).
- **Phase 08 §08-PERS-10** — `.versionMismatch` is mapped to HTTP
  `404`, but the slug existed; mismatch is an input-compatibility
  failure and should be `422` (or `400`), not a not-found status.
- **Phase 04 §04-ADMIN-12** — line is titled "Removed-task lint
  guard", which reads as a leftover placeholder label rather than
  a real forbidden pattern.
- **Phase 09 §09-EXP-05** — copy says "DWF/DXF compatibility" but
  DWF is a distinct Autodesk format from DXF; combining them
  invites honest-customer confusion. DXF-only label is safer.
- **Phase 10 §10-CLN-05** — references `STAGING_PHASE_01A_RESIDUE`
  from an earlier Phase 01A which is not present in any current
  phase file or in `FAILURESPLAN.md`. Treat as out-of-band artifact
  until reconciliation is recorded in `FAILURESPLAN.md`.
- **Phase 07 §07-TEST-04** — names
  `process.env.SUPABASE_SERVICE_KEY` as the leak signal, but the
  variable name is repo-dependent. The gate should be expressed
  as a regex over service-role patterns, not a single envvar name.

No required section is structurally absent. Forbidden-action lists
average 5 items each; phase-entry checklists 4–5; rollback criteria
3–4; risk register 3–4. Every phase quantifies at least three
success-metric budgets and every performance-budget section names
a p95 figure. Seven of ten phases have ≥ 3 rollback criteria; Phase
06 has 3, Phase 07 has 3, Phase 10 has 4 — minimum met everywhere.

## Internal contradictions

1. **Phase 02 §02-CAT-08 / Phase 08 §08-PERS-05 — `generatedAt`.**
   "generatedAt resolves to current unix-second at parse step" vs.
   "identical descriptor re-save yields byte-identical
   {slug}.{n+1}.json (schemaVersion + generatedAt + checksum
   determinism)". A parse-time stamp cannot satisfy byte-identical
   idempotency on repeat saves. **Resolution**: stamp `generatedAt`
   first-write time only, then freeze it inside the descriptor; the
   parser refuses to refill an existing stamp unless the field is
   missing.

2. **Phase 02 §02-ERR-03 / Phase 08 §08-PERS-04 / Phase 07 §07-AUTH-10
   — three 409 sources.** Read-time `.hashMismatch`, write-time
   `lockBusy`, and write-time save-conflict (with a probe token)
   all collapse to `409 Conflict`. A client cannot distinguish retry
   semantics. **Resolution**: introduce `error_code` sticky suffixes
   (`409.lock_busy`, `409.hash_mismatch`, `409.save_conflict`) and
   reserve the probe-token field for `409.save_conflict` only.

3. **Phase 04 §04-TEST-01 (lines 57–58) / Phase 07 §07-AUTH-04 —
   anonymous vs planner role.** Phase 04 specifies anonymous →
   `401` and planner-session → `403`; Phase 07 collapses
   non-admin to `403` without a 401 split. **Resolution**:
   Phase 07 should mirror Phase 04's two-status mapping so cross-
   matrix test in `07-TEST-01` does not have to invent the gap.

4. **`IMPLEMENTATION-DECISIONS.md` §96 vs Phase 03 §03-SVG-08,
   Phase 04 §04-ADMIN-08, Phase 05 §05-PORT-06, Phase 08 §08-PERS-07,
   Phase 10 §10-CLN-06 — R2 bucket name.** IMPLEMENTATION-DECISIONS
   lists `<bucket per IMPLEMENTATION-DECISIONS.md>` under "still requiring explicit owner
   approval", while every downstream phase locks the name as final.
   **Resolution**: either move the bucket name out of "needs
   approval" in IMPLEMENTATION-DECISIONS, or have every phase cite
   the approving owner and date inline.

5. **Phase 02 §02-CAT-09 vs Phase 02 §02-ERR-01 — `.hashMismatch`
   semantic.** `hashMismatch` is described as a "mutated field"
   detection that refuses to load, but the error taxonomy places it
   in the same family as `notFound`/`invalid`. **Resolution**:
   treat `.hashMismatch` as a corruption signal that quarantines the
   descriptor and surfaces `409` (per resolution 2) instead of a
   generic loader-bucket failure.

## Scope creep

- **Phase 09** mixes 3D mount, four exporters, and a Tier-3 AI contract
  reservation. Three big slices in one phase. Acceptable given
  IMPLEMENTATION-DECISIONS, but watch exit-gate compounding.
- **Phase 08** pairs JSON-on-disk with Supabase schema plus an
  expected dual-read evidence gate. The Supabase design is largely
  speculative; keep it fenced behind the dual-read gate and do not
  let it consume checklist slots for v1 delivery.
- **Phase 10 §10-CLN-05** references
  `STAGING_PHASE_01A_RESIDUE` from an unmodeled cycle. Either bring
  it into scope (FAILURESPLAN entry) or excise the reference.
- **Phase 04 §04-ADMIN-04** appends both editor paths to
  `site/config/route-contract.json`; that contract file is
  authoritative in Phase 07 / Phase 06 and Phase 04 must not own
  its schema. **Resolution**: Phase 04 owns appends, Phase 07
  owns schema — make this ownership explicit.

No phase invents packages outside the locked set in PACKAGES.md.

## Forbidden-list omissions

Each phase now has a "Forbidden actions" section. Items below are
phase-specific anti-patterns that would strengthen the list but are
currently absent:

- **Phase 01**: forbid `pnpm install --no-frozen-lockfile`,
  `--strict-peer-dependencies=false`, suppress-peer-warnings
  filters, and any `@types/fabric` patch involving `:any`.
- **Phase 02**: forbid JSDOM-typed Node import inside schema files;
  forbid any `z.object` declared as `Record<string, z.ZodType>`.
- **Phase 03**: forbid emitting slugs not matching
  `^[a-z][a-z0-9-]{1,63}$` even if validator passes the descriptor.
- **Phase 04**: forbid `child_process.spawn` with `shell: true`;
  forbid mounting `<Puck>` outside `/admin/svg-editor/**`.
- **Phase 05**: forbid inlining base64 PNG into descriptor
  response — only R2 URL is allowed.
- **Phase 06**: forbid monkey-patching `svgSymbols.ts` for runtime
  fallback (current `01-INST-05` mentions but no explicit forbiddance).
- **Phase 07**: forbid reading `withAuth` role ID from query
  parameter; the role must come from server-side session.
- **Phase 08**: forbid writing through `unlink + write` instead
  of `rename`.
- **Phase 09**: forbid silently skipping the JSON-render contract
  doc before activating the package; do not let a "future task"
  slip to default-on.
- **Phase 10**: forbid committing any change; explicit repeat
  required so it survives copy-paste of phase 04's exit text.

## Status vocabulary hygiene

Confirmed via grep: no `wip`, `todo`, `drafting`, `STUB`,
`NOT_STARTED`, `FIXME`, `TBD`, or `XX-XX` literals in
`plannnerplan/phases/`. Every `Status:` header reads `Planned`.
`IMPLEMENTATION-DECISIONS.md` §24 vocabulary is followed verbatim
in Decision logs and Exit gates. One minor surface label drift:
"Removed-task" in Phase 04 §04-ADMIN-12 is non-vocabulary and likely
a typo.

## Cross-source-of-truth drift

- **PACKAGES.md locked set** — every phase that imports a runtime
  package reconciles cleanly with PACKAGES.md Tier-1.
- **`puckBlockRegistry.ts`** — Phase 04 owns declaration at
  `features/planner/admin/puckBlockRegistry.ts` (reasoned from
  Phase 04's narrative). Phase 05 references a re-export alias
  at `site/admin/puckBlockRegistry.ts`. Two different paths.
  **Resolution**: pick one canonical path or document the alias
  relationship in `IMPLEMENTATION-DECISIONS.md`.
- **JSON-on-disk location** — `site/block-descriptors/` is
  consistent across Phase 02, 04, 06, 08. Phase 08 §08-PERS-02
  defines `{slug}.{n}.json` plus a `{slug}.latest.json` pointer;
  no other phase references the pointer file by name. Confirm
  Phase 06's loader reading the pointer rather than per-version
  files. Phase 06 §06-INV-03 does not name the pointer.
- **R2 vs public distinction** — consistent. SVG → `public/svg-catalog/`;
  PNG → R2 `<bucket per IMPLEMENTATION-DECISIONS.md>`. Phase 05 §05-PORT-04 declares a
  CDN URL `https://cdn.oando.co.in/<bucket per IMPLEMENTATION-DECISIONS.md>/{slug}.png`;
  no phase contradicts this.
- **`status` vocab contract** — HANDOVER.md mirrors I-D vocabulary
  and every phase Status header matches.

## Top 5 priority fixes (most impactful first)

1. **`plannnerplan/phases/02-catalog-source-of-truth-and-blockdescriptor.md` §02-CAT-08**
   — `generatedAt` rule contradicts §08-PERS-05 idempotency claim.
   Fix: stamp `generatedAt` once on first parse; subsequent parses
   preserve the existing value; document in Decision log.

2. **`plannnerplan/IMPLEMENTATION-DECISIONS.md` §96**
   — R2 bucket name `<bucket per IMPLEMENTATION-DECISIONS.md>` listed as still-needs-
   approval while every downstream phase locks it. Fix: move out
   of "still requiring explicit owner approval" or have all five
   downstream phases cite the approving owner/date.

3. **`plannnerplan/phases/02-catalog-source-of-truth-and-blockdescriptor.md` §02-ERR-01**
   — three competing 409 sources (`hashMismatch`, `lockBusy`,
   `save_conflict`) with overlapping semantics. Fix: introduce
   error-code sticky suffixes and reserve `probe_token` for the
   save-conflict variant.

4. **`plannnerplan/phases/08-persistence-and-migration.md` §08-PERS-10**
   — `.versionMismatch` mapped to HTTP `404`; should be `422` (or
   `400`). Fix: change mapping and surface `Open3dDescriptorError.versionMismatch`
   as a parse-time input rejection.

5. **`plannnerplan/phases/05-portal-public-render.md` §05-PORT-04**
   — registry alias path (`site/admin/puckBlockRegistry.ts` vs
   Phase 04's author location) drifts across files. Fix: document
   the alias path in `IMPLEMENTATION-DECISIONS.md` or merge the
   paths, then have Phase 07's registry import type-check both.

(Runner-up gaps worth sequencing after these five: Phase 07
§07-AUTH-04 anonymous-vs-planner split; Phase 09 §09-EXP-05 DXF/DWF
copy; Phase 10 §10-CLN-05 STAGING_PHASE_01A_RESIDUE scope drift.)

## Acceptance recommendations

- **Verdict**: revise.
- **Reason**: structural coverage is complete; the ten phases
  reconcile cleanly with PACKAGES.md and the locking decisions in
  `IMPLEMENTATION-DECISIONS.md`. The blockers are five small,
  high-signal alignment gaps: a generatedAt/idempotency collision,
  a 409-source collision collapsing three distinct retry semantics,
  a status-code misuse for `versionMismatch`, an R2 bucket
  authority line that contradicts locked phases, and a registry
  alias path that diverges between Phase 04 and Phase 05.
- **Required follow-up**:
  1. Apply Top-5 fixes above in a single coordinated revision
     (one pass through IMPLEMENTATION-DECISIONS, Phase 02, Phase
     08, Phase 09, Phase 05).
  2. Re-run `plans/2026-07-04/benchmark.md` with all
     ten phases in scope (the current benchmark covers only
     governance files + Phase 01).
  3. Add Forbidden-action lines for each phase per the
     Forbidden-list omissions section, or document why each was
     intentionally left out.
  4. Once the five fixes land, verdict progresses to **ship**
     for Phases 01–09; Phase 10 stays `Planned` until earlier
     phases reach `Verified in staging`.
