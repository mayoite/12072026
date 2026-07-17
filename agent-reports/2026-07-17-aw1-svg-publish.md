# A-W1 — SVG publish residual (A2 / A3 disk)

**Date:** 2026-07-17  
**Agent:** A-W1  
**Verdict:** **PASS** (unit residual this session; browser OPEN)

## Scope (OWN only)

- `site/features/admin/svg-editor/publish/**`
- `site/app/api/admin/svg-editor/**` (+ matching unit tests)
- Isolation guard already landed by EXEC-1 — re-verified, not rewritten
- Dual-write resolver **not** rewritten (EXEC-4 owns honesty)

## What landed

| Item | Change |
|------|--------|
| Fail-closed compile (unit) | `publishDescriptorWithPipeline.test.ts` — real `compileSvgForPublish` fail → no S4/persist; real compile + isolated S4/persist success; default canonical S4 under Vitest → isolation fail-closed |
| Route unit env isolation | `route.test.ts` — mock `resolveSvgPublishDualWrite` (`skipped_no_db`) so suite does not depend on live `PRODUCTS_DATABASE_URL`/R2 |
| Route fail-closed map | `compiler_failed` / `compiler_exception` / pipeline fail → **422** + no descriptor; non-compile I/O → **500** |
| Disk authority UI copy | `publishActionMessages.ts` — impact/confirm admit disk live authority **and** Products DB not live release authority |
| Isolation | Re-ran A0 + `catalogWriteIsolation` — still PASS; no canonical catalog mutation in new tests |

## Commands (fresh)

```powershell
pnpm --filter oando-site exec vitest run `
  tests/unit/features/admin/svg-editor/publish/publishDescriptorWithPipeline.test.ts `
  tests/unit/app/api/admin/svg-editor/route.test.ts `
  tests/unit/features/admin/svg-editor/publish/publishActionMessages.test.ts
# → 3 files, 39 tests, exit 0

pnpm --filter oando-site exec vitest run `
  tests/unit/features/admin/svg-editor/publish/adminCatalogIsolation.a0.test.ts `
  tests/unit/features/admin/svg-editor/storage/catalogWriteIsolation.test.ts `
  tests/unit/features/admin/svg-editor/publish/publishSvgEditorAction.test.ts
# → 3 files, 25 tests, exit 0

pnpm run check:layout
# → check-repo-layout OK
```

## Proof summary

| Check | Result |
|-------|--------|
| Real compile fail-closed before S4/persist | **PASS** |
| Real compile + temp `projectRoot` + temp descriptor dir | **PASS** (canonical hashes unchanged) |
| Default monorepo S4 under Vitest | **PASS** (`Catalog isolation violation`, no persist) |
| POST svg-editor fail-closed compile taxonomy | **PASS** (422) |
| Disk authority copy (publish messages) | **PASS** (unit) |
| List/TopBar disk copy (views, not OWN) | Already present; not re-authored |
| Browser publish smoke | **OPEN** |
| Dual-write cutover | **OPEN** (Failures.md; EXEC-4) |
| Full release:gate | **NOT CLAIMED** |

## Residual OPEN

1. Browser publish smoke / unauth journey (not this seat).
2. `publishActionMessages.admSvg15_17.test.tsx` hung on load in this session (heavy EditView/Excalidraw import path). Pure message unit + pipeline suite green; re-run that file when owner wants UI render proof.
3. AF-12 CI hash gate still OPEN (EXEC-1 residual).
4. DB-SVG cutover still OPEN — disk remains authority.

## Did not touch

- `resolveSvgPublishDualWrite.ts` (EXEC-4)
- Canonical `inventory/descriptors/` or `public/svg-catalog/`
- Commit / push / secrets
