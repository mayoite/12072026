# 02b Site UI Baseline

Goal: create a route-by-route site UI baseline only when it blocks current repair or release proof.

This is not a polish phase.

This phase is conditional and timeboxed.

## Entry Condition

Run only after Phase 02 has:

1. Token map.
2. TSX boundary rules.
3. Design intake rules.
4. `lint:ui` result or known blocker.
5. A stated reason why Site UI blocks current work.

## Modules

- Site UI.
- Marketing routes.
- Site chrome.
- Shared presentational components.

## Allowed Scope

1. `site/app/(site)`
2. `site/components`
3. `site/lib/site-data`
4. Site UI tests
5. Site UI docs

## Hard No-Go Scope

1. Broad visual redesign.
2. Planner product UI.
3. Admin product UI.
4. Hardcoded TSX styling.
5. New design-tool package adoption.

## Baseline Matrix

Record one row per route:

| Field | Required |
| --- | --- |
| Route | URL path |
| Owner | Site UI, marketing, or shared chrome |
| Data source | `site-data`, route config, or other |
| Visual reference | Screenshot or written baseline |
| A11y signal | Command or skipped reason |
| Console signal | Command or skipped reason |
| Drift | None, minor, major, or blocked |
| Decision | Fix, defer, or refuse |

## Initial Checks

```powershell
rg -n "export default|metadata|generateMetadata" "site/app/(site)" site/components site/lib/site-data
```

Run browser checks only when the server and env are ready.

## Artifact Path

```text
results/site-ui/02b-site-ui-baseline/route-inventory/route-inventory-run.json
results/site-ui/02b-site-ui-baseline/route-inventory/route-inventory-raw.log
```

## Exit Evidence

1. Route inventory.
2. Visual references.
3. Accessibility result or skipped reason.
4. Console artifact or skipped reason.
5. Drift list.

## Stop Conditions

1. Styling contract is not stable.
2. Dev server or env blocks browser proof.
3. Fix would become page polish.
4. Route data source is unclear.
5. Inventory exceeds the timebox without a blocker decision.
