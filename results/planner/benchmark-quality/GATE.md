# Gate — console capture + open3d pack

**Date:** 2026-07-09  
**Verdict:** **GREEN**  
**BASE_URL / PLAYWRIGHT_BASE_URL:** `http://localhost:3000`

---

## Summary

| Check | Result | Evidence |
|-------|--------|----------|
| Console capture (`capture-planner-console.mjs`) | **GREEN** | exit **0**, `zeroConsoleErrors: true` |
| Zero app 404s for `proof-chair` / `placeholder-cabinet` | **GREEN** | both **200**; `app404s: []` |
| `pnpm gate:open3d` (typecheck + world e2e pack) | **GREEN** | exit **0**, **5/5** passed, `run.json` status **PASS** |

**Overall: GREEN**

---

## 1. Console capture

```powershell
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
$env:BASE_URL = "http://localhost:3000"
node scripts/capture-planner-console.mjs   # cwd: site/
```

| Field | Value |
|-------|--------|
| `capturedAt` | `2026-07-09T18:23:47.918Z` |
| `errorCount` | **0** |
| `warningCount` | **0** |
| `failedRequestCount` | 1 (non-asset abort) |
| `zeroConsoleErrors` | **true** |
| process exit | **0** |

**Artifact:** [`console-capture.json`](./console-capture.json)  
**Screenshots:** `01-open3d-console-capture.png`, `02-guest-console-capture.png`

**Non-blocking note:** one `requestfailed` for `/_next/static/chunks/main-app.js … | net::ERR_ABORTED` (navigation abort during route switch; not a console error, not a catalog-asset 404).

---

## 2. proof-chair / placeholder-cabinet — zero app 404s

Direct HTTP:

| URL | Status |
|-----|--------|
| `http://localhost:3000/proof-chair.svg` | **200** |
| `http://localhost:3000/placeholder-cabinet.svg` | **200** |

On-disk (served from `site/public/`):

| File | Bytes |
|------|-------|
| `site/public/proof-chair.svg` | 472 |
| `site/public/placeholder-cabinet.svg` | 432 |

Browser network sample on `/planner/open3d/?plannerDevTools=1` (+ optional 3D radio):

| Field | Value |
|-------|--------|
| `proof-chair.svg` | **200** |
| `placeholder-cabinet.svg` | **200** |
| `app404s` | **[]** |
| `zeroTargetAsset404s` | **true** |
| `zeroApp404s` | **true** |

**Artifact:** [`asset-404-check.json`](./asset-404-check.json) (`capturedAt` `2026-07-09T18:23:39.448Z`)

**Requirement met:** zero app 404s for proof-chair / placeholder-cabinet.

---

## 3. `gate:open3d`

```powershell
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
pnpm gate:open3d   # repo root → typecheck + test:e2e:open3d-world
```

| Step | Result |
|------|--------|
| `tsc -p tsconfig.json --noEmit` | **PASS** (exit 0) |
| open3d world e2e pack | **PASS** exit **0**, **5 passed (58.8s)** |

| Spec | Result |
|------|--------|
| `open3d-save-honesty.spec.ts` | ✓ |
| `open3d-systems-v0-batch-place.spec.ts` | ✓ |
| `open3d-w3-select-delete.spec.ts` | ✓ |
| `open3d-w4-orbit-continuity.spec.ts` | ✓ |
| `open3d-world-standard-journey.spec.ts` | ✓ |

**Artifacts:**

- `results/planner/world-standard-wave/gate-e2e/run.json` — `exitCode: 0`, `status: "PASS"`
- `results/planner/world-standard-wave/gate-e2e/playwright-raw.log` — `5 passed (58.8s)`
- Window: `startedAt` `2026-07-09T18:22:16.530Z` → `endedAt` `2026-07-09T18:23:19.064Z`

---

## Red flags / residual noise (not gate-fail)

1. RSC / chunk `ERR_ABORTED` during multi-route capture — common with Next client navigations; not counted as console error.
2. Prior capture at `18:19Z` had a generic console 404 before assets were live; **superseded** by `18:23Z` green run.
3. Concurrent agents may rewrite `console-capture.json`; this GATE cites the **fresh** timestamps above.

---

## Verdict

| Gate slice | Color |
|------------|-------|
| Console capture | **GREEN** |
| Asset 404s (proof-chair / placeholder-cabinet) | **GREEN** |
| `gate:open3d` pack | **GREEN** |
| **ROLLUP** | **GREEN** |
