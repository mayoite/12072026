# critique-summary

Historical critique snapshot. Reference-only; verify current status in implementation decisions, `Failures.md`, and live evidence.

Phase 0 governance critique. Full text: `archive/plans/00-global-standard-revision/critique.md`.

Expanded review: `archive/plans/00-global-standard-revision/critic/` (01–09).

Expanded copy: `00-governance/00-global-standard-revision/03-critique-expanded.md`.

---

## Top gaps (original)

- `generatedAt` vs idempotency (Phase 02 vs 08).
- Three `409` sources need distinct codes.
- `versionMismatch` should be `422`, not `404`.
- R2 bucket authority drift in I-D vs phases.
- Registry alias path drift (Phase 04 vs 05).
- DXF/DWF copy confusion (Phase 09).
- `STAGING_PHASE_01A_RESIDUE` orphan ref (Phase 10).

---

## Top-5 fixes (critique merge)

1. Stamp `generatedAt` once. Freeze on re-save.
2. Sticky 409 suffixes: `lock_busy`, `hash_mismatch`, `save_conflict`.
3. Map `versionMismatch` → `422`.
4. R2 bucket locked in I-D (`PLAN-FAIL-0407` resolved).
5. Registry alias documented in I-D.

---

## Critic package P0 (archive)

From `critic/08` and `09`:

- Status hygiene — partial. Use `Failures.md` + `PLAN-*.md` now.
- Evidence paths — fix non-existent `results/qa/...` cites.
- Schema `blocks` field — **resolved** (0413).
- Loader versioned files — **open** (Phase 08).
- GS gate checklists — in Q-G and Phase 04–06.

---

## Status at critique time (2026-07-05)

| Original blocker | Now |
|------------------|-----|
| blocks cast (0413) | Resolved |
| Admin/portal routes (0403/0404) | Implemented static |
| GS 0415–0420 | Doc + cmd-live |
| Coverage floor (0408) | **Open** |
| Playwright (003/004) | Deferred |

Failures: root `Failures.md`. History: `resolved-failures.md`.

---

## Required follow-up (if revisiting)

1. Re-run benchmark with all phases in scope.
2. Close 0408 with live `test:coverage` evidence.
3. Phase 08 loader + table (0409 deferred).

Cross-refs: `00-benchmark-summary.md`, `02-handover-summary.md`.
