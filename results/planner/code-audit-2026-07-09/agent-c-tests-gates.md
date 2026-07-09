# Agent C — Planner test honesty & coverage gates audit

**Date:** 2026-07-09  
**Trust root:** only configs/scripts/tests under `D:\OandO07072026\site`  
**Scope:** Vitest coverage gates, open3d e2e honesty, mock-away patterns (select/save/mesh), package script wiring, green-while-incomplete product paths  
**Method:** Static config + test source read. No “4812 tests pass” docs trusted. No full suite re-run in this pass (evidence of prior open3d e2e failure found under `site/test-results/`).

---

## Executive summary (top honesty gaps)

| # | Gap | Severity | Paths |
|---|-----|----------|-------|
| 1 | **All 8 open3d product e2e specs are unwired** — not in `package.json`, not in `release:gate`, not in `playwright-gate-specs.json` | **Critical** | `tests/e2e/open3d-*.spec.ts` (8 files); `package.json`; `config/build/playwright-gate-specs.json` |
| 2 | **Planner ship coverage gate is a 9-file allowlist** (~7% of open3d sources); editor/store/model/3d/persistence **out of denominator** | **Critical** | `vitest.shared.ts` `VITEST_PLANNER_GATE_*`; `vitest.config.ts` |
| 3 | **Default `gate` = `release:gate:fast`** — no Playwright, no coverage thresholds, no `test:audit:gate-skips` | **Critical** | `package.json` scripts `gate`, `release:gate:fast` |
| 4 | **Gate e2e still asserts fabric step-bar chrome** while live guest mounts open3d **without** step-bar | **Critical** | `tests/e2e/planner-chrome.spec.ts`, `planner-custom-tools.spec.ts`, `plannerCanvasHelpers.ts` vs `app/planner/(workspace)/guest/page.tsx` |
| 5 | **Select path tested as pure API / soft OR cues** — unit tests call `setSelection` / `applySelectionDelete` without canvas pick; e2e auto-select accepts any of three weak signals | **High** | `applySelectionDelete.test.ts`, `plannerCommandWiring.test.tsx`, `open3d-systems-v0-workstation-place.spec.ts` |
| 6 | **Save path split:** unit “save/reload” = JSON envelope only; browser save e2e unwired; shell mocks autosave always synced | **High** | `saveReloadContinuity.test.ts`, `open3d-save-honesty.spec.ts` (unwired), `workspaceShell.test.tsx` |
| 7 | **Mesh e2e is screenshot theater** — batch place asserts furniture count only; 3D shot has no multi-part mesh assertion | **High** | `open3d-systems-v0-mesh-batch-shots.spec.ts` |
| 8 | **`test:audit:gate-skips` only watches a short allowlist** that excludes open3d e2e and several catalog-wired specs | **High** | `scripts/audit-gate-skips.mjs`, `playwright-gate-specs.json` vs `test:planner-catalog` |
| 9 | **Coverage policy self-contradiction** (comment 70/60 vs code branches 55) | **Medium** | `scripts/coverage-policy.mjs` vs `vitest.shared.ts` |
| 10 | **Hollow/fake-test tooling incomplete or orphaned** | **Medium** | `audit-hollow-tests.mjs` (narrow patterns); `find-fake-tests-ast.ts` / `audit-test-quality.ts` not in `package.json` |

---

## 1. Coverage configs (read)

### 1.1 `vitest.shared.ts`

Planner **ship gate** is include-first allowlist only:

```91:118:D:\OandO07072026\site\vitest.shared.ts
export const VITEST_PLANNER_GATE_COVERAGE_INCLUDE = [
  "features/planner/open3d/catalog/workstation*.ts",
  "features/planner/open3d/catalog/placementAction.ts",
  "features/planner/open3d/catalog/furnitureBlock2D.ts",
  "features/planner/open3d/catalog/proofCatalog.ts",
  "features/planner/open3d/lib/geometry/canvasPicking.ts",
] as const;
// ...
export const VITEST_PLANNER_GATE_THRESHOLDS = {
  statements: 70,
  branches: 55,
  functions: 70,
  lines: 70,
} as const;
```

**Gate allowlist resolves to 9 source files:**

| File |
|------|
| `workstationBoqV0.ts` |
| `workstationCatalogV0.ts` |
| `workstationConfiguratorV0.ts` |
| `workstationMeshV0.ts` |
| `workstationSystemV0.ts` |
| `placementAction.ts` |
| `furnitureBlock2D.ts` |
| `proofCatalog.ts` |
| `canvasPicking.ts` |

