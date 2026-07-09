# P08 suggestions — mesh quality (W7)

**Reviewer:** planning expert (trust-data)  
**Date:** 2026-07-09  
**Plan:** [phases/P08-mesh-quality.md](../phases/P08-mesh-quality.md)  
**Mode:** plan-only · **no product code** · no worktrees · superpowers required at execution

---

## Path verification (live tree 2026-07-09)

| Path | Status | Note |
|------|--------|------|
| `site/features/planner/open3d/catalog/modularCabinetV0.ts` | **OK** | `generateCabinetV0Mesh` = carcass full H + doors on full H; **no toe**; `DOOR_THICKNESS_MM` private; counts 1/2/3 |
| `site/features/planner/open3d/catalog/modularCabinetV0GlbExport.ts` | **OK** | Pure plan mirrors mesh; **duplicate** `DOOR_THICKNESS_MM = 18`; parts start at carcass only |
| `site/features/planner/open3d/3d/createSceneObjectFromNode.ts` | **OK** | Procedural path calls `generateCabinetV0Mesh`; floor-origin group |
| `site/features/planner/asset-engine/mesh/exportModularGlbBinary.ts` | **OK** | G5 uses runtime mesh + plan; policy assert on generated path |
| `site/features/planner/lib/glbAssetPolicy.ts` | **OK** | `assertNoDesignerStaticGlb` / generated marker |
| `site/tests/unit/features/planner/open3d/modularCabinetV0.test.ts` | **OK** | Asserts names `[carcass, door-slab]` etc.; **will go red** on toe |
| `site/tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts` | **OK** | partCount matrix 1/2/3 |
| `site/tests/unit/features/planner/open3d/resolveFurniture2DFootprint.test.ts` | **OK** | Outer footprint; keep envelope stable |
| `site/tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts` | **OK — blast** | Hard-codes slab children **2**, pair **3**, names without `toe` |
| `site/tests/unit/features/planner/open3d/modularPlaceMesh.test.ts` | **OK — blast** | Uses `countCabinetV0Parts` length; stays green if helper updates |
| `site/tests/unit/features/planner/asset-engine/meshStages.test.ts` | **OK — blast** | Hard-codes pair `partCount`/`runtimeMeshChildren` **=== 3** → must become **4** |
| Evidence `results/planner/world-standard-wave/08-mesh-quality/` | **missing** | Create at Task 00; RESULTS-MAP canonical |

**Honesty baseline confirmed:** cabinet-v0 today is carcass + optional door only — W7 not met.

---

## Suggestions (prioritized)

### S1 — Lock part name to exact `toe` (normative)
Plan currently allows `toe` / `toe-kick` / `plinth`. **Pick one:** child `name === "toe"` everywhere (mesh, plan, NOTES, tests). Ambiguity causes flaky agents and plan≠mesh.

### S2 — Blast-radius tests must be in-scope (not “optional non-reg”)
Hard-coded part counts/names outside the two primary test files will fail green:

- `createSceneObjectFromNode.test.ts` — slab/pair lengths + name lists  
- `meshStages.test.ts` — pair `partCount === 3` / `runtimeMeshChildren === 3`  
- Prefer also running `modularPlaceMesh.test.ts` in Task 05 pack  

Task 02 red may start in modularCabinetV0* only; Task 03 green **must** update blast files in the same landable commit as mesh (or immediate follow-up commit same session).

### S3 — Freeze toe geometry formulas (plan === mesh)
Make numbers copy-pasteable so export cannot drift:

| Part | sizeM | positionM |
|------|-------|-----------|
| `toe` | `x=w`, `y=toeH`, `z=d - inset` | `x=0`, `y=toeH/2`, `z= -inset/2` (back-aligned recess) |
| `carcass` | `x=w`, `y=h - toeH`, `z=d` | `x=0`, `y=toeH + carcassH/2`, `z=0` |
| doors | height tracks **carcassH** (×0.92), not full `h` | `y` centered on carcass; `z = d/2 + doorT/2` |

Constants (export from `modularCabinetV0.ts`, import in GlbExport):  
`TOE_HEIGHT_MM = 100`, `TOE_INSET_MM = 50`, `DOOR_THICKNESS_MM = 18` (export existing).

### S4 — Default visual smoke = headless mesh render
P07 browser journey is **not** a dependency for CP-08. Prefer: Vitest/Node render of `generateCabinetV0Mesh` → PNG under evidence. Browser place is optional upgrade when P07 green. Document exact command in NOTES; fail closed if still one box.

### S5 — Height integrity via Box3 / total Y span
Add unit assert: group max Y − min Y ≈ `heightMm * 0.001` (toe not additive overshoot). Prevents carcass full-H + toe on top.

### S6 — Skills / authority / ethics blocks (match P07 style)
Mandatory skills at execute time: `/using-superpowers`, TDD, verification-before-completion, systematic-debugging. Authority: owner > Plans/trustdata > design W7. No competitor GLB/code.

### S7 — Non-goals already good; tighten “no public product GLB”
Explicit: do not write under `site/public/**` for this phase; generated paths only `catalog-assets/generated/*` (relative, policy-checked).

### S8 — run.json schema minimum fields
`date`, `head`, `w7`, `partNamesDefaultSlab`, `partCountMatrix`, `vitestPassed`, `visualSmoke`, `policyNoDesignerGlb`, `residualHonest`.

### S9 — Evidence folder name is fixed
Canonical: `results/planner/world-standard-wave/08-mesh-quality/` (not `07-…`, not historical `modular-*`). Do not collide with P09 `08-shortcuts-chrome/` (different suffix).

### S10 — Order of children locked
Assert order: `toe`, `carcass`, then door part(s). Plan parts array same order.

---

## Top 5 to apply into plan (this revision)

1. **S1** — Lock name `toe`  
2. **S2** — Blast-radius tests named in primary touch list + Task 03/05  
3. **S3** — Explicit toe/carcass/door size+position formulas  
4. **S4** — Headless visual smoke as default path  
5. **S5** — Height integrity Box3 / total span assert  

(Also fold S6–S10 lightly into plan structure.)

---

## Out of scope for this review pass

- Implementing mesh code  
- Creating evidence PNGs  
- Designer static GLB  
- Non–cabinet-v0 SKUs  
- Photoreal materials  

---

## Expert note

Plan body was already strong (TDD red→green, NOTES first, CP-08 table, no designer GLB). Gaps were **naming ambiguity**, **missing blast-radius files**, **underspecified z-inset math**, and **P07-coupled smoke**. Revision closes those without expanding product scope.
