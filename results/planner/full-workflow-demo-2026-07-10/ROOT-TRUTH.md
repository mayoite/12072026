# ROOT-TRUTH — workstation-v0 mesh raise (legs + stretchers)

**Seat:** repo-truth scout (read-only)  
**Phase:** `full-workflow-demo-2026-07-10` (workstation visual smoke)  
**Checkout:** `D:\OandO07072026` (main only; no worktrees)  
**Scout date:** 2026-07-10  

Disprove paper claims. What follows is **on disk / live-run**, not recap memory.

---

## 1. HEAD short SHA

| Field | Value |
|-------|--------|
| **Short** | `b762cf6` |
| **Full** | `b762cf6c77255117d4c8a396593178bff48f2340` |
| **Subject** | `feat(open3d): workstation under-desk stretchers (mesh raise v2)` |

---

## 2. Does `workstationMeshV0.ts` export legs + stretchers?

**File:** `site/features/planner/open3d/catalog/workstationMeshV0.ts`

### Truth (precise)

| Claim | On-disk fact |
|-------|----------------|
| Legs + stretchers **implemented** in mesh plan | **YES** |
| Helpers `legsForWorktopPrim` / `stretchersForWorktopPrim` as **named exports** | **NO** — module-private `function` |
| Public mesh API includes leg/stretcher **parts** | **YES** via `generateWorkstationV0MeshPlan` / `generateWorkstationV0Mesh` |
| Related **constants** exported | **YES** |

### Named exports (constants / API)

- Leg/stretcher geometry constants exported L28–34:
  - `LEG_SECTION_MM`, `LEG_INSET_MM` (L28–30)
  - `STRETCHER_SECTION_MM`, `STRETCHER_HEIGHT_FRAC` (L32–34)
- Public builders: `generateWorkstationV0MeshPlan` (L239), `generateWorkstationV0Mesh` (L303), `countWorkstationV0Parts` (L295)

### Private helpers (not exported)

```160:165:site/features/planner/open3d/catalog/workstationMeshV0.ts
function legsForWorktopPrim(
  prim: WorkstationPlanPrimV0,
  footprint: WorkstationFootprintMm,
  heightMm: number,
  runKey: "desk" | "return",
): WorkstationV0MeshPartPlan[] {
```

```198:203:site/features/planner/open3d/catalog/workstationMeshV0.ts
function stretchersForWorktopPrim(
  prim: WorkstationPlanPrimV0,
  footprint: WorkstationFootprintMm,
  heightMm: number,
  runKey: "desk" | "return",
): WorkstationV0MeshPartPlan[] {
```

### Wired into plan (desk/return only)

```248:264:site/features/planner/open3d/catalog/workstationMeshV0.ts
    if (prim.role === "desk" || prim.role === "return") {
      parts.push(
        ...legsForWorktopPrim(
          prim,
          footprint,
          config.heightMm,
          prim.role,
        ),
      );
      parts.push(
        ...stretchersForWorktopPrim(
          prim,
          footprint,
          config.heightMm,
          prim.role,
        ),
      );
    }
```

**Names produced:** `leg-{desk|return}-0..3`, `stretcher-{desk|return}-front|back` (comments L157–159, L195–196).

**Paper-claim kill:** Saying “exports legs + stretchers” as public symbols is **false**. Saying “mesh plan includes legs + stretchers on tip” is **true**.

---

## 3. Test files (mesh / legs / stretchers) + live status

### Files that exist

| Path | Role |
|------|------|
| `site/tests/unit/features/planner/open3d/workstationMeshV0.test.ts` | base multi-part plan + THREE group |
| `site/tests/unit/features/planner/open3d/workstationMeshV0.legs.test.ts` | leg posts under worktop |
| `site/tests/unit/features/planner/open3d/workstationMeshV0.stretchers.test.ts` | under-desk rails |
| `site/tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts` | scene factory asserts leg + stretcher child names (e.g. L311–318) |

Related workstation unit files (system/config/BOQ — not pure mesh raise):  
`workstationSystemV0.test.ts`, `workstationCatalogV0.test.ts`, `workstationConfiguratorV0.test.ts`, `WorkstationConfiguratorPanel.test.tsx`, `workstationPlacementV0.test.ts`, `workstationBoqV0.test.ts`, `workstationBoqExport.test.ts`.

### Live vitest (this scout, 2026-07-10)

```text
pnpm --filter oando-site exec vitest run \
  tests/unit/features/planner/open3d/workstationMeshV0.test.ts \
  tests/unit/features/planner/open3d/workstationMeshV0.legs.test.ts \
  tests/unit/features/planner/open3d/workstationMeshV0.stretchers.test.ts
```

