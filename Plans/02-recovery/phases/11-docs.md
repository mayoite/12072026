# 11 Docs

Goal: make docs match repaired truth.

## Modules

- Plans.
- Docs.
- Package docs.
- Failure docs.

## Allowed Scope

1. `Plans`
2. `docs`
3. `Readme.md`
4. `START.md`
5. `Failures.md`
6. `PACKAGES.md`

## Hard No-Go Scope

1. Locked copies unless intentionally syncing.
2. Deleting historical evidence.
3. Claiming checks passed without logs.

## Initial Checks

```powershell
pnpm run docs:check:root-links
rg -n "passed|green|deployable|complete|fixed|TODO|Grok|gpt5.5|oandO04072026" Plans docs Readme.md START.md Failures.md PACKAGES.md
```

## Exit Evidence

1. Root link check.
2. Claim audit.
3. Docs updated.
4. Known stale docs left behind.

## Stop Conditions

1. Doc conflicts need product decision.
2. Locked and live docs disagree.
3. Evidence is missing.
