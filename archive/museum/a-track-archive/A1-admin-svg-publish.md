# A1 — Admin SVG publish E2E

> **Track:** A1 only · **CP/spine:** P0.1 · **Status:** DONE (spine — not full product)

## Done when (met)

1. Dev auth bypass documented and dev-only (`DEV_AUTH_BYPASS`).
2. Playwright: list → editor → publish API 200 → SVG bytes on disk.
3. Evidence under `results/planner/p0-1-admin-svg-publish/`.

## Proof

| Artifact | Path |
|----------|------|
| Owner summary | [`ayushdocs/13-P0-1-DONE.md`](../../ayushdocs/13-P0-1-DONE.md) |
| Screenshots + JSON | `results/planner/p0-1-admin-svg-publish/` |
| Spec | `site/tests/e2e/admin-svg-publish-p01.spec.ts` |

## Run again

```powershell
cd site
pnpm run dev
# other terminal:
$env:PLAYWRIGHT_BASE_URL='http://localhost:3000'
pnpm run test:e2e:p0-admin-svg
```

## Not in scope for A1

- Full catalog SVG count on disk (A2).
- Production SSO / multi-tenant admin (A3).
- Planner place journey (P-track).

**Next A slice:** [A2-svg-pipeline.md](./A2-svg-pipeline.md)
