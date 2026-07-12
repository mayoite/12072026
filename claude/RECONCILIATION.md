# Plan ↔ Repo reconciliation — Planner & Admin tracks

**Date:** 2026-07-12 · **HEAD:** `7807198d` · **Method:** read-only audit (plan cards vs. live code). Nothing modified.

**Scope note (per `AGENTS.md`):** Law = `Plans/` + live code. `results/` is a tool dump and is **not** treated as proof of PASS/status. Live browser runs and full test suites were **not executed**; UI PASS/REPROVE gates that require a browser are marked "not reverifiable here."

---

## 1. Headline verdict

**No card status flip is justified in either track.** Every PASS / REPROVE / OPEN / DONE is internally consistent with the code on this checkout. Planner `CHECKPOINTS.md` (CP-01…CP-10) exactly mirrors the card statuses.

The discrepancies found are **content/labeling issues**, not wrong statuses:
- One BOARD number (`288 tests PASS`) is almost certainly stale/mislabeled.
- One prose count in Admin A2 (`16` revisions) is stale vs. the real census (`18`).
- Several **evidence path** citations point at folders that don't exist or were renamed (cosmetic — `results/` isn't law).
- One genuine **stale code-path** residual: `site/features/planner/canvas-fabric/` (deleted) still referenced in 3 files.

---

## 2. Planner track

### 2.1 Confirmed honest (code matches plan)
- **HEAD `7807198d`** matches BOARD.
- **Fabric sole 2D host:** `PlannerFabricStage.tsx` renders `data-testid="planner-fabric-stage"` (L766); re-exported as `PlannerCanvasStage`, mounted once in `OOPlannerWorkspace.tsx:1130`. No second 2D host exists.
- **Both routes mount it:** `/planner/guest` and `/planner/canvas` → `PlannerWorkspaceRoute → PlannerHost → OOPlannerWorkspace → PlannerCanvasStage`. Legacy URLs (`/planner/open3d`, `/planner/fabric`, `/buddy-planner`, `/oando-planner`) 301-redirect to `/planner/canvas/` (`next.config.js`).
- **P09 "live Planner does not mount `PlannerThemeToggle`"** — TRUE. Toggle defined at `components/PlannerThemeToggle.tsx:18`, referenced only by its own unit test. Zero product JSX usages → REPROVE is correct.
- **P05 / P08 supporting code present:** `fabricBlock2D.ts` multiprim paint; `modularCabinetBlock` distinct fills; `modularCabinetV0.ts generateCabinetV0Mesh` builds named `toe/carcass/door-*` parts. REPROVE (needs rendered frame) is honest.
- **P02 single tool map:** `editor/canvasTool.ts` drives shortcut/label/rail/palette + `runtimeToolFor()` Fabric handler; imported by the stage (L19).
- **Batch-place journey red** (`tests/e2e/open3d-systems-v0-batch-place.spec.ts`) and **forbidden `site/results/` (layout FAIL)** — both real, both honestly stated on BOARD.
- **No `any`** in handwritten planner code (only match is inside a comment).

### 2.2 Discrepancies to fix

| # | File / line | Issue | Proposed change | Confidence |
|---|-------------|-------|-----------------|-----------|
| P-1 | `Planner-track/BOARD.md:16` | "Planner unit re-proof: **288** tests PASS." Authored planner unit surface is ~3,000+ `it/test` blocks across ~348 files (`test:planner` = `vitest run planner`). 288 cannot describe the whole suite (~10× off). | Either correct the number from a live `vitest run planner`, or relabel as **"targeted units"** (the phrase EXECUTE.md/P10 actually use). Do not leave "unit re-proof: 288." | High (count), figure needs live run |
| P-2 | `Planner-track/P08-mesh-quality.md` | Implies `3d/viewerMaterials.ts` materializes the cabinet parts. That module is **test-only** (no product importer of `getSharedMaterial`/`SHARED_GEOMETRIES`); cabinet-v0 uses its own inline materials. Its recent git edit was a one-line import-path fix, not behavior. | Drop/clarify the `viewerMaterials` reference so the card doesn't imply it's on the render path. | High |
| P-3 | `Planner-track/P01a-dead-path-cleanup.md` | Genuine stale **code**-path: `site/features/planner/canvas-fabric/` does not exist on disk but is still referenced in `config/build/eslint.config.mjs:89`, `components/repo-store/RepoStorePageView.tsx:114`, `tests/e2e/README.md:72,114`. | Add `canvas-fabric/` to the P01a residual list (this is exactly a P01a-class dead path). | High |

