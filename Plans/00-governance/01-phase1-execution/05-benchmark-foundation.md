# Benchmark 01 — Foundation

Date: 2026-07-05

Merged from archived precheck and 01A/01B/03A/conversion reports.

Append-only. Add a dated note when evidence changes.

---

## Phase 00 precheck (2026-07-04)

**Result:** PASS. `PLAN-FAIL-0411` since resolved.

Lockfile clean. Governance files present. Workspace valid. R2 in I-D.

Evidence: `archive/plans/2026-07-05_phase1-execution/benchmarks/phase-00-precheck.md`.

---

## 01A — Workspace standard

**Required:** Canvas-first. One command system. Keyboard focus. Searchable inventory. Oando theme only. 90% floor, 95% target.

**Failures at write:** Hardcoded theme. Production `any`. Stub commands.

---

## 01B — Canvas feasibility

**Must prove:** mm pipeline. Pointer cleanup. Pan/zoom safe. Wall command + undo. Esc cancels. Snap visible. One command ID everywhere.

---

## 03A — Inventory and SVG

Browse ≠ search. Recents ≠ placed. Configurable facet. Theme-safe SVG. Roving focus.

---

## Conversion (essentials)

Principles only. No trade-dress copy. Canvas dominant. Site CSS tokens.

---

## Phase 02 & 03 — Verified (2026-07-05)

**Result:** PASS on both phases, live re-verify.

- Phase 02 (`svgTypes.ts` schema + `svgBlockDescriptorLoader.ts` + `blocksResolver.ts`): 127/127 tests green, exit 0. Checks ☑ `02-CAT-01` · ☑ `02-LOAD-01` · ☑ `02-ERR-01`.
- Phase 03 (`generate-svg.mjs` / `pipelineCore.ts` pipeline): 29/29 golden round-trip tests green, exit 0; sanitizer suite 8/8, exit 0. Checks ☑ `03-SVG-01` · ☑ `03-SVG-GS-01` · ☑ `03-TEST-01`.
- Finding: the three pinned golden `.svg` fixtures (`chaise`, `side-table`, `sectional`) were stale — byte-pinned to a pre-rewrite draft of `buildSvgString()`. Live pipeline output was confirmed correct against `site/public/svg-catalog/*.svg` (already-generated artifacts matching current code exactly); goldens were regenerated, no production code changed.

Evidence: `results/planner/benchmark/phase-02-03-benchmark.md` (updated), `results/open3d/phase02-03/vitest/vitest-run.json` + `vitest-raw.log`, `resolved-failures.md` § "2026-07-05 — Phase 03 stale golden fixtures".

---

## Cross-links

- `06-benchmark-delivery.md` · `07-benchmark-governance.md` · `10-review-workflow.md`
- `02-plan-foundation.md`
