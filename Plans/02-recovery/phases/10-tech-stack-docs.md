# 10 Tech-Stack Docs

Goal: regenerate docs only after source truth stabilizes.

## Modules

- Tech-stack generator.
- Generated tech-stack docs.

## Allowed Scope

1. `site/tech-stack-generator`
2. `site/tech-stack-docs`
3. Generated docs

## Hard No-Go Scope

1. Hand-editing generated outputs as source truth.
2. Regenerating before package and source truth stabilize.

## Initial Commands

```powershell
pnpm run docs:check:tech-stack
pnpm run docs:sync:tech-stack
pnpm run docs:gate:tech-stack
```

## Artifact Path

```text
results/tech-stack-docs/10-tech-stack-docs/<cmd>/<cmd>-run.json
results/tech-stack-docs/10-tech-stack-docs/<cmd>/<cmd>-raw.log
```

## Source Truth Manifest

Before regeneration, record:

| Field | Required |
| --- | --- |
| Source module | Package, CSS, admin, planner, auth, DB, CRM, CDN, deploy |
| Truth source | Live code, command, or doc |
| Last evidence | Artifact path or missing |
| Safe to generate | Yes, no, or defer |

Generated docs must not become source truth.

## Exit Evidence

1. Generator check result.
2. Sync result.
3. Gate result.
4. Unrelated churn list.
5. Source-truth manifest.

## Stop Conditions

1. Generator output conflicts with source truth.
2. Link checks fail broadly.
3. Regeneration includes unrelated churn.
4. Source truth is missing.
