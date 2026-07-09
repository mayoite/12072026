# Systems v0 configurator — code review

**Date:** 2026-07-09  
**Scope:** free size/shape/module configurator land (not fixed 8 SKUs only)  
**Reviewer:** code-review subagent (`/using-superpowers` + requesting-code-review)  
**Repo:** `D:\OandO07072026` (no worktrees)

## Files reviewed

| File | Role |
|------|------|
| `site/features/planner/open3d/catalog/workstationConfiguratorV0.ts` | Pure draft → resolve / preview / consume-once arm |
| `site/features/planner/open3d/editor/WorkstationConfiguratorPanel.tsx` | Inventory UI (draft state only) |
| `site/features/planner/open3d/editor/InventoryPanel.tsx` | Optional mount via `onWorkstationConfigPlace` |
| `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` | Arm + canvas place path |

Related (context, not full re-review): `workstationSystemV0.ts`, `placementAction.ts` (`placeWorkstationConfigOnProject`), unit + e2e evidence under this folder.

---

## Strengths

1. **Pure vs UI boundary is clean.** Draft mutations, resolve, preview, and size helpers live in `workstationConfiguratorV0.ts` with no React. Panel holds `useState(draft)` and calls pure setters. Workspace arms a resolved `WorkstationConfigV0` and places via pure `placeWorkstationConfigOnProject`.
2. **No `any`.** Reviewed configurator files are strict-typed (`WorkstationConfigV0`, `WorkstationModuleKindV0`, draft type).
3. **Shape-controlled modules.** Desk always required; return forced on L / stripped on linear via `normalizeModules`. UI shows locked chips for Desk/Return; toggle API ignores `desk`/`return`.
4. **Arm mutual exclusion.** Inventory SKU place clears workstation arm; configurator place clears catalog item id; tool change clears both.
5. **a11y baseline present.** Section `aria-label` (region), collapsible `aria-expanded`, chip `aria-pressed`, fieldset/legend, preview `aria-live="polite"`, e2e uses role queries successfully.
6. **Evidence already exists.** Unit suite + browser e2e (`open3d-systems-v0-configurator.spec.ts`) with 30/31/32 screenshots and `configurator-run.json`.
7. **Catalog id stability.** Free combos still use `workstationConfigKey` (`ws-v0-…`) so BOQ / properties path stay consistent with matrix SKUs.

---

## Issues

### Critical

_None._

### Important

1. **~~Place path race: double pointer-up could place twice~~ — FIXED**  
   **Where:** `OOPlannerWorkspace.handlePlaceAtPoint` previously read `pendingWorkstationConfig` from React state and cleared it with `setState` after place.  
   **Why:** `FeasibilityCanvas` finalizes place on pointer-up while `pendingCatalogPlacement` stays true until re-render. A double-click can fire two ups against the same armed closure → two furniture.  
   **Fix:** `pendingWorkstationConfigRef` + pure `takePendingWorkstationConfig(bag)` consume-once; state kept for UI (status pill / `pendingCatalogPlacement`). Cleared on inventory arm and tool change.  
   **Test:** `takePendingWorkstationConfig is consume-once (no double place)` in `workstationConfiguratorV0.test.ts`.

2. **~~Module resolve not hardened against dirty draft~~ — FIXED**  
   **Where:** `resolveWorkstationConfigFromDraft` previously did `["desk", ...draft.toggledModules]` without allowlist/dedupe.  
   **Why:** Pure API misuse (or future non-UI callers) could inject `desk`/`return` or duplicates into `toggledModules` → duplicate modules / odd keys.  
   **Fix:** Filter to `WORKSTATION_V0_TOGGLE_MODULES` + dedupe before normalize.  
   **Tests:** ignore desk/return toggle; idempotent toggle; linear-after-L strips return; dirty draft resolve.

### Minor

1. **Catalog inventory place path still state-only.** SKU path (`pendingCatalogItemId`) has the same class of double-click race. Out of configurator scope; same consume-once pattern would help later.
2. **Collapse control lacks `aria-controls`.** Header button expands body; no linked id on the body region.
3. **Locked Desk/Return chips** are non-focusable spans with `title` only — SR users get less “required” context than sighted `title` hover.
4. **No height control in UI.** Draft carries `heightMm` (default 750); fine for v0, but buyers cannot change height yet.
5. **Panel unit tests absent.** Pure logic covered; React panel not unit-tested (e2e covers happy path only).
6. **`focus-visible` on chips/header** was missing at review time — CSS added so keyboard focus matches place button.

---

## Checklist (requested)

| Check | Result |
|-------|--------|
| no `any` | Pass |
| pure vs UI boundary | Pass |
| place path races | Important race found → fixed + unit |
| module toggle edge cases | Covered (ignore desk/return, idempotent, L↔linear, dirty draft) |
| a11y basics | Pass with Minor notes; chip/header focus ring added |
| missing tests | Was 5 cases; now 10 including race consume + edges |

---

## Fixes landed this review

| Change | File |
|--------|------|
| `takePendingWorkstationConfig` consume-once helper | `workstationConfiguratorV0.ts` |
| Resolve allowlist + dedupe toggles | `workstationConfiguratorV0.ts` |
| Ref arm + consume in place path | `OOPlannerWorkspace.tsx` |
| Drop redundant shape cast; unused import | `WorkstationConfiguratorPanel.tsx` |
| Chip/header `:focus-visible` | `workstationConfigurator.module.css` |
| Edge + consume-once unit tests (10 total) | `workstationConfiguratorV0.test.ts` |

### Unit evidence

```
npx vitest run tests/unit/features/planner/open3d/workstationConfiguratorV0.test.ts
# Test Files  1 passed (1)
# Tests  10 passed (10)
```

---

## Verdict

**Ready to proceed after Important fixes (landed in this pass).**

Architecture is sound for Systems v0: pure combinatorics, thin panel, workspace place arm with mutual exclusion against catalog SKUs. The only ship-blocking concern was the armed-config double-place race; that and draft resolve hardening are fixed and unit-tested. Remaining items are Minor (catalog path race twin, a11y polish, height UI, panel unit tests).

**Ship status:** configurator land OK for wave continue; mirror this review + fix commit to origin/mayoite per workflow.
