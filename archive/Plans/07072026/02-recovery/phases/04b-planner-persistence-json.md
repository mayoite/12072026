# 04b Planner Persistence And JSON

Goal: repair or prove persistence and JSON round trip.

## Allowed Scope

1. `site/features/planner/open3d/persistence`
2. `site/features/planner/open3d/shared`
3. Direct persistence and JSON tests

## Hard No-Go Scope

1. DB migrations.
2. Auth provider changes.
3. Viewer rewrite.
4. Legacy planner paths.

## Boundary Standard

Storage and browser APIs stay client-side or behind explicit server boundaries.

Server mutations require auth proof from Phase 02c, 05, or 06.

## Initial Checks

```powershell
rg -n "save|load|autosave|jsonExport|guestPromotion|memberPlanRepository|localStorage|indexedDB" site/features/planner/open3d site/tests
```

## Artifact Path

```text
results/planner/04b-planner-persistence-json/persistence-json/persistence-json-run.json
results/planner/04b-planner-persistence-json/persistence-json/persistence-json-raw.log
```

## Exit Evidence

1. Save/load owner.
2. JSON round-trip result.
3. Data-loss risk.
4. Auth/DB dependency.

## Stop Conditions

1. Migration is needed.
2. Auth behavior is unknown.
3. DB ownership is unknown.
4. Guest/member boundaries are unclear.
