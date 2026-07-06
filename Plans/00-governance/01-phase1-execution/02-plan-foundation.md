# Plan 01 — Foundation (Phases 00–03)

Date: 2026-07-05

Authority: `01-implementation-decisions.md` · gates: `08-quality-gates.md` · failures: root `Failures.md`

Detail was merged from archived phase specs. See `archive/plans/2026-07-05_phase1-execution/phases/`.

---

## Remaining work (summary)

| Phase | Status | What is left |
|-------|--------|--------------|
| 00 | Precheck done | Mark Accepted after commit hygiene on `main`. |
| 01 | Done (2026-07-05) | Fabric 7.4.0 pin confirmed. Typecheck exit 0. |
| 02 | **Verified (2026-07-05)** | Checklist green — schema/loader/resolver 127/127 tests pass, exit 0. See `results/planner/benchmark/phase-02-03-benchmark.md`. |
| 03 | **Verified (2026-07-05)** | Three golden fixtures (union/difference/intersection) pass 29/29; stale goldens found + regenerated, no code change. Sanitizer suite 8/8 pass. See `resolved-failures.md`. |

Blockers: `PLAN-FAIL-0408` (coverage) is cross-phase. See root `Failures.md`.

---

## Phase 00 — Governance baseline

**Goal:** Lock governance before code.

**Done:** Five governance files exist. `phase-00-precheck.md` PASS. Lockfile clean. R2 authority in I-D. `Plans/00-governance/01-phase1-execution/` is the live governance path.

**Left:** Flip status to Accepted. One commit boundary before Phase 01 if not already signed.

**Checks:** `00-PRE-01` lockfile · `00-PRE-04` files present · `00-PRE-06` git clean · forbidden-pattern scan.

---

## Phase 01 — Engine lock

**Goal:** Pin Fabric 7.4.0 and Three r185. Prove dev boot.

**Left:** Exact pins in `site/package.json`. Single `pnpm add` for Tier-1 set. `/planner/guest` smoke. No Mantine yet.

**Rollback:** `PLAN-FAIL-0401` if peer warnings become errors.

**Checks:** `01-INST-00` fabric pin · `01-WORK-04` staff 3D smoke lazy-loaded.

---

## Phase 02 — BlockDescriptor ✅ Verified 2026-07-05

**Goal:** One Zod schema. One loader. Typed errors.

**Done in code:** `svgTypes.ts` schema. `blocks` field. Loader exports. Resolver cast removed.

**Done (verified live):** Full checklist green. `parseFresh` / `parseExisting` tests pass. `Open3dDescriptorError` union covered. 127/127 tests pass (schema + loader + resolver), exit 0.

**Checks:** ☑ `02-CAT-01` schema export · ☑ `02-LOAD-01` loadAll/loadBySlug/tryLoad · ☑ `02-ERR-01` error union.

**Evidence:** `results/planner/benchmark/phase-02-03-benchmark.md`, `results/open3d/phase02-03/vitest/vitest-run.json`.

---

## Phase 03 — SVG pipeline ✅ Verified 2026-07-05

**Goal:** `generate-svg.mjs` → public SVG + R2 PNG. Idempotent output.

**Done in code:** Script present (`PLAN-FAIL-0402` resolved). Option A pipeline. Anti-copy in script header.

**Done (verified live):** Three fixture blocks (union/difference/intersection) present, golden byte tests pass 29/29. Sanitizer on output confirmed (8/8 + suite assertions). Performance budget (<200ms/fixture) confirmed. Three golden `.svg` fixtures were found stale (pre-rewrite `buildSvgString()` shape) during re-verify and regenerated from the verified live pipeline output — no production code changed.

**Checks:** ☑ `03-SVG-01` six pipeline steps · ☑ `03-SVG-GS-01` semantic tokens only · ☑ `03-TEST-01` golden round-trip.

**Evidence:** `results/planner/benchmark/phase-02-03-benchmark.md`, `resolved-failures.md` § "2026-07-05 — Phase 03 stale golden fixtures", `results/open3d/phase02-03/vitest/vitest-run.json`.

---

## Cross-links

- `05-benchmark-foundation.md`
- `03-plan-delivery.md`
- `10-review-workflow.md`
