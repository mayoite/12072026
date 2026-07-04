# Phase 10 — Route Swap, Cleanup & Handover

Date: 2026-07-04
Status: Planned

## Objective
Prep the route swap pilot behind an explicit feature flag (cohort, kill switch, expiry, telemetry boundaries), keep `/planner/guest` and `/planner/canvas` on Fabric for production risk, run a rollback drill with evidence, retire archive mirrors only after production-path verification, and deliver a structured handover so the next session can pick up without context loss. Cleanup is gated on signed evidence; the locked package set is preserved end-to-end.

## Inputs to read
- `D:\new\plannnerplan\IMPLEMENTATION-DECISIONS.md` — locked package set, route map, promotion manifest definition
- `D:\new\plannnerplan\QUALITY-GATES.md` — Phase exit rule, deferred gates cleared for this phase (soak, cleanup)
- `D:\new\plannnerplan\DESIGN-BENCHMARK-PROTOCOL.md` — what donor visuals NOT to carry forward
- `D:\new\plannnerplan\phases\01-...md` through `09-...md` — production path status per slice
- `D:\new\PACKAGES.md` — locked package set (cannot be undone)
- `D:\new\CONTENTS.md` — repo map including `OOPlanner/`, `open3d-next-staging/`, `site/_archive/fabric/`

## Scope
In scope: feature flag config (cohort, kill switch, expiry, telemetry), route swap pilot rules, rollback drill with deterministic flip-back ≤ 30 s, promotion manifest template (source / destination / SHA-256 / donor revision / approval evidence), per-user-class auth behavior table, grep-then-signoff for archive removals, asset classification table, residue purge from Phase 01A STAGING_PHASE_01A_RESIDUE, asset allowlist / CSP review against admin R2 bucket, decision log entries for every removal, handover document covering architecture / route status / catalog-admin ownership / persistence / uploads-AI-export-3D status / verification commands / file list changed / ownership per dimension / active risk register.

Out of scope: Mantine install, re-doing any earlier phase's working surface, deleting `OOPlanner/`, `open3d-next-staging/`, or `site/_archive/fabric/` before manifest signatures, commit of any package-set changes (orchestrator owns commits), migrations that delete the JSON-on-disk layer.

## Architecture
```mermaid
flowchart TB
    A[Feature flag config] --> B{cohort in pilot set?}
    B -->|yes| C[/admin/svg-editor + /admin/svg-editor/[id] enabled]
    B -->|yes| D[/portal/svg-catalog[/slug] public preview]
    B -->|no| E[/planner/guest + /planner/canvas stay on Fabric 7.4.0]
    C --> F[Promotion manifest signed before merge]
    D --> F
    F --> G[Recipient branch receives]
    G --> H[Rollback drill: flip flag simulating production]
    H -->|≤30s| I[Routes swap back to Fabric]
    H --> J[results/planner/phase-10/rollback/ evidence]
    F --> K{manifest all evidence signed?}
    K -->|yes| L[site/_archive/fabric/ no longer needed; not deleted]
    K -->|no| M[Removal blocked]
```

Manifest includes: source path (e.g. `site/features/planner/open3d/`), destination path (production workspace), SHA-256 of archive mirror at promotion time, donor revision (commit SHA), approval evidence file path.

## Checklist
### Route swap (10-ROUTE)
- 10-ROUTE-01 Feature flag config: dedicated cohort id, kill switch, expiry timestamp, telemetry boundaries (no PII in pilot events); documented in `site/config/feature-flags.json` per-repo standard.
- 10-ROUTE-02 `/planner/guest` and `/planner/canvas` remain on Fabric 7.4.0 regardless of flag state — Fabric is the production-path risk floor.
- 10-ROUTE-03 `/planner/open3d` pilot kept; pilot scoped to specific cohort only, never broadcast.
- 10-ROUTE-04 `/admin/svg-editor` + `/admin/svg-editor/[id]` enabled only when admin cohort flag is on; `withAuth(['admin'])` continues to gate even when flag is on.
- 10-ROUTE-05 `/portal/svg-catalog` and `/portal/svg-catalog/[slug]` enabled progressively behind a second flag; portal progressive rollout is independent of admin flag flips.
- 10-ROUTE-06 Rollback rehearsal: flag flip simulating production-path verification, routes swap back to Fabric within ≤ 30 s of flip; rollback evidence preserved in `results/planner/phase-10/rollback/`.
- 10-ROUTE-07 Promotion manifest template: source path, destination path, SHA-256 hash, donor revision, approval evidence; one manifest per route slice.
- 10-ROUTE-08 Auth behavior verified separately for guest / member / admin: each user class gets correct route visibility under each flag.