| Suite | Result |
|-------|--------|
| `workstationMeshV0.test.ts` | **8/8 pass** |
| `workstationMeshV0.legs.test.ts` | **9/9 pass** |
| `workstationMeshV0.stretchers.test.ts` | **4/4 pass** |
| **Total** | **3 files, 21/21 pass** (~1.3s) |

### Prior evidence (not re-run as full 35)

`results/planner/world-standard-wave/07-systems-v0/mesh-stretchers/NOTES.md` claims **35/35** (mesh + legs + stretchers + createSceneObjectFromNode) with `vitest.log` present. This scout re-proved the three mesh* suites only (21 green); scene suite not re-run here.

**Stale/red noise to ignore:**  
`results/tests/vitest-results.json` shows stretchers **skipped/failed** in an older partial run — **contradicted** by live green above.  
`mesh-legs-red/vitest-red.log` is historical RED-only TDD artifact, superseded by green on tip.

---

## 4. Cabinet visual smoke pattern

| Path | Status |
|------|--------|
| `site/scripts/p08-cabinet-v0-visual-smoke.mjs` | **EXISTS** |

Headless pattern: pure plan formulas → box parts → render (sharp) → PNG under results; no browser/GLB required. Default out: `results/planner/world-standard-wave/08-mesh-quality`. Usage documented in file header L5–7.

---

## 5. Workstation visual smoke script already?

| Answer | Detail |
|--------|--------|
| **NO** | No `site/scripts/*workstation*smoke*` (or equivalent) on disk |

Smoke scripts under `site/scripts/`: `p08-cabinet-v0-visual-smoke.mjs`, `launch-smoke.mjs`, `smoke-svg-fixtures.mjs` only.

**Not a substitute:** e2e specs that touch workstation mesh shots (browser), e.g.:

- `site/tests/e2e/open3d-systems-v0-mesh-batch-shots.spec.ts` → historical `42-workstation-mesh-3d.png`
- `site/tests/e2e/open3d-mesh-symbol-live-verify.spec.ts`

Those are Playwright browser paths, not a cabinet-style headless workstation smoke.

---

## 6. Evidence folder `07-systems-v0/mesh-stretchers/`

### Canonical path (exists)

`results/planner/world-standard-wave/07-systems-v0/mesh-stretchers/`

| File | Notes |
|------|--------|
| `NOTES.md` | Phase B closed pass; residual = no visual smoke PNG |
| `TASK-LIST.md` | CLOSED PASS; unit-only deliverables checked |
| `vitest.log` | Present (prior 35/35 claim) |

### Wrong path (does not exist)

`results/07-systems-v0/mesh-stretchers/` → **MISSING**

Sibling mesh folders under `07-systems-v0/`: `mesh-legs-red`, `mesh-legs-green`, `mesh-quality-raise`, `mesh-stretchers`.

Historical browser PNGs live **one level up** under `07-systems-v0/` (e.g. `42-workstation-mesh-3d.png`) — **not** under `mesh-stretchers/`, and **not** proof that stretchers are visible in this demo phase folder.

---

## 7. Gap — what this phase still needs for visual proof

Per `GOAL.md` / `TASK-LIST.md` for `full-workflow-demo-2026-07-10`:

| Done on tip? | Item |
|--------------|------|
| **YES** | Legs + stretchers in `workstationMeshV0.ts` plan/mesh |
| **YES** | Unit suites green (mesh/legs/stretchers; live 21/21) |
| **YES** | Stretchers phase notes under world-standard-wave |
| **YES (this file)** | Repo-truth scout `ROOT-TRUTH.md` |
| **NO** | Dedicated **workstation** headless visual smoke script (cabinet pattern) |
| **NO** | ≥1 **PNG under this phase folder** showing multi-part desk with **legs + stretchers** |
| **NO** | `CODE-REVIEW.md` / `VERIFY.md` / phase close for *this* demo |
| **NO** | Claiming product ship / photoreal (correctly out of scope) |

### Minimum visual-proof gap (actionable)

1. **Add** headless smoke (clone `p08-cabinet-v0-visual-smoke.mjs` formulas from workstation plan: desk/return + legs + stretchers; role colors).  
2. **Run** with `--out` → `results/planner/full-workflow-demo-2026-07-10/` (or default there).  
3. **Land** ≥1 PNG (+ optional run JSON) proving legs and stretcher rails read in image, not only unit names.  
4. Re-run mesh unit suites (already green) + code-review + verifier seats per TASK-LIST.

**Paper-claim kill:** “Stretchers landed / mesh raise done” as **product visual complete** is **false**. Unit + code path on tip is **true**; **visual proof for this phase is still open**.

---

## Scout status

**STATUS DONE**  
**Path:** `results/planner/full-workflow-demo-2026-07-10/ROOT-TRUTH.md`  
**Product code edits:** none  