**Out of gate (product spine still unmetered):**

| Area | Approx source files | Notes |
|------|---------------------|--------|
| `open3d/editor` | 23 | WorkspaceShell, selection UI, tools |
| `open3d/model` | 12 | project ops, pure actions |
| `open3d/3d` | 7 | ThreeViewer, scene objects |
| `open3d/persistence` | 8 | autosave / IDB / guest restore |
| `open3d/store` | 3 | history |
| `open3d/canvas-feasibility` | 1 | live 2D canvas |
| open3d total | ~128 | |
| `features/planner` total | ~417 | |

**Honesty claim:** `npm run test:coverage` can pass at 70/55/70/70 while **select wiring, IDB save, 3D viewer, FeasibilityCanvas** contribute **zero** to the gate denominator.

Inventory profile (`vitest.coverage.inventory.config.ts`) broad-includes planner/CRM/lib with **no thresholds** — intentionally non-blocking. Site profile (`vitest.site.config.ts`) is marketing/catalog scoped 85/75/85/85 — not planner product truth.

### 1.2 `vitest.config.ts`

- Runs all `tests/**/*.test.{ts,tsx}` (happy-dom).
- Coverage uses planner gate include/thresholds above.
- Aliases still map `@/features/planner/editor` and `canvas-fabric` → `_archive/fabric/...` — unit tests can green on **archived** fabric modules.

### 1.3 `scripts/coverage-policy.mjs`

| Claim | Actual |
|-------|--------|
| Header comment: planner gate **70/60/70/70** | `COVERAGE_GATE_PLANNER.branches: **55**` |
| `coverageReadmeForAgents()`: “70/60/70/70” | Same mismatch vs `vitest.shared.ts` |
| Meaning text: “workstation* + placementAction + furnitureBlock2D + proofCatalog + canvasPicking” | Matches shared allowlist |

**Honesty issue:** policy file can be cited as 60% branch floor while Vitest enforces 55%.

---

## 2. Open3d e2e sample — assert vs skip / soft

