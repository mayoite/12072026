# Evidence index — `results/planner/*`

**Purpose:** Map each planner evidence directory to what it means (slice, wave, or assessment).  
**Deep dumps stay in** `results/planner/` — this file is the owner-facing index only.  
**Handoff narrative:** [`results/planner/SESSION-RECAP.md`](../results/planner/SESSION-RECAP.md)  
**Repo rule:** work only in `D:\OandO07072026` (no git worktrees).

Typical contents per slice: `run.json` (machine summary) + `vitest-raw.log` / related logs. Some dirs are assessments only (`REVIEW.md`, `STATUS.md`, `REPORT.md`).

---

## Root / meta

| Path | Meaning |
|------|---------|
| [`results/planner/SESSION-RECAP.md`](../results/planner/SESSION-RECAP.md) | Full hard-path handoff: product spine, commits, residuals, run tips |
| [`results/planner/_tsc-wave.txt`](../results/planner/_tsc-wave.txt) | Typecheck wave capture (input to systematic-debug) |

---

## Phase / baseline gates

| Dir | Meaning |
|-----|---------|
| [`00a-start/`](../results/planner/00a-start/) | Plan **00A** start gates: typecheck, import-census, decision-record (each with `*-run.json` + raw log) |
| [`phase-1a/`](../results/planner/phase-1a/) | Phase 1A command-surface unit evidence (`vitest-1a-commands`) |
| [`phase-1b/`](../results/planner/phase-1b/) | Phase 1B SVG: boundaries + pipeline suites |

---

## Asset engine / SVG / GLB slices

| Dir | Meaning |
|-----|---------|
| [`asset-engine-skeleton/`](../results/planner/asset-engine-skeleton/) | Ordered SVG **S0–S7** + mesh **G0–G8** skeletons; first landing of stages + S1 + G5 |
| [`svg-authority/`](../results/planner/svg-authority/) | Publish compile authority notes: live = `pipelineCore+normalize`; V1 reference-only |
| [`svg-authority-wire/`](../results/planner/svg-authority-wire/) | Wire tests: compile-before-S4 / fail path before persist |
| [`svg-cli-smoke/`](../results/planner/svg-cli-smoke/) | Single-fixture SVG CLI smoke (`scripts:smoke:svg` class) |
| [`svg-cli-batch/`](../results/planner/svg-cli-batch/) | Batch SVG CLI / all generate-svg fixtures |
| [`puck-publish-fail-closed/`](../results/planner/puck-publish-fail-closed/) | Admin Puck publish: fail-closed if compile fails (no bad persist) |
| [`extrude-plan/`](../results/planner/extrude-plan/) | **G7** pure extrude plan (policy path under `catalog-assets/generated/`) |
| [`glb-stamp/`](../results/planner/glb-stamp/) | `stampFurnitureGeneratedGlb` + system-generated GLB URL allow/reject; place leaves GLB unset by default |
| [`g8-viewer-glb/`](../results/planner/g8-viewer-glb/) | **G8 partial**: policy reject, mock loader, scene pass-through, procedural default |
| [`g8-roundtrip/`](../results/planner/g8-roundtrip/) | `generatedGlbUrl` survives parse/export; scene nodes + cancel-safe late load |
| [`parametric-box-wire/`](../results/planner/parametric-box-wire/) | ParametricBuilder box mesh wired into scene factory |

---

## Modular place / footprint

| Dir | Meaning |
|-----|---------|
| [`modular-glb-plan/`](../results/planner/modular-glb-plan/) | **G4** modular cabinet plan-only (export plan, not full binary path) |
| [`modular-2d-footprint/`](../results/planner/modular-2d-footprint/) | `resolveFurniture2DFootprint` + modular cabinet-v0 footprint/mesh |
| [`modular-place/`](../results/planner/modular-place/) | Modular place → mesh path (core unit slice) |
| [`modular-place-smoke/`](../results/planner/modular-place-smoke/) | Integration smoke: place → scene node → mesh factory (cabinet-v0 group vs box) |
| [`modular-place-stamp/`](../results/planner/modular-place-stamp/) | Path-only + binary-export stamp helpers; procedural place default; path convergence |

---

## Open3d document / canvas / IDs

