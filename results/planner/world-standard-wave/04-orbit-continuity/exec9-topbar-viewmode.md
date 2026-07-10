# Agent 9 — TopBar 2D|3D radiogroup product audit (P04)

**Date:** 2026-07-10  
**HEAD at audit write:** 180f0e10e1a2d181271a9084198116a0059949d5 (pre-commit parent)  
**Seat:** Agent 9/10 — TopBar viewMode product wiring + optional e2e helper harden  
**Rule:** Line-level product audit with path cites. No paper PASS for W4.

---

## 1. Product surface — `TopBar.tsx`

**File:** `site/features/planner/open3d/editor/TopBar.tsx`

### Prop contract

| Symbol | Lines | Behavior |
|--------|-------|----------|
| `viewMode` | 47 | Required prop `"2d" \| "3d"` (controlled from parent). |
| `onViewModeChange` | 51 | Optional `(mode: "2d" \| "3d") => void`. |
| Destructure | 101, 105 | `viewMode` + `onViewModeChange` pulled into component. |

```47:51:site/features/planner/open3d/editor/TopBar.tsx
  viewMode: "2d" | "3d";
  floors?: Array<{ id: string; name: string }>;
  activeFloorId?: string;
  displayUnit?: Open3dDisplayUnit;
  onViewModeChange?: (mode: "2d" | "3d") => void;
```

### Radiogroup markup (buyer-facing control)

```152:173:site/features/planner/open3d/editor/TopBar.tsx
        <div className={styles.viewToggle} role="radiogroup" aria-label="View mode">
          <button
            type="button"
            className={styles.viewToggleBtn}
            data-active={viewMode === "2d"}
            onClick={() => onViewModeChange?.("2d")}
            aria-checked={viewMode === "2d"}
            role="radio"
          >
            2D
          </button>
          <button
            type="button"
            className={styles.viewToggleBtn}
            data-active={viewMode === "3d"}
            onClick={() => onViewModeChange?.("3d")}
            aria-checked={viewMode === "3d"}
            role="radio"
          >
            3D
          </button>
        </div>
```

### Honest product facts

| Fact | Evidence |
|------|----------|
| Group role | `role="radiogroup"` + `aria-label="View mode"` (line 152). |
| Options | Two native `<button type="button">` with `role="radio"` (not `role="button"` for a11y queries). |
| Visible names | Literal text **`2D`** / **`3D`** (lines 161, 171) — accessible name for `getByRole("radio", { name })`. |
| Checked state | `aria-checked={viewMode === "2d"\|"3d"}` (158, 168). |
| Visual active | `data-active={...}` (156, 166) — CSS only; a11y uses `aria-checked`. |
| Click → parent | `onClick={() => onViewModeChange?.("2d"|"3d")}` (157, 167). Optional chaining — no-op if parent omits handler. |
| No `name` / `value` attrs | Radios are not form-submitted; pure UI state. |
| No `any` | Typed `"2d" \| "3d"` throughout. |

### Risks / residual (product)

1. **Missing `tabIndex` / roving focus:** Radios are real buttons so tab order works, but classic radiogroup arrow-key navigation is **not** implemented here (click-only). Keyboard toggle is elsewhere (`toggleView` in workspace keyboard — see §3).
2. **No `aria-labelledby`:** Uses `aria-label` on group — fine; not a defect.
3. **Uncontrolled omit of `onViewModeChange`:** Clicks become no-ops; parent OO path always wires handler.

---

## 2. Shell bridge — `WorkspaceShell.tsx`

**File:** `site/features/planner/open3d/editor/WorkspaceShell.tsx`

| Concern | Lines | Behavior |
|---------|-------|----------|
| Prop types | 22, 56 | Optional controlled `viewMode` / `onViewModeChange`. |
| Internal state | 126, 130 | `internalViewMode` + `viewMode = controlled ?? internal`. |
| Change handler | 152–160 | If uncontrolled, updates internal; always calls `onViewModeChange?.(mode)`. |
| Pass-through to TopBar | 300, 305 | `viewMode={viewMode}` + `onViewModeChange={handleViewModeChange}`. |

