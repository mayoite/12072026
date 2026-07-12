# PHASE-11 — Theme mount

**Parallel:** yes · **Blocks on:** Planner P02 · **Proof:** live browser + unit tests

---

## Outcome

A visible live control switches light and dark modes across the workspace without mutating document geometry.

## Steps

1. Mount `PlannerThemeToggle` in workspace chrome (`components/PlannerThemeToggle.tsx`).
2. Preference survives reload. First paint does not flash the wrong theme.
3. Toolbar, panels, Fabric, Three, tooltips, forms, and native controls all change.
4. Theme changes never mutate document colors, IDs, pose, or saved geometry.
5. Contrast, focus, selected, disabled, hover, and error states pass in both themes at desktop and 375×812.

## Done when

Boxes in `plan/Planner/CHECKLIST.md` → PHASE-11.

## How to prove

```bash
pnpm --filter oando-site exec vitest run tests/unit/features/planner/components/PlannerThemeToggle.test.tsx --reporter=verbose
pnpm --filter oando-site exec vitest run tests/unit/features/planner/editor/toolShortcutTruth.test.ts tests/unit/features/planner/editor/canvasToolRail.a11y.test.ts --reporter=verbose
```

Browser: toggle theme on `/planner/guest`, reload, confirm parity on 2D and 3D surfaces. Screenshots both themes.

Report → `agents-work/reports/planner-phase-11.md`. Raw artifacts → `results/planner/phase-11/`.

## Guardrails

- One `canvasTool.ts` map still drives toolbar authority. RAC + Phosphor unchanged.