| Dir | Meaning |
|-----|---------|
| [`canvas-geometry/`](../results/planner/canvas-geometry/) | **02B.1** pick / snap / polygon geometry unit safety net |
| [`document-view-continuity/`](../results/planner/document-view-continuity/) | Same project → scene node ids match; pose rebuild; footprint after place |
| [`save-reload-continuity/`](../results/planner/save-reload-continuity/) | Document save/reload continuity (round-trip spine) |
| [`crypto-ids/`](../results/planner/crypto-ids/) | Entity IDs = `crypto.randomUUID()` only across planner surface |
| [`crypto-ids-residual/`](../results/planner/crypto-ids-residual/) | Residual: floor recover + canvas wall id via `newEntityId()` |
| [`entity-uuid-assert/`](../results/planner/entity-uuid-assert/) | Asserts `isEntityUuid` on place / createOpen3dProject defaults |
| [`fabric-stage-slice/`](../results/planner/fabric-stage-slice/) | Fabric furniture stage under `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` (flag OFF default) |
| [`dead-path-useCanvasDrawing/`](../results/planner/dead-path-useCanvasDrawing/) | Hygiene: `useCanvasDrawing` has no production callers; live walls = FeasibilityCanvas |

---

## Agent waves / verify / harden

| Dir | Meaning |
|-----|---------|
| [`hard-path/`](../results/planner/hard-path/) | Hard-path agent batch + wave3 vitest aggregates (links related slice dirs) |
| [`wave-superpowers/`](../results/planner/wave-superpowers/) | Combined superpowers wave (multi-slice pass, landed / notClaimed) |
| [`verify-wave/`](../results/planner/verify-wave/) | Verify gate: vitest + SVG smoke batch after wave |
| [`harden-wave/`](../results/planner/harden-wave/) | Harden follow-up (pipeline types, skipCompile, GLB policy, etc.) |
| [`systematic-debug/`](../results/planner/systematic-debug/) | Root-cause fix for `pipelineCore` polygon-clipping types (publish authority blocker) |

---

## Reviews / a11y / branch finish

| Dir | Meaning |
|-----|---------|
| [`code-review-wave/`](../results/planner/code-review-wave/) | Formal read-only review of asset-engine wave (`REVIEW.md`) — Ready to proceed; Important items tracked |
| [`a11y-open3d/`](../results/planner/a11y-open3d/) | Live browser a11y on `/planner/open3d` — **not clean pass** (see [`06-A11Y-OPEN3D.md`](./06-A11Y-OPEN3D.md)) |
| [`finishing-branch/`](../results/planner/finishing-branch/) | Assessment: already on `main`; finishing options (continue / tag / pause) — no PR |

---

## How to use this index

1. **Start product status** from [`00-PENDING.md`](./00-PENDING.md) and [`01-RECAP.md`](./01-RECAP.md) (if present).
2. **Prove a claim** → open the matching dir’s `run.json` (or `REPORT.md` / `REVIEW.md`), not only commit messages.
3. **After a new slice** → add `results/planner/<slice>/` and a one-line row here.
4. **Do not treat unit green as browser-done** — admin publish UI, G5 upload→G8 Chrome load, and a11y fixes remain open per pending list.

---

## Quick “spine” map (product path → evidence)

| Product claim | Primary evidence dirs |
|---------------|----------------------|
| SVG publish compile authority | `svg-authority/`, `svg-authority-wire/`, `puck-publish-fail-closed/` |
| SVG CLI fixtures | `svg-cli-smoke/`, `svg-cli-batch/` |
| Modular place → 2D/3D mesh | `modular-place/`, `modular-place-smoke/`, `modular-2d-footprint/` |
| Optional GLB stamp + G8 partial | `glb-stamp/`, `modular-place-stamp/`, `g8-viewer-glb/`, `g8-roundtrip/` |
| Crypto entity IDs | `crypto-ids/`, `crypto-ids-residual/`, `entity-uuid-assert/` |
| Document continuity | `save-reload-continuity/`, `document-view-continuity/` |
| Canvas geometry 02B.1 | `canvas-geometry/` |
| Stages inventory | `asset-engine-skeleton/` |
| Open3d a11y live | `a11y-open3d/` → owner summary [`06-A11Y-OPEN3D.md`](./06-A11Y-OPEN3D.md) |
| Code review | `code-review-wave/REVIEW.md` → owner summary [`05-CODE-REVIEW.md`](./05-CODE-REVIEW.md) if present |
