# P04 Exec 2/5 — Layer-2 workspace wiring audit

**Track:** P04 FROM SCRATCH (orbit continuity)  
**Seat:** Execute 2/5 — layer-2 workspace wiring  
**Mode:** Audit only (spread present → no Mode B patch)  
**Date:** 2026-07-10  
**HEAD at audit:** `f692ca963a68224e2daefee70b65d780a9ef766d`  
**Result:** **layer2 CLOSED**

---

## Contract (layer 2)

Product `OOPlannerWorkspace` 3D branch must **explicitly** spread
`getOpen3dViewerControlProps()` into `Lazy3DViewer`. Defaults alone are not
enough (W4 three-layer rule: silent default-only orbit is FAIL).

Helper contract (`orbitDefaults.ts`):

| Line | Fact |
|------|------|
| L7 | `OPEN3D_ORBIT_DEFAULT_ENABLED = true` |
| L13–15 | `getOpen3dViewerControlProps(): { enableControls: true }` returns `{ enableControls: OPEN3D_ORBIT_DEFAULT_ENABLED }` |

Unit guard: `site/tests/unit/features/planner/open3d/workspaceOrbitWiring.test.ts`  
requires source match `/\{\s*\.\.\.\s*getOpen3dViewerControlProps\s*\(\s*\)\s*\}/`.

---

## OOPlannerWorkspace — import (spread helper available)

**File:** `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx`

```13:16:site/features/planner/open3d/editor/OOPlannerWorkspace.tsx
import {
  Lazy3DViewer,
  getOpen3dViewerControlProps,
} from "../3d/ThreeLazyViewer";
```

| Line | Content | Verdict |
|------|---------|---------|
| **13–16** | Named import `Lazy3DViewer` + `getOpen3dViewerControlProps` from `../3d/ThreeLazyViewer` | PASS — helper imported for product mount |
| Re-export path | `ThreeLazyViewer.tsx` L15–18 re-exports from `./orbitDefaults` | PASS — same helper as unit pack |

---

## OOPlannerWorkspace — Lazy3DViewer mount (layer-2 proof)

3D branch of view mode (`viewMode !== "2d"` → else of feasibility canvas):

```1057:1060:site/features/planner/open3d/editor/OOPlannerWorkspace.tsx
          <Lazy3DViewer
            projectData={workspaceCanvas.project}
            {...getOpen3dViewerControlProps()}
          />
```

| Line | Content | Verdict |
|------|---------|---------|
| **1057** | `<Lazy3DViewer` open | PASS — product 3D surface |
| **1058** | `projectData={workspaceCanvas.project}` | PASS — data prop (orthogonal) |
| **1059** | `{...getOpen3dViewerControlProps()}` | **PASS — explicit spread present** |
| **1060** | `/>` close | — |

### Spread detail

- Pattern matched: `{...getOpen3dViewerControlProps()}` exactly (whitespace-tolerant regex in unit test).
- Effect: injects `{ enableControls: true }` into `Lazy3DViewer` props.
- Anti-pattern check: no `enableControls={false}` anywhere in this source file (unit asserts `not.toMatch`).

### Mode B decision

| Condition | Action |
|-----------|--------|
| Spread **missing** | Mode B: add `{...getOpen3dViewerControlProps()}` only on this mount |
| Spread **present** (this audit) | **No code change** |

**Mode B not applied** — wiring already correct on tip `f692ca96`.

---

## Downstream (context only — not layer-2 scope)

`Lazy3DViewer` (`ThreeLazyViewer.tsx`):

| Line | Fact |
|------|------|
| L74 | `enableControls?: boolean` on props |
| L145 | default `enableControls = OPEN3D_ORBIT_DEFAULT_ENABLED` |
| L176 | passes `enableControls={enableControls}` into `Lazy3DViewerInner` |

Layer 2 cares that the **workspace mount** does not rely on that default alone —
explicit spread at L1059 satisfies the contract.

---

## Unit contract cross-check

| File | Assertion | Status |
|------|-----------|--------|
| `workspaceOrbitWiring.test.ts` L41–47 | helper forces `enableControls: true` | present |
| `workspaceOrbitWiring.test.ts` L49–57 | source has import + `Lazy3DViewer` + spread pattern; no `enableControls={false}` | present |
| Prior commit | `f692ca96 test(planner): P04 workspace orbit wiring layer-2 unit` | on tip |

---

## Honesty / paper-moon note

- This seat is **source wiring audit**, not browser orbit proof.
- Layer 2 CLOSED = product path spreads control props. Full P04 still needs other exec seats (pose / browser continuity) before phase green.
- No silent pass: line numbers above re-read from working tree + confirmed on `git show HEAD` for the same mount.

---

## Verdict

| Gate | Status |
|------|--------|
| Import of `getOpen3dViewerControlProps` | YES (L14–15) |
| Spread on `Lazy3DViewer` | YES (L1059) |
| Mode B fix required | NO |
| **layer2** | **CLOSED** |