**Files (all under `D:\OandO07072026\site\tests\e2e\`):**

| Spec | Asserts | Soft / incomplete | Skips |
|------|---------|-------------------|-------|
| `open3d-world-standard-journey.spec.ts` | Guest chrome, **no** `.pw-step-bar`, wall +1, furniture ≥+2, 2D↔3D, counts hold | Cabinet search can fall back to **any** “Add … to canvas”; no mesh quality | None |
| `open3d-w3-select-delete.spec.ts` | Place → Select tool → click → not “No Selection” → Delete count↓ → Ctrl+Z count↑ | Selection = absence of “No Selection” heading only; no entity id/type | None |
| `open3d-save-honesty.spec.ts` | Place → Save draft → “Saved locally” → hard reload → furniture count restored | Relies on status text regex; guest title may stay “Untitled”; **not IDB schema/content** | None |
| `open3d-systems-v0-workstation-place.spec.ts` | Search workstation → place → furniture +1; auto-select cue | **Auto-select = OR** of Select pressed / body “selected” / properties not empty; generic first Add button fallback | None (runtime: prior failure = invalid URL / baseURL) |
| `open3d-systems-v0-place-delete.spec.ts` | Place +1 → body text has workstation cues → Delete → back to before | Selection proof is body regex, not pick geometry | None |
| `open3d-systems-v0-batch-place.spec.ts` | Place 4 then 2 seats → count +6 | No pose/collision/mesh check; writes `ok: true` JSON evidence | None |
| `open3d-systems-v0-configurator.spec.ts` | L-shape 1500×600 + overhead → place +1; body matches L-shape/ws-v0 | Loose body regex; dual screenshot packs | None |
| `open3d-systems-v0-mesh-batch-shots.spec.ts` | Place 4 → 2D shot → click 3D radio → wait 1.5s → shot | **No assertion that multi-part mesh exists** (child count, roles, WebGL evidence) — **green screenshot path** | None |

**No `test.skip` / `describe.skip` inside open3d e2e sources.**  
**Worse than skip:** they can sit red or never run, while CI still claims green via other scripts.

**Prior failure artifact (product path not CI-gated):**

`D:\OandO07072026\site\test-results\tests-e2e-open3d-systems-v-8c069-ation-→-place-→-furniture-1\error-context.md`  
→ `page.goto: Cannot navigate to invalid URL` for `/planner/guest/?plannerDevTools=1` (baseURL / config when run ad hoc).

### 2.1 Wiring proof (package.json string search)

| Token | Present in `package.json` |
|-------|---------------------------|
| `open3d-save` / `open3d-systems` / `open3d-w3` / `open3d-world` | **False** |
| `test:e2e:open3d` | **False** |
| `world-standard` | **False** |

`playwright-gate-specs.json` specs list: a11y + nav smoke + planner-catalog/guest/custom-tools/chrome only — **zero open3d-*.spec.ts**.

Also unwired (related product journeys):  
`planner-j3-template`, `planner-j4-3d-parity`, `planner-j5-ai-assist`, `planner-j6-member-restore`, `planner-canvas-trust` (not in any npm script line).

---

## 3. Tests that mock away the real bug (select / save / mesh)

### 3.1 Select

| Test | What it mocks / bypasses | Real bug not caught |
|------|--------------------------|---------------------|
| `tests/unit/.../applySelectionDelete.test.ts` | Pure helper with hand-built `{ type, ids }` | Canvas pick miss, wrong hit target, pointer→selection pipeline |
| `tests/unit/.../plannerCommandWiring.test.tsx` | `setSelection({ type: "furniture", ids: ["chair"] })` directly | Same — never calls `pickFurnitureAtPoint` from UI event |
| `tests/unit/.../geometry/canvasPicking.test.ts` | Pure mm geometry — good unit | Not wired to e2e/select tool integration (and **not** required by gate e2e) |
| `open3d-systems-v0-workstation-place.spec.ts` | Soft OR auto-select | Place can “pass” with only Select tool pressed after place, without properties selection |
| `workspaceShell.test.tsx` | Mocks `FeasibilityCanvas`, tool rail, layers | Shell can render while real 2D pick path is dummy |

### 3.2 Save

| Test | What it does | Real bug not caught |
|------|--------------|---------------------|
| `saveReloadContinuity.test.ts` | `exportToJson` / `importFromJson` / projectJson round-trip | IDB `planner-workspace-db`, autosave debounce, hard reload race, guest storage clear |
| `phase08-persistence.test.ts` | **SVG admin** descriptor lock/archive (not open3d plan save) | Misleading name for planner workspace persistence |
| `workspaceShell.test.tsx` | `useOpen3dWorkspaceAutosave` → `{ isSynced: true, schedulePersist: vi.fn() }` | UI never sees dirty/failed save states |
| `open3d-save-honesty.spec.ts` | Real browser path | **Unwired** — gate never requires it |

### 3.3 Mesh

| Test | What it does | Real bug not caught |
|------|--------------|---------------------|
| `workstationMeshV0.test.ts` | Strong pure plan: roles, sizes, colors | Not browser/WebGL integration |
| `modularPlaceMesh.test.ts` | place + `createSceneObjectFromNode` with real THREE | Good unit; not in e2e gate |
| `threeViewerInner.test.tsx` | **Full mock of `three` + OrbitControls** | Renderer dispose/size can pass without real GL |
| `open3d-systems-v0-mesh-batch-shots.spec.ts` | Furniture count + PNG | Multi-part group missing still greens |
| `routesCoverage.test.tsx` | Mocks entire `Open3dPlannerWorkspaceRoute` / Host as div stubs | Route “coverage” without product mount |

### 3.4 Coverage-chasing files (green noise)

- `coverageGap.test.ts` — header still aims at old 90% / SVG/AI modules **not in gate allowlist**.
- `zeroCoverageModules.test.ts` — “modules that were at 0%” smoke imports.
- Both still run under `npm test` and inflate confidence without expanding the ship gate.

---

## 4. Package.json scripts — hollow / dead / misleading

### 4.1 Gate ladder (honesty)

```text
npm run gate
  → release:gate:fast
     lint + typecheck + vitest + hollow(--exclude-marketing) + eslint-disable + lint:ui:strict
     ✗ no Playwright
     ✗ no coverage thresholds
     ✗ no test:audit:gate-skips
     ✗ no build
     ✗ no a11y

npm run release:gate / gate:full
  → hollow + gate-skips + eslint-disable + lint + typecheck + test + build
    + a11y + test:planner-catalog + test:coverage + test:coverage:site
  still ✗ no open3d-*.spec.ts
  still ✗ no p0 mesh unit pack required
```

### 4.2 Playwright lists disagree

| Source | Specs |
|--------|--------|
| `test:planner-catalog` | admin-smoke, planner-catalog, guest-workspace, custom-tools, chrome, sketch-to-plan, offline-sync |
| `playwright-gate-specs.json` (audit-gate-skips) | a11y, site-nav smoke, catalog, guest, custom-tools, chrome — **missing** admin-smoke, sketch-to-plan, offline-sync, **all open3d** |

Skips can land in catalog-only specs without `test:audit:gate-skips` failing.

### 4.3 Dual chrome contract (gate vs product)

| Product | Evidence |
|---------|----------|
| Live guest | `app/planner/(workspace)/guest/page.tsx` → `Open3dPlannerWorkspaceRoute` |
| Step-bar source | only `features/planner/_archive/fabric/editor/PlannerStepBar.tsx` |
| open3d e2e | asserts `.pw-step-bar` **count 0** |
| **Gate** e2e | `planner-chrome.spec.ts` / `planner-custom-tools.spec.ts` call `switchPlannerStep` → **requires** `.pw-step-bar__btn` |

Helpers still carry fabric hooks:

```136:182:D:\OandO07072026\site\tests\e2e\plannerCanvasHelpers.ts
export async function switchPlannerStep(...) {
  const stepButton = page.locator(`.pw-step-bar__btn[data-step="${stepId}"]`);
  ...
}
// firstFurnitureCenter requires window.__plannerFabricView
```

**Honesty:** release catalog e2e is either **testing a dead fabric chrome** or **failing silently outside default `gate`**. Open3d journey that matches product is **outside all npm scripts**.

### 4.4 Orphan / hollow tooling (not dead files, dead *commands*)

Present under `scripts/` but **not referenced in package.json**:

- `find-fake-tests-ast.ts` (README still recommends it)
- `audit-test-quality.ts`
- `audit-quality-gate.mjs`
- `_audit-stale-scripts.mjs`
- `audit-fixed-containers.mjs`

`audit-hollow-tests.mjs` **is** wired but only catches:

- `expect(true).toBe(true)`
- sole `toBeTruthy()`
- empty `catch {}`
- files with `it()` and zero `expect(`

Does **not** catch soft OR cues, screenshot-only e2e, mock stubs of route/workspace, or fabric-vs-open3d mismatch.

### 4.5 Other script notes

| Script | Issue |
|--------|--------|
| `p0` / `p0:unit` / `p0:g8` | Real mesh/GLB unit paths — **not** in `release:gate` or `gate` |
| `p0:svg` | SVG smoke only; `p0` = unit+svg, no browser open3d |
| `test:unit` | `vitest run --exclude **/planner*` — excludes planner by name glob (easy to misuse) |
| Script file targets checked for missing paths | **0 dead file targets** in package scripts (commands exist; **product e2e not commanded**) |

---

## 5. Green while product path incomplete

| Claim / surface | Reality |
|-----------------|---------|
| `npm run gate` green | No open3d e2e, no coverage floor, no skip audit |
| `npm run test:coverage` green | 9-file allowlist; editor/3d/persistence unmetered |
| `npm run release:gate` green | Still no open3d e2e; may run fabric step-bar e2e against open3d guest |
| Unit count ~875 test files | Includes coverage-gap, mocked shells, archive aliases |
| `saveReloadContinuity` name | JSON only, not browser save honesty |
| `phase08-persistence` name | Admin SVG descriptors, not plan IDB |
| `J6 — Member document restore` (`planner-j6-...`) | Guest revisit only; **unwired**; not member auth restore |
| Mesh batch e2e `ok: true` JSON | Writes success artifact from count + screenshots |
| `routesCoverage` “wires guest route” | Stub component, not real workspace |
| Prior open3d e2e failure in `test-results/` | Not blocking any package gate script |

---

## 6. Open3d e2e assert matrix (compact)

```
Journey          | Place | Select | Delete | Undo | Save/reload | 3D view | Mesh quality | In CI gate
-----------------|-------|--------|--------|------|-------------|---------|--------------|----------
world-standard   | Y     | -      | -      | -    | -           | Y (canvas visible) | - | NO
w3-select-delete | Y     | soft   | Y      | Y    | -           | -       | -            | NO
save-honesty     | Y     | -      | -      | -    | Y (count)   | -       | -            | NO
ws-place         | Y     | soft OR| -      | -    | -           | -       | -            | NO
place-delete     | Y     | soft   | Y      | -    | -           | -       | -            | NO
batch-place      | Y(N)  | -      | -      | -    | -           | -       | -            | NO
configurator     | Y     | -      | -      | -    | -           | -       | -            | NO
mesh-batch-shots | Y     | -      | -      | -    | -           | shot only | NO assert  | NO
```

---

## 7. Recommended ratchet order (for planner, not implemented here)

1. Add `test:e2e:open3d` running the 8 specs; include in `release:gate` (and consider `gate` if ship-critical).
2. Extend `playwright-gate-specs.json` to match **actual** Playwright gate command set (catalog + open3d).
3. Retire or rewrite fabric step-bar e2e (`planner-chrome`, `planner-custom-tools`, helpers) to open3d native chrome.
4. Expand coverage allowlist only with files the suite **owns** (next candidates: `placementAction` already in; add `pureActions`, selection apply, autosave pure modules — not UI shells).
5. Harden mesh e2e: assert multi-part roles / `data-render-evidence` / child count, not only screenshots.
6. Align `coverage-policy.mjs` comments with branches **55** (or raise threshold with evidence).
7. Wire or delete orphan audit scripts; expand hollow audit beyond `expect(true)`.

---

## 8. Evidence index (absolute paths)

### Configs
- `D:\OandO07072026\site\vitest.shared.ts`
- `D:\OandO07072026\site\vitest.config.ts`
- `D:\OandO07072026\site\vitest.site.config.ts`
- `D:\OandO07072026\site\vitest.coverage.inventory.config.ts`
- `D:\OandO07072026\site\scripts\coverage-policy.mjs`
- `D:\OandO07072026\site\config\build\playwright-gate-specs.json`
- `D:\OandO07072026\site\package.json`

### Open3d e2e
- `D:\OandO07072026\site\tests\e2e\open3d-world-standard-journey.spec.ts`
- `D:\OandO07072026\site\tests\e2e\open3d-w3-select-delete.spec.ts`
- `D:\OandO07072026\site\tests\e2e\open3d-save-honesty.spec.ts`
- `D:\OandO07072026\site\tests\e2e\open3d-systems-v0-workstation-place.spec.ts`
- `D:\OandO07072026\site\tests\e2e\open3d-systems-v0-place-delete.spec.ts`
- `D:\OandO07072026\site\tests\e2e\open3d-systems-v0-batch-place.spec.ts`
- `D:\OandO07072026\site\tests\e2e\open3d-systems-v0-configurator.spec.ts`
- `D:\OandO07072026\site\tests\e2e\open3d-systems-v0-mesh-batch-shots.spec.ts`
- `D:\OandO07072026\site\tests\e2e\plannerCanvasHelpers.ts`
- `D:\OandO07072026\site\test-results\tests-e2e-open3d-systems-v-8c069-ation-→-place-→-furniture-1\error-context.md`

### Mocks / pure bypasses
- `D:\OandO07072026\site\tests\unit\features\planner\open3d\workspaceShell.test.tsx`
- `D:\OandO07072026\site\tests\unit\features\planner\open3d\routesCoverage.test.tsx`
- `D:\OandO07072026\site\tests\unit\features\planner\open3d\threeViewerInner.test.tsx`
- `D:\OandO07072026\site\tests\unit\features\planner\open3d\saveReloadContinuity.test.ts`
- `D:\OandO07072026\site\tests\unit\features\planner\open3d\applySelectionDelete.test.ts`
- `D:\OandO07072026\site\tests\unit\features\planner\open3d\plannerCommandWiring.test.tsx`

### Product path
- `D:\OandO07072026\site\app\planner\(workspace)\guest\page.tsx` (open3d guest)

### Audits
- `D:\OandO07072026\site\scripts\audit-hollow-tests.mjs`
- `D:\OandO07072026\site\scripts\audit-gate-skips.mjs`
- `D:\OandO07072026\site\scripts\find-fake-tests-ast.ts` (orphan)

---

## 9. Bottom line

**Do not trust “tests pass” as planner product readiness.**  

The shipable signals that can go green today (`gate`, vitest coverage, even full `release:gate`) **do not execute** the open3d browser proofs for select / save / systems mesh, and the coverage floor is deliberately scoped to a **tiny pure allowlist**. Meanwhile catalog e2e still encodes **archived fabric step-bar** chrome against a guest route that mounts **open3d**. That is the core test/product honesty gap for the planner.
