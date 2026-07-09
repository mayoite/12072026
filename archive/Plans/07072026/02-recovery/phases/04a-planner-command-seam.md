# 04a Planner Command Seam

Goal: repair or prove the planner command seam.

## Allowed Scope

1. `site/features/planner/open3d/lib/commands`
2. Direct command wiring callers
3. Direct command tests

## Hard No-Go Scope

1. Persistence rewrite.
2. Viewer rewrite.
3. SVG pipeline changes.
4. Legacy planner paths.

## Boundary Standard

Fabric, Three, React Three Fiber, browser APIs, and storage must not leak into Server Components.

## Initial Checks

```powershell
rg -n "PlannerCommand|executePlannerCommand|dispatchOpen3dAction|useWorkspaceCanvas" site/features/planner/open3d site/app/planner
```

## Artifact Path

```text
results/planner/04a-planner-command-seam/command-seam/command-seam-run.json
results/planner/04a-planner-command-seam/command-seam/command-seam-raw.log
```

## Exit Evidence

1. Command seam owner.
2. Direct dispatch allowlist.
3. Remaining command wiring failures.

## Stop Conditions

1. Fix crosses into persistence or viewer.
2. Command model is unclear.
3. Server/client boundary leaks.