### Cleanup (10-CLN)
- 10-CLN-01 Grep search before any archive removal: under `site/features/planner/` and `site/scripts/` import graph proves zero live references to `_archive/fabric/` paths; evidence saved under `results/planner/phase-10/cleanup/grep.txt`.
- 10-CLN-02 `site/_archive/fabric/` is NOT deleted until 10-CLN-01 evidence signed; archive remains as documented rollback drill target for ≥ 60 days after production acceptance.
- 10-CLN-03 `OOPlanner/` and `open3d-next-staging/` are NOT deleted until production acceptance + manifest signed; they remain as immutable donor snapshots.
- 10-CLN-04 Asset classification table: product images / 3D assets stay in R2 (not git); runtime / editor assets may move to `site/public/` or CDN; classification reviewed before any cleanup.
- 10-CLN-05 Phase 01A STAGING_PHASE_RESIDUE cleanup is no longer required; the residue list has no remaining items after the 2026-07-04 plan revision rewrites removed the legacy ID. No artifact preconditions are referenced.
- 10-CLN-06 Asset allowlist / CSP review against admin R2 bucket URL per IMPLEMENTATION-DECISIONS.md; CSP tightened if `frame-ancestors` or similar was relaxed during the admin rollout.
- 10-CLN-07 Decision log: every archive removal gets entry with permission, retirement reason, and restore procedure; documented in `HANDOVER.md`.

### Handover (10-HAND)
- 10-HAND-01 Architecture summary: native → archive → production path status per package slice (engines, SVG pipeline, admin panel, AI reserved).
- 10-HAND-02 Route status table with auth behavior per user class (guest / member / admin × route × flag).
- 10-HAND-03 Catalog / admin ownership + product identity preservation summary; references Phase 02 schema and Phase 04 editor path.
- 10-HAND-04 Persistence + document schema decisions; references Phase 08 atomic-rename + Supabase deferred.
- 10-HAND-05 Uploads / AI / export / 3D status; Tier-3 reserved rule preserved.
- 10-HAND-06 Verification commands list OR explicit skipped-check list with reason per skip; nothing silently missed.
- 10-HAND-07 File list changed (last 25 commits) with assumed-coverage note for each.
- 10-HAND-08 Ownership table per dimension in the order defined by IMPLEMENTATION-DECISIONS §"Non-negotiable release dimensions" (verbatim, governance order): (1) Workflow integrity, data safety, auth correctness; (2) Drawing-tool and geometry correctness; (3) UX and accessibility; (4) UI structure and responsive layout; (5) Inventory architecture and arrangement; (6) Dockable, movable, recoverable toolbars/panels; (7) Visual outlook, consistency, performance.
- 10-HAND-09 Risk register current — refreshed against post-promotion reality, not pre-pilot plan.

### Tests (10-TEST)
- 10-TEST-01 Rollback drill evidence preserved in `results/planner/phase-10/rollback/` (timestamp, flag-state, swap duration ≤ 30 s, observed routes).
- 10-TEST-02 Soak evidence in `results/planner/phase-10/soak/` (1-hour continuous session per cohort; no PII; failure modes if any).
- 10-TEST-03 Cleanup manifest evidence in `results/planner/phase-10/cleanup/` (grep output, CSP review diff, asset classification table).

## Exit gate
- Feature flag config shipped with cohort, kill switch, expiry, telemetry boundaries; documented.
- Rollback drill evidence present and swap time ≤ 30 s.
- Promotion manifest drafted for every route slice; SHA-256 hashes match the donor revisions recorded at IMPLEMENTATION-DECISIONS commit.
- Auth behavior table verified against guest / member / admin expectations per route slice.
- Grep evidence present for archive removal preconditions; class decision log entries signed.
- Handover doc covers all nine 10-HAND items with no pending placeholder or skipped-check.
- Status flow: `Planned → Implemented` after route swap config + rollback drill artifacts land; `Verified in staging` after a full pilot cohort run completes; `Verified in production path` after Fabric routes survive a parallel pilot at production-equivalent tier with manifest signed; `Piloted` after one full cohort cycle; `Accepted` after roll-forward AND rollback both run clean, and the next-session HANDOVER.md self-test passes.

