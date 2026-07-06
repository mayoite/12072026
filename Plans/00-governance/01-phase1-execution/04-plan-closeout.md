# Plan 03 — Closeout (Phases 08–10)

Date: 2026-07-05

Authority: `01-implementation-decisions.md` · gates: `08-quality-gates.md` · failures: root `Failures.md`

Detail was merged from archived phase specs. See `archive/plans/2026-07-05_phase1-execution/phases/`.

---

## Remaining work (summary)

| Phase | Status | What is left |
|-------|--------|--------------|
| 08 | Planned | Supabase writer. Dual-read evidence. `block_descriptors` table (0409 deferred). |
| 09 | Planned | Lazy 3D. Export SVG/PNG/PDF/DXF. AI advisor jobs. Background progress UI. |
| 10 | Planned | Feature flag pilot. Rollback drill ≤30s. Archive cleanup manifest. Handover doc. |

Blockers: `PLAN-FAIL-0409` deferred (Phase 08 table). Route swap stays behind flag until Phase 10 sign-off.

---

## Phase 08 — Persistence and migration

**Goal:** Durable descriptor storage. Advisory locks. Schema version gate.

**Left:** Writer with `O_EXCL` lock. `409.lock_busy` vs `409.hash_mismatch`. Dual-read signed file. Migration apply.

**Deferred:** `PLAN-FAIL-0409` — `block_descriptors` Supabase table until migration owner runs `db:apply`.

**Checks:** `08-PERS-04` lock timeout · `08-PERS-10` versionMismatch → 422 · dual-read evidence before Verified.

---

## Phase 09 — 3D, export, AI

**Goal:** Lazy Three viewer. Multi-format export. AI sketch-to-plan with preview gate.

**Left:** Dynamic import three+r3f. Export preflight. ZIP multi-floor. AI scale calibration before submit. Server-only API keys.

**Checks:** `09-3D-01` lazy load · `09-EXP-04` DXF layers · `09-AI-03` preview→confirm→commit.

---

## Phase 10 — Route swap and handover

**Goal:** Flagged pilot. Rollback drill. Signed promotion manifest. Structured handover.

**Left:** Cohort + kill switch config. Grep-then-signoff for archive deletes. Residue purge from 01A. Handover with route status + risk register.

**Do not delete:** `OOPlanner/`, `open3d-next-staging/`, `site/_archive/fabric/` before manifest signatures.

**Checks:** `10-FLAG-01` feature flag · `10-ROLL-01` flip-back ≤30s · `10-HAND-01` handover template filled.

---

## Cross-links

- `06-benchmark-delivery.md` · `07-benchmark-governance.md`
- Delivery: `03-plan-delivery.md`
- Active failures: root `Failures.md` · resolved: `resolved-failures.md`
