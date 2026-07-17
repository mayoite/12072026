# STRONG-W1 Save state

## Summary

Single authoritative save UI map in `workspaceStatusLabels.ts`. TopBar is the only save CTA + short status. No dual "Saving…" + "Saving locally…" on the same chrome.

## Before / after

| Surface | Before (benchmark FAIL) | After |
|---------|-------------------------|--------|
| State source | Ad-hoc pill strings + separate button strings + toast verbs | ONE map: `resolvePlannerSaveChrome` → `uiState` + `buttonLabel` + `statusLabel` |
| Saving | Pill **Saving locally…** + button **Saving…** (dual) | Button **Saving…** only; pill **Local** / **Account** (storage, no Saving verb) |
| Dirty | **Unsaved changes** essay + **Save draft** | Pill **Unsaved**; button **Save** / **Save draft** |
| Idle | **Ready (local)** / **Guest session (local)** | **Ready · local** / **Guest · local** |
| Saved | **Saved locally** / **Draft saved locally** | **Saved local** / **Draft local** (never bare `Saved`) |
| Error | **Local save failed** + Retry | **Save failed** + **Retry save** |
| Offline | `Offline · …` prefix | Same prefix; `data-ui-state="offline"` |
| Status bar | Already no save chrome | Locked: `data-save-authority="topbar"`; no save verbs in footer |

### Documented label table (local default)

| uiState | Button (guest) | Button (member) | Short status |
|---------|----------------|-----------------|--------------|
| idle | Save draft | Save | Guest · local / Ready · local |
| dirty | Save draft | Save | Unsaved |
| saving | Saving… | Saving… | Local |
| saved | Save draft | Save | Draft local / Saved local |
| error | Retry save | Retry save | Save failed |
| offline | (base CTA) | (base CTA) | Offline or Offline · {base} |

Persistence `data-status` stays `idle \| unsaved \| saving \| saved \| error` (e2e-compatible). UI map adds `dirty` (alias of unsaved) and `offline` (connection overlay).

## Files owned (written)

| Path | Change |
|------|--------|
| `site/features/planner/editor/workspaceStatusLabels.ts` | Single map: `PlannerSaveUiState`, `resolvePlannerSaveChrome`, button + status |
| `site/features/planner/editor/TopBar.tsx` | Uses chrome resolver; `data-ui-state`; button from map only |
| `site/tests/unit/features/planner/editor/workspaceStatusLabels.test.ts` | Locks one map + no dual Saving |
| `site/tests/unit/features/planner/TopBar.saveStatus.test.tsx` | Dual-Saving lock; dirty one label; saving one Saving |
| `site/tests/unit/features/planner/editor/TopBar.test.tsx` | Guest idle string update |
| `site/tests/unit/features/planner/editor/WorkspaceShell.test.tsx` | Status bar no competing save verbs |
| `site/tests/unit/features/planner/workspaceStatusLabels.test.ts` | Legacy mirror aligned to short map |
| `site/tests/unit/features/planner/workspaceShell.test.tsx` | Expect **Unsaved** not essay |

Not edited: `OOPlannerWorkspace.tsx` (forbidden), `workspace.module.css` (not needed).

## Evidence (this session)

### Unit — owned save suite

```text
pnpm --filter oando-site exec vitest run \
  tests/unit/features/planner/editor/workspaceStatusLabels.test.ts \
  tests/unit/features/planner/editor/TopBar.test.tsx \
  tests/unit/features/planner/TopBar.saveStatus.test.tsx
```

**Exit 0** — 32 tests passed.

### Unit — related mirror + guest gate

```text
pnpm --filter oando-site exec vitest run \
  tests/unit/features/planner/editor/workspaceStatusLabels.test.ts \
  tests/unit/features/planner/editor/TopBar.test.tsx \
  tests/unit/features/planner/TopBar.saveStatus.test.tsx \
  tests/unit/features/planner/workspaceStatusLabels.test.ts \
  tests/unit/features/planner/workspaceShell.test.tsx \
  tests/unit/features/planner/persistence/topBarGuest.test.tsx
```

**Exit 0** — 100 tests passed.

### Layout

```text
pnpm run check:layout
```

**Exit 0** — `check-repo-layout OK`.

### Browser

**OPEN** — no Playwright/DevTools run this session.

Residual browser proof required:

1. Guest planner `/planner/guest/` at **1440** and **390**.
2. Dirty plan → pill shows **Unsaved** only once; button **Save draft**; no **Unsaved changes** essay.
3. Click save → button **Saving…** only; pill **Local** (not **Saving locally…**); no dual Saving verbs in TopBar.
4. After flush → pill **Draft local** / **Saved local**; `data-status="saved"`.
5. Bottom status bar has no Save / Unsaved / Saving copy (`data-save-authority="topbar"`).
6. Optional: offline → `data-ui-state="offline"`, Offline prefix.

Unit proves the map and TopBar composition. Unit does **not** prove phone/desktop chrome composition or toast coexistence with live autosave.

## Residuals (brutal OPEN)

1. **Browser UI PASS not claimed** — see steps above.
2. **OOPlannerWorkspace toast** still sets `Saving draft locally…` / `Draft saved locally` on explicit save (`handleSave`). Toast can briefly reintroduce a second Saving phrase next to the button. Fix needs OOPlanner edit (out of exclusive OWN this ticket).
3. **WorkspaceShell editor panel tests** (`left panel title is Inventory`, `floating panel…`) fail when docked layout is missing from the tree (localStorage / docking isolation). Unrelated to save map; save-authority test in same file **passes**.
4. No commit (per instruction).

## Module status

| Bar | Result |
|-----|--------|
| Single enum/map | PASS (unit) |
| One CTA + short status | PASS (unit) |
| No dual Saving | PASS (unit) |
| Status bar no save verbs | PASS (unit) |
| Browser 1440/390 | **OPEN** |
| Toast dual residual | **OPEN** |