## Phase governance
### Forbidden actions
- Do NOT delete `OOPlanner/`, `open3d-next-staging/`, or `site/_archive/fabric/` before manifest signatures.
- Do NOT undo the locked package set; any package change requires IMPLEMENTATION-DECISIONS amendment first.
- Do NOT commit migrations (or any code) that delete the JSON-on-disk layer while Phase 08 Supabase dual-read evidence is unsigned.
- Do NOT flip to default-on for `/admin/*` or `/portal/*` without a signed promotion manifest and active rollback drill.
- Do NOT commit anything from this phase (orchestrator owns commits per HANDOVER.md).

### Phase entry checklist
- All earlier phases (01-09) reported at least `Implemented`; promotion manifest build is gated on at least `Verified in staging` for routes it intends to ship.
- Fabric 7.4.0 smoke green on `/planner/guest` and `/planner/canvas`.
- Feature flag infrastructure already in repo (per `site/config/feature-flags.json`).
- `results/planner/phase-10/` directories initialized.

### Rollback criteria
- Rollback drill flip back to Fabric fails to converge in ≤ 30 s → flag config regression; abort promotion.
- Manifest SHA-256 mismatch between archive mirror and donor revision → promote blocked; recompute hashes.
- Grep evidence shows residual live references to `_archive/fabric/` → archive removal blocked.
- Soak run exposes a regression only seen at production-path tier → step back to `Piloted`, document.

### Risk register
- Risk: feature flag system silently treats expired flags as on. Mitigation: explicit expiry evaluation at boot, log "flag expired" with timestamp.
- Risk: pilot cohort leaks outside the intended users. Mitigation: cohort id is tenant-scoped; events audit-trail with no PII.
- Risk: archive removal accidentally strips an asset still needed for rollback drill. Mitigation: asset classification table + grep evidence required for deletion.
- Risk: HANDOVER doc placeholder for skipped-check quietly survives acceptance. Mitigation: explicit skipped-check list with reason per item, AI-read for self-test by next session.

### Success metrics
- Rollback swap duration p95 ≤ 20 s, p99 ≤ 30 s.
- Soak failure rate < 0.5% over 1-hour continuous run per cohort.
- Manifest divergence between archive and donor: 0.
- Auth matrix correctness 100% over a 3-class × route slice test.

### Dependencies
- Phase 01-09 implementations + their exit gates; HANDOVER.md current.
- `site/config/feature-flags.json` infrastructure.
- `site/_archive/fabric/` archive mirror as documented rollback target.
- Promotion manifest template at `plannnerplan/manifests/`.

### Performance budgets
- Boot-time flag evaluation p95 ≤ 25 ms.
- Promotion manifest checksum p95 ≤ 80 ms; per-slice hash budget kept.
- Rollback drill swap measurement keeps ≤ 30 s budget headroom.

### Security considerations
- Feature flag rules emit no PII in telemetry events; cohort id is hashed.
- Admin R2 bucket URL per IMPLEMENTATION-DECISIONS.md is allowlisted in CSP; review ensures CSP is unchanged or tightened, never relaxed.
- Auth behavior verified for every cohort; no admin impersonation risk during pilot.
- Archive removal is reversible: every retired path has a restore procedure in `HANDOVER.md`.

### Accessibility considerations
- Handover doc is screen-reader-clean (no flattened images in 10-HAND tables).
- Auth matrix exported with named headers; cohort IDs not silently truncated.
- Pilot users are informed of the cohort they're in via the standard readable notice pattern.

### Decision log
- 2026-07-04 — Decision: rollback swap ≤ 30 s hard target. Reason: production-path risk floor (Fabric 7.4.0 deployment) needs predictable flip-back. Alternatives: 60 s — rejected as too lax for an admin-tier surface. Owner: Coordinator agent.
- 2026-07-04 — Decision: archive removal gated on grep evidence + signed decision log. Reason: HANDOVER.md forbids silent deletions; restoration procedure must be reproducible. Alternatives: codify removals in CA-only — rejected because grep evidence is the cheapest audit. Owner: Coordinator agent.
- 2026-07-04 — Decision: cohort id tenant-scoped and hashed in pilot telemetry. Reason: anti-PII rule plus leak protection. Alternatives: pseudonymized hash alone — accepted but supplemented with tenant scope. Owner: Coordinator agent.
- 2026-07-04 — Decision: production-path verification requires manifest signature. Reason: IMPLEMENTATION-DECISIONS promotion rule; without manifest, no merge. Alternatives: branch-protection rule only — rejected as not auditable. Owner: Coordinator agent.