### 2.3 Evidence-path mismatches (cosmetic — `results/` is not law)
Cards cite `results/planner/world-standard-wave/<slug>/`; several slugs don't match the real folders:

| Card | Cites | Actual folder |
|------|-------|---------------|
| P01a | `00-dead-path-cleanup/` | absent |
| P01b | `00-orphan-cleanup/` | nested at `00-product-truth/orphan-cleanup/` |
| P07 | `07-draw-place/` | `07-browser-journey/` |
| P09 | `09-toolbar-themes/` | `09-shortcuts-chrome/` |
| P11–P16 | `results/planner/product-wave/...` | tree not created yet (cards are OPEN — expected) |

### 2.4 Not reverifiable here (need a live run)
UI PASS cards **P03, P04, P06, P07** and the browser gates behind REPROVE (**P02, P05, P08, P09**): supporting code confirmed present, but CONSTRAINTS requires a real browser run + screenshots — not executed in this audit. Typecheck PASS also not re-run.

---

## 3. Admin track

### 3.1 Confirmed honest (code matches plan)
- **A1 DONE:** spec `tests/e2e/admin-svg-publish-p01.spec.ts` present; editor UI present; **5 real SVGs** on disk in `public/svg-catalog/`; `p0:admin-svg` script present.
- **A2 DONE:** `compileSvgForPublish.ts`, `runSvgCompileStages.ts`, `generate-svg.mjs`, API route, `audit:svg-catalog` all present; census real (5 live / 5 published / 0 orphans).
- **A3 DONE:** `lib/auth/devAuthBypass.ts` returns `false` in production even with flag set (L46–49); unit test covers it; status route present.
- **A4 IN PROGRESS / OPEN (honest):** `admin-svg-engine-shell` shell (L358–435), non-locked `app/css/admin-svg-engine.css`, `core/locked/**` untouched, `scenePublishAuthority.test.ts`, engine adapters — all present. Browser/disk A4.0.1 proof correctly held OPEN: evidence dir `results/admin/no-code-svg-studio/` is **absent**, so no overclaim.
- **A5–A8 OPEN (accurate):** no unified catalog-ops queue / all-or-nothing CSV importer (A5); only a `workstationJson` textarea, which A6a explicitly lists as "not done" (A6); no price-book/BOQ code or migration (A7); publish artifacts exist but no release/approve/rollback surface (A8).
- Owner-lock honesty notes (SVG catalog = inventory publish only; A4 studio ≠ second plan canvas) match `AGENTS.md`.

### 3.2 Discrepancies to fix

| # | File | Issue | Proposed change | Confidence |
|---|------|-------|-----------------|-----------|
| A-1 | `Admin-track/A2-svg-pipeline.md` | Prose says "**16** revision snapshots excluded"; real `census.json` reports **18** (`side-table-001.N.json` count). | Update `16` → `18` (or generate the number from the census rather than hard-coding). | High |
| A-2 | `A1` (L36) | Cites `results/admin/svg-visibility/` — dir absent. | Repoint or drop. | High |
| A-3 | `A3` (L12) | Cites `results/admin/production-auth/` — dir absent. | Repoint or drop. | High |
| A-4 | `A1` (L9) | Cites `results/planner/p0-1-admin-svg-publish/` as a multi-artifact "fresh pack"; dir exists but holds only `01-list.png`. | Correct the description or re-record the pack. | High |
| A-5 | BOARD + A4–A8 | All `results/admin/**` evidence roots point into a tree that **does not exist** on this checkout (real evidence lives under `results/planner/`). | Repoint evidence roots (cosmetic — not law, but misleading). | High |

**No status change:** DONE cards have their code; OPEN cards genuinely lack implementation.

### 3.3 Not reverifiable here
A1–A3 DONE assessed by **code + script presence** (present), not runtime pass — E2E/audit scripts and browser were not executed.

---

## 4. One-line summary for the BOARDs

- **Planner BOARD:** honest on status; fix the `288` figure (P-1), the `viewerMaterials` implication in P08 (P-2), and log the `canvas-fabric/` dead path under P01a (P-3).
- **Admin BOARD:** honest on status; fix A2's `16`→`18` (A-1) and repoint the absent `results/admin/**` evidence paths (A-2…A-5).
- Everything else — statuses, dependency chains, host lock, owner-lock notes — reconciles cleanly with the code.
