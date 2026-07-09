# 04e Planner Browser Journey

Goal: prove the hard Open3D browser journey.

No "planner repaired" claim without this phase or an explicit skipped reason.

## Entry Condition

1. Command seam blocker is resolved or documented.
2. Persistence/JSON blocker is resolved or documented.
3. Viewer boundary blocker is resolved or documented.
4. SVG consumer blocker is resolved or documented.
5. Dev server and env are ready.

## Allowed Scope

1. Browser journey proof.
2. Console capture.
3. Evidence recording.
4. Small scoped fixes only if explicitly in scope.

## Hard No-Go Scope

1. Broad UI polish.
2. Hidden console suppression.
3. Forced clicks as a repair.
4. Ignoring failed network requests.

## Journey

1. Open planner.
2. Edit.
3. Undo.
4. Save.
5. Reload.
6. Export.
7. Verify console output.

## Artifact Path

```text
results/planner/04e-planner-browser-journey/browser-journey/browser-journey-run.json
results/planner/04e-planner-browser-journey/browser-journey/browser-journey-raw.log
```

## Exit Evidence

1. Browser route.
2. Console artifact.
3. Network failure artifact.
4. Screenshot or trace if available.
5. Pass, fail, skipped, or incomplete.

## Stop Conditions

1. Dev server cannot start.
2. Env blocks save/load proof.
3. Console capture is missing.
4. Journey crosses out of planner scope.
