# 00b Contradiction Register

Goal: register contradictions before fixes.

No implementation starts until this phase is complete.

## Entry Condition

1. Phase 00 is complete.
2. Branch, commit, dirty state, and blockers are recorded.

## Allowed Scope

1. Read docs.
2. Read manifests.
3. Update contradiction notes in recovery docs.

## Hard No-Go Scope

1. Runtime code edits.
2. Package changes.
3. Test repairs.
4. Style repairs.

## Initial Checks

```powershell
rg -n "INSTALLING NOW|latest|passed|green|deployable|complete|fixed|oandO04072026|open3d-next-staging|Code Connect|SVGR|sprite|lint:ui:strict" PACKAGES.md Plans docs Readme.md START.md Failures.md
```

## Contradiction Table

| Field | Required |
| --- | --- |
| Claim | Exact claim |
| File | Path |
| Conflict | What disagrees |
| Local proof | Command or missing |
| Decision | Fix now, defer, or refuse |
| Owner | Module |

## Artifact Path

```text
results/repo/00b-contradiction-register/claim-audit/claim-audit-run.json
results/repo/00b-contradiction-register/claim-audit/claim-audit-raw.log
```

## Exit Evidence

1. Contradiction table.
2. Claims treated as signal only.
3. Claims safe to use.
4. Claims blocked.

## Stop Conditions

1. Package state is contradictory.
2. SVG authority is contradictory.
3. Strict UI gate timing is contradictory.
4. Old repo claims are being used as local proof.
