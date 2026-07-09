# Test Writer 2/2 — Commands palette trigger aria-label contract

**Date:** 2026-07-09  
**Checkout:** `D:\OandO07072026`  
**Bar:** Elon standard — real RTL behavior, not source snapshot / CSS class presence.

## Goal

Contract: Commands palette trigger **accessible name** contains **"Commands"** (WCAG 2.5.3 label-in-name).

## Production surface (grep)

`OOPlannerWorkspace` statusRight used:

```tsx
aria-label="Commands (Ctrl+K)"
```

with visible text `Commands (Ctrl+K)` / short `Commands`.

Extracted to production component (not test-only export):

- `site/features/planner/open3d/editor/CommandsPaletteTrigger.tsx`
- Wired from `OOPlannerWorkspace.tsx` → `statusRight={<CommandsPaletteTrigger onOpen={…} />}`

## TDD

| Phase | Evidence |
|-------|----------|
| **RED** | Import missing → suite fail (`vitest-red.log`) |
| **GREEN** | RTL `getByRole("button", { name: /Commands/i })` + `aria-label` contains `"Commands"` + click fires `onOpen` (`vitest-green.log`) |

## Test added

| File | Assertion |
|------|-----------|
| `site/tests/unit/features/planner/open3d/commandsPaletteTrigger.a11y.test.tsx` | Accessible name + `aria-label` contain `Commands`; click → `onOpen` once |

Pattern mirrors `TopBar.a11y.test.tsx` (Focus/Prefs label-in-name).

## Vitest result (green)

Command:

```text
pnpm exec vitest run \
  tests/unit/features/planner/open3d/commandsPaletteTrigger.a11y.test.tsx \
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx \
  --reporter=verbose
```

| Metric | Count |
|--------|------:|
| Test files passed | **2** |
| **Tests passed** | **9** |
| Failed | **0** |
| New tests this slice | **1** |

Logs:

- `vitest-red.log` — expected fail before component
- `vitest-green.log` — 9/9 pass
- `vitest-workspace-nonreg.log` — OOPlannerWorkspace TDD still green after wire

## Why real (not hollow)

- Asserts **DOM accessible name** via `getByRole` (not `readFile` of source).
- Asserts **`aria-label` string contains `"Commands"`** (label-in-name contract).
- Asserts **click opens** via `onOpen` handler (behavior, not class name).
- Production component is the same control `OOPlannerWorkspace` mounts — no parallel fake button in the test.

## Pass count (return)

**9** tests passed in the green run (1 new contract + 8 keyboard nonreg).  
**1** new contract test in this slice.