```151:160:site/features/planner/open3d/editor/WorkspaceShell.tsx
  // Handle view mode change
  const handleViewModeChange = useCallback(
    (mode: "2d" | "3d") => {
      if (controlledViewMode === undefined) {
        setInternalViewMode(mode);
      }
      onViewModeChange?.(mode);
    },
    [controlledViewMode, onViewModeChange],
  );
```

**Honest:** Controlled path (OO workspace) keeps state in parent; shell does **not** dual-write controlled mode.

---

## 3. Workspace owner — `OOPlannerWorkspace.tsx`

**File:** `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx`

| Concern | Lines | Behavior |
|---------|-------|----------|
| State | 184 | `useState<"2d" \| "3d">("2d")` — default **2D**. |
| Keyboard / palette toggle | 347–349 | `toggleView` flips 2d↔3d. |
| Shell wiring | 849–850 | `viewMode={viewMode}` + `onViewModeChange={setViewMode}`. |
| Canvas branch | 964+ | `{viewMode === "2d" ? (…FeasibilityCanvas…) : (…3D…)}`. |

```184:184:site/features/planner/open3d/editor/OOPlannerWorkspace.tsx
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");
```

```347:349:site/features/planner/open3d/editor/OOPlannerWorkspace.tsx
  const toggleView = useCallback(() => {
    setViewMode((current) => (current === "2d" ? "3d" : "2d"));
  }, []);
```

```849:850:site/features/planner/open3d/editor/OOPlannerWorkspace.tsx
        viewMode={viewMode}
        onViewModeChange={setViewMode}
```

```964:964:site/features/planner/open3d/editor/OOPlannerWorkspace.tsx
        {viewMode === "2d" ? (
```

**End-to-end click path (product):**

1. Buyer clicks TopBar radio labeled `3D`  
2. `onViewModeChange?.("3d")` → shell `handleViewModeChange` → workspace `setViewMode("3d")`  
3. Re-render: TopBar `aria-checked` flips; canvas region swaps 2D ↔ 3D branch  

Keyboard path: `useWorkspaceKeyboard` / palette `toggleView` → same `setViewMode` flip (lines 748, 770 area).

---

## 4. E2E selector honesty (open3d-w4)

**File:** `site/tests/e2e/open3d-w4-orbit-continuity.spec.ts` (pre-harden)

Previously used bare:

```ts
page.getByRole("radio", { name: "3D", exact: true })
page.getByRole("radio", { name: "2D", exact: true })
```

| Assessment | Note |
|------------|------|
| **Correct role** | Matches product `role="radio"` (not `button` — legacy planner-chrome still uses button, wrong for open3d). |
| **Correct name** | Matches visible text `2D`/`3D`. |
| **Fragility** | Unscoped page-level radio search; repeated 4× inline; no wait for `aria-checked`. |

### Harden (this seat only)

**Helpers only** in `site/tests/e2e/plannerCanvasHelpers.ts`:

| Export | Purpose |
|--------|---------|
| `VIEW_MODE_RADIOGROUP_NAME` | `"View mode"` — matches TopBar `aria-label`. |
| `VIEW_MODE_2D_NAME` / `VIEW_MODE_3D_NAME` | `"2D"` / `"3D"`. |
| `PlannerViewMode` | `"2d" \| "3d"` (no `any`). |
| `plannerViewModeRadio(page, mode)` | Radiogroup-scoped radio locator. |
| `switchPlannerViewMode(page, mode)` | Click + `toBeChecked`. |

W4 spec updated to call `switchPlannerViewMode` instead of raw selectors.

**Out of scope for this seat:** other specs still using bare radio/button; unit pack; browser re-prove green/red claim.

---

## 5. Unit coverage pointers (not re-run by this seat)

- `workspaceShell.test.tsx` ~529–531: radiogroup `"View mode"` + radio `"3D"` → `onViewModeChange("3d")`.
- `TopBar.a11y.test.tsx`: Focus/Prefs label-in-name; requires `viewMode` prop, does not deep-test radios.

---

## 6. Honest status

| Claim | Status |
|-------|--------|
| Product radiogroup wiring understood with line cites | **YES** (this doc) |
| E2E helpers hardened for 2D\|3D radio | **YES** (helpers + W4 wired) |
| W4 browser gate green | **NOT claimed** — other seats own browser evidence |
| Overall P04 PASS | **NOT claimed** |

**NO PAPER MOON:** audit + helper only; units/browser not re-proven here.
